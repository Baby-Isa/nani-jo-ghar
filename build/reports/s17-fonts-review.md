# Fonts review (Sprint 17, 6 Nov): what the game uses, Zafar's two sheets, a recommendation

Reviewer: Fable (type and UI), independent of the builders. Nothing edited but this file.

## Flaws first

1. **The italic is a fake.** Every page's Google Fonts link asks for Fraunces upright only (`opsz,wght@9..144,600;9..144,700`, no `ital` axis; I fetched the link: six faces, all `font-style: normal`). So Nani's grey "to record" line ("Put water in the pan.") and the word-tile label are the browser slanting the upright face. It reads, but it is not the italic Zafar is judging on his sheet, and the slant squeezes the letter spacing. One-line fix: add `ital` to the link (`Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600;1,9..144,700`) in cook.html, lab.html, index.html, lab/word-moment.html and the two run-time links (`js/cook/ui.js:205`, `js/clinic/heal/host.js:541`).
2. **One word, two faces.** A Kutchi word is Fraunces on the card ("dudh") and Nunito on the shelf pill and the play-area bubbles ("hakro", "ba"; `--njg-font-word` and `.oc-strip-t` are Nunito, SH-219 pills likewise). For a child who is just starting to recognise word shapes, the same word should look the same everywhere it is a word to learn. Not urgent, but decide it before the pre-store pass: either the serif in the bubbles and pills too, or Nunito stays the "spoken, in the scene" face by rule.
3. **Baloo 2 is still downloaded on every page** (three weights) but, on the s14 look, nothing on screen uses it: `--njg-font-display` is only reached by modes that have not rolled over. About 60 KB of font a chai player never sees. Drop it from the chai pages now, from the rest at the roll-out.
4. **Offline risk for the store build.** Fonts come from Google's servers at run time. In a wrapped app with no network the whole game falls to Georgia and system sans, and the fit checks were never run on those. Self-host the four files (latin only) before the stores; the s14-chai report already saw the fallback serif once in the sandbox.

Nothing else is wrong with the type as it stands. The sizes, the maroon and the weights are sound (below).

## 1. What the game uses now, and is it right

| Role | Face | Where set |
|---|---|---|
| Kutchi on cards, card titles, order line, Nani's line | Fraunces 700, optical size automatic (9 to 144) | `--njg-card14-font`, tokens.css:111; word-card.css:115, order-card.css:550/589 |
| English under a word, labels, buttons, shelf pills, bubbles, drawn (Phaser) words | Nunito 700/800 | `--njg-font-body`, `--njg-font-word`, tokens.css:99-100 |
| To-record lines | the same faces, italic, `--njg-ink-soft` | guide.css:52, order-card.css:83/556, word-tiles.css:30 |
| Other modes' display text (not yet rolled over) | Baloo 2 800 | `--njg-font-display`, tokens.css:98 |

Inks: Kutchi `#7d2234` (card) / `#8c2f2f` (play area); other words `#2a2522`; grey `#7a6857`.

**For 3-7-year-olds.** The things that decide legibility for an early reader are, in order: size, weight, x-height, letter spacing, letter distinctness. On those the game is in a good place.

