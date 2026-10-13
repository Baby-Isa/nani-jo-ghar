# Language Learning Game UI/UX Feedback

The core concept is clear, and the screen is functional, but it currently feels more like a **well-built prototype** than a premium, finished learning game.

The biggest issue is not the artwork itself. It is that the **UI, game objects, typography, spacing, and interaction hierarchy are not yet behaving like one coherent design system**. Premium games tend to feel extremely intentional: every object has a clear purpose, every spacing value feels related, and the player's eye always knows where to go next.

## What is already working

The gameplay is understandable almost immediately. I can see that I am making chai, I have a cooking area, ingredients are available along the bottom, and there is a language-learning panel on the left.

The top-down kitchen is also a good format for this kind of game because it gives you a strong physical metaphor: ingredients can move into the pot, objects can react, and vocabulary can be tied directly to actions rather than taught through flashcards.

Your materials are also reasonably attractive individually. The stainless steel pot, tray, glass, jars and hob are all visually pleasant. Nothing looks fundamentally amateurish.

The problem is mainly **composition and hierarchy**.

---

## 1. The screen does not have one obvious focal point

At the moment, everything has roughly equal visual importance.

Your eye is competing between:

- the character panel
- the instruction card
- the saucepan
- the unused burner
- the tray
- the glass
- seven ingredients
- the labels underneath them
- the bottom-left navigation

A high-end children's game would establish a much stronger hierarchy.

The current task is “Make chai,” so the hierarchy should probably be:

**1. Current instruction → 2. relevant object/ingredient → 3. cooking area → 4. supporting controls**

Right now the saucepan, tray and ingredient row all feel equally dominant.

### Improvement

Make the active gameplay area more intentional.

For example:

- Pot becomes the visual centre of the playable area.
- Ingredients occupy a dedicated inventory shelf/tray.
- Serving tray becomes secondary until the tea is ready.
- Empty burner becomes visually quieter.
- Language instruction stays prominent but much simpler.

You could even slightly dim inactive objects by perhaps 8–12% until they become relevant.

That creates a subtle guided-attention system without resorting to arrows everywhere.

---

## 2. The left panel feels like a website sidebar rather than part of a game

This is probably the single biggest reason it does not yet feel premium.

The left side is essentially a vertical collection of white rounded rectangles.

It has:

- a profile box
- an instruction box
- another dialogue/vocabulary area
- three navigation buttons below

They are individually fine, but collectively they feel like conventional app UI placed next to a game scene.

Premium children's games often integrate the teaching UI into the world more naturally.

### I would simplify it substantially

Instead of:

**avatar header**

then

**instruction card**

then

**speaker line**

then

**multiple answer/text cards**

consider one unified **lesson card**.

Something like:

**Nani avatar + name**

“Make chai.”

Nani says:

**“Dudh”**

[ 🔊 Hear it ]

Then perhaps the English support appears below only if needed:

**milk**

This could all be one beautifully designed card rather than four or five nested boxes.

You would immediately gain more breathing room.

---

## 3. Too many rounded rectangles

This is a common prototype-stage problem.

Almost every piece of information currently sits inside another rounded container.

Rounded cards are useful when they separate unrelated information. When everything gets a card, they stop providing hierarchy.

You currently have something resembling:

- card
  - inside card
    - inside card
      - inside card

That makes the interface visually busy even though there is not actually much information on screen.

### Better rule

Use containers sparingly.

For example:

- One lesson panel
- One inventory surface
- Individual buttons only where genuinely interactive

Everything else can live directly on those surfaces.

---

## 4. The ingredient row is the weakest part of the main game UI

The row across the bottom currently feels like a debugging toolbar rather than a polished game inventory.

There are several reasons.

The items:

- have inconsistent physical sizes
- have inconsistent container sizes
- sit at slightly different visual heights
- have inconsistent labels
- have different visual densities
- aren't sitting inside a clearly defined interaction zone

For example, the water bottle is tiny compared with the sugar jar. The milk carton has a completely different silhouette. Some ingredients have text labels and some seem to have speaker controls only.

