---
name: gitit
description: Stage all uncommitted changes, draft a brief commit message, and confirm interactively before committing
user-invocable: true
allowed-tools: Bash, Read, AskUserQuestion, Agent
---

# gitit

Quick interactive commit helper. Stages everything, drafts a message, loops on user feedback until approved.

## Steps

1. **Inspect working tree** — start with these in parallel:
   - `git status` (no `-uall`)
   - `git diff HEAD --stat` (file-level overview; cheap)

   Do NOT sample `git log` for style. Prior commits in the repo are not a reliable style reference — always follow the format rules in step 6 instead.

2. **If nothing to commit** — tell the user and stop. Do not create empty commits.

3. **Read the diff** — choose one of two paths based on size and context:
   - **Main thread (default)** — run `git diff HEAD` directly when any of these are true:
     - The diff is small-to-medium (rough rule: `--stat` shows ≲ 15 files *and* ≲ 500 line changes)
     - The relevant changes are already loaded in the current conversation (you watched them happen or recently read them)
     - The commit is trivial (single-file fix, config tweak, etc.)
   - **Sonnet sub-agent** — for larger change blocks where reading the full diff would bloat main-thread context, spin up an `Agent` call with `model: "sonnet"` and `subagent_type: "general-purpose"`. Brief it: run `git diff HEAD` and return a concise summary of what changed and *why* (grouped by feature/area). Cap the response at ~200 words. Use the returned summary to draft the commit message — do NOT also read the full diff yourself.

