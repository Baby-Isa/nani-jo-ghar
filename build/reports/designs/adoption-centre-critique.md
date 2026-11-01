# Critique: the adoption centre design (1 Nov 2026)

Independent read of `build/reports/designs/adoption-centre.md` against the lessons checklist, the design method, the two 31 Oct research reports, the audit, the two maps and Zafar's answers, `easy-to-play.md`, `speaking.md`, the rulebook, the art bible, the lexicon and word inventory, the clinic's heal-game code, and CLAUDE.md. Flaws first. MUST means the design doesn't go to Zafar or a builder until it's fixed; SHOULD means fix it before the brief. Nothing else was edited.

**What it gets right, in one line:** the open-need rule is taken seriously (no dirt, no yawns, every animal can take every care), the four cares each answer the five questions with a real delight moment (the shake, the ant's grain, the pompom bee, the ant in the dog's bed), the first round is written tap by tap, the recording gap is admitted, and §10 puts twenty choices to Zafar in his format.

---

## Findings

### 1. MUST: animals leave for good, which breaks the level pools, the "every visit starts with every animal" rule and the dog as the L1 anchor

- **Place:** §0 ("At the end, a family comes for one animal"); §2 ("One animal goes home with a family"; "Each visit starts with every animal bouncing"; "Over the visits every animal finds a family"); §3 stage A ladder (L1 = dog and ant; L4 = big and small dog or rabbit); §5 visit 3 (puppies); §10 decisions 5 and 7; open question 2.
- **Problem:** Three statements can't all be true. (a) One animal is adopted every round. (b) Every visit starts with every animal. (c) The L1 pool is fixed at dog and ant, L2 at four, L4 needs a big and a small of one kind. Level-up needs three rounds at a level: if the dog goes home in round 1 (the first-round walkthrough adopts the dog), round 2 at L1 has only the ant, and L4's look-alike pair may be gone before it's reached. Nothing says what refills the centre, and if nothing does, the centre empties in seven rounds and stage B becomes elimination over rounds (the Sceptic knows who's left). Zafar asked for dogs; the design sends the dog away in the child's first three minutes. It is also the NN7 risk the research flags (children treat virtual pets as real): a three-year-old has just fed and washed the dog, then a stranger takes it, for good.
- **Evidence:** §3 ladder; §4 step 10; OTH §7 (Nintendogs: "many treated the pets as real"); CLAUDE.md NN7; the design's own open question 2 admits the alternative.
- **Change:** Decide the roster rule before Zafar sees it, as a numbered choice with a recommendation: **recommended, the "owners come back" ending (open question 2's pet hotel):** the family at the door is the animal's own family collecting it after its day, and the same animals are back next visit ("look who's here again!"). The served ending, the hug, the book photo and the Kutchi ("we've come for the dog") all survive; nothing is lost; the level pools hold. If Zafar wants true adoption, write the refill rule (the adopted animal's twin or a new arrival appears next round, and the L1 and L4 pools are drawn from what is present) and keep the dog as a permanent resident.

### 2. MUST: the counts have no rule for a wrong number, and "no stop at N" silently reverses Zafar's 22 Oct principle for every count game

- **Place:** §3 A1 ("tap it again for each extra scoop ... The closing tap is the animal. There is no Done button and no 'stop at N'"); A2 ("each tap makes a puff of bubbles ... The closing tap is the jug"); the leak table; §10 decision 11.
- **Problem:** At L2 the number is one of the "two words per move", but the design never says what happens when the child gives two scoops for "three", or four scrubs for "two", and then taps the animal or the jug. If the animal eats anyway, the number never decides and L2's second word is hollow (the leak table's "1 in 12 before counts" quietly relies on it). If the animal refuses, that is a miss and must be written as one (which funny miss? does it cost the first-go?). Separately, `easy-to-play.md` §4 principle 4 (Zafar, 22 Oct, "yes to all") says "a count ends at the right number and an extra tap doesn't land": the count closes itself. The design's "the child taps the animal to close" is a stop-at-N choice by another name, which lessons §4 says needs redesigning, and the farm sibling chose a third way (a stillness close) that its critique flagged as reversing the same principle. Three designs, three count rules, and none presented to Zafar as the everywhere rule it is (lessons §13: "an everywhere rule fixed in one game only").
- **Evidence:** `easy-to-play.md` §4 principle 4; lessons §4 and §13; `farm-animals-critique.md` finding 5; the rulebook's "How many" row.
- **Change:** Write the count rule once, in §3 A1, and put it to Zafar as what it is: "this touches your 22 Oct principle 4; the farm design proposes a stillness close; here is the recommendation for all count games". Recommended: the count closes on the natural tap (animal, jug) as designed, **and a wrong count is a miss** with its own funny reaction (the dog looks at the bowl, then at Hannah Mami; the bee peers into the tub for more bubbles), the number is said again, and the child adds or takes back on the spot (take-backs on the thing: the scoop in the bowl, not the sack). Say what the bot counts as a miss. Then the "two words per move" claim is true.

### 3. MUST: the engine can't build the heard frames, and the recording budget undercounts what Mum must say

- **Place:** §1 "Frames heard"; §1 tables; §6 "Mum's round for this game" ("14 words and about 10 lines").
- **Problem:** The design lists words, not the forms each sentence needs. Checked against the inventory and lexicon:
  - **"three times"** (A2, L2): *times* has no Kutchi in the engine; the clinic's ear, boing and hair games use an English placeholder. "Wash the bee three times" can't be said.
  - **"two scoops"** (A1, L2): *scoop* is "planned" only. The farm sibling dropped scoops for corn cobs precisely because *makai* ✓ exists; this design says "the farm needs it too", which is no longer true. The L2 number frames therefore have no noun to count.
  - **"wants a bath"** (L3): *want* exists as *khape* with a person; *bath* is nowhere. "Is hungry / is sleepy" needs the adjective and the copula to agree with the animal's gender (dog is *he*, bird is *she* in the lexicon; rabbit, bee, ant, cat and tortoise have no entry, so no gender): "hungry" alone is not one word to record but a he-form and a she-form.
  - **"Feed the dog", "wash the ant"**: whether the animal takes an object form (as "for Nana" needed *lai*) is unknown; each animal may need two forms.
  - **"the small one"**, "we've come for the dog" (come, past, we), "Tell Ali!", "not the ant": all whole-line frames, none sketched.
  - **The speaking pills** (wash it / brush it / put it to bed): `js/shared/speech.js` matches against the family's own takes, so these three commands must be recorded as takes before the L3 moment can run at all; §6 lists the verbs but not that the takes are the recogniser's templates.
  The honest total is well over "14 words and about 10 lines", and the first round's four deciders (dog, ant, feed, wash) plus the frames they sit in are 0 for 4.
- **Evidence:** `research-word-inventory-2026-10-31.csv` rows times, scoop, feed, brush, wash (*dho*, draft, inside 1 line), give, tired; `data/lang/lexicon.json` n.dog (he), n.bird (she); `farm-animals.md` decision 3; `speech.js` header; CLAUDE.md NN2 ("if the engine can't say it, report the gap"); lessons §10.
- **Change:** Add a frame table (each heard sentence; the forms it needs: verb, person, gender, number, case; what the engine has; what Mum records) and recount. Drop "times" and "scoops": count a recorded noun or a thing the child sees (bowls, *makai* cobs, or "one more" / "again"), and let the number ride on scrubs only if Mum has a natural way to say "three times". Order Mum's sheet: (1) the seven animals alone (the deciders and the stage B set), (2) feed, wash, brush, put to bed as commands to a child (also the pills' takes), (3) the frames "feed the {animal}" with Mum's natural object form, (4) hungry and sleepy in both genders, (5) the rest. Mark which lines gate which level.

