# Restaurant View

The "what should I order?" screen. Shows every rated dish at a single restaurant, ranked by score, so a user at the table can scan and decide in seconds.

---

## Components (Top to Bottom)

### Navigation Bar

| Element | Type | Details |
|---------|------|---------|
| Back arrow | Icon button | Returns to previous screen |
| Screen title | Text (truncated if long) | Restaurant name |
| Share button | Icon button | Native share sheet with deep link |

### Restaurant Header

| Element | Type | Details |
|---------|------|---------|
| Restaurant name | H1 text | Full name |
| Address line | Body text, tappable | Street address, city. Tapping opens native maps app. |
| Distance badge | Pill | e.g., "0.3 mi". Only shown with location permission. |
| Total rated items | Caption text | e.g., "14 items rated" |

### Rate CTA (Contextual)

| Condition | Element | Details |
|-----------|---------|---------|
| User has 0 ratings here | "Rate something here" | Primary button (filled, full-width). Navigates to Rating Flow with restaurant pre-filled. |
| User has 1+ ratings here | "Rate another item" | Secondary button (outlined, full-width). Same destination. |

Auth prompt triggers on the Rating Flow screen if not signed in — the CTA is always visible.

### Rated Items List

Sorted by OakRank Score (highest first). Ties broken by rating count (more ratings wins).

Each row (full row is tappable → Item Detail):

| Element | Type | Details |
|---------|------|---------|
| Item name | Bold body text | e.g., "Carolina Reaper Wings" |
| Category tag | Small pill | e.g., "Wings" |
| OakRank Score | Numeric | Aggregate score (e.g., "87") |
| Rating count | Caption | e.g., "(27)" — inline next to score |
| Top attribute tags | Small chips, max 3 | Top 3 by selection frequency. Remainder visible on Item Detail. |
| User's own rating indicator | Subtle icon/text | If the current user has rated this item, show a small checkmark or "You: Loved it". Helps recall what they've tried. |

Full list rendered — no pagination at Raleigh scale.

### Tab Bar

| Element | Type | State |
|---------|------|-------|
| Browse tab | Fork.knife icon | **Active** if navigated from Browse stack. |
| Profile tab | Person icon | Inactive. Switches to Profile tab stack. |
| Rate tab | Plus icon, brand-colored | Opens Rating Flow modal (no pre-fill — fresh entry, not contextual). |
| Search tab | Magnifying glass icon (search role) | **Active** if navigated from Search stack. |

Active tab reflects which stack the user navigated from.

### Empty State (No Rated Items)

| Element | Type | Details |
|---------|------|---------|
| Illustration | Static graphic | Empty plate or similar |
| Headline | H2 text | "No ratings yet" |
| Subtext | Body text | "Be the first to rate a dish here." |
| CTA button | Primary button | "Rate something" → Rating Flow with restaurant pre-filled |

---

## Primary User Path

**Decide what to order.**

1. Arrive at Restaurant View (most likely from Search while at the restaurant).
2. Scan the ranked item list top to bottom.
3. Tap a promising item row.
4. Land on Item Detail to see attribute breakdown, photos, individual ratings.
5. Decide whether to order it.

Read-only, high-speed. No auth required. Should load and be scannable in under 2 seconds.

---

## Alternate Paths

| Action | Destination |
|--------|-------------|
| Tap "Rate something here" / "Rate another item" | Rating Flow (restaurant pre-filled) |
| Tap any item row | Item Detail |
| Tap address line | Native maps app |
| Tap share icon | Native share sheet |
| Tap back arrow / swipe back | Previous screen |

---

## Entry Points

| Source | Trigger | Notes |
|--------|---------|-------|
| Search | Tap a restaurant result | Primary entry |
| Home / Explore | Tap a restaurant in "Top rated nearby" | |
| Item Detail | Tap the restaurant name link | |
| Profile / My Ratings | Tap the restaurant name on a rating | |
| Deep link | Shared link to a restaurant | May require loading restaurant data on cold start |

---

## Exit Points

| Action | Destination |
|--------|-------------|
| Tap back / swipe back | Previous screen (nav stack) |
| Tap an item row | Item Detail |
| Tap rate CTA | Rating Flow (restaurant pre-filled) |
| Tap address line | Native maps (leaves OakRank) |
| Tap share icon | Share sheet overlay (stays on screen) |
| Tap Browse tab | Browse |
| Tap Search tab | Search |
| Tap Rate tab | Rating Flow (no pre-fill — fresh entry via button) |
| Tap Profile tab | Profile / My Ratings |
