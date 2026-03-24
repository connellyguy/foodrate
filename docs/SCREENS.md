# OakRank — Core Screens (MVP)

7 screens + auth. Every screen maps to one of two core questions ("what should I order here?" / "where's the best [food] near me?") or to the rating action that feeds them.

## Screen Map

```
Browse (tab, default) → Category Leaderboard → Item Detail
                       → Top Rated → Item Detail
Search (tab, search role) → Restaurant View → Item Detail
                          → Item Detail
Rate (tab) → Rating Flow (modal)
Profile (tab) → My Ratings → Item Detail
```

## Navigation

Native platform tab bar via Expo Router `NativeTabs` (`UITabBarController` on iOS, Material bottom navigation on Android). On iOS 26+, the tab bar renders with Apple's Liquid Glass treatment automatically. 4 tabs:

1. **Browse** (fork.knife icon) — the default/home tab
2. **Profile** (person icon) — user profile and rating history
3. **Rate** (plus icon, brand-colored) — opens the Rating Flow as a full-screen modal. Auth gate if not signed in.
4. **Search** (magnifying glass icon, search role) — on iOS 26, renders as a separated circle that morphs into a bottom search field when tapped. On Android, navigates to the Search screen.

---

## Detailed Screen Specs

Full component lists, entry/exit points, user paths, and edge cases for each screen:

1. [Browse](screens/01-home-explore.md)
2. [Search](screens/02-search.md)
3. [Restaurant View](screens/03-restaurant-view.md)
4. [Category Leaderboard](screens/04-category-leaderboard.md)
5. [Item Detail](screens/05-item-detail.md)
6. [Rating Flow](screens/06-rating-flow.md)
7. [Profile / My Ratings](screens/07-profile.md)

---

## Auth

Not a product screen — infrastructure. Uses Supabase Auth built-in flows.

- Apple Sign-In, Google Sign-In, email/password
- Users can browse without an account; sign-in prompted only when attempting to rate
- No onboarding walkthrough — the app should be self-evident
