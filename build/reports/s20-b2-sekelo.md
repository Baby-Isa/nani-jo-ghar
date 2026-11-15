# s20-b2-sekelo: sekelo joins the kitchen frame (15 Nov)

BEFORE not played at launch (no rows). The base's gate: `contract FAIL 17.3` (26 blocking: contract-104 and -128 on every page, contract-91 at L3 #hint).

## What a child sees
- **Thread screen:** the board and tray are the frame's row (`F.row`), centred in the play area: about 40-60 units further left. The bowls sit between the bottom row's edges (at 740, 930 and 1280 they spread with the view).
- **Grill screen:** unchanged (the same sums on `F.row`).
- **Dish card:** "hakro sekelo" has its picture. **Stuck:** the grill gets Nani's helper card and the kit's light; the threading's bowl glow goes out under the "?" pop-up.

## Calls taken while Zafar was away
1. The thread and grill mechanics treated as sekelo's own (only the station file). 2. Each screen reads the area afresh, since `St.begin` clears the stage (`area.next`). 3. `gapUnit` (the frame's tenth: the tray parted, the grill 3% smaller). 4. The dish card is the served plate (one skewer: needs art). 5. The stuck light on the first skewer (the needed one: the leak test). 6. SEK-31: the face steps down to 96 at 740x320 (the 150 face over the coals). 7. SEK-32: the bowls back on the band only at well done (all through the grill: SEK-08's one job).

## Rows ('waits for the frame', naming sekelo; no status moved)
| Row | State | Proof (0 in gate-20261115T0704) |
|---|---|---|
| SH-245, CK-86, SEK-26 | built | contract-114, -115; eye: the judge |
| SEK-27, SH-248 | built | contract-123 |
| SH-53, -158, -227, -236, -238, -239, -241 | pass | contract-8, -77, -100, -106, -103, -108 |
| SEK-28 | built (S19) | check still to build |
| SEK-29, CK-81 | lights pass | contract-117, -113; the row jump (contract-72) is `ui.js`'s; browning, the ring: eye |

## Round 2 (Fable on sekelo L3, decision 38): SEK-30 to SEK-32
- **SEK-30:** the engine says one sentence, "Muke sekelo khape, hakri lakri mixed." (`order.js:316-353`); the rows after the headline are bare because the join is its gap (LNG-17). The kit's reading (`ui.js`) puts each part in its own bubble, as chai's. These are the deciding words, so they stay. Gap logged as **CK-SEKELO-19**.
- **SEK-31:** well done uses the kit's one-dish face size (150; at 740x320 it steps down through the kit's sizes to 96). The face sits at the tray's top edge and "Shabash!" over bare marble, never the coals.
- **SEK-32:** the bowls come back onto the band at well done; the word pop moves beside the board in clear marble; the served picture is cut to its skewers; the pill row is one size; the thread tray keeps clear of the cog. **For Zafar:** is "sekelo" in English "barbecue"? (language data: recommend yes)
- **Pictures:** `build/screenshots/sidebyside/mishkaki-grill-L3-20261115-1041/`. The tool's light needs one after the station starts: sekelo's L3 lights come before it (the card's lessons) or wait for a still stage a child-pace player beats.

## Round 3
- **The panel:** at each piece and each new skewer it glides to the skewer being threaded (the kit's `UI.followCard` on the first unfinished `.oc-items14` row); at 740x320 that row is whole. Showing only the current skewer's slots at the order is the kit's order drawing (`ui.js` ~3655), more than one line, so I left it.
- **The word pop** takes the shelf pills' word size (the row's one scale), never under the kit's floor.

## Proof
- **frame-counts:** mishkaki-grill 0 (was 2); chai-tray 0.
- **Round 1:** sekelo `GATE PASS` 18.6 min (0 blocking, 28 pages); chai `GATE PASS` 28.6 min, boxes identical.
- **Four sizes:** 8/8 pages end; 0 breaks.
- **Geometry rules:** no box spec for mishkaki-grill (`boxes.mjs`).
- **check-change:** `PASSED in 19.5 min`, `build/reports/tiers/change-ded1bef559.md`.
- **Round 2:** `GATE PASS mishkaki-grill: checks pass 2, contract pass 12; 14 min` (gate-20261115T1049; advisory contract-111 x3, -72 x1). `GATE FAIL chai-tray: checks pass 2.2, contract FAIL 20.6, boxes:chai-tray pass 3.4; 26.2 min` (gate-20261115T1103): boxes identical, one block: contract-112 at `lab:cook/chai-tray@L4` 740x320 (the aadu light). It fails 3 in 3 on the working branch without my commits: not sekelo's.
- **Round 3:** `GATE PASS mishkaki-grill: checks pass 2.1, contract pass 11.1; 13.2 min` (gate-20261115T1217, 0 breaks). Chai, gate-20261115T1231: `GATE FAIL chai-tray: checks pass 2.7, contract FAIL 20.7, boxes:chai-tray FAIL 3.3; 26.8 min`. Contract-112 is the known break. Contract-102 (lab L4 #child 740x320, a Container glowing outside the light) and boxes 0/8 identical (the side panel's cards: words moved and rows gone) are new since the last merge, which changed `ui.js` (SH-308's fold). Round 3 changed only sekelo's two mechanics, which chai never loads, so none of it is sekelo's; chai's reference needs the orchestrator after SH-308.
