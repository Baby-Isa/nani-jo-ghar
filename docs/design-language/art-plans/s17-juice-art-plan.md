# Art plan (pack `s17-juice`): the juice sprites for chai, in the game's look

**Written:** 6 Nov 2026 (overnight), from the sound-and-juice map (`build/reports/sound-and-juice-chai-2026-11-06.md`, section 4)
and Zafar's 1 Nov call on the painted effects (ART-31, decision 2a: "the steam and the serve sparkle get redrawn in the s14 look in
your next art run"; the blue splash dropped). **Decision 77:** Claude wrote this plan and its block; Zafar runs it in ChatGPT;
Claude judges, cuts and wires. **ART-29:** one paste block, every reference on the branch the block reads. **Run spec:**
`build/tools/art/specs/s17-juice.run.yaml`; the block: `docs/design-language/art-plans/s17-juice-chrome-block.txt`.

**The idea:** four small sprite sheets, each one painted effect in a few steps on one flat mid-grey, cut colour-to-alpha by their
gutters (as the s11 effects sheet was, `assets/shared/fx-s11/`, but in the s14 look: soft, glowing, no clip-art shapes). The game
draws them small over the real art, scaled in and faded out in about half a second, never blocking a tap (the chai station's
`fx()` helper, to move into the shared kit). Halal and plain: no coins, no sweets, no stars as prizes; the sparkle and the burst
mark progress (every glass, every serve), never a verdict.

**Keep the laptop awake for the whole run:** on a Mac, `caffeinate -dims` in Terminal, charger in, lid open; on Windows,
PowerToys Awake on.

## 0. Totals

| Line | What | Game pictures | Used at |
|---|---|---|---|
| SK | A warm gold sparkle in four growing-and-fading steps, and two tiny dots | 6 | the full glass; the end screen's gold badge |
| ST | Steam: three soft wisps, and the same three thinner | 6 | the boil from heat 0.7, the boil-over, the poured glass |
| TD | Drops of milky chai: a falling drop, a crown, ring ripples, droplets | 6 | the pour's landing (wired only after Zafar sees the cut: decision 4) |
| BU | A soft gold burst in three sizes, and three single rays | 6 | the serve's stamp; the end screen's gold badge |
| | **4 prompts** (about 6-8 images with redos; under an hour in two windows) | **24** | |

## 1. Flaws and uncertainties first

1. **Soft effects on grey leave a fringe.** ChatGPT paints a faint halo where a wisp meets the ground. The cut is colour-to-alpha
   against the measured grey (never a hard key), and the check asks for no shadow or haze on the grey; a 1-2 px fringe is handled
   in the cut, more is a redo.
2. **A sparkle can come out as clip-art.** The art bible forbids "glossy clip-art shine spots"; SK's check says soft, glowing, no hard
   points, no star shapes. If it still reads as a sticker, the redo adds "like a point of sunlight on glass".
3. **TD re-tries something Zafar removed.** He dropped the painted blue splash (ART-31) and asked whether it could look like the
   game instead. TD is that try in the tea's own colour; nothing is wired until he has seen the cut.
4. **ST must match the pictured boil.** The chai pan's overhead states are attached so the wisps' scale and softness agree with the
   steam already painted into the boil pictures.
5. **No coin and no tick in this pack**, on purpose: the tick is the kit's one flat gold SVG everywhere, and a painted coin invites
   "money as a prize". If Zafar wants a coin for the shop later, it is its own line.

## 5. The prompts

Every prompt is one image. Sheets are cut by their gutters; nothing touches a cell's edge. The style anchor is attached for the
look; the chai glass and pan for colour and scale.

