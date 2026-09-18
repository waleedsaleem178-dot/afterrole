import { allCompanies, mockCompanies, mockStories, mockUsers } from '@/data';
import type { Company, Story, User } from '@/types';

export type SearchResult =
  | { key: string; type: 'company'; company: Company }
  | { key: string; type: 'person'; user: User }
  | { key: string; type: 'story'; story: Story }
  | { key: string; type: 'role'; role: string; companyId: string };

/** Cap company matches so a broad query can't render thousands of rows. */
const MAX_COMPANY_RESULTS = 40;

export function searchAll(rawQuery: string, companyPool: Company[] = allCompanies): SearchResult[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  // Companies: search the full real directory (US + Pakistan), capped.
  // Prefix (name-starts-with) matches rank above substring matches.
  const prefix: SearchResult[] = [];
  const contains: SearchResult[] = [];
  for (const company of companyPool) {
    const name = company.name.toLowerCase();
    if (name.startsWith(q)) {
      prefix.push({ key: `c:${company.id}`, type: 'company', company });
    } else if (`${name} ${company.industry} ${company.country ?? ''}`.toLowerCase().includes(q)) {
      contains.push({ key: `c:${company.id}`, type: 'company', company });
    }
    if (prefix.length >= MAX_COMPANY_RESULTS) break;
  }
  results.push(...[...prefix, ...contains].slice(0, MAX_COMPANY_RESULTS));

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
