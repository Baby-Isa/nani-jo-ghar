# s14-cook: every Cook station on the s14 kit and the central rules (30 Oct)

## What changed
- **Look (all six):** s14 on for every dish (`UI.S14_ALL`): order said item by item with big cards into item-card rows (samosa's
  fillings, maani's rotis, plain skewers too), helper card from the step's item, word pill, card never folded, the light hugging
  its picture, the order card lit once after a quiet spell.
- **Numbers** from `data/rules.json` via `Recipes.fromRules`: pantry 3-6, maani 2-5, skewers 1-4, samosa 2,3,4,**6** (six oil places,
  six strips), chaat 3-6 (a layer said twice counts twice), daar X+Y 1+2…4+4. `levelTable` rows gone (`Cook.levelRow` reads
  `Rules.level`); CK-50 on `noAsks`; samosa/chaat "no" from L2; decoys 1-4.
- **First-time hold:** maani flip, grill turn, samosa fry (`St.firstHold`). Daar's tadka has no timer: none.
- **Shared (additive):** `js/shared/rules.js` `Rules.part`; `js/shared/onboard.js` run layer takes `ob-s14` (warm fill).
- Checks widened to the kit (35, 37 `room:n`, 39, 44 taps-only); harness fills recipes from rules.

## Proof
- Unit: `build/test_cook_rules_counts.mjs` 9/9. Live counts (lab `order-count`): every station L1-L4 as above.
- Timeline: `timed-hold start/end` on maani, grill, samosa (`s14-cook-p2`).
- Contract `s14-cook-contract2`: `CONTRACT PASSED: 0 breaks over 28 pages`; fetch stopped at 740x320 and 1280x665 (pass-me click).
- After: `build/screenshots/brief/s14-cook/`. Load: `loadcheck` 11/11 Cook pages.

## Open
- Pantry pass-me: the sandbox player's click times out (a script clicks it); likely her ring ends with the expectation still set.
- Grill L2-L4 stops at "wait" in the sandbox (the before too).
- For Zafar: DAAR-34's staged dots and samosa's per-samosa boxes are off on the s14 look.
- Not done: noLast for dish cards, "items not on the card shown at the start".
