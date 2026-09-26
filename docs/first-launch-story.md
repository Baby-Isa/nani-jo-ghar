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

## Status
**This is a draft, waiting for the rest of Zafar's thoughts.** The shell build (`claude/build-shell`) currently does: first launch → pantry → home screen. When this is agreed, the shell's continuation adds the character step and the story beat. The panels use placeholder art until the ChatGPT art run makes them.
