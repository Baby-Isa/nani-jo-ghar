# Monsoon rush: design (mode 7, core verb **react**)

**Date:** 25 Sept 2026
**Status:** proposal for Zafar. Nothing built. It follows `docs/modes/MODE-DESIGN-BRIEF.md` and builds on `docs/game-modes-v2.md` (mode 7), `docs/find-it-design.md` (the model), the Cook audit (`docs/cook-with-nani-kutchi-audit.md`) and Zafar's playtest waves (`docs/cook-with-nani-todo.md`).
**Placeholder rule:** the only Kutchi below is what is already in `data/content.json` or `data/cook.json`. Anything written `[EN: under]` has no Kutchi yet: in the game it's an English placeholder in grey italic until the family gives the word. **Never invent Kutchi.** Section 6.6 lists every word needed.

---

## 1. Pitch and core loop

**Pitch.** A Kutch monsoon hits Nani's house. The roof drips, the washing is out, the goats and hens are in the yard and the cats won't come in. Nani can hear and see what's coming before you can: she calls it in Kutchi, and you act **before the world shows you**. Get the bucket under the drip before it falls, pull the tarp before the rain arrives, open your arms where Simba is about to pop out. It exists for **S4** (weather, rooms, farm animals) and **S2** (position phrases, household nouns, imperatives), and its verb is **react**: understanding a spoken word *fast*, which is what fluent listening is (section 2.2). Nothing ever floods, nothing is lost and there's no game over; being quick only makes Nani prouder and the house drier.

**The one rule that makes it a language game: audio leads, the world follows** (Rhythm Heaven's principle). Every call opens a window. The world only shows the answer at the end of that window (the *reveal*: the drop falls, the rain arrives, the cat pops out). **Only what you did before the reveal counts for the ear star.** After the reveal you can still dive and save things (that feeds the craft star and the fun), but you've been shown, so it isn't "understood". While the window runs, every candidate shows the same countdown (every ceiling stain swells, every bush rustles, every shirt on the line flaps), so the visible timer never points at the answer.

**One round (60–120 s, a "storm")**
1. **Intro card** (Wave 5 rule): Nani's face, the goal as a picture sequence (ear → tap → plink), and one line per **new** word with its speaker (text at stage 1). It shrinks into the sidebar.
2. **Three seconds of quiet:** rain on the window, the room settles, you look around.
3. **Waves on a beat.** Nani calls 1–3 targets ("*Hedo! Dudh!*"; later "`[EN: kitchen]` `[EN: next to]` `[EN: stove]`"). Everything that could be the answer wobbles together. You tap to place, pull, hold or catch. The reveal comes on the beat; the drop plinks into your bucket (or splashes, "*Arre re!*", comic puddle).
4. **The storm builds** (WarioWare speed-up): every four waves the tempo steps up a little and a twist may appear (a double call, a switch, a power cut).
5. **Storm passes:** stars filled as they happened, the pocket-money receipt, the **word review** (each Kutchi word called, with its English, heard ✓ or missed with a replay).

**How it differs from Cook and Find it (and the modes nearest to it)**

| | Cook's chop (Fruit Ninja style) | Find it | Tidy up | **Monsoon rush** |
|---|---|---|---|---|
| Verb | Build: swipe to slice what's thrown | Search: scan, then tap | Arrange: place precisely to a rule | **React: act on a call before the world shows it** |
| Targets | A stream of flying items, many of each | Hidden among clutter | Items and surfaces, calm | **Few, big, obvious** places and things; the challenge is *which* and *when*, never *finding* |
| What the Kutchi decides | Which vegetable, how many, the switch | Which one, where (noun, count, position, colour) | Where each thing goes, by a rule | **Where, which, or what to do, under a beat** (room, anchor, position, weather word, animal, shelter) |
| Time | A countdown ring on the board | None (combo par only) | None | **A beat grid**; the window is the game; Drizzle waits for you |
| Gesture | Swipe through | Tap (plus pan, open) | Drag and drop | **Tap to place, pull, press-and-hold, catch, shoo**; never a slice, never a pan |
| Camera | T (or E against the splashback) | E, a detailed panning scene | T or E | **E, side-on room cross-section, one screen, no pan** (art bible) |
| Fun | Slicing juice, volume | "Found it!" | Satisfying order | **Anticipation**, near-misses, plinks, comic chaos, getting *faster* |

**Staying clear of Cook's chop:** no thrown or flying targets anywhere in this mode (the draft's flying washing was cut in loop 1 for this reason). Chop asks "which of these flying things, how many"; Monsoon rush asks "where will it happen" about places that don't move, or about a creature you can't see yet.

---

## 2. Research summary

Sources are search summaries (pages not opened); links at the end.

### 2.1 Proven hits: what we borrow, and why

