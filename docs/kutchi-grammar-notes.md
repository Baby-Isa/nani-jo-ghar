# Kutchi grammar notes (from the family's recordings)

Each finding lists its source recording and how sure we are. The family is the authority; "heard" means transcribed by Whisper and read by Claude, so the spelling is rough until Zafar checks it.

## 25 Sept 2026: Mum and Zafar, Questions A3.1 and A3.2 (8 min, file `A2_q1_and_2.m4a`)

### 1. "I need …" has a formal form that agrees with the thing needed, and an informal form that doesn't

| | one | two (more than one) |
|---|---|---|
| **she-word** (maani, kursi, chai) | *muke hakri maani khape**ti*** | *muke bha kursi khapa**nti*** |
| **he-word** (ambo, mango) | *muke hakro ambo khape**to*** | *muke bha amba khapa**nta*** |
| **informal, any word** | *muke hakri maani khape* | *muke bha amba khape* |

- The ending on *khape* shows gender and number: *khapeti* (she, one), ***khapanti*** (she, more than one), *khapeto* (he, one), ***khapanta*** (he, more than one). Zafar confirmed the spellings *khapanti* / *khapanta* and the "n" in the plurals.
- Informally, people drop the ending: plain ***khape*** for everything. Mum's own everyday answers to the informal round were all plain *khape*. **So the game's current frame *Muke {x} khape* is right as the informal version** and never changes.
- Mum first said *muke bha maani khape ti* for "two maani", then said *bha maani khapanti* is the formal plural too. *khapanti* is the formal feminine plural.
- It's the same whether a child asks an adult or an adult asks a child (A3.1).

### 2. "One" agrees with gender: *hakro* / *hakri*
- *hakro ambo* (one mango, he-word), *hakri maani*, *hakri kursi* (she-words).
- **The game currently uses *hikdo* for "one"** (from the class handout). The family says *hakro/hakri*, changing with gender. **Game change needed**: store "one" with both forms, and pick by the noun's gender.

### 3. "Two" is said like the "Ber" of *Bernstein*; only "one" changes with gender
- Zafar confirmed: "one" changes with gender (*hakro/hakri*); no other number does.
- "Two" sounds like the start of *Bernstein* ("ber"). **The game currently uses *bo*: change it.** Proposed screen spelling *ba*, voice spelling *ber* (to confirm with the recording).

### 4. Plurals: he-words ending in -o change to -a; she-words ending in -i don't change
- *ambo → amba* (mango → mangoes).
- *maani*, *kursi* stay the same in the plural ("like sheep").
- Zafar confirmed this is the general rule. Describing words follow it too: *vadho* / *nindho* are the he-word forms (confirmed), so she-words take *vadhi* / *nindhi* (to hear in Section C).

### 5. Genders so far
- She-words: *maani*, *kursi* (chair), *chai*.
- He-words: *ambo* (mango).

### What this means for the game
1. Keep *Muke {x} khape* (informal, invariant) as the order frame for now. The formal agreeing endings are a later grammar point (stage S3), learned by hearing, not required to win.
2. Every noun needs a **gender** and a **plural form** in the data (already planned in the Technical Plan).
3. Numbers: "one" needs gendered forms (*hakro/hakri*); "two" is *ba* (said "ber"), not *bo*.
4. *vadho/nindho* are the he-word forms (confirmed); the Maani line's "big/small maani" (a she-word) should use the she-word forms (*vadhi/nindhi*, to confirm).

Mum has consented to her voice recordings being stored in the GitHub repo (Zafar, 25 Sept; the repo will be made private later).

## 25 Sept 2026: Mum and Zafar, Questions A3.3–A3.6 (8 min, `sources/audio/mum-2026-09-25/A3_q3-6.m4a`)

Recordings and rough transcripts are in `sources/audio/mum-2026-09-25/` (made with `build/transcribe_family.py`).

### 6. "and" in a list is *ne*; "with" (mixed in) is *{x} waari*
- A list: *ne chai, ne dudh, ne chamchi…* (and…, and…).
- Things mixed into something take ***waari***: *dudh waari chai* (chai with milk), *khun waari chai* (with sugar), *kesar waari chai* (with saffron).
- Two sugars is not *ba khun waari chai*; Mum corrected herself: ***Muke chai me ba khun khapeti*** ("in my tea I want two sugars"). *me* = in.
- **Sugar stays *khun***, as in the game (Zafar: a breathy k, then the "un" of *under*). **Take** is *khan* (below).

