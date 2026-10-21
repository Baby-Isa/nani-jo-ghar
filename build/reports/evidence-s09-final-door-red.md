# Evidence run s09-final-door-red

Commit 341058f6. 6 rows: 2 for a reviewer, 0 decided by the machine, 4 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 14 pages. Sheets and text: `build/screenshots/evidence/s09-final-door-red/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s09-final-door-red`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| DOOR-01 | layout | 3/9 | TOOL FAILURE | (text only) | 3 |
| DOOR-02 | motion | 1/1 |  | `build/screenshots/evidence/s09-final-door-red/DOOR-02.png` | 1 |
| DOOR-03 | layout | 2/2 | TOOL FAILURE | (text only) | 0 |
| DOOR-04 | layout | 8/8 |  | `build/screenshots/evidence/s09-final-door-red/DOOR-04.png` | 8 |
| DAY-01 | text | 1/1 | TOOL FAILURE | (text only) | 0 |
| DAY-02 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |

## Tool failures (4): for the tool owner, never a FAIL in regressions.md

- DOOR-01: DOOR-01-p2-L1-1024x768: the moment "visible:.day-answer.in" never came (the flow stopped: day:door#raining: the driver is not built yet (s09-final-door)); moments seen: page:start, rec:stopped-here · DOOR-01-p2-L1-1366x768: the moment "visible:.day-answer.in" never came (the flow stopped: day:door#raining: the driver is not built yet (s09-final-door)); moments seen: page:start, rec:stopped-here · DOOR-01-p2-L1-844x390: the moment "visible:.day-answer.in" never came (the flow stopped: day:door#raining: the driver is not built yet (s09-final-door)); moments seen: page:start, rec:stopped-here
- DOOR-03: DOOR-03-p1-L1-1366x768: crop:.day-side at visible:.day-answer.in (hit 1): ".day-side" is not on screen at visible:.day-answer.in · DOOR-03-p1-L1-1366x768: dom:.day-side at visible:.day-answer.in (hit 1): no text on screen in ".day-side" at visible:.day-answer.in · DOOR-03-p1-L1-844x390: crop:.day-side at visible:.day-answer.in (hit 1): ".day-side" is not on screen at visible:.day-answer.in
- DAY-01: DAY-01-p1-repo: node build/test_day_runner.mjs: TOOL FAILURE, missing module (Node.js v22.22.0)
- DAY-02: spec: DAY-02 probe 1: unknown flow "day:full-farm" (run.mjs --list shows them) · spec: DAY-02 probe 2: unknown flow "day:full-kitchen" (run.mjs --list shows them) · no evidence spec for this row (build/sandbox/data/evidence.json)
