# Progression and scoring

> **Stale points (what `docs/process/rules.md` now overrides).** Source blocks are copied word for word and not corrected.
> - Stars, the ear star, the voice star, craft stars and "star_sets" → three badges: time, accuracy, hints (H5, J7, decisions 1–3)
> - The quilt and its patches as the progress object → a bookshelf, one named book per finished arc (decision 4)
> - Coins, prices, the 375-coin shop, pocket money "given at Eid", hints that cost pocket money or pause the clock → decision 10 (upgrades) and decision 1 (the light bulb costs a lightbulb)
> - Digits or dots "2 × santra", target digits on the chalkboard → no digits for the child (E12, F25)
> - Subtitles, English link on every card, English toggle → no written English for the child (E1, F23)
> - *hikdo/bo* → *hakro/hakri*, *ba*; *daal* → *daar*; *vadho* → *wadho* (G4, G5)
> - Doing it "at Eid" (pocket money, rewards) → the Birthday arc (H36)

How a child's words advance, how the skills are checked, what scores and unlocks there are, and how errands are generated. The badge rules themselves are in `docs/process/rules.md` (H5, J7) and are not restated here.

## Part 1. Per-word stages, the notebook and adopted mechanics (Game Design)


> from: docs/archive/design-v1/Game Design.md § Per-word difficulty

### Per-word difficulty

This is the spine. Every other decision hangs off it.

There is no beginner mode and no expert mode. There is one interaction, and how much help it gives depends on how many times **this player** has met **this word**.

| Stage | Times met | Picture | Written word | Audio | Extra help |
| --- | --- | --- | --- | --- | --- |
| 1. Introduced | First | Shown | Shown | Plays automatically | The item glows |
| 2. Supported | 2 to 4 | Shown | Shown | Plays automatically | None |
| 3. Prompted | 5 to 9 | Shown | Hidden | Plays automatically | None |
| 4. Recalled | 10 to 19 | Shown | Hidden | Tap to replay | None |
| 5. Known | 20+ | Hidden | Hidden | Plays once | None |

A word drops back a stage if it has not been seen for a while, or if the player gets it wrong twice.

Why this solves the hardest problem in the project:

- **A four-year-old** sits at stage one or two for weeks. Glowing pictures, the word spoken every time. It feels like a toy.
- **An adult** moves a word from stage one to stage five inside two sittings, because they get it right every time. By the third session most of their screen is audio-only. It feels like a test they are passing.
- **Both are on the same screen, at the same time**, with no setting to choose and nothing labelled as easy or hard.

It also means spaced repetition needs no separate review mode. The scheduling is the difficulty model. A word you are weak on simply appears more often, with more help, inside ordinary play.

One consequence for the content model: progress is stored per word per player, not as a level number. The technical plan needs to carry that.

*Superseded in part by the Roadmap doc: this single stage is later split into `understand_stage` and `produce_stage`, so listening/reading and speaking/writing progress separately. The table above still describes how support scales; it now applies per skill, not as one number.*


> from: docs/archive/design-v1/Game Design.md § The notebook

### The notebook

The player carries a notebook. Every word they meet writes itself in, with its picture and its recording.

It does four jobs at once:

1. **Dictionary.** Tap any word to hear it again. The only reference the game needs.
2. **Collection.** A filling book is its own reward, and it shows what is left.
3. **Quest tool.** Where the blanket quest writes down each relative's favourite colour, so the notebook is used inside play rather than only consulted.
4. **Writing practice.** The one place where typing a word is asked for, and only from stage three upward.

It is also where an adult goes to cram, which is a real behaviour worth supporting rather than fighting. A grid of every word met, sorted by how shaky it is, with audio on tap. That page alone would be useful to Zafar with no game attached.

**Handwriting is deliberately absent.** Kutchi has no agreed script, so asking a child to write it would mean choosing one, which is a decision for the community and not for this app.


> from: docs/archive/design-v1/Game Design.md § Mechanics adopted

