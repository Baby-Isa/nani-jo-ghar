# Daar v3 (29 Sept play-test §6: D1–D11, S16, Q4, Q10, Q13)

Branch `claude/cook-daar-v3`. Station `js/cook/stations/daar.js`, its data (`data/stations/daar.json`, the daal recipe and onboard scripts in `data/cook.json`), shoot script `build/shoot_daar_v3.py`, shots `build/reports/daar-v3/`.

## 1. Mechanics changed or removed
- **Chop (D1 / Q4):** the v2 tap-crate-then-tap-knife chop is **replaced by the swipe chop** again: `mechanics/chop.js`, run inside daar's chop phase with its own levels, decoys, look-alikes, the red-onion variant, the level 2–3 switch and the timer ring. The v2 shelf crates, board and katori are gone from the chop phase.
- **Oil heating ring (S16): removed.** The oil is hot from the start (the pot shows hot oil). Tap the knob: the flames come on, and the sizzle sound says it's ready.
- **Chopped vegetables into the pot (D9):** v2 tipped one katori in. Now **each vegetable's pile is tapped in on its own**, and its row ticks as it goes in. Nothing else about the order of the cook changed.
- **Stir (D7 / Q10):** it's still drag round, or tap for one turn, with the laps as the Kutchi word. **Added:** the speed dial. From level 2 Nani may also ask for a speed (*aste thi* / quickly: the stir mechanic's existing `speedWords` lines), using the recipe's existing `speed` slot, now passed to the station. **The speed is judged by the ear star only**; it never makes the dish "not quite". Going way too fast spills a little (a gentle *oops* at level 1 only).
- **Grading change that follows from the swipe chop:** slicing a decoy (or a vegetable they said no to) costs the ear star, as in chaat, but no longer makes the dish wrong. Its halves fall away and never reach the pot. The dish is wrong when the **count** of a wanted vegetable is off, when the tadka order is off, or when the laps are off (all as before).
- Nothing else removed. The chop, tadka and stir lab entries are unchanged.

**Shared files touched (small, additive, default off):** `js/cook/mechanics/chop.js` got four new optional params:
- `knifeKey`: the kit's knife follows the finger instead of the hand (the no-hands rule);
- `onSlice`: called on every slice (daar sends the pieces to the side);
- `tally: false`: no picture tally (Q7);
- `timer`: moves the ring.

With none of them passed (chaat, the chop lab), the chop is exactly as before. `build/check_vessel_meta.py` got `check_daar()`.

## 2. What was built
- **The swipe chop** on the marble, with Nani's chop card (quantities) and Nana's card folded. Each right slice sends that vegetable's **chopped pieces** (`veg-*-chopped-t`) flying to the **counter at the top right**: one small pile per piece, one row per vegetable, so the child can count them. At level 1 the count is said as each pile lands (Q7). The ring running out ends the chop, which is then graded as in chaat, and Nani's rows tick.
- **Where the pieces wait (Q4: "try it and judge"):** both were built and shot (`Cook.daarSide = "bowl"`, `shoot_daar_v3.py --side bowl`, shots in `build/screenshots/daar-v3/laptop-l1-bowl-*`). **Chosen: the counter.**
  - The v3 `veg-bowl` is a pre-rendered bowl of onion, tomato **and** chilli. It shows all three whatever was chopped (an order without onions still shows onions), and you can't count what's in it.
  - The piles show exactly what you chopped and how many. Each pile is the thing you tap into the pot, which makes D9's "tick as each goes in" literal.
  - The bowl is the prettier picture, but it tells the child something untrue, and the count is the game.
