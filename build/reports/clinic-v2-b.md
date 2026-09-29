# Clinic v2, prototype B: the heal games (29 Sept 2026)

The heal games from the design sheets, part B (`docs/modes/clinic-v2-design-sheets.md`), with Zafar's answers (`docs/feedback/clinic-playtest-2026-09-29.md` §9) overriding the recommendations. These are **prototypes**: flat stand-in shapes and emoji on the blurred CB6b bed, so Zafar can judge the mechanics. No new art.

Branch `claude/clinic-v2` (shared with prototype A). Labs: `lab/clinic-heal-a.html` (scrape, knee, ear, tooth), `-b` (drinks, fever, boing), `-c` (eye, foot; tummy, hic and hair unchanged). Each link opens the real host with the first-time cues on.

## 1. Mechanics changed or removed

Every game below is new code on a shared close-up layer (`js/clinic/heal/scene.js`). Before the per-game list, what changed for all of them:

**Changes to every heal game**
- **The close-up replaces the zoomed patient figure.** Each game draws its body part on CB6b: limbs on the paper strip, heads against the wall. A round face in the top-left corner reacts to what happens. The host's figure isn't used, so the host hides it.
- **Each game draws its own tool shelf** (stand-in buttons on the right) and doesn't use the sidebar tray, which the host hides. As a result, **the pharmacy's tray no longer decides anything in a heal game.** A wrong item the child brought isn't shown or counted. The contract (`docs/clinic-heal-api.md`) says the game uses `ctx.tray`, so this is a real departure. The pipeline still passes the tray, and `test_clinic` checks the fever's tray still has its thermometer (G8).
- **The first-time help is new.** The shared onboarding kit's ghost hand (`ctx.onboard`) is gone from these games. In its place, each step shows a cue: words in a bubble, a pointing hand, and the words said by the device voice. The cue never blocks a tap, and it never sits over the tool shelf. Cues show at level 1 every time, and at levels 2–3 the first time this browser plays the game. `&cues=1` forces them on and `&cues=0` switches them off.
- **Every game opens with its "why" beat.** The patient says the problem, then the doctor says the goal. Taps are ignored until the beat and the card have been said.
- **Counting follows the host's G6 (session A).** The host writes the count (the tally chip, and the card row at level 1) and says it at level 1. The scene adds nothing at levels 1–2 and says the count at level 3 (heard only).
- **Level 1 is scored in every game.** The scrape used to have a "taught" level 1 (no score).
- **The leak rule forced three small departures from the sheet:**
  - L1 carries a count in the fever, the foot, the drinks and the boing;
  - the tooth's L1–2 brushing uses left and right too;
  - boing's L1 bead count goes up to 4.

  Each is named in its game below.

