# SentimentInput

**File:** `src/components/SentimentInput.tsx`
**Dependencies:** design tokens

## What It Is

The core rating input. A 4-button selector for the sentiment buckets: Hated it, Didn't like it, Liked it, Loved it. Single-select with tap-to-deselect. This is the component that replaces star input throughout the app.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| value | -2 \| -1 \| 1 \| 2 \| null | null | Selected sentiment (null = none) |
| onChange | (value: -2 \| -1 \| 1 \| 2 \| null) => void | — | Change handler. Tapping selected value sends null (deselect). |

## Sentiment Values

| DB Value | Label | Description |
|----------|-------|-------------|
| -2 | Hated it | Nobody should order this |
| -1 | Didn't like it | Wouldn't order again, but might suit your taste |
| 1 | Liked it | I'd order again |
| 2 | Loved it | I'd come back here for this dish |

## Visual Design

- 4 buttons in a horizontal row, equal width
- Unselected: outlined, muted text
- Selected: filled with sentiment color (from theme.colors.sentiment), white text, brief scale-up animation
- Each button: emoji or icon + label text vertically stacked
- Minimum 48pt height per button (accessibility requirement)
- Description text appears below the row after selection

## Accessibility

- Group: `accessibilityRole="radiogroup"`, `accessibilityLabel="How was this dish?"`
- Each button: `accessibilityRole="radio"`, `accessibilityState={{ checked: isSelected }}`
- `accessibilityLabel` on each button includes the description (e.g., "Loved it — I'd come back here for this dish")

## Stories

1. No selection (default)
2. Each sentiment selected (4 stories)
3. Selection → deselection tap
4. Animation on selection change
5. Dark mode

## Used On

Rating flow (single instance — the core interaction)
