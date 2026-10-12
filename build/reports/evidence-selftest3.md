# Evidence run selftest3

Commit ec3c5c26. 5 rows: 1 for a reviewer, 1 decided by the machine, 3 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 14 pages. Sheets and text: `build/screenshots/evidence/selftest3/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id selftest3`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-49 | layout | 2/2 | PASS: machine: count:.rs-words-bad .rs-word=0 (0 visible); count:.rs-words-bad .rs-word=0 (0 visible) | `build/screenshots/evidence/selftest3/SH-49.png` | 4 |
| SH-61 | detail | 1/2 | TOOL FAILURE | (text only) | 1 |
| SH-08 | text | 3/3 | TOOL FAILURE | (text only) | 0 |
| CLN-100 | detail | 3/3 |  | `build/screenshots/evidence/selftest3/CLN-100.png` | 3 |
| ART-18 | motion | 4/4 | TOOL FAILURE | (text only) | 0 |

## Tool failures (3): for the tool owner, never a FAIL in regressions.md

- SH-61: SH-61-p2-L1-1366x768: the moment "visible:.njg-done" never came; moments seen: page:start, life:popup-fold, host:idle, life:stage-end, host:clinic/cut/heal, life:request, clinic:heal/game, step:row-0-0, life:popup-open, rec:stage-heal, rec:heal-cut-start, heal:paani, heal-done:paani, step:paani, heal:wash, step:row-0-1, heal-done:wash, step:wash, heal:cloth, heal-done:cloth, step:cloth, heal:tap, heal-done:tap, step:tap, heal:pl-yellow, step:row-0-2, heal-done:pl-yellow, step:pl-yellow, bubble, life:results, host:results, rec:results-badges, rec:results-words, host:done, rec:end, page:end
- SH-08: SH-08-p1-L1-1366x768: dom:.njg-rq-card at life:request (hit 1): no text on screen in ".njg-rq-card" at life:request · SH-08-p3-L2-1366x768: dom:.njg-rq-card at life:request (hit 1): no text on screen in ".njg-rq-card" at life:request
- ART-18: ART-18-p1-L1-1366x768: trace:canvas:customer:3000 at bubble (hit 1): "canvas:customer" was never on screen during the trace · ART-18-p1-L1-1366x768: trace:canvas:customer:3000 at bubble (hit 2): "canvas:customer" was never on screen during the trace · ART-18-p1-L1-1366x768: trace:canvas:customer:3000 at bubble (hit 3): "canvas:customer" was never on screen during the trace
