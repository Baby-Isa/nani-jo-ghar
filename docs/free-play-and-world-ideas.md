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
