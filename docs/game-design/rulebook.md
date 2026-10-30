# The rulebook (draft, Sprint 14)

**Status:** draft from Zafar's answers, 28-29 Oct (`docs/archive/sprints/S14-lock-the-principles.md`, rounds 1-3 and the 29 Oct morning
answers). Every number here will live in one central settings file, so a change is made once and every game follows. Chai is
built first; what it teaches goes into the roll-out briefs. Reviewed by Fable against `docs/architecture/target-model.md`
before it is final.

## 1. The rules

| Area | The rule, every game |
|---|---|
| **How many** | Each game has one thing that repeats (cups, skewers, samosas...) and its most at L4 (what fits and stays fun). L1 is 1; L2 and L3 are even steps between, rounded (`1 + (max - 1) × (level - 1) / 3`). A game may override one level, written in its row. |
| **L1 the core** | The basic task; only "yes" asks; the base words; everything shown; 1 decoy that looks clearly different; the gentlest timing. |
| **L2 more of it** | More of the same; numbers; "no" asks; one added item; the order card's English dotted; 2 decoys; less waiting. |
| **L3 other ways of saying it** | Other names and phrasings for the same thing; the order card's picture blurred; 3 decoys; more precision. |
| **L4 added complexity** | The most items; amounts and halves; 4 decoys, one a lookalike; a little of both. |
| **Moving up a level** | For now (Zafar: "make it easy to change"): up after 3 finished rounds at a level where the guide's hint came at most once a round; never down by itself; a grown-up can pick any level. Story mode and free play may set their own rules later. |
| **The guide's hint** | After 7, 9, 11, 13 s by level, from the last action (Nani in Cook, the doctor in the clinic). |
| **The order card** | Always open for the active order; its Kutchi always shown; English dotted from L2; picture blurred from L3. One sideways row on every screen that glides, ticked cards first, "no" cards last. |
| **The order said** | Item by item, each word's card popping big beside the side panel (never over a face), then turning into its row card; "no" items said last, so the row only moves forward; the hold 1.5 s for a new word, 1.0 s learning, 0.6 s known. |
| **The helper card** | The full answer (picture, Kutchi, English) in the guide's box, which grows in place. |
| **The word ladder** | A word's Kutchi shows under its item until it is picked right three times in a row, then speaker only; a miss brings it back until the next right pick. Dots and the eye are help: a peek is never a right pick. |
| **Skipping** | A tap in the play area skips what is being said and lands the order; a tap on a speech bubble, the side panel (its cards and speakers), the cog or the menu does its own thing and never skips. |
| **Showing what to do** | Every item not on the order card is shown at the start; otherwise each new action once; each level's new thing once; when the showing stops, point once at where to look next (the order card, 1.2 s). |
| **The light** | One lit box with a breathing gold glow; an item also bounces, a control only glows; everything else dimmed; no finger, no target; a control lit only when it is time to use it. |
| **Timed controls** | The first time a child meets one (turn off the tea, flip a skewer), its timer holds in the green while the light shows them; after that, normal timing. |
| **Mistakes** | A shake and the word; never a cross or a verdict. |
| **Who sees the showing** | Each first-time showing once ever per player; "New player" resets it. |
| **The cog and menu** | One cog, top right of the play area; what it opens, in what order, and where it sits at each screen size, from the central file. |
| **The end card** | Time per level, the ticks, the bulb; the showing never counts against the bulb. A rethink (progress, not a score) later. |

## 2. Cook, game by game (today → the rule)

| | Chai | Pantry | Maani | Sekelo | Samosa | Chaat | Daar |
|---|---|---|---|---|---|---|---|
| **What repeats; most at L4** | cups; 3 | items to fetch; 6 | rotis; 5 | skewers; 4 | samosas; 6 | items in the bowl; 6 | chopped (X) and the things in before them (Y); 4+4 |
| **Today L1-L4** | 1, 2, 2, 3 | 3, 4, 5, 6 | 1, 2, 3, 2-4 | 1, 2, 2-3, 3-4 | 1-2, 1-2, 2-4, 2-4 | 1, 1-2, 2-3, 1-2 | onions 1-3, chillies 1-3, spices 2-3, laps 2-4 |
| **By the rule (Zafar, 29 Oct)** | 1, 2, 2, 3 | 3, 4, 5, 6 (as today) | 2, 3, 4, 5 | 1, 2, 3, 4 | 2, 3, 4, 6 | 3, 4, 5, 6 items in the bowl, a double portion counting twice | chopped + added first (X+Y): 1+2, 2+2, 3+3, 4+4 |
| **L2's new thing today** | 2 cups, numbers, extras, "no" | more items, the whole shelf | big and small | 2 skewers | a second filling | a second topping | decoys come in |
| **L3's today** | kari / mori names | more items | one of each | mixed skewers | a second batch | "no" asks | more decoys |
| **"No" asks today → rule** | L2 (done) | none | none | none | L4 → L2 | L3 → L2 | none |
| **Decoys today → rule** | 1, 2, 3, 4 (done) | the shelf full (stays) | none | none | not counted | not counted | 0, 2, 3, 4 → 1, 2, 3, 4 |
| **Timed control (first-time hold)** | the boil knob (done in the green) | none | the tawa flip | the grill turn | the fry lift | none | the tadka burn |
| **Shown at the start** | water, tea (not on the card) | to check in each game at the roll-out: every item not on its order card | | | | | |

