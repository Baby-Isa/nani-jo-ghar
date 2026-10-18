# Sprint 8 object art plan (pack `s08b`)

**Written:** 18 Oct 2026, from Zafar's play-tests of 17 Oct (`docs/feedback/cook-playtest-2026-10-17.md`) and 18 Oct (`docs/feedback/clinic-playtest-2026-10-18.md`) and his "yes to all" of 18 Oct. **Run spec:** `build/tools/art/specs/s08b.run.yaml`; **paste block:** `docs/design-language/art-plans/s08b-paste-block.txt` (generated); sources land in `sources/art/s08b/`. Zafar runs it himself in ChatGPT on his daily allowance; nothing here is a real person, so there is no approval gate.

## 0. Totals

| Part | What | Images | Rows |
|---|---|---|---|
| **A** | Cook: chaat bowl side-on and ten layers, the daar pot top-down and its contents, the chai pan top-down, the sekelo square tray, the go-on pictures, the pastry tile | 9 | CHT-13, DAAR-29, DAAR-31, CHAI-08, CHAI-25, SEK-20, SH-106, SAM-21 |
| **B** | Clinic: thermometer, ceiling fan, fever bed things, bandage band, toothbrush, eye drops, the optician's wall, a whole lemon, the sole's leg, splinter channels, the glass and bud | 11 | CLN-175, CLN-105, CLN-179, CLN-180, CLN-186, CLN-188, CLN-189, CLN-192, CLN-193, CLN-195, CLN-196 |
| | **Total** | **20** | about 3.5 min an image, a quarter redone: about 1 h 30 in all; part A about 40 min |

## 1. Flaws and uncertainties first

1. **Art already drawn but not wired (no new line; wire first):** the drop machine and its levers (`sources/art/s07/dm1-*`, `dm2-*`, CLN-164), the chai pan's tilts (`cp1-*`, CHAI-26: wire and try before any redraw, as Zafar said "try that once or twice"), the daar pieces (`dp1-*`), the potato (`pt1-*`), the kitchen master (`k1-*`), the syringe and cloth sheets (`assets/clinic/sheets/`), the open tweezers, the kidney tray (`assets/clinic/sheets/bin/bin-kidney-3q.webp`, CLN-174).
2. **Cut-outs:** the eye bottle, the foot's toes, the tweezers and the thermometer fail because the cutter keys steel and glass badly (SH-115). FT1 fixes the foot's gaps at the source; the rest need the tool fix, not new art.
3. **"Photorealistic":** the clinic lines match the plaster packet (real materials, fine detail), the Cook lines the style anchor; neither asks for a photograph.
4. **The tooth's smooth zoom** (CLN-163) needs no ChatGPT line: one hi-res close-up upscaled on our side (`build/tools/art/upscale.py`).
5. **The eye chart's pictures** stay the game's own item pictures, code-placed on EC1's blank board in rows 1-2-3-4.
6. **The two racks for sekelo** reuse today's rack twice; the grill is scaled in code (Zafar: "let's keep the barbecue style").

## 2. How Zafar runs it

For each line, in order: a fresh ChatGPT chat; attach exactly the files the line names (from the repo; the block lists their links); paste the prompt from section 5 as is; if it fails the check (section 3 of the block), say "try again, same prompt" once; save the keeper with ChatGPT's download button under the line's save name. Every part boundary is a safe stop. Send me the downloads; I judge, cut and wire.

## 5. The prompts

#### CH1. The chaat bowl, exactly side-on, empty
```
Generate an image, 1536×1024, landscape.

One clear glass serving bowl, the same shape as the attached chaat bowl, seen EXACTLY from the side at the height of its middle, so its rim is ONE straight horizontal line and no ellipse of the rim or the floor shows at all (this replaces the attached, slightly top-down view). Straight, slightly flared sides, a short foot; empty; clean clear glass with soft highlights. Centred, about 60% of the image wide, clear grey all round.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### CH2. Chaat layers, sheet A: five side-on strips
```
Generate an image, 1024×1536, portrait.

