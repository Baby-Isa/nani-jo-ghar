# Samosa v3 (29 Sept play-test, §8 S1–S21, Q2, Q3, Q9)

Branch `claude/cook-samosa-v3`. Station: `js/cook/stations/samosa.js`. Shots: `build/reports/samosa-v3/`
(`build/shoot_samosa_v3.py --matrix`). Source: `docs/feedback/cook-playtest-2026-09-29.md` §8 and §10's answers.

## 1. Mechanics changed or removed (read this first)

- **Nothing removed.** Fill (tap a filling = one spoon, the tick grades it), fold (the swipe), make as many as
  they asked for (the next strip pre-filled, "fry them"), fry (drop in, lift when golden, the timing ring round
  each samosa), the review and the three tries all play as before.
- **Changed, as asked:**
  - **The fold (S8, S11, Q3: Zafar's answer, not the cone).** The filling still lands on the flat strip (now its
    left end, where the first fold's triangle lands). Every stage is now one of the six fixed pictures
    (`v3/samosa/fold-1…6`), and the first fold hides the filling. It's still **three swipes** per samosa, the
    same gesture (drag along the glow, let go past `minLen` and it snaps; short of it, it springs back). Each
    swipe wipes the next picture in over the last from the left as the finger goes: swipe 1 = 1→2 (the triangle
    covers the filling), swipe 2 = 2→3→4, swipe 3 = 4→5→6. The old code that bent the v2 flap along a fold line
    is gone (it drew the pastry itself; the pictures replace it).
  - **The oil-heating ring is gone (S16, Q9).** Tap the knob: the flames come up, the sizzle starts at once
    and the samosas can go in (a short 0.35 s beat). Before, you waited while a ring filled. The per-samosa
    timing ring (the one you *do* stop yourself) stays.
  - **The knob stays on high while frying (S21).** Before, it dropped to "low" once the oil was hot.
  - **One jharo.** Two quick lifts queue: the second waits for the first scoop (about 0.9 s). The verdict is
    taken the moment you tap, and a tapped samosa stops frying at once, so the wait never burns anything.
- **Data:** the fry coach (`data.onboard.fry`) gained its first step, the knob (it never showed it). The fill
  phase line says "Tap the fillings" (there are no bowls now).
- **Shared files:** none of the game's shared files changed (`kitchen-kit.js`, `ui.js`, `order.js`,
  `recipes.js`, `station-lib.js` untouched). The karahi and plate are placed in `samosa.js` from their measured
  meta, so `Cook.Kit.VESSELS.karahi` (the v2 karahi) is left as it is for anyone else. `build/check_vessel_meta.py`
  gained a check that `samosa.js`'s copied numbers match `v3/samosa/meta.json` (as the brief asks).