### 7. It's *daar*, not *daal*; "first … and then …" is *pela … ne poi …*
- ***daar*** ends in r. **The game says *daal*: change it.**
- ***pela*** = first. *ne poi* = and then (confirmed). On its own, "daar and then maani" is abrupt; the natural order is ***Muke pela daar khape, ne poi maani*** (I want daar first, and then maani).
- A waiter's question: *Daar ne maani saathe khapeti?* (daar and maani together?); *saathe* = together. Answer: *Haa, muke daar ne maani khapeti.*

### 8. "for" is *lai*; "also" is *pan*; "make" is *banai*
- ***Hi Nana lai ai*** (this is for Nana): *hi* = this, *lai* = for, *ai* = is.
- ***Ma lai pan hakro banai*** (make one for Ma too): *pan* = also, *hakro* = one, *banai* = make.
- *lai* / *ai*: spelling confirmed by Zafar.

### 9. "give me" is *muke … de*; "pass me" is the same; "put in / add" is *wij*; "take" is *khan* / *khanigin*
- ***Muke chamchi de*** (give me a teaspoon); ***muke hi chamchi de*** (give me this teaspoon). "Pass" is the same as "give".
- **Kutchi has no word for "the"** (Zafar): a bare noun is "a" or "the" by context; *hi* (this) points at one.
- ***chamchi*** = teaspoon (she-word?), ***chamcho*** = tablespoon (he-word?): the -i/-o pattern again.
- Add the onion: ***dungri wij***, or ***dungri pan wij*** (add onion too); *wij* = put in (spelling confirmed).
- Take: ***hi ambo khan*** (take this mango, when handing it over); ***khanigin*** = take it yourself, pick one yourself (*ambo khanigin*, "take a mango"). *khan* doesn't change with gender.
- *ke* = or (*hi ambo khan, ke hi maani khan*).

### What this means for the game (adds to the list above)
5. The Chai tray's extras should use *waari* for mixed-in things (*dudh waari chai*), and the sugar count as *Muke chai me {n} khun khape(ti)*.
6. Rename *daal* → *daar* everywhere. *khun* (sugar) stays.
7. The "for {person}" frame for the Chai tray: *{person} lai*.
8. "Pass me" in the game: *Muke {x} de*. The tadka/steps order: *pela {x}, ne poi {y}*.

## Spelling rules from Zafar (25 Sept)
- **No V in Kutchi: always W.** So the drafts *vadho* → ***wadho***, and any *v* spelling (e.g. *vatana*, peas) → *w*. (Zafar's own voice spelling for big was already *wudd-oar*.)
- **No "the".** Don't write English-style articles into Kutchi frames.
- Long vowels are doubled where the family hears them long: *waari*, *daar*, *maani*.

## 26 Sept 2026: Mum and Zafar, Question A4 (No, not, without, don't; 8½ min, `sources/audio/mum-2026-09-26/A4.m4a`)

Rough transcript: `sources/audio/mum-2026-09-26/A4.md`. Spellings follow Zafar's rules (w, not v; doubled long vowels) and are still guesses until he checks them. Whisper wrote sugar as "khan" again; the game keeps ***khun*** (Zafar's spelling).

### 10. "without" is *wagar ji*: it's how you leave something out
- ***dudh wagar ji chai***: chai without milk (*dudh* milk, *wagar* without, *ji* linking the two, like "of").
- ***khun wagar ji chai***: chai without sugar.
- ***dungri wagar ji daar***: daar without onion. There's no shorter way to say it.
- **Chai has its own words.** ***kari chai*** is black tea (no milk). ***mori chai*** is unsweetened tea (no sugar). *kari* and *mori* are the she-word forms (chai is a she-word), so the he-word forms are probably *karo* and *moro*.

