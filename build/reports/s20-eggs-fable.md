# s20-eggs-fable: eggs' faults from the Fable eye judge (15 Nov, decision 38)

Branch `s20-eggs-fable` (from `ccr-7da5e9f0-04g4xm`, merged again before the gates). Files: `js/cook/stations/eggs.js`, `data/stations/eggs.json`. No row's status changed.

## What a child sees (L1-L4, every size)
- **CK-121:** each person's card folds with its tick as their plate is done, as chai's `closePan`. At well done every row is folded, ticked and in the panel.
- **CK-122:** the fried egg is 0.6 of the pan's floor (was a sixth at 740x320); lifted, it glides to its hand size, near its plate size. The boiled egg is 1.04 of the pot's floor radius (was 0.7); the hand egg grows with it. The heat ring is round the bigger egg.
- **CK-123:** water in the pot from the first egg's landing (the kit's `St.shade`, no new art), boiling up to its green.
- **CK-124 (half):** a plate's light stops short of every other face, the burner faces too. **Not built:** the pot's light with its handle. At 1280x665 L3 the pot reaches past the view and contract-112 (blocking) failed, so the vessels keep their round-body box (CK-63).
- **CK-125:** Nani's line holds while its egg or shaker flies; an egg's green alone interrupts.
- **CK-126:** each egg's take-out call at its own green (it was skipped as "said a moment ago"); a shaker on its way never holds a green back.

## Calls taken while Zafar was away
1. The eggs' cooking waits while the grown-ups' "?" pop-up is open. The kit buries the light there (`js/shared/onboard.js:1017`) but lets the call go (`js/cook/coach.js` C.control). A kit fix would cover every game.
2. The fried egg shrinks a little as it's lifted. At a child's pace contract-114 is zero. At the test speed the plate tap comes inside 300 ms, so there's no rest in the hand: -23% (advisory). Zafar's call, on pictures: bigger plates (b1-eggs Call 2), or the change accepted as a glide.
3. A test note, `eggs-next`.

## For the kit session
- **CK-120 is the kit's:** `css/shared/order-card.css:92` keeps the unseen tick's room on the open card. 'Muke hakro bafelo indo khapeto.' doesn't fit beside it. Chai's folded heads wrap the same way.
- contract-83, a word card 4 px² over Nana's panel face (L3/L4 740x320): SH-305.
- contract-70/-78 at the child's pace, now and then: a call still queued (behind a 2.1 s line, or held for its light) when the test child acts first. Needs the call queue.

## Proof
- **Eggs gate** `gate-20261115T0712-eggs`: FAIL, 8.9 min. Checks pass 2.4. Contract 6.5: 1 blocking (contract-83, kit SH-305); 17 advisory.
- **Chai gate** (`--skip-checks`): PASS, 24.9 min. Contract 21.6 (0 blocking over 38 pages), boxes identical 3.3.
- **Child's pace** `eggs-fable-speed1-b` (L1, L4 at 740x320 and 1280x665): contract-70 1, -78 0, -83 0, -114 0; contract-119 2 (kit).
- **Four sizes** `s20-eggs-fable-contract`: 20/20 pages reach their end, 0 page errors. 27 advisory breaks, 0 blocking: contract-119 8, -78 6, -37 5, -70 4, -114 4.
- **Sidebyside for the judge:** `build/screenshots/sidebyside/eggs-L4-20261115-0757/`.
- **Evidence:** CK-120 to CK-126 have no evidence spec, so there is no before or after folder.
- **checks.mjs:** pass. **check-change:** CHECKCHANGE
