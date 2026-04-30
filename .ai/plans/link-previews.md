# Link Previews — Static SPA + Edge Meta Injection

How shared OakRate URLs (iMessage, Slack, Discord, X, Facebook, Messages) render rich previews without standing up full SSR.

## Goal

When a user shares `oakrate.com/restaurant/lillys-pizza` (or any other entity URL), the recipient's app/client must show:

- A title (restaurant/item/category name)
- A description (one-line summary)
- An image (dynamic OG card with score, name, photo)
- A canonical URL

Link-preview crawlers don't execute JavaScript — they read the initial HTML response and stop. So the requirement is just: correct `<meta>` tags in the head of the response, per URL.

## Why not full SSR

Full SSR (`output: "server"` + `loader` functions + dehydrate/HydrationBoundary) solves this but at much higher cost: alpha SDK exposure (Expo Router 55 SSR is alpha), per-route loader plumbing, hydration mismatch debugging, per-request `QueryClient` discipline, body-rendering complexity. For Raleigh-only MVP with no SEO ambitions, that's overbuilt — body SEO doesn't matter yet, and crawlers don't need a rendered body.

Full SSR is deferred to post-MVP. Triggers to upgrade are listed at the bottom of this doc.

## Approach

1. **Static SPA build** — Expo Router `output: "static"`. Single `index.html` shell with the SPA bundle.
2. **Placeholder meta tags** in the index template (`__OG_TITLE__`, `__OG_DESCRIPTION__`, `__OG_IMAGE__`, `__TITLE__`, `__CANONICAL__`).
3. **One edge function** (`api/meta.ts`) reads the URL, fetches the matching entity from Supabase, and rewrites the placeholders.
4. **Three OG image endpoints** (`api/og/restaurant/[slug].ts`, `api/og/item/[slug].ts`, `api/og/category/[slug].ts`) using `@vercel/og` to render dynamic cards.
5. **`vercel.json` rewrites** route extensionless paths through the meta function; static assets and API endpoints pass through.
6. **Client-side `Head` updates** (via `expo-router/head`) handle SPA navigation — when a hydrated user navigates from one entity to another, the document head updates so subsequent shares carry the right meta.

The body of the response stays the SPA shell. We're SSR-ing the head only.

## Routes

| Route | Source | Cache hint (s-maxage / SWR) |
|---|---|---|
| `/` | Static copy | Forever |
| `/restaurant/[slug]` | Supabase: name, top item, score, photo | 300s / 1 day |
| `/item/[slug]` | Supabase: item, restaurant, score, sentiment | 300s / 1 day |
| `/[market]/[category]` | Supabase: top 5 items in category | 600s / 1 day |
| `/profile`, `/rate`, `/search` | Static (no useful share preview) | Forever |

## File layout

```
api/
  meta.ts                       # Edge function: rewrites placeholders per URL
  og/
    restaurant/[slug].ts        # @vercel/og: restaurant card PNG
    item/[slug].ts              # @vercel/og: item card PNG
    category/[slug].ts          # @vercel/og: category card PNG
public/
  robots.txt                    # Crawl directives
vercel.json                     # Rewrites
app/
  +html.tsx                     # Custom HTML template (Expo Router) with placeholders
```

