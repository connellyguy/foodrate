# Phase 2a — Query Hooks: Shapes & Fallback Patterns

How the seven read-path hooks expose confidence-first data to screens. Every hook returns a typed shape that makes the confidence pattern visible at the call site, so screens consume them uniformly and fallback rendering is consistent.

## Two return shapes

OakRate's confidence-first principle covers two distinct patterns. Each hook uses one of these shared types — pick the one that matches the hook's job, don't invent a third.

### `ListResult<T>` — swap-fallback queries

For hooks that return a list and may swap to a *different list* when the primary query is sparse.

```ts
export type ListResult<T> = {
  items: T[]
  source: "primary" | "fallback"
  fallbackReason?: "sparse-category" | "no-results" | "no-rated-nearby"
}
```

- `items` — what the screen renders. Always non-empty when `source` is set; if both primary and fallback are empty, hooks return `items: []` with `source: "primary"` and the screen handles its own true-empty case.
- `source` — `"primary"` when the original query had enough data; `"fallback"` when the hook swapped to a different query.
- `fallbackReason` — only set when `source === "fallback"`. Drives the banner copy.

### `DetailResult<T, S = never>` — confidence-labeled detail queries

For hooks that return a single entity (restaurant, item) along with optional supplementary content for sparse cases. The primary entity always renders; the supplementary content shows when confidence is low.

```ts
export type DetailResult<T, S = never> = {
  data: T
  confidence: "high" | "early"
  supplementary?: S
}
```

- `data` — the requested entity. Always present (or the hook is in loading/error state — handled by React Query, not this shape).
- `confidence` — `"high"` when the entity has enough ratings/items to stand on its own; `"early"` when sparse. Drives the "Early" badge on scores and surfaces supplementary content.
- `supplementary` — optional secondary data fetched when `confidence === "early"`. Each hook defines its own `S` type.

Hooks that don't need either pattern (plain lookups like `useCategories`) return their result directly without wrapping.

## Per-hook specification

| Hook | Return type | Primary query | Fallback / supplementary | Threshold |
|---|---|---|---|---|
| `useCategories` | `Category[]` | Featured categories where `featured = true` | None | — |
| `useLeaderboard(categorySlug)` | `ListResult<Item>` | Items in category for current market, ordered by score, with ≥3 ratings | Swap to top-rated items nearby across all featured categories | < 5 items qualify |
| `useRestaurant(id)` | `DetailResult<Restaurant, Item[]>` | Restaurant + its items grouped by category | `supplementary`: top-rated items nearby in the categories the restaurant serves | 0 rated items → `early` |
| `useItem(id)` | `DetailResult<Item, Item[]>` | Item with sentiment distribution, rating count, high-confidence attributes | `supplementary`: the restaurant's other rated items | < 5 ratings → `early` |
| `useSearch(query)` | `ListResult<SearchResult>` | Postgres FTS across restaurants and items, location-aware ranking | Swap to trending items + top categories | 0 results |
| `useNearby(location)` | `ListResult<Item>` | Top-rated items within radius (PostGIS) | Swap to top-rated items in the market, distance-sorted but unbounded | < 5 within radius |
| `useHighConfidenceAttributes(itemId)` | `AttributeTag[]` | Attribute tags appearing on ≥ N% of the item's ratings | None — empty array means hide the attribute section | — |

The exact threshold values are tunable; record final values in this file as they're chosen during implementation.

## Implementation pattern

Conditional fallback fetching uses TanStack Query's `enabled` flag. The fallback query only fires when the primary result is sparse — no wasted requests on the happy path.

Sketch (non-binding — adapt for each hook):

```ts
export function useLeaderboard(categorySlug: string): UseQueryResult<ListResult<Item>> {
  const primary = useQuery({
    queryKey: ["leaderboard", categorySlug],
    queryFn: () => fetchLeaderboard(categorySlug),
  })

  const isSparse = (primary.data?.length ?? 0) < THRESHOLD

  const fallback = useQuery({
    queryKey: ["leaderboard-fallback", categorySlug],
    queryFn: () => fetchNearbyAcrossCategories(),
    enabled: primary.isSuccess && isSparse,
  })

  // Combine into ListResult<Item> ...
}
```

