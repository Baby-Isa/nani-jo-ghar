# Party guests: introductions and looking after the guests (slug: party-guests)

Designed overnight, 1 Nov 2026, while Zafar slept; revised the same night after an independent critique (`party-guests-critique.md`; what changed is in §12). Every choice he hasn't made is in §10, so he can reverse it. Design only: no code, no data, no Kutchi invented. Kutchi in *italics* is copied from the repo, with its clip id where one exists; everything else is English marked "to record". When agreed, this doc becomes `docs/game-design/modes/party.md` (the party's two talking stages; gifts, statues and Snap get their own sections there).

## 0. One line

Two stages at someone else's birthday party: **pass the balloon** (introductions: tap the person called; from level 2 the Kutchi kin word picks between two sisters) and **how are you?** (ask each guest how they are, hear the answer, fix it). Day: **someone's birthday** (a new family, a year older each visit; the day is not in `data/days.json` yet). Status: **new → designed, waiting on Mum's words** (this doc). Built from **Conversations** (built: T1, T3, T4, T11, T13 and its roster), `whichone.js` + `onboard.js` (the tap on a person), Cook's **order card** and host (built), the clinic's **feeling faces** (built), and one new shared piece, the **give-to tap** (the master map's shared give-to). Rough size: **large in all; the first sprint is medium** (stage A L1-L2 and stage B L1-L2 in the lab, five people, one art run; §6 says what waits). **Order: mock-ups → the names → Mum's sheet (§1) → the art run → the lab.** No lab build, leak bot or play-test before Mum's words land, because every deciding word is unrecorded today (§1).

---

## 1. The language goal

**Word groups:** greetings (main), family and kinship (main), health and feelings (main), owners and pronouns (supporting), question words (supporting); food and household things come back from Cook and the clinic.

**Key:** ✓ = a family take exists (the clip id in brackets). "in a recording" = Mum said it on a sheet but it isn't cut as a clip yet. "heard inside" = only heard inside longer recorded lines. "engine" = in the language engine's lexicon, not recorded alone. "to record" = not in the repo; English only.

### Greetings and the exchange (stage A and B)

| English | Status | Kutchi in the repo |
|---|---|---|
| hello (peace be upon you) | ✓ (`salamun-alaykum`) | *Salamun alaykum!* |
| hello back | ✓ (`alaikum-salaam`) | *Alaikum salaam!* |
| how are you? (to a child) | ✓ (`tu-ki-aiye`, B43) | *Tu ki aiye?* |
| how are you? (informal, cousin to cousin) | ✓ but marked "to check" (`ki-aiye`, K4; the sheet had *Ki ai?*) | *Ki aiye?* (used only at L3 as another way, once Zafar confirms) |
| how are you? (to an elder) | ✓ (`aai-ki-aayo`) | *Aai ki aayo?* |
| I'm fine. And how are you? (both forms) | ✓ (`aau-theek-ai-aai-ki-aayo`, `aau-theek-ai-tu-ki-aiye`) | *Aau theek ai. Aai ki aayo?* / *Aau theek ai. Tu ki aiye?* |
| I'm fine | ✓ (`aau-theek-ai`) | *Aau theek ai* |
| do you know who I am? | ✓ (`toke-khabar-ai-aau-ker-aiya`; Nani's version only) | *Toke khabar ai, aau ker aiya?* |
| who is it? | ✓ (`ker-ai`) | *Ker ai?* |
| no, thank you | ✓ (`na-thank-you`) | *Na, thank you* |
| you're welcome | ✓ (`jara-e-wandho-nai`) | *Jara e wandho nai* |
| well done | ✓ (`shabash`) | *Shabash!* |
| can you help me? | ✓ (`tu-muke-help-kar-de`) | *Tu muke help kar de?* |
| guests are coming | ✓ (`mageni-achenta`) | *Mageni achenta.* |
| goodbye | ✓ (`khuda-fis`, K3) | *Khuda hafiz!* |
| what's your name?; my name is (name) | to record (whole sentences, §1 Mum's sheet) | |
| this is my (kin) | to record (*hi*, this ✓; *munji* ✓ in `munji-kursi`) | |
| give the balloon to (person) | to record (the engine has no "to" word yet: gap 2 below) | |
| happy birthday (Kutchi, or the English the family uses?) | to record (open question 3) | |

### Family and kinship (stage A)

