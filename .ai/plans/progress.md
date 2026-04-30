# OakRate — Progress

The plan runs as **two parallel tracks**. The **Build Track** is phased code work. The **Seed Track** is async manual data entry via the admin app. They progress independently — Build doesn't wait on Seed except at launch.

---

# Build Track

## Phase 0: Foundation ✅

- [x] Supabase project created
- [x] PostGIS enabled
- [x] Email auth configured
- [x] Storage bucket (`photos`, public, 5MB limit)
- [ ] Apple Sign-In auth provider (pre-launch, not MVP blocker)
- [ ] Google Sign-In auth provider (pre-launch, not MVP blocker)
- [x] Database schema + RLS policies
- [x] Expo project scaffold (TypeScript, EAS Build)
- [x] Shared types pattern (`supabase gen types` → `src/lib/database.types.ts`)
- [~] CI/CD (EAS Build, linting, type-checking) — lint + typecheck scripts ready, EAS init deferred
- [ ] Dev-client migration (Expo Go → custom dev build) — plan in [convert-expo-go-to-dev-build.md](convert-expo-go-to-dev-build.md). Scheduled for the Phase 2 → Phase 3 boundary, or sooner if a trigger fires.
- [x] Environment config (`.env.local` with Supabase URL + anon key)
- [x] Storybook setup (on-device, `npm run storybook`)
- [x] Design tokens (`src/constants/theme.ts`) — WCAG AA contrast audit complete
- [x] `useThemeColors` hook (`src/hooks/useThemeColors.ts`)
- [x] Navigation skeleton (tabs + stack navigators + detail routes)

### Storybook Components

- [x] ThemeReference story (design token reference sheet)
- [x] SentimentInput (4-button sentiment selector with animation)
- [x] SentimentDistribution (horizontal bar chart)
- [x] ScoreDisplay (0–100 score with color coding + "New" state)
- [x] TagChip (display-only + interactive modes)
- [x] DistanceBadge (formatted distance pill)
- [x] LeaderboardRow (ranked item row composing ScoreDisplay, TagChip, DistanceBadge)

## Phase 1: Schema + Admin App ✅

### 1a: Schema Updates ✅

- [x] Add `categories.featured` column (boolean, default false)
- [x] Add `profiles.role` column (text, default 'user')
- [x] Seed 7 featured categories (pizza, wings, tacos, ramen, sushi, ice cream, barbecue) with attribute tags
- [x] Seed Raleigh market record (done in initial migration)
- [x] RLS policy for admin-only routes (`is_admin()` helper + policies)
- [x] Update rating trigger to new weights (-3, -1, +1, +2)
- [x] Regenerate types (`npm run gen-types`)

### 1b: Admin Web App (`admin/` — Vite + Vue 3 + PrimeVue) ✅

- [x] Build and deploy admin app — see [.ai/plans/admin/progress.md](admin/progress.md) for phase-level detail. Plan: [.ai/plans/admin/implementation-plan.md](admin/implementation-plan.md).

## Phase 2: Core App — Read Path (Vertical Slices)

