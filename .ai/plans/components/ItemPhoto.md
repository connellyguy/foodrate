# ItemPhoto

**File:** `src/components/ItemPhoto.tsx`
**Dependencies:** design tokens

## What It Is

Item photo with loading state and fallback placeholder. Wraps React Native Image with consistent styling, error handling, and a category-based fallback illustration.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| uri | string \| null | — | Supabase Storage URL. Null = show fallback. |
| size | number | 80 | Width and height in points |
| borderRadius | number | theme.radii.md | Corner rounding |
| fallbackCategory | string | undefined | Category name for illustration fallback |
| accessibilityLabel | string | — | Required — describes the photo content |

## Behavior

- Loading: shows Skeleton placeholder at same dimensions
- Loaded: shows the image with border radius
- Error / null URI: shows fallback (category illustration if provided, generic food icon otherwise)

## Accessibility

- `accessibilityLabel` is required — describes the photo (e.g., "Photo of buffalo wings from Beasley's")
- Fallback: `accessibilityLabel="No photo available"`

## Stories

1. With valid image URL
2. Loading state (skeleton)
3. Null URI with category fallback
4. Null URI without fallback (generic)
5. Error state (broken URL → fallback)
6. Size variants (40, 80, 120)

## Used On

ItemCard (thumbnail), Item Detail (photo grid), Rating flow (photo preview), Profile rating rows (thumbnail), Browse item cards
