# Dev Build Migration (Expo Go → Dev Client)

**Status:** Active — next item of work (Phase 1.4). Slice 1 of Phase 2 is paused mid-flight; resume slice work afterward in the dev client.

## Goal

Move iOS development off Expo Go and onto a custom dev client so the project can:

1. Use native modules that aren't bundled in Expo Go (`expo-glass-effect` for Liquid Glass surfaces, on-device Storybook addons, push notifications via APNs, Apple Sign-In).
2. Build production-shaped binaries via EAS (TestFlight, ad-hoc internal distribution).
3. Avoid the SDK 53+ break where remote push notifications no longer function in Expo Go.

## Current state

- `ios/` directory exists; `/ios` and `/android` are gitignored — Continuous Native Generation (CNG), correct pattern for this project.
- `eas.json` has `development` / `preview` / `production` profiles already configured.
- `app.config.ts` has `bundleIdentifier: "app.oakrate"`.
- Xcode 26.4.1 + eas-cli 18.4.0 installed locally.
- **Missing:** `expo-dev-client` not in `package.json`.
- **Missing:** Not logged into EAS.
- **Missing:** No Apple Developer Program enrollment (free-tier signing only).

## Why now

Originally scheduled for the Phase 2 → Phase 3 boundary. Promoted to next-up because:

- **Storybook on-device addons are already in `package.json`** (`@storybook/addon-ondevice-actions`, `@storybook/addon-ondevice-controls`). These are native modules — Expo Go ships a fixed set of natives, so any reliance on these is on borrowed time.
- **Tooling debt compounds.** A 1–2 hour conversion now is cheaper than a context-switch mid-Phase-3 when Apple Sign-In or push plumbing forces the move under deadline.
- **Slice 1 is a clean checkpoint.** Hook + banner + screen just shipped. Pausing here is lower-risk than pausing mid-slice later.
- **Reversible.** Until something native is actually wired in, `expo start` (without `--dev-client`) still works as a fallback.

## Strategy

Two build paths, used for different jobs:

| Path | Command | Cost | Use for |
|------|---------|------|---------|
| **Local** | `npm run ios` (`expo run:ios`) | Free; ~3 min incremental, ~10 min cold | Daily inner loop on this machine |
| **EAS cloud** | `eas build --profile development --platform ios` | EAS minutes (free tier: 30/mo) | Builds for unconnected devices, beta testers, TestFlight |

Local is the default. EAS is the escape hatch — defer `eas login` until a cloud build is actually needed.

## Procedure

### Step 1 — Install the dev client

```
npx expo install expo-dev-client
```

Adds `expo-dev-client` to `package.json`. After this, `expo start` boots dev-client mode by default.

### Step 2 — Tighten the start script

Change `package.json`:

```json
"start": "expo start --dev-client"
```

Removes Expo Go ambiguity from the QR code.

### Step 3 — First simulator build

```
npm run ios
```

First run: pods install + native compile (~10 min). Confirm app launches in iOS Simulator and connects to Metro.

### Step 4 — Physical device (free Apple ID signing)

Open `ios/OakRate.xcworkspace` in Xcode once:

1. Select the `OakRate` target → Signing & Capabilities.
2. Set **Team** to your personal Apple ID.
3. Plug in iPhone, select it as run target, build.

7-day install window per signing event; your devices only. Sufficient for solo dev.

### Step 5 — EAS login (deferred until first cloud build)

```
eas login
```

Don't run this as part of the migration. Run it when a build needs to leave this laptop (beta tester, second device without Mac access). Without Apple Developer Program enrollment ($99/yr), EAS can produce simulator builds and internal builds for registered devices, but not TestFlight or App Store submissions. Enroll only when Phase 5 (Launch Prep) demands it.

### Step 6 — Verify dev-client workflow end-to-end

- JS edit hot-reloads ✓
- Adding a new native module triggers an obvious rebuild step ✓
- Storybook on-device addons run ✓ (validates the native-module path)
- Slice 1's `/category/[slug]` screen still renders correctly under the dev client ✓

## Native config discipline

`/ios` is gitignored — the Xcode project regenerates on `expo prebuild`. **Don't hand-edit Xcode project files.** Express native changes through:

- `app.config.ts` — bundle ID, schemes, Info.plist keys, entitlements
- A config plugin — for repeatable, scriptable native edits
- `expo-build-properties` — Podfile / Gradle property knobs

If you find yourself editing the Xcode project directly, capture the change as a plugin. Otherwise the next prebuild loses it.

The trigger to **stop being CNG and check `ios/` in** is: a native change you cannot express in `app.config.ts` or a plugin AND you'd rather hand-edit Xcode than write a plugin. Don't cross that line preemptively.

## On completion

- Mark Phase 1.4 complete in `progress.md`.
- Resume Phase 2 Slice 1 from the next unchecked item (Category Leaderboard screen verification + remaining slice tasks).
