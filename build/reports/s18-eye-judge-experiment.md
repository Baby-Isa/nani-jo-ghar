# The eye-judge experiment: can a rubric and chai's frame catch what Zafar catches by playing?

**Judge:** Fable (eye judge). **Date:** 8 Nov 2026. **Reference:** chai (game id `chai-tray`), signed off 7 Nov as "clean,
modern, beautiful". **Pictures:** the Sprint 18 wave-3 films (`build/screenshots/sandbox/s18-w3-films/films/cook-<game>@1280x665-sheet.png`,
16 frames of a New player's first round, left to right, top to bottom) and the phone contract sheets
(`build/screenshots/sandbox/s18-w3-full/sheets/cook-<game>__740x320.png`), taken before his play.

**Rules kept:** nothing under `docs/feedback/`, `docs/process/regressions.md`, `docs/archive/`, the s18 review, Fable, feedback or
8 Nov reports was opened. The rubric below was written before any game picture was looked at (chai's included).

---

## 1. The rubric

Written from `docs/design-language/standard/` (every page) and `docs/design-language/art-bible.md`. Each question is answerable from a
frame or a run of frames, and is judged with chai's frame of the same moment beside the game's. Flaws first. The rule each question
comes from is in brackets.

### A. Onboarding and lights

1. Is the first-time light one look: everything dims (0.45), a gold-edged box sits round the one lit thing, no ripples, arrows or
   pulses elsewhere; a finger only for a drag, hold or rub? (STD-D1-02)
2. Does the lit box hug one whole target (a picture, a pill, a face, a knob) by one even margin, corners at most a quarter of its
   height, never crossing a face or the side panel, never framing a whole region or the whole screen? (STD-E2-08, DAAR-39, SEK-22)
3. Is there ever a dim with no lit thing, two lights at once, or a light left on a thing already done? (STD-D1-03)
4. Is the light on the thing the child must touch next (the shelf item, the knob, the pan), and does Nani's call come with it?
   (STD-D1-06, STD-F3-05)
5. After the first items, does the light move to the next item's card on the order card, with that card whole in view? (STD-D1-07)
6. When a next vessel is needed for the first time, is its rim lit once the first is served? (STD-D1-10)
7. Does Nani's box show the step now (one short line, her face, the arrow), never the whole order, and is it one height in every
   state, final from the first frame? (STD-D3-01, STD-D3-05)

### B. The order card, the item cards and Nani's box

8. Does nothing of an order show before it is said: does each item's card pop out big as it is said and fly whole into its row
   card? (STD-B1-03, P8)
9. Is every word on the one word card: Kutchi on top (maroon, serif), English under it (dotted from L2), the picture, the speaker;
   the same card in the pop-out, the row and the helper? (STD-E2-01)
10. Is each item card's picture exactly the shelf item's own picture, same view, same file, with any "no" grey or blur stacked on it?
    (STD-E2-04)
11. Is any word cut, ellipsised, run over its speaker, or outside its card; do headlines shrink and then wrap? (STD-E2-02)
12. Are the panel's cards even: equal padding and gaps, words level, one height across states; does the panel show at least 2.5
    item cards and keep the current card whole in view? (STD-E2-03, STD-E1-02, STD-E1-04)
13. Does a row tick the moment its count or amount is reached, and does a finished order keep its ticks until served, then fold as
    the next opens? (STD-D4-01, STD-D4-02)
14. When the child is stuck, does the helper card open under Nani's box with the item's word card as the item glows: no lit arrow,
    no dim, nothing over the order? (STD-D3-02)
15. Is the only English the child can see the English under a supported Kutchi word, the order card's line at L1, the helper card,
    and grey italic for a line not yet recorded (no "to record" sign)? (STD-01-03, STD-A4-02)

### C. Layout and the scene

16. Does the frame read as chai's: side panel left (Nani's box, then the order cards) on the stone, the play area, the shelf band
    across the bottom third, laid out by height, nothing cut at 740x320 or 1280x665? (STD-E1-01, STD-E3-03, STD-02-04)