| Game | Removed | Changed / new |
|---|---|---|
| **Scrape** (`cut.js`) | The cat, star and dot designs; the single plaster; the "taught" level 1 | Water, then the cloth dabbed N times (counted), then **plasters in the colours and order said**. L1 has one plaster (of 4 colours), L2 two in order, L3 three half-and-half plasters (6 pairs) in order. Tap the colour, then the dotted spot. The scrape is now the default at every level; **the stitches ("cut") are unchanged** and reached with `&ailment=cut` (the last links in lab A). |
| **Knee** | The X-ray, the plate and its clonks, the cast, the crutches (the `leg-break` ailment now plays the knee game); the drag-round-the-track wrap | The hammer taps the knee N times and the shin kicks. Then the **flash-and-tap wrap**: the flashing dot is tapped and the bandage wraps from the last dot to it; stop after N turns and press ✓. L1 has 2 dots at one height with no hurry. L2 has 3 dots each side at 3 heights, flashing in a set order, 1.8 s per flash. L3 is 1.1 s per flash, and the side is said (*dabo / jamno*) with only that leg glowing. A missed flash moves on and is logged, never scored. |
| **Ear** | The torch "cave" view; the seeds and the sock; the dragged pluck; the side row in the patient's voice | **Wax blobs**, taken out with a tap in the order said (*pela wadho, ne poi nindho* or the other way round). From L2, **wax keeps popping up for 5 s (7 s at L3)**: a calm whack-a-mole, where a blob left alone slips back and is logged, never scored. Then the cotton bud N times and N drops. |
| **Tooth** | **The green bug**; the swipes on marked teeth; the paste-colour blobs | **Brush:** drag the fixed brush's head in the called order, one move per drag (L1 2 moves, L2 4, L3 6). Left and right are the patient's own sides, so their left is on our right. They're English placeholders at L1–2 and *dabo / jamno* at L3. *Departure:* L1–2 use all four moves, not only up and down; with up/down only, a blind guess wins 25% at L1. **Drill:** drag over the dark decay; drilling 7 white cells chips the tooth; L3 adds a 14 s timer. **Fill:** press and hold the doctor's tube, which fills, and let go at the line (±9%). The drill and the fill are hand-skill rows: scored, but no word decides them. The press-and-hold isn't listed in `gestures` because the registry forbids "hold" there (quality pass Q1); the sheet asks for it. |
| **Taste → the soothing drinks** | The whole taste test: droppers (limu, khun, loon, marcha), cups, the tongue reactions | A tongue with **coloured bumps**, each colour healed by one drink: yellow is *hardar waaro dudh*, orange is *aadu ne paani*, green is *[honey] ne limu*. The doctor names the drink; the child taps the things into the cup, stirs with the spoon, then taps the cup to give it, and the matching bumps shrink. There's a timer: 75 s at L1, 60 s at L2, 45 s at L3. L1 has one drink, L2 two in the order said, L3 three. *Departure:* every drink has a spoon count (*hakro/ba/trae chamchi …*), not only at L3. There are only three drinks, and without a count a player who always makes the same one wins 33% at L1. A wrong drink doesn't help ("That didn't help"), and the child can make it again, but the row counts the first try. |
| **Fever** | The old game (unplayable, G8): the strip, the rainbow fan | A **thermometer that looks like one** (glass, marks, bulb), whose column rises **red or blue**. The doctor then says the fix: hot gets the cool cloth or the fan, cold gets the blanket, each with a count. The patient answers "Now I'm too cold!" / "too hot!" / "Just right!", and the exchanges alternate until just right. L1 has 2 exchanges, L2 3–4, L3 3–4 plus the fan's speed (*jaldi*: taps under 0.45 s apart; *aste thi*: slower). *Departure:* L1 has counts too; the reading's colour decides the tool, so the count carries the word. |
| **Boing** | The spoken count-down (the speaking moment); the lollipop; the plaster colour | Wipe N times, then **coloured beads tapped into the doctor's syringe**, counted. L1 has one colour, 2–4 beads (*departure:* the sheet says 2–3, which leaves a blind guess at 10%). L2 has 4–5. L3 has the colours said (*ba [red], hakro [blue]*). Then the doctor counts down and BOING, then *pela* the plaster, *ne poi* **the apple**. |
| **Eye** | The pointer, the patch and the old chart game; the *nar* row | N drops. From L2 the eye is said, in English placeholders ("[left eye]"). At L3 the child covers the other eye first. Then **the eye test**: the patient reads each row of shrinking pictures and the child judges it with **✓ haa / ✗ na**. A wrong reading gets another drop, then the patient reads the row again. L1 has one picture per row and 3 rows, with the reading written by the face. L2 has 4 rows, heard only. L3 has 2–3 pictures per row, and a wrong reading is a wrong picture or two swapped. The words are Cook's foods (limu, dungri, tameto, bataato, marcha, lasan, dudh) and household things (bed, chair, cup, ball, key, spoon), which are English placeholders to record. |
| **Foot** | The swirl; the salt; the tweezers; the toe picking | **Soak:** the doctor says *paani [hot] / [cold] / [lukewarm]* and N jugs. The temperature words are placeholders (*koso / nokoso*?) and the jug count is the level-1 departure. **Splinters:** drag each one out along its short path; touching the side makes the patient wince and the splinter slide back 30%. L1 has 1 straight splinter, L2 2 curved ones, L3 3 in the toes, in the order said (*pela [big toe], ne poi …*). Then **a plaster where each one was**. The patient says which foot ("[My left foot]" at L3), but it isn't tested: only one foot is drawn. |
| Tummy, hic, hair | — | Unchanged (CQ14). Their old test is kept as `build/test_clinic_heal_c_extras.py` and run from `test_clinic_heal_c.py`. |

