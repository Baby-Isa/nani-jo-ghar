# s19-games-1: daar, samosa, maani and sekelo on the new art (11 Nov)

Opus, high; branch `s19-games-1`, never pushed. Flaws first.

## Flaws and open
- **Not zero: 359 → 286 breaks** (L1-L4, 740x320 and 1280x665). Sekelo 82 → 37 (its 114 snaps 32 → 0). No check changed.
- **Sekelo L4 at 740x320 times out at 285 s**, as L3 and L4 did before (three browsers on one machine). Every other page ends, 0 page errors.
- **Daar's discs** can't show every mix: tomato alone shows the masala (onion bits in it); a chilli the disc lacks lies in the oil as rings (DAAR-16). The stirred daar is `disc-tadka`, whose curry leaves no order adds. For Zafar's eye.
- **Samosa's potato pile** is a little taller than a standard heap's drawn part, but 115 reads 89%: it measures the canvas, and S5's heaps have 7% padding (check's fault).
- **Sekelo's grill** (Zafar, 11 Nov): two trays stacked to the grill's height, one rectangle as big as the view allows, centred; a skewer keeps its size board → tray and grill → tray, its pieces lying bar to bar. The mock's handle hangs off the front; ours ends inside. 115 still flags the grill: the rectangle is width-bound (check's fault).
- **CHAI-89:** chai's formula in each game's main screen (a local `centreLift` in four files; s19-shared-checks could make it `St.centreLift`). Daar, maani and samosa already filled their height, so they hardly move; sekelo's threading rises about 37 design px. Before/after: the L1 pages of `s19-games-1-before` and `s19-games-1-dev2` at 740x320 and 1280x665.

## Before → after, by check
Daar and maani from `s19-games-1-after`; samosa and sekelo from `s19-games-1-after2` (final code).

| check | daar | samosa | maani | sekelo |
|---|---|---|---|---|
| 36 | 16→21 | 12→6 | 7→4 | 5→9 |
| 37 | 1→2 | 6→6 |  | 8→6 |
| 78 |  | 13→13 | 4→4 |  |
| 105 | 2→1 | 2→1 | 1→0 | 11→5 |
| 111 | 10→0 | 0→6 |  |  |
| 114 | 29→28 | 32→32 | 32→32 | 32→0 |
| 115 | 11→12 | 4→6 |  | 8→0 |
| 116 | 13→10 | 0→1 | 4→4 | 10→9 |
| other | 39→34 | 22→11 | 17→15 | 8→8 |
| **all** | 121→108 | 91→82 | 65→59 | 82→37 |

## Left, by owner
| Owner | What |
|---|---|
| s19-shared-checks | 116: the shared order card (padding 9/9/9/6.5, a lone card 38% of its row, the current card cut by its row). 105, 53, 92, 107: the first-time light's fit. 36: the coach's own lights have no call (samosa's fill and fold, maani's board, sekelo's first bowl). 104: card pictures slower than 600 ms (preload them in `ui.js`). 111: daar's bowls untappable while a jar pours; samosa's shelf at one sample as it opened (`St.freePick`). |
| s19-games-2 (chop) | Daar's chop phase is chop's game: 114 (24 of daar's 28), 115 (12), 65, 36 ("dungri na", "ba mirchi"). |
| mine, next round | 78 and 36 on samosa's knob, fry and lift and maani's flip: they light only through the first-time coach, so from L2 the call has no light. Next: `Cook.Coach.control`, as eggs and chai. |
| Zafar (accepted) | 114: maani's board → tawa → plate shrink and samosa's close-up fold (both glide). |
| language | 36: "Put the vegetables in", the daar's pour and sekelo's "put it on the grill" have no recording (skip logged ~1.1 s before the light). 37: no lexicon plurals for bataato, chundo ("bataata", "chunda"). |
| the checks | 114 jumps and rests when frames come 180-500 ms apart. 37 sekelo L1: the meat bowl says gos, the card mishkaki (SEK-19). |

## What changed
- **Art:** daar's v4 pot (empty, with oil) and six discs laid in by code; samosa's karahi with oil (its oil 0.77 of the body, so samosas in it 0.86 their old size) and the napkin plate; maani's board and pin; sekelo's eight bowls on the band and chicken, chilli and corn in four stages. Every file is in its game's `assets`; `check_vessel_meta.py`'s CHAKLA stays.
- **Fixes:** sekelo's bowls follow the level table (L1: the order's pieces and one decoy). Glides, not jumps: samosa's fry plate, sekelo's trays and skewers (`SK.glide`), daar's heaps, maani's ball.

## For s19-serve2 (`data/cook.json` prefetch)
Add `v4/daar/pot-empty`, `pot-oil`, `disc-*`; `v4/samosa/karahi-oil`, `plate-napkin`; `v4/maani/board`, `pin`; `v4/sekelo/bowl-*`, `{chicken,chilli,corn}-*`. Drop `v3/daar/pot-*`, `items-s08b/daar-pot-top-s08b`, `daar-discs/*`, `v3/samosa/karahi`, `plate`, `v3/maani/chakla`, `velan`, `v3/sekelo/heap-*`, `items-s08c/sekelo/*`.

## Proof
PROOF_LINES
