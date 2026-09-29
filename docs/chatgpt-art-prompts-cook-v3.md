# ChatGPT art prompts: Cook v3, from Zafar's play-test (29 Sept)

Everything Cook needs from `docs/feedback/cook-playtest-2026-09-29.md`, in one run: 27 prompts. Free (ChatGPT). The order matters: the hob prompts H2–H6 attach the H1 picture you made.

**Prompts built on a decision** use Claude's recommended answer (report §10): T1–T2 (chaat fully side-on, Q2b), S1 (the cone fold, Q3), S5 (top-down fillings, no bowls, Q2a), M5 (both turners drawn; Zafar picks, Q15). If Zafar decided otherwise, Claude edits this page before it's pasted.

## Paste this one block into Claude in Chrome
```
You're making 27 images in ChatGPT for a children's game called Nani jo Ghar, then uploading them to GitHub yourself. Work through these steps in order, and don't change any ChatGPT, GitHub or Chrome settings.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/main/docs/chatgpt-art-prompts-cook-v3.md and read the whole page. It has 27 prompts in this order: H1, H2, H3, H4, H5, H6, A1, C1, M1, M2, M3, M4, M5, D1, D2, T1, T2, S1, S2, S3, S4, S5, K1, K2, K3, K4, K5. Each is in a grey code box, followed by "attach", "save as" and "check" lines.

2. Download the reference images listed under "Reference images" on that page. Open each link and click its "Download raw file" button (the download-arrow icon at the top right of the image).

3. In ChatGPT (chatgpt.com), for each prompt in order: start a new chat, attach the files its "attach" line names (where it says "your H1 image", attach the H1 picture you downloaded earlier in this run), paste the text of its code box exactly as written, and send. When the image arrives, compare it against its "check" line.
   - If it passes, download it straight away with ChatGPT's own download button (never a screenshot), before moving on.
   - If it fails, reply once saying which check it failed and ask for a corrected image. If that fails too, start a fresh chat and try once more (at most 2 retries per prompt). Then download the best one and note what's wrong with it.
   - Download only the one image you keep for each prompt, so there are exactly 27 downloads.

4. Upload the 27 images to GitHub yourself. Open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/cook-v3 and drag in the 27 downloaded files. Rename nothing on GitHub. Type this commit message: "Cook v3 art from the 29 Sept play-test (ChatGPT, 27 images)". Choose "Commit directly to the main branch" and click "Commit changes". Check the folder page then lists all 27 files.

5. Tell me, in prompt order: the prompt (H1 … K5), the file name as uploaded, and pass, or what's wrong with it.
```

**What happens next:** Claude matches the uploads to the prompts (by the pictures), renames them to the "save as" names, and cuts them (the cut_tick_v2 method, `docs/VISUAL-QA.md` §2, plus the grey-leftover check). Then the hob family goes into `Cook.Kit` and every station gets it at once.

## Reference images
- Style anchor: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png
- Current hob (2 burners): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/chai-v2/hob-2-burner-t.webp
- Chai saucepan (top-down): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/chai-v2/pan-top.webp
- Nani: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/characters/nani-sheet-v2-approved.png
- Nana: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/characters/char-nana-v1.png
- Ma: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/characters/char-ma-v1.png
- Ali: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/characters/char-ali-v1.png
- Isa: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/characters/char-isa-v1.png
- Dough ball (wheat): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/dough-ball-t.png
- Dough ball (millet): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/dough-bajr-ball-t.png
- Chakla: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/tool-chakla-t.png
- Velan: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/tool-velan-t.png
- Maani (wheat, half-cooked): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/maani-cooked-half-t.png
- Maani (millet, half-cooked): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/maani-bajr-cooked-half-t.png
- Tawa: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/vessel-tawa-t.png
- Current chimta: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/maani-v2/chimta.webp
- Daar pot: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/vessel-pot-t.png
- Ladle: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/tool-ladle-t.png
- Chaat glass bowl (current): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/chaat-v2/glass-bowl.webp
- Pantry jars (side-on style): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/pantry-v2/pantry-v2-sheet1-tall-jars.png
- Samosa (current fold): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/samosa-v2/stage-3.webp
- Karahi: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/samosa-v2/karahi.webp
- Enamel plate: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/plate-enamel-empty-t.png
- Slotted spoon: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/tool-slotted-spoon-t.png
- Chundo heap (top-down): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/samosa-v2/top-ph-keema.webp
- Grill (jiko): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/grill-jiko-t.png
- Skewer rack: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/vessel-skewer-rack-t.png
- Skewer: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/skewer-empty-t.png
- Grilled meat piece: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/mishkaki-meat-grilled-t.png

