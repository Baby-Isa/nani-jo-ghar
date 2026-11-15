# s20-b1-daar: daar and chop join the kitchen frame

Branch `s20-b1-daar` (from 115d900). Nothing a child sees moves, at any level or size.

## What changed
- **Daar** (`daar.js`, `daar.json`): reads only the frame. Its x's are shares of the play area's width (the same places); the hob's group is centred in `Cook.Frame.area(S).play` (the old `centreLift` sums deleted); the frame draws the wash and pulls the band by key; screen sizes from `Cook.Frame.view()`/`px()`.
- **Chop** (`chop.js`): board centred in the frame's play area; wash and band the frame's; well done kept off the panel and cog with `Cook.Frame.toSheet`.
- **Frame option** (`frame.js`, `kitchen-frame.md`): `Cook.Frame.lend(part) -> back()`: a host lends the game it runs part of its play area (shares). Chop gets its room from its host through the frame and the host still says only what to chop (SH-259). Daar lends `scene.chopRoom` (the whole); chop alone, chaat and chai lend nothing.
- **Outside my files:** `placement.md` gains CHAI-109/110/112 (cited by chai-tray.js, unplaced: tier 0 refused every push).

## Proof
- **frame-counts:** daar 0 (was 8), chop 0 (was 7), chai-tray 0.
- **Gate daar+chop:** checks pass 2.1 min; contract FAIL 18 min, 2 blocking, **both on the untouched base too** (same run there, 20.7 min): contract-22, contract-116 (calls 1-2). Chop: 0 blocking.
- **Gate chai-tray:** **boxes pass, identical, 3.7 min**; contract 20.5 min, 1 blocking (contract-79, #hint 1280): a flake, the flow alone passed twice here and once on base.
- **Chaat contract:** the same breaks as base: unchanged.
- **Geometry rules:** cannot run: no box spec for daar.
- **Contract, 4 sizes:** 16 pages end, 0 page errors; 8 breaks, all contract-119 (chop, advisory, on base too). Daar 0.
- **check-change:** stopped at my 50 min limit (play: one blocking, contract-22). Not a pass.

## Rows (waits for the frame, naming daar)
| Row | Now | Proof or reason |
|---|---|---|
| SH-259 | built | chop's room via the frame; daar passes only what to chop |
| SH-248 | built | band by key; band.test, contract-123 pass |
| SH-227, -241, -239, -242, -53, -236, -238 | check passing on daar | contract-100, 108, 104, 8, 106, 103 pass L1-L4 |
| SH-245, CK-79 | check passing | contract-115: 0 on daar |
| SH-249, SH-253 | passing, flaky | contract-112 flaked once on base (DAAR-39's strip) |
| DAAR-36 | daar at zero (round 2) | chop's 129, 112 left |
| DAAR-39, CK-111, SH-275 | cannot here | the chop mechanic (`mechanics/chop.js`), ART-66 |
| SH-270, SH-281, SH-255 | cannot here | kit, or the judge's pictures; no check |

## Round 2: decision 35 (Zafar, 15 Nov ~02:50), on ccr-7da5e9f0 merged
- **(3) contract-116:** daar's "don't" card ticks once the rest of its card is done (after the chop; again once every pile is in; it opens again with them), through the kit's own `UI.mission.tickItem(id, dish, {no: true})`.
- **(4) contract-22:** from L2 the spice order is said once, in its pop-up only; the step opens quietly. A redo still says it with its help.
- **Gate daar+chop** (`gate-20261115T0330-daar+chop`): checks pass 2.4 min; **contract-116 0, contract-22 0**. Still blocking: contract-129 ×28, all chop's (SH-304: the pop-up card over the bubble; its fix waits on s20-bubble), and contract-112 ×2 (the chop strip's finger, DAAR-39).
- **Gate chai-tray** (`gate-20261115T0353-chai-tray`): boxes differ in Nani's box only (160 of 160: SH-301 from s20-b1-fixes, listed in its report); play area unmoved. Contract: contract-129 ×2 (SH-304), contract-99 ×1 (lab L4 1280); neither from daar.
- **DAAR-36:** daar's own breaks at zero; the row's remaining breaks are chop's contract-129 and contract-112, not daar's code.
