# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (16 Oct 2026, 22:20 UK):** Sprint 7 "Art, clinic first" closed (`docs/sprints/S07-art-clinic-first.md`). Published to `main` 16 Oct 22:17 UK (38d0591a, stamp 20261016T211414Z), past the publish gate on Zafar's word. Branch `claude/new-session-b5r2am` = `main`. Nothing running.

**Live now:** the cartoony grandad everywhere in the clinic, turned to the girl while he examines, both set back on one floor with contact shadows (`build/reports/s08-placement-*.md`, `s08-rejudge*.md`); Nani's jaw-fixed new look everywhere outside the clinic, the family seated on stools behind the counter (CK-46, `s08-nani-ground.md`); the clinic items and the top-view chai pan (`s08-clinic-items.md`, `s08-nani-stitch.md`).

**Gate skipped at this publish** (Zafar, 16 Oct): no full contract run since 14 Oct, no evidence rerun after CK-46. The chunked gate (`s08-gate.md`, 574 pages) found no new break. Run both early in Sprint 8.

**Sprint 8 is open** (`docs/sprints/S08-play-feedback-final.md`): Zafar plays Cook and the clinic and sends feedback; we make both modes close to final with one big art run; Kutchi may lag.

**Next steps, in order:**
1. Wait for Zafar's play feedback; `/feedback` on it (fix-list rows the same day).
2. Agree the Sprint 8 budget with him; plan the big art run (`/art-run`, Fable plans, about $15-25), carrying the Sprint 7 art leftovers in the sprint file.
3. Early: `sandbox/run.mjs --gate` (in chunks, PNGs deleted as judged) and `evidence.mjs --run --sprint`, judged and applied; specs for CK-46 and CLN-154..157 so they can be marked built.

**Open questions to Zafar:** `docs/questions.md` (new: the Cook "Thank you!" pill, for Mum).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `claude/new-session-b5r2am` (= `main`, 38d0591a). Sprint 8 is open and waits on my play feedback for Cook and the clinic, which I'll send next. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 5 | 73 |
| Cook: pantry | 1 | 14 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 1 / 0 / 4 / 0 / 0 / 1 / 7 | 16 / 14 / 19 / 11 / 19 / 15 / 30 |
| Clinic | 19 | 134 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 9 |
| Art | 5 | 9 |
| Language and audio | 7 | 5 |

---

## What is live (the game on `main`)

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
