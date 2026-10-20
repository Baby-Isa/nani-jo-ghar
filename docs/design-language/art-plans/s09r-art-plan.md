# Sprint 9 road style test art plan (pack `s09r`)

**Written:** 20 Oct 2026, from Zafar's yes to the road plan (sprint file, 20 Oct): three looping layers per trip (far, middle, near), items on two ground lines placed by code, cut-out props to peek behind, the items speeding up with the car. **Look (Zafar, 20 Oct):** the animals in the book layout tests (`l1`, `l3`) and Nani's house are the guide for the animals, scenery, fields and shops. **Run spec:** `build/tools/art/specs/s09r.run.yaml`; the block is generated from it. This is a style test: Zafar agrees the window view from a coded preview (the layers scrolling behind the car window at the three speeds) before the full s09b run makes every trip, weather and item.

## 0. Totals

| Part | What | Images |
|---|---|---|
| **A** | The whole view from the car, two looks: the farm road (C1) and the road out of town past shops (C2) | 2 |
| **B** | The farm road split into its three looping layers: far hills (F1), middle fields (M1), near verge (N1); and the town's middle layer of shops (T1) | 4 |
| **C** | Cut-outs: props to peek behind (P1), the animals that pass (I1), the two doors (D1) | 3 |
| | **Total** | **9**, about 40 minutes |

## 1. Flaws and uncertainties first