### 11. "don't want" is *na khape*; a bare *na* is rude
- "Do you want chai?" The polite no is ***na, na khape*** (no, I don't want it). A bare ***na*** is rude.
- "No sugar" when offered it: ***muke khun nati khape*** (I don't want sugar; spelling confirmed by Zafar). Informally ***khun nati khape***; very informally just ***khun na***.
- *nati* looks like the negative form that agrees, like *khapeti*: probably *nato* for he-words. To hear in Section C.

### 12. "don't" is *na* next to the verb. Before the verb it's urgent or changes the meaning
- In the kitchen: ***khun na wij*** (don't put sugar in); ***khun na wapur*** (don't use sugar; *wapur* = use).
- **Don't touch:** ***ad na*** is the everyday "don't touch that". ***na ad*** is urgent (it's hot, you'll burn!). So *na* after the verb is a normal "don't", and *na* first is a sharp warning.
- **Walk and come** are the same verb, ***hal***: *hal na* (don't walk); *na hal* (don't come with me, a different meaning); ***hal mu saathe*** (come along with me).
- ***bhaj na, hal***: don't run, walk (*bhaj* = run).
- ***bol na***: don't speak. ***watu na kar***: don't chat (*watu* = talk, chatting; *kar* = do). Zafar's own *na watu korishad* isn't a real phrase.

### 13. "not this one, that one" is *hi na, hu*; "this" is *hi* and "that" is *hu*
- ***hi*** = this, ***hu*** = that (that one). There's no separate word for "one": ***hi na, hu***.
- Not the red one: ***laal na***.

### 14. "nothing" is *ki na*; "none left" is *ki baki nai*
- ***ki na*** = nothing. *ki* on its own is "what" or "something" (*ke kuru* = what; *ki na ki* = something or other).
- None left: ***ki baki nai*** (confirmed). Also ***ki rei nai vyo*** (Zafar's spelling), which has the feeling of "left over" (at the end of a party: any cake left?). Mum thinks *rei* may be Gujarati and *baki* more Kutchi. **Ask Masi.**

### Claude's check against Sindhi and Gujarati (Mum's request at 8:04)
These match the neighbouring languages. That supports the spellings, but proves nothing about Kutchi on its own, so it's worth confirming with Masi.
- *wagar* = Gujarati *vagar* (without, from Persian *baghair*, Urdu *baghair*). *ji* matches the Sindhi/Kutchi "of" ending (*jo/ji*), where Gujarati says *vagar **ni** chai*. So *dudh wagar ji chai* is the Kutchi shape of Gujarati *dudh vagar ni chai*.
- *kari* = black (Sindhi *kāro/kārī*, Gujarati *kāḷu*). *mori* = Gujarati *moḷu* (bland, unsalted, unsweetened).
- *wapur* = Gujarati *vāparvũ* (to use). *ad* = Gujarati *aḍvũ* (to touch). *watu* = Gujarati *vāt/vāto* (talk).
- *hi / hu* (this / that) are exactly Sindhi *hī / hū*. *hal* is Sindhi *hal* (go, walk; also Kathiawadi Gujarati *hālo*, "let's go"). *bhaj* is Sindhi *bhaj* (run; Gujarati *bhāgvũ*).
- *ki na* matches Gujarati *kaī nahi* (nothing) and Sindhi *kujh na*.
- ***baki*** (remaining) is in Gujarati, Sindhi and Urdu alike, so it doesn't settle the dialect question.
- ***rei*** fits Gujarati *rahyũ* (remained, from *rahevũ*). But Sindhi has *rahyo* too, so *ki rei nai vyo* could be Kutchi as well: both are plausible. Masi is the right tie-break.

### What this means for the game (adds to the list above)
The game ideas below (9–13) are approved by Zafar and parked in `docs/GAME-IDEAS-TBC.md` until they're built.

9. **Leaving something out of an order:** *{x} wagar ji {dish}* (*dudh wagar ji chai*, *dungri wagar ji daar*). This is a natural harder Cook level: the card says what to leave out. The Chai tray can also use *kari chai* and *mori chai* as words in their own right.
10. **"Don't" rows** (*khun na wij*, *dungri na wij*) can be a level-3 trap. The row ticks when the step closes without that ingredient (UX §11), and adding it shows in the end review.
11. **Choosing:** *hi na, hu* and *{colour} na* fit Find it's counter and the clinic's "is it this or that".
12. **Warnings:** *na ad!* (hot!) and *bhaj na, hal* suit Monsoon rush and Nani's interjections, alongside "Arre re!".
13. **Polite refusals:** use *na khape*, not a bare *na*, whenever a character turns something down.

## 26 Sept 2026: Mum and Zafar, Question A5 (Where things are; 7½ min, `sources/audio/mum-2026-09-26/A5.m4a`)

Rough transcript: `sources/audio/mum-2026-09-26/A5.md`. *ai* (is) is written as already confirmed; Whisper heard "aayi". Spellings are guesses until Zafar checks them.

### 15. "Where" is: thing, place-thing, *je*, a place word, *ai*
- ***cup table je mathe ai***: the cup is on the table. The everyday, shorter version drops *je*: ***cup table mathe ai***.
- ***cup table je niche ai***: under the table.
- ***cup kabaat je andar ai***: in the cupboard (*kabaat* = cupboard).
- ***chawi darwaje je putiya ai***: the key is behind the door (*chawi* = key).
- ***sani je bajume***: next to the plate (*sani* = plate).
- ***Nana je aagiya***: in front of Nana; ***cup je aagiya***: in front of the cup.
- ***chamchi ba cup je wich me ai***: the teaspoon is between the two cups.
- ***shelf je mathe ai***: on top of the shelf.
- Mum's explanation: *je* means "belonging to". The place belongs to the object, so *kabaat je andar* is "the cupboard's inside", and *table je niche* is "the table's underside".

| English | Kutchi |
|---|---|
| on, on top of, above (all the same word) | ***mathe*** |
| under, underneath | ***niche*** |
| in, inside | ***andar*** |
| behind | ***putiya*** (Zafar to check) |
| next to, beside | ***bajume*** |
| in front of (anywhere in front) | ***aagiya*** |
| opposite, facing you | ***same*** |
| between, in the middle | ***wich me*** |

### 16. *same* is "facing me"; *aagiya* is just "in front"
- ***munje same rak***: put it in front of me, facing me, so I can see it (*rak* = put, place; *munje* = my, of me).
- ***munje same we***: sit opposite me (*we* = sit).
- ***munje aagiya jagai ida we***: sit here, in the space in front of me (*jagai* = space or place; *ida* = here or there, Zafar to check).
- Putting something down is ***rak***: ***sani je aagiya rak*** (put it in front of the plate). Compare *wij* (put **in**, add, from A4).

### 17. The family says "this side / that side" more than left and right
- At home they point: ***hida*** (here, near you) and ***huda*** (there), or ***hi baju*** (this side) and ***hu baju*** (that side). These match *hi* (this) and *hu* (that) from A4.
- There are words for left and right: ***dabo hath*** (the left hand), ***jamni baju*** (on the right; *jamni* is the she-word form, because *baju* is a she-word, so the right hand is probably *jamno hath*).
- In the middle: ***wich me***. In the corner: Mum said "corner me" for now. The Kutchi word is unknown (Gujarati has *khuno*), so **ask Masi**.

### 18. The noun doesn't change before *je*, but -o words look as if they do (a question for C12–C16)
- Mum: in *table je niche*, *table* doesn't change; *je* is its own word.
- But the door came out as ***darwaje*** je putiya. If the door is *darwajo* (a he-word), then -o changes to -e before *je*, like Gujarati *darvaja ni pachhal*. Section C12–C16 will settle it.
- *je / ji / jo* look like one "of" word that agrees:
  - *jo* for he-words (*munjo*, "mine", Mum's gloss);
  - *ji* for she-words (*dudh wagar ji chai*, and chai is a she-word);
  - *je* before a place word (*table je mathe*, *munje same*).

  That's the Sindhi pattern exactly (*jo / ji / je*).

### Claude's check against Sindhi and Gujarati
- *mathe* matches Sindhi *mathe* (on top) and Gujarati *māthe*. *niche* matches Gujarati *nīche* (under). *andar* is shared by all three. *wich me* matches Sindhi *vich mẽ* (between).
- *aagiya* matches Sindhi *aggiyā̃* and Gujarati *āgaḷ* (in front). *same* matches Gujarati *sāme* (opposite, facing). *bajume* matches Gujarati *bājue* (beside), from *baju* (side).
- *dabo* (left) is Gujarati *ḍābo*. *jamno* (right) is Gujarati *jamṇo*. *rak* (put) is Gujarati *rākh*.
- *putiya* (behind) is probably the same root as Sindhi *puṭhiyā̃* (behind, from *puṭhi*, the back).

### What this means for the game (proposed; approved ideas go in `docs/GAME-IDEAS-TBC.md`)
14. **Tidy up's "place" stage gets its whole word set:** *mathe, niche, andar, putiya, bajume, aagiya, wich me*. The frame is ***{thing} {place-thing} je {where} rak*** ("put the cup in the cupboard"). One place word per round at level 1.
15. **The clinic's sides:** use ***dabo*** / ***jamno*** (left/right, always the patient's own side) as designed. The family's everyday *hi baju / hu baju* is a good level-1 alternative when the doctor points.
16. **Nani's lines:** *munje same we* (come and sit opposite me) and *munje same rak* (put it in front of me) fit the Cook send-off and the serve step.

## 26 Sept 2026: Mum and Zafar, Questions A6 and A7 (one recording, 8 min, `sources/audio/mum-2026-09-26/A7.m4a`)

The file is called A7, but its first 3½ minutes are A6. Rough transcript: `sources/audio/mum-2026-09-26/A7.md`. *vyo* is spelled as Zafar wrote it (*ki rei nai vyo*); Whisper heard "biyo/viyo". Spellings are guesses until Zafar checks them.

### 19. Three kinds of "finished": *band thai vyo*, *khalas thai vyo*, *pati vyo*
- ***warsaad band thai vyo***: the rain stopped. *warsaad* = rain; *band* = closed; *thai vyo* = became, happened. It's "closed" rather than "finished", because the rain will come again, like a tap.
- ***film khalas thai vyo***: the film has finished, completely, and won't go on.
- ***pati vyo***: that's enough, it's over (*time pati vyo*: time's up, the time for that has come and gone). Mum thinks it may come from Gujarati, but the family does use it, with an "enough now" feeling.
- Have you finished work? ***kam kari vya?*** or ***kam khalas thai vyo?*** (*kam* = work).

### 20. "Who", "where", and something happened: *ker*, *kida*, *-i vyo*
- ***ker mitai khai vyo?***: who ate the sweets? (*ker* = who; *mitai* = sweets; *khai vyo* = ate).
- ***Simba khai vyo***: Simba ate it. ***Simba khani vyo***: Simba took it (*khan* = take, from A3).
- ***Simba ke rasore me nares***: I saw Simba in the kitchen. *ke* marks who was seen, like Sindhi *khe* and Hindi *ko*. The verb *nares* (saw) is as heard, so Zafar to check.
- **Kitchen:** ***rasoro*** is the proper Kutchi word. The family also says ***jikoni***, probably borrowed from Swahili (*jiko* = stove or kitchen, *jikoni* = in the kitchen), from the family's time in East Africa.
- ***kida wo?***: where was it? ***table je mathe wo***: it was on the table. It's *wo*, not *weo* (Mum's correction).
- ***hida / huda / kida*** make a set: here / there / where.

### 21. Elders get the respectful "you", and the verb changes to the plural
- How are you, to a child: ***tu ki ai?*** (*tu* = you, to a child; *ki* = how). To anyone, informally: *ki ai?*
- How are you, to an elder: ***ai ki aayo?*** Here the first *ai* is the respectful "you" (Zafar to check the spelling), and the verb changes from *ai* to ***aayo***.
- Come here, to a child or someone your own age: ***hida ach***. To an elder: ***hida acho***. It's the same for a man or a woman.
- He or she came: ***i achi vyo*** (about a child) and ***i achi vya*** (about an elder).
- He or she will come: ***i achdo*** (child) and ***i achda*** (elder).
- **The rule:** respect for an elder uses the **plural** ending (-o → -a, as in *amba*), like Gujarati and Hindi.
- ***achindo***: Mum first glossed this as "welcome", then as another tense of *ach* (come). To confirm.

### 22. What to call a grandchild: *beta*
- The family uses ***beta*** for boys and girls alike. Strictly a girl is *beti*, but *beta* is used for both. *dikra* sounds more Gujarati to Mum.

### Zafar's side question: "Is Kutchi like Japanese?"
They aren't related: Kutchi is Indo-Aryan, next to Sindhi, and Japanese is its own family. But they're built in similar ways, which is why it feels familiar:
- **The verb comes last**: *Simba ke rasore me nares* is "Simba-(object) kitchen-in saw".
- **Place words come after the noun**: *table je mathe* is shaped exactly like Japanese *tēburu no ue*, "table's top".
- **Politeness is built into the verb**: *hida ach* vs *hida acho*, like Japanese plain vs polite verbs.
- **"I" and "you" are often dropped**: *khai vyo*, "ate it".
- **An object marker**: *ke*, like Japanese *o*.

### What this means for the game (proposed; approved ideas go in `docs/GAME-IDEAS-TBC.md`)
17. **Who did it?** gets its core lines from the family:
    - *ker mitai khai vyo?* (who ate the sweets?);
    - *{name} khai vyo / khani vyo* ({name} ate it / took it);
    - *kida wo?* (where was it?);
    - *{place} je mathe wo* (it was on the {place});
    - *{name} ke {room} me nares* (I saw {name} in the {room}).
18. **Speaking to elders.** In a speaking moment, the child calls Nana with *hida acho*, not *hida ach*, and asks *ai ki aayo?* This is the respect lesson, at stage S3.
19. **Time's up and finished:** *time pati vyo* when a timed round ends; *khalas!* at the end-of-round screen; *warsaad band thai vyo* at the end of a Monsoon rush storm.
20. **Nani calls the child *beta*** in her lines, for boys and girls alike.
