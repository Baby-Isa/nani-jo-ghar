# Font sample (6 Nov, afternoon): Lora, Fraunces with Lora, and three other free serifs, lighter than today

Zafar (6 Nov): "I quite like Lora, and I quite like Fraunces ... maybe have a look at not using bold so much ... a little bit of serif
to add some elegance, refinement, and readability, but not too much ... maybe we use Fraunces for the bold and Lora for the not bold
... are there any other fonts that are free ... give me one big sample."

## In plain words

- Today the Kutchi on the cards and Nani's line is Fraunces at its boldest (700), Nana's bubble is a round sans (Baloo 2), and the
  shelf pills are Nunito. That heavy Fraunces is the "old newspaper" look.
- I made six new options, each a full set (headline, the card's word, Nani's line and the bubbles, the shelf pills), all one step
  lighter than today: semibold (600) for the words that must stand out, medium (500) for what Nani says. Buttons and English stay
  Nunito in every option.
- **Start with the close-ups** (`fonts/closeups-2026-11-06b.webp`): the same words in every option, at a phone's sizes, at a phone's
  sharpness. Then `fonts/phone-closeups-2026-11-06b.webp`: the real game on the smallest phone, every option. Then the per-screen
  sheets if you want to see the whole screens.
- **My pick: option 1, Lora throughout**, with option 3 (Lora, plus Fraunces only for the big headline) as the close second.
- You can switch the options live on chai's screen: Labs, the "Fonts" tile (`lab/fonts.html`).
- Nothing in the game changed. These are pictures and a lab page.

## The options (each role: face and weight)

