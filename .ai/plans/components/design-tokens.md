# Design Tokens

**File:** `src/constants/theme.ts`
**Dependency:** None — this is the foundation for every component.

## What It Is

A single theme object exporting colors (light/dark), typography scale, spacing scale, and border radii. Consumed via `StyleSheet.create` throughout the app. No CSS units — React Native density-independent pixels only.

## Tokens to Define

### Colors
- **Brand:** primary, primaryLight, primaryDark
- **Sentiment:** loved (strong positive), liked (positive), disliked (negative), hated (strong negative)
- **Neutral:** background, surface, textPrimary, textSecondary, textTertiary, border, divider
- **Semantic:** error, success, warning
- **Dark mode:** matching set for each

### Typography
- **Scale:** display, h1, h2, h3, body, bodySmall, caption, label
- Each entry: fontSize, lineHeight, fontWeight, letterSpacing

### Spacing
- 4-point grid: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Radii
- sm (4), md (8), lg (12), xl (16), full (9999)

### Shadows
- sm, md, lg — platform-specific (iOS shadow* properties, Android elevation)

## Stories

- Color palette swatch grid (light + dark)
- Typography scale specimen
- Spacing scale visualization
- Radius samples on boxes

## Notes

- Export as `theme` object with `light` and `dark` variants
- Use `useColorScheme()` from React Native to select variant
- No ThemeProvider/context needed initially — direct import. Add context if theme switching becomes dynamic.
