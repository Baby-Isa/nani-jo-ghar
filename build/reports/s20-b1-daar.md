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

## Rounds 4-5: decision 38 (the Fable eye judge for Zafar), DAAR-54 to -66
| Row | Now | How, or why not |
|---|---|---|
| 54 | built, one call | pairs always fit their cell, cells kept apart; a kind chopped in full leaves the tray at the end; daar's cut pieces stay on the board while chopping (its heaps wait at the side from the pot's step, KEEP-02); a long thing's halves lie one above the other where that fits; top strip first. Call: L2-L4 keep 2-3 things up at once (the level table; Zafar's 9 Nov "one at a time" was L1's) |
| 55 | not the game | the light check's own probe hides the light for its under-picture (`lightshot.mjs`); the strips should leave that window out |
| 56 | call | the finger draws the knife at +1.5 s (contract-112's still beat); recommend a 3.5 s strip for a cut |
| 57, 62, 63 | built in daar | Nani's face stays in her box; chop's well done in a clear board corner; the cut light takes in the whole board. 57 in chop alone is the kit's: `ui.js:1648` strips her box for any Nani-asked order |
| 58 | built | pills go with their items at once; the slots centred on the band the child sees; an empty slot is its item up in a hop |
| 59, 64 | kit | the pill cap (SH-219); the order bubble shows the part being read (the kit's read-along), not daar's |
| 60 | built | the kit's shadows; contract-98, -120 0 at #speed1 |
| 61 | built (the orchestrator's call) | chop's own serve: the round's halves in the kit's steel katori on Nani's tray (`Cook.Serve.plated`); her "Thank you!" where recorded (`flow.js` kitchenEnd: a dish its asker thanks for) |
| 65 | built | the knife starts clear of the settings gear, so the light ends before it |
| 66 | built, one call | the hob step fades in together (0.32 s) before its first light; the katori's face is chai's tray badge size (64) |

## Proof
- frame-counts: daar 0, chop 0, chai-tray 0.
- Pictures for the judge: `build/screenshots/sidebyside/daar-L4-s20b1-r5/`.
- Final: `gate-20261115T1324-daar+chop` **PASS** (checks 2.7 min; contract 0 blocking over 56 pages, 21.2 min; advisory 28). `gate-20261115T1254-chai-tray`: **boxes identical** (3.7 min); contract 1 blocking, contract-112 on lab chai L4 740x320 (the order card's light short of aadu's card), on the merged branch without this round (e19ff5d alone, the same break).
- The tray-keeps-its-item change (a twin rising from the slot) read to contract-112 as one thing moving inside the light (15 breaks, gate 1232): taken back; the tray is bare while its one kind is up in the demo.
- Pictures: `build/screenshots/sidebyside/chop-L1-s20b1-r5/` as well.
- Chaat contract (740x320, 1280x665): contract-26 and -111 only, as before.
