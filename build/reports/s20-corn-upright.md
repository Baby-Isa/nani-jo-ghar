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
- **Corn's gate** (round 2, final code): checks pass 3.3 min; contract FAIL 6.8 min, 2 blocking: contract-83 ×1 (kit) and contract-109 ×1 (hint, 740x320: 66af686's skip never fires because the probe sees only the bottom row; told the orchestrator). Advisory: -119 ×8, -37 ×2, -78 ×1; -112, -113, -114 and -129 are 0.
- **Chai's gate:** CHAI_LINE
- **Side by side:** SBS_LINE
- Round 1's proof: this report at commit 1e6a041.
