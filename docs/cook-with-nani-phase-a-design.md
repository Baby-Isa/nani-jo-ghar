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
