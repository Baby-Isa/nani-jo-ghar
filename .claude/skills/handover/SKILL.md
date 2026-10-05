---
name: handover
description: Rewrite the "Next chat" section of docs/status.md so a fresh chat can pick up - where things stand, what's open, a ready-to-paste starting prompt. Use at the end of every step or gate, before any long run, or when the context is about 70% full.
---
# /handover: the "Next chat" section

**For:** the orchestrator. Rules: A25 (hand over at every step boundary), A15 (status.md is the master tracker), A17 (overnight report by 08:00 UK).

## Steps
1. Gather the facts (don't re-derive them):
   ```
   node build/tools/ops/checkin.mjs --since "<when the last handover was written>"
   node build/tools/review/statuscounts.mjs
   ```
   Plus `git log origin/main -5` and the new reports in `build/reports/`.
2. Rewrite only the "Next chat" section at the top of `docs/status.md`:
   - **Where things stand** (date and UK time): what is done (with report names), what is running (session id, model, stop time, report it will write), what is live on `main`.
   - **Next steps, in order**, each with the decision number that set it; the next launch with its model, effort and cost.
   - **Open questions to Zafar**, numbered.
   - **Starting prompt for a new chat**, ready to paste (read CLAUDE.md, then status "Next chat", the rulebook sections for the work; the branch; "tell me before launching anything new").
3. Update the "Open feedback" table: `node build/tools/review/statuscounts.mjs --write`, then fix the prose it lists by hand.
4. Overnight: write the morning report, and log one line (`/checkin --log`).
5. Commit `docs/status.md` alone ("status: handover <time>") and push the branch.
6. Tell Zafar in one line, and recommend a fresh chat at this step boundary.

## Keep it short
Facts and pointers, no history: the reports and `docs/decisions.md` hold the detail.
