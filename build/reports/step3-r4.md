# Step 3, R4 "Cook onto the new framework"

Branch `ccr-fcd9dddd-wnywzc`. No mechanic, station, level or line changed: R2's seam test (9,520 lines) still passes word for word.

## What moved
- **Core:** no stars, star pay, receipts, rules panel, `star_sets` or tips; no wage. `Score.finish` scores and pays every order and lab round (labs pay, per the 1 Oct evening decision). Prices come from `economy.json`; the purse is the core wallet. The save goes through `js/core/save.js` (classic tag gone, old keys kept), and `round.play` is passed.
- **Modules:** `cook.html` loads as ES modules with the import map (`js/cook/boot.js`).
- **Plug-in:** `js/cook/main.js`. The 10 stations, 6 recipes, the pantry and one customer are host mini-games, run as adapters over `cook.html?hosted=1`. Story plays the pantry first, then the order; free play is the endless open kitchen. `labs.html` gains 24 links and loses none.
- **Kit:** shared Done/Next and tally. Title, day's end, shop, book and close-kitchen are picture-only, with the English behind a grown-ups' "?". SH-02: the review uses the order's forms. Decision 21: guessed he-forms are dotted "to check" (test site only).
- **Take-back:** `#takeback` flows. Chaat, assemble and sekelo take back and finish; the other 9 stations offer none (E14 gap).

## Still on shims
- Bulb: `Bulb.cookShim`.
- Word stages: Cook's own records; core Progress follows them.
- Voice: the core's only on the store path.
- Stations: iframe adapters.
- Cook's own title, days and shop.
- Legacy star helpers in `ui.js`, kept for Find it, Dress up and Snap.

## Checks
- Unit tests: core 42, host 40 of 41 (labs stale after R5's `main.js`), `test_cook_lang` 1.
- `leak_cook` ok (tick 0/1229, cards 0%); `test_cook_host` all ok; CSS lint 416 → 416.
- Sandbox `--touched cook:,mode:`, 260 pages: every Cook flow ends (four reruns pass, `r4-re1`).
- 94 findings show as new. An A/B on the pre-R4 commit gives the same findings, so they come from R3a's shared layout, not R4. That includes the `mode:snap` hang.
- Mine: shop buttons below the fold on 800×360 phones, and the grown-ups' pop lengthening the title's shop.
- Baseline shrunk from 6,601 to 3,542 findings.

## Regression rows
- **Fixed:** SH-02, CMP-12, SH-23 and LNG-01 (Cook).
- **Rechecked OK:** SH-08, SH-10, SH-26, SH-32, PAN-05, LNG-02.
- **Code untouched:** SH-11, SH-13, SH-20, PAN-04, PAN-07, PAN-08, CHAI-06.
- **Open:** SH-34, SH-35, MAA-08, CK-01.

## Tablets
- Measured per-view safe areas grew items by 8–13% (`r4-tab` vs `r3a-1`, `cook-chai-tray/1024x768`).
- They are reverted: they put the pantry's milk off screen and a shelf chip under the Done tick (`r4-final`).
- `data/scenes/cook-views.json` is wired but empty. Each station needs a 4:3 layout first.

## Proposals (shared)
1. Results: flag `toCheck` words.
2. Host: keep a screen-own stage under the end screen (it shows over a blank page today).
3. `birthday.json`: make Cook's errand "playable".
4. `economy.json`: upgrade bonus coins.
5. Tablet sidebar space: the tally or a second card.
6. R3a: fix the sidebar overflow at 844×390 and 1180×820.

## For Zafar
- Cook's title, day's end and shop are picture-only now.
- Take-back works in only 3 of 12 Cook flows.
- Tablets are not yet bigger.
