# s20-eggs-fable: eggs' faults from the Fable eye judge (15 Nov)

Files: eggs.js, eggs.json. No row status changed.

## What a child sees (L1-L4, every size)
- **CK-121:** a person's card folds and ticks when their plate is done; every row is folded, ticked and in view at well done. The cause was eggs' own (no `closePan` of a person); SH-308 doing it too is harmless.
- **CK-122 (decision 38's call):** plates 0.38 to 0.40 of the tray (the wells' limit), the fried egg 0.8 of its plate (two: 0.7). In the pan it is the larger of half the floor and its hand size, so at 1280 and up it keeps one size; at 740x320 it glides 420 ms to its hand size as it's lifted. The boiled egg is 1.04 of the pot's floor radius (was 0.7), and bigger in the hand too.
- **CK-123:** water in the pot from the first egg's landing (the kit's `St.shade`), boiling up to its green.
- **CK-124 (half):** a plate's light stops short of every other face, burner faces included. **Not built:** the pot's light round its handle, which failed contract-112 at 1280x665 L3 (the pot reaches past the view). Vessels keep their round-body box.
- **CK-125:** Nani's line holds while its egg or shaker flies; only an egg's green interrupts.
- **CK-126:** each egg's take-out call at its own green (it was skipped as "said a moment ago"); a shaker on its way never holds a green back.

## Calls taken while Zafar was away
1. The eggs stop cooking while the grown-ups' "?" pop-up is open. The kit hides the light there (`js/shared/onboard.js:1017`) but still says the call (`js/cook/coach.js`).
2. A tap on overlapping eggs lifts the ripe one; no lift is asked for while a flight is in the air.

## For the kit session
- **CK-120 is the kit's:** `css/shared/order-card.css:92` keeps the hidden tick's room on the open card, and this head doesn't fit beside it. Chai's folded heads wrap too.
- contract-70/-78 at the child's pace, now and then: the call is still queued when the test child acts first. That needs the kit's call queue.

## Proof
- **Eggs gate** `gate-20261115T1009-eggs` (final code but the hand's 1.06): PASS, 9.6 min. Checks 2.5; contract 7.1: 0 blocking, 18 pages; 22 advisory (-119 8, -37 7, -70 4, -78 3), no -114.
- **Chai gate** `gate-20261115T0718-chai-tray`: PASS, 24.9 min; boxes identical. With 41eae54 (`T0918`): boxes identical, but 1 blocking from the base (contract-112, chai's aadu light, lab L4 740).
- **Child's pace** `eggs-fable-speed1-d`: -70 1, -78 1, -83 0, -114 0.
- **Four sizes** `s20-eggs-fable-contract` (before the plates): 20/20 pages end; 0 blocking.
- **Sidebyside for the judge:** `build/screenshots/sidebyside/eggs-L4-20261115-1031/` (final code; contract-70 x2) (not in git; remake: `sidebyside.mjs eggs --level 4 --sizes 740x320,1280x665`).
- **Evidence:** no specs for these rows, so no before/after. **checks.mjs:** pass.
- **check-change:** cut by my timeout (chai frozen: no change); fails outside my files (corn.js scope, SH-277 spec).
