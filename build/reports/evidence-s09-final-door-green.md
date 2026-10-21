# Evidence run s09-final-door-green

Commit 9c3172e5. 6 rows: 3 for a reviewer, 2 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 16 pages. Sheets and text: `build/screenshots/evidence/s09-final-door-green/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s09-final-door-green`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| DOOR-01 | layout | 9/9 |  | `build/screenshots/evidence/s09-final-door-green/DOOR-01.png` | 9 |
| DOOR-02 | motion | 1/1 |  | `build/screenshots/evidence/s09-final-door-green/DOOR-02.png` | 1 |
| DOOR-03 | layout | 2/2 |  | `build/screenshots/evidence/s09-final-door-green/DOOR-03.png` | 4 |
| DOOR-04 | layout | 8/8 | PASS: machine: noClip:.day-lines (1 clean); noOverlap:.day-nani,.day-side (no overlap); noClip:.day-lines (1 clean) | `build/screenshots/evidence/s09-final-door-green/DOOR-04.png` | 8 |
| DAY-01 | text | 1/1 | PASS: machine: pass (node build/test_day_runner.mjs: exit 0) | (text only) | 0 |
| DAY-02 | text | 1/2 | TOOL FAILURE | (text only) | 0 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- DAY-02: DAY-02-p2-L1-1366x768: the moment "page:end" never came (the flow stopped: page.waitForSelector: Timeout 20000ms exceeded.); moments seen: page:start, host:day/door, line:day-door-nani, rec:door-first-line, rec:door-lines-and-yes, line:day-door-child, life:act, host:day/activity, rec:door-yes, rec:handoff, host:day/book, host:day/book/load, host:day/book/room, line:day-book-nani, host:day/book/find, rec:stopped-here
