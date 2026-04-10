# OakRank — Architecture

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| App framework | Expo (React Native) | iOS, Android, web from one codebase |
| Language | TypeScript | End-to-end, shared types between app and backend |
| Backend / DB | Supabase (Postgres) | Managed — auth, storage, edge functions, real-time |
| Auth | Supabase Auth | Email, Apple Sign-In, Google Sign-In |
| Geo queries | PostGIS | Supabase extension — spatial indexing, distance sorting |
| Search | Postgres FTS | GIN-indexed; upgrade to Typesense when typo-tolerance or faceted filtering needed |
| Image storage | Supabase Storage | S3-compatible, CDN-backed, built-in image transformations |
| Restaurant data | Manual + OSM + live lookup | Seeded manually; geocoded via Nominatim/OSM; live API for new restaurants |
| Icons | Lucide (`lucide-react-native`) | Tree-shakable SVG icons via `react-native-svg`. 1,500+ outline icons. |
| Push notifications | Expo Notifications | Wraps FCM/APNs |
| Web rendering | Expo Router SSR (`output: "server"`) | Loaders for SEO pages; client-rendered for interactive pages. Uses `expo-server` 55 |
| SEO / link previews | `Head` component (expo-router/head) | SSR-rendered meta and OG tags; dynamic OG images via `+api.ts` routes |
| PWA | Web App Manifest | Add to Home Screen on iOS Safari and Chrome Android; service worker deferred |
| Hosting (web) | Vercel | Expo Router server adapter; ISR caching via Cache-Control headers |

## Key Decisions

**Expo over Flutter** — OakRank should feel native on each platform. Expo renders real native components; Flutter paints its own. TypeScript also lets us share types/validation between app and backend. Larger hiring pool than Dart.

**Supabase over Firebase** — The data model (restaurants → items → ratings → attribute tags) is deeply relational. NoSQL would require painful denormalization and can't aggregate ratings efficiently. Postgres also gives us PostGIS and full-text search without additional services.

**Postgres FTS over a dedicated search service** — At Raleigh scale (~100 restaurants, ~2,000 items), Postgres handles autocomplete fine. Typesense is the upgrade path when we need typo-tolerance or multi-facet filtering.

**Admin-seeded cold start** — An owner-only admin page allows bulk entry of restaurants, menu items, and seed ratings for the 7 launch categories. This replaces the original plan of seeding 100 restaurants across 20 categories — the tighter category list makes manual seeding practical. Both Google Places and Foursquare ToS prohibit caching/storing their data on standard developer tiers, so restaurant records (name, address) are manually curated and geocoded via Nominatim/OSM (no storage restrictions under ODbL). Menus are curated from restaurant websites and delivery platforms. A live API call (Foursquare or Google) is used only at runtime for the "add a restaurant not yet in our system" flow — compliant since we display results and only store after user action. Scraping (Apify or custom) is the path for multi-city expansion.

**RLS enabled from day one** — All tables use row-level security. Policies enforce access at the database level (e.g., anyone reads ratings, only author modifies their own).

**Native platform UI, not cross-platform skinning** — Use native controls everywhere: `NativeTabs` (Expo Router) for tab bars, native stack headers, system sheets. On iOS 26+ these automatically render with Apple's Liquid Glass. On Android they render with Material Design. No custom styling to maintain, no platform-specific CSS. For OakRank's own content surfaces that benefit from glass material (cards, overlays), use `expo-glass-effect` (`GlassView`) — it falls back to a plain `View` on Android and older iOS, which is the correct behavior.

**Server rendering for web, not static export** — The web version needs indexable pages for SEO and rendered HTML for link previews (iMessage, Slack, Discord, X — none of these execute JavaScript). Expo Router 55 supports `output: "server"` with per-route `loader` functions, `Head` for meta/OG tags, and a built-in Vercel adapter (`expo-server` 55.0.6, already installed). This is a single config change from the current `output: "static"` and keeps the one-codebase approach. Routes without a loader stay client-rendered — no change to how they work today. A separate Next.js web app was rejected because it duplicates the entire UI layer and doubles maintenance.

