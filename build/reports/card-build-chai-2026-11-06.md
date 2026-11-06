# Card build, chai (6 Nov, evening): Zafar's card design and fonts in the game

Zafar's decisions of 6 Nov (final) built into chai: Lora for the Kutchi (600 for a card's word, the headline, the pills, Nana's bubble;
500 for Nani's line), Nunito Sans 600 grey for the English under it (12 px on phones, 10 on one line if long, one size per row), the
English paired under its own Kutchi, the 85% divider, three equal gaps g = 7% of the card's inner width with the last one measured to
the ink (his "D-A-Y" rule), the 30 px speaker with the whole foot as its tap area, bigger pictures at 1280 and 1920, the fonts
self-hosted in one place, and a static check. Rows SH-222, SH-223, SH-224, SH-227 (all now "waiting on Zafar": his review of chai).
Branch: the worktree's branch on top of `ccr-1f71c98a-wwowh8` (f771c96a). Not pushed, not published.

## In plain words

- **Chai only.** The new look switches on while a chai order plays and off for every other game, so nothing else changes until you say
  "roll it out". The fonts are now files in the game (`assets/fonts/`), not Google's.
- **The cards:** maroon Lora word, its grey English straight under it, the pair centred above a soft line, the speaker under the line.
  The three gaps (card foot to speaker, speaker to line, line to the English) are the same, about 4.4 px on your phone; the last one
  is measured to the letters' feet over the line, a "y" or "g" tail where one sits over it, else the baseline, as you described.
- **The English** is 12 px on the phones (was 7.9); in a row where one English has to shrink to fit ("mint chutney", the chutneys),
  the whole row shares the smaller size, 10 px. "tamarind chutney" and "coconut chutney" still wrap on the phones.
- **The cost in height:** a phone's item card is 6 to 17 px taller (two-line rows the most); with all two-line words on your phone in
  the browser the next order's headline sits 5 px into the soft fade (you accepted about 6). The big screens' cards are 17 to 22 px
  taller (the bigger pictures).
- **The pills** are Lora 600 (they were drawn at 800); their sizes are unchanged (the pill check: 12.1 px at 740x320 L1-L3, as before).

## Flaws first

1. **The pop-up card is smaller on the short phones** (740x320: 142x259 to 126x243 px; 971x318 similar) and taller at 1280 and 1920:
   it takes its row card's shape so it shrinks smoothly into it (your 3 Nov rule), and the row card is now taller. Not asked for;
   left as the rule makes it, flagged for you and the judge. If you want today's pop-up size back, the pop-up can keep its own shape
   and grow into the row instead (a few lines in `js/cook/ui.js` pop14).
2. **The contract run was not clean in one go.** Run 1 (machine heavily loaded by three builders): 10 breaks; run 2 (fresh, the final
   build): 4 breaks (contract-79 x3 "the order card's light starts while the tally chip bumps", contract-84 x1 "the lit box lifts a dark
   thing by 11.2 of 12"); those same 12 pages run again: **0 breaks**. Every break was a timing check on a different page each run; run
   1's contract-18 and contract-3 breaks did not come back in run 2. The other builder's run in the same hour, without this change, had
   contract-18 x7 and contract-79 x5. Text: **0 clipped, ellipsised or broken words** (the strict lints and contract-15 and -51) over
   72 pages.
3. **The sandbox's `--check` still says "new findings"**, only for the `lab:cook/chai-tray` flows, which have no baseline yet (every
   finding there is "new"; the same findings are known in the `cook:` flows). For the `cook:` flows: 0 new, after re-keying chai's 31
   known small-pill findings from `Text[25px 800]` to `Text[25px 600]` (the same pills at the new weight) in `build/lint/baseline.json`.
4. **panelcheck: 54 pass, 6 fail**, all SH-169 / SH-191 at 740x320 (the current card's head scrolled out of view while the order is
   said). They fail the same with the new look held off (9 pass, 6 fail at 740x320), so they are not this build's; worth a row.
   SH-192 failed at 1280 and 1920 with Lora (18.4 above / 20.6 below the headline's words); fixed by setting the Lora headline .05em
   lower on big screens (19.4 / 19.6 now; the phones were within it and are unchanged).
5. **Cook's mount test (C4): 21 failed, the same 21 as on the base commit** (Cook's global, the page listeners, the voice timers, the
   audio context: the known shared-sweep list). Not this build's.
6. **The word moment's cards were shot on their lab page** with the type turned on as chai does (the lab page links its sheets one by one,
   not through the kit, so the shot adds `fonts.css`); in the game they are inside chai and take it from the kit.
