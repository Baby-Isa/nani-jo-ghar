# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (14 Oct 2026, ~17:45 UK):** Sprint 6 "Fix and guard" is closed (`docs/sprints/S06-fix-and-guard.md`, Outcome and Look back). Published to `main` as 6fa99ea4 (version 20261014T162111Z); GitHub's Pages deploy timed out on its side and was re-run once: confirm it served before telling Zafar it is live. Branch `ccr-a7370759-t0lee7`, `checks.mjs` green.

**Done:** the fix list went from 75 open to 37, every one waiting on art, Mum's recordings or Zafar's play (no code-fixable row left). Rounds 6-9 reports: `build/reports/s06-r6.md` to `s06-r9.md`. Final check, selective at Zafar's word (14 Oct): the contract route (9 pages) and the changed flows (heal-taste, heal-foot, heal-boing, cook:day6), 0 breaks; publish gate clear.

**Zafar's 14 Oct calls (in the docs):** CLN-139 retired (no patient card); CLN-140 (a one-action stage has no step list); English marked to record passes until launch and fails on the store build (contract-16 with `--store`, the judge); LNG-15 ("Eid Mubarak!" to record until Mum confirms it).

**Next steps, in order:**
1. Confirm the Pages deploy for 6fa99ea4; then Zafar plays and sends `/feedback`.
2. His feedback into rows (`/feedback`); the next sprint opened with `/sprint` (likely candidates: the art run for the 37 waiting rows' art, a Mum round for the recordings).

**For Zafar to look at when he plays (judge's notes, not rows yet):** the send-off headline is smaller than the others; the heal card's later steps are very faint pink with a stray "!" (likely CLN-141); the diagnosis strip and headline say nearly the same thing.

**Open questions to Zafar:** none new; `docs/questions.md` holds the deferred ones.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `ccr-a7370759-t0lee7` (`main` = 6fa99ea4, Sprint 6 published). First: confirm the site is live, then take my play feedback; tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 1 | 73 |
| Cook: pantry | 1 | 14 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 1 / 0 / 3 / 0 / 0 / 1 / 4 | 16 / 14 / 19 / 11 / 19 / 15 / 30 |
| Clinic | 14 | 133 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 9 |
| Art | 4 | 9 |
| Language and audio | 7 | 5 |

---

## What is live (the game on `main`)

Sprint 6, published 14 Oct (6fa99ea4, 20261014T162111Z): every code-fixable row fixed and judged, the new checks (`docs/sprints/S06-fix-and-guard.md`), on top of Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
