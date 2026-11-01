# s15-chai-11: chai, Zafar's 1 Nov play (builder report)

Branch `s15-chai-11` (from claude/nice-lovelace-0vfjcj b438801). Stopped early at the coordinator's word (Zafar waiting to play): the after run was stopped part way, and the contract run was not played.

## Proof
- BEFORE: played by me at the start from a pristine checkout of the base (no before existed): `build/screenshots/brief/s15-chai-11/<ROW>/before/` (run br-s15-chai-11-before-20261101-125616-am4). The new hooks (Cook.chaiPans, chaiAmounts, chaiBoil) are tool failures in the before, as expected.
- AFTER: partial (40 of 88 pages, in `build/screenshots/sandbox/ev-br-s15-chai-11-after-20261101-142134-uzc/`); not copied to the brief folder. **Found:** at L4 the sandbox's player, under load at test speed 3, misses the green; the new boil-over (CHAI-57) then empties the pan and starts it again, so several L4 pages time out at 300 s. Not a game freeze (the pot restarts as designed), but the player and the L4 green width at test speed need a look before the next proof run.
- Machine checks of my own (no frames): L4 lines, faces, the pop-out card, the boil (early, red, again, green), an L4 play to the end.
- Checks: `--only unit,docs,fixlist,load` (result in the hand-back). The full run's `leak` fails on clinic cut L1 and snap g1: the same on the untouched base, so not this branch's.

## Rows
- **SH-153 done** (code): Cook's bubble line has no speaker; the shared `Conversations.bubble` adds one only for `waits: true` (the clinic's lines lose theirs); the pop-up's bubble tap no longer replays. Not changed: `js/day/door.js`, `book.js` bubbles (not my files).
- **SH-139 done**: tray faces = burner face size (64), at least 30 px on screen, capped by the rim. 1280x665 L1: 26.9 to 37.4 px; 740x320 L4: 12.4 to 24.1 px. A face may now hang up to half past the tray's edge (CK-30 said less).
- **SH-180 done, unfilmed**: the folding card and the next one ease their heights (320 ms / speed), the panel's scroll glides with them.
- **SH-178 done, unfilmed**: the card light uses the card's next item; a card cut at the row's edge is glided in first.
- **SH-182 done**: `want()` follows the card order (water, tea, extra, milk, sugar); seen in an L4 play.
- **CHAI-33 done, unshot**: the lit box clears the pill by an even 8-16 px margin at its sides and below.
- **CK-57 checked, no code**: the before trace at L3 1280x665 shows the stage still (0 px) through the speaker change, so it was the browser's debugging bar.
- **SH-38 done**: sugar ticks at the number at every level, and an extra spoonful wiggles; the asked-for extra takes one spoonful.
- **CHAI-54 done**: half ticks at the first pour, full at the second; a pour past what was asked wiggles; no 2.6 s wait.
- **CHAI-55 done**: the `teach` rule in data/cook.json (cups.amount): seat 1 half, seat 2 full while adh or aako is at stage 1-2. The stuck hint for the second pour is the pour's control hint (L4: 13 s).
- **LNG-23 partly**: half cups say "Muke adh chai khape." through the engine's need frame, and the amount row stays on the card unsaid. Full, and cups with an extra or kari/mori, keep the amount said last: the engine would say "aaki", which is unrecorded and unconfirmed (decision 7: Mum's three questions).
- **SH-181, CHAI-56 done**: control lights only the first time each control comes up (first14), for a new player; otherwise the call alone, then the light with the call again after the level's wait (never for the knob at the green). Chai's coach is marked seen at the round's end. **contract-78 will flag** a returning player's call with no light: the check needs to follow Zafar's 1 Nov rule.
- **CHAI-57 done** (machine-checked): an early tap shakes the knob and Nani says hever na (Mum's clip, line `not-now`), and the heat runs on; green turns it down; red or no tap boils over (foam, steam), the pan empties, its rows reopen and it starts again; no mark.
- **ART-32 waiting on art** (the v3 foam stands in).
- **CHAI-43 done** (measured): the card is the widest that fits the room under the faces, up to the full card (1280x665: about 184x252; 1920x1080: 300), its ring inside its foot. On phones (740x320, 930x430) even the 100 px short card is too tall, so it zooms as the last step (speaker 43-46 px, under 48). 915x275 was not measured (no sandbox size).
- **CK-06 done**: one elchi pod and one ginger slice, cut from the existing pictures by an ellipse at run time, lie on the pan; they stay after the milk and fade and shrink at the boil. No new art.
- **ART-31 done**: no splash (removed from the art list), the pan settles, the sounds stay.

Also changed: build/core/cook-l1-order.test.mjs (CK-51 allows the half row said in its headline); recipes.js `slot=word` conditions and the seat index.
