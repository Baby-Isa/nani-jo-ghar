# s20-b1-maani: maani joins the kitchen frame

**Branch** `s20-b1-maani` (from `115d900`). Sprint 20 batch 1, decision 31.

## What changed
- **Maani reads only its play area.** `Cook.Frame.area` draws its wash and stone tray; the board and the tawa (on its hob) are the room's two stations, laid out by the frame's new size chain. Gone: `centreLift`, the 1600 centring, `Cook.view`, `worldToScreen`, the 900 band and praise edges, the 900 ms literals (now `QUIET_S`). The roll zone is narrowed to the board's column once the room is laid out.
- **Frame option 1, the size chain** (`area.row` / `Cook.Frame.row`, in kitchen-frame.md): stations as shares of the play area (maani: board 1, tawa 1, in `data/stations/maani-line.json` `shares`); the frame gives the largest unit that fits (at most a game's `max`, maani's accepted 360), the gap (a tenth of the play width) and the row centred by chai's CHAI-89 measure. Contents follow the unit (chakla, roll rings, velan, flames, hob, turner). Why: the plan's step 4, "board and tawa as shares, the frame setting the gap and largest fit", usable by any game with stations side by side.
- **Frame option 2, the tap room** (`Cook.Frame.taps`): chai's SH-288 rule as a frame option: a face and its knob take 48 CSS px each by invisible hit areas, sharing the room between them. Why: maani's face (21 px at 740x320) and knob failed tap-size. Chai keeps its own copy, so chai gets nothing new.
- **Outside my files:** `placement.md` places CHAI-109, -110, -112 as "not a standard" (stdids failed on the base and the push hook refused every push). **Orchestrator: confirm or re-place them.**

**What a child sees:** nothing new at any level or size. Board and tawa moved under 0.4 px at all four sizes (box diff s20m-r1 against the baseline s20m-base). The face and knob are easier to hit; how they look is unchanged.

## Proof
- **Gate, chai-tray:** `GATE PASS chai-tray: checks pass 2.4, contract pass 20.1, boxes:chai-tray pass 3.2; 25.8 min`. Chai's boxes are identical to its reference: the frame did not move chai.
- **Gate, maani-line:** `GATE FAIL maani-line: checks pass 2.2, contract FAIL 12.3; 14.6 min`. One blocking break: **contract-112** at L1 1280x665. The board's roll light stays up while the child rolls, and the dough grows inside it. **It is older than this change:** the same break, the same box, on the base commit 115d900 (run `s20m-base-c112`) and twice on this branch. The light is drawn by the kit (`Onboard.began`/`ended`, `coach.js`), which this session may not edit: **orchestrator, a kit fix (the SH-236 class)**. Advisory, not failing: contract-119 x12 (the order pop's dish flash), -111 x2, -36 x4.
- **Contract run, four sizes** (`s20-b1-maani-contract`): `CONTRACT FAILED: 9 breaks (contract-119 8, contract-112 1)`. All 8 pages reached their end, 0 page errors. contract-119 is advisory (the kit's order pop); contract-112 is the older break above.
- **check-change:** CC_LINE

- **frame-counts:** `maani-line 0` (was 15); chai-tray 0.
- **Geometry rules** (`boxes.mjs --game maani-line --rules`, s20m-r1, 2.9 min): 8/10 pass, the same two rules failing as on the baseline (s20m-base, 2.8 min):
  - tap-size: 33 → 9 faults. The face and knob now pass. The 9 left are the kit's word-card buttons (`wc14-eye`, `wc14-dots`, `wc-spk`, L4 order lesson, `js/shared/word-card.js`): a kit fault, reported, not fixed.
  - frame-slots: the rule reads a tray game's bottom row from the stone tray's slab, which is inset (`Shelf.P.tray`) against chai's edge-to-edge shelf. It is the kit's tray look and is the same for corn, daar and chop. Not maani's code.
- **Evidence:** the spec names no rows (`rows: []`), so there is no before folder and no after run.

## Parked rows (every "waits for the frame" row naming maani)
Its check is the row's contract check over maani's gate run (`gate-20261114T2128-maani-line`: 14 flows, L1-L4, 740x320 and 1280x665).

| Row | State now | Proof or reason |
|---|---|---|
| CK-112 | label and plates built; card part: **kit** | pill-clear passes at four sizes; plates at full strength. The L4 order-lesson card at 740x320 sits under Nana's bubble, bottom 10 px from the foot: the kit's order pop (`ui.js`) |
| SH-238 | built for maani | contract-103: 0 (maani moves on by itself; `UI.done` shows no tick) |
| SH-239 | built for maani | contract-108: 0 |
| SH-236 | passes its check; see contract-112 below | contract-106: 0 |
| SH-237 | built for maani | contract-107: 0 |
| SH-254 | built for maani | contract-113: 0; overlap rule passes at praise, four sizes |
| SH-256 | built for maani | contract-114: 0 (a lone maani fills the plate's floor) |
| SH-272 | passes for maani | contract-127: 0 |
| SH-274 | passes for maani | contract-125: 0 |
| SH-278 | passes for maani | contract-126: 0 |
| SH-248 | built | the tray in maani's settings; `F.stoneBand(S, {game})`; `band.test.mjs` passes |
| SH-245 | settled by the chain at the accepted size | **call 2** |
| SH-255 | pills built (Kit.fitPills); plates without pills | **call 1** (MAA-25) |
| MAA-25 | waits | **call 1** |
| MAA-20 | waits: kit and Zafar | the roll demo is `coach.js`; both looks on a lab page, then his pick |
| SH-119 | waits: kit | one finger: `coach.js` and `roll.js` |
| SH-271 | waits: kit, no check yet | the light's blink is `onboard.js` |
| SH-279 | waits: Sprint 21's round | the Shabash bubble is the kit's serve |
| SH-227 | waits: kit | the 6 Nov card for every game: `ui.js` |


## Calls for Zafar
1. **MAA-25:** move maani's two plates off the stone tray onto the worktop as a third station right of the hob, leaving the tray to the dough heaps? **Recommend yes** (chai keeps its vessels on the worktop; the chain takes a third share).
2. **SH-245:** let maani's board and tawa grow with a taller play area (about 40% bigger on a laptop) instead of stopping at the 360 you accepted on 11 Nov? **Recommend no**: your 11 Nov word is the newer one. One number (`max`) changes it.
3. **frame-slots on tray games:** should the stone tray reach edge to edge like chai's shelf, so the rule passes? **Recommend yes**, as a kit change for every tray game at once, not in maani.
