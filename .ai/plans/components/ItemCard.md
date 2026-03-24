# ItemCard

**File:** `src/components/ItemCard.tsx`
**Dependencies:** ScoreDisplay, TagChipGroup, ItemPhoto, SentimentLabel, design tokens

## What It Is

Item summary card showing dish name, restaurant, OakRank Score, top attribute tags, and optional photo. The most reused composite component — appears on 5+ screens.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| name | string | — | Item name (e.g., "Dry Rub Wings") |
| restaurantName | string | — | Restaurant name |
| score | number | — | OakRank Score |
| ratingCount | number | — | Total ratings |
| tags | { id: string; label: string }[] | [] | Top attribute tags (max 3) |
| photoUri | string \| null | null | Item photo URL |
| category | string | — | Category name for tag pill |
| userSentiment | -2 \| -1 \| 1 \| 2 \| null | null | Current user's sentiment (shows SentimentLabel if rated) |
| onPress | () => void | — | Navigates to Item Detail |
| layout | 'card' \| 'row' | 'row' | Card = vertical for scroll lists, Row = horizontal for ranked lists |

## Visual Design

### Card layout (horizontal scroll lists)
- Vertical stack: photo (top, full width), name, restaurant, score, category pill
- Fixed width card in scroll

### Row layout (Restaurant View, Profile history)
- Horizontal: photo thumbnail (left, 80pt), content (center), score (right)
- Content: name (bold), restaurant (secondary), tags (display-only, max 3)
- Optional SentimentLabel if user has rated

## Accessibility

- `accessibilityRole="button"`
- `accessibilityLabel="{name} at {restaurantName}, OakRank score {displayScore}, {ratingCount} ratings"`

## Stories

1. Row layout — full data
2. Row layout — no photo
3. Row layout — with user sentiment
4. Row layout — "New" item (< 3 ratings)
5. Card layout — full data
6. Card layout — no photo (category fallback)
7. Long name truncation
8. No tags

## Used On

Browse (trending items — card), Restaurant View (item list — row), Search (item results — row), Profile (rating history — row), Item Detail entry from various screens
