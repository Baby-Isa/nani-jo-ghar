# Evidence run s19ns-ev1

Commit 451402438. 4 rows: 4 for a reviewer, 0 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 18 pages. Sheets and text: `build/screenshots/evidence/s19ns-ev1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s19ns-ev1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-272 | layout | 6/6 |  | `build/screenshots/evidence/s19ns-ev1/SH-272.png` | 6 |
| SH-274 | layout | 4/4 |  | `build/screenshots/evidence/s19ns-ev1/SH-274.png` | 4 |
| SH-278 | layout | 6/6 |  | `build/screenshots/evidence/s19ns-ev1/SH-278.png` | 6 |
| CHAI-113 | voice | 8/8 |  | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none

## EVIDENCE lines from the reviewers (the tool owner's list)

- SH-272: both sheets (SH-272.png, SH-272-2.png) are blank white images reading only "not found"; no panel A-F shows an end panel or Nani at either size. The .md's contract-127 "0 breaks" lines are a code check, not a picture of her head under the panel, so they cannot stand in for the panels. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder))
- SH-274: the sheet (SH-274.png) is a blank white image reading only "not found"; no panel A-D shows the dish card at dish-flash in maani or eggs. The .md's contract-125 "0 breaks" lines do not show one card on screen. The sheet also names no probe for corn (card cut by the top edge) or chaat (card staying over the chop screen), both named in the row. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder))
- SH-278: both sheets (SH-278.png, SH-278-2.png) are blank white images reading only "not found"; no panel A-F shows Nani's box at "Shabash!". The .md also lists 6 probes left off the sheet (samosa 740, maani at both sizes), and no probe names the "Bas!" state for baking or maani. The contract-126 "0 breaks" lines do not show the box. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (judge subagent, not the builder))
- CHAI-113: the voice captures are cut to their tails (115 to 561 earlier lines left out per probe), so the knob turned on from off while Nani counts is not in the text for L2, L3, L4 at either size (no on-from-off tap, no sfx/knob start, no sfx/flame start, no Nani line over them); L1 shows only the tail end (L1-740x320 voice: sfx/knob stops 57.69 and sfx/flame stops 57.70 before say-end (9) at 60.09; L1-1280x665 voice: sfx/flame stops 45.71 before say-end (7) at 46.42) with the tap, both sfx starts and the family line cut off; the .md has no expect result lines for the "every knob turned on from off answers" probe, only contract-124: 0 breaks. Needs the capture windowed on each knob-on tap (tap, sfx/knob starts, sfx/flame starts, the cook line spanning them) or the expect results printed, at all 8 probes. Off the row's point, seen in what is shown: the turn-down tap during "Slow kar!" logs sfx/knob in 3 probes (L1-1280x665 49.31, L2-740x320 172.76, L3-740x320 154.24) and no sfx/knob in 5 (L1-740x320 66.29, L2-1280x665 83.36, L3-1280x665 96.71, L4-1280x665 85.30, L4-740x320 126.80), so a knob tap under Nani's voice is still silent there. (claude-fable-5-2, session_014xb3kSEqyUTbvHCABDzeLo (independent judge, not the builder))

