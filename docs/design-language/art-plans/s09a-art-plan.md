# Sprint 9 style test art plan (pack `s09a`)

**Written:** 19 Oct 2026, from Zafar's notes on the s09 mock-ups (`docs/sprints/S09-a-day-at-nanis.md`, 19 Oct) and the book-games research (`build/reports/research-book-games-2026-10-19.md`). **Run spec:** `build/tools/art/specs/s09a.run.yaml`; the block is generated from it. This is a style test: one image per prompt, so Zafar can agree how the house, the ride and the evening book look. After that, the full Sprint 9 run makes every pose and variation. The Sprint 8 fix run (`s08c`) comes after this one.

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

#### H1. Nani's house, one wide arch
```
Generate an image, 1536×1024, landscape.

The front of Nani's house, seen from the path a few steps away at eye level. A warm, modern family home (not old-fashioned) with textured, rendered walls in cream and sand. A deep shaded porch under ONE wide rounded archway; inside the porch the front door stands open, with a glimpse of a cool hallway. A few potted plants and a tiled step. Nani, the woman in the attached character picture (same face, clothes and proportions, fully covered modest clothing), stands in the porch, full figure, smiling and waving the viewer in. The porch sits a little right of centre; the ground in front of it is clear.

The top third of the image is plain, soft, even sky: no sun, no clouds (the weather is added later).

Style: exactly as the attached clinic doorway and the style anchor: a stylised 3D animated-feature-film look, warm sunlight, soft global illumination, gentle shadows, clean simple shapes, calm and uncluttered, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

#### H2. Nani's house, a row of small arches
```
Generate an image, 1536×1024, landscape.

The front of Nani's house, seen from the path, slightly from one side. A warm, modern one-storey family home (not old-fashioned) with textured, rendered walls in warm white and terracotta. Along the front, a shaded verandah under a row of THREE small rounded arches; behind the middle arch the blue front door stands open. A wooden bench, a pot of herbs and a low garden wall with a gap for the path. Nani, the woman in the attached character picture (same face, clothes and proportions, fully covered modest clothing), stands under the middle arch, full figure, smiling and waving the viewer in. The path in front is clear.

The top third of the image is plain, soft, even sky: no sun, no clouds (the weather is added later).

Style: exactly as the attached clinic doorway and the style anchor: a stylised 3D animated-feature-film look, warm sunlight, soft global illumination, gentle shadows, clean simple shapes, calm and uncluttered, made for young children. No outlines.

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

A small, cosy home library in the evening. Nani, the woman in the attached character picture (same face, clothes and proportions, fully covered modest clothing), sits in a comfortable armchair beside a small fireplace with a low, gentle fire behind a guard. She holds a large open picture book on her lap, turned to face the viewer, as if reading a story to them; its two open pages are plain cream with NOTHING printed on them. Behind her, wooden bookshelves with only a few books; ONE whole shelf at about her shoulder height is completely empty, ready for new books. A small rug and a reading lamp. Her full figure, a little left of centre.

Style: exactly as the attached clinic doorway and the style anchor, but in the evening: a stylised 3D animated-feature-film look, warm lamplight and the soft orange glow of the fire, gentle shadows, calm, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks, not on the book spines either. No religious images or markers.
```

#### B2. The open book, close up
```
Generate an image, 1536×1024, landscape.

A close-up of a large storybook lying open on Nani's lap, facing the viewer. The two open pages fill most of the image: plain cream paper with a thin gold border and NOTHING printed on them, the spine down the middle, the pages curving gently. Nani's hands, with the sleeves of the clothes in the attached character picture, hold the book's outer edges. Below the book, just her lap and the arm of the chair. The pages must stay plain: the game draws on them.

Style: exactly as the style anchor, in the evening: a stylised 3D animated-feature-film look, warm lamplight, the soft glow of a fire off to one side. No outlines.

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

The same open storybook as the attached close-up, held on Nani's lap, facing the viewer. Across both pages, FIVE square instant photos stuck in with little corner mounts, along a gentle path from the top left to the bottom right, joined by a soft dotted line: a blue front door standing open; fields seen through a car window; a goat in a farmyard; a hen with chicks; and the FIFTH frame empty, a dashed outline waiting for its photo. The photos are evenly spaced and none overlaps another.

Style: exactly as the attached close-up and the style anchor: a stylised 3D animated-feature-film look, warm evening lamplight on the book, the photos bright and sunny. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

## 6. Cut and wire notes

H1-H2 become the door's fixed house (the sky is masked and swapped by weather). R1-R2 are keyed on #00FF00 for the window ride's frame. B1 is the evening opening; the camera moves from it into B2, which is the review's surface. L1-L4 only test the layout: the game draws its pictures, sentence, speaker buttons and photos on B2's plain pages.
