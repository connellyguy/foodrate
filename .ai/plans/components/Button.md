# Button

**File:** `src/components/Button.tsx`
**Dependencies:** design tokens

## What It Is

Standard pressable button with variant support. Used across every screen — submit actions, CTAs, empty state actions.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| title | string | — | Button label text |
| onPress | () => void | — | Tap handler |
| variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Padding/font size |
| loading | boolean | false | Shows spinner, disables press |
| disabled | boolean | false | Dims, disables press |
| fullWidth | boolean | false | Stretches to container width |
| icon | ReactNode | undefined | Optional leading icon |

## Variants

- **primary:** Filled background (brand color), white text
- **secondary:** Outlined border (brand color), brand text, transparent background
- **ghost:** No border/background, brand text only

## Accessibility

- `accessibilityRole="button"`
- `accessibilityLabel={title}` (or custom override)
- `accessibilityState={{ disabled, busy: loading }}`
- Minimum 44x44pt touch target via padding or `hitSlop`

## Stories

1. All 3 variants at default size
2. All 3 sizes with primary variant
3. Loading state (spinner visible)
4. Disabled state (dimmed)
5. Full-width layout
6. With leading icon

## Used On

Rating flow (Submit Rating), empty states (all screens), Restaurant View CTA, Profile actions
