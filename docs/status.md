# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (14 Oct 2026, ~08:30 UK):** Sprint 6 "Fix and guard" (`docs/sprints/S06-fix-and-guard.md`). `main` is still 8559d610; all work is on `ccr-a7370759-t0lee7`, `checks.mjs` green.

**Done:**
- Docs cut-down (`build/reports/s06-docs.md`): live docs 248k -> 205k words.
- 22 of 24 checks built (top of `docs/process/checks-to-build.md`); their debt is in known lists that may only shrink.
- Three build rounds merged (reports `s06-cook`, `s06-clinic`, `s06-r2-cook`, `s06-r2-shared`, `s06-r3` in `build/reports/`); every row judged by Opus `judge` agents and applied through the red-then-green gate. 28 rows built this sprint.
- Zafar's list: two strikes CK-27 (now built), CLN-140, CLN-106, CLN-118, CHAI-13, CK-21; CK-31 for his play; DAAR-24; `docs/questions.md` 28-34.

**Running:** the full sandbox gate `s06-gate` (every flow, level and size; the contract checks and the zero-tolerance lint).

**Next steps, in order:**
1. Gate findings into rows or fixes (a scroll-container at 800x360 was seen on chai-tray in round 3).
2. `evidence.mjs --run --sprint`, judge, collect, apply; then `publish.mjs` (the gate) and publish; Zafar plays.

**Open questions to Zafar:** `docs/questions.md` 28-34.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `ccr-a7370759-t0lee7` (`main` = 8559d610). Sprint 6 is mid-way: carry on from "Next steps"; tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 3 | 73 |
| Cook: pantry | 1 | 14 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 1 / 0 / 3 / 0 / 0 / 1 / 5 | 16 / 14 / 19 / 11 / 19 / 15 / 30 |
| Clinic | 14 | 133 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 9 |
| Art | 4 | 9 |
| Language and audio | 7 | 5 |

---

## What is live (the game on `main`)

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
