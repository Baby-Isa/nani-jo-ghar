# Sprint 14 art plan (pack `s14`)

**Written:** 28 Oct 2026, from Zafar's notes on the chai onboarding lab (`docs/feedback/chai-onboarding-2026-10-28.md` P3) and
his yes ("yes to all, include the pour frames"): the rows CHAI-34 (the pan), CHAI-08 (the glasses, reopened), ART-28 (the
kitchen), CK-06 (real contents, never drawn). **Decision 77:** Claude wrote this plan and its block; Zafar runs it in ChatGPT and
approves what lands; Claude judges, cuts and wires. **ART-29:** one paste block, every reference on the pushed branch, nothing for
him to upload. **Run spec:** `build/tools/art/specs/s14.run.yaml` (`python3 build/tools/art/artblock.py --spec build/tools/art/specs/s14.run.yaml`).

## 0. Totals

| Part | What | Images |
|---|---|---|
| **A** | The chai pan exactly overhead in its six states, one sheet (ST) | 1 |
| **B** | The same pan tipping and pouring, six cells (PT1), and the same in black tea (PT2) | 2 |
| **C** | The three glasses exactly overhead (GL) | 1 |
| **D** | The kitchen, decluttered (KT, an edit of the kitchen in play) | 1 |
| | **Total** | **5 sheets** (about 20 game pictures), about 45 minutes in three windows; PT1 waits for ST, PT2 for PT1 |

**Expected redos:** ST one or two (ChatGPT leans the camera; the check is the rings and the wall), PT1 two (the hardest view),
KT one (an edit that moves more than it removes).

**References:** Zafar's two overhead photos are the geometry, our own art is only the look: the pan photo
(`sources/art/refs/2026-10-27-cards/pan-top-down-reference.png`), the glass photo (`sources/art/refs/2026-10-28-chai/glass-top-down-ref.png`);
the pan in play (`sources/art/s08b/cp2-chai-pan-topdown-v1.png`) and the glasses in play (`sources/art/s08c/gl1-chai-glasses-top-v1.png`)
for the steel, the black handle, the lip and the style; Zafar's pour frames (`sources/art/pour-reference-2026-10-22/`) for how a
pan tips; the kitchen in play (`sources/art/s07/k1-kitchen-master-v1.png`).

## 1. Flaws and uncertainties first

1. **Why the last two pans weren't overhead:** both runs attached our own s08b pan as "the same pan" and it was drawn a little from
   the side (the inside wall shows on one side only, the floor off centre). ChatGPT copied the angle. This time the overhead photo
   comes first and the prompt says it sets the view; our pan sets only its look. The check is geometric: the rim and the floor two
   concentric circles, the wall an even ring.
2. **Six states on one sheet** so they share one pan, one size and one place: the game cross-fades them in place (CK-06: every
   state a picture, nothing drawn). If the cells drift, the cut registers each on its rim (as PT1).
3. **The pour is the new pan** (PT1 attaches the kept ST), so the pan in the hand matches the pan on the hob. No falling stream is
   drawn: the game draws it from the lip (`js/shared/pour.js`), the only thing drawn in code (Zafar, 28 Oct: "at most pouring").
4. **The kitchen is an edit** so the framing, the island's back edge (the game places Nana and the trays by it) and the light stay.
   If the edit moves the island, the redo says so; the cut checks the island edge against the old one.
5. **No real people** in this run: everything is judged pass or fail by the runner and Claude.

## 5. The prompts

#### ST. The chai pan exactly overhead, six states
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: one small brushed-steel milk pan seen from EXACTLY straight above, six times, in an invisible grid of 3 columns and 2 rows. The FIRST attached picture is a photo of a pan taken from exactly overhead: copy its VIEW exactly: the camera straight down over the centre of the pan, the rim a perfect circle, the pan's floor a smaller circle exactly concentric with it, the inside wall an even ring of steel the same width all the way round, the brushed rings on the floor centred. Do not copy its handle or its shape. The SECOND attached picture is the pan from our game: copy its LOOK: the brushed steel, the black handle, the small pouring lip, the style; but not its slightly angled view.

In every cell the pan is the same size and the centre of its rim sits at the exact same point of its cell; the black handle points straight to the RIGHT, level, in every cell; the small pouring lip is on the LEFT, opposite the handle. The pan's rim is about 55% of the cell's height.
Row 1: (1) empty, clean steel, the brushed floor showing; (2) clear water just coming to the boil, small bubbles on the floor and a few rising, the floor seen through it; (3) the water with loose black tea leaves brewing, the water turned a deep amber-brown, leaves scattered through it.
Row 2: (4) milky chai, still, light caramel brown, matte, a faint skin; (5) the same milky chai at a rolling boil, a ring of pale foam and bubbles rising round the edge; (6) black tea, still, clear dark reddish-brown, slightly translucent at its edge.
The liquid in cells 2 to 6 fills the pan to the same level, its surface a circle concentric with the rim.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no gradient, no texture. NO shadows on the grey. Nothing touches a cell boundary. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PT1. The same pan tipping, seen from exactly above
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME pan as cell 4 of the first attached sheet (the same brushed steel, black handle pointing to the RIGHT, small pouring lip on the LEFT, full of milky tan chai), seen from DIRECTLY ABOVE, the camera fixed straight over the pan, six times in an invisible grid of 3 columns and 2 rows. In every cell the pan is the same size and the centre of its rim sits at the exact same point of its cell; the handle points right in every cell.

