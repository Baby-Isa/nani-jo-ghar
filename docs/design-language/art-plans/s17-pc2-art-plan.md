# Art plan (pack `s17-pc2`): the stone panels and the stone shelf

**Written:** 5 Nov 2026. Zafar chose the materials board's option 1 (pack s17-pc, `sources/art/s17-pc/mb-materials-board-v1.webp`):
"I like 1 on this, can we do this colour left and bottom panel and this ledge style? can you give me an art run to see it in chatgpt
(and create the background assets you need)" (ART-41). **Run spec:** `build/tools/art/specs/s17-pc2.run.yaml`.

**The look:** the side panel and the bottom shelf band are one pale warm-grey matte stone (about #dcd0c7 on the board), the jars
standing on a stone shelf along the band's foot: its flat top a little lighter, a thin rounded front edge with a soft shadow. The
marble play area is unchanged.

## 0. Totals

| Line | What | Used for |
|---|---|---|
| ST | A seamless 1024x1024 tile of the stone | the side panel and the shelf band's wall, tiled (every game's shared panel) |
| SL | A front-on stone shelf strip that tiles left to right | the ledge under the shelf's jars (replaces today's grey line) |
| PV | His chai screen in the new look | his preview (not cut) |
| | **3 prompts** (about 5 images with redos) | |

## 1. Flaws and uncertainties first

1. **A tile can show its repeat** at 1920 wide; the check asks for no veins or spots, and the cutter blends the edges (as the marble).
2. **The shelf strip's height** must suit every size: cut its top face and front edge only, drawn at about the word pill's height.
3. **The gold glow on the stone:** the study measured the glow reading by hue on stone; the preview shows it on the carton.

## 5. The prompts

#### ST. The stone tile
```
Generate an image, 1024×1024, square.

A seamless, tileable texture of the pale warm-grey matte stone wall in the attached picture (the plain wall behind the jar and the bottle): the same colour, a soft greyish beige, with only a faint, even mineral grain you can barely see. No veins, no spots, no streaks, no cracks.

It must tile seamlessly left to right and top to bottom with no visible seam or repeat; flat, even, top-down light with no vignette, no shadow and no highlight from one side; very low contrast (the lightest and darkest parts within about 5% of the base colour); matte, no shine; it fills the whole square edge to edge, no border, no objects. Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SL. The stone shelf strip
```
Generate an image, 1536×1024, landscape.

Front view of ONE long stone shelf, exactly like the shelf the jar and the bottle stand on in the attached picture: the same pale warm-grey matte stone, its flat top surface seen slightly from above (a little lighter than the wall behind it), and a thin, softly rounded front edge with a soft, short shadow just under it. The shelf runs perfectly straight and level across the whole picture and continues off the left and right edges, so the picture can be repeated side by side with no seam. Its top surface is about one sixth of the picture's height deep and sits a little below the middle.

Above the shelf: the same plain pale warm-grey stone wall as in the attached picture. Below the shelf's front edge and its shadow: plain flat white. Nothing stands on the shelf: no jar, no bottle, no objects. Soft, even light from above, matte, no shine.

Style: as the attached picture: clean, real, calm, semi-photographic. Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PV. The preview on his screen
```
Edit the first attached image. The magenta (#ff00ff) areas are the only parts to change: the left side column and the bottom shelf band. Fill them with the pale warm-grey matte stone of the second attached picture: the side column the plain stone wall; the bottom band the same stone wall, with the stone shelf of the second attached picture running along its foot (its flat top a little lighter, a thin rounded front edge with a soft shadow), the jars, bottle and carton standing on its top surface where they are now, their word labels on the shelf's front edge. Nothing else changes. Where a card, jar, bottle, carton or word label covers the area, it stays exactly as it is, in front.

Keep everything that is not magenta exactly as it is: the white marble worktop, the black hob and pan, the wooden tray and the glass, the gold glow round the carton, every card, face, button, icon, jar, bottle, carton and every word and letter, in the same places, sizes and colours. Do not add people, hands, objects or decoration. The new surfaces are matte and softly lit from above, with no strong pattern and no harsh shadow; where they meet the marble there is only a thin soft edge.

Output 1536×1024 with the whole screenshot kept inside it at its own proportions, padded with white if needed, never stretched or cropped. Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- ST: edges blended so it tiles (as the white marble, `build/tools/art/`), x1 and x2 webp, `assets/shared/panel/stone-tile-s17`; the side
  panel's and the shelf band's background, tiled, with `--njg-panel` set to its mean colour for anything drawn flat.
- SL: cut to the shelf's top face, front edge and shadow (the wall above and the white below dropped), as a horizontal strip,
  `assets/shared/panel/stone-shelf-s17`, repeated along the shelf band's foot in place of the grey plank line, at about the word
  pill's height; one shared shelf band for every station (the study's six copies folded into one).
- PV: not cut; his preview.
