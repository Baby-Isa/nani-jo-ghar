# s20-maani-fable: maani's faults from the Fable eye judge (MAA-26, MAA-27)

## What changed
- **MAA-26, cause:** `js/cook/serve.js` `plan()` gave maani one entry, the recipe (`return [{ who, dish: r, n: 1 }]`), and `flow.js` `servePlan()` does the same. So one tray dish was served: the served picture `dish-maani`, a pale stack. There was no bajr picture and nothing for a second plate.
- **Fix:** at its end, maani draws a picture of each plate as it stands: the steel plate with its maani in their own look, size, place and turn, with the kit's shadow. The plate is foreshortened like the served pictures. Maani hands these to the serve (`Cook.Serve.plated`). The serve then puts one plate per plate cooked on the asker's tray, as chai's glasses each reach their tray. This works in both the lab and the story path, for that round only, used once.
- **MAA-27:** the plate's face circle uses chai's rule (`chai-tray.js:535`): `Kit.BADGE`, at least 30 px as seen, up to 90. It sits on the rim at the plate's outer side, 4 px clear of a lone maani, inside the stone tray, at badge depth.

**What a child sees:** at L3 and L4 (two doughs), two plates on Nana's tray: bajr dark, plain pale, each with the count and sizes cooked. At L1 and L2, one steel plate as cooked (it was the cream served plate). The plate faces now match chai's tray faces at every size: 59 design px before, now 64 to 90 (biggest on phones). With two plates, the first plate's face moves to its left.

## Calls taken while Zafar was away
1. **`serve.js` edited (not in my file list):** this is where MAA-26's cause is. The change does nothing for any other recipe. Undo: revert one commit.

## Proof
- **Gates:** `GATE PASS maani-line: checks pass 2.2, contract pass 12; 14.2 min` (0 blocking over 28 pages; advisory 119 x12, 36 x4, 111 x2). `GATE FAIL chai-tray: contract FAIL 21.5, boxes:chai-tray pass 3.3; 24.8 min`. Chai's boxes are identical. Its one block is contract-129 (SH-304's pop-up card over a bubble, lab chai L4 #child 1280x665, while ordering). The page passes twice on my branch and once on base, so it comes and goes and is the kit's, not mine.
- **Four sizes** (`s20-maani-fable-contract`): 16/16 pages reached their end, 0 page errors. 6 breaks, all advisory: contract-119 x4 (L1, the kit's card flash) and contract-111 x2 (L4 1920, piles sampled under a pop-up; it passes twice on my branch).
- **Evidence:** MAA-26 and MAA-27 have no probe (`evidence.mjs` refused), so there is no before or after folder.
- **check-change:** CC_LINE
- **checks.mjs:** 14 steps pass.
- **For the judge:** `build/screenshots/sidebyside/maani-line-L4-20261115-0640/` (after). The before, from the base, is `build/screenshots/sidebyside/maani-line-L4-before/`.

## Open
- The serve's other games are unchanged. Daar's "empty serve" (DAAR-61) could use the same `plated` hook.
