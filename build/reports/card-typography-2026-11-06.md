# Card typography (6 Nov, afternoon): the item card's spacing, hierarchy and English face

For Zafar (6 Nov, on `cards/old-vs-new-card.png`): "It needs work. It just feels clunky, messy, visually not nice ... the line spacing
within the red text and the black text ... between the red text and the black text ... the Kutchi and English just sit too close
together ... really close to the speaker, with a lot of space [above] ... Is the Kutchi and the English the same size? ... Are we confident
about the sans serif English font? ... Show me ones where all the items are on one line, all on two lines, and two-line next to single-line."

A study only: nothing in the game changed. Every option is CSS injected into the real game (chai L1) by
`build/tools/cards/typo-options.mjs`; the sheets come from `build/tools/cards/typo-sheet.py`.

## In plain words

- **There is room.** With Nani's box shut, your phone without the banner (971x412) shows one whole order card and the next card's
  headline with **about 90 to 115 px to spare**. Even with the browser's bar (971x318) and on the smallest phone (740x320) the next
  headline shows, with **12 to 14 px to spare** when a row has two-line words. So the cards can grow a little (up to about 10 px)
  and the peek still holds everywhere. (With Nani's help card open, the small phones lose that peek: that is true today too.)
- **Why it looks clunky, measured:** the English sits 0.3 px under the Kutchi, the speaker 1.6 px under the English, and a one-line word
  beside a two-line one gets all the row's spare room (15 to 19 px) above it. And the English is the same near-black as the headline at
  bold 700, 12 px under a 14.5 px Kutchi: 83% of its size, nearly the same weight. That is the "too similar".
- **The fix in every option:** a real gap between the Kutchi and the English (2 to 3 px) and between the English and the speaker
  (3 px or more); the two Kutchi lines a touch apart; the English a warm grey and lighter (500 or 600); the speaker drawn 12 to 15%
  smaller with its tap area kept and **no longer overlapping the English's** (today they overlap by 10 px on phones).
- **The Kutchi cannot get much bigger on the phone cards:** the line is about 63 px wide and "fudino ji" already fills it at 14.5 px. So
  the hierarchy comes from colour and weight, not size.
- **My pick: option 2** (the words centred between the picture and the speaker, the English in Nunito Sans 600, grey). The cards keep
  their height (within 1 px).

## The space budget (step 1: measured, today's game, Nani's box shut, chai L1, a copy of the order card underneath as "the next card")

"Room left" is how far the next card's headline sits above the list's soft foot (the fade): more than 0 means its headline is whole
and clear; it is the room the item cards could grow by and still keep that peek.

| Screen | Side panel (w x h) | Nani's box shut | Order card (one-line row / two-line row) | Room left: one-line row / two-line row | With Nani's help card open (two-line row) |
|---|---|---|---|---|---|
| **971x412** his phone, no banner | 224 x 412 | 50 | 172 / 196 | **+116 / +91** | +44 |
| 971x318 his phone in the browser | 224 x 318 | 50 | 169 / 184 | **+27 / +12** | -36 (the next card hidden, this one into the fade) |
| 740x320 smallest phone | 224 x 320 | 50 | 169 / 184 | **+29 / +14** | -34 |
| 930x430 largest phone | 224 x 430 | 50 | 172 / 196 | +134 / +109 | (not measured) |
| 1280x665 laptop | 346 x 665 | 63 | 256 / 272 | +221 / +212 | +142 |

The item cards themselves on phones: 123 px tall (all one-line words), 138 to 139 px (a two-line word in the row), 147 px when an
English also wraps (below). Spare: the side panel is 224 px wide on every phone, so an item card is about 76 px wide.

## Flaws first

1. **Two long English words wrap on the phone cards in every option and every face:** "tamarind chutney" and "coconut chutney" need about
   95 px at 12 px and 79 px at 10 px; the line is 63 px. The card's fit shrinks them to 10 px, then wraps them (its last resort, no
   clipping). That row's cards grow by one English line (about 10 px), which uses most of the 12 px left at 971x318. Today's game does the
   same (at 7.9 px it also wraps "tamarind chutney"). See decision 5.
2. **Option 5 (+6 px card) costs the small phones:** with two-line words at 971x318 the next card's headline sits 4 px into the soft
   foot (still readable, in the fade); at 740x320, 2 px. On your phone without the banner it has 85 px to spare.
3. **The speaker's tap area is 48 px wide but about 34 px tall on phones in the options** (the row is a scroller, so nothing reaches
   past the card's foot, and above it is the English's tap area). Today's 48 px circle is the same 34 px where it does not overlap the
   English; the options stop the overlap rather than shrink anything. Widening it to the card's whole width (about 66 px) gives it more
   area than today's circle: in the plan, not in the mock.
4. **The pop-up card's Kutchi tripped my "scroll height" measure in the Lora options** (the approved base too, not today's Fraunces) at
   971x412, 930x430 and 1280x665. The pictures show every letter whole; it looks like Lora's tall letters running past a tight line
   box. The sandbox's own text check must pass it in the build before it ships.
