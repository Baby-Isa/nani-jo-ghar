# s09-frame

Branch `worktree-agent-a419e42d754ae6d7d`, commit `dcddc149`. Sandbox run `s09-frame-q3`. Game code changed: new files only (js/day/**, js/shared/window-ride.js, day.html, lab/day.html, css/day.css, data/day.json); no existing mechanic touched.

## Flaws first (builder's own list; the judge decides)
1. All art is placeholder: flat SVG house, ground and sky; the dog, bird, doors and tree are crude shapes. Only Nani, goat, hen and the Cook and clinic props are real art. Everything sits behind data paths (`data/day.json`), ready for the mock-up lane's look.
2. Most door lines are grey "to record": the weather sentences, "sunny", "cloud", "star", the day lines (cook, clinic, farm, market), goodnight and see-you-tomorrow. The engine can say: *warsaad*, *Ach!*, *Tu muke randhan lai madad kar de.*, *Hal mu saathe.*, *Ha!*, *Nar!*, *Gadi ke ubhi rakh!*, *X kida ai?*, *bakri/murgi/kutro/chakli*, *laal/lilo darwajo*, *saware* (a draft). The tree (n.the-tree) is still to record, so it is never named and only passes by as scenery. Almost every line is silent: there are no family clips for these words yet (the sound gap list).
3. The real Cook and clinic days write no day log. Only `round` lines, and only in story play with an arc. So the book reads words met today plus any log entries; the lab shows it with in-memory day logs.
4. Cook and the clinic have no way back to the evening. The book shows when day.html is reopened (`story.today.at = "activity"`). Spoken English on days 1-2 is not built.
5. Two files outside my list: `build/gen_labs.mjs` (labs.html is generated) and a new `build/tools/review/leak-configs/day.json`, which a unit test requires for every js/ mode folder.
6. A spot check of `cook:chop` shows contract-30 failing on "hakro dungri". This is not from this work: it looks like the 19 Oct "one is never written" change. Over to wave 2A or the orchestrator.

## What was built
- **The door** (`js/day/door.js`, `sky.js`): the same house every day, with the weather's sky above the horizon (gradient, sun, moon, clouds), a light tint for each weather, sun-shadows only when sunny, rain and stars drawn in code. Nani's lines come in turn on the voice queue, each with its English underneath (`data-door-en`), plus the thought bubble and the shared Ha! pill. Then the day goes on: Cook, the clinic, or a trip (the window ride, then the book).
- **The book** (`book.js`): the night scene, then pictures with the engine's Kutchi said one after another, gold progress dots, goodnight, and tomorrow's sky in a doorway.
- **The window ride** (`js/shared/window-ride.js` plus `js/day/window.js`): the shared frame, guide, order card and request pop-up. One group of look-alikes passes at a time, then "Where is the X?" (an engine sentence); the shared glow comes after 5 s or a wrong tap, a missed group comes round once more, and the stop-the-car beat happens.
- **Checks**: contract-45 (the door's lines come in turn) and contract-46 (English only under the door's Kutchi), in `build/sandbox/lib/contract-day.mjs`. Flows `day:door`, `day:book`, `day:window`. Leak bot `build/leak_window_ride.mjs`. Tests `build/test_shared_window_ride.mjs`, `build/test_shared_day.mjs`, `build/sandbox/contract-day.test.mjs`.

**Red then green:** contract-45 and 46 failed on fixtures first, then passed. They also failed live on a deliberately broken build (lines not awaited: 8 breaks, run `s09-frame-red45`; English shown in the book: 7 breaks, run `s09-frame-red46`), and are 0 on this build. The leak bot catches a planted leak where the named thing always comes first. Fair play wins 100% at L1 to L3; blind players win at most 6.5% (L1 random), with tap-all 5.9% and wait 0%. Filmstrip: `build/screenshots/s09-frame/window-filmstrip.png`.

## Proof (from the run; do not retype)
- **Pages run:** 9 (flow x size): 3 flows at 1024x768, 1366x768, 844x390. 9 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 54 of 54 states, in `build/screenshots/sandbox/s09-frame-q3` (not committed, B19). Contact sheets: `build/screenshots/sandbox/s09-frame-q3/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (0 known, 0 fixed). Findings in the run: 0 (none).
- **Sound:** 18 lines with no family clip, 1 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/s09-frame-q3 vs build/tools/review/approved-shots.json: 94 shots, 0 changed, 94 new, 0 gone, 0 identical
- **Word checks (report-only):**
  - A  string literals typed in game code: 39 (0 Kutchi, 39 English); 246 single words that may be ids
  - B  English that a child may see: 39 English literals + 32 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (14 places)
  - D  lines with no family recording: 36 distinct words with no clip in 4081 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: day:book, day:door, day:window · reviewer: <someone other than the builder> · commit: dcddc149
Auto: layout lint ✅ · contract (incl. 45, 46) ✅ 0 breaks over 9 pages · checks.mjs ✅ (unit 400/400, words, static, leak 18, bump, specs, docs, size) · loadcheck ✅ 29/29 · leak_window_ride ✅ · (vessel/hotspot/onboard scripts: Cook/clinic only, not applicable)
Screens (builder's notes, flaws first):
- door @ 1024x768: the sun is cut at the left edge (the scene now shrinks to keep Nani, the door and the bubble)
- door @ 844x390: only the current and previous line show (by design on phones); the thought bubble is near the top edge
- window @ all: placeholder dog and bird; a member can leave by the window's left edge while the next group comes in
- book @ 844x390: the Kutchi word is small on a big page (L-big 30 px token)
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 0 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| day:book | 1024x768 | 6 | 0 | sheets/day-book__1024x768.png |
| day:book | 1366x768 | 6 | 0 | sheets/day-book__1366x768.png |
| day:book | 844x390 | 6 | 0 | sheets/day-book__844x390.png |
| day:door | 1024x768 | 6 | 0 | sheets/day-door__1024x768.png |
| day:door | 1366x768 | 6 | 0 | sheets/day-door__1366x768.png |
| day:door | 844x390 | 6 | 0 | sheets/day-door__844x390.png |
| day:window | 1024x768 | 6 | 0 | sheets/day-window__1024x768.png |
| day:window | 1366x768 | 6 | 0 | sheets/day-window__1366x768.png |
| day:window | 844x390 | 6 | 0 | sheets/day-window__844x390.png |

### Regression rows to recheck (0; open, reopened and built-not-re-played rows; fixed rows are not listed)
- (none found for these flows)

## Left open
- Mum: the lines in flaw 2, plus family clips for every engine word used.
- Zafar: spoken English on days 1-2 (the research report's decision 4); whether the window card should list the things before the ride (as now, the clinic's pattern); a way back from Cook or the clinic to the evening.
- Art: the house, ground, skies, window frame, dog, bird, doors, tree and the book (the s09 mock-ups, then a ChatGPT run).
- Orchestrator: baseline the 9 new pages (`--update-baseline --append`). The shared hooks changed (contract.mjs, contract-hook.mjs texts, sound.mjs Day.say), so `/review` should rerun the contract route.
