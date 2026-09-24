# Cook with Nani: to-do list

**Updated:** 24 Sept 2026. Claude ticks things off here as each wave lands, so this file is always the current status.
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

### Wave 2: shared systems ◐
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
- ☐ **Station building blocks:** every mechanic (pour, spoon, boil, roll, flip, thread, grill-turn, …) usable on its own *or* inside a combined station; difficulty settings as data (levels 2+ come from the settings, not new code); a "how to add a recipe" guide

### Wave 3: stations ☐
- ☐ **Mishkaki grill:** skewers point away from you (wooden handle at the bottom, off the grill); the order says how many and which kind (meat, veg, mixed); tap the rack to put one on; each lands at a different time with its own ring; juggle up to 3–4. Threading feeds it
- ☐ **Maani line:** three zones (dough bowls: maani / bajr jo maani → chakla → tawa). Production line vs "roll them all first" is a real decision (the tawa won't wait). The order sets how many of each; big/small as a later level
- ☐ **Chai tray:** cups with family faces; each person's milk, sugars, half/full; the boil on the back burner with a big obvious on/off knob
- ☐ **New pour:** the jug/jar in the tray is an icon that stays put; press and hold it and a pouring jug slides in over the pan, pours while held, goes back on release
- ☐ **Stir:** ladle on a fixed circular track inside the pan; live speed dial with red too-fast/too-slow zones; Nani says slowly/quickly when it applies; laps counted aloud
- ☐ **Polish the keepers:** chaat (bigger bowl, visible layers, customer checks layer by layer), tadka (burns if too slow; ladder hides at later levels, so it's Nani's spoken order from memory), chop (mid-round switch: "now dungri!"), samosa + fry (count, "lift the samosas, leave the chips")
- ☐ **"Pass me" in the pantry** and in the slower stations (a listening break where the hands have little to do)
- ☐ **Free play everywhere:** Cook's open kitchen (customers keep arriving, you close when you like); every future mode gets a free-play entry too

### Wave 4: check ☐
- ☐ "Can you win without the Kutchi?" audit, station by station
- ☐ Persona review from screenshots
- ☐ Tests on all six screen sizes; design doc updated

## After Wave 2 merges
- ☑ Rename Bilal → Ali in `data/cook.json`, code, audio file names and docs (tall, lanky cousin)

## Then
- ☐ Zafar plays **story mode** end to end (plus a child if possible) → Round 3 tuning
- ☐ Family: Round 2 questions (words, recipes, tastes) and recordings
- ☐ Art run for Cook with Nani (hand sheet in many orientations first; the ingredient library is shared with Find it)
- ☐ Next mode: Find it (the bazaar)
