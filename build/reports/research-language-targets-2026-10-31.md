# The language targets: what to teach, what we have, the gaps

For Zafar, 31 Oct 2026. This puts four research reports together, all in `build/reports/`, dated 31 Oct:
- `research-topic-wordlists` (what a child needs, by topic and level; 1,800-row CSV)
- `research-verbs-grammar` (verbs, verb forms, small words)
- `research-mechanics` (which game styles teach what)
- `research-word-inventory` (what the game has; 1,027-row CSV)

It is the base for the trip brainstorm: every trip is then aimed at the gaps below (`docs/game-design/days/TEMPLATE.md`).

## Headline

1. **The target can be counted.** About **300 words for Pre-A1, 600 for A1, 1,000 for A2** across 38 child topics. These come from Cambridge's children's lists (Starters, Movers, Flyers) merged with the toddler word checklist (the CDI).
2. **Verbs: 30 cover about 70%, not 80%.** In 3.6 million words of English said to children, the top 30 verbs make up 69% of the verbs a child hears. The top 40 make up 74%, and it takes 58 to reach 80%.
3. **We are near the start.** The game has 1,027 English meanings in its data, but only **166 have a family recording** on their own (16%). Against the Pre-A1 to A2 list, roughly 6% are recorded or heard inside a longer line.
4. **Recordings, not code, set the pace.** Reaching A1 is roughly 1,000 clips from Mum (600 words, about 260 verb forms, the common questions), against 166 meanings recorded today. So every trip has to earn its new words.
5. **Speaking works with 2-3 choices that sound different, slowly, never against a clock.** Today only the eye test's yes/no can run on real data.

## 1. The target (proposed)

| Level | Words (meanings) | Verbs | What the child can do |
|---|---|---|---|
| Pre-A1 | about 300 | about 20, as commands | knows the everyday words of Nani's house said slowly in a known scene |
| **A1 (proposed store target)** | **about 600** | **top 40**, commands plus present plus "want to / can" | follows short sentences and questions about the house, food, people and play; answers and asks in fixed frames |
| A2 (after launch, through the stories) | about 1,000 | top 40 to 60 with past and future | follows the day and simple stories; describes things in fixed phrases |
| Towards B1 | about 1,500 | | only with the family talking; not a game target |

About a quarter of each band is small words and fixed phrases ("and", "want to", "come here"). The small words, ranked, are in `research-verbs-grammar` §7.

**The honest claim we could make at A1:** "about 600 everyday words, and the 40 verbs that make up about three-quarters of the verbs young children hear (from studies of English)." It is a stand-in for Kutchi, because no Kutchi word-count study exists.

## 2. What we have

- **1,027 meanings** in the data:
  - 166 recorded on their own: 83 words and 83 whole lines
  - 805 in the engine without a recording; 321 of these have Kutchi, 484 are English only
  - 56 only named in docs
- **Real family takes:** 573 usable (Mum 424, Zafar 149). Another 314 rows have no file, and 43 need a redo.
- **Verbs:** 61 in the engine, 10 recorded, mostly as a command to a child. Of the top 40 verbs, 13 aren't in the engine at all: know, think, play, tell, try, find, read, remember, call, hold, show, fall and push. Drink, sleep and hear are also missing.
- **Speaking:** only the eye test's yes/no has the takes it needs. The chai microphone stays hidden until Mum records *chai*, *paani* and *dudh* as single words.
- **Docs against data:** of 51 "recorded" marks in the trip docs, 33 hold. The farm's marks are corrected (`farm.md`, `TEMPLATE.md`).
- **Fix-list rows added:**
  - **LNG-20:** 29 takes that nothing links to, including *Khuda hafiz!*
  - **LNG-21:** check that a new recording reaches the microphone

## 3. The gaps by topic

The A1 target per topic is from `research-topic-wordlists` §2. "Recorded or heard" is a rough match of the two CSVs by English word, so treat it as a guide, not a count.

**Topics that have a home and some words:** food (A1 target 60; about 18 recorded or heard), cooking (15; about 8), greetings (20; 5), family (25; 3), body and health (45; about 6). These are the kitchen and the clinic. Their gap is mostly recording, not games.

**Topics designed into a trip but almost unrecorded:**

| Topic | Planned home |
|---|---|
| farm animals | the farm |
| weather | the door |
| clothes | Pack the bag, Dress up |
| numbers | Count, the shops |
| positions | Put it in its place |
| colours and sizes | Snap |
| money | the shops |
| sea and beach | the beach |

**Topics with no home yet** (A1 target in brackets):

| Group | Topics |
|---|---|
| The biggest gaps | actions and verbs (55), describing words (30), time and days (18), school and learning (15), toys and play (15), places in town (10), transport (12, partly the ride), wild animals (12, the safari idea), sports and games (10), music and arts (10), routines (12), celebrations (8, the Birthday arc), jobs (8), small animals (12), plants (7), sounds and baby games (14), technology (4) |
| The grammar glue | question words (9), pronouns and "mine/yours" (20), quantities (12), linking words (8) |

