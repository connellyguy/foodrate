# TypeScript

Strict mode is enabled in `tsconfig.json`. Keep it that way.

## `any`

Banned. Use `unknown` and narrow, or define an explicit type. If truly unavoidable, use `// eslint-disable-next-line` with a comment explaining why.

## `type` vs `interface`

Use `type` by default. It handles unions, intersections, mapped types, and simple object shapes. Use `interface` only when you need declaration merging (rare — mostly for extending third-party library types).

```ts
// Preferred
type Restaurant = {
    id: string;
    name: string;
    location: GeoPoint;
};

type RatingInput = Pick<Rating, 'itemId' | 'sentiment'> & {
    attributes?: string[];
};

// Only when needed
interface SupabaseContext extends BaseContext {
    client: SupabaseClient;
}
```

## Enums

Avoid. Use `as const` objects or string union types instead. Enums have unexpected runtime behavior and add bundle weight.

```ts
// Avoid
enum SortOrder {
    Rating = 'rating',
    Distance = 'distance',
}

// Preferred
type SortOrder = 'rating' | 'distance';

// When you need runtime access to the values
const sortOrders = ['rating', 'distance'] as const;
type SortOrder = (typeof sortOrders)[number];
```

## Non-null Assertion (`!`)

Discouraged. Prefer optional chaining (`?.`) or explicit narrowing. Allowed sparingly when the assertion is provably safe, with a comment explaining why.
