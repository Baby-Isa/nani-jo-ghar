# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (21 Oct 2026, 06:00 UK):** Sprint 8 is finished and pushed on `claude/new-session-b5r2am`: every 17-18 Oct code fix, the s08c art (7A, 7B), the chicken (murgi, English placeholder until Mum records it), and waves 8A/8B's fixes from the pre-publish evidence. Proof: checks.mjs all green (load included); the joint 8-size contract replay `s08-final-joint` (22 Cook, clinic and house flows) 0 breaks over 177 pages; evidence runs ev-20261020-203453-9h9 and ev-20261021-031423-a9z judged and applied (178 rows on the fix list). Main's image uploads are merged in. **Not yet live:** the publish (`publish.mjs --go --force`, Zafar's word, 21 Oct) was refused by the session's permission check; it needs Zafar to run or allow it.

**The publish gate's three blockers** (why `--force`): 91 open rows with no "waiting on" note; the last full gate run (a2bb1c9c, before this sprint's fixes) had 772 breaks; game files changed since it (mostly main's image uploads). A full `run.mjs --gate` before the next publish clears the second and third.

**Next steps:** 1. publish (below). 2. Zafar plays; his notes → `/feedback`. 3. Sprint 9 runs in its own chat.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only. Branch `claude/new-session-b5r2am` holds Sprint 8, ready to publish. Run `node build/tools/ops/publish.mjs --go --force --log` (my word: publish Sprint 8), confirm it is live, and give me the play link.

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
