# Which verbs and small words give the most return

Research note, 31 Oct 2026. Zafar's question: which verbs, and which small grammar words, give the most return for recording time ("maybe 30 verbs are used 80% of the time"). It builds on `s12-research-a1-to-native.md` (levels and the game's ceiling) and does not repeat it. Every meaning below is English; no Kutchi is written here. Sources are in Proof, each marked **read** (opened, or downloaded and counted by me) or **summary** (search result or abstract only).

## Headline

1. **Thirty verbs cover about 70%, not 80%.** In 3.6 million words of English speech to children aged 0 to 6, the top 30 verbs cover 69% of the verbs a child hears. The top 40 cover 74%, the top 58 reach 80%, and the top 100 cover 89%. This counts action verbs only: "be" and helpers like can and will are left out. Adult conversation is flatter: it needs about 95 to 110 verbs for 80%.
2. **A claim the game can make honestly:** "The game's 40 core verbs are the ones that make up about three-quarters of the verbs young children hear (English studies)." That is solid for English. For Kutchi it is a proxy only.
3. **Light verbs help, but in the long tail, not the core.** In written Hindi, 37 to 39% of verbs are a noun or describing word plus "do", "become" or "give". But all 20 of the most frequent Hindi verbs are simple verbs. Light-verb verbs make up half of ranks 21 to 100, 72% of ranks 101 to 500, and 87% of rarer verbs. The same holds when I map the English verbs children hear: none of the top 20 is a likely light-verb verb, and 20 of the top 100 are.
4. **What this means for recording:** record every form of about 25 simple verbs and of the light verbs "do", "become" and "give". After that, each new action built as noun + do costs one clip (the noun) instead of about 20.
5. **"To me" verbs are cheaper.** want, like, need, know and remember are said as "to me X is wanted / known". Their ending follows the thing, not the person. That means about 3 forms per tense instead of 6.
6. **Forms ladder:** commands first (to a child and to an elder), then the present ("every day", "right now"), "want to / have to / need to" and "can", then the past and the future at A2. Engine cost: about 2 clips per verb before A1, about 10 at A1, and about 21 at A2.
7. **Gaps in the engine's verbs:** 13 of the top 40 verbs are missing entirely: know, think, play, tell, try, find, read, remember, call, hold, show, fall and push. In the top 60, so are drink, sleep and hear.

## 1. How much the top verbs cover (English)

I counted these myself: verbs were tagged automatically and reduced to their base form (Proof). A "verb token" is one use of a verb. "be" and the helpers (can, could, will, would, shall, should, may, might, must, and "gonna" as a future marker) are left out. In speech to children, "do" counts only when it is the main verb ("do it"), about a third of its uses. "have" stays in, because "have to" and owning things carry meaning.

| Corpus | Top 10 | Top 20 | Top 30 | Top 40 | Top 50 | Top 100 | Verbs for 80% |
|---|---|---|---|---|---|---|---|
| **Adults talking to children aged 0 to 6** (AO-CHILDES, 3.6M words) | 45% | 62% | 69% | 74% | 78% | 89% | 58 |
| Same, with "do" and "have" left out entirely | 42% | 58% | 66% | 71% | 75% | 87% | 65 |
| Adult chat, British (BNC spoken sample, 0.9M words) | 50% | 61% | 66% | 70% | 72% | 81% | 95 |
| US phone calls (Switchboard sample, 0.1M words) | 55% | 65% | 71% | 75% | 78% | 86% | 59 |
| US TV and film (COCA, top 5,000 lemmas) | 46% | 59% | 65% | 70% | 74% | 83% | 81 |
| US spoken (COCA, top 5,000 lemmas) | 44% | 55% | 61% | 66% | 69% | 79% | 113 |
| US, all genres (COCA, top 5,000 lemmas) | 33% | 43% | 48% | 53% | 56% | 67% | 218 |
| British, all genres (BNC whole, Kilgarriff list) | 31% | 39% | 44% | 48% | 51% | 62% | 283 |

- Note that the adult rows (BNC, Switchboard, COCA) still count every use of "do", including the helper use, so their top 10 is a little inflated.
- Speech to children is the most concentrated. Writing is the flattest, because it uses many verbs a few times each.
- The COCA and BNC-whole figures count only the verbs on the frequency list, so the true coverage is slightly lower.
- For comparison, the New General Service List's 2,809 words cover "92%+" of general English (all words, not only verbs; NGSL, read).
- Verbs (including "be") are about 25% of all words in speech to children (my count, 930,000 of 3.65 million).

## 2. Verbs children hear and say first

