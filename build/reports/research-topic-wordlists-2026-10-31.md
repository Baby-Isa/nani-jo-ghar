# Which topics and words a young learner needs: one merged list, sized

Research note, 31 Oct 2026. It builds on `s12-research-cefr-and-book.md` (levels, the game's ceiling) and `s12-research-a1-to-native.md` (hours, vocabulary per level, A2 recording cost). It does not repeat them. English meanings only; Mum decides every Kutchi word.

The word list is `research-topic-wordlists-2026-10-31.csv` (1,800 rows). It uses the parallel inventory's topic names, so the two files join on `topic` and `english`.

## Headline

- The best-fitting sources are the Cambridge Young Learners lists (Pre A1 Starters, A1 Movers, A2 Flyers: children, by topic, by level) and the MacArthur-Bates CDI (what toddlers actually say). I opened both, plus the A2 Key and B1 Preliminary lists and the Oxford 3000, and merged them.
- They agree on one child's world: family, body, food, home, clothes, animals, colours, numbers, play, weather, getting about. 72% of the words most American 2½-year-olds say are also on the Cambridge children's lists.
- A sensible core for this game: **about 300 words for Pre-A1, about 600 for solid A1 listening, about 1,000 for A2, about 1,500 "towards B1"** (child topics only), across 38 topics. So Zafar can say: "about 1,000 words across 38 topics, Pre-A1 to A2, and towards B1."
- That is a count of meanings, not recordings. Kutchi needs more clips than English words: numbers 1 to 100 are each their own word, "aunt" and "uncle" split four ways, and verbs need several forms.
- Adult topics (work, money matters, news, politics, documents, the environment as an issue) can be dropped or cut to a few child words. Pork, alcohol and other religions' festivals are marked `drop` in the list, not removed.

## 1. Sources, and how they agree

### What I used

| Source | What it is | Size | Status |
|---|---|---|---|
| Cambridge Pre A1 Starters, A1 Movers, A2 Flyers wordlists (2025 edition, with a thematic list) | Exam lists for children aged 6–12, by level and by 19 topics | 483 / 375 / 476 new words per level after names are removed (1,334 in all) | read (PDF parsed) |
| MacArthur-Bates CDI, Words and Sentences (American English) | Parent checklist of what children aged 16–30 months say | 680 words, 22 categories | read (Wordbank instrument file) |
| Wordbank norming data for the CDI (Marchman norming sample) | 1,413 children aged 16–31 months, word by word | used to compute, for each word, the share of children who say it at 24 and 30 months | read (raw data parsed) |
| A2 Key and Key for Schools vocabulary list (2025 update) | Exam list with 25 topic lists | 1,535 headwords | read |
| B1 Preliminary and Preliminary for Schools vocabulary list | Exam list with 23 topic lists | 2,971 headwords | read |
| Oxford 3000 (with CEFR levels) | Most important 3,000 words for adult learners, A1 to B2 | 2,955 parsed | read |
| Council of Europe Threshold 1990 | The 14 themes behind Key and Preliminary | themes only | read (theme list page) |
| Council of Europe Waystage 1990 | Same themes at A2 | themes only | summary (page refused) |
| CEFR Companion Volume (2018/2020) | Vocabulary range scale; young-learner descriptors | A2: "sufficient vocabulary for … basic communicative needs"; no separate Pre-A1 vocabulary descriptor found | summary (PDF refused, 403); earlier reports read the young-learner samples |
| Cambridge research note on the 2020 Key and Preliminary lists | How the lists were built | Key began from Waystage, Preliminary from Threshold; now corpus-checked | read |
| Pearson GSE Vocabulary for Young Learners (6–11) | 3,081 word meanings, 27 topics, teacher-rated usefulness | children learn about 500 words a year in good conditions; 3,000 is the primary target | read (paper; topic names not in it) |
| English Vocabulary Profile | Cambridge's level for each word sense, A1–C2 | not counted | summary (site not opened) |
| Bangla CDI (Alam, Ballard and Hand, *Te Reo* 2026) | Full-length Bangla adaptation, 613 items, 21 categories | pilot, 23 children | read |
| Hindi CDI (Rawal and Carstensen, CogSci 2026) | Three earlier Hindi CDIs merged; 961-item pool being normed | n = 138 so far; not public yet | read (abstract only) |
| Urdu CDI (Dar, Anwaar, Vihman, Keren-Portnoy 2015) | Built from interviews with Urdu- and Pashto-speaking mothers | pilot, 17 children | summary (abstract) |
| Sindhi CDI short form (Rasheed et al. 2017, rural Pakistan) | 258 short-form words cut to 100 | validated, alphas 0.96–0.98 | read (abstract page) |
| Pearson Edexcel GCSE Gujarati (Issue 4, 2022) | UK heritage-language exam for teenagers | 5 themes | read |
| AQA and Edexcel GCSE Urdu | Same design (3 and 5 themes) | themes only | summary |
| Sindhi primers (CIIL/NCERT), Oxford *Sauwli Sindhi* 1–5 | Early-years and primary Sindhi courses | not opened | summary |
| Kutchi teaching material | None found beyond uTalk, FreeLang and a lessons page | — | summary |

No Gujarati or Kutchi CDI exists that I could find. The Hindi and Urdu ones are not public.

### Where they agree

- **The children's lists and the toddler list share a core.** Of the 571 CDI words that most children say by 30 months, 412 (72%) are on a Cambridge children's list. 469 words are on both. 948 rows sit in four or more of the five lists; 363 sit in all five. Those are the safest words.
- **The Cambridge children's ladder climbs away from the toddler world.** 55% of Starters words are CDI words, 34% of Movers, 16% of Flyers. Starters is the 3–6 year old's world; Flyers is a primary-school pupil's.
- **The children's lists sit inside the adult A2 and B1 lists.** 74–80% of each children's level is on A2 Key; 85–88% is on B1 Preliminary. So "A2 for a child" is a child-shaped slice of A2, not a different language.
- **Children's levels follow pictures, not adult frequency.** Against the Oxford 3000: Starters is 65% A1; Movers 51% A1 and 19% A2; Flyers 41% A1 and 28% A2. About a quarter of every children's level is not in the Oxford 3000 at all (crocodile, kite, crayon, jellyfish). The same holds for 32% of CDI words. Children learn what they can see and touch first.
- **The topics agree.** About fifteen topics appear in every source: family and friends, body, food and drink, clothes, home, animals, colours, numbers, time, weather, transport, school, places, play and sport, health. Threshold's 14 themes, Key's 25, Preliminary's 23, Cambridge's 19 children's themes and Pearson's 27 all organise around them.
- **The South Asian adaptations push the same way, and further.** The Bangla CDI gives food 97 items against 68 in English, because feeding is where caregivers name things. It adds many kinship words (maternal and paternal grandparents, aunts and uncles are different words), a "common expressions" category ("come here", "be careful") and local things (rickshaw, mosquito, biryani). It drops sled, penguin and snowsuit. Experts asked for Muslim kinship forms alongside Hindu ones. All of this fits a Kutchi family.

### Where they differ

- **The CDI alone has** animal and vehicle sounds and baby games (none of its 20 are on Cambridge lists), helping words ("wanna", "gonna", "let me"), farm animals, and kitchen and household things. These are the toddler's words.
- **The Cambridge children's lists alone have** school, sport, town places, jobs, the clock and calendar, and technology. These are the school child's words.
- **Key and Preliminary add** adult topics: services, documents and texts, communications technology, work and jobs, the environment as an issue, measurements.
- **The GCSE heritage curricula are for teenagers.** Gujarati GCSE themes are identity and culture, local area and travel, school, future study and work, and global issues. Only the first ("Who am I?", daily life, celebrations and festivals) suits a young child; it confirms that family, food, festivals and daily life are the heart of a heritage course.
- **Cultural content.** Cambridge excludes "sensitive" topics (war, politics), and its lists have no pork, alcohol or Christmas. The Oxford 3000 has beer and wine at A1 and church at A2. The CDI has church (an optional item), pig, sausage and "this little piggy".

## 2. The master topic list

38 topics. I kept all 36 from the shared list and added two, both CDI categories:
- **sounds-baby-games** (animal and vehicle sounds, "uh oh", peekaboo). The CDI shows these are among a child's very first words; the parallel inventory calls this `other:sounds`.
- **linking-helping-words** ("and", "because", "then", "can", "want to", "going to"). The CDI and Cambridge grammar lists both have them, and the engine needs them for whole sentences; the inventory calls this `other:grammar-words`. Its `other:small-talk` maps to greetings-politeness.

Other choices: feelings stay inside health-feelings (Cambridge and Key keep them apart; the game's clinic joins them). Materials (paper, wood, plastic) go into describing-words. Cambridge's "Names" topic is dropped.

Targets are cumulative word counts (meanings) for a child who reaches that level in this game. "In list" is how many rows the CSV holds for that topic at all levels, leaving out `low` and `drop` rows; the targets are a choice from that pool. "Inventory" is the row count for that topic in the parallel `research-word-inventory-2026-10-31.csv`, for scale only.

| # | Topic | Why a young child needs it | Pre-A1 | A1 | A2 | B1 | In list | Inventory |
|---|---|---|---|---|---|---|---|---|
| 1 | greetings-politeness | First social words; every scene opens and closes with them | 12 | 20 | 30 | 40 | 47 | 39 (+26 small talk) |
| 2 | sounds-baby-games | Among the very first words; cheap and fun to record | 10 | 14 | 15 | 15 | 19 | 41 |
| 3 | family-people | Nani's house is about people; kinship is richer in Kutchi | 14 | 25 | 35 | 45 | 43 | 27 |
| 4 | jobs-people | Helpers a child meets: doctor, teacher, driver | 2 | 8 | 18 | 30 | 32 | 5 |
| 5 | body | Pointing, dressing, the clinic | 15 | 25 | 32 | 42 | 43 | 25 |
| 6 | health-feelings | Saying how you feel and what hurts; the clinic | 6 | 20 | 40 | 60 | 81 | 131 |
| 7 | food-drink | The biggest early topic in every CDI; the kitchen mode | 30 | 60 | 90 | 120 | 132 | 100 |
| 8 | cooking-kitchen | Helping Nani cook; things and actions | 6 | 15 | 25 | 35 | 42 | 126 |
| 9 | home-rooms | Where things are in the house | 12 | 25 | 40 | 55 | 64 | 19 |
| 10 | household-objects | Fetch-and-find games | 10 | 20 | 32 | 45 | 48 | 46 |
| 11 | clothes | Dressing, packing, weather | 10 | 20 | 35 | 50 | 61 | 23 |
| 12 | colours | Describing and finding ("the red one") | 6 | 11 | 14 | 18 | 18 | 20 |
| 13 | shapes-sizes | Big and small, long and short | 4 | 10 | 16 | 20 | 22 | 13 |
| 14 | numbers-counting | Counting games; in Kutchi each number to 100 is its own word | 10 | 22 | 40 | 100 | 53 | 15 |
| 15 | money-shopping | Play shop and market trips | 2 | 6 | 14 | 22 | 22 | 12 |
| 16 | time-days-seasons | Today, tomorrow, morning, night; days at A1, months at A2 | 6 | 18 | 35 | 50 | 71 | 13 |
| 17 | weather-nature | Rain, sun, monsoon; outings | 4 | 12 | 25 | 40 | 58 | 18 |
| 18 | animals-farm | Kutch farm life; early words | 7 | 12 | 15 | 18 | 17 | 14 |
| 19 | animals-wild | Picture books and the zoo | 6 | 12 | 20 | 28 | 33 | 7 |
| 20 | animals-pets-small | Cats, birds, insects in the yard | 6 | 12 | 18 | 24 | 26 | 8 |
| 21 | sea-beach | Kutch and the coast; trips | 4 | 8 | 14 | 20 | 22 | 10 |
| 22 | plants-garden | Nani's garden; growing things | 3 | 7 | 11 | 16 | 17 | 5 |
| 23 | places-town | Trips out: park, shop, mosque, station | 3 | 10 | 22 | 35 | 47 | 9 |
| 24 | transport-travel | Getting there; the window ride | 6 | 12 | 20 | 30 | 45 | 16 |
| 25 | school-learning | Classroom words a school child hears | 6 | 15 | 30 | 45 | 81 | 1 |
| 26 | toys-play | Play is the child's work | 8 | 15 | 22 | 26 | 30 | 3 |
| 27 | sports-games | Running, catching, cricket | 4 | 10 | 18 | 28 | 54 | 0 |
| 28 | music-arts | Songs, drawing, stories | 5 | 10 | 18 | 28 | 33 | 0 |
| 29 | positions-directions | "Put it under the table"; needed for Put it in its place | 8 | 16 | 28 | 35 | 52 | 50 |
| 30 | describing-words | Hot, wet, dirty, broken; needed for I-spy and Describe | 12 | 30 | 60 | 90 | 111 | 27 |
| 31 | actions | Verbs make sentences; "Nani says, do it" | 25 | 55 | 100 | 150 | 106 | 82 |
| 32 | question-words | Who, what, where: the step to A1 interaction | 5 | 9 | 12 | 12 | 12 | 24 |
| 33 | pronouns-possession | Me, mine, yours, this, that | 10 | 20 | 28 | 32 | 34 | 24 |
| 34 | quantities | More, all, some, none; "all gone" | 6 | 12 | 20 | 25 | 26 | 20 |
| 35 | linking-helping-words | And, then, because, want to, can | 3 | 8 | 18 | 28 | 35 | 13 |
| 36 | celebrations | Eid, birthdays, weddings | 3 | 8 | 14 | 20 | 16 | 3 |
| 37 | routines-daily-life | Wake, wash, eat, nap, bed: the day's spine | 6 | 12 | 18 | 22 | 23 | 12 |
| 38 | technology | A few words only (phone, tablet, computer) | 1 | 4 | 8 | 14 | 18 | 4 |
| | **Total** | | **296** | **628** | **1,050** | **1,513** | | |

Where a target is above "in list" (actions, numbers, celebrations and family-people at B1), the extra words must come from the family, not from these lists.

### The most important words per topic

Ranked by level, by how many lists include the word, and by how many toddlers say it. A word can matter in two topics; the CSV files it once. The CSV has the rest.

1. **greetings-politeness:** hello, hi, bye, goodbye, yes, no, please, thank you, sorry, well done, come here, be careful, salaam (greeting), night night, OK, excuse me, see you, oh dear, don't worry, me too, all right, you're welcome.
2. **sounds-baby-games:** moo, baa baa, meow, woof woof, quack quack, cockadoodledoo, choo choo, vroom, yum yum, uh oh, ouch, shh, peekaboo, boo-boo (a small hurt), give me five!, so big!
3. **family-people:** mum, dad, Nani (mother's mother), Nana (mother's father), Dada, Dadi, baby, brother, sister, grandma, grandpa, mother's sister, mother's brother, father's brother, father's sister, aunt, uncle, cousin, boy, girl, man, woman, child, friend, family, people, son, daughter, grown-up.
4. **jobs-people:** teacher, doctor, nurse, dentist, police, firefighter, driver, farmer, cook, postman, pilot, clown, worker, shopkeeper, chef, artist, job, work.
5. **body:** head, hair, eye, ear, nose, mouth, tooth, tongue, face, hand, finger, arm, leg, foot, toe, knee, stomach (tummy), back, neck, shoulder, cheek, chin, lips, belly button, body, smile, skin, blood.
6. **health-feelings:** happy, sad, angry, scared, tired, sleepy, hungry, thirsty, hurt, it hurts, sick, ill, cry, laugh, love, like, medicine, doctor's words (a cold, cough, temperature, headache, stomach-ache, toothache), better, fine, brave, careful, bored, excited, worried.
7. **food-drink:** milk, water, juice, bread, rice, chapati, dal, egg, banana, apple, mango, orange, grape, cheese, butter, yoghurt, chicken (food), fish (food), meat, potato, carrot, onion, tomato, pea, chai, soup, curry, food, drink, breakfast, lunch, dinner, snack, cake, ice cream.
8. **cooking-kitchen:** cup, glass, bottle, bowl, plate, spoon, fork, knife, pot, pan, kitchen, fridge, oven, stove, sink, cook, cut, pour, mix, spill, wash up, bake, boil, fry.
9. **home-rooms:** house, home, room, kitchen, bathroom, bedroom, living room, door, window, wall, floor, roof, stairs, bed, chair, table, sofa, cupboard, shelf, bath, shower, toilet, mirror, lamp, key, blanket, pillow, garden, fan.
10. **household-objects:** phone, light, clock, watch, television, radio, camera, box, bag, basket, towel, soap, toothbrush, toothpaste, comb, brush, broom, bucket, scissors, paper, picture, photo, rubbish, glasses, umbrella, button, tissue.
11. **clothes:** clothes, shirt, T-shirt, trousers, shorts, dress, skirt, jumper, jacket, coat, hat, cap, shoe, sock, sandals, boots, pyjamas, scarf, headscarf, kurta, gloves, belt, bag, pocket, wear, put on, take off, get dressed.
12. **colours:** red, blue, yellow, green, black, white, orange, pink, purple, brown, grey, colour, dark, light, gold, silver, striped, spotted.
13. **shapes-sizes:** big, small, little, long, short, tall, round, circle, square, triangle, line, heavy, high, low, huge, tiny, half, middle, shape.
14. **numbers-counting:** one to ten, eleven to twenty, thirty to hundred in tens, count, number, first, second, third, last, pair, both, half, add, double.
15. **money-shopping:** money, shop, buy, pay, price, cost, cheap, expensive, market, supermarket, shopping, sell, coin, purse, wallet, change.
16. **time-days-seasons:** day, night, morning, afternoon, evening, today, tomorrow, yesterday, now, later, soon, again, before, after, always, never, sometimes, week, weekend, the seven days, year, o'clock, time, summer, winter, monsoon, birthday.
17. **weather-nature:** sun, rain, wind, cloud, sky, moon, star, hot, cold, sunny, windy, rainy, cloudy, storm, thunder, lightning, rainbow, weather, river, mountain, hill, field, forest, desert, stone, sand, fire, water.
18. **animals-farm:** cow, buffalo, goat, sheep, camel, horse, donkey, chicken (animal), hen, rooster, duck, goose, lamb, pony, farm.
19. **animals-wild:** animal, lion, tiger, elephant, monkey, bear, giraffe, zebra, snake, crocodile, hippo, deer, wolf, fox, owl, peacock, parrot, penguin, zoo, wild.
20. **animals-pets-small:** cat, kitten, dog, puppy, bird, rabbit, mouse, fish, frog, lizard, bee, ant, fly, spider, butterfly, mosquito, snail, bug, insect, pet, tail, wing.
21. **sea-beach:** sea, beach, sand, shell, wave, fish, crab, jellyfish, dolphin, whale, shark, boat, swim, swimming pool, ocean, seaside, coast, fishing.
22. **plants-garden:** tree, flower, grass, leaf, plant, garden, seed, grow, water (the plants), dig, branch, root, fruit, stick.
23. **places-town:** park, shop, street, road, town, city, village, mosque, school, hospital, station, bus stop, market, library, cinema, café, restaurant, playground, zoo, bridge, building, airport.
24. **transport-travel:** car, bus, train, plane, boat, ship, bike, motorbike, lorry, tractor, rickshaw, taxi, helicopter, go, come, ride, drive, fly, ticket, trip, holiday, suitcase.
25. **school-learning:** school, teacher, class, book, pen, pencil, crayon, paper, page, word, letter, read, write, draw, listen, look, answer, question, learn, know, understand, remember, right, wrong, easy, hard.
26. **toys-play:** toy, ball, doll, teddy, balloon, block, bubbles, kite, puzzle, game, play, swing, slide, hide-and-seek, hide, chase, robot, monster, board game, fun, bounce.
27. **sports-games:** run, jump, throw, catch, kick, hit, swim, climb, ride, race, win, lose, team, ball, football, cricket, bat, goal, play, sport.
28. **music-arts:** sing, song, dance, music, draw, drawing, paint, picture, story, clap, drum, guitar, piano, film, cartoon, poem, noise, sound.
29. **positions-directions:** in, on, under, behind, in front of, next to, between, up, down, out, off, over, here, there, near, far, inside, outside, top, bottom, left, right, around, away, back, into.
30. **describing-words:** hot, cold, wet, dry, clean, dirty, broken, good, bad, nice, pretty, beautiful, new, old, young, fast, slow, loud, quiet, soft, hard, full, empty, heavy, funny, scary, same, different, all gone, very.
31. **actions:** eat, drink, sleep, sit, stand, walk, run, jump, go, come, give, take, bring, put, get, hold, open, close, wash, cook, cut, look, see, watch, listen, hear, say, talk, sing, play, help, wait, stop, push, pull, throw, catch, fall, hug, kiss, make, want, find, carry, climb.
32. **question-words:** what, who, where, when, why, how, which, whose, how many, how much, how old.
33. **pronouns-possession:** I, me, my, mine, you, your, yours, he, him, his, she, her, it, we, us, our, they, them, their, this, that, these, those, myself.
34. **quantities:** more, all, some, any, none, not, a lot, lots of, many, much, a little, bit, every, each, another, other, enough, piece, all gone.
35. **linking-helping-words:** and, but, or, then, because, so, if, can, can't, want to, need to, have to, going to, let me, is, am, are, was, did, don't, will.
36. **celebrations:** Eid, Eid greeting, birthday, party, present, wedding, mithai (at a celebration), new clothes, mehndi, invite, guest, celebrate, candle, balloon, cake, fireworks.
37. **routines-daily-life:** wake up, get up, wash, bath, brush teeth, get dressed, breakfast, nap, go to bed, go to sleep, dream, help, tidy, sweep, wipe, wait, hurry, live, stay.
38. **technology:** phone, tablet, computer, television, video, laptop, screen, headphones, video game, switch on, switch off.

## 3. How big a core

The evidence, in one place:
- **Cambridge children's ladder:** 483 words for Pre-A1, about 860 by A1, about 1,330 by A2 (names removed; includes function words).
- **CDI and Wordbank:** 239 words are said by most children at 24 months, 588 at 30 months. The 680-word list is about the ceiling of a 2½-year-old.
- **Adult figures (earlier report):** A1 under 1,500 lemmas (Milton); A2 1,500–2,500, or the first 1,000 word families (Nation).
- **Pearson young learners:** about 500 words a year in good classroom conditions; 3,000 by the end of primary.
- **Game time:** 15 minutes a day is about 90 hours a year (earlier report). At 500 words a year that is one year to A1 and two to A2, matching the earlier estimate.

Recommendation:

| Level | Core size (meanings) | What it means for the child | Reasoning |
|---|---|---|---|
| Pre-A1 | **about 300** | Knows the everyday words of Nani's house when said slowly in a known scene | Overlap of Starters and the 24-month CDI words, plus the family additions; a few hundred is the CEFR's "half-way to A1" |
| A1 | **about 600** | Follows short sentences and questions about the house, food, people and play, with pictures | Most of Starters plus the CDI 30-month words and a third of Movers; matches the earlier report's 300–500 content words plus about 100 function words |
| A2 | **about 1,000** | Follows the day, simple stories and descriptions; answers in fixed phrases | Starters and Movers in child topics plus the child half of Flyers; one year of game time beyond A1 |
| Towards B1 | **about 1,500** | Follows longer stories about familiar things | Child topics only; real B1 needs 2,000–3,000 (earlier report), which needs family talk, not more game words |

About a quarter of each band is function words and phrases ("the", "and", "can", "want to", "come here"). So "1,000 words" is roughly 750 things, actions and descriptions plus 250 grammar words and fixed phrases.

What it costs in recordings (words are not clips):
- **Numbers:** Kutchi, like Gujarati and Hindi, has a separate word for each number to 100. Counting to 20 is 20 clips; to 100 is 100.
- **Kinship:** "aunt" and "uncle" are four words each side of the family; grandparents split by side too (the Bangla CDI found the same).
- **Verbs and describing words** change form for gender, number and tense; the earlier report's A2 estimate (400–700 extra clips for verb forms) still stands.
- **Plain nouns** are one clip each, plus a plural where it changes.

## 4. Ages 3–8: what to keep and what to drop

**Keep, from age 3:** greetings, sounds and baby games, family, body, food, kitchen, home, household things, clothes, colours, big and small, counting to ten, animals (all three), toys and play, positions, describing words, actions, question words, pronouns, quantities, routines, celebrations.

**Keep, from about 5:** health and feelings in full, numbers to 20 and then 100, time and days, weather and nature, sea and beach, plants, places in town, transport, school, sport, music and art, linking words, money (play shop).

**Cut to a child's slice:**
- jobs-people: helpers a child meets (doctor, nurse, teacher, driver, farmer, shopkeeper). Not manager, engineer, journalist, businessman.
- places-town: park, shop, market, mosque, school, hospital, station, playground. Not university, bank, post office, stadium, skyscraper.
- school-learning: classroom words. Not geography, history, science, timetable, subject.
- technology: phone, tablet, computer, television, video. Not email, website, password, internet, app.
- time: today, tomorrow, morning, night, days. Months and clock times at A2 only (the family may use English months anyway).
- money-shopping: buy, pay, money, shop. Not credit card, receipt, customer.

**Drop as adult-only** (they are in Key, Preliminary or the GCSE, not in the children's lists): work and careers, business, politics and war, documents and texts, services (banking, post), communications technology, the environment as an issue, news and media, measurements, travel documents (passport, customs), accommodation, "future aspirations". The CSV marks most of these `low`.

**Cultural filter (rows kept and marked):**
- `drop`: beer, wine, alcohol, pub, bar (Oxford 3000 only); church (CDI; a `mosque` row is added); "this little piggy" (pig rhyme); cowboy, moose, sled, sledge, snowsuit (not this family's world); two private body words (CDI).
- `check` (family decides): pig (animal, not food), sausage, burger, hamburger and meatballs (halal only), jelly (gelatine), babysitter, bottom, pray, religion, pirate.
- `note`: sweets, chocolate, lollipop, biscuit, cake, ice lolly, gum, doughnut, pudding and prize stay as food or race words only, never as rewards. Dog and puppy carry a note: common in books, but many Muslim families do not keep dogs.
- Cambridge's lists already leave out pork, alcohol and Christmas. No Easter, Christmas or Halloween row appears in any list I merged, so none needed marking.

## 5. Flaws and limits

- **English lists measure English concepts.** Kutchi divides some meanings more finely (kinship, respect forms) and others less (one word may cover two English ones). The counts are meanings, not Kutchi words.
- **The CDI is American toddlers.** It has lawn mower, sprinkler, sandbox, Cheerios and peanut butter. I kept them with the CDI's own figure and let the family judge; the Bangla and Sindhi adaptations show local lists drop 15–60% of items.
- **My level mapping for CDI words is a convention, not a standard.** Said by most children at 24 months counts as Pre-A1; at 30 months, A1; later, A2. A word gets the lower of its Cambridge and CDI levels.
- **Cambridge's children's lists are for EFL pupils of 6–12 in school.** They lean on school and sport and miss toddler words. The CDI corrects that for the youngest.
- **The 216 extension rows (A2 Key and B1 Preliminary topic words) are my own pick** of child-relevant words, marked `extension`. The 50 `added` rows are also mine: 39 family words (Nani, chapati, Eid, rickshaw) that follow the Bangla CDI pattern, and 11 everyday child words the lists happen to miss (pot, fox, crab, wake up, brush teeth, can't). Where Key, Preliminary or Oxford has the word, `sources` says so.
- **Topic placement is a judgement.** Each word sits in one topic; words with two meanings (chicken, fish, orange, watch, glass, fly, bat, letter, right) have two rows.
- **Not opened:** the English Vocabulary Profile (needs the site); the CEFR Companion Volume PDF (403); the Waystage chapter (503); the Hindi and Urdu CDI word lists (not public). Pearson's 27 young-learner topic names are not in its paper.
- **No Kutchi, Gujarati or Sindhi child word list exists** that I could find. The South Asian evidence is pilots of 17–138 children.
- **Levels describe listening.** Speaking lags a level behind (earlier reports).
- **This is not a recording sheet.** Mum decides which meanings have a natural Kutchi word. Some low rows (pretzel, applesauce) probably do not.
- The children's lists are from 2018 with a 2025 reprint; the Key list is the 2025 update; the Preliminary list is the 2020 edition.

## How the CSV is built

Columns: `topic, english, kind, level, sources, child_relevance`, plus `flag` (drop, check, note, added, extension) and `note`. `sources` gives the number of lists and which ones; a CDI entry shows the share of 30-month-olds who say the word.

| Part | Rows |
|---|---|
| Cambridge children's lists and CDI, merged | 1,527 (1,334 Cambridge, 662 CDI, 469 in both) |
| Extension from A2 Key and B1 Preliminary topic lists | 216 |
| Family additions and common child words missing from the lists | 50 |
| Flagged words found only in the Oxford 3000 or Preliminary | 7 |
| **Total** | **1,800** (602 Pre-A1, 523 A1, 553 A2, 122 B1; 106 low; 14 drop) |

Filter to `flag` not `extension` for the 1,500-row list from the children's sources alone.

## Proof

Opened and parsed:
- Cambridge, *Pre A1 Starters, A1 Movers and A2 Flyers Wordlists* (A–Z, grammatical and thematic lists), CER/6137/V3/JUN25: https://www.cambridgeenglish.org/images/351850-a1-movers-word-list-2018.pdf (read). Picture-book versions: https://www.cambridgeenglish.org/images/351849-pre-a1-starters-word-list-2018.pdf and https://www.cambridgeenglish.org/images/351851-a2-flyers-word-list-2018.pdf (read; topic headings only).
- Cambridge, *A2 Key and A2 Key for Schools Vocabulary List* (2025 update, topic lists in Appendix 2): https://www.cambridgeenglish.org/tr/Images/506886-a2-key-2020-vocabulary-list.pdf (read).
- Cambridge, *B1 Preliminary and B1 Preliminary for Schools Vocabulary List*: https://www.cambridgeenglish.org/tr/Images/506887-b1-preliminary-2020-vocabulary-list.pdf (read).
- Lanes, Love, Kalman, Brenchley and Pickles, *Updating the A2 Key and B1 Preliminary vocabulary lists*, Research Notes 2019: https://www.cambridgeenglish.org/images/561337-key-preliminary-revisions-wordlists.pdf (read).
- Oxford 3000 with CEFR levels: https://www.oxfordlearnersdictionaries.com/external/pdf/wordlists/oxford-3000-5000/The_Oxford_3000.pdf (read).
- MacArthur-Bates CDI Words and Sentences item list, Wordbank: https://github.com/langcog/wordbank/blob/master/raw_data/English_American_WS/%5BEnglish_WS%5D.csv (read). Norming data used for the 24- and 30-month figures: https://github.com/langcog/wordbank/tree/master/raw_data/English_American_WS (`EnglishWS_Marchman_Norming_*`, read).
- Alam, Ballard and Hand 2026, *The development of a Bangla version of the MacArthur-Bates CDI: a pilot study*, Te Reo 69(1): https://nzlingsoc.org/wp-content/uploads/2026/05/Te-Reo-Volume-69-Issue-1-pp.52-73.pdf (read).
- Rawal and Carstensen 2026, *Early Hindi vocabulary and grammar: developing a MacArthur-Bates CDI*, CogSci: https://escholarship.org/uc/item/7q0647w3 (abstract read).
- Rasheed et al. 2017, Sindhi CDI-II short form, rural Pakistan: https://ecommons.aku.edu/pakistan_fhs_mc_women_childhealth_paediatr/405 (abstract page read).
- Benigno and de Jong, *Developing the GSE Vocabulary for Young Learners (6 to 11)*, Pearson: https://www.pearsoncanadaschool.com/content/dam/websites/pearson-canada-school/assets/documents/literacy/gse/developing-gse-vocabulary-for-young-learners.pdf (read).
- Pearson Edexcel GCSE (9–1) Gujarati specification, Issue 4, 2022: https://qualifications.pearson.com/content/dam/pdf/GCSE/Gujarati/2018/specification-and-sample-assessment-material/specification-gcse2017-l12-gujarati-iss4.pdf (read).
- Van Ek and Trim, *Threshold 1990*, chapter 7 themes: https://www.cambridge.org/core/books/threshold-1990/specific-notions/65A192D134F9E24DC236BE2A06D2ED18 (read).

Search results only:
- Waystage 1990 themes: https://www.cambridge.org/core/books/waystage-1990/themes-and-specific-notions/8D9CDB17559AB95B3312C398AD401354 (summary; 503).
- CEFR Companion Volume, vocabulary range: https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2018/1680787989 and https://rm.coe.int/16809ea0d4 (summary; 403). Young-learner descriptors: see the two earlier reports.
- English Vocabulary Profile: https://textinspector.com/help/lexis-evp/ and https://dictionary-api.cambridge.org/index.php/blog/99-english-profile-levels (summary).
- Dar, Anwaar, Vihman and Keren-Portnoy 2015, Urdu CDI, YPL2 issue 14: https://www.york.ac.uk/language/ypl/ypl2/14.html (summary; abstract).
- CDI language list incl. Bengali, Hindi, Urdu: https://edinstruments.org/node/241 (summary).
- Frank, Braginsky, Yurovsky and Marchman 2021, *Variability and Consistency in Early Language Learning* (Wordbank book): https://mitpressbookstore.mit.edu/book/9780262045100; Braginsky et al. 2019, *Open Mind*: https://pmc.ncbi.nlm.nih.gov/articles/PMC6716390 (summary).
- AQA GCSE Urdu themes: https://www.aqa.org.uk/subjects/urdu/gcse/urdu-8648/specification/subject-content/themes; Edexcel GCSE Urdu: https://www.savemyexams.com/learning-hub/exam-specifications/gcse/urdu/edexcel/ (summary).
- Sindhi primers: https://ciil.gov.in/primers/Sindhi_(Devanagari)_Primer.pdf, https://www.ciil.gov.in/primers/Sindhi_(Perso-Arabic)_Primer.pdf; Oxford *Sauwli Sindhi*: https://oup.com.pk/school-textbooks/sauwli-sindhi.html (summary).
- Kutchi material: https://utalk.com/store/kachchi, https://www.freelang.net/dictionary/kutchi.php, https://www.omniglot.com/writing/kutchi.htm (summary).

Repo files read: `build/reports/s12-research-cefr-and-book.md`, `build/reports/s12-research-a1-to-native.md`, and the header and topic counts of `build/reports/research-word-inventory-2026-10-31.csv`.
