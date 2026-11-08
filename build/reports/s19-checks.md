# s19-checks: every check audited, and the three-part gate (8 Nov)

**Flaws first.** (1) `check_stamps.mjs`, re-run today, found `cook.html` asking for `js/shared/shelf.js` with no version stamp: after a
publish a phone can keep an old shelf (orchestrator: `build/bump_version.py` must stamp it). (2) contract-105 judged two lights against
a pan's contact shadow in the final run; fixed after it (shadows excluded, test), not yet re-played on all 40 pages; and it did not
flag maani's first box crossing the pile's pill, which `1280x665/pair-2-light.png` shows: its pill box needs a look. (3) The judge's
dry run on maani was mine (no Agent tool here): rerun it with the `judge` agent. (4) `test_cook.py` and `test_clinic.py` were not
re-run: the shared lock was needed by s19-cards.

**What changed.** The audit (`docs/process/check-audit.md`): 177 checks, KEEP 160, FIX 14 (10 fixed here with tests), RETIRE 3
(shotdiff in /review, `check_clinic_kutchi`, `check_sidebar_fit`; code kept). Part 1: contract-100 to -109. Part 2 and 3:
`run.mjs --keyframes`, `sidebyside.mjs` (pairs, close-ups, screencast strips). The rubric (`docs/process/eye-judge-rubric.md`), the
judge's side-by-side batch, /review's three-part gate; the merge rule stays **proposed** (principle 10). One browser lock everywhere.

## Part 1 today (s19-p1-final: L1-L4, 1280x665; the levels that break)

| game | 100 card | 101 box | 102 light | 103 buttons | 104 picture | 105 whole | 106 goes | 107 hop | 108 praise | 109 shelf |
|---|---|---|---|---|---|---|---|---|---|---|
| chai-tray | - | - | - | - | - | - | - | - | - | - |
| maani-line | 1234 | 1234 | 12 | 1234 | - | (2) | 12 | 12 | - | - |
| mishkaki-grill | 1234 | 1234 | - | 234 | 34 | - | - | 12 | 1234 | 1234 |
| daar | 1234 | 12 | - | 1234 | 1234 | - | - | - | 1234 | - |
| chaat | 1234 | 124 | - | 1234 | - | - | - | - | - | - |
| samosa | 234 | 1234 | - | 1234 | - | (1) | - | 12 | 1234 | 234 |
| eggs | 1234 | - | - | - | 1234 | - | 34 | - | - | - |
| corn | 1234 | 134 | - | - | 2 | - | 34 | - | - | - |
| baking | 1234 | 1234 | - | - | - | - | 1234 | 1234 | - | - |
| chop | 234 | 2 | - | - | - | - | - | - | - | - |

(n) = the shadow false alarm, since fixed. Older contracts: 0 breaks on these 40 pages.

## Proof

| | |
|---|---|
| `time node build/tools/review/checks.mjs` | see below |
| unit tests touched | `node --test build/sandbox/contract-s19.test.mjs build/sandbox/contract-kit.test.mjs build/sandbox/contract-audit.test.mjs build/sandbox/list.test.mjs build/tools/review/checks.test.mjs build/tools/review/sidebyside.test.mjs`: all pass |
| part 1 runs | `s19-p1-today`, `s19-p1-today2`, `s19-p1-final` (40 pages each, every page reached its end) |
| side by side | `build/screenshots/sidebyside/maani-line-L1-20261108-1850/` (strips: the first pile `strip-cook-maani-line-speed1-01-light.png`, the roll `-02-light.png`), daar below |
| judge dry run | `build/screenshots/sidebyside/maani-line-L1-20261108-1850/judge-batch.verdicts.md` (SHIP? no) |
| evidence after | the brief names no fix-list row: no before or after folder |
| contract run (PROOF line) | below |

**Open:** SH-239's tick half and SH-238 beyond Cook (`docs/process/checks-to-build.md` 27-28).
