# Cook design system v1, and the chai station v2 (28 Sept 2026)

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
1. **Headline:** the request, always shown (it's what the person says): *Muke sekelo khape.*
2. **Item rows:** one per distinct item, all on the same visual level, each with its Kutchi number: *ba lakri gos*, *hakri lakri mixed*, *hakri maani*, *ba bajr ji maani*.
   - **No pips, no digits:** the child must understand the number word.
   - A row ticks when that item is complete, i.e. when its step closes (UX §11); the count is judged in the end review. The tally shows only what has been made so far, never the target.
3. **Parts:** only for items with a recipe (a mixed skewer's four pieces, chai's ingredients, chaat layers), indented under their item row, joined by the thin sequence line when the order matters. Items with no recipe (maani, an all-meat skewer) have no parts.

**Rules:**
- **One item, one of it, with a recipe** (a single chai): no item row; the parts sit straight under the headline (as the chai card is now).
- **Same recipe several times** = one row (*ba lakri mixed*), with the parts shown once. **Different recipes** = separate rows (or group boxes), each with its own parts; the boxes keep them distinct, with no alternating tint (decision 95: one highlight, one colour).
- **Everything stays fully expanded until it's done** (several people or items may be worked on at once). A finished item row folds to one gold line; a finished person folds to face + headline + ✓.
- **The pop-up uses the same tree** at full size, in the same flat card style: no yellow highlight box, no grey box around a single pill.
- **§12 applies to every game mode (Zafar, 28 Sept).** Build the person card (headline → item rows → parts, folding), the Nani guide box and the order pop-up as **shared components** (`js/shared/order-card.js` + `css/shared/order-card.css`, with Cook's sidebar as the first user), with a mode-agnostic data shape: `{person, headline, items:[{label, count, parts:[…], ordered}]}`. The clinic and Find it adopt them next; the parked modes adopt them when they're rebuilt. The end pop-up and the Done button are already shared.

*§13 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

*§14 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

*§15 Moved to `docs/game-design/modes/cook.md` (Part 1: station specs).*

## Additions from Zafar's Cook UI feedback, 28 Sept

> from: docs/archive/feedback/cook-ui-feedback-2026-09-28.md § §3 Nani the guide: her own box at the top of the sidebar, in every mode (includes the mute button)

### 3. Nani the guide: her own box at the top of the sidebar, in every mode
- She's always there: her face, and the instruction for what to do **now**, in Kutchi. Sometimes it's spoken, sometimes only written.
- **Her colour (decide).** Recommendation: the cream of her kurta, with a band of her red embroidery along the left edge. It's distinct from the plain cream recipe cards, without looking like a danger red.
- **Tap her box to mute or unmute her voice** (remembered for every mode), plus a replay button. The light bulb (translate) moves into her box row, drawn with the new bulb art, which frees the lonely top row.

> from: docs/archive/feedback/cook-ui-feedback-2026-09-28.md § §6 The word review (page 2 of the end-of-round screen): the layout

### 6. The word review (page 2 of the end-of-round screen)
- **Centred vertically**, not pushed to the top.
- **The card border and shadow the same all the way round.** Better colours: right = gold (the theme); wrong = red (Zafar's "red makes you want to fix it") **(decide)**.
- **The layout:** wrong words on the left, right words on the right. Each side's width is proportional to its count, with a minimum of one column. At most three across per side, stacking into rows.


### 6a. The steps page (page 3 of the end-of-round screen; decision 93, Zafar 13 Oct)
After the word review, by itself (no tap), the round's steps in order: each step's Kutchi with its English under, right steps gold, wrong steps red (as the word review), what was asked against what was done. Then the actions. Every round of a game that has steps, all right or not.

**Show the steps page when** the round asked for two or more separate steps and either:
1. the **order** was part of the ask (data `order: "sequence"`; a doctor's instruction list said one at a time), or
2. each step is **its own action** the child can miss, skip or do wrongly, and the word review alone wouldn't show which.

**Don't show it when** the round was:
1. an **unordered set** (data `order: "any"`: the pantry fetch, the pharmacy belt, samosa kinds), so the word review already says which were right;
2. a **single pick or answer** (the waiting-room call, a greeting answer, the send-off feeling);
3. a **timing or skill game with no spoken steps** (the grill's turns, the tawa flip, a boil): the badges cover it;
4. a round with **one step** only.

| Game | Steps page | Why |
|---|---|---|
| Cook: chaat | yes | the layer order (CHT-07) |
| Cook: daar | yes | the tadka order |
| Cook: sekelo (threading) | yes | each skewer's pieces in order; several skewers |
| Cook: pantry | no | an any-order set |
| Cook: chai tray | no | per-cup choices, no order; the word review covers them |
| Cook: maani, samosa (kinds and counts) | no | counts and any-order kinds |
| Cook: grill, tawa, boil, fry | no | timing, no spoken steps |
| Clinic: heal games with an instruction list (cut, tooth, knee, eye, ear, foot, boing, taste, fever's named effects) | yes | one instruction at a time (SH-45) |
| Clinic: waiting room, send-off | no | a single pick |
| Clinic: diagnosis | no | the check-up parts tick on the card as they're done; the word review covers them |
| Clinic: pharmacy | no | an any-order set |

A new game says in its mode doc which side it's on; a game that gets a sequence later moves to "yes".

## Layout contract v2 (23 Sept, from the Roadmap)

> from: docs/archive/design-v1/Roadmap and Story Structure.md § Layout contract v2

## Layout contract v2

Supersedes the layout contract in the Image Prompt Sheets doc and the "Screen layout" section of the Game Design doc. Drawn from the two 23 Sep playtests. Every scene follows it, so the interface and code never change between scenes.

### The world and the screen

| Rule | Detail |
| --- | --- |
| World size | Fixed 1600×900 (16:9), scaled to fit. All positions are background pixels, stored in `data/scenes/<scene>.json` and checked with `build/place_preview.py` |
| Sidebar | Always its own column beside the game in landscape, never on top of it. A slide-out drawer only in portrait or on very narrow screens, with a close button, and it never opens by itself during play |
| Letterbox | Filled with the scene's dominant colour or a blurred copy of the background, never black bars |
| Tests | Every build tested at phone landscape (915×375), 1366×768, **1440×900 and 1280×800 (16:10)**, and iPad landscape and portrait. Before every tap, the test checks nothing covers the item |

### Depth layers, back to front

1. Background (painted wall, shelves, sky)
2. Swaying scenery layer, where supplied (curtain, awning, lantern, hanging pots) [later]
3. Character (upper body only)
4. **Counter, island or bolster front**, which hides the character's lower body. Drawn into the background or supplied as a matching separate layer
5. Items on shelves and counters, each with a contact shadow, sunk ~4px into the surface
6. Destination container where one exists (Nani's bowl, the cooking pot: back layer, items, front rim)
7. **Carried container** (the player's basket or tray: back layer, items, front rim)
8. Anything in flight; speech bubbles; overlays

### The carried container (core mechanic)

- Bottom-centre of the screen, **no taller than 22% of the screen height**, so it works on a 375px-tall phone.
- A separate art layer, never painted into a background, so one background works with a basket, a tray, a notebook or a sewing box.
- Three layers: inside back, items, front rim. Items pack into preset spots, turned ±8°, overlapping like a real basket.
- Everything collected is visible where it goes. No invisible counters.
- Chapter 1: the shopping basket (Errand 1) and the serving tray (Errand 3). Later: notebook (Ask around), sewing kit (thread quest), first-aid box (Monsoon).
- Tap to move, never drag.

### Characters

- Always stand behind a counter, island or bolster; hidden by the scene, never by the screen edge.
- Upper body only, so no legs and rarely arms are needed.
- Every pose on an identical canvas size and position. Eyes and mouth are the only parts that change for frequent animation (blinks, talking); see the character animation approach in the playtest review.
- Speaking uses a speech bubble from the speaker: solid cream background, dark text, English one tap away inside the bubble. Replaces the caption band across the top.

### Item zones: sized by what the zone is for

| Zone | What it is | Sized by | Capacity |
| --- | --- | --- | --- |
| **Shop display** (bazaar counter) | Targets plus decoys for one errand; restocked by the errand generator each time | The largest single errand: up to 6 targets plus a similar number of look-alike decoys | **10 to 12 slots** in one row on the counter, with crates and baskets as holders |
| **Pantry** (kitchen shelves) | A progress container: every mastered food word lives here for good | The whole food vocabulary it holds | **4 long, evenly spaced shelves, room for ~32 items** (16 fruit, 16 vegetables), slots built into the art |
| **Spice cupboard** | A separate close-up scene opened from the kitchen | The spice vocabulary | **3 shelves × 6 = 18 slots** for the 16 spices |
| **Dastarkhwan** | The "put it there" surface for laying the table | One meal for the family and guests | Hotspots measured onto the cloth: places, cups, serving dishes |

The spice cupboard is in the MVP because Chapter 1's daar needs spices. Buying spices at a separate spice seller is deferred: in Chapter 1 the spices are already in Nani's cupboard.

### Sidebar (the recipe list)

- Each row: `[quantity ×] [Kutchi word] [play button, never clipped]`, dots that fill as items are collected (● ● ○), English toggle beneath. Items with no count show no number.
- Buttons hidden until usable, never shown greyed-out as "…".
- Later: the list moves into the world (a handwritten list tied to the basket handle), freeing the whole screen.

## Moved from the rulebook and decisions log (13 Oct, decision 99)

Word for word from the retired rulebook and decisions log (`docs/archive/process/rules-2026-10-13.md`, `docs/archive/decisions/decisions-1-to-99.md`); the newest word from Zafar wins.

- **Never make the child wait for speech:** input is live, a tap goes ahead, the line can be replayed; a tap pauses the line, the count plays, and the line carries on. (E5)
- **Give clear feedback while an action is under way** (e.g. too-fast/too-slow zones on the stir dial). (E34)
- **Decision 25 (1 Oct):** The sidebar and its text scale with the screen; the order card can lay short rows out as pills, set per screen size in data.
- **Decision 56 (6 Oct):** Things inside a container sit on its flat inner area (thali, tray, oil, plate), never on the rim or sides.
- **Decision 57 (6 Oct):** The bulb also translates the guide line, and always shows the full order with numbers at every level; a number is written the first times it is heard, at any level. On spoken cards the closed card's eye becomes a small bulb, no counter. Amends decisions 27 and 41 (the card itself still drops numbers from L3).
- **Decision 97 (13 Oct):** Sprint 5 fix round answers: (1) one last bounded push for C3 and D3 in their own sessions (about 1.5 h, about $35; ceiling about $480): the full check's 12 findings, the four Cook rows now judged on reached states, the order-card unit test and D3's items for C3; anything left after it is listed and the publish goes ahead; (2) the two-strike rows: the taught round's ghost finger (CLN-133) and boing's L1 card (SH-45) get a third try in this push; the knee bandage bands (CLN-100) and her face matching her words (CLN-136, needs a sore-face picture) go to Sprint 6 with their pictures; (3) a card stays open from its dish's first step to its last (chai stays open through the pour), in Cook and the clinic; cards for dishes not in play fold; (4) a learnt word's shelf chip may be its speaker alone (SEK-15 closed by design); (5) W3, the waiting room's speaking-pill variant, is retired with its row (CLN-123); (6) diagnosis and send-off keep her patient card in the sidebar, without a face circle (decision 92); (7) every speech bubble's tail ends at the speaker's mouth; (8) heal ladders: any game still adding two things at one level moves the extra one to L4 (ear L3 side, fever L3 fix step, the parked games).
