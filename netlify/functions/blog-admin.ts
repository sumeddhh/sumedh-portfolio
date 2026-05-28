import { createClient } from '@supabase/supabase-js';

interface NetlifyEvent {
  httpMethod?: string;
  headers?: Record<string, string>;
  body?: string | null;
}

const getExpectedPasswords = () => {
  const expectedList: string[] = [];
  const now = new Date();

  // 1. Server Local Time
  const mmServer = String(now.getMonth() + 1).padStart(2, '0');
  const ddServer = String(now.getDate()).padStart(2, '0');
  expectedList.push(`${mmServer}${ddServer}_blog`);

  // 2. Asia/Kathmandu Time (UTC+5:45)
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      month: 'numeric',
      day: 'numeric'
    });
    const parts = formatter.formatToParts(now);
    const mmK = String(parts.find(p => p.type === 'month')?.value || '').padStart(2, '0');
    const ddK = String(parts.find(p => p.type === 'day')?.value || '').padStart(2, '0');
    if (mmK && ddK) {
      expectedList.push(`${mmK}${ddK}_blog`);
    }
  } catch (e) {
    console.error('Error formatting Kathmandu time:', e);
  }

  return Array.from(new Set(expectedList));
};

export const handler = async (event: NetlifyEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  // Use SUPABASE_SERVICE_ROLE_KEY to bypass RLS securely on the server
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing Supabase server-side configuration' })
    };
  }

  try {
    const password = event.headers?.['x-dev-password'] || '';
    if (!password) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unauthorized: Missing developer password' })
      };
    }

    const expectedPasswords = getExpectedPasswords();
    if (!expectedPasswords.includes(password)) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Forbidden: Invalid developer password' })
      };
    }

    const payload = event.body ? JSON.parse(event.body) : {};
    const { action, id, blogData } = payload;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    });

    if (action === 'insert') {
      const { data, error } = await supabase
        .from('blogs')
        .insert([blogData])
        .select();

      if (error) throw error;
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      };
    } 
    
    if (action === 'update') {
      if (!id) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing blog ID for update' })
        };
      }
      const { data, error } = await supabase
        .from('blogs')
        .update(blogData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      };
    } 
    
    if (action === 'delete') {
      if (!id) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing blog ID for delete' })
        };
      }
      const { data, error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      };
    }

    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid action' })
    };

  } catch (error) {
    console.error('Blog admin error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' })
    };
  }
};
