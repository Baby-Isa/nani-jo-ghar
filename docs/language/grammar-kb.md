# Grammar knowledge base: what the engine knows, guesses and lacks

Step 2b, 1 Oct 2026. For every grammar feature the language engine needs, this file says what is **KNOWN** (Mum or Zafar said it), what is only a **HYPOTHESIS** (an outside grammar predicts it), what is **UNKNOWN**, which game lines need it, and which question in Round 5 settles it.

**How to read it**

- **KNOWN** cites `grammar-notes.md` as "notes §n" (with the round and clip id where there is one). ⚠ = Whisper's hearing, not yet checked by Zafar (rule G2: such forms ship only as drafts).
- **HYPOTHESIS** cites its source: [GF-Snd] = the Grammatical Framework (GF) resource grammar for Sindhi (`gf-rgl/src/sindhi`, a 2012 student grammar, Sindhi in Arabic script); [Sindhi-gen] = general Sindhi grammar from the 30 Sept research pass (`sources/research-2026-09-30-grammar-checklist.md`), not re-verified; [Keine] = Keine, Nisar and Bhatt 2014, abstract only (the PDF is blocked by the proxy); [Gemini] = the AI blueprints (unverified, often wrong for the family). **A hypothesis is never a Kutchi form.** Under rule G1 (non-negotiable 4) it only shapes the questions and the engine's feature model. Sindhi forms are written as Sindhi, never put into game data.
- **Needed by** cites the game inventory (`sources/research-2026-09-30-game-inventory.md`) as "inv §1A #n" (its frame numbers) or "inv §6" (fragments), and Arc 1 errands (`game-design/story-and-arcs.md` § Arc 1).
- **Settled by** names the Round 5 question IDs (`mum-questions/Questions for Mum (Round 5).md`).
- **Jargon, once:** a *paradigm* is the full set of forms of one word (*hakro / hakri*); *agreement* is one word changing to match another (*khapeto* for a he-word); the *oblique* is the form a noun takes before a postposition (*chokro* → *chokre sathe*); a *postposition* is "in", "with" and so on placed after the noun (*rasore me*); *perfective* means a finished action ("ate", "went").

**Priority** (P1 blocks Cook; P2 blocks Arc 1, the Birthday; P3 later modes) is how the questionnaire was ordered.

**Scores (12 Nov 2026).** The summary table scores each area out of 100, by the rule under it; re-score after every recording session.

---

## Summary table: how complete each area is (scored 12 Nov 2026)

Each area's plain name comes first, its technical name in brackets. **Today** and **Before 12 Nov** are scores out of 100, made by the rule below from the score sheet under it. Average: **73** today, 66 before Mum's 12 Nov session (Words 82, Phrases 74, Sentences 67, Conversation 73). Area 12 went down: the session opened a doubt. Vocabulary has no score; its coverage follows the score sheet. The picture of this table: `build/reports/language-engine-map.html` (a 12 Nov snapshot); the engine in plain words: `engine-map.md`.

| Area: plain name (technical name) | # | Group | Today | Before 12 Nov | What's left to close the gap |
|---|---|---|---|---|---|
| He-words and she-words (noun gender) | 1 | Words | **85** | 70 | 9 kitchen nouns: 3 wait on Zafar's word choice (salt, black pepper, chilli powder), 6 on Mum (meat, sekelo, naan, corn, vegetable, mixed); the clinic's 5 were not asked. |
| One and more than one (plural) | 2 | Words | **85** | 80 | When the *-yu* plural is needed; chilli's plural; whether one tomato is *tameto* or the English word. |
| The form before "in", "with", "on" (the oblique case) | 3 | Phrases | **80** | 70 | More than one he-word before "with / in / on" ("with the big boys"), and "the boys' cup". |
| "The" and "a" (articles) | 4 | Words | **100** | 100 | Nothing: Kutchi has no "the" or "a". A known answer. |
| Whose it is (possession, the genitive: *jo / ji / je / ja*) | 5 | Phrases | **80** | 80 | "Of" with more than one thing or owner before "in / on"; "our" and the elder "your" before "in / on". |
| Describing words (adjectives) | 6 | Phrases | **85** | 85 | A few forms not heard: "good" for more than one, "small" before "with", the he-forms of the chai words. |
| Numbers and counting (numerals) | 7 | Words | **70** | 45 | 5 to 10 (lost in the noise; five is still unconfirmed); 11 to 19 said but not yet in the engine; second, third. |
| Amounts: "a spoon of", "half a cup" (measure words) | 8 | Phrases | **85** | 30 | "Half a cup of chai", "a glass of chai"; *itli* or *itlo* with sugar; "as many as they said" is fixed lines, not a rule. |
| I, you, he, she, we, they, and "to me" (pronouns and the dative) | 9 | Words | **80** | 80 | "To us" for the "we" that leaves the listener out; "with me" heard once. |
| Talking to a child or an elder (person and politeness (register)) | 10 | Conversation | **70** | 65 | "Will you make…": *dinda* or *dinde* for whom; how to speak to several children; the "please" form beyond one verb. |
| "Is", "am", "are", "was" (the verb "be" (the copula)) | 11 | Sentences | **60** | 60 | "Was" for she-words and for more than one; "there is", "there isn't", "I have". |
| "I'd like" (*muke … khape* (the dative-subject construction)) | 12 | Sentences | **90** | 100 | Polite with more than one thing: Mum's *khapanta* (25 Sept) or *khapeta* (Zafar's voice, 12 Nov). Zafar rules, then Mum once more. |
| What happens now and every day (present tense) | 13 | Sentences | **60** | 60 | "Right now" against "every day"; any verb other than eat, see and can; "like" for a he-thing. |
| What will happen (future tense) | 14 | Sentences | **60** | 60 | "You will", "we will", "they will"; *achdo* against *achindo*. |
| What happened: "came", "went" (past tense, no object (intransitive)) | 15 | Sentences | **40** | 40 | "I went" (boy, girl), "they went", and a plain past without the "went" helper. |
| What someone did to something: "ate", "made", "found" (past tense with an object (transitive; the agreement split)) | 16 | Sentences | **50** | 50 | "He saw", "she saw", "Nana saw me"; "ate / made / found / cut" without the helper; we, you, they. |
| Two-part verbs and helpers (compound and auxiliary verbs) | 17 | Sentences | **80** | 75 | 17 verbs with no Kutchi yet (roll, sprinkle, serve, open, close …); the "for me" and polite forms of the cooking verbs. |
| Telling someone to do something (commands (the imperative)) | 18 | Conversation | **50** | 50 | The elder or polite form of 32 of the 35 command verbs; commands to several children; "let's eat". |
| Saying no and not (negation) | 19 | Sentences | **60** | 60 | "No chilli" inside a whole order; "without" with a he-word dish; "I don't eat", "she didn't go"; she can't, they can't. |
| Asking (questions (interrogatives)) | 20 | Conversation | **75** | 75 | "When"; "who" as the doer (*kere*, unconfirmed). |
| "In", "on", "for", "up to" (postpositions) | 21 | Phrases | **65** | 50 | "From" (the pantry, the cupboard); near, left and right of, on top of, in the corner: 10 with no Kutchi. |
| Marking who it is done to (the object marker *ke*) | 22 | Phrases | **75** | 75 | When a thing (not a person) takes *ke*; "give it to Nana" with a name. |
| Joining: "and", "with", lists, "first … then" (conjunctions and coordination) | 23 | Sentences | **80** | 55 | "And one with potato" is answered but not built; a list of 3 to 6 things with one verb; but, because, if, when. |
| Word order (syntax) | 24 | Sentences | **90** | 75 | Where *na* goes in a long sentence. |
| Calling out to someone (the vocative) | 25 | Conversation | **75** | 75 | Calling several at once ("Boys!"). |
| When, how and how much (adverbs of time, manner and degree) | 26 | Words | **70** | 50 | "A lot" (unclear), "very", tomorrow and yesterday (unsettled), "today", "each". |
| "To cook", "for tasting" (verb nouns (the infinitive)) | 27 | Phrases | **65** | 65 | "To cook" (unclear hearing); whether *winnu* changes before *ji*; making it from any verb. |
| A boy or a girl speaking (speaker-gender agreement) | 28 | Conversation | **85** | 85 | "I found", "I ate", "I'm eating" for verbs beyond give, see, eat and can. |
| Set phrases, recorded whole (fixed expressions) | 29 | Conversation | **80** | 75 | 28 of the kitchen's 76 set lines, and 204 of the clinic's 219 lines, have no Kutchi yet. |
| "The one with milk", "very", "again" (relative clauses and intensifiers) | 30 | Phrases | **60** | 50 | "The one with milk" (the short word after *je laal ai* was not caught); "very" and "again" heard once each. |