## 2. What was built
- **`js/clinic/heal/scene.js`**, the shared close-up layer:
  - CB6b as a webp (`assets/clinic/rooms/cb6b-closeup-bed-v1.webp`) plus a pre-blurred copy (Gaussian 9 px, `…-blur-v1.webp`) under a light veil. It's placed in the drawing's own coordinates, so the paper strip always sits at y 342–482 of the 800×500 view, whatever the screen's shape.
  - The round face (neutral, happy, ouch, wince, sad, cold, hot, read, drink) and the doctor's badge, which the speech bubbles anchor to.
  - The tool shelf, which adds columns on a short screen.
  - The cues, the timer, the "said by the mouth" label, and the shared blind bot (`HS.bot`, with sequence and hand-skill rows).
- **The nine games** in `js/clinic/heal/games/`. The `cut.js` stitches code is untouched: it moved into `planCut / mountCut / botCut`.
- **The tests:**
  - `build/heal_play.py` is the shared browser driver. It plays each game through real mouse events from the game's `debug.next()`: taps, drags, press-and-hold until the line, the ✓ button. It checks right = total, every card row ticked, a cue with words for every step, no console errors, and that nothing covers a tap. It also plays one "slip" game per level, with one deliberate mistake that must cost exactly one row.
  - `test_clinic_heal_a/b/c.py` are thin wrappers around the driver.
  - The leak bots: `leak_clinic_heal_a.mjs` now runs on `Heal.botRun` like `_b`; `_c` is unchanged.
  - `build/check_onboard.mjs` (from Cook) now also fails a heal game that has no why beat, a kind of step without a cue in words, or a cue its code never shows.
