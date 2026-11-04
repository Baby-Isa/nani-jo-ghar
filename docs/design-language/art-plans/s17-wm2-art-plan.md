# Art plan (pack `s17-wm2`): one steady glass for the word moment, large

**Written:** 4 Nov 2026, from Zafar's L4 replay (`docs/feedback/chai-play-2026-11-04.md`: "the glasses move around and they change
... as the tea gets filled up, the glass is just jumping all over the place, and it looks like the internal reflections are all
changing ... There's got to be a better solution"). **Run spec:** `build/tools/art/specs/s17-wm2.run.yaml`; the block:
`s17-wm2-chrome-block.txt`.

**The idea (Claude's):** no more fill stages. Twelve separately drawn glasses can never match, whatever the prompt says: each cell is
a new drawing, so the glass shifts and its reflections change from frame to frame. Instead ONE glass, drawn once, never swapped: the
tea rises inside it in code (the game draws the tea, clipped to the glass's inside, its top a soft ellipse, the glass's own highlights
laid back over it). WF is the same picture edited, full of chai, so its tea colour and surface are the guide (and, if the edit keeps
the glass exactly in place, the code can reveal the full one from the bottom up instead). Large (1024x1536), so it is crisp at
1920x1080, where the 250 px cells of pack s17-wm were upscaled and soft. The kettle (block 1) stays; its stream, the drops and the
thin camera corners are drawn in code.

## 0. Totals

| Line | What | Game pictures |
|---|---|---|
| WE | One chai glass, empty, on the counter in front of the plain wall, side-on, large | 1 |
| WF | The same picture edited: the same glass full of chai, nothing else changed | 1 |
| | **2 prompts** (about 3 images with redos) | **2** |

## 1. Flaws and uncertainties first

1. **An edit can still nudge the glass.** WF's check compares it with WE: the glass's outline, size and place must not move. If it
   moves, the code fill (from WE alone) is the plan, and WF is only the colour guide.
2. **The wall colour** behind the glass must be the counter scene's (MS, pack s17-wm), as before: WE attaches the kept counter.

## 5. The prompts

#### WE. One chai glass, empty, large
```
Generate an image, 1024×1536, portrait.

ONE faceted chai glass exactly like the one in the second attached picture, EMPTY and clean, standing in the middle of the SAME cream-white marble counter in front of the SAME plain limewash wall as in the first attached picture, seen EXACTLY side-on at the counter's own height. The glass is large: it fills about 70% of the picture's height, centred left to right, upright, its base resting on the worktop whose front edge is one straight horizontal line near the bottom. Clear glass: the wall shows through it, with soft highlights on its facets and rim and a gentle shadow on the worktop. Nothing else in the picture.

Style: exactly as the attached glass and kitchen: a stylised 3D animated-feature-film look, semi-photoreal glass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### WF. The same glass, full of chai (an edit of WE)
```
Edit this image: fill the glass with milky caramel chai to just below its rim, the top of the chai a calm flat surface with a soft light reflection. Change NOTHING else: the glass, its outline, size, position, facets and highlights, the counter, the wall, the light and the shadow stay exactly as they are.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- WE: cut the glass from its wall by the counter scene's colour, as pack s17-wm (`wmcut.py`), one frame; its inside traced (the walls
  inset from the outline) for the code fill's clip. WF: cut the same box; if it lines up with WE within 2 px, the reveal; else the
  tea colour and the surface's highlight only.
