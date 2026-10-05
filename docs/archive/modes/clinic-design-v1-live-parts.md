# The clinic: the original v1 design (live parts) and the first build log (25 Sept 2026)

> Archived 5 Oct 2026 by the docs rewrite (D1), moved out of `docs/game-design/modes/clinic.md`. Copied word for word and not corrected: it still says stars, coins, hands, a lollipop, *nar*, an 8–10-person waiting room, Arc 3 Ch4 and a quilt patch. The current design is `docs/game-design/modes/clinic.md`; the rulebook wins where they differ.

# Live parts of the original design (clinic-design v1)

> from: docs/archive/clinic/clinic-design-v1.md § Q1 The three rules, as the clinic reads them

#### Q1 The three rules, as the clinic reads them

**Consistent controls inside each mini-game** (UX §12, clarified 26 Sept: not tap-only; swipe, drag, stir are fine; the same *kind* of action always uses the same gesture, and a mini-game's gestures never change between its levels).
- **The belt is tap at every level.** P4's "tap at level 1, drag from level 2" and P11's decision 5 are overturned: tapping an item hops it to the next empty dish at every level; the level-3 order row is judged by the *order of taps*, never by which dish it was dropped on. (Whichever mode reuses `belt` inherits this.)
- **Every healing game has two gestures at most, fixed from level 1.** One is shared by all nine: **tap the dish, tap the spot** (take a tray item, apply it: the jug pours the right amount on a tap, one drop per tap, one blanket per tap, one wipe per tap). The other is that game's **working gesture**, named per game and never changed by level: wrap = drag round the track (H1), stitch = drag dot to dot (H2), pluck = drag out along the arrow (H3, H13), brush = swipe in a direction (H4). H5, H6, H9 and H12 have no second gesture (taps and, in H9, the voice). A level adds Kutchi, never a gesture: where a level used to add a step with a new gesture, the gesture is now there from level 1 with fewer of it (a two-word brush chain, a stitch line with two dots).
- **No press-and-hold anywhere** (Cook's finding). The thermometer press, the X-ray plate held over the leg, "lift on green", the towel held down and the stethoscope held on *in* all go: they become a tap, or the game is cut (H19).
- **The stage variants** (W, D, E) were already single-gesture taps; the speaking ones stay on `tell` with the pills as the fallback.

**Auto-tick, no mid-round verdicts** (UX §11). Each doctor's line on the card ticks **when the step closes**, i.e. when the child puts the item down (taps the next dish, or Done), not on the Nth tap, so the tick confirms *the step*, never *the number*: a count still never ends itself (the Sceptic's rule survives the auto-tick). A wrong thing simply happens without comment (the wrong dropper drops and the patient pulls that taste's face; the wrong toe wiggles; the bead comes out before the seed) and is counted in the end review's accuracy badge; nothing slips back, buzzes or says *Arre re!* from level 2. Level 1 keeps its one gentle, one-time correction (the doctor repeats the line once) as onboarding. The throbbing hint (the next dish pulses after 8 s of nothing) is free; "?" and the light bulb cost as before.

**The card is the master; the voice is the doctor's.** In this mode the instruction card's voice is **the doctor**, not Nani: his line is the card, he reads it, and in play he is a voice and a pair of folded hands, never a pointer. **The patient** is the other voice: sides (*[EN: my left knee]*), the answers (*haa/nar*, *[EN: still cold]*) and every reaction, which is where the comedy lives (R2.7 stands). Nani appears only in story moments and the send-off; Kasuku's echo is a story flourish, not a hint. One card, the play area, one light bulb.

> from: docs/archive/clinic/clinic-design-v1.md § Q4 The healing library: twenty scored, nine kept

#### Q4 The healing library: twenty scored, nine kept

**Scoring** (the five questions, 1–5 each; the sum out of 25) and the verdict. "Same as" names the mini-game elsewhere that made it redundant.

| # | Game | Do | Challenge | Fun | Instruction | Novel | Sum | Verdict |
|---|---|---|---|---|---|---|---|---|
| H1 | The kicking knee | 4 | 5 | 5 | 5 | 4 | 23 | **Keep**, absorbs H14 |
| H2 | Plaster (the scrape) | 5 | 3 | 3 | 4 | 3 | 18 | **Keep as level 1 of H2/H8** (the first-ever game) |
| H3 | The seed in the ear | 4 | 5 | 5 | 5 | 5 | 24 | **Keep** |
| H4 | Brush up, brush down | 4 | 5 | 5 | 4 | 5 | 23 | **Keep** |
| H5 | The taste test | 5 | 5 | 5 | 5 | 5 | 25 | **Keep** |
| H6 | Too hot, just right | 5 | 5 | 5 | 5 | 5 | 25 | **Keep** |
| H7 | Say aah, hardar dudh | 3 | 4 | 3 | 4 | 1 | 15 | Cut: same as Cook's tadka and Chai tray (and Monsoon S5a); Nani's remedy is Ch5's in Cook anyway |
| H8 | Stitches | 4 | 5 | 4 | 5 | 4 | 22 | **Keep, merged with H2** |
| H9 | The boing | 4 | 5 | 5 | 5 | 5 | 24 | **Keep** |
| H10 | Bubbles and burps | 4 | 3 | 5 | 3 | 3 | 18 | Maybe later (Kutchi 3; the speed word already lives in H6's fan) |
| H11 | Atchoo! | 4 | 4 | 4 | 4 | 2 | 18 | Cut: the sneeze catch is Monsoon S3a's `cover`; the chai is Cook's |
| H12 | Drops and the chart | 4 | 5 | 4 | 5 | 5 | 23 | **Keep** |
| H13 | Sore feet | 4 | 4 | 5 | 4 | 4 | 21 | **Keep, slimmed** (no wrap path: H1 owns wrapping) |
| H14 | The cast | 4 | 4 | 4 | 4 | 2 | 18 | Merged into H1 (a wrap with a hard finish) |
| H15 | Hic! | 4 | 4 | 5 | 4 | 2 | 19 | Maybe later: counting aloud is Snap 4b and H9 (which counts *down*) |
| H16 | The beetles | 4 | 4 | 5 | 4 | 3 | 20 | Maybe later: the strokes are H4's, the colour pop is Find it's; and decision 1 |
| H17 | Rub it in | 3 | 3 | 3 | 4 | 1 | 14 | Cut: a knead count, same as Monsoon S4b, Dress T13, Who R1/R6 |
| H18 | The stuck neck | 3 | 4 | 3 | 4 | 2 | 16 | Cut: directions are H4's; head-turn frames per patient for one game |
| H19 | Breathe in, breathe out | 3 | 3 | 3 | 3 | 2 | 14 | Cut: press-and-hold was the mechanic; without it there's nothing |
| H20 | The knots | 3 | 4 | 3 | 4 | 1 | 15 | Cut: tap-the-named-spot is D2, the press is a knead; needs the back view |

**The nine kept, in build order:** set 1 = **H2/H8 Wash, stitch, plaster**, **H1 The kicking knee**, **H3 The seed in the ear**, **H5 The taste test**, **H6 Too hot, just right**; set 2 = **H4 Brush up, brush down**, **H9 The boing**, **H12 Drops and the chart**, **H13 The foot bath**. Between them they carry every slot the pipeline needs: count (H1, H2, H3, H9, H12, H13), colour (H1, H2), side (H1, H2, H3, H12, H13), order *pela/ne poi* (H2, H3, H5), direction (H4), speed *aastethi/jaldi* (H6), hot/cold and *just right* (H6), *wadho/nindho* (H2, H4, H12, H13), real food words (H5, H13), spoken numbers (H9), *nar* (H12), and the patient's voice for every side. There is no set 3: phase 4 is art.

Each kept game below: the five answers, the gestures (fixed from level 1), the levels (Kutchi only), the reuses.

##### H1 Knee and leg: the kicking knee (and the cast)
*Ailments:* a bump from the puddle (Ali) → a bandage; from level 2, a comedy break from the mango tree → a cast. *Tray:* the hammer, a bandage (colour from the belt) · the X-ray plate, a cast roll (colour), crutches. *Gestures:* tap the dish, tap the spot; **wrap = drag round the track**, one lap = one turn.
1. **What do you do.** Tap the hammer, tap the knee: the leg kicks. Tap the bandage, drag round the knee the number of turns said (the tally on the badge, never the target); tap the next dish or Done to close the step. Level 3: drag round the knee, then the leg, then the knee, in the called order (the figure-of-eight across two hotspots). The break: tap the plate, tap the leg: the X-ray shows a bone with a kink and a face; tap the kink: *clonk*, straight; tap the cast roll, wrap *char* turns; tap the crutches, tap the patient: they hop off.
2. **Where is the challenge.** The count of turns (*ba, trae, char*), the bandage's colour (decided at the belt, used here), the side (*[EN: my left knee]*, the patient's voice; a wrap on the other knee is a miss in the review), and at level 3 the path order (*pela … ne poi …*). Level 1: tap + wrap freely. 2: + count and colour. 3: + side and path; the break as an ailment from level 2.
3. **Where is the fun.** The reflex kick: the whole patient jerks, the dishes on the counter rattle, Kasuku squawks; the bone with a face; the *clonk*; the hop-off on crutches into the send-off.
4. **Where is the instruction.** Card: *[EN: Tap the knee]* · *[EN: Bandage]. Ba [EN: turns]* · *Pela [EN: knee], ne poi [EN: leg], ne poi [EN: knee]* · *[EN: Blue cast]. Char [EN: turns]*. Patient: *[EN: My left knee]*. The doctor reads each line as it comes at level 1, as one list at level 2+.
5. **What is novel.** A tap whose result is the patient's *whole body* moving (nothing else in any mode does that); the only wrap-by-count anywhere (Dress T18's bobbin is a stir, no count); the X-ray reveal.
*Reuses:* `wrap` (built), `count`, `stick`; new `tap` (the kick frames), `xray` (small: plate, kink, clonk). *Age* 5+ (the break lands for Zayn). *Score 23.*

##### H2/H8 Hand, finger, knee, arm, leg: wash, stitch, plaster
*Ailments:* a scrape (level 1: the first-ever healing game) → wash, dab, plaster; from level 2 a cut from the shed door (a pink zig-zag with 2–6 dots, no blood) → wash, stitch, plaster. *Tray:* the paani jug, a cloth, a thread (colour), the plaster (a design). *Gestures:* tap the dish, tap the spot (the jug pours the right amount on a tap); **stitch = drag the needle dot to dot** (Dress up's `stitch`, deliberately shared: on a body, with a count and a size order instead of a motif).
1. **What do you do.** Tap the jug, tap the scrape: it pours, the ring goes green. Tap the cloth, tap the spot: a dab. Tap the plaster (tap one of three designs first, ungraded), tap the part. The cut: after the wash, tap the thread, then drag dot to dot; each crossing is a stitch; the doctor ties a bow; then the plaster.
2. **Where is the challenge.** Level 1: three steps, one word each, said one at a time. 2: the steps as one *pela/ne poi* list up front (the tray's dishes are the order), the count of stitches (*trae*), the thread's colour. 3: the order by size (*pela wadho, ne poi nindho*: the big gap first), the side (*[EN: my right hand]*).
3. **Where is the fun.** The squeal *[EN: cold!]* when the water lands; an "oop" per stitch; the bow tied like a shoelace; the plaster design collection (Maryam's).
4. **Where is the instruction.** Card: *Pela paani* · *Ne poi [EN: cloth]* · *[EN: Red thread]. Trae [EN: stitches]* · *Ne poi [EN: plaster]*. Patient: *[EN: My right hand]*.
5. **What is novel.** The tiniest healing game there is (three one-word steps); the only place the size words order a *sequence* (the big gap first, then the small).
*Reuses:* Cook's `pour` (tap form), `lift` (dab), `stick`, Dress up's `stitch`. *Age* 5+. *Score 22 (18 at level 1).* Decision 3 stands: on skin, cartoon, no blood.

##### H3 Ear: the seed in the ear
*Ailment:* the cousin's ear, always something in it (a sesame seed, a bead, a marble, a tiny sock). *Tray:* the torch, tweezers, a cotton bud, the green drops. *Gestures:* tap the dish, tap the spot (torch → ear; bud → the canal, one tap per swirl; drops → one squeeze per tap); **pluck = drag the thing out along the arrow** (Toca Doctor's splinter).
1. **What do you do.** Tap the torch, tap the ear (level 3: the ear the patient named): the close-up opens, a cartoon cave with 1–3 things in it. Tap the tweezers, drag each thing out in the called order. Tap the bud, tap the canal *trae* times. Tap the drops, tap the ear *ba* times; Done.
2. **Where is the challenge.** Which thing first (*pela [EN: seed], ne poi [EN: bead]*: nouns in order), the scrub count, the drop count, the side. Level 1: one thing, clean, drops, no counts. 2: two things in order, both counts. 3: three things, the side, the drops' count in the patient's voice (*[EN: two drops, my left ear]*: the count from the patient, not the doctor).
3. **Where is the fun.** Each pull has its own noise (the sock squeaks); *[EN: that tickles!]*; the torch beam on the cave.
4. **Where is the instruction.** Card: *[EN: Look in the ear]* · *Pela [EN: seed], ne poi [EN: bead]* · *[EN: Clean it] trae* · *Ba [EN: drops]*. Patient: *[EN: My left ear]* · *[EN: Two drops]*.
5. **What is novel.** Nouns in a called order pulled from a cave (Tidy's `order` sorts things *into* places; Snap 4c pegs prints; nothing pulls things out); a count said by the *patient*.
*Reuses:* `check`'s beam, `drops` (built); new `pluck` (shared with H13). *Age* 5+. *Score 24.*

##### H4 Tooth: brush up, brush down
*Ailment:* a sugar bug (Arc 1's sweets) and a cracked tooth. *Tray:* a toothbrush, the tiny drill, the filling paste. *Gestures:* **brush = swipe on the tooth row in the called direction**; tap the dish, tap the spot (drill: one tap per shoo; paste: tap the shape, tap the crack).
1. **What do you do.** The mouth close-up (eight big teeth at ×4). Tap the brush, then swipe each direction the doctor says, in order; foam grows with every stroke. Tap the drill, tap the named tooth: the bug hops out; tap it *ba* times: into the jar. Tap the paste shape that fits the crack, tap the crack: the tooth twinkles.
2. **Where is the challenge.** The direction chain (*[EN: up, up, down, left]*: 2 words at level 1, 4 at level 2, 6 at level 3 with *[EN: my left / my right]*), the tooth by size (*wadho / nindho [EN: tooth]*; level 3 *[EN: the second from my left]*), the drill count, the paste colour at level 3 (*[EN: the white one]*). The fit is visual and ungraded for the ear.
3. **Where is the fun.** The foam; the bug with eyebrows; the twinkle.
4. **Where is the instruction.** Card: *[EN: Brush: up, up, down, left]* · *Wadho [EN: tooth]. Ba [EN: times]* · *[EN: Fill it]*.
5. **What is novel.** The only direction *chain* in any mode (Simon with body-free words), and the only place *up/down/left/right* are all used together.
*Reuses:* `body.js` close-up, `count`; new `brush`, `fill`. *Age* 5+. *Score 23.* (H16's comb strokes were this mechanic on hair: cut.)

##### H5 Tongue: the taste test
*Ailment:* a tongue striped in colours from the Eid sweets. *Tray:* three droppers (*limu, khun, loon*: real words), paani. *Gestures:* tap the dish, tap the tongue (level 3: the named stripe). No second gesture.
1. **What do you do.** The close-up. Tap a dropper, tap the tongue: the face plays, a stripe clears. Level 2: the three in the called order. Level 3: the count per taste, the stripe's colour. Tap paani, tap the mouth: rinse and spit.
2. **Where is the challenge.** Which dropper (the three are the same shape; the word is the only difference), the order (*pela limu, ne poi loon, ne poi khun*), the count (*ba limu*), the colour of the stripe to hit. A wrong dropper still drops and clears a stripe; the review counts it.
3. **Where is the fun.** The sour face puckers the whole screen; the salt face; the happy face; the spit into the bowl (the sound is the joke).
4. **Where is the instruction.** Card: *[EN: Stick out your tongue]* · *Pela limu* · *Ne poi loon* · *Ne poi khun* · *Paani!*
5. **What is novel.** Real food words heard in a body frame, with a face per word: the only cross-mode *review* of Cook's nouns that isn't cooking.
*Reuses:* `drops`; new `taste` (the tongue, the stripes, the faces). *Age* 5+. *Score 25.*

##### H6 Head: too hot, just right
*Ailment:* a fever, or a chill. *Tray:* the thermometer, the cool cloth, blankets, a paper fan. *Gestures:* tap the dish, tap the patient (the strip on the forehead; the cloth laid; one blanket tucked per tap; tap a blanket on the patient to take it off; the fan: tap the dish, then tap near the face at the called cadence). No holds: the thermometer is a tap and the doctor reads it aloud.
1. **What do you do.** Tap the thermometer, tap the forehead: the doctor says *[EN: Hot!]* / *[EN: Cold!]* (nothing readable on the strip). On hot: the cloth; on cold: a blanket. The doctor asks *[EN: How do you feel?]*; the patient answers; the child does the next thing; until *[EN: just right]*, then Done.
2. **Where is the challenge.** Hearing hot/cold, then the patient's answers (*[EN: still cold]* → another blanket; *[EN: too hot]* → one off, or the fan; *[EN: just right]* → stop: a blanket after *just right* is a miss). Level 1: one exchange. 2: two or three, either direction. 3: the count said up front (*trae [EN: blankets]*) and the fan's cadence (*aastethi / jaldi*, drafts).
3. **Where is the fun.** Nana ending up under *char* blankets with only his moustache showing; the fan blowing his cap off on *jaldi*.
4. **Where is the instruction.** Card: *[EN: Take the temperature]* · *[EN: Hot!]* · *[EN: How do you feel?]* · *Trae [EN: blankets]* · *[EN: Fan], jaldi!* Patient: *[EN: still cold]* · *[EN: too hot]* · *[EN: just right]*.
5. **What is novel.** The only mini-game driven by a *conversation*: the patient's answer decides the next step and when to stop, so "enough" is heard, not seen. The only cadence row (a speed word judged by tap rhythm).
*Reuses:* `tuck` (built), `lift`; new `warm` (the exchange loop, R3's Just right). *Age* 5+. *Score 25.* The calm one: the end of a Busy morning.

##### H9 Arm: the boing (the injection)
*Ailment:* the jab before the village trip (Arc 5), or the flu. *Tray:* cotton, the syringe (**the doctor's**: on the tray, only he lifts it), a plaster, a lollipop. *Gestures:* tap the dish, tap the arm (cotton: one wipe per tap); the voice (S6).
1. **What do you do.** Tap the cotton, tap the upper arm *trae* times. *[EN: Count with me!]*: say *trae … ba … hakro* aloud (the pills as the fallback); on the last number the doctor's syringe (huge, striped, with a flag) goes *boing*. Tap the plaster, tap the arm; tap the lollipop, tap the patient's hand.
2. **Where is the challenge.** The wipe count; the count-down spoken from *ba* (level 1), *trae* (level 2, + the side), *panj* (level 3, + the patient asks for a plaster colour: *[EN: the red one]*, the child taps it from three). A missed number: the doctor waits, *[EN: Say it again?]*; null never blocks.
3. **Where is the fun.** The hair standing on end; *[EN: All better!]*; the lollipop; E2's *[EN: I was scared, now I'm happy]* afterwards.
4. **Where is the instruction.** Card: *[EN: Wipe it] trae [EN: times]* · *[EN: Count with me!] trae, ba, hakro* · *Ne poi [EN: plaster], ne poi [EN: lollipop]*. Patient: *[EN: My left arm]*.
5. **What is novel.** The only count *down* anywhere (Snap 4b, Who 1a and Dress T15 count up); a tool the child never touches (the safety rule made into a joke).
*Reuses:* `knead`'s count in tap form, `tell` (S6), `stick`. *Age* 5+. *Score 24.* Decision 2 stands.

##### H12 Eye: drops and the chart
*Ailment:* a sore, itchy eye. *Tray:* the drops, the pointer, an eye patch (pirate, bandhani). *Gestures:* tap the dish, tap the spot (one drop per tap; the patch on an eye; the pointer, then tap the chart picture). No second gesture.
1. **What do you do.** The patient: *[EN: My left eye]*; the doctor: *ba [EN: drops]*: tap the drops, tap that eye twice. *[EN: Cover the other eye]*: tap the patch, tap the *right* eye. Tap the pointer, then tap what he names on the chart; the rows shrink.
2. **Where is the challenge.** The side from the patient, the count from the doctor (two voices); the patch on **the other** side (the child must hold "the other one" in mind); the chart: known nouns (fruit, kitchen things) with *wadho/nindho* and a *nar* row (*nindho limu, nar wadho*, draft *nar*). Three calls at level 1, five at level 3. Level 1: one drop, no side, three calls. 2: count and side. 3: the other side, big/small and *nar* on the chart.
3. **Where is the fun.** The pirate patch; the chart's smallest row is a tiny Kasuku the patient squints at.
4. **Where is the instruction.** Card: *Ba [EN: drops]* · *[EN: Cover the other eye]* · *[EN: The chart.] Aamo!* · *Nindho limu*. Patient: *[EN: My left eye]*.
5. **What is novel.** The *reversed* side (the only "the other one" row in any mode); the chart as a spaced review of every noun the child knows, rows shrinking.
*Reuses:* `drops` (built), the shared `which`; new `chart`. *Age* 5+. *Score 23.*

##### H13 Foot and toe: the foot bath
*Ailment:* the wedding dancing (Arc 2), or a thorn from the field (Arc 5; the hen's version at the vet). *Tray:* the tub, the hot paani jug, the loon spoon, tweezers, a plaster. *Gestures:* tap the dish, tap the spot (the jug pours to the band on a tap; one spoon per tap); **pluck = drag the thorn out along the arrow** (H3's). The wrap path is gone (H1 owns wrapping): the thorn's toe gets a plaster.
1. **What do you do.** Tap the jug, tap the tub; tap the spoon, tap the tub *hakro* time; the feet go in, steam, ten toes wiggle. Tap the toe the doctor names: it wiggles alone (a wrong toe wiggles too, and the patient giggles: a reaction, not a verdict). Thorn: tap the tweezers, drag it out; tap the plaster, tap that toe.
2. **Where is the challenge.** *[EN: hot] paani*, the salt count (*hakro chamcho loon*), then **which toe**: *wadho / nindho [EN: toe]*, and at level 3 the side too (*[EN: my left, the small one]*), on ten near-identical targets. Level 1: the bath + one toe by size. 2: the salt count. 3: the side and the thorn.
3. **Where is the fun.** The *[EN: ahh]* as the feet go in; the wiggle; the thorn's pop.
4. **Where is the instruction.** Card: *Pela [EN: hot] paani* · *Ne poi hakro chamcho loon* · *Wadho [EN: toe]* · *[EN: Pull it out]* · *Ne poi [EN: plaster]*. Patient: *[EN: My left, the small one]*.
5. **What is novel.** Size and side combined on one body (ten toes: the only target set where *wadho/nindho* and *my left/right* are both needed to pick one).
*Reuses:* Cook's `pour` (tap form), `add`, `pluck` (H3), `stick`. *Age* 5+. *Score 21.*

**Maybe later** (one line each): **H10 Bubbles and burps** (Toca's tummy maze; the best joke in the pool; comes back if a count-and-speed game is wanted after H6 is playtested). **H15 Hic!** (count-up aloud then *Boo!*; if Snap 4b's counting lands well, the boo is a free comedy send-off for the mouth). **H16 The beetles** (colour whack-a-mole in the hair; only if the family is fine with bugs, and then as a `which`-by-colour, not strokes). **H11 Atchoo!** (only the *panj* sneezes idea is worth keeping: a count that means *stop reaching*; could become a row inside H6). **H7's honey spoons** (a `count` unit; a throat could join H6 as "say aah" at the temperature step). **H18/H20** (if the back view and head-turn frames get drawn for another reason, the knots and the neck are cheap directions-on-a-body reviews). **H17, H19, H14** stay cut (nothing of their own).

**Distinctness across modes.** Read against Monsoon, Tidy up, Snap, Dress up and Who did it?'s pipeline designs:
- *Deliberately shared, the clinic owning it:* `belt` (Tidy 2c, Dress 3b, Snap 1c, Who 2b), the bench's `call` on `which` (Dress 1a), `where` (Dress 2a's tape), D1's yes/no-decides (Snap 5d, Who 3d), the feelings words at the send-off (Tidy 5c, Monsoon S5b), left/right as data (Snap 2b).
- *Deliberately shared, another mode owning it:* Dress up's `stitch` (H2/H8), Cook's `pour` in tap form, `count`, `tuck`/`lift`, `tell`.
- *Cut for being the same as elsewhere:* H7 and H11's drinks (Cook's tadka and Chai tray; Monsoon S5a is already the sanctioned cameo), H11's sneeze catch (Monsoon S3a), H17 (a knead count: Monsoon S4b, Dress T13, Who R1/R6), H15 (counting aloud: Snap 4b, Who 1a, Dress T15), H16's strokes (H4) and colour pop (Find it, Who R8), H18/H20 (D2 + H4).
- *Nothing kept duplicates a kept mini-game inside the clinic:* one game owns wrapping (H1), one owns stitching (H2/H8), one owns directions (H4), one owns the conversation (H6), one owns the count-down (H9), one owns "the other side" (H12), one owns size × side (H13), one owns nouns-in-order-out (H3), one owns food words (H5).

> from: docs/archive/clinic/clinic-design-v1.md § P1 The pipeline

#### P1 The pipeline

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

> from: docs/archive/clinic/clinic-design-v1.md § P2 Stage 1, the waiting room

#### P2 Stage 1, the waiting room: "Who's next?"

The bench by the door holds 2–5 people. The doctor (hands folded, looking at the child) says who to bring in; the child taps that person; they get up and walk to the examination bench, greeting the doctor (*Salamun alaykum* / *Wa alaikum salaam*; formal for elders). Nobody on the bench reacts until tapped, seats are shuffled every round, and a call is only made when at least two people could be meant (R2.2's rules, kept). The people are **kinds**, not names, because kinds are the lesson: *girl, boy, old man, old woman, baby (on Ma's lap), auntie, uncle*; the family are named on top (*Nana, Nani, Ma, Ali, Big Ma*), so the same bench teaches kinship in review.

| Variant | Level | The doctor says | The child does | What the Kutchi carries | Reuses |
|---|---|---|---|---|---|
| **W1 Bring in the girl** | 1 | *[EN: Bring in] [EN: the girl].* Bench of 2 at the first session, 3 from the second | Taps the right person | One word: the kind (7 kinds; 3 on the bench). A wrong tap: that person shakes their head and sits; the doctor repeats | `call` (new; the bench and the walk); the shared `which` module for the decoys (never two of the same kind at level 1) |
| **W2 The old man in red** | 2 | *[EN: The old man] [EN: in red].* Two or three old men in different colours; later two slots that both matter (*the girl in green*, with a boy in green and a girl in red on the bench) | Taps the one both words fit | Kind + colour (E60–E71). At the top of level 2, kind + *wadho/nindho* (the big boy, the small girl: real Kutchi today) | `call` + `which` (attribute-and-decoy: the decoys share one of the two words, never neither) |
| **W3 You call them** (speaking, S5) | 2+ | The doctor shows the child the card (the kind's picture, or its text at the reads stage) and nods at the bench | Says *{kind}, [EN: come]* to the bench; the person who matches what the recogniser heard stands up (a wrong hearing: the wrong person stands, looks puzzled, sits) | Production: the closed set is the kinds on the bench (3–5) | `tell` (the pills as the fallback; parent ✓) |
| **W4 Busy bench** | 3 | Two calls in a row (*pela the baby, ne poi the old woman*), two examination benches; comfort rings on everyone waiting | Taps both in the called order | Order words + two kinds; the rings make speed count (the stopwatch badge) | `call` with `order: 2`; the comfort ring from R2 |

**Levels:** 1 = one word, bench of 2–3, kinds only; 2 = two words (colour or size), bench of 3–4, W3 available; 3 = order of two, bench of 4–5, Busy. **Blind bot at level 1:** 1/3 a call. **Sceptic:** the same kind twice on the bench only from level 2, and then the second word decides; nobody stands, waves or looks until tapped; the walk plays only after the right tap.

> from: docs/archive/clinic/clinic-design-v1.md § P3 Stage 2, diagnosis

#### P3 Stage 2, diagnosis: "Where does it hurt?"

The patient sits on the examination bench, symmetrical, hands in lap, gaze forward (the neutral pose and the `mirror: true` hotspots stand). Three variants, as Zafar asked; which one runs is a data draw per level (`stages.diagnosis.mix`).

| Variant | Level | How it plays | What the Kutchi carries | Reuses |
|---|---|---|---|---|
| **D1 Does it hurt here?** | **1, the very first sessions** | 3 parts pulse gently (6 from the second session). The child taps one; the doctor asks *[EN: Does it hurt here?]* (G82); the patient answers *haa* / *nar* (yes / no) with a neutral face; a **yes** goes *ding*, the sore swirl appears, the patient says *[EN: My knee]*. Then the child presses the big **Found it** button on the right. From level 2 (D1b) the answer is graded: the child must act on what they heard, **Found it** on *haa*, **Next** on *nar* | Level 1: taught, not tested (elimination is the point; it teaches *yes, no, here* and the part's name). Level 2: **yes vs no** decides the act (R2's "only act on the word" rule; a bot pressing Found it every time fails on every *nar*) | `probe` (new, small: the pulse, the tap, the ding; the yes/no as a graded row from level 2) |
| **D2 It's my knee** | **1–3, the bulk** | The card shows the patient's face and one line; it shrinks into the sidebar; 3 s of quiet; the patient says *[EN: My {part} hurts]*. The child taps the part. Right: the swirl and *[EN: That's it]*; wrong: a giggle, *Arre re!* from Kasuku, the line again. Face parts in the close-up from level 2; sides in the patient's voice from level 3 (*[EN: My left knee]* · *[EN: Not that one, my other knee]*); from level 2 the doctor asks *[EN: Where?]* first and the child **says** the part (S2) before tapping | Which part (6 → 13 → 19), which side, the ailment's name in the patient's second line (*[EN: I fell]* / *[EN: it's stuck]* / *[EN: it itches]*; level 3+, Arc 4's past tense) | `where` (built), `tell` for S2 (built), `body.js` |
| **D3 The check-up detective** | **2+** | The patient: *[EN: I don't feel well. I don't know why.]* The doctor calls what to check and with what (*[EN: Listen to the chest]* · *[EN: Look in the ear]* · *[EN: The temperature: the head]*); the child does each with the kit; the find (a gurgle, a pink glow, *hot!*, a seed) shows only at the named sore part. **Level 4, the clue variant (V2b, Zafar's decision 5):** the patient gives clues instead and the child chooses what to check: *[EN: Not my head]* · *[EN: Near my hand]* · *[EN: It's up, not down]*; each clue is a listening row (*nar*, near, up/down); at most 3 checks | Part + instrument per call; from level 3 the patient's side; at level 4 negation and position words. Border with *Who did it?* kept: the clues are body words and positions, never causes | `check` (built: calls, kit, finds, sweep and leftovers rules); `clue` (new, level 4 only: the clue set and the check budget) |

**The ailment.** Every part has one or two ailments, each an entry in `ailments` (P4's library): `{part, game, items[], lines}`. Diagnosis draws the part from the level's list weighted to the child's weakest words, then the ailment. The doctor names it in one line and says the prescription (P1's seam); its request card opens the pharmacy. **Blind bot at level 1:** D1 ungraded; D2 1/6; D3 under 0.1% for 4 calls.

> from: docs/archive/clinic/clinic-design-v1.md § P4 Stage 3, the pharmacy counter

#### P4 Stage 3, the pharmacy counter: "Bring me…"

The counter is a belt (a sushi belt: it loops, so nothing is ever lost and nobody can lose) running across the top of the play area, right to left, in front of the dispensary shelves. Items ride past on little dishes. The tray sits bottom-right, under the thumb, a **fixed-shape card**: it always shows the ailment's number of slots (a three-item prescription is always three empty dishes, in order), so the tray's shape never answers what to grab. The doctor stands behind the counter, hands folded, and reads the prescription as the request card (read-along highlight per chunk; it shrinks into the sidebar); the belt starts when the card has gone.

| Knob | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| What's asked | **1 item** (*Muke [EN: plaster] khape*) | 2–3 items, said as a list (*Muke limu khape, ne paani, ne [EN: honey]*); one may carry a colour or a size (*[EN: the green] [EN: bottle]* · *nindhi [EN: bottle]*) | 3–4 items with **order** (*pela [EN: cotton], ne poi [EN: the thread], ne poi [EN: plaster]*) and **counts** (*ba limu* · *trae [EN: tissues]*); a *nar* row (*nar khun*: no sugar, for the chai ailments) |
| On the belt | 6 items: the asked one plus 5 decoys from other ailments (never a look-alike) | 8: decoys include one look-alike per asked item (the red bottle for the green; the big cloth for the small) | 10: two look-alikes per asked item; the same item in two sizes and two colours |
| Speed | One item enters every 2.5 s; 9 s to cross | 2 s; 7 s to cross | 1.5 s; 5 s to cross; a **"belt stopper"** pedal (a hint: the tick star, like "?") |
| The grab | **Tap** the item: it hops to the next empty dish | **Tap** (the same at every level: quality pass Q1) | **Tap**; the order row is the **order of taps** (*pela*'s row): a wrong order is a miss in the end review |
| Counts | — | *ba* limu: two taps, `count`'s tally on the tray (the digit only while the number word is at stage 1–2) | Counts up to *panj*; a count that overshoots costs the row |
| The check | The doctor lifts each dish and names it (`handover`, R3.1: *[EN: The plaster. Good.]*); a wrong one goes back on the belt with its name (*[EN: This is the red one. The green one, please]*) | + the count (*ba limu. Good*) | + the order (*Pela cotton, ne poi thread. Good*) |

**Rules that keep it honest** (the leak bot's new strategies **"first past"** and **"grab all"**): the belt order is random and loops, so waiting doesn't narrow it; grabbing an unasked item is a miss for that row (it goes back with the doctor's correction), so grab-all fails; the dishes are the same colour and size; a decoy is never from the same look-alike group at level 1 (fair for a first day) and always is from level 2; the tray never shows pictures of what's wanted, only empty dishes. **Blind bot at level 1:** 1/6.

**What carries into heal.** The tray slides into the left sidebar as a column of dishes in order; each healing step *uses* the next dish (it lights up; the child taps the dish, then taps the spot on the patient: the one gesture every healing game shares, quality pass Q1), and an empty dish stays as a tick. So the order the child heard at the counter is the order they work in, and *pela … ne poi …* is heard twice per patient: once as an instruction, once as a review.

**Mechanics:** `belt` (new: the loop, the dishes, tap at every level, speeds as data); Cook's `count` (the tally), `handover` (built), the shared `which` module (decoy balance); Cook's `fetch` isn't used on screen but its pick-and-judge logic is the model for `belt`'s rows. **Free-play entry "The counter":** the belt alone, a shopping-style round (3, then 5, then 7 things), 60 s.

> from: docs/archive/clinic/clinic-design-v1.md § P8 Stitching: a session, the first ever session, free play

#### P8 Stitching: a session, the first ever session, free play

- **A clinic morning = 3 patients through the whole pipeline**, about 9–12 minutes (waiting 20 s, diagnosis 30–60 s, pharmacy 30–60 s, heal 60–120 s, send-off 20 s, the end-of-round screen). The three patients are drawn from the child's weakest words (kinds, parts, items, feelings), with the healing games from the sets the child has been shown, never the same game twice in a morning, and the morning's mix a data knob (`days.mix`, kept). The morning ends with "Close the clinic": the receipt, pocket money, and the album.
- **The first ever session is tiny** (UX 7): one patient. The bench has two people (a girl and a boy); the doctor says *[EN: the girl]*. Diagnosis is D1 with three parts pulsing (the knee is the sore one). The pharmacy asks for **one** item (the plaster) with four decoys on a slow belt. Heal is H2 with its three one-word steps. Send-off is E1 with two faces. Under two minutes, every UI element fading in as it's first needed (UX 8's ghost finger on the first tap of each stage). Session 2 adds one thing per stage (bench of 3, D2, two items, H1). Each level adds one thing.
- **Onboarding scripts** (UX 10) are written per stage at the end of that stage's build: the ghost finger taps the girl; taps a pulsing part; taps an item on the belt; drags the plaster; taps a face.
- **Free play dips into single stages:** *The counter* (the belt alone, 60 s); *The healing room* (pick a body part from the album's outlines; one game at the child's level; 60–120 s); *Who's next?* (the bench alone, Busy, 60 s); *You're the patient* (V0, unchanged: the lap view and S1, 60 s); *Open clinic* (patients keep coming through the pipeline until "Close the clinic"); *Explore* (tap any part of any patient, no rows). The hub's rotating daily gets *The counter* or *The healing room*.
- **Story:** Arc 3 Ch4 runs as before (R6) with the pipeline inside it: you're the patient first (V0, 60 s), then *Bring someone in* is the story's waiting room (Nani's message: S3 stays as designed), then three patients: Ali (D2 knee → H1), the hen (D3 the mystery → the vet's H13 thorn on a foot), the wet neighbour (D2 → H6; H11 was cut in the quality pass). Ch5 hands to Cook for Nani's own remedy (H7 was cut: the clinic makes no drinks; the turmeric milk is Nani's, in Cook).
- **Levels follow word stages, per stage of the pipeline** (a child can be at level 3 in diagnosis and level 1 at the belt); the level number shown on the card is the lowest of the five.

> from: docs/archive/clinic/clinic-design-v1.md § P10 Words needed, in priority order

#### P10 Words needed, in priority order

**QfM** = already in the Questions for Mum doc; **new** = for a supplement (that doc isn't edited here). Real Kutchi already in hand is listed at the top of this section.

| Priority | Words and frames | For | QfM |
|---|---|---|---|
| 1 | The kinds: *girl, boy, baby*; **old man, old woman** (or the polite words the family uses for an elder: *uncle, auntie, grandpa*); *[EN: Bring in] the {kind}* | Stage 1 | C8, C9, E100; **old man / old woman new**; E101 (an elder), E102 (the doctor); *Ali, come* G86; **the "bring in" frame new** |
| 1 | The six big parts; *My {part} hurts*; *Does it hurt here?*; *yes / no* | D1, D2 | G41–G47, G82, G120; A8.1–A8.2 (*haa* heard in the A3 recording: confirm) |
| 1 | The tray nouns for set 1: *plaster, bandage, cloth, blanket, hammer, tweezers, cotton, toothbrush, drops, honey, thermometer, fan, torch*; *hot water*; *Muke {x} khape* / *Muke {x} de* frames with a list | Stage 3 | G73–G80, G119; **hammer, tweezers, cotton (bud), toothbrush, honey, fan new** |
| 1 | The count frames: *{n} turns · {n} times · {n} drops · {n} stitches*; whether the noun changes after *ba* (the plural rule from the grammar notes) | H1, H3, H8, H17 | G114, G116, G127; **"times", "turns", "stitches" new** |
| 1 | *hot, cold, just right, too hot, still cold, How do you feel?* | H6 | G10–G14, G69–G71, G83 |
| 1 | The feelings: *okay, happy, better, sad, scared*; *Is everything okay now? · Yes, now I'm happy · Get well soon* | Stage 5 | G62–G66, G84; **okay, "Is everything okay now?", "Now I'm happy" new** |
| 1 | *Say aah · Open your mouth · Look in the ear · Listen to the chest · Take the temperature* | H3, H4, H7, D3 | G110, G111 |
| 2 | Directions: **up, down**; *left, right* as bare words (or *this side / that side*: A5) | H4, H14, H16, H18, H20 | **up/down new**; G126 |
| 2 | Colours (the belt, the thread, the cast, the beetles); *the {colour} one* | P4, H4, H8, H14, H16 | E60–E71, G115 |
| 2 | *Pull it out · Clean it · Brush · Fill it · Stick out your tongue · Rinse · Wipe · Count with me · Hold your breath · Boo! · Breathe in / out · Bend it · Look up / down* | The healing games' verbs | **all new** (a short imperative list; the grammar's Grid 11 covers the form) |
| 2 | *sweet, sour, salty* (optional: *limu, khun, loon* carry H5 without them) | H5 | **new** |
| 2 | Body: *tooth/teeth, tongue, hair, ear, eye, nose, mouth, throat, chest, neck, back, elbow, knee, finger, toe, arm, leg* | Sets 1–3 | G48–G61; **tongue, hair new** |
| 2 | *I don't feel well · I don't know why*; the clues *not my head · near my hand · it's up, not down* | D3 | G112; **clues new** |
| 3 | Sides in the patient's voice; *the other one* | Level 3 everywhere | G125, G126, G109 |
| 3 | *stitches, thread, needle, cast, crutches, X-ray, syringe, lollipop, comb, shampoo, cream, oil, steam, tissue* | Sets 2–3 | G78 (tissue); **the rest new** (say if the family just uses the English words, as G119 asks) |
| 3 | *I fell · I bumped it · it's stuck · it itches* | D2's second line, level 3+ | Past tense held (Arc 4) |

> from: docs/archive/clinic/clinic-design-v1.md § P12 Build brief (phased; own files first; shared pieces listed)

#### P12 Build brief (phased; own files first; shared pieces listed)

**Files the clinic owns** (the only files phases 0–2 touch): `clinic.html`, `js/clinic/**` (`pipeline.js`, `body.js`, `patient.js`, `room.js`, `queue.js`, `mechanics/*.js`, `stages/{waiting,diagnosis,pharmacy,heal,sendoff}.js`, `stations/patient.js`, `heal/<game>.js` one file per healing game, `stubs/*`), `css/clinic.css`, `data/clinic.json`, `data/patients/*.json`, `data/scenes/clinic.json`, `build/test_clinic.py` (port 8806), `build/leak_clinic.mjs`, `build/check_hotspots.py`, `assets/clinic/`. It **reads** Cook's core and mechanics and Dress up's `stitch` and never edits them; if `stitch` isn't exposed on `Cook.Mech`, phase 1 keeps a local copy under `js/clinic/mechanics/` and swaps at integration.

| Phase | What's playable | Own files only? | Acceptance |
|---|---|---|---|
| **0 Prerequisites** (no code) | — | — | P10's priority-1 rows recorded; P11's decisions (defaults otherwise); the doctor's sheet in `sources/private/` |
| **1 The pipeline in greybox, set 1** | `pipeline.js` (pure; a patient's rows per stage; `judge`, stars, `days.mix`); the five stage files; `call` (W1, W2), `probe` (D1, D1b), D2 and D3 on the built `where` and `check`; `belt` at levels 1–3 (tap only) with `handover`; **heal set 1** (quality pass Q4): H2/H8, H1, H3, H5, H6, each with its gestures fixed from level 1 (Q1) and its card lines auto-ticking on the step's close; `feel` (E1+E2 as one ladder); the request card per stage (a title and the line; the read-along waits for recordings); the lab runs any stage × variant × level, any healing game, a patient, a morning; the bots | **Yes** | Fair bot 100% ear on every stage; every leak strategy (the phase-1 list plus first past, grab all, found-it always, same face, any direction, and Q6's tap-every-dish, drag-until-the-tick, blanket-every-answer) under 10% over 500 rounds per stage per level; the pipeline's level-1 blind bot under 1%; `check_hotspots.py` passes with the mouth ×4 and the new close-ups (level-1 targets ≥ 2 cm on the iPad); `test_clinic.py` plays a patient and a morning at six sizes with deliberate mistakes; no console errors; screenshots reviewed |
| **2 The morning, the first session, set 2** | Three patients per morning with "Close the clinic"; the first-ever session script (P8) and the ghost-finger overlays per stage; W3, W4 (Busy, comfort rings); the end-of-round screen on the shared component (or a local copy with the same props until it lands) with the personal best per ailment and level; the word review; the sidebar tray, the light bulb, the "?" and the belt stopper as hints; **heal set 2** (Q4): H4, H9 (S6), H12, H13; E3, E4; the album | **Yes** | The morning under 12 minutes at level 1, the first session under 2 minutes; the voice bot passes W3, S6, E3, E4 (accept, wrong hearing acted on, null → say it again → pills, parent ✓); leak under 10% on every set-2 game; a Busy morning's rings never empty at level 1 |
| **3 Integration and story** | Swap the stubs for `js/shared/speech.js`, `whichone.js`, `overlay.js`; the shell (one app, one save); Arc 3 Ch4 with the pipeline inside (V0, the message as stage 1, Ali, the hen, the neighbour); the Monsoon side errand; the hub's 60-second entries; the vet's parts on the same engine; `rel.js` only for *the top shelf* | No: the shell, `data/relations.json` | Ch4 end to end in the harness; **Zafar plays it with a child**; the family's recordings replace placeholders file for file and the read-along highlights by chunk |
| **4 Art and set 3** | The doctor's sheet and poses; seated patients of every kind (girl, boy, elder, baby on a lap) with the kick, head-turn and hiccup frames; the healed states; the belt and counter art; the close-ups (ear cave, tummy tube, mouth); **no heal set 3** (Q4's maybe-later games return only with a reason from playtesting); Kasuku's echo; V2b clues at level 4 | — | Visual QA per screenshot; the leak report shows real Kutchi rows passing |

**Shared pieces the clinic needs from the foundation agent** (assumed to arrive; not designed here): `js/shared/speech.js` (`listen({choices, timeoutMs})`, now present); the which-one module (`whichone.js`, present); overlay-at-anchor sprites (`overlay.js`, present); the **end-of-round screen** component (UX 9: three badges, the word review) and the **onboarding kit** (UX 10: dim, spotlight, ghost finger); the request card with read-along by recording chunk; star sets and ear/voice rules as data; the shell and the hub daily; `rel.js` (phase 3 only). Until each lands, the same keys sit in `data/clinic.json` and a local stub with the same props sits in `js/clinic/stubs/`.

> from: docs/archive/clinic/clinic-design-v1.md § R3.2 Left and right, in the patient's words

#### R3.2 Left and right, in the patient's words

The rule: **a side is a thing a patient says about their own body.** *[EN: My left knee hurts.]* *[EN: Not that one, my other knee.]* *[EN: My right eye.]* The doctor's calls and treatment lines never carry a side; they refer back (*[EN: That knee. Round twice.]* *[EN: Two drops.]*), so there's never a "whose left?" to resolve in his voice. This also splits the family recordings cleanly: the six *my {side} {part} hurts* phrases in the patient's voice, and the doctor's lines without sides.

The ladder, built on that phrasing:

| Step | Level | What happens | Why it's the right difficulty |
|---|---|---|---|
| **A. Your own left** | 2 | In **you're the patient** (the lap view is first person, so your left is on the left of the screen) the doctor asks *[EN: Does your left knee hurt?]* and you answer; you say *[EN: my left knee]* when he asks where (R3.4, S1). Doctor Nani asks *[EN: show me your left hand]* in the room | Own-body left and right is reliable from about 6–7 (Rigal); no rotation |
| **B. Their left, facing you** | 3 (age 7+) | The patient on the bench says *[EN: My left knee hurts]*. Their left is on the right of your screen. You tap it; the check-up's side rows work the same way (the doctor: *[EN: Now the knee]*; the patient: *[EN: My left one]*), so the side is still the patient's voice and the check-up keeps two voices per row | The mental rotation is the puzzle Zayn wanted; "my" tells the child whose side it is, every time, which is the ambiguity Zafar wanted gone |
| **C. The twist** | 3+ | *[EN: Not that one. My other knee.]* after a wrong tap, or as a row of its own | The child has to hold "my" *and* "other" |
| **D. On your own** | 4 | Both A and B in one morning; the doctor's away for the last patient, so the hand-over check (R3.1) is done by the patient (*[EN: Yes, my left. Thank you]*) | — |

Rules that keep it honest: the patient never lifts, points at or looks at the side they name (the `mirror: true` hotspot rule and the neutral pose stand); a side miss at level 3 costs the ear star only after the recast (*[EN: My left. My other knee]*) has been ignored once; after two misses the patient touches their own knee (rung 6, shown; the star is gone). The **swivel stool** (a back view per patient, so their left is your left) remains a held art item that removes the rotation, not the word. A5 still decides whether the family says *left/right* or *this side/that side*; if the latter, the frame is *my this side* / *my other side* and step B loses the rotation but keeps the word.

> from: docs/archive/clinic/clinic-design-v1.md § R3.4 Speaking moments

#### R3.4 Speaking moments

All four run on `tell`, against `listen({choices, timeoutMs})`. Rules held everywhere: the closed set is stated and never bigger than 8; a `null` or a low confidence (`voice.minConfidence`, data) gets one *[EN: Say it again?]* from the doctor, then the **audio pills** slide up (one look-alike group of 3, text only at the reads stage), and a settings toggle "**a grown-up judges speaking**" replaces the recogniser with ✓ / again for a parent or Nani; the mic never blocks progress (the pills are one tap away from the first timeout on); what the recogniser heard is always shown **by the character acting on it**, never by an error message, so a wrong hearing plays as an ordinary miss in the fiction; the **voice star** is earned when the first try is accepted (recogniser or parent), and is separate from the ear star, which speaking neither earns nor costs. Tapping a pill instead of speaking is always allowed and earns no voice star. `star_sets.clinic` becomes ear / **voice** / plaster / tick or bolt; a visit with no speaking moment shows no voice slot.

| # | Moment | When | The closed set | What the character does | Fallback | Star |
|---|---|---|---|---|---|---|
| **S1** | **"It's my knee"** (you're the patient, V0) | **Level 1**, every V0; the story's first minute | The lap view's visible parts: hand, finger, arm, elbow, knee, foot, toe (**7**); for a cold, hot / cold / just right (**3**); at level 2 with a side: *my left knee* (the 7 parts × a side is spoken as one phrase, but the set the recogniser gets is the 7 parts, then left / right as a second `listen` of **2** only after the part is right) | The doctor asks *[EN: Where does it hurt?]*, hands folded. He presses where he heard: the right part → *[EN: Ahh, this one]* and the plaster; a wrong hearing → *[EN: Here?]* on that part and you say *no* (or say it again). The two-way *knee or hand?* pills stay as the fallback | Pills at once at level 1 (mic and pills together, since the child may not know the word yet); mic first from level 2 | **Voice star from level 1**: V0's ear rows stay ungraded (they're two-way taps), but "knee" out of seven isn't a guess, so V0 becomes the clinic's first real speaking game |
| **S2** | **"Tell him where"** (the named ailment, V3) | **Level 2+**; from level 3 the doctor asks it on every V3 | The level's parts in play for that patient: the 6 big parts, or the 6 face parts when the close-up is open (**6**); at level 3 the side is a second `listen` of **2** | The patient says the complaint (ear); the doctor, not looking: *[EN: Where?]* The child says the part; **he checks the part he heard** (a check-kit tap on it); the right one → the swirl and *[EN: That's it]*; a wrong one → the patient giggles and the doctor: *[EN: Nothing there. Where?]* | Tapping the part yourself (the ordinary M1 tap) is always there and grades the ear star exactly as before; only the voice star needs the word said | Voice. **Honest weakness:** the child has just heard the word, so this is shadowing with a purpose (say what you heard, to the right person); it trains the mouth and the doctor's acting-on-it proves the word landed, but the ear star, not the voice star, is the comprehension test |
| **S3** | **Bring someone in** (V4: tell the doctor what's wrong) | **Level 2+** in free play; in **Arc 3 Ch4** at level 1 with mic and pills together | Whose and where: the doctor asks *[EN: What's wrong with Nani?]*; the set is the 6 big parts (or 6 face parts for a face case) for the part (**6**), then, at level 3, *hot / cold / tired / sneezy* for the feeling (**4**). The person is never in the set (the doctor already knows who) | He examines the part he heard on the message-patient (or on the patient you walked in): a V1 call on that part; a wrong hearing → *[EN: Nothing wrong there. What else?]* and you say again; the right one → *[EN: That's it. Will you help me?]* and the treatment | The audio pills (picture → word, one look-alike group of 3); parent ✓ | Voice. This is the mode's real production moment: the child **saw** the hurt at home (nobody said it) and now says it |
| **S4** | **"What have you brought?"** (the dispensary, T6; later T5) | **Level 2+**, phase 3 | The shelf's items that round: the green bottle, the red bottle, the small ones, the drops, the cream (**3–5**; colours and sizes are Round 1 words) | The child hands it over (`handover`); before naming it the doctor asks *[EN: What's this?]*; the child says it; he then names it himself either way (*[EN: Yes. The green bottle. Two]*), so the spoken review is heard whether or not the child spoke | Pills; parent ✓ | Voice |
| — | **Doctor Nani, flipped** (Grandparent mode) | Any time, in the room | Parts in big text on the tablet for the child to read at the reads stage, or heard once for the child to repeat | The child tells Nani *[EN: show me your nose]*; Nani touches it; Nani taps ✓ | Parent-judged only; no recogniser | Voice (Nani's ✓) |

**The Sceptic on speaking.** (1) Say anything and let the recogniser pick the closest: the confidence floor sends her to *say it again?* then the pills, and a wrong closest choice is acted on and misses like a tap; (2) mumble the same syllable for every row: the leak bot gets a **"mumble"** strategy that feeds the stub recogniser a fixed choice, and it must earn the voice star under 10% (with 6–7 choices it's under 17% a row, and a V0 has two rows); (3) tap the pills every time: allowed, no voice star; (4) a parent who ✓s everything: the parent's call, and the brief allows it.

> from: docs/archive/clinic/clinic-design-v1.md § R3.6 Words needed, in priority order

#### R3.6 Words needed, in priority order

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

> from: docs/archive/clinic/clinic-design-v1.md § R2.7 Keeping the doctor warm

#### R2.7 Keeping the doctor warm

- He's the calm centre: he never rushes, never tuts, and his laugh is the reward sound. The comedy is the patients' (the tummy gurgle, the knee that kicks, Nana under four blankets), never his.
- His lines to the helper are praise and instruction only: *[EN: Let's check everything. Good. Now the knee. That's it! Well done, my helper.]* When the child is wrong, the *patient* giggles and *he* just repeats the call.
- Nothing scary: no finds that look like illness (a red throat is a soft pink glow; "hot" is a word he says). Every mystery is solved, every patient leaves smiling, and every feeling is resolved in the same visit (a sad patient gets Big Ma's song or a blanket and a joke).
- The likeness rules in R8 stand.

> from: docs/archive/clinic/clinic-design-v1.md § 7.2 Pocket money and collections (the album/collections part)

#### 7.2 Pocket money and collections

- The receipt as in Cook: **5** for helping, **+5** ear, **+3** gentle hands, **+3** tick or lightning, a **perfect-patient combo**. Money is never lost.
- **Sticker album:** one sticker per patient the first time you help them, and one per silly case (*Pokémon Snap*'s Photodex, Papa's stickers). The album shows empty outlines of cases not met yet (curiosity).
- **Thank-you shelf** in the clinic: each regular patient's small gift (Nana's old coin, Big Ma's button, Ali's marble, a feather from Kasuku). It fills the place (cosy progression).
- **Plaster designs:** bandhani dots, ajrakh, mirror-work, an Eid moon: unlocked by album pages. Cosmetic only; they never touch the listening (Maryam).
- **Quilt patch:** a stethoscope (Arc 3 Ch4).
- **"Helped the doctor on N days"**: a count that never resets (no breakable streak).

> from: docs/archive/clinic/clinic-design-v1.md § 7.3 Upgrades

#### 7.3 Upgrades (the clinic's own shop; they never listen for you)

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

> from: docs/archive/clinic/clinic-design-v1.md § 7.4 Keeping it gentle (the safety rules, as a checklist)

#### 7.4 Keeping it gentle (the safety rules, as a checklist)

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

> from: docs/archive/clinic/clinic-design-v1.md § 9 Scene, art and assets (the art list)

### 9. Scene, art and assets

#### 9.1 Cameras

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

#### 9.2 Layers and ambient motion

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

#### 9.3 Hand poses

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

#### 9.4 New art, with reuse flagged

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


# Build status (clinic build log, phase 0–1, 25 Sept 2026)

> from: docs/archive/build-logs/clinic-build-log.md (whole file, without its title)

Branch `claude/build-clinic`. Rules: `docs/archive/mode-briefs/BUILD-COMMON.md`; design: `docs/archive/clinic/clinic-design-v1.md` Revision 3, then Revision 2, R3.9 and section 12. Every default taken (the child never gives medicine; sides only in the patient's mouth; no pill organiser).

### What's built

| Piece | File(s) | Notes |
|---|---|---|
| Data | `data/clinic.json`, `data/patients/grey-adult.json`, `data/scenes/clinic.json` | Every word and line is an English placeholder (`kutchi: null`); only Cook's number words are real Kutchi. Merged into `Cook.data` in memory at load under clinic-only ids; `data/cook.json` untouched |
| Visit engine (pure, runs in Node) | `js/clinic/visit.js` | V0–V4 plus the treatment round, as graded rows; `judge`, `earStar`, `voiceStar`, `morning` (`days.mix`) |
| Body map (pure) | `js/clinic/body.js` | mirror `.left → .right`, smallest-containing-part hit test with snap-to-nearest, spots, limb axes, close-up |
| Speaking core (pure + mechanic) | `js/clinic/mechanics/tell.js` | accept / wrong hearing (acted on) / null → "say it again?" → pills / a grown-up judges; mic never blocks |
| Mechanics, one file each | `js/clinic/mechanics/{check,where,care,stick,wrap,lift,tuck,drops,handover,ask,tell,you}.js` | `Cook.Mech.define`, knobs in `data/clinic.json` `mechanics` |
| Room, patient | `js/clinic/room.js`, `js/clinic/patient.js` | greybox doctor (folded hands; open hand for the hand-over), kit tray (L2+), trolley, magnifier (face close-up) |
| Stations | `js/clinic/stations/visit.js`, `js/clinic/stations/dispensary.js` | the visit (`calls → where → care → gesture → handover`); the dispensary loads **Cook's fetch, count, stir and pass me unchanged** (`fetch → handover`, `count + stir → handover`, the doctor's bag) |
| Stubs | `js/clinic/stubs/{speech,which,overlay}.js` | see "Stubs" |
| Lab | `clinic.html`, `js/clinic/flow.js`, `css/clinic.css` | every visit type, a morning, the round, every mechanic alone, Cook's mechanics in the clinic, the hotspot editor; level 1–3; "say" dropdown; grown-up toggle; hotspot overlay |
| Tests | `build/leak_clinic.mjs`, `build/check_hotspots.py`, `build/test_clinic.py` | see below |

### Decisions I had to take

1. **"?" and the ear star.** A row settled through the "?" rung isn't a *tested* row; the ear star needs `minTested` tested rows (3 check-up/mystery, 2 named ailment). Without this, "always ask, then pick one" (second-option) and "pick the one that sounds like it" (echo) beat 10% on V3.
2. **Voice star needs two speaking rows** (`voice.voicePass.minRows: 2`). One row of 6 is a 17% mumble. So from level 2 the hand-over asks "What's this?" first (S4 at the hand-over), giving every treated V3/V4 two speaking rows; V0 has two rows (a second scuff, or the cold variant's feeling). A visit with fewer (a mystery's lone S4) shows no voice slot. The same rule for ear: a visit with fewer tested rows than `minTested` shows no ear slot.
3. **V4 (bring someone in, a lab stub) has no ear slot.** R3.4 S3 says *he* examines the part he heard, so the child's only listening rows are the treatment (V3's rows, measured under V3). Graded alone they leaked (frequency 22%). Its star is the voice.
4. **Sides follow R3.2 literally:** a side miss counts only after the recast ("My other knee") is ignored once; so side rows don't count as tested rows.
5. **Level-2 tools are drawn tool-first, evenly**, then a part the tool works on; otherwise "the hand" was right three calls in four.
6. **First-set mini-games for the bot** are the check-up, the mystery, the named ailment, the treatment round (three patients; the item varies across all first-set treatments, since a station that's always "the bandage" answers itself) and you're the patient. Each gesture alone (plaster, bandage, packs, blanket, drops) is in the lab for the hands; its graded rows are its extras (count, colour, path).
7. **Duration strategy**: the bot hears a line's length only to within a Weber fraction of 0.12, over three takes with 18% jitter; it never measures milliseconds. On English placeholders it measures letter counts: re-run when recordings land.
8. **Word stages in the lab**: every word counts as tested (stage 1 twinkle and "taught, not tested" are phase 2 with the intro card). Nothing is saved (`Cook.writeSave` is never called).
9. Level 2 adds the chest (so the stethoscope has more than the tummy); "back" is in the data but not on the front-facing silhouette.

### Leak bot (`node build/leak_clinic.mjs`, 500 visits per strategy per type per level)

PASS on seeds 1 and 7: fair bot 100% ear (and voice where there's a slot); every strategy under 10%. Level 1, ear star %:

| | random | salience | frequency | slot mem. | repeat | duration | wait | visual cue | sweep | leftovers | second | echo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| check-up | 0.2 | 0 | 0 | 0 | 0 | 0.2 | 0 | 0 | 0 | 0 | 0.4 | 0.4 |
| mystery | 0 | 0 | 0 | 0 | 0 | 1.2 | 0 | 0.2 | 0 | 0.2 | 0 | 0.4 |
| named ailment | 3.8 | 3.0 | 4.6 | 3.0 | 6.6 | 3.6 | 0 | 2.6 | 3.0 | 4.8 | 0 | 0 |
| treatment round | 0.4 | 1.0 | 3.2 | 0.6 | 2.0 | 2.8 | 0 | 1.8 | 0.6 | 1.2 | 1.0 | 0.4 |

Voice star (mumble / random word said): V0 L1 3.8 / 2.0; V3 L2 1.2 / 3.2; V4 L2 0.0 / 2.4; pills and silence 0. Highest anywhere: 6.6% (repeat, V3 L1). Full table: `build/reports/clinic-leak.json`. **Every row is an English placeholder: not yet a Kutchi test.**

Speaking paths (tell core): all seven checks pass (accepted; wrong hearing acted on as a miss; null → one "say it again?" → pills, no voice star; grown-up again/yes; level-1 pills from the start; sets over 8 refused).

### Hotspots (`python3 build/check_hotspots.py`)

PASS. Level-1 effective hit areas on the iPad (1024×768, canvas scale 0.487): arm 2.96 cm, head 3.26, hand 2.26, tummy 2.26, leg 2.11, foot 2.10 (each side). Phone (915×375): smallest 1.28 cm → opens zoomed ×1.36. Face parts are close-up only (×2.6): eye 0.94 cm, tooth 0.50 cm on the iPad: the tooth is too small even zoomed (phase 2).

### Browser (`python3 build/test_clinic.py --canvas`, port 8806)

Real pointer events read from `__clinic.expectation()`, with the tap-cover check before every tap; no console errors.
- Every lab entry (21, the hotspot editor aside) passes at level 1 (laptop, with `--mistakes`), level 2 (laptop) and level 3 (iPad).
- The six sizes (`--all-sizes --mistakes`): V0, V1, V3 and the treatment round pass at all six; the deliberate wrong taps run the recasts and cost the ear star.
- The speaking paths in the page (`--say`): right (voice star), wrong (acted on as a miss, then the pills), nothing (one "say it again?", then the pills), pills (no voice star), a grown-up judging (voice star).

Bugs the browser run found and fixed: the mouth's spot landed on the tooth (a level-3 check-up could never finish); the magnifier's hit area was off (Phaser container); a third trolley row fell off the canvas at level 3.

Screenshots are in `build/screenshots/clinic/<size>/` (not committed). Reviewed: the check-up, the lap view, the trolley at level 3, the kit. Greybox, readable; the lap view's arms are crude.

### Known gaps (phase 2)
- Word stages (stage-1 twinkle, taught rows), the intro card, 3 s quiet, the sidebar ladder and the receipt: phase 2.
- The trolley's objects are small on the phone (about 60 design px); the tooth is under 1 cm even in the close-up.
- The replay timer can overlap a recast line.


