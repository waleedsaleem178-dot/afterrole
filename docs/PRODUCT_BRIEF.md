# AfterRole — Product Brief

> **Know before you join.**

AfterRole is an **iPhone-first professional workplace storytelling app** where
real people share first-hand experiences about companies they have worked at.

It is **not** an anonymous review app. Every story and every comment belongs to
a real, visible user profile.

The product should eventually feel like **LinkedIn × Letterboxd × a modern
consumer social app** — but cleaner than LinkedIn, more human than Glassdoor,
more editorial, more modern, more trustworthy, less corporate, more premium.

It is **not** a generic SaaS dashboard.

---

## Permanent product rules

These rules are non-negotiable and apply to every screen and feature.

### 1. No anonymity
Never build "Anonymous User", "Post Anonymously", "Anonymous Review", or
"Anonymous Comment". Every post and comment is attributed to a real visible
profile.

### 2. No overall company star rating
Do **not** show a company score (`4.2/5`), "best company", or "worst company".
Instead surface:
- Frequently mentioned topics
- Common positives
- Common challenges
- Topics people discuss
- Story counts

### 3. Nuanced experiences
Not every story is negative. Stories should span the real range: loved the team
but left for a better offer; liked flexibility but disliked promotion paths;
left because of relocation; was laid off; still works there; mixed experience.

### 4. Real professional context
A workplace story shows professional context, e.g.:

```
Waleed Saleem ✓
CRM & Automation Specialist
Former CRM Specialist at Acme · 1 yr 8 mos
```

---

## Reactions

Stories use **Helpful** and **Been There** reactions — never a generic Like or
heart. Reactions persist locally.

---

## Core objects

- **User** — real visible profile with headline, location, bio, followers,
  following, employment history, verification.
- **Company** — name, industry, story count, discussed topics (with %),
  common positives, common challenges, role categories. **No score.**
- **Employment** — company, role, dates, current flag, verified flag.
- **Story** — author, company, role, employment context, body, topics,
  "would work again", Helpful / Been There counts, comments. May be a
  "Final Straw".
- **Comment** — attributed to a real profile.
- **Notification** — helpful / comment / follow / company stories / verification.

---

## Navigation

Bottom tabs: **Home · Discover · Share · Activity · You**. The center **Share**
action stands out visually and opens the Create Story flow.

---

## Current stack (do not change without documenting)

Expo · React Native · TypeScript · Expo Router · React Native Safe Area Context ·
react-native-svg · expo-image · expo-haptics · expo-font · AsyncStorage ·
React Native Reanimated · Lucide React Native · Zustand · Inter.

**Not yet:** Supabase, production auth, payments, subscriptions, messaging,
employer dashboards, job board, ranking algorithms.

---

## Design architecture

The visual design **will** change later, so design values are centralized, never
scattered as raw hex in screens. Semantic tokens live in `src/constants/`:

`background · surface · surfaceElevated · textPrimary · textSecondary ·
textMuted · accent · accentForeground · border · success · danger · warning`

Every screen consumes semantic tokens via `useTheme()`. Light and dark mode both
work; final color tuning is deferred to the redesign phase.
