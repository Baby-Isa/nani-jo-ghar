# C3: Cook ready to play (decisions 38d, 41)

**Mechanics changed:** the pantry tray and the samosa fill take things back with a tap. A skewer turned too soon, or left to char, goes back to the rack (SEK-09, decided 30 Sept). Nani no longer counts along at level 2 (she used to count chai's sugar there). **Old art reused:** all of it. Nothing new.

## 1. Shims
- **Bulb:** done. Cook builds on `Bulb.create`; `cookShim` is no longer called (it is left in the read-only `bulb.js`).
- **Word stages:** done. They are read and written through core Progress; Cook's own records are kept only for the parked pages.
- **Voice:** done. Every line goes through `core.voice.say`, played by Cook's player.
- **Station iframes: not done.** Cook is one Phaser page with its own DOM, about 50 global scripts and no teardown. The host would need Cook to start and stop inside an element it is given, and that was too big for the stop time.
- **Legacy stars:** kept and marked. Find it, Dress up and Snap still use them.

## 2. Counting rule (order said at the start; the face replays it)
- **Pantry:** one of each, so no numbers. Counted along at L1.
- **Chai tray:** sugar is written at L1–2. From L3 it is not written (it was before). Counted at L1 only.
- **Maani:** rows are written at L1–2. The headline is the dish line. L1 has no counting along (it is one maani).
- **Daar / chop:** DAAR-08 is fixed: no written numbers from L3. In Nani's line the number shows as dots (•••). Her card's face now replays the line. Counted at L1.
- **Stir, tadka:** laps counted at L1; tadka has no counts.
- **Chaat, sekelo:** written at L1–2 only.
- **Samosa:** the headline loses its number from L3 too. Counted at L1.

## 3. Rows
- **Built:** PAN-01, MAA-01, MAA-08, SEK-07 (rechecked, no change needed), SEK-09, SH-35 (rechecked), DAAR-08, SH-13. The bubble and choice speakers are now 48 px.
- **Take-back:** pantry, samosa fill, and maani (the ball goes back to its pile). Not possible, and the art shows it: chop, tadka, stir, daar, and the chai tray and recipe.
- **Skipped:** CHAI-07/08, DAAR-02, PAN-09 (need art), CHAI-01 (fun pass), PAN-02 (needs the engine).

## 4. Proof
- **`c3-proof`, `--touched cook:` (248 pages):** every flow reaches its end. 450 old findings are fixed. There were 4 new `covers-play-area`: the bigger speakers grew the greeting choices. That is fixed, and the re-run (`c3-proof2`, 12 pages) shows 0 new. `c3-proof3` (daar L3/L4, the take-back flows): 0 new.
- **Other checks:** leak_cook, test_cook_host, smoke, check_onboard, core, voice and lang all pass.

## Left
- The sandbox's take-back path runs under the first-time coach, so it can't reach the take-backs. I checked them with unguided probes.
- Samosa: Done stays up after every spoonful is taken back.
- The chop knife shows a hand (ART-13). Not new.
- `test_cook.py` can't run here (no Python Playwright).
- A second reviewer is still needed.

Shots: `build/screenshots/sandbox/c3-proof*/` (not committed).
