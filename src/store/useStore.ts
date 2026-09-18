import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CURRENT_USER_ID, getUserById } from '@/data';
import type {
  Comment,
  Employment,
  Story,
  StoryDraft,
  User,
  VerificationStatus,
} from '@/types';

import { appStorage } from './storage';

const emptyDraft: StoryDraft = { topics: [], topFactors: [] };

function seedProfile(): User {
  const base = getUserById(CURRENT_USER_ID);
  // Deep clone so store edits never mutate the shared mock object.
  return JSON.parse(JSON.stringify(base)) as User;
}

export interface AppState {
  // lifecycle
  hydrated: boolean;
  onboardingComplete: boolean;
  signedIn: boolean;

  // current user
  profile: User;

  // social graph
  followedUsers: string[];
  followedCompanies: string[];
  savedStories: string[];
  helpful: Record<string, boolean>;
  beenThere: Record<string, boolean>;

  // content authored / interacted with locally
  createdStories: Story[];
  commentsByStory: Record<string, Comment[]>;
  reportedStories: string[];
  readNotificationIds: string[];

  // create-story draft
  draft: StoryDraft;

  // actions
  setHydrated: (v: boolean) => void;
  completeOnboarding: () => void;
  signIn: () => void;
  signOut: () => void;

  updateProfile: (patch: Partial<User>) => void;
  addEmployment: (employment: Omit<Employment, 'id'>) => string;
  verifyEmployment: (employmentId: string) => void;
  verificationStatusFor: (employmentId: string) => VerificationStatus;

  toggleFollowUser: (userId: string) => void;
  toggleFollowCompany: (companyId: string) => void;
  toggleSaveStory: (storyId: string) => void;
  toggleHelpful: (storyId: string) => void;
  toggleBeenThere: (storyId: string) => void;

  addComment: (storyId: string, body: string) => void;
  reportStory: (storyId: string) => void;

  setDraft: (patch: Partial<StoryDraft>) => void;
  resetDraft: () => void;
  publishStory: () => Story | undefined;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (ids: string[]) => void;

