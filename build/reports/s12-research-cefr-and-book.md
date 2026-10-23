# How far can this game take a child, and which book games are worth building?

Research note for Sprint 12, 23 Oct 2026. Web search only (the sandbox could not open pages, so quotes come from search summaries). Evidence strength is marked where it matters.

## Q1. How far in CEFR terms, and how does that compare with Duolingo?

### What Duolingo claims

- Its courses are built to the CEFR. Most stopped at A2 content until April 2026, when it opened B2 content in nine languages. That is a claim about content, not about where learners end up.
- Its headline study (Jiang et al., *Foreign Language Annals* 2021; mostly Duolingo staff): 225 US adults who finished the A1–A2 units of Spanish or French scored ACTFL Intermediate Low in reading and Novice High in listening, about the end of a fourth university semester, in roughly 112 hours. Novice High is about A1–A2; Intermediate Low about A2.
- A 2021 company blog post says about half of those learners reached at least A2 speaking. A later English-course study (CALICO Journal) found Intermediate High reading and listening after the A2 content.

### What the critics say

- Charlie Taylor's 2022 review in CALL-EJ lists selection bias (volunteers who finished), weak validity, selective use of data and internal contradictions, worst in the speaking study. Babbel (a rival) noted the main study measured no speaking. No independent replication exists.
- Fair summary: Duolingo gets a reading adult to about A2 in listening and reading after 100+ hours. Speaking evidence is weak. Nothing here is about children, and all of it depends on reading.

### What the CEFR says a picture-and-voice game can reach

The Companion Volume added Pre-A1: "approximately half-way towards A1" (Cambridge), a small vocabulary plus fixed chunks. The listening descriptors:

- **Pre-A1:** "Can recognise everyday, familiar words, provided they are delivered clearly and slowly in a clearly defined, familiar everyday context."
- **A1:** "Can understand short, very simple questions and statements, provided they are delivered slowly and clearly and accompanied by visuals or manual gestures to support understanding and repeated if necessary." (One commercial source labels this Pre-A1; the Companion Volume text puts it at A1.)

Reading and writing scales do not apply to this game at all; Kutchi has no standard script and the child reads nothing. So the honest frame is **listening and speaking only**.

Cambridge's Pre A1 Starters test for 6–12 year olds shows what A1-ish listening looks like for children: hear a sentence, pick one of three pictures; listen to a story scene; hear a question, choose the reply from three; hear instructions, drag objects into a picture. Three of those are already the shape of Find it, Name it and Stick in the photo.

**Plausible ceiling of the game as it stands:** solid Pre-A1 listening (single words in a known scene) and Pre-A1 speaking (single words, a few fixed phrases). A1 listening is in reach once the child hears whole sentences and questions with picture support, which the engine already builds. A1 speaking needs the child to answer, not only tap. A2 needs making new sentences, past and future, asking questions, a few turns of talk. A picture-and-voice game with a small family voice budget does not get there on its own. That matches the brief (young children, play, real voices).

### Vocabulary and listening gains from games and apps

- Meta-analyses of digital game-based L2 learning find a small-to-medium effect: Dixon, Dixon and Jordan 2022, weighted d = 0.50 between groups; Tsai and Tsai 2018 (26 studies); Chen, Tseng and Hsiao 2018: design features mattered, age did not. Almost none is about under-8s. Read it as "games help, if the design is right", not as proof for this age.

### Heritage children vs complete beginners

- Heritage children usually keep balanced comprehension but become production-dominant in English by about age 10; heritage vocabulary stalls or declines once school starts, even with much home input (longitudinal study PMC9635451; Rodina et al. 2023).
- For them the game's job is production and keeping words alive; they may be at Pre-A1 or A1 listening on day one. For complete beginners it is first contact, and recognition takes 6–10 spaced meetings per word.
- So the book should let a child who knows a word prove it fast (say it, skip to recall) rather than sit through recognition.

### What to add to climb a level (ranked, rough effort)

