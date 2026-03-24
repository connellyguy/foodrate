# EmptyState

**File:** `src/components/EmptyState.tsx`
**Dependencies:** Button, design tokens

## What It Is

Reusable empty state with illustration, headline, description, and optional CTA button. Every list screen needs one.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| illustration | ReactNode | undefined | Illustration or icon above headline |
| headline | string | — | Primary message (e.g., "No ratings yet") |
| description | string | undefined | Secondary explanatory text |
| actionLabel | string | undefined | CTA button text |
| onAction | () => void | undefined | CTA button handler |

## Visual Design

- Centered vertically in available space
- Illustration (if provided) above headline
- Headline: h2 weight, primary text
- Description: body, secondary text
- CTA: primary Button variant, below description
- Generous spacing between elements

## Accessibility

- Illustration: `accessible={false}` (decorative)
- Headline + description readable by screen reader
- CTA button inherits Button accessibility

## Stories

1. Full layout (illustration + headline + description + CTA)
2. Headline + CTA only (no description)
3. Headline + description only (no CTA)
4. Headline only (minimal)
5. Filtered empty state ("No wings matching these filters" + "Clear filters" CTA)

## Used On

Restaurant View (no rated items), Category Leaderboard (no items / filtered empty), Profile (no ratings), Search (no results), Item Detail (no photos)
