import { supabase } from '@/lib/supabase';

/**
 * Returns the configured Supabase client, or throws a clear error. Screens must
 * guard with `isSupabaseConfigured` (from '@/lib/supabase') before calling
 * services so this never fires in normal use.
 */
export function db() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  return supabase;
}
