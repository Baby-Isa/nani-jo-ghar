# s20-b2-baking: baking joins the kitchen frame (15 Nov)

Files: `baking.js`, `baking.json`, `kitchen-frame.md` (a line; no frame option added). No rows in the brief and no BEFORE played at launch: no evidence folders.

## What changed
- **Baking reads only its play area.** `Cook.Frame.area` draws the wash and the shelf band (by baking's key) and gives the play box. The bowl, jug, tray, oven, cat and shelf row sit at shares of `play.w` (settings `scene.room`). Down: centred in `play`. The oven: `area.next()`. CSS px: `F.px`. **frame-counts: baking 9 → 0.**
- **SH-280:** the bowl's things fade out as the oven and tray fade in (no bare worktop), and the face glides from the bowl to the tray.
- **The naan card** had an empty picture on every page (contract-104 and -128). It now shows its one naan (`items.naanOut.card`, as `vocab.ph-naan.card` meant).

**A child, every size:** all stands where it stood; the oven crossfades in; the naan card shows a naan.

## Rows ('waits for the frame', naming baking)
| Row | State | Proof or reason |
|---|---|---|
| SH-248 | settled | `F.stoneBand(S, {game})`; band.test's baking `todo` can go (orchestrator) |
| SH-245, -249, -255, -258 | settled | gate 0 blocking (-115, -102/105/106, -82) |
| CK-100 | built; eye judge | the face goes with the tray, now gliding; -82: 0 |
| SH-280 | built | its check is still to build |
| CK-102 | shelf built; card: kit | the card fold is the kit's (decision 21) |
| CK-89 | built; waits: Mum | "pinch" is grey English until recorded |
| SH-278, SH-235 | kit | -126: 0 here; the "?" pop-up's fit is the kit's |
| CK-97 | call 1, plus art | the kit puts the catalogue card first (`ui.js:3318`); a fix inside baking would leak into other games; the half bottle needs art |
| SH-275 | call 2 | |

## Calls for Zafar
1. **CK-97:** should every game's shelf pictures be its cards (chai's `shelfJars` way, in the kit)? **Yes.**
2. **SH-275:** should the bake ring sit on the oven's window, round the naan, at chai's ring size, with no ring on the pour? **Yes.**

## Calls taken while Zafar was away
1. **Not `area.row`:** a centre and its satellite, so nothing moved. Other option: a centred pair with the frame's gap (the bowl about 200 right at L3-L4, the oven about 115).
2. **The naan card is the prototype single naan.** Other option: the approved served plate, which shows two naans. A drawn single naan is an art row.
3. **SH-280 is a crossfade with the face gliding.** Other option: fade out, then fade in.
4. **The oven's middle is always the play area's middle.** ("never below y 360" dropped: bites only on a view cropped 100+ units at the top).

## Round 2 (the orchestrator, decision 38: the eye judge in Zafar's place)
- **CK-133:** one face circle, beside what it owns and riding with it: the bowl, the dough to the tray, the tray, into the oven and out. It is its thing's own part (`thing.face`, lit whole by the kit's `thingBox`).
- **CK-135** (replaces call 3): the jug slides away; the dough lifts out of the bowl, crosses to the tray and spreads into the raw naan; the bowl slides off as the oven slides in. Nothing fades between scenes.
- **CK-134:** the glass jug's shadow is only an oval at its foot (the box-sized one showed through the glass), hidden while it pours.
- **CK-136:** the oven keeps its light's margin under the screen's top. A lifted jar's pill stays; only its tap is off.
- **SH-275** (decision 39): the kit's heat ring (chai's) round the naan on the oven's window, its green from 0.8, going on to its over colour as the naan browns. It keeps chai's first-time hold (`St.firstHold`, contract-77).
- **A child sees:** the face sits right by its thing and travels with it; the dough becomes naan on the tray; the oven slides in; a big ring round the naan; a clean jug; the oven a little shorter at 740x320.
- **Proof:** baking's gate `GATE PASS baking: checks pass 2.4, contract pass 7.7; 10.1 min` (0 blocking over 18 pages; advisory -119 x2, -53 x2). Chai: R2CHAI. Side-by-side: R2SBS.

## Proof
- **Baking's gate:** the base FAILED, 8.2 min, 16 blocking. After: `GATE PASS baking: checks pass 2.3, contract pass 7.6; 9.9 min`, 0 blocking over 18 pages; **Final, after merging the working branch: `GATE PASS baking: checks pass 2.4, contract pass 7.6; 9.9 min`**, 0 blocking over 18 pages.
- **Chai's gate, final:** `GATE PASS chai-tray: checks pass 2.4, contract pass 21.1, boxes:chai-tray pass 3.3; 26.9 min`, 0 blocking over 38 pages, **boxes identical**. (An earlier run had 3 light-timing flakes, -79, -8 and -112; the same pages replayed at 0 on the base and here.)
- **Geometry rules:** cannot run: "No box spec for baking" (`boxes.mjs`, read-only).
- **Four sizes** (`s20-b2-baking-contract`): 8/8 pages reach their end, 0 page errors; `CONTRACT FAILED: 4 breaks (contract-11 2, contract-109 2)`, all at 1920 and all on the base too.
  - -11: the kit's low-res word-moment counter. -109: the probe reads a jar's canvas bottom, baking stands its opaque foot on the line; a shelf `litBounds` would fix it but tightens the light boxes (its own gated change).
- **check-change:** **PASSED, 14.6 min** (`build/reports/tiers/change-7c9a294fa3.md`).
- **checks.mjs:** pass (unit 1014/0).
