# OakRank — Product Definition

**Domain:** oakrank.app
**MVP Market:** Raleigh, NC
**Platform:** Native app (primary), mobile web (secondary)

## Vision

OakRank is an item-level food rating app. Not restaurants — individual dishes. It answers two questions:

1. **"I'm at this restaurant — what should I order?"** Compare rated items on the menu before committing.
2. **"I want wings — where are the best ones near me?"** Search by food category across all restaurants, filtered by attributes like "crispy" or "extra spicy."

Traditional review platforms (Yelp, Google) rate restaurants. OakRank rates what's actually on your plate.

## Target Users

### The Habitual
Always orders the same type of food (wings, tacos, burgers). Wants to know who makes the best version nearby and what specifically makes it the best. Cares about attributes — "crispiest wings," "best dry rub," "biggest portion."

### The Explorer
Trying somewhere new and wants to order smart. Uses OakRank at the table to compare items on the menu before deciding. Values crowd wisdom over guessing.

Both users need the rating flow to be fast (under 10 seconds) and the data to be trustworthy.

## Competitive Positioning

No existing platform solves this problem well. The landscape rates restaurants, not food.

| Platform | Gap |
|----------|-----|
| Yelp / Google | Restaurant-level only |
| TikTok / Reddit | Unstructured, unsearchable |
| Beli | Personal restaurant ranking, no item-level data |
| The Infatuation | Editorial, not comprehensive |

**OakRank's edge:**
- **City-deep, not country-wide.** Own Raleigh completely before expanding. Dense local data beats sparse national data.
- **Attribute-level search.** "Crispiest wings near me" — not just "best wings."
- **Category leaderboards.** Ranked lists per food category per city. "Top 10 Burgers in Raleigh" as a living, data-driven list.
- **In-restaurant comparison.** UX designed for the "I'm looking at the menu right now" moment.

## MVP Scope

### What's In

**20 Food Categories at Launch:**

| # | Category | Key Attributes |
|---|----------|---------------|
| 1 | Pizza | crust, sauce, cheese, oven type |
| 2 | Burgers | patty style, bun, cheese, cook temp |
| 3 | BBQ | smoke, bark, sauce style, wood, tenderness |
| 4 | Wings | sauce, crispiness, size, bone-in vs boneless |
| 5 | Fried Chicken | crispiness, juiciness, seasoning, spice |
| 6 | Tacos | tortilla, meat, salsa, authenticity |
| 7 | Breakfast Biscuits | flakiness, butter, fillings, scratch-made |
| 8 | Mac and Cheese | cheese blend, creaminess, crust, add-ins |
| 9 | Pulled Pork Sandwich | smoke, slaw, sauce, bun |
| 10 | Shrimp and Grits | grits quality, shrimp, sauce, sausage |
| 11 | Fried Chicken Sandwich | crunch, pickle, bun, spice |
| 12 | Ramen | broth, noodle, chashu, egg |
| 13 | Donuts | dough type, glaze, creativity, freshness |
| 14 | Sushi | freshness, rice, knife work, creativity |
| 15 | Margaritas | fresh vs mix, tequila, frozen vs rocks, balance |
| 16 | Bagels | chewiness, crust, boil method |
| 17 | Hot Dogs | casing snap, toppings, char |
| 18 | Burritos | tortilla, meat, balance, structural integrity |
| 19 | Nashville Hot Chicken | heat level, crust, juiciness |
| 20 | Steak | cut, cook temp, sear, aging |

**Core Features:**
- Rate an item: Restaurant > Item (autocomplete) > 1-5 stars > optional attribute tags > optional photo > done
- Browse a restaurant's rated items (ranked)
- Browse a category leaderboard ("Best Wings in Raleigh")
- Filter by attribute within a category ("crispiest wings")
- User profile with rating history

**Data Seeding:**
- Manually seed menus from ~100 Raleigh restaurants covering all 20 categories
- Users can add new items not yet in the system

### What's Out (for MVP)

- Social features (following, activity feeds)
- Gamification (badges, streaks, check-ins)
- Price/value tracking
- Restaurant owner dashboards or analytics
- Automated menu scraping at scale
- NLP review processing (attribute tags are user-selected, not extracted from text)
- Expansion beyond Raleigh
- Desktop web experience

## Core UX: The Rating Flow

The rating flow is the make-or-break interaction. Target: **complete a rating in under 10 seconds.**

```
1. Select restaurant (location-aware autocomplete)
2. Select or add item (filtered by category, autocomplete)
3. Rate 1-5 stars (single tap)
4. [Optional] Tap attribute tags (pre-defined per category, multi-select)
5. [Optional] Add photo
6. Submit
```

No text review required. Text reviews add friction and most users won't write them. Structured attribute tags (crispy, saucy, spicy, generous portion, etc.) capture the signal that matters without the effort.

## Key Assumptions to Validate

1. **Will people rate individual items?** The entire product depends on this. If the rating flow is fast enough, they will — but this is assumption #1 to test.
2. **Is 20 categories enough breadth?** Too few and users bounce ("my food isn't here"). Too many and data is sparse. 20 is the hypothesis.
3. **Do attribute tags add enough signal?** If users skip them, we just have star ratings (commodity). If they use them, we have differentiated data.
4. **Can we seed enough menu data manually?** 100 restaurants x 20 categories = up to 2,000 items. This needs to feel comprehensive enough that users find their restaurant and item without adding it themselves.

## Future Considerations (Post-MVP)

These are not commitments. They're directions to explore once the core loop is validated.

- **Engagement & retention:** Gamification (badges, streaks, "Top Rater" status per category), social features (follow friends, see their ratings)
- **Data enrichment:** NLP extraction of attributes from optional text reviews, automated menu scraping, photo-based item recognition
- **Monetization:** Restaurant owner dashboards ("your fish tacos are 4.8, your beef tacos are 3.2 — here's what reviewers say about each"), promoted placement in category leaderboards
- **Expansion:** City-by-city rollout. Each new city needs local data seeding before launch.
- **Advanced search:** "Best value wings" (price-aware), "best wings within 10 minutes," dietary filters
