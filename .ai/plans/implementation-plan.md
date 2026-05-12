# OakRate — Implementation Plan

## Phase 0: Foundation (Infrastructure + Tooling) ✅

**Goal:** Everything needed before writing app code.

- **Supabase project setup** — create project, enable PostGIS, configure auth providers (email now; Apple + Google Sign-In pre-launch), set up Storage bucket for photos (public, 5MB limit)
- **Database schema + RLS** — core tables (restaurants, items, categories, ratings, attribute_tags, rating_attributes, markets, profiles), RLS policies from day one
- **Expo project scaffold** — TypeScript, EAS Build config, environment variables, file-based routing
- **Shared types** — `supabase gen types` → `src/lib/database.types.ts`
- **Design system** — design tokens (WCAG AA audited), `useThemeColors` hook, on-device Storybook
- **Core components** — ScoreDisplay, SentimentInput, SentimentDistribution, TagChip, DistanceBadge, LeaderboardRow, ThemeReference
- **Navigation skeleton** — bottom tabs (Browse, Rate, Profile, Search), stack navigators, detail routes (restaurant/category/item)

**Status: COMPLETE.** All items above are built and working.

---

## Phase 1: Admin Seeding + Schema Updates

**Goal:** Bootstrap the app with enough data to feel useful from day one. Admin-driven, not script-driven.

### 1.1: Schema Updates

The pivot from 20 broad categories to 7 seeded + open-ended requires a few schema changes:

- **`categories.featured` column** (boolean, default false) — distinguishes the 7 seeded categories (featured = true) from user-submitted categories. Featured categories get leaderboards and browse-level visibility. Non-featured categories exist on restaurant pages but don't appear in category browse or leaderboards.
- **Seed the 7 featured categories** — pizza, wings, tacos, ramen, sushi, ice cream, barbecue — with their attribute tag sets
- **Seed the Raleigh market** record (name, slug, PostGIS point, radius)
- **`profiles.role` column** (text, default 'user') — supports 'admin' role for owner-only access to the admin page. RLS policy: admin routes check `profiles.role = 'admin'`.
- **Regenerate types** after migration (`npm run gen-types`)

### 1.2: Admin Web App

A separate Vite + Vue 3 web app at `admin/` in the monorepo, deployed to `admin.oakrate.com`. The native app contains zero admin code. Full product definition in [docs/ADMIN.md](../docs/ADMIN.md), implementation plan in [.ai/plans/admin/implementation-plan.md](admin/implementation-plan.md).

**Key capabilities:** Full CRUD for restaurants, items, and ratings. Rapid-fire and batch paste item entry. Three-state rating moderation (active/hidden/uncounted). Seeding health dashboard.

**Stack:** Vue 3 + PrimeVue + Supabase (shared backend). Shared types via tsconfig path alias from `src/lib/database.types.ts`.

**Build order (7 phases A-G):** Scaffold + Auth → Restaurant CRUD → Item CRUD + Batch → Rating Seed → Moderation → Dashboard → Deploy. Seeding can begin after Phase C.

### 1.3: Data Seeding

