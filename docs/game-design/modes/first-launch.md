# First launch: onboarding and the story hook (Zafar, 26 Sept; draft)

**Where this stands (5 Oct 2026).** The built story still says "Tomorrow is Eid" (`data/story/first-launch.json`). Arc 1 is the Birthday (H36), so the hook, the lines and the record list below are re-worded for the Birthday before Mum records them (`docs/status.md`, Waiting on Zafar 3). Spoken English then Kutchi is allowed in story mode only; the child never sees English written (E1, G15, decision 12). Missing Kutchi is a grey-italic English placeholder flagged "to record", never invented (G2).

## What Zafar said
1. **Make your character.** Creating the character comes first. Zafar asked for Claude's view.
2. **Or dive straight into a pantry game:** three items, really simple, and really well explained.
3. After that round, **Nani says thank you and sets up the story.** In English it would be: *"Thank you for getting those for me, beta. We have guests coming, because it's Eid tomorrow. Will you stay and help me cook things for dinner?"*
4. **The problem:** the child doesn't understand Kutchi yet and may not be able to read. So how does Nani explain? (Zafar's thought stopped here.)

## Claude's proposal
**The order:**
1. **A 20-second character step:**
   - a parent types the name, or it's skipped;
   - the child taps a face, skin tone and outfit colour (pictures only);
   - they see themselves at Nani's door.

   It's short enough not to delay play, and it makes the pantry round "me helping Nani".
2. **The three-item pantry round.**
   - It's explained by **showing, not telling**: the UX §8 ghost finger does the first item.
   - Nani says each word and **points or looks at the shelf**.
   - The request card shows **pictures next to the words**, so reading isn't needed.
   - There's no failing: the second item gets the ghost finger only if the child hesitates.
3. **The story beat, told as a picture story.** This works without English or reading:
   - **Panel 1:** Nani hugs the child, with a heart; *"Shabash, beta!"* (Kutchi the child can feel without understanding).
   - **Panel 2:** a crescent moon over the house, the calendar page turning to Eid, fairy lights coming on.
   - **Panel 3:** a thought bubble of guests at the door: Nana, Big Ma, the cousins.
   - **Panel 4:** Nani points at the kitchen, where empty pots and a big table wait. She holds out a spoon, and the child taps ✓ to take it.

   Nani speaks every panel in **Kutchi**, in the family's recorded lines.
   - **The light bulb** (UX §4) plays the English line for the parent or an older child, and it's free during story beats.
   - A parent sitting alongside can translate, which suits the "grandparent / parent" play mode.
4. **Into Cook.** The first station is the smallest one (one cup of chai, UX §7).

**Why pictures, not English:**
- The game's promise is that it teaches Kutchi.
- The Eid story is simple enough to read from pictures: a moon, guests, empty pots, "help me?".
- Four panels are what a five-year-old can follow.
- Nani's Kutchi over the pictures is also the child's first "understood without English" moment, which is the whole method.

**Lines to record for this** (to add to the next Questions for Mum):
- "Thank you for getting those for me, beta."
- "Tomorrow is Eid."
- "Guests are coming."
- "Will you help me cook?"
- "Come, let's go to the kitchen."

## Character creation (Zafar, 26 Sept: approved)
**Quick and lightweight for now, with a few simple choices, built to scale** so more can be added later.

**Layout:**
- **The child's character on the left**, large and updating live.
- **The choices on the right**, as picture swatches: no reading needed, big tap targets.