Built as vertical slices — each slice ships one screen end-to-end (hook + components + screen + nav + fallback). See [implementation-plan.md](implementation-plan.md#phase-2-core-app--read-path) for slice descriptions and [query-hooks.md](query-hooks.md) for hook contracts.

### Cross-slice setup

- [ ] Install TanStack Query; configure `QueryClient` per cache strategy in `query-hooks.md`
- [ ] Mount `QueryClientProvider` at app root
- [ ] Add `ListResult<T>` and `DetailResult<T, S>` types in `src/lib/queries/types.ts`

### Slice 1: Category Leaderboard

- [ ] `useLeaderboard(categorySlug)` — primary + nearby cross-category fallback, merge logic inlined
- [ ] `FallbackBanner` component (keyed off `fallbackReason`)
- [ ] Category Leaderboard screen
- [ ] Temporary dev nav route into the screen (replaced in Slice 2)
- [ ] Verify: dense category renders primary; sparse category renders fallback

### Slice 2: Browse (Home)

- [ ] `useCategories` — featured categories, `staleTime: Infinity` override
- [ ] `useNearby(location)` — second `ListResult` hook (PostGIS distance)
- [ ] Extract `mergeFallback` to `src/lib/queries/mergeFallback.ts`; refactor `useLeaderboard` to use it
- [ ] `CategoryCard` component
- [ ] Browse screen — featured category grid + "Top Rated Near You"
- [ ] Wire nav: Browse tab → Browse → category → Leaderboard; remove temp dev route
- [ ] Verify: full nav flow + both Browse queries render with and without nearby data

### Slice 3: Item Detail

- [ ] `useItem(id)` — primary + supplementary (restaurant's other rated items when sparse), merge logic inlined
- [ ] `useHighConfidenceAttributes(itemId)`
- [ ] `ItemCard` component
- [ ] Item Detail screen — score, sentiment distribution, high-confidence tags, photos, supplementary section on `confidence === "early"`
- [ ] Wire nav: leaderboard row → item detail
- [ ] Verify: high-confidence and "early" items both render correctly

### Slice 4: Restaurant Detail

- [ ] `useRestaurant(id)` — primary + supplementary (top-rated nearby in matching categories) when no rated items
- [ ] Decide: extract shared `DetailResult` merge helper or keep both detail hooks inlined
- [ ] `RestaurantCard` component (if needed for supplementary content)
- [ ] Restaurant Detail screen — info, items by category by score, supplementary path
- [ ] Wire nav: item detail → restaurant link → Restaurant Detail
- [ ] Verify: fully-rated and unrated restaurants both render correctly

### Slice 5: Search

- [ ] `useSearch(query)` — FTS across restaurants/items, location-aware ranking, fallback to trending + top categories on zero results (uses extracted `mergeFallback`)
- [ ] `SearchInput` component
- [ ] Search screen
- [ ] Wire nav: Search tab
- [ ] Verify: hits render; zero-results renders trending fallback with banner

## Phase 3: Core App — Write Path

### 3a: Auth Integration

- [ ] Sign-in / sign-up UI (email)
- [ ] Auth gate on rating flow (return to flow after auth)

### 3b: Rating Flow

- [ ] Restaurant selection (location-aware autocomplete + "add new")
- [ ] Item selection (filtered by restaurant, autocomplete + "add new")
- [ ] Sentiment input (single tap, SentimentInput component)
- [ ] Attribute tag selection (optional, category-specific)
- [ ] Photo capture/upload (optional, expo-image-picker → Supabase Storage)
- [ ] Submit + confirmation

### 3c: Score Recalculation

- [ ] Postgres trigger for OakRate score recalculation on rating insert/update/delete

### 3d: "Add New" Flows

- [ ] Add new restaurant (name, address, geocode, assign to market)
- [ ] Add new item (name, category assignment, attached to restaurant)

## Phase 4: Profile + Polish

- [ ] Profile screen (rating history, total count, edit display name)
- [ ] My Ratings list (edit/delete capability)
- [ ] Loading states (skeleton screens)
- [ ] Error states (retry patterns, offline detection)
- [ ] Performance pass (FlatList virtualization, image optimization, query prefetching)
- [ ] Accessibility audit (screen reader, focus order, touch targets)

## Phase 5: Launch Prep

- [ ] App Store assets (icon, screenshots, description)
- [ ] Privacy policy + terms of service
- [ ] EAS Submit (iOS + Google Play)
- [ ] Vercel deployment (Expo web static export)
- [ ] Link previews — edge meta injection ([link-previews.md](link-previews.md))
  - [ ] Custom HTML template with placeholder meta tags
  - [ ] `api/meta.ts` edge function with Supabase resolvers per route pattern
  - [ ] `vercel.json` rewrite ordering
  - [ ] `@vercel/og` endpoints for restaurant / item / category cards
  - [ ] `expo-router/head` usage on detail pages for client-side updates
- [ ] Analytics (rating events, flow completion, leaderboard views, search queries, redirect events)
- [ ] Push notification plumbing (Expo Notifications config)
- [ ] Data QA (verify seeded data accuracy and category density)
- [ ] Beta test (TestFlight / internal track)

---

# Seed Track

Manual data entry via the admin app at [admin.oakrate.com](https://admin.oakrate.com). Runs async to Build Track. Required for launch (real-data UX validation, leaderboard density), not for dev iteration — Build Track screens can develop against fixtures.

- [ ] Seed Raleigh restaurants across all 7 featured categories
- [ ] Seed menu items per restaurant
- [ ] Seed ratings per item (admin's honest ratings)
- [ ] Verify leaderboard density (5–10 ranked items per category minimum)
