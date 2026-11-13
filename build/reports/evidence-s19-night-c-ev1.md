# Evidence run s19-night-c-ev1

Commit ea9aa81ac. 9 rows: 9 for a reviewer, 0 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 9 pages. Sheets and text: `build/screenshots/evidence/s19-night-c-ev1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s19-night-c-ev1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| DAAR-52 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev1/DAAR-52.png` | 2 |
| SEK-29 | motion | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev1/SEK-29.png` | 2 |
| SAM-37 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev1/SAM-37.png` | 2 |
| SAM-38 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev1/SAM-38.png` | 2 |
| SAM-40 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev1/SAM-40.png` | 2 |
| CK-108 | layout | 1/1 |  | `build/screenshots/evidence/s19-night-c-ev1/CK-108.png` | 1 |
| CK-109 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev1/CK-109.png` | 2 |
| CK-110 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-c-ev1/CK-110.png` | 2 |
| CK-111 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-c-ev1/CK-111.png` | 4 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none

## EVIDENCE lines from the reviewers (the tool owner's list)

- SAM-37: the 740x320 fold is missing (B has frames 1-6, 9, 10; hits 7 and 8, the "Samosa waar!" fold, timed out with no screenshot). A frame 7 (116.3 s, 1280x665) does show it right: the one gold box is on the pastry on the board, the order card unboxed and dimmed. Flaw seen: B frame 3 (164.2 s) lights an empty pastry strip while the line reads "Bhar! Chundo." (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder))
- SAM-40: no well-done (Shabash) frame at 740x320: B ends at the second fold (284.6 s) and five of its shots timed out; A's well-done frame (20) is too small on the sheet to read the item card's tick or the hob's gap. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder))
- CK-110: no tomato is cut and no "hakro" chip appears in any frame: both runs cut a potato only (A frame 2, B frame 2: two halves inside the board near its bottom edge, no chip above them). Flaws seen: B frame 3 (48.3 s) is blank marble; A's chutney pill has no word. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder))
- CK-111: the knife's finger moving cannot be judged: there is no strip, only one still with the dim (D frame 3, 30.6 s), where the finger rests on the knife handle at the board's right, and A frame 1 / B frame 1 have no dim, light or finger at all; the 1280 hit 2 timed out. Of the rest: D frame 19 shows the shelf bowls and pills at full strength at well done (met); a small pale garlic bowl still sits left of the hob in D frames 6-9 and B frame 2 (cannot tell faded from white garlic at this size). Flaws seen: order card items cut off at the panel edge in B frames 2-4 ("mi ch", "dar heric", "chi illi"). (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder))

