# Skeleton

**File:** `src/components/Skeleton.tsx`
**Dependencies:** design tokens

## What It Is

Animated loading placeholder shape. Replaces content while data is loading. Matches the dimensions of the content it stands in for.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| width | number \| string | '100%' | Width (number for fixed, string for relative) |
| height | number | 16 | Height in points |
| borderRadius | number | theme.radii.sm | Corner rounding |
| circle | boolean | false | If true, renders as a circle (width = height = size) |

## Behavior

- Subtle shimmer/pulse animation (Animated API, no external lib)
- Background color from theme (neutral surface + slight contrast)

## Accessibility

- `accessibilityLabel="Loading"`
- `accessibilityRole="progressbar"` if standalone, `accessible={false}` if inside a skeleton group

## Stories

1. Text line skeleton (default)
2. Circle skeleton (avatar placeholder)
3. Card-sized skeleton (image placeholder)
4. Group: skeleton ItemCard layout (multiple skeletons composing a card shape)

## Used On

Every screen during initial data load (Phase 4 polish pass)
