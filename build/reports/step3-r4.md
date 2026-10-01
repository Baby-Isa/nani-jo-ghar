# Step 3, R4 "Cook onto the new framework"

Branch `ccr-fcd9dddd-wnywzc`. No mechanic, station, level or line changed: R2's seam test (9,520 lines) still passes word for word.

## What moved
- **Core:** no stars (pay, receipts, rules panel, `star_sets`, tips, card cut-outs); no wage. `Score.finish` scores and pays every order and Station-lab round (lab pays, 1 Oct evening); prices from `economy.json`; the purse is the core wallet (coins only go down when buying). Save through `js/core/save.js`: the classic tag is gone and old keys are kept. `round.play` is passed.
- **Modules:** `cook.html` loads as ES modules with the import map (`js/cook/boot.js` first).
- **Plug-in:** `js/cook/main.js`. The 10 stations, 6 recipes, pantry and one-customer order are host mini-games (adapters over `cook.html?hosted=1`). Story = pantry first, then the recipe's order. Free = open kitchen, endless. `labs.html` regenerated: 24 links added, none lost.
- **Kit:** shared Done/Next and tally. Title, day's end, shop, recipe book and the open kitchen's close button are now pictures, with the English behind a grown-ups' "?" (E1). The shop hides a buy button until it can be pressed (F22). SH-02: the end review shows the forms the order used. Decision 21: a guessed he-form is marked `check` and dotted on the test site.
- **Scale:** per-view safe areas in Cook's scene data (`data/scenes/cook-views.json`, measured by `build/measure_cook_views.mjs`): the marble worktop (six stations) grows about 8% on tablets (1024×768: 0.48 → 0.519); the pantry keeps the whole box (its fridge reaches the edge).
- **Take-back:** `#takeback` flows (12). Chaat and sekelo take back and finish. The other 10 offer no take-back (E14 gap, listed below).

## Still on shims
Bulb (`Bulb.cookShim`). Word stages (Cook's records, core Progress follows them). Voice: core only on the store path; the test site keeps Cook's own player (R2 parity). Stations run as iframe adapters. Cook's own title/days/shop. Legacy star helpers in `ui.js` for Find it, Dress up and Snap.

## Checks
Unit: core 42, host 41 (labs stale: R5's new `js/clinic/main.js`), `test_cook_lang` 1. `leak_cook` ok (tick 0/1229, cards 0%). `test_cook_host` all ok. CSS lint 416 → 416. Sandbox: RESULT.

## Regression rows
Fixed: SH-02, CMP-12, SH-23 (Cook), LNG-01 (Cook's screens). Rechecked OK: SH-10 (leak bot), SH-26, SH-32, PAN-05, LNG-02, SH-08 (seam). Unchanged code, not re-played: SH-11, SH-13, SH-20, PAN-04, PAN-07, PAN-08, CHAI-06. Still open: SH-34, SH-35, MAA-08 (stations not laid out for 4:3), CK-01.

## Tablets
Before: `build/screenshots/sandbox/r3a-1/cook-chai-tray/1024x768/`. After: `build/screenshots/sandbox/r4-tab/cook-chai-tray/1024x768/` (play items +8%; run r4-tab used a narrower area, +13%, later widened for safety). An empty worktop band still sits above the hob: each station's shelf needs a 4:3 layout (two rows or a narrower pitch).

## Proposals (shared)
1. Results: show `toCheck` words with a "to check" flag.
2. Host: keep a screen-own stage's frame under the end screen (today it ends over a blank page, F12).
3. `data/arcs/birthday.json`: Cook's errand → "playable".
4. `economy.json`: upgrade bonus coins (basket, thali, bigspoon: kept in `cook.json` and earned through the wallet).
5. Sidebar on tablets: the space under the card could hold the tally or a second person's card.

## For Zafar
Title, day's end and shop are now pictures-only; settings and the Station lab are behind "?". Take-back exists in only 2 of 12 Cook flows.
