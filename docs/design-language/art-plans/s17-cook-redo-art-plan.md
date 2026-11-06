# Art plan (pack `s17-cook-redo`): Cook's honest redos after the re-tuned review

**Written:** 6 Nov 2026, from the re-tuned review (`build/reports/art-review-strict-2026-11-06.md`, "After Fable's view:
re-tuned"; the redo list `docs/design-language/art-plans/redo-strict-2026-11-06.yaml`, block `cook`) and Fable's redo programme
(chai's leftovers first, then daar and chaat). **Not here:** anything in the stove run (`stove-400-items.csv`, its redo list
`s17-stove400-redo-list.yaml`): the chai shelf's eight, the shelf jars, the kettle, milk pan and strainer, the coriander bunch
(`shelf-ph-dhana-bare-f` is replaced by the stove run's FV01 bunch). **Decision 77:** Claude wrote this plan and its block; Zafar
runs it; Claude judges, cuts and wires. **Run spec:** `build/tools/art/specs/s17-cook-redo.run.yaml`; the block:
`s17-cook-redo-chrome-block.txt`.

**Keep the laptop awake for the whole run:** on a Mac, `caffeinate -dims` in Terminal, charger in, lid open; on Windows,
PowerToys Awake on.

## 0. Totals

| Part | What | Prompts | Items |
|---|---|---|---|
| A | Chai's leftovers: the two gas flames (the low one fails: the generator's electric blue), drawn with the hob's two knobs and the station's tray so the hob reads as one batch | 1 | 5 |
| B | Daar and chaat: the chopped tomato (louder than a tomato) and the mustard seeds' bowl (rai; two combinations) | 1 | 2 |
| C | Walnut wherever there is wood (Zafar, 6 Nov): the maani velan and the old rolling pin (light pine today), with chai's empty glass (the station's odd one out in gloss) | 1 | 3 |
| | **Total** | **3 prompts** (about 4 images with redos; about 20 minutes with 3 windows) | **10** |

## 1. Flaws and uncertainties first

1. **The re-tune left Cook almost clean:** 4 shipped Cook FAILs of 554 (the low flame, the rai, the chopped tomato, the dhana
   placeholder). No daar or chaat picture fails; the knobs and pans that failed the first pass now pass. This block is small on
   purpose; the stove run carries the rest.
2. **The flame:** a gas flame really is blue. The first pass recommended keeping it (decision 3); the re-tuned rule now FAILs the
   low flame by a hair. The block redraws both flames in a calmer Olympic Blue; if Zafar keeps the old ones, skip part A.
3. **The coin jar's "wood" flag is false:** its lid is brass, not wood (looked at, 6 Nov); not redrawn.
4. **Walnut, not too dark** on the rolling pins (Zafar, 6 Nov: "it shouldn't be too much").

## 2. One batch

The hob sheet copies the attached station pictures' camera (straight down) and light; the side sheet copies the stove run's look
(side-on, light from the upper left). Clean edges, no shadow, no floor; one flat ground; no text.

## 3. References (all on the branch; nothing from Zafar)

| Name | Repo path | What it carries |
|---|---|---|
| style-anchor.png | `sources/art/style-anchor-v1.png` | the house look from above |
| jar-family.png | `sources/art/pantry-v2/pantry-v2-sheet1-tall-jars.png` | the side-on glass and light |
| food-heaps.png | `sources/art/cook-v3/s5-fillings-top-v1.png` | the heap look from above |
| house-swatch.png | `build/tools/art/data/house-swatch.png` | the house colours (HOUSE LOOK) |

## 4. The prompts

#### KT. A sheet of top-down kitchen items
```
Generate an image, 1024×1024, square.

A sheet of {N} separate items for a children's cooking game, laid out in a {GRID} grid of equal cells, in this order (left to right, top row first): {ITEMS}. {EMPTY}

Every item is seen from DIRECTLY above, straight down: round things are perfect circles. Each sits in the middle of its own cell and fills about 85% of it (loose food about 70%). Nothing touches anything else and nothing crosses into another cell.

Background: one {GROUND}, perfectly even, edge to edge: no hob, no worktop, no shadow under any item.

Style: exactly as the attached pictures: a stylised 3D animated-feature-film look, believable materials, soft natural colour, calm rather than loud, clean simplified surfaces, no outlines. One warm light from the upper left, a soft fill, no rim light, no halo. Clean crisp edges.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### KS. A sheet of side-on kitchen items
```
Generate an image, 1536×1024, landscape.

A product sheet of {N} separate kitchen items for a children's cooking game, laid out in a {GRID} grid of equal cells, in this order (left to right, top row first): {ITEMS}. {EMPTY}

Every item sits in the middle of its own cell, seen EXACTLY side-on at its own mid-height, and fills about 85% of its cell (a long thing lies level and fills 85% of the cell's width). Nothing touches anything else and nothing crosses into another cell.

Background: one {GROUND}, perfectly even, edge to edge: no floor, no shelf, no table, no shadow, no reflection under any item.

Style: exactly as the attached pictures: a stylised 3D animated-feature-film look, believable materials (walnut wood, clear glass, glazed ceramic), clean simplified surfaces, no outlines. One warm light from the upper left, a soft fill, no rim light, no halo. Clean crisp edges.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 5. Cut and wire notes

- **Cut:** each sheet by its gutters (`artcut.py`, `grid`; the glass with partial alpha against the grey; the tomato keyed from
  magenta), trimmed, padded 16 px, WebP with alpha, at most 512 px; each replaces its file in place after Zafar's yes
  (`assets/cook/items/chai-station/flame-low.webp`, `flame-high`, `knob-off`, `knob-on`, `tray`, `glass`;
  `assets/cook/items/veg-tameto-chopped-t.png`; `assets/cook/props/rai.webp`; `assets/cook/items/maani-v2/velan.webp`;
  `assets/cook/props/rolling-pin.webp`), the old ones to `sources/art/s17-cook-redo/was/`.
- **Judge:** `artjudge.py`, then `python3 build/tools/art/artcolour.py --changed` (the palette, natural bands, wood and batch).