| English | Status | Kutchi in the repo |
|---|---|---|
| Nani (mother's mother) | ✓ (`nani`, K14) as the cast's name; Mum to confirm it works as a kin word with an owner | *Nani* |
| mum | engine, as the cast's name only (`pn.ma`, she) | *Ma* |
| grandmother, father's mother | in a recording (K14; lexicon `n.grandmother`, confirmed; not cut as a clip) | *dadima* |
| grandfather, father's father | to record (not in the lexicon; `party-gifts.md` uses *dada*, Zafar confirms the spelling) | *dada* |
| Nana (mother's father; ours) | ✓ (`nana`) as the cast's name; Mum to confirm it works as a kin word with an owner | *Nana* |
| mother's sister | to record (the cast's Masi is a real person and the beach host; open question 4) | |
| dad; brother; baby; cousin; friend | to record (later visits) | |
| boy; girl | heard inside | *chokro*; *chokri* |
| dear (a child) | heard inside (`mmm-chai-bo-fine-ai-shabash-beta`) | *beta* |
| guests | heard inside | *mageni* |

### Owners and question words (stage A)

| English | Status | Kutchi in the repo |
|---|---|---|
| this; that | ✓ | *hi*; *hu* |
| of ('s), agreeing with the person owned | engine (`gen.of`: *jo* he, *ji* she, *ja* he plural; grammar-notes §47) | *jo / ji / ja* |
| it's Nani's | ✓ (`nani-jo-ai`) | *Nani jo ai.* |
| my; your (to a child) | ✓ inside `munji-kursi`, `toji-kursi-ain` | *munji*; *toji* (she-thing forms) |
| who | ✓ (`ker-ai`) | *ker* |

### Feelings and what helps (stage B)

| Feeling (the deciding word) | Status | What helps | Status | Kutchi in the repo |
|---|---|---|---|---|
| hungry | to record | food: samosa; banana; mango | samosa ✓ (`samosa`, `sambusa`); banana engine; mango heard inside (`nani-jo-ambo`) | *samosa / sambusa*; *kelo*; *ambo* |
| thirsty | to record | a glass of water | water heard inside (`muke-paani-khapeto`) | *paani* |
| tired | to record | a chair | heard inside (`munji-kursi`) | *kursi* |
| sad | to record (lexicon `a.sad`, status to-record) | a balloon | to record | |
| hot ("I'm hot") | to record (*garam* ✓ is for things; Mum confirms the person form) | a fan | to record | |
| cold ("I'm cold") | to record (*thundo* ✓ is for things gone cold) | a shawl | to record | |
| fine | ✓ | nothing | | *Aau theek ai* |

**The deciding words and how many are recorded, honestly:** stage A at L1 is decided by the children's names, which are not Kutchi; its kin words (mum, mother's sister; at L4 father's father, father's mother, and Nana and Nani as ours) are **0 of 6 recorded as kin words in use** (*Nani*, *Nana* and *Ma* exist only as the cast's names; *dadima* is in a recording, not a clip; *dada* is not in the repo). Stage B's six feelings are **0 of 6**. The three frames ("my name is", "this is my", "give the balloon to") are all to record. Only the greetings, the asks and the "fine" path are recorded today. Under decision 84 every one of the others is grey English on the card and in the bubble, which a reader wins. So: **nothing is built until Mum's sheet below is recorded and cut** (decision 2).

### Mum's sheet for the party (English only; Mum says it her way)

Recorded only after Zafar fixes the family's names (open question 0), because the names are inside the sentences. Each is a whole, natural sentence; the engine learns the pieces from them (gaps below). Children's lines are voiced by family members, as in Conversations.

**Feelings (stage B, first):**
1. I'm hungry.
2. I'm thirsty.
3. I'm tired.
4. I'm sad. (and, at L3: "I'm sad, my balloon flew away.")
5. I'm hot. (the person form)
6. I'm cold. (the person form)
7. The six thank-yous, each with its feeling, so the word is heard a third time: "Thank you, I'm not hungry now." (and thirsty, tired, sad, hot, cold).
8. Two natural lead-ins, so a needy answer isn't shorter than the "fine" one: "Oh, I'm so thirsty!"; "Oh, I'm so tired!"

**Kin and calls (stage A, visit 1):**
9. What's your name? (Zara to the child)
10. My name is Zara. / My name is Yusuf. / My name is Sana. (each said as the child would)
11. This is my mum. / This is my masi. (once each, said by a child)
12. Give the balloon to Zara. / to Yusuf. / to Sana.
13. Give the balloon to Zara's mum. / to Zara's masi. / to Yusuf's mum. / to Yusuf's masi.
14. The same four alone, for the card: Zara's mum. Zara's masi. Yusuf's mum. Yusuf's masi.
15. Give it to my mum! / Give it to my masi! (a child holding the balloon, L3)

**Later visits (record when L3-L4 are built):**
16. This is my dada. / This is my dadima. (Mum: are *dada* and *dadima* the words a child uses for father's father and mother at a party? The host's grandparents are never "nani" or "nana": `party-gifts.md` decision 3.)
17. Give it to my dada! / to my dadima! / to your Nana! / to your Nani! (Zara holding the balloon, said to the child; "your" means ours)
18. Who's thirsty? (B3)
19. Happy birthday, as the family says it.

Spellings: Zafar confirms. Masi is second authority where Mum is unsure.

### What the engine can and can't build (the gaps, reported)

1. **"Zara's masi" needs *ji*, not *jo*.** The engine's `gen.of` agrees with the person owned (*Zara ji Ma*, a she-word), and it has the forms. But the new family's names aren't words in the lexicon, *masi* isn't a kin noun (only the cast's name), and *Ma* and *Nani* exist only as the cast's proper names. The engine can't say any stage A call today. Gap: add the names and the kin nouns with their gender, from Mum's lines 10-14.
2. **No "to" word.** "Give the balloon to Zara's mum" needs a "to" after the owner phrase. The lexicon has *muke* (to me) but no general "to". It also needs the *-e* or oblique forms before it (*ji* stays for a she-word, grammar-notes §49; whether the kin word changes is unknown). Gap: learned from line 13.
3. **"My name is ___" has no frame.** Recorded whole per name (line 10); the engine never fills a hole with the child's own name (§3 A, decision 5).
4. **"Your Nani" and "your Nana" to a child:** "your Nani" is probably *toji Nani* (from `toji-kursi-ain`), but it is untested with a person, and "your Nana" has no model. Gap: line 17.
5. **The feelings as a person's state** ("I'm hot", "I'm cold") need Mum's person forms; *garam* and *thundo* are for things. Gap: lines 5-6.

### Verbs

give (*de*, heard inside), sit (*we*, engine), eat (*kha* ✓), drink (to record; the map lists it missing), say (engine), want (*khape*, heard inside), come (*ach*, engine). All inside whole lines, none taught alone.

### Frames

- **Heard:** "my name is (name)"; "this is my (kin)"; "(name)'s (kin)"; "give the balloon to (person)"; "how are you?" both forms ✓; "I'm thirsty" and the five others; "I'm fine, and how are you?" ✓; "do you know who I am?" ✓; "who is it?" ✓; "thank you, I'm not thirsty now"; "no, thank you" ✓.
- **Said (closed sets of 2-3, pills always there):** "hello back" ✓; "how are you?" in the right form ✓ (Conversations T13 at the child's rung); "I'm fine" ✓; "you're welcome" ✓; "(name)'s (kin)" (introducing a guest to Nani, A3; to record). The child's own name is a watched beat, never said into a recogniser and never checked (§3 A).

### New words per level (first visit), per round

| Level | Stage A round | Stage B round | Which |
|---|---|---|---|
| L1 | 2-3 | 2 | "my name is", "give the balloon to", "what's your name?" (frames; names aren't Kutchi); two of hungry, thirsty, tired, sad per round (two guests) |
| L2 | 3 | 2 | mum, masi, "this is my"; hot, cold (fine is known) |
| L3 | 1 | 2-3 | "my" said by the holder; which food (banana, mango; samosa comes back ✓), Mum's other ways |
| L4 | 3 | 2 | dada and dadima as kin words, "your Nana", "your Nani"; "and" (two needs), one amount |

Each round stays within lesson 10's 3-5. Each feeling is heard three times inside its own step (the guest's line, the card's speaker as it pops, the thank-you line 7), not counted across stages that aren't designed yet. Coming back: the greetings, the asks, samosa, water, chair, this, who, *shabash*, thank you.

---

## 2. Where it sits in its day

The birthday day, in `party-gifts.md` §2's order, which all three party designs now use (consistency pass, 1 Nov; the master map's Part 7 changes with it). This doc owns stages 3 and 4.

| # | Stage | Engine | Carries in | Carries out |
|---|---|---|---|---|
| 1 | Door | door (built) | | Nani: "today is Zara's birthday" (to record); "guests are coming" ✓ (`mageni-achenta`). The card: the wrapped present the child bought at the shops (owned by the gifts design) |
| 2 | The walk or ride | window-ride (built), the town road | | |
| **3** | **Pass the balloon** (introductions) | Conversations + the tap on a person | the present; the door's "guests" | **the people and who belongs to whom**, used by every later stage |
| **4** | **How are you?** (look after the guests) | order card + give-to + Conversations | the people from stage 3 | who needed what; "Yusuf was thirsty" for the book |
| 5 | Musical statues | `do-it` (`do-it-engine.md`) | Zara and Yusuf dance | the paper crown; "sit, the cake is coming" |
| 6 | The cake (candles, the cloth, the slices) | give-to (`party-gifts.md`) | whose is whose (the owners from 3) | |
| 7 | Snap the people (the family photo) | Snap (after its rebuild) | the names and kin from 3 | the photo for the book |
| 8 | The party presents, as everyone leaves | give-to (`party-gifts.md`) | | the party-bag toy for Ali |
| 9 | Home; evening book | book (built) | | a page "who we met" (the photo), and "who was thirsty?" |

**The after-statues round is dropped from the day:** in this order a second round of stage 4 after statues would put a give-to straight before the cake's give-to, which `party-gifts.md` §2 and `do-it-engine.md` §2 both rule out. It is parked in `docs/ideas.md` (row 94). B3 stays, played inside stage 4 on visit 2 (§3).

**The first-ever birthday day** plays stage 3 alone (its tutorial round) and skips stage 4; stage 4's tutorial (one guest) opens the day's next play. So the child's first party isn't two tutorials back to back (critique 6).

**The carry:** stage 3 is where the child learns this family. Stage 4 uses the same people. The cake, the presents, Snap and the book ask "whose?" and "who?" about the same family (one cast with `party-gifts.md` §0), so the kin words are heard again. On later visits, stage 3 starts with a returning guest asking "do you know who I am?" ✓ (A4).

**The master map's fold** puts "seat the guests", "where's my cup?", the dastarkhwan and "give one to Nana" at the party. This doc promises them three things only: the people (with their roster entries), their owners, and the give-to tap. The folding chair and the trolley are stage 4's props; seating, cups and the dastarkhwan stay with their own designs, and nothing here changes Tidy up's or Find it's built games (non-negotiable 1).

**Rhythm:** stage 3 is calm and social (sitting in a row); stage 4 is busy and toy-like (a trolley, reactions); statues is loud; the cake is calm; Snap is calm; the presents are a reveal. No engine twice in a row, and the give-to stages (4, the cake, the presents) are never back to back.

---

## 3. The stages and mini-games

**The people on visit 1** (placeholder names; Zafar picks, open question 0; one party cast with `party-gifts.md` §0, which also gives each person's look): **Zara**, the birthday girl (4); **Zara's mum** (the host); **Zara's masi** (her mum's sister, who is **Yusuf's mum**; the gifts design's "aunty"); **Yusuf**, Zara's cousin (6); **Sana**, Zara's friend (5). Five people in these two stages. Plus the child, and **Nani** and **Nana** (ours), who brought the child; Nani is the guide in the guide box. Also at the party from visit 1, in the gifts design's stages only: Zara's baby brother and her father's parents, **dada** and **dadima**. **Visit 2** brings dada and dadima into the balloon row (L4), with our Nana and Nani. The host's grandparents are never "nani" or "nana" (`party-gifts.md` decision 3). The two sisters are each other's children's masi: Zara's mum is Yusuf's masi, and Zara's masi is Yusuf's mum. That crossing is what makes the kin word decide.

Adults are called by kin words with their owner, never by first names: that's how a child speaks of elders in this family, and it puts the Kutchi kin word in the deciding seat. The owner is always said ("Zara's masi", never bare "Masi"), so the party's masi is never confused with ours (open question 4).

**The child is the camera in stage A:** the row of people faces us, and the balloon floats towards the viewer on the child's turn. The child's face shows in their face pill. So the row never holds the child.

### Stage A: Pass the balloon (introductions)

**The why:** at a real children's party, the grown-up rolls the ball and says a name. Here a child holds a balloon, calls who it goes to, and the balloon floats to that person.

**Steps (one call):**
1. The holder (always a child, facing front: the call is to the player, UX §16) calls: "give the balloon to Zara's masi!" (to record).
2. The child taps the person. One gesture all stage: a tap on a person.
3. The balloon rises from the holder's hands, floats in a slow arc along the ceiling band, and drops to the person called. A child gets a soft bop on the head and catches it; a grown-up catches it in their hands (open question 2: Zafar decides whether elders are bopped).
4. A grown-up who catches it bats it gently back to a child, who becomes the next holder. So the holder is always a child and never removes a grown-up from the choices.
5. At the round's end the balloon comes to the child: "what's your name?" (the watched beat below).

#### A1. They introduce themselves (L1)

| Question | Answer | Score |
|---|---|---|
| What do you do? | The intro pass is a tap: Zara says "my name is Zara" and holds the balloon out; the child taps who gets it next (no test, hands busy); that child says their name and holds it out. Then three calls by name. | 5 |
| Where is the challenge? Does the Kutchi decide? | Which name was said. The names aren't Kutchi, so L1 is taught, not tested: it moves no word's ladder. The Kutchi heard is the frames. | 2 |
| Where is the fun? | The balloon bopping heads; a wrong tap gets puffed back with a cheeky blow. | 4 |
| Where is the instruction? | The holder's own call, in her bubble. The card row is the balloon and a speaker. | 5 |
| What is novel? | The only game about people's names. | 4 |

#### A2. Whose mum, whose masi? (L2)

| Question | Answer | Score |
|---|---|---|
| What do you do? | Zara and Yusuf each introduce the two sisters ("this is my mum", "this is my masi"), pointing. Then the four swap seats (a quick, funny shuffle). Tap whoever is called: "Zara's masi". | 5 |
| Where is the challenge? Does the Kutchi decide? | Every call is about the two sisters, so the picture never settles it, and for each owner both sisters are an answer (Zara's mum and Zara's masi; Yusuf's mum and Yusuf's masi). The name alone never picks; the kin word does. | 5 |
| Where is the fun? | The seat shuffle; the sisters' comic catches. | 4 |
| Where is the instruction? | The intros, then the call; the card row pops with the speaker. | 5 |
| What is novel? | The only game where kin words decide. | 5 |

#### A3. The child introduces them (speaking; opens by the speaking ladder, around L3)

| Question | Answer | Score |
|---|---|---|
| What do you do? | Nani (ours) hasn't met them. She points to one sister: *Ker ai?* ✓ (`ker-ai`). The child picks from 2 spoken reply pills that share the owner ("Zara's mum", "Zara's masi"), or says it at R4. Nani greets that person: *Salamun alaykum* ✓. | 4 |
| Where is the challenge? Does the Kutchi decide? | The pills are sound-only (Conversations R3) and share the owner, so only the kin word tells them apart. | 5 |
| Where is the fun? | Nani and the guest do a big warm greeting; the child made it happen. | 3 |
| Where is the instruction? | Nani's question; the "your turn" bubble with the mic and the pills (speaking.md). The child heard the intros in A2. | 4 |
| What is novel? | The first time the child introduces someone: the flip of A2. | 4 |

#### A4. "Do you know who I am?" (later visits)

| Question | Answer | Score |
|---|---|---|
| What do you do? | A returning guest at the door asks *Toke khabar ai, aau ker aiya?* ✓. The child picks from 2 spoken pills of the same kind: a sister gets "Zara's mum" / "Zara's masi"; the grandparents don't ask A4, because dada against dadima is settled by the picture. | 4 |
| Where is the challenge? Does the Kutchi decide? | Remembering this family from last year, by the kin word; the asker's age never settles it, because both pills fit her age. | 4 |
| Where is the fun? | They are delighted to be remembered; Zara stands tall to show she's a year bigger. | 4 |
| Where is the instruction? | The line itself, already Conversations T4. | 5 |
| What is novel? | The only memory-across-visits moment in the game. | 4 |

**Kept: A1, A2, A3, A4.** Parked in "maybe later": **the memory chain** (each says the names before theirs: tests memory, not Kutchi; score 13) and **the child calls the name** (an open set the recogniser can't check; score 12). The pool was six ideas, the bottom of the method's 6-8.

#### Stage A level ladder

Calls per round: L1 3, L2 4, L3 5, L4 6 (rulebook formula, max 6). At most 5 people in the row at any level, at every size.

| Level | Adds one thing | The row | The calls |
|---|---|---|---|
| **L1** | the core: names | Zara, Yusuf, Sana | the intro pass (taps), then "give the balloon to Yusuf". The holder is never called, so each call is 1 of 2: one decoy, as the rulebook says |
| **L2** | the kin word decides | Zara, Yusuf, Zara's mum, Zara's masi (seated, children and grown-ups alternating) | "Zara's mum", "Zara's masi", "Yusuf's mum", "Yusuf's masi", drawn at random; only grown-ups are called. Intros first (A2); seats shuffle after them and every round |
| **L3** | other ways of saying it | the same four | the holder speaks for herself, facing the player: Zara says "give it to my mum!", Yusuf "to my masi!". "My" shifts with who holds the balloon. No intros (they've met), so the echo from the intro ends when support ends |
| **L4** | a look-alike | Zara (the holder), Zara's dada, Zara's dadima, Nana and Nani (ours) | Zara says "give it to my dada!", "my dadima!", "your Nana!", "your Nani!" (ours, said to the child): two look-alike pairs, a grandfather each (dada, Nana) and a grandmother each (dadima, Nani), none marked as whose, seats shuffled. Dada and dadima are introduced once, the first time they sit in the row ("this is my dada", "this is my dadima"), then never again |

No grandparent call exists until both pairs are in the row (L4), so age never picks. Yusuf's grandparents never come (his name alone would pick them). Gestures never change: tap a person. The Kutchi gets harder (names → kin word with an owner → "my" → two look-alike pairs of grandparents, the same pair `party-gifts.md` uses at its L4).

#### Stage A leak test, per mini-game

| Mini-game | Way to cheat | Fix |
|---|---|---|
| **A1** | Names are English: a reader or listener wins with no Kutchi | Accepted and said: L1 is taught, moves no word's ladder, and the leak bot doesn't score it |
| **A2, L2-L3** | **Reading:** labels; the card's text; grey English | No labels anywhere. Nothing is built until the calls are recorded (§1), so no grey English reaches a round. The card follows `data/rules.json`: its Kutchi always shown, English at L1 only (dotted from L2), picture at L1-L2 (blurred from L3) |
| | **Matching:** the picture (mum vs a grandparent by age); remembering whom Zara pointed at, keyed on her English name | Every call is between the two sisters (same age, a family likeness, different clothes, never marked); for each owner both sisters are an answer, so the name never picks and the kin word must. Hearing the intro and acting on it is listening (supported at L2); intros stop at L3 |
| | **Eliminating:** the last call is free; the holder removes an option | Calls drawn with replacement; the holder is always a child, so both sisters are always choices |
| | **Patterns:** seat order; a sister always beside her own child | Seats shuffle after the intros and every round; call order random |
| | **Waiting:** a glow comes on the right person | No glow ever lands on the answer. The card's speaker replays the call (free, any time); the guide's hint at 7-13 s (Nani says the call again) is counted (at most once a round for level-up); only the bulb's helper card shows the face, and it costs a bulb |
| **A2, L4** | Age picks the grandparents out | All four are grandparents; within each pair (dada and Nana, dadima and Nani) only the kin word and the owner ("my" against "your") differ. Blind: 1 in 4 a call (1 in 2 to a player who hears only "man" or "woman") |
| **A3** | Pill fishing: tap each pill, hear it, pick | Pills share the owner, so hearing them is hearing the kin word: listening, which is the point. First try is what scores; a no-Kutchi bot picking at random gets 1 in 2 |
| **A4** | The asker's age; pill fishing | Both pills fit the asker's age (two sisters; the grandparents don't ask A4); first try scores; 1 in 2 blind |

**The Sceptic at L2:** she knows a call is about one of the two women (the picture tells her that much) and nothing else: **1 in 2 per call**. Four first-try calls by chance: 1 in 16, about 6%. At L3 (five calls) about 3%; at L4 (six calls, 1 in 3) under 0.2%. **Bot target:** a learned save with no Kutchi wins under 10% of rounds at L2-L4. L2 sits close to that line, so if the bot measures over 10% the fix is five calls at L2, not new art.

#### Stage A delight

The balloon. It floats slowly (no speed), bops children's heads with a soft "boing" and a giggle, and each wrong tap gets a different funny miss: puffed back with a cheek-blow, batted up like volleyball, ducked under, caught by the wrong sister who hands it back with a wink. Never a frown, not even a pretend one. At the round's end Zara ties the balloon to the child's wrist (it follows the child into stage B).

#### Stage A speaking

1. **At the door** (before the stage): Zara's mum *Salamun alaykum* ✓ → the child *Alaikum salaam* ✓ (pills, then voice by the Conversations rung: T1).
2. **Your own name: a watched beat, not a test.** The child has heard three full recorded sentences ("my name is Zara", "my name is Yusuf", "my name is Sana"); no line with a hole is ever played. Zara turns to the child and asks "what's your name?". The balloon floats to the camera. The "your turn" bubble shows the mic **with the child's own face pill always beside it**. The child may say their name, tap the mic and say it, or tap the pill. After **4 s** of nothing (Conversations' R4 mic time) the pill pulses once. Whichever happens (a voice, a pill tap, or a tap anywhere after the pulse), the same thing follows: the child's character waves (on big screens) or the face pill waves (phones), and the three children wave back. No clapping for a noise, nothing checked, never a gate. The name is never a word in any ladder, and no recording of the child's name is kept. If Zafar wants the real name said, it's a parent-confirmed moment (speaking.md's parent fallback), not recognition.
3. **A3 and A4** (above): closed sets of 2, sound-only pills always there.

### Stage B: How are you? (look after the guests)

**The why:** Zara's mum: *Tu muke help kar de?* ✓. The guests have been playing; go round and ask how they are. Zafar (1 Nov): ask different people how they are; they answer; you fix it.

**The scene:** the front room, guests standing in a row, cut at the hip on phones and the knee on big screens. The host's tea trolley on the right: a plate (samosas, fruit), a jug of water and glasses, balloons tied to the handle, a hand fan, a folded shawl, and a folding chair beside it.

**Visit 1's guests:** Yusuf, Sana, Zara and Zara's masi (the elder, for the register). Zara's mum is the host and asks for help.

**Steps (one guest):**
1. **Ask.** Tap a lit guest. The child's ask is Conversations **T13** (the child asks), with the T3 line in the register the roster says: *Tu ki aiye?* ✓ to a child, *Aai ki aayo?* ✓ to an elder. Played for them at R1, picked by sound at R3, said at R4 (Conversations §3.3). Not a new ask step.
2. **Hear.** The guest answers: "oh, I'm so thirsty!" (to record). Their card pops big, its speaker plays the feeling, then it flies into its row: their face, the feeling's Kutchi, its speaker.
3. **Fix.** Tap a thing on the trolley (it lifts), then tap the guest. It goes to them.
4. **React.** The comic fix reaction (below); "thank you, I'm not thirsty now" (to record: the feeling's third hearing) → the *Jara e wandho nai* ✓ pill lights (optional). The row ticks.

**The rule while a card is open** (one gesture per state; no overlapping voices): while a guest's card is open and not yet fixed, the other guests are dimmed and can't be tapped (the lit-box rule), so a tap on a guest always means "give" to that one guest. A tap on another trolley thing puts the lifted one back and lifts the new one (a swap). A tap on the lifted thing puts it back. When no card is open, a tap on a lit guest means "ask". The lit box always shows which.

#### B1. Ask, hear, fix

| Question | Answer | Score |
|---|---|---|
| What do you do? | Tap a guest (ask), listen, tap a thing, tap the guest. | 5 |
| Where is the challenge? Does the Kutchi decide? | The heard feeling picks one of six fixes. The face shows nothing until a try (from L2), and all six fixes are always on the trolley. | 5 |
| Where is the fun? | Every fix has its own comic reaction, and every wrong fix a different funny one (below). | 5 |
| Where is the instruction? | The guest's own line, then their card. The guide box: "ask them" (the step). Zara's mum's opening request. | 4 |
| What is novel? | The child asks first and many different people answer. The clinic's send-off L3 does "feeling → what helps" for one patient; this is its main home, with the asking, the register and the "fine" guest. | 3 |

#### B2. The fine guest (interleaved from L2)

| Question | Answer | Score |
|---|---|---|
| What do you do? | Ask; the guest says *Aau theek ai. Tu ki aiye?* ✓; the child answers *Aau theek ai* ✓ (pill or voice). | 4 |
| Where is the challenge? Does the Kutchi decide? | Hearing that nothing is needed. Giving something gets a polite *Na, thank you* ✓ and a little head shake. | 4 |
| Where is the fun? | The polite refusal, and being asked back: the child is a guest too. | 3 |
| Where is the instruction? | The question back is the instruction; it's been modelled (Zara's mum and Nani, at the round's start). | 5 |
| What is novel? | The only "no fix" move; it's what stops "give everyone something". Fully recorded today. | 4 |

#### B3. Who wants it? (visit 2, inside stage 4; consistency pass: musical statues is now designed in `do-it-engine.md`, and the after-statues round is parked, §2)

| Question | Answer | Score |
|---|---|---|
| What do you do? | Zara's mum holds out the jug: "who's thirsty?" (to record). Ask the guests one by one until the thirsty one says so; give it. | 4 |
| Where is the challenge? Does the Kutchi decide? | The others answer with other needs, which the child must also fix before the round ends, so asking is never free. | 4 |
| Where is the fun? | The others' answers are funny on the way ("I'm hot!", flapping). | 3 |
| Where is the instruction? | Zara's mum's line, then the guests'. | 4 |
| What is novel? | The information gap: ask to find out (mechanics report, number 8). | 4 |

**Kept: B1, B2, B3** (B3 on visit 2). Parked in "maybe later": **offer chai** (speaking.md's "do you want chai?" → *haa* / *na*, once the child's offer line is recorded; score 15) and **the spill** (teaches no feeling word; score 11, cut by H48 unless it carries a word). The pool was five ideas, under the method's 6-8: the asks and fixes are one move, and Zafar named it.

#### Stage B level ladder

Guests per round: L1 2, L2 3, L3 3, L4 4. (The rulebook's L1 of 1 is overridden to 2, so the first round has a "next guest"; the first-ever round alone has 1.)

| Level | Adds one thing | The needs | The trolley | The face |
|---|---|---|---|---|
| **L1** | the core | hungry, thirsty, tired, sad; only "yes" needs (no fine guest) | all six things shown; only the right fix and one clearly different thing are lit and tappable | shows as the guest speaks |
| **L2** | more of it | all six needs, plus at most one fine guest | everything live; the card's English dotted | shows only after a try, once that feeling word is past support (three right in a row); a new word still shows it |
| **L3** | other ways of saying it | Mum's natural variants: "my tummy's rumbling", "I need to sit down", "my balloon flew away" (a reason, not a feeling), "it's so hot in here", "I'm shivering" (all to record); a hungry guest says which food ("a banana, please": samosa, banana or mango) | as L2; the card's picture blurred | as L2 |
| **L4** | two needs, and how many | "I'm hot and thirsty" → a fan and a glass, either order; "two samosas"; a look-alike on the trolley (a glass of water beside a glass of milk) | as L3 | as L2 |

Gestures never change: tap, then tap. No timer at any level: listening and speed fight (mechanics report).

#### Stage B leak test, per mini-game

| Mini-game | Way to cheat | Fix |
|---|---|---|
| **B1** | **Reading:** the card's text; grey English "thirsty" | Nothing built until the six feelings are recorded (§1, Mum's sheet 1-8), so no grey English. The card follows `data/rules.json` (Kutchi always, English at L1 only, picture at L1-L2) |
| | **Matching:** the card or the trolley shows the fix; the guest looks thirsty | The card never shows a fix, only the feeling (and its picture only while the word is supported). The face is neutral until a try from L2; no sweat, no shiver, no empty balloon string; everyone stands at the start |
| | **Eliminating:** one each; the last is free; fixes run out | Needs drawn with replacement (two thirsty guests is normal); the jug and the plate never run out; fine guests need nothing; always more things on the trolley than guests |
| | **Patterns:** grown-ups always tired, children always hungry; guest order | No need tied to a person, age or position; the same guest never repeats a need two rounds running; the child chooses who to ask |
| | **Waiting:** the face shows if you wait | The face shows only after a try. The card's speaker is free any time; the guide's hint at 7-13 s (the guest's line again) is counted for level-up; only the bulb's helper card shows the fix, at a bulb's cost |
| **B2** | The fine answer is longer and ends in a question, so its length gives it away | Needy answers carry lead-ins of the same length ("oh, I'm so thirsty!", Mum's sheet 8). Hearing a question asked back is Conversations' recorded lesson, so recognising it is Kutchi, not a cheat |
| **B3** | Ask everyone and try water on each (misses are funny and free) | Every guest asked has a need the child must also fix before the round ends, so an ask is never free; the badge and the ladder count first tries only |

**The Sceptic at L2:** six fixes plus "nothing" for each guest: 1 in 7 blind. Three guests all first try by chance: under 0.3%. After one wrong try the face shows and she wins the second go, but the first-try record is what moves levels and the word ladder. **Bot target:** under 10% of rounds won first-try with no Kutchi, on recorded rows.

#### Stage B delight

**Fix reactions** (each a real art pose; code only moves them):
- hungry + food: two big bites, cheeks puffed, a happy hum.
- thirsty + water: gulps it all in one long go, then a big contented breath out (Cook's ending).
- tired + chair: the chair slides behind; they flop down and nod off at once, then blink awake and smile.
- sad + balloon: lifted onto tiptoe by it, beaming.
- hot + fan: they fan themselves; hair and dupatta flutter, eyes closed in bliss.
- cold + shawl: wraps it round their shoulders, a cosy wiggle.

**Wrong-fix reactions** (funny, never a frown; each different):
- a balloon to the hungry guest: they look at it as if to take a bite, then hand it back.
- a fan to the cold guest: the shiver goes comic, teeth chattering, and the face now shows "cold".
- a chair to the thirsty guest: they sit politely, then point at their mouth.
- water to the tired guest: they sip, then yawn enormously.
- the shawl to the hot guest: they hold it at arm's length, fan themselves with it, and hand it back.
- anything to a fine guest: *Na, thank you* ✓ and a little head shake.

After a wrong try the thing goes back to the trolley by itself, the face shows the feeling, and the child fixes it on the spot (lessons 5).

#### Stage B speaking

- **The ask** (every guest): Conversations T13 at the child's rung; the register (elder or child) is the Conversations lesson.
- **The fine guest** (B2): *Aau theek ai* ✓ said back. Closed set of 2-3: *Aau theek ai* ✓, *Na, thank you* ✓, *Jara e wandho nai* ✓ (they sound different).
- **After a thank-you:** *Jara e wandho nai* ✓ (optional pill).
- **Watched first:** at the round's start, Zara's mum asks Nani *Aai ki aayo?* ✓; Nani answers *Aau theek ai. Tu ki aiye?* ✓ (three-quarter on, facing each other; then they turn to the child, UX §16).

---

## 4. The child's first-ever rounds, screen by screen

**Before:** the door, the bag, the ride. The child arrives holding the present. The first-ever birthday day plays stage A only; stage B's first round opens the next play (§2). Both times below are estimates; the lab times them.

### Stage A's first round (about 60-75 s)

1. **The door of the new house.** Zara's mum opens it and smiles. *Salamun alaykum* ✓. The reply pills (a wave picture, a speaker each) light; the rest dims. The child taps *Alaikum salaam* ✓. Zara pops out from behind her mum. Nani's guide box: "come in".
2. **The front room.** Zara, Yusuf and Sana sit in a row on floor cushions facing us, Zara holding a red balloon. One lit box shows the balloon (gold glow) and it bobs once: this is what moves.
3. **The intro pass (taps, no test).** Zara: "my name is Zara" (her bubble shows the Kutchi; nothing animates the text). She holds the balloon out; Yusuf and Sana are lit together. The child taps either; the balloon floats over; that child says their name and holds it out; the child taps the last one. Hands busy from the first second.
4. **The card.** Sana calls: "give the balloon to Yusuf!" Her bubble; then the card grows in its own row in the side panel (a balloon and a speaker) and settles. One lit box hugs Yusuf and Zara (the two choices; never crossing a face); everything else dims.
5. **The tap.** The child taps Yusuf. The balloon floats along the ceiling band and bops his head; he giggles and catches it. The row ticks. (A tap on Zara: she puffs the balloon back with her cheeks, the call plays again, and the child taps again.)
6. **Two more calls.** Each a 1-of-2, each with a different funny catch. Nani says *Shabash!* ✓ once.
7. **Your name.** Zara turns to us: "what's your name?" The balloon floats to the camera. The mic and the child's face pill show together. The child says their name, or taps the pill, or (after 4 s) the pill pulses and any tap moves on. The face pill waves; the three wave back.
8. **The end of the stage.** Zara ties the balloon to the child's wrist. A word card: "my name is" (Kutchi, its speaker). No end screen between stages; the shared end screen comes at the day's book.

### Stage B's first round (next play; about 45-60 s)

1. **Stage B opens.** The guests are standing. Zara's mum to Nani: *Aai ki aayo?* ✓; Nani: *Aau theek ai. Tu ki aiye?* ✓ (watched). Zara's mum turns to the child: *Tu muke help kar de?* ✓. The guide box: "ask them".
2. **The trolley shown.** One lit box sweeps once over the trolley: the plate, the jug, the balloons, the fan, the shawl, the chair (each bounces in turn). Shown, not explained.
3. **One guest only.** Yusuf alone is lit. The child taps him; *Tu ki aiye?* ✓ plays (R1). Yusuf rubs his tummy: "oh, I'm so hungry!" (to record; the face shows at L1). His card pops (his face, the word, its speaker) and flies to its row.
4. **The fix.** Only the plate and the balloons are lit. The child taps the plate (it lifts), then Yusuf. Two big bites, cheeks puffed. "Thank you, I'm not hungry now." The *Jara e wandho nai* ✓ pill lights; the child taps it or taps the scene to skip. The row ticks.
5. **The end.** Zara's mum: *Shabash!* ✓. Everyone turns to the door: Zara's cake is coming. The word card for "hungry".

---

## 5. Later visits and harder versions

The family's birthday comes round again: Zara is a year older each time.

| Visit | Zara | New people | Stage A | Stage B |
|---|---|---|---|---|
| 1 | 4 | Zara, her mum, her masi, Yusuf, Sana (five; dada, dadima and the baby brother are at the party, in the gifts design's stages) | L1 → L2 | L1 → L2 |
| 2 | 5 | Zara's dada and dadima join the balloon row with our Nana and Nani (each introduced once); returning guests ask "do you know who I am?" ✓ (A4) | L2 → L4 | L2 → L3; B3 |
| 3-4 | 6, 7 | Later; not designed (ideas noted: Zara's dad, more friends, scared and bored with fixes Zafar agrees) | | |

**Harder, always by the Kutchi:** more kin words, owners that shift (my, your), feelings said other ways, two needs in one answer, the register said aloud. Never faster taps, smaller targets or a timer.

---

## 6. What it reuses and what is new

**Reused (built):**
- `js/shared/conversations.js` with `data/conversations/*.json`: T1 (the greeting at the door), T3 (how are you, with register), T4 ("do you know who I am?"), T11 (thanks), **T13 (the child asks)** for stage B's ask; its roster shape `{id, kind, register, you, name: "kin-…", gender, voice, canSpeak, face}` for the new family (each grown-up's `name` is her kin phrase, e.g. "Zara's masi"); its pills and rungs.
- `js/shared/say.js`, `speech.js`: the closed-set speaking moments (A3, A4, B2) and the "your turn" mic.
- `js/shared/whichone.js` + `onboard.js`: the tap on a person (a target, a decoy set, a shake, the lit box). Built in the party's own stage file. The clinic's `waiting.js` is **not** moved: lifting it into a shared "pick a person" is proposed as its own fix-list row for a later sprint, with Zafar's word (decision 16).
- `data/faces.json` and the clinic's feeling faces (hot, cold, happy, sad) for the face states.
- `js/shared/order-card.js`, `word-card.js`, `host.js`, `guide.js`, `bulb.js`, `results.js` (the shared end screen at the book), `rules.js` and `data/rules.json` (hint times, card text and picture by level).
- The word ladder (the picture shows while a word is supported).
- The days runner (the birthday day's list, a new entry in `data/days.json`).

**New to build:**
1. **The give-to tap** (`giveto`, the one shared piece `party-gifts.md` designs, lifted from Snap's `js/snap/mechanics/handin.js`; one name in every design): tap a thing, then a person; the thing goes to them; the person reacts; the open-card rule (§3 B). One shared piece for the party's gifts and cake, seat the guests, give one to Nana, and stage B. Built once, here or by whichever party game comes first.
2. **One feelings table** (`data/party/needs.json`): feeling → fix, its lines, the reaction pose names, the wrong-fix reaction for each pair. It is meant to be the game's one feelings table; the clinic's send-off keeps its own (cold → blanket, sad → apple) until Zafar decides whether it reads this one (decision 9; non-negotiable 1). The adoption centre's needs card can reuse the shape.
3. **The balloon:** a slow arc in the ceiling band, a bop or a catch, the funny misses. Small (code moves one sprite).
4. **The seat shuffle:** people swap places in a short walk. Small.
5. **The name beat's mic:** the live wave from `speech.js`'s existing level meter (`onLevel`, SH-128), result ignored. If `Speech.listen` can't run with no choices, a one-line guard is the only engine change.
6. **The mode's data:** `data/party/guests.json` (the people, their roster entries and owners per visit, the levels), the birthday day in `data/days.json`, and a lab entry `lab.html?mode=party&game=balloon|guests`.
7. **The leak bot** for both stages, playing recorded rows only.
8. **The engine's gaps** (§1): the names and kin nouns with gender, the "to" word, the person forms of hot and cold, from Mum's lines.

**The first sprint** (once Mum's sheet 1-15 is recorded and cut, and the art lands): stage A L1-L2 and stage B L1-L2 in the lab, five people, the give-to tap, the balloon, the shuffle, needs.json, guests.json, the leak bot on L2. **Waits:** L3-L4, A3, A4, B3, visit 2's grandparents in the row, the day entry's later stages.

### Assets each mini-game declares and loads

| Mini-game | Backgrounds | People sheets | Items | Clips |
|---|---|---|---|---|
| A1 | front room, day | Zara, Yusuf, Sana (pose sheet) | the balloon | lines 9, 10, 12; `shabash` |
| A2 (L2-L3) | front room, day | + Zara's mum, Zara's masi | the balloon | lines 11, 13, 14, 15 |
| A3 | front room, day | the four above; Nani (built) | | `ker-ai`, `salamun-alaykum`, line 14 |
| A4 | the new family's door | the returning guest (the sisters) | | `toke-khabar-ai-aau-ker-aiya`, line 14 |
| B1 | front room, day | Zara, Yusuf, Sana, Zara's masi (pose and fix-and-miss sheets); Zara's mum (pose sheet) | trolley, plate of samosas, banana, mango slices, jug, glass of water, balloons, hand fan, shawl, folding chair | lines 1-8; `tu-ki-aiye`, `aai-ki-aayo`, `tu-muke-help-kar-de`, `jara-e-wandho-nai` |
| B2 | as B1 | as B1 | as B1 | `aau-theek-ai-tu-ki-aiye`, `aau-theek-ai`, `na-thank-you` |
| B3 (visit 2) | front room, golden evening | as visit 2 | + cup of milk | line 18 |

---

## 7. Art and layout

### Art (one ChatGPT run Zafar supervises; non-negotiable 8)

**Camera:** **E** (eye level), the art bible's hub framing: horizon at about 55-60%, people mid-shot, one row facing us. Stage A: the front room, children on floor cushions and the two sisters on low chairs, alternating, in one row. Stage B: the same room, guests standing in a row; the trolley on the right in **F** view. One camera per scene; the trolley things only in F.

**People, visit 1 (five; placeholders until his run; one run with `party-gifts.md`'s seven sheets, the looks in its §0):** each person one character sheet, then one 12-cell pose sheet (E, three-quarter, plus front-facing for their turn, UX §16):

| Cells | Poses |
|---|---|
| 1-3 | standing neutral (three-quarter); front-facing; seated (cushion for children, low chair for grown-ups) |
| 4-9 | the six feelings, standing (hungry tummy-rub, thirsty, tired, sad, hot, cold) |
| 10-12 | holding a balloon overhead (catch); laughing; waving |

Plus a second 12-cell fix-and-miss sheet (six fixes, six misses) **only for the four who get needs on visit 1:** Zara, Yusuf, Sana, Zara's masi. Zara's mum is the host and needs only the pose sheet. So visit 1 is 5 × 12 + 4 × 12 = 108 cells, cut from the same character sheets as `party-gifts.md`'s (Zara, her mum, her masi; Yusuf and Sana are drawn in that run too), in one paste block. The two sisters share a family likeness. Dada, dadima and Nana's party sheet are drawn in that same run for the cake; their balloon poses (seated, catch) are added for visit 2. Zara's later ages are later runs. None of the new family looks like anyone in the cast: no cream kameez with a red dupatta on any grandmother (Nani's look), no teal headscarf (the cast's Masi), no white beard (Nana, the doctor).

**Clothes and culture:** modest, modern East African Kutchi family party clothes (kurtas, kameez with dupattas), at most 1-2 Kutch nods per scene (a mirror-work cushion, an ajrakh throw). **No text anywhere:** no "happy birthday" banner, no number candles, no letters on balloons or bunting. Plain bunting, balloons in plain colours. No religious markers. Cake only as celebration food, never a reward.

**Backgrounds:** the new family's front room, day; golden evening for later visits (the relight rule: same camera, same layers).

**Items (F view, the props sheet's materials):** a plate of samosas, a banana, mango slices; a jug of water, a glass of water (a cup of milk later); a bunch of plain balloons tied to a handle, one loose balloon; a woven hand fan; a folded shawl (soft wool, a quiet border); a folding chair; the tea trolley. Each item real art with a contact shadow drawn by code.

### Layout (two layouts, switched by height; one row of people at every size)

The side panel's width comes from `data/layout.json` (phone: 19% of the width, 200-260 px, and on a screen wider than 16:9 it takes the room the picture can't use; laptop: 200-360 px). Stage A's play area is four bands, top to bottom: **the ceiling band** (bubbles and the balloon's arc, used in turn: the balloon never flies while someone speaks, so the two never meet); **the people band** (one row, at most 5, children and grown-ups alternating, grown-ups' heads at the top of the band); **the floor band** (the mic and the face pill on the child's turn, bottom right; scenery otherwise). The call card never pops over the play area on phones: it grows in its own row in the side panel. Faces at least 56 px. No camera pan at any level.

**Pixel sketch, stage A at L2 (four people) and L4 (five):**

| Size | Side panel | Play area | Ceiling band | People band | Slot per person (L4: 5) | Faces | Floor band |
|---|---|---|---|---|---|---|---|
| 740x320 (phone) | 200 | 540x320 | 0-64 | 64-256 | 108 px | 60 px | 256-320: mic 48 + pill 56, side by side |
| 915x275 (phone, tightest) | 260 | 655x275 | 0-56 | 56-227 | 131 px | 56 px | 227-275: mic 48 + pill 48 |
| 930x430 (phone) | 200 | 730x430 | 0-80 | 80-350 | 146 px | 80 px | 350-430 |
| 1280x665 (laptop) | 243 | 1037x665 | 0-120 | 120-560 | 207 px | about 110 px | 560-665 |
| 1920x1080 (laptop) | 360 | 1560x1080 | 0-200 | 200-900 | 312 px | about 170 px | 900-1080 |

At L2 (four people) the slots widen by a quarter; the extra room goes to the scenery between them, never to bigger faces than L4's. On phones the people are cropped from the top of the head to the knee (seated); on laptops, full body on cushions and chairs. These are the builder's starting numbers; the four-size check (740x320, 930x430, 1280x665, 1920x1080, plus 915x275) on film decides.

**Stage B:** the same bands. Guests cut at the hip on phones, 2-3 across at L1-L2 (4 at L4 by tightening the scenery, never the faces); the trolley as a slim column on the far right, its six items stacked two by three, each at least 56 px; the chair beside it. On 915x275 the trolley column shrinks the room, not the items; the floor and ceiling are cropped off. Big screens: guests to the knee, the trolley full height on wheels; the cog is the only button.

---

## 8. What it borrows from other games

- **The preschool ball-roll name game** (the teacher says a child's name and rolls the ball to them; the catcher says their own name). The whole of stage A's move. Sources: early-years lesson plans and name-game collections (search, 1 Nov: [Alaska WIC playtime lesson plan](https://health.alaska.gov:443/dpa/Documents/dpa/programs/Nutrition/WIC/Nutrition-Breastfeeding/Nutrition/Playtime_LessonPlan.pdf), [ESL Kid Stuff name games](https://www.Eslkidstuff.Com/esl-kids-games/name-games.htm), [Fun name game ideas for preschoolers](https://grandavehousing.calpoly.edu/news/fun-name-game-ideas-for); summaries).
- **Toca Birthday Party / Toca Tea Party:** serving guests who react. We add the goal (a need to meet) and drop Tea Party's outlines, which show where everything goes (research §1).
- **Toca Kitchen 2:** guests react to what they're given. Our fix and miss reactions.
- **Avokiddo Emotions:** caring for characters who react comically to the item you give for how they feel; Common Sense calls it hilarious ([review](https://www.commonsensemedia.org/app-reviews/avokiddo-emotions); summary). Borrowed: a comic reaction per item, including the wrong ones.
- **Sago Mini Friends:** visiting a friend's house as the whole premise (summary).
- **Our own:** the clinic waiting room (tap the person called), the clinic send-off (feeling → what helps), Cook's gulp ending, Conversations' register lesson and T13.

---

## 9. The lessons checklist

| Group | Verdict |
|---|---|
| **1. The heard word decides** | Passed on paper, **once recorded.** Leak rows per mini-game. From L2 the kin word picks between two sisters, each an answer for both owners; two pairs of grandparents at L4 (dada and Nana, dadima and Nani); no grandparent call before both pairs are in the row. Stage B: neutral faces, endless fixes, lead-ins so the fine answer's length doesn't tell. Ticks only on the right pick. **Today every deciding word is unrecorded** (kin 0 of 4, feelings 0 of 6, frames 0 of 3), so nothing is built until Mum's sheet lands (decision 2). Stage A L1 is decided by names: taught, not tested, no ladder moves |
| **2. Onboarding** | Passed. The first-ever birthday plays stage A alone; stage B's single guest opens the next play. One lit box with the gold glow; no finger, no flying demo. The balloon and the trolley shown first. 1-of-2 calls at L1. The intro pass is taps, so no long watch |
| **3. Instructions** | Passed. The asker is on screen and speaks before the card. The card never changes; the guide box says the step. Modelled first: Zara's mum and Nani play the how-are-you before the child's turn; the children introduce themselves; every new person is introduced once. Three things kept apart: the card's speaker (free), the guide's hint at 7-13 s (counted), the bulb's helper card (costs) |
| **4. Pacing** | Passed. No Next, no Done; each call and guest closes by itself. A tap skips speech and is never lost. No timers. The name beat never waits on a voice (4 s, then the pill pulses; any tap moves on) |
| **5. Feedback** | Passed. A wrong pick gets a different funny reaction and is redone on the spot. Rows tick when the step closes. The stage ends the moment the job is done, with something served. Shared end screen at the book |
| **6. Layout** | Passed on paper: one row at every size, at most 5 people, no pan, bubbles and the arc in the ceiling band in turn, the card in the side panel on phones, a pixel sketch per size (§7). Must be checked at all five sizes in the lab, on film |
| **7. Art** | Passed on paper. One camera (E, items F). Nothing drawn in code. Two poses per speaker. Visit 1 is five people, 108 cells. The new family looks like no one in the cast; no real-likeness sheet in their prompts |
| **8. Speaking** | Passed. All speaking inside watched exchanges; closed sets of 2-3 with pills always there; never a gate. The child's own name is a watched beat with the face pill always beside the mic, never checked, never in a ladder |
| **9. Levels** | Passed. Rulebook order (core, more of it, other ways, a look-alike). Gestures never change. Level up after 3 rounds with the guide's hint at most once each (`data/rules.json`). **Exception:** stage B's L1 is 2 guests, not 1 (written in its row) |
| **10. Words** | Passed. Every line listed with its clip id or "to record" (§1); Mum's numbered sheet in §1; the engine's gaps reported. 3-5 new words a round; each feeling heard three times in its own step |
| **11. Culture** | Passed. Halal food (samosa, fruit); modest clothes; no religious markers, no turban gag; no sweets as a reward; no frown, even pretend; the balloon is never put near a face or popped; whether elders are bopped is Zafar's call (open question 2) |
| **12. Fun** | Passed. Hands busy at every step (the intro pass is taps). "Kind of funny": the balloon bops, the instant nap, the shawl-as-fan. Contrast (the gulp and the slow nap). Fine guests break the ask-fix rhythm |
| **13. Mistakes made twice** | Watched: every level and both stages to be played at every size; judged on film (the balloon and the shuffle are motion); no English text animated in a bubble; no design questions left for the builder (§10) |

**The ten questions:**
1. **Deciding words:** A: names (L1, taught), then the kin word with an owner (0 of 4 recorded). B: the six feelings (0 recorded), "fine" ✓.
2. **The Sceptic at L2+:** A: 1 in 2 per call (two sisters, each an answer for both owners), about 6% a round at L2, under 0.2% at L4; B: 1 in 7 per guest, under 0.3% a round.
3. **The open need:** a neutral face (B); two sisters, then two pairs of grandparents (A).
4. **What the first rounds light:** the reply pills; the balloon; the other two children (the intro pass); the two choices; the mic and face pill; then (next play) the trolley sweep; Yusuf; the plate and the balloons.
5. **Who asks, in which recorded sentence:** Zara's mum (`salamun-alaykum`, `tu-muke-help-kar-de`); the child (`tu-ki-aiye`, `aai-ki-aayo`, via T13); the guests (lines 1-8, to record; `aau-theek-ai-tu-ki-aiye`); Nani (`ker-ai`); a returning guest (`toke-khabar-ai-aau-ker-aiya`).
6. **The hands:** tap a person; tap a thing, then a person; tap a pill or speak.
7. **Kind of funny:** the balloon bops and misses; the instant nap; the wrong-fix reactions.
8. **The end and what's served:** the balloon tied to the child's wrist; the food and water given; then the cake.
9. **Each level:** §3 ladders; L4 is its own (two pairs of grandparents; two needs at once).
10. **Five sizes, one camera:** §7, with the pixel sketch.

---

## 10. Decisions made for Zafar overnight

Each: the choice, why, and the answer I assumed. Reverse any by number. Answerable "yes to all except …".

1. **Two stages, one doc:** pass the balloon and how are you?, stages 3 and 4 of the birthday day (`party-gifts.md` §2's order). *Why:* the people met in one are looked after in the next. *Assumed:* yes.
2. **The order is mock-ups → the names → Mum's sheet (§1) → the art run → the lab.** No lab build, leak bot or play-test before Mum's lines 1-15 are recorded and cut. *Why:* every deciding word is unrecorded, so a build today is a reader's win on grey English. *Assumed:* yes.
3. **Introductions as a balloon name game; the intro pass is taps** (option a of the critique). *Why:* the real preschool name game, and hands are busy from the first second. The other option, "give it to Nani" ✓ against a child's name at L1, is kept as a fallback if L1 feels empty of Kutchi. *Assumed:* yes.
4. **Adults are called by kin word with an owner, never by first name or a bare kin word.** *Why:* that's how a child speaks of elders here, and the owner keeps the party's masi apart from ours. *Assumed:* yes.
5. **From L2 every call is between the two sisters** (Zara's mum, Zara's masi, Yusuf's mum, Yusuf's masi); no grandparent call until L4's two pairs (Zara's dada and dadima, our Nana and Nani); no second Nani anywhere (`party-gifts.md` decision 3); Yusuf's grandparents never come. *Why:* the critique showed the names and the one old woman decided L2-L3. *Assumed:* yes.
6. **Every call is addressed to the player** ("my" means the holder's; "your Nani" and "your Nana" mean ours). Every new person is introduced once. *Assumed:* yes.
7. **The child's own name is a watched beat:** the face pill always beside the mic, 4 s to a pulse, the same wave whatever happens, never checked, never in a ladder, never recorded. *Assumed:* yes.
8. **One row of people at every size, at most 5, no camera pan;** the call card grows in the side panel on phones. *Assumed:* yes.
9. **The fixes are his:** hungry → food, thirsty → water, tired → a chair, sad → a balloon (Zafar, 1 Nov), hot → a fan, cold → a shawl (from the settings map's list, in the master map's row). `data/party/needs.json` is the one table; the clinic's send-off keeps its blanket and apple until he says otherwise. *Assumed:* yes.
10. **Add the "fine" guest** (needs nothing; asks back; the child says *Aau theek ai*). *Why:* it stops "give everyone something", and it's fully recorded today. *Assumed:* yes.
11. **The face shows only after a try,** except at L1 and while that word is supported. *Why:* the master map's leak fix plus the 29 Oct word-ladder rule. *Assumed:* yes.
12. **Which food moves to L3** (samosa, banana or mango), so L2 adds at most 3 words a round. *Assumed:* yes.
13. **Each feeling is heard three times in its own step:** the guest's line, the card's speaker, and "thank you, I'm not ___ now" (Mum records six). *Assumed:* yes.
14. **Food is samosa and fruit; no sweets; the cake stays in the cake stage.** *Assumed:* yes.
15. **Stage B's L1 has 2 guests** (the first-ever round 1); **the first-ever birthday plays stage A alone,** and stage B's tutorial opens the next play. *Assumed:* yes.
16. **No timer in either stage.** *Assumed:* yes.
17. **The tap on a person is built on `whichone.js` + `onboard.js`;** the clinic's waiting room isn't touched. Lifting it into a shared piece is a separate fix-list row for a later sprint, if he wants it. *Assumed:* yes.
18. **The give-to tap is built once as a shared piece,** with the open-card rule (other guests dimmed while a card is open). *Assumed:* yes.
19. **Visit 1 is five people in these stages and one art run (108 cells), shared with `party-gifts.md`'s sheets;** Zara's dada and dadima join the balloon row on visit 2; visits 3-4 are not designed. *Assumed:* yes.
20. **B3 plays inside stage 4 on visit 2; the after-statues round is parked** (it would put two give-to stages back to back before the cake). *Assumed:* yes.
21. **Cut:** the pretend-cross face, the turban gag, "Nani-ji", the read-along underline, the camera pan. *Assumed:* yes.
22. **When agreed, this becomes `docs/game-design/modes/party.md`.** *Assumed:* yes.

**Open questions (genuinely his):**
0. **The family's names, first:** Zara, Yusuf, Sana are placeholders; Mum records them inside every frame. Should they avoid any real relative's name? He picks.
1. **Two calls or one for the child's ask at L3:** may the informal *Ki aiye?* (K4, marked "to check") be used as another way to ask a cousin?
2. **Elders and the balloon:** may the balloon bop a grown-up's head in play, or does it land in their hands (assumed: hands)?
3. **"Happy birthday":** Kutchi, or the English the family says? (Mum.)
4. **The word "masi":** our Masi is real and hosts the beach. At the party the owner is always said ("Zara's masi"). Is that enough, or should the beach host get a name (e.g. "Masi Sakina") so the word is only a kin word? (Him and Mum.)
5. **Caps or headscarves** for the new family at the party? Kept plain and modern with dupattas.
6. **One voice rule for the party** (consistency pass, 1 Nov): here the children's calls are family takes said as a child would (Mum's, as in Conversations), while `party-gifts.md` gives every deciding line to Nani and keeps the host family to reactions, because the family has no young girl's voice (its decision 4 and open question 1). *Recommended:* keep both: Zara's calls here are Mum's takes; in the gifts design Nani asks. He confirms once for both.

---

## 11. ChatGPT mock-up prompts

Every prompt: no real-likeness sheet attached (the customers sheet is placeholders); the line "none of these people is anyone shown in the references"; the cast matches the ladder; no quoted sounds; no glow on anyone (the game never lights the answer). Each asks for the important strip to sit across the middle so Claude can cut a 3:1 phone crop from it.

### Prompt party-guests-1: pass the balloon, level 1

Shows the introductions game's core move: three children in one row, the balloon floating to the boy just after the child tapped him. Zafar sees the row, the scale of the faces and the toy.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). 1536x1024, landscape. Eye-level camera, horizon at about 55-60% of the frame.

The scene: the bright front room of a modern East African family home with gentle Kutch touches (limewash cream walls, one mirror-work cushion, a pale oak floor, plain coloured balloons and plain fabric bunting on the back wall with no writing on them). Late-morning sun from the upper left.

Three young children sit in one straight row on big floor cushions, facing the viewer, evenly spaced across the middle of the frame: a 4-year-old birthday girl in a marigold kameez with a light dupatta over her shoulders, a small plain paper crown on her head; a 6-year-old boy in a striped cotton kurta; a 5-year-old girl in a kameez and trousers. Nobody else is in the room.

The moment: a single plain red balloon floats in a slow, soft arc high above their heads, from the birthday girl towards the boy, who looks up at it with delighted surprise, hands reaching up. The other girl giggles behind her hand. A gentle dotted motion trail behind the balloon, kept above everyone's heads.

Composition: keep all three faces, the balloon and its arc inside a wide strip across the middle of the frame, about a third of the frame high, so the picture can be cropped to a 3:1 phone strip without cutting a face.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, big expressive eyes, rosy cheeks, no outlines, no photorealism, no cel shading, no blur or vignette.

None of these people is anyone shown in the references: the references are only for the style, the light, the room and the materials. These are three new children.

Absolutely no text, letters or numbers anywhere: no birthday banner, no writing on balloons, bunting, crown or clothes.

Must read at phone size: all three children's faces and their expressions, and the balloon.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
```

### Prompt party-guests-2: pass the balloon, level 2 (whose mum, whose masi)

Shows the harder version as designed: one row of four, two children and two sisters, so only the heard kin word picks. A sister catches the balloon in her hands.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). 1536x1024, landscape. Eye-level camera, horizon at about 55-60% of the frame.

The scene: the same bright front room of a modern East African family home (limewash cream walls, a pale oak floor, one ajrakh throw over a low chair, plain balloons and plain bunting with no writing). Late-morning sun from the upper left.

One straight row of four people facing the viewer, evenly spaced across the middle of the frame, alternating child and grown-up: a 4-year-old girl in a marigold kameez with a light dupatta and a small plain paper crown, on a floor cushion; a woman in her thirties in a deep plum kameez and a soft grey dupatta, on a low chair; a 6-year-old boy in a striped kurta, on a floor cushion; a second woman in her thirties in a red kameez and a red dupatta, on a low chair. The two women are clearly sisters: similar faces, the same warm smile, different clothes. Modest, modern, warm clothes.

The moment: a plain yellow balloon has just floated down into the red-kameez sister's raised hands; she is laughing as she catches it. The others laugh. Everyone is evenly lit; nobody is highlighted.

Composition: keep all four faces and the balloon inside a wide strip across the middle of the frame, about a third of the frame high, so the picture can be cropped to a 3:1 phone strip without cutting a face.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no blur.

None of these people is anyone shown in the references: the references are only for the style, the light, the room and the materials. These are four new people.

Absolutely no text, letters or numbers anywhere, including on clothes, balloons, bunting and the crown.

Must read at phone size: all four faces (the two sisters easy to tell apart by clothes but plainly family), and the balloon.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
```

### Prompt party-guests-3: how are you?, the first visit

Shows looking after the guests with visit 1's people: a row of standing guests, the tea trolley with the six fixes, one guest just given water and gulping it, the others still neutral (so the picture never gives the need away).

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). 1536x1024, landscape. Eye-level camera, mid-shot: people cut at the knee, horizon at about 60%.

The scene: the front room of a modern East African family home at a child's birthday party (limewash cream walls, plain balloons and plain bunting with no writing, one mirror-work frame). Late-morning sun from the upper left.

Left and centre: three party guests standing in one loose row, each about two thirds of the frame high: a 6-year-old boy in a striped kurta; a 5-year-old girl in a kameez and trousers; a woman in her thirties in a red kameez and a red dupatta. The boy and the girl have calm, neutral, friendly faces (no sign of how they feel). The woman is mid-gulp, tipping back a tall glass of water with her eyes shut in comic bliss. No speech marks, no sound words, no letters.

Right: a pale oak tea trolley on wheels, front view, holding clearly separated items: a steel plate of samosas with a banana and mango slices; a glass jug of water with two glasses; a bunch of plain balloons tied to its handle; a woven hand fan; a neatly folded soft wool shawl with a quiet border. A plain folding chair stands beside the trolley. Each item has a soft contact shadow and the solid, believable materials of the props reference.

Composition: keep the three faces and the six trolley items inside a wide strip across the middle of the frame, about a third of the frame high, so the picture can be cropped to a 3:1 phone strip.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no blur.

None of these people is anyone shown in the references: the references are only for the style, the light, the room and the materials. These are three new people.

Absolutely no text, letters or numbers anywhere.

Must read at phone size: each guest's face, the woman's gulp, and all six trolley items as separate, recognisable things (plate, water, balloons, fan, shawl, chair).

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
```

### Prompt party-guests-4: how are you?, a year older

Shows visit 2: golden evening light, the birthday girl now 5, several fixes landing at once so Zafar sees the range of comic reactions. Only people from the shared cast: Zara, Yusuf, Zara's masi and Zara's dadima (her father's mother, never a second Nani).

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). 1536x1024, landscape. Eye-level camera, mid-shot, people cut at the knee, horizon at about 60%.

The scene: the same family front room in golden evening light, low warm sun from the upper left, long soft shadows, a warm lamp glowing on a side table. Plain balloons and plain bunting with no writing.

Across the frame in one row, four guests: a 5-year-old girl in a marigold kameez with a light dupatta standing on tiptoe, beaming, holding the string of a new plain blue balloon that lifts her slightly; a woman in her thirties in a red kameez fanning herself with a woven hand fan, her red dupatta fluttering, eyes closed in relief; a grandmother in her late sixties in a soft lilac kameez with a plain grey dupatta, wrapped snugly in a soft wool shawl, smiling cosily; a 7-year-old boy in a striped kurta flopped back in a plain folding chair, fast asleep with his mouth a little open. No sound words, no letters, no "Z" shapes. Beside them a pale oak tea trolley with a jug of water, glasses and a plate of samosas and fruit.

Composition: keep all four faces inside a wide strip across the middle of the frame, about a third of the frame high, so the picture can be cropped to a 3:1 phone strip.

Style: match the references: a stylised 3D animated-feature look, soft warm light, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no blur.

None of these people is anyone shown in the references: the references are only for the style, the light, the room and the materials. These are four new people; the grandmother is not the grandmother of any reference.

Absolutely no text, letters or numbers anywhere, including no number candles and no birthday writing.

Must read at phone size: all four faces and what each is doing (balloon, fan, shawl, asleep in the chair).

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

---

## 12. Changes after the critique

Each finding, then what I did. Checked against the repo where the critique cited it.

1. **MUST: names and the one old woman decide at L2-L3.** Applied. From L2 every call is between the two sisters, and because each is an answer for both owners (Zara's mum = Yusuf's masi; Zara's masi = Yusuf's mum), neither the name nor the picture picks: the kin word does. Grown-ups are never holders, so both are always choices. No nani call until L4's three grandmothers; "Yusuf's nani" cut (his name alone would pick her). Intros stop at L3. Sceptic rewritten with the real odds: 1 in 2 a call at L2, about 6% a round; under 0.2% at L4. If the bot measures over 10% at L2, five calls is the fix.
2. **MUST: every deciding word unrecorded.** Applied. The names are now open question 0. Mum's numbered sheet is in §1 (19 lines; 1-15 for the first sprint). The engine's gaps are reported (§1): `gen.of` already has *jo/ji/ja*, but the new names, the kin nouns *Ma*/*masi*/*Nani* as kin words, and a "to" word aren't in the lexicon, so it can't say any call yet. Decision 2 sets the order: mock-ups → names → Mum's sheet → art → lab, with no lab build, leak bot or play-test before the words land. Status counts corrected: kin 0 of 4 (not "2 of 9"), feelings 0 of 6, frames 0 of 3.
3. **MUST: "say your own name" is an open set with no fallback.** Applied. It is a watched beat: the face pill always beside the mic, 4 s to a pulse (Conversations' R4 mic time, conversations.md line 304), the same wave whatever happens, no clapping for a noise, never checked, never in a ladder (decision 7). No line with a hole is played; the child hears three whole recorded "my name is ___" sentences. The mic's live wave uses `speech.js`'s existing level meter, result ignored; any engine change is a one-line guard (§6 item 5). The parent-confirmed option is noted.
4. **MUST: the phone layout for pass the balloon.** Applied. One row of people at every size, at most 5 (L4: two children and three grandmothers), no camera pan. A four-band layout with bubbles and the arc in the ceiling band, used in turn. The call card grows in the side panel on phones. A pixel sketch per size from `data/layout.json`'s side-panel rules, all five sizes (§7). The child is the camera in stage A, so the row never holds them. The mock-up prompts ask for a strip that crops to 3:1.
5. **MUST: the mock-up prompts.** Applied. nani-sheet dropped from every prompt. "None of these people is anyone shown in the references" added to each. Casts match the ladder: prompt 1 is three children only (no grandmother); prompt 2 is L2's row of four (two children, two sisters, no grandmothers); prompt 3 replaces the grandad with Zara's masi; prompt 4 is visit 2's people (no grandad; Yusuf naps in the chair). Quoted "aah", "snore" and the "bounce line" cut ("no Z shapes" added). The glow on the tapped person is gone. Colours chosen away from the cast: no cream-and-red grandmother (Nani), no teal (our Masi), no white beard (Nana, the doctor).
6. **SHOULD: L1 teaches no Kutchi and starts with a long watch.** Applied option (a): the intro pass is taps. Option (b) is kept as a fallback in decision 3. The first-ever birthday plays stage A alone; stage B's tutorial opens the next play. §4 split into two first rounds with estimates (60-75 s and 45-60 s), to be timed in the lab; "about 90 seconds" dropped.
7. **SHOULD: "your nani" said to someone else.** Applied. Every call is to the player; "my" is the holder's, "your nani" means ours (decision 6).
8. **SHOULD: a new person at L4 with no intro.** Applied. Every new person gets one intro the first time, at any level.
9. **SHOULD: two meanings of a tap on a guest.** Applied. A rule paragraph in §3 B: while a card is open, other guests are dimmed and untappable; a tap on another trolley thing swaps; a tap on the lifted thing puts it back; with no card open, a tap asks.
10. **SHOULD: no leak test for A3, A4, B3.** Applied. Leak rows are now per mini-game (A1-A4, B1-B3). A3 and A4 pills share the owner or fit the asker's age, first try scores. B3: every guest asked has a need to fix, first tries only. Added B2's length leak (fine answers are longer), fixed with recorded lead-ins.
11. **SHOULD: hint rules contradict the rulebook.** Applied. Three things named apart everywhere: the card's speaker (free), the guide's hint at 7-13 s (counted, at most once a round for level-up), the bulb's helper card (costs). The card follows `data/rules.json`: Kutchi always, English at L1 only, picture at L1-L2.
12. **SHOULD: wrong and missed reuse.** Applied. `rel.js` dropped. Stage B's ask is Conversations T13 with the T3 lines, and the new family uses Conversations' roster shape. `data/faces.json` named. `needs.json` is the one feelings table; the clinic keeps its blanket and apple until Zafar decides (I kept sad → balloon because it is Zafar's own word, 1 Nov, master map row; cold → shawl suits a party). A paragraph on the fold's party pieces is in §2.
13. **SHOULD: lifting waiting.js is an uninvited refactor.** Applied. The tap is built on `whichone.js` + `onboard.js`; the clinic isn't touched; the lift is proposed as its own later row (decision 17).
14. **SHOULD: *ki aiye* isn't recorded.** Mostly applied, one correction. `data/family-audio.json` does hold *Ki aiye?* (K4, `ki-aiye`, Mum and Zafar takes) but marked "heard, to check" (the sheet had *Ki ai?*). So the child form is now *Tu ki aiye?* (`tu-ki-aiye`, B43) via line ids, and *Ki aiye?* is only a possible L3 variant, open question 1. *Khuda-fis* corrected to recorded (K3). *Dadima*: in Mum's K14 recording and confirmed in the lexicon, but not cut as a clip; marked so. Sad: in the lexicon as "to record". Line ids added throughout.
15. **SHOULD: too many words at L2, too few hearings at L1.** Applied. Which food moved to L3; the new-words table is per round (3-5). Each feeling is heard three times in its own step, via a recorded "thank you, I'm not ___ now" (Mum's sheet 7). The "3+ across stages 4-9" claim is gone.
16. **SHOULD: scope creep.** Applied. Visits 3-4 are one line, "later; not designed". Visit 1 is five people: 12-cell pose sheets for all, fix-and-miss sheets for the four who get needs (108 cells). Visit 2 adds the two grandmothers. Size restated: large in all, first sprint medium. §6 names what the first sprint builds and what waits, and notes the birthday day isn't in `data/days.json` yet.
17. **SHOULD: tone and culture.** Applied. The pretend-cross face, the turban gag ("hold it at arm's length and fan with it" instead) and "Nani-ji" are cut. Whether elders are bopped is open question 2; until he answers, grown-ups catch the balloon in their hands and only children are bopped.
18. **SHOULD: English text reaching the child.** Applied. No read-along underline; bubbles show the Kutchi and nothing animates the text. Grey placeholders can't reach a round because nothing is built before the words are recorded (decision 2).
19. **SHOULD: "Masi" is already a person.** Applied as a flag (open question 4). Until he and Mum answer, the owner is always said ("Zara's masi"). I didn't rename the beach host: that changes a built day, which needs his word (non-negotiable 1).
20. **SHOULD: method outputs missing.** Applied. An assets table per mini-game (§6). The doc's home is `docs/game-design/modes/party.md` (decision 22). The idea pools are stated (six for A, five for B, with why). B3 and the after-statues round are marked "later, depends on statues", since the master map's day doesn't include that round yet.

**Consistency pass (1 Nov, `consistency-2026-11-01.md`).** This design now shares one party cast with `party-gifts.md` (its §0) and `do-it-engine.md`. The host's grandparents are **dada** and **dadima**, never "Zara's nani" or "dadi" (`party-gifts.md` decision 3), so L4 is now two look-alike pairs (Zara's dada and our Nana, Zara's dadima and our Nani; blind 1 in 4), Mum's lines 16-17 changed with it, and the grandparents don't ask A4. Zara is 4 on visit 1 (the gifts design owns her birthday), and every prompt uses the shared looks (Zara marigold, her mum deep plum, Zara's masi red; nobody in teal). The day's order is `party-gifts.md` §2's, so these are stages 3 and 4; the after-statues round is parked (it would put two give-to stages back to back) and B3 plays inside stage 4 on visit 2. One art run with the gifts design's sheets. The rows above in §12 describe the design before this pass.
