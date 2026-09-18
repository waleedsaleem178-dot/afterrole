import type { User } from '@/types';
import type { ProfileRow } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';
import { toUser } from './mappers';

async function uid(): Promise<string> {
  const id = (await getSession())?.user.id;
  if (!id) throw new Error('Sign in to follow.');
  return id;
}

// --- Companies ---------------------------------------------------------------
export async function listFollowedCompanyIds(): Promise<string[]> {
  const me = (await getSession())?.user.id;
  if (!me) return [];
  const { data, error } = await db().from('company_follows').select('company_id').eq('profile_id', me);
  if (error) throw error;
  return (data ?? []).map((r) => r.company_id);
}

export async function setCompanyFollow(companyId: string, follow: boolean): Promise<void> {
  const me = await uid();
  const client = db();
  if (follow) {
    const { error } = await client.from('company_follows').upsert({ profile_id: me, company_id: companyId });
    if (error) throw error;
  } else {
    const { error } = await client
      .from('company_follows')
      .delete()
      .eq('profile_id', me)
      .eq('company_id', companyId);
    if (error) throw error;
  }
}

// --- People ------------------------------------------------------------------
export async function listFollowedUserIds(): Promise<string[]> {
  const me = (await getSession())?.user.id;
  if (!me) return [];
  const { data, error } = await db().from('user_follows').select('followee_id').eq('follower_id', me);
  if (error) throw error;
  return (data ?? []).map((r) => r.followee_id);
}

export async function setUserFollow(userId: string, follow: boolean): Promise<void> {
  const me = await uid();
  const client = db();
  if (follow) {
    const { error } = await client.from('user_follows').upsert({ follower_id: me, followee_id: userId });
    if (error) throw error;
  } else {
    const { error } = await client
      .from('user_follows')
      .delete()
      .eq('follower_id', me)
      .eq('followee_id', userId);
    if (error) throw error;
  }
}

async function profilesByIds(ids: string[]): Promise<User[]> {
  if (ids.length === 0) return [];
  const { data, error } = await db().from('profiles').select('*').in('id', ids);
  if (error) throw error;
  return ((data ?? []) as ProfileRow[]).map((r) => toUser(r));
}

export async function listFollowers(profileId: string): Promise<User[]> {
  const { data, error } = await db().from('user_follows').select('follower_id').eq('followee_id', profileId);
  if (error) throw error;
  return profilesByIds((data ?? []).map((r) => r.follower_id));
}

export async function listFollowing(profileId: string): Promise<User[]> {
  const { data, error } = await db().from('user_follows').select('followee_id').eq('follower_id', profileId);
  if (error) throw error;
  return profilesByIds((data ?? []).map((r) => r.followee_id));
}