### Mechanics adopted

| Mechanic | What it does | Why it earns its place |
| --- | --- | --- |
| Calm and busy places | Nani's house never has a timer; some outside scenes do | Timers everywhere drive off young children; timers nowhere bore adults |
| Optional urgency | Timed runs are always opt-in and always for a bonus | Keeps the tension, removes the punishment |
| Grandparent mode | The adult holds the phone and plays the shopkeeper, reading their line aloud | Turns the app into a script for a conversation instead of a substitute for one |
| Warm failure | A wrong answer gets a gentle spoken "Arre re!" from Nani, never a buzzer | Anxiety measurably suppresses language uptake |
| Mystery containers | Unlabelled jars and sacks that must be chosen by ear | Reframes a vocabulary test as finding out what is inside |
| Functional purchases | Pocket money buys extra seconds, hints, new shelves | Rewards that feed back into play read as content, not grinding |
| Play both sides | Sometimes the player is the shopkeeper asking the questions | Production, not only recognition |
| Errand log | A short recap at the end of a session, in Nani's voice | The spaced repetition drill, disguised as putting the shopping away |

**Grandparent mode is the one to protect.** Most language apps put the fluent elder outside the loop. Here the app shows Zafar's mother her line in large type, she says it to the child herself, the child answers, she marks it. The app becomes scaffolding for a conversation between two people in the same room. It also happens to be the reason the project exists.


> from: docs/archive/design-v1/Game Design.md § The quilt

### The quilt

There are no points, stars, XP or streaks. Progress is a quilt on the wall of Nani's house, and every finished errand adds a patch.

Kutch has a real patchwork tradition, so the object is not decoration borrowed from another game. It sits in the hub, it grows, and it is the first thing a returning player sees.

Why an object rather than a number:

- A four-year-old understands a picture filling in. A number going up means nothing to them.
- An adult is not insulted by it, because it is a thing being made rather than a score being awarded.
- It cannot be gamed. There is no way to grind it, because patches come from errands and errands come from vocabulary.
- It gives the whole game an ending. A finished quilt is a finished game, which most language apps deliberately never offer.

**Patch design.** Each patch carries a motif from the scene that earned it: fruit for the bazaar, thread spools for the blanket quest, a stethoscope for the clinic. Tapping a patch replays that errand. So the quilt doubles as the level select screen, and revisiting old material is framed as looking at something you made.

**Pocket money** sits alongside it as a small spendable currency, earned from errands and given at Eid. It buys nothing cosmetic. It buys things that change play: an extra few seconds on a timed scene, a hint that pauses the clock, a new shelf for Nani's kitchen that opens a new set of words. Money that buys content is content. Money that buys hats is grinding.



## Part 2. Learning design, skill channels and procedural generation (Roadmap)


> from: docs/archive/design-v1/Roadmap and Story Structure.md § Learning design decisions

### Learning design decisions

- **New words per errand scales with pace, not with a level.** Three new words per errand to start; a player whose words reach produce stage quickly is offered up to five or six. Still per word, never labelled easy or hard.
- **Pre-exposure:** at the bowl/pot step, Nani names things she has already added so the next errand's words are heard before they're taught.
- **Recipes are the unit of an errand**, tied to story events. Mixed categories (fruit + veg + spice) aid discrimination.
- **Errand lists are generated**: words due for review plus new words, decoys chosen to look alike. (Hand-written for the fruit bowl only.)
- **The shopping list shows Kutchi (romanised) plus a play button**, never a picture and never English. English is one tap away.
- **Quantities are shown and heard.** The list shows "2 × santra" with dots that fill in; Nani says the plural sentence when the quantity is more than 1. *Supersedes the earlier "no digits on the list" decision, after playtest 1 showed players couldn't tell how many to buy.*
- **Pantry gaps are the item's outline shape**, pulsing as Nani names it, on first meeting only.
- **Glow is a hint, not a giveaway:** only after a wrong tap or ~5 seconds of hesitation.
- **A word advances a stage on correct recall from the Kutchi**, not on being seen. Two misses drop it a stage.
- **The recipe list looks like a paper recipe card**, with Kutchi written over it; later it moves into the world.