**Rules on every image:**
- Flat mid-grey `#808080` background, no floor, no cast shadows, no text, numbers, letters or logos.
- Each thing centred in its own cell with clear grey all round it, never touching the edge.
- **"Top-down" means straight down from directly above, like a photo taken from the ceiling:** round things are perfect circles, never ellipses.
- **Registration:** where a sheet shows one object in several states, it is the same object at exactly the same size and position in every cell; only the contents change.
- **Style:** the attached style anchor (stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines).

---

## H. The hob family (every station's stove)
### H1. The master hob: two burners
```
One image for a children's game, 1536x1024 landscape, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
A modern built-in gas hob seen straight down from directly above (a ceiling photo: every burner is a perfect circle). Two burners side by side on a matte charcoal-black glass top. Each burner: a brass cap in the middle, a black ring round it, and a heavy black cast-iron pan support with four arms. Leave generous space between the two burners (about half a burner's width) and a plain strip of black glass along the front (the bottom of the image), about a third of the hob's depth, for the controls; no knobs are drawn.
The hob has a thin polished silver frame all the way round: EXACTLY the same thickness on all four sides, perfectly straight edges, and four identical, gently rounded corners, clean and undented. The whole hob is perfectly symmetrical left to right and fills about 85% of the image width, centred.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `hob-2-burner-t.webp`
**save as:** `sources/art/cook-v3/h1-hob-2-v1.png`
**check:** straight-down view with perfectly round burners · silver frame the same thickness on all four sides, straight and undented, four identical corners · plain black strip along the front · no knobs · flat grey background.

### H2. One burner
```
Using the attached hob as the exact design, draw the same hob with ONE burner, for a children's game: 1024x1536 portrait, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above. Exactly the same materials, burner, pan support, brass cap, black glass and polished silver frame as the attached hob: the burner is the same size as one of its burners, centred left to right with the same margin round it, and the same plain black strip along the front for the controls. The frame is exactly the same thickness on all four sides, perfectly straight, with four identical rounded corners. Centred, filling about 85% of the image height.
Style: exactly as the attached image.
```
**attach:** your H1 image
**save as:** `sources/art/cook-v3/h2-hob-1-v1.png`
**check:** it matches H1 (same burner size, frame, glass, front strip) · perfectly round burner · even frame on all sides.

### H3. Three burners
```
Using the attached hob as the exact design, draw the same hob with THREE burners in a row, for a children's game: 1536x1024 landscape, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above. Exactly the same materials, burner size, pan supports, brass caps, black glass, front strip and polished silver frame as the attached hob, with the same generous spacing between burners. The frame is exactly the same thickness on all four sides, perfectly straight, with four identical rounded corners. Centred, filling about 90% of the image width.
Style: exactly as the attached image.
```
**attach:** your H1 image
**save as:** `sources/art/cook-v3/h3-hob-3-v1.png`
**check:** three identical, evenly spaced, perfectly round burners · matches H1 · even frame.

### H4. Four burners
```
Using the attached hob as the exact design, draw the same hob with FOUR burners in a single row, for a children's game: 1536x1024 landscape, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above. Exactly the same materials, burner size, pan supports, brass caps, black glass, front strip and polished silver frame as the attached hob, with the same spacing between burners (the hob is wide and shallow). The frame is exactly the same thickness on all four sides, perfectly straight, with four identical rounded corners. Centred, filling about 94% of the image width.
Style: exactly as the attached image.
```
**attach:** your H1 image
**save as:** `sources/art/cook-v3/h4-hob-4-v1.png`
**check:** four identical, evenly spaced, round burners in one row · matches H1 · even frame.

### H5. One wide burner, for a big karahi
```
Using the attached hob as the exact design, draw a wide single-burner hob for frying in a big karahi, for a children's game: 1536x1024 landscape, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above. ONE large burner (about one and a half times the size of the attached burners, with a bigger pan support) centred on a hob that is wider than it is deep, with the same plain black front strip for the controls. Exactly the same materials, black glass and polished silver frame as the attached hob; the frame is the same thickness on all four sides, perfectly straight, with four identical rounded corners. Centred, filling about 80% of the image width.
Style: exactly as the attached image.
```
**attach:** your H1 image
**save as:** `sources/art/cook-v3/h5-hob-wide-v1.png`
**check:** one big round burner centred on a landscape hob · matches H1's look · even frame.

### H6. The knob, off and on
```
Two cooker knobs for a children's game, 1536x1024 landscape, two equal cells side by side, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above, each knob is a chunky round control, big and easy to tap: a brushed brass rim, a matte black top and a raised black grip bar across the middle, matching the attached hob's materials. Each knob fills about 60% of its cell, centred.
Left cell: OFF, the grip bar horizontal, no glow.
Right cell: ON, the identical knob with the grip bar turned a quarter to vertical, and a soft warm orange glow all round its rim.
Both knobs are exactly the same size and position in their cells.
Style: exactly as the attached image.
```
**attach:** your H1 image
**save as:** `sources/art/cook-v3/h6-knob-off-on-v1.png`
**check:** two identical knobs, same size · off = bar horizontal, no glow · on = bar vertical with a warm glow · top-down, round.

## A. Faces
### A1. The family's face close-ups (for the round badges)
```
A sheet of character portraits for a children's game, 1536x1024 landscape, six equal cells in two rows of three, flat mid-grey #808080 background, no text, no letters, no numbers, no logos.
Each cell is a head-and-shoulders close-up of ONE person from the attached character sheets, looking at the viewer with a warm, gentle smile, drawn exactly as they are in the attached sheets (same face, hair, headscarf, glasses, beard, clothing colours). ALL five are framed IDENTICALLY: the face fills the middle of the cell, the eyes on the same line at 40% from the top, the top of the head just inside the top of a circle that fills the cell, the shoulders just showing at the bottom. Every person fits inside an imaginary circle 90% of the cell's height, so each can be cut into a round badge.
Row 1: (1) Nani, the grandmother, (2) Nana, the grandfather, (3) Ma, the mother.
Row 2: (4) Ali, the cousin, (5) Isa, the boy, (6) leave empty (plain grey).
Style: exactly as the attached style anchor and character sheets: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `nani-sheet-v2-approved.png`, `char-nana-v1.png`, `char-ma-v1.png`, `char-ali-v1.png`, `char-isa-v1.png`
**save as:** `sources/art/cook-v3/a1-faces-v1.png`
**check:** each person clearly matches their sheet · all five framed the same (eyes on one line, faces the same size) · cell 6 empty.

