# Evidence run s15-chai-ev

Commit e036442. 6 rows: 4 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 14 pages. Sheets and text: `build/screenshots/evidence/s15-chai-ev/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s15-chai-ev`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-171 | motion | 3/3 |  | `build/screenshots/evidence/s15-chai-ev/SH-171.png` | 3 |
| SH-172 | layout | 0/2 | TOOL FAILURE | (text only) | 0 |
| SH-165 | detail | 0/2 | TOOL FAILURE | (text only) | 0 |
| SH-163 | motion | 3/3 |  | `build/screenshots/evidence/s15-chai-ev/SH-163.png` | 3 |
| CHAI-50 | layout | 2/2 |  | `build/screenshots/evidence/s15-chai-ev/CHAI-50.png` | 2 |
| CHAI-40 | layout | 3/3 |  | `build/screenshots/evidence/s15-chai-ev/CHAI-40.png` | 3 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-172: SH-172-p1-L1-1280x665: the moment "help-open" never came; moments seen: page:start, life:order-count, life:order-level, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, cook:click, only:.njg-rq-card, bubble, life:say-end, life:pop-face, life:row-glide, rec:order-card-big, life:skip-zone, life:stage-start, life:decoys, life:step-open, life:step-call, life:rung, life:glow, life:row-home, life:order-skip, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:kind-tap, cook:tap, exp:cook-paani, cook-done:tap, l
- SH-165: SH-165-p1-L2-740x320: the moment "help-open" never came; moments seen: page:start, life:order-count, life:order-level, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, cook:click, only:.njg-rq-card, bubble, life:say-end, life:pop-face, life:row-glide, rec:order-card-big, life:skip-zone, life:stage-start, life:decoys, life:row-home, life:order-skip, life:popup-fold, life:step-open, life:step-call, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, life:help, life:rung, life:helper-open, life:glow, rec:hint-nani-says, rec:hint

## EVIDENCE lines from the reviewers (the tool owner's list)

- CHAI-50: the check asks for a film across L1-L4 (dim layers and lit boxes counted at every moment, none left after the cooker step); the sheet is two L1 stills at one moment (the "hakro" knob step, cooker still on, one gold ring lit) with no frames through the knob step, none at the tea-glass pick, no L2-L4 and no dim/box count in the .md (only "contract-87: 0 breaks", unexplained) · flaws noted: A and B show a done card cut off at the left edge of the helper row; B puts the "hakro" bubble hard against the floating "khun" label (Claude Fable 5.1 (claude-fable-5-1), session session_014xb3kRLtLPZ2qrL3PyhaaF)
- CHAI-40: the check is a timing one (no item call before the helper's card opens) but the .md has no voice timeline and no call-vs-card-open times; the three stills (A, B at L1; C at L4) show the card already open and say nothing about when each call was spoken; "contract-78: 0 breaks" is not named as SH-172's check and states no times · flaws noted: C (L4 930x430) cuts the second Nani card and its first item card at the bottom of the helper panel; "Slow kar!" is shown as plain text, so if "slow" is not a loan:en in the engine it is an English leak (Claude Fable 5.1 (claude-fable-5-1), session session_014xb3kRLtLPZ2qrL3PyhaaF)

