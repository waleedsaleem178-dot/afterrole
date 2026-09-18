import { useMemo } from 'react';

import { baseNotifications } from '@/data';
import { useStore } from '@/store';
import type { AppNotification } from '@/types';

export interface MergedNotification extends AppNotification {
  isRead: boolean;
}

/** Merges base mock notifications with locally-tracked read state. */
export function useNotifications(): { notifications: MergedNotification[]; unreadCount: number } {
  const readIds = useStore((s) => s.readNotificationIds);

  return useMemo(() => {
    const merged = baseNotifications
      .map((n) => ({ ...n, isRead: n.read || readIds.includes(n.id) }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const unreadCount = merged.filter((n) => !n.isRead).length;
    return { notifications: merged, unreadCount };
  }, [readIds]);
}
