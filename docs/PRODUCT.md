# OakRank — Product Definition

**Domain:** oakrank.com
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
- **Category leaderboards.** Ranked lists per food category per city. "Top 10 Wings in Raleigh" as a living, data-driven list.
- **In-restaurant comparison.** UX designed for the "I'm looking at the menu right now" moment.

## MVP Scope

### What's In

**7 Seeded Food Categories at Launch:**

| # | Category | Key Attributes |
|---|----------|---------------|
| 1 | Pizza | crust, sauce, cheese, oven type |
| 2 | Wings | sauce, crispiness, size, bone-in vs boneless |
| 3 | Tacos | tortilla, meat, salsa, authenticity |
| 4 | Ramen | broth, noodle, chashu, egg |
| 5 | Sushi | freshness, rice, knife work, creativity |
| 6 | Ice Cream | creaminess, flavor creativity, portion, freshness |
| 7 | Barbecue | smoke, bark, sauce style, wood, tenderness |

These 7 categories get pre-seeded data, leaderboards, and browse-level visibility. Users can submit ratings for items outside these categories — those items live on the restaurant's page but don't get category leaderboards until data density justifies it.

**Core Features:**
- Rate an item: Restaurant > Item (autocomplete) > sentiment (4-bucket) > optional attribute tags > optional photo > done
- Browse a restaurant's rated items (ranked)
- Browse a category leaderboard ("Best Wings in Raleigh") — seeded categories only
- User profile with rating history

**Attribute Visibility (MVP):**
Attribute tags are still collected during the rating flow (user-selected, multi-select per category). However, attributes are **low-visibility in MVP**: they are stored on reviews, and high-confidence attributes can be displayed per-item (e.g., "frequently tagged: crispy"). Attribute-based leaderboard filters and search facets are deferred until data density supports them.

**No Empty States — Confidence-First UX:**
Never let users hit a dead end. If a restaurant has no ratings, redirect to high-confidence alternatives: nearby top dishes, category leaderboards, or related restaurants. Only surface restaurants and features where data is strong enough to be useful. The app should always have an answer — even if the answer is "here's what's great nearby instead."

**Data Seeding:**
- Admin page (owner-only) for cold-start data entry: add restaurants, menu items, and seed ratings
- Pre-seed restaurants in Raleigh covering all 7 categories
- Users can add new items and restaurants not yet in the system

### What's Out (for MVP)

- Social features (following, activity feeds)
- Gamification (badges, streaks, check-ins)
- Price/value tracking
- Restaurant owner dashboards or analytics
- Automated menu scraping at scale
- NLP review processing (attribute tags are user-selected, not extracted from text)
- Attribute-based search filters and leaderboard facets (deferred until data density supports them)
- Expansion beyond Raleigh
- Desktop web experience

## Visual Design Language

OakRank uses **native platform UI controls** and follows each platform's current design language. On iOS 26+, this means Apple's **Liquid Glass** — translucent, glass-like surfaces with dynamic blur, refraction, and tinting. On Android, standard Material Design.

The principle: **look native on every platform, not identical across platforms.** Use `NativeTabs` (Expo Router) for tab bars, native navigation headers, and system controls. These automatically adopt each platform's current look — liquid glass on iOS 26, Material on Android — with zero custom styling.

For OakRank's own content surfaces (cards, sheets, leaderboard rows), use `expo-glass-effect` `GlassView` on iOS 26+ for glass material where it fits. On Android and older iOS, `GlassView` falls back to a standard opaque `View` — this is correct behavior, not a gap to fill.

**No emoji in the UI.** All iconography uses **Lucide** (`lucide-react-native`), a tree-shakable SVG icon library with 1,500+ clean outline-style icons. Emoji render inconsistently across platforms and devices, look unprofessional at small sizes, and can't be styled (color, weight, size) to match the design system. Import only the icons you use — Lucide tree-shakes unused icons out of the bundle.

## Rating Model: 4-Bucket Sentiment

OakRank does not use star ratings. Stars cause grade inflation — everything clusters at 4-4.5 and the signal disappears. Instead, OakRank uses a 4-bucket sentiment model with a slight negative bias — bad food should be punished more than good food is rewarded.

| Bucket | Label | Weight | What it means |
|--------|-------|--------|---------------|
| 1 | Hated it | -3 | Nobody should order this |
| 2 | Didn't like it | -1 | I wouldn't order again, but it might suit your taste |
| 3 | Liked it | +1 | I'd order again, solid choice |
| 4 | Loved it | +2 | I'd come back specifically for this dish |

Each bucket carries a distinct, actionable signal. The even count forces a choice — no comfortable middle to hide in. The negative bias means one "Hated it" vote has 3x the impact of one "Liked it" — genuinely bad items sink fast, which protects the quality of recommendations.

### Internal Score

