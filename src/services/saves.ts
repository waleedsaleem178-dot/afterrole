import { db } from './client';
import { getSession } from './auth';

async function uid(): Promise<string> {
  const id = (await getSession())?.user.id;
  if (!id) throw new Error('Sign in to save stories.');
  return id;
}

export async function listSavedStoryIds(): Promise<string[]> {
  const me = (await getSession())?.user.id;
  if (!me) return [];
  const { data, error } = await db().from('saved_stories').select('story_id').eq('profile_id', me);
  if (error) throw error;
  return (data ?? []).map((r) => r.story_id);
}

export async function setSaved(storyId: string, saved: boolean): Promise<void> {
  const me = await uid();
  const client = db();
  if (saved) {
    const { error } = await client.from('saved_stories').upsert({ profile_id: me, story_id: storyId });
    if (error) throw error;
  } else {
    const { error } = await client
      .from('saved_stories')
      .delete()
      .eq('profile_id', me)
      .eq('story_id', storyId);
    if (error) throw error;
  }
}
