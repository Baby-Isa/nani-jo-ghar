# Hannah Mami's pet hotel: look after the animals (slug: adoption-centre)

**Renamed (Zafar, 1 Nov):** the adoption centre is now **the pet hotel**: families leave their pets with Hannah Mami and come back for them. The file name stays `adoption-centre.md`.

Designed overnight, 1 Nov 2026, while Zafar slept, and revised the same night after an independent critique (`adoption-centre-critique.md`; what changed is §12). He asked for every game to be designed alone, on his likely answers. Every choice he hasn't made is in §10, numbered, so he can reverse it. Design only: no code, no data and no other doc changed.

Kutchi here is only what is in the repo (`data/lang/lexicon.json`, `build/reports/research-word-inventory-2026-10-31.csv`). **✓** means a family clip of the word or the whole line. "Inside lines" means Mum says it only inside longer recorded lines. "In engine" means the engine has it but nobody has recorded it. "To record" means the repo has no Kutchi for it. Nothing is invented.

Sources, newest first:
- Zafar's answers of 1 Nov at the foot of `build/reports/games-master-map-2026-10-31.md`: include dogs (answer 8). The adoption centre's row (now the pet hotel), Part 2 (pets), Part 3 (eat, give), Part 7 (its own day, next to the farm).
- `build/reports/game-settings-map-2026-10-31.md`: row 15 and his note ("a bee, an ant and others to feed and look after; funny; not a vet").
- The scope for this design: a bee, an ant, a rabbit, a cat, a bird, a tortoise and dogs. Feed, wash, brush, a bed. Needs are shown open (never a visibly dirty pet), so the said need decides. Each animal can take several cares. No animal suffers while the child is away.
- The research of 31 Oct: other games §7 and the cross-cutting lessons; mechanics findings 1, 2, 3 and 5; the audit of our games (§5, "say it, Ali acts").
- `lessons-checklist-2026-11-01.md`, the rulebook's level ladder, `speaking.md`, the art bible §1-3.
- Tonight's sibling designs, kept consistent: `farm-animals.md` (Hannah Mami's look, the farm road, the call), `party-gifts.md` (the shared **give-to** tap), `party-guests.md` (the feeling words hungry and tired, and the new family's art), `safari.md` (Hannah Mami's other day).

---

## 0. One line

| | |
|---|---|
| **What it is** | Hannah Mami runs a little animal centre, where families leave their pets for the day. The families are coming back this afternoon, so every animal must be ready: fed, washed, brushed and tucked in for a nap. Hannah Mami says what each one needs. The child picks the care and the animal, then does it with their own hands. A dog shakes water over the screen, an ant carries a corn cob far too big for it, and a bee turns into a fluffy pompom. At the end, a family comes back for its own pet, and the same animals are there again next visit (§10, decision 7: the roster rule). |
| **Day** | Its own day, next to the farm. The same road and the same host, but not the same day. |
| **Status** | New → designed (this doc), revised after the critique (§12). Not agreed. Nothing built. |
| **Engines** | **Give-to** (new and shared, from `party-gifts.md`): tap the thing, then the one it's for. The **heal-game pattern** (built in the clinic): a short hands-on action on a close-up. The shared kit (order card, guide box, light, end screen) and the one shared **"say it, Ali acts"** speaking moment. No new engine: the four cares are four short heal-game-style actions, each a data entry. The master map placed this game on put-it-in-its-place plus a needs card; this design swaps to give-to plus the heal pattern (§10, decision 22). |
| **Rough size** | **Medium to large.** The code is about one builder sprint once give-to exists. The art is the big cost: about 88 new cells for visit 1 (five animals, the small rabbit, new poses for Hannah Mami, Ali and the family, props and effects; §7), the largest art run of the overnight set. **Recording is the blocker:** of the 4 deciding words at L1, none has its own clip, and the whole game needs about 30-60 takes from Mum (§1, the frame table), about 10-14 of them for L1. |

---

## 1. The language goal

**Word groups:** pets and small animals (main); care verbs (main); feelings: hungry and sleepy (supporting; hungry comes back from the party); numbers 1-3 on the corn only, and big and small (woven); praise words (coming back).

**Why this game exists:** it is the only home for the care verbs (feed, wash, brush, put to bed), and the only game where the verb, not the noun, decides the move from the very first ask. Every animal can take every care, so the heard verb picks the tool.

### The words it teaches

Visit 1 has five animals (dog, ant, rabbit, bee, cat); the tortoise and the bird join on visit 2 (§5, §10 decision 5).