17. Does anything overlap a thing it should not touch: shelf items against the hob or pans, pills against each other, a bubble over
    a face or the panel, a corner button over play? (STD-E1-05, STD-E2-06)
18. Is the shelf one row of items standing on one line, evenly pitched, each with its word pill under it, pills at least 4 px
    apart, text never under 14 px, every tap at least 48 px? (values E1, STD-E6-02)
19. Is the worktop the white marble (never yellowed) and the panel and shelf band the stone, with one highlight colour for whatever
    is lit? (STD-E3-03, STD-E6-01)
20. Are the face circles the kit's, one of three sizes, beside what they own (the glass, the plate, the skewer), on top of all but a
    pouring thing? (STD-E2-07)
21. Is the cog alone at top right and the play area otherwise free of buttons? (STD-D5-02)

### D. Art and perspective

22. One camera: is every item in a cooking scene drawn straight down (round things as circles, no splashback or horizon in frame),
    with no three-quarter or eye-level prop mixed in? (STD-E3-01, art bible §3)
23. Is everything a real, steady picture: no code-drawn circle, disc, bar or rectangle standing in for a thing (a pan, a pod, a
    rack, a liquid, a flame)? (STD-E3-02, STD-H1-05, P10)
24. Are items drawn at one height and scaled by size class (L 100, M 91, S 84), so nothing is a true-size speck beside a true-size
    pan, and the smallest piece is at least 40 CSS px high on the phone? (STD-E3-01, art bible §4)
25. Does the art read in the house style: the 3D-film look with no outlines, soft light from the upper left, a contact shadow under
    everything (nothing floats), walnut for wood, white marble, no text or logos on anything? (art bible §1-2)
26. Does each pan or vessel show its own picture for its state, centred on its burner, with the heat ring over its handle and the
    burner never showing through? (STD-E3-04)
27. Are any cuts rough: a visible background strip, halo, hard edge, upscaled blur or a stand-in placeholder not named as such?
    (STD-H1-06)
28. Is anyone at a counter in a behind-the-counter pose, drawn in the house style, dressed modestly, with no religious markers?
    (STD-E3-05, STD-01-09)

### E. Play and feedback

29. Is every timed action's window shown on the thing itself (the ring filling to its green), and is the window called as it opens?
    (STD-B2-03, STD-D2-06)
30. Does a mistake show only in the thing (a shake, a boil-over that restarts its dish), never as a cross, a frown, a mark or a
    verdict before the end review? (STD-B2-04, STD-B4-05)
31. Does a finished dish have a visible payoff (the pan over its glass, the serve) that plays out before the next thing asks for the
    eye? (STD-B2-11, STD-B4-04)
32. Does the round close as chai's does: each dish to its asker, everyone back, thank-yous, then the two-page end screen (badges,
    then the word review), with no sweets, lollies or biscuits as rewards? (STD-B1-02, STD-D5-04, STD-B4-06)
33. Is every action a tap, or a drag along a fixed track or a rub that starts on its target, and does a count show on count pills
    that tick as reached? (STD-02-03, STD-B3-02)

### F. Language on screen

34. Is every Kutchi spelling the same on the pill, the card, the pop-out and the helper, and the settled form? (STD-A4-04)
35. Is each order headline a full natural sentence built by the engine, in Kutchi, with its English under it only where the level
    allows? (STD-A4-01, STD-C2-05)
36. Is a word met for the first time shown plainly (picture, Kutchi, English), nothing dotted or blurred? (STD-A2-04, STD-A2-03)
37. Does a word that a picture can't show (an amount) get its word moment before it decides, and never at a level that doesn't ask
    for it? (STD-A3-01, STD-A3-02)

### The overall question

