# Cook with Nani: design decisions after the first playtest, and the Phase A plan

**Date:** 24 Sept 2026
**Status:** agreed with Zafar. Phase A is in progress.
**Context:** Zafar and his wife played the overnight proof of concept (`cook.html`, see `docs/cook-with-nani-build-log.md`). This records the design discussion that followed, so nothing is lost.

---

## 1. Strategy (agreed)

**Make Cook with Nani genuinely good first, then add the other game modes one at a time.** It is the flagship and appears in every story arc. Three conditions:

- **"Done" means:**
  - a child asks for another go without being prompted;
  - **the wife's test:** someone who doesn't know Kutchi can't earn the "understood" star by memorising patterns;
  - an adult's word dots visibly climb over a week.
- **Mechanics and learning first, art second.** Art multiplies whatever is underneath.
- **Build the shared parts for reuse:** the word pill, the voice pipeline, the asset pipeline, the hint and per-word engine, stars and pocket money, hands. Find it, Tidy up and the rest reuse all of them.

**Order (agreed):**

| Step | What |
|---|---|
| **Phase A** | Shared systems, then the **whole station library** (mechanics only, placeholder art), then recipes as data. Iterate with feedback until it makes sense and teaches Kutchi |
| **Asset run** | Only once every station is settled, because hand poses and ingredient states repeat across stations. Art bible, then the image API pipeline, then review |
| **Voice** | Later: family recordings replace the Gujarati placeholder file by file |
| **Then** | The next mode (Find it, the bazaar) |

## 2. Visuals: what was wrong, and how we'll fix it

