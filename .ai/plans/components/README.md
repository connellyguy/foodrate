# Component Plans — Phase 2a (Design System + Storybook)

Build order follows the dependency chain: tokens → atoms → domain → composites.

## Build Order

### 0. Foundation
- [design-tokens.md](design-tokens.md) — colors, typography, spacing, radii

### 1. Atomic Primitives (no OakRank logic)
- [Button.md](Button.md)
- [TextInput.md](TextInput.md)
- [SearchInput.md](SearchInput.md)
- [IconButton.md](IconButton.md)
- [Avatar.md](Avatar.md)
- [Badge.md](Badge.md)
- [Divider.md](Divider.md)
- [Skeleton.md](Skeleton.md)
- [SectionHeader.md](SectionHeader.md)

### 2. Domain Primitives (OakRank-specific, multi-screen reuse)
- [ScoreDisplay.md](ScoreDisplay.md) — OakRank Score (0–100)
- [SentimentInput.md](SentimentInput.md) — 4-bucket selector for rating flow
- [SentimentLabel.md](SentimentLabel.md) — read-only sentiment badge
- [SentimentDistribution.md](SentimentDistribution.md) — 4-bar breakdown
- [TagChip.md](TagChip.md) — single attribute tag
- [TagChipGroup.md](TagChipGroup.md) — multi-select group
- [DistanceBadge.md](DistanceBadge.md) — formatted distance pill
- [ItemPhoto.md](ItemPhoto.md) — item photo with fallback

### 3. Composite Components (compose primitives into screen-ready units)
- [CategoryCard.md](CategoryCard.md)
- [RestaurantCard.md](RestaurantCard.md)
- [ItemCard.md](ItemCard.md)
- [LeaderboardRow.md](LeaderboardRow.md)
- [EmptyState.md](EmptyState.md)
