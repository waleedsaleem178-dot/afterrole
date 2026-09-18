import type { VerificationStatusDB } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';

const EVIDENCE_BUCKET = 'verification-evidence';

/** Real verification status from Supabase. Never simulated. */
export async function getVerificationStatus(profileId: string): Promise<VerificationStatusDB> {
  const { data, error } = await db()
    .from('profiles')
    .select('verification_status')
    .eq('id', profileId)
    .maybeSingle();
  if (error) throw error;
  return (data?.verification_status as VerificationStatusDB) ?? 'unverified';
}

/**
 * Upload employment-verification evidence to the PRIVATE bucket, under the
 * user's own folder. Returns the storage path (not a public URL — there is
 * none). Reviewers grant `verified` server-side; the app never self-verifies.
 */
export async function uploadEvidence(file: Blob | ArrayBuffer, filename: string): Promise<string> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Sign in to submit verification.');
  const path = `${uid}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]+/g, '_')}`;
  const { error } = await db().storage.from(EVIDENCE_BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export async function requestVerification(input: {
  employmentId?: string;
  evidencePath?: string;
}): Promise<void> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Sign in to request verification.');
  const { error } = await db().from('verification_requests').insert({
    profile_id: uid,
    employment_id: input.employmentId ?? null,
    evidence_path: input.evidencePath ?? null,
    status: 'pending',
  });
  if (error) throw error;
}
