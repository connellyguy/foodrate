# SearchInput

**File:** `src/components/SearchInput.tsx`
**Dependencies:** design tokens, IconButton

## What It Is

Text input with search icon (left), clear button (right), and optional loading indicator. Used in the rating flow's restaurant/item autocomplete fields. Note: the Search tab uses native platform search chrome — this component is for in-screen search fields only.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| placeholder | string | 'Search...' | Placeholder text |
| value | string | — | Controlled value |
| onChangeText | (text: string) => void | — | Change handler |
| onClear | () => void | undefined | Clear button handler (hides if omitted) |
| onFocus | () => void | undefined | Focus handler |
| onBlur | () => void | undefined | Blur handler |
| loading | boolean | false | Shows spinner instead of search icon |
| disabled | boolean | false | Dims and disables |
| autoFocus | boolean | false | Focus on mount |

## Accessibility

- `accessibilityRole="search"`
- `accessibilityLabel={placeholder}`
- Clear button: `accessibilityLabel="Clear search"`

## Stories

1. Empty state with placeholder
2. With typed text + clear button visible
3. Loading state (spinner replaces search icon)
4. Disabled state
5. Focused state

## Used On

Rating flow (restaurant selector, item selector)
