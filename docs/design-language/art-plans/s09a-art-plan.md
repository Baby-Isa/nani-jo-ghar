# Sprint 9 style test art plan (pack `s09a`)

**Written:** 19 Oct 2026; H1, B1, B2 and L4 rewritten 20 Oct (Zafar chose try 3, the big arch with flowers; Fable's review build/reports/s09a-fable-review.md) (Zafar: closer, Nani bigger, a third of sky for the weather and the sun, moon and stars; L4 nothing over the fold; the books and the windows are liked and kept in `sources/art/s09a/`), from Zafar's notes on the s09 mock-ups (`docs/sprints/S09-a-day-at-nanis.md`, 19 Oct) and the book-games research (`build/reports/research-book-games-2026-10-19.md`). **Run spec:** `build/tools/art/specs/s09a.run.yaml`; the block is generated from it. This is a style test: one image per prompt, so Zafar can agree how the house, the ride and the evening book look. After that, the full Sprint 9 run makes every pose and variation. The Sprint 8 fix run (`s08c`) comes after this one.

## 0. Totals

| Part | What | Images |
|---|---|---|
| **A** | The house front, two versions (one wide arch; a row of small arches), Nani in the porch | 2 |
| **B** | The ride: a car window and a bus window, the opening keyed green | 2 |
| **C** | The evening book: Nani by the fireplace in the little library, and the open book close up | 2 |
| **D** | Book layout tests: find it in the picture, name it, stick in the photo, our day in order (Zafar, 19 Oct) | 4 |
| | **Total** | **10**, about 40 minutes |

## 1. Flaws and uncertainties first

1. **Nani is based on a real person,** so Zafar judges her likeness after the run, in chat. The runner keeps the first image that passes the checks and doesn't wait for him.
2. **The weather is added in code,** so the house's sky is left plain. If ChatGPT paints a sun or clouds anyway, it can be masked out.
3. **The windows are keyed on flat green,** so the moving road shows through. Any reflection on the green has to be cut by hand.
4. **The layout tests show where things go, not the final art.** The words, the speaker buttons and the game logic are drawn by code on the book's plain pages.

## 2. How Zafar runs it

Paste the Claude in Chrome block (`s09a-chrome-block.txt`). It opens this page, makes each image in a fresh ChatGPT chat with the listed attachments, and you download the kept images from ChatGPT's Library. Then paste them into the Claude chat with your notes, and Claude rewrites the prompts.

## 5. The prompts

#### H1. Nani's house, the big arch with flowers (closer)
```
Generate an image, 1536×1024, landscape.

The SAME house as the attached first try (Zafar's choice): cream and sand textured render, ONE big rounded arch over the porch with the wooden double door standing open behind it and a glimpse of the hallway, two wall lamps, potted plants and pink and white flowering bushes around the arch and along the low walls. Nani, the woman in the attached character sheet (her locked look: the sheet's face, glasses, plain cream kameez with red motifs, plain red dupatta, slim build, no rings; fully covered modest clothing), stands DEAD CENTRE in the porch, smiling and waving the viewer in. The camera is closer than the first try, on the path at a child's eye height, looking straight at her: her full figure, feet on the porch step and head just under the arch's crown, takes about 55 to 60 percent of the image's height. Keep the outer 15 percent of the width at each side free of anything important (only plants and wall), because the game puts cards there. The roofline is one straight horizontal line about a third of the way down; above it, the top third of the image is ONE even, pale, empty sky: nothing crosses it (no trees, no sun, moon, clouds or birds), because the game paints the weather, the time of day, the sun, moon and stars there.

Light: soft, even, overcast daylight with NO cast shadows (no leaf shadows on the walls, no sun patches on the floor): the game adds sunshine and shadows on sunny days.

Style: exactly as the attached first try and the style anchor: a stylised 3D animated-feature-film look, soft global illumination, calm and uncluttered, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

#### H2. Nani's house, a row of small arches (closer)
```
Generate an image, 1536×1024, landscape.

Nani, the woman in the attached character sheet (her locked look: same face, glasses, plain cream kameez with red motifs, plain red dupatta, slim build, no rings; fully covered modest clothing), stands under the middle arch of her verandah, smiling and waving the viewer in. The camera stands on the path just two or three steps from the verandah, at a child's eye height, looking straight at her: she is the centre of the picture, her full figure from head to feet taking about HALF of the image's height, standing in the lower half, her face clear and easy to read. The same house as the attached first try (warm white and terracotta textured render, a verandah under a row of small rounded arches, the blue front door standing open behind her, a wooden bench and a pot of herbs), but seen much closer: only the middle arch and part of each arch beside it show. The top THIRD of the image is open, plain, soft, even sky above the roof line, with nothing in it: no sun, moon, clouds or birds (the game paints the weather, the time of day, the sun, moon and stars there).

Style: exactly as the attached first try and the style anchor: a stylised 3D animated-feature-film look, warm sunlight, soft global illumination, gentle shadows, calm and uncluttered, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

#### R1. Looking out of the car window
```
Generate an image, 1536×1024, landscape.

The view from the back seat of a family car, looking out of the side window. Only the inside of the car shows, round the edges of the image: the window frame and rubber seal, a pillar on each side, the roof lining along the top, the top of the door panel with its armrest along the bottom. The window opening takes up most of the image and is filled with ONE flat, even, pure green, hex #00FF00, with no reflections, no gradient and nothing seen through it (the moving road is added later).

Style: exactly as the style anchor: a stylised 3D animated-feature-film look, warm daylight, soft global illumination, clean simple shapes. No outlines.

No people. Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### R2. Looking out of the bus window
```
Generate an image, 1536×1024, landscape.

The view from a bus seat, looking out of a wide side window. Only the inside of the bus shows, round the edges of the image: the window frame with a slider latch, a metal grab rail along the top, the top of the seat back in front at the bottom left. The window opening takes up most of the image and is filled with ONE flat, even, pure green, hex #00FF00, with no reflections, no gradient and nothing seen through it (the moving road is added later).

Style: exactly as the style anchor: a stylised 3D animated-feature-film look, warm daylight, soft global illumination, clean simple shapes. No outlines.

No people. Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### B1. The evening book: Nani by the fireplace
```
Generate an image, 1536×1024, landscape.

The same cosy home library as the attached first try, in the evening: a small fireplace with a low, gentle fire behind a guard, wooden bookshelves with only a few books and ONE whole shelf at about her shoulder height completely empty (ready for new books), a small rug and a reading lamp. Nani, the woman in the attached character sheet (her locked look: the sheet's face, glasses, plain cream kameez with red motifs, plain red dupatta, slim build, no rings; fully covered modest clothing), sits in the armchair beside the fire, a little left of centre, full figure, turned towards the viewer. She holds a large open picture book up on her lap, turned to FACE THE VIEWER, as if reading a story to the child sitting in front of her; its two open pages are plain cream with NOTHING printed on them. Match the attached character sheet closely: her face exactly as on the sheet, and a slim build (not heavy).

Style: exactly as the attached first try and the style anchor: a stylised 3D animated-feature-film look, warm lamplight and the soft orange glow of the fire, gentle shadows, calm, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks, not on the book spines either. No religious images or markers.
```

#### B2. The open book, close up, from the child's seat
```
Generate an image, 1536×1024, landscape.

The view of a child sitting on the rug in front of Nani's armchair (the attached first try's scene), looking up at the storybook she holds open towards them, square-on. The open book faces the VIEWER and fills about three quarters of the image's width: two plain cream pages with a thin gold border and NOTHING printed on them, the spine down the middle, the pages flat enough to draw on, seen straight on (not tilted or keystoned). Nani's hands hold the book's outer edges from behind; above the top of the book you see only her chin and the red dupatta and cream kameez of the attached character sheet, softly lit; her face is out of the top of the frame. Behind, softly out of focus, the armchair, the fire's glow and the shelves.

Style: exactly as the attached first try and the style anchor: a stylised 3D animated-feature-film look, warm evening lamplight and firelight. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### L1. Book layout test: find it in the picture
```
Generate an image, 1536×1024, landscape.

The same open storybook as the attached close-up, held on Nani's lap, facing the viewer. Across BOTH pages runs one picture of a sunny farm: a red hen, a goat, a brown cow, a small tractor, a haystack, a stone well and two trees, each one whole, clearly apart from the others and easy to tap, none overlapping. The picture sits inside the thin gold border, the spine runs down the middle.

Style: exactly as the attached close-up and the style anchor: a stylised 3D animated-feature-film look; the book in warm evening lamplight, the farm picture bright and sunny. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### L2. Book layout test: name it
```
Generate an image, 1536×1024, landscape.

The same open storybook as the attached close-up, held on Nani's lap, facing the viewer. LEFT page: ONE large picture of a single thing from the day, a glass of milky chai on a saucer, whole and centred, filling most of the page. RIGHT page, upper half: a short row of four rounded cream tiles with nothing on them (where Nani's sentence goes). RIGHT page, lower half: THREE round cream buttons in a row, each with only a small simple speaker symbol on it, well apart.

Style: exactly as the attached close-up and the style anchor: a stylised 3D animated-feature-film look, warm evening lamplight on the book. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks; the speaker symbol is the only mark on the buttons.
```

#### L3. Book layout test: stick in the photo
```
Generate an image, 1536×1024, landscape.

The same open storybook as the attached close-up, held on Nani's lap, facing the viewer. LEFT page: one EMPTY square photo frame with little corner mounts and a dashed outline, in the upper two thirds; under it a short row of four rounded cream tiles with nothing on them (where Nani's sentence goes). RIGHT page: THREE square instant photos lying loose and slightly tilted, well apart: a big brown cow in a field, a goat in a farmyard, a red hen. Each photo is whole and none overlaps another.

Style: exactly as the attached close-up and the style anchor: a stylised 3D animated-feature-film look, warm evening lamplight on the book, the photos bright and sunny. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### L4. Book layout test: our day, in order
```
Generate an image, 1536×1024, landscape.

The same open storybook as the attached close-up, held on Nani's lap. FIVE square instant photos stuck in with little corner mounts: THREE on the LEFT page and TWO on the RIGHT page, each photo wholly on its own page, well clear of the spine and the centre fold (nothing crosses or touches the fold). They run in reading order, top to bottom on the left page and then on the right, joined by a soft dotted line that stops at the fold and starts again on the right page: a blue front door standing open; fields seen through a car window; a goat in a farmyard; a hen with chicks; and the FIFTH frame empty, a dashed outline waiting for its photo. The photos are evenly spaced and none overlaps another.

Style: exactly as the attached close-up and the style anchor: a stylised 3D animated-feature-film look, warm evening lamplight on the book, the photos bright and sunny. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

## 6. Cut and wire notes

H1-H2 become the door's fixed house (the sky is masked and swapped by weather). R1-R2 are keyed on #00FF00 for the window ride's frame. B1 is the evening opening; the camera moves from it into B2, which is the review's surface. L1-L4 only test the layout: the game draws its pictures, sentence, speaker buttons and photos on B2's plain pages.
