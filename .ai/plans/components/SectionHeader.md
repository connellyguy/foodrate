# SectionHeader

**File:** `src/components/SectionHeader.tsx`
**Dependencies:** design tokens

## What It Is

Section title with optional trailing action link. Used to introduce content sections on Browse, Item Detail, Profile, and other screens.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| title | string | — | Section title text |
| action | string | undefined | Action link text (e.g., "See all") |
| onActionPress | () => void | undefined | Action tap handler |
| subtitle | string | undefined | Optional muted subtitle below title |

## Accessibility

- Title: standard text, no special role
- Action link: `accessibilityRole="link"`, `accessibilityLabel={action}`

## Stories

1. Title only
2. Title + action link
3. Title + subtitle
4. Title + subtitle + action link

## Used On

Browse ("What are you craving?", "Top rated near you"), Item Detail ("What people notice", "Photos (14)", "Ratings"), Profile ("By Category", "My Ratings")
