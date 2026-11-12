# s19-clean-d: the round-two review's station findings (13 Nov)

Opus, high. Branch `s19-clean-d` (integration 416cb4754 merged), never pushed. Flaws first.

## Flaws and open
- **check-change not run** (dry run: 26 steps, about 196 min). Instead I ran the checks, the load check, the scope (my commits touch only my files and `assemble.js`, which the coordinator gave me) and the mount test (21 fails, the same 21 with my files at base: not mine).
- **CHAI-110 has no frame:** the evidence player pours the second half the moment the pan is back, before any light can show. It is measured at a child's pace instead (below). No before folder.
- **contract-44 against finding 6:** samosa's restored finger comes with its light; contract-44 forbids a finger in a light (4 breaks, as before). For Zafar or the checks' owner.
- **contract-100 at every wrong-order pop-up** (also without my lines). Shared: `order-card.js` `itemEl` sends a big card to the old `.oc-item`, not `items14`.
- Not mine: 115, 105 and 36 (sekelo's tray light, on load), 117, 114, 111, 109, 78.

## Finding 1, measured
At 740x320 L4 every tap reached its skewer: Phaser's hit test found the zone, nothing covered it, no light was up, and each tap ran its handler. Each of the 75 "nothing" taps put a skewer on the grill. It was near green for about 7 frames, charred before the player's tap and went back to the tray (`backToRack`), and the next tap started the loop again.
- **Cause: the frame rate.** During threading the page ran at 15 fps at 740x320 and 34 fps at 1280x665. The sandbox's `faceKit` hook took 1.16 s, and `getPropertyValue` 1.08 s, of every 4.6 s. One frame could move a ring 0.1 s × speed.
- **Fix (`grill.js`):** one frame moves the rings at most 1/30 s. At 30 fps or more nothing changes; a stuttering phone never skips the green.
- **Taps:** a grill skewer's tap area is now its whole coal-bed place: 64 px at 740x320 (was 35 px, with 13 px dead between). Tray skewers are 23x133 px, edge to edge across the whole tray.
- **Sandbox line:** in `faceKit`, measure each token once per sample, not once per face.

## Other findings
| # | change | proof |
|---|---|---|
| 3 | chai `review` and `afterReview` skip pans that are `gone` | L3 serve-wrong, faces at the 2nd serve: before 2, after 1 |
| 4 | CHAI-110's key spent in `onLight`, not when the step opens | L4, child's pace: pan back 74.1 s, light 74.7 s, held to the tap; an instant tap leaves the key unspent |
| 5 | eggs takes a2's `unasked`; the red ends with the round | eggs L3 serve-wrong, both sizes, ends |
| 6 | samosa's finger starts in `onLight` and stops with the light | code |
| 7 | `placeLit` only while the light shows (`!h.over && h.lit()`) | no contract-102 in sekelo L1-L4 |
| 8 | the deep layout needs only the grill; a missing tray draws `sk4-board`, never `sk3-rack-0` | tray blocked: before `__MISSING`, after the board, ends |
| a2 1 | chai: `got.extra`, `serveWrong(…, {unasked})` | `d-wo/cook-chai-tray-l3-serve-wrong/1280x665/c15-s19wo-open.png`: elchi ticked, jeeru crossed; 740x320 `c14`, `crossed: true` |
| a2 3 | chaat: the recast's work in `undoWrong`, passed as `undo` | checks |

Shared line (finding 6): `Onboard.gesture` turns `"tap"` into `"drag"`; let `"tap"` through. Mum: nothing new.

## Proof
- Sekelo L1-L4, 740x320 and 1280x665 (`d-sek-l1l4`): 8/8 ends, 0 page errors, `CONTRACT FAILED: 12 breaks (contract-117 1, contract-115 8, contract-106 1, contract-72 1, contract-112 1)`. With the CPU slowed 4x, L4 at 740x320 stuck at the grill before the fix; after it, the round ends.
- Four sizes, five flows (`s19-clean-d-contract`): 20/20 ends, 0 page errors, `CONTRACT FAILED: 12 breaks (contract-105 1, contract-78 1, contract-44 4, contract-117 2, contract-111 1, contract-109 1, contract-114 2)`.
- Serve-wrong (`d-wo`): chai and eggs L3, both sizes, 4/4 ends.
- Evidence after: `build/screenshots/brief/s19-clean-d/CHAI-110/after/`.
- `checks: 13 steps in 83 s`, all ok; loadcheck `5/5 pages load only what's on their screen`.

QA: builder only · checks ✅ · load ✅ · contract ❌ (owners named) · check-change not run · LNG ✅.
