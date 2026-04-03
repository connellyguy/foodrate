# Accessibility

OakRank is a consumer app. Accessible implementation is a requirement, not an enhancement.

## Interactive Elements

Every `Pressable`, `TouchableOpacity`, or other touchable component requires:

- `accessibilityLabel` — what it is or does, in plain language
- `accessibilityRole` — the semantic role (`button`, `link`, `tab`, etc.)

```tsx
<Pressable
    onPress={handleRate}
    accessibilityLabel="Rate this item"
    accessibilityRole="button"
>
    ...
</Pressable>
```

## Images

Every `Image` requires `accessibilityLabel` describing the content. Decorative images that add no meaning get `accessible={false}` instead.

```tsx
<Image
    source={{ uri: item.photoUrl }}
    accessibilityLabel="Photo of buffalo wings from Beasley's"
/>

<Image
    source={require('@/assets/divider.png')}
    accessible={false}
/>
```

## Touch Targets

Minimum touch target size: **44x44 points** (Apple Human Interface Guidelines). Use `hitSlop` if the visual element is smaller than 44pt.

## Color Contrast

Text and interactive elements must meet WCAG 2.1 AA contrast ratios:

- Normal text: **4.5:1**
- Large text (18pt+ or 14pt+ bold): **3:1**
- Non-text UI components (borders, icons conveying meaning): **3:1**

### Token-level rules

Every text color token must pass against all surfaces it will appear on:

| Token | Light backgrounds | Dark backgrounds |
|---|---|---|
| `textPrimary` | `background`, `surface`, `surfaceElevated` | same |
| `textSecondary` | `background`, `surface`, `surfaceElevated` | same |
| `textTertiary` | `background`, `surface` (NOT `surfaceElevated`) | same |
| `textInverse` | `primary`, all sentiment colors | same |
| Sentiment colors | Their matching `*Background` token, plus `background` (for score text) | same |

### Common pitfalls

- **`textTertiary` on small text** — tertiary is the dimmest text token. At caption size (12px) it's always normal text (needs 4.5:1). Never weaken it further with reduced opacity.
- **White text on brand/sentiment colors** — orange and mid-tone greens/ambers may not be dark enough for white text at 4.5:1. Always verify.
- **Pill/badge backgrounds** — if a component's background is nearly the same as the page background, the text contrast may pass but the component boundary fails the 3:1 non-text contrast requirement.
- **Disabled states using opacity** — reducing opacity on already-low-contrast text can push it below readable thresholds. Disabled elements are exempt from WCAG contrast requirements, but the text should still be perceptible.

### When adding or changing colors

1. Verify the new color against every background it will appear on, in both light and dark modes.
2. If a color is used for text on a vivid background (buttons, selected states, sentiment), verify `textInverse` contrast against that color.
3. Use a contrast checker — do not eyeball it.

## Screen Reader Testing

Test with VoiceOver (iOS) and TalkBack (Android) before shipping new screens. The rating flow especially must be fully navigable via screen reader.