#### SK. The sparkle, in steps
```
Generate an image, 1536×1024, landscape.

A sprite sheet of ONE warm gold sparkle for a children's cooking game, in an invisible grid of 3 columns and 2 rows, each cell showing the sparkle alone at one step:
Row 1: (1) a soft small point of warm gold light; (2) the same grown into a small soft four-point star of light; (3) the same larger, a soft four-point star with a faint warm glow around it.
Row 2: (4) the star fading, thinner and fainter; (5) two tiny soft dots of gold light; (6) an empty cell.
The sparkle is light, not an object: soft, glowing, slightly blurred at its tips, never a hard-edged or clip-art star shape, never outlined. The same gold in every cell. Everything well inside its cell.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows or haze on the grey. Do not draw grid lines.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### ST. Steam wisps
```
Generate an image, 1536×1024, landscape.

A sprite sheet of soft steam for a children's cooking game, in an invisible grid of 3 columns and 2 rows, each cell ONE wisp of steam alone, rising and curling gently, semi-transparent white, like the steam over the boiling chai in the attached pan but drawn on its own with NO pan, cup or anything else:
Row 1: (1) a wisp curling to the left; (2) a wisp rising nearly straight; (3) a wisp curling to the right.
Row 2: (4), (5), (6) the same three wisps thinner and fainter, as steam thins out.
Each wisp about 60% of its cell's height, soft-edged, fading to nothing at its top, never a solid cloud, never outlined. Everything well inside its cell.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows or haze on the grey. Do not draw grid lines.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### TD. Drops of chai
```
Generate an image, 1536×1024, landscape.

A sprite sheet of milky caramel chai in motion for a children's cooking game, the exact tea colour of the attached glass, in an invisible grid of 3 columns and 2 rows, each cell showing the liquid alone with NO glass, cup, pan or surface edge drawn:
Row 1: (1) one round falling drop of chai; (2) a small crown splash as the drop lands, a few droplets lifting; (3) a single soft ring ripple on a flat chai surface, seen a little from above.
Row 2: (4) two concentric ring ripples on the chai surface; (5) one small round droplet; (6) two small droplets.
Glossy, soft, with gentle highlights; nothing blue, nothing clear like water. Everything well inside its cell.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows or haze on the grey. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BU. A gold burst of light
```
Generate an image, 1536×1024, landscape.

A sprite sheet of a soft gold burst of light for a children's cooking game, in an invisible grid of 3 columns and 2 rows, each cell showing the light alone with no object in it:
Row 1: (1) a small burst: soft warm gold rays radiating from a bright warm centre, fading to nothing at their tips; (2) the same burst medium; (3) the same burst large, filling most of its cell.
Row 2: (4) one single soft ray of the same gold; (5) the same ray thinner; (6) the same ray thinner and fainter.
Light, not an object: soft, glowing, slightly blurred, never hard-edged; no stars, no confetti, no coins, no sparkles mixed in. Everything well inside its cell.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows or haze on the grey. Do not draw grid lines.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- **Cut:** each sheet by its gutters into cells, colour-to-alpha against the measured grey (never a hard key: art-pipeline, "glass and
  steam need partial alpha"), trimmed with a 16 px pad, stored as WebP with alpha at 256 px on the long side (and @2x at 512) in a
  new shared effects folder, fx-s17, beside `assets/shared/fx-s11/`, with a `fx-s17.json` of sizes as the s11 set has.
- **Judge:** every cut on black and on white (the fringe shows on one or the other), then in a chai screenshot at 930x430 and
  1920x1080: a sparkle at 60-90 design px over the full glass, a wisp at 80-120 over the pan, the burst behind the serve's stamp.
- **Wire:** `js/shared/sfx.js` is the sound side; the sprites go through the shared `Juice.sprite` / `Juice.steam` (the chai
  station's `fx()` moved into the kit) and fill the empty `sparkle` / `steam` stubs in `js/cook/stations.js`, so every existing caller
  draws them. ST replaces the s11 steam in the boil-over; SK replaces the s11 sparkle on the glass; BU is new at the serve; TD waits
  for Zafar's look at the cut (decision 4 in the report).
- **Reduced motion:** the sprites still appear (one still frame, no drift) under the system's reduce-motion setting or the
  grown-ups' "less motion" switch; the steam loop is off.
