import type { Comment } from '@/types';
import type { CommentRow } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';
import { toComment } from './mappers';

export async function listComments(storyId: string): Promise<Comment[]> {
  const { data, error } = await db()
    .from('comments')
    .select('*')
    .eq('story_id', storyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toComment);
}

export async function addComment(storyId: string, body: string): Promise<Comment> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Not signed in.');
  const text = body.trim();
  if (!text) throw new Error('Comment cannot be empty.');
  const { data, error } = await db()
    .from('comments')
    .insert({ story_id: storyId, author_id: uid, body: text })
    .select('*')
    .single();
  if (error) throw error;
  return toComment(data as CommentRow);
}

export async function removeComment(id: string): Promise<void> {
  const { error } = await db().from('comments').delete().eq('id', id);
  if (error) throw error;
}