| Reference | Concrete mechanic | Why it works | What we take (and don't) |
|---|---|---|---|
| **Rhythm Heaven** (Nintendo, Tsunku) | Inputs are prompted by **audio cues**, not visuals; views are sometimes blocked on purpose; call-and-response; 60–90 s per game; a "night mode" with no visuals at all | Players learn to trust their ears; misleading visuals make listening the skill | **The core rule:** audio first, the world later. The veranda roof hides the sky (M6); cats run behind a wall (M4); the power cut (M10) is our night mode. 60–120 s storms |
| **WarioWare** microgames | A one- or two-word instruction ("Catch!"), then about 4 s (8 beats) to do it; speed rises through a run | The instruction must be understood in a split second; the beat grid makes it learnable | **A beat grid**; one short call per wave; speed steps up every four waves. The instruction is Kutchi, not a verb in English |
| ***Kaboom!*** (Activision, 1981) | Catch the bombs in buckets; the Mad Bomber speeds up through eight levels | Simple verb, steady escalation, "one more go" | Buckets as the catch tool; tempo levels. **Not** copying: bombs, losing buckets, game over |
| ***Overcooked*** (Ghost Town Games) | Kitchens that change mid-round (sliding counters, earthquakes); players must call things out and adapt; designed for shouting and pointing round one screen | Chaos plus clear roles is funny, not stressful, when failure is cheap | Twists that change the house mid-storm (a new leak, power cut, the shed door sticks); **Grandparent caller mode** (M11) is our couch co-op: one person shouts, one acts |
| ***Fruit Ninja*** (Halfbrick) | Zen (no bombs), Arcade (60 s with power-ups); bombs cost points in Arcade instead of ending the run; combos; big juice | Instant feedback carries the whole game; a no-fail mode for relaxing | Juice (the plink, splash, steam puff), a streak, and **penalties that cost points, never the run**. **Not** taking the slice or the flying objects: Cook owns them |
| Rhythm-game **judgement windows** | Perfect / Great / Good bands in ms; assist options widen them; windows are data | Tight top band for mastery, forgiving bottom band for everyone | Windows as data per level; a generous "good" band; a tighter band only for the lightning star |
| ***Keep Talking and Nobody Explodes*** | One player sees the bomb, another has the manual; they must talk | Asymmetric information forces communication | **M11:** the adult (or Nani) sees the next drip and says it in Kutchi; the child acts |
| ***Plants vs. Zombies*** (George Fan, GDC 2012) | Teach with visuals, not words; the tutorial is hidden in play; new tools arrive slowly | His mum played it through | Level 1 *is* the tutorial: one room, one bucket, a ghost fingertip once; new twists one at a time |
| Herding arcade games (*Flock Herder* and similar) | Animals flee from you; get behind them and they run the other way | Emergent, funny, physical | The **shoo** gesture (M3): swipe behind an animal and it trots that way. No boids pens or fiddly dragging |

### 2.2 Language-learning evidence for the verb "react"

| Finding | Evidence | What it means here |
|---|---|---|
| **TPR:** acting on spoken commands builds listening comprehension and vocabulary, lowers anxiety and suits young learners | Liu et al. 2024 (young EFL learners, personalised TPR); ERIC study of TPR with young learners; Asher's method (Wikipedia) | Every call is a command you act on with your body. Calls recombine known words into new commands (room × anchor × position) |
| **Speed of spoken-word recognition predicts vocabulary growth** (processing efficiency) | Fernald et al., looking-while-listening: faster recognition at 18–25 months predicts later vocabulary and language outcomes; efficient late talkers "bloom" | Fast recognition isn't a party trick; it's a sign of real learning. The lightning star and per-word best times measure it |
| **Automaticity:** L2 word recognition gets faster *and more consistent* with practice; the fall in reaction-time variability (CV) marks true automatisation; processing speed matters for L2 listening | Segalowitz and colleagues, *Applied Psycholinguistics* | Track each word's reaction time *and* its steadiness. A word whose recognition becomes steady earns a raindrop badge in the notebook (section 7) |
| **"Simon says" self-regulation** (Head-Toes-Knees-Shoulders): listening carefully and inhibiting the automatic response; performance predicts vocabulary and literacy | McClelland, Oregon State (US, Taiwan, China, S. Korea) | Go/no-go calls from level 2 of M6 ("it's raining" when the tarp is already on: do nothing). Switches in M1 ("not there!") |
| **Listening anxiety** rises with speech rate and time pressure and eats working memory | TESL-EJ 2023 and related studies | Timers are gentle and scale with the word's stage; **Drizzle** (Relaxed) has no timer at all; new words get an extra beat; never a fail state |
| **Children are slower:** simple reaction time at 5–8 is about 2–3 times an adult's; near adult by 10–11 | Developmental RT studies (e.g. PubMed 18359494) | Level 1 window ~4 s after the key word; Drizzle for 5-year-olds; tempo by level and by the player's own history, not by age alone |
| **Accessibility:** offer adjustable game speed; don't make precise timing essential | Game Accessibility Guidelines | Tempo is a setting; the ear rule works at any tempo (it compares with the reveal, not the clock) |
| **Prompts beat recasts**; spaced retrieval (from the Find it research) | Lyster and Saito 2010; Fritz et al. 2007 | After a miss: a short recast, then the **same call returns 2–4 waves later** for the player to answer themselves |

---

## 3. Mechanic library

Scores 1–5. "Forces Kutchi" names the decision, the leaks and how they're designed out. All mechanics share one engine (the **call timeline**, section 8), the way Find it's rows share one search engine; each has its own gesture and feel.

| # | Mechanic | How it plays | Fun | Forces Kutchi | Distinct | Plot | Replay |
|---|---|---|---|---|---|---|---|
| **M1** | **The leak** (buckets under the drips) | Ceiling stains over places in the house. Nani calls where the next drip will land; tap the spot and the bucket (or the lid) swings there; the drop plinks in. L1 the **kitchen slice**: drips over open pots of food, Nani names the food, tap to lid it. L2 rooms of the house cross-section. L3 room + anchor + position, anchors duplicated across rooms; doubles with *Ne* and sequences with *Ne poi* | **5.** Plinks and splashes, tempo escalation (*Kaboom!*), comic near-misses, Ali sloshing out full buckets (*Overcooked* chaos) | **5.** Decision: **which place** (food noun at L1; room, anchor, position later). Leaks designed out: every candidate stain swells together; only commits before the reveal count; buckets only exist during a live call (no camping), and lids pop off after each wave (no elimination); one answer per target (no spamming); mono drip sounds (no stereo clue); Nani in the sidebar, never pointing; calls uniform across spots; English-known food words (*chai*, *daal*) excluded from the tested pool | **5.** No other mode has timed anticipation of a place. Cook's pass-me names a noun too, but here the noun is a *place under threat* on a beat | Arc 3 Ch2 **The leak** (flagship); a cameo in Ch5 **Chai together** (the kettle corner still drips) | **5.** Rooms × anchors × positions × tempo; twists (new leak, switch, double, power cut); the rain gauge fills; best times per word |
| **M2** | **Unpeg it** (washing in) | The washing line under the veranda edge: kurtas, dupattas, Nana's cap, towels, a kanga. All flap in the same gust. Nani calls which one the rain will hit first; tap-and-pull it into the basket before the reveal | **4.** Grabbing and pulling is physical; things flap; the family is at the line too | **4.** Decision: **which item** (clothes noun, then + colour, then + whose). Leaks: an item's colour on the call (none: audio only); the rain front sweeping left to right (none: the rain hits the called item, not a front); only one red thing (≥2 of each colour, ≥2 of each noun from L2); pulling everything (one answer per call; extras count as wrong) | **3.** Same engine as M1, different nouns and a pull. **Deliberately static:** the draft's flying washing was too close to Cook's chop | Arc 3 Ch1 **Clouds coming** | **3.** Clothes × colours × owners; laundry day comes back in Arc 5 |
| **M3** | **Into the shed** (goats, hens, chicks) | Thunder: the animals bolt from the gate. Nani calls one animal and a shelter (shed, coop, veranda, kitchen door). Swipe behind it (**shoo**) and it trots that way. Chicks are never shooed: scoop them with cupped hands and set them where she says | **4.** Comic animals (a goat that bounces, a hen that flaps into the coop, chicks tumbling into the basket); gentle | **4.** Decision: **which animal, which shelter** (later how many: "*bo* `[EN: goat]`"). Leaks: the animal kind predicting the shelter (every kind can go to every shelter; the generator balances it; story reasons: "the shed leaks at the back today"); animals bleating when called (sounds are random and uniform); the shelter door closing by itself at the count (never; Nani's "enough" only while the number is at stage 1–2) | **3.** Tidy up places things; this is a quick dispatch of runaways, nothing stays arranged. Only one or two animals bolt per wave, so it's never chop's stream | Arc 3 Ch3 **The animals** (Find it then finds the chicks that hid indoors) | **4.** Animal mixes, shelters that change, counts, the farm storm in Arc 5 |
| **M4** | **Cats inside** (Simba and Zazu) | The cats dart between hiding spots behind a low wall (you can't see the run). Nani, at the window, calls where one will pop out. Tap there: your arms open, the cat pops out on the beat and leaps in, and you carry it in. Cats being cats, they slip out again | **5.** Zafar's own cats, a whack-a-mole with personality (Simba heavy and slow, Zazu doubles back); the catch is a hug | **4.** Decision: **which spot** (anchor + position). Leaks: Simba's collar bell (silent during the run, rings only at the pop); rustling (every hiding spot rustles together); the cat's path (behind an occluder); the next spot always near the last (uniform). The names Simba and Zazu aren't Kutchi, so from L3 "`[EN: the big one]` / `[EN: the small one]`" decide which cat | **4.** Find it hides cats in a still scene; here the cat is moving and you anticipate it | Arc 3 Ch1 **Clouds coming** (get the cats inside before the rain) | **4.** Spots shuffle per round; two cats at once; the monsoon album's cat moments |
| **M5** | **Batten down** (the verb decides) | Mid-storm, Nani's call is a command: close the window, cover the pot, light the lamp, bring in the chair. **The verb picks the gesture** (swipe a shutter, drag a lid, hold a lamp, pull a chair) | **3.** A WarioWare mix of small actions; can feel like a checklist | **5.** Decision: **what to do** and to what. Leaks: only one object fitting a verb (every object accepts ≥2 verbs: a window can be closed or opened; a pot covered or moved) | **3.** Verbs are Cook's and Tidy up's home ground; the twist is speed and switching | Arc 3 Ch2 at level 3 | **3.** Verb × object combinations. **Blocked:** no verbs have Kutchi yet |
| **M6** | **Nani's forecast** (Simon says, weather) | On the veranda, the roof edge hides the sky; Nani at the gate can see it. She calls the weather: rain → pull the tarp over the charpai (chillies drying on it); sun → roll it back; wind → press and hold it down; thunder → scoop Zazu, who hides under the charpai. From L2, "it's raining" when the tarp is already on means **do nothing** (a no-go); at L3, `[EN: it's raining]` vs `[EN: it stopped raining]` | **4.** Simon-says tension; each weather's arrival is a big payoff (rain drumming on the tarp, a gust, sun breaking through) | **5.** Decision: **which weather**, so which gesture. Leaks: the light darkening before rain, rain sound rising, thunder rumbling early (all weather sound and light start **at** the reveal); the state predicting the call (from L2 redundant calls are real no-go calls); only 3–4 words (guessing is 1 in 3 or 4 per call, far below the ear threshold) | **5.** Nothing else in the game is weather, or go/no-go | Arc 3 Ch1 **Clouds coming**; the Roadmap's "watch the sky" | **4.** Four weathers, no-go calls, "stopped raining", combined with M2 at L2–3 ("rain! the red kurta!") |
| **M7** | **Bucket chain** | Full buckets go down a line of family members; Nani calls who gets this one (Nana, Ma, Ali, Big Ma); drag it to them | **3.** Sloshing comedy; short | **3.** Kinship names. Leak: faces are visible and names are well known, so it tests little new | **3.** Cook's Chai tray already serves the right person | Arc 3 Ch2, optional | **2.** Few combinations |
| **M8** | **Umbrella** | Family members cross the courtyard in the rain; hold the umbrella over the one Nani calls | **4.** Tracking a walker with a held umbrella | **3.** Kinship, "the one with…". Leak: whoever is nearest the rain | **3.** A moving M4 | Arc 3 Ch4 (the doctor arrives) | **3.** **Costly:** walking, full-body characters (avoid) |
| **M9** | **Rain tune** | After the leak, the buckets and pots ring when a drop lands. Nani calls a short pattern of pots on the beat ("*dudh… paani… dudh!*"); tap them back in time | **4.** Music, especially for Layla; a breather | **3.** Which pot, in order. Overlaps Cook's tadka (sequence), made different by rhythm | **3.** | The leak's finale; a toy interlude (Roadmap) | **3.** Tunes to collect; needs music production |
| **M10** | **Power cut** (modifier) | Lightning, the lights go out. The house is dark; flashes of lightning show it for a moment. Calls carry on; you act by ear | **4.** Atmosphere; tension without failure | **5.** Makes the audio-first rule total. Leaks: flashes timed to the answer (flashes are random, never at a call) | **4.** Reuses Find it's darkness mask; the verb is still react | Arc 3 Ch2 (the storm peaks) | **4.** Any M1, M3 or M4 round at night; free-play modifier |
| **M11** | **You call it** (role reversal) and **Nani calls** (Grandparent co-op) | (a) You're on the roof and can see the stains; Ali has the buckets. Build his call from audio chunks (room, anchor, position) before the drip. (b) An adult or Nani reads the next call from a big caller card (Kutchi text only) and says it; the child acts | **4.** Being in charge; a family shouting together (*Overcooked*, *Keep Talking*) | **4.** (a) Production: choosing the chunk needs the meaning; audio-only chunk buttons. (b) The adult speaks Kutchi; no ear star for the child in this mode (it's a family round) | **5.** No other mode's reversal is timed | Ali's payoff (he carried every bucket); Grandparent mode everywhere | **3.** Any M1 or M4 round flipped |

**Rejected, or belongs to another mode**

| Idea | Why not here |
|---|---|
| Slicing anything thrown; items flying through the air to act on | **Cook's chop** (build). The draft's flying washing was cut for this |
| Finding the chicks that hid indoors | **Find it** (search), Arc 3 Ch3, right after M3 |
| Sorting the dry washing into baskets by owner or colour | **Tidy up** (arrange) |
| Photographing the lightning or the rainbow | **Snap** (aim and capture) |
| "Nani has a cold" | **Nani's clinic** (treat) |
| Dressing for the rain | **Dress up** (style) |
| "Who left the window open?" | **Who did it?** (deduce) |
| Running home from the bazaar in the rain | An endless runner (rejected in the Game Design doc) |
| Lives, a flooding house, a game over | "Nothing floods, breaks or punishes" (Roadmap) |
| A weather radio or Zazu's bell as an upgrade | Would do the listening (section 7) |

---

## 4. Recommended first set

**One engine (the call timeline and the "heard first" rule), four mechanics on it, built in this order:**

| Order | Mechanic | Why |
|---|---|---|
| 1 | **M1 The leak**, starting with the **kitchen slice** | It's the flagship story use and the engine. The kitchen slice runs on **Kutchi that already exists** (Cook's food nouns, *Hedo!*, *Ne*, *Ne poi*, *Arre re!*) and on the existing hub kitchen background, so it can prove the fun **and pass the Sceptic with real words** before any new word or art exists. Rooms and positions follow when the family's words arrive |
| 2 | **M6 Nani's forecast**, with **M2 Unpeg it** as its level 2–3 (one courtyard station, like Cook's combined stations) | S4's core is weather, and this is the purest "only the word tells you" mechanic. M2 adds clothes, colours and whose, almost free on the same scene |
| 3 | **M4 Cats inside** | The brief's story use, the family's own cats, the strongest fun for Layla and Maryam, and S2 positions in a moving form. Same scene as M6 |
| 4 | **M3 Into the shed** | S4 animals and Arc 3 Ch3. Last, because animals are the most art and the shoo gesture needs tuning |

