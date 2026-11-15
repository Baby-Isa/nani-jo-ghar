# s20-b2-samosa: samosa joins the kitchen frame (15 Nov)

Files: `samosa.js`, `samosa.json`, `kitchen-frame.md` (who calls it, counts). No frame option added. The BEFORE evidence was not played at launch (the spec names no rows).

## What changed
- **Samosa reads only the frame.** The frame draws the wash and pulls the stone tray by samosa's key. The x positions (board, plate, the heaps' span, the thalis) are shares of the play area's width, at the same places as before. The board's group and the hob's row are centred in `play` (CHAI-89, as daar does). The pills' foot comes from `bottom`, the word pop's top from `view()` and sizes from `px`. The zone is the frame's sheet, and the timings moved to its settings. The old view sums are deleted.
- **The fold's close-up** happens on the board's middle on the same screen, so its room is the play area's. The fry is its own view (a fresh `St.begin`), so it gets a fresh area, not `next`.
- **SH-280 (part):** the slotted spoon and its cloth are drawn with the hob and plate as the fry comes up. Before, they popped in after the knob's tap.

**What a child sees:** the spoon is there from the fry's first frame, at every level and size. Nothing else moves.

## Rows ('waits for the frame', naming samosa)
| Row | State | Proof or reason |
|---|---|---|
| SH-239, SH-241, SH-53, SH-238 | check passing | contract-108, -100, -8, -103: 0 |
| SH-236, CK-82 | check passing | contract-106, -105, -82: 0 (fold light: the kit's box; face upper-left at well done; knob box from its picture) |
| SH-245, SH-248 | built | contract-115 0, -123 0; band.test passes |
| SH-272, SH-278 | check passing | contract-127, -126: 0 |
| SH-256 | 0 blocking | contract-114 x2 advisory (a mound on the fold strip read as swapped; fill-and-fold code not changed here) |
| SH-258 | built (S19) | the face on both plates and by the knob; no check |
| SH-280 | spoon built | the spare strips already fade (240 ms); the blank frame between views is `St.begin`'s fade (kit) |
| SAM-34 | layout built (S19) | the eye beside mock 2: the judge's, not mine |
| SAM-40 | waits: kit | the dish closed whole folds the card (`ui.js`) |
| SH-271, SH-284 | waits: kit | the coach's dim (`coach.js`, `onboard.js`) |
| SH-277 | kit | the `#side` rule |
| SH-279 | waits: Sprint 21 | the kit's serve and its Shabash spot |

## Calls taken while Zafar was away
None.

## For the orchestrator: a check fault (not mine to fix)
contract-112 breaks on the fold's help light, at random (1 run in 3 on the base f794015 too, the same box). The light hugs the pastry. But the screen scan (`contract-s19.mjs:840`) reads `getBounds()`, the fold canvas with its fold room, not `litBounds`, which the hook at `:762` reads. `lightjudge.py:307` then breaks the body-versus-picture tie (one picture, equal IoU) towards the picture. Fix: read `litBounds` in screenScan, or let the body win a tie.

## Proof
- **frame-counts:** samosa 0 (was 12), chai-tray 0.
- **Samosa gate** (gate-20261115T0618-samosa): checks pass 2.2 min; contract FAIL 12.7 min, 2 blocking, both the fault above (contract-112, L3 at 1280 and L3#hint at 740), over 28 pages. Advisory: -111 x13, -37 x4, -78 x4, -36 x4, -92 x2, -114 x2. The first gate, before the spoon fix: the same fault, 13.3 min.
- **Chai gate:** `GATE PASS chai-tray: checks pass 2.2, contract pass 21.4, boxes:chai-tray pass 3.3; 26.9 min` (0 blocking over 38 pages; boxes identical).
- **Geometry rules:** cannot run: "No box spec for samosa" (`boxes.mjs`, read-only).
- **checks.mjs:** 14 steps ok (unit 1014 pass).
- **Four sizes** (s20-b2-samosa-contract): 8/8 pages end, 0 page errors; `CONTRACT FAILED: 10 breaks (contract-78 6, contract-111 2, contract-109 2)`. contract-109 is at 1920x1080 only (a heap 5 px above chai's line). The base f794015 has it too: the heaps stand on their canvas's foot, not their opaque foot. Not changed here: it would move every heap at every size.
- **Evidence:** the spec names no rows, so there is no before or after folder.
