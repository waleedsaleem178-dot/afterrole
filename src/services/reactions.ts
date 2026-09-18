import type { ReactionTypeDB, StoryReactionRow } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';

/** The signed-in user's reactions, as { [storyId]: { helpful, been_there } }. */
export async function getMyReactions(storyIds?: string[]): Promise<Record<string, Record<ReactionTypeDB, boolean>>> {
  const uid = (await getSession())?.user.id;
  if (!uid) return {};
  let q = db().from('story_reactions').select('story_id,type').eq('profile_id', uid);
  if (storyIds && storyIds.length > 0) q = q.in('story_id', storyIds);
  const { data, error } = await q;
  if (error) throw error;
  const out: Record<string, Record<ReactionTypeDB, boolean>> = {};
  for (const r of (data ?? []) as Pick<StoryReactionRow, 'story_id' | 'type'>[]) {
    out[r.story_id] ??= { helpful: false, been_there: false };
    out[r.story_id][r.type] = true;
  }
  return out;
}

/** Toggle a reaction row on/off. Returns the new state. */
export async function toggleReaction(storyId: string, type: ReactionTypeDB): Promise<boolean> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Sign in to react.');
  const client = db();
  const { data: existing, error: readErr } = await client
    .from('story_reactions')
    .select('story_id')
    .eq('story_id', storyId)
    .eq('profile_id', uid)
    .eq('type', type)
    .maybeSingle();
  if (readErr) throw readErr;

  if (existing) {
    const { error } = await client
      .from('story_reactions')
      .delete()
      .eq('story_id', storyId)
      .eq('profile_id', uid)
      .eq('type', type);
    if (error) throw error;
    return false;
  }
  const { error } = await client
    .from('story_reactions')
    .insert({ story_id: storyId, profile_id: uid, type });
  if (error) throw error;
  return true;
}