**OakRank Score (internal)** = weighted average of all ratings, yielding a signed value. Positive means net-positive sentiment, negative means net-negative. This signed score is stored internally and used for ranking.

### Score Stabilization

Raw averages are volatile with few votes. Three mechanisms control early-life instability:

**Neutral prior:** Every new item starts with a virtual prior of 2 "Liked" + 1 "Didn't like" votes baked into its average. This anchors new items near neutral (+0.33 internal) rather than letting a single rating dominate. The prior's influence fades naturally as real votes accumulate.

**Vote-count dampening:** Items with few ratings have their display scores scaled toward the midpoint. The fewer the votes, the more the displayed score is pulled toward center. This prevents a single "Loved it" from showing as a 10.0. The exact dampening curve is tuned during implementation, but the principle is: low-confidence scores should look modest, not extreme.

**Early burial protection:** For the first ~5–10 real votes, "Hated it" is treated as -2 instead of -3. This prevents a small number of negative votes from permanently burying a new item before it has a fair sample. Full -3 weight is restored once the item crosses the early-vote threshold.

### Ranking Threshold

Items must reach a minimum vote count (target: 10–20 real votes, tuned at launch) before appearing in category leaderboards. Below that threshold, items still appear on restaurant pages with their score but are excluded from ranked lists. This ensures leaderboards reflect real consensus, not noise.

### Display Formats

The internal signed score is converted to a **0–10 display scale** for users. Normalization: `displayScore = ((internalAvg + 3) / 5) * 10`, clamped to 0.0–10.0. Displayed with one decimal place.

- **Cards / leaderboards:** OakRank Score (e.g., "8.3") plus a secondary sentiment label (e.g., "92% would order again" — calculated as the percentage of Liked + Loved votes)
- **Item detail:** Score + full distribution — "72% Loved, 20% Liked, 5% Didn't like, 3% Hated"
- **Attribute tags** carry the nuance on top of the sentiment signal

## Core UX: The Rating Flow

The rating flow is the make-or-break interaction. Target: **complete a rating in under 10 seconds.**

```
1. Select restaurant (location-aware autocomplete)
2. Select or add item (filtered by category, autocomplete)
3. Tap one of 4 sentiment options (single tap)
4. [Optional] Tap attribute tags (pre-defined per category, multi-select)
5. [Optional] Add photo
6. Submit
```

No text review required. Text reviews add friction and most users won't write them. Structured attribute tags (crispy, saucy, spicy, generous portion, etc.) capture the signal that matters without the effort.

## Key Assumptions to Validate

1. **Will people rate individual items?** The entire product depends on this. If the rating flow is fast enough, they will — but this is assumption #1 to test.
2. **Is 7 seeded categories the right starting point?** Narrow enough for data density, broad enough that users find something relevant. Watch for bounce rates from users whose food isn't covered.
3. **Do attribute tags add enough signal?** If users skip them, we just have sentiment buckets (useful but not differentiated). If they use them, we can surface them per-item once confidence is high.
4. **Does the 4-bucket model produce meaningful spread?** If most ratings cluster in "Liked it," we lose the anti-inflation benefit. Watch the distribution curve closely at launch.
5. **Are the stabilization parameters right?** The neutral prior (2 liked + 1 disliked), dampening curve, early burial threshold (~5–10 votes), and ranking gate (10–20 votes) all need tuning against real data. Watch for: items stuck near neutral too long (prior too heavy), volatile scores (dampening too light), or leaderboards that feel stale (ranking gate too high).
6. **Does admin seeding create enough initial density?** The admin page must make it fast to bootstrap restaurants and items so the app never feels empty at launch.
7. **Does the confidence-first UX feel helpful or limiting?** Hiding low-data areas keeps quality high but might frustrate users looking for a specific restaurant. Watch for user complaints about missing restaurants.

## Future Considerations (Post-MVP)

These are not commitments. They're directions to explore once the core loop is validated.

- **Additional food categories:** Burgers, fried chicken, burritos, hot dogs, mac and cheese, donuts, fried chicken sandwich, steak, pho, sandwiches, curry, pasta, pastries. Add as leaderboard categories once user-submitted data shows sufficient density.
- **Attribute-based search & filters:** "Crispiest wings near me" — unlock when attribute data is dense enough to be reliable. This is a key differentiator but premature at launch.
- **Engagement & retention:** Gamification (badges, streaks, "Top Rater" status per category), social features (follow friends, see their ratings)
- **Data enrichment:** NLP extraction of attributes from optional text reviews, automated menu scraping, photo-based item recognition
- **Monetization:** Restaurant owner dashboards ("your fish tacos are 4.8, your beef tacos are 3.2 — here's what reviewers say about each"), promoted placement in category leaderboards
- **Expansion:** City-by-city rollout. Each new city needs local data seeding before launch.
- **Advanced search:** "Best value wings" (price-aware), "best wings within 10 minutes," dietary filters