38. Would a premium, Toca Boca-level children's game ship this screen? If not, why not?

---

**Scope cut (the orchestrator, Zafar's word, mid-run):** judge maani plus three of sekelo, daar and eggs, then hand back. The
four below are judged in full. Chaat, samosa, corn, baking and chop were opened (every quad and phone sheet) but are not written up.

---

## 2. Chai, the reference: what the four games are held against

What chai's frames show, so each game's flaw can be read as "chai does X instead":

- **f2-f4:** the Doctor at the counter, his bubble with its speaker, the two reply bubbles at the foot of the play area; the panel
  holds only Nani's box ("Cook it the way they said.") and the frame is whole from the first drawn frame.
- **f5:** the order card in the panel; the item card ("dudh / milk", carton) pops as he says "dudh," and lands in the panel's row.
- **f6:** the kitchen: everything dims, one gold-edged box hugs the paani bottle on the shelf, Nani's box holds one step ("Put water
  in the pan.", grey English). The hob (knob, heat ring, face circle), the tray with the asker's face on its corner from the first
  frame, and the shelf band holding every ingredient as its own picture with its word pill under it.
- **f8-f11:** the word pops above the pan as a thing goes in ("chai", "hakro"); ticks land on the row; "Chulo bar!" lights the knob
  with the zoom-in; the boil shows on the pan's own ring with its green arc.
- **f12:** "Pour it into their glass.": the glass fills in the tray well under the asker's face.
- **f13-f16:** everyone back ("Khuda-fis!"), then the two-page end screen (badges, then the word review fading in).
- **Phone sheet (740x320):** 12 states; the automated findings there (text-small, tap-small, canvas-text-small, 4-5 a state) are
  chai's own baseline, so the same findings in another game are not counted as a flaw below.

## 3. Maani (maani-line)

Sheets: `cook-maani-line@1280x665-sheet.png`, `cook-maani-line__740x320.png` (14 states).

**The rubric, in short:** A: 1 pass; 2 pass; 3 **fail** (f8, f11); 4 pass; 5 can't tell; 6 **fail** (no next-vessel light, the
plates never lit); 7 pass. B: 8 pass; 9 pass; 10 **fail**; 11 **fail** (phone 2); 12 pass; 13 pass; 14 not reached; 15 pass. C: 16
**fail** (plates on the shelf band); 17 **fail** (f13); 18 **fail** (two wordless slots); 19 pass; 20 **fail**; 21 pass. D: 22 pass;
23 pass; 24 pass; 25 part (props scattered); 26 pass; 27 pass; 28 pass. E: 29 pass (the tawa's ring); 30 not seen; 31 part; 32 pass;
33 **fail** (a tick button). F: 34 pass; 35 pass; 36 **fail** (lookalike pictures); 37 n/a. **38: no**, for flaws 1-3.

**Flaws, most serious first:**

1. **f5-f13 (and phone 3-9): the finished maanis go onto two bare steel plates that sit on the shelf band among the dough piles.**
   No face circle says whose plate they are; the asker's face appears only at f13, as a "Shabash!" bubble squeezed between the hob
   and the shelf. Chai keeps ingredients on the shelf and the serving tray in the play area with the asker's face on it from the
   first frame. (STD-E2-07, STD-E1-05)
2. **f5, f6, f7, f10 (panel): the item cards show cooked chapatis while the shelf things the child taps are raw dough piles, and the
   two card pictures are near-identical brown discs.** A child cannot tell "hakri bajr ji maani" from "hakri maani" by picture, and
   the card's picture is not the shelf item's picture. Chai's card picture is the shelf item's own file (the bottle is the bottle).
   (STD-E2-04, STD-A2-04)
3. **f8 and f11: two lights at once.** A gold ring glows round the tawa (a maani on it, mid-cook) while a gold box lights the next
   dough pile on the shelf and Nani's box says "Take a dough ball."; at f11 the rolled disc on the chakla has its own gold ring while
   the tawa's ring shows green. Chai lights one thing at a time and lights the next vessel only once the first is served.
   (STD-D1-03, STD-D1-10)
4. **f9 ("?" pop-up) and phone 9: a gold tick button ends the work** ("Tick when you've made what they asked for"), and the help
   names "the gold ring" as a thing to roll to, a UI target rather than the chakla. Chai's work ends by itself at the last serve.
   (STD-B1-06, STD-02-02)
5. **Phone 2 (and f4): the pop-out card covers the play area** (the sheet's own covers-play-area finding) **and the whole sentence
   "Muke hakri bajr ji maani khape," wraps to two lines in the bubble** over the Doctor. Chai's bubble at the pop is one word
   ("dudh,") and its card lands in the panel. (STD-E2-06, STD-B1-03)
6. **f5-f12: the props are scattered on bare marble:** the turner floats at the right with no place of its own, the velan lies loose
   under the chakla, the tawa's handle reaches into empty marble. Chai's hob and tray read as one station. (art bible §1 "no clutter
   on or near any tappable surface"; STD-E3-01)
7. **f13: the "Shabash!" face bubble overlaps the top edge of the shelf band**, over the plates. (STD-E1-05, STD-E2-06)
8. **Phone 3-9: two of the four shelf slots (the plates) have no word pill at all**, and the two pills under the dough piles are below
   the text floor (the sheet's text-small finding, which chai shares only for pills that exist). (STD-E6-02)

## 4. Sekelo (mishkaki-grill)

Sheets: `cook-mishkaki-grill@1280x665-sheet.png`, `cook-mishkaki-grill__740x320.png` (11 states).

**The rubric, in short:** A: 1 pass; 2 pass; 3 pass; 4 pass; 5 can't tell; 6 pass (the next tray lit at f3); 7 pass. B: 8 pass; 9
pass; 10 **fail**; 11 **fail** (the card's English); 12 pass; 13 pass; 14 not reached; 15 pass. C: 16 pass; 17 pass; 18 pass (chai's
baseline); 19 pass; 20 **fail**; 21 pass. D: 22 pass; 23 part (the dial); 24 pass; 25 **fail** (three loose rectangles, photographic
coals); 26 **fail** (no knob, no ring on the grill); 27 **fail** (placeholders unnamed); 28 pass. E: 29 **fail**; 30 not seen; 31
part; 32 pass; 33 pass. F: 34 pass; 35 **fail**; 36 pass; 37 n/a. **38: no**, for flaws 1-3.

**Flaws, most serious first:**

1. **f4 and f9 (and phone 7): the timed window is a grey dial about 20 px across at the skewer's tip.** Nothing on the grill shows
   heat, no knob, no ring, no green; a child would not see when to turn. Chai's window is the ring round the whole pan with its green
   arc, and the knob is lit when it is time. (STD-B2-03, STD-E3-04, STD-G3-04)
2. **f3-f10: the two steel trays are bare squares with no face**; the cooked skewer lies on the lower tray at f10 with nobody's face
   near it, and the Doctor appears only in the closing scene. Chai's tray carries the asker's face from the first frame. (STD-E2-07)
3. **f5-f10: the station is three unrelated rectangles on marble** (a tall narrow plank, a square tray, the grill), with no sense of
   where the skewer goes next; the barbecue art is still to come (SEK-20) and nothing marks the plank and trays as placeholders. Chai's
   hob and tray read as one station. (STD-H1-05, STD-E3-01)
4. **f5-f13 (panel): the item card reads "hakri lakri tameto / one skewer (a stick) of tomato"**: English with a bracketed gloss, three
   lines of small text under the picture. Chai's English under a word is one or two words ("one sugar"). (STD-E2-02, STD-A2-01)
5. **f5, f6: the item card's picture (a horizontal red skewer) is not any shelf item's picture**; the shelf shows a heap of tomato
   cubes, and the child taps "tameto" to make "hakri lakri tameto". (STD-E2-04)
6. **f3-f10: the grill's coals are a photographic, noisy orange texture** beside the chunky stylised cube heaps, two looks in one
   frame. (art bible §1: no photorealism, one style)
7. **f1-f4: four of the sixteen frames are the same greeting frame** (a quarter of the round) before the order starts; chai moves from
   greeting to reply to order across three different frames. (STD-E4-04, a hold a child sits through)

## 5. Daar

Sheets: `cook-daar@1280x665-sheet.png`, `cook-daar__740x320.png` (15 states).

**The rubric, in short:** A: 1 pass; 2 part (phone 3: the box frames the whole chop strip); 3 pass; 4 pass; 5 can't tell; 6 n/a; 7
**fail** (f7, f9). B: 8 **fail** (f6); 9 **fail** (text chips); 10 **fail** (blank picture); 11 pass; 12 **fail** (two order cards);
13 pass; 14 not reached; 15 part ("Chop these."). C: 16 **fail** (f5's empty strip); 17 **fail** (the stray sprinkle); 18 pass
(baseline); 19 **fail** (f5); 20 **fail**; 21 pass. D: 22 pass; 23 **fail** (timer circle, gauge); 24 pass; 25 part; 26 pass; 27
**fail** (the chop background placeholder unnamed); 28 pass. E: 29 **fail** (the stir); 30 not seen; 31 **fail** (f7 to f8 jump); 32
pass; 33 **fail** (tick button). F: 34 pass; 35 **fail**; 36 **fail** (blank first meeting of "aste thi"); 37 n/a. **38: no**, for
flaws 1-5.

**Flaws, most serious first:**

1. **f9-f12 (and phone 8-11): the stir is shown on a black tortoise-and-hare gauge beside the hob, not on the pot, and its item card
   "trae aste thi / three slowly" has a blank white picture and nonsense English.** Chai shows every timed window on the pan's own
   ring, and every card has its picture. (STD-B2-03, STD-E3-02, STD-E2-04, STD-A2-04)
2. **f9-f12: Nani's line "Firai! Trae! aste thi" is three fragments stitched** (a capital, an exclamation, then a lowercase tail),
   not a sentence; chai's "Chulo bar!" is one phrase. (STD-A4-01, non-negotiable 2: report the gap, never ship the fragment)
3. **f7: "Pela loon. Ne poi hardar." gives two steps in one line**; Nani's box should hold the step now. (STD-D3-01)
4. **f9-f12 and phone 11: a gold tick button ends the stir**; chai's work ends by itself. (STD-B1-06)
5. **f5 (and phone 3-5): the chop screen is a code-drawn green timer circle, a knife and one onion on bare marble, with an empty cream
   strip where the shelf band should be**; the chop background is a placeholder nothing names. Chai's band is the stone with every
   ingredient on it, and nothing on screen is code-drawn. (STD-E3-02, STD-E3-03, STD-H1-05)
6. **f5 and phone 3: the panel carries two order cards**: a "Chop these." card with an English headline and no face, then "Muke daar
   khape."; three stacked boxes. Chai has one order card with its asker's face. (STD-E2-03, STD-01-03)
7. **f6: the whole order appears at once as one big horizontal card of text chips** (hakro dungri, loon, hardar) in the middle of the
   play area, and loon and hardar never get a picture in the panel (f7-f12 show them as text chips). Chai pops one item card with its
   picture at a time, as it is said. (STD-B1-03, STD-E2-01, STD-E2-04)
8. **f7-f12: a pink flower-shaped sprinkle hangs in the air left of the hob through six frames**, a juice effect left behind where
   nothing is. (STD-E1-05, STD-E3-02)
9. **f7-f12: the serving katori sits right of the hob with no face until the "Shabash!" face appears at f13**; chai's face is on the
   tray from the start. (STD-E2-07)
10. **f7 to f8: the pot is empty gold as "loon" goes in and full of daar as "hardar" does**; the chopped onion never reaches the pot
    and the dish appears in one jump. (STD-E4-01, STD-E4-03)
11. **f16: the word review lists "ne poi / and then", a connective, as a word learned.** Minor. (STD-D5-04)

## 6. Eggs

Sheets: `cook-eggs@1280x665-sheet.png`, `cook-eggs__740x320.png` (10 states).

**The rubric, in short:** A: 1 pass (f9); 2 pass; 3 pass; 4 pass; 5 n/a; 6 n/a; 7 pass. B: 8 pass; 9 **fail** (blank picture); 10
**fail**; 11 pass; 12 pass; 13 pass; 14 not reached; 15 pass. C: 16 **fail** (no shelf band, f1 and f7 half-built); 17 **fail**
(the pot's handle on the pan); 18 **fail** (phone 3-5, 7 findings a state, worst of the four); 19 pass; 20 pass (the face on the
tray); 21 pass. D: 22 **fail** (the pot's camera); 23 pass; 24 pass; 25 part; 26 **fail** (no knob, no ring); 27 pass; 28 pass. E:
29 **fail**; 30 not seen; 31 pass (the egg on its plate); 32 pass; 33 part (one tap is the whole round). F: 34 pass; 35 pass; 36
**fail** (first meeting of "tarelo" with no picture); 37 n/a. **38: no**, for flaws 1-3.

**Flaws, most serious first:**

1. **f1: the first frame is a blank cream screen with an empty Nani's box; f7: the play area is empty marble while the panel already
   shows the order.** Two half-built screens a child sees. Chai is final from its first drawn frame or covered. (STD-F4-05)
2. **f7-f10 (and phone 3-5): the item card "hakro tarelo indo / one fried egg" has a blank white picture in every state**, so the word
   "tarelo" is met for the first time with no picture. Chai's every card has its picture. (STD-E2-04, STD-A2-04, STD-H1-05)
3. **f8-f10: there is no shelf band**: the one ingredient, a bowl of eggs, floats in the play area left of the hob with its pill. Chai's
   ingredients stand on the shelf band. (STD-E3-03, STD-E1-01)
4. **f8: the pot is drawn from about 45 degrees (its side wall and rim show) beside a straight-down pan, and its right handle reaches
   the pan's rim.** One camera per scene; nothing overlaps what it should not touch. (STD-E3-01, STD-E1-05; kitchen.md names the
   handle edge)
5. **f8-f10: the hob has no knob, no face circle and no heat ring**: nothing shows the fry's window or how long it cooks. Chai's hob
   has all three. (STD-E3-04, STD-B2-03)
6. **f8-f10: the whole L1 round is one tap** (egg into pan), and the badge reads 6 s; chai's L1 is three things, a knob and a pour.
   A five-year-old finishes before anything was asked of them. (STD-02-01)
7. **Phone 3-5: 7 findings a state** (text-small 3, tap-small 3, canvas-text-small 1): the pill under the egg bowl and the card's
   three lines are below the floors, the worst of the four games (chai's states carry 4-5). (STD-E6-02)
8. **f2-f5: four frames of greeting** (a quarter of the round) before the order; chai three. (STD-E4-04)

## 7. The top five across the four games

1. Timed windows shown off the thing or not at all: sekelo's 20 px dial, daar's tortoise-and-hare gauge, eggs' hob with no ring.
2. Nobody's face on the serving place until the serve: maani's plates (on the shelf band), sekelo's trays, daar's katori.
3. Cards whose picture is not the shelf item's, or blank: maani's lookalike cooked chapatis for raw dough, sekelo's skewer card,
   daar's and eggs' blank pictures.
4. A tick button ends the work (maani, daar) where chai ends by itself; Nani's lines that are fragments or two steps (daar).
5. Half-built or placeholder screens shown as real: eggs' blank first frame and empty play area, daar's chop strip and timer circle,
   sekelo's three rectangles.

## 8. What still pictures cannot show

- **Timing:** whether a light comes a breath after the last move or too early; whether the window's green lasts 2 s; whether a tap
  lands during a line; how long the greeting holds (the film's even sampling only hints at it).
- **Motion:** whether the pop-out flies the least bowed path and lands on its row within 2 px; whether the order card folds or snaps;
  whether the tawa's maani flips or is redrawn; whether anything jumps mid-motion (daar's f7 to f8 may be a cut between two samples).
- **Sound and voice:** which lines are family clips and which the device voice; whether one voice speaks at a time; whether a control's
  sound plays only when worked; whether the boil's sound rises; every rule of E5 and B4-01 to B4-03.
- **Input:** whether a drag starts on its target or runs in a track (maani's roll, daar's slice); whether a tap past a count only
  wiggles; whether undo works until the step moves on.
- **The stuck path:** no frame shows a child idle long enough for the stuck hint or the helper card (rubric 14), nor a wrong move
  (rubric 30).
- **The round at other levels and sizes:** one round at L1 at two sizes; the blur rule, dotted English and the word moment are L2+.

## Result (scored by the orchestrator against Zafar's 8 Nov points)

Of the 19 points Zafar made on these four games that a still could show (maani 5, sekelo 4, daar 7, eggs 3): **3 caught, 6 partly,
10 missed** (about a third to a half). Fable also found about 25 real flaws he did not mention (timed windows off the thing, no face
on the serving place, Nani's stitched fragments, two lights at once, half-built screens, a 45-degree pot beside a top-down pan).
The misses: **motion and timing** (overlapping fingers, a light that stays, a flash in flight: stills cannot show them) and **fine
shared-piece detail** (the missing drop-down, the card's divider, a light clipping a pill: too small at sheet size, no close-up of
chai's card beside the game's). **Conclusion:** the hybrid works with three changes: (1) automate "is the shared piece there" (chai's
card, Nani's box with its drop-down, the shared light, no tick button) as code checks; (2) the judge gets full-size frames at key
moments with close-ups of the card and side panel beside chai's, not contact sheets; (3) short frame strips round each onboarding
moment for motion and timing.

## Proof

**Read, before writing the rubric:** `CLAUDE.md`; `docs/design-language/standard/README.md`, `0-foundations.md`, `a-learning.md`,
`b-play.md`, `c-progression.md`, `d-guidance.md`, `e-presentation.md`, `f-build.md`, `g-proof.md`, `h-supply.md`, `glossary.md`,
`patterns.md`, `placement.md`, `values.md`; `docs/design-language/art-bible.md`; `docs/game-design/families/kitchen.md`.
`docs/design-language/standard/gaps/` was deliberately not opened (per-game gap findings would have primed the judging).

**Not read:** anything under `docs/feedback/`, `docs/process/regressions.md`, `docs/archive/`, `build/reports/s18-review-and-direction.md`,
`build/reports/s18-fable-*.md`, `build/reports/s18-feedback-*.md`, or any 8 Nov report. No game code was opened.

**Pictures looked at:** the ten films (`build/screenshots/sandbox/s18-w3-films/films/cook-<game>@1280x665-sheet.png`, each cut into
four 2x2 quads at full resolution and chosen frames zoomed 2x, all in this session's scratchpad) and the ten phone sheets
(`build/screenshots/sandbox/s18-w3-full/sheets/cook-<game>__740x320.png`). Judged in full: chai (reference), maani-line,
mishkaki-grill, daar, eggs. Opened but not written up after the cut: chaat, samosa, corn, baking, chop.

**Frame numbering:** the 16-frame sheet is 4x4, read left to right, top to bottom, f1 to f16. The phone sheet's states are numbered as
its captions number them.

**Changed:** only this file.
