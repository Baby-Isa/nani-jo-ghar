# Art plan (pack `s17-wm`): the word moment on the kitchen counter, side-on

**Written:** 3 Nov 2026, late, from Zafar's chai play (CHAI-67 notes, `docs/feedback/chai-play-2026-11-03.md`): "the glass starts off
transparent, then when the tea gets poured in, the glass moves a few pixels left or right, turns to have a dark grey background as it
fills ... let's change it to the two glasses being on the kitchen countertop, without the tray, seen exactly from side on"; "get the
tea poured at 10 different stages of being full ... the same thing in the same place". **Run spec:** `build/tools/art/specs/s17-wm.run.yaml`;
the block: `s17-wm-chrome-block.txt`.

**The idea (Claude's, from his suggestion):** a glass is see-through, so whatever is behind it is baked into its picture. So the
glasses are drawn standing on the counter in front of a **plain wall with no tiles**: what shows through them is one flat wall colour,
the same as the scene the game puts them in, wherever they stand. Every fill stage is the same glass, the same size, in the same light,
on the same counter, so the frames swap with no shift and no change of tint. The baking jug gets the same treatment so both moments are
one kind of scene ("it's like it's pouring in its measurements").

## 0. Totals

| Line | What | Game pictures |
|---|---|---|
| MS | The scene: the counter and the plain wall, side-on, empty | 1 |
| MG | The chai glass on that counter, eleven fill stages (empty to full in tenths) and one with froth | 12 |
| MJ | The baking jug on that counter, flour in six stages and water in six | 12 |
| | **3 prompts** (about 5 images with redos) | **25** |

## 1. Flaws and uncertainties first

1. **The wall colour must match** between MS and every cell of MG and MJ: MG and MJ attach the kept MS, and the check compares them.
2. **Eleven glasses in one picture** is small for each: the sheet is two rows (six and six) at 1536x1024, each glass about 40% of a
   row's height; the game shows one at a time, about 300 px tall at 1920x1080, so a cell of about 250 px is upscaled a little. If it
   reads soft, the redo is two sheets of six.
3. **The kettle (WV, block 1) and the streams (WS) stay.** The shutter (WF) is retired: the snap is the four corners, a flash and a
   shutter sound (Zafar, 3 Nov).

## 5. The prompts

#### MS. The word moment's scene: the counter and a plain wall
```
Generate an image, 1536×1024, landscape.

A background for a children's cooking game: the kitchen counter in the attached picture seen EXACTLY side-on at the counter's own height, as a calm, empty stage. The cream-white marble worktop runs the full width; its front edge is one straight horizontal line at 70% of the image's height, with a thin band of its top surface just above that edge, and the sage-green cabinet doors below it to the bottom edge. Above the worktop: a completely PLAIN warm limewash wall, one soft even colour with no tiles, no splashback, no window, no shelf, no pictures, softly lit from the left. The worktop is completely EMPTY: no tray, glass, kettle, jars, plants, people or cat.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### MG. The chai glass on the counter, filling
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME faceted chai glass as in the second attached picture, standing on the SAME marble counter in front of the SAME plain wall as in the first attached picture, seen EXACTLY side-on, in an invisible grid of 6 columns and 2 rows. In every cell the glass is the same size, upright, centred, standing on the counter's top surface at the same height, with the plain wall behind it showing softly through the glass. Each cell shows the counter strip and the wall behind the glass, exactly matching the first attached picture.
The milky caramel chai in the glass, in this order: Row 1: (1) empty, (2) one tenth, (3) two tenths, (4) three tenths, (5) four tenths, (6) exactly HALF. Row 2: (7) six tenths, (8) seven tenths, (9) eight tenths, (10) nine tenths, (11) FULL to just below the rim, (12) full with a thin pale froth on top. The tea's top is a flat level line; the glass never moves between cells, and only the tea changes.

Style: exactly as the attached glass and kitchen: a stylised 3D animated-feature-film look, semi-photoreal glass and chai, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. Do not draw grid lines.
```

#### MJ. The baking jug on the counter, filling
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME clear glass measuring jug as in the second attached picture (plain horizontal lines on its side and NO numbers), standing on the SAME marble counter in front of the SAME plain wall as in the first attached picture, seen EXACTLY side-on, in an invisible grid of 6 columns and 2 rows. In every cell the jug is the same size, upright, centred, standing on the counter's top surface at the same height, its handle to the right, with the plain wall behind it showing softly through the glass.
Row 1, soft white FLOUR with a flat top: (1) empty, (2) a quarter, (3) HALF, (4) three quarters, (5) FULL to the top line, (6) full and a little heaped. Row 2, clear WATER with a flat top and a soft highlight: (7) empty, (8) a quarter, (9) HALF, (10) three quarters, (11) FULL to the top line, (12) full with a few small ripples. The jug never moves between cells; only what is in it changes.

Style: exactly as the attached jug and kitchen: a stylised 3D animated-feature-film look, semi-photoreal glass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. Do not draw grid lines.
```

## 6. Cut and wire notes
- MS becomes the word moment's background (`js/shared/word-moment.js`), the counter's top at the same height as the glasses' base.
- MG and MJ are cut cell by cell to the glass's outline **with** what shows through it (the plain wall), so a glass placed on MS
  matches it; every cell the same box, so the frames swap in place. The snap keeps cell 6 (half) and cell 11 (full) as the item cards'
  pictures for *adh* and *aako* (Zafar, 3 Nov: the item cards use the snapped pictures).
