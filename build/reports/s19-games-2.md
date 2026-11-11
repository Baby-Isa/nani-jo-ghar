# s19-games-2: the new art in eggs, baking and the pantry, corn's grill rectangle, the pot trial, the breaks (11 Nov)

Opus, high. Branch `s19-games-2`, never pushed. Flaws first.

## Flaws and open
- **Corn's plate step (Zafar):** the cob keeps its grill size on the tray, so on screen 2's smaller cream plates it shrinks 23% (44% at
  740x320): bigger plates there, or a cob reaching past the rim? (114's corn breaks are all this.)
- **Chop (s19-serve2 or the check):** 115's 12: the lying chilli (52%), potato and ginger capped by their slot: veg-12 `sizeFlag:
  "LONG"` in cook.json, or measure a lying thing on its long side. The onion's hop reads +17% at 1920x1080: next round.
- **Mine, next round:** baking's jars at 1920x1080 miss their tap reach (111, 3, since they stand by size class).
- **Checks in conflict (s19-shared-checks):** 36 wants an item step called as it opens; 89 (SH-172) forbids it (baking tried: 36 -13,
  89 +8; reverted). 37 reads baking's card before its rows reveal and counts eggs' egg box and chaat's "no" topping as decoys. 109 wants
  one line on the pantry's painted shelves. Chai, untouched, keeps 55.
- **Shared code (s19-shared-checks):** 116 (the one-card row and padding), 113 (the side menu over a tray face), 70 (a timed call queued
  behind the helper's line, then `skip-closed`), 78 in eggs (the light still waits for a still stage), 72, 102, 104, 106.
- **Zafar's call:** baking's bowl as the main thing (115); eggs' decoys (none by design).
- **Timeouts:** three 740x320 pages hit the 300 s cap, before and after (load ~40 on 4 cores).
- **Recording gaps** (on the sheet): baking's v.open, naan put-in, "Tayar ai."; v.serve.

## What changed
- **Art:** eggs' whole egg (E5); the boiled halves read from the ring as lifted (soft, firm, over). Naan in four stages through the
  oven's glass (overdone if left). The redrawn pot measured, behind `scene.potTrial: false`.
- **Corn (Zafar, 11 Nov):** the grill and the steel tray, turned upright, one rectangle of the grill's height, as big as the worktop
  allows; a cob rests on the tray upright at its grill size; raw cobs on the band within 15%. 115 for corn: 8→0.
- **CHAI-89:** corn's rectangle, baking's bowl (with its pour room) and oven, chop's board (knife, ring, peak with it) centred between the
  view's top and the shelf by chai's measure (eggs already was); before | after in the run folders below (corn 05, baking 04, chop 05).
- **114:** eggs' fried egg one size pan to plate, halves fading in; baking's jug one width; chop's band fades in, a hop grows 8%, halves
  87%. **78:** steam and smoke never hold a light. **105/107/111:** chaat's and eggs' things lit with their pill, hopping. **115:**
  baking's jars by size class.

## Before → after (L1-L4, 740x320 and 1280x665)
| check | eggs | baking | corn | chop | chaat | chai | pantry | all |
|---|---|---|---|---|---|---|---|---|
| 114 | 5→0 | 8→0 | 21→12 | 30→9 | 1→1 |  |  | 65→22 |
| 115 |  | 14→8 | 8→0 | 12→12 | 3→4 | 0→2 |  | 37→26 |
| 116 | 5→5 | 9→10 | 6→7 | 8→7 | 14→14 | 3→2 | 3→2 | 48→47 |
| 36 | 14→13 | 23→10* | 4→2 | 7→5 | 23→24 | 13→9 | 16→14 | 100→77 |
| 37 | 6→5 | 8→8 | 7→6 |  | 3→4 | 3→1 | 2→2 | 29→26 |
| 78 | 7→7 |  | 1→0 |  |  | 1→0 |  | 9→7 |
| 105, 107, 111 | 6→4 | 1→0 | 2→0 |  | 24→6 | 1→2 | 0→2 | 34→14 |
| other | 29→24 | 23→18 | 20→19 | 12→6 | 21→23 | 48→39 | 28→22 | 181→151 |
| **all** | 72→58 | 86→54 | 69→46 | 69→39 | 89→76 | 69→55 | 49→42 | **503→370** |

\* with baking's step as a call, since reverted (36 back near 23, 89 at 0).

## The pot trial
`build/screenshots/sidebyside/g2-pot-trial/1280x665/pair-4-mid.png`: chai's pan left, eggs with the redrawn pot right (trial on for the
shot only). Zafar picks.

## Not my files (exact lines)
- data/cook.json (s19-serve2): `art.sprites.shelf["fru-04"]: ["v4/pantry/orange", 0.9]` (was `shelf-fru-04-bare-f`), and
  `assets/cook/items/v4/pantry/orange.webp` in the pantry's load manifest; fetch.js needs nothing (the shelf fits it by class).

## Proof
- Before `build/screenshots/sandbox/s19-games-2-before/`, after `s19-games-2-after/`: 56 pages each, 53 ends (the caps above), 0 page
  errors, `CONTRACT FAILED: 370 breaks` (503).
- Replay `s19-games-2-contract` (four sizes, `--parallel 2`, timeout 3600): 28/28 ends, 0 page errors, `CONTRACT FAILED: 118 breaks`
  (36 28, 116 20, 37 10, 109 9, 114 8, 111 7, 106 7, others 29): named above.
- Evidence: the brief names no fix-list row, so no before or after folder.
- checks.mjs: ok but the 3 art-block unit tests (sparse sources/, as at the base) and the clinic leak bot (900 s timeout, busy machine).
- loadcheck: my six kitchen pages ok (baking now declares its cards' pictures); the pantry fails on
  `assets/cook/items/served/pantry-basket-v2.webp`, in no manifest (s19-serve2).
- check-change: CC_LINE
