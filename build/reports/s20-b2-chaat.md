# s20-b2-chaat: chaat joins the kitchen frame

Branch `s20-b2-chaat`, from `f794015`, with `ccr-7da5e9f0` merged again before the gates. Nothing a child sees moves at any level or size.

## What changed
- **Chaat's layout code** lives in its mechanic, `js/cook/mechanics/assemble.js` (only chaat uses it), and its settings, `data/stations/chaat.json`. It now reads only the frame:
  - `Frame.area(S, {top, draw: true})` gives the play area and draws the wash; `F.stoneBand(S, {game: "chaat"})` pulls the tray.
  - The bowl's size and middle, and the tray row's span, are shares of `play`.
  - The pills' foot comes from `bottom`.
  - The pop, face, pills and review room come from `view()`, `px` and `toScreen`.
  - The old screen and sheet sums are deleted.
- **Chop** runs as its own game with the whole play area. Chaat lends nothing (call 1).
- **No frame option added.** `kitchen-frame.md` gets chaat's line.

## Proof
- **frame-counts** has no chaat row, because it reads only `stations/*.js`. Its rule run over `assemble.js` gives 7 before and 0 now. chai-tray stays at 0.
- **Tier 0:** 14 steps ok; unit tests 1014 pass.
- **Gate chaat** (`gate-20261115T0549-chaat`, 6.4 min): FAIL, 17 blocking breaks:
  - contract-104 ×8 and -128 ×8: the dish card "hakro chaat" has no picture (SH-273: no art; the kit's `ui.js`).
  - contract-74 ×1: a tap during the layer order lands the whole order.
  - The base has all three: a base gate at 740 and a base replay at 1280.
- **Gate chai-tray** (`gate-20261115T0606-chai-tray`, 24.7 min): PASS. Contract 0 over 38 pages; boxes identical.
- **Geometry rules:** no box spec for chaat. **Evidence:** no rows, so no BEFORE folder.
- **Contract at four sizes** (`cook:chaat,lab:cook/assemble`): 8/8 pages reach their end, 0 page errors.
  - Breaks: contract-104 ×8, -128 ×8 (above), -26 ×3 (no "chano" clip), -111 ×2. The last two are advisory and on the base.
  - The brief's `lab:cook/chaat` names no lab and sat on a blank page until it timed out.
- **check-change** (`--base origin/ccr-7da5e9f0-04g4xm`, `build/reports/tiers/change-6531e5599c.md`, 67 min): FAILED, nothing from this change:
  - contract: 47 after against 46 before; the extra is advisory contract-120, which the base gate also had.
  - scope names `assemble.js`, which the brief grants.
  - The chai frozen sound, chai's mount and the missing `pot-chana.webp` don't touch chaat's code.

## Rows (waits for the frame, naming chaat)
| Row | Now | Proof or reason |
|---|---|---|
| SH-239, -241, -236, -238, -274 | check passing | contract-108, -100, -106, -103, -125: 0, L1-L4 |
| SH-245, CHT-19 | check passing | contract-115, -36: 0 (one seed per level) |
| SH-248 | built | band by key; `band.test` passes |
| CHT-17 | flows end, no new breaks | four-size run |
| SH-258, CHT-13 | built, unchanged | no check; CHT-13 is an eye row |
| SH-259 | built except the lend | call 1 |
| CK-110, SH-275, SH-280 | cannot here | chop's mechanic, ART-66, flow |
| SH-270, -271, -279, -283 | cannot here | kit. SH-283: the tray is shuffled per round |

## Calls taken while Zafar was away
- **The bowl's place:** exactly the old place, the play area's middle lowered by 1.6% of the bowl's width. Other option: centred, about 9 units higher.
- **The tray's span:** the old span as shares of the play area. Other option: the bottom row's edges (wider on wide screens).

## Calls for Zafar
1. Let a recipe step name the room it lends (`"room"` in `data/cook.json`, lent by `recipes.js`)? **Yes, once a recipe needs one.** None does today.
2. Make a chaat dish-card picture in the next art run? **Yes.** It clears contract-104 and -128.
