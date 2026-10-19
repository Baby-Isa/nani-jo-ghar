# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (19 Oct 2026, 20:45 UK):** Sprint 8's waves are all merged on `claude/new-session-b5r2am` (pushed); `main` = 38d0591a. Sprint 9 ("A day at Nani's", `docs/sprints/S09-a-day-at-nanis.md`) has its frame and mock-ups merged; its art run waits on Zafar agreeing the mock-ups. Nothing running.

**Sprint 8 review (done):** evidence run `ev-20261019-172022-khk` (`build/reports/evidence-ev-20261019-172022-khk.md`), judged and applied: 26 rows proven, 54 FAIL and reopened, 40 not proven (26 sheets miss the moment, 14 tool failures: the tool owner's), 10 Zafar's, 4 decisions. Full gate `s08-gate-close` failed: 508 contract breaks (mostly known: English in the parked modes 167, low-res backgrounds on big screens 162; new: repeated lines 82, mostly tadka; chaat written vs said 27; pop-up headline shrinks 14; level-table rows), 8 clinic runs time out (foot drag, boing L3 lever, fever bottle, cut L2). Load check passes.

**Waiting on Zafar:** five decisions (19 Oct, chat): 1 a short fix round before publishing (spoken English "with"/"tomatoes", sekelo name, fever flip, daal pour, chai labels, plus the gate's repeats, pop-up wrap and clinic time-outs) or publish now; 2 SH-104; 3 SEK-14; 4 CLN-115; 5 CLN-196. Also the Sprint 9 mock-up questions.

**Next steps, in order:**
1. His answers into rows and docs.
2. If yes to 1: the fix round, two builders, each `/brief`ed; then `evidence.mjs --run --rows <the round's rows>`, judge, the gate on the touched flows, `/publish` on his go.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `claude/new-session-b5r2am` (`main` = 38d0591a). Sprint 8 is reviewed and waits on my five decisions. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 25 | 71 |
| Cook: pantry | 2 | 12 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 6 / 2 / 13 / 3 / 4 / 5 / 10 | 15 / 14 / 19 / 11 / 19 / 14 / 29 |
| Clinic | 48 | 133 |
| First launch and shell | 0 | 2 |
| Other modes | 2 | 9 |
| Art | 7 | 9 |
| Language and audio | 9 | 4 |

---

## What is live (the game on `main`)

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
