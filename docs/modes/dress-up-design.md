# Dress up: design (mode id `dress-up`)

**Date:** 25 Sept 2026
**Status:** proposal for Zafar; phases 0–1 of the deep dive's brief are built (`build/reports/dress-build.md`). **The pipeline design (25 Sept, evening) is current and supersedes the deep dive and the sections below wherever they conflict; the mini-game quality pass above it (25–26 Sept) sharpens the pipeline design and wins where the two differ** (the eight table games, the merged stage variants, the controls audit); P.8 as amended by Q.8 is the build brief that the next build agent follows (section 12 is kept for reference). Follows `docs/modes/MODE-DESIGN-BRIEF.md` and `docs/modes/DEEP-DIVE-BRIEF.md`. Builds on `docs/game-modes-v2.md` (mode 4), `docs/find-it-design.md` (the model), `docs/cook-with-nani-phase-a-design.md`, `docs/cook-with-nani-kutchi-audit.md`, `docs/cook-with-nani-todo.md` (Waves 1–5) and the Art Bible.
**Placeholder rule:** the Kutchi below uses only words and frames already in `data/content.json` or `data/cook.json`. Anything written `[EN: red]` has no Kutchi yet and shows in the game as a grey italic English placeholder until the family gives the word. **Never invent Kutchi.** Right now the repo has **no Kutchi for any clothes, colour, pattern or weather word**, so every decision word in this mode starts as a placeholder (section 6.6 is the ask list).

---

## Mini-game quality pass, 25 Sept 2026

**Why this section.** Zafar, after reading the pipeline designs (`docs/modes/MINIGAME-QUALITY-BRIEF.md`): the idea is right, but each mini-game has to be *distinct and good* ("what do you need to do, where is the challenge, where is the fun, where is the instruction, what is novel"), and twenty table games is too many. This pass answers those five questions for every mini-game in the pipeline design below, scores each 1–5 per question, cuts **Big Ma's table from twenty games to eight** (two of them merged pairs), trims the stage variants to two or three each, checks every survivor against the other five modes' pipeline designs, and audits every control against UX §12 **as clarified on 26 Sept: consistent gestures inside a mini-game, fixed across its levels (not tap-only)**. It sits above the pipeline design and sharpens it; Q.8 lists the edits made to P.2, P.3, P.6, P.8 and P.9. The deep dive and the older sections are untouched.

**Kutchi in this section** is only what the family has given (`data/cook.json`, `docs/kutchi-grammar-notes.md`): *hakro/hakri, ba, trae, char, panj*; *wadho/nindho* (he-forms; plural *wadha*); *nar* (draft); *pela … ne poi …*; *ne*; *{x} lai*; *Muke {x} de*; *Muke {x} khape*; *hi*; *khan*; *saathe*; *Achija!, Arre re!, Hedo!, Ghan, Aabhar aanjo*. Everything in `[EN: …]` is a placeholder and stays grey in the game. Big Ma is this mode's host, so where UX §13 says "Nani is a voice" read Big Ma: in play she is a voice, the throbbing hint and the interjection (*Arre re!*, *Shabash!* once recorded); she is on screen only on the request card, in story beats and at the send-off.

### Q.1 Research: what's working right now, and the mechanic borrowed

The 25 Sept pass (P.4) covered the tailor-shop genre; this one names the **specific mechanic** taken from what is charting for children in 2024–26 and why it works. (The app stores were blocked from this container on the 25th; these rows are from the games themselves and their reviews, not fresh store pages.)

| Game | The specific mechanic | Why it works | Where it goes in Dress up |
|---|---|---|---|
| **Toca Boca World** and **Toca Boca Days** (Toca Boca) | Every tap gets a physical, characterful reaction; nothing fails; the screenshot or sticker to keep | The reaction *is* the feedback, so a child never needs a verdict | Every garment and tool reacts on tap (the kurta puffs, the iron hisses, the scissors snip); the lookbook snapshot is the keepsake; no red cross mid-round (UX §11) |
| **Sago Mini World** (the babies' dressing scene) | Tap a garment; it wriggles onto the baby, who giggles; a wrong choice is impossible, so the giggle is the whole reward | Delight at the moment of placement, not at the end | `wear`'s swish and the client's giggle in 5a; the fun is *on* the tap, the grading waits for the mirror |
| **Pok Pok Playroom** (Apple Design Award winner; still updated) | No instructions at all; a "busy book" of one-tap cause-and-effect toys | Children learn a control by seeing it react once | The ghost-finger onboarding (UX §8); the table's free-play practice mode, where any tool can be tapped just to hear it |
| **Lingokids** (the dress-up activity) | A character asks for a clothing item by name; the child taps it; it goes on; the word is said again | The smallest possible listen-then-act vocabulary loop | 5a at level 1 is exactly this loop; Dress up adds binding (colour + garment), *for whom* and the mirror's recast |
| **Bluey: Let's Play** (Budge; the dress-up room) | Tap an outfit and it swaps with a cheeky character reaction | One tap, one visible change, one joke | 5c Tell Ali: Ali wears exactly what was heard, comically wrong if wrong, and keeps wearing it to the mirror |
| **Hey Duggee** apps | A badge at the end of every activity and the same closing ritual each time | A ritual ending children expect and wait for | Every client ends the same way: the mirror, the photo, Eidi or the goodbye (6a, 6c, 6d) |
| **Dr. Panda Home** | Chores as tiny tasks with a visible finished state | Short, satisfying, complete | T5 Iron: the crease pops flat and the garment folds itself onto the rail |
| **BabyBus: Baby Panda's Fashion Dress-Up** (and its tailor games) | Named skills (cut, sew, iron, polish) drawn per customer, one customer at a time | A pool of small jobs feels like a trade | The table pool per client (P.3, now eight games) |
| **Good Pizza, Great Pizza** | The customer's order has a twist ("no onions… actually, extra"); you build it; the customer's reaction is the grade; toppings are tapped on | The order is the puzzle; the reaction is kinder than a score | The change of mind and the *nar* row (5a from L2); the mirror as the client's reaction; tap-to-place everywhere |
| **Overcooked** (and the Overcooked-style mobile kitchens) | Order tickets that tick off line by line as you plate; one station, one job | Progress you can see without a verdict | The auto-tick card (UX §11); one job per stage; the tally in the corner |
| **Cooking Mama: Cuisine!** (Apple Arcade) | Each recipe step is one gesture, a short bar, and Mama's verdict; the gesture never changes | One verb per step is learnable by a five-year-old in one go | Every table game is **one verb** (Q.4); the neat star is Mama's "perfect"; gestures fixed per game (Q.2) |
| **Tie Dye** (Crazy Labs) and the ASMR-craft wave | Fold, dip, unfold: a blind step, then the reveal | The reveal is the most-shared moment on mobile crafts | T9 Bandhani: tie *trae* dots, dip, untie |
| **Toca Tailor** | Hems dragged longer or shorter; patterns as tintable masks; the photo at the end | Making a garment yours | 2a's *spoken* length that the cut must match (T1); the photo (6c) |
| **Khan Academy Kids** and **Duolingo ABC** | Avatar dress-up as an *ungraded* reward after graded work | Expression after effort | The lookbook's free choices are never graded (D.2's G9 rule stands) |

### Q.2 Controls audit (UX §12 as clarified on 26 Sept)

**The convention for the whole mode.** *Tap chooses and places* (a person on the bench, a body part, a hanger, a bolt, a garment, a slot, a pose pill). *One drawn gesture works a tool* (a swipe for the scissors and the needle, a rub for the iron, tapping in a row for the block and the pedal). Inside one mini-game every choose-or-place action is a tap, there is at most **one** tool gesture, and the gestures are the same at every level: levels change the Kutchi, never the hands.

