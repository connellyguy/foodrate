# Badge

**File:** `src/components/Badge.tsx`
**Dependencies:** design tokens

## What It Is

Small label or count indicator. Used for category card item counts, tag overflow indicators ("+3"), and potential future tab badges.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| label | string | — | Text to display |
| variant | 'default' \| 'muted' | 'default' | Color treatment |
| size | 'sm' \| 'md' | 'sm' | Font/padding size |

## Accessibility

- `accessibilityLabel={label}` (screen readers read the text content directly)
- Not interactive — no role needed

## Stories

1. Default variant with short text ("48")
2. Default variant with longer text ("48 rated items")
3. Muted variant
4. Overflow indicator ("+3")
5. Both sizes

## Used On

CategoryCard (item count), TagChipGroup (overflow "+N"), rating count displays
