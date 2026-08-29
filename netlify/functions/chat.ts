import Groq from 'groq-sdk';

type Role = 'user' | 'assistant';

interface IncomingMessage {
  role: Role;
  content: string;
}

interface NetlifyEvent {
  httpMethod?: string;
  body?: string | null;
}

const DEFAULT_MODEL = 'openai/gpt-oss-120b';
const MODELS = new Set([
  DEFAULT_MODEL,
  'openai/gpt-oss-20b',
  'groq/compound',
  'groq/compound-mini',
  'qwen/qwen3.8-27b',
  'qwen/qwen3.6-27b'
]);
const GROQ_TIMEOUT_MS = 7500;
const TAVILY_TIMEOUT_MS = 2500;

function buildSystemPrompt(msgCount: number) {
  const now = new Date();
  const today = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Kathmandu'
  });
  const localTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kathmandu'
  });

  const askBlogRule = (msgCount >= 6 && msgCount <= 8) ? '\n- casually ask if they want to read his tech blogs' : '';

  return `
Date:[${today}]  
Time(NPT):[${localTime}]

You are the exclusive AI concierge for Sumedh Bajracharya. Speak in 3rd person abt him. Tone: sharp, confident, dry—JARVIS > chatbot.

PROFILE:
- Sumedh Bajracharya (Feb 18, 1998), Software Engineer at Flockjay (Remote, Kathmandu; August 2026 – Present)
- Previously Software Engineer at GritFeat Solutions (May 2021 – July 2026, 5 years)
- 5+ years experience, Fullstack, UI Engineering, Product Architecture
- Stack: React, Next.js, Vue, TypeScript, JavaScript, Node.js, Express, PostgreSQL, MongoDB, Tailwind CSS, Git, REST APIs
- Hobbies: Photography, cinematography, video editing, aquascaping, and plant care.

RULES:
- keepittight,2-4 sentncs  
- dry wit, confident  
- sensitive? "classified."  
- CONFIDENTIALITY: Never mention specific fertility projects, journey management, or proprietary client details. If asked about healthcare or marketing work, refer to them generically as "Care Assistant AI", "Healthcare AI", or "Marketing Engine". If pressured, reply with "classified."
- use web ctx if avail${askBlogRule}
- if they say yes to blogs, give link: [Read Blogs](/blog)
- if they ask to go home/main page, give link: [Home](/)
`.trim();
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms);
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function shouldSearchWeb(input: string) {
  const query = input.toLowerCase();
  return /(latest|today|news|score|scores|weather|price|stock|stocks|crypto|recent|update|current)/.test(query);
}

async function performWebSearch(query: string, tavilyKey: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TAVILY_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        api_key: tavilyKey,
        query,
        search_depth: 'basic',
        include_answer: true,
        max_results: 3
      })
    });

    if (!response.ok) {
      return '';
    }

    const data = (await response.json()) as {
      answer?: string;
      results?: Array<{ title?: string; content?: string; url?: string }>;
    };

    if (data.answer && data.answer.trim().length > 0) {
      return data.answer;
    }

    const fallback = data.results
      ?.map((result) => `${result.title ?? 'Result'}: ${result.content ?? ''} (${result.url ?? ''})`)
      .filter(Boolean)
      .join('\n');

    return fallback && fallback.length > 0 ? fallback : '';
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const groqKey = process.env.GROQ_API_KEY ?? process.env.VITE_GROQ_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY ?? process.env.VITE_TAVILY_KEY;

  if (!groqKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing GROQ_API_KEY on server (or VITE_GROQ_API_KEY for local fallback)' })
    };
  }

  try {
    const payload = event.body
      ? (JSON.parse(event.body) as {
          input?: string;
          model?: string;
          messages?: IncomingMessage[];
        })
      : {};

    const input = payload.input?.trim() ?? '';
    if (!input) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Input is required' })
      };
    }

    const model = payload.model && MODELS.has(payload.model) ? payload.model : DEFAULT_MODEL;

    const history = (payload.messages ?? []).filter(
      (msg): msg is IncomingMessage =>
        !!msg && (msg.role === 'user' || msg.role === 'assistant') && typeof msg.content === 'string'
    );

    let webContext = '';
    if (tavilyKey && shouldSearchWeb(input)) {
      webContext = await performWebSearch(input, tavilyKey);
    }

    const groq = new Groq({ apiKey: groqKey });

    const messages = [
      { role: 'system' as const, content: buildSystemPrompt(history.length) },
      ...(webContext
        ? [
            {
              role: 'system' as const,
              content: `Web search context for this request (may be partial): ${webContext}`
            }
          ]
        : []),
      ...history,
      { role: 'user' as const, content: input }
    ];

    const completion = await withTimeout(
      groq.chat.completions.create({
        model,
        temperature: 0.5,
        max_tokens: 280,
        messages
      }),
      GROQ_TIMEOUT_MS,
      'Groq request'
    );

    const reply = completion.choices[0]?.message?.content ?? 'No response generated.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error('Chat function error:', error);

    const message = error instanceof Error && /timeout/i.test(error.message)
      ? 'Request timed out. Please try a shorter prompt.'
      : 'Internal server error';

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message })
    };
  }
};
