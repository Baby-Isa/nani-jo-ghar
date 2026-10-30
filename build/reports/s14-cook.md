# s14-cook: every Cook station on the s14 kit and the central rules (30 Oct)

## What changed
- **Look, every dish** (`UI.S14_ALL`): the order said item by item, big cards into item-card rows (samosa's fillings, maani's
  rotis, plain skewers too), helper card from the step's item, word pill, card never folded, the light hugging its picture, the
  order card lit once after a quiet spell.
- **Numbers** from `data/rules.json` (`Recipes.fromRules`): pantry 3-6, maani 2-5, skewers 1-4, samosa 2,3,4,**6** (six oil places
  and strips), chaat 3-6 (a layer said twice counts twice), daar X+Y 1+2…4+4. `levelTable` rows gone (`Cook.levelRow` on
  `Rules.level`), CK-50 on `noAsks`, "no" from L2, decoys 1-4.
- **First-time hold:** maani flip, grill turn, samosa fry (`St.firstHold`). Daar's tadka has no timer: none.
- **Shared, additive:** `js/shared/rules.js` `Rules.part`; `js/shared/onboard.js` run layer gets `ob-s14` (warm fill).
- Checks 35/37/39/44 widened to the kit; tests, harness, chaat leak bot, returning flows brought along.

## Proof
- After: `build/screenshots/brief/s14-cook/` (probe B at L4 "onboard never came", as in the before: no first-time help from L3).
- Contract `s14-cook-contract2`: `CONTRACT PASSED: 0 breaks over 28 pages`; fetch stopped at 740x320 and 1280x665 (pass-me).
- Unit `test_cook_rules_counts` 9/9; live `order-count` per level as above; `timed-hold` start/end on maani, grill, samosa.
- `checks.mjs` all ok (unit 619/0, leak 19, load 29/29); loadtime within 20%.

## Open
- Pantry pass-me: the sandbox player misses its 3 s ring (a script clicks it).
- Grill L2-L4 stops at "wait" with a skewer never threaded (the before too).
- contract-85: the pantry has no marble worktop; daar's garlic shelf picture differs between rounds.
- For Zafar: DAAR-34's staged dots and samosa's per-samosa boxes are off on the s14 look.
- Not done: noLast for dish cards; "items not on the card shown first".
