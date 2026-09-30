# ChatGPT art prompts: overnight 29–30 Sept (Cook redos + clinic items)

Thirteen prompts, free (ChatGPT). They don't wait on more feedback:
- **Cook redos (R1–R8):** the fixes the Cook art session and the station sessions found (`build/reports/cook-v3-art.md` §6, `build/reports/sekelo-v3.md` §6, `build/reports/daar-v3.md` §6).
- **Clinic items (CI1–CI5):** the objects the pharmacy belt and the heal games use. They don't depend on where people stand, so they can go ahead now.
- **Not in this run:** the clinic's people (patients, the doctor's poses, the body close-ups). Those wait for the people-and-placement plan and the overlay test (VISUAL-QA §2b).
- **Samosa redos** wait for its report.

## Paste this one block into Claude in Chrome
```
You're making 13 images in ChatGPT for a children's game called Nani jo Ghar, then uploading them to GitHub yourself. Work through these steps in order, and don't change any ChatGPT, GitHub or Chrome settings.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/main/docs/archive/art-prompts/chatgpt-art-prompts-overnight-2026-09-30.md and read the whole page. It has 13 prompts in this order: R1, R2, R3, R4, R5, R6, R7, R8, CI1, CI2, CI3, CI4, CI5. Each is in a grey code box, followed by "attach", "save as" and "check" lines.

2. Download the reference images listed under "Reference images" on that page. Open each link and click its "Download raw file" button (the download-arrow icon at the top right of the image).

3. In ChatGPT (chatgpt.com), for each prompt in order: start a new chat, attach the files its "attach" line names, paste the text of its code box exactly as written, and send. When the image arrives, compare it against its "check" line.
   - If it passes, download it straight away with ChatGPT's own download button (never a screenshot), before moving on.
   - If it fails, reply once saying which check it failed and ask for a corrected image. If that fails too, start a fresh chat and try once more (at most 2 retries per prompt). Then download the best one and note what's wrong with it.
   - Download only the one image you keep for each prompt, so there are exactly 13 downloads.

4. Upload them to GitHub yourself, in two uploads. Rename nothing on GitHub. For each upload, choose "Commit directly to the main branch" and click "Commit changes", then check the folder page lists the files.
   - The 8 images from R1 to R8: open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/cook-v3-1 and drag them in. Commit message: "Cook v3.1 art redos (ChatGPT, 8 images)".
   - The 5 images from CI1 to CI5: open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/clinic-v2/items and drag them in. Commit message: "Clinic v2 item art (ChatGPT, 5 images)".

5. Tell me, in prompt order: the prompt (R1 … CI5), the file name as uploaded, and pass, or what's wrong with it.
```

**What happens next:** Claude matches the uploads to the prompts by the pictures, renames them to the "save as" names, cuts them (the cut_tick_v2 method, `docs/archive/process/VISUAL-QA.md` §2, with the grey-leftover check) and reviews them before any station uses them.

## Reference images
- Style anchor: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png
- The two-burner hob (H1): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/cook-v3/h1-hob-2-v1.png
- The knobs (H6): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/cook-v3/h6-knob-off-on-v1.png
- The daar pot states (D1): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/cook-v3/d1-daar-pot-states-v1.png
- The ladle, trivet bowl and veg bowl (D2): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/cook-v3/d2-ladle-trivet-bowl-v1.png
- The sekelo plates (K2): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/cook-v3/k2-plate-1-4-v1.png
- The sekelo pieces (K4): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/cook-v3/k4-pieces-v1.png
- The sekelo heaps (K5): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/cook-v3/k5-heaps-v1.png
- The clinic pharmacy belt (CB4c): https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/clinic-v2/cb4c-pharmacy-belt-v1.png

**Rules on every image:**
- Flat mid-grey `#808080` background, no floor, no cast shadows, no text, numbers, letters or logos.
- Each thing is centred in its own cell with clear grey all round it, never touching the edge.
- **"Top-down" means straight down from directly above**, like a photo taken from the ceiling: round things are perfect circles, never ellipses.
- **Registration:** where a sheet shows one object in several states, it is the same object at exactly the same size and position in every cell.
- **Style:** the attached style anchor (a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines). The one exception is R8's flat icons.

---

