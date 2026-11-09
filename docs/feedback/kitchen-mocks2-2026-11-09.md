# Feedback: mock-up round 2, the stone tray, and baking, oven and chop, 9 Nov 2026

**Source:** Zafar's dictated note of 9 Nov (`docs/feedback/kitchen-mocks2-2026-11-09-transcript.md`, paragraphs [1]-[21], no
timestamps: the paragraph numbers stand for the times), with three images of his own ChatGPT stone-tray studies
(`sources/art/s19-mocks2/zafar-stone/`). The mock-ups he names are `sources/art/s19-mocks2/results/` (review page 2; Fable's review
`build/reports/s19-mocks2-review.md`). Fable answered his stone-tray questions: `build/reports/s19-stone-tray-fable.md`.
`build/tools/ops/feedback.mjs` reads only timed lines, so this report is written by hand in its shape. Causes checked in code on
`ccr-87413d9b-j48fpk`. Logging only: nothing is fixed here.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Chop | Fruit-Ninja tosses in arcs from off the board (js/cook/mechanics/chop.js:2-7) | his own: the whole items sit on the stone tray along the bottom with their pills; they hop straight up onto the board and drop back, at different times; swipe one while it is up. L1 one in the air at a time; L2 two, sometimes one a decoy; more after. Nani's "which and how many" unchanged | P20 |
| Baking: a little, a lot | not a choice: "a little" stops after one tap, "a lot" after `lotTaps` taps (js/cook/stations/baking.js:296, :14-15), so the child wins by tapping until stopped | his: clear quantities first (the jug's lines, word moments for half and full, then 1½ and 2½), then Nani's corrections ("flour, a little more"; "water, a lot more") at L3-L4; how a child chooses "a little" or "a lot" is the open question (decision 10) | P18 |
| The oven | tap to open, tap the naan in, the ring fills, tap to take out (js/cook/stations/baking.js:384-465) | his question: what words the oven can teach and how (decision 11: the tray on the shelf Nani names, the door, "it's ready") | P19 |
| The stove's knob and face | at the front, below each burner, in every game (js/cook/kitchen-kit.js:224-240, `hob.frontY`) | his rule: one pan (daar, samosa's fry, maani's tawa) → knob and face to the left of the hob, so the pot can be as big as the height allows; several pans (chai) → below each, as now | P9, P12 |
| Daar's lap count | a Kutchi number word on a white chip in the dial (js/cook/stations/daar.js:1292-1297) | our own item card pops up per lap: the numeral as its picture, the Kutchi word, the English, the speaker lit while Nani counts | P10 |
| Samosa's fold | swipes along a strip drawn in code (js/cook/mechanics/fill-fold.js:9-10) | a 3-4 picture sequence like the end scene's page turn, ChatGPT drawing it from our exact geometry | P13 |

### 1b. Old art reused

Chai's hob for every stove (his "We want all the stoves to look the same, like they do in Chai"): no new stoves from ChatGPT. The
skewers and pieces in the game today for the skewer spacing check (P4). The walnut stays for the boards (rolling, chopping, samosa);
the band's tray becomes stone.

## 2. Every point

| P | Lines | What Zafar said | Screen | Cause (checked in code) | Fix | Layer |
|---|---|---|---|---|---|---|
| P1 | [1] | "I think the walnut ... trays that have the items resting on them ... is just too much wood and gives it more of an old style game feel ... a modern stone version, would look better ... something you might see in a high-end restaurant ... Does it look more modern and clean than the walnut? Does the color tone good ...? Is the texture good ...? Is the rim good, or no rim, or something in between? ... consult Fable" | every top-down game's band | not code: art (ART-69's tray not yet made) | ART-69 changed: the stone tray, Fable's spec (one slab; honed warm-grey #C4B8AD to #B5A99E; fine speckle, no veins; a low soft lip; chai's shelf as its lighter cut) | art |
| P2 | [2] | "ChatGPT is never going to get everything right for us ... we need certain placement and certain spacings and how the game mechanics actually work ... We want all the stoves to look the same, like they do in Chai ... Some of the things don't look straight top down either ... visual inspiration ... When we create the art mockups, we need to have that in mind." | every game, the art runs | not code: art process (the round-2 block asked for whole screens, docs/design-language/art-plans/s19-mocks2-chrome-block.txt:22-31) | PRC-16: mocks are inspiration; the art runs ask for pieces, we compose in code; SH-246: every stove is chai's hob | process, shared |
| P3 | [3] | "I like the first try option. I think the brighter coals look more fun ... the calmer coals looks almost like they're turned off ... something in the middle ... it needs to be a little bit more top-down view on the grill ... a reference image might help" | sekelo grill | not code: art | SEK-20: coals between the two, lit and lively; the grill straight top-down with a reference | art |
| P4 | [4] | "when you add the skewers, the uncooked and cooked skewers, is there enough space for them on the trays? ... mock up a version with cooked and uncooked skewers on the trays, and even on the barbecue ... we might find we need to space out the trays more ... before committing" | sekelo grill | not code: layout (js/cook/stations/mishkaki-grill.js:9 the plate; the trays not built yet) | SEK-20: a spacing check with skewers on both trays and the grill at the four sizes, before the art run | layout |
| P5 | [5] | "the shadows on this tray ... copying the rule we agreed earlier ... or ... render the trays with 1, 2, 3, and 4 skewers ... I'll leave that to your discretion" | sekelo grill | not code: art method | SEK-20: skewers placed by code in fixed slots, each cut carrying its own soft contact shadow (lower right); no pre-rendered tray states | art |
| P6 | [6] | "I don't quite like corn ... a lot of very different visual elements ... I just don't like oval metal trays ... Circle ... rectangle and square I can do ... make it the same as Sekelor ... the same two tray setup ... Cooked and uncooked, same barbecue, same grill ... barbecue fish ... steak" | corn; every plate and tray | not code: layout and art (js/cook/stations/corn.js:7-12) | CK-67: corn is sekelo's grill kit exactly; ART-71: no oval trays or plates anywhere | game, art |
| P7 | [7] | "the three dough balls are now looking better ... bird food ... change ... the trays to round ... the stove needs to be the house stove ... the handle of the pan ... very close to ... the rolling pin ... position it to the bottom right ... the ... spatula, can ... move further right, or ... be smaller sized and sit above the handle" | maani | not code: art and layout | MAA-24: round plates, chai's hob, the tawa's handle to the bottom right, the turner smaller above it | game, art |
| P8 | [8] | "the dough balls need to be maybe smaller because they'll need to have the text peeled anyway. And then the plates can be a bit bigger ... you roll the mani the size of the rolling board ... it just shrinks down into the small tray ... probably one we just have to accept" | maani | not code: proportions | MAA-24: smaller dough heaps, slightly bigger plates; the board-to-plate shrink accepted | art |
| P9 | [9] | "the burner needs to be house style with the button to turn it on ... maybe we have the button for the burner and the face on the left hand side, so that the main saucepan can be nice and big ... I do like the handle for the stirrer" | daar | js/cook/kitchen-kit.js:224-240 (knob and face at the front) | DAAR-48: chai's hob, knob and face on the left, the ladle kept; SH-247 the rule | game |
| P10 | [10] | "it should be just an item card that has as its image the number 1, then the catchy word for the number 1, and English word, and ... the speaker, which is ... activated because ... the person's counting ... use our own item card" | daar's stir | js/cook/stations/daar.js:1292-1297 | DAAR-50: the lap count as our item card | game, shared card |
| P11 | [11] | "I don't know if I agree with your see-through layers per topping ... If you think that will work, go for it ... maybe we just try it for one of the chart, and if it works, then we do it for Samosa as well" | chaat, samosa | not code: art method (js/cook/mechanics/assemble.js:10-13 tiles strips today) | CHT-04: one test of stacked topping layers in the mini run; samosa follows if it works | art |
| P12 | [12] | "we need a button to turn on the fryer ... the button's off to the left-hand side ... with tea ... up to 3 tea stoves ... the button on the bottom ... where you only have one item ... the button off to the left ... I think that's the general rule" | samosa's fry; every stove | js/cook/kitchen-kit.js:224-240 | SH-247: the knob rule, every game; SAM-34 | shared |
| P13 | [13] | "the fold ... looks good in that third image in ChatGPT ... the turning pages of the book ... Do you not think we can do the same 3 or 4 image folding sequence with Samosa? ... You may need to draw it in code for ChatGPT to then replicate ... the stages of folding, exactly proportions" | samosa's fold | js/cook/mechanics/fill-fold.js:9-10 | SAM-21: the fold as a picture sequence from our code-drawn guide | game, art |
| P14 | [14] | "I do like the ... utensil you use for the samosas ... it rests on a cloth ... keep that ... I like that style of like wood and metal" | samosa's fry; utensils | not code: art | SAM-34: the slotted spoon on its cloth kept; wood and metal the utensil style | art |
| P15 | [15] | "there's no omelette one ... you ... add chilies and cheese ... requires the mixing element from DAR ... a bowl ... your bowl on the shelf and you pour it in and it cooks. Maybe an idea for later." | a new recipe | not code: idea | `docs/ideas.md` (no row) | idea |
| P16 | [16] | "the stove is not the right stove shape, and the pan, it looks weird ... add 4 plates onto the serving area, ideally ... We do it for tea ... keep the pans the same kind of style ... the Mani one ... wooden handle ... Or ... all stainless steel ... create 2 versions of the pan ... place the pan in whichever orientation you like" | eggs | not code: art and layout (js/cook/stations/eggs.js) | CK-66: chai's hob, up to four plates, two pan versions to choose, the handle placed by us | game, art |
| P17 | [17] | "did we really make assets for it? ... I thought we made glass bowls and glass jugs side on, so you can see everything going in. I don't think it can be opaque ... probably needs to be glass ... but then you've got to like make the artwork for all of that" | baking | not code: art (data/stations/baking.json:1 "the wall, tiles, counter, jug, mound and oven are pictures") | CK-69: glass bowl vs opaque bowl a touch above side-on, tested in the mini run | art |
| P18 | [18] | "what is the actual gameplay like? ... the put extra ... put lots or put little? ... how do we actually intuitively explain that? ... little or a lot ... later word moments ... half and whole and quarter ... 1.5 and 2.5 ... you follow a set of clear instructions with clear quantities, then Nani ... says, like flour, put a little bit more. And then, water, put a lot more" | baking | js/cook/stations/baking.js:296 (a little and a lot are stopped by the game, not chosen) | CK-72: baking's amounts taught in order; a little and a lot made a real choice | game |
| P19 | [19] | "the oven ... should fit the house theme ... it shouldn't have marble either side ... green cabinets either side ... is there a start stop button, an open door button? ... the words for open, close ... what could we teach with this oven mode? ... a bit of a review ... put the tray in ... top, middle or bottom ... then put the naans, then turn it" | baking's oven | js/cook/stations/baking.js:384-465 | CK-70: the oven in the house kitchen with green cabinets; its words and steps (decision 11) | game, art |
| P20 | [20] | "I concede ... quite a good idea from Fable. Have the items uncut ... along the bottom ... they move up from the bottom ... stoneware onto the chopping board and then fall back down ... maybe they don't go in arcs ... just go up and then down, but at different times ... level 1 ... only one item's flying ... level 2 ... 2 items. Sometimes one of them a decoy" | chop | js/cook/mechanics/chop.js:2-7 | CK-71: the hop mechanic; ART-37: the board above the band | game |
| P21 | [21] | "analyze them all ... answer me where I've asked for your input ... make a plan ... another art one just to test a few elements ... a mini art one ... then we just do the full art one" | the plan | not code: process | the reply: a mini art run, then the full one | process |