The actual hook returns one merged `UseQueryResult<ListResult<Item>>` so screens get a single loading/error surface. The shape of "merge primary + fallback into one query result" is a small helper worth extracting (`mergeFallback(primary, fallback, reason)`).

## Screen consumption pattern

Screens render `data.items` or `data.data` and use `source` / `confidence` to decide whether to show a banner.

```tsx
function CategoryLeaderboardScreen({ slug }: Props) {
  const { data, isLoading } = useLeaderboard(slug)
  if (isLoading) return <Skeleton />
  return (
    <>
      {data.source === "fallback" && (
        <FallbackBanner reason={data.fallbackReason} />
      )}
      <ItemList items={data.items} />
    </>
  )
}
```

```tsx
function RestaurantDetailScreen({ id }: Props) {
  const { data, isLoading } = useRestaurant(id)
  if (isLoading) return <Skeleton />
  return (
    <>
      <RestaurantHeader restaurant={data.data} />
      {data.confidence === "early" && data.supplementary && (
        <NearbySupplement items={data.supplementary} />
      )}
    </>
  )
}
```

## Shared component this enables

A single `FallbackBanner` component handles all `ListResult`-driven swaps. Lives at `components/FallbackBanner.tsx`, takes `reason` and renders the appropriate copy:

| `fallbackReason` | Banner copy |
|---|---|
| `"sparse-category"` | "This category is light here — also try these popular spots nearby." |
| `"no-results"` | "No matches — here's what's trending nearby." |
| `"no-rated-nearby"` | "Nothing rated nearby yet — showing top-rated across Raleigh." |

Add to the build list under `.ai/plans/components/` once this plan is finalized.

## Cache strategy

One conservative project-wide default, with a single override for the obvious outlier. Configured on the `QueryClient`:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
})
```

Per-hook overrides:

| Hook | Override | Reason |
|---|---|---|
| `useCategories` | `staleTime: Infinity` | Featured set is admin-edited and effectively static during a session. |

Every other hook takes the default. Freshness for rating-driven hooks (`useLeaderboard`, `useNearby`, `useItem`, `useRestaurant`, `useHighConfidenceAttributes`) is handled by the rating-submit mutation calling `queryClient.invalidateQueries` on the affected keys — not by a shorter `staleTime`. `useSearch` is query-keyed, so `staleTime` has no practical effect on it.

**Rule for adding overrides:** one override exists today. If a second override is ever proposed, stop and re-evaluate whether the global default is wrong, rather than accumulating per-hook policy. Drift toward per-hook tuning is the failure mode this section is designed to prevent.

**Prefetching:** not in scope for MVP. Add only when measured navigation latency on a real device shows it's needed.

## Shared primitives

Rule-of-two extraction. The merge logic (combine primary + conditional fallback into one `UseQueryResult<ListResult<T>>` with correct loading/error/data states) starts inlined and is extracted once a second hook needs it.

**Order of work for the `ListResult` hooks** (aligned to the vertical slices in [implementation-plan.md](implementation-plan.md#phase-2-core-app--read-path)):

1. **Slice 1** — Build `useLeaderboard` with merge logic inlined.
2. **Slice 2** — When `useNearby` is built, extract the shared logic to `src/lib/queries/mergeFallback.ts` informed by both call sites. Refactor `useLeaderboard` to use it.
3. **Slice 5** — `useSearch` uses the helper as-is.

The extracted helper is expected to handle only the loading/error/data coordination. The sparseness gate stays at the call site — each hook configures its own fallback query's `enabled` flag based on whatever "sparse" means for that hook (count threshold, distance threshold, zero-results, etc.). Don't push the predicate into the helper.

**`DetailResult` hooks (`useRestaurant`, `useItem`) decide independently.** Both share a shape but only number two, and the supplementary content differs in type (`Item[]` for restaurant, the restaurant's other items for item). Build the first one inlined; revisit shared extraction when the second one is built. May or may not warrant a helper.

## Open items (resolve during implementation)

- Final threshold values for each hook (placeholders above).

SSR loader integration is **not in scope** — full SSR is deferred to post-MVP. Web link previews use a different, lighter approach (see [link-previews.md](link-previews.md)). When SSR is added later, hooks migrate route-by-route without changing this shape.
