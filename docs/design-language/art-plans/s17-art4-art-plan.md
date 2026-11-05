# Art plan (pack `s17-art4`): the white marble worktop, and the glass full to the rim (chai and plain tea)

**Written:** 5 Nov 2026, from Zafar's chai replay notes (`docs/feedback/chai-replay-2026-11-05.md`: "Can we change this to the new
background marble for the stove top down games? ... if it needs recreating in chatgpt ... give me the artrun first"; "more obviously show
half and full (half should be a little lower than current end height, and full should be right to the rim) ... we need that bigger
difference shown on item cards, and we also need non-milk tea versions as item cards"). **Run spec:** `build/tools/art/specs/s17-art4.run.yaml`.

**The idea:** his marble (a 500x274 picture, too small to upscale for a 1600-wide worktop) is drawn again large from his own picture.
The glass: two edits of the one steady empty glass (pack s17-wm2's WE, lined up to the pixel), full right to the rim, one with milky
chai and one with plain tea (no milk). The code reveals either below any level, so half, full and every item card come from these two.

## 0. Totals

| Line | What | Game pictures |
|---|---|---|
| MW | The white marble worktop, top-down, large, from Zafar's picture | 1 |
| WR | The empty glass edited: milky chai right to the rim | 1 |
| WB | The empty glass edited: plain tea (no milk) right to the rim | 1 |
| | **3 prompts** (about 5 images with redos) | **3** |

## 1. Flaws and uncertainties first

1. **An edit can nudge the glass.** WR and WB must lay over WE to the pixel; if one moves, it is cut and lined up by its outline.
2. **The marble must tile or cover**: the stove games draw it across the whole worktop; one large picture with no light or shadow
   falling across it covers every size.

## 5. The prompts

#### MW. The white marble worktop
```
Generate an image, 1536×1024, landscape.

A flat, top-down photograph of a polished WHITE marble worktop exactly like the attached picture: soft white stone with fine, thin grey veins wandering across it, evenly lit, seen straight from above, filling the whole picture edge to edge. No objects, no edges, no light patches, no shadows, no reflections of windows, no change of light from one side to the other: the same even white everywhere, so it can cover a whole kitchen worktop.

Style: a clean, real marble texture, crisp and fine.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### WR. The glass full of chai, right to the rim
```
Edit this image: fill the glass with milky caramel chai RIGHT UP TO THE RIM, the top of the chai level with the glass's rim, a calm flat surface. Change NOTHING else: the glass, its outline, size, position, facets and highlights, the counter, the wall, the light and the shadow stay exactly as they are.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### WB. The glass full of plain tea, right to the rim
```
Edit this image: fill the glass with plain black tea with NO milk (a clear, deep amber-red tea you can see a little light through) RIGHT UP TO THE RIM, the top of the tea level with the glass's rim, a calm flat surface. Change NOTHING else: the glass, its outline, size, position, facets and highlights, the counter, the wall, the light and the shadow stay exactly as they are.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- MW: whole, as the stove games' worktop (chai first): replaces the cream marble (`assets/cook/worktop-s08c/`), checked at the four sizes.
- WR, WB: cut the same box as `glass-wf-s17` (pack s17-wm2's cut) once lined up with WE; the word moment's full and half come from WR
  (half lower than now, full to the rim); the item cards' half and full pictures are made from WR and, for an order with no milk, WB.
