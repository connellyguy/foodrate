# Search

Uses the iOS 26 search role tab. On iOS 26, tapping the Search tab morphs it into a bottom search field — the other tabs collapse and the search input appears at the bottom of the screen natively. On Android, navigates to a standard search screen. The app provides the results content; the platform handles the search input chrome.

---

## Components

### Search Input

Handled by the native search role tab. Placeholder: "Search restaurants or dishes". The platform provides the input field, clear button, and cancel/dismiss behavior.

### Suggested Content (Before Typing)

Shown in the search results area when the search field is empty/focused:

| # | Element | Type | Details |
|---|---------|------|---------|
| 1 | Recent Searches | Vertical list | Last 5 searches, each row: clock icon + query text. Hidden entirely if no recent searches. Stored on-device only (FIFO, capped at 5). |
| 2 | Quick Categories | Horizontal scrollable chip row | One chip per MVP category. Tapping navigates directly to that Category Leaderboard (does not populate search field). Always visible. |

### Live Results (1+ Characters)

Results are live — no search button. Debounce at 200ms after last keystroke. Replaces suggested content with a results list:

**Section 1: Restaurants** (up to 5 results)

Each row:
- **Restaurant name** — bold primary text
- **Distance** — secondary text (e.g., "0.3 mi"). Omitted if location unavailable.
- **Top categories** — tertiary text, top 2–3 food categories with rated items here (e.g., "Wings, Burgers, BBQ")
- **Rating count** — small text (e.g., "24 rated items")

Hidden entirely if no restaurants match.

**Section 2: Dishes** (up to 5 results)

Each row:
- **Item name** — bold primary text
- **Restaurant name** — secondary text (e.g., "at Backyard BBQ Pit")
- **OakRate Score** — numeric (e.g., "87")
- **Rating count** — small text (e.g., "18 ratings")
- **Category tag** — small chip (e.g., "Wings")

Hidden entirely if no items match.

**No Results State** (both sections empty):
- Primary text: "No results for '[query]'"
- Secondary text: "Try a different spelling or search for a category"

Tapping a result immediately navigates away (pushed onto the Search nav stack).

### Tab Bar

| Element | Type | State |
|---------|------|-------|
| Browse tab | Fork.knife icon | Inactive. Switches to Browse tab. |
| Profile tab | Person icon | Inactive. Switches to Profile tab stack. |
| Rate tab | Plus icon, brand-colored | Inactive. Opens Rating Flow as full-screen modal. |
| Search tab | Magnifying glass icon (search role) | **Active**. On iOS 26, morphed into bottom search field. |

---

## Primary User Path

**Find a specific restaurant.**

1. Tap Search tab (morphs into search field on iOS 26).
2. Type first few characters of restaurant name.
3. Restaurant appears in results.
4. Tap restaurant row → Restaurant View opens (pushed onto Search nav stack).

---

## Alternate Paths

| Path | Steps | Destination |
|------|-------|-------------|
| Search for a dish | Type dish name → tap item row | Item Detail |
| Repeat a recent search | Tap a recent search entry → results appear → tap a result | Restaurant View or Item Detail |
| Browse by category | Tap a category chip | Category Leaderboard |
| Dismiss search | Tap cancel/dismiss (native behavior) | Returns to previous tab |

---

## Entry Points

| # | Source | Trigger |
|---|--------|---------|
| 1 | Tab bar | Tap Search tab (accessible from any screen) |
| 2 | Deep link | `oakrate.com/search?q=wings` — opens with query pre-filled (edge case, not primary MVP flow) |

---

## Exit Points

| # | Action | Destination | Recent Search saved? |
|---|--------|-------------|---------------------|
| 1 | Tap a restaurant result | Restaurant View | Yes |
| 2 | Tap an item result | Item Detail | Yes |
| 3 | Tap a category chip | Category Leaderboard | No |
| 4 | Dismiss search | Previous tab | No |
| 5 | Tap Browse tab | Browse | No |
| 6 | Tap Rate tab | Rating Flow | No |
| 7 | Tap Profile tab | Profile / My Ratings | No |

---

## Behavioral Notes

- **Ranking**: Results ranked by query relevance + proximity. Items secondarily sorted by rating count.
- **Location fallback**: If unavailable, distance omitted and results fall back to relevance-only ranking.
- **Minimum query**: 1 character triggers results.
