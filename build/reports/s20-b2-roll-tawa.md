# s20-b2-roll-tawa: roll-tawa joins the kitchen frame (15 Nov)

Files: `roll-tawa.js`, `roll-tawa.json` (`band`, `onboard`), `kitchen-frame.md`. No frame option added.

## What changed
**Round 1.** Roll-tawa reads only its play area, as maani does. The board and the hob are `area.row`'s stations, and each zone is fitted to its station. The sheet regions, footprints and wood crop are deleted.

**Round 2 (Fable for Zafar, decision 38).**
- **RT-01:** the count's pill sits over the board, not under the gear.
- **RT-02:** a first-time script in roll-tawa's settings, so the kit's dim light and gold box show the roll.
- **RT-03:** the lab's order is a maani dish: the item card "char maani" and the engine's sentence.
- **RT-04:**
  - each tawa's body centred on its burner;
  - Nani's box one step at a time, on maani's step keys;
  - Nana's face beside the plate;
  - the turner raised off the tray.

## What a child sees (every level, every size)
- Marble worktop and the stone tray, as in maani.
- The board and the hob are centred; on phones they shrink. L2-L3 has two burners with two full-size tawas.
- Each tawa sits on its flames.
- The order pops out as "char maani". Nani says one step at a time: "Roll it round.", "Take a dough ball.", "Firai!".
- The first roll is lit with a dim and a gold box.
- The pill sits over the board.

## Calls taken while Zafar was away
1. The board on marble, no wood panel. Other: a wood panel behind it.
2. The knob is drawn but does not turn. Other: maani's working knob (a mechanic change).
3. Two full-size tawas. Other: the old 0.7.
4. Nani's step lines are maani's (`maani-line:*`). Other: roll-tawa keys, which need new data rows.

## Rows
| Row | State | Proof or reason |
|---|---|---|
| RT-01 | built | contract-113: 0 (was 14) at four sizes, L1-L2 (`rt-r2c`) |
| RT-02 | built | lights: 12 judged, 0 failing (`rt-r2c`) |
| RT-03 | built | pop-out "char maani"; the row is maani's engine sentence, "Muke maani khapeti.", against Nana's bubble "Muke char maani khapanti." (the khapanti/khapeti question for Mum) |
| RT-04 | built, except the sleeve's square end | that end is the hand rig's (`hands.js`, ART-84) |

## For the orchestrator (not my files)
- **Chai's gate fails on the base, not on my change:** 24ac6d5 alone gives the same contract-112 (`lab:cook/chai-tray@L4@740x320`, aadu's light 48 px short) and boxes 0/8 identical. My files never load in chai.
- **Kit faults:**
  - `Tally.place` pushes an empty badge one stage-width right.
  - `UI.onViewFit` did not re-place the tally.
  - Roll-tawa works round both.
- **Flows:** `lab:cook/roll-tawa` cannot play: roll-tawa is not a lab-host game.
- **Rules:** there is no box spec for roll-tawa, so `boxes.mjs --rules` cannot run.
- **Advisory breaks**, the mechanics' or the kit's: -120, -114, -119.

## Proof
There was no BEFORE evidence: the spec names no rows.
- **frame-counts:** roll-tawa 4 -> 0; chai-tray 0.
- **Gates after merging 24ac6d5:**
  - `GATE PASS roll-tawa: checks pass 2.4, contract pass 0.7; 3.2 min`: 0 blocking; advisory 15 (was 22).
  - `GATE FAIL chai-tray: checks pass 2.8, contract FAIL 22.4, boxes:chai-tray FAIL 3.7; 28.9 min`: the base's own faults (above).
- **Earlier, after merging 891f97e:** `GATE PASS chai-tray ... 27.9 min`, with its boxes identical.
- **Four sizes** (`rt-r2c`, cook:roll-tawa L1 and L2): 8 of 8 pages end, 0 page errors; 52 advisory breaks (-114 28, -120 20, -119 4), 0 blocking.
- **Fable's run after** (`rt-pics-after`, 740x320 and 1280x665): both end, 0 page errors.
- **check-change** (`change-891f97eae6`, round 1): scope only (the merge's files).
- **checks.mjs:** pass.
