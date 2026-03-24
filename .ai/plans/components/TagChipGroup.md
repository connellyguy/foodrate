# TagChipGroup

**File:** `src/components/TagChipGroup.tsx`
**Dependencies:** TagChip, Badge

## What It Is

Multi-select wrapper around TagChip components. Handles layout (wrap or horizontal scroll), selection state, and optional overflow indicator.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| tags | { id: string; label: string }[] | — | Available tags |
| selected | string[] | [] | IDs of selected tags |
| onChange | (selected: string[]) => void | undefined | Multi-select change handler. If omitted, all chips are display-only. |
| layout | 'wrap' \| 'scroll' | 'wrap' | Wrap = flex-wrap, Scroll = horizontal ScrollView |
| maxVisible | number | undefined | If set, show only N tags + "+X" overflow badge |
| disabled | boolean | false | Disables all chips |

## Accessibility

- Group: `accessibilityRole="group"`, `accessibilityLabel="Attribute tags"`
- Overflow badge: `accessibilityLabel="{N} more tags"`

## Stories

1. Wrap layout, all unselected
2. Wrap layout, some selected
3. Scroll layout (horizontal)
4. With maxVisible overflow (show 3, "+4" badge)
5. Display-only (no onChange)
6. Empty (no tags) — renders nothing

## Used On

Rating flow (attribute selection — wrap), Category Leaderboard (filter bar — scroll), ItemCard/LeaderboardRow (display — wrap, maxVisible), Profile (category filter — scroll)
