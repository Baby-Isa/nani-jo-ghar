# Run 16: fix-samosa (samosa and roll-tawa)

Branch `run16/fix-samosa`, cut from 48003532. One probe for all my rows: `build/probes/samosa-rt.mjs --row <ROW>` (a lab play with the sandbox's child-pace or fair player, the page read every 100 ms just after a frame is drawn; exit 0 holds, 1 fails). Each row's spec is in `build/sandbox/data/evidence.json` as a `cmd:` probe.

## Flaws first

- **SAM-47 is only half fixed.** Nani's box is still under the dim while she speaks. That is the kit's rule, not samosa's: a staged step's call waits for its light (CHAI-40, contract-78), so her box is dimmed in every game. Frozen chai does the same ("Slow kar!" under the knob's light; probe `--row chai`). It is SH-284's fault too. **Question for Zafar** below.
- **SAM-46's fourth part, the pastry's own shadow, is not built.** It is a question (against SH-268).
- **RT-04 is not fully proven.** The tawa on its burner is proven. The turner's sleeve, cut square, is the hand rig's (`js/cook/hands.js`, ART-84): it needs fix-kit or art. The face beside the plate and Nani's box one step at a time are for the eye.
- **SAM-44's colour half never failed on any commit I tried.** The samosa in the oil browns with its ring (the probe reads the pictures and their blend each frame), so the judge's "raw cream in the oil" frame was not reproduced. The line half was the real bug, and it is proven.
- **RT-03's sentence** is the maani dish's engine sentence, "Muke maani khapeti." with no count, not the row's "Muke char maani khapanti.". Khapeti or khapanti is already Mum's question. Whether the maani sentence says the count is the language engine's (fix-kit).
- A probe that reads between frames can see a state that is changed before it is drawn. My first RT-01 and RT-04 reds on base were that. The probe now reads after the frame is drawn, and both are green on base.

## Rows

| Row | Status | Red | Green |
|---|---|---|---|
| SAM-44 | proven | b6bc317^ at a child's pace: the line goes back to "Tar!" after "Samosa hane kadh." | 48003532 (b6bc317), this branch |
| SAM-46 | question (3 of 4 proven) | b6bc317^ at 740x320: heaps centred at 703 against 800; the pop over the board's corner; the karahi past its hob | 48003532 (b6bc317), this branch, at 740x320 and 1280x665 |
| SAM-47 | question (half built here) | 48003532: the mince heap lit again for each next spoon (3 more times) | 04ab4f7: samosa's own staged fill script; the heap lit once |
| RT-01 | proven | 4c3a230^: the count's pill under the cog (171 samples) | 48003532 (4c3a230), this branch |
| RT-02 | proven | 4c3a230^: no first-time light on the roll | 48003532 (4c3a230), this branch |
| RT-03 | proven | 4c3a230^: "Nana" over the whole sentence | 48003532 (4c3a230), this branch |
| RT-04 | built (tawa proven) | 4c3a230^: the tawa's body 52 px off its burner | 48003532 (4c3a230), this branch |

## The one code change

SAM-47 (b): samosa's fill and fold first-time script now lives in `data/stations/samosa.json` (`onboard`), staged on the moves. `js/cook/stations/samosa.js` puts it in `Cook.data.onboard.samosa`, as roll-tawa does. The old unstaged script in `data/cook.json` (fix-kit's file) is no longer read by samosa, so fix-kit may drop it.

## Needs fix-kit

- SAM-47 (a) / SH-284: lift Nani's box out of the first-time dim while she speaks, if Zafar says yes. That changes frozen chai.
- RT-04: the turner's sleeve (`js/cook/hands.js`), or art (ART-84).

## Questions for Zafar

1. SAM-47 / SH-284: should Nani's box stay out of the dim while she says her line in a first-time showing, in every game, chai included? Recommend yes, in the kit, once chai may change.
2. SAM-46: should the pastry have its own contact shadow on the board, against SH-268 ("the board's shadow is its shadow")? Recommend no.
