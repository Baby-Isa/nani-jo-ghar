# s19-artfix: sekelo's doubled stone edge, and the art check (12 Nov evening)

## For Zafar
- **The doubled edge came from the code; the stone art is fine.** No new stone art is needed. The code drew a darker rounded box under the stone, with tighter corners and slightly wider sides than the picture, so a second edge showed above and to the left of the band's corners. It was in every stone-tray game at every size. Now the one soft shadow comes from the stone's own outline and falls down and to the right.
- **Every game loads its current art except sekelo's serving plate** (the v3 plate, at serving), across 55 flows played to the end. Its steel replacement is cut; the swap is two data lines (below).
- **Old art named but never drawn:** 14 places (old sekelo file lists, dead code); clearing them changes nothing on screen.
- **For the next art run:** 17 pieces are marked "needs replacing" and about 440 are stand-ins. One stand-in already has its v4 piece cut: daar's ladle (the kit ladle).

## What changed
- `js/shared/shelf.js` `trayPaintArt`: the slab is put together first, then laid with its one shadow. The tile now lands only on the slab (`source-atop`), where it used to be clipped to a 34 px box wider than the picture.
- `js/cook/stations.js` `contactShadow`: records its footprint (`sh.njgFoot`), so a pan's shadow is judged from the pan's body, not its handle.
- **New check** `build/tools/art/shadowcheck.mjs`: runs every band game at four sizes. It fails on solid paint more than 1.5 px outside the slab's outline, and on any shadow up or left of its object. **On the old code: 28 of 28 fail. Now: 40 of 40 pass.**
- **Art map:** `artuse --full`, 55 flows, 0 page errors; 5 pictures registered; `artcheck-known.json` 2 shorter.
- **a5's lines:**
  - contract-117 skips lights buried under the "?" pop-up.
  - contract-116 skips `.oc-away` rows and samples taken while cards slide.
  - SH-267's probe now plays chai's fair path, and `life:dish-flash` is a moment the drivers reach.
  - Each has a test keeping the bad run red.
- **Not done:**
  - contract-18 had 0 breaks in tonight's 55 plays, so there was no failing run to work from.
  - None of e2's five lines are done: 36's skip window, 105 on chop's swipe, 78's "Pela mirchi.", 37 eggs' decoys, and ART-72's probe on corn, daar, maani and chop.

## Exact lines for others
- **data/cook.json (no owner named):**
  - Line 4463: `"file": "assets/cook/items/v4/kit/plate-steel.webp"`, with meta `"flat": [0.5, 0.5, 0.4, 0.4]` (the round steel plate, as maani's `THALI_FLAT`).
  - Line 5636: the same path.
  - Lines 5621-5622, 5631-5632, 5692-5693 and 5700-5701: replace the `items/sekelo/*`, `v3/sekelo/*` and `items-s08c/sekelo*/*` globs with `"assets/cook/items/v4/sekelo/*"`, `"assets/cook/items/v4/kit/grill-v2.webp"` and `"assets/cook/items/v4/kit/tray-deep.webp"`.
  - These clear 13 of the 15 retired rows.
- **e2, js/cook/mechanics/grill.js** (clears the last 2):
  - Delete `DIR: "assets/cook/items/sekelo/",` at line 1012 (unused).
  - Delete the dead `sk2-rack` branch: `SK.rackTex` at 1244-1250 and its caller at 1307-1308.
  - Remove the path from the comment at line 265.
- **orchestrator, checks.mjs:** add the browser step `node build/tools/art/shadowcheck.mjs` (about 4 minutes).

## Proof
- **Before and after frames:** `build/reports/s19-artfix/band-mishkaki-grill@1280x665.png`, plus `@740x320`, `band-corn@…` and `band-daar@…`.
- **shadowcheck:** 28 of 28 fail on the old `shelf.js`; 40 of 40 pass after merging e2.
- **artcheck:** 507 findings, all already known, 0 new. 15 are retired art: 14 named, 1 loaded. The registry has 0 errors.
- **Board shots:** `build/reports/art-board-1280x665.png` and `-dark.png`.
- **checks.mjs:** 13 steps pass. Unit has 948 passes and 4 failures:
  - 3 art-block tests need `sources/art/s17-clinic-redo`, which isn't in the sparse checkout.
  - kit-boil fails under load and passes alone (11 of 11).
- Committed on `s19-artfix`, not pushed.
