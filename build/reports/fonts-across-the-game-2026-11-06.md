# Fonts across the game (overnight 6 Nov, task 3): where writing appears, which face each area should use, four options on the real screens

Builder: Opus, high effort (overnight brief task 3). Zafar's word (6 Nov): keep the current fonts until he has seen options. Nothing in
the game changed: the options are mock-only overrides (`build/tools/fonts/`), served and injected by the shooting script.
Starts from Fable's review (`build/reports/s17-fonts-review.md`) and corrects one of its points (finding 1).

## Flaws first: what the inventory found

1. **A Kutchi word is drawn in three faces on chai, not two, and Baloo 2 is in use.** Nana's speech bubble in the play area
   ("Muke chai khape", ".wp-text") is Baloo 2 800: `css/cook.css:274` takes `--kutchi-font` (`css/cook.css:23`), which is
   `--njg-font-display` (`css/shared/tokens.css:98`, Baloo 2). So "dudh" is Fraunces on the card, Baloo 2 in Nana's bubble and Nunito
   on the shelf pill, the greeting bubble, the tally chip and the end screen's review, all in one round. Fable's flaw 3 ("Baloo 2 is
   unused on chai, drop it from the chai pages") is wrong: dropping it would silently turn Nana's bubble into Nunito. Do not drop it
   until the bubble's face is decided (decision 3).
2. **The smallest Kutchi is too small for any face to rescue.** On the smallest phone (740x320) the L4 shelf's
   words are 9.6 CSS px (Nunito; 9.2 in Fraunces), about 0.8 mm of x-height on Zafar's phone: below the adult fluent-reading limit
   (about 0.2 degrees, about 1 mm at 30 cm; Legge and Bigelow 2011), let alone a child's. The 13 px floor holds at 971x318 and up. This
   is SH-219's ground (task 1), not a font choice.
3. **English under the order card's item words is tiny on phones.** The English under each item card in the order card is 7.9 CSS px at
   740x320, 971x318 and 930x430 (12 px on big screens): `css/shared/word-card.css:203` clamps it at `--njg-card14-u12`, which
   `css/shared/order-card.css:648` scales by the phone factor. It is supported English a child may be reading; 7.9 px is under every floor
   the game uses. A fix-list row (decision 6).
4. **The clinic names Baloo 2 itself** (`css/clinic.css:18`, `--cl-head: "Baloo 2", ...`: its said words `.hs-said`, `.eye-said`, its
   tally and hint numbers), and so do the home, the who-did-it and the first launch (`css/home.css:28,37,101,139`, `css/who.css:33,67,86,130`):
   against SH-151 ("a game names a role, never a font"). A token change would not reach them.
5. **The italic is still the browser's slant** (Fable's flaw 1, still open): no page link asks for `ital` (`cook.html:9`, `index.html:26`,
   `lab.html:36`, `lab/word-moment.html:12`, the run-time links `js/cook/ui.js:204`, `js/clinic/heal/host.js:540`). The book asks for
   a Nunito italic (`js/day/book.js:675`) that no link loads, so it is slanted too.
6. **day.html and clinic.html load no Fraunces** (`day.html:34`, `clinic.html:25`). Today nothing on them asks for it; the day the farm's
   word tiles (`css/shared/word-tiles.css:17,27`, Fraunces through `--njg-card14-font`) or the s14 card run inside day.html they fall to
   the phone's own serif (Georgia is not on Android). Self-hosting (decision 5) removes the trap.
7. **A Kutchi word set in italic.** The farm's word-tile group labels ("khenjo", `css/shared/word-tiles.css:17`) are Fraunces in the
   browser's slant, the same look the game uses for "not yet recorded". Italic is for the grey lines only (and the BDA guide says
   avoid it for reading); the label should be upright. A one-line fix with the farm's next round, for the fix list.

## 1. Where writing appears (the inventory)

Sizes are the smallest seen, in CSS px, measured in the running game (option A, today); "x" is the face's x-height at that size.
Child = 3-7; grown-up = the parent beside them.

