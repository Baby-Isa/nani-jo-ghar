# s19-lights: one shared first-time light in every game; maani's, chaat's and samosa's first times (8-9 Nov)

Opus, high. Branch `s19-lights`. Flaws first.

## Flaws and open
- **Breaks left, none from this branch's code:**
  - Corn's serve light (CK-61) is read by contract-105/53 as a light round the cob, not its plate.
  - Mishkaki `veg-03` at 1920x1080: the probe's thing leaves out the pill at the screen's foot, so the correct light reads 20 px low.
  - Chaat's first topping, 1280x665 (92/105): `Shelf.pillScale` puts its pill 2 px under `ph-chana`'s pot (SH-243).
  - 109 (shelf line) in samosa L2-L4 and corn; 11 is corn's background art.
- **The kit's card light** stops 5-7 px short of the first item card's top at 740x320 and 930x430 (chai, eggs: 105, CK-63). It came on the
  pre-change kit too. Not fixed.
- **Chai's frozen diff** (`frozen-diff-chai-tray-202611091235`): 22 new 102/105 breaks at 740x320, plus the glass sound (5cb662c). The
  breaks are the jars' hint glow, the card light above and the glass's light. The same kinds came on the pre-change kit
  (`s19-lights-chai-base`), and the fingerprint predates contracts 102-109. Chai needs a re-freeze.
- **MAA-21:**
  - The stop is at 0.92 of the rim (data `rimStop`). The lab shows it beside the rim itself for Zafar's pick.
  - "Before big and small" means L1 only today: the orders ask big/small from L2, not L4 as the row says. The stop follows the sizes;
    MAA-23 will move both.
- **CHT-19's replay** is the first builder's; not re-run.
- **Maani's plates** stay on the band, unlit (the child never picks one). **MAA-23** is left for later, as asked.

## What changed
- **Kit:**
  - one light at a time;
  - the light goes as the move starts;
  - one finger, now shown only while it presses (contract-44);
  - the room round the thing, its pill (`pillW` too) and its face;
  - only shelf things hop;
  - staged script steps;
  - the stuck help, its wait in a child's time;
  - `Onboard.rectOf` reads a list as one box;
  - `S$.step`'s idle help lit through the kit.
- **Maani:**
  - MAA-21 (9 Nov): before big and small, every roll stops hard just inside the rim. There is no ring and no tear; the juice sound
    plays, then the roll ends by itself.
  - The roll's demo is the kit's finger with the pin riding it (MAA-20).
  - The flip's first time comes in the green (MAA-19).
  - The next pile is lit only once the maani has landed (MAA-22).
  - The stuck help; the asker's face on the plates.
- **Chaat:** the coach lights each next topping; its own demo has gone (CHT-18).
- **Samosa:** the fry is staged: the knob, each samosa, then the lift in the green (SAM-30).
- **Nani's drop-down** comes back once a call that cleared it has been said (`station-lib.js`; contract-101, samosa).
- **Lab** (`kit-lights.html`): `roll-pair` (finger and circle side by side) and `rim-stop`.

## CHT-19 (first builder's replay)
Seeds 9001-9010 at L1-L4: every call named the card's next layer; the "no" row was never called. No fix.

## Proof
- **Four sizes, 8 flows, `--check`** (`s19-lights-contract3`): 32/32 reached their end, **0 page errors**.
  - `CONTRACT FAILED: 10 breaks (contract-92 1, contract-105 3, contract-101 3, contract-53 1, contract-109 1, contract-11 1)`.
  - `CHECK FAILED: 53 new findings`: all order-card and grown-ups' text and tap sizes.
- **After the helper fix** (`s19-lights-helper`, 3 sizes): 24/24, 0 page errors, 5 breaks, all corn's.
- **Gate rows:** 102, 106 and 107 are at 0 in every run. 105 has 3: chaat's pill, mishkaki and corn.
- **Levels** (`s19-lights-levels2`, 1280x665: maani L2-L4 and hint, chaat and samosa L2-L4, baking): 11/11, 0 page errors.
- **Tests:**
  - `test_shared_lights_s19.mjs`: 12/12.
  - `test_lights_s19_page.mjs`: all ok.
  - `checks.mjs`: 11/12. The failing step is unit's `CONTRACT_ROWS` (SH-244/245, from the integration branch).
- **After** (`build/screenshots/brief/s19-lights/`, 184/184 pages):
  - Machine PASS: SH-237, CK-61, DAAR-43. Machine FAIL: CK-63 (the card light).
  - 8 rows for the judge.
  - Tool failures are spec problems: SH-119 (`.njg-spot`), SH-236 and MAA-22 at L3 (a still strip), SH-228 (eggs).
  - The disk filled mid-run; superseded runs (5 GB) deleted, crashed pages replayed.
