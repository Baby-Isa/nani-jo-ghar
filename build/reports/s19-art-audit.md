# S19 art audit: what the kitchen shows, what is stored, and the next art run (10 Nov)

Read-only audit for Zafar's question: "Anything else to add into the art run? Anything used by the cook games? Maybe pantry? What
about all those hundreds of items we made to keep stored for future use: are they fine or do they need redoing?" Judged by eye on
contact sheets (every picture on mid-grey and on dark), against chai's live screen and the S19 art (`assets/cook/items/v4/`).
Nothing was changed, launched or published; no browser was used, so "loads" means each page's manifest
(`loadcheck.mjs --manifest`), not a live trace.

## Summary (read this first)

1. **Yes, add to the run: 13 lines (26 images), in three chats**, all for pictures a game shows today. The pot redo (ART-75) is
   already written and is not repeated.
2. **The biggest gaps on screen:** daar's pot and samosa's karahi are tilted (not straight down); baking's naan has two stages,
   not four; sekelo's threading band, trays, board and plates are old art; the pantry's whole shelf is the old mixed set.
3. **The stored "400" set (346 cut): about three quarters pass.** All 129 side-on shelf items pass (walnut lids, one family). Of
   the 217 top-down ones, about 130 pass (52 dishes, 78 loose foods); 87 do not (32 in steel katoris, 13 other bowls, 42 tools
   with oak or coloured handles and warm steel). Redraw those only when a game takes one.
4. **Everything older than the stove set (about 690 pictures) is below the standard** and should be treated as retired: 256 px,
   an older bowl, light oak, pine crates, three-quarter cameras, the outlined storybook fruit and veg.
