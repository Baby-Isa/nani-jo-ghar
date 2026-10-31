# Review of the games map draft (31 Oct 2026)

Reviewer: Fable, independent of the draft's author. Reviewed: `games-master-map-2026-10-31.md`. Checked against: `game-settings-map-2026-10-31.md` (Zafar's notes and answers), `research-existing-games-2026-10-31.md` (the audit), `research-other-games-2026-10-31.md`, `word-groups-map-2026-10-31.md`, `research-topic-wordlists-2026-10-31.md` (the A2 targets), `research-mechanics-2026-10-31.md`, `research-verbs-grammar-2026-10-31.md`, `research-word-inventory-2026-10-31.md`, plus `data/clinic/pipeline.json`, `data/days.json` and the trip docs. Nothing was edited.

Findings are numbered, most serious first. Each gives the place in the draft, what is wrong, the evidence, and the change I would make.

---

## 1. The draft claims completeness but never compares words with words

**Place:** Part 4, "Coverage": "Nothing the child needs at A2 is without a home, except days of the week (left) and shapes."

**What's wrong:** The grid counts *homes* per group, not *words*. A group with a ● and a ○ is called "covered" however many of its A2 words the games can hold. The A2 target (about 1,050 meanings, `research-topic-wordlists` §2) never appears in the draft. So the one comparison that would show completeness is missing, and the headline claim is too strong. Checked group by group against the A2 targets, these are not at home:

| Group | A2 target | What the named homes can plausibly carry | The gap |
|---|---|---|---|
| Actions (verbs) | 100 | nine verb-group ticks, no verbs named | see finding 2; 13 of the top 40 verbs are not in the engine at all (`research-verbs-grammar`, headline 7) |
| Describing words (30) | 60 | hot/cold, big/small, dirty/clean, wet/dry, full/empty, fresh, soft: about 15, all as "also" | the second-biggest group has no game whose move the describing word decides |
| Numbers (14) | 40 (one to twenty, tens to a hundred, first/second/last, pair, both, half) | every game counts to about 6; the clock reaches 12 | nothing carries 11-20 or the tens; pay in paisa is the natural home and the draft doesn't say so |
| Weather and nature (17) | 25 | the door (22 words, 7 recorded) is "a beat, not a test" (audit §1e); the ride spots trees | the only main home is not a game; nature words (river, hill, field, stone, fire) have no home |
| Health and feelings (6) | 40 | send-off 4 + party 6 + adoption 3: about 13 | the health half (a cold, cough, headache, stomach-ache, medicine, better, careful) is not placed; the diagnosis "why" line could carry it |
| Time (16) | 35 | morning, night, today, tomorrow, o'clock, breakfast/lunch/dinner: about 12 | now, later, soon, before, after, again, seasons, monsoon have no home; the clock is "lab test first" |
| Sports (27) | 18 | a sport's bag: about 5 | called "thin" and left there; the verbs (kick, throw, catch, run, win) could ride on statues and are not listed there |
| Music and art (28) | 18 | left (Zafar) | fine, but say the A2 total drops by it |

**Evidence:** `research-topic-wordlists` §2 table (targets) and "most important words per topic"; audit §1e (the door); `research-verbs-grammar` headline 7.

**Change:** Add three columns to the Part 2 grid: *A2 target*, *words the named homes can hold* (an honest estimate per game, summed), and *recorded today* (from the word inventory). Restate the coverage verdict per group from those numbers, not from the count of homes. Then the closing claim becomes true or shows the gaps, which is the job Zafar set ("so the whole is shown to be complete, or the gaps show").

## 2. The verb grid shows nine ticks for the biggest group

**Place:** Part 3.

**What's wrong:** Actions are the largest A2 target (100 words) and the research says 30-40 verbs carry about three-quarters of what a child hears. The draft's Part 3 has no verb in it: a setting gets a ● for a whole verb group if any game there uses one verb from it. "Moving yourself" at T rests on "go". Nobody can tell from Part 3 which of the top 40 verbs has a game where the verb decides the move. The verbs report says 13 of the top 40 are missing from the engine entirely (know, think, play, tell, try, find, read, remember, call, hold, show, fall, push) and three more of the top 60 (drink, sleep, hear). The draft never mentions this.

