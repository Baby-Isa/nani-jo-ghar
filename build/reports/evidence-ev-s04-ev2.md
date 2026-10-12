# Evidence run ev-s04-ev2

Commit 804b21c1. 175 rows: 99 for a reviewer, 39 decided by the machine, 34 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 237 pages. Sheets and text: `build/screenshots/evidence/ev-s04-ev2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id ev-s04-ev2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-01 | detail | 4/4 | FAIL: machine: SH-01-p1-L4-800x360: lines:.rs-word<=2: lines 4; SH-01-p1-L4-844x390: lines:.rs-word<=2: lines 4 | `build/screenshots/evidence/ev-s04-ev2/SH-01.png` | 4 |
| SH-61 | detail | 2/2 | TOOL FAILURE | (text only) | 1 |
| SH-15 | layout | 1/1 | FAIL: machine: SH-15-p1-L1-1366x768: countsUp:#count-badge: read 1, 2, 3, 3, 3, 3, 3 | `build/screenshots/evidence/ev-s04-ev2/SH-15.png` | 1 |
| SH-17 | motion | 3/3 | TOOL FAILURE | (text only) | 2 |
| SH-52 | layout | 3/3 | FAIL: machine: SH-52-p1-L3-1366x768: textMatches:(?i)\b(two/one/three/four)\b: text: "Take a dough ball. Muke maani khape. ba  | `build/screenshots/evidence/ev-s04-ev2/SH-52.png` | 2 |
| SH-53 | layout | 3/3 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks); pass (0 contract breaks) | `build/screenshots/evidence/ev-s04-ev2/SH-53.png` | 3 |
| SH-69 | layout | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/SH-69.png` | 1 |
| SH-18 | layout | 2/2 | PASS: machine: count:.oc-card=1 (1 visible); count:#btn-bulb<=1 (0 visible); count:.oc-card=1 (1 visible) | `build/screenshots/evidence/ev-s04-ev2/SH-18.png` | 2 |
| SH-21 | layout | 2/2 | PASS: machine: count:.ob-skip=0 (0 visible); count:.ob-skip=0 (0 visible) | `build/screenshots/evidence/ev-s04-ev2/SH-21.png` | 3 |
| SH-22 | layout | 2/3 | TOOL FAILURE | (text only) | 4 |
| SH-56 | text | 3/3 | PASS: machine: !textMatches:(?i)make each pan/^\s*$ (not (text: "Put water in the pan. Dudh . Wiji chad! Dudh . Wiji chad! Khu | (text only) | 0 |
| SH-57 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/SH-57.png` | 2 |
| SH-58 | motion | 2/2 | TOOL FAILURE | (text only) | 1 |
| SH-59 | motion | 1/1 | PASS: machine: traceAmp:#btn-help<=1 (amp 0, 0, 0, 0) | `build/screenshots/evidence/ev-s04-ev2/SH-59.png` | 3 |
| SH-60 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/SH-60.png` | 1 |
| SH-63 | text | 2/2 |  | (text only) | 0 |
| SH-67 | motion | 2/2 | TOOL FAILURE | (text only) | 1 |
| SH-68 | layout | 3/3 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks); pass (0 contract breaks) | `build/screenshots/evidence/ev-s04-ev2/SH-68.png` | 3 |
| SH-23 | detail | 2/4 | TOOL FAILURE | (text only) | 2 |
| SH-28 | detail | 2/2 | PASS: machine: minFont:.chips>=14 (minFont 18); minFont:.chips>=14 (minFont 18) | `build/screenshots/evidence/ev-s04-ev2/SH-28.png` | 2 |
| SH-34 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/SH-34.png` | 3 |
| SH-39 | layout | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/SH-39.png` | 3 |
| SH-41 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/SH-41.png` | 1 |
| SH-46 | layout | 1/1 | PASS: machine: times:life:ghost>=1 (life:ghost came 4 times) | `build/screenshots/evidence/ev-s04-ev2/SH-46.png` | 2 |
| SH-47 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/SH-47.png` | 2 |
| PAN-01 | detail | 2/3 | TOOL FAILURE | (text only) | 2 |
| PAN-02 | text | 6/6 | FAIL: machine: PAN-02-p2-L1-1366x768: lexicon: not in the family lexicon: chunda; PAN-02-p2-L3-1366x768: lexicon: not in the f | (text only) | 0 |
| PAN-07 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/PAN-07.png` | 4 |
| PAN-09 | detail | 4/4 |  | `build/screenshots/evidence/ev-s04-ev2/PAN-09.png` | 4 |
| PAN-13 | text | 2/2 |  | (text only) | 0 |
| CHAI-02 | layout | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-02.png` | 2 |
| CHAI-03 | motion | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-03.png` | 1 |
| CHAI-04 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-04.png` | 1 |
| CHAI-05 | text | 2/2 | FAIL: machine: CHAI-05-p1-L2-1366x768: !textMatches:chai.*chai.*aadu/aadu\W*$: not (text: "Muke elchi waari chai khape. elchi  | (text only) | 0 |
| CHAI-06 | detail | 1/1 | FAIL: machine: CHAI-06-p1-L1-1366x768: pass: pass: the cmd's exit code (the CLI); python3 build/check_vessel_meta.py: exit 1 | `build/screenshots/evidence/ev-s04-ev2/CHAI-06.png` | 1 |
| CHAI-07 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-07.png` | 2 |
| CHAI-08 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-08.png` | 1 |
| CHAI-09 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-09.png` | 2 |
| CHAI-10 | layout | 3/3 | PASS: machine: gapMs:exp:knob-on,cook:timing<=16000 (exp:knob-on -> cook:timing: 4077 ms); gapMs:exp:knob-on,cook:timing<=1600 | `build/screenshots/evidence/ev-s04-ev2/CHAI-10.png` | 4 |
| CHAI-12 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-12.png` | 1 |
| CHAI-13 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-13.png` | 1 |
| CHAI-14 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-14.png` | 2 |
| CHAI-15 | motion | 1/1 | TOOL FAILURE | (text only) | 1 |
| CHAI-17 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-17.png` | 2 |
| CHAI-18 | detail | 4/4 |  | `build/screenshots/evidence/ev-s04-ev2/CHAI-18.png` | 4 |
| MAA-01 | text | 1/1 | PASS: machine: !textMatches:(?i)hakri maani[\s\S]*hakri maani (not (text: "Muke maani khape. hakri maani")) | (text only) | 0 |
| MAA-03 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/MAA-03.png` | 1 |
| MAA-04 | motion | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/MAA-04.png` | 2 |
| MAA-08 | detail | 4/4 | TOOL FAILURE | (text only) | 4 |
| MAA-09 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/MAA-09.png` | 1 |
| MAA-10 | detail | 1/1 | FAIL: machine: MAA-10-p1-L4-1366x768: pass: pass: the cmd's exit code (the CLI); python3 build/check_vessel_meta.py: exit 1 | `build/screenshots/evidence/ev-s04-ev2/MAA-10.png` | 1 |
| MAA-12 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/MAA-12.png` | 1 |
| MAA-13 | layout | 1/1 | PASS: machine: times:life:ghost>=2 (life:ghost came 4 times) | `build/screenshots/evidence/ev-s04-ev2/MAA-13.png` | 2 |
| DAAR-05 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/DAAR-05.png` | 2 |
| DAAR-06 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/DAAR-06.png` | 1 |
| DAAR-12 | detail | 3/4 | TOOL FAILURE | (text only) | 3 |
| DAAR-14 | detail | 1/1 | TOOL FAILURE | (text only) | 0 |
| DAAR-16 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/DAAR-16.png` | 1 |
| CHT-01 | text | 1/1 | PASS: machine: textMatches:ba dungri (text: "Muke chaat khape. ba bataata chana ba dungri") | (text only) | 0 |
| CHT-02 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CHT-02.png` | 2 |
| CHT-03 | detail | 2/2 | TOOL FAILURE | (text only) | 1 |
| CHT-04 | layout | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CHT-04.png` | 3 |
| CHT-06 | layout | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/CHT-06.png` | 3 |
| CHT-07 | text | 1/1 |  | (text only) | 0 |
| CHT-11 | detail | 1/1 | TOOL FAILURE | (text only) | 0 |
| SAM-01 | text | 0/1 | TOOL FAILURE | (text only) | 0 |
| SAM-02 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/SAM-02.png` | 2 |
| SAM-04 | layout | 4/4 | TOOL FAILURE | (text only) | 4 |
| SAM-05 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/SAM-05.png` | 1 |
| SAM-06 | layout | 0/1 | TOOL FAILURE | (text only) | 0 |
| SAM-08 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/SAM-08.png` | 2 |
| SAM-09 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/SAM-09.png` | 1 |
| SAM-10 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/SAM-10.png` | 2 |
| SAM-11 | detail | 2/3 | TOOL FAILURE | (text only) | 2 |
| SAM-14 | detail | 1/1 | PASS: machine: inside:canvas:sv2-fry,canvas:sv3-karahi (2 inside) | `build/screenshots/evidence/ev-s04-ev2/SAM-14.png` | 1 |
| SAM-15 | text | 0/1 | TOOL FAILURE | (text only) | 0 |
| SEK-03 | detail | 4/4 |  | `build/screenshots/evidence/ev-s04-ev2/SEK-03.png` | 4 |
| SEK-06 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/SEK-06.png` | 1 |
| SEK-07 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/SEK-07.png` | 2 |
| SEK-08 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/SEK-08.png` | 1 |
| SEK-11 | voice | 1/1 |  | (text only) | 0 |
| SEK-12 | text | 1/1 | FAIL: machine: SEK-12-p1-L3-1366x768: textMatches:(?i)\btwo\b: text: "Thread them. Muke sekelo khape. ba lakri mixed mishkaki  | (text only) | 0 |
| SEK-13 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/SEK-13.png` | 1 |
| CK-02 | detail | 2/2 | FAIL: machine: CK-02-p1-L1-1366x768: pass: pass: the cmd's exit code (the CLI); python3 build/check_vessel_meta.py: exit 1; CK | `build/screenshots/evidence/ev-s04-ev2/CK-02.png` | 2 |
| CK-04 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CK-04.png` | 1 |
| CK-06 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CK-06.png` | 2 |
| CK-07 | layout | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CK-07.png` | 2 |
| CK-08 | motion | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CK-08.png` | 1 |
| CK-09 | detail | 2/2 | TOOL FAILURE | (text only) | 2 |
| CK-12 | detail | 1/1 | FAIL: machine: CK-12-p1-L1-1366x768: pass: pass: the cmd's exit code (the CLI); python3 build/check_vessel_meta.py: exit 1 | `build/screenshots/evidence/ev-s04-ev2/CK-12.png` | 1 |
| CK-13 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CK-13.png` | 1 |
| CK-21 | layout | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CK-21.png` | 3 |
| CK-27 | motion | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/CK-27.png` | 4 |
| CLN-01 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-01.png` | 1 |
| CLN-02 | layout | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-02.png` | 2 |
| CLN-03 | layout | 4/4 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-03.png` | 4 |
| CLN-04 | text | 5/5 | TOOL FAILURE | (text only) | 0 |
| CLN-05 | detail | 1/1 | PASS: machine: count:#nani-card=0 (0 visible (5 moments)) | `build/screenshots/evidence/ev-s04-ev2/CLN-05.png` | 1 |
| CLN-06 | layout | 1/1 | PASS: machine: pass (0 contract breaks); count:.cl-pill=0 (0 visible (5 moments)) | `build/screenshots/evidence/ev-s04-ev2/CLN-06.png` | 1 |
| CLN-08 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-08.png` | 1 |
| CLN-09 | detail | 2/2 | PASS: machine: pass (pass: the cmd's exit code (the CLI); python3 build/check_hotspots.py: exit 0); pass (pass: the cmd's exit | `build/screenshots/evidence/ev-s04-ev2/CLN-09.png` | 2 |
| CLN-81 | detail | 2/2 | TOOL FAILURE | (text only) | 1 |
| CLN-84 | motion | 5/5 | TOOL FAILURE | (text only) | 1 |
| CLN-85 | layout | 2/2 | TOOL FAILURE | (text only) | 1 |
| CLN-86 | layout | 2/2 | TOOL FAILURE | (text only) | 1 |
| CLN-111 | layout | 2/2 | FAIL: machine: CLN-111-p1-L1-1366x768: count:.rs-again=1: 0 visible; CLN-111-p1-L1-1366x768: count:.rs-actions button>=3: 1 vi | `build/screenshots/evidence/ev-s04-ev2/CLN-111.png` | 3 |
| CLN-113 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-113.png` | 2 |
| CLN-114 | detail | 1/1 | PASS: machine: pass (0 contract breaks) | `build/screenshots/evidence/ev-s04-ev2/CLN-114.png` | 1 |
| CLN-10 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-10.png` | 1 |
| CLN-11 | layout | 1/1 | FAIL: machine: CLN-11-p1-L1-1366x768: count:.cl-seat=6: 0 visible | `build/screenshots/evidence/ev-s04-ev2/CLN-11.png` | 2 |
| CLN-13 | layout | 2/2 | PASS: machine: count:.cl-seat-who<=6 (0 visible); count:.cl-seat-who<=6 (0 visible) | `build/screenshots/evidence/ev-s04-ev2/CLN-13.png` | 4 |
| CLN-14 | text | 2/2 |  | (text only) | 0 |
| CLN-15 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-15.png` | 2 |
| CLN-90 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-90.png` | 2 |
| CLN-91 | detail | 1/1 | PASS: machine: count:.cl-side .ng-bulb=1 (1 visible); count:.cl-hint-n=0 (0 visible) | `build/screenshots/evidence/ev-s04-ev2/CLN-91.png` | 1 |
| CLN-110 | voice | 3/3 | PASS: machine: pass (0 contract breaks); count:.njg-done=0 (0 visible); pass (0 contract breaks) | (text only) | 0 |
| CLN-17 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-17.png` | 1 |
| CLN-18 | detail | 1/1 | PASS: machine: count:.cl-kit-tool>=2 (4 visible) | `build/screenshots/evidence/ev-s04-ev2/CLN-18.png` | 1 |
| CLN-93 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-93.png` | 1 |
| CLN-94 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-94.png` | 4 |
| CLN-95 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-95.png` | 1 |
| CLN-116 | detail | 2/2 | TOOL FAILURE | (text only) | 2 |
| CLN-21 | text | 1/1 | PASS: machine: !textMatches:(?i)muke plaster khape (not (text: "Bring me plaster")) | (text only) | 0 |
| CLN-22 | motion | 4/4 | TOOL FAILURE | (text only) | 4 |
| CLN-25 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-25.png` | 1 |
| CLN-26 | layout | 5/5 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-26.png` | 3 |
| CLN-28 | text | 2/2 |  | (text only) | 0 |
| CLN-98 | layout | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-98.png` | 3 |
| CLN-117 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-117.png` | 2 |
| CLN-30 | layout | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-30.png` | 2 |
| CLN-34 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-34.png` | 4 |
| CLN-37 | detail | 5/5 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-37.png` | 4 |
| CLN-38 | text | 3/3 |  | (text only) | 0 |
| CLN-42 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-42.png` | 2 |
| CLN-45 | text | 6/6 |  | (text only) | 0 |
| CLN-46 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-46.png` | 4 |
| CLN-53 | detail | 6/6 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-53.png` | 4 |
| CLN-54 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-54.png` | 2 |
| CLN-56 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-56.png` | 1 |
| CLN-57 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-57.png` | 1 |
| CLN-62 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-62.png` | 3 |
| CLN-65 | motion | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-65.png` | 4 |
| CLN-67 | detail | 1/1 | TOOL FAILURE | (text only) | 1 |
| CLN-76 | text | 5/6 | TOOL FAILURE | (text only) | 0 |
| CLN-78 | detail | 6/6 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-78.png` | 3 |
| CLN-79 | text | 3/6 | TOOL FAILURE | (text only) | 0 |
| CLN-80 | detail | 2/2 | PASS: machine: minSize:.hs-judge .njg-pill>=48 (minSize 56); minSize:.hs-judge .njg-pill>=48 (minSize 56) | `build/screenshots/evidence/ev-s04-ev2/CLN-80.png` | 2 |
| CLN-99 | detail | 6/6 | TOOL FAILURE | (text only) | 3 |
| CLN-101 | motion | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-101.png` | 3 |
| CLN-103 | motion | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-103.png` | 4 |
| CLN-104 | detail | 2/2 | TOOL FAILURE | (text only) | 1 |
| CLN-105 | detail | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-105.png` | 4 |
| CLN-106 | motion | 7/7 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-106.png` | 4 |
| CLN-107 | motion | 8/8 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-107.png` | 4 |
| CLN-108 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/CLN-108.png` | 4 |
| CLN-119 | text | 4/4 |  | (text only) | 0 |
| CLN-120 | text | 3/3 | TOOL FAILURE | (text only) | 0 |
| FL-02 | layout | 5/5 |  | `build/screenshots/evidence/ev-s04-ev2/FL-02.png` | 4 |
| ART-02 | detail | 3/3 |  | `build/screenshots/evidence/ev-s04-ev2/ART-02.png` | 3 |
| ART-05 | layout | 3/3 | FAIL: machine: ART-05-p1-L1-1280x800: pass: 2 contract breaks; ART-05-p2-L1-1440x900: pass: 1 contract breaks | `build/screenshots/evidence/ev-s04-ev2/ART-05.png` | 2 |
| ART-06 | motion | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/ART-06.png` | 1 |
| ART-07 | layout | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/ART-07.png` | 2 |
| ART-08 | detail | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/ART-08.png` | 2 |
| ART-11 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/ART-11.png` | 1 |
| ART-13 | layout | 1/1 | PASS: machine: pass (0 contract breaks) | `build/screenshots/evidence/ev-s04-ev2/ART-13.png` | 1 |
| ART-14 | detail | 1/1 |  | `build/screenshots/evidence/ev-s04-ev2/ART-14.png` | 1 |
| ART-15 | motion | 1/1 | PASS: machine: traceAmp:canvas:sv3-fold<=2 (amp 0, 0, 0) | `build/screenshots/evidence/ev-s04-ev2/ART-15.png` | 3 |
| ART-16 | detail | 1/1 | TOOL FAILURE | (text only) | 0 |
| ART-18 | motion | 4/4 |  | (text only) | 0 |
| ART-19 | motion | 2/2 |  | `build/screenshots/evidence/ev-s04-ev2/ART-19.png` | 3 |
| LNG-01 | text | 3/3 | FAIL: machine: LNG-01-p2-L1-1366x768: familyOnly: 22 of 22 lines not family-ok: "Who's next?" silent; "Bring in chokri" silent | (text only) | 0 |
| LNG-05 | text | 3/3 | TOOL FAILURE | (text only) | 0 |

## Tool failures (34): for the tool owner, never a FAIL in regressions.md

- SH-61: SH-61-p2-L1-1366x768: zoom2:.njg-done at heal:button (hit 1): ".njg-done" is not on screen at heal:button
- SH-17: SH-17-p3-L1-1366x768: strip:.cl-side .oc-card:6x400 at life:request (hit 1): the filmstrip of ".cl-side .oc-card" did not change over 6 frames (400 ms apart)
- SH-22: SH-22-p2-L1-1366x768: the moment "heal-cut-mid" never came; moments seen: page:start, life:popup-fold, host:idle, host:clinic/cut/heal, life:stage-end, life:request, clinic:heal/game, step:row-0-0, line:clinic, life:popup-open, rec:stage-heal, rec:heal-cut-start, heal:paani, heal-done:paani, step:paani, heal:wash, step:row-0-1, heal-done:wash, step:wash, heal:cloth, heal-done:cloth, step:cloth, heal:tap, heal-done:tap, step:tap, heal:pl-yellow, step:row-0-2, heal-done:pl-yellow, step:pl-yellow, bubble, life:results, host:results, rec:results-badges, rec:results-words, host:done, rec:end, page:
- SH-58: SH-58-p2-L1-1366x768: strip:.njg-done:4x300 at only:#done-btn (hit 1): the filmstrip of ".njg-done" did not change over 4 frames (300 ms apart)
- SH-67: SH-67-p2-L1-1366x768: strip:.rs-badges:6x250 at life:results (hit 1): ".rs-badges" is not on screen at life:results
- SH-23: SH-23-p1-L1-1366x768: the moment "visible:.njg-btn" never came; moments seen: page:start, life:popup-fold, host:idle, line:clinic, life:stage-end, life:request, host:clinic/waiting/waiting, life:popup-open, clinic:waiting/tap, rec:stage-waiting, drv:your-turn-waiting-tap, rec:waiting-tap, clinic:waiting/wait, life:advance, bubble, host:clinic/diagnosis/diagnosis, clinic:diagnosis/point, rec:stage-diagnosis, drv:your-turn-diagnosis-point, rec:diagnosis-point, clinic:diagnosis/wait, host:clinic/pharmacy/pharmacy, clinic:pharmacy/belt, rec:stage-pharmacy, drv:your-turn-pharmacy-belt, rec:pharmacy
- PAN-01: PAN-01-p1-L1-844x390: the moment "placed" never came (the flow stopped: page.waitForSelector: Timeout 20000ms exceeded.); moments seen: page:start, life:popup-fold, rec:stopped-here
- CHAI-15: CHAI-15-p1-L3-1366x768: dom:#intro .ic-card at life:request (hit 1): no text on screen in "#intro .ic-card" at life:request
- MAA-08: MAA-08-p1-L2-1280x800: zoom2:#count-badge at cook-done:tap (hit 1): "#count-badge" is not on screen at cook-done:tap · MAA-08-p1-L2-1280x800: zoom2:#count-badge at cook-done:roll (hit 2): "#count-badge" is not on screen at cook-done:roll · MAA-08-p1-L2-1280x800: zoom2:#count-badge at cook-done:tap (hit 3): "#count-badge" is not on screen at cook-done:tap
- DAAR-12: DAAR-12-p2-L2-1366x768: the moment "wrong-stir" never came; moments seen: page:start, life:popup-fold, life:request, line:cook, life:popup-open, rec:start, cook:click, only:#intro .ic-card, rec:order-card-big, life:stage-start, rec:order-card-in-sidebar, cook-done:click, life:ghost, rec:view-hob, rec:kind-stir, cook:stir, rec:stir-mid, cook-done:stir, rec:kind-click, only:#done-btn, life:stage-end, life:results, only:.njg-results .rs-next, rec:results-badges, rec:results-words, rec:result, page:end
- DAAR-14: DAAR-14-p1-L1-1366x768: zoom2:canvas:saucepan at rec:kind-timing (hit 1): "canvas:saucepan" is not on screen at rec:kind-timing
- CHT-03: CHT-03-p1-L1-1366x768: zoom2:canvas:bowl at rec:view-marble (hit 1): "canvas:bowl" is not on screen at rec:view-marble
- CHT-11: CHT-11-p1-L1-1366x768: zoom2:canvas:cv3-bowl at life:stage-end (hit 1): "canvas:cv3-bowl" is not on screen at life:stage-end
- SAM-01: SAM-01-p1-L1-1366x768: page cook:samosa @ 1366x768 [p-seen_w--ba-trae-char-marcha-marchu-mirchi-] was not played (resume the run)
- SAM-04: SAM-04-p1-L1-1366x768: dom:#count-badge at cook-done:click (hit 1): no text on screen in "#count-badge" at cook-done:click · SAM-04-p1-L1-1366x768: dom:#count-badge at cook-done:tap (hit 2): no text on screen in "#count-badge" at cook-done:tap · SAM-04-p1-L1-1366x768: dom:#count-badge at cook-done:tap (hit 3): no text on screen in "#count-badge" at cook-done:tap
- SAM-06: SAM-06-p1-L3-1366x768: the moment "step" never came; moments seen: page:start, life:popup-fold, life:request, line:cook, life:popup-open, rec:start, cook:click, only:#intro .ic-card, rec:order-card-big, life:stage-start, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:help-open, rec:bulb-english, rec:kind-tap, cook:tap, exp:strip, cook-done:tap, exp:ph-keema, exp:veg-12, rec:kind-click, only:#done-btn, exp:veg-01, rec:kind-swipe, cook:swipe, cook-done:swipe, life:stage-end, exp:knob, exp:samosa, rec:kind-timing, cook:timing, exp:lift, cook-done:timing, life:results, only:.njg-
- SAM-11: SAM-11-p1-L1-1366x768: the moment "order-card-in-sidebar" never came; moments seen: page:start, life:popup-fold, life:request, line:cook, life:popup-open, life:stage-start, rec:start, rec:view-marble, rec:help-open, rec:bulb-english, rec:kind-tap, cook:tap, exp:veg-01, cook-done:tap, rec:kind-click, cook:click, only:#done-btn, cook-done:click, rec:kind-swipe, cook:swipe, cook-done:swipe, only:#samosa-next, life:stage-end, exp:knob, exp:samosa, rec:kind-timing, cook:timing, exp:lift, cook-done:timing, life:results, only:.njg-results .rs-next, rec:results-badges, rec:results-words, rec:result, p
- SAM-15: SAM-15-p1-L1-1366x768: the moment "order-card-in-sidebar" never came; moments seen: page:start, life:popup-fold, life:request, line:cook, life:popup-open, rec:start, life:stage-start, rec:view-marble, rec:help-open, rec:bulb-english, rec:kind-tap, cook:tap, exp:ph-keema, cook-done:tap, rec:kind-click, cook:click, only:#done-btn, cook-done:click, rec:kind-swipe, cook:swipe, cook-done:swipe, only:#samosa-next, life:stage-end, exp:knob, exp:samosa, rec:kind-timing, cook:timing, exp:lift, cook-done:timing, life:results, only:.njg-results .rs-next, rec:results-badges, rec:results-words, rec:result,
- CK-09: CK-09-p2-L1-1366x768: zoom2:canvas:chakla at rec:view-marble (hit 1): "canvas:chakla" is not on screen at rec:view-marble
- CLN-04: CLN-04-p1-L1-1366x768: dom:.njg-rq-card at life:popup-open (hit 1): no text on screen in ".njg-rq-card" at life:popup-open · CLN-04-p1-L3-1366x768: dom:.njg-rq-card at life:popup-open (hit 1): no text on screen in ".njg-rq-card" at life:popup-open
- CLN-81: CLN-81-p2-L1-1366x768: zoom2:.rs-card at life:results (hit 1): ".rs-card" is not on screen at life:results
- CLN-84: CLN-84-p1-L2-1366x768: strip:.njg-rq-card:4x500 at life:popup-open (hit 1): the filmstrip of ".njg-rq-card" did not change over 4 frames (500 ms apart) · CLN-84-p1-L3-1366x768: strip:.njg-rq-card:4x500 at life:popup-open (hit 1): the filmstrip of ".njg-rq-card" did not change over 4 frames (500 ms apart)
- CLN-85: CLN-85-p2-L1-1366x768: zoom2:.cl-bubble at bubble (hit 1): ".cl-bubble" is not on screen at bubble
- CLN-86: CLN-86-p2-L1-1366x768: crop:.cl-bubble at bubble (hit 1): ".cl-bubble" is not on screen at bubble · CLN-86-p2-L1-1366x768: crop:.cl-bubble at bubble (hit 2): ".cl-bubble" is not on screen at bubble · CLN-86-p2-L1-1366x768: crop:.cl-bubble at bubble (hit 3): ".cl-bubble" is not on screen at bubble
- CLN-116: CLN-116-p1-L1-1366x768: zoom2:.cl-room-pic at rec:stage-diagnosis (hit 1): ".cl-room-pic" is not on screen at rec:stage-diagnosis
- CLN-22: CLN-22-p1-L1-1366x768: strip:.cl-tray:4x150 at host:clinic/pharmacy/pharmacy (hit 1): the filmstrip of ".cl-tray" did not change over 4 frames (150 ms apart) · CLN-22-p1-L1-1366x768: strip:.cl-tray:4x150 at clinic:pharmacy/belt (hit 2): the filmstrip of ".cl-tray" did not change over 4 frames (150 ms apart) · CLN-22-p1-L1-1366x768: strip:.cl-tray:4x150 at clinic:pharmacy/wait (hit 3): the filmstrip of ".cl-tray" did not change over 4 frames (150 ms apart)
- CLN-67: CLN-67-p1-L1-1366x768: zoom2:.cl-face-card at rec:heal-cut-mid (hit 1): ".cl-face-card" is not on screen at rec:heal-cut-mid
- CLN-76: CLN-76-p2-L1-1366x768: the moment "heal-cut-mid" never came; moments seen: page:start, life:popup-fold, host:idle, host:clinic/cut/heal, life:stage-end, life:request, clinic:heal/game, step:row-0-0, line:clinic, life:popup-open, rec:stage-heal, rec:heal-cut-start, heal:paani, heal-done:paani, step:paani, heal:wash, step:row-0-1, heal-done:wash, step:wash, heal:cloth, heal-done:cloth, step:cloth, heal:tap, heal-done:tap, step:tap, heal:pl-yellow, step:row-0-2, heal-done:pl-yellow, step:pl-yellow, bubble, life:results, host:results, rec:results-badges, rec:results-words, host:done, rec:end, page
- CLN-79: CLN-79-p1-L2-1024x768: page clinic:pharmacy@L2 @ 1024x768 [w--b-ba-trae-char-] was not played (resume the run) · CLN-79-p1-L2-1366x768: page clinic:pharmacy@L2 @ 1366x768 [w--b-ba-trae-char-] was not played (resume the run) · CLN-79-p1-L2-844x390: page clinic:pharmacy@L2 @ 844x390 [w--b-ba-trae-char-] was not played (resume the run)
- CLN-99: CLN-99-p2-L1-1366x768: dom:.cl-bubble at bubble (hit 1): no text on screen in ".cl-bubble" at bubble · CLN-99-p2-L1-1366x768: dom:.cl-bubble at bubble (hit 2): no text on screen in ".cl-bubble" at bubble · CLN-99-p2-L1-1366x768: dom:.cl-bubble at bubble (hit 3): no text on screen in ".cl-bubble" at bubble
- CLN-104: CLN-104-p1-L1-1366x768: zoom2:.cl-heal at life:stage-end (hit 1): ".cl-heal" is not on screen at life:stage-end
- CLN-120: CLN-120-p1-L2-1366x768: dom:.njg-rq-card at life:popup-open (hit 1): no text on screen in ".njg-rq-card" at life:popup-open
- ART-16: ART-16-p1-L1-1366x768: zoom2:.rs-done at rec:results-words (hit 1): ".rs-done" is not on screen at rec:results-words
- LNG-05: LNG-05-p1-L1-1366x768: dom:.cl-bubble at bubble (hit 1): no text on screen in ".cl-bubble" at bubble · LNG-05-p1-L1-1366x768: dom:.cl-bubble at bubble (hit 2): no text on screen in ".cl-bubble" at bubble · LNG-05-p1-L1-1366x768: dom:.cl-bubble at bubble (hit 3): no text on screen in ".cl-bubble" at bubble

## Obsolete probes (3): the row asks about a state the game no longer has (its owner rewrites the check or retires the row)

- CLN-92: the waiting room has no 'To the doctor's room' button any more: it moves on by itself after the pick (life:advance; js/clinic/stages/waiting.js builds no button)
- CLN-16: decision 52: the diagnosis has no 'Found it' and no Next at any level (js/clinic/stages/diagnosis.js D1 note); the button the row asks about is gone
- CLN-41: tummy, hic and hair are parked on the heal host lab page; the sandbox must mark their first-time help seen so its scripted taps land, so the old help is never shown
