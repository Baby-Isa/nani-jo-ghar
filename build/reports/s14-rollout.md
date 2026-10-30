# Sprint 14 roll-out (the orchestrator, 30 Oct 2026, without Zafar)

Plan: `docs/sprints/S14-rollout-plan.md`. Zafar, 30 Oct: "Run everything autonomously without me till publish. If you find code
fixable issues at any point, fix them all before publishing."

## Phase A: chai's finish (verified by script-made films, 150-200 ms a frame, looked at frame by frame)

| # | Row | Result | How |
|---|---|---|---|
| A1 | CHAI-43 three people | works | chai L4 at 740x320, 930x430, 1920x1080: the card under Nana's face at the left, over no face (measured each frame against every head box), whole on screen; scaled (zoom 0.71) only at 740x320 |
| A2 | CHAI-40 controls lit with their call | works | L1 new and returning player at speed 1: "Chulo bar!" and "Slow kar!" lit 23-120 ms from the call; no second spotlight; contract-24/36 green on chai L1-L4 |
| A4 | CHAI-42 the order card's light | **fixed again** | film: it lit while the tea spoon was still in the pan, and over the milk's pour for a quick child. Now it waits for a spoon in flight, skips once the child has moved on, and goes if a pour starts while lit. Filmed: a child pausing 2.5 s gets it 2 s after the tea tap; a quick child none |
| A5 | SH-162, SH-164, CHAI-46, CHAI-47, SH-165 | works; one fix | stills at 930x430 and 1920x1080: no light on the arrow, the warm fill, the ring over the handle, the glass's face inside its box, the speaker beside the words. **Fixed:** with two people the pour's one box round the glass and its pan took in the other pan between them: the box is now the glass alone (it pours at a tap too); the pan keeps its glow |
| A6, A7 | SH-163, CHAI-43 | works | the morph in the A1 film; two people middle and right in the L2 shots |
| A8 | CHAI-44 | works | from the order card's tap to the first play tap, chai L3 at 1280x665: main 2.5 MB in 124 files, the branch 1.8 MB in 84 (30% less); the time equal on the local server (about 1.2 s) |
| A9 | CHAI-45 | works | the first 4 s at the four sizes: main changes the canvas and the camera twice in the first 0.5-0.8 s at every size; the branch not once |
| A10 | SH-161 | works | a round on lab.html, Play again: main loses 14 textures (the painted worktop among them); the branch none |
| A11 | SH-166 | works | every bubble in the chai, pantry and maani contract runs is clear of its side panel |
| new | CHAI-48 | **fixed** | the contract run found the next person's long line over Nana's face (contract-52, 41-64%, chai L2-L4 at 1280x665 and 740x320; main had one at 740x320): Cook now passes the other heads to the shared placement, which wraps a line narrower at its own speaker before trying the head's other side. Green on chai L2, L3 returning, L4 at the four sizes; the eye test's contract-51/52 breaks are the same as main's |

Known, left for the builders: contract-53 (the help light too big) in samosa and the pantry, contract-24 once in samosa at 740x320
(s14-cook); the eye test's contract-51 and contract-52 (s14-clinic).

### Proof (phase A)

The films and their frames: the orchestrator's scratch scripts (`film.mjs`, `replay.mjs`, `loadtime.mjs` on the sandbox's own
server and browser); the contract runs `build/screenshots/sandbox/s14-A-contract` (36 pages: chai L1-L4, returning, maani, samosa,
the pantry; 11 breaks, 3 of them CHAI-48), `s14-A-c52` (CHAI-48 green on chai; the eye test's breaks as on main) and
`s14-A-final` (chai L1-L4, returning, mistake at the four sizes: 0 breaks over 28 pages). The before for every timing row on
`main`'s code (89729f48) in a worktree.

## Phase B: the checks (s14-tools, Sonnet), merged 30 Oct 04:20 UK

Its report: `build/reports/s14-tools.md`. Every check but B8 and B9 red on `main`, green or nearly on the branch. Its new checks
found five more things on the branch, all fixed by the orchestrator the same morning:

| Row | Found by | Fix | Proof |
|---|---|---|---|
| CHAI-42 | contract-79 | the card's light waits for a quiet spell (no tween, page animation or row glide in flight or pending, sampled every 60 ms), not a fixed beat | contract-79 green on chai L1-L4 and returning at 740x320, 930x430, 1920x1080, speed 1 and 3 |
| SH-166 | contract-86 | the conversation bubble's keep-out shift measured at its full size (it was placed while popping in at 90%) | contract-86 green, chai L4 at 930x430 |
| SH-165 | the card measure | the side card's speaker gap: the grid's gap plus a margin made 18-20 px; now 12, the item card's | `cardmeasure` SPACING: 12 px at 740x320, 930x430, 1280x665 |
| CHAI-49 (new) | contract-78 | at L3-L4 a pan not in hand opened its knob step as a tap on the pan: nothing was lit with "Chulo bar!"; its knob is lit now | the station's log: light and call in the same ms; contract-78 green at speed 1 |
| ART-18 | contract-14 | a face badge's own 8 px bob while a person repeats their order; now the kit's one talk motion | contract-14 green, chai L4 at 740x320 |

Two tool faults fixed: contract-84 (the light's lift) measured a light already closing (its layer keeps its box for 300 ms after
close): it measures only a light still up (the knob reads +36.5 of 255, 12 wanted); contract-79 asked for 500 ms at test speed 3:
it is judged at the run's speed, as contract-22 and contract-29 are. Left, minor: the big card's flight into the side panel
brushes Nana's face corner for a frame or two at L4 (contract-83, 4 px at 930x430); contract-74 and -78 at 1035 ms and 219 ms
under three browsers' load. cook.html's title backdrop still jumps on load (lab.html, what Zafar plays, does not).
