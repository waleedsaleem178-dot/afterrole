import { mockCompanies, mockStories, mockUsers } from '@/data';
import type { Company, Story, User } from '@/types';

export type SearchResult =
  | { key: string; type: 'company'; company: Company }
  | { key: string; type: 'person'; user: User }
  | { key: string; type: 'story'; story: Story }
  | { key: string; type: 'role'; role: string; companyId: string };

export function searchAll(rawQuery: string): SearchResult[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const company of mockCompanies) {
    if (`${company.name} ${company.industry}`.toLowerCase().includes(q)) {
      results.push({ key: `c:${company.id}`, type: 'company', company });
    }
  }

  for (const user of mockUsers) {
    const hay = `${user.name} ${user.headline} ${user.employment
      .map((e) => `${e.companyName} ${e.role}`)
      .join(' ')}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({ key: `p:${user.id}`, type: 'person', user });
    }
  }

  // Roles (dedup by role name), linked to the company that features them most.
  const seenRole = new Set<string>();
  for (const company of mockCompanies) {
    for (const role of company.roleCategories) {
      const name = role.name.toLowerCase();
      if (name.includes(q) && !seenRole.has(name)) {
        seenRole.add(name);
        results.push({ key: `r:${name}`, type: 'role', role: role.name, companyId: company.id });
      }
    }
  }

  for (const story of mockStories) {
    const hay = `${story.role} ${story.topics.join(' ')} ${story.body}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({ key: `s:${story.id}`, type: 'story', story });
    }
  }

  return results;
}

export const INDUSTRIES = [
  'Technology',
  'Entertainment',
  'E-commerce',
  'Fintech',
  'Retail',
  'SaaS',
  'Design',
] as const;