5. **Much needs no art, only wiring:** samosa's cream bowls and slotted spoon are cut and unused; the pantry and baking's shelf
   can take the walnut jars today (35 of the pantry's 36 exist); the oven in the house look exists uncut.
6. **Two flaws in the new art itself, both fixable in code:** a hairline pink rim on 45 of the 86 v4 cuts (seen only zoomed in),
   and white patches of old ground round the grill's handles (it was drawn on marble with a shadow, not on magenta).
7. **The farm trip:** hen, goat and chick pass (nine poses each). The cow and sheep are one cartoon picture each and need pose
   sets; the scenery is the ride's cartoon look. **The animal trip:** every safari piece has grass and a yellow halo baked in:
   all of it is a redraw. Both runs wait for those modes' designs.
8. Wave E2 (sekelo, samosa, chaat, baking on their redrawn art) is still on its branch; where it already fixes a gap, this
   report says so.

## (a) What the kitchen games and the pantry still show below the standard

PASS = at the house standard. FIX IN CODE = no new art. REDRAW = a line in the run. "E2" = fixed by wave E2 when it merges.

| Game | Below the standard today | Verdict |
|---|---|---|
| **Chai** (the reference) | Nothing: it is the standard. Two notes only: its pan (`items-s14/chai-pan/pan-*`) has the same slight tilt as the failed pot, and changes only if the pot redo wins in eggs (your 10 Nov plan). Seven old small bowls (`dry-chai-leaves-bowl-t`, `spice-*-bowl-t`, 256 px) still load but are not seen in the reference shots. | PASS; leave |
| **Maani** | The round board `v3/maani/chakla` shows its side along the lower edge (ART-62). The discs already have four stages for both flours; tawa, turner, pin, v4 dough heaps and steel plates pass. Old `props/` pictures (atto, dough-ball, chapati-*, tawa) and `maani-v2/thali` still load and are not shown. | REDRAW the board (M1); FIX IN CODE: stop loading the old props |
| **Daar** | **The pot, 13 states** (`v3/daar/pot-*`): tilted, the far wall deeper than the near one, and a warm rose steel (ART-63). The knife on the chop screen is the old oak-handled `tool-knife-t-v2` (SH-259 already swaps it). The chopped pieces wait as loose heaps (`v3/daar/chop-heap-*`, `dp1-*`, some 90-160 px) in a warm steel bowl from the stored set. | REDRAW the pot (D1-D3); FIX IN CODE: the v4 knife, the chopped veg in the v4 cream bowls |
| **Chop** | Nothing. All v4 on the walnut board. | PASS (pink rim: see below) |
| **Sekelo** | E2 brings the grill's pieces in four stages. Still old after E2: the threading heaps with no bowls (`v3/sekelo/heap-*`, three-quarter view); the light oak board (`tool-board-t`; walnut rule); the trays (`items-s08c/sekelo-tray/tray-0..4`, tilted, sticks painted in); the old grill (`v3/sekelo/grill`, front wall showing); the blue-rimmed enamel plates and the oval steel plate (`v3/sekelo/plate-*`, `plate-plain-t`; ART-71); chicken, chilli and corn pieces (`items-s08c/sekelo/*`, three stages, three-quarter view); the mixed skewer's card (ART-68). | FIX IN CODE: v4 tray, grill, skewer, plate, the walnut board, the card composed from v4 pieces. REDRAW: the three extra kinds (K2b), the threading bowls (K9) |
| **Samosa** | E2 brings the four fry stages and the sheet's underside. Still old after E2: **the karahi** (`v3/samosa/karahi`, tilted, warm steel; its redraw line K8 never landed); the filling heaps with no bowls (`v3/samosa/fill-*`) although the eight cream bowls are cut (`v4/samosa/`); the all-steel jharo although the wood-and-steel spoon is cut (`v4/kit/slotted-spoon-cloth`); the blue-rimmed plate with paper (`v3/samosa/plate`). | REDRAW the karahi (K8) and the plate (S5); FIX IN CODE: the bowls and the spoon |
| **Chaat** | E2 brings the redrawn topping layers. The side-on glass pots on the shelf (`v3/chaat/pot-*`) are in the house look and pass as open pots; the old flat strips (`items-s08b/chaat-strips`) go with E2. | PASS after E2 |
| **Baking** | E2 brings the glass bowl, the water jug and the naan tray. Still old after E2: **the naan in two stages** (ART-73); the oven (`proto/baking/oven-*`, three states) although the house-look oven exists uncut (the mini run's B3-2, `sources/art/s19-mini/results/`); the jugs of flour, milk, sugar and yoghurt (`proto/baking/jug-*`, a different jug with tick marks); the shelf jars from the old set (pale oak lids, plastic tubs, a white screw lid: three lid families on one shelf). | REDRAW the naan (B3a, B3b) and the four jugs (B5); FIX IN CODE: the oven, the walnut jars |
| **Eggs** | The pot (`v4/kit/pot-water`): its wall is uneven (ART-75, redo written). The whole egg is a 100 px prototype (`proto/eggs/egg-brown`), also its card. The table pieces are still the prototype plate, fried egg and egg cup; their replacements (E1-E3) are cut and wired on branch s19-fixes-e. The boiled egg has one stage. | Pot: the written redo. REDRAW the whole egg and the boiled stages (E5). FIX IN CODE: E1-E3 |
| **Corn** | The grill (`v4/kit/grill`) keeps white patches of its old ground beside both handles and a ragged right edge: hidden on the marble, visible under the dim. The six dressing bowls (mini run) have a thicker, peachier rim than the cream bowls of the full run. | FIX IN CODE: recut the grill, tint the rims |
| **Pantry** | **The whole shelf** (36 pictures, `shelf-*-bare-f`, `shelf-*-jar-v2-f`): 256 px, six lid families (pale oak, steel, black, white, gold, walnut), plastic tubs, squeeze bottles, pine crates. The cupboard picture (`bg-pantry-v3-1600`) has pale orange-oak shelves, not walnut. | FIX IN CODE: the walnut set has 35 of the 36 (only the orange is missing). REDRAW: the orange (PS1) |
| **Shared kit** | The kitchen, the hob, the knobs, the stone tray, the word moment, the gold effects and Nani pass. The older `shared/fx-s11` steam and sparkle (a flat sticker look) are still on chai's list. Nana, Ma and the cousin are the placeholder designs (people are your own runs; not in this audit). | PASS; FIX IN CODE: drop fx-s11 if unused |

**The new art's own two flaws (fix in code, before the store build):**
- **A hairline pink rim.** 45 of the 86 v4 cuts on this branch keep a one-pixel line of the magenta ground (every cream bowl, the
  chop set, the eggs). You cannot see it at game size (`zoom-at-game-size.jpg`); you can at four times (`zoom-v4-chop.jpg`). The
  art tools pass it because they measure grey grounds, not magenta. One pass of `artdespill.py`, then a magenta rule in the pixel check.
- **Four stages:** maani, samosa, sekelo's five kinds, corn and fried eggs have them. Missing: baking's naan, sekelo's chicken,
  chilli and corn, the boiled egg.

## (b) The stored library

| Group | Pictures | Verdict | Why | Matters soon? |
|---|---|---|---|---|
| `items-s17-stove/f-*` (the walnut shelf set) | 129 | **PASS** | One jar, one lid, one light, clean cuts; chai's and eggs' shelves use 12 of them | Yes: the pantry, baking's shelf, the farm's foods (corn, lemon, tomato, chilli, mango, eggs, carrot) |
| `items-s17-stove/t-dish-*` (dishes on plates) | 52 | **PASS** as card and served pictures | Straight down, cream plates, the house look. The dabeli is still seen from the front (known) | For order cards when a dish is added |
| `items-s17-stove/t-*` loose foods (heaps, whole, cooked pieces) | 78 | **PASS** as they are; **stages missing** | Straight down, right light, clean. But cooked things have two or three stages, never four (chicken cubes, bhajia, mandazi, puri, paratha, naan) | Only when a game cooks one: redraw that food's four stages in one image then |
| `items-s17-stove/t-*-katori` | 32 | **REDRAW when used** | Steel katoris with a warm champagne tint; the house bowl is cream ceramic | No |
| `items-s17-stove/t-*` other bowls | 13 | **REDRAW when used** (the small glass bowl passes) | Steel bowls, tools left in two (a fork, a brush) | No |
| `items-s17-stove/t-*` tools and vessels | 42 | **REDRAW when used** | Oak, coral, sage and yellow handles (the rule is walnut and steel); warm steel; a pot and a pressure cooker at a tilt | No |
| `cook/items/` root: `shelf-*` | 69 | **REDRAW** (replace from the walnut set) | 256 px, mixed lids, plastic tubs, pine crates | Yes: the pantry and baking show it now |
| `cook/items/` root: `icon-*` | 63 | **REDRAW** | Glossy sticker look; includes biscuits, chocolate, sprinkles | The farm uses the corn icon: swap to the walnut set's cob |
| `cook/items/` root: top-down sets (`veg-`, `spice-`, `topping-`, `layer-`, `mishkaki-`, `maani-`, `samosa-`, `vessel-`, `tool-`) | 153 | **REDRAW** | 256 px, the older thicker bowl, oak tools, tilted vessels. v3 and v4 already replace most; the word cards still use eight `veg-*-whole-t` | The cards only (v4's chop set has the six vegetables: fix in code) |
| `cook/items/v3/` (in use) | 150 | Mixed | Chai's pans, the hob and maani pass (35). Daar's pots and samosa's karahi are tilted; sekelo's and samosa's food is three-quarter view | Covered in (a) |
| `cook/items-s08b`, `-s08c`, `-s12`, `-s14` | 135 | Mixed | Chai's pans, glasses and teaspoons (80) are chai's own and pass. Sekelo's trays and extra kinds, chaat's strips and the old pots do not | Covered in (a) |
| `cook/items/chaat-v2`, `samosa-v2`, `maani-v2`, `sekelo`, `served`, `jar`, `s17-cook-redo` | 73 | **REDRAW** if ever used again | Deep side-on cream bowls, 300 px served dishes at three-quarter view. The served dishes still show at the island | The served dishes: a later run, when the island's serve is redone |
| `cook/proto/` (eggs, baking, corn prototypes) | 83 | **REDRAW** (retire as v4 lands) | 100-480 px, steel bowls, a non-stick pan, tick-marked jugs. Eggs' two kitchen backgrounds pass (they are the house kitchen, relit) | About 14 still load in baking and eggs: covered in (a) |
| `cook/props/` | 39 | **REDRAW** (retire) | The first three-quarter set with shadows painted in | No; stop loading them |
| `assets/items/` (fruit, spice, vegetable) | 51 | **REDRAW** (retire) | The old outlined storybook look, the art bible's anti-reference | Only the town prototype uses them |
| `characters/hen`, `goat`, `chick` | 27 | **PASS** | The house look, clean cuts, nine poses each | Yes: the farm |
| The farm's other pictures (cow, sheep, the ride's hills, fields, verge, tree, bush, haystack, `farm/proto`) | about 15 | **REDRAW** | Cartoon look with outlines, one pose each for cow and sheep; a flat cartoon sky (the s17 skies exist: fix in code) | Yes: the farm trip |
| `safari/proto` | 11 | **REDRAW** | Grass and a yellow halo baked into every animal; animals painted into the scenes | Yes: the animal trip |
| `pets-proto`, `town-proto`, `sewing-proto` | 31 | **REDRAW** | Mock-up crops in circles, a brighter cartoon look | Not yet |
| `sources/art/chatgpt-batch3` (58 sheets) | 58 | Mixed | Hen, goat and chick sheets pass and are cut. The family's feelings, the guests, the older cousin and Kasuku are in the film look but pre-date the locked people (16 Oct): re-judge before any use. The courtyard and sitting-room backgrounds pass in look and are unused. Its cook sheets are the old root set | The courtyard, for the farm's arrival, if you like it |

**In numbers.** The stove set (346): 259 pass (75%), 87 are redrawn when a game takes one. The older sets (about 690 pictures):
none at the standard except chai's own pans and glasses, the hob and maani. Your 10 Nov rule (a piece used again must already be
at the standard) therefore means: **reuse freely from the walnut shelf set, the dishes, the loose foods and v4; nothing else.**

## (c) The proposed next art run

Method as the S19 runs: three chats at once; per line the plan in text, then the image, then the two-message review. All
top-down lines on magenta with no shadow. **"Photo first"** = your stubborn-picture method: a plain realistic photo in a fresh
chat, then the game version from that photo in a new chat (as the pot redo block does).

**Run 1: the kitchen, used now (13 lines, 26 images, 4 plain photos).** The pot redo (P1, P2) runs from its own block.

Chat 1, steel and wood, straight down:
- **D1** daar's steel pot with two handles, empty; the wall band the same width all round. *Photo first.*
- **D2** the same pot with oil (an edit of D1).
- **K8** samosa's karahi with oil (the line from the redraw block that never landed). *Photo first.*
- **M1** maani's round walnut board and rolling pin, exactly from above (ART-62). *Photo first.*

Chat 2, food, straight down:
- **D3** daar's pot contents as six flat discs: seeds in oil, onion frying, onion and chilli, tomato masala, daar, daar with tadka.
- **K2b** sekelo's other three kinds (chicken, chilli, corn) in four stages, a grid like K2.
- **K9** sekelo's raw pieces in the cream bowl, eight bowls like F5 (meat, tomato, onion, pepper, potato, chicken, chilli, corn).
- **E5** one whole brown egg; and the halved boiled egg in four stages (runny, soft, firm, overdone).
- **S5** the cream plate lined with a paper napkin (an edit of K5's cream plate).

Chat 3, side-on:
- **B3a** the naan tray: raw and part-baked. **B3b** baked and overdone. Two per image so the trays stay large (ART-73). *Photo first* (it failed twice).
- **B5** the B2 glass jug full of flour, of milk, of sugar, of yoghurt (four jugs; code masks the levels).
- **PS1** the orange in the walnut shelf family (with an apple and a pear on the same line, for later).

**Run 2: the farm trip, when its design is settled (7 lines, 14 images).** FA1 the cow and FA2 the sheep in the five shared poses
(stand, eat, up, sit, happy; the goat's sheet attached as the style). FA3 farm things: a grass tuft, a bucket of water, one egg,
a hay bale. FA4-FA6 the three scenery layers (far hills, fields, the near verge). FA7 the tree, bush and haystack. Hannah Mami is
a person: her own sheet, your process.

**Run 3: the animal trip, when its design is settled (7 lines, 14 images).** SA1 elephant, SA2 giraffe (grown and small), SA3
zebra, each in the five shared poses on a plain ground. SC1-SC3 the three scenes with no animals (grass, the tree, the
waterhole). SC4 the grass clump.

**No art needed (fix in code), in this order:** 1. samosa's cream bowls and slotted spoon; 2. sekelo's v4 tray, grill, skewer,
plate and the walnut board; 3. the pantry's and baking's shelves from the walnut set; 4. the oven from the mini run's B3-2;
5. the grill recut; 6. the pink rim pass on v4; 7. daar's v4 knife and bowls; 8. cards for carrot, peas and fruit from the
walnut set (ART-65) and sekelo's mixed skewer composed from v4 (ART-68); 9. corn's bowl rims; 10. the farm's sky and foods
from the s17 skies and the walnut set; 11. stop loading `cook/props/` and `fx-s11`.

**Not in any run:** chai's pan states (only if the pot redo wins in eggs: then its own run, as you planned); the served dishes
at the island; the 87 stored katoris, bowls and tools; people.

## Decisions (yes to all except ...)

1. **Run 1 as listed** (13 lines), pasted after the pot redo. Recommend yes.
2. **Daar's pot:** one empty pot, one with oil, and the contents as flat discs laid in by code (D1-D3, recommended: three lines,
   and every later dish reuses the pot), or all 13 states redrawn (about seven lines).
3. **Sekelo's threading band in cream bowls (K9)**, like every other band. Recommend yes; no = keep the loose heaps.
4. **The pantry on the walnut set**, single vegetables in place of the pine crates, its shelves from the kit's stone shelf.
   Recommend yes; the other way is a new walnut cupboard picture in one of your background runs.
5. **The boiled egg in four stages (E5).** Recommend yes: it is the one cooked thing in eggs without them.
6. **Corn's six bowls:** tint the rims in code (recommended), or one more line.
7. **The older sets are retired, kept on disk:** a check fails a kitchen page that loads from `cook/props`, the old root sets or
   `proto` once its game is on v4. Recommend yes (it is your 10 Nov rule as a check).
8. **The farm and animal runs wait for those modes' designs.** Recommend yes.

## Proof

Contact sheets made with PIL from the repo's files, each picture on mid-grey and on dark with its size and a pink-rim number;
every one below was opened and looked at. Copies: `sources/art/audit-2026-11-10/` (47 jpg, 23 MB).

- The standard: `v4-all-1.jpg`, `v4-all-2.jpg` (124 v4 pieces, E2's marked), `src-s19-best.jpg` (the 40 picks of both S19 runs).
- In play (existing side-by-side shots at 1280x665, six frames a game): `play/eggs.jpg`, `daar.jpg`, `maani-line.jpg`, `corn.jpg`,
  `mishkaki-grill.jpg`, `samosa.jpg`, `chaat.jpg`, `baking.jpg`, `chop.jpg` (the last four games before wave E2).
- Loaded now, by game: `game-chai-tray-1.jpg`, `-2.jpg`, `game-maani-line.jpg`, `game-daar-1.jpg`, `-2.jpg`,
  `game-mishkaki-grill-1.jpg`, `game-samosa.jpg`, `game-assemble.jpg` (chaat), `game-baking.jpg`, `game-eggs.jpg`,
  `game-fetch.jpg` (pantry), `kit-shared-1.jpg`, `-2.jpg`.
- Camera and cut checks: `camera-suspects.jpg` (25 vessels, trays, boards and plates at 300 px), `zoom-v4-chop.jpg` (the pink
  rim at four times), `zoom-v4-grill.jpg` (the white patches), `zoom-at-game-size.jpg`, `check-oven-bg.jpg` (eggs' two kitchens, the mini run's
  oven and grill as drawn, the pantry's cupboard).
- Stored: `stove-f-1.jpg`, `-2.jpg`, `stove-t-1.jpg`, `-2.jpg`, `-3.jpg`, `old-root-top-1.jpg`, `-2.jpg`, `old-root-shelf-1.jpg`,
  `old-misc-1.jpg`, `-2.jpg`, `old-s08-s14-1.jpg`, `proto.jpg`, `v3-1.jpg`, `-2.jpg`, `src-batch3.jpg`.
- Next modes: `trips.jpg`, `farm-now.jpg`.
- Tools: `artcolour.py` on v4 (86 pictures: 74 pass, 12 flag, 0 fail); `artpixels.py` on v4 (86 pass; it does not measure
  magenta); `loadcheck.mjs --manifest` for the 14 kitchen pages, run here and in the wave E2 worktree.
- Not done: no browser run, so a picture a page names but never draws is listed as loaded. Not looked at: the clinic (its own
  redo), the hands, the day and story art, the second sheets of the old shelf set and of the s08-s14 folders (same families
  as the first).

## Appendix: every picture each kitchen page names today

From `node build/tools/review/loadcheck.mjs --manifest cook:<page>` on this branch (10 Nov), wide patterns given as a count.
Daar's page carries its chop, tadka and stir; `cook/items/chai-station/` and `v3/hob/` are the shared hob, flames and knobs.

**Shared kitchen kit (every kitchen page): 24 pictures preloaded**
- `cook/bg/` (2): service, service-master-v2
- `cook/characters/` (15): nani-neutral-v3, nani-talk-v3, nani-happy-v3, nani-point-v3, nani-point-front-v3, nani-blink-v3, nana-happy, nana-neutral, nana-impatient, ma-happy, ma-neutral, ma-impatient, cousin-happy, cousin-neutral, cousin-face
- `characters/ali/` (3): cousin-impatient, cousin-talk, cousin-blink
- `characters/nana/` (2): nana-talk, nana-blink
- `characters/ma/` (2): ma-talk, ma-blink
- allowed on every page: `cook/bg/service*`, `cook/characters/*`, `shared/faces/*`, `ui/**`, `cook/bg/bg-cook-*-1600.webp`, `cook/worktop-s08c/*`, `cook/worktop-s17/*`, `shared/panel/*`, `shared/juice/bu-*.webp`

**Pantry (fetch): 51 pictures named**
- `cook/props/` (11): water-jug, tea-tin, milk-jug, atto, daal-dry, chapati-puffed, onion, tomato, chilli, garlic, elchi
- `cook/items/` (38): vessel-water-jug-f, vessel-milk-jug-f, shelf-cook-atto-bare-f, shelf-cook-khun-bare-f, shelf-cook-chai-bare-f, shelf-cook-daal-bare-f, shelf-ph-chana-bare-f, shelf-ph-sev-bare-f, shelf-spi-01-bare-f, shelf-spi-02-bare-f, shelf-spi-05-bare-f, shelf-elchi-jar-v2-f, shelf-loon-jar-v2-f, shelf-spi-04-bare-f, shelf-cook-dudh-bare-f, shelf-cook-paani-bare-f, shelf-ph-amli-bare-f, shelf-ph-lili-bare-f, shelf-ph-dahi-bare-f, shelf-ph-keema-bare-f, shelf-ph-meat-bare-f, shelf-ph-ghee-bare-f, shelf-veg-01-bare-f, shelf-veg-02-bare-f, shelf-veg-03-bare-f, shelf-veg-12-bare-f, shelf-lasan-jar-v2-f, shelf-aadu-jar-v2-f, shelf-veg-10-bare-f, shelf-ph-pepper-bare-f, shelf-ph-dhana-bare-f, shelf-fru-02-bare-f, shelf-spi-11-bare-f, shelf-spi-09-bare-f, shelf-fru-01-bare-f, shelf-fru-04-bare-f, shelf-fru-05-bare-f, shelf-veg-04-bare-f
- `cook/items/v3/maani/` (1): maani-wheat-cooked
- `cook/bg/` (1): bg-pantry-v3-1600
- also allowed by a wide pattern (loaded only when a word needs one): `cook/items/shelf-*` (69)

**Chai: 123 pictures named**
- `cook/props/` (4): water-jug, tea-tin, milk-jug, elchi
- `cook/items/` (15): vessel-water-jug-f, vessel-milk-jug-f, vessel-saucepan-t, dry-chai-leaves-bowl-t, spice-jeeru-bowl-t, spice-rai-bowl-t, dry-khun-bowl-t, spice-loon-bowl-t, spice-elchi-bowl-t, veg-aadu-grated-bowl-t, veg-lasan-chopped-t, shelf-lasan-jar-v2-f, shelf-aadu-jar-v2-f, shelf-elchi-jar-v2-f, shelf-loon-jar-v2-f
- `cook/bg/` (1): bg-cook-worktop-t-v1
- `cook/items-s17-stove/` (10): f-water-bottle, f-milk-carton, f-tea-jar, f-sugar-jar, f-cardamom-jar, f-ginger-jar, f-garlic-jar, f-salt-jar, f-cumin-seeds-jar, f-mustard-seeds-jar
- `cook/items-s14/glass/` (13): glass-empty-top-s14, glass-fill-milky-1-s14, glass-fill-milky-2-s14, glass-fill-milky-3-s14, glass-fill-milky-4-s14, glass-fill-milky-5-s14, glass-fill-milky-6-s14, glass-fill-black-1-s14, glass-fill-black-2-s14, glass-fill-black-3-s14, glass-fill-black-4-s14, glass-fill-black-5-s14, glass-fill-black-6-s14
- `shared/fx-s11/` (2): steam-s11, sparkle-s11
- `cook/items/chai-v2/` (25): pan-pour-milk-v2, pan-pour-black-v2, pan-tilt-0-v2, pan-tilt-15-v2, pan-tilt-30-v2, pan-tilt-45-v2, glass-black-empty, ginger-root-t, ginger-slices-t, glass-black-full, glass-black-half, glass-empty, glass-full, glass-half, hob-2-burner-t, liquid-dark, liquid-milk, liquid-milky, liquid-tea, pan-pour-black, pan-pour-milk, pan-pour, pan-top, teaspoon-t, tray-4-cutout-t
- `cook/items-s08c/glass/` (1): glass-black-top-s08c
- `cook/items-s08c/teaspoon/` (3): teaspoon-sugar-s08c, teaspoon-empty-s08c, teaspoon-chai-s08c
- `cook/items/chai-station/` (6): flame-high, flame-low, glass, knob-off, knob-on, tray
- `cook/items-s14/chai-pan/` (24): pan-black-s14, pan-boil-milky-s14, pan-empty-black-1-s14, pan-empty-black-2-s14, pan-empty-black-3-s14, pan-empty-black-4-s14, pan-empty-black-5-s14, pan-empty-black-6-s14, pan-empty-milky-1-s14, pan-empty-milky-2-s14, pan-empty-milky-3-s14, pan-empty-milky-4-s14, pan-empty-milky-5-s14, pan-empty-milky-6-s14, pan-empty-pink-1-s14, pan-empty-pink-2-s14, pan-empty-pink-3-s14, pan-empty-pink-4-s14, pan-empty-pink-5-s14, pan-empty-pink-6-s14, pan-empty-s14, pan-leaves-s14, pan-milk-s14, pan-water-s14
- `cook/items/v3/chai/` (9): pan-boil-milky, pan-boil-tea, pan-empty, pan-foam, pan-leaves, pan-milky, pan-spiced, pan-tea, pan-water
- `cook/items/v3/hob/` (10): hob-1, hob-2, hob-3, hob-4-v2, hob-4, hob-wide, knob-off-v2, knob-off, knob-on-v2, knob-on
- also allowed by a wide pattern (loaded only when a word needs one): `cook/items/*-bowl-t.webp` (24); `shared/word-moment/*-s17.webp` (52); `cook/items/shelf-*` (69); `cook/items/veg-*` (45); `shared/juice/sk-*.webp` (5); `shared/juice/st-*.webp` (6); `shared/juice/td-*.webp` (6)
- named in the manifest but not on disk: `cook/bg/cook/worktop-s17/marble-white-s17.webp`

**Maani: 43 pictures named**
- `cook/props/` (6): atto, dough-ball, chapati-raw, chapati-half, chapati-puffed, tawa
- `cook/items/v3/maani/` (16): dough-ball-wheat, maani-wheat-raw, maani-wheat-half, maani-wheat-cooked, maani-wheat-burnt, dough-ball-millet, maani-millet-raw, maani-millet-half, maani-millet-cooked, chakla, dough-pile-millet, dough-pile-wheat, maani-millet-burnt, tawa, turner, velan
- `cook/items/` (1): vessel-tawa-t
- `cook/items/maani-v2/` (1): thali
- `cook/items/v4/kit/` (1): plate-steel
- `cook/items/chai-station/` (6): flame-high, flame-low, glass, knob-off, knob-on, tray
- `cook/items/v3/hob/` (10): hob-1, hob-2, hob-3, hob-4-v2, hob-4, hob-wide, knob-off-v2, knob-off, knob-on-v2, knob-on
- `cook/items/v4/maani/` (2): dough-millet, dough-wheat
- also allowed by a wide pattern (loaded only when a word needs one): `cook/items/shelf-*-bare-f.webp` (63); `cook/items/shelf-veg-1*-jar-f.webp` (2)
- named in the manifest but not on disk: `cook/props/chapati-burnt.webp`, `cook/props/dough-ball-bajr.webp`, `cook/props/chapati-raw-bajr.webp`, `cook/props/chapati-half-bajr.webp`, `cook/props/chapati-puffed-bajr.webp`

**Sekelo: 83 pictures named**
- `cook/props/` (2): onion, tomato
- `cook/items/` (20): skewer-empty-t, vessel-katori-t, mishkaki-meat-raw-t, mishkaki-pepper-raw-t, mishkaki-dungri-raw-t, mishkaki-tameto-raw-t, veg-bataato-cubed-v2-t, plate-enamel-empty-t, tool-board-t, skewer-mixed-grilled-t, mishkaki-bataato-raw-t, mishkaki-dungri-charred-t, mishkaki-dungri-grilled-t, mishkaki-meat-charred-t, mishkaki-meat-grilled-t, mishkaki-pepper-charred-t, mishkaki-pepper-grilled-t, mishkaki-plated-t, mishkaki-tameto-charred-t, mishkaki-tameto-grilled-t
- `cook/items-s08b/potato/` (1): potato-cube-v3
- `cook/items/v3/sekelo/` (38): plate-plain-t, grill, heap-meat, heap-onion, heap-pepper, heap-potato, heap-tomato, meat-charred, meat-grilled, meat-raw, onion-charred, onion-grilled, onion-raw, pepper-charred, pepper-grilled, pepper-raw, plate-0-v2, plate-0, plate-1-v2, plate-1, plate-2-v2, plate-2, plate-3-v2, plate-3, plate-4-v2, plate-4, potato-charred, potato-grilled, potato-raw, rack-0, rack-1, rack-2, rack-3, rack-4, stick, tomato-charred, tomato-grilled, tomato-raw
- `cook/items/sekelo/` (4): bowl-ph-meat-top, grill-t, rack-t, stick-v
- `cook/items-s08b/go-on/` (1): go-grill-s08b
- `cook/items-s08c/sekelo-tray/` (5): tray-0-s08c, tray-1-s08c, tray-2-s08c, tray-3-s08c, tray-4-s08c
- `cook/items-s08c/sekelo/` (12): chicken-charred-s08c, chicken-grilled-s08c, chicken-heap-s08c, chicken-raw-s08c, chilli-charred-s08c, chilli-grilled-s08c, chilli-heap-s08c, chilli-raw-s08c, corn-charred-s08c, corn-grilled-s08c, corn-heap-s08c, corn-raw-s08c
- also allowed by a wide pattern (loaded only when a word needs one): `cook/items/shelf-*-bare-f.webp` (63); `cook/items/shelf-veg-1*-jar-f.webp` (2); `cook/items/veg-*` (45)
- named in the manifest but not on disk: `cook/bg/cook/worktop-s17/marble-white-s17.webp`, `cook/items/cook/items-s08b/potato/potato-cube-v3.webp`

**Daar (its chop, tadka and stir inside): 94 pictures named**
- `cook/props/` (7): knife, pot, onion, tomato, chilli, garlic, daal-dry
- `cook/items-s08b/` (1): daar-pot-top-s08b
- `cook/items-s08b/daar-discs/` (2): disc-daal-plain-s08b, disc-daal-stirred-s08b
- `cook/items/` (1): tool-knife-t-v2
- `cook/items-s17-stove/` (2): t-small-glass-bowl, t-steel-serving-bowl
- `cook/items/v4/kit/` (1): ladle
- `cook/items/v3/daar/` (40): daar-bowl-plain-t, trivet-t, chop-heap-chilli, chop-heap-onion, chop-heap-tomato, chop-piece-chilli, chop-piece-onion, chop-piece-tomato, daar-bowl-trivet-plain-v2, daar-bowl-trivet-plain, daar-bowl-trivet-v2, daar-bowl-trivet, dial-fast, dial-slow, dial-spill, dial-stopped, dp1-chilli-1, dp1-chilli-2, dp1-onion-heap, dp1-onion, dp1-paste, dp1-tomato, ladle-v2, ladle-v3, ladle, pot-chilli-only, pot-chilli, pot-daar, pot-empty, pot-oil, pot-onion-chilli, pot-onion, pot-seeds, pot-stir, pot-tadka-v2, pot-tadka, pot-tomato-chilli, pot-tomato-only, pot-tomato, veg-bowl
- `cook/items/chai-station/` (6): flame-high, flame-low, glass, knob-off, knob-on, tray
- `cook/items/v4/chop/` (6): adu-whole, bataato-whole, dungri-whole, lasan-whole, marcha-whole, tameto-whole
- `cook/items/v3/hob/` (10): hob-1, hob-2, hob-3, hob-4-v2, hob-4, hob-wide, knob-off-v2, knob-off, knob-on-v2, knob-on
- `cook/items-s08c/kadchi/` (2): kadchi-daal-s08c, kadchi-s08c
- `cook/items-s08c/daar-in/` (8): in-chilli-s08c, in-cumin-s08c, in-garlic-s08c, in-ginger-s08c, in-mustard-s08c, in-onion-s08c, in-potato-s08c, in-tomato-s08c
- `cook/items/v4/daar/` (8): elchi, hardar, jeeru, lal-marcha, lasan, lila-marcha, loon, rai
- also allowed by a wide pattern (loaded only when a word needs one): `cook/items/shelf-*-bare-f.webp` (63); `cook/items/shelf-veg-1*-jar-f.webp` (2); `cook/items/shelf-*` (69); `cook/items/veg-*` (45)

**Chop: 34 pictures named**
- `cook/props/` (7): knife, pot, onion, tomato, chilli, garlic, daal-dry
- `cook/items/` (7): tool-knife-t-v2, veg-bataato-whole-v2-t, veg-dungri-whole-t, veg-tameto-whole-t, veg-marcha-whole-t, veg-lasan-whole-t, veg-aadu-whole-t
- `cook/items/v4/chop/` (18): bataato-whole, bataato-half-a, bataato-half-b, dungri-whole, dungri-half-a, dungri-half-b, tameto-whole, tameto-half-a, tameto-half-b, marcha-whole, marcha-half-a, marcha-half-b, lasan-whole, lasan-half-a, lasan-half-b, adu-whole, adu-half-a, adu-half-b
- `cook/items/v4/kit/` (1): knife
- `cook/items/v3/samosa/` (1): board
- also allowed by a wide pattern (loaded only when a word needs one): `cook/items/shelf-*-bare-f.webp` (63); `cook/items/shelf-veg-1*-jar-f.webp` (2); `cook/items/veg-*` (45); `cook/items/shelf-veg-*-bare-f.webp` (8)

**Chaat (assemble): 26 pictures named**
- `cook/props/` (2): onion, chilli
- `cook/items-s08b/` (1): chaat-bowl-side-s08b
- `cook/items/v3/chaat/` (13): bowl-side-v2, bowl-side, pot-chana, pot-chilli, pot-chutney, pot-dahi, pot-dhania, pot-imli, pot-onion, pot-potato-v2, pot-potato, pot-sev, pot-tomato
- `cook/items-s08b/chaat-strips/` (10): strip-chickpea-s08b, strip-chilli-s08b, strip-coriander-s08b, strip-green-chutney-s08b, strip-onion-s08b, strip-potato-s08b, strip-sev-s08b, strip-tamarind-s08b, strip-tomato-s08b, strip-yogurt-s08b
- also allowed by a wide pattern (loaded only when a word needs one): `cook/items/veg-*-whole-t.webp` (8); `cook/items/shelf-*-bare-f.webp` (63); `cook/items/shelf-veg-1*-jar-f.webp` (2)

**Samosa: 65 pictures named**
- `cook/props/` (2): onion, chilli
- `cook/items/` (2): samosa-fried-golden-t, vessel-thali-t
- `cook/items-s08b/potato/` (1): potato-pile-v3
- `cook/items/v3/samosa/` (24): fold-v2-1, fold-v2-2, fold-v2-3, fold-v2-4, fold-v2-5, fold-v2-6, board, fill-cabbage, fill-carrot, fill-chilli, fill-chundo, fill-dhania, fill-onion, fill-peas, fill-potato, fold-1, fold-2, fold-3, fold-4, fold-5, fold-6, jharo, karahi, plate
- `cook/items/chai-station/` (6): flame-high, flame-low, glass, knob-off, knob-on, tray
- `cook/items/samosa-v2/` (14): fry-0, fry-1, fry-2, fry-3, karahi, plate-paper, prep-ph-keema, prep-veg-10, stage-0, stage-1, stage-2, stage-3, top-ph-keema, top-veg-10
- `cook/items/v3/hob/` (10): hob-1, hob-2, hob-3, hob-4-v2, hob-4, hob-wide, knob-off-v2, knob-off, knob-on-v2, knob-on
- `cook/items/v3/daar/` (3): chop-heap-chilli, chop-heap-onion, chop-heap-tomato
- `cook/items-s08b/go-on/` (1): go-karahi-s08b
- `cook/tiles-s08b/` (2): pastry-tile-s08b-tile, pastry-tile-s08b
- also allowed by a wide pattern (loaded only when a word needs one): `cook/items/shelf-*-bare-f.webp` (63); `cook/items/shelf-veg-1*-jar-f.webp` (2)

**Baking: 35 pictures named**
- `cook/proto/baking/` (22): bg-counter, oven-shut, oven-baking, oven-open, bowl-f-0, bowl-f-1, bowl-f-2, bowl-f-3, bowl-f-4, bowl-f-dough, jug-empty, jug-water, jug-milk, jug-flour, jug-yoghurt, jug-sugar, tray, naan-raw, naan-puff, naan-golden, naan-deep, naan-alone
- `cook/proto/` (1): cat-peek
- `cook/props/` (1): dough-ball
- `cook/items/` (7): shelf-cook-atto-bare-f, shelf-cook-paani-bare-f, shelf-cook-dudh-bare-f, shelf-cook-khun-bare-f, shelf-loon-jar-v2-f, shelf-ph-dahi-bare-f, shelf-ph-ghee-bare-f
- `shared/word-moment/` (4): stream-flour-s17, stream-water-s17, stream-milk-s17, stream-sugar-s17

**Eggs: 24 pictures named**
- `cook/proto/eggs/` (6): bg-kitchen-morning, bg-kitchen-night, egg-brown, plate-f, egg-fried-f, eggcup-egg-f
- `cook/items/chai-v2/` (1): tray-4-cutout-t
- `cook/items/v4/kit/` (1): plate-cream
- `cook/items-s14/chai-pan/` (1): pan-water-s14
- `cook/items/v4/eggs/` (6): pan-steel-short, egg-cracked, egg-cooked, egg-overdone, egg-boiled-half-a, egg-boiled-half-b
- `cook/proto/` (1): cat-sit
- `cook/items/v3/hob/` (3): hob-2, knob-off-v2, knob-on-v2
- `cook/items/chai-station/` (2): flame-high, flame-low
- `cook/items-s17-stove/` (3): f-eggs-in-a-box, f-salt-jar, f-black-pepper-jar

**Corn: 13 pictures named**
- `cook/items/v4/kit/` (3): grill, tray-steel, plate-cream
- `cook/items/v4/corn/` (9): cob-raw, cob-turned, cob-done, bowl-lemon, bowl-salt, bowl-chilli-powder, bowl-green-chutney, bowl-tamarind-chutney, bowl-black-pepper
- `cook/items/` (1): veg-limu-whole-t
