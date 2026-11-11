# s19-games-1: daar, samosa, maani and sekelo on the new art (11 Nov)

Opus, high; branch `s19-games-1` (s19-shared-checks merged in), never pushed. Flaws first.

## Flaws and open
- **Not zero: 326 → 129 breaks** (L1-L4 at 740x320 and 1280x665; the before re-judged with today's checks: it was 359 on the old ones). By game: daar 116 → 27, samosa 84 → 68, maani 58 → 14, sekelo 68 → 20. The rest is named by owner below.
- **Sekelo L4 at 740x320 times out at 285 s**, as L3 and L4 did before (three builders' browsers on one machine). Every other page reaches its end with 0 page errors.
- **Daar's discs** can't show every mix: tomato alone shows the masala (onion bits in it); a chilli the disc lacks lies in the oil as rings (DAAR-16). The stirred daar is `disc-tadka`, whose curry leaves no order adds. For Zafar's eye.
- **Sekelo's grill** (Zafar, 11 Nov): two trays stacked to the grill's height, the whole one rectangle as big as the view allows and centred. A skewer keeps its size from board to tray and from grill to tray, its pieces lying bar to bar. The mock's handle hangs off the front; ours ends inside. 115 passes.
- **CHAI-89:** chai's formula is in each game's main screen as a local `centreLift` (the same in four files; s19-shared-checks could make it `St.centreLift`). Daar, maani and samosa already filled their height, so they hardly move; sekelo's threading rises about 37 design px. Before and after: the L1 pages of `s19-games-1-before` and `s19-games-1-dev2` at 740x320 and 1280x665.
- **Samosa's unpadded heaps** (the potato pile, daar's chilli rings) stand 8% taller than the S5 heaps' drawn part, because 115 reads the canvas, which has 7% padding on the S5 heaps.

## Before → after, by check
Daar and sekelo from `s19-games-1-after`; samosa from `-after-samosa`, maani from `-after-maani` (re-run after their last fixes).

| check | daar | samosa | maani | sekelo |
|---|---|---|---|---|
| 36 | 16→7 | 12→10 | 7→4 | 5→9 |
| 37 | 1→0 | 2→2 |  | 8→6 |
| 78 |  | 13→12 | 4→4 |  |
| 112 | 0→1 | 0→6 |  |  |
| 114 | 27→2 | 32→21 | 29→1 | 32→0 |
| 115 | 11→7 | 4→0 |  | 8→0 |
| 116 | 10→2 |  |  | 6→0 |
| other | 51→8 | 21→17 | 18→5 | 9→5 |
| **all** | 116→27 | 84→68 | 58→14 | 68→20 |

## Left, by owner
| Owner | What |
|---|---|
| s19-shared-checks | 114 samosa (21): its filling's mounds shrink as the strip parks and as a filling joins, part of the close-up fold Zafar accepted, but `ACCEPTED_SIZES` names only `sv3-fold`; add the strip's `sv3-heap-*`. 112, 53, 105: the coach's light frames a region, not the heap. 36: the coach's own lights have no call (samosa's fill and fold, maani's board, sekelo's first bowl). |
| s19-games-2 (chop) | Daar's chop phase is chop's game: 115 (7, its band), 114 (1), 36 ("dungri na", "ba mirchi"). |
| mine, next round | 78 and 36 on samosa's knob, fry and lift and maani's flip: they light only through the first-time coach, so from L2 the call has no light. Next: `Cook.Coach.control`, as eggs and chai use. |
| language | 36: "Put the vegetables in", the daar's pour and sekelo's "put it on the grill" have no recording (skip logged ~1.1 s before the light). 37 samosa: no lexicon plurals for bataato, chundo ("bataata", "chunda"). |
| the checks | 37 sekelo: the meat bowl's word is gos, the card's mishkaki (SEK-19), so it counts as a decoy. |

## What changed
- **Art:** daar's v4 pot (empty, with oil) and six discs laid in by code; samosa's karahi with oil and the napkin plate; maani's board and pin; sekelo's eight bowls on the band and chicken, chilli and corn in four stages. Every file is in its game's `assets`; `check_vessel_meta.py`'s CHAKLA stays.
- **Fixes:** sekelo's bowls follow the level table (L1: the order's pieces and one decoy). A thing keeps its size from step to step: a samosa from thali to oil to plate (its plate sized for the whole order); sekelo's skewer board → tray → grill → tray; maani's ball; daar's heaps. Glides, not jumps: samosa's fry plate and close-up exit, sekelo's trays, pieces and skewers (`SK.glide`). Maani's small rolled maani was flying to the tawa as a ball picture (`roll.js` now flattens it relative to its start size).

## For s19-serve2 (`data/cook.json` prefetch)
Add `v4/daar/pot-empty`, `pot-oil`, `disc-*`; `v4/samosa/karahi-oil`, `plate-napkin`; `v4/maani/board`, `pin`; `v4/sekelo/bowl-*`, `{chicken,chilli,corn}-*`. Drop `v3/daar/pot-*`, `items-s08b/daar-pot-top-s08b`, `daar-discs/*`, `v3/samosa/karahi`, `plate`, `v3/maani/chakla`, `velan`, `v3/sekelo/heap-*`, `items-s08c/sekelo/*`.

## Proof
PROOF_LINES
