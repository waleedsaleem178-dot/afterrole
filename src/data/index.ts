import type { Comment, Company, Story, User } from '@/types';

import { mockComments } from './comments';
import { mockCompanies } from './companies';
import { directoryCompanies } from './directory';
import { mockNotifications } from './notifications';
import { mockStories } from './stories';
import { CURRENT_USER_ID, mockUsers } from './users';

export { mockUsers, CURRENT_USER_ID } from './users';
export { mockCompanies } from './companies';
export { directoryCompanies } from './directory';
export { mockStories } from './stories';
export { mockComments } from './comments';
export { mockNotifications } from './notifications';

/**
 * Full company universe: curated/featured companies (with stories & topics)
 * plus the ~2,000-company real directory (US + Pakistan). Featured entries win
 * on id collisions so their richer data is preserved.
 */
export const allCompanies: Company[] = (() => {
  const seen = new Set(mockCompanies.map((c) => c.id));
  return [...mockCompanies, ...directoryCompanies.filter((c) => !seen.has(c.id))];
})();

const usersById: Record<string, User> = Object.fromEntries(mockUsers.map((u) => [u.id, u]));
const companiesById: Record<string, Company> = Object.fromEntries(
  allCompanies.map((c) => [c.id, c]),
);
const storiesById: Record<string, Story> = Object.fromEntries(mockStories.map((s) => [s.id, s]));

export function getUserById(id: string | undefined): User | undefined {
  return id ? usersById[id] : undefined;
}

export function getCompanyById(id: string | undefined): Company | undefined {
  return id ? companiesById[id] : undefined;
}

export function getStoryById(id: string | undefined): Story | undefined {
  return id ? storiesById[id] : undefined;
}

export function getBaseCommentsForStory(storyId: string): Comment[] {
  return mockComments.filter((c) => c.storyId === storyId);
}

export function getStoriesByCompany(companyId: string): Story[] {
  return mockStories.filter((s) => s.companyId === companyId);
}

export function getStoriesByAuthor(authorId: string): Story[] {
  return mockStories.filter((s) => s.authorId === authorId);
}

export function getFinalStraws(): Story[] {
  return mockStories.filter((s) => s.isFinalStraw);
}

export function getPeopleForCompany(companyId: string): User[] {
  return mockUsers.filter((u) => u.employment.some((e) => e.companyId === companyId));
}

export { mockNotifications as baseNotifications };
export { CURRENT_USER_ID as currentUserId };
