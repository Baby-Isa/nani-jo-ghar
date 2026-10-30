# Evidence run s15-chai-ev9

Commit 0e2831c. 6 rows: 6 for a reviewer, 0 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 16 pages. Sheets and text: `build/screenshots/evidence/s15-chai-ev9/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s15-chai-ev9`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-171 | motion | 3/3 |  | `build/screenshots/evidence/s15-chai-ev9/SH-171.png` | 3 |
| SH-172 | layout | 3/3 |  | `build/screenshots/evidence/s15-chai-ev9/SH-172.png` | 4 |
| SH-165 | text | 3/3 |  | `build/screenshots/evidence/s15-chai-ev9/SH-165.png` | 2 |
| SH-163 | motion | 5/5 |  | `build/screenshots/evidence/s15-chai-ev9/SH-163.png` | 5 |
| CHAI-50 | text | 5/5 |  | `build/screenshots/evidence/s15-chai-ev9/CHAI-50.png` | 1 |
| CHAI-40 | voice | 4/4 |  | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none

## EVIDENCE lines from the reviewers (the tool owner's list)

- SH-163: the close strips D and E (50 ms slots, not 60 fps) caught no frame of a card in flight: every frame on the sheet is before the pop (1 ms / 2 ms big dudh card) or after the landing (row with dudh and hakro khun), every caption after the first is red (off its slot, E's by up to 16 s); the 250 ms strips A-C show only 2-3 frames per morph (each in-flight frame in C one card, readable, text paler while moving; A at 1920x1080 is too small on the sheet to read), so "every frame one whole readable card" cannot be judged from this sheet. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kRLtLPZ2qrL3PyhaaF)

