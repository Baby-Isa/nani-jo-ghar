# Art block 2 plan (pack `s17-art2`): fetch and serve (the stalls, the shop, paying)

**Written:** 3 Nov 2026 overnight, a **first draft** for Zafar to run (Zafar, 3 Nov: "can you get me the art block now so I can set
it to run overnight"). The fetch-and-serve family is rolled out in Sprint 19 (`docs/sprints/plan.md`): the fruit stall (serve, the
town), Nani's picky shopping (the general store), the beach's three stalls, the cloth stall (sewing), and paying, which all four
share. **Decision 77:** Claude wrote this plan and its block; Zafar runs it in ChatGPT; Claude judges, cuts and wires.
**ART-29:** one paste block, every reference on the branch the block reads. **Run spec:** `build/tools/art/specs/s17-art2.run.yaml`;
the block: `docs/design-language/art-plans/s17-art2-chrome-block.txt`.

**Keep the laptop awake for the whole run:** on a Mac, `caffeinate -dims` in Terminal, charger in, lid open; on Windows,
PowerToys Awake on.

## 0. Totals

| Part | What | Lines | Game pictures |
|---|---|---|---|
| A | The fruit stall (serve, the town) | FS, FX, FP, FW, FB | 1 + 6 + 8 + 3 + 4 = 22 |
| B | Picky shopping (the general store) | GS, GG | 1 + 8 = 9 |
| C | Paying (every stall) | PC, PT | 6 + 6 = 12 |
| D | The beach's three stalls | BH, SC, SF, SK, SN, SO, SB | 1 + 1 + 1 + 1 + 6 + 6 + 3 = 19 |
| E | The cloth stall (sewing) | CL, CB | 1 + 8 = 9 |
| | **Total** | **18 prompts** | **71 game pictures**; about 25 images with the expected redos; about 1.5 hours in three windows |

