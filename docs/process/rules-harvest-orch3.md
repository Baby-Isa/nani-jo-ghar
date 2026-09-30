# Rules harvest: Orchestration 3 (the chat of 26–29 Sept 2026)

Harvested on 30 Sept 2026 from this chat's full transcript, starting at its first message: every standing rule, preference, working instruction and durable product decision Zafar gave.

- Format: one line each, with roughly when he said it.
- **⟲ REVERSED / SUPERSEDED** marks a rule he later changed; the later version is given alongside.
- **(chat only)** marks a rule that, as far as I know, was never written into a doc.
- Decisions made in other chats after 29 Sept are not included.

## 1. How to work with Zafar
- Before doing anything in a new chat, read these in order: HANDOVER, STATUS-TRACKER, ORCHESTRATOR-HANDOFF, UX-PRINCIPLES §1–14, kutchi-grammar-notes, GAME-IDEAS-TBC. (26 Sept, brief)
- Keep replies short. Tell him briefly what was done. (26 Sept, brief)
- Start a new chat with a plan update: how each item is moving and its next step. (26 Sept)
- **Wait for his answers before starting any work that depends on them.** "This is why you need to wait for my answers before starting please." (28 Sept evening)
- When he says "wait for feedback" or "wait for my next message, don't do anything", do nothing until he writes again. (28 Sept, several times)
- Before calling a mode or station finished, show him its open ideas in `docs/ideas.md`. (26 Sept, brief)
- Fixes should be understood and solved properly the first time, without back-and-forth. Request new art if that's what it takes. "This shouldn't take so much back and forth… just solve please." (28 Sept, tick art)
- Look at screenshots yourself before reporting a visual as done. An interim screenshot that is "terrible" must not reach him as progress. (28 Sept, tick) (chat only as phrased; the principle is in VISUAL-QA.md)
- Talk design questions through with him first ("give me your feedback first, let's talk it through, then create an action plan"). Then queue the build once he says "queue it". (28 Sept, maani)
- When he asks for feedback to be written up, write it the way he would, be thorough, and bring your own ideas too. (29 Sept, chaat)
- When he asks for plans, write them out for his review before queueing anything. (29 Sept)
- Don't lose detail from his long feedback. Capture every point, so he never has to repeat something. (29 Sept, cooking voice note; that request was sent to this chat by mistake, "stop wrong chat")
- When he says "short on tokens" or "1% left", do only what was asked, use the cheapest model that can do it, and do nothing extra. (26–27 Sept)

## 2. Sessions, agents and orchestration
- Delegate builds to remote sessions or background agents, **at most about 4 at once** (more hits the usage limit). (26 Sept, brief)
- If a session dies, relaunch it as a continuation from its branch. (26 Sept, brief)
- Merge finished work, smoke-test, publish to main, update the tracker, then tell him. (26 Sept, brief)
- **Send follow-ups to the same session** (during or after its run) to avoid paying start-up costs again. (28 Sept late)
- Don't relaunch a session that is still running. He stopped a duplicate chai session: "already happening so I stopped the newly spawned one" / "I paused your chai continuation, I think the original was working". (28 Sept)
- **Overnight runs:** be on top of the agents. Have them report to you regularly so you don't need to interrupt them. Finish by the stated time. (29 Sept, 01:00 UK)
- At the end of an overnight run: post a feedback report in the chat, update the tracker (restructure it if needed) and update all handover docs, so he can start a new chat in the morning. (29 Sept)
- Visual work goes to the top model. (28 Sept, "how do we ensure future fixes are done well")
- **Iterate on the laptop viewport only**, and run the full screen matrix just once before the final push, to save time and tokens. (28 Sept evening)

## 3. Git, pushing and the live site
- Work on the given integration branch. `main` is the live GitHub Pages site. (26 Sept, brief)
- Publish to main after smoke tests pass. (26 Sept, brief)
- Run `python3 build/bump_version.py` before every push to main (cache-busting). (standing rule from ORCHESTRATOR-HANDOFF, reaffirmed in the brief)
- Push to main once per session, because GitHub Pages rate-limits builds. (28 Sept, learned)
- Link him to where he can test things: the shell, the labs page and direct lab URLs. Every lab must be linked from `labs.html`. The Conversations lab wasn't, and he noticed. (26–27 Sept)

## 4. Reviews, QA and testing
- Check that the real family voices play in every mode, and that sound works in every lab. He found both missing. (28 Sept)
- A fix must be verified in the live build after a hard refresh ("it's still the old tick… I've hard refreshed several times"). (28 Sept)
- Verify behaviour in every station by playing it through. The pills not ticking in chai was a bug he found by clicking through. (28 Sept evening)
- "We're working to a high bar now". Each pass should aim to be final. (29 Sept, daar)

