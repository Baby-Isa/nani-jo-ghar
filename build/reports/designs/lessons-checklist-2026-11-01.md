# Lessons checklist for new game designs (1 Nov 2026)

Each line gives a rule, then [the evidence]. **NEW** means it isn't in the design method's §4.2 or §5 (25 Sept). CLAUDE.md's non-negotiables apply on top of this list.

**Sources:**
- In `docs/archive/feedback/`: C929 and K929 (Cook and clinic, 29 Sept), K1001 (1 Oct).
- In `docs/feedback/`: C1017, K1018, S12 (22 Oct), CARDS (chai-cards), ONB (chai-onboarding), RULES (chai-rules), EVE (chai-play, evening), S14P (cook-s14-play).
- RB, E2P and SPK are the rulebook, easy-to-play and speaking docs in `docs/game-design/`.
- UX and GC are ux-principles and guide-and-card in `docs/design-language/`.
- AUD and OTH are the two 31 Oct research reports.
- Row IDs are in `docs/process/regressions.md`.

## 1. The heard word decides
- [ ] Write the leak test for each mini-game. The bot plays a learned save and must win under 10% of rounds. [E2P 8; §4.2]
- [ ] **NEW** Name the deciding words and how many Mum has recorded. A reader wins on English placeholders (the dastarkhwan: 95-100%). [AUD flaw 2]
- [ ] **NEW** Ticks mustn't let a child fish ("if it's not ticked, you take it out"). Tick only the right item, first go. [C1017 P62-63; CHT-14]
- [ ] **NEW** Show a need the picture can't settle (no outlines, no dirt only on the answer), and rotate who wants what. [OTH lessons 2, 6]
- [ ] **NEW** From L2, two words per move (which and how many). [OTH lesson 3]
- [ ] **NEW** Teach your own words, not just numbers: numbers decide 8 of the 12 heal games, and no number has its own clip. [AUD §1b, flaw 4; CLN-119]

## 2. Onboarding and the first round
- [ ] **NEW** The first round is the tutorial: "lose them by confusion, not by boredom". [K1001 §8D]
- [ ] **NEW** One live thing at a time, in a lit box with a gold glow; the rest is dimmed and can't be tapped. No finger, no ripple, and no item shown flying into place ("you're going to try to drag it"). [RB; S12 A5; S14P P1]
- [ ] **NEW** At the start, show what isn't on the card. Show each new action once; a timed control holds in the green the first time. [RB; SH-158]
- [ ] **NEW** The dim clears fully. The box hugs its thing, never crosses a face, and shows up on dark things. [CHAI-33, CHAI-36, CHAI-50; RULES P6]
- [ ] **NEW** Every new screen has its onboarding; the book, ride, door, samosa and pantry all shipped without. [S12 D8, E4, F2; C929 X11; S14P P13]
- [ ] **NEW** Tap, then tap. Drag only along a track. Use 4-6 hiding places at L1. [E2P 5; OTH lesson 4]

## 3. Instructions: cards, the helper, Nani's lines
- [ ] **NEW** The asker is on screen and speaks before any card appears. Each item's card pops up big, then flies into its row. [GC T6; RB; SH-171; PAN-19]
- [ ] **NEW** The card is what's wanted and never changes. The guide box says the current step. [GC R1-R2]
- [ ] **NEW** The guide names the next item only when her helper card opens with the full answer. [SH-172]
- [ ] **NEW** Bubbles belong to faces. Model it, then ask: two characters play the exchange first. [GC R3; UX 14 Oct]
- [ ] **NEW** Listening again is free; only the bulbs cost. A replay says only what's left. [SH-102; K1018 P6]
- [ ] **NEW** One line per moment: no name on every tap, no repeats, no overlapping voices. [SH-94; PAN-04]

