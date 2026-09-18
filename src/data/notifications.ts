import type { AppNotification } from '@/types';

/** Mock activity feed for the current user (Waleed). */
export const mockNotifications: AppNotification[] = [
  {
    id: 'n_1',
    type: 'helpful',
    actorId: 'u_maya',
    storyId: 's_spotify_meetings',
    message: 'found your story helpful',
    createdAt: '2026-09-17T19:20:00Z',
    read: false,
  },
  {
    id: 'n_2',
    type: 'comment',
    actorId: 'u_sofia',
    storyId: 's_spotify_meetings',
    message: 'commented on your story',
    createdAt: '2026-09-17T14:05:00Z',
    read: false,
  },
  {
    id: 'n_3',
    type: 'follow',
    actorId: 'u_jordan',
    message: 'started following you',
    createdAt: '2026-09-16T10:30:00Z',
    read: false,
  },
  {
    id: 'n_4',
    type: 'company_stories',
    companyId: 'c_spotify',
    message: 'has 12 new workplace stories',
    createdAt: '2026-09-15T09:00:00Z',
    read: true,
  },
  {
    id: 'n_5',
    type: 'verification',
    message: 'Your employment at AdVital was verified',
    createdAt: '2026-09-14T12:00:00Z',
    read: true,
  },
  {
    id: 'n_6',
    type: 'helpful',
    actorId: 'u_aisha',
    storyId: 's_amazon_oncall',
    message: 'found your story helpful',
    createdAt: '2026-09-13T08:45:00Z',
    read: true,
  },
];
