# Find it: design (the next mode after Cook with Nani)

**Date:** 24 Sept 2026
**Status:** proposal for Zafar. **25 Sept: first playable slice on its own branch, for Zafar's review** (not live): `find.html` + `js/find/` + `data/find.json`, the engine (rows as data, relations as data, levels as data, the Search lab with the non-speaker bot) and M1 Nani's list with M5 Check the bag, in the bazaar with placeholder art. **Later on 25 Sept it moved onto Cook's calm sidebar (Wave 5A):** Nani's list comes up big as the intro card and flies into the sidebar; one row and one dot per thing; the goal behind "?"; Nani says less (new words are still taught with the twinkle); the result card is the word review; no coin/star counter (pocket money on the title and result card); the combo rises from the basket; Done and the rail (with zoom) are pinned to the sidebar's foot so zoom never falls off a phone. Tests: `build/test_find.py` (play) and `build/test_find.py --leak N` (the bot). It builds on `docs/game-modes-v2.md` (mode 2, *Find it*), `docs/cook-with-nani-phase-a-design.md` (the shared systems and the station library) and `docs/cook-with-nani-kutchi-audit.md` (the leaks).
**Placeholder rule:** Kutchi below is limited to words and frames already in `data/content.json` or `data/cook.json`. Anything written like `[EN: under]` has no Kutchi yet. In the game it is an English placeholder in grey italic until the family gives the word. **Never invent Kutchi.**
**25 Sept, later:** the deep dive at the top (mini-games, one-file mechanics, speaking moments, a build brief at the end) **supersedes sections 3, 5.4 and 7 where they conflict**; D9 lists the patches.

---

## Deep dive, 25 Sept 2026: mini-games and mechanics

**Why this section.** Zafar's principles of 25 Sept (`docs/modes/DEEP-DIVE-BRIEF.md`): each mode is a set of mini-games built from one-file mechanics, speaking is core, and every mode is built at once. Find it is the one mode with a live slice (`find.html`, `js/find/`, `data/find.json`: the engine, M1 Nani's list with M5 Check the bag, the Search lab, the non-speaker bot at 3.3%), so this section designs around what's built and says exactly what changes. The only Kutchi it relies on is what exists: the fruit, vegetable and spice drafts, numbers 1–10, *vadho / nindho* (big / small, drafts), *Muke {x} khape, Ne {x}, Nar {x}* (a draft), *Ghan, Arre re!, Hedo!, Achija*. Everything in `[EN: …]` is a placeholder.

### D1 Pitch, and the kinds of round

**Pitch.** Someone says, in Kutchi, what to find and where; you look round a real place (a stall, Nani's sitting room, the courtyard) and tap the one they meant, among copies, look-alikes and clutter. Then you swap places: you say it, and Ali or Nani goes and finds it.

**The backbone.** One engine (a row is `{noun, count?, size?, colour?, where?, not?}`, an item records its relations, `Find.matches` decides) and four kinds of round, which differ in who speaks, how much the phrase carries and how the round ends.

| Kind | What happens | Who speaks | What the Kutchi decides | Ends with | Mini-games |
|---|---|---|---|---|---|
| **R1 The list** | Nani's rows are on the ladder up front; find them all, any order; press Done | Nani, before | Noun and count; from level 2 a size or colour on a row | Done (over and under graded), then the shopkeeper's bag | Nani's list, Which one? |
| **R2 The calls** | One thing at a time, live, 4–6 calls, repeats allowed (*the cup again; the other one*); the called noun is in three or more places, so only the position decides | Nani (Big Ma in her room), during | Noun plus where, size or colour, per call | The last call, then the bowl | Where is it?, Kasuku's minute |
| **R3 The trail** | Things hidden behind openables; a call names the openable; each find gives the next clue | Nani, and the cats' noises | Which openable | All found; the sweet box goes to Tidy up | Simba's mischief |
| **R4 Your turn** (role reversal) | You can see it; you say it; a character acts on what you said | **The child** (closed set of 3–8) | What the child says | The character has it right; you check their bag | Ali's turn, the bowl, Tell Ali where |

Two modifiers sit on any kind: **the torch** (dark, a beam, a battery) and **Busy** (the patience ring). "Which one?" is not a kind: it is what a row carries from level 2, and the mini-game of that name is R1 with one qualifier on every row.

### D2 The mini-game library

Scored 1–5. **Build:** 5 = cheap. Mechanics are named in D3.

| # | Mini-game | How it plays | Fun at 5 | Fun at 11 | Forces Kutchi | Distinct | Build | Mechanics | Decision |
|---|---|---|---|---|---|---|---|---|---|
| **F1** | **Nani's list** (+ Check the bag) | The built slice: the list, the busy stall, Done, the shopkeeper's one mistake; now ending with the bowl (D4) | 4 | 2 | 5 | 2 (Cook's fetch on a bigger stage; the review is right) | **5** (built) | greet, spot, count, passme, warmer, bag, tell | **First set** (built; changes in D5) |
| **F2** | **Which one?** | Every row carries a size (*vadho / nindho*) and the stall has the noun in both sizes, and another noun in both sizes too; later colours in Big Ma's box (F11) | 4 (Simba is the big one, Zazu the small one, a running joke) | 3 | 5 | 3 (the shared "which one?" decision, rendered as search) | 4 (the same picture at two scales) | spot, count, whichone | **First set** (the review's next slice) |
| **F3** | **Where is it?** | R2 calls: *[EN: the orange, in the crate]*; the orange is in the crate, on the counter and in the basket; four to six calls, the same noun called to two places | 4 | 3 | 5 (only the position separates the copies) | 4 (positions found, not placed) | 3 (the bazaar has in/on/in-front today; under/behind need a scene with cut-out occluders) | where, spot, warmer, tell | **First set** as a greybox; Kutchi-real when A5 returns |
| **F4** | **Ali's turn** (you're Nani) | You hold a picture list; you *say* it; Ali shops; you check his bag | 4 (with a parent) | 4 | 5 (production) | 5 (the only production-first search) | 3 (`speech.js`; Ali is a face and a hand at the stall) | tell, bag | **First set** |
| **F5** | **Simba's mischief** | The cats hid the sweets; calls name openables; a tail, a bell, paw prints as clues (not always right) | **5** | 4 | 5 | **5** | 2 (8–12 openables per scene, cat frames, sweets art, sweet names) | where, open, trail, spot | Phase 3: the Ch3 flagship |
| **F6** | **Torch** (a modifier) | A power cut; a beam follows the finger; sweeping blind runs the battery down, the position phrase saves it | **5** | 4 | 4 | 5 | 4 (a radial CSS mask and a bar) | torch | Level 3 free play; Arc 3 story |
| **F7** | **Kasuku's minute** | Kasuku squawks the player's five weakest words, no list text; find them in 60 s | 3 | 3 | 5 | 3 | **5** | spot, shadow | The mode's **60-second round** for the one hub daily |
| **F8** | **Tell Ali where** | You see the cap under the sofa; you say *sofa [EN: under]*; Ali goes and looks there | 3 | **5** | 5 | 5 | 3 | tell, where | Level 3 of F3, once positions exist |
| **F9** | Spot the change | Lights flicker; tap what changed; choose by ear which sentence says what happened | 4 | 4 | 3 (spotting is visual; only the sentence is Kutchi) | 3 (Who did it? owns "what happened") | 3 | change | Arc 4 |
| **F10** | Nani's day | The same courtyard at three times; the time word picks the view | 3 | 3 | 3 | 3 | 2 (three grades of every scene) | where | Arc 3, art budget allowing |
| **F11** | Big Ma's box | F2 by colour (*[EN: the red thread]*), a T-camera close-up | 3 | 4 | 5 | 3 | 3 | spot, whichone | F2's second home, Ch4, after E60–E71 |

**Rejected:** *Who has it?* (Who did it?'s W2 territory; the review agrees); *Photo* (Snap's); *Find the pair* (*bo santra* already is it: a count row in a hat); *Follow the bell* (sound localisation, no Kutchi in the decision); *Bazaar run* as its own game (it is F1 at level 4, Busy, across two stalls); *Kasuku's riddles* (needs family-written rhymes; never invented).

