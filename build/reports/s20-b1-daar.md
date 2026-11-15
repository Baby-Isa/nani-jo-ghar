# s20-b1-daar: daar and chop join the kitchen frame

Branch `s20-b1-daar` (from 115d900). Nothing a child sees moves, at any level or size.

## What changed
- **Daar** (`daar.js`, `daar.json`): reads only the frame. Its x's are shares of the play area's width (the same places); the hob's group is centred in `Cook.Frame.area(S).play` (the old `centreLift` sums deleted); the frame draws the wash and pulls the band by key; screen sizes from `Cook.Frame.view()`/`px()`.
- **Chop** (`chop.js`): board centred in the frame's play area; wash and band the frame's; well done kept off the panel and cog with `Cook.Frame.toSheet`.
- **Frame option** (`frame.js`, `kitchen-frame.md`): `Cook.Frame.lend(part) -> back()`: a host lends the game it runs part of its play area (shares). Chop gets its room from its host through the frame and the host still says only what to chop (SH-259). Daar lends `scene.chopRoom` (the whole); chop alone, chaat and chai lend nothing.
- **Outside my files:** `placement.md` gains CHAI-109/110/112 (cited by chai-tray.js, unplaced: tier 0 refused every push).

## Proof
- **frame-counts:** daar 0 (was 8), chop 0 (was 7), chai-tray 0.
- **Round 1 gates:** chai's boxes identical; chaat's contract as base; daar's contract-22 and -116 on base too (round 2). Geometry rules: no box spec for daar. check-change: stopped at my limit, not a pass.

## Rows (waits for the frame, naming daar)
| Row | Now | Proof or reason |
|---|---|---|
| SH-259 | built | chop's room via the frame; daar passes only what to chop |
| SH-248 | built | band by key; band.test, contract-123 pass |
| SH-227, -241, -239, -242, -53, -236, -238 | check passing on daar | contract-100, 108, 104, 8, 106, 103 pass L1-L4 |
| SH-245, CK-79 | check passing | contract-115: 0 on daar |
| SH-249, SH-253 | check passing | contract-112 0 (round 3) |
| DAAR-36, DAAR-39 | daar at zero (rounds 2-3) | chop's 129 left (s20-bubble) |
| CK-111, SH-275 | cannot here | the chop mechanic (`mechanics/chop.js`), ART-66 |
| SH-270, SH-281, SH-255 | cannot here | kit, or the judge's pictures; no check |

## Round 2: decision 35 (Zafar, 15 Nov ~02:50), on ccr-7da5e9f0 merged
- **(3) contract-116:** daar's "don't" card ticks once the rest of its card is done (after the chop, again once every pile is in), by the kit's `tickItem {no}`.
- **(4) contract-22:** from L2 the spice order is said once, in its pop-up only; the step opens quietly. A redo still says it with its help.
- Gates `gate-20261115T0330-daar+chop` (contract-116 0, -22 0) and `gate-20261115T0353-chai-tray` (Nani's box only): superseded by round 3's.

## Round 3: DAAR-39, contract-112
- **Cause:** `js/cook/mechanics/chop.js` swipeBox (the first-time strip's light): its right edge followed the finger point as the drag began, read from the game's state, while the page still showed the knife and hand at the start; a busy machine's picture caught the hand outside the box.
- **Fix:** the box holds the hand where the move starts (`fpt0`) for the whole move. Proof: chop L2 + daar L4 at 740x320, two runs, contract-112 0 (5 lights judged, 0 failing, each).
- **Gate daar+chop** (`gate-20261115T0442-daar+chop`, 21.4 min): checks pass; contract-112 0, -116 0, -22 0; only contract-129 ×28 (chop, SH-304).
- **Gate chai-tray** (`gate-20261115T0504-chai-tray`, 25 min): boxes 160 differences, all Nani's box (SH-301); contract-129 ×3 only.
- Tier 0 refused pushes on a sprint-file path that is not in git (`build/reports/s20-corn-calls/`): reworded.
