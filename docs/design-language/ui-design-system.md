# Cook design system v1, and the chai station v2 (28 Sept 2026)

> **Stale points (what `docs/process/rules.md` now overrides).** Text below is left as written; the Cook station specs (§1, 5, 9–11, 13–15) now live in `docs/game-design/modes/cook.md`.
> - "One line per pill (shrink to fit, down to 14 px)" → headlines shrink, then wrap; never clipped or ellipsised (F7, non-negotiable 9)
> - Stars or star badges on result cards → three badges: time, accuracy, hints (H5, decisions 1–2)
> - *marcha* and "Marcha na." in Nani's chop card → *mirchi* only, no plural, for now (G5, decision 5)
> - An English headline placeholder ("Chop these") for the child → no written English for the child (E1, F23); missing Kutchi is a grey-italic placeholder flagged "to record"
> - "Front-on inventory bowls" (§4) vs top-down prep bowls in Sekelo and samosa → camera chosen per station (H14)
> - Hands in Cook → none (H13)
> - Sidebar on the right in older sketches → left, about 22% (F4); no letterbox or cream strip (F18)
> - Digits or dots for quantities → none for the child (E12, F25)

The single source of truth for how Cook looks and behaves. It merges Zafar's feedback (and his wife's), two external reviews (`external-review-*.md` in this folder), and Claude's own review. Where it disagrees with an older doc, this wins. **Status: §8 answered by Zafar (28 Sept): one pan per person YES; masala dabba NO; tap object = use, tap chip = hear YES. Mock-up (§9) next.**

*§1 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

## 2. Tokens (every screen uses only these)
- **Colours:**
  - page `#F4ECDF` (parchment);
  - panel `#EFE5D6`;
  - card `#FFFFFF`;
  - text `#2A2522` (charcoal: body text is never rust);
  - Kutchi keyword `#8C2F2F` (muted maroon, only on the Kutchi word);
  - gold `#C9962E` (flat: outlines and icons);
  - grey `#D9D2C7`;
  - sage (Nani) `#DDE6D5`, with the band `#7E9A76`;
  - wrong `#C0443C` (the end review only).
- **Type:** Nunito throughout.
  - L1 lesson line: 22 px / 800.
  - L2 Kutchi target: 20 px / 800.
  - L3 labels and pills: 17 px / 700.
  - L4 support: 14 px / 600.
  - One line per pill or label (shrink to fit, down to a 14 px minimum). Nani may use 2 lines.
- **Spacing (8-pt):** 4 · 8 · 12 · 16 · 24 · 32 · 40.
  - Outer margin: 32.
  - Between regions: 24–32.
  - Inside cards: 16.
  - Between related controls: 12.
  - Label to icon: 8.
- **Radii:** 12 for cards and pills, full circle for round buttons. Nothing else.
- **Shadow:** one soft shadow, `0 2px 8px rgba(40,25,10,.10)`. The UI is flat: no gradients, bevels or 3D text.
- **Tap targets:** at least 48 px, even when the icon is 24 px. The whole inventory slot is tappable.

## 3. The screen grid
- **The left panel, about 22%.** One continuous surface. There are no cards inside cards.
  - **Nani** (sage box) at the top: a larger portrait (waist-up art where it exists), her line (up to 2 lines), the bulb and mute. Her face = replay.
  - **One white card per person:** face (= replay) + short headline (*Muke chai khape.*) + that person's pills directly on the card. Several of the same thing (skewers, cups) = light grey subgroups, never boxes inside boxes.
  - **A nav dock at the bottom:** three identical circular buttons (? · ⌂ · book), 48 px, quiet.
- **The play area, about 78%.** The top 74% is the scene; the bottom 26% is the inventory shelf (a defined band: a darker wooden counter edge or a soft shelf strip).
- **The focal rule:** the object the child should act on next pulses gently; inactive objects are dimmed about 10% until they matter; the tray and serving items are quiet until the serving step.

## 4. The inventory (every supply station)
- **Identical slots:** fixed footprint (artwork box about 96 px, scaled to fit), evenly spaced, sitting on the shelf band.
- **Under each object, one component:** `🔊 word`, a single tappable chip. **Tap the object = use it; tap the chip = hear it.** As the levels go up, the words disappear, **but the speaker stays** (Zafar, 28 Sept): the chip becomes a speaker-only chip, the same size, shape and position, so the child can still hear the word.
- **Grouped by kind, with a small gap between groups:**
  - **liquids:** water bottle, milk carton;
  - **jars:** chai leaves, sugar;
  - **spices:** small identical spice jars (the pantry-v2 small square jar family), grouped together. No masala dabba (Zafar, 28 Sept).
