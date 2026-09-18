import type { Story, StoryDraft } from '@/types';
import type { StoryReactionCountRow, StoryRow } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';
import { toStory, type StoryCounts } from './mappers';

/** Attach REAL reaction + comment counts to a set of story rows. */
async function withCounts(rows: StoryRow[]): Promise<Story[]> {
  if (rows.length === 0) return [];
  const client = db();
  const ids = rows.map((r) => r.id);

  const [reactions, comments] = await Promise.all([
    client.from('story_reaction_counts').select('*').in('story_id', ids),
    client.from('comments').select('story_id').in('story_id', ids),
  ]);

  const counts = new Map<string, StoryCounts>();
  for (const r of (reactions.data ?? []) as StoryReactionCountRow[]) {
    counts.set(r.story_id, {
      helpfulCount: Number(r.helpful_count),
      beenThereCount: Number(r.been_there_count),
    });
  }
  const commentTally = new Map<string, number>();
  for (const c of (comments.data ?? []) as { story_id: string }[]) {
    commentTally.set(c.story_id, (commentTally.get(c.story_id) ?? 0) + 1);
  }

  return rows.map((row) =>
    toStory(row, { ...counts.get(row.id), commentCount: commentTally.get(row.id) ?? 0 }),
  );
}

export async function listRecentStories(limit = 30): Promise<Story[]> {
  const { data, error } = await db()
    .from('stories')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return withCounts((data ?? []) as StoryRow[]);
}

export async function listStoriesByCompany(companyId: string, limit = 50): Promise<Story[]> {
  const { data, error } = await db()
    .from('stories')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return withCounts((data ?? []) as StoryRow[]);
}

export async function listStoriesByAuthor(authorId: string, limit = 50): Promise<Story[]> {
  const { data, error } = await db()
    .from('stories')
    .select('*')
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return withCounts((data ?? []) as StoryRow[]);
}

export async function listFinalStraws(limit = 10): Promise<Story[]> {
  const { data, error } = await db()
    .from('stories')
    .select('*')
    .eq('status', 'published')
    .eq('is_final_straw', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return withCounts((data ?? []) as StoryRow[]);
}

export async function getStory(id: string): Promise<Story | null> {
  const { data, error } = await db().from('stories').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [story] = await withCounts([data as StoryRow]);
  return story ?? null;
}

/** Publish a story authored by the signed-in user. */
export async function createStory(draft: StoryDraft): Promise<Story> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Not signed in.');
  if (!draft.companyId || !draft.body) throw new Error('A company and story body are required.');

  const context = `${draft.current ? 'Current' : 'Former'} ${draft.role ?? ''}`.trim();
  const topics = draft.topFactors.length ? draft.topFactors : draft.topics;
  const { data, error } = await db()
    .from('stories')
    .insert({
      author_id: uid,
      company_id: draft.companyId,
      role: draft.role ?? '',
      employment_context: context,
      employment_status: draft.current ? 'current' : 'former',
      end_reason: draft.endReason ?? null,
      excerpt: draft.body.slice(0, 140) + (draft.body.length > 140 ? '…' : ''),
      body: draft.body,
      final_straw: draft.finalStraw ?? null,
      what_was_good: draft.whatWasGood ?? null,
      topics,
      would_work_again: draft.wouldWorkAgain ?? null,
      is_final_straw: Boolean(draft.finalStraw),
      status: 'published',
    })
    .select('*')
    .single();
  if (error) throw error;
  return toStory(data as StoryRow, { helpfulCount: 0, beenThereCount: 0, commentCount: 0 });
}
