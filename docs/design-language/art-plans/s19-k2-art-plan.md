# S19 kitchen and items run (s19-k2): the plan

One hand-written block, `s19-k2-chrome-block.txt`, merging three things Zafar approved (11 Nov, `docs/decisions/2026-11-10-overnight.md`):
the serving kitchen first, then the art audit's run 1 (`build/reports/s19-art-audit.md` (c), with his defaults: daar's pot as
D1-D3, K9 yes, E5 yes), then the pot redo (`s19-tp-redo-chrome-block.txt`, its chats and lines word for word).
References: `sources/art/s19-k2/refs/` (40 jpg) and `refs.zip`. Save-as: `s19-k2-<line>-<try>.png`. Three ChatGPT windows at
a time; seven chats in priority order (the block's runner section). Zafar's two rules (advice or review as its own text-only
message; the stubborn-picture method) apply to every line.

## Part 1: the serving kitchen (all kitchen games' serve)

| Line | What it is for | Game | Row |
|---|---|---|---|
| KA | ChatGPT's advice (text only) on C2 against the 11 Nov decisions | every kitchen game's serve | 11 Nov decision |
| KB | The tall painting, about 4:3: no people, no trays, no dishes, no ceiling, no shelf, no splashback, one sage | the serve's background (both views glide over it) | 11 Nov decision |
| KC | The two-message review (with the colours it used) and one corrected KB | as KB | 11 Nov decision |
| KO | The ordering view alone, 16:9, an edit of the kept tall painting, framed exactly as K1, empty island | the order moment | Zafar, 11 Nov (both angles, no trays) |
| KS | The serving view alone, 16:9, an edit of it (A3's angle), empty island | the serve moment | Zafar, 11 Nov (both angles, no trays) |
| KT | The walnut serving tray alone on magenta, low rim, at the island's angle | the serve: 1-3 trays placed by code | 11 Nov decision |
| SD1 | Chai, maani, daar served at the island's angle | chai, maani, daar | the served dishes (audit (b): the old 300 px served set) |
| SD2 | Sekelo, samosa, chaat served | sekelo, samosa, chaat | as SD1 |
| SD3 | Corn, naan, chop served | corn, baking, chop | as SD1 |

The framing (Zafar, 11 Nov): "the current amount of counter is the right amount in the current kitchen, we know it leaves
enough space for characters and text and item cards". So KO and the top of KB frame exactly as the current kitchen K1 does (the
same share of wall above the family, the same back-counter height, the same strip of island), with no ceiling and the new
room's look; K1 is attached to KB, KC and KO as the framing reference. Only KS and the lower part of KB show more of the island.

Both angles with no trays (Zafar, 11 Nov): "ensure we have the kitchen, in both angles, without any walnut trays so we can place
them as and when needed (e.g. one tray if there's only one person ordering)": hence KO and KS, and KT as the only tray.

No trays, boards or dishes on the island in any kitchen image (the runner's kitchen check). One point to watch: the 11 Nov
decisions name every cabinet one sage; the island's front is left to ChatGPT's advice (C2 has pale wood slats).

## Part 2: the art audit's run 1 (the kitchen games' missing pieces)

| Line | What it replaces | Game | Row |
|---|---|---|---|
| PH-D1, D1 | Daar's pot, empty, straight down, even wall (photo first); replaces `v3/daar/pot-*` | daar (and every later pot dish) | ART-63 |
| D2 | The same pot with oil (an edit of D1) | daar | ART-63 |
| D3 | Six flat discs of the pot's contents, laid in by code | daar | ART-63 |
| PH-K8, K8 | Samosa's karahi with oil (photo first); replaces `v3/samosa/karahi` | samosa | audit (a) |
| PH-M1, M1 | Maani's round walnut board and pin exactly from above (photo first); replaces `v3/maani/chakla`, `velan` | maani | ART-62 |
| K2b | Sekelo's chicken, chilli, corn in four stages; replaces `items-s08c/sekelo/*` | sekelo | audit (a); four stages (Zafar, 10 Nov) |
| K9 | Sekelo's eight raw pieces in cream bowls; replaces `v3/sekelo/heap-*` | sekelo | audit decision 3 |
| E5 | The whole brown egg and the boiled halves in four stages; replaces `proto/eggs/egg-brown` | eggs | audit decision 5 |
| S5 | The cream plate with a paper napkin; replaces `v3/samosa/plate` | samosa | ART-71 (no blue-rimmed or oval plates) |
| PH-B3, B3a, B3b | Naan in four stages, two per image (photo first) | baking | ART-73 |
| B5 | The B2 glass jug full of flour, milk, sugar, yoghurt; replaces `proto/baking/jug-*` | baking | audit (a) |
| PS1 | The orange (with an apple and a pear) in the walnut shelf family; replaces `shelf-fru-04-bare-f` | the pantry | PAN-06 |

## Part 3: the pot redo

| Line | What it is for | Game | Row |
|---|---|---|---|
| CHAT A | The plain photo of the saucepan from exactly above | (reference) | ART-75 |
| P1, P2 | The top-down pot with water and empty, even wall | eggs (and chai's pan if it wins) | ART-75, ART-67 |

## The references (`sources/art/s19-k2/refs/`)

Shared: `00-HOUSE-chai-cooking` (the scene style), `00-HOUSE-chai-live` (the pieces' style), `00-F1-the-house-bowl`. Each line's
pictures carry its prefix. A name ending in `-now` is the game picture the line replaces: attached to ChatGPT only where a line
names it (D3, KA, KO); the others are for the runner and the judge. `R0-why-redo-wall-uneven` is never attached. After the run:
judge (`artjudge.py`), cut, and move each row above in the cut's commit (`/art-run`).
