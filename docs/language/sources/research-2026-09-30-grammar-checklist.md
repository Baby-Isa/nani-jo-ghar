# Kutchi grammar checklist for the sentence engine (research, 30 Sept 2026)

Label key used on every form below:
- **[Mum §n]** = confirmed or heard from Mum, in `docs/language/grammar-notes.md` section n (⚠ = Whisper-heard, Zafar not yet checked).
- **[GF-Snd]** = read in the GF Sindhi resource grammar source (gf-rgl `src/sindhi`). A 2012 student grammar, partial and partly Urdu-flavoured. A template for the *shape* of the engine, not evidence about Kutchi.
- **[Sindhi-gen]** = general knowledge of Sindhi grammar that I could NOT re-verify in a source I could open this session. Treat as a hypothesis.
- **[Keine]** = Keine, Nisar & Bhatt 2014/15, abstract-level only (I could not open the paper).
- **[Gemini]** = the AI blueprint. Unverified; many items contradict Mum. Never used as evidence.
- **[Hyp]** = my inference from Mum's data. Test, do not build on it.

---

## A. Sources

**Read (opened and used)**
- `docs/language/grammar-notes.md` (all of it, §1 to §37). The only evidence about the family's Kutchi.
- `docs/language/sources/README.md`, `gemini-blueprint-v1` and `-v2` (the two Gemini files; v2 skimmed to its lexicon). Unverified.
- GF Sindhi source on GitHub (raw files fetched): [MorphoSnd.gf](https://raw.githubusercontent.com/GrammaticalFramework/gf-rgl/master/src/sindhi/MorphoSnd.gf) (14 noun classes, adjective classes, verb endings), [ResSnd.gf](https://raw.githubusercontent.com/GrammaticalFramework/gf-rgl/master/src/sindhi/ResSnd.gf) (Agr, NPCase incl. `NPErg`, copula tables, tenses, negation, question order), [StructuralSnd.gf](https://raw.githubusercontent.com/GrammaticalFramework/gf-rgl/master/src/sindhi/StructuralSnd.gf) (pronouns, postpositions), [ParadigmsSnd.gf](https://raw.githubusercontent.com/GrammaticalFramework/gf-rgl/master/src/sindhi/ParadigmsSnd.gf), [VerbSnd.gf](https://raw.githubusercontent.com/GrammaticalFramework/gf-rgl/master/src/sindhi/VerbSnd.gf).

**Seen only as search-result snippets (abstract level, no data)**
- Keine, Nisar & Bhatt, [Linguistic Variation 14:2, 243-288](https://benjamins.com/catalog/lv.14.2.02kei) (abstract via search). Author PDF exists at [stefankeine.com](https://stefankeine.com/papers/Complete_and_defective_agreement_in_Kutchi.pdf).
- Related abstract (GLOW 36) ["Structural asymmetries: the view from Kutchi Gujarati and Marwari"](https://glowlinguistics.org/36/pdf/structural_asymmetries_-_the_view_from_kutchi_gujarati_and_marwari.pdf) and a Benjamins chapter on the same two-probe analysis, [la.209.10gro](https://www.jbe-platform.com/content/books/9789027270825-la.209.10gro).
- Snippets from [Wikipedia: Kutchi language](https://en.wikipedia.org/wiki/Kutchi_language), [CAL Heritage Voices: Kutchi](https://www.cal.org/heritage/pdfs/heritage-voice-language-kutchi.pdf), [Sindhi noun-inflection papers](https://www.cle.org.pk/clt09/download/Papers/Paper11.pdf), [Sindhi verb pages](https://learn.sindhila.edu.pk/grammar/parts-of-speech/359-verb), [Lasi Sindhi verbs](https://harf-o-sukhan.com/index.php/Harf-o-sukhan/article/download/449/414).

**Inaccessible (egress proxy blocked, policy 403, not retried)**
The Keine PDF, Benjamins/JBE, lingbuzz, UMass ScholarWorks, Wikipedia full page, CAL PDF, Glottolog, Ethnologue, archive.org (so Grierson LSI VIII.1 Kachchhi), Sindhi learning sites, GLOW PDF. **So I have no example sentences or paradigm tables from Keine et al., and nothing from Grierson.** Everything attributed to them below is the abstract plus what the README already says.

**What the abstract-level sources do say**
1. [Keine] Kutchi has an **aspect split**: non-perfective clauses and intransitive perfectives show *complete* agreement (subject: person, number, gender). **Transitive perfectives show defective agreement** (some of subject's features not cross-referenced). **Person split**: with a **1st-person subject** in a transitive perfective the verb agrees with the **object** instead (also defectively). Two probes: a higher number/person probe in T, a lower gender/number probe in v/Asp (from the future-perfect pattern).
2. Variety warning: the GLOW title says **"Kutchi Gujarati"**. Wikipedia snippet: Kutchi is Sindhic, Sindh and Banni Kutchi are close to Lari Sindhi, eastern Kutch Kutchi is more Gujarati-influenced. Family data are strongly Sindhi-like (muke khape, -o/-a, me, hu/hi, hal, jo/ji/je, *-to/-ti* agreement). **I cannot tell whether Keine's consultants speak the same variety.** Use the paper only for the *architecture* (which features the verb can see), never for endings.
3. Sindhi (general, from snippets): two genders; transitive past verbs agree with the object, not the subject (Lasi/Sindhi); continuous vs habitual marked by an affix.

---

## B. The category checklist (most everyday-sentence value first)

Method note for the questionnaire writer: every item is a **minimal pair or small set**. Ask Mum to "say it naturally, the way you'd say it in the kitchen". Change one thing per sentence. Do not ask "what is the plural of X".

### B1. Noun gender and plural classes
- **Engine must know**: per noun, gender (M/F, plus an "unknown, use M" default, Mum §37.5) and a plural class: (a) M in -o, -o → -a; (b) F in -i, unchanged; (c) F with -yu/-iyu plural; (d) invariant (cup, table, limu, dungri); (e) irregular (mirchi/marcha, unresolved §34 P4).
- **Confirmed [Mum §4, §35, §36]**: ambo/amba, darwajo/darwaja, bateto/bateta, chamcho/chamcha, chokro/chokra, bakro/bakra; maani, dungri, chamchi, lakri, pacheri, bakri unchanged; cup, table, limu, gutan unchanged; **cup, table, paani, dudh = M; chai, maani, kursi = F** (§31, §35). Two genders only so far.
- **⚠ open**: *akh → akhyu*, *chokri → chokriyu*, *chai ji chiju* (F plural in -yu/-u, §35, §37.3); *bakri → bakra* (odd); "mirchi has no plural" vs Zafar's *marcha*; tomato spelling.
- **Sindhi predicts [GF-Snd, Sindhi-gen]**: M -o → -a; F -i → -iyun/-yun; F consonant-final → -un; M consonant-final invariant; kin nouns irregular. [GF-Snd] has 14 classes (mkN01..14). **Gemini's third (neuter) gender is not supported** by anything Mum said.
- **Open question**: Is -yu/-iyu plural obligatory, optional (careful speech), or only for some she-words? What decides gender for loanwords and -u/-a/-consonant words (paani, dudh, chai, samosa, sambusa, potato, spoon, pot, daar, onion, water, tomato)? Are there -a words in either gender (Nana M, Nani F, *mageni*?).
- **Tests** (ask with a number word so the plural is forced, vary only the noun):
  1. "Give me two potatoes." / "Give me two onions." / "Give me two chillies."
  2. "Give me two cups." / "two spoons (tea)." / "two pots."
  3. "Give me two chapatis." / "two samosas." / "two eyes." / "two girls."
  4. "I want one tomato" / "two tomatoes" (once per speaker gender answer, to fix the spelling).
  5. "The chai is hot" / "The daar is hot" (predicate agreement reveals gender of daar, paani, onion, pot, samosa).

### B2. Oblique case (singular and plural) before postpositions
- **Engine must know**: a per-noun oblique sg and oblique pl, and **which postposition triggers it** (Sindhi: all of them; Kutchi here looks lexical).
- **Confirmed / heard [Mum §36, §20, §18]**: *chokro → chokre sathe* (never *chokro sathe*), *darwajo → darwaje je puthiya*, *rasoro → rasore me*, *Simba ke*. **But** *ambo je mathe* and *bakro sathe* showed no change (Mum hesitated over *ambe*). *cup/table/maani/bakri/Nana/Nani* unchanged. Plural: *chokra sathe* (or *chokre sathe*); *amba je mathe*; *chokriyu sathe*.
- **Sindhi predicts [GF-Snd]**: M -o: obl sg -e (written -i/-e), obl pl -an (chokran), voc -a; F -i: obl sg unchanged, obl pl -yun+; consonant M: obl pl -an. So Sindhi would give *chokran sathe*; Mum said *chokra sathe*, which is nearer Gujarati. **Key dialect marker.**
- **Open**: Is obl -e animate-only, or lexical, or tied to *sathe/me/ke* vs *je*? Is there an oblique plural in -an (chokran)? Do F nouns have one (chokriyun)?
- **Tests** (hold the postposition, vary the noun; then hold the noun, vary the postposition):
  1. "The chapati is in the pot." / "...in the cup." / "...in the cupboard." (kabaat) / "...in the kitchen." (rasoro)
  2. "Nani is sitting with the boy." / "...with the boys." / "...with the girl." / "...with the girls."
  3. "The spoon is in the cup." / "...behind the door." / "...on the mango." / "...under the potato."
  4. "Give it to the boy." / "to the girl." / "to Nana." / "to the boys."
  5. "The chai is on the cup/plate/pot." (M and F place nouns, to see whether *je* words change M -o).

### B3. Adjective agreement (-o/-i/-a vs invariant)
- **Engine must know**: adjective classes (agreeing -o/-i/-a/-yu; invariant), and whether adjectives take oblique forms when the noun is oblique.
- **Confirmed [Mum §4, §24, §25]**: *wadho/wadhi, nindho/nindhi* (he confirmed, she "to hear"), *bharelo/bhareli, ardo/ardi, aako/aaki, kari/mori* (F), *lilo* (green). **Invariant**: *kali* (only), *theek*, *tayar*, *jaldi*, probably *mixed*, *fine*. Unknown-gender rule: use M.
- **Sindhi predicts [GF-Snd]**: class 1 (-o: 16 forms: Sg/Pl × M/F × Dir/Obl/Voc/Abl, e.g. -o, -i, -a, -iyun), class 2 (consonant-final, invariant except F pl), class 3 invariant.
- **Open**: M pl *wadha*? F pl *wadhi* or *wadhiyu*? Oblique: "with the big boy" *wadhe chokre sathe*? Predicative: does "the chapatis are ready" agree (*tayar* invariant vs *tayari*)?
- **Tests**:
  1. "a big cup" / "a big chapati" / "two big cups" / "two big chapatis"
  2. "a small spoon (tea)" / "a small spoon (table)" / "small pot" / "small potatoes"
  3. "black chai" / "black daar"? / "a red onion" / "green chilli" (lilo/lili?)
  4. "Nani is sitting with the big boy" / "with the big girl" / "with the big boys".
  5. "The samosa is ready." / "The chapati is ready." / "The chapatis are ready." / "The samosas are ready."

### B4. Numerals and counted nouns; "one"; fractions; ordinals
- **Engine must know**: cardinals 1-10 (then 11-20, tens, 100), gendered "one", counted noun number (plural direct), any numeral obliques, ordinals, half/quarter, "how many".
- **Confirmed [Mum §2, §3, §34, §35]**: *hakro/hakri* (only number that agrees; **cup = hakro**), *ba* (two), *trae*, *char* (three, four as heard in P-series); counted nouns take the direct plural (*ba amba, trae bateta, ba maani, char limu, ba lakri mishkaki*). *pela* = first. *adh* (half amount), *ardo/ardi* (half portion, agrees), *kitla* (how many). Unconfirmed: panj, chha, satt, at, nav, das [Sindhi-gen: *panj, chha, satt, at, nav, dah*; handout has *panj*].
- **Open**: 5-10 and 20; do *ba/trae/char* ever show gender (Gujarati-style trae/tran)? Is *hakro* also "a/an"? Hundreds and "a dozen"; "a pair"; *trae* vs *tri*. Do numerals take oblique before postpositions ("in three cups")? Ordinals (*biyo/tijo*?). Reduplicated "one each".
- **Tests**:
  1. "One cup, two cups, three cups, five cups, ten cups." / "One spoon (tea), two, three, five."
  2. "One potato, two potatoes, five potatoes."  "One chapati ... five chapatis."
  3. "Put it in three cups." / "...in one cup." / "...with two spoons."
  4. "Half a cup of milk." / "Half a chapati." / "One and a half cups." / "A quarter."
  5. "The first cup, the second, the third." / "How many chapatis do you want?"

### B5. Pronouns, case forms, formal "you", "we"
- **Engine must know**: person × number × case (direct, dative/object, oblique stem for postpositions, genitive), proximal/distal 3rd, honorific 2nd, 3rd person plural, inclusive/exclusive "we", reflexive.
- **Confirmed [Mum §21-§23, §37]**: aau (I); tu (you, child/same age); **aai** (you, elder; takes plural verb *aayo/acho*); e (he/she); hi/hu (this/that); muke/toke/anke/panke (to me/you/you-elder/us); inke (it, object); *mu saathe* (with me, oblique stem *mu*); *munje* (my, before place word), *munjo* (mine). *ker* = who; *ki*/*kuro* = what/how.
- **Sindhi predicts [GF-Snd, Sindhi-gen]**: mã/mū̃, tū̃, hū/hī, asā̃ (we exclusive), pā̃ (we inclusive, "self"), tavhā̃ (you pl/polite), hunan/hinan (3pl obl), khe (to), oblique stems *mũ, tũ, hin, hun*. Panke matches inclusive pā̃. [Gemini]'s *asi, aaN, heo* are not heard from Mum.
- **Open**: "we" exclusive vs inclusive (*asi/ami* vs *paan*)? 3pl subject ("they": *e*? *hune*?), 3pl oblique/object ("to them", "with them"); plural "you" (you kids; you elders); does *aai* ever stand for plural? Is *tu* with elders ever used (Nani to child vs child to Nani)? Hindi-style three levels?
- **Tests**:
  1. "I am making chai." / "You (child) are making chai." / "You (Nani) are making chai." / "He/she is making chai." / "We are making chai." / "They are making chai."
  2. "Give it to me / you (child) / you (Nani) / him / her / us / them."
  3. "Nani, are you coming?" / "Kids, are you coming?" / "Nana and Nani, are you coming?"
  4. "We (you and I) will make it together" vs "We (me and my sister, not you) will make it."
  5. "Sit with me / with you / with him / with them."

### B6. Possessives: my/your/Nani's; *jo/ji/ja/jun*
- **Engine must know**: a genitive marker that agrees with the **possessed** thing (gender, number, and oblique), a possessor case (direct vs oblique), and pronoun possessives (own stems).
- **Confirmed [Mum §18, §24, §37]**: *bajr ji maani*, *dudh wagar ji chai*, *nair ji chutney*, *amli ji chutney* (all F heads take *ji*); *khanje jo kabaat* ⚠ (M head *jo*); *munjo* "mine" (Mum's gloss), *munje same* (before a place word). *Table je niche*, *kabaat je andar*: *je* before place words.
- **Sindhi predicts [Sindhi-gen, GF-Snd possess_Prep]**: *jo* (M sg), *ji* (F sg), *ja* (M pl), *jun/jiyun* (F pl), obl *je*; pronouns *munjo/munji/munja, tunjo, asanjo, hunjo*. Mum's *je* = oblique M of the same set. Looks like pure Sindhi.
- **Open**: Pronoun possessives in full (my/your (child)/your (elder)/his-her/our/their) × M/F/pl possessed; possessive of a proper name in the oblique (*Nani ji ...*, *Nana jo ...*, *Nana je ghar me*); is *je* used whenever the possessed is oblique (in *Nani ji chai me*)? Does *ji* attach to -o possessors (*chokre jo*? *chokra jo*?).
- **Tests**:
  1. "my cup / my spoon (tea) / my cups / my chapatis." / "your cup / your chapati." (child, elder) / "his cup / her cup / our cup / their cup"
  2. "Nani's cup / Nani's chai / Nani's cups / Nana's chai / Nana's cup"
  3. "the boy's cup / the girl's chai / the boys' cups"
  4. "This cup is mine / yours / Nani's." "These cups are mine."
  5. "I put it in my cup." / "...in Nani's cup." (oblique possessed)

### B7. Copula, existence, having
- **Engine must know**: present/past "be" by person, number, gender, politeness; "there is/are"; "have" (dative construction); "is not / there isn't".
- **Confirmed [Mum §8, §11, §14, §20-§21, §23, §33]**: *ai* (is, also "I am fine": *aau theek ai*); *tu ki aiye?* (2sg); *aai ki aayo?* (elder); *aau ker aiya?* ⚠ (1sg?); *wo* (was; *kida wo?*, *table je mathe wo*); *nai* (isn't/none: *ki baki nai*, *kenjo nai* ⚠); *vyo/vai/vya* ("went/became" M/F/pl). *Toke khabar ai* (you know), *muke ... khape* (I need).
- **Sindhi predicts [GF-Snd copula]**: present *āhē/āhiyā̃/āhiyō/āhin*; past *hio/hī/hiā/hiyūn* (M/F, sg/pl); negative *koni/kona*, future *hundo*. Family *ai, aiye, aayo, wo* are in this family.
- **Open**: Full present paradigm (I, you-child, you-elder, he/she, we, they; does F differ?); past *wo* F and plural (*wi? wa?*); "is/are not" (*nai*, *nathi*?) and past negative; possession ("I have two cups", "Nani has a samosa") with *muke ... ai* or something else; existential "there is chai".
- **Tests**:
  1. "I am here." / "You (child) are here." / "You (Nani) are here." / "He is here." / "She is here." / "We are here." / "They are here."
  2. "The chai was hot." / "The chapati was hot." / "The chapatis were hot." / "The samosas were there."
  3. "There is chai." / "There is no chai." / "There are no chapatis." / "There is no milk left."
  4. "I have two cups." / "Nani has three chapatis." / "I don't have a spoon."
  5. "The chai is not hot." / "The chai was not hot." / "I am not hungry."

### B8. Present: habitual and progressive
- **Engine must know**: one or two present forms (habitual vs "right now"), each inflected for person/number/gender, and whether an auxiliary follows.
- **Confirmed [Mum §1, §25, §33, §37]**: *muke khape-to/-ti/-nta/-nti* (agrees with the **thing**, suffix built on a 3sg/3pl stem: *khape / khapa(n)* + *-to/-ti/-nta/-nti*); *bareto* (it's burning), *ukreto* (it's boiling) = stem + *-e-to*; *mageni achenta* ⚠ (guests are coming, pl); *Aau chakha* (I'll taste, 1sg subjunctive -a); *ki aiye*.
- **Sindhi predicts [GF-Snd, Sindhi-gen]**: present built from the **subjunctive** (1sg -an, 2sg -ein, 3sg -e, 3pl -an, 2pl/polite -o) plus a participle/aux *tho/thi/tha/thiyun* that agrees with the subject; continuous marked by an extra affix.
- **[Hyp]**: *khape-to* = "subjunctive + -to" i.e. the same form does habitual and "right now".
- **Open**: Is there a separate progressive? Full subject paradigm (I/you-child/you-elder/he/she/we/they × M/F): does 1sg "I eat" need the subject's gender (*khau-to/-ti*)? Is *-nt-* plural for all verbs? How is the habitual "every day" distinguished?
- **Tests** (subject gender changes the answer, so ask a boy/girl version or "Nani/Nana"):
  1. "Nani makes chai every day." / "Nana makes chai every day." / "The girls make chai every day."
  2. "Nani is making chai now." / "The boy is making chai now." / "I (girl) am making chai now." / "I (boy) ..."
  3. "The chai is boiling." / "The daar is boiling." / "The milk is boiling." / "The samosas are frying."
  4. "I (girl) eat chapati." / "I (boy) eat chapati." / "You (child) eat chapati?" / "Do you (Nani) eat daar?"
  5. "We eat samosa on Eid." / "They drink chai."

### B9. Future (incl. speaker gender)
- **Engine must know**: future stem + *-do/-di/-da/-di(y)u* agreeing with the subject, plus 1st/2nd-person endings that may carry their own person suffix.
- **Confirmed [Mum §21, §32, §33, §37]**: *e achdo* (he/she-child will come), *e achda* (elder), *achindo* (Zafar), *khapdo* (will be needed, M default), *kar dis* (girl) / *kar dos* (boy) "I will do", *banai dinda / dinde* (will you make).
- **Sindhi predicts [GF-Snd]**: stem + *-indo/-indi/-inda/-indiyun* (M/F, sg/pl); [Gemini] gave *-ndos/-ndis* for 1sg. **[Hyp]**: *dis/dos* may be *de* ("give") + 1sg future, i.e. "do-and-give" (a benefactive compound, see B12), with the gender ending on the vector. Sindhi also has 1sg pronominal suffixes *-s/-m*.
- **Open**: Is *-do/-di* on the main verb for all subjects or only 3rd person? Forms for I/you/we/they; F 3sg *achdi*, F pl; do *dinda/dinde* mark status of the addressee (Zafar, to confirm with Mum, §37.7)? Why *achdo* vs *achindo* (two forms, free variation or one is habitual)?
- **Tests**:
  1. "I (boy) will make chai." / "I (girl) will make chai." / "I (boy) will make it for you." (*kar dos* pattern)
  2. "Nani will come." / "Nana will come." / "The girl will come." / "The boys will come." / "The girls will come."
  3. "You (child) will make chai?" / "You (Nani) will make chai?" / "Will you (children) make chai?"
  4. "We will make chai." / "They will eat the samosas."
  5. "The chai will be ready." / "The chapatis will be ready."

### B10. Past, intransitive
- **Engine must know**: perfective of intransitive verbs agrees with the **subject** in gender/number (and respect plural). Also vector "went" (*vyo/vai/vya*).
- **Confirmed [Mum §19-§21]**: *e achi vyo* (child came), *e achi vya* (elder came), *kam kari vya?*, *warsaad band thai vyo*, *film khalas thai vai*. **Note the compound**: *-i* participle + *vyo* (went); agreement is with the subject (F *film* → *vai*).
- **Sindhi predicts [Sindhi-gen]**: *wiyo/wī/wiyā/wiyūn* (went), *āyo/āī* (came), *thiyo/thī* (became).
- **Open**: Is there a bare perfective (*aayo/aayi*) distinct from *achi vyo*? "went": *hal(i) vyo* or *gayo*? 1st person: does "I (girl) went" end in -i? Plural F? Does the elder subject take *-a* on the main verb too?
- **Tests**:
  1. "I (boy) went to the kitchen." / "I (girl) went to the kitchen."
  2. "The boy came." / "The girl came." / "The boys came." / "The girls came." / "Nani came." / "Nana came."
  3. "The chai boiled over." / "The milk boiled over." / "The chapatis burnt." / "The samosa burnt."
  4. "We (boys) sat." / "We (girls) sat." / "You (child) sat." / "You (Nani) sat."

### B11. Past, transitive: the agreement split and ergative marking
- **Engine must know**: what the verb agrees with (object? subject? nothing), whether the **subject is marked** (oblique pronoun, *ne*-like postposition), and whether person (1st vs 3rd) changes it. **The single most structural rule in the engine.**
- **[Keine]**: transitive perfective: defective agreement; with 1st-person subject the verb agrees (defectively) with the **object**. **Sindhi [Sindhi-gen, GF-Snd NPErg]**: subject in oblique case (*mu, to, hin, hun*), verb agrees with object M/F, sg/pl (*mū̃ rotī khādhī*, *mū̃ ambo khādho*); GF adds a *-ji* marker on 3rd-person ergative subjects (suspect, looks Urdu-derived).
- **Confirmed [Mum §20]**: *ker mitai khai vyo?* ("who ate the sweets?") and *Simba khai vyo* / *Simba khani vyo*. **Caution: these are vector compounds with "went"**, so subject-agreement (Simba M; *mitai* is F pl but verb is M sg *vyo*) proves nothing about bare transitive past. *Simba ke rasore me nares* (I saw Simba) has a verb ending in *-es*: possibly a 1sg clitic ⚠.
- **Open**: Plain past of "eat/make/drink/see/take": what does it agree with, and does the form differ between 1st and 3rd person? Is the subject marked (*mu*, *Nani ne*)? Are object-agreement forms F -i / M -o / pl -a? What if the object is animate/marked with *ke* (no agreement, default M sg)?
- **Tests** (all in one block, verb fixed = "ate"/"made"; vary subject person/gender, object gender/number):
  1. "I (boy) ate the samosa." / "I (boy) ate the chapati." / "I (girl) ate the samosa." / "I (girl) ate the chapati."
  2. "I (boy) ate two samosas." / "I (boy) ate two chapatis."
  3. "Nani ate the samosa." / "Nani ate the chapati." / "Nana ate the chapati." / "The girl ate the samosa." / "The boy ate two chapatis."
  4. "We ate the samosa." / "We ate the chapati." / "You (child) ate the chapati." / "You (Nani) ate the chapati." / "They ate the samosas."
  5. "I made the chai." / "I made the daar." / "Nani made the chai." / "Nani made the daar."
  6. "I saw Nani." / "I saw the boy." / "I saw the girl." / "I saw the pot." (animate vs inanimate object)
  7. "Who ate the chapati?" / "Who ate the samosas?" / "Nana did." (does the answer use the same frame)

### B12. Compound verbs, participles, infinitives, causatives, benefactives
- **Engine must know**: conjunctive participle (-i, -ai), vector verbs (*dey/vyo/wij/kadh/rakh/chadi de/ban*), infinitive (*randhnu, randhan*), purposive/permissive *lai*, causative (*banai*).
- **Confirmed [Mum §8, §9, §19-§20, §27, §33, §37]**: *banai* (make; *ma lai pan hakro banai*), *banai dinda* (will you make for me), *kari* (done: *kam kari vya*), *khai vyo, khani vyo, achi vyo, thai vyo* (completive/inchoative with *vyo*), *chadi de* (leave it), *kadh* (take out), *wij* (put in), *hal winja* (let's go), *muke chakhan lai de* ("let me taste": inf-obl *-an* + *lai de*), *randhnu khapdo* (need to cook), *randhan lai madad kar de* (help for cooking), *khanechi dinde* ⚠ (bring = take+come).
- **Sindhi predicts [Sindhi-gen]**: conjunctive -i; infinitive -anu (obl -an); causatives in -aa-/-aay-; *pai/pio* progressive vector.
- **Open**: Which vectors does Kutchi really use (*de* for benefactive, *vyo* complete, *pai/ubho* for progressive, *chadi* for "leave", *kadh*)? Do vectors need the conjunctive form (khai, kari, rakhi)? Is "finish eating" *khai khalas kar*, *khai pati vyo*? Which infinitive ending is used before *lai* ("in order to")?
- **Tests**:
  1. "Put the onion in." / "Put the potatoes in." (you add) / "Take the samosas out." / "Take the chapati off."
  2. "Eat it all up." / "Drink all the chai." / "I finished the chai." / "The chai is finished."
  3. "I'll make it for you." / "Make it for me." / "Can you make it for Nani?"
  4. "I came to eat." / "I came to make chai." / "Give me (something) to taste." / "Let me make it."
  5. "I want to eat." / "Nani wants to make chai." / "Nani started to make the chai."

### B13. Imperatives (familiar, polite, plural, negative)
- **Engine must know**: bare stem for child/peer, **-o** for elder/plural, negative by post-verbal *na* (normal) vs pre-verbal *na* (urgent), plus *khobar/jaldi* adverbs, and suppletive/irregular imperatives.
- **Confirmed [Mum §9, §12, §21, §27]**: familiar *kha, kar, de, wij, rakh, kadh, hal, bol, bhaj, ad, khan, ach*; polite/elder *acho, karo* ("jaldi karo"); negative *khun na wij, ad na, hal na, bhaj na, bol na, watu na kar*; urgent *na ad!, na hal*; "let's": *hal winja*; "leave it": *chadi de*; "wait": *khobar*.
- **Sindhi predicts [Sindhi-gen, GF-Snd]**: familiar = root; polite/plural = root+*-o* (GF: `VPImp = Subj Pers3_Near Pl Masc`); honorific in *-ijē*; negative *na/m(a)* (the Sindhi prohibitive *ma* is [Gemini] too).
- **Open**: Is **-o** correct for plural (kids) as for elders? Polite with *-ijo/-ajo*? Negative imperative for polite/plural (*karo na*, *na karo*, *ma karo*)? Do intransitive/transitive differ? Irregular imperative forms (*de, le, pi, ja/hal*).
- **Tests**:
  1. "Eat! (child)" / "Eat, Nani! (please eat)" / "Eat, kids!"
  2. "Come here. (child / Nani)" / "Sit here. (child / Nani)" / "Put it here. (child / Nani)"
  3. "Don't eat it." / "Don't put in sugar." / "Don't put in sugar, Nani." / "Don't touch!" / "Don't run." (child vs Nani vs kids)
  4. "Give me the spoon." / "Please give me the spoon, Nani." / "Drink the milk." / "Drink your chai, Nani."
  5. "Stir (it)." / "Wait a bit." / "Hurry up." (child / Nani)

### B14. "Want / need / like / can / must"
- **Engine must know**: dative-subject constructions (*muke X khape*), infinitive complements, modal strategy for "can" and "like" ("no word for can", Mum §27).
- **Confirmed [Mum §1, §11, §27, §31, §33, §37]**: *muke X khape(to/ti)* (want/need; thing-agreeing), *X nati/nato khape* (don't want), *panke randhnu khapdo* (we must cook = inf + *khapdo*), "can you?" = rising question (*Tu muke chai banai dinda?*), *toke khabar ai* (know).
- **Sindhi predicts [Sindhi-gen]**: *khape* (be needed), *saghan* ("can": *sagh-*), *pasand* ("like"); *pawe* ("must, have to").
- **Open**: "like" (*muke chai pasand ai* / *muke chai bhale*?), "can" in ability ("I can swim" / "Can you lift it?"), "must/should" vs "need to", "want to + verb" ("I want to eat" *muke khanu khape*? *aau khaan chaha*?), "I don't like", "let me".
- **Tests**:
  1. "I want chai." / "I want two chapatis." / "I don't want milk." (M, F, plural) (already done; confirm only *nato/nati* with plurals)
  2. "I want to eat." / "I want to make chai." / "Nani wants to sit."
  3. "I like chai." / "I like samosas." / "I don't like onion." / "Nani likes daar."
  4. "I can lift the pot." / "I can't lift the pot." / "Can you (child) stir it?" / "Can Nani hear?"
  5. "I must go." / "You must drink milk." / "We should wash the cups."

### B15. Negation
- **Engine must know**: position and form of negatives: *na* (imperative, refusal), *nati/nato* (negative that agrees), *nai* (not/none), *ki na* (nothing), *wagar ji* (without), and a rude bare *na*.
- **Confirmed [Mum §11-§14, §24]**: *Na, muke na khape*; *muke khun nati khape*; *khun na* (very informal); *ki na* (nothing), *ki baki nai* (none left), *wagar ji*; *hi na, hu* / *laal na* (not X but Y); *na* after imperative verb.
- **Sindhi predicts [GF-Snd, Sindhi-gen]**: *na* before verb, *koni/kona* for copula negation, *ma* for prohibition.
- **Open**: negative of each tense (*khapanta*→*nanta*?), negative past (*na khadho*), negative copula with plural/F (*nai* for all?), "nobody/nowhere" (*koi na*, *kite na*), "no more".
- **Tests**:
  1. "I didn't eat the samosa." / "I didn't eat the chapati." / "I don't eat onion." / "I won't eat it."
  2. "There is no chai." / "The chai isn't hot." / "The chapatis aren't ready." / "The cup is not here."
  3. "Nobody ate it." / "Nothing is left." / "I didn't see anybody." / "It isn't anywhere."
  4. "Not one, two." / "Not chai, milk."

### B16. Questions
- **Engine must know**: who, what, where, which, how many/much, how, why, when, whose, yes/no (intonation or particle), tag questions.
- **Confirmed [Mum §20, §23, §37]**: *ker* (who), *kuro* (what), *kida* (where), *kyo* ⚠ (which), *kitla* (how many), *ki* (how), *toke kuro khapeto?*; yes/no by rising voice (no particle); *ke kuru* (what, §14). Sindhi predicts [Sindhi-gen] *chā* as a yes/no particle (Mum said none).
- **Open**: why, when, whose, how much/how many (agreeing *kitla/kitli*?), "which one" agreement (*kyo/kyi/kya*), "who" as object ("who did you see?"), plural "who", negative questions ("Don't you want?"), tag "isn't it?".
- **Tests**:
  1. "Who made this chai?" / "Who is this? (Nani / a girl)" / "Who did you see?" / "Whose cup is this?"
  2. "Which cup? / Which chapati? / Which potatoes? / Which spoon?"
  3. "How many chapatis? / How many cups? / How much sugar? / How much milk?"
  4. "Why is the chai cold?" / "When will it be ready?" / "Where is Nani? / Where are the cups?"
  5. "Is the chai ready?" / "Do you want sugar?" / "Haven't you eaten?"

### B17. Conjunctions: and / with / without / but / because / then
- **Confirmed [Mum §6, §7, §10, §24]**: *ne* (and, list and "X ne Y"); *pela ... ne poi ...* (first ... and then); *waari* (mixed in: *dudh waari chai*); *saathe/sathe* (together/with person); *wagar ji* (without); *ke* (or); *pan* (also); *lai* (for). **Missing**: but, because, if, when, so, until, while, before/after, "or" for questions.
- **Sindhi predicts [Sindhi-gen]**: *par* (but), *chokē/kharē* (because), *jekaro/jaden/te* (if/when/that), *ain* (and, archaic), *ya* (or).
- **Tests**:
  1. "Chai and milk." / "Daar and chapati." / "Nani and Nana came."
  2. "I want chai, but no sugar." / "I want a samosa but I'm full."
  3. "I'm not eating because it's hot." / "Come in, because Nani is waiting."
  4. "If there is no milk, black chai." / "When the chai is ready, call me."
  5. "Wash it, then put it in." / "First the onion, then the potato." / "After the chai, the samosa."

### B18. Postpositions (locative and others): in/on/under/from/to/for/near
- **Confirmed [Mum §15, §16, §20, §36]**: *me* (in; also "to" as in *rasore me winja*, and "into"), *mathe, niche, andar, puthiya, bajume, agiya, same, wich me* (all after the genitive *je*), *lai* (for), *sathe* (with), *waari* (mixed with), *wagar ji* (without), *ke* (to/object), *hida/huda/kida*.
- **Sindhi predicts [GF-Snd]**: in *me*, on *mathe(n)*, under *heṭh(ān)*, with *sāṇ*, for *lai*, from *wiṭhān/khān*, to *ḍāṇhan/khe*, behind *puṭhī*, between *jī wich me*, in front *jī sāmhūn*.
- **Open**: **from** (*kha*? *maan*? *wati*?), **to** (*hal rasore me* vs *rasore tain*), **near** (*nere/nazik/pase*), **at/with someone** ("at Nani's house"), **by/with instrument** ("stir with a spoon"), **through, around, until, since, than**, and whether *je* is obligatory with nouns (short form *cup table mathe ai* drops it, §15).
- **Tests**:
  1. "Take the cup from the table." / "Take the chapati from the pot." / "Take it from Nani."
  2. "Go to the kitchen." / "Go to Nani." / "Give it to the boy."
  3. "The spoon is near the pot." / "The cup is near Nani." / "Come near me."
  4. "Stir it with the spoon." / "Eat with your hand." / "Cut it with a knife."
  5. "I'm at Nani's house." / "I'm going to Nani's house." / "I came from Nani's house."
  6. "It is bigger than that." / "It's better than the other."

### B19. Differential object marking (*ke*) and dative/object forms
- **Engine must know**: when the object takes *ke* (animate? pronoun? definite?), its form for pronouns (*muke, toke, anke, inke*), and verb agreement when marked.
- **Confirmed [Mum §20, §37.1, §23, §9]**: *Simba ke nares* (I saw Simba); *inke ... kadh* (take *it* out; inanimate pronoun object takes *ke*); but *hi ambo khan*, *chamchi de*, *muke chai de*: bare inanimate nouns take nothing; *Nani lai, Ma lai* ("for"). **[Gemini]** claims "animate -ke, inanimate Ø".
- **Sindhi predicts [Sindhi-gen]**: *khe* marks dative and animate/definite objects and pronouns.
- **Open**: "call Nani", "hit the boy", "see the pot". Is an inanimate *definite* noun ever marked? Does a marked object kill verb agreement in the past?
- **Tests**:
  1. "Call Nani." / "Call the boy." / "Call the girl." / "Call the boys."
  2. "I saw Nani." / "I saw the pot." / "I saw the samosa."
  3. "Wash the cup." / "Wash the spoon." / "Wash it." / "Wash him/her."
  4. "Give the chai to Nani." / "Give Nani the chai." / "Give it to her."
  5. "Feed the goat." / "Milk the goat." (animate, non-human)

### B20. Relative clauses and "the one that..."
- **Engine must know**: how "the chai that Nani made" is built (participle clause? *je ... so* correlative? *ki* complementiser?), and how "the one" is handled (Mum: no word for "one", *hi na, hu*).
- **Confirmed [Mum §13, §20]**: *ki na ki* ("something or other"); no relative data at all. **Sindhi predicts [Sindhi-gen]**: correlative *jeko ... so/hū*, participial pre-nominal clauses.
- **Open**: everything. "Who did it" works as a full question; relative "the boy who came", "the cup that is on the table", "what I want".
- **Tests**:
  1. "The chai that Nani made is hot." / "The chapati that I made is big."
  2. "The boy who came is Ali." / "The girl who is sitting is Zainab."
  3. "Give me the cup that is on the table." / "Give me what you have."
  4. "Whoever wants chai, come here." / "Take whichever you want."

### B21. Vocative, adverbs, degree, quantifiers, time words
- **Confirmed [Mum §20, §24, §25, §36, §37]**: *e chokro! e chokri! Nana! Nani!* (*e* before the word); *aste/jaldi/hane/hever/pela/poi*; *wadhare* (more), *thorok/thori war*, *bas*, *kali* (only), *adh* (half), *saware* (tomorrow ⚠), *gaykal* (yesterday), *jara* ("at all").
- **Open**: comparatives ("bigger"), superlatives, "too much", "very" (*bo*? ⚠ S2), "all", "every", "some", "many", "few", "again", "also", "today", "tonight", "always", "never", "already", "still".
- **Tests**:
  1. "Very hot." / "A little hot." / "Too hot." / "Not hot."
  2. "More sugar." / "More chai." / "Less milk." / "Again." / "Once more."
  3. "Eat all of it." / "Give me some." / "Every day." / "Today / tomorrow / yesterday / now."

---

## C. Irregulars and fixed phrases to expect

**Verb irregularities (each needs its full paradigm recorded, not only the forms Mum happened to use).** Sindhi-gen pasts (from memory, to test): *de* give → *dino/dini*; *kar* do → *kayo/kai*; *kha* eat → *khadho/khadhi*; *pi* drink → *pitho/pithi*; *thi* become → *thiyo/thi*; *wa/hal* go → *wiyo/wi*; *ach* come → *ayo/ai*; *le* take → *lidho*; *nar/dekh* see → *dith-*. Family forms so far **[Mum]**: *khai vyo, khani vyo, achi vyo, thai vyo/vai, kari vya, banai* (conjunctive -i/-ai); *de, kar, kha, hal, ach, rakh, kadh, wij, we, bhaj, bol, ad, nar, wapur, chakh, bhar, ban, chad, khan*.
Check: *ach* (come), *hal* (come/go/walk), *we* (sit), *de* (give), *khan* (take), *nar* (look), *ja* (go?), *aau/ai/wo* (be), *thi/thai* (become), *le* (take, irregular?), *pi* (drink), *su/sui* (sleep), *ubho ther* (stand), *ruv* (cry).

**Noun irregulars**: *mirchi/marcha* (or *mirchi* invariant, unresolved), *akh/akhyu*, *chokri/chokriyu*, *chiz/chiju*, *bha/bhai*, *beta/beti*, kin nouns (Nana, Nani, Wadima, Maji, Dadima, *aai*), loanwords (*cup, table, samosa/sambusa, sev, boga, mageni, jikoni*).

**Fixed phrases (record whole; engine does not build them)**: *mori chai, kari chai, dudh waari chai, dudh wagar ji chai, na ad!, hal na, bhaj na hal, ki na, ki baki nai, wich me, je mathe/niche/andar, pela ... ne poi, hane kadh/hever kadh, chadi de, thori war rakh, time pati vyo, warsaad band thai vyo, film khalas thai vai, ker mitai khai vyo?, Aau theek ai, tu ki aiye/aai ki aayo?, Jara e wandho nai, Mu lai khobar, Dhyan rakh, Shabash, bas, aako cup, bharelo cup, salaam/khuda hafiz, thank you*.

**Regionalisms to double-check (Gujarati vs family Kutchi; Masi tie-breaks)**: *kale* (tomorrow/yesterday), *rei/baki*, *dikra*, *marcha*, *keema vs chundo*, *wadhare*, *watana vs matar*, *sathe/saathe* spelling.

---

## D. Summary for the questionnaire writer: the 10 highest-value questions

1. **Past transitive agreement (B11)**: "I (boy/girl) ate the samosa / the chapati / two chapatis; Nani/we/you ate the chapati." Gives agreement target, person split, subject marking in one block. Use **bare** past, not the *khai vyo* compound.
2. **Noun classes and gender of the game's 30 nouns (B1)**: two of each, forced by a number word; add a predicate ("... is hot") to reveal gender.
3. **Oblique before *sathe/me/je/ke*, animate vs inanimate, M -o nouns (B2)**: settles the *chokre* vs *ambo* vs *bakro* puzzle.
4. **Present paradigm for all persons × gender (B8)**: "I/you/he/she/we/they eat/are making" plus one "right now" contrast.
5. **Future paradigm incl. 1sg boy/girl (*dos/dis*), 2sg vs 2pl, F and plural (B9)**.
6. **Copula be, present and past, and negation (*nai/nati*) for all persons/genders (B7, B15)**.
7. **Possessives in full (my/your/his/our/Nani's) × possessed M/F/pl (B6)**: settles the *jo/ji/ja/jun/je* set.
8. **Adjective agreement: M/F/plural, oblique, predicative (B3)**: *wadho/wadhi/wadha?/wadhiyu?*, plus which adjectives are invariant.
9. **Imperatives: familiar/polite/plural/negative for 10 verbs (B13)**: confirm *-o* is both polite and plural.
10. **Postposition inventory missing pieces: from, to, near, with (instrument), at, than, because, but, if, when (B17, B18)**.

Also needed, but lower priority: numerals 5-10 and 20 (B4), "we" inclusive vs exclusive and plural "they/you" forms (B5), "like/can/must" (B14), relative clauses (B20), compound-verb vectors (B12).

**Design caveat for the engine (from the above):** keep gender, plural class, oblique class, adjective class, and verb paradigm as **data per entry**, not code. Mum's confirmed rules are lexical tendencies (*chokre* but *ambo*, *akhyu* but *maani*), so the engine must allow per-word exceptions. Use [GF-Snd]'s table-per-category shape (Noun: Number × Case; Adjective: Number × Gender × Case; Verb: Tense × Person × Number × Gender; Agr = Gender × Number × Person) as the template, but fill every cell only from Mum.
