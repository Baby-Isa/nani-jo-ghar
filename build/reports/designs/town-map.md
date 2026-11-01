# The town map: who goes where (slug: town-map)

Designed overnight on 1 Nov 2026, while Zafar slept, and revised the same night after an independent critique (`town-map-critique.md`; every finding and what I did is in §12). Every choice he hasn't made himself is in §10, so he can reverse it. This is a design only: no code, no data, and no invented Kutchi. Kutchi in *italics* is copied from the repo (`research-word-inventory-2026-10-31.csv`). Everything else is in English and marked "to record".

Sources, newest first:
- Zafar's scope for this game (1 Nov: the tilted map, 8 places on phones and up to 12 on big screens, swappable tiles, the row of faces, the walk, the "I want a book" level, people come back, rotate who wants what, directions later, and the three mock-up fixes).
- The critique of this design (`town-map-critique.md`, 1 Nov).
- The master map's row for the town map and its Part 7 (`games-master-map-2026-10-31.md`).
- His notes (`game-settings-map-2026-10-31.md`: "Places in town").
- Idea 72 and idea 80 (`docs/ideas.md`).
- The mock-ups (`sources/art/mockup-town-2026-10-31/`) and their prompts (`build/reports/town-places-mockup-2026-10-31.md`).
- The research (`research-other-games-2026-10-31.md` §2).
- The lessons checklist (`designs/lessons-checklist-2026-11-01.md`).
- The rulebook (`docs/game-design/rulebook.md` §1), `guide-and-card.md` (R3, R4), `cast.md`.
- The sibling designs it shares pieces with: `farm-animals.md` (the animal actor), `do-it-engine.md` (the call and speech queue), `party-guests.md` (the "I'm ___" recordings), `shops.md` (decision 12, the lanes).

---

## 0. One line

**What it is:** a toy town seen from about 50° above. A column (phones) or row (big screens) of family faces waits at the edge. The child taps a person, then the place the heard sentence names. That person walks along the road, goes in, and comes back out carrying something (a book, a loaf, a duck following them home).

