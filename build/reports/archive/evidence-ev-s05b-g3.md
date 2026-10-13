# Evidence run ev-s05b-g3

Commit cc55d71. 15 rows: 2 for a reviewer, 13 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 30 pages. Sheets and text: `build/screenshots/evidence/ev-s05b-g3/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id ev-s05b-g3`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-13 | text | 3/3 | FAIL: machine: SH-13-p3-L3-1366x768: !hasWord:number: not (number: trae, ba, hakro) | (text only) | 0 |
| SH-52 | layout | 3/3 | FAIL: machine: SH-52-p2-L3-1366x768: !textMatches:mixeds: not (text: "Thread them. I'd like sekelo. two skewers of mixeds mish | `build/screenshots/evidence/ev-s05b-g3/SH-52.png` | 2 |
| SH-69 | layout | 3/3 |  | `build/screenshots/evidence/ev-s05b-g3/SH-69.png` | 1 |
| SH-70 | text | 3/3 | FAIL: machine: SH-70-p1-L1-1366x768: textMatches:^Muke\b.*\b(de/khape)\.?$: text: "Bring me these" | (text only) | 0 |
| SH-56 | text | 3/3 | PASS: machine: !textMatches:(?i)make each pan/^\s*$ (not (text: "Put water in the pan. Put water in the pan. Dudh . Wiji chad! | (text only) | 0 |
| PAN-02 | text | 6/6 | FAIL: machine: PAN-02-p2-L1-1366x768: lexicon: not in the family lexicon: chunda; PAN-02-p2-L3-1366x768: lexicon: not in the f | (text only) | 0 |
| PAN-03 | text | 1/1 | PASS: machine: !textMatches:(?i)^\s*Muke dudh de (not (text: "Bring me these")) | (text only) | 0 |
| CHAI-05 | voice | 2/2 | FAIL: machine: CHAI-05-p1-L2-1366x768: !textMatches:chai[^.]*\bchai\b[^.]*aadu/aadu[,\s]*[.]: not (text: "Muke elchi waari cha | (text only) | 0 |
| MAA-02 | voice | 1/1 | PASS: machine: textMatches:Muke hakri bajr ji maani khape (text: "Muke hakri bajr ji maani khape. millet chapati Firai! Shabas | (text only) | 0 |
| SAM-03 | text | 4/4 | PASS: machine: textMatches:(?i)\bchund[oa]\b/\bbataat[oa]\b (text: "Muke samosa khape. samosa ba bataata"); textMatches:(?i)\b | (text only) | 0 |
| SAM-15 | text | 1/1 | PASS: machine: textMatches:matar (text: "Muke samosa khape. samosa ba chunda hakro matar"); !textMatches:watana (not (text: "M | (text only) | 0 |
| SEK-11 | voice | 1/1 |  | (text only) | 0 |
| SEK-12 | text | 1/1 | PASS: machine: textMatches:(?i)\btwo\b (text: "Thread them. I'd like sekelo. two skewers of mixeds mishkaki onion mishkaki tom | (text only) | 0 |
| CK-22 | text | 3/3 | FAIL: machine: CK-22-p2-L1-1366x768: lexicon: not in the family lexicon: lab | (text only) | 0 |
| LNG-01 | text | 3/3 | FAIL: machine: LNG-01-p2-L1-1366x768: familyOnly: 6 of 6 lines not family-ok: "Bring in chokri" silent; "Salamun alaykum." sil | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