## C. Chai
### C1. The chai pan's contents, in every state
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the SAME top-down stainless steel saucepan as the attached image, seen straight down from directly above, exactly the same size, angle and position in every cell (the handle pointing to the upper right as in the attachment); only what is inside changes. The liquid fills the pan's round inside to about 80% of its depth, its surface a flat circle with a soft reflection on the upper-left and a thin bright meniscus against the steel.
Row 1: (1) empty, (2) clear water, see-through and faintly blue, (3) water with loose black tea leaves swirling, turning amber.
Row 2: (4) black tea: clear dark amber-red with a few leaves, (5) milky chai: a warm caramel-beige, smooth, (6) milky chai with crushed cardamom pods and thin ginger slices floating.
Row 3: (7) black tea at a rolling boil, bubbles across the surface, (8) milky chai at a rolling boil with a ring of pale froth, (9) milky chai foaming up almost to the rim.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, semi-photoreal, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `pan-top.webp`
**save as:** `sources/art/cook-v3/c1-chai-pan-states-v1.png`
**check:** nine identical pans in identical positions · water see-through, black tea clearly different from milky chai · the boils grow from bubbling to foaming · straight top-down.

## M. Maani
### M1. Dough balls: a pile, and one on its own
```
A sprite sheet for a children's game, 1536x1536 square, four equal cells in two rows of two, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above, with soft realistic contact shading between touching balls.
Row 1: (1) a realistic loose pile of eight smooth wheat-flour dough balls, pale cream, lightly dusted with flour, heaped naturally two layers deep, NOT in any bowl or tray; (2) the same pile made of millet (bajra) dough, a speckled grey-brown.
Row 2: (3) ONE wheat dough ball exactly like those in the pile, (4) ONE millet dough ball exactly like those in its pile.
The single balls are the same size as the balls in the piles.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, semi-photoreal, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `dough-ball-t.png`, `dough-bajr-ball-t.png`
**save as:** `sources/art/cook-v3/m1-dough-v1.png`
**check:** piles look natural, with no bowl or tray · wheat is pale cream, millet speckled grey-brown · single balls match the piles' balls.

### M2. The rolling board and pin, in rich dark wood
```
Two kitchen tools for a children's game, 1536x1024 landscape, two cells side by side, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above.
Left cell: a round Indian rolling board (chakla), a perfect circle, carved from rich dark walnut-brown hardwood with a fine visible grain, a slightly raised rim and a satin oiled finish: expensive and handmade, not light pine. It fills about 85% of its cell.
Right cell: a matching rolling pin (velan) in the same dark walnut, lying horizontally, thick in the middle and tapering to both ends, smooth and satin.
Style: exactly as the attached style anchor: semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `tool-chakla-t.png`, `tool-velan-t.png`
**save as:** `sources/art/cook-v3/m2-chakla-velan-v1.png`
**check:** dark, rich walnut wood with fine grain (not pale) · the board is a perfect circle · the pin matches the board.

