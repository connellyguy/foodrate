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

- Normal text: 4.5:1
- Large text (18pt+ or 14pt+ bold): 3:1

## Screen Reader Testing

Test with VoiceOver (iOS) and TalkBack (Android) before shipping new screens. The rating flow especially must be fully navigable via screen reader.
