# Cook v3 art (29 Sept play-test)

Cut by `python3 build/cut_cook_v3.py` from `sources/art/cook-v3/` (the 28 ChatGPT sheets from
`docs/archive/art-prompts/chatgpt-art-prompts-cook-v3.md`, renamed to their "save as" names). The method is `docs/archive/process/VISUAL-QA.md` §2's:
colour-to-alpha edges, flat grey inside loops and holes made transparent (and checked: no `#808080` left inside a
cut), ChatGPT's drawn drop shadows removed, and one registered canvas per object shown in several states.

Each folder's `meta.json` holds, per sprite: `w`, `h` (px), the sheet it came from, and what was **measured from the
art**, as fractions of the sprite's own width (x, r) and height (y): `cx, cy, r` = the round body's centre and radius
(handles left out; `fit_px` = how round it is), `burners` = each burner's centre, `frontY` = the middle of the hob's
front strip (the badges and knobs), `anchor` = the registration point. `python3 build/check_vessel_meta.py` re-measures
every one of them. This README is written by `python3 build/v3_readme.py`.

The faces (A1, A2) went to `assets/cook/characters/<who>-face[-happy|-frown].webp` (Ali is `cousin`; Isa's are new),
framed by the eyes: `assets/cook/items/v3/faces-meta.json` has each face's eye points on its sheet.

**v3.1 (30 Sept):** the redos R1-R8 (`docs/archive/art-prompts/chatgpt-art-prompts-overnight-2026-09-30.md`, `sources/art/cook-v3-1/`) are
cut by `python3 build/cut_cook_v3_1.py` (the same method, this script's functions) into the same folders, next to
the v3 files, with `-v2` where one replaces a v3 file. R4's pots are scaled and placed on D1's pot canvas (their
rims on D1's); R6's plates share one canvas on the rim. The report: `build/reports/art-v3-1.md`.

## hob/ (H1-H6)

**Wired** into `Cook.Kit` (js/cook/kitchen-kit.js `HOBS`): every station's hob, knobs.

| file | px | what it is | measured |
|---|---|---|---|
| `hob-1.webp` | 465x658 | 1 burner, portrait (maani, daar, samosa fry; chai with 1 person) | n 1; burners (0.4944, 0.3805); cap_r 0.1525; support_r 0.4413; glass {'top': 0.0228, 'bottom': 0.9726}; frontY 0.8325; scale_from_sheet 0.5056 |
| `hob-2.webp` | 931x568 | 2 burners (chai, 2 people) | n 2; burners (0.251, 0.4025), (0.7445, 0.4025); cap_r 0.0762; support_r 0.2229; glass {'top': 0.0264, 'bottom': 0.9665}; frontY 0.8342; scale_from_sheet 0.6626 |
| `hob-3.webp` | 1388x709 | 3 burners (chai, 3 people) | n 3; burners (0.1596, 0.3725), (0.4993, 0.3728), (0.8389, 0.3725); cap_r 0.0511; support_r 0.1473; glass {'top': 0.0282, 'bottom': 0.9676}; frontY 0.7885; scale_from_sheet 0.9413 |
| `hob-4.webp` | 1753x620 | 4 burners (chai, 4 people) | n 4; burners (0.1328, 0.4177), (0.3766, 0.4162), (0.6228, 0.4182), (0.8687, 0.4185); cap_r 0.0405; support_r 0.1179; glass {'top': 0.0371, 'bottom': 0.9548}; frontY 0.821; scale_from_sheet 1.1638 |
| `hob-wide.webp` | 937x568 | one big burner on a landscape hob, for a big karahi (`Cook.Kit.hob(S, {wide: true})`, `Kit.art(1, [...], {wide: true})`); not used by a station yet | n 1; burners (0.4954, 0.3929); cap_r 0.0987; support_r 0.3055; glass {'top': 0.0757, 'bottom': 0.9683}; frontY 0.862; scale_from_sheet 0.6626 |
| `knob-off.webp` | 320x320 | the knob, off (grip bar horizontal) | cx 0.5005; cy 0.5005; r 0.3709; fit_px 2.2 |
| `knob-on.webp` | 320x320 | the knob, on: the same knob, bar vertical, warm glow (the kit turns it a quarter) | cx 0.501; cy 0.5013; r 0.3802; fit_px 2.0 |
| `hob-4-v2.webp` | 1546x530 | v3.1 R1: 4 burners at H1's burner size (replaces hob-4) | n 4; burners (0.1413, 0.4542), (0.3807, 0.4543), (0.6202, 0.4544), (0.8597, 0.4544); cap_r 0.0459; support_r 0.131; glass {'top': 0.0415, 'bottom': 0.9491}; frontY 0.8928; scale_from_sheet 1.0255 |
| `knob-off-v2.webp` | 400x400 | v3.1 R2: the knob, off | cx 0.4964; cy 0.4992; r 0.4401; fit_px 26.6 |
| `knob-on-v2.webp` | 400x400 | v3.1 R2: on, with a strong wide glow (fades out before the canvas edge) | cx 0.4993; cy 0.4993; r 0.4337; fit_px 0.5 |

## chai/ (C1)

Not wired: for the chai session. One registered canvas (the pan's rim centre lines up in all nine).

| file | px | what it is | measured |
|---|---|---|---|
| `pan-empty.webp` | 405x389 | empty | cx 0.3745; cy 0.6139; r 0.3243; fit_px 1.8; anchor [0.3754, 0.6146]; inner_r 0.3037 |
| `pan-water.webp` | 405x389 | clear water | cx 0.3762; cy 0.6146; r 0.3246; fit_px 1.7; anchor [0.3754, 0.6146]; inner_r 0.3012 |
| `pan-leaves.webp` | 405x389 | water + tea leaves turning amber | cx 0.3764; cy 0.614; r 0.3242; fit_px 1.7; anchor [0.3754, 0.6146]; inner_r 0.3025 |
| `pan-tea.webp` | 405x389 | black tea | cx 0.3752; cy 0.6141; r 0.3238; fit_px 1.8; anchor [0.3754, 0.6146]; inner_r 0.3012 |
| `pan-milky.webp` | 405x389 | milky chai | cx 0.3758; cy 0.6151; r 0.3239; fit_px 1.9; anchor [0.3754, 0.6146]; inner_r 0.3037 |
| `pan-spiced.webp` | 405x389 | milky chai with cardamom and ginger | cx 0.3762; cy 0.6148; r 0.3234; fit_px 1.9; anchor [0.3754, 0.6146]; inner_r 0.3 |
| `pan-boil-tea.webp` | 405x389 | black tea, rolling boil | cx 0.3754; cy 0.6151; r 0.3241; fit_px 1.5; anchor [0.3754, 0.6146]; inner_r 0.2716 |
| `pan-boil-milky.webp` | 405x389 | milky chai, rolling boil with froth | cx 0.3755; cy 0.6134; r 0.324; fit_px 1.8; anchor [0.3754, 0.6146]; inner_r 0.3012 |
| `pan-foam.webp` | 405x389 | milky chai foaming to the rim (boil-over warning) | cx 0.3762; cy 0.6158; r 0.3238; fit_px 1.5; anchor [0.3754, 0.6146]; inner_r 0.3 |

## maani/ (M1-M5)

Not wired: for the maani session. The maani discs share one registered canvas.

| file | px | what it is | measured |
|---|---|---|---|
| `dough-pile-wheat.webp` | 590x597 | a loose pile of wheat dough balls, for the shelf (Q14: no tray) |  |
| `dough-pile-millet.webp` | 590x601 | the millet (bajr) pile |  |
| `dough-ball-wheat.webp` | 301x298 | one wheat ball (the same scale as the pile's balls on the sheet) | cx 0.4975; cy 0.4944; r 0.437; fit_px 1.8 |
| `dough-ball-millet.webp` | 312x305 | one millet ball | cx 0.4951; cy 0.4974; r 0.4347; fit_px 1.8 |
| `chakla.webp` | 726x722 | the rolling board, dark walnut | cx 0.4988; cy 0.4988; r 0.4746; fit_px 1.8 |
| `velan.webp` | 773x162 | the rolling pin, dark walnut |  |
| `maani-wheat-raw.webp` | 403x395 | wheat, raw | cx 0.4994; cy 0.4997; r 0.4398; fit_px 2.6; anchor [0.4994, 0.4998] |
| `maani-wheat-half.webp` | 403x395 | wheat, half-cooked | cx 0.4992; cy 0.4994; r 0.4371; fit_px 2.1; anchor [0.4994, 0.4998] |
| `maani-wheat-cooked.webp` | 403x395 | wheat, cooked (flat) | cx 0.4986; cy 0.4998; r 0.4431; fit_px 3.3; anchor [0.4994, 0.4998] |
| `maani-millet-raw.webp` | 403x395 | millet, raw | cx 0.4999; cy 0.4993; r 0.441; fit_px 1.3; anchor [0.4994, 0.4998] |
| `maani-millet-half.webp` | 403x395 | millet, half-cooked | cx 0.4987; cy 0.4988; r 0.4409; fit_px 1.4; anchor [0.4994, 0.4998] |
| `maani-millet-cooked.webp` | 403x395 | millet, cooked | cx 0.4983; cy 0.4998; r 0.4475; fit_px 2.1; anchor [0.4994, 0.4998] |
| `maani-wheat-burnt.webp` | 403x395 | wheat, burnt | cx 0.4988; cy 0.501; r 0.4498; fit_px 2.0; anchor [0.4994, 0.4998] |
| `maani-millet-burnt.webp` | 403x395 | millet, burnt | cx 0.5; cy 0.4997; r 0.4439; fit_px 1.4; anchor [0.4994, 0.4998] |
| `tawa.webp` | 1221x866 | the tawa, handle at right (hi-res) | cx 0.3533; cy 0.4978; r 0.3386; fit_px 2.9; handle right |
| `turner.webp` | 1473x933 | the flat wooden turner (Q15) |  |

## daar/ (D1-D2)

Not wired: for the daar session. The nine pots share one registered canvas.

| file | px | what it is | measured |
|---|---|---|---|
| `pot-empty.webp` | 430x348 | empty | cx 0.4982; cy 0.4985; r 0.3566; fit_px 1.2; anchor [0.4982, 0.4985] |
| `pot-oil.webp` | 430x348 | hot oil | cx 0.4981; cy 0.4978; r 0.3598; fit_px 1.0; anchor [0.4982, 0.4985] |
| `pot-seeds.webp` | 430x348 | oil + mustard and cumin popping | cx 0.4974; cy 0.4982; r 0.3592; fit_px 1.0; anchor [0.4982, 0.4985] |
| `pot-onion.webp` | 430x348 | + onion frying | cx 0.4981; cy 0.4992; r 0.3596; fit_px 0.9; anchor [0.4982, 0.4985] |
| `pot-tomato.webp` | 430x348 | + tomato | cx 0.4989; cy 0.4985; r 0.3595; fit_px 1.0; anchor [0.4982, 0.4985] |
| `pot-chilli.webp` | 430x348 | + green chilli | cx 0.4988; cy 0.4983; r 0.3602; fit_px 1.2; anchor [0.4982, 0.4985] |
| `pot-daar.webp` | 430x348 | cooked daar | cx 0.4971; cy 0.4985; r 0.3624; fit_px 1.4; anchor [0.4982, 0.4985] |
| `pot-tadka.webp` | 430x348 | daar with the tadka on top | cx 0.4985; cy 0.4984; r 0.3623; fit_px 1.4; anchor [0.4982, 0.4985] |
| `pot-stir.webp` | 430x348 | daar mid-stir (a swirl) | cx 0.4977; cy 0.4974; r 0.3623; fit_px 1.5; anchor [0.4982, 0.4985] |
| `daar-bowl-trivet.webp` | 528x563 | a served bowl of daar on a woven trivet | cx 0.4928; cy 0.4987; r 0.4833; fit_px 7.7 |
| `veg-bowl.webp` | 484x483 | a steel bowl of chopped onion, tomato and chilli | cx 0.4958; cy 0.495; r 0.458; fit_px 1.4 |
| `ladle.webp` | 290x455 | the ladle, cut out of the small pot ChatGPT stood it in (hand-drawn outline: the bowl's circle, the handle, the hole) | bowl_cx 0.3983; bowl_cy 0.7451; bowl_r 0.3552 |
| `pot-tomato-only.webp` | 430x348 | v3.1 R4: seeds + tomato, no onion (on D1's pot canvas) | cx 0.4978; cy 0.4992; r 0.3567; fit_px 1.7; anchor [0.4982, 0.4985]; scale_from_sheet 0.8582; what seeds + tomato (no onion) |
| `pot-chilli-only.webp` | 430x348 | v3.1 R4: seeds + green chilli, no onion | cx 0.4986; cy 0.4993; r 0.3566; fit_px 1.5; anchor [0.4982, 0.4985]; scale_from_sheet 0.8583; what seeds + green chilli (no onion) |
| `pot-onion-chilli.webp` | 430x348 | v3.1 R4: onion + chilli, no tomato | cx 0.4994; cy 0.4996; r 0.3568; fit_px 1.6; anchor [0.4982, 0.4985]; scale_from_sheet 0.8584; what seeds + onion + chilli (no tomato) |
| `pot-tomato-chilli.webp` | 430x348 | v3.1 R4: tomato + chilli, no onion | cx 0.4971; cy 0.4993; r 0.3561; fit_px 1.8; anchor [0.4982, 0.4985]; scale_from_sheet 0.86; what seeds + tomato + chilli (no onion) |
| `pot-tadka-v2.webp` | 430x348 | v3.1 R4: daar with a mustard and cumin tadka only (no dry chilli, no curry leaves) | cx 0.4987; cy 0.497; r 0.3562; fit_px 1.7; anchor [0.4982, 0.4985]; scale_from_sheet 0.8599; what cooked daar, a tadka of mustard and cumin only (no dry chilli, no curry leaves) |
| `daar-bowl-trivet-plain.webp` | 489x490 | v3.1 R4: the trivet bowl of plain daar (waits to be poured) | cx 0.4991; cy 0.4971; r 0.4619; fit_px 1.6; what the trivet bowl of plain daar (no tadka): the bowl waiting to be poured |
| `ladle-v2.webp` | 833x1039 | v3.1 R3: a deep steel dipper, three-quarter on (bowl: the biggest circle inside it) | bowl_cx 0.3697; bowl_cy 0.7016; bowl_r 0.3501; bowl_fit inscribed |
| `chop-heap-onion.webp` | 477x469 | v3.1 R5: a heap of chopped red onion (daar's chop piles) | what a loose heap of chopped onion |
| `chop-heap-tomato.webp` | 477x469 | v3.1 R5: chopped tomato | what a loose heap of chopped tomato |
| `chop-heap-chilli.webp` | 477x469 | v3.1 R5: sliced green chilli rings (also samosa's chilli heap) | what a loose heap of chopped chilli |
| `chop-piece-onion.webp` | 159x164 | v3.1 R5: one piece of onion (the heaps' scale) | what one piece, the heaps' scale |
| `chop-piece-tomato.webp` | 159x164 | v3.1 R5: one piece of tomato | what one piece, the heaps' scale |
| `chop-piece-chilli.webp` | 159x164 | v3.1 R5: one chilli ring | what one piece, the heaps' scale |
| `dial-stopped.webp` | 360x343 | v3.1 R8: flat cream icon, stopped (a ladle and pause bars) | what flat cream icon (R8); colour #F5E6C8 |
| `dial-slow.webp` | 360x343 | v3.1 R8: slow (a tortoise) | what flat cream icon (R8); colour #F5E6C8 |
| `dial-fast.webp` | 360x343 | v3.1 R8: fast (a hare) | what flat cream icon (R8); colour #F5E6C8 |
| `dial-spill.webp` | 360x343 | v3.1 R8: too fast (a splash) | what flat cream icon (R8); colour #F5E6C8 |

## chaat/ (T1-T2)

Not wired: for the chaat session. Side-on glass (Q2b), cut see-through: colour-to-alpha all over, solid only where strongly coloured. The pots share one canvas, registered on the pot's bottom-centre.

| file | px | what it is | measured |
|---|---|---|---|
| `bowl-side.webp` | 1214x618 | the empty glass serving bowl, side-on | rimY 0.0599; bottomY 0.9693; left 0.0148; right 0.9843; cx 0.4992; floorTopY 0.6489; floorY 0.8285; floorHw 0.304; wall 0.0198; eryRim 0.025; eryFloor 0.1504; inside [[0.0346, 0.9646], [0.0346, 0.9646], [0.0346, 0.9646], [0.0372, 0.962], [0.0445, 0.9539], [0.0477, 0.9507], [0.0509, 0.9483], [0.0549, 0.9443], [0.0581, 0.9411], [0.0613, 0.9379], [0.0653, 0.9347], [0.0685, 0.9299], [0.0733, 0.9259], [0.0773, 0.9218], [0.0813, 0.9178], [0.0854, 0.913], [0.0902, 0.9081], [0.095, 0.9033], [0.0999, 0.8985], [0.1055, 0.8928], [0.1112, 0.8871], [0.1177, 0.8807], [0.1242, 0.8742], [0.1315, 0.8677], [0.1396, 0.8595], [0.1469, 0.8514], [0.1567, 0.8425], [0.1657, 0.8327], [0.1763, 0.8221], [0.1885, 0.8106], [0.2002, 0.799], [0.2125, 0.7858], [0.2273, 0.7718], [0.2446, 0.7545], [0.2479, 0.7504], [0.2479, 0.7504], [0.2479, 0.7504], [0.2479, 0.7504], [0.2479, 0.7504], [0.2479, 0.7504], [0.2479, 0.7504]] |
| `pot-chana.webp` | 356x370 | chickpeas | anchor [0.5, 0.9514] |
| `pot-potato.webp` | 356x370 | boiled potato cubes | anchor [0.5, 0.9514] |
| `pot-onion.webp` | 356x370 | chopped red onion | anchor [0.5, 0.9514] |
| `pot-chilli.webp` | 356x370 | chopped green chilli | anchor [0.5, 0.9514] |
| `pot-sev.webp` | 356x370 | sev | anchor [0.5, 0.9514] |
| `pot-dahi.webp` | 356x370 | yoghurt | anchor [0.5, 0.9514] |
| `pot-imli.webp` | 356x370 | tamarind chutney | anchor [0.5, 0.9514] |
| `pot-chutney.webp` | 356x370 | green chutney | anchor [0.5, 0.9514] |
| `pot-dhania.webp` | 356x370 | chopped coriander | anchor [0.5, 0.9514] |
| `pot-tomato.webp` | 356x370 |  | anchor [0.5, 0.9514]; from pot-onion.webp, recoloured (build/make_chaat_tomato_pot.py): a stand-in, no tomato on the T2 sheet |

## samosa/ (S1-S5)

Not wired: for the samosa session. The fold stages share one canvas, registered on the strip's right end (it stays put while the left end folds).

| file | px | what it is | measured |
|---|---|---|---|
| `fold-1.webp` | 517x297 | the flat strip | anchor [0.9613, 0.638] |
| `fold-2.webp` | 517x297 | the first fold: a triangle hiding the filling (Q3) | anchor [0.9613, 0.638] |
| `fold-3.webp` | 517x297 | folded again | anchor [0.9613, 0.638] |
| `fold-4.webp` | 517x297 | folded again | anchor [0.9613, 0.638] |
| `fold-5.webp` | 517x297 | the last tail folding over | anchor [0.9613, 0.638] |
| `fold-6.webp` | 517x297 | the finished raw samosa | anchor [0.9613, 0.638] |
| `board.webp` | 1397x847 | the house board, dark walnut (fill, chop, thread) |  |
| `karahi.webp` | 1253x1020 | the karahi of oil, open loop handles | cx 0.4975; cy 0.4992; r 0.3914; fit_px 3.2; oil 0.8994 |
| `plate.webp` | 825x834 | the paper-lined enamel plate | cx 0.4982; cy 0.4994; r 0.4826; fit_px 3.9 |
| `jharo.webp` | 657x837 | the slotted spoon (open holes) |  |
| `fill-chundo.webp` | 419x410 | spiced mince heap |  |
| `fill-potato.webp` | 419x410 | potato cubes |  |
| `fill-onion.webp` | 419x410 | chopped onion |  |
| `fill-chilli.webp` | 419x410 | chopped chilli |  |
| `fill-dhania.webp` | 419x410 | chopped coriander |  |
| `fill-peas.webp` | 419x410 | peas |  |
| `fill-carrot.webp` | 419x410 | grated carrot |  |
| `fill-cabbage.webp` | 419x410 | cooked cabbage |  |

## sekelo/ (K1-K5)

Not wired: for the sekelo session. The racks share one canvas (registered on the rack's left end and lower rail); the plates one canvas (on the plate's rim).

| file | px | what it is | measured |
|---|---|---|---|
| `rack-0.webp` | 502x395 | the rack, empty | sticks [] |
| `rack-1.webp` | 502x395 | 1 skewer | sticks [[0.1991, 0.043, 0.7367, 0.9519]] |
| `rack-2.webp` | 502x395 | 2 skewers | sticks [[0.1987, 0.043, 0.7367, 0.9519], [0.3907, 0.043, 0.7392, 0.9519]] |
| `rack-3.webp` | 502x395 | 3 skewers | sticks [[0.2011, 0.043, 0.7367, 0.9519], [0.3924, 0.043, 0.7367, 0.9519], [0.5836, 0.043, 0.7367, 0.9519]] |
| `rack-4.webp` | 502x395 | 4 skewers | sticks [[0.1992, 0.043, 0.7367, 0.9519], [0.3943, 0.043, 0.7367, 0.9519], [0.5916, 0.043, 0.7367, 0.9519], [0.7884, 0.043, 0.7367, 0.9519]] |
| `plate-1.webp` | 600x611 | plate, 1 skewer (handles off the plate) | cx 0.4629; cy 0.4527; r 0.43; fit_px 2.4; anchor [0.4629, 0.4528]; sticks [[0.1549, 0.2145, 0.7327, 0.7797, 0.8646, 0.9087]] |
| `plate-2.webp` | 600x611 | 2 skewers | cx 0.4632; cy 0.4524; r 0.4311; fit_px 2.1; anchor [0.4629, 0.4528]; sticks [[0.2238, 0.155, 0.7956, 0.7204, 0.9181, 0.8415], [0.1534, 0.2127, 0.7297, 0.7826, 0.8593, 0.9107]] |
| `plate-3.webp` | 600x611 | 3 skewers | cx 0.4621; cy 0.4522; r 0.4299; fit_px 2.6; anchor [0.4629, 0.4528]; sticks [[0.3011, 0.1086, 0.8393, 0.6475, 0.9505, 0.759], [0.2226, 0.1578, 0.7866, 0.7227, 0.9042, 0.8404], [0.1548, 0.213, 0.7258, 0.7849, 0.8454, 0.9046]] |
| `plate-4.webp` | 600x611 | 4 skewers | cx 0.4634; cy 0.4528; r 0.4314; fit_px 2.0; anchor [0.4629, 0.4528]; sticks [[0.299, 0.1074, 0.8396, 0.6468, 0.952, 0.759], [0.2221, 0.1567, 0.7843, 0.7176, 0.9041, 0.8372], [0.1558, 0.2114, 0.7215, 0.7759, 0.8389, 0.8931], [0.1073, 0.2848, 0.6477, 0.824, 0.7708, 0.9469]] |
| `grill.webp` | 1505x801 | the charcoal grill with two bars | bars_y [0.025, 0.2422, 0.6554, 0.8933]; bed [0.2013, 0.1746, 0.8027, 0.8065] |
| `meat-raw.webp` | 404x396 | mishkaki, raw |  |
| `meat-grilled.webp` | 404x396 | grilled |  |
| `meat-charred.webp` | 404x396 | charred |  |
| `onion-raw.webp` | 404x396 | onion chunk, raw |  |
| `onion-grilled.webp` | 404x396 | grilled |  |
| `tomato-raw.webp` | 404x396 | tomato chunk, raw |  |
| `tomato-grilled.webp` | 404x396 | grilled |  |
| `pepper-raw.webp` | 404x396 | pepper chunk, raw |  |
| `pepper-grilled.webp` | 404x396 | grilled |  |
| `heap-meat.webp` | 635x624 | a heap of raw meat cubes (shelf) |  |
| `heap-onion.webp` | 635x624 | onion chunks |  |
| `heap-tomato.webp` | 635x624 | tomato chunks |  |
| `heap-pepper.webp` | 635x624 | pepper chunks |  |
| `stick.webp` | 49x365 |  | tip 0.0054; handle 0.7562; end 0.989; _about rack-1's skewer, the rails taken out (build/measure_sekelo_v3.py) |
| `plate-0.webp` | 600x611 |  | cx 0.4629; cy 0.4527; r 0.43; fit_px 2.4; anchor [0.4629, 0.4528]; sticks []; _about plate-1 with its skewer painted out (build/measure_sekelo_v3.py cut_plate0) |
| `plate-0-v2.webp` | 465x499 | v3.1 R6: the clean empty plate (one canvas with plate-1-v2..4-v2, on the rim) | cx 0.499; cy 0.461; r 0.4506; fit_px 2.2; anchor [0.499, 0.4604]; sticks [] |
| `plate-1-v2.webp` | 465x499 | v3.1 R6: 1 skewer, fanned | cx 0.4982; cy 0.4604; r 0.4522; fit_px 1.7; anchor [0.499, 0.4604]; sticks [[0.2256, 0.1946, 0.7881, 0.7745, 0.9138, 0.904]] |
| `plate-2-v2.webp` | 465x499 | v3.1 R6: 2 skewers | cx 0.4981; cy 0.4608; r 0.4513; fit_px 1.6; anchor [0.499, 0.4604]; sticks [[0.138, 0.288, 0.7337, 0.793, 0.8914, 0.9267], [0.4861, 0.0996, 0.8065, 0.7647, 0.8805, 0.9182]] |
| `plate-3-v2.webp` | 465x499 | v3.1 R6: 3 skewers | cx 0.5; cy 0.4604; r 0.4568; fit_px 2.3; anchor [0.499, 0.4604]; sticks [[0.1395, 0.2769, 0.7135, 0.8156, 0.8412, 0.9355], [0.3907, 0.111, 0.7789, 0.7807, 0.8621, 0.9244], [0.7571, 0.1725, 0.8206, 0.7615, 0.8399, 0.9408]] |
| `plate-4-v2.webp` | 465x499 | v3.1 R6: 4 skewers (FIVE sticks drawn: the lowest one stays empty) | cx 0.498; cy 0.4607; r 0.4584; fit_px 1.8; anchor [0.499, 0.4604]; sticks [[0.1391, 0.2731, 0.7235, 0.7953, 0.8562, 0.9139], [0.3106, 0.1347, 0.7653, 0.7831, 0.8567, 0.9134], [0.5394, 0.0777, 0.7992, 0.7655, 0.8555, 0.9146], [0.8011, 0.1845, 0.8246, 0.7574, 0.8322, 0.9432]] |
| `potato-raw.webp` | 404x396 | v3.1 R7: potato chunk, raw (the decoy) | what R7: potato, raw |
| `potato-grilled.webp` | 404x396 | v3.1 R7: grilled | what R7: potato, grilled |
| `potato-charred.webp` | 404x396 | v3.1 R7: charred, still potato | what R7: potato, charred |
| `onion-charred.webp` | 404x396 | v3.1 R7: charred, still purple onion | what R7: onion, charred |
| `tomato-charred.webp` | 404x396 | v3.1 R7: charred, still red | what R7: tomato, charred |
| `pepper-charred.webp` | 404x396 | v3.1 R7: charred, still green | what R7: pepper, charred |
| `heap-potato.webp` | 635x624 | v3.1 R7: a heap of raw potato chunks (the decoy's shelf heap) | what R7: a loose heap of raw potato chunks (the decoy's shelf heap) |
