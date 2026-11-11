# s19-games-1: daar, samosa, maani and sekelo on the new art (11 Nov)

Opus, high; branch `s19-games-1` (s19-shared-checks merged in), never pushed. Flaws first.

## Flaws and open
- **Not zero: 326 → 129 breaks** (L1-L4, 740x320 and 1280x665; the before re-judged with today's checks, 359 on the old).
- **Sekelo L4 at 740x320 times out at 285 s**, as before (a busy machine); every other page ends, 0 page errors.
- **Daar's discs** can't show every mix: tomato alone shows the masala (onion bits in it); a chilli the disc lacks lies in the oil as rings (DAAR-16). The stirred daar is `disc-tadka`, whose curry leaves no order adds.
- **Sekelo's grill** (Zafar, 11 Nov): two trays stacked to the grill's height, one rectangle filling the view, centred; a skewer keeps its size board → tray → grill → tray. 115 passes.
- **CHAI-89:** chai's formula, a local `centreLift` in each game (could be `St.centreLift`). Daar, maani and samosa barely move (they filled their height); sekelo's threading rises ~37 design px. Before/after: L1 of `s19-games-1-before` and `-dev2`, 740x320 and 1280x665.
- **Samosa's unpadded heaps** stand 8% taller than the S5 heaps' drawn part: 115 reads the canvas, and S5's have 7% padding.

## Before → after, by check
Daar and sekelo from `s19-games-1-after`; samosa from `-after-samosa`, maani from `-after-maani`.

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
| s19-shared-checks | 114 samosa (21): its filling's mounds shrink as the strip parks and as a filling joins: Zafar's accepted close-up fold, but `ACCEPTED_SIZES` names only `sv3-fold`. 112, 53, 105: the coach's light frames a region, not the heap. 36: the coach's own lights have no call (samosa's fill and fold, maani's board, sekelo's first bowl). |
| s19-games-2 (chop) | Daar's chop phase is chop's game: 115 (7, its band), 114 (1), 36 ("dungri na", "ba mirchi"). |
| mine, next round | 78 and 36 on samosa's knob, fry and lift and maani's flip: lit only by the first-time coach, so from L2 the call has no light; next, `Cook.Coach.control` as eggs. |
| language | 36: "Put the vegetables in", the daar's pour and sekelo's "put it on the grill" have no recording (skip logged ~1.1 s before the light). 37 samosa: no lexicon plurals for bataato, chundo ("bataata", "chunda"). |
| the checks | 37 sekelo: the meat bowl's word is gos, the card's mishkaki (SEK-19), so it counts as a decoy. |

## What changed
- **Art:** daar's v4 pot (empty, with oil) and six discs laid in by code; samosa's karahi with oil and the napkin plate; maani's board and pin; sekelo's eight bowls on the band and chicken, chilli and corn in four stages. All in each game's `assets`.
- **Fixes:** sekelo's bowls follow the level table (L1: the order's pieces and one decoy). A thing keeps its size from step to step: a samosa from thali to oil to plate (its plate sized for the whole order); sekelo's skewer board → tray → grill → tray; maani's ball; daar's heaps. Glides, not jumps: samosa's fry plate and close-up exit, sekelo's trays, pieces and skewers (`SK.glide`). Maani's small maani no longer flies to the tawa as a ball picture (`roll.js`).

## For s19-serve2 (`data/cook.json` prefetch)
Add each game's new `v4/<game>/` pieces above; drop daar's `v3/daar/pot-*` and `items-s08b/daar-*`, samosa's `v3/samosa/karahi`, `plate`, maani's `v3/maani/chakla`, `velan`, sekelo's `v3/sekelo/heap-*` and `items-s08c/sekelo/*`.

## Proof
- Final contract, L1 at the four sizes: `build/screenshots/sandbox/s19-games-1-contract/`: `CONTRACT FAILED: 54 breaks` (91 6, 36 16, 114 11, 111 5 ...), 16 of 16 ends, 0 page errors.
- Before → after: `s19-games-1-before` → `-after`, `-after-samosa`, `-after-maani`.
- Rows: the brief has none, so no before or after folder.
- `loadcheck --only` my four games: 4/4 ok (samosa and sekelo declare their served dish, samosa its mince card).
- `checks.mjs`: every step ok but unit's 3 art-block tests (sparse `sources/`, failing at the base too).
- check-change (`build/screenshots/tiers/change-0f75aa15b7/logs/`), L1, stopped by me at 70 min, before the base: push fail (those 3 tests), scope fail (an integration-branch file), play: every flow and path ends, 0 page errors, 62 breaks.