With the admin page built, manually seed:
- Raleigh restaurants covering all 7 featured categories (target: enough restaurants per category that leaderboards show 5–10 ranked items)
- Menu items per restaurant
- Seed ratings per item (admin's honest ratings — establishes initial scores)
- Attribute tags per category (via migration)

**This phase is the critical gate.** The app is useless without data. The admin page makes seeding fast enough to do in a few focused sessions rather than maintaining spreadsheets and import scripts.

---

### 1.4: Dev-Client Migration

**Goal:** Replace Expo Go with a custom dev client before Phase 2 continues.

Originally planned for the Phase 2 → Phase 3 boundary. Promoted because the on-device Storybook addons already in `package.json` are native modules whose continued operation in Expo Go is on borrowed time, and a tooling switch landed mid-Phase-3 (when Apple Sign-In and push plumbing arrive) is more disruptive than landing it now at a clean checkpoint right after Slice 1's first screen shipped.

Full procedure and rationale: [convert-expo-go-to-dev-build.md](convert-expo-go-to-dev-build.md). Slice 1 of Phase 2 is paused mid-flight; resume after the dev client boots end-to-end.

---

## Phase 2: Core App — Read Path

**Goal:** Users can browse and discover. No account required for reading. Every screen has a confident answer — no dead ends.

### Design Principle: Confidence-First UX

Every screen must handle the "not enough data" case by redirecting to something useful — never show empty states with a shrug. The hierarchy:

1. **Enough data?** Show the real content (leaderboard, restaurant items, item detail).
2. **Not enough data for this specific thing?** Redirect to the nearest high-confidence alternative:
   - Restaurant with no rated items → show top-rated items nearby in the same categories the restaurant serves
   - Category with < N items → show the category anyway if we have any data, supplement with "also popular nearby" cross-category suggestions
   - Search with no results → show trending items and top categories instead of "no results"
   - Item with very few ratings → show the score but label it "Early" (existing ScoreDisplay "New" badge handles this), show the restaurant's other rated items prominently

This isn't a polish task — it's a core architectural decision. Every query hook and screen needs a fallback data path from day one.

### Build approach: vertical slices

Phase 2 is built as **vertical slices**, not horizontal layers. Each slice ships one screen end-to-end — hook(s), components, screen, navigation, and fallback handling — so the read-path patterns (`ListResult`, `DetailResult`, `mergeFallback`, `FallbackBanner`) are validated by real call sites before being committed to.

Hook return shapes, fallback rules, cache strategy, and shared-primitive extraction rules are specified in [`.ai/plans/query-hooks.md`](query-hooks.md). That file is the source of truth.

Loading skeletons and rich error states are *not* required per slice — minimal placeholders are fine during slice work. Phase 4 brings them up to spec across all screens.

#### Cross-slice setup (do once, before Slice 1)

- TanStack Query installed; `QueryClient` configured per the cache strategy in `query-hooks.md` (60s `staleTime`, 5min `gcTime`, `refetchOnWindowFocus: false`); `QueryClientProvider` mounted at the app root.
- Shared `ListResult<T>` and `DetailResult<T, S>` types added to `src/lib/queries/types.ts`.

#### Slice 1: Category Leaderboard

The first end-to-end slice. Validates the `ListResult` shape, the threshold gate, and the fallback-banner pattern.

- `useLeaderboard(categorySlug)` — primary query + fallback to top-rated items nearby across all featured categories. Merge logic inlined in the hook (per rule-of-two).
- `FallbackBanner` component — keyed off `fallbackReason`.
- Category Leaderboard screen — renders `LeaderboardRow` list, banner when fallback, "Early" badge on sparse-but-present items.
- Nav wiring: temporary dev entry point (e.g., a hardcoded `/category/pizza` route) — Browse will replace it in Slice 2.
- Verification: a dense category renders primary; a sparse category renders the fallback path with the banner.

#### Slice 2: Browse (Home)

Brings the user's entry point online and forces the rule-of-two extraction.

- `useCategories` — featured categories. `staleTime: Infinity` override.
- `useNearby(location)` — second `ListResult` hook.
- **Extract `mergeFallback` to `src/lib/queries/mergeFallback.ts`** informed by both `useLeaderboard` and `useNearby`. Refactor `useLeaderboard` to use it.
- `CategoryCard` component.
- Browse screen — featured category grid + "Top Rated Near You" section.
- Nav wiring: Browse tab → Browse → tap category → Slice 1's leaderboard. Remove the temporary dev route.
- Verification: full nav flow works; both Browse queries render correctly with and without nearby data.

#### Slice 3: Item Detail

First `DetailResult` slice. Validates the confidence-labeled detail shape and the supplementary-content pattern.

- `useItem(id)` — primary item + supplementary "restaurant's other rated items" when sparse. Merge logic inlined.
- `useHighConfidenceAttributes(itemId)` — attribute tags ≥ N% frequency.
- `ItemCard` component (used in supplementary sections and elsewhere).
- Item Detail screen — score, sentiment distribution, high-confidence tags, photos, supplementary section when `confidence === "early"`.
- Nav wiring: leaderboard row → item detail.
- Verification: a high-confidence item and an "Early" item both render correctly.

#### Slice 4: Restaurant Detail

Second `DetailResult` slice. Triggers a check on whether `DetailResult` warrants its own shared helper.

- `useRestaurant(id)` — primary restaurant with items grouped by category + supplementary "top-rated nearby in the categories this restaurant serves" when no rated items.
- Decide: extract a shared `DetailResult` merge helper, or keep both detail hooks inlined. Driven by what the two hooks actually share — not assumed.
- `RestaurantCard` component (if needed for supplementary content; otherwise built later).
- Restaurant Detail screen — restaurant info, items by category by score, supplementary path when nothing is rated.
- Nav wiring: item detail → restaurant link → restaurant detail.
- Verification: a fully-rated restaurant and an unrated restaurant both render correctly.

#### Slice 5: Search

Independent entry point. Third `ListResult` hook — uses the extracted `mergeFallback` as-is.

- `useSearch(query)` — Postgres FTS across restaurants and items, location-aware ranking, swap-fallback to trending items + top categories on zero results.
- `SearchInput` component.
- Search screen.
- Nav wiring: Search tab.
- Verification: hits render, zero-results renders the trending fallback with banner.

Atomic primitives (Button, TextInput, Skeleton, etc.) are built within the slice that first needs them — no pre-built widget library.

---

## Phase 3: Core App — Write Path (Rating Flow)

**Goal:** Users can rate items. This is the product's core loop. Under 10 seconds.

### 3a: Auth Integration

- **Email auth** — sign-in / sign-up before first rating, seamless return to the rating flow after auth
- **Session persistence** — already wired (expo-secure-store), just needs the sign-in UI
- Apple Sign-In and Google Sign-In are pre-launch additions, not MVP blockers

### 3b: Rating Flow

The 6-step flow, optimized for speed:

1. **Select restaurant** — location-aware autocomplete. "Add new restaurant" fallback if not found (name + address, geocoded).
2. **Select or add item** — filtered by restaurant, autocomplete. "Add new item" with category assignment. If user adds an item in a non-featured category, it works — it just lives on the restaurant page without a category leaderboard.
3. **Tap sentiment** — single tap on one of 4 buckets (uses existing SentimentInput component). This is the only required input beyond restaurant + item.
4. **[Optional] Tap attribute tags** — category-specific tags, multi-select (uses TagChip). These are collected and stored, with high-confidence tags surfaced per-item over time. Quick skip if the user doesn't care.
5. **[Optional] Add photo** — camera or gallery (expo-image-picker → Supabase Storage). Skip button prominent.
6. **Submit** — Supabase insert + score recalculation.

### 3c: Score Recalculation

When a rating is submitted, recalculate the item's OakRate score. Use a **Supabase edge function** triggered on rating insert/update/delete — the scoring logic has enough moving parts (neutral prior, early burial protection, dampening) that a Postgres trigger would be awkward to maintain.

The edge function must:
1. **Fetch all ratings** for the item
2. **Apply bucket weights:** Hated = -3 (or -2 if early burial protection applies), Disliked = -1, Liked = +1, Loved = +2
3. **Inject the neutral prior:** 2 virtual "Liked" (+1) votes + 1 virtual "Disliked" (-1) vote, included in the average alongside real votes
4. **Early burial protection:** if real vote count < early-vote threshold (~5–10, configurable), treat "Hated" as -2 instead of -3
5. **Compute internal score:** weighted average of (real votes + prior votes)
6. **Apply vote-count dampening:** scale the internal score toward 0 based on real vote count (low votes → pulled toward center, high votes → full score). Exact curve TBD during implementation.
7. **Store** the internal signed score and real vote count on the item row

Display-side normalization (internal → 0-10) happens in the app, not in the edge function. The DB stores the raw signed score.

### 3d: "Add New" Flows

When a user adds a restaurant or item that doesn't exist yet:
- **New restaurant** — name, address required. Geocode via Nominatim. Assign to Raleigh market. Available immediately for rating.
- **New item** — name, category assignment required. If the user picks a non-featured category (or creates a new one), the item exists on the restaurant page. It doesn't get a leaderboard entry until the category is promoted to featured.

---

## Phase 4: Profile + Polish

**Goal:** Users can see their history, and the app feels finished.

- **Profile screen** — rating history (paginated, most recent first), total rating count, edit display name
- **My Ratings** — list view with item/restaurant/sentiment/date. Tap to view item detail. Edit or delete a rating.
- **Loading states** — skeleton screens for all data-loading views (use the Skeleton component pattern)
- **Error states** — retry patterns for failed queries, offline detection with "check your connection" messaging
- **Performance pass** — FlatList virtualization on all long lists (leaderboards, search results, rating history), image optimization (Supabase image transforms for thumbnails), query prefetching on likely navigation paths
- **Accessibility audit** — screen reader pass on all screens, focus order, touch target sizes (48dp minimum)

Note: "empty states" as traditionally defined (no data → sad illustration) are largely replaced by the confidence-first redirect pattern from Phase 2. The Profile screen is the one place a true empty state is needed ("You haven't rated anything yet — find something to rate!").

---

## Phase 5: Launch Prep

**Goal:** App Store-ready, real users can use it.

- **App Store assets** — icon, screenshots, description, privacy policy, terms of service
- **EAS Submit** — configure for iOS App Store + Google Play
- **Vercel deployment** — Expo web export for mobile web fallback
- **Analytics** — basic event tracking to validate key assumptions:
  - Ratings submitted (overall + per category)
  - Rating flow completion rate and drop-off step
  - Category leaderboard views
  - Search queries (what are people looking for?)
  - Confidence-redirect events (how often do users hit the fallback path?)
- **Push notification plumbing** — Expo Notifications config (no triggers yet, just the infrastructure)
- **Data QA** — verify seeded restaurants/items are accurate, complete, and well-distributed across categories. Ensure every featured category has enough items for a meaningful leaderboard.
- **Beta test** — TestFlight / internal track, seed with friends in Raleigh. Focus on: does the rating flow feel fast? Do leaderboards feel trustworthy? Do users hit dead ends?

---

## Phase Summary

| Phase | Dependency | Parallelizable with |
|-------|-----------|-------------------|
| 0 — Foundation | None | — |
| 1.1 — Schema Updates | Phase 0 (DB + auth) | — |
| 1.2 — Admin Web App | Phase 1.1 | Phase 2a (query hooks) |
| 1.3 — Data Seeding | Phase 1.2 | Phase 1.4 / Phase 2 |
| 1.4 — Dev-Client Migration | Phase 0 (Expo scaffold) | Phase 1.3 (seeding) |
| 2 — Read Path | Phase 1.1 + Phase 1.4 | Phase 1.3 (seeding) |
| 3 — Write Path (Rating) | Phase 2 (navigation + screens) | Phase 1.3 (seeding) |
| 4 — Profile + Polish | Phase 3 | — |
| 5 — Launch Prep | Phase 4 | — |

**Critical path: 0 → 1.1 → 1.2 → 1.4 → 2 → 3 → 4 → 5**, with data seeding (1.3) running alongside 1.4 / Phase 2 screen work. Slice 1 of Phase 2 was started before Phase 1.4 was promoted — it's paused mid-flight and resumes once the dev client is verified.

The tightest dependency is between 1a (schema updates) and 2 (query hooks need the `featured` column and seeded categories to develop against). Get the migration done first, then admin page and read screens can proceed in parallel.
