# Evidence run s13-a1-before

Commit 5c828ff. 8 rows: 4 for a reviewer, 1 decided by the machine, 3 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 24 pages. Sheets and text: `build/screenshots/evidence/s13-a1-before/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s13-a1-before`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-19 | layout | 7/7 |  | `build/screenshots/evidence/s13-a1-before/SH-19.png` | 7 |
| CLN-124 | detail | 1/1 | TOOL FAILURE | (text only) | 1 |
| SH-119 | motion | 9/9 |  | `build/screenshots/evidence/s13-a1-before/SH-119.png` | 9 |
| EASY-08 | detail | 5/5 | TOOL FAILURE | (text only) | 4 |
| DOOR-07 | layout | 2/2 |  | `build/screenshots/evidence/s13-a1-before/DOOR-07.png` | 4 |
| RIDE-10 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |
| SH-124 | motion | 3/3 | PASS: machine: count:.cv-pill.ob-lit>=1 (1 visible); count:.ob-finger>=1 (1 visible); count:.cv-pill.ob-lit>=1 (1 visible) | `build/screenshots/evidence/s13-a1-before/SH-124.png` | 3 |
| CLN-203 | detail | 2/2 |  | `build/screenshots/evidence/s13-a1-before/CLN-203.png` | 3 |

## Tool failures (3): for the tool owner, never a FAIL in regressions.md

- CLN-124: CLN-124-p1-L1-1366x768: dom:.cl-bubble at bubble (hit 1): no text on screen in ".cl-bubble" at bubble · CLN-124-p1-L1-1366x768: dom:.cl-bubble at bubble (hit 2): no text on screen in ".cl-bubble" at bubble · CLN-124-p1-L1-1366x768: dom:.cl-bubble at bubble (hit 3): no text on screen in ".cl-bubble" at bubble
- EASY-08: EASY-08-p2-L1-1366x768: strip:.njg-spot:6x250 at exp:cook-paani (hit 1): ".njg-spot" is not on screen at exp:cook-paani
- RIDE-10: spec: RIDE-10 probe 1: strip "strip:.day-root:14x500": 2 to 12 frames · no evidence spec for this row (build/sandbox/data/evidence.json)
