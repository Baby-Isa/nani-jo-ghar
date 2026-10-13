# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

(rewritten at the end of the reset)

---

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 4 | 66 |
| Cook: pantry | 2 | 13 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 2 / 0 / 7 / 0 / 0 / 2 / 9 | 16 / 14 / 15 / 11 / 19 / 14 / 18 |
| Clinic | 30 | 115 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 1 |
| Art | 6 | 9 |
| Language and audio | 7 | 5 |

---

## What is live (the game on `main`)

Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