- **Size and weight.** Smallest Kutchi: 13 px (word tiles, `--njg-card14-u13`) and 14.5 px (order rows, phone); Nani's line 16 px on phones, 19 px on laptops; shelf pills 13 px Nunito 800 (SH-219). Fraunces 700 at 13 px holds because its optical-size axis drops to the 9-point design at small sizes: the hairlines thicken and the x-height rises. That is the one property that makes a serif workable on a phone, and only one other face on Zafar's sheet has it (Bodoni Moda, which is otherwise wrong, below). Nunito 800 at 13 px is a sturdy pill.
- **x-height.** Fraunces at small opsz is roughly 0.5 em, Nunito about 0.5 em: both on the high side for their kind, which is what small screens want.
- **a and g.** Fraunces: double-storey a and g. Nunito: double-storey a, single-storey g. Reception teachers prefer the single-storey "a" and "g" because they match what the child writes, and the infant faces (Sassoon, Andika) are built on that. But every picture book the child owns sets a double-storey a, and the research effect is small next to size and spacing. It is a nice-to-have, not a defect. If Zafar wants it, Fredoka (sheet) or Andika (not on the sheet) gives both forms single-storey; no serif on his sheet does, and Fraunces has no alternate.
- **l / I / 1.** Fraunces distinguishes all three (serifs on the I, a flag on the 1). Nunito's l and I are the same bare stroke; it only matters in English labels ("Ill", "I'll"), never in a Kutchi word, and the Kutchi carries no capital I on its own. Acceptable.
- **The maroon on cream.** `#7d2234` on the card white is 9.6:1, on the page parchment 8.3:1, `#8c2f2f` on the shelf wash 7.0:1: well past AAA for every size used. Charcoal on card 14.9:1. The grey to-record line on the sage helper is 4.4:1, under the 4.5 for small text but at 16 px bold and for grown-ups only it passes as large text. Fine, and do not make the grey lighter.
- **For a transliterated language.** No diacritics, so neither face needs them (good: both have full Latin anyway). The words are short, consonant-heavy and full of ascenders and descenders ("khape", "hakro", "dudh", "wiji"), which is where Fraunces earns its keep: the old-style shapes make "kh", "dh", "wa" clusters distinct, and the 1.04 line-height on cards is only safe because the words are one or two syllables. The long words that bite are English ("cardamom") and those are Nunito 13 px under the Kutchi, which wraps.
- **For the grown-ups.** The serif plus rounded sans reads as "a book at Nani's", not a learning app; that is the right register and the palette review of 6 Nov leaned on it. Nunito for the pop-up and the end review is right.

Verdict: the current pairing is right for the audience; the flaws are in how it is loaded, not what it is.

## 2. The twelve on the sheets, one line each