| English | Kutchi in the repo | Status | Decides a move in |
|---|---|---|---|
| dog | *kutro* (a he-word in the lexicon) | inside lines (1); confirmed | every care, the family (from L1) |
| ant | none | to record | every care, the family (from L1) |
| rabbit | none | to record | from L2; the L4 look-alike pair |
| bee | none | to record | from L2 |
| cat | none (only the names *Simba* and *Zazu*, in engine) | to record | from L3 |
| tortoise | none | to record | visit 2 |
| bird | *chakli* (a she-word in the lexicon; check with Mum: it may mean sparrow) | inside lines (1); confirmed | visit 2 |
| corn on the cob | *makai* | **✓** (alone) | the counted food (L2+), as on the farm |
| big | *wadho* | inside lines (30) | L4 look-alikes |
| small | *nindho* | **✓** | L4 look-alikes |
| one, two, three | *hakro/hakri, ba, trae* | in engine or inside lines; none has its own clip | L2+ cobs only |
| hungry | none | to record (the party needs it too) | L3 |
| sleepy | none | to record (ask Mum whether it is the party's "tired"; if one word, one sitting serves both) | L3 |

**Dropped after the critique:** *scoop* (no Kutchi; the farm also dropped it for *makai* ✓), *times* (no Kutchi in the engine; the clinic's ear, boing and hair games still use an English placeholder) and *bath* (nowhere in the repo). Food, bed and basket are never heard as words: the tools are pictures.

### Its verbs

| Verb | Kutchi in the repo | Status | Where |
|---|---|---|---|
| feed | none | to record | the feed care (L1) |
| wash | *dho* | inside 1 line ("wash the glass, wash the cup", ✓ whole line, draft) | the wash care (L1) |
| brush | none (the clinic's tooth game uses an English placeholder) | to record | the brush care (L2) |
| put to bed / sleep | none | to record | the bed care (L2) |
| eat | *kha* | **✓** | heard: "eat!" as the animal eats, from L2 (one line a moment: §4) |
| give | *de* | inside lines (18) | not needed: the L2 count frame is "{n} corn for the {animal}" (the farm's "{x} *lai*" frame) |

The form is the bare command to a child, as Nani uses it. The child says the same form to Ali at the speaking moment.

### The frames: what each heard sentence needs (non-negotiable 2: the engine can't say any of these today)

As on the farm: each frame is recorded by Mum as a whole, natural sentence, **once with each animal**, so the animal slot (and whatever object form, gender or agreement it takes) is cut from her own takes. The engine never guesses a form. **Takes** counts what she records for visit 1's five animals; "(L1: n)" is the part L1 needs.

**One saving to test first:** if Mum's first two animals show that the animal's form inside the frame is the same as the word alone, the engine can swap the slot from the words-alone takes, and each frame drops to one take. The worst case and the saving are both given.

| # | Heard (English) | Stage, level | The forms it needs | What the repo has | Mum records | Takes (worst / with the saving) |
|---|---|---|---|---|---|---|
| N | the animals alone; also the arrival line ("A dog!") and the word card | everywhere | dog, ant, rabbit, bee, cat | *kutro* inside 1 line; the rest none | each alone | 5 / 5 (L1: 2) |
| C | "Feed it." "Wash it." "Brush it." "Put it to bed." | the word cards; **the speaking pills' recogniser templates** and the rung-1 model (`js/shared/speech.js` matches the family's own takes) | the bare command to a child, with "it" if Mum uses one | *dho* inside 1 line; the rest none | each alone | 4 / 4 (L1: 2) |
| F1 | "Feed the {animal}." | feed, L1+ | feed, command to a child; the animal in Mum's natural object form | none | the frame with each animal | 5 / 1 (L1: 2) |
| W1 | "Wash the {animal}." | wash, L1+ | as F1 | *dho* inside 1 line | the frame with each animal | 5 / 1 (L1: 2) |
| B1 | "Brush the {animal}." | brush, L2+ | as F1 | none | the frame with each animal | 5 / 1 |
| S1 | "Put the {animal} to bed." Also the watch: "Ali, put the {animal} to bed." | bed, L2+; the watch, L1+ | as F1; Ali's name before it | none | the frame with each animal; "Ali" in Mum's voice once | 5 + 1 / 1 + 1 (L1: 3) |
| F2 | "Two corn for the rabbit." | feed count, L2+ | the number alone; *makai* ✓; the farm's "{x} *lai*" frame (recorded) with each animal | *makai* ✓; "{x} *lai*" ✓; numbers inside lines | the frame with each animal; one, two, three alone (shared with the farm's F2: recorded once) | 5 + 3 / 1 + 3 |
| NA | "Brush the dog, not the ant." | L2 | *na* ✓; the second animal in the "not" form | *na* ✓ | the pattern once, then swapped from N | 2 / 2 |
| H | "The {animal} is hungry." | feed, L3 | whatever construction Mum uses (a he and a she form, or a "to the {animal}" form): her take with each animal settles it | none | the line with each animal | 5 / 2 (one he-animal, one she-animal, once their genders are known) |
| T | "The {animal} is sleepy." | bed, L3 | as H | none | the line with each animal | 5 / 2 |
| HC | "Tell Ali!" | the handover, L3+ | | none | the line | 1 / 1 |
| FA | "We've come for the {animal}." | stage B, L1+ | come, past or present, "we"; "for the {animal}" (*lai*) | *achenta* inside lines; *lai* inside 6 lines | the line with each animal | 5 / 1 (L1: 2) |
| L4 | "the small rabbit", "the big rabbit" (inside F1, W1, B1, S1, FA) | L4 | *nindho* ✓ or its agreeing form; *wadho* | *nindho* ✓; *wadho* inside lines | each phrase alone; each care frame with it if the slot won't swap | 2-10 / 2 |
| D | "Hannah Mami needs help with the animals today." | the door | | none | the line, in Mum's word for the pet hotel (to record) | 1 / 1 (L1: 1) |
| — | *kha* ✓, *shabash* ✓, *ha* ✓, *na* ✓, *makai* ✓, *nindho* ✓ | come back | | ✓ | nothing | 0 |

**Cut from the first draft:** "Look, a {animal}!" (the animal's name alone is the arrival line: N), "Wash the bee three times" (no "times"), "the dog wants a bath" (no "bath"), "the bee's fuzz is all messy" and the L3 riddle at the door (§3, stage B). If Mum has a natural way to say a clean animal wants a wash, or a scrub count, it is a visit 2 line, never a gate.

**The honest total:** about **59 takes** in the worst case (L4 at 2), or about **30** if the slot swaps cleanly (about 26 if the farm's numbers are recorded first), against the first draft's "14 words and about 10 lines". By level, worst (with the saving): **L1 14 (10)**: N dog and ant, C feed and wash, F1 and W1 for dog and ant, S1 for the watch plus "Ali", FA for dog and ant, the door line; **L2 25 (11)**; **L3 18 (6)**; **L4 2**. The farm notes 15-25 takes as the template for a first visit, so L1-L2 is the first sitting and L3-L4 the second (§6, Mum's sheet).

**The deciding words and how many are recorded** (lessons §1): L1's four deciders are dog, ant, feed and wash. **None has its own clip (0 of 4).** *Kutro* and *dho* are only heard inside lines. Until Mum's round, the game plays with grey English, which a reader wins outright. So it counts as teaching only once these are recorded, and the leak bot plays recorded rows only.

### Frames said

One closed set of three bare commands to Ali (the C takes), with a picture pill under each. **Which three is picked after Mum records all four** (feed, wash, brush, put to bed), by which sound most different from each other (research-mechanics finding 3: 2-3 options that sound different); until then the design assumes **wash it / brush it / put it to bed** (§10, decision 14). The recogniser matches against Mum's own takes, so the speaking moment can't run, or be tested, until C is recorded; it is never device-spoken (an English model would have the child speaking English, non-negotiable 3).

### New words per level

| Level | New words | What they are |
|---|---|---|
| L1 | 4 | dog, ant, feed, wash |
| L2 | 4 | rabbit, bee, brush, put to bed (corn ✓ and the numbers 1-3 come back from the farm) |
| L3 | 3 | cat, hungry, sleepy |
| L4 | 0-1 | big comes back (from Cook and the farm), small ✓ |

Every new word is heard at least three times in a round (the ask, the replay and the reaction line). Its Kutchi shows on the card until it has been picked right three times in a row.

---

## 2. Where it sits in its day

A short trip next to the farm. It is the same road and the same host, so it feels familiar, but the job is new: caring, not farming.

| # | Stage | Engine | What the Kutchi decides | Carries |
|---|---|---|---|---|
| 1 | The door | door (built) | "Hannah Mami needs help with the animals today" (to record, D) | the reason to go |
| 2 | The ride | window ride (built), the farm road reused | which passing thing Nani names; the farm's goat and hen come back, and the ride's built **dog and bird** sprites (`assets/day/ride/s09r/dog.webp`, `bird.webp`) are named on the road before the centre | farm animals come back; the dog heard before it is met |
| 3 | Meet Hannah Mami | Conversations (built), as on the farm day | the greeting, the elder form | — |
| 4 | **A. Look after the animals** | give-to + heal-game actions | which care (L1), which animal and how many corn (L2+) | which animals were cared for |
| 5 | **B. Going home** | give-to (one move) | which pet the family has come back for | the pet that goes home; its photo |
| 6 | Home | — | — | a little brush for Simba |
| 7 | The evening book | book (built) | "who did we wash?" | the pet's photo at home with its family |

**No bag stage on visit 1** (§10, decision 4): the trip is half a day, close by, and the farm day already teaches the bag.

**Into the game:** at the door, Nani holds up a photo of the pet hotel: animals peeping out of their little homes. In the ride, the farm goes past ("look, the farm!"), so the child knows where they are.

**Out of it:**
- One pet goes home with its own family. The book shows it there, happy: a garden, a sunny window, the girl hugging it.
- **The thing for home:** Hannah Mami gives the child a soft little brush "for Simba". On a later home day, Simba and Zazu can be brushed with it (an idea for the home day's later visit, not designed here).
- **Words carried on:** hungry comes back at the party (look after the guests); "put to bed" and sleepy come back at the school day's wake-up clock; feed and corn come back at the farm.

**The roster rule (§10, decision 7; critique finding 1; Zafar, 1 Nov: yes, "families come back for their pets, and the pets are fun").** The place is **the pet hotel**. The animals are pets whose families leave them with Hannah Mami for the day. At the end of each round one family comes back for its own pet; the others stay, play and nap until their families come later. **Next round and next visit the same animals are there again** ("look who's here again!"), so the level pools hold: the dog and the ant are always there for L1, the rabbit pair for L4, and nobody ever loses an animal they have just cared for. Each round's family is drawn from the party's people; until the party has more than one family drawn, Zara and her mum come every round (they have a lot of pets: a running joke Hannah Mami can smile at).

**No animal suffers while the child is away** (NN7). There are no needs meters, nothing gets hungrier over time and nothing decays between visits. Each visit starts with every animal bouncing and happy: "they've been playing all morning!" The cares are fresh wants, never neglect. The animals still there at the end of the round are asleep in their beds, and Hannah Mami looks after them until their families come.

---

## 3. The stages and mini-games

### The scene (one camera, eye level, art bible §3 "E")

A bright, airy room at the centre, with limewash walls, a big window onto the farm fields and one nod of Kutch (a small ajrakh cushion in the dog's basket). Along the back wall are the animals' little homes: a dog basket, a hutch, a bee box with a flower pot, a glass ant house and a cat cushion (visit 2 adds a bird perch and a straw box for the tortoise). Between the homes, at the back centre, is the front door the families come in by.

In front is a long low wooden **care counter**, the stage. On it are one, two or three soft round **mats** where the animals sit to be cared for. Along the counter's front edge sit the **four tools**, always all four, always in the same places, in F view:
- **the corn basket**: a small woven basket of corn cobs, with a steel bowl beside it;
- **the tub**, a small enamel basin with a sponge and a rinse jug;
- **the brush**, a soft wooden one;
- **the bed**, a little woven basket with a cushion and a folded blanket.

Hannah Mami stands at the right, cut at the chest. Ali joins in the middle-right at the speaking moment. The left is kept for the side panel's cards. Stage B has its own layout (below and §7).

### The shared gesture: tap the tool, then the animal

Every care starts the same way. This is the shared **give-to** tap: the thing, then who it's for. The animal then hops, crawls or flies to the tool (the child never picks up the bee or the ant: §10, decision 9). Then each care has its own short hands-on action, as in the clinic's heal games. **Undo:** tap the tool again before the animal is tapped, and it goes back. Inside the feed care, a cob in the bowl can be tapped to take it back until the closing tap (the take-back is on the thing in the bowl, not the basket).

### Stage A. Look after the animals: four cares

Each care is one mini-game. A round mixes them (lessons §12, no fatigue). **At L1 the two cares are drawn at random, repeats allowed;** from L2 a care is not asked twice in a row, except that one ask in four may repeat the last care (critique findings 5 and 9: a strict no-repeat with two cares is alternation, and with four it lets the Sceptic drop a care).

#### A1. Feed

1. **What do you do?** Tap the corn basket: one cob drops into the bowl. From L2, tap it again for each extra cob; each one lands in the bowl with a soft thud and is counted on the bowl (the count sits on the thing counted). Tap a cob in the bowl to take it back. Then tap the animal: it trots up and eats. **The closing tap is the animal.** There is no Done button. Score 5.
2. **Challenge and the Kutchi:**
   - L1: the verb picks feed over the other cares (one cob, not counted).
   - L2+: the animal word picks who, and the number picks how many cobs ("Two corn for the rabbit": F2). Two words per move, and the number really decides (the count rule below).
   - L3: "the rabbit is hungry" means feed it (H).

   Score 4.
3. **The fun:** each animal eats in its own way.
   - The dog wolfs it down and spins after its tail.
   - The rabbit nibbles the cob like a typewriter, ding at the end of each row.
   - **The ant** disappears under the cob, then lifts the whole cob over its head and staggers off with it.
   - The bee hugs the cob and sips politely, and its wings buzz faster.
   - The cat bats the cob round the bowl first, then eats.

   Score 5.
4. **Instruction:** Hannah Mami, on screen, says it first ("Feed the dog"). Then the card pops up big (the dog's face plus the care) and flies into its row. The guide box gives the current step in family Kutchi. Score 4.
5. **What is novel?** It is close to the farm's feeding (corn, give-to). What's new: the verb decides at L1, and from L3 a feeling decides it. Score 3.

**Total 21.**

**How a count closes (Zafar, 1 Nov, reversed after his chai play; one rule for every game):** a count ticks the moment the right number is reached, and an extra tap doesn't land. No stillness timer, no waiting on the natural next thing: the animal still comes to eat when tapped, but that tap is its own move, not what closes the count. This replaces the stillness close he gave earlier the same day and restores `easy-to-play.md` rule 4 (a count ticks at the right number) for every game.
- **Taps land only up to the number asked,** and the count ticks at that number (the bowl is still drawn big enough for five cobs, so its size says nothing). An extra tap does not land.
- **There is no wrong-size count now:** too few is just not yet ticked (the ask can be repeated, free), and too many cannot land. The take-back is still a tap on a cob in the bowl until the animal is tapped. The funny misses stay for a wrong animal or a wrong care.
- **A plain row** still follows a wrong animal or care and the helper, and a round with a plain row doesn't count towards moving up (Zafar, 1 Nov: level up only on right-first-time rounds). The word's ladder moves only on a first-go gold row. **Leak note:** by Zafar's choice (1 Nov), the count can be won by tapping until it ticks; which animal and which care still decide every move, so the two words still carry the row.
- **The bot** taps until the count ticks, so the count is always right for it; a wrong animal or a wrong care is its miss.

**Levels:**
- L1: one animal on the mat; feed or wash said; one cob, one tap, then the animal.
- L2: 2-3 animals; 1-3 cobs said.
- L3: "the {animal} is hungry".
- L4: look-alikes ("feed the small rabbit").

#### A2. Wash

1. **What do you do?** Tap the tub, then the animal: it hops (or crawls, or flies) into the tub. Tap the animal to scrub: each tap makes a puff of bubbles. Then tap the rinse jug: water pours over it, and the animal shakes. **The closing tap is the jug.** At L1 it is one scrub, then the jug lights (the light shows the next step of a care already chosen, never which care). From L2 the child scrubs as much as they like (the bubbles pile up, which is the fun) and the jug is live after the first scrub. **Scrubs are never counted or heard:** "three times" has no Kutchi (§1). Score 5.
2. **Challenge and the Kutchi:**
   - L1: the verb.
   - L2+: who, and which care.
   - L3-L4: as L2, with the look-alike at L4. A natural "wants a wash" line from Mum is a visit 2 extra, never a gate.

   **The animal is never dirty, before or after.** The bubbles only come from scrubbing. Score 4.
3. **The fun:**
   - **The dog's shake** sprays droplets at the screen. They run down the glass and clear by themselves.
   - The rabbit's ears spin like propellers as it shakes.
   - The ant does backstroke in a swim ring.
   - The bee wears a tiny shower cap.
   - The cat sits in the bubbles with a very offended face, then shakes one paw at a time.

   Score 5.
4. **Instruction:** as A1. Score 4.
5. **What is novel?** It is the only bath in the game, and the shake is the signature moment. Score 4.

**Total 22.**

**Levels:** as A1, without a count.

#### A3. Brush

1. **What do you do?** Tap the brush, then the animal. The camera eases in a little (a gentle zoom of the same scene). A single channel runs along the animal's back, the brush at one end; **the brush moves only along the channel**, the tooth game's brush track (Sprint 11, Zafar, 21 Oct: one arm of its plus) and pulled to the end it snaps back. **One swipe, end to end, is one stroke** (hair's rule). Three strokes, not heard and not counted by the child; the step closes when the third ends. The channel is the shared track, drawn by code, never art (lessons §2, §7). Score 4.
2. **Challenge and the Kutchi:**
   - L2: the verb and the animal.
   - L3-L4: as L2, with the look-alike at L4. (The first draft's "the bee's fuzz is all messy" is cut: it needs a line Mum hasn't said, and "messy" hints at a state the screen never shows.)

   Score 4.
3. **The fun:**
   - **The bee** puffs up into a round fluffy pompom and does a waggle dance.
   - The rabbit's ears fluff up and flop.
   - The cat goes boneless and slides along the counter with the brush.
   - The dog rolls over for more.

   Score 5.
4. **Instruction:** as A1. On its first-ever stroke, the track holds in the green: it can't go wrong (lessons §2). Score 4.
5. **What is novel?** It is the one drag gesture in the day; it is calm and satisfying. Score 4.

**Total 21.**

**Levels:**
- L1: not used. Two cares only at L1.
- L2: the brush arrives.
- L3: as L2.
- L4: look-alikes.

#### A4. Bed

1. **What do you do?** Tap the bed, then the animal: it climbs into the basket. Tap the blanket: it tucks itself over the animal. The animal yawns, curls up and sleeps. A soft rising bubble (a drawn sleep cloud, no letters) floats up, and the light dims gently on that mat. **The closing tap is the blanket.** Score 4.
2. **Challenge and the Kutchi:**
   - L2: "put the rabbit to bed".
   - L3: "the cat is sleepy".

   **A sleeping animal stays askable** (critique finding 9). A later ask in the same round can be for it: it wakes with a huge stretch and a yawn, blinks, and is happy to be fed, washed or brushed, then curls up again. Bed is the only care not asked again of an animal already asleep. Score 4.
3. **The fun:**
   - **The ant in a bed fit for a dog**, tiny in the middle, with a snore far too big for it.
   - The cat kneads the blanket and purrs.
   - The bee sleeps tucked in a flower that closes over it (bees really do sleep in flowers).
   - The dog's leg twitches as it dreams.
   - Waking up is its own joke: the ant stretches all six legs at once.

   Score 5.
4. **Instruction:** as A1. Score 4.
5. **What is novel?** It is the calm beat after a busy care, and the bridge to the wake-up clock's "sleep". Score 4.

**Total 21.**

**Levels:** from L2, as A3.

#### The level ladder for stage A (each level adds one thing; the Kutchi gets harder, not the gestures)

| Level | What it adds | Animals in a round | Cares | Asks | The tools |
|---|---|---|---|---|---|
| **L1** | the core: the care verb decides | 2, one on the mat at a time (dog, ant) | feed, wash | 4: two per animal, each drawn feed or wash at random, repeats allowed (so each ask is a real 1 in 2) | all four are shown; only the right one and one clearly different decoy are lit and tappable |
| **L2** | which animal and how many corn; "not" said last; the card's English dotted | 3 on the mats at once, from dog, ant, rabbit, bee | all four | 5 | all four live |
| **L3** | other ways of saying it: hungry and sleepy, not commands | 3, cat added to the pool | all four | 5-6, plus Ali's turn | all live; the card shows the need's Kutchi and speaker only, once past support |
| **L4** | a look-alike pair: the big and the small rabbit | 3-4, the rabbit pair always | all four | 6 | all live |

**How each animal's cares are drawn:** at random, 1-3 per animal, never shown. The care order is random. Bed can come at any point, and a sleeping animal can still be asked for another care (it wakes). From L2, the last care is repeated in about one ask in four.

**Levelling:** level up after 3 right-first-time rounds (every row gold), Zafar's rule of 1 Nov; a plain row (closed after a miss or the helper) is progress but the round doesn't count; never level down (rulebook).

#### Stage A's leak test

**The Sceptic** knows no Kutchi and tries every trick at L2 and above. Here is each way she might win, and why it fails.

| Trick | How she'd try | Why it fails (the fix) |
|---|---|---|
| **Reading** | read the card; read grey English | The card shows the animal's face and the care's picture only while each word is supported. After that it shows the Kutchi text and a speaker, with the English dotted from L2. **Grey English is a reader's full win**, so the game counts as teaching only once dog, ant, feed and wash are recorded. The leak bot plays recorded rows only. There are no labels on tools or animals past support. |
| **Matching** | the animal looks hungry, dirty, sleepy or messy | **Never.** Every animal shows the same "happy, waiting" idle (bouncing, tail or wings going) until the care begins. There is no dirt, no yawn before bed, no tangles, and no eyes on the food. The tools never glow on their own. A tool's picture is on the card only while the word is supported. |
| **Eliminating** | the last animal or the last care is free; the sleeping one is done | At L2, 3 animals × 4 cares makes 12 options. A sleeping animal stays askable (only its bed care is off), and the last care can come again (one ask in four), so at any ask at least 9 options are open. Tools never run out and go back after use. The number of cares per animal is never shown, so "the dog's had two, so it's the rabbit" doesn't work. |
| **Patterns** | bed always last; feed first; alternation; the dog always gets washed; world knowledge (rabbit → feed) | The care order and the animals' places on the mats are random every round. Bed can come at any point. At L1 repeats are allowed, so the first ask says nothing about the next. Any animal can take any care, so world knowledge gives no edge. The tool shelf is fixed, but the answer changes, so a fixed place is not an answer. |
| **Waiting** | wait for a glow; tap until the count ticks | Nothing lights the answer by itself. The count ticks at the number (Zafar, 1 Nov): tapping until it ticks wins the count by choice, but never the animal or the care. After 7, 9, 11 or 13 s with no tap, the ask is replayed (free). The helper card, which shows the full answer, costs a bulb. |
| **Fishing** | try every tool until one works; tap cobs until it ticks | A wrong pick (tool, animal or care) gets a funny miss and the words again. The count itself is open by Zafar's choice (1 Nov): tapping until it ticks is allowed, so the word that decides is the animal and the care. The row then closes plain, never gold, after a miss; the word's ladder moves only on a first-go gold row, and a round with a plain row doesn't count towards moving up. After a second miss, Hannah Mami does it with the child (the helper's full answer, a bulb). Fishing finishes the step but never earns a gold row. |

**The bot's odds per ask** (the Sceptic avoids repeating the last care, which is right three times in four): about **1 in 9 to 1 in 12 at L2-L3** and **1 in 12 to 1 in 16 at L4** (4 animals × 4 cares), and a feed ask is a further 1 in 3 for the count. L1 is 1 in 2 with both words supported: a teaching level under the rulebook's L1 allowance, as in the clinic.

**The bot's win** (critique finding 14; the count no longer adds a factor, 1 Nov: the bot taps until it ticks, so a feed row's odds are those of its animal and care alone, never worse than the 1 in 9 used below): a round that would count towards moving up, that is every row gold (Zafar, 1 Nov: only right-first-time rounds level up); a plain row (a miss, then right) or the helper spoils it. Each ask allows two tries (the first miss is free and funny; the second brings Hannah Mami's help), but the second try only ever closes the row plain, so it never helps the bot climb. At L2, 5 care rows plus the family's row at 1 in 9 or worse: the chance of all six gold is about 1 in 531,000, far under 0.1%. L4 is smaller still. At L1, four asks at 1 in 2: all four gold is about 6%. **It must stay under 10% from L2**; the bot also reports gold rounds.

**What the end screen shows for a fished row:** the row closes with its animal and care picture filled in and a plain tick; a first-go row gets the gold tick and its word's ladder moves. There is never a cross or an empty row: plain means "done with help", which is progress, not a verdict (UX §11, NN7).

**Misses** (each different and funny, never a frown, never giving away the answer):
- The dog tries to eat the brush.
- The rabbit hops into the corn basket and peeps out.
- The bee sneezes at the bubbles and spins.
- The ant climbs onto the bed and slides off the blanket.
- The cat bats the bowl.
- No wrong counts now (the count ticks at the number): the funny misses are the wrong animal and the wrong care.

Then the shake, the word again, and the wrong tool slides back (lessons §5).

### Stage B. Going home

1. **What do you do?** The doorbell chimes. A family comes back for its pet: a mother and a girl of about five with a little carry basket. They say who they've come for. The child taps that animal. It hops into the girl's basket, and the girl hugs it (for the dog, see §10 decision 23). Score 3.
2. **Challenge and the Kutchi:**
   - The animal word decides (L1: 1 of 2).
   - L2: 4 animals come forward; L3: 5; L4: 5, the big and the small rabbit always among them ("we've come for the small rabbit").

   Score 3.
3. **The fun:** the goodbye. The pet does its happy trick one last time: the dog barks and wags, the bee loops in a heart-shaped path, the ant waves a leg. Then the family waves and leaves. Hannah Mami says "aah" and shows the word card. Score 4.
4. **Instruction:** the family speaks first, on screen, then their card pops up. Score 4.
5. **What is novel?** It is the served ending (lessons §5): the job ends with someone happy. Score 3.

**Total 17.** It is one move, kept short.

**Stage B's own layout** (critique finding 4). The homes row is too small to tap on a phone, so stage B never asks the child to tap a home:
- **The tools slide off the counter** (stage B doesn't use them).
- **The candidates come forward onto the counter in one line,** each at least 90 px tall on phones, the same size and the same "happy, waiting" idle. At most five: at 740x320 the play area is about 577 px wide, and 5 × 90 px plus four 12 px gaps is 498 px. Any animal not in today's set is "asleep in the back room" (its home's curtain drawn).
- **The family comes in by the door at the back centre** and stands behind the counter's middle, never at the crowded right edge. Hannah Mami steps out on phones and stands aside at the right on the big layouts.
- The lab proves it at the four sizes plus the Z Fold before the brief (§7).

**Levels:**
- L1: 2 animals (dog, ant).
- L2: 4 (dog, ant, rabbit, bee).
- L3: 5 (the cat joins). The family uses the same line as L2: the first draft's riddle ("the one that sleeps in a flower") is cut (critique finding 12). I did not take the critique's "the sleepy one" in its place: with one animal visibly asleep it is won by looking, not by the word.
- L4: 5, with the big and the small rabbit: "the small rabbit".

**Leak test:**
- **Reading:** no labels anywhere past support.
- **Matching:** the family never looks at the animal, and every candidate stands the same way.
- **Eliminating:** it is one ask among 2-5, with nothing removed: **the family can want the one just cared for, and the one in bed** (it wakes, stretches and yawns its way into the basket: a delight, not a rule broken).
- **Patterns:** the family's pet is drawn at random from all the candidates; the line-up order is shuffled.
- **Waiting:** nothing glows.

A blind guess is 1 in 2 (L1), 1 in 4 (L2), 1 in 5 (L3-L4). It is one row among six, inside the round-level bot win above.

**Whose family?** The pet's own family, collecting it (the roster rule, §2). The art reuses the party's new family (Zara and her mum, from the one party cast in `party-gifts.md` §0 and `party-guests.md` §3), so it costs no new people, only new poses (§7; §10, decision 6). Later, other party people can come for other pets.

### The speaking moment: Ali's turn (L3+; the one shared "say it, Ali acts"), rung by rung

Written to `speaking.md`'s ladder (approved 29 Sept), as the farm and party designs do (critique finding 7). It comes after the family has left, with the animals still on the mats.

- **The watch (L1-L2, every round):** Hannah Mami and Ali face each other, three-quarter on. Hannah Mami: "Ali, put the ant to bed" (S1 with "Ali"). Ali says *ha* ✓ and does it. The child sees the two-person exchange in every round, at least six times before the handover.
- **The handover (L3, the first time):** Hannah Mami hands the child her **clipboard** (pictures of the animals only, no text: the job of the one who gives the orders, as the doctor's clipboard in `speaking.md`). The child's avatar steps into her spot, Hannah Mami and Ali turn to face the player (UX §16), and the "your turn" bubble with the mic appears. The tools stay with Ali, because Ali is the one who acts.
- **Rung 1, say it after (L3):** Hannah Mami's need line plays ("The cat is sleepy. Tell Ali!", T and HC), then **her own recorded command** for it ("Put it to bed", the C take) plays, written and underlined in the child's bubble. The child says it after. Ali does exactly what the recogniser heard. No extra recordings: the model is the C take.
- **Rung 2, the words without the model (by the child's own record, not the level, per `speaking.md`; L4 at the earliest):** the need line plays, the pills show pictures and a speaker, and there is no model line.
- **The pills are always there:** three, each a picture with a speaker (which three: §1, "Frames said"). A tap on a pill counts as saying it.
- **The recast:** if what the child said isn't what the cat needed, Ali does what was said anyway (he washes the cat; it looks puzzled and yawns), and Hannah Mami recasts warmly: "Sleepy: put it to bed." Ali does that too. No verdict, never a gate, never against the clock, and it never blocks on recognition.
- **Recording:** in the prototype it plays with whatever takes exist and the device voice, and a tap on a pill counts as saying it (Zafar, 1 Nov: nothing waits on a voice). The recogniser's templates are Mum's takes of N, C, T, H and HC, recorded before shipping.
- **Leak:** speaking isn't scored by the bot. A pill is a play action, and the recast teaches.

### Maybe later (scored, parked)

| Idea | Fun / Kutchi / Novel | Total (of 15) | Why not now |
|---|---|---|---|
| Food choice (carrot, leaf, apple, seeds) | 4 / 4 / 3 | 11 | **Visit 2.** Food words are a good second layer once the cares are known. Every animal eats every food in this silly centre, so world knowledge doesn't leak. |
| Stroke it (a calm hold until it purrs) | 4 / 3 / 3 | 10 | Visit 2. It's a gentle "hold" gesture; one more verb. |
| Give it water (pour to the line) | 3 / 3 / 2 | 8 | A "stop at the line" control, which lessons §4 says to redesign; also overlaps Cook's pour. |
| Play ball (throw to the one named) | 5 / 3 / 3 | 11 | Visit 3. "Play" has no Kutchi in the engine yet; the party owns play. |
| Walk the dog (along a track) | 4 / 2 / 3 | 9 | It teaches little; one animal only. |
| Scrub counts ("wash the bee three times") | 3 / 3 / 2 | 8 | Only if Mum has a natural way to say "three times" (no Kutchi in the repo). |
| Medicine, nails, check-ups | — | — | **Cut.** Zafar: "not a vet". |

---

## 4. The child's first-ever round (L1), screen by screen

One example draw. At L1 each ask is feed or wash at random, repeats allowed, so this round's wash-then-wash across the dog and the ant is as likely as any other order. One line per moment (lessons §3).

1. **Arrive.** The room fades in, still. Hannah Mami waves (three-quarter pose) and says hello, in whatever take exists, else the device voice (voices are settled before shipping). Everything is dimmed except her.
2. **Show what isn't on the card.** The four tools light one at a time with their own sound, no words: the corn thuds into the bowl, the tub splashes, the brush swishes, the bed creaks with a yawn. A tap skips this.
3. **The first animal.** The dog bounds in and sits on the mat. The mat and the dog are lit. Hannah Mami: "A dog!" (N). Then: "Feed the dog." (F1). The card pops up big (the dog's face, the bowl picture, the Kutchi and a speaker) and flies into row 1 of the side panel.
4. **First tap (the tutorial).** Only the corn basket is lit, in a box that hugs it with a gold glow. Everything else is dim and can't be tapped. There is no finger and no ripple. The child taps it, and one cob drops into the bowl.
5. **Second tap.** The light moves to the dog. The child taps it. The dog wolfs the cob and spins after its tail. Hannah Mami: *shabash* ✓ (one line; *kha* ✓ is the line at the bowl from L2). Row 1 ticks gold.
6. **Wash, with one decoy.** "Wash the dog." Now the tub and the brush are both lit; the other two are dim. If the child taps the brush, then the dog, **the dog tries to eat the brush** (the funniest miss, and nothing like a wash), it slides back, and Hannah Mami says "Wash the dog" again. Once the child taps the tub, then the dog, the dog hops in.
7. **Hands on.** The dog is lit. One tap makes a big puff of bubbles; then the jug lights. The child taps it, water pours, and **the dog shakes**: droplets spray across the screen and trickle away. It's the first big laugh. Row 2 ticks.
8. **The funny one.** The dog trots to its basket at the back. An ant marches in, very small on the big mat. Hannah Mami: "An ant!" "Wash the ant." The ant does backstroke in a swim ring in the huge tub. Then "Feed the ant": it vanishes under the cob, then lifts the whole cob over its head and staggers off. Rows 3 and 4 tick.
9. **Going home.** The doorbell chimes. Zara and her mum come in by the door at the back centre. The tools slide off the counter, and the dog trots back to stand beside the ant, both big, in one line. "We've come for the dog." (FA). The child taps the dog: it leaps into the girl's basket, wags and barks goodbye, and the family waves. Hannah Mami: "aah", and the word card.
10. **The watch.** The tools slide back. Hannah Mami turns to Ali: "Ali, put the ant to bed." Ali says *ha* ✓, tucks the ant into the dog-sized bed, and it snores. The child only watches (the speaking ramp's watch step).
11. **The end.** The shared two-page end screen: progress (four rows ticked, the new words with their speakers), never a verdict. The dog's photo, at home with Zara, goes into the evening book.

The round takes about 3 minutes and asks 4 times plus the family.

---

## 5. Later visits and harder versions

- **Visit 1:** L1-L4 as above, with five animals (dog, ant, rabbit, bee, cat) and the small rabbit.
- **Visit 2, "dinner time":** the bird and the tortoise join the pool (their own L2-L4 asks; the tortoise's wash joke: it pulls its head in, then peeks out with a bubble on its nose; brushed, its shell shines like a mirror). The food shelf (carrot *gajar*, in engine, draft; apple *safarjan*, in engine, draft; leaf, to record; seeds, to record): every animal eats every food, and the food word decides. Also "stroke it" (the purr).
- **Visit 3, "a puppy day":** Zafar's dogs, in the plural. Three puppies stay for the day, look-alikes by size and colour (colours once Mum records them). "Play ball with the small puppy." The puppies tumble.
- **The child gives every order (a late level):** Hannah Mami takes a break. The child tells Ali every care from the pills, choosing from the needs Hannah Mami described earlier. This is role reversal as data.
- **Each visit, the book's gallery grows:** each round's pet at home with its family. Nobody is ever lost: the same animals are back at the centre next visit (NN7).

---

## 6. What it reuses, and what is new

| Reused | From | How |
|---|---|---|
| Give-to tap | `party-gifts.md` (new, shared; built once for the party and here) | tap the tool, then the animal; tap the animal for the family |
| Heal-game actions | the clinic (`js/clinic/heal/games/`, built) | **the brush's parents are the tooth game's brush track** (`tooth.js`: the brush moves only along a channel and snaps back; Sprint 11, Zafar, 21 Oct) **and hair's comb** (`hair.js`: one swipe, one stroke); the knee's taps for the scrub; the tuck is new and small |
| The needs table | `party-guests.md` §6 (`data/party/needs.json`: feeling → fix, its lines, the reaction poses, the wrong-fix reactions) | L3's hungry → feed and sleepy → bed use the same shape, so the game's feelings live in one table |
| Order card (gold and plain ticks), guide box, light, end screen, hints badge | `js/shared/` | unchanged (NN6) |
| "Say it, Ali acts" | `js/shared/say.js`, `speech.js` | one shared moment, new commands as data; Mum's C takes are the recogniser's templates |
| Door, ride, Conversations, book | built | the farm road reused, with the ride's built dog and bird sprites (`assets/day/ride/s09r/`) named on the road; the meeting copied from the farm day |
| The count rule | `farm-animals.md` A1 (the plain row as a hint; the take-back on the thing) | one rule for every count game (§3, decision 21) |
| Hannah Mami's art | the farm day's run, on Nani or another placeholder look for now (Zafar, 1 Nov) | same sheet, plus the new poses in §7 |
| The family | the party's new family (Zara, her mum) | same sheets, plus the new poses in §7 |
| Animal actor | `farm-animals.md` (designed) | an animal walks to a place and plays an action |

**New to build (data, plus one small piece):**
- `data/adoption.json`: animals, the cares each can take, the actions and reactions, the asks and their frames, the levels.
- A **care action** player: tub, scrub, rinse, shake; brush track; tuck. It is three small heal-game-style actions in one file.
- The **"rest" state** (the bed's dim and the wake-up) and the **screen-splash** overlay for the dog's shake (art sprites; code only moves them).
- **Stage B's line-up:** the tools off, the candidates forward in one line, the family at the back centre (§3, §7).
- A grey-box lab page (`labs/adoption.html`) for the four sizes plus the Z Fold and every level, stage B included.
- The leak bot's adoption rows, with the bot's win as written in §3.

**Mum's sheet for this game, in order** (the frame table in §1 has the forms and the takes; nothing counts as teaching until its level's lines are in):
1. **The five animals alone** (N): dog, ant, rabbit, bee, cat. They are the deciders and the stage B set. *Dog and ant gate L1; rabbit and bee L2; cat L3.* Ask: is *chakli* "bird" or "sparrow" (for visit 2)?
2. **The four cares as commands to a child** (C): feed it, wash it, brush it, put it to bed. They are the word cards and **the speaking pills' recogniser templates**. *Feed and wash gate L1; brush and bed L2; all four gate the speaking moment (L3).*
3. **The care frames with each animal, in Mum's natural object form** (F1, W1, B1, S1, with "Ali," once): the first two animals tell us whether the slot swaps. *F1 and W1 with dog and ant, and S1 with "Ali", gate L1.*
4. **Hungry and sleepy with each animal** (H, T), so the he and she forms come from her takes; and ask whether sleepy is the party's "tired". *Gate L3.*
5. **The rest:** "We've come for the {animal}" (FA; dog and ant gate L1), the door line (D; gates the door), "{n} corn for the {animal}" (F2) and one, two, three alone (shared with the farm; gate L2's counts), "not the {animal}" (NA; L2), "Tell Ali!" (HC; L3), the small and the big rabbit (L4).

About 14 takes for L1 (10 if the slot swaps), about 59 in all (about 30): over the template's 15-25, so L1-L2 is the first sitting and L3-L4 the second.

---

## 7. Art and layout

### Camera (art bible §3)

**E, eye level, front**, for the whole game. The horizon is at about 55%. The counter edge is near horizontal at about 60% of the frame's height.
- Tools in **F view** (about 10° down, so the bowl's food and the tub's water just show).
- Animals in E: three-quarter for idle, plus front-facing for "looking at you".
- The close-ups for brushing and washing are **gentle zooms of the same scene**, not a new camera.

Hannah Mami and Ali each turn from three-quarter to front-facing on the child's turn (UX §16); their other new poses are in the art list.

### Art needed (one paste block for Zafar's ChatGPT run; the background locked first)

Visit 1 only (critique finding 8: the first count missed the people's poses and the second size). The tortoise and the bird are visit 2's run (about 20 more cells).

1. **The background:** the centre's room, day only, with the door at the back centre.
2. **Five animals** (dog, ant, rabbit, bee, cat), one sheet each, **10 cells**: 50 cells.
   - idle "happy waiting";
   - eating (with the cob);
   - in the tub with bubbles;
   - the shake (dog) or its own wash joke;
   - brushed (fluffy, shiny);
   - asleep in bed;
   - waking with a stretch (a sleeping animal stays askable);
   - a wrong-tool miss and a wrong-count miss;
   - goodbye.
3. **The small rabbit**, a puppy-proportioned sheet (not the big one scaled), the same 10 cells: 10 cells. It is L4's only look-alike pair.
4. **Hannah Mami's new poses** (the farm run won't have them): laughing, gesturing to the counter, hands clasped ("aah"), handing over the clipboard, front-facing: 5 cells, on the placeholder look for now (Zafar, 1 Nov: Nani or another placeholder for her lines and look).
5. **Ali:** three-quarter idle, front-facing, and doing each care (a cob into the bowl, the jug, the brush, tucking a blanket): 6 cells.
6. **The family's new poses** (the party sheet won't have them): the girl holding the carry basket, the girl hugging a pet, the girl reaching for a leaping one, the mother waving: 4 cells.
7. **Props:** the corn basket with its steel bowl and a single cob; the tub with sponge and jug; the brush; the bed basket with blanket; the girl's carry basket; the flower bed for the bee; Hannah Mami's clipboard (animal pictures only); the ant's swim ring and the bee's shower cap: about 9 cells.
8. **Effects as art:** bubbles, water droplets on glass, the sleep cloud, a motion swoosh for the waggle dance (no dotted path): 4 cells.

That makes **about 88 cells of new art, plus one background**: the largest art run of the overnight set, bigger than the party's. If it has to be split, Block 1 is the background, the dog and the ant, Ali, the props and the effects (L1); Block 2 the rabbit pair, the bee, the cat and the people's new poses. Overlays are code, never art: the gold light and dimming, the brush channel, the count on the bowl, the "your turn" bubble and the pills (`js/shared/`, NN6; lessons §7). No art in code.

### Layout

| Size | The play area | Stage A (the cares) | Stage B (going home) |
|---|---|---|---|
| **740x320 (phone)** | about 577x320 | The side panel on the left (shared). The counter fills the lower 60%; the wall and window are a thin band. The animals on their mats stand about 90-110 px tall. The four tools sit in one row along the counter's front, each at least 64 px. Hannah Mami is cut at the shoulder at the far right (about 90 px). The homes at the back are scenery only, never tapped. Bubbles go into the free space above the mats, never over the panel. | The tools slide off. Up to five candidates in one line on the counter, each at least 90 px tall (5 × 90 + 4 × 12 = 498 px). The family at the back centre, chest up, behind the line; Hannah Mami steps out. |
| **915x275 (Z Fold)** | about 714x275 | As 740x320, tighter: the window band goes and the homes hide. Tools at 56 px or more. Hannah Mami is reduced to head and shoulders tucked at the top right. Faces and items stay big; the scenery gives way. | The same line of up to five at 90 px or more, with more space between them; the family's heads at the back centre, above the line. Nothing slides in from an edge. |
| **930x430** | about 725x430 | The phone layout with more wall: the window and the homes row show, Hannah Mami to the chest, Ali fits in the middle-right. Tools at 72 px or more; animals about 120-140 px. | The line of up to five at about 120 px; the family standing at the open door at the back centre, to the waist; Hannah Mami at the right. |
| **1280x665** | the full room | The window onto the fields, the homes row, Hannah Mami to the waist on the right, Ali in the middle-right when he's in. The mats spaced wide. | As 930x430, roomier; the family full-length in the doorway. |
| **1920x1080** | as 1280, more wall and sky | The core stays in the middle; nothing grows past its art's real size. | As 1280. |

**The two layouts switch by height.** Nothing goes over a face, and the cog is the only button.

**Proof before any art run** (Zafar's fast lane, 27 Oct; critique finding 4): a grey-box lab page with every animal, tool, person and bubble as a labelled box, stage A and stage B, at the four sizes (740x320, 930x430, 1280x665, 1920x1080) plus the Z Fold (915x275), checked by the four-size script. If five candidates at 90 px don't fit beside the family on the Z Fold, the fallback is two short rows (three and two); the lab decides.

---

## 8. What it borrows from other games

- **Toca Pet Doctor:** the animal ends each care asleep and content, which becomes our bed care and the round's end. We take the calm, not the vet.
- **Sago Mini Pet Cafe:** a silly animation when each pet finishes, and **no timer** ("without the pressure of time ticking by"). Our cares have no clock.
- **Toca Life: Pets:** wash with a satisfying rinse, and each animal makes its own sound when touched. We drop the mud: never visibly dirty.
- **Dr. Panda Daycare:** families bring animals and take them home. That's now exactly the shape of our day (the roster rule, §2): the families leave their pets with Hannah Mami and come back for them.
- **Sago Mini Babies:** feed, bathe and rock to sleep as a toy loop for under-5s. That's our four cares; the heard word adds the goal.
- **Dr. Panda Bath Time:** bath and brush as hygiene play with animal characters. It's our tub and brush; we add "which one".
- **Nintendogs** (the empathy study): brushing strokes along the fur, and children treating pets as real. That's the reason for our NN7 rules: no meters, nobody hurts.
- **Anti-pattern: Tamagotchi and needs-meter pets.** Animals that sicken when ignored upset children. There are no meters here.

---

## 9. The lessons checklist

| Group | Result |
|---|---|
| **1. The heard word decides** | **Pass**, with one exception: L1's four deciders are not yet recorded (0 of 4, §1). The leak test is written for each part, with the bot's win defined. The need is open (no dirt, no yawns). From L2 every move has two words (who and which care), and a feed ask a third (how many corn); by Zafar's choice (1 Nov) the count can be won by tapping until it ticks (§3, the count rule), so who and which care are what decide. Numbers decide only the corn. Gold ticks come only on a first-go right; a plain row counts as a hint for moving up. |
| **2. Onboarding** | **Pass.** The first round is the tutorial (§4): one lit box, the rest dimmed, no finger. The tools are shown at the start with sounds. Each new action is shown once; L1's wash is one scrub, then the jug; the brush track holds in the green the first time. Tap, then tap; the only drag is along a track; 4 tools. |
| **3. Instructions** | **Pass.** Hannah Mami is on screen and speaks before the card. The card pops big, then flies into its row. The card is the want; the guide box gives the step. Replay is free. One line per moment (*shabash* alone in the first round). Ali's exchange is modelled before the handover. |
| **4. Pacing** | **Pass.** No Next and no Done: each care closes on a natural tap (the animal, the jug, the end of the stroke, the blanket). A count ticks at the number, Zafar's one count close of 1 Nov, and an extra tap doesn't land (decision 21). No timer. Hints at 7-13 s from the last action. Nani is quiet during the action; the ask repeats for non-readers. Nothing leaves before it's asked: the animals stay on their mats, and a sleeping one can still be asked. |
| **5. Feedback** | **Pass.** A different funny miss for each animal and each wrong care; a shake and the word again; redone on the spot. Every right move gets a reaction. Rows tick gold (first go) or plain (with help) when the care closes. Counts sit on the bowl. It ends with the family, then the shared end screen. |
| **6. Layout** | **Pass, on paper.** Four sizes plus the Z Fold are planned (§7), stage B with its own line-up at 90 px or more. The grey-box lab proves both stages at all five before the brief. |
| **7. Art** | **Pass.** One camera (E). All art is real (bubbles and drops included); the light, the track, the count, the bubble and the pills are code overlays, never painted. Contact shadows on the counter. One paste block (two if split). Calm faces and gentle zooms. |
| **8. Speaking** | **Pass.** The shared "say it, Ali acts", watched in every round of L1-L2, then the handover with a prop, rung 1 (say it after Mum's own take), then rung 2 by the child's record. A closed set of 3 with pills always there, picked after Mum records all four. Never a gate. |
| **9. Levels** | **Pass.** L1 one item with a clearly different decoy and real 1-in-2 asks; L2 numbers, "not" and the dotted English; L3 other ways (hungry, sleepy); L4 a look-alike (the rabbit pair). Each level is designed with its own asks. Up after 3 rounds. |
| **10. Words** | **Exception:** the budget is real: about 59 takes (about 30 if the slot swaps), 14 for L1, in two sittings, against the template's 15-25. Every heard sentence is in the frame table with its forms; "times", "scoop" and "bath" are gone. The rest passes: one natural sentence per person; things named as they are; every count is said; 3-4 new words a round. |
| **11. Culture** | **Pass.** No sweets anywhere (animal food only). Modest clothes. No religious markers. The dog's handling is decision 23 (assumed: like the cat). Nothing to copy and get hurt by: the child never handles the bee or the ant (§10, decision 9). No child ever loses an animal (the roster rule). |
| **12. Fun** | **Pass.** The hands have something to do in every care. "Kind of funny" (the shake, the ant's cob, the pompom bee, the ant's six-legged stretch). Contrast (the ant in the dog's bed). Same cares in a row are rare from L2. Hannah Mami's asks give the toy its goal, and the book gets the pet at home. |
| **13. Twice-made mistakes** | **Watched.** No question is left for the builder (§10). The motion moments (the shake, the waggle, the wake-up) must be judged on film, not stills. All four levels, both stages and five sizes are in the lab. The count rule (ticks at the number) is Zafar's one rule for every game (1 Nov), not fixed in one game. |

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, the reason and the likely answer I assumed. Reply "yes to all except …". Changed or new after the critique: 2, 5, 7, 11-14, 21-29.

1. **One game, two stages:** look after the animals, then going home. *Reason:* the job needs a served ending (lessons §5). *Assumed:* yes.
2. **Four cares on visit 1, exactly his: feed, wash, brush, bed.** Stroke, water and food choice wait for visit 2. *Reason:* the recording is already about 59 takes (§1). *Assumed:* yes.
3. **The verb decides first.** At L1 one animal is on the mat and the care is the choice; from L2 the animal and the care together. *Reason:* the verb is this game's unique word; the animal is the easy part. *Assumed:* yes.
4. **No bag stage on visit 1;** door, ride, meet, play, home, book. *Reason:* a short day next to the farm, and the farm teaches the bag. *Assumed:* yes.
5. **Five animals on visit 1, in this order:** dog and ant (L1), rabbit and bee (L2), cat (L3); the tortoise and the bird on visit 2. *Reason:* his dog first; the funny ant at once; the cat later because Simba and Zazu already carry "cat" at home; seven animals made the art run over 100 cells. *Assumed:* yes.
6. **The pets' family** reuses the party's mother and girl, with four new poses. *Reason:* no new people to draw. *Assumed:* yes, while the party's family are placeholders.
7. **The roster rule: families come back for their own pets; nobody is adopted away. Zafar, 1 Nov: yes, and the place is "the pet hotel"** (families come back for their pets, and the pets are fun). The animals stay with Hannah Mami for the day; one family a round collects its pet; the same animals are there next round and next visit ("look who's here again!"). *Reason:* the level pools hold (the dog and the ant at L1, the rabbit pair at L4), and no three-year-old loses the dog they have just fed and washed (NN7). The served ending, the hug, the book photo and "we've come for the dog" all survive. The child hears Mum's word for the pet hotel at the door (to record).
8. **No timers, no meters, no decay.** Every visit starts with happy animals. *Reason:* NN7 and his rule. *Assumed:* yes.
9. **The child never picks up the bee or the ant.** They fly or crawl to the tool themselves. *Reason:* nothing a child could copy and get hurt by (a sting, a squashed ant). *Assumed:* yes.
10. **The tap order is tool first, then animal**, the shared give-to. *Reason:* one gesture means "give" everywhere. *Assumed:* yes.
11. **Counts only on the corn** (1-3, *makai* ✓), from L2. Scrubs are never counted. *Reason:* "scoop" and "times" have no Kutchi; *makai* is recorded and the farm counts it too; teach our own words, since numbers already decide most heal games. *Assumed:* yes.
12. **Bed can come at any point, and a sleeping animal stays askable** (it wakes with a stretch). Only bed isn't asked twice of the same animal. *Reason:* "an animal in bed is done" let the Sceptic drop its cares, and the wake-up is a laugh. *Assumed:* yes.
13. **L4's look-alike is size, on the rabbit only** (big and small). *Reason:* *nindho* ✓ and *wadho* are the most recorded describing pair; one extra sheet, not two. Colours wait for Mum. *Assumed:* yes.
14. **The speaking set is three of the four commands, picked after Mum records all four** by which sound most different; until then, wash it / brush it / put it to bed. *Reason:* the recogniser's two-or-three-choice rule; feed has no recording either, so it isn't ruled out in advance. *Assumed:* yes.
15. **Speaking is the shared "say it, Ali acts", not a new moment.** *Reason:* lessons §8 (six copies already). *Assumed:* yes.
16. **Ali comes on this trip.** *Reason:* the speaking moment needs him. *Assumed:* yes. Then the "thing for Ali" becomes the brush for Simba, given to the home.
17. **Hannah Mami's lines and look: Nani or another placeholder for now** (Zafar, 1 Nov, the farm's answer). **Voices (Zafar, 1 Nov):** for the prototype, the Kutchi takes that exist play, and the device voice says the rest. Who voices what, the recording sessions and the casting are settled before shipping, once the words are locked; nothing in this design waits on a voice.
18. **The scene is one eye-level room,** with gentle zooms for washing and brushing. *Reason:* one camera per scene (art bible §3). *Assumed:* yes.
19. **The miss reactions are funny and different per animal,** and never show the right tool. *Reason:* lessons §5 and the leak test. *Assumed:* yes.
20. **"Not" said last at L2** ("brush the dog, not the ant"). *Reason:* the rulebook's L2; *na* ✓ is recorded. *Assumed:* yes.
21. **One count rule for every game (Zafar, 1 Nov, reversed after his chai play).** The feed count ticks the moment the right number is reached, and an extra tap doesn't land; the animal still comes to eat when tapped, as its own move. By his choice the count can be won by tapping until it ticks; the animal and the care still decide. There is no stillness timer.
22. **The engine swap from the master map:** the map put this game on put-it-in-its-place plus a needs card; this design uses the shared give-to tap plus the clinic's heal-game actions, and the party's needs-table shape for L3. *Reason:* a care is giving a thing to an animal and then doing something with your hands; "put it in its place" has no hands-on beat. *Assumed:* yes.
23. **The dog, one choice with both versions costed.** (a) **As designed:** the dog opens L1, gets every care including the bath and the shake, and the girl hugs it like any pet; the book shows it at home in a garden. (b) **The dog joins at L2:** the ant and the rabbit open L1 (the shake moves to the rabbit, whose ears spin), the dog is fed and brushed on the counter but never bathed, leaves on a lead without a hug, and is never in the house in the book; it costs the first round and prompt 1 redrawn, and the tub cells of the dog's sheet. *Reason for (a):* your newest word is "include dogs", with no conditions, and the dog is the only animal with any Kutchi in the repo. *Assumed:* (a).
24. **The speaking moment follows `speaking.md` rung by rung:** the watch every round at L1-L2; the handover at L3 with Hannah Mami's clipboard (pictures only) as the prop; rung 1 says Mum's own command after her; rung 2, no model, by the child's own record. *Reason:* the approved ramp (29 Sept); the clipboard, not the brush, because Ali needs the tools to act. *Assumed:* yes.
25. **Stage B has its own layout:** the tools off, up to five candidates forward on the counter in one line at 90 px or more, the family at the back centre; nobody taps a home. *Reason:* the homes are too small to tap on a phone and hidden on the Z Fold. *Assumed:* yes.
26. **L1's asks are drawn at random with repeats allowed;** from L2 a care is rarely repeated (one ask in four). *Reason:* a strict no-repeat with two cares is alternation, so the verb would decide only the first ask. *Assumed:* yes.
27. **Gold and plain rows:** a first-go right ticks gold and moves the word's ladder; a row closed after a miss or the helper ticks plain; it is progress, but a round with a plain row doesn't count towards moving up (Zafar, 1 Nov: level up only on right-first-time rounds). *Reason:* progress, not a verdict.
28. **The family's line at L3 is the same as at L2;** the riddle ("the one that sleeps in a flower") is cut. *Reason:* it is won by remembering an animation, not by the Kutchi, and costs five bespoke lines. *Assumed:* yes.
29. **The ride names the dog and the bird** with the ride's built sprites, before the pet hotel. *Reason:* the dog is heard before it is met, at no art cost. *Assumed:* yes.

### Open questions (genuinely his)

1. **The dog** (decision 23): (a) like the cat, in the tub and hugged (assumed), or (b) on the counter only, from L2, no hug?

(Answered 1 Nov: the roster, families come back; the place's name, the pet hotel.)

---

## 11. ChatGPT mock-up prompts

**Covering note for Zafar's run** (critique finding 13). Run prompt 1 first; once its room is approved, attach that image first to prompts 2-4 so the room stays the same. **What the game draws in code, so the mock-ups leave it out:** the gold light and the dimming, the brush's channel, the count on the bowl, the "your turn" bubble with its mic, the three picture pills, the side panel and every card. **Hannah Mami is left out** of all four (as on the farm): the right edge is left as plain room, and no reference of Nani (Mum's likeness) is attached for her. Each prompt asks for 3:2 landscape. The prompts say "pet hotel" (Zafar, 1 Nov).

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

### Prompt adoption-centre-1: The wash, L1 (the dog's shake)

The image should show the main screen at its funniest moment: the room, the counter, the four tools, and the dog shaking water at the camera after its bath. It explains "tap the tool, then do the care".

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, 3:2 landscape, the main play area only (no side panel, no menus, no buttons, no icons, no glowing highlights, no interface of any kind).

The scene: the inside of a small, bright pet hotel (a home where families leave their pets while they're away), seen at eye level, front on. Limewash cream walls, a big window at the back showing soft green farm fields and a few round trees in sunshine. Along the back wall, a row of little animal homes at floor level: a woven dog basket with a small indigo-and-red block-printed cushion, a wooden rabbit hutch, a small glass ant house, a little wooden bee box with a flower pot, and a cat cushion. In the middle of the back wall, a plain wooden front door, closed. In the front, filling the lower half, a long low pale-oak care counter. Along its front edge sit four big, clearly separate tools, all evenly lit: a small woven basket of yellow corn cobs with a steel bowl beside it, a white enamel tub with a yellow sponge and a small steel jug, a soft wooden brush, and a small woven basket bed with a cushion and a folded blanket. The right edge of the picture is plain room (wall and counter), with nobody standing there.

The moment: in the enamel tub in the middle of the counter, a friendly golden-brown medium-sized dog has just been rinsed and is shaking itself hard: its ears flap, its fur flies out in a ring, and a spray of clear water droplets flies toward the viewer, with a few round droplets landing on the "glass" of the screen. A few soap bubbles drift up. On a small round mat beside the tub, a tiny black ant watches with big delighted eyes.

Style: match the attached references. A stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (enamel, steel, oak, cloth, wet fur), soft contact shadows under everything on the counter. No outlines, no cel shading, no photorealism, no depth-of-field blur. The dog is clean and fluffy: no mud or dirt anywhere.

Absolutely no text, letters or numbers anywhere: none on the basket, the tub, the walls or the homes.

Must read at phone size (about 740x320 pixels): the dog's shake and the flying droplets, the tiny ant's face, and the four tools as four distinct shapes.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/m1-farm-mid-fields-v1.png
```

### Prompt adoption-centre-2: Three animals at once, L2 (brush the bee)

The image should show L2's harder choice, three animals on their mats and four tools, with the brush just used on the bee. It shows that any animal can take any care, so only the heard words decide.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, 3:2 landscape, the main play area only (no side panel, no menus, no buttons, no icons, no glowing highlights, no dotted lines, no interface of any kind).

The scene: the same bright pet hotel as the first attached image, at eye level, front on: limewash cream walls, a window onto green farm fields, the row of little animal homes along the back wall with the plain wooden door in the middle, and the long low pale-oak care counter in front. On the counter, three soft round mats spaced well apart, each with an animal sitting on it, all three looking equally happy and alert (no animal looks hungry, sleepy or dirty): on the left a soft grey rabbit with upright ears; in the middle a round bumblebee about the size of a plum; on the right a tiny black ant. Along the counter's front edge, the four tools, all evenly lit: a small woven basket of corn cobs with a steel bowl, a white enamel tub with sponge and jug, a soft wooden brush, and a small woven basket bed with a folded blanket. The right edge of the picture is plain room, with nobody standing there.

The moment: the bee has just been brushed. The soft wooden brush rests on the counter beside it. The bee has puffed up into a perfectly round, fluffy yellow-and-black pompom with tiny wings, eyes closed in bliss, caught mid-wiggle with a soft motion swoosh behind it. The rabbit and the ant lean in to watch, amused.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (fuzzy bee hair, rabbit fur, oak, enamel, steel), soft contact shadows. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320 pixels): three separate animals on three mats, the bee's fluffy pompom shape, the brush, and the four tools as four distinct shapes.

References to attach:
(first) the approved image from prompt adoption-centre-1
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt adoption-centre-3: Ali's turn, L3 (the speaking moment, bedtime)

The image should show the speaking handover: the child is about to tell the older cousin which care, and he is ready to do it. It also shows the bed care's ant-in-a-big-bed joke. The game adds the "your turn" bubble and the three pills on top.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, 3:2 landscape, the main play area only (no side panel, no menus, no buttons, no icons, no speech bubbles, no interface of any kind).

The scene: the same bright pet hotel as the first attached image, at eye level, front on, now in soft golden afternoon light: limewash walls, a window onto green fields, the row of little animal homes along the back with the plain wooden door in the middle, the long pale-oak care counter in front with its four tools along the front edge (a small woven basket of corn cobs with a steel bowl, a white enamel tub with sponge and jug, a soft wooden brush, a small woven basket bed). In the middle of the counter, a tall, lanky boy of about eight in a plain blue long-sleeved kurta and trousers stands behind the counter, turned toward the viewer with an eager "ready!" face, holding a folded blanket. In front of him on a mat sits a sleek grey cat, calm and alert (not visibly tired). On one side of the counter, in a basket bed much too big for it, a tiny black ant lies tucked under a blanket, fast asleep, with a small round sleep cloud rising from it. The space above the boy's head and along the bottom edge of the picture is kept clear and calm (plain wall and counter front).

Style: match the attached references. A stylised 3D animated-feature look, soft warm golden-afternoon sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials, soft contact shadows. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320 pixels): the boy's face and blanket, the cat, and the tiny ant in the big bed.

References to attach:
(first) the approved image from prompt adoption-centre-1
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
```

### Prompt adoption-centre-4: Going home, L4 (the small rabbit)

The image should show the served ending with L4's look-alike and stage B's own layout: the tools are gone, the candidates stand forward in one line, and a family at the back door has come for "the small rabbit". It explains stage B and the size words.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, 3:2 landscape, the main play area only (no side panel, no menus, no buttons, no icons, no glowing highlights, no interface of any kind).

The scene: the same bright pet hotel as the first attached image, at eye level, front on: limewash cream walls, a window onto sunny green farm fields, the long pale-oak care counter in front, now clear of tools. In the middle of the back wall the wooden front door stands open, sunlight spilling in. Just inside it, in the middle of the picture behind the counter, stand a mother in a modest long-sleeved deep plum kameez, loose trousers and a soft grey dupatta, and her daughter of about four in a marigold kameez with a light dupatta over leggings, holding a small woven carry basket with a cushion inside. On the counter, standing forward in one evenly spaced line, all looking equally cheerful: a golden dog, a big grey rabbit, a small grey rabbit (identical to the big one except clearly smaller), and a round bumblebee. The right edge of the picture is plain room, with nobody standing there.

The moment: the small rabbit is mid-hop through the air from the counter toward the girl's basket, ears streaming back, delighted. The girl's face lights up as she reaches for it; the mother smiles. The big rabbit watches with a fond look and one ear flopped.

Style: match the attached references. A stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (fur, oak, woven straw, cotton), soft contact shadows. No outlines, no cel shading, no photorealism, no depth-of-field or motion blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320 pixels): the big rabbit and the small rabbit side by side, the small one's hop toward the basket, the girl's happy face, and four animals as four separate shapes in one line.

References to attach:
(first) the approved image from prompt adoption-centre-1
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

---

**Outside sources looked at tonight** (search summaries, not read in full): [Sago Mini Pet Cafe review, BridgingApps](https://bridgingapps.org/bridgingapps-reviewed-app-sago-mini-pet-cafe/); [Dr. Panda Daycare, App Store](https://apps.apple.com/us/app/id575812869); [Dr. Panda Bath Time, App Store](https://apps.apple.com/app/id1104191752); [Sago Mini Babies, Screenwise](https://screenwiseapp.com/media/sago-mini-babies-app); [Doc McStuffins Pet Vet, Common Sense Media](https://www.commonsensemedia.org/app-reviews/doc-mcstuffins-pet-vet). The rest are from `research-other-games-2026-10-31.md` §7.

---

## 12. Changes after the critique

Each finding from `adoption-centre-critique.md` (1 Nov), then what was done.

1. **MUST: animals leave for good, breaking the level pools, "every visit starts with every animal" and the dog as L1's anchor (NN7).** Done, the critique's recommendation. The roster rule (§2, decision 7): families leave their pets with Hannah Mami for the day and one family a round comes back for its own; the same animals are there next round and next visit, so the dog and the ant are always there for L1 and the rabbit pair for L4, and no child loses an animal they have just cared for. The hug, the book photo and "we've come for the dog" survive. The decision says plainly that this makes the place a day-stay rather than an adoption centre (his name stays in the docs; the child hears Mum's word at the door), and costs the alternative (true adoption with residents and a refill rule). §0, §2, §3 stage B, §5, §8 and open question 1 now match.
2. **MUST: no rule for a wrong count; "no stop at N" silently reversed principle 4 and differed from the farm.** Done. One count rule is written once in §3 A1 and put to Zafar as the everywhere rule (decision 21), naming his 22 Oct principle 4 and the farm's stillness close: a heard count never stops at N; it closes on the natural closing tap where there is one and on stillness where there isn't; a wrong count is a miss with its own funny reaction, the number said again, fixed on the spot with the take-back on the cob in the bowl; the row ticks plain and counts as a hint; the bot counts it as a miss. The two docs change only on his yes. L2's "two words per move" is now true. *Superseded later on 1 Nov (his reversal after the chai play): counts tick at the number, no wrong-size count, no stillness close.*
3. **MUST: the engine can't build the heard frames; the budget undercounted.** Done. A frame table in §1 (each heard sentence, the forms it needs, what the repo has, what Mum records, takes), in the farm's method: each frame recorded with each animal, so object forms and he/she agreement come from her takes, with a tested saving if the slot swaps. "Times", "scoop" and "bath" are dropped: the count is on *makai* ✓ (the farm's word and its "{x} *lai*" frame), scrubs are never counted, and the "wants a bath" and "messy" lines are cut. The recount is about 59 takes (about 30 with the saving), 14 for L1, against the first draft's "14 words and about 10 lines"; L1's deciders are 0 of 4. Mum's sheet is ordered as the critique asked, with what each line gates (§6), and the C takes are named as the speaking pills' recogniser templates (§1, §3). One addition: "Look, a {animal}!" is replaced by the name alone, which saves five takes.
4. **MUST: stage B's taps don't fit a phone; 930x430 missing.** Done. Stage B has its own layout (§3, §7): the tools slide off, up to five candidates come forward in one line at 90 px or more (498 px in a 577 px play area at 740x320), the family stands at the back centre, and no home is ever tapped. The 930x430 row is added, the layout table has a stage B column, and the grey-box lab proves both stages at the four sizes plus the Z Fold before the brief, with two short rows as the fallback.
5. **MUST: L1's no-repeat rule was strict alternation; the walkthrough broke it.** Done. L1's four asks are each drawn feed or wash at random, repeats allowed, so every ask is a real 1 in 2; the no-repeat rule applies from L2, and loosely (finding 9). The walkthrough (§4) now says it is one draw under that rule.
6. **SHOULD: the dog carries L1 while its place is an open question; the hug contradicted itself.** Done. Decision 23 puts (a) the dog as designed and (b) the dog from L2, on the counter, no bath, no hug, both costed; (a) is assumed, because his newest word is "include dogs" with no conditions. The hug line is consistent with (a) everywhere, and open question 2 points to the decision.
7. **SHOULD: the speaking moment skipped `speaking.md`'s ramp.** Done. §3 now goes rung by rung: the watch every round at L1-L2, the handover at L3 with a prop and the turn to the front, rung 1 saying Mum's own C take after her, rung 2 without a model by the child's own record, the pills always there, the recast. The pills are picked after all four commands are recorded (decision 14). I used Hannah Mami's clipboard, not the brush or blanket the critique suggested, as the prop: the prop stands for the role of giving orders (as the doctor's clipboard), and Ali needs the tools to act.
8. **SHOULD: the art was undercounted; "small to medium" was wrong; §5 contradicted §3.** Done. Visit 1 has five animals (the tortoise and the bird move to visit 2), L4's pair is the rabbit only, the people's new poses, Ali's poses and the clipboard are counted: about 88 cells plus the background, called "medium to large, the largest art run of the overnight set" (§0, §7), with a two-block split. §5's visit 2 is fixed.
9. **SHOULD: three small eliminations in the leak tables.** Done. A sleeping animal stays askable (it wakes with a stretch; only bed isn't asked twice), the last care repeats about one ask in four from L2, and the family can want the one in bed or the one just cared for. The odds are recomputed (§3).
10. **SHOULD: reuse missed; one engine swap not declared.** Done. The brush's parents are the tooth game's track and hair's one-swipe stroke (§3 A3, §6); L3's needs use the party's `needs.json` shape; the ride names its built dog and bird sprites (§2, decision 29); the swap from put-it-in-its-place to give-to plus the heal pattern is decision 22 and noted in §0.
11. **SHOULD: four first-round confusions.** Done. (a) One scrub at L1, then the jug. (b) The family now comes before Ali's watch, so the ant is put to bed after the dog has gone home and is never a sleeping tap target. (c) The first decoy is the brush (the dog tries to eat it). (d) One line: *shabash* only; *kha* is the bowl line from L2.
12. **SHOULD: the L3 riddle at the door.** Cut. I did not take the critique's replacement ("the sleepy one"): with one animal visibly asleep it is won by looking, which is matching. L3 at the door uses L2's line with five candidates; "the small rabbit" stays at L4.
13. **SHOULD: the prompts painted UI, attached Nani's likeness for the aunt, crowded the right edge, and gave no aspect ratio.** Done. The glow, dimming, dotted track, waggle's dotted path, mic bubble and picture buttons are gone from all four, named in a covering note as code overlays. Hannah Mami is left out until her likeness run, and `nani-sheet.webp` is dropped from every prompt. Prompt 4 now shows stage B's own layout (the family at the back centre door, four animals forward in one line, no tools) rather than the critique's four peeping faces, because finding 4 moved the candidates onto the counter. Each prompt says "3:2 landscape", and prompts 2-4 attach prompt 1's approved room first.
14. **SHOULD: define the bot's win and what a fished row shows.** Done. One paragraph in §3: the bot's win is a round that would count towards moving up (every row gold but at most one); the two tries per ask only ever close a row plain; the arithmetic per level (under 0.1% at L2, about 31% at L1 under the L1 allowance; under 10% required from L2); a fished row shows its pictures filled in with a plain tick, never a cross: progress, not a verdict.

**Consistency pass (1 Nov, `consistency-2026-11-01.md`).** The pets' family is the one party cast (`party-gifts.md` §0): Zara is 4 on her first party, in a marigold kameez, and her mum wears deep plum; prompt 4 (going home) now draws them that way. Ali is about eight in prompt 3, as `do-it-engine.md` and `wake-up-clock.md` draw him (was nine).

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **The pet hotel:** the adoption centre is renamed in the text (title, door line, roster rule, decision 7, prompts 1-4 as on the prompt sheet); the file name stays. The roster is settled: families come back for their pets.
- **One count rule:** the feed count ticks at the number and an extra tap doesn't land (reversed later on 1 Nov, after the chai play; it was first the animal or 1.25 s of stillness). Decision 21 and the §3 rule are rewritten; the "if Zafar says yes" paragraph is gone.
- **Level up only on right-first-time rounds:** the levelling line, the fishing row, decision 27 and the bot's win (now every row gold) changed.
- **Voices:** Hannah Mami's lines and look are Nani or a placeholder for now; the speaking moment and her hello no longer wait on recordings (decision 17, §3, §4).
- **Clothes:** the prompt sheet's clothes line is added before the prompts.
- **Open questions:** the roster and the place's name are answered and removed; the dog stays open.
- Counts tick at the number (his reversal after the chai play).
