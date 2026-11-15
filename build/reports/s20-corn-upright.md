# s20-corn-upright: the chopped cob standing, the bowls aligned (15 Nov)

Decisions 36-38. Files: `corn.js`, `corn.json`, corn's cut pictures (`s20-corn-upright-cut.py`, `-served.py`, registered by `registry.mjs`), `flow.js` (corn's served dish only, `servePlanOf`).

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

## Calls taken (recommended option)
1. Nani's drop-down mid-cook (CK-132): the kit clears it only while a control's call is said (`ui.js`, SH-172); it returns after (0.3-1.6 s, measured). Left to the kit.
2. The served picture is composed by script from the cream plate and the chopped cob (no new drawing), squashed to the serving view's angle.
3. The ring passes outside the light's box (the row: "clear of the light's edge"); inside it, contract-112 failed.

## Rows (statuses are the orchestrator's)
CK-127 to CK-131 built; CK-132 built except the drop-down (call 1). Not mine: contract-83, a side-panel card over Nana's face (the base has it).

## Proof
- **Corn's gate** (gate-20261115T0925-corn, after merging 41eae54): checks pass 2.4 min; contract FAIL 6.6 min, 4 blocking, all contract-83 (a side-panel card over Nana: the kit's or the lift's, left as the orchestrator said). Advisory: -119 ×8, -78 ×4, -37 ×2; -109, -112, -113, -114 and -129 are 0.
- **Chai's gate** (gate-20261115T0934-chai-tray): checks pass 2.6 min; boxes **pass** 3.5 min (identical); contract FAIL 22.5 min, 1 blocking: contract-112 on chai's own aadu card at L4 740x320 (no chai file changed).
- **Side by side:** `build/screenshots/sidebyside/corn-L3-round2/` (judge-batch.md; 5 contract breaks listed: -78 2, -117 2, -37 1, as the round-1 run had).
- Round 1's proof: this report at commit 1e6a041.
