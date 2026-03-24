# IconButton

**File:** `src/components/IconButton.tsx`
**Dependencies:** design tokens

## What It Is

Pressable icon-only button with consistent touch target. Used for navigation (back, close, share), inline actions (clear, remove photo), and compact controls.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| icon | ReactNode | — | Icon element to render |
| onPress | () => void | — | Tap handler |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Icon + hitSlop sizing |
| accessibilityLabel | string | — | Required — no visible text |
| disabled | boolean | false | Dims, disables press |
| color | string | textPrimary | Icon tint color |

## Accessibility

- `accessibilityRole="button"`
- `accessibilityLabel` is **required** (no visible text to fall back on)
- Minimum 44x44pt touch target enforced via `hitSlop` if visual size < 44pt
- `accessibilityState={{ disabled }}`

## Stories

1. Default (md) with sample icon
2. All 3 sizes
3. Disabled state
4. Custom color
5. Pressed/highlight state

## Used On

Navigation bars (back, share, close), rating flow (clear selection X, remove photo), search (clear), settings (gear)
