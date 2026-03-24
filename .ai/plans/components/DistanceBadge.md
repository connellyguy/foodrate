# DistanceBadge

**File:** `src/components/DistanceBadge.tsx`
**Dependencies:** design tokens

## What It Is

Formatted distance label displayed as a small pill. Handles unit formatting and the "location unavailable" case.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| distanceMiles | number \| null | — | Distance in miles. Null = location unavailable (component renders nothing). |

## Display Logic

- < 0.1 mi: "Nearby"
- < 10 mi: one decimal (e.g., "0.3 mi", "2.1 mi")
- >= 10 mi: rounded (e.g., "12 mi")
- null: component returns null (renders nothing — no empty space)

## Accessibility

- `accessibilityLabel="{formatted distance} away"` or `"Nearby"`

## Stories

1. Close distance (0.05 → "Nearby")
2. Medium distance (2.3 → "2.3 mi")
3. Far distance (15.7 → "16 mi")
4. Null (renders nothing)

## Used On

RestaurantCard, LeaderboardRow, Item Detail, Restaurant View header, Search results
