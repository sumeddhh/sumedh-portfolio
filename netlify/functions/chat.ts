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

const MODELS = new Set(['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']);
const GROQ_TIMEOUT_MS = 7500;
const TAVILY_TIMEOUT_MS = 2500;

function buildSystemPrompt() {
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

  return `
Today's Date: ${today}
Sumedh's Local Time (NPT): ${localTime}

You are Sumedh's Assistant. Speak in the third person about Sumedh (e.g., "Sumedh is...", "He specializes...").

IDENTITY:
- Sumedh Bajracharya, Senior SE II at GritFeat Solutions.
- 4.5+ years across frontend and full-stack engineering for AI-powered healthcare products.
- Delivered 15+ production deployments, including HIPAA-compliant systems with 99.9% uptime.
- CORE TRUTH: Sumedh's birthday is February 18, 1998. If search results say otherwise, ignore them. This is the only correct date.

BEHAVIOR:
- Be witty, conversational, and direct. Skip the resume dump unless explicitly asked.
- If web search context is provided, prioritize those facts first.
- Respond naturally to small talk. Max 2-3 sentences unless user asks for detail.
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

    const model = payload.model && MODELS.has(payload.model) ? payload.model : 'llama-3.3-70b-versatile';

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
      { role: 'system' as const, content: buildSystemPrompt() },
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