## R. Cook redos
### R1. Four burners, the same burner size as H1
```
Using the attached two-burner hob as the exact design, draw the same hob with FOUR burners in a single row, for a children's game: 1536x1024 landscape, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Seen straight down from directly above. IMPORTANT: every burner is EXACTLY the same size as one burner of the attached hob (the same brass cap, black ring and pan support), NOT smaller. The gap between burners is the same as on the attached hob. The hob is only as wide as four burners and those gaps need, with the same margins at the ends. Same black glass, the same plain black strip along the front for the controls, the same polished silver frame: the same thickness on all four sides, perfectly straight, four identical rounded corners. Centred; it can fill up to 96% of the image width.
Style: exactly as the attached hob.
```
**attach:** `h1-hob-2-v1.png`
**save as:** `sources/art/cook-v3-1/r1-hob-4-v2.png`
**check:** four round burners, each the same size as H1's (measure: a burner's width is about a fifth of the hob's width, not smaller) · even gaps · even silver frame · plain front strip.

### R2. The knob, with a stronger "on" glow
```
Using the attached knobs as the exact design, draw them again for a children's game: 1536x1024 landscape, two equal cells side by side, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
The same knob, seen straight down, exactly the same size and position in both cells, filling about 55% of its cell.
Left cell: OFF, the grip bar horizontal, no glow.
Right cell: ON, the grip bar turned a quarter to vertical, and a STRONG warm orange-red glow all round the rim, spreading well out onto the grey (like a glowing cooker ring). It must still read as clearly "on" when the picture is shrunk to the size of a coin.
Style: exactly as the attached image.
```
**attach:** `h6-knob-off-on-v1.png`
**save as:** `sources/art/cook-v3-1/r2-knob-off-on-v2.png`
**check:** the same knob in both cells · the "on" glow is bold and wide and obvious when shrunk small · off has no glow.

### R3. The ladle on its own
```
One kitchen tool for a children's game, 1024x1024 square, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
A steel ladle on its own (NOT in a pot), seen from directly above as if it were standing upright in a pot below us: the round bowl of the ladle is a perfect circle at the bottom of the image, and its handle rises out of the bowl towards the viewer, strongly foreshortened, pointing up and to the right, ending in a hooked tip. Only the ladle; nothing around it.
Style: exactly as the attached image's ladle and the style anchor.
```
**attach:** `style-anchor-v1.png`, `d2-ladle-trivet-bowl-v1.png`
**save as:** `sources/art/cook-v3-1/r3-ladle-v2.png`
**check:** only the ladle, no pot · the bowl a perfect circle · the handle rises toward us, foreshortened · clean edges all round.

### R4. More daar pot states, so an order without onion shows no onion
```
A sprite sheet for a children's game, 1536x1024 landscape, six equal cells in two rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Cells 1 to 5 hold the SAME round stainless steel pot as the attached sheet, seen straight down from directly above, exactly the same size and position in every cell; only what's inside changes. Every pot has the hot oil with black mustard seeds and cumin seeds, as in the attached sheet's third cell, plus:
(1) chopped tomato only (no onion, no chilli), (2) a few chopped green chillies only, (3) chopped red onion and green chillies (no tomato), (4) chopped tomato and green chillies (no onion), (5) cooked glossy yellow daar with a tadka of mustard and cumin seeds only on top (no dried red chilli, no curry leaves).
(6) the SAME small steel serving bowl on the SAME round woven wooden trivet as in the attached sheet's middle picture, full of plain glossy yellow daar with NO tadka on top.
Style: exactly as the attached sheet: semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `d1-daar-pot-states-v1.png`, `d2-ladle-trivet-bowl-v1.png`
**save as:** `sources/art/cook-v3-1/r4-daar-pot-more-v1.png`
**check:** cells 1–5 are the same pot as D1, in the same place · each shows only the vegetables its cell names · cell 6 is the trivet bowl with plain daar, no tadka.

### R5. Chopped vegetables for daar's chop piles
```
A sprite sheet for a children's game, 1536x1024 landscape, six equal cells in two rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
All seen straight down from directly above, NOT in bowls, the food looking real (not like flowers or berries):
Row 1: (1) a small loose heap of chopped red onion (pieces of layered onion, clearly onion), (2) a small loose heap of chopped tomato (juicy red pieces with seeds), (3) a small loose heap of sliced green chilli rings.
Row 2: ONE single piece of each, as big as in the heaps above: (4) one piece of chopped red onion, (5) one piece of chopped tomato, (6) one ring of green chilli.
Style: exactly as the attached image and the style anchor: semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `d2-ladle-trivet-bowl-v1.png`
**save as:** `sources/art/cook-v3-1/r5-chopped-veg-v1.png`
**check:** clearly chopped onion, tomato and chilli (not flowers or berries) · no bowls · the single pieces match the heaps' size.

