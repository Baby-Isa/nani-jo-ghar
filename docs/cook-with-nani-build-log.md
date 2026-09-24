# Cook with Nani: build log, QA and persona reviews

**Date:** 24 Sept 2026 (built overnight while Zafar slept)
**What:** a playable, end-to-end proof of concept of the flagship game mode, in the new 3D-film art style. Open `cook.html`.
**Specs it follows:**
- `docs/game-modes-v2.md` sections 3 and 7 (stations, upgrades, counter slots)
- `docs/game-modes-fun-analysis.md` sections 4, 5 and 7 (the fun checklist; Cook with Nani in detail; build recommendation)
- `docs/Nani jo Ghar — Game Design.md` (per-word difficulty, teaching without cutscenes, warm failure)
- the Roadmap's layout contract v2 and lessons

---

## 1. Decisions taken overnight

Zafar was asked with a 5-minute deadline. He answered the words question; the rest are defaults.

| Decision | Taken | Why |
|---|---|---|
| Missing Kutchi words | *paani, chai, dudh, **khun**, atto, daal, maani*, confirmed by Zafar ("khun not khand") | Everything else comes from the content master, recombined only in existing frames |
| Cooking verbs | **No Kutchi.** Actions are shown (glow, a see-through fingertip, a short English how-to line in the sidebar) | Never invent Kutchi. Listed for the family in `docs/cook-with-nani-words.md` |
| Audio | Existing recordings play (greetings, thanks, bye, numbers 1 to 3). Everything else is text with a "needs recording" dot. **No computer voice** | Game Design: TTS teaches the wrong pronunciation |
| Where it lives | A separate page, `cook.html`, linked from the hub. The fruit errand is untouched | Safe to throw away; nothing else breaks |
| Customers | Nana, Ma (the player's mum), Bilal (cousin, name is a placeholder). Nani's look as generated | Pending family check (words doc, question 5) |
| Stars, coins, tips | Yes: 1 to 3 stars per order, coins and tips, a perfect-order combo | Zafar now leans towards these; nothing is ever lost |
| Streaks | **No streak that can break.** Instead, "You've cooked with Nani on N days", a count that only goes up | Keeps the habit hook without the guilt |
| Timers | Relaxed (default, no timer) or Busy (a patience bar; speed only adds tips; nobody leaves) | Fun analysis section 5 |
| Talking animation | Swap to the character's open-mouth frame plus a gentle bob. Pasting mouths between poses smudged, because the faces differ | LivePortrait frames replace this later |

## 2. What's in the build

**Session shape.** Title, then a day (3 or 4 customers, about 5 to 8 minutes), then an end-of-day summary, then Nani's shop, then back to the title. One day is one session (Game Design: "one errand is one session").

**Days.**

| Day | Story | New words | New mechanic |
|---|---|---|---|
| 1 Chai for Nana | Nani greets you and makes her own chai **with you doing each step as she names it** (the demo, taught by doing, not a cutscene). Then Nana orders and you make it **from memory** | paani, chai, dudh, khun | pour, boil watch, count, pour to the line |
| 2 Chai and maani | Ma wants hers with elchi; Bilal wants 2 maani (Nani shows you once) | elchi, atto, maani | knead, roll, tawa flip and puff, "how many?" |
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

**Shop.** 4 counter slots:
- chai machine, 60 coins
- measuring jug, 35
- dough mixer, 45
- heavy tawa, 40
- Bilal helps, 15 plus 5 a day

The sharp knife (25) needs no slot. Every upgrade automates a physical step, never the listening.

**Recipe book** (the notebook-lite): each learned recipe as a Kutchi sequence (*paani → chai → boil → dudh → khun → pour*), how each family member likes it, and every word met, with stage dots.

## 3. QA

**Automated** (`build/test_cook.py`). It plays through real pointer events: taps, holds, swipes, drags, circles. It checks before every tap that nothing in the HTML layer covers the target, and deliberately makes mistakes (a wrong greeting, a wrong pantry item) to exercise the warm-failure paths. Results are in section 6.

**Bugs found and fixed while building:**

| Found | Fix |
|---|---|
| The test clicked through the day summary itself and kept playing | The harness leaves menu buttons to the scripted flow |
| On the phone (915×375), Nani's station bubble covered the top pantry shelf, breaking playtest rule 2 | At the stations, Nani talks from a card in the sidebar, and how-to lines go there too. Nothing can cover the game |
| Liquid drawn above the pot rim | Vessel geometry stored as fractions of the image size (it broke when the props were re-sliced smaller) |
| Flames invisible under the pans | A bigger ring of flames, drawn under the pan's edge |
| Glass standing on a lit burner | Moved to the empty corner of the hob |
| Count badge overlapping the speech bubble | Moved to the top right |
| A hidden dough ball left its shadow behind | Shadows hide with their item |
| Recipe card still said "Nani shows you" during the next order | Cleared at each new order |
| Customer bubble covering their own face | Anchored beside the face |
| 10 MB of art | WebP: 2 MB |

**Known limits (not fixed, by design or for later):**
- **Most lines have no recording yet**, so for now it is a reading game with listening where recordings exist. The family recording list is in the words doc. This is the biggest gap for non-readers.
- Placeholder "talking" (a frame swap), until LivePortrait.
- Upscaled art (the backgrounds are 830 px wide in the sheet): soft on a big laptop, fine on a phone.
- No saving mid-day. Leaving restarts the day, as in the fruit errand's shell spec.
- Not wired into the profile system (it uses its own local save).

## 4. Persona review, round 1

Personas from `docs/game-modes-fun-analysis.md`. Each one "played" the build: I walked through it from their point of view, with the screenshots. The two tests: **is it fun**, and **does it teach Kutchi**.

| Persona | Fun | Learning Kutchi | What they'd say | Fix |
|---|---|---|---|---|
| **Aisha, 5** (can't read, plays with a parent) | Loves the sparkles, stars, puffing maani and tapping the glowing thing. Timing bars are abstract; she taps too early | Mostly from the adult reading it aloud, until recordings exist. She **can't read the greeting choices** | "Which one do I press?" "When do I tap?" | **Hear buttons** on greeting choices (▶ plays the recording). **The target pulses while it's the right moment** in every timing task. **A see-through fingertip** shows knead, roll, chop and stir |
| **Zayn, 8** (competitive) | Likes grades ("100%"), stars and Busy mode. Chai for the 6th time feels samey; wants a reason to be perfect | Numbers and extras matter for his score, so he listens | "What do I get for all 3-stars?" | **Perfect-order combo**: consecutive 3-star orders pay a growing bonus ("Perfect ×3!"). Tawa speeds up slightly with each maani |
| **Maryam, 11** (aesthetics, heritage) | The modern art is a yes. She likes the recipe book and "how the family like it". Wants to make the kitchen hers | Recipe sequences in Kutchi; the family's preferences | "Can I decorate?" | Noted for later: décor in the shop (Game Design warns against pure cosmetics; décor that changes the hub is OK). Not in this build |
| **Zafar, 38** (learner, Puzzle Pirates fan) | Upgrade choices on a 4-slot counter; "the usual" riddles; tadka order memory | Frames repeat and only words change, as designed. The recast after a mistake is the best bit. He'd want more Kutchi per minute and real recordings | "It teaches the words well, but it needs the voices." | Free cooking now leans towards **his weakest words** (spaced review). Recording list ready |
| **Farah, 34** (commuter, 3–5 minutes) | A full day is 5–8 minutes: too long for a quick go | Would do a daily short round | "I want one order, not a whole day." | **Quick order** (one customer, about 2 minutes) on the title once chai is learned. **"Cooked with Nani on N days"**, which never resets |
| **Nani, 68** (the voice; plays alongside) | Big, clear screens; the Kutchi is written so she can say it to the child | Her voice *is* the game | "That's not how I'd say it." | The words doc's questions and recording list are for her |

**Round 1 changes shipped:**
- hear buttons on greeting choices
- in-band pulse on timing targets
- ghost fingertip demos
- perfect combo
- tawa speed-up
- quick order
- cooking-days count
- free cooking biased to weak words
- a more compact shop

## 5. Persona review, round 2

*(after re-testing the round 1 changes; see below)*

## 6. Test results

*(filled in from the final runs)*
