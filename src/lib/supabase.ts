import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

/**
 * Supabase client for AfterRole.
 *
 * This is wired but OPTIONAL: the app currently runs entirely on local mock
 * data + Zustand persistence. When the env vars below are present, this client
 * becomes available for gradually moving reads/writes to Supabase (companies
 * directory, profiles, stories, reactions...). Nothing here builds production
 * auth — that is intentionally deferred.
 *
 * Set the following in `.env` (see `.env.example`):
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** True only when both env vars are configured. Guard usage with this. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// On web, AsyncStorage falls back to localStorage; on native it uses RN storage.
// `detectSessionInUrl` is web-only and safe to leave off until we add real auth.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    })
  : null;
