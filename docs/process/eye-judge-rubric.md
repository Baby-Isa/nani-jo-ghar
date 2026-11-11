# The eye judge's rubric

> **Which checks run when, and how deep:** `docs/process/qa-checklist.md` "When we check, and how deep" (Zafar, 9 Nov). Where this file says otherwise, that section wins.


What the eye judge asks of a game beside chai (Sprint 19, s19-checks). From the 8 Nov experiment's 38 questions
(`build/reports/s18-eye-judge-experiment.md` §1), keeping their numbers; the ones part 1 now checks in code are listed at the end and not
asked. Each question is answered from `sidebyside.mjs`'s pictures: chai's frame of the same moment on the left, the game's on the right.
The rule each comes from is in brackets; the moments it is asked at follow (order, light, kind, mid, serve, praise, end, strip).

**How:** flaws first, most serious first, each naming the picture (`1280x665/pair-2-light.png`) and what chai does instead. A moment a
page never reached is an EVIDENCE note for the tool, never a flaw of the game. Then one line per question: pass, FAIL with the picture,
or can't tell. Last: Q38, and the merge rule's question (below).

## A. Onboarding and lights

- **Q1** Is the first-time light one look: everything dims, a gold-edged box round the one lit thing, no ripples, arrows or pulses
  elsewhere; a finger only for a drag, hold or rub? Chop's knife cut is the one exception: its box takes in the knife's whole path, right to left (STD-E2-08a, Zafar 10 Nov). (STD-D1-02) (moments: light, strip)
- **Q2** Does the lit box frame one whole target and never a whole region, the corners at most a quarter of its height, never across a
  face or the side panel? (code checks whole, centred and the neighbours: contract-92, -105; judge the look) (STD-E2-08) (moments: light, strip)
- **Q4** Is the light on the thing the child must touch next, and does Nani's call come with it? (STD-D1-06, STD-F3-05) (moments: light, strip)
- **Q5** After the first items, does the light move to the next item's card, that card whole in view? (STD-D1-07) (moments: kind, mid)
- **Q6** When a next vessel is needed for the first time, is its rim lit once the first is served? (STD-D1-10) (moments: mid, serve)
- **Q7** Does Nani's box show the step now (one short line, her face, the drop-down), never the whole order, one height in every
  state? (code checks the drop-down and the one-line fit: contract-101) (STD-D3-01, STD-D3-05) (moments: order, light, kind, mid)

## B. The order card, the item cards and Nani's box

- **Q8** Does each item's card pop out big as it is said and fly whole into its row? (code checks nothing shows before it is said:
  contract-88) (STD-B1-03) (moments: order)
- **Q9** Is every word on the one word card, the same in the pop-out, the row and the helper, with chai's line above the speaker and
  its Kutchi over its English? (code checks the 6 Nov card and type are on: contract-100) (STD-E2-01) (moments: order, kind, mid)
- **Q10** Does each item card's picture show one of the thing, plainly, and tell two items apart? (code checks blanks and crates:
  contract-104) (STD-E2-04, SH-242) (moments: order, kind, mid)
- **Q12** Are the panel's cards even: equal padding and gaps, words level, at least 2.5 item cards shown and the current one whole?
  (STD-E2-03, STD-E1-02, STD-E1-04) (moments: order, kind, mid, serve)
- **Q14** When the child is stuck, does the helper card open under Nani's box with the item's card as the item glows? (STD-D3-02)
  (moments: mid, strip)

## C. Layout and the scene

