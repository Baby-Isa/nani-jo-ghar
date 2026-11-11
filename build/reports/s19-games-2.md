# s19-games-2: eggs, baking, corn, chop, chaat, chai and the pantry on the new art; their breaks (11 Nov)

Opus, high. Branch `s19-games-2`, never pushed. Flaws first.

## Flaws and open
- **Corn's plate step (Zafar):** the cob now keeps the grill's size on the tray, so on screen 2's cream plate it shrinks 19-23% at
  1280x665 and 44% at 740x320 (contract-114, 12 left): the plates there are smaller than a grill-length cob. Bigger plates on screen 2,
  or a cob that may reach past the plate's rim?
- **Chop's band (Zafar or s19-serve2):** 115's 12 are the chilli (veg-12, lying: 52% of chai's S height) and the potato and ginger capped by
  the slot's width (83-87%): `sizeFlag: "LONG"` for veg-12 in data/cook.json words, or a check that measures a lying thing on its long side.
- **Checks that contradict each other or chai (s19-shared-checks):** 36 wants an item step called as it opens; 89 (SH-172) forbids it
  until her helper card opens (baking's step as a call cut 36 by 13 and added 8 to 89: reverted). 37 reads baking's card before its rows
  reveal and counts eggs' egg box as a decoy where the card says "boiled egg"; chaat's "mirchi na" topping (veg-12) reads as a decoy.
  109 wants one shelf line in the pantry, whose shelves are painted at different heights. Chai, untouched, keeps 55 breaks.
- **Shared code (s19-shared-checks):** 116 (the order card's one-card row and padding, 47); 113 (the side menu over a tray's face, 20);
  70 (a timed call queued behind the helper's line is dropped, `skip-closed`, when the child taps first); 78 in eggs (the light waits
  22 s for a still stage after the steam stopped counting: something else of the kit keeps moving); 72, 104, 106, 102.
- **Timeouts:** three 740x320 pages hit the sandbox's 300 s cap (eggs L3, chai L3 and L4; before: eggs L4, chai L3 and L4), load ~40 on
  4 cores; chai's code is unchanged.
- **Recording gaps** (already on the sheet): baking's v.open, naan put-in, "Tayar ai."; v.serve (eggs' tray, corn's serve).

## What changed
- **Art:** eggs' whole egg (E5) in the pot and on its card; the boiled halves in four looks, read from the ring as it is lifted (soft,
  firm, over; runny is before the green, never let out; only three loaded). Baking's naan tray in four stages, seen through the oven's
  glass on the rack: raw, part-baked, baked at the green, overdone if left `overMs` (a look, never a verdict). The pot trial: the redrawn
  pot measured (`items.potTop.body`), still behind `scene.potTrial: false`.
- **Corn (Zafar, 11 Nov):** the grill and the brushed-steel tray, turned upright, are one rectangle of the grill's height, as big as the
  worktop allows; a cob rests on the tray upright at its grill size (3% under); raw cobs on the band within 15%.
- **CHAI-89:** corn's rectangle, baking's bowl (with its pour room) and oven, and chop's board (knife, ring, peak with it) centred between
  the view's top and the shelf by chai's measure; eggs already was.
- **Snaps (114):** eggs' fried egg one size pan to plate, the halves fade in for the whole egg; baking's jug one width; chop's band fades
  in each round, a hop grows at most 8%, the halves keep 87% of their board size; corn's band.
- **Calls and lights:** the steam and smoke never hold a light (78); eggs' and chaat's shelf things hop in their light, chaat's lit with
  their pill (92, 105, 107); baking's jars by size class (115).

## Before → after (L1-L4, 740x320 and 1280x665; every check that moved)
BREAKS_TABLE

## The pot trial
`build/screenshots/sidebyside/g2-pot-trial/1280x665/pair-4-mid.png`: chai's pan left, eggs with the redrawn pot right (L1, the trial on for
the shot only). Zafar picks; chai unchanged.

## Not my files (exact lines)
- data/cook.json (s19-serve2): `art.sprites.shelf["fru-04"]: ["v4/pantry/orange", 0.9]` (was `shelf-fru-04-bare-f`), and
  `assets/cook/items/v4/pantry/orange.webp` in the pantry's load manifest. fetch.js needs no change: the shelf picks it by class.

## Proof
PROOF_LINES
