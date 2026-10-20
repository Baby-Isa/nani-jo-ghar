# Sprint 9 full art plan (pack `s09b`)

**Written:** 20 Oct 2026, after Zafar agreed the road's style from the s09r ride videos and the s09a redo (the house, Nani by the fire, the book from the child's seat). Decisions: the sprint file's 20 Oct lines (the door: sky its own layer, Nani as pose cut-outs at the foot of the steps, the empty house drawn smaller with more garden either side; the road: the farm road's things in three groups, `s09r-art-plan.md` §7). **Run spec:** `build/tools/art/specs/s09b.run.yaml`; the block is generated from it.

## 0. Totals

| Part | What | Images |
|---|---|---|
| **A** | Skies: sunny, cloudy, raining, night (one each; code adds the falling rain and the twinkle) | 4 |
| **B** | The door: the empty house, wider; Nani's door poses (two sheets); her face close-up for the book's camera | 4 |
| **C** | The road: the far hills redone to loop, the car window redone for tablets | 2 |
| **D** | The farm road's things: two animal sheets, two sheets of vehicles and things in the sky, one of landmarks | 5 |
| **E** | The book's find-it spreads: the farm field, Nani's kitchen | 2 |
| | **Total** | **17**, about 70 minutes |

## 1. Flaws and uncertainties first

1. **Nani is a real person:** the poses and the close-up are judged for likeness by Zafar after the run. The runner keeps the first that passes the checks.
2. **Looping layers are still a risk** (s09r: ChatGPT drew a different hill height at each edge). F2 is an edit of the kept far hills that only evens the edges; if it fails, the cutter makes the loop by mirroring.
3. **Cut-outs on flat magenta** (#FF00FF), as in s09r, so nothing pink or purple in those images; Nani's poses go on flat mid-grey (her red dupatta is too close to magenta).
4. **Shops for the road** wait for the shops game's art (Zafar, 20 Oct); not in this run.
5. **No text anywhere**, including the bus, the van and the windmill.

## 2. How Zafar runs it

Paste the Claude in Chrome block (`s09b-chrome-block.txt`). It makes each image in a fresh ChatGPT chat with the listed attachments and downloads the kept images from ChatGPT's Library at the end. Push them with the log; Claude judges, cuts and wires.

## 5. The prompts

#### S1. Sky, sunny morning
```
Generate an image, 1536×1024, landscape.

Only sky, nothing else: a clear, bright, warm morning sky, soft blue getting a little paler towards the bottom, with a friendly round sun in the upper RIGHT quarter (soft glow, no lens flare) and two or three small soft white clouds. The upper LEFT quarter stays plain open sky (the game puts a speech bubble there). No ground, no hills, no trees, no birds, no buildings: the bottom edge is just sky.

Style: the same stylised 3D animated-feature-film look as the attached pictures, soft and clean, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### S2. Sky, cloudy morning
```
Generate an image, 1536×1024, landscape.

Only sky, nothing else: a soft cloudy morning, big rounded friendly grey-white clouds over a pale blue sky, gentle and calm, not stormy; a faint brighter patch where the sun is hidden in the upper RIGHT quarter. The upper LEFT quarter is plain soft cloud with nothing busy (the game puts a speech bubble there). No ground, no hills, no trees, no birds, no buildings: the bottom edge is just sky.

Style: the same stylised 3D animated-feature-film look as the attached pictures, soft and clean, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### S3. Sky, raining
```
Generate an image, 1536×1024, landscape.

Only sky, nothing else: a rainy day sky, soft rounded blue-grey rain clouds covering it, cosy rather than gloomy, a little lighter towards the bottom. Draw NO raindrops, streaks or lightning (the game draws the falling rain). The upper LEFT quarter is plain soft cloud with nothing busy (the game puts a speech bubble there). No ground, no hills, no trees, no birds, no buildings: the bottom edge is just sky.

Style: the same stylised 3D animated-feature-film look as the attached pictures, soft and clean, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### S4. Sky, night
```
Generate an image, 1536×1024, landscape.

Only sky, nothing else: a calm, friendly night sky, deep blue (not black) getting a little lighter towards the bottom, a soft glowing crescent moon in the upper RIGHT quarter and small gentle stars scattered across it. The upper LEFT quarter has only a few faint stars (the game puts a speech bubble there). No ground, no hills, no trees, no buildings: the bottom edge is just sky.

Style: the same stylised 3D animated-feature-film look as the attached pictures, soft and clean, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious symbols: the moon is just the moon, with no star beside it in a symbol.
```

#### H3. The empty house, wider
```
Generate an image, 1536×1024, landscape.

The SAME house as the attached picture (sand and cream textured render, one big rounded arch over the porch, the wooden double door standing open with a glimpse of the hallway, two wall lamps, the porch steps, terracotta pots, pink and white flowering bushes), but EMPTY: no people at all. Seen straight on from the path at a child's eye height, from a little further back, so the house takes only the middle 60 percent of the width and more garden, low walls and bushes continue to the left and right edges. The roofline is one straight horizontal line about a third of the way down; above it the top third is ONE even, pale, empty sky with nothing crossing it (the game replaces it with the day's sky). The path and the steps run down to the bottom edge, with clear open paving at the foot of the steps (the game stands Nani there).

