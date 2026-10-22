# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (22 Oct 2026, 17:30 UK):** Sprint 11 "Easy to play, easy to learn" is live on `main` (40adcb2). Sprint 12 is open (`docs/sprints/S12-polish.md`): minor fixes and tweaks to the eye test, the tooth game, chai, the day (door and ride) and the book, iterating on the approved plan `docs/game-design/easy-to-play.md` in rapid-prototype mode (three sizes, light targeted checks, one judge pass per builder). Working branch `ccr-1888a520-dk18y7`.

**Next steps:**
1. Wait for Zafar's feedback; turn every point into a fix-list row the same day (`/feedback`).
2. Propose the builders (model, effort, cost, files owned), on top of the rows carried in (EASY-08, CHAI-31 and the chai flaws in the sprint file). Launch only on his go.
3. Merge, judge, `checks.mjs`, publish; close the sprint.

**Open questions to Zafar:** "ha" or "haa"; "bateto" or "bataato"; redo the shine as a round starburst (recommended).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Sprint 11 is live on `main`. We're starting Sprint 12 (`docs/sprints/S12-polish.md`): minor fixes and tweaks to the eye test, the tooth game, chai, the day (door and ride) and the book, still in rapid-prototype mode (three sizes, light targeted checks, one judge pass per builder), iterating on the approved plan in `docs/game-design/easy-to-play.md`: easy to play, easy to learn for people who don't know Kutchi. Don't build anything yet: wait for my feedback, turn it into fix-list rows with `/feedback`, then propose the builders (model, effort, cost) and launch only on my go.

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

22 Oct 2026, published about 17:10 UK (40adcb2, 20261022T161039Z): Sprint 11 "Easy to play, easy to learn", judged row by row (two cosmetic rows left).

22 Oct 2026, published about 02:45 UK (7ff52b9, 20261022T014206Z): Sprint 10 "Show it" (labs, day builder, New player, girl patient, tooth drill, effects off), judged row by row.

21 Oct 2026, published 14:29 UK (a6c72e54, 20261021T132558Z): Sprint 9 ("A day at Nani's") on Sprint 8, past the gate on Zafar's word ("push to main asap"); only checks.mjs run (green).

21 Oct 2026, published 14:06 UK (c2410f7a, 20261021T130210Z): Sprint 8 (the 17-18 Oct fixes, the s08c art, the chicken with an English placeholder, the overnight and sweep fixes), on Zafar's word past the publish gate (`--force`). A second update follows with the last code rows.

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