## 5. Art pipeline and costs
- Missing art comes in one of two ways:
  - **through the OpenAI API** if the job costs under about $2 (medium quality only);
  - **otherwise as a ChatGPT prompt pack** that Claude in Chrome runs.

  (28 Sept late; the medium-only rule is older)
- For Claude in Chrome, give him **one paste block**. Point it at the right places itself (download the references, upload the results); he doesn't want to download things separately. (28 Sept)
- Use existing artwork where it exists before making new art. (29 Sept)
- Fold all uploaded artwork into the game. He expects what he uploads to show up. (26–27 Sept)
- Cut-outs must be clean: no grey fringe or corners, no holes, and matching sizes across states, so nothing shows through. (28 Sept, stopwatch and tick)
- Serve backgrounds (kitchen, pantry) at full resolution and quality. Low-resolution backgrounds next to HD characters are jarring. (28 Sept)
- Pantry items: generate the known items now, and a few extra grids while at it, because doing them in batches is cheap. (28 Sept)

## 6. UX, UI and visual style
- **No English instructions on any pop-up.** If English is needed, the task hasn't been shown clearly enough. (28 Sept)
- **Flat, material-style UI and text** against the 3D art: no 3D text, no bevels, no gradient fills in the UI. (28 Sept evening)
- The UI should look crisp, sharp and premium, to match the quality of the jar art. (28 Sept)
- **Nothing wraps onto two lines** in cards and pills. Shrink the text to fit, keeping it readable. (28 Sept)
- Single-line text next to a character icon is vertically centred on the icon. (28 Sept late)
- **Sidebar and order cards:**
  - **Nani has her own guide box** at the top of the sidebar in every mode: her face and the current instruction, sometimes spoken, sometimes only written. She stays at higher levels. (28 Sept)
  - **Nani's box colour:** ⟲ REVERSED. It went from "cream of her kurta, maybe red" (28 Sept) to "brighter red" (28 Sept evening) to **"red doesn't work, too alarming; a different colour"**. That became **sage green** (28 Sept evening).
  - Tapping Nani's box (or a mute button) mutes or unmutes her voice, and the choice is remembered everywhere. There's also a replay. The translate light bulb moves into her box. (28 Sept)
  - **One white card per person.** A person with several items (e.g. several skewers) gets sub-cards inside their one card. There is no shared card and no repeated summary card at the bottom. (28 Sept evening)
  - A card is the person's face plus a short headline (*Muke chai khape.*) plus item pills. There's no intro line like "Nana lai" and no name (the face is enough). (28 Sept)
  - ⟲ The headline form: at first "short at level 1, the polite form later" was discussed. He then decided **cards use the short form only**, because the long form is heard in conversation. (28 Sept)
  - **The face is the replay button** on every card, including Nani's, with a small speaker badge. There's no separate speaker button. (28 Sept)
  - Items are **self-contained pills**, straight and even, separate from the headline, with no bullets and no scroll bar (the card grows). (28 Sept)
  - The done / next / pending look: done = flat gold outline with a flat gold check; next = light grey; pending = plain white. "Gold is done, grey is next" helps with sequences. There are no empty tick holes on rows that aren't next. (28 Sept)
  - When one person's order is complete, the card may **collapse up** to face + headline + ✓, to save space. It otherwise stays expanded until it's completed. (28 Sept late)
  - **No pips or digits** to show quantity (showing them defeats learning the numbers). Use Kutchi number words. (28 Sept late)
  - Sequence is shown the same way everywhere (skewer, chaat layers, tadka): one generic, consistent style, not a special picture for each. (28 Sept)
  - Avoid numbers for sequence order (they get confused with quantity). (28 Sept)
  - **Collapse rule:** while one card can't be acted on (e.g. Nana's card during Nani's chopping), it collapses. (29 Sept, daar, proposed as a rule)
  - Items without their word at higher levels keep a **speaker-only chip**: "the words go as the levels go up but the speaker button is still needed". (28 Sept evening)
  - An item with no recorded Kutchi shows no English in its pill. Flag it "to record". (28 Sept)
