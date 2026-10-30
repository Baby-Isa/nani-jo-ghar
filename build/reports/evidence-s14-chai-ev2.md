# Evidence run s14-chai-ev2

Commit 682e5a89. 3 rows: 3 for a reviewer, 0 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 8 pages. Sheets and text: `build/screenshots/evidence/s14-chai-ev2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s14-chai-ev2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-161 | layout | 2/2 |  | `build/screenshots/evidence/s14-chai-ev2/SH-161.png` | 2 |
| CHAI-45 | layout | 4/4 |  | `build/screenshots/evidence/s14-chai-ev2/CHAI-45.png` | 4 |
| CHAI-47 | layout | 2/2 |  | `build/screenshots/evidence/s14-chai-ev2/CHAI-47.png` | 2 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none

## EVIDENCE lines from the reviewers (the tool owner's list)

- CHAI-45: the sheet has one still per size at stage-start, not a filmed load or frame strip, so a jump in zoom or layout after the first frame can neither be seen nor ruled out; also only Nana is drawn at the counter in B and C while A and D show an empty counter at the same moment, which is itself the kind of change the row is about and is not explained. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- CHAI-47: the tray is drawn about 85 px wide in B (930x430) and smaller in A (1920x1080), face circles a few pixels across, no crop of the tray, so whether the lit box's edge crosses a face circle cannot be read; the Check names four sizes and the sheet has two. Flaw off the point: B the order panel's third word card is clipped at the panel's right edge. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)

