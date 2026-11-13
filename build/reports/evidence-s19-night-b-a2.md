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

## EVIDENCE lines from the reviewers (the tool owner's list)

- PAN-21: no count pill (tally, #count-badge) appears in any frame of A-H at L1-L4, on a shelf or in the bottom right corner, so the sheet shows neither the fault nor the fix; only two of the four sizes shot. Flaws seen off the point: the long-word pills (lasl marcha and two others) shrink to unreadable text in C, D, F, G, H; E frame 5 and F frame 5 catch the choice card half-faded over the shelves. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder s19-night-b))
- CHAI-36: the sheet has only L1 at 1920x1080 and 930x430, four stills; the Check names L1-L4 at 971x318 and 1280x665 and "no dim frame without a lit target", which four stills at other sizes cannot show. What is there is clean: A and B dim with the knob lit at "Chulo bar!", C and D dim with the knob lit at "Slow kar!" once the ring is full. Flaw off the point: the order card's item tiles are cut at the card's left edge ("ai", half a speaker) in A-D. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder s19-night-b))
- CHAI-56: every probe is a new player [p-fresh]; no panel shows a returning player hearing "Chulo bar!" with nothing lit, nor the knob lighting after the wait, and L2 and L4 are missing. For the new player A-D do show the knob lit at "Chulo bar!" (B frame 5, D frame 6). Also: B hit 1 has no screenshot (timeout); in D the second order card and the tiles at the card's edges are cut ("ani", "du"); A frame 7 Nani's line is almost invisible. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder s19-night-b))
- CK-55: both panels are cook:corn's play screens (grill, plate, chutneys); the shop/title screen with the "?" (#gu-btn) and the cog (#side-cog) at 740x320 is not on the sheet at all (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder s19-night-b))
- CK-77: B, D, F, H show the lit carton's gold box and "indo" pill whole above the frame's bottom at all four sizes, but no chai shelf item is on the sheet to judge "chai's size and place"; the carton is still about 0.4 of a pan's width and left of centre on the shelf (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder s19-night-b))
- CHAI-98: neither strip shows the word moment's falling drop or its splash. A (1280x665) and B (740x320) show only the kettle pouring a stream into two glasses at the counter (frames 0-5005 ms and 0-5495 ms, every frame after the first marked "off" its slot); no drop is on screen in any frame, so its size cannot be read. Also only two of the Check's four sizes were shot (930x430 and 1920x1080 missing). (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (independent judge, not s19-night-b))
- CK-103: no panel shows a dressing flying to the cob or the cob after one lands. A is the raw-cob tray with NO MOTION CAPTURED; B and C are the cob on the coals (C: it chars); D is the cooked cob moving from the tray to the plate with the six dressing bowls (limu, loon, laal marcha, fudino ji chutney, amli ji chutney, mari) untouched and the cob still undressed in its last frame (2895 ms). The pepper's flight and the dressed cob are never on screen; every frame after the first is marked "off" its slot. Only L1 at 1280x665 is on the sheets: the 19 other strips (L1 740x320, L2 both sizes) are not shown, and L3 and L4 were not probed at all. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (independent judge, not s19-night-b))
- CK-59: neither voice capture shows a second person ordering. CK-59-p1-L2-1280x665 voice and CK-59-p1-L2-740x320 voice each show one order only (card-fold nana: "Muke elchi waari chai khape," / "dudh," once at 60.97 and 106.16 / "trae khun." or "ba khun."), then a tap skips the order (order-skip at 66.31 and 111.00) and the station starts; the second person's "dudh" is never in the shown lines (406 and 447 later lines left out). The probe's note "both say it (two say-starts)" has no expect result printed and the say-starts shown (2 and 3) are "dudh," and "khun" of the same person, not two people's "dudh". The Check also asks for every Cook game with two people ordering at L1, L2, L3 and L4; only chai-tray at L2 is captured, and no contract-check output is in the file. Needed: the timeline through the second person's card with both "dudh," say-starts and who speaks each, plus the contract check's result for each game and level. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (independent judge, not s19-night-b))

