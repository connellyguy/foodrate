# Browse

The app's front door. A launcher, not a feed. Routes users to the core question: "where's the best [food] near me?" via the category grid. Restaurant/dish search lives in its own tab.

---

## Components (Top to Bottom)

### Status Bar + Header Row

| Element | Type | Details |
|---------|------|---------|
| Status bar | System | Standard iOS/Android (clock, signal, battery) |
| Market label | Static text | "Raleigh, NC" — small, left-aligned. Not tappable in MVP (single market). Rendered as a component that becomes a city picker post-MVP. |

### Category Grid

| Element | Type | Details |
|---------|------|---------|
| Section header | Bold text | "What are you craving?" |
| Category grid | 2-column scrollable grid | 20 cells total — one per MVP category. Each cell: category icon/illustration, category name, subtitle with rated-item count (e.g., "48 rated items"). Tapping navigates to that Category Leaderboard. |

All 20 categories visible without a "see all" gate. Grid scrolls as part of the main page scroll (no nested scroll view).

### Top Rated Nearby

| Element | Type | Details |
|---------|------|---------|
| Section header | Bold text | "Top rated near you" (or "Top rated in Raleigh" if location denied) |
| Item cards | Horizontal scrolling list | 5–8 cards. Each card: item name, restaurant name, star rating (numeric), rating count, category tag pill, photo thumbnail (fallback: category illustration). Tappable → Item Detail. |

Ranked by Bayesian average or Wilson score (not raw average). Items with fewer than 3 ratings excluded.

### Tab Bar

Native platform tab bar (see SCREENS.md Navigation section), persistent across all screens except Rating Flow modal.

| Element | Type | State |
|---------|------|-------|
| Browse tab | Grid/compass icon | **Active** |
| Search tab | Magnifying glass icon (search role) | Inactive. On iOS 26, morphs into bottom search field when tapped. |
| Rate tab | Plus icon, brand-colored | Inactive. Opens Rating Flow as full-screen modal. |
| Profile tab | Person icon | Inactive. Switches to Profile tab stack. |

---

## Primary User Path

**Browse a category leaderboard** — the most common path because it requires zero typing.

1. User opens the app → lands on Browse.
2. Scans the category grid.
3. Taps a category (e.g., "Wings").
4. Navigates to Category Leaderboard for Wings in Raleigh.

---

## Alternate Paths

| Path | Action | Destination |
|------|--------|-------------|
| Browse trending item | Tap a card in "Top rated near you" | Item Detail |
| Start a rating | Tap Rate tab | Rating Flow (modal). Auth gate if not signed in. |
| Search | Tap Search tab | Search tab |
| View profile | Tap Profile tab | Profile / My Ratings. Sign-in prompt if not signed in. |

---

## Entry Points

| Source | Trigger | State |
|--------|---------|-------|
| App launch (cold) | User opens OakRank | Default. Location permission requested if not yet granted. |
| App launch (warm) | User returns from background | Preserved scroll position. Silent background data refresh if stale (>5 min). |
| Back from Category Leaderboard | Back navigation | Scroll position preserved. |
| Tab bar | Tap "Browse" tab from any screen | Scrolls to top if already on Browse. |
| After completing a rating | Rating Flow modal dismissed | Returns to Browse if it was behind the modal. |
| Deep link | oakrank.app with no specific path | Browse screen. |

---

## Exit Points

| Action | Destination |
|--------|-------------|
| Tap a category cell | Category Leaderboard (push navigation) |
| Tap a trending item card | Item Detail (push navigation) |
| Tap Rate tab | Rating Flow (modal). Auth gate if not signed in. |
| Tap Search tab | Search (tab switch) |
| Tap Profile tab | Profile / My Ratings (tab switch) |

---

## Edge Cases

| State | Behavior |
|-------|----------|
| Location denied | Category grid normal. "Top rated near you" becomes "Top rated in Raleigh" — city-wide, no distances. Dismissable banner: "Enable location for closer results." |
| No network | Show cached data. If no cache, show category grid (bundled static data) with inline error in "Top rated" section. |
| Signed out | Home looks identical. No personalization in MVP. Auth gated only at point of rating. |