- **Day:** town and shops. It opens the day: the bus drops the family in town, everyone runs their errands, and then the camera glides into the market for the shops games.
- **Status:** new → designed (this doc), revised after the critique. The mock-up is approved, with three fixes.
- **Engine:** **put it in its place** (person to place; Tidy's greybox place engine, designed for Sprint 10), plus:
  - the shared order card, guide box, face circle, light, bulb, word card, end screen and say-it moment (`js/shared/`);
  - **the farm's animal actor** (`farm-animals.md`, "New to build" 1), with two additions: a multi-point road path and a carried-thing slot. It is counted as new in the farm's list, not here; whichever design is built first builds it (decision 23).
  - the do-it engine's speech queue (`do-it-engine.md`), so no two voices ever overlap.
- **Rough size:** small. The code is a reskin, the tile map, the errand drawer, and the actor's path and carry slot. The art for visit 1 is one run of about 31 pieces (§7); everything for later visits is a later run.
- **The builder's scope is forms A and B (visit 1) only.** Forms C, D and E are later-visit notes in §5.

---

## 1. The language goal

**Word groups:**
- Main: places in town (22 targeted, 1 recorded; this is its only home), and want (verb 6).
- Supporting: family (the who), go and come back (verb 3), and nouns by inference (book, bread, onions, letter, medicine, all met elsewhere).
- Later visits: positions and directions (next to, behind, in front of, opposite) and linking words (first, then).

**Key:**
- ✓ means a family take exists (the whole line, or the word alone).
- "heard inside" means the word is heard only inside longer recorded lines.
- "engine" means it's in the language engine but not recorded.
- "to record" means it's not in the repo; English only.

### The places (the deciding words at L1-L2)

Phones show 8 plots and big screens 12 (§7). The tiles can be swapped, so each visit picks its set from this pool.

**The places (decision 17; Zafar, 1 Nov: use popular places).** The first visit's 8 are the popular places below. The want ("I want a book") still teaches Kutchi even when the place word is English, so the places are no longer gated on Mum's answer. Mum still says which places the family names in Kutchi and which as English loans ("library", "post office", "school" and "station" are the likely loans): a loan place word is still asked at L1-L2 inside Mum's Kutchi sentence, and the leak bot reports that move as one a child with English can win; L1 keeps the market (*bajaar*), so a real Kutchi word decides from the first round, and from L3 the deciding word is the thing or the need.

| Place | Status | Kutchi in the repo | First visit (provisional) |
|---|---|---|---|
| the market (the fruit and veg stalls; the day continues here) | engine (inside "go to the market", a handout draft Mum hasn't confirmed) | *bajaar* (in *bajaar mai vaan*, engine) | **L1** |
| the park (the only playground) | to record | | L1 |
| the bakery | to record | | L1 |
| the library | to record (likely loan) | | L2 |
| the clinic (the doctor's; the mock-up's "hospital") | to record | | L2 |
| the post office | to record (likely loan) | | L3 |
| the school | to record (likely loan) | | L3 |
| the fire station | to record | | L4 |
| the café (a chai café) | to record | | visit 2, every device |
| the toy shop | to record | | visit 2, every device |
| the train station | to record (likely loan) | | visit 2, every device |
| the cloth shop (Big Ma's cloth, for the sewing day) | to record | | visit 2, every device |
| a house; Big Ma's house (directions visit) | engine | *ghar* (house, engine) | visit 3 |
| the bus stop (where the day starts; not a tile) | to record | | always |

**Recorded today: 0 of the 12 places.** *bajaar* is the only place word in the engine, which is why the market moves into L1 (the critique's finding 1): at least one real Kutchi word decides from the first round, and "let's go to the market" (F8) lands on a place the child has already sent someone to. Until Mum records them, every place is a grey English placeholder, which is a reader's win (lessons §1). **L1-L2 count as teaching only once their open places are recorded and confirmed as Kutchi, not loans** (§9 row 1). If fewer than three of the eight are Kutchi, L1-L2 still play (they teach the frame and the who) but are not counted, and the test sits at L3-L4 (open question 1).

### The people (the who, from L2)

One cast on every device for visit 1 (decision 14):

| Person | When | Status | Kutchi in the repo | Face art |
|---|---|---|---|---|
| Nana | L1 on | ✓ | *Nana* | exists (`data/faces.json`) |
| Hannah Mami | L1 on, **first in the face row** (Zafar, 1 Nov: she's seen more and is more recognisable) | to record | | to make (a character, not a likeness; run 1) |
| Ma | L2 on, off the same bus | engine | *Ma* | to make (generic; run 1) |
| Big Ma | L1 on | ✓ | *Big Ma*; also *wadima* ✓ | to make (a character, not a likeness: Zafar, 1 Nov) |
| Ali (stays home; things are carried "for Ali") | never on the map | ✓ | *Ali* | |
| Nani (the host; the off-screen guide in the box; she relays the asks from L2) | the guide box only | ✓ | *Nani* | exists |

### The things wanted (L3, Zafar's "I want a book")

| Thing | Place | Status | Kutchi in the repo |
|---|---|---|---|
| a book | library | to record | |
| bread (Mum: which word the family uses for a bakery loaf) | bakery | to record | (*maani* ✓ is chapati, not a loaf) |
| onions | market | ✓ | *dungri* |
| mangoes | market | heard inside | *ambo / aamo* |
| bananas | market | engine | *kelo* |
| a letter | post office | to record | |
| medicine | clinic | engine (heard inside 1 line) | *dawa* |
| Ali's jumper (left at school) | school | to record | |
| the swings | park | to record | |
| *Visit 2:* chai, a ball for Ali, cloth for Big Ma, the fire engine (to see it) | café, toy shop, cloth shop, fire station | chai heard inside; the rest to record | *chai* |

### The needs not drawn on any sign (L4)

Visit 1's set is the same on every device (decision 15), and every need has **exactly one plausible open place** (the drawer's rule, checked by Mum and then by the bot per open set).

| Need | Place | Visit | Status | Kutchi in the repo |
|---|---|---|---|---|
| I feel poorly / my tummy hurts | clinic | 1 | to record (the clinic's "I don't feel well" is an English placeholder; record it once, for both games) | |
| I want to play / I want to run | park | 1 | to record; run is engine | *bhaj* (run, engine) |
| we need to cook | market | 1 | ✓ | *panke randhnu khapdo* |
| I want to read | library | 1 | to record ("read" has no other home on the map, master map Part 3) | |
| I'm thirsty | café | 2 | to record: **the party's row** ("I'm thirsty", `party-guests.md`), so Mum records it once | |
| I want to sit down | café | 2 | to record; sit is engine | *we* (sit, engine) |
| Hannah Mami is coming (on the train) | station | 2 | to record; "will come (an elder)" is engine | *e achda* (engine) |
| a present for Ali | toy shop | 2 | to record | |
| I want to send this (a parcel) | post office | 2 | to record | |
| I want to try on a fire helmet | fire station | 2 | to record | |

"We need to cook" stands only if Mum agrees an open bakery doesn't also answer it (open question 4). If she says it does, it leaves L4 and "I want to read" and the other two carry the level.

### Verbs

- **go:** *winnu* (to go; heard inside 8 lines), *winja* (let's go; heard inside), *vaan* (in "go to the market", engine).
- **want:** *khape* (be wanted; heard inside 22 lines; *anke kuro khapeto* ✓ "what would you like?" to an adult), *aaye* (want to, after a "to do" word; heard inside 3 lines).
- **come back, went:** *e achi vya* (he/she came, an elder; engine), *vyo* (went; heard inside).
- **Smaller verbs:** buy (*ginech*, heard inside 1 line), bring (*khanech*, heard inside), give (*de*, heard inside: "this is for Ali").

### Frames heard (built by the engine from recorded pieces; no hand-written fragments)

| ID | Frame (English) | Who says it | Level | Built from |
|---|---|---|---|---|
| F1 | "I want to go to the {place}." | the person, in a bubble at their face circle | L1 | *muke … winnu aaye* (heard inside) + the place: to record as whole lines or as a frame with the place words |
| F2 | "{Person} wants to go to the {place}." | Nani (guide box) | L2 | to record (the third-person form) |
| F3 | "{Person} wants {a thing}." | Nani | L3 | *khape* forms (heard inside 22 lines); to record per thing |
| F4 | "{Person} {need}." ("Nana feels poorly", "Big Ma wants to read") | Nani | L4 | to record |
| F5 | "I went to the {place}!" / "I've got {the thing}!" | the person, on the way back (skipped for a wave if another line is due) | all | *vyo* (heard inside); to record |
| F6 | "Not here!" | the person, on a miss | all | to record ("here" *hida* ✓ and "not now" *hever na* ✓ exist; the whole line is Mum's) |
| F7 | "Well done, dear." | Nani | end | ✓ *shabash, beta* |
| F8 | "Let's go to the market." | Nani | end | "come, let's go to the kitchen" ✓ *hal, rasore me winja* is the recorded shape; the market line is to record (*bajaar mai vaan*, engine, is "go to the market") |
| F9-F11 | first-then, positions, "where shall I go?" | | later visits | see §5 |

### New words per level (first visit)

| Level | New | Comes back |
|---|---|---|
| L1 | 3 places (market, park, bakery) and F1 | |
| L2 | 2 places (library, clinic), Ma, and F2 | Nana ✓, Big Ma ✓, Hannah Mami |
| L3 | 4 things (book, bread, letter, medicine *dawa*) and F3; 2 places open (post office, school) | onions ✓ (Cook) |
| L4 | 3-4 needs (feel poorly, want to play, want to read; "we need to cook" ✓ if Mum agrees) and 1 place open as a decoy (fire station) | |

That's 3 to 5 new words a round, each heard at least 3 times a round: in the call, in the person's line on the way back (F5) or on the card's speaker, and on the end word card. That meets lessons §10.

---

## 2. Where it sits in its day

**The day (town and shops, hosted by Nani).** It's a sunny day. This overrides the shops day's rainy door of 19 Oct (decision 2): his "no rain or umbrella beats for now" (`days/shops.md`) left the beats out but not the rain itself, so it's his to reverse.

| # | Stage | What carries in or out |
|---|---|---|
| 1 | The door | Nani: "today we're going to town" (to record). The sky is sunny. |
| 2 | Pack the bag | The shopping bag and the purse, **a mango for later** (served at the map's end), and **the letter for the post office**, so the child has seen it before the map asks for it. |
| 3 | The ride (the bus) | The window ride ends with the bus pulling in, and the town map opens on **the same bus at the same stop** (one cut, no new scene). |
| 4 | **The town map (this game)** | The family gets off and splits up to run errands, then everyone meets back at the bus stop with their things. |
| 5 | Into the market | The camera glides into the market tile and the shops games start (the stalls, the scales, pay; `shops.md`). The lanes and the goat stay kept for a later shops visit (`shops.md` decision 12; decision 30 here). |
| 6 | Home: put the shopping away | The bread and the onions go to the pantry, **the book is for Ali**. (From visit 2: the ball for Ali, and **the cloth goes to Big Ma's room**, which seeds the sewing day.) |
| 7 | The evening book | One page per errand: "Nana went to the library" (F5 in the past). Nani reads Ali's new book to him (the library's book turns up again; Toca Town's carry-it-home idea). |

**What it carries into the shops:**
- The word *bajaar* (market) is heard from L1 and at the end of every round, and someone has already been sent there.
- Onions ✓ and mangoes come back at the fruit stall.
- "Want" (*khape*) is the shops' own verb ("what would you like?" ✓ *anke kuro khapeto*), so the inference level here warms it up.

**What it takes from earlier days:**
- the clinic's "I feel poorly" and *dawa* (L4 sends someone to the clinic);
- Cook's onions;
- the family names from the kitchen and the party.

**Free play:** the map can be played alone (lab and free play), starting and ending at the bus stop. Its end is then the shared end screen rather than the glide into the market.

---

## 3. The stages and mini-games

It's one map and one gesture all game: **tap a face, then tap a place.** What changes is what the heard sentence says. Visit 1 is two forms on a level ladder: A (L1-L2) and B (L3-L4). The later-visit forms (C, D, E) are notes in §5, outside the builder's scope.

**The pieces on screen:**
- **The map.** Plots on a looping road. **Open** places have their door open, a warm light inside and their awning out. **Closed** places have the door shut and the awning rolled in; they're dimmed and can't be tapped (a tap gets a soft knock and nothing else). The bus stop sits at the map's edge with the bus and Nani's shopping bag (no Nani: she is the off-screen guide).
- **The faces** (big screens: a row along the bottom; phones: a column on the right, under the cog's reserved square, §7). Shared face circles at the big size, four at most on visit 1. **Every face is live all the time:** a person who is out on an errand keeps a full-colour circle and can still be called and sent (their small figure on the map shows where they are). Nothing about the faces narrows the choice.
- **The order card** (left; shared). One row per errand: the face, the Kutchi line and a speaker. The place's picture shows at L1; from L2 it shows only on the hint clock or after a miss (the card rule, below).
- **Nani in the guide box** (off screen, as in the pantry; `guide-and-card.md` R3). She says the step and, from L2, the calls. Her face appears once (R4). The people on the map speak from **bubbles at their face circles**, never from the box.

**What happens in one errand:**
1. The call is heard (L1: the person, in a bubble at their face; from L2: Nani, in the box).
2. The child taps a face, and it lifts with the shared lit ring. Tapping another face swaps the choice (undo).
3. The child taps a place.
   - **Right:** the person's small figure steps off at the bus stop (or, if they were out, finishes their walk to the stop and turns straight round), walks the road, goes in (a door chime and a warm glow in the window), and comes out carrying the thing. On the way back they say F5 ("I've got a book!") if no other line is due, or wave if one is. They pop back into their face circle, which now wears the carried thing as a small badge, and the card row ticks as the person reaches the stop.
   - **Wrong place:** the miss rule (below).
   - **A place before a face** (likely at 3): the place gives a small "who?" shrug and the faces bounce once. No sound, no cost.
4. The walk takes about 2.5 s each way. **Hurrying:** when no face is lifted, a tap within a walker's tile-sized hit area (at least 64 px, centred on the walker; the nearest walker if two overlap) gives them a little skip. When a face is lifted, map taps are place picks. A tap anywhere in the play area also skips speech (rulebook "Skipping"). **From L2 the next call doesn't wait for the walk**, so two or three people can be out at once, and the town feels busy, never slow.

**The miss rule** (decision 25; it replaces "a miss costs nothing"):
- **First go right:** the row ticks solid.
- **After a miss:** the face stays lifted and the child tries again on the spot. Nani says the call again. When the errand closes, its row gets a **hollow tick**: progress, not a verdict, and nothing frowns.
- A miss **resets that errand's deciding word on its ladder** (the place at L1-L2, the thing at L3, the need at L4; "a miss brings it back", rulebook).
- For level-up, **a round with any miss counts as a round with a hint**.
- **Each place's funny refusal plays once per round.** After that, a miss there is the shared shake and F6 ("not here!") only, so the refusals stay a surprise, not a toy.
- No glow ever lands on the answer after a miss; the hint clock runs as usual.

**The card rule** (decision 28): at L1 the card pops with the face, the place's picture, the Kutchi and the English (L1 only), as the tutorial. From L2 it pops with the face, the Kutchi and a speaker only; the place's picture (L2) or the thing's (L3, blurred) appears **on the hint clock or after a miss**. A pick made after the picture showed is a supported pick (it moves the word's ladder, non-negotiable 4, but the round counts as hinted).

**The speech queue** (decision 27; the do-it engine's): one voice at a time. A call waits for the current line to finish; F5 is dropped for a wave when a call or another F5 is due; Nani's hint repeat waits its turn. Never two voices at once.

**People come back (Zafar's rule):** every person returns to the face column or row, so the whole family is always in play. **Anyone can be called at any time,** including someone still out (decision 26): they pick the new errand up when they're back at the stop. Calls are drawn **with replacement**: the same person can be asked twice in a round, and a place can be asked twice, though **never the same place twice running from L2** (L1 has only three places, so the rule would hand the child its second answer). The round ends after its set number of errands, never when "everyone has been". So the last move is never free.

**Rotate who wants what:** who wants which place is drawn fresh each round. The drawer's rules: no person-place pair repeats from the round before, and no person always gets the same place across a visit.

**The layout per visit:** the tiles are shuffled onto the plots once per visit (a new town arrangement each day the town is played), then fixed for that visit. Positions are never the answer: the heard word and the building decide. The answer's distance from the bus stop is spread evenly **by the drawer at run time** (the tiles move, so data can't know it) and checked by the bot.

### Each place's funny refusal on a miss (once per place per round, never a frown)

| Place | The refusal |
|---|---|
| Market | an orange rolls out, stops, and rolls back in |
| Park | the ducks quack and paddle away |
| Bakery | a soft puff of flour out of the door |
| Library | the door opens a crack and a finger goes to someone's lips: "shh!" (a sound, no words) |
| Clinic | the door opens and a friendly doctor waves "not today" |
| Post office | the postbox gives a little hop and a "clunk" |
| School | a little bell rings and the gate swings shut |
| Fire station | the fire engine's bell dings once |
| *Visit 2:* café, toy shop, station, cloth shop | the kettle whistles; a balloon bobs and squeaks; the little train toots; a bolt of cloth unrolls and rolls back |

### What each person carries out (the delight on a right pick)

| Place | Comes out with | The touch that makes it funny |
|---|---|---|
| Market | a bag of onions | one onion rolls out; they chase it and pop it back |
| Park | windswept hair | **a duck waddles behind them** to the bus stop, then flaps home |
| Bakery | a long loaf over the shoulder | a dab of flour on the nose |
| Library | a stack of books (one for Ali) | the stack wobbles at every step |
| Clinic | **an apple** (the clinic's own send-off: an apple, never a lolly, H33) | they polish the apple on their sleeve |
| Post office | goes in holding the letter, comes out empty-handed | a happy wave; the postbox burps softly |
| School | Ali's jumper | it's far too small for them; they hold it up and laugh |
| Fire station | a shiny fire helmet on their head (it stays on until the end) | it slips over their eyes once |
| *Visit 2* | chai, a ball, a roll of red cloth, Hannah Mami off the train | a sip and an "aah"; one bounce; it trails like a cape; Hannah Mami waves from the platform |

### A. Who wants to go where (L1-L2)

| Question | Answer | Score |
|---|---|---|
| What do you do? | Tap a face, then tap a place. They walk there and come back with something. Two taps, one gesture kind, all game. | 5 |
| Where is the challenge? Does the Kutchi decide? | At L1, the place word (1 of 3 open places), with the who given (the child picks any face, and that person says their own line). At L2, two words, **who and where** ("Nana wants to go to the clinic"): 1 of 4 live faces and 1 of 5 places. Only places whose family word is Kutchi decide at L1-L2 (the gate, §1). | 4 (5 once Mum confirms the L1-L2 places are Kutchi and they're recorded) |
| Where is the fun? | The little walk, going in, and coming out carrying the thing (Toca Town's best-loved touch); the duck; the busy town from L2. | 5 |
| Where is the instruction? | The asker speaks first: the person at L1 (a bubble at their face circle), Nani at L2 (the guide box). Each errand's card pops big beside the side panel, then flies into its row. | 5 |
| What is novel? | The only game about places in town, and the only one where the child sends people somewhere. | 5 |

### B. What do they want? (L3-L4, Zafar's level)

| Question | Answer | Score |
|---|---|---|
| What do you do? | The same two taps. | 5 |
| Where is the challenge? Does the Kutchi decide? | The place is never named. At L3, the thing ("Big Ma wants a book"). At L4, a need not drawn on any sign ("Nana feels poorly" → the clinic; "Ma wants to play" → the park). The child must know the Kutchi noun or need, then think where it's found. It can't be matched word for word. Loan place names don't help here: the place is never said. | 5 |
| Where is the fun? | Working it out; the comic returns (the fire helmet, the duck, the wobbling books). | 5 |
| Where is the instruction? | Nani's call. The card holds the words and a speaker; the thing's picture (blurred) comes only on the hint clock or after a miss. | 4 |
| What is novel? | The only inference game. It reuses nouns from Cook, the clinic and the shops in a new seat. | 5 |

**Kept for visit 1: A, B.** C, D and E are kept as later-visit notes in §5 (Zafar's "later: directions"; no mechanic dropped).

**Parked in "maybe later":**
- **Where did Nana go?** The child watches someone go in somewhere, then is asked which place. It's memory, not Kutchi. Score 12.
- **Deliver the post:** a postman with letters to houses. It needs numbered houses, which means digits, and it duplicates D. Score 13.
- **Rush hour:** a bus timer before everyone's back. Timers fight listening (mechanics research, finding 4). Score 11.

### The level ladder (the first visit: A at L1-L2, B at L3-L4)

How many errands: up to 5 at L4. The rulebook formula gives 1, 2, 4, 5; **L1 is overridden to 2** (a round of one is over before it starts). Open places follow the rulebook's decoys (1, 2, 3, 4) on top of the round's distinct places. **Every device has the same open sets, faces and needs through L4** (decision 19).

| Level | Adds one thing | Errands | Open places (of 8) | Faces | The calls |
|---|---|---|---|---|---|
| **L1** | the core: the place word | 2 | 3 (market, park, bakery: clearly different shapes and colours) | 3 (Hannah Mami first in the row, Nana, Big Ma) | The child taps any face, and that person says F1, "I want to go to the market". Only "yes" asks. The card shows the place's picture, its Kutchi, and the English (L1 only). |
| **L2** | two words: who + where | 3 | 5 (adds the library and the clinic) | 4 (Ma steps off the bus with the others) | Nani: "Nana wants to go to the clinic" (F2). From here the faces don't speak first, so the who is heard. The card shows no picture until the hint or a miss, and its English is gone. People are out at the same time, and anyone can still be called. Never the same place twice running. |
| **L3** | other ways of saying it: the thing, not the place | 4 | 7 (adds the post office and the school) | 4 | Nani: "Big Ma wants a book" (F3). The thing's picture is blurred and comes only on the hint or a miss. One carried thing a round is for Ali. |
| **L4** | needs not drawn on any sign, and a look-alike | 5 | 8 (all; adds the fire station as a decoy) | 4 | Nani: "Nana feels poorly", "Ma wants to play", "Big Ma wants to read", "we need to cook" ✓ (→ the market, if Mum agrees). **The look-alike pair, the bakery and the market (both food), is always open together**, and every need has exactly one plausible open place. A vague want ("hungry") is never a call. |

The gestures never change. The Kutchi climbs from the place name, to who and where, to the thing, to the need.

**Level up:** after 3 rounds with at most one hint each and no miss (Zafar, 1 Nov: only right-first-time rounds, in every game); never down (rulebook).

**Big screens:** the same open counts, faces and needs as phones at L1-L4, so the game is equally hard on every device. The 4 extra plots hold gardens painted into the big base map on visit 1 (houses come with visit 3's art run). Later visits may open up to 12 places on big screens (§5).

### The leak test (forms A and B)

| Way to cheat | How it would work | Fix |
|---|---|---|
| **Reading** | <ul><li>Signs with writing.</li><li>The card's text.</li><li>Grey English placeholders ("the library").</li><li>Place words that are English loans in Kutchi.</li><li>Names on the card ("Nana" reads as itself).</li></ul> | <ul><li>No writing anywhere on the map (art rule).</li><li>The card's English shows at L1 only; from L2 it's gone.</li><li>Grey English is a reader's win, so the leak bot plays recorded words only, and the game counts as teaching only once the places are recorded (decision 17).</li><li>**Loans:** the L1-L2 places are chosen after Mum's answer, and only Kutchi place words decide there. The **loan-aware bot** treats every loan word and every name as known and must still win under 10% of L2 rounds. A loan place opens only from L3, where the place is never said.</li><li>A readable name gives away the who but never the where.</li></ul> |
| **Matching** | <ul><li>The card's picture matches the building.</li><li>"I want a book" matches the giant book over the library door.</li></ul> | <ul><li>From L2 the card has no picture until the hint clock or a miss (the card rule), so the picture can't be matched before the word is tried. At L1 it shows, as the tutorial.</li><li>Matching "book" to the sign's book still needs the Kutchi for book: it's listening, not a leak. But it's no harder than the place name (research §2), so **L4 uses only needs that aren't drawn on any sign**: poorly → the clinic (heart emblem), play → the park, read → the library (an open book, not reading), cook → the market.</li><li>The reader bot reads the card's picture whenever it shows, as well as its text.</li></ul> |
| **Eliminating** | <ul><li>As people leave, fewer faces and places are left, so the last move is free.</li><li>Faces out on an errand form a visible shortlist.</li><li>Tapping every open place in turn always wins (fishing).</li></ul> | <ul><li>People come back; calls are drawn with replacement; a place can be asked twice; the round ends on a count of errands, not when everyone's had a turn.</li><li>**Every face stays live and callable while out** (decision 26): the who is always 1 of all the faces, never a shortlist.</li><li>Closed places are never answers, but they're not choices either (dim and untappable), so they narrow nothing.</li><li>**Fishing:** only a first go ticks solid; a miss resets the word, counts as a hint for level-up, and its funny refusal plays once a round (the miss rule). Fishing finishes the errand but never moves a level or a word.</li></ul> |
| **Patterns** | Nana always goes to the bakery; the calls follow the row's order; the answer is always the nearest place; a place never comes twice running. | <ul><li>Who wants what is drawn fresh each round, with no pair repeating from the last round.</li><li>The call order is random.</li><li>The tiles are shuffled onto the plots each visit.</li><li>The answer's distance from the stop is spread by the drawer at run time and checked by the pattern bot.</li><li>The no-repeat-place rule from L2 is counted in the odds below.</li></ul> |
| **Waiting** | A glow lands on the answer; someone walks off by themselves. | <ul><li>No glow ever lands on the answer after the guided first errand.</li><li>The hint (7, 9, 11 or 13 s from the last action) is the call said again plus the card's picture; it makes the round count as hinted.</li><li>The bulb opens the helper card (the place's picture, Kutchi and English) and costs a bulb.</li><li>Nobody moves until sent.</li></ul> |

**The Sceptic's odds** (first-go solid ticks, the only ones that move a level; she knows the no-repeat rule and skips the last place):
- **L2:** 1 in 4 for the face (all four live) and 1 in 4 for the place (5 open, less the last one) is 1 in 16 a call. Three first-go calls in a round by chance: about 1 in 4,000.
- **The loan-aware bot at L2:** it knows the names, so it wins the who; the where is 1 in 4 if the open places are Kutchi, so three first goes is about 1 in 64 (under 2%). If the open places were loans it would win every round, which is why the gate exists.
- **L3 (Big Ma wants a book):** she reads "Big Ma" on the card. The thing is a Kutchi noun with no picture until the hint, against 7 open places less the last: 1 in 6 a call, about 1 in 1,300 for a round of 4.
- **L4:** the need isn't on any sign, and a look-alike is always open: 1 in 7 a call, about 1 in 17,000 for a round of 5.

**Bot target:** a learned save with no Kutchi wins under 10% of rounds at L2-L4. Variants: **reader** (reads the card's text and picture when shown), **pattern** (row order, distance, last place), **loan-aware** (knows every loan word and name), and **fisher** (taps open places in turn; must never level up). It plays recorded words only, and it checks the one-plausible-place rule per L4 open set.

### The delight moment

The walk out and the return. The child sends someone, watches them go in, and they come out with something that's a little funny (the wobbling books, the duck that follows them home, the helmet over the eyes).

The end of the round is the **return parade:** everyone back at the bus stop, each holding up their thing, which then plops into Nani's big shopping bag at the stop. Nani (from the box): "well done, dear", and a slice of the mango she packed at the door comes up out of the bag to the child (fruit is the treat): "aah". Then the word card.

### The speaking moment

Not on visit 1. Form E (§5) brings it on visit 2, following `docs/game-design/speaking.md`: watched first, then handed over, a closed set of 3, never a gate.

---

## 4. The child's first-ever round, screen by screen

L1, a phone at 740x320, after the bus ride. It's guided and unscored (D13), and every new action is shown once (rulebook "Showing what to do"). The open set is the market, the park and the bakery.

1. **The bus pulls in** at the stop on the left of the map (the same bus as the ride). Hannah Mami, Nana and Big Ma step off one by one and pop into their face circles in the column on the right, below the cog, Hannah Mami at the top. Nani's shopping bag sits at the stop. The map is lit and calm. Three places are open (the market, the park and the bakery, with doors open and warm windows); the other five are closed and dimmed. **Silence for two seconds** so the child can look.
2. **Nani (guide box, off screen):** "Let's go to town!" (to record). She speaks first. No card yet.
3. **The lit ring on Nana's face circle** (the shared face circle's lit state: a breathing gold ring round the circle, never a box over the face). Everything else dims. The child taps Nana. His face lifts and he says F1 from a bubble at his circle: **"I want to go to the park."** The card pops big beside the side panel (Nana's face, the park's picture, the Kutchi, the English under it, a speaker), then flies into row 1.
4. **The lit box moves to the park** (this first errand only: the guided showing). The child taps it. Nana's small figure steps off at the stop and walks the road. **The hurry is shown once:** a soft glow round Nana's tap area; a tap gives a little skip. He goes through the park gate, the ducks paddle over, and he comes back with his hair windswept and **a duck waddling behind him**. On the way he says F5: "I went to the park!" He reaches the stop, the duck flaps home, he pops back into his circle, and **row 1 ticks**.
5. **Nani:** "Your turn" (to record). The light clears fully, all three faces are live, and nothing glows. The child taps Big Ma. She says: **"I want to go to the bakery."** Her card pops and flies to row 2.
6. **The child taps the bakery.** A puff of flour comes out of the door. Big Ma walks in, comes out with a long loaf over her shoulder and flour on her nose, says "I've got bread!" on the way back, and **row 2 ticks**.
   - **If the child taps a wrong place first** (say the market): the orange rolls out and back (the market's refusal, shown on this first real miss, whenever it happens), Big Ma shakes her head ("not here!", F6), and her line plays once more. No glow lands on the answer. When she's back with the loaf, row 2 gets a **hollow tick**. The round is unscored, so nothing else changes.
   - **If the child taps a place before a face:** the place shrugs "who?" and the faces bounce once.
7. **The return parade.** Hannah Mami, Nana and Big Ma gather at the stop. The loaf goes into Nani's bag. Nani (box): **"Well done, dear"** ✓ *shabash, beta*. A slice of the mango she packed at the door comes up out of the bag: "aah".
8. **The end:** Nani says **"Let's go to the market"** (F8). In story mode, the camera glides into the market tile, and the shops begin. In free play, the shared two-page end screen shows the round's word cards (park, bakery; market heard), the ticks, and progress, not a verdict.

The round lasts about 90 seconds. The child touched every action once: a face, a place and hurrying the walker. A miss and its refusal are shown when the first real miss happens, not scripted.

---

## 5. Later visits and harder versions

Notes only: not in the builder's scope for visit 1, and not in run 1's art. Each keeps the map and the gesture; new places, people, wants and positions are data.

| Visit | What's new | Form |
|---|---|---|
| 1 | The first round, then L1-L4 as above | A, B |
| 2 | The café, toy shop, station and cloth shop open **on every device** (four of visit 1's tiles swap out on phones). Hannah Mami can arrive on the train. Thirsty → the café. First-then errands. The speaking handover. | B, C, E |
| 3 | Directions with identical houses. | D |
| 4 | The want plus a position; big screens open up to 12 places. | B + D |
| Later | **The town as the trip picker** (idea 72): the free-play map could reuse these tiles. A separate design. | |

**C. First, then (visit 2, L3+).** Tap a face, then two places in order: "first the post office, then the bakery" (F9: *pela*, first, engine + *ne poi* ✓, and then). The card's row holds two place slots that fill in order. A wrong order: the person reaches the second place and finds it shut for a moment ("not yet!"), and the call is said again. *Leak:* two places and their order are heard; neither slot shows a picture until the hint; the miss rule applies to the pair.

**D. Next to the park (visit 3, Zafar's "later: directions").** Three or four identical houses stand on free plots; only the position word and a known landmark tell them apart: "Big Ma's house is next to the park" (F10: *bajume*, *agiya*, *same*, engine; *puthiya* heard inside 4). Positions climb: next to and in front of, then behind, then opposite. The right house opens and Big Ma waves; at a wrong one a cat blinks and draws the curtain. *Leak:* the houses are one tile drawn once and placed by code, so they are identical by construction; the light never rests on the answer; 1 in 3 or 4 a call, 4 calls a round. Uses `js/shared/rel.js` for the positions.

**E. Where shall I go? (visit 2, the speaking moment).** A person asks the child "where shall I go?" (F11: *kida*, where, heard inside 3). The card shows the place's picture (a picture says what; the heard frame says how), and the child says the place from a closed set of 3 that sound different, pills always there, never a gate. It's watched first (Nana asks Nani at L2 on visit 2; Nani answers), then handed over (Nana turns front-facing to the child, two poses). It reuses the shared say-it moment (`js/shared/say.js`). *Leak:* it's a production moment, not a test; the pills are always there.

**Visit 4: the want plus a position.** Two identical fruit stalls on free plots, and only the position says which: "Ma wants mangoes from the stall behind the school".

---

## 6. What it reuses and what is new

### Reused (built or designed)

| Piece | From | Use here |
|---|---|---|
| Put it in its place | `docs/game-design/modes/put-it-in-its-place.md`; Tidy's place engine (`js/tidy/engine.js`, `js/tidy/mechanics/`) | Tap a thing (the person), then tap where it goes (the place). Graded against the heard call. |
| **The animal actor** | `farm-animals.md` "New to build" 1 (designed; counted there) | The walker: an actor that walks to a named place and does an action, all as data. This game adds **a multi-point road path** (waypoints in data) and **a carried-thing slot** (a sprite that rides the actor), and the hurry (a skip on tap). Whichever design is built first builds the actor with both additions. |
| Call and speech queue | `do-it-engine.md` | One voice at a time; calls wait for the current line; F5 drops to a wave when a line is due. |
| Relations layer | `js/shared/rel.js`, `data/relations.json` | Visit 3's positions (later). |
| Face circle | `js/shared/face.js`, `data/faces.json` | The faces at the big size and the card rows, with the shared **lit state** (a breathing gold ring round the circle) written once for every game. Today's table has Nani, Nana, the doctor and the girl; Hannah Mami's and Ma's crops come from run 1, and Big Ma's too: the faces are characters, not real likenesses (Zafar, 1 Nov). |
| Order card, request pop-up | `js/shared/order-card.js`, `request-popup.js` | One row per errand, popping big, then flying to its row; the hollow tick. |
| Guide box, light, focus | `js/shared/guide.js`, `onboard.js`, `focus.js` | Nani off screen in the box; the lit box for the first round's place; the dimming of closed places. |
| Bulb, helper card | `js/shared/bulb.js` | The paid answer. |
| Word card, end screen | `js/shared/word-card.js`, `results.js` | The shared two-page end. |
| Stage coordinates | `js/shared/stage.js` | Map plots, road waypoints and doors in background pixels. |
| The host | `js/shared/host.js` | The map as a host stage in the day runner. |
| The window ride, the day runner | `js/shared/window-ride.js`, `js/day/` | The bus arrives; the day's list. |
| The clinic's send-off apple | `modes/clinic.md` H33 | What the clinic gives. |
| The language engine | `data/lang/` | All frames F1-F8, with no Kutchi in code. |

### New

| Piece | Size |
|---|---|
| **The tile map:** plots and tiles as data (each tile has an id, its open and closed art, its door point, its emblem, its refusal, what it gives out); the per-visit shuffle; the open set per level. | small |
| **The errand drawer** (every rule here, none left to the builder): calls with replacement; anyone callable, a person out picks the errand up at the stop; no person-place pair repeated from the last round; never the same place twice running from L2; the answer's distance spread at run time; the look-alike pair at L4; exactly one plausible open place per L4 need; the miss rule (solid or hollow tick, ladder reset, a miss counts as a hint, each refusal once a round). | small |
| **The town data** (`data/town.json`): places, people, wants, needs, levels, and each place's Kutchi-or-loan flag from Mum. | data |
| **The leak bot** for the map (reader, pattern, loan-aware and fisher variants). | small |
| The lab page: `lab.html?mode=town`. | small |

---

## 7. The art and the layout

### Camera

The approved mock-up's view: a **tilted map, about 50° down**, so every building's front shows.
- This is a new camera for the art bible (proposed: **M, the tilted map**), used by this scene only.
- Everything placed on the map is drawn in M: tiles, the walkers and the carried things on them.
- The light comes from the upper left, the day lighting state. Every tile shares the same light and the same pavement footprint, so any tile can sit on any plot.
- The face circles are the shared face crops (not in M).

### Run 1: visit 1 only (one ChatGPT run Zafar supervises, non-negotiable 8; the base maps locked first)

| What | How many | Notes |
|---|---|---|
| Base map, phones | 1 | 8 plots in 2 rows of 4, wide and short, with thin roads and little scenery between plots. The bus stop at the left edge. Empty plots (rounded pavement squares). |
| Base map, big screens | 1 | 12 plots in 3 rows of 4 (about 16:9), the bus stop at the bottom left; 8 empty plots and 4 painted as gardens. |
| Place tiles | 8 × 2 states = 16 | Market, park, bakery, library, clinic, post office, school, fire station (the popular places; Zafar, 1 Nov). **Open** (door open, warm window light, awning out) and **closed** (door shut, awning in), the second state as an edit-in-place. |
| Walkers | 4 (Hannah Mami, Nana, Ma, Big Ma) | Small full-body figures in M: a three-frame walk (or a bob), front and back facing, entering a door. Nani doesn't walk. All are characters, not real likenesses (Zafar, 1 Nov). |
| Carried things | 8 | Onion bag (with one loose onion), loaf, book stack, apple, letter, Ali's jumper, fire helmet, and the duck (a walk cycle). |
| Bus | 1 | The ride's bus, redrawn in M at the stop, with Nani's shopping bag beside it. |
| **Total** | **31** | Plus face crops for Hannah Mami, Ma and Big Ma (characters) from the face-circle sheet's style. |

### Later runs (not now)

- **Visit 2:** the café, toy shop, station and cloth shop (4 × 2 states), Hannah Mami stepping off a train, chai, ball, cloth roll, parcel, kite; Nana's front-facing pose for the speaking handover; the four refusals' props.
- **Visit 3:** one house tile (placed several times by code) and a garden plot; the cat at the window; Big Ma at the door.
- **Visit 4:** one fruit stall tile (placed twice by code).

**The mock-up's fixes (Zafar, 1 Nov):**
1. **One playground only:** the park keeps the swings. The school loses its slide and swings, and keeps a little blackboard by the gate and a rack of school bags.
2. **No tick on the post office:** the emblem is a plain sealed envelope with a red wax seal (as in the 12-place mock-up), and the red postbox stays.
3. **A stronger café:** a chai café. The emblem is a big glass of steaming chai on a saucer above the door. Outside: an indigo ajrakh awning (not red, to keep reds for Nani), a brass kettle on a little stove at the counter window, and two low tables with glasses of chai. (Its tile is a visit 2 piece.)

**Two more fixes I've made (decisions 9-10):**
- The school's **bell tower** becomes a little round roof with a weather vane, because a bell tower on an arched building reads as a chapel (a religious marker).
- The "hospital" becomes **the clinic** (smaller, the heart-with-plaster emblem kept, the ambulance kept small at the side).

**The pool from the 12-place mock-up is dropped** (modesty, non-negotiable 9). The cloth shop takes its plot (visit 2).

### Layout (two layouts, switched by height)

The cog sits top right of the play area at every size (rulebook; its square comes from the central file). On phones the face column **starts below the cog's reserved square** (about 44 px plus its margin, call it 50 px), never beside or under it. Four faces at most on visit 1.

| Size | Layout |
|---|---|
| **740x320** (phone) | The shared card strip on the left (about 150 px). The phone base map in the middle (about 520 px wide, so a tile is about 125 px). The face column on the right (about 64 px wide): the cog's square at the top (50 px), then 4 face circles of 52 px with 8 px gaps (232 px), leaving about 38 px. The people's bubbles open to the left of their circles, over the map's right edge, at most about 140 px wide, shrinking then wrapping, never over another face or the card strip. |
| **915x275** (Zafar's Z Fold) | The same, with tiles about 165 px wide by about 105 px tall. The column: the cog's square (50 px), then 4 circles of 48 px with 5 px gaps (207 px), leaving about 18 px. Still above the 44 px tap floor. The scenery between rows is trimmed to almost nothing. |
| **930x430** | Phone layout. The map has room for its greenery; the faces are 60 px (4 × 60 + 3 × 10 = 270 px below the cog's square). |
| **1280x665** (big) | The shared side panel on the left (about 260 px). The big base map above (about 1000x530) and the face row along the bottom (4 big circles, about 96 px), the cog top right of the map, clear of the row. Tiles about 230 px. |
| **1920x1080** | As 1280, scaled. All 12 plots, with tiles about 330 px. |

**Hit areas:** a place's tap target is its whole plot. A walker's hurry target is a tile-sized circle (at least 64 px) round the walker, live only when no face is lifted, so it never fights a place pick. Nothing goes over a face. Walkers pass behind face circles (the circles sit on their own strip, off the map). The map is one big background with the core in the middle. **The numbers above are on paper; the lab page is checked at all five sizes before anything is called done** (740x320, 915x275, 930x430, 1280x665, 1920x1080).

---

## 8. What it borrows from other games

- **Toca Town** (Toca Boca): characters carry what they get back home. Ours walk out with the thing, and the thing turns up at home and in the evening book.
- **Sago Mini Road Trip** (Sago Mini; Common Sense Media and the Horn Book reviewed it as calm, with no time limits): choosing where to go is the play, and nothing rushes. We keep the calm and the no-timer rule, but **the heard word picks the destination**, not the child's whim.
- **Busytown** (the app, after Richard Scarry): a town of recognisable workplaces. Its weakness, clumsy navigation for small children, is why ours is one tap and an automatic walk.
- **Animal Crossing** (Nintendo): errands for a named neighbour who comes back pleased. Ours is the people-come-back rule and the return parade.
- **The map task** (a classic language-teaching task: one person guides another to a place on a shared map): the directions visit (D, later).
- **Monki-style rotation** (from the hide-and-seek research): rotate who wants what so nothing is learned by pattern.
- **Our own hide and seek's fix** (research §3): only a first-try find earns the badge. Ours is the solid tick.

---

## 9. The lessons checklist

| Group | Verdict |
|---|---|
| **1. The heard word decides** | Passed on paper, written out per form (§3), with one gate. The deciding words are named, with 0 of 12 places recorded today (decision 17). **Until Mum confirms which place words are Kutchi and they're recorded, L1-L2 are not counted as teaching**; only Kutchi place words decide there, and the loan-aware bot must stay under 10% at L2. Solid ticks land only on a right first go; after a miss the tick is hollow, the word's ladder resets and the round counts as hinted. The need can't be settled by the picture at L4. Two words per move from L2 (who and where), with every face live, so the who is never a shortlist. It teaches its own words (places, wants), not numbers. |
| **2. Onboarding and the first round** | Passed. The first round is the tutorial (§4). One live thing at a time: the lit ring on a face (the shared face circle's lit state, not a box over the face), then the lit box on a place. No finger, and no person shown flying to the place before the child taps. What isn't on the card is shown at the start (the open and closed places, the stop). Each new action is shown once (the hurry); the miss and its refusal are shown on the first real miss. A place tapped before a face gets a "who?" shrug. Tap, then tap. **Exception:** 3 open places at L1, not 4-6. This follows the rulebook's L1 (1 decoy plus the round's places) for a 3-year-old's first round. 5 are open by L2. |
| **3. Instructions** | Passed. The asker speaks before the card: the person from a bubble at their face circle (L1), Nani from the guide box (L2+), and **one Nani**, off screen (R3, R4). The card pops big, then flies to its row. The card is what's wanted and never changes; the guide box says the step. The helper card is behind the bulb. Bubbles belong to faces. Listening again is free. **One voice at a time** (the speech queue): F5 drops to a wave when another line is due. |
| **4. Pacing and waiting** | Passed. No Next or Done: an errand closes when the person is back. A tap skips speech, hurries a walker (when no face is lifted), and is never lost. Hints come at 7, 9, 11 or 13 s. Nobody leaves before asked. No timer. From L2 the next call doesn't wait for the walk, and anyone can be called. The call is said again for non-readers on the hint clock. |
| **5. Feedback, progress and the end** | Passed. A miss gets a shake, the place's funny refusal (once a round) and the word again; the person tries again on the spot. Solid or hollow ticks: progress, not a verdict. Undo (swap the face) works until the walk starts. Rows tick when the person is back, not on a count. It ends the moment the last errand is done, back at the bus stop, with something served (the mango from Nani's bag, "aah"), then the word card and the shared two-page end. |
| **6. Layout** | Passed on paper for all five sizes (§7), to be proved on the lab page. Two layouts by height. Four faces at most, the column below the cog's reserved square. Tap targets: a whole plot per place, a 64 px circle per walker. **Exception:** "keep the left for the cards, two people in the middle and on the right" becomes the card on the left and the faces on the right, with the map in the middle. The cog is the only button. |
| **7. Art and camera** | Passed with one new camera (M, the tilted map, Zafar-approved by the mock-up; decision 8). Nothing drawn in code (the carried thing is real art riding a real sprite). Nothing floats: walkers get contact shadows from code. Calm faces and gentle walks. Run 1 is 31 pieces, base maps locked first; later visits are later runs. Big Ma waits for her sheet. |
| **8. Speaking** | Not on visit 1. Visit 2's form E is the shared say-it moment: watched, then handed over, a closed set of 3, pills always there, never a gate. |
| **9. Levels** | Passed. The rulebook ladder: L1 the core (only "yes" asks); L2 two words, English gone, picture only on the hint; L3 other ways of saying it, picture blurred and on the hint; L4 the most, plus a look-alike. The same on every device. **Exceptions:** no "no" asks at L2, because "Nana doesn't want the park" is unnatural on errands (the clinic heal games have none either; decision 6). L1 is 2 errands, overriding the formula's 1. Level-up counts a round with a miss as hinted (decision 25). Every level is designed as its own game, and L4 is not a faster L3. |
| **10. Words and recording** | Passed as a plan. Every frame is built from recorded pieces or listed for Mum (§1). One natural sentence per call. Things are named as they are (onions at the market, the loaf as the family says it). 3-5 new words a round, each heard 3 times. Shared recordings are asked once: "I feel poorly" with the clinic, "I'm thirsty" with the party. **Blocked on Mum:** which places are Kutchi, the places, the wants and the needs (decision 17). |
| **11. Culture** | Passed. No place of worship tile (decision 11). The pool is dropped. Modest clothes. Fruit as the treat (mango, the clinic's apple); the bakery's bread is a food errand, not a reward, and there are no sweets anywhere. Nothing a child could copy and get hurt by (the fire station is a helmet and a bell, never a fire). Ali's book is his; nothing assigns a baby's bedtime story to the lanky cousin. |
| **12. Fun and delight** | Passed. The hands have a job at every step (pick, send, hurry). The "kind of funny" moments are the duck, the helmet over the eyes, the wobbling books, the rolling onion, and the refusals (once a round, so they stay a surprise). Contrast: the busy town from L2 against the calm L1. No fatigue: never the same place twice running from L2. It carries into the evening book (Ali's book) and, from visit 2, the sewing (the cloth). |
| **13. Mistakes we've made twice** | Guarded. The walker is the farm's actor, not a second engine. Judge on film, not stills, because the walk and the parade are motion. Play every level, more than one round, and all five sizes. No design question is left for the builder (the drawer holds every rule; §10 holds the choices). No builder swaps a mechanic. Help never comes early. No English reaches the child beyond the L1 card. |

**The ten questions:**

1. **Which words decide, and how many are recorded?** Places (0 of 12 recorded; *bajaar* in the engine; which are Kutchi is Mum's gate), the who (2 of 4 recorded), the things (onions ✓, *dawa* in the engine; the rest to record) and the needs ("we need to cook" ✓).
2. **How would the Sceptic win at L2 and above?** By reading names, loans or the card's picture, by matching the sign, by eliminating faces, or by fishing; all fail (§3, the leak test and the odds).
3. **What open need can't the picture settle?** The L4 needs (poorly, play, read, cook), which aren't on any sign.
4. **What does the first round light up?** Nana's face (a ring), then the park, then nothing (§4).
5. **Who asks?** The person (L1, a bubble at their face), then Nani from the box (L2+), in F1-F4.
6. **What do the hands do?** Pick a face, pick a place, hurry the walker.
7. **Where is the funny moment?** The duck, the helmet, the refusals.
8. **How does it end, and what's served?** At the bus stop, with the mango Nani packed, then into the market.
9. **What changes at each level?** Place, then who and where, then the thing, then the need and a look-alike. L4 is its own game.
10. **Does it fit all five sizes?** On paper, yes, with four faces below the cog; the lab page proves it.

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, why, and the answer I assumed. Reverse any of them by number. Decisions 24-37 were added after the critique; 5, 14, 15, 17, 18, 19, 21, 22 and 23 were changed by it.

1. **It opens the town and shops day,** after the door, the bag and the bus. It ends with the camera gliding into the market. *Why:* Part 7's "the town map opens the shops". *Assumed:* yes.
2. **The day is sunny, overriding the shops day's rainy door of 19 Oct.** *Why:* his 19 Oct "no rain or umbrella beats for now" left the beats out; the map is drawn in day light, and a rainy town would need a second lighting state. *Assumed:* yes; one word from him puts the rain back.
3. **One gesture all game: tap a face, then a place.** The person walks there and comes back with something. *Why:* his design; tap, then tap. *Assumed:* yes (his).
4. **At L1 the child taps any face and that person says their own line.** From L2, Nani names who and where. *Why:* L1 is one job (the place). The asker is on screen. Two words per move from L2. *Assumed:* yes.
5. **The map always shows 8 places, with 3, 5, 7 and 8 open at L1 to L4; L1 is the market, the park and the bakery, provisionally.** The rest are closed: dimmed, doors shut, can't be tapped. *Why:* his 8 places, the rulebook's decoys, the research's 4-6 places for 4-year-olds, and *bajaar* being the one place word in the engine. *Assumed:* yes, with the final sets after Mum's gate (17).
6. **No "no" asks.** *Why:* they're unnatural for errands, and the clinic's heal games have none either. *Assumed:* yes.
7. **People come back; calls are drawn with replacement; a round ends on a count of errands.** Who wants what is drawn fresh, with no pair repeated from the last round. *Why:* his rules, made concrete. *Assumed:* yes (his).
8. **A new art-bible camera, M (the tilted map, about 50°),** for this scene only. *Why:* the mock-up he approved. *Assumed:* yes.
9. **The school's bell tower becomes a little roof with a weather vane.** *Why:* a bell tower on an arched building reads as a chapel. *Assumed:* yes.
10. **The hospital becomes the clinic** (the doctor's), with the heart-and-plaster emblem kept. *Why:* our clinic exists and is a real place in the child's world; its send-off apple carries in. *Assumed:* yes.
11. **No place of worship tile.** *Why:* the game's culture rule (no religious markers; the family is never named publicly). *Assumed:* yes. He can add one if he wants it.
12. **The swimming pool is dropped;** the cloth shop takes its plot. *Why:* modest clothing (non-negotiable 9), and the cloth seeds the sewing day. *Assumed:* yes.
13. **The fruit and veg shop is the market's entrance.** Errands there are food; at the end, the camera goes in for the shops games. *Why:* one place, not two that overlap. *Assumed:* yes.
14. **One cast for visit 1 on every device: Hannah Mami (first in the row), Nana and Big Ma from L1; Ma from L2, stepping off the same bus** (Zafar, 1 Nov: Hannah Mami first, she's seen more and is more recognisable; no Masi face, since Masi won't want to be in the game; the faces are characters, not real likenesses). Four faces through L4. Hannah Mami's train arrival is visit 2's, when the station opens everywhere. Nani is the off-screen guide, not in the row. Ali stays home and gets things carried for him. *Why:* one cast that adds up on phones and big screens; the days rule that Ali stays home. *Assumed:* yes.
15. **L4 uses only needs not drawn on any sign, the same set on every device: poorly (clinic), play (park), read (library) and cook (market, if Mum agrees the bakery doesn't also answer it).** The bakery and the market are always open together as the look-alike pair. A vague want ("hungry") is never a call. Thirsty waits for the café on visit 2. *Why:* the research's warning that "I want a book" against a book sign is no harder than "the library"; decision 19's same difficulty everywhere. His "I want a book" stays as L3. *Assumed:* yes.
16. **The tiles are shuffled onto the plots once per visit.** *Why:* nothing is learned by position; a town that moves mid-visit would confuse. *Assumed:* yes.
17. **The places are the popular ones** (Zafar, 1 Nov): the want ("I want a book") still teaches Kutchi even if the place word is English. Mum still marks each place word as Kutchi or loan; a loan asked at L1-L2 is reported by the leak bot as a move a child with English can win, and the market (*bajaar*) keeps a Kutchi place word deciding from L1. The game counts as teaching once the places and the L3 things are recorded.
18. **Faces on phones go in a column on the right, four at most, starting below the cog's reserved square.** *Why:* at 320 and 275 px tall, a bottom row would take a third of the height; five faces and the cog don't fit at 275. *Assumed:* yes.
19. **The same open counts, faces and needs on every screen through L4.** Big screens' 4 extra plots are gardens on visit 1. Up to 12 open places on big screens only from visit 4. *Why:* the same difficulty on every device, for the leak bot and fairness. *Assumed:* yes, with "up to 12 on big screens" kept for later visits.
20. **No timer.** From L2, people are out at the same time instead, so it's busy but never rushed. *Why:* listening and speed fight; Sago's and the ride's rule. *Assumed:* yes.
21. **The end is the return parade, a slice of the mango Nani packed at the door ("aah"), then into the market.** *Why:* it ends where it began, with something served; fruit as the treat; the market isn't open yet, so the fruit can't come from it. *Assumed:* yes.
22. **Later visits are notes, not built now:** visit 2 brings the four new places on every device, first-then errands and the speaking handover; visit 3 directions with identical houses; visit 4 position plus want. *Why:* his "later: directions on the same map"; the builder's scope is visit 1. *Assumed:* yes.
23. **The walker is the farm's animal actor with two additions, a road path and a carry slot,** counted in the farm's new list and built once by whichever design goes first. *Why:* one job, one engine (the audit's §5 fault). *Assumed:* yes.
24. **One Nani: off screen, in the guide box.** The bus stop holds the bus and her shopping bag; she never walks on the map. *Why:* `guide-and-card.md` R3 and R4 (one face per person; an off-screen guide uses the box), and a bubble over a 25 px sky strip has nowhere to go at 320 px. *Assumed:* yes. If he wants her at the stop, the box goes and her lines become bubbles there.
25. **The miss rule:** first go ticks solid; after a miss the row gets a hollow tick, the deciding word's ladder resets, the round counts as hinted for level-up, and each place's funny refusal plays once a round. *Why:* a miss that costs nothing and is rewarded twelve ways makes fishing win. It changes the rulebook's level-up count ("only the guide's hint") for this game; I'd make it the rulebook's rule everywhere, but that's his call. *Assumed:* yes.
26. **Anyone can be called at any time; a person who is out picks the errand up when they're back at the stop.** Their face stays full colour and tappable. *Why:* faded, uncallable faces leave 1 in 2 by the third call; this keeps the town busy and the who honest. *Assumed:* yes.
27. **One speech queue (the do-it engine's): one voice at a time,** F5 dropping to a wave when another line is due. *Why:* overlapping voices from L2. *Assumed:* yes.
28. **The card shows the place's picture at L1 only; from L2 a picture comes only on the hint clock or after a miss.** *Why:* the picture is the whole answer; the party made the same choice. *Assumed:* yes.
29. **Never the same place twice running, from L2.** *Why:* it stops tedium without handing L1's second answer away. *Assumed:* yes.
30. **The map's directions visit (D) takes over spoken directions; the lanes and the goat stay designed for a later shops visit** (`shops.md` decision 12). *Why:* the map now carries "getting there"; nothing of his is cut. *Assumed:* yes.
31. **Art run 1 is 31 pieces for visit 1** (two base maps, 8 tiles × 2 states, 4 walkers, 8 carried things, the bus); later visits are later runs. *Why:* one supervised run, a game sized "small". *Assumed:* yes.
32. **A place tapped before a face shrugs "who?" and the faces bounce once.** *Why:* the likeliest first move of a 3-year-old, left undefined. *Assumed:* yes.
33. **The faces are characters, not real likenesses** (Zafar, 1 Nov): Hannah Mami's, Ma's and Big Ma's face crops and walkers all come from run 1.
34. **A lit face is a breathing gold ring round the circle,** written as the shared face circle's lit state for every game. *Why:* the lit box never crosses a face. *Assumed:* yes.
35. **Every L4 need has exactly one plausible open place,** written in the drawer and checked by the bot per open set (and by Mum for meaning). *Why:* "we need to cook" with the bakery open is arguable. *Assumed:* yes.
36. **The library's L4 need is "I want to read",** not a bedtime story for Ali. *Why:* Ali is the lanky cousin, and "read" has no other home on the map. *Assumed:* yes.
37. **The hurry tap is a 64 px circle round the walker, live only when no face is lifted;** a place's tap target is its whole plot. *Why:* a 30 px walker is under the 44 px floor, and a hurry must never steal a place pick. *Assumed:* yes.

**Open questions (genuinely his, or Mum's):** (Zafar answered his on 1 Nov: Hannah Mami first in the row, no Masi; popular places.)
1. **Mum (decision 17):** which town places does the family say in Kutchi, and which as English loans ("library", "post office", "school", "station")? The places are fixed (the popular ones); her answer tells the leak bot which moves an English speaker can win.
2. **Mum:** what does the family call a bakery loaf (as against *maani*, chapati), and is there a Kutchi word for a parcel or letter?
4. **Mum:** would "we need to cook" ever send someone to the bakery? If yes, it leaves L4.

---

## 11. ChatGPT mock-up prompts

All four ask for 16:9 (what the image model makes). The phone shapes are drawn **inside guide bars** within the 16:9, and the judge crops to the strip. The row faces are placeholders, characters rather than likenesses; nobody in these images is Nani, and no real likeness is asked for. **Zafar, 1 Nov:** Hannah Mami (the woman in the sage quarter-zip) comes first in the row, and there is no Masi face, so the four prompts are changed to match (the prompt sheet still has the older faces: use these).

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins. Prompt 4 is a later-visit mock-up, not run 1.

### Prompt town-map-1: the first round, a phone, level 1

Shows the core move on the phone layout. The grandfather was tapped, then the park; he walks there while the closed places sit dimmed. It shows Zafar the three fixes, the open and closed states, the market among L1's three, and the faces on the right below the cog's square.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Make the image 16:9. Inside it, draw the game as a wide, short strip about 2.3 times as wide as it is tall, centred, with plain dark grey bars above and below it. Everything described below sits inside the strip.

THE SCENE: a small friendly toy town seen from above at a TILTED angle, camera about 50 degrees down, like the attached approved town map, so the FRONT of every building shows. Eight places on rounded pavement plots in two rows of four, a simple looping grey road between them, thin strips of grass and a few cypress and olive trees, cream limewash walls and terracotta roofs. Day light, warm late-morning sun from the upper left.

The eight places, each recognisable with no writing, by shape, colour and one big emblem:
1. Market: crates of oranges, bananas, onions and green chillies under a striped awning.
2. Park: trees, a pond with ducks, swings, a bench (no building). The ONLY playground on the map.
3. Bakery: a window of bread loaves, a giant bread loaf above the door.
4. Library: big windows full of colourful books, a giant open book above the door.
5. Clinic: a small clean white building with a big pink heart with a plaster on it above the door, a small white ambulance at its side.
6. Post office: a red postbox outside and a plain sealed envelope with a red wax seal above the door (no tick, no mark on the envelope).
7. School: a little round roof with a weather vane (no bell tower), a small blackboard by the gate, a rack of school bags. No slide, no swings.
8. Fire station: red, big garage doors, a fire engine inside.

ONLY the market, the park and the bakery are OPEN: doors open, warm light in the windows, awnings out. The other five are CLOSED: doors shut, awnings rolled in, and the whole plot gently dimmed and slightly greyed, so the three open places clearly stand out.

At the far left edge of the strip: a small bus stop with a cream bus just pulled in, and a big empty cloth shopping bag resting by the bus stop bench. No one is standing at the stop.

THE MOMENT: a small full-body grandfather in a plain navy blazer is walking along the road from the bus stop towards the park gate, mid-stride. The park has a soft warm golden glow, as if it has just been tapped.

THE FACES: along the RIGHT edge of the strip, a plain soft-green vertical column. At the top of the column, an empty square space the size of one face (kept clear for a settings button; draw nothing there). Below it, three round portrait circles stacked (head and shoulders, white ring): at the top a friendly woman in her thirties in a sage-green quarter-zip, then the same grandfather (with a soft golden ring round his circle), then a very old great-grandmother with white hair and a pale shawl. Same render style as the people reference. Placeholders, not real people.

STYLE: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, clean surfaces, no outlines, no photorealism, no cel shading, no blur or vignette.

Absolutely no text, letters or numbers anywhere: no signs with writing, no logos, nothing on the bus.

Must read when the strip is shown about 740 pixels wide: which three places are open, every place by its emblem, the walking grandfather, and the three faces.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/sources/art/mockup-town-2026-10-31/map-8-places.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/c2-town-road-view-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
```

### Prompt town-map-2: the busy town at level 3, a big screen

Shows "people come back carrying something", which is the delight, on the visit 1 big-screen map: 8 places and 4 gardens on 12 plots, two people out at once, and all four faces live. Cut from 12 places and three walkers after the critique, because the 31 Oct mock-up already showed 12 tips towards busy.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons), widescreen 16:9 like a tablet or computer.

THE SCENE: the same toy town as the attached approved map, seen from above at a TILTED angle, about 50 degrees down, so every building's front shows. Twelve rounded pavement plots in three rows of four on a looping grey road, cream limewash walls, terracotta roofs, potted plants, a few cypress trees. Warm late-morning sun from the upper left.

EIGHT plots hold places, each recognisable with no writing: the market (fruit and vegetable crates under a striped awning), park (pond, ducks, swings; the only playground), bakery (giant loaf above the door), library (giant open book above the door), clinic (small white building, pink heart with a plaster above the door), post office (red postbox, a plain sealed envelope with a red wax seal above the door, no tick), school (little roof with a weather vane, a small blackboard and school bags by the gate, no slide), fire station (red, fire engine inside). Seven are open and lit (doors open, awnings out); the fire station is closed and gently dimmed. The other FOUR plots are small gardens: grass, a bench, a lemon tree, flower pots. No houses.

THE MOMENT, two people out on errands at once, small full-body figures:
- a young mother in a green dupatta walking out of the library carrying a tall wobbly stack of books;
- a grandfather in a plain navy blazer walking back along the road from the park, his hair windswept, with a white duck waddling right behind him.
At the bottom left, a small bus stop with a cream bus and a big empty cloth shopping bag by the bench. No one is standing at the stop.

THE FACES: along the bottom 16% of the image, a plain soft-green strip with four round portrait circles (head and shoulders, white ring), ALL equally bright and in full colour, left to right: a friendly woman in her thirties in a sage-green quarter-zip, the grandfather, the young mother, and a very old great-grandmother with white hair and a pale shawl. Same render style as the people reference. Placeholders, not real people. Keep the top right corner of the image clear (a settings button goes there).

STYLE: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere: no signs, no writing on books, the bus or anything else.

Must read at phone size (shrunk to about 900 pixels wide): every place by its emblem, especially the bakery against the market; what each walking person carries; the duck; the four faces.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/sources/art/mockup-town-2026-10-31/map-8-places.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/c2-town-road-view-v1.png
```

### Prompt town-map-3: a funny miss, Zafar's Z Fold layout

Shows what happens on a wrong tap (no frown: the place refuses in a funny way and the person shakes their head), at the very short 915x275 shape, drawn inside guide bars, with four faces under the cog's square.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Make the image 16:9. Inside it, draw the game as a very wide, very short strip about 3.3 times as wide as it is tall, centred, with plain dark grey bars above and below it. Everything described below sits inside the strip.

THE SCENE: the same toy town as the attached approved map, TILTED about 50 degrees down so building fronts show, squeezed into two rows of four places with very little scenery between them: market (fruit and vegetable crates under a striped awning), park (pond, ducks, swings), bakery (giant loaf above the door), library (giant open book above the door), clinic (white, pink heart with a plaster above the door), post office (red postbox, plain sealed envelope with a red wax seal above the door), school (little roof with a weather vane, blackboard and bags by the gate, no slide), fire station (red, fire engine). All open and lit. Warm sun from the upper left. At the left end, a small bus stop with a cream bus and an empty cloth shopping bag; no one standing there.

THE MOMENT: the post office has just been tapped by mistake. Its red postbox is doing a cheerful little hop off the ground with a tiny puff of dust, and a single plain envelope is popping out of its slot. In front of the post office door, a small great-grandmother with white hair and a pale shawl is gently shaking her head with a warm, amused smile, one hand raised as if to say "not here". Nobody looks cross or sad. The bakery, the right place, has no glow and looks like all the others.

THE FACES: along the RIGHT edge of the strip, a narrow soft-green vertical column. At its top, an empty square space the size of one face (kept clear for a settings button; draw nothing there). Below it, four small round portrait circles stacked (head and shoulders, white ring): at the top a friendly woman in her thirties in a sage-green quarter-zip, then a grandfather in a navy blazer, the great-grandmother (with a soft golden ring round her circle, because she is the one chosen), and a young mother in a green dupatta. Placeholders, not real people.

STYLE: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere.

Must read when the strip is shown about 915 pixels wide and 275 tall: each place by its emblem at this tiny height, the hopping postbox, the great-grandmother's kind head-shake, and all four faces.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/sources/art/mockup-town-2026-10-31/map-8-places.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
```

### Prompt town-map-4: directions, the third visit (a later-visit mock-up, not run 1)

Shows the directions visit: identical houses that only a position word tells apart ("Big Ma's house is next to the park"). **Note for the judge:** in the game the houses are identical because one tile is drawn once and placed by code; the image model can't repeat a tile exactly, so judge the one house design and the layout, not whether the copies match.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons), widescreen 16:9.

THE SCENE: the same toy town as the attached approved map, TILTED about 50 degrees down so building fronts show, warm late-morning sun from the upper left. Twelve rounded pavement plots in three rows of four on a looping road. Eight hold familiar places recognisable with no writing: market (fruit and vegetable crates under a striped awning), park (pond, ducks, swings), bakery (giant loaf above the door), library (giant open book above the door), clinic (white, pink heart with a plaster), post office (red postbox, plain sealed envelope with a red wax seal), school (little roof with a weather vane, blackboard and bags by the gate), fire station (red, fire engine).

THE HOUSE: on the plot right next to the park, draw ONE small house with great care: cream limewash walls, a terracotta roof, a sage-green door, two windows with plain curtains, one pot plant by the door. On three other plots (one behind the school, one opposite the bakery, one in front of the library), draw the SAME house again, as plain copies of it: same shape, same colours, same door, same windows, same pot. Keep them as simple as possible so they match.

THE MOMENT: a young mother in a green dupatta, small and full-body, has just knocked on the house next to the park. Its door is open and the very old great-grandmother with white hair and a pale shawl leans out of it, waving happily with both arms. At the house behind the school, a ginger cat is peeping out of a window, blinking, half-drawing the curtain (a gentle joke for a wrong guess). A small bus stop with a cream bus sits at the bottom left; no one is standing there.

THE FACES: along the bottom 16% of the image, a plain soft-green strip with four round portrait circles (head and shoulders, white ring), all bright, left to right: a friendly woman in her thirties in a sage-green quarter-zip, a grandfather in a navy blazer, the young mother, and a very old great-grandmother with white hair and a pale shawl. Placeholders, not real people. Keep the top right corner clear (a settings button goes there).

STYLE: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere: no house numbers, no signs, no writing.

Must read at phone size (shrunk to about 900 pixels wide): the one house design, which landmark each copy stands beside, the waving woman at the open door, and the cat at the window.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/sources/art/mockup-town-2026-10-31/map-8-places.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
```

---

## 12. Changes after the critique

The critique (`town-map-critique.md`, 1 Nov) had 8 MUSTs and 10 SHOULDs. All 8 MUSTs are applied. 9 SHOULDs are applied in full and 1 in part (16, where I left out one suggestion and say why). Nothing in the critique clashed with a recorded word from Zafar: his scope (the tilted map, 8 and up to 12 places, the faces, the walk, "I want a book", people come back, rotate, directions later, the three fixes) is all kept.

1. **MUST: the L1-L2 deciding words are probably English loans.** *Done.* The gate is written in §1 and decision 17: the first visit's 8 and the L1-L2 sets are fixed after Mum says which places are Kutchi, and only Kutchi place words decide at L1-L2. The market (*bajaar*) replaces the library in L1 (the library moves to L2). A loan-aware bot variant is added (it knows every loan and name, and must stay under 10% at L2). §9 row 1 says L1-L2 aren't counted as teaching until Mum confirms and records.
2. **MUST: from L2 the who is won by elimination; the 1-in-20 maths is false.** *Done, with the critique's option (b) plus (c).* Anyone can be called at any time; a person who is out picks the errand up when back at the stop; every face stays full colour and tappable (decision 26). I chose (b) over (a) because it keeps Zafar's busy town without holding calls back. The odds are redone with four live faces and the no-repeat rule (about 1 in 16 a call at L2).
3. **MUST: a miss costs nothing, fishing wins, the tick rule contradicts itself.** *Done.* The miss rule is in §3 and decision 25: solid tick on a first go, hollow tick after a miss, the deciding word's ladder resets, the round counts as hinted for level-up, and each refusal plays once a round. §4 step 6 and §9 row 1 match it. A fisher bot variant must never level up. I flagged that this changes the rulebook's level-up count for this game.
4. **MUST: the cast and the ladder don't add up across devices.** *Done.* One cast on every device: Nana, Ma, Big Ma from L1; Masi from L2 off the same bus; four faces through L4 (decision 14). The station, the café and thirsty move to visit 2 on every device. L4's needs are the same everywhere: poorly, play, read, and cook if Mum agrees (decision 15). The fifth woman is gone from prompt 2, and Masi is drawn from `cast.md` (forties, teal headscarf) in every prompt.
5. **MUST: two Nanis on one screen.** *Done, the recommended way.* Nani is the off-screen guide in the box; the bus stop holds the bus and her shopping bag; the sky-strip bubble is gone; the people speak from bubbles at their face circles (decision 24). The critique's suggestion that she walk into the market at the end is replaced by a camera glide, so she needs no walker art (finding 7).
6. **MUST: the walker duplicates the farm's animal actor.** *Done.* The walker is the animal actor plus a road path and a carry slot, counted in the farm's new list (§0, §6, decision 23).
7. **MUST: about 70 art pieces for a game sized small.** *Done.* Run 1 is 31 pieces, counted in §7 (two base maps, 8 tiles × 2 states, 4 walkers, 8 carried things, the bus); later visits are listed as later runs. Forms C, D and E are now one-paragraph later-visit notes in §5 with their leak lines; the builder's scope is A and B.
8. **MUST: the face column and the cog don't fit; the hurry tap is under 44 px.** *Done.* Four faces at most, the column starting below the cog's reserved square, with the sums for every phone size in §7 (915x275: 50 + 207 of 275 px). The hurry target is a 64 px circle, live only when no face is lifted; a place's target is its whole plot (decision 37). The lab page check at all five sizes is written in as the proof.
9. **SHOULD: overlapping voices from L2.** *Done.* One speech queue from the do-it engine (§3, decision 27).
10. **SHOULD: the no-repeat rule lives only in §9; the distance spread can't be data.** *Done.* "Never the same place twice running, from L2" is in the drawer (§3, §6, decision 29); the distance spread moved to the drawer's run-time draw and the pattern bot.
11. **SHOULD: the card's pictures make L1-L2 a picture match.** *Done.* The picture shows at L1 only; from L2 it comes on the hint clock or after a miss (decision 28); the reader bot reads the picture too.
12. **SHOULD: the first round leaves two moves undefined.** *Done.* Place before face: a "who?" shrug and the faces bounce (decision 32). §4 no longer scripts a mistake; the refusal is shown on the first real miss.
13. **SHOULD: the mango comes from a market nobody has visited.** *Done.* Nani packs a mango at the door (§2 stage 2), and the slice comes out of her bag (decision 21).
14. **SHOULD: two of Zafar's earlier words overridden without a line.** *Done.* Decision 2 now says the sunny door overrides the 19 Oct rainy opening; decision 30 says the directions visit takes over spoken directions and the lanes stay for a later shops visit.
15. **SHOULD: art and words assumed to exist don't, and some that exist are missed.** *Done.* The people table says which faces exist (Nana, Nani), which run 1 makes (Ma, Masi), and that Big Ma is a placeholder until her sheet (decision 33). Medicine is *dawa* (engine, heard inside 1 line). "I'm thirsty" points at the party's recording row, and "I feel poorly" at the clinic's, so Mum records each once.
16. **SHOULD: two L4 needs and one carried thing don't quite fit.** *Done in part.* The one-plausible-place rule is in the drawer and the bot (decision 35), with "we need to cook" held on Mum's answer (open question 4). The bedtime story for Ali is replaced by "I want to read" (decision 36). I didn't add the critique's "Masi's parcel" need at the post office for visit 1: "send this" needs a thing in the hand, which would show the letter before the pick, and a parcel is a ninth carried thing for run 1. It stays for visit 2.
17. **SHOULD: the prompts ask for sizes ChatGPT doesn't make; prompt 2 is too busy; prompt 4 asks for identical houses; prompt 3's likeness line.** *Done.* Prompts 1 and 3 ask for 16:9 with the strip drawn inside guide bars. Prompt 2 is cut to 8 places, 4 gardens and two walkers. Prompt 4 asks for one carefully drawn house and plain copies, with a note for the judge that identity is a code property. Prompt 3 no longer attaches Nani's sheet, and no prompt has a grandmother at the stop (finding 5). All prompts show four faces and leave the cog's corner clear.
18. **SHOULD: the lit box on a face circle needs its exception.** *Done.* A lit face is a breathing gold ring round the circle, written as the shared face circle's lit state (§4 step 3, §6, decision 34).

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **The face row:** Hannah Mami first (from L1), no Masi face; Ma joins at L2 in Masi's place. The faces are characters, not real likenesses, so Big Ma no longer waits for her sheet. §1's people, §3's ladder, §4, §5, §6, §7, decisions 14 and 33, and the four prompts' face rows changed; the directions visit is Big Ma's house; open question 3 is gone.
- **Popular places:** the places are no longer gated on Mum's Kutchi-or-loan answer; the want still teaches Kutchi (decision 17, §1, open question 1 reworded).
- **Level up only on right-first-time rounds** (§3). **Clothes:** the prompt sheet's line is added before the prompts.
