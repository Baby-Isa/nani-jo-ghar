# Sprint 20, the plan: one kitchen frame, proven on four games (13 Nov)

The final plan, after a pre-mortem by a fresh reviewer (`s20-plan-premortem.md`) and the orchestrator's challenges (`s20-plan-challenges.md`). It replaces `s20-plan-draft.md`. Nothing is built or changed by this document. Steps run back to back; work pauses only at the review points marked **Zafar**.

## In short

- **The sprint is smaller than the draft.** It ends at four games on one frame: chai, eggs, maani, corn. Then it publishes. The other six games are Sprint 21, started only if this one passes.
- **The exit test is one you can watch:** change one frame number (the gap above the bottom row), all four games move by it, and no game's file was edited. That test is the goal itself.
- **The frame this sprint is the floor plan:** the play area, the bottom row and the worktop. The round's logic (first-time gate, stuck help, redo, level-up) moves in Sprint 21, after four different games have shown what it must allow.
- **Step 1 is tiny:** only chai's true play-area lines move, unchanged. Chai's stove, pans and tray stay in chai as its room.
- **The machine compares exact box positions, not pixels.** Pictures are for your eyes. No "nearly the same" tolerance: a nearly-right check is what failed last week.
- **Chai is settled first:** its frozen run at zero changes, or re-frozen with your yes, before anything moves.
- **You approve 12 pictures a game, once,** and your first real approval is eggs beside chai. At most four pictures in chat per step before that.
- **Green means zero, enforced by the merge script,** not by anyone's judgement. Every check must first prove it can fail.
- **No row-by-row fixing.** Kitchen layout rows wait for the frame. Only four kinds of fault are fixed meanwhile: blocks play, wrong Kutchi, missing sound, upsets a child.
- **Rough cost:** $300-450. One frame builder at a time; never more than two builders on this machine.

## 1. The goal, and what "done" means

**Goal:** prove the kitchen frame on four different games, so a layout fault is fixed once, in one place.

**Done means all of these:**
1. Chai, eggs, maani and corn get their play area, bottom row and worktop from the frame. None of the four reads the screen or the drawing sheet itself (the count is 0 in each file).
2. The exit test passes, with Zafar watching: one frame number changed, all four games move, no game file edited.
3. Zafar has approved 12 reference pictures for each of the four, once.
4. The blocking gate is at zero and runs inside its time ceiling.
5. Each of the four games' parked rows has had its yes/no pass.
6. One publish, Zafar's play, a child's play, the look back.

**Not this sprint:** the round's logic; samosa, sekelo, daar, baking, chop and chaat; the pantry; retiring the zones system; splitting `js/cook/ui.js`; new art, games or modes.

## 2. The model (agreed with Zafar)

