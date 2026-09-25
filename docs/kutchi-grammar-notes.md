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

### 6. "and" in a list is *ne*; "with" (mixed in) is *{x} wari*
- A list: *ne chai, ne dudh, ne chamchi…* (and…, and…).
- Things mixed into something take ***wari***: *dudh wari chai* (chai with milk), *khan wari chai* (with sugar), *kesar wari chai* (with saffron).
- Two sugars is not *ba khan wari chai*; Mum corrected herself: ***Muke chai me ba khan khapeti*** ("in my tea I want two sugars"). *me* = in.
- **Sugar is *khan*** (the game has *khun*: check). **Take** is the same word, *khan* (below).

### 7. It's *daar*, not *daal*; "first … and then …" is *pela … ne poi …*
- ***daar*** ends in r. **The game says *daal*: change it.**
- ***pela*** = first. *ne poi* = and then (confirmed). On its own, "daar and then maani" is abrupt; the natural order is ***Muke pela daar khape, ne poi maani*** (I want daar first, and then maani).
- A waiter's question: *Daar ne maani saathe khapeti?* (daar and maani together?); *saathe* = together. Answer: *Haa, muke daar ne maani khapeti.*

### 8. "for" is *lai*; "also" is *pan*; "make" is *banai*
- ***Hi Nana lai ai*** (this is for Nana): *hi* = this, *lai* = for, *ai* = is.
- ***Ma lai pan hakro banai*** (make one for Ma too): *pan* = also, *hakro* = one, *banai* = make.
- Spelling of *lai* / *ai* is a guess from the transcripts (heard *lay aye*, *layaay*): Zafar to confirm.

### 9. "give me" is *muke … de*; "pass me" is the same; "put in / add" is *vij*; "take" is *khan* / *khanigin*
- ***Muke chamchi de*** (give me the teaspoon); ***muke hi chamchi de*** (give me this teaspoon). "Pass" is the same as "give".
- ***chamchi*** = teaspoon (she-word?), ***chamcho*** = tablespoon (he-word?): the -i/-o pattern again.
- Add the onion: ***dungri vij***, or ***dungri pan vij*** (add onion too); *vij* = put in. Spelling a guess (heard *which*).
- Take: ***hi ambo khan*** (take this mango, when handing it over); ***khanigin*** = take it yourself, pick one yourself (*ambo khanigin*, "take a mango"). *khan* doesn't change with gender.
- *ke* = or (*hi ambo khan, ke hi maani khan*).

### What this means for the game (adds to the list above)
5. The Chai tray's extras should use *wari* for mixed-in things (*dudh wari chai*), and the sugar count as *Muke chai me {n} khan khape(ti)*.
6. Rename *daal* → *daar* everywhere, and check *khun* → *khan*.
7. The "for {person}" frame for the Chai tray: *{person} lai*.
8. "Pass me" in the game: *Muke {x} de*. The tadka/steps order: *pela {x}, ne poi {y}*.
