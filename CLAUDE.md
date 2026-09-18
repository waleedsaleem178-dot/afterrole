# CLAUDE.md — AfterRole

Guidance for any future Claude session working in this repository.

## Golden rules

- **Work only in AfterRole** (`/home/user/afterrole`). This is a standalone
  project with its own git repository.
- **Never touch, modify, inspect, or commit anything in `wealth-position` /
  Arquo.** It is a completely separate product.
- **AfterRole uses real, visible identities.** There is **no anonymity** —
  never build anonymous users, posts, reviews, or comments.
- **No overall company star rating / score.** Surface topics, positives,
  challenges, and story counts instead.
- **Skeleton first, polish later.** Build/complete the navigable skeleton with
  mock data and local persistence before any visual redesign or backend.
- **Use centralized theme tokens.** All colors, spacing, typography, radius, and
  shadows live in `src/constants/*` and are consumed via `useTheme()`. Never
  scatter raw hex values in screens.
- **Use reusable components** from `src/components/ui` and `src/components/cards`.
  Do not build giant screen files with duplicated UI.
- **Do not connect Supabase** until explicitly requested. No production auth,
  payments, subscriptions, messaging, employer dashboards, or job board yet.
- **Do not invent major product changes** without documenting them in
  `docs/PRODUCT_BRIEF.md` and `docs/ROADMAP.md` first.

## Reactions

Stories use **Helpful** and **Been There** — never a generic Like/heart.

## Where things live

```
src/
  constants/   design tokens (colors, spacing, typography, radius, shadows, theme)
  types/       domain models (User, Company, Employment, Story, Comment, ...)
  data/        centralized mock data (users, companies, stories, comments, notifications)
  store/       Zustand store + AsyncStorage persistence
  hooks/       useTheme, useColorScheme
  components/
    ui/        reusable primitives (Button, Chip, Avatar, Card, Input, ...)
    cards/     StoryCard, CompanyCard, PersonCard, EmploymentCard
  app/         Expo Router routes (file-based)
```

## Docs

- `docs/PRODUCT_BRIEF.md` — product definition and permanent rules
- `docs/ROADMAP.md` — phased development strategy

## Stack

Expo · React Native · TypeScript · Expo Router · Safe Area Context ·
react-native-svg · expo-image · expo-haptics · expo-font · AsyncStorage ·
Reanimated · Lucide React Native · Zustand · Inter.

## Common commands

```bash
npm run ios        # iOS simulator (primary target)
npx expo start     # dev server
npx tsc --noEmit   # typecheck
npx eslint .       # lint
```
