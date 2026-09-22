import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://xyplbgcjybymntwqkebm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cGxiZ2NqeWJ5bW50d3FrZWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NTgwNjgsImV4cCI6MjEwNTMzNDA2OH0.ofcuh-1u5nzb91nmAHl2F0btPW8sNmdd1aKnq_XdtJY';

const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/["']/g, '').trim();
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/["']/g, '').trim();

const rawUrl = envUrl || DEFAULT_SUPABASE_URL;
const rawKey = envKey || DEFAULT_SUPABASE_ANON_KEY;

/**
 * Determines whether Supabase environment variables have been configured.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof rawUrl === 'string' &&
    rawUrl.length > 0 &&
    typeof rawKey === 'string' &&
    rawKey.length > 0 &&
    rawUrl.startsWith('https://') &&
    !rawUrl.includes('placeholder')
  );
};

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase client instance if configured, or null otherwise.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Not configured. VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing or invalid.');
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return clientInstance;
};

/**
 * Exported supabase client proxy that safely delegates when configured.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      console.warn(
        `[Supabase] Attempted to access supabase.${String(prop)} but Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.`
      );
      // Return a dummy chained builder to prevent immediate runtime crashes
      return () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Supabase is not configured') }),
            order: async () => ({ data: [], error: new Error('Supabase is not configured') }),
          }),
        }),
      });
    }
    const val = (client as unknown as Record<string, unknown>)[prop as string];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});
