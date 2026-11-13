# s20-p4-boxes: stand still, read the boxes, take the pictures (13 Nov)

Branch `s20-p4-boxes`, never pushed. No game file changed; the brief has no rows, so there is no before folder.

## What changed

- **`js/cook/test-stand.js`** (test only): no page loads it. `boxes.mjs` injects it, and it does nothing without the harness's arm or in a store build. It fixes the dice (a seed, started again at the round's start and at each stage), holds the page's clock, timers, frames, taps, animations and sound at a named moment, and lets them go.
- **`build/tools/review/boxes.mjs`**, with `build/sandbox/lib/boxes.mjs`, `boxes-play.mjs` and `boxes.test.mjs` (8 tests). The fair bot plays chai at L1 and L4 at four sizes. It stops at six moments: the order, the first light, mid-cook (the knob asked), the serve, well done and the end. At each it reads exact boxes and the words (cut or not), keeps a picture and compares with `build/frozen/boxes/chai-tray/`. Pixels are compared only at the order and the end, inside their cards. The tool writes a differences sheet and prints its minutes.
- **What it took** (found by running): moments held at the game's own notes, so help on a timer never lands in one run only; item cards read in their row's coordinates (a glide ends where timing puts it); face rims left out of the pixels (anti-aliased up to 8 of 255 run to run; their boxes still exact); a still picture counts once two shots agree.

## Proof

- **Three runs identical.** Chai, L1 and L4, at 740x320, 930x430, 1280x665 and 1920x1080. The command was `boxes.mjs --game chai-tray --prove --run-id p3`. Runs 2 and 3 matched run 1 on 8 of 8 pages, with 0 differences. Results: `build/screenshots/boxes/p3-r1/proof-chai-tray.json`.
- **Four planted faults caught** (L1, 740x320), each in the box where it was planted:
  - a box moved 4 px: `mid tray left +4, right +4`;
  - a card over a face: `mid card-1/item-1` moved;
  - a cut word: `order cut nani/word#1 now cut`;
  - a light off its target: `light light-1 left +20, right +20`.
- **The gate's minutes.** Each run takes 4.0, 3.9 and 4.0 minutes. The whole proof, plants included, takes 13.9 minutes, under the 20-minute ceiling for a game change.
- **The reference.** `build/frozen/boxes/chai-tray/` (run p3-r1, 8.7 MB) is the machine's reference until Zafar approves P6's pictures.
- **On the reference:** `--run` (gate-1) "pass the box gate, chai-tray: 4.1 minutes"; `--diff --run-id p3-r3` "pass ... 8/8 pages identical".
- **Contract:** `build/screenshots/sandbox/s20-p4-boxes-contract/contract.md`, "CONTRACT PASSED: 0 breaks over 4 pages".
- **Checks:** `checks.mjs` passed 13 of 14 steps. The 14th, static, flagged two `.play()` calls in test-stand.js. Animations are now held by their rate instead, and `static.mjs` reports 0 new findings. Unit tests: 924 pass; the only 2 fails were that static finding.
- **Evidence:** `--after` has no rows, because the brief names none.
- CHECK_CHANGE_HERE

## Hooks a game needs (named, not added)

1. **The play area as a box:** "play" is read from `Cook.view` until step 1's frame function publishes it.
2. **Named main things** (e.g. `njgTest.cook.mainThings()`) before eggs, maani and corn join: today texture keys find hob, tray, pans and the band.
3. **An "order-landed" note:** chai's fold, station and first light come together, so the order picture is the card as it first stands (L1 the headline only, L4 empty slots).
4. **A mid-cook note:** "the knob asked" is read from the expectation at the next note.
5. For the orchestrator: add `build/sandbox/lib/boxes.test.mjs` to `checks.mjs` unitFiles, and a line for `boxes.mjs` in `docs/tools.md`.
