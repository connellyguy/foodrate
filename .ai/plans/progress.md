# OakRank — Progress

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

## Phase 1: Admin + Data Seeding

### 1a: Schema Updates

- [x] Add `categories.featured` column (boolean, default false)
- [x] Add `profiles.role` column (text, default 'user')
- [x] Seed 7 featured categories (pizza, wings, tacos, ramen, sushi, ice cream, barbecue) with attribute tags
- [x] Seed Raleigh market record (done in initial migration)
- [x] RLS policy for admin-only routes (`is_admin()` helper + policies)
- [x] Update rating trigger to new weights (-3, -1, +1, +2)
- [x] Regenerate types (`npm run gen-types`)

### 1b: Admin Web App (`admin/` — Vite + Vue 3 + PrimeVue)

See [.ai/plans/admin/implementation-plan.md](admin/implementation-plan.md) for full implementation plan. Progress tracked in [.ai/plans/admin/progress.md](admin/progress.md).

- [ ] Phase A: Scaffold + Auth (Vite, PrimeVue, Supabase client, login, layout)
- [ ] Phase B: Restaurant CRUD (DataTable, create/edit/delete, Nominatim geocoding)
- [ ] Phase C: Item CRUD + Batch Entry (rapid-fire, paste mode)
- [ ] Phase D: Rating Seed + Browse (seed dialog, rating table)
- [ ] Phase E: Moderation (migration, status toggling, bulk actions)
- [ ] Phase F: Dashboard (seeding health, gap detection)
- [ ] Phase G: Deploy (Vercel, admin.oakrank.com)

### 1c: Data Seeding

- [ ] Seed Raleigh restaurants across all 7 featured categories
- [ ] Seed menu items per restaurant
- [ ] Seed ratings per item (admin's honest ratings)
- [ ] Verify leaderboard density (5–10 ranked items per category minimum)

## Phase 2: Core App — Read Path

### 2a: Query Layer

- [ ] `useCategories` — featured categories for browse grid
- [ ] `useLeaderboard(categorySlug)` — ranked items per category per market
- [ ] `useRestaurant(id)` — restaurant detail with items grouped by category
- [ ] `useItem(id)` — item detail with sentiment distribution + high-confidence attributes
- [ ] `useSearch(query)` — Postgres FTS across restaurants and items
- [ ] `useNearby(location)` — top-rated items near user (PostGIS)
- [ ] `useHighConfidenceAttributes(itemId)` — frequently-tagged attributes per item

### 2b: Remaining Components

- [ ] CategoryCard (browse grid tile)
- [ ] RestaurantCard (name, distance, top item, score)
- [ ] ItemCard (item name, restaurant, score, top tags)
- [ ] SearchInput (autocomplete)
- [ ] Confidence-redirect pattern (fallback content for sparse data)

### 2c: Screens

- [ ] Browse (Home) — category grid + "Top Rated Near You"
- [ ] Category Leaderboard — ranked items, cross-category fallback for sparse categories
- [ ] Restaurant Detail — items ranked by score, fallback to nearby if no ratings
- [ ] Item Detail — score, sentiment distribution, high-confidence tags, photos
- [ ] Search — autocomplete results, trending fallback on no results

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

- [ ] Postgres trigger for OakRank score recalculation on rating insert/update/delete

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
- [ ] Vercel deployment (Expo web export)
- [ ] Analytics (rating events, flow completion, leaderboard views, search queries, redirect events)
- [ ] Push notification plumbing (Expo Notifications config)
- [ ] Data QA (verify seeded data accuracy and category density)
- [ ] Beta test (TestFlight / internal track)
