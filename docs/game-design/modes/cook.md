# Cook with Nani: design and build status

The single home for Cook's design: where Cook is now, the standing rules, the station specs (moved here from `docs/design-language/ui-design-system.md`, which keeps the tokens, grid, inventory, feedback, order model and shared components) and the layout and pantry. The older Phase A design, the dishes and Kutchi questions of 24–26 Sept and the first build status are history, in `docs/archive/modes/cook-design-v1.md`. The look and the shared components are in `docs/design-language/ui-design-system.md`; the rules are in `docs/process/rules.md`; how to add dishes and stations is `docs/architecture/cook-recipes-guide.md`.

## Where Cook is now (6 Oct 2026)

- **A plug-in of the shared host** (`js/cook/main.js`): the pantry, six stations (chai tray, maani line, daar with its chop, tadka and stir, the chaat bowl, samosa with its fry, sekelo) and the recipes are mini-games the host runs and scores once per plan (three badges, pocket money, the story line, one end screen). Cook mounts directly in the element the host gives it (`js/cook/mount.js`), with no iframe: its code is ES modules on one namespace and unmounting tears down Phaser, timers, listeners, audio and DOM (`build/test_cook_mount.mjs` proves five mounts in a row leave nothing behind).
- **Entries:** `lab.html?mode=cook&game=chai-tray&level=2` (one station), `&play=story` (one recipe across its stations, the pantry first, H49–H50), `&play=free` (the open kitchen, one customer a round). `cook.html` is Cook's own page: the title, the story days and the shop (`js/cook/page.js`), which mount the same plug-in; the title, days and shop are picture-only with English behind the grown-ups' "?". C4 did not move them onto shared shell screens; the missing pieces are the house opening Cook through `mode.js`, a several-order plan with patience, a shared day's-end summary, a shared shop over the wallet and the bookshelf.
- **Words from the engine:** every word, row, headline, bubble, guide line and count comes from the language engine through `js/cook/words.js`; Cook's code holds no word text (the word lint is strict on `js/cook`). The frames are data (`data/cook.json` `meanings`); `data/cook.json` otherwise keeps the item catalogue. Five frames and some words are still gaps (grey-italic placeholders, `data/lang/reports/gap-list.md`): "with", "and", "times", the sugar sentence and the pantry headline.
- **Counting rule (decision 41):** the order is spoken at the start and the face replays it; L1 written and counted along, L2 written, L3+ heard only. Take-back is in the pantry, the samosa fill and the maani; elsewhere an undo is impossible and shown in the art.
- **Open rows** (`docs/process/regressions.md`; numbers in `docs/status.md`): the pantry's clipped headline (PAN-01 reopened), chai, daar and sekelo rows, and tablets (CK-TAB-01: no tablet layouts for the stations yet). Zafar plays Cook in Sprint 2 (`docs/sprints/S02-play-and-fix-cook-clinic.md`).
- **Parked, not removed:** hands (none in Cook, H13), knead (cut from the stations), the old Busy and Relaxed idea (an open question).

## Standing rules (from the rulebook; the IDs are anchors other docs cite)
- **Cook's design has two homes:** the shared look and components in `docs/design-language/ui-design-system.md`, and Cook's stations in `docs/game-design/modes/cook.md` (split from the Cook design system v1 on 1 Oct). Together they are Cook's single source of truth. (H10)
- **Story mode is one recipe across a few stations;** free play is the kitchen with people arriving, stopping when you choose. (H50)
- **Pantry first, story mode only:** the first time each dish is made that day starts with a pantry trip ("bring me these for {dish}"); Nani's "pass me" goes in the pantry and slower modes. (H15, H49)
- **Everything cooks in the pan or pot, never the glass:** one pan per person, one burner per pan, no empty or lit-but-unused burners. Maani keeps one tawa. (H11)
- **One shared kitchen kit** (hob, knobs, glowing-ring "on", pour, boards) in chai v2's best version, and **no hands anywhere in Cook**. (H12, H13)
- **Ingredient cameras are consistent within each station** (chai/daar side-on jars, chaat side-on, samosa and sekelo top-down, pantry straight-on). (H14)
- **Pour is a tap-measure;** "don't" rows are sub-rows (*dudh na*), not *{x} wagar ji {dish}*. (H17, H23)
- **Chai:** about half the cups ordered by name (*kari*, *mori*) with rows saying what that means; a plain wooden tray with four cut-outs and faces beside the hob. (H16, H51)
- **Daar:** swipe chop from Nani's chopping card (with decoys), a speed dial and lap count, no oil ring, numbers hidden from level 3. (H18)
- **Samosa:** the swipe fold stays, a base filling first, two different samosas per order allowed; chips belong here with the fry, not the grill. (H19, H24)
- **Sekelo** is the grill and dish name (*mishkaki* = the meat cubes): vertical skewers, no bare "boga" skewers, headline like "one mixed, two meat". (H20)
- **Maani:** a dough pile, one ball per tap, flat cooked maani with spots, a flat wooden turner, at most three things on screen. (H21)
- **Chaat:** a bigger bowl, ingredients on two rows, built in order, no tally. (H22)
- **Pantry art:** straight-on shelves, labelled clear jars, a fridge on the right, a tray with spaces instead of a basket. (H52)

