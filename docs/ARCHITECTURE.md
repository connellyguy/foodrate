# OakRate — Architecture

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
| Web rendering | Expo Router static export (`output: "static"`) | Client-rendered SPA. SSR is deferred post-MVP — see Scale Triggers. |
| Link previews | Vercel edge function rewrites meta tags per URL | Crawler-friendly OG tags without full SSR. See [.ai/plans/link-previews.md](../.ai/plans/link-previews.md) |
| OG images | `@vercel/og` edge functions per entity type | Dynamic, CDN-cached PNG cards |
| PWA | Web App Manifest | Add to Home Screen on iOS Safari and Chrome Android; service worker deferred |
| Hosting (web) | Vercel | Static SPA + edge functions for meta and OG images |

## Key Decisions

**Expo over Flutter** — OakRate should feel native on each platform. Expo renders real native components; Flutter paints its own. TypeScript also lets us share types/validation between app and backend. Larger hiring pool than Dart.

**Supabase over Firebase** — The data model (restaurants → items → ratings → attribute tags) is deeply relational. NoSQL would require painful denormalization and can't aggregate ratings efficiently. Postgres also gives us PostGIS and full-text search without additional services.

**Postgres FTS over a dedicated search service** — At Raleigh scale (~100 restaurants, ~2,000 items), Postgres handles autocomplete fine. Typesense is the upgrade path when we need typo-tolerance or multi-facet filtering.

**Admin-seeded cold start** — An owner-only admin page allows bulk entry of restaurants, menu items, and seed ratings for the 7 launch categories. This replaces the original plan of seeding 100 restaurants across 20 categories — the tighter category list makes manual seeding practical. Both Google Places and Foursquare ToS prohibit caching/storing their data on standard developer tiers, so restaurant records (name, address) are manually curated and geocoded via Nominatim/OSM (no storage restrictions under ODbL). Menus are curated from restaurant websites and delivery platforms. A live API call (Foursquare or Google) is used only at runtime for the "add a restaurant not yet in our system" flow — compliant since we display results and only store after user action. Scraping (Apify or custom) is the path for multi-city expansion.

**RLS enabled from day one** — All tables use row-level security. Policies enforce access at the database level (e.g., anyone reads ratings, only author modifies their own).

**Native platform UI, not cross-platform skinning** — Use native controls everywhere: `NativeTabs` (Expo Router) for tab bars, native stack headers, system sheets. On iOS 26+ these automatically render with Apple's Liquid Glass. On Android they render with Material Design. No custom styling to maintain, no platform-specific CSS. For OakRate's own content surfaces that benefit from glass material (cards, overlays), use `expo-glass-effect` (`GlassView`) — it falls back to a plain `View` on Android and older iOS, which is the correct behavior.

**Static SPA web build for MVP, SSR deferred** — Web ships as a client-rendered SPA (`output: "static"`). The MVP is native-first; web exists for the share loop (link previews) and casual discovery, not as a primary surface. Full SSR via Expo Router 55's `output: "server"` is currently alpha (with known loader-data bugs) and adds substantial complexity — per-route loader plumbing, a TanStack Query dehydrate/hydrate bridge, per-request `QueryClient` discipline. None of that is justified by Raleigh-only scale and no-marketing-budget reality. Body SEO is not a launch goal. SSR is deferred to post-MVP and adopted route-by-route when traffic justifies it.

**Edge meta-tag injection for link previews** — Crawlers (iMessage, Slack, Discord, X, Facebook) don't execute JavaScript, so a static SPA serves them an empty body. The fix is a single Vercel edge function (`api/meta.ts`) that rewrites placeholders in the static index.html based on the URL — fetching the matching entity from Supabase and injecting `<title>`, `<meta>`, OG tags, and a canonical URL. The body stays the SPA shell. Crawlers get correct metadata; users hydrate the SPA over the response. Dynamic OG images come from `@vercel/og` edge functions (one per entity type). Implementation details and routing config in [.ai/plans/link-previews.md](../.ai/plans/link-previews.md).

