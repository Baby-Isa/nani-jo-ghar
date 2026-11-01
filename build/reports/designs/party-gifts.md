# Gifts and cake to the right person (slug: party-gifts)

Designed overnight on 1 Nov 2026, while Zafar slept, on his instruction to design every game on his likely answers; revised the same night after an independent critique (`party-gifts-critique.md`; what changed is in §12). Every choice he hasn't made is in §10 so he can reverse it. Nothing here is built or agreed. Kutchi appears only where it's already in the repo (`data/family-audio.json` by clip id, `data/lang/lexicon.json`). Everything else is English and marked "to record".

Sources, newest first:
- Zafar's answers at the foot of `build/reports/games-master-map-2026-10-31.md` (1 Nov: "yes to all except 3, 6, 8"), and the scope given for this design (one give-to, Snap's people shots, Who ate the cake? on a later visit).
- The audit's fold list (`research-existing-games-2026-10-31.md` row 378, his yes of 1 Nov): the dastarkhwan, seat the guests, where's my cup? and the family photo are kept **at the birthday party**.
- `build/reports/game-settings-map-2026-10-31.md` (rows 7, 8 and 29, and his notes).
- The research of 31 Oct: other games §1, mechanics, existing games §4-5, the word inventory and the target wordlists.
- The archived designs this game folds in: Tidy up's 5a, 5b, M1 and M7 and the dastarkhwan (`docs/archive/modes/tidy-up.md`, `js/tidy/games/dastarkhwan.js`), Find it's 6b (`docs/game-design/modes/find-it.md`), Snap's 5b and its viewfinder (`docs/archive/modes/snap.md`, `js/snap/mechanics/handin.js`), and Who did it?'s 3a and 3d (`docs/archive/modes/who-did-it.md`).

---

## 0. One line

**What it is:** at someone else's birthday party, the child hands cups, cake and party presents to the right person, all on one shared give-to. Nani (the child's own, Mum's voice) asks every time. Later, on their own engines' rebuilds, the child also photographs the person Nani names (Snap), and on visit 2 works out who ate the cake.

**Day:** someone's birthday, hosted by a new family who are a year older on each visit.