Light: soft, even, overcast daylight with NO cast shadows anywhere (the game adds sunshine on sunny days).

Style: exactly as the attached house: a stylised 3D animated-feature-film look, soft global illumination, calm and uncluttered, made for young children. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No people. No religious images or markers.
```

#### N1. Nani at the door, poses sheet 1
```
Generate an image, 1536×1024, landscape.

Four full-figure poses of Nani, the woman in the attached character sheet (her locked look: the sheet's face, round glasses, plain cream kameez with red motifs, plain red dupatta, slim build, no rings; fully covered modest clothing), side by side in one row, evenly spaced and well apart, all at exactly the same size and scale, feet on one level baseline, each facing the viewer and smiling: (1) waving the viewer in with one hand; (2) both arms open in welcome; (3) pointing up at the sky with one hand, looking up a little; (4) holding a plain red umbrella open over her head. The background is ONE flat, even, mid-grey with no floor, no shadow and no gradient (it is cut away later).

Style: exactly as the attached character sheet and house: the same stylised 3D animated-feature-film look, soft even light, no cast shadows. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

#### N2. Nani at the door, poses sheet 2
```
Generate an image, 1536×1024, landscape.

Three full-figure poses of Nani, the woman in the attached character sheet and the attached first poses sheet (exactly the same look and the same size and scale as in the poses sheet), side by side in one row, evenly spaced and well apart, feet on one level baseline, each facing the viewer: (1) standing calmly with her hands loosely together in front of her, smiling, listening; (2) fanning her face with one hand on a hot day, smiling; (3) shading her eyes with one hand and looking up at the sky. Fully covered modest clothing, no rings. The background is ONE flat, even, mid-grey with no floor, no shadow and no gradient (it is cut away later).

Style: exactly as the attached pictures: the same stylised 3D animated-feature-film look, soft even light, no cast shadows. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

#### C1. Nani's face, close up by the fire
```
Generate an image, 1536×1024, landscape.

A close-up of Nani in the attached evening scene, as if the camera has moved in on her: the same woman, armchair, warm lamplight and fire glow, now seen at head-and-shoulders size, her face matching the attached character sheet exactly (round glasses, red dupatta over her head, slim face), smiling warmly at the viewer as if asking a child about their day. The top edge of the open book on her lap shows along the bottom of the picture. Her face is in the middle of the picture, sharp and detailed.

Style: exactly as the attached evening scene: the same stylised 3D animated-feature-film look, warm lamplight and the soft orange glow of the fire, gentle shadows. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

#### F2. The far hills, made to loop
```
Edit the attached image. Keep everything exactly as it is (the hills, their colours, the little trees and the flat magenta above them), except at the far left and far right edges: change only the outer tenth of the width on each side so that the hill line meets the left edge and the right edge at EXACTLY the same height, as plain, gentle, empty hillside with no trees, so the picture can be repeated end to end with no step. Do not move, resize or recolour anything else. The magenta above stays one flat, pure #FF00FF.
```

#### W1. The car window, redone for every screen
```
Generate an image, 1536×1024, landscape.

The same family car interior as the attached picture, from the back seat, looking out of the side window, but framed so the window opening sits in the MIDDLE of the picture: the opening takes about 60 percent of the height and 65 percent of the width, with the car's inside showing all round it: the roof lining and grab handle above, a pillar and part of the seat on each side, the door panel with its armrest and handle below. The window opening is filled with ONE flat, even, pure green, hex #00FF00, with no reflections, no gradient and nothing seen through it.

Style: exactly as the attached picture: a stylised 3D animated-feature-film look, warm daylight, soft global illumination, clean simple shapes. No outlines.

No people. Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### A1. Farm animals 1
```
Generate an image, 1536×1024, landscape.

Four separate farm animals for a game, in one row, evenly spaced, each whole and well apart, standing on one level baseline, all seen from the side facing LEFT, with a friendly face turned a little towards the viewer: a cow, a sheep, a donkey and a horse, at natural sizes relative to each other. Drawn exactly in the style of the attached animals (rounded, friendly, warm colours, soft fur and wool). The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached animals: the same stylised 3D animated-feature-film look, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### A2. Farm animals 2
```
Generate an image, 1536×1024, landscape.

Four separate animals for a game, in one row, evenly spaced, each whole and well apart, standing on one level baseline, all seen from the side facing LEFT, with a friendly face turned a little towards the viewer: a water buffalo, a duck, a camel, and a mother hen with three small yellow chicks close beside her (the hen and chicks together count as one). At natural sizes relative to each other. Drawn exactly in the style of the attached animals. The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached animals: the same stylised 3D animated-feature-film look, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### V1. Things on the road 1
```
Generate an image, 1536×1024, landscape.

Four separate vehicles for a game, in one row, evenly spaced, each whole and well apart, on one level baseline, all seen exactly from the side facing LEFT: a friendly single-decker bus, a small red tractor, a child's-eye bicycle (no rider), and a small family car. Rounded, toy-like proportions, warm plain colours, every window empty (no people, no driver). No writing, numbers, number plates, route boards or logos anywhere. The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached pictures: the same stylised 3D animated-feature-film look, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### V2. Things on the road 2
```
Generate an image, 1536×1024, landscape.

Four separate things for a game, in one row, evenly spaced, each whole and well apart: a small delivery van carrying milk churns (side view facing LEFT, on the baseline, no driver, no writing), a colourful diamond kite with a ribbon tail, a small friendly aeroplane seen from the side flying LEFT, and a big yellow butterfly with open wings. The van stands on one level baseline; the kite, aeroplane and butterfly are drawn in the air above it, each whole. The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached pictures: the same stylised 3D animated-feature-film look, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### L1. Landmarks
```
Generate an image, 1536×1024, landscape.

Three separate things for a game, in one row, evenly spaced, each whole and well apart: an old farm windmill with four sails (standing on the baseline), a round stone well with a little tiled roof and a bucket (on the baseline), and a rainbow arc (in the air, a soft, bright, rounded arc, both ends ending in small soft clouds). The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached pictures: the same stylised 3D animated-feature-film look, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta and the rainbow's own violet band.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

#### K1. Find it: the farm, across the book's two pages
```
Generate an image, 1536×1024, landscape.

A sunny farm field scene for a picture book, filling the whole image, with NO animals and NO people (the game adds them): soft green grass across the whole lower two thirds, a wooden fence and a few round trees in the distance, gentle hills, a calm blue sky with two soft clouds at the top. The middle tenth of the width, where the book's centre fold will be, is only plain grass and sky: nothing standing there. Plenty of open grass for things to stand on, on both the left and right halves.

Style: exactly as the attached picture book and animals: the same stylised 3D animated-feature-film look, soft global illumination. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### K2. Find it: Nani's kitchen, across the book's two pages
```
Generate an image, 1536×1024, landscape.

Nani's kitchen as in the attached picture, drawn for a picture book and filling the whole image, with NO food, NO dishes and NO people (the game adds them): the warm tiled wall and window, a long clean worktop running across the whole width at about the middle height with empty space on it, cupboards below. The middle tenth of the width, where the book's centre fold will be, has nothing standing in it. Plenty of open worktop for things to stand on, on both the left and right halves.

Style: exactly as the attached pictures: the same stylised 3D animated-feature-film look, warm daylight, soft global illumination. No outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

## 6. Cut and wire notes

- Skies: full frame, cropped by code from the bottom for each screen; the sun or moon stays in the upper right.
- H3: the sky above the roofline cut away; Nani's poses (N1, N2) cut from grey to one canvas each, feet on one baseline, at the same scale.
- C1: the camera's "face" shot, lined up with b1 v2 before the zoom onto the book.
- F2: replaces far-hills; if its edges still differ, the cutter mirrors alternate copies.
- W1: keyed like r1; the opening's box measured into data/day.json.
- A1, A2, V1, V2, L1: cut by `cut_s09r.py`'s method (one sprite per piece, magenta keyed, rim from the thing's own colour).
- K1, K2: the book's find-it backdrops, split at the fold.
