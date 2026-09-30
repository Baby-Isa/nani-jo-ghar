# Maani v3 (29 Sept play-test §5: M3–M9, Q14, Q15)

Branch `claude/cook-maani-v3`. Station `js/cook/stations/maani-line.js` (and the lab proof `roll-tawa.js`, unchanged), the mechanics it uses (`js/cook/mechanics/roll.js`, `tawa.js`), its data (`data/stations/maani-line.json`, the maani art registry and onboard script in `data/cook.json`), the shoot script `build/shoot_maani_v2.py`, shots `build/reports/maani-v3/`.

## 1. Mechanics changed or removed
- **The dough (M3 / Q14):** the two steel plates of five drawn balls are **replaced** by one realistic pile per kind (`dough-pile-wheat`, `dough-pile-millet`), standing straight on the shelf band, no tray. Tap a pile and **one ball flies out** (`dough-ball-*`) in an arc to the chakla; the pile gives a small squash as it goes. Tapping the other pile before you roll still sends the ball back (it flies back into its pile: §17). Nothing else about the pick changed: still five balls per kind (never shown), the same wiggle when the board is busy.
  - One consequence: the plate *showed* how many balls were left; a pile is one picture, so it can't. If a pile ever runs out (only after four spoiled tries of one kind), it fades away, and comes back if a ball is put back. See §5.
- **The flip and lift (M6 / Q15):** the v2 chimta is **replaced** by the flat wooden turner (`turner`). Same taps, same timing: in the green, the turner slides its blade under the maani's right edge and it flips; in the green again, the turner lifts it off onto its plate.
- **Cooked maani (M5):** the puffed picture is no longer "done" anywhere.
  - The raw side cooks up (a warm tint as the ring fills, as before); the flip shows the spotted **half** picture; lifted in the green it's the flat **cooked** picture. Lifted too early it stays the half picture; left too long (either side) it's the **burnt** picture. v2 tinted the puffed picture dark for "burnt".
  - The lift's "slight puff" is now a 3% lift (was 7%), no poori ball. The verdict word on a good lift is "Perfect!" (v2 said "It puffed!", which a flat maani doesn't); a too-early lift says "Too early" (v2 said "Flat").
- **The tawa mechanic (`tawa.js`, used by the Tawa and Roll → Tawa labs):** its done step no longer balloons (was 1.3× with a burst), and a burnt one uses the burnt picture when there is one. Default verdict "Perfect!" instead of "It puffed!". Its layout, taps and scoring are unchanged.
- **The roll mechanic (`roll.js`):** one new optional param, `body(key)`: how much of its canvas the dough's round body fills, so the v3 dough's **edge** (not its transparent box) meets the gold ring. Without it (the Roll lab, Roll → Tawa), it's exactly as before.
- Nothing removed beyond that: one tawa, the knob (high/low), the face (hear the order again), the gold ring, the rolled maani waiting on the board, the fanned plates, the tick and the review face are all as v2.

**Shared files touched: none** (no `kitchen-kit.js`, `ui.js`, order card, `station-lib.js`, `recipes.js` or `order.js` change). The new tawa is placed in `maani-line.js` from its own measured constants rather than by changing `Cook.Kit.VESSELS.tawa`, which still points at the old tawa. In `data/cook.json` only maani's own entries changed: the `cook-maani` / `cook-bajrmaani` sprite states, one new prop (`chapati-burnt`), and the maani onboard notes.