- **Children's own verbs (Sethuraman, read).** Fifteen mothers and 27 children:
  - At 20 months, the children's top verbs were be, go, do, open, see, sit, play and "can".
  - At 28 months: be (19%), go (15%), do (13%), want (5%), get, know, eat, cry, see, play, come, make, look, have and put.
  - The mothers' top verbs: be, do, go, put, look, can, want, see, get, eat, make and come.
- **Mothers lean on a few general verbs (Goldberg, Casenhiser and Sethuraman 2004, summary via Sethuraman):**
  - "go" leads the "X moves to Y" pattern.
  - "put" leads the "X puts Y somewhere" pattern.
  - Children learn a sentence pattern from its most frequent verb.
  - Ninio's "pathbreaking verbs" are also general verbs; she found that the first verbs to take objects open each new pattern (summary).
- **Verbs come after nouns, and small words come last (Wordbank book, read):**
  - Under 50 words, predicates and small words are under 10% of a child's vocabulary.
  - Half the predicates are known at a vocabulary of 300 to 450 words.
  - Small grammar words reach half only at 500 to 600 words.
  - Mandarin and Cantonese children say verbs earlier: the input decides (Tardif, summary).
- **Speech to children is mostly questions and commands.** Only about 15% of mothers' sentences are plain subject-verb-object (Cameron-Faulkner, Lieven and Tomasello 2003, abstract, summary). My own count in AO-CHILDES, as a share of all utterances:

  | Kind of sentence | Share of utterances |
  |---|---|
  | Questions | 38% (wh-questions 11%) |
  | Starts with a bare command verb | at least 6% |
  | Has a negative | 9% |
  | Has a past verb | 9% |
  | Has an -ing verb | 8% |
  | Talks about the future | 4% |
  | Has "can" | 4% |
  | Has "want to" | 2% |
  | Has "have to" or "need to" | 1% |

- **"Early?" in the table below** uses three tests. It says "yes" if the verb is in Sethuraman's child lists, or if adults rate it as learned by age 4 (Kuperman's age-of-acquisition norms, read; figure in brackets). "mid" means rated 4 to 5. "later" means rated over 5. Adult ratings run later than real first use, so "mid" verbs are often heard by age 3.

## 3. Hindi, Urdu, Gujarati and Sindhi: how far do light verbs reach?