7. **The door** (Lora 600 in Fable's weights) is not chai's: it moves with the roll-out.
8. Pictures for the chutneys and "hakro khun" in the written-in rows are stand-ins; only Mum's recorded forms are written.

## What changed, where

| File | What |
|---|---|
| `assets/fonts/` | Lora 400-700 upright and italic, Nunito Sans (latin woff2, variable), `OFL.txt`, `README.txt` |
| `css/shared/fonts.css` (new), `css/shared/kit.css` | every `@font-face`, `font-display: swap`; imported by the kit, so every live page pulls it (a face downloads only where it is drawn) |
| `css/shared/tokens.css` | `--njg-font-kutchi` (Lora), `--njg-font-english` (Nunito Sans), `--njg-weight-drawn`, `--njg-card14-en-font`, `--njg-card14-en-grey` (#6f6660), `--njg-card14-divider`, `--njg-card14-hair`; the gate `:root.njg-lora { ... }` that points the card, word and Cook faces at Lora, the drawn weight at 600, the English at Nunito Sans grey |
| `js/shared/tokens.js` | `Tokens.weight(role)`; `Tokens.font` never returns an empty face |
| `js/cook/ui.js`, `js/cook/flow.js` | `UI.applyType(on)`: `<html class="njg-lora">` while a chai order plays (flow.js preLook waits for the faces, at most 1.5 s, so Phaser never draws a pill in the fallback); off on unmount; `UI.TYPE_ALL` for the roll-out |
| `js/cook/stations/chai-tray.js` | 5 lines: the drawn-word face without a hard-coded fallback; the pills' and the pop-word's weight from `Tokens.weight("drawn")` (was "800") |
| `css/shared/word-card.css` | the "6 Nov type" block: Lora 600 card word (line-height 1.08), Nunito Sans 600 English (line-height 1.1), 12 px English in the side panel on phones, the pop-up's English a little apart from its Kutchi; the English face through `--njg-card14-en-font` |
| `css/shared/order-card.css` | the "6 Nov type and item card" block: headline 600, Nani's line 500, Cook's Kutchi lines and bubbles 600, the side panel's item card (rows, the divider as the card's `::before`, g = 7cqi three times, the speaker 30 px on phones / 48 px on big screens, its tap area the card's whole foot, the English dots' tap stopping half a gap above the line, 6:5 pictures at 501 px tall and up), SH-192's headline nudge |
| `css/shared/results.css` | the end screen's Kutchi words Lora 600 (gated) |
| `css/cook.css`, `css/shared/conversations.css` | font fallbacks that named faces outside the tokens removed |
| `js/shared/word-card.js` | `fit14`'s row pass (below); a fit that touches a row fits the whole row; again after a peek ends, a demo ends, a resize, a face loading |
| `build/lint/static.mjs` (+ test) | check `fonts` |
| `build/tools/cards/card-build.mjs`, `card-build-sheet.py`, `ink-probe.mjs` | the before/after shots and measures, the sheets and the pixel check, the ink probe |
| `docs/design-language/ui-design-system.md` ("Kit"), `guide-and-card.md` ("The 6 Nov card"), `docs/tools.md`, `docs/process/regressions.md` | the decisions; the four rows |

## How the last gap works (Zafar's rule)

At the end of `WordCard.fit14`, for every order row (`.oc-row14`) the fit touched, while the type is on:

1. **One English size:** the row's smallest fitted English size goes to every card in it (and to its dots).
2. **The ink foot of each card:** the divider's span is read from the card's `::before` (its computed width, centred on the card). Every
   letter of the English's **last line** is measured on its own: a `Range` over the letter gives its place; the letter's baseline is
   that box's foot less the face's descent (`measureText().fontBoundingBoxDescent`); `measureText(letter).actualBoundingBoxDescent`
   gives its ink below the baseline, which counts only when it is a real tail (over 0.1 em: y, g, p, q, j, a comma). Of the letters
   whose boxes cross the divider's span, the lowest of (baseline + tail) is the ink foot. A card with no English measures its Kutchi.
3. **The give-back:** `--wc14-ink` = the English box's foot minus the ink foot, set on the English slot; the CSS gives exactly that much
   back under it (`margin-bottom: calc(-1 * var(--wc14-ink))`) and the English's dots' tap area follows. So the card with no spare puts
   its lowest ink exactly g above the divider; the row's cards are one height, so the divider is at one height across the row and every
   other card's pair, centred in its room, sits higher (never the divider raised).

Measured in the game (dpr 2, every card of the row, the ones scrolled out of view too): the row's last gap equals g within 0.02 px at
every size; read again off the screenshots' pixels, each card in view agrees with the game within 0.48 px on the phones and 0.89 px at
1280 (`build/screenshots/card-build/pixels.json`; the browser snaps text to device pixels: `ink-probe.mjs` shows the computed baseline
exact and the ink within 0.75 px of the pixels at 10 to 13.5 px). Under "water" the gap is to the baseline; under "sugar" to the g's
tail; under "mint chutney" to the y's tail where it lies over the line.

| Screen | g (all three) | Item card before -> after: one line / mixed / two lines | Next headline clear of the fade (two lines) | Speaker drawn, tap area |
|---|---|---|---|---|
| 740x320 | 4.48 | 123.6 -> 131.8 / 138.7 -> 144.5 / 138.7 -> 155.5 | 13.5 -> -3.3 | 31.7 -> 29.8 px; 74 x 42 |
| 971x318 | 4.48 | 123.6 -> 131.8 / 138.7 -> 144.5 / 138.7 -> 155.5 | 11.5 -> -5.3 | 31.7 -> 29.8 px; 74 x 42 |
| 971x412 | 4.41 | 122.7 -> 130.8 / 137.8 -> 143.5 / 146.9 -> 154.5 | 91.2 -> 83.7 | 31.7 -> 29.8 px; 73 x 42 |
| 930x430 | 4.41 | 122.7 -> 130.8 / 137.8 -> 143.5 / 146.9 -> 154.5 | 109.2 -> 101.7 | 31.7 -> 29.8 px; 73 x 42 |
| 1280x665 | 6.83 | 180.3 -> 197.3 / 196.5 -> 214.1 / 196.5 -> 214.1 | 212 -> 193.5 | 48 px; 113 x 66 |
| 1920x1080 | 8.40 | 206.7 -> 228.2 / 226.7 -> 248.9 / 226.7 -> 248.9 | 428 -> 427 | 48 px; 139 x 71 |

English: 7.9 px before on every phone; after 12 px (all one line), 10 px in a row with a long English (shared); 12 px on big screens as
before. The divider at one height in every row (0 px spread); the speaker's tap area never over the English's (0.02 px, rounding);
nothing clipped, overlapping or outside its card in any case, peek or hidden state.

## The roll-out (how it flips on everywhere)

1. Cook's other games: `UI.TYPE_ALL = true` in `js/cook/ui.js` (as `S14_ALL` did for the s14 look).
2. Every game: move the `:root.njg-lora { ... }` lines in `css/shared/tokens.css` into `:root`; drop the `:root.njg-lora` prefix in the
   "6 Nov type" blocks of `css/shared/word-card.css`, `order-card.css` and `results.css`; in `js/shared/word-card.js` make `type14()`
   return true (the row pass for every order row); then `applyType` and the class can go.
3. Each game's own sheets: their `font-weight: 800` Kutchi lines to 600/500 and their `"Baloo 2"` / `Fraunces` names out; add its files
   to `CHAI_FONT_FILES` in `build/lint/static.mjs` (or drop the list so every file fails), one game per step with its before/after
   shots, as decided ("Do Chai, let me review it, and then ... roll it out everywhere").
4. Then the Google Fonts links go from every page (Nunito self-hosted too) and Fraunces and Baloo 2 from the game.

## Proof

- **Red then green:** the `fonts` check on the files before this build finds 15 face names in chai's files (cook.css's `--kutchi-font`
  and `--ui-font` fallbacks, conversations.css's body face and lab tag, chai-tray.js's drawn-word fallback); after: 0; the planted
  fixtures in `build/lint/static.test.mjs` fail and pass as they should. SH-192: 18.4/20.6 (fail) -> 19.4/19.6 (pass). The big-screen
  speaker: tap-small 45x45 (new finding) -> 48 (gone).