5. **Pictures are stand-ins** for the chutneys and "hakro khun" (mint leaf, tamarind, the white sugar); the item cards' words are written
   in by the script. Only real Kutchi forms were used: paani, chai, dudh, khun, fudino ji chutney, amli ji chutney, nair ji chutney,
   hakro khun.
6. **Nunito 600 does not exist in the game** (index.html loads 500, 700, 800), so a Nunito English is 500 (option 1) or today's 700.
7. **Not shot:** 1920x1080 (the brief's five sizes did not include it); the dress games' item cards (they share `.wc14-it`; the rules
   below are scoped to the side panel); the approved base's pop-up at 971x412 and 971x318 (the game took the pinned copy away; the
   pop-up sheet uses 740x320, 930x430 and 1280x665 instead).

## The English face (step 2)

Free (SIL Open Font Licence) sans faces, latin only, vendored for the mock in `build/tools/fonts/woff2-sans/` (from Fontsource, licence
texts in its `LICENSE.txt`). Measured in the browser: x-height (how tall a small letter is) and the width of "mint chutney" at 12 px.

| Face | x-height | "mint chutney" 12 px | Why it is here |
|---|---|---|---|
| **Nunito** (today) | 0.50 (500), 0.46 (700) | 70 / 68 px | the game's UI face; round ends; only 500 and 700 loaded; next to Lora the round ends look a little toy-like |
| **Nunito Sans** | 0.49 | 71 px | the same letters and widths as Nunito, with plain (not round) ends: calmer beside Lora, the smallest change; any weight |
| **Source Sans 3** (Adobe) | 0.50 | 69 px | made for screens, the narrowest here (3% under Nunito), designed beside a serif (Source Serif): neutral, very calm |
| **Figtree** | 0.50 | 72 px | a clean, friendly modern sans with open letters; a little more "app" |
| **Atkinson Hyperlegible Next** (Braille Institute) | 0.50 | 70 px | made for readers with low vision: every letter distinct, wide openings; reads best when tiny; a touch quirky |
| DM Sans (rejected) | 0.50 | 76 px | 8% wider: "mint chutney" wrapped to two lines on the phone (see `typo-faces.webp`) |
| Lexend, Mulish (rejected) | | | wider still: more shrinking and wrapping in a 63 px line |

All five fit the same words at the same sizes (10 to 12 px) except DM Sans. **My pick: Nunito Sans** (the same shapes as the
buttons' Nunito, so the game keeps one sans; it just loses the round ends and gains a 600). Second: Source Sans 3 (the calmest, the
narrowest). The buttons and the UI stay Nunito in every option.

## The options (step 3: each a full set; Lora 600 Kutchi in all)

| | Words in the card | Kutchi lines | Kutchi to English | English | English to speaker | Speaker drawn (tap area) | Card height on phones |
|---|---|---|---|---|---|---|---|
| **Today** | sit on the speaker; spare above | 1.04 | 0.3 px | Nunito 700, near-black, 7.9 px | 3.1 px | 31.7 px (48 circle, overlaps the English by 10 px) | 138 |
| **Approved this morning** (2b + Lora) | the same | 1.04 | 0.3 px | Nunito 700, near-black, 12 px (10 if long) | 1.6 px | 31.7 px (overlaps by 12 px) | 135 |
| **1 Tidy** | the same (bottom) | 1.08 | 2.2 px | Nunito 500, grey, 12 px | 3.1 px | 28 px (48 wide, no overlap) | 138 |
| **2 Centred** | centred between picture and speaker: the spare split above and below | 1.08 | 2.2 px | **Nunito Sans 600, grey, 12 px** | 3.1 px (a one-line word: 10) | 27.5 px (48 wide, no overlap) | 138 |
| **3 Top-aligned** | under the picture; the speaker at the foot; the spare above the speaker | 1.08 | 2.2 px | Figtree 500, grey, 12 px | 3.1 px (a one-line word: 18) | 27.5 px | 139 |
| **4 Quieter** | centred | 1.10 | 2.5 px | Atkinson Next 500, lighter grey, **11 px** | 3.8 px (a one-line word: 12) | 27 px | 139 |
| **5 Roomy** | centred, every gap bigger | 1.12 | 3.1 px | Source Sans 3 600, grey, 12 px | 5 px (a one-line word: 13) | 27 px | **143 (+6)** |

(Two-line row, his phone without the banner, px; the grey is #6f6660, 5.6:1 on the card, AA for small text; option 4's #7b726b is
4.7:1. Nothing clipped, ellipsised, overlapping or outside its card in any option, case or size; the card's own fit (WordCard.fit14)
still shrinks a long English to 10 px: no font size is forced.)

**Sheets** (`build/reports/cards/`, 2x pixels):
- **`typo-overview.webp`: start here.** Your phone (971x412), two-line words beside one-line: today, this morning's approved card, and
  options 1 to 5 side by side.
- `typo-panel-fit.webp`: the whole side panel (Nani's box shut, one order card, the next card's peek) at 971x412, 971x318 and 740x320,
  every option, with the room left under each.
- One sheet per option, the three cases as rows and the five sizes as columns: `typo-today.webp`, `typo-o1.webp` to `typo-o5.webp`.
- `typo-faces.webp`: the six English faces on option 2's layout, with each English's measured width.
- `typo-popup.webp`: the pop-up card ("fudino ji chutney") in every option at 740x320, 930x430 and 1280x665.

