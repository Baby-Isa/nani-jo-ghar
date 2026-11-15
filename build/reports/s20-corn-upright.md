# s20-corn-upright: the chopped cob standing, the bowls aligned (15 Nov)

Decisions 36-38. Files: `corn.js`, `corn.json`, corn's cut pictures (two scripts, `registry.mjs`), `flow.js` (corn's served dish only).

## What a child sees
| Where | Round 1 (merged, 6d21559) | Round 2 (CK-127-132) |
|---|---|---|
| Band, grill, tray, plate | the short fat cob standing everywhere, a step bigger each place (201, 227, 257 units) | one shape in every state (350×140, 2.5:1) |
| Grill | | the heat ring round the cob, clear of its light; one cob centred at L1-L2 |
| Cooked tray | | each person's face circle in the well below their cob's place, at least 30 CSS px |
| Plates | the cob standing; bowls in aligned rows inside the tray | the well-done face in the face circle's place and size (one size); plates take the whole height |
| Bowls | | columns spread across the tray |
| Cards | the cob standing | the cob whole with 8% air, as chai's jar |
| Serve | | one tray per asker, their face on it, the cob standing on its plate |
| Turn call | | a cob's turn or lift stops Nani's reminder for the next cob, so its call comes with its light |

## Round 3 (CK-137)
'Shabash!' at the last plate's other corner, its card to the right, clear of the plate before; the grill and tray below or left of the settings cog (the larger of the two); each asker's served cob as cooked, with their own toppings (drawn by corn as the round ends, the plate's own painter); the plated cob at its tray size; a timed turn or lift lit with every call; the tray's faces clear of the cob's foot.

## Calls taken (recommended option)
1. Nani's drop-down mid-cook (CK-132): the kit clears it only while a control's call is said (`ui.js`, SH-172); it returns after (0.3-1.6 s, measured). Left to the kit.
2. The served picture is composed by script from the cream plate and the chopped cob (no new drawing), squashed to the serving view's angle.
3. The ring passes outside the light's box (the row: "clear of the light's edge"); inside it, contract-112 failed.

## Rows (statuses are the orchestrator's)
CK-127 to CK-131 built; CK-132 and CK-137 built except the drop-down (call 1) and 'hakro makai' on one line (the kit's card). Not mine: contract-83, a side-panel card over Nana.

## Proof
- **Round 3:** corn's gate (gate-20261115T1131-corn): contract 8.3 min, 2 blocking, both contract-83 (the kit's, left); advisory -119 ×8, -37 ×2, -70 ×2 (new: hint path, the turn call a little after the green), -78 ×1 (was 4). Its checks caught four colour literals, fixed in 3b7d155; `checks.mjs` now: all 14 pass. Chai's gate (gate-20261115T1150-chai-tray): checks pass, boxes pass (identical); contract 24.4 min, 2 blocking on chai's own L4 lab page (-74, -112) (no chai file changed). Side by side: `build/screenshots/sidebyside/corn-L3-round3/`.
- Rounds 1-2: this report at 1e6a041 and 0a2bd3b.
