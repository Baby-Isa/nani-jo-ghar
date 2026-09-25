# Monsoon rush: design (mode 7, core verb **react**)

**Date:** 25 Sept 2026
**Status:** proposal for Zafar, deepened on 25 Sept (the "Deep dive" section at the top is current and supersedes older sections where they conflict). Nothing built. It follows `docs/modes/MODE-DESIGN-BRIEF.md` and builds on `docs/game-modes-v2.md` (mode 7), `docs/find-it-design.md` (the model), the Cook audit (`docs/cook-with-nani-kutchi-audit.md`) and Zafar's playtest waves (`docs/cook-with-nani-todo.md`).
**Placeholder rule:** the only Kutchi below is what is already in `data/content.json` or `data/cook.json`. Anything written `[EN: under]` has no Kutchi yet: in the game it's an English placeholder in grey italic until the family gives the word. **Never invent Kutchi.** Section 6.6 lists every word needed.

---

## Deep dive, 25 Sept 2026: mini-games and mechanics

**What this is.** The mode taken to the clinic's Revision 2 depth under Zafar's 25 Sept principles (`docs/modes/DEEP-DIVE-BRIEF.md`): a set of mini-games, one file per mechanic, speaking as a core part, a build that touches only its own files first. **It supersedes sections 3, 4, 5.4, 6.5, 8 and 12 where they conflict.** The kitchen slice (section 4 order 1; the old task 2) is kept exactly as designed, because the review picked it as the cheapest all-real-Kutchi slice in the plan; this deep dive widens the front of the build around it. D.10 lists what changed below.

### D.1 Pitch, and the kinds of round

**Pitch.** Nani can hear the monsoon before you can see it: she calls what's about to happen, in Kutchi, and you act before the world shows you. It's the one mode where the *speed* of understanding is the game, and the mode where the child first gets to be the caller.

**The backbone: five kinds of round.** Every mini-game is a storm of **waves** on one engine (a call, a shared countdown, a reveal; section 8.1). What differs is what the call carries and who says it. A storm mixes kinds the way a clinic morning mixes visits.

| Kind | What the call carries | What you do | Who speaks | Blind guess per wave (L1) | Mini-games |
|---|---|---|---|---|---|
| **K1 Which one** | One noun (a pot, a room, a hiding spot, a shirt) | Commit on one of ≥4 candidates that all show the same countdown | Nani | 1 in 4–6 | Kitchen leak, house leak, cats, unpeg |
| **K2 How many** | A number, alone or after a noun | Let that many in, then act; nothing stops by itself | Nani | 1 in 5 | Drip count; the shed at L3 |
| **K3 Do, or don't** | A state word (the weather; later a verb) | The gesture that word needs, or **nothing** | Nani | 1 in 3–4 | Forecast, batten down |
| **K4 Which, and where** | A thing and a place | A pairing: this animal, that door | Nani | 1 in 9 | Into the shed |
| **K5 You call it** | The child's own word, from a closed set | Say it; a character acts on what the game heard | **The child** | — (voice star, not ear) | You call it, Kasuku's echo; any K1–K4 round flipped |

The section 1 rules hold for every kind: audio leads, the world follows; every candidate shows the same countdown; only answers before the reveal count for the ear; one answer per target; nothing pre-placed; Nani in the sidebar, never pointing.

### D.2 The mini-game library

Scored 1–5. **F5 / F11** = fun at 5 and at 11; **K** = forces the Kutchi (once the words are real); **D** = distinct from other modes; **B** = build cost (5 = cheap: no new art, no new words). **Real** = the deciding words exist in `data/cook.json` today.

