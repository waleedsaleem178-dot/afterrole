# AfterRole — Roadmap & Development Strategy

## Guiding strategy

**Skeleton first, polish later.** Build the complete, navigable product skeleton
with mock data and local persistence before any visual redesign or backend work.

Priority order:
1. Navigation
2. Screen structure
3. Mock data
4. Local interactions
5. Local persistence
6. Functional flows
7. _Then_ a separate visual redesign

---

## Phase 1 — Product skeleton (current)

Goal: every route exists, is navigable, and contains a usable skeleton (no blank
or TODO screens). All interactions are local and persist via AsyncStorage.

- [x] Centralized design tokens (`src/constants/*`)
- [x] Reusable UI component kit (`src/components/ui`, cards)
- [x] Mock data (`src/data/*`)
- [x] Zustand store + AsyncStorage persistence (`src/store`)
- [x] Tab navigation (Home · Discover · Share · Activity · You)
- [x] Onboarding + mock sign-in + create profile
- [x] Company discovery, search, company detail
- [x] Story feed, story detail, comments, report
- [x] Create Story flow (3 steps) + publish success
- [x] Employment history, add employment, verification prototype
- [x] Social: Helpful / Been There, save, follow, activity
- [x] Settings with no dead buttons

### Explicitly out of scope for Phase 1
Supabase, real auth, payments, subscriptions, messaging, employer dashboards,
job board, ranking algorithms, final visual polish.

---

## Phase 2 — Visual redesign (later)

Full branding + visual design pass. Because all screens consume semantic theme
tokens, the redesign is mostly a tokens/components effort, not a rewrite.

- Welcome / branding redesign
- Final color system, typography scale, spacing rhythm
- Motion & micro-interactions
- Illustration / imagery system

---

## Phase 3 — Backend & real data (later, only when requested)

- Supabase integration (auth, database, storage)
- Real employment verification pipeline
- Real notifications
- Media uploads (avatars, company logos)

---

## Suggested milestone commits for Phase 1

1. `feat: build navigation and onboarding skeleton`
2. `feat: add company discovery and profiles`
3. `feat: add workplace story flows`
4. `feat: add employment and verification prototype`
5. `feat: add local social interactions`

## Quality gates (run before finishing)

- `npx tsc --noEmit`
- `npx eslint .`
- Web export / bundle validation (`npx expo export --platform web`)
