---
name: sprint
description: Open or close a sprint (one goal, a budget, one full check and publish, Zafar's play, a three-line look back). Use when Zafar starts new work outside a sprint (propose the goal and budget first), when a sprint's publish is done, or when he asks where the sprint stands.
---
# /sprint: open and close a sprint

**For:** the orchestrator. A sprint is one goal Zafar can play at the end, run back to back with no days or dates (CLAUDE.md, Zafar 8 Nov); one build session at a time, small fixes in the orchestrator's chat. Files: `docs/sprints/Snn-<name>.md` from `docs/sprints/TEMPLATE.md`.

## Open (propose, then wait for Zafar's go)
1. If new work arrives outside a sprint, steer it in: "This looks like Sprint nn. Goal: …. Budget: … (ceiling). Sessions: …. Yes?" Give a model, effort and cost for every session.
2. On his go: copy the template to `docs/sprints/Snn-<name>.md`; fill goal, budget, planned sessions; status "open". Backlog = the fix list (`docs/process/regressions.md`), `docs/process/checks-to-build.md` and `docs/ideas.md`; nothing else is queued.
3. Settle the sprint's design decisions with Zafar at the opening, before any builder launches (Sprint 8): a builder never waits on, or guesses, a design call mid-sprint.
4. Art placeholders are made at the final art's size and position, so wiring the art changes data, not layout (Sprint 8).
5. Add one line to `docs/status.md` "Next chat" and commit.

## During
- Small decisions go in the sprint file's "Small decisions". A lasting decision (one that will still hold next sprint) goes into the doc, row or check it changes, the commit saying "Zafar, <date>"; one answer, one place. Never paste check-ins into the sprint file (`checkin.mjs --log` keeps them in `docs/process/overnight-log.md`).
- At close: any mode called finished gets a pass through `docs/ideas.md` with Zafar first (Zafar, 14 Oct).
- Feedback becomes fix-list rows the same day (`/feedback`). Cut scope before the budget.
- Every builder's hand-back and every merge runs `check-change` (tier 2; `/review`).

## When the main work is in (before the fix-up, not at the publish)
Run tier 3, by itself, the moment the last planned builder is merged (Zafar, 9-10 Nov):
```
node build/tools/tiers/check-sprint.mjs
```
Since the last publish: every changed game at L1-L4 at the four sizes with every rule, every other game to its end at one size, chai's frozen run, the sprint's row probes, beside chai for a game on new pictures, first-minute films (first time and returning), and the extra checks `tiers.json` places at tier 3. Its result (`build/reports/tiers/sprint-<commit>.md`) is ONE fix list by game: that is the fix-up. Send its batches to the `judge` (Fable): the probe sheets (`evidence.mjs --collect` then `--apply`) and any beside-chai batch; watch the films yourself. Every contract break it lists gets an outcome in the sprint: the game fixed, the probe fixed, or the rule retired with his yes. Then `/publish` (tier 3b).

## Close (after `/review`, `/publish` and Zafar's play)
1. Fill **Outcome**: the commit on `main`, what was cut or moved on, open rows by mode (`statuscounts.mjs`), money spent against the budget.
2. Write the **three-line look back**: what worked, what cost more than it should, one process change. If a line changes how we work, make it a rule (A-section) and a decision row.
3. Set status "closed (date)", then `git mv` the file to `docs/archive/sprints/` only when the *next* sprint has opened (so the last one stays at hand).
4. Run `/handover`; recommend a fresh chat at this boundary.

## Never
- Start a sprint, a session or art before Zafar has said go. Add a second goal mid-sprint: it goes to the next sprint's proposal.
