# OakRank — Core Screens (MVP)

7 screens + auth. Every screen maps to one of two core questions ("what should I order here?" / "where's the best [food] near me?") or to the rating action that feeds them.

## Screen Map

```
Home
├── Search → Restaurant View → Item Detail
├── Category Leaderboard → Item Detail
├── [Rate button] → Rating Flow
└── Profile (tab) → My Ratings → Item Detail
```

## Navigation

Bottom tab bar with 3 tabs: **Home**, **Rate** (center, prominent), **Profile**.

Search is a bar at the top of Home, not a separate tab.

---

## 1. Home / Explore

The entry point. Two clear paths presented immediately:

- **"I'm at a restaurant"** — location-aware restaurant search (autocomplete)
- **"I want [category]"** — grid/list of 20 food categories leading to leaderboards

Below the two entry paths: trending items or top-rated nearby as lightweight discovery. Not a feed — a launcher.

## 2. Search

Activated from the search bar on Home. Full-screen overlay with location-aware autocomplete.

- Searches both restaurants and items in a unified result list
- Results grouped: "Restaurants" section, "Items" section
- Recent searches shown before typing
- Tapping a restaurant → Restaurant View; tapping an item → Item Detail

## 3. Restaurant View

Shows a single restaurant's rated items, ranked by score.

- Restaurant name, address, distance
- List of rated items sorted by rating (highest first)
- Each item row: item name, category tag, star rating, number of ratings, top attribute tags (e.g., "crispy," "generous portion")
- Tapping an item → Item Detail
- "Rate something here" CTA if user hasn't rated at this restaurant

## 4. Category Leaderboard

"Best Wings in Raleigh" — a ranked list of items across all restaurants within one category.

- Category name as header (e.g., "Wings in Raleigh")
- Attribute filter chips at the top (e.g., "crispy," "bone-in," "extra spicy") — tapping filters the list
- Ranked list of items: rank number, item name, restaurant name, star rating, rating count, top attributes
- Tapping an item → Item Detail

## 5. Item Detail

The proof screen — shows *why* something is rated the way it is.

- Item name, restaurant name, category
- Aggregate star rating (large) + total rating count
- Attribute tag breakdown: horizontal bars showing percentage of raters who selected each tag (e.g., "Crispy — 82%", "Generous portion — 64%")
- Photo grid (user-submitted photos)
- Individual rating cards: user avatar, star rating, attribute tags they selected, photo if any, timestamp
- "Rate this item" CTA

## 6. Rating Flow

Single screen with progressive disclosure. Not a multi-step wizard.

1. **Restaurant** — pre-filled if coming from a Restaurant View, otherwise location-aware autocomplete
2. **Item** — autocomplete filtered by restaurant's known menu; option to add new item with category selection
3. **Star rating** — 1–5 stars, single tap
4. **Attribute tags** — pre-defined per category, multi-select chips (optional, but visible and easy)
5. **Photo** — camera/gallery button (optional)
6. **Submit button**

All steps visible on one scrollable screen. Completing steps 1–3 enables submit; steps 4–5 are visible but clearly optional. Target: under 10 seconds for steps 1–3.

## 7. Profile / My Ratings

- User's display name and avatar
- Total ratings count, category breakdown (e.g., "42 ratings — 12 wings, 8 burgers, …")
- Rating history: reverse-chronological list of the user's ratings
- Each row: item name, restaurant name, star rating, attribute tags, timestamp
- Tapping a rating → Item Detail
- Sign out and account management at the bottom

---

## Auth

Not a product screen — infrastructure. Uses Supabase Auth built-in flows.

- Apple Sign-In, Google Sign-In, email/password
- Users can browse without an account; sign-in prompted only when attempting to rate
- No onboarding walkthrough — the app should be self-evident
