# s08 wave 6C, the clinic (builder report; not judged)

Branch `worktree-agent-a6938d10fe461f184` from 47458dc2, not pushed. Game code changed: yes (js/clinic, data/clinic, css/clinic.css).

## Flaws first

| # | Flaw |
|---|---|
| 1 | "Bring in man" still reads as a fragment: the line is already a grey to-record placeholder, but its English comes from the engine (data/lang abstract BringInKind, "Bring in {kind}"), which is 6A's. Request below. |
| 2 | CLN-17: the doctor now stands beside her at the bed, but his body still faces us (his "3q" view is barely turned): art list. |
| 3 | The tool tiles are a step bigger in every heal game (0.95 to 1.05 of the done size); at 1024x768 the boing's column ends 6 px above the ✓. |
| 4 | Eye drops close-up (not this wave's change): the face picture's chin edge shows at the bottom at 1366x768 (CLN-185's wider view). |
| 5 | The evidence sheets for CLN-173 (6x150 strip) are too small to judge the prongs; my x2 crop is in the proof. |
| 6 | The regression list for the touched flows was not rechecked row by row; only the shots of the flows below. |

## What changed

| Area | Rows | Change |
|---|---|---|
| Stuck runs | gate | Fever: a thing on the bed hid as it went onto her and the same press's click took it back (game bug). Foot: the driver swept dirt under the tool column. Boing: the green lever sat under the tools at 4:3 (game bug): machine 0.8, syringe 0.9, left of the column. Knee scrape: the second graze lay under the two-wide tool grid (game bug): the view slides or steps back. |
| Fever | CLN-176, 105 | "barabar" only on the last swing, then her thanks |
| Eye | CLN-187, 188 | L3 strip: both eyes' counts in one engine line; the strip keeps numbers at every level (SH-99). The split at 250: the board 265x400 units, her picture fills her panel, the wall picture's edges fade |
| Boing | CLN-165 | Arm photo 1.3x, runs off top and bottom; tiles bigger |
| Ear | CLN-173 | The prongs closed the wrong way (opened): now they close, the far tip behind the wax |
| Rooms | CLN-17, 115 | Doctor at x 0.70 beside the bed; in the waiting room he calls from his door after the pop-up (bubble at his head; no bubble from L3, heard only) |

## Proof

| Check | Result |
|---|---|
| The 8 stuck runs | all reach their end (w6c-stuck-a to e) |
| checks.mjs | unit 413/414 (the known CONTRACT_ROWS fail), words, static, leak 19, bump, specs, size ok; load 29/29 |
| Evidence `ev-w6c-green` | 8 rows, sheets for the judge (red: ev-20261019-172022-khk) |
| Fever voice L1-L3 | barabar once, last, then thanks; bubbles match |
| Shots | eye chart 1366/1024/800, eye L3 strip, tooth fill x2, ear grab x2, diagnosis and waiting L1/L3 at 1366 and 800x360 |

QA: TXT ✅ · LAY ⚠3,4 · CMP ✅ · LNG ⚠1 · INT ✅ · ART ⚠2 · CUL ✅. Every row is open for the judge.