- **Learning happens during the action:** when something is used, its Kutchi word pops briefly by the pour or sprinkle and the family clip plays.

*§5 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

## 6. Feedback ("juice") everywhere
Correct: a small bounce + a soft glow + a click + the word pop + the clip. A step done: the pill ticks (flat gold outline + flat gold check). Wrong (UX §14 in conversations): a wiggle, and the word is said again; no red mid-round. The end of a station: the three badges, then the word review (flat cards, gold/red outline), then Again / All stations.

## 7. Art consistency (an addendum to the art bible)
The same camera for everything in a scene (top-down for the counter and hob; front-on only for inventory objects standing on the shelf band), light from the upper left, the same soft shadow, the same scale convention (one box size per inventory slot), the same saturation range. Soften the marble counter's contrast so it doesn't compete with the objects.

## 8. Questions for Zafar
1. **One pan per person, up to 4 burners by level**, as in §5? (Recommended.)
2. **A masala dabba** for the spices? (Recommended.)
3. **Tap the object = use it; tap the word chip = hear it**? (Recommended; the same in every station.)

*§9 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

*§10 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

*§11 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

## 12. The order model for cards and pop-ups (Zafar approved, 28 Sept, late). Every station.
Person → items → parts. At most three tiers, and a word is never repeated across tiers.
1. **Headline:** the request, always shown (it's what the person says): *Muke mishkaki khape.*
2. **Item rows:** one per distinct item, all on the same visual level, each with its Kutchi number: *ba lakri gos*, *hakri lakri mixed*, *hakri maani*, *ba bajr ji maani*.
   - **No pips, no digits:** the child must understand the number word.
   - A row ticks when that item is complete, i.e. when its step closes (UX §11); the count is judged in the end review. The tally shows only what has been made so far, never the target.
3. **Parts:** only for items with a recipe (a mixed skewer's four pieces, chai's ingredients, chaat layers), indented under their item row, joined by the thin sequence line when the order matters. Items with no recipe (maani, an all-meat skewer) have no parts.

**Rules:**
- **One item, one of it, with a recipe** (a single chai): no item row; the parts sit straight under the headline (as the chai card is now).
- **Same recipe several times** = one row (*ba lakri mixed*), with the parts shown once. **Different recipes** = separate rows, each with its own parts, and alternate rows lightly tinted so they're distinct.
- **Everything stays fully expanded until it's done** (several people or items may be worked on at once). A finished item row folds to one gold line; a finished person folds to face + headline + ✓.
- **The pop-up uses the same tree** at full size, in the same flat card style: no yellow highlight box, no grey box around a single pill.
- **§12 applies to every game mode (Zafar, 28 Sept).** Build the person card (headline → item rows → parts, folding), the Nani guide box and the order pop-up as **shared components** (`js/shared/order-card.js` + `css/shared/order-card.css`, with Cook's sidebar as the first user), with a mode-agnostic data shape: `{person, headline, items:[{label, count, parts:[…], ordered}]}`. The clinic and Find it adopt them next; the parked modes adopt them when they're rebuilt. The end pop-up and the Done button are already shared.

*§13 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

*§14 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

*§15 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

## Additions from Zafar's Cook UI feedback, 28 Sept

> from: docs/feedback/cook-ui-feedback-2026-09-28.md § §3 Nani the guide: her own box at the top of the sidebar, in every mode (includes the mute button)

### 3. Nani the guide: her own box at the top of the sidebar, in every mode
- She's always there: her face, and the instruction for what to do **now**, in Kutchi. Sometimes it's spoken, sometimes only written.
- **Her colour (decide).** Recommendation: the cream of her kurta, with a band of her red embroidery along the left edge. It's distinct from the plain cream recipe cards, without looking like a danger red.
- **Tap her box to mute or unmute her voice** (remembered for every mode), plus a replay button. The light bulb (translate) moves into her box row, drawn with the new bulb art, which frees the lonely top row.

> from: docs/feedback/cook-ui-feedback-2026-09-28.md § §6 The word review (page 2 of the end-of-round screen): the layout

### 6. The word review (page 2 of the end-of-round screen)
- **Centred vertically**, not pushed to the top.
- **The card border and shadow the same all the way round.** Better colours: right = gold (the theme); wrong = red (Zafar's "red makes you want to fix it") **(decide)**.
- **The layout:** wrong words on the left, right words on the right. Each side's width is proportional to its count, with a minimum of one column. At most three across per side, stacking into rows.