**Choices for now:**
- boy or girl (this picks the figure; hands are parked, H13);
- skin tone (a few warm tones, following the Cast's skin rules);
- hair colour;
- eye colour;
- clothing colours: **colours only, not the clothes themselves** (e.g. top and bottom colours).

**Then:**
- A big ✓ on the right (under the thumb, UX §2).
- The name is optional and typed by a parent (on the player picker), or skipped.

**Built to scale:**
- The options are data (`data/character-options.json`: categories, each with swatches and tint or layer ids).
- The character is drawn from layers: a body base, then tinted hair, eyes and clothing layers.
- A new category (hairstyle, glasses, hijab, outfits, Eid clothes) is a new data entry plus art layers, with no code change.
- The choices are saved in the player's save (`js/shared/save.js`), and the home screen and later the world use them.

**Placeholder art:** simple layered shapes (SVG or greybox) until the ChatGPT art makes a proper layered character.

## Zafar's flow (26 Sept, agreed shape; this replaces Claude's order above)
1. **Make your character** (quick, pictures only).
2. **Arrive at Nani's house.**
3. **Nani asks for the chai things from the pantry:** the three-item pantry round (e.g. chai leaves, milk, sugar).
4. **Back to Nani**, as a separate scene rather than rolling on: "Can you make me chai?" (*Tu muke chai banai dinda?*, already recorded in B40). Nearly every child knows *chai* and *paani*, so this line is the one they'll understand first.
5. **The chai station.** Now the child has seen that the game is fun.
6. **Nani drinks it, happily. Then the story:**
   - she points at the calendar: today, then tomorrow is Eid (a crescent moon);
   - a thought bubble shows the guests coming;
   - the pots are empty: "Oh no, there's no food!";
   - "Can you help me cook?"
7. **The child answers with Yes / No buttons, but only Yes works.** Following the Conversations rule (Zafar, 26 Sept): a tap on No makes the No button **shake**, Nani looks embarrassed, and she **asks again**, until the child taps Yes. The reply is "Yes, I'll help you cook", or simply "Yes". Later this becomes a speaking moment.
8. **The game opens up from there:** the home screen, and Cook's first day.

Zafar's rough Kutchi for the story lines, from memory (**not yet checked with Mum**): "Guests are coming" ≈ *magani acheto / achanto*; "we need to make food" ≈ *pakendro malai no kape*. These spellings are unknown, so they're recorded as heard.

### English first, or Kutchi only?
Zafar's idea: in the story, Nani says each line in English first, then Kutchi. His points for and against:
- **For:** it's easy to follow straight away.
- **Against:** Kutchi only (pictures plus Kutchi) also works for families whose home language isn't English.

**Claude's recommendation: the "sandwich", for story lines only.** Nani says the line in **Kutchi, then English, then Kutchi again**. The child understands it, and the last thing they hear is Kutchi.
- **Only in the first chapter.** The English fades out after that:
  - chapter 2: English only when the light bulb is pressed;
  - later: Kutchi only.
- **Gameplay lines never get English** (the light bulb stays the help there), so the lesson isn't given away.
- **A parent setting, "Story help"**, offers spoken English, off (pictures only) or later another language. That covers non-English families: the lines are one file per language.

### Decided (Zafar, 26 Sept): English, then Kutchi, with no sandwich
In the story, Nani says each line **in English first, then in Kutchi**. The lines are very short and simple:
- "Tomorrow is Eid."
- "Everyone is coming."
- "Oh no, the food is not ready."
- "Can you help me cook?"

Gameplay lines stay Kutchi only, with the light bulb as the help. The "Story help" setting can still turn the English off, or later switch it to another language.

### Lines to record (add to the next Questions for Mum; Mum says each three times)
1. "Can you get me the chai things from the pantry?"
2. "Can you make me chai?" (B40, already recorded)
3. "Mmm, lovely chai! Shabash, beta."
4. "Tomorrow is Eid!"
5. "Guests are coming." (Zafar: *magani acheto/achanto*?)
6. "Oh no, there's no food!"
7. "We need to cook." (Zafar: *pakendro … khape*?)
8. "Will you help me cook?"
9. The child's reply: "Yes, I'll help you cook." And just "Yes" (*Ha*).
10. "Come, let's go to the kitchen."

### A concern Zafar raised
The chai station "is a bit boring", and it'll be the second thing every new player sees. Give it a fun pass before the first-launch story ships (added to `docs/archive/cook/cook-with-nani-todo.md`).

## Status
**The flow is agreed, and so is the language: English, then Kutchi (Zafar, 26 Sept).** The shell build (`claude/build-shell`) currently does: first launch → pantry → home screen. When this is agreed, the shell's continuation adds the character step and the story beat. The panels use placeholder art until the ChatGPT art run makes them.

**Built (26 Sept, branch `claude/first-launch`):** the character step, Zafar's flow and English-then-Kutchi, as data (`data/story/first-launch.json`, `data/character-options.json`). Decisions are in `docs/archive/build-logs/first-launch-build-log.md`; the report is `build/reports/first-launch.md`. The story's Kutchi is placeholder until Mum records lines 1 and 3–10 above.

---

## Build status

> from: docs/archive/build-logs/first-launch-build-log.md (whole file, without its title)

The spec is `docs/game-design/modes/first-launch.md` ("Character creation", "Zafar's flow", "Decided: English, then Kutchi"). Nobody was available for questions, so these are the defaults taken.

### The flow
`index.html` sends any player without `firstDone` to `first.html?app=1` (`FIRST` in `js/home.js`). The scenes are data (`data/story/first-launch.json`), played by `js/shared/story.js`:

1. **character**: make your character (`js/shared/charmaker.js`);
2. **arrive**: the courtyard; Nani asks for the chai things;
3. **pantry**: Cook's pantry round (`cook.html?app=1&first=pantry&then=…`);
4. **ask-chai**: back in Nani's kitchen, "Can you make me chai?" (Mum's B40 clip);
5. **chai**: Cook's chai round (`&first=chai`): one cup, Nani's, the chai tray at level 1;
6. **sip**: the sitting room, Nani sips (the glass tilts, hearts float), "Shabash!" (Mum's clip);
7. **eid**: four panels (calendar with crescent moon; a thought bubble of the family; the empty pots; "Can you help me cook?");
8. **help**: Yes / No; No runs away, twice, then Nani laughs and it's gone; Yes → the child's "Ha!" → "Shabash! Let's cook!";
9. **end**: `firstDone`, home.

### Decisions
- **Where the character lives:** a new namespace, `character` (`{v, choices, hands, updated}`). Choices are swatch ids, not colours, so the palette can be retuned without breaking saves. `hands` is stored as `player-boy` / `player-girl`. `claude/cook-hands` hasn't landed on this base, so nothing reads it yet.
- **Where the story's place lives:** namespace `story` (`{"first-launch": {at}}`). Resuming: the same scene. A panel story restarts at panel 1, and a Cook round starts again (Cook has no mid-round save).
- **Story help** is a device setting, not a player's: grown-ups set it once. It lives in the save's root (`Save.setting` / `Save.setSetting`, a four-line addition to `save.js`) and isn't in the exported save file. Options: "English, then Kutchi" (default) and "Kutchi only". "Off (pictures only)" and other languages are left for later.
- **The pantry items:** Cook's pantry picks level 1's three from `basics` (five items). For this visit only, `js/cook/app.js` narrows `basics` to chai, dudh and khun, so Nani's list is exactly the chai things. The mechanics are unchanged.
- **Nani's chai:** the chai tray's cups come from the recipe's `family` list (Nana, Ma, cousin). For this visit only it's `["nani"]`, so the one cup has Nani's face. Her chai's details (milk, sugar, elchi) are still random, as for anyone.
- **Cook hooks:** a `then=` return page, restricted to `<name>.html?…` on this site, and `Cook.startDay` exported (one line in `flow.js`). The old `first=1` still works. Cook's chai demo and pocket-money rules don't run in the story's rounds.
- **The story card:** the Kutchi chunk lights up as it's spoken (read-along, UX §1); the English is spoken only, and any written English sits behind the grown-ups' "?" (E1). The speaker replays. Placeholder Kutchi has a faint dotted underline. It's there for grown-ups; children won't notice it.
- **Voices:** Mum's clip where one says exactly the Kutchi shown (`make-chai`, `lovely-chai` "Shabash!", `lets-cook`). The child's "Ha!" is Zafar's clip. Otherwise the browser's speech, else silent timing. If a browser blocks sound (coming back from Cook without a tap), the speaker pulses gold.
- **"Mmm, lovely chai! Shabash, beta."**: only "Shabash!" is recorded, so the Kutchi chunk is "Shabash!" (real voice) and "beta" is in the English.
- **Kutchi placeholders:** never invented freely. Each is built from family words or frames, and each is marked `placeholder: true` with a `note` giving its source:
  - "Muke chai, dudh ne khun de." (Cook's frames);
  - "Kaale Eid ai." (`ai` is the family's; `kaale` is unchecked Gujarati);
  - "Magani acheto." (Zafar, from memory);
  - "Arre re! Khaanu taiyaar nai." (a guess);
  - "Tu muke khaanu banai dinda?" (the B40 frame with *khaanu*).
- **Skin tones:** five tones, warm and unsaturated, from #E2C3A0 to #8A5F44 around Zafar's #C49A78 (the default), per the Cast doc. The Cast's "vary only slightly" rule is for generic characters. The player's own character needs a real range.
- **Boy/girl:** the boy has short hair, a shirt-kurta and trousers; the girl has long hair, a long kurta and shalwar. These are placeholder shapes, and only colours are chosen, as the spec says.
- **No name step:** names stay on the player picker ("typed by a parent, or skipped").
- **UI:** the maker's tabs show each part in its current colour, and each swatch is the part in that choice, so no reading is needed. After a pick, the next tab bounces once as an invitation (UX §8) but doesn't move by itself. The ✓ and the → are big and bottom-right (UX §2). Yes and No are on the right too.

### Tests
- `build/test_first_launch.py`: phone, iPad and laptop.
- `build/test_shared_character.mjs`: Node.
- `build/test_shell.py`: now plays the new first launch.


## Character creation (HO26, decided 26 Sept)

> from: docs/archive/handovers/HANDOVER-2026-09-26.md § Decided on 26 Sept

- **Character creation:** the person on the left, swatches on the right (gender, skin, hair, eyes, clothing colours), built from data-driven layers.
