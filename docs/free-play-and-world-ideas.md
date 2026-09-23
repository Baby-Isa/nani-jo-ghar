# Nani jo Ghar: free play, mini-games and a semi-open world

**Date:** 23 Sept 2026
**Status:** idea assessment. Not yet scheduled.
**Zafar's idea:** something between **Pokémon** (follow the story, or wander off and play your own way) and **Puzzle Pirates** (every activity is a genuinely fun game in its own right). A strong story mode, but the mini-games are good enough that people log in *just to play them*, which reinforces the language. Example: a timed cooking game where family members come in, each asks for something different in Kutchi, and you make it before they've waited too long, or you help out at a restaurant.

---

## 1. How it fits what's already planned

Most of the structure already exists in the Roadmap:

| Idea | Already in the Roadmap | What's new |
|---|---|---|
| Mini-games | **8 game modes** (Shopping, Put it there, Hide and seek, Cook-along, At the door, Ask around, Spot it, Get dressed), each built once as reusable code | Each mode also gets a **free-play version**: endless, scored, replayable |
| Story mode | Arcs → chapters → errands, story beats, the quilt | Nothing |
| Replay | Tap a quilt patch to replay an errand | Free play is better than replaying a fixed errand |
| Content for replays | "Errand lists are generated: words due for review plus new words" | Free play *is* this generator, running endlessly |
| Open world | "A map once there are more places" (later) | A map of places to tap into, each with activities |
| Timed cooking / restaurant | Cook-along; "pressure is always the upside version" | A new, busier mode: **Nani's kitchen rush** (section 3) |

**So this is mostly a change of packaging, not a rethink.** The main code consequence: each mode must be built as a self-contained engine that takes *any* word list, scene and difficulty settings, not a one-off errand. Build Brief v4 already heads that way.

## 2. What Puzzle Pirates got right, translated

- **Each puzzle was a real game** with a skill ceiling: you got visibly better, and experts played for fun. For us, the depth comes from **knowing more Kutchi**: known words make you faster, unlock bigger orders and give better stars. The skill *is* the language.
- **Short sessions, a personal best per game, and a reason to come back.** That means stars, streaks and a daily request, which Zafar now favours.
- **Every activity was tied to a role in the world** (sailing, carpentry, cooking on a ship). For us: helping in Nani's kitchen, running the bazaar stall, serving guests. Each place in the world *is* a mini-game.
- *Not* copying: the massively multiplayer world, the economy, social crews. That's studio-sized.

## 3. The flagship idea: "Nani's kitchen rush" (a new mode)

Family members come in one at a time. Each orders in Kutchi, for example "chai with two sugars" or "two rotis and daal". You pick the right ingredients and assemble the dish before their patience runs out; Nani helps, and a correct plate earns a smile, coins and stars.

- **Language it trains:** requests, quantities, preferences ("less sugar"), kinship ("Mama wants…"), politeness, food vocabulary, and later adjectives (hot, sweet).
- **Why it's the best candidate for "fun on its own":** it's the *Good Pizza, Great Pizza* / Diner Dash loop, which is proven to be addictive, and you genuinely can't win it without understanding the Kutchi. It passes the Roadmap's intrinsic-integration test.
- **Design tension to settle:** timers versus young children and versus the "nothing punishes" rule. Language needs thinking time, and a timer rewards guessing. Proposal:
  - Patience is generous.
  - Words you know well are asked for faster; new words get more time.
  - There's a **relaxed setting with no timer** for young children.
  - Customers **never leave angry**; being slow only means fewer stars and coins.
- **How to avoid an art explosion:** build dishes from **layers**, not one image per combination. For example: a cup, the chai, the sugar cubes; or a plate, 1–3 rotis, a daal bowl. Keep to a small dish set (chai, roti, daal, fruit plate, lassi) with countable parts.
- **Audio:** orders are built from recorded chunks ("Muke {n} {item} khape") via the Roadmap's chunked-recording pipeline. Each family member needs a small set of lines. The family's recording time is still the real limit, but free play reuses the same recordings endlessly, which helps.

## 4. Scope assessment

| Piece | Size | Recommendation |
|---|---|---|
| **Free-play version of each mode** (generated rounds from the player's known words, stars, a best score) | **Small**, about +10–20% per mode, *if* modes are built as engines from the start | **Yes.** Cheapest route to replay and spaced repetition |
| **Places map** (tap a place to go there: kitchen, bazaar, courtyard, farm; each shows its story errand and its free-play station) | **Small–medium** | **Yes, after Chapter 1.** It's how Sago Mini World and Toca Life do "open world" for kids |
| **Nani's kitchen rush** (timed family orders) | **Medium–large**: one new mode with a queue of customers, order generation, assembly stations and layered dishes | **Yes, as the first "fun on its own" mode.** Prototype it after Chapter 1 and playtest with children |
| **Help at the restaurant** / stall rush variants | **Small**, once kitchen rush exists (same engine, a different scene and menu) | Later |
| **Pokémon-style walking world** (an avatar you move around, top-down maps, walk cycles, collisions) | **Large**: a different camera and art style, many more assets, new movement code | **No** for the MVP. A tap-to-travel map gives most of the feeling for a fraction of the cost |
| **Multiplayer / social** (Puzzle Pirates crews) | **Very large** | **No** |

**Biggest risk: breadth before depth.** One genuinely fun mode beats five mediocre ones. Make each mode pass **two tests** before adding the next:
1. **It's fun even for someone who doesn't care about learning** (would a child choose it?).
2. **It can't be won without understanding the Kutchi** (the Roadmap's test).

## 5. Suggested sequence (fits the existing phases)

