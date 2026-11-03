# Art block 3 plan (pack `s17-art3`): clinic care, the stove family's roll-out, and block 1's redos

**Written:** 3 Nov 2026, a **first draft** for Zafar to run (Sprint 17 step 3: "one big art block, 50+ images": block 1's redos
plus the next family's block, clinic care, `docs/sprints/plan.md`). Clinic care is rolled out in Sprint 20; the scrape is polished
in Sprint 19. **Decision 77:** Claude wrote this plan and its block; Zafar runs it in ChatGPT; Claude judges, cuts and wires.
**ART-29:** one paste block, every reference on the branch the block reads. **Run spec:** `build/tools/art/specs/s17-art3.run.yaml`;
the block: `docs/design-language/art-plans/s17-art3-chrome-block.txt`.

**Keep the laptop awake for the whole run:** on a Mac, `caffeinate -dims` in Terminal, charger in, lid open; on Windows,
PowerToys Awake on.

## 0. Totals

| Part | What | Lines | Game pictures |
|---|---|---|---|
| A | Block 1's redos and two stove pieces | BK, CX, CO, BL, PO, PU | 1 + 1 + 6 + 8 + 3 + 4 = 23 |
| B | The cut game and the hand splinter (the clinic's first slice) | AB, AG, PB, PG, SR, GS, CR, PL, TX, SL | 1 + 1 + 1 + 1 + 4 + 7 + 4 + 12 + 3 + 6 = 40 |
| C | The blocked nose and the drinks (the second slice) | NF, DR, BI, UB, UG, DC, DT | 4 + 6 + 2 + 1 + 1 + 1 + 6 = 21 |
| D | The side-on heads and the foot | HG, HO, FA | 3 |
| E | The heal games' rows waiting on art | DM, NG, MZ, TH, KB, TB, TC, FL, BT | 2 + 2 + 1 + 3 + 4 + 3 + 2 + 1 + 9 = 27 |
| F | The stove family's roll-out (block 4, folded in) | KC, SF, BV, BW | 1 + 6 + 2 + 10 = 19 |
| | **Total** | **39 prompts** | **about 133 game pictures**; about 55 images with the expected redos; about 3.5 hours in three windows |

**Not in this block, on purpose:**
- **Real people** (decision 29: Zafar approves only them): the doctor (CLN-150's one picture), Nani's four moods (ART-10), the house
  style across Nani, the doctor and the girl (ART-22), the bench's chibi adults (ART-23). They need his approved sheets and a
  character run of their own. The patients here (the girl and the boy) are not real people and follow their approved sheets.
- **The teddy** (on his yes, clinic-every-part §7, picture 7) and the ankle (on his yes).
- **The match-cut knee** (CLN-87) and the item-views table (ART-20): a table first, then a block.
- **Reused, not redrawn:** the kidney tray, the jugs, the stethoscope, the clinic counter pieces, the exam room (`r3-exam-room-
  square`), the forearm and upper-arm close-ups where they serve (§1.1).

## 1. Flaws and uncertainties first

1. **The arm close-ups may already be drawn.** `child-f1-forearm` and `child-u1-upperarm` (clinic-heal-v3) cover the forearm and the
   upper arm separately; the cut game wants one arm, shoulder to fingertips, on the strip (clinic-every-part §7, picture 1). AB and
   AG draw it whole; if the cut works from the two old ones, AB and AG are kept for boing's redo (CLN-106: its arm failed the judge).
2. **The drop machine (DM) waits on question 35** (`docs/questions.md`: redraw it wider so its levers sit 56 units apart, or move the
   syringe). The block draws it wider (the recommendation); if Zafar says "move the syringe", skip DM.
3. **"Photorealistic" items** (his words for the thermometer, the bandage, the plasters and the drops: CLN-175, CLN-179, K1018 P12,
   CLN-186): the items are semi-photoreal in the game's 3D look; the people stay stylised (the sheets). If an item reads as a
   cartoon, the redo says "more photographic".
4. **The face states (NF, NG, MZ)** are edits of the approved s08c face (`gz2-girl-face-eyes`), not a new face. Any drift from it
   fails.
5. **Modest clothing** (non-negotiable 9): clothes are never lifted; the tummy and chest are shown clothed (UB, UG, BT).
6. **CO failed for text-like marks** (block 1): the chutneys' zigzags read as writing. The redo draws drips and dots only, no lines.
7. **BL was skipped** because the naan tray (BN) wasn't in ChatGPT's Library; this block attaches BN from the branch.

### 1.1 What each game has now, and what this block makes

| Game | Now | This block |
|---|---|---|
| The cut game (the scrape, un-parked) | the forearm and upper-arm close-ups, no scrape states | AB, AG the arm whole; SR the scrape; GS grit and splash; CR the cream; PL plasters |
| The hand splinter (`js/clinic-proto`, `game=hand`) | a flat placeholder palm | PB, PG the palms; SL splinters and the channel (CLN-193); TX tissues |
| The blocked nose (`game=nose`) | the eye game's face, a "pop" | NF the nose's four states; DR the dropper and drops; BI the bin; TX |
| The drinks (`game=drinks`) | a flat wood counter, taste's things | UB, UG the patients sitting with a cup; DC the counter; DT the six things |
| Where does it hurt? (`game=where`) | plain tiles | BT nine body-part tiles (ART-12: the neck, back and hair too) |
| The ear (L3 side), the neck | the head drawn in code (forbidden) | HG, HO the side-on heads |
| The foot | the cut-out floats (CLN-192) | FA the foot and ankle from the side, blown out into the background |
| Boing | the drop machine too narrow (CLN-106, q35) | DM the machine wider, its levers |
| Fever, knee, tooth, taste, eye, send-off, the zoom | rows waiting on art | TH, KB, TB, TC, DR, NG, MZ, FL |
| Chai and the cook (ART-32, ART-11) | the v3 foam; a potato that reads as butter | PO the boil-over; PU the potato |

## 5. The prompts

Every prompt is one image. Sheets are cut by their gutters; nothing touches a cell's edge. The patients' close-ups follow their
attached sheet and the style anchor exactly.

### Part A. Block 1's redos and two stove pieces

#### BK. The baking counter (redo)
```
Generate an image, 1536×1024, landscape.

A background for a children's cooking game: the back counter of the kitchen in the attached picture, seen STRAIGHT ON from the front at a child's standing eye level, as a calm, empty stage. Copy the kitchen's look exactly: the warm limewash wall, the pale cream square tiles (NOT peach, NOT pink), the cream-white marble with soft grey veins, the sage-green cabinet doors with small brass knobs, the warm afternoon sunlight from the left.
The marble worktop runs the full width of the picture. Its front edge is ONE straight horizontal line exactly at the middle of the picture's height (52% from the top): the top half of the picture is wall and tiles, the bottom half is the worktop's thin top surface and then the cabinets. Above the worktop: the plain pale tiled splashback up to about 25% from the top, then the plain wall; at the far left edge, part of a window with soft daylight. Below the worktop: the sage cabinet doors running the full width to the bottom edge. The worktop is completely EMPTY: no jars, no bowls, no cooker, no hob, no oven, no plants, no people, no cat. The second attached picture is a mock-up of this scene: copy only its camera, nothing on the counter.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CX. The crate of cobs (redo)
```
Generate an image, 1536×1024, landscape.

A sprite for a cooking game: a shallow rectangular wooden crate seen from EXACTLY straight above, holding exactly SIX raw corn cobs lying side by side in ONE row of six, their pointed tips all to the right. The cobs are fully HUSKED: bright yellow kernels only, NO green leaves, NO husk, NO silk. The crate's four plank sides are an even width all the way round. The crate fills about 70% of the image's width, centred, with clear magenta all round it. No hand, no people.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No table, no gradient, NO shadows on the magenta. The crate does not touch the edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal wood and food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CO. The dressings, to lie on a cob (redo)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: six dressings ALONE, each spread in the long, narrow upright shape of the corn cob in the attached picture (the same length and width as that cob), in one row, each in its own sixth of the image, seen from exactly above. DO NOT draw the cob: only the dressing, as if the cob were invisible under it.
(1) a few glistening drops of lemon juice and one lemon pip; (2) a light sprinkle of white salt crystals; (3) a dusting of red chilli powder; (4) scattered round DROPS and small blobs of green coriander chutney; (5) scattered round DROPS and small blobs of dark red-brown tamarind chutney; (6) a sprinkle of coarse black pepper.
Every dressing is made ONLY of dots, drops, crystals and blobs: NO lines, NO zigzags, NO drizzles, NO squiggles, nothing that could look like a letter or writing.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The six never touch each other or the edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BL. The loaf and the cake in their tins
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: eight bakes in an invisible grid of 4 columns and 2 rows, seen from the front at eye level looking about 30 degrees down, each centred in its cell. The attached picture is the naan tray from this game: copy its steel, its light and its look.
Row 1: the SAME rectangular steel loaf tin four times, the same size and place: (1) raw pale dough in the tin; (2) the dough risen in a dome above the tin, still pale; (3) light golden crust; (4) deep golden crust (the darkest it gets; nothing burnt).
Row 2: the SAME round steel cake tin four times, the same size and place: (5) smooth pale raw cake batter in the tin; (6) the cake risen, pale; (7) light golden top; (8) deep golden top. A plain sponge, no icing, no decoration.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, semi-photoreal steel and bread, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PO. The chai pan boiling over (ART-32)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME steel chai pan as the attached picture three times in a row, seen from EXACTLY straight above (the rim a perfect circle), the same size and place, full of milky caramel chai: (1) a rolling boil, big bubbles, still inside the rim; (2) a thick froth rising over the rim on one side; (3) the froth spilling over the rim all round, a few drips on the outside of the rim. The handle points straight down in all three and stays inside the image. No hob, no flame, no spoon.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No gradient, NO shadows on the magenta. The three never touch each other or the edges.

Style: exactly as the attached pan: a stylised 3D animated-feature-film look, semi-photoreal steel and chai, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PU. The potato, whole and cut (ART-11)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: four pieces in one row, seen from exactly above, at one true scale: (1) one whole brown-skinned potato, earthy and slightly dusty, with a few small eyes; (2) the same potato cut in half, its cut face pale cream and matte; (3) a small heap of potato CUBES with their brown skin still on some edges, starchy, matte and slightly uneven, clearly POTATO and never butter (no shine, no yellow, no smooth straight edges); (4) the same cubes boiled, a little softened and translucent at the edges.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No board, no gradient, NO shadows on the grey. The four never touch each other or the edges.

Style: exactly as the attached potato: a stylised 3D animated-feature-film look, semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

### Part B. The cut game and the hand splinter

#### AB. The boy's arm, shoulder to fingertips
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the whole right arm of the boy in the attached character sheet, lying flat on a doctor's white paper bed strip, seen from straight above, palm down, from the shoulder to the fingertips.
- He wears the plain short-sleeved top from his sheet; the sleeve ends just above the elbow. Clothes are not lifted.
- The arm comes in from the left edge of the image at the shoulder and runs straight across the picture to the relaxed open hand on the right, fingers together, fully inside the image. Five fingers.
- The shoulder, the elbow, the forearm and the back of the hand are all clearly visible: the arm fills about a quarter of the image height, across the middle.
- Smooth, clean, healthy skin, exactly his skin tone in the sheet; no mark, no plaster.
- The white paper strip runs the full width behind the arm, a band about 45% of the image height, with a soft pale blue-grey bed cover above and below it.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. No drop shadow under the arm.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism.
```

#### AG. The girl's arm, shoulder to fingertips
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the whole right arm of the girl in the attached character sheet, lying flat on a doctor's white paper bed strip, seen from straight above, palm down, from the shoulder to the fingertips.
- She wears the plain top from her sheet with a sleeve to just above the elbow. Clothes are not lifted.
- The arm comes in from the left edge of the image at the shoulder and runs straight across the picture to the relaxed open hand on the right, fingers together, fully inside the image. Five fingers.
- The shoulder, the elbow, the forearm and the back of the hand are all clearly visible: the arm fills about a quarter of the image height, across the middle.
- Smooth, clean, healthy skin, exactly her skin tone in the sheet; no mark, no plaster.
- The white paper strip runs the full width behind the arm, a band about 45% of the image height, with a soft pale blue-grey bed cover above and below it.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. No drop shadow under the arm.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism.
```

#### PB. The boy's palm, fingers spread
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the right hand of the boy in the attached character sheet, PALM UP, fingers gently spread apart, lying flat on a doctor's white paper bed strip, seen from straight above.
- The wrist comes in from the bottom edge of the image with the end of a plain sleeve at the edge; the hand fills about 70% of the image height, centred.
- Five fingers and the thumb, all fully inside the image, relaxed and evenly spread so each finger has space around it.
- Smooth, clean, healthy skin, exactly his skin tone in the sheet, the palm a little lighter; the palm's natural creases soft; no mark, no splinter, no plaster.
- The white paper strip fills the picture behind the hand.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. No drop shadow under the hand.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism. Five fingers.
```

#### PG. The girl's palm, fingers spread
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the right hand of the girl in the attached character sheet, PALM UP, fingers gently spread apart, lying flat on a doctor's white paper bed strip, seen from straight above.
- The wrist comes in from the bottom edge of the image with the end of a plain sleeve at the edge; the hand fills about 70% of the image height, centred.
- Five fingers and the thumb, all fully inside the image, relaxed and evenly spread so each finger has space around it.
- Smooth, clean, healthy skin, exactly her skin tone in the sheet, the palm a little lighter; the palm's natural creases soft; no mark, no splinter, no plaster.
- The white paper strip fills the picture behind the hand.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. No drop shadow under the hand.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism. Five fingers.
```

#### SR. The scrape, in four states
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME small scrape (a graze) four times in one row, each in its own quarter, as if lying on skin seen from straight above, but drawn ALONE with no skin around it: (1) a fresh graze, pink-red and a little rough, with a few specks of dark grit in it; (2) the same graze clean, no grit, still pink-red; (3) the same graze half faded, soft pink; (4) almost gone, a faint pink patch. The same oval shape and size in all four (about a thumb's size), soft edges that fade out. Gentle, never gory: no blood running, no open wound.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The four never touch each other or the edges.

Style: exactly as the attached forearm graze: a stylised 3D animated-feature-film look, soft global illumination, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### GS. The grit's fizz and the water splash
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen from straight above, in an invisible grid of 4 columns and 2 rows:
Row 1: the SAME little cluster of dark grit specks four times, fizzing away: (1) the specks still; (2) tiny white fizz bubbles around them; (3) more bubbles, the specks half gone; (4) only a few bubbles left, the specks gone.
Row 2: the SAME clear water splash three times as it lands on a flat surface: (5) a falling round drop of water about to land; (6) the splash, a small crown of clear droplets; (7) a thin wet sheen spreading, a few droplets. The last cell is empty.
Clear water with soft highlights; nothing blue-coloured.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### CR. The cream tube and its sparkle
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen from straight above, in one row: (1) a small plain white soothing-cream tube with a white screw cap, lying flat, completely plain (no label, no writing, no logo, no stripes); (2) a small swirl of white cream on its own; (3) the same swirl with two or three soft gold sparkles; (4) a faint soft shine where the cream has been rubbed in, with one sparkle.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The four never touch each other or the edges.

Style: semi-photoreal, a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PL. Plasters in four colours, three states
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: photographic-looking fabric sticking plasters (adhesive bandages) seen from straight above, in an invisible grid of 4 columns and 3 rows. The same rounded-rectangle plaster shape and size in every cell, with a soft white pad in the middle and tiny breathing holes.
Columns, one colour each: (1) skin-beige; (2) sky blue; (3) leaf green; (4) sunflower yellow. Plain colours: no pictures, no patterns, no writing.
Row 1: each plaster still on its white paper backing, the backing's two tabs showing at the ends.
Row 2: each plaster with its backing half peeled back from one end.
Row 3: each plaster alone, stuck flat, slightly curved as if on skin (no skin drawn).

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: semi-photoreal, like a real product photo in the game's soft warm light, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### TX. The tissue box and tissues
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen from the front about 30 degrees down, in one row: (1) a plain pale blue cube tissue box with one soft white tissue standing up out of its top (the box completely plain: no pattern, no writing, no logo); (2) one single soft white tissue, loosely held open as if in the air; (3) one used tissue, softly scrunched into a loose ball.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The three never touch each other or the edges.

Style: semi-photoreal, a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SL. Splinters and the splinter's channel (CLN-193)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen from straight above, in an invisible grid of 3 columns and 2 rows:
Row 1: three small wooden splinters lying flat: (1) a short thin one; (2) a medium one; (3) a long thin one. Pale raw wood with a darker tip, slightly jagged.
Row 2: three square tiles of an irritated channel under the skin, to be laid end to end in a game: (4) a straight piece running left to right; (5) a corner piece turning from the left side to the bottom side; (6) an end piece, rounded at the right. Each tile shows a soft raised, translucent pinkish-red channel across warm skin, the channel exactly the same width and at exactly the same place where it meets the tile's sides, so the tiles join seamlessly. Gentle, never gory.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge around the pieces. No gradient, NO shadows on the grey. Nothing touches a cell's edge except the tiles' own square edges. Do not draw grid lines.

Style: exactly as the attached splinter tiles, but softer and more natural: a stylised 3D animated-feature-film look, soft global illumination, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

### Part C. The blocked nose and the drinks

#### NF. The girl's face: the blocked nose, four states
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME face of the girl in the attached close-up four times, in an invisible grid of 2 columns and 2 rows, front on, the head the same size and in the same place in every cell, from the top of her hair to her chin. Copy her face, hair, skin tone and style EXACTLY from the attached picture; only her expression and nose change:
(1) a blocked nose: the tip of her nose a little pink, her eyes slightly watery and a bit sorry for herself, mouth closed;
(2) the build-up to a sneeze: eyes squeezed half shut, nostrils flared, mouth a little open ("aah... aah...");
(3) the sneeze into a soft white tissue held to her nose with one hand, eyes shut;
(4) all clear and happy: a bright natural smile, her nose its normal colour.
Calm and sweet, never gross: nothing coming out of her nose.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows. Nothing touches a cell's edge. Do not draw grid lines.

Style: exactly as the attached close-up and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism.
```

#### DR. Dropper bottles and falling drops (CLN-186)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen from the side at eye level, in one row of six: (1) a small amber glass dropper bottle for EYE drops with a white rubber-bulb dropper top, standing; (2) the same eye dropper held upside down, tip pointing straight down, a clear drop forming at the tip; (3) one clear falling drop on its own; (4) a small white plastic NOSE-drop bottle with a soft rounded nozzle, standing; (5) the same nose bottle upside down, nozzle straight down, a clear drop forming; (6) the same clear drop just splashing into a tiny crown. Plain bottles: no label, no writing, no logo.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The six never touch each other or the edges.

Style: semi-photoreal, like a real product photo in the game's soft warm light, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BI. The small bin
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen from the front about 20 degrees down, in one row: (1) a small round white pedal bin for a doctor's room, its lid closed; (2) the same bin with its lid open. Plain: no label, no writing, no symbol.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No gradient, NO shadows on the magenta. The two never touch each other or the edges.

Style: semi-photoreal, a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### UB. The boy, sitting up, a cup in reach
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the boy in the attached character sheet, sitting up on the doctor's bed, seen front on at eye level from his waist to the top of his head, fully clothed in his sheet's outfit (nothing lifted), his hands resting in his lap, looking straight ahead with a calm, slightly poorly face (a little tired, not crying). He fills the left two thirds of the picture. On the right, a plain white cup sits on a small bedside table within his reach, empty.
Behind him: the plain soft wall of the attached exam room, out of focus.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism. Five fingers on each hand.
```

#### UG. The girl, sitting up, a cup in reach
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the girl in the attached character sheet, sitting up on the doctor's bed, seen front on at eye level from her waist to the top of her head, fully clothed in her sheet's outfit (nothing lifted), her hands resting in her lap, looking straight ahead with a calm, slightly poorly face (a little tired, not crying). She fills the left two thirds of the picture. On the right, a plain white cup sits on a small bedside table within her reach, empty.
Behind her: the plain soft wall of the attached exam room, out of focus.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism. Five fingers on each hand.
```

#### DC. The drinks counter
```
Generate an image, 1536×1024, landscape.

A background for a children's doctor game: the clinic's small counter, seen straight on from the front at a child's standing eye level, as a calm, empty stage, in the look and light of the attached exam room. A pale wooden counter top runs the full width; its front edge is one straight horizontal line at 55% of the image's height. Above it: the plain soft wall of the room with one small shelf high on the right holding nothing. Below it: plain pale wooden cupboard doors to the bottom edge. The counter top is completely EMPTY: no cups, jars, bottles, people or plants.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### DT. The six drink things
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: six things for a soothing home drink, standing in one row at eye level, one true scale, each in its own sixth: (1) a knob of fresh ginger root; (2) a small glass jar of golden honey with a wooden honey dipper resting in it; (3) a small steel jug of white milk; (4) a small glass jar of bright yellow turmeric powder with a little steel spoon in it; (5) a whole yellow lemon with one half cut beside it; (6) a clear glass of water. No labels, no writing.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The six never touch each other or the edges.

Style: exactly as the attached taste things: semi-photoreal in a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

### Part D. The side-on heads and the foot

#### HG. The girl's head, side-on
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the head and neck of the girl in the attached character sheet, seen exactly side-on from her right (we see her right ear), sitting up, looking straight ahead to the right of the picture, with a calm face. Her head fills about 75% of the image height, centred; her neck and the top of her plain top's collar show at the bottom edge. Her right ear, her jaw and the side of her neck are clear and unhidden (her hair tucked behind the ear). Copy her face, hair and skin tone exactly from the sheet and the attached ear close-up.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism.
```

#### HO. The boy's head, side-on
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the head and neck of the boy in the attached character sheet, seen exactly side-on from his right (we see his right ear), sitting up, looking straight ahead to the right of the picture, with a calm face. His head fills about 75% of the image height, centred; his neck and the top of his plain top's collar show at the bottom edge. His right ear, his jaw and the side of his neck are clear and unhidden. Copy his face, hair and skin tone exactly from the sheet and the attached ear close-up.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism.
```

#### FA. The foot and ankle, from the side (CLN-192)
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the bare right foot and lower leg of the child in the attached character sheet, seen exactly from the side (the inside of the foot towards us), resting on a doctor's white paper bed strip, the sole flat on it. The lower leg rises from the ankle and continues up and OUT of the top-left edge of the image, softly fading into the background, so the leg never stops dead. The foot fills about 60% of the image width, centred; five toes. Smooth, clean, healthy skin, exactly the sheet's skin tone; no mark.
Behind: the white paper strip and the soft pale blue-grey bed cover, out of focus.

Style: exactly as the attached sheet, the attached sole close-up and the style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. No drop shadow under the foot.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism. Five toes.
```

### Part E. The heal games' rows waiting on art

#### DM. Boing's drop machine, wider (CLN-106; question 35)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen straight on from the front: (1) the drop machine from the attached picture redrawn WIDER and shorter: the same look and colours, but its body about 1.6 times as wide as it is tall, with FOUR big round levers in one row along its front, evenly spaced with clear space between them (each gap at least as wide as a lever); (2) to its right, the four levers alone and the four drops they release, in one row: each lever and drop the same colour pair as on the machine. Plain: no writing, no numbers, no symbols.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No gradient, NO shadows on the magenta. Nothing touches anything else or the edges.

Style: exactly as the attached machine: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### NG. Truly neutral faces for the send-off (CLN-137)
```
Generate an image, 1536×1024, landscape.

Two front-on portraits side by side, each in its own half: the girl and the boy from the attached character sheets, from the top of the head to the shoulders, looking straight at us with a truly NEUTRAL face: mouth closed and relaxed, lips straight (NOT smiling, not sad), eyes open and calm. Copy each child's face, hair, skin tone and clothes exactly from their sheet.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows. The two never touch each other or the edges.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism.
```

#### MZ. The zoom's middle step, the face saying "aah" (CLN-163; reworded 3 Nov after ChatGPT refused the mouth-only framing)
```
Generate an image, 1536×1024, landscape, in the highest detail you can.

A friendly picture for a children's doctor game, the middle step of the camera moving in from the girl's whole face to the dentist's view of her teeth: the cartoon girl from the attached picture, front on, saying a big happy "aah" at the dentist exactly as in the attached picture, framed a little closer than it: from her eyebrows to just under her chin, her eyes open and calm, her cheeks and nose in the picture, her teeth clean and white. Copy her face, skin tone and style exactly; crisp, sharp detail.

Background: none needed: her face fills the whole image.

Style: exactly as the attached close-up and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism.
```

#### TH. The thermometer, photographic (CLN-175)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen from straight above, in one row: (1) a slim white digital thermometer with a silver tip and a small blank grey display window, lying flat; (2) the same thermometer with its display glowing soft green, BLANK (no digits); (3) the same with its display glowing soft red, BLANK (no digits). Photographic, like a real product photo, with a crisp clean outline.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The three never touch each other or the edges.

Style: semi-photoreal, like a real product photo in the game's soft warm light, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. The displays show NO digits or symbols.
```

#### KB. The knee bandage, wrapping round (CLN-179)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME knee close-up as the attached picture four times in an invisible grid of 2 columns and 2 rows, the same knee, size and place in every cell, with a photographic cream crepe bandage being wrapped around it, each turn curving round the knee and reaching both edges of the leg: (1) one turn of bandage just below the kneecap; (2) two turns; (3) three turns covering the kneecap; (4) fully wrapped, neat, the end tucked in. The bandage looks like a real crepe bandage, soft woven texture, wrapping AROUND the leg (never a flat strip on top).

Background: exactly as the attached knee close-up.

Style: the knee exactly as the attached close-up and style anchor; the bandage semi-photoreal. Soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### TB. The toothbrush, the right way round (CLN-180)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen exactly side-on, in one row: (1) a child's toothbrush lying horizontally, its handle running straight to the RIGHT and its head on the LEFT, the bristles pointing straight UP; (2) the same toothbrush with a small blob of white toothpaste on the bristles; (3) the same toothbrush with a little white foam on the bristles. The handle is one straight, untwisted line, a soft pastel blue, plain: no writing, no pattern.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The three never touch each other or the edges.

Style: semi-photoreal in a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### TC. The taste cup, sitting right (CLN-196)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game, seen from the front about 20 degrees down, in one row: (1) a small plain brushed-steel cup, as in the attached picture, standing upright, empty; (2) a plain white enamel cup with a thin dark-blue rim, standing upright, empty. Both drawn alone, with NO shadow under them and no surface: they will be placed on a table in the game.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No gradient, NO shadows on the magenta. The two never touch each other or the edges.

Style: semi-photoreal in a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### FL. The girl's forearm resting in her lap (CLN-43)
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the girl from the attached character sheet sitting on the doctor's bed, seen from the front and a little above, framed on her lap: her right forearm resting across her lap, palm down, from the elbow (at the left) to her relaxed hand (at the right), five fingers, her other hand resting beside it. Her sleeve rolled neatly to just below the elbow; her clothes as in her sheet, nothing lifted. The bare forearm is the main thing, across the middle. Smooth, clean skin, exactly her sheet's skin tone; no mark. The background soft and out of focus, never washed out.

Style: exactly as the attached sheet, the attached forearm close-up and the style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism. Five fingers.
```

#### BT. Nine body-part tiles (ART-12)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: nine small square picture tiles in an invisible grid of 3 columns and 3 rows, each showing ONE body part of the girl in the attached character sheet, clothed as in her sheet (nothing lifted), cropped close so the part fills its tile: (1) her hand, back of the hand; (2) her leg from knee to foot, standing; (3) her bent elbow; (4) her tummy, clothed, her hands resting on it; (5) her chest, clothed, front on; (6) the side of her neck; (7) her back, clothed, seen from behind; (8) the top of her head and her hair; (9) her shoulder. Each tile a soft rounded square with the same soft pale background inside it.

Background between the tiles: one perfectly flat, uniform neutral mid-grey, hex #808080. No gradient, NO shadows. The tiles never touch each other or the edges. Do not draw grid lines.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism.
```

### Part F. The stove family's roll-out (block 4, folded in: Zafar, 3 Nov)

*So every stove game can be brought to chai's standard at once: daar's chop needs a better background (ART-37, CHT-16), samosa's
pastry and folds don't yet read (ART-37), and baking's amounts get their own word moment in baking's art (ART-38; chai's is WV, WG,
WS and WF from block 1: the streams WS and the snap WF are reused).*

#### KC. The chop board, the chop game's whole scene (ART-37, CHT-16)
```
Generate an image, 1536×1024, landscape.

A background for a children's cooking game: a big rectangular walnut chopping board seen from EXACTLY straight above, lying on the cream-white marble worktop of the attached kitchen tile, filling the picture: the board covers the middle 80% of the width and 85% of the height, its edges straight and parallel to the picture's edges, its corners softly rounded. Rich warm walnut grain, a few faint knife marks, clean and dry; a thin band of the marble shows all round it. The board is completely EMPTY: no vegetables, no knife, no bowls, no crumbs, no hands. Warm afternoon light from the upper left, the same light as our kitchen.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SF. The samosa strip: fill and fold, six states (ART-37)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME long strip of raw samosa pastry six times, standing upright, seen from EXACTLY straight above, in one row, each in its own sixth, the same width; the attached pictures are our pastry and our filling: copy their colour and texture.
(1) the flat empty strip, pale and matte, a few faint flour specks;
(2) the same strip with a small heap of the attached mince filling at its BOTTOM end;
(3) the bottom corner folded diagonally up over the filling into a triangle: the fold has visible thickness and a soft shadowed edge, the filling hidden, the rest of the strip flat above it;
(4) the triangle folded straight up once more, the strip shorter, two layers of pastry clearly visible at the edges;
(5) folded diagonally again, only a short tail of strip left at the top;
(6) the finished raw samosa: one neat plump triangle, its last flap pressed down and sealed, three layers visible at the edges.
Each fold is clearly thicker and layered: never lines drawn on a flat sheet.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No board, no gradient, NO shadows on the grey. The six never touch each other or the edges.

Style: a stylised 3D animated-feature-film look, semi-photoreal food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BV. Baking's word moment: the scoop held tilted (ART-38)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: two identical OPAQUE brushed-steel measuring scoops with short straight handles, side by side, seen exactly from the side, both tilted forward about 35 degrees with the lip down to the left, exactly as the attached chai kettle is tilted: (1) dry and empty; (2) with only a little soft white flour at its lip, no long stream. No hand, arm or person.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. The two never touch each other or the edges.

Style: exactly as the attached kettle: a stylised 3D animated-feature-film look, semi-photoreal steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### BW. Baking's word moment: the jug side-on, filling (ART-38)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME clear glass measuring jug as the attached one, seen EXACTLY from the side, the same size on the same line, in an invisible grid of 5 columns and 2 rows. Its sides have plain horizontal lines and NO numbers.
Row 1, filled with soft white FLOUR (a flat top): empty, a quarter, exactly half, three quarters, full to the top line.
Row 2, filled with clear WATER (a flat top with a soft highlight): empty, a quarter, exactly half, three quarters, full to the top line.
Half and full are obvious at a glance; nothing spills.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, NO shadows on the grey. Nothing touches a cell's edge. Do not draw grid lines.

Style: exactly as the attached jug and the attached chai glasses: a stylised 3D animated-feature-film look, semi-photoreal glass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- **Cut** with `artcut.py` (a cut spec `s17-art3.cut.json` when the images land): sheets by their gutters; magenta and grey keyed out;
  the arm and palm close-ups and the heads kept whole (the paper strip is their background).
- **Wire** at each game's roll-out (the scrape in Sprint 19; clinic care in Sprint 20); block 1's redos into eggs, baking and the
  corn stall at Sprint 18.
- **Every piece's target size** is the close-up's play area at 1920x1080 (the arm and palm about 1500 px wide; items at least 256 px).

## 7. Questions for Zafar (answered 3 Nov: yes to all four)

1. Run this block as it is (35 prompts, about 50 images, about 3 hours in three windows)? *Recommended.*
2. DM (the wider drop machine) is the answer to question 35's "redraw it wider". *Recommended*; else skip DM.
3. The plasters, thermometer, drops and bandage semi-photoreal, the people stylised. *Recommended.*
4. The cake's art from block 1 stays with the cake if it moves to the word-tiles family. *Recommended.*
