# OakRate Admin — Product Definition

**Domain:** admin.oakrate.com
**Platform:** Web only (desktop-first)
**Users:** Owner/admin only (single user for MVP)
**Relationship to main app:** Separate web app, shared Supabase backend

## Purpose

The admin app is operational tooling for bootstrapping and maintaining OakRate's data. It handles cold-start seeding (restaurants, menu items, ratings) and ongoing content moderation. It is not user-facing — it's an internal tool optimized for keyboard-heavy desktop workflows.

The main OakRate native app contains zero admin code. The admin app connects to the same Supabase project and relies on the same RLS policies, authenticated as a user with `profiles.role = 'admin'`.

## Core Capabilities

### Restaurant Management

Full CRUD for restaurant records.

- **List view** — searchable table of all restaurants. Columns: name, address, item count, rating count, date added. Sortable by any column. Filter by category coverage (e.g., "restaurants with pizza items").
- **Create** — name, address, city, state, zip. Geocode via Nominatim on save (convert address to lat/lng). Market auto-assigned to Raleigh.
- **Edit** — all fields editable. Re-geocode on address change.
- **Delete** — cascading delete (items + ratings). Confirmation dialog showing what will be deleted ("14 items, 63 ratings will be permanently removed").

### Menu Item Management

Full CRUD for items, optimized for bulk entry.

- **List view** — filterable by restaurant (primary) or by category. Columns: name, restaurant, category, score, rating count. Sortable.
- **Create (single)** — select restaurant, enter name, pick category. Featured categories appear first in the dropdown.
- **Create (rapid-fire)** — the primary entry mode. Select a restaurant and category once, then enter item names one at a time. Each submit clears only the name field — restaurant and category stay sticky. A running list below the input shows what's been added in this session.
- **Create (batch paste)** — paste a newline-separated list of item names, all assigned to the same restaurant + category, created in one operation. For when you're copying from a restaurant's online menu.
- **Edit** — name, category reassignment.
- **Delete** — cascading delete (ratings). Confirmation with count.

### Rating Management

Browse, create, and moderate ratings.

- **List view** — filterable by restaurant, item, user, or moderation status. Columns: item name, restaurant, user, sentiment, date, moderation status. Sortable.
- **Create (seed)** — select an item, pick sentiment, optional attribute tags. Recorded under the admin's own user_id (honest ratings, not fake accounts). Used for bootstrapping scores during cold start.
- **Delete** — hard delete. For removing seed ratings that are no longer wanted.

### Rating Moderation

Three-state moderation model for ratings:

| Status | Visible to users | Counts in score | Use case |
|--------|-----------------|-----------------|----------|
| `active` | Yes | Yes | Normal — the default state |
| `hidden` | No | Yes | Inappropriate photo or display name, but the sentiment signal is still valid data |
| `uncounted` | No | No | Spam, brigading, inaccurate — bad data that should not influence scores |

- **Single moderation** — tap/click a rating to change its status. One click cycles through: active → hidden → uncounted → active.
- **Bulk moderation** — select multiple ratings (checkbox), apply a status to all. For brigading situations where many ratings need to be uncounted at once.
- Score recalculation must respect moderation status: `active` and `hidden` ratings count toward the OakRate score; `uncounted` ratings do not.

### Data Overview

A dashboard-style landing page showing seeding health:

- Total restaurants, items, and ratings
- Per-category breakdown: how many items and ratings per featured category
- Restaurants with zero rated items (seeding gaps)
- Items with fewer than N ratings (score confidence gaps)
- Recently added restaurants/items (quick access to continue seeding)

## Schema Dependencies

This admin app requires one migration before it can support moderation:

- **`ratings.moderation_status`** — text column, default `'active'`, check constraint: `active`, `hidden`, `uncounted`
- **Update rating trigger** — exclude `uncounted` ratings from score calculation (only average ratings where `moderation_status in ('active', 'hidden')`)

The `categories.featured`, `profiles.role`, and `is_admin()` RLS infrastructure are already in place.

## Auth

Login via Supabase email auth (same credentials as the main app). The app checks `profiles.role = 'admin'` after login — if the user isn't an admin, show a "not authorized" message. RLS enforces this at the database level regardless.

## What's Out

- User management (ban users, view profiles) — use Supabase dashboard
- Audit logging (who moderated what) — overkill for solo admin
- Duplicate detection/merging — the admin is the dedup during seeding
- Attribute tag management — seeded via migration, edited in Supabase dashboard if needed
- Photo moderation tooling — use Supabase Storage dashboard for one-offs
- Analytics or reporting beyond the data overview dashboard
