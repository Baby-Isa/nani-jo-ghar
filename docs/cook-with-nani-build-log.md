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
| Audio | First build: recordings only, no computer voice. **Changed at Zafar's request (24 Sept, morning): a Gujarati TTS placeholder voice for every line, at about half speed** (gTTS slow mode plus ffmpeg at 0.75×, roughly 2 syllables a second) | He found the earlier placeholder "crazy fast". Family recordings replace the files one for one |
| Shop | First build: 4 counter slots. **Changed at Zafar's request: one upgrade per station, bought with coins; money is the choice** (the whole shop is about 375 coins, the story pays about 175) | His suggestion; clearer for children than slots |
| Hub link | Added, then **removed**: the fruit errand is left exactly as it was | "Create a new page for now, leave the current game" |
| Where it lives | A separate page, `cook.html`, linked from the hub. The fruit errand is untouched | Safe to throw away; nothing else breaks |
| Customers | Nana, Ma (the player's mum), Ali (cousin, tall and lanky). Nani's look as generated | Pending family check (words doc, question 5) |
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
- **The voice is a Gujarati TTS placeholder** at about half speed: a guide, not Kutchi pronunciation. The family recording list is in the words doc.
- Placeholder "talking" (a frame swap), until LivePortrait.
- Upscaled art (the backgrounds are 830 px wide in the sheet): soft on a big laptop, fine on a phone.
- No saving mid-day. Leaving restarts the day, as in the fruit errand's shell spec.
- Not wired into the profile system (it uses its own local save).

## 4. Persona review, round 1

Personas from `docs/game-modes-fun-analysis.md`. Each one "played" the build: I walked through it from their point of view, with the screenshots. The two tests: **is it fun**, and **does it teach Kutchi**.

| Persona | Fun | Learning Kutchi | What they'd say | Fix |
|---|---|---|---|---|
| **Layla, 5** (can't read, plays with a parent) | Loves the sparkles, stars, puffing maani and tapping the glowing thing. Timing bars are abstract; she taps too early | Mostly from the adult reading it aloud, until recordings exist. She **can't read the greeting choices** | "Which one do I press?" "When do I tap?" | **Hear buttons** on greeting choices (▶ plays the recording). **The target pulses while it's the right moment** in every timing task. **A see-through fingertip** shows knead, roll, chop and stir |
| **Zayn, 8** (competitive) | Likes grades ("100%"), stars and Busy mode. Chai for the 6th time feels samey; wants a reason to be perfect | Numbers and extras matter for his score, so he listens | "What do I get for all 3-stars?" | **Perfect-order combo**: consecutive 3-star orders pay a growing bonus ("Perfect ×3!"). Tawa speeds up slightly with each maani |
| **Maryam, 11** (aesthetics, heritage) | The modern art is a yes. She likes the recipe book and "how the family like it". Wants to make the kitchen hers | Recipe sequences in Kutchi; the family's preferences | "Can I decorate?" | Noted for later: décor in the shop (Game Design warns against pure cosmetics; décor that changes the hub is OK). Not in this build |
| **Zafar, 38** (learner, Puzzle Pirates fan) | Upgrade choices (money is tight, so it's a real decision); "the usual" riddles; tadka order memory | Frames repeat and only words change, as designed. The recast after a mistake is the best bit. He'd want more Kutchi per minute and real recordings | "It teaches the words well, but it needs the voices." | Free cooking now leans towards **his weakest words** (spaced review). Recording list ready |
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

The same personas, after the round 1 changes, the full five-day run and the six screen sizes.

| Persona | Better now | Still wrong | Fix (round 2) |
|---|---|---|---|
| **Layla, 5** | Hears the greeting replies before choosing; the pulsing target tells her *now*; the fingertip shows her how to roll and stir | Counts come from the ticket's digit ("2 × khun") and the adult, until recordings exist | None needed in code: recordings (words doc, section 4) |
| **Zayn, 8** | Combos pay; Busy mode's patience bar adds pressure without punishment | No record to beat in free cooking | **Best free-cooking score** on the title button |
| **Maryam, 11** | Recipe book, family favourites, the finale | Still wants to decorate | Later (see section 7) |
| **Zafar, 38** | The recast after mistakes; "the usual"; weak-word review | **Nani's reading pauses can't be skipped**, which breaks the Game Design rule "nothing is unskippable" and makes adults wait | **Tap anywhere to skip** a line (it stays on screen to read) |
| **Farah, 34** | Quick order is about 2 minutes | The same pauses | Same fix |
| **Nani, 68** | Clear screens, big Kutchi text to say aloud | Needs to check every line | The words doc |

**Verdict against the two tests:**
- **Fun: yes, with a caveat.** The strongest parts:
  - the maani puff
  - the boil-over (funny, harmless)
  - the tadka memory moment
  - the combo
  - the counter-slot decision

  The weakest: chai is cooked many times. The chai machine and the jug are the relief valve, which is the Good Pizza pattern.
- **Educational: yes, structurally.** The order *is* the Kutchi, nothing tells you in English what to cook, and mistakes get a recast. With the placeholder Gujarati voice every line is now heard as well as read, so non-readers can play by ear. **It becomes real Kutchi listening once the family's recordings replace the placeholder.**

## 6. Test results

Final runs on the finished build (Gujarati voice, station shop, round 1 and 2 fixes), `python3 build/test_cook.py` at 3× speed:

| Run | Result |
|---|---|
| Day 1 on all six sizes: phone 915×375, 1366×768, 1440×900, 1280×800, iPad, iPad portrait | **All pass** (about 90 s each) |
| All 5 story days, the finale and a free-cooking day (1366×768) | **Pass**: 22 orders, all 3 stars (the test knows the answers), 218 coins, 274 screenshots |
| Days 1–2, Busy setting (iPad) | **Pass** |
| Days 1–2 on all six sizes (before the voice and shop change) | **All pass** |

The test deliberately:
- picks a wrong greeting once
- taps wrong pantry items and wrong steps now and then
- skips Ma's elchi when cooking from memory

So the warm-failure paths (Arre re!, Nani modelling the reply, the customer repeating what they asked for, fewer stars) run on every pass. No console errors. A curated set of screenshots is in `docs/cook-screens/`.

## 7. Next steps (for Zafar)

1. **Play it:** `cook.html` on a phone in landscape (GitHub Pages: `/cook.html`). Try Relaxed with a child and Busy yourself.
2. **Words:** answer the questions in `docs/cook-with-nani-words.md`, then do one recording session from its list.
3. **Recordings drop straight in:** each one replaces the placeholder Gujarati file of the same name in `assets/audio/cook-tts/` (for example `muke-chai-khape.mp3`). No code change is needed.
4. **Then decide** what carries over into the real build:
   - the stations engine
   - the step and hint engine
   - the shop
   - ChatGPT sheet slicing
5. **Later ideas:**
   - décor for the hub (Maryam)
   - hide the Kutchi text for known words once the audio exists (Zafar)
   - LivePortrait talking frames
   - spice cupboard as its own scene
   - more recipes (khichdi, chaas with churning, bajra rotlo)

## 8. Station upgrades: in the build now, and what the real upgrade could be

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

## 9. Persona review, round 3 (Wave 4 check, 25 Sept 2026)

The same six personas (section 4), after Waves 1–3: the order ladder, help costs, levels, Stir on a track, and the three combined stations (Chai tray, Maani line, Mishkaki grill), plus the polished keepers and the open kitchen. The review comes from screenshots of every station at all six screen sizes, two story days on the phone and on the iPad in portrait, and a read of the code.

| Persona | Fun | Learning Kutchi | What they'd say | What to fix |
|---|---|---|---|---|
| **Layla, 5** (can't read; plays with a parent) | The Chai tray is the best screen for her: Nana's face on his cup bobs while he talks, and tapping the face plays his order again. Big knob, a jug that slides in and pours while she holds it, a spoon that flies from the bowl. The Maani line's puff and the grill's sizzling rings are pure fun. Juggling (the tawa won't wait; two skewers at once) is too much at 5, but level 1 keeps it to one tawa and one skewer | She hears every line (placeholder voice). The per-person orders are short ("ne dudh, ne bo khun"), which suits her. Sugar and salt look the same on purpose, so only the word helps, and she'll need the label speaker | "Nana's talking!" "Which one is sugar?" "It burnt!" | On the phone the sidebar buttons (speaker, translate, 👁) are 22 px, too small for her fingers; the parent does those. The game objects themselves are all 50 px or more. Later: speaker buttons of at least 32 px on phones |
| **Zayn, 8** (competitive) | Grill level 3 (four skewers, each its own ring), two tawas, the stir spill and the Busy patience ring are his game. The result card's "they asked / you did" shows exactly where points went | Counts decide his score (skewers, maani, spoons), so he listens for the number words | "Can I play level 3?" "Why are my tawa scores 40%?" | Each story order has a fixed level (mostly 1; day 3 has a level-3 chai), so the grill at level 3 is only in the lab. Let the open kitchen raise the level as he gets things right (orchestrator). Check the tawa and fry windows on a real device (the headless test scores them low because it runs slowly) |
| **Maryam, 11** (aesthetics, heritage) | The glass chaat bowl with visible layers, the faces on the cups and the brass-and-wood tray look good. Code-drawn placeholder art (skewers, rack, parat bowls, the hob) is plainer than the painted 3D-film props next to it | The recipe book, and seeing each family member's cup | "The skewers look like a diagram." | The art run (hand sheets, skewer and grill props). Already on the to-do |
| **Zafar, 38** (learner) | The Chai tray is the most Kutchi-dense screen yet: three people, each with their own line and a recast from that person when their cup is wrong. The ladder going plain once *ne poi* is known is a nice grammar test | He notices that *no*, *slowly*, *half*, *big*, *vegetable* and *mixed* are English, so he can read those decisions without any Kutchi. That's the one real hole left (audit, "After Wave 3") | "The systems are right now; it needs the words." | Family: the Kutchi for *no / without* first, then speed, amount, size and kind words. Code: done. Wave 4 also fixed the dot groups on the card that gave away which row had a number |
| **Farah, 34** (3–5 minute sessions) | Quick order is still about 2 minutes. The open kitchen's "Close the kitchen" lets her stop whenever she likes. A level-3 Chai tray (three cups, pouring each) takes 3 minutes or more | Same as Zafar | "On my phone, the goal text is cut off mid-sentence." | Done in Wave 4: Nani's line is no longer squeezed under the goal on the phone. Still open: the phone goal box is capped at about 4 lines (it scrolls). It collapses to "?" after the first time, so it's minor |
| **Nani, 68** (the voice) | The faces, the tray and her own card in the sidebar, never over the game | She reads the Kutchi aloud. The grey English words are the ones she'd give | "That's not how we say *no*." | The Round 2 word list: put *no / without*, *slowly / quickly*, *half / full*, *big / small*, *vegetable / mixed* at the top |

**Verdict against the two tests:**
- **Fun: yes.** The combined stations fixed the "same chai again" problem. The Chai tray, the Maani line and the Mishkaki grill each have a real decision (who gets what; roll first or line them up; which skewer goes on when) as well as the hands. The weakest spot is the phone sidebar: small buttons, and the goal cut off.
- **Educational: yes, for every word that exists in Kutchi.** Every decision now comes from what's said, and being shown the answer costs the ear star. The remaining leak is content: about a dozen decision words are still English.

**Wave 4 changes shipped:**
- hidden words next to each other share one "•••" on the order card
- chop rounds come in a random order
- the phone sidebar keeps Nani's whole line visible
- the Chai tray result card lists what you got right

The larger items are listed for the orchestrator in the to-do (Wave 4).
