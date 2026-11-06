# Art plan (pack `s17-stove400`): the stove family's items, one batch

**Written:** 6 Nov 2026 (overnight run, task 5), from Zafar's yes to "the stove family's art run: about 400 items" and his edit at
launch (6 Nov, 01:58): **no true relative sizes**, token size steps instead. **Decision 77:** Claude wrote this plan and its block;
Zafar runs it in ChatGPT; Claude judges, cuts and wires. **ART-29:** one paste block, every reference already on the branch the block
reads. **The list:** `docs/design-language/art-plans/stove-400-items.csv` (478 rows: 346 to draw, 132 the game already has or a
planned pack draws). **Run spec:** `build/tools/art/specs/s17-stove400.run.yaml`; the block: `s17-stove400-chrome-block.txt`. The
research, the sources and the decisions: `build/reports/stove-art-400-2026-11-06.md`.

**Keep the laptop awake for the whole run:** on a Mac, `caffeinate -dims` in Terminal, charger in, lid open; on Windows,
PowerToys Awake on.

## 0. Totals

| Part | What | Sheets | Items |
|---|---|---|---|
| A | The anchor: chai's shelf as one sheet (bottle, carton, tea and sugar jars, the four small jars), then a stop for Zafar's look | 1 | 8 |
| B | The live games: the spice and dry-goods jars, packs, produce, chai's kettle and flask; the top-down katoris, food states, kit and dishes | 25 | 210 |
| C | The prototypes: eggs at breakfast, baking, the corn stall, the cake | 10 | 83 |
| D | The bank: dishes the family cooks that no game has yet | 6 | 45 |
| | **Total** | **42 prompts** (about 57 images with redos) | **346 items** |

Two prompts serve every sheet: **FS** (side-on, 8 items on 1536x1024) and **TS** (top-down, 9 items on 1024x1024); each line fills
their slots with its sheet's items in order (`stove-400-items.csv`, the `look` column). Every dish's look names its vessel, its colours and
the garnish that tells it apart from directly above (6 Nov: the four chais by cup, tea colour and garnish).

## 1. Flaws and uncertainties first

1. **Eight or nine distinct items per image is near the top of what ChatGPT keeps distinct.** A sheet that merges two items, draws
   one twice or reorders them fails (the pass/fail list); expect about one sheet in three to need a redo, which the 57 images allow.
2. **"All the same height" may come back uneven.** That is safe: the game scales every cut-out to its class (section 2), so an
   uneven sheet only costs resolution, never the rule. The judge flags an item under 70% of its cell's height.
3. **Magenta and glass:** produce and loose food go on magenta (the art pipeline's rule for food); glass, steel and packs on grey,
   because metal and glass pick up a magenta tint. Dishes are on grey (their plates and bowls are steel or white).
4. **The lid family is the anchor's.** If FA01's lids drift (four lid styles, as the v2 jars had), every later sheet copies the drift:
   the one stop after part A is there so Zafar sees it once.
5. **Contents that read wrong at 40 CSS px:** cumin and fennel, chilli powder and garam masala, white sugar, salt and semolina look
   alike in a jar. The look column names a shape cue for each (ridged, round, crystal, grain); the game's shelf never puts two
   lookalikes in one row except as the level's deliberate lookalike (chai L4: salt beside sugar).
6. **The bank (part D) is a guess at the future**, from the family's cuisine (the report's research); Zafar may cut it.

## 2. The token size rule (Zafar, 6 Nov: no true relative sizes)

The picture draws every item the same height; **the game sets the size**, from a class in the data, so the steps are exact and
the same on every screen.

| Class | Share of the slot's height | For (real size) | Chai at 740x320 |
|---|---|---|---|
| **L** | 100% | tall things over about 20 cm: bottles, cartons, flour tins, the kettle, the flask | 50 CSS px |
| **M** | 92% | 10-20 cm: tall jars (tea, sugar, daar, rice), tubs, bunches of herbs, a cabbage | 46 CSS px |
| **S** | 85% | under 10 cm: the spice jars, a garlic bulb, a lemon, a chilli, an egg | 42.5 CSS px |
| **W** | width-led | wider than tall: an egg box, a butter dish, a loaf | its opaque width at most the slot's width less 12 design px, and at most 1.2x the slot's height |

- **How it is measured:** the cut-out's opaque height (alpha over 60, the line `St.opaqueSpan` already uses), against the slot's
  height: on chai's shelf the room `St.shelfFit` computes (the item line 818 less the band's item top 647, the glow 4 and the hop),
  155 design px, which is 50 CSS px at 740x320, 68 at 930x430, 91 at 1280x665 and 146 at 1920x1080 (measured: 0.322, 0.441,
  0.584 and 0.944 CSS px per design px).
- **Top-down** items take the same three steps against the station's well (a katori ring, a tray well): their opaque box's longer
  side is 100, 92 or 85% of the well. Station pieces (hob, pan, tawa, board, grill) are sized by the station's layout, not this rule;
  long tools are sized by their length.
