# Storybook Components — Build Plan

Storybook is set up. Stories go in `src/components/` co-located with their component (`ComponentName.stories.tsx`). Run `npm run storybook` to generate the requires file and start Expo, then navigate to `/storybook` in dev.

## Build Order

### Step 1: Theme Reference Story

**File:** `src/components/ThemeReference.stories.tsx` (story-only, no component file)

A single "documentation" story that renders all design tokens in one scrollable view:

- **Color swatches:** brand palette (orange 50–900), sentiment colors (loved/liked/disliked/hated with their backgrounds), neutrals (neutrals 50–900, warm/beige tint), semantic (error/success/warning)
- **Typography scale:** each level (display → caption) rendered with its name, size, and weight
- **Spacing scale:** labeled boxes at each spacing value (xxs → 6xl)
- **Border radii:** boxes with each radius applied
- **Shadows:** cards with sm/md/lg elevation
- **Sentiment meta:** the 4 buckets with their labels, descriptions, and color assignments

This becomes the living reference sheet for all design decisions.

### Step 2: SentimentInput

**Files:** `src/components/SentimentInput.tsx`, `src/components/SentimentInput.stories.tsx`

Dependencies: theme only, Lucide icons.

Component: 4-button horizontal row (ThumbsDown, Frown, Smile, Heart icons from Lucide). Single-select with tap-to-deselect. Description text below on selection.

Stories:
- No selection (default)
- Each of the 4 sentiments selected
- Dark mode variant

### Step 3: SentimentDistribution

**Files:** `src/components/SentimentDistribution.tsx`, `src/components/SentimentDistribution.stories.tsx`

Dependencies: theme only.

Component: 4 horizontal bars (Loved → Hated) with proportional fill, labels, and percentages.

Stories:
- Skewed positive (72/18/7/3)
- Even split (25 each)
- Single rating (1 in one bucket)
- Skewed negative

### Step 4: Atoms for LeaderboardRow

Three small components, each with their own story file:

**ScoreDisplay** — `src/components/ScoreDisplay.tsx`
- Renders OakRate score (maps -100..+100 to 0..100 display)
- Color-coded by score range
- "New" state for < 3 ratings
- Props: score, size (sm/md/lg), ratingCount
- Stories: high/mid/low scores, "New" state, size variants

**TagChip** — `src/components/TagChip.tsx`
- Small pill with label text
- Display-only for now (interactive selection added later)
- Props: label, size (sm/md)
- Stories: various labels, size variants

**DistanceBadge** — `src/components/DistanceBadge.tsx`
- Formatted distance pill ("0.3 mi", "Nearby", etc.)
- Returns null when distance is null
- Props: distanceMiles
- Stories: close/medium/far distances, null

### Step 5: LeaderboardRow

**Files:** `src/components/LeaderboardRow.tsx`, `src/components/LeaderboardRow.stories.tsx`

Dependencies: ScoreDisplay, TagChip, DistanceBadge.

Component: full-width row with rank number, item/restaurant names, tag chips, score, distance.

Stories:
- Top-ranked item (#1) with all data
- Mid-ranked (#5) with fewer tags
- Without distance
- List of 3 rows (visual rhythm)

## After Building

After each component, get user feedback in Storybook on-device. Iterate on colors, spacing, and proportions before moving to the next. The theme reference story is the baseline — update `theme.ts` if any token decisions change during iteration.