This makes the bottom feel visually fragmented.

### A stronger solution

Create **seven identical inventory slots**.

Not necessarily obvious boxes. They could be subtle circular or rounded bases.

Each slot could have:

**object**

**language word**

**speaker icon**

For example:

```text
   [water bottle]

      paani
       🔊
```

Every ingredient gets identical spacing and typography.

The physical ingredient artwork can vary, but the **visual footprint** should be standardized.

Think of the invisible bounding box as fixed.

Perhaps every object occupies roughly:

- 90 × 90 px artwork zone
- 24 px gap
- word
- 8 px gap
- audio affordance

This alone would make the interface look much more expensive.

---

## 5. The ingredient labels are too visually inconsistent

At the moment “paani”, “rai”, “loon”, etc. appear in little white pill shapes while other items just have speaker icons.

That makes it unclear whether:

- the pill is a button
- the speaker is the button
- the whole ingredient is clickable
- the word itself is draggable
- some ingredients have names and others do not

Premium UI makes interaction semantics very obvious.

### Choose one interaction model

For example:

**Tap ingredient → hear word.**  
**Drag ingredient → use ingredient.**

Then give every item the same treatment.

Something like:

**Paani 🔊**

under every ingredient.

If vocabulary discovery is part of the gameplay, you could initially hide the word and reveal it after tapping.

But whichever approach you choose, do it consistently.

---

## 6. Your typography needs its own system

The current type feels slightly generic and UI-like.

For a children's language-learning game, type contributes enormously to personality.

You want something that is:

- very legible
- rounded without becoming babyish
- visually warm
- extremely clear at small sizes

More importantly, you need clearer hierarchy.

Right now several text elements appear to have nearly the same visual weight.

I would create perhaps only four levels:

- **Lesson title:** 22–24 px, semibold
- **Spoken target phrase:** 20–22 px, bold
- **Vocabulary labels:** 16–18 px, semibold
- **Support/navigation text:** 14–16 px, regular

Avoid lots of tiny typography.

For a children's experience, slightly oversized type nearly always feels better.

---

## 7. The pink UI and the kitchen scene don't quite belong to the same world

Your game scene uses:

- cream marble
- warm metal
- dark hob
- pale natural materials

Then the interface introduces pastel pink with fairly bright borders and white app cards.

Neither direction is wrong, but the two don't yet share a visual language.

The UI looks like a children's educational website placed beside a more sophisticated rendered game.

### Bring the interface toward the world

You could use:

- warm parchment/cream surfaces
- very pale terracotta
- muted maroon
- sage accents
- brass/gold highlights

That would connect beautifully with the visual identity you've already established for Nani's home.

Pink can still be part of the character identity, but I would not make it the primary structural UI colour.

---

## 8. Materials are too evenly polished

This is subtle but important.

The saucepan, tray, hob and glass are all beautifully rendered, but almost everything has the same degree of smoothness and photographic polish.

Premium stylised games usually exaggerate material differences.

For example:

### Steel

Softer brushed highlights, slightly simplified reflections.

### Glass

Stronger rim highlights, reduced internal complexity.

### Marble

Very subtle pattern. Your current marble has enough contrast that it occasionally competes with gameplay objects.

### Plastic containers

Slightly more matte and toy-like.

### Wood

Warm, diffuse and tactile.

This would make each category easier for a child to recognise instantly.

You don't need more realism.

You need **more controlled stylisation**.

---

## 9. Some objects look like they come from different art pipelines

This is also affecting polish.

The saucepan and tray feel relatively realistic.

The water bottle feels more toy-like.

Some jars are highly rendered.

The milk carton looks somewhat icon-like.

The avatar artwork has a completely different visual language again.

Individually these elements are fine, but premium games maintain extremely strict consistency.

I would define a mini art bible for every interactive prop:

- same camera elevation
- same lighting direction
- same highlight strength
- same shadow softness
- same material exaggeration
- same saturation range
- same edge treatment
- same scale convention

