# Sprint 8 fix art plan (pack `s08c`)

**Written:** 20 Oct 2026, from the fix list's open art rows (`docs/process/regressions.md`), the judges' lines of run `ev-20261019-172022-khk` (`build/tools/review/data/verdicts.json`), the builders' art lists (`build/reports/s08-w6b-stations.md`, `s08-w6c-clinic.md`) and contract-11's 162 gate breaks (`build/screenshots/sandbox/s08-gate-close/contract.md`). **Run spec:** `build/tools/art/specs/s08c.run.yaml`; the block is generated from it (`s08c-chrome-block.txt`); sources land in `sources/art/s08c/`. The doctor and the girl are real people: Zafar judges their likeness after the run, in chat; the runner keeps the first image that passes the checks and does not wait. **Amending (Zafar, 18 Oct):** after a failed try the runner may amend that prompt to fix what failed, logging the new text. Rules: `CLAUDE.md` 13 and 16; no text in any image, no sweets as rewards, modest clothing, no religious markers.

## 0. Totals

| Part | What | Images | Rows |
|---|---|---|---|
| **A** | Cook: the kadchi, the daal's stirred-in pieces, the teaspoon, the chai glasses from above, the chai pan tipping towards the player, the chai pan's brewing states, the sekelo tray, the sekelo decoy pieces, a seamless marble worktop | 9 | DAAR-02, DAAR-05, CK-06, CHAI-13, CHAI-08, CHAI-26, SEK-14, SEK-20, contract-37, contract-11, ART-05, SH-91 |
| **B** | Clinic: the crutches lying flat, the steel cup | 2 | CLN-23, ART-20, CLN-196 |
| **C** | The doctor turned three-quarter (with talk and blink), the girl's face for the zooms (mouth open; eyes, with sore and closed) | 7 | CLN-17, ART-19, CLN-163 (with CLN-185) |
| **D** | Nana, Ma and Ali's talk and blink frames, Ali's impatient face, the three waiting-room people seated | 10 | ART-19, ART-10, ART-23 |
| | **Total** | **28** | about 3.5 min an image with a quarter redone: about 2 h; part A about 40 min |

## 1. Flaws and uncertainties first

1. **Not drawn: the art has landed; it needs wiring, not a redraw.**
   - **ART-11, the potato:** `sources/art/s07/pt1-potato-v1.png`, cut to `assets/cook/items-s08b/potato/` (whole, halves, cube, pile) and never wired. Its cubes are matte and starchy, with the skinned whole and the halves beside them. Wire the pile, then judge.
   - **CLN-189, the lemon:** `assets/clinic/items-s08b/lemon-whole-s08b.webp` (bright yellow, pointed ends) is in `eye.js`, but the chart's pool still lists `lemon-half` and `assets/items/fruit/fru-02.png`. Repoint them and rerun the colour check.
   - **ART-10, Nani's moods:** her twelve faces (`sources/art/s08/nani-faces-v2.png`) and the counter set (`nani-{neutral,happy,talk,point,blink}-v3`) are cut and wired. The box shows one face because the code never swaps it. Ma's impatient face (`char-ma-impatient-v2`) frowns already. Only Ali's smirks, so only Ali's is redrawn (AL3).
   - **ART-19:** Nani (`nani-face-talk`, `nani-face-blink`, `nani-talk-v3`, `nani-blink-v3`), the girl (`girl-face-talk`, `girl-face-blink`, `girl-stand-face-*`) and the doctor (`doctor/v2/*-face-talk`, `-face-blink`) all have their frames. The judge saw no mouth move because the talk swap is not called. Only Nana, Ma and Ali lack frames (part D).
   - **ART-20 and CLN-106:** the level plaster in four colours is cut (`assets/clinic/sheets/plaster-level/`), and so are the drop machine and its levers (`assets/clinic/heal-v3/drop-machine-v3.webp`, `lever-up-v3.webp`, `lever-down-v3.webp`). `boing.json` still names the missing `drop-machine.webp` under `machine_s02`. The comb left the decoys in s07. So this is wiring, plus the `clinic-items.md` table. CLN-164's "more photorealistic" was said about the code stand-in, before DM1 was wired. Zafar judges DM1 in play first; DM3 is ready in the later batch.
   - **PAN-06, a full pantry:** `sources/art/pantry-v2/` already holds about 40 cut items: meat, mince, chicken and fish in clear tubs for the fridge, tall jars, spice jars, crates and a blank round sticker. The shelves fill from the decoy table (decision 88). The stickers are composed in code (decision 5 below).
   - **CHT-13, DAAR-29, DAAR-31, SH-106, CLN-175 to 193:** the s08b cuts are wired, or are in wave 6 (CH1-CH3, DP2, DP3, GO1, TH1, FN1, FV1, ED1, EC1, FT1, SP1, TB1, BD1). A judge's FAIL on them goes to the redo list after the wired version is judged.
   - **CLN-137, the girl's neutral face:** exists (`girl-stand-head-neutral`). **CLN-81 and CLN-150, the doctor:** the s08 set is wired. **CK-24:** solved in code by the calendar leaves (w6B).
