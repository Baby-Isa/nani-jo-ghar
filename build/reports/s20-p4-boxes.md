# s20-p4-boxes: stand still, read the boxes, take the pictures (13 Nov)

Branch `s20-p4-boxes`, never pushed. No game file changed.

## What changed

- **`js/cook/test-stand.js`** (test only, injected by `boxes.mjs`, inert unarmed or in a store build): fixed dice (reseeded at the round's and each stage's start); holds the clock, timers, frames, taps, animations and sound at a named moment.
- **`build/tools/review/boxes.mjs`**, with `build/sandbox/lib/boxes.mjs`, `boxes-play.mjs` and `boxes.test.mjs` (8 tests). The fair bot plays chai, L1 and L4, four sizes, stopping at the order, the first light, mid-cook (the knob asked), the serve, well done and the end. At each: exact boxes, words (cut or not), a picture; compared with `build/frozen/boxes/chai-tray/`, pixels only at the order and the end inside their cards; a differences sheet; its minutes.
- **What it took** (found by running): moments held at the game's own notes, so help on a timer never lands in one run only; item cards read in their row's coordinates (a glide ends where timing puts it); face rims left out of the pixels (anti-aliased up to 8 of 255 run to run; their boxes still exact); a still picture counts once two shots agree.

## Proof

- **Three runs identical** (`--prove --run-id p3`): runs 2 and 3 matched run 1 on 8/8 pages (L1, L4 × four sizes), 0 differences (`build/screenshots/boxes/p3-r1/proof-chai-tray.json`).
- **Four planted faults caught** (L1, 740x320), each in the box where it was planted:
  - a box moved 4 px: `mid tray left +4, right +4`;
  - a card over a face: `mid card-1/item-1` moved;
  - a cut word: `order cut nani/word#1 now cut`;
  - a light off its target: `light light-1 left +20, right +20`.
- **The gate's minutes:** 4.0, 3.9, 4.0 a run; 13.9 for the whole proof (ceiling 20).
- **The reference.** `build/frozen/boxes/chai-tray/` (run p3-r1, 8.7 MB) is the machine's reference until Zafar approves P6's pictures.
- **On the reference:** `--run` (gate-1) "pass the box gate, chai-tray: 4.1 minutes"; `--diff --run-id p3-r3` "pass ... 8/8 pages identical".
- **Contract:** `build/screenshots/sandbox/s20-p4-boxes-contract/contract.md`, "CONTRACT PASSED: 0 breaks over 4 pages".
- **Checks:** tier 0 (`check-push`, all of `checks.mjs`) passes on 65fc48a6a (`build/reports/tiers/push-65fc48a6ac.md`). The static lint's two `.play()` finds in test-stand.js were fixed first.
- **check-change (tier 2): not finished, no result file.** push passed. scope failed on `sources/audio/mum-2026-11-12/voice-261112-113106.md`, which the base has, not this branch. play (L1-L4 and paths, 740x320 and 930x430) finished in 45 minutes with 19 contract breaks, all on chai's own paths: contract-37 (6), -99 (4), -124 (3), -36 (2), -84, -72, -112 and -121. Stopped in the base tree's run, about an hour short. No page loads anything this branch changed, so the breaks are chai's own (P2).
- **Evidence:** the brief has no rows, so there is no before or after.

QA: tools only · builder · Auto: boxes --prove ✅, contract (L1 at 4 sizes) ✅, check-push ✅, check-change ⚠ not finished · Screens: none changed · Regressions rechecked: none named

## Hooks a game needs (named, not added)

1. **The play area as a box:** "play" is read from `Cook.view` until step 1's frame function publishes it.
2. **Named main things** (e.g. `njgTest.cook.mainThings()`) before eggs, maani and corn join: today texture keys find hob, tray, pans and the band.
3. **An "order-landed" note:** chai's fold, station and first light come together, so the order picture is the card as it first stands (L1 the headline only, L4 empty slots).
4. **A mid-cook note:** "the knob asked" is read from the expectation at the next note.
5. For the orchestrator: add `build/sandbox/lib/boxes.test.mjs` to `checks.mjs` unitFiles, and a line for `boxes.mjs` in `docs/tools.md`.
