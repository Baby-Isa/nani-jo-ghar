# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (26 Oct 2026, UK):** Sprint 12 "Polish" is closed and live on `main` (fce6b1a3; outcome and look back in `docs/sprints/S12-polish.md`). Mum's 24 Oct sitting is in the engine with Zafar's spellings (`build/reports/mum-2026-10-24.md`); 64 new clips wait for his ear in `lab/family-audio.html` (listen for any that are Masi).

**Next steps:**
1. Sprint 13 "One shared kit": `docs/sprints/S13-one-shared-kit.md` (a Fable review first, then two builders move every game onto the kit). Confirm its budget with Zafar, then `/sprint`.
2. The next sitting with Mum: the "still to settle" list in `docs/language/mum-questions/README.md` (item 12 eat, "like" with arre, can't saka vs sakanto, aiye/aaye, Nana saw me) and the questions for "Choose the reply"; build the Mum-facing sheet with `mumsheet.mjs --docx`.
3. The next art block: FC2 (the face circles' moods and mouths) and CHT-16 (the chop background).
4. Small reshoots on the fix list (SH-123, SH-19 eye, BOOK-10, ART-27: "to fix: check").

**Open questions to Zafar:** the four Kutchi words that start with v (*vai, variyali, vya, vyo*): W or V?

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only. Sprint 12 is live. Start Sprint 13 from `docs/sprints/S13-one-shared-kit.md`. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 16 | 77 |
| Cook: pantry | 5 | 9 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 2 / 3 / 3 / 2 / 1 / 3 / 6 | 18 / 14 / 29 / 12 / 22 / 17 / 32 |
| Clinic | 27 | 164 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 7 | 9 |
| Language and audio | 9 | 6 |

---

## What is live (the game on `main`)

26 Oct 2026, published 13:20 UK (fce6b1a3, 20261026T131724Z): Sprint 12 "Polish" (one help look in every game, chai's ladder and recipe card, the mirrored pour and the served moment, the end screen's third page gone everywhere, replies with speakers and one tap, the eye test rebuilt with a mic that hears, the door, the ride, the book's games, the new art, Mum's 24 Oct sitting), on Zafar's word past the publish gate (`--force`; checks.mjs, 532 unit tests and a 15-flow contract replay at 1366x768 and 915x412 green; the full matrix and evidence run not done).

22 Oct 2026, published about 02:45 UK (7ff52b9, 20261022T014206Z): Sprint 10 "Show it" (labs, day builder, New player, girl patient, tooth drill, effects off), judged row by row.

21 Oct 2026, published 14:29 UK (a6c72e54, 20261021T132558Z): Sprint 9 ("A day at Nani's") on Sprint 8, past the gate on Zafar's word ("push to main asap"); only checks.mjs run (green).

21 Oct 2026, published 14:06 UK (c2410f7a, 20261021T130210Z): Sprint 8 (the 17-18 Oct fixes, the s08c art, the chicken with an English placeholder, the overnight and sweep fixes), on Zafar's word past the publish gate (`--force`). A second update follows with the last code rows.

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
