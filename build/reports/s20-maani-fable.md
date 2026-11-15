# s20-maani-fable: MAA-26, MAA-27

## What changed
- **MAA-26, cause:** `js/cook/serve.js` `plan()` gave maani one dish, the recipe (`return [{ who, dish: r, n: 1 }]`), and `flow.js` `servePlan()` does the same. So one pale picture was served, and the bajr plate never reached the tray.
- **Fix:** at its end, maani draws each plate as it stands (the steel plate, its maani in their own look, size, place and turn, the kit's shadow, seen at the served pictures' angle). It hands these to the serve (`Cook.Serve.plated`, new). The serve puts one plate per cooked plate on the asker's tray, as chai's glasses each reach theirs.
- **MAA-27:** the plate's face circle uses chai's rule (`chai-tray.js:535`): `Kit.BADGE`, at least 30 px as seen, up to 90. It sits on the plate's outer rim, clear of the maani, inside the stone tray.

**What a child sees:**
- **L3 and L4:** two plates on Nana's tray, bajr dark and plain pale, each with the count and sizes cooked.
- **L1 and L2:** one steel plate as cooked, where the cream served plate used to be.
- **Faces, all four sizes:** chai's size, 64 to 90 design px (was 59). With two plates, the first plate's face sits on its left.

## Calls taken while Zafar was away
1. **I edited `serve.js` (not in my files):** MAA-26's cause is there. It changes nothing for other recipes. Undo: revert it.

## Proof
- **Maani's gate:** `GATE PASS maani-line: checks pass 2.2, contract pass 12; 14.2 min` (0 blocking over 28 pages).
- **Chai's gate:** `GATE FAIL chai-tray: contract FAIL 21.5, boxes:chai-tray pass 3.3; 24.8 min`. The boxes are identical. The one block is contract-129 (SH-304's card over a bubble, chai L4 #child 1280x665, while ordering). It passed on base once and on my branch twice since: intermittent, the kit's.
- **Four sizes** (`s20-maani-fable-contract`): 16/16 pages reached their end, 0 page errors. 6 advisory breaks: contract-119 x4 and contract-111 x2. The 111 page passed twice since.
- **check-change** (`build/reports/tiers/change-687ff58854.md`): FAILED.
  - Maani plays the same on base and branch: 14 advisory breaks each.
  - Block 1, scope: `docs/process/regressions.md`, which came from merging the working branch.
  - Block 2, rows: no evidence probe for MAA-26 or MAA-27, so there is no before or after folder.
- **checks.mjs:** pass.
- **For the judge:** `build/screenshots/sidebyside/maani-line-L4-20261115-0640/`. The before, from base: `build/screenshots/sidebyside/maani-line-L4-before/`.
