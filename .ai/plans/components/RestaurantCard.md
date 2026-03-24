# RestaurantCard

**File:** `src/components/RestaurantCard.tsx`
**Dependencies:** ScoreDisplay, DistanceBadge, TagChip, design tokens

## What It Is

Restaurant summary card showing name, distance, top-rated item, and category coverage. Used in horizontal scroll lists and search results.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| name | string | — | Restaurant name |
| addressLine | string | — | Street address |
| distanceMiles | number \| null | — | Distance (null = omit) |
| topItem | { name: string; score: number; ratingCount: number } \| null | — | Highest-scored item |
| categories | string[] | — | Top 2-3 category names |
| ratedItemCount | number | — | Total rated items at this restaurant |
| onPress | () => void | — | Navigates to Restaurant View |

## Visual Design

- Card shape with subtle elevation/border
- Restaurant name (bold, primary)
- Address + DistanceBadge on same line
- Top item preview: "{item name} — {score}" if available
- Category tags as small display-only TagChips
- Rated item count as caption text

## Accessibility

- `accessibilityRole="button"`
- `accessibilityLabel="{name}, {distanceMiles} miles away, {ratedItemCount} rated items"`

## Stories

1. Full data (name, distance, top item, categories)
2. No location (distance omitted)
3. No rated items yet (top item null)
4. Long restaurant name (truncation)
5. In horizontal scroll list (multiple cards)

## Used On

Browse ("Top rated near you"), Search (restaurant results)
