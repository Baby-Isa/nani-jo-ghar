# Cook with Nani: design, station specs and build status

> **Stale points (what `docs/process/rules.md` now overrides).** The source blocks below are copied word for word and not corrected.
> - Stars, the ear star and the voice star → three badges: time, accuracy, hints (H5, decisions 1–2)
> - Hands in Cook → none: no hands anywhere (H13)
> - *marcha* (plural, "ba marcha") → *mirchi* only, no plural, for now (G5, decision 5)
> - *mishkaki* as the station or dish → the station is **Sekelo**; *mishkaki* is only the meat cubes (H20)
> - *daal* → *daar*; *hikdo* (one) → *hakro/hakri* by gender; *vadho* → *wadho* (G5, G6)
> - Coins, prices, the 375-coin shop and "pocket money" → superseded by decision 10 (upgrades)
> - Quilt patch as the Day 5 finale → bookshelf book (decision 4)
> - English on screen, English "gist" or grey English in games → none for the child (E1, F23); written English only in the "?" pop-up
> - "Front-on inventory bowls" (§4) vs "top-down prep bowls" (§15): pick per station (H14)
> - Sidebar on the right (older sketches) → left, about 22% (F4)

The single home for Cook's design: the station specs (moved here from `docs/design-language/ui-design-system.md`, which keeps only the tokens, grid, inventory, feedback, order model and shared components), the Phase A and quality-pass design, the build status, and the open Kutchi items. The look and the shared components are in `docs/design-language/ui-design-system.md`; the rules are in `docs/process/rules.md`.

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

  It replaces the old "{Station}: done" card with its star badges, the "words in this order" and "next time" text.
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
- **Nani's chop card:** a person card (shared order card, §12) with Nani's face, the headline "Chop these" (an English placeholder, flagged to record), and item rows with Kutchi quantities: *ba marcha*, *ba tameto*, *ba dungri*. You chop what's on Nani's card.
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



## Part 2. The Phase A design and the quality pass


> from: docs/archive/cook/cook-with-nani-phase-a-design.md § Mini-game quality pass, 25 Sept 2026 (Q0–Q9)

### Mini-game quality pass, 25 Sept 2026

Per `docs/archive/mode-briefs/MINIGAME-QUALITY-BRIEF.md` and `docs/archive/mode-briefs/PIPELINE-BRIEF.md`, applied to the built and live mode. Cook never had a "Pipeline design" section, because it was built before the pipeline brief; this section frames the existing stations as a pipeline (Q1), answers the five questions for every station (Q3), scores and cuts (Q4), checks the controls against the corrected rule (Q5), checks distinctness against the other modes' pipeline designs (Q6), gives level-1 walkthroughs (Q7), and ends with the list of concrete changes for the next Cook wave (Q9). It supersedes sections 7, 8 and 11 below where they conflict; sections 12–13 (what's built, the audit) stay as the record. Wave 6b is changing the code right now (results screen, tally, auto-tick, tap pour, Nani out of the sidebar); this section assumes it lands and builds on it.

#### Q0. What Zafar's tests found, and the rules this pass applies

- **The press-and-hold pour didn't land.** Small hands let go early or never found the hold; the sliding jug appeared "by itself". It becomes a tap (Wave 6b), and Q5 says exactly what a tap pours.
- **Level 1 was overwhelming.** Wave 6 fixed most of it: the smallest round, one job at a time, the request card, one light bulb, the first-time overlay. What's left is inside the stations: chop still throws every vegetable of the order at level 1, and Nani still corrects mid-round in several places. Q9 lists the fixes.
- **Controls (Zafar, clarified 26 Sept): internal consistency, not tap-only.** Swipe, drag, stir and tap are all fine. Within one mini-game the same *kind* of action always uses the same gesture (if ingredients are tapped in, liquids are tapped in too), and a mini-game's gestures never change between its levels. Q5 audits every station against this.
- **Auto-tick, no mid-round verdicts, the card is the master, Nani is a voice** (UX §11–§13). Applied per station in Q3, with one open question on ticks and counts (Q8).

#### Q1. Cook as a pipeline: order → prepare → cook → serve → review

Every dish, in the story days and in the open kitchen, runs the same five stages. The stations are the mini-games *inside* the stages; a combined station (the Chai tray, the Maani line, the Mishkaki grill) spans two or three stages on one screen, with the big button between them (UX §5).

```
 ORDER            PREPARE               COOK                 SERVE                REVIEW
 request card  →  pantry · chop      →  boil · tadka      →  pour the cups     →  the customer checks
 (face, rows,     thread · fill+fold    stir · tawa          plate the skewers    the end-of-round
  read-along)     roll · spoon/measure  grill · fry          build the bowl       screen (time,
                                                             samosas on the plate accuracy, hints)
                                                             "{person} lai"       the word review
                                                                                  pocket money
 carried →        the rows (what,       what you prepared    the plate/cup/bowl   the rows, ticked or
                  how many, for whom)   is what cooks        vs the rows          missed, per person
```

**Hand-overs.** The request card's rows are the whole contract (nothing later invents a row, except *pass me*, which adds one the way Find it's doorway call does). Prepare works from the rows; cook works on what prepare made (the grill cooks the skewers you threaded, the fryer the samosas you folded, the tadka goes into the pot whose vegetables you chopped); serve is graded against the rows (which kind, how many, in what order, for whom); review shows the rows with what you did, then the badges and the word review. The **stitching** is unchanged: a story day is one to three dishes through the pipeline; the first ever session is Nani's pantry list (three things, order → prepare → review only); the open kitchen is free play with customers queuing and "Close the kitchen"; the Station lab dips into any single station at any level.

