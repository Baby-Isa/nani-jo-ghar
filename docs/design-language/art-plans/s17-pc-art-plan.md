# Art plan (pack `s17-pc`): the side panel and shelf colours against the white marble

**Written:** 5 Nov 2026, from Zafar's morning play (`docs/feedback/chai-play-2026-11-05-am.md` P1, ART-41: "suggest a side a bottom
panel colour and/or texture that better fits the whiter marble background ... give me the art run to see the different colour
combos"). **Run spec:** `build/tools/art/specs/s17-pc.run.yaml`. The options and their colours come from the study
(`build/reports/s17-panel-colour-study.md`) as judged by Fable (`build/reports/s17-panel-colour-judge.md` §3, blocks A and B).

**What this is for:** mood pictures so Zafar can choose; nothing from this run is cut or wired. The chosen option is then built in
code (two or three colour tokens and one shared shelf band), checked at the four sizes; a texture, if one wins, gets its own tile run.

## 0. Totals

| Line | What | Pictures |
|---|---|---|
| MB | A materials board: six vignettes, the white marble over six shelf bands, a jar and a bottle on each (no app) | 1 |
| P1 | His chai screen, the panels in flat pale warm-grey stone (Fable's first) | 1 |
| P7 | His chai screen, a stone column and a warm-grey plaster wall with a thin honey-oak ledge (Fable's second) | 1 |
| P5 | His chai screen, a stone column and a mid-oak shelf band (Fable's third) | 1 |
| P2 | His chai screen, a linen column and a pale whitewashed oak shelf band (the study's first) | 1 |
| | **5 prompts** (about 7 images with redos) | **5** |

## 1. Flaws and uncertainties first

1. **ChatGPT redraws the whole picture.** The screen edits will soften the words, faces and jars a little whatever it is told; the
   magenta key (the two panel areas flat #ff00ff, the cards, jars and words kept) is the strongest guard. These are previews: the
   colours and the feel are what is judged, not the words. The pixel-true previews are the study's own mock-ups.
2. **Hex codes are not honoured by image models:** each colour is named in words, and the swatch strip is attached.
3. **The jars' gold glow** must still read on the shelf (Fable: on pale oak it almost vanishes); look at the carton in each.

## 5. The prompts

#### MB. The materials board
```
Generate an image, 1536×1024, landscape.

A materials board for a children's app set in a grandmother's kitchen. The app's worktop is the white marble in the second attached picture (soft white, fine grey veins). Show six small kitchen vignettes in a 3 x 2 grid, each one the same: a short length of white marble worktop at the top, and below it a shelf band with one plain glass jar of dark tea leaves and one clear bottle of water standing on it, lit softly from above, no people, no hands, no decoration.

The shelf band is different in each vignette, numbered 1 to 6 with a small plain numeral in the corner:
1. flat matte pale warm-grey stone, like the "1 stone" swatches in the first attached strip;
2. a pale, lightly whitewashed oak board with gentle straight grain, like the "2 linen oak" shelf swatch;
3. a pale plaster wall in warm grey with a thin honey-oak ledge (a real shelf with a front edge) that the jar and bottle stand on, like the "7 wall+ledge" swatches;
4. a mid-tone natural oak board, like the "5b mid oak" swatch;
5. a dark walnut board, like the "5 walnut" shelf swatch;
6. soft clay-pink lime plaster, like the "4 clay" swatches.

Keep every texture subtle and matte: no strong pattern, no knots, no shine, no harsh shadows. Clean, real, calm; the jar and bottle must read clearly against every band. Do not add any text, letters, numbers (other than the six small numerals), labels, logos or watermarks.
```

#### P1. Stone
```
Edit the first attached image. The magenta (#ff00ff) areas are the only parts to change: the left side column and the bottom shelf band. Fill every magenta pixel with flat matte pale warm-grey stone: the side column a shade lighter (like the "1 stone" side swatch in the second attached strip), the shelf band a shade darker (like its shelf swatch), with a thin slightly darker line where the jars stand. Nothing else changes. Where a card, jar, bottle, carton or word label covers the area, it stays exactly as it is, in front.

Keep everything that is not magenta exactly as it is: the white marble worktop, the black hob and pan, the wooden tray and the glass, the gold glow round the carton, every card, face, button, icon, jar, bottle, carton and every word and letter, in the same places, sizes and colours. Do not add people, hands, objects or decoration. The new surface is matte and softly lit from above, with no strong pattern and no harsh shadow; where it meets the marble there is only a thin soft edge.

Output 1536×1024 with the whole screenshot kept inside it at its own proportions, padded with white if needed, never stretched or cropped. Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### P7. Stone wall and an oak ledge
```
Edit the first attached image. The magenta (#ff00ff) areas are the only parts to change: the left side column and the bottom shelf band. Fill the side column with flat matte pale warm-grey stone (like the "7 wall+ledge" side swatch in the second attached strip); fill the shelf band with a pale warm-grey plaster wall one shade darker than the column (like its shelf swatch), with a thin honey-oak ledge (a real shelf with a visible front edge, about the height of a word label, like its ledge swatch) running across the band at the height of the existing thin lines, the jars and bottle standing on it with a soft contact shadow. Nothing else changes. Where a card, jar, bottle, carton or word label covers the area, it stays exactly as it is, in front.

Keep everything that is not magenta exactly as it is: the white marble worktop, the black hob and pan, the wooden tray and the glass, the gold glow round the carton, every card, face, button, icon, jar, bottle, carton and every word and letter, in the same places, sizes and colours. Do not add people, hands, objects or decoration. The new surfaces are matte and softly lit from above, with no strong pattern and no harsh shadow; where they meet the marble there is only a thin soft edge.

Output 1536×1024 with the whole screenshot kept inside it at its own proportions, padded with white if needed, never stretched or cropped. Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### P5. Stone and a mid-oak shelf
```
Edit the first attached image. The magenta (#ff00ff) areas are the only parts to change: the left side column and the bottom shelf band. Fill the side column with flat matte pale warm-grey stone (like the "5b mid oak" side swatch in the second attached strip); fill the shelf band with a mid-tone natural oak board with gentle straight horizontal grain (like its shelf swatch), no knots, no plank joins. Nothing else changes. Where a card, jar, bottle, carton or word label covers the area, it stays exactly as it is, in front.

Keep everything that is not magenta exactly as it is: the white marble worktop, the black hob and pan, the wooden tray and the glass, the gold glow round the carton, every card, face, button, icon, jar, bottle, carton and every word and letter, in the same places, sizes and colours. Do not add people, hands, objects or decoration. The new surfaces are matte and softly lit from above, with no strong pattern and no harsh shadow; where they meet the marble there is only a thin soft edge.

Output 1536×1024 with the whole screenshot kept inside it at its own proportions, padded with white if needed, never stretched or cropped. Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### P2. Linen and pale oak
```
Edit the first attached image. The magenta (#ff00ff) areas are the only parts to change: the left side column and the bottom shelf band. Fill the side column with a soft natural linen in warm off-white, a fine even weave you can barely see (like the "2 linen oak" side swatch in the second attached strip); fill the shelf band with a pale, lightly whitewashed oak board with gentle straight horizontal grain (like its shelf swatch), no knots, no plank joins. Nothing else changes. Where a card, jar, bottle, carton or word label covers the area, it stays exactly as it is, in front.

Keep everything that is not magenta exactly as it is: the white marble worktop, the black hob and pan, the wooden tray and the glass, the gold glow round the carton, every card, face, button, icon, jar, bottle, carton and every word and letter, in the same places, sizes and colours. Do not add people, hands, objects or decoration. The new surfaces are matte and softly lit from above, with no strong pattern and no harsh shadow; where they meet the marble there is only a thin soft edge.

Output 1536×1024 with the whole screenshot kept inside it at its own proportions, padded with white if needed, never stretched or cropped. Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- None: previews only. Kept images land in `sources/art/s17-pc/`; Claude judges them against the study's mocks, then puts them to
  Zafar beside the study's pixel-true shots for his choice (ART-41).