2. **contract-11 (162 breaks: 113 marble, 25 hob, 24 wood) can't be fixed by ChatGPT alone.** Its largest picture is 1536×1024, and the `-1600` backgrounds are those pictures already enlarged. The breaks come from the code zooming a 16:9 picture to cover taller stages (`fitBg`, `js/cook/stations.js:155`): 3.84 at 1024×768, 5.12 at 1366×1024, 2.58 at 1180×820 and 1.59 at 1440×900, against a limit of 1.5. **Plan:** WT1 is one seamless marble tile. It is cross-faded at its seams (`artcut.py` `tile`), upscaled ×2 by `build/tools/art/upscale.py` to 3072×2048, and laid tiled at its own size, never zoomed, so a taller stage shows more marble (SH-91's own rule). The hob is cut from `bg-cook-hob-t-v1.png`, upscaled ×2 and laid on the tiled marble. The wood worktop is drawn in code (`js/cook/art.js` `worktop`), so code draws it at the screen's real size: no art. Expected: under 1.5 at every gate size, proved by contract-11 itself.
3. **Decisions for Zafar.** Answer "yes to all except …".
   1. **Sekelo's left column (SEK-14, SEK-20):** both holders are the same square matte steel tray (SK4): raw above, cooked below. The skewers stand upright, handles towards the child, as on the grill, at the rack's spacing (one material, one direction). The landed `tray-1..4` lie sideways with the skewers too close together for pieces. **Recommend yes**; square wooden racks (SK7) are in the later batch if he prefers wood.
   2. **The kadchi (DAAR-02):** on 15 Oct he said "leave the ladle". The judge reopened the row on 19 Oct (a measuring scoop, not a kadchi). Draw KD1 now (one image) and wire it only on his yes. **Recommend yes.**
   3. **Sekelo decoys (contract-37):** chicken (*murgi*), green chilli (*mirchi*) and corn on the cob (*makai*), all confirmed Kutchi. Chicken is L4's lookalike for the meat, chilli for the pepper. **Recommend yes.**
   4. **The chai pour (CHAI-26):** the pan tips towards the player in 20° steps (0, 20, 40, 60) and pours off its near rim into the glass below it. If that doesn't read, cell 5 alone is the fallback he named ("one static half-poured, half-turned"). **Recommend yes.**
   5. **Pantry labels (PAN-06, decision 88):** picture stickers are composed in code (the blank sticker plus each item's own icon) instead of drawn. This covers every item at once with no risk of text. **Recommend yes.**
4. **Uncertainties.**
   - The references come from ChatGPT's library. If the library doesn't list uploaded files (only generated ones), the runner can't attach them. It logs "needs Zafar" and skips, and Zafar attaches by hand.
   - CP3 is a hard view for ChatGPT (a pan tipping towards a top-down camera); it may come back with the CP1 sideways tilt. The amend rule names it.
   - WT1 may come back with seams or light streaks. The cross-fade fixes seams; streaks fail the check.
   - GZ1's mouth won't match `mouth-v2` pixel for pixel. The zoom cross-fades at the size where they meet, so a small mismatch reads as a soft dissolve.
   - The SK4 single tray is cut into tray-0 to tray-3 locally, by painting the skewers out from the right (brushed steel running parallel to the skewers keeps that clean). If the paint-out shows, a SK4 redo with 0-3 skewers is one edit each.
   - Corn kernels may read as beads (the sweets rule). The check names it.
5. **Later batch, not in this run (each ready to write on his word):** DM3, a photoreal drop machine in the plaster-packet look (CLN-164, after he sees DM1); SK7, square wooden racks (if decision 1 is no); PT2, potato cubes with a little skin (if PT1 fails when wired); DP2b, the daar pot exactly top-down (if w6B's even-ellipse rim still fails DAAR-31); GS2, the girl's sore face (s08 rejudge flaw 6); drawn pantry stickers (if decision 5 is no); the household nouns' pictures (CLN-38, once Mum's words are checked); the other five patients' states (CLN-65); the neck, back and hair parts (ART-12: design first).

## 2. How Zafar runs it

1. **Upload the references to one chat first.** In ChatGPT, start a new chat and rename it **Nani jo Ghar s08c references**. Upload these 36 files from the repo (several per message is fine) and send "References for later, no reply needed". The runner may not upload files; it attaches each one from ChatGPT's library.
   - Shared: `sources/art/style-anchor-v1.png`, `assets/clinic/items-v2/plaster-skin.webp`
   - Cook: `assets/cook/items/v3/daar/ladle-v3.webp`, `assets/cook/items-s08b/daar-discs/disc-daal-stirred-s08b.webp`, `sources/art/s07/dp1-daar-pieces-v1.png`, `assets/cook/items/chai-v2/teaspoon-t.webp`, `assets/cook/items-s08b/chai-pan/pan-top-milk-s08b.webp`, `assets/cook/items-s08b/chai-pan/pan-top-empty-s08b.webp`, `assets/cook/items/chai-v2/glass-full.webp`, `assets/cook/items/chai-v2/glass-black-full.webp`, `sources/art/s07/cp1-chai-pan-tilt-v1.png`, `assets/cook/items-s08b/sekelo-tray/tray-4-s08b.webp`, `assets/cook/items/v3/sekelo/rack-4.webp`, `assets/cook/items/v3/sekelo/grill.webp`, `sources/art/cook-v3/k4-pieces-v1.png`, `sources/art/cook-v3/k5-heaps-v1.png`, `assets/cook/bg/bg-cook-worktop-t-v1.png`
   - Clinic: `assets/clinic/sheets/decoys/crutches-belt.webp`, `assets/clinic/items-v2/tumbler.webp`
   - The doctor and the girl: `sources/art/s08/sheet-doctor-final-1.png`, `sources/art/s08/lineup-v4-1.png`, `sources/art/s08/doctor-front-neutral-v2.png`, `sources/art/s08/doctor-3q-left-neutral-v2.png`, `sources/art/s08/sheet-girl-v2-1.png`, `assets/clinic/closeups/girl/mouth-v2.webp`, `assets/clinic/closeups/girl/eyes-v2.webp`, `assets/clinic/rooms/cb6b-closeup-bed-blur-v1.webp`
   - The family and the waiting room: `sources/art/characters/char-nana-v1.png`, `sources/art/characters/char-ma-v1.png`, `sources/art/characters/char-ali-v1.png`, `sources/art/chatgpt-batch3/char-ali-impatient-v2.png`, `assets/clinic/patients/old-man/old-man-front.webp`, `assets/clinic/patients/old-woman/old-woman-front.webp`, and the three rough people as `auntie.webp`, `uncle.webp`, `baby.webp`, from `assets/clinic/rough/patients/{auntie,uncle,baby}/neutral.webp` (they share a file name, so rename each on upload)
2. **Paste the block** `docs/design-language/art-plans/s08c-chrome-block.txt` into Claude in Chrome, as is. It runs on his ChatGPT image allowance (no API spend); every part boundary is a safe stop.
3. **At the end** it downloads the kept images from ChatGPT's Library with a numbered "title → save as" list. Rename them from the list, push them with the log to `sources/art/s08c/`, and tell Claude. Claude judges, cuts and wires; he judges the doctor's and the girl's likeness in chat.

## 5. The prompts

#### KD1. The kadchi, top-down, its handle rising towards us
```
Generate an image, 1536×1024, landscape.

Two views of the SAME real Indian steel kadchi (a cooking ladle: a deep round bowl about the size of a small orange, joined to a long flat steel handle that rises at a steep angle), seen from DIRECTLY ABOVE, as a cook sees it standing in a pot of daal: the bowl at the bottom, its handle rising steeply up TOWARDS the camera and leaning to the RIGHT, so the handle looks SHORT and foreshortened, a little wider towards its end, which is nearest the camera and shows a small hanging hole. It is NOT a measuring scoop or a dipper with a flat handle lying level (the first attached picture is that wrong one).
LEFT: the kadchi clean and empty, the inside of its bowl softly shining.
RIGHT: the same kadchi at the same size and angle, its bowl full to the brim of smooth yellow daal exactly like the second attached picture, a little daal on the outside of the bowl.
Each about 35% of the image wide, the same height; nothing touches an edge or the other.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### DS1. The daal's pieces, stirred in
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: eight small loose scatters of food seen from DIRECTLY ABOVE, as they look AFTER they have been stirred into a pot of yellow daal and cooked in it, in an invisible grid of 4 columns and 2 rows, one scatter per cell, each filling about 55% of its cell, nothing touching a cell boundary. Do not draw grid lines. They are the foods of the first attached sheet, but cooked and stirred in: every piece soft, matte and coated in a thin film of the same smooth yellow daal as the second attached picture, so it looks half sunk in it; never fresh, raw, shiny or white, never beads or sweets.
Row 1: (1) about twelve small pieces of cooked onion, soft, translucent and golden, no white; (2) about eight small pieces of cooked-down tomato, soft and broken, deep red, a little red juice; (3) about six thin rings of cooked green chilli, soft and olive green; (4) about six small cubes of cooked potato, soft-edged and stained yellow.
Row 2: (5) a few soft pale golden pieces of chopped garlic; (6) a few fine soft golden shreds of ginger; (7) a sprinkle of about twenty whole cumin seeds, dark and soft; (8) a sprinkle of about twenty tiny dark brown mustard seeds.
Scale: a piece of onion about a fingernail.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, soft subsurface food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### TP1. The teaspoon for the sugar, top-down
```
Generate an image, 1536×1024, landscape.

Three times the SAME plain steel teaspoon as the first attached picture, lying flat, seen from DIRECTLY ABOVE, its bowl at the LEFT and its handle running level to the right, at the same size and height in each third of the image: (1) empty and clean; (2) heaped with white granulated sugar, the grains clear, a small neat heap; (3) a little milky chai, the colour of the second attached picture, lying in its bowl, the steel wet. Each about 25% of the image wide; nothing touches an edge or another.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### GL1. The chai glasses, from exactly above
```
Generate an image, 1536×1024, landscape.

Three times the SAME small clear glass chai tumbler as the first attached picture, seen from EXACTLY straight above (the rim a perfect circle, the walls equally thick all round, the round floor centred), at the same size and place in each third of the image: (1) empty, clean clear glass; (2) full of milky chai, light caramel brown, matte, a faint skin on top; (3) full of black tea, clear dark reddish amber, the glass floor faintly seen through it. The second attached picture shows the black tea from the SIDE, which is the wrong view: draw it from above like the first. Each about 25% of the image wide; nothing touches an edge or another.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal glass and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### CP3. The chai pan tipping towards the player, then pouring
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME small brushed-steel milk pan as the first attached picture (its black handle to the right, a small pouring lip at its left), full of milky tan chai, seen from DIRECTLY ABOVE, six times in an invisible grid of 3 columns and 2 rows, at the same size and place in every cell. From cell to cell the pan tips TOWARDS THE VIEWER (towards the bottom of the image), turning about the line of its handle, about 20 degrees more each time, so we see it turn: its near rim dips away from us, its far rim rises towards us, the round rim becomes a flatter and flatter ellipse and more of the pan's outside wall shows above it; the chai stays level, so it slides towards the near (bottom) rim and its surface narrows there.
Row 1: (1) flat and level, 0 degrees; (2) tipped 20 degrees; (3) tipped 40 degrees.
Row 2: (4) tipped 60 degrees, the chai right at the near rim, not yet pouring; (5) as cell 4 and POURING: one smooth stream of milky chai falls from the middle of the near rim straight down towards the bottom of the cell; (6) exactly as cell 5 but the pan and the stream hold clear dark reddish-brown black tea.
The handle points to the right in every cell. The second attached picture tips the pan the WRONG way (sideways, towards its lip): do not copy its angle. Nothing touches a cell boundary. Do not draw grid lines.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### CP4. The chai pan's brewing states, top-down
```
Generate an image, 1536×1024, landscape.

Three times the SAME small steel milk pan as the attached pictures, flat and level, seen from EXACTLY straight above, at the same size and place in each third of the image, its black handle to the right: (1) water just coming to the boil: clear water over the steel floor, a ring of small real bubbles rising at its edge; (2) the tea brewing: the water turned a deep clear reddish amber, loose black tea leaves swirling in it; (3) milky chai at a rolling boil: light caramel brown, a ring of fine pale foam round the edge and a few soft bubbles. Real liquid with depth and soft reflections, never flat colour, never drawn circles or rings. The rim a perfect circle. Nothing touches a boundary. Do not draw dividing lines.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### SK4. The sekelo tray: square, matte, four upright skewers
```
Generate an image, 1024×1024, square.

ONE square tray of matte brushed steel, the same tray as the first attached picture, seen from DIRECTLY above, about 70% of the image wide, in the upper part of the image, its brushing running in straight lines from top to bottom. On it, FOUR bare bamboo skewers exactly like the attached ones, no food, standing UPRIGHT in the picture: straight, parallel, running from top to bottom, evenly spread across the tray at one fifth, two fifths, three fifths and four fifths of its width (the same spacing as the skewers on the attached wooden rack), their pointed tips near the tray's top wall, their wooden handles running past the tray's BOTTOM edge into the grey below, towards us. A soft contact shadow under each skewer on the steel. Less shiny than the attached grill. Nothing touches an image edge.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### SK5. Sekelo decoys: chicken, green chilli, corn
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: twelve things in an invisible grid of 4 columns and 3 rows, one per cell, each filling about 60% of its cell, nothing touching a cell boundary. Do not draw grid lines. Each ROW is one food for skewers, drawn exactly like the attached chunks and heaps (the same size, light and finish): column 1 a small loose heap of it in raw chunks, top-down, like the second attached sheet; columns 2, 3 and 4 ONE chunk of it seen from directly above: raw, then grilled (golden with dark grill stripes), then charred (darker and blackened at the edges, still its own colour), like the first attached sheet.
Row 1: chicken: boneless, skinless chicken breast in cubes, pale pink when raw, golden when grilled.
Row 2: green chilli: a short length of a fat whole green chilli, long, narrow and round like a tube, NOT a flat square like a pepper piece.
Row 3: corn on the cob: one thick round slice of a corn cob, matte yellow kernels round a pale core, seen from above.
Every chunk the same size as the attached chunks.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached pictures and the style anchor: a stylised 3D animated-feature-film look, soft subsurface food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### WT1. The marble worktop: a seamless tile
```
Generate an image, 1536×1024, landscape.

A seamless, tileable texture filling the whole image edge to edge: a top-down view of a pale cream marble kitchen worktop, exactly like the attached one (the same cream ground, the same soft warm amber-gold veins at the same scale), lit perfectly evenly with NO sunbeams, light streaks, shadows, vignette or bright corners, so it can repeat. Its left and right edges match exactly, and its top and bottom edges match exactly: tiled side by side or one above the other, no seam shows. Nothing lies on it.

Style: as the attached worktop: semi-photoreal polished stone, soft and even, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### CR1. The crutches, lying flat on the belt
```
Generate an image, 1536×1024, landscape.

One pair of wooden underarm crutches, the same as the attached, lying FLAT side by side as if just put down on a conveyor belt, seen from the front and about 20 degrees above, their length running straight from left to right and level: the padded grey tops at the left, the grey rubber feet at the right. Both crutches touch the surface along their whole length (the pads, the hand grips and the feet all down); nothing raised, tilted, leaning or floating. About 80% of the image wide, centred. No surface drawn and no shadow (the game adds them).

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### TC1. The steel cup, standing on its base
```
Generate an image, 1024×1024, square.

One plain brushed-steel drinking cup, a straight-sided tumbler like the attached one, empty, standing upright on its flat base, seen from the front and a little above (about 20 degrees), so the inside wall and its round floor show through the open top and the rim is an ellipse; level, not tilted. NO shadow of any kind: no drop shadow and no contact shadow (the game adds it). About 50% of the image wide, centred.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: as real-looking as the attached plaster packet (the game's item boxes): believable materials and fine surface detail, soft even light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

#### DW2. The doctor turned three-quarter to the viewer's left (a redraw of his face-on base)
```
Generate an image, 1024×1536, portrait.

Three pictures are attached: first, his face-on STANDING picture (grey background), which is the base; second, his approved character SHEET, whose turnaround panels show him turned; third, the same man turned only slightly, which is NOT turned enough.

Draw the man of the first picture again, changed in nothing but his turn: a true three-quarter turn, about 45 degrees, to the viewer's LEFT, as if standing beside a child sitting on a bed to the left of him: his chest, hips and both feet point to the lower left of the picture, his far shoulder partly behind him, his head turned with his body, looking to the viewer's left and a little down, at a child's head height. Much more turned than the third picture. Both arms stay relaxed at his sides, hands open and loose, nothing in his hands, the same gentle neutral face with a small kind smile, mouth closed. The figure at the same size as the first picture, his feet on the same invisible level at the same height, his head at the same height, nothing touching an edge, no floor, no shadow on the grey. Drawn, not flipped: the watch stays on his LEFT wrist. Everything else identical to the first picture: the same face and eye size, skin, hair and beard, glasses, simplified clothes (plain navy blazer with a faint check, white open shirt, charcoal trousers, brown belt and shoes), the same smooth stylised hands with five fingers, the same rendering, the same light from the upper left and the same grey.

Skin: exactly hex #C88A6F in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DT2. The doctor talking (an edit; attach that one image only)
```
Edit the attached image. Change only his mouth: open it a little as if saying a word, the teeth just showing. Every other pixel identical: the same pose, size, position, clothes, hands, skin colour, light and background.
```

#### DB2. The doctor blinking (an edit; attach that one image only)
```
Edit the attached image. Change only his eyes: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: the same pose, size, position, clothes, hands, skin colour, light and background.
```

#### GZ1. The girl's face, mouth open "aah" (the tooth zoom's middle step)
```
Generate an image, 1536×1024, landscape.

Four pictures are attached: her approved character SHEET; the LINEUP of three people, where she is the girl on the RIGHT; a close-up of her open mouth; and the clinic's soft, out-of-focus background. The sheet and the lineup are the only authority on who she is and how she is rendered.

Draw her sitting on the clinic bed, seen close: her head and shoulders, front-on, from just below her shoulders to just above the top of her hair, her face centred, about 55% of the image height. Her mouth is wide open as if saying "aah" for the doctor, showing her clean white top and bottom teeth and her tongue: exactly the lips, teeth and tongue of the third picture, at this smaller size. Her eyes open and calm, looking at us. Her yellow dress and her plaits with white bows, exactly as the sheet. Behind her, the fourth picture's soft out-of-focus clinic room fills the background.

Rendered exactly as the sheet and the lineup: the face at their level of likeness with the same big, open brown eyes; matte smooth skin with soft shading, no pores; soft warm light from the upper left; no outlines.

Skin: exactly hex #DA956C in the light, the sheet's skin swatch; never lighter, paler or pinker, never orange, never darker. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur on her (the background only is soft).
```

#### GZ2. The girl's face for the eye game, less close
```
Generate an image, 1536×1024, landscape.

Four pictures are attached: her approved character SHEET; the LINEUP of three people, where she is the girl on the RIGHT; the eye close-up the game uses now, which is TOO close (it cuts off her brows and fills the frame with two huge eyes); and the clinic's soft, out-of-focus background. The sheet and the lineup are the only authority on who she is and how she is rendered.

Draw her face close but calm, front-on: from her chin to just above the top of her head, her brows, forehead, fringe and hairline all in view, her face filling about 85% of the image height, the background showing at the sides. Her eyes WIDE open, calm, looking straight at us: the same big brown eyes as the third picture, but the two of them together only about 40% of the image wide. Mouth closed in a small, calm smile. Behind her, the fourth picture's soft out-of-focus clinic room.

Rendered exactly as the sheet and the lineup: the face at their level of likeness; matte smooth skin with soft shading, no pores; soft warm light from the upper left; no outlines.

Skin: exactly hex #DA956C in the light, the sheet's skin swatch; never lighter, paler or pinker, never orange, never darker. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur on her (the background only is soft).
```

#### GZ3. Her sore eye (an edit; attach that one image only)
```
Edit the attached image. Change only her LEFT eye (on the viewer's RIGHT): make it a little sore: the white faintly pink, the lower rim pink and slightly watery. The eye stays fully OPEN, as open as the other one (never a wink). Every other pixel identical: the other eye, the brows, the face, the hair, the size, position, skin colour, light and background.
```

#### GZ4. Her eyes closed (an edit; attach that one image only)
```
Edit the attached image. Change only her eyes: both eyes gently closed, the lids relaxed, the lashes resting, the brows unchanged. Every other pixel identical: the face, the hair, the size, position, skin colour, light and background.
```

#### FT. Talking (an edit of a family sheet; attach that one image only)
```
Edit the attached image. Change only the mouth of {WHO}: open it a little as if saying a word, the teeth just showing. Every other pixel identical: every other panel and figure, the pose, size, position, clothes, hands, colours, light and background.
```

#### FB. Blinking (an edit of a family sheet; attach that one image only)
```
Edit the attached image. Change only the eyes of {WHO}: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: every other panel and figure, the pose, size, position, clothes, hands, colours, light and background.
```

#### AL3. Ali impatient, not smug (an edit; attach that one image only)
```
Edit the attached image. Change only the boy's face: make him look impatient, not smug: his brows drawn down and together, his mouth a small flat line pushed a little to one side, no smile and no smirk, his eyes glancing off to the side as if waiting. Every other pixel identical: his folded arms, pose, size, position, hair, clothes, colours, light and background.
```

#### WS. A waiting-room patient, seated front (the line says who)
```
Generate an image, 1024×1536, portrait.

Three pictures are attached. The first is who this is (their face, clothes and colours), drawn in an old, WRONG style (a big head and a clay look). The second and third are two other patients drawn in the RIGHT style: copy their style, finish, proportions and size exactly.

Draw {PERSON}, sitting on an invisible bench seen from the front, full figure, both hands resting on the knees, both feet flat on an invisible floor, a calm small smile, looking at us. Natural proportions as in the second and third pictures (a normal-sized head, never a big round head), the same soft 3D animated-film rendering, smooth stylised hands with five fingers, modest clothes covering the arms and legs. The figure about 80% of the image height, centred, at the same scale as the second and third pictures; no bench, stool or floor drawn; nothing touches an edge.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. NO shadows on the grey.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No religious images or markers.
```

## 6. Cut and wire notes

- **KD1:** the left cell becomes the ladle (the handle stub points outward and is turned radially by code, decision 94); the right cell is the stir frame. It replaces `ladle-v3` only on his yes (decision 2).
- **DS1:** eight scatters cut per cell into `cook/items-s08c/daar-in/`. Code lays the scatter of each thing that went in on the turning disc after the stir and drops DP1's raw pieces (DAAR-05; DAAR-16: only what went in).
- **TP1:** the spoon in the stir is cell 3; the scoop is cell 2. It replaces the code-drawn spoon (CHAI-13).
- **GL1:** replaces `glass-empty`, `glass-full` and the side-on `glass-black-full` with one set from above (CHAI-08).
- **CP3:** frames 0, 20, 40 and 60 then the pour, played by code over the glass below the pan (CHAI-26); the black-tea pour is cell 6. **CP4:** the brewing states, cross-faded in code on CP2's pans (CK-06), with no drawn bubble rings.
- **SK4:** cut as `tray-4`; `tray-0` to `tray-3` are made locally by painting out the skewers from the right. The landed `tray-1..4` are kept as spares. The white specks on `tray-2`/`tray-4` are holes in the old cut, gone with this one. Re-measure the skewer lines into `meta.json` (`build/measure_sekelo_v3.py`); the same picture serves both holders (decision 1).
- **SK5:** each row is cut to heap, raw, grilled and charred, as `v3/sekelo` names them (`chicken-*`, `chilli-*`, `corn-*`), and added to `thread.levels[0].decoyPool` (contract-37). Chicken is the L4 lookalike.
- **WT1:** cross-fade the seams (`artcut.py` `tile`), then `upscale.py` ×2 to 3072×2048 → `bg-cook-worktop-tile-v1.webp`. `fitBg` tiles it at 0.5 design px per source px for marble and hob; the hob is cut from `bg-cook-hob-t-v1.png`, upscaled ×2 and drawn on it. Rerun contract-11 at every gate size.
- **CR1:** replaces `crutches-flat-belt` (CLN-23). **TC1:** replaces the s08b glass in taste (CLN-196, Zafar 19 Oct); re-measure its rim and inside for `taste.json`.
- **DW2, DT2, DB2:** the 3q-left set for the diagnosis beside the bed (CLN-17), registered on DW2 by `expressions.py`'s paste-back.
- **GZ1, GZ2:** the zooms' middle step (room → her front → GZ → the close-up), cross-faded where the sizes meet (CLN-163). GZ2 with GZ3 and GZ4 becomes the eye game's main view, less close (CLN-185).
- **FT and FB lines, AL3:** cut with `build/cut_characters.py`'s boxes, with only the changed face pixels pasted back. **WS lines:** cut like `old-man-front` (`s07.cut.json`). `waiting.js` swaps out the rough sprites; their colour variants are recoloured in code, as the old man's are.