## 3. The clinic, game by game (Zafar, 29-30 Oct: final)

The heal games count by design: a number is their task, so their numbers are spoken from L1. No "no" asks (sore spots' "not this
colour" at L2 stays; never in the eye test). Written x+y for two counts; a-b is a random number in that range (the game picks it).
"Today" is each game's code (`js/clinic/heal/games/<game>.js` K), not its data notes (the foot's and the ear's data notes are an
older design).

| Game | x + y | Today L1 / L2 / L3 / L4 | The rule L1 / L2 / L3 / L4 |
|---|---|---|---|
| **Eye test** | drops to fix the eye first + chart cards to answer | 1-3+4 every level | 2+4, 2-3+5, 2-4+6, 2-5+7 |
| **Ear** | blobs to clear + drops | 3+1-4, 4+2-5, 4+2-5, 5+2-5 | 3+1-3, 4+2-4, 5+2-5, 6+3-6 |
| **Knee** | kicks + bandage turns | 1-4+4-6, 2-5+5-8, 2-5+5-8, 2-5+6-10 | 1-3+4-5, 2-4+5-6, 2-5+6-7, 3-6+7-8 |
| **Tooth** | brush moves + dirty patches | 2+1, 4+2, 4+2, 6+4 | 2+1, 3+2, 4+3, 6+4 |
| **Foot** | jugs of water + splinters | 1-5+1, 2-5+3, 2-5+3, 2-4+3 | 1-3+1, 2-4+2, 2-5+3, 3-6+4; the sole shows one bit of dirt per jug and each pour clears one, so the last pour leaves it clean |
| **Sore spots** | colours to pop + decoy spots of each other colour | 1+2, 2+2, 2+2, 2+3 | 1+1, 2+2, 3+3, 3+4 |
| **Boing** | wipes + drops; dispensers to choose from | 1-5+2-4, 2-5, 2-5 (drops at most 5); 1, 1, 4 | 1-3+2-3, 2-4+2-4, 2-5+3-5, 3-6+3-6; 1, 2, 3, 4 |
| **Scrape** | dabs + stitches | -, 1-4+2-5, 1-4+(2-4 big, 1-2 small); two-colour plasters at L4 | 1-2+0, 1-3+2, 2-4+3, 2-4+4; two-colour plasters at L4 as today |
| **Fever** | things tried before the right temperature | 3, 3-4, 3-4, 4 | 2, 4, 6, 8 |

The eye test's cards grow from today's fixed 4 (more flash-card rounds per patient).

## 4. Open, for Zafar

1-4. Answered 29 Oct (above). Samosa's 6 at L4 needs the fry pan to fit six (to check at its roll-out).
5. The clinic's numbers: section 3, final (Zafar, 29-30 Oct).
6. Fever and a few clinic shapes are conversations, not counts: their "most at L4" to decide when they are rolled out.

## 5. Fable's review (29 Oct) and what was done with it

A Fable review against `docs/architecture/target-model.md` and CLAUDE.md, 15 findings. Settled for the chai build: the central
file is one data file (a new data/rules.json: levels, advance, showing, words, order, skip, menu) read through one reader, never by a
game itself; the cog's place per screen size is shared CSS, its menu's items and order are data; level-up counts 3 consecutive
rounds and only the guide's hint; a tap never skips a first-time showing; the timed hold is only for a control the child
operates; the hint waits have one owner (the level rules). For the roll-out: "no" asks, decoys and the order card are per game
with the rule as the default (a game with no order card, most heal games, skips those rows); the clinic gives each game its own
L1 count instead of the formula's 1; one repeating unit per game (chai: cups); the old word stages (`data/progress.json`) fold
into the pill ladder or stay, decided after chai; `onboard.js`'s ghost finger goes when each game takes the light. The helper
card's English (Zafar, 28 Oct: "always shows everything") is now in non-negotiable 3. Open for Zafar: the bulb's timed English
lines in the games not yet on the new kit (retire them at the roll-out?).
