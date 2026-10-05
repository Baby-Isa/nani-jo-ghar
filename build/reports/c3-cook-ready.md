# C3: Cook ready to play (decisions 38d, 41)

**Mechanics changed:** the pantry tray and the samosa fill take things back (tap); a skewer turned too soon or left to char goes back to the rack (SEK-09, decided 30 Sept); Nani no longer counts along at level 2 (chai's sugar did). **Old art reused:** all of it; nothing new.

## 1. Shims
- **Bulb:** Cook's UI builds on `Bulb.create` (`js/cook/ui.js`); `Bulb.cookShim` is no longer called (left in `js/shared/bulb.js`, read-only).
- **Word stages:** read and written through core Progress (`js/cook/core.js`); Cook's own records only on parked pages.
- **Voice:** every line plays through `core.voice.say` on one channel, with Cook's Web Audio player (`js/cook/boot.js`).
- **Station iframes: not done.** Cook is one Phaser page with its own DOM (`#side`, `#mission`, `#panel`), ~50 global scripts and no teardown; mounting it in the host needs Cook to start and stop inside a given element. Too big for tonight.
- **Legacy stars:** kept, marked; Find it, Dress up and Snap use them.

## 2. Counting rule
PROOF_COUNTING

## 3. Rows
- **Built:** PAN-01, MAA-01, MAA-08, SEK-07 (rechecked, no change), SEK-09, SH-35 (rechecked), DAAR-08, SH-13; tap-small (bubble and choice speakers 48 px).
- **Take-back:** pantry, samosa fill, maani (ball back to its pile, already there). Not possible, and the art shows it: chop (cut), tadka (in hot oil), stir (laps), daar (all three), chai tray and the chai recipe (liquids and sugar in the pan).
- **Skipped:** CHAI-07/08, DAAR-02, PAN-09 (art), CHAI-01 (fun pass), PAN-02 (engine).

## 4. Proof
PROOF_RUN

## Left
- Samosa: Done stays up after every spoonful is taken back.
- Maani L1 has no counting along (one maani; nothing counts up).
- `build/test_cook.py` can't run here (no Python Playwright).
- A second reviewer (orchestrator).