Serifs (Zafar's sheet 1):

- **Playfair Display: no.** A high-contrast display face with hairlines that break up at 13-19 px on a phone, no optical-size axis, cold Didone feel; the maroon word becomes a maroon and pink word.
- **Cormorant Garamond: no.** Tiny x-height and the lightest hairlines on the sheet; needs 24 px and a lot of air before it reads, and the bold is still thin. A wedding invitation, not a word card.
- **Bodoni Moda: no.** Does have optical sizes (6 to 96), so it holds up better than Playfair, but it is formal and vertical, and its ball terminals and hairline serifs fight the rounded sans and the soft art.
- **Fraunces: yes (current).** The only soft old-style on the sheet, optical sizing, a true italic, warm; its one weakness is the double-storey a and g.
- **Lora: workable, second choice.** A screen text serif with a true italic and moderate contrast; sturdy at 14 px, but blander and narrower in the x-height than Fraunces, no optical sizing, and it would look like a news app's body type rather than a book.
- **EB Garamond: no.** Small x-height, light, built for print at 10-12 pt on paper; at 13-16 px on a phone the maroon words go grey and spidery.

Rounded sans (sheet 2):

- **Quicksand: no.** Too light: even its 700 is thinner than Nunito 600, round "o"-like letters with a small x-height, and l and I identical; good for a spa, not a 13 px pill.
- **Comfortaa: no.** Thinner still, with odd single-storey shapes (its e, k and s) that are display quirks, not reading letters; its bold is still a thin line.
- **Nunito: yes (current).** The heaviest, widest and tallest-x-height of the six, 800 available, soft without looking like a toy; the weak spots (l/I, double-storey a) are minor here.
- **Varela Round: no.** One weight only (400): no bold for a pill, a button or a Kutchi label, and the game runs on 700 and 800.
- **Poppins: no, with respect.** Geometric and wide, so pills grow; its double-storey a is fine, but the real problems are the identical l and I, the cold corporate feel, and that it looks like every other app.
- **Fredoka: the one worth a lab look.** Chunky, rounded, single-storey a and g, tall x-height, a variable 300-700 range; it reads very well at 13 px and children's apps use it for exactly that; against it, it is wider than Nunito (every pill and label reflows) and it looks like a toy next to the serif, so it would be for pills and bubbles only, never the cards.

## 3. Recommendation

**Pairing: keep what is there.** Fraunces 700 (opsz automatic) for every Kutchi word and headline on cards and in Nani's box; Nunito 700/800 for English, labels, pills and buttons; Fraunces *true* italic 700 for the to-record lines and the word-tile labels, Nunito italic (already loaded? no: load it too, `js/day/book.js:675` asks for it) where a to-record word sits inside a Nunito line. Of the twelve, none beats this pairing for a phone at 13-19 px; Lora is the only serif that would not be a step down and Fredoka the only sans worth trying, and only for the scene's pills and bubbles.

**Do now (fast lane, this sprint):** flaw 1 (the italic axis, six links, no layout change: the italic is narrower than the slanted upright, so nothing grows). Flaw 3 on the chai pages while there.

**Do at the pre-store polish pass:** flaw 2 (one face for a word everywhere; my lean is Fraunces in the bubbles and shelf pills, so the serif owns "a word to learn" and Nunito owns "the grown-ups and the furniture"); flaw 4 (self-host, latin subset, `font-display: swap`); and if Zafar wants single-storey letters for the youngest children, one lab page with Fredoka pills beside Nunito pills at 740x320 and 1920x1080 before any decision. Not before, because every face change is a layout change.

**Risk and cost of any face change.**
- *Reflow:* a different face has different advance widths; every shrink-to-fit (`js/shared/fit.js`, re-measured on `document.fonts.ready`) and every no-clip check must rerun at the four sizes (740x320, 930x430, 1280x665, 1920x1080), and the Phaser-drawn words (`Tokens.font`) must be drawn after the font loads or they land in the fallback. Half a day of checks for a one-line token change; the s14 roll-out budget for the other modes already carries this.
- *Weight:* today's latin payload is Fraunces two instances (about 150 KB) plus Nunito three weights (about 60 KB) plus the unused Baloo 2 (about 60 KB). Adding the Fraunces italic is about 150 KB more (the variable italic is a separate file); adding Fredoka would be about 30 KB; dropping Baloo 2 gives 60 KB back. All well under the first-paint budget of a page whose jars are 100 KB each, but self-host before the stores.
- *Reading harm:* none from any of the above; the harm would come from choosing a thin or high-contrast face (eight of the twelve) and finding it out on Zafar's phone at 13 px.

Decisions for Zafar (yes to all except ...):
1. Load the true Fraunces italic now (flaw 1).
2. Drop Baloo 2 from the chai pages now (flaw 3).
3. Keep Fraunces + Nunito; no face change this sprint.
4. At the pre-store pass: one face per Kutchi word everywhere (my lean: the serif), self-hosted fonts.
5. Only if he wants single-storey a/g: a lab page with Fredoka pills, no game change until he has looked.

## Proof

- CLAUDE.md read (non-negotiables 3, 6, 7 bear on type: no clipped text, headline shrink-then-wrap, nothing that makes a child feel bad).
- `css/shared/tokens.css` lines 93-132 (the type roles, inks, card14 sizes) and 324-355 (t1-t4, side-h on phone and laptop); `css/cook.css` 23-24 and every `font-family` use; `css/shared/order-card.css` 550-605, `guide.css` 46-56, `word-card.css` 115, `word-tiles.css` 17-30, `app.css` 83; `js/shared/fit.js:157`, `order-card.js:653`, `js/day/book.js:675`, `js/cook/ui.js:201-205`, `js/clinic/heal/host.js:538-541`.
- The Google Fonts links in cook.html, lab.html, index.html, who/day/dress/snap/tidy.html, lab/word-moment.html and lab/cards.html; the Fraunces link fetched live: 6 faces, 600 and 700, `font-style: normal` only, no italic.
- Screens: `docs/feedback/images-2026-11-05-eve/laptop-1.webp` and `193856d6-image.jpg` (Zafar's phone, 2640x1080), `docs/feedback/images-2026-11-05-am/1.webp`; the sidebar and the shelf pills enlarged 3x to look at the letterforms and the slanted italic.
- Contrast ratios computed (WCAG): maroon on card 9.6, on page 8.3, play-area maroon on shelf wash 7.0, grey on sage 4.4, charcoal on card 14.9, card label 5.0.
- `docs/design-language/ui-design-system.md` section 2 (still says "Nunito throughout": out of date since S14; the card14 note in tokens.css is the truth) and `docs/archive/sprints/S14-lock-the-principles.md` line 32 (Fraunces kept for every display text).
- Not done: no live render of the twelve faces at 13 px on a phone (no browser in this session); the judgements on them are from their published designs and weights, and the Fredoka point is why I ask for a lab page rather than assert it.
