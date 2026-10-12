# Evidence run ev-s05b-g5

Commit cc55d71. 3 rows: 0 for a reviewer, 3 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 5 pages. Sheets and text: `build/screenshots/evidence/ev-s05b-g5/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id ev-s05b-g5`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-52 | layout | 3/3 | FAIL: machine: SH-52-p3-L3-1366x768: !textMatches:\s[!?.,]/put in, add it: not (text: "Chickpeas. Put it in! I'd like chaat. p | `build/screenshots/evidence/ev-s05b-g5/SH-52.png` | 2 |
| SEK-12 | text | 1/1 | PASS: machine: textMatches:(?i)\btwo\b (text: "Thread them. I'd like sekelo. two skewers of mixed mishkaki onion mishkaki toma | (text only) | 0 |
| LNG-03 | text | 2/2 | PASS: machine: lexicon (11 words, all in the lexicon); !textMatches:(?i)•/\bboga\b (not (text: "Nindha nindha kap! Chop these  | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
