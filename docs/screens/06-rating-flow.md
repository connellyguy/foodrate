# Rating Flow

Single scrollable screen with progressive disclosure. All sections visible at once — "progressive disclosure" works through visual weight, not visibility. Submit enables the moment restaurant + item + sentiment are set. Target: under 10 seconds for a returning user.

---

## Components (Top to Bottom)

### Top Bar

| Element | Type | Details |
|---------|------|---------|
| Close button (X) | Icon button, top-left | If any field touched: discard confirmation ("Discard this rating?"). If nothing touched: dismisses immediately. |
| Screen title | Static text | "Rate a Dish" |

### Restaurant Selector

| Element | Type | Details |
|---------|------|---------|
| Label | Static text | "Restaurant" |
| Input field | Text input with autocomplete | Placeholder: "Search restaurants near you…". On focus: dropdown of nearby restaurants sorted by distance. As user types: location-aware autocomplete. Each result row: restaurant name, street address, distance. |
| Selected state | Compact chip | Restaurant name + small X to clear. Clearing also resets the Item field. |
| Pre-filled state | Same chip display | When entering from Restaurant View or Item Detail. User can clear and change. |

### Item Selector

| Element | Type | Details |
|---------|------|---------|
| Label | Static text | "Dish" |
| Input field | Text input with autocomplete | **Disabled until restaurant is selected** (visually dimmed). Once set: placeholder "Search menu items…". Shows known menu items for that restaurant grouped by category. Each result: item name + category tag pill. |
| Selected state | Compact chip | Item name + category tag + small X to clear. Selecting loads that category's attribute tags below. |
| Pre-filled state | Same chip display | When entering from Item Detail. |
| "+ Add a new dish" | Row at bottom of dropdown | Always visible as last autocomplete row. |

#### Add-Item Sub-Form (inline, replaces dropdown)

| Element | Type | Details |
|---------|------|---------|
| Item name input | Text input | Placeholder: "Dish name (e.g., Smoked Half Chicken)". Free text. Required. |
| Category selector | Horizontal scrollable chips | All 20 categories. Single-select. Required. Loads attribute tags on selection. |
| Done button | Small text button | Validates name + category, collapses into standard chip. |
| Cancel link | Text button | Reverts to autocomplete input. |

New items are persisted to the database on submit and appear in autocomplete for future users.

### Sentiment Selector

| Element | Type | Details |
|---------|------|---------|
| Label | Static text | "How was it?" |
| Sentiment buttons | 4 buttons, horizontal row | Large tap targets (minimum 48pt height). Labels: "Hated it", "Didn't like it", "Liked it", "Loved it". Single-select — tap to select, tap again to deselect. Brief scale-up animation on selection. |
| Sentiment description | Subtle text below buttons | After selection: "Hated it: Nobody should order this", "Didn't like it: Wouldn't order again, but might suit your taste", "Liked it: I'd order again", "Loved it: I'd come back here for this dish". |

**Always visible and enabled**, even before restaurant/item are selected. Input order is not enforced.

### Attribute Tags (Optional)

| Element | Type | Details |
|---------|------|---------|
| Section header | Text | "What stood out?" with "(optional)" in secondary text |
| Tag chips | Wrap-layout, multi-select | Pre-defined tags for the item's category. Unselected: outlined. Selected: filled with brand color. |
| Empty state | Muted text | "Select a dish to see attributes." Tags appear immediately once item + category are known. |

Always visible. Visually secondary — smaller type, lighter color.

### Photo (Optional)

| Element | Type | Details |
|---------|------|---------|
| Add photo button | Icon + text | Camera icon + "Add Photo". Action sheet: Take Photo / Choose from Library / Cancel. |
| Photo preview | Thumbnail (80x80pt) + remove X | Shown after selection. One photo per rating in MVP. |
| Upload timing | | Photo uploaded on submit, not on selection (avoids orphaned uploads). |

### Submit Button