- **Order never inverts** (the art bible's rule stays): in one row an S is never taller than an M, nor an M than an L.
- **Wide items:** the width cap wins; such an item may then sit below its class's height (it is flagged W, not S).

## 3. One batch: camera, light, palette, lids, edges

- **Camera:** side-on sheets exactly side-on at each item's mid-height, a hint of the lid's top and no more (the art bible's F view);
  top-down sheets straight down, rims perfect circles (T view). Never both on one sheet.
- **Light:** one warm key from the upper left, a soft fill; no second light, no rim light.
- **Palette:** containers in quiet materials (clear glass, pale oak, brushed steel, white ceramic, plain card) so the food carries the
  colour; warm highlights in the house's undertone (the stone and marble, hue 27-43; `build/reports/s17-palette-review.md`); the only
  coloured plastics are the water bottle's plain pale blue cap and the ketchup bottle. No reds in big areas (reds belong to Nani).
- **Lids:** one family. Every glass jar, small or tall, has the same pale oak screw lid (the approved bare jars in
  `sources/art/pantry-v2/pantry-v2-sheet1-tall-jars.png`); every tin is plain brushed steel with a plain lid.
- **Edges and shadows:** clean, crisp edges; matte glass with one soft highlight; no halo, no rim light, no drop shadow, no cast or
  contact shadow, no reflection, no floor or shelf (the game draws the contact shadow and the stone shelf).
- **No text:** no labels, letters, numbers or logos on any jar, tin, bottle or pack.

## 4. References (all already on the branch; nothing from Zafar)

| Name | Repo path | What it carries |
|---|---|---|
| jar-family.png | `sources/art/pantry-v2/pantry-v2-sheet1-tall-jars.png` | the approved bare jars: their glass, their pale oak lid, their light |
| style-anchor.png | `sources/art/style-anchor-v1.png` | the house look from above: steel katoris, the board, whole vegetables on marble |
| food-heaps.png | `sources/art/cook-v3/s5-fillings-top-v1.png` | the approved heap look for loose food from above |
| house-swatch.png | `build/tools/art/data/house-swatch.png` | the house colours as plain blocks: the palette only, attached last to every new picture (the block's HOUSE LOOK) |
| kept:FA01 | (made in part A) | the batch every side-on sheet copies |
| kept:TB01 | (made in part B) | the batch every top-down sheet copies |

## 5. The prompts

#### FS. A sheet of side-on items (every shelf sheet, FA01 included)
```
Generate an image, 1536×1024, landscape.

A product sheet of {N} separate kitchen items for a children's cooking game, laid out in a {GRID} grid of equal cells, in this order (left to right, top row first): {ITEMS}. {EMPTY}

Every item stands upright in the middle of its own cell, seen EXACTLY side-on at its own mid-height (only a hint of its top shows), and every item is drawn the SAME height: each fills about 85% of its cell's height (an item wider than it is tall fills about 85% of its cell's width instead). Do not draw them at their real sizes. Every glass jar has the SAME pale oak screw lid as the attached jars (same wood, same profile; only its diameter follows the jar). Clean matte clear glass with one soft highlight, brushed steel, plain white or pale card: no labels. Nothing touches anything else and nothing crosses into another cell.

Background: one {GROUND}, perfectly even, edge to edge: no floor, no shelf, no table, no shadow, no reflection under any item.

Style: exactly as the attached pictures: a stylised 3D animated-feature-film look, believable materials, clean simplified surfaces, appealing slightly chunky shapes, no outlines. One warm light from the upper left, a soft fill, no rim light, no halo. Clean crisp edges.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### TS. A sheet of top-down items (every station sheet)
```
Generate an image, 1024×1024, square.

A sheet of {N} separate items for a children's cooking game, laid out in a {GRID} grid of equal cells, in this order (left to right, top row first): {ITEMS}. {EMPTY}

Every item is seen from DIRECTLY above, straight down: round rims are perfect circles, no side walls showing. Each sits in the middle of its own cell and fills about 85% of it (loose food about 70%; a long tool lies diagonally from corner to corner). Bowls and katoris are plain brushed steel, plates plain white or plain steel; a glass, cup, saucer, platter or cake stand only where an item names one. Draw each item as its words describe it (its vessel, its colours, its garnish). Nothing touches anything else and nothing crosses into another cell.

Background: one {GROUND}, perfectly even, edge to edge: no board, no worktop, no cloth, no shadow under any item.

Style: exactly as the attached pictures: a stylised 3D animated-feature-film look, believable materials, food with soft natural colour, clean simplified surfaces, no outlines. One warm light from the upper left, a soft fill, no rim light, no halo. Clean crisp edges.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- **Cut:** each sheet by its gutters (`artcut.py`, job type `grid`: `rows` 2 for side-on, 3 for top-down; `glass: true` for the jar
  and bottle sheets, partial alpha against the measured grey; magenta sheets keyed hard). Trim, pad 16 px, WebP with alpha, at
  most 512 px tall; the `@2x` never past the source. Names from the CSV's `id` column: `shelf-<id>-f.webp` side-on,
  `<id>-t.webp` top-down, in a new folder, assets/cook/items/s17-stove400.
- **Wire (no game code in this run):** each item's class goes into its catalogue entry (`data/cook.json` words, a `size: "L"|"M"|"S"|"W"`
  field) and the shelf scales by class instead of by group (the report's implementation plan). The chai shelf's eight files swap
  first; the old v2 and bare jars stay in the repo until the swap is judged.

## 7. Judging

`artjudge.py` first (the checks' `judge` profiles: the aspect, a flat ground, the number of separate pieces, the sweets risk on food),
then the colour and look checks once that tool lands (the house palette, light from the upper left by quadrant, the rim and halo
finish, no baked shadow, one batch per surface: the lid family and gloss measured across a sheet and against FA01), then Claude's look
at a contact sheet of every cut-out on the stone shelf at 740x320 and 1920x1080, flaws first.
