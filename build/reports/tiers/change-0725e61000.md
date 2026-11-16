# check-change (tier 2) on 0725e61000

**FAILED**, 2026-11-16T05:57:41.037Z; base 4800353218; 49.7 min.

Games: cook:chop, cook:eggs, cook:corn, cook:baking (--games).
Rows: SH-267, DAAR-57.

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2 min; build/reports/tiers/push-0725e61000.md |
| note | play | the robot plays cook:chop, cook:eggs, cook:corn, cook:baking (17 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 3 breaks (contract-37 1, contract-53 1, contract-113 1); CHECK FAILED: 201 new findings, 0 flows do not reach their end, 0 new page errors, 3 c |
| note | before | the same flows on the base commit 4800353218 (its own tree and sandbox) | reports | CONTRACT FAILED: 29 breaks (contract-119 28, contract-53 1); CHECK FAILED: 211 new findings, 0 flows do not reach their end, 0 new page errors, 29 contract brea |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 651 before/after pictures, 201 not paired; build/screenshots/tiers/change-0725e61000/before-after/index.html |
| ok   | rows-red | the rows' probes on the base commit (red): SH-267, DAAR-57 | reports | 0 rows: 0 for a reviewer, 0 machine-decided, 0 tool failures, 0 Zafar's, 0 need a decision. Index: build/reports/evidence-tiers-red-4800353218-0725e61000.md |
| ok   | rows-green | the rows' probes on this commit (green): SH-267, DAAR-57 | yes | 2 rows: 1 for a reviewer, 1 machine-decided, 0 tool failures, 0 Zafar's, 0 need a decision. Index: build/reports/evidence-tiers-green-0725e61000.md |
| ok   | rows-judge | the judge's batch for Fable (evidence.mjs --judge) | reports | One reviewer call per batch file (Fable; Opus when Fable is at its limit; never the builder). Then: node build/tools/review/evidence.mjs --collect --run-id tier |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | playing 19 flows at 1280x665, 740x320 (run frozen-diff-chai-tray-202611160637) ... |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | FAIL listeners on the page as before: window/resize/false: 2 -> 3; FAIL <body> as before: DIV#lab-app DIV DIV#njg-rotate SECTION.wc |
| ok   | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | leak_cook: ok |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 883 distinct rows to recheck. |

## Blocking (4, by game)

**cook:baking** (1)
- contract-113 at cook:baking#hint@740x320 (after kind-tap): nana's face sits over bk-naan-golden (19% of it, at [285,145,314,174]): nothing covers a face, a pill or a card's words

**cook:eggs** (1)
- contract-37 at cook:eggs#hint@930x430 (after order-card-big): cook:station1:marble (eggs at L1): 2 decoys on the shelf (n.egg*, cook-dudh*; * not in the order), the table wants 1

**(every game)** (2)
- frozen at build/screenshots/tiers/change-0725e61000/logs/frozen.log: playing 19 flows at 1280x665, 740x320 (run frozen-diff-chai-tray-202611160637) ...
- mount at build/screenshots/tiers/change-0725e61000/logs/mount.log: FAIL listeners on the page as before: window|resize|false: 2 -> 3; FAIL <body> as before: DIV#lab-app DIV DIV#njg-rotate SECTION.wc


## Reported, not blocking (3, by game)

**cook:baking** (1)
- contract-53 at cook:baking#hint@740x320 (hint-nani-says): the help's light is 4.0 times the size of cook-atto: it should hug it (the base has it too)

**(every game)** (2)
- play at build/screenshots/tiers/change-0725e61000/logs/play.log: CONTRACT FAILED: 3 breaks (contract-37 1, contract-53 1, contract-113 1); CHECK FAILED: 201 new findings, 0 flows do not reach their end, 0 new page errors, 3 contract breaks
- before at build/screenshots/tiers/change-0725e61000/logs/before.log: CONTRACT FAILED: 29 breaks (contract-119 28, contract-53 1); CHECK FAILED: 211 new findings, 0 flows do not reach their end, 0 new page errors, 29 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-0725e61000
- before | after: build/screenshots/tiers/change-0725e61000/before-after/index.html
- the judge's batch: build/screenshots/evidence/tiers-green-0725e61000/judge/
- logs: build/screenshots/tiers/change-0725e61000/logs
