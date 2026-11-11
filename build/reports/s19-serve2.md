# s19-serve2: the serving kitchen on its real art (11 Nov)

Opus, high. Branch `s19-serve2`, never pushed.

## What changed
- **The kitchen** (`assets/cook/serve/kitchen-tall.webp`): KG to 2100x1575 by LANCZOS and a light sharpen (no Real-ESRGAN here). Measured on KG: the island's back edge at core y 608.5 (K1's 608), so no shift; its front lip at design 1015-1030. The ordering view keeps today's 292 px of marble; the serving view (158 down) is the island's top. The occluder (611) sits 3 px inside the marble, as before.
- **KO, KS** (two-picture mode): 2100 wide, 130 and 216 px down, each back edge on the same world line. KS matches KG's serving view.
- **The tray** (480x208): one person's, tray-src's two ends joined (no seam). Rim and floor measured; trays on the island's middle (design y 812).
- **The dishes** (`serve.js`): every game's own (sekelo for mishkaki, naan for baking, chop's bowl on Nani's tray; eggs keep plate-table), each at its size class as a share of the tray: plate 0.58, bowl 0.39, glass 0.17 (the plan's 30:20:9). Before, corn, naan and chop had no dish; samosa, chaat and sekelo the old art.
- **The glide** runs on the clock: 0.8 s whatever frames drop (as a tween it overran contract-80's 1 s window on 5 of 40 pages).
- **`data/cook.json`**, for other builders: s19-games-2: (1) fru-04 → `v4/pantry/orange`; (2) the orange and (3) `served/pantry-basket-v2` in the pantry's manifest; (5) veg-12 `sizeFlag: LONG`; (4) not changed: the atta file exists and loads; the fault was baking's manifest lacking it (added, below). s19-games-1: (1, 2) daar, samosa, maani and sekelo prefetch their v4 pieces, not the old pots, karahi, plate, chakla, velan, heaps; (3) samosa's manifest takes its v4 karahi and plate, `f-mince` and `served/samosa`, sekelo's `served/sekelo` (duplicates of their settings' lines: either may go). Load check: baking's flour and chaat's chickpeas added.

## Proof
- **After folder**: none: the brief has no rows, so `evidence.mjs --after` plays nothing.
- **Before** (stand-in, `5646e13`): `build/screenshots/sandbox/s19-serve2-before/` (ten games, 1280x665). **After**: `s19-serve2-contract/` (four sizes), `s19-serve2-people/` (chai L3: two trays; eggs L3, L4: three).
- **The serve, measured** (drawn boxes, 1280x665): each game's dish on the asker's tray; plates 135 px on a 234 px tray, bowls 91, glass 40. Three trays 201 wide, 32 px apart. 740x320: tray 130x55 inside the canvas.
- **Contract**: `CONTRACT FAILED: 375 breaks (contract-36 74, contract-106 25, contract-116 35, contract-24 11, contract-102 23, contract-70 10, contract-91 19, contract-114 78, contract-73 4, contract-79 2, contract-80 1, contract-96 2, contract-37 18, contract-107 11, contract-83 2, contract-104 9, contract-18 2, contract-66 3, contract-22 1, contract-105 6, contract-115 11, contract-87 1, contract-111 14, contract-78 2, contract-109 2, contract-53 4, contract-92 3, contract-112 1, contract-1 1)`. 39/40 ends; sekelo 930x430 hit its 300 s limit in the grill, before the serve. At 1280x665: 100 before, 83 after. The serve's own: one contract-80 (maani 740x320, a 1 s page stall mid-glide); the rest are the stations'.
- **check-change** (`--base 5646e13ca`: the branch's start; origin/main's merge base would audit other builders' files): `build/reports/tiers/change-54b13d155a.md`, FAILED. Scope ok; 104/104 pages reached their end, 0 page errors; 487 breaks vs the base's 458; the 74 new ones are station checks (114, 37, 116...), none the serve's, none a contract-80. Blocking steps: push (the 3 art-block unit tests reading `sources/`, absent here); frozen (timed out; its orphaned replay then held port 8913, so mount, leak and loadtime failed to start). Rerun alone: mount 21 fails, the same 21 on the base tree; leak cook ok; loadtime daar +34%, samosa +20%, the same on the base tree (34.9 s, 30.7 s).
- **Load check**: 32/32 pages.
- **checks.mjs**: all ok but unit (the same 3) and leak (clinic timed out: a busy machine).

## Needed
- **Pictures of the serve**: no sandbox state lands on the dishes (the end card covers them). A row with `at: every:drv:dish-served`, the whole screen and `zoom2:hook:cook.servedTray`, on the ten flows at 1280x665, would give the judge before|after.

## Open
- Two-picture mode only: KO's flatter island shows 171 px of marble, not 292.
- The dishes draw at 0.25-0.45 of their cut size ("as cut"); cut to size they'd load lighter.