## How the scores are made (the scoring rule)

Re-score after every recording session (`/mum-round`, step 5). It takes the score sheet, the new section of `grammar-notes.md` and the gap counts.

1. **Each area has a fixed list of needs:** the things the engine must know to say that area's sentences in the games (Cook, the clinic, Arc 1 and the modes named in each area's "Needed by"). Add a need only when a game line needs it (a new row in `data/lang/reports/gap-list.md`), and say so in the session report: a score can go down that way, and that is honest.
2. **Mark each need:**
   - **✔ = 1.** Mum, Masi or Zafar's ruling said it clearly, **and** the engine holds it (a form, a word-class cell or a rule in `data/lang/`, draft or confirmed). **A known "none" is ✔ too:** when Mum says Kutchi has no such thing (no "the", no word for "next"), that is the answer.
   - **◐ = ½.** Heard once; an unclear hearing (⚠); Mum unsure; Mum and Masi differ with no ruling; waiting on Zafar's ruling; or answered but not yet built into the engine.
   - **○ = 0.** Not asked, or only predicted by an outside grammar (a hypothesis is never Kutchi: rule G1).
   - **A need that is a list** (the genders of the kitchen nouns, the verbs with a polite form) scores its fraction, known ÷ needed, counted from `data/lang/`.
3. **Score = 100 × points ÷ needs, to the nearest 5; a tie goes down.** 100 only when every need is ✔.
4. **What does not move a score:** a spelling still to confirm (it is on the session report's list), and recordings (they are counted under vocabulary coverage).
5. **Each mark cites its source** (`grammar-notes.md` §n). No source, no ✔.
6. **Before** is the same sheet with that session's answers taken out, so the table shows what one sitting bought. After the next session, today's column becomes "Before".
7. **Keep the area number out of a row's first cell** in the two tables here: `build/tools/ops/recordings.mjs` reads every row of this file that starts with a bare number (the status table further down) into the recording sheet.

## Score sheet (12 Nov 2026)

§n = `grammar-notes.md`. "[before: …]" is the need's mark before the 12 Nov session, where the session changed it. The area sections further down date from 1 and 5 Oct; where they are older than a mark here (the 24 Oct answers, §56-§63, and the 12 Nov answers, §64-§67), this sheet is the newer word.

| Area | Needs, each marked (and its mark before 12 Nov where it changed) | Points | Today | Before |
|---|---|---|---|---|
| 1. He-words and she-words | ✔ two genders, no third; an unknown word takes the he-form (§1, §5, §24 B4, §37.5) · ✔ how it shows: "one", "big", the polite "I'd like" (§2, §31, §40) · 0.82 kitchen nouns with a known gender: 41 of 50 (§64) [before: 0.34 17 of 50] · 0.50 clinic nouns that have Kutchi: 5 of 10 | 3.32 of 4 (before 2.84) | 85 | 70 |
| 2. One and more than one | ✔ he-words in *-o* take *-a* (§4, §34) · ✔ she-words in *-i* don't change (§4) · ✔ other endings don't change (§34) · ✔ a counted noun takes the plural (§34) · ✔ tomato: *tameta* (§64) [before: ◐ a wrong hearing, §34 P3] · ◐ the *-yu* plural: Mum gave the words, not when it is needed (§40, §45, §54) · ◐ chilli's plural: *mirchi* only for now (decision 5) | 6 of 7 (before 5.5) | 85 | 80 |
| 3. The form before "in", "with", "on" | ✔ a he-word in *-o* takes *-e* (§41, §48; *chunde*, *batate*, *tapele*, §65, §67) · ✔ so do its describing word and its "of" word (§41, §49) · ✔ other nouns don't change (§36, §41) · ✔ an owner before "of" takes it (§48) · ◐ "one" in that form: *hakre fare* only (§66) [before: ○ not heard] · ◐ more than one he-word: *chokra sathe* heard once (§36); open (§55 "still open") · ◐ plural owners ⚠ (§48) | 5.5 of 7 (before 5) | 80 | 70 |
| 4. "The" and "a" | ✔ Kutchi has none (§9, §43; rule G4) | 1 of 1 | 100 | 100 |
| 5. Whose it is | ✔ "of" agrees with the thing owned (§47) · ✔ *je* before "in / on" (§49) · ✔ my, your (child, elder), his/her, our (both), their (§54) · ◐ those before "in / on": my, your, his/her known (§55); elder "your" and "our" not said · ◐ more than one thing or owner before "in / on" (§48 ⚠; not asked) | 4 of 5 | 80 | 80 |
| 6. Describing words | ✔ four forms: he one, he more, she, before "in / with" (§40, §41) · ✔ the same after "is" (§42) · ✔ the ones that never change (§44) · ✔ it goes before the noun (§24, §25) · ✔ no "the big one": Kutchi points, or adds a verb (§43): a known "none" · ✔ the biggest: *wadho ma wadho* (§43) · ○ forms not heard: *saro* for more than one, *nindhe*, the he-forms of *kari / mori* (§10, §45, §46) | 6 of 7 | 85 | 85 |
| 7. Numbers and counting | ✔ "one" agrees: *hakro / hakri* (§2) · ✔ two, three, four (§3, §34) · ✔ the number goes before the noun; only "one" changes (§3) · ✔ "{x} times": *hakre fare, ba fare, trae fare* (§66) [before: ○ English in the game] · ◐ 11 to 19, 21, 22, 90, 100, 1,000: said (§67), not yet in the engine [before: ○ not asked] · ◐ counting aloud starts *hakro* (§67, in noise) [before: ○ not asked] · ◐ first is *pela* (§7); second, third not asked · ○ 5 to 10: unclear in the noise (§67); five is from the handout only | 5.5 of 8 (before 3.5) | 70 | 45 |
| 8. Amounts: "a spoon of", "half a cup" | ✔ the measure first, the stuff after it (§25, §29 R7) · ✔ whole, heaped, half (§24 B4-B5) · ✔ a spoon of sugar: *hakri chamchi khun* (§64, §65) [before: ○ M1 not asked] · ✔ a quarter to two and a half cups (§67) [before: ○ not asked] · ✔ a pinch, a handful (§67) [before: ○ not asked] · ◐ half a cup: *adho cup* (§67); "of chai" and "a glass of" not said [before: ○ not asked] · ◐ as many … that many: *jitli … itli* (§67): fixed lines, no rule; *itli* or *itlo* open [before: ○ not asked] | 6 of 7 (before 2) | 85 | 30 |
| 9. I, you, he, she, we, they, and "to me" | ✔ I, you (child), you (elder), he/she: one word (§21, §23, §51) · ✔ two "we"s: *pa*, *asa* (§52) · ✔ they, these, those (§53, §63) · ✔ to me, you, him/her, us, them: *muke, toke, anke, inke, panke, iloka ke* (§56) · ✔ this, that, here, there, where (§13, §23) · ◐ "with me": *mu sathe*, once (§12) · ○ "to us" for *asa*: not asked | 5.5 of 7 | 80 | 80 |
| 10. Talking to a child or an elder | ✔ *tu* to a child, *aai* to an elder (§21; rule G6) · ✔ respect uses the plural ending, the same for a man or a woman (§21) · ✔ the elder "you" and "we" share a form (§51, §62) · ✔ everyday *khape* against the polite form that agrees (§1, §31, §58) · ◐ *dinda* or *dinde*: which for whom (§37.7) · ◐ the "please" form: one verb, *wijij* (§65) [before: ○ not heard] · ○ several children at once: not asked | 5 of 7 (before 4.5) | 70 | 65 |
| 11. "Is", "am", "are", "was" | ✔ am, are, is, by person: *aiya, aiye, aayo, ai, ain* (§42, §51) · ✔ it goes last (§15) · ◐ was: *wo*, for one he-thing only (§20) · ◐ isn't: *nai* (§14) · ○ there is, there isn't, I have: not asked | 3 of 5 | 60 | 60 |
| 12. "I'd like" | ✔ everyday *khape* never changes (§1) · ✔ the polite form follows the thing: *khapeto / khapeti* (§1, §31, §58) · ✔ not wanting (§11, §24 B1) · ✔ you, he/she, we, they want (§58) · ✔ need is *… ji jaruri* (§58) · ◐ polite with more than one thing: *khapanta* (§1) or *khapeta* (Zafar's voice, §65) [before: ✔ *khapanta*, §1, unquestioned] | 5.5 of 6 (before 6) | 90 | 100 |
| 13. What happens now and every day | ✔ every day, for every person, with "eat" (§62) · ✔ "I see", "I can" follow the speaker (§57, §61) · ◐ right now: *ukreto*, *bareto* (§25); the same as every day? · ◐ like: *arreti* ⚠; the he-thing form not heard (§59) · ○ any other verb: forms are held verb by verb | 3 of 5 | 60 | 60 |
| 14. What will happen | ✔ "I will" follows the speaker (§32, §57) · ✔ he/she will come, child and elder (§21) · ◐ you will: *dinda / dinde* (§37.7) · ◐ *achdo* or *achindo* (§21) · ○ we will, they will: not asked | 3 of 5 | 60 | 60 |
| 15. What happened: "came", "went" | ✔ came, became, with the "went" helper (§19, §21) · ✔ the ending follows who did it (§19, §21) · ○ I went (boy, girl): not asked · ○ they went: not asked · ○ a plain past without the helper: not asked | 2 of 5 | 40 | 40 |
| 16. What someone did to something: "ate", "made", "found" | ✔ gave: the ending follows the giver, not the thing (§56) · ✔ I saw: it follows the speaker (§57; Zafar, 26 Oct) · ◐ he saw, she saw, Nana saw me: inconclusive (§57) · ◐ ate: with the "went" helper only (§20) · ○ ate, made, found, cut without it (C123-C136 not asked) · ○ we, you, they did: not asked | 3 of 6 | 50 | 50 |
| 17. Two-part verbs and helpers | ✔ "for me": *banai de*, *kar de* (§9, §27) · ✔ "finish it": *chad* (§38) · ✔ the "went" helper (§19, §20) · ✔ can; want to, have to, need to (§60, §61) · ✔ bring: *khani achi de* (§65) [before: ◐ *khanechi* ⚠, §33] · 0.74 verbs with Kutchi, or a known "no word" (pour): 49 of 66 (§38, §67) · ○ the "for me" and polite forms of the cooking verbs: not asked | 5.74 of 7 (before 5.24) | 80 | 75 |
| 18. Telling someone to do something | ✔ to a child: the bare verb (§21, §27, §38) · ✔ don't: *na* after the verb; before it when urgent (§12) · ◐ let's go: *winja* ⚠ (§33); let's eat not asked · 0.09 the elder or polite form: 3 of 35 verbs (*acho*, *karo*, §21; *wijij*, §65) [before: 0.06 2 of 35] · ○ to several children: not asked | 2.59 of 5 (before 2.56) | 50 | 50 |
| 19. Saying no and not | ✔ no, and a polite refusal (§11) · ✔ don't want (§11, §24 B1) · ✔ don't, with a verb (§12) · ✔ not this, that; nothing; none left (§13, §14) · ◐ can't: "I" only (§61) · ◐ without: *wagar ji*; with a he-word dish? (§10); *mori*, *kari* (§64) · ○ "no chilli" inside a whole order (L19, L24 not asked) · ○ I don't eat, she didn't go: not asked | 5 of 8 | 60 | 60 |
| 20. Asking | ✔ yes or no: the voice rises, no extra word (§27 B40, §58) · ✔ what, who, where, how many, how (§23) · ✔ which (§23; Zafar, 26 Sept) · ✔ the question word sits where the answer would (§30 K12) · ◐ who, as the doer: *kere* ⚠ (§23) · ○ when: not asked | 4.5 of 6 | 75 | 75 |
| 21. "In", "on", "for", "up to" | ✔ in, for, with a person, also (§6, §8, §36) · ✔ on, under, inside, behind, beside, in front, facing, between (§15, §16) · ✔ the short and the long way (§41, §55) · ✔ up to, according to (§67) [before: ○ not asked] · ○ from: not answered · ○ near, left and right of, on top of, in the corner, with a tool (§17: the family points) | 4 of 6 (before 3) | 65 | 50 |
| 22. Marking who it is done to | ✔ to me, you, him/her, us, them (§56) · ✔ a name takes *ke* (§20, §57) · ◐ a thing taking *ke*: once (§25 B19) · ◐ "give it to Nana": the pattern is known, the sentence not said | 3 of 4 | 75 | 75 |
| 23. Joining: "and", "with", lists, "first … then" | ✔ and; a list (§6) · ✔ first … and then (§7) · ✔ or (§9) · ✔ mixed into chai: *waari* (§6) · ✔ with a person, with a side: *sathe* (§7, §36, §64) · ✔ with a filling: *chunde ja samosa* (§65, built) [before: ○ Cook's biggest gap] · ◐ "and one with potato": answered (§65), not built [before: ○ not asked] · ◐ a list with one verb: "bring me these for chai" built (§65); 3 to 6 things not [before: ○ not asked] · ○ but, because, if, when: not asked | 7 of 9 (before 5) | 80 | 55 |
| 24. Word order | ✔ the verb last (notes, "Is Kutchi like Japanese?") · ✔ "in / on / with" after the noun; number and describing word before (§3, §15) · ✔ "to me" first; "I" and "you" often dropped (§1, §20) · ✔ the question word stays in place (§30 K12) · ✔ where a filling and "in my chai" go (§65) [before: ○ unknown] · ◐ where *na* goes in a long sentence: one example (§61) | 5.5 of 6 (before 4.5) | 90 | 75 |
| 25. Calling out to someone | ✔ *E chokro! / E chokri!* (§36 C21) · ✔ names and titles alone (§36) · ✔ *beta* for a grandchild (§22) · ○ several at once: not asked | 3 of 4 | 75 | 75 |
| 26. When, how and how much | ✔ now (two kinds), quickly, slowly, a little while (§24, §25) · ✔ a little, more, enough, only, still (§24, §25, §67) · ✔ every day: *roj* (§62) · ✔ "next": Kutchi has no word (§67): a known "none" [before: ○ not asked] · ◐ tomorrow ⚠, yesterday (§33, §37.9, §57, §60) · ◐ very: *bo* ⚠ (§33, §45) · ◐ a lot: unclear (§67) [before: ○ not asked] · ○ today, each: not asked | 5.5 of 8 (before 4) | 70 | 50 |
| 27. "To cook", "for tasting" | ✔ to go, after want, have to, need (§60) · ✔ let me taste (§27 B46) · ✔ the form before a helper: *kari, khai, winni* (§38, §61) · ◐ to cook: *randhnu* ⚠ (§33) · ◐ does *winnu* change before *ji*? (§60) · ○ making it from any verb: no rule | 4 of 6 | 65 | 65 |
| 28. A boy or a girl speaking | ✔ I will (§32, §57) · ✔ I gave, I saw (§56, §57) · ✔ I eat, I can (§61, §62) · ✔ want and like follow the thing, never the speaker (§58, §59, §64) · ✔ I am: the same for both (§51) · ○ I found, I ate, I'm eating: not asked | 5 of 6 | 85 | 85 |
| 29. Set phrases, recorded whole | ✔ greetings and goodbyes (§21, §30) · ✔ how are you, I'm fine (§21, §27) · ✔ yes, no, well done, enough, careful, wait (§23 to §27) · ✔ thank you: the family says the English; *aabhar* given (§67) · 0.63 the kitchen's set lines in Kutchi: 48 of 76 (§67) [before: 0.50 38 of 76] · 0.07 the clinic's lines in Kutchi: 15 of 219 | 4.7 of 6 (before 4.57) | 80 | 75 |
| 30. "The one with milk", "very", "again" | ✔ "the big one": none; Kutchi points, or adds a verb (§43): a known "none" · ◐ "the one that is red": *je laal ai …* ⚠ (§44 C43) · ◐ very: *bo* ⚠ (§33, §45) · ◐ again: *be fare na kara*, once (§66) [before: ○ not heard] | 2.5 of 4 (before 2) | 60 | 50 |

## Vocabulary coverage: the kitchen games (12 Nov 2026)

Vocabulary is never "100%", so it gets a coverage figure: the words the kitchen games use today (the word ids in `data/cook.json` and `data/stations/*.json`, each asked once the way the gap list asks it) against what is known, recorded and approved.

| | Words | Of |
|---|---|---|
| The kitchen games use | 73 | |
| Have a Kutchi word | 71 | 73 (the other 2, green pepper and turner, have none: Mum, §67) |
| Confirmed, not a draft | 47 | 73 (24 drafts: heard once, or a spelling waits for Zafar) |
| He-word or she-word known | 41 | 50 nouns |
| Recorded in a family voice (any take) | 46 | 73 |
| Recorded and checked OK (Zafar's ear or the blind check) | 29 | 73 |
| Approved for the game | 46 | 73 (every clip: Zafar, 12 Nov) |
| Approved for the app stores (`"final"`) | 0 | 73 |

Around it: the engine says 94 of the kitchen's 125 lines in full Kutchi (the other 31 show grey English); the clinic has Kutchi for 25 of its 129 words and 15 of its 219 lines; the whole word store holds 1,218 entries (344 confirmed, 209 draft, 665 English only). Sources: `data/lang/lexicon.json`, `data/family-audio.json`, `data/lang/reports/gap-list.md` and `coverage.md`, as built by `node build/lang/import_all.mjs` on 12 Nov.

## Status by area, 1 and 5 Oct (this table feeds the recording sheet)

`build/tools/ops/recordings.mjs` reads these rows into `recording-sheet.md` §1b, so a changed cell here needs the sheet rebuilt. The Status column is as it stood on 5 Oct and is older than the scores above (areas 1, 7, 9, 13, 16, 22, 23, 28 and 30 among those that have moved since); **Settled by** names the Round 5 questions.

| # | Feature | Status | Priority | Settled by |
|---|---|---|---|---|
| 1 | Noun gender | Rule known; most Cook nouns unknown | P1 | L34–L50, M1–M9 |
| 2 | Plural | Rule mostly known; -yu plural common on she-words, optional when the sentence shows the plural (5 Oct) | P1 | L46–L51, Q13 |
| 3 | Oblique before postpositions | **Known for one thing** (5 Oct: he-word *-e*, also on its describing word and *jo*); plural open | P2 | Q2, Q3; plural still open |
| 4 | Articles | Known: none | — | — |
| 5 | Possession *jo / ji / je / ja* | **Known** (5 Oct: agrees with the thing; *je* before a postposition; *munjo, tojo, anjo, injo, asanjo, panjo, iloka jo*) | P2 | — |
| 6 | Adjectives | **Mostly known** (5 Oct: *wadho/wadha/wadhi/wadhe*; *laal* invariant; *dayo* vs *saro*) | P1 (maani) / P2 | L25, L92 |
| 7 | Numbers and counting | 1–2 known, 3–5 heard, 6–10 unknown | P1 | L52, L53, L54, E119–E123 |
| 8 | Measures and "a skewer of" | Partly known | P1 | M1–M9, L14, L27, L57 |
| 9 | Pronouns and "to me" forms | Mostly known (5 Oct: *pa* / *asa* we, *iloka* they, *hi/hu mare*); "to him/them" open | P2 | C86–C92, L93, L82 |
| 10 | Person and politeness (*tu / aai*) | Rule known; verb forms partial | P1 | Q8, C142–C150, L32 |
| 11 | "Be" (*ai*, *wo*, *nai*) | Present known (5 Oct: *aiya, aiye, aayo, ai, ain*); past and negative partial | P2 | L73, L79, L90, C152 |
| 12 | "I need" (*muke … khape*) | Known | P1 | L9–L33 (re-heard in context) |
| 13 | Present tense | Unknown | P2 | C97–C103, C110–C114 |
| 14 | Future | Partly known | P3 | C137–C140 |
| 15 | Past, intransitive | Partly known | P3 | C152, C154 |
| 16 | Past with an object (the agreement split) | Unknown; the biggest structural risk | P2 | C123–C136, L72, L74, L80–L82 |
| 17 | Compound and helper verbs | Cooking verbs known as bare commands (5 Oct, Section I); polite and "for me" forms open | P1 | N-lines, L55–L61 |
| 18 | Commands (child, elder, several) | Partly known | P1 | C142–C151, N1–N23, L55–L61, L76 |
| 19 | Negation | Partly known | P1 | L10, L19, L24, L61, C148–C152 |
| 20 | Questions | Partly known | P2 | C153, C154, L73, L77, L79 |
| 21 | Postpositions | Partly known | P1 (*me*, *lai*) / P2 | L83–L87, L69, L70 |
| 22 | Object marker *ke* | Heard once | P2 | L93, C132–C136 |
| 23 | "and", "with", lists, "first … then" | "with" for food unknown: **Cook's biggest gap** | P1 | L9–L31, L55, L60, L88, L89 |
| 24 | Word order | Known in outline | P1 | every sentence |
| 25 | Calling out (vocative) | Known | P3 | Q6 |
| 26 | Time, manner and degree words | Partly known | P1 / P2 | L58, L67, L91 |
| 27 | "to cook", "for tasting" (verb nouns) | Heard | P3 | — |
| 28 | Speaker gender ("I will", "I found") | Known in one verb | P2 | L74, L80, C128, C137 |
| 29 | Fixed phrases | Known list | P1 | recorded whole |
| 30 | "the one with milk", "very", "again" | Unknown | P3 | L91, L92 |

---

## 1. Noun gender

- **KNOWN.** Two genders, he-words and she-words (notes §1, §5). Mum's rule for an unknown gender: use the he-form (notes §24 B4, §37.5). He-words: *ambo, cup, table, paani, dudh, darwajo, bakro, chokro, chamcho, bateto*, and *gutan* ⚠ (notes §2, §29 R8, §31, §35). She-words: *maani, kursi, chai, lakri, chamchi, bakri, chokri, baju, film*, plus *pacheri* ⚠ (Mum: "it can be *hakro*" too, §35 C4) and *akh* ⚠ (§35 C10) (notes §2, §5, §17, §25, §35, Zafar §21 corrections). Chutneys take *ji*, so are probably she-words (inference, `decisions.md` working assumptions).
- **HYPOTHESIS.** [GF-Snd] two genders, 14 noun classes. [Gemini] three genders (a neuter): **not supported** by anything Mum has said (`sources/README.md`).
- **UNKNOWN.** The gender of most Cook nouns: *khun, atto, daar, chaat, samosa, sekelo, gos, boga, chips, ghee, dai, sev, chana, dhania, chundo, loon, lasan, aadu, hardar, jeeru, rai, elchi, tameto, dungri, mirchi, limu* (inv §3A–3B: all "?"); Arc 1 nouns (cake, candle, balloon, present, cat, guest, sweets).
- **Hint.** *dungri wagar ji daar* (§10) would make daar a she-word if *wagar ji* agrees; that is itself unconfirmed (feature 19).
- **Needed by.** "one" *hakro/hakri* in every count (inv §1A #15), *wadho/wadhi* (#1, maani L4), the polite *khapeto/khapeti* (Conversations, inv §1E), *nato/nati* (#4), past-tense agreement (feature 16).
- **Settled by.** L34–L45 (the polite "I'd like some …" shows gender through *khapeto/khapeti*, the frame Mum used herself in K10), M1–M9 and L46–L50 ("one …"), L62–L66.

## 2. Plural

- **KNOWN (5 Oct, notes §40, §45, §54).** She-words often take ***-yu***: *chokriyu, pacheriyu, bakuliyu, pialiyu, gadiyu, kursiyu, chakliyu, shatiyu*. *maani*, *kan*, *pag*, *tawa* have none. Mum: the noun's plural can be dropped when something else in the sentence already shows it (*hi mare munji kursi ain*), but not when the word changes without getting longer (*amba*). English *cups* is used as is.

- **KNOWN.** He-words in -o → -a (*ambo/amba, darwajo/darwaja, bateto/bateta, chamcho/chamcha, chokro/chokra, bakro/bakra*; notes §4, §34, §35). She-words in -i don't change (*maani, dungri, mirchi, chamchi, lakri, pacheri*). Words ending otherwise don't change (*cup, table, limu, gutan, samosa*). A counted noun takes the plural (*ba amba, trae bateta*; notes §34).
- **Draft ⚠.** -yu plurals of she-words: *akh/akhyu, chokri/chokriyu* ("probably correctly … but we make it short"), *chiju* (notes §35, §37.3). *bakri → bakra* came out oddly (§36 C17).
- **HYPOTHESIS.** [GF-Snd, Sindhi-gen] she-words -i → -iyun, consonant-final she-words → -un. Matches *akhyu*; the family usually shortens.
- **UNKNOWN.** When -yu is required; *mirchi* plural (decision 5: *mirchi* only for now); *tameto* (does it change? notes §34 P3 ⚠).
- **Needed by.** Every count (inv §1A #15, §7 item 3).
- **Settled by.** L46, L47, Q13, Q14, C22–C27.

## 3. The oblique (a noun's form before a postposition)

- **KNOWN (5 Oct, notes §41, §48, §49, §55).** Before *sathe*, *me* or *je …*, a he-word in *-o* takes ***-e*** and so does its describing word and its "of" word: *wadhe chokre sathe*, *wadhe ambe je mathe*, *wadhe cup me* (the adjective changes even on *cup*), *Nani je ambe je mathe*, *chokre je darwaje je puthiya*, *toje ambe mathe*. Owners take it before *jo* too: *chokre jo cup*, *bakre jo kan*. With a describing word in front, Mum said *ambe* without hesitating, so §36's *ambo je mathe* was the bare-noun exception, not the rule. **Still open:** the he-word plural (*wadha chokra sathe* or *-e*?) and plural owners (*chokra jo cup* ⚠).

- **KNOWN.** *chokro → chokre sathe* (never *chokro sathe*, §36 C18), *darwajo → darwaje je puthiya* (§36 C14), *rasoro → rasore me* (§20, §33 S9). Other nouns don't change (*cup, table, maani, Nana, Nani, bakri*).
- **Draft ⚠.** But *ambo je mathe* and *bakro sathe* didn't change (§36 C13, C17; Mum hesitated over *ambe*). So it's a tendency, not a rule (notes §36 "Rule, as far as it goes").
- **HYPOTHESIS.** [GF-Snd] every -o he-word has an oblique -e (singular) and -an (plural, *chokran*). Mum said *chokra sathe*, which is nearer Gujarati. [Hyp] the -e may be only for people and places.
- **UNKNOWN.** Whether it's lexical, animate-only, or postposition-dependent; adjectives in the oblique ("with the big boy").
- **Needed by.** "in the pan", "on the plate", "from the table" (Arc 1 Put it there; N4, N5, L69), *rasore me*.
- **Settled by.** Q2, Q3 (re-takes), C28–C32, C59, L69, L83–L87.
- **Engine consequence.** Store an `obl` form **per noun** (default: same as the direct form), never a rule in code.

## 4. Articles

- **KNOWN.** Kutchi has no "the" or "a" (notes §9; rule G4). *hi* (this) points at one thing. *hakro* may double as "a" (unknown).
- **Needed by.** Nothing; the engine simply never emits an article.

## 5. Possession: *jo / ji / je / ja*

- **KNOWN (5 Oct, notes §47–§50, §54, §55).** The "of" word agrees with the **thing owned** (gender and number), never the owner: *Nana jo cup, Nana ja cups, Nana ji maani, Nani jo ambo*. *ji* is also the she-word plural (*chokriyu ji ain*); an unknown thing takes *jo/ja* (*Nana jo ai*). Before a postposition, *jo* → ***je*** with a he-word thing (*Nana je cup je andar* ⚠, *Nani je ambe je mathe*); *ji* stays (*chokri ji bakri sathe*). Pronoun owners: *munjo* (my), *tojo* (your, child), *anjo* (your, elder), *injo* (his/her), *asanjo* (our, not you), *panjo* (our, with you), *iloka jo* (their), each changing like *jo*: *munji kursi, munja amba, munje cup me*.

- **KNOWN.** One "of" word that agrees with the **owned** thing: *jo* for he-words (*munjo*, "mine"), *ji* for she-words (*bajr ji maani* §24 B11, *amli ji chutney*, *dudh wagar ji chai* §10), *je* before a place word (*table je niche*, *munje same*; §15, §16, §18). Mum: *je* means "belonging to" (§15).
- **Draft ⚠.** *khanje jo kabaat* (§34 P13).
- **HYPOTHESIS.** [Sindhi-gen] *jo / ji / ja* (he plural) / *jun* (she plural), *je* the oblique; pronoun forms *munjo/munji/munja, tunjo*.
- **UNKNOWN.** The plural forms; my/your/his/our/their; *Nani jo Ghar* itself (the title) is a he-word owned thing, consistent.
- **Needed by.** *bajr ji maani* (Cook, inv §3A), chutneys, "Nana's plate" (Arc 1 set the table), "for each guest".
- **Settled by.** C50–C55, C59, L41.

## 6. Adjectives (describing words)

- **KNOWN (5 Oct, notes §40–§46).** Agreeing adjectives have four forms: he one ***-o*** (*wadho*), he more than one ***-a*** (*wadha*, even with *cup*), she ***-i*** in both numbers (*wadhi chokriyu*), and ***-e*** before a postposition (*wadhe chokre sathe*). The same after "is": *chokro wadho ai, chokra wadha ain, chokriyu wadhi ain*. **Invariant:** *laal* (red), *fine*, *barabar* (right; goes after the noun). "Good" is ***dayo*** (well-behaved; people and animals) or ***saro*** (things), or the English *fine* (*bo fine*, very nice). No "the big one": point (*hi wadho chokro*) or add a verb (*wadho khan*). Superlative ***X ma X*** (*wadho ma wadho*). Still open: *saro*'s he plural, *nindhe*.

- **KNOWN.** Agreeing pairs: *wadho/wadhi* (big), *nindho/nindhi* (small), *aako/aaki* (whole, full), *bharelo/bhareli* (heaped), *ardo/ardi* (half portion), *kari* / *mori* (black / unsweetened; she-forms only heard) (notes §4, §10, §24, §25). The adjective comes before the noun (*ba wadhi maani*, *aako cup*). Invariant: *kali* (only), *tayar* (ready), *theek* (fine), *mixed* (English) (notes §25, §27). *lilo* = green (§26 B34).
- **HYPOTHESIS.** [GF-Snd] agreeing adjectives have 16 forms (number × gender × 4 cases); he plural -a, she plural -iyun.
- **UNKNOWN.** Plural forms (*wadha*? *wadhi*?); the oblique ("with the big boy"); after "is" ("the cup is big"); "the big one" with no noun; *karo/moro* (he-forms guessed, §10).
- **Needed by.** Maani L4 *ba wadhi maani* (inv §4), chai kinds (inv §1A #1), Arc 1 "the box is full" (L75), Find it colours (later).
- **Settled by.** L15, L25, L75, C22–C35, L92.

## 7. Numbers and counting

- **KNOWN.** *hakro/hakri* (one, agrees; notes §2), *ba* (two, said "ber"; §3). Only "one" changes with gender (Zafar, §3). Number before noun (*ba amba*).
- **Heard, not confirmed as a set.** *trae* (three, *trae bateta*, *trae dungri*; §34), *char* (four, *char limu*; §34). *panj* (five): handout only.
- **HYPOTHESIS.** [Sindhi-gen] *panj, chha, satt, aṭh, nav, ḍah* for 5–10. [Gemini] *ek* "one": **wrong for the family**.
- **UNKNOWN.** 5–10 as Mum says them; whether "one" is said when counting aloud (*hakro! ba! trae!*); "times" (inv §1B #19, English today); ordinals.
- **Needed by.** Every count (inv §1A #14, #15), counting rule E12, the count station (goes to 6), Arc 1 sweet box (L75).
- **Settled by.** L52, E119–E123, L53, L54.

## 8. Measures and "a skewer of"

- **KNOWN.** *aako cup* (a whole cup), *bharelo cup*, *bhareli chamchi* (§24 B5, §29 R3), *adh* (half, amounts), *hakri lakri mishkaki / ba lakri mishkaki* (one / two skewers of mishkaki, §25, §29 R7): the measure word comes first and the stuff follows bare.
- **Draft.** *hakri lakri gos / mixed* (Claude's extension, `decisions.md` working assumptions "Lakri order").
- **UNKNOWN.** "a spoon of sugar" (M1), "a glass of chai" (M9), "half a cup of chai" (L14).
- **Needed by.** Chai sugar rows, sekelo rows (inv §6), pour station.
- **Settled by.** M1–M9, L14, L27, L57.

## 9. Pronouns and "to me" forms

- **KNOWN (5 Oct, notes §51–§54).** *e* is both he and she. Two "we"s: ***pa*** (including the listener) and ***asa*** (not the listener); *pa mare / asa mare* = we all. ***iloka*** = they (people), said as one word ⚠. *hi / hu* = this, these / that, those; ***hi mare / hu mare*** = all of these / those (*mare* ⚠). *huda* = over there.

- **KNOWN.** *aau* (I), *tu* (you, to a child or same age), *aai* (you, to an elder), *e* (he/she) (notes §21, §23). "To" forms: *muke, toke, anke* (spelling confirmed by Zafar: grammar-notes "Zafar, 26 Sept (afternoon)", after §28), *panke* (to us) (§23, §37.1). *inke* (it, as an object; §25 B15). *mu sathe* (with me; §12), *munje* (of me, before a place word; §16). *hi / hu* (this / that), *hida / huda / kida* (here / there / where).
- **HYPOTHESIS.** [Sindhi-gen] two "we" (with or without the listener; *panke* fits the inclusive one); plural "you"; 3rd-person near/far (GF-Snd has `Pers3_Near | Pers3_Distant`).
- **UNKNOWN.** "they", "to them", "we" (both kinds), "to him / her".
- **Needed by.** Cook's frame uses only *muke* (fixed). Arc 1 "give this to Nana" (L93), Conversations.
- **Settled by.** C86–C92, L93, L82; the rest of Section C (C61–C85, "if there's time").

## 10. Person and politeness

- **KNOWN.** *aai* for anyone older, *tu* for the same age or younger (rule G6). Respect uses the **plural** ending: *hida ach / hida acho*, *e achi vyo / vya*, *ai / aayo*, *jaldi kar / karo* (notes §21, §27 B48). The same for a man or a woman (§21).
- **Draft.** *banai dinda / dinde*: one is for an elder, one for a child; which is which is unknown (§37.7).
- **HYPOTHESIS.** [GF-Snd] person is `Pers1 | Pers2_Casual | Pers2_Respect | Pers3_Near | Pers3_Distant`: the same split, which supports making "respect" a person value, not a separate switch.
- **UNKNOWN.** Commands to several children (is it the same as the respect form?).
- **Needed by.** Every customer line in Cook (child vs elder customers, inv §1C *Tu ki aiye / Aai ki aayo*), Conversations, Nani's commands to the child.
- **Settled by.** Q8, C142–C150, L32, L78.

## 11. "Be": *ai*, *wo*, *nai*

- **KNOWN (5 Oct, notes §42, §51–§53).** Present "be" by person and number, not gender: ***aau … aiya*** (I; man and woman alike), ***tu … aiye*** (you, child), ***aai … aayo*** (you, elder), ***e … ai*** (he, she, it), ***pa / asa … aayo*** (we), ***… ain*** (they, plural things). Spellings *aiya*, *aiye*, *ain* for Zafar.

- **KNOWN.** *ai* (is; also "I'm fine", *aau theek ai*), *aiye* (you are, child), *aayo* (you are, elder), *wo* (was: *kida wo?*, *table je mathe wo*), *nai* (isn't: *ki baki nai*) (notes §8, §14, §20, §21). *ai* comes last (*cup table mathe ai*, §15).
- **Draft ⚠.** *aiya* (I am, K13), *kenjo nai* (§33 S5).
- **HYPOTHESIS.** [GF-Snd] the copula changes with tense, number, person and gender.
- **UNKNOWN.** "are" for plurals, "was" for she-words and plurals, "there is / there isn't", "I have".
- **Needed by.** *Tayar ai* (Cook), Arc 1 "where are the sweets? under the chair" (L73), "everything's ready" (L79).
- **Settled by.** L73, L79, L90, C33–C35, C152.

## 12. "I need": *muke … khape*

- **KNOWN.** Informal *Muke {x} khape* never changes (rule G8; notes §1). The polite form agrees with the thing: *khapeto / khapeti / khapanta / khapanti* (§1, §31). Future *khapdo* (§33 S6). Negative *muke na khape*, polite *muke nato / nati khape* (§11, §24 B1).
- **Needed by.** The headline of every Cook order (inv §1A #1), Conversations.
- **Settled by.** Already settled; L9–L33 re-hear it inside whole orders, which also tells us whether Mum keeps *khape* or switches to the agreeing form in a long order.

## 13. Present tense ("every day", "right now")

- **KNOWN.** *bareto!* (it's burning), *ukreto* (it's boiling) (§25): stem + *-eto*. *mageni achenta* ⚠ (guests are coming; plural *-nta*, like *khapanta*).
- **HYPOTHESIS.** [Sindhi-gen] a present built from a subjunctive stem plus an agreeing *tho / thi / tha* helper. [Hyp] *khapeto* and *bareto* show a single present in *-to / -ti / -nta / -nti*.
- **UNKNOWN.** The whole paradigm (I, you, he, she, we, they; boy or girl speaker); whether "right now" differs from "every day".
- **Needed by.** Nani's commentary ("it's boiling"), Arc 1 ("the guests are coming"), Who did it.
- **Settled by.** C97–C103, C110–C114.

## 14. Future

- **KNOWN.** *e achdo* (he/she will come, child), *e achda* (elder), *achindo* (will come; Zafar) (§21). The "I will" form agrees with the **speaker**: *kar dis* (girl) / *kar dos* (boy) (§32).
- **HYPOTHESIS.** [GF-Snd] stem + *-indo / -indi / -inda*. [Hyp] *dis / dos* may be "give" + an "I" ending.
- **UNKNOWN.** "You will", "we will", "they will"; she-forms; *achdo* vs *achindo*.
- **Settled by.** C137–C140.

## 15. Past, without an object ("came", "went")

- **KNOWN.** A compound with "went": *e achi vyo* (came, child), *e achi vya* (elder), *thai vyo* (became, he) / *thai vai* (she) (§19, §21, Zafar's corrections). The ending follows the subject.
- **HYPOTHESIS.** [Sindhi-gen] *wiyo / wī / wiyā* (went).
- **UNKNOWN.** "I went" (boy / girl), plurals, a plain past without *vyo*.
- **Settled by.** C152, C154; C116–C122 if there's time.

## 16. Past with an object ("ate", "made", "found"): the agreement split

- **KNOWN.** Only compounds: *ker mitai khai vyo?* (who ate the sweets?), *Simba khai vyo / khani vyo* (§20). The research pass notes these prove nothing about the plain past, because *vyo* is a "went" helper (checklist B11).
- **Draft ⚠.** *Simba ke rasore me nares* (I saw Simba in the kitchen; *nares* is Whisper's hearing, §20).
- **HYPOTHESIS.** [Keine] in Kutchi, past sentences with an object show "defective" agreement, and with an "I / we" subject the verb agrees with the **object**. [Sindhi-gen] the verb agrees with the object (*ambo* → he-ending, *maani* → she-ending) and the subject takes an oblique form. Caution: Keine's consultants may speak "Kutchi Gujarati" (`sources/README.md`).
- **HYPOTHESIS (full paper read, 5 Oct).** [Keine] (a related Kutchi dialect, not the family's): "I" + past + object → the verb matches the thing (*Aau bateto kapyo*); "you / he / she" → an *-e* ending with no gender (*Nani dungri kape*); "we" either way; the "went" helper (*khai vyo*) switches the split off. Details and questions: `sources/research-2026-10-05-agreement-paper.md`, `mum-questions/Mum yes-no list (2026-10-05).md`.
- **UNKNOWN.** Everything: what the verb agrees with, whether the subject changes form, whether "I" differs from "Nani".
- **Needed by.** Arc 1 "the cat ate the sweets", "I found it / them" (L72, L74), Who did it, any "I made the chai" (Cook end screen, Story by the Fire).
- **Settled by.** C123–C136, L72, L74, L80–L82. Caution: L80 and L81 pair chai (she) with daar and samosa, whose genders are unknown, so they only isolate object agreement once L36 (daar) and L47 (samosa) have settled those genders; C123–C130 (mango vs maani) isolate it on their own. **The engine's feature model reserves room for both answers** (see `engine-design.md` § Syntax rules): agreement target is a per-tense setting in the grammar data, not code.

## 17. Compound and helper verbs

- **KNOWN (5 Oct, notes §38).** Cooking commands (bare, to a child): *ukar* (boil), *slow kar* (turn down), *wij / wiji chad* (put in), *kadhi chad* (take out) ⚠, *gund* (knead) ⚠, *firai / firai chad* (flip, stir), *dabai* (press) ⚠, *kap / kapi chad* (cut) ⚠, *bego kari chad* (mix), *tar* (fry) ⚠, *waar* (fold), *bhar* (fill), *chakh* (taste), *dho* (wash) ⚠, *bar* (light), *rakhi chad* (put down) ⚠. ***chad*** (from *chadi de*) finishes many of them, like "… it". No word for pour, serve, roll, sprinkle (I1, I7, I17, I18).

- **KNOWN.** *banai de* (make for me), *kar de* (do for me), *madad kar* (help), *chadi de* (leave it be), *lai de* (let me), *khai vyo / khani vyo / thai vyo* (§9, §19, §20, §25, §27, §33). *khanechi* ⚠ ("bring"; §33 S1, §37.8).
- **UNKNOWN.** Every cooking verb (chop, stir, roll, fold, fill, fry, grill, pour, boil, flip, thread, light, knead): inv §2 "no Kutchi at all". *wij* (put in / add) is known (§9).
- **Needed by.** All 30 guide-box lines (inv §5 Cook), the step form `Pela X {verb}, ne poi Y {verb}` (inv §7 item 6).
- **Settled by.** N1–N23, L55–L61; Section I (I1–I21) if there's time.
- **Engine consequence.** A verb entry can be multi-word (`banai de`); the engine inflects only the marked head part.

## 18. Commands (to a child, an elder, several)

- **KNOWN.** Bare root to a child (*kha!, de, wij, kadh, rakh, hal, ach*), *-o* to an elder (*acho, karo*) (§21, §27). *na* after the verb = normal "don't" (*ad na*), before = urgent (*na ad!*) (§12). "Let's go" *winja* ⚠ (§33).
- **UNKNOWN.** The form to several children; most verbs' elder form; "let's eat".
- **Needed by.** Every Nani instruction (guide box, inv §5), Arc 1 (L69, L76).
- **Settled by.** C142–C151, N-lines, L55–L61, L76.

## 19. Negation

- **KNOWN.** *na* (no; never *nar*), polite refusal *na, muke na khape* (§11, §30 K11; rule G7). "No sugar": *muke khun nati khape* / *khun nati khape* / *khun na* (very informal) (§11). Agreeing *nato / nati* (§24 B1). "without": *{x} wagar ji {dish}* (§10); all three of Mum's examples have *ji*, so whether it agrees with a he-word dish is unknown. "don't": *na* after the verb (§12). *hi na, hu* (not this, that; §13). *ki na* (nothing), *ki baki nai* (none left) (§14). *hever na* (not now; §25).
- **Working assumption.** Order rows use the short *{x} na* (`decisions.md`; rule H17).
- **UNKNOWN.** "isn't" with other verbs ("I don't eat", "she didn't go"); "no X" inside a whole order sentence.
- **Settled by.** L10, L11, L19, L24, L28, L61, C148–C152.

## 20. Questions

- **KNOWN.** Yes/no questions by rising voice only (no "can" word: §27 B40). Question words: *kuro* (what), *ker* (who), *kida* (where), *kitla* (how many), *kyo* (which; spelling confirmed by Zafar: grammar-notes "Zafar, 26 Sept (afternoon)", after §28), *ki* (how) (§23). The question word sits where the answer would (*chamchi kida ai?*, §30 K12).
- **UNKNOWN.** "when"; "who" as the doer (*kere* ⚠ §23; Zafar doesn't recognise it).
- **Settled by.** C153, C154, Q10, L73, L77, L79.

## 21. Postpositions ("in", "for", "with" …)

- **KNOWN (5 Oct, notes §41, §55).** Short ***me*** straight after the noun (*wadhe cup me*, *munje cup me*, *rasore me*); the fuller ***je andar*** (inside) adds *je* (*wadhi bakuli je andar*); *mathe* can follow the noun directly (*toje ambe mathe*) or after *je* (*Nani je ambe je mathe*).

- **KNOWN.** *me* (in, into; also "to" in *rasore me winja*), *lai* (for), *sathe* (with a person), *je mathe / niche / andar / puthiya / bajume / agiya / same / wich me* (on, under, in, behind, beside, in front, facing, between), *waari* (mixed in: *dudh waari chai*), *wagar ji* (without), *pan* (also) (notes §6, §8, §15, §16, §36). The short form drops *je* (*cup table mathe ai*, §15).
- **HYPOTHESIS.** [GF-Snd] "from" *khān*, "to" *ḍāṇhan*; Sindhi forms, not Kutchi.
- **UNKNOWN.** from, to (a person), near, with (a tool), at someone's house.
- **Needed by.** Cook's sugar line *Muke chai me ba khun khape(ti)* (inv §1A #9), "Bring me … from the cupboard" (N1), Arc 1 placing (L69).
- **Settled by.** L83–L87, L69, L70.

## 22. The object marker *ke*

- **KNOWN.** *Simba ke … nares* (I saw Simba; §20); *gadi ke ubhi rakh* (stop the car; §25 B19). *ke* also means "or" (§9).
- **HYPOTHESIS.** [Sindhi-gen] *khe* marks people as objects and "to".
- **UNKNOWN.** Whether "give it to Nana" uses *ke*; when things (not people) take it.
- **Settled by.** L93, C132–C136, C150.

## 23. "and", "with", lists, "first … then"

- **KNOWN.** *ne* (and; *ne chai, ne dudh*), *ne poi* (and then), *pela* (first), *Muke pela daar khape, ne poi maani* (§6, §7, §29 R5). *Daar ne maani* (daar and maani; §7). *waari* only for things mixed into chai (§6). *sathe* = with a person, *saathe* = together (§7, §36).
- **UNKNOWN.** **"with" for food** (samosa with mince, daar with onion): every Cook order says the English "with" today (inv §1B #17, ~90% of orders). **"and" between two kinds of one dish** (inv §1B #18). A list of 3–6 items with one verb (inv §6 pantry). "but", "because", "if", "when".
- **Needed by.** Every Cook order sentence (inv §7 items 4–6).
- **Settled by.** L9–L31 (the whole of Part 2), L55, L60, L88, L89.

## 24. Word order

- **KNOWN.** Verb last (*Simba ke rasore me nares*; notes "Is Kutchi like Japanese?"); postpositions after the noun; number and adjective before the noun; "to me" first in "need" sentences (*Muke … khape*); "I" and "you" often dropped (*khai vyo*). The question word stays in place (§30 K12).
- **UNKNOWN.** Where *na* goes in longer sentences; where an added "with …" phrase goes (before or after *khape*).
- **Settled by.** Every Part 2 sentence.

## 25. Calling out

- **KNOWN.** *E chokro! / E chokri!* (§36 C21); names alone (*Nana! Nani! Ali!*).
- **UNKNOWN.** "Boys!" (Q6).

## 26. Time, manner and degree words

- **KNOWN.** *hane* (now, in a sequence), *hever* (now, generally), *jaldi*, *aste thi*, *thori war*, *thorok*, *wadhare* (both confirmed by Zafar: grammar-notes "Zafar, 26 Sept (afternoon)", after §28), *bas*, *kali* (§24, §25). *saware* (tomorrow, ⚠ unsettled), *gaykal* (yesterday, for now) (§33 S3, §37.9). *bo* (very?) ⚠ (§33 S2).
- **UNKNOWN.** "today", "again", "very" (confirmed), "each".
- **Settled by.** L58, L67, L70, L91.

## 27. Verb nouns ("to cook", "for tasting")

- **KNOWN.** *chakhan lai de* (let me taste) (§27 B46); *randhnu* ⚠ (to cook, §33 S6) and *randhan lai* (for cooking, §33 S7, heard).
- **Needed by.** Story lines only today. Low priority.

## 28. Speaker gender

- **KNOWN.** "I will" agrees with who's speaking: *kar dis* (girl) / *kar dos* (boy) (§32). Zafar: "sometimes you're the noun".
- **UNKNOWN.** Whether "I ate / I found / I'm eating" do too.
- **Needed by.** The child's own replies (boy or girl character), L74 "I found it!".
- **Settled by.** L74, L80, C97, C110, C128, C137.

## 29. Fixed phrases (recorded whole, never built)

Greetings and stock phrases the engine treats as single meanings: *Salamun alaykum, Alaikum salaam* ⚠ (§30 K2), *Khuda-fis, thank you, Shabash, Bas, Bareto, Ukreto, Dhyan rakh, Jara e wandho nai, Mu lai khobar, Aau theek ai, Tu ki aiye? / Aai ki aayo?, Ha, Na, thank you, Hi na, hu, ki baki nai, time pati vyo* (notes §21–§30; checklist § C). Rule G6 and G7 govern which to use.

## 30. "the one with milk", "very", "again"

- **UNKNOWN.** "the big one" with no noun (C36), "the one with milk" (L92), "very" (L91). Useful for Find it and chai cups; P3.

---

## Coverage check: what Round 5 settles

| If Mum records… | The engine gains | The game gains |
|---|---|---|
| Parts 1–4 (~37 min) | features 1, 2, 7, 8, 12, 17, 18 (Nani's commands), 19, 21 (*me*, "from"), 23 ("with", "and", lists, steps) | Cook says every order and every guide line as a full Kutchi sentence |
| + Part 5 (~10 min) | features 3, 5 (partly), 11, 16 (one past form each way), 20, 22, 28 | Arc 1's Cook, Put it there and Hide and seek lines |
| + Part 6 (~25 min) | features 5, 6, 9, 10, 13, 14, 15, 16 in full, 21, 24 | the engine can build sentences for later modes from new words alone |
