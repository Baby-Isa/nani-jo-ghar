# Evidence run tiers-green-e4f292cc21

Commit 54e2be95. 1 rows: 1 for a reviewer, 0 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 2 pages. Sheets and text: `build/screenshots/evidence/tiers-green-e4f292cc21/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id tiers-green-e4f292cc21`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SAM-38 | layout | 2/2 |  | `build/screenshots/evidence/tiers-green-e4f292cc21/SAM-38.png` | 2 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none

## EVIDENCE lines from the reviewers (the tool owner's list)

- SAM-38: the Check names samosa at L1, L2, L3 and L4 at both sizes, but the sheets hold L1 only (A 1280x665, B 740x320); no L2, L3 or L4 panel exists, and the .md has no voice timeline or text capture to confirm the spoken line. What is shown is right: A frame 1 (20.3 s) and B frame 1 (20.5 s) Nani's box reads "Bhar, chunde sathe." and the one gold box is on the chundo heap on the shelf, all six pastry strips unlit. Flaws off the point: Nani's box is under the dim in A1-A3 and B1-B3 while she is the one speaking; frames 1 and 2 are the same light shot twice (two onboards, 20.3 s and 23.0 s, nothing changed); the order card's "ba chunda / two minces" shows one heap picture; in frame 4 ("Chulo bar!") the only lit thing is a small ring by the stove knob, easy to miss at 740x320. (claude-fable-5-2 (Fable 5.2), judge subagent, session_014xb3kQPhiJXAHjeT4WMdGS, independent of the builder)

