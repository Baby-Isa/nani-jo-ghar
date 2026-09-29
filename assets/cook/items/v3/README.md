# Cook v3 art (29 Sept play-test)

Cut by `python3 build/cut_cook_v3.py` from `sources/art/cook-v3/` (the 28 ChatGPT sheets from
`docs/chatgpt-art-prompts-cook-v3.md`, renamed to their "save as" names). The method is `docs/VISUAL-QA.md` §2's:
colour-to-alpha edges, flat grey inside loops and holes made transparent (and checked: no `#808080` left inside a
cut), ChatGPT's drawn drop shadows removed, and one registered canvas per object shown in several states.

Each folder's `meta.json` holds, per sprite: `w`, `h` (px), the sheet it came from, and what was **measured from the
art**, as fractions of the sprite's own width (x, r) and height (y): `cx, cy, r` = the round body's centre and radius
(handles left out; `fit_px` = how round it is), `burners` = each burner's centre, `frontY` = the middle of the hob's
front strip (the badges and knobs), `anchor` = the registration point. `python3 build/check_vessel_meta.py` re-measures
every one of them. This README is written by `python3 build/v3_readme.py`.

The faces (A1, A2) went to `assets/cook/characters/<who>-face[-happy|-frown].webp` (Ali is `cousin`; Isa's are new),
framed by the eyes: `assets/cook/items/v3/faces-meta.json` has each face's eye points on its sheet.

## hob/ (H1-H6)

**Wired** into `Cook.Kit` (js/cook/kitchen-kit.js `HOBS`): every station's hob, knobs.

| file | px | what it is | measured |
|---|---|---|---|
| `hob-1.webp` | 465x658 | 1 burner, portrait (maani, daar, samosa fry; chai with 1 person) | n 1; burners (0.4944, 0.3805); cap_r 0.1525; support_r 0.4413; ring_r 0.4413; glass {'top': 0.0228, 'bottom': 0.9726}; frontY 0.8325; scale_from_sheet 0.5056 |
| `hob-2.webp` | 931x568 | 2 burners (chai, 2 people) | n 2; burners (0.251, 0.4025), (0.7445, 0.4025); cap_r 0.0762; support_r 0.2229; ring_r 0.1826; glass {'top': 0.0264, 'bottom': 0.9665}; frontY 0.8342; scale_from_sheet 0.6626 |
| `hob-3.webp` | 1388x709 | 3 burners (chai, 3 people) | n 3; burners (0.1596, 0.3725), (0.4993, 0.3728), (0.8389, 0.3725); cap_r 0.0511; support_r 0.1473; ring_r 0.121; glass {'top': 0.0282, 'bottom': 0.9676}; frontY 0.7885; scale_from_sheet 0.9413 |
| `hob-4.webp` | 1753x620 | 4 burners (chai, 4 people) | n 4; burners (0.1328, 0.4177), (0.3766, 0.4162), (0.6228, 0.4182), (0.8687, 0.4185); cap_r 0.0405; support_r 0.1179; ring_r 0.0953; glass {'top': 0.0371, 'bottom': 0.9548}; frontY 0.821; scale_from_sheet 1.1638 |
| `hob-wide.webp` | 937x568 | one big burner on a landscape hob, for a big karahi (`Cook.Kit.hob(S, {wide: true})`, `Kit.art(1, [...], {wide: true})`); not used by a station yet | n 1; burners (0.4954, 0.3929); cap_r 0.0987; support_r 0.3055; ring_r 0.2105; glass {'top': 0.0757, 'bottom': 0.9683}; frontY 0.862; scale_from_sheet 0.6626 |
| `knob-off.webp` | 320x320 | the knob, off (grip bar horizontal) | cx 0.5005; cy 0.5005; r 0.3709; fit_px 2.2 |
| `knob-on.webp` | 320x320 | the knob, on: the same knob, bar vertical, warm glow (the kit turns it a quarter) | cx 0.501; cy 0.5013; r 0.3802; fit_px 2.0 |

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
| `ladle.webp` | 290x455 | the ladle, cut out of the small pot ChatGPT stood it in (hand-drawn outline: the bowl's circle, the handle, the hole) | cx 0.5203; cy 0.5634; r 0.4283; fit_px 104.3 |

## chaat/ (T1-T2)

Not wired: for the chaat session. Side-on glass (Q2b), cut see-through: colour-to-alpha all over, solid only where strongly coloured. The pots share one canvas, registered on the pot's bottom-centre.

| file | px | what it is | measured |
|---|---|---|---|
| `bowl-side.webp` | 1214x618 | the empty glass serving bowl, side-on | rimY 0.0291; bottomY 0.9693; left 0.0148; right 0.9843 |
| `pot-chana.webp` | 356x370 | chickpeas | anchor [0.5, 0.9514] |
| `pot-potato.webp` | 356x370 | boiled potato cubes | anchor [0.5, 0.9514] |
| `pot-onion.webp` | 356x370 | chopped red onion | anchor [0.5, 0.9514] |
| `pot-chilli.webp` | 356x370 | chopped green chilli | anchor [0.5, 0.9514] |
| `pot-sev.webp` | 356x370 | sev | anchor [0.5, 0.9514] |
| `pot-dahi.webp` | 356x370 | yoghurt | anchor [0.5, 0.9514] |
| `pot-imli.webp` | 356x370 | tamarind chutney | anchor [0.5, 0.9514] |
| `pot-chutney.webp` | 356x370 | green chutney | anchor [0.5, 0.9514] |
| `pot-dhania.webp` | 356x370 | chopped coriander | anchor [0.5, 0.9514] |

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
| `rack-0.webp` | 502x395 | the rack, empty |  |
| `rack-1.webp` | 502x395 | 1 skewer |  |
| `rack-2.webp` | 502x395 | 2 skewers |  |
| `rack-3.webp` | 502x395 | 3 skewers |  |
| `rack-4.webp` | 502x395 | 4 skewers |  |
| `plate-1.webp` | 600x611 | plate, 1 skewer (handles off the plate) | cx 0.4629; cy 0.4527; r 0.43; fit_px 2.4; anchor [0.4629, 0.4528] |
| `plate-2.webp` | 600x611 | 2 skewers | cx 0.4632; cy 0.4524; r 0.4311; fit_px 2.1; anchor [0.4629, 0.4528] |
| `plate-3.webp` | 600x611 | 3 skewers | cx 0.4621; cy 0.4522; r 0.4299; fit_px 2.6; anchor [0.4629, 0.4528] |
| `plate-4.webp` | 600x611 | 4 skewers | cx 0.4634; cy 0.4528; r 0.4314; fit_px 2.0; anchor [0.4629, 0.4528] |
| `grill.webp` | 1505x801 | the charcoal grill with two bars | bars_y [0.025, 0.2422, 0.6554, 0.8933] |
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
