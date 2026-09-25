# Cook with Nani: to-do list

**Updated:** 25 Sept 2026. Claude ticks things off here as each wave lands, so this file is always the current status.
Key: ☐ to do · ◐ in progress · ☑ done (pushed to `claude/funny-fermi-vyrabn`)

## Round 2 (from Zafar's Station lab playtest, 24 Sept)

### Wave 1: bugs and polish ☑
- ☑ Result cards: whole-number percentages, labelled lines ("maani 1: 82%"), plain wording ("stirred 5 times, they asked for 2")
- ☑ Sidebar: no clipping, no horizontal scrollbar, Nani's text wraps normally
- ☑ Item labels never overlap (two rows when there are more than 5 items, bigger props)
- ☑ Skewer "tameto, tameto" was a real order (a duplicate pick); the bug was English placeholders being dotted out, now fixed
- ☑ Count badges show a running tally (digit), never the target
- ☑ Missing label on a look-alike bowl
- ☑ Tadka: arrow and pulse from the small pan to the pot
- ☑ Chop: vegetables thrown higher

### Pre-wave: "can you win without the Kutchi?" audit ☑
- ☑ Audit of the current build and the planned redesigns → `docs/cook-with-nani-kutchi-audit.md`; its fixes feed Waves 2 and 3

