# Cook design system v1, and the chai station v2 (28 Sept 2026)

The single source of truth for how Cook looks and behaves. It merges Zafar's feedback (and his wife's), two external reviews (`external-review-*.md` in this folder), and Claude's own review. Where it disagrees with an older doc, this wins. **Status: waiting on Zafar's answers to §8, then the mock-up (§9).**

## 1. The diagnosis (what makes it "okay, not amazing")
1. **No focal point.** The pot, a second empty burner, a big shiny tray and seven ingredients all shout equally.
2. **The UI and the world feel like two products.** Web-style boxes (nested cards, pink, rust text) sit next to rendered 3D art.
3. **The inventory has no grid.** Different object sizes and heights, labels on some items and not others, loose speaker bubbles.
4. **No system:** spacing, type sizes, corner radii and colours vary screen to screen.
5. **The logic is muddled** (chai made partly in the glass; an order card that holds other people's orders), which makes the screen feel confusing even where it's pretty.

What the reviews got right and we adopt: a strong grid and inventory slots; fewer containers; one type scale; UI colours from Nani's home; quieter inactive objects; bigger tap targets and audio; the word appearing at the moment of the action; small rewarding feedback.
**What we don't adopt:** restyling all the art to a Toca Boca cartoon look (the photoreal jars are what Zafar likes); "Step 3 of 8" counters; English support text on screen (the light bulb does that job); red crosses (UX §11/§14 stand).

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
- **Under each object, one component:** `🔊 word`, a single tappable chip. **Tap the object = use it; tap the chip = hear it.** Where the level hides the word, the slot shows no chip at all (never a lone speaker).
- **Grouped by kind, with a small gap between groups:**
  - **liquids:** water bottle, milk carton;
  - **jars:** chai leaves, sugar;
  - **a masala dabba**, a round steel spice tin seen from the top with small bowls inside: elchi, aadu, rai, jeeru, and so on. It's authentic and one clean object instead of five loose bowls. Tap a bowl to use that spice.
- **Learning happens during the action:** when something is used, its Kutchi word pops briefly by the pour or sprinkle and the family clip plays.

## 5. The chai station v2 (the logic Zafar set)
- **Everything is made in the pan.** Water, milk, tea leaves, sugar and spices all go into the pan. Nothing is made in the glass. The finished chai is poured from the pan into that person's glass.
- **One pan per person**, like the maani game.
  - A compact top-down hob with up to **4 small burners** (level 1: 1 person and 1 burner; level 2: 2; level 3 and up: 3–4).
  - Each pan has the person's small face badge by its handle, so it's clear whose chai is whose.
  - The child chooses whether to cook them all at once or one at a time (speed is theirs to choose, and so is the boil-over risk).
  - No unused burner is shown; the burner count matches the level.
- **The tray:** a small square wooden tray with 4 round cut-outs, each holding a glass, with that person's face under the cut-out. It's quiet (dimmed) until pouring.
- **Pouring:** tap a pan that's ready, then the pan tilts and pours into its person's glass, which fills.
- **Pills tick when each step closes** (UX §11) in the person's card.

## 6. Feedback ("juice") everywhere
Correct: a small bounce + a soft glow + a click + the word pop + the clip. A step done: the pill ticks (flat gold outline + flat gold check). Wrong (UX §14 in conversations): a wiggle, and the word is said again; no red mid-round. The end of a station: the three badges, then the word review (flat cards, gold/red outline), then Again / All stations.

## 7. Art consistency (an addendum to the art bible)
The same camera for everything in a scene (top-down for the counter and hob; front-on only for inventory objects standing on the shelf band), light from the upper left, the same soft shadow, the same scale convention (one box size per inventory slot), the same saturation range. Soften the marble counter's contrast so it doesn't compete with the objects.

## 8. Questions for Zafar
1. **One pan per person, up to 4 burners by level**, as in §5? (Recommended.)
2. **A masala dabba** for the spices? (Recommended.)
3. **Tap the object = use it; tap the word chip = hear it**? (Recommended; the same in every station.)

## 9. How we get it right in one go
1. **A high-fidelity mock-up first** (`lab/chai-v2-mockup.html`): a static page with the real art, the §2 tokens and the §3 grid, laptop only, showing three states (start, mid-cook, serving). New pieces (masala dabba, square cut-out tray, 4-burner hob) are drawn as medium-quality images via the OpenAI API (≤ $2), or as clean placeholders. Zafar reacts to screenshots, and we iterate there in minutes rather than in the game.
2. **Once the mock-up is signed off:** build the design system (`css/ds.css` tokens + components: lesson panel, person card, pill, inventory slot, nav dock) and the chai v2 mechanics in the game; then ChatGPT prompt packs for the final art.
3. **Roll out** to the other stations (maani next), each against this doc and `docs/VISUAL-QA.md`.
