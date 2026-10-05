---
name: sprint
description: Open or close a sprint (one goal, a budget, one full check and publish, Zafar's play, a three-line look back). Use when Zafar starts new work outside a sprint (propose the goal and budget first), when a sprint's publish is done, or when he asks where the sprint stands.
---
# /sprint: open and close a sprint

**For:** the orchestrator. Rules: A29, decision 49. Files: `docs/sprints/Snn-<name>.md` from `docs/sprints/TEMPLATE.md`.

## Open (propose, then wait for Zafar's go: A1)
1. If new work arrives outside a sprint, steer it in: "This looks like Sprint nn. Goal: …. Budget: … (ceiling and days). Sessions: …. Yes?" Give a model, effort and cost for every session (A11).
2. On his go: copy the template to `docs/sprints/Snn-<name>.md`; fill goal, budget, planned sessions; status "open". Backlog = open rows (`node build/tools/review/statuscounts.mjs`) and `docs/ideas.md`; nothing else is queued.
3. Add one line to `docs/status.md` "Next chat" and commit.

## During
- Small decisions go in the sprint file's "Small decisions". A lasting decision (one that will still hold next sprint) goes in `docs/decisions.md` as a numbered row with a one-line why and a date, and into `docs/process/rules.md` in the same commit.
- Feedback becomes regression rows the same day (`/feedback`). Cut scope before the budget.

## Close (after `/review`, `/publish` and Zafar's play)
1. Fill **Outcome**: the commit on `main`, what was cut or moved on, open rows by mode (`statuscounts.mjs`), money spent against the budget.
2. Write the **three-line look back**: what worked, what cost more than it should, one process change. If a line changes how we work, make it a rule (A-section) and a decision row.
3. Set status "closed (date)", then `git mv` the file to `docs/archive/sprints/` only when the *next* sprint has opened (so the last one stays at hand).
4. Run `/handover`; recommend a fresh chat at this boundary.

## Never
- Start a sprint, a session or art before Zafar has said go. Add a second goal mid-sprint: it goes to the next sprint's proposal.