| Mini-game | What the pipeline design said | Change |
|---|---|---|
| **2a Where's the tape?** | L1 "tap one"; L2 "drags the tape's end onto it" | **Tap at every level.** The tape animates itself round the tapped part. (The gesture changed by level: not allowed) |
| **2b How long?** | "Drag the chalk line to the long or the short mark" | **Merged into 2a as a second tap** (tap the long or the short mark on the slate). One game, all taps |
| **3b The sliding rail** (the clinic's `belt`) | The clinic's default: tap at L1, drag from L2, drag to the right dish at L3 | **Tap at every level, in both modes.** The hanger hops to the next empty basket slot; an order row (*pela … ne poi*) is judged by tap order. This overrides the clinic's P11 decision 5 default: `belt` is one gesture at every level (see P.9, decision 8) |
| **T7 Pin the dupatta** | Press-and-hold to push each pin in | Cut (Q.4). If it returns: tap the spot |
| **T8 Thread the needle** | A steady drag to a small target | Cut (Q.4): a motor test, not a listening one |
| **T9 Bandhani** | "Pinch and tie", then `dip` on Cook's press-and-hold `pour` | **Tap each dot to tie it; tap the pot to dip.** Cook's hold-to-pour didn't land in testing (UX §12); the dip is a tap that does the whole dunk |
| **T11 Dye the cloth** | Same `dip` | Merged into T9's level 2–3 (Q.4); the pots are tapped |
| **T2 Seam it on the machine** | Steer the cloth under the needle *and* tap the pedal | Two hands and a steering control under time; merged with T17 into **The pedal**, all taps (Q.4) |
| **T5 Iron**, **T1 Cut**, **T3 Buttons**, **T4 Motif**, **T10 Block print**, **T15 Bangles** | Tap to pick and place; one tool gesture (rub, swipe, swipe, swipe, tap-in-a-row, none) | Already consistent; unchanged, and fixed across levels |
| **1a, 1b, 3a, 3c, 5a, 5b, 5c, 6c** | Taps only | Unchanged |

### Q.3 Stages 1, 2, 3, 5 and 6: the five questions, scored

Scores are 1–5 for each of the five questions (do · challenge · fun · instruction · novel), total out of 25. "Novel" is checked against every other mode's pipeline design (Q.5). The verdict keeps two or three mini-games per stage; the rest merge or go to Q.7.

**Stage 1: Who's next? (the bench)**

| Variant | What you do | Where the challenge is | Where the fun is | Where the instruction is | What's novel | Score | Verdict |
|---|---|---|---|---|---|---|---|
| **1a Bring in…** | Tap the person Big Ma named; they get up and walk to the rug | The kinship or people word among 2 (L1), 4 (L2); L3 two of a kind, told apart by house colour; L4 *first … then* (1b folded in): two people tapped in order, each to a numbered spot | The walk: Nana's slow shuffle, the baby carried by Ma, Ali skidding in; a wrong tap and that person just yawns and sits (no buzz) | Card: Big Ma's face, *[EN: bring in] Nana*. Voice: the name again after 8 s, free. L4: *pela Nana, ne poi Ali* (real) | The person you bring in is the client you then measure, dress and photograph: the tap has a two-minute consequence. Simba and Zazu sit on the bench too and can be called (a one-slot client: their bow, see Q.4) | 4·4·4·4·3 = **19** | **Keep**; 1b merges in as its L4 form |
| **1c Call them in** (speaking) | Say the name; whoever was heard stands up and comes | Producing the word (closed set: the 3–5 on the bench) | The wrong person standing up, puzzled, and sitting again | The card shows the picture; Big Ma nods at the bench | Nothing: it is the clinic's W3 exactly | 3·3·4·3·1 = **14** | **Keep as deliberately shared** with the clinic's W3 on `say`; not counted as a Dress up game |
| 1b First…, then… | — | — | — | — | Same as Tidy up's seating order and Monsoon's day strip | — | **Merged** into 1a L4 |

**Stage 2: Measure (the tape)**

| Variant | What you do | Where the challenge is | Where the fun is | Where the instruction is | What's novel | Score | Verdict |
|---|---|---|---|---|---|---|---|
| **2a Measure up** (2a + 2b merged) | Tap the part Big Ma names; the tape zips round it; then tap the long or the short mark on the slate | L1 the part (3 pulse, the clinic's scaffold); L2 the part named among 6 and the size word (*wadho / nindho*); L3 *[EN: the left] arm*, two parts in order (*pela … ne poi*) | The "zzzip" and snap; Nana breathes in for the tummy and the tape pings off; the chalk squeak on the slate; the number written is nonsense to the child but Big Ma nods gravely | Card: *[EN: arm]*, then *wadho ke nindho?* (*ke* = or, heard). Voice: the part again on the throb | The only place a measurement is **carried forward**: what the slate says sets the cut (T1). The clinic taps the part that hurts; here the tap produces a *size* the next stage must honour | 5·4·4·4·4 = **21** | **Keep** (one game, all taps) |
| **2c Read it back** (speaking) | Big Ma asks *wadho ke nindho?*; the child answers; she writes what she heard | Producing the size word (closed set 2–4) | Her chalk writing the wrong one and Nana's eyebrows | The card shows the tape's colour band (long / short), no text | The first speaking of *wadho/nindho* in any mode with a consequence (the wrong size gets cut) | 3·3·3·4·3 = **16** | **Keep** (L2+, small) |

**Stage 3: Fetch (the shelf, the rail, the bolts)**

| Variant | What you do | Where the challenge is | Where the fun is | Where the instruction is | What's novel | Score | Verdict |
|---|---|---|---|---|---|---|---|
| **3a The wardrobe shelf** (built) | Tap a folded garment, tap the person's pile on the bed | Colour + garment among look-alikes (the asked kind in 3 colours), then *for whom* (*Nana lai*, real); L2 two people and a change of mind; L3 three people, neighbouring colours, the card hidden | The garment unfolding mid-air and landing with a flump; a pile that wobbles when it's tall | Card: *Nana lai: [EN: white kurta]*. Voice: the row again on the throb | The **two-tap decision** (what, then whose): Tidy up's gather is one tap to one tray; here every pick also lands on a person | 4·5·3·5·4 = **21** | **Keep** (the first-session fetch) |
| **3b The sliding rail** (the clinic's `belt`, shared) | Tap the asked hanger as it glides past; it hops into the basket; Done stops the rail | Pairs, *nar* rows, counts (*ba dupatta*), the loop (waiting never helps); L3 faster and the card hidden | The dry-cleaner's rail clatter; a hanger tapped late swinging round again; over-grabbing fills the basket to overflowing (shown at the end, not buzzed) | Card: *Muke [EN: red kurta] khape, ne [EN: green cap]* (real frame). Voice: *Hedo!* when the asked one first appears at L1 only | Nothing in the mechanic (it is the pharmacy belt with hangers, and Tidy up's 2c); the Dress up twist is that pieces the table *makes* fly onto this same rail, so the basket and the rail share one object | 4·4·4·4·2 = **18** | **Keep as deliberately shared**; only one of 3a / 3b per route |
| **3c Bolts and spools** | Tap the bolt, tap the spool; both go to the cut | Fabric colour + pattern (*[EN: dotted], [EN: striped]*) and thread colour that **binds** (the fabric colour is a decoy spool's colour); L3 the length from the slate | The bolt unrolling across the table with a thump, Zazu riding it; the spool spinning off its pin | Card: *[EN: green], [EN: dotted]. [EN: Red thread].* | The only pattern words in the game, and the only binding across two *different* objects (cloth vs thread) | 4·5·3·4·5 = **21** | **Keep** (Arc 2 and free play; L2+) |
| 3d Pass me | Big Ma: *Muke [EN: scissors] de*; tap the tool among look-alikes | — | — | Cook's `passme`, real frame | Nothing new; the moment where Cook's met-word interrupt lives in this mode | — | **Keep as a moment** inside any table game, not a mini-game |

**Stage 5: Put it on (the rug by the mirror)**

| Variant | What you do | Where the challenge is | Where the fun is | Where the instruction is | What's novel | Score | Verdict |
|---|---|---|---|---|---|---|---|
| **5a The fitting** (built) | Tap a piece on the rail; it swishes onto the client; tap a worn piece to send it back; Done | Binding pairs on slots (the asked garment in 3+ colours, the asked colour on 2+ kinds), a *nar* row, a change of mind; L3 neighbouring colours and the card hidden; **5d folded in** at L3: two or three people from the piles 3a made, a group reveal | The swish and the giggle on every landing (Sago Mini); Nana's cap landing on his ear and righting itself; the client turning to the mirror | Card: one line per slot, *[EN: red kurta]*; the change of mind by voice only: *nar [EN: red], [EN: blue]* | **The mode's identity**: composing a person slot by slot from spoken pairs; no other mode puts several adjective + noun pairs onto one body | 5·5·4·5·5 = **24** | **Keep**; 5d merges in as its L3 family form |
| **5b Going out** | Tap the garments and carry items for the weather heard; Ali steps out; the weather happens | The weather set heard through the curtain (rain → umbrella, no shawl; cold → shawl, socks), plus one colour row; unasked carry items count against you at the end; L3 the child looks out and *says* the weather | The reveal: the curtain, Ali stepping into the courtyard, the rain on the umbrella or the comic soaking, the wind taking his cap | Card: Nani's face through the doorway, *[EN: it's raining]*, one colour row. Voice: the weather word once more on the throb | **Weather → clothing reasoning** lives only here; Monsoon's forecast picks a *gesture* (tarp, scoop), never an outfit | 4·4·5·4·5 = **22** | **Keep** (phase 3; the words are placeholders until G1–G14) |
| **5c Tell Ali** (speaking) | The look card shows a picture; say each pair; Ali wears what he heard | Producing a **two-word** utterance (colour, then garment: two closed sets in turn) | Ali in the wrong thing, proud of it, all the way to the mirror | The card is a picture only (no text); Nani reads it aloud in Grandparent mode | Every mode has an "Ali does what he heard" flip on `say`; this is the only one where the utterance is *two* words that must bind, and the mistake stays visible (worn) | 3·5·4·3·3 = **18** | **Keep as the shared role-reversal** (L2+; Grandparent mode) |
| 5d The family set | — | — | — | — | 5a with a `who` slot | — | **Merged** into 5a L3 (Eid morning's finale) |

**Stage 6: Mirror, photo, goodbye**

| Variant | What you do | Where the challenge is | Where the fun is | Where the instruction is | What's novel | Score | Verdict |
|---|---|---|---|---|---|---|---|
| **6a The mirror check** (built; 6b folded in) | Watch the client name each piece; on a miss, one button back to the stage that got it wrong; fix it; Done again. Then *[EN: How do I look?]* and the child answers (*Achija!*, shadowing at L1; graded from L2) | Re-hearing every word of the round against what's on the body; from L3 only the wrong pieces are named, so you must listen to *which* | The sparkle per right piece; *Arre re!* with the client holding up the wrong sleeve; the beam at *Achija!*; the sulk at *[EN: not nice]* | No card: the client's voice is the instruction, in the recast frame (*[EN: I asked for red, you gave me blue]*) | The **recast that sends you back a stage**: every other mode's check fixes in place; the pipeline's line makes the fix a return trip | 4·5·4·5·4 = **22** | **Keep**; 6b becomes its closing beat |
| **6c The photo** | Tap a person, tap a pose pill (*[EN: sit]*, *[EN: stand]*, *[EN: smile]*), tap the shutter; the snapshot drops into the lookbook | Imperatives per person (C145–C147, H20, H26); L3 two people in order plus *nar Ali* | The shutter flash, Nana blinking, Zazu jumping into frame, the print sliding into the album | Card: Big Ma with the camera, *Nana, [EN: sit]! Ali, [EN: stand]! [EN: Smile]!* | Snap *says* *Smile!* (S21) and Tidy up *places* people (17); only Dress up **poses** them by verb. It is also the only home of *sit, stand, come here* | 4·4·5·4·4 = **21** | **Keep** (L1 *smile* only, automatic photo; the pose from L2) |
| 6d Eidi and goodbye | The greeting chooser, Eidi, the feelings word | — | The elders' Eidi coins | The shell's greeting exchange | The shell's, shared by every mode | — | **Keep as the send-off**, not a mini-game |
| 6b How do I look? | — | — | — | — | A shadowing beat, not a game | — | **Merged** into 6a |

**Stages after the cut:** 1a (+1c shared) · 2a, 2c · 3a, 3b (shared), 3c (+3d as a moment) · the table (Q.4) · 5a, 5b, 5c (shared) · 6a, 6c (+6d send-off). Twelve mini-games outside the table, five of them deliberately shared mechanics, plus eight on the table: **twenty in all** where the pipeline design had thirty-eight.

### Q.4 Big Ma's table: the twenty scored, the eight kept

Every table game is **one verb** (Cooking Mama's rule) on the Q.2 convention: taps to pick and place, at most one tool gesture. The score is the five questions again; "novel" is against every mode's pipeline design, and a game whose only novelty is its prop merges into the game that owns its verb.

| # | Game | Do | Challenge | Fun | Instruction | Novel | Total | Verdict |
|---|---|---|---|---|---|---|---|---|
| T9 | **Bandhani** (absorbs T11 Dye) | 5 | 5 | 5 | 5 | 5 | **25** | **Keep**: the flagship |
| T10 | **Block print** | 5 | 4 | 5 | 5 | 4 | **23** | **Keep** |
| T5 | **Iron it** | 5 | 4 | 5 | 5 | 3 | **22** | **Keep**: the first-session game |
| T3 | **Sew on buttons** (built) | 5 | 5 | 3 | 5 | 3 | **21** | **Keep** |
| T4 | **Embroider a motif** (built; absorbs T12 Patch and T16 Mirror-work) | 4 | 5 | 4 | 4 | 4 | **21** | **Keep** |
| T15 | **Bangles** (built) | 5 | 4 | 4 | 5 | 3 | **21** | **Keep** |
| T1 | **Cut along the line** | 4 | 4 | 4 | 4 | 4 | **20** | **Keep** |
| T2+T17 | **The pedal** (T17's count driving T2's machine) | 4 | 4 | 4 | 5 | 3 | **20** | **Keep** (merged) |
| T7 | Pin the dupatta | 4 | 4 | 3 | 4 | 2 | 17 | Maybe later (press-and-hold; the prick is negative feedback; sides are the clinic's) |
| T2 | Seam it (as designed: steer + pedal) | 2 | 3 | 5 | 3 | 4 | 17 | Merged into The pedal |
| T6 | Hem it | 3 | 4 | 3 | 4 | 2 | 16 | Maybe later (T1 already honours the slate) |
| T13 | Wash the stain | 4 | 3 | 4 | 3 | 2 | 16 | Maybe later (a rub like T5; Monsoon's S4b dries with the same rub) |
| T8 | Thread the needle | 3 | 2 | 4 | 3 | 3 | 15 | Cut (a motor test) |
| T14 | Sew on the border | 4 | 3 | 3 | 3 | 2 | 15 | Maybe later (T1's swipe + T4's pick) |
| T19 | Fold it | 3 | 4 | 3 | 4 | 1 | 15 | Cut: Tidy up owns folding |
| T12 | Patch the hole | 3 | 4 | 3 | 4 | 2 | 16 | Merged into T4 (the stain is a part; the patch is a motif) |
| T16 | Mirror-work | 4 | 4 | 4 | 4 | 2 | 18 | Merged into T4 (mirrors are a motif with a count) |
| T11 | Dye the cloth | 4 | 4 | 4 | 4 | 3 | 19 | Merged into T9 (its L2–3) |
| T17 | The pedal (count only) | 4 | 3 | 3 | 5 | 2 | 17 | Merged with T2 |
| T18 | Wind the bobbin | 3 | 3 | 3 | 3 | 2 | 14 | Cut |
| T20 | Cat bows | 4 | 1 | 5 | 2 | 2 | 14 | Cut as a table game: **Simba and Zazu become one-slot clients** of 5a at level 1 (the bow is their only slot), which keeps Layla's cats without a game that teaches nothing |

**The eight, answered.** Gestures per game are fixed across levels; "card" is the request card that shrinks into the sidebar (UX §13); "voice" is Big Ma's, on the throb or as an interjection.

1. **T9 Bandhani** (tie, dip, reveal). *Do:* tap *trae* of the spots on the white dupatta (each tap pinches up a knot with a squeak), tap the dye pot named (the whole cloth dunks), tap the cloth to untie: the dots bloom. *Challenge:* the count (real) and the colour; L2 which of two pots, and the dots on a named part; L3 two pots in order (*pela [EN: yellow], ne poi [EN: blue]*) and the mix makes the third colour, so a child who dips once gets the wrong cloth. *Fun:* the reveal (Tie Dye's unfold), and a four-knot dupatta when three were asked shows up only at the mirror. *Instruction:* card *Trae [EN: dots]. [EN: Red].*; voice *trae!* on the throb. *Novel:* the only blind step then reveal in the game, and the only colour mixing; Kutch's own craft, made by the child rather than worn.
2. **T10 Block print** (stamp in a row). *Do:* tap the block named from the rack, then tap along the hem *char* times; each tap thunks and prints; the tick when done. *Challenge:* the count, the motif (*[EN: flower]* vs *[EN: leaf]*), the part (*[EN: on the hem]* vs the sleeve); Busy only: the ink dries if you dawdle. *Fun:* the thunk-thunk rhythm, the print appearing under the block, a wonky one if the tap is off the line (neat star, never a buzz). *Instruction:* card *Char [EN: flowers], [EN: on the hem]*; voice the number on the throb. *Novel:* a count *made* in a row along a garment part (Cook's count is a tally; Monsoon's drip count is "let it happen"); the one rhythmic game on the table.
3. **T5 Iron it** (pick, rub). *Do:* tap the garment named from the creased pile (it lays itself flat), rub the iron over it until the creases pop, tap the next. *Challenge:* colour + garment among five look-alikes, and from L2 the **order** (*pela [EN: red kurta], ne poi [EN: white dupatta]*: real linkers); L3 three in order with the card hidden. *Fun:* the hiss and steam, each crease popping flat with a "pff", the finished garment folding itself onto the rail (Dr. Panda Home's finished state). *Instruction:* card one line per garment; voice *pela…* on the throb. *Novel:* the only game whose decision is the *order* of physical jobs; Layla's verb (her favourite).
4. **T3 Sew on buttons** (built; place, stitch). *Do:* tap a button in the tin, tap a placket slot, swipe once round it; repeat. *Challenge:* *ba wadha [EN: buttons], [EN: red]* (count, size and colour on one row: count and size real today); L3 two rows that bind (*ba wadha [EN: red], hakro nindho [EN: white]*). *Fun:* the "pling" as each button lands, the last one making the kurta do up itself. *Instruction:* card *Ba wadha [EN: buttons]. [EN: Red].* *Novel:* three attributes on one noun where two are real Kutchi now: the mode's only real-Kutchi ear row today.
5. **T4 Embroider a motif** (built; pick, place on a part, stitch; absorbs the patch and mirror-work). *Do:* tap a motif in the tray, tap the garment part, swipe round it. *Challenge:* motif + colour + **part** (*[EN: on the left sleeve]*); the stain variant (Arc 1 Ch4): the part is where the stain is, and the motif covers it; the mirrors variant: *panj [EN: mirrors], [EN: on the pocket]* (a count on a part). *Fun:* the motif blooming in the thread colour; Big Ma's song (her only singing moment). *Instruction:* card *[EN: Two small yellow flowers], [EN: left sleeve]* (L3). *Novel:* garment parts as slots: the only "where on the garment" decision in any mode.
6. **T15 Bangles** (built; place, say). *Do:* tap bangles onto Ma's wrist; Done; at L2 Ma asks *[EN: how many?]* and the child says the number. *Challenge:* two counts of two colours on one slot (*trae [EN: red], ba [EN: gold]*), the tray holding count + 2 of each; nothing ends by itself. *Fun:* the tinkle stack, Ma jangling her wrist to check. *Instruction:* card two lines; voice the numbers on the throb. *Novel:* the first *spoken* number in the mode with a consequence (she slides on what she heard).
7. **T1 Cut along the line** (one swipe per piece). *Do:* Big Ma chalks the piece on the bolt; swipe along the dashed line; *ba* sleeves is two swipes on two lines. *Challenge:* which line (the long or the short chalk line, set by the slate from 2a), how many pieces; a wobble leaves a ragged edge (neat star). *Fun:* the snip, the piece falling away, Simba batting the offcut across the table. *Instruction:* card *[EN: Cut]: ba [EN: sleeves], wadha.* *Novel:* the only game that checks a measurement the child produced earlier; Snap's C8 "cut it straight" should reuse `cut` (a deliberate share) but has no decision.
8. **The pedal** (T2 + T17; tap the side, tap the pedal N times). *Do:* tap the side of the kurta Big Ma names (the cloth slides under the needle), tap the treadle *panj* times; each press chatters one stitch; the tick. *Challenge:* the count (real) and the side (*[EN: left]*, then *pela … ne poi* the other); over-pedalling runs the seam off the edge (seen at the end). *Fun:* the machine's chatter, the cloth jerking forward a stitch per press, Zazu's ears going up and down with it. *Instruction:* card *[EN: Left side]: panj.* *Novel:* the sewing machine (the table's best prop and sound) driven by a count; the original T2's steering is gone (two hands, and the hand decided more than the Kutchi did).

**First table set (build order, replacing P.3's):** T3, T4, T15 exist; then **T5 Iron** (the first session), **T9 Bandhani**, **T10 Block print**, **The pedal** (real numbers), **T1 Cut** (needs the slate from stage 2). Nothing else on the table is built unless Q.7 says otherwise.

### Q.5 Distinctness across modes

Read against the other five pipeline designs (`clinic`, `tidy-up`, `monsoon-rush`, `snap`, `who-did-it`).

| Dress up mini-game | Same as | Ruling |
|---|---|---|
| 1a Bring in | The clinic's W1/W2 (the bench) | **Deliberately shared**: `call` + `whichone`. Dress up's own part is that the person is the client for the whole route, and the cats on the bench |
| 1c Call them in | The clinic's W3 | **Deliberately shared** (`say`) |
| 2a Measure up | The clinic's D2 (tap the part named) | Shared `where`; the measurement carried forward is Dress up's; the size tap is its own |
| 3a The shelf | Tidy up's 1a Gather (tap the thing named into a tray) | Shared `fetch`; the *for whom* pile (two taps) is Dress up's |
| 3b The rail | The clinic's pharmacy belt; Tidy up's 2c; Who did it?'s 2b; Snap's 1c | **Deliberately shared** `belt`, tap at every level in every mode (Q.2) |
| 3d Pass me | Cook's `passme` (every mode) | Shared moment |
| 5c Tell Ali | Tidy up 1d/3d, Monsoon S3c, Snap 3d, Who 3c | **Deliberately shared** role-reversal on `say`; the two-word utterance is Dress up's |
| 6c The photo | Snap's S21 (say *Smile!*), Tidy up's 17 (place people for a photo) | Distinct: Snap produces the word, Tidy up places, Dress up poses by verb. Snap should not add a pose |
| T5 Iron's rub | Monsoon S4b Dry off, Snap 4a Rub it up (both on Cook `stir`/`knead`) | The rub input is shared; the *order* decision is Dress up's |
| T10 Block print | Monsoon S3g Rain tune (tap pots in order on the beat; a held toy) | Distinct: a count + motif + part, not a melody; if Rain tune is built it should reuse `stamp`'s rhythm |
| T1 Cut | Snap C8 Cut it straight (Cook `chop`) | Snap's has no decision; it should reuse `cut` |
| T3/T4's `stitch` | The clinic's H8 Stitches (uses Dress up's `stitch`) | Dress up owns `stitch`; the clinic's is the deliberate reuse |
| T9 Bandhani, T15 Bangles, The pedal, 3c Bolts, 5a, 5b, 6a | Nothing elsewhere | Dress up's own |

Cut for being another mode's: T19 Fold it (Tidy up's `fold`), the washing line (Monsoon, Tidy up), T20 as a game (a `wear` skin).

### Q.6 Level-1 walkthroughs (the first mini-game of each stage)

**1a Bring in Nana.** The bench by Big Ma's door, two people on it: Nana with his stick, Ali swinging his legs. The request card: Big Ma's face, *[EN: bring in] Nana*, the two chunks lighting as she says them; it shrinks to the left sidebar. Nothing moves. The child taps Nana; he pushes up on his stick, shuffles to the rug, and turns to face the room (Ali carries on swinging). The card's one line ticks. Big Ma: *Shabash* (once recorded; a nod until then). The right-hand button: **Measure**.

**2a Measure up.** Nana on the rug; the tape in Big Ma's hands; three parts pulse gently (arm, tummy, neck). Card: *[EN: arm]*. The child taps the arm: the tape zips round it with a "zzzip" and a snap, a chalk number squeaks onto the slate (unreadable on purpose), Nana holds the pose. The line ticks. Card, second line: *wadho ke nindho?*; the child taps the long mark on the slate; the chalk draws a long line. Tick. **To the rail**. (Level 1 routes skip this stage in the first three sessions: Big Ma says *[EN: I've measured him already]*.)

**3a The shelf.** The wardrobe open, three folded garments on the shelf: a white kurta, a red kurta, a white cap. One pile on the bed with Nana's slippers at its foot. Card: *Nana lai: [EN: white kurta]*. The child taps the white kurta: it unfolds in the air and lands on the pile with a flump. Tick. **To the table**.

**T5 Iron it (the first-ever table game).** The T view: the ironing cloth, Big Ma's iron ticking as it warms, the white kurta with one crease. Card: *[EN: iron]*, one line. The child taps the kurta (it lays itself flat), rubs the iron over the crease: hiss, steam, the crease pops with a "pff". The kurta folds itself and flies onto the rail; the line ticks; the tally in the corner shows one kurta. **Put it on**.

**T9 Bandhani (the flagship; from session four).** A white dupatta pegged flat, one dye pot (red) steaming beside it. Card: *Trae [EN: dots]. [EN: Red].* The child taps three spots: each pinches up into a knot with a squeak; the tally shows three knots. Tap the pot: the dupatta dunks with a glug and comes out red all over. Tap the dupatta: the knots untie and three white rings bloom on the red. The two lines tick. **Put it on** (it goes on Ma).

**5a The fitting.** Nana from the waist up, in his plain house clothes, the mirror behind him; the rail beside him holds the white kurta from the table plus a red kurta and a white cap. Card: *[EN: white kurta]*. The child taps the white kurta: it swishes onto Nana, who puffs his chest out with a small "hm". The line ticks. **To the mirror**.

**6a The mirror check, then 6c the photo.** Nana turns to the mirror; he names the kurta, a sparkle; he turns back: *[EN: How do I look?]*; the child hears *Achija!* and says it (shadowing, ungraded). Big Ma lifts the camera: *[EN: Smile]!* Nana smiles on his own; flash; the print slides into the lookbook. Then Eidi (on Eid) and *Achija!*, and the end-of-round screen: the stopwatch, four green slots, no hints, then four words.

### Q.7 Maybe later (one line each)

- **T7 Pin the dupatta**: pins tapped onto a named shoulder; only if a *pin* word and a way to show a wrong pin kindly turn up.
- **T6 Hem it**: fold to the slate's mark then stitch; if T1's use of the slate proves too little.
- **T13 Wash the stain**: soap, rub, wring; if *dirty / clean, wet / dry* (F9–F12) need a home the story wants.
- **T14 Sew on the border**: the gold trim swiped along the hem; could carry *aastethi / jaldi* (drafts) as the decision if the clinic's speed rows work.
- **T8 Thread the needle**: a steady drag; only as an ungraded toy.
- **T18 Wind the bobbin**: a stir with a named spool; only as a toy.
- **T2 Seam it (steering)**: for 11-year-olds as a hard mode of The pedal, once the tap version is proven.
- **1b as its own game**, **5d as its own game**, **6b as its own moment**: all merged; unmerge only if a level ladder needs them separate.
- **T20 Cat bows**: cut as a game; the cats are one-slot clients in 5a (level 1) instead.

### Q.8 What this changes in the pipeline design below

- **P.2**: 2a is tap at every level and absorbs 2b; 1b is 1a's L4 form; 5d is 5a's L3 form; 6b is 6a's closing beat; 3b is tap at every level (the shared `belt`). The rows are left in place and marked.
- **P.3**: the library is the eight games in Q.4; the first table set is Q.4's build order; T20's cats become 5a clients.
- **P.5**: unchanged (the first session is T5 with one crease, as before; the walkthroughs in Q.6 are its script).
- **P.6**: new mechanics fall from 11 to **8** (`queue`, `seam`, `pin`, `aim` go; `tape` is the slate's two taps inside `where`; `cut`, `iron`, `dip`, `stamp`, `pose`, `weather` stay; `pedal` is Cook's `count` with a prop). Cook's `pour` and `stir` are no longer needed here.
- **P.8**: phase 2 builds T1, T9, T10 and The pedal (not T14 or T17 alone); phase 3 drops T2, T7, T8, T11; phase 5 drops T6, T12, T13, T16, T18, T19, T20 and gains only "any Q.7 game Zafar asks for".
- **P.9**: decision 5's "two of twenty" becomes two of eight; a new decision 8 on the belt's gesture.

---

## Pipeline design, 25 Sept 2026

**Why this section.** Zafar's pipeline brief (`PIPELINE-BRIEF.md`): every mode is a **factory-like sequence of stages**, each stage a set of mini-games, stitched into one story with a beginning and an end. The deep dive below already broke Dress up into mini-games on modular mechanics; what it lacked was the **process**. This section turns Big Ma's room into a tailoring line: a client comes in, is measured, their things are fetched, made or fixed at the table, put on, checked in the mirror, photographed, and sent off. It supersedes D.1–D.6 and D.9, and sections 1, 3, 4 and 5 below, where they conflict; D.7 (the review's critiques) and D.8 (words) still stand, extended by P.7. P.8 replaces section 12 as the build brief.

### P.1 The pipeline

```
   the doorway bench      the tape          the rail, the shelf,        Big Ma's table            the rug by the mirror         the mirror and the camera
                                            the bolts
  ┌────────────────┐   ┌────────────┐   ┌──────────────────────┐   ┌─────────────────────┐   ┌──────────────────────┐   ┌─────────────────────────┐
  │ 1 WHO'S NEXT?  │ → │ 2 MEASURE  │ → │ 3 FETCH              │ → │ 4 MAKE AND FIX      │ → │ 5 PUT IT ON          │ → │ 6 MIRROR, PHOTO, BYE    │
  │ bring in Nana  │   │ arm, neck, │   │ the sliding rail,    │   │ cut, sew, buttons,  │   │ the fitting, going   │   │ the mirror check, "How  │
  │ (who's who)    │   │ long/short │   │ the wardrobe shelf,  │   │ iron, embroider…    │   │ out (weather), tell  │   │ do I look?", the photo, │
  │                │   │            │   │ bolts and spools     │   │ (the big library)   │   │ Ali                  │   │ Eidi and goodbye        │
  └────────────────┘   └────────────┘   └──────────────────────┘   └─────────────────────┘   └──────────────────────┘   └─────────────────────────┘
   carries forward →     the client        the sizes                  the basket               the finished pieces         the worn look → a snapshot
                                                                                                                             in the lookbook
```

| Stage | Where | What the child does | What the Kutchi decides | Hands over |
|---|---|---|---|---|
| **1 Who's next?** | The bench by Big Ma's door | Big Ma says who to bring in; the child taps the right person on the bench (or calls them in aloud) | Kinship and people words (*Nana, Ma, Ali, the guest, the baby, the old man*); later colour of house clothes and *first, then* | **The client**, standing on the rug |
| **2 Measure** | The client, tape in hand | Big Ma names a body part; the child lays the tape on it; then *long or short?*, *big or small?* | Body parts (shared with the clinic), *left, right*, *wadho/nindho*, long/short | **The sizes** on Big Ma's chalk slate: what the cut and the hem must match |
| **3 Fetch** | The sliding rail, the wardrobe shelf, or the bolts and spools | Grabs what was asked as it passes, or from the shelf into piles, or the fabric and thread to make it | Colour + garment pairs, *not the…*, *for whom*, counts, fabric and thread colours | **The basket**: everything the next stage works on |
| **4 Make and fix** | Big Ma's table (T view) | One to three table games from the library (P.3): cut, sew, sew on buttons, iron, embroider, patch… | Counts, sizes, colours, garment parts, sides, *first, then*, tools (*pass me*) | **The finished pieces**, which fly onto the rail |
| **5 Put it on** | The rug by the mirror | Dresses the client from the finished pieces plus the rail's decoys; the weather variant; or tells Ali what to wear | Binding pairs, *no* rows, a change of mind, the weather set | **The worn look** (`wears[]`) |
| **6 Mirror, photo, goodbye** | The mirror; Big Ma's camera | The client checks each piece; *How do I look?*; a photo with a pose or two; Eidi and goodbye | Recasts, *Achija!* / beautiful, *sit, stand, smile*, feelings words, the greeting | **A snapshot** in the lookbook, stars, pocket money |

**Rules of the line.**
- **One job per stage** (UX 5): each stage is its own screen or zone with a big right-hand button between them (*Measure* → *To the rail* → *To the table* → *Put it on* → *To the mirror*). Nothing overlaps.
- **A client's route is data.** Each client card lists which stages it runs and which variants: `{who, occasion, stages: ["who", "fetch:rail", "make:iron", "wear:fitting", "mirror"]}`. The first-ever session runs three stages; a level-3 Eid client runs all six. A stage the route skips is done by Big Ma in one line ("I've measured him already").
- **Everything carried forward is used.** What the tape says sets the cut; what the rail gave is what the table works on; what the table made is what goes on. A wrong grab at stage 3 is not corrected there (from level 2): it shows up at the mirror as the client's recast, and the child goes back one stage to fix it. That is the pipeline's version of the prompt-not-correction rule.
- **The request card** (UX 1) opens each stage with the speaker's face and the lines for that stage only, read along, then shrinks into the left sidebar. The light bulb flips it to English.
- **The table is the fun.** Stage 4 is where the big library lives, exactly as the clinic's healing games are the clinic's; the other five stages are short and carry most of the listening.

### P.2 The mini-game variants, per stage

Each variant: the mechanic, what the Kutchi instruction carries, how it gets harder, what it reuses. Mechanic tags: **new**, **Cook** (reused from Cook), **shared** (with the named mode), **built** (already in `js/dress/`).

**Stage 1: Who's next? (the bench)**

| Variant | Mechanic | What the instruction carries | Levels | Reuses |
|---|---|---|---|---|
| **1a Bring in…** (the first, easiest) | Big Ma: *[EN: bring in] Nana*; 2–5 people sit on the bench; tap the right one, who walks to the rug | A person or kinship word: *Nana, Ma, Ali (the cousin), the guest, the baby, the old lady, the little girl* | L1: two people, opposite kinds. L2: four. L3: two of a kind in different house colours: *[EN: the boy in the green]* (kinship + colour). L4: *[EN: the tall one], [EN: the one with the glasses]* (F1–F16) | **Shared** `whichone` (the clinic's waiting room, Who did it?) |
| **1b First…, then…** (quality pass: merged into 1a as its L4 form) | Two or three people are named in order; tap them in that order; each walks to a numbered spot on the rug | ***pela** {x}, ne poi {y}* (real Kutchi) + the people words | L2: two people. L3: three, one of them a *nar* (*not Ali*) | **Cook** tadka's sequence input, wrapped as `queue` (**new**, small) |
| **1c Call them in** (speaking) | The child says the name; the person who was heard stands up and comes in, the wrong one comically if wrong | Closed set: the 3–5 people on the bench | From L2, after 1a has been played at L1 | **Shared** `say` |

**Stage 2: Measure (the tape)**

| Variant | Mechanic | What the instruction carries | Levels | Reuses |
|---|---|---|---|---|
| **2a Where's the tape?** (quality pass: **tap at every level**, and 2b's size tap folded in as "Measure up") | Big Ma names a part; the child taps it; the tape zips round it by itself and a number appears on the slate | Body parts: *arm, neck, shoulder, tummy, leg* (G42–G61, the clinic's words); *left, right* | L1: the parts pulse, tap one (the clinic's "does it hurt here?" scaffold). L2: named, nothing pulses. L3: *the left arm*, then two parts in order | **Shared** `where` (the clinic's `mechanics/where.js`: a named spot on a body) |
| **2b How long?** (quality pass: merged into 2a; a **tap** on the long or the short mark, never a drag) | A chalk line on the slate: tap the long or the short mark; for caps and dupattas, big or small | *wadho / nindho* (real, he-word forms), long / short (F7–F8); the result is carried into 4's cut and hem | L1: one size word. L2: two garments with different sizes. L3: *[EN: longer than Nana's]* (H1 comparatives) | **Cook** `pour`'s stop-at-the-line input, wrapped as `tape` (**new**, small) |
| **2c Read it back** (speaking) | Big Ma, tape in hand: *[EN: long or short?]*; the child answers; she writes what she heard on the slate | Closed set 2–4: *long, short, wadho, nindho* | L2+ | **Shared** `say` |

**Stage 3: Fetch (the rail, the shelf, the bolts)**

| Variant | Mechanic | What the instruction carries | Levels | Reuses |
|---|---|---|---|---|
| **3a The wardrobe shelf** (built: G2 Lay it out) | Folded clothes on a shelf; fetch the named ones into one pile per person on the bed | Colour + garment pairs; **for whom** (*Nana lai*, real frame); *nar* | As built: L1 one person two rows; L2 two people, change of mind; L3 three people, neighbouring colours, card hidden | **Cook** `fetch`; **built** `wear` (flat), `check` |
| **3b The sliding rail** (new; the clinic's pharmacy belt; quality pass: **tap at every level**, in both modes) | Big Ma's rail runs on a loop like a dry-cleaner's: hangers glide past; the child taps the asked ones and they hop into the basket; over-grabbing costs the ear; Done stops the rail | Pairs; *not the red one*; counts (*ba dupatta*); later patterns | L1: one pair, slow rail, 6 hangers. L2: two pairs + a *nar*, 10 hangers. L3: three pairs, faster, neighbouring colours, the card hidden; Busy adds Big Ma's patience | **Shared** `belt` (the clinic's counter; the foundation builds it once) + **shared** `pick` for the decoy balance |
| **3c Bolts and spools** (old G8 Make to order) | Bolts of cloth and spools of thread on the table's shelf; pick the bolt and the spool the client asked for; they go to the cut | Fabric colour + pattern (*plain, dotted, striped, flowery*, F62–F63), thread colour, **binding** (the fabric colour is a decoy's thread colour) | L1: bolt only. L2: bolt + spool. L3: pattern + the length from 2b | **Shared** `pick`; **built** `wear` (a tray slot) |
| **3d Pass me** (Big Ma's tools) | During any table game Big Ma stops: *Muke [EN: scissors] de*; the child hands the right tool from four look-alikes | *Muke {x} de* (real frame) + needle, thread, scissors, pin, iron (F72–F77) | From L1 once F72–F77 are recorded. L2: role reversal, the child asks (closed set: the tools on the table) and Big Ma hands it over | **Cook** `passme` (built as `mechanics/passme.js`); **shared** `say` |

**Stage 4: Make and fix (Big Ma's table).** The library is P.3. The route picks **one** table game at level 1, **two** at level 2 and **three** at level 3, matched to what the basket holds: a piece from the bolts must be **cut** and **seamed** before anything else; a fetched garment gets a finishing game (iron, buttons, a motif, the hem); a stained one gets **wash** then **patch**. The order inside the stage is itself an instruction from level 2: *pela istri, ne poi button* (first the iron, then the buttons), and doing them in the wrong order costs the ear, not the neat star.

**Stage 5: Put it on (the rug by the mirror)**

| Variant | Mechanic | What the instruction carries | Levels | Reuses |
|---|---|---|---|---|
| **5a The fitting** (built: G1) | The finished pieces hang on the rail among balanced decoys; put the asked ones on the client; live check at L1, mirror check from L2; a change of mind | Colour + garment pairs, binding, *nar* rows, *[EN: not the red one, the blue one]* | As built: L1 two rows; L2 three, binding, change; L3 neighbours, card hidden, patterns | **Built** `wear` (upper), `check`, `change`; **shared** `pick` |
| **5b Going out** (G5, logic built) | Nani calls the weather through the doorway; the curtain is drawn; dress Ali for it plus carry items; he steps out and the weather happens | The weather set (G1–G14), *[EN: take the umbrella]* (F68), *[EN: keep warm]* (F69) | L1: one weather, one colour row. L2: two rows. L3: **the child** looks out and calls the weather to Ali (speaking, closed set of 4) | **New** `weather` (curtain, walk-out, needs/forbids); **shared** `say` |
| **5c Tell Ali** (G6, speaking) | The look card shows a picture; the child says each pair; Ali wears exactly what was heard, comically wrong if wrong | Two closed sets per row: the palette (4–6 colours), then the kinds on the rail (3–5) | L2+; Grandparent mode (Nani reads, marks) | **Shared** `say`; **built** `wear` |
| **5d The family set** (quality pass: merged into 5a as its L3 form) | Dress two or three people from the piles 3a made, each at the mirror in turn; a group reveal | Kinship + pairs; the rows never carry faces; line and rows shuffled separately | L3 (Eid morning, Mehndi night) | **Built** `wear`, `check` |

**Stage 6: Mirror, photo, goodbye**

| Variant | Mechanic | What the instruction carries | Levels | Reuses |
|---|---|---|---|---|
| **6a The mirror check** (built) | The client turns to the mirror and names each piece; a sparkle for right, *Arre re!* + what you put on + what they asked for from the first wrong one; the child goes back a stage and fixes it | The recast frames; every word of the round re-heard | Live at L1; at Done from L2; from L3 only the wrong ones are named | **Built** `check` |
| **6b How do I look?** (speaking; quality pass: 6a's closing beat, not a game of its own) | The client asks (F66); the child answers; the client beams or, at *[EN: not nice]*, pretends to sulk | Closed set: *Achija!* (real), beautiful (F67), good (C44), *[EN: very nice]* | L1: shadowing only, ungraded. L2+: graded for the voice star | **Shared** `say` |
| **6c The photo** | Big Ma holds up the camera: *Nana, [EN: sit]! Ali, [EN: stand]! [EN: Smile]!*; the child taps the pose on each person, then the shutter; the snapshot goes into the lookbook | Imperatives (C145–C147 *come here, sit down, look*), *[EN: smile]* (H20), *[EN: together]* (H26), *first, then* | L1: *smile* only, automatic photo. L2: one instruction per person. L3: two people, in order, plus *[EN: not Ali]* | **New** `pose` (tap a person, tap a pose pill; small) |
| **6d Eidi and goodbye** | The greeting choice as in every mode; on Eid the elders give Eidi (pocket money); the client says a feelings word | *Aabhar aanjo*, the Eid greeting and the Eidi phrase (F71), *happy / better* (G62–G72) | Always; the words rotate | **Cook** greeting chooser and receipt; the shared end-of-round screen (UX 9) |

### P.3 The big library: Big Ma's table (stage 4)

Twenty table games, the mode's equivalent of the clinic's healing games. Every one is comical or tactile first and carries Kutchi through its instruction: at the least a count, a colour, a side or a part. Scores 1–5 (build: 5 = cheap). Age fit: which of 5 / 8 / 11 it suits. "Real today" means the decision words exist in `data/cook.json` now (numbers, *wadho/nindho*, *nar*, *pela… ne poi*, *Muke {x} de*); everything else waits for Round 3.

| # | Game | One-line pitch | Kutchi it teaches | Mechanic | Age | Fun | Kutchi | Build |
|---|---|---|---|---|---|---|---|---|
| **T1** | **Cut along the line** | Big Ma chalks the piece on the bolt; snip along the dashed line with the scissors; a wobble leaves a ragged edge | *cut the sleeve* (part), *ba* sleeves (count, real), long/short from the slate | `cut` (**new**, on fill-fold's swipe input, like `stitch`) | 5 · 8 · 11 | 4 | 3 | 4 |
| **T2** | **Seam it on the machine** | Guide the cloth under the needle so the seam stays on the line while the machine chatters; tap the pedal to go | *[EN: the left side], ne poi [EN: the right]* (sides + first/then) | `seam` (**new**: steer a moving line; tolerance by level) | 8 · 11 (5 with a wide lane) | 5 | 3 | 3 |
| **T3** | **Sew on buttons** (built, G3 L1) | *Sew on ba wadha buttons, [EN: red]*: take them from the tin, place on the placket, stitch each round | Count and size (**real today**), colour | `count` (Cook) + `wear` + `stitch` (**built**) | 5 · 8 · 11 | 4 | 5 | 5 |
| **T4** | **Embroider a motif** (built, G3 L2–3) | *[EN: two small yellow flowers on the left sleeve]*: from the tray onto the named part, stitch round | Motif, colour, part, side, count, size | `pick`, `wear` (parts as slots), `stitch` (**built**) | 8 · 11 | 4 | 5 | 5 |
| **T5** | **Iron it** (old G7) | A pile of creased clothes; *[EN: iron] pela [EN: the red kurta], ne poi [EN: the white dupatta]*; pick it, rub the creases flat, next | Colour + garment, *first, then* (**real**) | `iron` (**new**, on knead's rub input) + `pick` | 5 · 8 | 5 | 4 | 5 |
| **T6** | **Hem it** | Fold the hem up to the chalk mark the tape set in stage 2, then stitch it | Long / short, *wadho / nindho* (**real**) | `fold` (Cook fill-fold) + `stitch` | 8 · 11 | 3 | 4 | 4 |
| **T7** | **Pin the dupatta** | *Ba pins, [EN: on the left shoulder]*: press and hold to push each pin in; a pin in the wrong spot pricks Big Ma ("Arre re!") | Count (**real**), sides, *shoulder* (G55) | `pin` (**new**: press-and-hold at a spot) | 5 · 8 · 11 | 3 | 4 | 4 |
| **T8** | **Thread the needle** | Hold steady and slide the thread end through the eye; the needle drifts a little; the eye is huge at level 1 | Thread colour (*[EN: the red thread]*), *Muke {x} de* (**real** frame) | `aim` (**new**: a steady drag to a small target) | 8 · 11 | 4 | 3 | 4 |
| **T9** | **Bandhani dots** | Pinch and tie *trae* dots on the white dupatta, dip it in the named dye, untie: the tie-dye reveal | Count (**real**), colour, *dotted* (F63) | `count` (Cook) + `dip` (**new**, a Cook `pour` variant) | 5 · 8 · 11 | 5 | 5 | 3 |
| **T10** | **Block print** | Stamp the carved wooden block along the hem: *char [EN: flowers], [EN: on the hem]*; the rhythm sound; ink runs out if you dawdle (Busy) | Count (**real**), motif, part | `stamp` (**new**, small: tap in a row; `count` underneath) | 5 · 8 · 11 | 4 | 5 | 4 |
| **T11** | **Dye the cloth** | White cloth into the dye pot: *[EN: make it green]*; at level 3 two pots mix (*[EN: yellow] ne [EN: blue]*) and the child must pick both | Colours; two colours make a third | `dip` (as T9) + `pick` | 5 · 8 · 11 | 4 | 5 | 4 |
| **T12** | **Patch the hole** | A hole on a named part; pick a patch from the scraps tin (colour + size), lay it over, stitch round | Colour, size (**real**), part | `pick` + `wear` + `stitch` (**built**) | 5 · 8 | 3 | 5 | 5 |
| **T13** | **Wash the stain** (The spill) | Soap on the sharbat stain on the named part and rub until it's gone; wring it out | Part, *dirty / clean, wet / dry* (F9–F12) | `iron`'s rub input (knead) | 5 · 8 | 4 | 3 | 5 |
| **T14** | **Sew on the border** | Drag the gold trim along the hem's dashed line; it puckers if you rush | Trim colour, *hem*, long | `stitch` (**built**, line variant) | 8 · 11 | 3 | 4 | 5 |
| **T15** | **Bangles** (built, G4) | *Trae [EN: red], ba [EN: gold]* onto Ma's wrist; *[EN: how many?]* and the child says it | Count (**real**), colour; the first spoken number | `count`, `wear`, `say` (**built**) | 5 · 8 | 4 | 4 | 5 |
| **T16** | **Mirror-work** | Stick *panj* little mirrors on the waistcoat's named part, then stitch each one round (a Kutch nod) | Count (**real**), part | `count` + `wear` + `stitch` (**built**) | 8 · 11 | 4 | 4 | 5 |
| **T17** | **The pedal** | Big Ma: *panj [EN: times]*; tap the treadle that many times and the machine sews that many stitches; nothing ends by itself | Numbers 1–5 (**real today**) | `count` (Cook) | 5 | 3 | 5 | 5 |
| **T18** | **Wind the bobbin** | Spin the wheel round and round with the named spool on; at level 2 *trae* turns | Thread colour, count | `stir` (Cook, circular drag) | 5 · 8 | 3 | 3 | 5 |
| **T19** | **Fold it** | Fold the finished kurta in the order said: *pela [EN: the left sleeve], ne poi [EN: the right], ne poi [EN: the bottom]* | Sides, *first, then* (**real**) | `fold` (Cook fill-fold) | 5 · 8 · 11 | 3 | 4 | 4 |
| **T20** | **Cat bows** (toy) | A bow on Simba and one on Zazu: *Simba: [EN: red]* | Colour only; never graded for the ear | `pick` + `wear` | 5 | 5 | 2 | 5 |

**First table set (build order):** T3, T4 and T15 exist; then **T5 Iron** (Layla's, cheap, real *first/then*), **T1 Cut** and **T14 Border** (the make-to-order chain, both on the swipe input), **T9 Bandhani** (the most fun and the most Kutchi per minute), **T10 Block print** and **T17 The pedal** (real numbers today). T2, T7, T8, T11 in phase 3; T6, T12, T13, T16, T18, T19, T20 as the pool grows. **T19 Fold it** is kept only if Tidy up does not build a fold of its own (Tidy up owns the wardrobe; the table only folds). **Rejected:** make-up and hair (as before), a "read the tape's number" game (numbers past five come later), the washing line (Monsoon and Tidy up own it).

### P.4 Research: what children's tailor and dress-up apps do

Section 2.1 below (Style Savvy's specific request, Dress to Impress's brief-and-reveal, Project Makeover's grateful client, Crafting Mama's stylus crafts) still holds. This pass looked at the tailor-shop genre for the **process** itself.

| App | What it does | Worth borrowing |
|---|---|---|
| **Toca Tailor** (Toca Boca) | Four characters; drag a colour or pattern swatch onto a garment and the app cuts and fits it; hems and sleeves drag longer or shorter; patterns rotate and zoom; embellishments (buttons, pockets) resize and repeat; a camera makes fabric from your surroundings; **a photo at the end** to keep or send. Reviewers: calm, no fail state, "digital scissors" | The drag-the-hem length (our 2b and T6 make it a *spoken* length); swatches as tintable pattern masks (already our plan); **the photo as the ending** (6c) |
| **Baby Panda's Fashion Dress-Up** (BabyBus) | "Different customers waiting every day"; skills named as **cutting, sewing, ironing, polishing, setting**; 54 outfits | The named skills as a **pool of table games** the customer's order draws from (P.3); one customer at a time, every day |
| **Baby Fashion Tailor Shop**, **Royal Tailor 3**, **Little Tailor: DIY Fashion**, **Fashion Tailor Game Kids** (the genre's stock line) | The same fixed line in every one: **measure the customer → choose the fabric → cut (trace the outline) → the sewing machine → press/iron → decorate (buttons, bows) → dress up**; "alter, stitch and sew" mini-games; step-by-step blocks "so kids can learn" | The line itself is our pipeline; these apps prove a five-year-old follows a six-step process happily when each step is one gesture. What they lack (any reason for the choices) is exactly what the Kutchi supplies |
| **Crafting Mama** (DS) | Sew, cut, pin, fold, paint, **embroider** as stylus mini-games, several per project; a practice mode per step | The one-verb-per-game rule for P.3; pin (T7) and embroider (T4) as their own games; the practice mode is our free-play table |
| **Dr. Panda Home** | Chores as tiny tasks (hang the laundry, mop); coins for décor | Ironing and folding as short, satisfying chores (T5, T19); nothing else |
| **My Town: Fashion Show**, **Fashion Junior** | A dress-up studio, then a **catwalk or a photo studio** with backgrounds and stickers; the picture is the reward | The photo beat (6c) with a pose instruction; backgrounds as a later lookbook upgrade, never graded |
| A dressmaking sim (search summary) | Drag the tape across the client to record measurements; set the mannequin's dials to match; lay pattern pieces until the outline turns green | The **tape on the body** (2a) and "the cut must match the slate" (T1, T6): the measurement is carried forward and checked, not decorative |

**What none of them do, and we must:** say *why* each step is done that way. In every app above the child could win blind; the fabric, the length and the decoration are taste. Our pipeline is the same line with every choice **spoken in Kutchi**, the blind-odds budget applied per stage, and a mirror that names what went wrong.

Blocked pages: `play.google.com`, `apps.apple.com`, `commonsensemedia.org`, `gamezebo.com`, `ipadkids.com`, `kevin.games` and `amazon.com` were refused by the network proxy; those rows use the search summaries (sources at the end of the document, "Pipeline research").

### P.5 Stitching: how a session runs

- **Big Ma's morning** (story and free play alike) = **three clients** through the pipeline, one after another, about 6–8 minutes: for Eid morning, Nana, then Ma, then Ali (and the family set as the finale at level 3). Each client ends on the shared end-of-round screen (UX 9: time, accuracy, hints; then the word review); the morning ends with the lookbook page of the three snapshots and the pocket money (Eidi on Eid).
- **Each client's route grows with the level.** L1: stages 1, 3, 4 (one table game), 5, 6, with 2 done by Big Ma in a line. L2: all six; two table games; a change of mind; the first speaking moments. L3: all six; three table games in a spoken order; the card hidden; the family set. L4: the client says only the occasion or the weather and everything follows.
- **The first ever session is tiny** (UX 7): **one client, Nana**, already standing on the rug (no bench), **one row** (*[EN: the white kurta]*), the **shelf** (3a, three garments), **one table game (T5 Iron, one crease)**, put it on (5a, one slot), the mirror names it, *Achija!*, the photo takes itself. About 60 seconds, five taps and one rub; the bench, the tape and the rail arrive in sessions two and three, each introduced by the ghost-finger overlay (UX 8).
- **Story homes** (unchanged from D.6, now as routes): **Arc 1 Ch4 The spill** = a guest, stages 4 (T13 wash → T12 patch, or T4 one motif) and 6 only; **the Eid eve** = 3a for three people; **Eid morning** = the full morning above; **Arc 3 Ch4's door** = 5b once, 30 seconds; Arc 2 Outfits = 3c → T1 → T14 → 5a; Arc 5 the old photo = its own route later.
- **Free play dips into single stages.** The room is the menu: tap the **bench** (stage 1 as a quick game), the **tape** (2), the **rail** (3b on a loop, "Close the rail" ends it), the **table** (any T-game at any level: the practice mode), the **mirror** (5a fittings, clients keep coming, "Close the room"). Each single-stage game has its own personal best on the end-of-round screen. The hub's one rotating daily calls a **60-second route**: one client, one row, one table game.
- **The Sceptic's win-without-Kutchi test, per stage.** The budget is per client, not per stage: the generator computes the blind odds of the whole route (stage 1's pick × stage 3's grabs × the table's counts and parts × the fitting) and adds a decoy or a row until it is ≤ 5%. Blind bot at level 1 of the first route (Nana, one pair, iron, fitting): stage 1 from 2 people (50%) × the shelf pair from 3 kinds × 3 colours (11%) × the crease count 1–3 (33%) × the fitting slot (33%) ≈ **0.6%**; the real-Kutchi slice on its own (count only) is 33%, and the bot reports it separately, as now.

### P.6 What survives from the current build

The build (`build/reports/dress-build.md`: phases 0–1, branch `claude/build-dress`) is a set of **four standalone games on one round engine**. Almost all of it carries over; what changes is the shape around it: a *route* runs stages in sequence, and each existing game becomes a stage variant.

| File | Verdict | What changes |
|---|---|---|
| `data/dress.json` | **Keep** | Add `stages` (the six, with their variants and level knobs), `routes` (per client card: which stages and variants; the story days), `table` (the T-game pool with per-game knobs: T1, T5, T9, T10, T17 first), and the words for the bench (people), the tape (parts by id from the clinic's data once it exists) and the photo (poses). `games` stays for the lab's single-game entries. Fix *bo* → *ba* and *hikdo* → *hakro/hakri* wherever the grammar notes say (they live in `data/cook.json`; Dress references by id, so nothing to edit here) |
| `js/dress/look.js` (generator) | **Keep, extend** | `Look.generate` grows a `Look.route({client, level})` that calls the existing per-game generators per stage and threads what is carried forward (the client from stage 1; sizes from 2 into the T1/T6 knobs; the basket from 3 as the fitting's answers). The blind-odds budget becomes per route (`Pick.product` over the stages), so the per-game budget check moves up one level |
| `js/dress/rack.js`, `grade.js` | **Keep** | New areas: `bench` (people), `slate` (sizes), `belt` (the rail's loop order), `pool` (the table's tin, tray and bolts already exist). `Grade.check` gains `stage` results so the mirror can say which stage to go back to |
| `js/dress/core.js` (Round, card, sidebar, Done) | **Keep, reshape** | `Dress.Round` becomes the **stage** unit; a new `Dress.Route` runs stages in order, keeps the carried state, and puts the between-stage button on the right. The card per stage is the request card (UX 1) with read-along once the chunked audio lands. The light bulb replaces "?" |
| `js/dress/doll.js` (flat, upper renderers; code overlays) | **Keep** | Add the bench (upper-body crops sitting in a row, the clinic's waiting-room framing), the tape and slate overlay, and the camera frame for 6c. The mirror mask stays. Full body is still phase 5 |
| `js/dress/games/layout.js` (G2) | **Keep** → stage variant **3a** | Its piles become the basket for stage 5d |
| `js/dress/games/fitting.js` (G1) | **Keep** → stage variant **5a** | The rail's contents come from the route's basket plus decoys, not only the generator |
| `js/dress/games/table.js` (G3) | **Keep, split** → **T3**, **T4** and the `passme` moment (3d) | The T-game runner (`Dress.Table.run(r, gameId)`) grows out of it; buttons and motifs are its first two entries |
| `js/dress/games/bangles.js` (G4) | **Keep** → **T15** | Unchanged |
| `mechanics/wear.js`, `check.js`, `change.js`, `stitch.js`, `passme.js`, `count.js` | **Keep** | `check` learns to name the stage to go back to (from L2). `stitch` gains the line variant for T14 |
| `mechanics/say.js` | **Keep until** the shared `say` lands (`js/shared/say.js` now exists: swap in phase 2) | Six speaking moments now: say how many (T15), ask Big Ma (3d), read it back (2c), call them in (1c), call the weather (5b L3), how do I look (6b), tell Ali (5c) |
| `stubs/pick.js` | **Keep until** `js/shared/whichone.js` is confirmed as the foundation's `pick` (it exists; swap in phase 2, one line in `dress.html` and one in the bot) | — |
| `js/dress/bot.js`, `build/leak_dress.mjs`, `build/test_dress.py` | **Keep, extend** | Bot strategies per stage plus the route-level rate; new strategies: "first person on the bench", "the biggest measurement", "grab everything on the rail", "any pose". The Playwright harness plays a whole route by `Dress.expect` |
| `js/dress/flow.js` | **Rewrite** | Becomes the route runner and the room-as-menu (bench, tape, rail, table, mirror as entries), Big Ma's morning, and the shared end-of-round screen (UX 9) instead of the local result card. The lab keeps game × level and gains route × level |
| `dress.html`, `css/dress.css`, `data/scenes/bigma-*.json` | **Keep** | Scene files gain the bench spots, the slate, the rail loop path and the camera anchor |
| **Goes** | The local result card in `flow.js` (replaced by the shared screen); the per-line "?" help (replaced by the light bulb); G5's "phase 3, logic only" placeholder button (5b is built in phase 3 proper) |

**Mechanics count after this design:** built and kept 7 (`wear, check, change, stitch, passme, count, say`-stub); new 11 (`queue, tape, cut, seam, iron, pin, aim, dip, stamp, pose, weather` — `pose` and `queue` are a few lines each; `weather` is the only large one); reused from Cook 5 (`fetch, count, pour, stir, fold` via fill-fold); shared 4 (`whichone`/`pick`, `where` from the clinic, `belt` from the clinic, `say`).

### P.7 Words needed (marking the Questions for Mum doc)

D.8's list stands (colours E60–E71; clothes F44–F63; dressing phrases F64–F70; sewing F72–F79; *how many / which one* A8; *for whom* B39, C50–C55; weather G1–G14, F68–F69; patterns and lengths F62–F63, F7–F8; *first, then* F41–F43). The pipeline adds:

| Priority | Words | In the Questions doc? |
|---|---|---|
| 1 | **The bench**: *bring in {x}*, *next!*, *come here* (C145); people words *the guest, the baby, the old man / lady, the little girl / boy* | **Partly**: C145 asked; the people words are in Who did it?'s list (F1–F4 describe them); *bring in* and *next* **not asked** (Round 3) |
| 2 | **The tape**: body parts *arm, neck, shoulder, tummy, leg* | **Asked**: G42–G61 (the clinic's; record once, share) |
| 3 | **The photo**: *sit down* (C146), *look* (C147), *stand up*, *smile* (H20), *together* (H26), *here's the photo* (H22) | **Asked** except *stand up* (Round 3) |
| 4 | **The table verbs**: *cut, sew, iron (verb), fold, pin, dye, print, wash, tie*; *sewing machine, dye pot, wooden block, patch, border, mirror-work, bandhani* | **Not asked** (Round 3; *sew on* was already flagged in D.8 row 10) |
| 5 | **Feelings at the send-off**: *happy, better* | **Asked**: G62–G72 |
| 6 | **Tools as a speaking set** (3d role reversal): the five tools said clearly enough to be templates | **Asked**: F72–F77 (record each twice) |
| Have | numbers (*hakro/hakri… panj*, *ba* for two), *wadho / nindho*, *nar*, *pela… ne poi*, *{x} lai*, *Muke {x} de*, *hi*, *khan*, *Achija*, *Arre re*, *Hedo*, *Aabhar aanjo* | `data/cook.json` and the grammar notes |

### P.8 Build brief (rewritten for the pipeline; phased, own files first)

**Rules throughout:** as section 12 (never invent Kutchi; levels and routes are data; one mechanic = one file; no labels on garments; the leak rules in 8.4; UK English), plus the UX principles: the request card per stage with read-along, the left sidebar, one light bulb, fixed-shape cards (the basket always shows the same number of slots for a client's route), one job per stage with a big right-hand button, level 1 tiny, the shared end-of-round screen, the onboarding kit's ghost finger for each stage's first appearance (the scripts written last, once mechanics settle: UX 10). **Phases 0–2 touch only the mode's own files** (`dress.html`, `js/dress/**`, `data/dress.json`, `data/scenes/bigma-*.json`, `css/dress.css`, `build/leak_dress.mjs`, `build/test_dress.py`).

**Shared pieces assumed from the foundation** (not designed here): the shell and one save; `whichone` (`pick`); `where` (the clinic's named-spot-on-a-body, reusable on a client); `belt` (the clinic's pharmacy counter: a loop of items gliding past a grab zone); overlay-at-anchor sprites; star sets and ear/voice rules as data; `js/shared/say.js` on `speech.js`; the onboarding kit; the end-of-round screen component. Until each lands: the existing stubs (`stubs/pick.js`, `mechanics/say.js`), a local `belt` in `js/dress/mechanics/belt.js` with the same call shape, and the local result card.

| Phase | Own files only? | What's playable | Acceptance |
|---|---|---|---|
| **0. Routes in logic** | Yes | `data/dress.json` gains `stages`, `routes`, `table`; `look.js` gains `Look.route`; `grade.js` per-stage results; `leak_dress.mjs` runs whole routes in Node with the per-stage strategies | Every strategy < 10% ear-star rate per route per level over 2,000 runs (target ≤ 5%); the real-Kutchi slice reported separately; the first-session route's odds printed |
| **1. The line, greybox** | Yes | `Dress.Route` in `core.js`; `flow.js` rewritten: Big Ma's morning (3 clients) and the room as menu; stages **1a, 3a, 3b (local belt), 4 with T3/T4/T5/T15, 5a, 6a, 6c (smile only)** at L1–3; the between-stage buttons; the request card per stage; the light bulb; the first-session route | `test_dress.py --route eid --level 1..3` at six sizes; a human plays the first-session route in ≤ 90 s with no reading; the on-screen bot matches Node within 2 points; no label, swatch or tinted row in any screenshot |
| **2. The tape, the table pool, speaking** | Yes (reads shared files if present) | Stage 2 (2a on a local `where` port or the shared one, 2b `tape`); T1 `cut`, T14, T9 `dip`, T10 `stamp`, T17; 1b `queue`; the seven speaking moments on `say` (pills first); 3d pass me in the line; swap `pick` and `say` for the shared ones when confirmed | Each new T-game in the lab at L1–3 with its own bot run; phone 915×375 usable for cut and stamp (tolerance ≥ 28 px); `say` never blocks; the voice star only on a recognised or ticked answer |
| **3. Weather, photo, story, free play** | Shell files for integration only | 5b Going out with the curtain and walk-out; 5c Tell Ali; 5d the family set; 6b and 6c at L2–3 (`pose`); T2, T7, T8, T11; the story routes (The spill, the Eid eve, Eid morning, the Ch4 door); the hub's 60-second route; the lookbook | `--days` plays Ch4, the eve and Ch5 end to end; `--morning 3` closes into the lookbook; the hedge strategy < 10%; no weather sound before Done; the daily route returns in ≤ 90 s |
| **4. Art, first run (no full body)** | Art files only | The bench (upper-body crops seated), the tape and slate, the rail loop, the table T view with the new props (scissors, machine, dye pots, block, camera), ~15 flat garments, ~14 overlays, Big Ma's demo hands | Visual QA per contact sheet; overlays within 4 px on all crops; the family's F44 list and modesty rules signed off. **After E60–E71 and F44–F63 come back** |
| **5. Full body and the rest** | Own files + art | The full-body renderer (alignment test first), the mirror walk, T6, T12, T13, T16, T18, T19, T20, the old photo route | Alignment within 4 px per base; each game its own bot run < 10% and a persona pass |

**First three tasks.** (1) Phase 0: `routes` and `Look.route` with the carried state, the route-level odds, and the Node bot's new strategies; done when the first-session route and Eid morning L1–3 print under budget. (2) Phase 1: `Dress.Route` and the rewritten `flow.js` with 1a, 3a, 3b, T5, 5a, 6a, 6c and the first-session route; done when a human plays the first session in under 90 s and the harness passes at six sizes. (3) Phase 2: `tape`, `cut`, `dip`, `stamp`, `queue` and the speaking moments; done when each has its own lab entry, bot run and phone screenshot checked by Claude.

### P.9 Decisions for Zafar (defaults in bold; only what blocks the build)

1. **Is the six-stage line right, with Measure as stage 2?** It is the genre's line and the clinic's shape, but it makes a level-2 client about two minutes. **Default: yes**; level 1 skips Measure, and free play dips into any single stage.
2. **The sliding rail (3b) is the pharmacy belt reused.** Should the foundation build `belt` once for both, or should Dress up build its own? **Default: the foundation builds it; Dress up ships 3a (the shelf) first and takes 3b when `belt` lands.**
3. **Going back a stage to fix a mistake** (from level 2 the mirror sends you to the rail or the table, one step back) versus fixing at the mirror as now. **Default: go back**; it is what makes it a line, and the return is one button.
4. **The photo (6c) with a pose instruction** overlaps Snap's verbs a little. Keep the pose, or make the photo automatic and keep only *smile*? **Default: keep the pose at level 2+**; it is the only place *sit, stand, come here* (C142–C151) get used.
5. **Bandhani (T9) and block print (T10)** are cultural nods; the earlier restraint rule said "1–2 per rack view, never costume". Are they fine as table games? **Default: yes**, two of twenty, Kutch's own crafts, made by the child rather than worn as fancy dress.
6. **The first-ever session** runs Nana → the shelf → iron → put it on → the mirror, with no bench and no tape. Agreed as the mode's whole first minute? **Default: yes.**
7. (Carried from D.9) Eid morning on the upper-body renderer; the Ch4 door cameo; the bed for the Eid eve pending F71.4; the ear star not judged on placeholder words. **Defaults unchanged.**

---

## Deep dive, 25 Sept 2026: mini-games and mechanics

**Why this section.** The review (`REVIEW-2026-09-25.md`) flagged two things: Dress up is the **biggest art risk** in the project (full-body characters exist nowhere; the art bible's people are upper body behind counters) and the only mode with **no real-Kutchi slice today** (every colour, garment, pattern and weather word is a placeholder). Zafar's 25 Sept principles ask for every mode as a set of mini-games on modular mechanics, with speaking as a core part. This section answers all three. It supersedes sections 1, 3, 4, 5 and 8 below where they conflict; D.10 lists what changed.

### D.1 Pitch and the kinds of round

**Pitch.** Big Ma's room is where the family gets ready: someone says in Kutchi what they want to wear, and you put it on them, lay it out for them, or fix it at her table; then they check it in the mirror. The mode teaches clothes and colours (S2), adjectives that bind to nouns and *for whom* (S3), and weather and *I'm cold* (S4), and it is the first mode where the child regularly **tells someone else what to wear**.

**One engine, three renderers, five kinds of round.** A look is a list of rows `{who?, slot, garment, colour?, pattern?, size?, count?, no?}` and the worn state is `wears[]`; the generator, grader and leak bot never know how a look is drawn. A **renderer** draws it: **flat-lay** (T, clothes laid on the bed or Big Ma's table: one drawing per garment, no body at all), **upper-body** (E, the existing character game crop plus overlays at anchors and tint regions, the same system Who did it? uses for its suspects), and **full-body** (E, the paper doll; **held to phase 5**). The first set runs entirely on the first two, so the mode is proved before any full-body art is drawn.

| Kind of round | Who speaks, and what the instruction carries | What the child does | Renderer |
|---|---|---|---|
| **K1 The fitting** | The client: garment + colour per slot; from L2 two pairs that bind, a *no* row, a change of mind | Picks from the rail, puts it on, presses Done; the mirror check | Upper-body (full-body later) |
| **K2 Lay it out** | Nani, the night before: garment + colour, and from L2 **for whom** | Fetches from the wardrobe onto the bed, one pile per person | Flat-lay |
| **K3 The table** | Big Ma: what to sew on and where (count, size, colour, motif, garment part) | Picks from the tin or tray, places it, stitches it | Flat-lay (T) |
| **K4 Going out** | Nani through the doorway: the weather (heard, never seen) + one colour row | Dresses for it; the walk-out reveal | Upper-body |
| **K5 Tell them** | **The child**: colour, garment, count or weather, aloud | Says it; Ali or Ma acts on what was heard | Any |

A Dress up session in free play mixes kinds the way a Cook day mixes recipes, weighted to the player's weakest words.

### D.2 The mini-game library

Scores 1–5: fun at 5, fun at 11, forces the Kutchi, distinct from other modes, build cost (5 = cheap). Mechanics are named in D.3.

| # | Mini-game | How it plays (60–120 s) | 5 | 11 | Kutchi | Distinct | Build | Mechanics | Decision |
|---|---|---|---|---|---|---|---|---|---|
| **G1** | **The fitting** (old D1 + D5) | Nana, Ma or Ali stands at the mirror from the waist up; 2–4 rows; rail of head, top, wrap and wrist pieces; Done → the mirror names each piece; a change of mind from L2 | 3 | 4 | 5 | 4 | 4 | pick, wear, check, change, passme | **First set** |
| **G2** | **Lay it out** (new; absorbs D6) | Eid eve. Nani: *[EN: Nana: the white kurta. Ali: the green cap.]* A wardrobe shelf of folded clothes; the bed has one pile per person; press Done and Nani looks over each pile | 4 | 3 | 5 | 4 | **5** | fetch, wear (flat), check | **First set**: the cheapest honest greybox, and *for whom* is S3 |
| **G3** | **Big Ma's table: mend** (old D3 + buttons) | A kurta laid flat. L1: *[EN: sew on] bo vadha [EN: buttons], [EN: red]* (count and size are **real Kutchi today**); L2: a motif on a named part; L3: sides and order | 4 | 3 | 4 | 3 | 4 | pick, count, wear (parts as slots), stitch, say | **First set**: the craft star and the first speaking moment |
| **G4** | **Bangles** (old D7) | Ma's wrist close-up; *trae [EN: red], bo [EN: gold]*; the tray holds count + 2 of each; Done. At L2 Ma asks *[EN: how many?]* and the child answers aloud | 4 | 2 | 4 | 2 | **5** | pick, count, say | **First set** (small): the one real-Kutchi speaking moment available now |
| **G5** | **Going out** (old D4) | Nani calls the weather through the doorway, the curtain is drawn; dress Ali from the waist up plus carry items; he steps out and the weather happens. L2: **the child** looks out and calls the weather to Ali | 4 | 4 | 4 | 5 | 3 | pick, wear, weather, say | **First set**, last (phase 3): the mode's S4 job |
| **G6** | **Tell Ali** (old D10) | The look card shows a picture; the child says each pair aloud; Ali wears exactly what was heard, comically wrong if wrong | 3 | 4 | 5 | 4 | 3 | say, wear | After the first set; Grandparent mode |
| **G7** | **The ironing pile** (new) | A pile of 5–6 garments in different colours; Nani: *[EN: iron the red kurta, then the white dupatta]*; pick the right one, rub the creases out, next | 5 | 2 | 4 | 3 | **5** | pick, iron | Phase 2: Layla's favourite verb gets its own game, and *first, then* (S5) |
| **G8** | **Make to order** (old D2) | Fabric bolt + trim spool + the border stitch; the piece joins the rail | 3 | 5 | 4 | 5 | 3 | pick, stitch | **Arc 2**, as the review asked |
| **G9** | **Big Ma's challenge** (old D8) | Must-haves + free choices; the lookbook | 3 | 5 | 3 | 3 | 5 | G1 knobs | Free play; the mode's 60-second hub entry |
| **G10** | **The old photo** (old D9) | Colours from Nani's words; the photo colourises | 3 | 5 | 5 | 5 | 2 | pick, wear (full) | Arc 5 |
| **G11** | **Cat bows** (old D11) | A bow on each cat | 5 | 1 | 2 | 2 | 5 | pick, wear | A free-play toy; never graded for the ear |
| — | Wash line (peg out by colour) | — | — | — | — | — | — | **Rejected**: Monsoon's M2 and Tidy up's washing sort own it |
| — | Shoe rack (which chappals) | — | — | — | — | — | — | **Rejected** for now: feet need full body, and the doorway floor is Tidy up's |
| — | Family set as a line of people (D6) | — | — | — | — | — | — | **Folded into G2**: piles on the bed carry *for whom* with no full-body line |
| — | Runway votes, make-up, sizes that show when worn | — | — | — | — | — | — | Rejected, as before |

### D.3 The mechanics

| Id | What it does (one line) | Tag |
|---|---|---|
| `pick` | The "which one?" choice: an attribute + noun picks one item among balanced decoys (asked garment in ≥3 colours, asked colour on ≥2 kinds); carries the blind-odds calculator from 8.4 | **Shared** (foundation module; Find it M3, Tidy up rows, Who did it? clues, Snap M4) |
| `wear` | Puts a picked item on a slot of the current renderer (flat pile, upper-body anchor, later full body); tap a worn item to send it back; writes `wears[]`; garment parts (pocket, sleeve, collar, hem) are slots too | **New** |
| `check` | The Done pass: the client at the mirror, or Nani over the bed, names each row and recasts from the first wrong one; the player fixes it | **New** |
| `change` | Change of mind: mid-round a row is replaced (*[EN: not the red one, the blue one]*), any row, one in four a false alarm | **New** |
| `iron` | Rub creases out of a garment in a zone (knead's rub input); scores the neat star | **New** (built on Cook's knead input) |
| `stitch` | Swipe along a dashed line round a button or motif (fill-fold's swipe input); tolerance by level | **New** (built on Cook's fill-fold input) |
| `weather` | Four heard states, curtain and doorway, the walk-out reveal, needs/forbids grading of carry items | **New** |
| `fetch` | Tap named items among decoys into a basket (here: the wardrobe shelf into the bed's piles); over-collecting graded | **Reused from Cook** |
| `count` | Tap N times, tally shown never the target, Done ends it (buttons, bangles) | **Reused from Cook** |
| `passme` | Big Ma interrupts for a met word from look-alikes (needle, thread, pin, scissors once recorded) | **Reused from Cook** |
| `say` | A speaking moment: the closed set shown as pills, `listen({choices, timeoutMs})`, the character acts, the voice star; fallback to pills or a parent's tick | **Shared** (every mode; on `js/shared/speech.js`) |

Six new, three reused, two shared. `doll.js` (the three renderers, tint, pattern masks, the mirror mask) is a renderer, not a mechanic; its upper-body case is the foundation's overlay-at-anchor system. Dress up does **not** need `data/relations.json`: garment parts and piles are slots, never relational positions.

### D.4 Speaking moments

Rules: the closed set is 3–8 words the game knows; recognition never blocks (the pills are always there); a parent or Nani can judge instead; speaking earns the **voice star**, separate from the ear star. Before `speech.js` lands, every moment runs on the pills alone.

| Moment | Where, from which level | Closed set | What the character does | Fallback |
|---|---|---|---|---|
| **Say how many** | G4 Bangles, L1 (real Kutchi today) | *hikdo, bo, trae, char, panj* | Ma asks *[EN: how many?]* with the tray in her hand; she slides on the number she heard and the tinkle plays that many times | Tap a number pill; the parent ticks |
| **Ask Big Ma for it** | G3 The table, L1 once F72–F77 are recorded | The 4–6 tools on her table: needle, thread, scissors, pin, button, iron | Big Ma hands over what she heard; the stitch can't start without the needle, so it's the natural moment | Tap the tool's pill (never the tool itself: that would be a fetch, not speech) |
| **Call the weather** | G5 Going out, L2 | The 4 weather states: raining, cold, hot, windy | The child is at the window (the curtain is open on *their* side); Ali, who can't see, dresses for what he heard and steps out; the reveal shows whether they said what they saw | Tap the weather pill |
| **Tell Ali** | G6, L2+ and Grandparent mode | Per row, two sets in turn: the palette in play (4–6 colours), then the kinds on the rail (3–5 garments) | Ali puts on exactly that; a wrong pair is worn anyway, comically, and the card shows the gap | Pills, or Nani reads the card aloud and marks it |
| "How do I look?" → *Achija!* | G1 mirror, any level | Not a decision: shadowing only (speaking stage 1) | The client beams | Ungraded; no star |

### D.5 The first set and the level ladder

**First set, in build order: G2 Lay it out → G1 The fitting → G3 The table (mend) → G4 Bangles → G5 Going out.** Why: G2 is the cheapest possible proof of the engine (Cook's `fetch` on a flat-lay, no body, no alignment) and carries *for whom*; G1 is the mode's identity and Eid morning's home, on the upper-body crop the game already has; G3 gives the craft star, the first speaking moment and the only rows that are real Kutchi today; G4 is small, real Kutchi, and the first spoken number; G5 is the S4 job and the unique part, last because it needs the courtyard strip and the rain layer. **Held back:** G7 (phase 2, cheap), G6 (needs `speech.js` and more met colours), G9 (free play after G1), G8 (Arc 2), G10, G11.

**Blind-bot estimate for level 1** (the strongest prior per row; counts never end by themselves; unasked slots ungraded): G2 two rows from a shelf of 8 with the asked kind in 3 colours ≈ **0.7%**; G1 two rows, 3 kinds × 4 colours per slot, first miss costs the row ≈ **0.7%**; G3 one button row (count 1–3 × 2 sizes × 4 colours) plus Big Ma's pass me from 3 ≈ **1.4%** (count and size alone, the real-Kutchi part, is 17%: the bot reports it separately); G4 two rows of count × colour ≈ **0.5%**; G5 one of 4 weather sets × one colour row ≈ **2%**. All under the 5% budget; the generator still adds a row or decoy when a round comes out above it.

**The ladder: what the instruction carries.**

| Level | Name | What one instruction holds | Also |
|---|---|---|---|
| **1** | *One thing* | **One pair**: colour + garment (*[EN: the red kurta]*); or count + size (*bo vadha [EN: buttons]*) | Checked live, piece by piece; focal colours only; stage-1 words twinkle (taught, not tested) |
| **2** | *Two things that bind* | **Two pairs whose colours swap between rounds** (*the red cap, the green kurta*), a *nar* row, **for whom**, a change of mind | Checked at Done (the mirror or Nani over the bed); the first speaking moments |
| **3** | *Three slots* | **Three attributes on one noun** (*[EN: two small yellow flowers on the left sleeve]*), patterns, neighbouring colours (pink beside red), *first, then* in the ironing pile | The card hides after the intro; Busy with the mosque clock |
| **4** (Arc 5) | *Their own words* | The client says the occasion or the weather and everything follows; past tense in the old photo | — |

### D.6 Story home and free play

| Mini-game | Story home | Notes |
|---|---|---|
| G2 Lay it out | **Arc 1 Ch5 Eid morning, the eve** (a new opening beat: Nani lays out tomorrow's clothes with you) | Whether the family really lays clothes out the night before is a question for the visit (D.9, decision 3) |
| G1 The fitting | **Arc 1 Ch5 Eid morning**: Nana, Ma, Ali at the mirror from the waist up, then the elders and Eidi | Ships on the upper-body renderer; the full-body mirror walk is a later upgrade to the same day file |
| G3 The table | **Arc 1 Ch4 The spill**: one motif on the pocket over the stain (minimal, as the review asked); buttons in free play from day one | Big Ma sings only here |
| G4 Bangles | Arc 2 Ch2 Outfits; a free-play toy before that | After the bangles are bought in Find it |
| G5 Going out | **A cameo at the door of Arc 3 Ch4**: *[EN: It's raining, take the umbrella]* (F68) before the walk to the clinic: one weather set, one row, 30 seconds. The clinic owns the chapter and all blankets; Dress up's "wrap Nani up" is **withdrawn** | Its full home is free play and the hub daily; Ch1 is Monsoon's |
| G8, G10 | Arc 2 Outfits and The gift; Arc 5 The old trunk | Unchanged |

**Free play (one entry).** The world is the menu: Big Ma's room on the map runs **Fittings** (clients keep coming, kinds mixed, weakest words first, "Close the room" ends it). The hub's one rotating daily calls Dress up's **60-second round**: one G9 brief (two must-haves) or one G2 pile. The six-dailies problem is the hub's, not this mode's.

### D.7 The review's critiques

| Critique | What I did |
|---|---|
| No real-Kutchi slice at all | Made G3's level-1 rows count + size (*bo vadha*, *nar*), which exist as drafts, and G4's first speaking moment the numbers. Honest limit: that is the mode's only real slice until E60–E71 and F45–F63 come back; the bot reports placeholder decisions separately and the ear star isn't judged until then |
| Full-body characters exist nowhere; ~125 images; alignment risk | **The first set never needs a full body.** Flat-lay garments are one drawing each with no base; the upper-body doll is the existing game crop plus the foundation's overlay-at-anchor system (shared with Who did it?) and tint regions. Full body is phase 5. First-set art drops from ~125 to about 55 images (D.8) |
| D1's decision is Find it M3 without the search | Agreed: the pick is the shared `pick` module. Dress up's own contribution is binding, *for whom*, garment parts as slots, the finishing, and speaking |
| Blind-odds budget belongs in the shared engine | Handed to the foundation's which-one module (`pick`); Dress up's generator calls it |
| Build overlay-at-anchor once with Who did it? | Adopted: the upper-body renderer *is* that system; the garment overlays (cap, scarf, dupatta, shawl, bangles, umbrella) use its anchors |
| Cut D2 from the first set; keep D3 minimal in Ch4 | Adopted: G8 is Arc 2; Ch4 is one motif on one part |
| Weather off Ch1; the Ch4 "wrap her up" clashes with the clinic's blankets | Both dropped. Going out has a 30-second cameo at Ch4's door (the umbrella for the walk) and lives in free play otherwise |
| Six dailies | One hub daily; Dress up exposes a 60-second round only |
| Decision 15 (*topi*/*kofia*, what the family wears) blocks all art | Still true for art; it no longer blocks the mode. Garments are data, the greybox draws grey shapes with colour tints, and the roster is whatever F44 says |
| Decision 14 defaults (weather heard only / dress the player / persistent outfits) | Yes / later (the Ch4 cameo dresses the player from the waist up, ungraded until then) / no |
| Decision 13 (free choices ungraded) | Yes |
| "What does the first story errand cost in art?" | Ch4: one new T view of the sewing table (Big Ma's E room already exists) + one flat kurta + a motif tray ≈ 10 images. Ch5: three upper-body clients (exist in `assets/cook/characters/`) + ~14 overlays + the bed flat-lay and ~15 flat garments ≈ 45 images. Nothing full-body |

### D.8 Words needed (first set, in priority order)

| Priority | Words | In the Questions doc? |
|---|---|---|
| 1 | **Colours**: red, green, white, blue, yellow, black (focal, L1), then pink, orange, purple, gold, silver (neighbours, gold for bangles) | **Asked**: E60–E71 |
| 2 | **Clothes** the family really wears at Eid, and what a prayer cap is called: kurta, kurti, cap, headscarf, dupatta, shawl, cardigan, T-shirt, socks, bangles, umbrella, raincoat | **Asked**: F44, F45–F63 |
| 3 | **Dressing phrases**: put on, take it off, wear the red one, how do I look, beautiful | **Asked**: F64–F67, F70 |
| 4 | **Sewing**: needle, thread, scissors, pin, button, iron; pocket, sleeve, collar; a stain | **Asked**: F72–F79 |
| 5 | **How many? · Which one?** (Ma's question in G4; Big Ma's in G3) | **Asked**: A8.6, A8.7 |
| 6 | **For whom**: *for Nana*, *Nana's*, *Ma's* (G2 piles) | **Asked**: B39, C50–C55 |
| 7 | **Weather and feelings**: it's raining, it's cold, it's hot, it's windy, I'm cold, keep warm, take the umbrella | **Asked**: G7–G13, F68, F69 |
| 8 | **Patterns and lengths**: plain, dotted, striped, flowery; long, short | **Asked**: F62, F63, F7, F8 |
| 9 | **first, then, now** (the ironing pile) | **Asked**: F41–F43 |
| 10 | **Motifs**: flower, leaf, star, moon; **left, right** (sleeve); **sew on**; **change of mind** frame *not the red one, the blue one* | **Not asked** (new; add to Round 3) |
| Have | *hikdo … panj*, *vadho/nindho* (drafts), *nar* (draft), *Muke {x} khape*, *Ne {x}*, *Muke hikdo {x} dine*, *Ghan*, *Achija*, *Arre re*, *Hedo* | In `data/cook.json` |

### D.9 Decisions for Zafar (only what blocks the build)

1. **Ship Eid morning on the upper-body renderer** (the family at the mirror from the waist up; trousers and shoes never asked for until full body exists)? **Default: yes.**
2. **Going out's story home** is a 30-second cameo at the door of Arc 3 Ch4 (the umbrella for the walk to the clinic), nothing else in Arc 3? **Default: yes.**
3. **Lay it out** assumes the family lays Eid clothes out the night before. If they don't, G2 becomes "the wardrobe" (fetch to a basket for each person) with no bed. **Default: build it as the bed; ask at the visit.**
4. **Buttons and bangles count for the ear star now** on their real slots (count, size) while the colour slot is a placeholder? **Default: no** (the ear is grey until colours exist; the voice star for numbers counts from day one).

### D.10 What changed below

| Section | Change |
|---|---|
| 1, 9.1 | Cameras: flat-lay T and upper-body E first; full body later (patched) |
| 3, 4 | D1→G1, D3+D7→G3/G4, D4→G5, D6 folded into G2, D2→G8 (Arc 2); G2 and G7 added; the first set is D.5 |
| 5.1 | Eid-eve beat added; the Arc 3 Ch1 and Ch4 "wrap her up" rows withdrawn; the Ch4 door cameo added |
| 6.5, 8, 9 | Role reversal is `say` and G6; `doll.js` has three renderers; no relations; blind odds move to the shared `pick`; art phased, full body last |
| 12 | Rewritten |

---

## 1. Pitch and core loop

**Pitch.** Big Ma, the family's seamstress, runs the fittings in her room. Family members and guests come in and say, in Kutchi, how they want to look: *"Muke [EN: red] [EN: kurta] khape. Ne [EN: white] [EN: cap]."* You dress them from Big Ma's rail, shelf and shoe rack, finish the look with her tools (iron out a crease, stitch a border, pin a dupatta), then they turn to the mirror and check it piece by piece. The mode exists because **S2 needs clothes nouns and colours, S3 needs adjectives that bind to nouns, and S4 needs weather and "I'm cold"**, and "dress someone exactly as they ask" is the one game where the player has to hold several adjective + noun pairs together and put each on the right part of the right person. The fun is *Style Savvy*'s customer who wants something particular, *Dress to Impress*'s ticking wardrobe and reveal, and *Crafting Mama*'s tactile sewing, with the language as the only way to know what's wanted.

**The loop (one fitting, 60–120 s).**
1. The client arrives; a greeting choice (as in every mode; *Salamun alaykum*, or the Eid greeting on Eid).
2. **Intro card:** the client's face, then one line per piece (speaker · word or •••). It shrinks into the sidebar. **Three seconds of silence** before anyone speaks again.
3. **Dress:** tap a piece on the rail, shelf or rack; it swishes onto the client. Tap a worn piece to send it back. Every slot starts in the client's plain house clothes, so nothing looks "missing".
4. **Finish:** one short hands-only task at Big Ma's table (iron, stitch, pin, button). Big Ma hums her song here, and only here.
5. **Done → the mirror:** the client turns to the mirror and names each piece as they check it. Right: a sparkle and a nod. Wrong: *Arre re!* + what you put on + what they asked for; **you fix it yourself** (a prompt, not a correction).
6. Stars, pocket money, a snapshot into **Big Ma's lookbook**, and an end-of-round **word review** (Kutchi → English).

**How it differs from Cook and Find it.**

| | Cook with Nani | Find it | **Dress up** |
|---|---|---|---|
| Core verb | **Build**: gestures in sequence over time | **Search**: scan, then tap the one meant | **Style**: compose a whole look on a person, slot by slot, then finish it by hand |
| Camera | T, straight down on a worktop | E, into a cluttered room | **T flat-lay** (the bed, Big Ma's table) and **E upper body** at the mirror first; E full body later (deep dive D.1) |
| What the Kutchi decides | What, how many, what order, for whom | Which one and where in a scene | **Which garment, in which colour or pattern, on which person, for which weather**: several adjective + noun pairs that must each land on the right slot (binding) |
| The satisfaction | Juice, timing, memory | "Found it!" | The transformation and the mirror reveal; making something with Big Ma |
| Syllabus weight | S1, S2 verbs, S5 first/then | S1, S2 positions and colours | **S2 clothes and colours, S3 adjectives, possessives and kinship, S4 weather and feelings** |

**What it does *not* do** (other modes' verbs): finding a lost cap in a room is Find it; folding clothes into the wardrobe and mehndi patterns are Tidy up; "who's the man in the red cap?" is Who did it?; photographing is Snap.

---

## 2. Research summary

### 2.1 Proven hits: what we borrow and why

| Reference | Concrete mechanic | Why it works | What we take / leave |
|---|---|---|---|
| ***Dress to Impress*** (Roblox, 6bn+ visits) | One theme for the whole server, shown in a **banner for the whole round**, with a visible timer (about 6 minutes) in a dressing room; then a **runway** walk; others rate 1–5 stars; stars and cash for placing. Items take **colour wheels, patterns and toggles**; guides say "read the theme, commit to a small palette, one fitting prop" | A clear brief + time pressure + a public reveal. Customising a piece (colour, pattern) makes it yours. Fast rounds, huge wardrobe | **Take:** the brief that stays on screen (our order card), the visible timer in Busy, the reveal (the mirror), tintable garments with pattern options. **Leave:** player voting (multiplayer, subjective, a privacy problem for children) and the paid VIP room |
| ***Project Makeover*** | A client with a problem; a fixed plan (hair, outfit, room); **three options per item**; a before/after **reveal**; the client writes a thank-you letter later | Low decision load (3 choices), an emotional payoff, a character you helped | **Take:** the reveal and the grateful client (they wear it in the hub later, section 7.4). **Leave:** match-3 to earn the clothes (the language would be bolted on), and 3 options (too easy to guess; we use 8+ per slot) |
| ***Style Savvy*** (Nintendo) | Customers ask for **something specific** ("a plaid skirt", "a cardigan to keep warm", "an outfit to go with this hat"); you pick from your own stock and present it; they buy if they like it, and some come back with more | The request *is* the puzzle; you learn customers; the stock is your toolbox | **The closest fit.** Our client's spoken request is the brief; the rail is the stock; "to keep warm" becomes our weather rounds. Budgets and prices wait for Arc 2's money (and belong to shopping) |
| ***Covet Fashion*** | Themed challenges with **hard requirements** ("wear red lipstick, two pieces of silver jewellery") plus free styling; community votes | Requirements give a fair, checkable core; free choices give ownership | **Must-haves + free choices** (D8): the spoken must-haves are graded; everything unspoken is the player's own, never graded |
| ***Love Nikki / Shining Nikki*** | Each stage asks for **attributes and tags** (lively, warm, "pyjamas"); items carry tags; scoring weights them; some tags are essential | Styling becomes a readable, scoreable puzzle | Our grader scores **tags said in Kutchi** (colour, pattern, length, warm/cool for weather), never taste |
| ***Toca Hair Salon 4*** | No fail state; you can regrow hair you cut too far; everything reacts | Safe for a 5-year-old to experiment | Warm failure; everything can be undone; Explore mode (tap to hear, no grading) |
| ***Crafting Mama*** (DS, Metacritic 75) | A project split into stylus mini-games: **sew, cut, pin, fold, paint**; a practice mode per step | Each craft step is a small tactile verb, like Cooking Mama | Big Ma's **finishing tasks** and the sewing table (D2, D3). This is where the craft star comes from |
| *ABCya Dress for the Weather* and preschool weather games | Look at the weather, choose clothes | Weather → clothing is a classic early-years pairing | **Leave the "look at the weather" part:** the picture would answer it. Our weather is *heard*, and the window stays curtained until the reveal (D4) |

### 2.2 Language-learning evidence

| Evidence | Finding | Design consequence |
|---|---|---|
| Total Physical Response (Asher; Liu et al. 2024) and clothes TPR classroom games ("race to dress a team member in what the teacher calls") | Acting on commands builds comprehension before speech; clothes are the classic TPR set | Every row is a command you act on; rows recombine known nouns and colours into new looks each round |
| **Colour words are "slow-mapped"** (Wagner, Dobkins and Barner 2013; Frontiers 2025, Japanese children) | Children produce colour words around 2–3 but take years to settle the **boundaries** between them | Level 1 uses well-separated focal colours (red, blue, yellow, green, white, black); neighbours (red/pink/orange, blue/purple) come later as a difficulty knob |
| **Adjectives are learned against a contrast within one kind** (Klibanoff and Waxman 2000); "adjectives really do modify nouns" (Mintz and Gleitman 2002); review: Syrett 2024 | 3-year-olds extend a new adjective only within the same basic-level kind; naming the noun with the adjective helps | The rack always shows **the asked garment in 3+ colours** (contrast within a kind), and a row always says the noun with its adjective |
| Retrieval practice (Fritz et al. 2007; Leonard et al. 2024), as in Find it | Spaced retrieval beats massed practice | Rows = due words + up to 3 new ones; Big Ma's "pass me"; the mirror check re-hears every word |
| Corrective feedback (Lyster and Saito 2010) | Prompts beat recasts | Recast at the mirror, then the player fixes it; the game never swaps the piece for you |
| Barrier games (ASHA) | Describer and doer share a goal | Role reversal: you tell Ali what to wear (D10) |
| NN/g touch targets for children | About 2 cm targets | Garments are big targets (a kurta on a hanger is about 180 px); caps and bangles sit in trays with padded hit areas |

**Blocked pages:** `stylesavvy.fandom.com` and `bluestacks.com` were blocked by the network proxy; those rows use the search summaries.

---

## 3. Mechanic library

Scores 1–5. Reasons are one line. "Forces Kutchi" names the decision, the leak risks and the fix.

| # | Mechanic | How it plays | Fun | Forces Kutchi | Distinct | Plot | Replay |
|---|---|---|---|---|---|---|---|
| **D1** | **The fitting** (dress them as they ask) | The core loop in section 1. Rows are `{slot, garment, colour?, pattern?, length?}` | **4** Transformation, swish, mirror reveal, a grateful client (*Style Savvy*, DTI) | **5** *Which garment in which colour on which slot.* Leaks: base clothes already matching; rack holding only the asked colours; the client's "signature" colour; the Eid default (cap for Nana); fixed head-to-toe row order; reacting to each piece before Done. Fixes: base never matches a request; colours balanced across the rack; no colour tastes in graded rows; the asked garment always in 3+ colours and the asked colour on 2+ garment types; rows shuffled; blind-odds budget of 5% per round (section 8.4) | **4** No other mode composes a person; binding colours to garments is unique | **5** Arc 1 Ch4 (dress the guest), **Ch5 Eid morning**, Arc 2 Outfits and Mehndi night, Arc 3 | **4** Endless combinations; new clients and occasions; wardrobe sets; twists D5 and D7 |
| **D2** | **Big Ma's sewing table** (make it to order) | T close-up. A client orders a piece to be made: *"[EN: green] [EN: kurta], [EN: gold] [EN: border]"*. Pick the fabric bolt, pick the trim spool, stitch the border along the dashed line, press Done; the new piece joins the rail for the next fitting | **5** Making, not just choosing; tactile stitch; Big Ma sings; the piece you made gets worn (*Crafting Mama*, Covet) | **4** *Fabric colour vs trim colour* (binding: the fabric colour is the trim colour of a decoy). Leaks: the thread already on the table in the answer colour; only one bolt of the colour. Fixes: 5–6 bolts and 5–6 spools, colours balanced; nothing preselected | **5** The only mode where you make a thing to a spoken spec | **4** Arc 2 Outfits (wedding clothes), The gift (quilt patch). Arc 1 Ch4 as "mend" (D3) | **4** Patterns (dots, stripes, flowers) and lengths at higher levels; offcuts collect into the quilt patch (section 7) |
| **D3** | **Mend and decorate** | The guest's stained kurta is laid flat on the table. They ask for a motif on a named part: *"[EN: yellow] [EN: flower], [EN: pocket]"*; *"[EN: green] [EN: leaf], [EN: sleeve]"*. Tap the motif tray, tap the part; stitch round it | **4** Rescuing a ruined kurta; Kutch embroidery as a nod, not a costume | **4** *Which motif, which colour, which garment part* (sleeve, pocket, collar, hem). Leaks: the stain shows one spot (fine: only one of 2–3 rows sits there); motifs in exactly the asked colours. Fixes: 2–3 rows, tray of 6+ motifs balanced; left/right only from level 3 | **3** Placement is close to Tidy up's verb; kept to *garment-part nouns*, never relational positions (on, under, next to stay with Tidy up and Find it) | **5** **Arc 1 Ch4 "The spill"**: Big Ma fixes the kurta | **3** Few story uses; a free-play variant ("decorate a dupatta") |
| **D4** | **Dress for the weather** | Someone is going out. **Nani calls the weather through the doorway** (*"Hedo! [EN: it's raining]"*); the window is curtained. Dress them; carry items (umbrella, shawl) are graded both ways. The reveal: they step into the courtyard and the weather happens (rain on the umbrella, or a comic soaking) | **4** The funny soaking and the rain reveal; a reason behind each choice | **4** *Which weather set*: rain → umbrella, chappals, no shawl; cold → shawl or cardigan, socks; hot → no shawl, a cap. Leaks: a window or rain sound; someone arriving wet; always adding every carry item. Fixes: curtain drawn, no weather sound before Done, nobody comes in from outside; unasked-for carry items cost the ear star; weather from 4 states; plus 1–2 colour rows to meet the 5% budget | **4** Weather → clothing reasoning belongs only here | **4** **Arc 3**: Clouds coming, Nani has a cold (*"[EN: I'm cold]"*), the doctor says "keep warm" | **4** Weather × client × occasion; "it stopped raining" (S5) later |
| **D5** | **Change of mind** (twist) | Mid-fitting, the client says *"[EN: not the red one], [EN: the blue one]"* or *"Ne [EN: shawl]"* | **4** Surprise and a little comedy (Cook's "now dungri!") | **4** *Re-listening:* which piece to swap. Leaks: always targeting the last piece placed; always a real change. Fixes: targets any row; one in four is a false alarm (*"[EN: the red one]"*, keep it) | **3** A twist on D1, not a mechanic of its own | **3** Ali can't decide (a running gag) | **4** Cheap variety on every fitting from level 2 |
| **D6** | **Family set** (who wears what) | Nani asks for 2–3 people at once: *"[EN: Nana]: [EN: white] [EN: kurta]; [EN: Ali]: [EN: green] [EN: kofia]"*. They stand in a line; you dress each | **3** More to juggle; a satisfying group reveal | **5** *Kinship word → person, then colour → garment* (S3). Leaks: faces on the rows (as the Chai tray showed); line order = row order. Fixes: rows carry no faces; the line and the rows are shuffled separately | **3** Kinship is also Who did it?'s, but here it's dressing, not identifying | **4** Arc 2 Mehndi night, Arc 5 The family photo (dress first, then Tidy up arranges) | **3** People × colours; the family photo finale |
| **D7** | **Bangles** (count + colour) | A wrist close-up; a tray of bangles. *"[EN: red] [EN: bangles], trae; [EN: gold], bo"*. Tap onto the wrist; Done | **3** Tinkling sound, stacking | **4** *Count per colour.* Leaks: tray holding exactly the count; ending by itself; counting aloud. Fixes: tray holds count + 1–3 of each; Done only; silent counting from number stage 3 | **2** Counting is Cook's too; kept as a slot type inside D1 from Arc 2 | **3** Arc 2 Outfits (after buying bangles in Find it) | **3** Counts × colours |
| **D8** | **Theme challenge** (must-haves + free choices) | Big Ma's brief: an occasion and 2–3 spoken must-haves; every other slot is free. The look goes into the lookbook. Also the **daily challenge** | **5** Ownership (Maryam), a daily ritual (Farah), Covet's structure | **3** *Only the must-haves* are graded. Leaks: none new (same rules as D1), but less Kutchi per minute | **3** D1 with freedom; its own purpose is expression | **2** Free play; the Eid party lookbook page | **5** Daily; collection; free choices make every look different |
| **D9** | **The old photo** | From Nani's trunk, a faded black-and-white photo of young Nani. She says what she wore: *"[EN: my dupatta was red]"*. Recreate it from the trunk; the photo **colourises** as the reveal | **4** Heritage and emotion; a lovely reveal | **5** *Colours only from Nani's words:* shapes are in the photo, colours aren't. Leak: grey tones giving away light vs dark colours. Fix: the photo shader flattens each garment's tone to one grey; trunk colours offered in equal-luminance sets | **5** Unique: memory, past tense, the family's history | **5** **Arc 5 Ch1 "The old trunk"**; Arc 2 (Big Ma's own wedding photo) | **2** A handful of photos; each one a keepsake |
| **D10** | **Tell Ali** (role reversal) | You see the target look as a picture card (the goal); you build the instruction from audio chunks (colour + garment); Ali puts on exactly what you said, comically wrong if you're wrong | **4** Being the expert; Ali's silly outfits | **5** *Production:* choosing the chunks needs the meaning. Leak: icons on chunks. Fix: audio-only chunks; text only for readers at stage 3+ | **4** The only production-first styling | **3** Ali from Arc 1 onwards; Grandparent mode (Nani says it aloud and marks it) | **3** Any D1 round flipped |
| **D11** | **Simba and Zazu's Eid bows** (toy) | Nani asks for a bow on each cat: *"[EN: Simba]: [EN: red] [EN: bow]"* | **4** Cats in bows: Layla's favourite | **2** Only colour decides; the names are proper nouns. Size ("the big bow") is dropped: it would look wrong when worn, so the picture answers it | **2** A D1 skin | **2** Eid morning, a 20-second breather | **3** A free-play toy |

**Rejected, or belongs to another mode:**
- **Runway voting** (DTI) and any taste judging: subjective, multiplayer, and can't be graded by Kutchi.
- **Make-up and hairstyles** (Project Makeover): not this family's register for children; women's headscarves stay on.
- **Sizes that show when worn** ("the big cap"): the body shows the answer. Size words are used only where both sizes look right when worn: a long or short dupatta, big or small dots.
- **Folding clothes away** belongs to Tidy up. **Finding the cousin's cap** belongs to Find it. **"Who is wearing red?"** belongs to Who did it?. **The lookbook snapshot** is a reward, not the Snap mechanic.
- **Budgets and prices** (*Style Savvy*): money belongs to the Arc 2 bazaar.

---

## 4. Recommended first set

**One engine: a look is data.** A row is `{who?, slot, garment, colour?, pattern?, length?, count?, no?}`, like a Cook recipe slot or a Find it row. D1, D4, D5, D6, D7 and D8 are all row types or knobs on the same fitting station. D2 and D3 share the sewing-table station.

| Order | Mechanic | Why first |
|---|---|---|
| 1 | **D1 The fitting** with **D5 Change of mind** as its level-2 twist | The core, and Arc 1 Ch5 "Eid morning". It builds the paper-doll renderer, the rack builder, the grader and the leak bot that everything else needs. D5 is a few lines on top |
| 2 | **D3 Mend and decorate**, then **D2 Make to order** | "The spill" (Arc 1 Ch4) opens Big Ma's room, so the sewing table is needed in Arc 1. It also gives the mode its craft star (stitching), and Big Ma her song moment. D2 reuses the same table in Arc 2 |
| 3 | **D4 Dress for the weather** | The mode's S4 job and the "monsoon day" story use. It's D1 plus weather rows, the doorway line and a rain layer |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| D8 Theme challenge and daily | Straight after the first set, in free play | Cheap once D1 exists; needs the lookbook |
| D6 Family set | Arc 2 | Needs kinship words (Round 1 Q10) and more full-body characters |
| D7 Bangles | Arc 2, as a D1 slot type | Arc 2 content; a wrist close-up |
| D10 Tell Ali | When produce stages exist; Grandparent mode | Production, not listening |
| D9 The old photo | Arc 5 | Past tense (S5) and the trunk art |
| D11 Cat bows | As a free-play toy, any time after D1 | Weak Kutchi; nice for Layla |

---

## 5. Story integration

### 5.1 Where the mode appears

| Arc · chapter | Beat | Dress up errand | Language |
|---|---|---|---|
| **Arc 1 Ch4 "The spill"** | Sharbat spills on a guest's kurta → Big Ma's room opens → she mends it and sings | After Find it's sewing box (the red thread): **D3** decorate the stain (a flower on the pocket), then **D1 level 1**: dress the guest in the mended kurta and a dupatta she names | Clothes nouns, garment parts, colours (S2) |
| **Arc 1 Ch5 "Eid morning"** | You wake up (hand pose E6, stretch); the family must be ready for the mosque | **D1 "Get ready"**: Nana, Ma, Ali, then you in the mirror. Busy option: the mosque clock on the wall. D11 cat bows as a breather. Then the Eid greetings with Big Ma among the elders, and **Eidi** as pocket money | Clothes, colours, the Eid greeting; respect language |
| Arc 2 Ch2 "Outfits" | Everyone needs something | **D2** Big Ma makes wedding clothes to order; **D7** bangles in D1 | Colours, patterns, counts (S3) |
| Arc 2 Ch3 "Mehndi night" | Evening grade | **D6** "the girls in yellow, the boys in green" (colours per the family's own custom, to confirm) | Kinship, possessives (S3) |
| Arc 2 Ch4 "The gift" | The thread quest | **D2** finale: Big Ma and you stitch the patch from the relatives' colours | Colours, kinship |
| **Arc 3 Ch1 "Clouds coming"** | The washing is out; Nani calls from the doorway | **D4**: dress Ali to bring the washing in | Weather (S4) |
| **Arc 3 Ch4 "Nani has a cold"** | The doctor says to keep her warm | **D4 variant**: Nani says *"[EN: I'm cold]"*; wrap her up (shawl, socks) | Feelings, "I'm cold" (S4) |
| Arc 4 | — | No story errand (the ring mystery is Find it and Who did it?). Free play continues | — |
| **Arc 5 Ch1 "The old trunk"** | Old photos | **D9** recreate young Nani's outfit; the photo colourises | Past tense "was" (S5), describing (S6) |
| Arc 5 Ch5 "The family photo" | Arrange everyone | **D6** dress everyone first, then Tidy up arranges them | Kinship recap |

The Roadmap rule "consecutive errands never repeat the main action" holds: in each chapter above, the errand before is a different mode (Find it, Ask around or Tidy up).

### 5.2 Cast

| Who | Job in Dress up |
|---|---|
| **Big Ma** | The host. Her room is the place; she gives the finishing task, her "pass me" (*Muke hikdo [EN: scissors] dine*) and the lookbook. She **sings only during the finishing task and at the reveal**, never over a spoken order. Her hands demonstrate a gesture the first time |
| **Nani** | Gives family-wide orders (D6), calls the weather through the doorway (D4), is the client in "Nani has a cold", and tells the old-photo story (D9) |
| **Family: Nana, Ma, Ali, the older cousin, guests** | Clients. Ali changes his mind (D5) and is the role-reversal model (D10). The older cousin turns up without his cap (a cameo that points to Find it) |
| **Simba and Zazu** | Ambient: Zazu asleep in the fabric basket, Simba batting a thread end. Bows in D11. Never over a tap target |
| **Kasuku** | On the doorway perch when you arrive: repeats a colour word you met (spaced review). **Silent during fittings** (the cast rule) |
| **The doctor** | Arc 3: his "keep her warm" line sets up Nani's D4 round |

### 5.3 The world map

- **Big Ma's room** appears on the map at the "The spill" beat (the fog clears over a thread-reel icon). Place data: `{id: "bigma-room", unlock: "arc1-ch4-intro", modes: ["dress-up", "find-it"]}`. Find it's sewing box and Dress up's fitting share the room.
- Story mode: the highlighted "Big Ma needs you" beat. Free play: go any time.

### 5.4 Free play ("the world is the menu")

| Entry in Big Ma's room | What it is |
|---|---|
| **Fittings** | Clients keep coming (a gentle queue; overlapping in Busy); orders lean towards the weakest words. **"Close the room"** ends it and goes to the summary and pocket money (Cook's open kitchen pattern) |
| **Big Ma's challenge** | D8: one themed brief a day, 2–3 must-haves, the rest yours. Goes into the lookbook |
| **The lookbook** | Every finished look as a snapshot, per person and occasion. Tap a photo to hear its words again |
| **Explore** | Tap any garment to hear its name and colour; nothing is graded (the only place garments "speak") |
| **Fitting lab** | Any mechanic, any level, random round, "Big Ma helps" tick, the leak-bot toggle |

---

## 6. Learning design

### 6.1 Words and frames it drives

| Stage | Words | Frames (existing Kutchi, or a placeholder) |
|---|---|---|
| S1 (recycled) | Numbers 1–5 (bangles, buttons) | *Salamun alaykum* · *Muke {x} khape.* (the client's request) · *Ne {x}.* · *Muke hikdo {x} dine.* (Big Ma's pass me) · *Ghan.* (handing over) · *Aabhar aanjo!* · *Achija!* · *Arre re!* · *Hedo!* |
| **S2** clothes nouns and colours | kurta, kurti, trousers (salwar/pyjama), waistcoat, cap (topi), kofia, headscarf, dupatta, shawl, cardigan, sandals/chappals, shoes, umbrella, raincoat; 10 colours | `[EN: red] [EN: kurta]` inside *Muke … khape* · `[EN: put on the {x}]` · `[EN: take off the {x}]` · `[EN: not this one, that one]` |
| **S3** adjectives, possessives, kinship | plain, dotted (bandhani), striped, with flowers; long, short; big dots, small dots; new; gold, silver | `[EN: {person}'s {x}]` · adjective agreement (does "[EN: red]" change with the garment?) · `[EN: How do I look?]` · `[EN: beautiful!]` |
| **S4** weather and feelings | it's raining, it's cold, it's hot, it's windy; I'm cold, I'm hot | `[EN: it's raining]` · `[EN: I'm cold]` · `[EN: keep warm]` |
| S5–S6 (Arc 5) | was, wore; describing | `[EN: my dupatta was red]` |
| Sewing (pass me, finishing) | needle, thread, scissors, pin, button, iron, border, pocket, sleeve, collar, hem | `[EN: pass me the {x}]` uses the existing *Muke hikdo {x} dine* |

**Row growth, easy to hard** (like Find it's clutter rule): L1 two rows of garment + focal colour → L2 three rows, binding (two colours on two garments that swap between rounds), a "no" row, D5 → L3 four rows, patterns, lengths, neighbouring colours, and the order card hides after the intro (from memory, like the tadka).

### 6.2 Word-stage fading (text in one place only)

| Word stage | Order card row | Rack and body | Mirror check |
|---|---|---|---|
| 1 New | Text + speaker; the client says it; the garment **twinkles** as it's said. Taught, not tested | Nothing | Named aloud |
| 2 Learning | Text + speaker | Nothing | Named aloud |
| 3 Nearly known | Speaker only (•••). Hidden neighbours share one ••• | Nothing | Named aloud |
| 4 Known | Heard once; replay costs the tick | Nothing | Named only on a miss |

- **No labels on garments, ever, during a round.** A label on a hanger is the answer. Explore mode is the only place a garment says its name.
- **No colour swatches or tinted text** on rows; no pictures of garments on the card or the intro card.
- Counts (bangles) show a digit only while the number word is at stage 1–2, counted aloud only then; Done ends the count, nothing ends by itself.

### 6.3 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | The client says the row again (tap the row's speaker) | Free the first time, then the tick (Relaxed) or patience (Busy) |
| 2 Slow replay | Half speed with a pause between adjective and noun | Tick / patience |
| 3 Piece by piece | The row is said as separate chunks ("[EN: red]" … "[EN: kurta]") | Tick; breaks the combo |
| 4 Reveal (eye) | Shows the row's Kutchi text (never English) | Ear star for that row, from stage 2 |
| 5 Translate | English gist | Ear star for that row |
| 6 Shown | Stage 1: automatic twinkle. Otherwise after 2 misses on a row, the right piece glows | Ear star for that row; the word doesn't advance |

- **No "warmer" rung** (Find it has one): pointing at a rail gives away the noun, and holding up a thread gives away the colour. Anything that narrows by meaning costs the ear.
- Hesitating never shows the answer: after about 8 s the client just repeats the row once (rung 1, free).
- Help is a **"?"** button in the sidebar; the goal line shows in full the first time only.

### 6.4 Mistakes and recasts

- **Level 1 (and Relaxed with a stage-1–2 word): piece-by-piece.** Each piece is checked as it goes on. Wrong: the client's face drops a little, *Arre re!* + "[EN: blue] [EN: kurta]" … "[EN: red] [EN: kurta]". The row's ear is lost at the first miss, so trying pieces until one is accepted never wins it.
- **Level 2+: the mirror.** Nothing reacts until Done; then the client checks each piece in turn and recasts from the first wrong one. The player fixes it and presses Done again.
- A miss marks the word; two misses in a row drop it a stage (existing rule).
- **Spaced retrieval in every round:** due words plus up to 3 new; Big Ma's pass me asks for a met word that isn't in the current order; the mirror check re-hears every word; the word review closes the round.

### 6.5 Role reversal

Relations are stored as data from day one: `wears(person, slot, garment, {colour, pattern, length})`. Frames are written with slots, so each can be **built from pills** as well as spoken (platform to-do 5b). D10 "Tell Ali" is then a pill builder over the same data: you pick `[colour] + [garment]` audio chunks, and Ali acts on whatever you built. **Grandparent mode:** Nani sees the look card and says the order aloud; the child dresses; she marks it.

### 6.6 What's needed from the family (English placeholders until then)

| Need | Status |
|---|---|
| **Colours (10)** | Asked (Round 1, Q11). Chase: every graded row needs one |
| **Weather** (sun, rain, cloud, wind, hot, cold, "it's cloudy", "it's raining") | Asked (Round 1, Q11) |
| **Eid clothes**: what each person actually wears (kurta, cap or kofia, headscarf or dupatta, sandals, shawl) | Asked (Round 1, Q9). **Also ask:** is it *topi* or *kofia* in this family? Are English loanwords normal (T-shirt, jeans, sweater)? |
| Everyday and monsoon clothes: trousers, cardigan or sweater, raincoat, umbrella, chappals, shoes, socks | New |
| Wedding clothes the family wears (men and women), bangles; which colours for mehndi | New (Arc 2) |
| **Do colour words change with the garment's gender or number?** ("a red kurta" vs "a red dupatta") and **does the colour come before the noun?** | New; links to Round 1 Q1. Decides whether we record whole phrases or chunks |
| Patterns and lengths: plain, dotted/bandhani, striped, with flowers; long, short; big and small dots | New |
| Garment parts: sleeve, pocket, collar, hem; left, right | New |
| Sewing things: needle, thread, scissors, pin, button, iron, border | New (some overlap with Find it's sewing box list) |
| Feelings: "I'm cold", "I'm hot" | New (S4) |
| Frames: "Put on the…", "Take it off", "Not this one, that one", "How do I look?", "Beautiful!", "{person}'s…", "It's raining, take the umbrella", "My dupatta was red" | New |
| The Eid greeting; the Eidi phrase | Asked (Q9, Q11) |
| **Big Ma's song** (Zafar's wife records it) | Agreed (Cast doc) |

**Recording load:** about 10 colours × 15 garments. If colours agree with gender, record colour + noun as whole phrases per gender class (about 20 short takes); if not, one take per colour and per noun (about 25). Either way it's one long take.

---

## 7. Stars, rewards and upgrades

### 7.1 Three stars

| Star | Icon | Earned when |
|---|---|---|
| **Ear: understood** | Ear (shared) | Every spoken piece right: garment, colour, pattern, length, count, person, weather set; no "no X" piece worn; no ear-costing help |
| **Neat** (this mode's craft star) | **A needle and thread** (Big Ma's) | The finishing task done well: creases gone, stitches on the line, the pin in the mark, the button centred. Hands only |
| Lightning (Busy) / tick (Relaxed) | Shared | Busy: within the client's patience. Relaxed: no replays or help beyond the first replay |

A round with fewer than 2 testable rows (stage-1 teaching) shows a dashed ear ("learning") and pays the helping money; it's not an ear star.

### 7.2 Pocket money

Cook's receipt: **5** for helping, **+5** ear, **+3** neat, **+3** lightning/tick, a perfect-fitting combo. **Eid morning:** each elder gives **Eidi** (a one-off story bonus). Money is never lost.

### 7.3 Collectibles

- **Big Ma's lookbook:** a snapshot of every finished look, by person and occasion (Eid, wedding, monsoon, everyday). Maryam's collection.
- **Offcuts into the quilt:** each piece made at the sewing table leaves an offcut; the chapter's quilt patch is sewn from the colours the player actually used. It ties the mode to the story's progress object.
- **Wardrobe sets** (below) fill a visible rail.

### 7.4 Later: outfits that persist

The family keeps what you dressed them in: after Eid morning, Ma wears the dupatta colour you chose in the hub and in Cook. That needs the upper-body sprites' garments as tintable layers. Worth it, but after the first set (open question 6).

### 7.5 Upgrades (never the listening)

| Upgrade | Effect | Trade-off |
|---|---|---|
| Steam iron | Creases go in one sweep instead of three | Cheap; everyone wants it |
| Electric sewing machine | Stitching follows the line within a wider tolerance | Mid-price; the neat star gets easier, never the ear |
| Wheeled second rail | Two clients can wait at once in Fittings (more coins per session) | Pays off only in Busy |
| **Wardrobe sets** (Monsoon, Wedding, Everyday modern) | New garments and colours on the rail | More coins per fitting, **harder** listening (more decoys) |
| Ali as helper | Irons for you, for a daily wage | Tycoon choice; costs every day |

**Banned upgrades:** labelled hangers, rails sorted to match the order, Big Ma "suggesting", auto-dress, a hint discount.

---

## 8. Engineering spec

### 8.1 Data model (`data/dress.json`)

```json
{
  "words": {
    "ph-kurta":  {"kutchi": null, "english": "kurta", "kind": "garment", "slot": "top", "bases": ["man", "child"], "tint": true, "trim": "kurta-trim", "occasions": ["eid", "wedding", "everyday"], "gender": null},
    "ph-red":    {"kutchi": null, "english": "red", "kind": "colour", "hex": "#B72424", "family": "red", "lum": 0.31, "focal": true},
    "ph-dotted": {"kutchi": null, "english": "dotted", "kind": "pattern", "mask": "bandhani"},
    "ph-raining":{"kutchi": null, "english": "it's raining", "kind": "weather", "needs": ["ph-umbrella"], "forbids": ["ph-shawl"]}
  },
  "lines": {}, "grammar": {"look": "{colour} {garment}", "agree": null},
  "slots": ["head", "top", "layer", "bottom", "feet", "wrap", "wrist", "carry"],
  "people": {"nana": {"base": "man", "head": "nana", "house": {"top": "house-top", "bottom": "house-pyjama"}, "kin": "ph-nana"}},
  "occasions": {"eid": {"garments": ["ph-kurta", "ph-topi", "ph-dupatta"], "palette": ["ph-white", "ph-green", "ph-red", "ph-blue", "ph-yellow"]}},
  "lookalike_groups": {"garment": [["ph-kurta", "ph-kurti", "ph-shirt"], ["ph-topi", "ph-kofia"]], "colour": [["ph-red", "ph-pink", "ph-orange"], ["ph-blue", "ph-purple"]]},
  "mechanics": {
    "fitting": {"levels": [
      {"rows": 2, "types": 3, "colours": 4, "palette": "focal", "check": "piece", "binding": false, "no": 0, "blindOdds": 0.05},
      {"rows": 3, "colours": 5, "check": "mirror", "binding": true, "no": [0, 1], "changeOfMind": 0.35},
      {"rows": 4, "colours": 6, "palette": "neighbours", "patterns": true, "lengths": true, "hideCard": true}
    ]},
    "iron": {"levels": [{"creases": 2, "sweeps": 3}]}, "stitch": {"levels": [{"lines": 1, "tolerance": 28}]}
  },
  "days": [], "upgrades": [], "star_sets": {"dress-up": ["ear", "needle", "bolt|tick"]}
}
```

- **A round (request):** `{who, occasion, weather?, rows: [{who?, slot, garment, colour?, pattern?, length?, count?, no?}], change?: {at, row, to}, finish: "iron" | "stitch" | "pin" | "button"}`.
- **Scene data:** `data/scenes/bigma-fitting.json` (client stand point and body scale, rail hanger spots, shelf spots, shoe-rack spots, accessory tray, mirror rectangle, doorway, curtain, safe zones) and `data/scenes/bigma-table.json` (bolt spots, spool spots, work area, motif tray).
- **Relations as data:** the worn state is `wears[]`, used by the grader, the lookbook, persistent outfits and D10.

### 8.2 Reused vs new

| Reused as is (Cook; Find it where built) | New building blocks |
|---|---|
| Word pills, the order ladder model (`Cook.Order.ladder` rows, shuffling, shared •••), stars shown as they happen, the receipt, completion cards, the word review (Wave 5), pass me in the sidebar, greetings and recasts, help costs, Busy patience ring, levels as data, grammar frames in data, the Station lab pattern, the open-kitchen free-play pattern | **Paper-doll renderer** (`doll.js`): body base + head + slot layers, each garment a neutral sprite **tinted in code**, a trim layer untinted, pattern masks (dots, stripes, flowers) as code overlays, the mirror reflection as a flipped copy in a mask |
| `Cook.Mech.define` and zones (`js/cook/zone.js`): the finishing tasks are mechanics that run inside a zone | **Rack builder** (`rack.js`): fills hanger and shelf spots obeying the decoy rules (section 8.4) |
| Fold's "swipe along a dashed line" → **stitch**; knead's rub → **iron**; count → **bangles** | **Look generator** (`look.js`): rows from due/weak words, occasion and level; computes the round's blind odds and adds a row or decoy until ≤ 5% |
| Find it's symmetric look-alike groups and the non-speaker bot harness | **Grader** (`grade.js`): per-row compare with binding, "no" rows, weather needs/forbids, counts; returns recast lines |
| `place_preview.py`, the visual QA checklist, the six-size test pattern | **Weather reveal** (`weather.js`): curtain, doorway walk-out, rain/wind particles, the comic soaking |

### 8.3 The Fitting lab

On the Dress up title (until the shell's map exists): run D1–D4 and each finishing task at levels 1–3 with a random round, a "Big Ma helps" tick, a **leak-bot toggle** (the bot plays the round on screen), a "blind odds" readout for the current round, and buttons to force a weather, occasion or client.

### 8.4 Leak rules (built into the rack builder and generator)

1. The base (house) clothes never satisfy a request; house clothes never appear on the rail.
2. The asked garment appears in **≥ 3 colours**; the asked colour appears on **≥ 2 garment types**.
3. **Colours balanced:** across the rack every colour in the level's palette appears the same number of times ±1, so asked colours aren't over-represented.
4. Positions on the rail and shelf are shuffled every round; nothing sits in a fixed spot.
5. Rows are shuffled; "no" rows look like other rows and are placed at random; hidden neighbours share one •••.
6. **No colour tastes in graded rows** (tastes may only set the default of free slots in D8).
7. Occasion defaults never decide a row alone: if the occasion implies a garment (Eid → cap), that row must also carry a colour or pattern.
8. Weather: curtain drawn, no weather sounds or wet clients before Done; carry items graded both ways; 4 weather states.
9. D2 and D3: nothing preselected on the table; bolts, spools and motifs balanced.
10. D9: garment tones flattened to one grey in the photo shader; trunk options in equal-luminance sets.
11. **Blind-odds budget:** each generated round's chance of a full ear star by the best blind strategy (the strongest prior per row) is ≤ 5%, computed by the generator.

### 8.5 Test harness

`build/test_dress.py` (Playwright, like `build/test_cook.py`):
- `--lab --level N`: plays every mechanic by pointer events at levels 1–3, deliberately wrong sometimes (so the recast paths run); the tap-cover check before every tap; screenshots per step.
- `--viewport` at **six sizes**: phone 915×375, 1366×768, 1440×900, 1280×800, iPad landscape, iPad portrait.
- `--days`: the story errands; `--fittings N`: free play, then "Close the room".
- **`--bot`: the leak bot.** It runs the real generator and grader in the page (`page.evaluate`, no rendering needed) for **2,000 rounds per mechanic per level**, as a player who sees only the screen: random; most salient colour; most frequent colour; the person's usual colour; the occasion default; change nothing; hedge every carry item; row-order-as-slot-order; try-and-see (level 1); press Done to hear the recast, then fix. **Pass: each strategy earns the ear star in fewer than 10% of rounds (the design budget is 5%).** English placeholder rows are treated as hidden Kutchi for this run, and the report separately lists which decisions are still English (as the Cook audit did).
- A UI pass of the bot also plays a few rounds on screen, to catch leaks the logic can't see (a label, a tinted row, a glow).

### 8.6 File layout (until the one-app shell exists)

```
dress.html                      loads js/cook shared files (core, lang, ui, order, zone), never forks them
js/dress/core.js                Dress namespace, data load, star set
js/dress/doll.js                paper-doll renderer, tint, patterns, mirror
js/dress/rack.js  look.js  grade.js  weather.js
js/dress/stations/fitting.js    D1, D4, D5, D6, D7, D8 (row types and knobs)
js/dress/stations/table.js      D2, D3 (sewing table, T)
js/dress/mechanics/iron.js  stitch.js  pin.js  button.js  bangles.js
js/dress/flow.js                days, Fittings free play, receipt, lookbook
data/dress.json   data/scenes/bigma-fitting.json   data/scenes/bigma-table.json
assets/dress/{bg,doll,garments,props}/
build/test_dress.py
```

When the shell lands, `dress.html` becomes a place (`bigma-room`) and its save moves into the shared profile; nothing else changes.

---

## 9. Scene, art and assets

### 9.1 Cameras

| Scene | Camera | Framing |
|---|---|---|
| **Big Ma's room, fitting corner** | **E, upper body first** (the existing game crop at the mirror; full body, horizon at hip height, in phase 5) | Client centre-right on a low round rug, full body about 620 px tall; full-length mirror right; rail across the upper left, a shelf below it, a shoe rack bottom left, an accessory tray; curtain on the window. A second composition of the same room as Find it's (shared walls, window and chest) |
| **Big Ma's sewing table** | **T** | Table top fills the frame; bolts and spools along the top; the work area centre; the bottom 20% clear for hands. Shared with Find it's sewing-box close-up |
| Doorway reveal (D4) | E | **Reuse** Find it's courtyard, a short walk-out strip; weather in code |
| Wrist close-up (D7) | E | The client's hand and a bangle tray (Arc 2) |
| Nani's trunk and photo (D9) | T | Arc 5; later |

### 9.2 Layers and ambient motion

- **Separate:** every garment on the rack and on the body (per slot), the hanger, the body base, the head (with talking and blink frames), the mirror frame and its reflection mask, the curtain, the rug, bolts, spools, motifs, the iron, needle and pins, the finished-piece flight.
- **Baked:** walls, floor, window frame, fixed shelves, the fixed sewing machine body, the chest.
- **Ambient (2–4 per scene):** the sewing-machine wheel turning while Big Ma sews, a thread end swaying, Zazu breathing in the fabric basket, dust motes in the window light. Off with "reduce motion"; never near a tap target.
- **Lighting states:** day (Eid morning, everyday), golden evening (the wedding evening), night (mehndi), storm grade (Arc 3). Relights in the same chat.

### 9.3 Hand poses

| Pose (existing set) | Where |
|---|---|
| C4 pointing (E) | The default tap; the ghost-finger demo |
| B5 hook grip (E) | Carrying a hanger across to the client |
| D1 grab (E, 2 frames) | Taking a folded cap or scarf from the shelf |
| C1 pinch (T, 2 frames) | The needle (stitch), a bead or motif |
| B1 handle grip (T) | The iron |
| A1 flat palm (T) | Smoothing cloth before stitching |
| C3 side pinch (T) | Pinning, holding fabric |
| C5 two-hand fold (T) | Folding a dupatta edge |
| E6 stretch (E) | The Eid morning wake-up beat |

**New:** Big Ma's demo hands: a reskin of Nani's set for C1, A1, B1, C5 (older hands, thin gold bangles, her maroon paisley sleeve), about 4 images. Optional: a **scissor grip** (T, 2 frames) if cutting fabric becomes a step (not in the first set).

### 9.4 Characters, garments, props (with reuse flagged)

**Characters (full body, new in this mode; the Art Bible's characters were upper body behind counters).**
- **Body bases:** man, woman, child (boy and girl share it), and Ali as the child base scaled taller. All garments are drawn per base.
- **Clients:** the Eid guest, Nana, Ma, Ali, the player (boy, girl; seen in the mirror), Nani (Arc 3), the older cousin. Each is a full-body version made from their approved sheet: house clothes, neutral stand, and a happy turn; the head carries talk, blink and "Arre re" frames (in-place edits). About 4 images each.
- **Big Ma:** **reuse** her sheet (seated, upper body, at the table edge in the fitting view), plus 2 new poses (holding up a garment, clapping).
- **Cultural rules:** a Khoja home in Kutch with East African roots; modest cuts; **women's and girls' headscarves or dupattas stay on**, and a new scarf replaces the old one in one swish, with no bare-head frame; caps on men and boys as the family confirms; no Hindu religious markers. **Restraint:** the rail is mostly modern everyday clothes; heritage pieces (kurta, waistcoat with a mirror-work trim, kofia, kanga, bandhani dupatta) are 1–2 nods per rack view, rotated by occasion; never costume.

**Garments** (neutral, tintable, one drawing per base used): kurta, kurti, long kameez, trousers (salwar/pyjama), waistcoat, topi, kofia, headscarf, dupatta, shawl, cardigan, T-shirt, jeans, raincoat, sandals, shoes, wellies, socks, plus the umbrella and bangles as props. About 20 types × about 2 bases.

**Props:** clothes rail, hanger, wall shelf, shoe rack, accessory tray, mirror frame, round rug, curtain, fabric bolts (tintable), thread spools (tintable), motifs (flower, leaf, star, moon), iron, needle, pins, buttons, pattern tiles (bandhani dots, stripes, flowers), cat bows.

### 9.5 Rough counts and where they're made

| Group | Count | ChatGPT (free) or API |
|---|---|---|
| Backgrounds: fitting corner (day) + 3 relights; sewing table T | 5 | **ChatGPT**, relights in the same chat |
| Full-body clients and bases | about 32 | **ChatGPT** as edits of the approved sheets, then in-place edits for frames |
| Garments aligned to the bases | about 45 + about 15 trim layers | **API**: edit in place on the base body ("add a kurta, change nothing else"), then diff-cut, so garments line up with the body. About $10–20 |
| Props and pattern tiles | about 25 | **ChatGPT** grids for cloth and wood props; **API or grey background** for steel (iron, needle, pins: never magenta) |
| Hands | about 4 Big Ma reskins (+2 optional scissors) | **API** edit mode (the outline drift check) |
| Audio | Big Ma's song; swish, sewing machine, rain, bangle tinkle | Family (the song); free sound libraries |
| **Total** | **about 125 images** | About 60% free, about 40% API |

**Process (Find it's rule):** scene spec as data → greybox in the Fitting lab → the leak bot → the art brief from the spec → backgrounds → bases → garments by edit in place → `place_preview.py` and the visual QA checklist. **Before any garment art:** a two-garment alignment test on one base (the biggest art risk).

---

## 10. Persona loops

### Loop 0: the draft

The fitting (D1) as the whole mode: the client says 2–4 pieces; you dress them; the mirror checks at Done; the craft star comes from tapping pieces quickly. Library of 11 candidates (section 3 before revisions). Weather through a visible window. Sizes (big/small cap). Rails sorted by type and colour.

### Loop 1

| Persona | Plays, says, struggles |
|---|---|
| **Layla, 5** | Loves the swish and the client's twirl. Can't read the rows; the parent plays them. At the mirror she learns she was wrong about a piece she put on a minute ago: "Why is she sad?" |
| **Zayn, 8** | "It's just dragging clothes." Nothing to get better at; the "quick" craft star isn't a skill |
| **Maryam, 11** | Loves the modern-with-a-nod clothes. Wants to choose things herself and keep her looks. "Every look is theirs, not mine" |
| **Zafar, 38** | Two rows in 90 s is thin Kutchi. Wants the words to matter in combination, not one at a time |
| **Farah, 34** | One fitting fits a stop on the train. The story beats are too long |
| **Nani, 68** | "Ma never takes her scarf off in front of people." Worried the clothes look like fancy dress |
| **The Sceptic** | Wins by: (1) leaving Nana in his house kurta when he asks for a cream kurta; (2) Ma always wants green; (3) Eid → cap, every time; (4) rows go head to toe; (5) the rail only has the colours that were asked; (6) the window shows the rain; (7) "the big cap" looks huge on Zazu, so she swaps it; (8) she hedges with umbrella and shawl every time |
| **The Builder** | Full-body characters are a new art class. One drawing per garment per colour is impossible; tint in code |

| Finding | Change |
|---|---|
| Layla's late feedback | Piece-by-piece checking at level 1 and for stage 1–2 words; first miss still costs the row's ear |
| Zayn: no skill | The **neat** star from Big Ma's finishing tasks (iron, stitch, pin, button) with *Crafting Mama*-style gestures; D5 change of mind; Busy with the mosque clock |
| Maryam: no ownership | D2 make to order; D8 must-haves + free choices; the lookbook |
| Zafar: thin Kutchi | Binding rows from level 2 (colours swap between garments); pass me; the mirror check names every piece |
| Farah | Beats capped at 3–5 s and skipped on replay; Fittings can stop at any client |
| Nani: modesty, costume | Headscarves stay on (one-swish swap); restraint rule on the rack; modern everyday clothes first |
| Sceptic 1 | Base clothes never satisfy a request and never appear on the rail |
| Sceptic 2 | No colour tastes in graded rows |
| Sceptic 3 | An occasion default never decides a row alone |
| Sceptic 4 | Rows shuffled |
| Sceptic 5 | Colours balanced across the rack; asked garment in ≥3 colours; asked colour on ≥2 types |
| Sceptic 6 | Weather heard, not seen: Nani calls it from the doorway, the curtain is drawn, no weather sound until the reveal |
| Sceptic 7 | Size words only where both sizes look right when worn (long/short dupatta, big/small dots) |
| Sceptic 8 | Carry items graded both ways; 4 weather states |
| Builder | Paper doll: 3 bases + a scaled Ali; neutral garments tinted in code; patterns as masks |

### Loop 2

| Persona | Plays, says, struggles |
|---|---|
| **Layla** | Piece-by-piece works; the ironing is her favourite ("the creases are gone!"). Two colours in one sentence (binding) loses her. The stitch line is too fiddly at 5 |
| **Zayn** | Stitching and the mosque clock give him something to beat. Wants a record and harder rounds |
| **Maryam** | Loves D2. In D8 her free choices "don't matter to anyone" |
| **Zafar** | Better. Wants the words he's learnt to *do* something outside the mode |
| **Farah** | Fine. A daily thing would bring her back |
| **Nani** | Approves; wants the Eid greeting and the family's real clothes, not a catalogue |
| **The Sceptic** | Now wins by: (1) in D6 the line of people is in the same order as the rows; (2) in D2 the thread on the table is already the answer colour; (3) at level 2+, Done with nothing changed, then fix from the recast; (4) the client glances at the right rail (idle animation); (5) the stage-1 twinkle; (6) Ali always changes his *last* piece; (7) the old photo: a pale grey dupatta can't be the dark red one |
| **The Builder** | Stitch = Cook's fold, iron = knead's rub: cheap. The garment alignment on bases is the risk. Persistent outfits in other modes need tintable upper-body layers: expensive |

| Finding | Change |
|---|---|
| Layla: binding | Binding only from level 2 |
| Layla: fiddly stitch | Level 1 stitch = one short straight line with a wide tolerance; Relaxed never times it |
| Zayn: records | Best Eid rush (clients dressed before the clock); level 3 hides the card after the intro |
| Maryam: free choices ignored | The lookbook snapshot; the family comments on the look (never graded); **later**: outfits persist into the hub and Cook (section 7.4) |
| Zafar: words outside the mode | The lookbook replays words; Kasuku repeats colour words at the door; persistent outfits later |
| Farah | **Big Ma's daily challenge** (D8), 60–90 s |
| Nani | The Eid greeting opens Eid clients; the garment list comes from Round 1 Q9 |
| Sceptic 1 | D6: the line and the rows are shuffled separately; no faces on rows |
| Sceptic 2 | Nothing preselected on the table; bolts and spools balanced |
| Sceptic 3 | Done-to-hear costs the row's ear (it's a miss); nothing lost otherwise |
| Sceptic 4 | Clients never look at, point to or lean towards anything during dressing |
| Sceptic 5 | Stage-1 rows don't count for the ear either way; a round needs ≥2 testable rows for an ear star |
| Sceptic 6 | D5 targets any row; one in four changes are false alarms |
| Sceptic 7 | Photo shader flattens garment tones; equal-luminance colour sets in the trunk |
| Builder | Two-garment alignment test before any garment art; persistent outfits held back |

### Loop 3

| Persona | Plays, says, struggles |
|---|---|
| **Layla** | Dresses Nana for Eid with her dad playing the rows; laughs at Simba's bow. Comes back for the cats and the ironing |
| **Zayn** | Level 3: four rows from memory, a change of mind, the clock. Chases his best Eid rush. Comes back for the record |
| **Maryam** | Designs a wedding kurta at the table, sees it on the rail, puts it on Ma, and it's in her lookbook. Comes back for the lookbook and the daily challenge; the old photo (Arc 5) is her favourite idea |
| **Zafar** | A fitting has about 8–12 Kutchi utterances in 90 s (greeting, order, pass me, mirror check, thanks). Binding and weather make combinations matter. Comes back for Fittings on his weakest words, and Tell Ali |
| **Farah** | Daily challenge on the train; a Fittings session ends when she closes it |
| **Nani** | Plays Grandparent mode: reads the order aloud and marks it. Proud that it's the family's own clothes and that her story is in the old photo |
| **The Sceptic** | Runs every trick in the leak-bot list (8.5). Best: occasion default + a guessed colour, 1 in 16 at level 1, which the blind-odds budget pushes under 5%. Still wins everything while the words are **English placeholders**, which she reports |
| **The Builder** | About 125 images; the logic is small (generator, grader, rack); the finishing tasks reuse Cook's mechanics |

| Finding | Change |
|---|---|
| Level 1 blind odds sit near 6% | The generator computes each round's blind odds and adds a row or a decoy colour until ≤5% |
| English placeholders defeat every test | Chase Round 1 Q9 and Q11 first; the leak bot reports placeholder decisions separately; don't judge the ear star until the words arrive |
| Kutchi per minute | Level 2+ fittings average 3 rows; pass me once per fitting after level 1 |
| Every persona has a reason to return | Stop at loop 3 |

---

## 11. Scorecard and verdict

| Criterion | Score | Why |
|---|---|---|
| Fun | **4** | The transformation, the reveal, making things with Big Ma; the Busy clock and binding for Zayn. Dressing alone would be a 3; the finishing tasks and twists lift it |
| Forces Kutchi | **4** (5 once the words exist) | Every graded choice comes from a spoken word; binding, weather and the blind-odds budget close the known leaks. Today every decision word is English |
| Distinct | **4** | The only mode that composes a person and makes things to order; the overlap with Find it's "which one?" is only the colour words |
| Plot | **4** | Arc 1 Ch4 and Ch5, Arc 2 Outfits, Mehndi night and The gift, Arc 3 weather and Nani's cold, Arc 5 old photo. Nothing in Arc 4 |
| Replay | **4** | Combinations, occasions, wardrobe sets, the daily challenge, the lookbook, offcuts into the quilt |

- **Is it good?** Yes: each mechanic in the first set passes "fun without caring about learning" and "can't win the ear star without the Kutchi", given the family's words.
- **Is it complete?** It covers S2 clothes and colours, S3 adjectives, possessives and kinship, and S4 weather and feelings, and all three story uses (Eid morning, wedding outfits, a monsoon day), plus The spill and Arc 5.
- **Verdict: Go with changes.** The changes: get the family's colour, clothes and weather words before judging the ear star; run the two-garment alignment test before the art run; build the first set only (D1 + D5, D3 → D2, D4).

**Top risks**
1. **No Kutchi yet for clothes, colours or weather:** every decision is English, so the mode teaches nothing until Round 1 Q9 and Q11 come back.
2. **Full-body paper-doll art:** a new character class; garments must line up on each base. The alignment test comes first; tinting keeps the count down.
3. **Cultural accuracy and restraint:** Eid and wedding clothes can tip into costume, and modesty rules shape the animation. The family checks the garment list.
4. **Pace:** dressing is calmer than Cook; if children find it slow, the finishing tasks, D5 and Busy are the levers.

**Open questions for Zafar**
1. Is **"neat" (a needle and thread)** right as the craft star, earned from the finishing tasks?
2. Piece-by-piece checking at level 1, then the mirror check from level 2: agreed?
3. Are free, ungraded choices (D8) OK, or should every slot be spoken?
4. Weather is only heard (curtain drawn until the reveal): OK?
5. Dress the player too (in the mirror), or family and guests only?
6. Outfits that persist into the hub and Cook: worth the extra art, later?
7. *Topi* or *kofia*, and which clothes does the family really wear at Eid, weddings and in the rain? (Can go in the Round 3 questions.)

---

## 12. Build brief for a future agent (rewritten 25 Sept, to match the deep dive)

**Rules that apply throughout:** never invent Kutchi (placeholders are `"kutchi": null` + English); levels are data and rounds are data; one mechanic = one file in `js/dress/mechanics/`; no labels on garments; nothing covers the play area; the leak rules in 8.4; UK English in UI text; look at every screenshot yourself. **Phases 0–1 touch only the mode's own files** (`dress.html`, `js/dress/**`, `data/dress.json`, `data/scenes/bigma-*.json`, `css/dress.css`, `build/leak_dress.mjs`, `build/test_dress.py`) and read Cook's shared modules without copying or editing them.

### Shared pieces this mode needs from the foundation agent (assumed to arrive; not designed here)

| Piece | Used for | Until it lands |
|---|---|---|
| The shell ("one app, one save"; the map; the one rotating hub daily) | Big Ma's room as a place; the 60-second round entry; one wallet | `dress.html` on its own page with Cook's save, as Find it does |
| The **which-one module** (`pick`: attribute + decoy rules + the blind-odds calculator) | Every row's choice | A local `js/dress/pick.js` with the same call shape, deleted when the shared one lands |
| **Overlay-at-anchor sprites** (upper body first; shared with Who did it?) | The upper-body renderer's head, wrap, wrist and carry slots; tint regions for the top | Code-drawn greybox overlays (a coloured arc for a cap, a rectangle for a shawl) at anchors in `bigma-fitting.json` |
| Star sets and ear/voice rules as data (`star_sets.dress-up`, `earPass`, `minTested`, taught-rows exclusion, the voice star) | Stars | A local `star_sets` block in `data/dress.json` |
| `js/shared/speech.js`: `listen({choices, timeoutMs}) → {choice, confidence} | null` | The `say` mechanic | `say` runs on pills only and never awards the voice star |
| **Not needed:** `data/relations.json`, `js/shared/rel.js`, scene `spots` | — | Garment parts and bed piles are slots, never relational positions |

### Phases

| Phase | Own files only? | What's playable | Acceptance |
|---|---|---|---|
| **0. Pure logic** | Yes | `data/dress.json`; `look.js` (renderer-agnostic generator, five kinds of round), `grade.js`, `rack.js`; `build/leak_dress.mjs` in **Node, no browser** (Who did it?'s pattern) | Every bot strategy (8.5, plus "occasion default", "hedge every carry item", "pile order = row order", "count until the tin stops") **< 10%** ear-star rate over 2,000 rounds per mini-game per level, target ≤ 5%; the report lists placeholder decisions separately and the real-Kutchi rows (count, size, *nar*) on their own |
| **1. Greybox lab** | Yes | `dress.html` + the Dress lab: **G2 Lay it out** (flat-lay, `fetch` + `wear` + `check`), **G1 The fitting** (upper-body greybox from the existing Cook character crops with code-drawn overlays), **G3 The table** (buttons: `count` + `stitch`), **G4 Bangles**, at L1–3; intro card, 3 s silence, live checks at L1 and Done checks from L2, recasts, "?" help costs, stars, receipt, word review; `change` from L2 | `test_dress.py --lab --level 1..3` at all six sizes; the on-screen bot matches the Node bot within 2 points over 200 rounds per strategy; no label, swatch or tinted row in any screenshot; a human plays 10 level-1 rounds of each with no repeated look |
| **2. Finishing and speaking** | Yes (reads `speech.js` if present) | `iron` (G7 The ironing pile) and `stitch` polished; the neat star; `say` with the three first-set moments (say how many, ask Big Ma, call the weather) on pills, then on `listen()` when it lands; `passme` for Big Ma | Each mechanic in the lab at L1–3; phone 915×375 stitch line usable (tolerance ≥ 28 px at L1); `say` never blocks (timeout → pills); the voice star is awarded only on a recognised or parent-ticked answer |
| **3. Weather, story, free play** | Shell files for integration only | **G5 Going out** with the curtain, doorway and walk-out reveal on Find it's courtyard strip; Arc 1 Ch4 (one motif on the pocket), the Eid-eve beat (G2) and Eid morning (G1) as data days; the Ch4 door cameo; Fittings with "Close the room"; the 60-second round for the hub daily; G9 must-haves + free choices; the lookbook | `--days` plays Ch4, the eve and Ch5 end to end; `--fittings 5` closes into the summary; the hedge strategy < 10%; no weather sound before Done (audio log); the daily entry returns in ≤ 90 s |
| **4. Art, first run (no full body)** | Art files only | T view of the sewing table and the bed; ~15 flat garments (tintable, one drawing each); ~14 upper-body overlays on the existing crops; Big Ma's demo hands; props | Visual QA checklist on every contact sheet; overlays sit within 4 px of their anchors on all three upper-body crops; restraint and cultural checks (F44's list, headscarves stay on) signed off by Zafar. **Starts only after E60–E71 and F44–F63 come back** |
| **5. Full body and held-back games** | Own files + art | The full-body renderer in `doll.js` (the two-garment alignment test first), the Eid mirror walk, shoes and trousers; G6 Tell Ali, G8 Make to order, G10, G11 | Alignment within 4 px per base; each held-back game its own bot run < 10% and a persona pass |

### First three tasks

**Task 1: data, generator, grader and the Node leak bot (phase 0).**
- `data/dress.json` from 8.1, revised: placeholder words for 11 colours, ~14 garments across the slots `head, top, wrap, wrist, carry` (upper body) and `pile` parts (flat-lay), garment parts `pocket, sleeve, collar, hem`, 4 weather states, people `nana, ma, cousin` (Cook's customer ids, so *for whom* reuses their faces), look-alike groups, `kinds` (K1–K5) and per-mini-game `levels` for G1–G5 with the ladder in D.5. Real words (`num-01..05`, `ph-big`, `ph-small`, `ph-no`) referenced by id from `data/cook.json`, never copied.
- `js/dress/look.js`: `Dress.Look.generate({kind, game, level, profile})` → a round `{who?, renderer, rows[], change?, finish?, weather?}`; renderer-agnostic; obeys 8.4 rules 2, 5, 6, 7 and calls the blind-odds calculator (local `pick.js` until the shared one lands); adds a row or decoy until ≤ 0.05.
- `js/dress/rack.js`: `Dress.Rack.build(round, scene)` → items in spots for a rail, a wardrobe shelf, a tin or a tray, rules 1–4.
- `js/dress/grade.js`: `Dress.Grade.check(round, wears)` → per row `{ok, why, recast}` and the ear verdict (binding, *nar* rows, for whom, counts, sizes, weather needs/forbids), plus `realKutchi: [rowIds]`.
- `build/leak_dress.mjs`: seeded, runs in Node, prints the rate table per strategy × game × level. **Done when** every rate is < 10% and the report shows the placeholder and real-Kutchi rows separately.

**Task 2: the greybox lab with G2 and G1 (phase 1).**
- `dress.html` loading Cook's shared files (core, lang, ui, order, zone) and `js/dress/*`; `css/dress.css`.
- `js/dress/doll.js` with two renderers: **flat** (a bed with 1–3 pile rectangles; garments as tinted flat shapes) and **upper** (the existing `assets/cook/characters/{nana,ma,cousin}-*.webp` crops; code-drawn overlays at anchors from `data/scenes/bigma-fitting.json`; a tint region for the top); the mirror as a flipped copy in a mask.
- `js/dress/mechanics/wear.js`, `check.js`, `change.js` as `Cook.Mech.define` mechanics; `js/dress/games/layout.js` (G2: `fetch` → `wear` → `check`) and `fitting.js` (G1: `pick` → `wear` → `check`, `change` from L2, `passme`).
- The Dress lab on the title: game × level buttons, "Big Ma helps", the blind-odds readout, the bot toggle. **Done when** the acceptance row for phase 1 holds for G2 and G1.

**Task 3: the harness, the table and bangles (phase 1, then 2).**
- `build/test_dress.py --lab --level N --viewport <size>`: plays every game through pointer events from `z.expect(...)`, a deliberate wrong piece in one round in three, the tap-cover check before every tap, screenshots to `build/screenshots/dress/`.
- `js/dress/mechanics/stitch.js` (fill-fold's swipe input; knobs `lines`, `tolerance`, `special`) and `js/dress/games/table.js` (G3 at L1: `count` from the tin + `stitch` per button; L2: a motif on a part; Big Ma's `passme`); `js/dress/games/bangles.js` (G4: `count` on the wrist close-up).
- `js/dress/mechanics/say.js` stub: pills only, `listen()` when `window.Shared?.speech` exists; wired as "say how many" in G4 L1 and "ask Big Ma" in G3. **Done when** the harness passes at all six sizes for L1–3 of G1–G4, the phone stitch line is usable, and Claude has checked the phone and iPad-portrait screenshots for overlap with the client and the bed.

---

## Sources

- Dress to Impress: [Inclusive Teach, parents' guide](https://inclusiveteach.com/2025/12/27/parents-guide-what-is-dress-to-impress-on-roblox/) (theme, timer, runway, 1–5 ratings); [The Mycenaean review](https://www.themycenaean.org/2026/02/dress-to-impress-review/); [Fossbytes, how to play](https://fossbytes.com/how-to-play-dress-to-impress-2025-guide/) (colour wheel, toggles); [BlueStacks theme guide](https://www.bluestacks.com/blog/game-guides/roblox/rl-dress-to-impress-theme-guide-outfit-ideas-en.html) (blocked; search summary: small palette, one prop)
- Project Makeover: [GameRefinery, match-3 part 4](https://www.gamerefinery.com/how-to-crack-the-match-3-code-part-4-project-makeover/) (fashion meta as the real game); [Walkthroughs.net](https://walkthroughs.net/project-makeover-walkthrough/) (three options per item, the reveal, the letter)
- Style Savvy: [Style Savvy Wiki, gameplay](https://stylesavvy.fandom.com/wiki/Style_Savvy) (blocked; search summary: specific requests, pick from stock, budgets); [Gamecritics review](https://gamecritics.com/trent-fingland/style-savvy-review/)
- Covet Fashion: [Trend Hunter](https://www.trendhunter.com/trends/fashion-game-app) (requirements such as "red lipstick, two silver pieces", then votes); [Game Thinking case study](https://gamethinking.io/case-studies/covet-fashion-2/)
- Love Nikki: [Stylist's Arena (Fandom)](https://lovenikki.fandom.com/wiki/Stylist's_Arena); [attributes guide](https://queen-of-stylist.tumblr.com/post/162547582311/beginners-guide-to-attributes-and-scoring-high-in) (weighted attributes and essential tags)
- Toca Hair Salon 4: [Google Play](https://play.google.com/store/apps/details?id=com.tocaboca.tocahairsalon4&hl=en_US) (regrow hair: no fear of mistakes)
- Crafting Mama: [Wikipedia](https://en.wikipedia.org/wiki/Crafting_Mama); [Common Sense Media](https://www.commonsensemedia.org/game-reviews/crafting-mama) (sew, cut, pin, fold as stylus mini-games)
- Weather dressing: [ABCya, Dress for the Weather](https://www.abcya.com/games/dress_for_the_weather)
- TPR: [Liu et al. 2024, SAGE Open](https://journals.sagepub.com/doi/full/10.1177/21582440241288924); [EnglishClub, teaching clothes to young learners](https://www.englishclub.com/efl/tefl/young-learners/how-to-teach-clothes-vocabulary-to-yl/) (race to dress a team member)
- Colour words: [Wagner, Dobkins and Barner 2013, "Slow mapping"](https://www.sciencedirect.com/science/article/abs/pii/S0010027713000243); [Frontiers 2025, Japanese children](https://www.frontiersin.org/journals/developmental-psychology/articles/10.3389/fdpys.2025.1641593/full)
- Adjectives: [Klibanoff and Waxman 2000, Child Development](https://srcd.onlinelibrary.wiley.com/doi/abs/10.1111/1467-8624.00173) (same-kind contrast first); [Mintz and Gleitman 2002, "Adjectives really do modify nouns"](https://sciencedirect.com/science/article/abs/pii/S0010027702000471); [Syrett 2024 review](https://compass.onlinelibrary.wiley.com/doi/full/10.1111/lnc3.70000)
- Retrieval, feedback, barrier games, touch targets: as in `docs/find-it-design.md` (Fritz et al. 2007; Leonard et al. 2024; Lyster and Saito 2010; ASHA; NN/g)

### Pipeline research (25 Sept, evening; search summaries, the pages themselves blocked by the proxy)

- Toca Tailor: [The Horn Book](https://www.hbook.com/story/toca-tailor-fairy-tales-app-review), [KinderTown](https://kindertown.com/blog/show-tell-toca-tailor/), [148 Apps](https://www.148apps.com/toca-tailor/toca-tailor-review/), [Children's Technology Review](http://matthewjdimatteo.com/ctr/review.php?id=16071), [Gamezebo](https://www.gamezebo.com/reviews/toca-tailor-review/) (blocked), [Common Sense Media](https://www.commonsensemedia.org/app-reviews/toca-tailor) (blocked): swatches cut and fitted automatically, hems and sleeves dragged, patterns rotated and zoomed, embellishments, the camera fabric, the photo at the end
- Baby Panda's Fashion Dress-Up (BabyBus): [Google Play](https://play.google.com/store/apps/details?id=com.sinyee.babybus.tailor&hl=en_US) (blocked; summary: customers every day; cutting, sewing, ironing, polishing, setting)
- The tailor-shop line: [Baby Fashion Tailor Shop](https://kevin.games/baby-fashion-tailor-shop) (choose fabric → measure → cut → sketch → sewing machine), [Royal Tailor 3](https://play.google.com/store/apps/details?id=com.kiwigo.princesstailorboutique.free&hl=en_US) (measure the customer, fabric, cut, sew), [Little Tailor: DIY Fashion](https://play.google.com/store/apps/details?id=com.bonbongame.tailor.diy.fashion.dress.games) (measurement, cutting, sewing, pressing), [Fashion Tailor Game & Dress Up](https://play.google.com/store/apps/details?id=com.tailorgames.fashion.clothes.sewing.boutique.dressup.kids.girls&hl=en_US) (alter, stitch, sew mini-games), [Fashion Tailor Game Kids](https://play.google.com/store/apps/details?id=com.fashiontailorgames2.kids.clothes.sewing.boutique.dressup.girls.boys) (step-by-step blocks), [Tailor Shop Clothes Designer](https://www.amazon.com/Tailor-Shop-Clothes-Designer-seamstress/dp/B01LYU690R) (all blocked; search summaries)
- Crafting Mama: [Wikipedia](https://en.wikipedia.org/wiki/Crafting_Mama), [Cooking Mama Wiki](https://cookingmama.fandom.com/wiki/Crafting_Mama) (sew, pin, cut, fold, paint, embroider as stylus mini-games)
- Dr. Panda Home: [Amazon Appstore](https://www.amazon.com/Dr-Panda-Home/dp/B00GTR44XM), [LeapFrog collection](https://store.leapfrog.com/en-us/apps/p/dr-panda-places-to-play-app-collection/_/A-prod50066-00013) (laundry as a chore task)
- Photo and catwalk endings: [My Town: Fashion Show](https://play.google.com/store/apps/details?id=mytown.fashion&hl=en), [Fashion Junior](https://apps.apple.com/us/app/fashion-junior-dress-up-games/id6768596320) (photo studio, backgrounds, stickers)
- A dressmaking sim's tape and pattern mechanics: [All Things How](https://allthings.how/how-dressmaker-works-from-client-measurements-to-finished-dress/) (drag the tape across the client; the pattern outline turns green when placed right)
