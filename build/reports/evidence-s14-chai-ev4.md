# Evidence run s14-chai-ev4

Commit 57b29fa2. 8 rows: 8 for a reviewer, 0 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 16 pages. Sheets and text: `build/screenshots/evidence/s14-chai-ev4/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s14-chai-ev4`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-163 | motion | 2/2 |  | `build/screenshots/evidence/s14-chai-ev4/SH-163.png` | 2 |
| SH-164 | layout | 2/2 |  | `build/screenshots/evidence/s14-chai-ev4/SH-164.png` | 2 |
| CHAI-42 | motion | 2/2 |  | `build/screenshots/evidence/s14-chai-ev4/CHAI-42.png` | 2 |
| CHAI-43 | motion | 4/4 |  | `build/screenshots/evidence/s14-chai-ev4/CHAI-43.png` | 4 |
| CHAI-45 | motion | 4/4 |  | `build/screenshots/evidence/s14-chai-ev4/CHAI-45.png` | 4 |
| CHAI-46 | layout | 2/2 |  | `build/screenshots/evidence/s14-chai-ev4/CHAI-46.png` | 2 |
| CHAI-47 | detail | 4/4 |  | `build/screenshots/evidence/s14-chai-ev4/CHAI-47.png` | 4 |
| CHAI-48 | motion | 2/2 |  | `build/screenshots/evidence/s14-chai-ev4/CHAI-48.png` | 2 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none

## EVIDENCE lines from the reviewers (the tool owner's list)

- CHAI-47: the zoom panels A and C (1280x665, 1920x1080, at exp:pour-nana) show the tray with no highlight box at all, so the zoom misses the light layer; in the full shots B and D the lit box round Nana's glass is there but the tray is ~90px wide and the face badge sits on its left edge at a size where over or under the line cannot be told; the text captures hold only contract-82 (0 breaks), not the light check the row names. Flaws noted off the point: B and D carry English order-card text ("Make ... chai khape.") in plain dark type rather than grey italic, and the Nani line "Pour it into their glass." is English in italic (allowed if to-record); at 1280x665 (B) the left column shows two order cards where D shows three, worth a look for a cut-off card. (Claude Fable 5.1, session_014xb3kP6T7dmVAL7LekGAxz)
- SH-164: A and B are whole-screen thumbnails (the 1920x1080 shot shrunk ~4x); the knob's lit box on the black stove is a ~20px gold ring whose interior reads as dark as the stove around it, so a soft warm fill (contract-84's 12 of 255) can neither be seen nor ruled out; a crop of the lit knob at both sizes is needed. No other flaws seen: Nani's English line is italic to-record, order-card English sits under the Kutchi at L1, no clipping. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- CHAI-46: A and B catch the pan lifted off the burner with its handle pointing left, away from the gauge (the dial at the tray's top-left) and away from any heat ring; nothing crosses the gauge, so the sheet cannot show the ring drawn over the handle, which is the row's state. Note for the tool owner: both rows name the same moment (life:timed-hold 53.5s / 50.0s) yet SH-164 shows the pan on the burner and CHAI-46 shows it lifted over the tray's corner, so the probe is not landing on one deterministic frame. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- SH-163: the sheet films chai L4 only (A 1920x1080, B 930x430) while the row and Check say every game on the new kit; what is filmed looks right (A 6687 ms and B 2257/8094 ms catch one card in flight with plain, single words, the recorder counts at most 1 card in flight and 0 px2 over a face) but a 250 ms slot lands on one or two frames per morph, so the other games' morphs and the stretch itself are not in the sheet. Flaws seen: none in these frames. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- CHAI-42: the strip crops to #side only, so the pan, the tea spoon and the pour are off-frame and the recorder logs no movement at all (0 px row, 0 cards); A shows the order card dim at 39 ms, lit at 1068 ms, dim again by 1837 ms (B: lit 1388 ms, off by 1862 ms), but nothing on the sheet marks when the last move ended, and the quick-child (no light) case is not filmed; a timeline of spoon-landed vs light-on is needed. Flaws seen: the L1 row shows a third item card as a sliver at the panel's right edge (A, B), a scroll cue rather than clipping. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- CHAI-48: no frame shows the moment the row names (Mum's long first line in a two-person chai): A jumps from Nana's "dudh na" at 5000 ms to Mum's "dudh," at 7000 ms, B from 4749 ms to 7000 ms, and in between the changed-frame pick kept nothing; the only word on it is the contract-52 text line (0 breaks at 1280x665 and 740x320), with 930x430 and 1920x1080 and the other Cook games not filmed. Mum's short lines ("dudh,", "hakro khun.") do sit at her own head, clear of Nana's. Flaws seen: B (740x320) the second person's row header peeks half-cut at the menu's bottom edge at 28, 2500, 3341 and 4749 ms (a scrolled row below the fold, text cut mid-glyph). (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)

