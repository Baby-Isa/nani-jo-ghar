# Evidence run s15-chai-ev2

Commit e036442. 2 rows: 2 for a reviewer, 0 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 4 pages. Sheets and text: `build/screenshots/evidence/s15-chai-ev2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s15-chai-ev2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-172 | layout | 2/2 |  | `build/screenshots/evidence/s15-chai-ev2/SH-172.png` | 4 |
| SH-165 | detail | 2/2 |  | `build/screenshots/evidence/s15-chai-ev2/SH-165.png` | 4 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none

## EVIDENCE lines from the reviewers (the tool owner's list)

- SH-165: the check is a px measure (side-card speaker's right gap = order card's speaker-to-bottom gap) and the sheet gives no numbers; panel B's #mission crop at 740x320 ends at the ladder dots so the order card's speaker and its bottom gap are not shown at all, and D is an unzoomed thumbnail too small to read a gap against C's zoom2; only chai-tray at L2, 740x320 and 930x430, of the every-station L1-L4 four-size check (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kRLtLPZ2qrL3PyhaaF)
- SH-172: the sheet covers cook:chai-tray L1 only (1280x665, 930x430) while the Check names every Cook station and heal game at L1-L4, and contract-89/36 report 0 breaks "on this page" alone. What it does show: "Khun wiji chad!" starts 10 ms before helper-open at 1280 (24.55/24.56) and 10 ms before at 930 (24.35/24.36); no helper line at step-open 1, 2 or 4. Flaws: A, the open helper card overlaps the hakro khun item card below it and clips its heading; D, the card chevron renders as a broken glyph; C, both item cards show a yellow badge though khun is not yet added. "Chulo bar!" and "Slow kar!" come at step-open 5 and 6 under a control rung, not a helper-open: the probe exempts them, Zafar's words in the row do not. (Fable 5.1 (claude-fable-5-1), session_014xb3kRLtLPZ2qrL3PyhaaF)

