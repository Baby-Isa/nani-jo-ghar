# s20-b1-corn: corn joins the kitchen frame (14 Nov)

Files: `corn.js`, `corn.json`, `frame.js` (an added option), `kitchen-frame.md`; out of scope: `placement.md` (below), the overnight log.

## What a child sees
- **Grill screen:** unchanged.
- **Plates:** centred in the worktop that shows, larger where it allows.
- **The cob (SH-256):** keeps its tray size on its plate, reaching a little past a short plate's rim. Was 23-44% smaller.
- **Two or more plates:** they leave the well-done face room above and between them (SH-254); at 740x320 their cobs stay 33% under tray size.
- **Bowls:** the band's row stands on chai's shelf and pill lines (contract-109); from 930 up the bowls sit 13 units higher.

## Frame option: `area.next(o2)`
A game's next screen in one round: the area again, `o2.top` its taller bottom row, `o2.band` the band redrawn there. Corn's flavour screen needs it (two rows of bowls on a phone); sekelo can use it; chai never calls it.

## Rows ('waits for the frame', naming corn)
| Row | State | Proof or reason |
|---|---|---|
| SH-256 | built, except 740x320 with two plates | contract-114: 22 to 6 |
| SH-254 | built | contract-113: 0 |
| CK-104 | call 1 | at 740x320 six pills at their floor need 1758 units; the row has 1520 |
| SH-245, CK-86 | built | the grill fills the play area's height; contract-115: 0 |
| SH-248 | built | the frame's band by corn's settings; contract-123: 0 |
| SH-255 | band built; call 2 | the cobs carry no pills |
| SH-236, SH-249, SH-253 | built | contract-102, -106, -117: 0 |
| SH-239 | built | contract-108: 0 |
| CK-103 | built (S19) | its check is still to build |
| SH-272, SH-274, CK-115 | not corn's | the kit's end panel, dish pop-up and side panel (`ui.js`) |

## Calls for Zafar
1. Keep two rows of three bowls at 740x320? Recommended: yes; the plates now have the room CK-104 missed.
2. Raw cobs on the band stay without pills (the cob is the dish)? Recommended: yes.
3. At 740x320 with two people, the cob a third smaller on its plate so the well-done face has room? Recommended: yes (else a smaller grill on phones).

## Proof
- **frame-counts:** corn 0 (was 11), chai-tray 0.
- **Corn's gate** before any change: contract FAIL, 1 blocking (contract-109), 22 contract-114. After (gate-20261114T2154-corn): **contract pass 6.2 min, 0 blocking over 18 pages**; advisory contract-119 x8, -78 x5, -37 x2 (as before), -114 x6. Checks FAIL 2.5 min on stdids only.
- **Chai's gate** (gate-20261114T2203-chai-tray): contract pass 21.2 min, 0 blocking over 38 pages; **boxes identical, 3.4 min**; checks FAIL 3.3 min on stdids only.
- **stdids** failed on the base (CHAI-109, -110, -112 unplaced): placed as "not a standard" (7be142e) for the orchestrator to redo.
- **Four sizes** (s20-b1-corn-contract): 8/8 pages end, 0 page errors; `CONTRACT FAILED: 8 breaks (contract-119 8)`, as before.
- **Geometry rules:** cannot run: "No box spec for corn" (`boxes.mjs`, read-only here).
- **Evidence:** `build/screenshots/brief/s20-b1-corn/SH-256/after/`; no before folder.
- **check-change:** not passed. Against the branch point (`--base 115d900`): push pass; play L1-L4 at 740/930: contract-109 1 to 0, -114 24 to 6, contract-83 4 to 3 (on the base too: the kit's side panel); rows pass; film pass; scope fails on the overnight log the brief asks for; mount fails identically on the base tree; chai's frozen diff, re-run alone: 4 confirmed changes (two sounds, a card-light note, a "view-null" state), and 3 on the base tree's own code, so not from the frame (chai never calls `next`); leak-cook, run after: ok. First run: `build/reports/tiers/change-549197e0be.md`.
