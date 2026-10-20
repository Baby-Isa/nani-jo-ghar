# s09-book

Branch `worktree-agent-ac393bafc43718726` (not pushed: in-chat run, non-negotiable 14). Sandbox run `s09-book-matrix4`; evidence runs `s09-book-red` / `s09-book-red8` (old book) and `s09-book-green4`. Game code changed: the evening book only (`js/day/book*.js`, `css/day.css`, `data/day-book.json`); door and ride untouched.

## Flaws first (builder's list; the judge decides)
| # | flaw |
|---|---|
| 1 | All game art is placeholder: farm field and kitchen backdrops, dog, bird, door and car are flat shapes; goat, hen and Cook props are real. Paths in `data/day-book.json` |
| 2 | The camera never upscales the 1536 px room past 1.45x (ART-05, contract-11): on a laptop the "face" shot is head, shoulders and book, not a tight face. A sharper b1 (s09b) brings it in by itself |
| 3 | Lines still to record (grey, silent): "What did we do today?", "Goodnight!", "See you tomorrow!" (*saware* stands in). Engine stand-ins for Zafar's sentences: "There's the goat" → *Huda!*; "Then we saw a big goat" → *Ne poi wadhi bakri.*; "Nana wanted chai" → *Inke chai khape.*; "We went by car" → *Pa gadi me aayo.* No family clips yet for bakri, murgi, kutro, chakli, gadi, darwajo, chai, dudh, khun |
| 4 | BOOK-01 probe 1 is a tool failure: `at: page:start` fires on the blank tab (navigation). My filmstrips instead: `build/screenshots/s09-book/BOOK-01-in.png`, `BOOK-01-out.png` (speed 1) |
| 5 | Name it: a tap chooses at once (it says its word as it flies or wobbles); no listen-first |
| 6 | Cook and the clinic still write no day log, so a real kitchen or clinic evening falls back to that place's own things |

## What was built
| piece | files |
|---|---|
| Room (b1) and camera: greet, ease to her face, tilt to the book, dissolve to the pages (b2 cut), page-turn curl, zoom back out, the room soft behind the book | `js/day/book.js`, `css/day.css`, `assets/day/book/` |
| Find it, name it, stick in the photo (drag, take back until the page turns), our day; shared pill row, 64 px buttons, face replay on the page corner | `js/day/book-play.js` |
| Planner with the leak rules; places, lines, lab logs incl. the farm day | `js/day/book-games.js`, `data/day-book.json` |
| End: gold word cards, a day-book on the shelf per day (`story.dayBooks`), goodnight, tomorrow's sky | `js/day/book.js` |
| Drivers find, find-wrong, nameit, photo, ourday, farm; moments | `build/sandbox/flows/day.mjs`, `lib/moments.mjs` |
| Leak bot, unit tests | `build/leak_book.mjs`, `build/test_day_book.mjs` |

## Play it
- `day.html?stage=book&log=farm` (the whole farm evening) · `day.html?stage=book&log=kitchen`
- `day.html?stage=book&game=find` · `&game=nameit` (`&log=kitchen` for chai) · `&game=photo` · `&game=ourday`
- Add `&seed=7` for the same book twice. Mouse and touch both play (taps on buttons; photos drag on pointer events).

## Proof
| row | red (old book) | green (`s09-book-green4`) |
|---|---|---|
| BOOK-01 | tool failure | probe 1 tool failure (spec, flaw 4); filmstrips above |
| BOOK-02 | tool failure | machine PASS (buttons ≥ 64, no clip; pages 322 and 332 px wide at 844x390) |
| BOOK-03..06 | tool failure (no games) | sheets for the judge |
| BOOK-07 | a sheet of the old end (progress dots, no cards, no shelf) | sheet for the judge |
| BOOK-08 | tool failure (no bot) | PASS: blind best 29.4% find (chance 29.2), 33.9% name it, 34.0% photo (33.3); fair 100%; `--plant` caught |

- **Pages run:** 8 (day:book at all eight sizes). 8 reach their end, 0 page errors. **Contract: 0 breaks** (earlier contract-3 and contract-11 breaks fixed: one stage for the evening; camera capped).
- **Layout lint:** 0 findings. **Shotdiff:** 305 new, 0 changed (new flow).
- **checks.mjs:** all ok (unit 461, words, static, leak, bump, specs, docs, recordings, size, load 29/29; `cook:chop` load flaked once in an earlier run).
- **Regressions:** 0 rows for day:book (touched.mjs widens to every flow only because sandbox files changed).

## Requests (not my files)
| who | what |
|---|---|
| Orchestrator, `evidence.json` | BOOK-01 p1 `at` → `host:day/book/room`; p2 → `visible:.day-zoom-out` (the way out; `.day-tomorrow` comes after it). BOOK-04 `!hasWord:name` only sees proper names |
| `checks.mjs` / leak configs | run `build/test_day_book.mjs` (only `test_shared_*` run) and `build/leak_book.mjs` |
| lab/day.html | a tile per book game (links above) |
| s09b art | sharper b1 or a face close-up; field and kitchen spreads; dog, bird, door, car sprites |

## QA checklist results
```
QA: day:book · reviewer: <judge> · commit: <final>
Auto: layout lint ✅ · contract 0 breaks ✅ · leak_book ✅ · test_day_book ✅ · checks.mjs ✅
Screens (builder's notes, flaws first): flaws 1-3; "turn-N-2" states are a duplicate shot of the same corner
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (for the judge)
Regressions rechecked: 0 rows for day:book
```
