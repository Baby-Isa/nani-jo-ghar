# Conversations: design (module id `conversations`)

**Date:** 26 Sept 2026
**Status:** a proposal for Zafar. Nothing is built. It grows game idea 20 (`docs/GAME-IDEAS-TBC.md`) into its own module, as Zafar asked on 26 Sept, and folds in ideas 6, 9, 14, 16 and 18.
**Reads:** `docs/kutchi-grammar-notes.md` (all of it), the Roadmap (arcs, S1–S6), the Cast, `docs/UX-PRINCIPLES.md`, `docs/first-launch-story.md`, `docs/speech-recognition-plan.md`, `docs/shared-api.md`, the Cook, clinic and Find it designs, and the five parked mode designs.

**The Kutchi rule.** Every Kutchi line below carries its source:
- **§n**: `docs/kutchi-grammar-notes.md`, section n (the family's own Kutchi);
- **hd**: from the class handout, already in the game with a stand-in voice, waiting for Mum to confirm (Questions for Mum D5): *Salamun alaykum*, *Wa alaikum salaam*, *Achija*, *Aabhar aanjo*, *Hedo*, *Ghan*, *Arre re*;
- **PH**: `placeholder (English): to record`. It shows as grey italic English in the game and is never tested.

A ✓ after a line means a family clip already exists in `data/family-audio.json` (Mum, then Zafar, from Section B).

---

## 1. Purpose and pillars

**Conversations are how the child *uses* Kutchi with people.** Every other mode uses Kutchi to get things done: fetch, cook, heal, find. In a conversation the Kutchi *is* the thing done. Someone talks to the child as themselves, and the child answers.

The pillars:
1. **Short, warm and seamless.** A conversation is a speech bubble from someone already on screen, and two or three reply bubbles. It lasts 5–15 seconds. There's no separate screen, no card and no score on screen. It is never a quiz.
2. **Who's asking matters.** The same question gets a different right answer from Nana than from Ali. This is how the respect strand (*tu / aai*) is taught, slowly, from S2.
3. **Less help, more talk, over time.** The ladder goes: read and hear → hear with pictures → hear only → say it → start it yourself. Exchanges grow from one turn to three or four.
4. **Never nags.** About one per round at most, with a skip, and never during a timed or listening job.
5. **No verdicts.** A wrong reply gets a character's reaction and the right line said back (a recast), never a red cross or a buzz (UX §11).
6. **Only the family's Kutchi.** An exchange with a placeholder line can play, but it's never tested.

**The five quality questions, for the module as a whole** (`docs/modes/MINIGAME-QUALITY-BRIEF.md`):

| Question | Answer |
|---|---|
| **What do you do?** | Listen to a person talking to *you*. Tap a reply bubble to hear it, and tap it again to say it. Later, say it into the mic. Later still, start the exchange yourself. The gesture is the same at every rung (UX §12). |
| **Where is the challenge?** | Picking the reply that fits the question (hello or goodbye, yes or a polite no). Then picking the one that fits *who* is asking (formal or informal). The support fades by rung, and the exchanges get longer. |
| **Where is the fun?** | People react to you. Nana beams at *Aai ki aayo?*. At *Tu ki aiye?* he looks behind him for the child you must be talking to. The No button in the first launch dodges. An elder raises an eyebrow at a bare *na*. Kasuku repeats your line later. |
| **Where is the instruction?** | The speaker's own line, in Kutchi, in a bubble with one speaker button (UX §4). The light bulb flips the bubbles to English. The ghost finger shows the tap once (UX §8). There's no instruction card: the question is the instruction. |
| **What's new?** | It's the only place the child is spoken to socially and answers as themselves. It's also the only place where the right answer depends on *who* is asking, and the only place where the child starts the talk. |

---

## 2. The exchange types

Fourteen types. "Who uses it" names the speakers who say the *first* line. The child replies, or from rung 5 starts the exchange.

**The respect forms the whole module rests on** (§21, §23, §27). Respect uses the plural ending, and it's the same for a man or a woman:

| Meaning | To a child or a peer | To an elder (or an adult stranger) | Source |
|---|---|---|---|
| you | *tu* | *aai* | §21 |
| (to) you | *toke* | *anke* | §23 |
| How are you? | *Tu ki aiye?* ✓ (informally, to anyone: *Ki ai?*) | *Aai ki aayo?* ✓ | §21 |
| Come here | *hida ach* | *hida acho* | §21 |
| Hurry up | *Jaldi kar!* ✓ | *Jaldi karo!* ✓ | §27 |
| Can you make me chai? | *Tu muke chai banai dinda?* ✓ | *Aai muke chai banai dinda?* ✓ | §27 |
| What would you like? | *Toke kuro khapeto?* ✓ | *Anke kuro khapeto?* ✓ | §23 |
| He or she came | *e achi vyo* | *e achi vya* | §21 |
| He or she will come | *e achdo* | *e achda* | §21 |

**A design rule that falls out of this.** Adults always talk *to the child* in the child forms (*tu, toke, ach, kar*). So the formal/informal choice is only ever the child's, in a reply or in their own question. The question itself doesn't give the answer away: Nana and Ali both ask *Tu ki aiye?*. The right reply to Nana ends *Aai ki aayo?*, and to Ali it ends *Tu ki aiye?*. A child copying the question gets Nana wrong. That's the respect lesson, and the echo trap is deliberate (see §5).

| # | Type | Examples: the first line → the child's reply | Who uses it | Formal / informal variants | First stage |
|---|---|---|---|---|---|
| **T1** | **Greeting: arriving** | *Salamun alaykum!* → *Wa alaikum salaam!* (hd). Kasuku's *Salamun alaykum!* (Cast). Nani's *Hedo, beta!* (hd + §22) | Everyone, on the day's first meeting. Kasuku at the door | The salaam is the same for everyone. The register shows in what follows (T3) | S1 |
| **T2** | **Greeting: leaving** | *Achija!* → *Achija!* (hd). *Mu lai khobar!* ✓ (wait for me, §27). *Hal mu saathe* (come with me, §12). PH: *Get well soon* (clinic G84); *See you tomorrow* | Customers, patients, shopkeepers and guests as they leave; Ali | *Achija* is the same both ways | S1 |
| **T3** | **Well-being** | *Tu ki aiye?* ✓ → *Aau theek ai.* ✓ (S1), then *Aau theek ai. Aai ki aayo?* or *Aau theek ai. Tu ki aiye?* (S2). The asker then answers *Aau theek ai.* PH (S4): *I don't feel well* (G112), *I'm tired* (G62), *I'm cold* (G11) | Every visitor: customers, patients, the doctor, shopkeepers, guests | The asker uses the child form. The child's return question carries the register | S1 (reply), S2 (register) |
| **T4** | **"Do you know who I am?"** | PH *Do you know who I am?* → a name: *Nani, Nana, Ma, Big Ma, Ali*. The child's counter-question at S3 is *Ker ai?* ✓ (who is it?, §23) | Family visitors on their first meeting, a relative in a funny hat, faces in old photos (Arc 5) | None in the answer (a name). The kinship *titles* (E85–E102) are PH until Mum records them | S1 (untested: the question is PH) |
| **T5** | **Requests to the child** | *Tu muke chai banai dinda?* ✓ → *Ha!* ✓ (§27, B41). *Muke {x} de* (§9). *Muke chakhan lai de* ✓ (let me taste, §27): the child hands the bowl over. *Ma lai pan hakro banai* (make one for Ma too, §8). PH: *Can you help me?*, *Will you help me cook?*, *Are you cooking today?* | Nani, Nana, Ma, Big Ma, customers, the doctor | The asker uses *Tu*. The child's reply *Ha!* is the same to everyone. From S3 the child asks *Aai muke chai banai dinda?* (idea 18) | S1 |
| **T6** | **Offers and polite refusals** | *Toke kuro khapeto?* ✓ → *Muke {x} khape* (§1) or *Na, na khape* (§11). *Daar ne maani saathe khapeti?* → *Haa, muke daar ne maani khapeti* (§7). *Muke khun nati khape* (§11). *Na, thank you* ✓ (§23). *Hi ambo khan* / *ambo khanigin* (§9). *Kha!* ✓ (§27). *Bas!* ✓ (§25) | Nani, elders and hosts offering; from S3 the child offering to guests | A bare *Na.* is rude (§11): it's the social trap from S2. The child offers with *Anke kuro khapeto?* to elders (S3) | S2 |
| **T7** | **Yes/no questions** | Any question with a rising voice (§27: "no word for *can*: the question is in the rising voice at the end"). → *Ha!* ✓ or the polite no. *Hever na* ✓ (not now, §25) | Everyone | The polite no depends on context: *na, na khape* for an offer, *hever na* for "now?" | S1 |
| **T8** | **Question-word questions** | *Ker ai?* ✓ (who's there?) · *Hi kuro ai?* ✓ (what's this?) · *Kida ai?* ✓ (where is it?) · *Kyo?* ✓ (which one?) · *Kitla?* ✓ (how many?) · *ki* (how, §21) · *Kida wo?* (where was it?, §20) · *Ker mitai khai vyo?* (who ate the sweets?, §20). Answers: *Hida / huda* ✓ (§23), *hi / hu*, *hi na, hu* (§13), a number (§2–3), *{x} table mathe ai* (§15) | Nani (a lost spoon), shopkeepers, the doctor; the child from S3 | The words don't change. The child's version to an elder adds *aai / anke* where the frame has one | S2 (where, who), S3 (which, how many), S5 (was) |
| **T9** | **Likes** | PH: *I like chai* (C94), *What's your favourite colour?* / *I like red* (F35). Until then, wants carry it: *Toke kuro khapeto?* → *Muke {x} khape* | Relatives (Arc 2's gift chapter), Nani | PH until C94 | S3 |
| **T10** | **Small talk** | Weather: *Warsaad band thai vyo* (the rain's stopped, §19); PH *It's raining* (G7), *It's hot* (G10). Food: *Tayar ai* ✓ (it's ready), *Ukreto* ✓ (it's boiling), *Kha!* ✓. Work: *Kam kari vya?* / *Kam khalas thai vyo?* (finished work?, §19). Eid: PH *Tomorrow is Eid* (first launch), *Eid Mubarak* (F71). *Time pati vyo* (§19) | Nana home from work, Nani, guests, strangers on the Arc 5 journey | *vyo / vya* (§21) when it's said about an elder | S3–S4 |
| **T11** | **Thanks and "you're welcome"** | *Aabhar aanjo!* (hd; the family may just say the English *thank you*, §23) → *Jara e wandho nai* ✓ (§27). Praise: *Shabash!* ✓ (§25) | Customers, patients, shopkeepers, Nani. The child thanks shopkeepers and the doctor from S2 | The same both ways | S2 |
| **T12** | **Apologies** | PH *Sorry* → PH *It's okay* (Who did it?'s reveal). *Arre re!* (doc) is the everyday "oh dear" | Simba's owner in Who did it?, a guest after the spill (Arc 1 Ch4), the child | PH | S3 |
| **T13** | **The child asks** (role reversal) | The child opens with a T3, T6 or T8 line: *Aai ki aayo?* · *Anke / Toke kuro khapeto?* · *Aai muke chai banai dinda?* · *Ker ai?* · *Kida ai?* · *Kitla?* · *Hida acho* | The child, to any speaker | The register is the child's choice, by who they're talking to | S2 (*Ker ai?* at the door, with pills), S3 (spoken) |
| **T14** | **Calls and warnings** (heard first, said later) | *Hedo!* (hd) · *Hida ach / acho* (§21) · *Jaldi kar / karo* ✓ · *Dhyan rakh!* ✓ (careful!) · *Mu lai khobar!* ✓ · *Hal mu saathe* · *Bhaj na, hal* · *Na ad!* (hot!, §12) | Nani and Ali (heard); the child calls Nana *hida acho* (idea 14) | *ach / acho*, *kar / karo* | S1 (heard), S3 (said) |

