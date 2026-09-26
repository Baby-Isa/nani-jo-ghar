# First launch: onboarding and the story hook (Zafar, 26 Sept; draft)

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
- boy or girl (this also picks the player's hands: player-boy / player-girl);
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
- The choices are saved in the player's save (`js/shared/save.js`), and the hands, the home screen and later the world use them.

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
- **A parent setting, "Story help"**, offers English, off (pictures only) or later another language. That covers non-English families: the lines are one file per language.

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
The chai station "is a bit boring", and it'll be the second thing every new player sees. Give it a fun pass before the first-launch story ships (added to `docs/cook-with-nani-todo.md`).

## Status
**The flow is agreed, and so is the language: English, then Kutchi (Zafar, 26 Sept).** The shell build (`claude/build-shell`) currently does: first launch → pantry → home screen. When this is agreed, the shell's continuation adds the character step and the story beat. The panels use placeholder art until the ChatGPT art run makes them.
