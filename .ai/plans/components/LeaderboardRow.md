# LeaderboardRow

**File:** `src/components/LeaderboardRow.tsx`
**Dependencies:** ScoreDisplay, TagChipGroup, DistanceBadge, design tokens

## What It Is

A ranked item row for category leaderboards. Shows rank number, item name, restaurant, OakRate Score, top attribute tags, and distance. Optimized for scanning — users compare items vertically.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| rank | number | — | Position in leaderboard (1, 2, 3...) |
| itemName | string | — | Item name |
| restaurantName | string | — | Restaurant name |
| score | number | — | OakRate Score |
| ratingCount | number | — | Total ratings |
| tags | { id: string; label: string }[] | [] | Top 1-3 attribute tags (display-only) |
| distanceMiles | number \| null | — | Distance (null = omit) |
| onPress | () => void | — | Navigates to Item Detail |

## Visual Design

- Rank number: large bold text, left-aligned, fixed width column
- Content block: item name (bold primary), restaurant name (secondary muted), tags (small display chips, max 3)
- Right side: ScoreDisplay (md) + rating count + DistanceBadge below
- Full row is tappable
- Top 3 ranks may get subtle visual distinction (bolder number, slight tint) — optional

## Accessibility

- `accessibilityRole="button"`
- `accessibilityLabel="Number {rank}, {itemName} at {restaurantName}, OakRate score {displayScore}, {ratingCount} ratings"`

## Stories

1. Top-ranked item (#1)
2. Mid-ranked item (#12)
3. With distance
4. Without distance
5. With tags
6. Without tags
7. Long item/restaurant names (truncation)
8. List of multiple rows (visual rhythm)

## Used On

Category Leaderboard — the only screen, but it's the entire screen content
