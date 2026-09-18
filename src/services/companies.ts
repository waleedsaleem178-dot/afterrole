import type { Company } from '@/types';
import type { CompanyRow, CompanyStoryCountRow, CompanyTopicStatRow } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';
import { toCompany } from './mappers';

const COLS = 'id,name,industry,country,size_label,logo_color,description,logo_url,created_by,is_verified,created_at';

/** Full directory, paginated past PostgREST's per-request cap. */
export async function listCompanies(): Promise<Company[]> {
  const client = db();
  const PAGE = 1000;
  const rows: CompanyRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await client
      .from('companies')
      .select(COLS)
      .order('name')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    const batch = (data ?? []) as CompanyRow[];
    rows.push(...batch);
    if (batch.length < PAGE) break;
  }
  return rows.map((r) => toCompany(r));
}

export async function searchCompanies(query: string, limit = 40): Promise<Company[]> {
  const q = query.trim();
  if (!q) return [];
  const { data, error } = await db()
    .from('companies')
    .select(COLS)
    .ilike('name', `%${q}%`)
    .order('name')
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as CompanyRow[]).map((r) => toCompany(r));
}

/** One company with REAL story count + theme percentages (from published stories only). */
export async function getCompany(id: string): Promise<Company | null> {
  const client = db();
  const { data, error } = await client.from('companies').select(COLS).eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const [countRes, topicsRes] = await Promise.all([
    client.from('company_story_counts').select('story_count').eq('company_id', id).maybeSingle(),
    client.from('company_topic_stats').select('*').eq('company_id', id),
  ]);

  const storyCount = (countRes.data as CompanyStoryCountRow | null)?.story_count ?? 0;
  const topics = (topicsRes.data ?? []) as CompanyTopicStatRow[];
  return toCompany(data as CompanyRow, { storyCount, topics });
}

export interface NewCompanyInput {
  name: string;
  industry?: string;
  country?: string;
}

/** Authenticated users can suggest a missing company. */
export async function suggestCompany(input: NewCompanyInput): Promise<Company> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Sign in to add a company.');
  const name = input.name.trim();
  if (!name) throw new Error('Company name is required.');
  const id = `usr_${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}`;
  const { data, error } = await db()
    .from('companies')
    .insert({
      id,
      name,
      industry: input.industry ?? 'Other',
      country: input.country ?? null,
      created_by: uid,
      is_verified: false,
    })
    .select(COLS)
    .single();
  if (error) throw error;
  return toCompany(data as CompanyRow);
}
