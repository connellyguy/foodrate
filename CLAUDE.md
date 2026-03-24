# OakRank

Item-level food rating app. Rate individual dishes, not restaurants.

- **Product doc:** [docs/PRODUCT.md](docs/PRODUCT.md) — read this before making architectural or feature decisions
- **Architecture doc:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — tech stack, key decisions, and scale triggers
- **Domain:** oakrank.app
- **MVP market:** Raleigh, NC only
- **Platform:** Native app (primary), mobile web (secondary)
- **MVP categories:** 20 food categories (see product doc for full list)

## Code Standards

Follow the standards in [code-standards/](code-standards/) — formatting, naming, TypeScript, React Native patterns, and accessibility. Enforced via ESLint (`@stylistic/eslint-plugin`) and EditorConfig.

## Code Review

After completing non-trivial new code (components, screens, hooks, utilities), spawn the `nit` agent to review it. The nit agent is read-only — it returns findings but does not make changes. The caller (you) implements the fixes. Use `/nit` for on-demand reviews.

## Key Constraints

- The rating flow must complete in under 10 seconds — protect this at all costs
- MVP is Raleigh-only but architecture should not hardcode a single market
- Attribute tags are user-selected (not NLP-extracted) in MVP
- No social features, gamification, or restaurant owner features in MVP
