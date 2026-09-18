import type { Comment } from '@/types';

/** Mock comments — every comment is attributed to a real user (no anonymity). */
export const mockComments: Comment[] = [
  {
    id: 'cm_1',
    storyId: 's_spotify_meetings',
    authorId: 'u_sofia',
    body: 'The meeting-about-meetings is painfully real. Glad you found room to build.',
    createdAt: '2026-09-10T18:00:00Z',
    helpfulCount: 24,
  },
  {
    id: 'cm_2',
    storyId: 's_spotify_meetings',
    authorId: 'u_maya',
    body: 'Process creep is the silent killer. Thanks for naming it so clearly.',
    createdAt: '2026-09-11T08:30:00Z',
    helpfulCount: 12,
  },
  {
    id: 'cm_3',
    storyId: 's_amazon_oncall',
    authorId: 'u_aisha',
    body: 'Seconding this — ask about pager load per team specifically. It varies wildly.',
    createdAt: '2026-09-06T09:15:00Z',
    helpfulCount: 31,
  },
  {
    id: 'cm_4',
    storyId: 's_stripe_offer',
    authorId: 'u_marcus',
    body: 'Refreshing to read a positive departure story. Congrats on the step up.',
    createdAt: '2026-09-08T14:40:00Z',
    helpfulCount: 9,
  },
  {
    id: 'cm_5',
    storyId: 's_hubspot_promo',
    authorId: 'u_jordan',
    body: 'Promotion clarity is the thing I hear most about remote-first orgs. Well put.',
    createdAt: '2026-09-01T16:05:00Z',
    helpfulCount: 15,
  },
];
