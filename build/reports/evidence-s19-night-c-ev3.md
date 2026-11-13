# Evidence run s19-night-c-ev3

Commit dde61868e. 13 rows: 12 for a reviewer, 0 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 22 pages. Sheets and text: `build/screenshots/evidence/s19-night-c-ev3/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s19-night-c-ev3`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| DAAR-39 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/DAAR-39.png` | 2 |
| DAAR-46 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/DAAR-46.png` | 2 |
| DAAR-51 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/DAAR-51.png` | 2 |
| SAM-35 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-c-ev3/SAM-35.png` | 4 |
| SAM-36 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-c-ev3/SAM-36.png` | 4 |
| SEK-28 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-c-ev3/SEK-28.png` | 4 |
| SAM-37 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/SAM-37.png` | 2 |
| SAM-38 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/SAM-38.png` | 2 |
| SAM-40 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/SAM-40.png` | 2 |
| CHT-13 | layout | 2/4 | TOOL FAILURE | (text only) | 4 |
| CK-106 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/CK-106.png` | 4 |
| CK-107 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/CK-107.png` | 4 |
| CK-112 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev3/CK-112.png` | 2 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- CHT-13: CHT-13-p1-L1-1280x665: the moment "view-marble" never came; moments seen: page:start, life:cover, life:order-count, life:order-level, life:poke, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:dish-flash, life:say-start, cook:click, only:.njg-rq-card, bubble, life:say-end, life:stage-start, life:popup-fold, life:step-open, rec:order-card-big, life:band, life:decoys, life:step-call, life:chop-strip, life:rung, rec:order-card-in-sidebar, cook-done:click, life:chop-throw, life:chop-hop, rec:kind-slice, cook:slice, exp:veg-03, life:idle-bump, life:act, cook-done:sl

## EVIDENCE lines from the reviewers (the tool owner's list)

- DAAR-46: no panel shows a stir in progress, a stir past the count, or a stop under or over the count; A (1280x665) never reaches the stir at all (it ends at the hob dial, 92.0 s); B frame 5 (213.0 s) is the stir's first-time light on the spoon before the stir starts, so "the light gone as the stir starts" is not shown either; L2-L4 absent (claude-fable-5-2, judge subagent session_014xb3kSEqyUTbvHCABDzeLo (not the builder s19-night-c))
- SAM-36: A-D all show the end-of-round results panel (stopwatch, tick, bulb) covering the serving tray; only a sliver of the tray's edge shows under it, no samosas to count at either size; L2 shots are not on the sheet (the dom captures give the order line only: "Muke ba samosa khape." / "Muke trae samosa khape.") (claude-fable-5-2, judge subagent session_014xb3kSEqyUTbvHCABDzeLo (not the builder s19-night-c))
- SEK-28: A-D all show the end-of-round results panel covering the served plate; no skewer or pieces visible at either size; L2 shots not on the sheet. Flaw off the point: B and D catch the results panel half-filled (B: grey tick and an empty third cell; D: two empty cells) (claude-fable-5-2, judge subagent session_014xb3kSEqyUTbvHCABDzeLo (not the builder s19-night-c))
- SAM-40: B (740x320) never reaches well done: its last frame is 20 (256.6 s, "Samosa hane kadh."), hit 18 has no screenshot; A's last frame (Shabash, 1280x665) shows the item card still in the order card, not collapsed, but the sheet is too small to read whether it carries a tick; L2-L4 absent. The hob in A and B's last frames sits clear of the top edge with a narrow gap to the side panel (claude-fable-5-2, judge subagent session_014xb3kSEqyUTbvHCABDzeLo (not the builder s19-night-c))
- CK-106: A-D all show the end-of-round results panel covering the tray; only the tray's lower edge and Nani's face circle peek out under it (A, B), no dish and no bubble can be seen or ruled out; L2-L4 absent. Flaw off the point: the side panel's order line reads "Chop these" in plain upright English (A, C), not grey italic (claude-fable-5-2, judge subagent session_014xb3kSEqyUTbvHCABDzeLo (not the builder s19-night-c))

