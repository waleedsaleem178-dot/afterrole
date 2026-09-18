import type { Company } from '@/types';

import directoryJson from './companies.directory.json';

export interface CompanyDirectoryEntry {
  id: string;
  name: string;
  industry: string;
  country: string;
  sizeLabel: string;
  logoColor: string;
}

/** ~2,000 real companies (US + Pakistan). Lightweight directory entries. */
export const directoryEntries = directoryJson as CompanyDirectoryEntry[];

/** Expand a lite directory entry into a full Company (no stories yet). */
export function entryToCompany(e: CompanyDirectoryEntry): Company {
  return {
    id: e.id,
    name: e.name,
    industry: e.industry,
    country: e.country,
    sizeLabel: e.sizeLabel || '—',
    logoColor: e.logoColor,
    description: '',
    storyCount: 0,
    followerCount: 0,
    topics: [],
    positives: [],
    challenges: [],
    roleCategories: [],
  };
}

export const directoryCompanies: Company[] = directoryEntries.map(entryToCompany);