### D3 The mechanics

One file each, `js/find/mechanics/<id>.js` unless shared, levels as data in `data/find.json` `mechanics.<id>.levels`, runnable alone in the Search lab or inside a mini-game (`js/find/games/<id>.js`, the counterpart of Cook's `stations/`).

| id | One line | Tag |
|---|---|---|
| `spot` | Find one thing in a panned scene: the padded hit box and snap, wiggle and recast, the arc into the carried container, the "tapping everywhere" pause. Today inside `round.js`; moves out | **New** |
| `count` | Units into the container: the tally only (never the target), never ends by itself, graded at Done | **Reused from Cook** (the spoon count's rule and badge; units are items) |
| `bag` | The odd one out in what someone packed for you; hand it back and they swap it. Today inside `list.js` | **New** |
| `greet` | The salaam exchange at the stall | **Reused from Cook** (`exchanges.salaam`, `UI.choose`) |
| `passme` | Nani calls from the doorway for a met word that isn't on the list | **Reused from Cook** |
| `warmer` | The "?" hint: a third of the scene that still holds three or more candidates. Today inside `round.js` | **Shared with Tidy up** (its Warmer: the same band-and-candidates rule over `Rel.options`) |
| `whichone` | Rows with an attribute and the decoy rule (the noun in every value, the value on two or more nouns, balanced) plus the blind-odds budget | **Shared** (foundation module, with Dress up, Snap, Who did it?, Tidy up); until it lands, `Find.makeWants` does size locally |
| `where` | A row or call with a position: the noun in three or more (relation, anchor-word) places; anchors qualified from level 4; **matching by anchor word, not anchor id** (two crates are both "the crate" until level 4 says which). On the shared relations layer | **New** |
| `open` | Openables with closed and open frames; a wrong open is a miss for the row; empty ones still react | **New** (offered to Who did it? for W4's peek) |
| `trail` | A find reveals the next call: a tail, a bell, paw prints that lead to a cat, not always to the sweet | **New** |
| `torch` | The darkness mask, the beam under the finger, a battery the position phrase saves | **New** |
| `tell` | Role reversal on `Speech.listen({choices, timeoutMs})`: a character acts on the choice; pills fallback; parent ✓; the voice star | **Shared with every mode** (Find it builds it first, against the foundation's `js/shared/speech.js`) |
| `shadow` | Kasuku repeats: record, play back beside the family voice, ungraded | **Shared with every mode** |
| `change` | Something in the scene changes; choose by ear which sentence says what happened | **New** (Arc 4) |

**Counts:** 7 new, 3 reused from Cook, 4 shared. Not mechanics: pan and zoom (`view.js`), the ladder, the stars, the lab, the bot.

### D4 Speaking moments

Designed against `Speech.listen({choices, timeoutMs}) → {choice, confidence} | null`. Rules for every moment: the closed set is what is on screen (3–8 ids); the character **acts on whatever came back**, so the child sees what they said; a wrong act gets one retry (*Nar!* and the character puts it back), then the pills; `null`, a timeout (4 s) or a confidence under `voice.minConfidence` (data, default 0.5) goes to the pills; a parent ✓ button exists in Grandparent mode; nothing ever waits on the microphone; the **voice star** is separate from the ear star and appears only in rounds with a speaking row (every speaking row recognised or ✓'d, no pills; `pay.voice` +4); recordings stay on the device.

| Moment | Where | Closed set | What the character does | Fallback | Level |
|---|---|---|---|---|---|
| **1 The bowl** (*Nani's hands are full*) | The end of Nani's list, and the old fruit-bowl errand once it is on this engine (Q1) | The basket's kinds, padded with stall decoys to at least 3, at most 8 | Nani takes the named thing from the basket and puts it in the bowl; a wrong name and she holds up the wrong fruit, puzzled | Audio pills (text only at reads stage 3); parent ✓ | **1** |
| **2 Ali's turn** (F4) | Ch2 onwards; free play | The stall's kinds (5–8); then, a second `listen`, the numbers 1–4 | Ali walks to the stall and picks what he heard, as many as he heard, then packs your bag; you check it | Pills; parent ✓ | **2** |
| **3 Tell Ali where** (F8) | The sitting room | The recorded phrases of the copies on screen (3–5: *sofa [under]*, *table [on]*…) | Ali goes to that spot and looks; if it's empty he shrugs and you say it again | Pills; parent ✓ | **3**, once A5 exists |
| **4 Kasuku repeats** (`shadow`) | Any scene: tap Kasuku | None (no recognition) | He "says it back" in the child's own voice, beak moving | Not needed | Any; ungraded |

The Sceptic on speaking: she can't say the word; the pills are one in *n* and never earn the voice star; the parent ✓ is trust, by design.

### D5 The first set, and the level ladder

**First set: F1 (built, with the changes below), F2, F4, F3 as a greybox, and F6 as the level-3 modifier.** F1 and F2 are a Kutchi test today (fruit, numbers, *vadho / nindho*); F4 is the speaking moment and turns F1's engine round with almost no new art; F3 is the mode's S2 job and the relations layer's first customer, so its greybox should be waiting when the family's position words land; F6 costs a CSS mask and makes the same scene feel new at 11. F5 waits for openables, cats and sweet names, and is the Ch3 flagship of phase 3.

**What changes in the live slice:**

1. `list.js` splits into `mechanics/spot.js`, `bag.js`, `where.js` and `games/list.js`, `games/whichone.js`, `games/where.js`, `games/ali.js`; `gen.js` keeps `makeWants` until `whichone` lands.
2. **The digit leak** (the review's High): `round.js` `decorate` shows a row's digit while the number word is at stage < 3, but stage-2 rows are tested. Change to **stage ≤ 1** (taught, not tested). The bot reads the digit, so `--leak` shows the difference.
3. The listening recall of 5.4 becomes speaking moment 1 (the bowl).
4. A level 4, and per-game leak checks in the lab.
5. Where-rows match by anchor word (D3).

| Level | Name | What the instruction carries | Rounds and games | Scene |
|---|---|---|---|---|
| **1** | *One thing* | Noun and *hikdo / bo*; two rows; the bowl (say two or three nouns) | R1 F1; R4 the bowl | One stall, at most 11 things |
| **2** | *How many, which size* | Count 1–4; one size row; a *Nar X* row half the time; the bag can hold one too many | F1, F2, F4 (say a noun and a number) | One stall, at most 17 things, both sizes out |
| **3** | *Where* | A position on the call (*santra, crate [in]*), the noun in three places; two stalls (pan); the torch in free play | F3 calls, F8, F6 | At most 22 things, three or more relations |
| **4** | *Two things at once* | Size and where, colour and where; anchors qualified (*[EN: the big basket]*); *[EN: not that one, the other one]*; calls chained with *ne poi*; Busy | All | The sitting room; openables (F5) |

A child feels it as: *she names it → she says how many and which → she says where → she says two things and I do them in order → I say it.*

**Blind-bot estimates at level 1** (the strategies live in `bot.js`, which sees only the screen):

| Game | Estimate | New bot strategies |
|---|---|---|
| F1 | **3.3% measured** (the review's figure, 20-round runs); lower at stage 2 after the digit fix | — |
| F2 | The noun (1 in 4–5 kinds) × the size (1 in 2) × the count: about 1 in 25 per row; two rows about 0.5%; then the bag | bigger, smaller, odd-size |
| F3 | Per call: 1 in the kinds × 1 in 3 copies, about 10%; four calls under 0.1% | most-visible copy, nearest copy, first copy left to right |
| F4 | No Kutchi, no voice; pills 1 in 6 × 1 in 4 per row; never the voice star | pills-random |

### D6 Story homes, and free play

| Mini-game | Story home |
|---|---|
| F1 Nani's list + bag | Arc 1 Ch1 (built); Arc 2 *Outfits* and *The gift* (threads, bangles, later prices); Arc 4 *The crow* (something shiny) |
| F2 Which one? | Ch1's second visit (*[EN: the big papaya]*); F11 in Ch4 *The spill* (Big Ma's box) |
| F3 Where is it? | Ch5 *Eid morning* (Nana's cap, the Eidi envelope); Arc 3 *The animals* (the chicks); Arc 4 *It's gone* (the dressing table) |
| F4 Ali's turn | Ch2 *Knock knock*: Ali arrives and is sent back for what's missing; you tell him (this replaces the old Q6 "cousin's lost cap" idea) |
| F5 Simba's mischief | **Ch3 *The cat and the sweets*** (the flagship) → Who did it? → Tidy up; Arc 4 *Following clues* |
| F6 Torch | Arc 3 *The leak* (the power cut); free play from level 3 |
| F7 Kasuku's minute | The hub's one daily, when it rotates to Find it |
| F8 Tell Ali where | Ch5, after the cap is found: Ali lost his; Arc 4 *Who saw it?* |

**Free play:** *The bazaar*: an endless stall built from due and weakest words, a best combo, the torch after level 3, Ali's turn every third list. Plus the 60-second round (F7) as the mode's entry in the hub daily.

### D7 The review's critiques

| Critique | What I did |
|---|---|
| Thin at 11: M1 is Shopping rebuilt | F4 (speaking), F2, the torch modifier and level 4 (two slots, Busy, two stalls) are in the first set; F5 in phase 3 |
| The "small number beside each row" may be a High leak | Confirmed: it's the count's digit at stage ≤ 2, and stage 2 is tested. Fixed to stage ≤ 1 (D5). The `×n` tally is the basket, not the target: fine |
| Identity is M4 and M8, which come last | The torch is in the first set; the trail waits on art and words, not on design |
| Next slice should be M3 size, not M2 | Adopted: F2 is second; F3 is a greybox until A5 |
| Adopt Wave 5A's sidebar first | Adopted: phase 0 is pure logic and needs nothing from it; phase 1's greybox waits for the frozen API |
| Find it should own the relations file | **Superseded by the deep-dive brief:** the foundation agent owns `data/relations.json`, `js/shared/rel.js` and the `spots` schema. Find it hands over its schema as the seed (`spots[].{anchor, rel, x, baseline, also}`) and keeps matching on `item.rel` locally until `rel.js` lands |
| "Which one?" needs one shared module | Adopted: `whichone` is the foundation's; Find it's decoy rule and F2's size rule are its spec |
| Panning scenes, occluders, openables, 375 px | First set stays in the built bazaar plus a sitting-room greybox; openables are phase 3; Q5 defaulted to pan with zoom, tablet-first |
| Six dailies | F7 is the mode's 60-second round for the one hub daily |
| Q1 fruit bowl onto the engine | Default yes; its bowl-fill is speaking moment 1 |

### D8 Words needed, in priority order

*In the Questions doc* means it is already asked there (`Questions for Mum (Combined, for the visit)`); nothing here edits that doc.

| Priority | Words or frames | Status |
|---|---|---|
| 1 | Fruit and numbers 6–10 confirmed | In the doc: E103–E123 (drafts exist) |
| 2 | *Big / small* with a noun and "the big one", agreement | In the doc: C22–C36, C49 (*vadho / nindho* drafts exist) |
| 3 | *Not the X*, *not the red one* | In the doc: A4, C43 (*Nar {x}* is a draft) |
| 4 | Positions: on, under, in, behind, next to, in front of, between; and whether the anchor changes shape before them | In the doc: A5, E1–E13, C12–C21 |
| 5 | Household anchors: sofa, table, cushion, curtain, cupboard, shelf, basket, box, crate | In the doc: E16–E48 (**crate** is new) |
| 6 | Finding phrases: *Find the…, Here it is!, Look!, Leave that one, Bring it here, Nearly!, Where is it?, Which one?, How many?, this one / that one, here / there* | In the doc: E73, E77–E80, E84, A8.5–A8.7, A8.10–A8.11 |
| 7 | Telling someone what to do (*bring, look, put*) for Ali's turn | In the doc: C142–C151, E72, E75 |
| 8 | *[EN: What did you bring?]*, *[EN: the other one]*, *[EN: the same]* | **New** (H5 has *the same*); the first two are not asked |
| 9 | Colours | In the doc: E60–E71 |
| 10 | Sweet names, *Simba took it* | In the doc: E59, A6 |
| 11 | **For the recogniser:** the fruit, the numbers 1–4 and *vadho / nindho* said five times each by three or more family members | **New**: a recording instruction, not a word |

### D9 Decisions for Zafar (only what blocks the build)

1. **The fruit-bowl errand moves onto this engine**, and its bowl-fill becomes speaking moment 1. Default: **yes**.
2. **Does a parent's ✓ earn the voice star?** Default: **yes**, in Grandparent or with-a-parent mode only; the pills never do.
3. **Ship size rows on the draft form** (*vadho santra*) before C22–C36 confirms agreement? Default: **yes**, flagged as a draft in the row and re-recorded when the answer comes.

**What changed below:**

| Section | Change |
|---|---|
| 2.2 library | M1–M12 stand as history; D2 is the scored list; M10 and M11 stay rejected; M12 is now core (F4, F8) |
| 3 first set | Superseded by D5 (F1, F2, F4, F3 greybox, F6) |
| 5.4 recall | The listening recall becomes speaking moment 1 |
| 7 questions | Q1, Q5, Q6 answered by default (D7, D6); Q2 and Q3 defaulted as the review says; Q4 yes (Kasuku speaks only in his own minute); Q7 stands |
| Build brief | Added at the end (phased, own files first) |

---

## 1. The core loop, and how it fits with Cook

**The loop (one round, 1–3 minutes).** Someone sets a task in Kutchi: Nani's list, the shopkeeper, or Nani asking where Simba has put the sweets. The task shows up as rows on the mission card (the order ladder). You look around a detailed, eye-level scene (drag to pan, on-screen buttons to zoom). You tap the thing you think was meant. If you're right, it arcs into your carried container (basket, tray, sweet box) and the row ticks. If you're wrong, the item wiggles, Nani says "Arre re!", tells you what you tapped and says the target again, and you try again. The difficulty comes from **which one**: there are look-alikes, duplicates in different places, other colours and other sizes. Only the Kutchi settles which one was meant, so finding things isn't hard in itself. At the end Nani asks for each thing back from the basket (the Game Design doc's recall step), stars fill, pocket money is paid, and the scene comes back later with new rows and a twist (a modifier).

**Why it's a different game from Cook.**

| | Cook with Nani | Find it |
|---|---|---|
| Core verb | **Build**: gestures in a sequence (pour, roll, flip, stir) | **Search**: scan, then tap. The only gesture is a tap (plus pan and open) |
| Camera | Straight down on a worktop, hands in frame | Eye level, looking into a room, stall or courtyard |
| What the Kutchi decides | What goes in, how many, in what order, for whom | **Which one, and where**: noun, count, position, colour, size |
| Where the fun comes from | Tactile juice, timing tension, the Simon-style memory of an order | The "found it!" moment, curiosity (everything reacts to a tap), combos, getting to know a scene |
| Syllabus weight | S1 nouns and numbers, S2 verbs, S5 first/then | S1 nouns and numbers, **S2 positions and colours**, then S4 animals and S5 past-tense clues |

**What it reuses (built once for Cook, used as they are):**

| Shared system | How Find it uses it |
|---|---|
| **Word pill** (full, item label, choice) | Full pill for the task line and list rows. Choice pill for "pass me" and the audio-choice questions. **Item labels are not used in the scene** (see section 5): in a search game they are the answer |
| **Order ladder** | Nani's list: one row per item, `speaker · dots · reveal · translate`. One dot per *item*, never per unit. Rows in random order. "Not the X" rows look the same as the others |
| **Three stars** shown as they happen | Ear = understood; **sharp eye** (this mode's own icon, a magnifier) = spotting skill; lightning (Busy) or tick (Relaxed, no help) |
| **Pocket money receipt** | 5 for helping, +5 ear, +3 sharp eye, +3 lightning or tick, a combo bonus, upgrades. Money is never lost |
| **Pass me** interrupt | Nani calls from the doorway mid-search: *Hedo! Muke hikdo {X} dine.* X is a word you've met that **isn't on the current list**, chosen from a look-alike group. This is spaced review |
| **Hints cost stars** | The same rules as the audit fixes: hearing it again costs tick; being shown costs ear (section 5) |
| **Levels as data** | `data/find.json`: `mechanics.<id>.levels` knobs (decoys, duplicates, clutter, pan width, list length, which kinds of qualifier are allowed). Scenes as data (anchors, hide spots, openables) |
| **Station lab** becomes the **Search lab** | Runs any mechanic on any scene with a random round, level buttons, a "Nani helps" tick and a **non-speaker bot** toggle (section 6) |
| **Free play** | An endless bazaar or sitting room built from due and weakest words, with a best combo; plus *Kasuku's minute*, a daily 60-second round |
| Greetings, recasts, "Arre re!", completion cards, the combo, Relaxed/Busy | As in Cook |

---

## 2. Mechanic library

### 2.1 What the research says (concrete mechanics and why they work)

| Reference | Concrete mechanic | Why it works | What we take |
|---|---|---|---|
| *June's Journey* | A list of 10–15 objects in a detailed scene. **Each object has one fixed position.** Scenes are replayed for up to five stars, and some rounds use Word or **Silhouette** lists | The pleasure of getting to know a place and getting faster in it. Replays make scenes cheap | Replaying the same scene with new rows. **Don't copy fixed positions** (remembering where things are would beat the listening) or **silhouette lists** (a picture of the answer) |
| *Hidden City* | Modes on the same scene: silhouettes, scrambled words, **"find 2 of the same"**, a night version, an upside-down version | Twists keep one piece of art fresh | "Find two", night (torch) and a changed scene as **language** twists, not visual ones |
| Hidden-object genre in general | A combo multiplier for quick finds in a row. A **misclick penalty** (time lost, multiplier reset). A small number of hints that recharge | The combo rewards flow. The misclick penalty stops people tapping everywhere | Combos, and a gentle guard against tapping everywhere: 3 wrong *items* in 2 s means a 2 s "slow down" (taps on scenery never count). **No** recharging free hints |
| *Hidden Folks* | Targets hidden **behind interactions**: unzip a tent, open a garage door. Almost every tap makes a (mouth-made) sound. Each target has a **short text clue**. Low pressure | Searching becomes finding out how the world works. Curiosity pays off. The clue makes it fair | Openable hiding places (curtain, cushion, cupboard, lid). Every scenery tap reacts. **The clue is Nani's Kutchi sentence** |
| *Where's Wally* and visual-search research | Clutter plus many similar distractors. In cluttered scenes, people need **longer descriptions** to pick one thing out. Children's search is **less organised** than adults' and improves with age | The difficulty is visual similarity, not size | Clutter and the length of the description rise together (noun, then noun + colour, then noun + position + colour). **Clutter is capped low for young players** |
| *I Spy* books | Rhyming riddles; the list is the game | Rhythm and rhyme "lure the ear"; for readers, the list is itself satisfying | *Kasuku's riddles* later, once the family can write short rhymes (never invented) |
| *Tiny Lands* | 5 differences per diorama: **position, size, colour**. Rotating reveals things hidden behind others | The categories of difference are exactly S2/S3 language | Spot-the-change, where the answer is chosen in Kutchi (M6) |
| *Pokémon Snap* | Photos scored on size, centring, pose, direction and other subjects in shot | Several goals per shot; a collection (the Photodex) | Held back (it overlaps the Snap mode). We borrow the **album as a collection** |
| Toca Boca | No fail state; everything reacts; open-ended | Safe for a 5-year-old; the player's own stories | Explore mode and free play: tap anything and it reacts. Warm failure everywhere |
| *Gus on the Go*, Lingokids | Hear and see the word, then a simple "tap the object" review; finishing reviews unlocks games | Hearing a word linked to a picture, then retrieving it | Stage-1 words taught in the scene (twinkle plus voice), then tested by listening only |
| Duolingo listening | Replay as often as you like; a **slow (turtle) replay** | Listening support without giving the answer | Replay and slow replay: they cost only the tick star |
| Total Physical Response (TPR) | Learners act on spoken commands and recombine known words into new commands | Understanding before speaking; low anxiety | Every row is a command you act on. Rows recombine known nouns, positions and colours |
| How children learn position words | *in* and *on* come first (age 2–3), then *under*, then *behind* before *in front of*; *between* later | This follows how children's thinking about space develops | Position words are introduced in that order (section 5) |
| Expanding retrieval (Fritz et al. 2007, preschoolers); spaced retrieval for word learning (Leonard et al.) | Retrieval attempts spread out at widening gaps beat massed practice | Recall from memory makes words stick | Rows are words that are due plus new words; "pass me" and the end-of-round recall are spaced retrieval |
| Corrective feedback meta-analyses (Lyster and Saito 2010) | **Prompts beat recasts**, although both help | The learner has to produce or choose the correction themselves | On a miss: a recast, **then the player retries**. The game never auto-shows the answer after a recast |
| Barrier games (referential communication) | One person describes, the other finds; the goal is shared | Both describing and understanding improve | Role reversal (M12), later |
| NN/g: children's touch targets | About **2 cm** targets for young children (4× the adult minimum) | Small hands, developing motor control | Bigger hit areas, zoom buttons, snap to the nearest item (section 4) |

Sources are listed at the end.

### 2.2 The candidates

Scoring: ●●● strong, ●● fair, ● weak.

| # | Mechanic | How it plays | Fun (why, reference) | Forces Kutchi: the decision, the "win without Kutchi?" test, leaks to avoid | Distinct | Plot | Play-again appeal |
|---|---|---|---|---|---|---|---|
| **M1** | **Nani's list** (bazaar hunt) | The spoken list is on the ladder. Tap each item in a busy stall, or across 2–3 stalls; count each unit into the basket; press *Done* (hand over the basket) | ●●● The list, combos and "found it" (*June's Journey*). The first errand is already built | ●●● **Which noun, how many.** Decoys come from look-alike groups (orange, lemon, peach). The count isn't capped: over-collecting costs the ear star. **Leaks:** a digit or per-unit dots on the row (show the digit only while the number is at word stage 1–2); the round ending by itself when the count is reached; item labels on the stall; silhouettes. **Passes** once those are closed | ●● Cook's pantry fetch is the same verb, but here the scene is the challenge (clutter, panning, several stalls) and it's the whole round, not one step | Arc 1 Ch1: fruit from the bazaar (built as `bowl-01`). Arc 2: threads and bangles | ●●● New rows each round, more stalls, longer lists (the bigger-bag upgrade), shopkeeper quirks |
| **M2** | **Where is it?** (position words) | The scene has **3+ copies** of the target in different places (a cup *on* the table, *under* it, *next to* the pot). The row says which: `{noun} [EN: under] {anchor}` | ●●● A twist on *I Spy* / *Where's Wally*: "there are three… which one?" | ●●● **Only the position phrase** separates the copies. **Leaks:** only one copy visible; the right copy is always the most visible one; arrow or position icons on the row; the anchor duplicated so rarely that the anchor word alone is enough. Rule: every row has ≥3 copies across ≥3 relations, and from level 3 the anchors are duplicated too ("under the *red* chair") | ●●● No other mode tests positions by *finding*. Tidy up tests them by *placing* | Arc 1 Ch3 (the sweets), Ch5 (Nana's cap). Arc 3 chicks. Arc 4 the ring | ●●● Hide spots are shuffled every round; seven relations; the anchors change with the scene |
| **M3** | **Which one?** (describe to find: colour, size) | Sets of the same noun that differ in colour or size. The row says `[EN: red] {noun}` or `[EN: the big one]` | ●● Satisfying picking; Simba (big) and Zazu (small) as the running example | ●●● **The adjective alone** decides. **Leaks:** the row tinted in the colour, or showing a swatch; only one red thing in the scene; size shown by the size of the row's text. Rule: ≥3 of the noun in ≥3 colours or 2 sizes, and at least one *other* noun in the target colour | ●● Dress up uses colours for *styling*; this is *picking out* | Arc 1 Ch4: Big Ma's sewing box ("the red thread", "the big scissors"). Ch3: the big sweet or the small one | ●● Colours × nouns give many combinations. Adds "not the red one" (a *no* row) |
| **M4** | **Simba's mischief** (hide, clue, open) | Simba and Zazu have scattered the sweets. Nani says where she saw them go. Things **behind openables** (curtain, cushion, cupboard door, basket lid): tap to open. A tail sticks out, a bell tinkles, paw prints lead somewhere | ●●● *Hidden Folks* interactions, the cats as a running gag, funny reactions (Zazu hiding in the tiffin) | ●●● **Which openable to try** is set by `[EN: behind] {anchor}`. **Leaks:** opening everything (guard: 8–12 openables per scene, and every wrong open is a miss for that row); the tail or bell showing the answer (they're decoration and point to a cat, not always the sweet); the sweet box's empty slots giving away the count (fine: the picture is the meaning; but the *where* must come from the voice). **Passes** | ●●● Openables and a trail make it a different feel from M1 to M3 | **Arc 1 Ch3 "The cat and the sweets"** (flagship). Arc 3 chicks (they peep and move). Arc 4 "following clues" | ●●● Cats choose new spots every round, new openables per scene, the cats' tricks (Zazu moves a sweet once), a collection of the funny finds |
| **M5** | **Check the bag** (the odd one out) | The shopkeeper packs your basket and **gets one thing wrong**. Tap the item that wasn't on the list (or is the wrong count) and hand it back; he says sorry and swaps it | ●● A short "gotcha" and a sense of being in charge. The cast already has this quirk | ●●● You must know **what was asked**. The list rows are dots from stage 3; bag items have no labels. **Leaks:** the wrong item visibly different (another category, or the only one of its kind): use a look-alike from the same group; English on the rows. **Passes** | ●●● Correcting someone. No other mode does it | Arc 1 Ch1 twist; the shopkeeper in every bazaar visit | ●● A cheap twist on any M1 round. Later: wrong colour, wrong size, wrong count |
| **M6** | **Spot the change** | Look at the scene; the lights flicker (or Simba runs past); something has changed. **Tap what changed, then pick, by ear, which of 3 Kutchi sentences says what happened** | ●●● *Tiny Lands* / spot-the-difference: memory tension | ●● **Spotting is visual only (not Kutchi)**; the ear star comes from choosing the sentence (`{noun} [EN: under] {anchor}`, later `[EN: Simba took the {noun}]`). **Leaks:** text or pictures on the choices (audio-only buttons until the reads profile reaches stage 3); two choices that are clearly impossible | ●● The only memory mechanic; it overlaps *Who did it?* on the "what happened" side | Arc 1 Ch3 lead-in to "Who ate one?". **Arc 4 "It's gone"** (past tense, S5) | ●● Changes of position, colour or size; more changes at higher levels |
| **M7** | **Kasuku's minute** (the daily find) | In the hub, Kasuku squawks 3–5 words he has "overheard" (the player's weakest words, in the family's recordings, pitch-shifted). Find each in the kitchen scene before he gets bored | ●● A tiny daily ritual (Wordle-sized) and a funny parrot. For the Farah persona | ●●● Pure listening: the noun, with no list text at all. **Leaks:** Kasuku's hub chatter giving answers away in other tasks (the cast rule stays: he's quiet during *other* tasks) | ●● A presenter skin on M1, but its daily, hub-only, weakest-words shape is its own thing | Hub, every arc | ●●● New every day, always the weakest words; a count of "days with Kasuku" that never resets |
| **M8** | **Torch** (night search) | A power cut or dusk: the scene is dark, and a torch circle follows your finger. The battery is gentle but real. Simba's bell rings from a place | ●●● A strong atmosphere change on the same art (*Hidden City* night mode). Tension without failure | ●●● The position phrase **saves battery**: sweeping the whole scene blind runs it down. **Leaks:** a big torch making the clue unnecessary (the torch upgrade widens the beam a little, never to full-screen); the bell always at the target | ●●● A modifier, not a new engine | **Arc 3 Monsoon** (the leak, a power cut; the chicks at dusk). A free-play modifier on any scene | ●●● Any scene at night; the bigger-torch upgrade |
| **M9** | **Nani's day** (the scene changes with the time of day) | The same courtyard or room in the morning, midday and evening; things move with the routine (Nana's glasses on the charpai in the morning, on the shelf at night). Nani says *when*, and the player turns a sun dial to that time, then finds it | ●● The world feels alive; the same place changes (cosy-game progression) | ●● **The time-of-day word** decides the view, then the noun and position. **Leaks:** only one time having the object in it; lighting giving the time away (fine, since the picture is the meaning, but the *word* must be what picks it) | ●● Unique, but it costs art per time of day | **Arc 3** ("Nani's day" fills the times-of-day gap, S4) | ●● Three versions of each scene cheaply (grade plus lamp layers) |
| **M10** | **Who has it?** (people in the bazaar) | Several sellers and shoppers; the row says who: `[EN: the man with the red cap]`. Tap that person to buy or ask | ●● *Where's Wally* with people | ●●● Describing people (S3). **Leaks:** only one person fitting any single feature. Needs combinations | ● Overlaps *Who did it?* (deduction about people) | Arc 2 (the bazaar with outfits; buying threads) | ●● Many combinations once people are layered sprites |
| **M11** | **Photo** | Frame the described thing with a camera viewfinder; graded on the right subject, centring and size | ●● *Pokémon Snap* scoring and the album | ● The subject comes from Kutchi, but framing is visual skill. It overlaps the **Snap** mode | ● Belongs to Snap | Arc 5 | ●● The album |
| **M12** | **Role reversal** (you describe, the cousin finds) | The older cousin has lost his cap. You can see where it is; you pick audio chunks (`{anchor}` + `[EN: under]`) and he looks there. Grandparent mode: say it aloud instead, and Nani marks it | ●● Being the expert (a barrier game); a funny cousin | ●●● Production: choosing the right chunk needs the meaning. **Leaks:** icons on the chunk buttons (audio only; text only for readers at stage 3) | ●●● The only production-first search | The older cousin from Arc 1 Ch2 onwards; his payoff in later arcs | ●● Any M2 round flipped |

**Also rejected:** silhouette lists (a picture of the answer); fixed item positions (*June's Journey*); a free hint that recharges (hints must cost stars); bargaining as a gamble (Game Design's rejected "double or nothing"). **Counting coins to a spoken price** is fine for **Arc 2**, once prices exist.

---

## 3. Recommended first set

**Build one search engine where rows are data, then three mechanics on it.** M1 to M3 are one engine: a row is `{noun, count?, colour?, size?, position?, not?}`, so M2 and M3 are just new slot types, the way a Cook recipe is station calls with slots.

| Order | Mechanic | Why first |
|---|---|---|
| 1 | **M1 Nani's list**, with **M5 Check the bag** as its twist | It replaces the built fruit-bowl bazaar, so Arc 1 Ch1 plays in the new engine. It runs on words that already have Kutchi drafts (fruit, veg, spices, 1–10). M5 costs almost nothing and gives the shopkeeper's "wrong thing" quirk a job |
| 2 | **M2 Where is it?** | S2's main job. It's the strongest "only the Kutchi decides" mechanic. The scene-data work (anchors and hide spots) is needed by everything after it |
| 3 | **M3 Which one?** | Colours and big/small; Big Ma's sewing box in Ch4; almost free once M2's duplicate spawning exists |
| 4 | **M4 Simba's mischief** | The Arc 1 Ch3 flagship and the most *Hidden Folks* juice (openables, cats). It's built after 2, because its clues are position rows |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| M7 Kasuku's minute | **Straight after the first set** | Cheap (M1 in the hub with no list text), a daily hook; needs only existing recordings |
| M8 Torch | As a free-play modifier after M2; in the story in Arc 3 | Needs position words known first, otherwise it's just a slow sweep |
| M6 Spot the change | Arc 1 Ch3 lead-in at the earliest; really Arc 4 | Needs recorded sentence choices; past tense is S5 |
| M9 Nani's day | Arc 3 | S4 words; three versions of the art per scene |
| M10 Who has it? | Arc 2 | S3 describing people; people as layered sprites |
| M12 Role reversal | When produce stages exist; Grandparent mode | Production, not listening |
| M11 Photo | Never in Find it | Belongs to the Snap mode |

**Arc 1 with Find it:**

| Chapter | Find it errand |
|---|---|
| The guests are coming | Fruit from the bazaar (M1 + M5) |
| Knock knock | Optional: the cousin's lost cap (M2, a first taste) |
| The cat and the sweets | **Find the sweets** (M4 using M2 rows) → *Who did it?* → Tidy up |
| The spill | **Big Ma's sewing box**: the red thread, the big scissors (M3). Replaces v2's "fabric by colour", now that Big Ma mends the kurta |
| Eid morning | Nana's prayer cap and the Eidi envelope (M2 + clothes nouns) before getting dressed |

---

## 4. Scenes and art

### 4.1 Camera per scene (art bible section 3: one camera per scene)

| Scene | Camera | Width | Anchors (objects that positions are relative to) | Used in |
|---|---|---|---|---|
| Bazaar lane | **E**, customer's side, horizon about 55% | 2 screens (3200×900), pan | 3 stalls, crates, baskets, the scale, an awning | Arc 1 Ch1, Arc 2, free play |
| Nani's sitting room | **E** | 1.5 screens | Sofa/bolster, low table, curtain, cupboard, rug, window sill | Arc 1 Ch3 and Ch5, Arc 4 |
| Big Ma's room / sewing box | **E** for the room; **T** close-up of the open box (like the spice cupboard close-up) | 1 screen each | Box trays, pincushion, spools, the machine | Arc 1 Ch4, Arc 2 gift |
| Courtyard | **E** | 2 screens | Charpai, hen coop, water pot, tree, steps, doorway | Arc 3 chicks, Nani's day; Arc 5 |
| Nani's bedroom / dressing table | **E** | 1 screen | Dressing table, drawers, jewellery box, bed, trunk | Arc 4 the ring |
| Kitchen (hub) | **E** (as the hub) | 1 screen | Island, shelves, window sill, stove | Kasuku's minute |

Items use the **F view**, shared with the pantry and stalls. The ingredient library is already shared with Cook (Cook to-do, "Then").

### 4.2 What must be separate layers

| Layer | Why |
|---|---|
| Background: walls, floor, fixed furniture, **with no painted findable things** (playtest lesson 15) | Items are placed by data every round |
| **Every findable item and every copy or decoy** | Shuffled into hide spots per round; states: normal, found |
| **Occluders cut from the background**: sofa front, table apron, curtain edge, counter front, crate rims | So "behind" and "under" show part of the item, drawn in the right depth |
| **Openables** with closed and open frames: curtain, cushion, cupboard door, basket lid, tiffin, drawer | M4; each also reacts to a tap when empty |
| Cats (Simba, Zazu): peeking, tail out, asleep, running | Mischief and clues; shared with the hub |
| Carried container (back, items, front rim) | Layout contract v2 |
| Ambient motion (awning, bunting, lantern, steam) and scenery that reacts to taps | *Hidden Folks* curiosity |
| Darkness mask (code), time-of-day colour grade (code) plus a few swap layers (lamps lit, shadows) | M8, M9 without repainting |
| Arc dressing (Eid bunting, monsoon buckets, wedding marigolds) | The same scene reused across arcs |

### 4.3 Hide-spot rules (fair, never a pixel hunt)

**Principle: hard to decide, easy to see.** The challenge is the language (which one, where), not spotting a speck.

- **Visibility:** at least 40% of an item shows unless it's behind an openable, and an openable with something in it looks the same as an empty one (no glint).
- **Size:** 90 px is the minimum drawn size on the 1600×900 stage (art bible). The **hit area is padded to about 130 px**, and a tap snaps to the nearest findable item within that radius. On a phone, 90 px is about 0.6 cm, far below the roughly 2 cm recommended for young children, so **on phones the round opens zoomed 1.5×** with pan (buttons plus drag, no pinch). For 5-year-olds, a tablet is the target device.
- **Safe zones:** nothing findable in the outer 5% of the scene, under the carried container's rectangle, or where the sidebar or drawer could cover it (the tap-cover test before every tap stays).
- **Contrast:** an item never sits on a background of nearly the same hue (a minimum luminance difference, checked by `place_preview.py`).
- **Scale and surfaces:** art bible scale order; contact shadow; sunk about 4 px; every item touches a surface.
- **A density knob per level:** decoys, copies and clutter. Level 1 (and any stage-1 word): fewer than 8 findable things on screen, no openables. The clutter cap is tied to the *player's* level, not the scene.
- **Anchors are tappable scenery**, never findable targets in the same round, so "under the table" never makes the table itself a wrong answer.
- **No two copies of a target in the same relation to the same anchor.** Each hide spot is a unique `(anchor, relation)`.

### 4.4 Layout spec before art (the process)

1. **Scene spec as data first:** `data/scenes/<scene>.json` gains `anchors` (id, word id, rectangle), `spots` (anchor, relation: in, on, under, behind, next-left, next-right, in-front, between, with x, baseline, depth and how much is hidden), `openables`, `occluders`, pan width and safe zones.
2. **Greybox in the Search lab:** grey boxes for anchors, placeholder items. Play M1 to M4 on it, then run the non-speaker bot (section 6).
3. **The "can you win without Kutchi?" audit** of that scene (enough copies per relation? any dominant spot?).
4. **Write the art brief from the spec:** the list of anchors, empty surfaces where spots are, no painted items, occluder edges to be cut out.
5. **Generate the empty background**, then items by **edit in place** (the Cook pipeline) for angle, scale and light; cut out the occluders.
6. **`place_preview.py` plus the visual QA checklist** (angle, surface contact, shadow, scale, nothing covering a tap, contrast).

### 4.5 Reusing scenes

| Scene | Arc 1 | Arc 2 | Arc 3 | Arc 4 | Arc 5 |
|---|---|---|---|---|---|
| Bazaar lane | Fruit list (day) | Threads, bangles, prices | Rain awnings (grade) | The crow trade | — |
| Sitting room | Sweets, Eid cap | Wedding gifts piled up | Power cut (torch) | Following clues | — |
| Courtyard | — | Mehndi night (evening grade) | Chicks, Nani's day ×3 | Footprints | The farm |

Each scene has 3 time grades × arc dressings × modifiers (torch, "find two"), so one background makes about 10 different-feeling rounds.

---

## 5. Learning design

### 5.1 What it teaches

| Stage | Words | Frames (existing Kutchi, or a placeholder) |
|---|---|---|
| S1 | Fruit, veg, spices, staples (drafts in `content.json` and `cook.json`); numbers 1–10 | *Muke {n} {X} khape.* · *Ne {X}.* · *Muke hikdo {X} dine.* · *Ghan.* · *Arre re!* · *Hedo!* · `[EN: How many?]` (snt-09, no Kutchi yet) · `[EN: Well done!]` (snt-13, no Kutchi yet) |
| S2 positions | in, on → under → behind → next to → in front of → between (the acquisition order) | `{X} {anchor} [EN: under]`: Kutchi positions come **after** the noun (Roadmap syllabus); each `(anchor, relation)` is one recorded phrase |
| S2 colours, household, sweets, clothes | 10 colours (Round 1, Q11); household objects (Q8); **sweets (mithai names: not asked yet)**; Eid clothes (Q9) | `[EN: the red one]` · `[EN: not the red one]` · `[EN: this / that]` |
| S3 (borrowed early) | big and small (Cook's roll already needs them) | `[EN: the big one]` · `[EN: the small one]`: agreement is needed (see 5.5) |
| Later | S4 animals and times of day; S5 `[EN: Simba took it]`, `[EN: where did it go?]` | Arc 3 and Arc 4 |

**Rows grow in step with clutter** (the *Where's Wally* finding): level 1 is the noun only; then noun + count; then noun + position; then noun + colour/size; then noun + position + colour, with anchors duplicated.

### 5.2 Word-stage fading (the one-place-text rule)

| Word stage | List row (the instruction) | In the scene (the help) |
|---|---|---|
| 1 New | Text + speaker; Nani says it; the target **twinkles** as she says it (pulse sync). Taught, not tested: doesn't count for the ear star either way | Tapping it names it |
| 2 Learning | Text + speaker | No twinkle, no labels |
| 3 Nearly known | Speaker only (dots) | Nothing |
| 4 Known | Heard once; replay costs tick | Nothing |

- **No item labels in the scene at any stage.** In Cook, labels help with the *next* step; here, a label *is* the answer. Stage-1 teaching happens through the twinkle and the voice.
- **Tapping an item to hear its name** is allowed in **Explore** (free play with no rows) and for stage-1 words only. During a round, a tap on a findable item is an answer.
- **Counts:** **no digit for the count asked for, at any stage** (25 Sept, calm sidebar: a digit beside the row answered "how many?" without the Kutchi number word, and the non-speaker bot read it off the row). The row shows only the running tally ("×2": how many are in the basket so far, never what's left). Tallies count aloud at stage 1–2 and silently from stage 3; no ending by itself; press *Done*.

### 5.3 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | Nani says the row again (tap the row speaker) | Free the first time; after that, the tick (Relaxed) or patience drain (Busy) |
| 2 Slow replay | Half speed, a pause before the key word (Duolingo's turtle) | Tick / patience |
| 3 Warmer | Nani looks and gestures towards **a third of the scene**; the rest dims. It must still hold **at least 3 candidates** (copies or look-alikes) | Tick + the combo breaks; the ear star stays (you still have to understand) |
| 4 Reveal (eye) | Shows the row's Kutchi text (never English) | Ear star for that row, from stage 2 |
| 5 Translate | English gist | Ear star for that row |
| 6 Shown | Stage 1 only automatically; otherwise after 2 misses on a row, the target glows | Ear star for that row; the word doesn't advance |

- Hesitating never auto-shows the answer. After about 8 s, Nani just replays the line (rung 1, free the first time). This closes the audit's "wait for the glow" leak.
- **No upgrade may make a hint cheaper** (v2's "faster hint recharge" is dropped). Upgrades only help the physical side: the torch's beam, the zoom lens, the bigger bag, faster panning.

### 5.4 Mistakes: a recast, then the player tries again

On a wrong tap: the item wiggles, then *Arre re!* {the name of what you tapped} … {the row said again}. For a wrong copy: `{X} {anchor} [EN: on]`, then the target phrase said again. **The player then finds it themselves** (a prompt beats a recast); nothing is shown. The miss counts against the ear star for that row (see Q3) and marks the word as a miss. Two misses in a row drop the word a stage (existing rule).

**Spaced retrieval in every round:** rows are due words plus up to 3 new ones, weakest first. "Pass me" asks for a met word that isn't on the list. At the end, Nani asks for each item back from the basket (it counts towards the ear star). *Kasuku's minute* covers the weakest words daily.

### 5.5 What's needed from the family (English placeholders until then)

| Need | Status |
|---|---|
| Six position phrases (under, behind, next to, in front of, between, on top of) **and "in"** | Asked (Round 1, Q3), awaiting answers. Add "in" |
| **Does the anchor noun change before a position word** (like Gujarati "table-**ni** niche")? This decides whether we record per anchor or build from chunks | New question |
| Colours (10) | Asked (Round 1, Q11) |
| "The red one", "the big one", "the small one", "not the red one": do they change with the noun's gender or number? | New (links to Round 1, Q1) |
| Household anchors for each scene (sofa, table, curtain, cupboard, cushion, shelf, charpai…) | Partly asked (Q8); send the anchor list per scene |
| Sweet names (the Ch3 mithai box) | New |
| Eid clothes (prayer cap and others), the Eidi envelope | Asked (Q9) |
| Frames: "Where is it?", "Find the…", "Here it is!", "Look!", "Not that one", "How many?", "Well done!", "Simba took it" | New (two are in `content.json` with no Kutchi) |
| Whole phrases recorded per scene: about 6 anchors × 7 relations = 42 short phrases, one long take | For the recording session |

---

## 6. Lessons from Cook, applied from day one

- [ ] **The audit comes first.** This doc audits every mechanic (section 2.2). The audit is repeated after each build step, per mechanic *and* per scene.
- [ ] **The non-speaker bot (the wife's test as code).** A Search lab test player that sees only what's on screen: it taps the most visible, the biggest, whatever matches row length or order, and tries every openable. It must earn the ear star in **fewer than 10%** of rounds. Cook found its leaks by reading the code; here a test finds them.
- [ ] **Every decision comes from Kutchi and changes every round.** Hide spots are shuffled; no fixed positions, no fixed first row, no customer habits that decide the answer. Anchors vary.
- [ ] **Help that shows the answer costs the ear star** (glow, reveal, translate, "shown"); hearing it again costs only tick; Busy help drains patience. Hesitation never auto-shows the answer.
- [ ] **The screen never gives the answer away:** no pictures, silhouettes, colour swatches, arrows or tinted text on rows; one dot per item; "not" rows styled like the others and placed at random; any-order rows in random order; no "2 of 3" style English.
- [ ] **Decoys come from look-alike groups** (symmetric), so the trio looks the same whichever member is asked for.
- [ ] **"Not" and counts are real decisions:** a "not the red one" item is always on screen; counts never end by themselves; *Done* is always there; over- and under-collecting are both graded.
- [ ] **The one-place-text rule:** the word is written on the row *or* nowhere; no item labels in the scene; label-speaker matching is impossible in rounds.
- [ ] **Shared systems from the start:** word pills, ladder rows built from the round's data, stars shown as they happen, the receipt, completion cards, pass me, greeting the shopkeeper, Relaxed/Busy, levels as data, the Search lab, a free-play entry.
- [ ] **Visuals:** one camera per scene; the layout spec and greybox before any art; contact shadows; no painted findables; the visual QA checklist on every screenshot.
- [ ] **Clear actions:** a see-through fingertip demo the first time for pan, zoom and open; one goal line in the sidebar; cues on the object, never over the scene; the sidebar never covers the play area.
- [ ] **Tests:** six screen sizes including 16:10 and a 375 px phone; the tap-cover check before every tap; Claude looks at the screenshots.
- [ ] **Upgrades automate the physical, never the listening.**
- [ ] **Placeholder English is flagged** in the audit as "not yet a Kutchi test". The position and colour rows can't pass until the family's words arrive, so **chase Round 1 Q3 and Q11 before building M2 and M3**.

---

## 7. Risks and open questions for Zafar

**Risks**
- **Small screens:** dense scenes on a 375 px-tall phone. Mitigation: open zoomed in, snap to the nearest item, low clutter at low levels. Tablet as the target device for 5-year-olds.
- **English placeholders make M2 and M3 untestable** for language (anyone who speaks English understands "under"). The family's words come first.
- **Recording load:** positions × anchors per scene. It depends on the grammar question in 5.5.
- **Art:** separated layers (occluders, openables) are harder than one pretty cluttered picture. Edit in place plus the greybox spec keep it under control.

**Questions**
1. Does the built fruit-bowl errand (Shopping) move onto the Find it engine (M1 + M5), as v2 implies ("Shopping dropped as a mode")?
2. **The second star:** is "sharp eye" (a combo: each find within a generous par time, measured from the end of Nani's line) the right non-language skill star, or would you prefer a collectible find per scene (Zazu peeking, a hidden Eid star)?
3. **Ear star leniency:** lost at the first miss (as in Cook), or a half star after one miss (the audit's suggestion), so it's worth staying careful?
4. **Kasuku as a task-giver** in *Kasuku's minute*: is that OK alongside the cast rule "never speaks during a task" (the rule would then cover *other* tasks)?
5. **Scene width:** are panning scenes (1.5–2 screens) acceptable, or should every scene fit one screen with zoom only?
6. Arc 1 Ch2: add the cousin's lost cap (M2 taste), or keep Ch2 as greetings and Tidy up only?
7. Which sweets go in Nani's mithai box (for the Round 3 questions)?

---

## 8. Build brief (25 Sept 2026, matching the deep dive)

For the Find it build agent, working alongside one agent per mode and a foundation agent. **Phases 0 and 1 touch only Find it's own files**: `find.html`, `css/find.css`, `js/find/**`, `data/find.json`, `data/scenes/sitting-room.json` (new), `build/test_find.py`. Nothing in `js/cook/*`, `css/cook.css`, `index.html` or any shared file. Placeholder words stay in `data/find.json`.

### 8.1 Shared pieces assumed from the foundation agent (not designed here)

| Piece | What Find it needs from it | Until it lands |
|---|---|---|
| The shell ("one app, one save") | A mode entry, one wallet, story beats and the map place | `find.html` keeps using Cook's save and progress as now |
| `data/relations.json`, `js/shared/rel.js`, scene `spots` schema | `Rel.holds(item, where)` and `Rel.options(scene, row)` for `where` and `warmer`; the `spots[].{anchor, rel, x, baseline, also}` shape Find it uses is offered as the seed | `Find.matches` keeps matching on `item.rel`, by anchor word |
| The "which one?" module | Attribute rows, the decoy rule, the blind-odds budget | `Find.makeWants` does size locally (`gen.js`) |
| Star sets and ear/voice rules as data | `star_sets.find` with a fourth, voice star; `minTested`; taught-rows exclusion | `data/find.json` `star_set` as now; the voice star shown on the result card only |
| `js/shared/speech.js` | `Speech.listen({choices, timeoutMs})` | `Find.fakeListen`: the lab's "what did the child say?" picker, which the test drives |
| Overlay-at-anchor sprites | Ali at the stall, the cats peeking (phase 3) | A face badge and a hand from the existing hand set |
| Wave 5A's frozen UI API | Intro card, "?" help, word review, the sidebar | Phase 0 needs none of it; phase 1's greybox uses whatever `ui.js` exports at the time |

### 8.2 Phases

| Phase | What is built | Files | Acceptance |
|---|---|---|---|
| **0 Pure logic and the bot** | Split `list.js` into `mechanics/spot.js`, `bag.js`, `where.js`; `games/list.js`, `whichone.js`, `where.js`, `ali.js`; `gen.js` (rows by level: count, size, where, not; the size rule: the noun in both sizes, both sizes on two or more nouns, balanced); the digit fix (stage ≤ 1); level 4 knobs; `mechanics.tell` with `fakeListen`; bot strategies bigger, smaller, odd-size, most-visible copy, nearest copy, first copy, pills-random; `--leak` per game | Own files only | `python3 build/test_find.py --leak 30 --game <id>` under 10% (target 5%) for F1, F2, F3 at levels 1–3, stages 2 and 3; the existing play test still passes at six viewports |
| **1 Greybox and the lab** | F2 on the bazaar (the same picture at 0.8× and 1.25×); F3 calls on the bazaar's in/on/in-front spots, and `data/scenes/sitting-room.json` as grey boxes with under/behind occluder rectangles; F4 with the picker; F6 as a CSS mask with a battery bar; the voice star and pills on the result card; a Search lab button per game | Own files, plus the new scene file | Each game runs from the lab at levels 1–4; a Playwright round per game with deliberate mistakes; the picker stands in for the mic; no text on items; the tap-cover check before every tap |
| **2 Integration** | Swap to `rel.js`, `whichone`, `speech.js`, the star data, the shell entry, the intro card and word review; the fruit-bowl errand onto the engine (D9.1); the bowl as speaking moment 1 | Shared files, with the foundation agent | One save; the bot rates unchanged; a real microphone round on a tablet with a family recording set |
| **3 Story and art** | F5 (openables, cats, sweets) once E59 and A5 exist; the sitting-room art from the greybox spec (4.4); Big Ma's box (F11) after E60–E71; F7 in the hub daily; family words dropped in as data and the audit rerun per game | Scene and asset files | The Kutchi audit per game and scene; the visual QA checklist on every screenshot; the persona round with Zafar's notes |

### 8.3 The first three tasks

1. **Split and re-test (phase 0).** Move `Round.searchTap/collect/wrong` into `mechanics/spot.js` and `checkBag` into `mechanics/bag.js` with no change in behaviour; `games/list.js` composes greet → spot+count → bag → tell(bowl, fake). Run `build/test_find.py` and `--leak 30`; the rates must match today's within noise. Fix the digit to stage ≤ 1 and record the new stage-2 rate.
2. **F2 Which one? (phase 0–1).** `gen.js` gains size rows and the size rule; `placeItems` takes a `size` scale per unit; the three size strategies in `bot.js`; `games/whichone.js` and its lab button; levels in `data/find.json` (`whichone.levels`: rows, sizeRows, decoyKinds, spare per size). Acceptance: bot under 5% at level 1, stage 2.
3. **`mechanics/tell.js` and F4 (phase 1).** `tell({choices, want, actor, onChoice})`: calls `Speech.listen` if present, else `Find.fakeListen`; the actor acts on the choice; one retry, then pills; parent ✓ in Grandparent mode; the voice rows on the result card. `games/ali.js`: the picture list, tell (kinds), tell (numbers), then `bag` on Ali's packing. Acceptance: a Playwright round through the picker earns the voice star; a pills-only round never does; the round never waits on the mic longer than `timeoutMs`.

---

## Sources

- Hidden Folks: [Behind the Game, Stefan Lesser](https://medium.com/@stefanlesser/behind-the-game-hidden-folks-e6198dfa885a); [SCMP review](https://www.scmp.com/culture/arts-entertainment/article/2077086/game-review-hidden-folks-searching-game-surreal-animation); [AppUnwrapper guide (clues)](https://www.appunwrapper.com/2017/02/15/hidden-folks-walkthrough-guide-hints-and-tips/)
- June's Journey: [Naavik deep dive](https://naavik.co/deep-dives/junes-journey-hidden-object-game/); [Fandom: Hidden Object Scene](https://junes-journey.fandom.com/wiki/Hidden_Object_Scene)
- Hidden City: [Exploration Modes (Fandom)](https://hidden-city-mystery-of-shadows.fandom.com/wiki/Exploration_Modes)
- Hidden-object combos and misclick penalties: [Gamezebo, Hidden Express walkthrough](https://www.gamezebo.com/walkthroughs/hidden-express-walkthrough/)
- Tiny Lands: [Indie Hive review](https://indie-hive.com/tiny-lands/); [TheSixthAxis review](https://www.thesixthaxis.com/2021/03/09/tiny-lands-review/)
- Pokémon Snap scoring: [Game8 photo scoring guide](https://game8.co/games/New-Pokemon-Snap/archives/328684)
- I Spy: [Walter Wick Studio](https://www.walterwick.com/books/i-spy)
- Where's Wally and visual search: [Clarke et al., Frontiers 2013 (salience and referring expressions)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2013.00329/full); [The development of organized visual search (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3651801/)
- Toca Boca: [Grokipedia overview](https://grokipedia.com/page/Toca_Boca)
- Gus on the Go: [gusonthego.com](https://www.gusonthego.com/); Lingokids: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/lingokids-play-and-learn)
- Duolingo slow replay: [Duolingo blog](https://blog.duolingo.com/learning-with-hearing-aids/)
- TPR: [Liu et al. 2024, SAGE Open](https://journals.sagepub.com/doi/full/10.1177/21582440241288924)
- Position-word acquisition: [Speechie Trish summary](https://www.speechietrish.com/blog/preposition-and-spatial-concept-acquisition); [Cox 1981, "in front of" and "behind"](https://dx.doi.org/10.1177/016502548100400304)
- Retrieval practice: [Fritz et al. 2007, expanding retrieval in preschoolers](https://journals.sagepub.com/doi/10.1080/17470210600823595); [Leonard et al. 2024, spaced retrieval and word learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC11365034/)
- Recasts vs prompts: [Lyster and Saito 2010, SSLA](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/oral-feedback-in-classroom-sla/4999EE1C8379B2BF026B148EAF373CA1)
- Barrier games: [ASHA, barrier game format](https://pubs.asha.org/doi/10.1044/jshd.5401.33)
- Touch targets for children: [NN/g, children's physical development](https://www.nngroup.com/articles/children-ux-physical-development/)
