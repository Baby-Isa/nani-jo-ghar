# Sprint 19: how to make the kitchen template work this time (13 Nov)

A follow-up to `build/reports/s19-architecture-review.md`. Read from the code and the sprint files. Nothing was changed.

## 1. Why the last attempt failed, and what is different

**Why it failed (process, not code):**
- **The plan had no frame in it.** Sprint 18's map lists 24 pieces of chai to move (`docs/architecture/module-map.md`). None of them is "the layout" or "the round". So the parts moved and the frame stayed inside each game.
- **Everything moved at once.** Wave 1 was eight builders on the kits; wave 2 was eight builders, one per game, hours later (`docs/sprints/S18-kitchen-family.md:43-56`). No second game proved the kit before all ten were put on it.
- **The proof could not see the look.** Chai's frozen run compares what happened (steps, notes, sounds, timings, contract breaks). It does not compare where things are (`build/tools/review/frozen.mjs:1-14, 34-38`). The checks passed; the eye judge then failed all ten games (`docs/sprints/S19-chai-standard-everywhere.md:59`).
- **The reference kept moving.** New art, new decisions and row fixes landed in the same days, and chai's reference was re-frozen on 10 Nov. Nobody could say "the same as before".
- **Zafar never saw the frame.** He saw finished games, so each problem reached him as a game's row, not as one frame fault.
- **Rules were prose in rows.** Each builder read them their own way.

**What is different this time:**
- **One owner of the template.** One builder at a time on the template and chai. No one else edits those files.
- **One step at a time, each proven before the next:** chai green; chai measured; template pulled out of chai; Zafar plays the empty template; eggs; maani; corn; then the rest.
- **Proof includes position.** A new "measure sheet" (section 3) says where every thing is, to the pixel.
- **Zafar approves three things, once each:** the empty-template lab page; chai on the template, laid over chai before; each game as it joins, beside chai.
- **No kitchen art or row fixes land in a game while it is moving.**
- **Parallel builders only after two games pass**, one per game, never in template files.
- **Drift is stopped by checks**, not by reading rules (section 2).

## 2. Writing the layout rules so they cannot be misread

Each rule is one short **rule card**, and each card has **one automatic test with the same name**. A rule without a test is not a rule yet.

A rule card has six parts:
1. **Name and one sentence.**
2. **Picture in words** (and a drawn example on the lab page).
3. **Numbers,** each a named kit value, never a fresh number.
4. **What gives first** when there is no room, as an ordered list.
5. **Edge cases,** stated one by one.
6. **The test:** what is measured on the real screen, and how close it must be.

**Worked example: "the card beside the main thing".**
- *Sentence:* a count card stands beside the game's main thing, on the side the game chose.
- *Picture:* the card's top edge level with the top of the main thing's box; one kit gap between them.
- *Numbers:* gap = the kit's padding; least card width = the kit's smallest card.
- *What gives first:* (1) shrink the card down to its least width; (2) try the other side; (3) go under the main thing; (4) if marks already sit there, the marks move onto the main thing's lower edge.
- *Edge cases:* never over a face, the side panel, the bottom row or the cog; a round pot is treated as its square box; with two main things, the card belongs to the one in hand.
- *Test:* at the four sizes, measure the card and the main thing. The gap is the kit gap within 1 px; no overlap with the listed things; the card is inside the play area; its text is not below the least size.

**How the tests cover the delicate cases.** Every rule's test runs on a grid, not one screen:
- the four sizes (740x320, 930x430, 1280x665, 1920x1080);
- one to four people;
- levels 1 to 4;
- the longest Kutchi word.