Apply that same discipline inside the final interface.

---

## 10. The screen needs more negative space

There is technically empty space, but it isn't being used compositionally.

The hob occupies a huge rectangle.

The tray occupies a huge circle.

Then the ingredients are squeezed tightly beneath them.

So the screen feels simultaneously **empty and crowded**.

That's usually a sign that the spacing system is not doing enough work.

A polished layout might use something like:

- 32–40 px outer margins
- 24–32 px between major gameplay regions
- 16–20 px inside UI cards
- 12–16 px between related controls
- 6–8 px between label and icon

Consistency matters more than the exact values.

---

## 11. The tray is currently too visually dominant

The giant silver tray on the right is one of the strongest shapes on screen.

Because it is a bright circle sitting on a pale surface, it attracts attention immediately.

But at this stage of the task it appears to be mostly inactive.

That is backwards from a UX perspective.

### Options

- Make it smaller.
- Move it slightly farther right and partially off-screen.
- Reduce its brightness while inactive.

Then, when the tea is ready, animate it or brighten it.

The scene itself can communicate progression.

---

## 12. The unused burner is taking valuable attention

You have two burners, but only one saucepan.

The empty burner becomes a large, visually complex black ring near the centre of the image.

The player's eye keeps getting drawn toward it even though it apparently has no role.

If the second burner matters later, keep it.

But make it less visually assertive.

If it has no gameplay purpose in this task, simplifying the composition to one relevant burner could dramatically improve the screen.

Children's game interfaces benefit from **removing irrelevant choices**.

---

## 13. The audio buttons don't look integrated into the actions

Audio is one of the most important controls in a language-learning game, yet the speaker icon is tiny.

That is the opposite of the instructional priority.

Hearing pronunciation should feel effortless.

I'd make the audio interaction much more generous.

For example:

**🔊 paani**

as one tappable component.

Or tapping the entire ingredient speaks the word, with the speaker symbol simply communicating that behaviour.

Large hit areas matter especially if this will eventually be played on tablets.

---

## 14. The vocabulary and cooking mechanics should reinforce one another more

This is more important than purely visual polish.

Right now language content appears on the left while cooking happens on the right.

Those can feel like two parallel systems.

Best-in-class educational game design tries to make **the learning action identical to the game action**.

For instance:

Nani says:

**“Paani nakho.”**

The water bottle gently pulses.

The child drags the water into the pot.

As it pours:

**PAANI**

briefly appears near the stream and pronunciation plays.

Then the instruction advances.

So the child learns:

**word → sound → object → physical action → outcome**

That is dramatically more memorable than having the vocabulary list sit beside the game.

---

## 15. Feedback needs to feel rewarding

From this still image I don't see much evidence of a strong response system.

High-quality children's games feel delightful because almost every correct action causes a small response.

Not enormous celebration animations every time.

More like:

- subtle object bounce
- gentle glow
- pleasant click
- ingredient pour animation
- character reaction
- spoken confirmation
- progress tick
- slight particle sparkle for milestones

Incorrect actions should also feel gentle.

Instead of a red X:

- object wiggles slightly
- Nani says the word again
- correct object softly pulses

That keeps the child inside the learning loop.

---

## 16. The lower-left navigation looks unfinished

The three buttons at the bottom left feel disconnected from everything else.

They are sitting in a large amount of blank beige space, with no obvious grouping or hierarchy.

I would probably turn this into a proper small navigation dock.

Maybe:

- **? Help**
- **⌂ Home**
- **▣ Vocabulary**

Three consistent circular controls with identical size and spacing.

Keep secondary controls visually quiet until needed.

---

## 17. The avatar needs more presence

Nani appears tiny.

If she is the guide and emotional centre of the experience, she should probably feel more like a character and less like a profile icon.

Even something as simple as enlarging her portrait by 30–50% would help.

Better still, use a small waist-up character illustration occasionally.

Then teaching feels like:

**Nani is speaking to me**

rather than:

**an app is displaying text**.

