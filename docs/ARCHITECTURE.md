# OakRank — Architecture

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| App framework | Expo (React Native) | iOS, Android, mobile web from one codebase |
| Language | TypeScript | End-to-end, shared types between app and backend |
| Backend / DB | Supabase (Postgres) | Managed — auth, storage, edge functions, real-time |
| Auth | Supabase Auth | Email, Apple Sign-In, Google Sign-In |
| Geo queries | PostGIS | Supabase extension — spatial indexing, distance sorting |
| Search | Postgres FTS | GIN-indexed; upgrade to Typesense when typo-tolerance or faceted filtering needed |
| Image storage | Supabase Storage | S3-compatible, CDN-backed, built-in image transformations |
| Restaurant data | Manual + OSM + live lookup | Seeded manually; geocoded via Nominatim/OSM; live API for new restaurants |
| Push notifications | Expo Notifications | Wraps FCM/APNs |
| Hosting (web) | Vercel | Expo web export |

## Key Decisions

**Expo over Flutter** — OakRank should feel native on each platform. Expo renders real native components; Flutter paints its own. TypeScript also lets us share types/validation between app and backend. Larger hiring pool than Dart.

**Supabase over Firebase** — The data model (restaurants → items → ratings → attribute tags) is deeply relational. NoSQL would require painful denormalization and can't aggregate ratings efficiently. Postgres also gives us PostGIS and full-text search without additional services.

**Postgres FTS over a dedicated search service** — At Raleigh scale (~100 restaurants, ~2,000 items), Postgres handles autocomplete fine. Typesense is the upgrade path when we need typo-tolerance or multi-facet filtering.

**Manual restaurant + menu seeding** — Both Google Places and Foursquare ToS prohibit caching/storing their data on standard developer tiers. For 100 Raleigh restaurants, we manually curate restaurant records (name, address) and geocode via Nominatim/OSM (no storage restrictions under ODbL). Menus are curated from restaurant websites and delivery platforms. A live API call (Foursquare or Google) is used only at runtime for the "add a restaurant not yet in our system" flow — compliant since we display results and only store after user action. Scraping (Apify or custom) is the path for multi-city expansion.

**RLS enabled from day one** — All tables use row-level security. Policies enforce access at the database level (e.g., anyone reads ratings, only author modifies their own).

**Native platform UI, not cross-platform skinning** — Use native controls everywhere: `NativeTabs` (Expo Router) for tab bars, native stack headers, system sheets. On iOS 26+ these automatically render with Apple's Liquid Glass. On Android they render with Material Design. No custom styling to maintain, no platform-specific CSS. For OakRank's own content surfaces that benefit from glass material (cards, overlays), use `expo-glass-effect` (`GlassView`) — it falls back to a plain `View` on Android and older iOS, which is the correct behavior.

## Scale Triggers

These are the specific signals to revisit a component:

| Signal | Action |
|--------|--------|
| Search autocomplete feels slow or users misspell items | Add Typesense |
| Supabase bill exceeds ~$100/mo | Evaluate self-hosting |
| Image transformation needs grow complex | Evaluate Cloudinary/Imgix |
| Expanding beyond Raleigh | Build menu scraping pipeline (Apify or custom), evaluate Foursquare enterprise for bulk data |
| Manual seeding becomes a bottleneck | Evaluate Foursquare enterprise tier (allows caching) or OSM Overpass bulk export |
| Concurrent write volume causes contention | Review connection pooling, consider read replicas |
