# SentimentLabel

**File:** `src/components/SentimentLabel.tsx`
**Dependencies:** design tokens

## What It Is

Read-only badge showing a sentiment value as a labeled chip (e.g., "Loved it"). Used on rating history rows, individual rating cards, and anywhere a single user's sentiment is displayed inline.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| sentiment | -2 \| -1 \| 1 \| 2 | — | The sentiment value |
| size | 'sm' \| 'md' | 'sm' | Font/padding size |

## Visual Design

- Small pill/chip shape
- Background tinted with sentiment color (subtle, not full saturation)
- Text: sentiment label ("Hated it", "Didn't like it", "Liked it", "Loved it")

## Accessibility

- `accessibilityLabel="Rated: {label}"`

## Stories

1. All 4 sentiments at sm size
2. All 4 sentiments at md size
3. Dark mode variants

## Used On

Profile rating history rows, Item Detail individual rating cards, Restaurant View (user's own rating indicator)