**Scores against the five questions** (1–5 each: do / challenge / fun / instruction / novel), to decide what the MVP carries:

| Type | Do | Chall. | Fun | Instr. | Novel | Sum | Verdict |
|---|---|---|---|---|---|---|---|
| T3 Well-being (with register) | 4 | 5 | 4 | 5 | 5 | 23 | **MVP** (the spine of the module) |
| T6 Offers, polite refusals | 4 | 4 | 4 | 5 | 4 | 21 | **MVP** |
| T13 The child asks | 4 | 5 | 4 | 4 | 5 | 22 | Later (S3; *Ker ai?* at the door from S2) |
| T5 Requests | 4 | 3 | 4 | 5 | 3 | 19 | **MVP** |
| T8 Question words | 4 | 4 | 3 | 5 | 3 | 19 | **MVP** (*kida ai?* only) |
| T1 / T2 Greetings | 3 | 2 | 3 | 4 | 2 | 14 | **MVP** (short, but it's where every visit starts and ends) |
| T11 Thanks | 3 | 3 | 3 | 4 | 3 | 16 | **MVP** |
| T4 Who am I? | 4 | 2 | 4 | 1 | 4 | 15 | **MVP**, untested until the question is recorded |
| T10 Small talk | 3 | 3 | 3 | 2 | 3 | 14 | Later (mostly PH today) |
| T9 Likes | 3 | 3 | 3 | 1 | 3 | 13 | Later (PH) |
| T12 Apologies | 3 | 2 | 3 | 1 | 3 | 12 | Later (PH) |
| T7 Yes/no | 3 | 2 | 2 | 5 | 1 | 13 | Folded into T5/T6 (the no is the lesson) |
| T14 Calls | 2 | 2 | 3 | 5 | 2 | 14 | Heard everywhere; said at S3 |

---

## 3. The difficulty ladder

Three dials, each tracked separately: the **answer mode** (the rung), the **length**, and the **register**.

### 3.1 The answer mode: five rungs

| Rung | Mode | On screen | Choices | Gesture |
|---|---|---|---|---|
| **R1** | Pictures + Kutchi text + sound | Reply bubbles, each with a picture, the Kutchi text and a speaker | 2 | Tap a bubble to hear it (it lifts). Tap it again to say it |
| **R2** | Sound + pictures | Pictures, no text | 2–3 | The same |
| **R3** | Sound only | Blank bubbles with a speaker glyph each: hear them all, then pick | 3 | The same |
| **R4** | Speak (closed set) | A mic, with the R3 bubbles faint behind it as the fallback (`Say.moment`) | 3–5 | Tap the mic and say it. The bubbles go live after one miss or 8 s |
| **R5** | Start it yourself | The speaker waits, eyebrows up. The child's opening lines are the choices (pills, or the mic at S3+) | 2–4 openers | Tap-tap or say. The speaker then answers, and the reply turn runs at the child's rung for that type |

**Rules.**
- **Pictures never decide the register.** The formal and informal replies share one picture (a thumbs-up face with a "?"), so from R2 the choice is by sound.
- **Text shows at R1 only**, so a reader can't match letters after that. R1 is *taught*, not tested: echo-matching the text is allowed while learning.
- **R4 needs family audio** for every answer in the set (`Speech.hasTemplates`). Otherwise the exchange stays at R3 for now.
- **No mic** (refused, absent, or the parent turned it off): R4 is skipped, and R5 runs with pills.
- **The light bulb** flips the bubbles to English for 5 s at R1, 3 s at R2, 2 s at R3 and 1 s at R4–R5 (UX §4). It counts as help (§5).

### 3.2 Length

| Length | Shape | Example |
|---|---|---|
| **L1: one turn** | Their line → your reply | *Tu ki aiye?* → *Aau theek ai.* |
| **L2: two turns** | Their line → your reply with a return question → their answer | *Tu ki aiye?* → *Aau theek ai. Aai ki aayo?* → *Aau theek ai.* |
| **L3: a chain of 3–4** | Two or three exchanges joined, one reply each | Salaam → how are you → *Tu muke chai banai dinda?* → *Ha!* |

Length grows by **chaining** short exchanges (a `chain` in the data), not by authoring long ones. In a chain, only one turn is graded (the weakest type's). The others play at a rung the child has already mastered, so a long exchange never means three tests in a row.

### 3.3 Register

| Level | What the child does |
|---|---|
| **Heard** | Characters use the right forms to each other, overheard: Ma to Nani, *Aai ki aayo?*. The child's reply has one right answer, with a content distractor |
| **Choose** | The formal and informal replies are both offered. Who's asking decides |
| **Say** | The child *says* the formal form to an elder (R4) |
| **Start** | The child *opens* with the right form (R5): *Aai ki aayo?* to Nana, *Tu ki aiye?* to Ali |

### 3.4 Mapped onto the syllabus and the arcs

| Stage | Arc | New exchange types | Max length | Register | Rungs used |
|---|---|---|---|---|---|
| **S1** Arrive and fetch | First launch, Arc 1 Ch1–2 | T1, T2, T3 (reply *Aau theek ai* only), T5 (→ *Ha!*), T4 (names, untested) | L1 | Heard | R1–R3 |
| **S2** Do as Nani says | Arc 1 Ch3–5 (Eid morning is the finale) | T3 with the return question (idea 20), T6 (the bare-*na* trap), T8 *kida ai?* (→ tap it / *hida*), T11, T13 *Ker ai?* at the door (pills) | L2 | **Choose** | R1–R4 (R4 only for one-word replies: *Ha*, a name, *Hida*) |
| **S3** Who's who | Arc 2 (the wedding) | T13 spoken (idea 14: *hida acho*, *Aai ki aayo?*; idea 18: *Aai muke chai banai dinda?*), T6 offers by the child (*Anke kuro khapeto?*), T8 *kyo? kitla?*, T9 likes (PH), T12 (PH), T14 said | L2–L3 | **Say** | R3–R5 |
| **S4** How I feel | Arc 3 (the monsoon) | T3 with real answers (not well, cold: PH), T10 weather, T5 *Can you help me?* (PH), offers to the sick | L3 | Say, in requests and offers | R3–R5 |
| **S5** What happened | Arc 4 (the lost ring) | T8 in the past (*kida wo?*, *ker … khai vyo?*), T10 *kam kari vya?*, talking *about* people (*e achi vyo / vya*) | L3 | Respect when talking *about* an elder (*vya*) | R4–R5 |
| **S6** Tell and plan | Arc 5 (the village) | The future (*e achdo / achda*, *achindo*), strangers, the child running a whole visit | L3+ | **Start**, everywhere | R5 |

**The numbers strand** runs through it too: *kitla?* (how many?) answered with *hakro / hakri, ba, trae* (§2–3; *hikdo / bo* are retired) in offers from S2 (*kitla maani?*: to confirm). **The respect strand** is the register column.

Stages cap what's *offered*. The rung is per child, per exchange type (§5). So a child in Arc 2 can be at R4 on greetings and R2 on offers.

---

## 4. Core vocabulary and frames

Every item carries its source and its stage. PH items are English until Mum records them.

| Category | Items | Source | Stage |
|---|---|---|---|
| **Greetings, leaving** | *Salamun alaykum*, *Wa alaikum salaam*, *Achija*, *Hedo* | hd (D5) | S1 |
| | *Mu lai khobar!*, *Hal mu saathe* | §27, §12 | S1 heard |
| **Well-being** | *Tu ki aiye?*, *Ki ai?*, *Aai ki aayo?*, *Aau theek ai* | §21, §27 | S1 → S3 |
| | *not well, tired, cold, hot, better, happy, sad* | PH (G112, G62, G11, G10, G63–G65) | S4 |
| **Respect forms** | *tu / aai*, *toke / anke*, *muke*, *ach / acho*, *kar / karo*, *vyo / vya*, *achdo / achda*, *achindo* | §21, §23, §27 | S2 → S5 |
| **Yes, no, politeness** | *Ha*, *Na*, *na, na khape*, *muke na khape*, *muke nato / nati khape*, *na, thank you*, *hever na*, *bas* | §11, §23, §24, §25 | S1–S2 |
| **Names and kinship** | *Nani, Nana, Ma, Big Ma, Ali, Isa* (the game's names); *beta* (§22) | Cast; §22 | S1 |
| | Kinship titles (mother's sister, father's brother…), what a child calls an elder guest | PH (E85–E102) | S3 |
| **Question words** | *ker*, *kuro*, *kida*, *kyo*, *kitla*, *ki* | §20, §21, §23 | S2–S3 |
| | *kere karein?* (who did it?) | Not confirmed: **don't use** (§ Zafar, 26 Sept afternoon) | – |
| **Answer words** | *hida / huda*, *hi / hu*, *hi na, hu*, *mathe, niche, andar, bajume, agiya* | §13, §15, §20 | S2 |
| **Frames** | *Muke {x} khape* | §1 | S1 |
| | *Muke {x} de* | §9 | S1 |
| | *{Tu / Aai} muke {x} banai dinda?* | §27 (confirmed with *chai*; other nouns: record whole or as chunks, Q5) | S1 (*Tu*), S3 (*Aai*) |
| | *{Toke / Anke} kuro khapeto?* | §23 | S2 (*Toke*), S3 (*Anke*) |
| | *{person} lai*, *{person} lai pan hakro banai* | §8 | S2 |
| | *{x} kida ai?* | §23 + the word order of §15 (to confirm) | S2 |
| | *Daar ne maani saathe khapeti?* → *Haa, muke … khapeti* | §7 | S3 (heard at S2) |
| **Offer nouns** | *chai, paani, dudh, khun, maani, daar, chaat, samosa, mishkaki, mitai, ambo* | §7, §20, §26, game data | S1 |
| **Numbers** | *hakro / hakri, ba, trae, char, panj* | §2, §3, game data | S1 |
| **Thanks, praise** | *Aabhar aanjo* | hd (Q1) | S1 heard, S2 |
| | *thank you* (English, as the family uses it) | §23 | S2 |
| | *Jara e wandho nai*, *Shabash* | §27, §25 | S2 |
| **Small talk** | *warsaad band thai vyo*, *tayar ai*, *ukreto*, *kam kari vya?*, *khalas thai vyo*, *time pati vyo* | §19, §25 | S3–S5 |
| | *It's raining, Eid Mubarak, Tomorrow is Eid* | PH (G7, F71, first launch) | S1 story, S4 |
| **Calls, warnings** | *hida ach / acho*, *jaldi kar / karo*, *dhyan rakh*, *bhaj na, hal*, *na ad* | §12, §21, §27 | S1 heard, S3 said |

**One spelling flag for the clinic.** The clinic design writes yes/no as *haa / nar*. The notes settle these as ***ha*** and ***na*** (§23, §24): *nar* is "look" (§20). The clinic's adapter should use this module's `ha` / `na` lines.

---

## 5. Tracking and adaptation

### 5.1 What's recorded

Everything goes in the one save, in a new namespace: `Save.get("conversations")` / `Save.set("conversations", …)` (shared-api §11).

**Per exchange type** (for example `wellbeing.howareyou`):

| Field | Meaning |
|---|---|
| `rung` | The current answer mode, 1–5 |
| `hist` | The last 8 attempts: `{t, session, rung, len, ok, first, help, via, speaker, reg: {asked, chose, ok}}` |
| `reg` | The register strand for this type: `heard` / `choose` / `say` / `start`, with its own last-8 history |
| `box`, `due` | Spaced return: the Leitner box (0–4) and the session index when it's next due |
| `parked4` | The session index until which R4 is parked (for a shy or noisy child) |
| `seen` | The total number of times it has been met |

- `ok` means the content was right, and the register too where one was asked for.
- `first` means right first time: no recast, no light bulb, and no replay beyond the first free one.
- `help` counts the light bulb and the replays.
- `via` is `tap`, `voice`, `pill`, `parent` or `skip`.

**Per speaker:** `lastDay` (the date they last greeted the child), `lastExchange`, and `lastType`. These drive the variety rules (§6.5).

**Per word:** each answer lists the word ids it tests (e.g. `conv-aau-theek-ai`, `conv-aai`, `kin-nana`). A right-first-time answer at R2 or above is a correct recall for those words through the existing path (`Stars.progress` rows → `js/progress.js`, Cook's word stages in `Save "cook"`). A miss has miss weight 1. Conversations move a word **at most one stage per session**, so small talk can't farm stages. A recognised or parent-confirmed R4 or R5 answer also counts toward `produce_stage` ("said it: 3 of 4 times this week" in the parent log, via `Speech.logMoment`).

**Session:** a new session starts when the app opens after 30 minutes idle, or on a new day. `session.index` is kept in the namespace.

### 5.2 Moving up and down

| Rule | When |
|---|---|
| **Up one rung** | 3 of the last 4 attempts at this rung are right first time, spread across at least 2 sessions, and the stage allows the next rung (§3.4) |
| **Register up** (`heard → choose → say → start`) | The same rule, on the register history. `choose` also needs the stage to be S2 or later, `say` S3, and `start` S3 with R5 unlocked |
| **Length up** | The type is at R3 or above: chains that include it become eligible |
| **Down one rung** | 2 of the last 3 attempts at this rung are not right first time (never below R1). The register strand steps down on the same rule |
| **R4 fallbacks** | A pill tap at R4 is neither up nor down (the voice star stays *open*, speech plan). **3 fallbacks in a row** park R4 for this type for 3 sessions. It plays at R3 meanwhile, then R4 is tried again |
| **Skips** | Neither up nor down (§6.2) |
| **Placeholder lines** | An exchange with any PH line is never tested. It moves nobody (`placeholdersTested: false`, as in `stars.json`) |

**Migration.** Cook already counts small talk in `Cook.save.exchanges` (`salaam`, `howareyou`, `canyou`: right answers in a row, `js/cook/flow.js`). Each count moves to its type: a count of 3 or more starts at R2 in box 1; below that, R1.

### 5.3 Spaced return

- When a type reaches the top rung its stage allows, and passes the up rule there, it enters **box 1**.
- It comes back as a graded moment after **1, 2, 4 and 8 sessions** (boxes 1–4).
- A right-first-time answer moves it up a box. A miss sends it to box 0, a rung down.
- In between, a mastered type still plays as flavour, but it's **answered for you** (Cook's current rule, §5 of its design): the speaker asks, Nani or the child's bubble says the reply, and it's heard, not tested.
- `pick` (§8) prefers a type that's due. When nothing is due, it prefers the weakest type (the lowest rung, then the lowest box).
- Kasuku (Cast) repeats a *reply* the child has used, favouring the weakest, in idle moments only. That's free spaced review.

### 5.4 Stars, the voice star and the end-of-round screen

- **The host's ear star and the three badges are untouched.** Conversation rows are never counted in the host round's accuracy or hints (UX §9), so small talk can't cost a cooking star.
- **The voice star:** a conversation's speaking moment (R4 or R5, spoken) counts as a speaking moment for the host round (`Stars.voice(hostMoments.concat(Conversations.roundMoments(roundId)), mode)`). It can earn the voice star. A pill tap leaves it open, never lost. **This gives Cook its first speaking moments** (Cook Q9 item 9) with no Cook mechanic changes.
- **The word review** (the end-of-round screen's page 2) adds the conversation's key words (`Conversations.roundWords(roundId)`), each with its English and a tap to hear.
- **The parent log** (device only) gets one line per moment: the type, rung, speaker, register asked and chosen, via, and confidence.

### 5.5 No negatives mid-play (UX §11)

| What happened | What the child sees and hears |
|---|---|
| Wrong content (*Achija* to a salaam) | The speaker tilts their head and says the right reply themselves, gently, as an echo. The bubbles come back once, and the right one throbs after 3 s. Not right first time |
| Wrong register (*Tu ki aiye?* to Nana) | Nana looks behind him for the child you must be talking to, chuckles, and says *Aai ki aayo?* himself. Then he answers it: *Aau theek ai*. A comic recast, never a buzz |
| A bare *Na.* to an offer | The elder raises an eyebrow. Nani, from the side: *Na, na khape*. The child taps again |
| Nothing (10 s) | The skip (§6.2) |

There are no red crosses, no "wrong" sounds and no *Arre re!* from level 2 onwards. The only record is the log.

---

## 6. How it appears in the game

### 6.1 Placement

A mode offers **slots**. Conversations decides whether to use one.

| Slot | When | Examples |
|---|---|---|
| **before** | Someone arrives (a customer, patient, shopkeeper or guest), or a story beat opens | A customer walks up to the island; a patient gets up from the bench |
| **during** | Only at a pause the mode declares: the big phase button, a wait in Relaxed (the chai pan heating), the belt stopped. **Never** during a timing window (a ring with a green section), a listening task, a Busy round, or while `Say.isListening()` | *Chamchi kida ai?* while the water heats |
| **after** | The hand-over, the serve or the send-off, before the end-of-round screen. **Never on it** (a clean screen) | Thanks and goodbye as the customer leaves |

Story beats and the first launch use `Conversations.run(id)`, which is scripted: the caps don't apply, but it's still one graded moment per step.

### 6.2 Frequency, and the skip

| Cap | Default ("Sometimes") |
|---|---|
| Graded moments per round (an order, a patient, an errand) | **At most 1** |
| "during" moments per round | At most 1, and only in Relaxed |
| Time between graded moments | At least 90 s |
| Per 10 minutes of play | At most 4 |
| A new station's first (onboarding) round | None |
| Heard-only lines (Kasuku, *Shabash, beta*, overheard) | Free, if they don't pause play |
| The chance of using a slot the caps allow | 0.6, or 1.0 when a due type fits the speaker |

**The skip.** A small waving hand on the speaker's bubble skips the moment. So does 10 s of nothing. Either way, the speaker says the answer themselves (the model) and carries on, and it's logged as a skip.
- Two skips in a row: the next moment waits two rounds.
- Three skips in a session: conversations go quiet for the rest of the session (heard-only greetings stay).

**The parent setting:** Conversations **Often** (up to 2 per round) / **Sometimes** (default) / **Story only** / **Off**. It sits in the grown-ups panel.

### 6.3 Seamless flow: bubbles, not screens

1. **The speaker's bubble** comes from the speaker's head: solid cream, dark text, with one speaker button (the Roadmap's layout contract; UX §4). Its position is the head anchor from `overlay.js`. Gameplay lines are **Kutchi only** (first-launch rule), and the light bulb gives the English.
2. **The reply bubbles** rise from the **bottom right** (under the thumb, UX §2) as the child's own bubbles. There are 2–3, or a mic at R4.
3. **The play area pauses** (Relaxed timers stop, taps on the scene are ignored), but the scene stays visible and alive: no dim, no card. The instruction card stays where it is in the sidebar, untouched (UX §13).
4. **The child replies.** The chosen line plays (at R1–R3 in the family model voice, Mum's by default), and the bubble floats to the speaker.
5. **The speaker reacts**, answering if it's L2 or longer. Then the bubbles fade and play resumes.

The budget is 5–8 s for L1 at R1–R3, 12–15 s for L2, and the mic time (a 4 s timeout) at R4.

**Onboarding.** The first conversation ever runs the ghost finger once (`Onboard.run("conversations/reply", …)`): tap a bubble, then tap it again. The first R4 does the same for the mic.

**Grandparent mode.** The speaker's line shows in large type for Nani to say herself. The child answers aloud, and Nani taps ✓ or "again" (`Say.moment({grandparent: true})`). The Game Design's "protect this" rule applies.

### 6.4 Who can talk

Speakers come from the **cast**, not from `rel.js`. (`rel.js` is the spatial relations layer: in, on, behind.) The roster is a new data file, `data/conversations/speakers.json`, built from the Cast, Cook's `customers` and the clinic's `people`:

| Speaker | The child uses | They call the child | Voice (until each is recorded) | Where |
|---|---|---|---|---|
| **Nani** | *aai* | *tu*, *beta* (§22) | Mum | Everywhere |
| **Nana** | *aai* | *tu*, *beta* | Zafar's clips as a stand-in | Cook, hub, Eid, Arc 5 |
| **Ma** | *aai* (default, Q3) | *tu*, *beta* | Mum (a stand-in) | Cook, Eid |
| **Big Ma** | *aai* | *tu*, *beta* | Mum (a stand-in) | Arc 1 Ch4–5, Dress up |
| **Ali** (cousin) | *tu* | *tu* | Zafar (a stand-in) | Cook, Find it, Snap |
| **The older cousin** | *tu* (default, Q3) | *tu* | Zafar (a stand-in) | Knock knock, later |
| **Isa** (baby) | – | – (can't talk; is talked *about*: T4) | – | Later |
| **Guests, elders** (aunties, uncles) | *aai* | *tu*, *beta* | Mum / Zafar | Arc 1 Ch2, Ch5, Arc 2 |
| **Shopkeepers** (adult strangers) | *aai* | *tu* | Zafar | Find it, Arc 2 |
| **The doctor** | *aai* | *tu*, *beta* | Zafar (a stand-in) | The clinic, Arc 3 |
| **Patients** | girl / boy: *tu*; old man, old woman, auntie, uncle: *aai*; baby: – (Ma speaks for it) | *tu* | By kind | The clinic |
| **Kasuku** | *tu* | – (echoes only; Q10) | Family clips, pitch-shifted (Cast) | Hub, doorway, windowsill; idle only |
| Simba, Zazu | – | – | – | Never talk |

A roster entry: `{id, kind, register: "elder" | "peer" | "child" | "stranger", you: "aai" | "tu", name: "kin-nana", gender, voice, canSpeak, face}`. `register` decides which reply is right. `name` is the word id for T4 answers.

### 6.5 Variety

- The same exchange never plays twice in a row, anywhere. The same *type* never plays in two moments back to back.
- A speaker greets (T1) only on their **first meeting of the day**. After that they get T3, T5, T6 or T10. A regular in the open kitchen never salaams twice in a session.
- **Line variants rotate.** A peer's how-are-you alternates *Tu ki aiye?* and *Ki ai?* (§21). Nani adds *beta* one time in two. The dishes in *Tu muke {x} banai dinda?* follow the round.
- **Register balance:** across a session, about half the graded T3 moments come from elders and half from children or peers (Ali, cousins, girl and boy patients), so "always formal" can't win.
- **No exchange twice in a session**, unless it's the weakest type and at least 10 minutes have passed.

---

## 7. The conversation-moment map

Every mode's pipeline stages, every story arc and chapter, the first launch and the hub. "When" is the slot. "Types" are §2's. "Stages" is the range where the moment is offered. Priority: **MVP**, **later**, **optional**, or **none** (with the reason).

### 7.1 First launch (`docs/first-launch-story.md`, Zafar's flow): most detail

| # | Step | When | Speaker | Exchange | Stages | Priority |
|---|---|---|---|---|---|---|
| FL1 | Make your character | – | – | **None**: pictures only, and nobody has been met yet | – | none |
| FL2 | Arrive at Nani's house | before | Nani at the door; Kasuku (heard) | **E1 salaam** (T1): *Salamun alaykum!* → *Wa alaikum salaam!* vs *Achija!*. R1, 2 bubbles. Kasuku squawks *Salamun alaykum!* from the windowsill (heard only) | S1 | **MVP** |
| FL3 | The pantry round (the chai things) | – | – | **None**: the first round stays the clean three-item pantry (UX §7) | – | none |
| FL4 | Back to Nani | before the chai | Nani | **E4 make me chai** (T5): *Tu muke chai banai dinda?* ✓ → *Ha!* ✓ vs *Na.*. It's the line every child half-knows (*chai*), so the first reply they understand is a real one. R1 | S1 | **MVP** |
| FL5 | The chai station | after | Nani | Heard only: "Mmm, lovely chai! *Shabash, beta*." (to record) | S1 | **MVP** (heard) |
| FL6 | The story panels (Eid tomorrow, guests, empty pots) | – | Nani | **None**: story lines are English then Kutchi. There's nothing to answer until the question | – | none |
| FL7 | "Will you help me cook?" | the story's last beat | Nani | **E5 help me cook** (T5): PH *Will you help me cook?* → *Ha!* ✓ / PH *Yes, I'll help you cook*. Only yes works: the No bubble dodges the finger, or Nani laughs. The question is a story line (English then Kutchi), and the reply is gameplay (Kutchi) | S1 | **MVP** (untested until recorded) |
| FL8 | Cook's first day, the first customer | before the order | Nana | **E3 how are you** (T3): *Tu ki aiye?* ✓ → *Aau theek ai.* ✓ vs *Achija!*. L1, R1 | S1 | **MVP** |
| FL9 | The home screen, afterwards | before, once per session | Whoever is in the hub | E1 on the day's first visit, then E3 | S1–S6 | later |

**FL walkthrough (level 1).**
- **FL2.** The door opens. Nani, smiling: *Salamun alaykum!*, with the read-along lighting the words. Two bubbles rise bottom right: a waving hand with *Wa alaikum salaam!*, and a hand waving goodbye with *Achija!*. The ghost finger taps the first once, it plays, and the finger taps again. The bubble floats to Nani, and she beams. Kasuku: *Salamun alaykum!* (squawk). Six seconds.
- **FL4.** Nani holds up an empty glass: *Tu muke chai banai dinda?*. The bubbles are a nodding head (*Ha!*) and a head shake (*Na.*). *Ha!*: Nani claps and points at the stove. *Na.*: her eyebrow goes up, she laughs, and *Ha!* throbs.
- **FL7.** It's the same shape, and the No bubble slides away from the finger, twice.

### 7.2 Cook with Nani (pipeline: order → prepare → cook → serve → review): most detail

| # | Stage · station | When | Speaker | Exchange | Stages | Priority |
|---|---|---|---|---|---|---|
| CK1 | **Order**: a customer arrives at the island | before the request card | Nana, Ma, Ali, guests | **E1 salaam** if it's their first meeting today, else **E3 how are you**. S2: E3 with the register choice (idea 20). In the open kitchen, a regular gets E3 or E6 | S1–S3 | **MVP** |
| CK2 | **Order**: the ask | before the request card (after CK1 in a chain, L3 at S2+) | The customer | **E4 make me {dish}** (T5): *Tu muke {dish} banai dinda?* → *Ha!*. The request card then gives the details | S1–S2 | **MVP** |
| CK3 | **Order**, S3: the child takes the order | before | The child → the customer | **T13**: the child asks *Anke kuro khapeto?* (Nana) / *Toke kuro khapeto?* (Ali). The customer's answer fills the request card (Cook's "swap roles", design §3 item 8) | S3+ | later (high value) |
| CK4 | **Prepare** · the pantry (Nani's list) | – | – | **None**: it's the first round and a listening job; Nani's *pass me* already interrupts it | – | none |
| CK5 | **Prepare** · chop | – | – | **None**: timer, swipe | – | none |
| CK6 | **Prepare** · thread, fill + fold, roll | during, at the phase button ("Go to the barbecue") | Ali, Nani | Optional: Ali's *Mu lai khobar!* (heard), or **E9 where is it** | S2+ | optional |
| CK7 | **Cook** · the chai tray's boil (Relaxed only) | during: the pan heating, before the knob's green window | Nani | **E9 where is it** (T8): *Chamchi kida ai?* → tap the teaspoon on the counter. From R2 the reply is *Hida!* ✓ (it's by you) or *Huda!* ✓ (it's over there), by where it is | S2 | **MVP** (the one MVP "during") |
| CK8 | **Cook** · tadka, fry, grill, tawa, stir, the knob's window | – | – | **None**: heat clocks and green windows. Nani's *Dhyan rakh!* ✓ may play as a heard warning | – | none |
| CK9 | **Serve** · pour the cups, plate, bowl | after the hand-over | The customer | **E7 thanks** (T11): *Aabhar aanjo!* → *Jara e wandho nai* ✓ vs *Achija!*. If this is the round's one moment, then **E2** as they leave (heard) | S2 | **MVP** |
| CK10 | **Serve** · *{person} lai* | – | – | **None added**: the mode owns it (Cook Q9 items 5 and 9: *Nana lai* said aloud) | – | none |
| CK11 | **Serve → review**: Nani's treat | after serve, before the end screen (story days) | Nani | **E6 what would you like** (T6): *Toke kuro khapeto?* ✓ → *Muke {x} khape* for 2–3 pictured things from today's words (spaced review), or *Na, na khape*. S2: a bare *Na.* is in the set (the trap). Any polite answer is right. What you pick is what she hands you, so at R3 a mis-heard pick has a visible consequence | S2 | **MVP** |
| CK12 | **Review** · the end-of-round screen | – | – | **None**: a clean screen. The conversation's words join page 2 | – | none |
| CK13 | **Pass me** (the modifier) | after the pass | Nani | Optional: E7 thanks. It counts as the round's moment | S2 | optional |
| CK14 | **Chaat**: after the customer's layer check | after | Nani | **T5**: *Muke chakhan lai de* ✓ → the child hands her the bowl (a reply by action) | S2 | optional |
| CK15 | **Samosa + fry**: after | after | The child → the customer | **T10, R4**: the child says *Tayar ai!* ✓ as they serve | S3 | optional |
| CK16 | **The chai tray**, the day's end (idea 18) | before | The child → Nana | **T13**: Nana's turn to make chai. The child asks *Aai muke chai banai dinda?* ✓ (not *Tu …*). Spoken at S3 | S3 | later |
| CK17 | **Open kitchen**: each arrival | before | Customers | CK1 rotation; **E8 who am I?** for a first-time guest | S1–S3 | later |
| CK18 | **Open kitchen**: "Close the kitchen" | after | The last customer, Nani | **E2** *Achija!* | S1 | later |
| CK19 | **Station lab** | – | – | **None**: the lab is for testing stations | – | none |

**CK walkthrough (a level-1 chai day, S1 → S2).**
- **S1.** Nana walks up to the island. *Tu ki aiye?* (his bubble, read along). Bubbles: a thumbs-up face with *Aau theek ai.*, and a waving hand with *Achija!*. The child taps, taps: Nana nods. *Tu muke chai banai dinda?* → *Ha!*. The request card comes up.
- **S2**, a few sessions later. Nana asks *Tu ki aiye?*. There are two thumbs-up bubbles, *Aau theek ai. Aai ki aayo?* and *Aau theek ai. Tu ki aiye?*, same picture, plus the waving hand.
  - The child picks *Aai*: Nana puts a hand on his heart, *Aau theek ai*, and beams.
  - The child picks *Tu*: Nana looks over his shoulder for the small child you must be talking to, laughs, says *Aai ki aayo?* himself, and the bubbles come back once.
  - Later, Ali asks the same *Tu ki aiye?*, and there *Tu* is the right one.
- **During the boil (Relaxed):** *Chamchi kida ai?*. The child taps the teaspoon, and Nani takes it. *Shabash!*.
- **After serving:** Nana, *Aabhar aanjo!* → *Jara e wandho nai*. He waves *Achija!* and goes.

That's three moments offered across a two-dish day, and the cap takes at most one per round.

### 7.3 The clinic (pipeline: waiting room → diagnosis → pharmacy → heal → send-off): most detail

| # | Stage | When | Speaker | Exchange | Stages | Priority |
|---|---|---|---|---|---|---|
| CL1 | **Arriving at the clinic** (the morning's first patient) | before stage 1 | The doctor | **E1 salaam**, then (L2 at S2) **E3**: the doctor is an elder, so the right return is *Aai ki aayo?* | S1–S2 | **MVP** |
| CL2 | **1 Waiting room** · W1/W2 (after the right tap, as the patient walks up) | before stage 2 | The patient | **E3 how are you**, register by **kind**: a girl or boy is informal, an old man, old woman, auntie or uncle formal. It's the best register drill in the game, because the *kinds* are the lesson here anyway. Their salaam to the doctor stays heard, as designed | S1 (reply), S2 (register) | **MVP** |
| CL3 | **1 Waiting room** · a family patient (Nana, Big Ma or Ali on the bench) | before | That relative | **E8 who am I?** (T4): PH question → a name bubble with their face (Nana / Big Ma / Ali) | S1–S2 | **MVP** (untested until recorded) |
| CL4 | **1 Waiting room** · W3 *You call them*, W4 Busy | – | – | **None**: W3 is the mode's own speaking, and W4 has a timer | – | none |
| CL5 | **2 Diagnosis** · D1–D3 | – | – | **None added**: diagnosis *is* a conversation the clinic owns (*ha / na*, "where does it hurt?"). S4: see CL10 | – | none |
| CL6 | **3 Pharmacy** · the belt | – | – | **None**: a moving belt. After `handover`, the doctor's *Shabash!* is heard | – | none |
| CL7 | **3 Pharmacy**, after the tray check, S2+ | after | The child → the doctor | Optional: **E7** reversed. The doctor thanks you, and you say *Jara e wandho nai* | S2 | optional |
| CL8 | **4 Heal** · any game | – | – | **None**: H6 is already the clinic's conversation game, and nothing interrupts a heal | – | none |
| CL9 | **5 Send-off** · after E1/E2 feelings | after | The patient | **E7 thanks** (*Aabhar aanjo!* → *Jara e wandho nai*) or **E2 bye** (*Achija!* → *Achija!* vs *Salamun alaykum!*: arriving or leaving, read from the patient walking out). The clinic's **E3 "Say goodbye"** speaking moment runs on this module's E2 at R4 | S1–S2 | **MVP** |
| CL10 | **Before diagnosis**, S4 | before stage 2 | The child → the patient | **T13**: the child opens with *Aai ki aayo?* / *Tu ki aiye?* by kind. The patient's answer is PH *I don't feel well* (G112), which leads into D2 | S4 | later |
| CL11 | **5 Send-off** · E4 *You ask* (how do you feel?) | – | – | The clinic owns it (feelings PH). When the feelings are recorded, it becomes this module's T3 at R5 | S3–S4 | later |
| CL12 | **You're the patient** (V0) | before | The doctor | **E3 with a twist**: *Tu ki aiye?*, and *Aau theek ai* is funny-wrong (you're hurt!). PH *My knee hurts* is right | S2 | later |
| CL13 | **Close the clinic** | after | The doctor | **E2** *Achija!* and **E7** (the child thanks him) | S1–S2 | later |
| CL14 | **Open clinic** (free play) | before | Each patient | CL2's rotation, capped at 1 per patient | S1–S4 | later |
| CL15 | **Arc 3 Ch4** "Tell the doctor about Nani" | – | – | The clinic owns it (its S3 speaking) | – | none |

**CL walkthrough (the first morning, S1).**
- **Arriving.** The doctor laughs: *Salamun alaykum!* → *Wa alaikum salaam!*.
- **The waiting room.** The doctor calls the girl, and she stands. On her way to the bench she turns to the child: *Tu ki aiye?* → *Aau theek ai.*. She sits, and diagnosis starts.
- **At S2**, an old man is called. He asks *Tu ki aiye?*, and *Aai ki aayo?* is the right return. A boy asks the same, and *Tu ki aiye?* is right.
- **The send-off.** The girl, plaster on: *Aabhar aanjo!* → *Jara e wandho nai*. Then the end-of-round screen.

The cap keeps it to one graded moment per patient: CL1 counts for patient 1, CL2 or CL9 for the others.

### 7.4 Find it (seven stages): shopkeepers

| # | Stage | When | Speaker | Exchange | Stages | Priority |
|---|---|---|---|---|---|---|
| FI1 | 1 The errand (1a, 1b) | before | Nani | Heard: *Hedo, beta!*. **None graded**: the card is a listening job | S1 | none |
| FI2 | 2 Get there (2a) | during, the zoom | Ali | Optional: *Hal mu saathe!* (heard) | S1 | optional |
| FI3 | **3 The counter** · 3a salaam and *khanigin* | before | The shopkeeper (stranger → *aai*) | **E1 salaam**, then **E3** (formal return). This **replaces Find it's own `greet`** (which reads Cook's `exchanges.salaam` today) | S1–S2 | later (first after the MVP) |
| FI4 | 3 The counter · 3b Ask for one | before | The shopkeeper | The mode owns the speaking. Its prompt becomes *Toke kuro khapeto?* ✓ (A8.8, to a child) in place of PH *What do you need?* | S2 | later |
| FI5 | 4 Find it (the search) | – | – | **None**: the search is the listening job | – | none |
| FI6 | 5 Hand over · 5a the bag | after the swap | The child → the shopkeeper | **E7** reversed: the child says *Aabhar aanjo*, and he says *Jara e wandho nai* | S2 | later |
| FI7 | 5 Hand over · 5c scales, 5d pay | – | – | **None** (5d later: prices, *kitla?*) | – | none |
| FI8 | 6 Home · 6b give one to Nana | after | Nana | The mode owns *Hi Nana lai ai*. Then **E7** (Nana thanks you) | S2 | optional |
| FI9 | 7 Send-off / leaving the stall | after | The shopkeeper | **E2** *Achija!* | S1 | later |

### 7.5 The parked modes (lighter)

| # | Mode · stage | When | Speaker | Exchange | Stages | Priority |
|---|---|---|---|---|---|---|
| TI1 | Tidy up · 0 Arrive to 4 Put it right | – | – | **None**: listening and placing jobs, with Nani's checks | – | none |
| TI2 | **Tidy up · 5 Send-off: the knock at the door** | before seating | Guests | **T13** *Ker ai?* (the child asks who's there: pills at S2, spoken at S3) → a name. Then E1, E3 by register, E8 for a relative you don't know. *Hida acho* heard (said at S3). **This is "At the door"** (Roadmap mode 5): it becomes this chain, not a separate mode | S2–S3 | later (high) |
| WH1 | Who did it? · 1 Missing, 2 Gather, 4 Accuse | – | – | **None**: the mode owns *Ker mitai khai vyo?* | – | none |
| WH2 | Who did it? · 3 Question the suspects | – | – | The mode owns it. It borrows this module's R5 UI for the child's questions | S3 | later |
| WH3 | Who did it? · 5 Reveal, sorry, goodbye | after | The culprit's owner, Nani | **T12** PH *Sorry* → PH *It's okay*, then **E2** | S3–S5 | later |
| DR1 | Dress up · 1 Who's next? | after the tap | The client | **E3** by register (Nana formal, Ali informal) | S2 | later |
| DR2 | Dress up · 2 Measure to 5 Put it on | – | – | **None** (Big Ma's song; the mode's *pass me*) | – | none |
| DR3 | Dress up · 6 Mirror, photo, goodbye | after | The client, Big Ma | PH *How do I look?* → PH *Beautiful!* (F66, F67). On Eid: PH *Eid Mubarak*, then **E7** for the Eidi and **E2** | S2–S3 | later |
| MO1 | Monsoon rush · 1 Forecast, 2 Get ready, 3 Storm | – | – | **None**: calls on the beat and a rush | – | none |
| MO2 | Monsoon rush · 4 Dry off | during | Nani | Optional: PH *Are you cold?* → *Ha!* / *Na* | S4 | optional |
| MO3 | Monsoon rush · 5 Chai and a story | before the chai | Nana, Ma | **E4** *Tu muke chai banai dinda?* → *Ha!*. Heard small talk *Warsaad band thai vyo*. "How was it?" belongs to the mode | S4 | later |
| SN1 | Snap · 1 Shot list to 4 Develop | – | – | **None** (2 Set off: *Hal mu saathe* heard, optional) | – | none |
| SN2 | Snap · 5 Show the family | after each hand-over | Nana, Ma | **T4** on a print: *Ker ai?* (who's this?, to confirm) → a name. Then **E7** | S3–S6 | later |
| SN3 | Snap · 6 The album | – | – | **None** | – | none |

### 7.6 The hub and the world

| # | Where | When | Speaker | Exchange | Stages | Priority |
|---|---|---|---|---|---|---|
| HB1 | The hub, at session start | before | Whoever is home | E1 (the day's first visit) or E3 | S1–S6 | later |
| HB2 | Kasuku, idle | idle | Kasuku | Echoes a reply the child has used (heard). Optional: Kasuku asks *Tu ki aiye?* and the child may answer, ungraded (Q10) | S1–S6 | optional |
| HB3 | Grandparent mode | any | Nani (real) | Any exchange, with Nani reading the line | S1–S6 | later |

### 7.7 The story arcs and chapters

| # | Arc · chapter | When | Speaker | Exchange | Stages | Priority |
|---|---|---|---|---|---|---|
| A1.1 | Arc 1 · The guests are coming | the first launch; the fruit bowl's stall | Nani, the fruit seller | FL2–FL8; at the stall FI3 (E1, E3 formal) | S1 | **MVP** (via the first launch) |
| A1.2 | Arc 1 · **Knock knock** | before each guest | Guests | TI2's chain: *Ker ai?* → a name, E1, E3 by register, E8 | S2 | later (the first chapter after the first launch) |
| A1.3 | Arc 1 · The cat and the sweets | serving the mithai | Guests, Nani | The child *hears* refusals (*Na, na khape*, *Muke {x} khape*). E6 from Nani to the child. At S3, the child offers *Anke kuro khapeto?* | S2 | later |
| A1.4 | Arc 1 · The spill | after the spill; Big Ma's room | The guest, Big Ma | T12 PH *Sorry* → *It's okay*. T5 PH *Can you help me?* → *Ha!* | S2 | later |
| A1.5 | Arc 1 · **Eid morning** | greeting the elders | The elders, Big Ma | PH *Eid Mubarak* (F71), then **E3 with every elder formal**. This is the S2 finale: the register choice is graded all morning. Then E7 for the Eidi | S2 | later (high) |
| A2.1 | Arc 2 · The invitation | at each door | Relatives | T4 kinship titles (E85–E102, PH), *Ker ai?* | S3 | later |
| A2.2 | Arc 2 · Outfits | at the stalls | Shopkeepers | E1, E3 (formal), E7 | S3 | later |
| A2.3 | Arc 2 · Mehndi night | idle | Aunties | T9 likes (PH), E6 | S3 | optional |
| A2.4 | Arc 2 · The gift | asking each relative | The child → relatives | **T13 + T9**: the child asks each relative their favourite colour (F35 PH), with the right register | S3 | later |
| A2.5 | Arc 2 · The feast | serving | The child → guests | **T13 + T6**: *Anke kuro khapeto?* to elders, *Toke …* to cousins. Refusals. "More?" (*wadhare?*, to confirm) | S3 | later |
| A3.1 | Arc 3 · Clouds coming | before | Nana | T10 weather (G7 PH) | S4 | optional |
| A3.2 | Arc 3 · The leak | during a lull | Nani | T5 PH *Can you help me?* → *Ha!* | S4 | optional |
| A3.3 | Arc 3 · The animals | – | – | **None**: animals don't talk | – | none |
| A3.4 | Arc 3 · **Nani has a cold** | before the clinic | The child → Nani | **T13**: *Aai ki aayo?*, and for once she's *not* fine (G112 PH). Then CL1 at the clinic | S4 | later (high) |
| A3.5 | Arc 3 · Chai together | the payoff | The child → Nani | T6: the child offers Nani chai (formal). E7 | S4 | later |
| A4.1 | Arc 4 · It's gone | before the search | Nani | T8 *Kida wo?* → *{place} je mathe wo* (§20, R4) | S5 | later |
| A4.2 | Arc 4 · Who saw it? | asking around | The child → relatives | T13 *Kida wo?*; answers about people with *e achi vyo / vya* | S5 | later |
| A4.3 | Arc 4 · Following clues | – | – | **None**: a search | – | none |
| A4.4 | Arc 4 · Footprints | – | – | **None**: a trail | – | none |
| A4.5 | Arc 4 · The crow | the trade | The child → the crow | T6: *Hi … khan!* (take this, §9), a comic trade; E7 | S5 | optional |
| A5.1 | Arc 5 · The old trunk | each photo | Nana | T4 *Ker ai?* on old photos → names (Nana, young!) | S6 | later |
| A5.2 | Arc 5 · The journey | on the bus | A stranger | E1, E3 formal; T10; *achindo* | S6 | optional |
| A5.3 | Arc 5 · The farm | arriving | The farmer (a stranger elder) | A full chain: E1 → E3 → T5 (help pick) → E7 → E2 | S6 | later |
| A5.4 | Arc 5 · Nana's stories | after each story | Nana | T8 in the past, the child answering | S6 | later |
| A5.5 | Arc 5 · **The family photo** | before the photo | Everyone | **The finale**: the child runs the whole visit's talk (R5, spoken), greeting each elder formally, asking, thanking and saying goodbye | S6 | later (high) |

**Count.** The map has **94 rows**. **68 are conversation moments**:
- 15 are MVP (FL2, FL4, FL5, FL7, FL8; CK1, CK2, CK7, CK9, CK11; CL1, CL2, CL3, CL9; A1.1);
- 39 are later;
- 14 are optional.

The other 26 rows are deliberately **none**, each with its reason: a timer, a listening job, the mode already owning that talk, or a clean screen.

**Two modes fold in.** The Roadmap's **At the door** (mode 5) becomes TI2's chain inside the Knock knock chapter. **Ask around** (mode 6) becomes this module's R5 run as a sequence (A2.4, A4.2, with the notebook). Neither needs its own code.

---

## 8. Data model sketch

### 8.1 Files

| File | Holds | Owner |
|---|---|---|
| `data/conversations/lines.json` | Every line: Kutchi, English, source, status, audio chunks, picture | Foundation |
| `data/conversations/exchanges.json` | The exchange definitions (types, turns, answers, rungs, stages) | Foundation |
| `data/conversations/chains.json` | Scripted and generated chains (arrival = salaam → how are you → request) | Foundation |
| `data/conversations/speakers.json` | The roster (§6.4) | Foundation |
| `data/conversations/placements.json` | The map's rows as data: `{mode, where, slot, speakers, exchanges, stages, p}` | Foundation; modes propose rows in their build logs |
| `js/shared/conversations.js`, `css/shared/conversations.css` | The module: pure half + bubbles | Foundation (`js/shared/`, like `say.js`) |

### 8.2 A line

```json
"howareyou-child": { "k": "Tu ki aiye?",  "en": "How are you?",  "src": "§21, §27 B43", "status": "family",
                     "audio": ["fam:tu-ki-aiye"], "pic": "q-wellbeing" },
"fine":            { "k": "Aau theek ai.", "en": "I'm fine.",     "src": "§27 B43",      "status": "family",
                     "audio": ["fam:aau-theek-ai"], "pic": "thumbs-up" },
"fine-ask-elder":  { "k": "Aau theek ai. Aai ki aayo?", "en": "I'm fine. And how are you?", "src": "§21, §27",
                     "status": "family", "audio": ["fam:aau-theek-ai", "fam:aai-ki-aayo"], "pic": "thumbs-up-q" },
"fine-ask-child":  { "k": "Aau theek ai. Tu ki aiye?",  "en": "I'm fine. And how are you?", "src": "§21, §27",
                     "status": "family", "audio": ["fam:aau-theek-ai", "fam:tu-ki-aiye"], "pic": "thumbs-up-q" },
"make-x":          { "k": "{you} muke {x} banai dinda?", "en": "Can you make me {x}?", "src": "§27 B40",
                     "status": "family", "audio": ["{you}", "fam:muke", "{x}", "fam:banai-dinda"],
                     "whole": { "cook-chai": "fam:tu-muke-chai-banai-dinda" } },
"who-am-i":        { "k": null, "en": "Do you know who I am?", "src": "PH", "status": "placeholder", "audio": [] }
```

- `status` is `family`, `handout` or `placeholder`.
- `whole` names a whole-line clip that beats the chunks when it exists.
- A line is **playable** if every chunk has audio (a family clip or the stand-in voice), and **testable** only if every chunk is `family` (§5.2).

### 8.3 An exchange

```json
{
  "id": "wellbeing.howareyou",
  "type": "T3",
  "stage": "S1",
  "askers": ["elder", "peer", "child", "stranger"],
  "register": "by-asker",
  "turns": [
    { "who": "asker", "line": ["howareyou-child", "howareyou-ki-ai"], "vary": true },
    { "who": "player",
      "byStage": {
        "S1": { "answers": [ { "line": "fine", "correct": true, "words": ["conv-aau-theek-ai"] },
                             { "line": "bye",  "correct": false } ] },
        "S2": { "answers": [ { "line": "fine-ask-elder", "register": "formal",   "correct": { "asker": ["elder", "stranger"] }, "words": ["conv-aau-theek-ai", "conv-aai"] },
                             { "line": "fine-ask-child", "register": "informal", "correct": { "asker": ["peer", "child"] },     "words": ["conv-aau-theek-ai", "conv-tu"] },
                             { "line": "bye", "correct": false } ] } },
      "lookalikes": [["fine-ask-elder", "fine-ask-child"]] },
    { "who": "asker", "line": "fine", "when": "returned" }
  ],
  "react": { "right": "happy", "wrongRegister": "look-behind", "wrong": "tilt" },
  "rungs": { "max": 5, "speak": { "from": 4, "set": "answers" },
             "ask": { "line": { "elder": "howareyou-elder", "peer": "howareyou-child" }, "then": 2 } }
}
```

- `register` is one of:
  - `fixed`: no register choice;
  - `by-asker`: the reply must fit who asks;
  - `by-addressee`: at R5, the child's opener must fit who they talk to.
- `correct` is `true`, `false`, or a condition on the speaker (`asker` register). It's resolved at run time from `speakers.json`.
- `lookalikes` feed `WhichOne.candidates` so the formal/informal pair is always offered together, never one of them alone.
- `ask` is the R5 form: which opener fits which addressee, and which turn of the exchange follows.

### 8.4 Templating with the cast

| Token | Resolves to | From |
|---|---|---|
| `{you}` | *Tu* / *Aai*: the addressee's form (adults to the child: always *Tu*) | `speakers.json` `you` |
| `{toke}` | *Toke* / *Anke* | the same |
| `{ach}`, `{kar}`, `{vyo}` | *ach / acho*, *kar / karo*, *vyo / vya* | the addressee's (or, for *vyo*, the subject's) register |
| `{name}` | The speaker's name word (*kin-nana*) | `speakers.json` `name` |
| `{x}` | A word id from the host's context (the dish, an offer noun) | `ctx.x`. The display and audio come from the host's word table (`Cook.display`, `Lang`) |
| `{hakro}` | *hakro / hakri* by `{x}`'s gender (§2) | the word's `gender` field |

**The generator only produces a line whose chunks all exist** (the Roadmap's errand-pipeline rule). A template that would need an unrecorded chunk is dropped from `pick`, or plays with the stand-in voice as untested, never as invented Kutchi.

### 8.5 The API: how a mode asks for a moment and gets control back

```js
// A mode offers a slot and awaits. Control comes back when the moment ends, or at once if it declines.
const res = await Conversations.maybe({
  mode: "cook", where: "order", slot: "before",     // "before" | "during" | "after"
  round: roundId,                                    // for roundMoments / roundWords
  speakers: ["nana"],                                // roster ids on screen now
  busy: Cook.save.mode === "busy",                   // "during" is refused when true
  x: { dish: "cook-chai" },                          // template fillers
  anchor: (id) => S().headAt(id),                    // page px of each speaker's head (overlay.js anchors)
  character: {                                       // optional hooks, as in Say.moment; defaults = bubbles only
    talk(id, lineId) {}, mood(id, kind) {}, listen(id) {}, act(id, answerId) {},
  },
  container: document.body,
  rng,
});
// res = { ran: false, why: "off" | "cap" | "busy" | "no-slot" | "nothing-fits" }
//     | { ran: true, exchange, speaker, rung, len, firstTry, via, hints,
//         register: { asked, chose, ok }, moments: [/* Say outcomes */], words: [/* {id, kutchi, english} */] }

await Conversations.run("wellbeing.howareyou", ctx);   // scripted: story beats, the first launch (no caps)
Conversations.roundMoments(roundId);                    // → Stars.voice(...)
Conversations.roundWords(roundId);                      // → Results.show({ words })
```

**Pure half** (Node, for tests and the leak bot):
- `Conversations.pick(state, ctx, data, rng)` → an exchange and speaker, or null, applying the caps, variety, register balance and due list;
- `Conversations.rung(state, typeId)`;
- `Conversations.update(state, outcome, now)` → the new state (the up/down rules, spaced return, per-speaker memory);
- `Conversations.resolve(line, ctx)` → the Kutchi text and chunk list, or null;
- `Conversations.machine(exchange, ctx)`: the states `ask → reply → react → (next turn) → done`, with `tap`, `heard`, `pill`, `skip` and `timer` events, like `Say.machine`.

**Hooks into the shared modules:**
- **`say.js`** runs R4 and R5 when spoken: `Say.moment({choices: answerIds, mode: ctx.mode, expected, accept, character, grandparent, label})`. Before offering R4, `Speech.hasTemplates(answerIds)` must be true (the templates come from the lines' family clips via `Speech.loadTemplates`).
- **`whichone.js`**: `WhichOne.candidates(correctId, lookalikeGroups, {n, rng})` picks the distractors.
- **`stars.js`**: a new `rules.conversations` (`voiceMin 1`, `placeholdersTested false`).
- **`save.js`**: the `"conversations"` namespace.
- **`onboard.js`**: the first tap-tap, and the first mic.
- **`results.js`**: the words, through the host.

**Migration of what exists.** Three pieces of existing code switch to this module:
- **Cook's small talk.** `js/cook/flow.js` `exchange()` and `data/cook.json` `exchanges` (salaam, howareyou, canyou) become calls to `Conversations.maybe` at CK1, CK2 and CK9. The three definitions move to `exchanges.json`, and the counts move as in §5.2.
- **Find it's `greet`.** `js/find/mechanics/greet.js` becomes `Conversations.run("greet.salaam")`.
- **The clinic.** Its send-off goodbye (E3 in its design) calls this module's E2. The clinic keeps its own feelings (E1/E2) and D1's yes/no.

---

## 9. The MVP slice

### 9.1 Nine exchanges, fifteen placements, S1–S2

| Exchange | Type | Lines (source) | Placements | Rungs, length, register |
|---|---|---|---|---|
| **E1** `greet.salaam` | T1 | *Salamun alaykum!* → *Wa alaikum salaam!*; distractor *Achija!* (all hd) | FL2, CK1, CL1 | R1–R3; L1; fixed |
| **E2** `greet.bye` | T2 | *Achija!* → *Achija!*; distractor *Salamun alaykum!* (hd) | CL9 (and heard at CK9) | R1–R4; L1; fixed |
| **E3** `wellbeing.howareyou` | T3 | *Tu ki aiye?* ✓ / *Ki ai?* → *Aau theek ai.* ✓ (S1); + *Aai ki aayo?* ✓ / *Tu ki aiye?* ✓ (S2) (§21, §27) | FL8, CK1, CL1, CL2 | R1–R3; L1 → L2; heard → **choose** |
| **E4** `request.make` | T5 | *Tu muke {dish} banai dinda?* (✓ for chai) → *Ha!* ✓; distractor *Na.* ✓ (§27, §23) | FL4, CK2 | R1–R4 (*Ha* is one word); L1; fixed |
| **E5** `request.help-cook` | T5 | PH *Will you help me cook?* → *Ha!* ✓; the No bubble dodges | FL7 | R1; L1; untested until recorded |
| **E6** `offer.what-like` | T6 | *Toke kuro khapeto?* ✓ → *Muke {x} khape* / *Na, na khape*; the S2 trap is a bare *Na.* ✓ (§23, §1, §11) | CK11 | R1–R3; L1; fixed (the politeness is the test) |
| **E7** `thanks.welcome` | T11 | *Aabhar aanjo!* (hd) → *Jara e wandho nai* ✓ (§27); distractor *Achija!* | CK9, CL9 | R1–R3; L1; fixed |
| **E8** `kin.who-am-i` | T4 | PH *Do you know who I am?* → a name bubble with a face (*Nana, Big Ma, Ali*) | CL3 | R1–R2; L1; untested until recorded |
| **E9** `where.kida` | T8 | *{x} kida ai?* (§23, §15 order) → tap it; from R2 *Hida!* ✓ / *Huda!* ✓ (§23) | CK7 | R1–R4 (*hida / huda*: a set of 2); L1; fixed |

Plus heard-only lines: Kasuku's salaam (FL2), "Mmm, lovely chai! *Shabash, beta*." (FL5), and Nani's *Dhyan rakh!* ✓ (CK8).

**Out of the MVP** (the next slice, in order):
1. Find it's counter (FI3, FI6);
2. Knock knock's door chain (TI2 / A1.2);
3. Eid morning (A1.5);
4. the child asking (T13) at S3, starting with CK3 and CK16.

**Build order** (foundation files, then adapters; each step tested):
1. **The pure module and data**: `conversations.js` pure half, the five data files with the nine exchanges, and `build/test_shared_conversations.mjs`. The tests cover:
   - caps and variety;
   - up/down on seeded histories;
   - spaced return;
   - that every MVP line resolves to existing chunks;
   - a **leak bot** with the strategies *echo the question*, *first bubble*, *longest bubble*, *always formal* and *always informal*. Each must stay under 55% right on graded S2 register moments over 500 sessions (it's a two-way choice balanced 50/50, so chance is the floor; what matters is that no strategy beats it).
2. **The bubbles**: the browser half and CSS, with a lab page `lab/conversations.html` (any exchange × rung × speaker, a fake mic). Check it at 915×375, 1280×800 and iPad.
3. **Cook**: CK1, CK2, CK7, CK9 and CK11, replacing the small talk in `flow.js`, with the save migration and the voice star hook.
4. **The first launch**: FL2, FL4, FL5, FL7 and FL8, through `Conversations.run` on `first.html`.
5. **The clinic**: CL1, CL2, CL3 and CL9, through its stage files. Its goodbye speaking moment goes through E2.

### 9.2 The recording list for Mum's next session

These are only the lines the MVP needs that have **no family clip yet**. Mum says each **three times**, spread out, as she'd say it to a grandchild. Zafar adds **five takes** of the lines marked 🎤 (speech templates, speech plan). About 12 minutes.

**Group 1: Greetings (confirm the handout; they're already in the Questions doc as D5)**
1. *Salamun alaykum!* (as Nani greets a grandchild at the door)
2. *Wa alaikum salaam!* (as a child answers) 🎤
3. *Achija!* (bye: as a visitor leaving, and as the child's reply) 🎤
4. "Thank you!": *Aabhar aanjo!*, or however the family really says it (Q1)
5. Hello, as a cousin says it to a cousin, if it's different from the salaam (else skip)

**Group 2: How are you**
6. *Ki ai?* (how are you, informally, one cousin to another)
7. *Aau theek ai. Aai ki aayo?* as one natural line (a child answering Nana)
8. *Aau theek ai. Tu ki aiye?* as one natural line (a child answering a cousin)
9. *Aau theek ai.* in a man's voice (Nana answering back; Zafar, if no older man is to hand)

**Group 3: Requests and offers**
10. *Tu muke daar banai dinda?*
11. *Tu muke maani banai dinda?*
12. *Tu muke chaat banai dinda?* · *Tu muke samosa banai dinda?* · *Tu muke mishkaki banai dinda?* (or say "*Tu muke* … *banai dinda?*" once with a gap, so the dish can be dropped in: Q5)
13. *Muke chai khape.* · *Muke paani khape.* · *Muke dudh khape.* (the child answering *Toke kuro khapeto?*) 🎤
14. *Na, na khape.* (the polite no, as a child says it) 🎤
15. *Chamchi kida ai?* · *Cup kida ai?* (Nani looking for something)

**Group 4: New lines in English (Kutchi needed; the first launch's list already has 16–17)**
16. "Will you help me cook?" (first-launch line 8)
17. "Yes, I'll help you cook." (first-launch line 9)
18. "Do you know who I am?" (said to a grandchild: as Nani, and as Nana would say it)
19. "Nana!" · "Nani!" · "Big Ma!" · "Ali!" (called out, as the answer to "who am I?"). What does a child really call Big Ma (E89)? 🎤
20. "Mmm, lovely chai! *Shabash, beta*." (first-launch line 3)

**Next session, not needed for the MVP:** "Can you help me?", "Are you cooking today?", "Sorry" / "It's okay", "Eid Mubarak" (F71), "I don't feel well" (G112), "I like chai" (C94), and the kinship titles (E85–E102).

---

## 10a. Zafar's decisions (26 Sept). These override the defaults below and anything above that disagrees.
1. **Thank you:** the family says the English **"thank you"**. Not *aabhar aanjo*.
2. **Goodbye:** ***khuda-fis*** (*khuda hafiz*). Not *achija*. Hello stays *salaam*.
3. **Which "you":** ***aai*** for **everyone older**, including older cousins. ***tu*** for the same age or younger.
4. Nani and Nana: the same respect form (default kept).
5. **Recording:** Mum records the **common whole phrases**. Everything else is **built from modular chunks**: smaller phrases or single words, joined by the game.
6. Register is graded from S2 and spoken from S3: **yes**.
7. A spoken reply can earn the round's voice star: **yes**.
8. **The wrong-register reaction:** no "looks behind him" joke. Nana (or whoever is spoken to) gives a **gentle head scratch or embarrassed look**, **cycling through 3–4 different "that's not quite right" expressions** so it doesn't repeat. Still no negatives mid-round; it's recorded for the end review.
9. **Frequency:** **one conversation per game mode**, plus **one every 2 minutes** on top. Tune after playtesting. The parent setting stays.
10. **Kasuku:** only repeats words, for now.
11. **The model voice for the child's replies:** **Zafar's voice if the player chose a boy, Mum's if a girl** (from character creation), for now.
12. **Isa:** only talked about, never talked to: **yes**.

## 10. Open questions for Zafar (answered: see 10a)

Defaults are in bold. The build takes the defaults.

1. **Thank you.** Does the family say *Aabhar aanjo* (the handout) or the English "thank you" (as in *na, thank you*, §23)? **Default: *Aabhar aanjo* until Mum says.**
2. **Greetings.** Is *Salamun alaykum / Wa alaikum salaam* the family's everyday hello, and *Achija* the everyday bye (both from the handout)? **Default: yes, pending D5.**
3. **Which "you" for whom?** A child to Ma (their own mum), to an older cousin, to a shopkeeper. **Default: *aai* for every adult, *tu* for children and cousins.**
4. **Nani and Nana.** Do they get the same respect form? §21 says it's the same for a man or a woman. **Default: yes.**
5. **Templates.** Can *Tu muke {x} banai dinda?* and *{x} kida ai?* take any noun (recorded as chunks), or record each whole? **Default: whole lines for the MVP's five dishes, chunks later.**
6. **Timing.** Register graded from S2 (the end of Arc 1, Eid morning) and spoken from S3 (Arc 2). **Default: as written.** Too early or too late?
7. **The voice star.** May a conversation's spoken reply earn the host round's voice star (it can never lose it)? **Default: yes.** Ear and badges are untouched.
8. **Frequency.** At most 1 per round and at least 90 s apart, with a parent setting (Often / Sometimes / Story only / Off). **Default: Sometimes.**
9. **The wrong-register joke.** Nana looks behind him for the child you're talking to. Warm, or too cheeky? **Default: keep it.**
10. **Kasuku.** May the parrot hold tiny ungraded exchanges in idle moments, or only echo? **Default: echo only for the MVP.**
11. **The model voice.** At rungs 1–3, whose voice plays the child's chosen reply? **Default: Mum's.**
12. **Isa.** He's a baby, so he's talked *about* (who's this?), never *to*. **Default: yes.**
