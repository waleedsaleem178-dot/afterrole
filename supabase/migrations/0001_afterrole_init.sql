-- =============================================================================
-- AfterRole — production schema (idempotent; safe to re-run)
-- =============================================================================
-- Product rules baked in:
--   * NOT anonymous — every story/comment references a real profile.
--   * NO overall company score. Themes come only from real published stories.
--   * Reactions are "helpful" and "been_there" only.
--
-- This supersedes the original supabase/schema.sql and is safe to run on a
-- database that already has the earlier tables — it only adds what's missing
-- and re-asserts policies.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- companies (real directory; authenticated users may suggest new ones)
-- ---------------------------------------------------------------------------
create table if not exists public.companies (
  id          text primary key,
  name        text not null,
  industry    text not null default 'Other',
  country     text,
  size_label  text,
  logo_color  text not null default '#3D725E',
  description text not null default '',
  logo_url    text,
  created_by  uuid references auth.users (id) on delete set null,
  is_verified boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table public.companies add column if not exists logo_url    text;
alter table public.companies add column if not exists created_by  uuid references auth.users (id) on delete set null;
alter table public.companies add column if not exists is_verified boolean not null default false;

create index if not exists companies_name_idx     on public.companies using gin (to_tsvector('simple', name));
create index if not exists companies_country_idx  on public.companies (country);
create index if not exists companies_industry_idx on public.companies (industry);

-- ---------------------------------------------------------------------------
-- profiles (real professional identity; 1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  name                text not null,
  username            text unique not null,
  headline            text not null default '',
  location            text not null default '',
  bio                 text not null default '',
  avatar_color        text not null default '#3D725E',
  avatar_url          text,
  verified            boolean not null default false,
  verification_status text not null default 'unverified'
                        check (verification_status in ('unverified', 'pending', 'verified')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
alter table public.profiles add column if not exists avatar_url          text;
alter table public.profiles add column if not exists verification_status text not null default 'unverified';
alter table public.profiles add column if not exists updated_at          timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- employment_history
-- ---------------------------------------------------------------------------
create table if not exists public.employment_history (
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
create index if not exists employment_profile_idx on public.employment_history (profile_id);
create index if not exists employment_company_idx on public.employment_history (company_id);

-- ---------------------------------------------------------------------------
-- stories (workplace experiences; always attributed; published => public)
-- ---------------------------------------------------------------------------
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
  status             text not null default 'published'
                       check (status in ('draft', 'published', 'removed')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
alter table public.stories add column if not exists status     text not null default 'published';
alter table public.stories add column if not exists updated_at timestamptz not null default now();

create index if not exists stories_company_idx on public.stories (company_id);
create index if not exists stories_author_idx  on public.stories (author_id);
create index if not exists stories_status_idx  on public.stories (status);
create index if not exists stories_created_idx on public.stories (created_at desc);

-- ---------------------------------------------------------------------------
-- comments
-- ---------------------------------------------------------------------------
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  story_id   uuid not null references public.stories (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_story_idx on public.comments (story_id);

-- ---------------------------------------------------------------------------
-- story_reactions ("helpful" / "been_there" only)
-- ---------------------------------------------------------------------------
create table if not exists public.story_reactions (
  story_id   uuid not null references public.stories (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type       text not null check (type in ('helpful', 'been_there')),
  created_at timestamptz not null default now(),
  primary key (story_id, profile_id, type)
);
create index if not exists reactions_story_idx on public.story_reactions (story_id);

-- ---------------------------------------------------------------------------
-- saved_stories
-- ---------------------------------------------------------------------------
create table if not exists public.saved_stories (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  story_id   uuid not null references public.stories (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, story_id)
);

-- ---------------------------------------------------------------------------
-- follows: people follow people, and people follow companies
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- notifications (visible only to recipient)
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id           uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  actor_id     uuid references public.profiles (id) on delete set null,
  type         text not null
                 check (type in ('helpful', 'comment', 'follow', 'company_stories', 'verification')),
  story_id     uuid references public.stories (id) on delete cascade,
  company_id   text references public.companies (id) on delete cascade,
  message      text not null default '',
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists notifications_recipient_idx on public.notifications (recipient_id, created_at desc);

-- ---------------------------------------------------------------------------
-- content_reports (never public)
-- ---------------------------------------------------------------------------
create table if not exists public.content_reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references public.profiles (id) on delete cascade,
  story_id     uuid references public.stories (id) on delete cascade,
  comment_id   uuid references public.comments (id) on delete cascade,
  reason       text not null default '',
  status       text not null default 'open' check (status in ('open', 'reviewing', 'resolved')),
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- verification_requests (private; evidence lives in a private storage bucket)
-- ---------------------------------------------------------------------------
create table if not exists public.verification_requests (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles (id) on delete cascade,
  employment_id uuid references public.employment_history (id) on delete set null,
  evidence_path text,
  status        text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at    timestamptz not null default now()
);
create index if not exists verification_profile_idx on public.verification_requests (profile_id);

-- =============================================================================
-- Aggregate views (counts derived from real rows — never denormalized)
-- =============================================================================
create or replace view public.story_reaction_counts as
select
  s.id as story_id,
  count(*) filter (where r.type = 'helpful')    as helpful_count,
  count(*) filter (where r.type = 'been_there')  as been_there_count
from public.stories s
left join public.story_reactions r on r.story_id = s.id
group by s.id;

create or replace view public.company_story_counts as
select
  c.id as company_id,
  count(s.id) filter (where s.status = 'published') as story_count
from public.companies c
left join public.stories s on s.company_id = c.id
group by c.id;

-- Theme percentages come ONLY from published stories' topics.
create or replace view public.company_topic_stats as
with published as (
  select company_id, unnest(topics) as topic
  from public.stories
  where status = 'published'
),
per_company as (
  select company_id, count(*) as total from published group by company_id
)
select
  p.company_id,
  p.topic,
  count(*) as mentions,
  round(100.0 * count(*) / nullif(pc.total, 0)) as percent
from published p
join per_company pc on pc.company_id = p.company_id
group by p.company_id, p.topic, pc.total;

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.companies             enable row level security;
alter table public.profiles              enable row level security;
alter table public.employment_history    enable row level security;
alter table public.stories               enable row level security;
alter table public.comments              enable row level security;
alter table public.story_reactions       enable row level security;
alter table public.saved_stories         enable row level security;
alter table public.company_follows       enable row level security;
alter table public.user_follows          enable row level security;
alter table public.notifications         enable row level security;
alter table public.content_reports       enable row level security;
alter table public.verification_requests enable row level security;

-- companies: public read; authenticated users may suggest new ones.
drop policy if exists "companies read" on public.companies;
create policy "companies read" on public.companies for select using (true);
drop policy if exists "companies insert authenticated" on public.companies;
create policy "companies insert authenticated" on public.companies
  for insert to authenticated with check (auth.uid() = created_by);

-- profiles: public read; write only your own row.
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (true);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

-- employment_history: public read; write only your own.
drop policy if exists "employment read" on public.employment_history;
create policy "employment read" on public.employment_history for select using (true);
drop policy if exists "employment write own" on public.employment_history;
create policy "employment write own" on public.employment_history
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- stories: published are public; drafts/removed only to author. Write only own.
drop policy if exists "stories read" on public.stories;
create policy "stories read" on public.stories
  for select using (status = 'published' or auth.uid() = author_id);
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
drop policy if exists "reactions read" on public.story_reactions;
create policy "reactions read" on public.story_reactions for select using (true);
drop policy if exists "reactions write own" on public.story_reactions;
create policy "reactions write own" on public.story_reactions
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- saved_stories: private to owner.
drop policy if exists "saves own" on public.saved_stories;
create policy "saves own" on public.saved_stories
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

-- notifications: visible only to recipient; recipient may mark read/delete.
drop policy if exists "notifications own" on public.notifications;
create policy "notifications own" on public.notifications
  for select using (auth.uid() = recipient_id);
drop policy if exists "notifications update own" on public.notifications;
create policy "notifications update own" on public.notifications
  for update using (auth.uid() = recipient_id);
drop policy if exists "notifications delete own" on public.notifications;
create policy "notifications delete own" on public.notifications
  for delete using (auth.uid() = recipient_id);

-- content_reports: not public. Reporter may create and see their own.
drop policy if exists "reports insert own" on public.content_reports;
create policy "reports insert own" on public.content_reports
  for insert with check (auth.uid() = reporter_id);
drop policy if exists "reports read own" on public.content_reports;
create policy "reports read own" on public.content_reports
  for select using (auth.uid() = reporter_id);

-- verification_requests: private to the requesting user.
drop policy if exists "verification own" on public.verification_requests;
create policy "verification own" on public.verification_requests
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
