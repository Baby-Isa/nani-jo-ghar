# Sprint 18: review and direction (8 Nov 2026)

Everything said on 8 Nov about the kitchen games in one place: what went wrong, Zafar's play, the look, the decisions, the principles to
settle and a draft plan. Written by the orchestrator from Fable's two reviews, Zafar's messages and his voice note; checked and extended
by Fable that evening. To be read in a fresh chat and turned into the agreed plan.

Sources: Fable `build/reports/s18-fable-what-went-wrong.md` and `s18-fable-look-review.md`; the transcript
`docs/feedback/kitchen-play-2026-11-08-transcript.md` (times below are its own) and its report `docs/feedback/kitchen-play-2026-11-08.md`
(41 points with causes in code, seven questions, 27 new rows, 7 reopened; IDs in its §3); today's other rows SEK-24, CK-61, CK-62,
DAAR-43, SH-235, CHAI-107; Fable's second reader `s18-feedback-1108-second-reader.md` (folded in); the sprint file.

**Changes on review (Fable, 8 Nov):** cause 7 and why seven reopened rows slipped (§2); three themes (§3); baking, chop and today's six
rows (§4); the mock's plate and today's flaws (§5); the report's seven questions folded into §6 and Fable's seven scene questions as
principle 12; two decisions (§7); §8 updated; §9 the plan. Disagreements are said in place.

## In one page (read this first)

- **What went wrong:** chai's newer pieces (the 6 Nov cards, Nani's box with its drop-down) were switched on for chai only; the kit's
  shelf, scene and light were optional, so most games kept their old ones; and every game was merged on "0 contract breaks" without
  anyone looking at it beside chai. The checks measured the wrong things; the judging asked the wrong question.
- **What can be fixed now, no decisions needed:** turn chai's cards on everywhere; remove every tick, next and X button; order cards
  tick as you go; one shared onboarding light (it hugs the thing and its pill, leaves when the child starts, one finger, only shelf
  items bounce, the stuck hint everywhere), coded once; delete the old relics; the plain bugs (crate pictures and the rest); a
  side-by-side check against chai that gates every merge.
- **What needs principles and target art:** the shelf (option 4; its angle, measured at about 29 degrees in the mock against chai's 7),
  shadows (yes, half the mock's weight), the marble, top-down boards and pans, each game's layout from mock-ups, samosa's redesign.
- **The principles (section 6):** shared pieces compulsory, variations live in the shared kit; no ticks or next buttons; one card per
  thing, no "one"; one order per person where it fits; the onboarding rules; a timing floor; the look.
- **The plan (section 9, Fable's draft):** two tracks: Zafar's (principles, then mock-ups, then an art run, the critical path) and the chat's (the shared fixes now, then the kit's one scene, then the games two at a time, each merged only beside chai), back to back.
- **Checks (section 10):** about 25 automated checks for objective things; the rest to an eye judge with a rubric, full-size frames
  and chai beside. A blind test caught a third to a half of his points and about 25 new ones.
- **Running now:** ChatGPT mock-up round 1 (free ideas, every gameplay screen; `docs/design-language/art-plans/s18-mocks-chrome-block.txt`).

## 1. Where things stand

- **Chai** is signed off and still loved ("clean, modern, beautiful"). Three fixes from today (the card's jerk at a person change and the
  half card, the item timings, the half-glass ding) are on the branch, frozen diff clean, **not live**: the session's safety check blocked
  the publish; it needs his explicit go or a permission rule. Open: CHAI-107, the last glass's ring muted by the praise (kit fix: the
  praise waits about 0.5 s).
- **The other nine** are live on `main` (20261108T142321Z) on the kits' calls, most with their own looks and old copies of shared pieces;
  eggs, baking and corn still prototypes in their own scenes. Zafar: several "a million miles off"; maani and corn "on the right
  framework". Played: maani (L1), sekelo, daar, stir, chaat, samosa, eggs, corn; **not baking or chop.**

## 2. What went wrong (and whose)

Fable's six causes, a seventh from the rows, and the orchestrator's share:
1. **The kit has no scene.** Chai's kitchen is five optional calls; the kit allowed a game's own glow (`onLight`), and chaat switched the
   kit's coach off for its own finger.
2. **The briefs named functions, not the look.** "Done" was "0 contract breaks, copied code deleted"; every builder met it.
3. **No check measures the look**; builders scored their own gap pages ("different by design").
4. **The judging asked the wrong question** (clipping, English), with no chai frame beside any game.
5. **The orchestrator merged seven games in an hour on "0 breaks"**, never looking at one beside chai. Zafar (17:00-19:00): "at what point
   can you just use your judgment ... any human being would look at the tea game and be like this daar game is not the same style."
   Right: those merges should have been refused.
6. **Shared pieces not carried over even where they exist**: the item card (the line above the speaker, the Kutchi and English alignment),
   Nani's box (drop-down, one-line wrap), the dimmed onboarding with the rounded light, the ticking card, no tick buttons; missing in
   maani, sekelo, daar, chaat, samosa and eggs.
7. **Chai's pieces were built with a switch left off** (the rows' finding). The 6 Nov card and type come on only for an all-chai order
   (`ui.js:1552`, `flow.js:1721`; `UI.TYPE_ALL` false), so other games draw the old card, type, strip and box; only chai calls the stuck help;
   the helper arrow needs an order-row word, which sekelo's pieces and daar's chop never give; the kit's box hugs the picture without its
   pill; mechanics keep their own ghost fingers. Hence seven rows told between 22 Oct and 6 Nov came back: built on chai, and "every game
   joins at the roll-out" never happened. One flag and a few retired paths close five.

