# ChatGPT art prompts: the end-of-round badges (UX §9a)

**For:** the three badges on page 1 of the end-of-round screen (stopwatch, tick, light bulb) plus the two small caption icons. No circles behind them: each object sits straight in its square card. Zafar uploads the PNGs to `sources/art/chatgpt-results/`; Claude cuts them with `build/slice_sheet.py --key grey` and wires them into `js/shared/results.js`.

Every sheet uses the same rules: flat mid-grey `#808080` background, no floor, no shadows, no text or numbers, each object centred in its own equal cell, **identical size, shape and position in every cell** (so the game can swap or blend states), style matching the attached style anchor.

## Paste into Claude in Chrome (ChatGPT open in a tab)
```
You're making 4 images in ChatGPT for a children's game. Attach sources/art/style-anchor-v1.png (download it from https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png with "Download raw file") to every prompt. Send each prompt below in its own new chat. Keep an image only if it passes its "check"; otherwise regenerate (up to 2 retries) rather than arguing. Download the PNG (never a screenshot) and rename it to the "save as" name. Don't change any ChatGPT or Chrome settings. When done, tell me the four file names and any that failed their check.
```

## R1. Stopwatch, three states
```
A sprite sheet for a children's game, 1536x512, three equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers, no hands on the dial.
Each cell holds the same chunky, rounded stopwatch seen straight on: a thick round rim, a button on top, a small side button at the top right, and a plain, empty cream face (the game writes the time inside it, so leave the whole face clear). Identical size, shape and position in all three cells; the stopwatch fills about 80% of its cell.
Left: shiny bright gold, gleaming, with a warm glow (a new best time).
Middle: soft, dimmer, matte gold (a good time).
Right: plain soft grey (an ordinary time).
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `ui-results-stopwatch-v1.png`
**check:** three identical stopwatches differing only in colour · the face is empty (no numbers, no hands) · no background circles or shadows.

## R2. Tick, four fills
```
A sprite sheet for a children's game, 2048x512, four equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers, no circle behind the tick.
Each cell holds the same big, chunky, rounded tick (check mark), soft and toy-like, filling about 80% of its cell. Identical size, shape and position in all four cells.
Cell 1: the tick empty: just a soft cream-white shape with a slightly darker rim (the gauge before it fills).
Cell 2: the tick filled solid fresh leaf green.
Cell 3: the tick filled solid tomato red.
Cell 4: the tick shiny bright gold, gleaming, with a warm glow (everything right).
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `ui-results-tick-v1.png`
**check:** four ticks with exactly the same outline · flat fills (no stripes or gradients across the length) · no circle behind.

## R3. Light bulb, four states
```
A sprite sheet for a children's game, 2048x512, four equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers, no circle behind the bulb.
Each cell holds the same big, rounded, friendly old-fashioned light bulb standing upright with a screw base, filling about 80% of its cell. Identical size, shape and position in all four cells.
Cell 1: fully lit: bright, shining gold-yellow glass, glowing warmly, with a soft halo of light around it (no hints used).
Cell 2: duller: you can clearly see the filament inside, only a faint warm glow, and one small crack in the glass.
Cell 3: very dim: barely glowing, the filament dark orange, with a few cracks in the glass.
Cell 4: off: cool grey glass, dark filament, no glow at all.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `ui-results-bulb-v1.png`
**check:** four identical bulbs stepping down from lit to off · cracks only in cells 2 and 3 · the halo in cell 1 stays inside its cell.

## R4. The small caption icons
```
A sprite sheet for a children's game, 1024x512, two equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text.
Left: a small chunky gold crown with three rounded points. Right: a small chunky lit light bulb, gold-yellow, the same design as a friendly old-fashioned bulb. Both simple enough to read at 24 pixels tall, each filling about 70% of its cell.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft light from the upper left, no outlines.
```
**save as:** `ui-results-icons-v1.png`
**check:** both read clearly when shrunk to thumbnail size.

**Cuts to (Claude):** R1 → `assets/ui/results/stopwatch-{pb,good,plain}.webp`; R2 → `tick-{empty,green,red,gold}.webp` (the game masks green over red by the share right, over the empty tick); R3 → `bulb-{0,1,2,3}.webp`; R4 → `icon-crown.webp`, `icon-bulb.webp`. Remove the circles behind all three badges; objects sit straight in the square cards. Glow, buzz, shimmer and party lines stay in CSS.
