# S02-B: Cook, every point from the 6 Oct play

Branch `ccr-a7370759-t0lee7`. Not reviewed yet: builder's notes only.

## What changed
1. **Step lines** (`St.steps`): chai, maani, daar (chop strip, *Chulo bar!*, tadka, veg, daar, *Firai!* + laps), chaat (next layer after a pause), samosa, sekelo. New lines are grey "to record".
2. **Redo one item, not the game**: daar per chop vegetable, tadka and stir; chaat per layer (his card re-said); samosa per strip, count and pan; sekelo keeps right skewers. Show-me on try 3.
3. **Chai**: burner ×2; sugar ticks at the count (L1); handle over the ring; black tea; drawn teaspoon.
4. **Maani**: no pile shadow; thali flat area; knob off, sizzle on a lit tawa only; pin above ring, +10%; ghost tap.
5. **Daar/chop**: trivet stays; ladle turns; stir row on the card; asked speed green; smaller margin-safe knife, blade cuts, wider and slower at L1, ghost drags it.
6. **Chaat**: two potatoes = two spoons; sequence said just before the bowl.
7. **Samosa**: one block per kind; knob toggles; inside oil/plate; top levels fill each strip; *matar* (decision 61).
8. **Sekelo**: count-along L1 only; each mix said after its skewer; pieces tick as they go on.
9. **Coin jar** summary; Next primary; days show a sun.
10. **Trays** per customer; pantry first time ever; Tadka lab-only; on-screen "pass me" (3 s ring, not first 2 plays).
11. Art-run ids wired in `data/cook.json art.s02` (`ready:false`): kitchen-trays, served-dishes, chai pour/glasses, teaspoon, sekelo-plate, chaat-glass, knife, daar-bowl/trivet, samosa-fold-1…6, coin-jar ×5, coin-pile.

Edits outside the list: `js/cook/{flow,ui,order,main}.js`, `build/lang/hand/{words,cook-map}.mjs`, `build/lint/words-allow.json`, `data/lang/seed/cook.json`.

## Proof
checks.mjs ok (229 tests, 0 word literals); leak cook ok; check_onboard ok; engine tests 57/57. Probes at 1366×768: chai, maani, daar L1/L2#mistake, chaat#mistake, samosa L1/L3, sekelo, pass-me, day 1 and the jar. About 45 min of browser checks, **over the 15-min cap**. Touched sandbox and shotdiff not run (whole-mode size): left to `/review`. 390×844 shows the rotate card.

## Open
Maani and pantry per-item redo; samosa strips laid out side by side; sekelo redo not seen live; grill *Firai!*; *Muke de* and new lines need Mum. QA checklist ⬜, for `/review`.
