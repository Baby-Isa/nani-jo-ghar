# Order-card follow-ups (29 Sept, overnight)

**Fixed**
- **Order card:** closed cards and a peek that costs a hint (`opts.closed` and `onPeek`; Cook's `UI.mission.closeCards`). Chaat level 4 now uses these.
- **"Don't" row:** dashed and muted, with a small no-sign. Rows are lower case with no full stop.
- **Nani's chop card:** stations can add it with `addCard` / `removeCard`, and use the phase fold.
- **Sekelo:** the headline never fades to dots. The rack is now real slats and rails, and the pieces are cube-sized.
- **Level-4 light-bulb test:** the game was fine; the test was racing a 333 ms flip.
- **Chai:** at level 1 the leaves chip reads *chai*, and the tally is gone at serving.
- **Chaat:** the layers are curved, thinner and untiled, and the bowl is centred.

**Not fixed**
- **The cream band:** it comes from Phaser letterboxing the 1600×900 world (`flow.js:1245`), which is shared. There's a note in the queue.
- **Maani, samosa and daar** haven't switched to the new card APIs yet. There are notes in the queue.

**TO RECORD / confirm**
- *mixed* and *boga* are both recorded (family-audio B18, B17), so I kept them.
- *Muke sekelo khape* still needs confirming.

**Before / after**
- `followups/chaat-layers-before.jpg` → `chaat-layers-after-l3-full.jpg`
- `followups/sekelo-rack-before.jpg` → `sekelo-rack-after.jpg`
- `followups/order-card-no-row-and-closed.png`, `followups/chai/laptop-l1-start.png`
