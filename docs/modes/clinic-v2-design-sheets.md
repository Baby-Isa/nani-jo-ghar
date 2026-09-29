# Clinic v2: design sheets (29 Sept)

**What this is:** step 2 of the token plan (`docs/feedback/clinic-playtest-2026-09-29.md` §11). There's one short, buildable sheet per changed part of the clinic, so the two prototype sessions build rather than research.

**Sources:** Zafar's play-test report (items G, W, D, P, E, H), his answers (§9 and the two answer blocks under it), `docs/modes/clinic-design.md` (the original design), and the Cook design system (`docs/design/cook-design-system-v1.md`), which the clinic now follows.

**Rules for every sheet:**
- **Prototype first:** build on the new backgrounds (`sources/art/clinic-v2/`: cb1b, cb2b, cb3b, cb4b, cb5 and cb6b once they land) with **simple stand-in pieces**: flat shapes, the existing rough sprites, or the Cook art where it fits. Final character and item art comes after Zafar plays the prototypes.
- **Shared UI from Cook** (G3):
  - the order card as the **patient card** (face + headline + rows);
  - the sage Nani box;
  - the end pop-up;
  - the **round review face** (`Cook.Kit.review` and the `<who>-face / -happy / -frown` badges);
  - the Cook counting rule (Q7): level 1 written and counted aloud, level 2 written, level 3+ heard only;
  - VISUAL-QA §5.
