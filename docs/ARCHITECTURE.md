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
| Restaurant data | Google Places API | Names, addresses, coords, hours; menus are manually curated |
| Push notifications | Expo Notifications | Wraps FCM/APNs |
| Hosting (web) | Vercel | Expo web export |

## Key Decisions

**Expo over Flutter** — OakRank should feel native on each platform. Expo renders real native components; Flutter paints its own. TypeScript also lets us share types/validation between app and backend. Larger hiring pool than Dart.

**Supabase over Firebase** — The data model (restaurants → items → ratings → attribute tags) is deeply relational. NoSQL would require painful denormalization and can't aggregate ratings efficiently. Postgres also gives us PostGIS and full-text search without additional services.

**Postgres FTS over a dedicated search service** — At Raleigh scale (~100 restaurants, ~2,000 items), Postgres handles autocomplete fine. Typesense is the upgrade path when we need typo-tolerance or multi-facet filtering.

**Manual menu seeding over scraping** — Google Places doesn't reliably expose menu items. For 100 restaurants, manual curation from restaurant websites and delivery platforms is faster than building a scraper. Scraping (Apify or custom) is the path for multi-city expansion.

**RLS enabled from day one** — All tables use row-level security. Policies enforce access at the database level (e.g., anyone reads ratings, only author modifies their own).

## Scale Triggers

These are the specific signals to revisit a component:

| Signal | Action |
|--------|--------|
| Search autocomplete feels slow or users misspell items | Add Typesense |
| Supabase bill exceeds ~$100/mo | Evaluate self-hosting |
| Image transformation needs grow complex | Evaluate Cloudinary/Imgix |
| Expanding beyond Raleigh | Build menu scraping pipeline (Apify or custom) |
| Concurrent write volume causes contention | Review connection pooling, consider read replicas |