## `vercel.json`

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/og/(.*)", "destination": "/api/og/$1" },
    { "source": "/(.*\\.(?:js|css|png|jpg|jpeg|gif|svg|webp|woff2|ico|json|txt|xml))", "destination": "/$1" },
    { "source": "/((?!api/).*)", "destination": "/api/meta?path=$1" }
  ]
}
```

Order matters. API routes pass through. `/og/*` routes to the OG image generators. Static asset extensions pass through. Everything else hits `/api/meta`.

## `api/meta.ts` skeleton

```ts
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

const indexHtml = readFileSync(path.join(process.cwd(), 'dist/index.html'), 'utf-8')
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const requestedPath = url.searchParams.get('path') ?? '/'

  const meta = await resolveMeta(requestedPath)

  const html = indexHtml
    .replace(/__TITLE__/g, escapeHtml(meta.title))
    .replace(/__OG_TITLE__/g, escapeHtml(meta.ogTitle ?? meta.title))
    .replace(/__OG_DESCRIPTION__/g, escapeHtml(meta.description))
    .replace(/__OG_IMAGE__/g, meta.image)
    .replace(/__CANONICAL__/g, meta.canonical)

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': `public, s-maxage=${meta.ttl}, stale-while-revalidate=86400`,
    },
  })
}

async function resolveMeta(p: string): Promise<MetaResult> {
  // Dispatch by path pattern. Each resolver is a thin Supabase call.
  const restaurantMatch = p.match(/^\/restaurant\/([^/]+)$/)
  if (restaurantMatch) return resolveRestaurant(restaurantMatch[1])

  const itemMatch = p.match(/^\/item\/([^/]+)$/)
  if (itemMatch) return resolveItem(itemMatch[1])

  const categoryMatch = p.match(/^\/([^/]+)\/([^/]+)$/)
  if (categoryMatch) return resolveCategory(categoryMatch[1], categoryMatch[2])

  return defaultMeta()
}
```

`MetaResult` = `{ title, ogTitle?, description, image, canonical, ttl }`. Each resolver returns this shape. Add new resolvers as new shareable routes are introduced.

## `api/og/<type>/[slug].ts` skeleton

```tsx
import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const slug = new URL(req.url).pathname.split('/').pop()!
  const data = await fetchRestaurantForOG(slug)

  return new ImageResponse(
    (
      <div style={{ /* card layout */ }}>
        {/* score, name, top item, photo */}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

`@vercel/og` adds CDN cache headers automatically — repeat crawls are free.

## Client-side `Head` updates

For users who navigate the SPA after the initial page load, document head updates via `expo-router/head` so subsequent shares from those URLs carry the right meta:

```tsx
import Head from 'expo-router/head'

export default function RestaurantPage() {
  const { data } = useRestaurant(id)
  if (!data) return null
  return (
    <>
      <Head>
        <title>{data.data.name} — OakRate</title>
        <meta property="og:title" content={data.data.name} />
        <meta property="og:image" content={`https://oakrate.com/og/restaurant/${data.data.slug}`} />
        {/* ... */}
      </Head>
      {/* page body */}
    </>
  )
}
```

Crawlers see the server-injected version (from `api/meta.ts`); users get the client-updated version after hydration. Both are correct for their audience.

## What this gives up vs. full SSR

- **Body SEO** — Google reads an empty body, indexes only the meta tags. Acceptable for Raleigh-only MVP. SEO of body content is not a launch goal.
- **First-paint speed** — Same as today's SPA (load + hydrate). No worse, no better.

## Triggers to upgrade to full SSR

- Adding markets beyond Raleigh — body content starts mattering for SEO
- Web traffic exceeds 10K monthly visitors
- Analytics shows >10% of users hitting web first (vs native)
- Expo Router SSR exits alpha and the integration story (loader + TanStack Query) stabilizes

When upgrading: routes migrate one at a time. The hooks (`query-hooks.md` shape) don't change. Only the route's data fetching layer flips from "client-only" to "server-prefetch + hydrate."

## Open items (resolve during implementation)

- Confirm the exact mechanism for customizing the static HTML template in Expo Router (`app/+html.tsx` or similar). The placeholder injection has to work with whatever Expo emits.
- Decide between `runtime: 'edge'` and `runtime: 'nodejs'` for `api/meta.ts` — edge is faster but has stricter API surface (no `node:fs` in some configurations). May need to inline the index template or fetch it from Vercel Blob.
- OG image card design — match the in-app aesthetic (theme tokens, ScoreDisplay component visual). Build a Storybook story to iterate on.
