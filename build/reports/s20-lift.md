# s20-lift: the order view lifts only as far as the card's bottom-left place stays clear

Decision 35 item 2 (Zafar, 15 Nov ~02:50), rows SH-287 and SH-304. Branch `s20-lift` (origin/s20-bubble + the working branch). No row's status changed; nothing re-frozen.

**What changed:** `js/cook/flow.js` `clearLift` caps the order view's lift (150 design px, `flow.js:318`) at the largest one where no head reaches the card's bottom-left place. The place is `ui.js` `UI.popRoom`, popPlace's own measure: the card's full-width column, play top to foot. People are measured where they stand or walk to, and again as each arrives. The card's size, place rule, path and timing are untouched.

**What a child sees:** where someone sits in the card's column, no lift, and the card is back bottom left at live's size. That is Nana at the counter's left in three-person orders (chai L4, eggs L3-L4), and Nani in a day's order. Everywhere else, today's lift and card. New: in a three-person lab order the kitchen drops 150 design px as the people walk in. The lab lifts (`flow.js:1908`) before its order names them; the fix is outside this brief's files.

## Proof

BEFORE evidence was not played at launch (cloud machine); the sheet's before is origin/main.

**1. Measure** (lab probe, first card; heads from `njgTest.cook.faces()`; today's lift 150 everywhere). Largest clear lift, L1 / L2 / L3 / L4:

| game | 740x320 | 930x430 | 1280x665 | 1920x1080 |
|---|---|---|---|---|
| chai-tray | 150 / 150 / 150 / 4 | 150 / 150 / 150 / 5 | 150 / 150 / 150 / 2 | 150 / 150 / 150 / 3 |
| eggs | 150 / 150 / 5 / 3 | 150 / 150 / 1 / 0 | 150 / 150 / 2 / 3 | 150 / 150 / 3 / 1 |
| maani-line | 150 everywhere | 150 | 150 | 150 |
| corn | 150 everywhere | 150 | 150 | 150 |
| day order, Nani (at her pantry order) | 0 | 0 | 0 | 4 |

**2. Cards** (64 cases probed; only these changed). Sheet: `build/reports/s20-lift-before-after.png`.

| case | live | today | after |
|---|---|---|---|
| chai L4 740 / 930 | bottom 61% / 65% | top 55% / 56% | **bottom 61% / 65%** |
| chai L4 1280 / 1920 | bottom 55% / 96% | bottom 51% / top 93% | **bottom 55% / 96%** |
| eggs L3-L4 740 / 930 | bottom 61% / 65% | top 55% / 56% | **bottom 61% / 65%** |
| eggs L3-L4 1280 / 1920 | bottom 51% / 87% | bottom 51% / top 93% | **bottom 55% / 96%** |

**3. Gates and runs** (port 8957, one at a time):

| run | result | contract-129 | contract-83 |
|---|---|---|---|
| gate chai-tray | FAIL 28.7 min (checks 2.5 pass, contract 22.7 FAIL, boxes 3.5 FAIL) | 0 | 0 |
| gate eggs | PASS 9.3 min | 0 | 0 |
| gate maani (recipe) | PASS 3.2 min | 0 | 0 |
| gate maani-line | PASS 15.6 min | 0 | 0 |
| gate corn | FAIL 9.3 min (contract 6.8) | 0 | 3 |
| contract run, 4 sizes (`s20-lift-contract`, 16 pages) | `CONTRACT FAILED: 15 breaks (contract-11 1, contract-72 1, contract-102 1, contract-119 12)` | 0 | 0 |
| check-change (`build/reports/tiers/change-aa3c820bf6.md`) | FAILED, 194.8 min, 13 blockers | 0 | 2 |
| checks.mjs | pass (unit 1014 / 0) | | |

| break | why |
|---|---|
| chai contract-112, lab L4 740 | the reveal light is 5 px wider than the 61% card, 87% inside; the judge's 90% "part" rule reads a whole-card light; passes pre-change (card top) |
| chai boxes | Nani's box only (SH-301); no order-view box moved |
| corn contract-83, -114; chai -79; eggs -37 | the base run has the same kinds; corn's lift and card unchanged |
| contract-11 (1920), contract-102 (930) | -11 the same pre-change; -102 passes on a rerun |
| check-change scope / rows / mount | overnight-log line (asked); no evidence spec for SH-287, SH-304; host mount finds no Cook global |
| frozen: chai L4 #child 740 misses "dudh" | the page whose card moved; not traced: **open, may be mine** |

**Open:** the frozen "dudh", contract-112, the lab's step, corn's contract-83, evidence specs for SH-287 and SH-304.
