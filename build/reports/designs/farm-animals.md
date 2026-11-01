# The farm animals: feed them, photograph them, call them home (design, 1 Nov 2026; revised after the critique the same night)

Written overnight while Zafar slept, on his instruction to design every game alone and record each choice (§10). Design only: no code, no data, no other doc changed. It refines `docs/game-design/days/farm.md` and Part C of `docs/game-design/days/TEMPLATE.md`. Where it differs from them, §10 says so and gives the likely answer assumed. An independent critique (`farm-animals-critique.md`, 7 MUST, 12 SHOULD) was applied the same night; §12 lists each finding and what changed.

Kutchi here is only what is in the repo (`build/reports/research-word-inventory-2026-10-31.csv`), plus *gai* (cow), which Zafar gave in `farm.md`. **✓** means a family clip of the word on its own. "Inside lines" means Mum says it only inside longer recorded lines. "In engine" means the engine has the word but nobody has recorded it. "To record" means the repo has no Kutchi for it yet. No Kutchi is written here that the repo doesn't have: the frames in §1 are given in English, with the forms Mum must supply.

---

## 0. One line

**What:** three stages of the farm day. Feed the animals, take their photos doing what Nani says, and send them home at dusk by calling them. **Day:** the farm, hosted by Hannah Mami, the first trip. **Status:** designed (refined from the agreed `farm.md` rows 5, 7 and 9); revised after the critique. **Engines:**
- put it in its place plus count (both designed);
- the shared Snap kit (a rebuild of the parked greybox, Zafar: yes);
- the shared speaking moment (`say.js` and `speech.js`, built);
- one small new piece, the **animal actor**: an animal that walks to a place and does an action.

**Size:** medium. The art is most of the work, in two blocks (§7). The code is about one builder sprint once Hannah Mami's art and Mum's first sitting (§9, "Mum first") exist. **Nothing here teaches, and the speaking moment can't even be tested, until Mum records the three animal names and her call to each** (§1, §3 C2).

---

## 1. The language goal

**Word groups:** farm animals (main), food and feed (supporting), numbers 1-5, sizes (big and small), and verbs.

### The words it teaches

