# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (20 Oct 2026, 03:00 UK):** Sprint 8's fix round (waves 6A-6H) is merged and pushed on `claude/new-session-b5r2am`; `main` = 38d0591a. Checks all green. Running: the final evidence run over the sprint's rows (`evidence.mjs --run --sprint --since 38d0591a`), then the full gate `s08-gate-final`; then judge agents per batch, `--collect`, `--apply`, and ask Zafar before `/publish`.

**Done this round:** spoken English out of the orders (joins dropped where Mum has no Kutchi; tomato asked singly until the plural is known); each line said once; pop-up wraps first; clinic stuck runs fixed; the wrong colour clip (a late line) fixed with a test over every heal game; the parked modes write no English; art that had landed is wired (potato, whole lemon, drop machine, level plasters, Nani's talking and blinking faces); evidence specs reach every moment. Reports `build/reports/s08-w6*.md`.

**Art:** Sprint 9 style test `s09a` (10 images) is with Zafar (Chrome block; references from his ChatGPT chat "Nani jo Ghar s09a references", Nani = `sources/art/s08/sheet-nani-final-1.png`; the old Nani archived to `sources/archive/nani-pre-s08`). Sprint 8 fix run `s08c` (28 images) is planned (`docs/design-language/art-plans/s08c-art-plan.md`), after s09a.

**Waiting on Zafar:** the tomato plural (*ba tameto* or *ba tameta*); the five s08c decisions (sekelo trays, the kadchi, sekelo decoys, the chai pour, pantry stickers); SH-112's shelf band (about 30% vs 26%); boing's tool column (two or four colours); the s09a images with his notes; then /publish.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `claude/new-session-b5r2am` (`main` = 38d0591a). Sprint 8's fixes are merged; finish the evidence judging and the gate, then ask me before publishing. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 25 | 71 |
| Cook: pantry | 2 | 12 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 5 / 2 / 9 / 2 / 4 / 5 / 5 | 16 / 14 / 23 / 12 / 19 / 14 / 34 |
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
