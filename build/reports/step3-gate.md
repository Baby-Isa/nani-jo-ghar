# Step 3 gate: full sandbox run

**Run id:** `gate-20261005-1208` (branch `ccr-fcd9dddd-wnywzc`). **Ran:** 224 flows, 493 pages (flow x size), every one reached its end, 0 page errors. A container restart stopped it after 130 pages; `--resume` finished it (5 chunks).

**Check verdict: FAILED, 17 new findings.** 0 flows stopped short of their end, 0 new page errors. 1609 baseline findings are fixed. Baseline NOT touched (`--update-baseline` not run). 63 pages are new to the baseline (the `#hint` variants of the clinic heal games etc.); all reached their end, with no findings of their own.

## Prep fixes (done)
- Layout lint `scaleOf()` now multiplies ancestor transforms. The clinic taste L2 "ne laal" 8 px finding is gone from this run. Lint tests 6/6 pass; scaled-down text (20 px at 0.4) still fires.
- `.cl-card { --oc-look-room: 0px }` moved to `css/clinic.css` with its comment.
- `lab/order-card.html` now loads `tokens.css`.

## New findings (all in Cook; none in the clinic)
Screenshots under `build/screenshots/sandbox/gate-20261005-1208/`.

| Screen | Finding | Screenshot |
|---|---|---|
| cook:assemble L3, 800x360 | canvas text "bataato" 13.5 px (under 14) | `cook-assemble-l3/800x360/04-view-marble.png` |
| cook:assemble L2 #mistake, 800x360 | same "bataato", 13.5 px | `cook-assemble-l2-mistake/800x360/08-wrong-tap.png` |
| cook:day6, 800x360 | canvas text "green pepper" 12.8 px in the pantry, English flip | `cook-day6/800x360/13-bulb-english.png` |
| cook:day2, 800x360 | "Salamun alaykum" bubble covers the play area | `cook-day2/800x360/03-kind-click.png` |
| cook:day6, 800x360 | same bubble | `cook-day6/800x360/04-kind-click.png` |
| cook:open-kitchen, 1024x768 and 800x360 | same bubble | `cook-open-kitchen/<size>/04-kind-click.png` |
| css, static | 9 spacing-grid findings on `#count-badge`, `#go-btn` gap (css/cook.css) | none (static CSS) |

Fixed count: 1609. Game code was not changed.

## Contact sheets
- Clinic heal games: `build/screenshots/sandbox/gate-20261005-1208/sheets/clinic-heal-*__<size>.png` (114 sheets for the heal games at the 1024x768 and 800x360 sizes, plus the other sizes).
- Cook: `.../sheets/cook-*__<size>.png` (e.g. `cook-assemble__1024x768.png`, `cook-assemble-l3__800x360.png`).
- Summary: `.../summary.md`; sound gaps: `.../sound.json`.

## Not reached
Nothing. Screenshots are not committed.
