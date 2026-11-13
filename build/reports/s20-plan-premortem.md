# Sprint 20 plan: a pre-mortem (13 Nov)

Imagine the plan in `build/reports/s20-plan-draft.md` has failed. This is the most likely story of why, and what to change now. Read-only: nothing was run or changed.

## 1. The five reasons it failed, most likely first

### 1. The "frame" was chai's stove sums, so games joined in name only

- **What happened:** step 1 moved chai's 45 lines. Eggs could not use them as they were, so the shared function grew options, and eggs kept its own sums beside it. Each later game did the same. The side panel, bottom row and "Shabash!" never moved at all.
- **Evidence:** the 45 lines are not a floor plan. They size chai's hob by the number of people, its pans by handle reach, and its tray (`js/cook/stations/chai-tray.js:420-441`). Only about eight lines are a true play area (`:443-449`). Eggs solves a different sum: a pot and a pan with turned handles, a tray with its own least width (`js/cook/stations/eggs.js:101-125`). The things "done" promises (side panel, bottom row, praise) live in `js/cook/ui.js` (5,272 lines, 56 screen measurements) and `flow.js` (2,603), which no step touches before step 9. Chop places its own "Shabash!" today (`js/cook/stations/chop.js:276-309`).
- **Early sign:** step 2 ends with "a named option" added, and eggs' file is no shorter.
- **Why the safeguards missed it:** "chai's pictures identical" proves chai did not move. It says nothing about whether eggs uses the frame. The counts that would show it arrive at step 4, after two games.
- **Mitigation:**
  1. Step 1 moves only the play-area rectangle (`:443-449` and the margins). The hob, pans and tray stay in chai as its room.
  2. Step 2 passes only if eggs' own layout sums are deleted: eggs reads the stage's edges 8 times today (4 `Cook.view`, 4 of the 1600 width); the target is 0.
  3. Step 4's counts are four searches. Run them before step 1, so every step shows a number going down.

### 2. The stand-still switch ate the sprint, and the picture gate went noisy

- **What happened:** pictures were never identical three times running. The fallback "small tolerance" came in, the gate flickered, and red was explained away again.
- **Evidence:** the plan admits it is unproven (its Proof, last line). Every step's proof depends on it. The drawing engine picks its renderer by machine (`js/cook/flow.js:2474`). There are 255 engine tweens and delayed calls in `js/cook` and `js/shared` on the engine's own clock, not `life.js`; the plan itself counts 103 more timers in `js/shared`. The existing tool takes frames "while it plays", and "mid" is a halfway frame, not a state (`build/sandbox/lib/keyframes.mjs:8-21`).
- **Early sign:** P3 needs a second session, or passes $80.
- **Why the safeguards missed it:** risk 1's fallback is the very thing that failed last week: a check that is nearly right.
- **Mitigation:**
  1. P3 gets one session. No extension.
  2. Decide the fallback now: the machine compares numbers, not pixels. About ten boxes a game (play area, panel, bottom row, hob, tray, first and last item), read from the game at each key moment, exact. The doubts report already proposed this (`s19-architecture-doubts.md` section 2).
  3. Pixel comparison only for screens that truly stand still (the order, the end).

### 3. The blocking gate took hours, so it stopped being run

- **What happened:** by the fifth game a full gate took a working day. Someone wrote "not run: too long".
- **Evidence:** chai's frozen run alone is "about 10 minutes" quick, 20 full (`build/tools/review/frozen.mjs:11-12`), under one browser lock. The picture gate at ten games is 160 play-throughs (four levels, four sizes: decision 4), each played to the moment. The play bot adds about 80. The contract run is 88 pages. Rule P6 forbids running them side by side. No step measures the total.
- **Early sign:** the first report that lists a blocking check as "not run".
- **Why the safeguards missed it:** the plan retires the slow tier and then rebuilds one, without a time limit.
- **Mitigation:**
  1. The gate prints its minutes. Ceiling: 20 minutes for a game change (that game plus chai), 60 for a frame change (every joined game).
  2. Over the ceiling, the next step does not start until the gate is cut back.

### 4. Chai was not a fixed reference, and Zafar became the queue