Zafar's share, his words: "we put time, love and attention into tea ... some of these other games need some of that love and attention
as well"; "maybe I'm over-prescribing ... use your wisdom ... and tell me how best to make this work".

**Proposed (the orchestrator):** principle 10's merge rule; one scene a game cannot skip; the shared pieces the only way to draw a card,
a light or a hint; a game's scene set by a mock-up Zafar likes before its builder starts (Fable: true of scenes and art; the shared pieces
and behaviour rows need no mock-up and should not wait for one, §9).

## 3. Zafar's play, 8 Nov: themes across the games

Each comes up in more than one game; each is a principle to settle once (§6), not a fix per game.

| Theme | Where heard | What he wants |
|---|---|---|
| Shared pieces missing | maani 1:02, sekelo 9:14-9:56, daar 17:00, chaat 20:04, eggs 23:00 | Chai's item card, Nani's box (drop-down, one-line wrap), the dim and rounded light, everywhere |
| The old card's relics | daar 16:59, chaat 20:14, samosa 21:34 | No arrow strip, old count box or old pop-up: steps and kinds-of-several as 6 Nov cards (SH-241, SAM-31, DAAR-44) |
| No ticks, no "next" | maani 5:38, chaat 21:18, samosa 22:04 | "Not a good game mechanic"; no tick, next or X button; a step moves on by itself (SH-238) |
| The card ticks as you go | maani 6:16-7:24 | Each item ticks when done; "well done" when the whole card is complete; then the round ends (SH-239) |
| Onboarding light | maani 2:15-4:57, eggs 23:00-23:21 | Hugs thing, pill and board; leaves as the child starts the move; one finger; only shelf items hop (SH-230, -236, -237, -119) |
| First-time lessons missing | maani 5:28, chaat 20:03, samosa 21:23 | The flip, the fry and chaat's layers with the kit's dim and lit box (MAA-19, SAM-30, CHT-18) |
| One unit per item card | sekelo 10:09-11:28, eggs 23:32-24:07 | The order names dish and count ("two fried eggs"); one card per unit; no "one" on cards |
| One of the thing on a card | daar 17:49, sekelo's card | One onion, one tomato, never the shelf's crate (SH-242, SEK-24: `Cook.shelfPic` is the card's first picture) |
| Top-down art | maani 8:07-8:27, daar 18:55 | Boards, trays, oil pan exactly top-down, a royalty-free reference for ChatGPT (ART-62, -63) |
| The shelf | daar 19:05, chaat 20:57 | Items on chai's shelf (or a counter), never floating (SH-243) |
| Hints | sekelo 9:14-9:47, chaat 20:24-20:36 | The stuck hint past the level's wait (SH-228); Nani's line in chai's type, one line (SH-240); the drop-down (SH-149); the placeholder waits on Mum (SEK-18) |

## 4. Zafar's play, game by game (the points; rows in the report's §3)

**Maani (0:00-9:00):** keep "one" for now (it teaches the gender forms of one, 0:52; provisional; principle 4); silver dishes fine
(2:12); the item card lacks chai's line and alignment (1:02); the box clips images, pills and the rolling board (2:15); two fingers
overlap (2:58); the lesson: one finger dragging the pin up and down, or a pulsing circle, try both (3:07); the box goes once rolling
starts; the first time, rolling stops at the right size, the light and a juice sound prompt the tap, no finger (3:34-4:30); the pan does
not bounce (4:35); the dough balls flashed lit while one flew (5:00); no flip lesson (5:28); a tick button (5:38); the balls may not read
as dough (5:58: his ChatGPT options first); the card did not tick as each was made (6:16-7:24); boards and trays not exactly top-down
(8:07). "On the right framework" (7:40).

**Sekelo (8:43-16:45):** Nani's hint an English placeholder (9:14; Mum's "thread them", since 17 Oct); the stuck hint wrapped to two
lines when one fits; no drop-down (9:47). **His order (9:56-16:39):** four item cards, the skewer's four pieces, even if all the same,
each ticking as it goes on ("otherwise you have to put four on before you even know"); the order names the dish, so the pieces' words
(gos, chicken) are separate from the dish's; one skewer per person; "first chicken, then three lamb" pops the chicken card, then a lamb
card that stays while three copies shrink into the order card in turn (preferred to a split into three). **For Mum (LNG-24):** "I want
beef / chicken mishkaki", mixed perhaps just "mishkaki", or drop mishkaki (East African) for "grilled meat / vegetables"; his tries are
drafts. **PRC-12:** Mum's questions and the grammar sheets grouped by game. SEK-24: a tomato crate on a tomato skewer's card.

