import type { Employment, User } from '@/types';
import type { ProfileRow } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';
import { toEmployment, toUser, type ProfileCounts } from './mappers';

async function countsFor(profileId: string): Promise<ProfileCounts> {
  const client = db();
  const [stories, followers, following] = await Promise.all([
    client
      .from('stories')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', profileId)
      .eq('status', 'published'),
    client.from('user_follows').select('follower_id', { count: 'exact', head: true }).eq('followee_id', profileId),
    client.from('user_follows').select('followee_id', { count: 'exact', head: true }).eq('follower_id', profileId),
  ]);
  return {
    storyCount: stories.count ?? 0,
    followerCount: followers.count ?? 0,
    followingCount: following.count ?? 0,
  };
}

async function employmentFor(profileId: string): Promise<Employment[]> {
  const { data, error } = await db()
    .from('employment_history')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toEmployment);
}

export async function getProfile(id: string): Promise<User | null> {
  const { data, error } = await db().from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [counts, employment] = await Promise.all([countsFor(id), employmentFor(id)]);
  return toUser(data as ProfileRow, counts, employment);
}

export async function getProfileByUsername(username: string): Promise<User | null> {
  const { data, error } = await db().from('profiles').select('*').eq('username', username).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as ProfileRow;
  const [counts, employment] = await Promise.all([countsFor(row.id), employmentFor(row.id)]);
  return toUser(row, counts, employment);
}

export async function updateProfile(patch: Partial<User>): Promise<void> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Not signed in.');
  const row: Partial<ProfileRow> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.username !== undefined) row.username = patch.username;
  if (patch.headline !== undefined) row.headline = patch.headline;
  if (patch.location !== undefined) row.location = patch.location;
  if (patch.bio !== undefined) row.bio = patch.bio;
  if (patch.avatarColor !== undefined) row.avatar_color = patch.avatarColor;
  const { error } = await db().from('profiles').update(row).eq('id', uid);
  if (error) throw error;
}

/**
 * Get the signed-in user's profile, creating a real one on first sign-in from
 * their auth identity (name/avatar from the provider). No demo data.
 */
export async function ensureProfile(): Promise<User | null> {
  const session = await getSession();
  const authUser = session?.user;
  if (!authUser) return null;

  const existing = await getProfile(authUser.id);
  if (existing) return existing;

  const meta = authUser.user_metadata ?? {};
  const name: string =
    (meta.full_name as string) || (meta.name as string) || authUser.email?.split('@')[0] || 'New member';
  const base =
    (authUser.email?.split('@')[0] || name).toLowerCase().replace(/[^a-z0-9]+/g, '') || 'member';
  const username = `${base}${Math.floor(1000 + Math.random() * 9000)}`;

  const { error } = await db()
    .from('profiles')
    .insert({ id: authUser.id, name, username, headline: '', avatar_color: '#3D725E' });
  if (error) throw error;
  return getProfile(authUser.id);
}
