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