**Diagnosis of the proof of concept (Claude agreed with all of Zafar's points):**
- The rolling screen had a chakla on top of a chopping board: two boards.
- Items on the stove "stood" on the worktop's lip, which is its shadow, not a surface.
- The props were drawn at about 30° from the side; the hob was drawn at about 60° from above.
- Pantry items were drawn from above but sat on eye-level shelves. The scale was wrong (cardamom as big as the milk jug) and the top shelf floated.
- Liquid was a flat oval; the flames were blue dots; the gauges floated on the hob; the glass stood on the hob.

**Root cause:** the props were generated for one generic angle and pasted into backgrounds drawn from other angles. The QA only checked "is anything covering a tap target?", never "does this look believable?".

**Fixes (agreed direction):**
1. **One camera per station. All cooking stations look straight down**, like Cooking Mama and Good Pizza, Great Pizza. That way:
   - tools rotate in code (8 knife directions from 1 image);
   - liquid fills as a disc;
   - hands come up from the bottom of the screen.

   Straight-on views are kept only for the family at the island and the pantry shelves.
2. **An asset matrix, not generic views.** Each item gets only the views and states the game uses: typically a front view for the shelf, top-down for the station, plus its cooking states. Generating 6 to 8 views per item wastes money and invites the style to drift.
3. **First-person hands.** Rigid hand images moved in code: knife up and down, ladle round, rolling pin back and forth, spatula flip, jug tilt, palms pressing, a grabbing hand. There's no finger animation. All hands come from one sheet with one reference hand, with a Kutch-embroidered kurta cuff as the signature.
4. **Image API pipeline** (OpenAI image API, transparent backgrounds, reference images for style):
   - an asset list as data, run by a Python script that waits between requests, retries, resumes and has a spending cap;
   - contact sheets reviewed by Claude, with rejected images regenerated;
   - Zafar signs off one station before the rest are generated.

   **"Edit in place":** give the model the empty station and ask it to add the item, then cut out the difference. The item comes back already at the right angle, scale, light and shadow. Cost is roughly $15 to $60 for about 300 images. Runs overnight on Zafar's laptop, or here with the key as a secret.
5. **A visual QA checklist** on every screenshot:
   - camera angle matches the background;
   - the item touches a surface and has a shadow;
   - scale matches a reference item;
   - no doubled surfaces;
   - the thing to tap is obvious;
   - the timing cue is where the eye already is.

## 3. The learning link (the big one)

**The wife's critique:** you can do well by pattern recognition. We audited every step:

| Step | Needs Kutchi? | Why |
|---|---|---|
| Greeting | Barely | Same exchange every time |
| Which dish | Briefly | Only 3 words |
| Pantry basics | **No** | Recipe memory |
| Extras (elchi, tameto) | **Yes** | They vary |
| Counts | **Yes** | Number words |
| Stove sequence | **No** | Fixed order |
| Tadka order | **Yes** | Changes each day |
| Stir count | **Yes** | Number words |
| "The usual" | **No** | People memory |
| Gestures, serving | No | Hands only |

About a third of play needed the language.

**Principle:** nothing the player does may be decided by memory of a fixed recipe. Every choice is set by something said in Kutchi, and it changes from order to order.

**How:**
1. **The order is the recipe.** Every dish has variable slots given only in Kutchi:
   - **chai:** milk or none, how many sugars or none, elchi, ginger or masala, how many cups;
   - **daal:** tadka spices, tomato, onion, chilli (each yes or no), salt;
   - **maani:** how many, ghee or not.
2. **Nani interrupts: "pass me…"** (Zafar's refinement: she slides in from the edge mid-cook and names an item; three look-alike items appear; tap the right one).
   - Busy mode: the pan keeps cooking, which is the fun chaos.
   - Relaxed mode: the cooking **pauses** (agreed).
   - Her requests draw on the **whole vocabulary**, which doubles as spaced review.
3. **Look-alike decoys:** sugar next to salt (khun and loon), water next to milk, cumin next to mustard seeds.
4. **"No" and "not":** "chai, no sugar" can't be done on autopilot.
5. **Words Nani says while you work:** enough, more, a little, big, small, just right, slowly, quickly. Heard exactly when they apply (Total Physical Response).
6. **Serve to the right person:** "this is for Nana" (kinship).
7. **End-of-day recall:** "what did Ma have?"
8. **Later: swap roles** (you order from Nani).

**English for missing words:** use English until the family supplies the Kutchi, shown in a distinct style (grey italic) so it's obvious and easy to swap.

## 4. The word pill and item labels (agreed)

**One consistent design in three shapes:**
- **Full pill** `[speaker] Kutchi [translate]`: speech, the mission card, the notebook.
- **Item label:** small and semi-transparent, sits under an item, tap to hear. No translate button, because the picture is the meaning.
- **Choice pill:** big and tappable, for "pass me" and greetings.

**Spices and small ingredients are heaped in open bowls with labels** that fade to a speaker button as the word is learned.

**A word shows as text in only one place at a time**, otherwise players match letter shapes instead of understanding:

| Word stage | Mission card (the instruction) | Item label (the help) |
|---|---|---|
| 1. New | Text and speaker | Text and speaker, item glows |
| 2. Learning | Text and speaker | Speaker only |
| 3. Nearly known | Speaker only (text shown as dots) | Speaker only |
| 4. Known | Heard once; replaying costs the "no help" star | None |

## 5. Greetings and small talk

- A **small set of exchanges, each with one right answer:**
  - peace be upon you / reply
  - how are you / I'm fine
  - "can you make me some daal?" / yes or no (answer "no" if daal isn't learned yet)
  - is it hot / yes
  - thank you / you're welcome
  - bye / bye

  They vary by person and time of day.
- **Mastered phrases stop being asked.** You still hear them; only an occasional one tests you again (spaced review).

## 6. Stars, the mission card and pocket money (agreed)

**Three different stars**, shown as cut-outs on the mission card that fill in as you cook:

| Star | Earned when |
|---|---|
| Ear: *understood* | Everything asked for, right counts, right person. The big one |
| Hand: *cooked well* | Poured to the line, nothing burnt or spilt, flipped on time |
| Lightning: *quick* (Busy) or tick: *no help* (Relaxed) | Speed, or no hints and no translate used |

- The mission card also fills in step by step. At the end it's stamped and becomes a **completion card**, and a day's cards form a collection.
- **Pocket money:** Nani says "I'll give you pocket money for helping. Get it all right and be quick and you get more; burn or spill it and you get less." Each order pays a receipt: *helping + each star*. You never lose money you already have.
- **Success goals are shown at the start**, one line per station the first time ("stop at the line", "flip when it's golden").

## 7. Making the actions clear

- **Pour:** a dashed fill line drawn **inside** the pan or glass, the liquid rising inside it, and the pouring sound rising in pitch as it fills. Nani says "enough" at the line.
- **Watch and tap** (boil, fry, tawa, grill): a **ring round the food** that fills like a clock, with a green section for "now". Real cues (bubbles, brown spots, sizzle, steam) arrive together.
- **Flip:** spatula hand, ring timer, golden spots; the second side puffs up.
- **Roll:** hands on the rolling pin, forwards and back, a dashed target circle that turns green and pings; overdoing it tears the dough.
- **Chop, Fruit Ninja style (Zafar's idea):** vegetables are tossed up; Nani says *which* ones and *how many* ("only the tomatoes", "three onions"). Slicing the wrong one is "Arre re!", no damage. More items and faster throws as you improve.
- **Stir (Zafar's idea):** count *and* speed. "Stir three times, slowly"; a speedometer arc with a target zone; laps counted aloud.
- **Every station, the first time:** a see-through fingertip demo plus a one-line goal. The cue is always on the object, never in the sidebar.

## 8. The station library (verbs)

A station earns its place only if **it's fun on its own and at least one of its settings comes from Kutchi.**

| Verb | Mini-game | Where the Kutchi comes in |
|---|---|---|
| Fetch (pantry) | Tap the named item | Nouns, counts |
| **Pass me** (interrupt) | Pick from 3 look-alikes | Nouns, review of any word |
| Pour | Hold, let go at the line | Half, full, enough, more |
| Watch and tap | Tap when ready (boil, fry, tawa, grill) | "It's boiling", golden, take it out |
| Count in | Tap N times (spoons, pieces) | Numbers |
| Knead | Press and squash | Numbers |
| Roll | Rolling pin to the circle | Big, small, thin |
| Flip | Spatula at the right moment | Flip it, ready |
| **Chop (ninja)** | Slice what's thrown | "Only X", counts |
| Tadka order | Spices in the spoken order | Sequence |
| Stir | Count and speed | Numbers, slowly, quickly |
| **Assemble / plate** | Layers in the spoken order | Sequence, likes, "no X", who it's for |
| **Fill and fold** | Named fillings in, fold along the lines | Nouns, counts, "no chilli" |
| **Fry (several)** | Drop in, lift each when golden | Counts, which ones |
| **Thread** (skewer) | Items onto a stick in the spoken order | Sequence, colours |
| Garnish | Sprinkle where told | Positions (on top, in the middle) |
| *Later:* pipe (jalebi), grind, churn, pat (bajra rotlo) | Rhythm and shape gestures | Counts, shapes |

## 9. Dishes (Kutch and East African Khoja kitchens)

**Phase A builds:** chai, maani, daal, plus **chaat bowl**, **samosa** and **mishkaki** (agreed).

| Dish | Verbs |
|---|---|
| Chai | Pour, watch, count |
| Maani / chapati | Knead, roll, flip |
| Daal (or khichdi and kadhi) | Chop, tadka, stir |
| **Chaat bowl / chana bateta** | Assemble in order, garnish |
| Dahi puri / sev puri | Fill, count, garnish |
| **Samosa** | Fill and fold, fry |
| **Mishkaki with chips** | Thread, grill-flip, fry |
| Chips mayai | Fry, pour, flip |
| Mogo with chilli and lemon | Chop, fry, garnish |
| Makai (corn on the cob) | Grill-turn, garnish |
| Mandazi | Roll, cut into N, fry |
| Dabeli | Fill and assemble (bazaar chapter) |
| Falooda | Assemble in layers |
| Jalebi | Pipe a spiral, fry, soak |
| Sheer khurma (Eid) | Pour, stir, garnish |
| Biryani / pilau | Layer, stir (feast days) |

## 10. Why this scales

1. **A recipe is data:** station calls with slots (what, how many, which order, how, for whom). Orders fill the slots from each customer's tastes and the player's word stages.
2. **Every station must have a Kutchi-driven setting.**
3. **Every station has twists**, so it doesn't feel stale when it comes back.
4. **Three or four stations per order**, about 2 minutes. Big dishes are for special days.
5. **Looking straight down** means tools rotate and hands are reused, so new dishes are mostly ingredient art.
6. **Every mode has a story route and a free-play route from the title screen.** The story route teaches a fixed sequence (a day, a level); the free-play route is open-ended, generates its own orders/rounds leaning towards the player's weakest words, and always gives the player an explicit way to end the session (e.g. Cook's "Close the kitchen") that leads into the same summary and pocket-money flow as the story route. Wave 3's open kitchen (below) is the first example.

## 11. Phase A checklist

**Shared systems:**
- the three pill shapes and stage-fading item labels
- the mission card with star cut-outs, which becomes the completion card
- pocket money and success goals
- Nani's "pass me" interrupt
- varied greetings and questions

**Stations:**

| Status | Stations |
|---|---|
| Rebuild | Pour, watch and tap, flip, chop (ninja), stir (count and speed) |
| New | Assemble, fill and fold, fry, thread |

**Recipes as data:** chai, maani, daal, chaat bowl, samosa, mishkaki.

**After each step:** the "can you win without Kutchi?" audit and Zafar's feedback.

**Words needed from the family** (English placeholders until then) are in `docs/Nani jo Ghar — Questions for Mum (Round 2 — Cooking).md`.

---

## 12. Phase A: what was built (24 Sept 2026)

Open `cook.html`. **Station lab** on the title screen runs any station on its own, with a random order each time. Tick "Nani helps" for the first-time guidance.

**Shared systems:**
- **Word pills** `[speaker | Kutchi | translate]` everywhere: speech, the mission card, choices, "pass me". English placeholders are grey italic and spoken in an English voice; Kutchi uses the half-speed Gujarati placeholder voice.
- **Item labels** under every ingredient bowl. They fade by word stage (text, then speaker only, then none). Tap to hear.
- **The mission card:**
  - the order as pills; well-known words show as "•••" so you have to listen;
  - ticks as you add things;
  - step chips;
  - three star cut-outs (ear, hand, lightning in Busy or tick in Relaxed) that fill or grey out *as it happens*;
  - stamped "Served!" at the end.
- **Completion cards** at the end of the day, with the reasons ("Ear: 2 khun, they asked for 3").
- **Pocket money** as a receipt: 5 for helping, then +5 ear, +3 hand, +3 lightning/tick, plus upgrades. Nani explains the three stars once, before day 1, and nobody ever loses money.
- **Nani's "pass me"** (*Muke hikdo … dine*):
  - she slides in with three look-alikes;
  - she asks for any word you've met, weakest first;
  - Relaxed pauses the cooking; Busy keeps it cooking (the pan can boil over while you help her);
  - it happens mid-boil, mid-tawa and between stations.
- **Small talk:** peace be upon you, how are you (placeholder), "can you make me …?" (placeholder). Phrases you've answered right 3 times are just heard, with an occasional re-test.
- **First-time help:** a goal line per station (in the sidebar, never over the game), a see-through fingertip demonstrating the gesture, and verdict words on the action ("Perfect!", "Too much!", "Burnt!", "It puffed!").

**Stations (16):**

| Station | How it plays | Where the Kutchi comes in |
|---|---|---|
| Fetch | Pantry with look-alike decoys | The order's items |
| Pass me | See above | Any known word |
| Pour | Dashed fill band inside the pan, liquid rising, pitch rising | Water/milk; *no dudh* |
| Boil | A ring around the pan; tap the knob or pan in the green | — |
| Count in | Tap the sugar (next to look-alike salt and flour), then ✓ | *bo khun* / *no khun* |
| Knead | Hands press the dough | — |
| Roll | Two hands on the pin, drag up and down to the circle; overdo it and it tears; decide how many | *trae maani* |
| Tawa | Ring on the chapati; the spatula hand flips it; tap again to puff | — |
| Chop | Fruit Ninja: vegetables fly up; slice only those Nani named, as many as she said | *only bo dungri* |
| Tadka | Spices (heaped bowls, labelled) into hot oil in Nani's order | The sequence |
| Stir | Ladle hand, laps counted aloud, speedometer | Number + *slowly* / *quickly* |
| Assemble | Chaat toppings in the customer's order; "no X" means leave it out | Sequence, *no X* |
| Fill | Fillings named by the customer; leave out the "no" ones | Nouns, *no X* |
| Fold | Swipe along three dashed lines | — |
| Fry | Several in the oil at once, each with its own ring; lift each when golden; more on the tray than asked for | Count |
| Thread | Pieces onto the skewer in order | Sequence |
| Grill | Ring timer; turn twice | — |

**Recipes (data with variable slots):**

| Dish | Slots |
|---|---|
| Chai | Cups, milk or no milk, sugar count or none, elchi or ginger |
| Maani | How many |
| Daal | Onions and tomatoes to chop, tadka order, stir count and speed |
| Chaat bowl | Topping order, "no X", potatoes to chop |
| Samosa | How many, fillings, "no X" |
| Mishkaki | Skewer order, chips or not |

Customers have tastes: Nana, no chilli in his chaat; Ma, no milk and ginger in her chai; Ali, extra sev.

**Six story days:** chai (Nani's demo first), maani, daal, chaat bowls, samosa, Eid mishkaki. Then free cooking (an open kitchen) and quick orders.

**Free cooking is Nani's open kitchen (Wave 3):** customers keep arriving on their own — a gentle queue in Relaxed, overlapping a little sooner in Busy — each with a generated order leaning towards the player's weakest words (existing spaced-review logic, unchanged). A "Close the kitchen" button in the sidebar is always there while it's open; pressing it stops new customers arriving (finishing whoever's already ordering) and goes straight into the usual day summary and pocket money. "Quick order" is unchanged: one customer, then the summary, no closing needed.

### 12b. What's built now (after Waves 1–3, checked in Wave 4, 25 Sept 2026)

The Phase A list above is the first build. Since then the stations have become building blocks, and the story dishes run on combined stations:

- **Building blocks.** Each verb is one mechanic file (`js/cook/mechanics/`). It can run on its own or inside a zone of a combined station (`js/cook/zone.js`). Difficulty levels are data (`data.mechanics.<id>.levels`; a combined station's in `data/stations/<id>.json`). Recipes are wholly data: slots, what's said, the ladder, the steps.
- **Order ladder** on the order card: speaker · word or "•••" · 👁 · translate per row. One dot per item, never per unit. A dashed line means a sequence, and *ne poi* is said for it. "No X" rows are placed at random. A person's rows carry their face (the Chai tray). Hidden words next to each other share one "•••".
- **Help costs.** Being shown the answer costs the ear star: the hesitation glow, the highlight after two misses, 👁, translate (including "pass me"). Hearing it again costs the no-help star. Busy help drains the patience ring.
- **Result card:** stars on the left; on the right, "they asked / you did" in Kutchi pills and one "next time" tip per missed star.
- **Combined stations** (one screen, several zones):
  - **Chai tray** (chai, all levels): water, tea, then light the knob on the back burner. Each person says their cup (milk or not, sugars or none, and from level 3 an extra and half or full). Milk jug, sugar bowl and salt are there for every cup. The knob must be turned down on the green. Pour each cup to a line, then the tick. Graded per cup, per person, with a recast from that person.
  - **Maani line** (maani): two dough bowls (maani, bajr jo maani) → chakla → tawa (two tawas from level 2, big/small from level 3). How many of each is spoken. You press the tick.
  - **Mishkaki grill** (mishkaki): the threading board feeds a rack. Each skewer has its own ring on the grill: turn it twice, then lift it. The chips basket is always offered. The plate is graded per kind and count.
  - Roll → Tawa: the lab's proof of zones.
- **Keepers, polished:** the chaat glass bowl (visible layers; the customer checks layer by layer); chop with a mid-round switch, look-alikes, graded afterwards (rounds in random order since Wave 4); tadka burns if you're slow and hides the order at higher levels; samosa fill (spoons per filling) → fold as many as you decide → fry (the tray holds extra; "lift the samosas, leave the chips" at level 3); stir on a track with a fixed speed dial.
- **Pass me** in the sidebar (never over the game), in the pantry (never a word from the order) and at the slower stations.
- **Open kitchen** is free cooking: customers keep coming until you close it.
- **The pantry (fetch)** is now only in the Station lab: no story recipe fetches any more (each station lays out what it needs, decoys included).
- **Tests:** `build/test_cook.py` plays every station at levels 1–3 (`--lab`, `--level`), combined stations, the story days (`--days`, `--canvas` for speed), the open kitchen and the order model (`--orders`), at six screen sizes.

## 13. Audit: can you win without understanding the words?

| Decision | Before Phase A | Now |
|---|---|---|
| Chai: milk? how much sugar? extra? how many cups? | Only sugar count and elchi varied | **All vary, all spoken** |
| Pantry | Basic items were recipe memory | Every item comes from the order; look-alike decoys (sugar/salt, water/milk, cumin/mustard) |
| Tea leaves at the stove | Fixed step | Picked from look-alike bowls |
| Maani | Count | Count |
| Chopping | Not language | **Which vegetable and how many** |
| Tadka | Order | Order |
| Stir | Count | Count **and speed** |
| Chaat, samosa, mishkaki | — | **Sequence, fillings, "no X", counts** |
| Nani's "pass me" | — | **Any word, any time, look-alike choices** |
| Timing (boil, tawa, fry, grill), kneading, folding | Hands only | Hands only (by design: the fun break between listening) |

**Status after Wave 3 (Wave 4 check, 25 Sept 2026):** see `docs/cook-with-nani-kutchi-audit.md`, section "After Wave 3". Every system-level leak from the pre-wave audit is closed: help costs, fixed step chips, optional steps always offered, counts never shown, fixed dial bands, random decoys, a ladder whose shape gives nothing away. Wave 4 fixed the last two small ones: the dot groups on the card, and the fixed first chop round. What's left:

| Leak | Severity | Owner |
|---|---|---|
| Decision words still English placeholders (*no*, *slowly/quickly*, *half/full*, *big/small*, *vegetable/mixed*, *only/now*, *lift/leave*, several toppings) are readable and heard in English | High | The family's words (Round 2) |
| Chai tray: cups only for the people ordering, and each speaks with their own face, so the count and "who" are given (kinship words decide nothing yet) | Medium | Next Chai tray pass |
| Stage-2 label speakers are free, so you can match sounds | Medium | Later |
| Serving to the right person is checked only on the Chai tray | Medium | Open kitchen pass |
| Chaat always holds chickpeas and potato; tea is always *chai*; no ghee slot | Low | Data / later |

**Remaining weaknesses (Phase A list, still true):**
1. **Placeholder words.** Dishes and toppings still in English (chickpeas, yoghurt, mince…) are "understood" by any English speaker. The family's Round 2 answers fix this.
2. **Stage-1 reading.** A brand-new word is shown as text on both the card and the label, so a reader can match letters the first time. That's intended (it's how it's taught), and from stage 2 the label is speaker-only.
3. **The placeholder voice is Gujarati**, so pronunciation isn't Kutchi yet.

## 14. Open questions for Zafar

- Station feel: which stations are fun, which are fiddly? The Station lab is the quickest way to judge.
- Timing windows (boil about 1.2 s, tawa about 0.9 s) and ninja speed: too hard for a 5-year-old?
- Should "pass me" also happen in the pantry, or only at the stove?
