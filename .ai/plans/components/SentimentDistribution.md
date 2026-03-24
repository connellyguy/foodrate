# SentimentDistribution

**File:** `src/components/SentimentDistribution.tsx`
**Dependencies:** design tokens

## What It Is

4 horizontal bars showing the distribution of sentiment ratings for an item. Replaces the traditional 5-star Amazon-style breakdown. The key visual on the Item Detail screen.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| distribution | { loved: number; liked: number; disliked: number; hated: number } | — | Raw counts per bucket |
| totalCount | number | — | Total ratings (for percentage calculation) |

## Visual Design

- 4 rows, ordered Loved → Hated (positive first)
- Each row: sentiment label (left), proportional fill bar (center), percentage + count (right)
- Bar fill uses sentiment color from theme
- Bar width proportional to percentage of total
- If a bucket has 0 ratings, bar is empty but row still visible

## Accessibility

- Each row: `accessibilityLabel="Loved it: {count} ratings, {percentage} percent"`
- Group: `accessibilityLabel="Sentiment breakdown"`

## Stories

1. Skewed positive (80% Loved, 15% Liked, 3% Didn't like, 2% Hated)
2. Even split (25% each)
3. Skewed negative
4. Single rating (100% in one bucket)
5. High volume (1000+ total)
6. Low volume (3 total)

## Used On

Item Detail screen (aggregate rating block) — single instance but high-visibility