The project can already measure things on the screen (`build/sandbox/lib/evidence-probe.mjs:46-58` reads any drawn thing's box). Three tests apply to every rule and catch most headaches: **nothing overlaps, nothing leaves its area, nothing tappable is under 48 px.**

**One home for the numbers.** The gaps, margins and least sizes live in one settings file that the template reads. The rule cards quote it. A check fails if a card and the file disagree.

**Zafar's part:** the lab page shows each rule with sliders (size, people, word length). He looks, and says yes or names what is wrong. He never reads the numbers.

## 3. Working backwards from chai

Yes: chai's approved look is the best asset here, and the rules should be read off it, not invented.

1. **Name the approved chai.** Recommend the live site (published 10 Nov), which Zafar has played. Fix the three known faults first, then freeze.
2. **Make chai's measure sheet.** Play chai at the four sizes, one to four people, levels 1 to 4. At each key moment record the box of every thing: play area, hob, each pan, knob, face, tray, glasses, each shelf item and pill, count pills, cards, Nani's box. Chai already reports several of these for tests (`chai-tray.js:543-553, 610, 632`).
3. **Read the rules out of chai's own sums.** They are hand-written but they are rules, most with Zafar's words beside them (`chai-tray.js:418-462`): the side margins (56), the gap above the bottom row (28), the play group centred between the top of the view and the bottom row, room kept for count pills above the hob. Each becomes a rule card.
4. **Sort each number into its layer.** The margins, the gap and the centring are the template's. The handle's reach and the tray at 0.78 of the hob's height are chai's own room.
5. **The template must reproduce the measure sheet.** Chai on the template is measured again; every box must match within 1 px at every size. This is the proof that the rules were put in correctly. Zafar also sees before and after laid over each other.
6. **Then the sheet becomes a permanent check.** Any later change that moves a chai box fails.

**Other approved references to use the same way:**
- The card lab and its numbered choices (27 Oct, `lab/cards.html`): the cards' rules.
- The shelf with size classes (6 Nov; `js/shared/shelf.js:145-161`): the bottom row's rules and real-world sizes.
- The bottom-row decision, shelf or stone tray (10 Nov, `docs/game-design/modes/cook-bottom-row.md`).
- The knob rule, below or left (9 Nov, `js/cook/kitchen-kit.js:14-18`).
- The well-done and wrong-order moments (11 Nov).
- His answers on the kitchen mock-ups (9 Nov, `docs/feedback/kitchen-mocks-2026-11-09.md`): the brief for each game's own room.
- No game other than chai is signed off, so none is a reference yet.

## 4. Corrections to the coordinator's explanations

- **The pantry off the template: agreed.** It keeps the shared pieces only. It still obeys the shared checks, and the shared files should stop naming it. The order is now: chai, eggs, maani, corn, samosa, sekelo, daar, baking, chop and chaat.
- **"Furnishes its own room": agreed, and I withdraw my stricter wording.** Three cautions:
  - "Freely" is how drift came back. A game places things only through the template's helper, in shares of its own box.
  - Shares alone fail on a small phone. A share of a 320-high screen can fall under a finger's size. The template must enforce the floors (48 px taps, least text size).
  - Kit things (cards, pills, faces, count pills) are never hand-placed, even inside the room. They go in template spots.
- **"Never in screen pixels" needs a second half.** Chai's numbers are not screen pixels; they are measured from the edges of the game's 1600 by 900 drawing sheet. The rule is: no numbers measured from the screen or from the drawing sheet, only from the game's own box.
- **"Its frozen run must show no visible change" is wrong as said.** The frozen run does not check the look, and its quick mode plays two sizes, not four. "No visible change" needs the measure sheet and the laid-over pictures as well.
- **The card's fallback collides.** Daar's marks already sit under the hob (`js/cook/mechanics/stir.js:536-543`). "Under the main thing" for the card would land on them. The rule needs the ordered list in section 2.
- **"Top-aligned" needs "to the main thing's box".** A pot is round.
- **"Equal stations" should be the starting point, not the rule.** A game may give shares (board 55, tawa 45). The template still sets the gap and the largest fit.
- **Size classes: use the shelf's existing ones.** Do not start a second system.
- **The three frozen faults:** first decide which are faults and which are changes Zafar asked for (the extra decoy at levels 2-3 may be either). Then fix, then freeze.

## 5. Decisions for Zafar

1. **Which chai is the approved one?** Recommend the live site, after the three faults are settled.
2. **Add the measure sheet as a proof beside the frozen run?** Recommend yes. It is the main thing that was missing.
3. **One builder on the template and chai until eggs passes?** Recommend yes.
4. **No art or row fixes in a game while it moves?** Recommend yes.
5. **Rule cards with a test each, kept short, in the standard folder?** Recommend yes; about twelve cards cover the frame.
6. **You approve the frame on a lab page with sliders, before any game other than chai moves?** Recommend yes.
7. **Tolerance:** chai on the template within 1 px of chai today. Recommend yes; anything looser hides mistakes.
8. **The pantry stays off the template.** Recommend yes.

## Proof

- Read: `build/tools/review/frozen.mjs` (what it compares, its sizes); `build/frozen/chai-tray/frozen.json` (30 pages; states, notes, sounds; no positions); `build/sandbox/lib/evidence-probe.mjs:46-58`; `js/cook/stations/chai-tray.js:418-462, 543-553, 610, 632`; `js/cook/mechanics/stir.js:528-543`; `js/shared/shelf.js:145-161`; `docs/architecture/module-map.md`; `docs/sprints/S18-kitchen-family.md:41-56, 116`; `docs/sprints/S19-chai-standard-everywhere.md:59`; `build/reports/frozen-diff-chai-tray-202611131035.md` (382 changes on 30 pages; frozen 10 Nov).
- Not done: no browser runs; the measure sheet is a proposal, not built; the 9 Nov mock-up answers were not re-read line by line.