**Held back**

| Mechanic | When | Why wait |
|---|---|---|
| M10 Power cut | Straight after the first set | Cheap modifier (Find it's darkness mask); needs M1 at level 2+ first |
| M11 You call it / Nani calls | Straight after M1 | Cheap once calls are data; the Grandparent mode "is the one to protect" |
| M5 Batten down | When the family gives the verbs | Every verb is an English placeholder today, so it can't pass the Sceptic |
| M9 Rain tune | With the first music work | Music production; a toy interlude, not a gate |
| M7 Bucket chain, M8 Umbrella | Cameos at most | Weak on new Kutchi (M7); walking characters are expensive (M8) |

---

## 5. Story integration

### 5.1 Where it appears

| Arc | Chapter / beat | Mechanic | Cast | Notes |
|---|---|---|---|---|
| **3 The Monsoon** | **Clouds coming**: the washing's out, the sky changes | M6 forecast → M2 unpeg (L2) → M4 cats inside | Nani (at the gate, looking up), Simba, Zazu, Ma and Ali at the line | Replaces the Roadmap's "watch the sky (Spot it)" and "bring it inside (Put it there)". Opens the yard |
| 3 | **The leak**: drips everywhere, comically, never flooding | **M1** (kitchen first, then the whole house); M10 twist at the storm's peak | Nani (calling from the stairs), Ali (empties buckets, grumbling), **Big Ma** (a drip over her sewing machine; she sings in the lull), Nana (asleep in his chair; a drip lands near him and he doesn't wake) | The flagship. Big Ma's song plays between waves 6 and 7 (needs Zafar's wife's recording) |
| 3 | **The animals**: goats and hens outside; chicks hide indoors | **M3** into the shed → then **Find it** finds the chicks | Nani, the goats, hens and chicks | The handover is the story: three chicks slipped past you into the house |
| 3 | Nani has a cold | (Clinic) | The doctor | Monsoon rush sits this one out |
| 3 | **Chai together** (the payoff) | Cook's chai, with one M1 cameo wave: the kettle corner drips, "*Hedo! Dudh!*" | The whole family | The rain stops; the rain gauge on the hub wall shows every drop you saved |
| 2 The Wedding | Mehndi night: a sudden shower | M2 cameo: the guests' dupattas off the line | Guests, Big Ma | Optional side errand |
| 5 The Village | The farm: a storm over the fields | M3 on the farm scene; M6 | Villagers, animals | Returns with counts and bigger herds |
| Hub, any time after Arc 3 | "It's raining at Nani's" | Free play (5.4) | Kasuku squawks at the thunder **after** the round (cast rule: never during a task) | |

**Tone and heritage:** Kutch is dry most of the year, so the rains are welcome. The buckets aren't only a leak fix: **every drop is saved** (the rain gauge on the hub wall, Nani's plants, the goats' water). It turns "catch the drips" into something a Kutchi grandmother would be proud of, and gives the craft star a warm meaning.

### 5.2 Who drives it

| Cast | Job |
|---|---|
| **Nani** | The caller. She's in the sidebar (on the stairs, at the gate, at the window), never in the play area and never pointing |
| **Simba and Zazu** | M4's stars; Zazu hides from thunder in M6; comic moments for the album (Zazu in a bucket) |
| **Ali** | Carries full buckets out; the bucket-chain grumble; the helper you instruct in M11(a) |
| **Big Ma** | The drip over her sewing machine; her song in the lull |
| **Nana** | Sleeps through everything (a running gag); his cap on the line in M2 |
| **Ma** | At the washing line |
| **Kasuku** | Outside rounds only: squawks at thunder in the hub, repeats the storm's weakest word afterwards |
| **Goats, hens, chicks** | M3 (new characters, Arc 3) |

### 5.3 The world map

Arc 3 rolls a monsoon cloud over the map. **Clouds coming** clears the fog from **Nani's yard** (the courtyard, the veranda, the shed and the coop): a new place that also hosts Find it's chicks and, later, the Arc 5 farm link. **The leak** turns Nani's house on the map into the **cross-section view** for that chapter. After Arc 3, a small rain-cloud icon sits over the house on the map: tap it to "make it rain".

### 5.4 Free-play route

- **Monsoon day** (the world is the menu: the rain-cloud icon on the map, or the yard): an endless storm. Waves keep coming from the player's due and weakest words; the tempo rises every four waves; three misses in a row and the storm eases for a while (it never ends on failure; the player closes the shutters to stop). Records: best streak and fastest word per tempo.
- **Monsoon minute** (daily, 60 s): a fixed-tempo storm on the weakest words. "Monsoon days with Nani: N", which never resets (no guilt streaks).
- **Nani calls** (M11b): any room, the adult calls.

---

## 6. Learning design

### 6.1 What it teaches