### R6. The sekelo plate, skewers fanned wider, plus the empty plate
```
A sprite sheet for a children's game, 1536x1024 landscape, six equal cells in two rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the SAME large round white enamel plate with a thin navy-blue rim as the attached sheet, seen straight down from directly above, exactly the same size and position in every cell. Empty bamboo skewers lie across the plate with their dark wooden handles sticking OUT past the rim onto the grey, spread out like a fan so there is a wide gap between neighbouring skewers (about twice as wide as in the attached sheet; each skewer needs room for big chunky pieces without touching the next).
(1) the empty plate, clean, nothing on it, (2) one skewer, (3) two, (4) three, (5) four, (6) leave empty (plain grey).
Every skewer is in the same place in every cell where it appears.
Style: exactly as the attached image.
```
**attach:** `k2-plate-1-4-v1.png`
**save as:** `sources/art/cook-v3-1/r6-plate-0-4-v2.png`
**check:** the same plate in the same place in cells 1–5 · a clean empty plate in cell 1 · skewers fanned with wide gaps · handles off the plate.

### R7. Potato pieces, and charred vegetables that don't look like meat
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each of cells 1 to 6 holds ONE big chunky skewer piece, seen straight down from directly above, the same size as the attached pieces, with NO hole:
Row 1: (1) a raw chunk of potato (pale yellow, cut faces), (2) the potato chunk grilled (golden with char marks), (3) the potato chunk charred (blackened edges, still clearly potato).
Row 2: (4) a charred chunk of red onion: blackened edges but still clearly purple-red onion layers, (5) a charred tomato chunk: blackened edges but still clearly red tomato, (6) a charred green pepper chunk: blackened edges but still clearly green.
Row 3: (7) a loose heap of raw potato chunks, NOT in a bowl, like the attached heaps, (8) and (9) leave empty (plain grey).
Style: exactly as the attached images: semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `k4-pieces-v1.png`, `k5-heaps-v1.png`
**save as:** `sources/art/cook-v3-1/r7-potato-charred-v1.png`
**check:** potato raw, grilled and charred · each charred vegetable keeps its own colour and can't be mistaken for charred meat · the potato heap matches the K5 heaps.

### R8. The speed dial's four icons (flat)
```
Four simple flat icons for a children's game, 1536x1024 landscape, four equal cells in one row, flat mid-grey #808080 background, no shadows, no text, no letters, no numbers, no logos.
Each is a single-colour flat icon in warm cream (#F5E6C8), bold and chunky, readable when shrunk to the size of a fingernail, filling about 60% of its cell, centred:
(1) STOPPED: a round cooking ladle standing still, with two short vertical "pause" bars beside it, (2) SLOW: a tortoise seen from the side, walking, (3) FAST: a hare seen from the side, leaping, (4) TOO FAST: a big splash of liquid with drops flying out.
All four in the same flat style, the same line weight, the same cream colour, no gradients, no 3D.
```
**attach:** (nothing)
**save as:** `sources/art/cook-v3-1/r8-dial-icons-v1.png`
**check:** four flat single-colour cream icons in one style · the tortoise and hare are instantly recognisable when small · no text.

---

## CI. Clinic items (the pharmacy belt and the heal games)
**The view for CI1–CI3 and CI5:** each item is seen from the front and slightly above (a three-quarter view, like the attached pharmacy picture), standing on a **flat base** as if on a counter. Upright things stand up. Things that lie flat (tweezers, thermometer, toothbrush) lie on their side, resting flat, so they can sit on the belt. All the items on one sheet are drawn at their **real relative sizes** (a cotton-bud pot is smaller than a jug).

### CI1. The care kit
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no cast shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE item for a children's doctor's clinic, seen from the front and slightly above (three-quarter view), resting on a flat base as if on a counter, centred, at real relative sizes, filling about 50-70% of its cell:
(1) a small cardboard box of plasters (no writing, a simple plaster picture on it), (2) a roll of white cotton bandage, (3) a pair of steel tweezers lying flat on their side, (4) a small clear pot of cotton buds, (5) a small eye-drop bottle with a white cap, (6) a glass thermometer lying flat, with a thin red line inside and a silver bulb, (7) a child's toothbrush lying flat, (8) a white tube of tooth filling paste lying flat, (9) a dentist's drill handpiece (a slim white-and-steel pen shape) lying flat.
Friendly, clean and gentle: nothing sharp-looking or scary.
Style: exactly as the attached style anchor and the attached clinic picture: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `cb4c-pharmacy-belt-v1.png`
**save as:** `sources/art/clinic-v2/items/ci1-care-kit-v1.png`
**check:** nine items, each clearly what it is · three-quarter view on a flat base · real relative sizes · no writing on the box · nothing scary.