**Evidence:** `research-verbs-grammar` headlines 1, 4 and 7; `research-mechanics` finding 1 (the word must be the move) and the "Nani says, do it" rule (one thing, several actions).

**Change:** Replace Part 3 with a verb table: the top 40 verbs, one row each, the game where that verb decides a move, and its status. Mark the missing 13. Add one line tying the design to the recording plan: record every form of about 25 simple verbs plus do/become/give, then new actions cost one noun clip (verbs report, headline 4). Add the verbs to Part 4's "real blocker" list.

## 3. "Covered" rests on games that are new, parked, or run on English placeholders

**Place:** Part 2 grid and its status key; Part 4 "20 are covered".

**What's wrong:** The grid does not say whether a home is built, greybox, designed, new or parked, so a ● from a game that doesn't exist counts the same as Cook. Examples:
- **Clothes (11), "covered", 7 homes.** Its two main homes are the sewing (parked; the draft itself says "worth nothing until the clothes and colour words are recorded") and pack the bag (designed, `built: false` in `data/days.json`). Nothing playable carries clothes.
- **Household things (10), "covered".** All three main homes are clean-up day (new, weakest evidence), litter fishing (new, "weak as a game of its own") and pack the bag (designed).
- **Toys (26), "covered".** Main home: clean-up day.
- **Time (16), "covered".** Its number half rests on the clock, which the draft says must pass a lab test first.
- **Transport (24), "one home".** The ride is built but has no Kutchi at all (audit §1d: "18 (0, and no Kutchi)").
- Across the whole game, 166 of 1,027 meanings are recorded (16%, word inventory headline); the clinic has 14 of 239; Tidy up's positions and Dress up's garments are English.

A reader of the grid would think 20 groups are taught today. Perhaps three are (food, cooking, parts of body/numbers).

**Evidence:** audit §1b, §1c, §1d and flaw 2 (readers win on placeholders); word inventory headline; `data/days.json` stage flags.

**Change:** Put a letter in each cell instead of a dot: **B** built on the kit, **G** greybox, **D** designed, **N** new, **P** parked; main homes in bold. Define "covered" as "a main home that is built or greybox, with its deciding words recorded or on Mum's next sheet". Add the "recorded" column from finding 1. Keep the current dots as a second, "on paper" view if Zafar wants both.

## 4. Four of Zafar's decisions are changed without his word

**Place:** Part 1, the kitchen's "Breakfast, lunch, dinner" row; the beach's "three stalls" row; the clock row; the clinic's "Every named part treatable" row.

