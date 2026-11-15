# s20-maani-fable: MAA-26, MAA-27, MAA-28

## What changed
- **MAA-26, cause:** `js/cook/serve.js` `plan()` served maani as one dish (`return [{ who, dish: r, n: 1 }]`), and so does `flow.js` `servePlan()`. One pale picture came out; the bajr plate never did.
- **Fix:** at its end, maani draws each plate as it stands (each maani's look, size, place and turn). It hands them to the serve (`Cook.Serve.plated`, new), which puts one plate per cooked plate on the asker's tray, as chai's glasses each reach theirs.
- **MAA-27:** the plate's face circle uses chai's rule (`chai-tray.js:535`), on the plate's outer rim, clear of the maani.

**What a child sees:**
- **L3 and L4:** two plates on Nana's tray, bajr dark and plain pale, each as cooked.
- **L1 and L2:** one steel plate as cooked, where the cream plate used to be.
- **Faces, all sizes:** chai's size, 64 to 90 design px (was 59).

## Calls taken while Zafar was away
1. **I edited `serve.js` (not in my files):** MAA-26's cause is there. Other recipes are unchanged. Undo: revert it.

## Proof
- **Maani's gate:** `GATE PASS maani-line: checks pass 2.2, contract pass 12; 14.2 min` (0 blocking over 28 pages).
- **Chai's gate:** `GATE FAIL chai-tray: contract FAIL 21.5, boxes:chai-tray pass 3.3; 24.8 min`. The boxes are identical. The block is contract-129 (SH-304, L4 #child 1280x665, while ordering): intermittent, it passed three times since.
- **Four sizes:** 16/16 pages ended, 0 page errors; 6 advisory breaks (119 x4, 111 x2).
- **check-change** (`build/reports/tiers/change-687ff58854.md`): FAILED.
  - Scope: `docs/process/regressions.md`, which came from the merge.
  - Rows: MAA-26 and MAA-27 have no probe, so there is no before or after folder.
- **For the judge:** `build/screenshots/sidebyside/maani-line-L4-20261115-0640/`. The before: `.../maani-line-L4-before/`.

## Round 2: MAA-28 (no code)
- **Not a card change, and not a probe fault.** This L4 order had three kinds: two small bajr, one big plain, two small plain.
- The kit's row puts ticked cards first, in tick order (`js/shared/order-card.js:316-325`, chai's rule). At 740x320 two cards fit, and SH-307 blanks the cut third.
- Mid-cook: [bajr, hakri wadhi, blank]. Well done: [hakri wadhi, ba nindhi maani, blank (bajr)]. Each card keeps its word and picture, but the bajr card, ticked last, goes out of view.
- **For Zafar (kit, every game):** keep cards in their order place (recommended), or fold the card at well done.
- Rerun: `build/screenshots/sidebyside/maani-line-L4-20261115-1143/`.
- **Gates on the merged head (d273b07):**
  - `gate-20261115T1153-maani-line`: PASS, 16.3 min, 0 blocking over 28 pages.
  - `gate-20261115T1210-chai-tray`: FAIL, 26.7 min. Boxes 0/8 identical (the panel card's words under its light); contract-112 (side panel light, L4 740x320); contract-83 (card on Nana's face, 1 px²). All three are the kit's panel, not maani's code.