For this game in particular, the family can become one of the strongest differentiators.

---

## 18. Create a much stronger grid

If I were rebuilding this exact screen, I would probably divide it into roughly:

**22% lesson / character area**

**78% gameplay area**

Inside the gameplay area:

**top 73–76% — cooking scene**

**bottom 24–27% — ingredient inventory**

That gives the ingredient area its own deliberate home instead of letting it float across the marble.

Something like:

```text
┌──────────────┬─────────────────────────────────────────┐
│              │                                         │
│    NANI      │                COOKING                  │
│              │                                         │
│ Make chai    │       POT                 SERVING       │
│              │                                         │
│ “Paani…”     │                                         │
│     🔊       ├─────────────────────────────────────────┤
│              │ water  tea  spice  milk  sugar  etc.   │
│   progress   │                                         │
│              │              INVENTORY                  │
│              │                                         │
├──────────────┤                                         │
│ ?   ⌂   book │                                         │
└──────────────┴─────────────────────────────────────────┘
```

The important difference is that every region has a job.

---

## 19. Add a very subtle progress system

Children benefit enormously from knowing:

- **Where am I?**
- **What am I doing now?**
- **How much is left?**

You don't need “Step 3 of 8” necessarily.

You could have 5–7 tiny ingredient dots or illustrated stages.

For example:

**○ ○ ○ ○ ○**

Then completed ones become little gold ticks.

That gives a subtle sense of progression without making the game feel instructional.

---

## 20. Reduce the amount of visible instructional text

For language learning, repeated exposure is good.

But visually, text should appear at the exact moment it becomes useful.

Instead of permanently displaying several words at once, present one learning target prominently.

For example:

**Nani says:**  
### “Paani nakho.”

🔊

Then the ingredient inventory itself contains the noun labels.

This creates focus.

---

## 21. Increase tap targets considerably

Some controls currently appear very small, especially the speaker buttons.

For tablet-first children's UI, I would design around very forgiving hit areas.

Even if the icon is only 24 px, the interactive area around it might be 48–56 px.

Likewise, ingredient objects should probably be draggable/tappable over their entire slot rather than requiring interaction with the object silhouette itself.

---

## 22. Consider a slight camera/art adjustment

The scene is technically top-down, but because everything is extremely orthographic and clean, it feels slightly like objects laid out on a product photography surface.

For a children's game I would exaggerate the stylisation slightly:

- softer perspective
- chunkier objects
- slightly thicker glass/metal rims
- simplified reflections
- warmer ambient shading
- more expressive proportions

Not cartoony to the point of losing the sophisticated aesthetic.

Just enough that the environment feels **designed to play with** rather than photographed.

---

# What is making it feel “okay, not great”

If I had to reduce it to five causes:

1. **Too many competing elements with equal visual weight.**
2. **The lesson interface and game world feel like separate products.**
3. **Ingredient inventory lacks a strong grid and consistent sizing.**
4. **Typography, spacing and controls don't yet form one rigorous design system.**
5. **The family/language-learning personality isn't visually dominant enough.**

The assets themselves are not the main problem.

The next jump in quality comes from **art direction + UI system + interaction choreography**, not simply making prettier pots or jars.

---

# Changes I would make first

In order of impact:

1. **Redesign the bottom ingredient row into a proper uniform inventory.**
2. **Collapse the entire left side into one clean Nani lesson panel.**
3. **Make the current vocabulary/action much larger and everything else quieter.**
4. **Standardise typography, corner radii, spacing, button sizes and object bounding boxes.**
5. **Make the learning interaction happen on the object itself: tap → hear; drag → perform.**
6. **Visually suppress inactive things such as the serving tray and second burner.**
7. **Add polished micro-feedback: glow, bounce, sound, pouring, reactions and progression.**
8. **Bring UI colours/materials closer to the warm Kutch-home visual world.**

If those eight things changed while keeping essentially the same game concept and assets, the result could move from **“nice educational prototype” to something that feels substantially closer to a commercially polished children's game.**
