---
name: game-mode-design
description: Design a new Nani jo Ghar mode or redesign one against the rulebook - pipeline of stages, the five questions, the leak test, levels, onboarding, scoring - ending in a builder brief. Use before any new mode, mini-game or station is specced.
---
# /game-mode-design: how a mode is designed

**For:** whoever designs a mode or mini-game, before any code. Rules live in `docs/process/rules.md` §4-§5 (cite IDs, never copy); the method in `docs/process/mode-design-method.md`; modes in `docs/game-design/modes/`. Zafar decides: propose, wait for his go (CLAUDE.md working agreement).

## 1. Start from the syllabus, not the game
- List the Kutchi the mode teaches (words, then phrases) from `data/lang/` and the question sheets. A mode that teaches nothing new is cut (H48).
- Check `docs/ideas.md` and the existing modes first: never replace or remove a mechanic or mini-game Zafar didn't comment on (non-negotiable 2).
- Find a proven fun game for each need (`references/fun-patterns.md`), then fit the story around the games (H3).

## 2. The pipeline (H1)
A mode is **a pipeline of stages**, each a pool of mini-games, stitched into one little story with a start and an end. Write: the stages in order, what carries from one to the next, how the first-ever session is tiny, how free play dips into one stage. Mechanics are modular, levels are data, Cook's mechanics are reused where they fit (`docs/architecture/cook-recipes-guide.md`).

## 3. The five questions, for every mini-game (H2)
1. What do you do (gestures, step by step; one gesture per kind of action)?
2. Where is the challenge, and does the **Kutchi decide it**?
3. Where is the fun (the delight moment)?
4. Where is the instruction (card plus Nani's line, in family Kutchi only)?
5. What is novel (nothing new: merge or cut)?
Score each 1-5, keep the best 6-8 per stage (8-10 for a big library), park the rest in "maybe later".

## 4. Test it against the rulebook before showing Zafar
- **Leak test (non-negotiable 6):** can someone with no Kutchi win by reading, matching, eliminating, patterns or waiting? If yes, redesign.
- **No written English for the child; no English in games or help (NN5).** Missing Kutchi is grey-italic English, tagged "to record" in the markup only (decision 84). Never invent Kutchi (NN4).
- **Same shared screens and buttons** from `js/shared/` (NN8); a missing shared piece goes to the shared-layer owner, never restyled per mode.
- **Instructions and onboarding (E1-E9, E27, E37):** requests come first in one pop-up; the ghost finger shows, the child does; the guide box says the next step; never make the child wait for speech.
- **Levels (E6, E7, E13):** L1 smallest round; each level adds one thing; levels make the Kutchi harder, not the gestures; one job at a time; timers ~15% quicker per level, set in data.
- **Counting and feedback (E10, E11, E14):** counting rule at every level; rows tick as steps close; take-backs until Done; progress, never verdicts; a wrong item is redone on the spot.
- **Tone (E29-E31):** nothing makes a child feel bad; pressure is the upside version; grown-ups skip through the "?".
- **Culture (NN16):** halal, modest, no religious markers, no sweets as rewards.

## 5. Speaking (E32)
Only inside a two-person exchange the child has watched many times. Ramp: watch, handover, say it after the model, words only, picture only; closed set with a pill or parent fallback; never block on recognition.

## 6. Output: a design section and a builder brief
Write one section at the top of the mode doc (`docs/game-design/modes/<mode>.md`), with:
1. The pipeline (text diagram) and the carry-forward between stages.
2. Per stage, the mini-games with the five answers and their level ladder.
3. Research: what current children's apps do (name them, one borrowed mechanic each; web search).
4. Walkthrough: one paragraph of a level-1 round (screen, card, taps, fun moment, tick, end).
5. What survives from the current build, concretely (files, mechanics).
6. Words needed, marked against the Questions for Mum sheet.
7. Assets each mini-game declares and loads only when chosen (decision 68).
Then `/brief` for the build sessions (own files, shared pieces needed, regression rows touched) and a note in `docs/status.md`.

## 7. Done means
Zafar approved the design; every mini-game answers all five questions; the leak test is written out per mini-game; the builder brief names owned files. Nothing is built before his explicit go.