## My ranking

1. **Option 2, Centred, Nunito Sans.** The one-line word no longer floats over a hole: its spare is split above and below, so the words
   sit in the middle of their space beside a two-line neighbour, and the speakers still line up along the row. Calm grey English, clearly
   second to the maroon Kutchi. Same card height.
2. **Option 4, Quieter.** The clearest hierarchy (11 px, lighter grey); Atkinson reads well tiny but its letters are a little quirky
   beside Lora. Good if 2's English still feels loud.
3. **Option 5, Roomy.** The nicest to look at on your phone; the +6 px costs the peek on small phones with the browser bar (4 px into
   the fade). A middle way: option 2 with half of 5's extra room (+3 px).
4. **Option 1, Tidy.** Fixes the gaps and the colour but keeps the empty space above a one-line word, which is what you disliked.
5. **Option 3, Top-aligned.** The first Kutchi lines line up, but a one-line word leaves an 18 px hole above its speaker: it looks
   unfinished.

## Fable's ranking

Nine sheets, phone columns zoomed. Flaws first:

1. **The all-two-lines row mixes two English sizes side by side in every option** ("mint chutney" 11 px beside "tamarind chutney"
   10 px, wrapped). One rule fixes it: when the fit shrinks one English in a row, the row shares the smaller size.
2. **`typo-popup.webp`, option 1 at 740x320 is a wrong shot** (no pop-up card). Re-shoot the tile.
3. **Option 5's peek is stated two ways:** flaw 2 says 4 px into the fade at 971x318, the panel-fit sheet says +5 px clear. Reconcile.
4. **The speaker's tap area is 34 px tall on phones** in every option; widening it does not fix that. Decision 6's full-foot speaker
   does: keep it.
5. No clipping, overlap, extra English wraps, or a face that reads wrong at phone size.

Ranking, from the 971x412 mixed row:

1. **Option 2, Centred.** No hole: the one-line Kutchi sits level with the neighbour's second line, its English with "mint chutney",
   the speakers in a row. Grey 600 under maroon Lora is clearly second without going small.
2. **Option 4, Quieter.** Hierarchy by size as well as colour, which he named; but 11 px is the floor and Atkinson's letters fight
   Lora. Borrow its lighter grey only if 2 still feels loud on his phone.
3. **Option 5, Roomy.** Nicest at 971x412; it eats the small phones' margin.
4. **Option 1, Tidy.** Right gaps, but the one-line pair still sits on the speaker under a hole: his complaint, unanswered.
5. **Option 3, Top-aligned.** An 18 px hole above the speaker: the worst mixed row.
6. **Today and the approved base:** the base beats today (12 px English) but keeps the black 700 English, the "too similar".

**English face: Nunito Sans 600.** At phone size it is the buttons' Nunito minus the round ends, so the screen keeps one sans. Source
Sans 3 is 3% narrower (one less shrink on "brown sugar"): the only reason to switch.

**The middle path (option 2 + 3 px) is a fallback, not the first ship.** Option 2 closes every gap he named; if he wants air after a
phone look, put the 3 px in the English-to-speaker gap, nowhere else.

**Recommend:** ship option 2 with Nunito Sans 600, the row-shares-one-English-size rule and decision 6's full-foot speaker; +3 px only
if he asks after a phone look.

## Decisions for Zafar

1. Option 2 for the item cards (centred words, the gaps above, the grey English, the speaker drawn about 13% smaller). Recommend yes.
2. The English in Nunito Sans (600) on the cards, the buttons and the UI staying Nunito. Recommend yes (else Source Sans 3).
3. The same face, weight, grey and gaps on the pop-up card and Nani's helper card (one card look). Recommend yes.
4. The cards keep their height (option 2); up to +3 px only if you want more air after seeing it on your phone. Recommend yes.
5. A long English ("tamarind chutney", "coconut chutney") may wrap to two lines on the phone cards, as today, rather than go under 10 px.
   Recommend yes.
6. The speaker's tap area: the card's full width below the middle of the English-to-speaker gap, the English's above it, so a tap on the
   English (the coming blur-to-show) never plays the word. Recommend yes.

## Implementation plan

- **Files:** `css/shared/word-card.css` (the item card's grid rows, gaps, Kutchi line height, the English's face, weight and colour,
  the pop-up's English); `css/shared/order-card.css` (the side panel's speaker size and its tap area, the English's dots' tap area);
  `css/shared/tokens.css` (`--njg-card14-english` to the grey; a new `--njg-card14-en-font` for Nunito Sans, so the UI's
  `--njg-card14-body` stays Nunito); `index.html` and the other pages' font link (add Nunito Sans 600, latin; or self-host the woff2);
  `build/sandbox/fonts/` (add Nunito Sans so the sandbox draws it). Lora is the morning's change (fonts-sample-2026-11-06.md) and goes in
  with it.
