# Cook design system v1, and the chai station v2 (28 Sept 2026)

The single source of truth for how Cook looks and behaves. It merges Zafar's feedback (and his wife's), two external reviews (`external-review-*.md` in this folder), and Claude's own review. Where it disagrees with an older doc, this wins. **Status: §8 answered by Zafar (28 Sept): one pan per person YES; masala dabba NO; tap object = use, tap chip = hear YES. Mock-up (§9) next.**

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
- **Under each object, one component:** `🔊 word`, a single tappable chip. **Tap the object = use it; tap the chip = hear it.** As the levels go up, the words disappear, **but the speaker stays** (Zafar, 28 Sept): the chip becomes a speaker-only chip, the same size, shape and position, so the child can still hear the word.
- **Grouped by kind, with a small gap between groups:**
  - **liquids:** water bottle, milk carton;
  - **jars:** chai leaves, sugar;
  - **spices:** small identical spice jars (the pantry-v2 small square jar family), grouped together. No masala dabba (Zafar, 28 Sept).
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

## 10. Decisions after the mock-up review (Zafar, 28 Sept, late)
- **Pills are stacked rows** (full width, one per row, tick on the right), not side-by-side chips.
- **A person's card collapses when it's complete.** Once all its pills are done, the card animates up into a single line: the face plus the headline (*Muke chai khape.*) with a small flat gold check. This saves space when there are many orders. Tapping a collapsed card re-opens it.
- **The chai v2 build goes ahead** in the game, from the mock-up (`lab/chai-v2-mockup.html`), with these fixes:
  - the hob and tray about 15% bigger and lower (less empty space at the top);
  - true top-down pans, lit consistently from the upper left;
  - a tilted-pan sprite for pouring;
  - the face badges on the hob edge in front of each burner, not on the handles;
  - larger knobs (a 48 px tap area);
  - real top-down chai glasses and liquids.

  Art: generate via the OpenAI API if the total is under $2 (gpt-image-1, medium); otherwise write a ChatGPT paste-block pack.
- **The end-of-station pop-up (every mode):** one pop-up card that steps through:
  1. the three badges (stopwatch, tick, bulb) → Next;
  2. the word review **inside the same pop-up card** (it must look like part of the pop-up, not a separate page);
  3. the action buttons (Again / All stations, or Next station) at the bottom of that card.

  It replaces the old "{Station}: done" card with its star badges, the "words in this order" and "next time" text.
- **Word review speaker buttons:** a neutral colour (charcoal icon on a light cream circle) for both right and wrong words. The colour stays only in the card outline (gold = right, red = wrong).
- **(28 Sept, late)** A single line of text next to a character icon (e.g. a collapsed card's headline) is **vertically centred on the icon**. The inventory shelf keeps **true relative heights** (bottle and carton tall, jars medium, spice jars short, as in the pantry), each standing on the shelf line. Slightly more breathing space between the cooking area and the shelf than chai v2's first build, less than the mock-up. The end pop-up sits over the game scene only (the old "Cook with Nani" menu card must not show behind it), and the word review is vertically balanced in its card.

## 11. The maani station v2 (Zafar approved, 28 Sept, late)
- **Layout: a two-zone grid**, everything aligned on shared top and bottom lines:
  - **Left (prep):** a row of dough plates along the top (bajri, wheat, plus an empty third place for later, e.g. puri), with the chakla (rolling board) centred under the row.
  - **Right (cook):** a compact top-down hob with the tawa centred on the burner, with the finished-maani plates beneath it.
  - Equal sizes and even spacing.
- **Everything centred:** the tawa on its burner, the timer ring on the tawa, the dough on the board.
- **No hands anywhere.** The rolling pin rolls on its own. The flip is a **chimta** (tongs), or a spatula with no hand: tap the maani and the tool flips it.
- **The rolling target:** a faint gold ring etched on the board that glows when the maani reaches the right size (it replaces the white dashed circle).
- **Maani puff:** only a slight puff when cooked, not a puri ball.
- **Art:**
  - use what's already made: `sources/art/chatgpt-batch3/tool-chakla-t-v2.png`, `tool-velan-t-v2.png`, `sheet-bajr-maani-t-v2.png`, `vessel-thali-t-v2.png`, and the chai v2 compact hob;
  - still needed: dough balls (bajri, wheat) on plates, maani cooking states (raw, cooking, slight puff, done) and a chimta. Generate via the API if the total is under $2, otherwise write a ChatGPT paste-block pack.
- **Timers by level (all Cook stations):** flip, boil and fry timers get about 15% quicker per level, set in the game data (e.g. `data/cook.json` → `timing.levelSpeed`) so they can be tuned.
- The sidebar, cards, Nani box and end pop-up are shared, so they already apply here. Just check that the maani pills tick as each maani is done.