4. **Scan for temporary / debug code** — before staging, review the diff (or the sub-agent summary) for anything in *added or modified lines* that looks like it wasn't meant to ship. Use judgment — the goal is to catch things the developer would notice in their own review but might miss at commit time.

   **What to look for (non-exhaustive — think, don't just pattern-match):**

   *Explicit markers:* `TODO`, `FIXME`, `HACK`, `XXX`, `TEMP` in comments or strings.

   *Debug output:* `console.log/warn/error/debug/dir/table/trace`, `debugger`, `alert()`, `print()`, `print_r()`, `var_dump()`, `dd()`, `dump()`, `error_log()`, `System.out.print/println`, `System.err.print/println`. Exception: files whose purpose is logging (a logger utility, an error handler).

   *Hardcoded test values:* `localhost`, `127.0.0.1`, fake API keys, `example.com`, placeholder URLs or credentials.

   *Commented-out code:* blocks of >2 consecutive commented lines that look like disabled code rather than documentation.

   *Structural signals that something is temporary:* code that disables, bypasses, or short-circuits a real code path (e.g. an early `return`, a hardcoded `true`/`false` overriding a condition, a real API call replaced with static data, a feature flag forced to one value). These won't have a `TODO` marker — look for the *shape* of a temporary override, not just keywords.

   *Debug sleeps:* `sleep()`, `Thread.sleep()`, `time.sleep()` that look like debug delays rather than intentional rate-limiting or backoff.

   *Dead code:* imports that are added but never used, variables assigned but never read, functions defined but never called — only flag when obvious from the diff.

   **If any are found**, present them to the user via `AskUserQuestion` *before staging*:
   - `question`: brief summary — e.g. `"Found 3 potential issues in the diff:"`
   - `header`: `"Pre-commit check"`
   - In the question text, list each finding as a bullet: file path, line context snippet (≤60 chars), and what was flagged (e.g. `console.log`, `TODO`, disabled API call, etc.)
   - `options`:
     1. `label: "Continue"`, `description: "These are intentional — proceed to commit"`
     2. `label: "Abort"`, `description: "Let me clean these up first"`
   - `multiSelect: false`

   If the user chooses **Abort**, stop the skill — do not stage or commit. If **Continue**, proceed.

   **If nothing is found**, move on silently — do not announce a clean scan.

5. **Stage everything** — `git add -A` (include untracked). If you spot likely secrets (`.env`, `credentials*`, `*.pem`, `id_rsa`, etc.) in the status output, warn the user and wait for confirmation before staging those paths.

6. **Draft the commit message** — follow the 50/72 rule strictly. Focus on the *why*, not a restatement of the diff.

   **Format rules:**
   - **Subject line:** ≤ 50 characters. Imperative mood ("add", "fix", "remove" — not "added"/"adds"). No trailing period. No scope prefix unless genuinely useful. Summarize the *purpose* of the change, not the list of files touched.
   - **Blank line** after the subject if a body is present.
   - **Body:** wrap every line at ≤ 72 characters (hard wrap with real newlines — the preview window does not soft-wrap). Use the body only when the subject alone cannot convey the *why*.

   **Single-change commits:** subject line only is ideal. Add a 1–2 sentence body only if the motivation is non-obvious.

   **Multi-change commits:** use the "top summary + bullet breakdown" structure:
   ```
   <≤50-char subject summarizing the overall purpose>

   - <bullet: one concrete change>
   - <bullet: another change>
   - <bullet: ...>
   ```
   **Bullets must be brief.** Target one short line per bullet (≤ 60 chars — the preview panel clips past that, see step 7). Aim for ~8–12 words each. Name the change; skip the justification, mechanism, and file paths. If a bullet feels like it needs a second line, cut words until it doesn't. A good bullet reads like a headline, not a sentence. Merge closely related tweaks. **Aim for 3–5 bullets; hard-cap at 8.** The preview panel silently truncates long content, so staying tight is a functional requirement, not a style choice. If the change genuinely has more than 8 themes, draft it anyway and let the user decide.

   **Good vs. bad bullets:**
   - ✗ `Add a shared button reset to kill the letter-spacing leak from the global stylesheet across all entry components.`
   - ✓ `Add shared button reset to stop letter-spacing leak.`
   - ✗ `Route the "You ran out of time!" message through a floating alert at bottom-center instead of the inline flash error.`
   - ✓ `Move clock-expired message to a floating alert.`

   Only add an intro paragraph above the bullets if the bullets genuinely cannot convey the shared *why*. Default: skip it.

   **Quality bar — every commit message must:**
   - Explain *why* the change exists, not just *what* it does. A reader who only sees the message (not the diff) should understand the motivation.
   - Be succinct. No filler, no restating file paths that are already in the diff, no "this commit...", no marketing language.
   - Never mention Claude, AI, tools, or the drafting process.
   - Never reference tickets, plans, phases, or prior commits.

7. **Present to user via `AskUserQuestion`** — the drafted message is shown via the `preview` field on the "Commit" option, which renders in a persistent monospace panel. Two caveats to plan around:

   - **Line limit (silent truncation):** the preview panel has a fixed render area tied to terminal height. Content past the bottom of the panel is clipped with **no "more below" indicator** — the user just doesn't see it. There is no setting, env var, or keybinding to expand it (confirmed open issues: claude-code#29125, #28991). **Keep the full preview ≤ 10 lines total** (subject + blank line + ≤ ~8 bullets). If you're about to exceed that, merge bullets or drop the intro paragraph before adding more lines. Err shorter, not longer.
   - **Width (no soft-wrap):** side-by-side layout gives the preview roughly half the terminal width. Hard-wrap at ≤ 60 chars per line so nothing overflows horizontally. 60 < 72, so the committed message still respects git convention.

   Call `AskUserQuestion` with:
   - `question`: `"Commit with this message?"` (short — the preview panel carries the actual message)
   - `header`: "Commit msg"
   - `options`:
     1. `label: "Commit"`, `description: "Use the drafted message as-is"`, and set `preview` to the full drafted commit message verbatim (with real newlines). This is the ONLY place the message needs to appear — do not duplicate it into the question text or a prior chat message.
     2. `label: "Revise"`, `description: "Provide feedback to rewrite the message"`
   - `multiSelect: false`

   Do NOT commit before the question is answered. Do NOT output the message as a separate text block beforehand — the preview carries it.

8. **Handle the answer**:
   - **Commit** → run `git commit` with the drafted message via HEREDOC, then `git status` to confirm. Done.
   - **Revise** → the user's follow-up (either free-text in the "Other" field or a next turn) is feedback. Rewrite the message accordingly and loop back to step 7 with the new draft.
   - **Other / free-text** → treat the text as feedback, revise, loop back to step 7.

## Rules

- Never push. Never amend. Never use `--no-verify`.
- If a pre-commit hook fails, report the failure and ask the user how to proceed — do not retry blindly or bypass.
- Use HEREDOC for the commit message to preserve formatting:
  ```
  git commit -m "$(cat <<'EOF'
  message here
  EOF
  )"
  ```
- Keep your own prose minimal. The user wants the drafted message and a prompt, not commentary.
