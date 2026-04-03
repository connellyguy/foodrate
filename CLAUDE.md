# OakRank

Item-level food rating app. Rate individual dishes, not restaurants.

- **Product doc:** [docs/PRODUCT.md](docs/PRODUCT.md) — read this before making architectural or feature decisions
- **Architecture doc:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — tech stack, key decisions, and scale triggers
- **Domain:** oakrank.app
- **MVP market:** Raleigh, NC only
- **Platform:** Native app (primary), mobile web (secondary)
- **MVP categories:** 7 seeded food categories (pizza, wings, tacos, ramen, sushi, ice cream, barbecue)

## Code Standards

Follow the standards in [code-standards/](code-standards/) — formatting, naming, TypeScript, React Native patterns, and accessibility. Enforced via ESLint (`@stylistic/eslint-plugin`) and EditorConfig.

## Code Review

After completing non-trivial new code (components, screens, hooks, utilities), spawn the `nit` agent to review it. The nit agent is read-only — it returns findings but does not make changes. The caller (you) implements the fixes. Use `/nit` for on-demand reviews.

## Tool Rules

- **Search:** Use `rg` (ripgrep) for all content searches, not `grep`. Only use `grep` when you need to search gitignored files.
- **Edit:** Use the Claude `Edit` tool for all file modifications. Never use `sed` or `awk` for editing files.
- **Run:** Never run direct `npx` commands if there's an `npm run` equivalent. Always prefer `npm run <script>`.

## Key Constraints

- The rating flow must complete in under 10 seconds — protect this at all costs
- **WCAG 2.1 AA contrast is mandatory** — 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold). Every text color token must pass against its expected background surfaces. See `code-standards/accessibility.md` for details.
- MVP is Raleigh-only but architecture should not hardcode a single market
- Attribute tags are collected but low-visibility in MVP — no attribute-based filters or leaderboards yet
- No empty states — always redirect users to high-confidence alternatives
- No social features, gamification, or restaurant owner features in MVP