---

## Part 1. Station specs (moved from the Cook design system v1)

> from: docs/design-language/ui-design-system.md (before the split) § §1 The diagnosis

## 1. The diagnosis (what makes it "okay, not amazing")
1. **No focal point.** The pot, a second empty burner, a big shiny tray and seven ingredients all shout equally.
2. **The UI and the world feel like two products.** Web-style boxes (nested cards, pink, rust text) sit next to rendered 3D art.
3. **The inventory has no grid.** Different object sizes and heights, labels on some items and not others, loose speaker bubbles.
4. **No system:** spacing, type sizes, corner radii and colours vary screen to screen.
5. **The logic is muddled** (chai made partly in the glass; an order card that holds other people's orders), which makes the screen feel confusing even where it's pretty.

What the reviews got right and we adopt: a strong grid and inventory slots; fewer containers; one type scale; UI colours from Nani's home; quieter inactive objects; bigger tap targets and audio; the word appearing at the moment of the action; small rewarding feedback.
**What we don't adopt:** restyling all the art to a Toca Boca cartoon look (the photoreal jars are what Zafar likes); "Step 3 of 8" counters; English support text on screen (the light bulb does that job); red crosses (UX §11/§14 stand).


> from: docs/design-language/ui-design-system.md (before the split) § §5 The chai station v2

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


> from: docs/design-language/ui-design-system.md (before the split) § §9 How we get it right in one go

## 9. How we get it right in one go
1. **A high-fidelity mock-up first** (`lab/chai-v2-mockup.html`): a static page with the real art, the §2 tokens and the §3 grid, laptop only, showing three states (start, mid-cook, serving). New pieces (masala dabba, square cut-out tray, 4-burner hob) are drawn as medium-quality images via the OpenAI API (≤ $2), or as clean placeholders. Zafar reacts to screenshots, and we iterate there in minutes rather than in the game.
2. **Once the mock-up is signed off:** build the design system (`css/ds.css` tokens + components: lesson panel, person card, pill, inventory slot, nav dock) and the chai v2 mechanics in the game; then ChatGPT prompt packs for the final art.
3. **Roll out** to the other stations (maani next), each against this doc and `docs/archive/process/VISUAL-QA.md`.


> from: docs/design-language/ui-design-system.md (before the split) § §10 Decisions after the mock-up review

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

  It replaces the old "{Station}: done" card with its three badges, the "words in this order" and "next time" text.
- **Word review speaker buttons:** a neutral colour (charcoal icon on a light cream circle) for both right and wrong words. The colour stays only in the card outline (gold = right, red = wrong).
- **(28 Sept, late)** A single line of text next to a character icon (e.g. a collapsed card's headline) is **vertically centred on the icon**. The inventory shelf keeps **true relative heights** (bottle and carton tall, jars medium, spice jars short, as in the pantry), each standing on the shelf line. Slightly more breathing space between the cooking area and the shelf than chai v2's first build, less than the mock-up. The end pop-up sits over the game scene only (the old "Cook with Nani" menu card must not show behind it), and the word review is vertically balanced in its card.


> from: docs/design-language/ui-design-system.md (before the split) § §11 The maani station v2

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


> from: docs/design-language/ui-design-system.md (before the split) § §13 The daar station v2 and the shared kitchen kit

## 13. The daar station v2 (chop, then tadka/stir) and the shared kitchen kit (Zafar approved, 29 Sept)
- **The burner rule (Zafar, 29 Sept):** a hob shows one burner per pan in play, up to 4, never an empty burner. Chai: one pan per order. **Maani keeps ONE tawa on one burner**: the game there is rolling the next maani while flipping the one on the tawa. The shared kitchen kit must support 1–4 burners; each station uses as many as it has pans.
- **Nani's chop card:** a person card (shared order card, §12) with Nani's face, the headline "Chop these" (an English placeholder, flagged to record), and item rows with Kutchi quantities: *ba mirchi*, *ba tameto*, *ba dungri*. You chop what's on Nani's card.
- **Rule for every mode: only cards you can act on in the current phase stay expanded.** The others fold to face + headline (no ✓ unless finished) and re-open when they're back in play. E.g. Nana's daar card folds during chopping.
- **Onboarding (first time):** a ghost finger shows Nani's card → the matching vegetable → the knife → the pill ticks; then the child does it.
- **Stirs:** show only the simple Kutchi number word near the pot or spoon (e.g. *trae*), no digits. The tally counts stirs done, as elsewhere.
- **The shared kitchen kit (every station):** one hob, knob, pan, pot, ladle, wooden board and knife asset set; one heat component (the chai v2 heat ring, in its best version, replacing the speedometer everywhere); one pour (the chai v2 tilt and stream, replacing the arrow). No hands or arms: the knife cuts and the spoon stirs on their own.
- **Art:** real top-down vegetables (whole and chopped; reuse pantry v2 and cook items where possible), a wooden chopping board, a knife and a bowl for the chopped vegetables. Generate via the API if the total is under $2, else a ChatGPT paste-block pack. Follow chai v2's layout and spacing learnings (§10) and `docs/archive/process/VISUAL-QA.md`.


> from: docs/design-language/ui-design-system.md (before the split) § §14 The chaat station v2 (with 14a)

## 14. The chaat station v2 (Zafar approved, 29 Sept, with the changes in 14a)
**What works:** the mechanic (build the bowl in order) is good for teaching order and *ne poi*; decoys, including a "don't" item (*Marcha na.*), make you listen; the ticks work.

**What's wrong:**
1. **Mixed viewpoints.** The glass bowl is seen from the side while the ingredient bowls are seen from the top, which is the same problem the pantry had.
2. **The layers don't look like food.** They're flat colour bands that read as liquids (brown, yellow, beige). Real chaat is potato cubes, chana, a chutney drizzle and a sev crown. The top layer hides the ones beneath it, which defeats the "in order" lesson.
3. **The ingredient grid is ragged** (four on top, three below with a hole), there are no word or speaker chips, and there's no shelf band. It floats on the marble.
4. **The tally uses big red digits over two rows.** It's off-style: red reads as wrong, and it's a second, different number style on the screen.
5. **The card doesn't show order.** An ordered job needs the sequence line and the grey "next" row. "Marcha na." should look like a "don't" row, not the same as the others.
6. **Nani's line** is an English placeholder ("Make the bowl, in order").
7. **The bowl is huge**, and the space above and around it is wasted.

**Proposal:**
- **One viewpoint: front-on.** A clear glass bowl seen from the side (a cross-section, so every layer stays visible), and the ingredients standing on the shelf band below as front-on prep bowls (the same slot rules as chai v2 §4: identical slots, `🔊 word` chips, speaker-only chips at higher levels, true relative heights).
- **Real layer art:** each ingredient becomes a textured layer (potato cubes, chana, a dahi swirl, chutney drizzle lines, sev strands, dhania leaves, chilli slices) that settles into the glass with a little drop and bounce, and the word pops up with the family clip. Layers are sized so four to six stay visible.
- **The card:** the order model (§12) as an ordered job, with the sequence line, grey "next" and gold done. **A "don't" row style:** the word plus a small muted *na* tag; it ticks when the bowl is served without that item (UX §11); adding it anyway only shows in the end review.
- **The tally:** the flat design-system style (charcoal numbers, one row, only what's been added). Or drop it at this station, since the glass itself shows what's in, and a tally duplicates it.
- **Layout (the chai v2 grid):** the bowl centred in the scene at about 60% of its current size, the shelf band below with even breathing space, and nothing floating.
- **Serve moment:** Done → the bowl slides to the person, they react (happy face or counter mood), then the end pop-up.
- **Levels:** level 1 is three layers with no decoys; level 2 adds decoys; level 3 adds a "don't" row (*{x} na* / *{x} wagar ji*, idea 1 in GAME-IDEAS-TBC); level 4 adds two bowls for two people with different orders (two cards).
- **Onboarding (first time):** a ghost finger shows card row 1 → the matching bowl → the drop into the glass → the tick. Then the child does row 2.
- **Art to make:** a front-on clear glass serving bowl (empty), front-on prep bowls for each ingredient (the same bowl, different contents), and layer textures (API if under $2, otherwise a paste-block pack).

### 14a. Zafar's decisions on chaat v2 (29 Sept)
- **Drop the tally** at this station; the glass shows what's in.
- **Level 4 = still one person**, but the person's card starts **folded** (face + headline only). The child must remember the order they heard; opening the card to peek costs a hint (it counts on the light-bulb badge). This replaces "two bowls for two people".
- **The serve and taste moment:** Done → the bowl slides to the person, who tastes it.
  - **Right:** a happy reaction and a family praise clip (*Shabash!*, or another recorded, age-appropriate praise).
  - **Wrong:** a gentle "not quite" face; the bowl slides back **empty** and the child builds it again. It's social and gentle, like UX §14, never a red cross, and the first-try result is logged for the end review.
- **Changed 29 Sept (play-test X10, Zafar's answer to Q1): one review in all seven stations** (`Cook.Kit.review`, §13). No half-body sliding in and no pretend eating: the person appears as a **large round face over the dish** (their face art, `assets/cook/characters/<who>-face*.webp`, scaled to suit the station): **happy** when it's right (with the praise card and clip), a **gentle frown** when it's wrong (the card marks the wrong row and the child redoes it, as before). Chai shows one face over each glass at the tick; maani one over the finished plates; the pantry has none. The faces are framed by the eyes (X4): the same eye line and eye size for every person, three moods each (neutral, happy, frown).


> from: docs/design-language/ui-design-system.md (before the split) § §15 Samosa v2 and Sekelo v2

## 15. Samosa v2 and Sekelo v2 (Zafar approved, 29 Sept, ~01:00 UK)
**Common to all Cook stations:** consistent spacing across stations (the chai v2 grid: the scene area plus the shelf band, the same margins and gaps), the synthesised external review (§1–§7: one focal point, one viewpoint, identical shelf slots, word chips, flat UI, no hands, real art, calm), the shared kitchen kit (§13), the order card (§12), serve and taste (§14a) where a dish is served. **Use existing art wherever possible** (`sources/art/chatgpt-batch3/`: `sheet-samosa-folds-t-v2`, `sheet-tray-grill-t-v2`, `vessel-skewer-rack-t-v1`, `tool-*`, `vessel-*`; `assets/cook/items/`: the samosa fold stages, mishkaki raw/grilled/charred, pantry v2 containers). Generate only what's missing (API if under $2, otherwise a paste-block pack).

### Samosa v2 (fill, fold, fry)
- **Fill:** real top-down pastry on a wooden board; the filling comes from front-on prep bowls on the shelf band; each tap adds a spoonful, and the word pops with the clip.
- **Fold: keep the SWIPE** (Zafar likes it: it's different and should feel satisfying). Make it feel great: real pastry art for each fold stage, the fold animating to follow the finger, a satisfying snap and sound at the end, and a soft glow showing where to swipe. No dashed line and no red dot.
- **Fry:** the kitchen kit (hob, knob, heat ring) with a karahi; samosas go raw → light → golden → too dark; lifted out with a slotted spoon (no hand) onto a paper-lined plate; *hane kadh*.
- **Card:** order model (*ba samosa* + parts + a "don't" row); the phase-fold rule between fill and fry. **No tally.** Serve and taste.

### Sekelo v2 (formerly "Mishkaki grill")
- **Naming (Zafar):** the station is now called **Sekelo**. The word ***mishkaki* now refers only to the square beef or lamb meat cubes.** Update station names and labels; the meat-cube ingredient is *mishkaki*. The order headline (e.g. *Muke sekelo khape.*) is **to confirm with Zafar**: flag it in the report, and don't change other Kutchi.
- **Keep the skewer orientation as it is now** (vertical on the board).
- **Top-down throughout (Zafar, 29 Sept, after the first build):** this station keeps one top-down view, the prep bowls included: top-down bowls (the cream topping-bowl family) in the shelf band's slots with their chips, not front-on bowls.
- **Thread:** the ingredients stand in front-on prep bowls on the shelf band (identical slots, word chips, true heights); tap to thread onto the vertical skewer; the card shows the parts with the sequence line and grey "next". Two different mixed skewers: thread one, and it moves to the skewer rack (`vessel-skewer-rack-t-v1`), then the next. No floating preview skewer.
- **The phase button:** a flat design-system button ("to the grill", with an icon), replacing the red "Go to the barbecue".
- **Grill:** a grill in the same art style (`sheet-tray-grill-t-v2` if suitable) with the heat-ring language; tap a skewer to turn it; raw → grilled → charred. No hands. Serve and taste.

---

## Part 3. Layout and the pantry (Zafar's feedback, 28 Sept)


> from: docs/feedback/cook-ui-feedback-2026-09-28.md § §4 The pantry: redo the art and the layout

### 4. The pantry: redo the art and the layout
- **The shelves:** straight on, at eye level, horizontal. Every item is drawn side-on at the same eye level. No angled shelves, and no top-down bowls on side-on shelves.
- **The containers:** clear containers with a label sticker (about a third of the jar) showing the item blown up:
  - small square jars for spices;
  - tall jars for flour, rice and lentils;
  - a milk carton; a clear water bottle; an oil bottle; a yoghurt tub;
  - vegetables in a wooden crate.

  **Meat and chicken (decide):** Claude suggests a **fridge section** of the pantry (a glass-door fridge or a cool shelf) for meat, chicken, milk and yoghurt, with meat in clear lidded tubs or a butcher's paper parcel with the label sticker. No generic Indian metal jugs.
- **The basket becomes a tray** on the counter, with one outlined space per item needed. Items sit in their spaces, so you can see what's still missing.
- **The "next item" highlight:** the ring looks off because it's centred on the item and its label together. Recommendation: a soft glow and a small bounce **of the item itself**, centred on the picture.
- **The backgrounds look low-resolution** next to the characters (kitchen, pantry, and the rest). Serve them at full resolution and quality. If the ChatGPT originals (1536 px) are still soft at laptop 2× resolution, upscale them.


> from: docs/feedback/cook-ui-feedback-2026-09-28.md § §8 The chai station (the chai layout)

### 8. The chai station (Zafar, 28 Sept, evening), with Claude's recommendations
- **Layout:** the hob and the chai tray sit side by side along the top, level top and bottom. The hob is turned to be wider (about 5/8 of the width) and the tray takes about 3/8. Below them runs a clean strip for the ingredients, and **nothing overlaps the hob**.
- **The ingredient row reuses the pantry's front-on containers** (the jar, carton and bottle family from the pantry-v2 art), standing on the counter edge. The child sees the same jars they fetched from the pantry, and liquids read clearly, which a top-down view can't manage. The hob, the pot and the tray stay top-down. There's no need to redo everything at 45°.
- **Liquids in the pot:** new art for the pot's contents: water, milk, light chai, dark chai, and a boiling-bubbles overlay. The level rises as liquid is added, with steam when hot. No more flat blue disc.
- **Pouring:** the jug or carton tilts over the pot (a rotation), a short pour-stream sprite plays, and the level rises. It's simple and convincing; no full liquid simulation is needed.
- **The chai tray:** use the real art that's already filed: `sources/art/chatgpt-batch3/tray-chai-t-v2.png` and the top-down chai glass `vessel-glass-chai-top-t-v1.png`. Each glass has the person's small round face badge on the tray rim beside it, so it's clear whose chai is whose.
- **The hob knobs:** `sheet-hob-parts-t-v1.png` is filed but not used; wire it in.
- **Polish, across the stations:**
  - the same soft shadow under every object;
  - the same glow-and-bounce highlight as the pantry;
  - a small puff or sprinkle when an ingredient goes in;
  - a spoon stir;
  - label pills in one style;
  - items without a word show no empty speaker pill.
- **Art still to request:** pot-content states and a pour stream, the ingredient containers (from the pantry-v2 pack), and any missing chai-glass fill levels.
- **Remove the fill line** from the chai glass and the pot: it's a relic. Nothing fills to a line any more.
- **Ingredients:** stations where you pick from a supply (the hob, chai) use the bottom strip of front-on containers. Stations where the items are part of the scene (the sekelo tray, rolling) keep them in the scene. The rule is consistency within each station.
- **People behind the counter** use the character art of them leaning on the counter, or with an arm on it (the `char-*-counter` art already made), at least when they're sitting or waiting. No floating cut-out heads.
- **The Done button (every mode): decide** between:
  - (A) the new gold-metal tick art on a round cream button, the same tick as the end-of-round screen; recommended;
  - (B) a brass service bell for Cook ("order's ready!", with a ding), plus A everywhere else;
  - (C) a big gold arrow.
- **The opening game screen** is weak; that's parked until later (Zafar).
