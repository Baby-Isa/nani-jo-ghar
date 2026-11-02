# ChatGPT backgrounds: the feeding game (2 November 2026)

Zafar: give this file's GitHub link to Claude in Chrome. Three prompts, one picture each; you download them from ChatGPT's Library
at the end. They are for choosing a background, not yet game art. Written by a Fable reviewer after looking at every current
background (its notes below).

## Run instructions for Claude in Chrome

Follow part 1 of `build/reports/designs/chatgpt-prompt-sheet-2026-11-01.md` (the runner loop, the one retry, moving images, downloading
from the Library at the end), with these changes: 3 prompts, 3 windows, no kept:X pictures, no people. Paste each code box exactly.

### References (short name, raw URL)

| Short name | Raw URL |
|---|---|
| style-anchor.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png |
| courtyard.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/backgrounds/bg-courtyard-e-v1.webp |
| house-wide.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png |
| farm-fields.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/m1-farm-mid-fields-v1.png |
| feed-now.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/mockups-2026-11-02/refs/feed-l3.png |
| barn-mockup.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/sources/art/mockups-2026-11-02/feed-B-barn.webp |

## Why the current one fails, and what the game needs

The current backdrop is the ride's road scenery stacked: sky, far hills, a strip of fields cut off by a hard line at half height, then a
flat colour block for the ground. The hedges and trees sit at the animals' head height (the hen vanishes into them), the horizon is a
ruler-straight edge, the yard has no texture, shadow or edge, and the sun is top right while every other scene is lit from the upper left.

The game needs a stage, not a landscape: the ground line at about 45% so the bottom half is plain swept floor for the arc of animals,
the trays and the baskets; a quiet, pale backdrop behind the animals' heads; depth from a back wall and soft shadows; warm light from
the upper left; the left quarter calm (the word panel covers it); readable at 320 px tall.

## The three options

1. **The barn, improved:** an open-fronted wooden shelter, one pale bare plank wall, posts only at the edges, hay high in the far right
   corner, the right end open to fields. Zafar likes the barn. Risk: brown on brown (the hen, goat and cow lose contrast on dark wood),
   so the prompt forces pale wood and an empty wall.
2. **The whitewashed yard with the shed** (the design's own farmyard): a low limewash wall, the shed's door on the right, an open gate
   onto fields, a neem tree's branches. The same world as the house's courtyard, so the farm looks like the family's own; the pale wall
   gives every animal contrast. Risk: too like the house courtyard; the gate, shed and haystack keep it a farm.
3. **The open shade shelter (chhapra):** a thatched roof strip on two edge posts, a low mud wall, fields beyond, dappled shade. The
   warmest and most distinctive. Risk: thatch is busy, and the roof takes height on a phone.

**Fable's recommendation:** option 2, with option 1 beside it so the barn can be seen with the clutter gone.

## The prompts (run order)

### feed-bg-1
- **shows:** an empty, bright, open-fronted wooden shelter with a plain pale plank wall and a clear earth floor
- **attach:** style-anchor.png, barn-mockup.webp, farm-fields.png, feed-now.png
- **save as:** bg-farm-feed-1.png

```
Empty background for a children's game (ages 3-8, phones), 16:9 landscape, one still scene with no characters.

The scene, straight on at eye level: the inside of a simple, open-fronted wooden animal shelter on a small family farm, like the barn in the second picture but lighter and emptier. One plain back wall of pale, sun-bleached planks, bare: no tools, ladder, lantern, rope, sacks or barrow on it or against it. Thick wooden posts only at the far left and far right edges, a plain roof beam along the top. The right end is open and bright: green fields and a soft sky show through. A few hay bales sit high in the far right corner only. The wall meets the floor at about 45% down the frame; below it a flat, swept, packed-earth floor in a warm sand colour, smooth and empty, with loose straw only along the very edges. The left quarter of the frame is plain wall and plain floor.

Light: soft warm morning sun from the upper left, bright and airy, no dark corners.

Style: match the attached references, a stylised 3D animated-feature look, chunky simplified shapes, clean surfaces, soft shadows, no outlines, no photorealism, no blur.

No animals, no troughs, no baskets, no buckets, no people. Absolutely no text, letters, numbers or signs anywhere. It must read at phone size: a calm pale wall and a big clear floor.
```

### feed-bg-2
- **shows:** an empty swept farmyard: a low limewash wall, the shed's door on the right, an open gate onto fields, a neem canopy
- **attach:** style-anchor.png, courtyard.webp, house-wide.png, farm-fields.png
- **save as:** bg-farm-feed-2.png

```
Empty background for a children's game (ages 3-8, phones), 16:9 landscape, one still scene with no characters.

The scene, straight on at eye level: a small family farmyard in the same world as the attached courtyard. A low whitewashed wall runs across the frame, its top at about 40% down. On the right, the end of a whitewashed shed with a closed plain wooden door, partly cropped by the edge. Left of centre, an open wooden gate in the wall shows green fields and soft hills beyond. The branches of a neem tree reach in from the top right corner. A single small haystack behind the wall at the far right. The wall meets the ground at about 45% down; below it a flat, swept, packed-earth yard in a warm sand colour, smooth and empty. The left quarter of the frame is plain wall and plain ground.

Light: soft warm morning sun from the upper left, the shed's shadow falling right.

Style: match the attached references, a stylised 3D animated-feature look, limewash, wood and earth, chunky simplified shapes, clean surfaces, soft shadows, no outlines, no photorealism, no blur.

No animals, no troughs, no baskets, no buckets, no people. Absolutely no text, letters, numbers or signs anywhere. It must read at phone size: a calm pale wall and a big clear floor.
```

### feed-bg-3
- **shows:** an empty thatched shelter on posts with a low mud wall, fields between the posts, dappled shade on a clear floor
- **attach:** style-anchor.png, courtyard.webp, farm-fields.png
- **save as:** bg-farm-feed-3.png

```
Empty background for a children's game (ages 3-8, phones), 16:9 landscape, one still scene with no characters.

The scene, straight on at eye level: an open shade shelter on a small family farm: a simple thatched roof seen only as a strip along the top of the frame, held up by two wooden posts at the far left and far right edges only, none in the middle. Behind, a low, smooth, plain mud-plaster wall in a warm clay colour, its top at about 35% down, and above it green fields and a soft sky. The wall meets the ground at about 45% down; below it a flat, swept, packed-earth floor, smooth and empty, with soft dappled shade. The left quarter of the frame is plain wall and plain floor.

Light: soft warm morning sun from the upper left.

Style: match the attached references, a stylised 3D animated-feature look, chunky simplified shapes, clean surfaces, soft shadows, no outlines, no photorealism, no blur.

No animals, no troughs, no baskets, no buckets, no people. Absolutely no text, letters, numbers or signs anywhere. It must read at phone size: a calm wall and a big clear floor.
```
