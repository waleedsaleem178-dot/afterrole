# Supabase setup

AfterRole ships wired for Supabase but still runs entirely on local mock data.
Follow these steps to stand up a real backend and load the ~2,000-company
directory (US + Pakistan). Nothing here builds production auth — that stays
deferred on purpose.

## What you get

- `supabase/schema.sql` — tables, views, and Row Level Security for companies,
  profiles, employment, stories, comments, reactions, and follows.
- `supabase/seed/companies.sql` — 2,055 real companies (United States + Pakistan).
- `src/lib/supabase.ts` — a client that activates only when env vars are set.

## 1. Create a project

1. Go to <https://supabase.com/dashboard> and create a new project.
2. Pick a strong database password and a region close to your users.
3. Wait for it to finish provisioning (~2 minutes).

## 2. Create the schema

1. In the dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of `supabase/schema.sql` and click **Run**.
3. You should see the tables appear under **Table Editor**.

The script is safe to re-run — it uses `if not exists` / `create or replace`.

## 3. Load the company directory

1. Open **SQL Editor → New query** again.
2. Paste the contents of `supabase/seed/companies.sql` and click **Run**.
   - It's one `insert ... on conflict (id) do nothing`, so re-running is safe.
3. Verify: `select count(*) from public.companies;` should return **2055**.

> The seed file is ~200 KB. If the SQL Editor rejects the paste for size, use
> the Supabase CLI instead:
> `supabase db execute --file supabase/seed/companies.sql`

## 4. Get your keys

In **Project Settings → API**, copy:

- **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
- **anon / public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

> The anon key is public and protected by Row Level Security — it's safe to ship
> in the app. **Never** put the `service_role` key in the app or in `.env`.

## 5. Configure the app

```bash
cp .env.example .env
# then edit .env and paste your two values
```

Restart the dev server so Expo picks up the new env vars:

```bash
npx expo start -c
```

At runtime, `isSupabaseConfigured` (from `src/lib/supabase.ts`) flips to `true`
and `supabase` becomes a live client. Until then the app keeps using local mock
data, so you can migrate one screen at a time.

## 6. (Optional) Point reads at Supabase

The directory of companies is the easiest first migration. Example:

```ts
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function fetchCompanies() {
  if (!isSupabaseConfigured || !supabase) return null; // fall back to local
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, industry, country, size_label, logo_color')
    .order('name');
  if (error) throw error;
  return data;
}
```

Story counts and reaction counts come from the `company_story_counts` and
`story_reaction_counts` views, so they never drift from the underlying rows.

## Notes

- **Auth is deferred.** `profiles.id` references `auth.users(id)` so the schema
  is ready for Supabase Auth later, but the app does not sign users in yet.
- **Product rules are enforced in the schema:** every story/comment requires a
  real `author_id` (no anonymity), reactions are limited to `helpful` /
  `been_there`, and there is no company score column anywhere.