A sprite sheet for a cooking game: FIVE horizontal strips stacked from top to bottom with clear grey between them, each strip the same width (about 80% of the image) and about 12% of the image tall, each one LAYER of food as it looks through the side of a clear glass bowl, seen exactly side-on: no bowl drawn, just the band of food with a flat top and bottom. Top to bottom: 1 boiled potato cubes, pale cream, matte; 2 boiled chickpeas, beige, matte; 3 finely chopped red onion; 4 finely chopped red tomato; 5 smooth white yogurt.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### CH3. Chaat layers, sheet B: five side-on strips
```
Generate an image, 1024×1536, portrait.

A sprite sheet for a cooking game, exactly like a sheet of five horizontal side-on layers: FIVE horizontal strips stacked from top to bottom with clear grey between them, each the same width (about 80% of the image) and about 12% of the image tall, each one LAYER of food as seen through the side of a clear glass bowl, exactly side-on, no bowl drawn. Top to bottom: 1 dark brown tamarind chutney, glossy; 2 bright green coriander chutney; 3 crunchy yellow sev (thin fried noodles); 4 chopped fresh green coriander leaves; 5 thin rings of green chilli.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### DP2. The daar pot, exactly top-down, empty
```
Generate an image, 1024×1024, square.

The SAME steel cooking pot as the attached, seen from EXACTLY straight above, the camera over its centre: the rim a perfect circle, the walls equally thick all the way round, the floor a centred circle; its two side handles left and right, level. Empty and clean. Centred, about 75% of the image wide.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### DP3. The daar pot's contents: six discs
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: SIX perfect circles of pot contents seen from exactly straight above, all the SAME size, in an invisible grid of 3 columns and 2 rows, each filling about 75% of its cell; no pot, no rim, just the round surface of what is inside: 1 raw yellow lentils under water; 2 plain cooked yellow daal, smooth; 3 daal with chopped onion and tomato stirred in; 4 daal with a tadka on top (cumin seeds, a few curry leaves, one dried red chilli); 5 daal stirred, a gentle swirl; 6 finished daal with a little chopped coriander on top. Do not draw grid lines.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### CP2. The chai pan on the hob, exactly top-down
```
Generate an image, 1536×1024, landscape.

Three times the SAME small steel milk pan as in the first cell of the attached sheet, from EXACTLY straight above, at the same size and place in each third of the image, its handle pointing to the right: 1 empty; 2 full of milky chai, light caramel brown; 3 full of dark black tea. The rim a perfect circle, the walls equally thick all round. Do not draw dividing lines.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### SK3. The sekelo tray: square, matte, 1-4 skewers
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: four times the SAME SQUARE tray of matte brushed steel, LESS shiny than the attached grill, seen from directly above, at the same size and place in each cell of an invisible 2 by 2 grid (this replaces the attached oval plate). On the trays, bare skewers exactly like the attached ones, no food, lying STRAIGHT and PARALLEL left to right, handles to the RIGHT past the tray's right edge: cell 1 ONE skewer, cell 2 TWO, cell 3 THREE, cell 4 FOUR, close together and evenly spaced. A soft contact shadow under each skewer on the steel. Do not draw grid lines.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### GO1. The go-on button pictures: grill and karahi
```
Generate an image, 1536×1024, landscape.

Two small icons for buttons, side by side, the same size, each whole and clearly readable when small: LEFT a small charcoal grill like the attached one, seen three-quarters from above, glowing coals; RIGHT a deep iron karahi wok with THICK, clearly drawn loop handles on both sides, seen three-quarters from above, hot oil inside. Each about 40% of the image wide.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### SM1. Samosa pastry: a seamless tile
```
Generate an image, 1536×1024, landscape.

One flat, wide rectangle of thin raw samosa pastry, seen from straight above, as the pastry in the attached picture: pale cream, a faint flour dusting, a few fine wrinkles; even light, no fold, no filling. It must tile seamlessly left to right: its left and right ends match exactly. About 90% of the image wide, about 40% tall.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### TH1. A real thermometer, two views
```
Generate an image, 1536×1024, landscape.

Two views of the SAME modern white digital oral thermometer for children (white plastic body, a thin silver tip, a small grey display with NO numbers): LEFT lying flat as a tool, seen from a little above; RIGHT at the angle it sits in a child's mouth, tip to the left, tilted down about 15 degrees. The same size in both. It replaces the attached glass thermometer.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### FN1. The ceiling fan, seen from below
```
Generate an image, 1024×1024, square.

One white ceiling fan seen from DIRECTLY BELOW, as you see it lying in bed looking up: the round central motor housing in the middle, three long blades spread evenly around it like a three-pointed star, a short rod up to the ceiling hidden behind the housing. The attached picture is the wrong view; draw it from below. Centred, about 85% of the image wide.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### FV1. Fever things lying on a bed
```
Generate an image, 1536×1024, landscape.