| Surface | Where its font is set | Role | Reader | Face today | 740x320 | 1920x1080 |
|---|---|---|---|---|---|---|
| Order card: headline ("Muke chai khape.") | `css/shared/order-card.css:589` (`--njg-card14-font`, `css/shared/tokens.css:111`) | Kutchi line | child | Fraunces 700 | 14.5 | 19 |
| Order card: item card, word | `css/shared/word-card.css:115` | Kutchi word to learn | child | Fraunces 700 | 14.5 | 19.2 |
| Order card: item card, English | `css/shared/word-card.css:117, 203`; scaled on phones by `css/shared/order-card.css:648` | English under a supported word | child + grown-up | Nunito 700 | **7.9** | 12 |
| Big item card (the order pop-up): word / English | `css/shared/word-card.css:115, 117, 166` | word to learn / English | child | Fraunces 700 / Nunito 700 | 28.8 / 14.2 | 45 / 22.2 |
| Helper card (Nani's box opened on an item) | the item card's rules (`word-card.css:115, 117`) inside `css/shared/order-card.css:550` | word to learn + English | child | Fraunces 700 / Nunito 700 | as the item card | as the item card |
| Nani's box: her line | `css/shared/order-card.css:550, 556` (s14); `css/shared/guide.css:47, 52` (other modes) | Kutchi line; grey English while not recorded | child (grey: grown-up) | Fraunces 700 (grey: the browser's slant) | 16 | 19 |
| Nana's bubble in the play area | `css/cook.css:274` via `--kutchi-font` (`css/cook.css:23`) = `--njg-font-display` (`tokens.css:98`) | Kutchi line | child | **Baloo 2 800** | 18 | 32 |
| The greeting bubble ("Salamun alaykum!") | `css/shared/conversations.css:22, 77` | Kutchi line | child | Nunito 800 | (not kept) | 22 at 1280x665 |
| Shelf pills (drawn, Phaser) | `js/cook/stations/chai-tray.js:134` FONT() = `Tokens.font("word")` = `--njg-font-word` (`tokens.css:100`); drawn at `chai-tray.js:893` (25 px, scaled) | Kutchi word to learn | child | Nunito 800 | **9.6** (L4) | 23.6 |
| Tally chip (the count, "hakro") | `css/shared/tally.css:14` | Kutchi number word | child | Nunito 800 | 17 | 17 |
| Word moment: the two cards | `css/shared/word-card.css:115, 117` (big14) | word to learn / English | child | Fraunces 700 / Nunito 700 | 25.1 / 14 | 64 / 30 |
| End screen: word review | `css/shared/results.css` (inherits `--njg-font`); badges `results.css:143-190` | Kutchi word (review) / grown-ups' English | grown-up with child | Nunito 800 (charcoal, not maroon) / Nunito 700 | 21 / 14.5 | 28 / 14.5 |
| "?" pop-up (grown-ups) | `css/shared/buttons.css:117-129` (`--njg-font`) | grown-ups' English | grown-up | Nunito 600-800 | 14.5-17 | 14.5-17 |
| Buttons (Done, Play as new, the rail) | `css/shared/buttons.css:7, 50, 76, 93, 112` | UI | both | Nunito 800 | 17-22 | 17-22 |
| The door: Nani's line / its English | `css/day.css:79, 83` (body `day.css:8`, `--njg-font`) | Kutchi line / English under her line | child / grown-up | Nunito 800 / Nunito 600 | 22 / 14.5 | 22 / 14.5 |
| The door: weather and activity cards, Ha! and Na | `css/day.css:72, 79, 233` | Kutchi words | child | Nunito 800 | 20.6-22 | 22-44.6 |
| Clinic: side panel's word ("chokri") and grey lines | `css/clinic.css:17, 22` (`--cl-font` = body) | word to learn / not-yet-recorded line | child / grown-up | Nunito 800 / Nunito 700 italic (slant) | 14.5 | 17 |
| Clinic: said words, tallies, hint numbers | `css/clinic.css:18` (`--cl-head: "Baloo 2"`, literal), `:429` `.hs-said`, `:510` `.eye-said` | Kutchi word in the scene / UI | child | Baloo 2 800 | (not on the waiting room) | |
| Clinic heal games' drawn bubbles (hic, tummy, hair) | `js/clinic/heal/games/hic.js:186`, `tummy.js:176-177`, `hair.js:191` (`--njg-font-display`) | Kutchi word in the scene | child | Baloo 2 800 | (lab only) | |
| Farm: word tiles, their group labels, Nani's line | `css/shared/word-tiles.css:17, 27` (`--njg-card14-font`) | words to learn; the label ("khenjo") | child | Fraunces 700; **the label in italic** | 15.3-16 | 16-22 |
| The book (evening) | `css/day-book.css` (no face: body), `js/day/book.js:675` (asks a Nunito italic no link loads) | grown-ups' English, Kutchi lines | both | Nunito | not measured (did not open in the shot's 6 s) | |
| Other Cook stations' drawn words (maani, daar, samosa, grill, assemble, kitchen kit) | `js/cook/kitchen-kit.js:72`, `stations/samosa.js:98`, `stations/daar.js:69`, `mechanics/grill.js:956`, `mechanics/assemble.js:205`, `stations/maani-line.js:330` (`--njg-font-word`) | Kutchi words | child | Nunito 800 | (not shot) | |
| Older stations' drawn lines and big outlined word | `js/cook/stations.js:445, 710` (`--njg-font-display`; grey lines `--njg-font-body` italic) | Kutchi line | child | Baloo 2 bold | (not shot) | |
| Home, who-did-it, first launch headings | `css/home.css:28, 37, 101, 139`, `css/who.css:33, 67, 86, 130` (literal "Baloo 2"), `css/first.css:180` | UI and Kutchi | both | Baloo 2 800 | (not shot) | |
| Labs and the labs index | `labs.html:28` (system-ui); each lab page its own Google link | developer | Zafar | system-ui / Nunito | | |
| The font links | `cook.html:9`, `index.html:26`, `lab.html:36`, `lab/word-moment.html:12` (Fraunces 600/700, no italic); `day.html:34`, `clinic.html:25` (no Fraunces); run-time `js/cook/ui.js:204`, `js/clinic/heal/host.js:540` | | | | | |