**No public child-speech data or verb lists exist for these languages.**
- Hindi CDI adaptations exist, but none is public (Rawal and Carstensen 2026; Auckland pilot; summary).
- An Urdu and Pashto CDI and a rural Pakistan adaptation are in progress or unpublished (summary).
- I found no Gujarati or Sindhi CDI.
- Hindi child-speech corpora exist (Narasimhan's lab) but are not public. That work says light verbs are among the cues Hindi children use for the past-with-object grammar (summary).

**Written corpora, counted by me from the Universal Dependencies treebanks (read).** A conjunct verb here is a noun or describing word plus a verb, like "help do".

| Treebank | Text | Verb tokens | Share that are conjunct verbs | Top light verbs |
|---|---|---|---|---|
| Hindi HDTB | news, 350k words | 36k | **39%** | do 53%, become 16%, give 7%, take 2% |
| Urdu UDTB | news | 11k | **58%** | do 53%, become 16%, give 8% |
| Hindi PUD | translated news and wiki | 2.5k | 18% | do 63%, become 16% |
| Hindi-English mixed | tweets | 2.5k | 19% | (not lemmatised) |
| Sindhi Isra | news and folk stories | 1.5k | 16% (plus 15% verb + verb compounds) | do |
| Gujarati GujTB | 187 sentences | 214 | 15% (too small to trust) | do, become |

**Published figures (read):**
- 37% of 47,163 predicates in the Hindi Treebank are light-verb constructions.
- Hindi has about 700 simple verbs; English has about 7,000 (Vaidya, Agarwal and Palmer; Vaidya and Wittenberg 2020).
- About 9.5% of English predicates are light-verb constructions (Vincze 2011).
- Persian has only about 115 common simple verbs (Sadeghi 1993); both are cited in Vaidya and Wittenberg.

**The key finding: light verbs fill the tail, not the core.** I ranked every Hindi predicate by frequency. A conjunct counts as its own predicate ("help + do" is one).

| Hindi predicates by rank | Conjunct share of these predicates | Their share of all verb tokens |
|---|---|---|
| 1 to 20 | **0%** | 41% |
| 21 to 100 | 50% | 20% |
| 101 to 500 | 72% | 22% |
| 501 and rarer (3,054 types) | 87% | 17% |

This is also why Hindi verbs look concentrated when counted by the verb alone:
- The top 5 Hindi verbs cover 54% of verb tokens, the top 10 65%, the top 20 76%, the top 50 87% and the top 100 94%.
- In English writing (COCA) the top 10 cover only 33%.
- The reason is that do and become absorb the noun + verb verbs.
- The top Hindi verbs (English meanings) are: do, be or become, say, give, take, tell, come, meet or get, stay, make, keep, attach, go, turn into.

**Mapping the child's English verbs.** I sorted the top 100 verbs children hear into likely Indo-Aryan builds, judged from Hindi, Urdu and Gujarati; Kutchi is unchecked.
- **Simple verbs:** 66 of the 100 verbs (about 56% of their tokens), plus "do" and "give" as light verbs themselves.
- **Noun + do / become / give:** 20 verbs (7.5% of tokens). None is in the top 20. They are try, help, use, talk, wait, push, draw, love, fix, finish, work, close, stand, ride, start, clean, bang, drive, pretend and knock.
- **"To me" constructions:** 11 verbs (26% of tokens, mostly have, get, want and know).
- **A form, not a verb:** let.

**The family's own data points the same way (project notes, English meanings):**
- "help" and "mix" are the English word plus "do".
- "turn down" is "slow" plus "do".
- "it's finished" is "finished" or "closed" plus "become".
- want, need and like are "to me" constructions.
- "came" and "ate" can be built as "having come / having eaten" plus "went".

So Kutchi uses both tricks, and borrows English words into the "do" pattern too.

**Verdict:**
- **Evidence for:** in adult Hindi and Urdu, a handful of light verbs carry 40 to 60% of verb uses.
- **Evidence against, for this game:** the verbs a small child hears most are simple verbs, which need their own forms.
- **What changes in the recording plan:**
  - Give "do", "become" and "give" a full set of forms early, as part of Tier 1.
  - Ask Mum, verb by verb, whether each tail verb (try, wait, start, finish, clean, close, fix, work, love, pretend) is noun + do. Each yes costs one noun clip, not a set of forms.
  - Never assume it: Kutchi may use a simple verb where Hindi uses noun + do, as it does for "use".

## 4. The ranked verbs

How to read the table:
- **Share** is that verb's share of the verbs a child hears, and **Cum.** is the running total (AO-CHILDES, main-verb "do" only). Eight adult-talk words are left out: thank (a fixed phrase), mean, suppose, guess, bet, wonder, cause and set. Together they are about 2% of tokens.
- **Adult talk** is the share in the British spoken sample, with all uses of "do".
- **Early?** is explained in § 2.
- **Likely build** is Claude's judgement from Hindi, Urdu and Gujarati, to check with Mum.
- **In engine?** is whether the engine's lexicon (61 verbs) has the verb today: yes (confirmed), draft, to record, or no.
- **Merges:** Kutchi already uses one verb for see, look and watch, and one for put and keep (lexicon). hear and listen, and make and build, probably merge too.

### Tier 1: the top 20 (about 62% of the verbs a child hears)

| # | Verb | Share | Cum. | Adult talk | Early? | Likely build | In engine? |
|---|---|---|---|---|---|---|---|
| 1 | do | 6.64% | 7% | 10.73% | yes (3.6) | simple; a light verb itself | yes |
| 2 | have | 6.35% | 13% | 10.30% | yes (3.7) | to-me: "near me is" | n/a |
| 3 | go | 6.14% | 19% | 4.50% | yes (3.4) | simple | yes |
| 4 | get | 4.76% | 24% | 5.94% | yes (3.2) | to-me: "to me came"; fetch | draft |
| 5 | see | 4.70% | 29% | 2.11% | yes (3.1) | simple | yes (same as look) |
| 6 | want | 3.86% | 32% | 1.54% | yes (4.2) | to-me: "to me is wanted" | yes |
| 7 | put | 3.60% | 36% | 1.22% | yes (3.7) | simple | yes |
| 8 | say | 2.94% | 39% | 4.80% | yes (3.4) | simple | yes (speak) |
| 9 | know | 2.93% | 42% | 3.87% | yes (4.5) | to-me: "to me is known" | no |
| 10 | think | 2.83% | 45% | 3.84% | mid (4.8) | simple | no |
| 11 | look | 2.54% | 47% | 1.28% | yes (4.0) | simple | yes |
| 12 | come | 2.26% | 50% | 1.77% | yes (3.3) | simple | yes |
| 13 | like | 1.99% | 52% | 0.89% | yes (3.7) | to-me: "to me is liked" | draft |
| 14 | make | 1.86% | 53% | 1.19% | yes (4.7) | simple | yes |
| 15 | let | 1.71% | 55% | 0.43% | mid (4.5) | a form, not a verb | phrase only |
| 16 | take | 1.53% | 57% | 1.30% | mid (4.4) | simple | yes |
| 17 | play | 1.52% | 58% | 0.21% | yes (4.1) | simple | no |
| 18 | eat | 1.44% | 60% | 0.23% | yes (2.8) | simple | yes |
| 19 | tell | 1.06% | 61% | 0.88% | mid (4.3) | simple | no |
| 20 | give | 0.97% | 62% | 0.98% | mid (4.3) | simple; a light verb itself | yes |

### Tier 2: 21 to 50 (to about 77%)

| # | Verb | Share | Cum. | Adult talk | Early? | Likely build | In engine? |
|---|---|---|---|---|---|---|---|
| 21 | need | 0.96% | 63% | 0.63% | yes (3.6) | to-me: "of need" + is | yes |
| 22 | sit | 0.89% | 64% | 0.25% | yes (3.5) | simple | yes |
| 23 | try | 0.77% | 64% | 0.55% | yes (3.4) | noun +do | no |
| 24 | find | 0.74% | 65% | 0.55% | later (5.8) | to-me: "to me came" | no |
| 25 | read | 0.69% | 66% | 0.28% | mid (4.1) | simple | no |
| 26 | turn | 0.67% | 66% | 0.27% | mid (4.1) | simple | yes |
| 27 | remember | 0.65% | 67% | 0.33% | later (5.6) | to-me: "memory comes" | no |
| 28 | happen | 0.64% | 68% | 0.40% | later (5.3) | simple | yes (become) |
| 29 | help | 0.59% | 68% | 0.31% | yes (3.6) | noun +do | yes |
| 30 | call | 0.59% | 69% | 0.40% | mid (4.7) | simple | no |
| 31 | hold | 0.53% | 69% | 0.18% | mid (4.7) | simple | no |
| 32 | show | 0.52% | 70% | 0.24% | later (6.2) | simple | no |
| 33 | use | 0.52% | 70% | 0.97% | mid (4.5) | noun +do | yes |
| 34 | talk | 0.50% | 71% | 0.61% | yes (3.7) | noun +do | yes (speak) |
| 35 | fall | 0.47% | 71% | 0.10% | mid (4.7) | simple | no |
| 36 | open | 0.47% | 72% | 0.16% | yes (5.0) | simple | to record |
| 37 | wait | 0.46% | 72% | 0.15% | mid (4.3) | noun +do | draft |
| 38 | push | 0.46% | 73% | 0.07% | mid (4.3) | noun +give | no |
| 39 | watch | 0.45% | 73% | 0.19% | mid (4.3) | simple | yes (look) |
| 40 | bring | 0.43% | 74% | 0.31% | mid (4.4) | simple | yes |
| 41 | throw | 0.42% | 74% | 0.08% | mid (4.1) | simple | no |
| 42 | hear | 0.40% | 74% | 0.30% | yes (3.8) | simple | no |
| 43 | leave | 0.39% | 75% | 0.44% | later (5.6) | simple | yes |
| 44 | draw | 0.38% | 75% | 0.10% | mid (4.1) | noun +make | no |
| 45 | pick | 0.36% | 76% | 0.20% | later (5.3) | simple | no |
| 46 | keep | 0.33% | 76% | 0.45% | mid (4.4) | simple | yes (put) |
| 47 | sleep | 0.33% | 76% | 0.08% | yes (2.8) | simple | no |
| 48 | love | 0.33% | 77% | 0.26% | later (5.2) | noun +do | no |
| 49 | wear | 0.32% | 77% | 0.10% | mid (4.6) | simple | to record (put on) |
| 50 | win | 0.32% | 77% | 0.51% | mid (4.2) | simple | no |

### Tier 3: 51 to 100 (to about 88%)

| # | Verb | Share | Cum. | Adult talk | Early? | Likely build | In engine? |
|---|---|---|---|---|---|---|---|
| 51 | pull | 0.32% | 78% | 0.08% | mid (4.8) | simple | no |
| 52 | break | 0.32% | 78% | 0.10% | later (5.3) | simple | no |
| 53 | fix | 0.31% | 78% | 0.00% | mid (5.0) | noun +do | no |
| 54 | drink | 0.30% | 78% | 0.08% | yes (3.5) | simple | no |
| 55 | stay | 0.29% | 79% | 0.14% | mid (4.2) | simple | no |
| 56 | finish | 0.29% | 79% | 0.16% | later (6.3) | noun +do/+become | draft |
| 57 | sing | 0.28% | 79% | 0.08% | yes (3.5) | simple | no |
| 58 | ask | 0.27% | 80% | 0.53% | yes (2.9) | simple | no |
| 59 | buy | 0.27% | 80% | 0.37% | later (5.6) | simple | draft |
| 60 | move | 0.26% | 80% | 0.28% | mid (4.6) | simple | no |
| 61 | feel | 0.26% | 80% | 0.45% | later (5.1) | to-me: "to me feels" | no |
| 62 | work | 0.26% | 81% | 0.62% | later (5.9) | noun +do | no |
| 63 | hurt | 0.26% | 81% | 0.05% | yes (4.0) | to-me: "to me hurts" | no |
| 64 | write | 0.25% | 81% | 0.40% | mid (4.9) | simple | no |
| 65 | stick | 0.25% | 81% | 0.10% | yes (3.9) | simple | no |
| 66 | run | 0.24% | 82% | 0.26% | mid (4.5) | simple | yes |
| 67 | close | 0.24% | 82% | 0.06% | mid (4.5) | noun +do | to record |
| 68 | stop | 0.24% | 82% | 0.28% | yes (2.9) | simple | no |
| 69 | stand | 0.23% | 82% | 0.17% | mid (4.4) | noun +become | no |
| 70 | catch | 0.23% | 83% | 0.09% | mid (4.6) | simple | no |
| 71 | touch | 0.22% | 83% | 0.08% | later (5.2) | simple | yes |
| 72 | build | 0.22% | 83% | 0.15% | mid (4.5) | simple | yes (make) |
| 73 | ride | 0.21% | 83% | 0.03% | mid (4.7) | noun +do | no |
| 74 | wash | 0.21% | 83% | 0.10% | yes (4.0) | simple | draft |
| 75 | start | 0.21% | 84% | 0.47% | mid (4.4) | noun +do | no |
| 76 | walk | 0.20% | 84% | 0.20% | yes (3.5) | simple | yes |
| 77 | fit | 0.20% | 84% | 0.05% | later (5.7) | simple | no |
| 78 | clean | 0.20% | 84% | 0.06% | yes (3.9) | noun +do | to record |
| 79 | cry | 0.19% | 84% | 0.00% | yes (2.8) | simple | no |
| 80 | cut | 0.19% | 85% | 0.11% | mid (4.4) | simple | draft |
| 81 | live | 0.18% | 85% | 0.27% | later (6.1) | simple | no |
| 82 | bang | 0.18% | 85% | 0.00% | later (5.7) | noun +do | no |
| 83 | hide | 0.17% | 85% | 0.03% | mid (4.5) | simple | no |
| 84 | jump | 0.17% | 85% | 0.04% | yes (2.8) | simple | no |
| 85 | miss | 0.16% | 86% | 0.11% | later (6.3) | to-me: "memory comes" | no |
| 86 | drive | 0.16% | 86% | 0.16% | later (5.3) | noun +do | no |
| 87 | swim | 0.16% | 86% | 0.00% | mid (4.2) | simple | no |
| 88 | forget | 0.15% | 86% | 0.16% | mid (4.8) | simple | no |
| 89 | blow | 0.15% | 86% | 0.04% | yes (4.0) | simple | no |
| 90 | pretend | 0.15% | 86% | 0.00% | mid (4.6) | noun +do | no |
| 91 | shake | 0.15% | 86% | 0.00% | later (5.3) | simple | no |
| 92 | roll | 0.15% | 86% | 0.03% | mid (4.5) | simple | to record |
| 93 | hit | 0.14% | 87% | 0.06% | mid (4.8) | simple | no |
| 94 | fly | 0.13% | 87% | 0.04% | yes (3.0) | simple | no |
| 95 | knock | 0.13% | 87% | 0.06% | mid (4.6) | noun +do | no |
| 96 | lose | 0.13% | 87% | 0.20% | later (5.8) | simple | no |
| 97 | listen | 0.13% | 87% | 0.13% | later (5.4) | simple | no |
| 98 | hang | 0.12% | 87% | 0.07% | later (6.7) | simple | no |
| 99 | count | 0.12% | 87% | 0.05% | yes (2.6) | simple | no |
| 100 | cook | 0.11% | 88% | 0.04% | mid (4.2) | simple | draft |

**Grouped for the game's scenes:**

| Scene | Verbs |
|---|---|
| Kitchen | eat, drink, cut, wash, cook, pour, mix, taste, open, close, give, take, put, bring |
| Clinic and body | hurt, sit, open, show, look, fall, cry, sleep, wake, wash, hold |
| Play and the yard | play, throw, catch, push, pull, jump, run, hide, find, ride, climb, fly |
| Everywhere | go, come, want, like, need, know, say, tell, help, wait, try, finish |

## 5. The coverage claim

- **The claim:** "These 40 verbs make up about three-quarters (74%) of the verbs young children hear."
- **Strength of the evidence:**
  - Solid for English speech to children: 3.6 million words, and the figure sits between 70% and 75% across the child, phone and TV corpora.
  - A proxy for Kutchi.
- **Two effects pull in opposite directions:**
  - Kutchi merges some English verbs (see, look and watch are one verb), so 40 Kutchi verbs reach further.
  - Some English verbs are not verbs in Kutchi ("have", "let"), so they reach less far.
- **The weak point:** no Kutchi corpus exists to measure it.
- **Safe wording for a store page or a parent:** "built on the 40 verbs children hear most, about three-quarters of everyday verb use in studies of children's speech".
- **Before 80% can be claimed:** the game would need about 60 verbs.

## 6. The forms ladder, and clips per verb

**Order:**
- Commands and "want" come first in child speech.
- English -ing and the irregular past come early; the regular past and "will" come later (Brown's order, summary).
- In Hindi, the bare command to one child is the first verb form (Sarma, summary).
- Hindi children use the past with its special subject marking easily, though caregivers rarely say it (Narasimhan; Pareek, Kidwai and Eisenbeiss; summary).
- Bangla children aged 2 to 4 build the present simple, the present ongoing and the past ongoing in three stages (Sultana et al. 2016, read).

**For learners:**
- UK GCSE Urdu, Foundation tier, has: commands including polite ones, present habitual and continuous, past, future, negatives and questions.
- Its Higher tier adds "must, need to, should", compound verbs and the subjunctive (AQA, read).
- A2 is where the first past and future come in (earlier report).

**In engine terms** (from `engine-design.md` § 4–5 and `data/lang/lexicon.json`):
- A verb form is a cell, and each cell played alone needs its own word clip.
- "Don't" is a separate word after the verb, so it costs nothing extra per verb.
- Questions are the same words with a rising voice, so per-word clips cannot carry them. Frequent questions need whole-sentence takes (engine § 8).

| Level | New forms | Cells per simple verb, running total | Cells per "to me" verb | Notes |
|---|---|---|---|---|
| Pre-A1 (L1–L2) | command to a child; polite command to an elder | **2** | 0 | most of the engine's 61 verbs are here today |
| A1 | present by person and gender: I (a man), I (a woman), you-child or he (boy), you-child or she (girl), elder-you or we, they; the "to do" form (for want to, have to, need to); the "having done" form (for can, finished, compound past) | **about 10** | about 3 (he-thing, she-thing, plural) | open: whether "right now" differs from "every day" |
| A2 | past by subject gender and number (about 5); future by person and speaker gender (about 6) | **about 21** | about 9 | open: past-with-object agreement may add 2 or 3 cells |
| B1 (not a game target) | ongoing vs habitual (if distinct), perfect, "if", "let him" | 25+ | — | needs Mum's rules first |

- A noun + do verb costs **1 clip** (the noun) at every level; the light verb carries the cells.
- The "I" cells need both a man's form and a woman's form. Mum can say the man's form, or Zafar can record it.

**Rough clip counts** (one take per cell; the engine's two-take rule for the commonest lines adds about 10%):

| Set | Pre-A1 | to A1 | to A2 |
|---|---|---|---|
| Top 20 (13 simple after merges, 5 "to me", let) | about 30 | about 150 | about 320 |
| Top 40 (23 simple, 7 "to me", 6 noun + do) | about 50 | about 260 | about 550 |
| Top 100 (about 63 simple, 10 "to me", 20 noun + do) | about 150 | about 680 | about 1,430 |

- Without the light-verb and "to me" savings, the top 40 to A2 would cost about 840 clips, not 550.
- Recording the 200 to 300 most frequent whole sentences (engine § 8) cuts the cell clips needed early.

## 7. The small words, ranked

The ranks below use three inputs:
- frequency per 10,000 words in English speech to children (my AO-CHILDES count);
- whether the word is on Cambridge's Pre-A1 Starters list (read);
- what the engine knows (`grammar-kb.md`, 1 Oct, and `grammar-notes.md` §47–63).

Small words come late for children (§ 2). They are cheap to record, but often have several forms: "my" has a form for a he-thing, a she-thing, a plural, and before a place word.

| Rank | Word (English meaning) | Per 10k | Starters | Engine knows? |
|---|---|---|---|---|
| 1 | no, not, don't (negation) | about 240 together | yes | yes (agreeing "not" too) |
| 2 | yes, okay | 125 | yes | yes |
| 3 | you (child / elder) | 491 | yes | yes |
| 4 | I, me, to me | 246 | yes | yes |
| 5 | this, that (and these, those) | 363 | yes | yes |
| 6 | what | 220 | yes | yes |
| 7 | in | 101 | yes | yes |
| 8 | here, there | 150 | yes | yes |
| 9 | on | 86 | yes | yes |
| 10 | and, and then | 137 | yes | yes |
| 11 | my, your | 106 | yes | yes |
| 12 | where | 51 | yes | yes |
| 13 | he, she (one word in Kutchi), him, her | 153 | yes | yes |
| 14 | one, two, three | 84 | yes | 1–2 yes, 3–5 heard, 6–10 no |
| 15 | we (with you / without you), us | 97 | yes | yes |
| 16 | all | 36 | no | yes |
| 17 | some, a little | 67 | yes | partly ("a little", "enough") |
| 18 | to, for | 227 | yes | "for" yes; "to a person" unknown |
| 19 | with | 47 | yes | with a person yes; mixed in yes; with a tool unknown |
| 20 | now | 36 | yes | yes (two words) |
| 21 | more, another, again | 35 | yes | unknown |
| 22 | they, them | 69 | yes | yes |
| 23 | of (whose: "Nana's") | 59 | yes | yes (agrees with the thing) |
| 24 | how, how many | 35 | yes | yes |
| 25 | who | 29 | yes | yes |
| 26 | up, down, out, off | 110 | no | partly (put in, take out) |
| 27 | so, if, but, because, or | 101 | "but", "or" yes | "or" heard; the rest unknown |
| 28 | why, when | 36 | no | unknown |
| 29 | under, behind, in front of, next to, between | 10 | yes | yes |
| 30 | first, then | 26 | no | yes |
| 31 | very, too, just | 66 | yes ("very") | unknown |
| 32 | today, tomorrow, yesterday, later | 12 | "today" yes | tomorrow unsettled; yesterday for now; today and later unknown |
| 33 | from, near | 9 | "from" yes | unknown |
| 34 | which, whose | 7 | yes | "which" yes; "whose" unknown |
| 35 | every day | (low) | no | yes |

**Unknown words to put on Mum's next sheet** (ranked by frequency and game need): more or again, today, very, but or because, why or when, from, to (a person), near, with (a tool), whose.

## 8. Flaws and limits

**What is measured:**
- **English is a proxy.** No Kutchi corpus exists, and no child-speech corpus is public for Hindi, Urdu, Gujarati or Sindhi. Kutchi's verb frequencies could differ, especially around food and family routines.
- **The light-verb evidence is written and adult.** Hindi and Urdu news use far more noun + do than speech; treebanks also annotate differently (Urdu 58% vs Hindi PUD 18%). The child-talk share is my mapping, not a measurement.
- **The "likely build" column is judgement.** It comes from Hindi, Urdu and Gujarati, and Kutchi may differ verb by verb.
- **Coverage of verb uses is not understanding.** Verbs are a quarter of the words; a child also needs the nouns, the small words and the sentence frames.

**How it was counted:**
- **Automatic tags make errors.** Non-verbs were filtered out, and "do" was split by a rule of thumb; expect about 1 to 2 points of error in the coverage figures.
- **AO-CHILDES is mostly American and British middle-class homes.** The BNC and Switchboard samples are small (0.9M and 0.1M words), while the COCA lists cover the top 5,000 lemmas only.
- **The ages are adult ratings.** Kuperman's age-of-acquisition figures are adults' guesses; real first use is earlier.
- **Some sources could not be opened.** The CHILDES raw files and Wordbank's database now sit behind a login or a moved site, so the original CHILDES transcripts with child speech were not counted. Several papers (Ninio, Goldberg et al., Cameron-Faulkner et al., Narasimhan) were seen as abstracts only.

**What is assumed about the engine:**
- **The clip counts assume** one clip per cell and the cell sets above. Three open questions change them:
  - whether "right now" differs from "every day";
  - what the past with an object agrees with;
  - the plural "you".

## Proof

**Counted by me (data downloaded; scripts kept outside the repo, in the session scratchpad):**
- AO-CHILDES (adult speech to children aged 0–6, 3.65M words), BNC spoken sample, and Switchboard sample, POS-tagged, from the BabyLM corpus: https://huggingface.co/datasets/cambridge-climb/BabyLM (read; `clean_tagged/100M/aochildes.txt`, `10M/bnc_spoken.txt`, `10M/switchboard.txt`). Lemmas by `lemminflect` 0.2.3.
- BNC lemma list, Kilgarriff: https://www.kilgarriff.co.uk/BNClists/lemma.num (read).
- COCA top 5,000 lemmas with genre counts (Davies): https://www.wordfrequency.info/samples/wordFrequency.xlsx (read). Davies and Gardner, *A Frequency Dictionary of Contemporary American English* (2010): https://www.wordfrequency.info/files/book.pdf (summary).
- Kuperman, Stadthagen-Gonzalez and Brysbaert 2012, age-of-acquisition norms (mirror): https://huggingface.co/datasets/StephanAkkerman/English-Age-of-Acquisition (read); paper: https://link.springer.com/article/10.3758/s13428-012-0210-4 (summary).
- Universal Dependencies treebanks, counted for conjunct verbs and verb frequency (read):
  - Hindi HDTB: https://github.com/UniversalDependencies/UD_Hindi-HDTB
  - Urdu UDTB: https://github.com/UniversalDependencies/UD_Urdu-UDTB
  - Hindi PUD: https://github.com/UniversalDependencies/UD_Hindi-PUD
  - Hindi-English HIENCS: https://github.com/UniversalDependencies/UD_Hindi_English-HIENCS
  - Sindhi Isra: https://github.com/UniversalDependencies/UD_Sindhi-Isra
  - Gujarati GujTB: https://github.com/UniversalDependencies/UD_Gujarati-GujTB

**Papers and pages:**
- Vaidya, Agarwal and Palmer, "Linguistic features for Hindi light verb construction identification" (37% of 47,163 predicates; about 700 simple verbs): https://web.iitd.ac.in/~sumeet/coling.pdf (read).
- Vaidya and Wittenberg 2020, *JSAL* 11(3) (Hindi 37% vs English 9.5%; Persian about 115 simple verbs): https://ojs.ub.uni-konstanz.de/jsal/index.php/jsal/article/view/140/104 (read).
- Sethuraman, "Influence of parental input on learning argument structure constructions", BUCLD 28: https://www.bu.edu/bucld/files/2011/05/28-Sethuraman.pdf (read).
- Goldberg, Casenhiser and Sethuraman 2004: https://adele.scholar.princeton.edu/publications/learning-argument-structure-generalizations (summary).
- Ninio 1999, pathbreaking verbs: https://www.doi.org/10.1017/S0305000999003931 (summary).
- Cameron-Faulkner, Lieven and Tomasello 2003: https://scholars.duke.edu/publication/1458061 (summary).
- Frank, Braginsky, Yurovsky and Marchman, *Variability and Consistency in Early Language Learning* (Wordbank), ch. 11: https://langcog.github.io/wordbank-book/categories-syntactic.html (read).
- Tardif on verbs in Mandarin and English: https://www.scientificamerican.com/article/beyond-mama-and-dada-why-babies-learn-certain-words (summary).
- Brown's morpheme order, ASHA: https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/grammatical-morphemes-in-order-of-acquisition/ (summary).
- New General Service List: https://www.newgeneralservicelist.com/new-general-service-list (read).
- Hindi CDI, Rawal and Carstensen 2026: https://escholarship.org/uc/item/7q0647w3 (summary; the page came back empty). Auckland Hindi MCDI pilot: https://researchspace.auckland.ac.nz/handle/2292/19948 (summary). Urdu CDI, rural Pakistan: https://ecommons.aku.edu/pakistan_fhs_mc_women_childhealth_paediatr/405 (summary). Urdu and Pashto CDI: https://independent.academia.edu/humaanwaar (summary).
- Narasimhan, ergative case in Hindi child-caregiver speech: https://www.benjamins.com/catalog/tilar.9.08nar (summary). Narasimhan, Budwig and Murty 2005: https://forms.mpi.nl/node/41093 (summary). Pareek, Kidwai and Eisenbeiss: https://ojs.ub.uni-konstanz.de/jsal/index.php/fasal/article/view/81/43 (summary). Sarma on early imperatives: https://iitb.academia.edu/VaijayanthiSarma (summary).
- Sultana, Stokes, Klee and Fletcher 2016, Bangla verb morphology: https://cora.ucc.ie/handle/10468/3519 (read, abstract page).
- Gujarati compound verbs, corpus study: https://linguistics.uok.edu.in/Files/f6ec3740-422d-4ac1-9f52-ddfe2cffcb28/Journal/afb1551f-9f62-4d2f-84bc-5934d2941a60.pdf (summary).
- Persian child causatives and light verbs: https://www.cambridge.org/core/journals/journal-of-child-language/article/development-of-the-causative-construction-in-persian-child-language/1BC834F4072DC317CE671C2960A6B012 (summary).
- AQA GCSE Urdu grammar list: https://www.aqa.org.uk/subjects/urdu/gcse/urdu-8648/specification/subject-content/grammar (read).
- Cambridge Pre-A1 Starters wordlist 2018: https://www.cambridgeenglish.org/images/351849-pre-a1-starters-word-list-2018.pdf (read).
- Tried and blocked: CHILDES data at talkbank.org (404, now behind login); Wordbank (redirects to a data page); the Indiana "first 100 verbs" PDF (503); PubMed Central (bot check).

**Repo files read:**
- `build/reports/s12-research-a1-to-native.md`
- `docs/language/grammar-kb.md` (headings, §9–30)
- `docs/language/grammar-notes.md` (headings, §56–63)
- `docs/language/engine-design.md` (§1, 3–5, 7–9)
- `data/lang/lexicon.json` (the 61 verbs and their form cells)
