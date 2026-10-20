# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (20 Oct 2026, evening UK):** Sprint 8's fixes and its art (s08c, waves 7A and 7B) are merged and pushed on `claude/new-session-b5r2am` (f8e8e92c); `main` = 38d0591a. 7A's replay at 8 sizes: every Cook flow reaches its end with 0 rule breaks (contract-11 and contract-37 now pass). Checks green. **Running:** evidence on the changed rows (`evidence.mjs --run --changed --since 4c0219c9`, about 3 hours in chunks), then the judges, `--apply`, and the full gate once. **Then Zafar's go to `/publish`.**

**Art open (from 7A):** the tray's chunks nearly touch; the tip frames' undersides are slightly lumpy; cook:daal's oil still shows glossy bubbles (CK-06). s09a redo (house, Nani by the fire, the book from the child's seat, our day) is with Zafar; Sprint 9 moves to its own chat.

**Process (Zafar, 20 Oct):** builders replay their flows at 8 sizes before reporting (brief.mjs); the full gate once before a publish; judge FAILs checked against his own words first; evidence on changed rows (`--changed`); two builders a round, each owning its rows' specs.

**Next steps:** 1. finish the evidence, judges and gate → the FAIL list to Zafar. 2. his publish go → `/publish`. 3. Sprint 9 in its own chat.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `claude/new-session-b5r2am` (`main` = 38d0591a). Sprint 8's fixes and art are merged; finish the evidence run, judges and the gate, then ask me before publishing.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 25 | 71 |
| Cook: pantry | 2 | 12 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 6 / 2 / 9 / 2 / 3 / 5 / 6 | 15 / 14 / 23 / 12 / 20 / 14 / 33 |
| Clinic | 41 | 141 |
| First launch and shell | 0 | 2 |
| Other modes | 2 | 9 |
| Art | 7 | 9 |
| Language and audio | 10 | 4 |

---

## What is live (the game on `main`)

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
