# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (21 Oct 2026, 16:50 UK):** Sprint 8 is published twice today (c2410f7a at 14:06, 4c12399b at 16:47); the second carries Sprint 9 too (merged from main). Every open fix-list row has a label (to fix: code / to fix: check / waiting on Zafar / Mum / art / before app store); `checks.mjs` fixlist fails an unlabelled one and `evidence --apply` keeps labels.

**Open, by label:** `grep -c "to fix: code" docs/process/regressions.md` and the like. Still in code: SH-63 (the clinic card at L2 shows step lines, not the order), SH-53 (samosa boxes at L2 not yet filmed; the clinic glow white and off-centre). Waiting on Zafar: DAAR-12 (stir lab L3: the speed as dots?) and his play pass (CK-01). Art: the match-cut knee (CLN-87), the tooth zoom's middle step (CLN-163), the forearm close-up (CLN-43), the barbecue, bowl, jar stickers and daal tip (SEK-20, CHT-04, SH-14, SH-117).

**Process (Zafar, 21 Oct):** a sweep is every "to fix: code" row; each builder runs its own browser and batches proofs; the judge gets Zafar's latest words with the batch.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only. Sprint 8 and Sprint 9 are live (4c12399b). Give me the "waiting on Zafar" rows as a numbered list with recommendations, then sweep the "to fix: code" rows.

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

21 Oct 2026, published 16:47 UK (4c12399b, 20261021T154315Z): Sprint 8's second update on top of Sprint 9 (merged from main): the sweep's fixes, Zafar's five Cook yeses, the guide box, the phone stamp, the sekelo glow; on his word past the publish gate (`--force`).

21 Oct 2026, published 14:06 UK (c2410f7a, 20261021T130210Z): Sprint 8 (the 17-18 Oct fixes, the s08c art, the chicken with an English placeholder, the overnight and sweep fixes), on Zafar's word past the publish gate (`--force`). A second update follows with the last code rows.

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
