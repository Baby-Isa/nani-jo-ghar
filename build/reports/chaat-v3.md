# Chaat v3 (29 Sept play-test §7: T1–T5, Q2b)

Branch `claude/cook-chaat-v3`. Mechanic `js/cook/mechanics/assemble.js` (and its lab entry), art `assets/cook/items/v3/chaat/`, shoot script `build/shoot_chaat_v2.py` (now shoots v3), shots `build/reports/chaat-v3/`.

## 1. Mechanics changed or removed
- **Nothing removed.** The build is the same: tap a pot and its topping goes into the bowl; Done serves it; a wrong bowl gets the frown, the order said again, the bowl empties and you rebuild. Levels, decoys, the "don't" row, the level 4 folded card and the first-time ghost finger are all unchanged.
- **Added: take it back (UX §17).** Until Done, **a tap on the bowl lifts the top layer back out.** It shrinks out of the bowl, a spoonful flies back to its pot, its card row goes back to "to do", and the guided glow moves back to it.
  - The first placement is still what's scored. A layer that was wrong when it went in counts as the first mistake (the ear star and the end review) even if it's taken back before Done.
  - One scoring change follows from this: a bowl that is right on the first serve, after a wrong layer was taken back, no longer scores 100% or marks every word right.
- **T5, the review:** unchanged from the shared session. Their big round face comes up over the bowl (`Cook.Kit.review`), with no body and no pretend eating. Right: a happy face and *Shabash!* Wrong: a frown and a small shake.
- **T1, quantities on the card:** unchanged from the shared session, and checked. 48 random chaat orders were made in the browser at levels 1–4. At levels 1–2, a chopped layer's row writes how many (*ba bataato*, *ba tameto*). From level 3 it shows the word only (Q7). The chop card at level 1 also writes it (see the chop shots).
- **The swipe chop:** chaat's `chop` step passes none of daar's new options (`knifeKey`, `onSlice`, `tally`, `timer`), so it runs exactly as before: the hand, the picture tally and the ring top left. It plays in every recipe shot below (lab PASS, recipe runs 100% chop).
- **Shared files touched: none.** Everything is in `assemble.js`, the chaat art folder, `check_vessel_meta.py` (a new `check_chaat()`) and the shoot script.

## 2. What was built
- **The side-on glass bowl (T3, Q2b):** `v3/chaat/bowl-side.webp`, 760 design px wide, centred over the shelf band.
  - It is placed by its **measured** inside. `build/check_vessel_meta.py` now has `measure_chaat_bowl()`, which finds from the art's alpha:
    - the rim's centre line (0.0599 of the height);
    - the inside floor's ring, back (0.6489) and front (0.8285);
    - the ring's half-width (0.304 of the width);
    - the glass wall's thickness under the rim;
    - the inside wall's left and right at 41 heights (the silhouette minus the wall, growing to the floor ring's width).
  - `python3 build/check_vessel_meta.py --write-chaat` writes these values into `meta.json`. Every run checks them against the art again, and checks `assemble.js`'s `BOWL` / `BOWL_INSIDE` / `POT` against `meta.json`.
