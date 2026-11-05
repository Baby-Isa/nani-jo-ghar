# S17: the stable palette, an independent colour review (5 Nov)

Zafar, 5 Nov: "what about the order card and hint card colours? ... the hint card I'm not sure about the green or the specific green ... I almost feel we should be using A Dictionary of Color Combinations by Sanzo Wada ... even with subtle tone changes."

Scope: the stable elements on the Cook screen: Nani's box (`--njg-helper-bg`, its accent `--njg-sage`), the order card (`--njg-card`), the item card and its picture tile (`--njg-card14-card`, `--njg-card14-pic-bg`), against the fixed stone, marble, maroon, gold, hob and honey tray. Every colour below was measured (sRGB, CIE Lab, WCAG) on the real screen, not eyeballed; every mock-up is the real game with the tokens overridden, pixel-true. No game file was changed.

Sources: Sanzo Wada's *A Dictionary of Color Combinations* as its 159 named colours and 348 combinations, fetched from the open transcription (mattdesl's `colors.json` on GitHub; the dmbk.io index is a JavaScript app with no fetchable data, so the same data behind it), checked against my own knowledge of the book; Munsell value steps; Itten's seven contrasts; Albers' simultaneous contrast; Material 3's tonal surface layering and the HIG's grouped backgrounds; children's-app practice (one meaning per colour, a findable "the grown-up is talking" surface).

## Verdict, flaws first

