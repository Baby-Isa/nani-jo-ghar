# S02-B: Cook, every point from the 6 Oct play

Branch `ccr-a7370759-t0lee7`. Not reviewed yet: builder's notes only.

## What changed
1. **Step lines** (`St.steps`): chai, maani, daar (chop strip, *Chulo bar!*, tadka, veg, daar, *Firai!* + laps), chaat (next layer after a pause), samosa, sekelo. New lines are grey "to record".
2. **Redo one item**: daar (chop, tadka, stir), chaat layer, samosa (strip, count, pan), sekelo skewer; show-me on try 3.
3. **Chai**: burner ×2; sugar ticks at the count (L1); handle over the ring; black tea; drawn teaspoon.
4. **Maani**: no pile shadow; thali flat area; knob off, sizzle on a lit tawa only; pin above ring, +10%; ghost tap.
5. **Daar/chop**: trivet stays; ladle turns; stir row on the card; asked speed green; smaller margin-safe knife, blade cuts, wider and slower at L1, ghost drags it.
6. **Chaat**: two potatoes = two spoons; sequence said just before the bowl.
7. **Samosa**: one block per kind; knob toggles; inside oil/plate; top levels fill each strip; *matar* (decision 61).
8. **Sekelo**: count-along L1 only; each mix said after its skewer; pieces tick as they go on.
9. **Coin jar** summary; Next primary; days show a sun.
10. **Trays** per customer; pantry first time ever; Tadka lab-only; on-screen "pass me" (3 s ring, not first 2 plays).
11. Art-run ids in `data/cook.json art.s02` (`ready:false` until cut): kitchen, dishes, chai pour/glasses, teaspoon, plate, chaat glass, knife, bowl/trivet, fold frames, coin jar.

Edits outside the list: `js/cook/{flow,ui,order,main}.js`, `build/lang/hand/{words,cook-map}.mjs`, `build/lint/words-allow.json`, `data/lang/seed/cook.json`.

## Proof
checks.mjs ok (229 tests, 0 word literals); leak cook ok; check_onboard ok; engine tests 57/57. Probes (1366×768): every station, pass-me, day 1 and the jar. About 45 min of browser checks, **over the 15-min cap**; touched sandbox and shotdiff not run (whole-mode size), left to `/review`. 390×844 shows the rotate card.

## Open
Maani and pantry per-item redo; samosa strips laid out side by side; sekelo redo not seen live; grill *Firai!*; *Muke de* and new lines need Mum. QA checklist ⬜, for `/review`.