- **Every game opens with one "why" beat** (G5): the patient says the problem, the doctor says the goal, and the first-time cue for every step comes with words and voice. `build/check_onboard.mjs` (from Cook) is extended to the clinic.
- **Never invent Kutchi.** Clinic words are English placeholders until the doctor's recording (Round 4 Section G, ~9 Oct), and **"no" is *na*, not *nar*** (G9). Words the game already has from Cook are used as they are: *paani, dudh, khun, loon, limu, aadu, hardar, wadho, nindho*, the numbers, *pela / ne poi*.
- **Level 1 is gentle** (one thing at a time, no timer). **Level 3** adds sides (the patient's own left/right), counts and order.

---

## A. The rooms (prototype session A)

### W. The waiting room (CB1b)
- **Why:** "Who's next?" The doctor leans out of his half-open door and calls a patient in.
- **Scene:** the six-seat bench; one or two standing by the door and the desk from level 2; **8–10 people** at level 3.
- **Steps:**
  1. The doctor calls: "[Bring in] {description}."
  2. The child taps the **tick** under the right person. It shakes if wrong and locks in if right. No one moves.
  3. The chosen person stands and walks to the door.
- **Levels (the language ladder, W4):**
  - L1: man / woman / boy / girl.
  - L2: + old / young.
  - L3: + tall / short.
  - L4: + a colour (of clothes).
  - L5: + "with the baby / with the child".
- **Words to record:** man, woman, young, tall, short, with, the colours (red, green, blue, yellow), "bring in".
- **Stand-ins:** the existing rough people and grey figures, placed in the bench slots and standing spots (8 slots on the bench line, 3 standing).

### D. Diagnosis (CB2b sitting on the bed; CB3b standing)
- **D1 "does it hurt here?":**
  - L1: 3 parts pulse. Tap one: "[Does it hurt here?]" The patient answers *na* or *haa*. On *haa* the sore mark shows, and **Found it** lights up.
  - L2 (was "D1b"): graded. After a *na*, press **Next**.
- **D2 "where does it hurt?":** the patient says "[My {part} hurts]" and the child taps it. From L3 the side is said: "[My {side} {part}]".
- **D3 "I don't feel well":** the doctor makes 2 calls at L2 and 3 at L3, e.g. "[Look in] the ear". The child picks the tool, then the part.
  - **Level 1 shows only the right tool plus one other.**
  - Each tool gets a first-time cue: look in → the torch, listen → the stethoscope, look at → your hand, the temperature → the thermometer.
  - **The torch must look like a torch** (not the pill-like rough sprite).
- **Layout:** the patient faces us, sitting on the bed's edge with legs dangling. The doctor stands to the right, turned ¾.
- **Zoom:** when a heal game starts, the view zooms from the patient on the bed into the close-up on CB6b.
- **Stand-ins:** the grey patient figure; a flat-colour doctor silhouette.

### P. The pharmacy (CB4b, straight on)
- **Why:** "Bring me…" The belt carries things along, and the child taps the ones asked for into the tray.
- **Belt:** the items ride **the painted belt** (not a code-drawn belt across the top). The tray sits on the counter strip in front, pantry-tray style (outlined dishes).
- **Levels:**
  - L1: 1 item, 6 on the belt.
  - L2: 2–3 items, look-alikes, a colour.
  - L3: 3–4 items in order (*pela {a}, ne poi {b}*), a **faster belt with the items closer together**. No timer (CQ5).
- **Items:** pick ones easy to draw and recognise. Replace "filling" (`paste`) with a clear tube. Check the whole list for items that only read as English.

### E. The send-off (CB5)
- **Why:** "Is everything okay now?" The patient is at the half-open front door with the doctor beside them.
- **Levels (CQ6):**
  - **L1:** the patient's round face circle shows the feeling. The child picks the matching card from four feeling faces (happy, sad, hot, cold).
  - **L2:** the patient **says** the feeling ("[I feel cold]"), with no picture. The child picks the card.
  - **L3:** the feeling shows, and the child picks **what helps** (cold → a blanket, sad → the apple).
- **"One more thing":** an **apple** (not a lolly; Mum).
- **Goodbye:** from L2 the doctor cues "[Say bye]", and the child taps or says it, **in the scene** (no left panel). E2 and E3 merge into one.
- **E4 (L3):** the child chooses the question to ask ("[How do you feel?]"). The first time, Nani whispers the idea, and the question card shows the patient's face with a "?".

### Shared clinic fixes (session A)
- **G6:** rows count up as you tap at L1 (the Cook rule), instead of ticking only when the step closes.
- **G7 / CQ15:** the grown-up **skip** button moves behind the ? menu. It's the shared onboarding (`js/shared/onboard.js`, `css/shared/onboard.css`), so this fixes Cook too, where it shows during the samosa coach.
- **G8:** fever's tray id (`strip` → `thermometer`) in `data/clinic/pipeline.json`; a test for the first-time help path, since the tests switch help off today.
- **G9:** *nar* → *na* for "no" everywhere in the clinic (diagnosis answers and the eye chart's "not" row).

---

## B. The heal games (prototype session B, on CB6b)
Each game is a close-up (knee, arm, ear, mouth, eye, foot) over the blurred bed. The patient's round face sits in a corner and reacts (neutral, ouch, happy).

### H-scrape (was "cut", the scrape variant) (CQ7)
- **Why:** "I fell over and scraped my arm." / "Let's clean it and put plasters on."
- **Steps:** *pela paani* (water), *ne poi* cloth (dab N times, counted), then **plasters in the colours and order said**.
- **Levels:**
  - L1: one plaster, one colour.
  - L2: 2 plasters, in order ("[first red, then blue]").
  - L3: 3 plasters, **half-and-half colours** ("[red and blue]") in order.
- **Drop** the cat, star and dot designs. The stitches stay as the "cut" variant, unchanged.

### H-knee (CQ8)
- **Why:** "My knee hurts." / "Let's check it and bandage it."
- **Steps:** tap the knee with the hammer N times (the leg kicks: funny, keep it), then **the flash-and-tap wrap**.
- **The wrap:**
  - Dots flash; tap each as it flashes, and the bandage wraps from the last dot to this one.
  - L1: 2 dots (left, right) at one height; tap left, right, left… for N turns.
  - L2: 3 dots each side at different heights, flashing in a set order.
  - L3: faster, more turns. A quick, lively reaction game.
- **L3 sides:** the side is said **and** only that leg glows ("[the {side} knee]").

### H-ear
- **Why:** "My ear feels blocked." / "Let's clean it."
- **Steps:**
  1. Take out the **wax blobs** (not seeds), big one first, then the small one (*pela wadho, ne poi nindho*).
  2. Clean N times with the cotton bud.
  3. N drops.
- **L2+:** wax blobs **keep popping up** for a few seconds, and you clear them before the drops (a calm whack-a-mole).

### H-tooth (CQ9)
- **Why:** "My tooth hurts." / "Let's brush, fix it and fill it."
- **1. Brush:** a toothbrush fixed across the mouth. Drag its head **up, down, left, right** in the called order ("Just Dance"). L1 2 moves, L2 4, L3 6 with *dabo / jamno*.
- **2. Drill the bad bits:** a close-up tooth with dark decay. Drag the drill over the dark bits and leave the white. Too much white and it chips. L3 adds a gentle timer.
- **3. Fill:** the doctor holds the filling tube. Press and hold, and it fills; **stop at the line** (chai's boil timing).
- **No green bug.**

### H-taste → the soothing drinks (CQ10, Zafar's refined idea)
- **Why:** "My throat hurts and my tongue is sore." / "Let's make drinks to soothe it."
- **Scene:** the tongue with **coloured bumps**. **Each colour is healed by one drink.**
  - yellow = turmeric milk (*hardar* + *dudh*, warm);
  - orange = ginger (*aadu* + *paani*, warm);
  - green = honey and lemon (honey to record + *limu*).
- **Steps:**
  1. The doctor says which drink ("[Make] *hardar waaro dudh*").
  2. The child makes it at a small counter (add the things, stir; chai-style pieces).
  3. Give it to the patient: the matching bumps shrink and vanish.
  4. **Before the timer runs out.**
- **Levels:**
  - L1: one colour, one drink, a generous timer.
  - L2: two colours, two drinks in the order said.
  - L3: three, with counts (*ba chamchi* honey) and a tighter timer.
- **Words to record:** honey, warm, "make", sore throat, tongue. *waaro* follows Mum's *{x} waari chai* pattern: check the form with her.

### H-fever (G8, then the original design made clear)
- **Why:** "I feel hot… no, cold!" / "Let's get you just right."
- **Steps:**
  1. The thermometer (it must look like one) goes to the forehead or mouth, and the reading turns **red** (hot) or **blue** (cold).
  2. Hot → the cool cloth or the fan; cold → the blanket.
  3. The patient says "[still cold / too hot / just right]".
  4. Check again. It **alternates** until "just right".
- **Levels:**
  - L1: 2 exchanges.
  - L2: 3–4, with a count ("[fan it] *trae* times").
  - L3: + *jaldi* / *aste thi* fan speed.
- **Words:** hot and cold. Zafar's family says ***koso*** (hot) and ***nokoso*** (lukewarm); *garam* may be Gujarati. Check with Mum.

### H-boing (the injection) (CQ13)
- **Why:** "Time for my jab." / "The doctor does it; you count."
- **Steps:**
  1. Wipe the arm N times.
  2. The syringe (held by the doctor) fills with **coloured beads**: each tap sends one in, counted aloud.
  3. The count-down with the doctor, then BOING.
  4. A plaster, then an **apple**.
- **Levels:** L1 count 2–3, one colour. L2 count 4–5. L3 colours said ("[two red, one blue]").

### H-eye (CQ11, Zafar's design)
- **Why:** "I can't see well." / "Drops, then let's test your eyes."
- **Steps:**
  1. Drops (N; the side at L2+; "cover the other eye" at L3).
  2. **The eye test:** the chart shows rows of pictures getting smaller. **The patient reads each row out**, and **the child judges right or wrong**.
  3. Wrong → another drop, then the patient reads that row again.
- **Levels:**
  - L1: one picture per row, and what they say is **also written by their mouth**.
  - L2: heard only.
  - L3: 2–3 pictures per row, read left to right, so the child has to think.
- **Vocabulary:** beyond fruit and veg: household things the child has met (bed, table, cup, ball, key…), drawn from Find it and Cook.

### H-foot (CQ12)
- **Why:** "Ow, something's in my foot!" / "Let's take the splinters out."
- **Steps:**
  1. Soak the foot: *paani* hot, cold or lukewarm (the words to record).
  2. **Pull each splinter out along its short path without touching the edges.** Touching makes the patient wince, and the splinter slides back a little.
  3. A plaster where each one was.
- **Levels:**
  - L1: 1 straight splinter.
  - L2: 2, gently curved.
  - L3: 3, with the toe named (big toe / little toe, the side).
- **The swirl** (which foot) goes; the patient says which foot.

### Tummy, hic, hair
Unchanged for now (CQ14). Zafar looks at them in the prototype round.

---

## C. Words for the doctor's recording (Section G, ~9 Oct)
Everything above that's in [brackets] or marked "to record":
- body parts;
- hurt / sore;
- look in / listen / look at / the temperature;
- hot, cold, lukewarm (*koso / nokoso*?), just right;
- the tools, plaster, bandage, drops;
- "bring in", man, woman, young, old, tall, short, "with the baby";
- the colours;
- "is everything okay now?", "say bye", "how do you feel?";
- honey, make, warm, throat, tongue;
- splinter, toe, big toe / little toe.

Check against Round 4 Section G (G1–G127) before the visit, and add what's missing.