1. **Phase 2 (now):** production Shopping plus the thin shell, as planned. **One change:** build Shopping as a mode *engine* with a free-play entry point (generated list, stars, best score). That proves the pattern cheaply.
2. **Phase 3:** Chapter 1 as planned (Cook-along, Put it there). Build Cook-along so its engine can later run the kitchen rush.
3. **After the Chapter 1 family playtest:**
   - prototype **Nani's kitchen rush**;
   - add the **places map** hub, where each place holds its story errand and its free-play station;
   - add stars, a streak and a daily "Nani needs…" request.
4. **Arc 1 onward:** every new mode ships with story errands *and* a free-play station.

---

## 6. Every mode as fun as the kitchen rush: build each on a proven genre

**Zafar's concern (23 Sept 2026):** the kitchen rush is a real game that could stand alone on the App Store; the other modes, as written in the Roadmap, don't feel that fun. If every mode reached that level, the game would be a big winner, and could later be released in popular languages too.

**Principle:** don't invent mini-games. Take the **core loop of a proven App Store genre** and make **the Kutchi instruction the input that drives it**. Every order, request or clue is spoken in Kutchi, so the game can't be played without understanding. The genre supplies the fun; the language supplies the challenge. That is "genre skin, language engine".

### Proposed mapping

| Roadmap mode | Proven genre and hits | The game | Language it drives |
|---|---|---|---|
| **Cook-along** | Restaurant time-management (*Good Pizza, Great Pizza*, *Cooking Fever*, *Overcooked*) | **Nani's kitchen rush:** family members order in Kutchi; make it in time | Food, quantities, preferences, kinship |
| **Shopping** | The same time-management loop from the other side of the counter (*My Supermarket Story*, stall games) | **Stall rush:** *you* run the bazaar stall. Customers ask in Kutchi, you bag the right items, weigh them on the scale and give change in coins | Nouns, numbers, money, polite phrases (role reversal = production) |
| **Hide and seek** | Hidden object (*June's Journey*, *Hidden City*); one of the biggest casual genres | **Find it:** a cluttered room; a Kutchi clue ("under the sofa, next to the red box"); a timer and combos; zoom to search | Postpositions, household nouns, colours |
| **Put it there** | Sorting and organising puzzles (*Unpacking*, *Goods Sort*, *Match Factory* / *Triple Match 3D*): currently huge, very "satisfying" | **Tidy up / lay the table:** spoken instructions place items; a triple-match variant where you tap the item Nani names into a 7-slot tray and three of a kind clear | Postpositions, imperatives, colours, numbers |
| **At the door** | Deduction (*Guess Who*), plus quick-choice reactions | **Who's at the door?** A knock and a Kutchi description through the peephole ("she has glasses, a green scarf"); pick who it is, then choose the right greeting | Describing people, kinship, greetings |
| **Ask around** | Detective / mystery (*Detective* games, *Clue*) | **Mini-mysteries:** ask relatives, collect Kutchi clues in the notebook, solve who took the sweets | Questions, past tense, reading back |
| **Spot it** | Rhythm and reaction (*Magic Tiles*, *Piano Tiles*, spot-the-difference) | **Dhol rhythm / sky watch:** tap the named thing on the beat; counting songs | Nature, numbers, songs |
| **Where it hurts / get dressed** | Doctor games (*Toca Doctor*, *My Hospital*; hugely popular with kids) and dress-up / makeover | **Nani's clinic:** patients say what hurts, you treat them in time. **Eid makeover:** dress a relative exactly as they ask | Body parts, feelings, clothing, colours |

### Why this is feasible: 8 modes share about 4 engines

| Engine | Modes it powers |
|---|---|
| **Time-management** (customer queue, orders, patience, assembly, coins) | Kitchen rush, Stall rush, Clinic |
| **Search** (cluttered scene, clue, zoom, timer) | Find it, Spot it |
| **Arrange** (tap item → tap spot, or into the triple-match tray) | Tidy up, Lay the table, Makeover |
| **Choose** (hear options, pick one; deduction) | Who's at the door, Mini-mysteries |

**A shared meta layer ties them together:** coins from *any* mode buy upgrades for Nani's house, the stall and the kitchen (new recipes, décor, stall items), plus stars and personal bests per mode, a streak and a daily request. This is Good Pizza's upgrade loop spread across all the modes, and it's what makes people rotate through every mode rather than only their favourite.

### What actually makes these genres addictive (build it into every engine)

- Rounds of 60–120 seconds.
- Difficulty that ramps within a round.
- Combo or streak multipliers.
- Instant, "juicy" feedback: pops, bounces, sounds.
- Failure is soft; you retry immediately.
- A visible upgrade path.
- A collection to complete.

### Honest cost and risk

- **The fun is found by playtesting, not by design documents.** Each engine gets a rough greybox prototype first (plain shapes, placeholder audio, about 1–2 days with Claude), played by children, and is kept only if they want another go.
- **Quality over count:** ship 3–4 great engines rather than 8 modes. Suggested order: time-management (kitchen rush, then stall rush), search, arrange, choose.
- **Art per genre:** hidden-object scenes need dense, cluttered art (AI does this well); time-management needs layered dish and item parts.
- **Audio:** each genre needs spoken instructions built from recorded chunks; the family's recording time stays the limit.

### Other languages later

The content model is already language-agnostic: words and sentences have ids and come from a spreadsheet, and audio is one file per id. Plugging in a popular language (Spanish, Arabic, Hindi, Mandarin…) is mostly:
- a new content sheet, recordings from paid native speakers, and per-language sentence templates (plural and gender rules differ);
- the art and engines reused as they are.

**Keep this possible cheaply now:** never hard-code Kutchi-specific grammar in the engines; keep templates in data. The market for big languages is crowded (Duolingo ABC, Lingokids, Gus on the Go), and **"real games, not flashcards"** would be the differentiator.
