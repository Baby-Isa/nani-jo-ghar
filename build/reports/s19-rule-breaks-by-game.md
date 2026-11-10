# The full check's rule breaks, by game (s19-publish-gate, 9 Nov; before the stuck-games fixes)

Each kitchen game's go into its chai-standard work this sprint (Zafar, 9 Nov). One example each; the full list: `build/screenshots/sandbox/s19-publish-gate/contract.json` (filter by flow).

## daar (127)
- contract-98 : 64 (e.g. cook:tadka@L2 L2 1280x665: a dotted word showed on the order panel and the first-time lesson for it was never logged)
- contract-95 : 28 (e.g. cook:stir@L3 L3 1280x665: "Ba!" was said 316 ms after the order was skipped, before the game's first step)
- contract-105 : 22 (e.g. cook:daar@L2 L2 740x320: the light [6,111,90,253] is not whole round card:hakro mirchi [10,104,87,249] (its picture and pill): it pokes out at the top)
- contract-84 : 3 (e.g. cook:daar#returning L1 1280x665: the lit box [780,340,843,403] over a dark thing (98 bright under it) lifts it to 61.4, by -36.6 of 255 (at least 12 wanted: the soft fill inside the box))
- contract-107 : 3 (e.g. cook:tadka@L2#mistake L2 1280x665: the shelf item spi-01 is lit [983,535,1078,637] without its hop)
- contract-104 : 2 (e.g. cook:tadka#mistake L1 1280x665: the item card "mirchi" has no picture (assets/cook/items/veg-marcha-whole-t.webp did not load))
- contract-109 : 2 (e.g. cook:tadka#mistake L1 1280x665: the shelf item spi-02 stands 5 px off the base line (627 px): one line for every item)
- contract-106 : 2 (e.g. cook:tadka#mistake L1 740x320: the light [413,245,472,307] stayed round the child's press at (442, 278) for 430 ms: it goes within 300 ms of the move's start)
- contract-91 : 1 (e.g. cook:daar L1 1280x665: cook:station3:marble: 11.0 s stuck on the child's turn (stir) since the last action with nothing said and no hint (L1 waits 7000 ms, judged at 11000 ms))

## maani (22)
- contract-105 : 22 (e.g. cook:maani-line@L2 L2 740x320: the light [6,111,90,244] is not whole round card:hakri nindhi maani [10,104,87,240] (its picture and pill): it pokes out at the top)

## chop (17)
- contract-105 : 16 (e.g. cook:chop@L3 L3 740x320: the light [6,111,90,253] is not whole round card:hakro tameto [10,104,87,249] (its picture and pill): it pokes out at the top)
- contract-65 : 1 (e.g. cook:chop@L2#mistake L2 1280x665: wave 2's first throw came 469 ms after wave 1's last (its spacing 263 ms): a gap of 206 ms between the waves (at most 167, 0.5 s at the test speed 3))

## corn (52)
- contract-105 : 26 (e.g. cook:corn L1 1280x665: the light [810,476,955,664] frames a region 3.6 times the size of ph-lili [839,499,927,586]: it hugs the one thing)
- contract-53 : 10 (e.g. cook:corn L1 1280x665: the help's light is 3.6 times the size of ph-lili: it should hug it)
- contract-11 : 9 (e.g. cook:corn L1 1920x1080: cook:station1:marble: background assets/cook/proto/corn/bg-table.webp (phaser) low-res: 1.65 screen px per source px)
- contract-106 : 4 (e.g. cook:corn@L2 L2 1280x665: the light [353,57,607,269] stayed round the child's press at (480, 163) for 778 ms: it goes within 300 ms of the move's start)
- contract-109 : 3 (e.g. cook:corn L1 1280x665: the shelf item ph-lili stands 6 px off the base line (586 px): one line for every item)

## eggs (30)
- contract-105 : 15 (e.g. cook:eggs@L2 L2 1280x665: the light [18,171,135,359] is not whole round card:hakro boiled egg [19,152,134,367] (its picture and pill): it pokes out at the top and bottom)
- contract-106 : 9 (e.g. cook:eggs@L2 L2 1280x665: the light [375,509,491,664] stayed round the child's press at (433, 573) for 450 ms: it goes within 300 ms of the move's start)
- contract-83 : 4 (e.g. cook:eggs@L2 L2 930x430: a card (15,109,92,256) sits over circle: 84 px squared)
- contract-18 : 1 (e.g. cook:eggs@L3 L3 1920x1080: cook:station1:marble: the row "hakro tarelo indo" (k5) ticked with no step-close logged for it in the 1 s before)
- contract-102 : 1 (e.g. cook:eggs#mistake L1 1280x665: eg-bowl-three glows [386,529,480,617] outside the kit's light (no light up): the game's own glow)

## sekelo (41)
- contract-105 : 33 (e.g. cook:mishkaki-grill L1 1920x1080: the light [1071,821,1262,1079] is off the middle of veg-03 [1087,852,1245,1008] by 1, 20 px (within 4 px))
- contract-107 : 7 (e.g. cook:mishkaki-grill#mistake L1 1280x665: the shelf item veg-02 is lit [640,503,762,664] without its hop)
- contract-102 : 1 (e.g. cook:mishkaki-grill#mistake L1 1280x665: Container glows [893,266,931,470] outside the kit's light (no light up): the game's own glow)

## chaat (84)
- contract-105 : 38 (e.g. cook:chaat@L2 L2 1280x665: the light [860,503,965,664] is off the middle of ph-chana [871,524,965,655] by -5, -6 px (within 4 px))
- contract-104 : 33 (e.g. cook:chaat L1 930x430: the item card "chana" has no picture (assets/cook/items/shelf-ph-chana-bare-f.webp did not load))
- contract-92 : 8 (e.g. cook:chaat L1 1920x1080: the light round ph-chana covers its neighbour ph-lili: it should stop short of it)
- contract-107 : 4 (e.g. cook:chaat L1 1280x665: the shelf item ph-chana is lit [519,500,639,664] without its hop)
- contract-79 : 1 (e.g. cook:assemble@L2#mistake L2 1920x1080: the order card's light starts 1 ms after the last move ended (the rules ask 166.66666666666666 ms))

## samosa (95)
- contract-109 : 41 (e.g. cook:samosa@L2 L2 1280x665: the shelf item veg-12 stands -6 px off the base line (617 px): one line for every item)
- contract-105 : 28 (e.g. cook:samosa L1 1920x1080: the light [1051,178,1404,349] is round 58% of sv3-fold-strip [1015,141,1441,385] (middle off by 0%, 0% of its size): it should sit whole round it)
- contract-102 : 14 (e.g. cook:samosa L1 930x430: sv3-fold-strip glows [307,28,506,143] outside the kit's light (the light is at [453,312,538,429]): the game's own glow)
- contract-89 : 12 (e.g. cook:samosa@L2 L2 1920x1080: "Tar!" was said while Nani's helper card named the item and was closed: the item said before her card shows it)

## baking (33)
- contract-105 : 11 (e.g. cook:baking@L2 L2 740x320: the light [6,111,90,237] is not whole round card:atto [10,104,87,233] (its picture and pill): it pokes out at the top)
- contract-104 : 10 (e.g. cook:baking@L2 L2 1920x1080: the item card "atto" has no picture (assets/cook/items/shelf-cook-atto-bare-f.webp did not load))
- contract-106 : 3 (e.g. cook:baking@L2 L2 1280x665: the light [688,205,1054,494] stayed round the child's press at (871, 350) for 503 ms: it goes within 300 ms of the move's start)
- contract-11 : 2 (e.g. cook:baking@L3 L3 1920x1080: page: background assets/shared/word-moment/counter-wm-s17.webp (img) low-res: 1.58 screen px per source px)
- contract-102 : 2 (e.g. cook:baking@L3 L3 1920x1080: bk-bowl-mixing glows [1005,572,1363,870] outside the kit's light (no light up): the game's own glow)
- contract-89 : 2 (e.g. cook:baking#mistake L1 1280x665: "Tayar ai." was said while Nani's helper card named the item and was closed: the item said before her card shows it)
- contract-82 : 1 (e.g. cook:baking@L2 L2 740x320: a lit box [6,100,90,237] cuts across a circle [5,62,53,110] (15% of it inside))
- contract-109 : 1 (e.g. cook:baking#mistake L1 1280x665: the shelf item cook-khun stands 5 px off the base line (618 px): one line for every item)
- contract-92 : 1 (e.g. cook:baking@L2#mistake L2 1280x665: the light round cook-atto leaves -52 px on its right with nothing beside it: at least 6 px)

## chai (102)
- contract-105 : 56 (e.g. cook:chai-tray@L3 L3 740x320: the light [6,126,90,272] is not whole round card:paani [10,121,87,268] (its picture and pill): it pokes out at the top)
- contract-102 : 23 (e.g. cook:chai-tray#hint L1 1280x665: jar-cook-khun glows [885,531,942,621] outside the kit's light (no light up): the game's own glow)
- contract-11 : 5 (e.g. cook:chai-tray@L4 L4 1920x1080: page: background assets/shared/word-moment/counter-wm-s17.webp (img) low-res: 1.58 screen px per source px)
- contract-104 : 5 (e.g. cook:chai@L4 L4 1280x665: the item card "paani" has no picture (assets/cook/items/shelf-cook-paani-bare-f.webp did not load))
- contract-72 : 4 (e.g. lab:cook/recipe-chai@L4 L4 1280x665: the order row glided 304 px at once, more than 2.5 cards (115 px each))
- contract-83 : 3 (e.g. cook:chai-tray@L4 L4 1920x1080: a card (418,601,703,1061) sits over nana: 31 px squared)
- contract-106 : 2 (e.g. cook:chai-tray#mistake L1 1280x665: the light [545,505,627,664] stayed round the child's press at (586, 562) for 758 ms: it goes within 300 ms of the move's start)
- contract-22 : 2 (e.g. lab:cook/chai-tray@L3 L3 740x320: host:cook/chai-tray|cook:station1:marble: "Elchi wiji chad!" said twice, 723 ms apart (a line is said once; again only after 10 s idle))
- contract-107 : 1 (e.g. lab:cook/chai-tray@L3 L3 1280x665: the shelf item cook-chai is lit [637,514,710,664] without its hop)
- contract-96 : 1 (e.g. cook:chai@L4 L4 1920x1080: cousin's pot started again after boiling over and its card is scrolled 5 px along, not back at the first item within 1500 ms)

## Proof
build/screenshots/sandbox/s19-publish-gate/contract.json and contract.md.