- **The shared kit:** a toolkit with fixed standards and a few options (cards, the order card, Nani's box, lights, pills, shelf or stone tray, well done, wrong order, the end screen, the language engine). It never knows a game's name.
- **The kitchen frame:** the floor plan (side panel, bottom row, play area, where well done, wrong order and the ending appear) and, from Sprint 21, the round. A stove part for games with heat.
- **Each game furnishes its own room:** its mechanic, its stations as shares of the play area, its settings. Never from the screen's edges, never outside its area.
- **Shared spots** (daar's counting card) are kit parts the frame places beside the game's declared main thing; the game picks left or right; an ordered fallback list covers "no room". First built in Sprint 21, with daar.
- **Sizes are a chain:** play area, stations, contents, with small-phone minimums and the shelf's size classes.
- **The pantry stays off the frame.**

## 3. What is parked, and what still gets fixed

**Parked:**
- Kitchen "to fix: code" rows about layout or look (about 150), marked "waits for the frame".
- The 204 "built, needs a check" rows. No new probes.
- Chai's own rows. Chai does not change this sprint except for the four classes below.
- Other modes and prototypes.

**Fixed straight away, in the orchestrator's chat, through the same gate:**
- anything that stops a game reaching its end;
- wrong or stitched Kutchi;
- a missing sound;
- anything that upsets a child.

A new fault becomes one row, grouped by cause, and waits.

## 4. Prep: the minimum, in order

**P0. The starting numbers.** (Orchestrator's chat; about $5.)
- Two plain searches, run now and printed at every step: how many times each game file reads the screen or the drawing sheet (today eggs 8, chai 19), and how many lines in shared files name a game (today `flow.js` 33, `serve.js` 17, `ui.js` 16, `station-lib.js` 8).
- The sprint file (`docs/sprints/S20-…md`) is opened with a table: each step, its status, its proof, the next command.
- The frame's notes are started: `docs/architecture/kitchen-frame.md`. This document is "the owner": what the frame owns, its options, its rules, every decision. Every frame session reads it first and updates it last. A brief that disagrees with it is wrong.

**P1. Zafar's decisions that touch chai, and Mum's words.** (**Zafar, review point 1**: answers only.)
- The four round decisions are answered now, so chai is approved once: where "Shabash!" sits; a mistake at L1-L2 redoing only the wrong step; when the wrong-order pop-up shows; a tap during the blurred-card lesson.
- Mum's words and spellings (items 16-22 of his decisions list) go in as data now, before chai is frozen.

**P2. Chai settled.** (Orchestrator, top model, high effort; ceiling $30; one session.)
- Today's frozen run shows 382 changes. By kind: 162 new game notes, 156 new sounds, 32 notes gone, 14 new contract breaks, 8 sounds gone, 6 new states, 4 page errors. Many are likely one cause each (new recordings, new notes).
- Ends only one of two ways: the frozen run shows 0 changes; or chai is re-frozen with Zafar's yes and one written line per kind of change. Page errors and real faults are fixed first.
- If it does not end inside one session, stop and bring Zafar the list.

**P3. The gate that blocks, and the script that enforces it.** (One builder, mid-tier model, high effort; ceiling $25.)
- Blocking set: the fast checks plus the 161 contract checks that had no break last night.
- The 18 that broke are set aside as a list, shown but not blocking. They are not sorted now. One is repaired only when a step needs it. Only Zafar's written yes moves a check between the lists.
- A merge script refuses any merge whose blocking gate is not at zero, and prints the gate's minutes.
- Proves: two runs in a row at zero on today's code, alone on the machine; and the merge script refuses a deliberately broken branch.

**P4. Stand still, read the boxes, take the pictures.** (One builder, top model, high effort; ceiling $80; **one session, no extension**.)
- A test-only switch: the same order every time (a fixed seed), and the play bot stops at six named moments (the order, the first light, mid-cook, the serve, well done, the end). "Mid-cook" becomes a named state, not "halfway".
- At each moment the tool reads exact boxes from the game: play area, side panel, bottom row, the main things (hob, tray, board, grill), the first and last item, the cards. Compared as numbers, exact.
- Pixel comparison only for screens that truly stand still (the order, the end).
- Pictures at each moment are kept for Zafar's sheets and for a differences sheet (before, after, what moved).
- Proves: chai's boxes identical three runs in a row at the four sizes; and four planted faults are each caught (a box moved 4 px, a card over a face, a cut word, a light off its target).
- If boxes cannot be made repeatable in one session, stop: the plan does not start, and Zafar is told why.

**P5. The geometry rules.** (One builder, mid-tier model, high effort; ceiling $45.)
- About ten rules on every moment and size, built from what exists where it fits (`panelcheck.mjs`, `pillcheck.mjs`): nothing overlaps; everything on screen; no cut text; a light on its target; nothing tappable under 48 px; the frame's slots in the same place in every game.
- Proves, before step 3 may start: the rules fail today on faults still open in the fix list (SH-277, eggs' headline set three ways and wrapping to three lines at 740x320; CK-112, maani's label touching the board's top edge at 740x320), and catch the planted faults of P4. They pass on chai.
- The planted-fault proof is re-run whenever a gate's code changes.

**P6. Chai's reference. Zafar, review point 2.**
- 12 pictures: six moments at 740x320 and 1280x665; mid-cook and the serve at level 4 (the fullest screen), the rest at level 1. The machine holds the boxes for levels 1 and 4 at all four sizes.
- Chai's parked phone-light faults are listed on the sheet.
- His yes makes them the reference. Tag the branch.

**P7. Park the rows** (a script; about $5), and the machine rule: never more than two builders; timing checks run alone.

## 5. The steps

Every step: one move; the old code deleted in the same step; the gate green by the merge script; the branch tagged on a pass, so a bad later step can be undone to the last tag. Every brief is short: the goal, the files owned, one acceptance command that prints pass or fail, a cost ceiling, and the stop rule ("not green inside the ceiling: stop and report"). No rows pasted into a frame brief.

**Step 1. Chai's play-area lines move, unchanged.**
- Only the true play area: the top of the view, the gap above the bottom row, the room for count pills, the margins (`js/cook/stations/chai-tray.js:443-449`). They move as they are into one frame function that returns two boxes: the play area and the bottom row. The frame also draws the worktop wash and the bottom band, which each game calls by hand today.
- Chai's hob, pan and tray sums stay in chai. They are its room.
- Proves: chai's boxes identical; frozen run unchanged; gate at zero.
- Who: the frame builder (top model, high effort). Ceiling $35.
- Zafar sees: nothing.

**Step 2. Chai's room reads only its box.**
- Chai's remaining sums are re-based: every "1600", every view edge, becomes "my play area". This is the first real rewrite, so it is its own step.
- Proves: chai's count of screen reads is 0; boxes identical; frozen run unchanged.
- Ceiling $45.
- Zafar sees: nothing, or the differences sheet if a box moved.

**Step 3. Eggs joins. Zafar, review point 3.**
- Before the build: eggs' parked rows become a short yes/no list for Zafar, and eggs' own calls are answered with pictures (headline on a phone, egg and plate size, table praise).
- Eggs calls the frame function. Its layout reads only its box. **The step passes only when eggs' own screen sums are gone** (its count goes from 8 to 0). An added frame option is allowed only if the frame's notes say why and chai's boxes prove chai did not move.
- Proves: eggs' count is 0; geometry rules pass in eggs (SH-277 now passes or is a recorded decision); play bot to the end at four sizes; chai identical.
- Then the eye judge, once, beside chai, asked gross questions ("is anything clearly broken, missing, or unlike chai's frame?"). A named fault is fixed, or goes to Zafar as a call. One round, no loop.
- Then Zafar: four pictures in chat (eggs beside chai, phone and laptop); a play beside chai; eggs' 12 pictures to approve.
- A fault he finds that a machine could have measured becomes a geometry rule in the same step.
- Ceiling $55. New chat after the review (`/handover`).

**Step 4. Maani joins: no heat, two stations. Zafar, review point 4.**
- Proves the stove part is optional, and builds the size chain: board and tawa as shares of the play area (equal to start; a game may give its own shares), the frame setting the gap and largest fit.
- Maani's calls first: the plates on the worktop, the roll demo. Its yes/no list first.
- Proof, judge and Zafar's review as step 3; CK-112 must pass.
- Ceiling $55.

**Step 5. Corn joins: two screens. Zafar, review point 5.**
- Proves the frame gives a play area to each of a game's screens.
- Corn's calls first: six bowls on a phone, the cob's size.
- Proof, judge and review as step 3.
- Ceiling $55.

**Step 6. The guard rails, at zero for four games.**
- The two searches from P0 become blocking for the four games: no screen reads in their files; no new game name in a shared or frame file (the count may only go down).
- Ceiling $15.

**Step 7. The exit test. Zafar, review point 6.**
- On a throwaway branch, one frame number is changed (the gap above the bottom row). The tool shows every game's boxes moved by it, and the list of files changed: one.
- He watches it, or sees the sheet: "this moved in 4 games, here is how".
- **Pass:** the sprint closes. **Fail:** it does not publish as "the frame"; the reason is written up before any more games move.

**Step 8. Close.** The full gate, `/review`, the publish with Zafar's yes, his play, a child's play, the look back.

**Rough total:** $300-450. Proposed ceiling $450; games are cut before the ceiling moves.

## 6. Sprint 21, in outline (opened only on a pass)

1. The round's logic into the frame, designed from four games: first-time gate, stuck help, serve, redo, level-up count, and the "Shabash!" spot. Chai's reference is re-approved once, for the round decisions answered in P1.
2. Daar with the shared "card beside the main thing" spot, and the first rule card.
3. Samosa, sekelo, baking, chop and chaat, one at a time; two builders allowed, one game each, never in frame files.
4. Shared files stop naming games; the pantry's clean-up; the zones system retired as its own piece of work.

## 7. The check system

**Blocks a merge (the merge script refuses red):**
1. The fast checks.
2. The clean contract checks (161 today), plus any of the 18 once repaired.
3. The box gate: every joined game's exact boxes at six moments, levels 1 and 4, four sizes; pixels for the order and the end.
4. The geometry rules.
5. The play bot: each joined game to its end at four sizes, with a wrong-pick run.
6. Chai's frozen run (behaviour, sound, timing).
7. Once per game, at its join: the eye judge beside chai.

**Time ceilings.** The gate prints its minutes. A game change (that game plus chai): 20 minutes. A frame change (every joined game): 60. Over a ceiling, the next step does not start until the gate is cut back; pictures and levels are cut before the ceiling moves.

**Advisory:** the 18 set-aside checks; the eye judge anywhere but the join; known faults with an owner.

**Retired (code kept), with Zafar's yes:** one probe and one judged picture per row; "fewer breaks than yesterday" as a pass; the 264-minute middle tier; comparing levels 2 and 3 by machine.

**"Fixed" means** a test that failed before and passes after. A builder's "done" closes nothing.

**A frame change after corn** is its own piece of work; its differences sheet is grouped by change, not by game.

**The side panel file (`js/cook/ui.js`)** is not split this sprint. A step that touches it names the games it can reach and runs their gates.

## 8. Rules for builders and for the orchestrator

1. One frame builder at a time. "The owner" is the frame's notes, not a session's memory.
2. Never more than two builders on this machine.
3. A builder owns only the files its brief names.
4. A builder never touches a check, a probe, a reference, a row's status or the lists of blocking and advisory checks.
5. Move, do not rewrite; a rewrite is its own step (step 2).
6. One step, one move; the old code goes in the same step. Never two live paths.
7. Not green inside the ceiling: stop and report. Never widen the brief or patch a shared file.
8. The orchestrator may not call a red gate "noise". The merge script decides.
9. Every launch states model, effort and cost.
10. The sprint file holds each step's status, proof and next command. A new chat starts at each review point, never mid-step.
11. At most four pictures to Zafar in chat per step, before the long checks. They never replace the checks.
12. The AI judge is asked gross questions only. It never passes or fails a row.

## 9. Risks, and how each is caught

1. **Games join in name only.** Caught by the count of screen reads reaching 0 in the step itself, and by the exit test.
2. **The stand-still tool eats the sprint.** One session, a hard ceiling, and a stop before step 1.
3. **The gate goes noisy.** Exact numbers, no tolerance; planted faults prove it can fail; timing checks stay advisory.
4. **The gate goes slow and is skipped.** Printed minutes, ceilings, and the merge script.
5. **Chai keeps moving.** P1 and P2 before anything; no chai rows this sprint; one planned re-approval, in Sprint 21.
6. **A joined game looks wrong though nothing "moved".** Geometry rules built and proven in prep; the eye judge at the join; Zafar's play.
7. **Zafar becomes the queue.** 12 pictures a game, six review points, answers gathered before a build starts.
8. **Eggs does not fit.** Found at step 3, with two games at stake.
9. **The orchestrator forgets across a long chat.** The sprint file and the frame's notes hold the state.
10. **A check quietly passes everything.** The planted-fault proof, re-run when a gate's code changes.
11. **Cost.** A ceiling per step; games cut before the total moves.

## 10. Where the overlaps were settled

- **Scope:** end at corn and publish, with the exit test (the pre-mortem). **Round logic: next sprint,** all of it, after corn.
- **Picture fallback:** exact box numbers, and as the main gate from the start, not as a fallback. Pixels only for still screens.
- **Gate time:** 20 minutes for a game change, 60 for a frame change.
- **Eye judge:** blocks once per game, at the join; advisory everywhere else.
- **Pictures for Zafar:** 12 a game.

## 11. What we did not take, and why

- **A pixel tolerance (0.1%)** if pictures will not repeat. Not taken: a check that is "nearly right" is the one people learn to explain away. Exact numbers either match or do not.
- **A rotating 15-minute gate** (chai, the moved game and one other in turn). Not taken: a frame change must check every joined game, or the unchecked one is where it breaks. With four games the full set fits the 60-minute ceiling.
- **Moving the visible endings (serve, well done, the "Shabash!" spot) this sprint.** Not taken: it changes chai's reference mid-sprint and touches `ui.js` and `flow.js`. It moves with the rest of the round in Sprint 21. Eggs' own praise call is still answered when eggs joins.
- **The studio report's full demotion of the AI judge.** Taken except at the join, where a new game has no approved pictures and something must say "this looks wrong" before Zafar's time is spent.
- **Sorting the 18 broken checks into three piles now.** Not taken, as the pre-mortem advised: set aside, repaired on need.
- **From the draft, dropped:** ten games in one sprint; 48 pictures a game; "no pasted function" and "file size" checks (they need new tools); retiring zones; the pantry step.

## 12. Decisions for Zafar ("yes to all except …")

1. **Close Sprint 19 without a publish and open Sprint 20 with this goal?** Recommend yes.
2. **The sprint ends at chai, eggs, maani and corn, with the exit test and a publish?** Recommend yes.
3. **The round's logic waits for Sprint 21?** Recommend yes.
4. **The four "fix now" classes; everything else parked?** Recommend yes.
5. **Answer now** (built in Sprint 21, so chai is re-approved once): "Shabash!" sits where chai has it; a mistake at L1-L2 redoes only the wrong step; the wrong-order pop-up only when an order is wrong; a tap never skips a due lesson. Recommend yes to each.
6. **Mum's words and spellings (items 16-22) go in now, before chai is frozen?** Recommend yes; one question stays for Mum (tameto or tomato).
7. **Chai's reference:** zero frozen changes, or a re-freeze on your yes with one line per kind of change? Recommend yes.
8. **Approve chai with its two phone-light faults listed, fixed later?** Recommend yes.
9. **The machine compares exact boxes; pictures are kept in the project for your sheets** (the old rule kept fingerprints only)? Recommend yes.
10. **12 pictures a game for you; the machine holds the rest?** Recommend yes.
11. **Green means zero, enforced by the merge script; only your written yes makes a check advisory?** Recommend yes.
12. **The eye judge blocks once per game at the join, and is advisory otherwise?** Recommend yes.
13. **Retire one-probe-per-row and the 264-minute tier?** Recommend yes.
14. **If the stand-still tool is not proven in one session, we stop and come back to you?** Recommend yes.
15. **A budget ceiling of $450?** Recommend yes.

## Proof

- Folded in: `build/reports/s20-plan-premortem.md` (its five failures, its cuts, the exit test) and `build/reports/s20-plan-challenges.md` (A1-A7, B1-B7), on `build/reports/s20-plan-draft.md` and the three architecture reports.
- Checked for this version: the frozen diff's changes by kind, counted from `build/reports/frozen-diff-chai-tray-202611131035.md` (162, 156, 32, 14, 8, 6, 4); eggs reads the view or the 1600 width 8 times (`js/cook/stations/eggs.js`); SH-277, CK-112 and CK-104 are open rows in `docs/process/regressions.md` (lines 143, 318, 314); `panelcheck.mjs` and `pillcheck.mjs` measure boxes on screen (their headers), `tapgate.mjs` does not (it is a start-button test, so it is not a base for the rules); a push hook exists (`build/tools/tiers/push-hook.mjs`) but no merge script, so P3's is new; chai, corn and maani already share the serve round, eggs uses it without faces (`eggs.js:1133-1155`).
- Taken from the pre-mortem, not re-counted: chai's 19 screen reads; `chai-tray.js:443-449` as the true play area (it matches my earlier reading of those lines); 255 engine tweens and delayed calls.
- Estimates: every cost; the gate's minutes (nothing was timed); that the 382 frozen changes come from few causes.
- Not done: nothing was run; no tool in P3-P5 exists yet; whether exact boxes repeat run to run is unproven until P4.
