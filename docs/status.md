# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (14 Oct 2026, ~05:00 UK):** Sprint 6 "Fix and guard" (`docs/sprints/S06-fix-and-guard.md`; ceiling $350, nothing left out for budget, everything in the orchestrator's chat). `main` is still 8559d610; all work is on `ccr-a7370759-t0lee7`.

**Done:**
- Docs cut-down (`build/reports/s06-docs.md`): live docs 248k -> 205k words.
- 20 of 24 checks built (listed at the top of `docs/process/checks-to-build.md`); their debt sits in known lists that may only shrink.
- Round 1 builders merged (`build/reports/s06-cook.md`, `build/reports/s06-clinic.md`), every row judged by Opus `judge` agents, applied through the red-then-green gate. Built: CLN-45, 100, 104, 116, 143, 146, 148; SH-69, DAAR-22, SEK-13, CK-35. New rows from the checks: MOD-03, LNG-14, SH-85, CLN-149, CLN-150.

**Running:** round 2, two in-chat Opus builders in worktrees: `s06-r2-shared` (CLN-118, CLN-127, the results screen's clipped tiles, boing's untagged English, checks 6 and 20, reds for CLN-138/144/145, probes for CLN-26/37/126/149) and `s06-r2-cook` (SH-85, DAAR-13, DAAR-19, probes for CK-21/31, CHAI-13, CK-27's samosa, reds for CK-32, SH-81, DAAR-23).

**Next steps, in order:**
1. When each hands back: in its worktree `evidence.mjs --judge`, one `judge` agent per batch, `--collect`, `--apply` (oldest run first); merge; `checks.mjs`.
2. `/review` at the full matrix (sandbox `--gate`, the contract route, `evidence.mjs --run --sprint`), the publish gate (`publish.mjs` dry run), publish, then Zafar plays.

**Open questions to Zafar:** `docs/questions.md` 28-34.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `ccr-a7370759-t0lee7` (`main` = 8559d610). Sprint 6 is mid-way: carry on from "Next steps"; tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 4 | 67 |
| Cook: pantry | 2 | 13 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 2 / 0 / 6 / 0 / 0 / 1 / 9 | 16 / 14 / 16 / 11 / 19 / 15 / 19 |
| Clinic | 24 | 122 |
| First launch and shell | 0 | 2 |
| Other modes | 2 | 1 |
| Art | 6 | 9 |
| Language and audio | 8 | 5 |

---

## What is live (the game on `main`)

Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
