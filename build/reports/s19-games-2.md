# s19-games-2: the new art in eggs, baking and the pantry, corn's grill rectangle, the pot trial, the breaks (11 Nov)

Opus, high. Branch `s19-games-2` (s19-shared-checks merged in), never pushed. Flaws first.

## Flaws and open
- **Corn's plate step (Zafar):** the cob keeps its grill size on the tray, so on screen 2's smaller cream plates it shrinks 23% (44% at
  740x320): corn's 10 114s. Bigger plates there, or a cob reaching past the rim?
- **Baking (mine, next round):** its jars by size class (115) broke their tap reach to the pill (111), so they keep their old size: 8 of
  baking's 16 115s; the other 8 are its bowl as the "main thing" (Zafar's call).
- **Chop (s19-serve2 or the check):** 115's 7: the lying chilli, potato and ginger capped by their slot (veg-12 `sizeFlag: "LONG"`?).
- **Eggs:** the decoys stand by the levels table, but at L4 the flour (`../items-s17-stove/f-chapati-flour-atta`) never loads, so 3 of 4
  (37, 2); the same picture is baking's card that "did not load" (104): its cook.json stem, s19-serve2. 78 (2): the light still waits.
- **Checks in conflict (s19-shared-checks):** 36 wants an item step called as it opens; 89 (SH-172) forbids it (baking tried: 36 -13,
  89 +8; reverted). 37 reads baking's card before its rows reveal. 109 wants one line on the pantry's painted shelves. 70: a timed call
  queued behind the helper's line is dropped (`skip-closed`) when the child taps first. 113: the side menu over a tray face.
- **Timeouts:** chai L4 at 740x320 hits the sandbox's 300 s cap, before and after (chai unchanged).
- **Recording gaps** (on the sheet): baking's v.open, naan put-in, "Tayar ai."; v.serve.
- **check-change** not run to its end: started on the pre-merge code, stopped at its push step to merge s19-shared-checks; its full play
  (7 games, L1-L4, two sizes, and the base) is 2-3 hours on this machine. Its pieces ran on their own below.

## What changed
- **Art:** eggs' whole egg (E5); the boiled halves read from the ring as lifted (soft, firm, over). Naan in four stages through the
  oven's glass (overdone if left). The redrawn pot measured, behind `scene.potTrial: false`.
- **Corn (Zafar, 11 Nov):** the grill and the steel tray, turned upright, one rectangle of the grill's height, as big as the worktop
  allows; a cob rests on the tray upright at its grill size; raw cobs on the band within 15%. 115: 8→0.
- **CHAI-89:** corn's rectangle, baking's bowl (with its pour room) and oven, chop's board (knife, ring, peak with it) centred between the
  view's top and the shelf by chai's measure (eggs already was); before | after in the run folders below (corn 05, baking 04, chop 05).
- **Eggs' decoys** (37): chai's side-on jars by the levels table, an unasked shaker counting, each a gentle no; the row held in the view.
- **114:** eggs' fried egg one size pan to plate, halves fading in; baking's jug one width; chop's band fades in, a hop grows 8%, halves
  87%. **78:** steam and smoke never hold a light. **105/107/111:** chaat's and eggs' things lit with their pill, hopping.

## Before → after (L1-L4, 740x320 and 1280x665)
| check | eggs | baking | corn | chop | chaat | chai | pantry | all |
|---|---|---|---|---|---|---|---|---|
| 114 | 5→0 | 8→0 | 21→10 | 30→2 | 1→1 |  |  | 65→13 |
| 115 |  | 14→16 | 8→0 | 12→7 | 3→5 | 0→3 |  | 37→31 |
| 116 | 5→0 | 9→2 | 6→1 | 8→1 | 14→1 | 3→1 | 3→0 | 48→6 |
| 36 | 14→8 | 23→18 | 4→0 | 7→7 | 23→16 | 13→4 | 16→8 | 100→61 |
| 37 | 6→4 | 8→8 | 7→7 |  | 3→3 | 3→0 | 2→0 | 29→22 |
| 78 | 7→2 |  | 1→2 |  |  | 1→0 |  | 9→4 |
| 105/107/111/112 | 6→4 | 1→1 | 2→1 | 0→1 | 25→8 | 3→0 | 0→2 | 37→17 |
| other | 29→17 | 23→6 | 20→3 | 12→0 | 20→8 | 47→20 | 28→21 | 179→75 |
| **all** | 72→35 | 86→51 | 69→24 | 69→18 | 89→42 | 69→28 | 49→31 | **503→229** |

Eggs' other includes 4 of 22 (its call said twice with the stuck light), fixed after: eggs again at L1-L4, two sizes
(`s19-games-2-eggs-final`): 8/8 ends, 32 breaks, 22 at 0. 116 and S.fly's snaps went with s19-shared-checks' merge.

## The pot trial
`build/screenshots/sidebyside/g2-pot-trial/1280x665/pair-4-mid.png`: chai's pan left, eggs with the redrawn pot right (trial on for the
shot only). Zafar picks.

## Not my files (exact lines)
- data/cook.json (s19-serve2): `art.sprites.shelf["fru-04"]: ["v4/pantry/orange", 0.9]` (was `shelf-fru-04-bare-f`), and
  `assets/cook/items/v4/pantry/orange.webp` in the pantry's load manifest; fetch.js needs nothing (the shelf fits it by class).

## Proof
- Before `build/screenshots/sandbox/s19-games-2-before/`, after `s19-games-2-after/`: 56 pages, 55 ends (chai L4 740x320), 0 page
  errors, `CONTRACT FAILED: 229 breaks` (503).
- Replay `s19-games-2-contract` (four sizes, `--parallel 2`, timeout 3600): 28/28 ends, 0 page errors, `CONTRACT FAILED: 67 breaks
  (contract-22 4, contract-36 20, contract-83 1, contract-106 4, contract-37 8, contract-104 2, contract-115 8, contract-73 1, contract-102 3,
  contract-109 9, contract-53 2, contract-70 1, contract-114 4)`: each kind named above (22 since fixed).
- Evidence: the brief names no fix-list row, so no before or after folder.
- checks.mjs: ok but the 3 art-block unit tests (sparse sources/, as at the base) and the clinic leak bot (900 s timeout, busy machine).
- loadcheck: my six kitchen pages ok; the pantry fails on `assets/cook/items/served/pantry-basket-v2.webp`, in no manifest (s19-serve2).
