# Cook with Nani: design decisions after the first playtest, and the Phase A plan

**Date:** 24 Sept 2026
**Status:** agreed with Zafar. Phase A is in progress.
**Context:** Zafar and his wife played the overnight proof of concept (`cook.html`, see `docs/cook-with-nani-build-log.md`). This records the design discussion that followed, so nothing is lost.

---

## Mini-game quality pass, 25 Sept 2026

Per `docs/modes/MINIGAME-QUALITY-BRIEF.md` and `docs/modes/PIPELINE-BRIEF.md`, applied to the built and live mode. Cook never had a "Pipeline design" section, because it was built before the pipeline brief; this section frames the existing stations as a pipeline (Q1), answers the five questions for every station (Q3), scores and cuts (Q4), checks the controls against the corrected rule (Q5), checks distinctness against the other modes' pipeline designs (Q6), gives level-1 walkthroughs (Q7), and ends with the list of concrete changes for the next Cook wave (Q9). It supersedes sections 7, 8 and 11 below where they conflict; sections 12–13 (what's built, the audit) stay as the record. Wave 6b is changing the code right now (results screen, tally, auto-tick, tap pour, Nani out of the sidebar); this section assumes it lands and builds on it.

### Q0. What Zafar's tests found, and the rules this pass applies

- **The press-and-hold pour didn't land.** Small hands let go early or never found the hold; the sliding jug appeared "by itself". It becomes a tap (Wave 6b), and Q5 says exactly what a tap pours.
- **Level 1 was overwhelming.** Wave 6 fixed most of it: the smallest round, one job at a time, the request card, one light bulb, the first-time overlay. What's left is inside the stations: chop still throws every vegetable of the order at level 1, and Nani still corrects mid-round in several places. Q9 lists the fixes.
- **Controls (Zafar, clarified 26 Sept): internal consistency, not tap-only.** Swipe, drag, stir and tap are all fine. Within one mini-game the same *kind* of action always uses the same gesture (if ingredients are tapped in, liquids are tapped in too), and a mini-game's gestures never change between its levels. Q5 audits every station against this.
- **Auto-tick, no mid-round verdicts, the card is the master, Nani is a voice** (UX §11–§13). Applied per station in Q3, with one open question on ticks and counts (Q8).

### Q1. Cook as a pipeline: order → prepare → cook → serve → review

Every dish, in the story days and in the open kitchen, runs the same five stages. The stations are the mini-games *inside* the stages; a combined station (the Chai tray, the Maani line, the Mishkaki grill) spans two or three stages on one screen, with the big button between them (UX §5).

```
 ORDER            PREPARE               COOK                 SERVE                REVIEW
 request card  →  pantry · chop      →  boil · tadka      →  pour the cups     →  the customer checks
 (face, rows,     thread · fill+fold    stir · tawa          plate the skewers    the end-of-round
  read-along)     roll · spoon/measure  grill · fry          build the bowl       screen (time,
                                                             samosas on the plate accuracy, hints)
                                                             "{person} lai"       the word review
                                                                                  pocket money
 carried →        the rows (what,       what you prepared    the plate/cup/bowl   the rows, ticked or
                  how many, for whom)   is what cooks        vs the rows          missed, per person
```

**Hand-overs.** The request card's rows are the whole contract (nothing later invents a row, except *pass me*, which adds one the way Find it's doorway call does). Prepare works from the rows; cook works on what prepare made (the grill cooks the skewers you threaded, the fryer the samosas you folded, the tadka goes into the pot whose vegetables you chopped); serve is graded against the rows (which kind, how many, in what order, for whom); review shows the rows with what you did, then the badges and the word review. The **stitching** is unchanged: a story day is one to three dishes through the pipeline; the first ever session is Nani's pantry list (three things, order → prepare → review only); the open kitchen is free play with customers queuing and "Close the kitchen"; the Station lab dips into any single station at any level.

