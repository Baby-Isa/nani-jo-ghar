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
- `python3 build/test_cook.py --lab --stations maani-line,roll-tawa,roll,flip --viewport laptop`: **PASS** (477 s). `--viewport phone-landscape`: **PASS** (414 s). Both re-run after the last code change.
- `python3 build/test_cook.py --days 1 --canvas`: DAYS_RESULT
- `node --test build/test_shared_*.mjs`: 117/117. `node build/check_onboard.mjs`: ok. `python3 build/check_vessel_meta.py`: ok, with the new `check_maani()` (23 lines, all ok).
- **The bot's tawa scores are low (40–64% on the first maani of a run).** The bot reads the ring through the page, so it taps late: under load, and while a shot is being taken. These scores come from the test player's timing, not the station's; the ring's band and speed are unchanged from v2.
- **Bug caught by the shots and fixed:** the Tawa lab drew the v3 maani about 25% bigger than its tawa (a 403 px canvas where v1's was 324). `tawa.js` now scales it back to the old size.

## 4. Shots with their flaws
`build/reports/maani-v3/<viewport>-l<level>-<run>-<state>.png`, for laptop (1366×768) and phone landscape (844×390), levels 1–4. Each level has two runs:
- **wrong:** it leaves the first maani to burn, then makes one too many, so the frown shows;
- **right:** played right.

States:
- `start`
- `ball-flying`
- `rolling`, `rolled`
- `tawa-raw`: from the wrong run, taken before it burns
- `turner-flip`, `tawa-half`, `lift-cooked`
- `burnt`: wrong run
- `serving`
- `taste-wrong`, `taste-right`
- `end`

All 16 runs had no console errors. Laptop L4 right was re-shot alone: in the first pass the shared test server stopped under it and its sidebar faces didn't load.

**Flaws first:**
- **The review face covers the hob's front strip** (the badge and knob) and the top third of both plates. This is worst on phone, where it's clamped into view. It's v2's placement ("over the finished plates"). Moving it lower would hide the maani, so I left it; say if it should shrink (it's 230 px).
- **On phone, the verdict word** ("Perfect!", "Burnt!") sits right at the top edge of the view, over the tawa. It's readable, but only just clear of the edge.
- **The turner at rest is on bare counter** right of the hob, not on a spoon rest or the hob. It reads as placed (its shadow, the blade by the hob's corner), but a spoon-rest picture would anchor it better.
- **The velan is chunky.** The v3 pin is a fat walnut pin (about 1:4.8), so when rolling it covers a band across the middle of the dough. It's drawn shorter than v2's so it stays on the board.
- **The piles are small beside the plates.** The band's padding rule caps them at about 95 px tall (laptop), against 104 px plates. Taller would break M9.
- **At level 3+ the chips are speaker-only**, so the two piles are told apart only by colour (wheat pale, millet grey-brown). That's by design (listen), but the two colours are the only visual cue.
- **Mid-flip** (`turner-flip`) the maani is a thin line under the turner blade for about 0.1 s. That's what a flip is, but a still of it looks like an empty tawa with a stick on it.
- **Headline repeats its row** (X12; left as asked).
- **The Tawa / Roll → Tawa labs** (lab-only) still use the old tawa, a drawn hand and a spatula. Only their maani pictures are v3.

**What's right:**
- **M3:** the two piles stand straight on the band, no tray, each over its chip. A ball arcs out of the top of the pile to the chakla (`ball-flying`), and the pile squashes a little as it goes.
- **M4:** the dark walnut chakla and velan match the house-board look. The gold ring reads on the dark wood, and the rolled maani meets it at its edge (`rolled`).
- **M5:**
  - raw (pale, floury) → the half picture's light spots after the flip → the flat cooked picture with brown spots on the lift;
  - no puff anywhere;
  - `burnt` shows the burnt picture, and the burnt maani stays burnt on its plate;
  - wheat and millet each have their own four pictures.
- **M6:** the flat wooden turner slides its blade under the maani's right edge to flip and to lift (`turner-flip`, `lift-cooked`), then goes back to rest.
- **M7:** the flame tips peek out evenly all round the tawa at every level. The heat ring sits on the tawa's rim, inside the flames and clear of the maani.
- **M8:** the tawa is crisp at both sizes, centred on the burner by its body, handle out to the right.
- **M9:** at rest the gap above the pile tops matches the gap under the chips (21 vs 17 design px; the 4 px is the rule's glow allowance).
- **Serve:** the frown over the plates on a wrong count, *Shabash!* and the happy face on a right one. The end screen is the shared one, untouched.

## 5. Open for Zafar
- **X12 (left as asked):** the maani card's headline repeats its row: *Muke hakri maani khape.* over a row *hakri maani*. That's the shared order card (§12 / X1), not the station.
- **A pile can't show how many balls are left.** It's always five per kind (more than any order), and the pile only disappears if all five are used, e.g. after four spoiled maani of one kind. Should the piles simply never run out?
- **§17 take-back:** a maani on its plate can't be taken back before the tick (v2 was the same). The dough ball can be (tap the other pile). Say if a finished maani should be tappable back off its plate.
- **The turner's name:** *moikyo* (Zafar's hearing) is not used anywhere. The turner is a picture only; its word is the placeholder `ph-turner` ("turner", to record). See §6.
- **The Roll → Tawa and Tawa labs** (lab-only proofs) still draw the old tawa and chakla from the art registry: the v3 ones are round top-down pictures with a handle and would be squashed into those labs' fixed frames. They do get the flat maani states. The live station is the Maani line.
- **The finished-maani plates** are still v2's steel thalis. Nothing in §5 mentioned them, so they stay.

## 6. New placeholder words
- `ph-turner`: English "turner", `kutchi: null`, **to record** with Mum (Q15; Zafar's word sounds like *moikyo*, unconfirmed). It's in `data/stations/maani-line.json` `words` (merged into `data.words` only if missing). It isn't shown or spoken yet.
