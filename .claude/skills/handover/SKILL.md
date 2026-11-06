---
name: handover
description: Rewrite the "Next chat" section of docs/status.md so a fresh chat can pick up - where things stand, what's open, a ready-to-paste starting prompt. Use at the end of every step or gate, before any long run, or when the context is about 70% full.
---
# /handover: the "Next chat" section

**For:** the orchestrator. Hand over at every step end; "Next chat" stays under 600 words (`docs.mjs` fails it otherwise).

## Steps
1. Gather the facts (don't re-derive them):
   ```
   node build/tools/ops/checkin.mjs --since "<when the last handover was written>"
   node build/tools/review/statuscounts.mjs
   ```
   Plus `git log origin/main -5` and the new reports in `build/reports/`.
2. Rewrite only the "Next chat" section at the top of `docs/status.md`:
   - **First line: `**Handover branch:** `<branch>``**, the branch you are on (`git branch --show-current`), which you push in step 5.
     A new chat starts from `main`, which can be a step behind; this line is how it finds the newest handover (Zafar, 6 Nov).
   - **Where things stand** (date and UK time): what is done (with report names), what is running (session id, model, stop time, report it will write), what is live on `main`.
   - **Next steps, in order**, each with the decision number that set it; the next launch with its model, effort and cost.
   - **Open questions to Zafar**, numbered.
   - **Starting prompt for a new chat**, ready to paste, opening with ``First `git fetch origin <branch>` and work from that branch`` (the handover branch), then: read CLAUDE.md, then status "Next chat" only and nothing else until a task needs it; the branch and `main`; "tell me before launching anything new").
3. Update the "The fix list" table: `node build/tools/review/statuscounts.mjs --write`, then fix the prose it lists by hand.
4. Overnight: write the morning report, and log one line (`/checkin --log`).
5. Run `node build/tools/review/docs.mjs`: it fails if the branch line is missing, the starting prompt doesn't fetch that branch, or
   the line names a branch other than the one you're on. Commit `docs/status.md` alone ("status: handover <time>") and push the branch.
6. Tell Zafar in one line, and recommend a fresh chat at this step boundary.

## Keep it short
Facts and pointers, no history: the reports, the fix list and the design docs hold the detail. Answered questions leave `docs/questions.md` the same day.
