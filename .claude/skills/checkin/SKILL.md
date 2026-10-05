---
name: checkin
description: The 30-40 minute check-in while build sessions run. Use when a send_later check-in fires, or when Zafar asks how the run is going.
---
# /checkin: one look at the run, one line to Zafar

**For:** the orchestrator during runs. Rules: B11, B12, B13, A17 (`docs/process/rules.md` §1-2).

## Steps
1. What landed:
   ```
   node build/tools/ops/checkin.mjs
   ```
   Commits since the last check-in by session tag, reports landed, art on `main` (x of 115), and the sessions `docs/status.md` lists.
2. Each running session: `get_session` (`updated_at`, `status_detail`). "Idle" isn't dead: wait 20-30 min before judging; never relaunch one that is running (B12). After a usage limit, relaunch stopped ones as continuations (B11).
3. Look at any finished screenshots yourself (B13), flaws first (C3). For a landed report: read it, not the transcript.
4. Write the line and log it (append only; days before today move to `docs/process/overnight-log/<date>.md`):
   ```
   node build/tools/ops/checkin.mjs --log --note "<your one-line judgement>"
   ```
5. Post the same one line to Zafar. Re-arm `send_later` for 30-40 minutes.
6. Push the branch if 20-30 minutes have passed since the last push.

## When a session has ended
Read its report, recheck its screens (`/review`), then launch the next queued step only if Zafar already said go for it (A2).
