# Item Detail

The proof screen. Shows *why* something is rated the way it is. Every element builds or interrogates trust in the aggregate score.

---

## Components (Top to Bottom)

### Navigation Bar

| Element | Type | Details |
|---------|------|---------|
| Back chevron | Icon button | Returns to previous screen |
| Share button | Icon button (right) | Native share sheet with deep link |

### Hero Section

| Element | Type | Details |
|---------|------|---------|
| Item name | Large bold title | e.g., "Dry Rub Wings" |
| Restaurant name | Secondary text, tappable | Navigates to Restaurant View |
| Category pill | Small chip, tappable | Navigates to that Category Leaderboard |
| Distance label | Tertiary text | e.g., "2.3 mi". Omitted if location unavailable. |

### Aggregate Rating Block

| Element | Type | Details |
|---------|------|---------|
| OakRate Score | Large numeric display | Score on a 0–100 scale (e.g., "87"). Visual anchor of the screen. |
| Sentiment distribution | 4 horizontal bars | Loved → Hated, each bar proportional to rating count at that level. Labels + percentages (e.g., "Loved it — 72%"). |
| Total rating count | Text label | e.g., "128 ratings" |
| "Rate this item" CTA | Primary button | Navigates to Rating Flow with restaurant + item pre-filled. Changes to "Update your rating" if user already rated. |

### Attribute Tag Breakdown

| Element | Type | Details |
|---------|------|---------|
| Section header | Text | "What people notice" |
| Attribute bars | Horizontal bar list | One row per attribute tagged by at least one rater. Each row: tag label, fill bar, percentage (e.g., "Crispy — 82%"). Sorted descending by percentage. |
| Empty state | Muted text | "No attribute data yet — be the first to add tags when you rate." |

This is the differentiator. Sits directly under the aggregate rating, above photos. Visually prominent — not buried below the fold.

### Photo Grid

| Element | Type | Details |
|---------|------|---------|
| Section header | Text + count | "Photos (14)" |
| Grid | 2-column thumbnails | First 4–6 user-submitted photos |
| "See all" link | Text link | Appears if more photos than shown. Opens full-screen scrollable gallery. |
| Thumbnail tap | Interaction | Opens full-screen lightbox with swipe navigation. Each photo shows submitter's display name + timestamp. |
| Empty state | Text + CTA | "No photos yet" with camera icon. "Add a photo with your rating" → Rating Flow. |

### Individual Rating Cards

| Element | Type | Details |
|---------|------|---------|
| Section header | Text + sort control | "Ratings" with toggle: Most Recent (default) / Highest / Lowest |
| Rating card (repeated) | List item | User avatar (small circle, default silhouette), display name (not tappable — no social in MVP), sentiment label (e.g., "Loved it"), attribute tag chips (if any), photo thumbnail (if any, tappable → lightbox), timestamp (relative if <30 days, absolute otherwise). |
| Pagination | Infinite scroll | 10 cards initially, more on scroll. |

### Tab Bar

| Element | Type | State |
|---------|------|-------|
| Browse tab | Fork.knife icon | **Active** if navigated from Browse stack (Leaderboard or trending cards). |
| Profile tab | Person icon | **Active** if navigated from Profile → My Ratings. |
| Rate tab | Plus icon, brand-colored | Opens Rating Flow modal (no pre-fill — fresh entry, not contextual). |
| Search tab | Magnifying glass icon (search role) | **Active** if navigated from Search stack. |

The active tab reflects which stack the user is in. Only one is active at a time.

---

## Primary User Path

**Evaluate the item, then go back to compare.**

1. Arrive from Restaurant View, Leaderboard, or Search.
2. Read aggregate score + rating count — instant trust signal.
3. Scan attribute breakdown — understand *what* makes it good or bad.
4. Glance at photos — visual confirmation.
5. Optionally scroll rating cards for detail.
6. Tap back to return to the list and compare other items.

Read-only, judgment-forming. Most users will not rate from here — they rate after eating, not before.

---

## Alternate Paths

| # | Action | Destination |
|---|--------|-------------|
| 1 | Tap "Rate this item" (either CTA) | Rating Flow (restaurant + item pre-filled) |
| 2 | Tap "Update your rating" | Rating Flow (pre-filled, user can modify and resubmit) |
| 3 | Tap restaurant name | Restaurant View |
| 4 | Tap category pill | Category Leaderboard |
| 5 | Tap photo thumbnail | Full-screen lightbox |
| 6 | Tap "See all" photos | Full-screen photo gallery |
| 7 | Tap share button | Native share sheet |
| 8 | Change sort order | Re-sorts rating cards in place |
| 9 | Tap "Add a photo with your rating" (empty photo state) | Rating Flow (restaurant + item pre-filled) |

---

## Entry Points

| # | Source | Trigger |
|---|--------|---------|
| 1 | Restaurant View | Tap any item row |
| 2 | Category Leaderboard | Tap any item row |
| 3 | Search | Tap an item in search results |
| 4 | Profile / My Ratings | Tap any rating row |
| 5 | Deep link | Shared OakRate item link |
| 6 | Home / Explore | Tap a trending/top-rated item card |

---

## Exit Points

| # | Action | Destination |
|---|--------|-------------|
| 1 | Tap back / swipe back | Previous screen (nav stack) |
| 2 | Tap "Rate this item" / "Update your rating" | Rating Flow |
| 3 | Tap restaurant name | Restaurant View (push) |
| 4 | Tap category pill | Category Leaderboard (push) |
| 5 | Tap Browse tab | Browse |
| 6 | Tap Search tab | Search |
| 7 | Tap Rate tab | Rating Flow (no pre-fill) |
| 8 | Tap Profile tab | Profile / My Ratings |
| 8 | Tap share button | Share sheet overlay (stays on screen) |

---

## Design Notes

- **No text reviews.** Attribute tags replace unstructured text. No "write a review" field.
- **User display names are not tappable.** No profile navigation for other users in MVP.
- **The attribute breakdown is the differentiator.** It's what no other platform shows. Visually prominent, not buried.