- **Old art still used:** the fry states `samosa-v2/fry-0…3` (raw → light → golden → dark: there's no v3 set),
  and the thalis the raw samosas wait on (`vessel-thali-t.png`).

## 2. What was built

| Item | | What |
|---|---|---|
| **S8, S11 / Q3** the fold | ✅ | See §1. Fill on the flat strip's left end; the fold-2 triangle covers it; three swipes through the six fixed pictures (a soft wipe edge and a crease shadow as the finger goes; a glow on the part that folds next). The finished samosa (fold-6) flies to the plate by its own middle, not the strip's. |
| **S2 / Q2** heaps, no bowls | ✅ | `fill-chundo`, `-potato`, `-peas`, `-onion`, `-chilli`, `-dhania` on the band, 128 px, a chip under each; a spoonful is a small copy of the same heap, so the mound on the strip matches the pile. `-carrot` and `-cabbage` are wired (`HEAP`) but no samosa order uses them yet (they're not words in `data/cook.json`). Samosa only; the other stations' jars are untouched. |
| **S6** the board | ✅ | `board.webp`, 820 px wide at its own 1397:847 shape. |
| **S10** the plate | ✅ | `plate.webp` (paper-lined) for the folded samosas and the fried ones. They sit on its flat middle (within 0.6 of the rim radius), in rows (1; 2 side by side; 2×2; 3+3), the ones already there shuffling up to make room. None reach the rim. |
| **S17, S19 / Q9** the fry area | ✅ | The kit's wide hob (`Kit.hob(S, {wide: true})`, k 1.14) and the new `karahi.webp`, body r 180 → **250 (1.39×)**. At 1.5× (270) its rim ran over the hob's knob (the knob sits 0.469 of the hob's height below the burner), so this is the biggest that keeps the knob clear. Placed by its measured centre and radius (`META.karahi` = meta.json, checked). The plate (340 px) sits just right of the hob on the burner's line. Samosas in the oil are 180 px for 1–3 (spread 120° apart), 165 for 4, 145 for 5–6 (was 128). |
| **S16** no oil ring | ✅ | See §1. |
| **S20** the jharo | ✅ | `jharo.webp`, its bowl (measured: centre 0.279, 0.227, r 0.25 of the width) slides in under the samosa (drawn below it, above the oil), both fly to the plate, the samosa settles and the jharo drops away. |
| **S21** flames | ✅ | **Why they sometimes vanished:** after the oil heated, the station turned the knob to "low", and `flame-low`'s ring only reaches 0.82 of the karahi's radius at that size, so the whole flame hid under the karahi: the knob was on and there was no fire. Before that, on "high", the ring showed; so it depended on when you looked. **Fix:** the knob stays on high while it's on (flames always show), and the flame ring is sized to peek out past the bigger karahi's rim. |
| **S14** karahi cut-out | ✅ | The new karahi has open loop handles (no grey left in them; the art session's check). |
| **S18** base filling | ✅ checked | The shared session's `minFirst` works: 6,000 orders drawn (1,500 per level, every customer) and every one has the base (chundo or bataato) at least one spoon, as a card row. |
| **S3** base is a row | ✅ checked | Same probe: the base is always one of the tally's rows. **But** the rows are shuffled (an any-order list), so it's often not the *first* row: see §5. |
| **S9** second samosa | ✅ checked | An order has **one** filling for all its samosas (`fillings` is a single tally), so the next strip is pre-filled from this order's own spoons, and each station run starts empty. There is no order with two different samosas: see §5. |
| **S4, S7** first-time coach | ✅ checked | The fill + fold coach (`data.onboard.samosa`: spoon, spoon, the tick, three folds) runs; the fry coach now shows the knob first, then a samosa in, then the lift. `node build/check_onboard.mjs` passes. The coach is a ghost hand, not words, so S4's "how much chundo" is answered by the card (level 1: the count written and heard as you add). |
| **The review face** | ✅ | Centred over the plate (a little above its middle), 250 px, `Kit.review` keeps it inside the view; the praise card goes left, over the hob. Shot on laptop and phone landscape, right and wrong (the frown via the kit's `Cook.forceReview` screenshot switch). |

## 3. Tests

RESULTS_PLACEHOLDER

## 4. Shots and their flaws

SHOTS_PLACEHOLDER

## 5. Open for Zafar

- **The base row's place on the card (S3).** The base is always a row, but the fillings' rows are an
  any-order list and get shuffled, so the card (and the sentence) can read *"with ba marcha, hakro bataato"*:
  chillies before the potato. Putting the base first needs a small option in the shared `order.js` (a recipe
  flag like `headFirst`); I didn't touch the shared file. Say if you want it.
- **Two different samosas (S9).** The order model gives one filling for all the samosas in an order. If you
  want "one chundo samosa and one bataato samosa" as two blocks on the card, that's a new order shape (the
  recipe, the card and the station's pre-fill); the station would then pre-fill only a strip whose block
  matches the last one. Not built.
- **The karahi is 1.39×, not 1.5×** (see S19): at 1.5× it covers the knob. A bigger hob scale would make room,
  but then the hob fills the whole worktop height.
- **The fry art** (raw → golden → dark) is still the v2 set, a slightly different samosa shape from the new
  fold-6. A matching v3 fry set (four states on fold-6's canvas) would make the raw one on the thali the very
  samosa you folded.
- **Level 3–4 at three samosas** is busy: the bot, playing fast, keeps up; I didn't change the fry speed.

## 6. New placeholder words

None. No new Kutchi and no new English lines. (The "with" join is still the shared placeholder, flagged "to
record", unchanged.)
