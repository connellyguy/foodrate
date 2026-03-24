# ScoreDisplay

**File:** `src/components/ScoreDisplay.tsx`
**Dependencies:** design tokens

## What It Is

Read-only display of an OakRank Score (0–100 scale). The primary way aggregate ratings appear across the app. Replaces traditional star displays.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| score | number | — | OakRank Score (-100 to +100 from DB, displayed as 0–100) |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Font size / visual weight |
| showLabel | boolean | false | If true, shows a text label below (e.g., "OakRank Score") |
| ratingCount | number | undefined | If provided, shows "(42 ratings)" next to score |

## Score Display Logic

- Raw DB value is -100 to +100. Display maps to 0–100: `displayScore = Math.round((score + 100) / 2)`
- Score < 0 ratings threshold (< 3 ratings): show "New" instead of a number
- Color coding: 80+ strong positive (green), 60-79 positive, 40-59 neutral, < 40 negative (warm/red)

## Accessibility

- `accessibilityLabel="OakRank score {displayScore} out of 100, based on {ratingCount} ratings"`
- Color is not the sole indicator — the number itself carries the information

## Stories

1. High score (90) — sm, md, lg sizes
2. Mid score (55)
3. Low score (25)
4. "New" state (< 3 ratings)
5. With rating count
6. With label

## Used On

ItemCard, LeaderboardRow, RestaurantCard, Item Detail (hero), Browse item cards, Search results