## 4. Pacing and waiting
- [ ] **NEW** No Next and no ✓ Done; each step moves on by itself. A "stop at N" challenge needs redesigning. [E2P 4]
- [ ] **NEW** A tap skips the order, and a tap during speech is never lost. [CK-54; SH-157]
- [ ] **NEW** Hints come after 7, 9, 11 or 13 s, counted from the last action. [RB; SH-60]
- [ ] **NEW** A light waits until everything is still, and the call comes after it. Stay quiet during the action. [CHAI-40, CHAI-42; EVE P1]
- [ ] **NEW** Allow plenty of time (the ride runs about 50% slower), and nothing leaves before it's asked for. [S12 E1; C1017 P45; OTH lesson 8]
- [ ] **NEW** Repeat the ask every few seconds for non-readers. [S12 C3, F4]
- [ ] **NEW** Load fast, with no jumps after the first frame. [S12 A1; RULES P8-9; CK-48]

## 5. Feedback, progress and the end
- [ ] **NEW** A mistake gets a shake and the word, and the wrong item is redone on the spot. Undo works until the step moves on. [RB; UX §17]
- [ ] **NEW** Every right move gets a reaction; each miss gets a different funny one, never a frown. [OTH §1-2]
- [ ] **NEW** Rows tick when the step closes, not when a count is reached. The count sits on the thing being counted. [UX §11; K1018 P18]
- [ ] **NEW** It ends the moment the job is done, back where it began, with something served ("aah", then the word card). [CLN-178; DAAR-38; CK-47; S12 A7]
- [ ] **NEW** Use the shared two-page end screen. [UX §9a, §15; SH-104]