- **What happened:** chai kept changing, so its pictures were re-approved again and again. Work stopped at every open review. Zafar approved sheets he had stopped reading.
- **Evidence:** today's frozen run shows **382 changes on 30 pages** (`build/reports/frozen-diff-chai-tray-202611131035.md:3`), three days after the freeze. The plan calls this "three faults". P4 approves chai with known light faults, so the reference holds faults from day one. Section 9 puts four round decisions at step 3, each changing chai's pictures. Wrong Kutchi and missing sounds still land in chai throughout. Ten games is about 480 pictures to approve. `docs/status.md` records that he has not agreed the principles.
- **Early sign:** P1 takes more than one session; chai's sheet is approved twice before eggs.
- **Why the safeguards missed it:** risk 6 ("only Zafar's yes renews") and risk 7 ("nothing merges past an open review") together make him the bottleneck by design.
- **Mitigation:**
  1. P1 ends only when the frozen run shows 0 changes, or is re-frozen with his yes and one written line per kind of change.
  2. The four step-3 decisions are answered before step 1, so chai is approved once.
  3. He approves 12 pictures a game (smallest phone and laptop, six moments). The machine holds the rest.
  4. No chai rows until step 3 is merged.

### 5. Nothing checked that a joining game looked right

- **What happened:** games joined, "played to the end", and looked wrong. The faults came back as rows. The parked 354 rows were waved through "in one sitting".
- **Evidence:** a joining game has no approved pictures until after it joins, so the picture gate is silent at the riskiest moment. The geometry rules are named as blocking (section 6, item 4) and required at step 2, but **no step builds them**; no such tool exists in `build/tools/review/`. The eye judge, which the doubts report calls "the one check that told the truth this sprint" (section 4), is demoted to advisory.
- **Early sign:** step 2 reports "geometry rules hold" without naming the tool.
- **Why the safeguards missed it:** the plan's machines only prove "nothing moved". Nobody is assigned "this is right".
- **Mitigation:**
  1. Add a prep step: the geometry rules, built from checks that already exist (`panelcheck.mjs`, `pillcheck.mjs`, `tapgate.mjs`). It must fail on a known eggs fault (CK-94, the pan handle by the tray at 740x320) before step 2 starts.
  2. The eye judge stays blocking once per game, at the join, beside chai, before Zafar looks.
  3. Each game's parked rows become a short yes/no list before it joins, not after.

## 2. Unnecessary or overbuilt: cut

- **Steps 8-10 from this sprint.** Ten games, one publish at the end, $700: the same shape as last week.
- **Retiring the zones system (step 9).** Every game, chai included, still declares zones (`chai-tray.js:189`, `maani-line.js:156`, `samosa.js:156`). Pulling it out after every picture is approved is a second big move. Its own sprint.
- **The machine comparing levels 2 and 3** (decision 4). It doubles the gate for little.
- **Sorting the 18 broken checks into three piles** (P2). Set them aside; repair one only when a step needs it.
- **Two of the four guard rails:** "no pasted function" and "file size limit". Both need new tools. Keep the two that are plain searches.

## 3. The one change that most improves its odds

**End the sprint at corn (chai, eggs, maani, corn), publish, and make the exit one test Zafar can watch:**

- Change one frame number (say, the gap above the bottom row).
- All four games move by it.
- No game file was edited.

That test is the goal itself, at a third of the cost, with a child playing the result. If it fails at four games, it would have failed at ten. The other six games become Sprint 21, started only on a pass.

## Proof

- Read: the plan, `s19-architecture-doubts.md`, `CLAUDE.md`, `docs/status.md` (top), and the parts of the files cited above.
- Counted by search, this session: 117 random-number uses in `js/cook` and `js/shared` (matches the plan); 255 lines with engine tweens or delayed calls there; 56 screen-measuring lines in `ui.js`; `Cook.view` and 1600 in each station file (eggs 4 and 4, chai 10 and 9); `zones:` declared in nine station files; no file matching "geometry" among `build/tools/review/*.mjs`.
- Estimates, not measurements: the gate's length (160, 80 and 88 pages are from the plan and the gate report; minutes per page were not timed); 480 approvals (the plan's 48 times ten games); the "eight lines" that are a true play area (my reading of `:443-449`).
- Not checked: whether pixel-exact pictures are possible (nothing was run); what the 382 frozen changes are made of beyond the first 40 lines (many may be one cause); whether `panelcheck`, `pillcheck` and `tapgate` cover enough to base the geometry rules on (names only, not read); CK-94 is not in the open fix list (`docs/process/regressions.md`), so pick a fault that is still open.
- Not done: no file edited but this report; no commit; no browser run.
