# Dynamic OG Images

**Tier:** MVP-nice-to-have
**Depends on:** SSR routes with text OG tags (MVP-required, part of web architecture)

## Context

Every SSR route already ships text-only Open Graph tags (`<Head>` with `og:title`, `og:description`, etc.) and a static branded fallback image. That baseline makes shared links functional — crawlers see titles and descriptions, and the static image gives a branded presence.

Dynamic OG images replace the static fallback with contextual, data-driven preview cards. When someone shares a link to an item, restaurant, or leaderboard, the preview shows the actual score, name, and ranking — not just a generic brand card.

## Why it matters

Shared links are the primary growth loop. The preview card is the first impression for non-users — it does conversion work before anyone clicks. A card showing "8.3" with the item name and restaurant is more compelling than a paragraph of description text. iMessage and Twitter/X both render large image previews prominently; a contextual image dramatically outperforms a generic brand logo.

## Why it's nice-to-have, not required

Text OG tags + static fallback image get ~70% of the sharing value with ~20% of the effort. Previews still show useful info (title, description, score in text). The dynamic images are polish that makes sharing feel premium — they don't unblock any functionality.

## Preview Types

### 1. Item (`/item/[slug]`)

The "you have to try this" card. Most important preview type — personal recommendations are the core sharing moment.

| Field | Content |
|-------|---------|
| Title | [Item Name] at [Restaurant] |
| Score | OakRank score (e.g., 8.3) |
| Sentiment | "92% would order again" |
| Photo | Item photo if available, otherwise branded layout |
| twitter:card | `summary_large_image` if photo, `summary` otherwise |

**Low-data handling:** Below the ranking threshold (~10 votes), show sentiment label only ("Mostly loved") — no numeric score. Showing "8.3 across 2 reviews" undermines credibility.

### 2. Restaurant (`/restaurant/[slug]`)

The "check this place out" card.

| Field | Content |
|-------|---------|
| Title | [Restaurant Name] |
| Top items | Top 2-3 rated items with scores |
| Layout | Restaurant name prominent, items listed below |
| twitter:card | `summary` |

