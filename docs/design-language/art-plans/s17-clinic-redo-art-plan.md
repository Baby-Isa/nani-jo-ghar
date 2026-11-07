# Art plan (pack `s17-clinic-redo`): the clinic's redos and its items at three times, one batch

**Written:** 6 Nov 2026, from Zafar's words (6 Nov; CLN-219, ART-45): "for the clinic ones, just do loads of clinical devices,
even stuff we don't use, like stitches and round plasters, different size. Actually, we need the curved round plaster, by the way,
for the feet ... It should look like one batch ... pill bottles ... however many items we currently have, times it by 3, and
that's your target"; and the toothbrush (CLN-180, his words in the row). The honest redos come from the re-tuned review
(`docs/design-language/art-plans/redo-strict-2026-11-06.yaml`, block `clinic`). **Decision 77:** Claude wrote this plan and its
block; Zafar runs it; Claude judges, cuts and wires. **ART-29:** one paste block, every reference on the branch the block reads.
**Run spec:** `build/tools/art/specs/s17-clinic-redo.run.yaml`; the block: `s17-clinic-redo-chrome-block.txt`.

**Keep the laptop awake for the whole run:** on a Mac, `caffeinate -dims` in Terminal, charger in, lid open; on Windows,
PowerToys Awake on.

## 0. Totals

The clinic draws **35 distinct items** today (`clinic-items.md`); three times is **105**. This block draws **about 70 new
items** (the round and heel plasters in part A, part C; a few of part C redraw today's decoys in this batch: the torch, hammer,
stethoscope, crutches, patch), the **redos** (part B), then, lowest priority, **32 of today's items again in this batch** (part D),
so the pharmacy belt reads as one batch.

| Part | What | Prompts | Items |
|---|---|---|---|
| A | The anchor: the plasters (the four colour plasters redrawn, round plasters in three sizes, the curved round plaster for the foot) | 1 | 8 |
| B | The redos: the toothbrush at Zafar's angle, its other views, the drop machine, the wipes, jug, dropper, bandage, tweezers, thermometer, the rough cup and foot bath | 5 | 26 |
| C | New items: wound care, diagnostics, medicines, drops and breathing, clinic supplies, the dentist's things, eyes, casts and comfort | 9 | 72 |
| D | Today's items again, in this batch (the pharmacy belt's) | 4 | 32 |
| | **Total** | **19 prompts** (about 25 images with redos; about 2 hours with 3 windows) | **138** |

## 1. Flaws and uncertainties first

1. **Eight items a sheet is near the top of what the generator keeps distinct;** a merged, doubled or reordered sheet is a redo.
2. **The colour-coded sets keep the game's colours (Zafar, 6 Nov night, decision 5: "a colour-coded set: the colours are the
   game"):** the four plasters (CA01), the drop machine's four dispensers (DM01), the toothbrush (TB01, TB02: the shipped blue
   brushes) and the game's coloured bandages and threads (CD01). No one Wada combination holds red, yellow, green and blue, so
   each of those lines carries a `colour_exception` in the run spec, printed in the block for the runner. Every other blue
   item is Venice Green, the house teal (ART-58). CD01's bandages and threads are a reading of decision 5 (its list named
   "bandage"): the game asks for them by colour (`data/clinic.json` `bandage`, `thread`), so a teal one would clash with
   the green one; Zafar to confirm.
3. **The toothbrush angle has no photo reference:** none of 17 free photos on Wikimedia Commons shows it (6 Nov), so the block
   attaches a plain diagram (`sources/art/clinic-redo/toothbrush-angle.png`, made by `build/tools/art/toothbrush_angle.py`) and
   describes the angle in words. Never the old toothbrush reference (Zafar, 6 Nov).
4. **Wood is walnut** (Zafar, 6 Nov): the tongue depressor, the hourglass frame and the honey jar's lid, not too dark on a lid.
5. **Belt view only** (front and a little above). The tray (top-down) views of the new items are a later run if a game wants them.
6. **Part D replaces pictures the game already shows;** nothing is wired without Zafar's yes on the contact sheet.

## 2. One batch: camera, light, palette, edges