### CI2. The doctor's tools and the comfort things
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no cast shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE item for a children's doctor's clinic, seen from the front and slightly above (three-quarter view), resting on a flat base as if on a counter, centred, at real relative sizes, filling about 50-70% of its cell:
(1) a small rubber reflex hammer lying flat, (2) a stethoscope, loosely coiled, (3) a slim pen torch lying flat, (4) a friendly clear plastic doctor's syringe with a rounded capped tip (NO needle showing) lying flat, (5) a steel jug of water, (6) a neatly folded soft pale-blue cloth, (7) a neatly folded warm red blanket, (8) a small white desk fan, (9) a shiny red apple.
Friendly, clean and gentle: nothing sharp-looking or scary.
Style: exactly as the attached style anchor and the attached clinic picture.
```
**attach:** `style-anchor-v1.png`, `cb4c-pharmacy-belt-v1.png`
**save as:** `sources/art/clinic-v2/items/ci2-tools-comfort-v1.png`
**check:** nine items, each clearly what it is · no needle on the syringe · three-quarter view on a flat base · real relative sizes.

### CI3. The soothing drinks' ingredients
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, flat mid-grey #808080 background, no floor, no cast shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE item, seen from the front and slightly above (three-quarter view), resting on a flat base as if on a kitchen counter, centred, at real relative sizes, filling about 50-70% of its cell:
(1) an empty steel tumbler cup, (2) a steel teaspoon lying flat, (3) a small glass jar of golden honey with a wooden honey dipper, (4) a knobbly piece of fresh ginger root, (5) half a lemon, cut face showing, (6) a small steel bowl of bright yellow turmeric powder, (7) a small glass jug of milk, (8) a glass of warm golden turmeric milk, (9) a glass of warm pale amber ginger water with a thin slice of ginger in it.
Style: exactly as the attached style anchor and the attached clinic picture: semi-photoreal food and materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `cb4c-pharmacy-belt-v1.png`
**save as:** `sources/art/clinic-v2/items/ci3-drinks-v1.png`
**check:** nine items, each clearly what it is · the turmeric milk golden, the ginger water pale amber · real relative sizes.

### CI4. Plasters in colours, and half-and-half (flat, top-down)
```
A sprite sheet for a children's game, 1536x1152 landscape, twelve equal cells in three rows of four, flat mid-grey #808080 background, no floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE fabric sticking plaster seen straight down from directly above, lying flat and horizontal, all EXACTLY the same size and shape (a rounded rectangle with a paler square pad in the middle), filling about 70% of the cell width:
Row 1: (1) red, (2) yellow, (3) blue, (4) green.
Row 2: half-and-half plasters, split down the middle through the pad, left half one colour and right half the other: (5) red and yellow, (6) red and blue, (7) red and green, (8) yellow and blue.
Row 3: (9) yellow and green, (10) blue and green, (11) a plain skin-coloured plaster, (12) leave empty (plain grey).
Bright, clean, cheerful colours: the same red, yellow, blue and green everywhere.
Style: exactly as the attached style anchor: soft semi-photoreal fabric, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**save as:** `sources/art/clinic-v2/items/ci4-plasters-v1.png`
**check:** eleven plasters, all identical in size and shape · four solid colours, then the six pairs in the order given · the colours match across cells · top-down and flat.

### CI5. The foot soak: hot, cold and lukewarm water
```
A sprite sheet for a children's game, 1536x1536 square, four equal cells in two rows of two, flat mid-grey #808080 background, no floor, no cast shadows, no text, no letters, no numbers, no logos.
(1) a steel jug of HOT water with soft steam curling up from it, (2) the SAME jug of COLD water with ice cubes floating and a light frost on the outside, (3) the SAME jug of LUKEWARM water: no steam, no ice, calm, (4) a round steel basin of clear water seen STRAIGHT DOWN from directly above (a perfect circle), big enough for a child's two feet.
Cells 1 to 3: the same jug at exactly the same size and position, seen from the front and slightly above, standing on a flat base.
Style: exactly as the attached style anchor and the attached clinic picture: semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `cb4c-pharmacy-belt-v1.png`
**save as:** `sources/art/clinic-v2/items/ci5-foot-soak-v1.png`
**check:** the same jug three times · hot has steam, cold has ice and frost, lukewarm has neither · the basin is straight top-down, a perfect circle.