**Daar (16:59-19:20):** the old card's relic (a strip with an arrow) across the card; the item cards not chai's; no drop-down; a crate of
onions for one onion; after chopping, the old-style pop-up (the tadka's order via `UI.mission.request`); the oil pan not top-down; items
on a code-drawn plank, not a shelf. Today: DAAR-43, on a phone the first-time light covers the next pile. **Stir** (19:26): a different
dial, art and zoom from daar's own; one stir in the kitchen kit for both (DAAR-45).

**Chaat (20:03-21:18):** no dim (its own finger, not the kit's coach); the card wrong (sequences on the old strip); no stuck hint for a
new player; chillies asked straight after the potatoes (CHT-19: no log; replay ten seeds); perhaps a bowl on the counter or shelf, as
chai (ART-64); a tick button.

**Samosa (21:23-22:53):** no lesson for the pan; the item card a mess (the old box with count row and filling pills); six rectangles and
the fold do not work; the next button "horrible ... you can't have an X button". **His idea:** one roll; more guidance, fewer mistakes,
the focus on the language: no wrong item goes in, only the number asked, it moves on when done.

**Eggs (22:57-24:07):** the light round the eggs cuts the pill; the pan's light too small, off-centre, half on the handle ("how can that
pass": drawn round the whole picture); the order logic (§3); CK-62, an empty picture box on the card.

**Corn (24:14):** not bad; the green zone far too short (the last tenth of a 2.6-3.2 s side: 0.26-0.32 s); he asks for a rule. Today:
CK-61 (the light's room), ART-60 (the table background low-res).

**Baking and chop (not played; Fable's frames):** baking's bowl floats, containers sit in front of the doors, a round glow clips the
pill, no band; its "?" goal ran off a phone (SH-235). Chop: bare marble, a gold strip, things fly in from the air, no greeting, no shelf.

## 5. The look (shelf, shadows, marble, light, mock-ups)

**Zafar's ChatGPT redos** (maani, chai with shadows, sekelo with three shelves) and ChatGPT's six findings, reviewed by Fable and the
orchestrator (`s18-fable-look-review.md`). Fable's flaws today: nothing grounded (no shadow under hob, tray, board, tawa); sekelo's board
light oak, its skewer one pixel on a phone, its heaps at a 3/4 angle that is neither camera; maani's thalis read as discs on a wall; at
740x320 the marble is a grey wall.

- **The shelf: option 4, the stone ledge with a front lip** (chai's). The camera belongs to the surface: the worktop from straight above,
  the shelf from the front and a little above, the lip the line between, everything on the shelf standing on it with a contact shadow.
  Bowls for loose pieces; containers on the ledge, never floating.
- **Dough balls** strictly top-down (Zafar), in a shallow thali on the shelf (Fable); maani's bottom panel tried both ways, shelf and
  plain band; he leans to the shelf.
- **Shadows: yes, at about half the mock's strength.** One upper-left light; a contact shadow under everything, fading down-right (the
  bible's rule). Two builds: a pre-made soft silhouette per fixed object; the existing soft oval for things that move, one per skewer,
  growing. Not Phaser's shadow effect (WebGL only, costly on phones). No light streaks.
- **The back-panel shadow** (ChatGPT's chai): the orchestrator's call, as asked: **no.** The band is the shelf's front face, not a wall.
- **The marble:** today's white (never yellowed), veins somewhat stronger and cool so it reads as stone on a phone; a lab first.
- **ChatGPT's six findings:** 1 walnut board, bevelled: agree. 2 thicker skewer: agree. **3 the tray's size in the mock is right** (Zafar:
  one board and one tray on that screen; two trays and the grill are the next; "deeper, not bigger" was the orchestrator's mistake).
  4 piles not bowls: disagree. 5 one upper-left light: agree. 6 balance: agree.
- **ChatGPT for every screen: yes.** From each game's current screen; the corn stall gets more room. Chai and sekelo first so the shared
  rules settle once; the other eight answer only their own questions. Every brief carries the house lines (camera rule, shelf, light,
  shadow weight, marble, walnut, no text, only the game's own items: the sekelo mocks invented murgi and dropped makai; the room other
  pieces need). **The plate:** a grey-box screenshot of the real stage at 1280x665 (`shelfshot.mjs`); the four-size check is on the cut
  assets, never the mock. Each mock becomes a one-page look sheet (numbered changes: art, code or rejected). Top-down references travel in
  the block's zip (ART-29: Zafar uploads nothing).
- **The shelf art (amended):** one run draws the shelf at several angles, each **empty and with items** (contact shadows captured).
  **Measured:** a rim's height over width is the sine of the camera's angle: option 4's bowls 0.48, **about 29 degrees**; chai's jars 0.12,
  **about 7**. So 0, 7, **29 (the key one)**, 45, top-down. One shelf, one camera: each game's shelf and everything on it share one angle
  (low bowls need about 30; tall jars read best near side-on), decided from its mock. Fable's "10 degrees" was wrong; three views too few.
- **Containers drawn on the shelf, then cut** (Zafar): yes; the shadow cut as its own layer.

## 6. Principles to settle (decisions for Zafar, with recommendations)

1. **Shared pieces only:** cards, Nani's box, lights, stuck help and order card through the shared kit, the roll-out switch on, the old
   paths deleted; a game's own copy blocks a merge. (Yes.)
2. **No ticks, no tick, next-scene or X buttons;** a step or order moves on by itself. (Yes: his words.)
3. **The order card ticks as you go;** "well done" from the person when their whole card is complete; then the round ends. (Yes.)
4. **The counting rule, every game (Q1; "do help me establish it").** The spoken order and headline carry the number ("I want two fried
   eggs"); one item card per thing, naming it alone (two "fried egg" cards; a skewer is four "gos" cards), so no card says "one"; the
   he/she forms of one are still heard. It overturns the earlier "no one for a single item"; his maani "keep it for now" was provisional.
   (Recommend yes everywhere; SEK-25, CK-64, SH-239 follow; each dish's Kutchi to Mum, her sheets by game.)
5. **Sekelo: one skewer per person (Q2);** levels grow by people (1-4), not skewers each (SEK-22). (Recommend yes.) *Fable: the earlier
   "one order per person in these games" over-generalised: chai's and eggs' orders carry counts; he said it for sekelo.*
6. **Onboarding:** the light hugs the thing, its pill and its board, with the margin; it leaves the moment the child starts the move; one
   finger, the kit's; **the hop rule (Q7): "only things on the shelf (the bottom bar) hop when lit; pans, boards and things in play
   never."** (Yes; SH-237 is drafted so.)
7. **Timing:** each game's own timings (7 Nov) with **a floor**: no green window under a minimum, every timed control, by level (Q5).
   *Fable: the 1.5 s at L4 proposed earlier is a guess; measure chai's green at each level, set the floor there, measure every game
   against it.* (After the measurement.)
8. **Samosa (Q4):** one roll, more guidance, fewer ways to go wrong, the focus on the words; a wrong filling refused, only the asked
   number, it rolls up and moves on. (Recommend yes in principle, by the fast lane: mock-up, lab page, his numbered choices, after the
   scene round; nothing removed until he picks.)
9. **The look:** §5's choices. (Yes; marble and shadows in a lab first.)
10. **The merge rule and judgement (Q6):** nothing merges until it sits beside chai at the same moments (`sidebyside.mjs`, to build) and
    an eye passes it, the orchestrator's then Fable's; his ideas are improved, not waited for. **"How can that pass":** no check asks
    whether a light is centred on and whole round its thing (contract-92 asks only that it does not cover a neighbour), the judge's
    batches never asked, and the merge was on "0 breaks" with no look beside chai. (Yes; a contract row for centred, whole lights.)
11. **A count in the pop-up (Q3):** a copy of the pop-up card shrinks into the order card once per piece, the pop-up going with the last
    (his first option), not a split into three. (Recommend it as the shared pop-up's way for any count.)
12. **Each game's scene (Fable's seven questions, unanswered):** one kitchen scene for every game, band and ledge along the bottom, every
    pickable item in a slot with its pill, the game's own things above, the kit refusing a game without it (yes); baking's counter, oven
    and cat as a backdrop above the band, containers on the shelf (yes); eggs on chai's marble, the oak table as the corn stall's backdrop
    (yes); samosa's top-down heaps with no ledge kept as his S2/Q2, or onto the ledge like every other game (Fable: the ledge; his call);
    chop's things start on the shelf and fly from it, the mechanic unchanged (yes). The ~06:10 "flat strip for flat things" gives way to
    the thali on the shelf (§5; to confirm).

## 7. Decisions recorded (8 Nov)

- ~00:30, chop: levels from the rules' table (kinds 1-4, chops 2-4-6-8); chop keeps its swipe.
- ~05:30, eggs: the "no" item from L2; counts rise; never slower by level; chai's redo; overcook like chai, then redo.
- ~06:10: publish what is built for his play; he defines each game's look; Fable's round not started. The shelf principle proposed (a
  shelf wherever named things are picked; a flat strip for flat things; none where nothing is picked), to confirm.
- ~16:00: yes to the six look decisions (publish chai's fixes; option 4 shelf, one rule, dough in a thali; shadows at half weight; the
  marble middle; the chai lab first; mocks chai and sekelo first), **amended** as §5 records.
- ~17:00: the shelf art at 0, 7, 29, 45 and top-down, each empty and with items; 29 (option 4) the key one.
- Evening (a note, weighed in §9): lock the visual and layout principles, then mock-ups by an art run he can start "sooner rather than
  later, because I think that might be the critical path"; what went wrong discussed while it runs.

## 8. Next (for the planning chat)

1. Zafar's go to publish chai's three fixes (or a permission rule for `publish.mjs`).
2. Done: the /feedback report, its rows and Fable's second reader; its seven questions are in §6.
3. Settle §6's twelve principles in one message ("yes to all except ...").
4. Agree §9's plan, or his changes, and launch its day 0.

## 9. Draft plan (Fable, for discussion; days removed, Zafar 8 Nov)

**Shape.** Two tracks at once. Track A, Zafar's: the principles, one ChatGPT **house art run** (the critical path, as he
says), then the mocks. Track B, the chat's: the shared layer, which needs no picture from him (27 of 34 rows are code, most sharing three
causes), the checks that gate every merge, then the games two at a time as their mocks and art land. A milestone he can play on `main` as each lands; no days or dates, every step starts as soon as the builder limit and its order allow (CLAUDE.md, Zafar 8 Nov). **$450-600:** Sprint 19's goal and budget; the pantry's polish slides again.

**Where I disagree with the document.** Its "Next" was one serial chain (kit, lab, mocks, art, games): the house run's list is already
decided, so it starts first and the shared layer the same morning; "a game's look is set by a mock-up before any builder starts" is right
for scenes, wrong for the shared pieces chai already defines. My own earlier "$200-270" covered the scene alone: too small. Two
builders at a time, not eight: eight was what no one could look at.

**Step 0 (Zafar).** Answers to §6; the go to publish chai. The orchestrator writes the house run's block (`/art-run`, about $15):
the shelf at five angles, empty and with items, containers on the ledge; low bowls at 29; board, trays and oil pan exactly top-down with
royalty-free references in the zip; one onion, one tomato and every item a card shows as a crate; three dough-ball options; the thicker
skewer. He runs it in the background while we talk through §2.

**Track B: the shared layer** (two builders at a time, the rule: cards and checks first, then lights, then the games' own fixes).
**Cards** (Opus high, $25-35): principles 1-4 and 11 in the shared card and pop-up; `UI.TYPE_ALL` on; the old strip, box and big-card
paths and `UI.done` gone; chai's frozen diff after each. **Lights** (Opus high, $25-35): principle 6, the stuck help in every game,
centred round lights. **Checks** (Sonnet high, $10-15): `sidebyside.mjs`, chai's frame beside a game's at order-in-sidebar, first-time
light, kind-tap, serve and well-done at 740x320 and 1280x665, one question, "Is this chai's kitchen? List every difference"; the
structural contract (band, base line, pill line, one light layer); `kitmap` gating `S.glow`, own graphics and backgrounds; contract rows
for no ✓, the light gone within 300 ms, a centred whole light, the floor once measured. Then **the scene** (Opus high, $30-40):
`Kit.scene` to Fable's 8 Nov design with shadow tokens and pre-blurred silhouettes; chai switched onto it, frozen diff clean; a lab
section with chai's, maani's and sekelo's items, the marble middle and the shadows beside today's. **Milestone 1: every
game on the 6 Nov cards, no ticks, ticking cards, the lights right; none worse; published.** The side-by-side runs on every game as a
baseline.

**Track A: the mocks.** When the house art lands the orchestrator judges and cuts it (about $20) and the scene
builder wires the shelf views into the lab. Zafar's mocks: chai and sekelo first (two ChatGPT chats over their `shelfshot` plates, his pick of the shelf angle; then the other eight in one sitting. Each becomes its look sheet at once; art lines
go to **art run 2** (his: chaat's bowl, samosa's one roll and fold, baking's and the stall's backdrops), code lines
to the game's brief. The samosa lab (one roll, his numbered choices) runs here.

**Then the games, two at a time, each merged only when `sidebyside` lists no difference the look sheet did not accept and the
orchestrator and Fable have looked.** Maani and sekelo (Opus high, $25, $30); daar and chaat ($30, $20: one stir in the kit for both
screens); eggs and corn (Opus $20, Sonnet $12); samosa and baking ($30, $20: samosa after his lab pick); chop (Sonnet high, $12). Each
onto `Kit.scene` with its §4 rows and its look sheet; mechanics and timings untouched except where a row says; Fable judges each pair
($10). **Milestone 2: maani and sekelo in chai's kitchen with the house art. 3: daar, chaat, eggs, corn. 4: samosa,
baking, chop; full checks; publish; his play; the look-back.** Language gaps show as grey English and never block; Mum's round, by game,
when she is free.

**Cost and time, honestly.** Builders $330-400; art judging, cutting and wiring $40-60; Fable's judging $50-60; the chat's briefs, look
sheets and merges $50-80: **$450-600**, over if a mock sends a game back to art (then cut chop, baking, the stall's backdrop, samosa's
redesign to Sprint 20). Zafar: the principles, the house run, the mocks, art run 2 and a play per milestone (his agreed review points). Nothing in track B waits on him; if only the house run is done, Milestones 1 and 2 still happen and 3 and 4 wait on the mocks.

**His first three things:** 1. answer §6 ("yes to all except ...") and say "publish chai"; 2. run the house art block;
3. two mocks, chai and sekelo, over the plates we send, and pick the shelf angle.

## 10. Checks and the eye judge (8 Nov experiment)

Zafar (8 Nov): codifying everything is a losing battle; automate what is quick and objective, and give an eye judge guiding principles
and a "would a premium, Toca Boca-level game ship this?" question. Tested: a blind Fable with a 38-question rubric and chai beside each
game (`build/reports/s18-eye-judge-experiment.md`) caught about a third to a half of his still-visible points on four games and about
25 he did not raise; it missed motion and timing, and fine shared-piece detail. **Recommendation:** about 25 automated checks for
objective things (text cut or overflowing, two lights, sound after a skip, English for the child, tap size, page errors, the end
reached, loading, a timing floor, and the shared pieces present: chai's card, Nani's box with its drop-down, the shared light, no tick
button); everything about look, clarity and feel to the eye judge with the rubric, full-size key frames, close-ups beside chai's, and
frame strips round onboarding; flaky checks fixed or deleted.

## Proof

Read (the orchestrator): Fable's two reports; the transcript (239 lines); the art bible's light and shadow rules
(`docs/design-language/art-bible.md` 84-98); the frozen-diff result (`build/reports/frozen-diff-chai-tray-202611081519.md`, clean); the
live sekelo frame (`build/screenshots/sandbox/s18-w3-full/cook-mishkaki-grill/1920x1080/05-kind-tap.png`); research on mixed perspective
and 2D shadows (Unity's 2D perspectives reference; Phaser's FX shadow docs and 3.60 devlog; Construct and OpenFL drop-shadow notes).

Read (Fable, the review): `docs/feedback/kitchen-play-2026-11-08.md` whole; the 40 named rows in `docs/process/regressions.md` (27 new,
7 reopened, SEK-24, CK-61, CK-62, DAAR-43, SH-235, CHAI-107) plus ART-29 and ART-60; `s18-feedback-1108-second-reader.md`;
`docs/sprints/S18-kitchen-family.md`; `docs/status.md` "Next chat"; `git log origin/main`; the art-run skill; `build/tools/review/` (no
`sidebyside.mjs` yet; `shelfshot.mjs`, `kitmap.mjs` exist); `js/cook/kitchen-kit.js` (no `Kit.scene` yet). No other file changed.