- `node build/tools/review/checks.mjs` (19:35, on e6d8d1f): **all green**: unit 645 pass, words, static (822 known, 0 new; fonts:
  230 names in 41 other games' files, warned), leak (20 configs), bump, specs, docs, fixlist, recordings, art, size, load 29/29.
- The chai contract run (`--touched cook:chai-tray,lab:cook/chai-tray --parallel 3 --check`, 60 pages, resumed once): 4 timing breaks
  (flaw 2); those 12 pages again: 0 breaks; 0 clipped text over all 72 pages.
- `panelcheck.mjs`: 54 pass, 6 fail (flaw 4, the same with the new look off); `pillcheck.mjs`: all pass (exit 0).
- Before/after sheets (dpr 2) at 740x320, 971x318, 971x412, 930x430, 1280x665, 1920x1080: `build/screenshots/card-build/panel-<size>.webp`
  (the order card: chai's own order, all one line, all two lines, mixed; hidden and peeking) and `screens-<size>.webp` (the pop-up card,
  a long word in it, Nani's box, Nana's bubble, the shelf pills, the word moment's cards). Made by
  `COOK_TEST_PORT=8862 flock -w 1800 /tmp/njg-browser-8862.lock node build/tools/cards/card-build.mjs --out <dir>` then
  `python3 build/tools/cards/card-build-sheet.py <dir> build/screenshots/card-build`. Raw shots and the sandbox runs deleted after use.
- The judge batch: `build/screenshots/card-build/judge/brief-01.md` (not yet judged).
