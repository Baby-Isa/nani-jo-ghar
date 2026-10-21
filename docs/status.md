# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (21 Oct 2026, 14:30 UK):** Sprint 9 ("A day at Nani's": the door, the window ride, the evening book, the day runner) is live on `main` (a6c72e54) with Sprint 8 under it. Branch `ccr-1888a520-dk18y7` = `main` + this handover. Zafar's 21 Oct rule: a new feature that never failed closes on its green PASS (`redGreen`, CLAUDE.md rule 7); 15 S09 rows closed by it. Still open: BOOK-05 (wrong-drag driver), DAY-02 (two strikes: Zafar's call; it now passes on a stronger probe), DAY-03 and LNG-18 (Sprint 10). Not run before this publish (Zafar: as few checks as possible): `/review`'s full 8-size check and a gate run; the merge took main's game code for every Sprint 8 file.

**Next steps:**
1. Zafar plays (`labs.html`, `day.html`); his notes → `/feedback`.
2. `/sprint` close for Sprint 9 (three-line look back), then open Sprint 10, the farm day in full (`docs/game-design/days/farm.md`), with DAY-03, LNG-18 and BOOK-05's driver. About $150; two builders.

**Open questions to Zafar:**
1. DAY-02: close it on its latest PASS (the probe was strengthened after its two FAILs)? Recommend yes.
2. Hannah Mami: her name in the game, picture (a likeness run) and voice.
3. Mum's words: the corn dressings, the shops' directions, the ride's and book's grey lines (the recording sheet).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Sprint 9 is live on `main`. Carry on from "Next steps". Tell me before launching anything new.

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
| Language and audio | 11 | 4 |

---

## What is live (the game on `main`)

21 Oct 2026, published 14:29 UK (a6c72e54, 20261021T132558Z): Sprint 9 ("A day at Nani's") on Sprint 8, past the gate on Zafar's word ("push to main asap"); only checks.mjs run (green).

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
