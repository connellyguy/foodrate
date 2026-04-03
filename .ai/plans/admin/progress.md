# OakRank Admin — Progress

## Phase A: Scaffold + Auth ✅

- [x] Vite + Vue 3 + TypeScript project at `admin/`
- [x] PrimeVue (Aura theme) + Vue Router setup
- [x] Supabase client with shared types (`@oakrank/db` alias)
- [x] `useAuth` composable (login, logout, admin role check)
- [x] `LoginView.vue` (email/password, not-authorized handling)
- [x] `AppLayout.vue` (sidebar nav + header + content slot)
- [x] Route guard (auth + admin role, awaits ready promise)
- [x] Placeholder views (Dashboard, Restaurants, Items, Ratings)
- [x] Type-check + build pass
- [ ] Verify: login works, layout renders, non-admin blocked

## Phase B: Restaurant CRUD

- [ ] `useRestaurants` composable (list, create, update, delete)
- [ ] `useCategories` composable (list for dropdowns)
- [ ] `useMarkets` composable (list for assignment)
- [ ] `lib/geocode.ts` (Nominatim wrapper)
- [ ] `RestaurantsView.vue` (DataTable + search + sort)
- [ ] `RestaurantForm.vue` (create/edit dialog with geocoding)
- [ ] `DeleteConfirm.vue` (cascading delete confirmation)

## Phase C: Item CRUD + Batch Entry

- [ ] `useItems` composable (list, create, batch create, update, delete)
- [ ] `ItemsView.vue` (DataTable, filterable by restaurant/category)
- [ ] `ItemForm.vue` (single item create/edit)
- [ ] `ItemBatchForm.vue` (rapid-fire + paste modes)

## Phase D: Rating Seed + Browse

- [ ] `useRatings` composable (list, create seed, delete)
- [ ] `RatingsView.vue` (DataTable with filters)
- [ ] `RatingForm.vue` (seed dialog with sentiment picker + tags)

## Phase E: Moderation

- [ ] Run moderation migration (`ratings.moderation_status`)
- [ ] Regenerate types
- [ ] `ModerationActions.vue` (status badge + bulk action bar)
- [ ] Update `RatingsView.vue` (checkboxes, status column, filter)
- [ ] Update `useRatings` (moderation status update)

## Phase F: Dashboard

- [ ] `useDashboard` composable (aggregate queries, gap detection)
- [ ] `DashboardView.vue` (stats cards, per-category table, needs-attention lists)
- [ ] `StatsCard.vue` (number + label card)

## Phase G: Deploy

- [ ] `vercel.json` SPA rewrite config
- [ ] Vercel project setup (admin/ subdirectory)
- [ ] Environment variables in Vercel
- [ ] `admin.oakrank.com` domain config
