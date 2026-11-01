# ChatGPT mock-ups: how the farm games teach a whole sentence (2 November 2026)

Zafar: give this file's GitHub link to Claude in Chrome. It runs 6 prompts in ChatGPT and you download the pictures from
ChatGPT's Library at the end. They are mock-ups to choose a layout from, not game art: nothing is cut into the game.

## What we're deciding (Zafar, 2 Nov, on the feed and eggs prototypes)

His point: these games should teach longer sentences ("give the carrots to the horse", "take two of the small hen's eggs"),
but as built a child can win by matching pictures: each animal's or hen's card shows its food or its eggs. Three layouts:

- **A. Order cards, as chai has them:** one card per animal (or hen), its food (or eggs) on it. This is how the prototypes work now.
- **B. Hannah Mami leads, word tiles below:** her one instruction at a time, big in her box, its key words coloured. Under it, a grid
  of small word tiles, two across: one word each (hen, egg, cow, corn, big...), a picture, the word and a speaker. They are a
  glossary, not the answer: who gets what, how many and which one come only from her sentence.
- **C. As B, the tiles in two labelled strips** ("Animals", "Food") that scroll sideways: for a phone, maybe everywhere.

**Claude's recommendation: B, with C's strips as the phone layout of the same screen** (one design that rearranges by size, as
chai's panel does). A leaks: the card pairs the animal with its food, so the sentence is never needed. In B and C:
- the tiles show **every** animal and food in the scene, asked for or not, so the tiles never say which ones are in play;
- the tiles follow each word's ladder (picture and word, then the word, then dots, then gone), as the order cards do;
- early on, a **pair tile** shows the small hen beside the big hen with their words, so "small" is learned by contrast (Zafar's
  idea); it goes at higher levels;
- a wrong pick (the big hen when she said the small one) does nothing bad: the hen settles, Hannah Mami says the instruction
  again, nothing is marked.

**Kutchi in the pictures:** only words the language engine already has, as the prototypes show them; a word still to record is in
grey italic English, as in the game. ChatGPT may misspell text: judge the layout, not the letters.

## Run instructions for Claude in Chrome

Follow part 1 of `build/reports/designs/chatgpt-prompt-sheet-2026-11-01.md` (the runner loop, the one retry, moving images,
downloading from the Library at the end), with these changes: 6 prompts, 2 windows at a time, no kept:X pictures, no people
except Hannah Mami's face (so no clothes line). Paste each code box exactly. Save names: `farm-sentence-<ID>.png`.

### References (short name, raw URL)

| Short name | Raw URL |
|---|---|
| style-anchor.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png |
| chai-panel.jpg | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/docs/feedback/images-2026-11-01-night/phone-4.jpg |
| feed-now.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/sources/art/mockups-2026-11-02/refs/feed-l3.png |
| eggs-now.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/sources/art/mockups-2026-11-02/refs/eggs-l3.png |
| hannah-face.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/farm/proto/hannah-face.webp |

## The prompts (run order)

### feed-A
- **shows:** the feeding game, a side panel of order cards on the left, one card per animal with its food.
- **attach:** feed-now.png, chai-panel.jpg, hannah-face.webp, style-anchor.png

```
A landscape game screen mock-up (16:9) for a children's language game, in the soft painted style of the style reference. Use the first picture as the layout: a farmyard on the right with a cow, a hen and a goat in an arc, a dark wooden feeding tray in front of each animal, and three baskets at the bottom middle (grass, corn on the cob, a small bucket of water). On the left, a cream side panel about a quarter of the screen wide, styled exactly like the side panel in the second picture (rounded white cards, maroon serif words, round maroon speaker buttons, gold edges on done cards).
At the top of the panel: a pale green box with the round face from the third picture and the words "The animals are hungry." in grey italic.
Below it, three order cards, one per animal, stacked. Each card: the animal's small round face at the top left, then one item card: a picture of that animal's food with its count, the word under it and a round maroon speaker. Card 1: the hen's face, item "ba makai" with two corn cobs. Card 2: the cow's face, item "trae grass" (the word grass in grey italic) with three grass tufts. Card 3: the goat's face, item "paani" with the bucket.
Clean, uncluttered, no extra text, no logos.
```

### feed-B
- **shows:** the feeding game led by Hannah Mami's sentence, with a two-across grid of word tiles under it, grouped Animals and Food.
- **attach:** feed-now.png, chai-panel.jpg, hannah-face.webp, style-anchor.png

```
A landscape game screen mock-up (16:9) for a children's language game, in the soft painted style of the style reference. Use the first picture as the layout: a farmyard on the right with a cow, a hen and a goat in an arc, a dark wooden feeding tray in front of each animal, three baskets at the bottom middle (grass, corn on the cob, a small bucket of water). On the left, a cream side panel about a quarter of the screen wide, in the look of the side panel in the second picture (rounded white cards, maroon serif words, round maroon speaker buttons).
At the top of the panel, a large pale green box: the round face from the third picture, and her instruction in big serif letters, its English parts in grey italic and its Kutchi words in maroon: "Now the" (grey italic) "murgi" (maroon) "! She wants" (grey italic) "ba makai." (maroon). The words "murgi" and "makai" are underlined in gold. A small speaker button sits in the box.
Below the box, a grid of small square word tiles, two tiles across, under two small grey labels. Label "Animals": tiles for the hen ("murgi", underlined in gold, with a soft gold glow), the cow ("cow" in grey italic) and the goat ("bakri"). Label "Food": tiles for corn on the cob ("makai", underlined in gold), grass ("grass" in grey italic) and water ("paani"). Each tile: a small picture on top, the word under it, a tiny round speaker. No counts on the tiles. The tiles are plainly a word list, not orders.
Clean, uncluttered, no extra text, no logos.
```

### feed-C
- **shows:** the same as feed-B on a wide, short phone screen: Hannah Mami's sentence, then two labelled strips of tiles that scroll sideways.
- **attach:** feed-now.png, chai-panel.jpg, hannah-face.webp, style-anchor.png

```
A wide, short phone game screen mock-up (aspect ratio about 2.3 to 1, landscape), for a children's language game, in the soft painted style of the style reference. On the right, the farmyard from the first picture, smaller: a cow, a hen and a goat in an arc with a dark wooden tray in front of each, three baskets at the bottom middle (grass, corn, a small water bucket). On the left, a narrow cream side panel about a third of the screen wide, in the look of the side panel in the second picture.
At the top of the panel, a pale green box: the small round face from the third picture and her instruction in serif letters, English in grey italic and Kutchi in maroon: "Now the" (grey italic) "murgi" (maroon) "! She wants" (grey italic) "ba makai." (maroon), with "murgi" and "makai" underlined in gold.
Below it, two strips, each with a small grey label on its left and a row of small square word tiles that runs off the panel's right edge with a soft fade, showing two and a half tiles, to say it scrolls sideways. Strip "Animals": hen ("murgi", glowing gold), cow ("cow" grey italic), goat ("bakri"). Strip "Food": corn ("makai", glowing gold), grass ("grass" grey italic), water ("paani"). Each tile: a small picture, the word, a tiny round speaker.
Clean, uncluttered, no extra text, no logos.
```

### eggs-A
- **shows:** the eggs game with a side panel of order cards, one per hen, with her eggs on it.
- **attach:** eggs-now.png, chai-panel.jpg, hannah-face.webp, style-anchor.png

```
A landscape game screen mock-up (16:9) for a children's language game, in the soft painted style of the style reference. Use the first picture as the layout: a dark wooden hen house shelf on the right with three sitting hens on straw (a big brown-red hen, a small brown-red hen, a big white hen), and a wicker basket on the floor below. On the left, a cream side panel about a quarter of the screen wide, styled exactly like the side panel in the second picture.
At the top of the panel: a pale green box with the round face from the third picture and "Bring me the eggs." in grey italic.
Below it, two order cards stacked. Card 1: a small picture of the big brown-red hen at the top left; one item card with two brown eggs, the words "wadhi laal murgi ja inda" and a round maroon speaker. Card 2: a small picture of the white hen; one item card with one white egg, the words "white murgi jo hakro indo" (the word white in grey italic) and a speaker.
Clean, uncluttered, no extra text, no logos.
```

### eggs-B
- **shows:** the eggs game led by Hannah Mami's sentence, with a two-across grid of word tiles under it, including a small-hen-and-big-hen pair tile.
- **attach:** eggs-now.png, chai-panel.jpg, hannah-face.webp, style-anchor.png

```
A landscape game screen mock-up (16:9) for a children's language game, in the soft painted style of the style reference. Use the first picture as the layout: a dark wooden hen house shelf on the right with three sitting hens on straw (a big brown-red hen, a small brown-red hen, a big white hen), a wicker basket on the floor below. On the left, a cream side panel about a quarter of the screen wide, in the look of the side panel in the second picture.
At the top of the panel, a large pale green box: the round face from the third picture and her instruction in big maroon serif letters: "wadhi laal murgi ja inda." The words "wadhi", "laal", "murgi" and "inda" are each underlined in gold. A small speaker button in the box.
Below, a grid of small square word tiles, two across, under small grey labels. Label "Hens": one wide tile, two tiles wide, showing a small hen beside a big hen, the word "small" (grey italic) under the small one and "wadhi" under the big one; then a tile for a hen ("murgi"), a tile with a red colour swatch ("laal") and one with a white swatch ("white" in grey italic). Label "Eggs": a tile with one egg ("indo") and a tile with two eggs ("inda"). Each tile: a small picture, the word, a tiny round speaker. The tiles are plainly a word list, not orders.
Clean, uncluttered, no extra text, no logos.
```

### eggs-C
- **shows:** the same as eggs-B on a wide, short phone screen: two labelled strips of tiles that scroll sideways.
- **attach:** eggs-now.png, chai-panel.jpg, hannah-face.webp, style-anchor.png

```
A wide, short phone game screen mock-up (aspect ratio about 2.3 to 1, landscape), for a children's language game, in the soft painted style of the style reference. On the right, the hen house from the first picture, smaller: three sitting hens on a dark wooden shelf (big brown-red, small brown-red, big white), a wicker basket below. On the left, a narrow cream side panel about a third of the screen wide, in the look of the side panel in the second picture.
At the top of the panel, a pale green box: the small round face from the third picture and "wadhi laal murgi ja inda." in maroon serif letters, those four words underlined in gold.
Below it, two strips, each with a small grey label on its left and a row of small square word tiles that runs off the panel's right edge with a soft fade, showing two and a half tiles. Strip "Hens": a wide pair tile (a small hen beside a big hen, "small" in grey italic and "wadhi"), "murgi", a red swatch "laal", a white swatch "white" in grey italic. Strip "Eggs": one egg "indo", two eggs "inda". Each tile: a small picture, the word, a tiny round speaker.
Clean, uncluttered, no extra text, no logos.
```

## Checks made on the prompts

- Every Kutchi word is one the prototypes already show (from the language engine): *makai, murgi, bakri, paani, ba, trae, wadhi,
  laal, inda, indo, hakro*; words still to record (cow, grass, white, small) are grey italic English. The feed game's whole spoken
  sentence is not shown on screen anywhere, so its frame ("Now the ... ! She wants ...") is grey italic English around the words
  the game shows; Mum's sentence replaces it in the game.
- No sweets, no religious markers; the only person is Hannah Mami's face, from her placeholder.
- Tiles show every animal, food and hen in the scene, so no prompt draws a tile list that gives the answer away.
