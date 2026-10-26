# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (23 Oct 2026, evening UK; paused, Zafar out of tokens for the week):** Sprint 11 is live on `main`. Sprint 12 "Polish" (`docs/sprints/S12-polish.md`) runs on `claude/exciting-pasteur-usf3d2`:
- **Wave 1 merged, judged and green** (the shared help kit and chai; the door, the ride, labs). checks.mjs and 522 unit tests pass.
- **Wave 2 stopped mid-round, saved, not judged and not merged:** `claude/s12-w2a-wip` (shared UI: the end screen's third page off by one switch, replies with speakers and one tap, word cards, slower talking faces, the new face circles; its last fix round was half done: the circles' one crop, word size, the door kit patch) and `claude/s12-w2b-wip` (the eye test: the doctor's start, drops before the word, the mic; partway). W2-A's first judge: PASS SH-125, SH-126, ART-19, EASY-08; FAIL SH-123 (words too small, a learned word shows English), ART-08 (head sizes differ, the badge covers an ear); SH-124's bounce not captured.
- **Wave 3 not started:** the book (with spaced words and Say it), loading, the served moment, the pour (mirrored pan, spout-first) and the door's sun, farm and come-here art.
- The s12 art is judged and in `sources/art/s12/`; Zafar passed the likenesses. Next art block: FC2 (moods and mouths for the circles).
- Answers and research: `build/reports/s12-answers.md`, `s12-research-cefr-and-book.md`, `s12-research-a1-to-native.md`. Zafar likes the talking day, the story library, and describe and deduce (`docs/ideas.md` 61-65).

**Next steps:**
1. Resume wave 2 from the two wip branches (same briefs `build/tools/ops/specs/s12-w2a.json`, `s12-w2b.json`): finish W2-A's fix round, judge, merge; finish W2-B, judge, merge.
2. Publish option: wave 1 alone can go to `main` after `/review` and Zafar's OK (it is merged and green).
3. Wave 3, then `/review`, publish on his OK, his play, `/feedback`.
4. Zafar records at Masi's from `docs/language/recording-sheet.md`.

**Next sprint (S13): "One shared kit", planned in `docs/sprints/S13-one-shared-kit.md`** (agreed with Zafar 23 Oct; written 26 Oct). It starts with a Fable review of what should be central and how (checked against best practice), plus what else speeds development, cuts tokens and makes fixes work first time; then two builders move every game onto the kit.

**Open questions to Zafar:** none.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only. Sprint 12 is paused mid wave 2; carry on from "Next steps". Tell me before launching anything new.

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
