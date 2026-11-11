# s19-serve2: the serving kitchen on its real art (11 Nov)

Opus, high. Branch `s19-serve2`, never pushed.

## What changed
- **The kitchen** (`assets/cook/serve/kitchen-tall.webp`): KG 1448x1086 to 2100x1575 by LANCZOS and a light unsharp mask (no Real-ESRGAN on this machine). Measured on KG, not the stand-in: the island's back edge at picture y 1058.5 (core y 608.5, K1's 1058), so no shift; its front lip at design 1015-1030. The ordering view keeps today's 292 px of marble; the serving view (158 down) is the island's top. Today's cabinets, stove and family line sit where they were; the occluder (611) is 3 px inside the marble, as before.
- **KO and KS** (the two-picture mode): 2100 wide, KO 130 px and KS 216 px down, so each back edge lands on the same world line; the wall's top row carried on above. KS at drop 158 matches KG's serving view almost exactly; KO shows less marble than KG (its island is flatter).
- **The tray** (`tray.webp`, 480x208): one person's tray cut from `tray-src.webp` (its two ends, 840 of 1400 px, joined over an 80 px blend: no seam), about 45 x 30 cm. Front rim at 0.875 and the floor's middle at 0.495 of its height, measured. Trays sit on the island's middle (design y 812).
- **The dishes** (`js/cook/serve.js` DEFAULTS): every game's own picture, by recipe (chai, maani, daal, mishkaki → sekelo, samosa, chaat, corn, baking → naan, chop; eggs keeps its plate-table fried/boiled). Each is drawn at its true size class as a share of its tray's width: plate 0.58, bowl 0.39, glass 0.17 (the art plan's 30 : 20 : 9), its foot or centre on the floor's middle. Before, only chai, maani, daar and eggs had a dish; chaat, samosa and sekelo showed the old served art, and corn, naan and chop had nothing.
- `data/cook.json`: the kitchen's line and notes only.

## Proof
- **After folder**: none. The brief names no fix-list row, so `evidence.mjs --after` has nothing to play (no `build/screenshots/brief/s19-serve2/`).
- **Before** (stand-in, base `5646e13`): `build/screenshots/sandbox/s19-serve2-before/` (ten games, 1280x665). **After**: `s19-serve2-contract/` (ten games, four sizes) and `s19-serve2-people/` (chai L3: two trays; eggs L3, L4: three).
- **The serve, measured** (the runs' drawn boxes, 1280x665): every game lands its own dish on the asker's tray (chop on Nani's). Tray 234x101 px; plates 135 wide (0.58), bowls 91 (0.39), glass 40 (0.17), each inside its tray. Three people: three trays 201 wide, 32 px apart, none off screen. 740x320: tray 130x55 inside the 516x320 canvas.
- **Contract**, last line: `CONTRACT FAILED: 375 breaks (contract-36 74, contract-106 25, contract-116 35, contract-24 11, contract-102 23, contract-70 10, contract-91 19, contract-114 78, contract-73 4, contract-79 2, contract-80 1, contract-96 2, contract-37 18, contract-107 11, contract-83 2, contract-104 9, contract-18 2, contract-66 3, contract-22 1, contract-105 6, contract-115 11, contract-87 1, contract-111 14, contract-78 2, contract-109 2, contract-53 4, contract-92 3, contract-112 1, contract-1 1)` (`s19-serve2-contract`). Every page reached its end except mishkaki-grill 930x430 (the flow's 300 s limit, in the grill, before any serve; a loaded machine). At 1280x665, 100 breaks before and 83 after; none is the serve's except one contract-80 (maani 740x320): the page stalled 1 s mid-glide. The glide now runs on the clock (it ended past the 1 s window on 5 of 40 pages when it was a tween).
- **checks.mjs**: words, static (0 new), bump, specs, docs, stdids, recordings, fixlist, decisions, art (0 fail), size ok. unit: 3 fail (the art-block tests that read `sources/`, absent here, as s19-serve). leak: clinic timed out (a busy machine; clinic untouched).
- **check-change**: CHANGE_LINE

## Needed from other owners
- **Pictures of the serve**: the brief has no fix-list rows, so `evidence.mjs --after` has nothing to play and there is no `build/screenshots/brief/` folder. No sandbox state lands on the dishes (the end card covers the counter). A row with a probe would give the judge the picture: `at: every:drv:dish-served`, capture the whole screen and `zoom2:hook:cook.servedTray`, on the ten flows at 1280x665 (the cook player already holds the dishes 3 s for it). Until then the sizes are measured from the runs' drawn boxes (above).

## Open
- **KO/KS** (two-picture mode only): KO's island is flatter, so the ordering view shows 171 px of marble, not 292; KS's carried-on top shows 5 px at the top of a 1280x665 serving view. The tall painting (the setting) has neither.
- The dishes are drawn at 0.25-0.45 of their cut size; cut at drawn size they would load lighter (an art call, not made: "as cut").
- Not mine: page stalls of up to 1 s at the serve's start were there before too (frames 0.4-0.75 s apart on the stand-in).