No restaurant photos (we don't collect those). The value here is showing *what's good* at the restaurant, not what it looks like.

### 3. Category Leaderboard (`/[market]/[category]`)

The "best X in Y" card. Highest organic share potential — this is the link people post unprompted.

| Field | Content |
|-------|---------|
| Title | Best [Category] in [Market] |
| Leaderboard | Top 3 items with rank, name, restaurant, score |
| Layout | Mini leaderboard (numbered list) |
| twitter:card | `summary_large_image` |

### 4. Generic Fallback (all other routes)

| Field | Content |
|-------|---------|
| Title | OakRank — Rate the food, not the restaurant |
| Description | Item-level food ratings for Raleigh |
| Image | Static branded card (pre-made asset, no generation) |
| twitter:card | `summary` |

This is the baseline that ships with SSR. No dynamic generation needed.

## Technical Approach

### Prerequisites

This project requires the SSR infrastructure from the web architecture work:

- **`output: "server"`** in `app.config.ts` (currently `"static"`) — enables API routes and SSR loaders
- **Vercel deployment** with the Expo Router server adapter (`expo-server`)
- **SSR routes with text OG tags** already rendering `<Head>` components on item, restaurant, and leaderboard pages

None of this is specific to dynamic OG images — it's shared infrastructure that the SSR/SEO work delivers first. This project adds one API route on top of it.

### Package: `@vercel/og`

Use **`@vercel/og`** — Vercel's wrapper around Satori + @resvg/resvg-wasm. It bundles both, manages WASM initialization, and returns a standard `Response` via its `ImageResponse` class.

```
npm install @vercel/og
```

**What it does internally:**
1. **Satori** converts React JSX to SVG using Yoga (flexbox layout engine compiled to WASM)
2. **@resvg/resvg-wasm** rasterizes SVG to PNG (~2MB WASM binary)
3. `ImageResponse` wraps the result as a `Response` with correct `Content-Type` headers

**Why this over using Satori directly:** `@vercel/og` handles WASM lifecycle (init, caching between invocations) and is maintained by Vercel specifically for this deployment target. Going lower-level buys nothing at our scale.

**Runtime constraint:** Must run on the **Node.js serverless runtime**, not Vercel Edge. The resvg WASM binary is ~2MB, which exceeds the Edge runtime's 1MB bundle limit. Expo Router API routes default to Node.js on Vercel, so no configuration needed — just don't opt into Edge.

### Route Structure

Single catch-all API route:

```
app/og/[...path]+api.ts
```

The handler parses the path segments to determine card type and fetches data from Supabase accordingly:

```ts
// app/og/[...path]+api.ts
import { ImageResponse } from "@vercel/og";
import { ExpoRequest } from "expo-router/server";

export async function GET(request: ExpoRequest, { path }: { path: string[] }) {
  const [type, slug] = path;

  switch (type) {
    case "item":
      // fetch item + restaurant from Supabase, render ItemCard
    case "restaurant":
      // fetch restaurant + top items, render RestaurantCard
    default:
      // check if path matches [market]/[category] pattern
      // otherwise render generic fallback
  }

  return new ImageResponse(jsx, {
    width: 1200,
    height: 630,
  });
}
```

**URL mapping:**

| OG image URL | Card type | Data fetched |
|---|---|---|
| `/og/item/[slug]` | Item | Item name, score, sentiment %, restaurant name, photo URL |
| `/og/restaurant/[slug]` | Restaurant | Restaurant name, top 3 items with scores |
| `/og/[market]/[category]` | Leaderboard | Category name, market name, top 3 items with rank/score/restaurant |
| `/og/*` (anything else) | Fallback | None — static branded layout |

Each SSR page references its OG image in the `<Head>` component:
```html
<meta property="og:image" content="https://oakrank.com/og/item/beasleys-fried-chicken-wings" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### Supabase Access from API Routes

API routes run server-side on Vercel. They create a Supabase client using the **service role key** (server-only, never exposed to the client). This bypasses RLS — acceptable here because OG image data is all public (scores, names, rankings). The service role key is set as a Vercel environment variable (`SUPABASE_SERVICE_ROLE_KEY`), not the `EXPO_PUBLIC_` anon key.

### Fonts

Satori has **no system font access** — you must provide at least one font as an `ArrayBuffer`. Two options:

| Approach | Effort | Result |
|---|---|---|
| Bundle Inter (or similar) from Google Fonts as a `.woff` file in the repo | Low | Clean, readable, ships fast |
| Bundle the OakRank brand typeface | Low-medium | More polished, but must be a static `.ttf`/`.woff` — no variable fonts |

**Recommendation:** Bundle a single weight of the brand typeface (bold/semibold — the one used for headings). OG images only need one weight since they display short text at large sizes. Place the font file at `assets/fonts/og/` and load it in the API route:

```ts
const font = await fetch(new URL("../../assets/fonts/og/BrandFont-Bold.woff", import.meta.url))
  .then(res => res.arrayBuffer());
```

This runs once per cold start and is cached across warm invocations. Adds ~50-100KB to the serverless bundle — negligible.

### Item Photos

Including user-uploaded photos in item cards makes previews dramatically more compelling. The implementation is straightforward because Satori supports `<img>` tags with remote URLs — it fetches and embeds the image during SVG generation.

```tsx
// Inside the item card JSX (simplified)
{photoUrl && (
  <img src={photoUrl} width={400} height={400} style={{ objectFit: "cover", borderRadius: 16 }} />
)}
```

The photo URL comes from Supabase Storage (CDN-backed, already has image transformations). Request a 400x400 transformed variant to keep the fetch fast:

```
https://[project].supabase.co/storage/v1/render/image/public/photos/[id]?width=400&height=400&resize=cover
```

**Fallback:** Items without photos use the text-only layout (score + name + restaurant, no empty image placeholder). The card component accepts an optional `photoUrl` prop and conditionally renders the photo region.

**Include from v1.** The added complexity is minimal (one conditional in the JSX, one extra field in the Supabase query) and the visual payoff is significant.

### CSS Constraints

Satori uses Yoga for layout — **flexbox only**. No CSS Grid, no `position: absolute` nesting, no `calc()`. This is fine for OG cards since they're simple stacked/row layouts. Supported properties that matter for card design:

- `flexDirection`, `alignItems`, `justifyContent`, `gap`
- `borderRadius`, `boxShadow`, `background` (including gradients)
- `text-overflow: ellipsis` (for long item/restaurant names)
- `color`, `fontSize`, `fontWeight`, `letterSpacing`

### Caching

Two layers:

**1. Vercel CDN (primary).** `Cache-Control` headers on the API route response. Crawlers and clients hit the CDN; the serverless function only runs on cache miss.

| Card type | `s-maxage` | `stale-while-revalidate` | Rationale |
|---|---|---|---|
| Item | 5 min | 30 min | Scores update infrequently at Raleigh scale |
| Restaurant | 5 min | 30 min | Top items list is stable |
| Leaderboard | 5 min | 30 min | Rankings shift slowly |
| Fallback | 7 days | 7 days | Static content, never changes |

These TTLs are longer than the parent page ISR TTLs — intentionally. OG images are consumed by crawlers that cache aggressively anyway (Twitter caches card images for ~7 days, iMessage caches indefinitely until the URL changes). A 5-minute image freshness is more than sufficient. The shorter page TTLs exist because users see live scores; crawlers see preview cards.

**2. Satori warm instances (automatic).** Vercel reuses warm serverless instances across requests. WASM modules (Yoga, resvg) stay initialized — only the first request after a cold start pays the ~200-500ms init penalty. At Raleigh-scale traffic, cold starts will be frequent (low request volume = instances recycle). This is acceptable because crawlers are not latency-sensitive.

### Card Design

Specific layouts deferred to implementation, but architectural constraints that inform design:

- **1200x630px** — standard OG image dimensions, works for all platforms
- **Dark background** — stands out in light-mode chat apps (iMessage, Slack, Discord) and social feeds. Dark cards with light text have higher visual contrast in preview contexts.
- **Score displayed large** — 72px+ font size, the single most important visual element
- **OakRank wordmark** — consistent position (bottom-right), small, branded but not dominant
- **Text truncation** — long item/restaurant names get `text-overflow: ellipsis`. Design must handle names up to ~60 characters gracefully.
- **No-score variant** — items below the ranking threshold show sentiment label ("Mostly loved") at the same visual prominence where the score would be. No empty space.

### Performance Budget

| Metric | Target | Notes |
|---|---|---|
| Cold start (WASM init + render) | < 1.5s | Crawlers tolerate this; not user-facing |
| Warm render | < 300ms | Satori + resvg on warm instance |
| Image size | < 200KB | PNG at 1200x630, simple graphics. Photos increase this — use Supabase transforms to keep input photos small |
| Serverless bundle | < 5MB | @vercel/og + one font file + route code |

None of these are tight constraints. OG image generation is not latency-sensitive — crawlers wait seconds, and the CDN cache means most requests never hit the function.

## What Ships Without This

Text OG tags on every SSR route + one static 1200x630 branded image used as the default `og:image` across all pages. This is part of the SSR implementation, not this project. It means every shared link shows:
- Correct title and description (contextual, data-driven)
- A generic OakRank brand card as the image

That's a functional baseline. This project upgrades the image from generic to contextual.

## Implementation Sequence

All of this is a single workstream, but the natural order:

1. **Static fallback image** — Design and export a 1200x630 branded PNG. Drop it in `public/og-default.png`. Zero code. (Ships as part of SSR work, not this project.)
2. **API route scaffold** — `app/og/[...path]+api.ts` with `@vercel/og`, rendering a hardcoded test card. Validates that WASM, fonts, and Vercel deployment all work end-to-end.
3. **Generic fallback card** — Replace the hardcoded test with a branded layout. This becomes the dynamic version of the static image.
4. **Item card** — Supabase query + photo support. Most impactful card type.
5. **Restaurant card** — Supabase query for top items.
6. **Leaderboard card** — Supabase query for top 3 in category.
7. **Wire up `<Head>` references** — Update each SSR route's `og:image` meta tag to point to `/og/...` instead of the static fallback.

Steps 1 is pre-work (part of SSR). Steps 2-3 are the proof-of-concept. Steps 4-6 are parallelizable. Step 7 is the flip.
