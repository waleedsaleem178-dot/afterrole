import type { Employment } from '@/types';
import type { EmploymentRow } from '@/types/database';

import { db } from './client';
import { getSession } from './auth';
import { toEmployment } from './mappers';

export async function listEmployment(profileId: string): Promise<Employment[]> {
  const { data, error } = await db()
    .from('employment_history')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toEmployment);
}

export async function addEmployment(input: Omit<Employment, 'id' | 'verified'>): Promise<Employment> {
  const uid = (await getSession())?.user.id;
  if (!uid) throw new Error('Not signed in.');
  const { data, error } = await db()
    .from('employment_history')
    .insert({
      profile_id: uid,
      company_id: input.companyId ?? null,
      company_name: input.companyName,
      role: input.role,
      location: input.location ?? null,
      start_label: input.startLabel,
      end_label: input.endLabel,
      is_current: input.current,
      verified: false,
    })
    .select('*')
    .single();
  if (error) throw error;
  return toEmployment(data as EmploymentRow);
}

export async function removeEmployment(id: string): Promise<void> {
  const { error } = await db().from('employment_history').delete().eq('id', id);
  if (error) throw error;
}