- **Q16** Does the frame read as chai's: side panel left, the play area, the shelf band across the bottom third, nothing cut at
  740x320 or 1280x665? (code checks the shelf's base and chip lines: contract-109) (STD-E1-01, STD-E3-03) (moments: order, light, kind, mid, serve)
- **Q17** Does anything overlap what it should not touch: shelf items against the hob, a bubble over a face or the panel, a prop
  across another? (STD-E1-05, STD-E2-06) (moments: light, kind, mid, serve, praise)
- **Q18** Is the shelf one row of items on one line, evenly pitched, each with its pill? (code checks the sizes: text-small, tap-small,
  pillcheck) (STD-E6-02) (moments: light, kind)
- **Q19** Is the worktop the white marble and the panel and shelf band the stone, one highlight colour for whatever is lit?
  (STD-E3-03, STD-E6-01) (moments: light, kind, mid)
- **Q20** Are the face circles the kit's, beside what they own (the glass, the plate, the skewer) from the first frame? (STD-E2-07)
  (moments: kind, mid, serve)

## D. Art and perspective

- **Q22** One camera: is every item drawn straight down, no three-quarter or eye-level prop mixed in? (STD-E3-01) (moments: kind, mid, serve)
- **Q23** Is everything a real picture: no code-drawn circle, bar or box standing in for a thing? (STD-E3-02, STD-H1-05) (moments: kind, mid, serve)
- **Q24** Are items at one height scaled by size class, nothing a speck beside a true-size pan? (STD-E3-01) (moments: light, kind, mid)
- **Q25** Does the art read in the house style: the 3D-film look, no outlines, light from the upper left, a contact shadow under
  everything, walnut, white marble, no text or logos? (art bible §1-2) (moments: kind, mid, serve)
- **Q26** Does each pan show its own picture for its state, centred on its burner, the heat ring over its handle? (STD-E3-04) (moments: mid, serve)
- **Q27** Are any cuts rough: a background strip, a halo, a hard edge, an upscaled blur, an unnamed placeholder? (STD-H1-06) (moments: kind, mid, serve)
- **Q28** Is anyone at a counter in the house style, dressed modestly, with no religious markers? (STD-E3-05, STD-01-09) (moments: order, praise, end)

## E. Play and feedback

- **Q29** Is every timed action's window shown on the thing itself (the ring filling to its green), and called as it opens? (STD-B2-03)
  (moments: mid, strip)
- **Q30** Does a mistake show only in the thing, never a cross, a frown or a verdict? (STD-B2-04) (moments: mid)
- **Q31** Does a finished dish have a visible payoff that plays out before the next thing asks for the eye? (STD-B2-11) (moments: serve, praise)
- **Q32** Does the round close as chai's: each dish to its asker, thank-yous, then the two-page end screen, no sweets as rewards?
  (STD-B1-02, STD-D5-04) (moments: serve, praise, end)
- **Q33** Is every action a tap, or a drag along a fixed track or a rub that starts on its target? (code checks the tick button:
  contract-103) (STD-02-03) (moments: kind, mid, strip)

## F. Language on screen

- **Q34** Is every Kutchi spelling the same on the pill, the card, the pop-out and the helper? (STD-A4-04) (moments: order, kind, end)
- **Q35** Is each order headline and each of Nani's lines a full natural sentence, never stitched fragments or two steps in one? (code
  checks the words: the word lint, contract-16) (STD-A4-01) (moments: order, light, kind, mid)
- **Q36** Is a word met for the first time shown plainly (picture, Kutchi, English), nothing dotted or blurred? (STD-A2-04) (moments: order, light)
- **Q37** Does a word a picture can't show (an amount) get its word moment before it decides? (STD-A3-01) (moments: mid)

## G. Motion and timing (the strips; new with part 3)

- **Q39** Is there ever more than one finger, or a finger with a tap's light? (STD-D1-02, MAA-20) (moments: strip)
- **Q40** Does the light leave as the child starts the move, and does nothing flash or light up in flight (a pile lit while a maani
  flies)? (code checks the light's leaving: contract-106; judge the flashes) (SH-236, MAA-22) (moments: strip)
- **Q41** Does anything jump, snap or appear in one step where chai glides (a card, a pot filling, a box resizing)? (STD-E4-01,
  STD-E4-03) (moments: strip, kind, mid)
- **Q42** Does a lit shelf item hop and nothing else? (code: contract-107; judge how it reads) (SH-237) (moments: strip)

## The overall question

- **Q38** Would a premium, Toca Boca-level children's game ship this screen? If not, why not? (moments: order, light, kind, mid, serve, praise, end)

**The merge rule (principle 10; proposed 8 Nov, not yet agreed by Zafar):** nothing merges that `sidebyside.mjs` shows worse than chai at
the same moment, unless a look sheet Zafar accepted says it may differ. The judge ends with the moments where the game is worse.

## Asked in code now (part 1 and the older checks; not asked here)

Q3 two lights at once or a light left on a thing done (contract-87, -106) · Q11 a word cut, ellipsised or outside its card (the
screen lint, contract-15, -51) · Q13 a row ticks as reached and well done waits for the last tick (contract-18, -108) · Q15 English for
the child (contract-16, -39) · Q21 a tick, next or X button, a button outside the side panel (contract-103, -54). Measured halves
(s19-checks-2; the eye keeps the rest): Q41's snaps and size jumps (contract-114; "is it chai's glide" stays here) · Q24's main thing
and shelf heights (contract-115) · Q12's padding, gaps and a half-empty card (contract-116).

## What pictures still cannot show

Sound and voice (one voice at a time, family clips: contract-3, -7, -17 and Zafar's ear), input (a drag starting on its target, undo),
the stuck path at length, and levels and sizes not played.
