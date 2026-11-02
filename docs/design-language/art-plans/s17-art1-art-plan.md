# Art block 1 plan (pack `s17-art1`): the stove family's placeholders and chai's half and full word moment

**Written:** 2 Nov 2026, a **first draft** for Zafar to react to (Zafar, 2 Nov: "easier to feedback on a first draft"). From
Sprint 17 step 0 (`docs/sprints/S17-chai-done-families.md`), ART-35 (the art queue) and ART-36 / CHAI-67 (the word moment,
`docs/feedback/chai-play-2026-11-02.md` P4). **Decision 77:** Claude wrote this plan and its block; Zafar runs it in ChatGPT and
approves what lands; Claude judges, cuts and wires. **ART-29:** one paste block, every reference on the branch the block reads.
**Run spec:** `build/tools/art/specs/s17-art1.run.yaml`; the block: `docs/design-language/art-plans/s17-art1-chrome-block.txt`.

**Keep the laptop awake for the whole run** (Zafar, 2 Nov, P2): on a Mac, `caffeinate -dims` in Terminal, charger in, lid open;
on Windows, PowerToys Awake on. The block repeats this.

## 0. Totals

| Part | Game | What | Images |
|---|---|---|---|
| **A** | chai, the word moment (new) | the tilted kettle, the glasses side-on filling, the falling streams (shared with baking), the snap frame | 4 |
| **B** | eggs at breakfast | the egg pot, the frying pan, eggs and shakers, fried states, the bowl and egg cups, the served plates, the kitchen relit morning and night | 8 |
| **C** | baking | the counter, the mixing bowl's states, the measuring jug, the oven (shut, baking, open), the naan; the loaf and cake tin (optional, last) | 8 |
| **D** | the corn stall | the stall's table, the cobs, the crate, the dressing bowls, the dressings on a cob | 5 |
| **E** | the cake (birthday) | the party room, the table, the cake and slices, the candles | 4 |
| | **Total** | | **29 prompts** (108 game pictures once cut); **about 38-40 images with the expected redos** (one third of a day's 120); about 3 hours in three windows |

**Expected redos (about 10):** WG two (side-on glasses drift from the s14 facets; the five levels must differ), WV one (the kettle
must stay one shape with no hand), EM/EN one each (relight edits move the island), BO2/BO3 one each (edits shift the oven), CO one
(dressings drawn on a cob instead of alone), EG one (piece count), BB or BJ one (the sheet's cells drift in size). The worst case,
every line at two redos, is 87: still under the day.

**Reused, not redrawn (approved art):** the hob (`Cook.Kit.hob`), the chai tray (`assets/cook/items/chai-v2/tray-4-cutout-t.webp`),
the enamel plate (`plate-enamel-empty-t`), the counter characters and their faces (eggs' table, every badge), the kitchen in play
(`assets/cook/bg/service-master-v2.webp`, from s14 KT: the word moment's set and the eggs' table at midday), the Cook shelf
containers (`assets/cook/items/shelf-*-bare-f.webp`: baking's flour, water, milk, sugar, salt, yoghurt, ghee), the dough ball
(`assets/cook/props/dough-ball.webp`), sekelo's grill and plate (the corn stall), the s14 chai glasses and their fill frames
(the overhead option of the word moment, §1.1), the clinic's patients (the cake's people, until the party's own sheets). **Kept as
placeholders, not in this block:** the black cat (mock-up crops; a real cat, §7 Q6), Hannah Mami (the farm's host).

## 1. Flaws and uncertainties first

1. **The word moment's camera.** Chai's own glasses are seen from exactly above (s14). From above, half and full differ only in
   the size of the brown disc, which is what a tester misread. This draft draws the same glass **side-on**, where half and full
   read at a glance (WG), and keeps the s14 overhead frames 4 and 6 as the no-cost fallback (the feedback's placeholder). Q1.
2. **No hand holds the kettle** (H13: no hands on props). It is drawn whole and tilted; the game brings it in from the top right,
   cut by the frame's edge, so its handle leaves the screen where a hand would be. Q2 asks kettle or steel pot.
3. **The streams are their own cuts** (WS): one column per liquid, stretched by the game from the spout or lip to the glass or
   bowl. WV draws only a short tongue at the spout, so the two meet at a known point (the cut records it).
4. **Sheets drift.** Every state of a thing is on one sheet so it shares one size and place; if a cell drifts the cut registers
   it on its rim or outline (as s14). The oven is three single images (an edit pair) because it is drawn large (560 px).
5. **Relit kitchens are edits** (EM, EN): the island's top edge must not move (y 1058 on the 2100x1350 master); the cut checks it.
6. **Dressings on a cob (CO)** are drawn alone, shaped like the cob, to lie over it. ChatGPT may draw the cob too: then the
   prompt is amended once, and if it still fails the game keeps its drawn drops for that dressing.
7. **No people and no real likeness** in this run: everything is judged pass or fail by the runner and Claude. The mock-ups
   attached for content show Nani and the family: every prompt says to copy no person from them.
8. **Non-negotiable 9:** the birthday cake is the celebration (mithai at a celebration is fine), never a reward; no writing on the
   cake, bunting or balloons; nothing religious in the party room.

### 1.1 The word moment (CHAI-67, ART-36): what it is and how the art serves it

Before the first L4 chai order with half or full, on the kitchen in play (service-master-v2, reused): two empty glasses stand on
the island. The kettle comes in from the top right, already tilted, and **stays tilted the whole time** (Zafar, 2 Nov); its tea
pours (the stream) or stops. The first glass fills to half (WG cells 1-3 cross-faded under the stream), the kettle slides over
the second, which fills to full (cells 1-5). Then the snap: the viewfinder corners close round the first glass, the shutter iris
closes and opens with a click, and the glass **becomes its word card in place** (its picture is WG cell 3), said by Nani; the same
for full (cell 5). Then the order. The cards stay where the glasses were (Zafar's "maybe just stay in place as a card"). The
system is shared (`js/shared/`), so baking's measures can use it later; WS's flour, water and milk columns serve that too.

## 2. What each game has now, and what this block makes

Positions and sizes are on the 1600x900 stage at 1x (the cut makes `@2x`); "now" is checked in code.

### 2.1 Chai, the word moment (new; nothing built yet)

| Object | Use and how it's seen | Target size, position | Now | Line |
|---|---|---|---|---|
| The kettle, tilted | pours into the glasses; never untilts; side view (E) | about 460 px across, top right, spout over a glass at about y 330 | nothing | WV |
| Its tea stream | from the spout to the glass, stretched to fit | about 26 px wide, 120-300 px long | nothing | WS |
| Two glasses, side-on | fill to half and to full; each becomes its word card | about 140 x 210 px each, on the island top, about 360 px apart | s14 overhead frames 4 and 6 (placeholder) | WG |
| The snap | viewfinder corners close round a glass; the iris clicks | corners about 300 x 360 px round the glass; iris the card's size | nothing | WF |
| The set | the kitchen, the island top | the whole stage | **reused:** service-master-v2 | none |

### 2.2 Eggs at breakfast (`js/cook/stations/eggs.js`; hob scene top-down T, then the table E)

| Object | Use and how it's seen | Target size, position | Now (placeholder) | Line |
|---|---|---|---|---|
| The hob, burners, flames | two burners, the pot left, the pan right | as `Cook.Kit.hob` at x 300, y 70, k 0.74 | **reused** | none |
| The egg pot (tapelo) | boil: empty, water, rolling boil; eggs bob in it | body about 300 px, with its two handles 375 px | chai's s14 pan of water (wrong vessel) | EP |
| The frying pan | fry: dry, then oil shimmering; handle points down | body 300 px across, handle about 170 px | crop of his mock-up (no handle) | EF |
| Whole eggs, cracked, shells | lifted from the bowl; the crack at the rim | egg 48 x 62 px | drawn ovals | EG |
| Salt and pepper shakers (L3 up) | tap one, then a plate; on the shelf band, from above | about 90 px across, at y 560 | drawn rounded boxes | EG |
| Fried egg states | in the pan: raw, setting, done, crispy; lifted to a plate | about 120 px across | drawn circles | EY |
| The bowl of eggs | tap: an egg lifts out; bottom left | 230 px across at (150, 520) | crop of his mock-up | EB |
| Egg cups from above | a boiled egg lands in its cup on the tray's plate | about 72 px across | drawn circles | EB |
| The tray and its plates | 2x2, a face on each rim | tray 470 px at (1090, 90); plates 168 px | **reused:** chai tray and enamel plate | none |
| Served plates, side-on | slide to each person at the table | plate about 220 x 90 px; egg cup about 64 x 110 px | drawn ellipses | ES |
| The table scene | morning, midday, night by level; the people behind it | the whole stage; people 470 px tall | drawn wall, window and table | EM, EN (midday **reused:** service-master-v2) |
| The people | Nana, Ma, Ali, Nani | 470 px | **reused:** counter characters | none |
| The cat on the sill | delight | 190 px tall | mock-up crop (kept, Q6) | none |

### 2.3 Baking (`js/cook/stations/baking.js`; side-on counter, E with items in F view)

| Object | Use and how it's seen | Target size, position | Now (placeholder) | Line |
|---|---|---|---|---|
| The counter | the worktop's front edge at y 470; the wall above | the whole stage | drawn wall, tiles, counter | BK |
| The mixing bowl | its contents rise turn by turn, then the dough | 380 px across at (820, 520) | mock-up crop (red corners) and a drawn mound | BB |
| The measuring jug (L3 up) | lines and no numbers; fills by quarter cups; tips in | 150 x 230 px (+ handle) at (470, 470) | drawn shapes and a drawn fill | BJ |
| The containers | flour, water, milk, sugar, salt, yoghurt, ghee, each with its word card | 170 px tall, in a row at y 820 | **reused:** Cook shelf containers | none |
| The pour | from a container's lip into the bowl or jug | 14-26 px wide, up to 300 px long | a drawn bar or dots | WS (shared) |
| The dough | after the bowl's tap | 170 px | **reused:** dough ball | none |
| The oven | its own close-up: shut, baking, open | 560 x 460 px, centred at (900, 360) | drawn boxes | BO1, BO2, BO3 |
| The naan on its tray | in, baking, out | 260 px across | mock-up crop, tinted | BN |
| The loaf and the cake in its tin | the design's bread and party-cake recipes (not built yet) | about 260 px | nothing | BL (optional, Q5) |
| The cat peeking | delight, right | 200 px | mock-up crop (kept, Q6) | none |

### 2.4 The corn stall (`js/cook/stations/corn.js`; top-down at the stall's table, T)

| Object | Use and how it's seen | Target size, position | Now (placeholder) | Line |
|---|---|---|---|---|
| The stall's table | the ground of the whole scene | the whole stage | drawn wood fill and lines | CT |
| The crate of cobs | tap: a cob goes on the grill | 380 px across at (230, 40) | mock-up crop (front-ish view) | CX |
| The cob | raw, one side grilled, turned, done | 220-250 px long | mock-up crops (three looks) | CB |
| The grill, the plate | where the cobs cook and go | grill 640 px at (760, 250); plate 360 px | **reused:** sekelo | none |
| The dressing bowls | lemon, salt, chilli, green chutney, tamarind, pepper, each with its word card | 150 px each, in a row at y 690 | mock-up crops | CD |
| The dressings on the cob | named as they go on; lie over the cob | the cob's size | drawn drops | CO |
| The tray under the bowls | holds the six | 1300 x 200 px at y 590 | drawn tray | none (kept drawn: a plain board; Q7) |

### 2.5 The cake (`js/party-proto/cake.js`; the party room, E, items in F view)

| Object | Use and how it's seen | Target size, position | Now (placeholder) | Line |
|---|---|---|---|---|
| The party room | behind everyone; golden afternoon | the whole scene | CSS fill and token bunting | PR |
| The table | in front of the people (cuts them at the waist) | 56% of the width, its top at 64% of the height | CSS bar | TB |
| The cake | candles go on, are blown out; it is cut | about 20% of the scene's height, centred on the table | CSS shapes | CK |
| Slices and plates | a slice goes to the named person's plate | slice 10% of the height; plate 10% of the width | CSS shapes | CK |
| The candles, the bundles | tap the bundle with that many; lit, then out one by one | a candle about 9% of the height; a bundle 17% | CSS bars and a CSS flame | CN |
| The people | Zara, Yusuf, Nana, the sisters, the baby | 42-56% of the height | **reused:** clinic patients (Q7) | none |

## 5. The prompts

Every prompt is one image. Sheets are cut by their gutters; nothing touches a cell's edge.

#### WV. The chai kettle, held tilted
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: the SAME steel chai kettle twice, side by side, each in its own half of the image. The kettle: a classic Indian chai kettle (kitli), a rounded body of polished brushed steel, a domed lid with a small round knob, a long slim spout curving out from low on its body, and a black handle arching over the top. It is OPAQUE: nothing inside it can be seen. Seen exactly from the side at eye level.
In both halves the kettle is the same size, at the same place in its half, and TILTED FORWARD by about 35 degrees, so its spout points down to the LEFT and its handle rises to the upper right. Nothing holds it: no hand, no arm, no person.
(1) Left: tilted, nothing coming out of the spout. (2) Right: exactly the same, with a short smooth tongue of milky chai (light caramel brown, matte) curling out of the spout's tip and ending just below it, no longer than the spout itself; NO long falling stream (the game draws that).
The kettle fills about 60% of its half's width. The attached picture of chai pans is our game's steel: copy its brushed steel, its black handle and its light; not its pans or its view.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture, NO shadows on the grey. Nothing touches the image's edges or the middle line. Do not draw a dividing line.

Style: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### WG. The chai glass side-on, filling
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: the SAME small clear glass chai tumbler five times in one row, seen exactly from the side at eye level, each in its own fifth of the image. The first attached picture shows this glass from above, and the second shows it filling from above: copy the glass exactly from them: the same thick clear glass, the same even vertical facets all the way round, the same thick round base, the same warm golden glints, and the same milky chai colour. Draw it from the side: a small tumbler about one and a half times as tall as it is wide, slightly wider at the rim than at the base, the facets running straight up from the base to just below a plain band at the rim.
Every glass the same size, standing on the same invisible line, at the same place in its fifth. From left to right: (1) empty, clean clear glass; (2) a quarter full of milky chai; (3) exactly HALF full; (4) three quarters full; (5) FULL to just below the rim, a thin pale line of froth on top. The chai is light caramel brown, matte and opaque; its top is a flat level surface; the glass's facets show through the empty part above it. The difference between half and full must be obvious at a glance.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no saucer, no holder, no gradient, NO shadows on the grey. Nothing touches an edge or another glass. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal glass and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### WS. Six falling streams
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: six separate falling streams in one row, each in its own sixth of the image. Each is a straight vertical column falling from about 5% below the top of the image to about 5% above the bottom, about 40 pixels wide, smooth and slightly wavy, with soft highlights. Each stream simply starts and ends: no spout, no container, no cup, no splash, no surface, no puddle.
From left to right: (1) milky chai, light caramel brown, matte and opaque; (2) black tea, clear dark reddish-brown, slightly see-through at its edges; (3) clear water, see-through with bright glints; (4) milk, smooth opaque white; (5) flour, a soft powdery column of white flour with a little dust drifting off its sides; (6) sugar, a column of fine sparkling white grains. The attached picture is our game's milky chai in its glasses: stream (1) is exactly that colour.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture, NO shadows on the grey. The six never touch each other.

Style: a stylised 3D animated-feature-film look, semi-photoreal liquid and powder, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### WF. The camera snap
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's game: four camera-snap pieces in an invisible grid of 2 columns and 2 rows, each centred in its quarter of the image.
(1) Top left: four soft, chunky, rounded viewfinder corner brackets in warm white, marking the four corners of an empty square, like the focus frame of a toy camera; each bracket an L shape with rounded ends, the square about 70% of the quarter's height.
(2) Top right: a round camera shutter iris seen straight on: seven curved blades of dark graphite steel with soft highlights in a thin round steel ring, wide OPEN, a big round hole in the middle about 70% of the ring's width.
(3) Bottom left: the same iris HALF closed, the hole about 30% of the ring's width.
(4) Bottom right: the same iris fully CLOSED, the blades meeting in the middle.
The iris is the same size and place in its quarter in cells 2, 3 and 4. The hole in the middle shows only the flat grey background.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture, NO shadows on the grey. Nothing touches an edge or another piece. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, soft global illumination, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### EP. The egg pot, three states
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME steel cooking pot three times in one row, each in its own third of the image, seen from EXACTLY straight above: the rim a perfect circle, the floor a smaller circle exactly in its centre, the inside wall an even ring of steel, the two side handles level, one pointing left and one right. The attached picture is this pot from our game: copy it exactly (its brushed steel, its two handles, its proportions and its view).
In every third the pot is the same size and its centre is at the same point. (1) Empty, clean brushed steel. (2) Full to the same level of clear still water, the brushed floor seen through it, a soft glint. (3) The same water at a ROLLING BOIL: big bubbles breaking all over the surface, a ring of small bubbles at the wall, a little white foam.
No eggs, no lid, no spoon. The pot's rim is about 60% of the image's height.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no gradient, NO shadows on the grey. Nothing touches an edge or another pot.

Style: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and water, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### EF. The frying pan
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME small round frying pan twice, side by side, each in its own half of the image, seen from EXACTLY straight above: the rim a perfect circle, the flat floor a smaller circle exactly in its centre. The pan: a dark charcoal-grey non-stick inside, a thin brushed-steel rim, and a long black handle pointing STRAIGHT DOWN toward the bottom of the image, level. The first attached picture is our game's steel and black handles: copy that look. The second attached picture is a mock-up of the egg station: copy only the idea of the pan, nothing else from it (no egg, no hob, no people).
In both halves the pan is the same size and at the same place. (1) Dry and empty. (2) The same with a thin film of hot oil shimmering across the floor, a few tiny bright glints.
No egg, no food, no spatula. The pan's round body is about 55% of the image's height; the handle stays inside the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no gradient, NO shadows on the grey. Nothing touches an edge or the other pan.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel and non-stick, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### EG. Eggs, the crack, and the shakers, from above
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: six things in an invisible grid of 3 columns and 2 rows, each centred in its cell, ALL seen from EXACTLY straight above, all at one true scale (a hen's egg 6 cm long). The attached picture is a mock-up of the egg station: copy only the eggs' look from it; no people, no hob.
Row 1: (1) a whole cream-white hen's egg lying on its side; (2) a whole light-brown hen's egg lying on its side; (3) the cream-white egg with a clean zigzag crack across its middle.
Row 2: (4) the two empty halves of a cracked cream-white eggshell lying side by side, their open insides up, a little clear egg white glistening inside; (5) a small glass salt shaker seen from straight above: its round brushed-steel cap with a few holes, white salt seen through the glass round the cap; (6) the same shaker for black pepper: the same cap, coarse black pepper seen through the glass.
Each egg is about 20% of its cell's height; each shaker about 35%.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal eggshell, glass and steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### EY. A fried egg in four states, from above
```
Generate an image, 1024×1024, square.

A sprite sheet for a cooking game: the SAME fried egg four times in an invisible grid of 2 columns and 2 rows, each centred in its quarter, seen from EXACTLY straight above. The same outline and size in every quarter (a natural, slightly irregular round egg white with the yolk a little off centre), the yolk at the same place.
(1) Top left: just cracked into the pan: the white still clear and runny so it looks wet and glossy, the yolk round, high and bright. (2) Top right: setting: the white turned opaque white at its edge, still clear near the yolk. (3) Bottom left: done: the white all set and soft white, the yolk glossy golden orange. (4) Bottom right: crispy: the same, with a lacy golden-brown crisp edge all the way round.
No pan, no plate, no oil around it. Each egg about 60% of its quarter's width. The attached picture is a mock-up of the egg station: copy only the egg's look, nothing else.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. Nothing touches a quarter's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### EB. The bowl of eggs and the egg cups, from above
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: six things in an invisible grid of 3 columns and 2 rows, each centred in its cell, ALL seen from EXACTLY straight above. The first attached picture is a mock-up of the egg station and the second one of the served breakfast: copy only the bowl of eggs and the egg cup from them; no people, no hob, no table.
Row 1: the SAME round cream ceramic bowl three times, the same size and place in each cell: (1) holding six hens' eggs, four cream-white and two light brown, lying snugly together; (2) the same bowl holding only three of them; (3) the same bowl empty.
Row 2: the SAME plain white egg cup three times, the same size and place: (4) empty, its round cup seen from above; (5) a whole boiled egg standing in it, the egg's top seen from above; (6) the egg's top sliced off: a ring of white round a soft, runny golden yolk.
The bowl is about 70% of its cell's height; the egg cup about 40%.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal ceramic and eggshell, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### ES. Breakfast served, at the table (side-on)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: six things in an invisible grid of 3 columns and 2 rows, each centred in its cell, ALL seen from the front at the eye level of someone sitting at a table, looking about 20 degrees down, all at one true scale (a dinner plate 24 cm across). The attached picture is a mock-up of the served breakfast: copy only the plate, the fried egg and the egg cup from it; no people, no table, no food other than eggs.
Row 1: (1) a plain round white plate, empty, seen as a wide flat oval; (2) one fried egg alone, its white set and its yolk golden, lying flat at the same angle as the plate (so it can be laid on the plate); (3) a plain white egg cup with a whole boiled egg standing in it.
Row 2: the same egg cup and egg: (4) its top tapped and cracked, a few crack lines; (5) its top sliced off, a soft, runny golden yolk; (6) its top sliced off, a firm, set pale-yellow yolk.
The plate is about 80% of its cell's width; the egg cup about 45% of its cell's height.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal ceramic and food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### EM. The kitchen in the morning
```
Edit the attached picture of a kitchen. Keep EVERYTHING exactly where it is: the camera, the framing, the window, the arched door, the island in front with its marble top and its three wooden trays, the cooker, the cabinets and the tiles; the island's top edge must stay at the same height in the picture. Change only the light: it is now EARLY MORNING. Soft, low, pale-gold sunlight comes through the window from the left, longer and gentler; the sky in the window and the arched door is a fresh pale morning blue with a soft peach glow low down; the room is a little cooler and softer than before. Nothing is added or removed: no people, no food, no plates.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### EN. The kitchen at night
```
Edit the attached picture of a kitchen. Keep EVERYTHING exactly where it is: the camera, the framing, the window, the arched door, the island in front with its marble top and its three wooden trays, the cooker, the cabinets and the tiles; the island's top edge must stay at the same height in the picture. Change only the light: it is now NIGHT. Through the window and the arched door the sky is deep dark blue, with a pale crescent moon and a few small stars; the garden is a dark silhouette. Inside, the kitchen is lit warmly and evenly by soft recessed ceiling lights and a warm glow from under the wall cabinets, so the island top is well lit and every surface is clear; no hanging lamp. Nothing is added or removed: no people, no food, no plates.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BK. The baking counter
```
Generate an image, 1536×1024, landscape.

A background for a children's cooking game: the back counter of the kitchen in the attached picture, seen STRAIGHT ON from the front at a child's standing eye level, as a calm, empty stage. Copy the kitchen's look exactly: the warm limewash wall, the pale square tiles, the cream-white marble with soft warm veins, the sage-green cabinet doors with small brass knobs, the warm afternoon sunlight from the left.
The marble worktop runs the full width of the picture; its front edge is one straight horizontal line at 52% of the image's height, with a thin band of its top surface showing just above that edge. Above the worktop: the plain pale tiled splashback up to about 25% from the top, then the plain wall; at the far left edge, part of a window with soft daylight. Below the worktop: the sage cabinet doors running the full width. The worktop is completely EMPTY: no jars, no bowls, no cooker, no hob, no oven, no plants, no people, no cat. The second attached picture is a mock-up of this scene: copy only the camera and the counter's height from it, nothing on the counter.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BB. The mixing bowl, its contents rising
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME wide brushed-steel mixing bowl six times in an invisible grid of 3 columns and 2 rows, seen from the front at a standing child's eye level looking about 25 degrees down, so the bowl's rim is a wide flat oval and its contents show over the rim. In every cell the bowl is the same size and its rim's centre is at the same point. The first attached picture is our game's steel: copy that look. The second is a mock-up of the baking counter: copy only the bowl's shape from it; no people, no cat, no jars.
Row 1: (1) empty; (2) a small heap of white flour in the bottom; (3) a big soft heap of white flour, its top just above the rim.
Row 2: (4) the big heap of flour with a little pool of water soaking into its middle; (5) a shaggy, lumpy, half-mixed dough; (6) one smooth, round, soft ball of dough sitting in the middle of the bowl.
The bowl is about 80% of its cell's width.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No counter, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal brushed steel, flour and dough, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BJ. The measuring jug, empty and full
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME clear glass measuring jug six times in an invisible grid of 3 columns and 2 rows, seen from the front at eye level, its handle on the RIGHT and its pouring lip on the LEFT. The jug is tall and straight-sided, made of thick clear glass, with five short white lines up its front at evenly spaced heights and ABSOLUTELY NO NUMBERS OR WORDS beside them. In every cell the jug is the same size, at the same place, and the lines are at the same heights. The first attached picture is our game's glass jars: copy the glass's look. The second is a mock-up of the baking counter: copy only the jug's idea; nothing else.
Row 1: (1) empty; (2) full to the top line with clear water; (3) full to the top line with white milk.
Row 2: (4) full to the top line with white flour, its top level; (5) full to the top line with thick white yoghurt; (6) full to the top line with white sugar.
The jug is about 75% of its cell's height.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No counter, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal glass and contents, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BO1. The oven, shut
```
Generate an image, 1536×1024, landscape.

A sprite for a cooking game: a built-in kitchen oven seen STRAIGHT ON from the front at its own middle height, set in a frame of sage-green cabinet wood that surrounds it on all four sides. The oven: a brushed-steel front, a wide dark glass door with a long brushed-steel bar handle across its top, two small round brushed-steel knobs above the door, a shelf rack faintly visible through the dark glass. The door is SHUT and the oven is cold: the glass is dark. Copy the cabinets' sage green, the brass and steel and the light of the first attached picture (the kitchen in our game); the second attached picture is a mock-up: copy only the idea of the oven, no people, no bread.
The oven with its cabinet frame fills about 80% of the image's width and 85% of its height, centred.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge around the cabinet frame. No floor, no wall, no gradient, NO shadows on the grey.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel, glass and painted wood, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BO2. The oven, baking
```
Edit the attached picture of an oven. Keep EVERYTHING exactly as it is: the same oven, cabinet frame, knobs, handle, door, size and place, and the same flat grey background, pixel for pixel where possible. Change only one thing: the oven is ON and baking: behind the glass door the inside glows a warm orange-gold, the rack inside lit, a soft warm glow on the glass. The door stays shut. Nothing is inside the oven.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BO3. The oven, open
```
Edit the attached picture of an oven. Keep EVERYTHING exactly as it is: the same cabinet frame, knobs, oven body, size and place, and the same flat grey background, pixel for pixel where possible. Change only the door: it is now OPEN, folded down toward the viewer so it lies flat at the bottom of the oven's opening, its handle at the front. Inside, the oven is lit with a warm orange-gold glow, its empty steel rack across the middle, warm air shimmering. Nothing is on the rack.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BN. The naan on its tray
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME flat steel baking tray six times in an invisible grid of 3 columns and 2 rows, seen from the front at eye level looking about 30 degrees down, so the tray is a wide flat shape. In every cell the tray is the same size and place. The attached picture is a mock-up of the oven: copy only the naan's look; no people, no oven.
Row 1: (1) the empty tray; (2) one raw naan on the tray: pale, soft, smooth stretched dough in a teardrop shape; (3) the same naan baking: puffed with big bubbles, still pale.
Row 2: (4) the same naan, light golden, the bubbles golden on top; (5) the same naan, deep golden with a few toasty brown spots (the darkest it ever gets; nothing burnt); (6) the deep golden naan alone, without the tray, lying flat.
The naan is the same size and shape in every cell, about 60% of its cell's width.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No counter, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel and bread, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BL. The loaf and the cake in their tins (optional)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: eight bakes in an invisible grid of 4 columns and 2 rows, seen from the front at eye level looking about 30 degrees down, each centred in its cell. The attached picture is the naan tray from this game: copy its steel, its light and its look.
Row 1: the SAME rectangular steel loaf tin four times, the same size and place: (1) raw pale dough in the tin; (2) the dough risen in a dome above the tin, still pale; (3) light golden crust; (4) deep golden crust (the darkest it gets; nothing burnt).
Row 2: the SAME round steel cake tin four times, the same size and place: (5) smooth pale raw cake batter in the tin; (6) the cake risen, pale; (7) light golden top; (8) deep golden top. A plain sponge, no icing, no decoration.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel and bread, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CT. The corn stall's table
```
Generate an image, 1536×1024, landscape.

A background for a children's cooking game: the top of a farm stall's wooden table seen from EXACTLY straight above, filling the whole image edge to edge. Wide, smooth, honey-coloured planks of weathered wood running left to right, soft grain, a few gentle knots, the gaps between the planks fine and even; warm afternoon sunlight from the upper left, a soft dappled shade of leaves in one corner only. The table is completely EMPTY. The attached picture is a mock-up of this stall: copy only its warm wood; nothing on it.
Keep the top and bottom 6% of the image plain wood (the game crops them).

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CB. The corn cob in four states
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME husked corn cob four times in one row, each in its own quarter of the image, seen from EXACTLY straight above, lying vertically (its tip at the top). In every quarter the cob is the same size, shape and place, about 80% of the image's height.
(1) Raw: plump bright yellow kernels in neat rows. (2) Grilled on its top side: the kernels toasted golden with dark charred stripes and spots. (3) Turned over: the other side up, still mostly raw yellow with only a few faint golden marks at its edges. (4) Done: golden-brown all over with charred stripes, glistening.
The first attached picture is a mock-up of the corn stall: copy only the cobs' look from it; no hand, no people. The second attached picture is the charcoal grill from our game: the cob must fit across its two bars.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No gradient, NO shadows on the magenta. Nothing touches an edge or another cob.

Style: a stylised 3D animated-feature-film look, semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CX. The crate of cobs
```
Generate an image, 1536×1024, landscape.

A sprite for a cooking game: a shallow rectangular wooden crate seen from EXACTLY straight above, holding six husked raw corn cobs lying side by side, their tips all to the right, bright yellow kernels; the crate's four plank sides an even width all the way round. The attached picture is a mock-up of the corn stall: copy only the crate and its cobs; no hand, no people. The crate fills about 85% of the image's width, centred.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No table, no gradient, NO shadows on the magenta. The crate does not touch the edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal wood and food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CD. The six dressing bowls
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: six small round bowls in an invisible grid of 3 columns and 2 rows, each centred in its cell, seen from EXACTLY straight above, all the same small brushed-steel bowl at the same size (about 60% of a cell's height), each with something different in it, heaped or filled so it shows clearly.
Row 1: (1) two fresh lemon halves, cut side up; (2) white salt; (3) bright red chilli powder.
Row 2: (4) green coriander chutney, smooth; (5) dark red-brown tamarind chutney, glossy; (6) coarse ground black pepper.
No spoons. The first attached picture is a mock-up of the corn stall: copy only these dressings' look; no hand, no people. The second attached picture is a steel plate from our game: copy its steel.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel and food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CO. The dressings, to lie on a cob
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: six dressings ALONE, each spread in the long, narrow upright shape of the corn cob in the attached picture (the same length and width as that cob), in one row, each in its own sixth of the image, seen from exactly above. DO NOT draw the cob: only the dressing, as if the cob were invisible under it.
(1) a few glistening drops of lemon juice and one lemon pip; (2) a light sprinkle of white salt crystals; (3) a dusting of red chilli powder; (4) a zigzag drizzle of green coriander chutney; (5) a zigzag drizzle of dark red-brown tamarind chutney; (6) a sprinkle of coarse black pepper.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The six never touch each other or the edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PR. The party room
```
Generate an image, 1536×1024, landscape.

A background for a children's game: a family's sitting room ready for a little girl's birthday, seen at standing eye level, straight on to the back wall, as a calm, EMPTY stage. A warm cream limewash back wall, a low comfortable sofa along it, a window on the right with soft golden afternoon light, one or two potted plants. Party touches, few and simple: a string of plain triangle bunting in soft colours across the top of the wall and a small bunch of three plain balloons tied by the window; NOTHING written on anything. At most one gentle East African or Kutch touch (an ajrakh cushion or a mirror-work frame). The left fifth of the picture is plain wall. The bottom third is plain floor in front of the sofa, nothing on it (the game puts a table and the family there). Copy the house style, materials and warm light of the first attached picture (a kitchen in our game). The second attached picture is a mock-up of this party: copy only the room's mood; no people, no table, no cake.
No people, no animals, no table, no food, no lamps hanging from the ceiling, no religious objects.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### TB. The party table
```
Generate an image, 1536×1024, landscape.

A sprite for a children's game: a long low wooden table seen STRAIGHT ON from the front at standing eye level, so its top shows only as a thin band and its front edge is one straight horizontal line. Warm honey wood, simple straight legs, a plain cream cloth laid along its top hanging a little over the front edge. The table is EMPTY. It fills about 92% of the image's width and about 30% of its height, centred. Copy the warm light and wood of the attached picture (the party room).

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, NO shadows on the grey. The table does not touch the edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal wood and cloth, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CK. The birthday cake and its slices
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's game: six things in an invisible grid of 3 columns and 2 rows, each centred in its cell, ALL seen from the front at the eye level of someone sitting at the table, looking about 20 degrees down. The first attached picture is a mock-up of the birthday cake and the second of the slices on plates: copy only the cake's and the slices' look from them; no people, no candles, no tray.
Row 1: the SAME round birthday cake on a plain white cake stand, the same size and place: (1) whole: two layers of soft vanilla sponge covered in smooth white cream, a simple piped border round its top edge, a few fresh red berries on top; NOTHING written on it; (2) the same cake with one slice cut out, the cut showing the sponge and its cream layer; (3) the same cake with only half left.
Row 2: (4) one slice of that cake lying on a small plain white plate; (5) the same slice and plate with one bite taken out of the slice; (6) the same small plate, empty, with a few crumbs.
The cake on its stand is about 70% of its cell's width; the small plate about 70%.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal cake and ceramic, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CN. The candles
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's game: six things in an invisible grid of 3 columns and 2 rows, each centred in its cell, seen from the front at eye level. The attached picture is a mock-up of the birthday: copy only the candles and the saucer from it; no people, no cake.
Row 1: the SAME thin twisted birthday candle, pastel blue with a white spiral, standing upright, the same size and place: (1) unlit, a short dark wick; (2) lit, a small warm teardrop flame with a soft glow; (3) just blown out, a thin curl of pale grey smoke rising from the wick.
Row 2: (4) the small flame alone, without the candle; (5) a small satin ribbon bow in soft pink, the kind that ties a bundle of candles; (6) a small round brass saucer seen from the front, empty.
The candle is about 60% of its cell's height.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal wax, flame and brass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

Cut into `assets/<area>/items-s17/` at the cut (shared pieces into assets/shared/word-moment/, made at the cut), names in the pack's cut spec
(build/tools/art/specs/s17-art1.cut.json, written when the images land), each with `@2x` where the source allows (else upscaled
as s14 KT). Wiring is a separate build (the stove roll-out, Sprint 18; the word moment's lab page, Sprint 17 step 1).

- **WV:** grid 2x1, `cell_align` on the kettle; the spout's tip per cell into `cut-data.json` (where WS's stream starts).
  `kettle-tilt`, `kettle-tilt-pour`. **WS:** grid 6x1, `glass` (partial alpha); `stream-chai`, `-black`, `-water`, `-milk`,
  `-flour`, `-sugar`, cut to their width, stretched in code (shared, in assets/shared/pour/, made at the cut). **WG:** grid 5x1, `glass`,
  registered on the base; `glass-side-0`, `-25`, `-50`, `-75`, `-100`; the card pictures are `-50` (half) and `-100` (full).
  **WF:** grid 2x2; `snap-corners`, `snap-iris-open`, `-half`, `-shut` (the iris registered on its ring).
- **EP:** grid 3x1, rim-registered: `egg-pot-empty`, `-water`, `-boil`. **EF:** grid 2x1: `fry-pan`, `fry-pan-oil` (the
  body's centre and radius in `cut-data.json`). **EG:** grid 3x2 (cell 4's two halves one piece): `egg-white`, `egg-brown`,
  `egg-cracked`, `egg-shells`, `shaker-salt-t`, `shaker-pepper-t`. **EY:** grid 2x2, yolk-registered: `egg-fried-raw`,
  `-setting`, `-done`, `-crispy`. **EB:** grid 3x2: `egg-bowl-6`, `-3`, `-0`, `eggcup-t`, `eggcup-egg-t`, `eggcup-open-t`.
  **ES:** grid 3x2: `plate-f`, `egg-fried-f`, `eggcup-egg-f`, `-tapped-f`, `-soft-f`, `-hard-f`.
  **EM, EN:** upscaled to the 2100x1350 master as KT; the island's edge measured against y 1058; `service-master-morning`,
  `service-master-night`.
- **BK:** to the 1600x900 stage (a 16:9 crop), the worktop's edge measured (y 470 wanted). **BB:** grid 3x2, rim-registered:
  `bowl-f-0` … `bowl-f-dough`. **BJ:** grid 3x2, registered on the jug; `jug-empty`, `jug-water` … `jug-sugar`: the game
  reveals a full jug through a rising mask (the lines' heights into `cut-data.json`). **BO1-3:** no grid; registered on the
  frame: `oven-shut`, `oven-baking`, `oven-open`. **BN:** grid 3x2, tray-registered: `tray`, `naan-raw` … `naan-deep`,
  `naan-alone`. **BL:** grid 4x2: `loaf-0..3`, `cake-tin-0..3`.
- **CT:** to the stage, a 16:9 crop. **CB:** grid 4x1 on magenta: `cob-raw`, `cob-half`, `cob-turned`, `cob-done`.
  **CX:** `corn-crate`. **CD:** grid 3x2: `dress-lemon`, `-salt`, `-chilli`, `-green`, `-amli`, `-pepper` (the ids in `DRESS`).
  **CO:** grid 6x1, `soft_floor` off, partial alpha: `on-cob-<id>`.
- **PR:** to the scene (16:9 crop), the left fifth plain. **TB:** `party-table`. **CK:** grid 3x2: `cake-whole`, `-cut1`,
  `-half`, `slice-plate`, `slice-bite`, `plate-crumbs`. **CN:** grid 3x2: `candle`, `candle-lit`, `candle-smoke`, `flame`,
  `ribbon`, `saucer`.

## 7. Questions for Zafar (first draft: answer "yes to all except …")

1. **The word moment's glasses side-on** (WG), so half and full read at a glance; chai's overhead s14 frames 4 and 6 stay as the
   fallback. Recommended: side-on.
2. **The vessel is a steel chai kettle** (kitli), opaque, tilted the whole time, no hand (it comes in from the top right, cut by
   the frame). Or a steel pot with a lip. Recommended: the kettle.
3. **Eggs' table is the kitchen island** (the kitchen in play, relit for morning and night) instead of the drawn wall, window and
   wooden table; the counter characters already stand behind it. Recommended: yes.
4. **Baking's oven stays its own close-up** (as built), on a new straight-on counter (BK). Recommended: yes.
5. **The loaf and the cake in their tins** (BL, last in the run, optional): the design's bread and party-cake recipes aren't
   built yet. Recommended: keep (one image; the party cake then comes out of Nani's oven).
6. **Simba:** the black cat is still mock-up crops. A real cat: a sheet from photos in a run you watch? Not in this block.
7. **The cake's people** are the clinic's patients until the party's own sheets (party-guests' run, with its family block).
   The corn stall's dressing tray stays a plain drawn board. Recommended: yes to both for this draft.
