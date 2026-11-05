# S17: side panel and shelf colour study (5 Nov)

Zafar asked (5 Nov): colour analysis and best practice, and options for the side panel and the bottom shelf strip that suit the new white marble, plus paste blocks for ChatGPT. Study only: no game file changed.

## 1. What is wrong now

Sampled from his shot (`docs/feedback/images-2026-11-05-am/1.webp`) and the game at 1280x665:

| Surface | Hex | Lightness (L\*) | Warmth (b\*, + = yellow) |
|---|---|---|---|
| Marble (the asset, `marble-white-s17.webp`) | #edecef | 93.9 | -1 (a touch cool) |
| Marble as drawn (with the game's 18% parchment wash) | #edeceb | 93.9 | 0 (neutral) |
| Side panel and shelf (`--njg-panel`) | #efe5d6 | 91.3 | +8.5 (yellow) |
| The wooden tray | #c8a073 | 68.5 | +29 |

- **Same lightness, different hue.** The panel is only 2.6 L\* darker than the marble (contrast 1.07:1), so the eye cannot read it as a separate surface. All that separates it is a yellow cast, and a pale yellow strip next to clean white reads as a stain, not a material: the "muddy beige band".
- **The gold glow loses to it.** The focus glow (#e0a63a) is a warm yellow on a warm yellow (1.74:1, and hue-adjacent), so it stands out less than it would on a neutral.
- **White cards barely sit on it** (white on panel 1.25:1); they lean on their shadow. That is fine, and any option keeps it fine.
- **Text is not the problem.** Every Kutchi word sits on a white card (maroon #7d2234 on white 9.8:1). Text right on the panel would pass for ink and maroon on every light option (below).

Where the colours come from (for the build later): the side panel is `--njg-panel` (CSS `#side`); the shelf band is also `--njg-panel`, drawn in Phaser by each station (chai-tray, daar, samosa, maani-line, assemble, grill); the little shelf planks under the jars are `--njg-grey`; the marble's 18% wash is `--njg-page`. Farm, clinic and the prototypes use `--njg-panel` as their whole background, so changing it moves them too. Better: three new tokens (`--njg-side`, `--njg-shelf`, `--njg-shelf-ledge`), and one shared shelf-band call instead of six copies.

## 2. Best practice, briefly

1. **Calm chrome; the play area and the glow lead.** Heavily decorated rooms pull young children's attention and cut learning (Fisher, Godwin and Seltman, *Psychological Science*, 2014: kindergartners were more off-task and learned less in a decorated classroom). Pok Pok, Sago Mini and Toca Boca keep their frames quiet: soft, low-saturation backgrounds, while the things you touch carry the colour. Khan Academy Kids and Duolingo ABC use clean light surfaces with bright items and big round buttons. Lingokids is brighter and busier: the opposite of what a calm listening game wants.
2. **Separate by lightness, not hue.** Apple's HIG layers backgrounds as primary, secondary and tertiary steps of one neutral. Material 3 does the same with its "surface container" tones (one low-chroma neutral, a step apart). A lightness step also works for colour-blind players (about 1 boy in 12), where a hue shift alone does not.
3. **Keep the chrome low in saturation** (roughly chroma under 10), so the gold glow and the maroon words are the only strong colours on screen. WCAG 2.2 wants 4.5:1 for text (1.4.3) and 3:1 for a focus indicator against its surroundings (1.4.11, 2.4.13), and the gold glow is the child's focus indicator.
4. **Off-white, not pure white, for big areas.** Pure white glares on a tablet at full brightness, and white cards need a slightly darker surface to sit on.
5. **Real materials where the story supports them.** Pok Pok and Toca Kitchen use tactile surfaces (wood, felt, paper) that a child recognises. Jars stand on a shelf, so a wooden shelf makes sense; a side "board" can be linen, paper or stone. Keep texture subtle (3-5% lightness variation), never behind text, only behind cards.
6. **One temperature family, or one deliberate contrast.** White stone with pale oak is a classic real kitchen pairing (cool top, warm wood). Beige next to white is neither.
7. **Check the phone.** At 740x320 the shelf is about 27% of the screen height, so a dark or busy band weighs much more there than on the laptop.

## 3. Options

All mocked on the real game (chai, level 1, the paani bottle glowing), at 1280x665 and 740x320. Textures are CSS and canvas approximations made in the page (no art run), so read them for colour and weight, not for finish.

| # | Name | Side panel | Side edge | Shelf | Shelf ledge (planks) | Surface |
|---|---|---|---|---|---|---|
| 0 | Now | #efe5d6 | 1px rgba line | #efe5d6 | #d9d2c7 | flat |
| 1 | Stone (warm grey) | #e9e5df | #d5cec5 | #dfd9d0 | #c4bbae | flat |
| 2 | Linen and pale oak | #ede7dc | #d8cdbb | #d9c6a8 | #ad8a60 | linen weave side, oak grain shelf |
| 3 | Fog (cool grey) | #e4e8eb | #cdd4da | #d8dee3 | #b4bec7 | flat |
| 4 | Clay | #efe1d9 | #dcc6b9 | #e2ccbf | #c0a08c | soft plaster side, flat shelf |
| 5 | Stone and walnut | #e9e5df | #d5cec5 | #6f4e37 | #4a3324 | flat side, walnut grain shelf |
| 6 | Paper white | #faf8f4 | #e2ddd5 | #f5f2ed | #d9d2c8 | fine paper grain |

Contrast (WCAG ratio; text needs 4.5, the glow ideally 3):

| # | Side vs marble | Maroon on side | Ink on side | Soft ink on side | Shelf vs marble | White pill on shelf | Gold glow on shelf | Ledge on shelf |
|---|---|---|---|---|---|---|---|---|
| 0 | 1.07 | 7.8 | 12.2 | 4.3 | 1.07 | 1.25 | 1.74 | 1.20 |
| 1 | 1.08 | 7.8 | 12.1 | 4.2 | 1.20 | 1.40 | 1.55 | 1.35 |
| 2 | 1.06 | 7.9 | 12.3 | 4.3 | 1.43 | 1.67 | 1.30 | 1.91 |
| 3 | 1.06 | 7.9 | 12.3 | 4.3 | 1.16 | 1.36 | 1.60 | 1.39 |
| 4 | 1.10 | 7.7 | 11.9 | 4.2 | 1.32 | 1.54 | 1.41 | 1.58 |
| 5 | 1.08 | 7.8 | 12.1 | 4.2 | 6.39 | 7.44 | 3.43 | 1.58 |
| 6 | 1.10 | 9.2 | 14.3 | 5.0 | 1.04 | 1.12 | 1.94 | 1.34 |

The light options' gold-glow ratios look low because gold is itself a light colour; the glow reads by its saturation against a neutral, which the ratio does not measure. That is why it stands out more on 1, 3 and 5 than on today's beige. The sage Nani box (#e6efe2) and the soft ink line inside it are unchanged in every option; the box is 1.01-1.11:1 against any light side panel, so it reads by its green and its shadow, as today.

**1. Stone.** The marble's own family, one step darker and only faintly warm, so the panel and the shelf read as "the same kitchen, a different surface". Quiet; the cards and the glow lead. Sits well on a warm room scene too (a neutral). Risk: plain, a little "app-like" rather than "Nani's house".

**2. Linen and pale oak.** The side panel becomes a soft linen board and the shelf a pale oak shelf the jars stand on: white stone worktop and oak shelving is a real kitchen. The most "house-like", and the planks finally read as part of the shelf. Risks: two woods (the shelf and the tray) — the tray is darker and warmer, so they read as a set, but the shelf must stay pale and greyish; the gold glow on oak is the weakest of the six (warm on warm), so the glow may need its outer ring a touch stronger; texture must stay faint at phone size. Fits warm rooms naturally.

**3. Fog.** Matches the marble's coolness exactly; white cards, maroon and the gold glow all pop against a cool grey (gold and blue-grey are opposites). Risk: cold and clinical; the cream tiles inside the order card and the cream helper card turn yellowish against it; and it would clash with every warm painted room in the other games. Good for the marble, wrong for the house.

**4. Clay.** A soft pinkish plaster that leans to the maroon of the words. Warm and friendly; best on warm rooms. Risk: next to cool marble the pink can read as skin or as dusty, and it stays close to today's problem (a tinted light band). (The code-made plaster in the mock is blotchier than a real one would be.)

**5. Stone and walnut.** A quiet stone side panel and a dark walnut shelf. The strongest separation: white pills, the milk carton and the glow all jump (glow 3.4:1, the only option over 3). Risk: heavy — on a phone it is a dark quarter of the screen; the dark tea jar and the brown rai jar sink into it; it competes with the black hob for weight; a big change of mood.

**6. Paper white.** The panel goes lighter than the marble, like a clean sheet. Calm and modern. Risk: almost no separation (1.04-1.10), glare on tablets, and the white word pills and the order card's edge all but vanish (1.12:1, visible in the shot), though the glow is strong. Shown mainly to show why lighter is not the answer.

## 4. Recommendation

- **First: 2, linen side and pale oak shelf.** It fixes the muddy band by making the strip a real material instead of a tint, it suits Nani's house and the warm rooms of the other games, and the jars finally stand on something. In the mock the glowing bottle still reads clearly on the oak at both sizes; before it ships, check the glow on the darker jars too (it may need its ring a touch stronger), keep the textures faint, and get the oak and linen tiles from an art run rather than code.
- **Runner-up: 1, stone, flat.** The safest and cheapest (two token values, no art), and it already fixes the stain look. A good first step even if 2 wins later.
- If he likes the punch of 5, a middle way is a mid oak (around #b89770) rather than walnut: more separation than 2 without the dark band.

## 5. Screenshots

All in `build/screenshots/colour-study/`:

- `sheet-1280x665.png` and `sheet-740x320.png`: every option side by side.
- `0-now-1280x665.png`, `0-now-740x320.png` (today)
- `1-stone-…`, `2-linen-oak-…`, `3-fog-…`, `4-clay-…`, `5-walnut-…`, `6-paper-…` (each at 1280x665 and 740x320)

How they were made: the sandbox's own server and fonts, chai-tray level 1 on `lab.html`, the coaches marked seen, about 10 seconds into the round (when the glow and Nani's paani card come on; the glow pulses, so its strength differs a little from shot to shot). The token sheet was served with the option's values appended; textures were drawn on a canvas in the page and laid over the band as a Phaser tile sprite (an approximation). Script: the session scratchpad (not kept in the repo).

## 6. Paste blocks for ChatGPT

Attach his screenshot `docs/feedback/images-2026-11-05-am/1.webp` to each. Use the sheet block first for a quick look, then the single blocks for the ones he likes.

**A. One sheet of all options**

```
I'm attaching a screenshot of a children's language-learning game (landscape, a kitchen scene). I want to compare colour and material options for two areas only:
1) the SIDE PANEL: the beige strip down the left behind the green hint box and the white order card;
2) the SHELF STRIP: the beige band along the bottom behind the jars, bottle and carton and their small white word labels.

Make ONE image: a 3 x 2 grid of six copies of this screenshot, each with a small number 1-6 in the corner, where ONLY those two areas are repainted:
1. Stone: side #e9e5df, shelf #dfd9d0, the thin plank lines under the jars #c4bbae. Flat, matte.
2. Linen and pale oak: side a soft natural linen weave in #ede7dc; shelf a pale, slightly greyed oak board in #d9c6a8 with gentle horizontal grain; planks #ad8a60.
3. Fog: side #e4e8eb, shelf #d8dee3, planks #b4bec7. Flat, matte, cool grey.
4. Clay: side a faint smooth plaster in #efe1d9; shelf #e2ccbf, planks #c0a08c.
5. Stone and walnut: side #e9e5df flat; shelf a dark walnut board in #6f4e37 with soft grain; planks #4a3324.
6. Paper: side #faf8f4 with a very fine paper grain; shelf #f5f2ed; planks #d9d2c8.

Keep EVERYTHING else exactly as in the screenshot: the white marble worktop, the black hob and pan, the wooden tray and glass, the gold glow, every card, face, button, icon, jar, bottle, carton and every word and letter, in the same places and sizes. Do not add or change any text. Do not add people, hands, objects or decorations. Textures must be subtle (no strong pattern), lit softly from above, with no harsh shadows. Keep the landscape 16:9 shape of each copy.
```

**B. One option at a time** (paste once per option; swap the line in brackets)

```
I'm attaching a screenshot of a children's language-learning game (landscape, a kitchen scene). Repaint ONLY two areas:
1) the SIDE PANEL: the beige strip down the left behind the green hint box and the white order card;
2) the SHELF STRIP: the beige band along the bottom behind the jars, bottle and carton and their small white word labels, including the thin plank lines the jars stand on.

New look: [OPTION LINE — paste one from the list below]

Keep EVERYTHING else pixel-for-pixel as in the screenshot: the white marble worktop, the black hob and pan, the wooden tray and glass, the gold glow round the milk, every card, face, button, icon, jar, bottle, carton, and every word and letter, in the same places and sizes. Do not add or change any text. Do not add people, hands, objects or decorations. The texture must be subtle and matte, softly lit from above, no strong pattern or harsh shadow. Same landscape shape and size as the screenshot.
```

Option lines for B:

```
1. Stone: side panel flat matte warm grey #e9e5df with a 1px #d5cec5 edge where it meets the play area; shelf flat matte #dfd9d0; plank lines #c4bbae.
2. Linen and pale oak: side panel a soft natural linen weave, base #ede7dc, edge #d8cdbb; shelf a pale, slightly greyed (whitewashed) oak board, base #d9c6a8, gentle horizontal grain, a faint light edge along its top; plank lines #ad8a60.
3. Fog: side panel flat matte cool grey #e4e8eb, edge #cdd4da; shelf flat matte #d8dee3; plank lines #b4bec7.
4. Clay: side panel a faint smooth lime-plaster in soft clay #efe1d9, edge #dcc6b9; shelf flat matte #e2ccbf; plank lines #c0a08c.
5. Stone and walnut: side panel flat matte warm grey #e9e5df, edge #d5cec5; shelf a dark walnut board, base #6f4e37, soft horizontal grain, a faint light edge along its top; plank lines #4a3324.
6. Paper: side panel warm white #faf8f4 with a very fine paper grain, edge #e2ddd5; shelf #f5f2ed with the same grain; plank lines #d9d2c8.
```

**C. A tileable texture swatch** (once a textured option wins; swap the material line)

```
Make a seamless, tileable texture swatch, 1024 x 1024 pixels, square, for use as a repeating background in a children's app.

Material: [pale whitewashed oak board, base colour #d9c6a8, gentle straight horizontal grain, no knots, no plank joins]
(or: [soft natural linen weave, base colour #ede7dc, fine even weave])

Rules: it must tile seamlessly left-right and top-bottom with no visible seam or repeat; flat, even, top-down lighting with no vignette, no shadows, no highlights from one side; low contrast (the lightest and darkest parts within about 5% of the base colour); matte, no shine; no text, no logo, no objects, no border. Fill the whole square edge to edge.
```

## Proof

The mock-ups this study rests on: `build/screenshots/colour-study/` (0-now and options 1-6 at 1280x665 and 740x320, the two sheets), shot from chai L1 on the sandbox page with only the panel colours overridden; his screenshot `docs/feedback/images-2026-11-05-am/1.webp`.
