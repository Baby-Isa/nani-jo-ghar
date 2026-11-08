# s19-cards: chai's cards in every kitchen game, no tick buttons, cards tick as made

Opus, high. Branch `s19-cards`. Flaws first.

## Flaws and open
- **Not done (files not mine):** CHAI-107 (`js/shared/serve.js`), SH-235 (`js/shared/buttons.js`, `css/shared/buttons.css`), the ART row (`docs/process/regressions.md`), the stir line's recording-sheet row (generated from `data/lang/seed`). Exact changes in the hand-back.
- **Maani flaw 5 not done:** the pop bubble still says the whole headline ("Muke hakri bajr ji maani khape"), which the voice says too; the big card still pops in the play area.
- **Sekelo's card English** loses its bracketed gloss ("one skewer of tomato"), but is not two words: that needs the engine's gloss.
- **Chop's "chop again" pop-up** (`M.askLine`) is still a headline-only big card.
- **No BEFORE folder:** none was played at launch; my own try from a pre-change copy never got the shared browser lock in 30 minutes. The before is the HEAD copy's contract run (0 breaks at 1280x665) and a DOM census (daar: `.oc-skewer`, `.oc-group`, a `.oc-big` tadka card; eggs: no picture).
- Count cards (qty > 1) tick when their last unit is made: the counting rule (SEK-25, CK-64) waits on Zafar.

## What changed
1. **Roll-out:** `UI.TYPE_ALL` on; `preLook` and `M.open` no longer gate on chai.
2. **One card path:** every dish row (ordered steps, samosa's kind and fillings, skewer pieces, Nani's chop card) is a 6 Nov item card (`OrderCard` items14). The skewer strip, group box, count box and sequence line are deleted from `order-card.js` and `order-card.css`. The tadka's order (`M.request`) is said one item card at a time. While Nani's chop card shows, the order's cards wait unseen (`.oc-held`).
3. **No ✓:** no `#done-btn` is made. `UI.done` moves on by itself through `NjgButtons.moveOn`, and each game calls it when complete: maani at its count, fill and fry and fold and roll and count at theirs, the stir and daar's stir at their laps, chaat when its layers are in, samosa when its strips are filled, the grill when its skewers are plated. The `?` texts no longer name the tick or "the gold ring".
4. **Ticks as made:** `M.tickCard` ticks a row once all its units are made, and `M.reopen` resets them.
5. **One of the thing:** card pictures come from `data/cook.json words[id].card` (onion, tomato, potato, chilli, garlic, ginger, lemon) and eggs' `items.*.card`. Chai's jars are unchanged. Stir's and chaat's manifests now list them.
6. **Text:** daar's stir line is a grey-italic English placeholder (`Lang.toRecord`); the tadka's step names one spice; "ne poi" is out of the word review; card English drops bracketed glosses; Nani's helper drop-down now works for pieces and chop items.

## Proof
- After folder: `build/screenshots/brief/s19-cards/` (see hand-back)
- Contract, four sizes: see hand-back
- Checks: words, static, specs ok; unit has 4 failures that were already there (art block ×3, CONTRACT_ROWS); loadcheck 32/32.
- Chai's frozen diff: see hand-back
