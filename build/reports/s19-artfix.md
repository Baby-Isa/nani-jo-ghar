# s19-artfix: sekelo's doubled stone edge, and is every game on the right art (12 Nov evening)

## For Zafar, in plain words
- **The doubled edge was a drawing fault, not the art.** The stone picture is fine. No new stone art is needed. Under the stone, the code drew a darker rounded box with tighter corners and slightly wider sides, so its edge showed above and to the left of the band's corners. This happened in every game with the stone tray (sekelo, corn, chop, chaat, daar, maani and samosa), at every size. The shadow now comes from the stone picture's own outline. It is one soft shadow, falling down and to the right.
- **Are the games on the latest art? Yes, apart from one thing in sekelo.** I played all 55 game flows to their ends, and every game loads its current art. The one old picture still loaded is **sekelo's serving plate** (the v3 plain plate), which shows when the dish is served. Its v4 replacement, the steel plate, is already cut. The swap is a two-line data change, given below.
- **Old art still named but not loaded:** 14 places. They are old file lists and dead code paths for sekelo's v2 and v3 grill, rack, sticks, pieces and trays. Nothing draws them, but they should go.
- **For the next art run:** the board shows 17 pieces marked "needs replacing" and about 440 stand-ins. New tonight: daar's ladle (v3) is a stand-in, and its v4 kit ladle already exists. The old pantry shelf jars still show in the serving kitchen.

## What changed
- `js/shared/shelf.js` `trayPaintArt`: the slab is put together on its own canvas, then laid down with the one shadow (down and to the right), so the shadow follows the picture's outline. The tile overlay goes only where the slab is (`source-atop`). It had been clipped to a 34 px box that was wider than the picture.
- `js/cook/stations.js` `contactShadow`: records the footprint it was cast from (`sh.njgFoot`), so the check can judge a pan's shadow from the pan's body and not its handle.
- **New check:** `build/tools/art/shadowcheck.mjs` covers every band game at four sizes. It flags any solid paint more than 1.5 px outside the slab's outline, and any shadow that sits up or to the left of its object. **It fails 28 of 28 on the old painter and passes 40 of 40 now.**
- **Art map:** `artuse --full` played 55 flows to their ends (0 page errors). I registered the 5 newly loaded pictures, and `artcheck-known.json` lost 2 rows: the serving kitchen no longer loads the old plate, and the clinic's boing finds its drop machine. 0 new findings.
- **a5's check lines (done):** contract-117 leaves out a light buried under the "?" pop-up (`s19lit.gu`). contract-116 leaves out rows with `.oc-away` cards and samples taken mid-slide (`s19pad.away/slide`). SH-267's probe now runs on chai's fair path, and `life:dish-flash` is a moment the drivers reach. Each change has a test showing the bad run still fails.
- **Not done:** contract-18. It had 0 breaks in tonight's 55 plays, so I had no failing run to work from. e2's five lines are also not done: 36's skip window, 105 on chop's swipe light, 78 reading "Pela mirchi.", 37 eggs' decoys, and ART-72's probe on corn, daar, maani and chop.

## Exact lines for others
- **data/cook.json (no owner named):** at 4463 `"file": "assets/cook/items/v4/kit/plate-steel.webp"`, with meta `"flat": [0.5, 0.5, 0.4, 0.4]` (measured on the round steel plate, as maani's `THALI_FLAT`); at 5636, the same path in place of the v3 plate. At 5621-5622, 5631-5632, 5692-5693 and 5700-5701, replace the `items/sekelo/*`, `v3/sekelo/*` and `items-s08c/sekelo*/*` globs with `"assets/cook/items/v4/sekelo/*"`, `"assets/cook/items/v4/kit/grill-v2.webp"` and `"assets/cook/items/v4/kit/tray-deep.webp"`. This clears 13 of the 15 retired rows.
- **e2, js/cook/mechanics/grill.js:** delete `DIR: "assets/cook/items/sekelo/",` (1012, unused). Delete the dead `sk2-rack` branch (1244-1250 `SK.rackTex` and its caller at 1307-1308; nothing loads `sk2-rack`), which removes the rack-t row. Drop the path from the comment at 265 (stick-v row).
- **orchestrator, build/tools/review/checks.mjs:** add a browser step `node build/tools/art/shadowcheck.mjs` (about 4 minutes, port 8913).

## Proof
- Before and after frames: `build/reports/s19-artfix/band-mishkaki-grill@1280x665.png` and `@740x320`, `band-corn@…`, `band-daar@…`.
- shadowcheck: 28/28 FAIL on the old `shelf.js`, then 40/40 ok after merging e2.
- artcheck: 507 findings, 507 known, 0 new (15 retired: 14 named, 1 loaded). Registry: 0 errors.
- Board: `build/reports/art-board-1280x665.png` and `-dark.png`.
- checks.mjs: 13 steps ok. Unit 948 pass and 4 fail: 3 art-block tests need `sources/art/s17-clinic-redo` (left out of this sparse checkout), and kit-boil fails under load but passes alone (11/11). Commits are on `s19-artfix`, not pushed.
