import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Determines whether Supabase environment variables have been configured.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseUrl.includes('placeholder')
  );
};

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase client instance if configured, or null otherwise.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
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