### M3. Maani on the tawa: raw to cooked, flat, never puffed
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE round flatbread (maani, like a chapati) seen straight down from directly above, a perfect circle, EXACTLY the same size and position in every cell. They stay FLAT like a chapati: at most one small soft bubble, never puffed up like a poori.
Row 1, wheat: (1) raw, freshly rolled, pale and matt with a dusting of flour, (2) half-cooked, a few pale golden spots, (3) cooked, flat, with scattered brown spots and a slight sheen.
Row 2, millet (bajra, speckled grey-brown dough): (4) raw, (5) half-cooked, (6) cooked, flat, with darker brown spots.
Row 3: (7) wheat, burnt: dark scorched patches, (8) millet, burnt, (9) leave empty (plain grey).
Style: exactly as the attached style anchor: semi-photoreal, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `maani-cooked-half-t.png`, `maani-bajr-cooked-half-t.png`
**save as:** `sources/art/cook-v3/m3-maani-states-v1.png`
**check:** all eight are the same size and perfectly round · cooked ones are flat with brown spots, not puffed · wheat and millet are clearly different · cell 9 empty.

### M4. The tawa, high resolution
```
One image for a children's game, 1024x1024 square, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
A flat round cast-iron tawa (griddle) seen straight down from directly above: a perfect circle of seasoned dark iron with a subtle satin sheen, a very slightly raised rim, and a short straight wooden handle attached at the right. The iron disc fills about 75% of the image width, centred. Crisp, high-resolution detail on the iron's texture and the handle's wood grain.
Style: exactly as the attached style anchor: semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `vessel-tawa-t.png`
**save as:** `sources/art/cook-v3/m4-tawa-v1.png`
**check:** perfect circle, top-down · crisp high detail (not blurry) · the handle is on the right.

### M5. The maani turner: two options (Zafar picks one)
```
Two kitchen tools for a children's game, 1536x1024 landscape, two cells side by side, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above, each lying diagonally from lower left to upper right and filling about 80% of its cell's diagonal.
Left cell: a traditional Indian kitchen chimta: long flat steel tongs made from one folded strip, two flat blades with a small ring at the folded end, used to flip chapatis on a tawa. Clearly a kitchen tool, polished steel.
Right cell: a flat chapati turner: a thin wide square steel blade on a wooden handle.
Style: exactly as the attached style anchor: semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `chimta.webp`
**save as:** `sources/art/cook-v3/m5-turners-v1.png`
**check:** the left is clearly kitchen tongs (not tweezers) · the right is a flat turner · both top-down.