1. **The green is right, and the book agrees.** Our sage `#7f9b7c` is dE 5 from Wada's *Chromium Green* `#719470`, and our Kutchi maroon `#8c2f2f` is dE 4 from his *Pale Burnt Lake* `#802626`. Those two are a Wada pairing: **combination 283** (Ochre Red, Pale Burnt Lake, Chromium Green, Venice Green), and Chromium Green sits with *Carmine Red* again in **combination 200** (Carmine Red, Olive Buff, Chromium Green). The sage-and-maroon pair we have been using by instinct is in the dictionary twice. Green also does the three jobs it is there for: it is the one hue the kitchen does not already own (stone 27, marble 30, cards 40, honey 29, gold 40, maroon 348: the green at 102-114 stands alone, so a child finds "Nani is talking" without reading); it is near-complementary to the maroon (Itten), which keeps the Kutchi word lively on it at low chroma; and herbs, mint and coriander are the right kitchen association.
2. **The one real flaw is small: the fill `#e6efe2` is a shade too minty for its ground.** Albers: a colour takes on the complement of what surrounds it. The stone is a pinkish warm grey (Lab a +2, b +5), so it pushes anything on it towards green-blue; the fill, mixed to pure white (hue 102, b +5), is then read as mintier and cooler than the sage it was mixed from. On his laptop screenshot the box is the one cool patch on a warm panel. The fix is one number: warm the tint ten degrees (`#e4ecdd`, hue 92, b +6, a -5), the same lightness (L* 92.4 against 93.5), the same contrast for the words. That is candidate A1 below. It is subtle, as he expected; it is also the only change this review is confident improves the screen.
3. **The order card should stay white.** Value structure, measured: stone L* 86, Nani's box 93, marble 93.5, item cards 99, order card 100, honey tray 56, maroon 29, ink 15. That is a clean, even scale with the order card at the top: the brightest thing on the panel is the thing the child reads, which is how paper sits on a stone worktop and what the HIG's grouped backgrounds do (grouped content on a darker ground, the cards white). Making it darker (B3, `#f7f2ea`) pulls it into the stone and the item tiles stop lifting; making it a warm paper with white tiles (B2, Material's tonal layering, the tiles brighter than the card) is defensible and is the only "darker" direction worth his look, but it costs the card its crispness and the panel goes creamier as a whole. Lighter is impossible: it is `#ffffff`.
4. **The item card and its picture tile are right.** The tile's cream radial (`#fffaf1` to `#f1e4cd`, hue 38-40) is in the stone's hue family (27-40) and reads as a plate under the thing; the item card at `#fffdf8` on the white order card is a 1.02:1 step, so it is the shadow that draws it, which is the approved s14 look (lab/cards.html). Cream tiles on white (B4) read as beige insets and the picture tile loses its own shape against them. Leave both.
5. **Readability is not an issue anywhere.** Body ink `#2a2522` is 12.4-15.1:1 on every surface; the maroon `#7d2234` 8.0-9.8:1 on the cards and the box, 6.8:1 on the stone; the soft ink `#7a6857` 4.5:1 on the box and 5.3 on white (AA for text); white on the maroon speaker 9.8:1. The label `#6e5f50` on its chip 5.0:1. All AA or AAA. One note outside scope: the gold `#c9962e` is 2.7:1 on white as a 1 px done ring, under WCAG's 3:1 for non-text; it is an anchor and he did not ask, so it stays, but `#b98a2a` would meet it if a ring ever needs to carry meaning alone.
6. **No discord in the fixed set.** Maroon (*Pale Burnt Lake*), gold (*Khaki* / *Yellow Ocher*, dE 6-8), the honey tray (*Cinnamon Rufous*, dE 8) and the red hijab (*Carmine* family) are all of one Wada family: **combination 249** (Hay's Russet, Ecru, Olive Ocher, Dark Medici Blue) is maroon, a stone-like ecru and an ochre gold with a slate-blue fourth; **combination 311** (Pompeian Red, Cream Yellow, Dark Greenish Glaucous, Light Green Yellow) is maroon, the honey tray and a grey-green. The stone and marble are lighter than anything in the book (it has no tints above *Sulpher Yellow* L* 93 except white), so they are read as tints of *Ecru* / *Ivory Buff*; the book's combinations are hue and chroma guidance here, the values ours.

## 1. The palette as it stands

| element | hex (on screen) | hue / sat / L (HSL) | L* a b | nearest Wada name (dE) |
|---|---|---|---|---|
| Nani's box fill | `#e6efe2` | 102 / .29 / .91 | 93.5 -5 +5 | (a tint; the sage's family) |
| the sage accent | `#7f9b7c` | 114 / .13 / .55 | 61 -16 +13 | Chromium Green `#719470` (5) |
| order card | `#ffffff` | neutral | 100 0 0 | White |
| item card | `#fffdf8` | 43 / 1 / .99 | 99.3 | White (3) |
| picture tile, edge | `#f1e4cd` | 38 / .56 / .87 | 91 +1 +13 | Sulpher Yellow `#f5ecc2` (10) |
| stone (panel, band) | `#dfd5cd` | 27 / .22 / .84 | 86 +2 +5 | (a tint of Ecru / Ivory Buff) |
| marble, washed | `#efece9` | 30 / .16 / .93 | 93.5 0 +2 | White (7) |
| Kutchi maroon | `#7d2234` / `#8c2f2f` | 348-0 / .5-.57 / .31-.37 | 29-34 +40 | Pale Burnt Lake `#802626` (4-11), Pansy Purple (9) |
| gold, done | `#c9962e` | 40 / .63 / .48 | 65 +10 +59 | Khaki `#bc892b` (6) |
| gold, focus | `#e0a63a` | 39 / .73 / .55 | 72 +11 +61 | Yellow Ocher `#e2b540` (8) |
| honey tray | ~`#b5793f` | 29 / .48 / .48 | 56 +18 +41 | Cinnamon Rufous `#c27544` (8) |
| body ink | `#2a2522` | 23 / .11 / .15 | 15 | Black (10) |

Harmony: one warm undertone (hue 27-43) across stone, marble, cards, tile, honey and gold, at five even value steps; two accents against it, the maroon (warm, deep) and the green (the only cool-ish hue, light). Saturation is low everywhere except the two accents and the gold, so the food and the faces are the most saturated things on screen, which is right. The green's only fault is in the undertone of its tint (point 2 above).

Contrast (WCAG), text on each surface:

| ink | box `#e6efe2` | card `#fff` | item `#fffdf8` | tile mid | stone | marble |
|---|---|---|---|---|---|---|
| ink `#2a2522` | 12.8 | 15.1 | 14.9 | 13.5 | 10.5 | 12.9 |
| maroon `#7d2234` | 8.3 | 9.8 | 9.6 | 8.7 | 6.8 | 8.3 |
| maroon `#8c2f2f` | 6.9 | 8.2 | 8.1 | 7.3 | 5.7 | 7.0 |
| soft ink `#7a6857` | 4.5 | 5.3 | 5.2 | 4.8 | 3.7 | 4.5 |
| label `#6e5f50` | 5.2 | 6.1 | 6.0 | 5.5 | 4.3 | 5.2 |
| gold `#c9962e` (rings, not text) | 2.3 | 2.7 | 2.6 | 2.4 | 1.8 | 2.3 |

Surface against surface: stone to order card 1.44:1, stone to box 1.23, box to card 1.18, item card to order card 1.02 (the shadow does that step).

## 2. The candidates

Each keeps the stone, marble, maroon, gold, hob and tray. The box candidates (A) keep the order card as it is; the card candidates (B) carry A1's box so one thing changes at a time. Lightness is held at L* 92-93 in every box candidate, so only hue and chroma are on trial. Mock-ups in `build/screenshots/palette/` (full screen at 1280x665 and 971x318, and four contact sheets).

| id | Wada combination and names | box fill | accent sage | card / item card | what it does |
|---|---|---|---|---|---|
| 0-now | (283 by accident) | `#e6efe2` | `#7f9b7c` | `#ffffff` / `#fffdf8` | the shipped palette |
| **A1 settled sage** | **283**: Pale Burnt Lake, Chromium Green (+ Ochre Red, Venice Green) | `#e4ecdd` | `#7f9b7c` (keep) | keep | the same green, its tint warmed ten degrees so the pink-grey stone no longer pushes it to mint |
| A2 greige sage | **311**: Pompeian Red, Cream Yellow, Dark Greenish Glaucous | `#e7ebdf` | `#889a80` | keep | a grey-green that shares the stone's undertone |
| A3 glaucous | **171**: Pale Burnt Lake, Yellow Orange, Glaucous Green | `#e2ede8` | `#7f9d92` | keep | a cool blue-green, the strongest separation |
| A4 olive buff | **200**: Carmine Red, Olive Buff, Chromium Green | `#ebecd6` | `#8c9a6d` | keep | a straw green, closest to the parchment page |
| A5 mineral grey | **11**: Ivory Buff, Mineral Gray (and 30: Pompeian Red, Mineral Gray) | `#e7ebe7` | `#869590` | keep | the no-green control: a grey-green so faint it is a paler stone |
| B2 paper card, white tiles | (Material tonal layering) | A1 | keep | `#fcf8f2` / `#ffffff` | the card a warm paper, the tiles lift as white |
| B3 deeper paper | | A1 | keep | `#f7f2ea` / `#fffdf8` | the "darker" he wondered about |
| B4 white card, cream tiles | | A1 | keep | `#ffffff` / `#fbf6ee` | the tiles as cream insets |

## 3. Ranked, flaws first (on the pictures)

**Nani's box**

1. **A1 settled sage, `#e4ecdd`: best.** Flaw: it is a small change, and on a phone at arm's length most people will not name it. What it fixes: beside the stone the box now reads as the sage it is mixed from, not mint; the red hijab and the maroon word sit on it the way they sit on the item cards; the white arrow button keeps its lift (1.21:1). Words 12.5:1, maroon 8.1:1. Wada 283.
2. **0-now, `#e6efe2`: acceptable.** The one cool patch on a warm panel; the mint is more a "fresh" than a "sage" and leans towards the glaucous (A3) side the more pink the screen's stone is. Nothing a child or parent would call wrong.
3. **A2 greige, `#e7ebdf`: belongs with the stone, but dull.** The simultaneous contrast that mints the current fill turns this one to putty: on the panel it reads as a greyer stone with a green doubt in it, and the box loses the "Nani is talking" identity a child needs to find without reading. Right instinct (Wada 311), half a step too far.
4. **A5 mineral grey, `#e7ebe7`: the control, and it proves the green.** The box is now a paler stone; the arrow button and the face are the only things that say it is a box. Rejected.
5. **A4 olive buff, `#ebecd6`: wrong meaning.** Straw-yellow beside the gold "tap here" light and the done rings: a child could read the box as lit. It also sours against the red hijab. Rejected, though Wada 200 is a fine combination for a flat print.
6. **A3 glaucous, `#e2ede8`: worst on this screen.** A blue-green on a pink-grey stone is the clinic, not the kitchen; the only candidate that fights the worktop study's warm marble. Rejected.

**The order card**

1. **0-now, white `#ffffff` with `#fffdf8` item cards: best.** The brightest surface is the one the child reads; the stone-to-card step (1.44:1) is the panel's clearest edge and it belongs to the order. Flaw: on a bright laptop the pure white is the one surface with no warmth at all; the marble study moved the worktop off neutral for that reason. If that ever shows, the answer is `#fffdf8` (the item card's own warm white, L* 99.3), not a cream.
2. **B2 paper card `#fcf8f2` with white tiles: the only "darker" worth his look.** Flaw: the card goes soft against the stone (1.39:1), the panel creamier as a whole, and the faces' white rings and Nani's white arrow now sit on a cream. What it gains: the tiles lift as the brightest things, Material's way. Take it only if he prefers the softer panel on his own laptop.
3. **B4 white card, cream tiles `#fbf6ee`:** the tiles read as beige insets and the picture tile's cream plate loses its shape against them. Rejected.
4. **B3 deeper paper `#f7f2ea`:** the card sinks into the stone (1.31:1), the tiles stop lifting, the panel is mud. Rejected; this is the "darker" to avoid.

