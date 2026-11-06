# Batch brief-01: chai's 6 Nov card and type, built in the game (SH-222, SH-223, SH-224, SH-227; 6 Nov)

Verdict file: build/screenshots/card-build/judge/brief-01.verdicts.md

Every sheet is one size of chai L1 played by the sandbox's fair player (cook.html, test speed 3, touch on the phone sizes, 2x pixels). BEFORE (red label) is today's game: the new type held off (the page's `<html class="njg-lora">` taken away as it is set), so Fraunces 700 Kutchi, the near-black Nunito 700 English, the old item card. AFTER (green label) is the game as built. The two are separate plays of the same round, so a moment can differ by a beat (which word the pop-up shows, Nani's line): judge the type and the card, not the moment.

- `panel-<size>.png`: the side panel with Nani's box held shut and a copy of the order card under it (the next order's peek, as in play). Columns: chai's own order as dealt (paani, chai, dudh, hakro khun), then three written-in rows of Mum's recorded forms (all one line: paani, chai, dudh, khun; all two lines: fudino ji chutney, amli ji chutney, hakro khun, nair ji chutney; mixed: fudino ji chutney, chai, hakro khun, paani). The chutneys' and "hakro khun"'s pictures are stand-ins (one of the game's own where it has none). BEFORE row, AFTER row, then AFTER with the English hidden (its dots) and with one English peeking (the first card in the mixed row, "tamarind chutney" in the two-line row).
- `screens-<size>.png`: BEFORE left, AFTER right: the pop-up card (the word on it at that moment; then the same card with "fudino ji chutney / mint chutney" written in), Nani's box, Nana's bubble, the shelf's band with its drawn pills, the word moment's cards (its lab page at the end, `lab/word-moment.html?at=end`, with the type turned on as chai does).

Sizes: 740x320 (smallest phone), 971x318 (his phone in the browser), 971x412 (his phone without the banner), 930x430 (largest phone), 1280x665, 1920x1080.

## What Zafar chose (6 Nov), to check AFTER against
1. Lora for every Kutchi word: 600 on a card's word, the order's headline, the shelf pills, Nana's bubble; 500 for Nani's line in her sage box. No Fraunces anywhere in AFTER. The buttons and labels stay Nunito.
2. The English under a Kutchi word: Nunito Sans 600, a warm grey, clearly second to the maroon Kutchi; 12 px on the phones (a long one may shrink to 10 on one line; "tamarind chutney" and "coconut chutney" wrap on the phones, as today); one English size across a row of item cards.
3. Each English directly under its own Kutchi (no lining up across the row); the pair centred between the picture and the divider.
4. The divider: a thin line in the card's rule colour, fading at its ends, about 85% of the earlier line's width, at one height across a row.
5. Three equal gaps g (7% of the card's inner width, about 4.4 px on the phones): the card's bottom edge to the speaker's bottom, the speaker's top to the divider, the divider to the lowest ink of the English above it. The last gap is measured to the letters over the divider's span: a "y", "g" or comma tail where one sits over the line, else the baseline (Zafar: under "day" the y's tail; under "mint chutney" the y sits past the line, so the other letters' feet). Only the row's lowest English sits g above the divider; every other card's words sit higher, centred.
6. The speaker 30 px on the phones (a whole 48 px tap at 1280 and 1920, as before), not overlapping the English.
7. At 1280 and 1920 the item cards' pictures about 21% taller than BEFORE; on the phones unchanged.
8. The next order's headline may sit up to about 6 px into the list's soft fade in the tightest case (all two lines, 971x318 and 740x320): whole and readable.

Measured by the build (card-build-chai-2026-11-06.md has the tables): see "Gaps" there; the last gap read off these very pixels agrees with the game's own measure within one device pixel.

## Check
Flaws first, anywhere on the sheets: clipped or ellipsised text, a word outside its card, the English touching the divider, a gap that looks unequal to the eye (say which card and size), the divider at different heights in one row, a Fraunces or Baloo letterform left in AFTER (the "a", "g" and "k" differ), weights that look wrong (the pills heavier than the card's word, Nani's line too thin on the phones), a grey English too faint, anything BEFORE had that AFTER lost (the badge, the speaker's ring, the pictures' blur when hidden). Then a pass/fail per sheet against the eight points above.

Sheets: build/screenshots/card-build/panel-740x320.png, build/screenshots/card-build/panel-971x318.png, build/screenshots/card-build/panel-971x412.png, build/screenshots/card-build/panel-930x430.png, build/screenshots/card-build/panel-1280x665.png, build/screenshots/card-build/panel-1920x1080.png, build/screenshots/card-build/screens-740x320.png, build/screenshots/card-build/screens-971x318.png, build/screenshots/card-build/screens-971x412.png, build/screenshots/card-build/screens-930x430.png, build/screenshots/card-build/screens-1280x665.png, build/screenshots/card-build/screens-1920x1080.png