All the sizes at the five shot sizes, and per option: `build/tools/fonts/sizes.py` (the table in section 3).

How it was measured: `build/tools/fonts/shoot.mjs` played chai L1 and L4 with the sandbox's fair player, opened the word moment's lab, the
door, the clinic's waiting room, the farm's feed and the evening book at each size, and `build/tools/fonts/inventory.mjs` read every
visible text (the DOM's computed font and size; the Phaser texts' size as drawn, by the canvas lint's own sum) and which face the
browser actually drew it in. `build/tools/fonts/sizes.py` makes the table.

## 2. Which face for which area, and why

**What the words are.** The Kutchi on screen is plain Latin: no diacritics anywhere in the displayed data (the lexicon's 507 forms use
a-z, space, hyphen, comma, full stop only; the non-Latin characters in `data/` are transcription candidates and notes, never drawn).
So any Latin face can set every word; the choice is about letter shapes and size. **"a" is a fifth of every letter** (20.8 % of the
lexicon's letters, in 79 % of its forms; "aa" is the long vowel: paani, aadu, aako, ringraa); "g" is rare (1.2 %). Short words, many
"h" digraphs (kh, dh, bh, ch: h is 8.3 %).

**Who reads them.** A 3-5-year-old does not decode: they hear the family's voice and learn a word's look as a picture (Ehri's
pre-alphabetic and partial-alphabetic phases: a word is recognised by a few salient visual cues, not its letters; Ehri 2005). A 5-7-year-old
is learning phonics at school, where the "a" they are taught to read and write is the single-storey one. Grown-ups read the English,
the "?" pop-up, the end review and the grey not-yet-recorded lines.

**What the research says, briefly.**
- *Size and spacing matter most.* Hughes and Wilkins (2000): 5-7-year-olds read faster with larger, less crowded text, and the youngest
  most. Wilkins et al. (2009): spacing (crowding) matters as much as size. Legge and Bigelow (2011): fluent reading needs an x-height
  of at least about 0.2 degrees for adults, more for children. At a phone's 30 cm that is about 1 mm, which on Zafar's phone (Flip 5,
  1 CSS px = 0.16 mm) is about 6.5 CSS px of x-height: a 13 CSS px word in Nunito. The game's 13 px floor is the adult minimum, not a
  child's comfort.
- *Letter spacing.* A little extra spacing helps young readers (Perea et al. 2012) and much more helps dyslexic children (Zorzi et al.
  2012, PNAS); the BDA Dyslexia Style Guide asks for about 35 % of the average letter width. The game's words are set at the faces' default
  spacing; a pill or a card word could take +0.02-0.04 em at no layout risk where there is room.
- *Infant letters (single-storey a and g).* Walker and Reynolds (2003, the Typographic Design for Children project): 5-7-year-olds read
  standard and infant versions of Gill and Century equally well, and serif against sans made no measurable difference; children
  noticed the different a and g but were not slowed by them. Sassoon Primary (Rosemary Sassoon, built with children) and SIL's Andika
  (built for beginning readers) are the reference infant faces. So infant letters are a comfort and a match with school, not a
  measured gain.
- *Italics.* The BDA guide says avoid them for reading; the game's grey italic lines are for grown-ups only, so this only argues for
  the true italic (finding 5), never for italic on a word a child reads.
- *Consistency.* For a pre-reader learning a word's look, the same word in three shapes is three pictures (finding 1). Of all the
  points here it is the one the game controls completely, and the cheapest to fix.

**The faces, measured** (from the font files at weight 700-800: `fontTools`, chai's 13 shelf words):

| Face | x-height (em) | average letter width (em) | "paani" (em) | a / g | l, I, 1 distinct |
|---|---|---|---|---|---|
| Fraunces 700 (opsz 9) | 0.478 | 0.569 | 2.81 | double / double | yes |
| Nunito 800 | 0.499 | 0.523 | 2.59 | double / single | l = I |
| Baloo 2 800 | 0.493 | 0.514 | 2.54 | double / single | l = I |
| Andika 700 | 0.498 | 0.545 | 2.75 | single / single | yes |

Fraunces is about 9 % wider than Nunito for the same words and its x-height 4 % lower: where a word's width is fixed (a crowded
shelf, a fitted headline, a card's column) the serif comes out smaller. Andika sits between the two in width and matches Nunito's
x-height.

**Per area, my recommendation:**

| Area | Who | Face | Why |
|---|---|---|---|
| Every Kutchi word to learn and every Kutchi line (cards, the order line, Nani's box, Nana's and the greeting bubbles, shelf pills, tally, end review, the door, the clinic, the farm's tiles, the book) | child | **one face, the "word face"** (option C: Fraunces; D: Andika) | one word, one shape (Ehri); Zafar chose the serif for the card (SH-147); the word face is a token, so a later change is one line |
| English under a word (cards, the door's line) | child + grown-up | Nunito 700 | the second voice: sans against the serif tells "this is the English" without colour |
| The grown-ups' English ("?" pop-up, the end review's English, grey not-yet-recorded lines) | grown-up | Nunito 600-800; true italic for the grey lines | the furniture; the italic only where a line is still to be recorded |
| Buttons, numbers, timers, badges | both | Nunito 800, tabular figures | the UI face; Baloo 2 nowhere |
| Labs and developer pages | Zafar, builders | system-ui or Nunito | not the child's screen |

## 3. The options on the real screens

| Option | Kutchi words and lines | English and UI | What changes from today |
|---|---|---|---|
| **A, today** | Fraunces on cards, the order line, Nani's box; Baloo 2 in Nana's bubble; Nunito on pills, the greeting, tally, end review, door, clinic | Nunito | nothing |
| **B, Nunito for every word** | Nunito everywhere (Fraunces gone) | Nunito | `--njg-card14-font`, `--kutchi-font` to Nunito |
| **C, Fraunces for every word** | Fraunces everywhere a Kutchi word is | Nunito | `--njg-font-word`, `--kutchi-font` and the door's, clinic's, end review's and tally's words to Fraunces |
| **D, Andika for every word** | Andika everywhere | Nunito | as C with Andika (single-storey a and g) |

The overrides are in `build/tools/fonts/options.mjs` (the selectors, from the inventory). The pills and every Phaser word follow
`--njg-font-word` through `Tokens.font()` (`js/shared/tokens.js`), read when the scene draws, so overriding the token before the
scene starts reaches them: no Phaser code was patched. Options B to D also load the true Fraunces italic.

**The contact sheets** (options A-D side by side, the five sizes as rows; committed small, the full shots are in
`build/screenshots/fonts/` and `build/screenshots/fonts-dpr2/`, not committed):

| Screen | Sheet |
|---|---|
| Chai L1: the order (Nana's bubble, the big "dudh" card, the side panel) | `build/reports/fonts/chai-order.webp` |
| Chai L1: the shelf | `build/reports/fonts/chai-shelf.webp` |
| Chai L4: the crowded shelf (ten pills) | `build/reports/fonts/chai-shelf-L4.webp` |
| The word moment's two cards (its lab page, at the end) | `build/reports/fonts/word-moment.webp` |
| Chai: the end screen's word review | `build/reports/fonts/end-words.webp` |
| The door (Nani's line, the cards, Ha! and Na) | `build/reports/fonts/door.webp` |
| The clinic's waiting room | `build/reports/fonts/clinic.webp` |
| **Close-ups at 2x, as a phone draws them** (the L4 pills at 740x320 and 971x318, the side panel, Nana's bubble and the big card, the door's line, the clinic's panel) | `build/reports/fonts/closeups.webp` |

The close-ups are the sheet to judge the faces on: the others are scaled to a quarter and show layout, not letters.

**What the shots show.**
- *The pills (740x320, L4, about 9 CSS px).* All four read at 2x. Fraunces 800 is the darkest and its serifs survive; Nunito and Andika
  are the most open; Andika's single-storey a is plain to see in "paani", "lasan", "aadu". None of them makes 9 px a child's size
  (finding 2): at 971x318 every option reaches the 13 px floor and all four are comfortable.
- *The side panel.* A and C look the same (the card is already Fraunces); B and D change the order line and Nani's box too. In D,
  fit.js shrinks Nani's grey line from 16 to 14.5 px at 740x320 (Andika's italic is wider), and sets it on one line at 1280x665.
- *Nana's bubble.* Today's Baloo 2 is the odd one out beside the Fraunces card under it; each of B, C and D makes bubble and card one
  face.
- *The door.* The one reflow: at 740x320 Nani's line "Tu muke randhan lai madad kar de." wraps to three lines in C and D (two in A and
  B), because Fraunces and Andika are wider than Nunito. Nothing clips; the bubble grows.
- *The end review, the clinic, the word moment.* No reflow in any option; the clinic's grey lines stay Nunito italic in every option.

**Measured per option** (the smallest size of each Kutchi surface, CSS px, with the face it was drawn in and its x-height in px; a
"-" is a shot taken at another moment):

| Surface | Size | A | B | C | D |
|---|---|---|---|---|---|
| Shelf pills (drawn) | 740x320 | 9.6 Nunito (x 4.8) | 9.6 Nunito (x 4.8) | 9.2 Fraunces (x 4.4) | 9.4 Andika (x 4.7) |
| Shelf pills (drawn) | 971x318 | 13 Nunito (x 6.5) | 13 Nunito (x 6.5) | 13 Fraunces (x 6.2) | 13 Andika (x 6.5) |
| Shelf pills (drawn) | 1920x1080 | 23.6 Nunito (x 11.8) | 23.6 Nunito (x 11.8) | 23.6 Fraunces (x 11.3) | 23.6 Andika (x 11.8) |
| Nana's bubble (play area) | 740x320 | 18 Baloo (x 8.9) | 18 Nunito (x 9.0) | 18 Fraunces (x 8.6) | 18 Andika (x 9.0) |
| Nana's bubble (play area) | 971x318 | 23.3 Baloo (x 11.5) | 23.3 Nunito (x 11.6) | 23.3 Fraunces (x 11.1) | 23.3 Andika (x 11.6) |
| Nana's bubble (play area) | 1920x1080 | 32 Baloo (x 15.8) | 32 Nunito (x 16.0) | 32 Fraunces (x 15.3) | 32 Andika (x 15.9) |
| Big item card: word | 740x320 | 28.8 Fraunces (x 13.8) | 28.8 Nunito (x 14.4) | 28.8 Fraunces (x 13.8) | 28.8 Andika (x 14.3) |
| Big item card: word | 971x318 | 28.6 Fraunces (x 13.7) | 28.6 Nunito (x 14.3) | 28.6 Fraunces (x 13.7) | 28.6 Andika (x 14.2) |
| Big item card: word | 1920x1080 | 45 Fraunces (x 21.5) | 45 Nunito (x 22.5) | - | 45 Andika (x 22.4) |
| Order card: headline | 740x320 | 14.5 Fraunces (x 6.9) | 14.5 Nunito (x 7.2) | 14.5 Fraunces (x 6.9) | 14.5 Andika (x 7.2) |
| Order card: headline | 971x318 | 14.5 Fraunces (x 6.9) | 14.5 Nunito (x 7.2) | 14.5 Fraunces (x 6.9) | 14.5 Andika (x 7.2) |
| Order card: headline | 1920x1080 | 19 Fraunces (x 9.1) | 19 Nunito (x 9.5) | 19 Fraunces (x 9.1) | 19 Andika (x 9.5) |
| Order card: item card word | 740x320 | 14.5 Fraunces (x 6.9) | 14.5 Nunito (x 7.2) | 14.5 Fraunces (x 6.9) | 14.5 Andika (x 7.2) |
| Order card: item card word | 971x318 | 14.5 Fraunces (x 6.9) | 14.5 Nunito (x 7.2) | 14.5 Fraunces (x 6.9) | 14.5 Andika (x 7.2) |
| Order card: item card word | 1920x1080 | 19.2 Fraunces (x 9.2) | 19.2 Nunito (x 9.6) | 19.2 Fraunces (x 9.2) | 19.2 Andika (x 9.6) |
| Nani's box (guide line) | 740x320 | 16 Fraunces (x 7.6) | 16 Nunito (x 8.0) | 16 Fraunces (x 7.6) | 14.5 Andika (x 7.2) |
| Nani's box (guide line) | 971x318 | 16 Fraunces (x 7.6) | 16 Nunito (x 8.0) | 16 Fraunces (x 7.6) | 14.5 Andika (x 7.2) |
| Nani's box (guide line) | 1920x1080 | 19 Fraunces (x 9.1) | 19 Nunito (x 9.5) | 19 Fraunces (x 9.1) | 19 Andika (x 9.5) |
| Word moment: card word | 740x320 | 25.1 Fraunces (x 12.0) | 25.1 Nunito (x 12.5) | 25.1 Fraunces (x 12.0) | 25.1 Andika (x 12.5) |
| Word moment: card word | 971x318 | 25.1 Fraunces (x 12.0) | 25.1 Nunito (x 12.5) | 25.1 Fraunces (x 12.0) | 25.1 Andika (x 12.5) |
| Word moment: card word | 1920x1080 | 64 Fraunces (x 30.6) | 64 Nunito (x 31.9) | 64 Fraunces (x 30.6) | 64 Andika (x 31.9) |
| End screen: word review, Kutchi | 740x320 | 21 Nunito (x 10.5) | 21 Nunito (x 10.5) | 21 Fraunces (x 10.0) | 21 Andika (x 10.5) |
| End screen: word review, Kutchi | 971x318 | 21 Nunito (x 10.5) | 21 Nunito (x 10.5) | 21 Fraunces (x 10.0) | 21 Andika (x 10.5) |
| End screen: word review, Kutchi | 1920x1080 | 28 Nunito (x 14.0) | 28 Nunito (x 14.0) | 28 Fraunces (x 13.4) | 28 Andika (x 13.9) |
| Door: Nani's line | 740x320 | 22 Nunito (x 11.0) | 22 Nunito (x 11.0) | 22 Fraunces (x 10.5) | 22 Andika (x 11.0) |
| Door: Nani's line | 971x318 | 22 Nunito (x 11.0) | 22 Nunito (x 11.0) | 22 Fraunces (x 10.5) | 22 Andika (x 11.0) |
| Door: Nani's line | 1920x1080 | 22 Nunito (x 11.0) | 22 Nunito (x 11.0) | 22 Fraunces (x 10.5) | 22 Andika (x 11.0) |
| Door: activity card word | 740x320 | 20.6 Nunito (x 10.3) | 20.6 Nunito (x 10.3) | 23.6 Fraunces (x 11.3) | 21.6 Andika (x 10.8) |
| Door: activity card word | 971x318 | 32.3 Nunito (x 16.1) | 32.3 Nunito (x 16.1) | 36.3 Fraunces (x 17.4) | 33.3 Andika (x 16.6) |
| Door: activity card word | 1920x1080 | 44.6 Nunito (x 22.3) | 44.6 Nunito (x 22.3) | 50.6 Fraunces (x 24.2) | 46.6 Andika (x 23.2) |
| Door: Ha! / Na | 740x320 | 22 Nunito (x 11.0) | 22 Nunito (x 11.0) | 22 Fraunces (x 10.5) | 22 Andika (x 11.0) |
| Door: Ha! / Na | 971x318 | 22 Nunito (x 11.0) | 22 Nunito (x 11.0) | 22 Fraunces (x 10.5) | 22 Andika (x 11.0) |
| Door: Ha! / Na | 1920x1080 | 22 Nunito (x 11.0) | 22 Nunito (x 11.0) | 22 Fraunces (x 10.5) | 22 Andika (x 11.0) |
| Clinic: order card word | 740x320 | 14.5 Nunito (x 7.2) | 14.5 Nunito (x 7.2) | 14.5 Fraunces (x 6.9) | 14.5 Andika (x 7.2) |
| Clinic: order card word | 971x318 | 14.5 Nunito (x 7.2) | 14.5 Nunito (x 7.2) | 14.5 Fraunces (x 6.9) | 14.5 Andika (x 7.2) |
| Clinic: order card word | 1920x1080 | 17 Nunito (x 8.5) | 17 Nunito (x 8.5) | 17 Fraunces (x 8.1) | 17 Andika (x 8.5) |
| Clinic: grey to-record lines | 740x320 | 14.5 Nunito (x 7.2) | 14.5 Nunito (x 7.2) | 14.5 Nunito (x 7.2) | 14.5 Nunito (x 7.2) |
| Clinic: grey to-record lines | 971x318 | 14.5 Nunito (x 7.2) | 14.5 Nunito (x 7.2) | 14.5 Nunito (x 7.2) | 14.5 Nunito (x 7.2) |
| Clinic: grey to-record lines | 1920x1080 | 17 Nunito (x 8.5) | 17 Nunito (x 8.5) | 17 Nunito (x 8.5) | 17 Nunito (x 8.5) |

## 4. Fable's ranking

(pending: the orchestrator's Fable review)

## 5. My ranking

1. **C, Fraunces for every word.** One shape per word, the look Zafar already chose for the card, and it holds at 9-13 px on a phone's
   screen; costs: the serif is about 9 % wider (the L4 pills 9.6 to 9.2 px on the smallest phone, the door's line on three lines).
2. **D, Andika for every word.** One shape per word with school letters (single-storey a, a fifth of every Kutchi letter); as legible
   as Nunito at every size; costs: plainer than the "book at Nani's" look, two weights only, and no measured reading gain from infant
   letters (Walker and Reynolds).
3. **B, Nunito for every word.** One shape per word, the narrowest and the biggest x-height, so the most robust at tiny sizes; costs:
   drops the serif he picked, and the word stops looking different from the English under it.
4. **A, today.** No change, but one word in three faces in one round (Fraunces, Baloo 2, Nunito): the one thing here the research and
   the shots both say to fix.

Whichever face: the size findings (2 and 3) matter more than the face for a 3-5-year-old, and they are size rows, not font rows.

## 6. Decisions for Zafar (yes to all except ...)

1. **One face for a Kutchi word, everywhere it appears** (cards, the order line, Nani's box, Nana's and the greeting bubbles, shelf
   pills, the tally, the end review, the door, the clinic, the farm's tiles): recommended **yes**. Today one word has three shapes on
   one chai screen (finding 1).
2. **Which face: C, Fraunces** (recommended): it is the face he chose for the card (SH-147), it keeps the "book at Nani's" look, and
   the sheets show it holding at 9-13 px on a phone's screen (the close-ups). **D, Andika**, if he would rather the words match the
   letters his children are taught at school (the single-storey "a", a fifth of every Kutchi letter); the research says it is a match
   and a comfort, not a measured reading gain. B, Nunito, only if the serif reads "fancy" to him on the pills.
3. **Nana's bubble takes the word face**, and with it Baloo 2 leaves the chai pages (Fable's flaw 3, corrected: today the bubble is
   Baloo 2). Recommended yes; it comes with 1.
4. **Load the true italics now** (Fable's decision 1, still open): the Fraunces italic for the grey lines, and the Nunito italic the
   book already asks for. Recommended yes: no layout change.
5. **Self-host the fonts with the face change** (latin only, `assets/fonts/`, one shared stylesheet every page links), not later: the
   change touches every font link anyway, the wrapped app has no Google, and it removes the day.html and clinic.html trap (finding 6).
   Recommended yes.
6. **The sizes are the bigger problem** (findings 2 and 3): a fix-list row for the English under the order card's item words (no word
   a child can read under 12 CSS px), and SH-219's pill floor stays the place for the shelf. Recommended yes (the orchestrator writes
   the row).
7. **No font named outside the tokens** (finding 4): the clinic's `--cl-head`, the home and the who-did-it pages move to the type roles,
   and SH-151's static check learns to catch a font name in a custom property. Recommended yes, with the roll-out.
8. **Letter spacing on small words** (+0.02 em on Kutchi at 16 px or less: pills, order rows): a lab look only, no game change yet.

## 7. Implementation plan

**Files and steps**

1. `css/shared/tokens.css`: the word face is one line: `--njg-font-word: var(--njg-card14-font);` (today Nunito, line 100), so every
   drawn word (the shelf pills, `js/cook/stations/chai-tray.js:134` FONT(), and the other stations' FONT()) follows the card; the
   comment names the roles: word face (Kutchi), body (English and UI), display (only modes not yet rolled over).
2. `css/cook.css:23`: `--kutchi-font: var(--njg-font-word, ...)` (Nana's bubble `.wp-text`, the dish names); `css/monsoon.css:19` at its
   roll-out.
3. The shared pieces' Kutchi takes `font-family: var(--njg-font-word)`: `css/shared/conversations.css` (`.cv-k`), `css/shared/results.css`
   (`.rs-word > b`), `css/shared/tally.css` (`.njg-tally-n`), `css/day.css:79` (`.day-k`), `css/clinic.css` (`.cl-words .ku`, `.hs-said`,
   `.eye-said`; `--cl-head` (line 18) becomes `var(--njg-font-body)` for its numbers and ticks). The selectors are the ones the mock
   used (`build/tools/fonts/options.mjs` KUTCHI_SEL), so the shots above are the preview.
4. Fonts: `assets/fonts/` with the latin variable files (Fraunces roman and italic, Nunito roman and italic, Baloo 2 for the modes not
   rolled over) and `css/shared/fonts.css` (`@font-face`, `font-display: swap`, weights 600-800); every page's Google link replaced by it
   (cook, index, lab, day, clinic, first, who, dress, snap, tidy, find, monsoon and the lab pages), the run-time links removed
   (`js/cook/ui.js:204`, `js/clinic/heal/host.js:540`). Without decision 5: add `ital` and `wght@600..800` to the Google links instead.
5. Drawn words wait for their face: before chai's shelf draws, `await document.fonts.load("800 25px Fraunces")` (chai-tray's scene
   start; the same in the stations that use FONT()), so the first pill is never drawn in the fallback (today Nunito is loaded by the
   page's own text first; the serif at 800 is not).
6. `docs/design-language/ui-design-system.md` section 2 ("Nunito throughout" is out of date): the two faces and their roles, "Zafar, <date>".

**Checks**: `node build/tools/review/checks.mjs`; `build/tools/review/pillcheck.mjs` (L1-L4, the five sizes: never touching, the 13 px
floor where there is room); `build/tools/review/panelcheck.mjs`; the sandbox's contract run for cook:chai-tray (L1-L4), clinic:waiting
and day:door at 740x320, 930x430, 1280x665, 1920x1080 and 971x318 (no clipped or ellipsised text, bubbles clear of faces: contract-52);
`build/tools/fonts/shoot.mjs --options A` again: the inventory must show every Kutchi word in the word face (worth turning into a
check: "one face per word", for `docs/process/checks-to-build.md`); the judge on the changed screens.

**Size**: about 12 CSS and HTML files, 40 lines, one new stylesheet and six font files (about 300 KB, under today's Google payload with
Baloo 2 dropped from chai); half a day with the checks.

**Risk**: reflow: Fraunces is about 9 % wider than Nunito, so where width is fixed words come out smaller (measured above: the L4 pills
on the smallest phone, Nana's bubble wider, the door's line wraps sooner, the clinic's one-line bubbles widen); fit.js and SH-219's
pill rule absorb it, the checks prove it. The canvas font race (step 5). The look: the serif on the pills is his call, which is why
the close-ups exist. Rollback: the one token line.

## Proof

- **The shoot** (one run, 6 Nov 02:57-03:20 UK): `COOK_TEST_PORT=8831 flock -w 1800 /tmp/njg-browser-8831.lock node build/tools/fonts/shoot.mjs`
  (options A-D x 740x320, 971x318, 930x430, 1280x665, 1920x1080 x chai L1, chai L4, the word moment, the door, the clinic: 140 shots,
  every one present on the sheets: "20 shots" per sheet), then `--sizes 740x320,971x318 --screens chai,shelf4,door,clinic --dpr 2
  --out build/screenshots/fonts-dpr2` for the close-ups, and `--options A --sizes 740x320,1920x1080 --screens farm,book --out
  build/screenshots/fonts-more` for the farm (the book did not open within its 6 s: not measured). No page errors stopped a run.
- **Mock only**: the game's files are untouched (`git diff --stat` of this commit: only `build/tools/fonts/` and this report and its
  sheets). The faces were served in place of the Google Fonts sheet by a Playwright route; the option's CSS injected by an init
  script; the Phaser pills took the face through the token (the inventory reads "Fraunces" and "Andika" on the canvas texts in C and D).
- **The faces**: the woff2 files fetched from Google Fonts (latin subset; SIL Open Font License) into `build/tools/fonts/woff2/` (mock
  only, about 280 KB). Metrics from the files with fontTools (x-height of "x", advances of chai's 13 shelf words).
- **The tables**: `python3 build/tools/fonts/sizes.py` (the inventory per surface and per option); the sheets: `python3
  build/tools/fonts/sheet.py` and `--crops build/screenshots/fonts-dpr2` (eight webp, about 1.2 MB in all).
- **The data's characters**: every non-ASCII character in `data/` counted (only transcription candidates, notes and emoji; no Kutchi
  diacritics); the letter counts from `data/lang/lexicon.json` (507 forms).
- **Read**: `CLAUDE.md`; `docs/process/overnight-brief-2026-11-06.md` (task 3); `build/reports/s17-fonts-review.md`; `css/shared/tokens.css`
  93-132; `js/shared/tokens.js` (Tokens.font); every `font-family` and `font:` in `css/` and the drawn texts' fontFamily in `js/`;
  `docs/process/regressions.md` SH-151 and SH-147.
- **Sources** (cited briefly above): Ehri, L. C. (2005), Learning to read words, *Scientific Studies of Reading* 9(2); Hughes, L. E. and
  Wilkins, A. J. (2000), Typography in children's reading schemes may be suboptimal, *Journal of Research in Reading* 23(3); Wilkins, A.
  J. et al. (2009), Typography for children may be inappropriately designed, *Journal of Research in Reading* 32(4); Legge, G. E. and
  Bigelow, C. A. (2011), Does print size matter for reading?, *Journal of Vision* 11(5); Walker, S. and Reynolds, L. (2003), Serifs, sans
  serifs and infant characters in children's reading books, *Information Design Journal* 11(2/3); Perea, M. et al. (2012), The effects
  of inter-letter spacing in visual-word recognition: young normal readers and developmental dyslexics, *Learning and Instruction* 22(6);
  Zorzi, M. et al. (2012), Extra-large letter spacing improves reading in dyslexia, *PNAS* 109(28); British Dyslexia Association,
  *Dyslexia Style Guide* (2023); SIL International, Andika (design notes); R. Sassoon, Sassoon Primary. The findings are quoted from
  memory of the papers, not re-read tonight: Fable's review should check any it leans on.
- **Not done**: no shot of the book, the clinic's heal games or the older stations under the options (inventory from the code); no
  Fredoka option (Fable's lab idea: it would sit with D, single-storey letters, but rounder and wider); no change to the game.
- `node build/tools/review/checks.mjs`: see the commit's run (docs check passes; this report has its Proof section).