## D. Daar
### D1. The daar pot, straight top-down, in every state
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the SAME round stainless steel cooking pot with two small side handles, seen STRAIGHT DOWN from directly above (the rim a perfect circle, handles at left and right), exactly the same size and position in every cell; only what is inside changes.
Row 1: (1) empty and clean, (2) a thin layer of hot golden oil shimmering on the bottom, (3) the hot oil with black mustard seeds and cumin seeds popping and sizzling.
Row 2: (4) the spiced oil with chopped red onion frying, softening and turning golden, (5) as 4 plus chopped tomato, (6) as 5 plus a few chopped green chillies.
Row 3: (7) cooked yellow lentil daar filling the pot, smooth and glossy, (8) the daar with a spiced oil tadka poured on top (mustard seeds, cumin, curry leaves, a red-orange swirl), (9) the same daar mid-stir, a gentle swirl in its surface.
Style: exactly as the attached style anchor: semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `vessel-pot-t.png`
**save as:** `sources/art/cook-v3/d1-daar-pot-states-v1.png`
**check:** straight top-down (perfect-circle rim) · nine identical pots in identical positions · the oil, seeds, onion, tomato and chilli look like real food, not dots · the daar is a glossy yellow.

### D2. Ladle, served daar on a trivet, and the chopped-veg bowl
```
Three kitchen pieces for a children's game, 1536x1024 landscape, three equal cells side by side, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
All seen from directly above.
(1) a steel ladle as you'd see it standing in a pot from above: the round bowl of the ladle a perfect circle at the bottom of the cell, the handle rising up out of it towards the viewer, strongly foreshortened, pointing up and to the right.
(2) a small round steel serving bowl full of glossy yellow daar with a spiced tadka on top, sitting on a round woven wooden trivet (a heat mat) slightly larger than the bowl.
(3) a small round steel bowl, straight top-down, holding a heap of freshly chopped red onion, chopped tomato and a few chopped green chillies, each in its own little pile.
Style: exactly as the attached style anchor: semi-photoreal food and materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `tool-ladle-t.png`, `vessel-pot-t.png`
**save as:** `sources/art/cook-v3/d2-ladle-trivet-bowl-v1.png`
**check:** the ladle reads as seen from above, handle rising toward us · the daar bowl sits on a wooden trivet · all round things are perfect circles.

## T. Chaat (fully side-on, recommended answer to Q2b)
### T1. The chaat glass bowl, straight side-on
```
One image for a children's game, 1024x1024 square, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
An EMPTY clear glass serving bowl seen exactly from the side at eye level (no top view at all: the rim is a straight horizontal line), straight-walled with a gentle curve into a short round foot. Crystal-clear thick glass with subtle bright reflections on the left and right walls, and the grey background visible through it. It fills about 80% of the image width, centred, with room inside for layers of food.
Style: exactly as the attached style anchor: semi-photoreal glass, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `glass-bowl.webp`
**save as:** `sources/art/cook-v3/t1-chaat-bowl-side-v1.png`
**check:** exactly side-on, the rim a straight line · clear and empty · clean edges on grey.

### T2. The chaat ingredients, side-on, for the shelf
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the SAME small straight-sided clear glass pot seen exactly from the side at eye level (the rim a straight line), exactly the same size and position in every cell, filled to about three quarters with one chaat ingredient, seen through the glass like the attached pantry jars:
Row 1: (1) boiled chickpeas, (2) small cubes of boiled potato, (3) finely chopped red onion.
Row 2: (4) chopped green chillies, (5) crunchy yellow sev (thin fried gram-flour noodles), (6) thick white yoghurt.
Row 3: (7) dark brown tamarind chutney, (8) bright green mint-coriander chutney, (9) chopped fresh coriander leaves.
Style: exactly as the attached style anchor and pantry jars: semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `pantry-v2-sheet1-tall-jars.png`
**save as:** `sources/art/cook-v3/t2-chaat-pots-side-v1.png`
**check:** nine identical glass pots, exactly side-on · every ingredient clearly recognisable through the glass · same fill height in all.

