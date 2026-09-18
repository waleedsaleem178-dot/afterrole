import type { AppNotification } from '@/types';

/**
 * Activity for a fresh account — discovery nudges and prompts that are true
 * regardless of follower/story count (no fabricated "someone liked your story").
 */
export const mockNotifications: AppNotification[] = [
  {
    id: 'n_1',
    type: 'company_stories',
    companyId: 'c_spotify',
    message: 'has 12 new workplace stories this week',
    createdAt: '2026-09-17T19:20:00Z',
    read: false,
  },
  {
    id: 'n_2',
    type: 'verification',
    message: 'Verify your role at AdVital to add context to your stories',
    createdAt: '2026-09-17T14:05:00Z',
    read: false,
  },
  {
    id: 'n_3',
    type: 'company_stories',
    companyId: 'c_amazon',
    message: 'has new stories about on-call and work-life balance',
    createdAt: '2026-09-16T10:30:00Z',
    read: false,
  },
  {
    id: 'n_4',
    type: 'company_stories',
    companyId: 'c_stripe',
    message: 'is being discussed by people who recently left',
    createdAt: '2026-09-15T09:00:00Z',
    read: true,
  },
];
