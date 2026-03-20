# OakRank — Implementation Plan

## Phase 0: Foundation (Infrastructure + Tooling)

**Goal:** Everything needed before writing app code.

- **Supabase project setup** — create project, enable PostGIS, configure auth providers (email now; Apple + Google Sign-In pre-launch), set up Storage bucket for photos (public, 5MB limit)
- **Database schema + RLS** — design and migrate the core tables (restaurants, items, categories, ratings, attribute_tags, rating_attributes), write RLS policies from day one
- **Expo project scaffold** — init with TypeScript, configure EAS Build for iOS/Android/web, set up OTA updates
- **Shared types** — establish the pattern for sharing TypeScript types between app and Supabase (generated from DB schema or hand-maintained)
- **CI/CD** — EAS Build + preview deploys, linting, type-checking on PR

**Blocks nothing except everything after it. Aim to keep this tight — days, not weeks.**

---

## Phase 1: Data Seeding Pipeline

**Goal:** Populate the database so there's something to browse from day one.

- **Curate restaurant list** — build a spreadsheet of ~100 Raleigh restaurants (name, address, city/state/zip) covering all 20 categories
- **Geocode addresses** — batch geocode via Nominatim (OSM) or US Census geocoder to get lat/lng (both free, no storage restrictions)
- **Import script** — CSV/JSON → Supabase insert for restaurant records
- **Menu curation tooling** — spreadsheet → DB import script for items + category assignments + attribute tag definitions
- **Seed the 20 categories** with their attribute tag sets
- **Live restaurant lookup** — wire up a Foursquare or Google API call for the "add a restaurant" flow at runtime (no caching, ToS-compliant)

**This can run in parallel with Phase 2. The app needs data to be useful, so don't defer it.**

---

## Phase 2: Core App — Read Path

**Goal:** Users can browse and discover. No account required.

- **Design system / component library** — typography, colors, spacing, cards, star display, tag chips, bottom tab bar. Establish the visual language before building screens.
- **Navigation skeleton** — bottom tabs (Home, Rate, Profile), stack navigators per tab
- **Home / Explore screen** — category cards, "near you" section (PostGIS), trending items
- **Search** — restaurant + item autocomplete (Postgres FTS), location-aware results
- **Restaurant View** — item list ranked by rating, category grouping
- **Category Leaderboard** — ranked items within a category for Raleigh, attribute filtering
- **Item Detail** — rating breakdown, attribute tag distribution, photos

**This is the biggest phase. Consider splitting into sub-sprints: navigation + home first, then search, then detail screens.**

---

## Phase 3: Core App — Write Path (Rating Flow)

**Goal:** Users can rate items. This is the product's core loop.

- **Auth integration** — sign-in gate before rating, seamless return to flow after auth
- **Rating flow** — the 6-step flow (restaurant → item → stars → tags → photo → submit), optimized for <10s completion
  - Restaurant autocomplete (location-aware)
  - Item autocomplete with "add new item" fallback
  - Star input (single tap)
  - Attribute tag multi-select (category-specific, optional)
  - Photo capture/upload (optional, Supabase Storage)
- **Supabase edge function** — rating submission, aggregate recalculation (or trigger-based)

**Protect the <10s target ruthlessly. Test on real devices early.**

---

## Phase 4: Profile + Polish

**Goal:** Users can see their history, and the app feels complete.

- **Profile screen** — rating history, stats, edit account
- **My Ratings** — list with edit/delete capability
- **Empty states** — every screen needs one (no ratings yet, no results, etc.)
- **Loading / error states** — skeletons, retry patterns, offline handling
- **Performance pass** — list virtualization, image optimization, query tuning

---

## Phase 5: Launch Prep

**Goal:** App Store-ready, real users can use it.

- **App Store assets** — icon, screenshots, description, privacy policy, terms
- **EAS Submit** — configure for iOS App Store + Google Play
- **Vercel deployment** — Expo web export for mobile web fallback
- **Analytics** — basic event tracking (ratings submitted, searches, category views) to validate key assumptions
- **Push notification setup** — Expo Notifications config (even if no triggers yet, wire the plumbing)
- **Beta test** — TestFlight / internal track, seed with friends in Raleigh
- **Data QA** — verify seeded restaurants/items are accurate, complete, and well-categorized

---

## Phase Summary

| Phase | Dependency | Parallelizable with |
|-------|-----------|-------------------|
| 0 — Foundation | None | — |
| 1 — Data Seeding | Phase 0 (DB) | Phase 2 |
| 2 — Read Path | Phase 0 | Phase 1 |
| 3 — Write Path (Rating) | Phase 0 + auth, Phase 2 (navigation) | Phase 1 |
| 4 — Profile + Polish | Phase 3 | — |
| 5 — Launch Prep | Phase 4 | — |

The critical path is **0 → 2 → 3 → 4 → 5**, with data seeding (Phase 1) running alongside development. Design system work at the start of Phase 2 is a dependency for all screens — get that locked early.
