# Sprint 20, draft plan: one kitchen frame, eleven rooms (13 Nov)

A draft for challenge. It wraps up the three architecture reports, the studio-workflow report and Zafar's direction of 13 Nov. Nothing is built or changed by this document. Steps run back to back; work pauses only at the review points marked **Zafar**.

## 1. The goal, and what "done" means

**Goal:** every kitchen game sits in one shared frame, pulled out of chai, so that a layout or round fault is fixed once and cannot come back game by game.

**Done means all of these:**
1. Chai, eggs, maani, corn, samosa, sekelo, daar, baking, chop and chaat get their side panel, bottom row, play area, well done, wrong order and ending from the frame. No game works these out itself.
2. Each game's file holds only its mechanic and its room. Its settings file holds its items, levels and timings.
3. Zafar has approved each game's reference pictures once, and a machine compares every later change with them.
4. The blocking checks are at zero, and stay at zero.
5. Each game's parked rows have been judged in one sitting, and closed or kept.
6. One publish at the end, then Zafar's play and a child's play.

**Not the goal:** new games, new mechanics, new art, other modes.

## 2. The model this plan builds (agreed with Zafar)

- **The shared kit** is a toolkit with fixed standards and a few options: cards, the order card, Nani's box, lights, pills, the shelf and the stone tray, the well-done and wrong-order moments, the end screen, the language engine. It never knows a game's name.
- **The kitchen frame** is the floor plan and the round. It owns the side panel, the bottom row, the play area, where well done, wrong order and the ending appear, and the order of the round. Its stove part (hob, knobs, heat) is for games that cook with heat.
- **Each game furnishes its own room.** Its mechanic code, its stations and their shares of the play area, its settings. Never in screen pixels, never outside its area.
- **Shared spots** (daar's counting card is the example) are kit parts the frame places beside the game's declared main thing. The game chooses left or right. If there is no room, the frame follows an ordered list of fallbacks.
- **Sizes are a chain:** play area, then stations, then contents, with minimums on small phones and the shelf's existing size classes (`js/shared/shelf.js`).
- **The pantry is not a stove game.** It keeps the shared kit only.

## 3. What is parked, and what still gets fixed

**Parked until its game joins the frame:**
- The roughly 150 kitchen "to fix: code" rows about layout or look. Each is marked "waits for the frame".
- The 204 "built, needs a check" rows. No new probes are written for them.
- The kitchen-look decisions that belong to one game (section 9).
- The clinic, the farm day, every prototype mode.
- Any publish. The live site stays as it is until the sprint's end.

**Still fixed straight away, in the orchestrator's chat, with the fast checks:**
- anything that stops a game being played to its end;
- wrong or stitched Kutchi;
- a missing sound;
- anything that upsets a child.

Nothing else. A new fault seen meanwhile becomes a row, grouped by cause, and waits.

## 4. Prep: the minimum, in order

**P1. Settle chai's three frozen faults.**
- Sort each (the silent take-back knob, the extra decoy at L2-L3, the child lab's light) into "a real fault" or "a change Zafar asked for".
- Fix the real ones. Record the asked-for ones as chai's new behaviour.
- Proves: chai's frozen run passes with no change.
- Who: the orchestrator, top model, high effort. Rough cost $15-25.

**P2. Green means zero.**
- The 161 contract checks that had no break last night, plus the fast checks (`checks.mjs`), become the blocking gate.
- The 18 that broke are sorted into three piles: a real known fault (stays red, with an owner, shown but not blocking); a timing check that is noisy under load (waits for the stopped clock in P3); written wrong (rewritten or deleted, with Zafar's yes for a deletion).
- Proves: the blocking gate runs twice in a row on today's code with zero breaks, with nothing else running on the machine.
- Who: one builder, mid-tier model, high effort. Rough cost $20-30.

**P3. The stand-still switch and the picture tool.**
- A test switch that makes a game stand still for a picture: the same order every time (a fixed seed for the roughly 117 places the kitchen and shared code roll dice), and time stopped at a key moment (the kitchen's timers already pass through one file, `js/cook/life.js`; the drawing engine's clock and the page's animations are paused with it).
- First version: the existing play bot plays to the moment, then the game is frozen and the picture taken. It reuses the six or seven key moments the side-by-side tool already reaches (`build/sandbox/lib/keyframes.mjs`). A true "jump straight to this state" comes later, only if playing to the moment proves slow or shaky.
- The picture tool takes the pictures, compares them with the approved ones, and writes one sheet showing only what differs: before, after, the difference marked.
- Proves: chai's pictures taken three times in a row are identical, to the pixel, at all four sizes. If they are not, the switch is not finished.
- Who: one builder, top model, high effort (this is the hardest tool in the plan). Rough cost $50-80.
- The switch is test-only. It never ships in a store build.

**P4. Chai's reference pictures. Zafar, review point 1.**
- About six key moments (the order, the first light, mid-cook, the serve, well done, the end), at the four sizes, at level 1 and level 4: about 48 pictures, on four contact sheets.
- Known small faults in chai that are parked (the card light at L4 on a phone, the elchi jar's light) are listed on the sheet, so he approves chai knowing them.
- He says yes, or names what is wrong. His yes makes them the reference.
- Before the sheets, at most four pictures in chat for a quick "fine / that's wrong".

**P5. Park the rows.** A script marks the rows in section 3 "waits for the frame" and groups them by game. Mid-tier model, about $5-10.

**P6. The machine rule.** Never more than two builders on this machine. Timing checks never run while a second browser job runs.

## 5. The steps

Each step says what it proves before the next may start, who does it, and what Zafar sees. Costs are rough, from Sprint 19's sessions ($35-55 for a builder).

**Step 1. Chai's frame sums move, unchanged.**
- The roughly 45 lines where chai works out its play area (`js/cook/stations/chai-tray.js:418-462`: the margins, the gap above the bottom row, the centring, the room for count pills) move as they are into one shared function in the kitchen frame. Chai calls it. Nothing is rewritten or tidied.
- Proves: chai's 48 pictures identical; chai's frozen run unchanged; the blocking gate at zero.
- Who: the frame's one owner (a builder, top model, high effort). Rough cost $25-40.
- Zafar sees: nothing. A machine says "identical", or the change does not go in.

**Step 2. Eggs uses it. Zafar, review point 2.**
- Eggs drops its own layout sums (`js/cook/stations/eggs.js:101`) and calls the shared function. Its mechanic (cracking, frying, boiling, plating) is not touched.
- Eggs' own look calls are decided here, with pictures: the headline on a phone, the plate size, the table praise (section 9).
- Proves: chai's pictures still identical; eggs plays to its end at four sizes and L1-L4; the geometry rules (section 6) hold in eggs.
- Who: the same owner. Rough cost $35-55.
- Zafar sees: four pictures in chat first (eggs beside chai, phone and laptop). Then eggs to play, beside chai. Then eggs' contact sheets to approve as its reference.
- **If eggs looks wrong in chai's frame,** the frame gets a named option, chai's pictures prove chai did not move, and step 2 is repeated. This is the cheap place to find out.

**Step 3. The round moves into the frame.**
- The parts of the round chai and eggs each run by hand move into the frame: the first-time gate, the stuck-help wiring, the serve round, well done, wrong order and the redo, the closing scene, the level-up count. The game answers three questions: "what is the next right move?", "is this dish right?", "reset this dish".
- Two frame decisions land here: where "Shabash!" sits (chai's look), and a mistake at L1-L2 redoing only the wrong step (section 9).
- Proves: chai's pictures identical except any change Zafar has just decided, which he re-approves; chai's frozen behaviour unchanged except the same; eggs' pictures unchanged.
- Who: the same owner. Rough cost $45-70.
- Zafar sees: only the differences sheet, if there are any.

**Step 4. The guard rails go on, as counts that may only go down.**
- A game on the frame may not measure the screen or the drawing sheet.
- A shared or frame file may not name a game (today: `flow.js` 33 lines, `serve.js` 17, `ui.js` 16, `station-lib.js` 8).
- No function may be pasted into two files.
- Each game file has a size limit that only goes down.
- Proves: the counts for chai and eggs are at their targets; the other games' counts are recorded as their starting point.
- Who: mid-tier model. Rough cost $15-25.

**Step 5. Maani: no heat, two stations.**
- Proves the stove part is optional, and builds the size chain: board and tawa side by side as shares of the play area, the frame setting the gap and the largest fit, the pin and dough as shares of their station.
- Maani's own calls are decided with pictures: the plates on the worktop, the roll demo.
- Proves: every earlier game's pictures identical; maani plays through; geometry rules hold.
- Who: the frame owner. Rough cost $40-60.
- **Zafar, review point 3:** four pictures in chat, maani beside chai to play, its sheets to approve.

**Step 6. Corn: two screens.**
- Proves the frame handles a game with two play screens in one round (samosa and sekelo need the same).
- Corn's calls: six bowls on a phone, the cob's size from tray to plate.
- Proof, owner and cost as step 5.
- **Zafar, review point 4,** as step 5. After this the frame is treated as locked: a change to it is its own piece of work, re-checked against every joined game's pictures.

**Step 7. The shared spot, with daar.**
- The counting card becomes a frame spot: beside the main thing, the game choosing the side; the ordered fallbacks written down and tested (shrink, other side, under the main thing, and the marks giving way).
- This is the first rule card: one sentence, a picture in words, the kit's numbers, the fallback list, one test. More cards are written only when a game strains a rule.
- Daar joins the frame in the same step.
- **Zafar, review point 5.**

**Step 8. The remaining games, one at a time each: samosa, sekelo, baking, chop and chaat.**
- Now two builders may run, one game each, each owning only its game's files. Neither touches the frame or the shared kit; a need for a frame change is reported, and the frame owner makes it.
- Each game: joins the frame; its look calls decided with pictures; its parked rows judged together in one sitting; its reference pictures approved by Zafar.
- Rough cost $35-55 a game.
- **Zafar, a review point per game:** four pictures, a play beside chai, the sheets.

**Step 9. Clean up.**
- The shared files stop naming games; each by-name line becomes an option or goes.
- The September "zones" system is retired (`js/cook/zone.js`), with Zafar's yes.
- The old path of every joined game is deleted.
- Proves: every game's pictures identical; the counts from step 4 at zero.
- Who: the frame owner. Rough cost $40-60.

**Step 10. The pantry.**
- No frame. Its rows about shared pieces are judged; the shared files stop naming it.
- Rough cost $20-30.

**Step 11. Close.**
- The full check once, the publish with Zafar's yes, his play, a child's play, the look back.

**Rough total:** $450-700, to be set as the sprint's ceiling with Zafar.

## 6. The check system after the change

**Blocks a merge (green means zero):**
1. The fast checks before every push (`checks.mjs`, about 2.5 minutes).
2. The clean contract checks (161 today), plus each of the 18 as it is repaired.
3. The picture gate: every joined game's approved pictures, compared by machine.
4. About ten geometry rules, on every key moment and size: nothing overlaps; everything is on screen; no text is cut; a light sits on its target; nothing tappable is under 48 px; the frame's slots are in the same place in every game.
5. The play bot: every game to its end, at four sizes, with a wrong-pick run, no page errors.
6. Chai's frozen run, for behaviour, sound and timing.

**Advisory (shown, never blocking):**
- The AI judge beside chai. It is a helper for spotting gross faults, not a gate.
- The noisy timing checks, until they run on the stopped clock.
- Known real faults with an owner.

**Deleted or retired (code kept, out of the run), with Zafar's yes:**
- One probe and one judged picture per row.
- "Fewer breaks than yesterday" as a pass, and the "known failures" lists for the blocking gate.
- Any check the 8 Nov audit shows never caught a real fault.
- The middle tier that plans 264 minutes; the six blocking items above replace it.

**"Fixed" means:** a test that failed before and passes after. For a look fault, the before and after pictures. A builder saying "done" closes nothing.

**Who approves what:** machines approve "nothing moved that should not have". Zafar approves the look, once per game, and afterwards sees only differences.

## 7. Rules for builders

1. One builder on the frame until eggs passes; one frame owner throughout.
2. Never more than two builders on this machine.
3. A builder owns only the files its brief names. A game's builder never edits the frame, the shared kit or another game.
4. A builder never touches a check, a probe, a reference picture or a row's status. It may propose; the orchestrator and Zafar decide.
5. Move, do not rewrite. Tidying is a separate, later change.
6. A builder that cannot make the gate green stops and reports. It does not widen its brief or patch a shared file.
7. Every launch states model, effort and cost. Every hand-back is one short report with a Proof section.
8. At each step, before the long checks: at most four pictures to Zafar in chat. They never replace the checks.
9. Cloud sessions (each on its own machine, pushing only to its own branch) are an option for step 8 only, if Zafar wants speed.

## 8. Risks, and how each is caught

1. **The stand-still switch is harder than it looks** (dice in 117 places, three clocks). Caught by P3's own proof: three identical runs. If it cannot be made exact, the fallback is a small tolerance plus the geometry rules, and Zafar is told before step 1.
2. **Chai moves while its code moves.** Caught by the picture gate and the frozen run at every step.
3. **Eggs does not fit chai's frame.** Caught at step 2, with two games at stake instead of ten.
4. **The frame grows by-name exceptions.** Caught by the count that may only go down.
5. **A game's builder quietly lays out the frame's parts itself.** Caught by the "may not measure the screen" check and the same-slot geometry rule.
6. **Reference pictures go stale and get ignored,** as the old screenshot check did (its approved set was never renewed after Sprint 8). Caught by rule: a difference blocks; only Zafar's yes renews a picture.
7. **Zafar's review points become the bottleneck.** Each is kept to four pictures, one play and four sheets. Work on the next game's mechanic-free prep may continue; nothing merges past an open review.
8. **New art arrives mid-move.** Art for a game is wired only before it joins or after its pictures are approved, and always re-approves its pictures.
9. **The parked list hides something that upsets a child.** The four "fix now" classes in section 3 stay open throughout.
10. **Cost overrun.** Each step has a ceiling; scope is cut (fewer games this sprint) before the budget.
11. **The machine is overloaded and checks lie.** Rule P6; timing checks run alone.

## 9. Where Zafar's open decisions go

- **Now, as data changes (wrong Kutchi is a "fix now" class):** Mum's words and spellings, items 16-22 of `build/reports/s19-decisions-2026-11-13.md`.
- **At step 3, the frame's round:** where "Shabash!" sits (6); a mistake at L1-L2 redoing only the wrong step (15); when the wrong-order pop-up shows (28); a tap during the blurred-card lesson (3).
- **When eggs joins:** its headline on a phone (5), the egg and plate size (8), the table praise (9).
- **When maani joins:** the plates (11), the roll demo (26).
- **When corn joins:** six bowls on a phone (10), the cob (23).
- **When samosa joins:** the dish flash (2), the fold's arrow (27).
- **When chop and chaat join:** Nani's face (4), who receives the chopping (7).
- **When daar joins:** the chopped heap's size (25).
- **Chai's reference, at P4:** the L4 phone lights (12, 24), approved as known or fixed first.
- **After the frame, in the shared kit:** the speaker's first-time light (14).
- **Parked:** the farm day (13); everything not kitchen.

## 10. Decisions Zafar must answer before starting

1. **Open Sprint 20 with this goal, and close Sprint 19 without a publish?** Recommend yes.
2. **The four "fix now" classes in section 3, and everything else parked?** Recommend yes.
3. **Reference pictures kept in the project** (about 48 a game, small files)? The old rule kept only fingerprints, never pictures; showing him "before" needs the picture. Recommend yes, changing that rule.
4. **Which levels he approves:** level 1 and level 4 at the four sizes; the machine also compares levels 2 and 3. Recommend yes.
5. **Chai's known phone-light faults:** approve chai with them listed, and fix them after the frame? Recommend yes; fixing first means more row work before the plan starts.
6. **Green means zero,** with the 18 broken checks sorted and non-blocking until repaired? Recommend yes.
7. **The AI judge becomes advisory;** the picture gate and his eye decide the look? Recommend yes.
8. **Retire one-probe-per-row and the 264-minute tier?** Recommend yes.
9. **One frame owner; two builders at most; game builders only after corn passes?** Recommend yes.
10. **The order of games:** chai, eggs, maani, corn, daar, samosa, sekelo, baking, chop and chaat, then the pantry's clean-up. Recommend yes.
11. **Mum's words (16-22) go in now?** Recommend yes; one question stays for Mum (tameto or tomato).
12. **The budget ceiling,** about $700. Recommend yes, cutting games before overspending.
13. **Cloud sessions for step 8?** Recommend deciding at corn's review, not now.

## Proof

- Built on: `build/reports/s19-architecture-review.md`, `s19-architecture-how.md`, `s19-architecture-doubts.md` (their measurements and file:line evidence), `build/reports/s19-studio-workflow.md` (the picture gate, geometry rules, play bot, "fixed" as red-then-green), `build/reports/s19-decisions-2026-11-13.md` (items 2-28), `CLAUDE.md`, `.claude/skills/sprint/SKILL.md`, `docs/process/session-brief-template.md`.
- Checked for this plan: the kitchen's timers pass through `js/cook/life.js` (42 kitchen files import it); 117 uses of random numbers in `js/cook` and `js/shared`; `js/shared` has about 103 timer uses outside that file, so the stopped clock is not free; the side-by-side tool already reaches seven key moments (`build/sandbox/lib/keyframes.mjs`); the old screenshot check kept fingerprints only and was last approved in Sprint 8 (`build/tools/review/approved-shots.json`, `shotdiff.mjs` header); last night's gate listed 179 contract checks, 18 with breaks (`build/screenshots/sandbox/s19-r2-gate/contract.md`).
- Estimates, not measurements: every cost; the 48 pictures a game; the split of the 18 broken checks into three piles (the coordinator's sorting, not re-checked here).
- Not done: nothing was run; no tool in P3 exists yet; whether pixel-exact pictures are achievable in this engine is unproven until P3.
