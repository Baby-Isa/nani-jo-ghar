# Step 3, R4 "Cook onto the new framework"

Branch `ccr-fcd9dddd-wnywzc`. No mechanic or line changed (R2's seam test passes).

## What moved
- **Core:** no stars, receipts or wage; `Score.finish` scores and pays every round (labs too); prices from `economy.json`; one core wallet; save via `js/core/save.js` (old keys kept); `round.play` passed.
- **Modules:** `cook.html` uses ES modules and the import map.
- **Plug-in:** `js/cook/main.js`. Stations, recipes, pantry and one customer are host mini-games (adapters). Story: pantry, then the order; free: endless. `labs.html` +24 links, none lost.
- **Kit:** shared Done/Next and tally. Title, day's end, shop and book are picture-only, English behind a grown-ups' "?". SH-02 fixed. Decision 21: guessed he-forms dotted "to check".
- **Take-back:** `#takeback` flows; only chaat, assemble and sekelo offer one (E14 gap).

## Still on shims
- Bulb: `Bulb.cookShim`.
- Word stages: Cook's own records; core Progress follows them.
- Voice: the core's only on the store path.
- Stations: iframe adapters.
- Cook's own title, days and shop.
- Legacy star helpers in `ui.js`, kept for Find it, Dress up and Snap.

## Checks
- Unit: core 42, host 40/41 (labs stale: R5). `leak_cook`, `test_cook_host` ok. CSS lint unchanged.
- Sandbox, 260 pages: every Cook flow ends. 94 new findings; a pre-R4 A/B shows the same ones, so they are R3a's (incl. the `mode:snap` hang).
- Mine: shop buttons below the fold on 800×360. Baseline 6,601 → 3,542.

## Regression rows
- **Fixed:** SH-02, CMP-12, SH-23 and LNG-01 (Cook).
- **Rechecked OK:** SH-08, SH-10, SH-26, SH-32, PAN-05, LNG-02.
- **Code untouched:** SH-11, SH-13, SH-20, PAN-04, PAN-07, PAN-08, CHAI-06.
- **Open:** SH-34, SH-35, MAA-08, CK-01.

## Tablets
Per-view safe areas grew items 8–13% (`r4-tab` vs `r3a-1`, chai tray 1024×768) but hid the fridge's milk and a chip under Done, so they are reverted; `data/scenes/cook-views.json` is wired, empty. Stations need 4:3 layouts.

## Proposals (shared)
1. Results: flag `toCheck` words.
2. Host: keep a screen-own stage under the end screen (it shows over a blank page today).
3. `birthday.json`: make Cook's errand "playable".
4. `economy.json`: upgrade bonus coins.
5. Tablet sidebar space: the tally or a second card.
6. R3a: fix the sidebar overflow at 844×390 and 1180×820.

## For Zafar
Title, day's end and shop are picture-only; take-back is in 3 of 12 flows; tablets not yet bigger.
