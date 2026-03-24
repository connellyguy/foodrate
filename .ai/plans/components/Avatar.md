# Avatar

**File:** `src/components/Avatar.tsx`
**Dependencies:** design tokens

## What It Is

Circular image displaying a user's photo or initials-based fallback. Used on the profile screen and individual rating cards on item detail.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| uri | string \| null | null | Image URL from auth provider |
| name | string \| null | null | Display name for initials fallback |
| size | number | 40 | Diameter in points |

## Behavior

- If `uri` is provided and loads: show the image, circular crop
- If `uri` fails or is null, and `name` is provided: show first letter of name on a colored background (deterministic color from name hash)
- If both are null: show default silhouette icon

## Accessibility

- `accessibilityLabel="Profile photo of {name}"` or `"Default profile photo"`
- Decorative in rating cards (avatar + display name together) — can be `accessible={false}` when name text is adjacent

## Stories

1. With photo URL
2. Initials fallback (single letter)
3. Default silhouette (no data)
4. Size variants (32, 40, 64)
5. Broken image URL → fallback

## Used On

Profile screen (64pt), item detail rating cards (32pt)
