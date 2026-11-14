# s20-b1-maani: maani joins the kitchen frame

## What changed
- **Maani reads only its play area** (`Cook.Frame.area`: the wash, the stone tray, the play box). Removed: `centreLift`, the 1600 centring, `Cook.view`, `worldToScreen`, the 900 edges.
- **Frame option: the size chain** (`area.row`; kitchen-frame.md). Stations are shares of the play area. Maani has board 1 and tawa 1 (`shares` in its settings). The frame gives the largest unit that fits (capped by a game's `max`: maani's accepted 360), the gap (a tenth of the play width) and chai's CHAI-89 centring. The contents follow the unit.
- **Frame option: the tap room** (`Cook.Frame.taps`). This is chai's SH-288 rule as a frame option: maani's face and knob get 48 CSS px hit areas, and nothing drawn changes. Chai keeps its own copy.
- **Outside my files:** `placement.md` now places CHAI-109, -110 and -112 as "not a standard" (the push hook failed on the base). **Orchestrator: confirm or re-place them.**

**What a child sees:** no change at any level or size. The board and tawa moved under 0.4 px at all four sizes; the face and knob are easier to tap.

## Proof
- **frame-counts:** maani-line 0 (was 15); chai-tray 0.
- **Chai's gate:** `GATE PASS chai-tray: checks pass 2.4, contract pass 20.1, boxes:chai-tray pass 3.2; 25.8 min`. Chai's boxes are identical to its reference.
- **Maani's gate:** `GATE FAIL maani-line: checks pass 2.2, contract FAIL 12.3; 14.6 min`. One blocking break: **contract-112**, L1 at 1280x665. The board's roll light stays up while the child rolls. **It was there before this change:** the same break, in the same box, on the base 115d900, and twice on this branch. It comes from the kit's light code (`Onboard.began`/`ended`, `coach.js`; not mine to edit): a kit fix. Advisory breaks: contract-119 x12, -111 x2, -36 x4.
- **Four sizes** (`s20-b1-maani-contract`): `CONTRACT FAILED: 9 breaks (contract-119 8, contract-112 1)`. All 8 pages reached their end with 0 page errors. contract-119 is advisory (the kit's order pop).
- **Geometry rules** (`boxes.mjs --rules`, s20m-r1, 2.9 min): 8/10 pass, the same two failing as on the baseline.
  - tap-size: 33 faults before, 9 now. The 9 left are the kit's word-card buttons (`word-card.js`).
  - frame-slots: the stone tray's slab is inset, unlike chai's full-width shelf. This is the kit's look, and the same in every tray game.
- **check-change** (`build/reports/tiers/change-3ba4e7a1fc.md`, 21.3 min): FAILED on contract-112 alone, at #mistake 930x430. The before (base) play has the same 16 breaks, contract-112 x2 among them.
- **Evidence:** the spec names no rows, so there is no before or after folder.

## Parked rows
Checks from maani's gate run.

| Row | State | Proof or reason |
|---|---|---|
| CK-112 | label, plates built; card: kit | pill-clear passes at four sizes; the L4 lesson card at 740x320 ends 10 px from the foot (`ui.js` order pop) |
| SH-238, -239, -236, -237, -254, -256, -272, -274, -278 | pass for maani | their contract checks at 0: -103, -108, -106 (but see contract-112), -107, -113, -114, -127, -125, -126 |
| SH-248 | built | `band.test.mjs` passes |
| SH-245 | chain at the accepted size | call 2 |
| SH-255, MAA-25 | wait | call 1 |
| MAA-20, SH-119, SH-271, SH-227 | wait: kit | `coach.js`, `roll.js`, `onboard.js`, `ui.js` |
| SH-279 | waits: Sprint 21 | the kit's serve |

## Calls for Zafar
1. **MAA-25:** should maani's plates move off the tray onto the worktop, as a third station right of the hob? **Recommend yes** (chai keeps its vessels on the worktop).
2. **SH-245:** should the board and tawa grow on taller screens (about 40% on a laptop) past the 360 you accepted on 11 Nov? **Recommend no** (your newer word). Saying yes means changing one number.
3. **Should the stone tray run edge to edge like chai's shelf** (frame-slots, every tray game)? **Recommend yes**, as one kit change.
