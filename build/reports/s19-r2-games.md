# s19-r2-games: the games' reopened rows (13 Nov)

Branch `s19-r2-games`, never pushed. The integration branch (the eggs race fix, 362e8ef3e) was merged in before CK-76. There is no before folder, because the spec has no `rows`.

## What changed

- **SAM-38** (samosa.js): a strip lit for the next samosa gets the fill's line alone ("Bhar!"). A filling is named only while its heap is lit.
- **SAM-37** (samosa.js): the fill's first-time showing ends as the last strip fills, so its end point at the order card never comes before the fold. The fold's own first-time light follows.
- **CK-76** (eggs.js): the carton line is now "Indo khan!", the engine's command made from v.take and n.egg.
- **CK-100** (baking.js): the bowl's face circle sits beside the bowl, clear of its light, and is not one of the bowl's lit parts.
- **CK-105** (corn.json): `card.slots` puts the cob first. Without slots, order.js shuffled a person's rows.
- **DAAR-39** (chop mechanic and station): the strip's box runs from the board's left edge to the knife.
- **SEK-29** (grill.js): at 740x320 the group shrinks just enough to end 6 px left of the cog. The next cook stage fades in on each piece, so the meat browns by degrees.
- **CK-112's label** (maani-line.js): the word pill sits 10 page px above the board at every size.
- **CK-105's probe** (evidence.json, my row only): max raised from 8 to 16.

## Proof

- Evidence: `build/screenshots/evidence/s19-r2-games-ev/` (10 rows, index `build/reports/evidence-s19-r2-games-ev.md`). SEK-29 and CK-105 were re-played on the final code in `.../s19-r2-games-ev2/`.
- Contract L1-L4, 740x320 and 1280x665: `build/screenshots/sandbox/s19-r2-games-contract/contract.md`, "CONTRACT FAILED: 84 breaks", 64 of 64 ends. The baseline had 63 on the same pages. 18 page/check pairs got better and 40 got worse. Most are timing checks the baseline breaks on other levels too. Two come from this branch:
  - **contract-105** (chop and daar, 740x320): Zafar's DAAR-39 strip now spans the board, so its middle is off the vegetable.
  - **contract-115** (mishkaki, 740x320): the grill fell to 59% of the height. With the cog gap cut to 6 px, `s19-r2-games-sek/contract.md` shows "CONTRACT FAILED: 1 breaks (contract-72 1)", a check the baseline also breaks. contract-115 is gone.
- L1 at 930x430 and 1920x1080: `s19-r2-games-contract4/contract.md`, "CONTRACT FAILED: 18 breaks", 16 of 16 ends. None of them is contract-105 or -115.
- Checks: `node build/tools/review/checks.mjs`: 14 steps, all ok (unit 926 pass, 0 fail; recordings current); loadcheck 27/32, the same five fails as before (s19-taps.md)
- check-change: not run. Its dry run plans 264 minutes. The contract runs above are its play steps.

## Rows

- **SAM-38 DONE** (`ev/SAM-38-2.png`, 740x320): every light under "Bhar! Chundo." is on the chundo heap. A strip is lit only under "Bhar!".
- **SAM-37 DONE** (`ev/SAM-37.png`, `-2.png`): the fold has one box, on the dough. The order card is never lit, at either size.
- **SAM-35 LEFT (shared; Zafar)**: the "ba samosa" card is SH-267's L1 dish flash (`ui.js` UI.dishFlash, Zafar 12 Nov). That file is read-only here, and flash versus no dish card is his call. The order card holds only fillings.
- **SEK-29 DONE** (`ev2/SEK-29-2.png`): the tray is clear of the cog at 740x320, the meat browns over 0-4.4 s, and the raw skewer is lit at 0 ms.
- **CK-112 LEFT (shared), label DONE** (`ev/CK-112-2.png`): the low card is the pop-up's said-along card under the dish flash (`ui.js`, `request-popup.js`). The pill clears the board.
- **DAAR-39 DONE** (`ev/DAAR-39.png`): the strip runs edge to edge of the board, with the knife, at both sizes.
- **CK-76 DONE** (`ev/CK-76.png`, four sizes): the lines are "Indo khan!", "Indo wiji chad!", "Tarelo indo hane kadh.", then grey "Serve (put it on the plate)!", which is on the recording sheet. **Mum should confirm "Indo khan!".**
- **CK-100 DONE** (`ev/CK-100-2.png`): the face circle sits beside the bowl, the tray and the oven, outside every box.
- **CK-102**: the shelf part is DONE. The tray part is LEFT (shared): `serve.js` lands each dish after its tray. The card folding at well done is OrderCard's settle (Zafar, 5 Nov), which is **his call**.
- **CK-105 DONE** (`ev2/CK-105.png`, `-2.png`): at L3 each card starts with hakro makai, and ticked cards stay in place.
