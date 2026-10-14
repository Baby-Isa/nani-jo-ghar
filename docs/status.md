# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (14 Oct 2026, ~03:00 UK):** Sprint 6 "Fix and guard" is open (`docs/sprints/S06-fix-and-guard.md`, Zafar's yes 14 Oct: ceiling $350, nothing left out for budget, everything in the orchestrator's chat). `main` is still 8559d610 (Sprint 5); all work is on `ccr-a7370759-t0lee7`.

**Done so far:**
- Triage of the 75 open rows (in the sprint file): ~37 code, art, Mum and Zafar lists.
- Docs cut-down (`build/reports/s06-docs.md`): live docs 248k -> 205k words.
- Checks built (each listed at the top of `docs/process/checks-to-build.md`): 1 red-then-green gate, 2 publish gate, 3 zero tolerance, 4/5/7/8 as contract-16/17/19/20, 9-11/13/17/18/21 (`build/lint/static.mjs`), 12, 14, 16 (`artcheck.mjs`), 19 (leak bots every level), 22, 23, 24. Debt they found sits in known lists that may only shrink.
- Rows built through the gate: CLN-146, CLN-148. New rows: MOD-03 (Tidy leak), LNG-14 (store build plays unchecked clips).

**Running (in-chat Opus builders, own worktrees, never judge their own work):** Clinic builder on `s06-clinic` (CLN-140, 143, 45 committed so far; report `build/reports/s06-clinic.md`); Cook+shared builder on `s06-cook` (CK-35, SH-10, SH-69, SH-81, CK-07/31/32 so far; report `s06-cook.md`). A container restart stopped them once; they were resumed with `--parallel 1`.

**Next steps, in order:**
1. When each builder hands back: in its worktree, `evidence.mjs --judge`, one `judge` agent per batch, `--collect`, `--apply`; then merge the branch, run `checks.mjs`.
2. Checks still to build: 6 (card rows: the games must log each step closing), 20 (input live: the host must log each act) once `js/shared` is merged; 15 (load check on every page, oversize pictures) is written, its first run pending.
3. The contract route run (`s06-route`) and the load check are queued: turn their findings into rows.
4. `/review` at the full matrix, the publish gate, publish, then Zafar plays.

**Open questions to Zafar:** `docs/questions.md` 28 (English under the words on the end-of-round review) and 29 (263 clips he picked but never marked OK).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `ccr-a7370759-t0lee7` (`main` = 8559d610). Sprint 6 is mid-way: carry on from "Next steps"; tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 4 | 66 |
| Cook: pantry | 2 | 13 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 2 / 0 / 7 / 0 / 0 / 2 / 10 | 16 / 14 / 15 / 11 / 19 / 14 / 18 |
| Clinic | 25 | 117 |
| First launch and shell | 0 | 2 |
| Other modes | 2 | 1 |
| Art | 6 | 9 |
| Language and audio | 8 | 5 |

---

## What is live (the game on `main`)

Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
