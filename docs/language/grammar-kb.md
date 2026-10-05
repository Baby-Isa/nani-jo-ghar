# Grammar knowledge base: what the engine knows, guesses and lacks

Step 2b, 1 Oct 2026. For every grammar feature the language engine needs, this file says what is **KNOWN** (Mum or Zafar said it), what is only a **HYPOTHESIS** (an outside grammar predicts it), what is **UNKNOWN**, which game lines need it, and which question in Round 5 settles it.

**How to read it**

- **KNOWN** cites `grammar-notes.md` as "notes §n" (with the round and clip id where there is one). ⚠ = Whisper's hearing, not yet checked by Zafar (rule G2: such forms ship only as drafts).
- **HYPOTHESIS** cites its source: [GF-Snd] = the Grammatical Framework (GF) resource grammar for Sindhi (`gf-rgl/src/sindhi`, a 2012 student grammar, Sindhi in Arabic script); [Sindhi-gen] = general Sindhi grammar from the 30 Sept research pass (`sources/research-2026-09-30-grammar-checklist.md`), not re-verified; [Keine] = Keine, Nisar and Bhatt 2014, abstract only (the PDF is blocked by the proxy); [Gemini] = the AI blueprints (unverified, often wrong for the family). **A hypothesis is never a Kutchi form.** Under rule G1 (non-negotiable 4) it only shapes the questions and the engine's feature model. Sindhi forms are written as Sindhi, never put into game data.
- **Needed by** cites the game inventory (`sources/research-2026-09-30-game-inventory.md`) as "inv §1A #n" (its frame numbers) or "inv §6" (fragments), and Arc 1 errands (`game-design/story-and-arcs.md` § Arc 1).
- **Settled by** names the Round 5 question IDs (`mum-questions/Questions for Mum (Round 5).md`).
- **Jargon, once:** a *paradigm* is the full set of forms of one word (*hakro / hakri*); *agreement* is one word changing to match another (*khapeto* for a he-word); the *oblique* is the form a noun takes before a postposition (*chokro* → *chokre sathe*); a *postposition* is "in", "with" and so on placed after the noun (*rasore me*); *perfective* means a finished action ("ate", "went").

**Priority** (P1 blocks Cook; P2 blocks Arc 1, the Birthday; P3 later modes) is how the questionnaire was ordered.

---

## Summary table

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
