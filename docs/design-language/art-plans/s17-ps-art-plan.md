# Art plan (pack `s17-ps`): a real chai pour for the word moment

**Written:** 4 Nov 2026, from Zafar's chai replay (`docs/feedback/chai-replay-2026-11-04-pm.md`: "is there a way to replace the chai
pouring stream with something, with a realistic image? Maybe even if it's just a static pouring image, that then fades out by you
putting a transparent layer from top to bottom slowly over time, so it's like the last drops are falling through"). **Run spec:**
`build/tools/art/specs/s17-ps.run.yaml`.

**The idea (Zafar's, kept):** one static picture of a real chai stream, falling straight down from the kettle's spout into the glass.
It grows down from the spout when the pour starts (a mask wiped top to bottom), stays still while the tea rises, and at the end a
transparent edge wipes down it from the top, so its tail falls into the glass, then the last drop. The code-drawn striped stream and the
old cartoon stream picture (wavy, block 1) are retired.

## 0. Totals

| Line | What | Game pictures |
|---|---|---|
| PS | One stream of milky chai falling straight down, the full height of the picture, on the plain wall | 1 |
| | **1 prompt** (about 2 images with redos) | **1** |

## 1. Flaws and uncertainties first

1. **Cutting a see-through stream from a peach wall.** Its edges are translucent and the wall is close to chai's colour: cut by the
   wall's own colour per row (as the glass), and the stream's straightness makes a column mask a safe fallback.
2. **Its width must match the kettle's spout**: the kettle (block 1, wv) is attached, so the stream is as thick as its spout.

## 5. The prompts

#### PS. One falling stream of chai
```
Generate an image, 1024×1536, portrait.

ONE smooth stream of hot milky caramel chai, the same colour as the chai in the glass in the second attached picture, falling STRAIGHT DOWN through the middle of the picture from the very top edge to the very bottom edge, in front of the SAME completely plain limewash wall as in the first attached picture and nothing else. The stream is as thick as the spout of the kettle in the third attached picture: about 6% of the picture's width at the top, narrowing very slightly as it falls. It is a real liquid pour: glassy and smooth, slightly translucent at its edges, a long soft highlight running down its left side from warm light at the upper left, a faint gentle twist, no splashes, no drops flying off. It runs off the top and the bottom edges of the picture: no kettle, no glass, no counter, no surface below.

Style: exactly as the attached glass and kitchen: a stylised 3D animated-feature-film look, semi-photoreal liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- PS: cut the stream from its wall by the wall's colour per row, cropped to its own column (no wall left at its sides), the top and
  bottom rows kept so it stretches cleanly to any length: `assets/shared/word-moment/stream-chai-real-s17.webp`. Wired in
  `js/cook/ui.js` (the word moment's `stream`): the art shown as it is (no striped flow over it), grown down at the start and wiped
  away from the top at the end (CSS mask), then the last drop.