**What's wrong:**
1. **The eggs station became "a skin, not a station".** Zafar asked for "an eggs or breakfast station" (settings map §1, Food), and he said yes to Table A, whose row 3 is "Breakfast or eggs station: boil, crack, fry; ties a meal word to the time of day". The other-games research said "fold it into Cook as a station" with crack as a tiny new mechanic, not drop the station. The draft drops the eggs and the verbs boil, crack and fry with them. Those verbs lose their home, and "a boiled egg for Nana, a fried one for Ali" (owner plus verb, the research's leak-proof move) goes with them.
2. **The beach became three food stalls.** Zafar's beach (19 Oct, `docs/game-design/days/beach.md`) is shells, the sandcastle, the snack stall and the picnic. The draft keeps only the stall and calls Sea and beach (21) its *main* group. Corn, cassava chips and coconut are food words; the sea words (shell, sand, wave, crab, bucket, spade, sandcastle) live in the stages the draft left out. Non-negotiable 1.
3. **The clock slows at the hour.** Zafar's design has "a big digital clock on the wall runs fast". The research advises a slow clock (a fast clock is a timer). The draft states "slow at the hour" as fact. It is a change to his design and belongs in Part 5 as a question with the reason.
4. **His clinic extensions are only half placed.** He named: the nose (the ear's twin), hair, a bandage for a finger and for the head, the drinks for the tummy. The draft's row covers hand, finger, elbow, shoulder, neck, tummy and a cough. The head bandage and the nose game are missing from the row (the nose survives only as a safety question; the head not at all). Table A row 5, which he approved, has all of them.

**Evidence:** settings map §1 (Food, Body, Time) and §2 Table A rows 3 and 5, and "Zafar's answers" (yes to 1); `days/beach.md` "Zafar's design (19 Oct)"; other-games research §6 and §15.

**Change:** Restore the eggs station as a Cook station row (its skin for the time of day can stay as a note). Restore the beach's shells, sandcastle and picnic as rows and move the stalls' main group to Food. Keep the clock as his design and ask the speed question. Add the head bandage and the nose to the clinic row. Where the draft prefers something else, say so in Part 5 as a numbered choice.

## 5. Parked mechanics vanish, and the fold list Zafar asked for isn't here

**Place:** Part 1 as a whole; the "Build once" section.

**What's wrong:** Non-negotiable 1 says never remove a mechanic without his OK. The draft silently drops:
- **Monsoon rush** (Table A row 30, parked; the audit says "it stays parked, not removed"). It is the only parked game with weather words and the neighbour of clean-up day's home verbs (audit §2 "Monsoon"). Not in the draft at all.
- **Hic** (parked heal game): not mentioned anywhere.
- **Tummy and hair** appear only inside Part 5's questions, not as rows.
- **Who did it?** is placed (good), **Dress up** folds into the sewing (his note, good).

Zafar's yes to question 3 (fold Tidy up and Find it into the home games) was "after I list exactly which ones go where". The audit §4 has that list (27 rows). The draft gives one line at the shops ("Find it's shop games stay here") and nothing else, so his condition is not met and the home-game rows don't show what they start from.

**Evidence:** settings map Table A row 30 and "Zafar's answers" (3); audit §1b (parked heal games), §4 (the fold table), §5 "Dead weight" ("stays parked, not removed").

**Change:** Add a short "Parked, not placed" list at the end of Part 1 (Monsoon rush, hic, hair, tummy, the scrape until un-parked) with one line each on what would bring it back. Add the audit's §4 fold table as an appendix, or link it and summarise the "keep" rows, so his conditional yes is answered.

## 6. Leaks the draft misses, game by game

**Place:** Part 1, the "Evidence, leak, notes" column; the leak is named for about a third of the new games.

**What's wrong:** The research names a leak and a fix for every new game. The draft carries some and drops the rest. Missing:

| Game | Leak missed (and the fix) |
|---|---|
| Baking | a fill line or a picture of the amount is matching; "pour until it stops" is waiting. The jug has no fill line; the amount word decides when to stop |
| Breakfast skin | as drafted, nothing is decided by a new word: the sky sets the meal and the stations are unchanged. The child never has to hear "breakfast". It fails the leak test by having no test. The eggs station (owner plus verb) is the fix |
| Every named part treatable | a visible wound picks the part; a tool that gives the action away (tissue means blow) is matching; one scrape only is free. Fix: no clue until the part is tapped; tissue, cream and plaster on one tray; two or three scrapes |
| Introductions | leaks if the new person is the only stranger. Worse: the draft never says what the child's *move* is, so the leak test can't be run. Say what the child picks and which heard word picks it |
| Gifts and cake | a gift that suits its owner (the football for the boy) is matching: neutral boxes. The draft lists Toys (26) as carried, but with neutral boxes the toy is only named after the unwrap, so it rides, it doesn't decide |
| Look after the guests | a visible need (the child holding a string with no balloon) is the picture picking. The guest says it first; the face shows only after a try or at L1 |
| Snap the person named | one grandad in the room is picture matching: two of a kind (Grandad and the old neighbour) |
| Musical statues | poses in a fixed order are a pattern: shuffle |
| Who ate the cake? | "match a trace such as yellow paws to the suspect" is picture matching; the bot's "good" was run on English placeholders (audit flaw 2). The clue must be heard |
| Orchard | exactly three mangoes on the tree means pick them all; one fruit per tree means the tree picks |
| Adoption centre | one animal with one possible care means the animal picks; each animal needs several cares. Also: never let an animal suffer while the child is away (non-negotiable 7) |
| Safari | one of each animal is matching (L1 only); from L2, two elephants doing different things |
| Litter fishing | "clear it all" is waiting; fish or rubbish is a picture choice; one of each at L1 only |
| Beach stalls | one dish and one customer per stall means the zoom picks: two or three customers wait |
| Blackboard | a board with one shape is free |
| School bag | only school things in reach means the bag packs itself: toys as decoys |
| The morning routine | the draft's fix ("the order must be said, not known") keeps an ordering game, which the research says to drop: "Use do-it, not ordering". Ali does what Nani says; the verb decides |
| Sewing | a single visible fault means the picture picks; a card showing the finished garment from L2 is matching |
| Clock | waking in bed order is a pattern (shuffle); tapping every bed every hour is trial and error (first-tap badge only). And at L1, matching bedside digits to the wall clock is won by reading numerals, with no Kutchi heard; the settings map allows it as "supported", but only if the time is also said at L1 |
| Clean-up day | "switch off the light" when it's the only thing on is free (states start mixed); "clean everything" is waiting; Zafar's order-card picture is support at L1 only and must go from L2 |
| Chai's cheap add "it's gone cold" | if the cold glass is the only one without steam, the picture picks |

Two cross-cutting leaks are also unstated: **English placeholders** (a reader wins Find it's where game 17-25% and the dastarkhwan 95-100%; the fold carries that into the home games until Mum records the words) and the research's standing rule **"two words per move from level 2"**, which the draft applies to three games and not the rest.

**Evidence:** other-games research §1-§16 "Where it leaks"; audit flaw 2; mechanics research finding 1 and fixes (a)-(d).

**Change:** Give each game its own *Leak* column: the leak, the fix, and the level from which the fix must hold. State the two cross-cutting rules once at the top of Part 1.

## 7. Status, size and evidence misreports

**Place:** Part 1, several rows; Part 4 "Imbalances".

**What's wrong:**
1. **Snap is "built"** in three rows (party, farm, safari). The audit lists Snap among the six parked greybox modes on their own engines; moving it to the kit "is a rebuild, not a reskin" (§5 overlap 1). Its state is greybox.
2. **Pick it up and put it back: "Tidy's place engine, built".** Tidy up is greybox on its own engine (audit §1c). The shared put-it-in-its-place stage is designed, `built: false`. The research sized it "small to medium"; it is honest about the camera but the "built" misleads.
3. **The waiting room's main group is "Family (3)".** Its ladder today is man/woman/boy/girl, old/young, tall/short, a colour, with the baby (`pipeline.json`, audit §1b). Family words (grandad, aunty) are a proposed new rung, not what it carries. The grid's Family ● at C comes from this.
4. **The pharmacy and the send-off: main "Feelings (6)".** The pharmacy's words are clinic items, colours, numbers and order; only the send-off carries feelings. Split them or mark the pharmacy's groups.
5. **"numbers decide most moves (8 of 12)"** on the heal games row that lists the eight live games. The 8 of 12 counts the four parked ones; of the eight live it is four (knee, ear, boing, foot).
6. **The blackboard is "medium"** and the school bag "small". The research sizes the whole school day medium, with "a small new blackboard engine".
7. **The school routine row is "designed (pack the bag)"**, but the routine needs the do-it engine (new, shared with clean-up), not pack the bag.
8. **Part 4: "numbers in 10 settings"**; the grid's Homes column says 9.
9. **Greetings (1)** is not marked at M, though "Find it's shop games stay here" and Find it 3a (salaam, *khanigin*) is a greeting game; the corn stall at F gets a ○ for greetings instead. **Jobs (4)** gets ○ at C, Sc and E but not at M (the shopkeeper) or F (the farmer), which the row's own text names.
10. **Sea and beach (21) ● at Bt.** Litter fishing teaches household nouns in the water; the fish are the things you *don't* catch. Sea is an also at best.
11. **The adoption centre** is built from "the heal-game pattern". Zafar said "not a vet". Say how it stays a home for small animals and not a clinic reskin.
12. **The skeleton:** Zafar's answer to question 4 was "not sure", with Claude's gloss that the body chart answers it. The draft treats it as settled. Keep it in Part 5 until he says yes.

**Evidence:** audit §1b, §1c, §1d, §5; other-games research "Sizes at a glance"; `data/clinic/pipeline.json` waiting-room block; settings map §1 (Pets) and "Zafar's answers".

**Change:** Correct each cell. Use the audit's own labels (built / greybox / designed) plus new and parked, and never "built" for a greybox mode.

## 8. Non-negotiables not carried into the rows that need them

**Place:** Part 1: baking, the blackboard, the adoption centre; Part 4.

**What's wrong:**
- **Baking (non-negotiable 9):** the research says bake bread, naan or the party's cake, "never treats as prizes". The row says nothing, and a baking station drifts to cakes and biscuits by default.
- **The blackboard (non-negotiable 3):** the school A2 words include letter, word, read, write. A board where the teacher asks the child to write or read is written language for the child. The row should say the board holds shapes, counts, colours and drawings, never letters or words.
- **The adoption centre (non-negotiable 7 and 9):** the research's neglect-and-guilt pitfall is not in the row; and the wordlist's cultural note (dog and puppy: "many Muslim families do not keep dogs") means the animal list is Zafar's call. Neither is mentioned.
- **The clock (non-negotiable 7):** "waking someone late is a verdict" is in the research and not in the row.

**Evidence:** other-games research §7, §12, §14 pitfalls; wordlists §4 cultural filter; CLAUDE.md non-negotiables 3, 7, 9.

**Change:** One short "rules" note per affected row, and a line in Part 4 listing which non-negotiable each new game must be checked against.

## 9. Games doing the same job

**Place:** Part 1 "Unique point" column; Part 4 "Build once".

**What's wrong:** The settings map's own rule is "a game without a unique point should merge". These don't pass it:
1. **The breakfast skin** has none by the draft's own words ("a skin, not a station"). Either it is the eggs station (finding 4) or it is not a row.
2. **Litter fishing** is pack-the-bag's fetch in water; the draft says "weak as a game of its own" yet counts it as the boat's only game and gives Household things (10) a ● there. Make it one stage of the boat day and list the day's other stages (the ride on the water, which `days/boat.md` has and the draft drops).
3. **Snap the person named (P) and the waiting room (C)** both "pick the person described". The audit says the clinic owns that job (§5 overlap 6). The draft gives Family a ● in both. Decide which owns family words; the other carries them as an also.
4. **Clean-up day's folded boards** (toys in the box, make the bed, the shoe rack: audit §4) are placement games, the same job as pick it up and put it back. The draft's unique point for clean-up is home verbs with states. Keep clean-up to "do it to the thing" and send the sorting boards to pick it up, or say why not.
5. **Three "Nani says, do it" engines:** the pose picker (statues), do-it (the routine) and do-it-to-the-thing (clean-up). They are one engine with three skins: a thing with several actions, the verb picks one. Count it once.
6. **Corn stall (F), beach stalls (B), look after the guests (P)** are all Cook's order card. Fine as skins; say so and don't count them as games in the coverage total.

**Evidence:** settings map §2 ("The unique point is what no other game does; a game without one should merge"); audit §4, §5; other-games research §5, §10, §12, §15.

**Change:** Add a column "engine" to Part 1 and a line under Part 4 giving the count: how many engines, how many skins, how many games. Then "30 games" means something.

## 10. The structure hides what Zafar asked to see

**Place:** the whole draft.

**What's wrong:** Setting → game → group is the right spine (it's what he asked for). But:
- The grid's cells are dots, so the reader can't get from a ● back to the game that earns it without searching Part 1. Put the game's short code in the cell (e.g. "H&S", "Pick", "Clean").
- The grid has no targets, no "can hold", no "recorded" (findings 1 and 3). Without them it is a map of intentions.
- "Evidence, leak, notes" is three things in one cell. Split *Leak* out (finding 6).
- The verb grid has no verbs (finding 2).
- The group numbers follow the word-groups map, which differ from the wordlists research from 31 onwards (there, 31 is actions and 32 is question words). Anyone checking a target against `research-topic-wordlists` will read the wrong row. Say so in "How to read it", or add the wordlists' topic key.
- "Jobs, dotted" has an empty status cell.
- The draft has 40 game rows; Zafar approved 30. Say in one line what was split, added and dropped against Table A.
- Part 1's tables are 7 columns wide; fine on a laptop, not on his phone. If he reads on the phone, Part 1 needs one table per setting with fewer columns, and the notes under it.

**Change:** Cells name the game and its status letter; three number columns on the grid; a Leak column; a verb table; a one-line reconciliation with Table A.

## 11. The design order leaves out what is designed and unbuilt, and isn't tied to Mum's words

**Place:** Part 4 "Proposed design order".

**What's wrong:**
- The farm (feed, eggs, animals home, corn: all designed, none built) and the shops (designed, medium) are not in the order at all. They are the only trips with a day list and they still need design decisions (the eggs' openables, the animals' calling). Zafar's note says the farm and safari "need game modes".
- Sprint 16 is already the clinic (`docs/status.md`). The clinic's every-part work is un-parking built code and fits that sprint; it sits fourth.
- The draft says "each design should list its words first, so her next round can be planned from the designs", then orders designs without their words. Hide and seek needs the house's places and containers (no Kutchi today); pick it up needs positions (English today). Put the words beside each item in the order, and let Mum's next round decide the first three.
- Zafar's process (word-groups map, "The process") is: agree settings and modes, research, concept designs, ChatGPT mock-ups, rapid lab prototypes. The order should name which of those each item needs next (a mock-up, a lab, a Mum round).

**Evidence:** `docs/status.md` "Next chat" (Sprint 16 the clinic); settings map §1 (Animals); word-groups map "The process"; days.json stage flags.

**Change:** Add the farm and the shops; move the clinic to first or say why not; add a "words from Mum first" column; add a "next step" column (mock-up / lab / Mum).

## 12. Open questions for Zafar: missing ones

**Place:** Part 5.

**What's wrong:** The five questions are good (the nose safety one especially). Missing, from the findings above:
1. The eggs station: his station, or the draft's skin?
2. The beach: his four stages, or the stalls only?
3. The clock: fast on the wall (his), or slow at the hour (the research)? And must the time be said at L1?
4. Monsoon rush, hic, hair, tummy: stay parked, placed, or out?
5. The fold list (audit §4): does he agree row by row?
6. Numbers above ten: the shops' pay, or nowhere for now?
7. Describing words: the draft says "no game of its own, by design", but that is Claude's view (settings map §5 point 10), not his. Does he want one game where the describing word is the move (the X one, in contrast pairs)?
8. The adoption centre's animals: which, and no dog?
9. Snap: it serves three settings and is greybox; is its rebuild onto the kit agreed?
10. Which game owns Family: the party or the waiting room?

Question 4 as written ("did 'the lice game was a joke' mean the parked hair game is out?") cuts against his own note that the ear game gets a twin "for the nose, and for hair". Ask it as: the parked beetles game, or the ear's twin for hair, or neither?

**Change:** Add these as numbered choices with a recommendation each, in his "yes to all except" form.

## 13. Smaller points

- **"Careful"** (Zafar: Nani says it where something is tricky) has no home in the draft. The audit places it on the foot game's wince and the ear's deep blob. Add it to the clinic row; *dhyan rakh* is recorded.
- **Look after the guests** drops Zafar's own pair, "a hungry one gets food", from the examples. Put his first.
- **The town map** lists Household things (10) as an also for "I want a book"; a book is School (25).
- **Hide and seek** could mark Pets (20) as an also (Simba, Zazu, Kasuku are the only pets in a built setting). The grid shows pets at A only.
- **The diagnosis row** says "extend from 17 parts to the ~25". `pipeline.json` says 6 → 13 → 19 by level; the audit counted 7/12/17. Pick one source and cite it.
- **Part 2 "Status" key** has "gap (no home)" and no row uses it. Either the key is wrong or finding 1 is right that some rows should.

---

## Verdict

The spine is right and most rows are faithful to the research. But the draft does not yet do the job Zafar set: it shows that every group has somewhere to live, not that the games can carry the thousand words. "Covered" is counted in homes, many of them new, parked or English-only; the verbs, the biggest group, get nine ticks and no verbs; and four of his decisions are changed in passing. Fix findings 1 to 5 before he sees it: add the A2 target, the plausible-held and recorded columns, replace the verb grid with a verb list, mark each home's status in the cell, restore the eggs station and the beach stages, list the parked games and the fold table. Then the leak column (6) and the merges (9). The rest is tidying. One more pass, not a rewrite.