  resetAll: () => void;
}

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingComplete: false,
      signedIn: false,

      profile: seedProfile(),

      followedUsers: [],
      followedCompanies: [],
      savedStories: [],
      helpful: {},
      beenThere: {},

      createdStories: [],
      commentsByStory: {},
      reportedStories: [],
      readNotificationIds: [],

      draft: emptyDraft,

      setHydrated: (v) => set({ hydrated: v }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      signIn: () => set({ signedIn: true }),
      signOut: () => set({ signedIn: false }),

      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      addEmployment: (employment) => {
        const id = `emp_${Date.now()}`;
        set((s) => ({
          profile: {
            ...s.profile,
            employment: [{ ...employment, id }, ...s.profile.employment],
          },
        }));
        return id;
      },

      verifyEmployment: (employmentId) =>
        set((s) => ({
          profile: {
            ...s.profile,
            employment: s.profile.employment.map((e) =>
              e.id === employmentId ? { ...e, verified: true } : e,
            ),
          },
        })),

      verificationStatusFor: (employmentId) => {
        const emp = get().profile.employment.find((e) => e.id === employmentId);
        return emp?.verified ? 'verified' : 'unverified';
      },

      toggleFollowUser: (userId) =>
        set((s) => ({ followedUsers: toggleInArray(s.followedUsers, userId) })),
      toggleFollowCompany: (companyId) =>
        set((s) => ({ followedCompanies: toggleInArray(s.followedCompanies, companyId) })),
      toggleSaveStory: (storyId) =>
        set((s) => ({ savedStories: toggleInArray(s.savedStories, storyId) })),
      toggleHelpful: (storyId) =>
        set((s) => ({ helpful: { ...s.helpful, [storyId]: !s.helpful[storyId] } })),
      toggleBeenThere: (storyId) =>
        set((s) => ({ beenThere: { ...s.beenThere, [storyId]: !s.beenThere[storyId] } })),

      addComment: (storyId, body) => {
        const { profile } = get();
        const comment: Comment = {
          id: `cm_${Date.now()}`,
          storyId,
          authorId: profile.id,
          body: body.trim(),
          createdAt: new Date().toISOString(),
          helpfulCount: 0,
        };
        set((s) => ({
          commentsByStory: {
            ...s.commentsByStory,
            [storyId]: [comment, ...(s.commentsByStory[storyId] ?? [])],
          },
        }));
      },

      reportStory: (storyId) =>
        set((s) => ({
          reportedStories: s.reportedStories.includes(storyId)
            ? s.reportedStories
            : [...s.reportedStories, storyId],
        })),

      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      resetDraft: () => set({ draft: emptyDraft }),

      publishStory: () => {
        const { draft, profile } = get();
        if (!draft.companyId || !draft.body) return undefined;
        const contextPrefix = draft.current ? 'Current' : 'Former';
        const story: Story = {
          id: `story_${Date.now()}`,
          authorId: profile.id,
          companyId: draft.companyId,
          role: draft.role ?? profile.headline,
          employmentContext: `${contextPrefix} ${draft.role ?? profile.headline}`,
          employmentStatus: draft.current ? 'current' : 'former',
          endReason: draft.endReason,
          createdAt: new Date().toISOString(),
          excerpt: draft.body.slice(0, 140) + (draft.body.length > 140 ? '…' : ''),
          body: draft.body,
          finalStraw: draft.finalStraw,
          whatWasGood: draft.whatWasGood,
          topics: draft.topFactors.length ? draft.topFactors : draft.topics,
          wouldWorkAgain: draft.wouldWorkAgain,
          helpfulCount: 0,
          beenThereCount: 0,
          commentCount: 0,
          isFinalStraw: Boolean(draft.finalStraw),
        };
        set((s) => ({
          createdStories: [story, ...s.createdStories],
          profile: { ...s.profile, storyCount: s.profile.storyCount + 1 },
          draft: emptyDraft,
        }));
        return story;
      },

      markNotificationRead: (id) =>
        set((s) => ({
          readNotificationIds: s.readNotificationIds.includes(id)
            ? s.readNotificationIds
            : [...s.readNotificationIds, id],
        })),
      markAllNotificationsRead: (ids) =>
        set((s) => ({
          readNotificationIds: Array.from(new Set([...s.readNotificationIds, ...ids])),
        })),

      resetAll: () =>
        set({
          onboardingComplete: false,
          signedIn: false,
          profile: seedProfile(),
          followedUsers: [],
          followedCompanies: [],
          savedStories: [],
          helpful: {},
          beenThere: {},
          createdStories: [],
          commentsByStory: {},
          reportedStories: [],
          readNotificationIds: [],
          draft: emptyDraft,
        }),
    }),
    {
      name: 'afterrole-store-v1',
      storage: createJSONStorage(() => appStorage),
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        signedIn: s.signedIn,
        profile: s.profile,
        followedUsers: s.followedUsers,
        followedCompanies: s.followedCompanies,
        savedStories: s.savedStories,
        helpful: s.helpful,
        beenThere: s.beenThere,
        createdStories: s.createdStories,
        commentsByStory: s.commentsByStory,
        reportedStories: s.reportedStories,
        readNotificationIds: s.readNotificationIds,
        draft: s.draft,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Reactive list of the current user's created stories followed by mock stories. */
export function combineStories(created: Story[], base: Story[]): Story[] {
  return [...created, ...base];
}

/** Live count helpers (base count + local reaction). */
export function displayHelpful(story: Story, helpful: Record<string, boolean>): number {
  return story.helpfulCount + (helpful[story.id] ? 1 : 0);
}
export function displayBeenThere(story: Story, beenThere: Record<string, boolean>): number {
  return story.beenThereCount + (beenThere[story.id] ? 1 : 0);
}
