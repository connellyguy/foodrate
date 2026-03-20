# Expo Scaffold Plan

## Architecture Decisions

### 1. Expo Router (not React Navigation)
Expo Router is the default for new Expo projects, built on React Navigation under the hood. OakRank's navigation (bottom tabs with stacks per tab) maps directly to `(tabs)` groups and nested layouts. The rating flow is a multi-step wizard — handle it as a single screen with internal step state or a modal stack group, not individual routes per step.

### 2. Managed workflow (with dev client)
No custom native code needed for MVP. Camera, location, push notifications are all covered by Expo modules. `expo-dev-client` gives custom dev builds with hot reload. **Eject trigger:** needing a native module that doesn't exist in Expo's ecosystem.

### 3. Generated types from Supabase
`supabase gen types typescript` → `src/lib/database.types.ts`. The `@supabase/supabase-js` client consumes these directly for autocomplete on all queries. Add a `package.json` script so regeneration is one command. No hand-maintained types.

### 4. TanStack Query for server state, no global store
Almost all state is server data (restaurants, items, ratings, categories). TanStack Query handles fetching, caching, invalidation, and optimistic updates. Rating flow wizard state lives in a `useReducer` inside the flow component. **Add Zustand trigger:** prop-drilling non-server state across unrelated screens.

### 5. EAS Build profiles

| Profile | Purpose | Distribution |
|---------|---------|-------------|
| `development` | Dev client with hot reload, debug tools | Internal (device) |
| `preview` | Production-like build for testing (`.apk` / ad hoc) | Internal (TestFlight / direct install) |
| `production` | App Store / Google Play submission | Store |

### 6. Project structure

```
app/                        # Expo Router file-based routes
  (tabs)/
    index.tsx               # Home / Explore
    rate.tsx                # Rating flow entry
    profile.tsx             # Profile
    _layout.tsx             # Tab navigator config
  restaurant/[id].tsx       # Restaurant detail
  category/[slug].tsx       # Category leaderboard
  item/[id].tsx             # Item detail
  search.tsx                # Search screen
  _layout.tsx               # Root layout (providers)
src/
  components/               # Shared UI components
  lib/
    supabase.ts             # Supabase client init
    database.types.ts       # Generated types
  hooks/                    # Custom hooks (useLocation, etc.)
  queries/                  # TanStack Query hooks (useRestaurant, useItems, etc.)
  constants/                # Colors, spacing, config
```

Routes in `app/`, everything else in `src/`.

### 7. Environment config
- `.env` — default values (committed, non-secret)
- `.env.local` — local overrides (gitignored)
- `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (safe to embed — RLS is the security boundary)
- `app.config.ts` (dynamic config) reads env vars at config time
- EAS builds reference env vars via `eas.json` `env` field or EAS dashboard

### 8. CI/CD (start simple)
- **On PR:** lint + type-check + `npx expo export --platform web` (catches build errors, no EAS credits)
- **On merge to main:** EAS Build `preview` profile (auto-distribute to testers)
- **Manual trigger:** EAS Build `production` profile (store submission)
- Run builds manually via `eas build` CLI until shipping frequently enough to justify automation

---

## Implementation Steps

### Step 1: Init Expo project
- `npx create-expo-app@latest . --template tabs` (Expo Router tabs template)
- Verify it runs: `npx expo start`

### Step 2: Configure `app.config.ts`
- Convert `app.json` → `app.config.ts`
- Set `name`, `slug`, `scheme` (deep linking), `bundleIdentifier` / `package`
- Wire `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from env

### Step 3: Set up EAS
- ~~`npx eas init` + `npx eas build:configure`~~ — deferred until first device build is needed
- Configure `eas.json` with development/preview/production profiles (created manually)
- Add `"developmentClient": true` to development profile
- **Decision:** EAS login/init not needed during scaffold — all dev uses `npx expo start`. Run `eas init` when ready for first device build.

### Step 4: Install core dependencies
- `@supabase/supabase-js` — DB client
- `@tanstack/react-query` — server state
- `expo-location` — geo for restaurant proximity
- `expo-image-picker` — photo capture for ratings
- `expo-secure-store` — Supabase auth token persistence

### Step 5: Supabase client + generated types
- Create `src/lib/supabase.ts` — init client with `expo-secure-store` for auth persistence
- Run `supabase gen types typescript` → `src/lib/database.types.ts`
- Add `"gen-types"` script to `package.json`

### Step 6: Route structure + layouts
- Set up `app/_layout.tsx` — root providers (QueryClientProvider, Supabase auth context)
- Set up `app/(tabs)/_layout.tsx` — bottom tab bar (Home, Rate, Profile)
- Stub each screen with placeholder content
- Add stack routes for `restaurant/[id]`, `category/[slug]`, `item/[id]`, `search`

### Step 7: Environment + gitignore
- Create `.env.example` with placeholder values (committed)
- Create `.env.local` with real Supabase credentials (gitignored)
- Verify `.gitignore` covers `.env.local`, `node_modules`, `.expo`, etc.

### Step 8: Linting + type-checking
- Verify Expo's default ESLint config works
- Add `"typecheck": "tsc --noEmit"` script
- Run both to confirm clean baseline

### Step 9: Verify end-to-end
- App starts on iOS simulator / Android emulator / web
- Supabase client connects and can query categories (proves types + client + RLS work)
- Navigation between tabs and detail screens works