**ISR caching for data-driven pages** — Category leaderboards and restaurant pages use server-side loaders with `Cache-Control: s-maxage=300, stale-while-revalidate=600` (5 minutes fresh, 10 minutes stale). Vercel serves the cached version and revalidates in the background. At Raleigh-scale rating velocity, 5-minute staleness is invisible to users. Auth-gated pages (profile, rate) remain client-rendered with no caching.

**Slug-based URLs for web** — User-facing URLs use human-readable slugs (`/restaurant/beasleys-chicken-honey`) instead of UUIDs. Markets and categories already have slug columns. Restaurants and items need slug columns added — generated from name at insert time, globally unique, with numeric suffix for collisions.

## Web Architecture

### Rendering Strategy

Server rendering is opt-in per route. Routes that export a `loader` function get SSR; routes without one render client-side as they do today.

| Page | URL pattern | Rendering | Cache (ISR) | Reason |
|------|-------------|-----------|-------------|--------|
| Category leaderboard | `/[market]/[category]` | SSR | 5 min / 10 min stale | SEO, link previews, OG tags |
| Restaurant | `/restaurant/[slug]` | SSR | 5 min / 10 min stale | SEO, link previews, OG tags |
| Item detail | `/item/[slug]` | SSR | 1 min / 5 min stale | Link previews, OG tags |
| Browse (home) | `/` | SSR | 10 min / 30 min stale | SEO landing page |
| Profile | `/profile` | CSR | None | Auth-gated, no SEO value |
| Rate | `/rate` | CSR | None | Interactive, auth-required |
| Search | `/search` | CSR | None | Dynamic results |

### Server-Side Data Fetching

SSR pages export a `loader` (typed via `LoaderFunction` from `expo-server`) that fetches data from Supabase on the server. Results are consumed via `useLoaderData` from `expo-router` — the page renders with data on first paint, no loading spinner. When users navigate client-side, the loader runs server-side and returns JSON to the client (expo-router built-in behavior). Auth-gated pages skip loaders entirely and use React Query hooks client-side (existing pattern).

### URL Routing

Every entity has a stable, human-readable URL (see PRODUCT.md Web Strategy for the full spec):

- `/raleigh/wings` — category leaderboard (`app/[market]/[category].tsx`)
- `/restaurant/beasleys-chicken-honey` — restaurant page (`app/restaurant/[slug].tsx`)
- `/item/beasleys-fried-chicken-wings` — item detail (`app/item/[slug].tsx`)

The `app/[market]/[category].tsx` route is a new file for the SEO-facing category URL. Native tab navigation (`(tabs)/`) is unchanged — the parenthesized group doesn't appear in web URLs.

### OG Tags and Link Previews

Each SSR route renders a `Head` component (from `expo-router/head`) with title, description, and Open Graph tags. Because these render during SSR, they're present in the initial HTML — link preview crawlers (which don't execute JS) see them. Dynamic OG images are generated via an API route (`app/og/[...path]+api.ts`).

### PWA

A web app manifest (`public/manifest.json`) enables Add to Home Screen on iOS Safari and Chrome Android. This is the low-friction middle ground between "install a native app" and "visit a website." A service worker is deferred until web traffic validates the investment — the manifest alone is sufficient for Add to Home Screen.

### SEO Infrastructure

A dynamic sitemap (`app/sitemap.xml+api.ts`) generates entries from the database. A static `public/robots.txt` controls crawl directives. Both are low-effort to add alongside the SSR routes.

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
| SSR response time p95 > 500ms | Lower ISR TTLs, add edge caching, or pre-render high-traffic pages with `generateStaticParams` |
| Web traffic exceeds 10K monthly visitors | Add service worker for offline caching and faster repeat visits |
| Vercel serverless cold starts noticeable | Evaluate edge rendering or EAS Hosting |
| Need personalized server-rendered pages | Add Supabase auth middleware via `+middleware.ts` |