| Stage | Mini-games (level 1 in bold is the first thing a new player meets) | Stage-level rule |
|---|---|---|
| **Order** | The request card: **Nani's list** (pantry), one person orders (chai, maani, daar, chaat, samosa, mishkaki), everyone orders (the Chai tray: each person says their cup) | Listening only; the card shrinks into the left sidebar and is the master from then on |
| **Prepare** | **Pantry** (fetch), **chop** (ninja), **thread** (skewers), fill + fold (samosa), roll (maani), the cup's spoons and milk (Chai tray) | Every prepare game turns on a noun, a count, an order or a *nar*; decoys always out |
| **Cook** | **Boil** (the knob), **tadka**, **stir**, tawa, **grill**, fry | The hand star lives here (rings, green windows); the ear star only where Nani speaks (tadka's order, stir's speed, fry's "leave the chips") |
| **Serve** | **Pour the cups** (Chai tray), **plate the skewers**, build the bowl (chaat), samosas on the plate, *{person} lai* (who gets which) | Graded at Done against the rows; nothing on screen shows the target |
| **Review** | The customer checks aloud (the chaat's layer-by-layer check is the model), the shared end-of-round screen (UX §9), pocket money | The only place mistakes are shown |

#### Q2. Research: what's working now, and the mechanic borrowed from each

| Game | What it does that works | What Cook borrows (or already has) |
|---|---|---|
| **Good Pizza, Great Pizza** (the reference for "the order is the puzzle") | The whole game is reading the customer: plain orders, vague ones, jokes, "the usual"; the pizza is judged against what they *meant*; a wrong pizza means no payment and a face | Already Cook's spine (section 3: "the order is the recipe"). Borrow the **customer's reaction at serve** as the review's first beat: the face, one line in Kutchi, then the badges. And its "the usual" for the open kitchen's regulars (people memory, already in the tastes data) |
| **Papa's Pizzeria / Papa's games** | The **order ticket** hangs at the top and is the master through every station (build, bake, cut); the ticket's rows are checked one by one at the end with a percentage per station | The instruction card as the master (UX §13) and the auto-tick (§11); the per-row "they asked / you did" review already exists. Borrow the **ticket travelling with you**: the same card, shrunk, through prepare, cook and serve, not a new card per station |
| **Cooking Mama: Cuisine!** | Each gesture is a real cooking gesture (slice, stir, flip, pour) with a **timing bar and a green window**, a big verdict stamp ("Perfect!"), and short rounds. Reviews knock it for mini-games that aren't relevant to the dish and for repetition | The ring-with-a-green-window (boil, tawa, grill, fry) and the verdict words are this. Its criticism is UX §6: **cut what isn't the lesson** (knead goes, Q4) |
| **Overcooked** | Fun from juggling several timers at once; one star is easy, three are hard; a gradual ramp | The juggle is level 4 only (grill, fry's several-at-once, the Maani line's tawa-won't-wait); the three badges make "one star easy, gold hard" explicit |
| **Toca Kitchen 2** | No goals, but the **guests' comic reactions** (sneeze at pepper, steam at chilli, a happy chew) are the reward, and children feed them on purpose to see them | The **serve-stage reaction library** (Q9 item 4): a chilli they said *nar* to gives steam from the ears; a perfect cup gets a slurp and *Shabash!*; too many sugars, a shudder |
| **Sago Mini Diner** (ages 2–5) | A tiny loop, order → recipe book → pantry and fridge → cook → serve → wash up; a delivery out back to restock; surprises to tap | Confirms the pantry as the first stage (UX §7) and the pipeline shape. Borrow the **wash-up as a calm coda** later (maybe-later list) |
| **Dr. Panda Restaurant** | Tap-driven tools (grater, wok, food processor) with a cause-and-effect payoff each; customers order but you may play | The tool sprites wired to the stations (to-do, Wave 6b), each with its own sound |
| **Pok Pok Playroom** | Calm, no timers, no levels, no ads; the child sets the pace | Relaxed mode, the 4 s of quiet before a hint, the "pass me" pause. Level 1 has no clock except the ring on the food |
| **Duolingo ABC / Khan Academy Kids** | "Tap the one you heard" as the base exercise; drag-and-drop for placing; tracing for letters; sessions of a few minutes. Reviews of input-only apps (Lingokids) say children can't *answer* after a year | Tap-the-named-thing is the pantry and every decoy set. The production gap is why Cook needs a speaking moment (Q9 item 9) |
| **Fruit Ninja** (via chop) and **Simon** (via tadka) | Slicing what flies is joy on its own; a spoken sequence from memory is a classic memory game | Already borrowed; kept as Cook's two most distinct games |
| **Bluey: Let's Play!** | Rooms of a familiar house as the menu; activities lifted from moments the child already knows | The world-is-the-menu plan (to-do, platform item 3); the family's own dishes as the moments |

#### Q3. The five questions, station by station

Kutchi lines are the family's where we have them (`docs/language/grammar-notes.md`); grey-italic English in the game until the family gives the rest. Numbers: *hakro/hakri* (by gender), *ba*, *trae*, *char*, *panj*. Scores are 1–5 on each question (do, challenge, fun, instruction, novel), max 25.

**Pantry (fetch): order → prepare.** *Do:* the card shows Nani's list; tap each named thing on the shelf; it flies into the basket; the row ticks. *Challenge:* look-alikes on the shelf (*khun* beside *loon*, *dudh* beside *paani*, *jeeru* beside *rai*); every option is always there, so only the word decides; more things and more look-alikes per level (3, 4, 5, 6). *Fun:* the basket "plop" and bounce; the look-alike wobbling when you hover the wrong one (level 1 only); Nani's *pass me* cameo taking something off the shelf. *Instruction:* *Muke atto de. Ne khun. Ne dudh.* (Mum's frame); the card's rows are the list. *Novel:* nothing on its own (Monsoon's pots-in, Tidy up's gather and Dress up's shelf all reuse it), but it's **deliberately shared and Cook owns `fetch.js`**; it stays because it's the smallest possible first round. Score 4·3·2·5·2 = **16. Keep** (stage 1 of everything).

**Chai tray: order → prepare → cook → serve.** *Do:* tap the jug (water into the pan, one tap to the line), tap the tea among look-alikes, tap the big knob; each person says their cup; tap a cup, tap the milk jug (or don't), tap the sugar bowl once per *khun* (or don't), tap an extra; tap the knob on the green; tap the pan to pour each cup; Done. *Challenge:* three decisions per cup that only the voice gives (*dudh* or *nar dudh*; how many *khun* or *nar khun*; *elchi waari* or *aadu waari* or plain), per person, with the boil ticking on the back burner; level 4 adds *adh / bharelo* (half or full: one tap or two, Q5). *Fun:* the boil-over foam if you forget the knob; the pour's rising pitch; the slurp and *Shabash!* from the person whose cup was right; a cup handed to the wrong face makes them look puzzled. *Instruction:* *Muke chai khape.* then per person *Nana lai. Dudh waari chai. Muke chai me ba khun khape.* (Mum's frames); the cup cards with fixed slots. *Novel:* the **only game where several people each want their own version of one thing**, and the only one with a back-burner clock (the boil) under a listening job. Score 4·5·4·5·5 = **23. Keep.**

**Maani line: prepare → cook → serve.** *Do:* tap a dough bowl (*maani* or *bajr jo maani*), roll with an up-and-down drag until the dashed circle turns green, tap it onto the tawa, tap on the green to flip, tap on the green to puff, it lands on the plate; repeat; Done. *Challenge:* how many of which dough, from the voice (*hakri maani ne ba bajr jo maani*); both bowls always full; the tawa never waits, so roll-then-cook versus roll-all-first is a real choice; level 4 *wadhi / nindhi* (two circles). *Fun:* the puff; the tear if you over-roll; the stack growing on the plate. *Instruction:* *Muke ba maani khape.* One card per maani (dough, and size at level 4). *Novel:* the **production-line decision** (two stations that don't wait for each other) and the only shaping gesture in the game. Score 4·3·4·4·4 = **19. Keep.**

**Mishkaki grill: prepare → cook → serve.** *Do:* thread: tap a piece bowl and the piece slides down the skewer (tap the skewer to take the last one back), four pieces a skewer, as many skewers as they said; "Go to the barbecue"; grill: tap a skewer on the rack to put it on, tap it on the green to turn (twice), tap on the green to lift it to the plate; Done. *Challenge:* which kind and how many (*ba ghos, hakro vegetable*), and from level 3 a mixed skewer in the spoken order (*ghos, ne poi tameto, ne poi dungri…*); the rack has fixed slots, every bowl is out; level 4 juggles threading with grilling. *Fun:* the sizzle and the char marks appearing as it turns; the near miss when a second skewer's ring goes green while you're on the first; the plate reveal. *Instruction:* *Muke mishkaki khape. Ba ghos. Ne hakro vegetable.*; a card per skewer with four dots. *Novel:* **building a thing in a spoken order and then cooking it** (the order is graded on the plate, not while you build) and the first two-phase station with a big button. Score 5·4·4·5·4 = **22. Keep.**

**Chop (ninja): prepare.** *Do:* vegetables fly up; swipe through only the ones Nani named, as many as she said, until the timer ring empties; nothing stops you at the number. *Challenge:* which and how many (*only ba dungri. Ne hakro tameto.*), a red onion among the tomatoes, the mid-round switch at level 2 (*now marcha!*), the last ones becoming decoys; faster throws. *Fun:* the slice itself, the halves flying, the white trail, the timer's last-seconds pop; the "one more!" near miss as the ring runs out. *Instruction:* *only {n} {x}* and *now {x}* are still English placeholders (top of the family list); the card shows the vegetables of the dish. *Novel:* the **only swipe-slicing game in Nani jo Ghar**, and the only one with a switch mid-round. Score 5·4·5·4·5 = **23. Keep.** Fixes: level 1 must be one kind (Q9 item 7); no *Arre re!* on a wrong slice from level 2 (the halves fall grey; the review counts it).

**Tadka: cook.** *Do:* Nani says the spices in order; tap each bowl in that order into the hot oil; tap the pan to tip it into the pot. The heat ring fills between spices: dawdle and it smokes, then burns. *Challenge:* the sequence (*pela jeeru, ne poi rai, ne poi hardar*); look-alike bowls (*jeeru* / *rai*, *loon*); the card shows the spices as words, then dots, then nothing (level 3: Nani's voice from memory, the Simon moment); a shorter burn clock per level. *Fun:* the burst and sizzle as each spice lands; the smoke wisps as a warning; the tip into the pot and the colour change; the burnt-black pan is comic, not punishing. *Instruction:* *Pela {x}. Ne poi {y}.* (Mum's frame, real). *Novel:* a **spoken sequence from memory under a heat clock**; Dress up's queue and Monsoon's day strip reuse the input, but only Cook has the burn. Score 4·5·3·5·4 = **21. Keep.**

**Stir: cook.** *Do:* drag the ladle round its track inside the pot; laps are counted aloud; the speed dial shows tortoise / hare; let go and you're done. *Challenge:* the count (*trae*) and the speed (*aastethi* / *jaldi*), and at level 3 a switch mid-stir (*now jaldi!*, sometimes the same speed again); nothing shows which band is wanted. *Fun:* the swirl tightening as you speed up, the daar sloshing, the spill if you go mad; the counted laps. *Instruction:* *{n} {x}!* with the speed word; the card shows the count as a dot group. *Novel:* the **only game where speed is the answer** and it's heard, not shown. Score 3·4·4·4·5 = **20. Keep.** Fix: the round should end on a Done tap (like every serve), not on letting go for 1.8 s, which children hit by accident (Q9 item 11).

**Chaat (assemble): prepare → serve → review.** *Do:* chop first (the chop game, only what goes in this bowl); then tap toppings into the glass bowl in the spoken order; Done; the customer checks layer by layer from the bottom, ticking each; at the first wrong layer they stop, scoop out from there, say the rest again, and you carry on. *Challenge:* the sequence (*channa, ne poi bataato, ne poi dai…*), the *nar* rows (Nana's *nar marcha*), likes as extras; decoys on the counter. *Fun:* the visible layers in a glass bowl; the scoop-out and recast; the slurp at the end. *Instruction:* *Muke chaat khape. Channa. Ne poi bataato. Nar marcha.* *Novel:* the **customer's layer-by-layer check** is Cook's review mechanic in miniature, the model for every serve stage. Score 4·4·4·5·4 = **21. Keep.**

**Samosa + fry: prepare → cook → serve.** *Do:* fill: tap a filling bowl once per spoon into the mixing bowl (any bowl, decoys too), Done; fold: each pastry takes a scoop; swipe along each of three dashed lines; make as many as they said; fry: tap to drop them in, tap each on its green to lift it; from level 3 Nani's chips are already frying (*lift the samosas, leave the chips*). *Challenge:* the fillings and spoons (*ba keema, ne hakro watana*), the *nar* filling, how many samosas (the tray always holds extras), which to lift. *Fun:* the fold closing into the triangle; the sizzle as they drop; watching three rings at once; the golden stack. *Instruction:* *Muke ba samosa khape. Ne ba keema. Nar dhana.* *Novel:* **make-then-cook-then-pick-out**, the only station where you decide *how many to make* and are graded later, and the only three-gesture station (tap, swipe, tap: three kinds of action, each with one gesture, Q5). Score 4·4·4·4·4 = **20. Keep.**

**Pass me (interrupt): any stage.** *Do:* Nani's voice asks for something (*Muke {x} de*); three look-alike pills in the sidebar; tap one. *Challenge:* any word you've met, weakest first; Busy keeps the pan cooking. *Fun:* the pan boiling over while you help her (Busy). *Instruction:* Mum's frame, real. *Novel:* a spaced-review interrupt; shared by design with Find it's doorway call, Dress up's *pass me the scissors*, Snap's quick shot. **Keep as a modifier**, not a mini-game (not scored).

**Open kitchen: a session shape, not a mini-game.** Customers keep coming, orders lean towards weak words, "Close the kitchen" ends it. Keep as Cook's free-play entry; the review is the day summary. Serving to the right person (*Nana lai*) is its missing decision (Q9 item 5).

**Sub-mechanics that only live inside the stations:** boil (the knob), count (the spoons), add (the tea leaves), roll, tawa, thread, grill, fill, fold, fry. They stay as files; they are not stations of their own in the story.

#### Q4. Scores, the cut, and maybe later

| Station | Do | Challenge | Fun | Instruction | Novel | Total | Verdict |
|---|---|---|---|---|---|---|---|
| Chai tray | 4 | 5 | 4 | 5 | 5 | 23 | Keep |
| Chop | 5 | 4 | 5 | 4 | 5 | 23 | Keep |
| Mishkaki grill | 5 | 4 | 4 | 5 | 4 | 22 | Keep |
| Tadka | 4 | 5 | 3 | 5 | 4 | 21 | Keep |
| Chaat | 4 | 4 | 4 | 5 | 4 | 21 | Keep |
| Stir | 3 | 4 | 4 | 4 | 5 | 20 | Keep |
| Samosa + fry | 4 | 4 | 4 | 4 | 4 | 20 | Keep |
| Maani line | 4 | 3 | 4 | 4 | 4 | 19 | Keep |
| Pantry | 4 | 3 | 2 | 5 | 2 | 16 | Keep (stage 1; shared by design) |
| Knead (standalone) | 2 | 1 | 2 | 1 | 1 | 7 | **Cut** from the lab and the story (hands only; no word; Cooking Mama's "irrelevant mini-game" critique) |
| Roll → Tawa (lab) | 3 | 2 | 3 | 2 | 1 | 11 | **Cut** from the lab list: it's the Maani line's middle, kept only as zone.js's proof |
| Boil, count, add, pour (standalone lab entries) | – | – | – | – | 1 | – | **Cut** as lab entries; they're sub-mechanics of the Chai tray |

Nine kept: three per stage at most in prepare (pantry, chop, thread / fill / roll), six in cook, four in serve. Within the brief's 6–8 per stage.

**Maybe later (one line each):** pipe a jalebi spiral (rhythm and shape; needs the fry); grind and churn (counts); pat a bajra rotlo (a tap-count shaping game); a belt pantry ("Nani's delivery van": the clinic's belt with food nouns, for free play only); the sharp-knife and chai-machine upgrades (pocket-money shop); the wash-up coda (Sago Mini: calm, ungraded, one tap per plate); the end-of-day recall ("what did Ma have?": section 3 item 7); role reversal, you order from Nani (section 3 item 8; the speaking moment in Q9 item 9 is the first step); knead as a hands-only breather inside the Maani line at level 3 (press *trae* times: a count); a garnish station (positions: on top, in the middle) once the family gives the position words.

#### Q5. Controls: one gesture per kind of action, the same at every level

The corrected rule (UX §12): swipe, drag, stir and tap are all fine; within a mini-game the same kind of action always uses the same gesture, and a mini-game's gestures never change between its levels. The audit, kind of action by kind of action:

| Station | Add / pick a thing | Liquids | Shape or work the food | Timing (cook) | Move on | Changed? |
|---|---|---|---|---|---|---|
| Pantry | tap the item | – | – | – | auto | No |
| Chai tray | tap (tea, sugar spoon, extra, cup, knob) | **was press-and-hold (jug, pan); now tap** | – | tap the knob on the green | tap Done | **Yes: pour** |
| Maani line | tap (dough bowl, maani onto the tawa) | – | drag up and down (roll) | tap on the green (flip, puff) | tap Done | No |
| Mishkaki grill | tap (piece bowl, skewer on the rack, skewer to the plate) | – | – | tap on the green (turn, lift) | tap "Go to the barbecue", Done | No; the level-4 juggle keeps the same taps |
| Chop | – | – | swipe (slice) | – | auto (the ring) | No; levels add phases and speed, never a gesture |
| Tadka | tap (spice bowl) | – | – | tap the pan (tip) | auto | No |
| Stir | – | – | drag round the track | – | **let go 1.8 s → tap Done** | **Yes: the end** |
| Chaat | tap (topping) | – | – | – | tap Done | No |
| Samosa + fry | tap (filling spoon, drop in) | – | swipe along a dashed line (fold) | tap on the green (lift) | tap Done | No: three kinds of action, one gesture each |
| Pass me | tap a pill | – | – | – | auto | No |

**The tap pour, exactly.** A tap pours **one measure**: the liquid rises to the next dashed line inside the vessel, with the pour sound and the rising pitch, and stops there by itself (the special jug's "stick at the line" behaviour, now the only behaviour). Water into the pan: one line, one tap. Milk into a cup: one line, one tap; no tap means *nar dudh*. Chai into a cup: two lines, always drawn (the audit's rule: the same lines on every cup); one tap reaches the half line, a second tap the full line. At levels 1–3 nobody asks for an amount and the cup's row ticks at the full line, so the ghost finger teaches "tap, tap" once; at level 4 the cup card has an amount slot (*adh* / *bharelo*) and the second tap is the decision. So **pouring is counting**, the same gesture as the sugar spoons, and it never changes by level. The hand star's "pour to the line" skill goes (a tap can't miss); the hand star at the tray is the knob alone. `pour.js` keeps `hold` only for other modes that still want it (Monsoon's buckets are that mode's call), and gains `tapMeasure`.

#### Q6. Distinctness across modes

Read against the other modes' "Pipeline design" sections. Cook is the mechanics library, so overlap is expected; the question is whether any Cook mini-game is *the same game* as one elsewhere without being deliberately shared.

| Cook mechanic | Reused elsewhere | Distinct enough? |
|---|---|---|
| `fetch` (pantry) | Monsoon S2a pots inside; Tidy up 1a gather (via `whichone`); Dress up 3a the wardrobe shelf; Who did it 2b, in belt mode | Same game by design; Cook owns the file. The clinic's belt and Dress up's rail are the moving-shelf variant (time pressure), which Cook doesn't need: the pantry stays still because it's the first thing a five-year-old does |
| `count` (spoons) | Monsoon S3b drip count and S4d mop; Tidy up 1b and 3b; Find it 5c scales; Who did it 1a and 5a; Snap 6b | Shared by design (the tally rule: never the target) |
| `pour` | Monsoon S4a empty the buckets (press-and-hold, sizes); Dress up 2b "how long?" (stop at the line) | Cook's is now a tap-measure; the others chose hold or drag for their own reasons and each is consistent inside its own game. Fine under the corrected rule |
| `stir` (drag round a track) | Monsoon S4b dry off (a towel on a cat) | Shared input, different answer: only Cook's asks for a *speed* |
| `tadka` sequence input | Dress up 1b first…, then… (a queue); Monsoon S1b the day strip | Shared by design; only Cook's has the heat clock and the Simon fade |
| `passme` | Find it 3c the doorway; Dress up 3d Big Ma's tools; Snap 3e quick shot | Shared modifier |
| Chai tray | Monsoon S5a chai for everyone (a cameo, loaded not copied); the clinic's chai-with-lemon and turmeric-milk treatments (tadka) | Deliberate cameos of Cook's station; the tray stays Cook's |
| `assemble` serve step (*{person} lai*) | Who did it 5c share them out; Find it 6b give one to Nana; Snap 5b who wants which | The "hand it to the right face" step is shared; Cook's bowl-building with a layer check is Cook's alone |
| Chop (ninja) | Nobody | Unique to Cook |
| Thread → grill | Nobody | Unique to Cook |
| Fill → fold → fry | Nobody | Unique to Cook |

Nothing needs merging or cutting for distinctness. One note for the other modes' builders: the clinic's "does it hurt here?" yes/no and Find it's "he reads it back" are review mechanics that Cook's serve stage should adopt in the same shape (the customer names what they got), so the review feels like one system across modes.

#### Q7. Level-1 walkthroughs (one per stage's first game)

**Order + prepare: Nani's pantry list (the first ever round).** The kitchen, straight on; the shelves hold eight things, three of them Nani's (say *atto*, *khun*, *dudh*), the rest look-alikes and strangers (*loon* beside the *khun*, *paani* beside the *dudh*). The request card comes up with Nani's face: *Muke atto de. Ne khun. Ne dudh.*, each row lighting as it's said; a tap, and it shrinks to the left. Everything dims but the *atto*; a ghost finger taps it once; the child taps it; it flies into the basket with a plop and the row ticks. The shelf lights up again; the child finds *khun* (the *loon* beside it wobbles if hovered, level 1 only), taps, tick; then *dudh*, tick. Nani: *Shabash!* The end screen: the stopwatch, three green slots, gold "0 hints", then the three words to hear again.

**Prepare: thread one skewer.** The threading board, straight down; a skewer with its handle at the bottom; bowls of *ghos*, *tameto*, *dungri*, *green pepper*. The card: *Muke mishkaki khape. Hakro ghos.*; one skewer card with four empty dots. Ghost finger: tap the *ghos* bowl; a piece slides down the skewer to the bottom with a soft *thk*; the first dot fills. The child taps three more times; the skewer is full and slides to the row beside the board; the card's row ticks. The big button bottom right, *Go to the barbecue*, pulses.

**Cook: grill it.** The grill, straight down; the skewer waits on the rack. Ghost finger: tap it; it lands on the grill with a hiss and a ring appears round it. The ring fills; bubbles of fat, then the green section; the child taps in the green: *Turned!* and char marks; again: the second turn; the ring fills once more; a tap in the green lifts it onto the plate, *Golden!* (a late tap: *Charred!*, the skewer goes dark and comic, and it still goes on the plate; the review counts it). Done. The customer's face: *Shabash!*, then the three badges and the words *mishkaki*, *ghos*, *hakro*.

**Serve: pour one cup (Chai tray, the cups phase).** The tray with one cup and Nana's face on its card: *Nana lai. Dudh waari chai. Muke chai me ba khun khape.* The child taps the cup; the milk jug glows once (ghost finger): tap, the jug slides in, pours to the milk line with a rising note, slides away; the sugar bowl: tap, a spoon flies, *hakro*; tap, *ba*; the *loon* beside it is never touched. The knob on the back burner has gone green: tap, the flame drops, the pan stops bubbling. Tap the pan: it tilts over the cup and pours to the half line; tap again, to the full line, steam. The cup card's rows tick as each is done. Done: Nana lifts the cup, slurps, *Ghan!*

**Review: the end screen.** Page 1: the stopwatch with this round's seconds and *New best!* if so; the accuracy row, one slot per row of the order, green or red; the hints badge, gold at zero. Next. Page 2: the words heard, each with its English and a speaker. Then pocket money on the day summary.

#### Q8. One open decision: live ticks and counts

UX §11 says a card line ticks automatically when that part is done right, at every level. For *which* and *in what order* rows (fetch, tadka, thread, the chaat layers, milk yes/no, which chai) a live tick is safe. For **count rows** (*ba khun*, *trae maani*, *ba dungri*, *ba samosa*, stir *trae*) a tick the moment the tally reaches the number tells the child when to stop, which is the leak section 13 and the audit closed ("counts never shown"). **Default:** a count row ticks when its *item* is finished (the cup is poured, Done is pressed, the chop ring runs out), not when the number is reached; the picture tally in the corner shows what you did. So the tick still comes by itself, just at the end of that thing. Zafar to confirm; if he wants the live tick anyway, the count words drop out of the ear star and the number words are taught by hearing only.

#### Q9. Concrete changes for the next Cook wave (after Wave 6b)

1. **Tap pour as measures** (Q5): one tap per dashed line; chai cups always show both lines; half/full = one or two taps at level 4; the tray's hand star is the knob alone. `pour.js`: `tapMeasure`; keep `hold` for other modes.
2. **Chop level 1 = one kind**: one vegetable, 2–3 to cut, three decoys, slower throws; level 2 two kinds at once; level 3 the switch; level 4 the switch with faster throws (the "each level adds one thing" rule, which Wave 6 didn't reach chop).
3. **No mid-round verdicts from level 2**: chop's *Arre re!* and red burst on a wrong slice, tadka's `oops` on a wrong spice, fetch's and count's *Arre re!*, the pour's *Too much!*: level 1 keeps one gentle correction; from level 2 a wrong pick lands like any other (grey halves, a spoon that just goes in) and the review shows it. Keep the *cooking* cues (smoke, foam, char): they're the world, not a verdict.
4. **The serve reaction library** (Toca Kitchen 2): the customer reacts to their dish before the badges: a slurp and *Ghan!* / *Shabash!* when right; a puzzled look and the row said again when wrong; steam from the ears for a chilli they said *nar* to; a shudder at too many *khun*. Data: `reactions` per mismatch type, one voice line each, in `data/cook.json`.
5. **Serve to the right person everywhere** (*{person} lai*): the open kitchen and every multi-person order hand the plate or cup to a face; kinship words decide. The Chai tray's "order for others by name" (to-do) is the first case.
6. **Cut knead and the standalone lab entries** (roll→tawa, boil, count, add, pour) from the Station lab list; keep the files as sub-mechanics. Lab = the nine stations.
7. **Stir ends on Done**, not on a 1.8 s pause; the hand's "let go" no longer decides anything.
8. **The card travels**: the shrunk request card is the same object through prepare, cook and serve (no fresh card per station), its rows ticking as in Q8's default.
9. **A speaking moment for Cook** (the deep-dive rule; Cook has none): at serve, *Nana lai* said aloud, closed set = the family present (3–4); and role reversal at *pass me*: Nani's hands are full, the child says *Muke {x} de* with the closed set = the bowls on the counter (4–6). Fallback: the pills; a parent's tick earns the voice star. From level 2, once `js/shared/speech.js` lands.
10. **Onboarding scripts per station** (UX §10), now the mechanics are settled: the spotlight order for each of the nine stations, as data next to `coachSteps`.
11. **Words to ask the family first** (they decide the most): *only*, *now* (chop's switch), *vegetable / mixed* (skewer kinds), *chips*, *green pepper*, *samosa / chaat / mishkaki* if they have Kutchi names, *sev, keema, coriander, green chutney*; then *lift / leave*. All already in the Questions for Mum doc.
12. **Build brief note:** phases as the to-do's Wave 7; own files first (`pour.js`, `chop.js`, `stir.js`, `data/cook.json` reactions and levels), then `flow.js` for the travelling card and the serve step, then the shared speech hook.


> from: docs/archive/cook/cook-with-nani-phase-a-design.md § 8. The station library

### 8. The station library (verbs)

A station earns its place only if **it's fun on its own and at least one of its settings comes from Kutchi.**

| Verb | Mini-game | Where the Kutchi comes in |
|---|---|---|
| Fetch (pantry) | Tap the named item | Nouns, counts |
| **Pass me** (interrupt) | Pick from 3 look-alikes | Nouns, review of any word |
| Pour | Hold, let go at the line | Half, full, enough, more |
| Watch and tap | Tap when ready (boil, fry, tawa, grill) | "It's boiling", golden, take it out |
| Count in | Tap N times (spoons, pieces) | Numbers |
| Knead | Press and squash | Numbers |
| Roll | Rolling pin to the circle | Big, small, thin |
| Flip | Spatula at the right moment | Flip it, ready |
| **Chop (ninja)** | Slice what's thrown | "Only X", counts |
| Tadka order | Spices in the spoken order | Sequence |
| Stir | Count and speed | Numbers, slowly, quickly |
| **Assemble / plate** | Layers in the spoken order | Sequence, likes, "no X", who it's for |
| **Fill and fold** | Named fillings in, fold along the lines | Nouns, counts, "no chilli" |
| **Fry (several)** | Drop in, lift each when golden | Counts, which ones |
| **Thread** (skewer) | Items onto a stick in the spoken order | Sequence, colours |
| Garnish | Sprinkle where told | Positions (on top, in the middle) |
| *Later:* pipe (jalebi), grind, churn, pat (bajra rotlo) | Rhythm and shape gestures | Counts, shapes |


> from: docs/archive/cook/cook-with-nani-phase-a-design.md § 9. Dishes

### 9. Dishes (Kutch and East African Khoja kitchens)

**Phase A builds:** chai, maani, daal, plus **chaat bowl**, **samosa** and **mishkaki** (agreed).

| Dish | Verbs |
|---|---|
| Chai | Pour, watch, count |
| Maani / chapati | Knead, roll, flip |
| Daal (or khichdi and kadhi) | Chop, tadka, stir |
| **Chaat bowl / chana bateta** | Assemble in order, garnish |
| Dahi puri / sev puri | Fill, count, garnish |
| **Samosa** | Fill and fold, fry |
| **Mishkaki with chips** | Thread, grill-flip, fry |
| Chips mayai | Fry, pour, flip |
| Mogo with chilli and lemon | Chop, fry, garnish |
| Makai (corn on the cob) | Grill-turn, garnish |
| Mandazi | Roll, cut into N, fry |
| Dabeli | Fill and assemble (bazaar chapter) |
| Falooda | Assemble in layers |
| Jalebi | Pipe a spiral, fry, soak |
| Sheer khurma (Eid) | Pour, stir, garnish |
| Biryani / pilau | Layer, stir (feast days) |


> from: docs/archive/cook/cook-with-nani-phase-a-design.md § 12b. What's built now

### 12b. What's built now (after Waves 1–3, checked in Wave 4, 25 Sept 2026)

The Phase A list above is the first build. Since then the stations have become building blocks, and the story dishes run on combined stations:

- **Building blocks.** Each verb is one mechanic file (`js/cook/mechanics/`). It can run on its own or inside a zone of a combined station (`js/cook/zone.js`). Difficulty levels are data (`data.mechanics.<id>.levels`; a combined station's in `data/stations/<id>.json`). Recipes are wholly data: slots, what's said, the ladder, the steps.
- **Order ladder** on the order card: speaker · word or "•••" · 👁 · translate per row. One dot per item, never per unit. A dashed line means a sequence, and *ne poi* is said for it. "No X" rows are placed at random. A person's rows carry their face (the Chai tray). Hidden words next to each other share one "•••".
- **Help costs.** Being shown the answer costs the ear star: the hesitation glow, the highlight after two misses, 👁, translate (including "pass me"). Hearing it again costs the no-help star. Busy help drains the patience ring.
- **Result card:** stars on the left; on the right, "they asked / you did" in Kutchi pills and one "next time" tip per missed star.
- **Combined stations** (one screen, several zones):
  - **Chai tray** (chai, all levels): water, tea, then light the knob on the back burner. Each person says their cup (milk or not, sugars or none, and from level 3 an extra and half or full). Milk jug, sugar bowl and salt are there for every cup. The knob must be turned down on the green. Pour each cup to a line, then the tick. Graded per cup, per person, with a recast from that person.
  - **Maani line** (maani): two dough bowls (maani, bajr jo maani) → chakla → tawa (two tawas from level 2, big/small from level 3). How many of each is spoken. You press the tick.
  - **Mishkaki grill** (mishkaki): the threading board feeds a rack. Each skewer has its own ring on the grill: turn it twice, then lift it. The chips basket is always offered. The plate is graded per kind and count.
  - Roll → Tawa: the lab's proof of zones.
- **Keepers, polished:** the chaat glass bowl (visible layers; the customer checks layer by layer); chop with a mid-round switch, look-alikes, graded afterwards (rounds in random order since Wave 4); tadka burns if you're slow and hides the order at higher levels; samosa fill (spoons per filling) → fold as many as you decide → fry (the tray holds extra; "lift the samosas, leave the chips" at level 3); stir on a track with a fixed speed dial.
- **Pass me** in the sidebar (never over the game), in the pantry (never a word from the order) and at the slower stations.
- **Open kitchen** is free cooking: customers keep coming until you close it.
- **The pantry (fetch)** is now only in the Station lab: no story recipe fetches any more (each station lays out what it needs, decoys included).
- **Tests:** `build/test_cook.py` plays every station at levels 1–3 (`--lab`, `--level`), combined stations, the story days (`--days`, `--canvas` for speed), the open kitchen and the order model (`--orders`), at six screen sizes.


> from: docs/archive/design-v1/game-modes-v2.md § Cook with Nani: stations first, recipes second

### 7. Cook with Nani: stations first, recipes second (23 Sept 2026)

**Principle:** pick the stations that are proven fun and cheap to build, then choose recipes that use them. Every station is a **single-finger gesture** (it works with a mouse too) and ties to language (a count, a sequence or a named item). **Main reference:** *Cooking Mama*, where every cooking step is its own mini-game.

| Station | Gesture | Why it's fun | Language | Build |
|---|---|---|---|---|
| **Pantry fetch** | Tap the named ingredient | The core listening moment | Nouns, numbers | Easy (exists) |
| **Chop** | Swipe across the item; it splits into pieces | *Fruit Ninja* satisfaction; counting | "Cut it into 4" (numbers) | Easy: split the sprite along the swipe |
| **Knead** | Press repeatedly, or drag back and forth | Squishy, tactile | "Knead" (verb) | Easy: squash-and-stretch tween |
| **Roll** (chapati) | Drag outwards from the centre until the circle fills the guide | Visible growth; aiming for "just right" | "Roll", "thin", "round" | Easy: scale the circle with drag distance |
| **Tawa flip / puff** | Watch the colour change; tap to flip at the right moment; the roti puffs up | Timing tension and a magical payoff | "Flip it", "it's ready" | Medium: a colour gradient plus a puff tween |
| **Tadka (spices in order)** | Drag spices into the hot oil **in the order Nani said**; it sizzles | Memory tension; sizzle sound; the Simon element | "First jeeru, then rai, then hing" (sequence) | Easy |
| **Stir / grind** | Circle drag the named number of times | Rhythmic, calming | Numbers; "stir" or "grind" | Easy |
| **Pour** | Hold to pour; release at the line | Precision tension | Measures: "half a cup", "to the line" | Easy |
| **Boil watch** | Tap before it boils over (the classic chai moment) | Real tension, funny failure (a harmless foam overflow) | "It's boiling!" | Easy |
| **Churn** (chaas, butter) | Drag back and forth quickly | Energetic; very Kutch | Verb, counting | Easy |
| **Plate / thali** | Place each part where told | Satisfying finish; positions | "Daal in the bowl, rotis on the left" | Easy (the Tidy-up mechanic) |

**Recipes these stations make:**
- **Chai:** pour water, boil watch, spoons of sugar (count), pour milk, pour into cups.
- **Chapati / rotli:** knead, roll, tawa flip and puff.
- **Daal:** wash, chop onion, tadka sequence, stir.
- **Kachumber / fruit chaat:** wash, chop (count), sprinkle, plate.
- **Chaas (buttermilk):** pour, churn, spice.

**Kutch specialities for later:**
- **Bajra rotlo:** pat between the palms (alternate taps), then clay tawa.
- **Khichdi and kadhi:** rinse, pour, tadka, stir.
- **Dabeli:** a famous Kutchi street food, perfect for a later bazaar food-stall chapter.

**Prototype set:** **chai, chapati and daal.** Together they cover pour, boil watch, count, knead, roll, flip, chop and the tadka sequence: the eight most distinct gestures. Drop the fruit plate from the prototype; it's only "chop".


> from: docs/archive/design-v1/game-modes-fun-analysis.md § Revised lineup: Cook in detail (the Good Pizza loop as Cook's model)

### 5. Revised lineup: 3 core games plus a meta layer, each with its own verb

| Place | Game | Core verb | Built on | Why it's different from the others |
|---|---|---|---|---|
| **Nani's kitchen** | **Cook with Nani** | *Build* (wash, chop, stir, pour, roll, time the cook) | *Good Pizza, Great Pizza* + Papa's stations + Simon sequences | Tactile cooking; riddle orders; recipes learned as sequences |
| **The bazaar** | **Bazaar hunt** | *Search* (scan a busy scene, tap to find) + count out coins | Hidden object | Scanning, combos, and a scene that changes with modifiers |
| **The house** | **Get the house ready** | *Arrange* (place things where told; lay the dastarkhwan; hang decorations) | *Unpacking* / sorting satisfaction | Calm, satisfying order-making; positions and colours |
| **Everywhere** | **Nani's house (meta)** | *Decorate and upgrade* | Tycoon-lite, *Animal Crossing* home | Coins from every game; the place visibly grows |
| **Daily** | **Nani's word of the day** | Listen and pick | *Wordle* | A 1-minute daily habit and streak |

**Dropped:** stall rush (it duplicated the kitchen), match-3 and block puzzles (the language isn't needed), Guess Who and detective (content-heavy, low replay), and rhythm (later, as a toy for little ones).

#### Cook with Nani, in detail (the flagship)

**A "service" (one round, about 3 minutes):**
1. **A family member comes in and asks in Kutchi.** Early orders are literal: "Two rotis and daal." Later they're **riddles**:
   - "Nana's chai, the way he likes it" (you remember: no sugar);
   - "Something sweet, but not mango";
   - "Enough rotis for everyone at the table" (count the people).
2. **Collect ingredients** from the pantry shelves by name (listening).
3. **Prepare at stations,** each a small tactile verb: *scrub* to wash (rub), *chop* (swipe the number of times Nani says), *roll* roti (drag outwards), *stir* (circle), *pour* (hold and release at the line), *cook* (tap to stop in the green zone).
4. **Recipe sequences (Simon):** the first time, Nani demonstrates each step and says it. In later services she only *says* the steps, and you recreate the order. Mastered recipes can be cooked from memory for a bonus.
5. **Serve.** A character reaction, then a **grade per step** plus a tip. A total for the day, and **stars**.
6. **Between services:** spend coins on new recipes (chai → roti → daal → khichdi → Eid sweets), utensils and kitchen upgrades. New recipes bring new verbs and new words.

**Settings:**
- **Relaxed:** no timer; customers wait forever. Suits 4–6 year olds.
- **Busy:** gentle patience meters; more time for new words.

**Variety without new engines:**
- **Customers:** each family member has fixed tastes.
- **Events:** the Eid rush, guests arriving, a power cut (cooking by lantern light).
- **Recipes:** each new recipe changes which stations you use.

**Language it trains:** food, quantities, cooking verbs, sequence words (first, then), preferences (likes, doesn't like), kinship, comparisons (more, less, sweeter).

---


> from: docs/archive/handovers/plans-remaining-2026-09-29.md § A3 The pantry (fetch) and "pass me"

### A3. The pantry (fetch) and "pass me"
**Now:** pantry v2 (shelves, fridge, tray with outlined spaces) is in, waiting on the final background render.
**Proposal:** a polish pass only, once the render lands:
- the shelf/fridge background at full resolution;
- the containers on consistent shelf lines;
- the tray spaces;
- the glow-and-bounce highlight;
- the word chips as on the shelf band;
- the pantry headline "bring me these for {dish}" (to record, Round 4 N1–N2).

"Pass me" uses the same shelf band and chips.


> from: docs/archive/handovers/plans-remaining-2026-09-29.md § A4 Cross-station, Cook-wide

### A4. Cross-station, Cook-wide
- **One station-select screen** (All stations) in the design system: a grid of station cards with the dish picture, the best time and stars. It needs a look.
- **A "day" flow** (Cook's run of orders) with the shared end pop-up between stations.
- **The Cook title and opening screen:** parked by Zafar ("do later").

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
- **Ingredients:** stations where you pick from a supply (the hob, chai) use the bottom strip of front-on containers. Stations where the items are part of the scene (the mishkaki tray, rolling) keep them in the scene. The rule is consistency within each station.
- **People behind the counter** use the character art of them leaning on the counter, or with an arm on it (the `char-*-counter` art already made), at least when they're sitting or waiting. No floating cut-out heads.
- **The Done button (every mode): decide** between:
  - (A) the new gold-metal tick art on a round cream button, the same tick as the end-of-round screen; recommended;
  - (B) a brass service bell for Cook ("order's ready!", with a ding), plus A everywhere else;
  - (C) a big gold arrow.
- **The opening game screen** is weak; that's parked until later (Zafar).



## Part 4. Dishes (Round 2 questions for Mum)


> from: docs/language/mum-questions/Questions for Mum (Round 2 — Cooking).md § Round 2, Part 1: Which dishes?

### Part 1: Which dishes?

These are the dishes we'd like to put in the game. They mix Kutch cooking and the East African Khoja food we grew up with. For each one:
- Is it right for our family?
- What do you call it?
- What would you add, remove or change?

| Dish | What the player does in the game |
|---|---|
| Chai | Pours water and milk, watches it boil, adds sugar, pours into cups |
| Maani / rotli / chapati | Kneads, rolls out, cooks on the tawa, flips, watches it puff |
| Daal | Chops onion, does the tadka (spices into hot oil in order), stirs |
| **Chaat bowl / chana bateta** | Builds the bowl in the order the person asks: chickpeas, potato, yoghurt, tamarind chutney, onion, coriander, sev… |
| **Samosa** | Puts the filling in the middle of the pastry, folds the triangle, fries until golden |
| **Mishkaki with chips** | Threads meat and vegetables onto skewers in order, grills and turns them, fries the chips |
| Chips mayai | Fries chips, pours the egg over, flips |
| Mogo | Cuts cassava, fries it, adds chilli and lemon |
| Makai (corn on the cob) | Grills and turns it, rubs on chilli and lemon |
| Mandazi | Rolls the dough, cuts it into pieces, fries |
| Dahi puri / sev puri | Fills the puris, counts the spoons of yoghurt, adds toppings |
| Dabeli | Fills the bun (for the bazaar part of the game) |
| Falooda | Builds the glass in layers |
| Jalebi | Pipes the spiral, fries, soaks in syrup |
| Sheer khurma | For Eid: pours, stirs, adds the nuts |
| Biryani / pilau | For a big family feast |

**Questions:**
1. Which of these does Nani really make? Which are more Kenya or Tanzania, and which are more Kutch?
2. Anything missing that you'd expect in Nani's kitchen?
3. What's each dish called at home?



## Part 5. Kutchi audit: open items


> from: docs/archive/cook/cook-with-nani-kutchi-audit.md § After Wave 3: what still leaks

#### What still leaks

| Where | Leak | Severity | Fix | Owner |
|---|---|---|---|---|
| **English placeholder decision words** (every station that uses them) | The words that carry the decision are still English, shown as grey text and spoken in English. English placeholders are never dotted out, so the card always shows them: *no* (every "no X" row), *slowly / quickly* (stir), *half / full* (Chai tray, level 3), *big / small* (Maani line, level 3), *vegetable / mixed* (skewer kinds), *only / now* (chop: the noun and number are Kutchi), *lift / leave* (fry, level 3), and the nouns *chips, sev, coriander, tamarind / green chutney, mince, green pepper*. An English speaker reads these decisions without knowing any Kutchi | **High** (for these decisions) | The family's words. Highest value first: **"no / without"**, then *slowly, quickly, half, full, big, small, vegetable, mixed*. They drop in as data (`data.lines.no`, the `ph-*` words); no code change | Family (Round 2 words) |
| **Chai tray: cups and who** | Only the people ordering get a cup, and each one speaks with their own face bobbing. So how many cups, and whose they are, is given. Kinship words decide nothing | Medium | Put every family cup on the tray (spares get nothing). The customer orders for others by name ("Nana ne Ma maate…"), so the kinship word says which cups to fill. Needs a frame for "for" (the English placeholder `forwho` exists) and a design pass | Orchestrator (next Chai tray pass) |
| **Label speakers at word stage 2** | The card shows the word as text and the shelf labels are speaker-only, and tapping them is free. So you can play the row, then tap labels until one sounds the same (matching sounds) | Medium | As planned: stage 2 is teaching. Consider limiting free label taps per step to 2 | Later |
| **Serving: who it's for** (story, quick order, open kitchen) | Every dish goes to the one customer automatically. Only the Chai tray checks the person | Medium | In the open kitchen, sometimes two plates wait and "this is for Nana" decides | Orchestrator |
| **Tastes as a bias** | Guessing a person's usual (Nana: milk, 3 sugars) gets a level-1 cup completely right about half the time | Medium (by design) | Fine at 0.5. Lower `tasteChance` if playtests show guessing | Data |
| **Chaat** | Chickpeas and potato are both in every bowl, and one of them is always first | Low | Let the base be one of them, or both | Data |
| **Chai: tea leaves** | Always *chai* (among cumin and mustard look-alikes) | Low | Masala chai later | Later |
| **Maani: ghee** | Not built | Low | Brush or don't, from level 2 | Later |
| **"Enough!" at the asked line** (pour, the Chai tray) | Said while the word is new (stage ≤ 2 by level), so it tells you when to stop | Low (intended: teaching) | — | — |
| **Chop: the test slice** | The first correct slice bursts white and bumps the tally, so after one slice you know which one it is. A wrong guess costs the ear star, so guessing doesn't pay | Low | — | — |
| **Timing stations** (boil, tawa, fry, grill turns) | Hands only | Low (by design) | From stage 3, Nani's cue a moment early | Later |


> from: docs/archive/cook/cook-with-nani-kutchi-audit.md § After Wave 6 (Zafar's grill playtest, 26 Sept 2026)

### After Wave 6 (Zafar's grill playtest, 26 Sept 2026)

Wave 6 changed how the order is shown and helped (docs/design-language/ux-principles.md). The same question for each change:

| Change | Can you win without the Kutchi? | Severity |
|---|---|---|
| **One card per skewer / per maani** (one card per unit, a fixed shape) | The number of cards shows how many of each kind, so the count no longer has to be heard (the number word is still said, and read along). The kind on each card is still a word (dots once known), and a mixed skewer's pieces are words in order. This is the trade Zafar asked for: the fixed shape makes *which kind* and *which order* the thing to listen for | **Medium** (counts only, for skewers and maani) |
| **One card per cup, fixed slots** (milk, sugar, which chai; half/full at level 4) | The slot says which question a row answers, never the answer: *dudh* or *nar dudh*, the number of *khun*, which chai are words (dots once known). A plain chai shows an empty slot, as its missing row did before | None new |
| **Per-row speaker, 👁 and A/En removed; one light bulb** | The bulb shows English for 5/3/2/1 s by level. For rows still to do that's the answer, so it costs the ear star (as A/En did); after the order it's free | None (same cost as before, one way in) |
| **One speaker per card, read-along** | Hearing it again once the words are dots costs the no-help star, as the row speakers did. The highlight lights the part being said, never a thing in the picture | None |
| **The grill in two phases** | The rack still has fixed slots, every bowl is out, the plate is graded at the tick. You thread all the skewers before seeing the grill; the count is graded on the plate, not on the board | None |
| **Chips off the grill** | One decision fewer at the grill (chips vs none). Chips stay in samosa + fry | — |
| **Level 1 = the smallest round** | One skewer (meat or veg), one cup (their milk, sugar and chai are still said), one maani (which dough: the two bowls are always out), three pantry things among a shelf of look-alikes | None: every level-1 round still turns on a word |
| **First-time overlay** (dim, spotlight, ghost finger) | It spotlights the next thing to do, which can be the answer. It runs only the first time at a station, which in the story is always the dish's guided first order (Nani glows the answer then anyway); in the Station lab only with "Nani helps" ticked | None in scored play |
| **The family's words** (daar, ba, hakro/hakri, wadho/wadhi, watana, waari, lai, Muke {x} de, pela … ne poi) | Real Kutchi replaces two English placeholders' jobs: *first … and then* is now said (*pela … ne poi*), and "one" agrees with its noun, a small extra listening cue | Better |

**Still open (unchanged):** the English placeholder decision words (*vegetable, mixed, half, full, chips, green pepper…*), the Chai tray's who-gets-a-cup (the "for" frame *{person} lai* now exists in data and is shown on each cup card; ordering *for* others by name is the next Chai tray pass), serving to the right person.



## Build status (from the Cook build log, 24–25 Sept)


> from: docs/archive/build-logs/cook-with-nani-build-log.md § §1 Decisions taken overnight

#### 1. Decisions taken overnight

Zafar was asked with a 5-minute deadline. He answered the words question; the rest are defaults.

| Decision | Taken | Why |
|---|---|---|
| Missing Kutchi words | *paani, chai, dudh, **khun**, atto, daal, maani*, confirmed by Zafar ("khun not khand") | Everything else comes from the content master, recombined only in existing frames |
| Cooking verbs | **No Kutchi.** Actions are shown (glow, a see-through fingertip, a short English how-to line in the sidebar) | Never invent Kutchi. Listed for the family in `docs/archive/language/cook-with-nani-words.md` |
| Audio | First build: recordings only, no computer voice. **Changed at Zafar's request (24 Sept, morning): a Gujarati TTS placeholder voice for every line, at about half speed** (gTTS slow mode plus ffmpeg at 0.75×, roughly 2 syllables a second) | He found the earlier placeholder "crazy fast". Family recordings replace the files one for one |
| Shop | First build: 4 counter slots. **Changed at Zafar's request: one upgrade per station, bought with coins; money is the choice** (the whole shop is about 375 coins, the story pays about 175) | His suggestion; clearer for children than slots |
| Hub link | Added, then **removed**: the fruit errand is left exactly as it was | "Create a new page for now, leave the current game" |
| Where it lives | A separate page, `cook.html`, linked from the hub. The fruit errand is untouched | Safe to throw away; nothing else breaks |
| Customers | Nana, Ma (the player's mum), Ali (cousin, tall and lanky). Nani's look as generated | Pending family check (words doc, question 5) |
| Stars, coins, tips | Yes: 1 to 3 stars per order, coins and tips, a perfect-order combo | Zafar now leans towards these; nothing is ever lost |
| Streaks | **No streak that can break.** Instead, "You've cooked with Nani on N days", a count that only goes up | Keeps the habit hook without the guilt |
| Timers | Relaxed (default, no timer) or Busy (a patience bar; speed only adds tips; nobody leaves) | Fun analysis section 5 |
| Talking animation | Swap to the character's open-mouth frame plus a gentle bob. Pasting mouths between poses smudged, because the faces differ | LivePortrait frames replace this later |


> from: docs/archive/build-logs/cook-with-nani-build-log.md § §2 What's in the build

#### 2. What's in the build

**Session shape.** Title, then a day (3 or 4 customers, about 5 to 8 minutes), then an end-of-day summary, then Nani's shop, then back to the title. One day is one session (Game Design: "one errand is one session").

**Days.**

| Day | Story | New words | New mechanic |
|---|---|---|---|
| 1 Chai for Nana | Nani greets you and makes her own chai **with you doing each step as she names it** (the demo, taught by doing, not a cutscene). Then Nana orders and you make it **from memory** | paani, chai, dudh, khun | pour, boil watch, count, pour to the line |
| 2 Chai and maani | Ma wants hers with elchi; Ali wants 2 maani (Nani shows you once) | elchi, atto, maani | knead, roll, tawa flip and puff, "how many?" |
| 3 Daal for dinner | Nani teaches daal; the tadka spices go in the order she says | daal, dungri, jeeru, rai | chop, tadka sequence (Simon), stir N times; you answer "Achija" too |
| 4 The usual, please | Nana just says *Muke chai khape*: you must remember he takes 3 sugars. Ma adds tameto | hardar, marcha, tameto | the riddle order |
| 5 Eid lunch | Everyone, bigger orders, the finale (family together, a quilt patch) | all | everything |
| Free cooking / Quick order | Generated orders that lean towards the player's weakest words | review | endless |

**Stations** (every one a single-finger gesture):
- pantry fetch (tap)
- pour to the line (hold and release)
- boil watch (tap in the band)
- sugar count (tap N times)
- knead (tap or rub)
- roll (drag outwards to the circle)
- tawa flip and puff (tap in the band, twice)
- chop (swipe across)
- tadka in order (tap in sequence)
- stir N times (circle)

**Teaching.**
- **Guided** the first time for each recipe: Nani names each thing, it glows, and a fingertip shows the gesture.
- **From memory** afterwards: no names. Help comes only if you hesitate. The delay is the word's hint delay (4 s for a new word, up to 12 s for a known one): first Nani names it, then it glows.
- Two misses on a word drop it a stage.

**Grading.**
- **Listening (50%):** did you fetch, add and count what was asked?
- **Recipe memory (20%):** right step, right time.
- **Hands (30%):** pour to the line, flip on time.

When a count or an extra is wrong, Nani says "Arre re!" and **the customer says the right Kutchi back** (a recast). That is the teaching moment, not a buzzer.

**Shop.** One upgrade per station, bought with coins (see section 8 for each station's upgrade and what the real one could be). The whole shop costs about 375 coins and the story pays about 175, so you choose. Every upgrade does a physical job, never the listening. Sugar counting deliberately has no upgrade: the counting *is* the Kutchi.

**Recipe book** (the notebook-lite): each learned recipe as a Kutchi sequence (*paani → chai → boil → dudh → khun → pour*), how each family member likes it, and every word met, with stage dots.


> from: docs/archive/build-logs/cook-with-nani-build-log.md § §8 Station upgrades: in the build now, and what the real upgrade could be (also in progression-and-scoring.md)

#### 8. Station upgrades: in the build now, and what the real upgrade could be

The prototype shows most upgrades as a gilded "special" version of the ordinary prop (gold tint and a twinkle), because there's no art for the real thing yet. The right-hand column is what each one should become.

| Station | In the build (price) | What it does now | Real upgrade to design and draw |
|---|---|---|---|
| Pantry fetch | Special basket (30) | Items fly in twice as fast; +2 coins per order | **A two-basket trolley**: fetch for two orders in one trip. It pays off in Busy mode, where customers queue |
| Pouring (water, milk) | Special jug (35) | Pouring stops at the line by itself | **A measuring jug with marked lines** (a quarter, a half, full). Nani then names the mark in Kutchi, which turns the upgrade into new vocabulary |
| Boil watch | Chai machine (60) | Boils and pours chai for you | Keep the **brass chai machine**, with a cheaper first tier: **a milk-watcher disc** that rattles just before the pan boils over (the window gets wider rather than disappearing) |
| Sugar count | none | — | **Deliberately none.** Counting the spoons is the listening test |
| Kneading | Special atto bowl (40) | Kneads the dough for you | **An atta-kneading machine** |
| Rolling | Special rolling pin (30) | Rolls twice as fast; never too big | **A tapered belan**, then a **chapati press** that makes a perfect circle in one push |
| Tawa | Special tawa (40) | Flip window twice as wide | **A heavy cast-iron tawa**, then a **roti jali** (mesh) for a guaranteed puff |
| Chopping | Special knife (25); Ali helps (15 + 5 a day) | 2 swipes instead of 4; Ali chops for you | **A sharp chef's knife**, then a **pull-cord vegetable chopper**. Helpers become **family staff with a daily wage** (tycoon-style), each with a personality |
| Tadka | Special tadka pan (30) | Tips itself into the daal (you still add the spices in Nani's order) | **A long-handled tadka ladle** that pours straight into the pot. Later, a **masala dabba** on the counter, as décor only: it must never open the right spice for you, because that would do the listening |
| Stirring | Special pot (30) | Small, wobbly circles count | **A long wooden ladle (doi)**; later a **pressure cooker whose whistles you count** (a new counting mini-game) |
| Serving | Special thali (40) | +3 coins tip per order | **A brass thali with katoris**: better presentation, bigger tips, and the plating mini-game ("daal in the bowl, maani on the left") |

**Design rule kept:** no upgrade touches the Kutchi. Fetching the right thing, the counts, the tadka order and "the usual" are always the player's job.

