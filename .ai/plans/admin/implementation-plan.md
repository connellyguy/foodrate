# OakRate Admin — Implementation Plan

## Architecture Decisions

### Monorepo subdirectory, not separate repo

The admin app lives at `admin/` within the existing OakRate repo. Reasons:

- **Shared types** — `database.types.ts` is generated once by `npm run gen-types` in the root. The admin app imports it via a tsconfig path alias (`@oakrate/types` → `../src/lib/database.types`). No package publishing, no git submodules, no sync issues.
- **Shared migrations** — `supabase/` stays in one place. The moderation migration lands alongside the existing ones.
- **Single Vercel project** — Vercel monorepo support deploys `admin/` as its own project, separate from the Expo web export. Each has its own `vercel.json`.
- **Simpler DX** — one repo to clone, one place to run gen-types, one PR for schema + admin changes.

The admin app has its own `package.json`, `node_modules`, `vite.config.ts`, and `tsconfig.json`. It is a fully independent Vite project that happens to share types with the parent.

### PrimeVue for UI components

[PrimeVue](https://primevue.org/) is the right pick for admin tooling. It has the strongest DataTable in the Vue ecosystem — built-in sorting, filtering, pagination, row selection, and inline editing. 90+ components, 480K weekly npm downloads, TypeScript-first, treeshakable.

This is internal tooling, not a design showcase. PrimeVue's default Aura theme looks clean without customization. No Tailwind, no custom CSS system — just PrimeVue components and their built-in styling.

Alternatives considered:
- **Element Plus** — solid but PrimeVue's DataTable is more feature-complete (column filtering, row expansion, lazy loading)
- **Naive UI** — good TypeScript support but smaller ecosystem, less battle-tested tables
- **Headless UI / custom** — too much work for an internal tool

### No state management library

Each view fetches data directly from Supabase via composables (`useRestaurants`, `useItems`, `useRatings`). Vue's `ref`/`reactive` handle local state. No Pinia, no Vuex.

If data caching or cross-view invalidation becomes painful, add `@tanstack/vue-query`. But for a single-user admin tool, direct Supabase calls with `ref` are simpler and sufficient.

### Client-side geocoding via Nominatim

Address → lat/lng conversion happens client-side via the [Nominatim API](https://nominatim.org/release-docs/develop/api/Search/). Free, no API key, no storage restrictions under ODbL. Rate limit is 1 request/second — fine for manual entry. The admin app calls Nominatim on restaurant create/edit when the address changes.

---

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Vue 3 (Composition API) | `<script setup>` SFCs |
| Build | Vite | Fast dev server, standard Vue tooling |
| Language | TypeScript | Strict mode, shared types from Supabase |
| UI library | PrimeVue (Aura theme) | DataTable, forms, dialogs, toasts |
| Routing | Vue Router 4 | 5 routes: login, dashboard, restaurants, items, ratings |
| Backend | Supabase (shared) | Same project as the native app |
| Auth | Supabase Auth (email) | Same credentials, RLS enforced |
| Geocoding | Nominatim (OSM) | Client-side, free, no API key |
| Hosting | Vercel | Deployed from `admin/` subdirectory |
| Icons | PrimeIcons | Bundled with PrimeVue — no extra dependency |

---

## Project Structure

```
admin/
  src/
    App.vue                    # Root component, layout shell
    main.ts                    # App entry, PrimeVue + router setup
    router.ts                  # Vue Router config
    lib/
      supabase.ts              # Supabase client init (same project, env vars)
      geocode.ts               # Nominatim API wrapper
    composables/
      useAuth.ts               # Login, logout, admin role check
      useRestaurants.ts        # Restaurant CRUD operations
      useItems.ts              # Item CRUD + batch operations
      useRatings.ts            # Rating CRUD + moderation
      useDashboard.ts          # Aggregate stats for overview
      useCategories.ts         # Category list (for dropdowns)
      useMarkets.ts            # Market list (for assignment)
    views/
      LoginView.vue            # Email login form
      DashboardView.vue        # Seeding health overview
      RestaurantsView.vue      # Restaurant list + CRUD
      ItemsView.vue            # Item list + rapid-fire + batch
      RatingsView.vue          # Rating list + moderation
    components/
      AppLayout.vue            # Sidebar nav + header + content slot
      RestaurantForm.vue       # Create/edit restaurant dialog
      ItemForm.vue             # Single item create/edit dialog
      ItemBatchForm.vue        # Rapid-fire + paste batch entry
      RatingForm.vue           # Seed rating dialog
      ModerationActions.vue    # Status toggle + bulk moderation bar
      DeleteConfirm.vue        # Cascading delete confirmation dialog
      StatsCard.vue            # Dashboard summary card
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  vercel.json
  .env.local                   # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

---

## Schema Migration (prerequisite)

Before moderation features work, run this migration:

```sql
-- ratings.moderation_status
alter table public.ratings
  add column moderation_status text not null default 'active'
  constraint ratings_moderation_status_check
    check (moderation_status in ('active', 'hidden', 'uncounted'));

create index idx_ratings_moderation on public.ratings(moderation_status);

-- Update trigger: exclude uncounted ratings from score
create or replace function public.update_item_rating_stats()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  target_item_id uuid;
begin
  target_item_id := coalesce(new.item_id, old.item_id);

  update public.items
  set
    oakrate_score = coalesce((
      select round(avg(
        case sentiment
          when  2 then   2
          when  1 then   1
          when -1 then  -1
          when -2 then  -3
        end
      )::numeric, 2)
      from public.ratings
      where item_id = target_item_id
        and moderation_status in ('active', 'hidden')
    ), 0),
    rating_count = (
      select count(*)
      from public.ratings
      where item_id = target_item_id
        and moderation_status in ('active', 'hidden')
    ),
    updated_at = now()
  where id = target_item_id;

  return null;
end;
$$;

-- RLS: admin can update moderation_status
-- (already covered by "Admins can update ratings" if we add that policy)
-- Note: existing RLS only lets users update their own ratings.
-- Admin needs update access to any rating for moderation.
create policy "Admins can update any rating"
  on public.ratings for update using (public.is_admin());
```

Run `npm run gen-types` after migration to pick up `moderation_status`.

---

## Type Sharing

The generated `src/lib/database.types.ts` is the source of truth. The admin app references it via tsconfig path alias:

```jsonc
// admin/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@oakrate/db": ["../src/lib/database.types"]
    }
  }
}
```

```ts
// admin/src/lib/supabase.ts
import type { Database } from '@oakrate/db'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

