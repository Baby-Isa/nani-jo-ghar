# Evidence run ev-s07

Commit 61af63b4. 25 rows: 18 for a reviewer, 5 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 2 with no spec. 36 pages. Sheets and text: `build/screenshots/evidence/ev-s07/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id ev-s07`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-37 | layout | 1/1 |  | `build/screenshots/evidence/ev-s07/SH-37.png` | 1 |
| SH-92 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |
| DAAR-05 | detail | 2/2 |  | `build/screenshots/evidence/ev-s07/DAAR-05.png` | 3 |
| CK-06 | detail | 2/2 |  | `build/screenshots/evidence/ev-s07/CK-06.png` | 2 |
| CK-44 | layout | 3/3 |  | `build/screenshots/evidence/ev-s07/CK-44.png` | 3 |
| CK-45 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |
| CLN-01 | layout | 1/1 |  | `build/screenshots/evidence/ev-s07/CLN-01.png` | 1 |
| CLN-81 | detail | 2/2 |  | `build/screenshots/evidence/ev-s07/CLN-81.png` | 2 |
| CLN-17 | layout | 1/1 |  | `build/screenshots/evidence/ev-s07/CLN-17.png` | 1 |
| CLN-25 | layout | 1/1 |  | `build/screenshots/evidence/ev-s07/CLN-25.png` | 1 |
| CLN-136 | layout | 2/2 |  | `build/screenshots/evidence/ev-s07/CLN-136.png` | 3 |
| CLN-150 | layout | 3/3 |  | `build/screenshots/evidence/ev-s07/CLN-150.png` | 3 |
| ART-10 | detail | 2/2 |  | `build/screenshots/evidence/ev-s07/ART-10.png` | 2 |
| ART-11 | detail | 1/1 |  | `build/screenshots/evidence/ev-s07/ART-11.png` | 1 |
| ART-21 | layout | 1/1 |  | `build/screenshots/evidence/ev-s07/ART-21.png` | 1 |
| CK-21 | detail | 2/2 |  | `build/screenshots/evidence/ev-s07/CK-21.png` | 2 |
| CLN-04 | text | 5/5 | PASS: machine: lexicon (1 words, all in the lexicon); !textMatches:… (not (text: "chokri")); lexicon (1 words, all in the lexi | (text only) | 0 |
| CLN-11 | layout | 1/1 | PASS: machine: count:.cl-wp>=1 (4 visible); count:.cl-wp<=6 (4 visible) | `build/screenshots/evidence/ev-s07/CLN-11.png` | 2 |
| CLN-12 | detail | 5/5 | PASS: machine: count:.cl-wp.risen=1 (1 visible); lastsMs:.cl-wp.risen>=800 (on screen 13728 ms (still at the end)); count:.cl- | `build/screenshots/evidence/ev-s07/CLN-12.png` | 5 |
| CLN-13 | layout | 2/2 | PASS: machine: count:.cl-seat-who<=6 (0 visible); count:.cl-seat-who<=6 (0 visible) | `build/screenshots/evidence/ev-s07/CLN-13.png` | 4 |
| CLN-90 | detail | 2/2 |  | `build/screenshots/evidence/ev-s07/CLN-90.png` | 2 |
| CLN-19 | layout | 1/1 |  | `build/screenshots/evidence/ev-s07/CLN-19.png` | 2 |
| CLN-23 | detail | 1/1 |  | `build/screenshots/evidence/ev-s07/CLN-23.png` | 1 |
| CLN-97 | detail | 1/1 |  | `build/screenshots/evidence/ev-s07/CLN-97.png` | 1 |
| ART-13 | layout | 1/1 | PASS: machine: pass (0 contract breaks) | `build/screenshots/evidence/ev-s07/ART-13.png` | 1 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-92: no evidence spec for this row (build/sandbox/data/evidence.json)
- CK-45: no evidence spec for this row (build/sandbox/data/evidence.json)

## No spec (2)

SH-92, CK-45

## EVIDENCE lines from the reviewers (the tool owner's list)

- CLN-81: A frames 1 (waiting) and 2 (diagnosis) crop only the doctor (and a boy in frame 1), so the girl is not in shot in those stages; only frame 5 (send-off) shows her finished art; B shows the results badges (timer, tick, bulb), not the sticker or card faces; pharmacy and heal were not captured (Claude Opus 5.5 (claude-opus-5-5), session_01W85EF4CUVUYMaoJk4JskAU)
- CLN-97: A shows the swabs, spoon, stethoscope and a red item cut off at the right edge; there is no green bottle and no jug on the belt, and the red plaster is not shown whole. Flaw off the point: the swabs (left) and the stethoscope tubing rise above the belt's back rail and read as tilted (Claude Opus 5.5 (claude-opus-5-5), session_01W85EF4CUVUYMaoJk4JskAU)
- CLN-150: no heal panel; the sheet shows waiting, diagnosis and send-off, but the Check names heal and the heal card is one of the pictures the row names (A-C do show the same bald, bearded, glasses doctor standing and in the box) (claude-opus-5-5 (Claude Code judge subagent, session_01W85EF4CUVUYMaoJk4JskAU))