From cell to cell the pan tips the way a real pan pours: the handle end LIFTS toward the camera and the lip side DIPS away from it, turning about the line that runs from the top of the cell to the bottom through the pan's centre. Seen from above this means: the rim becomes an ellipse that is NARROWER from left to right while its height stays the same; the handle rises toward the camera, so it looks shorter and a little bigger; the inside wall on the handle side (the right) shows as a growing band of steel between the rim and the tea; the tea stays level, so it slides toward the lip on the left and its right edge moves away from the rim.
Row 1: (1) flat and level, 0 degrees: exactly as cell 4 of the attached sheet, the rim a full circle, the tea a full disc; (2) tipped 20 degrees: the rim about 94% as wide as it is tall, a thin band of inside wall on the right, the tea's surface moved a little to the left; (3) tipped 40 degrees: the rim about 77% as wide as it is tall, a wider band of inside wall on the right, the tea gathered toward the lip.
Row 2: (4) tipped 60 degrees: the rim only HALF as wide as it is tall, the inside wall showing across the right half of the pan, the tea pressed against the lip and just reaching it, not yet pouring; (5) as cell 4 and POURING: a short, thin tongue of milky chai curls over the lip and ends just past it, no longer than a fifth of the pan's width; NO long falling stream (the game draws that); (6) as cell 5 at the END of the pour: only a shallow pool of chai left against the lip, a thin trickle over the lip, most of the steel floor showing. Every cell must be clearly more tipped than the one before it across cells 1 to 4: four different ellipses.

The second, third and fourth attached pictures are photos of a real pan tipping and pouring, seen from the side: use them ONLY for how the pan tips (handle up, far rim down) and how the liquid leaves the rim as a thin sheet. Copy nothing else from them: no hand, no sink, no kitchen, no side view; the camera here is always directly above.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no gradient, no texture. NO shadows on the grey. Nothing touches a cell boundary. Do not draw grid lines.

Style: exactly as the first attached sheet: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PT2. The same six pans, black tea
```
Edit the attached sprite sheet of six milk pans. Keep EVERYTHING exactly as it is: the same six pans at the same sizes and places, the same tilt in each cell, the same handle, rim, inside wall, lip, the tongue of liquid in cell 5 and the trickle in cell 6, the same flat grey background, pixel for pixel where possible. Change only one thing: the liquid in every cell is now BLACK TEA, clear and dark reddish-brown, slightly translucent at its thin edges, instead of milky tan chai. Its surface, level and shape in each cell do not move.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### GL. The chai glasses exactly overhead
```
Generate an image, 1536×1024, landscape.

Three times the same small clear glass chai tumbler, seen from EXACTLY straight above. The FIRST attached picture is a photo of a glass taken from exactly overhead: copy its VIEW exactly: the camera straight down over the centre of the glass, the rim a perfect circle, the walls the same thickness all the way round, the round floor a smaller circle exactly concentric with the rim and centred, the vertical facets spaced evenly round like the spokes of a wheel, all the same length. The SECOND attached picture is the glasses from our game: copy their LOOK and style, not their view.

The same size and place in each third of the image, in a row: (1) empty, clean clear glass; (2) full of milky chai, light caramel brown, matte, a faint skin on top, the liquid's surface a circle concentric with the rim; (3) full of black tea, clear dark reddish-brown, the glass floor faintly seen through it. Each about 25% of the image wide; nothing touches an edge or another glass. No holder, saucer or tray.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture, NO shadows on the grey. Do not draw dividing lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal glass and liquid, soft global illumination, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### KT. The kitchen, decluttered
```
Edit the attached picture of a kitchen. Keep the camera, the framing, the light and the sunshine, the window, the arched door, the island in front with its marble top and its three wooden trays, and the cabinets EXACTLY where they are: the island's top edge must stay at the same height in the picture. Make it plain and clear:
- remove the hanging lamp from the ceiling, completely, with its cord;
- remove the three wooden shelves on the back wall;
- remove the gold pot on the counter and the framed hanging on the wall;
- the back wall behind the counter becomes one plain, pale tiled backsplash running all the way across, from the window to the arched door, up to about the height where the lowest shelf was;
- the cooker on the back counter is widened so it reaches out to the outer edges of the cabinets on either side of it, its hob and oven door wider to match;
- fill everything removed with the same plain warm wall, its light and shadows continuing naturally.
Nothing new is added: no plants, pictures, utensils, people or writing.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- **ST:** grid 3×2 on grey, `cell_align` on the rim; per cell the rim's centre and radius and the contents' radius into
  `cut-data.json`. Names: `pan-top-empty`, `pan-water`, `pan-leaves`, `pan-top-milk`, `pan-boil-milky`, `pan-top-black` (`-s14`), in
  assets/cook/items-s14/chai-pan/ (made at the cut). **Wiring:** `js/cook/stations/chai-tray.js` TOP and BREW8 point at them (one registration, so
  the brew states need no contents-circle crop); the lab's POT the same.
- **PT1, PT2:** as s12 (grid 3×2, `cell_align`, the lip's point per cell for the stream): `pan-tip-0`, `-20`, `-40`, `-60`,
  `pan-pour`, `pan-pour-end` (+ `-black`) in assets/cook/items-s14/chai-pan/ (made at the cut); FRAMES in `chai-tray.js` re-measured.
- **GL:** grid 3×1, `glass` + `soft_floor` as GL1; `glass-empty-top`, `glass-chai-top`, `glass-black-top` (`-s14`) in
  assets/cook/items-s14/glass/ (made at the cut); kept only if the judge finds the floor centred and the facets even (plainly better than s12's).
- **KT:** no key; upscaled as K1 to the 2100×1350 master, assets/cook/bg/service-master-v2.webp (made at the cut), its island edge measured against
  v1 (y 1058 on the master); if it moved, the game's anchors move with it. Every Cook order scene and the lab point at it.
- **Before main** (Zafar, 28 Oct): the cut, the lab with the new art, `labcheck.mjs`, his look; then the roll-out builder.