## Decisions for Zafar (numbered, "yes to all except ...")

In the orchestrator's reply, 9 Nov; each row names its decision.

## 3. Rows

Levels: these are mock-ups (each game's L1 screen). Every row checks L1-L4 of each station it touches.

| ID | Point |
|---|---|
| ART-69 (changed), PRC-16, SH-246, SH-247, ART-71, SEK-20, CK-67, MAA-24, DAAR-48, DAAR-50, CHT-04, SAM-21, SAM-34, CK-66, CK-69, CK-70, CK-71, CK-72, ART-37 | P1-P20 as in §2 |

## 4. Coverage

| Lines | Point |
|---|---|
| [1] | P1 |
| [2] | P2 |
| [3] | P3 |
| [4] | P4 |
| [5] | P5 |
| [6] | P6 |
| [7] | P7 |
| [8] | P8 |
| [9] | P9 |
| [10] | P10 |
| [11] | P11 |
| [12] | P12 |
| [13] | P13 |
| [14] | P14 |
| [15] | P15 |
| [16] | P16 |
| [17] | P17 |
| [18] | P18 |
| [19] | P19 |
| [20] | P20 |
| [21] | P21 |

Unmapped 0.

## 5. Told before (why it slipped)

Searched the fix list and the feedback archive for each point. Told before and reopened or changed: the tray (ART-69: walnut on 9 Nov,
now stone), sekelo's layout (SEK-20), corn as sekelo (CK-67), maani's look (MAA-24), daar's look (DAAR-48), chaat's layers (CHT-04),
the fold (SAM-21), samosa's fry (SAM-34), eggs (CK-66), baking (CK-69), chop's board (ART-37). None slipped: they were open, waiting on
this round. New: PRC-16, SH-246, SH-247, ART-71, DAAR-50, CK-70, CK-71, CK-72.

## 6. The second reader

A fresh Fable agent read the transcript and the 19 rows only (`build/reports/s19-feedback-1109-round2-second-reader.md`): 0 missing
of weight, 9 weakened or narrowed, 3 over-claimed, 4 minor. All fixed in the rows: SEK-20 keeps his ChatGPT skewer mock-up and his
coal pick; CK-70 his naans and turn-on steps; CK-72 his quarter and three quarters; ART-69 every wooden-tray image and "not
restricted"; SAM-34 the utensil style everywhere; MAA-24 the three heaps and both turner options; CK-69 his lean to glass; CK-67
and ART-69's shelf marked proposed; ART-37 the board's material left open; DAAR-50 the pill; the omelette note ours. The plan ([21])
lives in the sprint file. Both readers: 0 unmapped, 0 missing, 0 weakened after the fixes.