1. **Spaced retrieval across days** (low). The book asks today's words plus words from 1, 3 and 7 days ago. Spaced retrieval boosts word learning in 4–5 year olds (Leonard et al. 2019; Haebig et al. 2021). Cheapest win; raises everything else.
2. **Say it, not only tap it** (medium; the closed-set recogniser `Speech.listen` exists). Retrieval gains show on recall, not recognition. Saying words helps 4–6 year olds, not 2–3 year olds, so it must be optional. Children's speech recognition is much worse than adults' (adult-trained models, high pitch, scarce data), so a miss stays a shrug, as designed.
3. **Questions and chosen replies** (medium, needs Mum's question phrases). "What is she drinking?" with three spoken answers is the A1 interaction task in Starters. Moves Pre-A1 to A1.
4. **Describing** (medium): colours, sizes, numbers in a question ("the red one", "two"). A1 to early A2 listening. Needs adjective and number clips.
5. **Nani says: do it** (medium): verbs and commands acted in the scene. A1 listening of sentences.
6. **Past tense retelling of the day** (medium-high; needs past-tense phrases from Mum). First step toward A2 story talk.
7. **Multi-turn dialogue** (high), after 3–6 exist.

## Q2. The evening book: what works for small children, and what can we build?

### What children's apps do

- **Gus on the Go** (4–6): about 90 nouns, ten lessons of picture-and-voice games, each ending in a short review that unlocks the next. Liked for simplicity; runs out fast. Closest to our book.
- **Endless Spanish** (3–5): spell a word with wriggling letters, then drag key words into a spoken sentence. Common Sense Media: the sentences are too complex for the age. That is our Stick in the photo; the warning applies.
- **Lingokids** (2–8): songs, tracing, mazes, a memory game where a tapped card shows and reads its name. Broad and shallow.
- **Duolingo ABC**: phonics and reading, not a second language. Mondly Kids, Fun Easy Learn, Kahoot: quiz flashcards with written labels, which our rules exclude; not surveyed in depth.

### Classroom techniques that fit

TPR and Simon says (act on a command), slap the card (hear a word, hit the picture), Kim's game (what's missing), pairs, I-spy (hear a description, find it), picture sequencing and retelling, bingo, dialogic reading (adult asks, child answers, adult expands). The evidence for most is small, uncontrolled action research, so take them as well-tried practice, not proof. Dialogic reading is the exception: expressive vocabulary d = 0.59 across 16 studies (Mol et al. 2008), smaller in older children; broad shared-reading effects are small (Noble et al. 2019, g = 0.19).

### Research that should steer the choice

- Retrieval beats re-study, and the gain shows on recall, not recognition. "Pick the picture" is study; "say the word" or "pick by sound from memory" is what builds memory.
- Spaced practice across days works in preschoolers (Leonard; Haebig). Production helps 4–6 year olds, reverses for 2–3 year olds: keep saying optional.
- Picture plus voice and short stories give incidental learning; across 38 storybook studies, dialogic style and more repetitions mattered, child age did not.

### Candidate games