- **Steps:** (1) the morning's 2b + Lora, as approved; (2) option 2's CSS from `build/tools/cards/typo-options.mjs` (`setCss`, set
  `o2`), without the `!important`s and scoped to `body.njg-s14 #side` for the side panel, `.wc14-big` for the pop-up; (3) the
  speaker's `::after` widened to the card's inner width; (4) the fix list row for this feedback closed with the measures; the decision in
  `docs/design-language/` (the card's doc).
- **Checks:** re-run `typo-options.mjs --only today,o2` against the built game (the CSS then lives in the game, so "today" must equal
  option 2: card heights within 1 px, English 12/10 px, gaps as above, no overlap); the sandbox's text checks at 740x320, 930x430,
  1280x665, 1920x1080 and 971x318 (no clipped or ellipsised text: decision on flaw 4); one dress game (`table`, `fitting`) at 740x320
  to see its item cards unchanged; `node build/tools/review/checks.mjs`; the judge on the order card and the pop-up at the four sizes.
- **Size and risk:** about 25 lines of CSS and one font file; mid-tier model, under two hours. Risk: low to medium (the item card is
  shared; the rules stay scoped to the side panel and the s14 cards).

## Proof

- The study: `COOK_TEST_PORT=8858 flock /tmp/njg-browser-8858.lock node build/tools/cards/typo-options.mjs --out <dir>` (chai L1, the
  fair player, five sizes at 2x; each option injected at the order pop-up and at the shelf view, three content cases), then
  `python3 build/tools/cards/typo-sheet.py <dir> build/reports/cards`. The pop-ups were shot again with `--popup-only`. All 111 (105 options by case by size, 6 faces)
  panel measurements: nothing clipped, overlapping or outside its card (the pop-up's flag: flaw 4).
- `node build/tools/review/checks.mjs` (6 Nov, 15:25, on 07ff2d1 plus this study): words, static, leak (20 configs), bump, specs, docs,
  fixlist, recordings, art, size and load (29/29) ok; unit 643 pass, **1 fail: `docs/design-language/art-pipeline.md` 13,528 characters
  over its 13,500 limit**. This study does not touch that file; the branch has fixed it since (abd993d, "art-pipeline under its word
  limit"), so the run is green once this branch is merged onto it. No game file changed.

## Round 2 (6 Nov evening)

Zafar (6 Nov, ~17:00): "I like Fable's suggestion ... English should stay aligned with other cards' English if they're both on one
line, with the Kutchi centre aligned. Speaker has to stay at bottom but can we improve or tie in? ... I also want to keep the speaker
prominent for non readers." And the critique he shared: the speaker circle "floating in space at the bottom of the card with an identical
gap above and below it ... not visually grouped with the text or the card bottom"; on big screens "the item images stay relatively small
... let the item images grow". (Its "hakro/brown crop" at 1280 is the next card's deliberate peek at the panel's edge: left as it is.)

Still a study: nothing in the game changed. Every treatment is option 2 (Lora 600 Kutchi, Nunito Sans 600 grey English, option 2's gaps)
plus the four changes below, injected into the real game (chai L1) by `build/tools/cards/typo-options.mjs` (`r2Css`, sets `r2A`, `r2B`,
`r2C`); the sheets by `typo-sheet.py --round2`.

### What changed

1. **The row lines up.** In each row the Kutchi area is as tall as the row's tallest Kutchi, a one-line Kutchi centred in it; so every
   one-line English sits on one shared line and every speaker on one line at the cards' foot. Measured: in every round-2 row the one-line
   Englishes' tops are level (0 px apart; option 2 had them 8.5 to 10 px apart in a mixed row), and the speakers level.
   **How: a small row pass after the card's fit, not CSS.** The pass clears, measures and sets each Kutchi area's min-height to the row's
   tallest; the card's rows are picture, Kutchi area (its Kutchi centred), English (at its top), the spare, the speaker zone. CSS subgrid
   was tried first and cannot work here: the item card is a size container (`container-type: inline-size`, for its `cqi` units), and a
   contained grid cannot be a subgrid (Chrome computes it as `none`). **The build must use the same pass**, at the end of
   `WordCard.fit14`, so it runs again after every fit, peek and resize.
2. **One English size per row** (Fable's flaw 1): the same pass gives every card in the row the fit's smallest English size. A long
   English still wraps rather than go under 10 px ("tamarind chutney" on the phones, as before).
3. **Three speaker treatments**, each with the circle at the card's foot, drawn at 94% of today's (30 px on the phones, 45 at 1280 and
   1920; option 2 had 28 and 42), and its **tap area the card's whole foot**: the card's full width, from the middle of the gap under the
   English down to the card's edge (73 x 37 px on his phone, against option 2's 48 x 34; 114 x 57 at 1280). It never overlaps the
   English's own tap area (0 px everywhere).
   - **A Footer band:** the card's cream a shade warmer (#f6eddf to #f3e8d6), across the foot to the card's edges and rounded corners,
     a hairline of the card art's rule colour on top; the circle seated in it. The band is the tap area.
   - **B Divider line:** a thin line in the card art's rule colour (#dccbae), fading at its ends, above the speaker zone; the circle under it.
   - **C Foot button:** a rounded bar the card's inner width, the same warm cream with a soft rule-coloured edge; the circle centred in it.
4. **Bigger pictures on big screens** (min-height 501 px; the phones unchanged): the picture box 6:5 instead of 4:3 and the picture 96%
   of it instead of 88%: the drawn picture about 21% taller (1280x665: 64 to 78 px; 1920x1080: 79 to 96 px).

### The space it costs

The cards grow by 1 to 3 px on the phones (a two-line row at 971x318: option 2 149, A 152, B 152, C 151). The next card's headline:

| Screen | Option 2 | A | B | C |
|---|---|---|---|---|
| 971x412, mixed / all two lines | +100 / +90 | +99 / +88 | +98 / +87 | +99 / +88 |
| 971x318, mixed / all two lines | +11 / +1 | +10 / **-1** | +9 / **-2** | +10 / **-1** |
| 740x320, mixed / all two lines | +13 / +3 | +12 / +1 | +11 / 0 | +12 / +1 |

(+: px to spare with the next headline clear of the list's soft foot; -: the headline whole but that far into the fade. This order card
is whole and clear in every panel.)

### Flaws first

1. **The tightest case (all two-line words, one English wrapped, his phone in the browser) puts the next card's headline 1 to 2 px into
   the soft foot** in A, B and C (option 2: 1 px clear). It stays whole and readable. The cost is the bigger circle: at option 2's 28 px
   it would clear; I kept 30 px because he asked for the speaker to stay prominent.
2. **On the big screens the speaker zone is tall** (its gaps are in card units and grow with the card): A's band and C's bar read heavier
   at 1280 and 1920 than on the phone. Fine to ship; a cap on the zone's padding at the big sizes is a one-line follow-up if he finds it
   heavy.
3. **B's line is 1 px on the phones** and nearly disappears at arm's length; and it separates the speaker from the words rather than
   tying it to the card, the opposite of what he asked. (He guessed the lines "might not be the correct fix": the sheets agree.)
4. **Pictures are stand-ins** for the chutneys and "hakro khun" (as in round 1); only real Kutchi forms are used (paani, chai, dudh,
   khun, fudino ji chutney, amli ji chutney, nair ji chutney, hakro khun).
5. **Not shot:** the pop-up card (round 1's option 2, unchanged), 930x430 (this round's sizes: his two phone views, the smallest phone,
   1280 and 1920), the dress games' item cards (the rules stay scoped to the side panel).

Nothing clipped, ellipsised, overlapping or outside its card in any treatment, case or size (60 panels, 180 card measures); the speaker
zone never touches the English (1.9 px or more between them).

### Sheets (`build/reports/cards/`, 2x pixels)

- **`typo2-overview.webp`: start here.** His phone (971x412), two-line words beside one-line: option 2 (round 1's baseline), A, B, C.
- One sheet per treatment, the three cases as rows and the five sizes as columns: `typo2-A.webp`, `typo2-B.webp`, `typo2-C.webp`, and the
  baseline `typo2-o2.webp`.
- `typo2-panel-fit.webp`: the whole side panel (Nani's box shut, one order card, the next card's peek) at 971x412, 971x318 and 740x320,
  the mixed and the all-two-lines rows, every treatment, with the room left under each.

### My pick

1. **A, Footer band.** It answers both halves of the critique: the circle no longer floats, it sits in the card's own foot, grouped with
   the card's bottom edge; and the band shows a child who cannot read exactly where to tap (the band is the tap area). The quietest of the
   three: it reads as part of the card, in the card's own cream.
2. **C, Foot button.** The most obviously "a button", but a third rounded shape (picture box, card, pill) in a 76 px card, and heavy on
   the big screens. Take it if A's band feels too faint on his phone.
3. **B, Divider line.** Separates rather than ties in; the 1 px line is lost on the phone.

### Fable's round-2 pick

Six sheets, phone columns zoomed, pixels measured. Flaws first:

1. **The alignment is real:** on his phone the one-line Englishes are level in A, B and C (0 px; option 2: 17 px apart), the speakers
   level; nothing clipped or overlapping.
2. **The English-to-zone gap is the tightest spot:** about 4.5 px from the glyphs to A's hairline or C's pill at 971x412. Clean, not a
   pixel less.
3. **C on the phone is a button in a button:** a 33 px pill round a 30 px circle, a 3 px halo that reads as an outline.
4. **B's 1 px line** reads as "cut here", not "tap here".
5. **Big screens:** A's band is 59 px tall at 1920 (circle 45); across the row the bands make one warm stripe. C's pill is taller still.
6. The speaker stays prominent: 30 px maroon, the card's only strong colour, the whole foot tapping (73 x 37, was 48 x 34).
7. The next card's headline at 971x318, all two lines: whole everywhere; 1 to 2 px into the fade is invisible at phone size.
8. The bigger pictures at 1280 and 1920 are plainly better.

**Pick: A, the footer band.** The one treatment that groups the circle with the card's bottom edge (his critique) and shows a
non-reader where to tap without a fourth shape. Two small changes: cap the band's padding on big screens (about 5 px above and below
the circle, about 55 px at 1920); if the band vanishes on his phone, warm it one more shade rather than thicken the hairline. Circle
stays 30 px.

**Recommend:** yes to A with the big-screen padding cap, the circle 30 px, and the 1 to 2 px fade in the tightest case accepted.

### Decision for Zafar

1. Line the row up: the Kutchi area as tall as the row's tallest Kutchi, a one-line Kutchi centred in it, so the Englishes share one line
   and the speakers one line at the foot. Recommend yes.
2. One English size per row (the smallest the fit needs in that row). Recommend yes.
3. The speaker: **A, a soft footer band** (else C, the foot button; else B, the line), the circle 30 px on the phones (today 32, option 2
   28), its tap area the whole foot of the card. Recommend A.
4. Bigger pictures on the big screens only (about 21% taller); the phones unchanged. Recommend yes.
5. Accept the next card's headline 1 to 2 px into the soft foot in the tightest case on his phone in the browser (all two-line words, one
   English wrapped), for the bigger speaker. Recommend yes (else the circle goes back to 28 px and it clears).

### Implementation plan (updated; it replaces the item card's steps above)

- **Files:**
  - `css/shared/word-card.css`: the item card's rows (`.wc14-it`: picture, Kutchi area, English, the spare `1fr`, the speaker zone; the
    Kutchi area a centred flex column), the English's face, weight and colour, option 2's gaps; the big-screen picture
    (`@media (min-height: 501px)`: the box 6:5, the image at `inset: 2%`, 96%).
  - `css/shared/order-card.css`: the side panel's item card (`body.njg-s14 #side .oc-row.oc-it14`): its padding as a token, not `cqi`
    (so the speaker zone can reach the card's edge without the mock's `@property --njg-itpad`); the speaker zone (the card's `::before`
    in the speaker's row, `isolation: isolate` on the card, A's band colours); the circle at 94%; its `::after` tap area widened to the
    card's foot; the English dots' tap area stopping at the middle of the gap.
  - `js/shared/word-card.js`, **the row alignment**: at the end of `W.fit14`, a row pass over every `.oc-row14` the fitted cards sit in
    (also when it is called with one card, after a peek): (a) every visible card's English (and its dots) to the row's smallest fitted
    size; (b) every card's `.wc14-slot-k` min-height cleared, measured, and set to the row's tallest. About 15 lines: the mock's
    `settle()` in `typo-options.mjs`.
  - Round 1's, unchanged: `css/shared/tokens.css` (the grey, `--njg-card14-en-font`), the Nunito Sans 600 font link or a self-hosted
    woff2, `build/sandbox/fonts/`, Lora (the morning's change).
- **Checks:** re-run `typo-options.mjs --only today,r2A --sizes 971x412,971x318,740x320,1280x665,1920x1080 --no-popup` against the
  built game ("today" must equal A: card heights within 1 px, the Englishes level, the tap area 73 x 37 on his phone, no overlap); a peek
  on a hidden English in a mixed row (the row stays level after it); the sandbox's text checks at the four sizes and 971x318; one dress
  game (`table`, `fitting`) at 740x320 unchanged; `node build/tools/review/checks.mjs`; the judge on the order card at the four sizes.
- **Size and risk:** about 40 lines of CSS, 15 of JS and one font file; mid-tier model, about two hours. Risk: low to medium (the item
  card and `fit14` are shared; the CSS stays scoped to the side panel; the row pass touches only `.oc-row14` rows).

### Proof (round 2)

`COOK_TEST_PORT=8858 flock /tmp/njg-browser-8858.lock node build/tools/cards/typo-options.mjs --out <dir> --only o2,r2A,r2B,r2C --sizes
971x412,971x318,740x320,1280x665,1920x1080 --no-popup`, then `python3 build/tools/cards/typo-sheet.py <dir> build/reports/cards
--round2` (6 Nov, 15:55). 60 panels, 180 cards: nothing clipped, overlapping or outside its card; this order card whole and clear in
every panel; the next card's headline whole in every panel; the one-line Englishes and the speakers level in every round-2 row.

`node build/tools/review/checks.mjs` (6 Nov, 16:00, on 156c8d0 plus this round): unit (644 pass), words, static, leak (20 configs),
bump, specs, docs, fixlist, recordings, size and load (29/29) ok; **art fails** on the stove run's new item pictures
(`assets/cook/items-s17-stove/`, 5760719: "not referenced" and palette flags, 170 of 369). This round touches no picture; that is the
stove run's open redo list, not this study's. No game file changed.

## Round 3 (6 Nov night)

Zafar (6 Nov, ~17:45): "I'm going to go back on my word ... in [round 1's] option 2 ... the English word chai sits under the Kutchi word
for chai directly ... that looks better. The other way looks awkward ... keep the words paired together." And: "You and Gemini both like
the footer band A. I completely disagree ... it breaks up the card concept ... Let's do the divider line ... 70, 80, 85 and 90% ... the
padding should be equal: the bottom of the card up to the bottom of the speaker; the top of the speaker up to the divider line; the
divider line up to the bottom of the English word ... But obviously don't raise the divider line up halfway up the page to make it match
the English word if the English word goes up higher."

Still a study: nothing in the game changed. Round 2's B (Lora 600 Kutchi, Nunito Sans 600 grey English, one English size per row, the
30 px speaker with the card's whole foot as its tap area, bigger pictures on big screens) with the changes below, injected into the real
game (chai L1) by `build/tools/cards/typo-options.mjs` (`r3Css`, sets `r3w70` to `r3w100`); the sheets by `typo-sheet.py --round3`.

### What changed

1. **Each English under its own Kutchi.** The pair is centred between the picture and the divider (round 1's option 2: the row's spare
   split above and below it). The row pass now only shares one English size across the row; the Kutchi areas are no longer lined up.
2. **One gap g, three times:** the card's bottom edge to the speaker's bottom, the speaker's top to the divider, the divider to the
   bottom of the row's lowest English. The cards of a row are one height, and the divider sits g + speaker + g above the foot, so it is at
   one height across the row. The card with the tallest words has no spare, so its English sits exactly g above the divider; every other
   English sits higher, and the divider stays where it is. **g is 7% of the card's inner width** (one rule, so it grows with the card).
3. **The divider at 70, 80, 85, 90 and 100% of round 2's line** (100% = round 2's B: 88% of the card's inner width, its ends fading),
   centred, 1 px thick on the phones (1.4 at 1280, 1.7 at 1920).

### The gaps, measured (every card of every row, the cards scrolled out of view included)

| Screen | g (all three gaps) | Item card width | Divider 70 / 80 / 85 / 90 / 100% |
|---|---|---|---|
| 971x412 his phone, no banner | **4.41 px** | 75 px | 39 / 44 / 47 / 50 / 55 px |
| 971x318 his phone in the browser | **4.47 px** | 76 px | 39 / 45 / 48 / 51 / 56 px |
| 740x320 smallest phone | **4.47 px** | 76 px | 39 / 45 / 48 / 51 / 56 px |
| 1280x665 laptop | **6.83 px** | 115 px | 60 / 69 / 73 / 77 / 86 px |
| 1920x1080 | **8.39 px** | 141 px | 74 / 84 / 90 / 95 / 106 px |

In all 75 round-3 panels (5 widths x 3 rows x 5 sizes) and the 12 hidden-English panels, on every card, the three gaps agree within
**0.01 px** (the brief's limit: 0.5), and the divider is at one height across every row. (They are measured to the English's line box,
which keeps room for a "y"'s tail: to the letters' baseline the last gap looks about 2 px bigger on the phones.) The divider's width
never changes a card's height: the five widths fit identically.

### The space it costs

The cards grow by about 4 px against round 2's B on the phones (the third g; a two-line row at 971x318: option 2 149, B 152, round 3
156 px). The next card's headline:

| Screen | Option 2 | Round 2's B | Round 3 (any width) |
|---|---|---|---|
| 971x412, mixed / all two lines | +100 / +90 | +98 / +87 | +94 / +83 |
| 971x318, mixed / all two lines | +11 / +1 | +9 / -2 | +5 / **-6** |
| 740x320, mixed / all two lines | +13 / +3 | +11 / 0 | +7 / **-4** |

(+: px to spare with the next headline clear of the list's soft foot; -: the headline whole but that far into the fade. This order card
is whole and clear in every panel.)

### Flaws first

1. **The tightest case (all two-line words, one English wrapped, his phone in the browser) puts the next card's headline 6 px into the
   soft foot** (round 2's B: 2). It stays whole and readable, a little faded at its foot. It is the price of the third gap at 4.4 px; at
   g = 6% (3.8 px) it would be about 3 px (decision 2).
2. **A peek on a long English moves the row:** hidden, "tamarind chutney" is one line (its dots); shown, it wraps, so for its 3 s the
   whole row grows 11 px and the dividers and speakers step down with it (`typo3-hidden.webp`, last column). Today's game does the same
   (the cards grow); the pairing does not make it worse. Only "tamarind chutney" and "coconut chutney" wrap, and only on the phones.
3. **The 1 px line on the phones is faint** at arm's length (round 2's flaw 3). He chose it; at 85% its solid middle is as wide as the
   speaker on the phones (30 px), which is what makes it read as the speaker's own rule rather than a cut.
4. **The item card's border is set to 1 px** in the mock (the 1.5 px token is already drawn 1 px at dpr 2; fixed, the foot gap is exact
   at every dpr). No visible change.
5. A hidden English's invisible box (one line, no wrap) runs past its card for "tamarind chutney": the dots show and nothing is seen
   clipped; today's game does the same. The sheets note it rather than flag it.
6. **Pictures are stand-ins** for the chutneys and "hakro khun" (as before); only real Kutchi forms are used (paani, chai, dudh, khun,
   fudino ji chutney, amli ji chutney, nair ji chutney, hakro khun).
7. **Not shot:** the pop-up card (round 1's option 2, unchanged), 930x430, the dress games' item cards (the rules stay in the side panel).

Nothing clipped, ellipsised, overlapping or outside its card that can be seen in any width, case or size (105 panels, 12 hidden-English
panels); the English never touches the divider.

### Sheets (`build/reports/cards/`, 2x pixels)

- **`typo3-overview.webp`: start here.** His phone (971x412), two-line words beside one-line: the five widths side by side, and round 1's
  option 2 for reference.
- `typo3-closeups.webp`: the card whose English sits lowest ("fudino ji chutney"), from its Kutchi down, at each width, the three gaps
  drawn in red with their px.
- `typo3-85.webp`: 85%, the three rows (all one line, all two lines, mixed) by the five sizes.
- `typo3-panel-fit.webp`: the whole side panel at 971x412, 971x318 and 740x320, mixed and all two lines: option 2, round 2's B, round 3.
- `typo3-hidden.webp`: 85% with the English hidden (its dots) and peeking, at 971x412, 740x320 and 1280x665. The dots sit where the
  English sits, under their own Kutchi; a peek shows the English in the same place.

### My pick

**85%.** Its solid middle (the line fades over its outer fifths) is the speaker's width on the phones and at 1280 (30 of 47 px on his
phone, 47 of 73 against a 45 px circle at 1280; at 1920, 57 against 45), so the line and the circle read as one unit: a rule over the
button. 90 and 100% reach past the speaker and start to
underline the words instead, and 100% nearly meets the card's sides, the "cut here" look. 70 and 80% are tidy but shorter than the
circle under them, so the line looks like a dash rather than a rule. Keep g at 7% (4.4 px on the phone): smaller and the speaker looks
pressed against the card's foot, the thing he disliked first.

### Fable's round-3 pick

(pending)

### Decision for Zafar

1. The divider at **85%** (else 80 or 90). Recommend 85.
2. One gap g = 4.4 px on his phone (6.8 at 1280, 8.4 at 1920) for all three, which puts the next card's headline up to 6 px into the soft
   foot in the tightest case on his phone in the browser (whole and readable). Recommend yes (else 3.8 px and about 3 px into the fade).
3. A peek on "tamarind chutney" or "coconut chutney" on the phones grows the row for 3 s, as today. Recommend leave it (the other way,
   the row always as tall as the wrapped English, costs 11 px all the time in those rows).

### Implementation plan (updated; it replaces round 2's)

- **Files:**
  - `css/shared/word-card.css` and `css/shared/order-card.css` (the side panel's item card, `body.njg-s14 #side .oc-row.oc-it14`): the
    rows `auto 1fr auto auto 1fr auto auto` (picture, spare, Kutchi, English, spare, divider, speaker); the card's bottom padding 0 and
    its border 1 px; a token `--njg-card14-it-gap: 7cqi` (g) used only by the card's children (the card's own padding is in the row's
    units, not the card's); the divider as the card's `::before` (today `display: none`) in row 6: `width: 74.8cqi` (85% of 88),
    `height: max(1px, 1.4cqi)`, the rule colour fading at its ends, `margin-top: g`; the speaker `margin: g 0 calc(g - 1px)`; its
    `::after` tap area the card's whole width from half a g above the divider to the card's edge; the English dots' tap area reaching
    half a g down; the circle at 94% (30 px on the phones); the big-screen picture (`@media (min-height: 501px)`: the box 6:5, the image
    96%). The mock's CSS: `node build/tools/cards/typo-options.mjs --print-css r3w85` (drop the `!important`s and the mock's
    `.njg-r3-div` element for the `::before`).
  - `js/shared/word-card.js`: at the end of `W.fit14`, the row pass, now only (a): every visible card's English (and its dots) in a
    `.oc-row14` to the row's smallest fitted size. About 8 lines (`settle()` in `typo-options.mjs`). No Kutchi min-height.
  - Round 1's, unchanged: `css/shared/tokens.css` (the grey, `--njg-card14-en-font`), the Nunito Sans 600 font link or a self-hosted
    woff2, `build/sandbox/fonts/`, Lora (the morning's change).
- **Checks:** re-run `typo-options.mjs --only today,r3w85 --sizes 971x412,971x318,740x320,1280x665,1920x1080 --no-popup --hidden r3w85`
  against the built game ("today" must equal r3w85: card heights within 1 px, the three gaps within 0.5 px on every card, the divider
  at one height in every row, the tap area the card's foot, no overlap); a peek in a mixed row (the row settles back after it); the
  sandbox's text checks at the four sizes and 971x318; one dress game (`table`, `fitting`) at 740x320 unchanged;
  `node build/tools/review/checks.mjs`; the judge on the order card at the four sizes.
- **Size and risk:** about 35 lines of CSS, 8 of JS and one font file; mid-tier model, about two hours. Risk: low to medium (the item
  card and `fit14` are shared; the CSS stays scoped to the side panel; the row pass touches only `.oc-row14` rows).

### Proof (round 3)

`COOK_TEST_PORT=8858 flock /tmp/njg-browser-8858.lock node build/tools/cards/typo-options.mjs --out <dir> --only
o2,r2B,r3w100,r3w90,r3w85,r3w80,r3w70 --sizes 971x412,971x318,740x320,1280x665,1920x1080 --no-popup --hidden r3w85`, then
`python3 build/tools/cards/typo-sheet.py <dir> build/reports/cards --round3` (6 Nov night; the hidden and peek panels shot again at
971x412, 740x320 and 1280x665 after the peek was made to hide the dots as the game does). 105 panels and 12 hidden-English panels:
every card's three gaps within 0.01 px, the divider level across every row, nothing seen clipped or overlapping, this order card whole
and clear, the next card's headline whole in every panel.

`node build/tools/review/checks.mjs` (6 Nov night, on 726f06f): unit (644 pass), words, static, leak (20 configs), bump, specs, docs,
fixlist, recordings, art (306 pass, 77 flag, 0 fail), size and load (29/29): **all green**. No game file changed.
