# Big Ma's sewing: buy cloth, make, mend, try on (slug: sewing)

Designed overnight on 1 Nov 2026 while Zafar slept, and revised the same night after an independent critique (`sewing-critique.md`; what changed is in §12). He asked for every game to be designed on his likely answers. Every choice he hasn't made is in §10, so he can reverse it; the one his 1 Nov scope already settled the other way (mend, then make) is put to him as a question, not assumed. Nothing here is built or agreed. Kutchi appears only where it's already in the repo (`data/lang/lexicon.json`, the word inventory of 31 Oct). Everything else is English, marked "to record".

**Sources, newest first:**
- The scope given for this design, 1 Nov:
  - Dress up's first set: the fitting, Big Ma's sewing table (mend, then make), dress for the weather.
  - Choose colours, and make and mend different clothes.
  - The fitting comes at the end.
  - The words: clothes, colours, sizes, describing (torn, long, short).
  - Modest clothing.
  - Two faults; the said one decides.
- Zafar's answers at the foot of `build/reports/games-master-map-2026-10-31.md` (1 Nov). That map's Big Ma row, Part 2 (clothes, colours, shapes and sizes, describing, money), Part 3 (make, try) and Part 7 (the sewing day; "the sewing takes its cloth from the shops").
- His notes in `build/reports/game-settings-map-2026-10-31.md`:
  - "Big Ma makes and mends clothes, buys the fabric at the shop, and chooses colours."
  - "Dress-up as the end of it: the person tries on what you made."
- The parked Dress up design (`docs/archive/modes/dress-up.md`): its quality pass Q.1-Q.7, the table library, the fitting and Going out. The stale points listed at its top are applied.
- Research of 31 Oct: other games §13 and the cross-cutting lessons, mechanics findings 1-6, the existing-games audit (Dress up rows), the word inventory and the topic wordlists.
- `build/reports/designs/lessons-checklist-2026-11-01.md`, the rulebook (`docs/game-design/rulebook.md` §1), `docs/game-design/days/TEMPLATE.md` and `shops.md`, and the art bible §1-3 and §6.
- `docs/game-design/cast.md`: Big Ma's photo notes (`bigma-01` to `bigma-03`) and who records what.
- `docs/game-design/modes/find-it.md` 4b *Which one?* (the cloth stall is its colour skin), `docs/game-design/easy-to-play.md` rule 4, and the code as it stands (`js/dress/`, `js/find/`, `js/shared/whichone.js`, `js/cook/mechanics/fill-fold.js`, `js/snap/mechanics/handin.js`, `js/day/book-games.js`).

---

## 0. One line

**What it is:** a day in Big Ma's sewing room. The child helps her buy the cloth, make a new garment for someone who has outgrown theirs, and mend a family member's torn clothes. It ends with the fitting: each person tries on what was made and mended, twirls in the mirror, and (from the third play) steps out into the weather Nani called, in the shawl or with the umbrella the child chose.

**Day:** *Sewing with Big Ma.* The cloth comes from the shops' cloth stall:
- If the shops day already bought it, the cloth is on Big Ma's table when the day starts.
- If not, the day opens with a short visit to the same stall with Big Ma.

**Status:** designed, as a rebuild of the parked Dress up mode. Nothing of Dress up is removed: its other table games become later visits (§5).

**The first-ever play is short** (§4a): door → the opening joke → make → the fitting → the book. Two controls (the track, the two taps), two screens, about two minutes. The stall and the mend arrive on the second play, Going out (dress for the weather) on the third, each with its own showing.

