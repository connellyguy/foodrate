# TextInput

**File:** `src/components/TextInput.tsx`
**Dependencies:** design tokens

## What It Is

Styled text input with label, placeholder, error, and helper text. Used in the rating flow's "add new item" sub-form, profile edit, and auth screens.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| label | string | undefined | Above the input |
| placeholder | string | undefined | Placeholder text |
| value | string | — | Controlled value |
| onChangeText | (text: string) => void | — | Change handler |
| error | string | undefined | Error message below input (red) |
| helperText | string | undefined | Helper text below input (muted) |
| disabled | boolean | false | Dims and disables |
| autoFocus | boolean | false | Focus on mount |
| maxLength | number | undefined | Character limit |
| ...rest | TextInputProps | — | Pass-through RN TextInput props |

## Accessibility

- `accessibilityLabel={label || placeholder}`
- `accessibilityState={{ disabled }}`
- Error text linked via `accessibilityHint`

## Stories

1. Default with label + placeholder
2. With value filled
3. With error message
4. With helper text
5. Disabled state
6. With maxLength counter

## Used On

Rating flow (add new item name), profile (edit display name), auth screens
