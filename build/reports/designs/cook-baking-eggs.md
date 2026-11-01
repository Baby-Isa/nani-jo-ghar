# Cook: the baking station and the eggs station (slug: cook-baking-eggs)

Designed overnight on 1 Nov 2026, while Zafar slept, and revised the same night after an independent critique (`cook-baking-eggs-critique.md`; what changed is in §12). Every choice he hasn't made is in §10, with the answer I assumed, so he can reverse it. Nothing here is built. The only Kutchi below is what the repo holds (`data/lang/lexicon.json` and the word inventory of 31 Oct). Everything else is English, marked "to record". No Kutchi sentence in this file is mine. The frames are given in English, and the language engine builds them from recorded parts.

**Sources:** Zafar's rows in the games map (Part 1 rows "Baking" and "Eggs station"; Part 6 question 7, answered yes on 1 Nov); his notes in the settings map ("breakfast, lunch and dinner come from the time of day"); idea 54 ("baking ... to teach halves, 'and a half' and measures"); `modes/cook.md`; `architecture/cook-recipes-guide.md`; the rulebook; the lessons checklist of 1 Nov; the research reports of 31 Oct (§14, §15).

## 0. One line

- **What:** two new Cook stations and one rule on the existing ones.
  - **A. The eggs station (Zafar's):** each person at the breakfast table asks for their egg. The child boils it or cracks it into the pan and fries it, then gives it to the right plate. "A boiled egg for Nana, a fried one for Ali." (Its speaking turn waits for the chai pilot: §5.)
  - **B. The baking station:** Nani calls each ingredient with an amount. The child pours it into a clear cup with no lines on it and stops at the amount word. Then a quick knead, and the oven, where each bake comes out when its word says. Bread, naan, or the party's cake. Never a treat, never a prize.
  - **C. The meal word (rule):** in story mode the time of day names the meal on every Cook station in a kitchen day: breakfast in the morning light, lunch at midday, dinner under the lamps. In free play each station keeps its own meal.
- **Day:** the kitchen (Nani). Eggs open the day at breakfast. Baking is the afternoon, and it ends at dinner. The first kitchen day is eggs and baking only; a lunch station joins on visit 2.
- **Status:** new. The eggs station was restored on 1 Nov (R4), with the breakfast skin folded into it.
- **Engine:** Cook's kit.
  - **Eggs:** the hob, pot and pan, the fry ring (`js/cook/mechanics/fry.js`) for both vessels (the pot is a second "pan" with its own ring profile; `boil.js` is a knob game and isn't used), the chai tray's face-badged 2×2 tray for the plates, and the order card. One tiny new mechanic: **crack**.
  - **Baking:** the press-and-hold pour (`js/shared/pour.js`, `Cook.Pour.hold`), with its dashed lines removed, knead (`knead.js`, un-parked) and the tawa ring (`tawa.js`) behind an oven door. Two small new pieces: **measure** (the amount judge, with the count judged at the knead) and **oven** (a zone).
- **Rough size:** small to medium in total. Eggs is small. Baking is small to medium: the measure judge and the oven zone are new, and the front-on counter may be the chaat v2 or pantry view rather than a new one (checked first, §6). One art run covers both stations.

## 1. The language goal

**Word groups:**
- Quantities: the main one, and baking is "the only game about how much" (games map).
- Food: eggs, flour, milk, water, the bakes.
- Cooking: boil, fry, crack, knead, pour, put it in, take it out.
- Time: breakfast, lunch, dinner, now, a bit longer.
- Owners: for Nana, Nana's.
- Numbers 1-3.
- Describing words: soft and hard, a pair from the biggest short group.

**What each station teaches that the other doesn't:**
- **Eggs** carry the egg verbs (boil, crack, fry), owners ("for Nana", "Nana's", deciding from L3) and the meal words. At L4 they add soft and hard. The kitchen's speaking turn ("boiled or fried?" answered in one word) comes later, after the chai pilot (§5).
- **Baking** carries every amount word: a little, a lot, a whole cup, heaped, a bit more, half, two and a half, enough. It also carries the cup and the time words "take it out now" and "leave it a bit longer", which decide the oven from L1.

**The words.**
- ✓ means a family clip of the word or line alone.
- "Heard in lines" means the Kutchi is in the repo and heard inside longer recorded lines, with no clip of its own.
- "In engine" means the Kutchi is in the repo, with no recording.
- "To record" means there's no Kutchi in the repo.

| English | Kutchi in the repo | Status | Used in |
|---|---|---|---|
| egg | *indo* / *mayai* | ✓ both (Mum to say which one for a child: open in the lexicon) | eggs, cake |
| boil | *ukar* | ✓ (verb alone; also "boil the water" as a whole line) | eggs |
| a boiled egg | – | to record (the engine may build it from *ukar* and egg once Mum gives the form) | eggs |
| fry it | *tarelo kari chad* | ✓ whole line | eggs |
| fried | *tarelo* | heard in 2 lines (draft) | eggs: "a fried one" |
| fry (verb) | *tar* | in engine (draft; on Mum's confirm list) | eggs |
| crack (an egg) | – | to record | eggs, cake |
| pot | *tapelo* / *sufuria* | ✓ both (which one is the lexicon's open question: §10) | eggs; "the pot" is also Nani's one naming line at the first round |
| frying pan | – | to record (Cook's data has *kadai* as an art name only, not a word) | eggs |
| plate | *saani* | in engine | eggs |
| soft (of an egg), hard | – | to record | eggs L4 |
| take it out now (gently) | *inke hane kadh* | ✓ whole line | eggs, oven |
| leave it a bit longer | *thori war rakh* | ✓ whole line | eggs L4, oven from L1 |
| it's ready | *tayar ai* | ✓ whole line | spare: not said at a ring or the oven (one line per moment; the time word is the one that decides) |
| careful! | *dhyan rakh* | ✓ whole line | both (the hot pan, the oven) |
| for (a person) | *lai* | heard in "this is for Nana" ✓ (*hi nana lai ai*) | eggs L3 (deciding) |
| Nana's | *nana jo* | heard in "it's Nana's" ✓ (*nana jo ai*) | eggs L3 |
| too, also | *pan* | in engine ("make one for Ma too", *ma lai pan hakro banai*) | eggs L3 |
| I want ... | *muke ... khape* | heard in 22 lines (the Cook order frame) | both |
| Nana, Ali, Nani | *Nana*, *Ali*, *Nani* | ✓ | both |
| Ma | *Ma* | in engine (no clip) | eggs L2 |
| chilli | *mirchi* | ✓ | eggs L2 (a "with" or a "no" row) |
| with {chilli} | – | in engine (the chaat's "with" frame, `WithFood`) | eggs L2 |
| I'll have it! (Nani, the spare egg) | – | to record | eggs (the funny miss) |
| one for me (Nani, ordering her own) | – | to record (perhaps built from *hakro* and "for me", if Mum gives "for me") | eggs L4, oven L4 |
| {bake} for {meal} ("naan for dinner") | – | to record (needs the bake and meal nouns, then a "for" frame for a meal) | baking (Nani names the bake) |
| {A}'s and {B}'s: now (two owners, one time word) | – | to record (the two-owner frame) | oven L4 |
| aah (Nana, served) | – | a sound, not a word (family-recorded like "tok tok") | the serve |
| salt | *loon* | in engine (draft) | both |
| flour | *atto* | ✓ (draft) | baking |
| water | *paani* | heard in 3 lines | baking |
| milk | *dudh* | heard in 1 line | baking |
| sugar | *khun* | in engine | baking (the "no" row; L4 look-alike) |
| ghee | *ghee* | ✓ | baking |
| yoghurt | *dai* | ✓ | naan |
| oil | – | to record | baking (L1's decoy) |
| cup | *cup* | ✓ | baking |
| bowl | *bakuli* / *piali* | heard in 3 lines | baking |
| a little | *thorok* | ✓ (draft; the lexicon notes a doubt: on Mum's confirm list) | baking L1 |
| a whole cup (whole, full) | *aako* (*aako cup*) | ✓ | baking L1 |
| heaped, filled up | *bharelo* (*bharelo cup*) | ✓ | baking L3 |
| more | *wadhare* | ✓ (draft; the lexicon notes a doubt: on Mum's confirm list) | baking (the "too little" line from L1; "a whole cup more" at L3) |
| enough | *bas* | ✓ | baking (said only after a right stop) |
| half (of an amount) | *adh* (*adh cup*) | ✓ (draft) | baking L4 |
| half (a portion) | *ardo* | ✓ | baking L4 (if Mum says it's the one for "and a half") |
| a lot | – | to record | baking L3 |
| a bit more | – | to record (perhaps built from *thorok* and *wadhare*, if Mum confirms) | baking L3 |
| two and a half, one and a half | – | to record | baking L4 |
| one cup, two cups | *hakro cup*, *ba cup* | ✓ (`hakro-cup`, and `hakro-cup-ba-cup` in `data/family-audio.json`, Mum, checked ok) | baking L2 (the counted row) |
| one, two, three | *hakro*, *ba*, *trae* | heard in lines (one and two in the cup clips above; three in *trae bateta*, *trae dungri*). No bare clip, so a bare number said as a correction ("two!") is a placeholder voice until Mum records one | both from L2 |
| knead | *gund* | ✓ (heard once: on Mum's confirm list) | baking |
| put it in | *wiji chad* | ✓ whole line | baking (the cup's tip) |
| mix (put it together) | *bego kari chad* | ✓ whole line | baking |
| now | *hane* | ✓ | both (step calls) |
| oh no! | *oho* | heard in 1 line | both (a funny miss) |
| well done | *shabash* | ✓ | both |
| oven, naan, bread, cake | – | to record (`ph-bread` is a placeholder in Cook's data) | baking |
| breakfast, lunch, dinner, morning | – | to record | the meal word (C) |
| boiled or fried? | – | to record later (the engine's "or" frame is confirmed in *wadho ke nindho*) | the later speaking turn (§5), not this scope |

**Its verbs** (top-40 numbers from Part 3): make (14), want (6), put (7), give (20), eat (18), use (33), wait (37: "leave it a bit longer"), plus boil, fry, crack, knead and pour. Pour has no Kutchi in the repo, so Nani says "put it in" instead.

**Frames heard:**
- "I want {a boiled / fried egg}." (each person)
- "{An egg}, for {Nana}." (Nani relays, L3)
- "{Nana}'s {egg}." (L3)
- "{Ma} too." (L3)
- "{Amount} {item}." (each pour: "a little water")
- "Now {amount} {item}." (the step call)
- "{N} cups of flour" (L2, *ba cup* ✓) and "{N} cups of flour, and half." (L4)
- "Take it out now." / "Leave it a bit longer." (said as each bake's order when the oven step opens, never at the moment)
- "Careful!" (as the oven door first shows; one line, its own moment)
- "Enough! Well done."
- "Breakfast, lunch or dinner is ready." (Nani's meal line; to record)

**Frames said:** none in this scope. The speaking turn waits for the chai pilot (§5).

**New words per level** (target 3-5 a round, each heard at least 3 times):
- **Eggs:** L1 4 (egg, boil, fry it, I want). L2 +3 (two, chilli with or without, plate). L3 +3 (for, Nana's, too: the owner words, now deciding). L4 +2 (soft, hard).
- **Baking:** L1 5 (flour, water, a little, a whole cup; take it out now or leave it a bit longer). L2 +3 (cups counted, two, "no sugar"). L3 +3 (a lot, heaped, a bit more). L4 +2 (half, two and a half).
- **The meal words:** up to 3 per kitchen day in story mode (breakfast, then dinner on the first visit; lunch from visit 2), each heard at least 3 times (Nani's line at the station, the serve, the book; breakfast also at the door).

**Deciding words recorded today:**
- Eggs: 2 of 6. Boil and fry are ✓ as a verb and a whole line. "A boiled egg", "a fried egg", "crack" and "frying pan" aren't. So the eggs station is a reading leak on placeholders until Mum records 4 lines (decision 27).
- Baking: 6 of 9 amount words are ✓ (a little, whole, heaped, more, enough, half), two of them with a doubt flag (*thorok*, *wadhare*: Mum to confirm). "Two cups" is ✓ (*ba cup*). L1-L2 teach today. L3's "a lot" and "a bit more", and L4's "and a half", wait on Mum. Both oven lines are ✓.

## 2. Where it sits in its day

**The kitchen day** (Part 7: "the Cook stations; eggs at breakfast; baking"):

| # | Stage | Light | Meal word | What carries |
|---|---|---|---|---|
| 1 | The door | morning | "breakfast" (Nani at the door, to record) | the day's plan |
| 2 | **Eggs station** | morning (sun from the left) | breakfast | the eggs from the farm's crate (a brown one among them, the farm's) |
| 3 | From visit 2 only: one Cook station at lunch (chips mayai first, §5; later chai tray, maani, daar ...) | day (midday) | lunch | Nani's chai, or the day's set dish |
| 4 | **Baking** (pour, knead, oven) | golden evening throughout | dinner (at the serve) | the bake goes to dinner; or the party cake goes into its box for the birthday day |
| 5 | The evening book | night | "what did we make for dinner?" | the photo of the bake, the egg for Ali |

**The first kitchen day is short:** the door, eggs, baking, the book, with no lunch station (H50: one recipe across a few stations; a 3-year-old's sitting). Lunch joins on visit 2.

**Rhythm:**
- Eggs are tap, tap and a timing ring; baking is mostly hold and stop, and its oven comes last. From visit 2, the lunch station sits between them with a different main action.
- No two Cook stations in a row share their main action (PAN-13).

**Carries:**
- **From the farm:** Hannah Mami's eggs go to the pantry (`farm-eggs-orchard.md` decision 7). The bowl at the eggs station holds them, with one brown farm egg among them. Nani says nothing about it; it's a quiet nod.
- **To the party:** on the kitchen day before a birthday, the bake is the party cake. It goes into a plain box (no text) and comes out at the party (`party-gifts.md` §2).
- **To the book:** the bake, and Ali's fried egg folded in his maani.
- **Inside the kitchen:** crack is learned at breakfast and comes back in the cake (crack N eggs into the bowl). Eggs teach "take it out now"; the oven reuses it.

## 3. The stages

### The library (scored, then the keep)

Scored Fun / Kutchi decides / Novel / Plot / Cost to build (5 = cheap), each 1-5.

| # | Candidate | Fun | Kutchi | Novel | Plot | Cost | Total | Verdict |
|---|---|---|---|---|---|---|---|---|
| E1 | **Boil or fry, for whom** (the verb, the owner, the count) | 4 | 5 | 4 | 5 | 4 | 22 | **Keep: the eggs station's core** |
| E2 | **Crack** (the egg knocks the rim, splits, slides in) | 5 | 2 | 5 | 3 | 4 | 19 | Keep, inside E1: the gesture and delight |
| E3 | **Soft or hard** (one boiled egg out early, one later) | 4 | 5 | 4 | 3 | 4 | 20 | Keep as E1's L4 |
| E4 | **"And you?"** (the child orders their own egg) | 4 | 4 | 4 | 5 | 4 | 21 | Later visit, after the chai speaking pilot (§5): Zafar's speaking plan builds nothing else first, and its lines are unrecorded |
| E5 | Chips mayai for lunch (crack into a bowl, pour, flip) | 4 | 4 | 3 | 4 | 3 | 18 | Later visit (the worked example in the recipes guide) |
| E6 | Toast pops, paratha puffs | 3 | 1 | 2 | 2 | 3 | 11 | Park: no word decides it; the maani line already flips bread |
| B1 | **Pour to the word** (no line on the cup) | 4 | 5 | 5 | 4 | 3 | 21 | **Keep: baking's core** |
| B2 | Two and a half cups (whole, whole, half) | 3 | 5 | 4 | 3 | 4 | 19 | Keep as B1's L4 |
| B3 | Salt or sugar (two white jars) | 3 | 5 | 3 | 3 | 5 | 19 | Keep as B1's L4 look-alike |
| B4 | **Knead** (squish the dough) | 4 | 1 | 2 | 3 | 5 | 15 | Keep as a short beat, not a stage, and the count's commit (decision 12) |
| B5 | **The oven: each bake out at its word** | 4 | 4 | 4 | 4 | 4 | 20 | **Keep: baking's second stage** |
| B6 | Decorate the party cake (candles, colours) | 4 | 3 | 2 | 4 | 3 | 16 | Park: decorating swamps measuring (research), and candles belong to the party |
| B7 | A full cup of flour puffs a cloud as it lands, and Simba sneezes | 5 | 1 | 4 | 3 | 4 | 17 | Keep as B1's joke, on a right whole or heaped cup of flour (not on a miss) |
| B8 | Shape the dough (pinch N balls) | 3 | 3 | 1 | 2 | 4 | 13 | Cut: the maani line already does it |

**The keep:**
- **The eggs station:** E1 (with E2 inside, and E3 as its L4). E4 moves to a later visit (§5).
- **Baking:** B1 (with B2 and B3 at L4, and B7 as its joke), B4 as a beat (and the count's commit), and B5.

---

### Stage E1: Eggs, boil or fry, for whom

**Why:** it's Zafar's game and his sentence. The eggs are all the same until cooked, so only the heard verb picks the pot or the pan. From L3, when Nani relays the orders on her one card with no faces, only the heard name picks the plate.

**The scene** (top-down, camera T, Cook's kit):
- The compact hob in the middle with two burners: the pot of water on the left and the frying pan on the right.
- The bowl of eggs at the bottom left of the play area.
- The tray of plates at the right, 2×2 like the chai tray: one plain plate per person at the table, each with its person's face badge on the tray rim (the chai tray's badge rule). The plates are empty and alike.
- Morning light lies across the worktop from the upper left.

**Steps:**
1. Tap an egg in the bowl. It lifts and glows.
2. Tap the pot or the pan.
   - **Pot:** the whole egg plops in and bobs in the bubbles. The burner lights itself with a soft whoosh.
   - **Pan:** the egg hops to the rim, knocks once (**crack**), splits, and the white and yolk slide in with a sizzle. The burner lights.
3. Each egg gets its own ring (Cook's fry ring, `fry.js`, with a pot profile and a pan profile), filling as it cooks. Tap the egg when the ring is in the green.
   - The fried egg is lifted with the flat turner and slides off.
   - The boiled egg is lifted with the slotted spoon.
   - Either way it rises above the hob, waiting.
4. Tap the plate. The egg flies there: the boiled egg peeled onto the plate (§10 open question 3: egg cup or peeled), the fried egg flat on the plate.
5. **Tap the tray: the commit,** and the only moment the plates are judged. Once every plate has at least one egg and nothing is cooking, the tray glows; nothing about the glow says whether the counts are right. Tapping it carries the tray to the table, an action with its own meaning like the baking cup's tip, not a Done button. Each plate is judged against its person's order (verb and count). A plate that's wrong shakes and comes back, Nani says that person's order again, and the eggs that don't belong hop back to the hob to be given again (too few: the plate waits for more). Until the tray is tapped, eggs can be moved freely between plates (NN7's undo). When every plate is right, each person's face appears over their plate (Cook's review).

**The five questions:**

| Q | Answer | Score |
|---|---|---|
| 1. What do you do? | Tap, then tap (egg, then pot or pan); tap in the green; tap the plate; tap the tray to serve. One gesture per kind of action. | 5 |
| 2. Does the Kutchi decide it? | Yes. The verb (boil or fry) picks the pot or the pan. From L2 the number picks how many, and "with chilli" or "no chilli" picks the shaker. From L3, the owner picks the plate (Nani's card has no faces). From L4, soft or hard picks when to take it out. At L2 the plate is support: the person's card part carries their face, and the tray badge matches it. | 5 |
| 3. Where is the fun? | The crack and sizzle. The egg bobbing in the boiling water (tap the pot and it bobs again: a toy while you wait). At the serve, Nana knocks his boiled egg on the plate's rim, "tok tok", and the shell falls away; Ali folds his fried egg into a maani and grins. | 4 |
| 4. Where is the instruction? | At L1-L2 each person, on screen at the table first, says their order in the Cook frame "I want a boiled egg". From L3 Nani relays all of them. The card pops up big, then flies to its row. Nani calls each step once as it opens ("now, the eggs"). | 4 |
| 5. What is novel? | Two cooking verbs on one identical item. The crack. From L3, the first Cook station where the heard owner, not a face, picks the plate. The meal named by the light. | 4 |

**The level ladder** (each level adds one thing; the Kutchi gets harder, not the gestures):

| Level | Adds | The ask (in English; built by the engine) | People and eggs | Decoys |
|---|---|---|---|---|
| **L1** | The core: one person, one egg; boil or fry | Nana: "I want a boiled egg." | 1 person, 1 egg; the bowl holds 3 | the other vessel |
| **L2** | A second person; numbers; chilli "with" or "no" (each drawn at random); the plate is support (faces on each person's card part) | Nana: "a boiled egg"; Ali: "two fried eggs, with chilli." | 2 people, 1-2 eggs each (never always one each); the bowl holds 1-3 extra | the chilli shaker (a real choice: sometimes asked for, sometimes "no", ticked at the plate) |
| **L3** | Other ways of saying it: Nani relays every order on her one card, one row per order, with the egg picture and no face ("a fried egg, for Nana"; "Ma too"; "Ali's is boiled"). The owner now decides the plate. | Nani: "A fried egg for Nana. Ma too. And Ali's is boiled." | 3 people; the card's picture blurred; the rows' order and the tray's order are shuffled separately | 3 |
| **L4** | Soft or hard: the boiled egg's ring has two greens (an early, light one for soft; a later, deeper one for hard) | "A soft boiled egg for Ali, a hard one for Nana. And one for me." Nani's step line, said as the eggs go in: "Ali's: take it out now." / "Nana's: leave it a bit longer." | 3-4 people (the fourth is Nani herself, "and one for me"); two boiled eggs in one pot (the look-alike) | 4, one a look-alike (the second boiled egg) |

**Timing:**
- Rings run about 15% quicker per level (`data/stations/eggs.json`).
- L1's ring holds in the green the first time (SH-158). From L2 a fried egg left past the green just goes a little crispy at the edges, with a funny "crunch" when it's served.
- At L4 a soft egg taken out late is still eaten (the yolk is set, Ali shrugs and grins); a hard egg taken out early goes back in on the spot with "leave it a bit longer". Only the first-go tick is lost.
- Nothing burns or blackens, ever. A child is never made to feel bad.

**The leak test:**

| Way to win without Kutchi | Can it? | The fix |
|---|---|---|
| **Reading** | Only on English placeholders. | The card shows the Kutchi always, and its English is dotted from L2. Until Mum records "a boiled egg", "a fried egg" and "crack", a reader wins (decision 27: it counts as teaching only once they're in). |
| **Matching** | At L2, the plate (by design: support). From L3, no. | The card's picture of the cooked egg is support. It shows until the word is picked right 3 times in a row, then speaker only, and it's blurred from L3. At L2 each person's card part has their face, so the plate is matched by face: that's support, and the bot doesn't count it. From L3 Nani's card has no faces, so the badge can be found only from the heard name. No plate hints at the egg. |
| **Eliminating** | Only on the last plate, and only partly. | Each person's verb is random and independent (both can be boiled; all three can be fried). Counts are 1-2 at random, so the last eggs can't be shared out by elimination. The "with" or "no" chilli falls on a random person. The last plate can be found by elimination at L3, but its verb and count still decide it. |
| **Patterns** | No. | Tastes rotate (`tasteChance` 0.5): Nana isn't always boiled. The order of people on the tray changes each round, and so does who speaks first. At L3 the card's rows are shuffled separately from the tray. |
| **Waiting** | No. | Nothing cooks or moves until the child acts. The help glow (after 7, 9, 11 or 13 s from the last action) shows only the next step's place (the bowl, the hob, the plates), never which vessel or plate. Nani's "take it out now" at L4 is said when the eggs go in, never at the green. |

**Bot estimate** (a learned save, guessing, first-go rows only): L2 is the verb for each of 2 people (½ × ½) and each count (½ × ½), about 6% a round; the plate is support and not counted. L3 adds the plate mapping (three people, about ⅓ × ½ for the first two) and three verbs: under 1%. L4 is under 1%. **L1 is 50%**, which is fine because its word is still supported.

**Counts never end by themselves:**
- Extra eggs land: tap a third egg into the pan and it fries.
- Counts are judged only at the tray commit (step 5), never as an egg lands, so a plate never tells the child its count by refusing an egg. Put three on Ali's plate when he said two, tap the tray, and his plate shakes, Nani says Ali's order again, and one egg hops back to the pan.
- An extra fried egg left in the pan at the end goes to Nani ("I'll have it!", with a grin; to record). It costs only the first-go tick of that row. That's the funny miss, never a frown.

**Wrong vessel:**
- Put Nana's egg in the pan when he asked for boiled, and the egg wobbles on the rim before it cracks (the redo on the spot).
- Nani says Nana's order again, and the egg hops back to the bowl.
- The miss reactions rotate: a wobble on the rim; Simba's ears popping up at the sill; the egg spinning like a top.

**The delight moment:** the crack. One knock, the shell splits, the yolk slides out and wobbles, then the sizzle. At the serve, Nana's "tok tok" on the plate's rim and the shell falling away; at L4 he halves it and a soft egg's yolk runs (the soft and hard reveal).

### Stage E4: "And you?" (moved to a later visit)

Not in this scope. Zafar's speaking plan (`speaking.md`, 29 Sept and 14 Oct) pilots speaking at Cook's chai ordering first, builds the shared component from what the pilot teaches, and builds nothing else until then; and the lines it needs ("boiled or fried?", "boiled", "fried") aren't recorded. When it comes (§5), Nani asks the child "boiled or fried?" and the child answers in one word: "boiled", "fried", or "no, thank you". That's the natural reply, and a closed set that sounds different.

---

### Stage B1: Baking, pour to the word

**Why:** Zafar's rule is "no fill line; the amount word says when to stop". Amounts are the one thing no other game makes the move. The clear cup with no lines on it makes "how much" something you can see, and the word sets the target.

**The scene** (front-on, camera E; the view is the chaat v2 or pantry front-on view if one fits, §6):
- A marble worktop at eye level, in golden-evening light.
- Centre: Nani's clear glass measuring cup, plain, with a handle and no marks. It's at least 55% of the play height at every size, so "a little" and "half" read on a phone.
- To its right: a big steel mixing bowl, seen front-on (F view), so the heap and the dough show over its rim.
- The bottom strip: Cook's front-on containers from the pantry family (flour jar, water bottle, milk carton, oil bottle, ghee tin, yoghurt tub, sugar jar, salt jar), only those in play plus the level's decoys.
- Nani stands at the right, waist up, behind the counter.
- Simba sits on the window sill at the right edge, under Nani, only his head and ears above the counter (the joke). The left is the side panel's.

**Steps:**
1. Nani names the bake ("naan for dinner", to record), and the card pops up big and flies to its row. The card lists each ingredient with its amount, in order (the sequence line, grey "next").
2. **Hold** the container Nani calls. It slides over the cup, tilts and pours, and the level rises with the pour sound, its pitch rising. Nothing is said while it pours.
3. **Let go** to stop. Nothing is judged and nothing is said. You can hold again to top up, as many times as you like.
4. **Tap the cup.** It tips into the bowl ("put it in"). This is the commit for the amount, and the only moment an amount is judged.
   - **Right:** a soft thump and the heap rises in the bowl. On a single-amount row the row ticks and Nani says "enough! well done"; she says *bas* only here, never during a pour. On a counted row (L2, L4) the cup just lands; the row stays open until the knead (step 5).
   - **Too little:** the cup comes back. Nani says "more" (*wadhare* ✓; "a bit more" once it's recorded) and the child tops it up.
   - **Too much:** the extra tips back into its container and Nani says the amount again; the child redoes it on the spot. The reactions rotate, and stay small: a liquid sloshes ("splosh"), Simba's ears pop up, Nani laughs "oho".
   - **The joke (B7):** a right whole cup or a right heaped cup of flour lands with a big soft puff of flour from the bowl, and Simba sneezes, "ah-choo!". The funniest thing comes with the right word, never with a miss.
5. **The knead, and the count's commit.** Once the last row has had its first tip, the bowl is live beside the jar, with no glow and no line, so nothing hints that the count is reached (the help glow, after its delay, shows the jar and the bowl together). The child's first tap on the bowl is the commit for every counted row (the cups of flour, the cake's eggs) and for the "no" row: they're judged now, never as a cup lands.
   - **Right:** Nani says "knead" (*gund*) once, the dough squelches together and the counted rows tick. Tap on: 6 taps in all, and it squishes, folds and turns smooth. There's no counting aloud.
   - **Too few:** the dough stays crumbly and dry. Nani says the row again ("two cups of flour"), the row reopens, and the child adds the rest; then the knead goes on.
   - **Too many:** a puff, the last cup lifts back out of the bowl into its jar, and Nani says the row again.
   - Then Nani carries the tin to the oven (B5).

**Counted rows never close by themselves.** Nothing on screen counts: no number on the bowl, and Nani doesn't count along (at L4 only, while "two and a half" is a supported word, she counts each tip as it lands; once it's picked right 3 times she stops). After a counted row, Nani doesn't call the next step, since that would tell the child the count was reached; the child moves on by holding the next row's container (the card's grey "next" row shows which, while supported), and her call follows as they pick it. A counted row is always the last row before the knead, so the knead is its natural commit. At L4 the cake's eggs (crack, from the eggs station) are counted the same way, just before the flour.

**The amounts** (a band on the cup's fill, from 0 to the brim, set in `data/stations/baking.json`, widest at L1):

| Word | Band at L1 | Band at L4 | Notes |
|---|---|---|---|
| a little (*thorok* ✓) | 5-40% | 5-25% | |
| a whole cup (*aako* ✓) | 75-100% | 88-100% | the cup stops pouring at the brim |
| heaped (*bharelo* ✓) | – | brim, then held on: a heap mounds above the rim, then overflows | L3 on, dry things only |
| a lot (to record) | – | 60-85% (55-85% at L3) | L3 on. A full cup is too much for it. Now and then in the same round as "a whole cup", so the two are contrasted |
| a bit more (to record) | – | a top-up of 5-30% on a finished row | L3 on: Nani's "second look" |
| half (*adh* ✓) | – | 40-60% | L4 |
| two cups (*ba cup* ✓) | – | whole cups, each tip judged as whole, the count judged at the knead | L2 on |
| two and a half (to record) | – | whole, whole, half in any order: each tip judged as whole or half as it lands; the total judged at the knead | L4 |

**The five questions:**

| Q | Answer | Score |
|---|---|---|
| 1. What do you do? | Hold the container, let go to stop, tap the cup; tap the dough. The same gestures at every level. | 4 (hold is new to Cook: §10 decision 1 asks Zafar, since it reverses H17) |
| 2. Does the Kutchi decide it? | Yes. The amount word sets where you stop, the number sets how many cups go in before the knead, and from L2 the item word picks the container (two words per move). Nothing on screen shows the target or the count. | 5 |
| 3. Where is the fun? | The pour (the rising level, the glug and its pitch). The flour puff and Simba's sneeze on a full or heaped cup. The squish of the knead. The contrast between a tiny "a little" and a heaped cup. | 4 |
| 4. Where is the instruction? | Nani, on screen, names the bake and then calls each step once as it opens ("now, a little water"). The card shows every row's Kutchi. | 4 |
| 5. What is novel? | The only game where how much is the move. The first Cook pour with no line. | 5 |

**The level ladder:**

| Level | Adds | Example (English; built by the engine) | Pours | Decoys |
|---|---|---|---|---|
| **L1** | The core: a little or a whole cup, each picked at random per row; one bake | Naan: "a little water; a whole cup of flour." | 2 | 1, clearly different (the oil bottle) |
| **L2** | Numbers of cups (whole cups, judged at the knead, with nothing counting on screen), and a "no" row said last; the English dotted | Bread: "a little milk; a little salt; no sugar; two cups of flour." | 3 | 2 (the sugar jar is one; it's ticked at the knead if it stayed out) |
| **L3** | Other ways of saying it: "a lot", "heaped", and Nani's second look ("a bit more milk" or "a whole cup more"); the picture blurred; some bakes now want "a little sugar", so the sugar jar is a real choice | Naan: "a little yoghurt; a little ghee; a lot of flour." Then: "a bit more yoghurt." | 3, plus 1 top-up | 3 |
| **L4** | Halves: half a cup, two and a half cups; the salt-or-sugar look-alike | The party cake: "half a cup of sugar; a little milk; two eggs" (crack, from the eggs station); "two and a half cups of flour." | 4 | 4, one the look-alike (salt beside sugar) |

**Two and a half** (L4):
- Each tip of the cup adds what's in it, judged as it lands: a whole cup or a half. A cup in neither band comes back, and Nani says the row again.
- The order of the tips doesn't matter; the total is judged at the knead commit (step 5): too few and the row reopens, too many and the last cup lifts back out.
- Nani's counting along ("one", "two", "and half") is support while the word is new, and stops once it's picked right 3 times.

**The leak test:**

| Way to win without Kutchi | Can it? | The fix |
|---|---|---|
| **Reading** | Only on placeholders. | The card's amounts are Kutchi. "A little", "whole", "heaped", "half", "more", "two cups" and "enough" are ✓ today, so L1-L2 teach at once. "A lot", "a bit more" and "two and a half" are a reading leak until recorded. |
| **Matching** | Only while supported. | While an amount word is supported, the card row shows a small picture of the cup at that amount. Once the word is picked right 3 times in a row, it's speaker only. The cup itself never has a line, a mark or a ghost level, and the bowl shows no count. The container pictures follow the same support rule. |
| **Eliminating** | No. | Amounts are drawn at random for each row (two "a little" rows in one round are allowed). The "no" row's container sits in the strip like any other, and from L3 the same jar is sometimes asked for. |
| **Patterns** | No. | Flour isn't always "a lot": the amount follows the bake's size (a small naan for Ma, a big loaf for the family), drawn at random. The order of the single-amount rows changes, and so do the bakes. A counted row is always last before the knead, but that tells the order, not the number. |
| **Waiting** | No. | Holding until it stops gives a full cup, which is right only for "a whole cup" (a full cup is too much for "a lot"). "A whole cup" is never more than one row in three at L2 and above. Nani never says "enough" while the level rises. Nothing commits until the cup is tapped, and no count closes a row by itself: the count is judged at the knead. |

**Bot estimate** (the leak bot counts first-go rows only: a child who fishes still finishes every round, so a "win" means every row right first go): L1 is about 25% (two rows of two choices, both supported words). L2 is 3 rows × (container ⅓ × amount ½), and the counted row's number (⅓): under 1%. L3 and L4 are under 1%.

**The delight moment:** the pour itself, with the rising pitch and the level climbing the clear glass, and the heap that mounds over a "heaped" cup. The joke is the flour puff and Simba's sneeze when a full or heaped cup of flour goes in right: the same every visit, so the child waits for it, and the way to get it is the right word.

**Speaking:** none here (decision 13).

---

### Stage B5: Baking, the oven

**Why:** the bake should come out right, and the time words ("take it out now", "leave it a bit longer") are recorded and need a home where they decide something. The oven gives baking its reveal.

**The scene** (the same camera E, a gentle pan to the right, never a cut):
- The oven's glass door fills the middle, warm-lit inside.
- The bakes sit on one tray, each with its person's face badge on the tray edge in front of it (the chai tray rule).
- Nani stands at the right.
- In golden-evening light, the window behind is going amber.

**Steps:**
1. As the oven comes into view, Nani says "careful!" (*dhyan rakh* ✓), one line in its own moment.
2. The door shuts, and Nani gives each bake its word once: "take it out now" or "leave it a bit longer" (from L3 with its owner: "Ali's: take it out now"). She never says it again at the moment of the band; a voice that says when would be a waiting leak.
3. Each bake rises behind the glass (real art frames: flat, risen, light golden, deep golden), and each has a ring. The ring passes through the light-golden band ("now") and fills on to the deep-golden band ("a bit longer"). Past the end of the deep-golden band, the ring stops and the bake waits.
4. Tap a bake. The door swings open.
   - **Right:** the bake slides out onto the cooling rack with a puff of steam, and the door closes. The row ticks.
   - **A "now" bake tapped late** (deep golden, or left waiting): it still comes out, deeper and toasty, and is still eaten. Its owner says "oho" and grins, Nani says "take it out now" once, kindly, for next time, and only that row's first-go tick is lost. Nothing is ruined, nothing blackens.
   - **A "bit longer" bake tapped early** (light golden): Nani says "leave it a bit longer", the bake slides back in and the door shuts. The redo on the spot; only the first-go tick is lost.
   - **Any bake tapped before its first band:** the door stays shut and the bake gives a little wobble. No line.
5. When the last bake is out, the serve: Cook's review faces appear over the cooling rack ("aah"). The dinner table at the night island waits until that background is made (§7).

**The five questions:**
1. Tap in the band (5).
2. The Kutchi decides from L1: each bake has its own word, "now" or "a bit longer", drawn at random, and from L3 its owner (5).
3. The fun is the rise behind the glass, the steam puff, and the naan bubbling up (4).
4. Nani says "careful!" as the oven first shows, then each bake's word as the door shuts (4).
5. Novel: the only Cook step behind glass, and the time words as amounts (4).

**The level ladder:**

| Level | Adds | Example |
|---|---|---|
| **L1** | One bake, one ring; its word drawn at random. The card row's picture (light or deep golden) is support until the word is picked right 3 times. The first time, the ring holds in its band (SH-158). | Nani: "Take it out now." (or "Leave it a bit longer.") |
| **L2** | Two bakes, each with its own word, rising at different speeds (a juggle, Cook's fry) | Two naans: one "now", one "a bit longer" (or both the same). |
| **L3** | Each bake's word comes with its owner, on Nani's one card with no faces (as at the eggs' L3), so the badge is found from the heard name. The picture is blurred. | "Ali's: take it out now. Nana's: leave it a bit longer." |
| **L4** | Three bakes; one look-alike pair (two naans the same size, different words); the two-owner frame (to record) | "Nani's and Ali's now. Nana's a bit longer." |

**Timing:** rings run about 15% quicker per level (data). Past the end of the deep-golden band, the ring stops and the bake waits. Nothing burns: deep golden with toasty spots is the darkest frame there is.

**The leak test:**
- **Reading:** both lines are ✓ whole lines, so there's no placeholder leak.
- **Matching:** the row picture of light or deep golden is support until the word is picked right 3 times. At L1-L2 each row's face matches its badge (support); from L3 Nani's card has no faces, so the owner is found only by ear.
- **Eliminating:** "now" and "a bit longer" are drawn at random for each bake. All the same is allowed.
- **Patterns:** Ali isn't always "now"; the asks rotate.
- **Waiting:** waiting gives every bake deep golden, which is a miss for every "now" bake: the light-golden band passes and isn't caught by waiting. Only a round where every bake is "a bit longer" is won by waiting, which is the same as a guess.

**Bot estimate** (first-go rows): the time word is a two-way choice, so the oven's floor is ½ a bake: ½ at L1 (supported), ¼ at L2, under ¼ at L3 (with the owner by ear), ⅛ at L4. That's honest, since the word decides each bake, but the oven alone isn't under 10% until L4's three bakes, so the leak bot reports it on its own as well as inside the station's round (B1 and B5 together: under 1% from L2).

**The delight moment:** the naan puffs up in big bubbles behind the glass. The loaf domes and its crust cracks golden. The cake rises over the tin's rim with a little wobble.

---

### C. The meal word (Zafar's rule for every Cook station)

- **Story mode** (his word: "breakfast, lunch and dinner come from the time of day in story mode"): each kitchen day's stage carries a time slot (`morning`, `midday`, `evening`) in the days data. The slot sets the light state of the background (art bible §2: day, or golden evening and night), and Nani's opening line names the meal: "Breakfast!", "Lunch is ready", "Let's make dinner" (to record).
- **Free play:** each station keeps its own meal: eggs are breakfast, baking is dinner, and the other stations play in day light with no meal line (decision 16). There's no device clock, so eggs are never fried at "lunch".
- **What it decides:** nothing. It is never the move. The sky sets the kind of meal, and the Kutchi picks the item (pack the bag's rule, research §15). It's words heard in context: up to three meal words a day, each at least three times (Nani's line, the serve, the book).
- **Where it lives:** eggs always play at breakfast. Baking plays at golden evening and serves dinner. The other stations take whatever slot the day gives them.

## 4. The child's first-ever round

The first kitchen day: the door, eggs, baking and the book, with no lunch station (§2). The child has done the first launch and has played the chai tray before (Cook's day 1), so the hob is familiar. This walkthrough follows §3's rules exactly: one line per moment, only L1's words, nothing judged before its commit.

**The eggs station, L1:**
1. **The door, morning.** Nani at the door, the sky bright. She says "breakfast!" (to record) and the door opens into the kitchen.
2. **The island, eye level, morning sun.** Nana sits at the island with his chai and says "I want a boiled egg." His card pops up big (his face, the Kutchi, a picture of a boiled egg), then flies into its row in the side panel. A gentle slide down to the hob.
3. **The hob, top-down, first time.** Before anything is live, the light names the two vessels, one moment each. The lit box hugs the pot and Nani says "the pot" (*tapelo* ✓). Then it hugs the pan; "frying pan" is spoken in grey (to record). The rest is dimmed and can't be tapped.
4. **One live thing: the egg bowl.** A gold glow on the bowl, nothing else lit. Nani: "now, the egg" (built from *hane* ✓ and egg ✓). The child taps an egg and it lifts.
5. **The hob: the one deliberate exception to "one live thing".** A choice needs two targets, so one lit box goes round the whole hob, both vessels live inside it, and nothing else is lit. The child taps the pot. Plop: the egg bobs, the burner whooshes alight, and the ring appears. (Had they tapped the pan, the egg would wobble on the rim, Nani would say Nana's order again, and the egg would hop back. No frown.)
6. **While it cooks.** The light rests on the pot, and a tap makes the egg bob again. Nani is quiet. The ring holds in the green this first time, and Nani says one line: "take it out now" (*inke hane kadh* ✓). The child taps the egg and the slotted spoon lifts it.
7. **One live thing: Nana's plate.** Tap, and the egg lands on his plate.
8. **One live thing: the tray** (the commit, shown once). It glows; tap it, and it's carried to the table. The row ticks gold.
9. **The serve.** Nana's big face appears over the plate. He knocks the egg on the plate's rim, "tok tok", the shell falls away, and he says "aah". In the next moment Nani says "well done" (*shabash* ✓), and the word card plays: egg, boil, I want.
10. **The end.** The shared two-page end screen: the time, the ticks, the bulb, then the words with English under them for the grown-ups. Back to the kitchen.

**The baking station, L1** (the same day, golden evening), in short:
1. The counter, eye level. Nani says "naan for dinner" (to record) and the card flies in: flour with a whole cup, water with a little.
2. The light first shows what isn't on the card: the oil bottle. Then it shows the new action once: the flour jar glows, and the light pulses on it with a held-press ring until the child presses. The jar pours, and the cup fills.
3. The child lets go. Nothing is said and nothing is judged; they can hold again as often as they like. Then the cup glows (the tip, shown once): tap it. It tips into the bowl, and only now is it judged.
   - Full enough: a big soft puff of flour, Simba sneezes "ah-choo!", and in the next moment Nani says "enough! well done". The row ticks.
   - Short: the cup comes back, Nani says "more" (*wadhare* ✓), and the child tops up and taps again.
4. "Now, a little water." The light is on the water bottle only. Hold, let go, tap the cup. If too much went in, it sloshes ("splosh"), the extra goes back, and Nani says "a little water" again.
5. The bowl is live. Tap it: Nani says "knead" (*gund*), the dough squelches together, and tap, tap, squish.
6. A gentle pan to the oven. Nani: "careful!" (one moment). The door shuts and she gives the naan its word: "take it out now" (the first round is always "now"; the card row shows a light-golden naan as support). The naan puffs up in bubbles behind the glass, and the ring holds in the light-golden band this first time. Tap, and the door swings open with a puff of steam.
7. The serve: Nana's face over the cooling rack; he tears the naan, "aah". In the next moment Nani says "dinner!" (to record). Word card, end screen, book.

**Progress the child sees:** each card row ticks as its step closes. The bowl fills and the dough turns smooth. No score shows during play.

## 5. Later visits and harder versions

- **Visit 2 of the kitchen day:** lunch is **chips mayai** (E5), the first lunch station. Crack N eggs into a bowl, then pour into the pan over the chips and flip with the turner. It's the worked example in the recipes guide (`data/examples/chips-mayai.json`), made real. The count and "with" or "no chilli" decide.
- **The eggs' speaking turn (E4), after the chai pilot:** once Cook's chai ordering pilot has run and the shared speaking component is built from it (`speaking.md`), Nani asks the child "boiled or fried?" after the others have ordered, and the child answers in one word: "boiled", "fried", or "no, thank you" (three that sound different; the pills always there; no answer wrong). It needs "boiled or fried?", "boiled" and "fried" recorded first.
- **The party cake visit:** on the kitchen day before a birthday, baking makes the cake (B1 at L4: halves and the crack). It goes into its box and comes out at the party.
- **More bakes:** a loaf for the neighbours (the owner words), and maani's cousin, a thick bread, if Mum names one. Each bake is data: new rows and new art.
- **More eggs:** an omelette ("crack two, a little salt, no chilli"), and the soft and hard pair spread to more people.
- **The describing pair:** soft and hard come back in the clean-up day and the shops (if Mum's words fit there too).
- **The night island:** dinner served at the island under the lamps, once that background is made with the book.

## 6. What it reuses and what's new

**Reuse:**
- The shared host, the order card, the guide box, the help glow and the three badges. The shared two-page end screen. `data/rules.json` levels (`js/shared/rules.js`).
- **Cook's kit:**
  - the compact hob, burners and lit ring (chai v2);
  - the pot with its boiling contents and the frying pan (`vessel-kadai-oil-t` art family);
  - the slotted spoon and the flat turner (maani);
  - the fry ring (`js/cook/mechanics/fry.js`) for both vessels: the pan with its fry profile, and the pot as a second "pan" with its own ring profile (two bands at L4 for soft and hard). `boil.js` is a knob game (light it, turn it down in the green) and isn't used, since eggs have no knobs (decision 17);
  - the chai tray's face-badged 2×2 tray (`js/cook/stations/chai-tray.js`) for the plates;
  - Cook's review faces (`Cook.Kit.review`) for the serve;
  - the `add` mechanic for the chilli shaker's "with" or "no" row, and the chaat's "with" frame (`WithFood` in `data/cook.json`).
- **The pour:** `js/shared/pour.js` `Cook.Pour.hold` (the press-and-hold pour), with its dashed fill lines turned off by a setting. The pantry v2 front-on containers.
- **Knead:** `js/cook/mechanics/knead.js`, un-parked (decision 12).
- **The tawa ring:** `tawa.js` (band, rate, several at once) for the oven's bakes.
- **The recipe engine:** the slot model (`people`, `byLevel`, `tasteChance`, `no`) and the order ladder (`js/cook/recipes.js`). The farm's eggs carry through the pantry list.
- **The days data:** the time slot per stage (the light state already exists in the art bible's plan).
- **Family clips already in the manifest:** *hakro cup* and *hakro cup, ba cup* ("one cup, two cups", Mum, checked ok, `data/family-audio.json`) for L2's counted row; *trae* heard in *trae bateta* and *trae dungri*. Only a bare number for a correction is new to ask for.

**New to build:**
1. **`js/cook/mechanics/crack.js`** (tiny): an egg flown to a vessel's rim knocks, splits and slides in (art frames), with a sound. It's used by eggs, the cake and chips mayai.
2. **`js/cook/mechanics/measure.js`** (small): the clear cup with no line. It wraps the hold pour, takes several holds, then judges one commit (the tip) by the cup's fill against the amount word's band from data. It also handles the top-up and the tip back. For counted rows (whole cups, halves, the cake's eggs) it keeps a hidden tally and hands it to the knead commit: the first tap on the bowl judges every counted row and the "no" row, reopens a short row, or lifts the last cup back out. Nothing shows the tally.
3. **`js/cook/stations/oven.js`** (small): a zone of N tawa rings behind a glass door. Every ring has both bands, light golden then deep golden, and each bake's word picks which one is right; the other is a defined, kind miss (a "now" bake late comes out toasty and eaten; a "bit longer" bake early goes back in). The ring stops at the end of the deep band.
4. **`js/cook/stations/eggs.js`** and **`js/cook/stations/baking.js`**, combined stations on `Cook.Mech.combined`. Their data is in `data/stations/eggs.json` and `data/stations/baking.json` (levels, bands, ring speeds).
5. **The front-on counter for baking** (camera E): first test whether the chaat v2 front-on view (`cook.md` §14, with its shelf band) or the straight-on `pantry` view is the counter, with the oven at the right. Add a new `counter` view only if neither fits.
6. **Recipes** in `data/cook.json`: `eggs`, `naan`, `bread`, `party-cake` (later `chips-mayai`), with slots for the amount per row (`{"pick": ["little", "whole"], "byLevel": [...]}`).
7. **The meal-word line:** a `slot` field on kitchen stages in the days data, and the light state of the background picked from it.
8. **Words:** every placeholder in §1 goes into `data/lang/seed/cook.json` with its English and no Kutchi, so it shows in the gap list for Mum.
9. **The leak bot's rows:** the bot learns a save, guesses amounts by holding to random levels, guesses counts, and taps oven bakes at a random band or waits. It counts first-go rows only (a child who fishes still finishes every round, so a win means every row right first go). The station's round must be under 10% at L2 and above; the oven is also reported on its own (§3 B5).
10. **The eggs' tray commit:** the tray glows once every plate has an egg and nothing is cooking; its tap judges every plate's verb and count (chai tray code, with a judge at the tray rather than at each cup).

**Lab entries:** `lab.html?mode=cook&game=eggs&level=1..4` and `&game=baking&level=1..4`. The phone layouts are checked on the lab page at the four sizes and 915x275 before the game is built (the fast lane, Zafar 27 Oct).

## 7. The art

All of it goes in **one paste block for one ChatGPT run** that Zafar supervises (NN8), with the backgrounds locked first. Cameras follow the art bible: the hob scene top-down (T), baking front-on (E, items in F view), the island at eye level (E). People are always drawn from the approved sheets (the customers sheet, the Nani sheet), never from a description; Simba is the big black cat with green eyes (`cast.md`). No hands or arms on any prop (H13).

**Backgrounds (lock first; three, trimmed to what this run needs):**
- The hob, top-down: the existing compact hob with two burners, in a **morning** light state across the worktop.
- The island at breakfast: the existing island view (`assets/cook/bg/service.jpg`), relit as **morning**.
- The counter, eye level, in **golden evening**: a marble worktop with a sage splashback and the oven built in at the right with its glass door (closed, and open). If the chaat v2 or pantry view fits (§6), it's relit instead of drawn new.
- Later, with the book: the island at **night** with lamp light, for dinner at the table (§5).

**Eggs (T):**
- Eggs whole (cream-white and one brown), and the egg bowl.
- Crack frames: knock, split, slide; and the raw egg in the pan.
- Fried egg states: raw, setting, done, crispy-edged.
- An egg bobbing in boiling water.
- A plain plate: a boiled egg whole, its shell cracked and falling away, peeled and halved soft (runny yolk), peeled and halved hard (open question 3: if Zafar says egg cups, these become an egg cup with the lid on, lid off soft, lid off hard).
- A slotted spoon (if the maani set lacks one).
- A chilli shaker.

**Baking (F, front-on):**
- The clear glass measuring cup, empty, with fill art for dry (flour, sugar, salt) and liquid (water, milk, yoghurt, ghee, oil). Code reveals painted fill through a rising mask; it draws nothing.
- A heaped cup; the big flour puff (a right full or heaped cup landing); the small slosh frame.
- The steel mixing bowl: empty, a small heap, a big heap, shaggy dough, crumbly dry dough (too few cups), smooth dough, and dough mid-squish.
- The salt jar as a look-alike of the sugar jar (same jar, finer crystals). Other containers come from pantry v2 where they exist.
- **Bakes on a tray, behind glass and out:** naan (flat, bubbling, light golden, deep golden with toasty spots), a loaf in its tin (four states), the party cake in a round tin (four states, plain with no icing, since decorating belongs to the party). Deep golden is the darkest frame; nothing blackens.
- The cooling rack, and the plain cake box (no text).
- Simba's head at the sill, at the right under Nani: neutral, ears up, and the sneeze.

**People** (the existing faces and badges for Nana, Ma, Ali (the cousin) and Nani; Isa is a baby and isn't a customer here):
- Nani front-on and three-quarter at the counter, holding the tin, from her approved sheet.
- Nana knocking his egg on the plate (the serve), from the customers sheet.
- Ali with the folded egg, from the customers sheet.
- Each speaker has two poses (three-quarter, then front-on), from the sheets.

**Layout:**

| Size | Eggs (T) | Baking (E) |
|---|---|---|
| **Phones, 740x320 and 915x275** | The shared side panel on the left holds the cards. The hob takes about 55% of the play width, centred; the egg bowl sits at the bottom left of the play area; the plate tray is at the right, 2×2 like the chai tray, its face badges at least 44 px by the chai tray's badge rule. No background beyond the worktop edge; the room comes from the scenery. | The side panel on the left. The cup is at least 55% of the play height, centred, with the bowl beside it. The container strip runs along the bottom; at 275 px high it shows only the containers in play plus decoys, each at least 64 px tall. At 320 px and above Nani is on the right, waist up, about 45% of the height; at 275 px she becomes her face badge beside her bubble (as the chai station already does). Simba's sill is at the right edge under her, never under the side panel. The oven pans in, taking the middle. |
| **930x430, 1280x665** | As phones, with the hob bigger. | As phones, with Nani to the chest and more of the counter. |
| **1920x1080** | The hob is centred at about 50% of the height; nothing grows past the art's resolution. | The full counter with the oven visible at the right throughout. |

**At every size:**
- Nothing goes over a face.
- The cog is the only button.
- Bubbles go into free space.
- Two layouts, switched by height (CLAUDE.md).
- The phone layouts are checked on the lab page with the mock-up art before the game is built (Zafar, 27 Oct).

## 8. What it borrows

- **Foodo Kitchen** (preschool, no text; [Common Sense Media](https://www.commonsensemedia.org/app-reviews/foodo-kitchen)): you swipe an egg onto the table and tap-tap to crack it. We borrow the crack as one tap with a reward of its own.
- **Toca Kitchen 2** (research, read): food browns in the oven and the guests react. We borrow the reaction at the serve (Nana's "tok tok"), not the free-for-all.
- **My PlayHome** (research, read): frying eggs is a favourite doll action. That's the evidence the egg itself is fun.
- **Tiny Kitchen Lab** (its listing only, unreviewed: [App Store](https://apps.apple.com/tm/app/tiny-kitchen-lab/id6761960318)): crack eggs, pour milk, bake, for 3-5s. That's evidence the set is age-right, nothing more.
- **Strawberry Shortcake Bake Shop** (research, summary): measuring with spoons into a bowl. We borrow the measuring, without the ads, and with a word deciding the amount instead of a line.
- **Hay Day** (from memory): something made here turns up later. The cake goes to the party (Toca Town's carry-it-home, lessons §12).
- **Our own:** the chai tray's badges, the samosa fry's juggle, the maani line's turner, the farm's watering can (the same hold pour, by design).

## 9. The lessons checklist

1. **The heard word decides: passed** (after the critique's fixes).
   - The leak test is written for each of E1, B1 and B5, and the bot counts first-go rows only.
   - The deciding words are named and counted (§1: eggs 2 of 6, baking 6 of 9 plus "two cups", the oven's 2 of 2).
   - Ticks are first-go only, and every count and plate is judged at a commit the child makes (the tray, the knead), never by a row closing itself.
   - Each need can't be settled from the picture: identical eggs, identical plates, a cup with no line, no count on screen.
   - Who wants what rotates. From L2 each move needs two words (egg: which vessel and how many; baking: which container and how much). From L3 the eggs' owner is heard, not matched by face; at L2 the plate is support, and the bot doesn't count it.
   - The oven's time words decide from L1, and waiting is a miss for every "now" bake.
   - It teaches its own words, not just numbers: the amount words, the egg verbs and the time words are the move.
2. **Onboarding: passed.**
   - The first round is the tutorial (§4), and it follows §3's rules.
   - One live thing at a time in a lit box, with no finger. The hob's two vessels are the one deliberate exception (a choice needs two targets): one box round the hob, nothing else lit.
   - What isn't on the card is shown first.
   - Each new action is shown once (the hold, the tip, the tray, the crack, the knead, the oven), and the timed rings hold in their band the first time.
   - Every new screen (the hob, the counter, the oven) has its onboarding.
   - Tap, then tap. The hold is the one exception, and it's Zafar's to confirm (decision 1).
3. **Instructions: passed.** The asker is on screen and speaks first, and the card pops big then flies. The card never changes; the guide box says the step. Listening again is free. One line per moment, only the level's own words, and Nani is quiet during a pour and a cook. No voice says when to stop (no *bas* during a pour, no time word at the band).
4. **Pacing: passed, with one note.**
   - There's no Next and no Done. The cup's tap ("put it in"), the tray's tap (carried to the table) and the first tap on the dough (the knead) are actions with their own meaning, not Done buttons (decisions 4-6).
   - Hints come after 7, 9, 11 or 13 s, and nothing leaves before it's asked for.
   - The first kitchen day is eggs and baking only; lunch joins on visit 2.
   - Load: the hob and counter art is shared, so only the bakes and egg states load per station.
5. **Feedback: passed.**
   - A miss gets a small reaction and the word, and it's redone on the spot; an oven bake taken late is still eaten.
   - Misses are funny and varied: the rim wobble, the spinning egg, the slosh, Simba's ears, Nani's "oho", the toasty naan, Nani eating the spare egg.
   - The best joke (the puff and Simba's sneeze) comes with a right full or heaped cup of flour, never with a miss.
   - Rows tick when their commit is judged. Nothing on screen counts for the child.
   - It ends served ("tok tok", "aah", the naan torn), on the shared end screen.
6. **Layout: passed on paper** (§7). The four sizes and 915x275 are checked on the lab page with the mock-up art before the game. Cards are on the left, people right and centre, Simba at the right, the egg tray 2×2, the cup at least 55% of the play height, and nothing goes over a face.
7. **Art and camera: passed.**
   - One camera per scene: T for the hob, E for the counter and oven.
   - Nothing is drawn in code: the fills are masks over painted art.
   - Items are in the plaster style. Contact shadows only; nothing floats. No hands.
   - The zooms are gentle pans.
   - Two poses per speaker, from the approved sheets, and one paste block with one moment per prompt.
8. **Speaking: none in this scope.** The eggs' "boiled or fried?" turn waits for the chai pilot, as Zafar's speaking plan says, and comes back as a one-word answer (§5).
9. **Levels: passed.**
   - Every level is designed with its own new thing (§3). L4 is its own: soft and hard, halves, three bakes.
   - Up after 3 rounds with at most one hint each.
   - The bands and rings are in data. The rules are coded (the bot and `rules.json`).
   - Note: amounts are baking's core, so they start at L1 rather than the rulebook's L4. The rulebook's L4 "halves" is kept.
10. **Words: passed, with a recording cost.** Every line said is listed in §1, with its status (including "I'll have it!", "one for me", the bake-for-meal and two-owner frames, the bare numbers, "the pot" and "aah"). Frames come from recorded parts, and things are named as they are: raw egg, then boiled or fried egg; flour, then dough, then naan. Four doubtful words go on Mum's confirm list.
11. **Culture: passed.** Eggs, flour, naan and bread are halal. The cake is a celebration food for the party, never a prize. No religious markers, and modest clothes. Nothing a child could copy and get hurt by: Nani says "careful!" at the hot oven, and a child never touches the oven in the art. How the family serves a boiled egg is asked (open question 3).
12. **Fun: passed.**
    - The hands always have something to do (the bob toy while an egg cooks).
    - "Kind of funny": Simba's sneeze, Nani eating the spare egg, the "tok tok".
    - Good gestures: the crack, the pour, the squish.
    - Contrast: a little against heaped, a lot against a whole cup, soft against hard, now against a bit longer.
    - No fatigue: the two stations differ in their main action.
13. **Mistakes made twice: guarded.**
    - The meal word is a rule for every station, set in the days data, not in one game.
    - Every level is designed.
    - No question is left for the builder: every commit, miss and band is defined.
    - Nothing is removed. Knead comes back only as a beat and the count's commit, and it's flagged (decision 12). The two rules this reverses (H17 the tap-measure pour; H12 the hob's knobs, for eggs) are flagged as decisions 1 and 17.
    - No English reaches the child: "tok tok" and "ah-choo" are sounds, not text.

**Ten questions:**
1. Words decide: the egg verb and count, and from L3 the owner; the amount, the item and the number of cups; "now" or "a bit longer".
2. The Sceptic: guessing gives about 6% at L2 (eggs) and under 1% (baking's round); the oven alone is ½ a bake, reported separately.
3. The open need: eggs that are identical, a cup with no line, a bowl with no count.
4. The first round: §4.
5. The asker: each person in the order frame at L1-L2, Nani relaying from L3; Nani for baking.
6. The hands always have something to do.
7. The funny moments: the sneeze, the spare egg, the "tok tok".
8. It ends served.
9. L4 is its own (soft and hard, halves, three bakes).
10. The sizes are in §7.

## 10. Decisions made for Zafar overnight

Each line gives the choice, the reason and the answer I assumed. Decision 1 reverses one of his tested rules, so it's first.

1. **The pour is press-and-hold, and letting go stops it.** *This reverses his rule for baking only:* `cook.md` H17 ("pour is a tap-measure") and `ux-principles.md` §12 ("Cook's press-and-hold pour didn't land in testing"). If yes, both docs get a line: "baking's lineless cup is the exception". *Reason:* his newer rule, "no fill line; the amount word says when to stop", needs a stop the child decides, and a tap-measure pours to a line. *Fallback if no:* the cup fills by short taps and the amount is judged on how many, which turns amounts back into counting. *Assumed:* yes, the hold, tried on the lab page first.
2. **Two stations, one design.** Eggs and baking are two Cook stations in the kitchen day, plus the meal-word rule for all stations. *Reason:* the map's row 9 pairs them, and both use Cook's kit. *Assumed:* yes.
3. **Eggs at breakfast, baking in the afternoon, ending at dinner. The first kitchen day has no lunch station;** lunch (chips mayai) joins on visit 2. *Reason:* Part 7 and the meal words; H50 (one recipe across a few stations), and a 3-year-old's sitting. *Assumed:* yes.
4. **Tapping the cup tips it into the bowl and is the only moment an amount is judged.** Top-ups before it are free, and nothing is said on letting go. *Reason:* a kind undo before the step moves on (NN7), and it gives a verb ("put it in"). *Assumed:* yes.
5. **The number of cups is judged at the knead** (the child's first tap on the bowl), never as a cup lands; nothing counts on screen; a counted row is always last before the knead; Nani doesn't call the next step after a counted row. *Reason:* counts must never end by themselves (the critique's first finding; Cook's samosa keeps its count commit). *Assumed:* yes.
6. **The eggs' plates are judged when the child taps the tray** (carried to the table), never as an egg lands; eggs can move between plates until then. *Reason:* the same rule for counts; a plate that refuses an egg tells the count. *Assumed:* yes.
7. **The owner decides the plate only from L3,** where Nani relays every order on her one card with no faces. At L2 each person's card part has their face, and the plate is support. *Reason:* faces on the card and on the tray let a child match without the name. *Assumed:* yes.
8. **The measure is a plain clear cup** (*cup* ✓), not the bowl. *Reason:* the cup makes "half" and "a whole cup" visible, and those words are recorded with "cup" (*aako cup*, *adh cup*, *bharelo cup*, *ba cup*). *Assumed:* yes.
9. **Amounts are baking's core from L1** (a little or a whole cup). Halves stay at L4 as the rulebook says. *Reason:* the station is about how much. *Assumed:* yes.
10. **Nani says *bas* (enough) only after a right tip,** never during a pour, and never gives a time word at the oven's band. *Reason:* a voice that says when to stop is a waiting leak. *Assumed:* yes.
11. **Too little gets "more"; too much gets a small rotating reaction** (a slosh, Simba's ears, Nani's "oho"), and the extra goes back. Nothing is ruined, and the bake always comes out. *Reason:* consequences, not verdicts (research §14), and NN7. *Assumed:* yes.
12. **Knead comes back as a 6-tap beat,** not a stage, and its first tap is the count's commit. *Reason:* the map's row names "pour, add, knead", the hands need a squish between listening, and the count needs a commit. It was cut from the stations before. *Assumed:* yes.
13. **No speaking in this scope.** The eggs' "boiled or fried?" turn waits for the chai pilot and comes back as a one-word answer ("boiled", "fried", "no, thank you"). *Reason:* his speaking plan (29 Sept, 14 Oct) builds nothing else before the pilot, and the lines aren't recorded. *Assumed:* yes.
14. **Simba sneezes when a right full or heaped cup of flour lands** (the joke, every visit), not on a miss. *Reason:* a recurring joke the child waits for, which should come with the right word, not pull them off it. *Assumed:* yes.
15. **The oven's time words decide from L1,** drawn at random per bake, with both misses defined: a "now" bake taken late comes out toasty and is still eaten (tick lost, word said once); a "bit longer" bake taken early goes back in. The light-golden band passes, so waiting is a miss. *Reason:* both lines are ✓ with no deciding home, and an oven where waiting wins teaches nothing. *Assumed:* yes.
16. **In free play each station keeps its own meal** (eggs breakfast, baking dinner); story mode follows the day, as he said. No device clock. *Reason:* his word was "in story mode"; a clock would have eggs fried at lunch. *Assumed:* yes.
17. **Burners light themselves** when an egg goes in; no knobs at the eggs station. *This bends H12's shared-kit knobs for one station.* *Reason:* the hob's knob game is the chai tray's, and eggs should stay brisk. *Assumed:* yes; easy to add knobs back.
18. **Nothing burns or blackens.** An egg gets crispy edges at most, and a bake stops at deep golden. *Reason:* NN7. Cook's other stations keep their own rules. *Assumed:* yes.
19. **An extra fried egg goes to Nani** ("I'll have it!", to record); it costs only that row's first-go tick. *Reason:* counts never end by themselves, and a miss gets a funny reaction. *Assumed:* yes.
20. **Soft and hard are eggs' L4,** the describing pair. *Reason:* describing words are the biggest short group, and the timing makes them decide. *Assumed:* yes.
21. **The fourth person is Nani herself** ("and one for me"), never Isa. *Reason:* Isa is a baby with no Cook design (`cast.md`), and it pays off her "I'll have it!". *Assumed:* yes.
22. **"A lot" is 55-85% of the cup,** so a full cup is too much for it, and it sometimes shares a round with "a whole cup". *Reason:* otherwise holding till it stops wins both, and contrast teaches. *Assumed:* yes.
23. **The chilli is sometimes "with" and the sugar sometimes asked for** (from L3), so neither "no" row ticks for doing nothing. *Reason:* fewer asked than shown, the rest real choices (research). *Assumed:* yes.
24. **The cake is plain, with no icing or decorating here.** Candles belong to the party. *Reason:* decorating swamps measuring (research), and it keeps the cake a celebration food. *Assumed:* yes.
25. **The cake's eggs use crack,** counted at the knead like the cups. *Reason:* a verb learned at breakfast comes back in the afternoon. *Assumed:* yes.
26. **Chips mayai is visit 2's lunch.** *Reason:* the worked example is already written; it's a family dish. *Assumed:* yes.
27. **It counts as teaching only once the deciding words are recorded.** Until then the lab plays with grey placeholders. *Reason:* map rule 3 (R6). *Assumed:* yes.
28. **The farm's brown egg in the bowl, with no comment.** *Reason:* a quiet carry; Nani saying it would be a line with no job. *Assumed:* yes.
29. **A boiled egg is served peeled on the plate,** "tok tok" on the rim, halved to show soft or hard. *Reason:* Zafar's row says "a boiled egg for Nana", not an egg cup, and an egg cup is a British habit; open question 3 asks. *Assumed:* peeled.
30. **This run's backgrounds are three:** the morning hob, the morning island, the golden-evening counter. The night island waits for the book. *Reason:* every light state is a real background (art bible). *Assumed:* yes.

**Open questions (genuinely his, or Mum's):**
1. **"Indo" or "mayai" for a child?** (The lexicon's own question; Mum decides.) The eggs station says "egg" every round, so it needs one answer before the recording.
2. **"Tapelo" or "sufuria" for the pot?** (Also the lexicon's own question; Mum decides.) "The pot" is named at the first round.
3. **How does the family serve a boiled egg: in an egg cup, or peeled on the plate?** I assumed peeled (decision 29); the reveal and the art follow his answer.
4. **Mum's recording list for these two stations** (for her next round; `/mum-round`):
   - a boiled egg, a fried egg, crack, frying pan, soft, hard;
   - a lot, a bit more, two and a half, one and a half;
   - oven, naan, bread, cake;
   - breakfast, lunch, dinner, morning;
   - "I'll have it!", "one for me", "{bake} for {meal}" ("naan for dinner"), the two-owner frame ("Nani's and Ali's: now");
   - a bare clip of one, two and three, for a correction ("two!"). *Hakro cup* and *hakro cup, ba cup* are already in the manifest, so the cups aren't asked again.

   That's 25 items. Plus a **confirm list** for words the lexicon flags: *thorok* (a little), *wadhare* (more), *gund* (knead), *tar* (fry). Shall I add them to her sheet? ("Boiled or fried?", "boiled" and "fried" wait for the speaking turn.)

## 11. ChatGPT mock-up prompts

Rules kept in every prompt (after the critique): people are "exactly as on the attached sheets", with only their pose and expression described; Simba is the big black cat with green eyes; "no hands or arms" on any prop; one moment per prompt; no text anywhere.

### Prompt cook-baking-eggs-1: the eggs station, the crack
It shows the core of the eggs station at the moment of the crack: identical eggs, two vessels, and plain plates on a 2×2 tray with face badges, so Zafar can see that only the heard word decides the pot or the pan.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of a breakfast eggs station in a grandmother's modern kitchen. One moment only: an egg cracking into the frying pan.

Camera: exactly top-down, straight down at 90 degrees onto a warm white marble worktop that fills the frame edge to edge. No back wall, no splashback, no horizon. Rims read as circles, not ovals.

The scene: in the centre, a compact brushed-steel hob with two round burners. On the left burner, a steel pot of gently boiling water with one whole cream-white egg bobbing in the bubbles. On the right burner, a black frying pan. A cream-white egg is knocking on the pan's rim by itself: the shell has split in two, and the white and a bright round yolk are sliding out into the pan, a few small sizzle bubbles round the edge. Both burners have a soft glowing ring of flame.

No hands or arms anywhere: the egg moves by itself.

Bottom left of the worktop: a simple ceramic bowl holding four eggs, three cream-white and one brown.

On the right: a plain wooden tray holding four plain, empty white plates in a two-by-two grid, all alike. On the tray's rim beside each plate, a small round face badge: Nana, Ma, Ali and the grandmother, exactly as on the attached customers sheet and Nani sheet, with the same faces, hair, cap, glasses and clothes. Friendly, calm expressions.

Light: late-morning sun from the upper left, long soft window-shaped light patches across the marble, soft contact shadows down and to the right. Nothing floats.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes with clean surfaces, believable materials (brushed steel, glazed ceramic, eggshell), no outlines, no cel shading, no photorealism.

Absolutely no text, letters or numbers anywhere: not on the hob, the knobs, the bowl or the tray.

It must read at phone size: the egg in the pot, the crack and yolk in the pan, and the four face badges must all be clear at 740x320 pixels.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
```

### Prompt cook-baking-eggs-2: baking, the pour with no line
It shows baking's core at one moment, the pour: a clear cup with no marks, filling, the bowl still empty, Nani and Simba watching, so Zafar can see how "how much" works without a fill line.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of a baking station in a grandmother's modern kitchen with gentle Kutch accents. One moment only: flour pouring into a measuring cup.

Camera: eye level, straight on to the worktop, one-point perspective, the counter edge horizontal at about 60% of the frame height, verticals vertical. Items seen from the front, the camera at their mid-height looking slightly down so a rim is just visible.

The scene: a warm white marble worktop in front of a sage-green splashback. In the centre, large, stands a plain clear glass measuring cup with a handle, with absolutely no lines or marks on it. A clear glass jar of white flour hangs tilted by itself over the cup, pouring a soft stream of flour, and the cup is about half full. To the right, a big brushed-steel mixing bowl seen from the front, still empty. Along the bottom of the frame, standing on the worktop edge in a neat row with even spacing: a clear water bottle, a milk carton, a clear oil bottle, a small brass ghee tin, a clear sugar jar. All containers are plain, with no labels and no text.

No hands or arms anywhere: the flour jar hangs tilted by itself over the cup.

On the right, cut at the waist behind the counter, the grandmother exactly as on the attached Nani sheet, with the same face, hair, clothes, dupatta and jewellery, three-quarter on, watching the cup with a happy, attentive look. At the right edge, just below her, the head and ears of Simba peek over the counter edge from the window sill: a big adult cat with a sleek black coat and bright green eyes, ears up, watching the flour with great interest. Nothing at the far left of the frame: keep it plain worktop.

Light: late-afternoon golden light from the upper left, soft and warm; soft contact shadows under every item. Nothing floats.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, believable materials (glass, brushed steel, brass, matte flour), no outlines, no photorealism.

Absolutely no text, letters, numbers or measuring marks anywhere: not on the cup, the jars, the bottles or the carton.

It must read at phone size: the empty-versus-filled part of the clear cup, the pouring flour, the grandmother's face and Simba's face must all be clear at 740x320 pixels.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
```

### Prompt cook-baking-eggs-3: the oven, out at its word
It shows the oven stage at L3 at one moment: the "now" naan sliding out light golden while the "a bit longer" naan stays in, so Zafar can see how the two time words decide which comes out.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the oven step of a baking game in a grandmother's modern kitchen at golden evening. One moment only: one naan sliding out of the oven.

Camera: eye level, straight on, one-point perspective, verticals vertical, the same camera as a front-on kitchen counter.

The scene: a built-in oven fills the centre of the frame, set into sage-green cabinets, with a large glass door, warm light glowing inside. The door is open. On a steel baking tray sliding out by itself, a soft, puffy naan, pale light golden with big bubbles, a little puff of steam rising from it. Still inside, at the back of the oven, a second naan the same size, a little deeper golden, rising and bubbling. On the tray's front edge, in front of each naan, a small round face badge, exactly as on the attached customers sheet: Ali in front of the pale one, Nana in front of the deeper one, with the same faces, hair, cap, glasses and clothes. To the left of the oven, on the marble worktop, an empty wire cooling rack waits.

No hands or arms on the tray or the oven: the tray slides by itself.

On the right, cut at the waist, the grandmother exactly as on the attached Nani sheet, three-quarter on, smiling and watching the naan come out, leaning slightly back from the warm oven.

Light: golden evening, low warm sun from the upper left through a window out of frame, longer soft shadows to the lower right, a warm glow from inside the oven.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, believable materials (glass, brushed steel, bread crust), no outlines, no photorealism.

Absolutely no text, letters or numbers anywhere: no dials with numbers, no labels on the oven.

It must read at phone size: the two naans' different colours, the face badges and the grandmother's face must be clear at 740x320 pixels.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
```

### Prompt cook-baking-eggs-4: breakfast served, the meal named by the light
It shows the serve at breakfast in morning light at one moment: Nana's boiled egg shelled and halved, Ali's fried egg in his maani. It's the reward for the eggs station, and it shows how the time of day sets the meal. (If Zafar says egg cups, open question 3, the egg changes and the rest stays.)

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of breakfast being served at the kitchen island of a grandmother's modern home with gentle Kutch accents. One moment only: the first bite of breakfast.

Camera: eye level, the island's top edge nearly horizontal at about 65% of the frame height; people sit behind it, cut at the waist, their heads against a plain limewash wall.

The scene: bright early-morning sun streams in from a window on the upper left, long soft light patches on the wall. Behind the island, on the left, Nana, exactly as on the attached customers sheet, with the same face, beard, cap, glasses and clothes. On his plain white plate, a peeled boiled egg cut in half, showing a soft golden yolk, with the cracked shell beside it; he is delighted, eyebrows up. Beside him a glass of milky chai. On the right, Ali, exactly as on the attached customers sheet, with the same face, hair and clothes, grins as he folds a fried egg into a round flatbread on his white plate. The plates sit on the marble island top. In front, on the island, a small woven basket holds two more eggs, one of them brown. On the window sill in the background, Simba watches: a big adult cat with a sleek black coat and bright green eyes.

Light: early-morning sun, warm and bright, from the upper left; soft contact shadows. Nothing floats.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, big expressive eyes, rosy cheeks, believable materials, no outlines, no photorealism. Modest clothing.

Absolutely no text, letters or numbers anywhere: not on the wall, the cups or the plates.

It must read at phone size: the halved egg and its yolk, both faces and their happy expressions must be clear at 740x320 pixels.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
```

### Prompt cook-baking-eggs-5 (small, optional): the joke
The sneeze, in its own moment, now that it comes with a right full cup of flour. Run it only if Zafar wants to see the joke before the build; otherwise it waits for the art run.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): the same baking screen as the attached first mock-up, same camera, same light, same grandmother and cat. One moment only: a full measuring cup of flour has just tipped into the steel mixing bowl.

The clear glass measuring cup, empty now, hangs tilted by itself over the bowl. A big soft puff of flour rises from the bowl. At the right edge, below the grandmother, Simba (the big black cat with bright green eyes) has flour on his nose, eyes squeezed shut, mid-sneeze, ears back. The grandmother, exactly as on the attached Nani sheet, laughs. Funny, not alarming.

No hands or arms anywhere. Absolutely no text, letters, numbers or measuring marks anywhere.

It must read at phone size: the puff, Simba's sneeze and the grandmother's laugh must be clear at 740x320 pixels.

References to attach:
(the approved result of prompt 2)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
```

## 12. Changes after the critique

The critique (`cook-baking-eggs-critique.md`, 1 Nov) had 19 findings: 6 MUST, 13 SHOULD. All six MUSTs are applied, and all thirteen SHOULDs too; none clashed with Zafar's recorded word, and where one touched it (the free-play clock, the hold pour, the knobs) his word is kept or put to him.

**MUST**
1. **Counted cups closed by themselves.** The number of cups (and the cake's eggs) is now judged at the knead: the child's first tap on the bowl is the commit. Nothing counts on screen (the number on the bowl is gone), Nani doesn't count along (except as support for "two and a half" at L4) and doesn't call the next step after a counted row, which is always last before the knead. Too few reopens the row; too many lifts the last cup back out. "Two and a half" no longer closes at its total, and the "half first is a miss" rule is gone (the total is judged, in any order). The leak bot counts first-go rows only (§3 B1, §6 item 9). The same flaw was in the eggs' "when every plate has what was asked, the step closes", so the eggs now commit at the tray's tap, and a plate never refuses an egg as it lands (§3 E1 step 5, decision 6).
2. **The owner never decided the plate.** At L2 the plate is now called support (faces on the card and tray), and the bot is recounted at about 6%. From L3 Nani relays every order on her one card with no face per row, shuffled separately from the tray, so the badge is found only by the heard name. Q2 and Q5 now say this; "for" moved to L3 in the word counts (§3 E1, decision 7). The oven's L3 uses the same card.
3. **The oven's "now" was never judged.** Both misses are defined, kindly: a "now" bake taken late comes out toasty and is still eaten (its owner's "oho", the tick lost, the word said once); a "bit longer" bake taken early goes back in. The ring passes the light-golden band and fills on, so waiting is a miss for every "now" bake. Nani gives each bake its word as the door shuts, never at the band. The oven's bot is reported on its own (§3 B5, decision 15).
4. **The prompts drew a different family and cat, and invited a hand.** Every prompt now says "exactly as on the attached sheets" (customers sheet, Nani sheet), with only pose and expression described; Simba is the big black cat with green eyes; every prompt says "no hands or arms" on the props; each prompt is one moment. Prompt 2 is now only the pour (the bowl empty, Simba watching from the right), and the sneeze has its own small optional prompt 5. Prompt 1's egg cups became plain plates on a 2×2 tray; prompt 4's egg is peeled (open question 3).
5. **The speaking turn ran ahead of the chai pilot.** E4 is cut from this scope and listed in §5 after the pilot, as a one-word answer to "boiled or fried?" ("boiled", "fried", "no, thank you"). Removed from §0, §1 (frames said, word table, per-level counts), the library's keep, E1's L3, §6's reuse, §9 item 8, and decisions 12-13 (now decision 13). "Boiled or fried?" left Mum's list for now.
6. **The walkthrough contradicted §3.** Rewritten (§4): nothing is said on letting go of a pour, and "more" comes only after the cup's tap; Nani says "now, the egg" (no L3 owner word at L1); the hob is named as the one deliberate exception to "one live thing" (one box round the hob, both vessels live inside it); "It's ready. Take it out now." became the one line "take it out now", and "careful!" is its own moment at the oven; the tray tap and the bowl tap are shown once.

**SHOULD**
7. **"A lot" was swallowed by "a whole cup".** "A lot" is now 55-85% at L3 and 60-85% at L4, so a full cup is too much for it, and the two now share an L3 round now and then (decision 22).
8. **The hold pour reverses a tested rule.** Moved to the top of §10 as decision 1, naming H17 and UX §12 (baking only) and the fallback (taps, which turn amounts into counting); the hold is the recommendation, tried on the lab page first. Left as an assumed decision rather than a blocking question, since Zafar asked for decisions overnight.
9. **The oven decided nothing at L1-L2.** The time word now decides from L1 (drawn at random, the row's light or deep golden picture as support until right 3 times); L2 gives each of two bakes its own word.
10. **The meal word.** Free play keeps each station's own meal; story mode follows the day, as Zafar said (decision 16; no device clock). The meal words are counted as up to three a day. This run's backgrounds are trimmed to the morning hob, the morning island and the golden-evening counter; the night island waits for the book (decision 30), and baking's serve uses Cook's review faces over the cooling rack until then.
11. **Isa is a baby.** The fourth person is Nani herself ("and one for me"); the small naan is for Ma (decision 21).
12. **Lines said but missing from the table.** Added "I'll have it!", "one for me", the bake-for-meal frame, the two-owner frame, "with chilli", "the pot" as a naming line, "aah" (a sound), and the bare number as a correction, each with its status; the to-record ones are on Mum's list. "OK" went with E4.
13. **Doubtful words called ✓.** *thorok*, *wadhare*, *gund* and *tar* are marked with their doubt and put on Mum's confirm list; "tapelo or sufuria?" is open question 2.
14. **Reuse.** The manifest's *hakro cup* and *hakro cup, ba cup* clips are named and not asked for again; "two cups" now counts as recorded. Eggs use `fry.js` for both vessels, not `boil.js` (a knob game); the dropped knobs are flagged as bending H12 (decision 17). The chaat v2 and pantry front-on views are tested before a new `counter` view is added.
15. **The phone layout.** The cup is at least 55% of the play height; at 275 px Nani becomes her face badge beside her bubble; Simba's sill moved to the right edge under her (out of the side panel); the egg tray is 2×2 with the chai tray's badge rule; the phone layouts are checked on the lab page before the game (Zafar, 27 Oct). 915x275 stays alongside his four sizes, as the fix list already checks it.
16. **The best joke rewarded the miss.** The puff and Simba's sneeze now fire when a right whole or heaped cup of flour lands; "too much" gets the smaller rotating reactions (decision 14).
17. **"No" rows were always no.** Ali sometimes asks "with chilli" (the chaat's `WithFood` frame, *mirchi* ✓), and from L3 some bakes ask for "a little sugar" (decision 23).
18. **The first kitchen day was long.** It's now the door, eggs, baking and the book; lunch (chips mayai) joins on visit 2 (§2, decision 3).
19. **Egg cups.** Open question 3 asks; I assumed peeled on the plate, "tok tok" on the rim, halved to show soft or hard (decision 29), and changed the scene, the art list and prompts 1 and 4 to match.