**Who is there (visit 1):**
- **The child's own Nani and Nana**, who brought the child. Nani is the asker and the guide; Nana is a guest like the child.
- **The host family, six people:** the birthday girl (4), her baby brother, her mum, her **dada** and **dadima** (her father's parents), and an aunty.
- **One party cast for all three party designs** (this file, `party-guests.md`, `do-it-engine.md`; consistency pass, 1 Nov). The placeholder names are `party-guests.md`'s, fine for now (Zafar, 1 Nov): the birthday girl is **Zara**; the aunty is **Zara's masi** (her mum's sister), so Mum's one aunty title is *masi* (open question 2 below); masi's son **Yusuf** (the boy cousin, 6) and Zara's friend **Sana** (5) are guests from visit 1, in the introductions, look after the guests and statues, but not in this design's visit-1 scenes (Yusuf joins D1 on visit 2). Dada and dadima are at the party from visit 1 (here) and join the balloon game at its L4 (visit 2). Looks, one list for every prompt, in Zafar's clothes rule (1 Nov: mostly modern and modest; older people somewhat more traditional, not all; older men a shirt tucked into trousers; middle-aged adults modern smart-casual, a quarter-zip and chinos; younger people modern casual): Zara in marigold, a long-sleeved dress over leggings; her mum in deep plum, modern smart-casual with a soft grey scarf; Zara's masi in red, modern smart-casual (D1's "the aunty in red"); dadima a lilac kameez with a plain grey dupatta (the one more traditional look); dada tall, a short grey beard, a pale shirt tucked into grey trousers; Yusuf a striped long-sleeved top and trousers; Sana modern casual. The colours stay, so every prompt still tells them apart. No teal (the cast's Masi), no cream-and-red (Nani).
- The host family's grandparents are dada and dadima, never Nana and Nani, so "Nana" and "Nani" mean the child's own grandparents on every day of the game (§12, finding 1).

**Status:** new. Its parts are old designs, folded in:
- Find it's 6b, *Give one to Nana*: the give itself.
- Tidy up's **dastarkhwan**: the cloth is laid at the start of the cake stage from L2, owners and (as they're recorded) positions, on Tidy's own rules.
- Tidy up's **where's my cup?**: Nani's own cup, at the cloth's L3.
- Snap's people shots and the family photo: after Snap's rebuild.
- Who did it?'s line-up: visit 2, after its rebuild.
- Seat the guests and the arranged family photo: parked for later visits (§5).

**Engines:**
- **give-to** (new, small, shared): tap the thing, then tap the person or place. Lifted from Snap's greyboxed hand-in (`js/snap/mechanics/handin.js`), not built from nothing.
- **Tidy's place and check** (`js/tidy/mechanics/place.js`, `check.js`, `games/dastarkhwan.js`): the cloth's rows.
- **Snap** and **Who did it?**: their rebuilds, already planned for other days; nothing is built for them here.

**Rough size, honestly:**
- **The prototype's first slice:** `giveto`, the cake stage with the cloth (A2), and the party presents (B1), at L1-L4 on the six-person cast. It can be built and bot-tested now: its first round and the whole cloth run on Mum's existing clips. (Sprint planning is on hold, Zafar 1 Nov; the aim now is rapid prototypes.)
- **Second, small:** the candles (A1) and the speaking moment (B3), once their clips land.
- **Art:** one run for the visit-1 cast (six new sheets plus Nana's party sheet), one room, the items.
- **Later, each small on its rebuild:** Snap's party part, then Who ate the cake?.

---

## 1. The language goal

**Word groups:**
- **Main:** family and people; owners and pronouns.
- **Supporting:** numbers 1-6 (candles and pieces), toys (named after the unwrap), party food, sizes (big and small), colours (red).
- **On the second visit:** question words (who? whose?) and describing words, through the clues.

### The words it teaches

Recounted from `data/family-audio.json` by id on 1 Nov (Mum's take, with a file). Key:
- **✓ Mum `id`** means Mum's own clip of that word or line. "(unchecked)" means the clip has a file but no listening check yet.
- **✓ Mum, in phrases** means Mum says the word only inside longer recorded phrases; there's no clip of the word alone.
- **engine** means the Kutchi is in the lexicon but Mum has no clip of it.
- **to record** means no Kutchi yet.

| English | Kutchi | State | Decides a move in |
|---|---|---|---|
| Nana (the child's own) | Nana | ✓ Mum `nana` ("Nana!", the calling form; Mum to confirm it serves as the plain word) | slices, presents, the cloth |
| Nani (the child's own; the asker) | Nani | ✓ Mum `nani` | the cloth (her own place) |
| dada (the girl's father's father) | dada | to record (not in the lexicon; Zafar confirms the spelling) | slices, presents, Snap |
| dadima (the girl's father's mother) | dadima | engine (`n.grandmother`, confirmed), no clip | slices, presents, Snap |
| girl | chokri | ✓ Mum, in phrases (`e-chokri`, `chokri-jo-cup`, `wadhi-chokri`, `hakri-chokri-ba-chokri`) | slices, the cloth, presents |
| boy | chokro | ✓ Mum, in phrases (`e-chokro`, `nindho-chokro`, `wadho-chokro`) | visit 2 (the cousin), D1 |
| baby | | to record | slices, presents, the pronoun sort |
| the girl's mum | *Ma* (engine); "the girl's mum" to record as a line | to record | slices L4, Snap |
| aunty (one title: Mum's choice) | | to record | slices L4, Snap |
| uncle, cousin | | to record | visit 2 |
| dear (to a child) | beta | ✓ Mum `beta` | Nani's lines only |
| guests are coming | Mageni achenta. | ✓ Mum `mageni-achenta` | Nani's opener |
| this is for Nana | Hi Nana lai ai. | ✓ Mum `hi-nana-lai-ai` | the first round's give; L1 |
| this is for {another person} | built by the engine on *hi {person} lai ai* | to record: the engine slots the person word into Mum's frame if her ear passes it, else one line per person | L1-L2 |
| it's Nana's / it's Nani's | Nana jo ai. / Nani jo ai. | ✓ Mum `nana-jo-ai`, `nani-jo-ai` | slices L3 |
| they're the girls' | Chokriyu ji ain. | ✓ Mum `chokriyu-ji-ain` (unchecked) | visit 2 (two girls) |
| Nana's cup / Nani's cup | Nana jo cup / Nani jo cup | ✓ Mum `nana-jo-cup` (unchecked), `nani-jo-cup` | the cloth L2 |
| the girl's cup / the boy's cup | chokri jo cup / chokre jo cup | ✓ Mum `chokri-jo-cup`, `chokre-jo-cup` (both unchecked) | the cloth L2 / visit 2 |
| my cup | munjo cup | ✓ Mum `munjo-cup` (unchecked) | the cloth L2 (Nani's own place) |
| your cup (to a child) | tojo cup | ✓ Mum `tojo-cup` (unchecked) | the cloth L2 (the child's own place) |
| his or her cup (one word: Kutchi doesn't mark the owner's sex) | injo cup | ✓ Mum `injo-cup` (unchecked) | the cloth L4, always after the person is named |
| your cup (to an elder) | anjo cup | ✓ Mum `anjo-cup` (unchecked) | B3 at L2, visit 2 |
| our cup (not yours) / our cup (yours too) / their cup | asanjo cup / panjo cup / iloka jo cup | ✓ Mum `asanjo-cup` (unchecked), `panjo-cup`, `iloka-jo-cup` | not on visit 1 (kept for a later visit) |
| it's mine / it's yours / it's the girl's / it's the baby's (a toy) | *munjo ai*, *tojo ai*, *chokri jo ai*, *baby jo ai* | to record (4 lines) | the pronoun sort (B2), B3 |
| where's my cup? | built by the engine from `munjo-cup` + `kida-ai` | ✓ Mum, both parts; the join is Mum's ear's call | the cloth L3 |
| Nana's cup is the red one | built from `nana-jo-cup` + `cup-laal-ai` (*Cup laal ai*, ✓ Mum, unchecked) | as above | the cloth L3 |
| the red cup / the big cup | laal cup / wadho cup | ✓ Mum `laal-cup`, `wadho-cup` (unchecked) | the cloth L3, D1 L4 |
| red | laal | ✓ Mum `laal` (unchecked) | D1, Snap |
| small | nindho / nindhi | ✓ Mum `nindho`, `nindhi` (Zafar's takes exist too; Mum's are the ones used) | slices L2, D1 |
| big | wadho / wadhi | ✓ Mum, in phrases (`wadho-cup`, `wadho-chokro`, `wadhi-chokri`); the bare entry has no file | slices L2, D1 |
| cup | cup | ✓ Mum `cup` | the cloth |
| where is it? | kida ai? | ✓ Mum `kida-ai` | the cloth L3 |
| this one, that one | hi, hu | ✓ Mum `hi`, `hu` | Nani's lines |
| whose? | | to record | B3 |
| who did it? | kere karein? | ✓ Mum `kere-karein` | D1 (the ask, until "who ate the cake?" is recorded) |
| how many? | kitla? | ✓ Mum `kitla` | the candles L3 |
| one, two, three, four | hakro, ba, trae, char | ✓ Mum, in phrases only (`hakro-cup-ba-cup`, `trae-dungri`, `char-limu`); no clip of its own | candles, slices |
| five, six | panj, chh | engine (draft) | candles L2+ |
| eat! | Kha! | ✓ Mum `kha` (Zafar's take exists too) | reactions only |
| give | de | ✓ Mum, in phrases (`muke-chamchi-de`) | Nani's lines, never deciding |
| yes, no | ha, na | ✓ Mum `ha`, `na` | not on visit 1 |
| cake, piece, candle, cupcake | | to record | the cake stages |
| open it | | to record | the presents |
| drum, ball, teddy | | to record | named at the unwrap |
| car | gadi | engine; ✓ Mum in phrases (`wadhi-gadi-je-andar`) | named at the unwrap |
| happy birthday | **Zafar, to confirm: probably said in English** (1 Nov) | to record (Mum confirms) | the candles' end |
| she's four today | | to record (Nani's line) | the candles' story beat |
| thank you | only *na, thank you* (✓ Mum `na-thank-you`) is recorded | **Zafar, to confirm: probably said in English** (1 Nov). Not used for the child until Mum confirms; then it is the family's own word in Mum's voice, like *table* | none yet |
| take a photo of ... | | to record | Snap (later) |

Corrections against the first draft: there's no clip of *chai* alone (only inside phrases), so chai and plate are out of this table; the owner words were never "in engine only": Mum has recorded seven of them on *cup*.

### Its verbs

| Verb | Kutchi | State | Form used |
|---|---|---|---|
| give | de | ✓ Mum, in phrases | Nani's command, built like *muke chamchi de* (`muke-chamchi-de`) |
| eat | kha | ✓ Mum `kha` | reactions; visit 2's "who ate?" (to record) |
| open | | to record | the unwrap |
| take (a photo) | khan | engine | Snap, later |

Blow and sit are no longer used on visit 1 (the blow is a tap; seat the guests is parked).

### Frames

**Frames heard (all in Nani's voice):**
- "This is for {person}." (✓ for Nana.)
- "{Owner}'s cup", "my cup", "your cup", "his/her cup" (✓, the cloth).
- "It's {person}'s." (✓ for Nana and Nani.)
- "Where's my cup?", "{Owner}'s cup is the red one." (built from ✓ parts.)
- "Give {count} {thing} to {person}." (the engine's give frame, as in Find it's 6b.)
- "It's yours / the girl's / the baby's." (to record, the pronoun sort.)
- Later: "Take a photo of {person}"; "Who did it?" with the clue frames.

**Frames said (B3):** "Whose is it?" answered with *munjo* (mine), *anjo* (yours, to Nani) or *chokri jo* (the girl's): a closed set of three that sound different.

### New words per level

Kept within the 3-5 new words a round rule.

- **L1:** 3-4 new: the people (Nana, the girl, the baby), the give frame, cake.
- **L2:** 3-4 new: my cup, your cup, Nani's cup (the cloth; Nana's cup reuses Nana), and two or three numbers.
- **L3:** 3 new: red, big and small on the cups and slices, "where's my cup?".
- **L4:** 2-3 new: dada and dadima, aunty, the girl's mum, his/her (*injo*).

Each new word is heard at least 3 times in a round: in the ask, on the card, and in the reaction or the count.

### Mum first (recounted)

**Already recorded:** the first round and the whole cloth (L2-L3) run today on Mum's clips: `nana`, `nani`, `hi-nana-lai-ai`, `nana-jo-cup`, `nani-jo-cup`, `munjo-cup`, `tojo-cup`, `chokri-jo-cup`, `laal-cup`, `wadho-cup`, `cup-laal-ai`, `kida-ai`. So the first slice's give-to and its leak bot can be tested on real Kutchi now. The unchecked ones need one listening pass first.

**To record for visit 1, by part:**
- **The cake stage (A2), the first slice's deciding words: 7.** dada, dadima, baby, the girl's mum, one aunty title, cake, piece. Plus up to 5 "this is for {person}" lines if Mum's ear turns down the engine's splice.
- **The presents (B1, B2): 7.** Open it; drum, ball, teddy; and the four "it's mine / yours / the girl's / the baby's" lines.
- **The candles (A1): 5-9.** Candle, cupcake, "she's four today", "happy birthday", and the numbers 1-6 as clips of their own (1-4 may be cut from Mum's existing phrase takes if they pass her ear; 5 and 6 are new).
- **The speaking moment (B3): 1 of Mum's** ("whose is it?") **and the aunty's 2 lines** (she asks Nani "whose is it?", and answers "mine!"; any voice for now, Zafar 1 Nov).

That's **about 20-24 of Mum's clips for all of visit 1, 7 for the first slice**, and the aunty's 2. Until a word is recorded, a reader wins on its grey English (the audit's flaw 2: the dastarkhwan, 95-100%), so the leak bot runs on the recorded set only and reports the rest.

---

## 2. Where it sits in its day

**The day (proposed order; decision 2):**
1. The door: "we're invited to a birthday"; the gift the child bought at the shops is wrapped.
2. The walk or ride.
3. **Introductions** (Conversations; `party-guests.md`): the host family names themselves.
4. **Look after the guests** (Cook's order card; `party-guests.md`).
5. **Musical statues.**
6. **Part A, the cake:** the candles, then the cloth and the slices.
7. **Part C, Snap the people**, ending in the family photo (once Snap is rebuilt; until then the day goes straight on).
8. **Part B, the party presents**, as everyone leaves.
9. Home: the party-bag toy for Ali.
10. The evening book.

This keeps give-to games apart (look after the guests also gives, but by feeling), and puts statues between them. The map's Part 7 lists the gifts before statues; it changes with this order (one line for the orchestrator to carry over).

**What carries in:**
- **From Introductions:** the host family's names and kinship (dada, dadima, the aunty, who is Zara's masi). The cake and the presents then test them. Both party designs now share this one cast (§0; §10, decision 3).
- **From the shops day:** the gift the child chose. It is the last present the birthday girl opens in B2.
- **From the kitchen day:** if the child baked the party cake, the same cake comes out here.
- Look after the guests no longer hands its cups on: the cloth is laid fresh in A2 (§12, finding 14).

**What carries out:**
- **The photos** (once Snap's part exists) go into the evening book. Nani asks "who's this?" over them; her own Nana is in them as Nana, the host's grandad as dada.
- **The party-bag toy** goes home for Ali. Ali isn't at the party; he opens the door at home in the new kurta the child chose at Big Ma's (`sewing.md` decision 22, consistency pass).
- **On visit 2:** the cloth's cups and the missing slice open *Who ate the cake?*, straight after the cake stage.

---

## 3. The mini-games

**Shared rules:**
- **give-to:** tap the thing, then tap the person (or their place on the cloth). The same two taps as Find it 6b, Tidy 5a and Snap 5b, deliberately shared. One gesture means "give" everywhere.
- **Who asks:** Nani, every deciding line, in Mum's takes where they exist and the device voice for the rest in the prototype (Zafar, 1 Nov). The host family's lines are reactions only (giggles, "mmm", a gasp, as sounds), never a word the move depends on.
- **Wrong person:** they react in a funny way, kindly. Nani says the ask again, the thing hops back to the tray, and the child gives it again on the spot.
- **Take-backs:** a tap on a given thing takes it back until the step moves on.
- **Ticks:** a row ticks when its thing reaches the right person first time, and only then.
- **Moving up (Zafar, 1 Nov):** only right-first-time rounds count towards the next level, in every game.
- **Hints:** after 7, 9, 11 or 13 s by level, counted from the last action, Nani repeats the ask. That hint is free (the rulebook). The helper card holds the full answer and costs a bulb.
- **How much repeats** (rulebook formula): most at L4 is 4, so the counts run 1, 2, 3, 4.
- **On phones** (below 430 px tall) at most four people stand in view; the rest wait off the right edge and walk in as the step moves on.

### The pool, scored

The five questions, scored 1-5: Do · Challenge (does the Kutchi decide?) · Fun · Instruction · Novel.

| # | Mini-game | Do | Ch | Fun | Ins | Nov | Total | Verdict |
|---|---|---|---|---|---|---|---|---|
| A1 | **Candles**: hear the count, pick the bundle, blow | 4 | 4 | 5 | 4 | 4 | 21 | Keep: visit 1, from round two (needs its clips) |
| A2 | **Cake to the right person** (Find it 6b folded in) | 5 | 5 | 4 | 5 | 3 | 22 | Keep: the core, the first slice |
| A3 | **Where's my cup?** (Nani's own cup) | 4 | 5 | 4 | 4 | 4 | 21 | Folded into A2's cloth at L3, in Nani's voice |
| A4 | **Lay the dastarkhwan** (owners, then positions) | 4 | 5 | 3 | 4 | 3 | 19 | Keep: A2's opener from L2, on Tidy's place, check and dastarkhwan (Zafar's 1 Nov yes to the fold) |
| A5 | Seat the guests ("sit next to ...") | 4 | 4 | 5 | 4 | 4 | 21 | Parked for a later visit (`docs/ideas.md`) |
| B1 | **The party presents**: unwrap a plain box, give the toy | 5 | 5 | 5 | 4 | 4 | 23 | Keep: the first slice |
| B2 | **Yours, the girl's or the baby's** (sort to three places) | 4 | 5 | 4 | 4 | 5 | 22 | Keep: B1's L3, in Nani's voice |
| B3 | **Whose is it?** (the speaking moment) | 3 | 4 | 4 | 4 | 4 | 19 | Keep: the end of part B (any voice for now, Zafar 1 Nov) |
| B4 | Pass the parcel | 5 | 5 | 5 | 4 | 5 | 24 | Parked for a later visit |
| C1 | **Snap the person named** (two of a kind) | 4 | 5 | 4 | 4 | 4 | 21 | Keep: lands with Snap's rebuild |
| C2 | **The family photo**, "all of us" (unscored) | 4 | 2 | 5 | 3 | 4 | 18 | Keep with C1, as its end shot; the arranged photo is parked |
| C3 | Hand out the prints (Snap 5b) | 4 | 4 | 3 | 5 | 2 | 18 | Maybe later: a third give-to in one day is too many |
| D1 | **Who ate the cake?** (keep who fits, heard clues) | 5 | 5 | 5 | 4 | 5 | 24 | Keep: visit 2, lands with Who did it?'s rebuild |
| D2 | Nani guesses | 4 | 5 | 4 | 4 | 5 | 22 | Parked for a later visit |
| D3 | Tell Ali the clue | 4 | 4 | 4 | 4 | 2 | 18 | Maybe later: the seventh copy of "say it, Ali acts" |

**A round is three stages** (about 3-4 minutes), never more:
- **Visit 1, round one:** the guided first round, A2 only (§4).
- **Visit 1, later rounds:** A1, then A2 (the cloth from L2), then B1 (B2 at L3) ending in B3. Once Snap is rebuilt, C1 + C2 takes A1's place in alternate rounds. Free play dips into any one.
- **Visit 2:** A2, then D1 (the missing slice), then B1.

---

### A1. Candles

**The five questions:**
1. **Do (4):** the cake has the birthday girl's candles already standing (her age, a story beat: Nani says "she's four today", to record, and the girl beams). Then a cupcake sits in front of one guest (a different guest each round). Three little bundles of candles, tied with ribbon, sit on a brass saucer. Nani asks for a count: "three candles". Tap one bundle. Its candles hop onto the cupcake one at a time while Nani counts them. Then the cake and cupcake glow: tap to blow. The flames go out one by one as Nani counts down; then Nani says "happy birthday" and the family claps (one voice at a time: the countdown, then her line, then the claps).
2. **Challenge (4):** the number word decides which bundle. Nothing shows the count: no digits, no spots on the cupcake, no fingers held up.
3. **Fun (5):** blowing out candles. A curl of smoke, the claps, and the birthday girl beaming. Dada leans in to blow too and gets there late.
4. **Instruction (4):** Nani speaks first, then the card pops up: candles with the number word. While the number is supported, the picture shows the count. It goes to the speaker only once the number is past support.
5. **Novel (4):** the only game where a count goes onto a cake. There's no "stop at N": a pick is the move (the lessons' rule).

**Levels** (the Kutchi gets harder; the gesture is always one tap on a bundle):

| Level | What's added | Picks per round |
|---|---|---|
| **L1** | One cupcake, counts 1-3. Three bundles, clearly different (for 3: bundles of 1, 3 and 6). Nani counts each bundle as it's set down at the start ("show what isn't on the card"). | 1 |
| **L2** | Two cupcakes; counts 1-6, with near decoys (n-1, n, n+1). | 2 |
| **L3** | Another way of saying it: Nani asks *kitla?* ("how many?", ✓ Mum) and answers herself, "five!", so the number comes inside a new frame. No sums: one bundle is always the answer. | 3 |
| **L4** | Big and small candles: "four big ones". A look-alike bundle (the same count, the other size). | 3 |

Numbers to 10 wait for visit 3 (the girl turns 6).

**The leak test:**
- **Reading:** nothing is written: no digits on the candles or the card.
- **Matching:** the card's picture shows the count only while the word is supported. Past support it's a speaker.
- **Eliminating:** three bundles at every level, all plausible. The used bundle is replaced by a fresh one.
- **Patterns:** the cupcake's count is new every round, and the bundles shuffle. Her age is fixed all visit, so the cake's candles are never a scored pick (a story beat only).
- **Waiting:** no glow on the answer. The timed hint (Nani repeats) is free; the helper card costs a bulb.
- **Blind rate:** 1/3 at L1 (supported), 1/9 at L2, 1/27 (3.7%) at L3 and L4.

**The delight:** the blow-out, with every flame counted down.

**Speaking:** the blow is a tap. The microphone blow (loudness only, never recognition) is a later option, and only where the day has already granted the mic in a speaking moment: this game never raises the browser's permission dialog itself.

---

### A2. Cake to the right person, with the cloth (Find it's *Give one to Nana* and Tidy's dastarkhwan, folded in)

**The five questions:**
1. **Do (5):**
   - **From L2, the cloth first.** Nani and the child lay the dastarkhwan before the cake: a cloth along the front of the low table, a cushion in front of each person, and one near cushion that is the child's own. A tray of cups. Nani: "Nana jo cup" (Nana's cup). Tap a cup, then the place in front of Nana. It slides into place with a soft clink.
   - **Then the cake.** The host mum cuts it (a short animation; the child watches). Slices sit on plates on a tray at the front. Nani asks, "this is for Nana". Tap a slice, then the person. The plate glides over, they take a bite and go "mmm".
2. **Challenge (5):** the person or owner word decides. On the cloth, *munjo* (Nani's own), *tojo* (the child's), *Nana jo* and *chokri jo* are four different heard words for four places. From L2 the count and the size decide too.
3. **Fun (4):** each person eats in their own way. The baby gets cream on the nose. Dada gets crumbs on his moustache and laughs. The aunty takes a dainty bite. On the cloth at L3 the baby has swapped two cups while no one looked. A wrong person makes a different funny "for me? ... no, no!" face and hands it back with a giggle.
4. **Instruction (5):** Nani asks (she is on screen and speaks first). The card pops up: the cup or slice, plus the person's face while that word is supported, a speaker after that. Then it flies into its row.
5. **Novel (3):** the shared give-to on purpose. Its novelty is people, owners and sizes, in one scene that ends with everyone eating.

**Levels:**

| Level | The cloth (from L2) | The cake | Slices on the tray | People in view |
|---|---|---|---|---|
| **L1** | none | One slice per ask, "yes" asks only: Nana, the girl, the baby (clearly different). | 2 for 1 ask | 3 |
| **L2** | Four asks, identical cups, five places: *Nana jo cup*, *Nani jo cup* or *munjo cup* (Nani's own), *tojo cup* (the child's), *chokri jo cup*. One spare place. | Numbers: "two pieces for the girl". "No" said last: "not the baby". Big and small slices. | 5 for 3 asked | 4 |
| **L3** | Cups differ (red or plain, big or small): "Nana's cup is the red one" (two words a move). Then "where's my cup?": Nani's own, after the baby's swap. | Other ways of saying it: "it's Nana's" (*Nana jo ai* ✓). | 6 for 4 asked | 4 |
| **L4** | *injo cup* ("his/her cup") straight after the person is named, rotating among dada, dadima and the aunty. Positions ("in front of", "next to") join as Mum records them, on Tidy's place and check. | Look-alikes: two older men (Nana and dada, told apart only by the word) and two women (the girl's mum and the aunty). Amounts: "two big pieces and one small". The new kinship words. | 7 for 4 asked | 4 on phones (others walk in), 6 on big screens |

**The leak test:**
- **Reading:** no names or labels on anyone or any place. Fix: none needed.
- **Matching:**
  - Faces are on the card only while the word is supported.
  - Slices never look like their owner; cups are identical at L2, and from L3 their colours are uncorrelated with clothes (the Tidy M1 fix).
  - Cushions are all one pattern.
- **Eliminating:**
  - There are always more places than cups and more slices than the asks total, with sizes mixed; the last ask is never the free move.
  - One person can get two slices.
  - From L2, a "no" person is in the room.
- **Patterns:**
  - Seating is shuffled every round; the child's own cushion moves along the near edge.
  - The asks run in a random order; *munjo* and *tojo* are not always first or last.
  - Who is asked for rotates (the lessons' "rotate who wants what"); *injo*'s person rotates (§12, finding 14).
- **Waiting:**
  - Nobody leans toward their slice or looks at it before the tap.
  - The timed hint is free; the helper card costs a bulb.
- **The bot:**
  - About 33% at L1 cake. That's allowed: L1 is supported, and non-negotiable 4 binds past support.
  - The cloth at L2: four asks over five places, one cup each: 1/5 × 1/4 × 1/3 × 1/2 = 1/120, about 0.8% a round.
  - The cake at L2: person (1 in 4) × count (1 in 3) per ask, over two asks: about 0.7%.
  - L3 and L4 are under 1%.

**The delight:** the whole room eating at the end. The ending is Nani's contented "aah", then the word card.

---

### B1. The party presents (unwrap, then give)

**The story:** the host family has a thank-you present for everyone. The boxes are all plain, the same brown card with a ribbon, and nobody wrote on them. The girl's mum is busy with the baby, so Nani helps hand them out. The aunty peers at the boxes, shrugs and laughs (a reaction, no words).

**The five questions:**
1. **Do (5):** tap a box. The ribbon springs off, the paper bursts, and the toy jumps out with its own sound: the drum booms, the ball bounces, the teddy squeaks. Nani names it ("a drum!") and says who it's for. Tap the toy, then the person.
2. **Challenge (5):**
   - The toy is named only after the unwrap, so the box gives nothing away (Zafar's rule).
   - **Any toy can go to anyone.** Dada gets the drum; the baby gets the ball. So the person word decides, never "the football is obviously the boy's".
   - From L2, a box holds more toys than are asked for, so "which toy and to whom" are both heard words.
3. **Fun (5):**
   - The unwrap.
   - The grown-up with a child's toy: dada drums proudly; dadima squeezes the teddy and it squeaks at her.
   - The wrong person tries the toy in a silly way, then hands it back with a grin.
4. **Instruction (4):** Nani speaks, on screen, before the card. The card shows the toy (after the unwrap) and the person.
5. **Novel (4):** the reveal decides what the ask is about. It's the Find it openables' reveal on a give-to.

**Levels:**

| Level | What's added | Boxes, toys out, toys asked | People |
|---|---|---|---|
| **L1** | One box, one toy, "this is for Nana" (the ✓ frame) or the girl or the baby. | 1, 1, 1 | 3 |
| **L2** | A box of two toys beside a box of three: "the drum for dada, the teddy for the baby". A toy not asked for waits for a later ask. "No" said last: "not the aunty". | 2, 5, 3 | 4 |
| **L3** | **Yours, the girl's or the baby's (B2):** the girl's own presents are sorted (below). | 2, 3, 3 | 3 places |
| **L4** | Look-alikes (Nana and dada; the girl's mum and the aunty) and amounts ("two balloons for dadima"). | 2, 5, 4 | 4 on phones, 6 on big screens |

**B2, yours, the girl's or the baby's (L3):** the girl unwraps her own presents, one at a time.
- **First, the watch step:** Nani says whose each present is while the aunty sorts two of them (mime only): the model, before the child's turn (lessons 3).
- Then the child's turn. Nani says one of three things (to record):
  - "it's yours" (*tojo ai*): it goes in the child's own party bag;
  - "it's the girl's" (*chokri jo ai*): it goes on her gift table;
  - "it's the baby's" (*baby jo ai*): it goes in the baby's basket.
- Nani says every line, so the speaker's face never decides; the girl's "mine!" squeal is her reaction, unscored.
- **The last box is the child's own gift from the shops.** Nani says "it's the girl's", and the girl hugs it.

**The leak test (B1 and B2):**
- **Reading:** no tags or names on the boxes. Fix: none.
- **Matching:**
  - The boxes are identical (Zafar's rule).
  - Toys come from one pool for all ages, so nothing suits its owner.
  - The bag, the table and the basket look like neither the toy nor its owner.
- **Eliminating:**
  - People outnumber the asks; a box always holds more toys than are asked from it.
  - A person can get two.
  - In B2, all three places take any number of toys.
- **Patterns:**
  - The toy-to-person deal is random each round.
  - The box order is the child's choice, so the asks come in a random order.
  - B2's three lines are dealt at random, never in turn.
- **Waiting:** no one reaches for their toy before the tap.
- **Blind rate:**
  - L1: about 33% (supported).
  - L2: (1/3 toy × 1/4 person) × (1/2 × 1/4) for the two-toy box's asks, about 1% a round.
  - B2: 1/3 a toy, three toys: 1/27, about 3.7%.
  - L4: under 1%.

**The delight:** the unwrap, and dada with a drum.

---

### B3. Whose is it? (the speaking moment, at the end of part B)

In the prototype it plays on existing takes and the device voice (Zafar, 1 Nov: nothing waits on a voice); who voices the aunty is settled before shipping.

**The five questions:**
1. **Do (3):** Nani holds up a toy and asks "whose is it?"
   - **Watch:** two exchanges, both sides in family voices. Nani asks the aunty, holding the aunty's toy; the aunty answers "mine!" and takes it. Then the aunty asks Nani, holding Nani's; Nani answers "mine!" (*munjo ai*). That's the model, played out between two characters.
   - **Handover:** Nani turns to the child (the child's front-facing moment). She holds up the toy that went into the child's bag in B1 or B2, and asks the child.
2. **Challenge (4):** what to say is shown by the picture (it's the child's own toy). How to say it is the heard frame. The pills are always there: three speaker pills with Mum's clip and a small face (the child's own, Nani's, the girl's), no written words.
3. **Fun (4):** Nani hands it over with a little bow and a "beta". From L2 she sometimes holds up *her own* present by mistake, and the child says "yours!" to her (*anjo*, the elder form).
4. **Instruction (4):** the exchange is watched twice before the child's turn.
5. **Novel (4):** the only moment where the child says an owner word.

**Levels:**
- **L1:** "mine" only; the pill and mic are offered; tapping the pill is fine.
- **L2:** Nani's own by mistake: "yours" to an elder (*anjo*).
- **L3:** the girl's toy: "the girl's" (*chokri jo*).
- **L4:** any of the three, dealt at random.

**The rules (speaking.md):**
- The mic shows it's listening and what it heard.
- It's never a gate: a pill tap moves on.
- No verdict; Ali never needs to act.
- The recogniser gets a two- or three-way choice (the 49/60 setting, SH-127).
- No "thank you" line for the child yet; the bow is the thanks. Zafar thinks the family says "thank you" in English (1 Nov, to confirm); once Mum confirms, it is the family's own word in her voice and the line can come.

---

### C1. Snap the person named (lands with Snap's rebuild)

**The five questions:**
1. **Do (4):** the guests mingle slowly in the garden, waist-up behind a low wall (one E camera, the same sprites as the room). The child pans and frames with the viewfinder, then taps to shoot. The flash fires and the **instant camera prints** (Zafar, 1 Nov): **a right shot ticks its row at once** as the print slides out; a miss prints the funny photo with no tick. No darkroom.
2. **Challenge (5):** the family word, and from L2 two words:
   - "dada", then "dadima with the baby", then "the aunty in red" (*laal* ✓).
   - **Two of a kind** always: two older men (Nana and dada), two women of an age (the girl's mum and the aunty).
   - Nani stands beside the child at the panel, never in the scene.
3. **Fun (4):**
   - Dada blinks in a shot and Nani laughs "again!"
   - The baby grabs at the lens.
   - **The photobomber:** a guest who isn't named leans into the frame, waving; the print shows it, and it's the funny miss.
4. **Instruction (4):** Nani asks. The card is the person (face while supported).
5. **Novel (4):** the only game about photographing people. It's Peek-a-Zoo's "who is ...?" tap among many faces, made into a camera.

**What counts as a shot "of" someone (the main-subject rule):**
- The named person's face is the **largest face** in the frame;
- its centre is inside the **centre two-thirds** of the viewfinder;
- **no other face** in the frame is above **50% of its area**;
- for a pair ("dadima with the baby"), exactly those two faces pass, and no third face is above 50% of the smaller one.
- An extra face is a funny miss (the photobomber's print, no tick), never a frown: Nani says the ask again and the child reshoots. A reshot row ticks plain, and only right-first-time rounds move up (Zafar, 1 Nov), so fishing with the shutter never climbs a level.
- People stand at least one face-width apart at every level, so a tight frame can always isolate one person.

**Levels:**

| Level | What's added | Shots | People in the scene |
|---|---|---|---|
| **L1** | One person named; one clearly different decoy in view. | 1 | 3 |
| **L2** | Two people in one frame ("dadima with the baby"); "not the girl" said last. | 2 | 5 (two of a kind) |
| **L3** | Owners: "the girl's dada", "Nana's ..." (to record). | 2 | 6 |
| **L4** | Look-alikes plus describing: "the aunty in red", "the small boy" (visit 2), and a count ("two women"). | 3 | 7 |

**C2, the family photo:** every round's last shot: "all of us", everyone in the frame, unscored (the one shot where the main-subject rule is off). It goes in the evening book. The arranged photo is parked.

**The leak test:**
- **Reading:** none.
- **Matching:** the named person's clothes never match the card's colour until colour is the asked word (L4); two of a kind from L2.
- **Eliminating:** everyone is always in the scene; shots are any frame, not a pick from a list.
- **Patterns:** people move to new spots each round, and the asks are random.
- **Waiting:** the person doesn't glow or wave; nothing leaves before it's asked; people drift slowly (about 50% slower than the ride).
- **Blind rate:**
  - **A wide shot: 0.** No face is the largest by the rule's margin, so it never counts.
  - A random tight shot finds the named person about 1 in 5 at L2 (five people), so about 4% for two shots; under 1% at L3 and L4.

---

### D1. Who ate the cake? (visit 2, lands with Who did it?'s rebuild; Who did it?'s 3a, *Keep who fits*)

**The five questions:**
1. **Do (5):** straight after the cake stage, while everyone claps, one slice vanishes from the plate. Nani: "who did it?" (*kere karein?* ✓; "who ate the cake?" once recorded). The guests line up on the sofa, waist-up, each holding an empty plate. Nani gives a clue (heard). Tap everyone who fits; they stand. The rest sit with their own huff. When one is left, Nani asks again and the child taps them.
2. **Challenge (5):**
   - The clue is heard, never a trace to match (Zafar's rule).
   - No crumbs on anyone's face until the reveal.
   - **Defined for this cast:** "small" means a child, "big" a grown-up. The baby is asleep in the high chair and never a suspect. The child's own Nana and Nani are never suspects.
   - Every clue uses something already true that day: size, clothes, and from L4 **the cups laid on the cloth in A2** (on visit 2 the cloth is always laid before the cake, at any A2 level).
3. **Fun (5):**
   - The sit-down huffs.
   - The reveal: the culprit grins and cream appears on their moustache or chin.
   - Often a grown-up did it, which is funnier.
   - The host cuts another slice and the culprit shares it (a picture, no pill, until Mum records "it's okay" and "share!").
   - Never *chor* (thief), never shaming.
4. **Instruction (4):** Nani asks. The clue cards fly into the notebook row.
5. **Novel (5):** the only party game where two heard facts must be held together.

**Suspects and clues, per level** (clothes are dealt each round so each clue fits exactly the set shown; a step ticks only if the standing set is right first time):

| Level | Suspects | Clue 1 (fits) | Clue 2 (fits) | Clue 3 (fits) | Blind rate a round |
|---|---|---|---|---|---|
| **L1** | the girl, the boy cousin, dada | "a girl" (*chokri*): 1 of 3 | | | 1/3, 33% (supported) |
| **L2** | the girl, the cousin, the girl's mum, dada | "someone small" (*nindho/nindhi* ✓): 2 of 4 | "in red" (*laal* ✓): 1 of those 2 | | 1/6 × 1/2 = 1/12, about 8% |
| **L3** | the girl, the cousin, the girl's mum, the aunty, dada | "someone big": 3 of 5 | "not in red": 2 of those 3 | "not the aunty": 1 of 2 | 1/10 × 1/3 × 1/2 = 1/60, about 1.7% |
| **L4** | the girl, the cousin, the girl's mum, the aunty, dada, the uncle | "someone big": 4 of 6 | "in red": 2 of those 4 | "the one with the big cup" (*wadho cup* ✓, from the cloth): 1 of 2 | 1/15 × 1/6 × 1/2 = 1/180, about 0.6% |

The bot is credited with knowing how many fit (the worst case). No single clue solves it from L2.

**The leak test:**
- **Reading:** none.
- **Matching:** no trace on the culprit.
- **Eliminating:** the clues combine from L2 (the table).
- **Patterns:** a new culprit each round (`session.no_repeat_culprit`); a grown-up as often as a child.
- **Waiting:** no tells: everyone blinks the same and wears the same mild, curious face until the reveal.

---

## 4. The child's first-ever round, screen by screen

The guided first round: unscored, about 50 seconds. **A2 only, at L1.** It shows four new things: the cake tap, the give (two taps), Nana, and the frame "this is for Nana" (✓ Mum `hi-nana-lai-ai`). No candle count, no microphone.

1. **The room fades in.** The host family's sitting room, golden afternoon light, bunting and balloons (no writing). The low table at the front holds a white cake, its candles already lit. Behind it sit the birthday girl in the middle, Nana (the child's own) on the right and the baby in a high chair. Nani stands at the left by the side panel. The shared onboarding look (`js/shared/onboard.js`): everything dims except one gold box round the cake, and the kit's finger taps it. Everything dimmed is inert: a tap there does nothing.
2. **The blow-out.** The child taps the cake. The flames go out one by one, a curl of smoke rises, and the family claps. Nani says "happy birthday" (to record; grey English while testing).
3. **The cut.** The girl's mum cuts the cake (a short animation). Slices land on plates on the tray.
4. **The give.** Nani: "Hi Nana lai ai" ✓. The card pops up big: a slice, plus Nana's face (supported), then flies to its row.
   - The gold box sits round one slice; the kit's finger taps it; the child taps it.
   - The box moves to Nana; the child taps him.
   - The plate glides over. He takes a huge bite, crumbs land on his moustache, and he laughs. The row ticks.
5. **The end.** Everyone eats; Nani sighs a happy "aah". The word card shows Nana and cake (cake in grey until recorded). Then the shared two-page end screen: progress, never a verdict.
6. **Next time:** round two adds the candles (tap to blow) and the presents at L1. The microphone appears only in B3, the day's speaking moment.

---

## 5. Later visits and harder versions

**Visit 1** (she turns 4): the cake with the cloth, the candles and the presents, at levels 1-4 as the child moves up. The rule: up after 3 right-first-time rounds (Zafar, 1 Nov) where the guide's hint came at most once a round; never down. Snap's party part joins when Snap is rebuilt.

**Visit 2** (a year older: she turns 5):
- The uncle is new (one more art run). The boy cousin is **Yusuf**, at the party since visit 1 (`party-guests.md`) and drawn in visit 1's run; he joins D1 now.
- **Who ate the cake? (D1)** follows the cake stage, once Who did it? is rebuilt.
- The elder "yours" (*anjo*) is in B3.

**Visit 3** (she turns 6): numbers to 10 on the candles; the past tense in the evening book ("dada ate the cake", to record).

**Free play:** a party table on the map runs any one part at any unlocked level.

**Parked in `docs/ideas.md`** (added in the consistency pass, 1 Nov, as rows 84-93):
- Seat the guests (A5), "next to" and "opposite me" (Tidy 5a).
- Pass the parcel (B4), with the music question shared with statues.
- Nani guesses (D2).
- The arranged family photo (Tidy M7), once positions and comparatives are recorded.
- The cupcake joke ages ("I'm a hundred!").
- The cake-cutting drag (Cook's track).
- The microphone blow.
- The old neighbour as a third older man.
- "It's okay" and "share!" pills at D1's end.
- Hand out the prints (C3) and Tell Ali the clue (D3).

---

## 6. What it reuses, and what's new

**Reused:**

| Piece | From | Used for |
|---|---|---|
| Order card, word card, guide, bulb, focus (the lit box), request pop-up, results (end screen), speech, say | `js/shared/order-card.js`, `word-card.js`, `guide.js`, `bulb.js`, `focus.js`, `request-popup.js`, `results.js`, `speech.js`, `say.js` | every part |
| The onboarding kit | `js/shared/onboard.js` | the first round and every first-time showing (the unwrap, the cloth, the line-up) |
| "Which one?" chooser | `js/shared/whichone.js` | the decoy rule for the people, the cups and the bundles |
| Character poses and faces | `js/shared/character.js`, `face.js` | the family |
| **The hand-in** | `js/snap/mechanics/handin.js` (Snap 5b, greyboxed) | `giveto` is lifted from it |
| **The dastarkhwan** | `js/tidy/games/dastarkhwan.js`, `js/tidy/mechanics/place.js`, `check.js`, `js/shared/rel.js`, `js/tidy/bot.js` | the cloth in A2 (rows, places, positions as recorded, its leak bot and the "faces off rows" rule), redrawn in the party room's E camera |
| Cook's count | `js/cook/mechanics/count.js` | Nani's count as the candles hop on |
| The clinic's waiting-room ladder | `js/clinic/stages/waiting.js` | describing people (A2 L4, Snap L4, D1's clues) |
| Snap's viewfinder and prints | `js/snap/mechanics/viewfinder.js` (after Snap's rebuild) | C1, C2 |
| Who did it?'s line-up | `js/who/mechanics/lineup.js`, `accuse.js`, `js/who/games/keep-who-fits.js`, `js/who/case.js` | D1 (visit 2) |
| Conversations | `js/shared/conversations.js` | B3's watched exchange |
| Find it's openables design (4d) and 6b | `docs/game-design/modes/find-it.md` | the unwrap; the give-to tap |
| The language engine's frames | `data/lang/` | *{person} lai*, *{person} jo ai*, the possessives |

Tidy's `tell.js` is not used for B3: it is "Ali acts on what the child says", and B3 is a watched exchange with no Ali.

**New:**
1. **`giveto`**, a shared mechanic lifted from `handin.js`: tap thing, tap person or place.
   - It handles one person receiving many things, the count and size checks, take-backs, and the funny wrong-person reaction.
   - It ticks on the first right give.
   - It's built so look after the guests, the farm's feeding and the shops can use it too.
2. **The unwrap:** a box with closed, bursting and open states, revealing a toy. A small openable.
3. **The candle bundle pick** (on `whichone` and Cook's count) and the tap-to-blow.
4. **Party data:** the cast, the toy pool, the clue sets and the levels, in `data/party.json`, until the one-app shell exists.
5. **A leak bot for each part:** reader, matcher, eliminator, pattern and waiter strategies, run on the recorded words only. Each must win under 10% of rounds past support.

---

## 7. Art and layout

### Cameras (art bible §3; one per scene)

| Scene | Camera | Notes |
|---|---|---|
| The party room (A1, A2 with the cloth, B1-B3) | **E**, like the island | The low table's front edge at 65-70% of the frame; the cloth along its front with a cushion before each person and the child's own near cushion. The family behind it, cut at the waist. Heads over a plain wall (no red behind Nani). Items on the tray, cloth and saucer in **F** view. |
| The garden for Snap (C1, C2) | **E** wide panorama (2-3 screens), parallax | Everyone **waist-up behind a low garden wall**, so the room's sprites serve: no second set of full figures. |
| The sofa line-up (D1) | **E** | Waist-up behind the sofa back: the same sprites. |

### Art list, counted in sheets (all in one paste block per run, backgrounds locked first)

**Visit 1 run (one run):**
1. **One background:** the host family's sitting room, golden afternoon light, with the cloth laid along the low table. Modern, with Kutch or East African hints: at most two nods. Bunting and balloons, **no writing on them**. The left fifth is plain wall for the side panel.
2. **Seven character sheets** (five poses each: idle three-quarter, front-facing, receiving, eating, one comic), not real people, consistent with `customers-sheet.webp`:
   - the birthday girl (Zara) at 4;
   - her baby brother (comic: cream on the nose; asleep in the high chair for D1);
   - her mum;
   - dada (comic: drumming);
   - dadima (comic: the squeaking teddy);
   - an aunty (Zara's masi);
   - **One run with `party-guests.md`:** the same sheets carry its 12-cell pose and fix-and-miss cells, and Yusuf's and Sana's sheets are drawn in this run too (one paste block; the looks in §0);
   - **Nana's party sheet** (receiving, eating with crumbs on his moustache, comic), matching his existing face (`assets/shared/faces/nana.webp`).
   - **Modest clothes:** kameez and dupatta, kurta and waistcoat. No religious markers. Nani uses her existing sheet.
3. **Item sheets (F view), every state listed:**
   - the cake: whole, cut, with its 4 candles each **lit and out** as separate sprites (so they go out one by one), a smoke curl;
   - a cupcake, with candle slots;
   - single candles big and small, lit and out; ribbon ties for bundles of 1-6 (bundles are composed in code from single candles; only the ribbon is drawn);
   - slices on plates, big and small; the tray; the brass saucer;
   - cups: five identical plain, plus red and plain in big and small;
   - the cloth and six plain cushions;
   - plain boxes: closed, bursting, open;
   - 4 toys (drum, ball, teddy, toy car);
   - the child's party bag, the baby's basket, the girl's gift table.
4. **Nothing drawn in code** beyond composing these sprites. No drop shadows on things resting on a surface; contact shadows only. Clean cut-outs.

**Later runs:** Snap's garden with its low wall and Snap's viewfinder and print frame (with Snap's rebuild); visit 2's girl at 5, the uncle and the sofa wall (with Who did it?'s rebuild); the boy cousin is Yusuf, already drawn in visit 1's run.

### Layout (two layouts, switched by height)

| Size | Layout |
|---|---|
| **740x320** (phone) | The shared side panel takes the left 148 px; Nani stands at its edge (x 148-230). At most **four people** waist-up at x 300-740, about 110 px each, **faces at least 64 px**, heads above y 140. The tray or cloth is a strip along the bottom (y 230-320) with items at least 64 px. **The big card** pops up at x 156-396, y 150-310 (240 x 160): over Nani's lower half and the tray's left end, never over a face, for about 1.5 s, then flies to its row in the panel. Speech bubbles go into the gap above heads or over the scenery, never over the panel or a face. The cog is top right. The scenery is cropped to the wall behind the heads. |
| **915x275** (Zafar's Z Fold) | The same four-people cap; people cropped at the chest; faces at least 64 px. The tray overlaps the table's front edge. Bunting and balloons are dropped; the room gives way, the faces don't. The big card goes over the tray's left end as at 740x320. Snap's panorama shows one screen at a time. |
| **930x430** | The big-screen layout's first size: up to six people, faces about 90 px; the card pops up over the scenery above the tray. |
| **1280x665** and **1920x1080** | The full room: the family waist-up behind the table, the bunting and the window light. Faces 120 px and up. The tray is centred under the table. The line-up and panorama shown wide. |

The script check confirms every pixel figure at the build.

---

## 8. What it borrows

- **Toca Birthday Party:** the cake, candles and presents as the sequence. We add the goal and the voice that asks (its reviews say it "does very little").
- **Toca Kitchen 2:** guests react to what they're given (crumbs, "mmm", the baby's cream nose).
- **Toca Tea Party:** the anti-lesson. Its outlines show where every item goes. We show no spots, faces or outlines on the cloth.
- **Peekaboo Presents** (App Store): tap a box and a toy springs out with its sound. That's our unwrap.
- **Duck Duck Moose, Peek-a-Zoo** (Common Sense Media): "who is ...?" by tapping one of many characters. That's Snap's ask, with a camera.
- **Outfoxed! and Guess Who** (via Who did it?'s research): combining clues, and the line-up sitting down.
- **Habgood and Ainsworth (Zombie Division):** the word is the move itself, not a toll.

Sources: [Peekaboo Presents](https://apps.apple.com/app/id575704316), [Peek-a-Zoo review](https://www.commonsensemedia.org/app-reviews/peek-a-zoo-by-duck-duck-moose), and the Toca reviews cited in `research-other-games-2026-10-31.md`.

---

## 9. The lessons checklist (`lessons-checklist-2026-11-01.md`)

1. **The heard word decides: pass.**
   - The leak tests are written for each part, with computed blind rates.
   - The deciding words and Mum's clips are named by id in §1 (recounted from the manifest).
   - Every deciding line is Nani's (Mum); one speaker, so the voice never points at the answer.
   - A tick goes only to a right first give.
   - Open need: plain boxes, any toy to anyone, more slices and places than asks.
   - Two words per move from L3 on the cloth (owner and colour) and from L2 on the cake (person and count).
   - Snap has a main-subject rule; a wide shot scores 0.
2. **Onboarding: pass.**
   - The first round is the tutorial: one stage, four new things, no microphone.
   - The shared onboarding kit: one lit box, the kit's finger, everything else dimmed and inert.
   - What isn't on the card is shown first (the bundles counted as set down).
   - Every gesture is tap then tap.
   - Every new screen gets its first-time showing: the cloth, the unwrap, the line-up.
3. **Instructions: pass.**
   - The asker is on screen and speaks first. The card pops up big, then flies to its row.
   - The guide box says the current step.
   - Bubbles belong to faces.
   - B2 and B3 are each modelled before the child's turn.
   - Replays are free and say only what's left.
4. **Pacing: pass.**
   - There's no Next and no Done: the step moves on when the last thing is given, or the candles are out.
   - The candle count is a pick, not a "stop at N".
   - Hints at 7, 9, 11 and 13 s.
   - No two voices at once: the countdown, then "happy birthday", then the claps.
5. **Feedback and the end: pass.**
   - A miss gets a shake, the ask again, and a different funny reaction, then it's redone on the spot.
   - Each part ends served: eating, playing, the photo.
   - The shared end screen.
6. **Layout: pass on paper.** §7 covers all five sizes, with the phone's card position in pixels and a four-person cap. Check by script at the build.
7. **Art: pass on paper.** One E camera per scene, the same waist-up sprites in every scene; counted as sheets; nothing drawn in code; one paste block per run.
8. **Speaking: pass.**
   - One moment (B3), inside a watched exchange with both sides in family voices.
   - A closed set of 3 with picture-and-speaker pills.
   - The mic shows what it heard; it never appears before the day's speaking moment.
   - Not another "say it, Ali acts".
9. **Levels: pass.**
   - They follow the rulebook: L1 core and yes-only; L2 numbers and "no" last; L3 other ways of saying it; L4 amounts and look-alikes.
   - Each L4 is its own (Nana against dada, *injo*, the cloth's cup clue in D1).
   - Every level uses only what has happened that day.
10. **Words: exception, now smaller.**
    - The first slice needs 7 of Mum's clips; all of visit 1 about 20-24, plus the aunty's 2. The budget is listed in §1.
    - The cloth and the first round run on Mum's existing clips today.
    - Things are named as they are: the toy only after the unwrap.
11. **Culture: pass.**
    - Not religious.
    - The cake is the celebration itself, never a prize; prizes are toys.
    - Modest clothes.
    - The child never holds the knife.
12. **Fun: pass.**
    - The hands always have a job.
    - "Kind of funny": dada's drum, the cream nose, the baby's cup swap, the photobomber.
    - The contrast: grown-ups with children's toys.
    - The three stages each have a different main action (count, give, unwrap and sort).
13. **Mistakes made twice: guarded.**
    - give-to is lifted from the hand-in and built shared, so the fix lands everywhere.
    - Every level is designed here, with computed rates.
    - No questions are left for the builder beyond §10.

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, the reason, and the answer I assumed. Answerable as "yes to all except ...".

1. **One game, built in steps:** visit 1 is the cake with the cloth (A2), the candles (A1) and the presents (B1, B2, B3), all on one give-to. Snap's party part joins with Snap's rebuild; Who ate the cake? on visit 2 with Who did it?'s. *Reason:* the scope was one give-to; a sprint has one playable goal. *Assumed:* yes.
2. **The day's order:** introductions, look after the guests, statues, the cake, (Snap and the photo), the presents as everyone leaves. *Reason:* give-to games aren't back to back. *Assumed:* yes. The map's Part 7 had the gifts before statues and changes with this.
3. **The host family's grandparents are dada and dadima**, never Nana and Nani; the child's own Nana and Nani come to the party. `party-guests.md` (introductions, look after the guests) now uses the same cast (consistency pass, 1 Nov; it had "Zara's nani"). *Reason:* two Nanis on one screen break the word that decides. *Assumed:* yes.
4. **Nani asks every deciding line;** the host family's lines are reactions only, and the aunty has two lines in B3's watched exchange. **Voices (Zafar, 1 Nov):** for the prototype, the Kutchi takes that exist play, and the device voice says the rest. Who voices what, the recording sessions and the casting are settled before shipping, once the words are locked; nothing in this design waits on a voice.
5. **The dastarkhwan is folded in, not sent elsewhere:** A2 opens with laying the cloth from L2 (owners), positions joining as Mum records them, on Tidy's place, check and dastarkhwan. *Reason:* your 1 Nov yes to the fold list keeps it at the party. *Assumed:* yes.
6. **Owners on the cloth use Mum's existing cup clips** (*munjo, tojo, Nana jo, Nani jo, chokri jo* cup), so the pronoun work starts at L2 on real Kutchi. *Reason:* they're recorded. *Assumed:* yes.
7. **The presents are the host's thank-you presents**, in plain boxes, unwrapped before giving; Nani helps hand them out. *Reason:* your plain-box rule, a reason to unwrap, and one asker. *Assumed:* yes.
8. **The girl's last present is the child's own gift from the shops.** *Reason:* the carry between days. *Assumed:* yes.
9. **Counted candles in tied bundles, not digit candles**; the scored count is a cupcake's, new each round; her age is a story beat. *Reason:* no stop-at-N, no digits, and a fixed age is a pattern leak. *Assumed:* yes.
10. **His and hers are one word in Kutchi** (*injo/inji*), used only straight after the person is named. *Reason:* the engine's grammar, and *injo* alone can't say who. *Assumed:* yes; Mum confirms.
11. **Any toy to anyone** (dada gets the drum). *Reason:* it kills matching and makes the joke. *Assumed:* yes.
12. **The recipient's face is on the card only while that word is supported**, then a speaker. *Reason:* the Tidy M1 fix and non-negotiable 4. *Assumed:* yes.
13. **Snap's main-subject rule:** the named face largest, centred, no rival face above half its size; an extra face is the photobomber's funny miss. *Reason:* otherwise a wide shot wins every ask. *Assumed:* yes.
14. **The first round is the cake and one give to Nana**, tap to blow, no microphone. *Reason:* four new things, not eight, and no permission dialog mid-round. *Assumed:* yes.
15. **The blow is a tap; the microphone blow is parked.** *Reason:* the mic belongs to the speaking moment first. *Assumed:* yes.
16. **The host mum cuts the cake as an animation;** the cut drag is parked. *Reason:* one mechanic fewer; the child never holds the knife. *Assumed:* yes.
17. **Who ate the cake?:** "who did it?" (✓ Mum) until "who ate the cake?" is recorded; often a grown-up; never "thief"; it ends with the host cutting a slice to share. *Reason:* non-negotiable 7. *Assumed:* yes.
18. **Parked for later visits:** seat the guests, pass the parcel, Nani guesses, the arranged photo, the cupcake joke ages, the old neighbour. *Reason:* each is a new mechanic or art job the scope didn't ask for. *Assumed:* yes.
19. **The new family is generic** (not real people): modest, warm, a year older each visit. Six people on visit 1, plus Yusuf and Sana from `party-guests.md`'s stages (one shared cast, §0); the uncle on visit 2. *Reason:* "a new family, a year older each visit", and one art run. *Assumed:* yes.
20. **Snap's party part is built after Snap's rebuild for the farm.** *Reason:* one rebuild, three settings (your yes to Q14). *Assumed:* yes.
21. **Snap's print hand-out (C3) and Tell Ali (D3) are "maybe later".** *Reason:* a third give-to in a day; "say it, Ali acts" has six copies. *Assumed:* yes.

**Open questions that are genuinely his:**
2. **Kinship words:** is it *dada* for the father's father? The aunty title is now *masi* (mother's sister), set by the shared cast with `party-guests.md` (consistency pass, 1 Nov); Mum confirms the word, you confirm spellings.

(Answered 1 Nov and removed: 1, voices are settled before shipping; 3 and 4, "happy birthday" and "thank you" are probably said in English, marked "Zafar, to confirm" in the word table.)

---

## 11. ChatGPT mock-up prompts

All four prompts ask for a wide landscape frame (about 21:9) with the left fifth kept as plain wall for the side panel, and no comic sound marks. Nani's sheet is attached only where Nani is in the scene. Prompt 4's camera is the instant camera; the tick on a right shot is code-drawn, so it isn't in the picture (Zafar, 1 Nov).

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

### Prompt party-gifts-1: the candles (part A)

This shows the moment before the pick: the cupcake waiting, and three bundles that read as different counts, so Zafar sees how a number is chosen without digits.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain cream wall with nothing important in it (a side panel will cover it later); a grandmother stands just right of that strip.

The scene: a bright, modern family sitting room in golden afternoon light, eye-level camera like a family film. Limewash cream walls, a sage door, a brass lamp, a single ajrakh-print cushion; a few paper bunting flags and three balloons near the top edge (plain colours, no writing). In front, filling the bottom third, a low pale-oak table seen straight on, its front edge at about two-thirds of the frame height. On it, centred, a round white birthday cake with four slim candles already standing, unlit, and beside it one small plain cupcake with no candles. Behind the table, cut at the waist: in the middle a beaming girl of about four in a marigold kameez with a light dupatta over her shoulders; on the right a tall grandfather with a short grey beard in a pale kurta and grey waistcoat, smiling; between them a baby boy in a high chair reaching for the cake. At the left, just right of the plain strip, the grandmother from the reference sheet, smiling, one hand open toward the table.

The moment: at the front right of the table sits a small brass saucer with three bundles of slim party candles, each tied with a ribbon, standing upright and well apart: one bundle of 1 candle, one of 3 candles, one of 6 candles. The candles must be easy to count at phone size: thick, evenly spaced, separate. Nothing has been picked yet. A soft breathing gold glow box surrounds the whole saucer. The rest of the scene is slightly dimmed.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft shadows, chunky simplified shapes, clean surfaces, big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Every resting object has a soft contact shadow; nothing floats. Modest clothing, no religious symbols or markers of any kind.

Absolutely no text, letters, numbers or comic sound marks anywhere: not on the bunting, the cake, the candles, the walls or anywhere else.

Must read at phone size (about 740x320): the four faces, the cake, the cupcake, and the three candle bundles as clearly different counts (1, 3, 6).

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
```

### Prompt party-gifts-2: the cloth and the cake (part A, the core of the first sprint)

This shows the dastarkhwan laid along the table and a slice going to the child's own Nana, so Zafar sees the give-to on the cloth and the two older men told apart only by the word.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain cream wall with nothing important in it (a side panel will cover it later); a grandmother stands just right of that strip.

The scene: the same bright, modern family sitting room, golden afternoon light, eye-level camera. Limewash cream walls, a brass lamp, a few plain paper bunting flags (no writing). A low pale-oak table across the front of the frame with a plain cream cloth laid along its front edge; on the cloth, a small round place in front of each person, and one empty place at the near edge in the middle of the frame. Behind the table, cut at the waist and spaced well apart: the grandfather from the Nana reference face, white moustache, kind; a girl of about four in a marigold kameez; a woman in a deep plum kameez with a soft grey dupatta; a tall grandfather with a short grey beard in a pale kurta and grey waistcoat. At the left, just right of the plain strip, the grandmother from the reference sheet, smiling. In front of three places stand identical plain cream cups.

The moment: on a tray at the front, five slices of white cake on small plates, two big and three small. One plate is gliding through the air toward the grandfather with the white moustache, who reaches out with delight. A soft gold glow outlines him only. Everyone else watches, smiling the same mild smile.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (cloth, ceramic, painted wood), big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Soft contact shadows on everything resting on the table or cloth. Modest clothing, no religious symbols or markers of any kind. No sweets anywhere.

Absolutely no text, letters, numbers or comic sound marks anywhere.

Must read at phone size (about 740x320): the five faces, the two grandfathers as clearly different men, the empty near place on the cloth, and the slices as big and small.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/shared/faces/nana.webp
```

### Prompt party-gifts-3: the party presents (part B; also how every give-to looks)

This shows the unwrap and the give: the plain boxes, the toy springing out, and a grown-up receiving a child's toy (the anti-matching joke). Nani is the one who asks.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain cream wall with nothing important in it (a side panel will cover it later); a grandmother stands just right of that strip.

The scene: the same bright, modern family sitting room as a family film, golden afternoon light, eye-level camera. Limewash cream walls, a brass lamp, one ajrakh cushion, a few plain paper bunting flags (no writing). A low pale-oak table across the front of the frame; behind it, cut at the waist and spaced well apart, four people in the middle and right of the frame: a tall grandfather with a short grey beard in a pale kurta and grey waistcoat; a grandmother in a lilac kameez with a dupatta over her shoulders; a woman in a red kameez and dupatta; a girl of about four in a marigold kameez. At the left, just right of the plain strip, the grandmother from the reference sheet, one hand raised toward the boxes as if speaking.

The moment: on the table in the foreground, a row of identical plain gift boxes: the same brown card, the same cream ribbon, no tags. One box in the middle has just burst open: the ribbon springs off, the brown paper flaps fly outwards, and a bright toy drum with two little sticks has popped up out of it. A soft gold glow outlines the tall grandfather, who is reaching out with delighted surprise, about to receive the drum. The others watch with the same mild smile. Nothing else glows.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (card, ribbon, painted wood), big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Soft contact shadows on everything resting on the table. Modest clothing, no religious symbols or markers of any kind. No sweets anywhere.

Absolutely no text, letters, numbers or comic sound marks anywhere: not on the boxes, ribbons, bunting, drum or walls.

Must read at phone size (about 740x320): each of the five faces, the identical boxes, and the drum as a toy drum.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
```

### Prompt party-gifts-4: Snap the person named (part C, after Snap's rebuild)

This shows the photo game with two older men spaced apart, and the viewfinder holding one face, so Zafar sees that only the heard word picks the shot and a wide frame can't.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain garden wall with nothing important in it (a side panel will cover it later).

The scene: a wide, eye-level view of a family's sunny back garden during a birthday party, like a frame from a family animated film. A limewash wall with a sage door at the back, a potted lime tree, a string of plain paper bunting (no writing). Across the middle of the frame runs a low garden wall at waist height; the guests stand behind it, seen waist-up, relaxed and spaced well apart, at least one head-width between any two: a grandfather with a white moustache (the Nana reference face); a tall grandfather with a short grey beard in a pale kurta and grey waistcoat, standing far from the first; a grandmother in a lilac kameez and dupatta holding a baby; a woman in a red kameez and a woman in a deep plum kameez, both with dupattas over their shoulders, apart from each other; a girl of about four in a marigold kameez.

The moment: a camera viewfinder overlay, four soft white rounded corner brackets, frames only the tall grandfather with the short grey beard: his face is big and centred and no other face is inside the brackets. A bright white flash is just firing, and a small instant photo of him is sliding out at the bottom edge of the frame. He is mid-blink with one eye shut, comic. Everyone else is caught in natural poses with the same mild smile.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Soft contact shadows. Modest clothing, no religious symbols or markers of any kind.

Absolutely no text, letters, numbers or comic sound marks anywhere, including on the viewfinder.

Must read at phone size (about 740x320): every face, the difference between the two grandfathers, the space between them, and the viewfinder brackets round one face only.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/shared/faces/nana.webp
```

### Prompt party-gifts-5: Who ate the cake? (visit 2, after Who did it?'s rebuild)

This shows the line-up after two heard clues, with no traces and no tells on anyone, so Zafar sees the clue is heard and not seen.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain cream wall with nothing important in it (a side panel will cover it later).

The scene: the family's bright, modern sitting room in golden late-afternoon light, eye-level camera like a family animated film. A long sofa with a single ajrakh cushion against a limewash cream wall, a brass lamp, plain paper bunting (no writing). In the foreground on a low pale-oak table: a cake on a stand with one slice clearly missing, and a cream cloth with cups at each place, one of them clearly bigger than the rest.

The moment: six guests behind the sofa, cut at the waist, each holding an empty plate, with no crumbs or cream on any face, all with the same calm, curious expression and open eyes. Two grown-ups are standing tall: a woman in a red kameez and dupatta, and a man in a red kurta. Four have sat down with small, friendly comic flops: a girl of about five in a marigold kameez, a boy of about seven in a striped kurta, a woman in a deep plum kameez and soft grey dupatta, and a tall grandfather with a short grey beard in a grey waistcoat. A baby is fast asleep in a high chair at the side. A soft gold glow surrounds the two standing grown-ups only.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm light from the upper left, chunky simplified shapes, big expressive eyes, readable mouths, no outlines, no cel shading, no photorealism, no depth-of-field blur. Soft contact shadows. Modest clothing, no religious symbols or markers of any kind. Playful, never scary or shaming: nobody frowns, rolls their eyes or looks guilty.

Absolutely no text, letters, numbers or comic sound marks anywhere.

Must read at phone size (about 740x320): the six faces, which guests are standing and which are sitting, the big cup on the cloth, and the gap in the cake.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

---

## 12. Changes after the critique

Each finding from `party-gifts-critique.md`, then what I did. All 8 MUSTs applied; 10 of 11 SHOULDs applied in full, one in part (19, the hundred joke: parked with the joke ages instead of made visual).

**MUST**

1. **Two Nanis on screen.** The host family's grandparents are now dada and dadima (§0, §1, every part, the prompts). Nana and Nani are only ever the child's own: Nani the asker, Nana a guest. Nana against dada is now L4's look-alike pair, told apart only by the word. Flagged that `party-guests.md` must share the cast (decision 3).
2. **Deciding lines in voices the family doesn't have.** Every deciding line is Nani's (Mum): A1's count, B1's naming, B2's three lines (now "yours, the girl's, the baby's", Nani's), the cloth's owners. The girl's "I'm four" became Nani's "she's four today"; the girl's "mine!" is a reaction. A3's guest-asks-for-their-cup became Nani's own "where's my cup?". A5 is parked. B3's model is Nani and the aunty, with Masi voicing the aunty's two lines; B3 waits for them, and the voice question is open question 1.
3. **The dastarkhwan sent elsewhere.** Folded in as A2's opener from L2 on Tidy's `place.js`, `check.js` and `games/dastarkhwan.js`; positions join as recorded. Old decision 11 is gone; new decision 5 cites his 1 Nov yes.
4. **Snap has no main-subject rule.** Added: the named face largest, centred in the middle two-thirds, no other face above 50% of its area; pairs exactly those two; an extra face is the photobomber's funny miss; people spaced a face-width apart. The wide shot's blind rate is written as 0. C2 "all of us" is the one shot with the rule off, and is now unscored with Ch 2.
5. **D1's L4 clue rests on a deal that isn't there.** D1 now follows the cake stage, and its L4 clue is the cloth's big cup (*wadho cup* ✓), laid at the start of every visit-2 cake stage. Pass the parcel is parked, so B1 is there on visit 2 anyway.
6. **Scope.** Visit 1 is A1 + A2 (with the cloth) + B1/B2 (+ B3) on `giveto`, with six host people. Snap's part and D1 land with their rebuilds. Parked in §5 for `docs/ideas.md`: seat the guests, pass the parcel, Nani guesses, the arranged photo, the cupcake joke ages, the cut drag, the mic blow, the old neighbour. The size in §0 is now three honest pieces; art is one run of seven sheets.
7. **The word table.** Redone from `family-audio.json` by id. Mum's owner clips (*munjo, tojo, injo, anjo, asanjo, panjo, iloka jo, Nana jo, Nani jo, chokri jo, chokre jo* cup) are marked ✓ with ids; the pronoun work moved to L2 on the cloth, with cup as the thing. Budget recounted: 7 clips for the first sprint, about 20-24 for visit 1, plus Masi's 2. One correction to the critique: Mum does have takes of *nindho* and *kha* (`nindho`, `kha`, speaker mum, with files), so they keep ✓, marked as Mum's. "Thank you" is now marked as only *na, thank you*; *chai* alone has no clip and left the table.
8. **The first round.** Now A2 only: the cake already lit, one tap to blow, one give on `hi-nana-lai-ai`, Nani's "aah", the word card (Nana, cake). No candle count, no mic. The dim/wobble contradiction is settled on the shared onboarding kit: everything dimmed is inert. I also replaced "no finger" with the kit's own finger, since `onboard.js` is the shared look (Zafar, 22 Oct).

**SHOULD**

9. **Counts that decide nothing.** The tray always holds more slices than the asks total, sizes mixed (A2's level table); B1 L2 has a two-toy box beside a three-toy box with toys left over; real rates written (about 1% at B1 L2).
10. **Phone layout.** Four people at most below 430 px tall, others walk in; faces at least 64 px everywhere; the big card's place at 740x320 given in pixels; 930x430 added as its own row.
11. **A1's empty L1 and arithmetic L3.** The scored count is a cupcake's, new each round, from L1; her age is a story beat only; the sum is cut; L3's other way of saying it is *kitla?* in Nani's own question-and-answer.
12. **D1's copied numbers.** A suspect-by-clue table per level with computed rates (33%, 8%, 1.7%, 0.6%); "small" and "big" defined for this cast; the baby and the child's own grandparents are never suspects.
13. **No watch step for the sort.** B2 opens with Nani saying whose while the aunty sorts two (mime).
14. **A3's pattern leak and the cups carry-in.** *injo* rotates among dada, dadima and the aunty and always follows the person's name; the carry-in from look after the guests is dropped (the cloth is laid fresh).
15. **The prompts.** Every prompt is now 21:9 with the left fifth kept plain for the panel, and says "no comic sound marks". Prompt 1 shows the moment before the tap, the glow on the whole saucer. The presents prompt has Nani as the asker, not the girl. The Snap prompt spaces the two older men, frames one face only, and draws everyone waist-up behind a low wall. The line-up prompt drops the guilty looks and the eye roll: everyone has the same calm face. Nani's sheet is attached only where Nani is in the scene. A new prompt shows the cloth, the first sprint's core.
16. **Art doubled and short.** Snap's garden is waist-up behind a low wall (one set of sprites); every state is listed (each candle lit and out, the cupcake, cups, cushions); the list is counted in sheets (seven for visit 1, including Nana's party sheet). The girl's later ages and visit 2's people are a later run.
17. **Reuse missed.** `giveto` is lifted from `js/snap/mechanics/handin.js`; `whichone.js`, `onboard.js`, Cook's `count.js` and the clinic's waiting-room ladder are in §6. Not taken: Tidy's `tell.js` for B3, because tell is "Ali acts" and B3 has no Ali.
18. **English reaching the child.** B3's pills are pictures plus Mum's clip, no words; D1's "it's okay / share!" pills are parked, the ending is a picture; the child's "thank you" is gone until Mum says what the family says (open question 4).
19. **Small contradictions.** The timed hint is free, and only the helper card costs a bulb (everywhere). "I'm a hundred" left with the parked joke ages rather than being made visual. The map's Part 7 change is stated in §2 and decision 2. "Happy birthday" now comes after the countdown, one voice at a time.

**Consistency pass (1 Nov, `consistency-2026-11-01.md`).** One party cast with `party-guests.md` and `do-it-engine.md`, written once in §0: the placeholder names (Zara, Zara's masi as the aunty, Yusuf, Sana), one look per person for every prompt (Zara's mum is now deep plum, not teal, which is the cast's Masi's colour), Yusuf and Sana drawn in visit 1's run, and the aunty title settled as *masi* for Mum to confirm (open question 2). The party order here is now the one all three party designs use. Ali stays home and gets the party-bag toy, wearing the kurta from `sewing.md`.

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **Snap (C1):** an instant camera with prints and a tick on each right shot, at once; no darkroom; a reshot row ticks plain.
- **Voices:** Nani's lines play on existing takes, else the device voice; the aunty's two lines in B3 no longer hold the stage back; decision 4 rewritten and open question 1 gone.
- **Happy birthday and thank you:** probably said in English, "Zafar, to confirm" in the word table; open questions 3 and 4 gone; the child's thank-you line can come once Mum confirms.
- **Level up only on right-first-time rounds** (the shared rules). **Sprint planning on hold:** "the first sprint" is now "the prototype's first slice".
- **Clothes:** the cast's looks follow his rule (dada's shirt and trousers, the mums modern smart-casual, the children modern casual, dadima the one kameez), and the prompt sheet's line is added before the prompts.
