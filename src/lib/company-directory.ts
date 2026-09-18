import { useEffect, useState } from 'react';

import { allCompanies, mockCompanies } from '@/data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Company } from '@/types';

/**
 * Live company directory with graceful local fallback.
 *
 * When Supabase is configured (EXPO_PUBLIC_SUPABASE_* set) this reads the real
 * `companies` table; otherwise — and on any error — it falls back to the
 * bundled ~2,000-company list. Featured companies (with stories/topics) always
 * win on id so their richer local data is preserved. Loaded once and cached.
 */

interface CompanyRow {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  size_label: string | null;
  logo_color: string | null;
  description: string | null;
}

function rowToCompany(r: CompanyRow): Company {
  return {
    id: r.id,
    name: r.name,
    industry: r.industry ?? 'Other',
    country: r.country ?? undefined,
    sizeLabel: r.size_label || '—',
    logoColor: r.logo_color ?? '#3D725E',
    description: r.description ?? '',
    storyCount: 0,
    followerCount: 0,
    topics: [],
    positives: [],
    challenges: [],
    roleCategories: [],
  };
}

let cache: Company[] | null = null;
let inflight: Promise<Company[]> | null = null;

async function fetchFromSupabase(): Promise<Company[]> {
  if (!supabase) return allCompanies;

  // PostgREST caps rows per request (default 1000), so page through them.
  const PAGE = 1000;
  const rows: CompanyRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('companies')
      .select('id,name,industry,country,size_label,logo_color,description')
      .order('name')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    const batch = (data ?? []) as CompanyRow[];
    rows.push(...batch);
    if (batch.length < PAGE) break;
  }

  const remote = rows.map(rowToCompany);
  // Featured (local, story-rich) companies win on id collisions.
  const featured = new Set(mockCompanies.map((c) => c.id));
  return [...mockCompanies, ...remote.filter((c) => !featured.has(c.id))];
}

/** Resolve the company universe once, caching the result. Never throws. */
export async function loadCompanies(): Promise<Company[]> {
  if (cache) return cache;
  if (!isSupabaseConfigured || !supabase) {
    cache = allCompanies;
    return cache;
  }
  if (!inflight) {
    inflight = fetchFromSupabase()
      .then((list) => {
        cache = list.length > 0 ? list : allCompanies;
        return cache;
      })
      .catch(() => {
        cache = allCompanies; // network/permission error -> stay on local
        return cache;
      });
  }
  return inflight;
}

/**
 * The full company universe (featured + directory). Starts on the local list
 * and swaps to Supabase data once loaded, so screens always have something.
 */
export function useCompanies(): { companies: Company[]; loading: boolean; live: boolean } {
  const [companies, setCompanies] = useState<Company[]>(cache ?? allCompanies);
  const [loading, setLoading] = useState<boolean>(!cache && isSupabaseConfigured);

  useEffect(() => {
    // Initial state already reflects a warm cache; only load when it's cold.
    if (cache) return;
    let alive = true;
    loadCompanies().then((list) => {
      if (alive) {
        setCompanies(list);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return { companies, loading, live: isSupabaseConfigured };
}
