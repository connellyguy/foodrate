# Category Leaderboard

Answers "Where is the best [food] near me?" with a ranked, filterable list of items across all restaurants in one food category. Example: "Wings in Raleigh."

---

## Components (Top to Bottom)

### Navigation Bar

| Element | Type | Details |
|---------|------|---------|
| Back arrow | Icon button | Returns to previous screen |
| Screen title | Text | "{Category} in Raleigh" (e.g., "Wings in Raleigh") |

### Attribute Filter Chips

| Element | Type | Details |
|---------|------|---------|
| Chip row | Horizontal scrollable | One chip per attribute defined for this category (e.g., for Wings: crispy, saucy, bone-in, boneless, extra spicy, generous portion, dry rub). |
| Default state | All unselected | List shows overall ranking. |
| Selected state | Chip fills/highlights | List re-ranks to items where raters tagged that attribute. Multiple chips = AND logic. |
| Chip order | By usage frequency | Most-tagged attribute first. |
| Interaction | Tap to toggle | Selecting a chip scrolls list back to top. |

### Result Count

Subtle text below chips: "23 items ranked" or when filtered: "8 items matching 'crispy'".

### Ranked Item List

Scrollable vertical list. Full list rendered (no pagination at MVP scale).

Each row (entire row tappable → Item Detail):

| Element | Type | Details |
|---------|------|---------|
| Rank number | Large bold text | Sequential (1, 2, 3…). Re-numbers when filters change. |
| Item name | Primary bold text | e.g., "Smoked Wings" |
| Restaurant name | Secondary muted text | e.g., "Beasley's Chicken + Honey" |
| Star rating | Stars + numeric | Aggregate rating (e.g., ★★★★☆ 4.2) |
| Rating count | Tertiary text | e.g., "(38 ratings)" |
| Top attribute tags | 1–3 small display chips | Most frequently selected attributes. Display only (not filters). |
| Distance | Tertiary text | e.g., "1.2 mi". Omitted if location unavailable. |

No item photos in list rows. Photos live on Item Detail. The leaderboard is a scannable ranked list.

**Minimum rating threshold**: Items with fewer than 3 ratings excluded. Threshold is invisible to users.

**Tie-breaking**: Same aggregate → item with more ratings ranks higher.

### Empty State (No Items in Category)

- Message: "No rated [category] yet. Be the first to rate one."
- CTA: "Rate a [category item]" → Rating Flow with category context.

### Filtered Empty State

- Message: "No [category] matching these filters yet."
- CTA: "Clear filters" → resets all chips.

### Tab Bar

| Element | Type | State |
|---------|------|-------|
| Browse tab | Fork.knife icon | **Active** if navigated from Browse stack (primary case). |
| Profile tab | Person icon | Inactive. Switches to Profile tab stack. |
| Rate tab | Plus icon, brand-colored | Opens Rating Flow modal (no pre-fill). |
| Search tab | Magnifying glass icon (search role) | **Active** if navigated from Search stack. |

---

## Primary User Path

**Find the highest-rated item in a category.**

1. Land on Category Leaderboard (from Home category grid).
2. Scan the ranked list (already sorted best-first).
3. Tap the #1 (or any interesting) item row.
4. Navigate to Item Detail.

---

## Alternate Paths

| Path | Steps | Destination |
|------|-------|-------------|
| Filter by attribute | Tap chip (e.g., "crispy") → list re-ranks → tap item | Item Detail |
| Multiple filters | Tap "crispy" + "bone-in" → list narrows (AND) → tap item | Item Detail |
| Clear a filter | Tap active chip to deselect | Stay on screen, list re-ranks |
| Clear all (empty state) | Tap "Clear filters" CTA | Stay on screen, full list restored |
| Rate from empty state | Tap "Rate a [category]" CTA | Rating Flow (category context) |
| Navigate back | Tap back arrow | Previous screen |
| Tab navigation | Tap any tab or Rate tab | Respective screen |

---

## Entry Points

| # | Source | Trigger |
|---|--------|---------|
| 1 | Home / Explore | Tap a category in the grid (primary entry — vast majority of traffic) |
| 2 | Search | Type a category name, tap category result |
| 3 | Item Detail | Tap the category pill on an item |
| 4 | Deep link | `oakrank.app/raleigh/wings` |

---

## Exit Points

| # | Action | Destination |
|---|--------|-------------|
| 1 | Tap an item row | Item Detail |
| 2 | Tap back arrow | Previous screen |
| 3 | Tap Browse tab | Browse |
| 4 | Tap Search tab | Search |
| 5 | Tap Rate tab | Rating Flow (no pre-fill) |
| 6 | Tap Profile tab | Profile / My Ratings |
| 6 | Tap "Rate a [category]" (empty state) | Rating Flow (category context) |

---

## Design Notes

- **No sort toggle.** Always sorted by rating, highest first. Adding sort options is post-MVP.
- **No map view.** Ranked list only. Map exploration is a future feature.
- **Filter chips are filters, not navigation.** URL/route does not change (or if it does for shareability, same screen with query params).
- **Scroll position and active filters preserved** on return from Item Detail via back navigation.