| # | Mini-game | Kind | How it plays | Mechanics | F5 | F11 | K | D | B | Real | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **G1** | **The kitchen leak** (section 4 order 1: unchanged) | K1 | Six pots from one look-alike group; every stain swells; *"Hedo! Dudh!"*; tap the pot, the lid drops, the drip plinks off it or plops in. L2 doubles (*Ne*); L3 sequences (*Ne poi*) and the switch (*Nar dudh, paani!*, draft) | cover, passme | 4 | 3 | 5 | 3 (Cook's pass me on a beat, right for L1) | **5** | Yes | **First set** |
| **G2** | **Drip count** (new) | K2 | One pot's lid is off. *"Trae!"*: let three drops plink in, then lid it. A fourth drop, or lidding early, is a miss. L2 *"Dudh! Bo!"*; L3 two pots, two numbers | count (Cook), cover | 5 (holding your nerve) | 3 | 5 | 4 (Cook counts what you put in; here you count what falls and stop it) | **5** | Yes (numbers 1–5) | **First set** |
| **G3** | **You call it** (M11a, rebuilt around speech) | K5 | You're on the roof and can see which stain swells; Ali is below with the lids. Press the mic, **say the pot's name**; Ali runs to the pot the game heard; the drop falls on the beat | say (shared), callit, cover | 4 | 4 | 5 (production) | 5 (no other reversal is timed) | 4 | Yes | **First set** |
| **G4** | **Nani's forecast** (M6) | K3 | The roof edge hides the sky; Nani at the gate calls rain / sun / wind / thunder: tarp over, tarp back, hold it, scoop Zazu. L2 no-go calls; L3 *it stopped raining* | tarp, hold, scoop | 4 | 4 | 5 | 5 | 3 | No (G1–G14) | **First set**, second station |
| **G5** | **Unpeg it** (M2) | K1 | Everything on the line flaps together; Nani calls the item (then colour, then whose); pull it into the basket | unpeg | 3 | 3 | 4 | 3 | 3 | No (F45–F63, E60–E71) | **G4's level 2–3**; alone in free play |
| **G6** | **Cats inside** (M4) | K1 | The cats run behind the low wall; Nani calls where one will pop out; open your arms there | catch | 5 | 4 | 4 | 4 | 3 | Partly (*vadho / nindho* at L3) | **First set**, last |
| **G7** | **The house leak** (M1 L2–3) | K1 | The cross-section; room, then room + anchor + position, anchors duplicated across rooms | cover | 4 | 4 | 5 | 5 | 2 (the big art item; `rel.js`) | No (E49–E58, A5) | Held: words, relations, art |
| **G8** | **Into the shed** (M3; absorbs Tidy up's M8, calm in Drizzle) | K4 | Thunder; an animal bolts; Nani calls which animal, which shelter; swipe behind it; chicks are scooped | shoo, scoop | 4 | 3 | 4 | 4 | 2 | No (G27–G35) | Held: second wave |
| **G9** | **Batten down** (M5) | K3 | The verb picks the gesture: shut the window, cover the pot, open the door | batten | 3 | 3 | 5 | 3 | 3 | No (G20–G26) | Held for the verbs |
| **G10** | **Kasuku's echo** (new) | K5 | After a storm, in the hub: say one of the word review's words; Kasuku repeats the one he heard, so the child hears whether they were understood | say, echo | 4 | 2 | 3 (shadowing) | 3 | 5 | Yes | Warm-down; ungraded |
| **G11** | **Nani calls** (M11b) | — | An adult reads the caller card aloud; the child plays any mini-game; a family stamp, no ear star | caller | 5 (with Nani) | 3 | — | 5 | 5 | Yes | Straight after G1 |
| **G12** | **Rain tune** (M9) | K1 | Pots ring when drops land; Nani calls a pattern; tap it back on the beat | tune | 4 | 2 | 3 | 3 | 2 | Yes | Held: a toy, not a gate |
| **G13** | Power cut (M10) | — | The room goes dark; the calls carry on | dark (Find it) | 4 | 4 | 5 | 4 | 4 | — | **A modifier** on G1, G6, G7, not a mini-game |

**Rejected:** *Bucket chain* (M7: kinship with faces in view tests little; the Chai tray serves the person already); *Umbrella* (M8: walking full-body characters for G6 with legs); *Puddle hop* (new: *this side / that side* on a walker is the clinic's level-3 problem with worse art); *Thunder count* (new: nothing said in Kutchi decides anything).

**Why G2 and G3 are in and G7 is held.** The review's fair caveat is that the kitchen slice is Cook's *pass me* under a beat and the mode's identity is all placeholders. G2 and G3 answer that with real words: **holding your nerve and counting what falls** is a feel Cook doesn't have, and **being the caller** is the mode's identity in one minute. G1–G3 are three mini-games on one scene with no new art and no new words. G7 stays the story's flagship, but it waits on rooms, `rel.js` and the cross-section.

### D.3 The mechanics list

Ids are files: `js/monsoon/mechanics/<id>.js`, or `js/shared/mechanics/<id>.js` where shared. Each takes its levels from data and runs alone in the Rush lab or in a zone of a combined station (G4 + G5 is one station on the courtyard crop, like Cook's Chai tray).

| Id | One line | Tag |
|---|---|---|
| `cover` | Tap a candidate during a live call; the lid or bucket swings there; one answer per target; resets after the wave | **New** |
| `count` | One drop let in per unit, then Done (the lid); never ends by itself; the tally shown, never the target | **Reused from Cook** |
| `passme` | Nani's sidebar "pass me" between waves in Drizzle, weakest word first, from one look-alike group | **Reused from Cook** |
| `pour` | Empty the saved water into Nani's planter at the storm's end (a craft flourish, ungraded) | **Reused from Cook** |
| `hold` | Press and hold the tarp down until the gust passes | **New**, on knead's press input |
| `tarp` | Pull the tarp over or back in one drag (rain / sun) | **New** |
| `unpeg` | Tap-and-pull an item off the line into the basket; extras are wrong | **New** |
| `catch` | Open your arms at a spot; the cat pops out on the beat and leaps in | **New** |
| `shoo` | Swipe behind an animal; it trots the other way, auto-aimed ±30° to the nearest shelter | **New** (Tidy up's M8 is dropped) |
| `scoop` | Cupped hands lift a chick or Zazu and set it where she said | **New** |
| `say` | The speaking moment: a mic button (`listen` must start from a tap), `Speech.listen({choices, timeoutMs})`, Nani silent while listening, the pill fallback, the parent's ✓, the voice tally | **Shared** with every mode's role reversal (Cook's Tell Ali, Find it, Tidy up, the clinic's bring-them-in); Monsoon keeps a local copy until `js/shared/mechanics/say.js` lands |
| `callit` | `say` on the beat: the child's window is the call window; Ali runs to what was heard, or shrugs on null | **New** |
| `echo` | Kasuku repeats the word the recogniser picked; ungraded | **New** (uses `say`) |
| `caller` | The big Kutchi-text card an adult reads aloud; the child plays | **New** |
| `dark` | The darkness mask with random lightning; calls carry on | **Shared** with Find it (its torch mask) |
| `batten` | A verb → gesture dispatcher over `cover`, `unpeg`, `tarp` | **New**, held |
| `tune` | Echo a called pattern of pots on the beat | **New**, held |

**12 new, 3 reused from Cook, 2 shared** (`say`, `dark`). From the foundation, not mechanics: the which-one decoy module (look-alike candidates; colour decoys for G5), `rel.js` and scene `spots` (G6 L2+, G7), star sets and ear/voice rules as data, `js/shared/speech.js`. The call engine (`clock.js`, `calls.js`, `stage.js`) is this mode's own.

### D.4 Speaking moments

Rule for this mode: **the caller can see.** In every K5 round the child is put where the answer is visible (the roof, the gate, the window) and the *character* can't see, so speaking is never a listening test in disguise. The voice star is its own star; the ear star is untouched by K5 rounds. Recognition is closed-set from the family's recordings plus enrolled takes (`Speech.listen`); it returns null below its confidence floor, and null never blocks: the pills appear and, in Drizzle, the drop waits. Nani is silent while the mic is open.

| Moment | Closed set (size) | What the character does | Fallback | When |
|---|---|---|---|---|
| **G3 You call it, kitchen** | The pots on the island: one look-alike group, e.g. *dudh, paani, chai, atto, daal* (3–5) | Ali lids the pot the game heard; the drop falls on the beat; a wrong pot plops and Ali looks up at you | Audio-only pot pills in the sidebar (the old chunk buttons); or a parent taps ✓ | G1 words at stage 3+ only (you call what you can already hear); first set |
| **G2 Drip count: the number** | *hikdo, bo, trae, char, panj* (5) | Ali lets that many in, then lids | Number pills; parent ✓ | G2 level 3 |
| **G4 Forecast: you're at the gate** | The weather words (3–4) | Nani at the charpai pulls, rolls, holds, or scoops Zazu, on your word | Weather pills; parent ✓ | G4 level 2, once G1–G6 have Kutchi |
| **G6 Cats: you're at the window** | The hiding-spot anchors (4–6) | Ali opens his arms at the spot you named | Anchor pills; parent ✓ | G6 level 3, once anchors have Kutchi |
| **G8 Shed: two slots** | Animal (3), then shelter (3): two `listen` calls | Ma shoos the animal you named to the door you named | Pills per slot | G8 level 3 |
| **G10 Kasuku's echo** | The storm's word-review words (3–8) | Kasuku repeats the one he heard; a head tilt on null | None needed (ungraded) | After any storm |

**Voice star ("Called it", a megaphone):** ≥80% of the child's calls recognised as the target or ✓'d by a parent, over ≥4 calls; the pill fallback doesn't count for the star but is a fine way to play. **Blind bot:** a random "said" choice earns it 0.16% at 5 choices over 6 calls. The real risk is the recogniser mapping English *milk* onto *dudh*: that's the confidence floor, and the lab gets an `english` bot (a recorded English speaker) whose report must show mostly nulls.

### D.5 The first set, and the level ladder

**First set, in build order: G1 kitchen leak → G2 drip count → G3 you call it → G4 forecast with G5 unpeg → G6 cats.** The first three are one scene, no art, no new words, and three kinds of decision (which, how many, said): the slice the review asked to move to the front, made three mini-games wide. G4–G6 are the courtyard station and the mode's own identity (weather, the cats), built greybox now and counted as Kutchi tests when the words land. **Held:** G7 (words, `rel.js`, the cross-section), G8 (animals), G9 (verbs), G11 (cheap; straight after G1), G12, G13 (a flag once G1 L2 exists).

**Blind-bot estimates at level 1** (random strategy; the ear needs 80% of ≥6 tested calls, ≥10 in G4): G1 **0.16%** (5 candidates); G2 **0.16%** (5 numbers; a "lid at once" bot wins only the *hikdo* calls); G3 voice star **0.16%**; G4 **0.34%** (1 in 3 with the state leak, 10 calls); G6 **0.05%** (4 spots, 8 calls). Every other strategy in 8.5 is at or below random by construction.

**The level ladder: what the call carries.** Levels are data and follow the player's word stages.

| Level | Name | What Nani's call holds | Tempo | Speaking |
|---|---|---|---|---|
| **1** | *One word* | A noun (*Dudh!*), a number (*Trae!*), or a weather word; one kind per storm | Drizzle by default; Busy 60 bpm, a 4-beat window | None |
| **2** | *Two things* | A double (*Dudh! Ne paani!*), noun + number (*Dudh! Bo!*), or the no-go (the tarp's already on); two kinds in a storm | 72 bpm | G10 echo after the storm |
| **3** | *Order and switch* | A sequence (*Dudh, ne poi paani*: the second reveal a beat later), the switch (*Nar dudh, paani!*, draft), *it stopped raining*; in the house, room + anchor + position | 84 bpm | G3: the child calls half the waves |
| **4** | *Your storm* | As 3 at the player's own tempo record; a K5 wave whenever a word reaches stage 4; the dark modifier | Rising every four waves | The child calls; Nani only acts |

A child feels it as: *she says one thing → she says two → she changes her mind → I'm the one calling.*

### D.6 Story home and free play

| Mini-game | Story home |
|---|---|
| G1 kitchen leak | Arc 3 Ch2 **The leak**, the first minute (the kitchen before the house); the Ch5 *Chai together* cameo wave |
| G2 drip count | Ch2, the second minute: Ali's lids are all in use, *"Trae!"* |
| G3 you call it | Ch2's payoff: Ali has carried every bucket, so you go up on the roof and call for him |
| G4 forecast + G5 unpeg | Arc 3 Ch1 **Clouds coming** (Monsoon owns the chapter; Dress up's weather moves to Ch4; Tidy up's washing sort is free play) |
| G6 cats | Ch1's end: the cats in before the rain |
| G7 house leak | Ch2 from the third minute, once the art exists |
| G8 shed | Arc 3 Ch3 **The animals**, then Find it finds the chicks; Arc 5's farm storm |
| G10 echo | The end of any storm, in the hub (Kasuku's cast rule: outside rounds only) |

**Free play, one entry: "It's raining at Nani's"** (the rain-cloud icon on the map, or the yard): pick any mini-game, or the endless storm, or G11 with an adult. The **60-second round** is this mode's entry in the one rotating hub daily; there's no separate Monsoon minute.

### D.7 The review's critiques

| Critique | What I did |
|---|---|
| Move the kitchen slice to the front; its tasks touch no shared file | **Done**: phases 0–2 below; G1 unchanged; G2 and G3 added on the same scene, so the front of the build is three mini-games |
| The kitchen slice is Cook's pass me under a beat; the identity is placeholders | **Accepted and answered**: G2 and G3 are real Kutchi and the mode's own feel; G7 waits, flagged honestly |
| Put the `monsoon` block in a sidecar, not `kitchen.json` | **Done**: `data/scenes/kitchen-monsoon.json`; `keyAt` in `data/monsoon-audio.json` instead of editing `build_audio_manifest.py` |
| G8 duplicates Tidy up's M8; drop M8 | **Adopted**: G8 absorbs it; Drizzle is the calm version |
| Five claimants on Arc 3 Ch1; Monsoon owns it | **Adopted** (decision 2 confirms) |
| Busy misses could demote a known word in one storm | **Changed**: `late` never counts against a word's stage (speed, not meaning); Busy `wrong` counts half; at most one stage per storm; Drizzle misses count as Cook's do |
| The 80% ear rule is new | **Data** (`earPass` 80%, `minTested` per mini-game) on the shared "≥N tested rows" rule with a per-mode knob |
| Six daily minutes | **The Monsoon minute is dropped** for a 60-second entry in the hub daily |
| Audio clock, `keyAt`, phone latency, the cross-section as one big art item | Kept: the virtual clock in phase 0; `keyAt` in a sidecar; the cross-section held with G7; a real-device latency check is phase 3's exit test |
| Rooms decision blocks L2 only | **Agreed**: G7 is out of the first set |

### D.8 Words needed, in priority order

Only the family's own words; grey-italic placeholders until then. **QfM** = the Questions for Mum doc (not edited).

| Priority | Words | For | In QfM? |
|---|---|---|---|
| 0 | Nothing: the food nouns, numbers 1–5, *Hedo!*, *Ne*, *Arre re!* exist and are recorded | G1, G2, G3, G10, G11 | — |
| 1 | *Ne poi* and *Nar* confirmed (both drafts) | G1–G2 level 3 | Yes: A3.4, A4.2 |
| 2 | The monsoon calls: *Quick! Here! Not there! Inside! Come here! Catch it! Put the bucket there! Wait!* | Every mini-game's recasts and twists | Yes: G15–G26 |
| 3 | Weather: sun, rain, cloud, wind, thunder, lightning; *it's raining / windy*; *it stopped raining* | G4 | Yes: G1–G14, A6.1 |
| 4 | Clothes (kurta, dupatta, prayer cap, towel, socks), colours, whose | G5 | Yes: F45–F63, E60–E71, E14 |
| 5 | Anchors: window, door, table, bed, charpai, cupboard, shelf, stove, bucket; water pot, washing line, tree, gate, sewing machine | G6 L2+, G7 | Yes: E16–E48, G36–G40 |
| 6 | Positions: on, under, behind, next to, in front of, between; this side / that side | G7 L3, G6 | Yes: A5, E1–E13 |
| 7 | Rooms: kitchen, sitting room, bedroom, courtyard, veranda, roof, shed, hen house | G7 L2, G8 | Yes: E49–E58 |
| 8 | Animals: goat, hen, chick, cat; plurals; *two goats* | G8 | Yes: G27–G35 |
| 9 | Verbs: shut the window, open the door, cover the pot, bring the washing in | G9 | Yes: G20–G23 |
| 10 | *Well done!* in Nani's voice (G104 is the doctor's); the English-menu-word tick | Praise; the Sceptic | **No**: Zafar's own list (6.6) |

### D.9 Decisions for Zafar (blocking only)

1. **Monsoon at the front of the build, with G1–G3 as the slice.** Default: yes, as the review recommends.
2. **Arc 3 Ch1 belongs to Monsoon** (Dress up's weather to Ch4; Tidy up's washing sort to free play). Default: yes. Blocks the story data for G4–G6, not the greybox.
3. **What Ali does when the recogniser returns null in Busy**: shrug and let the drop fall (a comic `late`), or pause for the pills? Default: **Drizzle waits and shows the pills; Busy shrugs**; null never counts against the voice star.
4. **Rooms of the house** (review #16). Default: kitchen, sitting room, Big Ma's room. Blocks G7 data and art only.

### D.10 What changed below

| Section | Change |
|---|---|
| 3, 4 | The library is D.2; the first set is D.5; M7 and M8 rejected outright; M10 is a modifier |
| 5.4 | The Monsoon minute becomes a 60-second entry in the hub daily |
| 6.4, 8.1 | Busy `late` never drops a stage; Busy `wrong` counts half; at most one stage per storm |
| 6.5 | M11(a)'s chunk buttons are the **fallback** for a spoken call (D.4); the mic button; Nani silent while listening |
| 7 | A fourth star, **Called it** (voice), on K5 rounds only |
| 8.2, 8.3, 8.6 | `kitchen-monsoon.json` and `monsoon-audio.json` sidecars; a Node bot; mechanics as in D.3 |
| 12 | The build brief rewritten: phased, own files first, shared pieces listed |

Everything else (the engine, the hint ladder, the stars, the art list, the persona loops) stands.

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
| "Nani has a cold" | **The doctor's clinic** (treat) |
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

## 12. Build brief for the build agent (rewritten 25 Sept, deep dive)

**Rules you inherit:** never invent Kutchi (placeholders as `"kutchi": null`, grey italic); levels are data; mechanics are files; every decision comes from something said and varies each storm; help that shows costs the ear; one place for text; nothing covers the play area; upgrades never listen; look at your screenshots. **Plus:** never edit `js/cook/*`, `css/cook.css`, `data/cook.json`, `data/scenes/kitchen.json`, `data/scenes/courtyard.json` or `build/build_audio_manifest.py`; every new key goes in this mode's own files; load Cook's modules, never copy them.

**Your own files (phases 0–2 touch nothing else):** `monsoon.html`, `css/monsoon.css`, `js/monsoon/{core,clock,calls,stage,fx,lab,bots,speech-stub}.js`, `js/monsoon/mechanics/{cover,callit,echo,caller,tarp,hold,unpeg,catch,shoo,scoop,batten,tune}.js` (and a local `say.js` until the shared one lands), `data/monsoon.json`, `data/monsoon-audio.json` (each clip's `dur` and `keyAt`), `data/scenes/kitchen-monsoon.json` and `courtyard-monsoon.json` (sidecars: pots, drips, hides, line, shelters keyed to the base scene's anchors), `build/leak_monsoon.mjs`, `build/test_monsoon.py`, your own test port.

**Shared pieces you assume from the foundation agent (don't design them):** the shell ("one app, one save"); `data/relations.json`, `js/shared/rel.js` and scene `spots` (G6 L2+, G7); the which-one decoy module (look-alike candidates, colour decoys); star sets and ear/voice rules as data (`star_sets.monsoon`, `earPass`, `minTested`, `voicePass`); `js/shared/speech.js` (`Speech.listen({choices, timeoutMs}) → {choice, confidence} | null`, already in the tree); `js/shared/mechanics/say.js`; `dur` and `keyAt` in the audio manifest (you supply `data/monsoon-audio.json` for the merge); Cook's frozen UI API after Wave 5A (intro card, ladder row, "?" cost, word review, sidebar).

### Phases and acceptance criteria

| Phase | Files | What's playable | Acceptance |
|---|---|---|---|
| **0 Pure logic** | `calls.js`, `clock.js` (with the virtual clock), `data/monsoon.json`, `build/leak_monsoon.mjs` (Node, no browser, like Who did it's bot) | Nothing on screen: storms for G1, G2, G4, G6 generated and graded headless; the bots run in Node | 1,000 storms per mini-game per level pass the section 8.1 constraints and χ²; every bot earns the ear in **<2%** (hard fail 10%); grading unit cases (early right, early wrong, late dive, spam, retry, stage 1, a fourth drop, an early lid, a no-go acted on); the Busy stage rule (D.7) |
| **1 Greybox kitchen** | `monsoon.html` loading Cook's modules, `stage.js`, `fx.js`, `lab.js`, `bots.js`, `mechanics/cover.js`, `kitchen-monsoon.json`; Cook's `count` and `passme` reused | **G1 L1–3 and G2 L1–3** in the Rush lab, Drizzle and Busy, code-drawn heap pots and lids; the call pill; stars as they happen; the word review | Six sizes plus 375 px; the tap-cover check; the Playwright bots agree with the Node bots; no console errors; screenshots looked at |
| **2 Speaking** | `mechanics/callit.js`, `echo.js`, a local `say.js`, `speech-stub.js` (the `listen` signature, driven by the lab: "heard X", "null", "wrong", "timeout") | **G3 and G10** in the lab: the mic button, Nani silent while listening, the voice star, the pill fallback, the parent ✓ | Every path reachable from the lab; swapping in `js/shared/speech.js` is one line; the `english` bot's report; G11 caller card legible at arm's length on the iPad |
| **3 Courtyard station** | `tarp`, `hold`, `unpeg`, `catch`, `scoop`; `courtyard.json` read only; `courtyard-monsoon.json` | **G4 (+ G5 as L2–3) and G6** greybox; placeholders flagged "not yet a Kutchi test" | Bots including `state` <2%; the weather-at-the-reveal and silent-bell checks; **a real-device latency check** (phone, tablet): median input latency logged, windows adjusted as data |
| **4 Integration** | With the shell: the Ch1 and Ch2 first minutes, `star_sets` as data, the hub-daily 60-second entry, the shared `say.js`, relations for G6 L2+ | Ch1 and Ch2 from the map; the free-play entry "It's raining at Nani's" | One save; the placeholder report; the word review lists every called word; G1 exactly as task 2 describes |
| **5 The house and the yard** | G7 (the cross-section, `rel.js`), G8, G13 dark, G9 when the verbs exist, G12 | The story flagship | Bots <2% including kind × shelter uniformity; free-play records save per profile |
| **Art run** (after each greybox audit) | Cross-section, courtyard dressing, props, animals, cat and Ali poses (section 9.4) | | The art bible QA checklist on every screenshot; `place_preview.py` for every spot |

### The first three tasks

**Task 1: the clock and the call engine, Node-first** (`js/monsoon/clock.js`, `calls.js`, `data/monsoon.json`, `data/monsoon-audio.json`, `build/leak_monsoon.mjs`)
- `clock.js` and `calls.js` are plain modules that run in Node and the browser (the UMD shape `js/shared/speech.js` uses). `Monsoon.clock`: `now()`, `at(t, fn)` on `AudioContext.currentTime`; `VirtualClock.advance(dt)` for tests (`?clock=virtual`).
- `keyAt` and `dur` per clip come from `data/monsoon-audio.json` (default: the clip's length until the family's recordings are marked up); nothing edits the manifest builder.
- `Calls.storm(game, level, scene, profile)` → waves (section 8.2 shape, plus `count` targets for G2 and `nogo` for G4) obeying every constraint in 8.1, weakest-first from `js/progress.js`, excluding `menu_words`, ≤3 stage-1 words. `Calls.grade(wave, answers)` → outcomes, slot-wise blame, the ear tally, reaction times, **the Busy stage rule**; `Calls.stars(storm)` → ear, umbrella, lightning/tick, and the voice star from `earPass`, `minTested`, `voicePass`, `par`.
- `build/leak_monsoon.mjs`: the bots of section 8.5 against the generator alone (no browser), `--game --level --storms 500 --report`.
- **Done when:** the report shows every bot under 2% for G1, G2, G4 and G6 at L1–3, the χ² and constraint checks pass over 1,000 storms, and the grading unit cases all return the expected outcomes.

**Task 2: G1 the kitchen leak, then G2 drip count** (`js/monsoon/stage.js`, `fx.js`, `mechanics/cover.js`, `data/scenes/kitchen-monsoon.json`)
- **G1 exactly as the previous task 2**: the hub kitchen `bg-nani-kitchen-v3` read from `kitchen.json`; 6–8 pot positions in the **sidecar** (island baseline 496; shelves 137/256/365); candidates from whole look-alike groups; code-drawn heap bowls with ≥130 px hit areas; *"Hedo! {x}!"*, *"{x}! Ne {y}!"*, *"{x}! Ne poi {y}!"*, the switch as a draft; every stain swells in phase; mono creak; tap → C1 pinch drops a lid; the reveal plinks or plops; lids pop off after the wave; Drizzle waits; the free replay after 8 s; the retry call 2–4 waves later; the tempo step every four waves.
- **G2 on the same scene:** one open pot (L1), Cook's `count` with a drop as the unit and the lid as Done: *"Trae!"* → three plinks, then tap the lid; a fourth drop, or a lid before the count, is `wrong` with the number word blamed; L2 *"{x}! {n}!"* (which pot, how many); L3 two pots.
- **Done when:** both play in the Rush lab at L1–3 in Drizzle and Busy on all six sizes, and a test player driven by `z.expect` gets three stars in each.

**Task 3: the lab, the bots in the browser, and G3** (`js/monsoon/lab.js`, `bots.js`, `speech-stub.js`, `mechanics/callit.js`, `build/test_monsoon.py`)
- The lab as in 8.4, plus a **speech panel**: "heard X", "null", "wrong", "timeout", and the `english` bot.
- G3: the roof view (a code-drawn strip: the stains from above, one swelling, visible to the caller); the mic button (a tap starts `listen`; Nani silent while it's open); Ali at the pots; the pill fallback; the parent ✓; the voice star; Drizzle waits on null, Busy shrugs (decision 3).
- `test_monsoon.py`: `--lab --game --level --busy --drizzle --viewport --canvas --virtual-clock --bot <name> --storms N --report`, the tap-cover check, screenshots to `build/screenshots/monsoon/`.
- **Done when:** every bot is under 2% on G1–G3 at L1–3 in both harnesses, the six sizes and the 375 px phone pass, every speech path is reachable from the lab, and the screenshots have been looked at.

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