## S. Samosa
### S1. The samosa fold (the cone method, recommended answer to Q3)
```
A sprite sheet for a children's game, 1536x1024 landscape, six equal cells in two rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell shows one step of folding a samosa from a long strip of thin raw samosa pastry, seen straight down from directly above, the pastry matt, pale cream and lightly floured. Every step is centred in its cell at the same scale.
Row 1: (1) the flat pastry strip lying horizontally, (2) the left end folded over diagonally into a triangle, (3) folded again and opened into a cone pocket, its open mouth at the top, empty.
Row 2: (4) the cone pocket filled with a savoury filling that shows only at its open mouth, (5) the long tail of the strip folding over the mouth, half closed, (6) the finished raw samosa: a neat sealed triangle with crisp folded edges.
Style: exactly as the attached style anchor: semi-photoreal pastry, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `stage-3.webp`
**save as:** `sources/art/cook-v3/s1-samosa-fold-v1.png`
**check:** six clear, logical steps from strip to sealed triangle · the filling shows only at the mouth in step 4 · the same pastry look and scale throughout.

### S2. The house board (for chopping, filling and threading)
```
One image for a children's game, 1536x1024 landscape, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
A large rectangular wooden chopping board seen straight down from directly above, in rich dark walnut-brown hardwood with a fine visible end-to-end grain, softly rounded corners, a satin oiled finish and a few faint knife marks: expensive and handmade, not light pine. It fills about 85% of the image width, centred, with crisp high-resolution detail.
Style: exactly as the attached style anchor: semi-photoreal wood, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**save as:** `sources/art/cook-v3/s2-board-v1.png`
**check:** dark rich walnut, crisp (not blurry) · straight top-down rectangle · matches M2's wood.

### S3. A bigger karahi of oil, cleanly drawn
```
One image for a children's game, 1024x1024 square, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
A wide steel karahi (deep frying wok) with two small round loop handles at left and right, seen straight down from directly above (the rim a perfect circle), filled with clear golden frying oil with a soft reflection. Wide and shallow-looking from above, with room for six samosas in the oil. The grey background must show cleanly through the inside of both loop handles. It fills about 85% of the image width, centred.
Style: exactly as the attached style anchor: semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `karahi.webp`
**save as:** `sources/art/cook-v3/s3-karahi-v1.png`
**check:** perfect-circle rim, top-down · the loop handles are open, with grey showing through them · clear golden oil.

### S4. The serving plate and the slotted spoon
```
Two kitchen pieces for a children's game, 1536x1024 landscape, two cells side by side, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above.
Left cell: a round white enamel plate with a thin navy-blue rim and a WIDE flat centre (the rim a narrow band), lined with a square of plain white kitchen paper in the middle, filling about 85% of its cell.
Right cell: a round steel slotted spoon (jharo) for lifting food out of oil: a flat perforated disc with neat round holes on a long straight handle, lying diagonally.
Style: exactly as the attached style anchor: semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `plate-enamel-empty-t.png`, `tool-slotted-spoon-t.png`
**save as:** `sources/art/cook-v3/s4-plate-jharo-v1.png`
**check:** the plate has a wide flat centre and a narrow rim · the spoon's disc has clean round holes · top-down.

### S5. The samosa fillings: top-down heaps, no bowls (recommended answer to Q2a)
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE loose heap of a samosa filling seen straight down from directly above, NOT in a bowl, about the same size in every cell (filling about 70% of the cell), with soft natural edges:
Row 1: (1) cooked spiced minced meat (chundo), browned and crumbly, (2) small cubes of boiled potato, (3) finely chopped red onion.
Row 2: (4) chopped green chillies, (5) chopped fresh coriander, (6) green peas.
Row 3: (7) grated carrot, (8) diced cooked cabbage, (9) leave empty (plain grey).
Style: exactly as the attached style anchor and the attached mince heap: semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `top-ph-keema.webp`
**save as:** `sources/art/cook-v3/s5-fillings-top-v1.png`
**check:** eight heaps with no bowls, top-down, similar size · each clearly recognisable · cell 9 empty.