### 4. MUST: stage B's tap targets don't fit a phone

- **Place:** §3 stage B ("every animal in the centre peeps out of its home, 4-7 in all"); §7 layout ("740x320: the animal homes at the back show as small peeping faces"; "915x275: the homes row hides (it comes back for stage B as a slide-in)"); §9 group 6 ("the five sizes are planned").
- **Problem:** Stage B is a listening ask whose targets are the homes row, which the phone layout itself calls "small peeping faces" and the Z Fold layout hides. Seven faces at a tappable 64 px plus gaps don't fit beside Hannah Mami in a 590 px play area, and at 915x275 a slide-in row of seven in 275 px of height, under the window band, is smaller still. Lessons §6: "on phones, items and faces stay big; take the room from the scenery"; OTH §7 pitfall: "small items are fiddly". Also, §7 plans four sizes, not five: 930x430 is missing, though §9 claims all five.
- **Evidence:** §7 layout table; lessons §6; `farm-animals.md` §7 (90-140 px animals on one ground line as the phone standard).
- **Change:** Give stage B its own layout rule: the tools leave the counter (they aren't used), the candidates come forward onto the counter in one line at 90 px or more (on phones two short rows, or the L2+ set capped at five with the rest "asleep in the back room"), and the family stands at the back centre, not the crowded right edge. Add the 930x430 row. The lab proves it at all five sizes before the brief (lessons §13, "playing one size").

### 5. MUST: L1's "never the same care twice in a row" is a strict alternation, and the first round breaks it anyway

- **Place:** §3 ("two asks in a row never use the same care"); the ladder's L1 row ("feed, wash; 4 asks, each animal 2 cares, in a mixed order"); §4 steps 3-8 (dog: feed, wash; ant: wash, feed).
- **Problem:** With two cares and a no-repeat rule, four asks must alternate: once the first ask is heard, the other three are known by pattern, so the verb, which the design calls L1's whole point ("the verb, not the noun, decides the move from the very first ask"), decides only once a round. The walkthrough then plays wash, wash across the dog and the ant, breaking the rule it set. L1 is allowed 1 in 2 (rulebook); it is not allowed 1 in 1.
- **Evidence:** CLAUDE.md NN4 (patterns); the rulebook's L1 row; the design's own claim in §1.
- **Change:** Apply the no-repeat rule from L2 (four cares) and let L1's four asks be drawn at random with repeats allowed, each still 1 in 2 with one clearly different decoy lit. Fix the walkthrough to match whichever rule stands.

### 6. SHOULD: the dog carries L1, the signature moment and the first-round art while its place in the family's ways is an open question

- **Place:** §4 (the dog is the first animal, the first laugh, the first adoption); §3 scene (an ajrakh cushion in the dog's basket, indoors; the dog in the tub on the counter); §10 open question 1 ("nobody hugs it in the book"); §3 stage B ("the girl hugs it").
- **Problem:** Zafar said include dogs, so dogs are in. But the design hangs the first round, the tub, the house and the hug on the one animal whose handling it then asks about, and contradicts itself: open question 1 says nobody hugs the dog, stage B and §4 step 10 have the girl hug it. If his answer is "treat it like the cat", fine; if it is "outside, no hugging, not in the tub", the first round and prompt 1 are redrawn.
- **Evidence:** master map, Zafar's answer 8; CLAUDE.md NN9 (internal only); the design's §10.
- **Change:** Make it one numbered choice with both versions costed: (a) the dog as designed; (b) the ant and the rabbit open L1, the dog joins at L2 and is cared for on the counter with the brush and the bowl, the bath kept for the rabbit (its shake is as funny). Fix the hug line to match whichever he picks.

### 7. SHOULD: the speaking moment skips the ramp in `speaking.md`

- **Place:** §3 "The speaking moment" (watch L1-L2, handover L3, alone L4); §10 decisions 14-15.
- **Problem:** `speaking.md` (approved 29 Sept) sets the steps: watch, a handover with a visible prop and the "your turn" bubble, then rung 1 "say it after" (the recorded line plays, written and underlined, the child repeats), then words without a model, then picture only. The design's L3 goes from the watch straight to "the cat is sleepy, tell Ali", which asks the child to turn a feeling into a command with no model line to say after; "Alone (L4) ... no model line" implies L3 has one, but never says which clip. No prop changes hands. And "feed" is left out of the pills "because its form is unrecorded", which is equally true of brush and put to bed.
- **Evidence:** `speaking.md` "Setting up the premise" and the rung table; mechanics finding 3 (2-3 options that sound different; never against the clock); lessons §8.
- **Change:** Write the moment rung by rung as the farm and party designs do: the watch (Hannah Mami to Ali, every round); the handover (Hannah Mami hands the child the brush or the blanket, Ali and she turn front); rung 1: Hannah Mami's own recorded command plays and the child says it after; rung 2: the pills with pictures, no model; the recast as designed. Pick the three pills after Mum records all four, by what sounds most different.

### 8. SHOULD: the art is undercounted, and "small to medium" is wrong

- **Place:** §0 ("Rough size: small to medium"); §7 "Art needed" ("about 65 cells"); §5 visit 2 ("the bird and the tortoise from L1").
- **Problem:** Seven animals at nine cells is 63; the design then adds a second size of the dog and the rabbit "not the same sheet scaled" (18 more), seven props, four effects, Hannah Mami in poses the farm run won't have (laughing, gesturing, hands clasped), Ali tucking a blanket, and the party family in poses their sheet won't have (a carry basket, reaching for a leaping rabbit). That is 100-plus cells before the background: the largest art run of the overnight set, bigger than the party's nine people. §5 also contradicts §3: the bird and the tortoise are L4 on visit 1 and "from L1" on visit 2.
- **Evidence:** §7 list; `party-guests.md` §7 (7 people × 12 poses is called "the big cost"); lessons §7 (one paste block, backgrounds first); decision 77 (ChatGPT runs Zafar supervises).
- **Change:** Visit 1 ships five animals (dog, ant, rabbit, bee, cat), with the tortoise and the bird on visit 2 as §5 half-says; L4's pair is the rabbit only (one extra sheet). Count the people's new poses and the girl's basket in the list. Call the size what it is.

### 9. SHOULD: three small eliminations are left in the leak tables

- **Place:** §3 ("the same care is never asked twice in a row"; "an animal in bed is done for the round"); stage B leak table ("the family wants a random animal, not the last one cared for or the one in bed").
- **Problem:** The no-repeat rule lets the Sceptic drop the last care (12 options become 9); bed removes an animal and all its cares; and the stage B line reads as two exclusions (never the last one cared for, never the one in bed), which with three animals on the mats is a real narrowing. The 12-to-6 arithmetic in the table is right only if neither exclusion exists.
- **Evidence:** NN4 (eliminating); the table's own numbers.
- **Change:** Let the family sometimes want the one in bed (it wakes, stretches and yawns into the basket: a delight, not a rule broken) and sometimes the one just cared for; allow a repeated care from L2 now and then (one in four); recompute the table.

### 10. SHOULD: reuse missed, and one engine swap not declared

- **Place:** §6 reuse table ("brush along a track: the foot's splinter path, inverted"); §2 the ride; the master map's adoption row ("put it in its place plus a needs card").
- **Problem:** The tooth game already has the brush the design needs: a plus-shaped track with the brush at its centre, moving only along channels (Sprint 11, Zafar, 21 Oct), and hair has "one swipe, one stroke". The foot's path is a steer-and-avoid game, the opposite feel. `party-guests.md` says its needs table (`data/party/needs.json`) is the shape the adoption centre's needs reuse; this design doesn't name it. The ride already has a dog and a bird sprite (`assets/day/ride/s09r/`), so the ride stage could name them before the centre, as it names the goat and hen. The map placed this game on put-it-in-its-place plus a needs card; the design moves it to give-to plus the heal pattern (a better fit) without saying so in §10.
- **Evidence:** `js/clinic/heal/games/tooth.js` and `hair.js` headers; `party-guests.md` §6; audit §5 "mechanics worth reusing".
- **Change:** Cite the tooth's track and hair's stroke as the brush's parents; reuse the party's needs-table shape for L3; put the ride's dog and bird on the road; add the engine swap to §10 as a decision.

### 11. SHOULD: four first-round confusions

- **Place:** §4 steps 5-10.
- **Problem:** (a) Step 7 needs three scrubs with the jug lighting after the third, though the ladder says scrubs are counted "from L2" and L1 is "one scoop": the first hidden count is a wait-for-the-glow at the level that should have none. (b) Step 9 puts the ant to sleep in the dog's bed; step 10 then lights "the dog and the ant" for the family: a sleeping, tucked-in ant as a tap target is odd, and the awake-versus-asleep pair is matching. (c) Step 6's decoy is the bed: the dog "sniffs it and flops over", which looks like the bed working. (d) Step 5 has two lines in one moment (*kha!* then *shabash*), against lessons §3.
- **Evidence:** lessons §2, §3, §4; the ladder in §3.
- **Change:** One scrub at L1, then the jug. Play Ali's watch after the family leaves (or the family comes for the ant, which wakes up delighted). Use the brush as the first decoy (the dog tries to eat it, the design's own best miss). One line: *shabash* only.

### 12. SHOULD: the L3 "we'd like the one that sleeps in a flower" is a riddle, and scope creep

- **Place:** §3 stage B levels, L3.
- **Problem:** It is a relative-clause sentence per animal (seven bespoke lines in Mum's words), answered by remembering the game's own bedtime animation, which is world knowledge, not Kutchi; the mechanics report's I-spy rule says a single clue that fits one thing is a match, not a listen.
- **Evidence:** mechanics table, "I-spy riddle"; lessons §10 (the budget).
- **Change:** Cut it. L3's other way at the door is the feeling or size word already taught ("the sleepy one", "the small one"), which costs nothing new.

### 13. SHOULD: the ChatGPT prompts draw UI into the art, attach Nani's likeness for the aunt, and crowd the right edge

- **Place:** §11 prompts 1-4.
- **Problem:** Prompt 3 says "no buttons" and then asks for three picture buttons and a mic bubble: that is the shared `say.js` UI (NN6, never per mode; lessons §7, nothing UI-like as art), and the model will paint it. Prompts 1 and 2 ask for the gold glow and dimming on a tool or mat, and dotted tracks: the shared light and the track are UI too, and a glow on the tub after the bath contradicts the design's "nothing lights the answer". Prompts 1, 2 and 3 attach `nani-sheet.webp` as a reference for "a young aunt": Nani's sheet is Mum's likeness, and the farm design asked for a likeness run for Hannah Mami first; the risk is Mum's face on Hannah Mami. Prompt 4 stacks a door, two people and the aunt on the right edge with six peeping faces and two rabbits: a muddled screen at 740x320. None of the four gives an aspect ratio (as with the siblings).
- **Evidence:** NN6; lessons §7; `farm-animals.md` §7 ("a likeness run first, Zafar"); art bible §1 (reference discipline).
- **Change:** Strip the glow, dimming, tracks, bubble and buttons from all four (name them in the covering note as overlays the game adds). Drop `nani-sheet.webp` from the aunt's references and describe her, or leave her out of the mock-ups until her run. Move prompt 4's door to the back centre and show four peeping faces. Add "3:2 landscape" to each.

### 14. SHOULD: define the bot's win and what a fished row shows

- **Place:** §3 leak table ("Fishing"; "The bot's numbers"); §9 group 1.
- **Problem:** The first miss is free and the second brings Hannah Mami's help, so each ask is two tries; the per-round figure ("well under 1%") is quoted before that is counted. The bot's win is not defined (every row ticked first go? the round closed with at most one bulb?), nor is what the end screen shows for a row that closed after a miss (first-go ticks only, so it stays unticked: say so, and that it is progress, not a verdict, UX §11).
- **Evidence:** lessons §1 ("the bot plays a learned save and must win under 10%"); `farm-animals-critique.md` finding 4.
- **Change:** One paragraph: the win condition, the two-try arithmetic per level, and the unticked-but-closed row's look.

---

## Verdict

This is a sound, likeable design with the right instincts: the heard verb decides, nothing on screen gives the need away, every care has a hands-on beat and a laugh, and the ending is served. It is not ready for Zafar. Its roster rule contradicts its own level ladder and risks the one thing NN7 forbids (a child losing the animal they just cared for); its L2 "two words per move" rests on a count rule it never writes and on two nouns (times, scoop) the engine can't say; its stage B can't be tapped on a phone; and its L1 alternation hands the verb away after one ask. All four are cheap on paper and expensive after a build. Fix 1-5, then the SHOULDs in order (the dog question and the speaking ramp first, since both change the first round), and it becomes the strongest of the trip designs: the only one whose core word is a verb, with the funniest animals in the game.
