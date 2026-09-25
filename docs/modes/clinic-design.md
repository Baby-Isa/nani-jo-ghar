# The clinic (the doctor's clinic; formerly "Nani's clinic"): design (mode id `clinic`)

**Date:** 25 Sept 2026
**Status:** a proposal for Zafar, revised three times on 25 Sept (Revision 3 at the top is current; it is the clinic's deep dive under `docs/modes/DEEP-DIVE-BRIEF.md`). Nothing has been built. It follows `docs/modes/MODE-DESIGN-BRIEF.md` and builds on `docs/game-modes-v2.md` (mode 5), `docs/find-it-design.md` (the model), `docs/cook-with-nani-phase-a-design.md`, `docs/cook-with-nani-kutchi-audit.md`, `docs/cook-with-nani-build-log.md` and `docs/cook-with-nani-todo.md`.
**Placeholder rule:** there is **no Kutchi yet for any body part, feeling, care item, instrument or "it hurts" frame** (checked against `data/content.json` and `data/cook.json`). Anything written like `[EN: knee]` is an English placeholder, shown in grey italic until the family gives the word. The only Kutchi used below is what already exists: *Salamun alaykum / Wa alaikum salaam, Aabhar aanjo, Achija, Arre re!, Hedo!, Ghan, Muke {x} khape, Ne {x}, Muke hikdo {x} dine*, numbers 1–10, and the food words *dudh, paani, chai, khun, hardar, aadu*. **Never invent Kutchi.**
**Safety rule for this mode:** it's pretend care, not medicine. No blood, no surgery, no pills or doses for the player to give, nobody gets worse, and nothing a child could copy as real medical advice (section 7.4). *Patched 25 Sept (evening): cartoon stitches and a comedy injection are now allowed (Zafar's steer in `PIPELINE-BRIEF.md`); the doctor still holds the syringe, and the "no needles, no stitches" lines in R2.5, section 3 and 7.4 are superseded by the Pipeline design below.*

---

## Pipeline design, 25 Sept 2026

