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
- REAL-TIME FACTS: If asked about things you don't know (news, sports, specific real-time data), use the web_search tool.
- SEARCH REPORTING: If a search result is provided, report those specific facts first, then add persona style.
- PERSONALITY: Respond naturally to small talk. Max 2-3 sentences.
`.trim();
}

async function performWebSearch(query: string, tavilyKey: string) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: tavilyKey,
      query,
      search_depth: 'basic',
      include_answer: true,
      max_results: 3
    })
  });

  if (!response.ok) {
    return 'Error performing search.';
  }

  const data = (await response.json()) as {
    answer?: string;
    results?: Array<{ content?: string }>;
  };

  if (data.answer && data.answer.trim().length > 0) {
    return data.answer;
  }

  const fallback = data.results
    ?.map((result) => result.content ?? '')
    .filter(Boolean)
    .join('\n\n');

  return fallback && fallback.length > 0 ? fallback : 'No results found.';
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
    const payload = event.body ? (JSON.parse(event.body) as {
      input?: string;
      model?: string;
      messages?: IncomingMessage[];
    }) : {};

    const input = payload.input?.trim() ?? '';
    if (!input) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Input is required' })
      };
    }

    const model = payload.model && MODELS.has(payload.model)
      ? payload.model
      : 'llama-3.3-70b-versatile';

    const history = (payload.messages ?? []).filter(
      (msg): msg is IncomingMessage =>
        !!msg &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string'
    );

    const groq = new Groq({ apiKey: groqKey });

    const tools = tavilyKey
      ? [
          {
            type: 'function' as const,
            function: {
              name: 'web_search',
              description: 'Search the web for real-time information, facts, news, or sports scores.',
              parameters: {
                type: 'object',
                properties: {
                  query: { type: 'string', description: 'The search query' }
                },
                required: ['query']
              }
            }
          }
        ]
      : undefined;

    const baseMessages = [
      { role: 'system' as const, content: buildSystemPrompt() },
      ...history,
      { role: 'user' as const, content: input }
    ];

    const first = await groq.chat.completions.create({
      model,
      temperature: 0.6,
      max_tokens: 400,
      messages: baseMessages,
      ...(tools ? { tools, tool_choice: 'auto' as const } : {})
    });

    const firstMessage = first.choices[0]?.message;
    const firstText = firstMessage?.content ?? '';

    const toolCall = firstMessage?.tool_calls?.[0];
    if (!toolCall || !tavilyKey) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: firstText || 'No response generated.' })
      };
    }

    let toolQuery = input;
    try {
      const parsed = JSON.parse(toolCall.function.arguments || '{}') as { query?: string };
      if (parsed.query && parsed.query.trim()) {
        toolQuery = parsed.query;
      }
    } catch {
      toolQuery = input;
    }

    const toolResult = await performWebSearch(toolQuery, tavilyKey);

    const second = await groq.chat.completions.create({
      model,
      temperature: 0.2,
      messages: [
        ...baseMessages,
        {
          role: 'assistant',
          content: firstText || null,
          tool_calls: [toolCall]
        },
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: `SYSTEM INSTRUCTION: Report these search results exactly. If no results found, say so. Search Result: ${toolResult}`
        }
      ]
    });

    const secondText = second.choices[0]?.message?.content ?? '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: secondText || firstText || 'No response generated.' })
    };
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
