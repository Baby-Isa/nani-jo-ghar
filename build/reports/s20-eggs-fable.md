# s20-eggs-fable: eggs' faults from the Fable eye judge (15 Nov)

Files: eggs.js, eggs.json (and a test note, `eggs-next`). No row status changed.

## What a child sees (L1-L4, every size)
- **CK-121:** a person's card folds and ticks when their plate is done. At well done every row is folded, ticked and in view.
- **CK-122:** the fried egg fills 0.6 of the pan's floor and glides to near its plate size as it's lifted. The boiled egg is 1.04 of the pot's floor radius (was 0.7), and bigger in the hand too.
- **CK-123:** water in the pot from the first egg's landing (the kit's `St.shade`, no new art), boiling up to its green.
- **CK-124 (half):** a plate's light stops short of every other face, burner faces included. **Not built:** the pot's light round its handle, which failed contract-112 at 1280x665 L3 (the pot reaches past the view). Vessels keep their round-body box.
- **CK-125:** Nani's line holds while its egg or shaker flies; only an egg's green interrupts.
- **CK-126:** each egg's take-out call at its own green (it was skipped as "said a moment ago"); a shaker on its way never holds a green back.

## Calls taken while Zafar was away
1. The eggs stop cooking while the grown-ups' "?" pop-up is open. The kit hides the light there (`js/shared/onboard.js:1017`) but still says the call (`js/cook/coach.js`).
2. The fried egg shrinks a little as it's lifted. contract-114 is zero at a child's pace. At the test speed the plate tap comes inside 300 ms, so there's no hand rest: -23% (advisory). For Zafar, on pictures: bigger plates, or accept the glide.

## For the kit session
- **CK-120 is the kit's:** `css/shared/order-card.css:92` keeps the hidden tick's room on the open card, and this head doesn't fit beside it. Chai's folded heads wrap too.
- contract-83 (a card over Nana's panel face at 740x320): SH-305.
- contract-70/-78 at the child's pace, now and then: the call is still queued when the test child acts first. That needs the kit's call queue.

## Proof
- **Eggs gate** `gate-20261115T0709-eggs`: FAIL, 8.9 min. Checks pass, 2.4. Contract 6.5: 1 blocking (contract-83, SH-305), 17 advisory.
- **Chai gate** `gate-20261115T0718-chai-tray` (`--skip-checks`): PASS, 24.9 min. Contract 21.6 (0 blocking, 38 pages); boxes identical, 3.3.
- **Child's pace** `eggs-fable-speed1-b` (L1, L4; two sizes): -70 1, -78 0, -83 0, -114 0.
- **Four sizes** `s20-eggs-fable-contract`: 20/20 pages reach their end. 0 blocking; 27 advisory (-119 8, -78 6, -37 5, -70 4, -114 4).
- **Sidebyside for the judge:** `build/screenshots/sidebyside/eggs-L4-20261115-0757/`, on this machine only (git ignores it). To remake: `sidebyside.mjs eggs --level 4 --sizes 740x320,1280x665`.
- **Evidence:** the rows have no evidence spec, so there are no before or after folders. **checks.mjs:** pass.
- **check-change:** cut by my 40-min timeout in its last part (frozen), so no result file. Play: 13 advisory breaks. It fails outside my files: scope (corn.js, from the base) and rows (SH-277 has no spec).
