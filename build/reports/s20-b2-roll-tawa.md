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

## Round 2 (RT-01 to RT-04, Fable standing in for Zafar, decision 38)
| Row | State | Proof or reason |
|---|---|---|
| RT-01 | built | the count's pill over the board (`UI.tallyAt`), never the corner; contract-113: 0 (was 14) at four sizes, L1 and L2 (`rt-r2c`) |
| RT-02 | built | `onboard` in roll-tawa's settings, put in `data.onboard` by its code: the kit's dim and gold box on the board; lights 12 judged, 0 failing (`rt-r2c`) |
| RT-03 | built | the lab's order is a maani dish: pop-out "char maani"; the card's row is the engine's maani sentence. Its words ("Muke maani khapeti.") are maani's, against Nana's bubble "Muke char maani khapanti." (the open khapanti/khapeti question for Mum) |
| RT-04 | built, except the sleeve's square end | each tawa's body on its burner (the picture moved by its body's measured offset), Nani's box per step on maani's step keys ("Roll it round.", "Take a dough ball.", "Firai!"), Nana's face beside the plate, the turner raised so the sleeve ends above the tray. The square end is the hand rig's (`hands.js`; art ART-84) |

**Kit faults found (not my files):** `Tally.place`'s keep-inside reads an empty badge's box as (0,0) and pushes it one stage-width right; `UI.onViewFit` did not re-place the tally when the side panel opened. Roll-tawa works round both.

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
