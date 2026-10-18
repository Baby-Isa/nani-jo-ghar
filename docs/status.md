# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (17 Oct 2026):** Sprint 8 is open (`docs/sprints/S08-play-feedback-final.md`). `main` = 38d0591a; branch `claude/new-session-b5r2am` carries the docs below. Nothing running.

**Done today:** Zafar's six Cook voice notes (sekelo, samosa, daal, maani, chai, chaat; no clinic yet) turned into `docs/feedback/cook-playtest-2026-10-17.md`: 66 points, causes checked in code, a second reader's 18 finds fixed, the gate passed. Fix list: 57 new rows and 8 reopened (SH-60, PAN-16, PAN-04, LNG-09, SH-53, CHAI-19, CK-TB-01, SEK-07); their contract checks are item 25 in `docs/process/checks-to-build.md`.

**Waiting on Zafar:** the report's §6, fifteen decisions with recommendations (`docs/questions.md` 38). His clinic feedback may follow.

**Next steps, in order:**
1. His answers: each yes into its row, doc or check ("Zafar, <date>"), including non-negotiable 9 (decision 8) and cook.md (decision 9).
2. The Sprint 8 budget; the design pass of decision 2 (Fable); the big art run (decision 15, `/art-run`).
3. Early: `sandbox/run.mjs --gate` (in chunks) and `evidence.mjs --run --sprint`, judged and applied; specs for CK-46 and CLN-154..157.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `claude/new-session-b5r2am` (`main` = 38d0591a). Sprint 8 is open; the 17 Oct Cook feedback is processed and waits on my answers to its fifteen decisions. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 24 | 71 |
| Cook: pantry | 3 | 12 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 6 / 3 / 12 / 3 / 7 / 5 / 11 | 15 / 14 / 19 / 11 / 19 / 14 / 29 |
| Clinic | 19 | 134 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 9 |
| Art | 5 | 9 |
| Language and audio | 9 | 4 |

---

## What is live (the game on `main`)

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
