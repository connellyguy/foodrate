---
name: sup
description: Boot-up briefing — reads the implementation plan and progress, reports current state
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
---

# Sup — Project Status Briefing

Read the project state and give a concise briefing on where things stand.

## What to read

1. `.ai/plans/progress.md` — the phased progress checklist (source of truth for what's done and what's next)
2. `.ai/plans/implementation-plan.md` — for context on what each phase means
3. `.ai/todos.md` — small tracked items outside the plan
4. Run `git log --oneline -5` for recent commits
5. Run `git status --short` for uncommitted work

## Output format

Keep it tight. No filler.

```
## Current Phase
<Which phase is active, what's the goal>

## Recently Done
<Last few completed items from progress.md or git log, whichever is more informative>

## Up Next
<The next 3-5 unchecked items on the critical path>

## Todos
<Any items in .ai/todos.md, or "None" if empty>

## Uncommitted
<git status summary, or "Clean" if nothing>
```

## Rules

- Don't editorialize or suggest priorities — just report the state.
- If progress.md checkboxes disagree with what's actually in the codebase (e.g., something is checked but the file doesn't exist), flag it.
- If the admin progress file exists (`.ai/plans/admin/progress.md`), include a one-line summary of admin app status too.