- **The layers are side-on strips (T3):** each layer is the **same food as in its pot**, cut from the pot picture (below the jar's highlights and above its base). It is tiled at the bowl's scale, with mirrored seams and a few loose pieces over them so no two stretches match.
  - Each strip is clipped to the measured inside, with its front edge on the level's ellipse. That ellipse is flat at the rim (0.025) and rounder at the floor (0.150), as the art's own rings are.
  - A chutney is still a thin drizzle over the layer below. The top layer shows its surface.
- **The glass over the food:** a see-through copy of the bowl (45%) lies over the layers, so the walls and highlights are in front of the food. The floor's ring is cut out of that copy (it's behind the food: it showed through the bottom layer in my first shots).
- **The shelf (T2):** the side-on glass pots (`pot-*`, the pantry jars' look) stand on the shelf line. Each is placed by its measured bottom-centre anchor (0.5, 0.9514), with the same `🔊 word` chip under it as before (speaker only from level 3).
  - **The tomato pot is a stand-in.** The T2 sheet has no tomato, and tomato (`veg-03`) is one of chaat's toppings. `build/make_chaat_tomato_pot.py` recolours the onion pot's dice to tomato red (same canvas and anchor). See §5.
- **No ¾-angle bowls anywhere:** the v2 prep bowls, top-down piles and layer-strip art (`assets/cook/items/chaat-v2/`) are no longer loaded by anything. I left the files in place.
- **A spoonful** in flight is a soft-edged lump of that pot's food (side-on), 92 design px wide.
- **Shoot script** (`build/shoot_chaat_v2.py`, now v3):
  - it plays the **whole recipe** (`__cook.lab('recipe:chaat')`: the chop, then the bowl);
  - it shoots the chop start and mid-way, each layer in flight (`inNa`) and settled (`inN`), the full bowl, a wrong first serve and its rebuild, the right serve and the end screen;
  - at level 1 it also shoots the demo, at level 2 a take-back (`takeback-before`, `-after`), and at level 4 the peek.
  - `--matrix --vp laptop|phone-landscape [--levels 1,2]` writes `build/reports/chaat-v3/`.
- **Debug hook:** `Cook.assembleGot` (the bowl's contents, bottom first), for the scripts.

## 3. Tests
- `python3 build/test_cook.py --lab --stations assemble,chop --viewport laptop`: **PASS** (147 s). With `--viewport phone-landscape`: **PASS** (128 s).
- `python3 build/test_cook.py --days 1 --canvas`: **PASS on all 6 viewports** (flip5-landscape, laptop, laptop-16x10, laptop-1280x800, ipad, ipad-portrait), run one viewport at a time on the final code; `origin/main` had not moved since the branch started, so the merge was a no-op. Day 1 doesn't reach chaat.
- The lab runs above were repeated on the final code: laptop **PASS** (148 s), phone landscape **PASS** (133 s).
- `node --test build/test_shared_*.mjs`: **117/117**. `node build/check_onboard.mjs`: **ok**. `python3 build/check_vessel_meta.py`: **ok** (88 checks, 11 new for chaat: the bowl, plus the ten pots on one canvas).
- **Take-back,** checked in the browser (phone landscape, level 2):
  - bowl before `[chana, bataato]`, card `chana ✓ bataato ✓`;
  - after one tap on the bowl, `[chana]`, card `chana ✓ bataato ·`, and the next wanted is `bataato` again.
- **Recipe runs** (the shoot matrix, 8 runs, first serve wrong on purpose): every one ended *chop 100% · assemble 80%*, with no console errors.

## 4. Shots with their flaws
`build/reports/chaat-v3/<viewport>-l<level>-wrong-recipe-<state>.jpg`, for laptop (1366×768) and phone landscape (844×390), levels 1–4.

States: `chop-start`, `chop-mid` (missing where the bot sliced only once), `demo-card` and `demo` (level 1, laptop), `start`, `in1a…` / `in1…` (each layer in flight, then settled), `built` (the full bowl, wrong on purpose), `taste-wrong`, `rebuild`, `rebuilt`, `taste-right`, `end`, `takeback-before` and `-after` (level 2), `peek` (level 4). The "don't" row is on the card in the level 3 and 4 shots (*marcha na*, *tameto na*).

**Flaws first:**
- **Long orders make thin layers.** Level 3's seven layers are about 12 px each on laptop and 6 px on phone. The three greens (marcha, dhania, fudino ji chutney) are hard to tell apart when they are that thin, and when two of them sit together (level 3 `built`).
- **Tile seams:** zoomed ×2, dhania and tomato still show faint mirrored seams (a "V" where two tiles meet).
- **The drizzle's top** (a chutney on top) is a flat coloured disc, not ribbons. It reads, but it's the least real part.
- **The glass's big side highlights** lie at 45% over the ends of every layer, so both ends look paler than the middle. That is how glass looks, but it's strong.
- **The tomato pot** is a recoloured onion pot. It reads as diced tomato at shelf size, but the pieces have onion's shape, and one corner of the dice stays pale.
- **Phone: the chip words are tiny** (about 10 px, and *amli ji chutney* runs to two lines at about 7 px). This is v2's chip size; the pots are about 45 px wide. Everything is still tappable, but the words are hard to read.
- **The spoonful was hard to see in flight** at 64 px. It is now 92 px. Laptop levels 1–2 were re-shot with it; the other `inNa` shots still show the 64 px one.
- **The order card's face circle blinks empty** for a moment after a row ticks (seen in several `in*` shots). This is the shared order card re-rendering its image, not chaat's.
- **End screen:** the *fudino ji chutney* word tile overflows its box. This is the shared end screen, which §15 says not to restyle, so I left it.
- **The review face** sits over the middle of the rim and hides the top of the bowl's back edge. That's what "over the dish" asks for.
- **There's empty marble** between the bowl and the shelf (about 120 design px). The bowl stays centred in the scene, as in v2.
- **Take-back isn't taught:** the ghost finger shows card row → pot → drop only. See §5.

**What's right:**
- The bowl, pots and layers are all one side-on camera. There is no ¾ angle left on the station.
- Each layer sits inside the glass's walls at every height and rests on the inside floor. No layer spills past the wall or floats above the floor.
- The pots stand on one line and the chips line up under them.
- The review face sits over the bowl, with *Shabash!* to its right, inside the view on phone.
- The wrong serve empties the bowl, and the card resets for the rebuild.
- Level 4's folded card and its peek are unchanged.

## 5. Open for Zafar
1. **A real tomato pot** for the T2 set (the same jar, canvas and bottom anchor). The recoloured onion is a stand-in. The alternative is to drop tomato from chaat's toppings. I didn't do that, because it changes what Nani can ask for.
2. **Take-back is a tap on the bowl, top layer only.** Is that the right gesture, and should the first-time demo show it? A drizzled chutney can also be taken back; physically it couldn't be, but §17 says the art should then show it can't be undone, and I thought a child fixing a misclick matters more.
3. **Seven thin layers at level 3:** cap level 3 at five or six layers, or let the bowl grow as it fills? For now the layers get thinner so everything fits.
4. **The phone chips:** make the shelf chips bigger on small screens (a chaat-only change, or a shared chip size)?
5. **The old v2 art** (`assets/cook/items/chaat-v2/`, about 30 files) is unused now: delete it?

## 6. New placeholder words
None. No new lines, no new Kutchi. The only card text is the recipe's existing rows.