| Game | Teaches | In the book | Leak test | Feasibility |
|---|---|---|---|---|
| **Find it** (current) | Listening: word to picture | Nani says a word; tap one of 4–6 things | Weak past support (elimination); fixed by asking fewer than shown (done) and learned-word decoys | Built |
| **Name it, rebuilt** (current) | Recall by sound | Picture; three speakers say words; pick | Passes: nothing to read, decoys are learned words | Built |
| **Stick in the photo** (current) | Words in a sentence | Nani says a sentence; drag a picture into the gap | Fails if one picture is offered (just a drag). Needs 2–3 candidate pictures | Built; small fix |
| **Our day** (current) | Story, sequence | Today's things in order, narrated | Not a test; child can order from memory of the day. Keep as story glue | Built |
| **What's missing** (Kim's game) | Recall, production | 4 pictures from today; one hides under Nani's hand; "what's missing?"; answer by three spoken words or by saying it | Passes only if the answer is by sound or voice, never by picture | Low art (hand), no new clips; build low-medium |
| **Say it** | Production | Picture; "what's this?"; child says it; a miss is a shrug, then the pills | Passes if pills come only after a try or a tap (no winning by waiting) | No art; recogniser exists; medium |
| **Nani says, do it** (TPR) | Verbs, sentences | "Drink the milk": tap the thing to make it act | Passes with 3–4 live actions | Needs verb clips and small animations; medium |
| **Choose the reply** | Interaction (A1) | Nani asks; three spoken replies; pick | Passes | Needs question phrases; medium |
| **I-spy** | Descriptions | "Something red, you drink it" | Passes | Needs adjectives; medium-high |
| **Slap the card** | Fast listening | Find it with pace | As Find it; pace risks pressure (rule 7) | Low; adds little |
| **Pairs / bingo** | Study | Tap to hear, match | Fails past support (matching) | Low; study only |

### Recommendation

Build, in this order:

1. **Spaced words in the book** (not a game: the plan's word pool). Pull from 1, 3 and 7 days ago as well as today. Biggest learning gain per hour of work.
2. **Say it**, as a rung inside Name it: the picture appears, Nani asks, a quiet mic listens; after a try (or a tap) the three speakers come. Recall for children 4+, no cost to a 3 year old who taps.
3. **What's missing**, answered by sound. A real recall test children already love, from today's pictures, no new recordings.
4. **Choose the reply**, when Mum has recorded a dozen question phrases. This is the step from Pre-A1 to A1.

Keep **Find it** (the Starters listening task; make decoys learned words). Keep **Name it rebuilt**. Keep **Stick in the photo** only with 2–3 candidate pictures and short sentences (the Endless Spanish warning). **Our day** stays as the story ending, not scored. Do not build pairs, bingo or slap the card now.

## Proof

- Duolingo efficacy summary and the 2021 study: [TechCrunch, May 2021](https://techcrunch.com/2021/05/03/duolingo-ec1-future/); [Jiang et al. 2021, NAU record](https://experts.nau.edu/en/publications/evaluating-the-reading-and-listening-outcomes-of-beginning-level-/); [Duolingo press release](https://www.goodnewsnetwork.org/study-shows-duolingo-learning-outcomes-are-comparable-to-university-classes/); [Duolingo results page](https://blog.duolingo.com/results-duolingo-efficacy-studies); [speaking post](https://blog.duolingo.com/how-well-does-duolingo-teach-speaking-skills); [English course study, CALICO](https://journal.equinoxpub.com/Calico/article/view/26704); B2 content: [TechCrunch, Apr 2026](https://techcrunch.com/2026/04/22/duolingo-is-now-giving-users-access-to-advanced-learning-content/), [Duolingo blog](https://blog.duolingo.com/courses-teach-advanced-content/).
- Critiques: [Taylor 2022, CALL-EJ](https://callej.org/index.php/journal/article/download/419/347/1013); [TechLearning](https://www.techlearning.com/news/does-duolingo-work).
- CEFR: [Companion Volume 2018](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2018/1680787989); [Chapter 3 scales](https://rm.coe.int/chapter-3-communicative-language-activities-and-strategies/1680a084b4); [Cambridge, applying the CEFR (Pre-A1 "half-way")](https://assets.cambridgeenglish.org/webinars/applying-CEFR-to-your-curriculum.pdf); [young-learner descriptor samples 7–10](https://logos.edu.iwate-u.ac.jp/jhoffice/wp-content/uploads/sites/6/2019/04/COLLATED-REPRESENTATIVE-SAMPLES-DESCRIPTORS-YOUNG-LEARNERS-VOLUME-1-AGES-7-10-2018-Just-A1.pdf); [Pre A1 Starters test format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/young-learners/digital/starters/format/); [Starters word list](https://www.cambridgeenglish.org/images/351849-pre-a1-starters-word-list-2018.pdf).
- Games meta-analyses: [Dixon, Dixon and Jordan 2022](https://scholarspace.manoa.hawaii.edu/items/8e966948-cfc4-452c-8e5f-dd6d0ea3a6aa/full); [Tsai and Tsai 2018](https://scholar.lib.ntnu.edu.tw/en/publications/digital-game-based-second-language-vocabulary-learning-and-condit-2/); [Chen, Tseng and Hsiao 2018](https://docs.opendeved.net/lib/24BG25I9).
- Heritage children: [longitudinal receptive/expressive study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9635451); [Rodina et al. 2023](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1101995/pdf); [heritage vocabulary stabilisation](https://pmc.ncbi.nlm.nih.gov/articles/PMC9947706).
- Retrieval and spacing in preschoolers: [Leonard et al. 2019](https://learninglab.psych.purdue.edu/downloads/2019/2019_Leonard_et_al_JSLHR_Adjectives.pdf); [Haebig et al. 2021](https://asha.figshare.com/articles/journal_contribution/Spaced_retrieval_supports_semantic_learning_Haebig_et_al_2021_/15063060); [Leonard et al. 2024](https://pubs.asha.org/doi/10.1044/2024_JSLHR-23-00528). Testing effect in children: [Goossens et al. 2014](https://repub.eur.nl/pub/72816), [related](https://repub.eur.nl/pub/58790); [preschool null results](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01446/full); [DHH children 2024](https://profiles.wustl.edu/en/publications/the-effect-of-retrieval-practice-on-vocabulary-learning-for-dhh-c/).
- Production effect in children: [7–10 year olds](https://acuresearchbank.acu.edu.au/item/8x35z/the-production-effect-improves-memory-in-7-to-10-year-old-children); [reverse effect in 2–3 year olds](https://ruor.uottawa.ca/items/0a41ef6b-aae5-491f-8097-9177175a149d/full); [review](https://cris.iucc.ac.il/en/publications/the-production-effect-in-memory-a-prominent-mnemonic-in-children/).
- Shared and dialogic reading: [Mol et al. 2008 summary](https://www.uwo.ca/fhs/csd/ebp/reviews/2012-13/Atkinson_A.pdf); [38-study word-learning meta-analysis](https://ray.yorksj.ac.uk/id/eprint/15524/1/Accepted-Version.pdf); [Noble et al. 2019 context](https://par.nsf.gov/servlets/purl/10252405).
- Children's speech recognition: [K-Function 2025](https://arxiv.org/pdf/2507.03043); [NOCASA challenge](https://arxiv.org/pdf/2504.20678); [child ASR limits](https://pmc.ncbi.nlm.nih.gov/articles/PMC5884147).
- Apps: [Gus on the Go](https://apps.apple.com/us/app/gus-on-the-go-spanish/id541567964), [review](https://testprepinsight.com/?p=6730); [Endless Spanish, Common Sense](https://www.commonsensemedia.org/app-reviews/endless-spanish), [Horn Book](https://hbook.com/story/endless-spanish-app-review); [Lingokids, Common Sense](https://www.commonsensemedia.org/app-reviews/lingokids-playlearning), [review](https://ling-app.com/blog/lingokids-review/); [Duolingo ABC, Common Sense](https://www.commonsensemedia.org/app-reviews/duolingo-abc-learn-to-read).
- Classroom games: [British Council Simon says plan](https://www.teachingenglish.org.uk/teaching-resources/teaching-primary/lesson-plans/level-2/my-english-classroom); [Cambridge games list](https://www.cambridge.org/us/esl/interchange/resources/games.html); [slap the board study](https://ejournal-fkip.unisi.ac.id/eji/article/download/2565/1429); [Kim's game study](https://journal.unnes.ac.id/journals/eej/article/download/25770/7651/150618); [TPR study](https://jurnal.fkip.unismuh.ac.id/index.php/ICOLT/article/view/1619); [retelling with pictures](https://colorincolorado.org/node/56291).
