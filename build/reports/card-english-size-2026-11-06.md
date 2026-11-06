# Card English size (6 Nov, SH-222): bigger English under the Kutchi without changing the cards

For Zafar (6 Nov): "the English in the order cards words and the item cards words ... shrinks really, really small ... could we make it a
little bit bigger and move the kachi slightly up and the speaker slightly down?" A study only: nothing in the game changed. Every option
below is CSS injected into the real game by a script (`build/tools/cards/english-options.mjs`), played on chai L1 at five screen sizes.

## In plain words

- **Only one place is tiny: the small item cards in the order card on phones.** Their English is 7.9 px (about two thirds of the
  12 px it is on the laptop). The big pop-up card's English is 14 to 28 px and Nani's helper card's is 16 px: those are fine.
- **Yes, we can make it 12 px (half as big again) without changing the card's size.** The room comes from two small gaps: the space
  above the Kutchi and the space between the English and the speaker. The cards stay exactly as wide and as tall (within 1 px),
  nothing is cut off, nothing overlaps. On the laptop and the big screen nothing changes at all (they are already 12 px).
- **My pick: option 2.** 12 px English, the Kutchi a touch higher, the speaker where it is.

## Flaws first

1. **The tallest card sets every card's height.** "hakro khun" wraps to two lines, so its card is the tallest and every card in the
   row takes its height. Making the English bigger with nothing else (option 1) makes every item card 4.7 px taller on phones,
   which is a change in the card's size. Options 2 to 4 take the room from that card's gaps instead.
2. **"Speaker slightly down" has no room to go down.** On phones the speaker already sits 6.2 px from the card's foot, the same gap as
   the card's sides (SH-148's even spacing). So the room comes from the gap above the speaker (3.2 to 1.6 px) and above the Kutchi
   (3.8 to 1.9 px on the two-line card; on the one-line cards the Kutchi rises from 18.9 to 17 px under the picture). The speaker stays put.
3. **The gap between the English and the speaker gets tight in option 2 and 4 (1.6 px).** It reads as one block (word, English,
   speaker); option 3 keeps 2.5 px but its English is 11 px.
4. **Word moment cards were not measured** (time). Their item cards are outside the side panel, so the phone shrink (`--njg-p`) does
   not reach them and their English keeps the 12 px floor from the CSS; to confirm with the same script in the build.
5. **L2 to L4 were not shot:** the order card shows English only at L1 (non-negotiable 3), so L1 is the only level it matters.
6. Option 4 draws the speaker at 30 px (today 31.7 on phones): that is the side panel's own floor for a drawn speaker
   (SH-185); its 48 px tap area does not change.

## Today, measured (chai L1, side panel item cards; the two-line "hakro khun" card, which sets the row's height)

| Screen | English | Card (w x h) | Kutchi | Speaker | Gap above Kutchi (2-line / 1-line card) | Kutchi to English | English to speaker | Foot below speaker |
|---|---|---|---|---|---|---|---|---|
| 740x320 | **7.9 px** | 76.4 x 138.7 | 14.5 px | 31.7 px | 3.8 / 18.9 | 0.3 | 3.2 | 6.2 |
| 930x430 | **7.9 px** | 75.4 x 137.8 | 14.5 px | 31.7 px | 3.8 / 18.9 | 0.3 | 3.1 | 6.2 |
| 971x318 | **7.9 px** | 76.4 x 138.7 | 14.5 px | 31.7 px | 3.8 / 18.9 | 0.3 | 3.2 | 6.2 |
| 1280x665 | 12 px | 115.4 x 180.3 | 15.6 px | 48 px | 5.8 / 5.8 | 0.5 | 4.9 | 8.9 |
| 1920x1080 | 12 px | 141.2 x 206.7 | 19.2 px | 48 px | 7.2 / 7.2 | 0.6 | 6 | 10.6 |

The other cards with English under a Kutchi word (all px):

| Screen | Pop-up big card: English / Kutchi / speaker / card | Helper card (side by side): English / Kutchi / card |
|---|---|---|
| 740x320 | 14.2 / 28.8 / 41.4 / 165.7 x 300.3 | 16 / 15.2 / 202.3 x 41.8 |
| 930x430 | 19.1 / 38.7 / 55.7 / 222.6 x 407.3 | 16 / 15.2 / 202.3 x 41.8 |
| 971x318 | 14.1 / 28.6 / 41 / 163.1 x 296.3 | 16 / 15.2 / 202.3 x 41.8 |
| 1280x665 | 22.2 / 45 / 47 / 187.9 x 293.7 | 16 / 23.1 / 308.6 x 61.8 |
| 1920x1080 | 22.2 to 27.6 / 45 to 56 / 44 to 93 / up to 373 x 463 | not up in the run |