| Stage | Words | Frames (existing Kutchi, or a placeholder) | Mechanic |
|---|---|---|---|
| S1 review (**Kutchi exists**) | *dudh, paani, khun, loon, atto, dai, dungri, lasan, aadu, marcha, rai, hardar, elchi*; numbers *hikdo* to *do* | *Hedo! {x}!* · *Ne {x}* (and: a double call) · *Ne poi {x}* (and then: a sequence) · *Arre re!* · *Muke hikdo {x} dine* ("pass me", in the sidebar) | M1 kitchen slice, M9 |
| **S4 weather** | rain, sun, wind, thunder, cloud; hot, cold | `[EN: it's raining]` · `[EN: it stopped raining]` (Round 1, Q4, asks this) · `[EN: it's windy]` · `[EN: the sun's out]` | M6 |
| **S4 rooms** | kitchen, sitting room, Big Ma's room, Nani's room, yard, veranda, shed, coop, roof | `[EN: in the {room}]` | M1 L2, M3 |
| **S4 animals** | goat, hen, chick, cat | `{n} {animal}` (the number frame exists; the nouns don't) | M3, M4 |
| **S2 positions** | in, on → under → behind → next to → in front of → between (acquisition order, from Find it) | `{anchor} [EN: under]`: positions follow the noun (Roadmap); each (anchor, relation) is one recorded phrase | M1 L3, M4 |
| S2 household anchors | stove, shelf, table, window, door, bed, cupboard, sofa, charpai, sewing machine, chair, water pot, tree, gate | as part of the position phrase | M1, M4 |
| S2 clothes and colours | kurta, dupatta, cap, towel, kanga; the 10 colours | `[EN: the red one]` | M2 |
| S2 imperatives (held back) | close, open, cover, bring in, light, come here, quick, wait | `[EN: close the window]` | M5 |
| S3 (borrowed) | big / small (the two cats) | `[EN: the big one]` | M4 L3 |

**Calls grow with the tempo** (the *Where's Wally* rule from Find it, applied to time): L1 a noun (one slot); L2 room + noun; L3 room + anchor + position, anchors duplicated across rooms so every slot is needed. Doubles (*Ne*) from L2, sequences (*Ne poi*) and switches from L3.

**Kutchi per minute:** L1 ~8 calls a minute, L2 ~12 (with doubles, ~16 target words), L3 ~18 words. That's Zafar's "lots of Kutchi per minute", about three times a Cook order.

### 6.2 Word-stage fading (the one-place-text rule)

Calls are transient, so the only place a call's words can be written is the **call pill** in the sidebar, and only while the call is live. Each slot fades by its own word's stage (the Cook ladder already dots per word).

| Word stage | Call pill (sidebar) | Scene | Timing |
|---|---|---|---|
| 1 New | Text + speaker; Nani says it | The target **twinkles** as she says it (pulse sync). **Taught, not tested:** excluded from the ear tally | +2 beats |
| 2 Learning | Text + speaker | Nothing | +1 beat |
| 3 Nearly known | Speaker + "•••" | Nothing | Level tempo |
| 4 Known | No pill until you ask; heard once | Nothing | Level tempo; the lightning par tightens |

- **No labels anywhere in the scene, ever** (a label is the answer).
- **Quiet-carriage reading:** a profile with the reads flag can turn on "show calls as Kutchi text" (never English) for muted play on a train. Reading romanised Kutchi is understanding Kutchi, and with no labels in the scene there's nothing to match letters against, so the ear star stays valid.
- **At most 3 stage-1 words per storm** (the Roadmap's "three new words per errand"), and a storm needs **at least 6 tested calls** for the ear star to be awarded.

### 6.3 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | Tap the call pill's speaker. In Busy the window keeps running (time is the cost) | Free the first time per storm; then the tick (Drizzle); in Busy it costs time and the lightning par |
| 2 Slow replay | Long-press the speaker: half speed, a pause before the key word | Tick (Drizzle); Busy: time |
| 3 "Nani, where?" (Drizzle only, in the "?" popover) | The called room (or half of the shelf) stays lit, the rest dims; always ≥3 candidates left | Tick + the streak breaks; the ear is kept (you still have to understand) |
| 4 Reveal (eye) | Shows the call's Kutchi text | The ear for that call |
| 5 Translate | English gist | The ear for that call |
| 6 Shown | Stage-1 twinkle only. There's **no** glow after misses or hesitation during a live call | — |

- **Hesitation never shows the answer.** In Drizzle, after ~8 s Nani just says the call again (rung 1, free the first time). In Busy, the reveal is the "answer", and it already costs the ear.
- **No upgrade makes a hint cheaper.**

### 6.4 Mistakes: a short recast, then the call returns

- **Inline, short** (it's a fast game): the drop splashes, "*Arre re!* {the call again}", and the right spot gives a small flash *after* the splash (feedback on a call that's already lost, not help).
- **The prompt:** the same call (same phrase, same target) **comes back 2–4 waves later** and the player answers it themselves. It counts for the word's progress, **not** for the ear tally (that call was already a miss; see Sceptic loop 1).
- **Slot-wise blame:** if you chose the right anchor but the wrong position, the **position word** takes the miss; the right room but the wrong anchor, the **anchor word**. Two misses drop that word a stage (the existing rule).
- **The long recast lives in the word review:** "you: `[EN: next to]` the bed · Nani: `[EN: under]` the window", with replays.

### 6.5 Role reversal

- **M11(a) You call it:** you're on the roof, you can see which stain is swelling; Ali below has the buckets. Build his call from audio chunk buttons (room, anchor, position), which carry **no icons** (text only for readers at stage 3+). Ali goes where *you* said, and gets it hilariously wrong if you said it wrong. Uses `produce_stage`. Relations are data (`caller: player`, `actor: ali`).
- **M11(b) Nani calls:** the caller card shows the next call in large Kutchi text for the adult to say aloud; the child plays. No ear star for the child (the adult's voice is live and unverifiable); a "family storm" stamp instead. The adult can mark each call they said as confident or unsure, which feeds their own `produce_stage` if they have a profile.

### 6.6 Words and frames needed from the family (English placeholders until then)

| Need | Status | Blocks |
|---|---|---|
| **Positions:** in, on, under, behind, next to, in front of, between | Asked (Round 1, Q3; add "in"), awaiting | M1 L3, M4 |
| Does the anchor noun change before a position ("table-*ni* niche")? | Asked by Find it (new question) | Recording plan |
| **Weather:** sun, rain, cloud, wind, thunder, lightning, hot, cold, it's cloudy, it's raining | Asked (Round 1, Q11) | M6 |
| **"It stopped raining"** | Asked (Round 1, Q4.3) | M6 L3 |
| **Rooms:** kitchen, sitting room, bedroom (Nani's), Big Ma's room, yard/courtyard, veranda, roof/terrace, shed, hen coop | **New** | M1 L2, M3 |
| **Household anchors** for the house cross-section and the yard (stove, shelf, table, window, door, bed, cupboard, sofa, charpai, sewing machine, chair, water pot, tree, gate, tarp) | Partly asked (Q8); send the list per scene (shared with Find it) | M1, M4 |
| **Animals:** goat, hen, chick, cat (and plural forms) | **New** | M3 |
| **Clothes:** kurta, dupatta, prayer cap, towel, kanga | Partly asked (Q9) | M2 |
| **Colours** (10) | Asked (Round 1, Q11) | M2 L2 |
| **Calls and frames:** "Quick!", "Here!", "Not there!", "Inside!", "Come here!" (to a cat), "Bring the washing in!", "Enough!", "Well done!" (snt-13, no Kutchi yet) | **New** | All |
| **Verbs:** close, open, cover, bring in, light, catch, put | New (Cook has asked for cooking verbs, none yet) | M5 |
| "The big one", "the small one" (agreement with the noun?) | Asked by Find it | M4 L3 |
| **Menu words to exclude:** which Kutchi food words are also common English menu words (*chai*, *daal*, *chana*, *jeera*, *aloo*, *masala*…)? Zafar to tick | **New, for all modes** | The Sceptic (loop 3) |
| **Recording:** calls said with urgency, one long take ("*Hedo! Dudh!*"), each (anchor, relation) phrase whole; about 6 anchors × 5 relations per scene | For the session | — |

---

## 7. Stars, rewards and upgrades

**Three stars, shown as they happen:**

| Star | Icon | Earned when |
|---|---|---|
| **Understood** (ear) | Ear | At least **80%** of tested calls **heard**: the first answer right and before the reveal. Stage-1 calls, retry calls and M11(b) calls don't count. Needs ≥6 tested calls (≥10 in M6, which has only four weather words). (Tunable `earPass`; open question 1) |
| **Kept dry** (craft) | **An umbrella** (this mode's own icon) | ≥85% of the storm saved: drops caught (late catches count), animals in, washing dry, cats carried in. The physical skill, including diving after the reveal |
| **Quick ears** (Busy) / **No help** (Drizzle) | Lightning / tick | Busy: the median time from the end of the key word to your answer, over heard calls, is under the level's par (L1 2.0 s, L2 1.6 s, L3 1.2 s; +0.5 s for stage 1–2 words). Drizzle: no replays after the free one, no reveals, no translations |

**Settings map onto Cook's:** *Relaxed* = **Drizzle** (the drop waits for you; no reveal until you answer; for 5-year-olds and Grandparent play). *Busy* = the beat, with tempo levels. Tempo is also an accessibility setting; the ear rule works at any tempo because it compares with the reveal, not the clock.

**Pocket money receipt:** 5 for helping, +5 understood, +3 kept dry, +3 quick or no help, +1 per five-call streak (up to +5). Money is never lost.

**Collectibles and records (none of them cosmetic-only grinding):**
- **Monsoon album:** ~20 comic moments unlocked by twists (Zazu in the bucket, the goat in the kitchen, Nana's cap on a hen, Nana asleep under a drip, Big Ma singing in the rain, a double rainbow). Maryam's collection.
- **The rain gauge** on the hub wall fills with every drop saved; at milestones Nani's veranda planter flowers (a changed place, cosy-game progression) and M9's tunes unlock.
- **Per-word records** in the notebook: your fastest "heard" time for each word and, once it's **steady** (the reaction time's coefficient of variation under 0.25 over its last five heard calls), a **raindrop badge**: Segalowitz's automaticity, shown as a collection (Zayn, Zafar).
- **Ali's gauge:** a friendly rival character's catch count per storm (no leaderboards, no social comparison).
- **Quilt patch:** a raindrop-and-umbrella motif for Arc 3's chapters.

**Upgrades** (the veranda rack has 3 slots, so each is a choice). **They automate the physical, never the listening. None may move the reveal later relative to the call.**

| Upgrade | Effect | Trade-off |
|---|---|---|
| Bucket rack | A spare bucket; buckets swing to the spot faster | Cheap; helps late dives (craft) only |
| Big bucket | Catches two drips before Ali must empty it | Fewer Ali trips, a bigger slosh gag |
| Mop | Puddles vanish at once | Craft only; takes a slot |
| Rain boots for Ali | Buckets come back sooner | A running cost (Ali's wage, tycoon-style) |
| Tarp roller | M6: one drag instead of two to close the tarp | Only for the veranda |
| Chick basket | Scoop two chicks at once | Only for M3 |
| Treats tin | A cat leaps to your arms from a little further away (capped below half the spacing between hiding spots) | Only for M4 |

**Rejected upgrades:** a weather radio (tells you the weather), Zazu's bell or a cat tracker (tells you where), a roof patch that removes leaks (fewer candidates, easier to guess), anything that shows the next spot.

---

## 8. Engineering spec for the builder

### 8.1 The engine: calls on a beat

A **storm** is a list of **waves** generated from level data. A wave has 1–3 **targets** called together, one shared countdown and one **reveal**.

**Timing (all on the audio clock, `AudioContext.currentTime`):**
- `keyEnd` = when the key word of the call finishes playing (clip start + the key word's offset, stored in the audio manifest per clip).
- `reveal` = `keyEnd + windowBeats × beat` (+ beats for stage 1–2 words). In **Drizzle** the reveal waits for the answer.
- `land` = `reveal + fall` (the drop falls, the cat pops out, the rain arrives).
- The beat grid only schedules the *next* call; each window starts from the real end of Nani's recording, so her natural pace is respected.

**Grading each target:**

| Outcome | When | Ear tally | Craft | Word progress |
|---|---|---|---|---|
| `heard` | The first answer for this target is right and is before `reveal` | ✓ | saved | right for every word in the call |
| `wrong` | The first answer is wrong (a wrong spot, a wrong gesture, or acting on a no-go) | ✗ | saved only if a late dive catches it | a miss for the deciding slot |
| `late` | No answer before `reveal`; any dive after it | ✗ | saved if caught | a miss |
| `taught` | A stage-1 word (it twinkled) | not counted | as played | shown, not advanced |
| `retry` | A call that returns after a miss | not counted | as played | right or miss as usual |

**Answer rules (the anti-spam spine):** an answer is only possible while a call is live; each live target takes **one** answer; an answer that matches no target counts as `wrong` for the oldest unanswered target; buckets and lids exist only during a live call and reset after each wave; nothing can be pre-placed.

**Generator constraints (checked by tests):** candidates per wave ≥4 (L1) and ≥6 (L2+); targets uniform over candidates across a storm (χ² check in the lab); never the same target twice running except a scheduled retry; no spatial sweep (the next target's distance from the last is uniform); rooms balanced; in M3 every animal kind × shelter pair equally likely; in M6 the four weathers equally likely and, from L2, redundant (no-go) calls at the same rate as the others; English-menu words (`menu_word: true`) never tested; ≤3 stage-1 words per storm.

### 8.2 Data model: `data/monsoon.json`

```json
{
  "_about": "Monsoon rush. Levels are data; calls are generated; words live here and in content/cook.",
  "words": {
    "ph-rain":   {"kutchi": null, "english": "it's raining", "src": "placeholder"},
    "ph-kitchen":{"kutchi": null, "english": "kitchen", "src": "placeholder"},
    "ph-under":  {"kutchi": null, "english": "under", "relation": "under", "src": "placeholder"},
    "ph-goat":   {"kutchi": null, "english": "goat", "src": "placeholder"}
  },
  "menu_words": ["cook-chai", "cook-daal", "veg-03", "ph-chana", "spi-02"],
  "lines": {"call": {"k": "{x}!"}, "hey": {"k": "Hedo!"}, "and": {"k": "Ne {x}."}, "then": {"k": "Ne poi {x}."}},
  "mechanics": {
    "leak": {"levels": [
      {"slice": "kitchen", "bpm": 60, "windowBeats": 4, "newWordBeats": 2, "fall": 0.6,
       "waves": 8, "targets": [1, 1], "candidates": [4, 5], "slots": ["noun"], "speedUpEvery": 4, "twists": []},
      {"scene": "house-section", "bpm": 72, "windowBeats": 4, "waves": 12, "targets": [1, 2],
       "candidates": [6, 8], "slots": ["room", "anchor"], "twists": ["double", "newLeak"]},
      {"bpm": 84, "windowBeats": 3, "waves": 16, "targets": [1, 3], "slots": ["room", "anchor", "relation"],
       "duplicateAnchors": true, "twists": ["double", "sequence", "switch", "powerCut"]}
    ]},
    "forecast": {"minTested": 10, "levels": [{"weathers": ["ph-rain", "ph-sun", "ph-wind", "ph-thunder"], "nogo": 0, "waves": 12}, {"nogo": 0.25, "unpeg": true}, {"stopped": true}]},
    "cats": {"levels": [{"cats": 1, "spots": [4, 5]}, {"cats": 2}, {"which": "size"}]},
    "shed": {"levels": [{"bolters": 1, "shelters": 3}, {"bolters": 2, "chicks": true}, {"counts": true}]}
  },
  "earPass": 0.8, "minTested": 6, "maxNewPerStorm": 3,
  "par": {"lightning": [2.0, 1.6, 1.2], "newWordExtra": 0.5},
  "upgrades": [{"id": "bucket-rack", "price": 30, "knobs": {"leak": {"spareBuckets": 1, "swing": 0.7}}}],
  "star_sets": {"monsoon": {"ear": {"icon": "ear", "name": "Understood"}, "hand": {"icon": "umbrella", "name": "Kept dry"},
                "relaxed": {"icon": "tick", "name": "No help"}, "busy": {"icon": "bolt", "name": "Quick ears"}}},
  "story": [{"beat": "arc3-leak", "mechanic": "leak", "level": 1, "then": {"level": 2}}]
}
```

**Scene data** (`data/scenes/<scene>.json`) reuses **Find it's schema** (`anchors`, `spots` with `anchor` + `relation`, `occluders`, `safe`) and adds a `monsoon` block:

```json
"monsoon": {
  "rooms":   [{"id": "kitchen", "word": "ph-kitchen", "rect": [0, 120, 540, 780]}],
  "drips":   [{"spot": "stove-next", "ceiling": [210, 150], "floor": [210, 700]}],
  "pots":    [{"id": "pot-1", "at": [420, 496], "holds": "$noun"}],
  "hides":   [{"spot": "charpai-under", "pop": [800, 640], "occluder": "wall-low"}],
  "shelters":[{"id": "shed", "word": "ph-shed", "door": [120, 520], "dir": 200}],
  "line":    {"from": [300, 260], "to": [1300, 280], "pegs": 7},
  "skyHidden": true
}
```

**A call** (runtime, and the unit the tests and bots see):

```json
{"wave": 5, "t": 31.2, "frame": "and", "targets": [
  {"id": "t1", "kind": "drip", "spot": "stove-next", "slots": {"room": "ph-kitchen", "anchor": "ph-stove", "relation": "ph-next"}},
  {"id": "t2", "kind": "drip", "spot": "bed-under", "slots": {"room": "ph-bigma", "anchor": "ph-bed", "relation": "ph-under"}}],
 "keyEnd": 32.05, "reveal": 36.05, "land": 36.55, "twist": null}
```

### 8.3 What's reused, and what's new

| Reused | From | How |
|---|---|---|
| Word pills, call pill (a one-row order ladder), per-word dots, reveal and translate costs | Cook (`js/cook/ui.js`, `order.js`, `lang.js`) | The call pill is a live ladder row |
| Word stages, `markRight`/`markMiss`, `produce_stage` | `js/progress.js`, Cook's save | Per slot |
| Look-alike groups, `St.lookalikes` | `data/cook.json` `lookalike_groups` | Kitchen-slice candidates: always a whole group (khun · loon · dai; dudh · paani · atto…) so no pot is the odd one out |
| Heap bowls in F view (code-drawn) | Cook's pantry | The kitchen slice's pots, before any art |
| Stars shown as they happen, receipt, result card with the **word review**, "?" help, intro card, sidebar layout, pass me in the sidebar | Cook (Waves 2–5) | New star set `monsoon` |
| Mechanic files, levels as data, `z.expect` / `z.listen` / `z.skill`, the Station-lab pattern | `js/cook/zone.js`, the recipes guide | `Monsoon.Mech.define(...)` mirrors `Cook.Mech.define` |
| Audio manifest and the placeholder voice | `build/build_cook_tts.py`, `build/build_audio_manifest.py` | Add each clip's duration and `keyAt` (key-word offset) |
| Scene schema (anchors, spots with relations), `place_preview.py`, safe zones, tap-cover check, the non-speaker bot idea | Find it | Same JSON, plus the `monsoon` block |
| Darkness mask | Find it's torch (M8) | M10 power cut |
| Courtyard scene | Find it (Arc 3 chicks, Nani's day) | Monsoon uses a fixed one-screen crop |
| Hub kitchen background | `data/scenes/kitchen.json` (`bg-nani-kitchen-v3`) | The kitchen slice: pots on the island (y 491) and shelves (y 137/256/365) |

**New building blocks:**
1. `clock.js`: the audio clock, with an injectable **virtual clock** so tests run in deterministic time (headless WebGL runs at 6–11 fps).
2. `calls.js`: the generator (with the section 8.1 constraints) and the grader (outcomes, slot-wise blame, ear tally, par).
3. `stage.js`: the scene host: candidates, the **shared countdown** (every candidate swells, rustles or flaps in phase), answer handling (one per target), reveal and land.
4. `fx.js`: rain streaks, drips, splash, puddles (max 3, then Ali mops), lightning, weather grades, gusts. All weather light and sound start **at** the reveal.
5. Gestures: tap-to-place (bucket or lid swings from the rack), pull (M2), press-and-hold (M6 wind), shoo swipe with auto-aim ±30° to the nearest shelter (M3), cupped scoop (M3 chicks), open-arms catch (M4).
6. Mechanic files: `leak.js`, `forecast.js` (+ `unpeg`), `cats.js`, `shed.js`; later `dark.js`, `caller.js`, `tune.js`, `batten.js`.

**Coupling note:** Cook's modules live under `Cook.*` in `js/cook/`. Until the one-app shell (platform debt item 1) exists, `monsoon.html` loads the Cook modules it needs; don't copy them. When the shell lands, move the shared ones to `js/shared/`.

### 8.4 The Rush lab

On the title screen, like the Station lab: run any mechanic on any scene with a random storm; buttons for level 1–3, Drizzle/Busy, tempo (bpm), a twist picker, "stage-1 words on/off", **reveal markers** (a debug outline of the target, lab only), a **bot** menu (8.5) and a live readout: candidates per wave, target distribution, outcome counts, median reaction time.

### 8.5 Tests and the leak bot

`build/test_monsoon.py` (Playwright, modelled on `build/test_cook.py`):
- `--lab --mechanic leak --level 1..3`, `--story`, `--free N`, `--drizzle`, `--busy`, `--canvas`, `--virtual-clock` (default in CI), `--viewport` for the **six sizes** (phone 915×375, 1366×768, 1440×900, 1280×800, iPad 1024×768, iPad portrait 768×1024) plus a 375 px phone; the **tap-cover check before every tap**; screenshots for Claude to look at.
- **The leak bot** (`--bot <strategy> --storms 500`), a non-speaker that sees what's on screen and hears audio as opaque clip ids with durations. It must earn the ear star in **fewer than 10% of storms per strategy (target under 2%)**:

| Strategy | What it does | Expected ear-star rate |
|---|---|---|
| `random` | Answers a random candidate at `keyEnd` | ~0% (L1, 5 candidates: P(≥80% right) ≈ 0.01% over 8 tested calls, 0.2% over the minimum 6) |
| `wait` | Waits for the reveal, then dives | 0% (all `late`); high craft (fine: that's the hands) |
| `spam` | Taps every candidate | 0% (one answer per target) |
| `camp` | Tries to pre-place buckets | 0% (no answers without a live call) |
| `odd` | Picks the most visually distinct candidate (colour, size, the only open pot) | ~random if look-alike groups and the shared countdown hold |
| `near` | Repeats the last target, or picks the nearest to it | ~random if the generator holds |
| `duration` | Learns clip duration → target across storms | ~random; flags a leak if it beats random by >2× |
| `state` (M6) | Infers the next weather from the tarp's state | 1 in 3 per call at L1. Over 6 tested calls that's 1.8% (too close to the target), so **M6 needs ≥10 tested calls** (`minTested: 10`): 0.3% |
| `menu` | Knows the English menu words (*chai*, *daal*) | 0% (never tested) |
| `learner` | Remembers clip id → target from the post-miss flash, within a storm | Gets retries right, but retries don't count: ~random. **Across storms** it's learning the words (a phrase always means its place), which is allowed; reported, not failed |

- Also: the generator's uniformity (χ² per storm type), "all weather sound starts at the reveal", "Simba's bell is silent during a run", "no labels in the scene", "no English on screen except grey placeholders".
- **Placeholder report:** storms whose deciding words are English placeholders are flagged "not yet a Kutchi test" (Find it's rule). The bot treats placeholders as opaque audio; a second pass lists what an English reader would win.

### 8.6 File layout (until the one-app shell)

```
monsoon.html
js/monsoon/core.js  clock.js  calls.js  stage.js  fx.js  lab.js  bots.js
js/monsoon/mechanics/leak.js  forecast.js  cats.js  shed.js   (later dark.js caller.js tune.js batten.js)
data/monsoon.json
data/scenes/house-section.json   (new)   data/scenes/courtyard.json (shared with Find it)
assets/monsoon/…   assets/audio/word/…
build/test_monsoon.py
```

---

## 9. Scene, art and asset list

### 9.1 Cameras (art bible section 3: Monsoon rush is **E, side-on room cross-section**, horizon mid-height, drips straight down; items F; hands E)

| Scene | Camera | Width | Used by | New or reused |
|---|---|---|---|---|
| **Hub kitchen, monsoon dressing** | E (the hub) | 1 screen | M1 L1 kitchen slice, M9, the Chai-together cameo | **Reused** (`bg-nani-kitchen-v3`): ceiling stains and drips are code overlays in the top band; pots sit on the island and shelves |
| **House cross-section** (kitchen, sitting room, Big Ma's room, the roof line above) | E, side-on cut-away, **one screen, no pan** | 1 screen, ~530 px per room | M1 L2–3, M10, M11(a) | **New** (the biggest art item). Anchors deliberately duplicated: a window in every room, a table in two |
| **Courtyard from the veranda** | E; the **veranda roof edge is an occluder across the top**, hiding the sky | 1-screen crop of Find it's 2-screen courtyard | M6, M2, M4, M3 | **Reused** from Find it, plus the shed (new if Find it's version lacks it), the tarp on the charpai, the washing line |
| Farm (Arc 5) | E | 1 screen | M3, M6 | Later; Snap's panorama may supply it |

### 9.2 Layers and ambient motion

| Separate layer | Why |
|---|---|
| Ceiling stains (code), drips, splashes, puddles (code) | The shared countdown and reveal |
| Buckets, lids, lota, the bucket rack | Placed per wave |
| Veranda roof edge; the low courtyard wall; the charpai front | Occluders: hide the sky and the cats' runs |
| Tarp (stretched in code), each washing item, pegs (code) | M6, M2 |
| Shed and coop doors (open, closed) | M3 |
| Animals, cats (head and tail separate), Ali, Big Ma cameo | Characters |
| Rain streaks, window rain, lightning, weather grade, cloud strip (code particles and grades) | Atmosphere; **uniform, and weather-specific changes only at the reveal** |
| Ambient: curtain flap, lamp flicker, a leaf in the gust, puddle ripples | 2–4 per scene; never near a tap target; off with "reduce motion" |

### 9.3 Hand poses (all already in the asset plan's list, tagged M)

| Pose | Use |
|---|---|
| B5 hook grip (bucket) | Carrying and swinging the bucket to the spot |
| C1 pinch (lid knob) | Dropping a lid on a pot (kitchen slice) |
| A8 cupped hand | Scooping chicks; the Drizzle toy (catch a drop between waves) |
| D6 two-hand catch (2 frames) | Catching a cat |
| D1 grab (2 frames) | Unpegging the washing; pulling the tarp (mirrored pair) |
| A6 palm out | Holding the tarp down in the wind |
| A5 wave / E4 clap | The shoo gesture (M3) |
| B2 vertical grip | The umbrella (M8, held back) |
| D4 squeeze | Wringing out a cloth (a result-card flourish) |
| C4 pointing | Default tap; the ghost fingertip demo |

**No new hand poses are needed.**

### 9.4 New items, characters and backgrounds (rough counts)

| Asset | Count | Reuse | Where to make it |
|---|---|---|---|
| House cross-section background | 1 (+1 night grade in code) | New | **API** (edit in place, then cut occluders) |
| Courtyard monsoon dressing (tarp, washing line, puddles baked where fixed) | 1 edit of Find it's courtyard | Reuse | **API** edit in place |
| Shed (if not in Find it's courtyard) | 1 | Find it and Arc 5 | API edit in place |
| Buckets (steel, plastic), lota, lids, bucket rack | ~6 | Kitchen props shared with Cook | **API** (steel and brass need native transparency, never magenta) |
| Washing items: kurta, dupatta, cap, towel, kanga, socks, laundry basket (back and front) | ~8 | Tinted for colours in code; the kanga is an East Africa nod | **ChatGPT free**, one 4×4 sheet on magenta (cloth is fine on magenta) |
| Chillies drying on the charpai (bare and covered), tarp | 3 | — | ChatGPT free sheet |
| Goats (stand, hop), hens (stand, flap), chicks (stand, hop) | ~6 poses, tinted in code | Arc 5 farm, Find it's chicks | ChatGPT free sheet (white hens on magenta are fine) |
| Cats: **wet shake**, **carried in arms**, **peeking over a wall** | 3 per cat = 6 | Cat sheets (asset plan section 3) | **API** edits of each cat's sheet (consistency) |
| Ali: carrying a full bucket (grimace) | 1–2 | Ali's sheet | API edit |
| Big Ma: at the sewing machine, looking up surprised | 1 | Her sheet | API edit (after her sheet exists) |
| Nani: "urgent call" expression | 0–1 | Existing surprised/worried | — |
| Splash, drop, stain, puddle | 0 | Code | — |
| **Total** | **~40–50 images** | | **About $5–15 of API**, plus two free ChatGPT sheets |

**Phases 0–1 need no new art at all** (the hub kitchen, code-drawn heap bowls, code drips and lids).

---

## 10. Persona loops

### Loop 0: the draft (what the loops started from)

A monsoon mode where: a single ceiling stain swelled and dripped; Nani stood in the scene and called its position; each drip had its own timer ring; you **dragged** a bucket under it; the ear star was lost on a wrong bucket; animals were **dragged** into pens; **the washing blew off the line** and you caught the item Nani called as it flew; the forecast toggled a tarp; Relaxed mode let the drip wait 10 s then fall; mechanics M1–M11 as candidates.

### Loop 1

| Persona | Plays, says, struggles |
|---|---|
| **Layla, 5** | Loves the plink and the puddle. Separate timer rings on several drips at once stress her ("which one, which one?"). Dragging a bucket across the room is slow and she drops it halfway. Can't read the call. "Nani, where?" |
| **Zayn, 8** | Clears level 1 in two storms. "Is that it?" Nothing to beat; wants it faster and a record |
| **Maryam, 11** | "A house flooding is a bit babyish." Likes the cats and Big Ma. Wants something that's hers |
| **Zafar, 38** | Level 1 is one noun per call; wants sentences and more of them. Loves the Puzzle Pirates duty feel (patching the ship), wants the tempo to bite |
| **Farah, 34** | A storm is 2–3 minutes: fine. On the train her phone is on silent: she can't play at all |
| **Nani, 68** | Proud to be the caller. "Let *me* call it for the children." Would point at the ceiling herself |
| **The Sceptic** | Wins the ear star every time: (1) the **only swelling stain** is the answer; (2) she **waits** and dives when the drop falls; (3) **stereo** drip sounds tell left from right; (4) Nani in the scene **looks** at the spot; (5) she leaves buckets under half the stains (**camping**) and the rest by elimination; (6) Relaxed: waits 10 s for the drop (**wait for the glow**); (7) flying washing: grabs whatever falls towards her |
| **The Builder** | Drag physics and pen herding are fiddly on phones; flying cloth physics is costly; per-drip rings are a UI mess; mobile audio latency (100–300 ms) will make timing unfair unless calls run on the audio clock |

| Finding | Change |
|---|---|
| The single swelling stain is the answer | **Shared countdown:** every candidate swells in phase; one reveal per wave |
| Waiting for the drop wins | **"Heard first" rule:** only answers before the reveal count for the ear; late dives feed the craft star |
| Stereo drip sounds | Mono pre-drip sounds, the same on every stain |
| Nani looks or points | Nani lives in the sidebar during storms; no gestures, no gaze |
| Camping and elimination | Buckets exist only during a live call and reset after each wave; lids pop off |
| Relaxed drop falls after 10 s | **Drizzle:** the drop waits for the answer forever; after 8 s Nani repeats the call (free the first time) |
| Flying washing is Cook's chop | **Unpeg it:** the washing stays on the line; the rain hits the called item |
| Per-drip rings, drag is slow for 5-year-olds | **Waves** with one shared countdown; **tap to place** (the bucket swings there) |
| Zayn has nothing to master | Tempo steps up every four waves; **Quick ears** star; best streak; per-word best times |
| Zafar wants more Kutchi | Calls grow noun → room → room + anchor + position; doubles with *Ne*, sequences with *Ne poi*; about 12–18 words a minute from L2 |
| Maryam: babyish flooding | Reframe: Kutch welcomes the rain; **every drop saved** (the rain gauge, the planter); the monsoon album |
| Nani wants to call | **M11(b) Nani calls** promoted to "straight after M1" |
| Audio latency | All calls and reveals on the **audio clock**; windows start at the key word's real end |
| The words don't exist yet | **Kitchen slice first**, on Cook's existing food nouns and the existing hub kitchen |

### Loop 2

| Persona | Plays, says, struggles |
|---|---|
| **Layla, 5** | Drizzle suits her; the twinkle on new words helps; Mum or Nani calls in M11(b). Because every stain swells, she taps three of them. Doubles ("*dudh ne paani*") confuse her |
| **Zayn, 8** | Starts guessing *before* Nani finishes, to shave his time. Wants someone to beat |
| **Maryam, 11** | Wants to make it hers; asks for Big Ma "since she's in the house anyway" |
| **Zafar, 38** | Wants to know he's actually getting faster, not just luckier; wants verbs; tries M11(a) and likes being the one who calls |
| **Farah, 34** | Would do a daily 60 s; muted play still impossible |
| **Nani, 68** | Doesn't like the chicks being flicked ("they're babies!"). Laughs at the goat in the kitchen. Wonders whether the puddles look like a neglected house |
| **The Sceptic** | New wins: (1) M6: the veranda **light darkens** and the **rain sound rises** before "rain"; (2) M6: if the tarp is on, the next toggle must be "sun" (**state leak**); (3) M4: **Simba's bell** jingles from where he is; (4) M3: goats always go in the shed (**kind predicts shelter**); (5) after a miss the right spot **flashes**, and the same call comes back: she taps the flashed spot; (6) she keeps missing so every word drops to stage 1 and **twinkles**; (7) long calls always mean Big Ma's room (**clip length**) |
| **The Builder** | Headless tests run WebGL at 6–11 fps, so real-time judging will be flaky; cats need new poses; Find it's courtyard must be shared, not copied; Cook's modules are `Cook.*` globals |

| Finding | Change |
|---|---|
| Layla taps several stains | At L1 **the hand holds one bucket** per target called; one answer per target; extra taps are a gentle "wait" wobble, not a miss, while no call is live |
| Doubles too hard at 5 | Doubles from L2 only; stage 1–2 words get extra beats |
| Zayn guesses early | Records count only `heard` answers; early wrong guesses lose the ear and break the streak. Look-alike groups share first sounds (*dudh/dai*), so guessing from the first syllable is risky; guessing right from a partial word is real skill (Fernald) |
| Zayn wants a rival | **Ali's gauge**, a friendly rival character (no leaderboards) |
| Zafar: faster or luckier? | Per-word **steadiness** (reaction-time CV) and the **raindrop badge** |
| Maryam | Big Ma's drip and song; umbrella and bucket patterns (bandhani, ajrakh) for the veranda rack, which change the hub, not just a hat |
| Muted phones | **Quiet-carriage reading** for reads profiles (Kutchi text only, ear star valid) |
| Chicks flicked | Chicks are **scooped** with cupped hands; goats and hens are **shooed** (a swipe behind them), never flicked |
| Puddles look like neglect | Max 3 puddles; Ali mops the rest; every puddle is a comic gag (Nana's slipper floats) |
| Light and sound before the reveal | **All weather light and sound start at the reveal**; a test checks it |
| Tarp state predicts the call | From L2, redundant calls are **no-go** calls ("it's raining" and the tarp's already on: don't touch). At L1, wind and thunder don't depend on state, so a guess is still 1 in 3 |
| Simba's bell | Silent during a run; rings at the pop |
| Kind predicts shelter | Every kind × shelter equally likely; story reasons for today's plan |
| Flash, then the same call | Retry calls **don't count** for the ear (only for the word's progress) |
| Keep words at stage 1 | ≤3 stage-1 words per storm; ≥6 tested calls needed for the ear |
| Clip length | Bot strategy `duration` in the harness; if it beats random by 2×, record the long phrases in pairs of similar length or add a short lead-in |
| Flaky timing in tests | Injectable **virtual clock**; `--canvas` |
| Coupling | `monsoon.html` loads Cook's shared modules; move them to `js/shared/` with the one-app shell |

### Loop 3

| Persona | Plays, says, struggles | Reason to come back |
|---|---|---|
| **Layla, 5** | Plays Drizzle with Nani calling (M11b); squeals when Zazu jumps into her arms | The cats, the plinks, Nani calling her name |
| **Zayn, 8** | Plays the endless storm at bpm 100+, chasing a streak and Ali's gauge | Records per tempo, raindrop badges, the album |
| **Maryam, 11** | Collects album moments, patterns the bucket rack, waits for the planter to flower | The album, the veranda, Big Ma's song |
| **Zafar, 38** | L3: ~18 words a minute; M11(a) makes him produce; watches his steadiness improve | Density, reversal, the upgrade slots |
| **Farah, 34** | The Monsoon minute on the train, text calls when muted | 60 s daily; "Monsoon days with Nani" |
| **Nani, 68** | Records the calls in one urgent take; the windows fit her pace; the children run when she calls | She's the storm's voice, and the caller in the family round |
| **The Sceptic** | Tries the kitchen slice. (1) She knows *chai* and *daal* from menus and wins those calls; (2) she notices the second target of a double call is never in the same room; (3) with English placeholders in the house, she simply understands "under the window". Everything else: random-level results | — |
| **The Builder** | Phase 0 needs no art and no new words; the house cross-section is the one big art job; the animals come last. Nani's natural pace varies clip to clip | — |

| Finding | Change |
|---|---|
| Menu words (*chai*, *daal*) are known in English | `menu_words` list, never tested (played, not counted); Zafar ticks the list (6.6). Applies to every mode |
| Double-call targets never share a room | Allow the same room; the generator draws each target independently |
| English placeholders are readable | Known and unfixable in code: flagged "not yet a Kutchi test"; **the kitchen slice ships first because it's already a real test** |
| Nani's pace varies | Windows start at each clip's measured `keyEnd` (manifest `keyAt`), not on a fixed beat |
| Guessing M6's weather with the state leak (1 in 3) wins 1.8% of 6-call storms | M6 needs ≥10 tested calls (0.3%) |
| Is every persona covered? | Yes (right-hand column). The Sceptic has no route left where real Kutchi carries the decision. **Stop after loop 3** |

---

## 11. Scorecard and verdict

**First set (M1, M6 + M2, M4, M3), 1–5:**

| Criterion | Score | Why |
|---|---|---|
| Fun | **4.5** | Anticipation, plinks, comic chaos, cats; escalating tempo (*Kaboom!*, WarioWare); Drizzle for the youngest |
| Forces Kutchi | **5** with the family's words (**5 today** for the kitchen slice; **2 today** for rooms, positions, weather, animals, which are placeholders) | The "heard first" rule plus the shared countdown means the world never tells you before Nani does |
| Distinct | **4.5** | The only timed-anticipation mode; no flying targets (Cook), no searching (Find it), no arranging (Tidy up). The four mechanics share an engine but not a gesture |
| Plot | **5** | All four Arc 3 story uses (clouds and washing, the leak, the animals, the cats) plus cameos in Arcs 2, 3 Ch5 and 5 |
| Replay | **4.5** | Generated storms, tempo, twists, the endless storm, the Monsoon minute, the album, the gauge, per-word records |

**Is it good?** Yes. It's the one mode where *speed of understanding* is the game, which is exactly what fluent listening is, and it's funny.
**Is it complete?** For its share, yes: S4 weather (M6), rooms (M1 L2), farm animals (M3), S2 positions (M1 L3, M4), household nouns and clothes (M1, M2). Not covered here, by design: times of day (Find it M9), body and feelings (Clinic), imperative verbs (held back in M5 until the words exist).

**Verdict: Go with changes.**
1. **Build the kitchen slice first** (Cook's nouns, the hub kitchen, no new art): it proves the fun and the engine with real Kutchi.
2. **Chase the family's words** (Round 1 Q3, Q4, Q11, plus a Round 3 list: rooms, animals, clothes, calls) before M1 L2+, M6 and M3 count as Kutchi tests.
3. Coordinate the courtyard scene JSON with Find it (one file, both modes).

**Top risks**
1. **Words:** almost every S4 and S2 decision word is a placeholder; until they arrive, only the kitchen slice is a real test.
2. **Timing fairness:** audio latency on phones and 5-year-olds' reaction times. Tempo and windows need real-device playtests (Cook's tawa windows had the same question).
3. **Speed rewarding guessing:** mitigated by the heard-first and one-answer rules, the bot and look-alike groups; still needs watching in playtests.
4. **Sameness inside the mode:** four mechanics on "call → act". Each has its own gesture and scene; if playtests say they blur, drop M2 into M6 entirely.
5. **Art:** the house cross-section and the animals are the only big jobs.

**Open questions for Zafar**
1. Ear star: **≥80% of calls heard** (proposed), or lost at the first miss like Cook?
2. Craft star icon: an **umbrella** ("Kept dry")?
3. Kitchen slice first, before the house cross-section?
4. Nani calls (M11b): a family round with no ear star for the child. OK?
5. May Big Ma's song (Zafar's wife's recording) play in the leak's lull?
6. Goats and chicks in Nani's kitchen as a gag: OK for the family?
7. Which rooms does Nani's house have, for the cross-section?
8. Please tick which food words are common English menu words (6.6).

---

## 12. Build brief for a future agent

**Rules you inherit:** never invent Kutchi (placeholders as `"kutchi": null`, grey italic); levels are data; mechanics are files; every decision comes from something said and varies each storm; help that shows costs the ear; one place for text; nothing covers the play area; upgrades never listen; look at your screenshots.

### Phases and acceptance criteria

| Phase | What's playable | Acceptance |
|---|---|---|
| **0 Engine + kitchen slice (greybox)** | `monsoon.html` with M1 L1–3 in the hub kitchen: code-drawn heap pots, lids, drips; the Rush lab | Virtual-clock tests pass; the bots (8.5) earn the ear star in **<2% of 500 storms per strategy per level** (hard fail >10%); uniformity checks pass; six sizes + 375 px, with no tap covered; no console errors; screenshots reviewed |
| **1 Full leak** | Stars, receipt, word review, intro card, "?", pass me, Drizzle/Busy, the tempo ramp, the Arc 3 "leak" story beat; house cross-section **greybox** with rooms and anchors (placeholders flagged) | As phase 0, plus: result-card word review lists every called word; placeholder report generated; the story beat plays from the hub |
| **2 Courtyard station** | M6 forecast (L1–3, no-go), M2 unpeg (as M6 L2–3), M4 cats; the courtyard crop shared with Find it | Bots <2%, including `state`; the "weather at the reveal" and "silent bell" checks pass; the Clouds-coming chapter playable |
| **3 Animals, dark, free play** | M3 into the shed (shoo, scoop), M10 power cut, the endless storm, the Monsoon minute, the upgrade rack | Bots <2%, including kind × shelter uniformity; the free-play records save per profile |
| **4 Reversal and extras** | M11(a) you call it, M11(b) Nani calls; M9 rain tune; M5 when verbs exist | M11(a) chunk buttons carry no icons; the caller card is legible at arm's length on the iPad |
| **Art run** (after each greybox audit) | Cross-section background, courtyard dressing, props, animals, cat and Ali poses | Art bible QA checklist on every screenshot; `place_preview.py` for every spot |

### The first three tasks

**Task 1: the clock and the call engine** (`js/monsoon/clock.js`, `calls.js`, `data/monsoon.json`)
- `Monsoon.clock`: `now()`, `at(t, fn)`, driven by `AudioContext.currentTime`; a `VirtualClock` with `advance(dt)` for tests (selected by `?clock=virtual`).
- Extend `build/build_audio_manifest.py` to store each clip's `dur` and `keyAt` (key-word offset; default = the clip's length until the family's recordings are marked up).
- `Calls.storm(mech, level, scene, profile)` → waves (section 8.2 shape) that obey every constraint in 8.1, drawing words by the due and weakest-first rule from `js/progress.js`, excluding `menu_words`, ≤3 stage-1 words.
- `Calls.grade(wave, answers)` → outcomes (`heard`, `wrong`, `late`, `taught`, `retry`), slot-wise blame, the ear tally, the reaction times; `Calls.stars(storm)` → the three stars with `earPass`, `minTested` and `par` from data.
- **Done when:** a headless run of 1,000 generated storms passes the uniformity (χ²) and constraint checks, and grading unit cases (early right, early wrong, late dive, spam, a retry, stage 1) all return the expected outcomes.

**Task 2: M1 The leak, kitchen slice** (`js/monsoon/stage.js`, `fx.js`, `mechanics/leak.js`)
- Scene: `data/scenes/kitchen.json` (hub, `bg-nani-kitchen-v3`), with a new `monsoon` block: 6–8 pot positions on the island (baseline 496) and shelves (137/256/365), candidates drawn from whole look-alike groups in `data/cook.json`; each pot a code-drawn heap bowl (F view) at ≥130 px hit area.
- The call: "*Hedo! {x}!*" (L1), "*{x}! Ne {y}!*" (L2 double), "*{x}! Ne poi {y}!*" (L3 sequence: `y`'s reveal is a beat later), a switch twist at L3 (a placeholder "not that one" until the word exists).
- Shared countdown: a stain above **every** pot swells in phase; mono creak. Tap a pot during the window: the hand (C1, placeholder shape) drops a lid; at the reveal the drop falls straight down and plinks off the lid, or plops into the uncovered pot ("*Arre re!* {x}!", a small ripple, the right pot flashes after). Lids pop off with a steam puff after the wave. Drizzle: no reveal until an answer; the free replay after 8 s.
- The call pill in the sidebar (Cook's word pill and ladder row); stars as they happen; the retry call 2–4 waves after a miss; the tempo step every four waves.
- **Done when:** it's playable in the Rush lab at L1–3 in Drizzle and Busy, on all six sizes, and a test player driven by `z.expect` gets three stars.

**Task 3: the Rush lab, the bots and the harness** (`js/monsoon/lab.js`, `bots.js`, `build/test_monsoon.py`)
- The lab: mechanic, level, Drizzle/Busy, bpm, twist, stage-1 toggle, reveal markers (lab only), bot menu, the live readout (8.4).
- Bots: `random`, `wait`, `spam`, `camp`, `odd`, `near`, `duration`, `menu`, `learner`, each using only what's on screen plus opaque audio ids and durations (never the call's slots).
- `test_monsoon.py`: `--lab`, `--level`, `--busy`, `--drizzle`, `--viewport`, `--canvas`, `--virtual-clock`, `--bot <name> --storms N`, `--report` (per bot: ear-star rate, craft rate, outcome mix; uniformity; the placeholder report); the tap-cover check before every tap; screenshots to `build/screenshots/monsoon/`.
- **Done when:** the report shows every bot under 2% on the kitchen slice at L1–3, the harness passes on the six sizes and the 375 px phone, and the screenshots have been looked at.

---

## Sources

(Search summaries; the pages themselves weren't opened.)

- Rhythm Heaven: [series overview, audio cues over visuals (Wikipedia)](https://en.wikipedia.org/wiki/Rhythm_Heaven_(series)); [CGMagazine review of *Groove*: "play with your eyes closed", night mode](https://www.cgmagonline.com/review/game/rhythm-heaven-groove-switch/)
- WarioWare: [Microgame: one-word instruction, 8 beats (Super Mario Wiki)](https://www.mariowiki.com/Microgame); [The Stack on *Mega Microgame$*: one verb, understood in a split second](https://www.wurb.com/stack/archives/873)
- *Kaboom!*: [catching bombs in buckets, eight speeds (Wikipedia)](https://en.wikipedia.org/wiki/Kaboom!_(video_game))
- Overcooked: [Game Design Deep Dive: truly cooperative play](https://www.gamedeveloper.com/design/game-design-deep-dive-building-truly-cooperative-play-in-i-overcooked-i-); [Road to the IGF: dynamic kitchens, "screaming and pointing"](https://www.gamedeveloper.com/design/road-to-the-igf-ghost-town-games-i-overcooked-i-)
- Fruit Ninja: [Halfbrick's guide: Arcade, Zen, combos](https://www.halfbrick.com/blog/the-ultimate-beginners-guide-to-fruit-ninja); [Wikipedia: bombs cost points in Arcade, specials](https://en.wikipedia.org/wiki/Fruit_Ninja)
- Rhythm-game judgement windows: [fair judgement windows as data (DEV)](https://dev.to/skywalker_2de7de5f97df567/building-fair-rhythm-game-judgement-windows-in-javascript-1og9); [timing-window comparison (ZiV)](https://zenius-i-vanisher.com/v5.2/thread?threadid=11990)
- Keep Talking and Nobody Explodes: [asymmetric information forces talk (Wikipedia)](https://en.wikipedia.org/wiki/Keep_Talking_and_Nobody_Explodes)
- Plants vs. Zombies: [George Fan, "How I Got My Mom to Play Through PvZ" (GDC Vault)](https://www.gdcvault.com/play/1015541/How-I-Got-My-Mom)
- Herding arcade: [*Flock Herder*: sheep flee, get behind them](https://arowx.itch.io/flock-herder)
- TPR: [Liu et al. 2024, personalised TPR with young EFL learners](https://journals.sagepub.com/doi/full/10.1177/21582440241288924); [ERIC: TPR with young learners](https://files.eric.ed.gov/fulltext/EJ1324215.pdf); [Total physical response (Wikipedia)](https://en.wikipedia.org/wiki/Total_physical_response)
- Speed of word recognition: [Marchman and Fernald 2008: infant processing speed predicts later outcomes (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2905590/); [Fernald and Marchman 2012: late talkers who process faster "bloom" (PubMed)](https://pubmed.ncbi.nlm.nih.gov/22172209/)
- Automaticity: [Segalowitz: automaticity in L2 word recognition, the CV measure (*Applied Psycholinguistics*)](https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/assessing-the-development-of-automaticity-in-second-language-word-recognition/58465581E3C8C24144D881FD8F1ACD52); [processing speed and automaticity in L2 listening](https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/testing-the-role-of-processing-speed-and-automaticity-in-second-language-listening/E9E7E1F5516B0C6AB2AE1FEAD6E8293D)
- Simon says / HTKS: [Oregon State: self-regulation game predicts vocabulary, maths and literacy](https://news.oregonstate.edu/news/preschool-age-kids-different-countries-improve-academically-using-self-regulation-game)
- Listening anxiety and speech rate: [TESL-EJ 2023, FL listening comprehension and anxiety](https://tesl-ej.org/wordpress/issues/volume27/ej106/ej106a9/)
- Children's reaction times: [age-related differences in RT in young children (PubMed)](https://pubmed.ncbi.nlm.nih.gov/18359494/); [reaction time of children by age (Procedia Engineering)](https://www.sciencedirect.com/science/article/pii/S1877705817319239)
- Accessibility: [Game Accessibility Guidelines: adjustable game speed](https://gameaccessibilityguidelines.com/include-an-option-to-adjust-the-game-speed/); [don't make precise timing essential](https://gameaccessibilityguidelines.com/do-not-make-precise-timing-essential-to-gameplay-offer-alternatives-actions-that-can-be-carried-out-while-paused-or-a-skip-mechanism/)
- Carried over from the Find it research: Lyster and Saito 2010 (prompts beat recasts); Fritz et al. 2007 (expanding retrieval); position-word acquisition order (see `docs/find-it-design.md`, Sources)