| | Headline (order card) | The card's Kutchi word | Nani's line, the bubbles, the door | Shelf pills, end-screen words | Buttons, English |
|---|---|---|---|---|---|
| **A today** | Fraunces 700 | Fraunces 700 | Fraunces 700 (Nana's bubble: Baloo 2 800) | Nunito 800 | Nunito |
| **1 Lora** | Lora 600 | Lora 600 | Lora 500 | Lora 600 | Nunito |
| **2 Fraunces bold + Lora** | Fraunces 600 | Fraunces 600 | Lora 500 | Lora 600 | Nunito |
| **3 Lora + Fraunces headline** | Fraunces 600 | Lora 600 | Lora 500 | Lora 600 | Nunito |
| **4 Literata** | Literata 600 | Literata 600 | Literata 450 | Literata 600 | Nunito |
| **5 Source Serif 4** | Source Serif 4 600 | Source Serif 4 600 | Source Serif 4 450 | Source Serif 4 600 | Nunito |
| **6 Alegreya** | Alegreya 600 | Alegreya 600 | Alegreya 500 | Alegreya 600 | Nunito |

Fraunces in options 2 and 3 has its two "personality" settings off (SOFT 0: no rounded blobby ends; WONK 0: no leaning letters) and
its optical size on (it draws itself more sturdily when small, finer when big).

**Why these three others.** I wanted free (SIL Open Font Licence) serifs with every weight and a true italic, light and calm on a
screen:
- **Literata** (TypeTogether, for Google Play Books): built for reading on screens. The biggest x-height of all (0.52 em, measured):
  the small words read biggest. A little more "book" than Lora.
- **Source Serif 4** (Adobe): the plainest, least decorated serif; clear and quiet, slightly narrow and small (x-height 0.46).
- **Alegreya** (Huerta Tipografica): the warmest, most hand-made. Included because you asked for alternatives with character; its
  small letters (0.47) are its weakness on the shelf.
- **Rejected:** Newsreader (built for news; the look you want to avoid), Merriweather (heavy, slab-like: newspaper on a screen),
  Crimson Pro and EB Garamond (small letters, old-book), Playfair (high contrast, display only), Spectral (lovely but no variable font,
  more files to ship).

**Measured** (in the browser, at 100 px): x-height (how tall a small letter is) and the width of "paani":
Lora 0.50 em / 2.58 em, Literata 0.52 / 2.74, Source Serif 4 0.46 / 2.32, Alegreya 0.47 / 2.34, Fraunces 600 0.45 / 2.21 (at a big
optical size; at a phone's size its letters grow), Nunito 0.50 / 2.59. Lora has the same small-letter height as today's Nunito, so the
shelf pills would read the same size as today.

## The sample

1. **Close-ups** (the same words in every option: "Muke chai khape" as a heading, "adh" on a card, "Muke aadu waari chai khape." in
   Nani's box, "paani" and "dudh" on pills, a Nunito button; phone sizes, drawn at 2x):
   `build/reports/fonts/closeups-2026-11-06b.webp`
2. **The real game on the smallest phone** (740x320: the L1 order, and the L4 shelf's ten pills enlarged 2x):
   `build/reports/fonts/phone-closeups-2026-11-06b.webp`
3. **Per-screen contact sheets** (options in columns, sizes in rows: 740x320, 930x430, 1280x665, 1920x1080):
   - `build/reports/fonts/chai-order-2026-11-06b.webp`: chai L1, the order (Nani's line, the order card, Nana's bubble)
   - `build/reports/fonts/chai-shelf-L4-2026-11-06b.webp`: chai L4, the shelf pills
   - `build/reports/fonts/word-moment-2026-11-06b.webp`: the word moment's cards
   - `build/reports/fonts/end-words-2026-11-06b.webp`: the end screen
   - `build/reports/fonts/door-2026-11-06b.webp`: the door
4. **Live:** `lab/fonts.html` (Labs, "Fonts"): chai's screen from the cards lab with a button per option.

## Flaws first (what the sample shows)

1. **The shelf pills are drawn by the game, not by the page,** so they take the new face but keep the game's own weight (800, which Lora
   draws at its heaviest, 700). In the sheets the pills are bolder than the plan says. Making them 600 is a code change (the drawn-word
   weight in `js/shared/tokens.js` Tokens.font), part of the rollout, not of this mock.
2. **Option 2 draws one word in two faces:** "dudh" is Fraunces on the card and Lora on the pill and in Nana's bubble. The fonts report
   of this morning (finding 1) showed that a pre-reader learns a word's shape; two shapes for one word is the thing we are trying to
   remove. Option 3 keeps Fraunces to the headline (a sentence, never a lone word on a card), so it does not have this problem.
3. **Lora 500 is light in Nana's small bubble** ("dudh," at 740x320). Fine on the bigger sizes; if it feels thin on the phone, the
   bubble can take 600 like the cards.
4. **Not shot:** the L4 shelf at 930x430 and 1920x1080 (time; the 740x320 and 1280x665 rows have it, and the close-ups cover the
   pills), and 971x318. The grey grown-up lines are in the shots but not judged (they go away).
5. **The italic** in the grey lines is now a true italic in every new option (today it is the browser's slant).

## My ranking

1. **Option 1, Lora throughout.** It is exactly the "little bit of serif" you described: elegant, open, never heavy; one face for
   every Kutchi word, so a word always has the same shape; the same small-letter height as Nunito, so nothing shrinks; and the smallest
   download (two small files).
2. **Option 3, Lora + Fraunces for the headline only.** Everything a child reads word by word is Lora; Fraunces adds a touch of
   character only where the type is big. A good choice if option 1 feels a bit plain at the top of the order card.
3. **Option 4, Literata.** The most readable on the smallest phone (biggest letters), but a little more "book" and a little heavier than
   Lora: the one to switch to if the shelf words ever feel too small.
4. **Option 2, Fraunces bold + Lora.** Lovely on the big card, but it puts the same word in two faces (flaw 2), and at 600 Fraunces
   still reads as the "bolder, older" one you noticed.
5. **Option 5, Source Serif 4.** Clean and clear, but cooler and narrower: more document than Nani's house.
6. **Option 6, Alegreya.** The most charming, but its small letters make the pills and Nani's line the hardest to read on a phone.

## Fable's ranking

(pending: the orchestrator adds it)

## Decisions for Zafar (yes to all except ...)

1. **The face:** option 1, Lora for every Kutchi word and line (headline, cards, Nani's line, bubbles, the door, shelf pills, the end
   screen). Recommend yes. (Or name another: 3 if you want Fraunces kept for the big headline.)
2. **The weights:** semibold (600) for the card word, the headline and the pills; medium (500) for Nani's line, the bubbles and the door;
   bold (700) not used. Recommend yes.
3. **Nunito stays** for the buttons, labels, English and the grown-ups' pop-ups. Recommend yes.
4. **Nana's bubble moves to Lora** (from Baloo 2), so a word has one shape everywhere on chai. Recommend yes.
5. **Self-host the fonts** (the files ship with the game, not from Google): faster, works offline and in the store build, the italic is
   real. Recommend yes (it was decision 5 of this morning's report).
6. **Chai first,** then the other modes, one at a time, each with its before-and-after pictures. Recommend yes.

## Implementation plan (once he says yes)

1. **One place for fonts.** `fonts/` at the root: the chosen faces as woff2 (latin subset; Lora upright and italic, Nunito upright and
   italic; Fraunces only if decision 1 keeps it), with `fonts/OFL.txt`. `css/shared/fonts.css` holds every `@font-face` (with
   `font-display: swap` and a size-adjusted fallback so nothing jumps) and is the only file that names a font file.
2. **The tokens are the only place a font is named.** `css/shared/tokens.css`: `--njg-font-word` (Lora), `--njg-font-line` (Lora),
   `--njg-font-heading` (Lora or Fraunces), `--njg-font-body` (Nunito), plus weight tokens (`--njg-weight-word: 600`,
   `--njg-weight-line: 500`). `--njg-card14-font` and `--kutchi-font` become aliases of these, then are retired.
   `js/shared/tokens.js` Tokens.font() reads the weight token too, so the drawn pills follow (flaw 1).
3. **Every page pulls the one sheet:** each page's Google Fonts `<link>` (cook.html, index.html, day.html, clinic.html, lab pages, and
   the run-time links in `js/cook/ui.js:204` and `js/clinic/heal/host.js:540`) is replaced by `css/shared/fonts.css`; `sw.js` precaches
   the font files.
4. **Chai first:** cook.css's `--kutchi-font` and its `font-weight: 800` lines on Kutchi move to the tokens; shoot the four sizes
   before and after with `build/tools/fonts/shoot.mjs`; the judge passes chai.
5. **Then everywhere,** one mode per step (the door and the book, the clinic, the farm, dress, monsoon, find, the home and the
   who-did-it), each a fix-list row with its before-and-after shots; the clinic's and home's own "Baloo 2" lines go.
6. **A static check** in `build/tools/review/checks.mjs` (row in `docs/process/checks-to-build.md`): fails any CSS or JS outside
   `css/shared/tokens.css` and `css/shared/fonts.css` that names a font family (Baloo, Fraunces, Lora, Nunito, Georgia, serif stacks)
   or links fonts.googleapis.com, and any `font-weight` above 700 on a Kutchi role. It starts with a baseline of the known
   offenders and fails only on new ones; the baseline shrinks as each mode moves.
7. **Then drop Baloo 2 and Fredoka** from the game once nothing names them.

## How it was made (mock only)

- Fonts (latin subsets from Fontsource, all SIL OFL 1.1, licence notes in `build/tools/fonts/woff2/LICENSE.txt`): Lora, Fraunces with
  all axes, Literata, Source Serif 4, Alegreya, in `build/tools/fonts/woff2/` (mock-only; the game does not load them).
- `build/tools/fonts/options-b.mjs`: the six options as role tables; each becomes a CSS sheet injected at page load (pixel-true).
- `build/tools/fonts/shoot.mjs --b`: the real screens under each option (chai L1 played fair, chai L4's shelf, the word moment lab, the
  door). `sheet-b.py` (contact sheets), `closeups-b.mjs` (the close-ups, and the measurements), `phone-b.py` (the phone close-ups).
- `lab/fonts.html` imports `options-b.mjs` and injects the same CSS into `lab/cards.html` in a frame.

## Proof

- `node build/tools/review/checks.mjs`: see the result line below.
- Shots: 7 options x 740x320, 1280x665 (with the L4 shelf), 930x430, 1920x1080 (without it); full shots deleted after the sheets.