1. **Seamless loops are the risk.** ChatGPT can't promise a picture whose left edge joins its right. So every layer keeps the outer tenth of each side plain and level (no object cut by the edge), and code joins the ends with a soft cross-fade; the seam tool proves it on the cut.
2. **Keyed on flat magenta (#FF00FF), not green,** because the fields, hedges and bushes are green. So no pink or purple flowers anywhere in this run.
3. **The items are those the ride already uses** (goat, hen, dog, bird, the red and green doors). There is no cow: it has no Kutchi word yet. The goat and the hen already have art; I1 redraws them only so all four animals match.
4. **The skies come in s09b** (one per weather and time of day). The preview uses the current placeholder sky.
5. **The car window is the kept r1** for now, fitted by height; s09b redoes it with the opening in the middle 60% of the height (Fable's review).

## 2. How Zafar runs it

Paste the Claude in Chrome block (`s09r-chrome-block.txt`). It makes each image in a fresh ChatGPT chat with the listed attachments and downloads the kept images from ChatGPT's Library at the end. Push them to `sources/art/s09r/` with the log; Claude judges, cuts and builds the scrolling preview for you to agree.

## 5. The prompts

#### C1. The farm road, the whole view
```
Generate an image, 1536×1024, landscape.

What a child sees from the back seat of a car driving along a quiet country road to a farm, on a sunny morning, but WITHOUT the car: just the view, as one wide scene. Three clear depths, one behind the other: far away, soft rolling hills with a few small round trees; in the middle, green fields with hedgerows, a wooden fence and a few round trees; close up, a strip of grass verge along the bottom of the picture with a low dry-stone wall in places. In the near verge: a goat, a hen, a small brown dog and a bird on a fence post, spaced well apart, all facing left; a small haystack and a round bush. Leave the top third as plain, even, pale blue sky with nothing in it.

Style: exactly as the attached book pictures: the same animals (the goat, the hen) and the same stylised 3D animated-feature-film look, rounded friendly shapes, soft global illumination, clean and uncluttered, made for young children; the warm materials of the attached house (sand-coloured render, terracotta pots) wherever a building shows. No outlines. No pink or purple flowers.

Do not add any text, letters, numbers, labels, signs, logos or watermarks. No people.
```

#### C2. The road out of town, past the shops
```
Generate an image, 1536×1024, landscape.

What a child sees from the back seat of a car driving slowly out of a small, sunny town, but WITHOUT the car: just the view, as one wide scene. In the middle distance, a row of small single-storey shops and houses in the style of the attached house: sand and cream textured render, rounded arches, wooden doors and shutters, awnings in plain warm colours, terracotta pots with green plants; one house has a red front door and one a green front door. Behind them, a few soft hills. Close up, a strip of pavement and grass verge along the bottom with a low wall in places. Leave the top third as plain, even, pale blue sky with nothing in it.

Style: exactly as the attached house and book pictures: the same stylised 3D animated-feature-film look, rounded friendly shapes, soft global illumination, warm and uncluttered, made for young children. No outlines. No pink or purple flowers.

Do not add any text, letters, numbers, labels, shop signs, logos or watermarks; the awnings and shop fronts stay blank. No people. No religious images or markers.
```

#### F1. Farm road layer 1: the far hills
```
Generate an image, 1536×1024, landscape.

The far layer of the attached farm-road view, on its own, for a scrolling game background: only the soft rolling hills and the few small round trees on them, in the same style, light and colours. The hills' top edge runs across the whole width at about 40 to 55 percent of the height; below it the hills simply continue to the bottom of the image. Everything above the hills is ONE flat, even, pure magenta, hex #FF00FF, with no gradient, haze or shadow (it is cut away later).

The picture must loop: its left and right edges will join end to end. So nothing is cut off by the left or right edge, the hill line meets the left and right edges at the SAME height, and the outer tenth on each side is only plain, gentle hillside.

Do not add any text, letters, numbers, labels, logos or watermarks. No people, animals or buildings. No pink or purple anywhere except the flat magenta.
```

#### M1. Farm road layer 2: the middle fields
```
Generate an image, 1536×1024, landscape.

The middle layer of the attached farm-road view, on its own, for a scrolling game background: only the green fields with their hedgerows, a wooden fence and three or four round trees, in the same style, light and colours. The top of the trees and hedges runs at about 30 to 50 percent of the height; the fields continue to the bottom of the image. Everything above them is ONE flat, even, pure magenta, hex #FF00FF, with no gradient, haze or shadow (it is cut away later).

The picture must loop: its left and right edges will join end to end. So nothing is cut off by the left or right edge (no tree, fence post or hedge end at the edge), the field line meets the left and right edges at the SAME height, and the outer tenth on each side is only plain field and low hedge.

Do not add any text, letters, numbers, labels, logos or watermarks. No people, animals or buildings. No pink or purple anywhere except the flat magenta.
```

#### N1. Farm road layer 3: the near verge
```
Generate an image, 1536×1024, landscape.

The near layer of the attached farm-road view, on its own, for a scrolling game background: only the strip of grass verge, close up, along the bottom, with tufts of grass, a few small stones and a short stretch of low dry-stone wall in the middle third, in the same style, light and colours. The top of the grass runs level across the whole width at about 60 percent of the height; the verge fills everything below it to the bottom. Everything above it is ONE flat, even, pure magenta, hex #FF00FF, with no gradient or shadow (it is cut away later).

The picture must loop: its left and right edges will join end to end. So nothing is cut off by the left or right edge, the grass line meets the left and right edges at the SAME height, and the outer tenth on each side is only plain grass.

Do not add any text, letters, numbers, labels, logos or watermarks. No people, animals, bushes, haystacks or buildings. No pink or purple anywhere except the flat magenta.
```

#### T1. Town layer 2: the row of shops
```
Generate an image, 1536×1024, landscape.

The middle layer of the attached town view, on its own, for a scrolling game background: only the row of small single-storey shops and houses, in the same style, light and colours (sand and cream render, rounded arches, wooden doors and shutters, plain warm awnings, terracotta pots with green plants), seen straight on, side by side along the whole width, their bases on one level line at about 85 percent of the height. Every door is plain wood: no red or green doors (those come separately). Everything above the roofs is ONE flat, even, pure magenta, hex #FF00FF, with no gradient or shadow (it is cut away later).

The picture must loop: its left and right edges will join end to end. So no building is cut off by the left or right edge: the row starts and ends with a short stretch of plain low wall at the same height on both sides.

Do not add any text, letters, numbers, labels, shop signs, logos or watermarks; the awnings and shop fronts stay blank. No people. No religious images or markers. No pink or purple anywhere except the flat magenta.
```

#### P1. Props to peek behind
```
Generate an image, 1536×1024, landscape.

Four separate things for a game, in one row, evenly spaced, side by side, each whole and well apart from the others, standing on one level baseline, seen from the side at a child's eye height, as they appear in the attached farm-road view: a round green bush, a small golden haystack, a short section of low dry-stone wall, and a round tree with a thick trunk. Each is big enough for a goat to hide half behind it. The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached farm-road view and book pictures: the same stylised 3D animated-feature-film look, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### I1. The animals that pass
```
Generate an image, 1536×1024, landscape.

Four separate animals for a game, in one row, evenly spaced, each whole and well apart from the others, standing on one level baseline, all seen from the side, facing LEFT, with a friendly face turned a little towards the viewer: a goat, a hen, a small brown dog, and a small bird perched on a short fence post. The goat and the hen are exactly as in the attached book pictures; the dog and the bird are drawn to match them. Natural sizes relative to each other (the goat biggest, the bird smallest). The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached book pictures: the same stylised 3D animated-feature-film look, rounded friendly shapes, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### D1. The red door and the green door
```
Generate an image, 1536×1024, landscape.

Two small separate cottage fronts for a game, side by side, well apart, standing on one level baseline, seen straight on, in the style of the attached house: sand-coloured textured render, a rounded arch over the door, a terracotta pot beside it. The two are IDENTICAL in every way except the colour of the front door: the left one has a red door, the right one a green door (clear, plain, mid-tone colours, the same wood panelling). Only the front wall with its door shows, no roof depth. The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached house: the same stylised 3D animated-feature-film look, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, house numbers, logos or watermarks. No people. No religious images or markers.
```

## 6. Cut and wire notes

- Key magenta to alpha, erode 1 px; trim each layer to its content band; a layer's loop is made by cross-fading its outer tenth (the seam tool checks the join).
- P1, I1 and D1 are cut into one sprite each, bottoms on the baseline, so code stands them on the near line (bigger) or the field line (smaller).
- The preview: the kept r1 window, fitted by height, over the sky placeholder, F1 at 0.15, M1 (or T1) at 0.4, N1 at 1, items and props on the two lines; recorded at slow, normal and fast for Zafar.