A sprite sheet: four things each lying FLAT on a soft surface as if on a bed, seen from the front and a little above, in an invisible 2 by 2 grid: 1 a red rubber hot-water bottle with a knitted cover; 2 a blue gel ice pack; 3 a folded paper hand fan; 4 a folded light blue blanket. Each with a soft contact shadow under it on an implied surface, but NO bed or cloth drawn; the same scale. Do not draw grid lines.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### BD1. The knee bandage: a seamless band and its end
```
Generate an image, 1536×1024, landscape.

Two things: TOP a long straight band of cream crepe bandage, about 90% of the image wide, seen straight on, its woven crinkled texture clear, its left and right ends matching so it repeats with no seam; BELOW it a short piece of the same bandage ending in a neatly folded end with a small metal clip. The same width and colour as the attached roll.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### TB1. The toothbrush, the right way round
```
Generate an image, 1536×1024, landscape.

One child's toothbrush, seen from the side and a little above, lying level: the BRISTLES at the LEFT end, facing left towards where the teeth would be; the HANDLE running to the right, its back facing up and right, smooth, NOT twisted (the attached picture is wrong: its bristles and the back of its handle point the same way). A light blue handle, white bristles. About 75% of the image wide.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### ED1. Eye drops: real drops
```
Generate an image, 1536×1024, landscape.

Three things, left to right, the same scale: 1 a single clear water drop hanging from the tip of a small white dropper nozzle; 2 a single clear drop falling, its classic teardrop shape, with a soft highlight; 3 a tiny clear splash. Real water, transparent, never a glossy ball or a sweet.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### EC1. The optician's wall with an empty eye chart
```
Generate an image, 1024×1536, portrait.

A calm optician's room wall filling the whole image: soft pale blue-grey paint, a hint of a skirting board at the very bottom, softly out of focus towards the edges. On it, centred, ONE white eye-test board in a thin pale frame, taking about 70% of the image height and 60% of its width, lit evenly. The board is BLANK: no letters, no pictures, no lines, no icons. Nothing else.

Style: as the style anchor: a stylised 3D animated-feature-film look, soft global illumination, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### LM1. A whole lemon
```
Generate an image, 1024×1024, square.

One whole, uncut, bright YELLOW lemon with pointed ends and a dimpled peel, lying on its side, seen from the front and a little above; a soft contact shadow under it. It must never read as an orange (the attached orange-gold half is the wrong one). Centred, about 60% of the image wide.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### FT1. The sole, its leg running off the bottom (an edit)
```
Edit the attached picture. Change ONLY two things: the leg now continues smoothly off the BOTTOM edge of the image (no cuff edge, no straight cut line where it ends); and the gaps between the toes are the same flat background as around the foot, with no grey wedges. Everything else stays exactly the same: the same foot, toes, skin, size, position, light and background. Keep the picture exactly the same size and shape (aspect ratio).

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### SP1. Splinter channel tiles and the splinter
```
Generate an image, 1536×1024, landscape.

A sprite sheet in an invisible 2 by 2 grid, all at one scale, for a game where a splinter slides out along a channel under the skin of the attached foot: 1 a STRAIGHT piece of channel: a slightly raised, irritated, pinkish-red welt under the skin, translucent, its two ends cut straight so pieces join end to end; 2 the same channel turning a 90-degree corner, ends cut straight; 3 the channel's end, rounded; 4 a small wooden splinter, a thin pale brown sliver with a pointed tip. Skin coloured to match the attached foot. Mild and clean, never a cut or a wound. Do not draw grid lines.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### TS1. The taste game: a glass and a clean bud
```
Generate an image, 1536×1024, landscape.

Two things the same scale: LEFT one clear glass tumbler, empty, seen from the front and a little above (in place of the attached steel cup), a soft contact shadow under it; RIGHT one clean white cotton bud lying flat, both tips fresh and white, nothing on them (in place of the attached green-tipped one).

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

## 6. Cut and wire notes

CH2-CH3 are cut per strip and laid in code as the bowl fills; DP3's discs turn under the still rim (DAAR-29); SK3's cells replace the plate; GO1 goes into the shared go-on button with its arrow; SM1 and BD1 are laid by code along the fold and the wrap; SP1's pieces are joined along each path; FT1 replaces `sole-v2`.
