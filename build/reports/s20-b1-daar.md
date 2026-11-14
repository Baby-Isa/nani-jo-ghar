# s20-b1-daar: daar and chop join the kitchen frame

Branch `s20-b1-daar` (from 115d900). Nothing a child sees moves, at any level or size.

## What changed
- **Daar** (`daar.js`, `daar.json`): reads only the frame. Its x's are shares of the play area's width (settings `scene.*.x`, `hob.x`: x = 48 + share × 1504, the same places); the hob's group is centred in `Cook.Frame.area(S).play` (the old `centreLift` sums deleted); the frame draws the wash and pulls the band by key; pop top, pill scale and badge floor from `Cook.Frame.view()`/`px()`; pop timings to `scene.popMs`.
- **Chop** (`chop.js`): board centred in the frame's play area; wash and band the frame's; well done kept off the panel and cog with `Cook.Frame.toSheet`.
- **Frame option** (`frame.js`, `kitchen-frame.md`): `Cook.Frame.lend(part) -> back()`: a host lends the game it runs part of its play area (shares). Chop gets its room from its host through the frame and the host still says only what to chop (SH-259). Daar lends `scene.chopRoom` (the whole); chop alone and chaat lend nothing; chai never lends.
- **Outside my files:** `placement.md` gains CHAI-109/110/112 (cited by chai-tray.js since the step 1-2 merge, unplaced, so tier 0 refused every push). Drop that commit if placed otherwise.

## Proof
- **frame-counts:** daar 0 (was 8), chop 0 (was 7), chai-tray 0.
- **Gate daar+chop:** checks pass 2.1 min; contract FAIL 18 min, 2 blocking, **both on the untouched base too** (same run there, 20.7 min): contract-22, contract-116 (calls 1-2). Chop: 0 blocking.
- **Gate chai-tray:** **boxes pass, identical, 3.7 min**; contract 20.5 min, 1 blocking (contract-79, #hint 1280): a flake, the flow alone passed twice here and once on base.
- **Chaat contract:** the same breaks as base (104 ×2, 128 ×2, 111, 26 ×0-2 on both): unchanged.
- **Geometry rules:** `boxes.mjs --game daar --rules` cannot run: "No box spec for daar" (a tools change).
- **Contract, 4 sizes** (`s20-b1-daar-contract`): 16 pages end, 0 page errors; `CONTRACT FAILED: 8 breaks (contract-119 8)`: chop's dish-card flash at L1, advisory, on base too. Daar 0.
- **Evidence:** the brief names no row; no before folder.
- **check-change:** CC_LINE

## Rows (waits for the frame, naming daar)
| Row | Now | Proof or reason |
|---|---|---|
| SH-259 | built | chop's room via the frame; daar passes only what to chop |
| SH-248 | built | band by key; band.test, contract-123 pass |
| SH-227, -241, -239, -242, -53, -236, -238 | check passing on daar | contract-100, 108, 104, 8, 106, 103 pass L1-L4 |
| SH-245, CK-79 | check passing | contract-115: 0 on daar |
| SH-249, SH-253 | passing, flaky | contract-112 flaked once on base (DAAR-39's strip) |
| DAAR-36 | open | calls 1-2 |
| DAAR-39, CK-111, SH-275 | cannot here | the chop mechanic (`mechanics/chop.js`), ART-66 |
| SH-270, SH-281, SH-255 | cannot here | kit, or the judge's pictures; no check |

## Calls
1. **contract-116** (lab daar L2, 1280): after the chop, Nana's "dungri na" card is the check's current card, but the kit's row skips "don't" cards (`order-card.js:586`), so it stays cut ~4 s. Should a "don't" card tick once everything asked on its card is done? **Recommend yes** (the kit ticks them with everything already).
2. **contract-22** (daar L3 #hint): the face replay's third sentence starts 0.9 s after the tap, past the check's 0.7 s. Should daar's tadka order at L2-L4 be said only in its pop-up, not again after the knob? **Recommend yes**: it is said twice today.
3. Advisory: daar's chop-phase heaps have no soft shadow (contract-120).