- **`build/test_clinic.py` (session A's)**, case `heal-fever-help`: it now checks the v2 help path. The cue's words show, the thermometer's tool isn't covered, and the forehead tap moves on to the next step's words. It used to wait for the old ghost-hand overlay.
- **The lab pages** A/B/C follow C's layout (iframe plus links, cues on). `lab/clinic-heal-host.html` takes `&ailment=` (for the stitches) and `&cues=`. `clinic.html` and the host page load `scene.js`.

## 3. Results
All run on the final code (29 Sept, ~18:10 UTC):

| Check | Result |
|---|---|
| `python3 build/test_clinic_heal_a.py` (scrape, knee, ear, tooth × L1–3 × phone, iPad, laptop; 2 fair + 1 slip each) | **PASS**, 108/108 |
| `python3 build/test_clinic_heal_b.py` (drinks, fever, boing) | **PASS**, 81/81 |
| `python3 build/test_clinic_heal_c.py` (eye, foot; the foot's touch-the-side check; then tummy, hic, hair on their old test) | **PASS**, 54/54 plus the edge check (a wince, then a clean pull, 2/2), and tummy, hic and hair 16/16 each |
| `node build/leak_clinic_heal_a.mjs` / `_b` / `_c` | **PASS**: fair 100% everywhere, every blind strategy under 10% at L1 (the worst at L1 is 8–9%: scrape, knee, drinks, foot) |
| `node build/leak_clinic.mjs` (the whole clinic) | No problems |
| `node build/check_onboard.mjs` | ok: 9 heal games, 26 kinds of step, each with its why beat and words (a removed cue was tried and fails it) |
| `python3 build/test_clinic.py --only heal` (every heal game in the pipeline, and the fever with the help on) | **PASS** |

**Not done:**
- Only laptop shots were reviewed (as asked). The phone and iPad were checked by the tests, which fail on anything covered or off screen, not by eye.
- The BOING moment isn't in the shots.
- Nothing has been heard with the device voice (tests and shots run `quiet=1`).


## 4. The review: laptop shots, flaws first (VISUAL-QA §5)
The shots are in `build/reports/clinic-v2-b/` (1366×768; `python3 build/shoot_clinic_heal_v2.py`), with contact sheets in `sheets/` (`build/contact_heal_v2.py`). Each game is shot at L1 and L3: the why beat, each step as it opens with its cue, each step after its first action, and the end. The lab bar is folded away. Each shot was looked at for flaws before anything was called right. **This is the builder's own review;** per §5 a fresh session or the orchestrator should look again.

**Fixed after the first look:**
- **Ear:** the close-up read as an **eye**: the hair arc looked like a brow and the round canal like a pupil. It's redrawn as the side of a head with hair above, a C-shaped ear with a fold and a lobe, and the canal inside.
- **Fever:** after the first fix, **the thermometer still showed the old red reading** while the patient said "too cold". The finished `fill: forwards` animation held the column. The animations are now cancelled before each reading.
- **Eye (L3):** the top row of three pictures ran **past the chart's edges**. The picture size is now capped by the row's count.
- **All games:**
  - the cue bubble sat **over the tool shelf** (on the scrape's plasters) and later **over the work** (the knee's dots, the drinks' bumps). The cue now sits beside the shelf, is narrower, and steps aside as soon as the child taps a tool or the close-up;
  - **the count showed three times** at L1 (my chip, the host's tally and the card's row). The scene's chip is gone, and the host's G6 count is the one shown;
  - **phone:** the one-column tool shelf was taller than the 412 px screen. It now adds columns to fit, and the phone tests pass.
- **Tooth:** the decay was only 4 small cells, mostly hidden under the pointing hand. It's now a bigger blob (radius 2).

**Flaws still there (prototype stand-ins, for Zafar's look):**
- **Stand-in glyphs** don't always read: the cloth is an ice cube (🧊), the bandage a toilet roll (🧻), the tweezers chopsticks (🥢), the lukewarm jug a wavy line, and the honey renders as an orange ball in this font. The foot is a round blob with small toes.
- **Boing:**
  - the doctor's syringe floats **above** the arm, with the needle pointing sideways and not at the jab spot;
  - the sleeve's square end cuts the arm's rounded end;
  - the apple appears at the top left, not by the face;
  - the BOING moment itself isn't in the shots (it runs by itself between two steps).
- **Knee:** the kicking shin swings out over the other leg at L1. The bandage is flat white strokes, not a wrap round the knee.
- **Drinks:** the tongue sits in an open mouth with no face round it. Three colours of bumps (9) crowd the tongue at L3.
- **Fever:** the "cold" tint turns the face grey rather than blue. The fix cue is four lines long.
- **Eye:** the covered eye is a flat grey disc. At L1 the "said" label by the face can sit under the lab bar in the lab; the clinic has no bar.
- **Foot:** a pulled splinter's fly-away line can still be seen for a moment at the top as the next step opens.
- **The why beat** shows only the doctor's line in the shots (the patient's line comes first and is gone by the time of the shot).
- **The sidebar card** (session A's order-card look) shows the L1 count as a small word at the row's right ("hakro"). That's A's G6.


## 5. For the doctor's recording and for Mum (never invented)
- **English placeholders, flagged:**
  - the colours;
  - up / down, left / right at L1–2;
  - wax, cotton bud, drops, cloth, bandage, turns, dabs, hammer, plaster, apple, jugs, beads;
  - hot / cold / lukewarm (*koso / nokoso*? check with Mum), "just right", "too hot / too cold";
  - honey (*madh*? to check), "make";
  - big toe / middle toe / little toe, "[my left foot]", "[left eye]";
  - bed, chair, cup, ball, key, spoon;
  - every "why" line and every cue.
- **Kutchi used only where it already exists:**
  - the numbers *hakro … panj*;
  - *pela / ne poi*, *wadho / nindho*, *dabo / jamno* (grammar notes §15);
  - *paani, dudh, hardar, aadu, limu, dungri, tameto, bataato, marcha, lasan*;
  - *jaldi, aste thi*, *chamchi*, *na / haa*.
- ***waaro*** (*hardar waaro dudh*) and ***ne*** as "and" (*aadu ne paani*) follow the sheet and Zafar's answer; the sheet says to check the form with Mum. The eye's side uses English, because the gender of "eye" (*dabi / jamni*?) isn't known.

## 6. Open questions for Zafar
1. The heal games no longer use the pharmacy's tray. Should a wrong or missing item from the pharmacy show up in the close-up (for example, the tool greyed out)?
2. The foot's side is said but not tested, since only one foot is drawn. Should L3 draw both feet?
3. Level-1 counts were added in the fever, foot, drinks and boing to keep a blind guess under 10%. Is that acceptable, or should level 1 be "taught" (unscored) there instead?
