# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (20 Oct 2026, afternoon UK):** Sprint 8's fixes are all merged and pushed on `claude/new-session-b5r2am` (waves 6A-6N, the eye and boing follow-ups, the chips rule); `main` = 38d0591a. The final replays at 8 sizes: every flow reaches its end; the only rule breaks left are contract-11 (the Cook backgrounds' low-res on big screens: s08c's marble tile WT1 fixes it once cut and wired) and contract-37 (sekelo decoys: s08c). Checks green. **Waiting on Zafar's go to `/publish`.**

**Art:** s08c landed (`build/reports/s08c-art-landing.md`): 21 pass, a 4-image redo (`s08c-redo-block.txt`), the doctor's three-quarter set and the girl's close-ups wait on his likeness call. s09a redo (house, Nani by the fire, the book from the child's seat, our day) is with him (`s09a-redo-block.txt`).

**Process (Zafar, 20 Oct):** builders replay their flows at 8 sizes before reporting (brief.mjs); the full gate once before a publish; judge FAILs checked against his own words first; evidence on changed rows (`--changed`); two builders a round, each owning its rows' specs.

**Next steps:** 1. his publish go → `/publish`. 2. Cut and wire the passing s08c art (one builder), then the redo. 3. Sprint 9: the door, the ride and the book on the agreed art.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `claude/new-session-b5r2am` (`main` = 38d0591a). Sprint 8 is ready to publish on my go; the s08c art is landed and waits on my likeness call. Tell me before launching anything new.

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
| Language and audio | 10 | 4 |

---

## What is live (the game on `main`)

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
