-- =============================================================================
-- AfterRole — Supabase schema
-- =============================================================================
-- Product rules baked into this schema:
--   * NOT anonymous. Every story/comment references a real profile.
--   * Companies have discussed topics / green & red flags but NO overall score.
--   * Reactions are "helpful" and "been_there" only.
--
-- Run order:
--   1) this file (schema.sql)      -> tables, policies, views
--   2) seed/companies.sql          -> ~2,000 real companies (US + Pakistan)
--
-- Safe to re-run: uses "if not exists" / "create or replace" throughout.
-- =============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- =============================================================================
-- companies (public directory — real companies, no per-user data)
-- =============================================================================
create table if not exists public.companies (
  id          text primary key,
  name        text not null,
  industry    text not null default 'Other',
  country     text,
  size_label  text,
  logo_color  text not null default '#3D725E',
  description text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists companies_name_idx    on public.companies using gin (to_tsvector('simple', name));
create index if not exists companies_country_idx  on public.companies (country);
create index if not exists companies_industry_idx on public.companies (industry);

-- =============================================================================
-- profiles (real professional identity; 1:1 with auth.users when auth is added)
-- =============================================================================
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  name           text not null,
  username       text unique not null,
  headline       text not null default '',
  location       text not null default '',
  bio            text not null default '',
  avatar_color   text not null default '#3D725E',
  verified       boolean not null default false,
  created_at     timestamptz not null default now()
);

-- =============================================================================
-- employment (a profile's work history; links to a company when known)
-- =============================================================================
create table if not exists public.employment (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles (id) on delete cascade,
  company_id   text references public.companies (id) on delete set null,
  company_name text not null,
  role         text not null,
  location     text,
  start_label  text not null default '',
  end_label    text not null default 'Present',
  is_current   boolean not null default false,
  verified     boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists employment_profile_idx on public.employment (profile_id);
create index if not exists employment_company_idx on public.employment (company_id);

-- =============================================================================
-- stories (workplace experiences — always attributed to a real author)
-- =============================================================================
create table if not exists public.stories (
  id                 uuid primary key default gen_random_uuid(),
  author_id          uuid not null references public.profiles (id) on delete cascade,
  company_id         text not null references public.companies (id) on delete cascade,
  role               text not null,
  employment_context text not null default '',
  employment_status  text not null default 'former'
                       check (employment_status in ('current', 'former')),
  end_reason         text,
  excerpt            text not null default '',
  body               text not null,
  final_straw        text,
  what_was_good      text,
  topics             text[] not null default '{}',
  would_work_again   text check (would_work_again in ('Yes', 'Maybe', 'No')),
  is_final_straw     boolean not null default false,
  created_at         timestamptz not null default now()
);

create index if not exists stories_company_idx on public.stories (company_id);
create index if not exists stories_author_idx  on public.stories (author_id);
create index if not exists stories_created_idx on public.stories (created_at desc);

-- =============================================================================
-- comments (also always attributed to a real author)
-- =============================================================================
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  story_id   uuid not null references public.stories (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_story_idx on public.comments (story_id);

-- =============================================================================
-- reactions (only "helpful" and "been_there"; one of each per person per story)
-- =============================================================================
create table if not exists public.reactions (
  story_id   uuid not null references public.stories (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type       text not null check (type in ('helpful', 'been_there')),
  created_at timestamptz not null default now(),
  primary key (story_id, profile_id, type)
);

-- =============================================================================
-- follows (people follow people, and people follow companies)
-- =============================================================================
create table if not exists public.company_follows (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  company_id text not null references public.companies (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, company_id)
);

create table if not exists public.user_follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

-- =============================================================================
-- Aggregates (counts live in views so they never drift from the source rows)
-- =============================================================================
create or replace view public.story_reaction_counts as
select
  s.id as story_id,
  count(*) filter (where r.type = 'helpful')    as helpful_count,
  count(*) filter (where r.type = 'been_there')  as been_there_count
from public.stories s
left join public.reactions r on r.story_id = s.id
group by s.id;

create or replace view public.company_story_counts as
select
  c.id as company_id,
  count(s.id) as story_count
from public.companies c
left join public.stories s on s.company_id = c.id
group by c.id;

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- Everything public-readable (this is a public workplace-story product);
-- writes are restricted to the authenticated owner of the row.
-- Companies are read-only to clients and seeded/managed via the service role.

alter table public.companies       enable row level security;
alter table public.profiles        enable row level security;
alter table public.employment      enable row level security;
alter table public.stories         enable row level security;
alter table public.comments        enable row level security;
alter table public.reactions       enable row level security;
alter table public.company_follows enable row level security;
alter table public.user_follows    enable row level security;

-- companies: anyone can read; no client writes.
drop policy if exists "companies read" on public.companies;
create policy "companies read" on public.companies for select using (true);

-- profiles: public read; write only your own row.
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (true);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

-- employment: public read; write only your own.
drop policy if exists "employment read" on public.employment;
create policy "employment read" on public.employment for select using (true);
drop policy if exists "employment write own" on public.employment;
create policy "employment write own" on public.employment
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- stories: public read; write only your own.
drop policy if exists "stories read" on public.stories;
create policy "stories read" on public.stories for select using (true);
drop policy if exists "stories write own" on public.stories;
create policy "stories write own" on public.stories
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- comments: public read; write only your own.
drop policy if exists "comments read" on public.comments;
create policy "comments read" on public.comments for select using (true);
drop policy if exists "comments write own" on public.comments;
create policy "comments write own" on public.comments
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- reactions: public read (for counts); write only your own.
drop policy if exists "reactions read" on public.reactions;
create policy "reactions read" on public.reactions for select using (true);
drop policy if exists "reactions write own" on public.reactions;
create policy "reactions write own" on public.reactions
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- company_follows: public read; write only your own.
drop policy if exists "company_follows read" on public.company_follows;
create policy "company_follows read" on public.company_follows for select using (true);
drop policy if exists "company_follows write own" on public.company_follows;
create policy "company_follows write own" on public.company_follows
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- user_follows: public read; write only your own.
drop policy if exists "user_follows read" on public.user_follows;
create policy "user_follows read" on public.user_follows for select using (true);
drop policy if exists "user_follows write own" on public.user_follows;
create policy "user_follows write own" on public.user_follows
  for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);
