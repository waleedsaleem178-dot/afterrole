import type { AppNotification } from '@/types';
import type { NotificationRow } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';
import { toNotification } from './mappers';

export async function listNotifications(): Promise<AppNotification[]> {
  const me = (await getSession())?.user.id;
  if (!me) return [];
  const { data, error } = await db()
    .from('notifications')
    .select('*')
    .eq('recipient_id', me)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as NotificationRow[]).map(toNotification);
}

export async function unreadCount(): Promise<number> {
  const me = (await getSession())?.user.id;
  if (!me) return 0;
  const { count, error } = await db()
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_id', me)
    .eq('read', false);
  if (error) throw error;
  return count ?? 0;
}

export async function markRead(id: string): Promise<void> {
  const { error } = await db().from('notifications').update({ read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllRead(): Promise<void> {
  const me = (await getSession())?.user.id;
  if (!me) return;
  const { error } = await db().from('notifications').update({ read: true }).eq('recipient_id', me).eq('read', false);
  if (error) throw error;
}
