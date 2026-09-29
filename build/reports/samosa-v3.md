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
- **Data:** the fill phase line says "Tap the fillings" (there are no bowls now). `data.onboard` is unchanged
  (see S4/S7 below: adding a knob step to the fry coach broke it).
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
| **S4, S7** first-time coach | ✅ checked | The fill + fold coach (`data.onboard.samosa`: spoon, spoon, the tick, three folds) and the fry coach (a samosa in, the lift) both run; `node build/check_onboard.mjs` passes. I tried adding the knob as the fry coach's first step: that put the coach one step out (the spotlight stayed on the tray while a samosa was ready to lift, and the overlay blocks taps outside its light), so the lifts came late and every samosa burnt. Taken out again (bot back to 100 %). The knob still pulses and glows on a guided round. The coach is a ghost hand, not words, so S4's "how much chundo" is answered by the card (level 1: the count written and heard as you add). |
| **The review face** | ✅ | Centred over the plate (a little above its middle), 250 px, `Kit.review` keeps it inside the view; the praise card goes left, over the hob. Shot on laptop and phone landscape, right and wrong (the frown via the kit's `Cook.forceReview` screenshot switch). |

## 3. Tests

Run after merging `origin/main` (with the sekelo v3 session's work in it), and the station lab and days 1 again
after the last merge (the clinic 13c–f commits): laptop lab PASS, *Understood everything. fold 100% · fry 100%*;
phone-landscape lab PASS (run alongside `--days 1`, the bot's lifts came late and it burnt some: on its own it
was 100 %, below); days 1 PASS (below).

| Test | Result |
|---|---|
| `python3 build/test_cook.py --lab --stations samosa --viewport laptop` | **PASS** (13 shots, 157 s): *Understood everything. fold 100% · fry 100%* |
| `… --viewport phone-landscape` | **PASS** (13 shots, 128 s): *Understood everything. fold 100% · fry 100%*. (With the knob coach step in, it passed but burnt: see S4/S7.) |
| `python3 build/test_cook.py --days 1 --canvas` | **PASS** on all six viewports (flip5-landscape, laptop, laptop-16x10, laptop-1280x800, ipad, ipad-portrait). Day 1 has no samosa, so this checks the rest of the game still plays. |
| `node --test build/test_shared_*.mjs` | **PASS** 113/113 |
| `node build/check_onboard.mjs` | **PASS** (7 stations, 10 phases, every phase start scripted) |
| `python3 build/check_vessel_meta.py` | **PASS** (64 ok), including the new `samosa.js META.karahi` / `META.plate` vs `meta.json` check |
| S18 / S3 probe (6,000 orders, levels 1–4, every customer) | base filling ≥ 1 spoon and a card row in every one |
| Level 4, laptop, bot (`--lab --level 4`) | plays through (PASS); the bot burns some samosas. **The old v2 station does the same** at level 4 under the bot (run on `origin/main` in a separate worktree: *a samosa went too dark*, fry 40% on 3 of 6), so it isn't new. |


## 4. Shots and their flaws

`build/shoot_samosa_v3.py --matrix` (states in its header): laptop 1366×768 and phone landscape 844×390 at
levels 1, 2, 3, 4, plus level 2 "wrong" (the frown), and phone portrait (the rotate prompt). 173 shots in
`build/reports/samosa-v3/`, named `<viewport>-l<level>-<state>.png`. Every run: no console errors. Flaws first.

**Fill** (`fill-start`, `fill-mid`, `filled`)
- Flaws: the heaps are small on the phone (about 45 px across on screen) and, at level 3–4, chilli, dhania and
  peas are all green blobs at that size (the chip's speaker is the only other cue from level 3). The strip on the
  house board leaves a lot of bare board around it. The spoonfuls sit as separate little heaps side by side
  rather than one mixed mound (you can see every filling, which helps, but it reads a bit "placed"). At level 1
  the card can list the base second (*ba marcha, hakro bataato*: §5).
- Right: the house board and the plate read clean; heaps have no bowls and match the pile they came from; the
  word pop sits above the strip; the tick is clear of the heaps.

**Fold** (`fold-glow`, `fold-1-mid`, `fold-1`, `fold-2`, `fold-3`, `sam-2-filled`, `folded`)
- Flaws: mid-swipe, the wipe's soft edge shows a sliver of the filling at the triangle's right edge for a moment
  (it's gone at the snap). Fold-4 and fold-5 are drawn a touch bigger than the others on ChatGPT's sheet (the
  strip is 137 px tall there, 130 elsewhere), so the strip's right end steps by a few pixels at those swipes.
  The glow is a plain rectangle round the part that folds, not its outline. `fold-3` is taken just after the
  third swipe, so the finished samosa has often already flown to the plate (fold-6 itself is seen for ~0.3 s).
- Right: the filling is on the flat strip and the first swipe covers it with the fold-2 triangle; every later
  stage is the fixed picture; the finished samosa flies by its own middle and lands on the plate's flat centre;
  the next strip comes pre-filled with the same spoons (`sam-2-filled`); 1, 2 and 3 on the plate sit in rows well
  inside the rim (S10).

**Fry** (`fry-start`, `fry-on`, `frying-1`, `frying-all`, `scoop`, `plate`)
- Flaws: the flame ring pokes a little past the hob's top edge (the karahi is taller than the wide hob is deep,
  so the peek above it lands on the worktop). With three samosas the timing rings nearly touch. On phone, the
  jharo's handle ran off the right edge beside the plate in the matrix shots; it's now turned to hang down over
  the band (re-shot: `samosa-v3/recheck/phone-landscape-l2-scoop.png`, the handle hangs down inside the view). The golden fry art (v2) is quite brown on the plate. In the matrix,
  level-4 runs burnt a samosa on the first try: the bot's late taps, not the game (the old v2 station burns the
  same way under the bot at level 4; see §3).
- Right: the wide hob with the big karahi and the plate reads as one group, knob clear of the rim; flames show
  as soon as the knob is on and stay on (S21); no heating ring (S16); samosas are bigger in the oil; the jharo is
  under the samosa and it rides on top to the plate (S20); the plate fills in rows on its flat centre.

**Review** (`taste-right`, `taste-wrong`) and **end**
- Flaws: the face covers most of the plate (it's "over the dish" as asked, but the samosas are hidden while it's
  up). On phone the face is pulled up by the view clamp so it sits on the plate's upper half, not its middle.
  The praise card lands over the karahi's right handle.
- Right: fully inside the view on laptop and phone landscape; happy and frown both read at a glance; the end
  pop-up is unchanged.


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
- **Level 4** is hard for the bot (it burns some), as it was in v2; I didn't change the fry speed.
- **The fry coach doesn't show the knob.** A coach step per move only works when each move changes "what to
  do next" once; the knob could be shown if the coach learnt to skip ahead when the child is ahead of it
  (a change to the shared coach, not made).

## 6. New placeholder words

None. No new Kutchi and no new English lines. (The "with" join is still the shared placeholder, flagged "to
record", unchanged.)
