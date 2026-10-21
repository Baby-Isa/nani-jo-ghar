# Evidence run s09-ride-red

Commit c7b1c5e. 6 rows: 1 for a reviewer, 1 decided by the machine, 4 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 8 pages. Sheets and text: `build/screenshots/evidence/s09-ride-red/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s09-ride-red`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| RIDE-01 | motion | 2/2 | TOOL FAILURE | (text only) | 0 |
| RIDE-02 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |
| RIDE-03 | motion | 2/3 | TOOL FAILURE | (text only) | 0 |
| RIDE-04 | voice | 0/1 | TOOL FAILURE | (text only) | 0 |
| RIDE-05 | text | 1/1 | FAIL: machine: RIDE-05-p1-repo: pass: node build/leak_window_ride.mjs --speeds slow,normal,fast: exit 1 | (text only) | 0 |
| RIDE-06 | layout | 4/4 |  | `build/screenshots/evidence/s09-ride-red/RIDE-06.png` | 4 |

## Tool failures (4): for the tool owner, never a FAIL in regressions.md

- RIDE-01: RIDE-01-p1-L1-1366x768: strip:.wr-view:10x400 at visible:.wr-band (hit 1): ".wr-view" is not on screen at visible:.wr-band · RIDE-01-p1-L1-844x390: strip:.wr-view:10x400 at visible:.wr-band (hit 1): ".wr-view" is not on screen at visible:.wr-band
- RIDE-02: spec: RIDE-02 probe 1: at "call": no driver of day:window reaches it (add it to the driver and lib/moments.mjs first) · no evidence spec for this row (build/sandbox/data/evidence.json)
- RIDE-03: RIDE-03-p3-L1-800x360: the moment "page:end" never came (the flow stopped: the ride did not end with everything found ({"right":3,"helped":0,"missed":0,"calls":3,"outcome":["right","right","right"],"hints":0,"won":true})); moments seen: page:start, life:request, host:day/window/intro, line:day-window-nani, life:popup-open, rec:popup, life:stage-start, life:popup-fold, host:day/window/ride, visible:.wr-band, rec:ride, rec:asked-0, life:act, life:step-close, rec:spotted-0, life:stage-end, host:day/window-end, rec:end, rec:stopped-here
- RIDE-04: RIDE-04-p1-L1-1366x768: the moment "page:end" never came (the flow stopped: the ride did not end with everything found ({"right":0,"helped":0,"missed":3,"calls":3,"outcome":["missed","missed","missed"],"hints":3,"won":false})); moments seen: page:start, host:day/boot, life:request, host:day/window/intro, life:popup-open, line:day-window-nani, rec:popup, life:stage-start, life:popup-fold, host:day/window/ride, rec:ride, rec:asked-0, life:stage-end, host:day/window-end, rec:end, rec:stopped-here
