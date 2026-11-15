# s20-lift: the order view lifts only as far as the card's bottom-left place stays clear

Decision 35 item 2 (Zafar, 15 Nov ~02:50), rows SH-287 and SH-304. Branch `s20-lift` (origin/s20-bubble + the working branch). No row's status changed; nothing re-frozen.

**What changed** (`js/cook/flow.js` `clearLift`, `liftOrderView`, `orderLift`; `js/cook/ui.js` `UI.popRoom`, sharing popPlace's measure):
- the order view's lift (today 150 design px, `flow.js:318` ORDER_LIFT) now stops where the first head would come down into the pop-up card's bottom-left place: the card's column at its full width, from the play area's top pad to its foot;
- the heads are measured where the people stand, or at the spot they are walking to; a person who comes to the counter while the order view stands is measured at once (`orderLift` wraps `addChar`);
- the card's size, place rule, path and timing are untouched (popPlace and popCard read the same measure as before).

**What a child sees:**
- **Someone sits in the card's column** (Nana at the counter's left in three-person orders: chai L4, eggs L3-L4; Nani at the left in a day's customer order, by her measured place): no lift. The card is back bottom left at live's size at every size, clear of the bubble.
- **Everywhere else:** today's lift and today's card, unchanged.
- **One new visible step:** in a three-person *lab* order the kitchen first shows lifted, then drops 150 design px (48 px at 740x320, 139 px at 1920x1080) as the three walk in. That is 0.27 s later in eggs L4, and just after the word moment fades in chai L4. The lab sets its lift (`flow.js:1908`) before its order names its people. A fix moves that lift to where the order is known, outside this brief's files. A day's order has no step: its people are added in the same tick.

## Proof

BEFORE evidence was not played at launch (a cloud machine). The before/after sheet's before is origin/main, the live site.

### 1. The measure (probe: lab, first order card; heads from `njgTest.cook.faces()`, `flow.js:2406`; the place from `ui.js` popPlace)

Today's lift is 150 everywhere. Largest clear lift (design px) for L1 / L2 / L3 / L4:

| game | 740x320 | 930x430 | 1280x665 | 1920x1080 |
|---|---|---|---|---|
| chai-tray | 150 / 150 / 150 / 4 | 150 / 150 / 150 / 5 | 150 / 150 / 150 / 2 | 150 / 150 / 150 / 3 |
| eggs | 150 / 150 / 5 / 3 | 150 / 150 / 1 / 0 | 150 / 150 / 2 / 3 | 150 / 150 / 3 / 1 |
| maani-line | 150 / 150 / 150 / 150 | 150 / 150 / 150 / 150 | 150 / 150 / 150 / 150 | 150 / 150 / 150 / 150 |
| corn | 150 / 150 / 150 / 150 | 150 / 150 / 150 / 150 | 150 / 150 / 150 / 150 | 150 / 150 / 150 / 150 |

Day orders: Nani stands at x 330, the counter's left. Measured at her pantry order (lift 0), her head limits the bottom place at every size, so the largest clear lift is 0-4. A day's customer order itself was not played.

### 2. The card, live vs after (first card: place, scale)

Changed only where a head stood in the column (chai L4, eggs L3-L4); the rest is today's, unchanged (64 cases probed).

| case | live | today | after |
|---|---|---|---|
| chai L4 740x320 | bottom 61% | top 55%, over the bubble | **bottom 61%** |
| chai L4 930x430 | bottom 65% | top 56% | **bottom 65%** |
| chai L4 1280x665 | bottom 55% | bottom 51% | **bottom 55%** |
| chai L4 1920x1080 | bottom 96% | top 93% | **bottom 96%** |
| eggs L3-L4 740 / 930 | bottom 61% / 65% | top 55% / 56% | **bottom 61% / 65%** |
| eggs L3-L4 1280 / 1920 | bottom 51% / 87-88% | bottom 51% / top 93% | **bottom 55% / 96%** |

Sheet: `build/reports/s20-lift-before-after.png` (script-made: live vs after, chai L4 740x320, eggs L1 740x320 and 1280x665, corn L1 740x320).

### 3. The gates (each alone on the machine, port 8957)

| gate | result | contract-129 | contract-83 |
|---|---|---|---|
| chai-tray | FAIL 28.7 min: checks pass 2.5, contract FAIL 22.7 (38 pages), boxes FAIL 3.5 | 0 | 0 |
| eggs | PASS 9.3 min (contract 6.9, 18 pages) | 0 | 0 |
| maani (recipe flow) | PASS 3.2 min (contract 0.7, 2 pages) | 0 | 0 |
| maani-line | PASS 15.6 min (contract 13.1, 28 pages) | 0 | 0 |
| corn | FAIL 9.3 min: contract FAIL 6.8 (3 blocking) | 0 | 3 |

- **chai, contract-112** (lab L4 740x320, the reveal lesson's light on the bottom-left card's picture). The light is right in its picture, but 5 px wider than the narrow 61% card, so only 87% of it lies in the card. The judge (`lightjudge.py`, 90% rule) then reads it as a whole-card light. The same page before the change passes (card top left, 55%). This is the check's threshold meeting live's card place. The fix goes in the judge or the lesson's pad: not this brief's files.
- **chai, boxes:** all 8 pages differ only in Nani's box (face and words: SH-301, already merged). No order-view box moved: the reference has the card where live has it.
- **corn, contract-83** (740x320: L4, #mistake, #hint): a card over Nana's face circle inside the side panel. Corn's lift and card are unchanged (150, top left). Before the change the same pages give the same break (box 37,93,122,264): it predates this change and moves between runs.

### 4. The contract run (the PROOF line: chai L4, eggs, corn, maani at four sizes)

`build/screenshots/sandbox/s20-lift-contract/`: 16 pages, every end reached, 0 page errors, contract-129 0, contract-83 0. Last line: `CONTRACT FAILED: 15 breaks (contract-11 1, contract-72 1, contract-102 1, contract-119 12)`.
- contract-11 (chai L4 1920x1080, the word moment's backdrop resolution): the same before the change.
- contract-102 (chai L4 930x430, a station glow at 50 s): a one-off; the same page passes on a rerun.
- contract-72 and contract-119: advisory.

### 5. The rest
- Tier 0 (`checks.mjs`): pass, unit tests 1014 pass, 0 fail.
- Evidence after-run: refused, because SH-287 and SH-304 have no spec in `build/sandbox/data/evidence.json`. There is no after folder.
- check-change: CHECKCHANGE

**Open:** contract-112 (judge or lesson pad), the lab's step (the lab's lift where its order is known), corn's contract-83, evidence specs for SH-287 and SH-304. Rows stay open for the orchestrator.
