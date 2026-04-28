# OakRate Admin — Progress

## Phase A: Scaffold + Auth ✅

- [x] Vite + Vue 3 + TypeScript project at `admin/`
- [x] PrimeVue (Aura theme) + Vue Router setup
- [x] Supabase client with shared types (`@oakrate/db` alias)
- [x] `useAuth` composable (login, logout, admin role check)
- [x] `LoginView.vue` (email/password, not-authorized handling)
- [x] `AppLayout.vue` (sidebar nav + header + content slot)
- [x] Route guard (auth + admin role, awaits ready promise)
- [x] Placeholder views (Dashboard, Restaurants, Items, Ratings)
- [x] Type-check + build pass
- [x] Verify: login works, layout renders, non-admin blocked

## Phase B: Restaurant CRUD ✅

- [x] `useRestaurants` composable (list, create, update, delete)
- [x] `useCategories` composable (list for dropdowns)
- [x] `useMarkets` composable (list for assignment)
- [x] `lib/geocode.ts` (Nominatim wrapper)
- [x] `RestaurantsView.vue` (DataTable + search + sort)
- [x] `RestaurantForm.vue` (create/edit dialog with geocoding, Raleigh market default)
- [x] `DeleteConfirm.vue` (cascading delete confirmation)
- [x] Toast setup (ToastService in main.ts, Toast in App.vue)

## Phase C: Item CRUD + Batch Entry ✅

- [x] `useItems` composable (list, create, batch create, update, delete)
- [x] `ItemsView.vue` (DataTable, filterable by restaurant/category)
- [x] `ItemForm.vue` (single item create/edit)
- [x] `ItemBatchForm.vue` (rapid-fire + paste modes)
- [x] `lib/formatDate.ts` (shared utility extracted from duplicated code)

## Phase D: Rating Seed + Browse ✅

- [x] `useRatings` composable (list with joins, create seed with attribute tags, delete)
- [x] `RatingsView.vue` (DataTable with restaurant/item filters, sentiment Tag badges)
- [x] `RatingForm.vue` (seed dialog with item selector, sentiment picker, attribute tag multi-select)

## Phase E: Category Management ✅

- [x] Extend `useCategories` composable (create, update, fetchWithCounts)
- [x] `CategoriesView.vue` (DataTable with name, slug, featured tag, sort order, item count)
- [x] `CategoryForm.vue` (create/edit dialog: name, auto-slug, featured toggle)
- [x] Route `/categories` + sidebar nav link

## Phase F: Moderation ✅

- [x] Run moderation migration (`ratings.moderation_status`, trigger update, admin RLS)
- [x] Regenerate types
- [x] `ModerationActions.vue` (clickable status Tag cycling, bulk action bar with Set Active/Hidden/Uncounted)
- [x] Update `RatingsView.vue` (checkbox selection, status column, moderation status filter, bulk actions)
- [x] Update `useRatings` (updateModerationStatus, bulkUpdateModerationStatus, MODERATION_STATUSES constant)

## Phase G: Dashboard ✅

- [x] `useDashboard` composable (7 parallel queries: total counts, category breakdown, needs-attention lists)
- [x] `DashboardView.vue` (stats cards, per-category table, restaurants with no items, items with few ratings)
- [x] `StatsCard.vue` (number + label + optional icon card)

## Phase H: Deploy ✅

- [x] `vercel.json` SPA rewrite config
- [x] Vercel project setup (admin/ subdirectory)
- [x] Environment variables in Vercel
- [x] `admin.oakrate.com` domain config
