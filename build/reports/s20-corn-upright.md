# s20-corn-upright: the chopped cob standing, the bowls aligned (15 Nov)

Decisions 36-37. Files: `corn.js`, `corn.json`, five cut cob pictures (`s20-corn-upright-cut.py`), registered by `registry.mjs add` and `--map`. `grill-kit.js` untouched.

## What a child sees
| Where | Change |
|---|---|
| Band, all sizes | four short, fat cobs standing in a row, one per quarter of the tray (were two by two, lying) |
| Grill, tray | the same standing cob, a step bigger each place: band 201, grill 227, tray 257 units; ring just above it |
| Plates | the cob stands, as big as the plate holds it (no −10° tilt); at 740x320 two plates 316 wide (were 284); the well-done face over the plate's bare corner, clear of the cob |
| Bowls | 740x320: two rows, column by column, centred inside the tray with a pill gap; row gap 52 units, under a pill's 54. 930 up: one row inside the tray (930 used to run past it) |
| Cards | item card and pop-up: the chopped cob standing, filling the picture's height |
| Dressings | on the standing cob, inside its outline; 0.41× the marks (same per kernel) |

## Rows (statuses are the orchestrator's)
| Row | State |
|---|---|
| CK-104 | built (column centres equal; inside the inner edge) |
| CK-117 | built (one rotation everywhere) |
| CK-118 | built: 740x320 L3, the cob on its plate 1,501 CSS px² before (332×53 units, tilted), 2,766 after (269×106, standing) |
| CK-119 | built |
| SH-256 | corn: contract-114 0 (2 on the working branch) |

Not mine: on Nani's counter at the end, the served cob still lies flat (`flow.js`).

## Proof
- **Before:** not played at launch. The sheet's before is the working branch played by the sandbox (`NJG_GAME_ROOT`): `build/reports/s20-corn-upright-before-after.png`.
- **Evidence --after:** refused: CK-117, CK-118 and CK-119 have no probe.
- **Four sizes** (s20-corn-upright-final): 20/20 ends, 0 page errors, `CONTRACT FAILED: 19 breaks (contract-129 5, contract-119 8, contract-83 2, contract-37 2, contract-78 2)`; -109, -112, -113, -114 and -115 are 0. The base breaks -129 with the same boxes, and -83 too.
- **Corn's gate** (gate-20261115T0558-corn): checks pass 2.5 min; contract FAIL 6.8 min, 11 blocking. Ten are -129 ×7 and -83 ×2 (on the base too). One is **-109, a conflict with CK-104**: with a hint lit, two band bowls must sit on chai's lines (pills at 307 CSS px at 740x320), past the tray's inner edge (about 310 less its margin). I kept Zafar's word. My -112 and -92 are fixed.
- **Chai's gate** (gate-20261115T0607-chai-tray): checks pass 3.5 min; contract FAIL 22.8 min (-129 ×3, chai's pop-up); boxes FAIL 3.8 min, all 160 differences in Nani's box (SH-301).
- **frame-counts:** corn 0, chai-tray 0. **check-change:** CHANGE_LINE
- Pushing needed an empty local `build/reports/s20-corn-calls/` (a gitignored folder a doc names).