- **The v3 top-down pot (D2, D3, D11, Q13):** one registered canvas, nine pictures (`assets/cook/items/v3/daar/pot-*`), placed by the **measured** body (centre 0.4982, 0.4985; r 0.3566 of w), never the handles' box. The contents are always a picture, cross-faded after each addition:
  - hot oil from the start;
  - seeds after the first spice;
  - after the chopped piles: onion, then tomato, then chilli (the art's own order: each picture includes the earlier ones);
  - daar after the pour, then the tadka on top.
  - The v2 drawn oil, lentil dots and spice specks are all gone.
- **The spices** go in as a small copy of the jar, which tips over the pot, instead of a flying dot.
- **Stirring turns the pictured contents (D10):** two layers of the pot picture, the tadka and the swirl (`pot-stir`), rotate with the ladle behind a circular mask at the contents' measured radius (0.325 of w, measured along 12 rays at 0.33–0.34). The rim and handles never turn. The swirl picture fades in as you go faster.
- **The finished daar (D5)** is `daar-bowl-trivet.webp`: it waits right of the hob, tips into the pot, and comes back as the served bowl under the review face.
- **The ladle (D6)** is `ladle.webp`, top-down with the handle rising, placed by its bowl's measured centre (0.3983, 0.7451), riding the track inside the rim.
- **The speed dial and laps (D7):** see §3.
- **The review face** (`Cook.Kit.review`) sits over the trivet bowl, praise card to its right (not over the pot). `review()` clamps it inside the view on phone.
- **D9 checked with the restored chop:** at the pot, the chopped rows go back to "to do" and each ticks as its pile goes in (seen in the `piles` → `veg-in` shots, and in the lab run's card).
- **Flames (X6):** `flameR` is now 0.95× the pot's body, so the high flames only peek out past the pot (v2's 1.3× and my first 1.15× spread well past it).
- **Onboarding:** `data.onboard.daar` is now two swipes; `daar-cook` adds the knob, the piles one at a time, the daar, and the dial. `check_onboard.mjs` ok.
- **Shots:** `build/shoot_daar_v3.py` (every state, levels 1–4, laptop + phone landscape). Its debug hooks (harmless when unused): `Cook.daarPhase`, `Cook.daarSide`, `Cook.stirDrive(rate, ms)` (stirs through the same `turn()` as a drag; the headless browser's mouse is too slow to reach the hare band).

## 3. The speed dial: design note (Q10)
Zafar asked for a speed dial "in the kitchen-kit style", with its own review. The old one was a cream card with a four-band arc and hand-drawn tortoise, hare and splash, and nothing like the kit.

**Options:**
- **A. A knob-style rotary dial**: a second kit knob beside the hob, whose pointer turns with your speed. It matches the knob art exactly. But a knob reads as a control ("turn me"), not a readout, and children would tap it. Rejected.
- **B. A horizontal bar meter** (like the chai heat gauge bent flat). It's compact and easy to read. But it looks like the heat/timer gauges Zafar found confusing (S16, the ring he kept tapping), and it loses the "speedometer" he asked for by name. Rejected.
- **C. A speedometer on a panel of hob glass (chosen)**: a half-circle gauge on a dark glass panel with the hob's rounded corners and a thin gold rim (the kit's gold). It has four fixed bands (stopped, tortoise, hare, spilling), never a target. The band you're in lights up with the warm orange glow of the "on" knob, and a gold needle glides (smoothed). The tortoise, hare and splash are drawn in cream, one ink on the glass. Under the gauge, the **laps** show as the Kutchi number word on a white chip, the same chip style as the word pops, with a small pop on each lap. No digits, no pips.

**Why C:** it is the "speedometer" Zafar remembered, and it looks like a piece of the same hob (glass, gold, the knob's glow) rather than a sticker. It reads at a glance: the lit band plus the animal. It's a readout, so there's nothing to tap. Putting the laps inside the same panel gives one place to look: *how fast* above, *how many* below. It is drawn in code: no new art.

**Left open:** the icons are code drawings (like the old ones). If Zafar wants them nicer, a ChatGPT sheet of four flat cream glyphs on transparent would drop straight in.

## 4. Tests
- `python3 build/test_cook.py --days 1 --canvas`: **PASS on all 6 viewports** (flip5-landscape, laptop, laptop-16x10, laptop-1280x800, ipad, ipad-portrait), run after merging `origin/main`. Day 1 doesn't reach daar; the lab run is what plays the station.
- `python3 build/test_cook.py --lab --stations daar --viewport laptop` and `--viewport phone-landscape`: see the final lines below.
- `node --test build/test_shared_*.mjs`: 113/113. `node build/check_onboard.mjs`: ok. `python3 build/check_vessel_meta.py`: ok. It now also checks `daar.js`'s POT / TRIVET / LADLE constants against `v3/daar/meta.json`, that all nine pots share the pot's canvas, and that the stir's clip sits inside the rim.
- **Budget:** `LONG["daar"]` in `test_cook.py` is now 900 s (was 700). The swipe chop runs its full ring on every try, and a laptop lab run under load (four browsers at once) timed out at 700 s in its third chop.
- **Bugs caught by the shots and fixed:**
  - the dial drawn inside a Phaser container never showed its redraws (it's now plain objects);
  - the pot never switched from oil to seeds (an inverted condition);
  - the veg-bowl option never showed the bowl;
  - an order with nothing to chop showed an empty "Chop these" card (it now goes straight to the pot);
  - the praise card sat over the pot (it's now on the right);
  - a lap count past the words showed an id (`num-09`; the last word now stays).

## 5. Shots with their flaws
`build/reports/daar-v3/<viewport>-l<level>-<state>.png` for laptop (1366×768) and phone landscape (844×390), levels 1–4. Each level's first try goes wrong on purpose: it stirs through every band of the dial and past the count, so the wrong serve shows. `-again-*` is the second, right try. **Phone landscape level 4 is missing only its second try's `taste-right` and `end`:** the run hit the shoot's 40-minute limit (four browsers sharing the machine); the same states are shot at phone levels 1–3 and at laptop level 4. Other missing names mean the state didn't happen in that run: level 3's order asked for no vegetables, so it has no chop; a few runs have no `chop-mid` because the bot, under load, sliced fewer than five.

**Flaws first:**
- **The dial lags the ladle in the shots.** Its needle is smoothed (0.35 s) and the headless renderer runs at a few frames a second, so `stir-hare` sometimes still lights the tortoise band, and `stir-spill` the hare band, while the daar is already slopping over (levels 2–4 were shot before I lengthened the drive). The laptop L1 re-shoot shows each band. On a real device the needle keeps up.
- **The countdown ring is still the chop mechanic's own green, cream and brown**, not the kit's gold and sage. I left it because it's the shared `chop.js` and chaat's look; a kit-style ring would be a small `ringStyle` option.
- **The review face covers the top quarter of the trivet bowl.** That is what "over the dish" asks for, but the bowl's garnish is hidden. On phone the praise card *Shabash!* sits about 10 px from the right edge. It is inside the view, but tight.
- **Chop phase:** the empty cream shelf band stays at the bottom (the vegetables fly up through it). That keeps the grid the same as the cook, but it's a blank band.
- **Level 3+ Nani's chop card still writes the quantities** (*ba dungri*). Q7 says heard only from level 3. That card is v2's and daar's own; I left it because the chop's count is the whole game and the card is the child's only check, **for Zafar** (see §6).
- **At the pot, level 1–2 count rows show "••• tameto"** while undone (the shared card's got-dots after D9's reset). It's the shared order card, not daar's.
- **The pot picture after a pile goes in** comes from the art's cumulative set: see §6.

**What's right:**
- **The swipe chop is back:** the level 1 single round, the level 2–3 switch and the decoys, with the kit's knife following the finger and no hand. Right slices send countable piles to the counter at the top right (`chop-mid`, `chopped`).
- **The pot:**
  - hot oil from the first frame (`cook-start`);
  - knob on means flames that just peek out, and no ring (`hot`);
  - the jar tips and the seeds picture fades in (`tadka-mid`);
  - the piles wait left of the hob while their rows are back to "to do" (`piles`);
  - the onion, tomato and chilli picture after they're in (`veg-in`);
  - the daar poured and the tadka on top (`daar-in`).
- **The stir:**
  - the contents picture turns inside the rim;
  - the swirl picture fades in with speed (`stir-hare`, `stir-spill`);
  - the dial's lit band glows warm;
  - the lap word sits on its chip (*hakro*, *ba*, *trae*, *panj*);
  - spill drops fly off the rim at spilling.
- **Serve:** the frowning face over the trivet bowl (wrong); the happy face with *Shabash!* to its right (right). Both are fully inside the view on laptop and phone.
- **Level 4:** Nana's card starts folded in the cook.
- **The end screen:** the word review and Again / All stations.

## 6. Open for Zafar
- **Pot pictures by vegetable:** the art's chopped-vegetable pictures are cumulative (onion ⊂ tomato ⊂ chilli). An order with no onions still shows onion in `pot-tomato` / `pot-chilli`. The fix is two more pot pictures (tomato only, chilli only; or a set without onion). I didn't draw dots over them.
- **The tadka's dry chilli and curry leaves** in `pot-tadka` and the trivet bowl are always there, whichever spices were ordered (Q13 pictured contents: same kind of gap as above).
- **The served bowl is the same picture as the one poured in.** D5 asked for "the finished daar at the side": it waits beside the pot, pours in, and a full bowl comes back for the review. It reads fine, but the bowl waiting to go in already shows the tadka on top. A plain-daar version of the trivet bowl would make the pour honest.
- **Speed asked from level 2:** the recipe's existing `speed` slot (none / slowly / quickly) now reaches the station, as in the old stir game. It's judged by the ear star only. Say if you'd rather have the dial as a readout only (no asked speed), or have a wrong speed make the dish "not quite".
- **A sliced decoy no longer makes the dish wrong** (its halves fall away; the ear star still counts it). This is how the swipe chop grades in chaat.
- **Nani's chop card writes the quantities at every level** (v2's card). Q7 says level 3+ is heard only. For a swipe chop, where the count is the game, should the card go word-only at 3+ (*dungri*, *tameto*) like the order card?
- **The chop re-marks the ear star on a retry** (the shared chop grades every time it runs). Harmless for the dish, but a retry's chop mistakes are logged too.

## 7. New placeholder words
None. Every line used already exists: the chop's lines, *aste thi* and the "quickly" speed words (from `data/stations/stir.json`), and the numbers. *Chop these* is still the v2 English placeholder, flagged to record.
