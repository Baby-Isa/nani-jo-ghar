# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (26 Oct 2026):** Sprint 12 "Polish" is published and live on `main` (its outcome and look back are in `docs/sprints/S12-polish.md`). **Sprint 13 "One shared kit" is open** (`docs/sprints/S13-one-shared-kit.md`), on `claude/funny-carson-oxxdkw`.

**Next steps:**
1. Step 1, the review, is done (26 Oct): report `build/reports/s13-kit-review.md`. Zafar asked it to be open-minded: every element that could sit shared, not only the sprint file's list.
2. Put the review's decisions to Zafar as a numbered list (budget $120-160, 2 days: confirmed 26 Oct).
3. Step 2: S13-A tokens and motion, S13-B components (two builders, Opus high, judged), then every game replayed at both sizes, `/review`, publish on his OK, his play, `/feedback`.
4. Zafar records at Masi's from `docs/language/recording-sheet.md`.

**Open questions to Zafar:** the review's 15 decisions (its section 7; 10 withdrawn).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only. Sprint 13 is open; carry on from "Next steps". Tell me before launching anything new.

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

22 Oct 2026, published about 02:45 UK (7ff52b9, 20261022T014206Z): Sprint 10 "Show it" (labs, day builder, New player, girl patient, tooth drill, effects off), judged row by row.

21 Oct 2026, published 14:29 UK (a6c72e54, 20261021T132558Z): Sprint 9 ("A day at Nani's") on Sprint 8, past the gate on Zafar's word ("push to main asap"); only checks.mjs run (green).

21 Oct 2026, published 14:06 UK (c2410f7a, 20261021T130210Z): Sprint 8 (the 17-18 Oct fixes, the s08c art, the chicken with an English placeholder, the overnight and sweep fixes), on Zafar's word past the publish gate (`--force`). A second update follows with the last code rows.

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