The Vite config needs a matching resolve alias so the import works at build time:

```ts
// admin/vite.config.ts
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@oakrate/db': resolve(__dirname, '../src/lib/database.types'),
      '@': resolve(__dirname, 'src'),
    }
  }
})
```

---

## Build Order

Each phase is usable independently — you can start seeding after Phase 2 without waiting for moderation.

### Phase A: Scaffold + Auth (gate: must complete first)

1. `npm create vite@latest admin -- --template vue-ts`
2. Install dependencies: `@supabase/supabase-js`, `primevue`, `@primevue/themes`, `primeicons`, `vue-router`
3. Configure `main.ts` with PrimeVue (Aura preset), Vue Router
4. `lib/supabase.ts` — Supabase client with shared types
5. `useAuth` composable — email login, session persistence, admin role check
6. `LoginView.vue` — email/password form, redirect to dashboard on success, "not authorized" if non-admin
7. `AppLayout.vue` — sidebar with nav links (Dashboard, Restaurants, Items, Ratings), header with logout
8. `router.ts` — route guard checking auth + admin role before all routes except login
9. Verify: can log in, see layout, get blocked if not admin

### Phase B: Restaurant CRUD (gate: unblocks seeding)

1. `useRestaurants` composable — list (with search), create, update, delete
2. `useCategories` composable — list all categories (for dropdowns)
3. `useMarkets` composable — list markets (for assignment; Raleigh only for now)
4. `lib/geocode.ts` — Nominatim search, returns lat/lng
5. `RestaurantsView.vue` — PrimeVue DataTable with search, sort, columns: name, address, item count, rating count, date. Row click → edit. Toolbar with "Add Restaurant" button.
6. `RestaurantForm.vue` — PrimeVue Dialog with form fields. Geocode on save. Market auto-assigned.
7. `DeleteConfirm.vue` — reusable confirmation dialog showing cascade counts
8. Verify: can add, edit, delete restaurants. Geocoding works.

### Phase C: Item CRUD + Batch Entry (gate: unblocks menu seeding)

