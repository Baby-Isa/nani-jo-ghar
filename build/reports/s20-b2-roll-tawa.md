# s20-b2-roll-tawa: roll-tawa joins the kitchen frame (15 Nov)

Files: `roll-tawa.js`, `roll-tawa.json` (`band: "tray"`), `kitchen-frame.md`. No frame option added; `frame.js` untouched.

## What changed
Roll-tawa (the lab's two-zone proof) reads only its play area, as maani does: `Cook.Frame.area({top, far, draw})` and the stone tray. The board and the hob are `area.row`'s two stations, with equal shares and `max` 363 (the tawa's old size). Each mechanic's zone is fitted to its station: its design px times the station's unit. Each zone owns the pointer on its side of the gap. Deleted: the sheet regions, both footprints, the fixed spots and the wood backdrop crop. The roll and tawa mechanics are untouched.

## What a child sees (every level, every size)
- Marble worktop and wash, as maani; the left half's wood panel is gone.
- The board and the hob sit side by side, centred in the worktop. The tawa is never bigger than before. The board matches the tawa: at most 363, was 409. Both shrink on phones.
- L1: a one-burner hob with lit flames. L2-L3 (tawa level 2): a two-burner hob with two full-size tawas (they were 0.7).
- The spare dough, the rolled maani waiting and the plate lie on the stone tray.
- The turner rests beside the hob. With two burners on a phone, it lies on the tray instead.

## Calls taken while Zafar was away
1. The board on marble, no wood panel. Other: a wood panel behind the board.
2. The knob is drawn but does not turn (the old painted hob's didn't either). Other: maani's working knob, which would be a mechanic change.
3. Two full-size tawas. Other: the old 0.7.

## Rows
| Row | State | Proof or reason |
|---|---|---|
| (none) | no row names roll-tawa | `grep -i roll-tawa docs/process/regressions.md`: 0 |

## For the orchestrator (not my files)
- **contract-112 (blocking), the lab's order pop-up at L2+ on phones:** the light around the eye-covered picture reads "not one box" (81% lit; 930x430: "corners too round"). It fires before the station opens. The base f794015 breaks the same (`rt-base-l2`). It is the kit's (`ui.js` word pop, `.wp-eye`). The gate plays only L1, so it passes.
- **`lab:cook/roll-tawa` played no stage** (871 s each at 740x320 and 930x430). Roll-tawa is not a lab-host game (`labs.mjs` COOK_GAMES). Not checked on the base. Drop it from the flow list.
- **No box spec for roll-tawa** (`boxes.mjs`), so `--rules` cannot run.
- **Advisory, mechanics' or kit's:** -120 (no kit shadow), -114 (`tawa.js` plate shrinks the chapati), -113 (the pill under the side cog), -119.

## Proof
The BEFORE evidence was not played at launch. The spec names no rows, so there is no before or after folder.
- **frame-counts:** roll-tawa 4 -> 0; chai-tray 0.
- **Gates, after the merge (891f97e):**
  - `GATE PASS roll-tawa: checks pass 2.4, contract pass 0.7; 3.1 min`: 0 blocking over 2 pages; advisory 22, the base's 22.
  - `GATE PASS chai-tray: checks pass 2.4, contract pass 22.1, boxes:chai-tray pass 3.3; 27.9 min`: 0 blocking over 38 pages; chai's boxes are identical.
- **Four sizes** (`s20-b2-roll-tawa-contract2`): 4 of 4 pages reach their end, 0 page errors; `CONTRACT FAILED: 42 breaks (contract-119 4, contract-120 10, contract-113 12, contract-114 16)`, all advisory.
- **check-change** (`build/reports/tiers/change-891f97eae6.md`): failed on scope alone, the merge's four files (566e5f7). Play: 21 advisory breaks after, 22 before. Film: pass.
- **checks.mjs:** 14 steps pass.

QA: roll-tawa L1-L3 · machine checks only, not yet judged · LAY ✅ CMP ✅ (kit hob, tray, wash) · TXT/LNG/AUD unchanged · rules: no spec
