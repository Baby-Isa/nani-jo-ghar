# s20-b2-baking: baking joins the kitchen frame (15 Nov)

Files: `baking.js`, `baking.json`, `kitchen-frame.md` (a "who calls it" line; no frame option added). The rows' BEFORE evidence was not played at launch, and the brief names no rows, so there is no before or after folder.

## What changed
- **Baking reads only its play area.** It calls `Cook.Frame.area` for the wash, the shelf band (pulled by its key) and the play box. The bowl, jug, tray, oven, cat and shelf row sit at shares of `play.w` (`scene.room` in its settings). The bowl's foot and the oven are centred down `play`. The oven screen uses `area.next()`. Sizes in CSS px come from `F.px`. Removed: `Cook.view`, `worldToScreen` x6, `[1600, 900]`, `O.centre`, `896`. **frame-counts: baking 9 → 0.**
- **SH-280:** the bowl's things fade out while the oven and tray fade in (300 ms, no bare worktop between), and the face glides from the bowl to the tray.
- **The naan card had no picture on every page** (contract-104 and -128: 16 blocking on the base). Its one-naan picture (`vocab.ph-naan.card`) is now on `items.naanOut.card`, which the kit reads.

**What a child sees, at all four sizes:** everything stands where it stood (the shares give the old x's, and the sums for y are the same). Two things change: the oven arrives with a crossfade and a gliding face, and the naan card shows a naan instead of an empty box.

## Rows ('waits for the frame', naming baking)
| Row | State | Proof or reason |
|---|---|---|
| SH-248 | settled | `F.stoneBand(S, {game})`; band.test's baking `todo` can be lifted (orchestrator) |
| SH-245 | settled | the oven fills 0.96 of the play height; the bowl at its accepted 400; gate 0 blocking |
| SH-249, SH-255, SH-258 | settled | gate 0 blocking (contract-102/105/106, -82); the kit's band and pills |
| CK-100 | built; eye judge | the face is beside the bowl, then the tray and the oven door, and now glides; contract-82: 0 |
| SH-280 | built | the crossfade above; its check is still to build |
| CK-102 | shelf part built; card part: kit | the shelf keeps its things through the bake; the card fold is the kit's (decision 21) |
| CK-89 | built; waits: Mum | the pile is drawn; "pinch" is grey English until recorded |
| SH-278, SH-235 | kit | contract-126: 0 in baking; the "?" pop-up's fit is the kit's |
| CK-97 | kit + art: call 1 | the kit puts the catalogue card before a game's shelf picture (`ui.js:3318`), so a fix for shared words (atto, paani) inside baking would leak into other games; a half-full bottle needs art |
| SH-275 | Zafar: call 2 | |

## Calls for Zafar
1. **CK-97:** should the kit let a game's shelf pictures be its cards (chai's `shelfJars` way, for every game)? **Yes.**
2. **SH-275:** should the bake ring sit on the oven's window, round the naan, at chai's pan-ring size (today it is a small ring at the oven's corner)? **Yes.** And no ring on the pour (the jug's lines are the amount)? **Yes.**

## Calls taken while Zafar was away
1. **Not `area.row`.** The stations are a centre and its satellite, not a row of equals, so nothing moved. The other option: a centred pair with the frame's gap would move the bowl about 200 right at L3-L4 and the oven about 115 right.
2. **The naan card is the prototype single naan.** The other option: the approved served plate, which shows two naans (SH-242 wants one). A drawn single naan is an art row.
3. **SH-280 is a crossfade with the face gliding.** The other option: fade out, then fade in.
4. **The oven's middle is always the play area's middle.** This drops "never below y 360", which only bites where the view crops more than 100 units off the top (tablets).

## Proof
- **Baking's gate** before (untouched base): FAIL, 8.2 min, 16 blocking (contract-104 and -128 x8 each). After: **`GATE PASS baking: checks pass 2.3, contract pass 7.6; 9.9 min`**, 0 blocking over 18 pages; advisory contract-36 x1, -119 x2, -53 x2.
- **Chai's gate** (`gate-…-chai-tray`, 27.4 min): checks pass 2.3 min; **boxes identical, 3.3 min**; contract FAIL 21.9 min, 3 blocking (contract-79 at L3#hint 1280; -8 and -112 at #returning 740), all light timing. The same 4 pages replayed: **0 breaks on the base and 0 on this branch**, so they are flakes, not the frame. Chai never runs baking's code; the one shared thing changed, the naan's card, chai doesn't show.
- **Geometry rules:** cannot run. "No box spec for baking" (`boxes.mjs` knows chai-tray, eggs and maani-line only; read-only for me).
- **Four sizes** (`s20-b2-baking-contract`): **8/8 pages reach their end, 0 page errors**; `CONTRACT FAILED: 4 breaks (contract-11 2, contract-109 2)`, all at 1920x1080 and all on the base too (`s20b2-base-1920`: the same plus -104/-128, now fixed). contract-11: the kit's word-moment counter picture is low-res (assets). contract-109: the probe reads each jar's canvas bottom, while baking stands its opaque foot on the line (`St.opaqueSpan`); a `litBounds` on shelf things would fix it, but it also tightens their light boxes, so it needs its own gated change (next round).
- **check-change:** CC
- **checks.mjs:** pass (unit 1014 pass, 0 fail).