**Not in this block, on purpose:**
- **The pantry (PAN-06):** its side-on shelves and fridge (`assets/cook/bg/bg-pantry-v3-1600.webp`) and every container on them,
  the meat included (`data/cook.json` art.sprites.shelf: ph-chicken, ph-meat, ph-keema, ph-fish), were drawn in pantry v2 and v3.
  Its jars stay bare (no labels: Zafar's standing assumption). Nothing new to draw; PAN-06 is checked against them at Sprint 18.
- **The pharmacy belt:** the clinic's s07 belt sheets serve it.
- **People** (the stallholders, the customers, Nani's monocle and stagger poses, Masi): people come from character sheets, and
  Nani is a real person (decision 29: Zafar approves her art). The mock-ups' people are for the scene only; nothing copies them.
- **The produce already drawn** for the cook (onion, tomato, potato in `assets/items/vegetable/`) is redrawn here once at the
  stall's scale and light (FP), so the stall's crates and singles match; the cook keeps its own.

## 1. Flaws and uncertainties first

1. **The stall's view.** The serve game is played from behind the counter (the town prototype's report: "the stall seen from behind
   the counter"); the mock-up shows the customer's side. FS draws the seller's side: the counter top a band across the bottom, the
   lane and its far stalls beyond, empty. If it reads as the customer's side, the redo says so.
2. **The scale has no numbers** (the leak test: no winning by reading). Its dial has plain ticks; the needle at three places (FW)
   lets the game show light and heavy without numbers.
3. **Coins have no numbers or writing:** they are counted by the stack (the beach prototype pays "with a stack of coins").
4. **The beach stalls are carts without their people;** the game seats a stallholder from a sheet behind each later.
5. **Cloth bolts:** ajrakh and mirror-work are welcome (the family's own), nothing religious.

## 2. What each game has now, and what this block makes

| Game | Now (placeholder) | This block |
|---|---|---|
| The fruit stall (`js/town-proto/serve.js`) | the mock-up's cut, CSS crates, the cook's fruit pictures | FS the stall from behind; FX six full crates; FP eight fruit and vegetables; FW the scale; FB the paper bag |
| Picky shopping (`js/town-proto/picky.js`) | the cook's pot and glass, the clinic's cup | GS the shop from behind its counter; GG eight goods |
| Paying (town, beach, sewing) | CSS circles for coins, a child's hand | PC coins and stacks; PT the seller's tin and two purses |
| The beach stalls (`js/beach-proto/stalls.js`) | CSS carts and cones | BH the beach; SC, SF, SK the three carts; SN cones; SO coconuts; SB the fryer's basket |
| The cloth stall (`js/sewing-proto/stall.js`) | flat CSS bolts | CL the stall; CB eight bolts |

## 5. The prompts

Every prompt is one image. Sheets are cut by their gutters; nothing touches a cell's edge.

#### FS. The fruit stall, from behind its counter
```
Generate an image, 1536×1024, landscape.

A background for a children's shopping game, seen from BEHIND a fruit stall's counter, as the stallholder sees it, at a child's standing eye level. The wooden counter top runs across the whole bottom quarter of the image as one straight horizontal band of warm honey planks, completely empty. Above, the front edge of a cream-and-terracotta striped cloth awning runs across the top tenth, with two plain wooden posts at the far left and right. Between them, beyond the counter, a sunny little market lane of whitewashed houses with arched doorways and terracotta roofs, potted lemon trees, and two small fruit stalls further away, softly out of focus. The middle of the image is open lane with nothing close to the counter, so customers can be placed there by the game.
The attached mock-up shows the lane, the light and the colours: copy its town, light and palette, NOT its people, scale or fruit, and turn the view round so we stand behind the counter.

No people, no animals, no fruit or things on the counter, no signs.

Style: a stylised 3D animated-feature-film look, warm soft global illumination, golden late-morning light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### FX. Six crates of fruit and vegetables
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's shopping game: the SAME shallow woven wicker crate six times in a 3 by 2 grid, each in its own cell, the same size and place in its cell, seen from the front about 30 degrees down, each heaped with one kind: (1) ripe mangoes, red-blushed yellow-green; (2) bright yellow lemons with a few leaves; (3) brown onions; (4) red tomatoes; (5) bunches of yellow bananas; (6) potatoes. Each crate is full to just above its rim, nothing spilling out.
The first attached picture (a mock-up) shows the crates and fruit we want: copy its wicker and its fruit, not its people or table.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another cell. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal fruit and wicker, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### FP. Eight fruit and vegetables, one each
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's shopping game: eight single fruit and vegetables in a 4 by 2 grid, one in each cell, at their TRUE sizes against each other, seen from the front about 20 degrees down: (1) a ripe mango, red-blushed yellow-green; (2) a lemon; (3) a brown onion; (4) a red tomato; (5) a bunch of three yellow bananas; (6) a potato; (7) an orange; (8) a pomegranate. Copy the fruit of the attached crates picture exactly: the same colours, gloss and light.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another cell. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### FW. The stall's scale
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's shopping game: the SAME old brass counter scale three times in a row, each in its own third, the same size and place, seen straight from the front: a round brass dial with a cream face and a red needle, a shallow round brass pan on top, a sturdy brass body and base. The dial has ONLY plain short tick marks round its edge: NO numbers, letters or words anywhere. The pan is EMPTY in all three. Only the needle changes: (1) straight up at the start; (2) turned a quarter of the way round to the right; (3) turned three quarters of the way round to the right.
The attached mock-up shows this scale: copy its brass and its shape, not its fruit, numbers or table.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another third. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal brass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### FB. The paper bag
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's shopping game: the SAME plain brown paper grocery bag four times in a row, each in its own quarter, the same width, seen from the front about 20 degrees down: (1) folded flat; (2) standing open and empty; (3) standing open with a mango, a lemon and a tomato showing at the top; (4) its top rolled down twice, closed. Plain paper, no handles, no print.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another quarter. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal paper, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### GS. The general store, from behind its counter
```
Generate an image, 1536×1024, landscape.

A background for a children's shopping game: the inside of a small, sunny kitchenware and general store, seen from the shopper's side at a child's standing eye level. A light wooden counter runs across the whole bottom quarter of the image as one straight horizontal band, completely empty. Behind it, a cream wall with plain wooden shelves holding stacks of plain steel pots, steel cups, steel jugs and folded cloth, a brass pot, a trailing plant; a narrow strip of mirror-work trim along one shelf edge; an open doorway at the far left with bright sunlight and bougainvillea. The middle of the counter and the space just above it are clear, so the game can place things there.
The attached mock-up shows the shop: copy its shelves, steel, light and colours, NOT its people.

No people, no animals, no signs.

Style: a stylised 3D animated-feature-film look, warm soft global illumination, golden light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### GG. Eight things from the shop
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's shopping game: eight household things in a 4 by 2 grid, one in each cell, each filling about two thirds of its cell (NOT at true scale: the game sizes them), seen from the front about 20 degrees down: (1) a polished steel cooking pot with its lid; (2) a small steel drinking cup; (3) a clear faceted glass tumbler, empty; (4) a round steel plate, tilted to show its face; (5) a wooden spoon; (6) a steel ladle; (7) a round terracotta water pot (matka); (8) a three-tier steel tiffin carrier with its handle.
The attached mock-up shows the steel we want: copy its polished steel and light.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another cell. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel, glass and clay, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PC. Coins and stacks
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's game about paying: the SAME shiny gold coin in six arrangements in a 3 by 2 grid, each in its own cell, at the same scale, seen from the front about 30 degrees down: (1) one coin lying flat; (2) a neat stack of two; (3) a stack of three; (4) a stack of four; (5) a stack of five; (6) a small loose heap of about eight. The coin is plain: a raised rim and a simple raised flower in the middle; NO numbers, letters, faces or words.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another cell. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal gold, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PT. The seller's tin and two purses
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's game about paying: six things in a 3 by 2 grid, each in its own cell, seen from the front about 30 degrees down. Top row: (1) a round steel cash tin with its lid on; (2) the same tin open, its lid leaning behind it, empty inside; (3) a small cloth drawstring purse, deep red with a little mirror-work, pulled closed. Bottom row: (4) the same red purse open and empty; (5) a small plain teal zip purse, closed; (6) the same teal purse unzipped and empty.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another cell. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel and cloth, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BH. The beach
```
Generate an image, 1536×1024, landscape.

A background for a children's beach game, at a child's standing eye level: a wide, empty sunny beach. The bottom half is smooth pale golden sand, gently rippled, completely empty. Across the middle, the sea's edge: turquoise water with a soft line of white foam; behind it the blue sea to a straight horizon at about 40% from the top; a clear blue sky with two small soft clouds; a leaning palm tree at the far left and another at the far right, their fronds at the top corners.
The attached mock-up shows the beach, the light and the colours: copy them, NOT its people, stalls or carts.

No people, animals, stalls, boats, umbrellas or things on the sand.

Style: a stylised 3D animated-feature-film look, warm soft global illumination, bright midday light, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SC. The corn cart
```
Generate an image, 1536×1024, landscape.

One beach food cart for a children's game, alone, seen straight from the front at a child's eye level: a small wooden cart painted sunny yellow, two big wooden spoked wheels, a yellow-and-cream scalloped striped cloth awning on four thin posts, a charcoal grill on the cart's top at the left with glowing coals and a thin wisp of smoke, and a small heap of raw husked corn cobs at the right. Nobody stands at it.
The attached mock-up shows this cart (the left one): copy its shape, paint and awning, NOT its people.

The cart fills about 70% of the image's height, centred. Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No sand, no gradient, NO shadows on the grey. Nothing touches the image's edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal painted wood and cloth, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SF. The chips cart
```
Generate an image, 1536×1024, landscape.

One beach food cart for a children's game, alone, seen straight from the front at a child's eye level: a small wooden cart painted soft teal, two big wooden spoked wheels, a red-and-cream scalloped striped cloth awning on four thin posts, a square steel fryer of golden oil on the cart's top at the left with a wire basket hooked on its edge, and two empty paper cones in a little stand at the right. Nobody stands at it.
The attached mock-up shows this cart (the middle one): copy its shape, paint and awning, NOT its people.

The cart fills about 70% of the image's height, centred. Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No sand, no gradient, NO shadows on the grey. Nothing touches the image's edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal painted wood and cloth, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SK. The coconut cart
```
Generate an image, 1536×1024, landscape.

One beach food cart for a children's game, alone, seen straight from the front at a child's eye level: a small wooden cart painted terracotta red, two big wooden spoked wheels, a green-and-cream scalloped striped cloth awning on four thin posts, a heap of whole green coconuts on the cart's top, and a small steel cup of plain white paper straws at the right. Nobody stands at it. No knife.
The attached mock-up shows this cart (the right one): copy its shape, paint and awning, NOT its people.

The cart fills about 70% of the image's height, centred. Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No sand, no gradient, NO shadows on the grey. Nothing touches the image's edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal painted wood and cloth, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SN. Paper cones
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's beach game: plain cream paper cones, pointed end down, upright, in a 3 by 2 grid, each in its own cell, seen from the front about 20 degrees down. Left column small, middle and right columns big, the same two sizes throughout: top row (1) a small cone, empty; (2) a big cone, empty; (3) a big cone heaped with golden cassava chips. Bottom row: (4) a small cone heaped with golden cassava chips; (5) a small cone of the chips dusted with red chilli powder and a lemon wedge on top; (6) a big cone of the same red-dusted chips with a lemon wedge.
The attached mock-up shows the cones and chips: copy them.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another cell. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal paper and food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SO. Coconuts
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's beach game: fresh green drinking coconuts in a 3 by 2 grid, each in its own cell, seen from the front about 20 degrees down. Top row: (1) a small whole green coconut; (2) the small one with its top sliced off, white flesh showing round a hole; (3) the small opened one with a white paper straw in it. Bottom row, the same three for a BIG coconut, clearly bigger than the small: (4) whole; (5) top sliced off; (6) with a straw. Small and big must differ at a glance.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another cell. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SB. The fryer's basket
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's beach game: the SAME steel wire frying basket with a long black handle three times in a row, each in its own third, the same size and place, seen from the front about 30 degrees down, the handle pointing up to the right: (1) empty; (2) full of pale raw cassava chips; (3) full of crisp golden cassava chips (nothing burnt).

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another third. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel and food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CL. The cloth stall
```
Generate an image, 1536×1024, landscape.

A background for a children's shopping game: a small market cloth stall seen straight on from the shopper's side at a child's standing eye level. A light wooden counter runs across the whole bottom quarter of the image as one straight band with a strip of mirror-work trim along its front, completely empty. Behind it, a cream back wall with three plain wooden shelves of neatly folded cloth in soft colours; a cream scalloped cloth awning edge along the top; a sunny lane with a tree just visible at the far right. The middle of the counter and the space above it are clear, so the game can place the seller and bolts there.
The attached mock-up shows the stall: copy its shelves, trim, light and colours, NOT its people or the bolts on the counter.

No people, no animals, no signs.

Style: a stylised 3D animated-feature-film look, warm soft global illumination, golden light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CB. Eight bolts of cloth
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's shopping game: the SAME tall bolt of cloth (a roll standing on its end, a plain wooden core showing at the top) eight times in a 4 by 2 grid, each in its own cell, the same size and place, seen from the front, each a different cloth: (1) plain cream cotton; (2) plain sky blue; (3) plain deep green; (4) plain maroon red; (5) mustard yellow; (6) pink with small white dots; (7) an ajrakh block print in indigo and deep red with a simple geometric pattern; (8) black cloth with small round mirror-work and white thread stitching.
The attached mock-up shows the bolt standing on the counter: copy its shape and the cloth's soft weave.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or another cell. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal cloth, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```