| English | Kutchi in the repo | Status | Where it decides a move |
|---|---|---|---|
| goat (she-goat) | *bakri* | inside lines (9); a "hakri bakri, ba bakri" take exists but isn't linked to the engine | feed, photo, home |
| hen | *murgi* | in engine, to record. **The inventory has it under food ("chicken", Mum, cooking); Mum must say whether it is the word for the live hen** | feed, photo, home |
| cow | *gai* (Zafar, `farm.md`) | to record (not in the engine) | feed, home |
| chick | none | to record | home (the joke), photo, second visit |
| corn on the cob | *makai* | **✓** | feed (the counted thing) |
| water | *paani* | inside lines (3) | feed L3 |
| grass | none | to record | feed L3 |
| one, two, three, four, five | *hakro/hakri, ba, trae, char, panj* | inside lines or in engine; **none has its own clip** | feed L2+, home L2+, photo L3 |
| big | *wadho* | inside lines (30) | L4 everywhere |
| small | *nindho* | **✓** | L4 everywhere |
| shed, coop | none | to record | home (heard in every ask, Zafar's "the place named"; never decides) |
| photo | none | to record | photo (heard in every ask) |

### Its verbs (Zafar's scope)

The verbs the photo shoot hears are **present forms** ("the goat eats", "the hens drink") and a "photo of X doing Y" form, not the imperative. The repo's one recorded verb, *kha* ✓, is the imperative ("eat!"): it is the **speaking** word for the third visit's "You be Nani" (the child tells the goat "eat!"), not a deciding word in the photo shoot.

| Verb | Kutchi in the repo | What the frames need | Status of that form |
|---|---|---|---|
| eat | *kha* ✓ (imperative); present, she: *khaiti*; present, they: *kenta* | present, she-thing; present, plural; the "doing" form after "a photo of" | she and they heard **inside lines only**; the "doing" form unknown |
| drink | none | the same three | to record (not in the engine) |
| sleep | none | the same three | to record (not in the engine) |
| run | *bhaj* (imperative, in engine) | the same three | to record |
| want (be wanted) | *khape*; present, she-thing: *khapeti* | present, she-thing, with an animal as the one who wants | inside lines only, and only ever with a person |
| give | *de* (imperative) | imperative, with "to {animal}" | *de* inside lines (18); the animal with its "to" ending: to record |
| take (a photo) | *khan* (imperative, in engine) | imperative, in "take a photo of …" | to record |
| come (here) | *hida ach* "come here (to a child)" | Nani's call to an animal | in engine, not recorded; whether Mum says it to a goat is her call |
| go (in) | only *winni* (the "having done" form, inside lines) | present, she-thing and plural: "the goat goes in", "the hens go in" | to record |

### The frames: what each heard sentence needs (non-negotiable 2: the engine can't say any of these today)

Each frame is recorded by Mum as a whole, natural sentence, once with each animal (so the animal slot is cut from her own takes); the engine then swaps only the slot words she has recorded alone. **Takes** counts what she records.

| # | Heard (English) | Stage, level | The forms it needs | What the repo has | Mum records | Takes |
|---|---|---|---|---|---|---|
| F1 | "The hen wants corn." | feed L1 | animal; "wants", present she-thing, with an animal subject; corn | *khapeti* inside lines (people only); *makai* ✓ | the frame with each animal | 3 |
| F2 | "Give the goat two corn." / "Two corn for the cow." | feed L2 | *de* with "to {animal}"; the number alone; the "{x} *lai*" frame (recorded) | *de* inside lines; "{x} *lai*" ✓; numbers inside lines | the give frame with each animal; one, two, three alone | 3 + 3 |
| F3 | "The cow wants water." "Give the hen grass." | feed L3 | F1 and F2 with water and grass | *paani* inside lines; grass none | water alone, grass alone | 2 |
| F4 | "Three corn for the small goat." | feed L4 | small ✓, big alone, four, five alone | *nindho* ✓; *wadho* inside lines | big, four, five alone | 3 |
| P1 | "Take a photo of the goat eating." | photo L1 (eat, run), L2 (+ drink, sleep) | *khan*; photo; the "doing" form of each verb | none recorded | the frame with each verb (the animal swapped) | 2 + 2 |
| P2 | Nani at the hand-in: "Oh, the goat is eating!" | photo L1+ | present, she-thing, per verb | *khaiti* inside lines; the rest none | the line per verb | 2 + 2 |
| P3 | "Two hens eating." "Now the goat sleeps." | photo L3 | present plural per verb; another phrasing | *kenta* inside lines | the plural line per verb | 4 |
| H1 | "Now the goat goes into the shed." | home L1 | go, present she-thing; into; shed, coop | none | the frame with each home; shed, coop alone | 2 + 2 |
| H2 | "Two hens go into the coop now." | home L2 | go, present plural | none | the plural frame | 1 |
| H3 | "Goat, come here!" (Nani's call; the child's line) | home L1 | Nani's call to each animal | *hida ach* in engine | the call per animal | 3 |
| H4 | "Good night!" | home end | | none (the book's English line only) | the line | 1 |
| N | the names alone | everywhere | hen, goat, cow | none alone | each alone | 3 |
| W | word cards | | photo, chick alone | none | each alone | 2 |

**Totals for the three stages:** about **44 takes** (not the "about 22 words" first written), of which about **30 serve L1-L2**. About 12 words come back (corn ✓, small ✓, *hane* ✓, *ne poi* ✓, *kitla* ✓, *shabash* ✓, *ha* ✓, *na* ✓, *hida* ✓ and the inside-line words). **The farm day as a whole** (`farm.md` adds hat, water bottle, farm, feed, chick, four dressings, speed up, slow down and Hannah Mami's lines) is about 55-60 takes, over twice the template's 15-25 for a first visit. §9 "Mum first" splits it into sittings by level; §10 decision 19 puts the day's length to Zafar.

Glue that comes back: *hane* "now" ✓, *ne poi* "and then" ✓, *kitla* "how many?" ✓, *shabash* "well done" ✓, *ha* ✓ and *na* ✓, *hida* "here" ✓.

### Frames said

"{animal}, come here!" in the evening (H3). **The recogniser's set is always the three names** (hen, goat, cow), which sound different from the first syllable, and the pills show all three at every rung (research-mechanics finding 3: 2-3 options). Nani's own recorded call is the model (speaking.md: no extra recordings for speaking). **The recogniser matches against the family's own takes** (`js/shared/speech.js`), so C2 can't run, or be tested, until N and H3 are recorded; it is never device-spoken (an English model would have the child speaking English, non-negotiable 3).

### New words per level

At most 3-5 new words a round, each heard at least three times (lessons §10).

| Level | Feed | Photo | Home |
|---|---|---|---|
| L1 | hen, goat, cow (corn ✓ comes back) | eat, run, photo (goat again) | come here, go in, shed, coop |
| L2 | one, two, three | drink, sleep; the hen as a second actor | the numbers again |
| L3 | water, grass | how many; other ways of saying it | other ways |
| L4 | big (small ✓ comes back); four, five | big and small again | big and small again |

**Speaking turns:** one a round at L1 and two from L2.

---

## 2. Where it sits in its day

The day's list stays as Zafar agreed it in `farm.md`. These three stages are rows 5, 7 and 9:

```
Door → Bag → Ride → Meet Hannah Mami → [5 FEED] → Eggs → [7 PHOTO SHOOT] → Corn stall → [9 HOME AT DUSK] → Home (egg for Ali) → Book
```

**What carries in, and out:**
- **From the ride:** the farm road already names "the hen with her chicks", the cow, the goat and others (English only today). The same animals wait in the yard, so the child meets them twice.
- **From meet Hannah Mami into feed:** Nani calls the animals to their troughs for Hannah Mami, who waves each one over: "Hen, come here! Goat, come here! Cow, come here!" Each one trots up. This is the first **watch** of the call the child will make at dusk (Nani's voice from Nani's bubble; Hannah Mami is silent until her own lines exist, §10 decision 13).
- **Feed → eggs:** the fed hens settle on their nests, and that is where the egg stage opens. The mother hen and her chicks are the same animals.
- **Feed → photo:** the fed goat is lively and ready to show off for Nani's camera.
- **Photo → book:** every photo that fits its ask, and the round's one bonus photo, goes into the evening book's farm page. The book's existing "we saw the {thing}" lines get real pictures.
- **Corn stall → home:** the corn stall's leftover husks go into the goat's trough before bed. It's a picture beat, with no ask.
- **Home → home (Ali):** the animals are in bed, then the egg for Ali.
- **Out of the day:** the evening book shows the photos. The safari later reuses the Snap kit and the animal actor; the adoption centre reuses the feed troughs and the animal actor.

**Rhythm:** put it in its place (5), count (6), Snap (7), Cook (8), put it in its place plus speaking (9). The same engine never comes twice in a row. The busy corn stall is followed by the calm walk home.

**Length:** about 1-1.5 minutes per stage at L1. Zafar's rule of 21 Oct stands: home at dusk stays for now and moves to a second farm day if the day is too long. The recording count makes it long on paper (§1); §10 decision 19 asks.

---

## 3. The stages and mini-games

Four mini-games are kept, and four are parked in a pool. Scores are 1-5 for: **Do** (clear and satisfying in the hands), **Ch** (the Kutchi decides it, and it grows), **Fun** (delight), **Ins** (the card and the line are real family Kutchi today), **Nov** (nothing else in the game does it).

| # | Mini-game | Stage | Do | Ch | Fun | Ins | Nov | Total | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| A1 | **Feeding time** | 5 | 4 | 5 | 4 | 2 | 3 | 18 | keep |
| B1 | **The photo shoot: make it do it, then snap** | 7 | 5 | 5 | 5 | 1 | 5 | 21 | keep |
| C1 | **In you go** (listening) | 9 | 3 | 4 | 3 | 1 | 2 | 13 | keep: Zafar's agreed row 9, a listening ask at every level including L1; short |
| C2 | **Call it over** (speaking) | 9 | 4 | 4 | 5 | 1 | 5 | 19 | keep; gated on Mum's names and calls |
| P1 | Count them in ("how many in the shed?", *kitla* ✓) | 9 | 3 | 4 | 3 | 4 | 3 | 17 | maybe later: second visit |
| P2 | Who's there shots (still photos by count or size, the old Snap's "Just so many") | 7 | 4 | 4 | 3 | 3 | 2 | 16 | merged into B1's L3-L4 rows |
| P3 | The stubborn goat (won't go in until it hears its name) | 9 | 3 | 3 | 5 | 2 | 3 | 16 | maybe later; risks reading as a verdict |
| P4 | You be Nani: tell the goat what to do (speaking verbs; *kha* ✓ is the first) | 7 | 4 | 5 | 5 | 2 | 4 | 20 | **third visit**: needs the other imperatives recorded first |

The Ins scores dropped after the critique: the frames in §1 have no recorded forms yet.

Cut: milking (no words; Zafar already cut it), watering with a can (Cook's pour, nothing new to say), dragging a lead rope (a drag across the screen).

### Who speaks, and where the lines go (all three stages)

- **Nani says every line,** from a bubble at her own face (guide-and-card R3). Hannah Mami is on screen and **silent until her own lines are recorded:** she gestures (points at the lit box, waves an animal over, leads one in). No voice ever comes from a face that isn't its speaker.
- **The guide box** at the top of the side panel says only the next step, without a face, since Nani is also the asker (R4).
- **The card's face is the customer:** the animal being fed, photographed or called. The pop-then-row card reads as "the hen wants", "the goat eating", "the goat comes".
- **Word pills** follow the shared word ladder (SH-159, Zafar 29 Oct, `data/rules.json`): each animal, each food and each photo place carries its Kutchi in a pill with a speaker until that word has been picked right three times in a row, then the speaker only. The leak tables below mean "no text past support"; the leak bots play a learned save with the pills earned.

---

### Stage 5. A1 Feeding time

**Why (the one "why" beat):** breakfast at the farm. Hannah Mami's animals are hungry, and she needs a helper.

**The five questions:**
1. **What do you do?** Tap the basket of corn cobs: one cob lifts out and glows. Then tap an animal's trough: the cob drops in. That's the same tap-then-tap at every level. From L3, the water bucket and the grass bundle sit beside the basket, used with the same gesture. **To take a cob back, tap the cob in the trough:** it hops back to the basket, until the step moves on (easy-to-play principle 4's "tap a placed item to take it back").
2. **Where is the challenge?** Every animal has an empty trough and looks equally hungry, so the picture can't settle it. The heard sentence names who (L1), then who and how many (L2), then which food (L3), then which of two look-alikes (L4).
3. **Where is the fun?** When a step closes, the animal eats. The goat munches so fast its beard wobbles. The hen pecks in time with the count. The cow chews slowly and gives a long, happy *moo*. A running gag: once a round, the goat stretches its neck into the hen's trough, and the hen boops its nose.
4. **Where is the instruction?** Nani asks from her bubble, standing on screen at the right, before any card. Each animal's card (its face) pops up big beside the side panel, then flies into its row on the order card.
5. **What is novel?** The first game where an animal is the customer. Two words per move (which animal and how many) on one tap pair. And the count can't end by itself (below).

**How a count closes.** **This reverses Zafar's easy-to-play principle 4 for counts** ("a count ends at the right number and an extra tap doesn't land", 21-22 Oct), because a count that stops at N lets a child win by tapping until it stops. It is put to him as decision 5; if he says no, the farm's counts stop at N like every other count game and the leak is noted. It keeps "no Done":
- Cobs pile up visibly in the trough. The count sits on the thing being counted.
- The animal waits politely, looking at the cobs.
- The step closes after a **stillness**: no tap for a set time (the rulebook's "a light waits until everything is still"). The time lives in `data/rules.json`; the lab tests it at **3 s and 4 s** with a three-year-old's pace before it's set (lessons §4: the ride had to run 50% slower). A step has one live ask, so there is no "next thing" to turn to: stillness is the only close.
- Until then, a tap on a cob in the trough takes it back.
- On close, if the count is right, the animal eats and the row ticks gold.
- If it's wrong, the trough gives a small shake and Nani says the number again. The child adds a cob or taps one back, there and then. The row then ticks plain, not gold, and **for moving up a level a redone row counts as a hint** (the rulebook counts hints, so a fished row mustn't climb the levels).

**The level ladder** (each level adds one Kutchi thing; the gesture never changes):

| Level | What's on screen | The ask | Asks | The new thing |
|---|---|---|---|---|
| L1 | hen, goat, cow; the corn basket | "The hen wants corn." One cob each. Only "yes" asks | 2, two different animals **drawn from all three**, the model's animal included | the three animal names |
| L2 | the same | "Give the goat two corn." 1-3 cobs | 3 (an animal may be asked twice: "two more for the goat") | numbers; two words per move |
| L3 | + water bucket, grass bundle | "The cow wants water." "Give the hen grass." Phrasings vary. Counts to 4 | 3 | which food; other ways of saying it |
| L4 | + a second goat: a big one and a small one | "Three corn for the small goat." Counts to 5 | 4 | the look-alike (big and small) |

No "no" asks in feeding: "don't feed the cow" isn't a natural thing to ask, and the rulebook lets a game skip them with a reason.

**The leak test** (someone who knows no Kutchi, playing a learned save, pills earned):

| Way to cheat | Could it work? | The fix |
|---|---|---|
| **Reading** | Past support the pills are speaker only; no text on the troughs. | No digits anywhere; cobs carry no numbers; past support the row is speaker only. |
| **Matching** | Card face to animal, while supported (that's allowed study, E2P 8). Matching food to animal by real life ("goats eat grass") would be a leak. | Every animal happily eats every food, and the asks rotate the foods. Past support the card shows no picture. |
| **Eliminating** | The model's animal stays askable: its cob is eaten, its trough is empty again and it looks hungry again before the first ask. With 3 animals and 2 asks, the last pick is never forced. From L2 an animal can be asked again, and the counts vary. | Asks drawn from all three; repeats allowed from L2. |
| **Patterns** | A fixed order, "the hen first", or "the model's animal is never asked". | The order, the counts, the foods and the model's animal are random per round. The animals' positions shuffle between rounds. |
| **Waiting** | A glow on the answer, or a count that stops at N. | No glow on the answer. Hints only repeat the line (free); the helper card with the answer costs the bulb. The count never stops by itself. |

**Blind odds:** L1 1 in 3 × 1 in 2 = **1 in 6** a round (17%, within the L1 allowance for supported words; it was really 1 in 2 when the model spent the cow). L2: 1 in 9 a row, about 1 in 730 a gold round, about 3% a level-up round.

**The bot's win (A1):** a round that would count towards moving up (at most one hint, a redone row counting as a hint). It must win under 10% of rounds from L2. It also reports gold rounds.

**The delight moment:** all fed, everyone eats at once, a little farmyard orchestra of munch, peck and moo. Nani says *shabash* ✓, and Hannah Mami claps. The chicks run in and steal one kernel.

**Speaking:** none here. This is where the child watches Nani call each animal to its trough for Hannah Mami (the watch step for C2).

---

### Stage 7. B1 The photo shoot: make it do it, then snap

**Why:** Nani wants photos of the animals for her book (the evening book). The goat is a show-off and will do anything for the camera.

This is the farm's **"Nani says, do it"** (research-mechanics, top 10, no. 1: one animal, several actions, so the verb decides), and the farm's use of the **rebuilt Snap kit**. The safari's Snap watches animals pass. The farm's Snap lets the child **make** the animal act, which the embodiment research rates higher than watching (Mavilidi 2015).

**The five questions:**
1. **What do you do?** The goat stands in the middle of the yard. Around it are the places, each with its action: the trough (eat), the open field gate (run) from L1; the water bucket (drink) and the straw bed under the awning (sleep) from L2.
   - **Tap a place.** The goat trots there and does the action, in a loop: it eats, or races round the field and leaps back; from L2 it drinks, or curls up and snores.
   - The camera frame (soft white corners) follows the goat. Once the goat is doing something, its corners turn gold.
   - **Tap the goat inside the gold frame:** click, flash, the goat looks into the lens, and a print slides out **silently** into its row (below). **The shutter never judges** (Snap's quality pass Q0, Zafar 25 Sept): no tick, no laugh, nothing at the click that tells right from wrong.
   - From L2 the hen also acts: tap the hen first (the frame glides to her), then a place, then her.
   - Before the shutter, tapping another place changes the action. That's the undo.
   - There's no shutter button: the cog stays the only button on the play screen.
2. **Where is the challenge?** The verb decides which place to tap. The places are all there every time. The goat looks equally keen on all of them, and any action can be asked, more than once a round. From L2 the animal is a second word. From L3 the number of hens is a third. At L4 big or small is the look-alike.
3. **Where is the fun?** The animal acts, then poses: on the click, the goat looks straight into the lens.
   - Running ends with a leap that lands nose-to-lens: **the first round's reward**.
   - From L2, drinking leaves a dripping beard; sleeping brings a snore bubble and one ear twitch.
   - **The hand-in:** when the round's photos are taken, Nani says "let's look!" and holds up each print in turn, names what's in it ("Oh, the goat is eating!", P2) and ticks it if it fits. A print that doesn't fit is the joke, not a verdict: the goat mid-leap with its tongue out, say. Nani laughs and names it. **The first such print a round is kept as the bonus photo for the book;** later ones get the laugh and the naming, and nothing is kept. Then she asks that row again and the child retakes it (a plain tick).
4. **Where is the instruction?** Nani is on screen, holding the camera at chest height. "Take a photo of the goat eating." The card pops up big: the goat doing it (its face is the customer's), while supported. It flies into its row.
5. **What is novel?** The first game anywhere in Nani jo Ghar where a **verb** decides the move, and the first where the child makes a character act. The photo is a thing the child made, and it lives on in the book.

**One job at a time:** each row is one photo. The make-it-act tap and the snap tap are one move: you can't snap until the animal acts.

**Where the print goes.** The print lands on its row and the row's picture becomes the child's photo. That is a change to the shared `order-card.js` (non-negotiable 6), so it is put to the shared-layer owner as a **shared feature** (the party's and the safari's Snap will want it too), not built in the farm. Until it exists, the prints stand in a small tray at the bottom of the play area, in row order, face down, until the hand-in.

**The level ladder:**

| Level | Actors | Places (verbs) | The ask | Photos | The new thing |
|---|---|---|---|---|---|
| L1 | the goat | trough (eat), field gate (run) | "Take a photo of the goat eating." | 2 | verbs: eat, run |
| L2 | the goat, the mother hen | + bucket (drink), straw bed (sleep) | "Take a photo of the hen drinking." Who and what | 3 | two more verbs and a second actor (two words per move); `farm.md` row 7's "the hen" |
| L3 | + a pair and a trio of hens, who move as groups | the same | "Two hens eating." Phrasings vary: "now the goat sleeps" | 3 | how many (row 7's "two goats" becomes two hens: one goat is the show-off) |
| L4 | + a small goat beside the big one | the same | "The small goat running." | 4 | the look-alike (row 7's "the big goat") |

**Second visit:** "the chick with its mother" (row 7's last ask) and positions ("the goat next to the cow").

**The leak test:**

| Way to cheat | Could it work? | The fix |
|---|---|---|
| **Reading** | Past support the places' pills and the row are speaker only. | No text past support. |
| **Matching** | The card's picture of the goat drinking matches the bucket, while supported (study). | Past support no picture. The card never shows the place, only the animal acting. |
| **Eliminating** | All the level's places stay live every row. Actions repeat across rows. Nothing greys out once used. | Asks drawn with replacement; never "one of each". |
| **Patterns** | Eat first, then run. | Random order; places shuffle round the yard between rounds. |
| **Waiting** | The frame turns gold for any action, so gold isn't the answer. Nothing glows the right place. | Hints repeat the line; the bulb's helper card costs. |
| **Fishing** | Snap, watch for a tick, try the next place. | The shutter is silent; nothing is judged until the hand-in. A retaken row ticks plain and **counts as a hint for moving up**. |

**Blind odds:** L1 1 in 2 a row, **1 in 4** a gold round (supported words; within the L1 allowance). L2 1 in 8 a row (two actors, four places): about 1 in 500 a gold round, about **4%** a level-up round.

**The bot's win (B1):** a round that would count towards moving up (at most one hint, a retaken row counting as a hint). Under 10% from L2. It also reports gold rounds (every print fits at the hand-in).

The alternative (decision 6 option b) keeps a tick at the shutter, with a redone row counting as a hint and the bot's win being any tick. It reacts faster, but Zafar ruled the silent shutter in Snap's quality pass and named the fishing leak himself in chaat (CHT-14), so (a) is assumed.

**The delight moment:** the leap. The goat races off through the gate, loops the field, and lands in the frame mid-air on the click. The print catches it with all four hooves off the ground, and at the hand-in Nani laughs with delight at it.

**Speaking:** none at the first two visits. At the third visit, "You be Nani" (P4) flips it: the child says the verb from a closed set of 2-3 (*kha* ✓ "eat!" is already recorded; the others need their imperatives), and the goat does what it heard. It uses the shared "say it, the character acts" moment (`say.js`), never a seventh copy.

---

### Stage 9. Home at dusk: C1 In you go, then C2 Call it over

**Why:** the sun is going down, and Hannah Mami needs the animals in for the night. Each goes to its own place (Zafar, 20 Oct): the goat and the cow to the shed, the hens to the coop, the chicks with their mother.

The scene is the same farmyard relit for golden evening. The shed's door is open and its window is warm. Nani and the child stand at the gate (front right); Hannah Mami stands by the shed (big layout).

#### C1 In you go (listening)

1. **What do you do?** Nani says who goes in now, and names the place ("Now the goat goes into the shed", Zafar's row 9: "one at a time, the place named"). Tap that animal: it trots to its own home and goes in, and the shed window glows a little brighter. Each home is fixed by the animal (Zafar's rule), so the heard word decides **who goes now**; the place is heard but never decides.
2. **Challenge:** which animal (L1), then who and how many (L2: "two hens go into the coop now", one or two of the three). **For a count, each tap sends one hen to the foot of the coop ramp,** where they gather, visible and countable; a tap on a hen on the ramp sends her back to the yard. They go up together when the count closes (on stillness, as in A1). Every animal is yawning, so the picture settles nothing.
3. **Fun:** the hen goes up her ramp, and her three chicks follow in a line. The last chick runs back for a dropped kernel, then hurries after (the same every visit; the child waits for it). A snore comes from the shed.
4. **Instruction:** Nani on screen first, then the card (the animal's face) pops up big and flies into its row.
5. **Novel:** little on its own (tap the named one). It's Zafar's agreed beat and the lead into the call, and kept short.

#### C2 Call it over (speaking)

**Gated:** C2 runs only once Mum has recorded the three names alone and her call to each animal (§9 "Mum first", items 1 and 2). The recogniser has nothing to match without them, and it is never device-spoken. Until then, home at dusk plays C1 only, and Hannah Mami leads the last animal in (a beat, no ask).

1. **What do you do?**
   - **Watch:** Nani calls one animal: "Hen, come here!" It trots to the gate, then goes home. The child has already heard Nani call each animal at breakfast.
   - **Handover:** Nani turns to the child and hands over a corn cob (the prop: farmers shake feed to call animals). The child's own character steps to the gate. The shared "your turn" bubble with the mic appears. The card shows the face of the animal to call.
   - **Rung 1 (say it after):** Nani's recorded call plays, written and underlined. The child says it.
   - **The recogniser's set is the three names, always,** and the pills show all three. **The animal it heard reacts.** If it's the card's animal, it trots up, nuzzles the cob and goes home. If it's another animal still out, that one comes instead, a funny surprise ("oh, the cow came!"), and the card's animal is asked again. If it's an animal already in, she pokes her head out of the coop or the shed, blinks, and goes back in (the joke), and the card's animal is asked again.
   - A tap on a pill does the same. A grown-up can tick it.
2. **Challenge:** saying the name, from three that sound different (goat, cow, hen). Speaking rungs fade by the child's own record (speaking.md), not by level.
3. **Fun:** an animal obeys your voice. Children's voice-game studies show it's the speaking moment most likely to work with real voices (research-mechanics, no. 4). It's the Nintendogs feeling.
4. **Instruction:** the watch step (Nani at breakfast and at dusk), the handover prop, the face on the card, and the model line at rung 1. Never English.
5. **Novel:** the first time the child calls out in the whole game, and the first trip with speaking that isn't a greeting.

**The evening's level ladder:**

| Level | Out at dusk | Watch | C1 listening asks | C2 calls by the child | The new thing |
|---|---|---|---|---|---|
| L1 | hen (with chicks), goat, cow | Nani calls the hen | **1: goat or cow** ("Now the goat goes into the shed"; 1 in 2, the L1 allowance) | 1: the last one out | come here; go in; shed, coop (heard) |
| L2 | + two more hens (3 hens) | (only if the rung needs it) | 2: "two hens go into the coop now" (1 or 2 hens), then any animal still out | 2 | numbers in the asks |
| L3 | the same | (only if the rung needs it) | 2, phrasings vary | 2 | other ways |
| L4 | + the small goat | | 2: "the big goat first, and then (*ne poi* ✓) the small one" | 2 (the set stays the three names; the goat call brings whichever goat is out) | look-alikes and order |

Whatever is left after the watch, the asks and the calls, Hannah Mami leads in herself (a beat, no ask). **The last animal out is never a free tap:** it is called by voice or led in, so elimination never decides a listening ask.

**The leak test (C1):**

| Way to cheat | Fix |
|---|---|
| **Reading** | No text past support; the card is speaker only past support. |
| **Matching** | Homes are fixed by animal, but the home never decides the move (only who goes now). Past support the card has no picture. |
| **Eliminating** | The last animal is never a listening ask (a call or a beat instead). At L1 the one ask is 1 in 2, within the allowance. |
| **Patterns** | Random order (the watched hen at L1 is a model, not an ask); the animals' spots in the yard shuffle. |
| **Waiting** | No glow on the asked animal; nobody wanders off before being asked (the ride's rule). |

**Blind odds (C1):** L1 1 in 2 (supported). L2: the count ask 1 in 3 for the animal × 1 in 2 for the count, then about 1 in 3: about 1 in 18 (6%) a round.

**The bot's win (C1):** every listening ask right first tap in a round. Under 10% from L2.

C2 isn't a listening test: the recogniser decides, and the pills earn no speaking bonus. Nothing waits on recognition. Two null results bring the pills live (`say.js`).

**The delight moment:** the called animal trots to the child at the gate, nuzzles the cob, then goes off to bed. When the last one is in, the shed door swings shut, the window glows, and there's one sleepy chorus of cluck, bleat and moo. Nani says "Good night!", and so does the child if they like (not scored).

---

## 4. The child's first-ever round, screen by screen (L1)

**Before the yard.** Meet Hannah Mami ends with Nani calling the animals for her: "Hen, come here! Goat, come here! Cow, come here!" Hannah Mami waves each over, and each trots to its trough. The child watches. Nothing is tapped.

**Feed (stage 5)**
1. **The opening.** The yard: the hen, goat and cow behind three empty troughs; the corn basket bottom left; Nani at the right edge (Hannah Mami beside her on the big layout; on phones see §7). At the start, the basket is shown once (it isn't on the card): it bounces in a lit gold box, and Nani says *makai* ✓.
2. **The model.** Nani, to Hannah Mami: "The cow wants corn." Hannah Mami points; **the model shows the two taps:** the basket's lit box, a cob lifts; the cow's trough's lit box, the cob drops. Nothing is carried across the screen. The cow munches it all up, licks its lips, and looks hungry again at its empty trough. This is the two-person exchange, played once. (The model's animal is random per round.)
3. **The ask.** Nani turns to the child. "The hen wants corn." The hen's card pops up big beside the side panel (her face, *murgi* in grey italic English until recorded, the speaker). Then it flies into the order card's first row.
4. **First tap.** The scene dims. Only the basket is lit (gold glow, bounce). Tap: a cob lifts and glows.
5. **Second tap.** Now the three troughs are each lit in their own box. Tap the hen's trough: the cob drops with a soft thud. Stillness; the hen pecks in rhythm, the row ticks gold, and the chicks scuttle in.
   - A wrong trough gives a shake and the word again. The cob hops back to the basket. The wrong animal just looks puzzled, a different face each time.
6. **Second ask.** Drawn from the two not just asked, the cow included: "The cow wants corn." The card pops up and flies in. The light is only on the basket this time. Tap, tap, and the cow munches with a long *moo*.
7. **The fun.** The goat stretches into the hen's trough, and the hen boops its nose. Nani: *shabash* ✓; Hannah Mami claps.
8. **The end.** The word cards for hen, goat and cow come up, then the shared two-page end screen (time, ticks, bulb). Then the day moves on to the eggs.

**The photo shoot (stage 7)**
1. **The opening.** Midday. The goat stands centre stage; the trough is on the left, the open field gate at the back right. Nani at the right edge, holding the camera.
2. **The model.** Nani, to Hannah Mami: "A photo of the goat eating." Hannah Mami points at the trough (its lit box); the goat trots over and eats; the frame turns gold; Nani snaps: click, flash, the goat looks up at the lens with full cheeks, and a print slides out silently into the tray. (Asks are drawn with replacement, so the model spends nothing.)
3. **The ask.** Nani turns to the child: "Take a photo of the goat running." The card (the goat mid-run) pops up and flies in.
4. **First tap.** The two places are each lit. Tap the gate. The goat races through it, loops the field, and its frame follows; its corners turn gold.
5. **Second tap.** Now only the gold frame is lit. Tap it as the goat leaps back: click, flash, all four hooves off the ground, nose to the lens. The print slides into its row, face down. No tick yet.
6. **Second ask.** "Take a photo of the goat eating." Tap, tap.
   - If the child taps the gate instead, the goat runs (the undo is free until the snap).
7. **The hand-in.** Nani: "Let's look!" She holds up each print in turn: "Oh, the goat is running!" and the row ticks gold. If a print doesn't fit, she laughs, names what's in it, it becomes the round's bonus photo, and she asks that row again for a retake.
8. **The end.** The photos sit in their rows. The word cards for eat, run and photo come up, then the end screen.

**Home at dusk (stage 9)**
1. **The opening.** Golden light; the three animals out and yawning. Nani and the child's character at the gate; Hannah Mami by the shed.
2. **Watch.** Nani: "Hen, come here!" The hen trots to the gate, then up the coop ramp. Her chicks follow in a line, and the last chick runs back for a kernel (the joke).
3. **The listening ask.** Nani: "Now the cow goes into the shed." The cow's card pops up and flies in. The goat and the cow are each lit. Tap the cow: it plods into the shed, and the window glows a little brighter. (A wrong tap: the goat looks puzzled and stays; the line again.)
4. **The handover** (once Mum's names and calls are recorded; until then Hannah Mami leads the goat in and the round ends). Nani turns to the child and holds out a corn cob. The child's character steps forward. The card shows the goat's face, and the "your turn" mic bubble appears.
5. **Rung 1.** Nani's call "Goat, come here!" plays, written and underlined in the child's bubble. The child says it. The mic shows it's listening, then what it heard. The goat trots over, nuzzles the cob, and goes into the shed. If the recogniser heard "hen", the hen pokes her head out of the coop and goes back in, and the goat is asked again. If there's no mic, the three pills are tapped instead.
6. **The end.** The door closes and the window glows, with a sleepy chorus. Nani: "Good night!" The word cards for come here, go in, shed and coop come up, then the end screen. Then home, the egg for Ali, and the book with today's photos.

---

## 5. Later visits and harder versions

- **Within a visit:** level up after 3 rounds with at most one hint each, where a redone or retaken row counts as a hint; never down (the rulebook). Free play can dip into any of the three stages at any level from the farm on the map. A level opens only when its words are recorded (§9).
- **Second farm visit:** positions.
  - Home: "the goat sleeps next to the cow", "the chick behind the hen". The shed has stalls, and the place is said.
  - Photo shoot: "the chick with its mother", "the goat next to the cow".
  - P1 Count them in: "how many in the shed?" (*kitla* ✓), answered by tapping the right number of animals, never digits.
  - The orchard (its own design) joins this visit.
  - The darkroom, if Zafar wants it here (§10, open questions).
- **Third visit:** the child gives the orders. P4 "You be Nani" in the photo shoot: the child says eat (*kha* ✓), drink or sleep, and the goat does what it heard. C2 at rung 4: the card shows two animals and the child picks which to call.
- **The book, later:** the past tense under each photo ("the goat ate", "the goat slept"), once Mum's past forms are in. The *khai* form is already in the engine.
- **Reused elsewhere:** the animal actor and the troughs at the adoption centre; the Snap kit at the safari and the party.

---

## 6. What it reuses and what is new

**Reused, built (js/shared/):**
- `stage.js`, `frame.js`: the scene and the two layouts.
- `request-popup.js` (Lifecycle): the ask and the card pop.
- `order-card.js`, `word-card.js`: the rows and the word ladder (the pills).
- `guide.js` and `bulb.js`: the guide box (the step, no face) and the helper card.
- `onboard.js` and `focus.js`: the lit box and the dim.
- `rules.js` with `data/rules.json`: levels, hints, the stillness time.
- `rel.js`: the yard's spots, the places and the homes as data.
- `whichone.js`: the decoy balance and the blind-odds calculator.
- `say.js` and `speech.js`: the call.
- `character.js`: the child's own character at the gate.
- `results.js`: the end screen.
- `sfx.js`.

**Asked of the shared-layer owner (not built in the farm):** the order card's **photo in the row** (the row's picture becomes the child's print). The safari and the party want it too. Until it exists, the farm's prints sit in a play-area tray.

**Reused, designed but not built:**
- put it in its place (`docs/game-design/modes/put-it-in-its-place.md`): feed and in you go.
- count to a heard number (`count-to-a-number.md`): the cobs and the hens. If Zafar says yes to decision 5, the **close on stillness** goes into `easy-to-play.md` principle 4 and `count-to-a-number.md` in the same commit, with his name and date, as the everywhere rule; it isn't changed from here.
- The window ride's rule "nothing leaves before it's asked".

**The Snap kit, rebuilt from the greybox** (`js/snap/`, parked). Kept as ideas, rewritten on the shared kit:
- the photo record: what's in the frame, from `photo.js`;
- the silent shutter and the hand-in that names each print and ticks what fits, from `handin.js`, quality pass Q0;
- the leak bot's shape, from `bot.js`.

**Not used on the farm's first visit:** dragging the world to aim, the zoom and the film count. The darkroom, the instant camera or phone, and young Nani in old photos are Zafar's open questions for this rebuild (§10), not parked.

**New to build:**
1. **The animal actor** (small; the trip's one new piece). An animal sprite with pose states (idle, walk, eat, drink, sleep, run, look at the lens, peek out of its home), a walk to a named place, and an action loop, all as data. The safari and the adoption centre reuse it.
2. **The Snap kit's frame and hand-in:** a soft-cornered frame that glides to an animal and follows it, goes gold when the shot is ready, and shoots on a tap inside it; the print slides out silently; the hand-in holds each print up for Nani to name and tick. The safari designer adds the moving road on top.
3. **Data:** `data/day.json` farm stages; the yard's spots; asks per level; the evening relight's swap; the stillness time in `data/rules.json`.
4. **Leak bots** for A1, B1 and C1 (adapters in `build/tools/review/leak-games/`), playing a learned save with the pills earned. Each bot's win is written in §3: a round that would count towards moving up (A1, B1) or every ask right first tap (C1); under 10% from L2.
5. **Lab pages** for each stage with a level picker (the clinic heal lab's pattern), plus the grey-box layout lab (§7) before any art run.

**Assets each mini-game declares, loaded only when it's chosen** (method §6 item 7):

| Mini-game | Backgrounds | Animals | Things | People | Audio |
|---|---|---|---|---|---|
| A1 Feed | the day yard | goat, hen (+ chicks), cow: idle, walk, eat, look puzzled; the small goat (L4) | three troughs, cobs 1-5 in a trough, the basket; water bucket, water in a trough, grass bundle, grass in a trough (L3) | Nani (talk, point), Hannah Mami (point, clap) | F1-F4, the names, numbers, *makai* ✓, *shabash* ✓, munch, peck, moo |
| B1 Photo | the day yard | goat: eat, run, leap, lens; drink, sleep (L2); hen: drink, sleep, lens (L2); hen groups (L3); small goat (L4) | trough with cobs, the gate, the bucket, the straw bed; the frame, the flash and the print (code-drawn) | Nani with the camera, Hannah Mami (point) | P1-P3, *photo*, click, snore, splash |
| C1 and C2 Home | the evening yard | goat, cow: walk, go in, peek out; hen walk-up-ramp, peek out; the chick line | the coop ramp, the shed door (open, shut), the lit window | Nani (call, hold out a cob), the child's character with a cob, Hannah Mami (lead) | H1-H4, the names, the sleepy chorus |

---

## 7. Art and layout

### Camera (art bible §3)

**E, eye level, front**, one camera for the farmyard in all three stages. The horizon sits high so the ground fills the frame. Troughs, the bucket, the basket and the straw bed are in **F view** (about 10° down), so the cobs in a trough can be counted. All animals stand on the ground and get contact shadows from code. Nothing floats.

### Art needed (backgrounds locked first; two blocks, then Hannah Mami)

The first plan was about 35 cut-outs in one block, nearly double the biggest run so far (s07 B, about 20 with redos). It is staged:

**Block 1 (L1-L2, the first visit):**

| Item | Have | To make |
|---|---|---|
| The farmyard: day | the farm road's mid fields and far hills (`s09r` m1, f1) as style | one wide yard background: fence, field, shed with a door and window, coop with a ramp, awning over the straw, a gate to the field; empty ground in front for troughs |
| The farmyard: golden evening | | the same picture relit (art bible §2), plus the shed window lit and the door shut |
| Goat | three-quarter, front, side, back, walk, graze (eat), lie, jump, bleat (`assets/characters/goat/`) | eat, drink, sleep (eyes shut, curled), run, look at the lens. The old goat set is a whiter goat than the `i1` sheet: pick one look (decision 17) and redo the other to match |
| Hen | walk, peck, sit, flap, three-quarter, front (`assets/characters/`) | drink, sleep |
| Cow | standing (`s09b` a1) | eat |
| Things | | three troughs (empty), corn cobs in a trough (1-3, stacked readably), the corn basket, the water bucket, the straw bed |
| Nani | the locked s08 look (`sources/art/s08/sheet-nani-final-1.png`, `lineup-v4-1.png`) | holding a camera (three-quarter and front); holding out a corn cob |

**Block 2 (L3-L4 and the second visit):** the small goat (the same goat, scaled, younger face); the hen pair and trio; the hen at the lens; the cow drink, walk, lie down, three-quarter, front; grass bundle and grass in a trough; water in a trough; cobs 4-5; a line of chicks following; the animals peeking out of their homes.

**Hannah Mami, after her likeness run (Zafar):** three-quarter and front-facing (UX §16), waist up and full; pointing, clapping, leading an animal. The farm doesn't ship without her, since she hosts the day.

**The child's character:** the shared character layers, standing at the gate holding a cob (a pose for the shared kit, not a farm-only sprite).

**UI (code-drawn, never in the art):** the Snap frame (corner brackets, white and gold), the flash, the print's white border, the lit boxes, the mic bubble.

### Layout

The left fifth (about 22%) is the side panel at every size. "Keep the left for the cards": the people stand at the right of the play area, the animals in the middle, the food at the bottom left of the play area.

**On paper the first phone plan didn't fit** (the critique's sums): at 740 wide the play area is about 577 px, and three animals side by side (380-470 px), troughs, the basket (about 80 px) and two people chest-up (about 180 px) come to over 640. At 915x275 the ground line at 85% is y 234, the cow's top about y 94, and there is no room for two faces and their bubbles beside them. So on phones:

| Size | The play area | What changes |
|---|---|---|
| **740x320** (phone) | about 577x320 | **Depth, not width:** the cow stands behind, between the goat and the hen, overlapping them a little; its trough sits behind theirs. Goat about 120 px tall, hen about 80, cow about 130. **One person on screen at a time** at the right edge, chest up (about 90 px): Hannah Mami for the model, then she steps out and Nani steps in for the asks. Nani's bubble sits at her face, to her left, over the sky and the field, never over an animal. The basket at the bottom left of the play area, about 70 px. |
| **915x275** (Z Fold) | about 714x275 | The same line-up with more space between animals; the shed cropped to its door. Animals no shorter than 100 px (the cow about 110). Nani at the right, her head level with the cow's back; her bubble beside her face. The scenery gives the room, never the animals. |
| **930x430** | about 725x430 | The phone layout with more sky and the shed whole; both people fit. |
| **1280x665, 1920x1080** | the big layout | The whole yard: the shed, coop and gate visible, both people waist up, the field behind. The same positions, scaled; animals capped so they don't fill the screen. |

**The photo shoot on phones:** the frame is about 40% of the play area's width (about 230 px at 740). At L1 two places (the trough at the left, the gate at the back right); from L2 four, at the corners of the yard's middle band. The print tray sits at the bottom edge until the shared photo-in-the-row exists.

**The call on phones:** the "your turn" bubble sits above the child's head, never over Nani's face. The pills sit under it.

**The layouts switch by height** (the phone layout below 500 px).

**Proof before any art run** (Zafar's fast lane, 27 Oct): a grey-box lab page with every animal, trough, person and bubble as a labelled box at the four sizes (740x320, 930x430, 1280x665, 1920x1080) plus the Z Fold (915x275), checked by the four-size script. If one person at a time reads badly on phones, the fallback is the two people overlapped (Hannah Mami half behind Nani, about 130 px together); the lab decides, and the result goes to Zafar with the mock-ups.

---

## 8. What it borrows from other games

- **Peekaboo Barn** (Night & Day Studios): an animal appears, then a human voice names it. Cause and effect plus the name, loved by toddlers. Borrowed: every animal reacts the moment it is named and acted on, and the word comes with the reaction.
- **Sago Mini Farm:** animals react to whatever you do, but reviewers say open play bores children who want the app to "do something". Borrowed: the reactions. Added: Nani's ask gives the toy a goal.
- **Nintendogs:** you call your pet by its name and it comes. Borrowed: calling an animal by voice as the speaking moment, with a closed set of names.
- **Pokémon Snap:** the subject reacts to the shutter and the photo is judged by what's in it, after the run. Borrowed: the look into the lens, and Nani naming what's really in the photo at the hand-in. Not borrowed: the rail and the score.
- **TOEM:** characters ask for particular photos. Borrowed: Nani's photo asks, which feed the book.
- **"Simon says" without the trick** (TPR; research-mechanics no. 1): "Nani says, do it", with the verb deciding which action happens.
- **Toca Kitchen 2:** guests react to food. Borrowed: each animal eats in its own way.
- **Our own:**
  - the window ride's rule that nothing leaves before it's asked;
  - Cook's order card and the pop-then-row;
  - the clinic's "why" beat;
  - Snap's quality pass (Q0): the shutter is silent, an unasked print is named, not judged, and rows tick at the hand-in.

Sources: research-other-games and research-mechanics (31 Oct). [Common Sense Media on Sago Mini Farm](https://www.commonsensemedia.org/app-reviews/sago-mini-farm); [BridgingApps on Sago Mini Farm](https://bridgingapps.org/?p=29033); [Common Sense Media on Peekaboo Barn](https://www.commonsensemedia.org/app-reviews/peekaboo-barn); [WonderBaby on Peekaboo Barn](https://www.wonderbaby.org/?p=3281).

---

## 9. The lessons checklist

| Group | Verdict |
|---|---|
| 1 The heard word decides | **Pass, with a recording gap.** A leak test and a bot win rule per mini-game (A1, B1, C1). The deciding words are named in §1, and the frame table says what each heard sentence needs: **only corn and small are deciding clips on their own today**; *kha* ✓ is the imperative and decides nothing until the third visit's speaking. The animals, numbers, the verbs' present forms and every frame are to record. **Until Mum records them, a reader can win on the grey English** (AUD flaw 2), so the stages don't count as teaching until then, and C2 can't run at all. No outlines or dirt mark the answer. Ticks are first go only, and the photo shoot's tick waits for the hand-in. A redone row counts as a hint. Two words per move from L2. |
| 2 Onboarding | **Pass.** The first round is the tutorial, with one lit box at a time, no finger and no flying item: each model shows the two taps as lit boxes, and Hannah Mami points, never carries. The basket is shown at the start (it isn't on the card). The photo's gold frame is shown once. It's tap then tap, with 3 places at L1 (feed) and 2 (photo); no drags. |
| 3 Instructions | **Pass.** Nani is on screen and speaks first, from her own bubble; the guide box says the step without a face; the card's face is the animal; the card pops up big, then flies to its row. A model exchange plays before each first ask. One line per moment: Hannah Mami is silent until her own lines exist. Listening again is free. |
| 4 Pacing | **Pass, one change put to Zafar.** No Next or Done; counts close on stillness (3-4 s, lab-tested), which reverses easy-to-play principle 4 for counts (decision 5). Hints at 7/9/11/13 s. The call comes after the light. Nothing leaves before it's asked. The ask is repeated for non-readers. |
| 5 Feedback | **Pass.** A shake and the word; a wrong item redone on the spot; each miss gets a different puzzled face; an unasked photo is a joke, and one a round is kept for the book. It ends when the job is done, with something served (everyone eats; the photos; the door shuts), then the shared end screen. Undo until the step moves on: a tap on a cob takes it back; a hen on the ramp goes back to the yard; another place changes the action before the snap. |
| 6 Layout | **Not yet.** The first phone plan didn't add up; the revised one (depth, one person at a time on phones) is proved in a grey-box lab at the four sizes and the Z Fold before the art run. |
| 7 Art | **Pass on paper.** One camera (E, with F items). Real art only, with code moving it. Contact shadows. Calm animation. Two poses per speaker. Two staged blocks, then Hannah Mami. **Exception:** the old goat set and the `i1` goat don't match; one must be redone. |
| 8 Speaking | **Pass, gated.** Inside a watched exchange (Nani at breakfast and at dusk), the recogniser's set always the three names with the pills always there, and never a gate. It uses the shared `say.js` moment. It runs only once Mum's names and calls exist. |
| 9 Levels | **Pass, one exception.** L1 to L4 follow the rulebook (L1 yes only; L2 numbers; L3 other ways; L4 look-alike), and each level is designed. A level opens when its words are recorded. **Exception:** no "no" asks in feeding or the photo shoot (a reason given, as the rulebook allows). |
| 10 Words | **Over the cap, said.** About 44 takes for the three stages (about 30 at L1-L2), about 55-60 for the farm day: double the template's first-visit figure. Split by level into sittings below; the day's length is decision 19. Things are named as they are at that moment (corn on the cob, not "food"). Every count is said. At most 3-5 new words a round, each heard 3+ times. |
| 11 Culture | **Pass.** No pig (Zafar, 31 Oct). Food is corn, water and grass, with no sweets or treats as rewards. Modest clothes. No religious markers. |
| 12 Fun | **Pass.** The hands work at every step, and each stage has a "kind of funny" moment in its first round: the nose boop, the leap into the lens, the chick that runs back, the hen peeking out of the coop. Contrast comes from the cow's slow chew against the hen's fast pecks. Consecutive stages never repeat the main action. Everything carries into the book. |
| 13 Twice-made mistakes | The count-closing rule is **put to Zafar** as a change to his principle 4, not set for every game from here. Judging needs film, because the animals' actions only show in motion. All four levels and all five sizes are specified, the phones proved in a lab first. The open questions are Zafar's (§10). |

**The ten questions:**
1. The animal names, the verbs' present forms and the numbers decide. Two deciding words are recorded on their own today (corn, small).
2. The Sceptic at L2+ fails: about 3% (feed) and 4% (photo) a level-up round. Elimination is blocked by keeping the model's animal askable, repeats and beats; patterns by shuffling; waiting by the free hint giving no answer; fishing by the silent shutter.
3. Every animal is equally hungry, keen or sleepy.
4. The basket, then the troughs; the two places, then the gold frame; the mic bubble.
5. Nani (Mum's voice) asks in every stage, from her own bubble; Hannah Mami hosts silently until her lines exist.
6. Tap the basket and trough; tap the place and the frame; speak or tap a pill.
7. The nose boop, the leap into the lens, the chick running back.
8. Everyone eats; the hand-in; the door shuts with a sleepy chorus.
9. See the ladders. Each L4 has its own look-alike.
10. Not yet: the grey-box lab first, with one camera.

### Mum first: her sheet, in order

C2 is gated on items 1 and 2; everything else unlocks a level when it lands. Never device-spoken in a store build.

| Order | What | Takes | Unlocks |
|---|---|---|---|
| 1 | **The three animal names alone:** hen, goat, cow. **Ask: is *murgi* the live hen** (the inventory has it as "chicken" in cooking)? Is *bakri* the word for the yard's goat? | 3 | every stage's deciding words; the recogniser's templates |
| 2 | **Nani's call to each animal:** "Hen / Goat / Cow, come here!" Ask: is "come here (to a child)" how she'd call a goat? | 3 | C2 |
| 3 | **The present forms** of eat, run, go in (she-thing), and "wants" with an animal (F1, P2, H1); then drink, sleep (L2); then the plurals (L3) | 4 + 2 + 5 | feed L1, photo L1, home L1; then L2, L3 |
| 4 | **The frames:** F1, P1 (eat, run), H1 (shed, coop); then F2, P1 (drink, sleep), H2; then F3, F4, P3 | 7, then 6, then about 6 | the same levels |
| 5 | **Words alone:** shed, coop, photo, good night; then one, two, three; then chick, grass, water, big, four, five | 4, then 3, then 6 | word cards; L2; L3-L4 |

**Sittings:** the first (items 1-2, and the L1 parts of 3-5) is about 21 takes and opens every stage at L1; the second (L2) about 14; the third (L3-L4) about 12. The rest of the farm day's words (hat, water bottle, farm, four dressings, speed up, slow down) go in the first sitting beside these.

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, the reason, and the answer I assumed. Answer "yes to all except …".

1. **Three stages, kept where `farm.md` has them** (feed 5, photo 7, home 9). They're your agreed rows; nothing is moved or removed. *Assumed: yes.*
2. **"Nani says, do it" lives inside the photo shoot:** make the animal do it, then take its photo. The verbs get a goal, the photos carry into the book, it adds no 12th stage, and it differs from the safari's Snap (which watches verbs pass). Your row 7 asks ("the hen", "two goats", "the big goat") become L2-L4's who, how many and big; **L1 is eat and run with the goat alone**, so the leap into the lens is the first round's reward. The alternative is L1 "take a photo of the goat / the hen / the cow" (nouns), with verbs from L2. *Assumed: verbs at L1 (eat, run).*
3. **Feeding counts corn cobs, not scoops.** *Makai* ✓ is already recorded, so "scoop" needs no recording, and it links to the corn stall. *Assumed: yes.*
4. **Every animal eats every food.** Otherwise real-life knowledge ("goats eat grass") picks the answer instead of the word. *Assumed: yes.*
5. **This reverses your easy-to-play principle 4 (21-22 Oct) for counts.** A count that stops at the right number lets a child win by tapping until it stops. Instead a count **closes on stillness** (no Done), the time in `data/rules.json`, lab-tested at 3 s and 4 s; take a cob back by tapping the cob, not the trough; a redone count ticks plain and counts as a hint. If yes, it becomes the rule for every count game, changed in `easy-to-play.md` and `count-to-a-number.md` with your name and date. If no, the farm's counts stop at N and the leak is noted. *Assumed: yes, starting with the farm's lab.*
6. **The photo shoot's tick.** (a) **The shutter stays silent,** as your Snap quality pass decided (25 Sept): prints slide out unjudged; at the hand-in Nani holds up each, names it and ticks the ones that fit; a retake counts as a hint. (b) A live tick at the shutter, with a redone row counting as a hint and the bot's win being any tick: quicker feedback, but it lets a child fish (your chaat point, CHT-14). Either way: tap to frame, tap the gold frame to shoot; no drag-to-aim, zoom, film count or shutter button. *Assumed: (a).*
7. **One unasked photo a round is kept as a funny bonus photo** for the book, named by Nani at the hand-in; later ones get the laugh and nothing is kept, so the joke can't be farmed. *Assumed: yes.*
8. **The cast:** a she-goat (*bakri*, since the take exists), a mother hen with three chicks (two more hens from L2), a cow (*gai*), and a small goat at L4. No dog, camel or buffalo on the first visit. *Assumed: yes.*
9. **No "no" asks** in feeding or the photo shoot. "Don't feed the cow" isn't a natural thing to ask. The rulebook lets a game skip them with a reason. *Assumed: yes.*
10. **Home keeps "each animal to its own place, one at a time, the place named"** (your 20-21 Oct row), with a listening ask at every level, L1 included; the heard word decides **who goes now**, and the place is named but doesn't decide (a coop looks like a hen's home, so "where" would be won by picture). *Assumed: yes.*
11. **The first round's speaking:**
    - The child watches Nani call three animals at breakfast and one at dusk.
    - Then the handover: Nani hands over a corn cob, and rung 1 (say it after) begins.
    - The recogniser's set is always the three names; the animal it heard reacts, even a wrong one (one already in peeks out and goes back).
    - **C2 waits for Mum's names and calls;** until then Hannah Mami leads the last animal in. *Assumed: yes.*
12. **The last animal out is never a free tap.** It's called by voice, or Hannah Mami leads it in (a beat). This stops elimination. *Assumed: yes.*
13. **Nani says every line in all three stages for the first build** (Mum's voice exists), from her own bubble. Hannah Mami hosts silently: she points, waves the animals over, claps and leads one in, until her own lines are recorded. *Assumed: yes.*
14. **The evening is the same yard relit,** not a new scene. It's one camera, and the art bible's relight rule. *Assumed: yes.*
15. **Positions on the second visit; "you give the orders" on the third** (the goat obeys the child's verb, starting with *kha* ✓). That's your scope line, with the speaking flip from the research's top 10. *Assumed: yes.*
16. **The animal actor is the trip's one new engine piece,** built to be reused at the safari and the adoption centre. The template allows at most one new engine per trip. *Assumed: yes.*
17. **One goat look:** match the old goat poses and the `i1` road goat. The new art redoes whichever set you don't pick. *Assumed: keep the `i1` road goat (it matches the farm road you approved) and redo the poses.*
18. **The chick that runs back** is the evening's fixed joke. The egg stage keeps its own joke (the chick under the hen). *Assumed: yes.*
19. **The day is long in words:** about 55-60 takes for the farm day, double the template's first-visit figure. Your 21 Oct word is "keep animals home in for now, move it to a second farm day if the day is too long." I've kept home at dusk on the first visit and cut by **level** instead: each stage opens at L1 after Mum's first sitting (about 21 takes for these three stages), and L2-L4 open as later sittings land. The alternative is your own rule: home at dusk moves to the second farm day, saving about 9 first-sitting takes (the calls, go in, its frames, shed, coop, good night). *Assumed: keep it, split by level.*
20. **Art in two blocks** (L1-L2 first, then L3-L4 and the second visit), Hannah Mami after her likeness run, and a grey-box layout lab before either. *Assumed: yes.*
21. **The photo in the order card's row** is asked of the shared-layer owner as a shared feature, not built in the farm. *Assumed: yes.*

**Open questions that are genuinely yours** (the build goes ahead on the recommendation unless you say otherwise):
- **Snap's rebuild, your 14 Oct list** ("undecided until Snap is rebuilt"). This is that rebuild:
  - **The darkroom** (the children develop the photos, then place each in the right place in the book with Nani). *Recommend:* not on the farm's first visit (the photos go straight to the book's farm page); the darkroom as the book's "stick in the photo" page, or the farm's second visit.
  - **Instant camera or phone.** *Recommend:* an instant camera: the print slides out, which is the hand-in, and it leads into the darkroom later; a phone brings a screen into the scene.
  - **Young Nani in old photos.** *Recommend:* not a farm question; the book's, when it's redesigned.
- **Hannah Mami's likeness and voice** (open since 20 Oct). Until then, Nani does every line and the farm doesn't ship.
- **For Mum** (on the next sheet, not design choices): is *murgi* the live hen; is "come here (to a child)" how she'd call a goat; the present and plural forms in §1.

---

## 11. ChatGPT mock-up prompts

**Run order:** prompt 1 first. Once Zafar approves its yard, attach that image as the **first** reference of prompts 2, 3 and 4 (relit for 3), since a fresh run has no memory of the last. The people are **stand-ins, not likenesses** (caption for Zafar): Nani is from her locked s08 sheet; Hannah Mami is left out until her likeness run; the child in prompt 3 is a stand-in for the shared character layers. All UI (frame brackets, glows, bubbles, the mic) is code-drawn; where a mock-up shows a bracket, it's to judge the moment, and Zafar is told so.

### Prompt farm-animals-1: Feeding time (stage 5, L2)

The image should show the feeding moment, so Zafar can see the yard, the three animals with their troughs, and what the child taps (the basket, then a trough), with cobs that can be counted. Grandmother is a stand-in from her locked sheet; the lit boxes and glows are code-drawn and not shown.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: a sunny farmyard seen at eye level, front on. A simple wooden rail fence and a soft green field with a few round trees behind; a small whitewashed shed with a wooden door at the back right, partly cropped. The sky is only a thin strip at the top. On the ground in the middle, three animals stand behind their own low wooden troughs: a cream-and-tan she-goat with small curved horns at the front left, a russet hen with three fluffy yellow chicks at her feet at the front right, and a brown-and-white cow standing a little further back between them, slightly overlapped by them, with its trough behind theirs. In the bottom-left corner of the play area sits a woven basket full of yellow corn cobs. At the right edge, cut at the chest, stands the grandmother from the attached character sheet, turned three-quarters toward the animals, smiling warmly. No other people.

The moment: the child has just tapped the basket, then the goat's trough. Two corn cobs lie clearly separate in the goat's trough; the goat leans in with wide delighted eyes, its beard wobbling, about to munch. The other two troughs are empty. No glow, outline or highlight on anything.

Style: match the attached references. A stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (wood grain, woven straw, glossy corn kernels), soft contact shadows under every animal and trough. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters or numbers anywhere: none on the basket, the troughs, the shed or the fence.

Must read at phone size (about 740x320 pixels): each animal's face and body, which trough belongs to which animal (the cow's trough behind), the two separate cobs in the goat's trough, and the basket of cobs.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/m1-farm-mid-fields-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt farm-animals-2: The photo shoot (stage 7, L2)

The image should show the verb game: the goat doing the asked action at one of four places, inside the camera frame, at the click. It explains "make it do it, then snap". The brackets are code-drawn in the game; they're shown here only to judge the moment.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: the same farmyard as the first attached image, at midday, eye level, front on, with a thin strip of sky, a wooden rail fence and green fields behind. Around the yard are four clearly different places, spaced well apart: on the left a low wooden trough with corn cobs; in the middle a round steel bucket of water; on the right a bed of golden straw under a small wooden awning; at the back an open wooden gate onto the green field. A russet hen pecks quietly in the background. At the right edge, cut at the chest, the grandmother from the attached character sheet holds a simple boxy instant camera at chest height, smiling.

The moment: the child tapped the water bucket, and the cream-and-tan she-goat has trotted over and is drinking, water dripping from its beard. Around the goat are four soft rounded gold corner brackets, plain lines only. The child has just tapped inside them: a soft white camera flash bursts, and the goat has lifted its head to look straight into the lens with a cheeky, pleased face.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (steel bucket, wood, straw, water), soft contact shadows. No outlines, no cel shading, no photorealism, no depth-of-field or motion blur.

Absolutely no text, letters or numbers anywhere, including on the camera and the bucket. No readouts, symbols, bars, dots or icons inside or around the corner brackets: no REC, no battery, no counters, no focus marks.

Must read at phone size (about 740x320 pixels): the goat's action (drinking), the four places as four distinct shapes, the gold corner brackets, and the goat's look into the lens.

References to attach (first: Zafar's approved yard from prompt 1):
[the approved yard image from prompt farm-animals-1]
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt farm-animals-3: Home at dusk, calling (stage 9, the speaking moment)

The image should show the speaking moment, so Zafar can judge whether "call it and it comes" reads without words: the child at the gate and the called animal trotting over. The child is a stand-in for the shared character layers; the mic bubble is code-drawn and left out.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: the same farmyard as the first attached image, relit for golden evening, eye level, front on. Low warm orange sun from the left, long soft shadows to the right, a peach-and-gold sky strip. At the back, a small whitewashed shed with its wooden door open and a warm lamp glow in its little window; beside it, a small wooden hen-house with a ramp. A russet hen is just walking up the ramp, with three yellow chicks following in a neat line, and the last chick hurrying back with a single corn kernel in its beak. In the yard, a brown-and-white cow stands sleepily. At the front right, by an open wooden gate, stands a small child of about five in simple modest clothes, holding up one corn cob, facing the animals, mouth open as if calling; beside the child, turned toward them and smiling, the grandmother from the attached character sheet. The sky above the child's head is empty.

The moment: the child has just called, and the cream-and-tan she-goat has turned with its ears up and is trotting happily toward the child and the corn cob, one hoof lifted.

Style: match the attached references. A stylised 3D animated-feature look, warm golden-hour light, gentle global illumination, chunky simplified shapes, clean surfaces, soft contact shadows. No outlines, no cel shading, no photorealism, no blur.

Absolutely no text, letters, numbers, speech bubbles, icons or symbols anywhere.

Must read at phone size (about 740x320 pixels): which animal is coming (the goat), the child with the corn cob, and the shed door with its glowing window.

References to attach (first: Zafar's approved yard from prompt 1):
[the approved yard image from prompt farm-animals-1]
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a2-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png
```

### Prompt farm-animals-4: The photo shoot at L4 (look-alikes)

The image should show how the harder level looks different: two goats, big and small, with the small goat mid-leap in the frame in mid-field and the big one watching. Only the word picks which goat. (The hen groups are prompt 2's kind of scene and are left out here.)

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: the same farmyard as the first attached image, at midday, eye level, front on, a thin strip of sky, a wooden rail fence, an open wooden gate onto a green field at the back. On the left, a big cream-and-tan she-goat stands by a low wooden trough of corn cobs. A round steel bucket and a bed of golden straw under a small awning sit on the right, with nobody at them.

The moment: the small cream-and-tan goat (clearly the same kind as the big one, about half its size, with a younger face) has raced back through the gate and is caught mid-leap in the middle of the yard, all four hooves off the ground, at the same depth as the big goat so their sizes compare. Around the small goat, four soft rounded gold corner brackets, plain lines only, with clear space between the goat and the brackets; a soft white camera flash bursts. The big goat watches it with a surprised face.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, soft contact shadows on everything touching the ground and a shadow on the ground under the leaping goat. No outlines, no cel shading, no photorealism, no motion blur.

Absolutely no text, letters or numbers anywhere. No readouts, symbols, bars, dots or icons inside or around the corner brackets.

Must read at phone size (about 740x320 pixels): the big goat and the small goat as clearly different sizes, and the leaping small goat whole inside the gold brackets.

References to attach (first: Zafar's approved yard from prompt 1):
[the approved yard image from prompt farm-animals-1]
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a2-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

---

## 12. Changes after the critique

Each finding from `farm-animals-critique.md` (1 Nov), then what was done.

1. **MUST: the feed's L1 model gave the asks away by elimination.** Done. The model's animal stays askable: it eats its cob, its trough is empty and it looks hungry again; the two L1 asks are drawn from all three, and the model's animal is random per round. L1 odds recomputed: 1 in 6 (was really 1 in 2). §3 A1, §4 feed steps 2 and 6.
2. **MUST: home at dusk L1 dropped Zafar's row 9 listening game.** Done. L1 now has one listening ask (goat or cow, 1 in 2, the place named) after the watched hen, and the last animal is the child's call. The recogniser's set is the three names at every rung, the pills show all three, and an animal already in peeks out and goes back (the joke). L4's "small goat, come here" is dropped to keep the set at three. §3 C1/C2, §4 home.
3. **MUST: the heard frames couldn't be built; *kha* ✓ is the imperative.** Done. A frame table in §1: each heard sentence, the forms it needs, what the repo has, what Mum records, and takes. *Kha* ✓ is now the third visit's speaking word. One correction to the critique: eat's present she-form (*khaiti*) and plural (*kenta*) are in the inventory, heard inside longer lines (no clip alone), so they still need takes. The total is about 44 takes, not "about 22 words". L3 feed's "Put grass in the hen's trough" became "Give the hen grass", which needs no word for trough.
4. **MUST: the photo shoot ticked at the shutter.** Done. Both options put to Zafar (decision 6); (a), the silent shutter and the hand-in from his own Snap quality pass, is assumed. A retake counts as a hint for moving up, and each bot's win is written as "a round that would count towards moving up", under 10% from L2 (about 3% feed, 4% photo). §3 B1, §4 photo, §6.
5. **MUST: the count-close rule reversed principle 4 from inside this design.** Done. Decision 5 now says it reverses his 21-22 Oct principle 4 for counts and why; it changes `easy-to-play.md` only on his yes. The stillness time is lab-tested at 3 s and 4 s, in `data/rules.json`. The take-back is a tap on the cob. The "or the next tap" close is dropped: a step has one live ask, so there is nothing to turn to.
6. **MUST: miscited decisions 6 and 9; the darkroom was parked on Zafar's behalf.** Done. Both citations removed ("no 'no' asks" now gives its reason). The darkroom, instant camera or phone, and young Nani are open questions in §10 with recommendations (first visit straight to the book; the darkroom as the book's "stick in the photo" page or the second visit; an instant camera).
7. **MUST: C2 can't run until Mum records the names and calls; order her sheet.** Done. C2 is gated on them (never device-spoken); until then Hannah Mami leads the last animal in. "Mum first" in §9 gives her sheet in the critique's order, with *murgi* (live hen or only "chicken"?) as the first question.
8. **SHOULD: the photo shoot's L1 skipped the animal words and the delight.** Done, the critique's second option: L1 is eat and run with the goat, so the leap is the first round's reward; drink and sleep (and the hen) join at L2. Row 7's noun asks map onto L2-L4; the nouns-at-L1 alternative is in decision 2. Reason for not taking nouns at L1: verbs are the stage's whole point, and feed has just given the names three hearings each.
9. **SHOULD: Hannah Mami's voice contradicted itself.** Done. Nani says every line from her own bubble; Hannah Mami is silent and gestures until her own lines exist (decision 13, §3 "Who speaks", §2, §4).
10. **SHOULD: the model carried a cob across the screen.** Done. The models show the two taps as lit boxes; Hannah Mami points, never carries (§4 feed step 2, photo step 2).
11. **SHOULD: "no text in the scene" contradicted the word ladder.** Done. Animals, foods and photo places carry the shared word pills by the ladder; the leak tables now say "no text past support"; the bots play with the pills earned.
12. **SHOULD: where Nani's lines live.** Done. One paragraph in §3: her ask in a bubble at her face (R3); the guide box says the step, no face (R4); the card's face is the animal.
13. **SHOULD: the phone layouts didn't add up.** Done. Play areas corrected (about 577 and 714 px); on phones the cow stands behind (depth, not width) and one person is on screen at a time, with the overlapped pair as the fallback. A grey-box lab at the four sizes plus the Z Fold comes before any art run. I kept the basket in the play area rather than the side panel: the panel is the shared cards' surface (non-negotiable 6), and 70 px fits once the cow is behind.
14. **SHOULD: the first art run was too big.** Done. Block 1 (L1-L2) and Block 2 (L3-L4, second visit), then Hannah Mami after her likeness run (§7, decision 20). Block 1 follows the critique's list, plus the goat's eat (the trough) and the evening relight.
15. **SHOULD: the ChatGPT prompts.** Done. (a) A run order: prompt 1 first, its approved yard attached first to 2-4. (b) Hannah Mami left out; Nani's reference is the locked s08 sheet and line-up, not the Cook sheet; the child is captioned as a stand-in and described plainly. (c) Prompt 4 drops the hen groups; the small goat leaps mid-field at the big goat's depth. (d) "No readouts, symbols, bars or icons" in prompts 2 and 4; the mic bubble taken out of prompt 3. (e) The painted glow taken out of prompt 1; each prompt's note says what is code-drawn. Prompt 1 also uses the new depth line-up, and prompt 2 is labelled L2 (four places).
16. **SHOULD: C1's take-back was impossible once a hen was inside.** Done. Tapped hens gather at the foot of the ramp and go up together when the count closes; a tap on one sends her back.
17. **SHOULD: cap the bonus photos.** Done. One a round (decision 7).
18. **SHOULD: the recording total was understated; the day is over the cap.** Done in part. The day's total is given (about 55-60 takes) and split into sittings by level. I did not assume the critique's move of home at dusk to the second visit: Zafar's newest word (21 Oct) is "keep animals home in for now", and the level split already brings the first sitting to about 21 takes for these stages. His own "move it if the day is too long" is the alternative in decision 19.
19. **SHOULD: the asset list, the bots' win, and the shared order card.** Done. An asset table per mini-game (§6); each bot's win written in §3 and §6; the photo-in-the-row put to the shared-layer owner as a shared feature (decision 21), with a play-area tray until then.
