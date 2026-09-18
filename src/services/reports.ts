import { db } from './client';
import { getSession } from './auth';

export async function reportStory(storyId: string, reason = ''): Promise<void> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Sign in to report.');
  const { error } = await db()
    .from('content_reports')
    .insert({ reporter_id: uid, story_id: storyId, reason });
  if (error) throw error;
}

export async function reportComment(commentId: string, reason = ''): Promise<void> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Sign in to report.');
  const { error } = await db()
    .from('content_reports')
    .insert({ reporter_id: uid, comment_id: commentId, reason });
  if (error) throw error;
}
