# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (21 Oct 2026, 05:00 UK), Sprint 9's chat:** Sprint 9 ("A day at Nani's") is built, merged and judged on `claude/funny-maxwell-3dkhif`, which sits on Sprint 8's branch; `main` = 700b1023 (Sprint 8 not yet published: its chat was on wave 8B). Reports: `build/reports/s09-ride.md`, `s09-book.md`, `s09-final-door.md`, `s09-final-art.md`. Built: the door on the s09b art (four skies, the empty house, Nani's seven pose cut-outs, the two cards), the window ride (looping layers, gentle parallax, three speeds, the farm road's s09b things, the wide window), the evening book (camera, find it, name it, stick in the photo, our day, gold cards, day-books), and the modular day runner (`data/days.json`: a day is a stage list; the farm day door, ride, book; kitchen and clinic days hand off). Every S09 row has a judge or machine PASS except BOOK-05's wrong-drag and take-back (needs a driver: Sprint 10). Art: s09r and s09b landed and cut (`cut_s09r.py`, `cut_s09b.py`); Nani's s09b likeness approved (Zafar, 21 Oct). Days docs: `docs/game-design/days/` (README, farm, shops, beach, safari, boat).

**Next steps:**
1. Zafar's answer on the red-first question (open question 1); then `evidence.mjs --apply` marks the passing S09 rows built.
2. When Sprint 8 is on `main`: merge `origin/main` into this branch (status.md and overnight-log.md conflict: keep both), `/review` (the full check at 8 sizes), fix, `/publish` (Zafar's go, 21 Oct: "push to main and finish the sprint"), `/sprint` close.
3. Sprint 10, the farm day in full (`docs/game-design/days/farm.md`): pack the bag, meet Hannah Mami, feed, eggs, snap, the corn stall, animals home, Ali's egg; the engines put-it-in-its-place and count-to-a-number; DAY-03 (Cook and the clinic return to the book and write the day log); LNG-18 (the device voice reads every unrecorded line on the test site, every game); BOOK-05's wrong-drag driver. About $150; two builders.

**Open questions to Zafar:**
1. Count "the probe couldn't run because the feature didn't exist yet" as red, so new-feature rows close on their green PASS? (Recommend yes; a small change to `redGreen` in `build/tools/review/lib/evidence.mjs`.)
2. Hannah Mami: her name in the game, picture (a likeness run) and voice.
3. Mum's words: the corn dressings, the shops' directions, the ride's and book's grey lines (the recording sheet).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `claude/funny-maxwell-3dkhif` (Sprint 9, built and judged; `main` = 700b1023, Sprint 8 not yet published). Carry on from "Next steps". Tell me before launching anything new.

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

21 Oct 2026, published 14:06 UK (c2410f7a, 20261021T130210Z): Sprint 8 (the 17-18 Oct fixes, the s08c art, the chicken with an English placeholder, the overnight and sweep fixes), on Zafar's word past the publish gate (`--force`). A second update follows with the last code rows.

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