**Edge cache for the meta function** — The meta function returns HTML with `Cache-Control: s-maxage=N, stale-while-revalidate=86400`. Restaurant/item pages use 5 minute fresh / 1 day stale; category leaderboards use 10 min / 1 day. The static SPA bundle itself is cached forever (immutable hashed assets).

**Slug-based URLs for web** — User-facing URLs use human-readable slugs (`/restaurant/beasleys-chicken-honey`) instead of UUIDs. Markets and categories already have slug columns. Restaurants and items need slug columns added — generated from name at insert time, globally unique, with numeric suffix for collisions.

## Web Architecture

### Rendering Strategy

Web ships as a static SPA (`output: "static"`). All routes are client-rendered. The body of the response is the same SPA shell for every URL; only the `<head>` meta tags differ per URL via edge-function injection.

| Page | URL pattern | Body | Meta tags | Reason |
|------|-------------|------|-----------|--------|
| Browse (home) | `/` | SPA | Static | Fixed copy |
| Category leaderboard | `/[market]/[category]` | SPA | Edge-injected | Dynamic share previews |
| Restaurant | `/restaurant/[slug]` | SPA | Edge-injected | Dynamic share previews |
| Item detail | `/item/[slug]` | SPA | Edge-injected | Dynamic share previews |
| Profile | `/profile` | SPA | Static | Auth-gated, not shareable |
| Rate | `/rate` | SPA | Static | Interactive, auth-required |
| Search | `/search` | SPA | Static | Dynamic results |

### Link Previews via Edge Meta Injection

Link-preview crawlers (iMessage, Slack, Discord, X, Facebook) don't execute JavaScript — they read the initial HTML response and stop. A SPA with placeholder meta tags would serve them nothing useful.

The fix: one Vercel edge function (`api/meta.ts`) reads the URL, fetches the matching entity from Supabase, rewrites placeholders in the index.html template, and returns the result. The body stays the SPA shell — only the head changes. Dynamic OG card images come from `@vercel/og` edge functions (one per entity type). All cached at the edge with `Cache-Control: s-maxage=N, stale-while-revalidate=86400`.

Full implementation, vercel.json routing, and code skeletons in [.ai/plans/link-previews.md](../.ai/plans/link-previews.md).

When users hydrate the SPA and navigate client-side, `expo-router/head` updates the document head so subsequent shares from new URLs carry the right meta. Crawlers see the server-injected version; users see the client-updated version.

### URL Routing

Every entity has a stable, human-readable URL (see PRODUCT.md Web Strategy for the full spec):

- `/raleigh/wings` — category leaderboard (`app/[market]/[category].tsx`)
- `/restaurant/beasleys-chicken-honey` — restaurant page (`app/restaurant/[slug].tsx`)
- `/item/beasleys-fried-chicken-wings` — item detail (`app/item/[slug].tsx`)

Native tab navigation (`(tabs)/`) is unchanged — the parenthesized group doesn't appear in web URLs.

### PWA

A web app manifest (`public/manifest.json`) enables Add to Home Screen on iOS Safari and Chrome Android. This is the low-friction middle ground between "install a native app" and "visit a website." A service worker is deferred until web traffic validates the investment — the manifest alone is sufficient for Add to Home Screen.

### SEO Infrastructure

A static `public/robots.txt` controls crawl directives. A sitemap is deferred until SSR — without rendered body content, indexing the sitemap doesn't surface useful search results. Crawlers can still discover routes via shared links and the meta tags they find.

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
| Body SEO matters (multi-market expansion, marketing-driven web traffic) | Upgrade selected routes to full SSR with `output: "server"` + loaders + TanStack Query dehydrate/hydrate |
| Web traffic exceeds 10K monthly visitors | Add service worker for offline caching and faster repeat visits |
| Analytics shows >10% of users hitting web first | Re-evaluate SSR upgrade priority |
| Meta function p95 > 300ms | Move HTML template inline (skip `node:fs`), tighten Supabase queries, or pre-render high-traffic entities |
| `@vercel/og` cold starts noticeable | Pre-warm via cron, or generate OG images at admin-write time and store in Supabase Storage |
| Need personalized server-rendered pages | Add SSR + Supabase auth middleware via `+middleware.ts` |