- **Camera:** every item seen from the front and a little above (the pharmacy belt's view), standing or lying as it naturally
  rests, filling about 85% of its cell; never two cameras on one sheet.
- **Light:** one warm key from the upper left, a soft fill; no rim light.
- **Palette:** the house strip is attached to every picture; each picture's main colours from ONE combination, in lighter and
  darker tones; whites, greys, clear plastic, glass and steel are free. Coloured items name house colours in words (Venice Green,
  the house teal, for what was blue; Chromium Green, Carmine Red, Olive Buff), never the generator's bright sky blue; only the
  colour-coded sets (flaw 2) name Olympic Blue and Yellow Ocher together. `artblock.py --check` reads every line's prompt for
  this (ART-58).
- **Edges:** clean, crisp, no halo, no shadow under any item, no floor; one flat neutral mid-grey ground.
- **No text** on any box, bottle, tube, dial or packet; no needles, no sweets, no lollipops.

## 3. References (one zip; Zafar drags its files into the Chrome chat with the block)

`artblock.py` copies them to `sources/art/s17-clinic-redo/refs/` and zips them as `refs.zip` (ART-42, decision 4); the block's
first lines give him its raw link.

| Name | Repo path | What it carries |
|---|---|---|
| style-anchor.png | `sources/art/style-anchor-v1.png` | the house look |
| clinic-style.png | `sources/art/s02/e12-tweezers-sheet-v1.png` | the clinic's steel and finish |
| toothbrush-angle.png | `sources/art/clinic-redo/toothbrush-angle.png` | Zafar's toothbrush angle, as a diagram |
| drop-machine-old.png | `sources/art/s17-art3/dm-drop-machine-wide-v1.png` | the drop machine's parts and levers, to redraw |
| house-swatch.png | `build/tools/art/data/house-swatch.png` | the house colours (HOUSE LOOK) |
| kept:CA01 | (made in part A) | the batch every later sheet copies |
| kept:TB01 | (made in part B) | the toothbrush every toothbrush view copies |

## 4. The prompts

#### CS. A sheet of clinic items (belt view)
```
Generate an image, 1536×1024, landscape.

A product sheet of {N} separate items for a children's doctor game, laid out in a 4 by 2 grid of equal cells, in this order (left to right, top row first): {ITEMS}. {EMPTY}

Every item sits in the middle of its own cell, seen from the front and a little above (as on a pharmacy counter), resting as it naturally would, and every item fills about 85% of its cell (draw them all about the same size, not at their real sizes). Clean simple shapes a young child recognises at once. Nothing touches anything else and nothing crosses into another cell.

Background: one flat neutral mid-grey #808080, perfectly even, edge to edge: no floor, no table, no shadow, no reflection under any item.

Style: exactly as the attached pictures: a stylised 3D animated-feature-film look, believable materials (matte plastic, soft fabric, brushed steel, clear glass), clean simplified surfaces, appealing slightly chunky shapes, no outlines. One warm light from the upper left, a soft fill, no rim light, no halo. Clean crisp edges. {MATCH}

Do not add any text, letters, numbers, labels, logos, scales with numbers or watermarks.
```

#### CB. The toothbrush, at Zafar's angle
```
Generate an image, 1536×1024, landscape.

ONE child's toothbrush, lying on its side on a white marble counter, its bristles facing AWAY from us. We look at it from behind: our eye is just a little above the counter's flat surface, so we see the BACK of the head and the BACK of the handle straight on, square to us, and only the tips of the bristles showing over the top of the head, receding away from us. The handle is not twisted: its back faces us flat, along its whole length, from the end of the handle to the head. The attached diagram shows exactly this angle: copy its angle and layout, not its flat look.

The brush: a cream handle with a soft Olympic Blue grip panel on its back (the blue sits exactly in the middle of the back, facing us), a matching soft Olympic Blue panel on the back of the head, white bristles. The brush runs across the middle of the picture from left (the handle's end) to right (the head), filling about 80% of the width.

Background: one flat neutral mid-grey #808080 behind and under it, perfectly even (the counter in the diagram is only to show the angle): no shadow, no reflection.

Style: exactly as the other attached picture: a stylised 3D animated-feature-film look, believable matte plastic, clean simplified surfaces, no outlines. One warm light from the upper left, a soft fill, no rim light, no halo. Clean crisp edges.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CD. The drop machine
```
Generate an image, 1536×1024, landscape.

ONE friendly drop machine for a children's doctor game, seen straight from the front: a rounded cream cabinet the width of the picture's middle 70%, with FOUR identical clear glass dispensers in a row on its top, each holding a softly coloured liquid (left to right: a soft red, a soft ochre yellow, a soft green, a soft Olympic Blue), each with a short steel spout pointing down and a small round lever on its right side, all four levers up. The same parts as the attached old machine, redrawn in the house look: softer, calmer colours, no shine bands.

Background: one flat neutral mid-grey #808080, perfectly even: no floor, no shadow.

Style: exactly as the attached clinic pictures: a stylised 3D animated-feature-film look, believable materials, clean simplified surfaces, no outlines. One warm light from the upper left, a soft fill, no rim light. Clean crisp edges.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 5. Cut and wire notes

- **Cut (done 7 Nov, `build/tools/art/specs/s17-clinic-redo.cut.json`, landed in `build/reports/s17-clinic-redo-landed-2026-11-07.md`):**
  each sheet by its cells (`artcut.py`, `grid`, `cells` 4x2, whole blobs by centroid), grey ground at tol 8, steel and grey rubber at
  tol 5, clear glass, plastic, water, steam and the drop at partial alpha (`glass`, soft floor 0.25, gain 2.0), the two toothbrush
  sheets with `shadow` (a faint contact shadow), trimmed, padded 16 px, WebP q 88 with alpha, longest side at most 512 px (the drop
  machine and Zafar's-angle toothbrush 1024: both are drawn wide). Names from the line's item list, in the new folder
  `assets/clinic/s17-clinic-redo/` (the brief's folder, not items-s17): belt items as `<item>-belt.webp` (today's items keep the
  game's names: `bandage-<colour>-belt`, `thread-<colour>-belt`), the toothbrush views as `toothbrush-<view>-s17.webp`;
  `cut-data.json` beside them. 138 pieces, 2.5 MB.
- **Judge (done):** `artjudge.py --spec … --no-look` on the 19 sheets, `artcolour.py` on the cuts with `--batch items-s17`, the pixel
  check `artcheck.mjs`, and every cut by eye on a split dark and light ground (`build/screenshots/s17-land-clinic-redo/`). The belt
  contact sheet at 740x320 and 1920x1080 waits for the wiring sprint (nothing is wired).
- **Wire (a build session, after Zafar's yes):** the redos swap in place of the rows' files (`redo-strict-2026-11-06.yaml`, block
  `clinic`); the new items join `data/clinic.json` as decoys and future asks; nothing about any game's rules changes.

## 6. Judging

Every sheet: the items in order, each clearly that thing to a young child, one camera, one light, the house's calm colours (no
bright sky blue), no text, no shadow; the batch matches the kept CA01. The toothbrush: the angle in the diagram, the back of the
handle square-on and untwisted, the blue panel facing us, only the bristle tips showing.