## 4. Recommendation

1. **Set `--njg-helper-bg: #e4ecdd`** (css/shared/tokens.css line 107). One token; Nani's box and her helper card in every mode. Fast lane, checks, the judge at the sprint's end.
2. **Keep `--njg-sage: #7f9b7c`.** It is Wada's Chromium Green and pairs with our maroon in his book (283, 200). The other modes' guide box mixes its band and edge from it and is right as it is.
3. **Do not change:** `--njg-card #ffffff`, `--njg-card14-card #fffdf8`, `--njg-card14-bg`, `--njg-card14-pic-bg`, the maroons, the golds, `--njg-stone`, `--njg-worktop-wash`. If he wants the card warmer after seeing B2, the move is `--njg-card: #fcf8f2` with `--njg-card14-card: #ffffff`, together, never the card alone and never deeper than `#fcf8f2`.
4. One line for the token's comment: "Nani's box (Zafar, 5 Nov; s17-palette-review: a tint of the sage warmed to the stone's undertone; Wada 283, Chromium Green with Pale Burnt Lake)".

## Summary (10 lines)

1. The green is right: our sage `#7f9b7c` is Wada's Chromium Green (dE 5) and our maroon is his Pale Burnt Lake (dE 4); the pair is Wada combination 283, and 200 again. Keep the hue.
2. The one flaw is the fill's tint: mixed to pure white it reads mint on the pink-grey stone (Albers). Warm it ten degrees at the same lightness.
3. Set `--njg-helper-bg: #e4ecdd` (was `#e6efe2`). Keep `--njg-sage: #7f9b7c`.
4. The order card stays `#ffffff`, the item card `#fffdf8`, the picture tile as it is: the brightest surface is the one the child reads, and the value scale (stone 86, box 93, marble 93.5, tiles 99, card 100) is even.
5. If he wants the card darker after seeing B2: `--njg-card: #fcf8f2` with `--njg-card14-card: #ffffff`, together; never `#f7f2ea`.
6. Rejected: greige (dull, loses the box), glaucous (the clinic), olive buff (reads as the gold light), mineral grey (proves the green is needed), cream tiles, deeper paper.
7. Readability: every ink AA or AAA on every surface (ink 12-15:1, maroon 8-10:1 on cards and box). Note only: the gold ring is 2.7:1 on white, under 3:1 for non-text; an anchor, left alone.
8. The fixed set is one Wada family: maroon, ochre gold, cinnamon honey, ecru stone (combinations 249 and 311). No discord to fix.
9. Source: the book's 159 colours and 348 combinations from the open transcription on GitHub (the dmbk.io index is a JS app; same data), plus Munsell, Itten, Albers, Material 3, the HIG.
10. Mock-ups are the real game, tokens overridden, at 1280x665 and 971x318: `build/screenshots/palette/`.

## Proof

- `build/screenshots/palette/0-now-1280x665.png`, `0-now-971x318.png`: the shipped palette, chai L2 at play.
- `A1-settled-sage-*`, `A2-greige-sage-*`, `A3-glaucous-*`, `A4-olive-buff-*`, `A5-mineral-grey-*`: the box candidates, both sizes.
- `B2-paper-card-white-tiles-*`, `B3-deeper-paper-card-*`, `B4-white-card-cream-tiles-*`: the order-card candidates, both sizes.
- `sheet-panel-1280.png`: the side panel of every candidate side by side, 1:1; `sheet-zoom-1280.png`: the same at 2x, Nani's box and the first card; `sheet-panel-phone.png`: the phone's side panel, 1:1; `sheet-laptop.png`, `sheet-phone.png`: every full screen.
- Each mock's token values were read back from its pixels (box, card, tile) and match the table above.
- His laptop screenshot: `docs/feedback/images-2026-11-05-eve/laptop-1.webp`.
- Not done: the helper card open inside the box (the arrow did not open it from a script at play start); it shares the item card's gradient and inherits the fill change, so the closed shots cover it.