## K. Sekelo
### K1. The skewer rack with 0 to 4 empty skewers
```
A sprite sheet for a children's game, 1536x1024 landscape, six equal cells in two rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the SAME rectangular skewer rest seen straight down from directly above: two dark walnut-wood rails running left to right, joined at the ends, like a small ladder with only two rungs at the ends, exactly the same size and position in every cell. Long thin bamboo skewers lie across the two rails, vertically, evenly spaced, each with a small dark wooden handle at the bottom end, sticking out below the lower rail.
(1) no skewers, (2) one skewer in the first place, (3) two, (4) three, (5) four skewers, filling all four places, (6) leave empty (plain grey).
Every skewer is in the same place in every cell where it appears.
Style: exactly as the attached style anchor: semi-photoreal wood, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `vessel-skewer-rack-t.png`, `skewer-empty-t.png`
**save as:** `sources/art/cook-v3/k1-rack-0-4-v1.png`
**check:** the same rack in the same place in cells 1–5 · 0, 1, 2, 3, 4 skewers, in fixed places · handles below the lower rail.

### K2. The plate with 1 to 4 skewers, handles off the plate
```
A sprite sheet for a children's game, 1536x1536 square, four equal cells in two rows of two, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the SAME large round white enamel plate with a thin navy-blue rim, seen straight down from directly above, exactly the same size and position in every cell. Empty bamboo skewers lie across the plate side by side, slightly angled, with their dark wooden handle ends sticking OUT past the plate's rim onto the grey (the handles are off the plate).
(1) one skewer, (2) two, (3) three, (4) four.
Every skewer is in the same place in every cell where it appears.
Style: exactly as the attached style anchor: semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `plate-enamel-empty-t.png`, `skewer-empty-t.png`
**save as:** `sources/art/cook-v3/k2-plate-1-4-v1.png`
**check:** the same plate in the same place in all four · 1, 2, 3, 4 skewers · handles off the plate.

### K3. The charcoal grill
```
One image for a children's game, 1536x1024 landscape, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
A rectangular charcoal barbecue grill seen straight down from directly above: a dark steel firebox with a thin rim, full of glowing orange-red charcoal with grey ash, and two thin steel bars running left to right across it to rest skewers on (room for four skewers laid vertically across the bars). Clean, crisp edges all the way round. It fills about 80% of the image width, centred.
Style: exactly as the attached style anchor: semi-photoreal materials and glowing coals, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `grill-jiko-t.png`
**save as:** `sources/art/cook-v3/k3-grill-v1.png`
**check:** straight top-down rectangle · glowing coals · two bars for the skewers · clean edges.

### K4. The skewer pieces: big and chunky, raw and grilled
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE big chunky piece for a skewer seen straight down from directly above, each about the same size (filling about 55% of the cell), with a small hole through its middle where a skewer would pass:
Row 1: (1) a raw cube of red marinated meat, (2) the same cube grilled, browned with char marks, (3) the same cube charred, blackened at the edges.
Row 2: (4) a raw chunk of red onion, its layers showing, (5) the onion chunk grilled with charred edges, (6) a raw chunk of tomato.
Row 3: (7) the tomato chunk grilled, (8) a raw chunk of green pepper, (9) the pepper chunk grilled.
Style: exactly as the attached style anchor and the attached grilled piece: semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `mishkaki-meat-grilled-t.png`
**save as:** `sources/art/cook-v3/k4-pieces-v1.png`
**check:** nine chunky pieces of similar size, top-down · raw, grilled and charred clearly different · onion, tomato and pepper recognisable.

### K5. The same chunky pieces, heaped for the shelf
```
A sprite sheet for a children's game, 1536x1536 square, four equal cells in two rows of two, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE loose heap of raw skewer pieces seen straight down from directly above, NOT in a bowl, filling about 70% of the cell, the pieces exactly as big and chunky as in the attached image:
(1) raw red marinated meat cubes, (2) raw red onion chunks, (3) raw tomato chunks, (4) raw green pepper chunks.
Style: exactly as the attached style anchor: semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, your K4 image
**save as:** `sources/art/cook-v3/k5-heaps-v1.png`
**check:** four heaps with no bowls, top-down · the pieces are the same chunky size as K4 (not small dice).
