# Component Plans — Design System

Build order follows the dependency chain: tokens → atoms → domain → composites.

## Built ✅

### 0. Foundation
- [design-tokens.md](design-tokens.md) — colors, typography, spacing, radii (WCAG AA audited)

### Domain Primitives (Storybook complete)
- [ScoreDisplay.md](ScoreDisplay.md) — OakRank Score (0–100) with "New" badge
- [SentimentInput.md](SentimentInput.md) — 4-bucket selector for rating flow
- [SentimentDistribution.md](SentimentDistribution.md) — 4-bar sentiment breakdown
- [TagChip.md](TagChip.md) — single attribute tag (display + interactive modes)
- [DistanceBadge.md](DistanceBadge.md) — formatted distance pill
- [LeaderboardRow.md](LeaderboardRow.md) — ranked item row (composes ScoreDisplay, TagChip, DistanceBadge)

## To Build (Phase 2)

### Composite Components (screen-ready units)
- [CategoryCard.md](CategoryCard.md) — browse grid tile (category name, icon, item count)
- [RestaurantCard.md](RestaurantCard.md) — name, distance, top item, score
- [ItemCard.md](ItemCard.md) — item name, restaurant, score, top tags (search results, nearby lists)
- [SearchInput.md](SearchInput.md) — autocomplete input for restaurants and items

### Atomic Primitives (build as needed by screens)
- [Button.md](Button.md)
- [TextInput.md](TextInput.md)
- [Skeleton.md](Skeleton.md)
- [SectionHeader.md](SectionHeader.md)

Don't pre-build atoms — build them when a screen needs them.

## Deferred

These are designed but deferred until data density supports them:

- [TagChipGroup.md](TagChipGroup.md) — multi-select group for attribute filtering (deferred: no attribute-based leaderboard filters in MVP)
- [SentimentLabel.md](SentimentLabel.md) — read-only sentiment badge (build if needed by a screen)
- [ItemPhoto.md](ItemPhoto.md) — item photo with fallback (build during Phase 3 photo upload)
- [EmptyState.md](EmptyState.md) — largely replaced by confidence-first redirect pattern; may still be needed for Profile empty state
- [IconButton.md](IconButton.md)
- [Avatar.md](Avatar.md)
- [Badge.md](Badge.md)
- [Divider.md](Divider.md)
