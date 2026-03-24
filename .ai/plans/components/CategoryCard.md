# CategoryCard

**File:** `src/components/CategoryCard.tsx`
**Dependencies:** design tokens, Badge

## What It Is

Grid cell for the Browse screen's category grid. Displays a food category with an icon/illustration and item count. Tappable — navigates to that category's leaderboard.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| name | string | — | Category name (e.g., "Wings") |
| slug | string | — | URL slug for navigation |
| itemCount | number | — | Number of rated items in this category |
| onPress | () => void | — | Tap handler (navigates to category leaderboard) |

## Visual Design

- Fixed aspect ratio card in a 2-column grid
- Category icon or illustration (top) — initially use emoji or simple icon per category, replace with illustrations later
- Category name (bold, center)
- Item count badge below name (e.g., "48 rated items")
- Subtle border or surface elevation

## Accessibility

- `accessibilityRole="button"`
- `accessibilityLabel="{name}, {itemCount} rated items"`
- Minimum 44pt height (will be larger by design)

## Stories

1. Standard card with icon + count
2. Zero items (count shows "No ratings yet")
3. High count (1000+)
4. Grid layout preview (2x3 grid of cards)
5. Dark mode

## Used On

Browse screen (category grid) — 20 instances
