# Evidence run r16pb-fix

Commit be49c8a4c. 23 rows: 8 for a reviewer, 12 decided by the machine, 3 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 41 pages. Sheets and text: `build/screenshots/evidence/r16pb-fix/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id r16pb-fix`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-224 | text | 1/1 | FAIL: machine: SH-224-p1-repo: !pass: not (grep -c fonts.googleapis.com cook.html: exit 0) | (text only) | 0 |
| SH-226 | text | 1/1 | PASS: machine: pass (node build/test_shared_sfx_files.mjs: exit 0) | (text only) | 0 |
| SH-219 | text | 1/1 | FAIL: machine: SH-219-p1-repo: pass: node build/tools/review/pillcheck.mjs: exit 1 | (text only) | 0 |
| SH-151 | text | 1/1 | PASS: machine: pass (node build/lint/static.mjs: exit 0) | (text only) | 0 |
| SH-285 | text | 10/10 | FAIL: machine: SH-285-p1-L1-1280x665: pass: 1 contract breaks; SH-285-p1-L1-740x320: pass: 1 contract breaks | (text only) | 0 |
| SH-290 | text | 4/4 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks); pass (0 contract breaks) | (text only) | 0 |
| SH-305 | text | 6/6 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks); pass (0 contract breaks) | (text only) | 0 |
| SH-308 | layout | 6/6 |  | `build/screenshots/evidence/r16pb-fix/SH-308.png` | 12 |
| SH-310 | detail | 2/2 |  | `build/screenshots/evidence/r16pb-fix/SH-310.png` | 2 |
| DAAR-38 | motion | 2/2 | TOOL FAILURE | (text only) | 1 |
| DAAR-62 | layout | 2/2 |  | `build/screenshots/evidence/r16pb-fix/DAAR-62.png` | 4 |
| SEK-31 | layout | 2/2 |  | `build/screenshots/evidence/r16pb-fix/SEK-31.png` | 4 |
| SEK-32 | layout | 2/2 |  | `build/screenshots/evidence/r16pb-fix/SEK-32.png` | 2 |
| SAM-45 | layout | 2/2 |  | `build/screenshots/evidence/r16pb-fix/SAM-45.png` | 2 |
| CHT-20 | layout | 4/4 |  | `build/screenshots/evidence/r16pb-fix/CHT-20.png` | 6 |
| CK-118 | layout | 2/2 |  | `build/screenshots/evidence/r16pb-fix/CK-118.png` | 4 |
| CK-119 | layout | 4/4 | TOOL FAILURE | (text only) | 4 |
| SH-314 | text | 1/1 | FAIL: machine: SH-314-p1-repo: pass: node build/test_cook_mount.mjs: exit 1 | (text only) | 0 |
| SH-315 | text | 1/1 | PASS: machine: pass (node build/tools/review/loadcheck.mjs --only cook:eggs: exit 0) | (text only) | 0 |
| SH-316 | text | 1/1 | PASS: machine: pass (node build/check_stamps.mjs labs.html: exit 0) | (text only) | 0 |
| SH-221 | text | 1/1 | PASS: machine: pass (node build/test_shared_sfx_calls.mjs: exit 0) | (text only) | 0 |
| SH-261 | text | 8/8 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks); pass (0 contract breaks) | (text only) | 0 |
| CK-91 | layout | 6/6 | TOOL FAILURE | (text only) | 8 |

## Tool failures (3): for the tool owner, never a FAIL in regressions.md

- DAAR-38: DAAR-38-p1-L1-740x320: strip:#stage:4x250 at life:chop-done (hit 1): the filmstrip of "#stage" did not change over 4 frames (250 ms apart)
- CK-119: CK-119-p1-L1-1280x665: crop:.njg-rq-card at only:.njg-rq-card (hit 1): ".njg-rq-card" is not on screen at only:.njg-rq-card · CK-119-p1-L1-740x320: crop:.njg-rq-card at only:.njg-rq-card (hit 1): ".njg-rq-card" is not on screen at only:.njg-rq-card
- CK-91: CK-91-p2-L1-1280x665: crop:#game at life:dish-flash (hit 1): the crop of "#game" is one flat colour (covered or blank) · CK-91-p2-L1-740x320: crop:#game at life:dish-flash (hit 1): the crop of "#game" is one flat colour (covered or blank)
