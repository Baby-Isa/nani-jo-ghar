# Daar v2 (29 Sept, §13)

**New:** one combined station, `js/cook/stations/daar.js` (the lab's "Daar"; the recipe runs it).
- **Chop:** Nani's chop card (`UI.mission.addCard`) (face, *Chop these*, *ba dungri*, *hakro tameto*); Nana's card folds meanwhile. Tap a crate on the shelf band, then the knife: it chops on its own (no hands), the pieces go into the katori and the word pops. The rows tick at the tick.
- **Cook:** the kitchen kit hob, one burner, one pot. Knob → heat ring → spices in Nani's order → vegetables → daar. Stir by dragging (or tapping) the pot; the count shows only as the Kutchi word (*hakro, ba, trae*).
- **Serve and taste:** right = *Shabash!*; not quite = a gentle face, Nana repeats his order, cook again (first try logged).

**Spent: $0** (all existing art).

**TO CONFIRM:** *Chop these* (English, to record); *hakro* as the first stir count.

**Gaps (queue):** the kit has no pot yet; a hidden tadka section lets the card fold early (L4 uses dots).

**Tests:** `test_cook.py --lab --viewport laptop` PASS.

**Best:** `daar-v2/laptop-l2-wrong-chopped.png`, `laptop-l1-stir-mid.png`, `laptop-l3-taste-right.png` (notes: `daar-v2/qa.md`).

## Polish (29 Sept, ~04:00 UTC)
- **Level 4 has no "•••" rows now:** in the cook, Nana's card starts closed (face + headline) with the shared `UI.mission.closeCards(true, {peek: true})`. Tapping it opens it for a moment and costs a hint, as in chaat L4. Levels 1–3 show the tadka words (data: `ladder` is `words` or `closed`; no dots or hidden rows).
- **"Don't" rows stay neutral:** *dungri na* uses the shared no-row style (dashed edge, no-sign, no full stop) on both Nani's and Nana's cards, and daar never ticks it. The sidebar's `settle()` still ticks no-rows once the other rows close, so daar puts them back (`neutralNo()`) until the shared fix lands (queue note).
- **Shared calls only:** Nani's card uses `addCard` / `removeCard` and the phase fold uses `closeCards`. The fallback `#dv2-nani` box and its `dv2-fold` style are gone.
- **Early fold:** daar no longer hides the tadka section, so the hidden-section early ✓ can't happen. **Not fixed (shared, queue note):** after the last spice every row is done, so Nana's card still shows ✓ during the stir. The card needs to wait for its head (*daar*, closed at the serve), the same fix as samosa's.
- **Shots:** re-shot the matrix into `daar-v2/`, plus `laptop-l2-no-*` (a round with *dungri na*). `build/shoot_daar_v2.py --no` forces that round.
- **Tests (polish):** `test_cook.py --lab --viewport laptop` PASS (212 shots). Version bumped.