**Why this section.** Zafar's evening feedback (`docs/modes/PIPELINE-BRIEF.md`): what the clinic is missing is *structure and process*, "almost factory-like": a set sequence of stages, each stage a set of mini-games, stitched into one little story per patient. This section is that redesign. It **supersedes Revision 3, Revision 2 and the older sections wherever they conflict** (P9 lists what survives from the current build, P7 what changed). What doesn't change: the doctor and his warmth (R2.7, the likeness rules in 7.4), the body map and its leak rules (R2.2's six rules), sides only in the patient's voice (R3.2), the child never gives medicine (R3.1), speaking on `tell` with closed sets (R3.4), and the UX principles (request card, left sidebar, fixed-shape cards, light bulb, one job at a time, start tiny, the two-page end-of-round screen).

**Real Kutchi used below** (nothing else is Kutchi; everything in `[EN: …]` is a placeholder until the family gives the word): the numbers *hakro/hakri* (one, by gender; the game's *hikdo* is being retired), *ba* (two; said "ber"; retires *bo*), *trae, char, panj*; *ne* (and), *pela … ne poi …* (first … and then …), *saathe* (together); *Muke {x} khape* (I need), *Muke {x} de* (give me), *hi* (this), *khan* (take), *wij* (put in), *ke* (or), *haa* (yes, as heard in the A3 recording: to confirm), *nar* (no, draft); *wadho/nindho* (big/small, he-forms), *aastethi / jaldi* (slowly / quickly), *adh* (half); *paani, dudh, chai, khun, loon, limu, hardar, aadu, elchi, chamchi/chamcho* (tea/tablespoon), *{x} waari chai* (chai with x); *Salamun alaykum, Aabhar aanjo, Achija, Arre re!, Hedo!, Ghan.*

### P1 The pipeline

One patient goes through five stages, in this order, every time. Each stage is a screen with one job (UX principle 5) and a big button on the right that moves to the next. What one stage decides is what the next one runs on.

```
 ┌──────────────┐   who    ┌──────────────┐  part+side  ┌──────────────┐   the tray   ┌──────────────┐  all better  ┌──────────────┐
 │ 1 WAITING    │ ───────► │ 2 DIAGNOSIS  │ ──────────► │ 3 PHARMACY   │ ───────────► │ 4 HEAL       │ ───────────► │ 5 SEND-OFF   │
 │   ROOM       │          │   (the bench)│   ailment   │   (the belt) │  (items in   │  (one game   │  (the same   │  (feelings,  │
 │ "Bring in    │          │ "Where does  │ ──► the     │ "Bring me…"  │   the order  │   per body   │   patient,   │   goodbye)   │
 │  the girl"   │          │  it hurt?"   │  doctor's   │   items pass │   asked)     │   part)      │   healed)    │              │
 │  tap them    │          │  tap the part│  list       │   on a belt  │              │              │              │  end-of-round│
 └──────────────┘          └──────────────┘             └──────────────┘              └──────────────┘              └──────────────┘
   call (W1–W3)              D1 / D2 / D3                 belt + count                 the healing library           feel + tell
```

| Stage | The child does | Decided by the Kutchi | Carried forward |
|---|---|---|---|
| **1 Waiting room** | The doctor says who's next; the child taps that person on the bench; they walk to the examination bench | **Who**: kind of person (girl, boy, old man, old woman, baby, Nana…), then + colour, + big/small | The **patient** (their face, voice, tendencies), shown in the sidebar for the rest of the round |
| **2 Diagnosis** | Finds where it hurts: taps the part the patient names (or probes with yes/no, or checks parts the doctor calls) | **Which part**, then which side (*my left*), then the ailment's name | **Part + side + ailment**, which picks **one healing game** and its **item list** (the prescription); the doctor says the list as the next stage's request card |
| **3 Pharmacy** | Items pass on a belt; the child grabs the ones the doctor asked for, in the order and count asked, onto a tray with fixed slots | **Which items** (noun, colour, size, count), **which order** (*pela … ne poi*) | The **tray**: the items, in order, shown in the sidebar; each healing step uses the next one |
| **4 Heal** | One comical mini-game for that body part, using the tray's items step by step | **Counts, sides, colours, directions, order, speed** inside the doctor's instructions; the patient's reactions | The **healed patient** (a visible change: a plaster, a cast, twinkling teeth) |
| **5 Send-off** | The doctor asks if all is well; the patient says how they feel; the child answers with the matching face (or says the goodbye); the sticker goes in the album | **Feelings** (*okay, happy, better, sad, scared*), the goodbye | The **end-of-round screen** (UX 9): time, accuracy, hints; then the word review; then the next patient |

**The prescription is the seam.** Diagnosis ends with the doctor naming the ailment and saying its list (*[EN: For the ear:] Muke [EN: tweezers] khape, ne [EN: cotton], ne poi [EN: the green drops].*). That list is the pharmacy's request card, the tray's slots, and the heal stage's step order, so one data object (`ailments[id].items`) drives three screens. A child who mis-hears at the pharmacy still gets to heal: a wrong item on the tray is caught by the doctor's hand-over check (`handover`, kept from R3.1: he names what's there, sends the wrong one back to the belt), so the heal stage always starts with the right tray. The ear star is lost for that row; the fun isn't.

**One data object per stage, one runner.** `js/clinic/pipeline.js` (pure, runs in Node for the bot) takes a level per stage and returns the rows of a patient's round: the waiting call, the diagnosis rows, the pharmacy rows, the heal rows, the send-off rows. Each stage is a station file under `js/clinic/stages/`; each mini-game is a mechanic file or a short chain of them, as in Cook. The lab runs any stage, any variant, any healing game alone at level 1–3, or a whole patient, or a morning.

### P2 Stage 1, the waiting room: "Who's next?"

The bench by the door holds 2–5 people. The doctor (hands folded, looking at the child) says who to bring in; the child taps that person; they get up and walk to the examination bench, greeting the doctor (*Salamun alaykum* / *Wa alaikum salaam*; formal for elders). Nobody on the bench reacts until tapped, seats are shuffled every round, and a call is only made when at least two people could be meant (R2.2's rules, kept). The people are **kinds**, not names, because kinds are the lesson: *girl, boy, old man, old woman, baby (on Ma's lap), auntie, uncle*; the family are named on top (*Nana, Nani, Ma, Ali, Big Ma*), so the same bench teaches kinship in review.

| Variant | Level | The doctor says | The child does | What the Kutchi carries | Reuses |
|---|---|---|---|---|---|
| **W1 Bring in the girl** | 1 | *[EN: Bring in] [EN: the girl].* Bench of 2 at the first session, 3 from the second | Taps the right person | One word: the kind (7 kinds; 3 on the bench). A wrong tap: that person shakes their head and sits; the doctor repeats | `call` (new; the bench and the walk); the shared `which` module for the decoys (never two of the same kind at level 1) |
| **W2 The old man in red** | 2 | *[EN: The old man] [EN: in red].* Two or three old men in different colours; later two slots that both matter (*the girl in green*, with a boy in green and a girl in red on the bench) | Taps the one both words fit | Kind + colour (E60–E71). At the top of level 2, kind + *wadho/nindho* (the big boy, the small girl: real Kutchi today) | `call` + `which` (attribute-and-decoy: the decoys share one of the two words, never neither) |
| **W3 You call them** (speaking, S5) | 2+ | The doctor shows the child the card (the kind's picture, or its text at the reads stage) and nods at the bench | Says *{kind}, [EN: come]* to the bench; the person who matches what the recogniser heard stands up (a wrong hearing: the wrong person stands, looks puzzled, sits) | Production: the closed set is the kinds on the bench (3–5) | `tell` (the pills as the fallback; parent ✓) |
| **W4 Busy bench** | 3 | Two calls in a row (*pela the baby, ne poi the old woman*), two examination benches; comfort rings on everyone waiting | Taps both in the called order | Order words + two kinds; the rings make speed count (the stopwatch badge) | `call` with `order: 2`; the comfort ring from R2 |

**Levels:** 1 = one word, bench of 2–3, kinds only; 2 = two words (colour or size), bench of 3–4, W3 available; 3 = order of two, bench of 4–5, Busy. **Blind bot at level 1:** 1/3 a call. **Sceptic:** the same kind twice on the bench only from level 2, and then the second word decides; nobody stands, waves or looks until tapped; the walk plays only after the right tap.

### P3 Stage 2, diagnosis: "Where does it hurt?"

The patient sits on the examination bench, symmetrical, hands in lap, gaze forward (the neutral pose and the `mirror: true` hotspots stand). Three variants, as Zafar asked; which one runs is a data draw per level (`stages.diagnosis.mix`).

| Variant | Level | How it plays | What the Kutchi carries | Reuses |
|---|---|---|---|---|
| **D1 Does it hurt here?** | **1, the very first sessions** | 3 parts pulse gently (6 from the second session). The child taps one; the doctor asks *[EN: Does it hurt here?]* (G82); the patient answers *haa* / *nar* (yes / no) with a neutral face; a **yes** goes *ding*, the sore swirl appears, the patient says *[EN: My knee]*. Then the child presses the big **Found it** button on the right. From level 2 (D1b) the answer is graded: the child must act on what they heard, **Found it** on *haa*, **Next** on *nar* | Level 1: taught, not tested (elimination is the point; it teaches *yes, no, here* and the part's name). Level 2: **yes vs no** decides the act (R2's "only act on the word" rule; a bot pressing Found it every time fails on every *nar*) | `probe` (new, small: the pulse, the tap, the ding; the yes/no as a graded row from level 2) |
| **D2 It's my knee** | **1–3, the bulk** | The card shows the patient's face and one line; it shrinks into the sidebar; 3 s of quiet; the patient says *[EN: My {part} hurts]*. The child taps the part. Right: the swirl and *[EN: That's it]*; wrong: a giggle, *Arre re!* from Kasuku, the line again. Face parts in the close-up from level 2; sides in the patient's voice from level 3 (*[EN: My left knee]* · *[EN: Not that one, my other knee]*); from level 2 the doctor asks *[EN: Where?]* first and the child **says** the part (S2) before tapping | Which part (6 → 13 → 19), which side, the ailment's name in the patient's second line (*[EN: I fell]* / *[EN: it's stuck]* / *[EN: it itches]*; level 3+, Arc 4's past tense) | `where` (built), `tell` for S2 (built), `body.js` |
| **D3 The check-up detective** | **2+** | The patient: *[EN: I don't feel well. I don't know why.]* The doctor calls what to check and with what (*[EN: Listen to the chest]* · *[EN: Look in the ear]* · *[EN: The temperature: the head]*); the child does each with the kit; the find (a gurgle, a pink glow, *hot!*, a seed) shows only at the named sore part. **Level 4, the clue variant (V2b, Zafar's decision 5):** the patient gives clues instead and the child chooses what to check: *[EN: Not my head]* · *[EN: Near my hand]* · *[EN: It's up, not down]*; each clue is a listening row (*nar*, near, up/down); at most 3 checks | Part + instrument per call; from level 3 the patient's side; at level 4 negation and position words. Border with *Who did it?* kept: the clues are body words and positions, never causes | `check` (built: calls, kit, finds, sweep and leftovers rules); `clue` (new, level 4 only: the clue set and the check budget) |

**The ailment.** Every part has one or two ailments, each an entry in `ailments` (P4's library): `{part, game, items[], lines}`. Diagnosis draws the part from the level's list weighted to the child's weakest words, then the ailment. The doctor names it in one line and says the prescription (P1's seam); its request card opens the pharmacy. **Blind bot at level 1:** D1 ungraded; D2 1/6; D3 under 0.1% for 4 calls.

### P4 Stage 3, the pharmacy counter: "Bring me…"

The counter is a belt (a sushi belt: it loops, so nothing is ever lost and nobody can lose) running across the top of the play area, right to left, in front of the dispensary shelves. Items ride past on little dishes. The tray sits bottom-right, under the thumb, a **fixed-shape card**: it always shows the ailment's number of slots (a three-item prescription is always three empty dishes, in order), so the tray's shape never answers what to grab. The doctor stands behind the counter, hands folded, and reads the prescription as the request card (read-along highlight per chunk; it shrinks into the sidebar); the belt starts when the card has gone.

| Knob | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| What's asked | **1 item** (*Muke [EN: plaster] khape*) | 2–3 items, said as a list (*Muke limu khape, ne paani, ne [EN: honey]*); one may carry a colour or a size (*[EN: the green] [EN: bottle]* · *nindhi [EN: bottle]*) | 3–4 items with **order** (*pela [EN: cotton], ne poi [EN: the thread], ne poi [EN: plaster]*) and **counts** (*ba limu* · *trae [EN: tissues]*); a *nar* row (*nar khun*: no sugar, for the chai ailments) |
| On the belt | 6 items: the asked one plus 5 decoys from other ailments (never a look-alike) | 8: decoys include one look-alike per asked item (the red bottle for the green; the big cloth for the small) | 10: two look-alikes per asked item; the same item in two sizes and two colours |
| Speed | One item enters every 2.5 s; 9 s to cross | 2 s; 7 s to cross | 1.5 s; 5 s to cross; a **"belt stopper"** pedal (a hint: the tick star, like "?") |
| The grab | **Tap** the item: it hops to the next empty dish | **Drag** it onto the tray | Drag onto **the right dish** (the order row): the wrong dish is a miss (*pela*'s row) |
| Counts | — | *ba* limu: two taps, `count`'s tally on the tray (the digit only while the number word is at stage 1–2) | Counts up to *panj*; a count that overshoots costs the row |
| The check | The doctor lifts each dish and names it (`handover`, R3.1: *[EN: The plaster. Good.]*); a wrong one goes back on the belt with its name (*[EN: This is the red one. The green one, please]*) | + the count (*ba limu. Good*) | + the order (*Pela cotton, ne poi thread. Good*) |

**Rules that keep it honest** (the leak bot's new strategies **"first past"** and **"grab all"**): the belt order is random and loops, so waiting doesn't narrow it; grabbing an unasked item is a miss for that row (it goes back with the doctor's correction), so grab-all fails; the dishes are the same colour and size; a decoy is never from the same look-alike group at level 1 (fair for a first day) and always is from level 2; the tray never shows pictures of what's wanted, only empty dishes. **Blind bot at level 1:** 1/6.

**What carries into heal.** The tray slides into the left sidebar as a column of dishes in order; each healing step *uses* the next dish (it lights up, the child drags it onto the patient or taps it, as that game says), and an empty dish stays as a tick. So the order the child heard at the counter is the order they work in, and *pela … ne poi …* is heard twice per patient: once as an instruction, once as a review.

**Mechanics:** `belt` (new: the loop, the dishes, tap/drag, speeds as data); Cook's `count` (the tally), `handover` (built), the shared `which` module (decoy balance); Cook's `fetch` isn't used on screen but its pick-and-judge logic is the model for `belt`'s rows. **Free-play entry "The counter":** the belt alone, a shopping-style round (3, then 5, then 7 things), 60 s.

### P5 Stage 4, heal: the healing library

Twenty games, one per body part (two parts share the cut). Every one is comical and cartoon, never gory: a hurt is a pink line or a swirl, a bug is a beetle with eyebrows, the injection is a boing. The doctor's lines are instruction and praise; the comedy is the patient's (R2.7). **Every game carries Kutchi through the doctor's instructions**: a count, a side (*my left*, always in the patient's voice), a colour, a size (*wadho/nindho*), a direction, a speed (*aastethi/jaldi*), or an order (*pela … ne poi …*), and the tray's items are used in the order that was heard. The hands part (the gesture itself) is graded by the plaster star, never the ear. **Scores:** fun and Kutchi 1–5 (5 = best); build 1–5 (**5 = cheap**, reuses what exists). **Age** is where it lands best (5 / 8 / 11; "5+" means fine for all three).

**Summary table (part → game → key Kutchi).**

| # | Part | Game (the ailment) | Items on the tray | Core gesture | Key Kutchi | Age | Fun | Kutchi | Build | Set |
|---|---|---|---|---|---|---|---|---|---|---|
| H1 | Knee | **The kicking knee** (a bump) | hammer, bandage (colour) | tap → kick; wrap N turns; figure-of-eight | count, colour, side, path order | 5+ | 4 | 5 | **5** | 1 |
| H2 | Hand / finger / knee | **Plaster** (a scrape) | paani, cloth, plaster (design) | pour, dab, stick | part, side, colour | 5+ | 3 | 3 | **5** | 1 (the first-ever game) |
| H3 | Ear | **The seed in the ear** | torch, tweezers, cotton bud, drops | pluck in order, scrub, drops | *pela/ne poi*, count, side, count of drops | 5+ | 5 | 5 | 4 | 1 |
| H4 | Tooth | **Brush up, brush down** (a sugar bug) | toothbrush, drill, filling | directional strokes, tap the tooth, fill the shape | up/down/left/right, count, big/small, colours | 5+ | 5 | 5 | 3 | 1 |
| H5 | Tongue | **The taste test** (a coated tongue) | limu, khun, loon (three droppers), paani | pick the drop, faces, rinse and spit | *limu/khun/loon* (real), order, count | 5+ | 5 | 5 | 4 | 1 |
| H6 | Head | **Too hot, just right** (a fever) | thermometer, cloth, blankets, fan | lay and lift, add/remove | hot/cold, *just right*, count of blankets | 5+ | 5 | 5 | **5** | 1 |
| H7 | Throat | **Say aah and hardar dudh** | torch, honey (*chamcho*), dudh, hardar | look, spoon-count, Cook's tadka: pour, add, stir | count of spoons, *hardar, dudh*, stir count, *aastethi* | 5+ | 4 | 5 | **5** | 1 |
| H8 | Arm / leg / hand | **Stitches** (a cut) | paani, thread (colour), needle, plaster | wipe, stitch dot to dot N times, plaster | count, colour, *pela/ne poi* | 5+ | 4 | 5 | 3 | 2 |
| H9 | Arm | **The boing** (an injection) | cotton, the syringe (the doctor's), plaster, lollipop | wipe N times; **count down aloud** *trae, ba, hakro*; plaster | numbers spoken (S6), count, side | 5+ | 4 | 5 | 3 | 2 |
| H10 | Tummy | **Bubbles and burps** (too many sweets) | stethoscope, paani, hot-water bottle | drag bubbles up the tube, pour, lay the bottle | count, *jaldi/aastethi*, up | 5+ | 5 | 3 | 3 | 2 |
| H11 | Nose | **Atchoo!** (a cold) | tissues, a steam bowl, aadu, chai things | catch sneezes, hold under the towel, Chai tray | count of tissues, *aadu waari chai*, *nar khun* | 5+ | 5 | 4 | 4 | 2 |
| H12 | Eye | **Drops and the chart** (a sore eye) | drops, the pointer, an eye patch (design) | counted drops on the side; point at what he names on the chart | side, count, known nouns (fruit), *wadho/nindho* | 5+ | 4 | 5 | 4 | 2 |
| H13 | Foot / toe | **Sore feet** (the wedding dancing; a thorn) | tub, hot paani, loon, tweezers, bandage | pour to the band, add salt, wiggle the named toe, pluck, wrap path | hot, *loon*, big/small toe, side, path | 5+ | 4 | 4 | 4 | 2 |
| H14 | Leg | **The cast** (a comedy break) | X-ray, cast roll (colour), stickers, crutches | swipe the bone straight, wrap N turns, decorate | colour, count, side, *pela/ne poi* | 8 | 4 | 4 | 4 | 2 |
| H15 | Mouth | **Hic!** (hiccups) | paani, a glass, a paper bag | pour a glass, hold (count aloud to *panj*), *boo!* | numbers spoken, *paani*, *jaldi* | 5+ | 5 | 4 | 4 | 2 |
| H16 | Hair | **The beetles** (bugs in the hair) | comb, the jar, shampoo | comb in the called direction, pop the colour called | direction, colours, count | 5+ | 5 | 4 | 4 | 3 (decision 1) |
| H17 | Elbow | **Rub it in** (a stiff elbow) | cream, a cloth | knead-press N times at the speed called; the arm-wave test | count, *aastethi/jaldi*, side | 5+ | 3 | 4 | **5** | 3 |
| H18 | Neck | **The stuck neck** | warm cloth, cream | turn the head as called (up, down, my left, my right), then lay the cloth | directions, side, count | 8 | 3 | 4 | 4 | 3 |
| H19 | Chest | **Breathe in, breathe out** (a wheeze) | stethoscope, a rub, blanket | hold on *in*, release on *out*, on a ring; rub N times | in/out, *aastethi*, count | 8 | 3 | 3 | 4 | 3 |
| H20 | Back | **The knots** (Nana lifted the sack) | hot-water bottle, oil | press the knots in the called order and place, then lay the bottle | up/down, my left/right, *pela/ne poi*, count | 8 | 3 | 4 | 2 (back view art) | 3 (art) |

**Set 1** (seven games, phase 1) covers every slot type the pipeline needs (count, colour, side, order, direction, speed, hot/cold, spoken numbers come in set 2) at build cost 3–5, and gives Layla the two she'll replay (the taste test, the kicking knee). **Set 2** (phase 2) adds the two Zafar asked for (stitches, the injection) and the Cook crossovers. **Set 3** is variety and art.

#### H1 Knee: the kicking knee
*Ailment:* a bump from the puddle (Ali, in the story). *Tray:* the reflex hammer, a bandage (three colours on the belt from level 2). *Reuses:* `wrap` (built: turns on Stir's track, the figure-of-eight path), `count`; new: a `tap` reaction (a kick frame per patient, a laugh).
1. The doctor: *[EN: Tap the knee]* (level 3: the patient first, *[EN: My left knee]*). The child taps the knee with the hammer: the leg kicks, the trolley wobbles, everyone laughs. A tap anywhere else: nothing happens, the line again.
2. *[EN: The bandage.] Ba [EN: turns]* (level 1: *[EN: The bandage]*, any number of turns). Drag round the track; the tally shows on the badge, never the target; press the tick.
3. Level 3: *Pela [EN: round the knee], ne poi [EN: round the leg], ne poi [EN: the knee]*: the figure-of-eight across two hotspots in the called order.
*Levels:* 1 tap + wrap freely; 2 + count and colour (*[EN: the green] [EN: bandage]*); 3 + side and the path. *Age* 5+. *Fun 4, Kutchi 5, Build 5.*

#### H2 Hand, finger or knee: the plaster
*Ailment:* a scrape. *Tray:* paani (a jug), a cloth, a plaster in a design. *Reuses:* Cook's `pour`, `lift` (dab), `stick` (built). The **first-ever healing game**: three steps, one word each.
1. *Pela paani*: pour the jug over the scrape until the ring is green (a squeal: *[EN: cold!]*).
2. *Ne poi [EN: the cloth]*: dab it (tap the cloth on the spot, lift on green).
3. *Ne poi [EN: the plaster]*: peel and drag it to the swirl; the design is the child's choice (Maryam's collection; ungraded).
*Levels:* 1 the three steps, said one at a time; 2 said as one *pela/ne poi* list up front, the tray in order; 3 + colour of plaster and side (*my right hand*). *Age* 5+. *Fun 3, Kutchi 3, Build 5.*

#### H3 Ear: the seed in the ear
*Ailment:* the cousin's ear, always something in it (a sesame seed, a bead, a marble, a tiny sock). *Tray:* the torch, tweezers, a cotton bud, the green drops. *Reuses:* `check`'s torch beam, `drops` (built), Stir's track for the scrub; new `pluck` (Toca Doctor's splinter pull: drag the thing out along the arrow the doctor names).
1. *[EN: Look in the ear]* (level 3: *[EN: my left ear]* from the patient): the close-up opens, an ear canal like a cartoon cave with two or three things in it.
2. *Pela [EN: the seed], ne poi [EN: the bead]*: pull them out with the tweezers in the called order (a wrong first pull: it slips back, *Arre re!*). Level 1: one thing, no order. Each pull has its own noise; the patient says *[EN: that tickles!]*.
3. *[EN: Clean it]*: the cotton bud goes round the track *trae* times (the count from level 2).
4. *Ba [EN: drops]*: squeeze once per drop, press the tick.
*Levels:* 1 one thing + clean + drops (no counts); 2 two things in order, scrub count, drop count; 3 three things, the side, the drops' count in the patient's voice (*[EN: two drops, my left ear]*). *Age* 5+. *Fun 5, Kutchi 5, Build 4.*

#### H4 Tooth: brush up, brush down
*Ailment:* a sugar bug (Arc 1's sweets) and a cracked tooth. *Tray:* a toothbrush, the tiny drill, the filling paste. *Reuses:* the face close-up (`body.js`), `count`; new `brush` (directional strokes on a tooth row: the stroke direction is judged, Little Panda ToothBrush's brushing with the direction as the row) and `fill` (Baby Panda Dental's shape puzzle: drag the paste piece that fits the crack).
1. The mouth close-up: eight big teeth (the hotspot test's 0.5 cm tooth is fixed by drawing the mouth full-width at ×4). *[EN: Brush: up, up, down, left]*: a chain of direction words; the child strokes the brush that way; the sequence is 2 long at level 1, 4 at level 2, 6 at level 3 (a Simon chain with body-free words). Foam grows with every right stroke.
2. *[EN: The big tooth] / nindho [EN: tooth]* (level 3: *[EN: the second from my left]*): tap it; the bug hops out, eyebrows up; tap it *ba* times with the drill to shoo it into the jar (a count).
3. *[EN: Fill it]*: drag the paste shape that fits the crack (three shapes; the fit is visual, the ear row is done). The tooth twinkles.
*Levels:* 1 two strokes + one bug + fill; 2 four strokes, the bug count, big/small; 3 six strokes with *my left/my right*, the crack's colour paste (*[EN: the white one]*). *Age* 5+. *Fun 5, Kutchi 5, Build 3.*

#### H5 Tongue: the taste test
*Ailment:* a tongue coated in colours from the Eid sweets ("it tastes of nothing"). *Tray:* three droppers (*limu, khun, loon*: real words), paani. *Reuses:* `drops`; new `taste` (the tongue close-up, the coating that wipes off per drop, the faces).
1. *[EN: Stick out your tongue]*: the close-up; the tongue is striped in three colours.
2. *Pela limu*: pick the lemon dropper and drop on the tongue: the patient's sour face (the whole screen puckers), a stripe clears. *Ne poi loon*: the salt face. *Ne poi khun*: the happy face. Level 1: one drop, the doctor names it; level 2: the three in order; level 3: the count of drops per taste (*ba limu*) and the colour of the stripe to hit (*[EN: the green stripe]*).
3. *Paani!*: pour the cup; the patient rinses and spits into the bowl (the sound is the joke).
*Levels* as above. *Age* 5+. *Fun 5, Kutchi 5, Build 4.* (The Sceptic: the droppers are the same shape and the three words are the only difference; the faces play only after the drop lands.)

#### H6 Head: too hot, just right
*Ailment:* a fever (or a chill). *Tray:* the thermometer, the cool cloth, blankets, a paper fan. *Reuses:* `lift` and `tuck` (built), `warm` (R3's Just right, not yet built: this is its home).
1. *[EN: Take the temperature]*: press the strip to the forehead; the doctor reads it aloud (*[EN: Hot!]* / *[EN: Cold!]*); nothing readable on the strip.
2. On *hot*: lay the cool cloth, lift on green; on *cold*: tuck a blanket.
3. *[EN: How do you feel?]* The patient: *[EN: still cold]* → another blanket; *[EN: too hot]* → one off, or the fan (tap to waft, *jaldi!*); *[EN: just right]* → Done. Nana ends up under *char* blankets.
*Levels:* 1 one exchange (hot or cold, one step); 2 two or three exchanges in either direction; 3 the count said up front (*trae [EN: blankets]*) and the fan's speed (*aastethi/jaldi*). *Age* 5+. *Fun 5, Kutchi 5, Build 5.*

#### H7 Throat: say aah, and hardar dudh
*Ailment:* a sore throat (Nani, in the story). *Tray:* the torch, honey, dudh, hardar. *Reuses:* `check` (the torch), Cook's `count` (spoons), and **Cook's tadka station unchanged** (`pour`, `add`, `stir`) on a small hob at the pharmacy counter.
1. *[EN: Open your mouth, say aah]*: the torch on the throat; a pink glow, a tiny stuck sweet wrapper flutters (tap to lift it out).
2. *Hakro chamcho [EN: honey]*: one tablespoon on the spoon into the mouth (the count tap; *ba chamchi* at level 3: two teaspoons, so *chamcho/chamchi* is heard as a pair).
3. *Pela dudh, ne poi hardar, ne poi [EN: stir] trae*: pour the milk into the pan to the band, put in the turmeric (*hardar wij*), stir three times on the track, pour into the cup, hand it over (*Ghan*).
*Levels:* 1 look + honey + the drink with each step said as it comes; 2 the drink's steps said as one list; 3 counts on every step and *adh* (half a cup: *adh cup*). *Age* 5+. *Fun 4, Kutchi 5, Build 5.*

#### H8 Arm, leg or hand: stitches
*Ailment:* a cut from the shed door (a pink zig-zag with 4–6 dots, no blood). *Tray:* paani, a thread (colours), the needle, a plaster. *Reuses:* **Dress up's `stitch`** (shared: dot-to-dot with a needle), `pour`, `stick`.
1. *Pela paani*: pour over the cut to the green ring.
2. *[EN: The red thread]. Trae [EN: stitches]*: drag the needle from dot to dot; each crossing is a stitch and a small "oop" from the patient; the count is the row (the tally on the badge); a bow at the end (the joke: the doctor ties it like a shoelace). Level 3: the stitches in a called order (*pela wadho, ne poi nindho*: the big gap first, then the small).
3. *Ne poi [EN: the plaster]*: over the stitches.
*Levels:* 1 wash + stitch freely + plaster; 2 the count and the thread colour; 3 order by size and the side (*my left arm*). *Age* 5+ (it's a lacing card on a cartoon arm). *Fun 4, Kutchi 5, Build 3.* Rejects R2.5's T3 ruling: the thread carries counts and colours, not letters, and the patient's giggles keep it a toy.

#### H9 Arm: the boing (the injection)
*Ailment:* the jab everyone needs before the village trip (Arc 5) or the flu. *Tray:* cotton, the syringe (**the doctor's**: it's on the tray but only he lifts it), a plaster, a lollipop. *Reuses:* `knead` (the wipe count), `tell` (the count-down is a speaking moment, **S6**), `stick`. The safety rule stands: the child never gives medicine.
1. *[EN: Wipe it] trae [EN: times]*: cotton on the upper arm, three presses (a count).
2. *[EN: Count with me!]*: the child says *trae … ba … hakro* aloud (the closed set is the five numbers; the pills as the fallback); on the last number the doctor's syringe (huge, striped, with a flag) goes *boing*, the patient's hair stands on end, and it's done: *[EN: All better!]* A wrong or missed number: the doctor waits, *[EN: Say it again?]*.
3. *Ne poi [EN: the plaster], ne poi [EN: the lollipop]*: order words at the end.
*Levels:* 1 wipe + count down from *ba*; 2 from *trae*, the side (*my left arm*); 3 from *panj*, and the child names the colour of plaster the patient asks for. *Age* 5+. *Fun 4, Kutchi 5 (spoken numbers), Build 3.*

#### H10 Tummy: bubbles and burps
*Ailment:* too many sweets (Ali) or too much daar (Nana). *Tray:* the stethoscope, paani, the hot-water bottle. *Reuses:* `check` (the gurgle), `pour`, `lift`; new `bubbles` (drag each bubble up a winding tube to the mouth; Toca Doctor's tummy maze).
1. *[EN: Listen to the tummy]*: the stethoscope, a gurgle, everyone laughs; the tummy close-up shows *char* bubbles in a cartoon tube.
2. *[EN: Up!] Char [EN: bubbles], aastethi*: drag each bubble up and out; each one ends in a burp; too fast (*jaldi* when *aastethi* was said) and the bubble pops back down. The count is the row (the badge tallies burps).
3. *Ne poi paani*: pour a glass and hand it; *ne poi [EN: the hot-water bottle]*: lay it, lift on green.
*Levels:* 1 the bubbles freely + water; 2 the count and the speed word; 3 + the order of the last two steps swapped at random (*pela the bottle, ne poi paani*). *Age* 5+. *Fun 5, Kutchi 3, Build 3.*

#### H11 Nose: atchoo!
*Ailment:* a cold (the wet neighbour from the monsoon). *Tray:* tissues, a steam bowl, aadu, the chai things. *Reuses:* **Monsoon's `cover`** (shared: catch it in time), `lift` (the ring), **Cook's Chai tray** unchanged.
1. *[EN: Tissues!] Panj*: the patient sneezes at random over 20 s; tap the tissue on the nose in time for each; the doctor said how many sneezes are coming (the count row: the child stops reaching after *panj*; a sixth "reach" is a miss).
2. *[EN: The steam bowl]*: pour hot paani (the ring), a towel over the head, *[EN: breathe] … trae*: hold the towel down for three breaths (a ring per breath).
3. *Aadu waari chai, nar khun*: the Chai tray with ginger and no sugar (Cook's rows, with *waari* and *nar*).
*Levels:* 1 tissues (any number) + steam; 2 the sneeze count and the breath count; 3 + the chai order with extras and a *nar* row. *Age* 5+. *Fun 5, Kutchi 4, Build 4.*

#### H12 Eye: drops and the chart
*Ailment:* a sore, itchy eye. *Tray:* the drops, the pointer, an eye patch (a design: pirate, bandhani). *Reuses:* `drops` (built: side + count in two voices), Find it's "which one" via the shared `which`; new `chart` (a picture eye chart, rows shrinking: the fruit and kitchen words the child already knows).
1. The patient: *[EN: My left eye]*. The doctor: *Ba [EN: drops]*. Squeeze once per drop on that side; press the tick.
2. *[EN: Cover the other eye]*: put the patch on the *right* eye (the side row, reversed: the child has to hold "the other one").
3. *[EN: The chart. Aamo!]*: point at the mango on the chart; *[EN: Limu, the small one]* (*nindho limu*): rows get smaller; three calls at level 1, five at level 3.
*Levels:* 1 drops (one, no side) + three chart calls; 2 the count and the side; 3 the patch on "the other" side, big/small on the chart. *Age* 5+. *Fun 4, Kutchi 5, Build 4.*

#### H13 Foot and toe: sore feet
*Ailment:* the wedding dancing (Arc 2) or a thorn from the field (Arc 5). *Tray:* the tub, hot paani, loon, tweezers, a bandage. *Reuses:* `pour` (to the band), Cook's `add` (salt), `pluck` (H3), `wrap`'s path.
1. *Pela [EN: hot] paani*: pour into the tub to the band; *ne poi hakro chamcho loon*: one spoon of salt; the feet go in, steam, the toes wiggle (*[EN: ahh]*).
2. *[EN: The big toe]* / *nindho [EN: toe]* (level 3: *[EN: my left, the small one]*): tap the toe; it wiggles alone; a wrong toe: all five wiggle and the patient giggles.
3. Thorn variant: *[EN: Pull it out]*: pluck along the arrow; *ne poi* the bandage, *[EN: round the foot, round the leg, round the foot]*.
*Levels:* 1 the bath + one toe; 2 the salt count and big/small; 3 the side and the thorn's path. *Age* 5+. *Fun 4, Kutchi 4, Build 4.*

#### H14 Leg: the cast
*Ailment:* a comedy break from the mango tree (the bone has a kink and a face). *Tray:* the X-ray plate, the cast roll (colours), stickers, crutches. *Reuses:* `wrap` (the cast is a bandage with a hard finish), `stick`; new `xray` (Dr Panda's swipe: the bone straightens with one swipe in the called direction).
1. *[EN: The X-ray]*: hold the plate over the leg (a ring); the picture shows the kink. *[EN: Swipe up]* / *[EN: my left]*: straighten it (the direction is the row).
2. *[EN: The blue cast.] Char [EN: turns]*: wrap; it sets with a "clonk".
3. *Ne poi [EN: the stickers]*: decorate (free); *ne poi [EN: the crutches]*: hand them over; the patient hops off (the walk in P6 is on crutches).
*Levels:* 1 X-ray + wrap freely; 2 colour and count; 3 the swipe direction, the side, the order of the last two. *Age* 8 (Zayn's; Layla plays it at level 1). *Fun 4, Kutchi 4, Build 4.*

#### H15 Mouth: hic!
*Ailment:* hiccups (Ali, from laughing). *Tray:* paani, a glass, a paper bag. *Reuses:* `pour`, `tell` (counting aloud, S6's set), `lift`.
1. The patient hiccups every few seconds (they hop on the bench). *Pela paani*: pour a glass to the band and hand it; they drink; a hiccup.
2. *[EN: Hold your breath.] [EN: Count to] panj*: the child counts aloud *hakro, ba, trae, char, panj* (spoken; the patient's cheeks swell with each number; the pills as the fallback); another hiccup.
3. *[EN: Boo!]*: the doctor nods; the child taps the patient's shoulder hard (any tap); the patient jumps; silence; the doctor's big laugh.
*Levels:* 1 water + count to *trae*; 2 to *panj*, the glass *adh* (half) or full; 3 *jaldi!* (count fast) or *aastethi* (slow), judged by cadence. *Age* 5+. *Fun 5, Kutchi 4, Build 4.*

#### H16 Hair: the beetles
*Ailment:* bugs in the hair (drawn as tiny beetles with eyebrows; the word "lice" is never used; decision 1). *Tray:* the comb, the jar, shampoo. *Reuses:* `brush` (H4's directional strokes on hair), `count`, the colour pick via `which`.
1. *[EN: Comb down, down, left]*: strokes in the called directions; each stroke flushes out a beetle.
2. *[EN: The red one!]* *[EN: Now the green one]*: tap the beetle in the named colour; it hops into the jar (a wrong colour: it waves and hides again). *Panj* beetles at level 2; the count is a row.
3. *Ne poi [EN: shampoo]*: rub (knead) *trae* times; foam; a rinse.
*Levels:* 1 two strokes + any beetle; 2 four strokes, colours, the count; 3 six strokes with sides, two colours per call (*the red one, ne poi the green one*). *Age* 5+. *Fun 5, Kutchi 4, Build 4.*

#### H17 Elbow: rub it in
*Ailment:* a stiff elbow (Big Ma's sewing arm). *Tray:* cream, a cloth. *Reuses:* Cook's `knead` (press count), `lift`. The cheap one.
1. *[EN: The cream.] Trae [EN: times], aastethi*: press the elbow three times at the cadence said (a slow press when *jaldi* was said, or the reverse, misses the speed row).
2. *[EN: Bend it!]*: tap the elbow; the patient does a silly arm-wave, the joke.
3. *Ne poi [EN: the cloth]*: lay it, lift on green.
*Levels:* 1 press freely + cloth; 2 the count and speed; 3 the side. *Age* 5+. *Fun 3, Kutchi 4, Build 5.*

#### H18 Neck: the stuck neck
*Ailment:* a neck stuck looking sideways (the cousin, from looking for his lost things). *Tray:* a warm cloth, cream. *Reuses:* `lift`, `knead`; new `turn` (drag the head in the called direction; a head-turn frame set per patient).
1. *[EN: Look up] · [EN: look down] · [EN: my left] · [EN: my right]*: drag the head that way; it creaks; a wrong way and it springs back.
2. *[EN: Rub] ba [EN: times]*; *ne poi [EN: the warm cloth]*.
*Levels:* 1 two turns; 2 four with a count; 3 sides in the patient's voice and *aastethi* on the turns. *Age* 8 (the sides). *Fun 3, Kutchi 4, Build 4.*

#### H19 Chest: breathe in, breathe out
*Ailment:* a wheeze from the dust (Arc 5's field). *Tray:* the stethoscope, a chest rub, a blanket. *Reuses:* `check`, `lift`'s ring, `knead`, `tuck`.
1. *[EN: Listen to the chest]*: the stethoscope; the breathing sounds; *[EN: Breathe in … breathe out]*: hold the stethoscope down on *in*, lift on *out*, three times, on a ring (a lift on *in* is a miss).
2. *[EN: The rub.] Ba [EN: times], aastethi*; *ne poi [EN: the blanket]*.
*Levels:* 1 two breaths; 2 four, the rub count; 3 *aastethi/jaldi* on the breaths and the side (*my left side*: a first "side" that isn't a limb). *Age* 8. *Fun 3, Kutchi 3, Build 4.* The calm one; keep it for the end of a Busy morning.

#### H20 Back: the knots
*Ailment:* Nana lifted the rice sack. *Tray:* oil, the hot-water bottle. *Reuses:* `knead`, `lift`; needs the **back view** (the swivel stool art, R2.6), so it waits for the art budget.
1. *[EN: The top one] · [EN: the bottom one] · [EN: my left]*: press the knot named (three or four on the back), *ba* times each; the knot uncurls with a pop.
2. *Pela [EN: oil], ne poi [EN: the hot-water bottle]*: rub, then lay and lift on green.
*Levels:* 1 two knots by up/down; 2 counts; 3 sides and the order. *Age* 8. *Fun 3, Kutchi 4, Build 2.*

**Rejected from the pool** (one line each): the pill organiser (Tidy up's; Zafar); a drip (nothing to hear); blood pressure (the reading is a number the child can't act on); bone-setting by hand (Toca's, but a swipe on an X-ray does it kindly in H14); surgery of any kind; a bottom for the injection (the joke would be at the patient's expense, and elders are patients).

**The Sceptic on heal.** The gesture is hands, not ears; the ear rows inside a healing game are the counts, sides, colours, directions, orders and speeds, and each is closed the same way as Cook's: the tally never shows the target, a count never ends itself (the tick), the order is heard not drawn (the tray's dishes are blank until used), a side is the patient's own, the direction chain is random per round, the coloured things are shuffled, and a speed row needs the cadence, not a button. Level 1 of set 1 has 1–3 ear rows per game; a level-1 patient's pipeline is about 1/3 (waiting) × 1/6 (diagnosis) × 1/6 (pharmacy) × 1/2 (one heal row) ≈ **0.5%** for a blind bot's ear star, and the stopwatch punishes waiting.

### P6 Stage 5, the send-off: "Is everything okay now?"

The patient stands (or hops on crutches), healed. The doctor: *[EN: Is everything okay now?]* The patient answers with a feeling; the child acts on it; then the goodbye; then the sticker and the end-of-round screen.

| Variant | Level | How it plays | What the Kutchi carries | Reuses |
|---|---|---|---|---|
| **E1 Happy or sad?** | 1 | The patient: *[EN: Yes! Now I'm happy]* (or, one time in four, *[EN: Still a bit sad]*). Two big face cards on the right (happy / sad): the child taps the one they heard. Sad → one more thing from the sidebar (Big Ma's song, a sticker, the lollipop), then the question again, always ending happy | *happy, sad* (G64–G65); *okay* (new) | `feel` (new, small: the face cards, the one-more-thing) |
| **E2 Four feelings** | 2 | Four cards: *okay, happy, better, sad*; at level 3 *scared* (before H9's boing only, always resolved: *[EN: I was scared, now I'm happy]*, G66). The patient's line varies (*[EN: I feel better]* · *[EN: I'm okay]*) | Five feelings, a *was/now* pair at level 3 | `feel` with 4–5 cards; the shared `which` for the decoy cards |
| **E3 Say goodbye** (speaking, S7) | 2+ | The child says the goodbye: *Achija!* / *Aabhar aanjo!* / *[EN: Get well soon]* (G84), the one the doctor cues (*[EN: Say thank you to the doctor]* on the child's behalf, or *[EN: Say bye]*); the patient waves back with the matching line | Production: a closed set of 3 | `tell` |
| **E4 You ask** (speaking, S8) | 3 | The child asks the question: *[EN: How do you feel?]* (G83); the patient answers; the child taps the face | Production of the question frame + the feelings | `tell` + `feel` |

Then: the sticker for the album (one per patient the first time; one per ailment), *Aabhar aanjo!* from the patient, the doctor's big laugh, and the **end-of-round screen** (UX 9): page 1 the stopwatch (this patient's time, personal best per ailment and level), the accuracy slots (every ear row of the five stages as one row of dots), the hints badge (light bulb taps + "?" + the belt stopper); page 2 the word review: the kind, the part, the items, the feeling, each with a tap to hear. **Next patient** → stage 1.

## Revision 3, 25 Sept 2026: mechanics, speaking and Zafar's answers

**Why this revision.** Two things landed after Revision 2: Zafar's answers to its five decisions, and the deep-dive brief for every mode (`DEEP-DIVE-BRIEF.md`: each mode is a set of mini-games built from modular mechanics, one mechanic per file, reused from Cook where they fit; speaking is core, with closed-set recognition against `js/shared/speech.js`; all modes are built at once, so phases 0–1 touch only the mode's own files). Revision 2 already has the backbone (visit types), the scored library (R2.5), the ladder (R2.3) and the Sceptic's estimates, so this section doesn't repeat them. It adds what the brief asks for and what the answers change, and **supersedes Revision 2 where they conflict** (R3.8 lists the patches). It's short by design; the depth is in R2.

### R3.1 Zafar's answers, applied

| # | Decision (R2.8) | Zafar's answer | What changes |
|---|---|---|---|
| 1 | The check-up as about half of level 1 | Didn't follow the question; left to me | **What "level 1" means for the clinic, in plain words:** it's the game a child meets on their first day, before any word is known. The doctor's instruction carries **one word** (*the head*; *a plaster*), the patients are the six big parts only, a treatment has one slot (which item), and the only visits are you're-the-patient, the check-up with nothing wrong, and the named ailment. A level isn't a door: it follows the child's word stages, so Zayn leaves level 1 in a morning and Layla stays a while. "About half" was about **the mix of a level-1 clinic morning** (3–4 visits). **Default:** a level-1 morning is **2 check-ups and 2 named ailments**, the first visit always a check-up (the calmest: the doctor talks, nothing is found, every row is one word), the rest shuffled; from level 2 the mystery and bring-someone-in join the draw. It's a data knob (`days.mix`), so it can be retuned after the first playtest without a design change. Why half and not more: the check-up is the densest Kutchi, but every row is the doctor's voice; the named ailment is where the *patient* talks and where the hands get their payoff, and a first morning needs both feels |
| 2 | Does the child ever give medicine? | **Never.** The child fetches (or mixes) and **hands it to the doctor, who checks their work**, and that check is a spoken word review inside the fiction: he holds up what was brought and names it, the part and the count | A new mechanic, **`handover`** (R3.3): the child puts what they fetched or mixed into the doctor's open hand; he lifts it and names it (*[EN: The green bottle. Two. For the ear.]*); right → he uses it, off-hand, closed; wrong → he names what it *is* and repeats what he asked (*[EN: This is the red one. The green bottle, please.]*), and the child goes back to the shelf. The same mechanic runs **at the end of every treatment**: he looks over the child's work and names each thing (*[EN: The bandage. The knee. Round twice.]*), one item at level 1, up to three at level 3. So every visit ends with its words heard again, from him, in order, which is the review Zafar asked for; the end-of-morning list (Kutchi → English) stays as the reader's version. T6 (the dispensary) and T5 (mix the medicine) both end in `handover`; the safety checklist gains the line "the player never gives medicine; they hand it to the doctor" (7.4) |
| 3 | The pill organiser | **Dropped for now.** He likes it for the days of the week; the Tidy up agent is considering it as an older-children Tidy up mini-game | T4 stays rejected for the clinic (R2.5); the "decision 3" note there is closed |
| 4 | Sides | **The patient always says "my left" / "my right"** (their own side) | Sides now come **only from the patient's mouth**, in first person; the doctor never names a side about a patient. R3.2 has the frame and the mirrored-patient difficulty designed around it; R2.6 step 2 is patched |
| 5 | The level-4 "patient gives a clue, the child chooses what to check" | Unsure | **Not in the first set.** Noted in R3.7 as a later idea (V2b), to be tried once level 4 exists and *Who did it?* has its own deduce verb settled |

### R3.2 Left and right, in the patient's words

The rule: **a side is a thing a patient says about their own body.** *[EN: My left knee hurts.]* *[EN: Not that one, my other knee.]* *[EN: My right eye.]* The doctor's calls and treatment lines never carry a side; they refer back (*[EN: That knee. Round twice.]* *[EN: Two drops.]*), so there's never a "whose left?" to resolve in his voice. This also splits the family recordings cleanly: the six *my {side} {part} hurts* phrases in the patient's voice, and the doctor's lines without sides.

The ladder, built on that phrasing:

| Step | Level | What happens | Why it's the right difficulty |
|---|---|---|---|
| **A. Your own left** | 2 | In **you're the patient** (the lap view is first person, so your left is on the left of the screen) the doctor asks *[EN: Does your left knee hurt?]* and you answer; you say *[EN: my left knee]* when he asks where (R3.4, S1). Doctor Nani asks *[EN: show me your left hand]* in the room | Own-body left and right is reliable from about 6–7 (Rigal); no rotation |
| **B. Their left, facing you** | 3 (age 7+) | The patient on the bench says *[EN: My left knee hurts]*. Their left is on the right of your screen. You tap it; the check-up's side rows work the same way (the doctor: *[EN: Now the knee]*; the patient: *[EN: My left one]*), so the side is still the patient's voice and the check-up keeps two voices per row | The mental rotation is the puzzle Zayn wanted; "my" tells the child whose side it is, every time, which is the ambiguity Zafar wanted gone |
| **C. The twist** | 3+ | *[EN: Not that one. My other knee.]* after a wrong tap, or as a row of its own | The child has to hold "my" *and* "other" |
| **D. On your own** | 4 | Both A and B in one morning; the doctor's away for the last patient, so the hand-over check (R3.1) is done by the patient (*[EN: Yes, my left. Thank you]*) | — |

Rules that keep it honest: the patient never lifts, points at or looks at the side they name (the `mirror: true` hotspot rule and the neutral pose stand); a side miss at level 3 costs the ear star only after the recast (*[EN: My left. My other knee]*) has been ignored once; after two misses the patient touches their own knee (rung 6, shown; the star is gone). The **swivel stool** (a back view per patient, so their left is your left) remains a held art item that removes the rotation, not the word. A5 still decides whether the family says *left/right* or *this side/that side*; if the latter, the frame is *my this side* / *my other side* and step B loses the rotation but keeps the word.

### R3.3 The mechanics list

One mechanic = one file, difficulty levels as data and rounds as data, exactly like `js/cook/mechanics/`. Mini-games chain mechanics as zones of a combined station (`js/clinic/stations/`, like Cook's Maani line): **the visit** (`calls → where? → care → stick|wrap|lift|tuck|drops → handover`), **the dispensary** (`fetch → handover`; later `pour + count + stir → handover`). Every mechanic below is usable alone in the clinic lab.

| Id | One line | Tag |
|---|---|---|
| `pour` | Mix the medicine (T5): the syrup from the bottle into the cup, a green band | **Reused from Cook** |
| `stir` | Mix the medicine: *stir three times* on the circular track | **Reused from Cook** |
| `count` | The counted tap: spoons of syrup; the counter that `wrap` (turns) and `drops` (drops) reuse | **Reused from Cook** |
| `fetch` | The dispensary shelf (T6): *the green bottle, two of the small ones, the one on the top shelf*; look-alikes on a shelf | **Reused from Cook** |
| `passme` | The doctor's bag mid-care (M8): three look-alikes in the sidebar | **Reused from Cook** |
| `knead` | Cream (T15, later): *rub it in three times* | **Reused from Cook** |
| `check` | M15: the doctor calls a part (+ an instrument from level 2; the patient adds a side at level 3); tap it with the kit; the instrument reacts; a `find` on one call in the mystery | **New** |
| `where` | M1: the patient's line → tap the part; the sore swirl after the right tap | **New** |
| `care` | M2: the trolley pick against the instruction: item, then + colour or count; calls the shared which-one module for the decoys | **New** |
| `stick` | T1 plaster: peel, drag to the spot (Cook's `S.pour` drag helper, score = distance) | **New** |
| `wrap` | T2 bandage: turns on Stir's track round a limb axis from the hotspot data, the count from `count`, never ends itself, Done; level 3 `path`: the figure-of-eight between two named hotspots in the called order | **New** |
| `lift` | T12: lay the cold pack, cloth or hot bottle; lift on green (`S.ring`) | **New** |
| `tuck` | T13: the blanket, a vertical drag; the code-drawn stack | **New** |
| `warm` | M4 Just right: steps from just right; each action changes it; the patient says the new state; Done | **New** |
| `drops` | T11: the dropper, one counted tap per drop on the sore side's spot, never ends itself | **New** |
| `handover` | Hand the fetched or mixed thing to the doctor; he names it, the part and the count, and uses it or sends you back; also the end-of-treatment check (R3.1) | **New** |
| `call` | M7 Who's next: the bench, the name call, comfort rings in Busy | **New** |
| `you` | V0 You're the patient: the lap view, the leaning-in doctor, the probe, the plaster picker, and S1's speaking | **New** |
| `ask` | The "?" rung: *[EN: The knee, or the foot?]* at a cost; never when two options are all that's left | **New** |
| `echo` | Kasuku's echo modifier (later, needs the cast-rule exception) | **New** |
| `tell` | Role reversal: the child says (or taps) a word and a character acts on it; wraps `speech.listen`, the pill fallback and the parent-judges toggle; every speaking moment in R3.4 runs on it | **Shared** with every mode's role-reversal moment (Find it "tell Ali", Tidy up, Dress up, Who did it, Monsoon, Snap). Built first in `js/clinic/mechanics/tell.js` against the `listen()` call, and offered to `js/shared/mechanics/tell.js` at integration if the orchestrator wants one copy |
| `which` | The "which one?" attribute-and-decoy pick (the green bandage of three rolls; the bottle by colour, count and size; the look-alike groups' balance and blind odds) | **Shared** with Find it M3, Dress up D1, Snap M4, Who did it, Tidy up (the foundation module; the clinic calls it from `care` and `fetch`, with a local stub in phase 1) |

**Count: 6 reused from Cook, 14 new, 2 shared.** Not mechanics but shared modules the clinic calls: `js/shared/speech.js` (`listen({choices, timeoutMs}) → {choice, confidence} | null`), `js/shared/rel.js` + `data/relations.json` (only for *the one on the top shelf* and the Arc 5 courtyard, phase 3), overlay-at-anchor sprites (patients' head-layer expressions and care items on `spots`, shared with Who did it and Dress up), and star sets and ear/voice rules as data. Own infrastructure, not mechanics: `body.js` (hotspots, sides, close-up, swirl), `patient.js`, `queue.js`, `visit.js` (the generator: pure logic, runs in Node for the bot).

### R3.4 Speaking moments

All four run on `tell`, against `listen({choices, timeoutMs})`. Rules held everywhere: the closed set is stated and never bigger than 8; a `null` or a low confidence (`voice.minConfidence`, data) gets one *[EN: Say it again?]* from the doctor, then the **audio pills** slide up (one look-alike group of 3, text only at the reads stage), and a settings toggle "**a grown-up judges speaking**" replaces the recogniser with ✓ / again for a parent or Nani; the mic never blocks progress (the pills are one tap away from the first timeout on); what the recogniser heard is always shown **by the character acting on it**, never by an error message, so a wrong hearing plays as an ordinary miss in the fiction; the **voice star** is earned when the first try is accepted (recogniser or parent), and is separate from the ear star, which speaking neither earns nor costs. Tapping a pill instead of speaking is always allowed and earns no voice star. `star_sets.clinic` becomes ear / **voice** / plaster / tick or bolt; a visit with no speaking moment shows no voice slot.

| # | Moment | When | The closed set | What the character does | Fallback | Star |
|---|---|---|---|---|---|---|
| **S1** | **"It's my knee"** (you're the patient, V0) | **Level 1**, every V0; the story's first minute | The lap view's visible parts: hand, finger, arm, elbow, knee, foot, toe (**7**); for a cold, hot / cold / just right (**3**); at level 2 with a side: *my left knee* (the 7 parts × a side is spoken as one phrase, but the set the recogniser gets is the 7 parts, then left / right as a second `listen` of **2** only after the part is right) | The doctor asks *[EN: Where does it hurt?]*, hands folded. He presses where he heard: the right part → *[EN: Ahh, this one]* and the plaster; a wrong hearing → *[EN: Here?]* on that part and you say *no* (or say it again). The two-way *knee or hand?* pills stay as the fallback | Pills at once at level 1 (mic and pills together, since the child may not know the word yet); mic first from level 2 | **Voice star from level 1**: V0's ear rows stay ungraded (they're two-way taps), but "knee" out of seven isn't a guess, so V0 becomes the clinic's first real speaking game |
| **S2** | **"Tell him where"** (the named ailment, V3) | **Level 2+**; from level 3 the doctor asks it on every V3 | The level's parts in play for that patient: the 6 big parts, or the 6 face parts when the close-up is open (**6**); at level 3 the side is a second `listen` of **2** | The patient says the complaint (ear); the doctor, not looking: *[EN: Where?]* The child says the part; **he checks the part he heard** (a check-kit tap on it); the right one → the swirl and *[EN: That's it]*; a wrong one → the patient giggles and the doctor: *[EN: Nothing there. Where?]* | Tapping the part yourself (the ordinary M1 tap) is always there and grades the ear star exactly as before; only the voice star needs the word said | Voice. **Honest weakness:** the child has just heard the word, so this is shadowing with a purpose (say what you heard, to the right person); it trains the mouth and the doctor's acting-on-it proves the word landed, but the ear star, not the voice star, is the comprehension test |
| **S3** | **Bring someone in** (V4: tell the doctor what's wrong) | **Level 2+** in free play; in **Arc 3 Ch4** at level 1 with mic and pills together | Whose and where: the doctor asks *[EN: What's wrong with Nani?]*; the set is the 6 big parts (or 6 face parts for a face case) for the part (**6**), then, at level 3, *hot / cold / tired / sneezy* for the feeling (**4**). The person is never in the set (the doctor already knows who) | He examines the part he heard on the message-patient (or on the patient you walked in): a V1 call on that part; a wrong hearing → *[EN: Nothing wrong there. What else?]* and you say again; the right one → *[EN: That's it. Will you help me?]* and the treatment | The audio pills (picture → word, one look-alike group of 3); parent ✓ | Voice. This is the mode's real production moment: the child **saw** the hurt at home (nobody said it) and now says it |
| **S4** | **"What have you brought?"** (the dispensary, T6; later T5) | **Level 2+**, phase 3 | The shelf's items that round: the green bottle, the red bottle, the small ones, the drops, the cream (**3–5**; colours and sizes are Round 1 words) | The child hands it over (`handover`); before naming it the doctor asks *[EN: What's this?]*; the child says it; he then names it himself either way (*[EN: Yes. The green bottle. Two]*), so the spoken review is heard whether or not the child spoke | Pills; parent ✓ | Voice |
| — | **Doctor Nani, flipped** (Grandparent mode) | Any time, in the room | Parts in big text on the tablet for the child to read at the reads stage, or heard once for the child to repeat | The child tells Nani *[EN: show me your nose]*; Nani touches it; Nani taps ✓ | Parent-judged only; no recogniser | Voice (Nani's ✓) |

**The Sceptic on speaking.** (1) Say anything and let the recogniser pick the closest: the confidence floor sends her to *say it again?* then the pills, and a wrong closest choice is acted on and misses like a tap; (2) mumble the same syllable for every row: the leak bot gets a **"mumble"** strategy that feeds the stub recogniser a fixed choice, and it must earn the voice star under 10% (with 6–7 choices it's under 17% a row, and a V0 has two rows); (3) tap the pills every time: allowed, no voice star; (4) a parent who ✓s everything: the parent's call, and the brief allows it.

### R3.5 The review's critiques

The review (`REVIEW-2026-09-25.md`) put the clinic out of scope except where it overlaps. The rows that touch it:

| Critique | What I did |
|---|---|
| Arc 3 Ch4 is overloaded (clinic, Who did it W2's doctor at the door, Dress up D4 "wrap her up"); clinic owns it, the door is a beat | **Adopted.** Ch4 stays one errand (the clinic) with the home part as beats; a doctor-at-the-door beat is welcome as a beat; blankets stay the clinic's and are never clothing |
| Six daily minutes; one rotating hub daily instead | **Adopted.** The clinic claims no daily. It exposes one 60-second entry, **One patient** (a V1 or V3), for the hub to rotate; You're the patient is a second 60-second entry if the hub wants a speaking one |
| "Tell Ali" role reversal is fine but later, and needs the shared pill builder | **Overtaken by Zafar's principle 3:** speaking is core, not later. `tell` is built in the clinic's own folder against `speech.listen` in phase 1, with the pill builder inside it, and offered as the shared copy |
| One shared ear rule (`minTested`, taught-rows excluded) | **Adopted:** the clinic's `minTested` is 3 rows per check-up and 2 per named ailment; V0's ear rows are excluded (taught); a `voicePass` rule sits beside it |
| The "which one?" decision should be one shared module, not five | **Adopted:** `care`'s colour pick and the dispensary use it; phase 1 runs on a stub with the same call and swaps it at integration |
| Relations file and `spots` schema: one owner (Find it), nobody else edits until merged | **Adopted:** the clinic touches relations only in phase 3 (*the top shelf*, the Arc 5 courtyard) and keeps its scene data in `data/scenes/clinic.json`, never in a shared scene file |
| Overlay-at-anchor sprites built once (Who did it, Dress up) | **Adopted** for the patients' head-layer expressions and items on `spots`; the phase-1 greybox draws them in code and switches over in phase 3 |
| Wave 5A must merge first; nobody edits `js/cook/*` or `css/cook.css`; each mode has its own css and test port | **Adopted:** phases 0–2 read Cook's modules and mechanics unchanged; `css/clinic.css`; `test_clinic.py` on its own port |
| Build order by what is a real Kutchi test today: the clinic has **no** real decision word yet | **Accepted as true.** Phases 1–2 need no words (pure logic, greybox, bots) and every leak report flags placeholder rows "not yet a Kutchi test"; the first family round that makes level 1 real is the six *check the {part}* calls, the six *my {part} hurts* lines and hot/cold, all already in Section G |
| Find it: a number beside a row may be the target, not the tally | **Checked:** clinic ladder rows never show a number; the wrap and drop counts show a digit only while the number word is at stage 1–2 (6.2) |

### R3.6 Words needed, in priority order

The first set's Kutchi. **QfM** = already in the Questions for Mum doc (Section G unless said); **new** = not asked yet, to go in a Round 3 supplement (that doc isn't edited here).

| Priority | Words and frames | For | QfM |
|---|---|---|---|
| 1 | *Check the {part}* for the six big parts; the six big parts themselves | The check-up, level 1 | G108, G42–G47 |
| 1 | *Let's check everything · Now the {part} · The {part} again · The other one · Nothing wrong there · That's it!* | The check-up's chaining words | G109, G113 |
| 1 | *My {part} hurts* for the six big parts | The named ailment; S1 and S2's answers | G41 (asked with head, tummy, hand, knee; **arm, leg, foot** are new) |
| 1 | Care nouns: plaster, bandage, cool cloth, blanket, ice, hot-water bottle; *Muke {x} khape* exists | The trolley, level 1 | G73–G80 |
| 1 | hot, cold; *just right · too hot · still cold · How do you feel?* | Just right (level 2) and the thermometer's reading | Round 1 Q11; G69–G71, G83 |
| 1 | Short answers: *The knee. · This one. · yes · no* | S1's fallback pills, "?" and V0 | G98, A8 |
| 2 | *A bandage, round twice · The green bandage · The red one*; colours | The bandage, level 2 | G114, G115, E60–E71 |
| 2 | The check kit: *Listen to the chest · Look in the ear · Open your mouth, say aah · Take the temperature · He's hot · She's fine*; stethoscope, torch, thermometer, dropper | Level 2 check-ups | G110, G111, G119 |
| 2 | The face six and the neighbours: eye, ear, nose, mouth, tooth, throat; elbow, knee, finger, toe, shoulder, neck, back, chest | Levels 2–3 | G48–G61 |
| 2 | *I don't feel well · I don't know why* | The mystery | G112 |
| 2 | The speaking prompts: *What's wrong with {her}?* (S3) · *Where?* / *Where shall I check?* (S2; G81 *Where does it hurt?* can serve) · *What's this? / What have you brought?* (S4) · *Say it again?* | S2–S4 | **new** (G81 covers S2's) |
| 2 | The doctor's lines: *You first · Will you help me? · Let me see · Bring me the blanket · All better! · Well done, my helper*; what the children call him | Every visit; the hand-over check reuses *Let me see* | G99–G104, E102 |
| 2 | The hand-over check: the doctor naming an item, a part and a count in one breath (*The bandage. The knee. Twice.*) | `handover` | **new** as a frame (the nouns and counts exist; ask whether he'd chain them as three words or one sentence) |
| 3 | **Sides in the patient's voice:** *My left knee hurts · My right eye · Not that one, my other knee*; and *my left* / *my right* on their own | Level 3 (R3.2); S1 at level 2 | **new** (G118 has the doctor's *your left*; A5 decides left/right vs this side; G109 has *the other one*) |
| 3 | *Two drops* on its own (the game splits G116 into the patient's *my left eye* and the doctor's *two drops*) | Drops, level 3 | G116 (record as asked, plus the short form: **new**) |
| 3 | *Bring me the green bottle · Two of the small ones · The one on the top shelf* | The dispensary, phase 3 | G117 |
| 3 | *Who's next? · {name}, come · It's not my turn · That tickles!* | Who's next, the recasts | G85–G88 |
| 3 | *or*; *Is it your knee, or your hand?* | The "?" rung, V0's fallback | G94, G96 |
| Later | Animal parts (paw, tail, wing, beak) and possessives; *I fell · I bumped my {part}*; tired, better, happy, sad | Vet, Arc 4, feelings | G27–G40 partly, C50–C60; G62–G66; the past tense was removed from Round 3 |

### R3.7 Later ideas (not in the first set)

- **V2b, the patient's clue** (Zafar's decision 5): at level 4 the patient says *[EN: it's somewhere on my face]* and the child chooses which parts to check. Try it after level 4 exists; it edges towards *Who did it?*'s deduce verb, so it should be agreed with that mode first.
- **The pill organiser** → Tidy up's, for the days of the week (Zafar's decision 3).
- T5 the doctor's syrup as `pour + count + stir → handover`; T10 the reflex hammer; T15 cream; T14 the sling and the swivel stool; `echo`.

### R3.8 What changed below

| Section | Change |
|---|---|
| R2.1, R2.2, R2.3 | The V4 row tells the doctor by **saying it** (S3) with pills as the fallback; level 3's three slots now come in two voices (the patient's *my left eye*, the doctor's *two drops*) |
| R2.5 | T4: decision 3 closed (dropped; Tidy up may take it). T5 and T6: end in `handover`; the doctor checks and gives. T11: the side from the patient's line |
| R2.6 | Step 2 rewritten: the patient says *my left*; the doctor never names a side (R3.2) |
| R2.8 decisions | All five answered (R3.1) |
| 1 Borders, 4 First set, 6.6, 7.1, 7.4, 8.1, 8.4 | Fetching the medicine ends in the hand-over; the first set gains the speaking moments and `tell`; the voice star; the safety line; sides resolved; the mechanics file list |
| 12 Build brief | The phases are now R3.9; 12.2's task details stand where R3.9 points at them, with the medicine and speaking patches noted there |

### R3.9 Build brief (phased; own files first; shared pieces listed)

**Files the clinic owns** (and the only files phases 0–2 touch): `clinic.html`, `js/clinic/**` (`flow.js`, `visit.js`, `body.js`, `patient.js`, `queue.js`, `mechanics/*.js` as in R3.3, `stations/visit.js`, `stations/dispensary.js`, `stubs/{speech,which,overlay}.js`), `css/clinic.css`, `data/clinic.json`, `data/patients/*.json`, `data/scenes/clinic.json` (a sidecar; no shared scene file is edited), `build/test_clinic.py` (its own port), `build/leak_clinic.mjs` (Node, no browser: the generator and bots), `build/check_hotspots.py`, `assets/clinic/`. It **reads** `js/cook/{core,lang,ui,order,zone,recipes}.js` and Cook's `pour, stir, count, fetch, passme, knead` and never edits them (Wave 5A's frozen API).

| Phase | What's playable | Own files only? | Acceptance |
|---|---|---|---|
| **0 Prerequisites** (no code) | — | — | Section G answered (the priority-1 rows of R3.6 make level 1 real); the Round 3 supplement (R3.6's **new** rows) sent; doctor photos in `sources/private/`; Revision 1's decisions 1, 4, 5 and question 8 answered (Revision 2's five are done) |
| **1 Pure logic, lab, bots, greybox** | `visit.js` (the generator: V0–V3 as data, with `days.mix`), `check`, `where`, `care`, `stick`, `wrap` (turns, colour, the figure-of-eight), `lift`, `tuck`, `drops`, `ask`, `handover` (the end-of-treatment check), `tell` on the **stub recogniser** (the lab's "say" dropdown: right word, wrong word, nothing, mumble), `you` with S1, S2 on V3, a grey silhouette patient with `mirror: true`, the hotspot editor; the clinic lab runs any mechanic × level 1–3 alone or a whole visit of each type | **Yes** | Fair bot 100% ear stars; every leak strategy (random, salience, frequency, slot memory, repeat, duration, wait, visual cue, sweep, leftovers, second option, echo, **mumble**) under 10% over 500 visits per type per level, placeholder rows flagged; `check_hotspots.py` passes (level-1 parts ≥ 2 cm on iPad; the phone opens zoomed); the voice bot exercises accept, wrong hearing, null → *say it again?* → pills, and the parent toggle; tap-cover at six sizes; no console errors; screenshots reviewed |
| **2 The clinic morning** | `call` and `queue.js`, `warm` (Just right), the morning mix, One patient, You're the patient, the open clinic with "Close the clinic", the intro card, 3 s quiet, the sidebar with "?", `passme`, stars as they happen (ear / voice / plaster / tick or bolt) and the receipt, the word review, Relaxed and Busy with comfort rings; T11 drops and sides at level 3 (R3.2 step B and C) | **Yes** (star sets held in `data/clinic.json` until the shared data lands) | `test_clinic.py` plays a morning, a patient and the open clinic at six sizes with every recast path; leak bot under 10% on `warm`, `call` and `drops` (sides reported separately); a level-1 morning under 5 minutes, a check-up under 90 s, a mystery under 120 s, V0 under 60 s |
| **3 Integration and story** | Swap the stubs for `js/shared/speech.js`, the which-one module, overlay-at-anchor sprites, `rel.js`; plug into the shell (one app, one save); Arc 3 Ch4 (the home beats, the puddle, V0 first, **S3 bring someone in**, Ali's knee, the hen, the wet neighbour, the hand-over of Nani's bottle to Nana at home, the hand-off to Cook), the Monsoon side errand "bring Ali in", the dispensary (`fetch → handover`, S4), the vet, silly finds, the map place, the album, the shelf, the shop | No: the shell, `data/relations.json` (the top shelf), `data/scenes/courtyard.json` (Arc 5 later) | Ch4 end to end in the harness; the vet passes the bot with 6+ parts per animal; the shop has no knob that touches listening or speaking; **Zafar plays it with a child** |
| **4 Art and more** | The doctor's sheet and poses (his open hand for `handover` is A3, existing), seated patients, expressions, items, two hand poses; then T5 (`pour + count + stir → handover`), T10, T15, Doctor Nani flipped, the swivel stool, `echo`, V2b if wanted | — | Visual QA per screenshot; family recordings replace placeholders file for file; the leak report shows real Kutchi rows passing |

**Shared pieces the clinic needs from the foundation agent** (assumed to arrive; not designed here):

| Piece | Used for | Needed by | Until then |
|---|---|---|---|
| `js/shared/speech.js`: `listen({choices, timeoutMs}) → {choice, confidence} \| null` | S1–S4 via `tell` | Phase 3 | `stubs/speech.js` with the same signature, driven by the lab and the voice bot |
| The "which one?" attribute-and-decoy module (balanced decoys, blind odds) | `care` colours, the dispensary shelf, `passme` groups | Phase 3 | `stubs/which.js`: the look-alike groups from `data/clinic.json` |
| Overlay-at-anchor sprites | Head-layer expressions; care items on `spots` | Phase 3 (art in 4) | Code-drawn greybox |
| Star sets and ear/voice rules as data (`star_sets.clinic`, `earPass`, `minTested`, `voicePass`, taught-rows exclusion) | The four stars | Phase 2 | The same keys inside `data/clinic.json`, moved out at integration |
| The shell ("one app, one save"), the hub daily's 60-second entry | Story, wallet, the map place | Phase 3 | `clinic.html` on Cook's save, as Find it does |
| `data/relations.json` + `js/shared/rel.js` + scene `spots` | *The one on the top shelf*; the Arc 5 courtyard | Phase 3 (shelf), later (courtyard) | The shelf without positions (colour, count, size only) |

**Blind-bot estimates for level 1 of the first set** (principle 5): the check-up, 5 one-word calls from 6 parts, under 0.1%; the named ailment, part (1/6) × item (1/5), 3%; the bandage alone (a three-patient round: item 1/5 each) under 1%; Just right (from level 2: direction 1/2 × steps 1/2 a patient, three patients) about 1.6%; You're the patient: ear rows ungraded, voice rows 1/7 a row and two rows a visit, under 2% for the voice star by mumbling; bring someone in: 1/6 by voice or 1/3 by pills, then the check rows and the treatment multiply it down to under 1%.

---

## Revision 2, 25 Sept 2026: visit types and treatment mini-games

*(Superseded by Revision 3 above where they conflict: the five decisions are answered in R3.1, sides come from the patient's mouth (R3.2), fetching and mixing end in the doctor's hand-over check, and the speaking moments are in R3.4.)*

**Why this revision.** Zafar's reaction to Revision 1 (below), tidied: *"Being injured is the tutorial; afterwards other people come in, or you take someone to the doctor and help with them. I'm not sure about 'is it this or that'. Maybe the doctor asks you to check: the head, the knee, the arm. A patient says 'I don't feel good, but I don't know why' and the doctor asks you to check different things until you find it; then he asks you to get medicine (one, two, the green bottle) and fix them. And a mode where you do the actual fixing: suturing in a called order, bandages, a pill organiser, mixing the medicine, syringes, left and right, a full check-up. Different mini-games that reinforce the body words. I need a better and deeper think."* This section is that think. **It supersedes Revision 1 and the sections below wherever they conflict**; R2.9 lists what was patched (the first set, the word list, the build brief) and what stands.

### R2.1 The verdict in short

- **The backbone is visit types, not the doctor's question.** Four kinds of visit (check-up, mystery, named ailment, bring someone in) plus the tutorial (you're the patient). They run on one engine: *the doctor names a part; you act on it.* The level ladder is what the child has to hold in their head per instruction (one word → a sentence → three slots → sides), not who answers a quiz.
- **"Is it this, or that?" is demoted.** It stops being the scaffold and level structure. It survives in exactly two places where it's the only honest way to ask a child who can't speak: the "?" help rung (ask the doctor, costs the tick) and "you're the patient" (R2.4). Zafar's instinct was right; the case for the small version is in R2.4.
- **The check-up is the mode's engine room.** *[EN: Check the head. Now the knee. The knee again.]* is Total Physical Response in a story: one body word per row, five or six rows a patient, a toy instrument for every check, and a guess rate that falls to nothing without elimination. It's the most Kutchi per minute in the game, and the most fun per row once the instruments react.
- **Treatment is a library, scored like the mechanic library.** First set: the bandage (turns, colour, side; a figure-of-eight at level 3), the check kit (stethoscope, torch, thermometer), the plaster, the cold and hot packs, the blankets; drops at level 3 as the left/right mini-game. Stitches on a person, a needle and the pill organiser are out of the clinic (R2.5 says why, directly). Mixing the medicine is Cook's station run in the doctor's dispensary, later, as data.
- **Left and right is a real thread**, taught on the child's own body first (the lap view, level 2), then on a patient facing them (level 3, age 7+), never in a story-required round (R2.6).

### R2.2 The visit types (the backbone)

One engine: a visit is a list of **calls**, each `{who speaks, verb, part, side?, instrument?}`, followed by a **treatment** with slots `{item, part, side?, count?, colour?}`. The visit types differ in who speaks, whether there's something to find, and what comes first.

| Visit type | What happens (60–120 s) | Who speaks the Kutchi | What the Kutchi decides | Blind guess per row (level 1 → 3) | Where it lives |
|---|---|---|---|---|---|
| **V0 You're the patient** (the tutorial) | The lap view: a scuffed knee or the sniffles. The doctor leans in, asks, presses, treats you; you choose the plaster design | The doctor, to you | Two-way answers only (*[EN: your knee, or your hand?]*, yes/no) | 50% a row: **teaching, never graded** | Arc 3 Ch4's first minute; a free-play route; the first minute of any new player's first morning |
| **V1 The check-up** | The doctor: *[EN: Let's check everything. The head.]* You put the instrument on the head; something happens (a torch beam, a heartbeat, a temperature the doctor reads out). *[EN: Now the knee. The knee again. The other knee.]* 4–6 calls; usually all fine (*[EN: Nothing wrong there!]*), sometimes one thing found → a treatment | The doctor, to you | **Which part** per call; from level 2 **which instrument** too (*[EN: listen to the chest / look in the ear / the temperature]*); from level 3 **which side** | 1/6 → 1/12 × 1/3 instruments × 1/2 sides; a 5-call visit is under 0.1% at level 1 | Every morning; Arc 3 Ch4 (the neighbour); Arc 5 the village (everyone gets checked) |
| **V2 The mystery** (*I don't feel well, I don't know why*) | The patient says only that. The doctor: *[EN: Let's see. Check the tummy.]* Nothing. *[EN: The ear.]* Nothing. *[EN: The throat.]* A find (a red throat, a fast heartbeat, "hot!", a seed): *[EN: That's it!]* Then the treatment | The patient (one line), then the doctor | Which part to check per call, in the order he says; the find is shown only when the named part is the sore one. Checking a part he didn't name is a miss | As V1; 3–5 calls | Level 2+; Arc 3 Ch4 (the hen: "she's off her food"); silly cases (the seed in the ear) |
| **V3 The named ailment** | The patient: *[EN: My knee hurts.]* You find the place (M1, no question from the doctor). The doctor gives the treatment instruction: *[EN: A bandage, round twice.]* You do it. Just right if it's a feeling | The patient, then the doctor | Which part (and side); then the treatment slots | 1/6 × 1/5 ≈ 3% → under 0.5% with two treatment slots | Every morning; Arc 3 Ch4 (Ali's knee); Arc 4 (with *what happened*) |
| **V4 Bring someone in** | At home (or the lane, the shed) you *see* who's hurt and where: Nani holds her head, the hen limps. Nobody says it. You walk them (or their message) to the clinic and **tell the doctor by saying it** (R3.4, S3; audio pills, picture → word, are the fallback). He checks what you said (a V1 call or two), then you treat them together | You (production), then the doctor | The words you choose; then the visit as V1/V3 | Pills from one look-alike group of 3: 33% a row → the check rows and the treatment multiply it down | **The story shape** (Ch4: Nani's message; Monsoon side errand: bring Ali in; Ch3→4: the hen); free play "Bring them in" from level 2 |

**Why these four and not more.** The check-up and the mystery are one engine with a `find` flag; the named ailment is the same engine with the patient speaking first; bring-them-in is the named ailment with the first line moved to the player. That's four feels for one build. What a **clinic morning** is: 3–4 visits, mixed by type the way Cook mixes recipes, drawn from the player's weakest words.

**Rules that keep the check-up honest** (the Sceptic's list; new leak-bot strategies **"sweep"** and **"leftovers"**):
1. **Only the named part counts.** Every part is tappable, but a tap on a part the doctor didn't name is a miss for that row (the patient giggles, the doctor: *[EN: No, the knee]*). So sweeping the whole body finds nothing worth having.
2. **No elimination.** A check-up calls a random 4–6 from the level's parts, with repeats allowed (*the knee again*) and the same part possible on every row, so the last rows are never "whatever's left".
3. **The find is quiet until it's found.** In V2 the sore part has no mark, no rubbing, no gaze; the reveal (a swirl, a sound, the doctor's reading) plays only after the named part is checked and it's that one. Its position in the call order is random from the second call on.
4. **The instrument is a second slot, not a hint.** Every instrument works on several parts (stethoscope: chest, back, tummy; torch: ear, nose, mouth, eye; strip: forehead, and from level 2 the hand; hammer: knee, elbow), so "it's the torch, so it's a face part" narrows nothing at level 2 where the face is already in play.
5. **The doctor never looks or points.** Gaze on the patient, hands folded, the same as Revision 1's rule.
6. **Hesitating gets a replay, never a twinkle**, except at word stage 1 (taught, not tested).

### R2.3 The progression: what a child has to hold

Levels are data and follow the player's word stages, as before. What changes is what each level *is*:

| Level | Name | What the doctor's instruction holds | Visit types | Parts in play | Treatment slots | Who speaks |
|---|---|---|---|---|---|---|
| **1** | *First day* | **One word**: *[EN: The head.]* (the check-up); *[EN: A plaster.]* (the treatment) | V0, V1 (all fine), V3 | 6 big parts | 1 (which item) | The doctor for everything; the patient's line in V3 is one sentence |
| **2** | *The kit* | **A verb and a part**: *[EN: Listen to the chest.]* *[EN: Wrap it round twice.]* | V1 with finds, V2, V3, V4 in free play | + the face close-up | 2 (item + count, or item + colour) | The patient says more (feelings); Just right |
| **3** | *Left and right* | **Three slots, in two voices**: the patient *[EN: My left eye hurts]*, the doctor *[EN: Two drops.]* (R3.2); *[EN: The green bandage, round the foot, round the ankle.]* | All; Busy with two benches | + neighbours (elbow/knee, finger/toe) and **sides** | 3 (item + count + side/colour) | The patient can say *not that one, the other one* |
| **4** (Arc 4+) | *Your own patients* | Nobody scaffolds: the patient says everything, including what happened; the doctor's away on a house call for the last patient of the morning | All | All | 3, plus order (*first the cloth, then the bandage*) | The patient; past tense |

A child feels the ladder as: *he tells me one thing → he tells me how → he tells me which side → I do it without him.* That's the shape of a real helper's training, and it's the shape of TPR (single commands → command chains).

### R2.4 What's left of "Is it this, or that?"

Zafar is unconvinced, and on reflection he's right that it's the wrong *ladder*: it made level 1 a 50/50, it made the doctor a quizmaster asking questions he knows the answer to, and the "three hearings" it bought (complaint, question, answer) the check-up buys more naturally (*the knee* in the patient's line, the doctor's call, the patient's *ahh, the knee*). The rules in R4 below stand only for the two uses that remain:

| Use | Why it stays | Cost |
|---|---|---|
| **The "?" rung** (ask the doctor) | A child who's stuck on a check or a treatment slot taps "?"; the doctor narrows to two: *[EN: The knee, or the foot?]* It's what a kind doctor would say to a helper, and it's a hint that halves the field rather than showing the answer | The tick (Relaxed) or the comfort ring (Busy); the combo breaks; never offered when two options are all that's left |
| **You're the patient** | The child can't speak, so a two-way question is the only way the doctor can "ask" them. Treated as teaching, never graded | None |

Everything else about it in R4 (the level table, the far/near pools as a progression, "the doctor asks, you answer" as level 2, the *or*-question as the call in Who's next?) is **withdrawn**. The family word list keeps *or* and the two question forms that survive (G94, G96) and retires the rest (R2.9).

### R2.5 The treatment library

Scored 1–5 like section 3. **Age** is fit for a 5-year-old (5 = fine at 5). **Build** is 5 = cheap (reuses Cook or existing clinic code and art), 1 = expensive. The **Kutchi** column names the slots the instruction fills; more slots means a lower guess rate and more words per minute.

| # | Treatment | How it plays | Kutchi slots | Fun | Kutchi | Age | Distinct | Build | Decision |
|---|---|---|---|---|---|---|---|---|---|
| **T1** | **Plaster** | Peel, drag to the spot; choose the design when it's free | part, side; *the {colour} one* at level 2 | 3 | 4 | 5 | 3 | **5** (M3 stick) | **First set** |
| **T2** | **Bandage** | Wrap round the limb with Stir's circular track: *[EN: round twice]*; three rolls on the trolley in different colours; at level 3 a **figure-of-eight**, called as a path across parts: *[EN: round the foot, round the ankle, round the foot]* (real first aid, and it's Zafar's "called sequence" with body words in the slots instead of letters) | part, side, **count** (1–4 turns; never ends by itself, press Done), **colour**, at level 3 an **order of parts** | 4 | **5** | 5 | 4 | 4 (track + count exist; the figure-of-eight is a track between two hotspots) | **First set** |
| **T3** | Stitches, as described (dots numbered on one side, lettered on the other, called pairs) | A lacing card over a cut | numbers, letters | 3 | 2 | 2 | 2 | 3 | **Rejected for the clinic.** (a) Letters teach the Latin alphabet, not Kutchi: the family's Kutchi is spoken, or written in Gujarati script. (b) With the pairs spoken in Kutchi it teaches numbers and colours, which Cook and Tidy up already drill, and no body word. (c) Stitches on a person, however cartoonish, are a procedure: the safety rule and the Teddy Bear Hospital evidence both say no. (d) Lacing a torn teddy would be fine at 5, but mending is Big Ma's (Dress up). **The good idea inside it, a spoken sequence you follow with a thread, is kept as T2's figure-of-eight** |
| **T4** | Pill organiser (Nana's weekly box) | *[EN: one from this one, two orange, three green]* into the day cells | count, colour, day | 3 | 4 | 2 | 1 | 4 | **Rejected for the clinic.** It's Tidy up's *Repack the sweet box* (counts into cells by colour) with pills for sweets: a duplicate. And a 5-year-old sorting bright pills into a box is the picture poison-prevention advice warns about; the safety rule says the player never handles medicine. Days of the week are also 7 new words nobody else needs yet. **Dropped for now (Zafar, R3.1)**; Tidy up is considering it as an older-children mini-game for the days of the week |
| **T5** | Mix the medicine (the doctor's syrup) | *[EN: two spoons of the red, one of honey, stir three times]* | count, colour, order, ingredient | 3 | 4 | 4 | 1 | **5** (it *is* Cook's pour, spoon-count and stir) | **Later, as data:** Cook's `pour`, `count` and `stir` run in the doctor's dispensary view, after the first set, ending in `handover`: the child hands the cup to the doctor, who checks it aloud and gives it (R3.1). Nani's own remedy stays Cook's (Ch5) |
| **T6** | Fetch from the dispensary | The doctor: *[EN: Bring me the green bottle. Two of the small ones. The one on the top shelf.]* A small shelf of look-alikes (Cook's `fetch`); you hand it to him (`handover`) and **he names it, the count and the part, and he gives it** | colour, count, position, size | 3 | **5** | 4 | 2 (Find it's verb, in miniature; M8 grown up) | 4 | **Phase 3** with M8. The child never gives medicine (Zafar, R3.1); S4 "what have you brought?" is its speaking moment |
| **T7** | **Thermometer** (forehead strip) | Press the strip; the doctor reads it aloud: *[EN: Hot!]* / *[EN: Just right]*; the reading decides the care (cool cloth or blanket) | the reading (hot/cold) → care | 3 | 4 | 5 | 3 | 5 (`S.ring`) | **First set** (the check kit) |
| **T8** | **Stethoscope** | *[EN: Listen to the chest / the back / the tummy.]* Place it; a heartbeat, breathing, or a tummy gurgle (the doctor laughs) | part, later side | **5** | 4 | 5 | 4 | 4 (a sprite and three sounds) | **First set** (the check kit) |
| **T9** | **Torch** | *[EN: Look in the ear / the nose / the mouth. Say aah.]* Finds: a seed, a bead, a red throat | part, side | 4 | 4 | 5 | 3 | 4 (M6's torch) | **First set** (the check kit) |
| **T10** | Reflex hammer | *[EN: Tap the left knee.]* The leg kicks; everyone laughs | side (knee or elbow) | 4 | 3 | 5 | 3 | 3 (a kick frame per patient) | After the first set: a laugh row for check-ups |
| **T11** | **Drops** (eye, ear) | The patient: *[EN: My left eye hurts.]* The doctor: *[EN: Two drops.]* Squeeze the dropper once per drop (Cook's spoon-count tap); never ends by itself | **part, side, count**: three slots across two voices (R3.2) | 3 | **5** | 4 | 4 | 4 | **Level 3**: the left/right mini-game (R2.6) |
| **T12** | **Cold pack, cool cloth, hot-water bottle** | Lay it on the part; lift on green | hot/cold + part | 3 | 4 | 5 | 3 | **5** (exists) | **First set** |
| **T13** | **Blankets and Just right** | As M4: add, remove, Done | feeling words | **5** | **5** | 5 | 5 | **5** (exists) | **First set** |
| **T14** | Sling | *[EN: The left arm]*; tie it | side | 3 | 3 | 5 | 3 | 2 (a sling per pose) | Later, if the art budget allows |
| **T15** | Cream | *[EN: Rub it on the elbow, three times]* (knead press) | part, side, count | 2 | 4 | 5 | 2 | 5 | Phase 2 variety, cheap |
| **T16** | Syringe, needle | — | — | — | — | **1** | — | — | **Rejected** (fear; the safety rule). A dropper (T11) and a spoon (T5) do the counting job |
| **T17** | Teddy repair (lacing a toy) | Layla's teddy with a torn arm | teddy's parts | 4 | 3 | 5 | 2 | 3 | Dress up's (mending). Not here |

**The first set of treatments: T13, T2, T8, T9, T7, T1, T12** (in build order), then **T11** at level 3. Why: together they cover every slot type the ladder needs (item, part, side, count, colour, hot/cold, a called path) with no new engine, they're all things a family does at home or sees at a real clinic, and they give the check-up its three toy instruments. **Held back:** T10, T15 (cheap variety once the base is stable), T6 and T5 (phase 3, with the dispensary view), T14 (art). **Rejected:** T3, T4, T16, T17.

### R2.6 Left and right: a thread, not a trap

- **The evidence** (Rigal 1994 and follow-ups, section 2.2): children use left and right on their own body reliably from about 6–7, and on a person facing them later still (about 8–10), because that needs a mental rotation. A 5-year-old asked for "his left knee" on a patient facing her is guessing, and guessing feels like failing.
- **So the thread runs in three steps, on three levels:**
  1. **Own body, level 2:** in **you're the patient** (the lap view is first person, so your left is on the left of the screen) the doctor asks *[EN: Does your left knee hurt?]* and presses; and **Doctor Nani** in Grandparent mode asks *[EN: Show me your left hand]* in the room. This is where the words are learned.
  2. **A patient facing you, level 3 (age 7+):** *(patched by R3.2)* the side is always **the patient's own, in the patient's voice**: *[EN: My left knee hurts.]* *[EN: My right eye.]* The doctor never names a side; his calls and treatment lines refer back (*[EN: That knee. Two drops.]*). Whether the family says *left/right* at all, or *this side/that side*, is Questions for Mum A5; if it's the latter, the thread becomes *this side/the other side* and the mirrored problem goes away.
  3. **The twist, level 3+:** *[EN: Not that one, the other one.]*
- **Fun or frustrating?** At 5, frustrating: so it's never in a level-1 or level-2 clinic row, never in a story-required round, and a side miss at level 3 costs the ear star only after the recast (*[EN: The other knee]*) has been ignored once. At 8, it's a real puzzle and Zayn's favourite kind: a rotation you get better at.
- **A cheap aid that never listens for you:** the **swivel stool** upgrade lets the player spin the patient to face away (a back view per patient: hold until the art budget allows), so their left is your left. It removes the rotation, not the word.
- The `mirror: true` hotspot rule and the "whose side" playtest item in 8.1 stand.

### R2.7 Keeping the doctor warm

- He's the calm centre: he never rushes, never tuts, and his laugh is the reward sound. The comedy is the patients' (the tummy gurgle, the knee that kicks, Nana under four blankets), never his.
- His lines to the helper are praise and instruction only: *[EN: Let's check everything. Good. Now the knee. That's it! Well done, my helper.]* When the child is wrong, the *patient* giggles and *he* just repeats the call.
- Nothing scary: no finds that look like illness (a red throat is a soft pink glow; "hot" is a word he says). Every mystery is solved, every patient leaves smiling, and every feeling is resolved in the same visit (a sad patient gets Big Ma's song or a blanket and a joke).
- The likeness rules in R8 stand.

### R2.8 Personas, the Sceptic, the Builder; verdict

| Persona | On Revision 2 |
|---|---|
| **Layla, 5** | The check-up is her game: "now the tummy!" with the stethoscope gurgle makes her do it again. The mystery is a small thrill ("where is it?"). Never sees a side. Asks for the teddy: told the doctor fixes teddies too, but at Big Ma's |
| **Zayn, 8** | Level 3's sides and the figure-of-eight are the mastery he wanted; the check-up at Busy pace with two benches is a record to chase. The old 50/50 ladder that bored him is gone |
| **Maryam, 11** | Bandage colours and plaster designs; wants to lay out the dispensary shelf (décor slots) |
| **Zafar, 38** | Counts 10–14 Kutchi lines per check-up (calls, instrument verbs, the doctor's *good/now/again/the other one*, the patient's reactions): the densest listening in the game. Worried the check-up is "just a quiz": the instruments answer that, and V2's find gives it a point |
| **Farah, 34** | A check-up is 60–90 s; a mystery 90–120 s |
| **Nani, 68** | "That's what he really does": the check-up is how a real visit goes. Doctor Nani gets *show me your left hand* |
| **The Sceptic** | Tries: (1) tapping every part during a check (each unnamed tap is a miss); (2) elimination in the check-up (random subsets, repeats); (3) waiting for the find to show (nothing shows until the named part is checked); (4) "the find is always last, so the last call is the sore part" (true, but it tells her nothing about *which* part she must tap now); (5) the bandage count ending itself (never; Done); (6) one roll on the trolley (three, colours shuffled); (7) 50/50 on sides (one slot of three at level 3; the ear star needs all three); (8) the torch means a face part (the face is in play from level 2 anyway, and the torch works on the eye too); (9) "?" for free (costs the tick). **She wins level-1 check-ups under 0.1% of the time and nothing from level 2** |
| **The Builder** | Cheap: the check-up is M1 with an `instrument` slot and N rows; the bandage count is Stir's track plus Cook's count; drops are the count tap with a side; the stethoscope and torch are a sprite and sounds; the figure-of-eight is a track between two hotspots. Costs: a kick frame per patient (T10, later), the sling and the back view (held), the dispensary view (phase 3). **No new art for the first set beyond Revision 1's list** except three instrument sprites |

**Verdict: Go with changes**, the same prerequisites as before (the family's words, the doctor's sheet, the shared engine), and the mode is now bigger in play and no bigger in build: one engine (calls + a treatment with slots), four visit types, seven treatments.

**Decisions for Zafar (all five answered; see R3.1. The old decisions 1–6 in R9 stand except 6, which is moot):**
1. **The check-up as level 1's main visit.** It's TPR and it's dense; but it's the doctor talking to the helper, not the patient talking. Happy with that balance (about half of level-1 visits are check-ups, half named ailments)?
2. **Does the child ever give medicine?** Revision 1 said never (the doctor gives it; the child fetches). Your note says "get medicine... and fix them". Recommendation: the child fetches by colour, count and shelf (T6) and hands it over; the doctor gives it; the child's "fixing" is everything else. Overrule if you want a spoon of syrup as a counted, pretend step.
3. **The pill organiser:** drop it, or give it to Tidy up as a board for 8+?
4. **Sides:** the patient's own left (the doctor says *his left*), or the viewer's? A5 decides whether the words exist at all.
5. **Who answers "I don't know why"?** In V2 the doctor directs every check. An alternative for level 4: the patient gives a clue (*[EN: it's somewhere on my face]*) and the child chooses which parts to check. That edges towards *Who did it?*'s verb (deduce), so it's not in this design; say if you want it.

### R2.9 What changed below

| Section | Change |
|---|---|
| Revision 1 (R1–R9) | Stands for the centre (the doctor, his clinic, you're the patient as the opening), the treat loop, the likeness rules and the art. **R4's ladder is withdrawn** (R2.4); R3's loop steps 3 and 5 no longer ask the *or*-question except via "?" |
| 3 Mechanic library | **M13 demoted** to the "?" rung and V0; **M15 The check-up** (V1/V2: calls with an instrument slot and a find flag) added; M6 Have a look is folded into M15's check kit; M3 Gentle hands gains the treatment slots (count, colour, side, a called path) |
| 4 First set | Now: the visit engine (calls + treatment slots) → M15 check-up with the check kit (T8, T9, T7) → M1 + M3 (T1, T2, T12) → M4 (T13) → M14 you're the patient → M7 Who's next; M11 bring-them-in with the story; T11 drops at level 3 |
| 6.1, 6.4, 6.7 | The doctor's calls (*check, now, again, the other one, listen, look, the temperature, nothing wrong, that's it*), the treatment lines (*round twice, the green one, two drops in the left eye*), *I don't feel well, I don't know why*; the level table rewritten as R2.3; the family list updated and the *or*-forms cut to two |
| 12 Build brief | Phase 1 builds the visit engine and the check-up first; tasks 2–4 rewritten |
| Questions for Mum, Section G | G95, G97, G105–G107 retired; G108–G119 added (the calls, the check kit, the treatment lines, the mystery, left/right on the child) |

---

## Revision, 25 Sept 2026: centred on the doctor's clinic

*(Revision 1. Superseded by Revision 2 above where they conflict; in particular R4's level ladder is withdrawn, and "Is it this, or that?" survives only as the "?" rung and in "you're the patient".)*

**Why this revision.** Zafar's feedback on the design below, in his words (roughly): *"The clinic game needs work. It should centre on the actual doctor, Hannah's real-life granddad, and on his clinic. For the first game, maybe you go yourself because you're sick, or you just go and help at the clinic. Different people come in and describe their pain, and sometimes the doctor asks them 'is it this or is it that?'. Then eventually you have to listen to the patient yourself and get the right thing to fix what they said was wrong. I think that's a more fun mode."* This section is the answer: what's adopted, what's kept from the design below, and where I disagree and why. **It supersedes anything below that contradicts it**; sections 1, 3–6, 8, 9, 11 and 12 have been patched to match, and the rest stands.

### R1. The verdict on the idea, in short

- **Adopt the centre.** It's **the doctor's clinic**, not Nani's. He is the host, the voice of the mode and its warmth; Nani is its first patient in the story (Arc 3) and the owner of the animals in the vet corner. The mode id stays `clinic`; the display name becomes whatever the children call him (Questions for Mum, E102), with **"The clinic"** as the working title. The Cast doc lists him as Zafar's wife's granddad; his reference photos stay private.
- **Adopt "is it this or that?" as the mode's scaffold, not a decoration.** It replaces the abstract "warmer" hint (the doctor pointing at half a body) with a line a real doctor says, and it gives the mode a progression a 5-year-old can feel: *he asks and the patient answers* → *he asks and you answer* → *nobody asks; you listen*. Section R4 has the rules that stop it leaking.
- **Adopt "you're the patient" as the first minute** of the story round and as a one-minute free-play route, **not as the whole first game** (R5 says how it works with no speech recognition; R7 says why it can't be the core).
- **Keep the treat loop** the design below built (*Where does it hurt?* → the care trolley → gentle hands → *Just right* → *Who's next?*). Zafar's last sentence, "listen to the patient yourself and get the right thing to fix what they said was wrong", *is* that loop. His idea changes how the player gets there, and who the game is about; it doesn't change where the player ends up.

### R2. The new pitch

**The clinic.** Down the lane from Nani's house is the doctor's clinic: a bench by the door, a window with the rain on it, Kasuku on a perch (he comes along in the story and stays), and the doctor, bald, white-bearded, clear glasses, a checked blazer, and a laugh you can hear from the gate. He's the family's own doctor (Hannah's granddad), and the children are welcome there. **You're his helper.** Different people come in (Nana, Ma, Ali, the cousin, neighbours, and now and then a cat) and say what's wrong, in Kutchi. The doctor asks the questions a doctor asks (*[EN: Where does it hurt? Is it the knee, or the foot? Are you hot, or cold?]*), and **you do the doing**: find the place, fetch the right thing from the trolley, put it on gently, and check it's just right. At first the doctor asks and the patient answers, so you hear everything twice; then he asks and looks at you; then he's busy with the next patient and it's all yours. Nothing in the clinic can be done without understanding what the patient said. The doctor gives any medicine himself.

**Why it's more fun than the design below.** The design below had the doctor as a task-giver at the edge. Now the game's warmth comes from a real person the children know, the questions a child hears at a real clinic become the game's scaffold, and the child gets to be looked after before they look after anyone.

### R3. The core loop (one patient, 60–90 s; a clinic morning is 3–4 patients, about 4 minutes)

| Step | What happens | The Kutchi that decides it |
|---|---|---|
| 1 **Who's next?** (level 2+) | The doctor calls a name; you tap that person on the bench and greet them (respect language for elders) | Who |
| 2 **The complaint** | The intro card (one line per complaint, ••• or text by word stage) shrinks into the sidebar. The patient says it: *[EN: My knee hurts]*. **3 s of quiet** | Part (or feeling) |
| 3 **The doctor's question** (levels 1–2) | *[EN: Is it the knee, or the foot?]* Level 1: the patient answers, *[EN: The knee]*. Level 2: nobody answers; he looks at you | Which of two |
| 4 **Where does it hurt?** | You tap the part on the patient. Right: the soft sore swirl and *[EN: That's it]*. Wrong: a giggle, Kasuku's *Arre re!*, the line again | Part (and side, level 3) |
| 5 **The right thing** | The doctor: *[EN: A plaster, or a bandage?]* (level 1: the patient answers) or, from level 2, the patient says how they feel (*[EN: I'm cold]*). You pick from the trolley, which always holds every unlocked item, shuffled | Care, from the noun or the feeling |
| 6 **Gentle hands** | Peel and stick, wrap, lay the cool cloth and lift it on green, tuck the blanket | Hands (a count from level 2) |
| 7 **Just right** (level 2+) | The doctor: *[EN: Still cold, or just right?]* The patient: *[EN: Still cold]* → another blanket; *[EN: Too hot]* → one off; *[EN: Just right]* → Done | Add, remove or stop |
| 8 **Thank you** | *Aabhar aanjo!*, the doctor's big laugh, a sticker; at the end of the morning: stars, pocket money, the word review | — |

**One concrete round (level 1, Ali).** Ali sits on the examination bench, both hands in his lap. The card shows his face and one ••• line. Ali: *[EN: My knee hurts]*. Three seconds of quiet. The doctor, hands folded, looking at Ali: *[EN: Is it the knee, or the head?]* Ali: *[EN: The knee]*. You tap his knee: a pink swirl, *[EN: That's it!]* The doctor: *[EN: Plaster, or a blanket?]* Ali: *[EN: A plaster]*. The trolley slides up with five things in a new order; you tap the plaster tin, peel one, and drag it onto the swirl. The doctor laughs his big laugh; Ali: *Aabhar aanjo!*; a sticker of Ali's knee goes in the album. Kutchi heard: *knee* three times (once against *head*), *plaster* twice (once against *blanket*), plus *hurts*, *or*, *is it*, *that's it*, *thank you*. If you'd tapped his foot: Ali giggles (*[EN: That tickles!]*), Kasuku squawks *Arre re!*, and Ali says the line again; the ear star for that row is gone, nothing is shown, you try again.

### R4. "Is it this, or that?": the scaffold and its rules

**Why it's good.** The child hears the target word **three times** in one row (the complaint, the question, the answer) and once **against a wrong word**, which is how listening is taught in a classroom (minimal pairs, but in a story). The child also learns the word *or* (needed from the family, G94) by sheer frequency, and hears the doctor's question forms, which they'll hear at a real clinic one day. It models listening: watch the doctor listen, then listen like the doctor.

**The progression** (levels are data; the level number is the player's, per word stage, not a fixed door):

| Level | Name | What the doctor does | What you do | Bot guess rate per row |
|---|---|---|---|---|
| **1** | *The doctor asks, the patient answers* | Asks *X or Y?* after every complaint; the wrong option is **far** (knee vs head; hot vs a plaster); the patient answers | Act on the answer: tap the part, fetch the care | 1 in 2 (part) × 1 in 5 (care) ≈ **10%** per patient; level-1 rows are stage-1/2 words, which the design already treats as teaching |
| **2** | *The doctor asks, you answer* | Asks *X or Y?*; the wrong option is **near** (knee vs elbow, from the look-alike groups); nobody answers | Act; plus the feeling → care, and Just right | 1 in 2 × 2 valid cares of 7 × the Just right direction and count ≈ **3%** |
| **3** | *On your own* | Doesn't ask. A **"?" button = ask the doctor** gets the *X or Y?* question, and costs the tick (Relaxed) or the comfort ring (Busy) | Everything: sides, "not that one", Busy with two benches | as section 10's stop check (**under 1%**) |
| **4** (Arc 4+) | *What happened?* | Asks *[EN: Did you fall, or did you bump it?]* | + a past-tense row | — |

**Rules that stop it leaking** (the Sceptic's list; the leak bot gets a new **"second option"** and **"echo"** strategy for each):
1. The option order is random; the right answer is first exactly half the time.
2. The wrong option is drawn from the level's pool (far at level 1, a look-alike at level 2), never the previous patient's part and never a part already ruled out this visit.
3. **The answer is always given by acting** (tapping the body, the trolley or the blanket), never by tapping a pill that repeats the sound. Matching *knee* in the complaint to *knee* in the question is possible by ear alone, so the game never rewards that match; it rewards knowing where the knee is.
4. The doctor's gaze stays on the patient's face and his hands stay folded during the question; the sore swirl never shows before the right tap; the patient's answer is a neutral head-shot line, no pointing, no rubbing.
5. He asks only when at least two parts (or two cares) are still possible; a question about the last remaining option is never asked, so elimination earns nothing.
6. The question form is the same for parts, feelings and care, so it's one frame to learn and record: *[EN: Is it {X}, or {Y}?]* with the two slots filled from any word list.
7. From level 3, the question costs a star, so no one can halve the field for free.

**Honest weakness.** Two-way is 50%. At level 1 that's acceptable because (a) the ear star also needs the care right, (b) level 1 is where stage-1 and stage-2 words live, and the design already treats stage 1 as taught, not tested, and (c) the point of level 1 is the three hearings, not the test. Zafar decides whether level 1 counts for the ear star at all (R9, decision 6).

### R5. "You're the patient"

**How it works with no Kutchi speech recognition.** The child can't tell the doctor anything, so the hurt is **shown** to them and their answers are **choices between two heard words**, judged by what they can see:

1. **First person, looking down**: your own lap, hands, knees and feet (a new "lap view" image; hands from the existing set). A soft pink scuff on your knee (drawn in code; no blood). Or, for a cold, the camera judders with two sneezes and a tissue comes up in your hand.
2. The doctor, leaning in: *[EN: Arre! You first. Is it your knee, or your hand?]* Two **audio pills** (no text or picture until the reads stage). You tap the one that names what you can see hurts.
3. His hand reaches to a part: *[EN: Does it hurt here?]* You answer *yes* or *no* (audio pills; *yes* and *no* are placeholders until A8.1 and A4.4 are answered). He presses a wrong part first about half the time, so *no* is a real answer.
4. For a cold: *[EN: Are you hot, or cold?]* (the shiver or the fan-face on your own hands is the prompt).
5. He treats you: you choose the plaster design (free, ungraded; Maryam's collection), he puts it on, *[EN: All better!]*, the big laugh.

Three or four two-way rows: a blind bot earns the ear star about **6–12%** of the time; the same standing as level 1 above (R9, decision 6). Nothing is scary: he's gentle, he explains, the plaster is the prize.

**Say it out loud (optional, never graded by the app).** Before tapping a pill, the child can press the microphone and say the word; the app plays their voice next to the family's recording (Game Design: speaking stage 1, shadowing), and a parent or Nani taps ✓ or "again". This is the only production in the mode until the family's few-shot keyword spotting exists (speaking stage 2), and a two-way answer is exactly the "small known set" that stage 2 could one day judge.

**Where it lives.** The first minute of Arc 3 Ch4's clinic round (you slipped in the Ch2 puddle at the gate on the way; a comic tilt of the view, *Arre re!*, no fall shown), and a free-play route **"You're the patient"** (a random visible hurt each time: hand, finger, arm, elbow, knee, foot, toe; or a cold: hot/cold; or a tummy ache, where he asks *[EN: tummy, or head?]* and you can't see it, so the intro card's ••• line is the only prompt, from level 2).

### R6. Story home (Arc 3 Ch4 "Nani has a cold", revised)

| Beat / errand | What happens | Mechanics |
|---|---|---|
| Ch2 "The leak" (seed) | Ali slips in the courtyard puddle, comically, fine: "later". The puddle by the gate stays | Beat only |
| Ch3 "The animals" (seed) | The hen hurt her foot getting into the shed: "we'll take her to the doctor" | Beat only |
| **Ch4 intro beat** (home) | Nani in bed; she sneezes (her glasses jump), holds her head, points at her throat. **Nothing is said about where it hurts: you see it.** Nana: go and tell the doctor. The clinic appears in the fog on the map | Set-up for Tell the doctor |
| **Ch4 errand "The clinic"** (the mode's first round, about 5 min) | On the lane you slip in the gate puddle (a tilt, *Arre re!*). At the door: the greeting (formal). **You're the patient** (60 s): knee or hand? does it hurt here? a plaster, all better. Then **Tell the doctor about Nani**, scaffolded: *[EN: Is it Nani's head, or her tummy?]* → head; *[EN: Her throat, or her ear?]* → throat (picture → word, two pills each). He'll give you something for her after morning clinic: *[EN: Will you help me?]* **Three patients at level 1:** Ali's knee ("you too!"), the hen (the cousin brings her; the vet row), a wet neighbour who's cold (feeling → blanket, one Just right exchange). He hands you a closed bottle for Nani | You're the patient, Tell the doctor (two-way), Who's next? (called, not chosen), Where does it hurt?, the trolley, Gentle hands, one Just right |
| Ch4 outro beat (home) | Nana: *Muke hikdo [EN: medicine] dine*: the bottle from three look-alikes. Nana gives it to Nani. You tuck her blanket (one Just right exchange) | Pass me, Just right |
| Ch5 "Chai together" | Nani's remedy in Cook; the quilt patch is a stethoscope | Hand-off to Cook |

Later arcs are unchanged (section 5.1): Arc 4 past-tense rows (*[EN: Did you fall, or bump it?]*), Arc 5 the village clinic under the neem tree, Arc 2's sore feet as a side errand.

### R7. Where I agree with Zafar, and where I push back

| Zafar's point | Response |
|---|---|
| Centre it on the real doctor and his clinic | **Agree, fully.** Renamed, re-hosted, and the doctor's warmth (the big laugh) is now the mode's reward sound. The design below already had this as open question 1; the answer is yes |
| "You go yourself because you're sick" as the first game | **Agree as the opening minute and a free-play route; disagree as the core.** As a patient the child can't say anything (no speech recognition), so every answer is a two-way tap, and they never get to touch anyone, so the tactile "gentle hands" and the blanket comedy are lost. It's a lovely first minute; it's a thin game. Also, "sick" becomes "a scuffed knee from the puddle" or "the sniffles": Layla shouldn't play at being ill |
| "Or you just go and help" | **Agree: this is the core.** The design below had it; it stays |
| Different people come in and describe their pain | **Agree, with one edit:** not only pain. Half the visits are feelings (*cold, hot, tired, sneezy*) and the animals, because "it hurts" alone is one frame and the S4 syllabus needs the feeling words. "Pain" is "hurt" in the game's own words |
| "Sometimes the doctor asks 'is it this or that?'" | **Agree, and promote it from "sometimes" to the scaffold.** It's better than the "warmer" hint the design had, and it *is* the level structure: always at level 1, unanswered at level 2, on request at level 3. One rule added: the answer is given by acting, never by tapping a matching sound (R4) |
| "Eventually you listen to the patient yourself and get the right thing" | **Agree; this is level 3 of the design below,** with the "?" button as the only way back to the doctor's question, at a cost |
| Not said, but implied by "his clinic": drop Nani's name and Nani's bedroom | **Half agree.** The name goes. Nani's bedroom stays for the Ch4 beats (she's the reason you go), and the vet corner stays at his clinic for now, because the cats are Layla's biggest hook. Whether a real doctor wants a cat on his table is decision 5 |
| Not said: what about *Just right* and *Who's next?* | **Kept,** and folded into his frame: both are the doctor's *or*-questions now (*[EN: Still cold, or just right?]*; *[EN: Who's next: Nana, or Ali?]* at level 2, where the call names two people and you tap the one he means) |

### R8. What changed in this document, and why

| Section | Change |
|---|---|
| Header, 1 | Name: "Nani's clinic" → **the clinic (the doctor's clinic)**; the doctor is host and voice, not a task-giver at the edge |
| 3 Mechanic library | **M13 The doctor's question** (the *X or Y?* scaffold) and **M14 You're the patient** added; M5 folded into M14 (it's what the doctor does to you); M11 Tell the doctor now uses M13's two-way form at level 1 |
| 4 First set | Now: M14 → M1+M13 → M2+M3 → M4 → M7. M13 is a small building block used by all of them |
| 5 Story | Ch4 as in R6; the doctor's cast row |
| 6 Learning | The *or* frame and the doctor's lines; rung 3 of the hint ladder is now the doctor's question; the level table has a "doctor's question" row; the family word list gains *or*, the question forms, short answers and the doctor's lines |
| 7.4 Safety | **Likeness rules for the doctor** (below) |
| 8, 9 | `ask` and `you` mechanics, the first-person lap view, the doctor's "leaning in" pose |
| 11 | Open questions 1 and 3 answered; new decisions in R9 |
| 12 | Phase 1 includes M13 and M14; the first three tasks updated |

**Likeness rules for the doctor** (added to the safety checklist in 7.4):
- He is always competent, kind and in charge. Mistakes are the player's, never his; the comedy is in the patients and the cats (Nana under four blankets, Zazu's wool), never in him.
- No gags at his expense: no sneezing on him, no hat or hair jokes, no exaggerated features. The art bible's rule: stylised, never caricatured. Zafar and Hannah sign off his character sheet, and the sheet is the only reference after that.
- He speaks to elders formally and they to him; the children are welcome and safe with him.
- Medicine is his and stays closed; he never asks the child to give it.
- His in-game name is the family's decision (E102), and whether he records his own lines is theirs too (R9, decision 2).

### R9. A short persona and Sceptic check, verdict, and decisions

| Persona | On the revised design |
|---|---|
| **Layla, 5** | The doctor talking to *her* first ("is it your knee?") is the best minute in the game; she picks the flowery plaster. Level 1 with Ali answering is right for her: she hears *knee* three times and gets it. She asks "is that really Hannah's grandad?" |
| **Zayn, 8** | Level 1 is "too easy" (50/50): he wants level 3 and won't press "?" because it costs the tick. Right: the level follows the word stage, so he's at level 3 within a morning |
| **Maryam, 11** | Wants the clinic to look like his real one. Careful: the art bible's "modern with hints and nods"; decision 3 |
| **Zafar, 38** | More Kutchi per minute than before at level 1 (three hearings per row plus the doctor's frames), and *or* is a word he'll use every day. Worried level 1 is slow: it's 60–90 s per patient, the same as before |
| **Farah, 34** | "You're the patient" is a 60 s route; one patient is 60–90 s |
| **Nani, 68** | "Our doctor": proud, and she's the patient in the story. Asks if she has to do his voice (decision 2) |
| **The Sceptic** | Tries: (1) always the first option → order is random; (2) matching the sound of the complaint to the sound of the question → the answer is on the body, so she still has to know which word is *knee*; (3) at level 1 she's right half the time on the part → the ear star also needs the care, and level 1 is teaching (decision 6); (4) the wrong option is always last patient's part → it's drawn from the pool; (5) pressing "?" at level 3 → costs the tick; (6) the doctor glances at the part → gaze fixed on the face; (7) in "you're the patient", waiting for his hand to show where → his hand is the *prompt* for yes/no, not the answer to *knee or hand?*, which comes first. **She can't reliably win from level 2** |
| **The Builder** | Cheap: M13 is one line template with two slots on the existing pill and ladder; M14 is one lap-view image, the yes/no pills and the doctor's "leaning in" pose; everything else is unchanged. Net new art: one image and one pose |

**Verdict: Go with changes** stands, and the changes are the same prerequisites (the family's words, the doctor's sheet, the shared engine); the revision makes the mode better without making it bigger.

**Decisions for Zafar:**
1. **The name.** "The clinic" until the family says what the children call him (E102); then his name on the map, or a title?
2. **His voice.** Does the doctor record his own lines (about 25 frames), or does Mum voice him too? If he does, his Kutchi is the family's other Kutchi, which the Game Design counts as a feature ("multiple voices").
3. **His likeness and his room.** The likeness rules above; and does his real clinic's look inform the room, or is it a generic lane clinic with nods?
4. **You're the patient first.** A scuffed knee from the puddle (a pink scuff, no blood) or the sniffles: which opening, and is either too much for Layla?
5. **The vet corner at his clinic**, or at home with his blessing ("you do the cats, helper")?
6. **The ear star at level 1.** Two-way questions make level 1 about 10% for a blind bot. Count it, or treat level 1 (and "you're the patient") as teaching, with the ear star from level 2?

---

## 1. Pitch and core loop

**Why this mode exists.** Syllabus stage **S4 "How I feel"** needs a game where **body words, feelings and "it hurts"** decide what you do. Its core verb is **treat**: act gently on a person (or a cat) who tells you, in Kutchi, what's wrong. The player is **the doctor's helper** at **the doctor's clinic** down the lane (see the revision above: the doctor, Hannah's granddad, is the host and the voice of the mode). He asks the questions a doctor asks (*[EN: Where does it hurt? Is it the knee, or the foot?]*, M13) and does anything "medical"; the player finds where it hurts, chooses the comfort care, puts it on with gentle hands, and keeps the waiting room moving. In the story the first patient is the player (a scuffed knee, M14) and the reason for going is Nani (Arc 3, "Nani has a cold").

**The loop (one patient, 60–120 s; a clinic morning is 3–4 visits of mixed type, about 4–5 minutes).** *Revision 2: this is the named-ailment visit (V3); the check-up (V1), the mystery (V2) and bring-someone-in (V4) are in R2.2, and step 3's doctor's question is now only the "?" hint.*
1. **Who's next?** Patients wait on the bench. The doctor calls a name; you tap that person and they come to the examination bench. You greet them (the greeting choice every mode has; respect language for elders).
2. **The intro card** flashes up with the patient's face and one line per complaint (••• or text by word stage), then shrinks into the sidebar. **Then 3 seconds of quiet.**
3. **Where does it hurt?** The patient has said *[EN: My knee hurts]*. At levels 1–2 the doctor asks *[EN: Is it the knee, or the foot?]* (M13; at level 1 the patient answers, at level 2 nobody does). You tap that part of their body. Right: a small soft "sore" swirl appears there and the patient says "that's it". Wrong: they **giggle** ("that tickles!"), Kasuku squawks *Arre re!* from his perch, and they say it again. You try again.
4. **The care trolley.** They say what they need (*Muke [EN: plaster] khape*), or later how they feel (*[EN: I'm cold]*). You pick from a trolley that always holds the full set of care items, in a new order every visit.
5. **Gentle hands.** You put it on: peel and stick a plaster on the sore spot, wrap a bandage round, lay a cool cloth and take it off when its ring goes green, tuck a blanket.
6. **Just right?** From level 2 the doctor asks how they feel now. *[EN: Still cold]* means another blanket; *[EN: Too hot]* means take one off; *[EN: Just right]* means press **Done**. (Nana, who is always cold, can end up under four blankets.)
7. **Thank you.** *Aabhar aanjo!*, a sticker for the album, a small thank-you gift for the shelf, *Achija!* At the end of the morning: stars, pocket money and a word review (Kutchi → English).

**How it differs from Cook and Find it.**

| | Cook with Nani | Find it | **The clinic** |
|---|---|---|---|
| Core verb | **Build** a dish from an order | **Search** a cluttered scene | **Treat** a person who responds to you |
| What you act on | Ingredients and utensils on a worktop | Objects hidden in a room | **A body**: the patient's own head, hands, knees, tummy; a cat's paw |
| Camera | T, straight down | E, eye level, panning | **E**, one patient seated facing you, plus a close-up of the face |
| What the Kutchi decides | What, how many, what order, for whom | Which one, where | **Where on the body, what they feel, what care, who's next, when it's just right** |
| Where the fun comes from | Tactile cooking, timing, the Simon memory | "Found it!", curiosity, combos | **A person reacting live** (giggles, sighs, sneezes, the "ahh" of a cool cloth), comedy cases, being trusted to help, a waiting room to juggle |
| Syllabus weight | S1 nouns and numbers, S2 verbs, S5 first/then | S1 nouns, S2 positions and colours | **S4 body, health, feelings, hot/cold**; S3 kinship and possessives as review; S4 animals in the vet corner |

**Borders with other modes** (the brief's rule: say so rather than take it):
- **Diagnosing from several clues** is *Who did it?*'s verb (deduce). The clinic never asks you to work out an illness from clues; the patient says what's wrong, and examining (M6) reveals it by acting.
- **Catching a sneeze in time** is a *Monsoon rush* verb (react). It's used only as a 2-second hands beat, never as a mechanic.
- **Finding the medicine on a shelf** is *Find it*'s verb. In the clinic, "fetch the medicine" is Cook's `fetch` on a small shelf (or "pass me" from three), and it always ends in the doctor's hand: he checks what was brought aloud and gives it himself (`handover`, R3.1).
- **Making Nani's warm drink** (*dudh* + *hardar*, or *aadu* chai) is *Cook*'s. The clinic hands over to Cook for Arc 3's "Chai together".
- **Putting clothes on someone** is *Dress up*'s. The clinic keeps warm with blankets and a hot-water bottle, never clothing.

---

## 2. Research summary

### 2.1 What the hits do, and what we take

| Reference | Concrete mechanic | Why it works | What we take / leave |
|---|---|---|---|
| *Toca Doctor* (Toca Boca) | One patient, four problems at a time; tap a problem to open its puzzle: pull splinters, pop bugs in hair, clean a knee and apply a plaster, set a bone, bubbles out of the tummy (with a burp). No text, no timers, can't get stuck | Tactile, silly, safe; every problem is its own small toy; the body is the playground | **Take:** problems on a body, each fixed by a tactile gesture; plasters; burps and giggles; no fail state. **Leave:** shots and bone-setting (medical fear; see Teddy Bear Hospital below). Its weakness, "repetitive", we fix with spoken variation |
| *Toca Pet Doctor* | 15 animals with gentle, imaginative problems (gum on a bird's foot, a knot in a worm's tail); fix it, feed a snack, they fall asleep | Empathy; the comedy is in the problem, not the pain; ages 2–6 | **The vet corner** (M9) and **silly cases** (M10): Zazu's tail tangled in Big Ma's wool, Simba's thorn |
| *Dr. Panda's Hospital* | Waiting room → bed → a test or procedure → better; 8 animal patients; stickers | The sequence of a visit is itself satisfying; stickers as collection. Reviewers: fun for a while, then nothing more | The **visit sequence** and a **sticker album**. The "nothing more" warning is why we add a waiting room, levels and a meta loop |
| *Operate Now: Hospital* (Spil) | Surgeries with guide lines on where to cut; about 60% of play is base building, staff stamina and timers | Precision tension; management meta | **Leave almost all of it:** gore, surgery, and stamina timers are wrong for this audience, and base building is padding. We take only "upgrades change how it plays" |
| *My Hospital* (Cherrypick) | 80+ funny diseases ("chilli throat", "frozen hands", "slimy lungs"); grow plants, blend cures; decorate the hospital | Comedy illnesses; decorating makes it yours; cures as a collection | **Comedy cases** and **clinic décor** (Maryam). Leave crafting chains: that's Cook's verb |
| *My Hospital* (Bubadu) | Time management plus mini-games: pop bubbles in a syringe, set up a drip, treat a burn, dress a bandage, blood pressure | Short tactile tasks inside a management loop | **Dress a bandage** (M3). Leave syringes and drips |
| *Heart's Medicine*, *Diner Dash*-style hospitals | Patients seated and treated in turn; hearts drain while they wait; quick mini-games per patient | The juggling rush; visible mood | **Who's next?** (M7) and Busy mode's **comfort ring**. Gentler: nobody leaves, nobody gets worse |
| *Two Point Hospital* / *Theme Hospital* | Visual comedy illnesses (a light bulb for a head, a pan stuck on the head); a GP room triages; diagnosis certainty | Humour carries a management game; "visual vs non-visual" illnesses | **Non-visual complaints** (you must listen), gentle **visual comedy** only as a twist (hiccups, a sneeze that blows off Nana's cap). Leave diagnosis certainty (Who did it's verb) |
| *Good Pizza, Great Pizza* (from `game-modes-fun-analysis.md`) | The spoken order is the puzzle; no timer; characters you come to know | Understanding the request *is* the game | The patient's words are the order; recurring family patients with **tendencies** ("Nana is always cold"), as a bias only |

### 2.2 Language-learning evidence

| Evidence | Finding | What we do with it |
|---|---|---|
| Total Physical Response (Asher; classroom studies with young EFL learners) | Body parts and action verbs are the classic TPR content: learners act on spoken commands, comprehension before production, low anxiety | Every row is something you act on (tap the part, apply the care). Grandparent mode takes it into the room: "touch your nose" on your own body (M11) |
| Body-part word acquisition (Waugh and Brownell 2015; early-vocabulary norms) | Face parts (nose, eyes, mouth), tummy, hands and feet come first; elbows, fingers and eyebrows later | **Level order:** big parts and face first; elbow, finger, toe, shoulder later |
| Left–right (Rigal 1994 and follow-ups) | Children use *left* and *right* on their own bodies reliably from about 6–7; on another person later still | Left/right only from level 3, never in a story-required round, never for a 5-year-old's first plays |
| Emotion words (Widen and Russell 2008; recent preschool studies) | *Happy, sad, angry* are learned early; fear, surprise and disgust later; specific labels help children link causes and faces | Feelings start with the body-state words (**hot, cold, tired**) and *happy/sad*; *scared* is held (question 6) |
| Pretend medical play (Teddy Bear Hospital systematic review, 2021) | Mostly lower anxiety and better health knowledge; **two studies found more fear where real medical equipment was used** | Toy-like instruments only; no needles, no blood; comfort care (plasters, blankets, cool cloths) rather than procedures |
| Sociodramatic "doctor's office" play | Role play is a strong vehicle for oral language; adults use richer vocabulary in pretend talk | Grandparent mode "Doctor Nani" (M11): Nani plays the doctor, the child the patient |
| Joint media engagement (parent–child co-play studies) | Children who play educational apps with a parent engage more and perform better | Layla plays with a parent; Explore mode is built for pointing and naming together |
| Simon Says research | Young children find "only act when Simon says" genuinely hard (inhibitory control) | **Kasuku's echo** (M12), held back: only act when the doctor says, not the parrot |
| Corrective feedback (Lyster and Saito 2010, already in Find it) | Prompts beat recasts | After a recast the player retries; the game never shows the answer |
| Children's touch targets (NN/g, already in Find it) | About 2 cm targets for young children | Big body zones at level 1; small parts only inside the face close-up; tablet as the 5-year-old's device |

Sources are listed at the end. Several review pages (Gamezebo, 148Apps, arXiv, PMC) are blocked from this environment; those rows use the search summaries.

---

## 3. Mechanic library

Scoring 1–5. **Forces Kutchi** names the decision, the leaks and how each is closed. Level numbers refer to section 6.4.

| # | Mechanic | How it plays | Fun | Forces Kutchi | Distinct | Plot | Replay |
|---|---|---|---|---|---|---|---|
| **M1** | **Where does it hurt?** | The patient says *[EN: My {part} hurts]*. Tap that part on their body. Face parts live in a **close-up** you open with a magnifier on the head | **4** The patient reacts to every touch: giggles when you're wrong, "ahh" when you're right (*Toca Doctor*) | **5** **Which part** (and from level 3, which side). **Leaks:** the patient holds or rubs the sore part; the sore mark drawn before the tap; the game zooming in on the face when a face part is asked; the biggest part (tummy) or the most frequent part winning; gaze. **Closed:** neutral, symmetric idle pose; the sore mark appears only after the right tap; the magnifier is always there and only the player opens it; parts drawn evenly (no part over 25% of a day's rows, weakest words first); hit areas padded to one size; the first wrong tap costs that row's ear star | **5** No other mode has a body as the target | Arc 3 Ch4 (Nani's head and throat); every clinic morning | **4** 12–20 parts × many patients; sides from level 3; the vet's animal parts |
| **M2** | **The care trolley** | Pick what the patient needs. Level 1: they name it (*Muke [EN: blanket] khape*). Level 2+: they say how they feel (*[EN: I'm cold]*), and either of two cares is right (blanket or a warm drink) | **3** Quick; the fun is the patient's reaction ("ahh!") | **4** **Which care** from the noun, then from the feeling word. **Leaks:** care fixed by body part (knee = always plaster); the trolley holding only the right items; fixed trolley slots; shivering or sweating showing the feeling. **Closed:** every part accepts at least two kinds of care; the trolley always holds every unlocked item, shuffled per visit; shiver/sweat only while the feeling word is at stage 1; only the first pick counts | **4** Cook's pantry is the same tap, but here the choice comes from a feeling, not a recipe | Arc 3 Ch4 (the blanket for Nani); every visit | **4** New care items unlock with the bigger trolley; feelings × two valid cares |
| **M3** | **Gentle hands** | Put the care on: peel and stick a plaster (drag to the spot), wrap a bandage (circle round the limb), cool cloth (lay it, lift it when its ring is green), tuck a blanket (drag up) | **4** The tactile payoff; plaster designs; a neat wrap | **2** Hands only, by design (the break between listening). From level 2, *[EN: wrap it] {n}* times: a count. **Leaks:** the wrap ending itself at N; counting aloud. **Closed:** never ends by itself, press Done; silent count from number stage 3 | **3** Wrap reuses Stir's circular track, and lifting on green reuses Cook's rings | Every visit | **3** Plaster designs (a collection); gestures stay the same |
| **M4** | **Just right** | After the care: *[EN: How do you feel?]* → *[EN: still cold]* / *[EN: too hot]* / *[EN: just right]*. Add a blanket, take one off, cool cloth on or off, or Done | **5** The Goldilocks comedy (Nana under four blankets, Ali complaining he's boiling); a real back-and-forth | **5** **Add, remove or stop**, set by a feeling word each time. **Leaks:** visible shivering or sweating; always 1 step from right; worn shawls that correlate with the feeling; a colour thermometer. **Closed:** body-state visuals only at stage 1; the start is 1–2 steps from right, in either direction, at random; what a patient arrives wearing is random; no readable thermometer (the doctor says the reading) | **5** No other mode has a feedback loop with a person | Arc 3 Ch4 outro (Nani's blanket); Monsoon arrivals are wet and cold | **4** Start states, tendencies as a bias, two patients at once in Busy |
| **M5** | **Does it hurt here?** *(folded into M14: it's what the doctor does to you)* | Press gently on a part; the patient says *[EN: yes]* or *[EN: no]*. On yes, treat it; on no, try elsewhere | **3** Simple, gentle, turn-taking | **3** **Treat or move on**, from yes/no. **Leaks:** a wince or "ouch" sound on yes; pressing everything. **Closed:** the yes and no recordings are neutral and the face doesn't change; the ear star grades what you do after each answer, so pressing everything doesn't help | **4** | Explore; Layla's first visits | **2** Only two words to learn |
| **M6** | **Have a look** | The doctor asks you to examine: *[EN: look in her ear]*, *[EN: listen to his chest]*. Choose the instrument and the place. The torch finds a lost bead in Ali's ear; the stethoscope plays a heartbeat you can hear speed up; the forehead strip is read aloud by the doctor | **5** Instruments are the best toys in *Toca Doctor*; finding something funny | **4** **Which instrument and where** (instrument noun + part). **Leaks:** instruments that fit only one part, so world knowledge answers. **Closed:** each instrument works on several parts (torch: ear, nose, mouth, eye; stethoscope: chest, back, tummy); what's found afterwards can be visual (the picture is the meaning once the Kutchi chose where) | **4** "Examine" is part of the verb; not a search (the body is small and known) | Arc 3 Ch4 clinic; Arc 5 village clinic | **4** Many finds; the "brighter torch" upgrade |
| **M7** | **Who's next?** | The waiting bench: 2–4 patients. The doctor calls *[EN: {name}, come]*; you tap them. Busy mode: two examination benches and a **comfort ring** on everyone waiting | **4** The juggling of a management game (*Heart's Medicine*), gently | **4** **Who** (names and kinship: Nana, Ma, Ali, the cousin, *[EN: auntie]*). **Leaks:** only one person waiting; the called person stands or waves; their face bobbing as they speak (the Chai tray's old leak); a fixed bench order. **Closed:** at least 2 waiting when a call is made (otherwise no call and no ear credit); nobody reacts until tapped; the doctor says the call, not the patient; seats shuffled | **3** Busy juggling is Cook's too; the kinship call is new | Every clinic morning; Arc 3 Ch4 | **5** Queues, tendencies, Busy, two benches, the open clinic |
| **M8** | **Pass me** (the doctor's bag) | Mid-care, the doctor says *Muke hikdo [EN: thermometer] dine*. Three items from one look-alike group in the sidebar | **3** A known, quick interrupt | **5** Proven in Cook: look-alike groups, no translate for free, never a word already in the current complaint | **2** Shared plumbing | Arc 3 Ch4 "fetch the medicine" (three bottles and jars at home) | **3** Any word the player has met |
| **M9** | **The vet corner** | Simba, Zazu, Kasuku, the hen or a goat on the table. The owner speaks: *[EN: Simba's paw hurts]*. Animal parts: paw, tail, ear, nose, wing, beak | **5** The family's own cats as patients; Zazu's tail knotted in Big Ma's wool; Kasuku saying *Arre re!* after your mistake | **4** **Which animal part**, plus a **possessive** (S3 review). **Leaks:** fewer parts (a higher guess rate); the animal licking the sore paw. **Closed:** at least 6 parts per animal (front paws count as two); no grooming animation on the sore part | **4** | Arc 3 Ch3→4 (the hen from "The animals" chapter at the clinic); Arc 5 farm | **4** Five animals; the cats' tricks |
| **M10** | **Silly cases** | Twists on any visit: hiccups (a glass of *paani*, then count), a sneeze that blows off Nana's cap, a sesame seed in the ear, sore feet from the wedding dancing, wool round Zazu's tail | **5** The *Two Point Hospital* and *My Hospital* laugh, kept gentle | **3** The case is visual; the Kutchi is still where it hurts and what they need | **4** | Any arc as side errands | **5** A case collection in the album |
| **M11** | **Tell the doctor** (role reversal) | You **see** the hurt (Nani holds her head, sneezes) but nobody says it. At the clinic the doctor asks you; pick the right audio chunk from three. **Grandparent mode, "Doctor Nani":** Nani sees the word in big text and asks the child; the child touches their own nose; she marks it | **3** Being trusted with Nani's message; Doctor Nani is lovely in the room | **5** **Production:** picture → word. **Leaks:** matching a sound heard earlier (so nothing is said at home); text or pictures on pills (audio only until the reads stage); the odd one out (pills from one look-alike group) | **4** The only production-first mechanic here | **Arc 3 Ch4: carrying Nani's message to the doctor** | **3** Any M1 visit flipped |
| **M12** | **Kasuku's echo** (Doctor says) | Kasuku, on his perch in the clinic, blurts body words. Act only when **the doctor** says it | **4** A Simon Says trap; funny parrot | **4** Still which part; adds inhibitory control. **Leaks:** Kasuku always wrong (so you can rule his word out); fixed. **Closed:** he echoes the right part a third of the time. **Needs an exception to the cast rule** "Kasuku never speaks during a task" | **4** | Hub and clinic, later | **3** A modifier on any visit |
| **M15** | **The check-up** (Revision 2, V1 and V2) | The doctor calls parts one at a time: *[EN: The head. Now the knee. The knee again.]* You put the check-kit instrument on that part (a tap at level 1; *listen to / look in / the temperature* from level 2) and something happens: a heartbeat, a torch beam, a reading he says aloud. 4–6 calls. In the mystery (V2) one call finds the sore part; then the treatment | **5** The instruments are the best toys (*Toca Doctor*); the tummy gurgle; the small thrill of the find | **5** **Which part** per call, then **which instrument**, then **which side**. **Leaks:** sweeping every part; elimination over the calls; the find showing before the named check; the instrument narrowing the part; the doctor's gaze. **Closed:** an unnamed tap is a miss; random subsets with repeats; the find plays only after the named part is checked; every instrument works on several parts; gaze on the patient (R2.2) | **5** TPR command chains on a body; no other mode has a call-per-row visit | Every morning; Arc 3 Ch4 (the hen, the neighbour); Arc 5 | **5** Parts × instruments × sides × finds; silly finds in the album |
| **M13** | **The doctor's question** (*Is it this, or that?*; **demoted in Revision 2** to the "?" rung and to M14) | After the complaint, the doctor asks *[EN: Is it the {X}, or the {Y}?]*: for a part, a feeling or a care. Level 1: the patient answers and you act on it. Level 2: nobody answers; you act. Level 3: only on request ("?"), at a cost | **4** A real doctor's line; the child hears the word three times, once against a wrong one; the doctor looking at *you* for the answer | **4** **Which of two**, then the act itself. **Leaks:** a fixed option order; the wrong option predictable (last patient's part); answering by matching the sound of the complaint to the sound of an option; the doctor's glance. **Closed:** random order; the wrong option from the level's pool (far, then look-alike); the answer is always an act on the body or trolley, never a pill that repeats the sound; gaze on the patient's face; never asked when one option is left; costs the tick from level 3 | **4** The scaffold is the level structure, which no other mode has | Every visit at levels 1–2; Tell the doctor at level 1 | **4** Any word list fills the two slots; far and near pairs |
| **M14** | **You're the patient** (revision R5) | First person, looking down at your own knees, feet and hands. The hurt is shown (a pink scuff; a sneeze). The doctor: *[EN: Is it your knee, or your hand?]* → two audio pills. *[EN: Does it hurt here?]* (his hand on a part) → yes/no pills. *[EN: Hot, or cold?]* for a cold. He treats you; you choose the plaster design; *[EN: All better!]* Optional "say it" with a parent's ✓ (speaking stage 1) | **5** Being looked after by a real, kind doctor; the plaster is the prize | **3** **Which of two heard words names what you see**, then yes/no: picture → word, the mode's only production. **Leaks:** the doctor's probe hand before the question; two-way guessing (50% a row). **Closed:** the *knee or hand?* question comes before any probe; the probe hand is the prompt for yes/no only, and it's wrong first half the time; 3–4 rows per visit; treated as teaching at level 1 (decision 6) | **5** No other mode puts the player in the chair | **Arc 3 Ch4, the first minute**; a free-play route | **3** Visible parts (hand, finger, arm, elbow, knee, foot, toe), a cold; plaster designs |

**Also rejected:** injections, drips, surgery and bone-setting (fear; the Teddy Bear Hospital evidence); blood; patients getting worse while they wait, or leaving; triage by "who's most ill" (judging suffering is not a game for 5-year-olds); diagnosing an illness from clues (belongs to *Who did it?*); medicine doses, pills or spoons of syrup given by the player; a body chart or labelled drawers (they'd do the listening); hospital base building (*Operate Now*'s padding); crafting cures (Cook's verb); the red cross or red crescent (protected emblems under the Geneva Conventions; developers have been asked to remove them). The clinic's sign is a stethoscope.

---

## 4. Recommended first set

*(Revised 25 Sept 2026, Revision 2.)* **One visit engine where a visit is data**, the way a Cook recipe is: a patient, a list of **calls** `{who speaks, verb, part, side?, instrument?}`, and a **treatment** with slots `{item, part, side?, count?, colour?, path?}`. The four visit types of R2.2 are four configurations of that engine; M15, M1, M3 and M4 are its steps; M14 is the same engine with you in the chair; M7 is the day around it.

| Order | Mechanic | Why first |
|---|---|---|
| 1 | **The visit engine + M15 The check-up** with the check kit (T8 stethoscope, T9 torch, T7 thermometer) | The engine room: one body word per call, 4–6 calls a patient, an instrument that reacts. It needs the hotspot data every later mechanic uses, and it's the mode's TPR core. Built first so the leak bot's "sweep" and "leftovers" strategies are answered from day one; the mystery (V2) is the same code with a `find` flag |
| 2 | **M1 Where does it hurt?** (V3, the named ailment) | The patient speaks first; the same hotspots; no *or*-question |
| 3 | **M2 The care trolley + M3 Gentle hands** with T1 plaster, T2 bandage (turns, colour; the figure-of-eight at level 3), T12 cold and hot packs | The "treat": the doctor's instruction fills the slots (*[EN: A bandage, round twice]*). M3 reuses Cook's ring, track, drag and count code |
| 4 | **M4 Just right** (T13 blankets) | The most fun and most Kutchi-dense exchange (hot, cold, just right, add, remove); the hot/cold words are Questions for Mum G10–G14 |
| 5 | **M14 You're the patient** (V0) | The tutorial and Layla's favourite: the lap view, two-way pills, yes/no, the plaster picker, and the first home of *left/right* on the child's own body. Needs *yes* and *no* (A8.1, A4.4) and G96 |
| 6 | **M7 Who's next?** | Turns single visits into a clinic morning with time management, Busy mode and kinship review |
| 7 | **T11 Drops** (level 3) | The left/right mini-game: part, side and count in one line |
| + | **M8 Pass me → T6 the dispensary**, **M9 the vet corner**, **M11 Bring someone in** (V4) and **M10 Silly cases** come with the story build (phase 3) | M8 is Cook's, reused, grown into the dispensary shelf (colour, count, shelf); M9 is data on the same engine; M11 is the story's shape (Nani's message; bringing Ali in), **said aloud** on `tell` (R3.4, S3) with audio pills from one look-alike group as the fallback; the silly finds (the seed in the ear) ride on M15's check kit. The speaking moments S1 (V0) and S2 (V3) are in the first set from phase 1 |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| T10 reflex hammer, T15 cream | After the first set | Cheap variety; T10 needs a kick frame per patient |
| T5 Mix the medicine (Cook's station in the dispensary) | Phase 3, as data | Needs the dispensary view; not a new mechanic |
| T14 sling, the swivel stool (a back view per patient) | When the art budget allows | Art per pose |
| M13 The doctor's question, beyond the "?" rung and M14 | Withdrawn (R2.4) | — |
| M6 Have a look | Folded into M15's check kit | — |
| M5 Does it hurt here? | Folded into M14 | Two words; M14 teaches them |
| M12 Kasuku's echo | After Zafar decides on the cast rule | Needs the exception |
| T3 stitches, T4 pill organiser, T16 needle, T17 teddy repair | Never in the clinic (R2.5) | Fear, duplication, or another mode's verb |

---

## 5. Story integration

### 5.1 Where the mode appears

| Arc | Chapter / beat | What happens | Mechanics |
|---|---|---|---|
| **3 Monsoon** | Ch2 "The leak" (seed) | Ali slips in a puddle, comically. He's fine: "later". Seeds his knee for Ch4 | Beat only |
| 3 | Ch3 "The animals" (seed) | The hen hurt her foot getting into the shed. "We'll take her to the doctor" | Beat only |
| 3 | **Ch4 "Nani has a cold"**, intro beat | Rain on the window. Nani sneezes (her glasses jump), holds her head, points to her throat, and goes to bed. **Nothing is said about where it hurts: you see it.** Nana: "go and tell the doctor" | M11 set-up |
| 3 | **Ch4 errand: "The clinic"** (the mode's first round; revision R6) | On the lane you slip in the Ch2 puddle at the gate (a tilt, *Arre re!*). The clinic opens on the map. Greet the doctor (formal). **You're the patient** first (M14, 60 s): *knee or hand?*, *does it hurt here?*, a plaster. Then **Tell the doctor** what's wrong with Nani (M11 in M13's two-way form: *[EN: her head, or her tummy?]*). He says he'll give you something for her after morning clinic: *[EN: Will you help me?]* Help him with 3 patients at level 1: Ali's knee ("you too!"), the hen (vet), a wet neighbour who's cold. He hands you a closed bottle for Nani | M14, M11, M13, M7, M1–M4, M9 |
| 3 | Ch4 outro beat | Home. Nana: *Muke hikdo [EN: medicine] dine*: pick the bottle from three look-alikes (bottle, honey jar, pickle jar). Nana gives it to Nani. You tuck her blanket (one M4 exchange) | M8, M4 |
| 3 | Ch5 "Chai together" (Cook) | Nani's warm drink (*dudh* + *hardar*, or *aadu* chai) in Cook; Nani feels better; the quilt patch is a stethoscope (Game Design: patch motifs) | Hand-off to Cook |
| 3 | Monsoon side errands | Wet, cold neighbours; Simba soaked; Zazu's tail in the wool basket | M4, M9, M10 |
| **4 Lost ring** (S5) | Side errands | Nana bumped his head searching under the charpai: patients say **what happened** (past tense) before where it hurts. Level 4 content | M1 + S5 rows |
| **5 Village** (S6) | "The farm" side errand; **the village clinic** | The doctor visits Nani's village (he's Nana's old friend, which also works for "Nana's stories"). A clinic under the neem tree in the courtyard: a thorn from the field, sunburn (*hot*), a goat. Rows can be comparatives (*[EN: hotter than yesterday]*) | M6, M9, M10 |
| **2 Wedding** (S3), optional | Side errand | Sore feet after the dancing: kinship review ("Masi's feet") | M1, M10 |

The Roadmap lists Ch4 as two errands, "Where does it hurt (Body/dress)" and "the clinic (Shopping)". This design makes the home part a **beat** and the clinic the **one errand**, so two treat errands never come back to back (Roadmap rule: consecutive errands never repeat the main action). Question 8.

### 5.2 Who drives it

| Cast | Role |
|---|---|
| **The doctor** (Hannah's granddad; real likeness) | **Host, voice and the mode's warmth:** calls names, asks *[EN: Is it this, or that?]* (M13), treats the player first (M14), asks you to examine, gives any medicine himself. Big laugh; praises you. Speaks formally to elders (respect language). Never the butt of a joke (likeness rules, 7.4) |
| **Nani** | First patient (at home, in bed, where her *Arre re!* is the warm-failure voice); the owner of Simba, Zazu and Kasuku in the vet corner, so she speaks their complaints |
| **Nana** | Patient with a tendency ("always cold"); gives Nani the medicine in the outro |
| **Ma, Ali, the older cousin, baby Isa** (on Ma's lap, once designed) | Patients with tendencies (Ali: too hot, always moving; the cousin: lost something in his ear) |
| **Simba, Zazu** | Vet patients: Simba's thorn, Zazu's wool-knotted tail. On the clinic floor as ambient life otherwise |
| **Kasuku** | Vet patient (a sore wing). On his perch, he imitates *Arre re!* just after your mistake (his existing behaviour, not a task voice) |
| **Big Ma** | Visits with her sewing bag; her **song** calms a sad patient (a care item: "Big Ma sings"), and her wool is Zazu's problem |
| Villagers (generic) | Extra patients, so the waiting room isn't only family |

### 5.3 Opening a place on the map

- **The clinic** appears in the fog during Ch4's intro beat (Nana points down the lane) and opens on first visit. Icon: a door with a stethoscope on its sign.
- Its hub dressing after each visit: stickers on the waiting-room wall, the thank-you shelf fills, décor bought with pocket money.
- **Arc 5:** the village courtyard gains the doctor's table under the neem tree (a dressing layer on the Find it courtyard scene).

### 5.4 Free play

| Route | What |
|---|---|
| **Open clinic** | Patients keep arriving (family, villagers, the cats, Kasuku) with complaints drawn from the player's weakest words; **"Close the clinic"** always in the sidebar, leading to the usual summary and pocket money (Cook's open kitchen pattern) |
| **One patient** | A single visit, 60–90 s (Farah) |
| **You're the patient** | One minute in the chair (M14): a random visible hurt or a cold, the doctor's two-way questions, a plaster in the design you choose |
| **Explore** (no rows) | Tap any part of any patient: they name it and react (giggle, sneeze, wiggle toes). Tapping to hear a word is free here. Layla and a parent point and name together |
| **Doctor Nani** (Grandparent mode) | See M11 |
| **Clinic lab** | Every mechanic, patient and level on its own, with the leak bot (section 8.3) |

---

## 6. Learning design

### 6.1 Words and frames it drives

| Stage | Words | Frames (existing Kutchi or placeholder) |
|---|---|---|
| **S4 body** (big parts first) | head, tummy, arm, leg, hand, foot; face close-up: eye, ear, nose, mouth, tooth, throat; later: neck, shoulder, back, chest, elbow, knee, finger, toe | `[EN: My {part} hurts]` · `[EN: Where does it hurt?]` · `[EN: Does it hurt here?]` · **`[EN: Is it the {X}, or the {Y}?]`** (M13, one frame for parts, feelings and care) · `[EN: The {X}.]` (the short answer) · *yes* / *no* |
| **The doctor's lines** | — | `[EN: You first]` · `[EN: Will you help me?]` · `[EN: Let me see]` · `[EN: Bring me the {care}]` · `[EN: All better!]` · `[EN: Well done, helper]` |
| **S4 feelings and body states** | hot, cold, just right, tired, sneezy (*a cold*), better; happy, sad | `[EN: I'm {feeling}]` · `[EN: How do you feel?]` · `[EN: still {feeling}]` · `[EN: too {feeling}]` · `[EN: I feel better]` |
| **S4 health and care** | plaster, bandage, cool cloth, blanket, hot-water bottle, ice pack, pillow, tissue, warm drink (*dudh*, *hardar*, *aadu*, *chai* exist) | *Muke {care} khape.* · *Ne {care}.* · `[EN: Get well soon]` |
| **S4 examining** (M6) | torch, stethoscope, forehead strip, tweezers; look, listen | `[EN: look in {part}]` · `[EN: listen to {part}]` · `[EN: open your mouth]` · `[EN: say aah]` · `[EN: breathe in]` |
| **S4 animals** (M9) | paw, tail, wing, beak; cat, parrot, hen, goat | `[EN: {owner}'s {part} hurts]` (possessive) |
| **S3 review** | Nana, Ma, Nani, Ali, *[EN: auntie]*, *[EN: uncle]* (Round 1, Q10); left, right | `[EN: {name}, come]` · `[EN: Who's next?]` · `[EN: the left {part}]` |
| **S1 review** | numbers 1–10 (wrap count, hiccup count); greetings | *Salamun alaykum / Wa alaikum salaam* · *Aabhar aanjo* · *Achija* · *Arre re!* · *Ghan* · *Muke hikdo {x} dine* |
| **S5 (Arc 4)** | fell, bumped, (past tense) | `[EN: I fell]` · `[EN: I bumped my {part}]` |

**Syllabus coverage.** S4's domains are body, health, feelings, weather, times of day and animals. The clinic carries **body, health, feelings, hot/cold, and animals (vet)**. **Times of day** belong to Find it (M9 "Nani's day") and Monsoon rush; **"it's raining"** to Dress up and Monsoon rush. S4's "present and habitual" appears as *[EN: it hurts]* (present) and tendencies Nani mentions (*[EN: Nana is always cold]*, habitual) once the family gives the frame.

### 6.2 Word-stage fading (one place only)

| Word stage | Intro card and ladder row | On the patient |
|---|---|---|
| 1 New | Text + speaker; the patient says it and **the part twinkles in time** (pulse sync). Feelings: shiver or fan-face shown. Taught, not tested | Tap names it |
| 2 Learning | Text + speaker | Nothing |
| 3 Nearly known | Speaker only, ••• | Nothing |
| 4 Known | Heard once; a replay costs the tick | Nothing |

- **No labels on the body, ever, during a visit.** A label on a body part is the answer. In Explore, tapping names a part.
- Hidden words next to each other share one ••• (the Wave 4 fix), so a two-word part (*[EN: left knee]*) doesn't look longer.
- Counts: a digit only while the number word is at stage 1–2; silent from stage 3.

### 6.3 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | The patient says it again (tap the row speaker, or their face) | Free the first time; after that the tick (Relaxed) or comfort drain (Busy) |
| 2 Slow replay | Half speed, a pause before the key word | Tick / comfort |
| 3 Ask the doctor | *[EN: Is it the {X}, or the {Y}?]* (M13). Automatic at levels 1–2 (the level's scaffold, free); from level 3 it's the **"?" button**. Replaces the old "warmer" gesture | Free at levels 1–2; from level 3: tick (Relaxed) / comfort (Busy) + the combo breaks |
| 4 Reveal | The row's Kutchi text (never English) | That row's ear star, from stage 2 |
| 5 Translate | English gist | That row's ear star |
| 6 Shown | The part twinkles (automatic only at stage 1; otherwise after 2 misses on a row) | That row's ear star; the word doesn't advance |

- **Hesitating never shows the answer.** After about 8 s the patient says it again (rung 1, free the first time). Nothing glows.
- **No upgrade makes a hint cheaper.**

### 6.4 Levels (data; level 1 is gentle for the hands, varied for the ear)

*(Revision 2: the ladder is R2.3; this table keeps the knobs.)*

| Knob | Level 1 | Level 2 | Level 3 | Level 4 (Arc 4+) |
|---|---|---|---|---|
| **Visit types** (R2.2) | V0, V1 all fine, V3 | + V1 with finds, V2, V4 (free play) | All; Busy | All; the doctor away for the last patient |
| Calls per check-up (M15) | 4–5, a tap; one word each | 4–6, with an instrument verb | 5–6, with sides | 6 |
| Rows per named patient | 1 (part) + care named | 2 (part + feeling) | 2–3, one can be a "not" (*[EN: not that knee, the other one]*) | + a past-tense row |
| **Treatment slots** (R2.5) | 1: the item | 2: + count or colour | 3: + side; the figure-of-eight path; drops | + order (*first… then*) |
| **The doctor's question (M13)** | Only on "?" (costs the tick) and in V0 | Only on "?" | Only on "?" | *[EN: Did you fall, or bump it?]* as a V3 row |
| Parts in play | Big parts: head, tummy, arm, leg, hand, foot | + face close-up (6) | + neighbours (elbow/knee, finger/toe, shoulder/neck), **left/right** | all |
| Care | Named by the patient; trolley of 5 | Chosen from the feeling (2 valid); trolley of 7 | Trolley of 9; "pass me" mid-care | — |
| Just right (M4) | — | 1–2 steps | 1–3 steps, two patients at once in Busy | — |
| Waiting room (M7) | One patient at a time, no call | 2–3 waiting, called by name | Busy: 2 benches, comfort rings | — |
| Gentle hands | Tap to place, one drag | + wrap *n* times | Tighter green bands | — |

### 6.5 Mistakes: a recast, then try again

| Mistake | Response | Then |
|---|---|---|
| Wrong part | The patient giggles ("that tickles!"), Kasuku squawks *Arre re!*, then the patient: *[EN: {tapped part}? No, my {target} hurts]* | The player finds it; nothing is shown |
| Wrong care | *[EN: No,]* *Muke {target care} khape* (level 1) or *[EN: I'm {feeling}!]* again (level 2+) | The player picks again |
| Wrong adjustment | *[EN: Too hot now!]* with a fan-face | Take one off |
| Wrong patient | They wave shyly: *[EN: It's not my turn]*; the doctor says the name again | Tap again |

A miss costs that row's ear star and marks the word as a miss (two misses in a row drop it a stage). **Spaced retrieval:** patients' rows are due words plus up to 2 new ones, weakest first; "pass me" asks for a met word not in the current complaint; the end-of-morning word review lists every Kutchi word heard.

### 6.6 Role reversal

*(Revision 3: every moment below where the child produces a word is now a speaking moment on `tell` with closed-set recognition, the pills as the fallback and a voice star; R3.4 has the closed sets.)*

- **M11 Tell the doctor** (story and free play): you see the hurt; choose the chunk *[EN: Nani's] + [EN: head] + [EN: hurts]* from audio pills of one look-alike group. Readers see text only at the reads stage.
- **You're the patient (M14, revision R5):** the hurt is shown in first person (the lap view); the doctor asks *[EN: Is it your knee, or your hand?]* and you answer with one of two audio pills, then *yes*/*no* to his probe. The optional "say it" step is shadowing with a parent's ✓ (speaking stage 1); no speech is graded by the app.
- **Doctor Nani** (Grandparent mode): the app shows Nani a part in big Kutchi text; she asks the child *[EN: where's your nose?]*; the child touches their own nose; she taps ✓. This is TPR in the room, and it needs no recording.
- **Instructing the patient** (M6, later): pick *[EN: open your mouth]* or *[EN: say aah]* and the patient does it (or does the wrong funny thing if you picked wrong).
- Relations stored as data (platform item 5): a complaint is `{who, part, side, feeling, care}`, so any visit can be flipped.

### 6.7 Needed from the family (English placeholders until then)

This would be **Round 3 (body and health)**. None of it has been asked yet.

| Need | Priority | Notes |
|---|---|---|
| **The doctor's calls (Revision 2):** *Check the head* · *Now the knee* · *The knee again* · *The other one* · *Let's check everything* · *Nothing wrong there* · *That's it!* | **1: blocks M15** (every check-up and mystery) | One imperative frame with a part slot, plus the four little words that chain calls (*now, again, the other one*). Whether "check the {part}" changes with the part's gender or number: record the six big parts whole (G108–G109, G113) |
| **The check kit:** *Listen to the chest* · *Look in the ear* · *Open your mouth, say aah* · *Take the temperature* · *He's hot* · *Tap the knee* | **1: blocks level 2** | G110–G111 |
| **The mystery:** *I don't feel well* · *I don't know why* | 2 | G112; the V2 patient's only line |
| **Treatment lines:** *Wrap it round twice* · *Round the foot, round the ankle* · *The green bandage* · *The red one* · *Two drops in the left eye* · *One drop in the right ear* · *Bring me the green bottle* · *Two of the small ones* | **1 for the bandage lines** (level 1–2); 3 for drops and the dispensary | G114–G117; colours are E60–E71; counts exist |
| **Left and right on the child:** *Show me your left hand* · *Does your left knee hurt?* | 3 (level 2 in the lap view; Doctor Nani) | G118–G119; whether the family says left/right or *this side/that side* is A5 |
| **"or"** and the two surviving question forms: *Is it your knee, or your hand?* (to the child) | 2: the "?" rung and M14 | G94, G96. G95, G97 and G105–G107 are retired |
| **Short answers:** *The knee.* · *This one.* · **yes** · **no** | **1: blocks M14** | G98; yes/no are still Cook's placeholders (A8.1, A4.4) |
| **The doctor's lines:** You first · Will you help me? · Let me see · Bring me the blanket · All better! · Well done, helper | 2 | G99–G104; whose voice records them is decision 2 in the revision |
| **"My ___ hurts"** for head, tummy, arm, leg, hand, foot | **1: blocks M1** | Does the verb or the "my" change with the body part's gender or number? Does it need a word before the part (like Gujarati *maru*)? Record whole phrases if so (G41) |
| Body parts: eye, ear, nose, mouth, tooth, throat, neck, shoulder, back, chest, elbow, knee, finger, toe | 1 | With gender and plural (two eyes, two knees) |
| **hot, cold** (asked: Round 1, Q11) + *just right, still, too* | **1: blocks M4** | "I'm cold" vs "it's cold": which form does a person use? |
| Care words: plaster, bandage, cloth, blanket, pillow, tissue, hot-water bottle, ice | 2 | What the family actually uses at home |
| Feelings: tired, better, happy, sad, (scared: question 6); "I have a cold", sneeze, cough | 2 | |
| Frames: "Where does it hurt?", "How do you feel?", "Does it hurt here?", yes, no, "Who's next?", "___, come", "Get well soon", "It's not my turn", "that tickles!" | 2 | *yes/no* also unblocks Cook |
| left, right | 3 | Level 3 |
| Possessive: "Simba's paw", "Nana's knee" | 3 | Links Round 1, Q1 |
| Animal parts: paw, tail, wing, beak; the words for cat, parrot, hen, goat | 3 | |
| Examining nouns: torch, stethoscope, thermometer, dropper, tweezers (the verbs are in the check kit above) | 2 | M15's kit; T11 |
| **What the children call the doctor** | 1 | His name or a title (E102; revision decision 1) |
| **Nani's own home remedy** for a cold | 2 | For the Cook hand-off (*hardar dudh*? ginger chai?) |
| Past tense: "I fell", "I bumped my ___" | 5 | Arc 4 |
| Recording estimate | — | About 20 parts × one "hurts" phrase and one "check the ___" call each (two long takes), 10 feelings, 10 care nouns, about 35 frames (the calls, the check kit, the treatment lines; the part slot is either recorded per part or joined from two halves by the engine: test which sounds natural): about 90 items, one evening. The doctor's own lines are a separate short session if he records them |

---

## 7. Stars, rewards and upgrades

### 7.1 The three stars (per patient)

| Star | Icon | Earned when |
|---|---|---|
| **Understood** (ear) | Ear | Right patient, right part (and side), right care, right adjustments, right count, all on the first try. Hints that show the answer cost it (6.3) |
| **Said it** (voice; Revision 3) | Mouth | The speaking moment's first try accepted by the recogniser or a grown-up (R3.4). Separate from the ear: speaking never earns or costs the ear star; tapping the pills earns no voice star. Shown only on visits with a speaking moment |
| **Gentle hands** (this mode's craft star) | **A sticking plaster with a small star** | Plaster on the sore spot, bandage wrapped neatly, cloth lifted on the green, blanket tucked, the warm drink handed over while it's warm |
| **No help** / **Quick** | Tick (Relaxed) / lightning (Busy) | No hints or reveals / seen before their comfort ring ran out |

Add `star_sets.clinic` to the shared star data (ear / voice / plaster / tick / bolt), next to Cook's chef's hat and Find it's magnifier; held in `data/clinic.json` until the shared data lands (R3.9).

### 7.2 Pocket money and collections

- The receipt as in Cook: **5** for helping, **+5** ear, **+3** gentle hands, **+3** tick or lightning, a **perfect-patient combo**. Money is never lost.
- **Sticker album:** one sticker per patient the first time you help them, and one per silly case (*Pokémon Snap*'s Photodex, Papa's stickers). The album shows empty outlines of cases not met yet (curiosity).
- **Thank-you shelf** in the clinic: each regular patient's small gift (Nana's old coin, Big Ma's button, Ali's marble, a feather from Kasuku). It fills the place (cosy progression).
- **Plaster designs:** bandhani dots, ajrakh, mirror-work, an Eid moon: unlocked by album pages. Cosmetic only; they never touch the listening (Maryam).
- **Quilt patch:** a stethoscope (Arc 3 Ch4).
- **"Helped the doctor on N days"**: a count that never resets (no breakable streak).

### 7.3 Upgrades (the clinic's own shop; they never listen for you)

| Upgrade | Effect | Trade-off |
|---|---|---|
| Plaster dispenser | Plasters come ready-peeled (one step fewer) | Cheap; everyone wants it |
| Warm flask | Drinks stay warm longer (a wider green band) | Only useful once warm drinks are unlocked |
| Second examination bench | Two patients at once | Expensive; pays off in Busy and the open clinic |
| Toy box on a kigoda stool | Comfort rings drain more slowly in the waiting room | Takes a waiting-room slot (the room has 3 décor slots: toys, plants, Big Ma's chair) |
| Bigger trolley | More care items, so more kinds of complaint, more coins and harder listening | The Find it "bigger bag" pattern |
| Brighter torch | Examining is quicker (M6) | Only after M6 |
| Clinic décor (mirror-work cushions, a plant, a fan) | The room looks yours | Uses the same 3 slots as the toy box |

**No upgrade here** (a card in the shop, like Cook's sugar): *"Where it hurts is your ears' job."* Never: a labelled body chart, a helper who says where it hurts, a thermometer with a readable display, a trolley that sorts itself.

### 7.4 Keeping it gentle (the safety rules, as a checklist)

- [ ] No needles, drips, surgery, blood or bone-setting. A hurt is a small soft pink swirl, drawn in code.
- [ ] The player never gives medicine. They fetch it or mix it and **hand it to the doctor**, who checks it aloud and gives it (Zafar, R3.1); he gives it only to adults; its bottle is closed and never shows a dose.
- [ ] Nobody gets worse while waiting, nobody leaves, nobody cries (sad is a droopy face at most); every visit ends with the patient smiling.
- [ ] Remedies are comfort care that a family does at home anyway: a plaster, a blanket, a cool cloth, a warm drink, rest, a song.
- [ ] Nothing in the game says a care *cures* an illness. The doctor says *[EN: get well soon]*, not "this will fix it".
- [ ] Only the body parts listed in 6.1.
- [ ] No red cross or red crescent anywhere.
- [ ] A short parents' note in settings: "pretend play; for real illness, see a doctor".
- [ ] **The doctor's likeness (revision R8):** always competent, kind and in charge; the comedy is in the patients and the cats, never in him; no gags at his expense and no exaggerated features; his sheet is signed off by Zafar and Hannah and is the only reference after that; his name in the game and his voice are the family's decisions.

---

## 8. Engineering spec for the builder

### 8.1 Data model (`data/clinic.json` plus per-patient hotspot files)

```json
{
  "words": {
    "body-head": {"kutchi": null, "english": "head", "group": "big", "src": "placeholder"},
    "body-knee": {"kutchi": null, "english": "knee", "group": "limb-joint", "sided": true},
    "care-blanket": {"kutchi": null, "english": "blanket", "warmth": 1, "gesture": "tuck", "image": "blanket-f"},
    "feel-cold": {"kutchi": null, "english": "cold", "adjust": "+warmth"}
  },
  "lines": {"hurts": {"e": "My {x} hurts."}, "feel": {"e": "I'm {x}."}, "come": {"e": "{x}, come!"},
            "ask": {"e": "Is it the {x}, or the {y}?"}, "answer": {"e": "The {x}."}, "yourAsk": {"e": "Is it your {x}, or your {y}?"},
            "need": "@cook.need", "give": "@cook.give", "oops": "@cook.oops", "thanks": "@cook.thanks"},
  "grammar": {"hurts": {"frame": "hurts", "agree": null}, "side": "{side} {x}", "owner": "{owner}'s {x}"},
  "lookalike_groups": {"groups": [["body-eye", "body-ear", "body-nose"], ["body-hand", "body-foot"],
                                  ["body-knee", "body-elbow", "body-shoulder"], ["body-finger", "body-toe"],
                                  ["care-cloth", "care-ice", "care-tissue"], ["care-blanket", "care-pillow", "care-bottle"]]},
  "patients": {
    "nana": {"kind": "person", "pose": "patients/nana-seated", "hotspots": "data/patients/nana.json",
             "tendencies": {"feel": {"feel-cold": 0.6}}},
    "simba": {"kind": "cat", "owner": "nani", "pose": "patients/simba-table", "hotspots": "data/patients/simba.json"}
  },
  "visits": {
    "hurt": {
      "slots": {"part": {"from": "$partsForLevel", "prefer": "weak", "maxShare": 0.25},
                "side": {"byLevel": [null, null, {"pick": ["left", "right"]}]},
                "care": {"from": "$caresFor.part", "pick": 1},
                "feeling": {"byLevel": [null, {"pick": ["feel-cold", "feel-hot"], "taste": "feel", "tasteChance": 0.5}]},
                "start": {"byLevel": [null, {"int": [1, 2]}, {"int": [1, 3]}]}},
      "say": [{"frame": "hurts", "x": [{"side": "$side", "of": "$part"}]},
              {"if": "!feeling", "frame": "need", "x": ["$care"]},
              {"if": "feeling", "frame": "feel", "x": ["$feeling"]}],
      "run": [{"do": "where", "part": "$part", "side": "$side"},
              {"do": "care", "want": "$care", "feeling": "$feeling"},
              {"do": "apply", "gesture": "@care.gesture", "at": "@where.spot"},
              {"if": "feeling", "do": "warm", "start": "$start", "direction": "$feeling"}]
    }
  },
  "mechanics": {"ask": {"levels": [{"pair": "far", "answered": true}, {"pair": "lookalike", "answered": false}, {"onRequest": true, "cost": "tick"}],
                        "frame": "ask", "order": "random", "never": ["lastPatientPart", "ruledOut", "lastOption"]},
                "you": {"pov": "lap", "parts": "$visibleParts", "rows": ["ask-pills", "probe", "ask-feel?"], "pills": {"text": "readsStageOnly"}, "sayIt": "stage1-shadow"},
                "where": {"levels": [{"parts": "big", "closeup": false, "minHitPx": 160}, {"closeup": true}, {"sided": true, "neighbours": true}]},
                "care": {"levels": [{"trolley": 5}, {"trolley": 7}, {"trolley": 9, "passMe": 0.4}]},
                "warm": {"levels": [{}, {"steps": [1, 2]}, {"steps": [1, 3]}]},
                "queue": {"levels": [{"waiting": 1}, {"waiting": [2, 3]}, {"waiting": [3, 4], "benches": 2, "comfort": true}]},
                "apply": {"levels": [{"band": [0.55, 0.85]}, {"wrapCount": true}, {"band": [0.62, 0.8]}]}},
  "days": [{"id": "arc3-ch4", "patients": [{"who": "cousin", "visit": "hurt", "fix": {"part": "body-knee"}},
                                           {"who": "hen", "visit": "vet"}, {"who": "villager-1", "visit": "hurt", "fix": {"feeling": "feel-cold"}}]}],
  "upgrades": [], "star_sets": {}, "tips": {}
}
```

**Hotspot file** (`data/patients/<id>.json`), authored in the lab's hotspot editor, checked by `build/check_hotspots.py`:

```json
{"pose": "patients/nana-seated.webp", "mirror": true,
 "parts": {"body-head": [[x, y], ...], "body-knee.left": [[...]], "body-tummy": [[...]]},
 "closeup": {"rect": [700, 90, 260, 260], "scale": 2.6, "parts": ["body-eye", "body-ear", "body-nose", "body-mouth", "body-tooth", "body-throat"]},
 "spots": {"body-knee.left": [812, 690]}, "neutral": "idle", "expressions": ["ouch", "giggle", "sneeze", "ahh", "cold", "hot", "happy"]}
```

- `mirror: true` builds right-side polygons from left-side ones (front-facing, symmetric poses).
- **Sides are the patient's own left and right** (they face you), and the patient always says them in first person (*my left*; Zafar, R3.1). The playtest item is now whether 7-year-olds manage the rotation at level 3, not whose side it is.
- `closeup` reuses the same pose image, stored at 3× so the zoom stays sharp: no new art.

### 8.2 What's reused, and what's new

| Reused (from Cook) | Used for |
|---|---|
| The recipe engine: slots, `say`, `run`, `byLevel`, `taste`/`tasteChance`, `prefer: weak`, the ladder rows (`R.ladder`) | A visit is a recipe; a patient is a customer; tendencies are tastes |
| `Cook.Mech.define`, zones, `z.listen`, `z.skill`, `z.expect`, levels as data | Every clinic mechanic |
| Word pills, the intro card and sidebar (Wave 5), stars shown as they happen, the receipt, the word review, completion cards | As they are |
| Pass me with look-alike groups; help costs; recasts; greetings; Relaxed/Busy; the open kitchen's "close" flow | As they are |
| `S.ring` (lift on green), Stir's circular track (wrap), the pour drag (peel and stick), knead press (dab cream) | M3 gestures |
| `js/progress.js` understand/produce stages | Fading and M11 |
| `build/test_cook.py` harness (real pointer events, tap-cover check, six sizes) | `test_clinic.py` |

| Reused (from Find it, once built) | Used for |
|---|---|
| Hotspot hit-testing with padding and snap-to-nearest | Body parts |
| The non-speaker bot framework (Search lab) | The clinic leak bot |
| Scene JSON with relations; the courtyard and bedroom scenes | The Arc 5 village clinic; Nani's bed at home |

| New building block | What it is | Size |
|---|---|---|
| **Body map** (`body.js`) | Loads a patient's hotspots, mirrors sides, pads hit areas to one size, the face close-up with a player-opened magnifier, the sore swirl | Medium |
| **Patient** (`patient.js`) | Seated pose, head-layer expressions, reactions (giggle, ahh, sneeze, shiver at stage 1 only), a blanket stack drawn in code | Medium |
| **Warmth loop** (`mechanics/warm.js`) | State = steps from "just right"; each action changes it; the patient speaks the new state; Done | Small |
| **Queue** (`queue.js`) | Bench seats shuffled, calls, one or two benches, comfort rings (Busy), no one ever leaves | Medium |
| **Chunk picker** (`mechanics/tell.js`) | M11: audio pills from one look-alike group, text only at the reads stage; at level 1 it's M13's two-way question with two pills | Small (reuses the choice pill) |
| **The doctor's question** (`mechanics/ask.js`) | M13: one line frame with two slots filled from any word list; random order; the pool rules from R4 (far, then look-alike; never the last patient's part, a ruled-out option or the last option left); plays the patient's answer at level 1; bound to the "?" button with a cost at level 3; a `lastAsked` record for the leak bot | Small |
| **You're the patient** (`mechanics/you.js`) | M14: the lap view scene, the doctor leaning into frame, the two-way audio pills, the probe hand and yes/no pills, the plaster-design picker, the optional say-it recorder (Game Design speaking stage 1: record, play back beside the family's file, a parent taps ✓; nothing leaves the device) | Small–medium |
| Hotspot editor (lab only) and `build/check_hotspots.py` | Draw polygons on a pose; check minimum size per screen size, overlap, mirroring | Small |

**Code location.** Cook's engine lives in `js/cook/` under the `Cook.*` namespace. The cheapest honest route is to build the clinic's mechanics on that engine, and move the shared parts into a common folder as part of platform item 1 ("one app, one save"), in step with whatever Find it extracts. Don't copy-paste the engine.

### 8.3 The lab and the tests

**Clinic lab** (title screen, like the Station lab): any mechanic × any patient × level 1–3, a random visit each time; "Nani helps" tick; **hotspot overlay** toggle (dev); **bot** dropdown (below); a "safety view" that lists the patient's current expression and the visible cues, for the Sceptic check.

**The leak bot** (the wife's test as code): a player that sees only the screen and the audio file names' *durations*, never the words. Strategies:

| Strategy | What it tries |
|---|---|
| Random | Any part, any care |
| Salience | The biggest or most central part (tummy, head) |
| Frequency | Remembers which parts and cares were right in earlier rounds and picks the most common |
| Slot memory | The trolley slot that was right most often |
| Repeat | Whatever was right last visit |
| Duration | Maps the row's audio length to parts it has seen before |
| Wait | Taps nothing until something glows (must end with the ear star lost) |
| Visual cue | Reads the patient's pose and expression, the worn blankets, the thermometer |
| Probe | In M5, presses everything |
| Kinship | In M7, taps whoever moved or was last to speak |
| Second option | In M13, always the first (or always the second) option the doctor names |
| Echo | In M13, picks the option whose audio duration matches the complaint's key word (sound matching without meaning) |

**Pass:** every strategy earns the ear star in **fewer than 10%** of visits, over 500 visits per mechanic per level, per strategy. A **fair bot** that knows the answers must earn it in 100%. Placeholder English rows are flagged "not yet a Kutchi test" in the report (they can't fail for the right reason).

**The harness** `build/test_clinic.py` (from `test_cook.py`): plays every mechanic at levels 1–3, a full clinic morning, Arc 3 Ch4, and the open clinic; deliberately makes mistakes (wrong part, wrong care, wrong patient) so every recast runs; six sizes (phone 915×375, 1366×768, 1440×900, 1280×800, iPad landscape and portrait); the tap-cover check before every tap; **a hotspot-size check**: at level 1 every part's hit area is at least about 2 cm on the iPad and opens zoomed on the phone. Claude reviews the screenshots.

### 8.4 File layout (until the one-app shell exists)

```
clinic.html
js/clinic/flow.js          the clinic morning, open clinic, one patient
js/clinic/body.js          hotspots, sides, close-up, sore swirl
js/clinic/patient.js       pose, expressions, reactions, blanket stack
js/clinic/queue.js         bench, calls, benches, comfort
js/clinic/mechanics/       one file per mechanic (R3.3): check.js, where.js, care.js, stick.js, wrap.js (turns + the figure-of-eight path), lift.js, tuck.js, warm.js, drops.js, handover.js, call.js, you.js, tell.js, ask.js (later: echo.js); Cook's pour, stir, count, fetch, passme, knead are called by id, never copied
js/clinic/stations/        visit.js (calls → where? → care → apply → handover), dispensary.js (fetch → handover; later pour + count + stir → handover)
js/clinic/stubs/           speech.js, which.js, overlay.js: same signatures as the shared pieces, swapped out in phase 3
js/clinic/visit.js         the visit generator (pure logic; runs in Node for build/leak_clinic.mjs)
data/clinic.json           words, lines, grammar, patients, visits, levels, upgrades, stars, tips
data/patients/<id>.json    one hotspot file per patient pose
data/scenes/clinic.json    bench, examination bench(es), trolley, door, perch, décor slots
build/test_clinic.py       harness (+ --bot <strategy>, --rounds 500)
build/check_hotspots.py
assets/clinic/             backgrounds, poses, items (WebP)
```

---

## 9. Scene, art and assets

### 9.1 Cameras

| Scene | Camera | Notes | Used in |
|---|---|---|---|
| **Clinic room** | **E**, horizon about 55% | Waiting bench on the left, the examination bench centre-right with the patient **seated, full body, facing you** (feet visible for knee and foot), a window with rain, a shelf, the door. One screen wide | Every clinic round |
| Face close-up | **E**, the same pose at 2.6× | Opened by the magnifier; no new art | Level 2+ |
| Care trolley | **F** items in a row along the bottom edge (the carried-container rule: under 22% of screen height) | Items in front view, like the bazaar and pantry; shared view | Every visit |
| Nani's bedroom (home) | **E** | Nani in bed, upper body above the blanket; reuse Find it's Arc 4 bedroom with a bed variant | Arc 3 Ch4 beats |
| Village clinic | **E** | Find it's courtyard + a table and charpai layer under the neem tree | Arc 5 |
| Vet | **E**, the animal sitting on the examination table | Cats drawn large on the table (tap targets) | M9 |
| **You're the patient (the lap view)** | **First person, looking down** | Your own knees, feet and resting hands (the existing hand set, skinned per character), the bench edge; the doctor leans into the top of the frame. The scuff and the plaster are drawn in code | M14 |

The art bible's line for the clinic ("T for the table; E for the patient") changes to **E for the patient, F for the trolley**. A T table isn't needed, because care is applied on the patient. Please update the art bible (question for the orchestrator, not a file this doc edits).

**Breaking the layout contract on purpose:** characters usually stand behind a counter, upper body only. Clinic patients sit **full body** on the examination bench, so knees and feet can be treated. The bench is the "counter" for the waiting room, whose people are seen from the waist up behind the bench's back rail.

### 9.2 Layers and ambient motion

| Layer | Why |
|---|---|
| Background with **no painted patient, blanket or care item** | Everything changes per visit |
| Patient pose (full body), **head as a separate layer** with expression frames | Reactions without redrawing the body |
| Blanket (one draped sprite), stacked in code with small offsets and tints | The four-blanket joke, with no art per patient |
| Care items on the patient: plaster, bandage (code-drawn stripes along the limb's axis in the hotspot data), cool cloth, ice pack, hot-water bottle | Placed on the `spots` |
| Sore swirl (code) | No blood, no drawn injuries |
| Waiting-room people (upper body behind the bench rail), comfort ring (code) | Queue |
| Trolley: back, items, front rim | Carried-container contract |
| Kasuku on his perch, head layer | Existing pose set |
| Ambient: rain on the window (particles, the asset plan's monsoon drip sprites), a ceiling fan, steam from the warm drink, Simba asleep on a mat, the doctor's desk clock | 2–4 moving things, off with "reduce motion" |
| Arc dressing: monsoon umbrellas by the door, Eid bunting in a later visit, the village courtyard | Reuse across arcs |

### 9.3 Hand poses

| Pose (asset plan) | Camera | Used for | Status |
|---|---|---|---|
| C4 pointing | E | Tap the part (the default) | Exists (T, E) |
| C1 pinch | E | Peel and stick a plaster; tweezers (M6); the stethoscope's chest piece | Exists |
| B2 vertical grip | E | Torch (M6) | Exists |
| D2 C-shape hold | E | Hand over the warm drink | Exists |
| B5 hook grip | E | Hot-water bottle by its loop | Exists |
| A3 palm up | E | Receive the thank-you gift; hand over the medicine bottle | Exists |
| E1 thumbs up, A5 wave | E | End of visit, goodbye | Exist |
| **A1-E flat palm, forward** | E | **New:** press a cool cloth on a forehead; tuck a blanket | New pose (A1 exists in T only) |
| **C2-E tripod** | E | **New:** the forehead strip; dabbing cream | New pose (C2 exists in T only) |
| Bandage roll | — | Drawn without a hand: the roll sprite follows the finger round the limb | No pose |

**Nani's set (N):** A1 (on Nani's own forehead in the intro beat, from her set).

### 9.4 New art, with reuse flagged

| Asset | Count | Reuse | Made with |
|---|---|---|---|
| Clinic room background (E, empty bench, rain window) | 1 | Arc dressings as layers | ChatGPT (free) |
| Nani's bed variant of the Arc 4 bedroom | 1 layer | **Reuses** Find it's bedroom | ChatGPT (free) |
| Village clinic table + charpai layer | 1 layer | **Reuses** Find it's courtyard | ChatGPT (free) |
| **The doctor**: character sheet from photos | 1 | Sheet-first rule | ChatGPT (free), Zafar signs off |
| Doctor poses: neutral, talking (the *or*-question, gaze on the patient, hands folded), big laugh, **leaning in** (M14, from below), a hand reaching to press (the probe), listening with a stethoscope, holding the bottle, waving, thinking | about 9 | From the sheet; the old "pointing up/down" pose is dropped with the warmer hint | **API edit** |
| **The lap view** (first person, seated: knees, feet, the bench edge; boy and girl variants in the game's skin tone; hands composited from the hand set) | 2 | New | ChatGPT (free) |
| Seated full-body patient poses: Nani (in bed), Nana, Ma, Ali, the older cousin, 2 villagers, a village child | 8 | From each sheet; Nana, Ma and Ali are waiting for their sheets anyway | API edit |
| Patient head expressions: ouch (mild), giggle, sneeze (2 frames), ahh, cold (stage 1), hot (stage 1), happy | about 8 per patient, 64 in all | `build/expressions.py` in-place edits | API edit |
| Animals on the table: Simba, Zazu (sitting, from the cat sheets), Kasuku (existing perched pose), the hen (Arc 3 animals sheet) | 3 new poses | **Reuses** the cat, parrot and hen sheets | API edit |
| Items, F view: plaster tin, plasters (4 designs), bandage roll, cool cloth in a bowl, ice pack, blanket, pillow, hot-water bottle (knitted cover), tissue box, warm drink glass (reuse Cook's chai glass), torch, stethoscope, forehead strip, tweezers, the doctor's bag, a medicine bottle, honey jar, pickle jar, sticker sheet, thank-you gifts (4) | about 26 | Chai glass and jars shared with Cook | Two 4×4 grids in ChatGPT (free); glass and steel via the API's native transparency (art bible magenta rule) |
| Hands | 2 poses × 3 reskins = 6 | Asset plan pipeline | API (in the planned hand run) |
| Map icon (the clinic door with a stethoscope sign) | 1 | — | ChatGPT (free) |
| UI icon: the plaster star | 1 | — | CSS or SVG |

**Rough cost:** about 90 images: 30 from free ChatGPT, 60 by API edits (poses, expressions, hands): about **$5–15** at the pipeline's rates. The expensive part is time on the doctor's likeness and on consistent seated poses, not money.

---

## 10. Persona loops

### Loop 0: the draft

The first draft had: patients **holding their sore part** (for charm); care **fixed by body part** (knee = plaster, head = cool cloth); the face close-up **opening by itself** when a face part was asked; **shivering and sweating always visible**; a **colour thermometer**; left/right from level 1; a clinic morning of 5 patients (about 6 minutes); **injections** as an examine mini-game (as in *Toca Doctor*); "who's next" by **choosing whoever looks most unwell**; waiting patients who **got worse**; Kasuku's echo in the first set; and "where does it hurt" at home as a **full errand** before the clinic errand.

### Loop 1

| Persona | Plays, says, struggles |
|---|---|
| **Layla, 5** | Loves the giggle when she taps the wrong place and taps the tummy again on purpose. Can't hit the ear on the phone ("I pressed it!"). The injection makes her pull the tablet away. The sweaty, shivering Nana worries her: "is he poorly?" Can't do left/right |
| **Zayn, 8** | One patient at a time is slow; he wants two at once and a record. Spots that knee means plaster every time: "easy" |
| **Maryam, 11** | Likes the doctor looking like a real grandad. Wants the clinic to be hers: "can I choose the plasters?" |
| **Zafar, 38** | One line per patient is little Kutchi per minute. The care step teaches nothing once he knows part → care |
| **Farah, 34** | Six minutes is too long for a bus stop |
| **Nani, 68** | "That's not how you say *my head hurts*": the frame will change with the part. Wants her own remedy in it |
| **The Sceptic** | Wins the ear star by: (1) tapping where the patient's hand is; (2) the auto-zoom telling her it's a face part, then guessing among 6; (3) knee → plaster; (4) shivering → blanket; (5) the thermometer colour; (6) tapping the tummy (asked most) |
| **The Builder** | Full-body seated poses per patient are the cost. Hotspot polygons by hand in JSON will be wrong. Left and right need drawing twice |

| Finding | Change |
|---|---|
| Hand on the sore part gives it away | Neutral, symmetric idle pose; the sore swirl appears only after the right tap |
| Auto-zoom narrows the answer to the face | The magnifier is always there and only the player opens it; tapping it isn't a wrong answer |
| Care fixed by part | Every part accepts at least two cares; the patient names the care (level 1) or says a feeling (level 2+) |
| Shivering and sweating always visible; colour thermometer | Body-state visuals only while the feeling word is at stage 1; no readable thermometer (the doctor says the reading) |
| Tummy wins by salience and frequency | Hit areas padded to one size; parts drawn evenly (`maxShare` 0.25), weakest words first |
| The injection frightens Layla (and the Teddy Bear Hospital evidence) | No needles or procedures at all; care is comfort care; safety checklist 7.4 |
| "Poorly Nana" worries Layla | Unwell faces are mild; nobody gets worse; every visit ends happy |
| Ears too small on phones | Level 1 = six big parts; small parts only in the close-up; phone opens zoomed |
| Left/right too early | Left/right from level 3 only (children are reliable at about 6–7) |
| Low Kutchi per minute | Level 2 has two rows (part + feeling) and the **just right** loop (M4): three to four more spoken lines per patient |
| Six-minute morning | 3–4 patients (about 4 minutes); **one patient** free play (60–90 s) |
| Zayn: slow, no record | Busy mode with two benches (M7) and a perfect-patient combo; best open-clinic record |
| Maryam: make it hers | Plaster designs, clinic décor slots, the thank-you shelf |
| Nani: the frame may change | Record whole "my ___ hurts" phrases per part until the grammar is known (6.7, priority 1) |
| Builder: hand-typed polygons | A hotspot editor in the lab and `check_hotspots.py`; `mirror: true` for symmetric poses; the close-up reuses the pose at 3× |
| Triage by "who looks most ill" | Replaced by the doctor calling a name (kinship review) |

### Loop 2

| Persona | Plays, says, struggles |
|---|---|
| **Layla** | Explore mode with her dad: "where's Nana's nose?" She taps, Nana sneezes, she shrieks with laughter. Loves Simba on the table. The blanket pile is her favourite joke |
| **Zayn** | Busy two-bench play is fun, but he learns that the comfort ring doesn't really matter: "nothing happens" |
| **Maryam** | The album's empty outlines pull her to find every silly case |
| **Zafar** | Enjoys the just-right loop; wants the doctor to speak more formally to Nana (respect language) |
| **Farah** | One patient is right. Wants to stop mid-morning without losing coins |
| **Nani** | Proud of "Doctor Nani" in Grandparent mode: "I can play the doctor with Layla" |
| **The Sceptic** | (1) In M7 the called patient's face bobs as the doctor speaks, and when only one person waits there's no choice. (2) In M4 she just adds one blanket and presses Done: it's always one step. (3) She notices Nana arrives in two shawls when he'll say "hot". (4) The trolley's warm things sit together on the left. (5) In the story's "tell the doctor", she matches Nani's words from home to the pills |
| **The Builder** | M3's four gestures look like four new mechanics |

| Finding | Change |
|---|---|
| Called patient bobs; one-person queues | The doctor says the call and nobody reacts until tapped; a call only happens with 2+ waiting (otherwise no ear credit) |
| Just right is always one step | Start 1–2 steps away (1–3 at level 3), in either direction, at random |
| Worn shawls predict the feeling | What a patient arrives wearing is random and independent of the feeling |
| Warm items grouped on the trolley | Every slot shuffled per visit; items never grouped by kind |
| "Tell the doctor" is sound matching | **Nani says nothing at home**: you *see* where it hurts (she holds her head, points to her throat); at the clinic you choose the word. Picture → word is real production |
| Comfort ring feels meaningless | In Busy the lightning star for that patient depends on it, and patients left long enough say *[EN: I'm bored]* and fidget (funny, not sad) |
| Respect language | The doctor and the player greet elders with the formal choice (the v2 greeting rule; words from Round 1, Q10–11) |
| Farah stops mid-morning | "Close the clinic" pays for the patients already finished |
| M3 looks like four new mechanics | Each gesture maps onto existing Cook code: lift on green = `S.ring`, wrap = Stir's track, stick = the pour drag, dab = knead press. New art, little new code |
| Doctor Nani is a hit | Promote it to a named Grandparent-mode entry (M11), with no recording needed |

### Loop 3

| Persona | Plays, says, struggles |
|---|---|
| **Layla** | Plays a full level-1 morning with a parent; needs the parent for the trolley at first ("which is the blanket?"), then does it herself by the third patient. No tears, lots of giggles |
| **Zayn** | Level 3: two benches, left/right, the "not that knee" row. "OK, that's hard." Comes back for the combo record and the album |
| **Maryam** | Has a bandhani plaster set and mirror-work cushions in the waiting room; collects Kasuku's feather |
| **Zafar** | Counts about 8–10 Kutchi lines per patient at level 2 (complaint, feeling, recasts, just-right exchanges, thanks, pass me). Asks when the body words will be recorded |
| **Farah** | One patient before work, a clinic morning at the weekend |
| **Nani** | Recognises her remedy in the Cook hand-off; "that's our doctor" |
| **The Sceptic** | Tries: (1) the warmer hint to halve the body, then guesses (still 1 in 3 or worse, and the hint costs her the tick); (2) audio durations: *[EN: left knee]* is longer than *[EN: nose]*; (3) vet animals have fewer parts; (4) the last row of a patient by elimination ("not asked yet"); (5) waiting for help (only a replay comes). **She can't reliably win the ear star** |
| **The Builder** | The seated full-body poses are the long pole; animals reuse sheets; the close-up is free. Asks what to build if the family's words are late |

| Finding | Change |
|---|---|
| Durations separate one-word and two-word rows | Sides only at level 3, where every row can have a side, so durations don't cluster; the bot's "duration" strategy checks it |
| Vet guess rate | At least 6 parts per animal (front paws count as two; ear, nose, tail, tummy) |
| Elimination across rows | Rows within a patient can repeat a part (both knees) and never come from a fixed set |
| Words may be late | Build and tune with placeholders, but the leak report marks those rows "not yet a Kutchi test"; the first family round is **six "my ___ hurts" phrases + hot and cold**, enough to make level 1 real |
| Parents need to know it's gentle | The parents' note (7.4) and no medical claims anywhere |

**Stop check (after loop 3).**

| Question | Answer |
|---|---|
| Can the Sceptic win the ear star? | **No.** Rough bot rates per patient: level 1, one part from 6 (17%) × a care from 5 (20%) = **3%**; level 2, two rows plus just right (a direction guess, 50%, × a step count, about 50%) = **under 1%**; M7 calls with 2–4 waiting multiply further; vet with 6 parts × care = **3%**. Every hint that shows the answer costs the star. Remaining weak spot: at level 1, a patient who names a care with the stage-1 word can be read by a reader (intended: stage 1 is teaching and doesn't count) |
| Does every persona have a reason to come back? | Layla: the patients' reactions, the cats, Explore with a parent. Zayn: Busy, level 3, the combo record, the album. Maryam: plaster designs, décor, the shelf, the album. Zafar: 8–10 lines per patient, the just-right loop, weakest-word patients. Farah: one patient, 60–90 s. Nani: Doctor Nani, her remedy, "our doctor". **Yes** |

---

## 11. Scorecard and verdict

| Criterion | Score | Why |
|---|---|---|
| **Fun** | **4** | Live reactions (giggle, ahh, sneeze), the just-right comedy, the family's cats as patients, a juggling morning in Busy. Weakest: the trolley pick by itself |
| **Forces Kutchi** | **4** (5 once words exist) | Part, feeling, care, adjustment and who's next all come only from what's said; the bot plan targets under 10%. **Today every decision word is an English placeholder**, so nothing is a real Kutchi test until Round 3 |
| **Distinct** | **4** | The body as the target and a person who answers back are new. Busy juggling and the trolley echo Cook; the borders with Who did it?, Find it, Dress up and Monsoon rush are drawn in section 1 |
| **Plot** | **4** | Carries Arc 3 Ch4 (M11 turns "say what hurts" into a real task) and returns in Arcs 4 and 5; Arc 2 only as a side errand |
| **Replay** | **4** | Generated patients from weakest words, tendencies, levels, silly cases, the album, the open clinic, one patient |

**Is it good?** Yes: the verb is proven (*Toca Doctor*, *Dr. Panda*, *Heart's Medicine*) and the language is the input, not decoration.
**Is it complete?** For its share of S4, yes: body, health, feelings, hot/cold and animals. Times of day and "it's raining" belong to Find it, Monsoon rush and Dress up. Its story uses (Nani has a cold, the clinic, fetching the medicine, a village clinic) are all placed.

### Verdict: **Go with changes**

The changes are prerequisites, not redesigns:
1. **Family words first:** send a Round 3 (body and health) list; the six "my ___ hurts" phrases and hot/cold unblock level 1.
2. **The doctor's photos → character sheet** before any clinic art.
3. **Build after platform item 1** (one app, one save), on Cook's engine moved to a shared folder, not in a copy.
4. Decide question 8 (Ch4 as one errand) before the story build.

### Top risks

| Risk | Mitigation |
|---|---|
| **No Kutchi for any decision word yet** (and "my ___ hurts" may change with the part) | Whole phrases recorded per part; placeholders flagged in the leak report; ask early |
| **Art:** seated full-body poses and a real-likeness doctor, kept consistent | Sheet-first; the close-up reuses the pose; animals reuse sheets; greybox silhouettes until then |
| **Tone:** a "doctor" game could frighten or look like medical advice | Comfort care only; the safety checklist (7.4); the doctor handles medicine; the parents' note |
| **Small parts on phones** for 5-year-olds | Big parts only at level 1; the close-up; tablet as the target device |
| **Feels like "Cook with bodies"** because it shares the engine | The patient's reactions, the body target and the just-right loop carry the feel; playtest Explore and level 1 before building more |

### Open questions for Zafar

1. ~~Keep the name "Nani's clinic", or call it the doctor's clinic?~~ **Answered by the revision (R1): the doctor's clinic; "The clinic" until the family names him.**
2. What do the children call the doctor: his name, or a title? (E102; and does he record his own lines: revision decision 2)
3. ~~Is the player the doctor's helper right?~~ **Answered (R1, R5): the helper, after one minute as his patient.**
4. The vet corner: cats, Kasuku and the hen **at the clinic**, or a separate corner at home?
5. Allow **Kasuku's echo** later (a decoy voice during a task, as an exception to the cast rule)?
6. Feelings: include **sad** and **scared**, or keep to hot, cold, tired and sneezy?
7. Ear star: lost at the first miss, or a half star after one (the same answer as Find it's question 3)?
8. Arc 3 Ch4: the home part as a **beat**, and the clinic as its **one errand**?
9. Nani's remedy for the Cook hand-off: *hardar* in *dudh*, *aadu* chai, or something else?

---

## 12. Build brief for a future agent

*(Revision 3: the phases and file ownership are now **R3.9**, which supersedes 12.1. The task details in 12.2 still apply, with these patches: `apply.js` is split into `stick`, `wrap`, `lift`, `tuck` and `drops`, one file each; every fetch or mix ends in `handover`; the voice bot's "mumble" strategy joins the leak bot; `tell.js` is built in task 2 against the stub `listen()`; `you.js` in task 4 gains S1's speaking.)*

### 12.1 Phases (superseded by R3.9)

| Phase | What's playable | Acceptance |
|---|---|---|
| **0 Prerequisites** (not code) | — | The Questions for Mum Section G (body, the doctor's calls, the check kit, the treatment lines, yes/no) answered; doctor photos in `sources/private/`; platform item 1 (one app, one save) done or scheduled; question 8, Revision 1's decisions 1, 4 and 5, and Revision 2's decisions 1–4 answered |
| **1 Greybox visit** | Clinic lab: **the visit engine** (calls + treatment slots), **M15 The check-up** (V1 all fine, V1 with a find, V2 the mystery) with the check kit (T8, T9, T7), M1 Where (V3), M2 Care, M3 Gentle hands with T1, T2 (turns, colour) and T12, on a **grey silhouette patient** (one hotspot file) at levels 1–3; "?" = ask the doctor (M13's only form) at a cost; the hotspot editor | Fair bot 100% ear stars; leak bot under 10% for every strategy over 500 visits per level **at every level** (placeholder rows flagged), including the new **sweep** (tap every part on each call) and **leftovers** (elimination across calls) strategies and the existing second-option and echo ones for "?"; `check_hotspots.py` passes (level-1 parts ≥ 2 cm on iPad; phone opens zoomed); tap-cover check at all six sizes; no console errors; screenshots reviewed |
| **2 Clinic morning and the chair** | M4 Just right (T13), **M14 You're the patient** (greybox lap view, two-way pills, yes/no, the plaster picker, *your left knee*), M7 Who's next, T11 drops at level 3 (the left/right mini-game) and the figure-of-eight path for T2, the intro card, 3 s quiet start, sidebar with "?", pass me, stars as they happen, the receipt, the word review, Relaxed/Busy with comfort rings, **one patient**, **You're the patient** and **open clinic** with "Close the clinic"; a morning mixes visit types | `test_clinic.py` plays a full morning, a patient visit and the open clinic at six sizes; every recast path exercised; leak bot under 10% on M4, M7 and T11 (sides reported separately); a level-1 morning under 5 minutes; a check-up under 90 s; a mystery under 120 s; the patient visit under 60 s |
| **3 Story and vet** | Arc 3 Ch4 (the home beat, the puddle on the lane, **you're the patient first**, M11 Bring someone in / Tell the doctor with audio pills from one look-alike group, the clinic errand: Ali's knee (V3), the hen (V2: "she's off her food"), the wet neighbour (V1: the temperature → cold → blankets), the medicine "pass me" at home, the blanket, the hand-off to Cook's Ch5), the Monsoon side errand "bring Ali in" (V4), M9 vet patients (Simba, Zazu, Kasuku, hen), T6 the dispensary shelf (colour, count, shelf; `fetch → handover`, the doctor checks it aloud and gives it), M10 silly finds, the map place, the quilt patch, the album, the thank-you shelf, the shop and upgrades | Ch4 runs end to end in the harness; the vet passes the leak bot with 6+ parts per animal; the shop has no item that touches the listening (a test lists upgrade knobs and fails on any hint or labelling knob); **Zafar plays it with a child** |
| **4 Art and more** | The doctor's sheet and poses, seated patient poses, expressions, items (+ three instrument sprites and a dropper), the two new hand poses; then T10 the reflex hammer (a kick frame per patient), T15 cream, T5 the doctor's syrup as a Cook recipe in the dispensary, the Doctor Nani entry with *show me your left hand*; later T14 the sling and the swivel stool's back views | Visual QA checklist on every screenshot; family recordings replace placeholders file for file; the leak report shows real Kutchi rows passing |

### 12.2 The first three tasks

**Task 1: `data/clinic.json`, one patient's hotspots, and the hotspot tooling.**
- Create `data/clinic.json` following section 8.1: `words` for the 6 level-1 parts, the 6 face parts and 8 care items (all `"kutchi": null`, `"src": "placeholder"`); `lines` (`hurts`, `feel`, `come`, and references to Cook's `need`, `give`, `oops`, `thanks`, `bye`); `grammar`; `lookalike_groups`; `mechanics.where/care/apply.levels`; `star_sets.clinic` (ear, plaster, tick, bolt).
- Draw a grey silhouette patient (1600×900 placement, seated, front-facing) in code or as a flat PNG, and write `data/patients/grey-adult.json` with `mirror: true`, a `closeup` rectangle and `spots`.
- Build a lab-only hotspot editor: click to add polygon points per part id, show mirrored sides, save JSON to the console.
- Write `build/check_hotspots.py`: at each of the six screen sizes, report each part's hit area in px and approximate cm (use 132 px/inch for iPad and 160 for a phone as defaults, configurable), overlaps between parts, and any part below the level's `minHitPx`.
- **Done when:** the editor round-trips the file, and the checker passes at level-1 settings on iPad and flags the face parts as "close-up only" on the phone.

**Task 2: the visit engine, `check.js` (M15) and `where.js` (M1) with their leak bot.**
- **The visit engine** on Cook's recipe engine: a visit is `{type, calls: [...], treatment: {...}}`. A call is `{speaker: "doctor" | "patient", frame: "check" | "hurts", part, side?, instrument?, find?}`. Add `lines.check` (*[EN: The {x}.]* / *[EN: Check the {x}.]*), `lines.now` (*[EN: Now the {x}.]*), `lines.again`, `lines.other`, `lines.listen`, `lines.look`, `lines.temp`, `lines.fine` (*[EN: Nothing wrong there]*), `lines.found` (*[EN: That's it!]*), `lines.unwell` (*[EN: I don't feel well]*), `lines.dunno` (*[EN: I don't know why]*). The generator: for V1, 4–6 calls drawn from the level's parts with repeats allowed and any part possible on every call; for V2, the same plus one `find` on a call from the second onwards. Record `lastCall` so the harness and bot can see it.
- Implement `js/clinic/mechanics/check.js` (`Cook.Mech.define("check", …)`, every number from `k`): the doctor's call plays; 3 s quiet; the player taps a part (level 1) or picks an instrument from the kit then taps (level 2+). Named part → the instrument's reaction (a torch beam, a heartbeat or gurgle sound, the doctor reading the strip aloud), `z.listen(true)`, and on a `find` call the reveal (a swirl or a sound) then `lines.found`; any other part → the giggle, `lines.check` again, `z.listen(false, "part")`; the wrong instrument on the right part → the doctor: *[EN: No, listen]*, a miss for the instrument slot only. Instruments map to several parts each (`instruments.stethoscope.parts = [chest, back, tummy]`, torch: ear, nose, mouth, eye; strip: forehead, hand; hammer: knee, elbow). The doctor's pose: gaze on the patient, hands folded.
- Implement `js/clinic/mechanics/where.js` as before (V3): the patient's line, 3 s quiet, tap; right → the sore swirl at the `spot`; wrong → giggle, recast, retry; the stage-1 twinkle; hesitation → replay only; the hint ladder as in 6.3, with **"?"** (`ask.js`, a two-way line at a cost) as rung 3.
- Add a clinic lab entry and the bot modes random, salience, frequency, repeat, duration, wait, **sweep** (taps every part on each call, in salience order), **leftovers** (never repeats a part already checked this visit), **second option** and **echo** (for "?") to `build/test_clinic.py --lab check --bot <s> --rounds 500`.
- **Done when:** the fair bot gets 100%; every leak strategy is under 10% at every level for V1, V2 and V3 (V1 at level 1 expected about 0.1%); the tap-cover check passes at six sizes.

**Task 3: `care.js` and `apply.js` (M2 + M3) with treatment slots.**
- `care.js`: a trolley from `scenes/clinic.json` slots, filled with **every** unlocked care item, shuffled per visit, with **three bandage rolls in three colours** and two plaster tins; the first pick is graded against the doctor's instruction (level 1: the item; level 2: item + colour or count); "pass me" at level 3.
- `apply.js`: the gestures wrap existing Cook code: **stick** (the pour drag to the spot; score = distance), **wrap** (Stir's track around the limb axis from the hotspot data; the turn count graded from level 2; never ends by itself; Done), **path** (level 3: the figure-of-eight, a track between two named hotspots in the called order), **lift on green** (`S.ring`), **tuck** (a vertical drag), **drops** (Cook's spoon-count tap on a side's `spot`; never ends by itself). The plaster star (gentle hands) comes from `z.skill`.
- Chain `calls → where? → care → apply` as the `checkup`, `mystery` and `hurt` visits through the recipe engine, so one lab button runs a whole visit of each type at each level.
- **Done when:** a level-1 visit of each type plays end to end in the lab at six sizes; the slot-memory, visual-cue and count bots stay under 10%; the harness runs the wrong-care, wrong-count and wrong-colour recast paths; screenshots reviewed.

**Task 4 (first of phase 2): `you.js` (M14).** A greybox lap view (a flat image with hotspot `spots` for hand, finger, arm, elbow, knee, foot, toe, **each with a side**), the doctor leaning in, the `yourAsk` line with two audio pills (text only at the reads stage), the probe (his hand at a random part, wrong first half the time) with yes/no pills, a level-2 side row (*[EN: Does your left knee hurt?]*: yes/no against the visible scuff), the plaster picker, `[EN: All better!]`; then the say-it recorder (record, play back beside the family's file, a parent's ✓; on-device only). Never graded. **Done when** the visit runs under 60 s at six sizes.

---

## Sources

- Toca Doctor: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/toca-doctor) (no text, no timers, splinters, bugs, shots); [LearningWorks for Kids](https://learningworksforkids.com/apps/toca-doctor/) (puzzles per ailment); [148Apps review](https://www.148apps.com/toca-doctor/toca-doctor/) (blocked here; search summary: ear puzzle, tummy bubbles with a burp)
- Toca Pet Doctor: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/toca-pet-doctor); [Good Play Guide](https://www.goodplayguide.com/reviews/toca-pet-doctor/) (gentle, imaginative animal problems, ages 2–6)
- Dr. Panda's Hospital: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/dr-pandas-hospital) (the visit sequence, empathy); [148Apps](https://www.148apps.com/dr-panda-hospital/dr-pandas-hospital-doctor-game-for-kids-review/) (blocked; summary: fun for a while, then repetitive)
- Operate Now: Hospital: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/operate-now-hospital); [SCMP review](https://www.scmp.com/culture/arts-entertainment/article/2099132/game-review-operate-now-hospital-hardly-cutting-edge-fare) (surgery with guide lines, about 60% base building)
- My Hospital (Cherrypick): [Google Play](https://play.google.com/store/apps/details?id=com.cherrypickgames.myhospital&hl=en_US) (80+ funny diseases, crafted cures, decorating)
- My Hospital (Bubadu): [Google Play](https://play.google.com/store/apps/details?id=com.bubadu.myhospital&hl=en_US) (bandage, burn and syringe mini-games in a time-management loop)
- Heart's Medicine: [Indie Game Reviewer](https://indiegamereviewer.com/hearts-medicine-time-to-heal-review/) (Diner Dash in a hospital; hearts drain while waiting)
- Two Point Hospital: [Fandom, Illnesses](https://two-point-hospital.fandom.com/wiki/Illnesses) (visual and non-visual illnesses); [Fanatical blog](https://www.fanatical.com/en/blog/two-point-hospitals-bizarre-yet-hilarious-illnesses) (comedy illnesses)
- TPR and body parts: [BYU Methods of Language Teaching](https://methodsoflanguageteaching.byu.edu/total-physical-response); [Astutik, IJLTER](https://www.ijlter.org/index.php/ijlter/article/view/1335) (TPR with young EFL learners)
- Body-part vocabulary: [Waugh and Brownell 2015, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4505369/) (blocked; search summary: face, tummy, hands and feet first)
- Left and right: [Rigal 1994, PubMed](https://pubmed.ncbi.nlm.nih.gov/7899010/) (correct use on own body from about 7)
- Emotion words: [Widen and Russell 2008](https://cepa.stanford.edu/sites/default/files/widen&russell%202008-Children%20acquire%20emotion%20categories%20gradually.pdf) (happy, sad, angry first); [Scientific Reports 2025](https://www.nature.com/articles/s41598-025-90613-z) (1,285 preschoolers' emotion comprehension)
- Pretend medical play: [Systematic review, PubMed](https://pubmed.ncbi.nlm.nih.gov/33472781/) (Teddy Bear Hospital: mostly lower anxiety; more fear with real equipment in two studies)
- Sociodramatic play: [Victoria State Government literacy toolkit](https://www.vic.gov.au/literacy-teaching-toolkit-early-childhood/teaching-practices-interacting-others/sociodramatic-play) (doctor's-office role play and pretend talk)
- Joint media engagement: [Journal of Children and Media 2019](https://www.tandfonline.com/doi/abs/10.1080/17482798.2018.1489866) (parent–child joint play with educational apps)
- Simon Says: [What makes Simon Says so difficult for young children? (PubMed)](https://pubmed.ncbi.nlm.nih.gov/24907632/)
- The red cross emblem in games: [Kotaku](https://kotaku.com/video-games-arent-allowed-to-use-the-red-cross-symbol-1791265328); [Digital Trends](https://www.digitaltrends.com/gaming/video-game-red-cross-health-pack-emblem/)
- Also used from `docs/find-it-design.md`: Lyster and Saito 2010 (prompts vs recasts), NN/g touch targets for children