| Stage | Mini-games (level 1 in bold is the first thing a new player meets) | Stage-level rule |
|---|---|---|
| **Order** | The request card: **Nani's list** (pantry), one person orders (chai, maani, daar, chaat, samosa, mishkaki), everyone orders (the Chai tray: each person says their cup) | Listening only; the card shrinks into the left sidebar and is the master from then on |
| **Prepare** | **Pantry** (fetch), **chop** (ninja), **thread** (skewers), fill + fold (samosa), roll (maani), the cup's spoons and milk (Chai tray) | Every prepare game turns on a noun, a count, an order or a *nar*; decoys always out |
| **Cook** | **Boil** (the knob), **tadka**, **stir**, tawa, **grill**, fry | The hand star lives here (rings, green windows); the ear star only where Nani speaks (tadka's order, stir's speed, fry's "leave the chips") |
| **Serve** | **Pour the cups** (Chai tray), **plate the skewers**, build the bowl (chaat), samosas on the plate, *{person} lai* (who gets which) | Graded at Done against the rows; nothing on screen shows the target |
| **Review** | The customer checks aloud (the chaat's layer-by-layer check is the model), the shared end-of-round screen (UX §9), pocket money | The only place mistakes are shown |

### Q2. Research: what's working now, and the mechanic borrowed from each

| Game | What it does that works | What Cook borrows (or already has) |
|---|---|---|
| **Good Pizza, Great Pizza** (the reference for "the order is the puzzle") | The whole game is reading the customer: plain orders, vague ones, jokes, "the usual"; the pizza is judged against what they *meant*; a wrong pizza means no payment and a face | Already Cook's spine (section 3: "the order is the recipe"). Borrow the **customer's reaction at serve** as the review's first beat: the face, one line in Kutchi, then the badges. And its "the usual" for the open kitchen's regulars (people memory, already in the tastes data) |
| **Papa's Pizzeria / Papa's games** | The **order ticket** hangs at the top and is the master through every station (build, bake, cut); the ticket's rows are checked one by one at the end with a percentage per station | The instruction card as the master (UX §13) and the auto-tick (§11); the per-row "they asked / you did" review already exists. Borrow the **ticket travelling with you**: the same card, shrunk, through prepare, cook and serve, not a new card per station |
| **Cooking Mama: Cuisine!** | Each gesture is a real cooking gesture (slice, stir, flip, pour) with a **timing bar and a green window**, a big verdict stamp ("Perfect!"), and short rounds. Reviews knock it for mini-games that aren't relevant to the dish and for repetition | The ring-with-a-green-window (boil, tawa, grill, fry) and the verdict words are this. Its criticism is UX §6: **cut what isn't the lesson** (knead goes, Q4) |
| **Overcooked** | Fun from juggling several timers at once; one star is easy, three are hard; a gradual ramp | The juggle is level 4 only (grill, fry's several-at-once, the Maani line's tawa-won't-wait); the three badges make "one star easy, gold hard" explicit |
| **Toca Kitchen 2** | No goals, but the **guests' comic reactions** (sneeze at pepper, steam at chilli, a happy chew) are the reward, and children feed them on purpose to see them | The **serve-stage reaction library** (Q9 item 4): a chilli they said *nar* to gives steam from the ears; a perfect cup gets a slurp and *Shabash!*; too many sugars, a shudder |
| **Sago Mini Diner** (ages 2–5) | A tiny loop, order → recipe book → pantry and fridge → cook → serve → wash up; a delivery out back to restock; surprises to tap | Confirms the pantry as the first stage (UX §7) and the pipeline shape. Borrow the **wash-up as a calm coda** later (maybe-later list) |
| **Dr. Panda Restaurant** | Tap-driven tools (grater, wok, food processor) with a cause-and-effect payoff each; customers order but you may play | The tool sprites wired to the stations (to-do, Wave 6b), each with its own sound |
| **Pok Pok Playroom** | Calm, no timers, no levels, no ads; the child sets the pace | Relaxed mode, the 4 s of quiet before a hint, the "pass me" pause. Level 1 has no clock except the ring on the food |
| **Duolingo ABC / Khan Academy Kids** | "Tap the one you heard" as the base exercise; drag-and-drop for placing; tracing for letters; sessions of a few minutes. Reviews of input-only apps (Lingokids) say children can't *answer* after a year | Tap-the-named-thing is the pantry and every decoy set. The production gap is why Cook needs a speaking moment (Q9 item 9) |
| **Fruit Ninja** (via chop) and **Simon** (via tadka) | Slicing what flies is joy on its own; a spoken sequence from memory is a classic memory game | Already borrowed; kept as Cook's two most distinct games |
| **Bluey: Let's Play!** | Rooms of a familiar house as the menu; activities lifted from moments the child already knows | The world-is-the-menu plan (to-do, platform item 3); the family's own dishes as the moments |

### Q3. The five questions, station by station

Kutchi lines are the family's where we have them (`docs/kutchi-grammar-notes.md`); grey-italic English in the game until the family gives the rest. Numbers: *hakro/hakri* (by gender), *ba*, *trae*, *char*, *panj*. Scores are 1–5 on each question (do, challenge, fun, instruction, novel), max 25.

**Pantry (fetch): order → prepare.** *Do:* the card shows Nani's list; tap each named thing on the shelf; it flies into the basket; the row ticks. *Challenge:* look-alikes on the shelf (*khun* beside *loon*, *dudh* beside *paani*, *jeeru* beside *rai*); every option is always there, so only the word decides; more things and more look-alikes per level (3, 4, 5, 6). *Fun:* the basket "plop" and bounce; the look-alike wobbling when you hover the wrong one (level 1 only); Nani's *pass me* cameo taking something off the shelf. *Instruction:* *Muke atto de. Ne khun. Ne dudh.* (Mum's frame); the card's rows are the list. *Novel:* nothing on its own (Monsoon's pots-in, Tidy up's gather and Dress up's shelf all reuse it), but it's **deliberately shared and Cook owns `fetch.js`**; it stays because it's the smallest possible first round. Score 4·3·2·5·2 = **16. Keep** (stage 1 of everything).

**Chai tray: order → prepare → cook → serve.** *Do:* tap the jug (water into the pan, one tap to the line), tap the tea among look-alikes, tap the big knob; each person says their cup; tap a cup, tap the milk jug (or don't), tap the sugar bowl once per *khun* (or don't), tap an extra; tap the knob on the green; tap the pan to pour each cup; Done. *Challenge:* three decisions per cup that only the voice gives (*dudh* or *nar dudh*; how many *khun* or *nar khun*; *elchi waari* or *aadu waari* or plain), per person, with the boil ticking on the back burner; level 4 adds *adh / bharelo* (half or full: one tap or two, Q5). *Fun:* the boil-over foam if you forget the knob; the pour's rising pitch; the slurp and *Shabash!* from the person whose cup was right; a cup handed to the wrong face makes them look puzzled. *Instruction:* *Muke chai khape.* then per person *Nana lai. Dudh waari chai. Muke chai me ba khun khape.* (Mum's frames); the cup cards with fixed slots. *Novel:* the **only game where several people each want their own version of one thing**, and the only one with a back-burner clock (the boil) under a listening job. Score 4·5·4·5·5 = **23. Keep.**

**Maani line: prepare → cook → serve.** *Do:* tap a dough bowl (*maani* or *bajr jo maani*), roll with an up-and-down drag until the dashed circle turns green, tap it onto the tawa, tap on the green to flip, tap on the green to puff, it lands on the plate; repeat; Done. *Challenge:* how many of which dough, from the voice (*hakri maani ne ba bajr jo maani*); both bowls always full; the tawa never waits, so roll-then-cook versus roll-all-first is a real choice; level 4 *wadhi / nindhi* (two circles). *Fun:* the puff; the tear if you over-roll; the stack growing on the plate. *Instruction:* *Muke ba maani khape.* One card per maani (dough, and size at level 4). *Novel:* the **production-line decision** (two stations that don't wait for each other) and the only shaping gesture in the game. Score 4·3·4·4·4 = **19. Keep.**

**Mishkaki grill: prepare → cook → serve.** *Do:* thread: tap a piece bowl and the piece slides down the skewer (tap the skewer to take the last one back), four pieces a skewer, as many skewers as they said; "Go to the barbecue"; grill: tap a skewer on the rack to put it on, tap it on the green to turn (twice), tap on the green to lift it to the plate; Done. *Challenge:* which kind and how many (*ba ghos, hakro vegetable*), and from level 3 a mixed skewer in the spoken order (*ghos, ne poi tameto, ne poi dungri…*); the rack has fixed slots, every bowl is out; level 4 juggles threading with grilling. *Fun:* the sizzle and the char marks appearing as it turns; the near miss when a second skewer's ring goes green while you're on the first; the plate reveal. *Instruction:* *Muke mishkaki khape. Ba ghos. Ne hakro vegetable.*; a card per skewer with four dots. *Novel:* **building a thing in a spoken order and then cooking it** (the order is graded on the plate, not while you build) and the first two-phase station with a big button. Score 5·4·4·5·4 = **22. Keep.**

**Chop (ninja): prepare.** *Do:* vegetables fly up; swipe through only the ones Nani named, as many as she said, until the timer ring empties; nothing stops you at the number. *Challenge:* which and how many (*only ba dungri. Ne hakro tameto.*), a red onion among the tomatoes, the mid-round switch at level 2 (*now marcha!*), the last ones becoming decoys; faster throws. *Fun:* the slice itself, the halves flying, the white trail, the timer's last-seconds pop; the "one more!" near miss as the ring runs out. *Instruction:* *only {n} {x}* and *now {x}* are still English placeholders (top of the family list); the card shows the vegetables of the dish. *Novel:* the **only swipe-slicing game in Nani jo Ghar**, and the only one with a switch mid-round. Score 5·4·5·4·5 = **23. Keep.** Fixes: level 1 must be one kind (Q9 item 7); no *Arre re!* on a wrong slice from level 2 (the halves fall grey; the review counts it).

**Tadka: cook.** *Do:* Nani says the spices in order; tap each bowl in that order into the hot oil; tap the pan to tip it into the pot. The heat ring fills between spices: dawdle and it smokes, then burns. *Challenge:* the sequence (*pela jeeru, ne poi rai, ne poi hardar*); look-alike bowls (*jeeru* / *rai*, *loon*); the card shows the spices as words, then dots, then nothing (level 3: Nani's voice from memory, the Simon moment); a shorter burn clock per level. *Fun:* the burst and sizzle as each spice lands; the smoke wisps as a warning; the tip into the pot and the colour change; the burnt-black pan is comic, not punishing. *Instruction:* *Pela {x}. Ne poi {y}.* (Mum's frame, real). *Novel:* a **spoken sequence from memory under a heat clock**; Dress up's queue and Monsoon's day strip reuse the input, but only Cook has the burn. Score 4·5·3·5·4 = **21. Keep.**

**Stir: cook.** *Do:* drag the ladle round its track inside the pot; laps are counted aloud; the speed dial shows tortoise / hare; let go and you're done. *Challenge:* the count (*trae*) and the speed (*aastethi* / *jaldi*), and at level 3 a switch mid-stir (*now jaldi!*, sometimes the same speed again); nothing shows which band is wanted. *Fun:* the swirl tightening as you speed up, the daar sloshing, the spill if you go mad; the counted laps. *Instruction:* *{n} {x}!* with the speed word; the card shows the count as a dot group. *Novel:* the **only game where speed is the answer** and it's heard, not shown. Score 3·4·4·4·5 = **20. Keep.** Fix: the round should end on a Done tap (like every serve), not on letting go for 1.8 s, which children hit by accident (Q9 item 11).

**Chaat (assemble): prepare → serve → review.** *Do:* chop first (the chop game, only what goes in this bowl); then tap toppings into the glass bowl in the spoken order; Done; the customer checks layer by layer from the bottom, ticking each; at the first wrong layer they stop, scoop out from there, say the rest again, and you carry on. *Challenge:* the sequence (*channa, ne poi bataato, ne poi dai…*), the *nar* rows (Nana's *nar marcha*), likes as extras; decoys on the counter. *Fun:* the visible layers in a glass bowl; the scoop-out and recast; the slurp at the end. *Instruction:* *Muke chaat khape. Channa. Ne poi bataato. Nar marcha.* *Novel:* the **customer's layer-by-layer check** is Cook's review mechanic in miniature, the model for every serve stage. Score 4·4·4·5·4 = **21. Keep.**

**Samosa + fry: prepare → cook → serve.** *Do:* fill: tap a filling bowl once per spoon into the mixing bowl (any bowl, decoys too), Done; fold: each pastry takes a scoop; swipe along each of three dashed lines; make as many as they said; fry: tap to drop them in, tap each on its green to lift it; from level 3 Nani's chips are already frying (*lift the samosas, leave the chips*). *Challenge:* the fillings and spoons (*ba keema, ne hakro watana*), the *nar* filling, how many samosas (the tray always holds extras), which to lift. *Fun:* the fold closing into the triangle; the sizzle as they drop; watching three rings at once; the golden stack. *Instruction:* *Muke ba samosa khape. Ne ba keema. Nar dhana.* *Novel:* **make-then-cook-then-pick-out**, the only station where you decide *how many to make* and are graded later, and the only three-gesture station (tap, swipe, tap: three kinds of action, each with one gesture, Q5). Score 4·4·4·4·4 = **20. Keep.**

**Pass me (interrupt): any stage.** *Do:* Nani's voice asks for something (*Muke {x} de*); three look-alike pills in the sidebar; tap one. *Challenge:* any word you've met, weakest first; Busy keeps the pan cooking. *Fun:* the pan boiling over while you help her (Busy). *Instruction:* Mum's frame, real. *Novel:* a spaced-review interrupt; shared by design with Find it's doorway call, Dress up's *pass me the scissors*, Snap's quick shot. **Keep as a modifier**, not a mini-game (not scored).

**Open kitchen: a session shape, not a mini-game.** Customers keep coming, orders lean towards weak words, "Close the kitchen" ends it. Keep as Cook's free-play entry; the review is the day summary. Serving to the right person (*Nana lai*) is its missing decision (Q9 item 5).

**Sub-mechanics that only live inside the stations:** boil (the knob), count (the spoons), add (the tea leaves), roll, tawa, thread, grill, fill, fold, fry. They stay as files; they are not stations of their own in the story.

### Q4. Scores, the cut, and maybe later

| Station | Do | Challenge | Fun | Instruction | Novel | Total | Verdict |
|---|---|---|---|---|---|---|---|
| Chai tray | 4 | 5 | 4 | 5 | 5 | 23 | Keep |
| Chop | 5 | 4 | 5 | 4 | 5 | 23 | Keep |
| Mishkaki grill | 5 | 4 | 4 | 5 | 4 | 22 | Keep |
| Tadka | 4 | 5 | 3 | 5 | 4 | 21 | Keep |
| Chaat | 4 | 4 | 4 | 5 | 4 | 21 | Keep |
| Stir | 3 | 4 | 4 | 4 | 5 | 20 | Keep |
| Samosa + fry | 4 | 4 | 4 | 4 | 4 | 20 | Keep |
| Maani line | 4 | 3 | 4 | 4 | 4 | 19 | Keep |
| Pantry | 4 | 3 | 2 | 5 | 2 | 16 | Keep (stage 1; shared by design) |
| Knead (standalone) | 2 | 1 | 2 | 1 | 1 | 7 | **Cut** from the lab and the story (hands only; no word; Cooking Mama's "irrelevant mini-game" critique) |
| Roll → Tawa (lab) | 3 | 2 | 3 | 2 | 1 | 11 | **Cut** from the lab list: it's the Maani line's middle, kept only as zone.js's proof |
| Boil, count, add, pour (standalone lab entries) | – | – | – | – | 1 | – | **Cut** as lab entries; they're sub-mechanics of the Chai tray |

Nine kept: three per stage at most in prepare (pantry, chop, thread / fill / roll), six in cook, four in serve. Within the brief's 6–8 per stage.

**Maybe later (one line each):** pipe a jalebi spiral (rhythm and shape; needs the fry); grind and churn (counts); pat a bajra rotlo (a tap-count shaping game); a belt pantry ("Nani's delivery van": the clinic's belt with food nouns, for free play only); the sharp-knife and chai-machine upgrades (pocket-money shop); the wash-up coda (Sago Mini: calm, ungraded, one tap per plate); the end-of-day recall ("what did Ma have?": section 3 item 7); role reversal, you order from Nani (section 3 item 8; the speaking moment in Q9 item 9 is the first step); knead as a hands-only breather inside the Maani line at level 3 (press *trae* times: a count); a garnish station (positions: on top, in the middle) once the family gives the position words.

### Q5. Controls: one gesture per kind of action, the same at every level

The corrected rule (UX §12): swipe, drag, stir and tap are all fine; within a mini-game the same kind of action always uses the same gesture, and a mini-game's gestures never change between its levels. The audit, kind of action by kind of action:

| Station | Add / pick a thing | Liquids | Shape or work the food | Timing (cook) | Move on | Changed? |
|---|---|---|---|---|---|---|
| Pantry | tap the item | – | – | – | auto | No |
| Chai tray | tap (tea, sugar spoon, extra, cup, knob) | **was press-and-hold (jug, pan); now tap** | – | tap the knob on the green | tap Done | **Yes: pour** |
| Maani line | tap (dough bowl, maani onto the tawa) | – | drag up and down (roll) | tap on the green (flip, puff) | tap Done | No |
| Mishkaki grill | tap (piece bowl, skewer on the rack, skewer to the plate) | – | – | tap on the green (turn, lift) | tap "Go to the barbecue", Done | No; the level-4 juggle keeps the same taps |
| Chop | – | – | swipe (slice) | – | auto (the ring) | No; levels add phases and speed, never a gesture |
| Tadka | tap (spice bowl) | – | – | tap the pan (tip) | auto | No |
| Stir | – | – | drag round the track | – | **let go 1.8 s → tap Done** | **Yes: the end** |
| Chaat | tap (topping) | – | – | – | tap Done | No |
| Samosa + fry | tap (filling spoon, drop in) | – | swipe along a dashed line (fold) | tap on the green (lift) | tap Done | No: three kinds of action, one gesture each |
| Pass me | tap a pill | – | – | – | auto | No |

**The tap pour, exactly.** A tap pours **one measure**: the liquid rises to the next dashed line inside the vessel, with the pour sound and the rising pitch, and stops there by itself (the special jug's "stick at the line" behaviour, now the only behaviour). Water into the pan: one line, one tap. Milk into a cup: one line, one tap; no tap means *nar dudh*. Chai into a cup: two lines, always drawn (the audit's rule: the same lines on every cup); one tap reaches the half line, a second tap the full line. At levels 1–3 nobody asks for an amount and the cup's row ticks at the full line, so the ghost finger teaches "tap, tap" once; at level 4 the cup card has an amount slot (*adh* / *bharelo*) and the second tap is the decision. So **pouring is counting**, the same gesture as the sugar spoons, and it never changes by level. The hand star's "pour to the line" skill goes (a tap can't miss); the hand star at the tray is the knob alone. `pour.js` keeps `hold` only for other modes that still want it (Monsoon's buckets are that mode's call), and gains `tapMeasure`.

### Q6. Distinctness across modes

Read against the other modes' "Pipeline design" sections. Cook is the mechanics library, so overlap is expected; the question is whether any Cook mini-game is *the same game* as one elsewhere without being deliberately shared.

| Cook mechanic | Reused elsewhere | Distinct enough? |
|---|---|---|
| `fetch` (pantry) | Monsoon S2a pots inside; Tidy up 1a gather (via `whichone`); Dress up 3a the wardrobe shelf; Who did it 2b, in belt mode | Same game by design; Cook owns the file. The clinic's belt and Dress up's rail are the moving-shelf variant (time pressure), which Cook doesn't need: the pantry stays still because it's the first thing a five-year-old does |
| `count` (spoons) | Monsoon S3b drip count and S4d mop; Tidy up 1b and 3b; Find it 5c scales; Who did it 1a and 5a; Snap 6b | Shared by design (the tally rule: never the target) |
| `pour` | Monsoon S4a empty the buckets (press-and-hold, sizes); Dress up 2b "how long?" (stop at the line) | Cook's is now a tap-measure; the others chose hold or drag for their own reasons and each is consistent inside its own game. Fine under the corrected rule |
| `stir` (drag round a track) | Monsoon S4b dry off (a towel on a cat) | Shared input, different answer: only Cook's asks for a *speed* |
| `tadka` sequence input | Dress up 1b first…, then… (a queue); Monsoon S1b the day strip | Shared by design; only Cook's has the heat clock and the Simon fade |
| `passme` | Find it 3c the doorway; Dress up 3d Big Ma's tools; Snap 3e quick shot | Shared modifier |
| Chai tray | Monsoon S5a chai for everyone (a cameo, loaded not copied); the clinic's chai-with-lemon and turmeric-milk treatments (tadka) | Deliberate cameos of Cook's station; the tray stays Cook's |
| `assemble` serve step (*{person} lai*) | Who did it 5c share them out; Find it 6b give one to Nana; Snap 5b who wants which | The "hand it to the right face" step is shared; Cook's bowl-building with a layer check is Cook's alone |
| Chop (ninja) | Nobody | Unique to Cook |
| Thread → grill | Nobody | Unique to Cook |
| Fill → fold → fry | Nobody | Unique to Cook |

Nothing needs merging or cutting for distinctness. One note for the other modes' builders: the clinic's "does it hurt here?" yes/no and Find it's "he reads it back" are review mechanics that Cook's serve stage should adopt in the same shape (the customer names what they got), so the review feels like one system across modes.

### Q7. Level-1 walkthroughs (one per stage's first game)

**Order + prepare: Nani's pantry list (the first ever round).** The kitchen, straight on; the shelves hold eight things, three of them Nani's (say *atto*, *khun*, *dudh*), the rest look-alikes and strangers (*loon* beside the *khun*, *paani* beside the *dudh*). The request card comes up with Nani's face: *Muke atto de. Ne khun. Ne dudh.*, each row lighting as it's said; a tap, and it shrinks to the left. Everything dims but the *atto*; a ghost finger taps it once; the child taps it; it flies into the basket with a plop and the row ticks. The shelf lights up again; the child finds *khun* (the *loon* beside it wobbles if hovered, level 1 only), taps, tick; then *dudh*, tick. Nani: *Shabash!* The end screen: the stopwatch, three green slots, gold "0 hints", then the three words to hear again.

**Prepare: thread one skewer.** The threading board, straight down; a skewer with its handle at the bottom; bowls of *ghos*, *tameto*, *dungri*, *green pepper*. The card: *Muke mishkaki khape. Hakro ghos.*; one skewer card with four empty dots. Ghost finger: tap the *ghos* bowl; a piece slides down the skewer to the bottom with a soft *thk*; the first dot fills. The child taps three more times; the skewer is full and slides to the row beside the board; the card's row ticks. The big button bottom right, *Go to the barbecue*, pulses.

**Cook: grill it.** The grill, straight down; the skewer waits on the rack. Ghost finger: tap it; it lands on the grill with a hiss and a ring appears round it. The ring fills; bubbles of fat, then the green section; the child taps in the green: *Turned!* and char marks; again: the second turn; the ring fills once more; a tap in the green lifts it onto the plate, *Golden!* (a late tap: *Charred!*, the skewer goes dark and comic, and it still goes on the plate; the review counts it). Done. The customer's face: *Shabash!*, then the three badges and the words *mishkaki*, *ghos*, *hakro*.

**Serve: pour one cup (Chai tray, the cups phase).** The tray with one cup and Nana's face on its card: *Nana lai. Dudh waari chai. Muke chai me ba khun khape.* The child taps the cup; the milk jug glows once (ghost finger): tap, the jug slides in, pours to the milk line with a rising note, slides away; the sugar bowl: tap, a spoon flies, *hakro*; tap, *ba*; the *loon* beside it is never touched. The knob on the back burner has gone green: tap, the flame drops, the pan stops bubbling. Tap the pan: it tilts over the cup and pours to the half line; tap again, to the full line, steam. The cup card's rows tick as each is done. Done: Nana lifts the cup, slurps, *Ghan!*

**Review: the end screen.** Page 1: the stopwatch with this round's seconds and *New best!* if so; the accuracy row, one slot per row of the order, green or red; the hints badge, gold at zero. Next. Page 2: the words heard, each with its English and a speaker. Then pocket money on the day summary.

### Q8. One open decision: live ticks and counts

UX §11 says a card line ticks automatically when that part is done right, at every level. For *which* and *in what order* rows (fetch, tadka, thread, the chaat layers, milk yes/no, which chai) a live tick is safe. For **count rows** (*ba khun*, *trae maani*, *ba dungri*, *ba samosa*, stir *trae*) a tick the moment the tally reaches the number tells the child when to stop, which is the leak section 13 and the audit closed ("counts never shown"). **Default:** a count row ticks when its *item* is finished (the cup is poured, Done is pressed, the chop ring runs out), not when the number is reached; the picture tally in the corner shows what you did. So the tick still comes by itself, just at the end of that thing. Zafar to confirm; if he wants the live tick anyway, the count words drop out of the ear star and the number words are taught by hearing only.

### Q9. Concrete changes for the next Cook wave (after Wave 6b)

1. **Tap pour as measures** (Q5): one tap per dashed line; chai cups always show both lines; half/full = one or two taps at level 4; the tray's hand star is the knob alone. `pour.js`: `tapMeasure`; keep `hold` for other modes.
2. **Chop level 1 = one kind**: one vegetable, 2–3 to cut, three decoys, slower throws; level 2 two kinds at once; level 3 the switch; level 4 the switch with faster throws (the "each level adds one thing" rule, which Wave 6 didn't reach chop).
3. **No mid-round verdicts from level 2**: chop's *Arre re!* and red burst on a wrong slice, tadka's `oops` on a wrong spice, fetch's and count's *Arre re!*, the pour's *Too much!*: level 1 keeps one gentle correction; from level 2 a wrong pick lands like any other (grey halves, a spoon that just goes in) and the review shows it. Keep the *cooking* cues (smoke, foam, char): they're the world, not a verdict.
4. **The serve reaction library** (Toca Kitchen 2): the customer reacts to their dish before the badges: a slurp and *Ghan!* / *Shabash!* when right; a puzzled look and the row said again when wrong; steam from the ears for a chilli they said *nar* to; a shudder at too many *khun*. Data: `reactions` per mismatch type, one voice line each, in `data/cook.json`.
5. **Serve to the right person everywhere** (*{person} lai*): the open kitchen and every multi-person order hand the plate or cup to a face; kinship words decide. The Chai tray's "order for others by name" (to-do) is the first case.
6. **Cut knead and the standalone lab entries** (roll→tawa, boil, count, add, pour) from the Station lab list; keep the files as sub-mechanics. Lab = the nine stations.
7. **Stir ends on Done**, not on a 1.8 s pause; the hand's "let go" no longer decides anything.
8. **The card travels**: the shrunk request card is the same object through prepare, cook and serve (no fresh card per station), its rows ticking as in Q8's default.
9. **A speaking moment for Cook** (the deep-dive rule; Cook has none): at serve, *Nana lai* said aloud, closed set = the family present (3–4); and role reversal at *pass me*: Nani's hands are full, the child says *Muke {x} de* with the closed set = the bowls on the counter (4–6). Fallback: the pills; a parent's tick earns the voice star. From level 2, once `js/shared/speech.js` lands.
10. **Onboarding scripts per station** (UX §10), now the mechanics are settled: the spotlight order for each of the nine stations, as data next to `coachSteps`.
11. **Words to ask the family first** (they decide the most): *only*, *now* (chop's switch), *vegetable / mixed* (skewer kinds), *chips*, *green pepper*, *samosa / chaat / mishkaki* if they have Kutchi names, *sev, keema, coriander, green chutney*; then *lift / leave*. All already in the Questions for Mum doc.
12. **Build brief note:** phases as the to-do's Wave 7; own files first (`pour.js`, `chop.js`, `stir.js`, `data/cook.json` reactions and levels), then `flow.js` for the travelling card and the serve step, then the shared speech hook.

## 1. Strategy (agreed)

**Make Cook with Nani genuinely good first, then add the other game modes one at a time.** It is the flagship and appears in every story arc. Three conditions:

- **"Done" means:**
  - a child asks for another go without being prompted;
  - **the wife's test:** someone who doesn't know Kutchi can't earn the "understood" star by memorising patterns;
  - an adult's word dots visibly climb over a week.
- **Mechanics and learning first, art second.** Art multiplies whatever is underneath.
- **Build the shared parts for reuse:** the word pill, the voice pipeline, the asset pipeline, the hint and per-word engine, stars and pocket money, hands. Find it, Tidy up and the rest reuse all of them.

**Order (agreed):**

| Step | What |
|---|---|
| **Phase A** | Shared systems, then the **whole station library** (mechanics only, placeholder art), then recipes as data. Iterate with feedback until it makes sense and teaches Kutchi |
| **Asset run** | Only once every station is settled, because hand poses and ingredient states repeat across stations. Art bible, then the image API pipeline, then review |
| **Voice** | Later: family recordings replace the Gujarati placeholder file by file |
| **Then** | The next mode (Find it, the bazaar) |

## 2. Visuals: what was wrong, and how we'll fix it

**Diagnosis of the proof of concept (Claude agreed with all of Zafar's points):**
- The rolling screen had a chakla on top of a chopping board: two boards.
- Items on the stove "stood" on the worktop's lip, which is its shadow, not a surface.
- The props were drawn at about 30° from the side; the hob was drawn at about 60° from above.
- Pantry items were drawn from above but sat on eye-level shelves. The scale was wrong (cardamom as big as the milk jug) and the top shelf floated.
- Liquid was a flat oval; the flames were blue dots; the gauges floated on the hob; the glass stood on the hob.

**Root cause:** the props were generated for one generic angle and pasted into backgrounds drawn from other angles. The QA only checked "is anything covering a tap target?", never "does this look believable?".

**Fixes (agreed direction):**
1. **One camera per station. All cooking stations look straight down**, like Cooking Mama and Good Pizza, Great Pizza. That way:
   - tools rotate in code (8 knife directions from 1 image);
   - liquid fills as a disc;
   - hands come up from the bottom of the screen.

   Straight-on views are kept only for the family at the island and the pantry shelves.
2. **An asset matrix, not generic views.** Each item gets only the views and states the game uses: typically a front view for the shelf, top-down for the station, plus its cooking states. Generating 6 to 8 views per item wastes money and invites the style to drift.
3. **First-person hands.** Rigid hand images moved in code: knife up and down, ladle round, rolling pin back and forth, spatula flip, jug tilt, palms pressing, a grabbing hand. There's no finger animation. All hands come from one sheet with one reference hand, with a Kutch-embroidered kurta cuff as the signature.
4. **Image API pipeline** (OpenAI image API, transparent backgrounds, reference images for style):
   - an asset list as data, run by a Python script that waits between requests, retries, resumes and has a spending cap;
   - contact sheets reviewed by Claude, with rejected images regenerated;
   - Zafar signs off one station before the rest are generated.

   **"Edit in place":** give the model the empty station and ask it to add the item, then cut out the difference. The item comes back already at the right angle, scale, light and shadow. Cost is roughly $15 to $60 for about 300 images. Runs overnight on Zafar's laptop, or here with the key as a secret.
5. **A visual QA checklist** on every screenshot:
   - camera angle matches the background;
   - the item touches a surface and has a shadow;
   - scale matches a reference item;
   - no doubled surfaces;
   - the thing to tap is obvious;
   - the timing cue is where the eye already is.

## 3. The learning link (the big one)

**The wife's critique:** you can do well by pattern recognition. We audited every step:

| Step | Needs Kutchi? | Why |
|---|---|---|
| Greeting | Barely | Same exchange every time |
| Which dish | Briefly | Only 3 words |
| Pantry basics | **No** | Recipe memory |
| Extras (elchi, tameto) | **Yes** | They vary |
| Counts | **Yes** | Number words |
| Stove sequence | **No** | Fixed order |
| Tadka order | **Yes** | Changes each day |
| Stir count | **Yes** | Number words |
| "The usual" | **No** | People memory |
| Gestures, serving | No | Hands only |

About a third of play needed the language.

**Principle:** nothing the player does may be decided by memory of a fixed recipe. Every choice is set by something said in Kutchi, and it changes from order to order.

**How:**
1. **The order is the recipe.** Every dish has variable slots given only in Kutchi:
   - **chai:** milk or none, how many sugars or none, elchi, ginger or masala, how many cups;
   - **daal:** tadka spices, tomato, onion, chilli (each yes or no), salt;
   - **maani:** how many, ghee or not.
2. **Nani interrupts: "pass me…"** (Zafar's refinement: she slides in from the edge mid-cook and names an item; three look-alike items appear; tap the right one).
   - Busy mode: the pan keeps cooking, which is the fun chaos.
   - Relaxed mode: the cooking **pauses** (agreed).
   - Her requests draw on the **whole vocabulary**, which doubles as spaced review.
3. **Look-alike decoys:** sugar next to salt (khun and loon), water next to milk, cumin next to mustard seeds.
4. **"No" and "not":** "chai, no sugar" can't be done on autopilot.
5. **Words Nani says while you work:** enough, more, a little, big, small, just right, slowly, quickly. Heard exactly when they apply (Total Physical Response).
6. **Serve to the right person:** "this is for Nana" (kinship).
7. **End-of-day recall:** "what did Ma have?"
8. **Later: swap roles** (you order from Nani).

**English for missing words:** use English until the family supplies the Kutchi, shown in a distinct style (grey italic) so it's obvious and easy to swap.

## 4. The word pill and item labels (agreed)

**One consistent design in three shapes:**
- **Full pill** `[speaker] Kutchi [translate]`: speech, the mission card, the notebook.
- **Item label:** small and semi-transparent, sits under an item, tap to hear. No translate button, because the picture is the meaning.
- **Choice pill:** big and tappable, for "pass me" and greetings.

**Spices and small ingredients are heaped in open bowls with labels** that fade to a speaker button as the word is learned.

**A word shows as text in only one place at a time**, otherwise players match letter shapes instead of understanding:

| Word stage | Mission card (the instruction) | Item label (the help) |
|---|---|---|
| 1. New | Text and speaker | Text and speaker, item glows |
| 2. Learning | Text and speaker | Speaker only |
| 3. Nearly known | Speaker only (text shown as dots) | Speaker only |
| 4. Known | Heard once; replaying costs the "no help" star | None |

## 5. Greetings and small talk

- A **small set of exchanges, each with one right answer:**
  - peace be upon you / reply
  - how are you / I'm fine
  - "can you make me some daal?" / yes or no (answer "no" if daal isn't learned yet)
  - is it hot / yes
  - thank you / you're welcome
  - bye / bye

  They vary by person and time of day.
- **Mastered phrases stop being asked.** You still hear them; only an occasional one tests you again (spaced review).

## 6. Stars, the mission card and pocket money (agreed)

**Three different stars**, shown as cut-outs on the mission card that fill in as you cook:

| Star | Earned when |
|---|---|
| Ear: *understood* | Everything asked for, right counts, right person. The big one |
| Hand: *cooked well* | Poured to the line, nothing burnt or spilt, flipped on time |
| Lightning: *quick* (Busy) or tick: *no help* (Relaxed) | Speed, or no hints and no translate used |

- The mission card also fills in step by step. At the end it's stamped and becomes a **completion card**, and a day's cards form a collection.
- **Pocket money:** Nani says "I'll give you pocket money for helping. Get it all right and be quick and you get more; burn or spill it and you get less." Each order pays a receipt: *helping + each star*. You never lose money you already have.
- **Success goals are shown at the start**, one line per station the first time ("stop at the line", "flip when it's golden").

## 7. Making the actions clear

- **Pour:** a dashed fill line drawn **inside** the pan or glass, the liquid rising inside it, and the pouring sound rising in pitch as it fills. Nani says "enough" at the line.
- **Watch and tap** (boil, fry, tawa, grill): a **ring round the food** that fills like a clock, with a green section for "now". Real cues (bubbles, brown spots, sizzle, steam) arrive together.
- **Flip:** spatula hand, ring timer, golden spots; the second side puffs up.
- **Roll:** hands on the rolling pin, forwards and back, a dashed target circle that turns green and pings; overdoing it tears the dough.
- **Chop, Fruit Ninja style (Zafar's idea):** vegetables are tossed up; Nani says *which* ones and *how many* ("only the tomatoes", "three onions"). Slicing the wrong one is "Arre re!", no damage. More items and faster throws as you improve.
- **Stir (Zafar's idea):** count *and* speed. "Stir three times, slowly"; a speedometer arc with a target zone; laps counted aloud.
- **Every station, the first time:** a see-through fingertip demo plus a one-line goal. The cue is always on the object, never in the sidebar.

## 8. The station library (verbs)

A station earns its place only if **it's fun on its own and at least one of its settings comes from Kutchi.**

| Verb | Mini-game | Where the Kutchi comes in |
|---|---|---|
| Fetch (pantry) | Tap the named item | Nouns, counts |
| **Pass me** (interrupt) | Pick from 3 look-alikes | Nouns, review of any word |
| Pour | Hold, let go at the line | Half, full, enough, more |
| Watch and tap | Tap when ready (boil, fry, tawa, grill) | "It's boiling", golden, take it out |
| Count in | Tap N times (spoons, pieces) | Numbers |
| Knead | Press and squash | Numbers |
| Roll | Rolling pin to the circle | Big, small, thin |
| Flip | Spatula at the right moment | Flip it, ready |
| **Chop (ninja)** | Slice what's thrown | "Only X", counts |
| Tadka order | Spices in the spoken order | Sequence |
| Stir | Count and speed | Numbers, slowly, quickly |
| **Assemble / plate** | Layers in the spoken order | Sequence, likes, "no X", who it's for |
| **Fill and fold** | Named fillings in, fold along the lines | Nouns, counts, "no chilli" |
| **Fry (several)** | Drop in, lift each when golden | Counts, which ones |
| **Thread** (skewer) | Items onto a stick in the spoken order | Sequence, colours |
| Garnish | Sprinkle where told | Positions (on top, in the middle) |
| *Later:* pipe (jalebi), grind, churn, pat (bajra rotlo) | Rhythm and shape gestures | Counts, shapes |

## 9. Dishes (Kutch and East African Khoja kitchens)

**Phase A builds:** chai, maani, daal, plus **chaat bowl**, **samosa** and **mishkaki** (agreed).

| Dish | Verbs |
|---|---|
| Chai | Pour, watch, count |
| Maani / chapati | Knead, roll, flip |
| Daal (or khichdi and kadhi) | Chop, tadka, stir |
| **Chaat bowl / chana bateta** | Assemble in order, garnish |
| Dahi puri / sev puri | Fill, count, garnish |
| **Samosa** | Fill and fold, fry |
| **Mishkaki with chips** | Thread, grill-flip, fry |
| Chips mayai | Fry, pour, flip |
| Mogo with chilli and lemon | Chop, fry, garnish |
| Makai (corn on the cob) | Grill-turn, garnish |
| Mandazi | Roll, cut into N, fry |
| Dabeli | Fill and assemble (bazaar chapter) |
| Falooda | Assemble in layers |
| Jalebi | Pipe a spiral, fry, soak |
| Sheer khurma (Eid) | Pour, stir, garnish |
| Biryani / pilau | Layer, stir (feast days) |

## 10. Why this scales

1. **A recipe is data:** station calls with slots (what, how many, which order, how, for whom). Orders fill the slots from each customer's tastes and the player's word stages.
2. **Every station must have a Kutchi-driven setting.**
3. **Every station has twists**, so it doesn't feel stale when it comes back.
4. **Three or four stations per order**, about 2 minutes. Big dishes are for special days.
5. **Looking straight down** means tools rotate and hands are reused, so new dishes are mostly ingredient art.
6. **Every mode has a story route and a free-play route from the title screen.** The story route teaches a fixed sequence (a day, a level); the free-play route is open-ended, generates its own orders/rounds leaning towards the player's weakest words, and always gives the player an explicit way to end the session (e.g. Cook's "Close the kitchen") that leads into the same summary and pocket-money flow as the story route. Wave 3's open kitchen (below) is the first example.

## 11. Phase A checklist

**Shared systems:**
- the three pill shapes and stage-fading item labels
- the mission card with star cut-outs, which becomes the completion card
- pocket money and success goals
- Nani's "pass me" interrupt
- varied greetings and questions

**Stations:**

| Status | Stations |
|---|---|
| Rebuild | Pour, watch and tap, flip, chop (ninja), stir (count and speed) |
| New | Assemble, fill and fold, fry, thread |

**Recipes as data:** chai, maani, daal, chaat bowl, samosa, mishkaki.

**After each step:** the "can you win without Kutchi?" audit and Zafar's feedback.

**Words needed from the family** (English placeholders until then) are in `docs/Nani jo Ghar — Questions for Mum (Round 2 — Cooking).md`.

---

## 12. Phase A: what was built (24 Sept 2026)

Open `cook.html`. **Station lab** on the title screen runs any station on its own, with a random order each time. Tick "Nani helps" for the first-time guidance.

**Shared systems:**
- **Word pills** `[speaker | Kutchi | translate]` everywhere: speech, the mission card, choices, "pass me". English placeholders are grey italic and spoken in an English voice; Kutchi uses the half-speed Gujarati placeholder voice.
- **Item labels** under every ingredient bowl. They fade by word stage (text, then speaker only, then none). Tap to hear.
- **The mission card:**
  - the order as pills; well-known words show as "•••" so you have to listen;
  - ticks as you add things;
  - step chips;
  - three star cut-outs (ear, hand, lightning in Busy or tick in Relaxed) that fill or grey out *as it happens*;
  - stamped "Served!" at the end.
- **Completion cards** at the end of the day, with the reasons ("Ear: 2 khun, they asked for 3").
- **Pocket money** as a receipt: 5 for helping, then +5 ear, +3 hand, +3 lightning/tick, plus upgrades. Nani explains the three stars once, before day 1, and nobody ever loses money.
- **Nani's "pass me"** (*Muke hikdo … dine*):
  - she slides in with three look-alikes;
  - she asks for any word you've met, weakest first;
  - Relaxed pauses the cooking; Busy keeps it cooking (the pan can boil over while you help her);
  - it happens mid-boil, mid-tawa and between stations.
- **Small talk:** peace be upon you, how are you (placeholder), "can you make me …?" (placeholder). Phrases you've answered right 3 times are just heard, with an occasional re-test.
- **First-time help:** a goal line per station (in the sidebar, never over the game), a see-through fingertip demonstrating the gesture, and verdict words on the action ("Perfect!", "Too much!", "Burnt!", "It puffed!").

**Stations (16):**

| Station | How it plays | Where the Kutchi comes in |
|---|---|---|
| Fetch | Pantry with look-alike decoys | The order's items |
| Pass me | See above | Any known word |
| Pour | Dashed fill band inside the pan, liquid rising, pitch rising | Water/milk; *no dudh* |
| Boil | A ring around the pan; tap the knob or pan in the green | — |
| Count in | Tap the sugar (next to look-alike salt and flour), then ✓ | *bo khun* / *no khun* |
| Knead | Hands press the dough | — |
| Roll | Two hands on the pin, drag up and down to the circle; overdo it and it tears; decide how many | *trae maani* |
| Tawa | Ring on the chapati; the spatula hand flips it; tap again to puff | — |
| Chop | Fruit Ninja: vegetables fly up; slice only those Nani named, as many as she said | *only bo dungri* |
| Tadka | Spices (heaped bowls, labelled) into hot oil in Nani's order | The sequence |
| Stir | Ladle hand, laps counted aloud, speedometer | Number + *slowly* / *quickly* |
| Assemble | Chaat toppings in the customer's order; "no X" means leave it out | Sequence, *no X* |
| Fill | Fillings named by the customer; leave out the "no" ones | Nouns, *no X* |
| Fold | Swipe along three dashed lines | — |
| Fry | Several in the oil at once, each with its own ring; lift each when golden; more on the tray than asked for | Count |
| Thread | Pieces onto the skewer in order | Sequence |
| Grill | Ring timer; turn twice | — |

**Recipes (data with variable slots):**

| Dish | Slots |
|---|---|
| Chai | Cups, milk or no milk, sugar count or none, elchi or ginger |
| Maani | How many |
| Daal | Onions and tomatoes to chop, tadka order, stir count and speed |
| Chaat bowl | Topping order, "no X", potatoes to chop |
| Samosa | How many, fillings, "no X" |
| Mishkaki | Skewer order, chips or not |

Customers have tastes: Nana, no chilli in his chaat; Ma, no milk and ginger in her chai; Ali, extra sev.

**Six story days:** chai (Nani's demo first), maani, daal, chaat bowls, samosa, Eid mishkaki. Then free cooking (an open kitchen) and quick orders.

**Free cooking is Nani's open kitchen (Wave 3):** customers keep arriving on their own — a gentle queue in Relaxed, overlapping a little sooner in Busy — each with a generated order leaning towards the player's weakest words (existing spaced-review logic, unchanged). A "Close the kitchen" button in the sidebar is always there while it's open; pressing it stops new customers arriving (finishing whoever's already ordering) and goes straight into the usual day summary and pocket money. "Quick order" is unchanged: one customer, then the summary, no closing needed.

### 12b. What's built now (after Waves 1–3, checked in Wave 4, 25 Sept 2026)

The Phase A list above is the first build. Since then the stations have become building blocks, and the story dishes run on combined stations:

- **Building blocks.** Each verb is one mechanic file (`js/cook/mechanics/`). It can run on its own or inside a zone of a combined station (`js/cook/zone.js`). Difficulty levels are data (`data.mechanics.<id>.levels`; a combined station's in `data/stations/<id>.json`). Recipes are wholly data: slots, what's said, the ladder, the steps.
- **Order ladder** on the order card: speaker · word or "•••" · 👁 · translate per row. One dot per item, never per unit. A dashed line means a sequence, and *ne poi* is said for it. "No X" rows are placed at random. A person's rows carry their face (the Chai tray). Hidden words next to each other share one "•••".
- **Help costs.** Being shown the answer costs the ear star: the hesitation glow, the highlight after two misses, 👁, translate (including "pass me"). Hearing it again costs the no-help star. Busy help drains the patience ring.
- **Result card:** stars on the left; on the right, "they asked / you did" in Kutchi pills and one "next time" tip per missed star.
- **Combined stations** (one screen, several zones):
  - **Chai tray** (chai, all levels): water, tea, then light the knob on the back burner. Each person says their cup (milk or not, sugars or none, and from level 3 an extra and half or full). Milk jug, sugar bowl and salt are there for every cup. The knob must be turned down on the green. Pour each cup to a line, then the tick. Graded per cup, per person, with a recast from that person.
  - **Maani line** (maani): two dough bowls (maani, bajr jo maani) → chakla → tawa (two tawas from level 2, big/small from level 3). How many of each is spoken. You press the tick.
  - **Mishkaki grill** (mishkaki): the threading board feeds a rack. Each skewer has its own ring on the grill: turn it twice, then lift it. The chips basket is always offered. The plate is graded per kind and count.
  - Roll → Tawa: the lab's proof of zones.
- **Keepers, polished:** the chaat glass bowl (visible layers; the customer checks layer by layer); chop with a mid-round switch, look-alikes, graded afterwards (rounds in random order since Wave 4); tadka burns if you're slow and hides the order at higher levels; samosa fill (spoons per filling) → fold as many as you decide → fry (the tray holds extra; "lift the samosas, leave the chips" at level 3); stir on a track with a fixed speed dial.
- **Pass me** in the sidebar (never over the game), in the pantry (never a word from the order) and at the slower stations.
- **Open kitchen** is free cooking: customers keep coming until you close it.
- **The pantry (fetch)** is now only in the Station lab: no story recipe fetches any more (each station lays out what it needs, decoys included).
- **Tests:** `build/test_cook.py` plays every station at levels 1–3 (`--lab`, `--level`), combined stations, the story days (`--days`, `--canvas` for speed), the open kitchen and the order model (`--orders`), at six screen sizes.

## 13. Audit: can you win without understanding the words?

| Decision | Before Phase A | Now |
|---|---|---|
| Chai: milk? how much sugar? extra? how many cups? | Only sugar count and elchi varied | **All vary, all spoken** |
| Pantry | Basic items were recipe memory | Every item comes from the order; look-alike decoys (sugar/salt, water/milk, cumin/mustard) |
| Tea leaves at the stove | Fixed step | Picked from look-alike bowls |
| Maani | Count | Count |
| Chopping | Not language | **Which vegetable and how many** |
| Tadka | Order | Order |
| Stir | Count | Count **and speed** |
| Chaat, samosa, mishkaki | — | **Sequence, fillings, "no X", counts** |
| Nani's "pass me" | — | **Any word, any time, look-alike choices** |
| Timing (boil, tawa, fry, grill), kneading, folding | Hands only | Hands only (by design: the fun break between listening) |

**Status after Wave 3 (Wave 4 check, 25 Sept 2026):** see `docs/cook-with-nani-kutchi-audit.md`, section "After Wave 3". Every system-level leak from the pre-wave audit is closed: help costs, fixed step chips, optional steps always offered, counts never shown, fixed dial bands, random decoys, a ladder whose shape gives nothing away. Wave 4 fixed the last two small ones: the dot groups on the card, and the fixed first chop round. What's left:

| Leak | Severity | Owner |
|---|---|---|
| Decision words still English placeholders (*no*, *slowly/quickly*, *half/full*, *big/small*, *vegetable/mixed*, *only/now*, *lift/leave*, several toppings) are readable and heard in English | High | The family's words (Round 2) |
| Chai tray: cups only for the people ordering, and each speaks with their own face, so the count and "who" are given (kinship words decide nothing yet) | Medium | Next Chai tray pass |
| Stage-2 label speakers are free, so you can match sounds | Medium | Later |
| Serving to the right person is checked only on the Chai tray | Medium | Open kitchen pass |
| Chaat always holds chickpeas and potato; tea is always *chai*; no ghee slot | Low | Data / later |

**Remaining weaknesses (Phase A list, still true):**
1. **Placeholder words.** Dishes and toppings still in English (chickpeas, yoghurt, mince…) are "understood" by any English speaker. The family's Round 2 answers fix this.
2. **Stage-1 reading.** A brand-new word is shown as text on both the card and the label, so a reader can match letters the first time. That's intended (it's how it's taught), and from stage 2 the label is speaker-only.
3. **The placeholder voice is Gujarati**, so pronunciation isn't Kutchi yet.

## 14. Open questions for Zafar

- Station feel: which stations are fun, which are fiddly? The Station lab is the quickest way to judge.
- Timing windows (boil about 1.2 s, tawa about 0.9 s) and ninja speed: too hard for a 5-year-old?
- Should "pass me" also happen in the pantry, or only at the stove?