Why 7.9: `css/shared/word-card.css:203` floors the item card's English at `--njg-card14-u12`, and inside the side panel
`css/shared/order-card.css:648` multiplies that by the phone factor `--njg-p` (0.66 at the floor, `js/cook/ui.js:1075`): 12 x 0.66 = 7.9.

## The options (phones only; the laptop and big screen are unchanged in every option)

| Option | What moves | English 740x320 / 930x430 / 971x318 / 1280x665 / 1920x1080 | Card height on phones | Clipped, overlap, outside the card |
|---|---|---|---|---|
| 1. 12 px floor only | the English only | 12 / 12 / 12 / 12 / 12 | **+4.7 px taller** (138.7 to 143.4) | none |
| 2. 12 px, Kutchi up, gap trimmed | English 12 px set tight; gap above Kutchi 6 to 3 (card units); gap above speaker 5 to 2.5 | 12 / 12 / 12 / 12 / 12 | same (138.7 to 138.1) | none |
| 3. 11 px, Kutchi up | English 11 px; gap above Kutchi 6 to 3; gap above speaker 5 to 4 | 11 / 11 / 11 / 12 / 12 | same (138.7 to 138.6) | none |
| 4. 13 px, speaker drawn 30 px | option 2 plus the speaker drawn 30 px (tap area 48) | 13 / 13 / 13 / 12 / 12 | same (138.7 to 137.4) | none |

Sheets (today on the left, the option on the right, at the five sizes; phones enlarged 2x with whole pixels):
`build/reports/cards/option-1-floor12.png`, `build/reports/cards/option-2-nudge.png`, `build/reports/cards/option-3-floor11.png`,
`build/reports/cards/option-4-big13.png`.

## Recommendation

**Option 2.** It is what you asked for: the English half as big again (7.9 to 12 px, the same as on the laptop), the Kutchi a little
higher, nothing else changing size, no clipping. Option 4 gets one more pixel but shrinks the speaker a touch; option 1 changes the
card's height; option 3 is a smaller gain for the same change.

## Decisions for Zafar

1. Option 2 for the order card's item cards on phones (12 px English, Kutchi nudged up, the gap above the speaker trimmed). Recommend yes.
2. The speaker stays where it is (there is no room under it: it already sits at the card's even edge gap). Recommend yes.
3. The pop-up card and the helper card stay as they are (14 to 28 px and 16 px today). Recommend yes.
4. The word moment's cards: check them in the build with the same script, change nothing unless they fall under 12 px. Recommend yes.

## Implementation plan

- **Files:** `css/shared/word-card.css` only (one block for the item card under the phone layout, `@media (max-height: 500px)`):
  the English `clamp(calc(var(--njg-px) * 12), 10cqi, max(calc(var(--njg-px) * 12), var(--njg-card14-u19)))` with line-height 1;
  `.wc14-it > .wc14-slot-k { margin-top: 3cqi }`; `.wc14-it > .wc14-spk { margin-top: 2.5cqi }`, each under `body.njg-s14 #side`. The CSS is the `nudge` option in
  `build/tools/cards/english-options.mjs`, without the `!important`s.
- **Steps:** apply; close SH-222 in `docs/process/regressions.md` with the measure; note the decision in the shared screens' doc.
- **Checks:** the sandbox's text checks at the four sizes and 971x318 (no clipped or ellipsised text; the text-small finding on
  `p.english.revealed` at 740x320 goes away); re-run `build/tools/cards/english-options.mjs` to confirm 12 px and the card heights;
  `node build/tools/review/checks.mjs`; the judge on the order card at the four sizes.
- **Size and risk:** about 5 lines, mid-tier model, under an hour. Risk: low. The item card is shared (`js/shared/word-card.js`) and the
  dress games use it too (`js/dress/games/table.js`, `js/dress/games/fitting.js`); the shrink happens only inside the side panel, so
  the rule should be scoped to `body.njg-s14 #side .wc14-it`, leaving the dress
  games' cards as they are; check one dress game at 740x320 in the same run.

## Proof

- The study: `COOK_TEST_PORT=8852 flock /tmp/njg-browser-8852.lock node build/tools/cards/english-options.mjs` (chai L1, the fair player,
  five sizes, each option injected at the order pop-up and at the first shelf view), then `python3 build/tools/cards/sheet.py`.
  All 25 option-by-size measurements: no clipped text, no overlap, nothing outside its card.
- `node build/tools/review/checks.mjs`: green (see the commit's run).
