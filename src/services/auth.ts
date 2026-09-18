import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';

import { db } from './client';

export type OAuthProvider = 'apple' | 'google';

function redirectTo(): string {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
  return Linking.createURL('auth-callback');
}

function parseFragment(url: string): Record<string, string> {
  const hash = url.includes('#') ? url.slice(url.indexOf('#') + 1) : '';
  const out: Record<string, string> = {};
  for (const pair of hash.split('&')) {
    const [k, v] = pair.split('=');
    if (k) out[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
  }
  return out;
}

async function completeFromUrl(url: string): Promise<void> {
  const client = db();
  const { queryParams } = Linking.parse(url);
  const code = queryParams?.code as string | undefined;
  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return;
  }
  const frag = parseFragment(url);
  if (frag.access_token && frag.refresh_token) {
    const { error } = await client.auth.setSession({
      access_token: frag.access_token,
      refresh_token: frag.refresh_token,
    });
    if (error) throw error;
    return;
  }
  throw new Error('Could not complete sign-in.');
}

/**
 * Start a real OAuth sign-in with Apple or Google. On web this redirects the
 * page; on native it opens the system auth session and finishes the exchange.
 * Throws if the provider isn't configured in Supabase — never fakes success.
 */
export async function signInWithProvider(provider: OAuthProvider): Promise<void> {
  const client = db();
  const to = redirectTo();

  if (Platform.OS === 'web') {
    const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: to } });
    if (error) throw error;
    return; // page redirects; session resolved on return via detectSessionInUrl
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: { redirectTo: to, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data?.url) throw new Error('No OAuth URL returned by Supabase.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, to);
  if (result.type !== 'success' || !result.url) throw new Error('Sign-in was cancelled.');
  await completeFromUrl(result.url);
}

/** Email magic-link (optional secondary method). */
export async function signInWithEmail(email: string): Promise<void> {
  const { error } = await db().auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: redirectTo() },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await db().auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUserId(): Promise<string | null> {
  return (await getSession())?.user.id ?? null;
}

/** Subscribe to auth changes. Returns an object with `.unsubscribe()`. */
export function onAuthChange(cb: (session: Session | null) => void) {
  if (!supabase) return { unsubscribe: () => {} };
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return data.subscription;
}
