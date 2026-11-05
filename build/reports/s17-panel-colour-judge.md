# Judge: S17 side panel and shelf colour study (5 Nov)

Judged from the pictures (`build/screenshots/colour-study/`, his shot `docs/feedback/images-2026-11-05-am/1.webp`), the pantry and kitchen backgrounds, the tokens in `css/shared/tokens.css`, and my own pixel samples. Nothing in the game changed. Two helper images added to the study folder for the paste blocks: `keyed-magenta-1280x665.png` and `swatches.png`.

## 1. Flaws in the study

1. **The recommendation is ahead of its own evidence.** The study says the glow on oak "still reads clearly". It does not. By luminance the glow halo on the oak mock is 1.02:1 against the shelf (sampled: halo #e7b767 on shelf #d0bea1); on today's beige it is 1.20, on stone 1.15, on walnut 2.0. Zoomed at 740x320 the oak shot has the faintest bottle glow of the seven. The glow is the child's only "look here" and it must not sit on gold-ish wood. Option 2 is not ready to recommend as mocked.
2. **The lightness argument contradicts the options.** Section 1 says the problem is "same lightness, different hue"; section 2 says "separate by lightness, not hue". Then every light option keeps the side panel at the marble's lightness (L\* 91 against 93.5, 1.05-1.13:1) and only changes its hue. What the options actually do is remove the yellow. That is fine and it works (the stone shot is calmer), but say so, and offer one notch darker for the side (about #e3dfd8, L\* 89) as a value step to test on the phone.
3. **It never looked at the house's own art.** The pantry (`assets/cook/bg/bg-pantry-v3-1600.webp`) is jars on honey-oak shelves with a visible front edge against a warm plaster wall; the kitchen scene (`assets/backgrounds/bg-nani-kitchen-e-v1.webp`) is a marble top on an oak-panelled island. Two consequences the study misses: (a) "white stone and oak" is already the house's pairing, the strongest argument for wood; (b) the house's oak is honey (#d4a05a-ish), close to the gold glow, so a wide oak band in the house's own oak would kill the glow. Wood belongs on a thin ledge, not under the glow.
4. **The band is treated as a surface, not a scene.** In the real pantry the jars stand on a shelf with the wall behind; in the stove games the whole band is painted as "the shelf" and the plank lines float on it. A wall-and-ledge treatment (section 3) was never tried, and it is the one that matches the pantry.
5. **The textures in the mocks are not faint.** The linen reads as a check or gingham at 1280 and as a fine mesh at 740 (zoomed, the side column is the largest textured area on the phone); the clay plaster is blotchy; the oak grain is diagonal streaks. The study caveats this, but Zafar will judge the pictures, so the caveat should sit under the sheet, not in prose.
6. **Plank lines.** On stone (#c4bbae on #dfd9d0, 1.35:1) they are barely there; on walnut (#4a3324 on #6f4e37) they vanish. Either make them a real ledge or drop them.
7. **Small overstatements.** "Stands out more on 1, 3 and 5 than today's beige": true by hue for 3 and 5, marginal for 1 (by luminance the beige is slightly better). "The dark tea jar sinks into walnut": the lids and the glass highlights keep it; the silhouette softens, it does not vanish. The oak mock is darker than its stated hex (#d0bea1 sampled against #d9c6a8 spec), so its contrast row is low by about 0.1.
8. **Missing checks.** The other stations draw the same band (daar, samosa, maani-line, assemble, grill): a dark band under a dark tawa or pan was not looked at. Evening and night worktops exist in the art (`bg-cook-hob-t-evening`, `-night`): a fixed panel colour must sit with them too. Farm, clinic and sewing use `--njg-panel` as their whole background (the study says so; it should add that those get the side colour only, never the shelf).
9. **The things that are fine.** The sage Nani box reads by its green and shadow on every option, as the study says; the only clash is sage on clay (pink against green). The maroon speakers sit on white cards and are untouched. The 740x320 numbers (shelf about 27% of height) are right. The references (Fisher et al. 2014, HIG, Material 3, WCAG 2.2) are real and used correctly.

## 2. Ranking, on the pictures

| Rank | Option | Why |
|---|---|---|
| 1 | **1 Stone** | The calmest phone shot of the seven; the stain is gone, nothing is lost, the glow reads by hue. Two token values. A touch "app-like": fix that with the ledge (7), not with texture. |
| 2 | **7 Wall and ledge** (not in the study) | Stone side, a stone or pale plaster band one notch darker (#e2dcd3) as the wall, and a thin two-face oak ledge (top #d9c6a8, front #b8946a, 10-14 px at 1280) where the plank lines are now, jars standing on it with a soft contact shadow. Matches the pantry, keeps the glow on a neutral, keeps the phone light, and is the one shared shelf-band call the study already proposes. Mock it before any art. |
| 3 | **5b Mid oak band** (the study's aside, never mocked) | About #b89770. The best item legibility: light items (bottle, khun, carton) and dark jars both read, the glow reads, without walnut's weight. Risk: warm on warm again; the glow may need its outer ring stronger. Worth one mock. |
| 4 | **2 Linen and oak** | Right story, wrong mock: weakest glow, busiest side panel at phone size, needs two art-run tiles before it can be judged. Keep the idea, deliver it as 7. |
| 5 | **5 Walnut** | Most separation, but a dark quarter of the phone and a second black mass under the black hob; the plank lines vanish. Only if Zafar wants drama. |
| 6 | **4 Clay** | Pleasant warmth, but blotchy, pink against the sage box, and closest to today's problem. |
| 7 | **3 Fog** | Best for the glow, wrong for the house: every room is warm plaster. |
| 8 | **6 Paper** | Rightly shown to be rejected. |

So: I agree with the runner-up (1) and would ship it now; I do not agree that 2 as mocked is first. The honest order is 1 now, then a lab mock of 7 and 5b at the four sizes, then decide whether wood comes in as a ledge (7) or a band (5b).

## 3. The ChatGPT paste blocks

What will not work in the study's blocks:

- **Block A (a 3x2 grid of six UI copies)** cannot work. ChatGPT regenerates the whole image (the pipeline's own learning, `docs/design-language/art-pipeline.md`, "ChatGPT output needs different QA tuning"); at six-up in 1536x1024 each copy is about 500x330 px, so every word, face and jar is redrawn as mush, and six exact hexes in one prompt are not honoured. Drop it.
- **Block B ("pixel-for-pixel")** will redraw the text, Nani's and Nana's faces, the hob buttons and the jars whatever it is told. Three guards, in order of strength: (1) Zafar uses ChatGPT's **select-area brush** on the two panels before sending (true inpainting: unselected pixels are kept). Claude in Chrome cannot draw that reliably, so he does that one step by hand; (2) send the **magenta-keyed** copy (`keyed-magenta-1280x665.png`: the two panel areas are flat #ff00ff, cards, jars and labels kept) and ask it to fill only the magenta, which the pipeline already uses for sheets; (3) treat the result as a mood picture only: the lab mocks are already pixel-true and are the real preview.
- **"16:9" and hexes.** ChatGPT makes 1024x1024, 1536x1024 or 1024x1536 only; ask for 1536x1024 with the screenshot kept whole inside it, never stretched (the pipeline's rule). Image models do not read hex codes reliably; name the colour in words and point at the attached swatch strip (`swatches.png`).
- **Missing the house's standing line**: every prompt in `art-plans/*.txt` ends "Do not add any text, letters, numbers, labels, logos or watermarks." Add it.
- **The most useful thing ChatGPT can do here is not a repaint.** A materials board (real stone, linen, oak, walnut next to white marble, a glass jar on each) and tileable swatches are what it is good at and what the build needs. Lead with those.

### Improved blocks

**A. Materials board (first; one image, no UI, attach `swatches.png` and his screenshot)**

```
Generate an image, 1536×1024, landscape.

A materials board for a children's app set in a grandmother's kitchen. The app's worktop is the white marble in the attached screenshot (soft white, fine grey veins). Show six small kitchen vignettes in a 3 x 2 grid, each one the same: a short length of white marble worktop at the top, and below it a shelf band with one plain glass jar of dark tea leaves and one clear bottle of water standing on it, lit softly from above, no people, no hands, no decoration.

The shelf band is different in each vignette, numbered 1 to 6 with a small plain numeral in the corner:
1. flat matte pale warm-grey stone, like the "1 stone" swatches in the attached strip;
2. a pale, lightly whitewashed oak board with gentle straight grain, like the "2 linen oak" shelf swatch;
3. a pale plaster wall in warm grey with a thin honey-oak ledge (a real shelf with a front edge) that the jar and bottle stand on, like the "7 wall+ledge" swatches;
4. a mid-tone natural oak board, like the "5b mid oak" swatch;
5. a dark walnut board, like the "5 walnut" shelf swatch;
6. soft clay-pink lime plaster, like the "4 clay" swatches.

Keep every texture subtle and matte: no strong pattern, no knots, no shine, no harsh shadows. Clean, real, calm; the jar and bottle must read clearly against every band. Do not add any text, letters, numbers (other than the six small numerals), labels, logos or watermarks.
```

**B. One option on his real screen (attach `keyed-magenta-1280x665.png`; paste once per option, swap the line in brackets). If he prefers, he attaches `1.webp` instead and brushes over the two panels in ChatGPT's select tool, then sends the same text without the magenta sentence.**

```
Edit the attached image. The magenta (#ff00ff) areas are the only parts to change: the left side column and the bottom shelf band. Fill every magenta pixel with [OPTION LINE], and nothing else. Where a card, jar, bottle, carton or word label covers the area, it stays exactly as it is, in front.

Keep everything that is not magenta exactly as it is: the white marble worktop, the black hob and pan, the wooden tray and the glass, the gold glow round the carton, every card, face, button, icon, jar, bottle, carton and every word and letter, in the same places, sizes and colours. Do not add people, hands, objects or decoration. The new surface is matte and softly lit from above, with no strong pattern and no harsh shadow; where it meets the marble there is only a thin soft edge.

Output 1536×1024 with the whole screenshot kept inside it at its own proportions, padded with white if needed, never stretched or cropped. Do not add any text, letters, numbers, labels, logos or watermarks.
```

Option lines for B (colours named in words; the strip `swatches.png` can be attached too):

```
1. flat matte pale warm-grey stone: the side column a shade lighter (like the "1 stone" side swatch), the shelf band a shade darker (like its shelf swatch), with a thin slightly darker line where the jars stand
2. the side column a soft natural linen in warm off-white (like the "2 linen oak" side swatch); the shelf band a pale, lightly whitewashed oak board with gentle straight horizontal grain (like its shelf swatch)
5. the side column flat matte pale warm-grey stone; the shelf band a dark walnut board with soft straight grain (like the "5 walnut" shelf swatch)
5b. the side column flat matte pale warm-grey stone; the shelf band a mid-tone natural oak board with gentle straight grain (like the "5b mid oak" shelf swatch)
7. the side column flat matte pale warm-grey stone; the shelf band a pale warm-grey plaster wall one shade darker than the column, with a thin honey-oak ledge (a real shelf with a visible front edge, about the height of a word label) running across the band at the height of the existing thin lines, the jars and bottle standing on it with a soft contact shadow
```

**C. Tileable texture swatch (unchanged in substance; two fixes: name the colour in words as well as hex, and the standing line)**

```
Generate an image, 1024×1024, square.

A seamless, tileable texture swatch for a repeating background in a children's app.

Material: [a pale, lightly whitewashed oak board, a soft greyish sand colour (about #d9c6a8), gentle straight horizontal grain, no knots, no plank joins]
(or: [a soft natural linen weave in warm off-white (about #ede7dc), a fine even weave])
(or: [a smooth pale lime plaster in warm grey (about #e2dcd3), the faintest trowel marks])

Rules: it must tile seamlessly left to right and top to bottom with no visible seam or repeat; flat, even, top-down light with no vignette, no shadow and no highlight from one side; very low contrast (the lightest and darkest parts within about 5% of the base colour); matte, no shine; fill the whole square edge to edge; no border. Do not add any text, letters, numbers, labels, logos or watermarks.
```

Run order through Claude in Chrome: A once (it is the quick look the study's block A wanted, and it will survive the generator); then B for the two or three he likes; C only once an option with a texture has won, one chat per material (the pipeline's rule).

## 4. For Zafar to decide

1. **Ship 1 (stone) now as this sprint's fix**: `--njg-panel` → #e9e5df, a new `--njg-shelf` #dfd9d0 and `--njg-shelf-ledge` #c4bbae, one shared shelf-band call instead of six, checked at the four sizes and in farm, clinic and sewing. Recommend: yes.
2. **Mock 7 (wall and ledge) and 5b (mid oak) in the lab** at the four sizes before any ChatGPT run or art run. Recommend: yes, both; it is a lab page, not a build.
3. **ChatGPT's job**: a materials board and texture tiles (blocks A and C), with B only for the two or three options he wants to "feel" on his screen. Recommend: yes; and he brushes the panels himself in ChatGPT for B if the magenta key is not honoured.
4. **Where wood goes**: a thin ledge in the house's honey oak (7), or a whole band in a paler, greyer oak (2 or 5b). Recommend: the ledge; a wide oak band weakens the glow, the house's own oak most of all.
5. **One notch darker side panel** (about #e3dfd8) to test against the study's #e9e5df, judged on the phone shot. Recommend: test both; expect the lighter to win on the phone.
6. **Plank lines**: keep them only as part of a ledge; on any flat band make them one step darker than the study's values or drop them. Recommend: drop them on a flat band.
7. **Textures at all**: none until a tile comes from an art run and is checked at 740x320; code-drawn textures never ship. Recommend: agree.

## Proof

Judged on the study's mock-ups (`build/screenshots/colour-study/`, both sheets and each option's shots), his screenshot `docs/feedback/images-2026-11-05-am/1.webp`, and the judge's own pixel samples (`build/screenshots/colour-study/swatches.png`, `keyed-magenta-1280x665.png`).
