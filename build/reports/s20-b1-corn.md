# s20-b1-corn: corn joins the kitchen frame (14 Nov)

Branch `s20-b1-corn`. Files: `js/cook/stations/corn.js`, `data/stations/corn.json`, `js/cook/frame.js` (an added option), `docs/architecture/kitchen-frame.md`; out of scope: `placement.md` (below), the overnight log.

## What a child sees
- **Grill screen:** unchanged.
- **Plates:** centred in the worktop that shows, and larger where it allows (to 400). (They were measured from the sheet's top.)
- **The cob (SH-256):** keeps its tray size on its plate, reaching a little past a short plate's rim (`plates.reach` 1.15). Was 23% smaller at 1280x665, 44% at 740x320.
- **Two or more plates:** they leave the well-done face its room above and between them (the kit's praiseSpot share), so it never lies on a cob (SH-254). At 740x320 that keeps their cobs 33% under tray size.
- **Bowls:** the band's row stands as chai's shelf, feet on the shelf line and pills on the pill line (contract-109 at 740x320). At 930 and up the bowls sit 13 units higher.

## Frame option: `area.next(o2)`
A game's next screen in one round: the area again, `o2.top` its taller bottom row, `o2.band {ms}` the band redrawn there and faded in. Corn's flavour screen needs it (two rows of bowls on a phone); sekelo can use it. Chai never calls it.

## Rows ('waits for the frame', naming corn)
| Row | State | Proof or reason |
|---|---|---|
| SH-256 | built, except 740x320 with two plates | contract-114: 22 to 6 |
| SH-254 | built | contract-113: 0 |
| CK-104 | Zafar's call 1 | at 740x320 the six pills at their floor are 1758 units; the row is 1520 |
| SH-245, CK-86 | built | the grill fills the play area's height; contract-115: 0 |
| SH-248 | built | the frame's band by corn's settings; contract-123: 0 |
| SH-255 | band built; call 2 | the cobs carry no pills |
| SH-236, SH-249, SH-253 | built | contract-102, -106, -117: 0 |
| SH-239 | built | contract-108: 0 |
| CK-103 | built (S19) | its check is still to build |
| SH-272, SH-274, CK-115 | not corn's | the kit's end panel, dish pop-up and side panel (`ui.js`) |

## Calls for Zafar
1. Keep two rows of three bowls on a phone (740x320)? Recommended: yes; the plates now have the room CK-104 missed.
2. The raw cobs on the band stay without word pills (the cob is the dish, named on the order card)? Recommended: yes.
3. On a phone with two people, the cob a third smaller on its plate, so the well-done face has room? Recommended: yes; the alternative is a smaller grill on phones.

## Proof
- **frame-counts:** corn 0 (was 11), chai-tray 0.
- **Corn's gate** before any change: contract FAIL, 1 blocking (contract-109), 22 contract-114. After (gate-20261114T2154-corn): **contract pass 6.2 min, 0 blocking over 18 pages**; advisory contract-119 x8, -78 x5, -37 x2 (as before), -114 x6. Checks FAIL 2.5 min on stdids only.
- **Chai's gate** (gate-20261114T2203-chai-tray): contract pass 21.2 min, 0 blocking over 38 pages; **boxes identical, 3.4 min**; checks FAIL 3.3 min on stdids only.
- **stdids** failed on the base branch (CHAI-109, -110, -112 unplaced). Placed as "not a standard" (7be142e) for the orchestrator to redo; push check passed.
- **Four sizes** (s20-b1-corn-contract): 8 of 8 pages end, 0 page errors; `CONTRACT FAILED: 8 breaks (contract-119 8)`, as before.
- **Geometry rules:** cannot run: "No box spec for corn" (`build/sandbox/lib/boxes.mjs`, read-only here).
- **Evidence:** `build/screenshots/brief/s20-b1-corn/SH-256/after/`; no before folder (none played at launch).
- **check-change:** CHECK_CHANGE_HERE
