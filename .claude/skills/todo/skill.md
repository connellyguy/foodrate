---
name: todo
description: Manage the project todo list — add, start, finish, and review small tracked items
user-invocable: true
allowed-tools: Read, Edit
---

# Todo — Task Tracker

Manage the todo list at `.ai/todos.md`. This tracks small items, bugs, and one-off tasks that don't belong in the phased implementation plan.

## Commands

Interpret the user's intent from their message:

- **No argument / "show"** — Read and display the current todo list, grouped by section.
- **Add** (e.g., `/todo fix the tab bar icon color`) — Append `- [ ] <description>` to the **Todo** section.
- **Start** (e.g., `/todo start fix tab bar`) — Move the matching item from **Todo** to **In Progress**, changing `- [ ]` to `- [-]`.
- **Done** (e.g., `/todo done fix tab bar`) — Move the matching item from **In Progress** (or **Todo**) to **Done**, changing the marker to `- [x]` and appending the current date as `(YYYY-MM-DD)`.
- **Remove** (e.g., `/todo remove fix tab bar`) — Delete the matching item entirely.

## Rules

1. Always read `.ai/todos.md` first before any operation.
2. Match items by substring — the user won't type the full description. If ambiguous, list the candidates and ask which one.
3. Keep items as single lines. No sub-items or nesting.
4. When showing the list, skip empty sections. If everything is empty, say so.
5. When adding, if the item sounds like it belongs in the phased plan (`.ai/plans/progress.md`), mention that but still add it — the user decides where things live.
6. Today's date for completion stamps: use the current date from context.
