# Evidence run s15-chai-ev4

Commit dd20952. 6 rows: 4 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 15 pages. Sheets and text: `build/screenshots/evidence/s15-chai-ev4/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s15-chai-ev4`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-171 | motion | 3/3 |  | `build/screenshots/evidence/s15-chai-ev4/SH-171.png` | 3 |
| SH-172 | layout | 2/2 | TOOL FAILURE | (text only) | 4 |
| SH-165 | detail | 3/3 |  | `build/screenshots/evidence/s15-chai-ev4/SH-165.png` | 4 |
| SH-163 | motion | 5/5 |  | `build/screenshots/evidence/s15-chai-ev4/SH-163.png` | 5 |
| CHAI-50 | text | 2/2 |  | `build/screenshots/evidence/s15-chai-ev4/CHAI-50.png` | 1 |
| CHAI-40 | voice | 2/2 | TOOL FAILURE | (text only) | 0 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-172: spec: SH-172 probe 2: at "life:helper-open": no driver of cook:chai-tray@L3#hint reaches it (add it to the driver and lib/moments.mjs first)
- CHAI-40: spec: CHAI-40 probe 3: at "life:helper-open": no driver of cook:chai-tray@L3#hint reaches it (add it to the driver and lib/moments.mjs first) · spec: CHAI-40 probe 4: at "life:helper-open": no driver of cook:chai-tray@L4#hint reaches it (add it to the driver and lib/moments.mjs first)

## EVIDENCE lines from the reviewers (the tool owner's list)

- SH-165: the Check is an auto px measure (helper-card speaker right gap = item-card speaker-to-foot gap, every station, L1-L4, four sizes) and the sheet gives none of it: the .md has no measured gaps or expect results; A (helper card) and B (order rows) are fitted to their panels at different scales so the two gaps cannot be compared by eye; D's crop ends above the item cards' speakers so the 740x320 foot gap is not visible at all; 930x430 was captured but left off the sheet, 1920x1080 (the stacked, centred case) was not captured, and only chai-tray at L2 is shown. What is visible is not wrong: in A and C the helper side card's speaker sits at the card's right with a small gap and nothing clips; "Put water in the pan." is grey-italic to-record English (allowed, decision 84); "water" under "paani" is on the helper card (allowed). The cut-off labels at the foot of B's second row and the half card at D's right edge are crop/scroller edges, not UI flaws. (Claude Fable 5.1, session_014xb3kRLtLPZ2qrL3PyhaaF)
- CHAI-50: the Check names chai at L1, L2, L3 and L4 filmed; the sheet has one L1 still (A, 1280x665, the cooker step: one gold ring on the dial, no dim, consistent with the fix) and one L1 log at 930x430 speed 2 (lights 0 at 29.8 s and 39.0 s after the dial steps, never two up); nothing at L2, L3 or L4, and no frame at the glass-choosing moment after the cooker is off, which is the moment Zafar's words name. Flaws in A: none that block (the helper card's left card is cut by the card's edge as a scroll, the English under dudh/hakro khun is the helper card, allowed). (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kRLtLPZ2qrL3PyhaaF)