## 2. What was built
- **M3 / Q14, the dough:** the two piles in the shelf band under the chakla, each over its `🔊 word` chip (speaker only from level 3). The ball comes off the top of the pile at the pile's own scale (the art's balls and the single ball were drawn at one scale) and grows to the start size on the chakla.
- **M4, board and pin:** the dark walnut `chakla`, centred by its measured round body (0.4988, 0.4988; r 0.4746), and the walnut `velan`, resting on the board's front edge and rolling on its own. The v3 pin is much thicker than v2's, so it's drawn shorter (440 px, was 540) to stay on the board.
- **M5, flat maani:** all four states per kind (`maani-{wheat,millet}-{raw,half,cooked,burnt}`) share one registered canvas, so they swap in place. Each is sized by its disc (0.44 of its width), not its box, on the board, on the tawa and on the plate. The data registry's `cook-maani` / `cook-bajrmaani` states now point at the v3 files too (`done` = cooked, plus `burnt` and `bowl`), so the Roll, Tawa and Roll → Tawa labs and anything that shows a maani's picture get the flat one.
- **M6 / Q15, the turner:** it rests on the counter to the right of the hob, blade by the hob's corner, handle up and away (placed, not floating), with a soft drop shadow. It moves by its blade's middle (measured: 0.19, 0.73 of the art).
- **M7, the flames:** `flameR` is now 0.95 × the tawa's body (v2: 0.74, which hid the flame ring under the tawa except at the top and bottom). The tips now peek out evenly all the way round, as in chai and daar. The heat ring moved **onto the tawa's rim** (r − 14), inside the flames and outside the maani; v2's ring sat outside the tawa, where it would now have been on the flame tips (X6).
- **M8, the tawa:** the hi-res `tawa` (1221 px wide), placed by its measured body (0.3533, 0.4978; r 0.3386), handle to the right.
- **M9, spacing:** the piles stand on a line 10 px above the chip tops and are sized with `St.shelfFit` (no hop reserve: a pile doesn't bounce). At rest the gap from the band's top to the pile tops is 21 design px, against 17 px under the chips; the 4 px difference is the shared rule's glow allowance.
- **`build/check_vessel_meta.py` gains `check_maani()`:** `maani-line.js`'s TAWA and CHAKLA constants must match `v3/maani/meta.json`; the tawa's recorded centre and radius must sit on its re-fitted rim with the handle dropped (off 0.0011); every maani state must share the raw one's canvas and anchor, with its radius within 1.5% of DISC_R; each dough ball's radius must match BALL_R.
- **Onboarding:** `data.onboard["maani-line"]`'s notes now say pile and turner. Same four ghost-finger steps; `check_onboard` ok.
- **Shoot script:** `build/shoot_maani_v2.py` rewritten for v3's states. It slows the scene's tweens for a moment to catch the ball in the air and the turner mid-move.

## 3. Tests
_(filled in below)_

## 4. Shots with their flaws
_(filled in below)_

## 5. Open for Zafar
- **X12 (left as asked):** the maani card's headline repeats its row: *Muke hakri maani khape.* over a row *hakri maani*. That's the shared order card (§12 / X1), not the station.
- **A pile can't show how many balls are left.** It's always five per kind (more than any order), and the pile only disappears if all five are used, e.g. after four spoiled maani of one kind. Should the piles simply never run out?
- **§17 take-back:** a maani on its plate can't be taken back before the tick (v2 was the same). The dough ball can be (tap the other pile). Say if a finished maani should be tappable back off its plate.
- **The turner's name:** *moikyo* (Zafar's hearing) is not used anywhere. The turner is a picture only; its word is the placeholder `ph-turner` ("turner", to record). See §6.
- **The Roll → Tawa and Tawa labs** (lab-only proofs) still draw the old tawa and chakla from the art registry: the v3 ones are round top-down pictures with a handle and would be squashed into those labs' fixed frames. They do get the flat maani states. The live station is the Maani line.
- **The finished-maani plates** are still v2's steel thalis. Nothing in §5 mentioned them, so they stay.

## 6. New placeholder words
- `ph-turner`: English "turner", `kutchi: null`, **to record** with Mum (Q15; Zafar's word sounds like *moikyo*, unconfirmed). It's in `data/stations/maani-line.json` `words` (merged into `data.words` only if missing). It isn't shown or spoken yet.
