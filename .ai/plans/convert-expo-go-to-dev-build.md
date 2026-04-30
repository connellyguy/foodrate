# Dev Build Migration (Expo Go → Dev Client)

**Status:** Not started. Plan only — do not execute until trigger fires (see "When to do this").

## Goal

Move iOS development off Expo Go and onto a custom dev client so the project can:

1. Use native modules that aren't bundled in Expo Go (`expo-glass-effect` for Liquid Glass, on-device Storybook addons, push notifications via APNs, Apple Sign-In).
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

## Strategy

Two build paths, used for different jobs:

| Path | Command | Cost | Use for |
|------|---------|------|---------|
| **Local** | `npm run ios` (`expo run:ios`) | Free; 3 min incremental, 10 min cold | Daily inner loop on this machine |
| **EAS cloud** | `eas build --profile development --platform ios` | EAS minutes (free tier: 30/mo) | Builds for unconnected devices, beta testers, TestFlight |

Local is the default. EAS is the escape hatch.

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

### Step 5 — EAS login (only when needed for cloud builds)

```
eas login
```

First `eas build` invocation will prompt for credentials handling. Without Apple Developer Program enrollment ($99/yr), EAS can produce **simulator** builds and **internal** builds for registered devices, but not TestFlight or App Store submissions. Enroll only when Phase 5 (Launch Prep) demands it.

### Step 6 — Verify dev-client workflow end-to-end

- JS edit hot-reloads ✓
- Adding a new native module triggers an obvious rebuild step ✓
- Storybook on-device addons run ✓ (validates the native-module path)

## Native config discipline

`/ios` is gitignored — the Xcode project regenerates on `expo prebuild`. **Don't hand-edit Xcode project files.** Express native changes through:

- `app.config.ts` — bundle ID, schemes, Info.plist keys, entitlements
- A config plugin — for repeatable, scriptable native edits
- `expo-build-properties` — Podfile / Gradle property knobs

If you find yourself editing the Xcode project directly, capture the change as a plugin. Otherwise the next prebuild loses it.

The trigger to **stop being CNG and check `ios/` in** is: a native change you cannot express in `app.config.ts` or a plugin AND you'd rather hand-edit Xcode than write a plugin. Don't cross that line preemptively.

## When to do this

**Not now.** Recommendation: defer to the **gap between Phase 2 (Read Path) and Phase 3 (Write Path)**, OR sooner if any of these triggers fires first:

| Trigger | Why it forces the move |
|---------|------------------------|
| Adding `expo-glass-effect` for Liquid Glass surfaces | Native iOS 26 module — not in Expo Go |
| Wiring Apple Sign-In | Requires native entitlements |
| Configuring push notifications (Phase 5 prep) | Remote push broken in Expo Go since SDK 53 |
| Storybook on-device addons stop working | Native deps already in `package.json` may be the limit |
| Need to share a build with a beta tester | Requires EAS internal distribution |

### Why defer

- **Phase 2 is JS-only.** TanStack Query, screen work, fallback patterns — all run fine in Expo Go.
- **You just started Slice 1.** The vertical-slice approach has compounding momentum; a 1–2 hour tooling detour mid-slice loses more than it gains.
- **The work is reversible and quick.** This plan is small enough to execute in a single focused session whenever the trigger fires — there's no preparation cost to deferring.

### Why not defer further

- Phase 3 introduces auth. Apple Sign-In is the second auth method planned. Doing the dev-build move before Phase 3 means Apple Sign-In can be wired in normally rather than as a special case later.
- Doing it at the Phase 2/3 boundary gives a clean checkpoint: read path verified end-to-end in Expo Go, then a tooling reset before the write path begins.

### Concrete checkpoint

Finish Slice 5 (Search) → run a full read-path manual test pass in Expo Go → execute this plan → start Phase 3 in the dev client.
