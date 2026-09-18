-- =============================================================================
-- AfterRole — Storage buckets + policies (idempotent)
-- =============================================================================
-- avatars              : PUBLIC read, owner-writable
-- company-logos        : PUBLIC read, authenticated-writable
-- verification-evidence: PRIVATE (owner-only) — employment proof never public
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('company-logos', 'company-logos', true),
  ('verification-evidence', 'verification-evidence', false)
on conflict (id) do update set public = excluded.public;

-- avatars: anyone can read; a user writes only under their own uid/ prefix.
drop policy if exists "avatars read" on storage.objects;
create policy "avatars read" on storage.objects
  for select using (bucket_id = 'avatars');
drop policy if exists "avatars write own" on storage.objects;
create policy "avatars write own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars update own" on storage.objects;
create policy "avatars update own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- company-logos: anyone can read; any authenticated user can contribute.
drop policy if exists "logos read" on storage.objects;
create policy "logos read" on storage.objects
  for select using (bucket_id = 'company-logos');
drop policy if exists "logos write authenticated" on storage.objects;
create policy "logos write authenticated" on storage.objects
  for insert to authenticated with check (bucket_id = 'company-logos');

-- verification-evidence: PRIVATE. Only the owner can read/write their files
-- (stored under {uid}/...). No public read policy exists, so it stays private.
drop policy if exists "verification read own" on storage.objects;
create policy "verification read own" on storage.objects
  for select to authenticated
  using (bucket_id = 'verification-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "verification write own" on storage.objects;
create policy "verification write own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'verification-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