> from: docs/archive/design-v1/Roadmap and Story Structure.md § Skill channels: listening, reading, speaking, writing

### Skill channels: listening, reading, speaking, writing

| Skill | Role | How it's checked | Constraint |
| --- | --- | --- | --- |
| Listening | The core; every errand runs on it | Act on it, the task is the test | None |
| Reading | Optional helper, romanised only | Read the list, tap the item | Gated by the profile's reads flag |
| Speaking | The real goal for adults | Record and compare; Grandparent mode; later the eight-word classifier | No Kutchi speech recognition exists |
| Writing | Adults and older children only | Typed romanised, matched generously | Gated by the profile's writes flag; no handwriting |

The channel is chosen per word, inside ordinary play, by that word's own stage:

| Rung | Player gets | Player does | Unlocks when |
| --- | --- | --- | --- |
| 1 | Audio + picture + hint glow | Tap | First meeting |
| 2 | Audio, help fading | Tap | understand_stage 2 to 3 |
| 3 | Romanised text only | Tap | understand_stage 3+, reads profile only |
| 4 | Picture only | Say it (role reversal: player is the shopkeeper) | produce_stage 3+ |
| 5 | Audio | Type it (notebook, thread quest) | produce_stage 3+, writes profile only |
| 6 | A question in context | Answer aloud | produce_stage 5, Grandparent mode now, classifier later |

**The word's stage** decides the channel and support; **the story arc** decides how complex the sentences around it are.


> from: docs/archive/design-v1/Roadmap and Story Structure.md § Procedural generation and the errand pipeline

### Procedural generation and the errand pipeline

Once a mode's first errand is built well, later errands in that mode are generated: pick due and new words, pick hotspots and decoys, assemble the line from existing recorded chunks (see the Technical Plan's chunked-recording model), and place them in a scene. The generator only picks combinations whose chunks already exist, and outputs the recording list for the family's next session. The story spine (chapter openings, complications, payoffs, beats) stays hand-written.



## Part 3. Upgrades


> from: docs/archive/design-v1/game-modes-v2.md § §3 In-game upgrades (Zafar's idea: tycoon-style choices inside each game)

### 3. In-game upgrades (Zafar's idea: tycoon-style choices inside each game)

**Rules:**
- Coins go into one wallet, earned in any game.
- **Each game has its own shop** of upgrades that **change how it plays**.
- Space or slots are limited, so **every purchase is a choice**.
- **Upgrades only ever automate physical steps, never the listening.** You still have to understand the order.

**Cook with Nani, for example:**

| Upgrade | Effect | Trade-off |
|---|---|---|
| Sharp knife | One swipe per cut instead of two | Cheap and early; everyone wants it |
| Chai machine | Pours and brews chai automatically | Takes a counter slot. Great if your customers order chai a lot |
| Second burner | Two pots cook at once | Expensive; pays off in the busy setting |
| Bigger pantry | More ingredients and recipes unlocked | Opens bigger orders (more coins, harder listening) |
| Tawa upgrade | Rotis cook faster | Only useful once you've unlocked roti |
| A cousin as helper | Auto-washes vegetables | Costs coins every day (a running wage), like a tycoon game |

A **counter with 4 slots** forces the classic decision: chai machine *or* second burner *or* spice rack. Different players build different kitchens.

**Other games:**
- **Find it:** a torch (for night scenes), a faster hint recharge, a bigger bag (longer lists, more coins).
- **Dress up:** new wardrobe sets.
- **Clinic:** better instruments that speed up examinations.

---


> from: docs/archive/build-logs/cook-with-nani-build-log.md § Cook build log §8 Station upgrades: in the build now, and what the real upgrade could be

### 8. Station upgrades: in the build now, and what the real upgrade could be

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

