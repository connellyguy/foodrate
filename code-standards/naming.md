# Naming Conventions

## Identifiers

| What | Convention | Example |
|------|-----------|---------|
| Variables, functions, hooks | `camelCase` | `ratingCount`, `useLocation` |
| React components | `PascalCase` | `RestaurantCard`, `RatingStars` |
| Types, interfaces | `PascalCase`, no prefix | `Restaurant`, `RatingInput` |
| Constants (env/config level) | `SCREAMING_SNAKE_CASE` | `API_URL`, `MAX_RATING` |
| Constants (module level) | `camelCase` | `defaultPageSize`, `ratingCategories` |

Do not prefix interfaces with `I` or types with `T`.

## Files

Files are named to match their default export:

| Content | Convention | Example |
|---------|-----------|---------|
| Component | `PascalCase.tsx` | `RestaurantCard.tsx` |
| Hook | `camelCase.ts` | `useLocation.ts` |
| Utility | `camelCase.ts` | `formatRating.ts` |
| Type definitions | `camelCase.ts` | `ratings.types.ts` |
| Route files (Expo Router) | Lowercase per framework convention | `index.tsx`, `search.tsx`, `[id].tsx` |

Auto-generated files (e.g., `database.types.ts` from Supabase) are exempt from naming rules.