| Element | Type | Details |
|---------|------|---------|
| Submit button | Full-width primary button | "Submit Rating". **Disabled** until restaurant + item + sentiment all set. Attributes and photo never required. |
| Loading state | Spinner on button | Prevents double-submit. |
| Error state | Red banner above button | "Something went wrong. Tap to retry." Button re-enables. |

### Tab Bar

**Not visible.** The Rating Flow is a full-screen modal presented on top of the tab bar. The user exits via the X button or successful submission, returning to the screen that launched it.

### Duplicate Rating Guard

If the user has already rated this item at this restaurant, an inline warning appears after item selection: "You rated this dish '[Loved it]' on [date]. Submitting will replace your previous rating." Submit label changes to "Update Rating." Previous tags/photo are not pre-filled — user rates fresh.

---

## Primary User Path (10-Second Target)

| Step | Action | ~Time |
|------|--------|-------|
| 1 | Tap Rate tab | 0.5s |
| 2 | Type 2–3 chars, tap restaurant | 2–3s |
| 3 | Type 2–3 chars, tap item | 2–3s |
| 4 | Tap a sentiment | 0.5s |
| 5 | Tap Submit | 0.5s |

**Total: ~6–7 seconds.** If entering from Restaurant View or Item Detail with pre-fills, total drops to ~2–3 seconds.

---

## Alternate Paths

| Path | Details |
|------|---------|
| Add attribute tags | After sentiment, tap 1–4 chips. Adds 2–4 seconds. |
| Add a new item | Tap "+ Add a new dish" → type name → select category → Done. Adds 10–15 seconds. |
| Add a photo | Tap "Add Photo" → take/select photo → thumbnail appears. Adds 5–15 seconds. |

---

## Entry Points

| Source | Restaurant | Item | Sentiment |
|--------|-----------|------|-----------|
| Rate tab | Empty | Disabled | Empty |
| Restaurant View → "Rate something here" | Pre-filled | Empty (enabled, shows restaurant's items) | Empty |
| Item Detail → "Rate this item" | Pre-filled | Pre-filled (attribute tags populated) | Empty |
| Category Leaderboard → empty state CTA | Empty | Empty | Empty (category context only) |

For all pre-filled entries, fields display as chips. User can clear and change.

---

## Exit Points

| Action | Destination | Details |
|--------|-------------|---------|
| Successful submit | Previous screen | Brief success toast: "Rating submitted!" (2s, non-blocking). If entered via Rate tab (no previous screen), navigates to Item Detail for the rated item. |
| Cancel (clean) | Previous screen | No confirmation. |
| Cancel (dirty) | Discard dialog | "Discard this rating?" → Discard / Keep Editing. |
| System back | Same as cancel | Triggers clean/dirty logic. |
| Auth gate | Auth modal | If not signed in and taps Submit. Auth slides up. On success: returns to Rating Flow with all fields preserved. On dismiss: stays on Rating Flow. |

---

## Visual Hierarchy

All on a single scrollable view. Nothing hidden behind tabs or accordions.

1. **Restaurant + Item** — full prominence, large inputs. First things the eye hits.
2. **Sentiment selector** — large, centered, visually dominant. The core action.
3. **Attribute tags** — present but secondary. Smaller chips, lighter colors.
4. **Photo** — single compact button. Minimal visual footprint.
5. **Submit** — full-width, high-contrast, anchored at bottom. Always visible (even when disabled).

When restaurant and item are pre-filled and dropdowns are closed, all sections should fit on a single viewport without scrolling on a standard phone (375pt width, ~700pt usable height).

---

## Design Notes

- **No draft persistence in MVP.** If the app is killed, the rating is lost. Acceptable — the flow is fast enough to redo.
- **No edit-after-submit.** Users cannot edit ratings from this screen. They can re-rate (which replaces the previous rating) via the duplicate guard flow.
- **Input order is not enforced.** Users can tap a sentiment before selecting a restaurant. The submit button is the gate, not the field sequence.