### Wave 2: shared systems ☑
- ☑ **Order ladder** on the mission card: dots joined by a dashed line = sequence; items that can go in any order share a dot; "no X" rows; each row has speaker, 👁 tap to reveal and translate (both cost the ear star)
- ☑ Voice links steps with *ne poi* ("and then", draft, Mum to confirm)
- ☑ Sidebar order: order card on top (never moves), Nani's line, then the goal (full the first time, then a small "?")
- ☑ Result card right half: "they asked / you did" in Kutchi + one "next time" tip per missed star
- ☑ Busy mode: visible patience ring round the customer, lightning star drains
- ☑ **"Pass me" moves into the sidebar**: Nani never covers the play area (she covered a boiling pan in Busy mode)
- ☑ Star icons per game mode (Cook: chef's hat for "cooked well"); pocket-money intro icon spacing; title-screen day circles aligned
- ☑ Draft words (not confirmed): dai (yoghurt), channa (chickpeas), ghos (meat), bajr jo maani (millet chapati), ne poi (and then)
- ☑ **Help costs** (audit fix 1): being shown the answer (hesitation glow, the highlight after two misses, 👁, translate, incl. "pass me") costs the ear star; hearing it again costs the no-help star; Busy help drains patience; from word stage 3 counts are silent digits and the target's label speaker counts as help
- ☑ Step chips the same for every order of a dish; "pass me" choices from one look-alike group
- ☑ **Station building blocks:** every mechanic is one file in `js/cook/mechanics/`, usable on its own *or* inside a zone of a combined station (`js/cook/zone.js`, proof: lab-only Roll → Tawa); difficulty levels as data (`data.mechanics.<id>.levels`, Station lab level buttons); recipes wholly as data; grammar and verdict words in data; a "how to add a recipe" guide (`docs/cook-with-nani-recipes-guide.md`)
- ☑ Waves 2a and 2b merged: the order ladder is built from the recipe data's own rows (`R.<id>.ladder` → `Cook.Order.ladder`, one source of truth); *ne poi* and the order frames live in `data.grammar`; step chips are the recipe's `steps` (the same for every order); help costs, pass-me groups and the tadka ladder ticks run in the new mechanic files; hint timers follow game speed
- ☐ Left from Wave 2: the tadka mechanic's `ladder` knob (words / dots / hidden per level) is in the data but not yet read by the mission card (the card goes plain once *ne poi* reaches word stage 3); placeholder voices for the draft words still need a TTS run with network
- ☐ Test note: headless Chromium here draws WebGL in software at 6-11 fps, so timing scores (tawa, fry, grill, stir speed) read low on WebGL runs and a WebGL `--days 7` takes ~40 min; `--canvas` runs at 60 fps (all seven days in ~11 min). Worth a look on a real device that timing windows still feel fair

### Wave 3: stations ◐ (all built; stir, grill, open kitchen live; chai tray, keepers, maani line merging)
- ☑ **Mishkaki grill:** skewers point away from you (wooden handle at the bottom, off the grill); the order says how many and which kind (meat, veg, mixed); tap the rack to put one on; each lands at a different time with its own ring; juggle up to 3–4. Threading feeds it
- ☑ **Maani line:** three zones (dough bowls: maani / bajr jo maani → chakla → tawa). Production line vs "roll them all first" is a real decision (the tawa won't wait). The order sets how many of each; big/small as a later level
- ☑ **Chai tray:** cups with family faces; each person's milk, sugars, half/full; the boil on the back burner with a big obvious on/off knob
- ☑ **New pour:** the jug/jar in the tray is an icon that stays put; press and hold it and a pouring jug slides in over the pan, pours while held, goes back on release
- ☑ **Stir:** ladle on a fixed circular track inside the pan; live speed dial with red too-fast/too-slow zones; Nani says slowly/quickly when it applies; laps counted aloud
- ☑ **Polish the keepers:** chaat (bigger bowl, visible layers, customer checks layer by layer), tadka (burns if too slow; ladder hides at later levels, so it's Nani's spoken order from memory), chop (mid-round switch: "now dungri!"), samosa + fry (count, "lift the samosas, leave the chips")
- ☑ **"Pass me" in the pantry** and in the slower stations (a listening break where the hands have little to do)
- ☑ **Free play everywhere:** Cook's open kitchen (customers keep arriving, you close when you like); every future mode gets a free-play entry too

### Wave 4: check ☑
- ☑ "Can you win without the Kutchi?" audit, station by station → `docs/cook-with-nani-kutchi-audit.md`, "After Wave 3". Every system-level leak is closed; the one High left is **English placeholder decision words** (*no*, *slowly/quickly*, *half/full*, *big/small*, *vegetable/mixed*, *only/now*, *lift/leave*), which needs the family's words
- ☑ Persona review, round 3 → `docs/cook-with-nani-build-log.md` section 9
- ☑ Station lab on all six screen sizes (the iPad portrait lab and the day runs were cut short for Wave 5); design doc sections 12b and 13 updated
- ☑ Fixed: hidden words side by side share one "•••" (the card's shape gave away which row had a number); chop rounds in a random order; on the phone, Nani's line is no longer squeezed under the goal; the Chai tray result card lists what you got right
- ☐ **For Wave 5 (the sidebar and order card redesign):**
  - **iPad (1024×768), High:** the narrow sidebar breaks words letter by letter in the order card ("tr/ae/kh/un", "du/dh" next to a face on the Chai tray; "bataat/o"). The row text needs `word-break: normal` and a minimum width of its longest word, so the buttons wrap instead
  - **Phone (915×375), Medium:** sidebar speaker, translate and 👁 buttons are 22 px (too small for a 5-year-old). The goal box is capped at about 4 lines and cut mid-sentence (it scrolls). A long order card now pushes the goal and the menu buttons below the fold
  - **Phone, Low:** the count badge overlaps the corner of the Maani line's hob and the Chai tray. The ✓ button sits over the Maani line's resting spatula (not a tap target). The roll-tawa plate is cut off by the bottom edge
  - **1280×800, Low:** the Maani line's spatula hand runs past the canvas edge
- ☐ **For the orchestrator (bigger than Wave 4):**
  - Chai tray: put every family cup on the tray and have the customer order for others by name, so kinship words decide which cups (Medium; needs a "for" frame)
  - Serving to the right person in the open kitchen (Medium)
  - Story orders have fixed levels, so level 3 of the grill and the Maani line is lab-only; let the open kitchen raise the level with skill (Zayn)
  - The harness's chop slices miss on the WebGL renderer (0 chopped at every size; the game registers slices, and the harness aims at 6–11 fps). Aim from the canvas renderer or predict further ahead
- ☐ **For the family (Round 2 words), top of the list:** *no / without*, then *slowly, quickly, half, full, big, small, vegetable, mixed*

## After Wave 2 merges
- ☑ Rename Bilal → Ali in `data/cook.json`, code, audio file names and docs (tall, lanky cousin)

## Then
- ☐ Zafar plays **story mode** end to end (plus a child if possible) → Round 3 tuning
- ☐ Family: Round 2 questions (words, recipes, tastes) and recordings
- ☐ Art run for Cook with Nani (hand sheet in many orientations first; the ingredient library is shared with Find it)
- ☐ Next mode: Find it (the bazaar)

## Platform and tech debt (Zafar's questions, 24 Sept evening)

None of these is a blocker; the one real piece of debt is item 1, and everything else builds on it.

1. ☐ **One app, one save (do first, after tonight's test).** Cook with Nani is still a separate page (`cook.html`) with its own `localStorage` save, while the fruit errand uses the shell, profiles and IndexedDB (`js/shell.js`, `js/storage.js`, `js/progress.js`). Move Cook into the shell: one profile, one word-progress store, one coin/star wallet, modes launched from the hub. Cost: about a day. Doing it now avoids migrating player saves later.
2. ☐ **The world map with fog of war.** Places are data (id, map position, unlock rule, which modes they host); a per-profile "visited/unlocked" set; a painted map with a fog layer that clears on first visit. Once item 1 exists: about 1–2 days of code plus the map art (the layers rule applies: fog and each place's icon are separate layers).
3. ☐ **"The world is the menu" instead of story/free-play buttons.** Travel on the map. Story mode = there's always a highlighted next beat ("Nani needs you at the bazaar"); free play = go anywhere you've unlocked and play what's there (the open kitchen is the first example). Needs a story-beat list as data (the fruit errand's `intro_beat`/`outro_beat` and Cook's days are the seeds). About 1–2 days after item 1.
4. ☐ **No tutorial.** Keep the approach: level 1 of every mechanic is the onboarding (ghost finger, one-line goal on first use, then gone). Only change: on first launch, go straight into play with a default profile and ask for a name later, so a new player is playing within seconds.
5. ☐ **Role reversal (the player gives the instruction).** Most of the groundwork is already there: orders are data with slots, grammar frames live in `data.grammar`, and `js/progress.js` already tracks a separate `produce_stage` per word. **To do now, cheaply, so it's easy later:** (a) Find it scenes store *relations* as data (the sweets are *under* the sofa, the cap is *on* the TV), not just coordinates; (b) every frame in `data.grammar` is written so it can be *built* from pills as well as spoken (slots marked). **Later:** a phrase builder (tap pills: "under" + "sofa"), a character who follows the player's instruction (and gets it hilariously wrong if the player does), speaking via a recording the parent can judge (no Kutchi speech recognition exists). About 2–3 days per mode once 5(a) and 5(b) are in place.

## Wave 5: clarity and calm (Zafar's first look at the Wave 3 build, 25 Sept, late)

"Hard to know what to do; lots of information all at once."

- ☐ **Intro card:** when someone orders, a card flashes up in the centre with their face, saying what they want, with the order shown as a sequence. It then shrinks into the sidebar.
- ☐ **Every order is a sequence list:** one line and one dot per item, always (also for looks). "Any order" items are shown subtly, not grouped on a shared dot.
- ☐ **Nani says less:** silence at the start of each station so people can work it out; fewer and later hints; fewer "pass me" moments at level 1.
- ☐ **Sidebar space and readability:** fit the text without eating the play area. Order card first, compact.
- ☐ **Help is just a "?"** that pops out when pressed; the goal text isn't shown permanently.
- ☐ **Remove the English step pills** (Water, Tea, Boil…).
- ☐ **Result card:** replace "they asked / you did" with a **word review**: each Kutchi word used in the order, with its English.
- ☐ **Coins and stars counter** at the top of the sidebar: remove it (show pocket money on the summary and title instead).
- ☐ **Level 1 more varied and fun:** kinds of mishkaki skewer, kinds of tea, several things to chop from the start.
- ☐ **Chop:** a visible countdown timer; level 1 = several items (what goes in the dish), with volume, decoys and time pressure as the game.

## Game mode designs (Zafar, 25 Sept): one design agent per mode

Brief: `docs/modes/MODE-DESIGN-BRIEF.md`. Each agent does research, a mechanic library scored on fun, forcing the Kutchi, distinctness, plot and replay, then three or more persona and Sceptic review loops, a verdict, and a build brief for a future agent.

| Mode | Design doc | Status | Verdict |
|---|---|---|---|
| Cook with Nani | `docs/cook-with-nani-phase-a-design.md` | built, iterating | — |
| Find it | `docs/find-it-design.md` | designed; engine being built | Go |
| Tidy up | `docs/modes/tidy-up-design.md` | ☑ designed | Go with changes |
| Dress up | `docs/modes/dress-up-design.md` | ☑ designed | Go with changes |
| Nani's clinic | `docs/modes/clinic-design.md` | ☑ designed | Go with changes |
| Who did it? | `docs/modes/who-did-it-design.md` | ☑ designed | Go with changes |
| Monsoon rush | `docs/modes/monsoon-rush-design.md` | ◐ designing | |
| Snap | `docs/modes/snap-design.md` | ☑ designed | Go with changes |
