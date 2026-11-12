# Evidence run s19-clean-a4-zafar

Commit a8968ac60. 3 rows: 1 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 14 pages. Sheets and text: `build/screenshots/evidence/s19-clean-a4-zafar/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s19-clean-a4-zafar`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-213 | motion | 4/4 |  | `build/screenshots/evidence/s19-clean-a4-zafar/SH-213.png` | 4 |
| SH-264 | layout | 2/4 | TOOL FAILURE | (text only) | 2 |
| SH-267 | layout | 6/6 | TOOL FAILURE | (text only) | 6 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-264: SH-264-p1-L3-740x320: the moment "visible:.njg-wo-open .oc-row.njg-wo-bad" never came (the flow stopped: timed out after 282s playing (last expectation "tap", view marble)); moments seen: page:start, life:cover, life:order-count, life:order-level, life:poke, life:ghost, rec:start, life:request, life:popup-open, talk:nana, line:cook, life:say-start, bubble, life:say-end, life:order-pass, life:card-fold, life:row-glide, cook:click, only:.njg-rq-card, life:pop-face, life:rung, life:reveal-lesson, rec:order-card-big, rec:order-card-in-sidebar, cook-done:click, rec:kind-click, only:.wc14-lesson .wc
- SH-267: SH-267-p1-L1-1280x665: crop:.wc14-flash at visible:.wc14-flash (hit 1): ".wc14-flash" is not on screen at visible:.wc14-flash · SH-267-p1-L1-740x320: crop:.wc14-flash at visible:.wc14-flash (hit 1): ".wc14-flash" is not on screen at visible:.wc14-flash
