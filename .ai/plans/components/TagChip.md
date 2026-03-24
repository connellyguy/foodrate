# TagChip

**File:** `src/components/TagChip.tsx`
**Dependencies:** design tokens

## What It Is

Single attribute tag chip. Supports interactive (selectable) and display-only modes. Used for attribute tags throughout the app — both in the rating flow (multi-select) and as read-only display on cards and detail screens.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| label | string | — | Tag text (e.g., "Crispy") |
| selected | boolean | false | Visual selected state |
| disabled | boolean | false | Dims, disables interaction |
| onPress | () => void | undefined | Tap handler. If omitted, chip is display-only (not pressable). |
| size | 'sm' \| 'md' | 'md' | Font/padding size |

## Visual Design

- **Display-only** (no onPress): subtle background, muted text. Not pressable.
- **Unselected** (interactive): outlined border, muted text
- **Selected** (interactive): filled background (brand color), white text
- **Disabled**: reduced opacity, no press response
- Pill shape (full border radius)

## Accessibility

- Interactive: `accessibilityRole="checkbox"`, `accessibilityState={{ checked: selected, disabled }}`
- Display-only: no role, just text label
- `accessibilityLabel={label}`

## Stories

1. Display-only (sm, md)
2. Unselected interactive
3. Selected interactive
4. Disabled
5. Long label text (wrapping behavior)

## Used On

Rating flow (attribute selection), Item Detail (attribute breakdown), LeaderboardRow (top tags), ItemCard (tag summary), Category Leaderboard (filter chips), RestaurantCard (top tags)