The glue isn't a topic for one trip: every trip has to carry some of it.

## 4. Which game styles fill which gap

These are from `research-mechanics`, top 10. The rule behind all of them: **the heard word must be the move, not a toll before the fun.**

| Gap | Best styles | Speaking? |
|---|---|---|
| verbs | **Nani says, do it** (one thing, several actions, the verb picks); **Who's doing it?**; **You be Nani**, where the child gives the order | yes, in You be Nani |
| describing words | **The X one**: all the same thing, in pairs that contrast (big/small, hot/cold, full/empty first; colours come slowly) | |
| positions | **Put it where**, then **Tell Ali where**; "under" after "in" and "on"; the place mustn't give the answer away | yes, in Tell Ali |
| questions | **Ask to find out**: something hidden, a family member who knows, 2-3 heard questions. It's the only style that makes the child *ask* | yes |
| nouns, numbers | **Shopkeeper, both ways**; **Call it over** (2 names, the animal comes); **Behind the screen** | yes |
| any topic, recall | **What's missing**, answered by voice; an action chant on the ride | |

**The four-choice quiz (Millionaire):** a poor fit for ages 3-5. For 6-8 it works as one fair stall with three heard choices, "phone Nani" as a replay, no 50:50, and a ladder that only goes up.

**The arcade trip:** worth doing as a fair day if every machine is an existing game in a new skin:
- nothing leaves before it has been asked
- no timers, no chance, no near-misses
- the crane never misses, and the coin pusher drops exactly the number asked
- prizes are stickers or a toy for Ali
- listening only, because fast voice play is where recognition fails

## 5. What this means for recording (Mum's time)

- **Verbs:** record every form of about 25 simple verbs, plus "do", "become" and "give". After that, a new action built as noun plus "do" costs one clip instead of about 20. The top 40 verbs to A1 are about 260 clips; to A2 about 550.
- **"To me" verbs** (want, like, need, know, remember) need about 3 forms per tense, not 6.
- **Numbers:** each number to 100 is its own word in Kutchi. Counting to 20 is 20 clips.
- **Family words:** aunt and uncle split four ways in Kutchi.
- **Questions** are a rising voice, so the common ones need whole-sentence takes.
- **The 37 class-handout words** (most fruit and vegetables, the spices, the numbers 6-10) are unconfirmed by Mum. No trip should be planned on them.

## 6. A first map for the brainstorm (not decided)

A starting point only, so the 12 trips share out the topics. Each trip owns one or two main topics and carries some of the glue.

| Trip | Main topics | Glue it carries |
|---|---|---|
| The farm (designed) | farm animals, farm food | numbers 1-5, big and small, under |
| The shops (designed) | money, food, clothes | numbers, "how much?", want |
| The beach (designed) | sea and beach, weather | describing words, three stalls |
| The safari (idea) | wild animals, colours | sizes, Who's doing it?, Snap from the jeep |
| The boat (idea) | litter fishing: household objects, sea | quantities, sorting |
| The arcade or fair (idea) | toys and play, numbers to 20, shapes | colours |
| The park and playground | verbs (Nani says, do it), body | positions, sports |
| A cousin's school or nursery | school and learning, music and arts | time, question words |
| The station or airport (collecting Masi) | transport, places in town | time, days |
| Nani's garden | plants, small animals, weather | verbs: dig, water, grow |
| A wedding or Eid day | celebrations, family, clothes | describing words, mine/yours |
| Morning and bedtime at Nani's | routines, home, household objects | time, verbs |

The kitchen and the clinic stay as they are and keep food, cooking, body and health.

## 7. For Zafar (yes to all except ...)

1. **The store target is A1:** about 600 words, the top 40 verbs as commands, present and "want to / can", the ranked small words. A2 comes after launch, through the stories. *Recommended.*
2. **The verb plan:** Mum's next rounds lead with 25 simple verbs plus "do", "become" and "give", the numbers 1-20 and the commonest whole questions. *Recommended.*
3. **The map in §6 is the starting point for the brainstorm,** and every trip uses `TEMPLATE.md` (its farm example now shows the corrected marks). *Recommended.*
4. **Food words to check (halal):** pig, sausage, burger, meatballs and jelly. *Recommended:* drop pig, sausage and jelly; keep burger and meatballs, which can be halal.
5. **Songs:** a family member singing, and instruments, are your call. A clapping chant needs neither. *Recommended:* the clapping chant first.
6. **The arcade** with the rules in §4, and the quiz as one stall for older children only. *Recommended.*

## Limits

- The word lists are English (and American for the toddler checklist). Mum decides which words have a natural Kutchi word.
- The verb coverage is from English speech to children. The light-verb evidence is from written Hindi and Urdu.
- The topic gap figures match the two CSVs by English word, so a word worded differently counts as missing.
- No audio was played; the inventory reads the transcripts in `family-audio.json`.