- **The end-of-round pop-up and results screen:**
  - The pictures should tell a child who can't read or count how they did. (28 Sept voice note)
  - **Stopwatch:** just the outline, with the time inside, shown in seconds (in minutes only above 100 s). The personal best shows under it with a crown. Colours:
    - gold and buzzing for a personal best;
    - dim gold for a good time;
    - grey for an average time.

    (28 Sept)
  - **Tick:** a big chunky tick with no circle. It fills as a gauge and turns gold with a shimmer when everything is right; "7/10" shows under it. ⟲ The fill colours changed from green+red to **gold and grey as the theme** (28 Sept midday). Right = gold remained.
  - **Light bulb:** no numbers inside it.
    - no hints used: bright gold, glowing and buzzing;
    - one hint: dimmer, with the filament showing and a slight crack;
    - two: very dim with cracks;
    - three or more: off.

    A small bulb × n sits under it. (28 Sept)
  - No circles behind the stopwatch, tick or bulb; they sit straight in their square boxes. (28 Sept)
  - The text on the pop-up is smaller, thinner, more elegant and centred. (28 Sept)
  - The end pop-up comes first (stopwatch, tick, bulb), then the word review, then the next-step buttons. It replaces the old "all stations / done" pop-up. (28 Sept)
  - **Word review:**
    - wrong words on the left and right words on the right, with a thin vertical divider;
    - both sides top-aligned;
    - the review sits vertically centred on the screen;
    - the borders and shadows are even all the way round.

    ⟲ The colours went from right = green / wrong = red (28 Sept midday), to right = true gold (not yellow) / wrong = red, to flat outlines, gold for right and red for wrong (28 Sept evening).
  - The review cards match the sidebar pills: flat and modern. (28 Sept)
  - Red is allowed for wrong: "red makes you want to fix it". (28 Sept)
  - The speaker buttons on the review are neutral (the card's colour) and keep the colour only in the outline. The solid red speakers were too much. (28 Sept late)
- **Done button (every mode):** option **A**, the gold tick art on a round cream button, replacing the old green tick. (28 Sept)
- **Hands:** ⟲ first "pause the hand fixes" (26 Sept), then **"take the hands out everywhere"** (28 Sept). Maybe they could return near the bottom of the screen (e.g. turning skewers), but out for now. No hands or arms in any station.
- **Characters behind the counter** use the leaning / arm-on-counter art, at least when sitting or waiting. No floating cut-out heads. (28 Sept)
- **Highlight for the next item:** a soft glow and bounce of the item itself, centred on the picture, not an off-centre ring. (28 Sept)
- **Tally:** the pantry tally speaks the count and the item (*hakro …*). At higher levels, or with Nani muted, it stays silent. (28 Sept) ⟲ In the cooking stations he said **"drop the tally"** (29 Sept, chaat); samosa and sekelo followed that.
- **Timers:** flip, turn and boil timers get quicker as the level goes up. (28 Sept, maani)
- **Spacing:** keep consistent breathing space across the cooking stations, with a bit more between the ingredient shelf and the cooking area. (28–29 Sept)
- The Cook title and opening screen are weak, but parked until later. (28 Sept)

## 7. Cook: station decisions
- **General:**
  - Everything is made in the pan, nothing in the cup. (28 Sept)
  - **One burner per order** (per person), up to 4, with no empty burners. (29 Sept, 01:30 UK)
  - Stove, knob and heat-ring assets are consistent across stations (the kitchen kit), all in chai v2's best version. (29 Sept)
- **Ingredients:**
  - Supply-style stations use a **bottom strip of front-on containers** (the pantry jar family).
  - Stations where the items are part of the scene keep them in the scene.
  - Two styles are fine, as long as each is consistent within its station. (28 Sept)
  - Keep **different heights per ingredient type**, as in the pantry. (28 Sept late)
- **Chai:**
  - **Tray:** use a wooden, less eye-catching square tray with four round cut-outs and each person's face under their cut-out. Glasses are top-down chai glasses on the tray. (28 Sept)
  - The hob and tray sit side by side and level; the hob about 5/8 wide and the tray about 3/8, with a clean strip below and nothing overlapping the hob. (28 Sept)
  - Liquids need real art (water, milk, chai states). Remove the fill line: it's a relic. (28 Sept)
  - **Masala dabba:** no (declined). **One pan per person:** yes. "Tap the object = use, tap the chip = hear": yes. (28 Sept evening, "yes, no, yes")
- **Maani:**
  - **One tawa;** the game is rolling while flipping. (29 Sept)
  - Maani puff only slightly (not like puri).
  - Two plates for now.
  - Neat, lined-up layout; everything centred. (28 Sept)
- **Daar:**
  - Nani gives a chopping card, and you chop what's on her card. (29 Sept)
  - The stir count is shown as the simple Kutchi word (e.g. *trae*). (29 Sept)
  - "Chop these" is kept for review. (29 Sept)
  - The onboarding must show that you cut what Nani says. (29 Sept)
- **Chaat:**
  - **No tally.** (29 Sept)
  - **Level 4:** one person, the card stays collapsed, and opening it costs a light bulb. (29 Sept)
- **Serve and taste (all stations):** right → the person says *Shabash* or something age-appropriate. Wrong → he slides it back empty and you start again. (29 Sept)
- **Samosa:** keep the **swipe fold**: "different and should feel satisfying". (29 Sept)
- **Sekelo:**
  - The grill mode is named **Sekelo**. **Mishkaki** means only the square beef or lamb meat cubes. (29 Sept)
  - Don't change the skewer orientation (keep it vertical). (29 Sept)
  - Top-down throughout (said to the sekelo session directly, 29 Sept).
  - *Muke sekelo khape.* is kept for now; Zafar is confirming it with Mum. (29 Sept)
  - The order is shown as "one mixed, two meat" in the headline, with the skewers as sub-groups. "Ba lakri mixed" and "ba lakri gos" sit at the same visual level, and there can be two different mixed skewers in one order. (28 Sept)
- **Pantry:**
  - Straight-on, horizontal shelves at eye level.
  - Items side-on in **clear jars**, each with a label sticker (about a third of the jar) showing the item enlarged:
    - small square jars for spices;
    - tall jars for rice and lentils;
    - a milk carton; a water bottle; a yoghurt tub.

    No generic Indian metal jugs. (28 Sept)
  - A **fridge on the right** (about 1/5 to 2/5 of the width) for meat, chicken, milk and yoghurt. (28 Sept)
  - The **basket becomes a tray**, with spaces for the items. (28 Sept)
- **Pantry and "bring me":** the headline is "bring me these for {dish}" (to be recorded). (28 Sept)

## 8. Kutchi language and voice
- **Never invent Kutchi.** Use only the family's words, or mark placeholders. (26 Sept, brief)
- Use the family's recorded voices in the game, in every mode where they exist. (28 Sept)
- He checks every clip by ear (OK / ??). Only clips marked OK are used. (26 Sept)
- The Word document for Mum lists everything missing and needed, **in priority order**, and **prioritises kitchen-game words and the grammar parts**. (26 and 28 Sept)
- Order numbers: say *hakro* and the count **with** the item ("say both"). (28 Sept)
- Big audio files from his phone: he uploads them as a GitHub release (done 28 Sept). The mum recordings in a public repo were accepted. (28 Sept)

## 9. Game design and story
- **Story structure (28 Sept, locked):**
  - **Nani is the guide**, helping the child learn, grow and explore, not a character bound to the kitchen.
  - **Arcs 2 onwards are "days out with Nani"** (beach, garden, safari, boat…). Each one:
    1. pack the bag (new items and words each time);
    2. cook the packed lunch;
    3. travel by bus, car or motorbike, a window view where you spot or photograph things;
    4. a food stall of three mini-games at the place (e.g. the beach: corn, mishkaki, doughnuts);
    5. one or two games specific to the place (sandcastle, kite).

    Reuse the existing modes wherever possible.
  - **Arc 1 is a Birthday party, not Eid** (Eid comes later, since there's more to explain). The guests each order their own food and you make it; set the table; a sweets hide-and-seek; pack the sweet box; blow out the candles. No greeting at the door, no shoe mountain, **no clothes-making**. (28 Sept)
  - **Clinic volunteering and clothes-making with Big Ma** are **standalone, repeatable arcs**. Nani introduces the clinic one after the first or second day out, with four or five patients per visit. (28 Sept)
  - **Story by the Fire** ends every arc. Nani tells the day's story by the fire as a picture book built from **records of what the child actually did** (not screenshots). You tap to fill in missing words, and do more of this as you progress. It opens with Nani for the emotional connection, then the book opens. (28 Sept)
- **Focus:** lock Cook first (all its art, flow and polish), then the next Arc 1 mode. (28 Sept)
- Leave the clinic until he has played it through and judged whether it's fun; Find it waits too. Other modes stay parked. (29 Sept)
- Open game ideas stay in `docs/ideas.md` until he decides on them. (standing rule)

## 10. Characters, family and culture
- Nani's role is the guide (above). Nana, Ma and Ali each order for themselves. (28 Sept)
- Cousin Ali is a guest at the birthday ("I'm cousin Ali, I'd like maani and saag"). (28 Sept)
- Keep the look generic, not overly "Indian-y": for example, clear jugs rather than metal ones. (28 Sept)
- The family's recordings and voices are the heart of the game. Only clips he has checked are used. (26–28 Sept)

## Reversed or superseded (summary)
| Topic | Earlier | Later (current) |
|---|---|---|
| Nani's box colour | kurta cream / red → brighter red | **sage green** (red too alarming) |
| Hands | pause the fixes | **out everywhere** |
| Card headline | short at level 1, polite later | **short form only** on cards |
| Results tick colours | green + red fill | gold theme; right = gold, wrong = red outline |
| Word-review colours | green / red with shadow | **flat outline: gold right, red wrong** |
| Tally | pantry tally voiced | **dropped in the cooking stations** (chaat onwards) |
| Chai burners | a second burner / "maybe just one" | **one burner per order, up to 4** (maani: one tawa) |
| Grill mode name | Mishkaki | **Sekelo**; mishkaki = the meat cubes only |
| Arc 1 | Eid | **Birthday**; Eid later |
