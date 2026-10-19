# s09-frame

Branch `worktree-agent-a419e42d754ae6d7d`, commit `4f405a43`. Sandbox run `s09-frame-q3`. Game code: new files only; no existing mechanic touched.

## Flaws first (builder's list; the judge decides)
| # | flaw |
|---|---|
| 1 | All art is placeholder (flat SVG house, ground and skies; crude dog, bird, doors and tree). Only Nani, the goat, the hen and the Cook and clinic props are real. Every picture is a path in `data/day.json` |
| 2 | Lines still to record (grey): "the sun's out", the three "today it's ..." lines, cloud, stars, "I want to cook today", "today we help at the clinic", the farm and market lines, goodnight, "see you tomorrow" (*saware* stands in), the tree (never named, only passes as scenery), bandage. The engine says *warsaad*, *Ach!*, *Tu muke randhan lai madad kar de.*, *Hal mu saathe.*, *Ha!*, *Nar!*, *Gadi ke ubhi rakh!*, *Bakri/Murgi/Kutro kida ai?*, *laal/lilo darwajo*. Nearly all are silent: no family clips for these words yet |
| 3 | Cook and the clinic write no day log (only `round`, only in story play with an arc). The book reads words met today plus the log; the lab uses in-memory logs |
| 4 | No way back from Cook or the clinic: the book shows when day.html is reopened. Spoken English on days 1-2 is not built |
| 5 | Two files outside my list: `build/gen_labs.mjs` (labs.html is generated) and a new `build/tools/review/leak-configs/day.json` (a unit test needs one for every js/ mode folder) |
| 6 | Not mine: in a spot check, `cook:chop` breaks contract-30 on "hakro dungri" (likely the 19 Oct "one is never written" change) |

## What was built
| piece | files |
|---|---|
| Door: fixed house, weather sky above the horizon, a light tint per weather, sun-shadows only when sunny, rain and stars drawn in code; lines in turn with the English beneath; thought bubble; shared Ha! pill; hand-off to Cook or the clinic, or a trip goes on to the ride, then the book | `js/day/door.js`, `sky.js`, `day.js`, `day.html`, `css/day.css` |
| Book: night scene, picture plus Kutchi said in turn, gold progress dots, goodnight, tomorrow's sky in a doorway | `js/day/book.js` |
| Window ride: one look-alike group at a time, the engine's "X kida ai?", glow after 5 s or a wrong tap, a missed group comes round once, stop-the-car beat; shared frame, guide, card and pop-up | `js/shared/window-ride.js`, `js/day/window.js` |
| Lab and its tile | `lab/day.html`, `build/gen_labs.mjs`, `labs.html` |
| Checks: contract-45 (door lines in turn) and contract-46 (English only under the door's Kutchi); flows `day:door`, `day:book`, `day:window`; leak bot; tests | `build/sandbox/lib/contract-day.mjs`, `flows/day.mjs`, `build/leak_window_ride.mjs`, `build/test_shared_window_ride.mjs`, `build/test_shared_day.mjs`, `build/sandbox/contract-day.test.mjs` |

| red then green | red | green |
|---|---|---|
| contract-45 | fixtures failing; live run `s09-frame-red45` (lines not awaited): 8 breaks | 0 |
| contract-46 | fixtures failing; live run `s09-frame-red46` (English in the book): 7 breaks | 0 |
| window leak bot | planted leak caught | fair 100% at L1-L3; blind at most 6.5% (L1 random), tap-all 5.9%, wait 0% |

Filmstrip: `build/screenshots/s09-frame/window-filmstrip.png`.

## Proof (from the run; do not retype)
- **Pages run:** 9 (flow x size): 3 flows at 1024x768, 1366x768, 844x390. 9 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 54 of 54 states, in `build/screenshots/sandbox/s09-frame-q3` (not committed, B19). Contact sheets: `build/screenshots/sandbox/s09-frame-q3/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (0 known, 0 fixed). Findings in the run: 0 (none).
- **Sound:** 18 lines with no family clip, 1 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/s09-frame-q3 vs build/tools/review/approved-shots.json: 94 shots, 0 changed, 94 new, 0 gone, 0 identical
- **Word checks:** js/day has 0 typed literals (`words.mjs --only a --dirs js/day`).

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: day:book, day:door, day:window · reviewer: <someone other than the builder> · commit: 4f405a43
Auto: layout lint ✅ · contract (incl. 45, 46) ✅ 0 breaks over 9 pages · checks.mjs ✅ (unit 400/400, words, static, leak 18, bump, specs, docs, size) · loadcheck ✅ 29/29 · leak_window_ride ✅
Screens (builder's notes, flaws first):
- door @ 1024x768: sun cut at the left edge (the scene shrinks to keep Nani, the door and the bubble)
- door @ 844x390: only the current and previous lines show (by design); the bubble sits near the top edge
- window @ all: placeholder dog and bird
- book @ 844x390: the Kutchi word is small on a big page (30 px token)
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (for the judge)
Regressions rechecked: 0 rows for the day flows
```

### Screens to look at
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| day:book | 1024x768 / 1366x768 / 844x390 | 6 each | 0 | sheets/day-book__<size>.png |
| day:door | 1024x768 / 1366x768 / 844x390 | 6 each | 0 | sheets/day-door__<size>.png |
| day:window | 1024x768 / 1366x768 / 844x390 | 6 each | 0 | sheets/day-window__<size>.png |

## Left open
| who | what |
|---|---|
| Mum | the lines in flaw 2; family clips for every engine word used |
| Zafar | spoken English on days 1-2; whether the window card lists the things before the ride (now it does, as in the clinic); a way back to the evening |
| Art | house, ground, skies, window frame, dog, bird, doors, tree, the book |
| Orchestrator | baseline the 9 new pages (`--update-baseline --append`); the shared hooks changed (contract.mjs, contract-hook texts, sound.mjs Day.say), so rerun the contract route in `/review` |
