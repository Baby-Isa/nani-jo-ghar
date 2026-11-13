# Challenges to the Sprint 20 draft plan (13 Nov)

The orchestrator challenges `build/reports/s20-plan-draft.md` twice: first as lead game architect and developer, then as AI-workflow expert. Each point names the risk and the change to fold in.

## A. As lead game architect and developer

1. **The picture tool must not become a rabbit hole (P3).**
   - Risk: pixel-exact pictures from a canvas game (fonts, image decoding, anti-aliasing, dice in 117 places) can take many rounds. The plan blocks every step on it.
   - Change: a ceiling of one builder session. If three runs are not identical by then, use a small tolerance (for example, at most 0.1% of pixels may differ, and none inside the geometry rules' boxes). Zafar is told which one it is.

2. **The picture gate must stay fast, or it will stop being run.**
   - Risk: ten games, about 48 pictures each, each played to its moment, at four sizes: the gate grows with every game. The 264-minute tier died this way.
   - Change: a time budget for the gate; the draft suggests about 15 minutes. At each step it runs on chai, the game being moved and one other joined game, chosen in turn. The full gate runs at each review point and at the end. If it outgrows its budget, pictures are cut before the budget moves.

3. **Step 3 moves the round's logic before the frame has seen enough games.**
   - Risk: with only chai and eggs, the round's shape will fit those two and need reworking for maani (no heat), corn (two screens) and samosa (a sequence).
   - Change: split step 3.
     - The visible endings now: the serve, well done, the "Shabash!" spot and the wrong-order moment.
     - The round's logic (first-time gate, stuck help, redo, level-up count) after corn, when four different games have shown what the round must allow.

4. **"The old path stays live until the new passes" doubles the code.**
   - Change: one step, one move. A game's old layout code is deleted in the same step it joins, once its pictures pass. Never two live paths across steps.

5. **Safe steps.**
   - Change: each passing step is merged and tagged on the working branch, so a later step that goes wrong can be undone to the last good tag. No long-lived builder branch.

6. **A frame change after the lock touches every joined game.**
   - Change: a frame change is its own piece of work. Its differences sheet is grouped by change, not by game, so Zafar sees one row: "this moved in 6 games, here's how".

7. **The side panel file (`js/cook/ui.js`, over 5,000 lines) is shared by every game.**
   - Change: it is not split in this sprint. Any step that touches it states which games it can reach, and runs their pictures.

## B. As AI-workflow expert

1. **"One frame owner" cannot be one AI.**
   - Risk: an AI builder keeps no memory between sessions. "The owner" will be several sessions, each starting fresh, as happened this week.
   - Change: the owner is a document. The frame's notes (`docs/architecture/kitchen-frame.md`) say what the frame owns, its options, its spots, its rules and every decision. Each frame session reads it first and updates it last. A brief that disagrees with it is wrong.

2. **The orchestrator explained red checks away this week.**
   - Risk: twice, a gate that wasn't green was called "noise" by the orchestrator (84 breaks against 63; then 69 against 76 offered as "better").
   - Change: green means zero is enforced by the merge script, not by judgement. The merge refuses a red blocking gate. Only Zafar's written yes can mark a check advisory.

3. **The checks are written by the same AI that is checked.**
   - Risk: a picture tool or geometry rule that quietly passes everything looks exactly like one that works.
   - Change: every gate proves it can fail. In P3 and at each new rule, plant known faults:
     - a box moved 4 px;
     - a card overlapping a face;
     - a cut word;
     - a light off its target.

     The gate must catch each one before it counts. This "catches planted faults" proof is rerun whenever the gate's code changes.

4. **The orchestrator's own memory is the weak point in long chats.**
   - Risk: this chat was compacted, and facts were lost (the frozen run was wrongly described as covering layout).
   - Change: the sprint file holds each step's status, proof and the next command. A new chat starts at each review point with `/handover`, never mid-step.

5. **Briefs drift and widen.**
   - Change: each brief is short: the step's goal, the files it owns, one acceptance command that prints pass or fail, a cost ceiling and a stop rule ("if not green within the ceiling, stop and report"). No rows are pasted into briefs for frame steps.

6. **The AI judge stays useful if it is told what it's for.**
   - Change: the judge is asked only gross questions ("is anything clearly broken, missing or ugly?") on the four chat pictures. It never passes or fails a row.

7. **Zafar's time is the scarcest resource.**
   - Change: each review point is at most four chat pictures, one play beside chai and one sheet of pictures. Nothing reaches him that a machine could have measured; a fault he finds that a machine could have measured becomes a new geometry rule in the same step.

## Proof
Rests on `build/reports/s20-plan-draft.md`, `s19-architecture-doubts.md`, `s19-studio-workflow.md`, this session's runs (`build/screenshots/sandbox/s19-r2-gate`, `s19-r2-recheck`, `s19-r2-recheck2`, `build/reports/frozen-diff-chai-tray-202611131035.md`) and `build/reports/s19-r2-games.md` (84 against 63).