## 6. Layout at the four sizes and phones
- [ ] **NEW** Two layouts, switched by height. Check 740x320, 930x430, 1280x665, 1920x1080 and 915x275 (Zafar's Z Fold). [S14 sprint; EVE]
- [ ] **NEW** Nothing goes over a face. Bubbles go into free space, never over the side panel. [SH-145; SH-177; CK-18]
- [ ] **NEW** On phones, items and faces stay big; take the room from the scenery. [SH-90, SH-112, SH-139; EVE P8]
- [ ] **NEW** Keep the left for the cards: two people stand in the middle and on the right. [RULES P7, P16]
- [ ] **NEW** Use one big background with the core in the middle. The cog is the only button on the play screen. [SH-91; CK-53]

## 7. Art and camera (the art bible)
- [ ] One camera per scene, and top-down means exactly overhead: the chai pan failed four times. [CHAI-08, CHAI-34; C1017 P50]
- [ ] **NEW** Draw nothing in code (food, liquids, limbs, tools); code only moves real art. [CK-06; ONB P7; K1018 P42-43]
- [ ] **NEW** Items in the "photorealistic" plaster style, not cartoon. [K1018 P12, P30]
- [ ] **NEW** Cut-outs are clean when zoomed. Nothing floats, and nothing resting on a surface gets a drop shadow. [C929 X14; K1018 P7, P25; C1017 P60]
- [ ] **NEW** Plain scenes, gentle zooms, calm faces, no "crazy" animation. [CARDS P11; CLN-163; S12 A10; K1018 P15]
- [ ] **NEW** Each speaker has two poses: three-quarter, then front-facing on the child's turn. [UX §16]
- [ ] **NEW** Put all new art in one paste block for Zafar's ChatGPT run, with the backgrounds locked first. [ONB P9; K929 G1]

## 8. Speaking
- [ ] **NEW** Speaking happens only inside a two-person exchange the child has watched many times. [SPK]
- [ ] **NEW** A closed set of 3-5, with the pills always there. Speaking is a play action, never a pause or a gate. [SPK; E2P 10]
- [ ] **NEW** The mic shows that it's listening and what it heard. Replies take one tap and each has a speaker. [S12 B4-B5, C7-C8]
- [ ] **NEW** Reuse the one "say it, Ali acts" moment; there are six copies already. No quizzes. [AUD §5; ideas 70]

## 9. Levels
- [ ] **NEW** Follow the rulebook:
  - **L1:** one item, "yes" asks only, one clearly different decoy.
  - **L2:** numbers, "no" said last, the English dotted.
  - **L3:** other ways of saying it.
  - **L4:** amounts and a look-alike.

  [RB §1]
- [ ] **NEW** Levels make the Kutchi harder, never the gestures. [UX §12]
- [ ] **NEW** Level up after 3 rounds with at most one hint each; never level down. [RB; SH-160]
- [ ] **NEW** Rules are coded, not just written: "if it's a rule, it gets lost". [S12 A12]
- [ ] **NEW** Design and play every level: an L4 that was only a faster L3 was "literally unplayable". [C1017 P35, P44; CK-01]

## 10. Words and recording
- [ ] **NEW** Mum's voice is the budget: build from recorded frames and list every line needed. [E2P; AUD §2]
- [ ] **NEW** One natural sentence per person: "the and there is very important". [C929 X1; C1017 P14-15]
- [ ] **NEW** Name things as they are at that moment: *gos* raw, *mishkaki* cooked. [C1017 P16]
- [ ] **NEW** Whatever is said is written, including every count, colour and number of times. [C1017 P18; K1018 P5, P17]
- [ ] **NEW** 3-5 new words a round, each heard at least 3 times. The Kutchi shows until it's picked right three times in a row. [E2P 9; SH-159; SH-110]

## 11. Culture and the family's rules
- [ ] Non-negotiable 9 applies in full.
- [ ] **NEW** No religious celebrations as set pieces; the birthday party is the social day. [LNG-22]
- [ ] **NEW** Treats are fruit (the lolly became an apple). Nothing a child could copy and get hurt by. [KEEP-08; AUD flaws 7-8]

## 12. Fun and delight
- [ ] **NEW** The hands have something to do at every step. The scrape was "incredibly boring ... nothing really to do". [CLN-172]
- [ ] **NEW** Aim for "kind of funny": the wax that keeps coming, the knee's kick, the eye test's re-read, the tongue pops. [KEEP-07, KEEP-10, KEEP-14]
- [ ] **NEW** A gesture that feels good: the knife's cut, the fold swipe, the splinter's path. [KEEP-04, KEEP-16, KEEP-17]
- [ ] **NEW** Contrast is fun: speed in the ride, big and small in maani. [AUD §1d; C1017 P46]
- [ ] **NEW** No fatigue: errands in a row never repeat the main action. [PAN-13]
- [ ] **NEW** Nani's asks give the toy a goal; carry something into the evening book. [OTH lessons 3, 7; KEEP-20]

## 13. Mistakes we've made twice
- [ ] **NEW** An "everywhere" rule fixed in one game only. [S12, S13 look-backs; PAN-16]
- [ ] **NEW** Judging on stills, when motion and transitions show only on film. [S14 look-back; SH-111]
- [ ] **NEW** Playing one level, one round or one size. [C1017 P35; RULES P2; SH-138]
- [ ] **NEW** Design questions left open for the builder. [S13 look-back]
- [ ] **NEW** A builder replacing a mechanic or reusing old art unasked. [C929 X15]
- [ ] **NEW** Help too early; voices overlapping. [SH-60; PAN-04]
- [ ] **NEW** Words hidden under the help ("as I've told you before"). [SH-98]
- [ ] **NEW** English text reaching the child ("hic!", verdict words). [GC R5; CLN-158]

## Ten questions every design must answer before it's done
1. Which heard words decide each move, and how many are recorded?
2. How would the Sceptic win at L2 and above, and why does each way fail?
3. What open need can't the picture settle?
4. What does the first round light up, step by step?
5. Who asks on screen, and in which recorded sentence?
6. What do the hands do at every step?
7. Where is the "kind of funny" moment?
8. How does it end, and what is served?
9. What changes at each level, and is L4 its own?
10. Does it fit all five sizes, with real art in one camera?