1. `useItems` composable — list (filterable by restaurant/category), create, batch create, update, delete
2. `ItemsView.vue` — DataTable filterable by restaurant (dropdown) or category. Columns: name, restaurant, category, score, rating count. Toolbar with entry mode toggle.
3. `ItemForm.vue` — single item create/edit dialog
4. `ItemBatchForm.vue` — two modes:
   - **Rapid-fire:** restaurant + category sticky, name input with Enter-to-submit, running list below
   - **Paste:** textarea for newline-separated names, restaurant + category selectors, "Create All" button
5. Verify: can add items one-by-one and in batch. Can filter, edit, delete.

### Phase D: Rating Seed + Browse

1. `useRatings` composable — list (filterable by restaurant/item/user), create seed rating, delete
2. `RatingsView.vue` — DataTable with filters. Columns: item, restaurant, user, sentiment (as label), tags, date, moderation status.
3. `RatingForm.vue` — seed rating dialog. Item selector (searchable), 4-button sentiment picker, attribute tag multi-select (filtered by item's category).
4. Verify: can seed ratings, see them in the table, delete them.

### Phase E: Category Management

1. Extend `useCategories` composable — add create and update functions. Create auto-generates slug from name. No delete (categories with items should not be removable from the UI).
2. `CategoriesView.vue` — DataTable with columns: name (sortable), slug, featured (boolean toggle), sort order, item count, date. Toolbar with "Add Category" button.
3. `CategoryForm.vue` — PrimeVue Dialog for create/edit. Fields: name (InputText), featured (ToggleSwitch). Slug auto-generated from name on create, shown read-only on edit.
4. Add `/categories` route and sidebar nav link.
5. Verify: can add categories, edit name and featured state.

### Phase F: Moderation (requires migration)

1. Run moderation migration (adds `moderation_status`, updates trigger, adds admin RLS)
2. Regenerate types
3. `ModerationActions.vue` — inline status badge (click to cycle: active → hidden → uncounted → active) + bulk action bar (appears when checkboxes selected)
4. Update `RatingsView.vue` — add checkbox column, moderation status column with `ModerationActions`, filter by status
5. Update `useRatings` — moderation status update (single + bulk)
6. Verify: can moderate single rating, bulk moderate, scores recalculate excluding uncounted

### Phase G: Dashboard

1. `useDashboard` composable — aggregate queries: total counts, per-category breakdown, gap detection
2. `DashboardView.vue` — StatsCards at top (total restaurants, items, ratings), per-category table, "needs attention" lists (restaurants with 0 items, items with < N ratings, recently added)
3. `StatsCard.vue` — simple number + label card
4. Verify: dashboard reflects real data, gaps are visible

### Phase H: Deploy

1. `vercel.json` in `admin/` — SPA rewrite config (`rewrites: [{ "source": "/(.*)", "destination": "/index.html" }]`)
2. Create Vercel project pointing to `admin/` subdirectory, set root directory to `admin`
3. Add env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Vercel project settings
4. Configure `admin.oakrate.com` domain
5. Verify: deployed, login works, all CRUD functional

---

## Key Dependencies

```json
{
  "dependencies": {
    "vue": "^3.5",
    "vue-router": "^4.5",
    "@supabase/supabase-js": "^2.99",
    "primevue": "^4.3",
    "@primevue/themes": "^4.3",
    "primeicons": "^7.0"
  },
  "devDependencies": {
    "vite": "^6.2",
    "@vitejs/plugin-vue": "^5.2",
    "typescript": "~5.9",
    "vue-tsc": "^2.2"
  }
}
```

Intentionally minimal. No Pinia, no Tailwind, no form library. PrimeVue handles forms, tables, dialogs, and toasts. Add `@tanstack/vue-query` only if caching becomes painful.

---

## Tradeoffs & Alternatives

| Decision | Tradeoff | Revisit when... |
|----------|----------|----------------|
| Monorepo subdirectory | Simpler DX, but Vercel deploys both apps on any push | Admin deploys become noisy → split to separate repo |
| PrimeVue | Full-featured but ~200KB gzipped | Never — it's an admin tool, bundle size doesn't matter |
| No state management | Simple but no cross-view cache | Multiple views need the same data → add vue-query |
| Client-side geocoding | Simple but 1 req/sec rate limit | Batch geocoding needed → use a server-side proxy |
| SPA (not SSR) | No SEO needed, simpler deploy | Never — this is a private admin tool |
