# s20-b2-chaat: chaat joins the kitchen frame

Branch `s20-b2-chaat`, from `f794015`; `ccr-7da5e9f0` merged again at `41eae54` (chop round 4) before the final gates. Nothing a child sees moves at any level or size.

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

## Final gates, after merging `41eae54`
- **Gate chaat** (`gate-20261115T0842-chaat`, 9.3 min): checks pass. The contract has 16 blocking breaks, all contract-104 and -128 (the dish card); contract-74 did not recur.
- **Chaat's chop step:** no breaks. The advisory breaks are all in the bowl step.
- **Gate chai-tray** (`gate-20261115T0855-chai-tray`, 25.5 min): boxes identical. contract-112 ×1 (L4 740, the light round "aadu"); s20-lift logs the same failure from its merged change, and chai never loads chaat's files.
- **Four sizes:** 8 of 8 pages end, 0 page errors, the same 21 breaks.
- **The dish card:** chaat can't fix it from its own files the way baking did. The kit reads `items[].card` only from the combined stations' settings (`index.js`), and chaat isn't one; there is also no picture. So it needs art plus a `words["ph-chaat"].card` entry in `data/cook.json`.

## Call 2 taken (the orchestrator, decision 38)
- The "hakro chaat" dish card now shows the served chaat bowl. That is one entry in `data/cook.json`: `words["ph-chaat"].card` = `assets/art/served/chaat.default.r1.webp`.
- **Gate chaat** (`gate-20261115T0927-chaat`, 6.6 min): **PASS**, 0 blocking breaks over 18 pages. Checks passed at 147 s.
- **For a child:** the dish card that flashes as Nana names the dish shows a chaat bowl, where it showed an empty box, at every level and size.
- **lab:cook/chaat** is dropped from the flows.

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

## Round 2: CHT-20 to CHT-22 (decision 38, the Fable eye judge)
| Row | Now | How, or why not |
|---|---|---|
| CHT-20 | built | Each layer lies a little narrower than the one beneath (`layers.ring` 0.13, `ringMin` 0.4), so every layer shows round the ones on top: chano at the rim at well done. The bowl as built is handed to the serve (`Cook.Serve.plated`, maani's way) as a picture: its side below the rim, at a bowl's size, so the tray shows what the child made. |
| CHT-21 | partly | Nani's face and speaker stay in her box. Chop's mechanic gains `boxFace` (her chop card has no face of its own; her box isn't emptied), passed only by `chop-game`, so daar and the Chop tile are unchanged. Nana's line during the chop: **kit**. `ui.js` hides every order card while a station's own card is up (`held`, DAAR-44), so it needs a `ui.js` option, e.g. `addCard(..., {keepOrder})`. |
| CHT-22 | partly | The spoonful is never under 46 CSS px (`motion.spoonCss`). The tray's bowls are a seventh bigger where there is room (`bowlD` 172, `pitch` 200); at 740 the tray's height still caps them. **Chop's own** (it looks the same in daar and chop alone, so it can't be a chaat-only option): the cut light under the cog at 740, the "hakro" pill over the cut potato, the dim flash at the tameto turn, and the potato on board and tray at once. "The bowl's pill moving on with Nani's line" wasn't clear enough to act on. |

- **Gates:**
  - `gate-20261115T1039-chaat` PASS: 9.5 min, 0 blocking over 18 pages.
  - `gate-20261115T1049-daar+chop` PASS: 19.6 min, 0 blocking over 56 pages.
  - `gate-20261115T1108-chai-tray` boxes identical; contract-112 ×1 (L4 740, the lift's, left as asked).
- **Tier 0** passes. **Pictures:** `build/screenshots/sidebyside/chaat-L1-20261115-1134/` (before: `chaat-L1-before-r2/`). The served bowl's food reads a little pale at the tray's size.
- **Calls taken:** the layer ring (other option: holes cut in each later layer); the served picture's tilt 0.66 with a side wall (other option: maani's flat 0.56, which read as a plate).

