# s20-b1-daar: daar and chop join the kitchen frame

Branch `s20-b1-daar` (from 115d900). Nothing a child sees moves, at any level or size.

## Round 1: the frame
- Daar and chop read only the kitchen frame (frame-counts 8 and 7 -> 0): daar's x's are shares of the play area, its hob's group centred in it; chop's board centred in it. New option `Cook.Frame.lend(part)`: a host lends the game it runs part of its play area (daar lends chop its whole one; SH-259). Chai's boxes identical; chaat's contract as base.
- Rows built: SH-259, SH-248. Checks passing on daar: SH-227, -241, -239, -242, -53, -236, -238 (contract-100, 108, 104, 8, 106, 103), SH-245 and CK-79 (contract-115), SH-249 and -253 (contract-112). Not here: CK-111, SH-275 (chop mechanic, art), SH-270, -281, -255 (kit).
- Outside my files: `placement.md` gains CHAI-109/110/112; the sprint file's corn-calls path reworded (tier 0 refused every push).

## Rounds 2-3 (decision 35; DAAR-39)
- Daar's "don't" card ticks once the rest of its card is done (contract-116); the spice order said once, in its pop-up (contract-22).
- Chop's first-time light keeps the hand's starting place for the whole move (`mechanics/chop.js` swipeBox: it shrank a frame before the page showed the knife moving; contract-112).
- `gate-20261115T0535-daar+chop` PASS (0 blocking over 56 pages), `gate-20261115T0556-chai-tray` PASS (boxes identical).

## Round 4: decision 38 (the Fable eye judge for Zafar), DAAR-54 to -63
| Row | Now | How, or why not |
|---|---|---|
| 54 | partly | cut pieces rest in the board's top strip first (the hops rise through the bottom one); a hop crossing the board's edge is the hop itself; daar's side heaps kept (KEEP-02) |
| 55 | not the game | the blink is contract-112's own probe hiding the light for its under-picture (`build/sandbox/lib/lightshot.mjs` HIDE); the light's state never changes (traced). The strips should leave out the probe's hidden window |
| 56 | call | the finger draws the knife at +1.5 s (still beat kept for contract-112's pictures); the 2 s strip ends first. Recommend: the strip runs 3.5 s for a cut |
| 57 | built | daar's chop card carries no face; Nani's face stays in her box |
| 58 | partly | a taken item's pill goes at once (no grey pill); the chilli's size is its size group (art) |
| 59 | kit | "laal marcha" shrinks to its pill's cap (Shelf.P.chip, kit rule SH-219) |
| 60 | built | heaps get the kit's shadow; contract-98 and -120 0 on daar L1, L4 and chop #speed1, both sizes |
| 61 | art and kit | no `assets/cook/serve/dish-chop.webp`; chop's asker is Nani, so the kit's end has no guest to thank |
| 62 | built | well done in a board corner clear of the pieces and knife |
| 63 | built | the cut light takes in the whole board and the knife's path |

## Proof
- frame-counts: daar 0, chop 0, chai-tray 0.
- Round 4 contract at a child's pace (`r4-speed1`: daar L1 and L4, chop L1 #speed1, 740x320 and 1280x665): 6 pages end, 0 page errors; contract-98 0, contract-120 0; left: contract-36 x1, contract-119 x1 (advisory).
- Pictures for the judge: `build/screenshots/sidebyside/daar-L4-s20b1-r4/`, `build/screenshots/sidebyside/chop-L1-s20b1-r4/`.
- `gate-20261115T0718-daar+chop` **PASS** (checks 2.3 min; contract 0 blocking over 56 pages, 21.4 min; advisory 28: 119 x11, 65 x7, 36 x4, 37 x3, 113 x2, 72 x1). `gate-20261115T0742-chai-tray` **PASS** (contract 0 blocking over 38 pages, 21.7 min; boxes identical, 3.6 min).