**Engines, as they really stand:**
- **Buy cloth:** Find it 4b *Which one?*, whose colour skin is the cloth stall. It is **greybox on Find it's own engine** and needs Find it's rebuild onto the kit first. Pay is **designed only** (`count-to-a-number.md`, Sprint 10); until the child has met pay at the shops, Big Ma pays herself (a beat).
- **Make and mend:** a **new linear-track mechanic** for cut, seam and needle. Today's `js/dress/mechanics/stitch.js` is a swipe round a dashed **ring** on a button or motif, not a line; it stays for buttons. The line generalises Cook's dashed-line fold swipe (`js/cook/mechanics/fill-fold.js`, which `stitch.js` was itself built on) and goes into `js/shared/`. The close-up uses the clinic's heal-game frame (the asker's face in a corner).
- **The fitting:** Dress up's `wear`, rail and `fitting.js` are **greybox on `js/dress/core.js`** and are rebuilt onto the kit, not reskinned. The two taps (the piece, then the person) are give-to, which is **not built** (new in `party-gifts.md`); until it lands, the fitting runs on `js/shared/whichone.js` with the second tap lifted from Snap's `js/snap/mechanics/handin.js`, and the party reuses it.
- **Small new pieces:** the fault picker (`whichone` over a garment's parts), the size and miss gags, the stage glue.

**Rough size: large, not medium.** Honest order:
1. Find it onto the kit (its own rebuild; the shops need it first).
2. Dress up's `wear` and rail onto the kit.
3. Give-to and pay as shared pieces.
4. One linear-track mechanic in `js/shared/`, used by cut, seam and needle.
5. The sewing.

The sewing **owns** 4, the part of 2 it uses (the rail, the worn layer, the size gag), and its stages. It **waits for** 1 and pay only for the stall, and for give-to only if the party gets there first. That is **three build slices** (sprint planning is on hold, Zafar 1 Nov; the aim now is a rapid prototype), after one art run:
- **Slice 1 (about 3 days):** the shared track (cut, seam), make on the kit's table, the fitting on `whichone` with the two taps, the opening joke, the book line. Goal: the first-ever play end to end.
- **Slice 2 (2-3 days):** mend (the fault picker, the needle on the same track, buttons on the built ring stitch) and Going out as the fitting's last beat.
- **Slice 3 (about 2 days, after Find it's rebuild and pay):** the stall, with pay once the shops have taught it.

**The blockers are words, art and three engines.** No clothes word has a family clip today. Big Ma's character sheet is the first item of the art run, drawn from the photo notes already in `cast.md`. The game is "worth nothing until clothes and colours are recorded" (games map); the first-ever play needs only about six recordings (§1).

---

## 1. The language goal

**Word groups:**
- **Main:** clothes (35 at A2; none recorded), and colours (14; only red is recorded).
- **Supporting:**
  - sizes and describing words: big, small, long, short, torn, a hole, new, old, just right;
  - money: buy and pay, with the shops' numbers;
  - numbers 1-5: buttons and sleeves;
  - first and then.

This is the main home for clothes. It also gives the describing words a game where the describing word **is** the move, which the map says is missing:
- long and short pick the cut;
- torn and a hole pick the mend;
- too long and too small are the fitting's joke.

### The words it teaches

Key:
- **✓** Mum's own clip, or a whole recorded line containing it.
- **in engine** The Kutchi is in the repo but has no clip of its own yet (still to record as a clip).
- **to record** No Kutchi yet. It shows as grey italic English while testing, and the stage doesn't count as teaching until it's recorded (games map rule 3).

**Clothes and sewing things**

| English | Kutchi in the repo | State | Decides a move in |
|---|---|---|---|
| kurta | | to record | make, mend, fitting |
| cap | | to record | make, fitting |
| dupatta | *pacheri* (the family's word) | in engine (heard in 7 lines) | make (visit 2), fitting |
| shirt | *shati* | in engine, draft (Mum to confirm) | mend, fitting |
| trousers | | to record | mend (visit 2), fitting |
| shawl | | to record (a placeholder in `data/dress.json`) | Going out (visit 1, from the third play) |
| umbrella | | to record (a placeholder in `data/dress.json`) | Going out (visit 1, from the third play) |
| sleeve | | to record | make (the length), mend |
| pocket | | to record | mend |
| button(s) | | to record | mend; make L4 |
| hem | | to record | mend L3 (too long) |
| cloth | | to record | the stall, Big Ma's lines |
| scissors, needle, thread | | to record | Big Ma's lines only (never decide a move) |

**Colours**

| English | Kutchi in the repo | State | Decides a move in |
|---|---|---|---|
| red | *laal* | ✓ (own clip) | stall, fitting |
| not the red one | *laal na* | ✓ (whole line) | stall L2, fitting L2 |
| green | *lilo* | in engine | stall, fitting |
| white | | to record | stall, fitting |
| blue | | to record | stall L3+ |
| yellow | | to record | stall L3+ |
| pink | | to record | L4 look-alike (red beside pink) |
| black (of cloth) | | to record | later. The repo's *kari* means tea without milk, so it isn't used here. |

**Sizes and describing words**

| English | Kutchi in the repo | State | Decides a move in |
|---|---|---|---|
| big | *wadho* | in engine (heard in 30 lines) | stall L2 (the piece), fitting L4 |
| small | *nindho* | ✓ (own clip) | stall L2, fitting L4, the opening joke |
| big or small? | *wadho ke nindho* | in engine | the stall's speaking moment (visit 2) |
| buy the big one, buy the small one | *wadho ginech, nindho ginech* | ✓ (whole line; draft) | the stall's L3 phrasing |
| long | | to record | make L2, fitting, mend L3 |
| short | | to record | make L2, fitting, mend L3 |
| torn | | to record | mend |
| a hole | | to record | mend L3 |
| (the button) has come off | | to record | mend |
| just right | *barabar* | ✓ (own clip) | the fitting's reaction to a right pick |
| very nice | *bo fine* | in engine only inside "*chai bo fine ai*": **to record** as its own line ("you look very nice") | the mirror; the speaking moment (ungraded) |
| new, old | | to record | later visits (the old kurta and the new one) |
| too (too long, too small) | | to record | the fitting's joke. Until it's recorded, the joke says only "long!" or "small!" (*nindho* ✓). |

**Weather** (Going out; the door already says the day's weather)

| English | Kutchi in the repo | State | Decides a move in |
|---|---|---|---|
| rain | *warsaad* | in engine (heard inside "the rain stopped") | Going out: the umbrella |
| "it's raining" | | to record, as Nani's whole line | Going out |
| "it's cold" | | to record, as Nani's whole line (the repo's "cold" is food gone cold) | Going out: the shawl |

**Money and numbers** (the shops own these; the sewing reuses them)

| English | Kutchi in the repo | State |
|---|---|---|
| buy | *ginech* | in engine (heard in 1 line) |
| one, two, three, four, five | *hakro/hakri, ba, trae, char, panj* | in engine (one and three are heard inside lines; none has its own clip) |
| paisa (money), the prices | | to record (shared with the shops) |

### Its verbs

| Verb | Form | Kutchi | State | Where it decides |
|---|---|---|---|---|
| make | command, "make me ..." | *banai* | in engine (heard in 10 lines) | make (Big Ma's frame) |
| cut | command | *kap*; "cut it" *kapi chad* | ✓ (whole line) | make: "cut the long one" |
| buy | command | *ginech* | in engine | stall |
| want | "I want ...", "what would you like?" | *muke {x} khape*; *toke kuro khapeto* | the frame in engine; the question ✓ | stall, make, **the fitting's L1-L2 ask** ("I want the kurta") |
| give | "this is for X" | *hi nana lai ai* | ✓ (whole line, for Nana) | fitting L3-L4 only, always with the garment named |
| sew, mend | command | | to record | make, mend (Big Ma's lines) |
| put on | command | | to record | fitting |
| take off | command | | to record | fitting L3 |
| try on | "try it on" | | to record; **not in the engine** (verb 23) | fitting |
| look | "look!" | *nar* | in engine | the mirror |

### Frames

**Frames heard:**
- "I want the {colour} one" (*muke {x} khape*, in engine), or Big Ma to the seller: "buy the big one" (✓).
- "Make me a {garment}" (built on *banai*; Mum to confirm the form for a garment).
- "My {part} is torn" (to record): the mend's request.
- "First {x}, then {y}" (*pela … ne poi …*; *ne poi* ✓, *pela* draft).
- "Not the {x}" (*{x} na*; *laal na* ✓).
- "I want the {garment}" and "I want the {colour} {garment}" (*muke {x} khape*, the frame in engine): the fitting's L1-L2 ask, so **the garment word is always in the line**.
- "The {garment} is for {person}" (on *hi {x} lai ai*, ✓ for Nana; the form with a garment is for Mum to confirm): the fitting's L3-L4 phrasing, never the person alone.
- "{person}'s {thing}" (*{x} jo …*, as in *nana-jo-cup* ✓): the book's lines until the past tense is recorded.
- "Just right!" (*barabar* ✓), "Well done!" (*shabash* ✓), "Very nice" (*bo fine*, to record as its own line).

**Frames said** (closed sets of 2-3 that sound different, always with pills):
1. **At the stall**, handed over only once three colours are recorded (red ✓, green and white; in practice visit 2). The seller asks "what would you like?" (*toke kuro khapeto* ✓). The child says the colour: *laal*, *lilo* or white. Until then it is watched, in family voices only.
2. **At the mirror**, from visit 2. The person asks "how do I look?" (to record). The child says *bo fine* or *barabar*. Either is right. **This is ungraded shadowing with a set of two, marked as such**: it is not one of the closed-set speaking turns `speaking.md` counts.

### New words per level, and the Mum budget

- **The first-ever play:** 2 new words (kurta, cap), with red ✓, small ✓ and *barabar* ✓ coming back.
- **The second play:** 3 more (sleeve, button, torn), and green at the stall.
- **The third play:** 2-3 more (shawl, umbrella, "it's raining" or "it's cold").
- **L2:** long and short, plus pocket.
- **L3:** the other phrasings (a hole, come off, take off, try on).
- **L4:** a look-alike colour (pink) and buttons with a count.

**The word check (the day template's O-ID table), for visit 1 at L1 once all three plays are open.** "Heard" counts the asker's line, the card's replay, the showing and the recasts, not hint repeats.

| O-ID | Objective | New words | Stages that teach it | Times heard in the day | Times said | Met again |
|---|---|---|---|---|---|---|
| O1 | Clothes | kurta, cap | make (showing, ask, card), the fitting (ask, card, the end's word card), the door (Nani's line names the kurta), the book | kurta 6+, cap 3+ (make's showing, and the asked or the decoy at the fitting, named on its miss) | 0 | the party day (Ali's kurta, at home) |
| O2 | Garment parts and faults | sleeve, button, torn | mend (showing **names** each fault, the ask, the card), the door ("Nana's kurta is torn", from play 2), the book ("Nana's sleeve") | the asked fault 4+ in 3 stages; the unasked fault 1-2 times (met, not taught, that day; the asked fault alternates between plays) | 0 | the clinic (a part named) |
| O3 | Colours | red ✓, green | the stall (showing, ask, recast), make (Big Ma names the cloth), the fitting (L2+), the book ("red cloth") | red 4+, green 2+ in 2 stages | stall handover from visit 2 | the shops, the party day |
| O4 | Size and fit | small ✓, long, short | the opening joke (*nindho*), make L2, the fitting's gags | small 2+ at L1; long and short 3+ each from L2 | 0 | the clinic's tape (later) |
| O5 | Weather → clothes | shawl, umbrella, rain or cold | the door (the day's weather), Going out (Nani's call, the card, the outcome line) | the weather word 3, the asked item 2+ | 0 | pack the bag |
| O6 | Wanting and giving | *muke {x} khape*, *barabar* | make, the fitting, the stall | 5+ | 0 | Cook, the shops |

Rules that hold: every objective is taught in at least two stages; a fault word that falls short of three hearings on a play counts as met, not taught, for that play.

**Who voices whom.** **Voices (Zafar, 1 Nov):** for the prototype, the Kutchi takes that exist play, and the device voice says the rest. Who voices what, the recording sessions and the casting are settled before shipping, once the words are locked; nothing in this design waits on a voice. Big Ma's song stays as `cast.md` has it. Nothing is device-spoken in a store build.

**The Mum list.** The first-ever play needs about **6**:

> kurta, cap, "make me a kurta" and "make me a cap" (on *banai*; Mum confirms the form for a garment), "I want the kurta" and "I want the cap" (on *muke {x} khape*; one whole take each, so the join is hers), and Nani's door line "Ali has grown! His clothes are small."

The rest of visit 1, about **24 more**, most urgent first:
- **Words (14):** sleeve, button, torn, green (its own clip), long, short, pocket, white, shawl, umbrella, put on, try on, too, cloth.
- **Lines (10):** "my sleeve is torn" and "my button has come off" (Nana); Big Ma's sew line and mend line; "Nana's kurta is torn" (Nani's door line from play 2); "it's raining" and "it's cold" (Nani at the door, Going out); "how do I look?" and "you look very nice" (*bo fine*, the mirror); the seller's price line (shared with the shops).
- **The book's three past-tense sentences** ("We bought red cloth. We made Ali a kurta. We mended Nana's sleeve."): *ginech*, *banai* and "mend" have no past forms in the engine. Until Mum records them, the book says the engine's noun phrases instead (§2, stage 8).

That is over the template's 15-25, so it splits: the first-ever play's 6 and the second play's 9 (sleeve, button, torn, green, the two Nana lines, the two Big Ma lines, Nani's torn line) are one Mum round; Going out's 4 and the rest are the next.

**Visit 2 adds about 10:** take off, a hole, come off, hem, blue, yellow, pink, trousers, new, old.

---

## 2. Where it sits in its day, and what carries

**The day's list, visit 1.** It is data in the days file; a stage not yet built, or not yet open for this child, is skipped. The "From" column is the play on which the stage first appears.

| # | Stage | From | Engine | What the Kutchi decides | Carries |
|---|---|---|---|---|---|
| 1 | Door | play 1 | the door (built) | the weather (on play 3, it is the weather Going out uses). Nani: "Ali has grown! His clothes are small." From play 2 also "Nana's kurta is torn." | sets the day's customer (Ali) |
| 2 | The cloth stall | play 2 | Find it 4b's cloth-stall skin (after Find it's rebuild), plus pay once the shops have taught it | which cloth (colour; from L2, the big or small piece) | **the colour and size of cloth** go to Big Ma's table. On play 1 the red cloth is already on her table. |
| 3 | The opening joke (a beat, not a game) | play 1 | story beat | none (*nindho* "small" is modelled) | Ali, stuck in his old kurta, is why we make something new |
| 4 | **Make** | play 1 | the shared track on the table (T) | which garment, then (L2) long or short | **the new piece** goes to the rail; **the offcut** goes into the scrap tin |
| 5 | **Mend** | play 2 | the fault picker (`whichone`) + the track | which of the faults on the garment | **the mended piece** goes to the rail |
| 6 | **The fitting** | play 1 | the rebuilt `wear` and rail + the two taps (E) | which piece (the garment word always in the ask), then the mirror | **the mirror photo** goes to the book |
| 7 | **Going out** (the fitting's last beat, about 30 s) | play 3 | one tap from two carry items, then a reaction | the weather Nani calls: shawl or umbrella | the outcome joins the photo |
| 8 | Evening book | play 1 | the book (built; `js/day/book-games.js`) | the engine's noun phrases: "Ali's kurta", "Nana's sleeve", "red cloth" (the past-tense sentences once recorded) | |

**Make, then mend** (Zafar, 1 Nov: the recommendations are fine; make something, then tweak). His earlier scope said "mend, then make"; make comes first because the opening joke needs a new kurta. Because the order is one line of the days file, flipping it costs nothing.

**When the shops day came first:**
- Stage 2 is skipped, and the shops' log puts the cloth on Big Ma's table.
- At the shops the cloth stall is row 7 of `docs/game-design/days/shops.md` ("the red cloth, the big piece, for Big Ma"). On the shops' visit 1 it is a shelf of bolts at the general store, sold by the shopkeeper, and the cloth seller's own stall comes with the shops' visit 2 (`shops.md` decision 1 and open question 6, recommended A). The sewing's stall stage follows Zafar's answer there: the same engine, words and bolts either way, so until the seller's stall exists the stage plays at the general store's shelf (consistency pass, 1 Nov). It is the same stage engine, the same art and the same words, so the cloth the child chose there turns up here (Toca Town's carry-home; other games lesson 7).

**From the days around it:**
- **Pay** comes from the shops. The sewing uses it at the shops' current level for this child, so it never teaches a new number here; and until the child has played pay at the shops, Big Ma pays herself (a coin clink, no tap), so the sewing never carries pay's first-time showing.
- **Red, small and "not the red one"** come back from Cook and the shops.

**To the days after:**
- **Ali's new piece comes out on the birthday day.** Ali isn't at the party (`party-gifts.md`: the child goes with Nana and Nani, and the party-bag toy goes home for Ali), so he opens the door in it, in the colour the child bought, when the child brings his toy home; `party-gifts.md` §2 now has the line (consistency pass, 1 Nov). This holds because **the made piece is always cut from the bought cloth** (make has no colour choice); what varies is only which piece the fitting asks for. This is cheap delight, and it's the thing for Ali.
- **The offcut goes into Big Ma's scrap tin.** On a later visit it's the patch for a hole (mend L4).
- **The mirror photo** goes into the evening book.

**Rhythm.** The stall is busy, with taps and coins. Make is a satisfying craft. Mend is short and a little funny. The fitting is the payoff. No two stages in a row share their main action:

| Stage | Main action |
|---|---|
| stall | tap a bolt, then coins |
| make | a swipe that cuts, then the machine |
| mend | tap the fault, then the hand needle |
| fitting | tap the piece, then the person |
| Going out | tap one carry item; watch |

Make and mend both use the track, but with different tools, sounds and decisions.

**The day's one feeling:** proud. "I made Ali's kurta." The fitting ends on the twirl and the photo.

---

## 3. The mini-games

**The rules that hold for every stage:**
- **One gesture per kind of action, fixed across levels** (Dress up's Q.2 convention):
  - a tap chooses and places;
  - one drag along a visible track works a tool (scissors, the machine, the needle);
  - no free drags and no press-and-hold.
- **The asker is on screen and speaks first.** Then each item's card pops up big beside the side panel and flies into its row. The card never changes.
- **The light:** one lit box with a gold glow. Everything else is dimmed and can't be tapped. No finger.
- **Mistakes:** a shake and the word. The wrong item is redone on the spot. Every miss gets a different funny reaction; nobody ever frowns.
- **A step ends by itself** when it's done: no Done and no Next. A tap skips speech and is never lost.
- **Hints** (the rulebook's split): the guide's hint comes free after 7, 9, 11 or 13 s by level, from the last action, and only replays the ask. The helper card holds the full answer and is the only thing that costs a bulb.
- **How a count closes (Zafar, 1 Nov; one rule for every game, replacing `easy-to-play.md` rule 4's "a count ends at the right number"):** the natural next thing where it is clear (lifting the next tool, or the piece going to its person), never a button; otherwise about 1.25 s after the last tap (one data setting, the same everywhere). A count never stops itself at the right number: an extra tap lands, and a wrong count is a miss, said again and fixed on the spot, the row plain. A placed item can be tapped back until the step moves on. Every count is shown with more spots than N, so the picture never gives the number.
- **Levels** follow the rulebook:
  - L1: "yes" asks only, one clearly different decoy.
  - L2: numbers, "no" said last, 2 decoys, the English dotted.
  - L3: other ways of saying it, the picture blurred, 3 decoys.
  - L4: amounts, 4 decoys, one a look-alike.
- **Up a level** after 3 rounds with at most one hint each, and only right-first-time rounds count (Zafar, 1 Nov); never down.
- **No timers.** This is a craft day: the listening matters more than speed (mechanics finding 4).

### 3a. The cloth stall (buy cloth)

**The scene:** the shops' cloth stall at eye level, from the customer's side.
- Bolts of cloth stand on end along the counter, each in front view.
- The seller is behind the counter, waist up, in the middle.
- Big Ma stands at the right edge with her cloth bag.

**What you do:**
1. Big Ma tells the seller what she wants, for example "I want the red one" (*muke laal khape*).
2. Tap the bolt. The seller lifts it and unrolls it across the counter with a thump.
3. **From L2:** he holds up two lengths he has cut, a big piece and a small one. Tap the one Big Ma said ("buy the big one", *wadho ginech* ✓).
4. **Pay:** the seller says the price. If the child has played pay at the shops, they pay the shops' one way (Zafar, 1 Nov): count out the coins and hand them over to the seller, with ready-made stacks for small prices, at the shops' level for them (the coins carry no digits). If not, Big Ma pays herself with a clink: no tap, no first-time showing here.

The cloth folds itself into Big Ma's bag.

**It is Find it 4b *Which one?*,** whose colour skin is this stall (`find-it.md`: L11, F63). It brings the size rule 3a's L2 needs (the same picture at two scales, so the size word alone decides) and the blind-odds generator. It waits for Find it's rebuild onto the kit.

**The five questions:**

| Question | Answer | Score |
|---|---|---|
| What do you do? | Tap a bolt, then (L2) a piece, then the coins once pay is known. All taps. | 5 |
| Where is the challenge, and does the Kutchi decide it? | Only the heard colour (and size) picks the bolt; every bolt could be bought. | 4 (colour words are slow to learn, so red and green carry it first) |
| Where is the fun? | The bolt's thump-and-unroll; the seller's big shears' snip; the coins clinking. | 3 |
| Where is the instruction? | Big Ma speaks to the seller, then her card pops up: the colour chip (a swatch only while the word is supported), and from L2 the size chip. | 5 |
| What is novel? | Choosing the material that the next game makes from. The colour you heard is the colour Ali wears on the party day. | 3 (Find it 4b's skin, once rebuilt) |

**Total: 20. Keep** as the day's short opener. On the shops day it is that day's stall 7.

**Level ladder:**

| Level | What it adds | Example |
|---|---|---|
| L1 | one bolt asked; 2 on the counter, clearly different; pay 1-3 coins once pay is known (else Big Ma pays) | red, among red and green |
| L2 | the size (big or small piece): two words per move. 3 bolts. "No" said last. | "the green one, the big piece, not the red one" |
| L3 | other ways of saying it, such as "buy the big one" (✓), "the red one for Ali", "I want ..." 4 bolts; the card's picture blurred. | |
| L4 | two cloths, in order, and a look-alike | "first the big red one, then the small white one"; red beside pink, 5 bolts |

**The leak test:**
- **Reading:** the card shows the word's Kutchi and a speaker, with a swatch only while the colour is supported. From L2 the English is dotted and the colour has no swatch once past support. Bolts carry no labels. The stage counts as teaching only once its colours are recorded (the dastarkhwan lesson: readers win on English placeholders).
- **A data check, not just a rule:** the stall never counts as teaching with fewer than two recorded colours on the counter (filtered to recorded words, one colour would always be the ask: a pattern). The lab bot reports the placeholder rate (the share of asks that are grey English) as its own line.
- **Matching:** there is no swatch past support, so there is nothing to match bolt to card. The size chip is never a picture of a long or short piece, only the word.
- **Eliminating:** a wrong tap doesn't remove the bolt. It wobbles, the seller says that bolt's colour (the recast), and it stays. Ticks happen only on the right bolt, first go, so fishing doesn't tick.
- **Patterns:** the colours, the asked one, the positions and the size are all random each round. (When the shops day came first the stall is skipped, so this stall's ask is never fixed by the shops' cloth.)
- **Waiting:** nothing glows on the answer. The guide's free hint only replays the ask; only the helper card shows the answer, and it costs a bulb.
- **The blind bot:**
  - L1: 50% (one decoy, which the rulebook allows at L1).
  - L2: 1 in 3 bolts × 1 in 2 pieces = 17% per buy.
  - L4: two buys from 5 bolts, about 1%.
  - The day-level bot at L1 (stall × make × mend × fitting at 50% each) is about 6%.

**The delight moment:** the bolt flops open across the counter with a soft thump and a little puff of lint. On a later visit Simba rides in on the roll.

**The speaking moment** (watched until three colours are recorded; handed over after, in practice visit 2):
- **Watch:** Big Ma and the seller play the exchange on every round: "What would you like?" (✓), then the colour, in Mum's voice. It plays only with colours that have a Mum clip, so until green has its own clip the watched answer is always *laal* and the watch is a model, not a count.
- **Handover:** once red, green and white are recorded, the seller turns to the child with the same line. The closed set is the three colours on the counter, which sound different (*laal*, *lilo*, white). The card shows which bolt in a picture, and the pills are always there.
- **If he hears a different colour:** he lifts that bolt, and Big Ma says "*laal na*" ✓ (not the red one) with the right colour, kindly. The child taps or says again.
- **It never blocks.** A tap on a pill or on the bolt always works too.

### 3b. Make (Big Ma's table)

**The scene:** Big Ma's work table, straight down (T).
- The cloth from the stall is spread in the middle, in its bought colour.
- Paper pattern pieces lie at the left edge of the table, unlabelled, each a different shape: the kurta's body, a cap's round crown, later a dupatta's long strip.
- The sewing machine sits top-down at the top edge.
- The customer's face (Ali) is in a round frame top right, the clinic heal games' convention. Big Ma's face is beside it, smaller; she guides.

**What you do:**
1. Ali says what he wants: "Make me a kurta" (built on *banai*).
2. Tap the pattern piece. It slides onto the cloth, and Big Ma's chalk traces round it.
3. **From L2, the choice is a tap (tap-then-track):** the sleeve has **two chalk lines**, long and short, the same colour and weight. Ali says which. **The child taps one chalk line**; the right one lights as the scissors' track. A wrong line shakes, and Ali says the asked length word again ("long!"); nothing is cut. At L1 there is one chalk line and no line tap: the track lights straight after the pattern lands.
4. Drag the scissors **along the lit chalk track** (the shared linear track; Cook's dashed-line swipe feel). Snip, snip. The piece falls away. The drag never decides anything: it only runs from the lit track's start, so where it starts can't choose a line.
5. Drag the cut piece **along the dotted seam under the machine needle** (the same track input). The machine chatters, Big Ma hums her song, and the pieces join.
6. The finished kurta folds itself and flies onto the rail. The row ticks.

**The five questions:**

| Question | Answer | Score |
|---|---|---|
| What do you do? | Tap a pattern, (L2) tap a chalk line, cut along the lit track, run it through the machine along the track. Taps choose; drags only work a tool. | 5 |
| Where is the challenge, and does the Kutchi decide it? | The garment word picks the pattern; from L2 long or short picks the line. Both lines are always drawn. | 4 |
| Where is the fun? | The snip; the offcut dropping and Simba batting it off the table; the machine's chatter; the pieces joining into a kurta. Big Ma's song, here only. | 5 |
| Where is the instruction? | Ali speaks first, then his card (the garment, then the length). Big Ma's line (cut, *kap* ✓) names the action. | 4 |
| What is novel? | **The describing word as the move.** The child makes a garment whose size they heard, and it comes back at the fitting. | 5 |

**Total: 23. Keep.**

**Level ladder:**

| Level | What it adds | Example |
|---|---|---|
| L1 | the garment, from 2 clearly different patterns (kurta's body, cap's crown); one chalk line; cut; machine | "make me a kurta" |
| L2 | the length: the sleeve's two chalk lines, long and short (two words per move); 3 patterns; numbers (two sleeves, *ba*, each a cut); "no" said last ("long, not short") | |
| L3 | other ways of saying it: "cut the long one" (*kap* ✓), Big Ma saying it for Ali, "for Ali" (*Ali lai*); 4 patterns; the card's picture blurred | |
| L4 | buttons, with amount and look-alike: "three small red buttons" from a tin of big and small buttons in red and pink (4 decoys). The placket shows **five** button spots, so the picture never gives the count; the count closes on Zafar's one count close (1 Nov: the next tool lifted, else about 1.25 s after the last tap); a fourth tap lands, and too many or too few is a miss, said again and fixed on the spot. Each button is tapped onto a spot, then a swipe round it (the built ring `stitch.js`, T3 buttons). | |

**The leak test:**
- **Reading:** the card shows the Kutchi with a speaker. The garment's picture shows only while that word is supported; from L2 there is **no picture of the finished piece** (games map). The length is never pictured, only said and written in Kutchi.
- **Matching:** the patterns are unlabelled, and their shapes don't copy the card's picture once the word is past support. The chalk lines are the same colour and weight, and differ only in length.
- **Eliminating:** a wrong pattern tap shakes the pattern; Ali names it ("a cap?") and then the asked one ("kurta!"), with no *na* (a no aimed at the child is a verdict; *na* stays for "no said last" asks). It slides back. Nothing is removed. A wrong chalk-line tap shakes the line and Ali says the asked length; the line stays. Only a right first tap ticks. The cut can't be made on the wrong line, because the track lights only after the right line is tapped: the line tap is the test.
- **Patterns:** the garment, which line is long (above or below), the side of the table and the asker are random.
- **Waiting:** neither line glows until one is tapped. The guide's free hint replays the ask; the helper card costs a bulb.
- **The blind bot:** L1 50%; L2 1 in 3 × 1 in 2 = 17%; L3 1 in 4 × 1 in 2 = 12.5%; L4 adds 1 in 5 for the button kind and the count, under 2%.

**The delight moment:** the offcut falls, and Simba's paw shoots in from the table edge and bats it away. It's a different cat gag each time: Zazu wears it as a hat; Simba sits on it. Then the machine runs and the pieces snap together.

**No speaking moment.** The hands are busy.

### 3c. Mend (two faults; the said one decides)

**The scene:** the same table, top-down.
- A family member's garment lies flat in the middle (Nana's kurta, on visit 1).
- It shows **at least two faults** at once: a torn sleeve, a button missing, later a torn pocket, a hole, a hem that is too long.
- Nana's face is top right. The needle, thread and button tin are at the edge.

**What you do:**
1. **The showing names what's there:** each fault bounces once as Big Ma names it ("the sleeve, torn", "the button"). This is what isn't on the card, as at the stall and the table; it doesn't say which is asked.
2. Nana says which fault: "my sleeve is torn" (to record).
3. Tap the fault. It lifts gently and the needle comes to it. **The picker is `js/shared/whichone.js` over the garment's parts** (the shared decoy rule), not a new engine.
4. Drag the needle along the lit track over the tear (the shared linear track, drawn as a short zig-zag). The tear zips closed.
   - **For a missing button:** the button hops from the tin onto its spot, and the child swipes round it (the built ring `stitch.js`).
5. The row ticks.

**The five questions:**

| Question | Answer | Score |
|---|---|---|
| What do you do? | Tap the fault said, then stitch along its track. | 5 |
| Where is the challenge, and does the Kutchi decide it? | Two or more faults always show, so only the said one counts (the research's fix). | 5 |
| Where is the fun? | The tear zipping shut with a satisfying "zzip"; the mended sleeve flapping like a windsock and Nana's face-circle chuckle; the button's "pling". | 4 |
| Where is the instruction? | Nana's face speaks, then the card: the part, then what's wrong. | 5 |
| What is novel? | The only game where the describing word picks **which fault** (torn, a hole, come off, too long). The clinic picks a body part; here a part of a garment, and what's wrong with it. | 4 |

**Total: 23. Keep.**

**Level ladder:**

| Level | What it adds | Example |
|---|---|---|
| L1 | two clearly different faults; one asked | a torn sleeve and a missing button; "my sleeve is torn" |
| L2 | three faults; two asked, in order; numbers; "no" said last | "first the pocket, then the buttons: two of them", then "not the sleeve" (*pela … ne poi …*). The placket shows four empty button spots for "two", so the picture never gives the count; the count closes on Zafar's one count close (1 Nov: the next tool lifted, else about 1.25 s after the last tap); a third tap lands, and a wrong count is said again and fixed on the spot. |
| L3 | other ways of saying it: "there's a hole", "the button has come off", "it's too long" (the hem: the scissors cut along the hem's chalk line, as in make). 4 faults; the picture blurred. | |
| L4 | look-alikes and amounts: the same fault on two parts (a torn pocket and a torn sleeve; left and right once recorded). A hole is patched from **the scrap tin**, which holds the offcut from make, picked by colour and size ("the small red piece"). | |

**The leak test:**
- **Reading:** the fault words are in the card's Kutchi with a speaker. No fault is drawn on the card past support.
- **Matching:** the picture can't settle it, because every garment always shows more faults than are asked. No fault is dirtier, brighter or outlined.
- **Eliminating:** a wrong tap doesn't fix or remove that fault; it stays. Only the right fault ticks, first go. At L2 the unasked fault stays visible after the round, and a new garment comes next round (never "the one left over").
- **Patterns:** the faults, their places, the garment, the customer and the order are random each round. The customer rotates: Nana, Ma, Ali, the girl.
- **Waiting:** nothing glows on the answer. The light boxes the whole garment, never a fault. The guide's free hint replays the ask.
- **The blind bot:** L1 50%; L2 1 in 3 × 1 in 2 (the order) = 17%, × the count = under 10%; L4 under 3%.

**The delight moment:**
- **A right fix:** the mended sleeve puffs up and flaps like a windsock in a little breeze, and Nana's face circle does its eyebrows-up chuckle (as the heal games do). No hand is drawn (H13).
- **A miss:** a different funny reaction each time, never a frown:
  - Nana's eyebrows shoot up and he giggles ("that tickles!" as a sound, not English);
  - Simba pounces on the loose button and rolls it back;
  - the needle does a little twirl and returns.

  Then the word again, and the child redoes it on the spot.

**No speaking moment.**

### 3d. The fitting (try on)

**The scene:** Big Ma's room at eye level, front on. The layout is written per size in §7; in short:
- **On phones:** the customer **full length, standing on Big Ma's low wooden stool**, so the hem, the sleeves, the stool top and the floor are always in frame. The rail is a **wall rail at shoulder height on the back wall**, beside the customer, never in front of them; its pieces hang down to about the customer's knee. Big Ma is at the right edge. The mirror is dropped from the phone layout and returns at the twirl as a zoom on the customer with a mirror-work frame sliding in.
- **On big screens:** the customer full length on the stool; the tall mirror in a mirror-work frame behind them; the wall rail behind, beside them; Big Ma at the right.
- **The rail** holds today's new piece (and from play 2 the mended piece), plus Big Ma's other finished pieces as look-alikes.
- **Left:** free for the cards.

**What you do:**
1. **The ask always names the garment.** At L1-L2 the customer says what they want: "I want the kurta" / "I want the cap" (*muke {garment} khape*), and from L2 with its colour and size ("I want the red kurta, the long one"). From L3 Big Ma may say it instead: "the kurta is for Ali" (on *hi {x} lai ai*; Mum confirms the form). The person alone is never the whole line.
2. Tap the piece on the rail.
3. Tap the person (the two taps; give-to once it is built). At L1 there is one person, so this second tap places and never decides; from L4 (two people) it decides too. The piece swishes on with a wriggle.
4. **If it's right:** Big Ma says *barabar!* ✓ (just right), the person turns to the mirror, twirls and beams.
5. **If it's wrong, every kind of miss has its own gag**, then the piece hops back to the rail and the child picks again:
   - **Wrong size** (from L2): the kurta is comically **too long**, pooling over the stool onto the floor with the sleeves flopping past his hands, or **too small**, stuck halfway with the hem at his waist over the undershirt. Big Ma says "long!" or "small!" (*nindho* ✓), laughing.
   - **Wrong garment:** the piece goes on comically wrong. A dupatta lands over Ali's head like a tent he can't see out of (he wobbles about, muffled); a cap drops down over his eyes. Then Ali says the asked garment's word.
   - **Wrong colour** (from L2): it goes on and fits, but Ali looks down at himself, puzzled, and tugs it; Big Ma says the worn colour (*lilo!*, the recast) and then the asked one, kindly.
6. **From L3:** "take off the cap": tap the cap's **empty hanger** on the rail, and the cap hops back onto it. Take-off never shares a target with the person tap.
7. **The end:** Big Ma lifts her camera. **Today's made piece is always in the photo:** if the round asked for something else, Big Ma slips the new piece on too before the flash (untapped, ungraded, after the ask is over), so "the person tries on what you made" holds every round. Flash, and the mirror photo slides to the book.

**The five questions:**

| Question | Answer | Score |
|---|---|---|
| What do you do? | Tap the piece, then the person (L3: tap a piece's empty hanger to take it off). | 5 |
| Where is the challenge, and does the Kutchi decide it? | The garment word at L1; colour, garment, size and whom from L2: the rail always holds look-alikes of each, and the made piece is the ask at most half the time. | 5 |
| Where is the fun? | The swish-on; a gag for every kind of miss (the too-long kurta, the dupatta tent, the puzzled look-down); the twirl; the photo. | 5 |
| Where is the instruction? | The customer (or from L3 Big Ma) speaks first, then the card (the piece; from L4 the person). | 5 |
| What is novel? | **The ending Zafar asked for:** the person tries on what you made. The only place a size word has a visible, funny consequence on a body. | 5 |

**Total: 25. Keep.** It's the mode's identity, Dress up's 5a, rebuilt onto the kit. Dress up 5a's change of mind (its *na* row from L2) is the built form of this design's "no said last" at L2.

**Level ladder:**

| Level | What it adds | Example |
|---|---|---|
| L1 | one person; the garment word decides; 2 on the rail: today's made piece and one of Big Ma's pieces of **another garment for the same person, in the same colour** (so colour can't decide). The ask is the made piece in at most half the rounds. | Ali; a red kurta (made today) and a red cap (Big Ma's): "I want the cap" or "I want the kurta" |
| L2 | colour plus garment (two words per move), and a size; 3 on the rail: the same kurta in another colour, the same colour in another garment or the other length; "no" said last | "the red kurta, the long one, not the green one" |
| L3 | other ways of saying it: "the kurta is for Ali", "Ali, put it on", "try it on"; take off by voice ("take off the cap"); 4 on the rail; the picture blurred | |
| L4 | two people and look-alikes split by size: a big red kurta and a small red kurta, "the big kurta is for Nana" (*wadho* ✓ in lines, on *hi nana lai ai* ✓), the small one for Ali; amounts (two caps, *ba*); 5 on the rail | |

**The leak test:**
- **Reading:** the card is Kutchi with a speaker. A piece's picture shows only while its word is supported (right picks while supported move the word's ladder), and from L2 never the finished made piece.
- **Matching:** at L1 the decoy is the same colour, so the colour can't match; past support there is no picture to match. The rail always holds another of the asked garment in a different colour, and the asked colour in a different garment, from L2. From L2 there is a same-colour kurta in the other length.
- **"I just made it":** fails. The made piece is the ask at most half the time (otherwise one of Big Ma's pieces, or from play 2 the mended piece when its owner is the person), so a child picking from memory of make wins 50%, the same as blind.
- **Eliminating:** a wrong pick goes on, shows its gag and comes back to the rail. Nothing is removed, and only the right first pick ticks.
- **Patterns:** the rail order, the person, the asked piece and whether the made piece is asked are random. At L4 who gets which size is said, not fixed (sometimes Nana's is the small cap).
- **Waiting:** no piece or person glows. *Barabar* is said only after the right pick. The guide's free hint replays the ask.
- **The blind bot, recounted on the garment word:** L1 50% for blind, for memory-of-make and for a listener who hears only the person (one person, so the person carries nothing); only the garment word beats 50%. L2 1 in 3 = 33% per piece, about 11% over the round's two asks; L4 1 in 5 pieces × 1 in 2 people, under 5%.

**The delight moment:**
- **On a miss:** the too-long kurta, with the sleeves flapping like a puppet's, is "kind of funny" and teaches *long*; the dupatta tent and the cap over the eyes teach the garment; the puzzled look-down teaches the colour.
- **On a right pick:** the twirl in the mirror; always pleased, never judged (the Toca Tailor pitfall).
- **The opening joke repeats each visit:** Ali stuck in his old, too-small kurta, arms up and his voice muffled, until Big Ma tugs it free.

**The speaking moment** (from visit 2, ungraded shadowing with a set of two, marked as such):
- **Watch:** on visit 1, Ali asks Big Ma "how do I look?" (to record), and she answers "you look very nice" (*bo fine*, to record as its own line).
- **Handover:** from visit 2, Nana turns to the child with the same question. The set is *bo fine* or *barabar*, with pills. Both are right, and he beams at either.
- **It's a play action, not a gate.** The photo comes whether or not the child speaks.

### 3e. Going out (dress for the weather; visit 1, from the third play)

Kept in the first set, as the 1 Nov scope says: Dress up 5b, cut down to the fitting's last beat, about 30 s.

**What you do:**
1. Nani's face appears through the doorway and calls the weather: "it's raining" (*warsaad* in engine; the whole line to record) or "it's cold" (to record). Her card pops up: the weather word.
2. Two carry items hang by the door: the shawl and the umbrella. Tap one. It goes onto Ali (one person: no second tap).
3. Ali steps out of Big Ma's door.
   - **Right:** rain patters on the umbrella and he splashes happily; or he snuggles into the shawl in the cold wind.
   - **Wrong:** the comic soaking (the shawl dripping, his hair flat, a puddle round his feet) or the shivering teeth-chatter under an umbrella in the wind. He comes back in, Nani says the weather word again, and the child picks again. Nothing frowns.

**Level ladder:** L1 two items, one weather. L2 three items and a colour ("the red shawl"). L3 the child looks out of the window and calls the weather to Ali (speaking, closed set, from Dress up 5b L3), once the weather words are recorded. L4 two people, two weathers in order (first rain, then cold).

**The leak test:** the card shows the weather word with a speaker, never a picture of the item; both items always hang; a wrong pick removes nothing; the weather and the items' sides are random; nothing glows. Blind: L1 50%, L2 33%.

**Five questions:** taps only (5); the heard weather decides (4); the soaking (5); Nani through the door, then the card (4); weather → clothing reasoning lives only here (4). **22, keep** (Dress up 5b's own score).

**The overlap with pack the bag** (weather → what to take) is real, and is put to Zafar as a reason, not decided for him (§10, question 2).

### 3f. Kept for later visits (from Dress up, not removed)

| Game | Where it goes | Why later |
|---|---|---|
| **Bandhani** (tie, dip, reveal; T9) | visit 2 or 3 make: "three dots, red" | needs dots, dye and colour mixing words |
| **Block print** (T10) | later make: "four flowers on the hem" | needs motif words |
| **Iron it** (T5) | later make, first then | the order game |
| **Embroider** (T4, built) | later mend: a motif covers a stain | needs part and motif words |
| **Bangles** (T15, built) | the fitting's L4 accessory for Ma | needs the numbers recorded |
| **The pedal** (T2 + T17) | later make: the machine's count | numbers |
| **Measure up** (2a), **Bring in** (1a) | parked: the clinic owns tapping the part named and the bench | overlap |

Each later-visit game keeps its archived design and its "five questions" scores (Dress up Q.4). It comes in only when its words are recorded.

---

## 4. The child's first-ever round, screen by screen

The first-ever play is **tiny**: the short path the design already has for "the shops came first". The cloth is on Big Ma's table; door → the joke → make → the fitting → the book. Two controls (the track, the two taps), two play screens (the table, the room), two new words (kurta, cap), about two minutes. **The first round is the tutorial.** §4b is the second play, where the stall and the mend arrive, each with its own showing; §4c is the third, where Going out arrives.

### 4a. The first-ever play (every stage at L1)

1. **The door.** Nani at her door, on a sunny sky:
   - She says the weather, then the day as short lines, each with its English beneath (the door's exception). One line is "Ali has grown! His clothes are small."
   - A thought bubble shows Big Ma's room. The child taps *Ha!*.
2. **Walking in: the opening joke.** Big Ma's room. Ali is wriggling into his old kurta: stuck, arms up, muffled. Big Ma laughs, "*nindho!*" (small ✓), and tugs it off. It is about 6 s, and a tap skips it. The red cloth is already on her table ("Big Ma has red cloth": she pats it, *laal* ✓).
3. **Make: the table, shown once.**
   - Top-down: the red cloth spread, two pattern pieces at the left edge, the machine at the top. Ali's face is top right, Big Ma's beside it.
   - Showing what isn't on the card: each pattern bounces once as Big Ma names it (kurta, cap).
   - Ali says "make me a kurta" (or a cap; random). The card pops up (the picture while supported) and flies into its row.
4. **The taps and the track.**
   - The child taps the kurta pattern. It slides onto the cloth, and the chalk traces round it (one line at L1: no line tap).
   - The scissors' track lights in gold. **The first-time showing of the track (the day's first new control):** the lit box shows the scissors at the track's start and the scissors nudge a little way along it by themselves; no finger.
   - The child drags along the track: snip, snip. The piece falls, and **Simba's paw bats the offcut off the table.**
   - Then the seam's dotted track lights under the machine (the same control, no new showing). The child drags: the machine chatters, and Big Ma hums. The kurta joins, folds and flies to the rail. Tick.
   - If the cap pattern is tapped: it shakes, Ali says "a cap?" then "kurta!", and it slides back.
5. **The fitting.**
   - The room: Ali full length on Big Ma's low stool, Big Ma on the right, the wall rail beside him holding the new red kurta and Big Ma's red cap.
   - **The first-time showing of the two taps (the day's second new control):** each piece bounces once as Big Ma names it (kurta, cap), then the lit box moves rail → Ali once.
   - Ali: "I want the cap" (or the kurta; the made piece is asked at most half the time). The card pops up (the cap while supported) and flies into its row.
   - The child taps the cap, then Ali. It swishes on. Big Ma: *barabar!* ✓. **Ali turns, twirls and beams** (on phones, the mirror-frame zoom).
   - If the kurta is tapped when the cap was asked: it goes on and Ali looks down, puzzled ("kurta?"), then says "cap!"; it hops back. The child picks again.
6. **The photo.** Big Ma slips the new kurta on too (if it wasn't the ask), lifts her camera: flash. The photo slides off towards the book.
7. **The end.** It ends the moment the job is done, back where it began: Ali in his new kurta, with "aah" and the word card (kurta, red).
   - The shared two-page end screen follows: time, ticks, the bulb, then the words with English for the grown-up.
   - Then the evening book, in the engine's noun phrases: "Ali's kurta", "red cloth" (`js/day/book-games.js`). The past-tense sentences replace them once Mum records them.

**Length:** about 2 minutes. The day-level blind bot: make 50% × the fitting 50% = 25%; past support, only the garment words beat it.

### 4b. The second play: the stall and the mend arrive

The second play is the whole first-set day without Going out. The make and the fitting are as in 4a (no showings now). New:
1. **The door** adds "Nana's kurta is torn."
2. **The cloth stall, with its showing.** Two bolts (red, green), the seller, Big Ma at the right edge in her going-out clothes. Everything is dimmed except one lit box round the bolts; the seller names each as it bounces: "*laal*", "*lilo*". Big Ma: "I want the red one" (watched exchange). Her card pops up and flies into its row. The child taps red: the bolt thumps open in a puff of lint; tick, *shabash* ✓. A wrong tap: the green bolt wobbles, the seller says "*lilo*", Big Ma repeats "*laal*". Big Ma pays herself unless the child has met pay at the shops. **No new control:** it is a tap.
   - If the shops day came first, the stall is skipped and the shops' cloth is on the table, as in 4a.
3. **Mend, with its showing (the play's one new control is the needle's zig-zag, the same track drawn differently, so it gets one nudge-showing).** Nana's kurta flat, a torn sleeve and a missing button. Each fault bounces as Big Ma names it ("the sleeve, torn", "the button"). Nana: "my sleeve is torn"; card, row. Tap the sleeve; the needle comes; drag the zig-zag: zzip, zzip. **The sleeve flaps like a windsock and Nana's face circle chuckles.** Tick, *shabash*. A wrong tap: Nana's eyebrows shoot up and he giggles, Simba pats the button tin, and Nana says "sleeve" again.
4. **The fitting's rail** now may also hold Nana's mended kurta when Nana is the person.
5. **The book:** "red cloth", "Ali's kurta", "Nana's sleeve".

**Length:** about 4 minutes. Each stage under 90 s.

### 4c. The third play: Going out

As 4b, and the fitting ends with Going out (3e): Nani through the doorway calls the weather, the child taps the shawl or the umbrella, and Ali steps out. Its showing: the two items bounce as Big Ma names them. About 30 s more.

**Free play** dips straight into any open stage from Big Ma's room.

---

## 5. Later visits and harder versions

**The same day, harder.** Each stage climbs its own L1-L4 (§3). The customers rotate so nothing is learned by pattern:

| Visit | Make (for whom) | Mend (whose) | New words | New game from the pool |
|---|---|---|---|---|
| 1 (over its first three plays, §4) | a kurta or a cap for Ali | Nana's kurta (from play 2) | ~6 for play 1, ~30 in all (§1) | Going out (play 3) |
| 2 | a dupatta for Ma; a cap for Nana | Ali's shirt (a hole: the offcut patch) | ~10 (take off, a hole, come off, hem, blue, yellow, pink, trousers, new, old); white joins the stall's art | Bandhani (the dupatta's dots); the stall's and the mirror's speaking handovers |
| 3 | the girl's kurta (long sleeves) | Ma's trousers (too long: the hem) | the past-tense book lines, if not in round 1 | Iron it (first, then) |
| 4 | a set for two people | two garments | left, right; the motifs | Block print; Embroider; Bangles at the fitting |

**Free play:** any open stage at the child's level, from Big Ma's room. **"Chooses colours" as expression after effort** (Khan Academy Kids' rule) reuses Find it 3a's ungraded gift tap, with no new stage and no new art: at the free-play stall the seller holds out the bolts, the child taps **any** one, the seller says its colour and Big Ma takes it home. The word is still heard; nothing is graded.

**Cut from this design to `docs/ideas.md`** (later-visit material; added in the consistency pass, 1 Nov, as rows 95 and 96): the cushion cover for Nani's sofa (new art and a new ungraded stage), and the role reversal (the child tells Ali which piece to try on, on the shared "say it, Ali acts").

**Grown-up level picker:** any level, as everywhere.

---

## 6. What it reuses, and what's new to build

**Reused, with each piece's real state:**

| Piece | From | State | Use |
|---|---|---|---|
| The stall: look-alikes, "the big one", "not the red one", the size rule, the blind-odds generator, the bot | Find it 4b *Which one?*, whose colour skin is this stall (`find-it.md`: L11, F63); `js/find/` (engine.js, gen.js, round.js, blind.js, bot.js), `data/find.json`; `shops.md` row 7 | **greybox on Find it's own engine**: needs Find it's rebuild onto the kit first | 3a, as its colour skin |
| Pay | `docs/game-design/modes/count-to-a-number.md` | **designed only** (Sprint 10) | 3a, once the shops have taught it |
| The linear track (cut, seam, needle) | generalises Cook's dashed-line fold swipe, `js/cook/mechanics/fill-fold.js` (the module `stitch.js` was built on) | **new**, into `js/shared/` | 3b, 3c |
| The ring stitch (buttons) | `js/dress/mechanics/stitch.js`: a swipe round a dashed ring, with a level-set tolerance | built greybox; moves onto the kit | make L4, mend's buttons |
| The table pool | `js/dress/games/table.js`, buttons, embroider, bangles | built greybox | make L4, later visits |
| Wear, check, change; the rail; layered clothes on a body | `js/dress/mechanics/wear.js`, `check.js`, `change.js`; `js/dress/rack.js`, `doll.js`, `look.js`, `grade.js`; `js/dress/games/fitting.js`; `data/dress.json` | **greybox on `js/dress/core.js`**: a rebuild onto the kit, not a reskin | 3d |
| The change of mind ("no said last" at the fitting) | Dress up 5a's *na* row from L2 (`docs/archive/modes/dress-up.md`) | designed, in the greybox | 3d L2 |
| Close-up with the asker's face in a corner | the clinic's heal games (`js/clinic/heal/`, `clinic.md` §B), with decision 92's rule (a face circle only where the person is off screen) | built | 3b, 3c |
| The shared decoy rule, tap the part named | `js/shared/whichone.js` (and the clinic's diagnosis, `js/clinic/stages/`) | built | 3c's fault picker; the fitting until give-to lands |
| Tap the thing, then the person | give-to (new in `party-gifts.md`), lifted from Snap's `js/snap/mechanics/handin.js` | **not built** | 3d (the sewing lifts the second tap itself if it gets there first; the party reuses it) |
| Order card, request pop-up, guide, bulb, onboarding, focus light, say/speech, word card, results, tally, faces, sfx | `js/shared/` | built | every stage (non-negotiable 6) |
| Door, book, the day runner | `js/day/` (`door.js`, `book.js`, `book-games.js` for the book line), `data/days.json` | built | the day |
| Leak bot strategies | `js/dress/bot.js`, `js/find/bot.js` | built greybox | every stage, plus a day-level rate and the memory-of-make strategy |

**New to build:**
1. **The linear track** (medium, shared). A lit path drawn from data (a straight line, a dotted seam, a zig-zag), a drag that follows it inside a level-set tolerance (at least 28 px at L1, as `stitch.js`), the tool sprite riding the finger, the first-time nudge-showing. It never decides; the tap before it does. One mechanic for cut, seam and needle.
2. **The fault picker** (small). `whichone` over a flat-laid garment's N fault slots (part × fault kind), drawn from data, with the "two faults always" rule as a generator check. One fault is asked, or two in order. It ticks only the right fault, first go.
3. **The miss gags** (small). On a wrong size, garment or colour, the worn layer swaps to its gag sprite (real art) with its reaction, then hops back.
4. **The sewing stage glue** (small). The cloth's colour and size are carried from the stall or the shops' log to the table; the made and mended pieces to the rail; the photo and the offcut to the log; the made piece into the photo.
5. **The fitting onto the kit** (medium). Dress up's greybox runs on its own core (`js/dress/core.js`, its own stubs). Moving `wear`, the rail, the ring `stitch` and the fitting onto the shared host, card and engine is the rebuild the games map names.
6. **Going out's beat** (small). Two carry items, one tap, the step-out reaction (Dress up 5b's logic, greybox, cut to the beat).
7. **Data:** `data/sewing.json` (or `data/dress.json` reshaped): garments, faults, patterns, rail sets, gags, the level ladders, the customers and which play opens each stage.

**The honest size and order** are in §0: Find it's rebuild and pay (others' work) gate only the stall; the sewing's own three build slices are the track + make + the fitting (slice 1), mend + Going out (slice 2), the stall (slice 3).

**Where it lives:** a lab page first (`lab/sewing.html`), checked at the four sizes plus 915x275. Then the stages are wired into the day's list.

---

## 7. Art, and the layout at each size

**Cameras (art bible §3, one per scene):**

| Scene | Camera | Notes |
|---|---|---|
| The cloth stall | E, customer's side, horizon at about 55% | the shops' stall. Bolts in F view, standing on end. One art set for both days. A calm, modern market with one or two Kutch or East African nods (`shops.md`: a mirror-work trim on the stall). |
| Big Ma's table (make, mend) | **T, exactly overhead** | The table fills the frame edge to edge. Cloth, patterns, garments, tools and the machine are all straight down: no back wall, no ¾ tilt (the chai pan's lesson). Faces sit in round corner frames, as in the heal games (clinic decision 92: a circle only where the person is off screen). |
| Big Ma's room (the opening joke, the fitting, Going out) | E, front | The person full length on Big Ma's low wooden stool, the floor in frame; the wall rail at shoulder height beside them in F view; the mirror behind on big screens only; the door at the side for Going out |

**The art it needs** (one paste block for Zafar's ChatGPT run, backgrounds locked first):
1. **Big Ma's character sheet, the first item of the run,** drawn from the photo notes already in `cast.md` (`bigma-01` to `bigma-03`): very elderly and small; dark hair, greying, pulled back under a soft, plain, muted or dark headscarf; thin rectangular metal glasses; a gentle, knowing smile; at home a soft cotton house dress (maroon with a white paisley print and lace trim) and thin gold bangles; going out (the stall) a black headscarf and a black abaya with embroidered trim. 3 poses (three-quarter, front-facing, laughing), plus her camera pose and her face cut-out. Zafar signs the sheet off before any scene uses her (cast.md's sheet-first rule). A real likeness: no prompt invents her look.
2. **Backgrounds:**
   - Big Ma's room (E; day light; the low stool; the wall rail; the door);
   - Big Ma's table (T; pale oak, a cutting mat corner, a brass pin tin as the one cultural nod);
   - the cloth stall (E; shared with the shops).
3. **Bolts (F):** red and green for visit 1; white, blue, yellow and pink with visit 2.
4. **Cut lengths (F):** a big and a small piece, shown as two folded lengths in the seller's hands, per colour.
5. **Flat-lay garments (T):** kurta (Ali's size, and adult), cap; shirt, dupatta, trousers with visit 2. Visit 1 in red and green only.
6. **Fault overlays (T):** a torn sleeve, a missing button with thread ends (visit 1); a torn pocket, a hole, a hem too long with a chalk line (visit 2). Each also in a mended state.
7. **Patterns and tools (T):** paper pattern pieces (kurta body with both chalk lines on the sleeve, cap crown; the dupatta strip later), scissors, a needle with thread, the button tin (big and small, red and pink buttons, visit 2), chalk, the sewing machine top-down.
8. **Rail pieces (F, on wooden hangers)**, which the fitting needs from L1: Ali's kurta and cap, an adult kurta, in red and green, in both lengths for the kurta; an empty hanger (take-off). About 10 for visit 1.
9. **Worn layers (E)** on each customer's base body:
   - **The base:** a plain modest undershirt and trousers, never bare.
   - **Visit 1 layers:** Ali's kurta in red and green × right size, too long and too small (6); the cap right and over his eyes (2); Nana's kurta mended (1).
   - **Visit 2+:** Ma's dupatta, the girl's kurta, white recolours.
10. **Reactions and gags:** Ali stuck in the small kurta (one sprite); the dupatta tent (1); the puzzled look-down (a face and head sprite over the worn layer, 1); the mirror twirl (3 frames per person); Going out: the umbrella in the rain, the shawl in the cold, the soaking, the shiver (4); the mended sleeve flapping like a windsock (T, 2 frames; no hand drawn, H13); Nana's face-circle chuckle (the existing face set).
11. **Going out's items (F):** the shawl and the umbrella on the hooks by the door.
12. **Simba and Zazu:** the existing cats, plus a paw reaching in at the table edge (T).
13. **Coins:** the shops' set (no digits).

**Rough count: about 80 sprites for visit 1** at decision 14's "no code tint", with visit 1 cut to red and green (red the bought colour, green the decoy). Recolours in white, blue, yellow and pink come with visit 2. Big Ma, the stall and the base bodies are shared with other days. If 80 is too many for one run, the run splits: the first-ever play's set first (Big Ma, the room, the table, the kurta and cap in red, the rail, the gags; about 45), the stall and the mend second.

**Modesty (non-negotiable 9):**
- Every garment covers arms to the wrist or elbow, and the body to below the hip. A kurta is never cropped short.
- The too-small gag shows sleeves ending at the forearm and the hem at the waist, **over the undershirt**, never bare skin.
- Dupattas sit over the shoulders; the dupatta tent covers, never reveals.
- Big Ma always wears her headscarf.

**The layout.** The fitting's rule, at every size: **the hem, the sleeves, the stool top and the floor are never under a rail, a card or the crop.** The customer is always full length; the room comes out of the scenery and the mirror, never out of the body.

| Size | Stall | Table (make, mend) | Fitting |
|---|---|---|---|
| **740x320** | cards left (about 22% wide); 2-5 bolts in one row at mid-height, each at least 90 px tall; the seller cropped at the chest, in the middle; Big Ma at the right edge, cropped at the waist; the counter is the bottom 20% | the cloth or garment centred, at about 75% of height; patterns in a column at the left of the table, right of the cards; the machine as a strip at the top edge; faces in 56 px circles top right, over bare table, never over the work | the customer **full length on the low stool** in the middle, head about 10 px from the top, the stool's feet and about 20 px of floor at the bottom (about 270 px tall); the **wall rail at the customer's shoulder height**, between the cards and the customer, pieces at least 80 px and hanging no lower than the customer's knee; up to 3 pieces there; from L3 (4-5 pieces) a second short wall rail between the customer and Big Ma; Big Ma at the right edge, cropped at the waist; **no mirror** (the twirl is a zoom with a mirror-work frame sliding in) |
| **915x275 (Z Fold)** | as 740x320, with the bolts shorter and wider; the seller is a face and shoulders | the garment at 80% of height; patterns move to a row under the cards if there are more than 3; faces in 48 px circles | the customer full length on the stool, about 235 px; the stool lowered to a step so the body keeps the height; the rail as at 740x320, pieces at least 70 px, the extra width giving room for 4 on one rail. **The too-long gag reads by the hem spilling over the step onto the floor and the sleeves past the hands; the too-small by the hem at the waist over the undershirt.** Both are clear of the rail and the crop. |
| **1280x665, 1920x1080** | the full stall, the seller to the waist, Big Ma full height at the right | the whole table with the machine fully in frame | full body on the stool; the mirror behind; the wall rail beside the customer; room to the left for the cards |

**Layout rules:**
- Nothing goes over a face, and bubbles go into free space.
- On phones, items and faces stay big; the room comes out of the scenery. At the fitting the body is the item.
- The cog is the only button on the play screen.

---

## 8. What it borrows from other games

| Game | The mechanic borrowed | Where |
|---|---|---|
| **Toca Tailor** (Toca Boca) | the length chosen per garment; the fitting as the ending. **Not** its disapproving faces (Common Sense flags them). | make's long or short line; the fitting's always-pleased twirl |
| **Sago Mini World** (dressing) | the giggle on the moment of placement | the swish-on wriggle |
| **Good Pizza, Great Pizza** | the order is the puzzle, and the customer's reaction is the grade | the fitting's *barabar* and the size gags |
| **Cooking Mama: Cuisine!** | one gesture per step, fixed across levels | cut, seam and stitch: each one track swipe |
| **Dr. Panda Home** | a chore with a clear finished state | the kurta folding itself onto the rail |
| **Toca Town** (carry it home) | things made or bought in one place turn up in another | cloth from the shops; Ali's kurta on the party day; the offcut patch |
| **Pok Pok Playroom** | learn a control by seeing it react once | the first-time showing of each track |
| **Lingokids** (dress-up) | named item, put it on, hear the word again | the fitting's L1 |
| **Bluey: Let's Play** (dress-up room) | a wrong outfit becomes the joke, worn | the too-long and too-small gags |
| **"Sewing Games Fashion Dress Up"** (App Store; voiced step guides) | cut, then machine, then finish, each step narrated | make's three steps with Big Ma's line per step |
| **The clinic's heal games** (ours) | a close-up with the asker's face in a corner; each miss a different funny reaction | make, mend |

The App Store listings are marketing, not reviews; Toca Tailor's Common Sense review is the credible source.

Sources: [Toca Tailor, Common Sense Media](https://www.commonsensemedia.org/app-reviews/toca-tailor); [Toca Tailor, Gamezebo](https://www.gamezebo.com/reviews/toca-tailor-review/); [Toca Tailor Fairy Tales, The Horn Book](https://hbook.com/story/toca-tailor-fairy-tales-app-review); [Sewing Games Fashion Dress Up, App Store](https://apps.apple.com/app/id6443660210); [Little Tailor, AppFollow](https://appfollow.io/ios/little-tailor/1485832927?country=us).

---

## 9. The lessons checklist

**1. The heard word decides.** Passed, with one exception: the recording gate.
- The leak test is written per stage, and the bot rates are in §3.
- **The deciding words and their recordings:**
  - Recorded today: red, not the red one, small, buy the big one / small one, just right, this is for Nana, and then, cut, yes and no.
  - In engine: big, green, dupatta, the numbers, first, rain, the "I want the {x}" frame.
  - **The fitting's L1 rests on the garment word,** not on the person: the ask is "I want the kurta / the cap", the decoy is the other garment in the same colour, and the made piece is the ask at most half the time (memory of make wins 50%, as blind).
  - **Exception: the clothes, length and fault words are all to record.** The game is gated on the visit 1 Mum round (§1). Until then it plays only in the lab, and the bot reports the reader's rate on placeholders separately.
- **Ticks:** only the right item, first go.
- **The open need:** always at least two faults, both chalk lines, look-alikes on the rail, two carry items at the door.
- **The stall's data check:** never teaching with fewer than two recorded colours; the bot reports the placeholder rate as its own line.
- **Two words per move from L2:** colour and size, garment and length, fault and order, piece and person.
- **Our own words, not just numbers:** numbers decide only make L4 and pay.

**2. Onboarding.** Passed, after the critique.
- **The first-ever play is tiny** (§4a): door → joke → make → fitting → book, about two minutes, two new controls (the track, the two taps), two play screens, two new words.
- The stall and the mend arrive on the second play (the stall adds no control; the needle's zig-zag gets one nudge), Going out on the third. Pay's first-time showing never happens here: Big Ma pays until the shops have taught it.
- One lit box, with the rest dimmed; no finger and no flying ghost.
- What isn't on the card is shown at the start of each new stage (the bolts, the patterns, the faults, the rail, the carry items, each named).
- All choices are taps. Drags happen only along a lit track, and never decide.

**3. Instructions.** Passed.
- The asker is on screen and speaks first: Big Ma at the stall, Ali and Nana in the corner frames, Big Ma at the fitting.
- The card never changes, and the guide box says the step.
- **The exchange is modelled first:** Big Ma and the seller at the stall; Ali and Big Ma at the mirror.
- Replays say only what's left. One line per moment, with no voices overlapping: the cat gags are silent sound effects.

**4. Pacing.** Passed.
- No Done and no Next. Tap skips. The guide's free hint comes at 7, 9, 11 and 13 s; only the helper card costs a bulb (the rulebook's split).
- Counts close on Zafar's one count close (1 Nov): the natural next thing, else about 1.25 s after the last tap; never at N.
- No timers in make, mend or the fitting.
- Nothing leaves before it's asked.
- The ask is repeated every few seconds for non-readers, as the guide's replay.

**5. Feedback and the end.** Passed.
- A shake and the word, redone on the spot.
- Each miss has its own gag: the bolt wobble, the shaking chalk line, Simba, Nana's eyebrows, and at the fitting one per kind of miss (size, garment, colour), the soaking at the door. No *na* is aimed at the child.
- Rows tick when the step closes.
- It ends back where it began, with something served: Ali in the kurta, "aah", the word card.
- The shared two-page end screen.

**6. Layout.** Passed on paper (§7), after the critique; to be checked at the five sizes in the lab. At the fitting the customer is always full length on the stool, so the hem, the sleeves and the floor are never under the rail or the crop; the mirror is dropped on phones. Faces never sit under work or bubbles. The left is kept for the cards.

**7. Art and camera.** Passed on paper.
- One camera per scene, with the table exactly overhead.
- No code drawing: all faults, gags and recolours are real art.
- Items in the plaster style; contact shadows on resting things only.
- Calm faces and gentle zooms.
- Two poses per speaker; one paste block, backgrounds first; Big Ma's sheet first, from her photo notes in `cast.md`; no reference sheet of another real person attached to her scenes.

**8. Speaking.** Passed. The stall's colour turn is handed over only once three colours are recorded (a closed set of 3, watched first in family voices). The mirror's *bo fine* is ungraded shadowing with a set of two, marked as such. Neither is a gate, and there are no quizzes. Role reversal is cut to `docs/ideas.md`.

**9. Levels.** Passed. Each stage follows the rulebook's L1-L4, and every L4 is its own (buttons, the scrap patch, two people by size). Levels change the words, never the gestures.

**10. Words.** Passed, gated.
- Every line is built from recorded frames. Each new line is listed in §1 for Mum, including the day's glue (Nani's door lines, the seller's price, Big Ma's sew and mend lines, the mirror's answer, the book's past tense). Where the engine can't say it (the past tense), the gap is reported and the engine's noun phrases stand in.
- Every deciding line is Mum's or Masi's take; Zafar's wife records only the song.
- Things are named as they are: cloth at the stall, the kurta once made.
- Every count and colour said is written on the card.
- 2-3 new words a play; the O-ID table (§1) shows each heard 3+ times in 2+ stages, except an unasked fault, which counts as met, not taught.

**11. Culture.** Passed.
- Modest cuts throughout (§7). No religious markers; the old Eid morning beats are not used.
- No sweets: the reward is the twirl and the photo.
- Nothing a child could copy and get hurt by: the scissors and needle move along tracks by themselves, never in a drawn hand, and Big Ma's line says they are hers.

**12. Fun.** Passed.
- The hands are busy at every step.
- **The "kind of funny" moments:** the too-long kurta, Ali stuck in the old one, Simba's paw.
- **The gestures that feel good:** the snip, the machine's chatter, the zip of the tear.
- **Contrast:** long and short, big and small.
- Nani's or Big Ma's asks give the toy a goal, and the photo and offcut go to the book.

**13. Mistakes made twice.** Watched:
- The "two faults always" rule and the stall's "two recorded colours" rule are data checks, not just written.
- Every level is designed here.
- There are no open questions left for the builder: how the length line is chosen (a tap, then the track), what every kind of fitting miss does, and what the book says are written; §10 decides the rest.
- No art is reused from the old storybook set.

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, the reason, and the answer assumed. Answer "yes to all except …".

**Answered by Zafar (1 Nov: the recommendations are fine):**

1. **Make, then mend: Zafar, 1 Nov, the recommendations are fine** ("make something, then tweak"). The opening joke (Ali stuck in his old kurta) needs a new kurta straight after it, and the made piece is then fresh for the fitting.
2. **Going out stays in visit 1** (his scope), as the fitting's last beat from the third play: Nani calls the weather, the shawl or the umbrella, Ali steps out, about 30 s. **Zafar, 1 Nov: fine.**

**Assumed yes:**

3. **The first-ever play is short:** door → the opening joke → make → the fitting → the book, about 2 minutes, two new controls. The stall and the mend arrive on the second play, Going out on the third. *Reason:* the first-ever session is tiny; 3-5 new words a round. *Assumed:* yes.
4. **The cloth stall is one stage shared with the shops day,** and it is Find it 4b's colour skin. If the shops came first, the sewing day starts at Big Ma's with that cloth; otherwise the stall opens the day from the second play. On the first-ever play the red cloth is already on Big Ma's table. *Reason:* "the sewing takes its cloth from the shops", without making the child buy twice. *Assumed:* yes.
5. **Big Ma pays at the stall until the child has played pay at the shops.** *Reason:* the sewing never teaches a new number or a new control that belongs to the shops. *Assumed:* yes.
6. **The reason for the day:** Ali has grown and his clothes are small; the opening joke is Ali stuck in his old kurta. *Reason:* it motivates "make", teaches small (✓), and is the same joke each visit. *Assumed:* yes.
7. **The fitting's ask always names the garment:** "I want the kurta" (*muke {x} khape*) at L1-L2, "the kurta is for Ali" from L3; at L1 the decoy is another garment in the same colour, and today's made piece is the ask at most half the time. The made piece is always in the photo. *Reason:* the person alone decides nothing with one person on screen, and "I just made it" must not win. *Assumed:* yes.
8. **Make's length choice is a tap on the chalk line, then the track.** A wrong line shakes and Ali says the length word. *Reason:* "a tap chooses"; the drag never decides. *Assumed:* yes.
9. **Every kind of fitting miss has its own gag:** size (too long, too small), garment (the dupatta tent, the cap over his eyes), colour (the puzzled look-down, Big Ma's recast). Always pleased on a right pick. *Reason:* "kind of funny", and the Toca Tailor verdict pitfall. *Assumed:* yes.
10. **The phone fitting:** the customer full length on Big Ma's low stool, the rail on the back wall at shoulder height beside them, no mirror on phones (the twirl is a zoom). *Reason:* the too-long gag must be seen on his Z Fold. *Assumed:* yes.
11. **The book uses the engine's noun phrases** ("Ali's kurta", "Nana's sleeve", "red cloth") until Mum records the three past-tense sentences. *Reason:* non-negotiable 2. *Assumed:* yes.
12. **Mend always shows at least two faults, and only the said one counts;** the unasked fault stays visible, and the next round has a new garment. The showing names each fault. *Reason:* his rule, and the research's fix. *Assumed:* yes.
13. **No timers anywhere in the sewing** (only pay's own, at the shops' level). *Reason:* craft, and listening over speed. *Assumed:* yes.
14. **Tools move along lit tracks:** no hands drawn, no free drags, no press-and-hold. One new shared linear track serves cut, seam and needle. *Reason:* H13 (no hands), the rulebook, and hold-to-pour didn't land. *Assumed:* yes.
15. **Dress up's other table games** (Bandhani, Block print, Iron, Embroider, Bangles, the Pedal) are kept as later-visit content, unchanged; Measure up and Bring in stay parked (the clinic owns them). *Reason:* non-negotiable 1. *Assumed:* yes.
16. **"Chooses colours":** the heard colour decides (the asker chooses); the child's free choice is Find it 3a's ungraded gift tap at the free-play stall. The cushion cover and the role reversal go to `docs/ideas.md`. *Reason:* the leak test needs the word to decide; his wish for choice is kept with no new stage or art. *Assumed:* yes. He may instead want the child to pick Ali's colour on visit 1; that would be an ungraded stage.
17. **The clothes set:**
    - Visit 1: kurta and cap; Nana's kurta to mend; the shawl and the umbrella at the door.
    - Visit 2: shirt, dupatta (*pacheri*) and trousers.
    - No frocks or skirts until the family says what the girls wear.

    *Reason:* modest family dress; his 24 Sept decision 15 (*topi* or *kofia*) is still open. *Assumed:* yes. Mum confirms the words.
18. **Colours for visit 1: red ✓ and green** (art and asks); white is recorded in the same Mum round and joins with visit 2, when the stall's speaking handover (a set of three) starts. Blue, yellow and pink come later. Black isn't used (*kari* is tea's black). *Reason:* red is recorded; green is in the engine; two colours keep the art near 80 sprites. *Assumed:* yes.
19. **Make and mend use the clinic's convention:** a top-down table with the asker's face in a corner frame (clinic decision 92: a circle only where the person is off screen). *Reason:* one camera per scene, and the asker still on screen. *Assumed:* yes.
20. **No code tinting of garments:** every colour is a real recolour from the ChatGPT run. *Reason:* "draw nothing in code". It costs more sprites (about 80 for visit 1) but keeps the plaster look. *Assumed:* yes. He might accept tint masks to save art.
21. **Speaking:** the stall's colour turn is handed over once three colours are recorded; the mirror's *bo fine* is ungraded shadowing with a set of two. *Reason:* both inside watched exchanges in family voices. *Assumed:* yes.
22. **Ali wears his new piece on the birthday day,** in the bought colour (the made piece is always cut from the bought cloth), at home when the child brings him the party-bag toy: Ali isn't at the party (`party-gifts.md` §2, which now has the line). *Reason:* carry-home delight, and the thing for Ali. *Assumed:* yes.
23. **Big Ma hums only at the machine.** *Reason:* "she sings while she sews" (cast); one moment, not over speech. Who voices the spoken lines is settled before shipping (Zafar, 1 Nov).
24. **The size is large: three build slices,** after Find it's rebuild and pay (which gate only the stall). Slice 1 is the first-ever play end to end. Sprint planning is on hold (Zafar, 1 Nov), so this is a size, not a sprint plan.
25. **Big Ma's character sheet is drawn from the photo notes already in `cast.md`,** as the first item of the art run, and Zafar signs it off before any scene. *Reason:* the sheet-first rule; the photos are in. *Assumed:* yes.
26. **The prototype doesn't wait for the first Mum round** (Zafar, 1 Nov): it plays on existing takes and the device voice. The game counts as teaching once about 6 lines (the first-ever play) and 15 (the second) are recorded.

**Open questions that are genuinely his:**
- **What the family wears:** Zafar's clothes rule (1 Nov) is mostly modern and modest, with older people somewhat more traditional; the sewing still makes the kurta and the cap Big Ma sews (the recommendations stand). Left: *topi* or *kofia* for the cap, and what the girls' new outfit is (Mum or his wife).
- **Whether Big Ma goes to the stall in person** or sends the child with Nani: does a great-grandmother walking to the market fit the real Big Ma?
- **`cast.md`'s 24 Sept line** "no stall visit; Big Ma fixes the kurta rather than a new one being bought" is outdated by his 31 Oct note ("buys the fabric at the shop"). Changed in `cast.md` in the consistency pass (1 Nov), marked "for Zafar to confirm"; he can reverse it there.

---

## 11. ChatGPT mock-up prompts

**Run order:** Big Ma's character sheet comes first (art list item 1), from the photo notes in `cast.md`, and Zafar signs it off; these four mock-ups then attach that signed sheet in place of the description where marked. Until it exists, every prompt describes her from the same notes, word for word, and no other real person's sheet is attached to a scene she is in.

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins. Big Ma's own description below stands (she is an older woman).

**Big Ma's description, used in every prompt (from `cast.md`):** a very elderly, small great-grandmother with a gentle, knowing smile; dark hair, greying, pulled back under a soft, plain headscarf; thin rectangular metal glasses; at home, a soft cotton house dress, maroon with a small white paisley print and a little lace trim, and thin gold bangles; going out, a black headscarf and a plain black abaya with a little embroidered trim.

### Prompt sewing-1: the cloth stall (buy cloth)

This shows the stall just after the tap: two bolts, the asked one unrolling, Big Ma at the side in her going-out clothes. It shows that the heard colour picks the cloth. No glow box: the light has already moved on, and a box never hugs a moving thing.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, no buttons.

The scene: a small cloth stall in a calm, modern market street, with one or two gentle East African and Kutch touches only (a thin mirror-work trim along the front of the counter; nothing else decorative), eye-level camera from the customer's side like a family film, horizon at about the middle of the frame. Match the town-road reference for the setting. A long pale-oak counter runs across the lower third. Behind it, in the middle of the frame, a friendly middle-aged cloth seller with a neat grey beard, in a plain sand-coloured kurta, cut at the chest by the counter. Behind him, plain limewash-cream shelves with a few folded cloths in calm, soft colours (kept pale and quiet). At the right edge of the frame, cropped at the waist, a very elderly, small great-grandmother with a gentle, knowing smile: dark hair, greying, pulled back under a plain black headscarf; thin rectangular metal glasses; a plain black abaya with a little embroidered trim at the cuffs; thin gold bangles; holding a cloth shopping bag and pointing gently at the counter. The left third of the frame is calm and uncluttered.

The moment: on the counter stand two tall bolts of cloth on their ends, side by side, clearly different: one rich red, one leaf green. The red bolt is flopping open across the counter towards the viewer, the cloth unrolling in a smooth wave with a tiny puff of lint. The green bolt stays standing. The seller's eyebrows are up in a happy "here you go". No glow, no highlight, nothing dimmed.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft shadows, chunky simplified shapes, believable cotton cloth and wood, big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Every resting object has a soft contact shadow; nothing floats. Modest clothing, no religious symbols or markers of any kind.

Absolutely no text, letters or numbers anywhere: not on the shelves, the cloth, the bag, signs or anywhere else. No signboards.

Must read at phone size (about 740x320): both faces, the great-grandmother's glasses and headscarf, the two bolts as clearly red and clearly green, and the unrolling cloth.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/c2-town-road-view-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
(once signed off: the great-grandmother's character sheet)
```

### Prompt sewing-2: make (tap the long line, then cut)

This shows Big Ma's table from exactly overhead at the cut: both chalk lines drawn, the long one tapped and lit, the scissors following it, and the cat's paw stealing the offcut. It shows that the describing word picks the line.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, no buttons.

The scene: a seamstress's work table seen from EXACTLY straight above (a true 90-degree top-down view: no walls, no horizon, no tilt; round things read as perfect circles). The pale-oak table top fills the whole frame edge to edge. In the middle, a large piece of rich red cotton cloth lies flat. On it, a paper pattern piece shaped like a child's kurta (body with one sleeve sticking out) is laid down, and chalk lines trace around it. On the sleeve there are TWO parallel chalk lines across its end, the same colour and thickness: one making the sleeve long (near the wrist), one making it short (near the elbow). A pair of chunky steel scissors is halfway along the LONG line, the cut edge clean behind them. At the top edge of the frame, the top of a cream-and-brass sewing machine seen straight down, cut off by the frame. At the left side of the table, two other paper pattern pieces lie loose: a round cap crown and a long thin strip. A small brass tin of pins is the one decorative touch. At the bottom right edge, a fluffy charcoal-grey cat's paw reaches in from off the table and bats a small red triangular offcut of cloth away, mid-swipe.

In the top right corner, over bare table and clear of the cloth, a small round portrait frame showing the face of a cheerful boy of about six with short black hair, looking down at the table, delighted. Beside it, a smaller round frame with the face of a very elderly great-grandmother: dark hair, greying, pulled back under a soft, plain dark headscarf; thin rectangular metal glasses; a gentle, knowing smile.

The moment: a soft breathing gold glow box (a rounded rectangle of light, never an outline) sits around the long chalk line and the scissors on it; the short line is not lit; the rest of the table is slightly dimmed.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft contact shadows, chunky simplified shapes, believable cotton, paper, steel, brass and oak, no outlines, no cel shading, no photorealism, no depth-of-field blur. Nothing floats. No hands or arms anywhere (the scissors move on their own); the cat's paw is the only limb.

Absolutely no text, letters or numbers anywhere: not on the patterns, the machine, the tin or the table. No measuring numbers on anything.

Must read at phone size (about 740x320): the two chalk lines as clearly different lengths, the lit long line with the scissors on it, both faces, the cat's paw.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
(once signed off: the great-grandmother's character sheet)
```

### Prompt sewing-3: mend (two faults; the said one decides)

This shows the mend: a kurta flat on the table with two faults at once, the needle zipping the asked one shut, and the grandfather's face reacting. It shows that the picture alone can't say which to fix.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, no buttons.

The scene: the same seamstress's pale-oak work table seen from EXACTLY straight above (true top-down, no walls, no tilt). Slightly left of centre, a man's pale-cream cotton kurta lies flat, sleeves out to the sides, taking up about two thirds of the frame's width and leaving the top-right quarter of the table bare. It has TWO different faults, both equally visible and neither highlighted: on the left sleeve near the cuff, a ragged torn slit; on the front placket, one of the three buttons is missing, two loose thread ends showing where it was. At the table's bottom edge, a small round brass button tin seen from above, with a few cream buttons in it, and a spool of cream thread.

The moment: the torn sleeve has just been tapped. A steel needle trailing cream thread is zipping along it in a neat zig-zag, and the tear is closing behind it: the first half is already neatly stitched, the second half still open. A soft breathing gold glow box (a rounded rectangle of light, never an outline) surrounds the whole kurta; the table around it is slightly dimmed. The missing-button spot is left as it is.

In the top right corner, over the bare table and well clear of the kurta's sleeve, a round portrait frame shows the face of a grandfather with a white moustache and kind eyes, eyebrows raised in delight, a little chuckle. Beside it, a smaller round frame shows a very elderly great-grandmother: dark hair, greying, pulled back under a soft, plain dark headscarf; thin rectangular metal glasses; a gentle, knowing smile.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle contact shadows, chunky simplified shapes, believable cotton weave, steel and brass, no outlines, no cel shading, no photorealism, no depth-of-field blur. Nothing floats. No hands or arms (the needle moves on its own). Modest clothing, no religious symbols or markers of any kind.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320): both faults (the torn sleeve and the missing button) clearly visible at once, the stitching in progress, both faces, and no face over the kurta.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
(once signed off: the great-grandmother's character sheet)
```

### Prompt sewing-4: the fitting at phone size (the size gag)

This shows the fitting at its funny miss, laid out for a phone: the boy full length on Big Ma's low stool in a far-too-long kurta, the hem spilling onto the floor, the rail on the wall beside him, Big Ma laughing. It shows how the describing words are felt, never judged, and that the gag is visible on a phone.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen at a wide phone shape (about 740x320), the main play area only, no side panel, no buttons.

The scene: a calm, sunny sewing room in a modern home with one Kutch touch (a small mirror-work cushion on a chair), eye-level front camera like a family film. Limewash-cream walls, a plain floor. In the middle of the frame, a boy of about six with short black hair stands FULL LENGTH on a low wooden stool, his whole body in frame from the top of his head to the stool's feet, with a strip of floor visible below the stool. He is wearing a far-too-long red kurta that has just been put on: the hem spills over the edge of the stool and pools on the floor, and the sleeves flop well past his hands like puppet sleeves; he is flapping them and laughing, plain trousers underneath. To the left of the boy, between him and the plain left third of the frame, a short pale-oak wall rail is fixed to the back wall at the boy's shoulder height, with 3 garments hanging on wooden hangers, seen straight on, hanging no lower than the boy's knees and never in front of him: an empty swinging hanger (where the kurta came from), a child-size red kurta of the right length, and a red cap on a hook. On the right edge, cropped at the waist, a very elderly, small great-grandmother with a gentle, knowing smile: dark hair, greying, pulled back under a soft, plain dark headscarf; thin rectangular metal glasses; a soft cotton house dress, maroon with a small white paisley print and a little lace trim; thin gold bangles; a tape measure round her neck; laughing kindly with one hand on her cheek. The left third of the frame is calm, plain wall. No mirror in this shot.

The moment: the empty hanger on the rail is still swinging, showing where the kurta came from. A soft breathing gold glow box (a rounded rectangle of light, never an outline) sits around the rail, the next thing to tap; the boy is not lit. Nobody looks cross: everyone is giggling.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft shadows, chunky simplified shapes, believable cotton, oak and wood, big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Contact shadows under the stool and the boy's feet; nothing floats. Modest clothing throughout, no bare skin beyond face, hands and feet, no religious symbols or markers of any kind.

Absolutely no text, letters or numbers anywhere: not on the wall, the hangers or the clothes.

Must read at phone size (about 740x320): the boy's face, the kurta's hem on the floor and the floppy sleeves (none of it behind the rail or cut off by the frame), the great-grandmother's laugh and glasses, and the hanging pieces as clearly different (a red kurta, a red cap, an empty hanger).

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
(once signed off: the great-grandmother's character sheet)
```

---

## 12. Changes after the critique

The critique (`sewing-critique.md`, 1 Nov) had 7 MUSTs and 11 SHOULDs. All MUSTs are applied; all SHOULDs are applied, two of them only as far as this run may go (it edits only this file).

**MUST**

1. **The fitting's L1 ask named only the person.** The ask now always carries the garment word: "I want the kurta / the cap" (*muke {x} khape*, in engine) at L1-L2, "the kurta is for Ali" from L3. The L1 decoy is another garment for the same person in the same colour; the made piece is the ask at most half the time, and is always in the photo so "the person tries on what you made" still holds. The bot is recounted on the garment word (blind, memory-of-make and person-only all 50%). §1 frames, §3d, §4a, §9.1, §10 decision 7.
2. **The size was wrong.** §0 and §6 now give each engine's real state (Find it's stall greybox on its own engine, Dress up's `wear` and rail greybox on `js/dress/core.js`, give-to unbuilt, pay designed only, `stitch.js` a ring not a line), the honest order (Find it onto the kit → Dress up's wear and rail → give-to and pay → one shared linear track → the sewing), what the sewing owns and waits for, and three sewing sprints. The track generalises Cook's `fill-fold.js` dashed-line swipe; the ring stitch stays for buttons. §10 decision 24.
3. **Two scope reversals were assumed yeses.** "His 31 Oct order" is gone (it was the map's title, Claude's wording). Make-or-mend is now §10 question 1, marked "the 1 Nov scope says mend, then make; I propose make first because the opening joke needs a new kurta". Going out is back in visit 1 as the fitting's last beat (new §3e, from the third play), with pack the bag's overlap offered as a reason in question 2, not decided.
4. **The prompts drew a Big Ma who isn't Big Ma.** Every prompt now describes her from `cast.md`'s photo notes (greying hair pulled back under a plain headscarf, thin rectangular metal glasses, the maroon paisley house dress and gold bangles at home, the black headscarf and abaya at the stall), and attaches her signed sheet once it exists. Nani's sheet is dropped from prompts 3 and 4. §7 item 1 now says her sheet is the first item of the run, from the notes in `cast.md`; "photos to come / blocks the game" and the open question about her photos are removed. §10 decision 25.
5. **Three points were left to the builder.** Make is tap-then-track: tap the chalk line (it lights), then drag; a wrong line shakes and Ali says the length word; the drag never decides (§3b). The fitting's colour and garment misses have their own gags (the dupatta tent, the cap over the eyes, the puzzled look-down with Big Ma's *lilo!* recast) (§3d, art item 10). The book's three past-tense sentences are listed for Mum as a reported engine gap, and the book uses the engine's noun phrases until then (§1, §2 stage 8, §10 decision 11).
6. **The first-ever round was the whole day.** The first-ever play is now door → joke → make → fitting → book: two controls, two play screens, two new words, about two minutes (§4a). The stall and the mend arrive on the second play with their showings (§4b), Going out on the third (§4c). Big Ma pays at the stall until the shops have taught pay, so pay's first-time showing never lands here. §10 decisions 3 and 5.
7. **The too-long gag was invisible on phones.** The phone fitting is re-laid: the customer full length on Big Ma's low stool with the floor in frame, the rail on the back wall at shoulder height beside the customer and never in front, the mirror dropped on phones (the twirl is a zoom). §7's layout states the rule (hem, sleeves, stool top and floor never under a rail, a card or the crop) and what the 915x275 gag reads by (the hem over the step onto the floor, the sleeves past the hands). Prompt 4 is redrawn to show exactly that. §10 decision 10.

**SHOULD**

8. **Word accounting.** Applied. The day template's O-ID table is filled in (§1); the fault words now reach three hearings by naming the faults in mend's showing and adding "Nana's kurta is torn" to Nani's door line, with an unasked fault honestly counted as met, not taught. The Mum list now includes the day's glue (Nani's door lines, the seller's price, Big Ma's sew and mend lines, "make me a {garment}", the mirror's answer, the book's past tense), split into the first-ever play's 6 and the rest. Who voices whom is stated (Mum or Masi for every deciding line; Zafar's wife only the song). *bo fine* is marked to record as its own line.
9. **The stall leaks until two colours are recorded.** Applied as a data check (never teaching with fewer than two recorded colours on the counter), with the bot's placeholder rate as its own line (§3a, §9.1).
10. **The speaking set was two, one without a clip.** Applied: the stall's handover waits for three recorded colours (in practice visit 2), and the watched exchange plays only recorded colours; the mirror's set stays an ungraded two, marked as such (§1, §3a, §3d).
11. **"A cap? *na*!" was a verdict.** Applied: Ali names the tapped pattern, then the asked one; *na* is kept for "no said last" asks (§3b).
12. **Counting steps need their closing rule.** Applied: `easy-to-play.md` rule 4 is cited in the shared rules; the placket shows four spots for "two" (mend L2) and five for "three" (make L4) (§3, §3b, §3c).
13. **The prompts.** Applied: prompt 3's kurta is smaller and left of centre so the faces sit over bare table; prompt 1 drops the glow box (the bolt is moving) and uses `shops.md`'s setting words and the town-road reference; prompt 4's light is a box round the rail, never an outline, and the mid-shin crop is gone. Also fixed in passing: prompt 2's paw was ginger; Simba is a charcoal Russian Blue (`cast.md`), and its glow is now a box.
14. **Scope creep.** Applied in the design: the cushion cover and the role reversal are cut, and "chooses colours" reuses Find it 3a's ungraded gift tap at the free-play stall (§5). *Not done here:* adding the two lines to `docs/ideas.md`, because this run may edit only this file; the orchestrator adds them.
15. **Reuse missed or misnamed.** Applied: Find it 4b (with its size rule) cited for the stall; Dress up 5a's change of mind named as the fitting's "no said last"; the fault picker is `whichone` over garment parts; the track names `js/cook/mechanics/fill-fold.js`; the book names `js/day/book-games.js` (§3a, §3c, §3d, §6).
16. **Nana's hand through the sleeve.** Applied: the mended sleeve flaps like a windsock and Nana's face circle chuckles; no hand drawn (§3c, art item 10).
17. **No rail in the art list.** Applied: rail pieces on hangers are item 8 (about 10), the count is honest at about 80, and visit 1 is cut to red and green (green as the decoy), with white and the other recolours coming in visit 2; a split run is offered if 80 is too many (§7, §10 decisions 18 and 20).
18. **Small contradictions.** Applied: the hint follows the rulebook (the guide's hint free, only the helper card costs a bulb) everywhere; §2 states that the made piece is always cut from the bought cloth, so the party promise holds; take-off is a tap on the piece's empty hanger, never on the person; decision 19 cites clinic decision 92. *Not done here:* `cast.md`'s 24 Sept "no stall visit" line, because this run may edit only this file; it is listed in §10's open questions to change in the same commit as this design.

**Consistency pass (1 Nov, `consistency-2026-11-01.md`).** Ali isn't at the birthday party (`party-gifts.md`: the child goes with Nana and Nani, and the party-bag toy goes home for Ali), so his new piece comes out at home on the party day (§2, decision 22; the party design now has the line). The stall stage follows `shops.md`: on the shops' visit 1 the cloth is the general store's shelf, and the cloth seller's own stall comes on visit 2 (§2). `cast.md`'s "no stall visit" line is changed, for Zafar to confirm. The cushion cover and the role reversal are `docs/ideas.md` rows 95-96. The prompts' attach lines say "the great-grandmother's character sheet", so no real person's name reaches ChatGPT. The counts keep `easy-to-play.md` rule 4, which is Zafar's word; if he picks another count close for every game (`farm-animals.md` decision 5, `shops.md` decision 8, `adoption-centre.md` decision 21, `beach-boat.md` decision 7), the sewing's counts follow it.

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **The recommendations are fine:** make, then mend, and Going out in visit 1 (§2, the two "questions first" are now answered decisions).
- **One count close** replaces this design's "counts close themselves" (§3's shared rules). **Level up only on right-first-time rounds.**
- **One pay** at the stall: count out and hand over, with stacks for small prices.
- **Voices:** settled before shipping; the prototype doesn't wait for Mum's round (§1, decisions 23 and 26).
- **Sprint planning on hold:** the three sewing sprints are now three build slices (§0, decision 24).
- **Clothes:** his rule noted in the open question and before the prompts; the made kurtas and caps stand.
