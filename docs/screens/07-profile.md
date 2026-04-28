# Profile / My Ratings

The user's rating history. Not a social profile — just "here's what I've rated." Serves two purposes: revisit past ratings and build a sense of contribution.

---

## Components (Top to Bottom)

### Navigation Header

| Element | Type | Details |
|---------|------|---------|
| Screen title | Static text | "Profile" |
| Settings gear | Icon button (top-right) | Opens settings sheet (account management — shortcut to avoid scrolling to bottom) |

### User Identity Block

| Element | Type | Details |
|---------|------|---------|
| Avatar | Circular image (64pt) | From auth provider (Apple/Google) or initial-based placeholder. Not editable in MVP. |
| Display name | Bold text | From Supabase Auth profile. |
| Member since | Secondary text | "Joined [Month Year]" |

### Stats Summary Bar

Compact horizontal row of key numbers.

| Element | Details |
|---------|---------|
| Total ratings | e.g., "42 Ratings". Tappable → scrolls to rating history list. |
| Restaurants rated | e.g., "18 Restaurants". Display only. |
| Top category | e.g., "Wings (12)". Tappable → filters rating history to that category. |

### Category Breakdown

| Element | Type | Details |
|---------|------|---------|
| Section header | Text | "By Category" |
| Category chips | Horizontal scrollable row | One chip per category the user has rated in. Each: category name + count (e.g., "Burgers 8"). Sorted by count descending. |
| Chip behavior | Filter toggle | Tap to filter rating history to that category. Tap active chip to clear filter. Single-select. |

### Rating History List

Reverse-chronological list of every rating.

| Element | Type | Details |
|---------|------|---------|
| Section header | Text + sort control | "My Ratings" with segmented control: Recent (default) / Highest |
| Rating row (repeated, tappable → Item Detail) | List item | Item name (bold), restaurant name (secondary), sentiment label (e.g., "Loved it"), attribute tag chips (max 3 visible, "+N" overflow), photo thumbnail (40pt, only if photo exists), timestamp (relative <7 days, absolute after). |
| Empty state | Illustration + CTA | "You haven't rated anything yet." Primary button: "Rate something" → Rating Flow. |
| Pagination | Infinite scroll | 20 ratings initially, next page on scroll. |

### Tab Bar

| Element | Type | State |
|---------|------|-------|
| Browse tab | Fork.knife icon | Inactive. Switches to Browse tab stack. |
| Profile tab | Person icon | **Active** |
| Rate tab | Plus icon, brand-colored | Opens Rating Flow as full-screen modal. |
| Search tab | Magnifying glass icon (search role) | Inactive. Switches to Search tab. |

### Account Management

Below rating history. Only visible on scroll to bottom. Low prominence.

| Element | Type | Details |
|---------|------|---------|
| Edit display name | Row + chevron | Shows current name. Taps to inline edit or modal with text input + save/cancel. |
| Sign out | Row (red text) | Confirmation dialog: "Sign out of OakRate?" → Cancel / Sign Out. Clears session, returns to Home (logged out). |
| Delete account | Row (red text) | Two-step confirmation: first explains permanent deletion, second requires typing "DELETE". Returns to Home. |

---

## Primary User Path

**Review past ratings → revisit an item.**

1. Tap Profile tab.
2. Scan rating history list.
3. Tap a rating row → Item Detail.

The rating history list must load fast. Each row needs enough info (item name, restaurant, sentiment, tags) to identify what the user is looking for without tapping into every one.

---

## Alternate Paths

| # | Action | Destination |
|---|--------|-------------|
| 1 | Filter by category | Tap a category chip → rating history filters in place |
| 2 | Clear filter | Tap active chip → unfiltered |
| 3 | Sort by highest | Tap "Highest" toggle → re-sorts by sentiment descending (Loved → Hated) |
| 4 | Sort by recent | Tap "Recent" toggle → reverse-chronological |
| 5 | Rate something (empty state) | Tap CTA → Rating Flow (modal) |
| 6 | Edit display name | Tap row → inline edit or modal |
| 7 | Sign out | Tap → confirm → Home (logged out) |
| 8 | Delete account | Tap → confirm twice → Home (logged out) |
| 9 | Open settings | Tap gear → settings sheet |

---

## Entry Points

| # | Source | Trigger | State |
|---|--------|---------|-------|
| 1 | Tab bar | Tap "Profile" tab from any screen | Default: no filters, sorted by recent. |
| 2 | Deep link | oakrate.com/profile | Same as above. Sign-in prompt if not authenticated. |
| 3 | Post-rating | "View your ratings" link on success state | New rating visible at top of list. |

No entry from other users' profiles or social features (none in MVP).

---

## Exit Points

| # | Action | Destination |
|---|--------|-------------|
| 1 | Tap a rating row | Item Detail (push) |
| 2 | Tap "Rate something" CTA | Rating Flow (modal) |
| 3 | Tap Browse tab | Browse |
| 4 | Tap Search tab | Search |
| 5 | Tap Rate tab | Rating Flow |
| 6 | Sign out | Browse (logged out, nav stack cleared) |
| 7 | Delete account | Browse (logged out, nav stack cleared) |

---

## Edge Cases

| State | Behavior |
|-------|----------|
| Logged out | Profile tab shows sign-in prompt (Apple/Google/email), not this screen. |
| New user (0 ratings) | Empty state with prominent "Rate something" CTA. |
| Deleted item/restaurant | Rating still appears with name intact but row is not tappable. Subtle "No longer available" label. |
| Tab switch + return | Scroll position, active filter, and sort selection preserved. |
| Pull to refresh | Supported. Refreshes data from Supabase. |
