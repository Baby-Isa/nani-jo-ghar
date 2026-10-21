# Evidence run sweep-after

Commit d7202686. 12 rows: 8 for a reviewer, 3 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 24 pages. Sheets and text: `build/screenshots/evidence/sweep-after/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id sweep-after`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-13 | text | 3/3 | PASS: machine: hasWord:number (number: trae); hasWord:number (number: ba); hasWord:number (number: trae, ba) | (text only) | 0 |
| SH-37 | layout | 1/1 |  | `build/screenshots/evidence/sweep-after/SH-37.png` | 1 |
| PAN-04 | voice | 3/3 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks); pass (0 contract breaks) | (text only) | 0 |
| CHAI-19 | layout | 2/2 |  | `build/screenshots/evidence/sweep-after/CHAI-19.png` | 2 |
| CHAI-02 | layout | 2/2 |  | `build/screenshots/evidence/sweep-after/CHAI-02.png` | 2 |
| DAAR-30 | motion | 4/4 |  | `build/screenshots/evidence/sweep-after/DAAR-30.png` | 3 |
| SAM-22 | detail | 8/8 |  | `build/screenshots/evidence/sweep-after/SAM-22.png` | 8 |
| CK-27 | motion | 4/4 |  | `build/screenshots/evidence/sweep-after/CK-27.png` | 4 |
| CK-21 | detail | 2/2 |  | `build/screenshots/evidence/sweep-after/CK-21.png` | 2 |
| LNG-09 | text | 1/1 | TOOL FAILURE | (text only) | 0 |
| LNG-03 | text | 2/2 | PASS: machine: lexicon (11 words, all in the lexicon); !textMatches:(?i)\bboga\b (not (text: "Nindha nindha kap ! trae dungri  | (text only) | 0 |
| SH-56 | text | 3/3 |  | (text only) | 0 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- LNG-09: spec: LNG-09 probe 2: cmd "grep -rn "u.rate = 0\.[0-7]\b" js/cook || echo none-slow": "|" is not allowed (no shell)
