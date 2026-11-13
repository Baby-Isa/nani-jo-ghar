# Evidence run s19-night-b-a2

Commit d3a8324b5. 32 rows: 26 for a reviewer, 1 decided by the machine, 5 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 51 pages. Sheets and text: `build/screenshots/evidence/s19-night-b-a2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s19-night-b-a2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| PAN-19 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/PAN-19.png` | 2 |
| PAN-20 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/PAN-20.png` | 2 |
| PAN-21 | layout | 8/8 |  | `build/screenshots/evidence/s19-night-b-a2/PAN-21.png` | 8 |
| CHAI-96 | motion | 8/8 | TOOL FAILURE | (text only) | 7 |
| CHAI-98 | motion | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CHAI-98.png` | 2 |
| CHAI-99 | layout | 1/8 | TOOL FAILURE | (text only) | 1 |
| CHAI-101 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CHAI-101.png` | 4 |
| CHAI-19 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CHAI-19.png` | 2 |
| CHAI-36 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CHAI-36.png` | 4 |
| CHAI-37 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CHAI-37.png` | 2 |
| CHAI-38 | layout | 1/2 | TOOL FAILURE | (text only) | 1 |
| CHAI-49 | layout | 2/2 | TOOL FAILURE | (text only) | 1 |
| CHAI-54 | layout | 2/2 | TOOL FAILURE | (text only) | 2 |
| CHAI-55 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CHAI-55.png` | 4 |
| CHAI-56 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CHAI-56.png` | 4 |
| CK-59 | voice | 2/2 |  | (text only) | 0 |
| CK-46 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CK-46.png` | 2 |
| CK-55 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CK-55.png` | 2 |
| CK-65 | layout | 4/4 | PASS: machine: pass (pass: the cmd's exit code (the CLI); node build/tools/review/green-check.mjs: exit 0); pass (pass: the cm | `build/screenshots/evidence/s19-night-b-a2/CK-65.png` | 4 |
| CK-75 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CK-75.png` | 4 |
| CK-76 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CK-76.png` | 4 |
| CK-77 | layout | 8/8 |  | `build/screenshots/evidence/s19-night-b-a2/CK-77.png` | 8 |
| CK-92 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CK-92.png` | 4 |
| CK-94 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CK-94.png` | 2 |
| CK-95 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CK-95.png` | 2 |
| CK-96 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CK-96.png` | 4 |
| CK-100 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CK-100.png` | 2 |
| CK-101 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CK-101.png` | 2 |
| CK-102 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CK-102.png` | 4 |
| CK-103 | motion | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CK-103.png` | 4 |
| CK-104 | layout | 2/2 |  | `build/screenshots/evidence/s19-night-b-a2/CK-104.png` | 2 |
| CK-105 | layout | 4/4 |  | `build/screenshots/evidence/s19-night-b-a2/CK-105.png` | 4 |

## Tool failures (5): for the tool owner, never a FAIL in regressions.md

- CHAI-96: CHAI-96-p1-L3-740x320: strip:#mission:8x400 at life:request (hit 1): the filmstrip of "#mission" did not change over 8 frames (400 ms apart)
- CHAI-99: CHAI-99-p1-L1-1280x665: the moment "life:next-pan" never came; moments seen: page:start, life:cover, life:order-count, life:order-level, life:poke, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:dish-flash, life:say-start, bubble, cook:click, only:.njg-rq-card, life:say-end, life:order-pass, life:card-fold, life:row-glide, life:pop-face, rec:order-card-big, life:stage-start, life:decoys, life:popup-fold, life:band, life:step-open, life:step-call, life:rung, life:glow, visible:.njg-onboard, life:help, rec:order-card-in-sidebar, cook-done:click, hidden:.njg-onbo
- CHAI-38: CHAI-38-p1-L4-930x430: the moment "results-badges" never came (the flow stopped: flow timed out after 300 s); moments seen: page:start, life:cover, life:order-count, life:order-level, life:poke, rec:start, line:cook, life:say-start, life:say-end, life:ghost, life:request, life:popup-open, life:order-pass, life:card-fold, life:row-glide, talk:nana, life:pop-face, bubble, cook:click, only:.njg-rq-card, rec:order-card-big, talk:cousin, rec:order-card-in-sidebar, cook-done:click, talk:ma, life:row-home, life:stage-start, life:decoys, life:popup-fold, life:band, life:step-open, life:step-call, rec:
- CHAI-49: CHAI-49-p1-L4-930x430: shot at rec:kind-timing (hit 1): no screenshot (page.screenshot: Timeout 10000ms exceeded.)
- CHAI-54: CHAI-54-p1-L4-1280x665: js:Cook.chaiPans at cook-done:click (hit 1): "Cook.chaiPans" is not set on the page at cook-done:click · CHAI-54-p1-L4-1280x665: js:Cook.chaiPans at cook-done:tap (hit 2): "Cook.chaiPans" is not set on the page at cook-done:tap · CHAI-54-p1-L4-1280x665: js:Cook.chaiPans at cook-done:tap (hit 3): "Cook.chaiPans" is not set on the page at cook-done:tap
