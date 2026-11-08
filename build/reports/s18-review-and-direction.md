# Sprint 18: review and direction (8 Nov 2026)

One place for everything said on 8 Nov about the kitchen games: what went wrong, Zafar's play, the look, the decisions, and the
questions to settle before the next plan. Written by the orchestrator from Fable's two reviews, Zafar's messages and his voice note.
To be read in a fresh chat and turned into a plan there.

Sources: Fable `build/reports/s18-fable-what-went-wrong.md` (why) and `build/reports/s18-fable-look-review.md` (the look); the voice
note's transcript `docs/feedback/kitchen-play-2026-11-08-transcript.md` (times below are its own); its rows and causes in code
`docs/feedback/kitchen-play-2026-11-08.md` (41 points, each with its cause in code and its layer; 27 new rows and 7 reopened:
SH-236 to SH-243, MAA-20 to -22, SEK-25, DAAR-44, -45, CHT-18, -19, SAM-30, -31, CK-63 to -65, ART-61 to -64, LNG-24, PRC-12; reopened
SH-119, -149, -227, -228, -230, MAA-19, SEK-18).

## 1. Where things stand

- **Chai** is signed off and still loved ("clean, modern, beautiful"). Three fixes from today's play (the order card's jerk at a
  person change and at the half card, the item timings checked, the half-glass ding) are on the branch with a clean frozen diff;
  **not yet live** (the publish is blocked by the session's safety check; it needs Zafar's explicit go, or a permission rule).
- **The other nine games** are live on `main` for his play (20261108T142321Z). Their code runs on the kits' calls, but most kept their
  own looks and old copies of shared pieces. Zafar's verdict on several: "a million miles off"; maani and the corn stall "on the
  right framework".

## 2. What went wrong (and whose)

Fable's six causes, and the orchestrator's own share:
1. **The kit has no scene.** Chai's kitchen (worktop, stone band, slots, pills, its light) is five optional calls; a game could skip
   them. The kit even let a game add its own round glow.
2. **The briefs named functions, not the look.** "Done" was "0 contract breaks, copied code deleted". Every builder met it.
3. **No check measures the look**, and builders scored their own gap pages (they could write "different by design").
4. **The judging asked the wrong question** (clipping, English) with no chai frame beside each game.
5. **The orchestrator merged seven games in an hour on "0 breaks"** and never looked at one beside chai. Zafar (17:00-19:00 in the
   voice note): "at what point can you just use your judgment ... any human being would look at the tea game and be like this daar
   game is not the same style." That is right: the orchestrator should have refused those merges.
6. **The shared pieces were not carried over even where they exist**: the item card (the line above the speaker, the Kutchi and
   English alignment), Nani's box with its drop-down and one-line wrap, the dimmed onboarding with the rounded light, the order card
   that ticks as you go, no tick buttons. Zafar found them missing in maani, sekelo, daar, chaat, samosa and eggs.

Zafar's own share, in his words: "we put time, love and attention into tea ... some of these other games need some of that love and
attention as well"; and "maybe I'm over-prescribing ... use your wisdom ... and tell me how best to make this work".

**What the orchestrator will do differently (proposed):** a game is merged only when it sits beside chai at the same moments and an
eye (the orchestrator's, then Fable's) says it is chai's kitchen; the kit gives one scene a game cannot skip; the shared pieces are
the only way to draw a card, a light, a hint; a game's look is set by a mock-up Zafar likes before any builder starts.

## 3. Zafar's play, 8 Nov: themes across the games

These come up in more than one game; each is a principle to settle once (section 6), not a fix per game.

| Theme | Where heard | What he wants |
|---|---|---|
| Shared pieces missing | maani 1:02, sekelo 9:14-9:56, daar 17:00, chaat 20:04, eggs 23:00 | Chai's item card, Nani's box (drop-down, one-line wrap), onboarding dim and rounded light, in every game |
| No ticks, no "next" buttons | maani 5:38-5:57, chaat 21:18, samosa 22:04 | "No ticks hard and fast ... not a good game mechanic"; cut every tick and next-scene button |
| The order card ticks as you go | maani 6:16-7:24 | Each item ticks as it is done; "well done" when that person's whole card is complete, then the round ends |
| Onboarding light | maani 2:15-3:47, eggs 23:00-23:21 | It hugs the thing (never clips it or its pill); it leaves as soon as the child starts the task; one finger only |
| Item cards: one unit each | sekelo 10:09-11:28, eggs 23:32-24:07 | The order names the dish and count ("two fried eggs"); one item card per unit, each naming the unit ("fried egg"), so no "one" on cards |
| Top-down art | maani 8:07-8:27, daar 18:55 | Boards, trays, the oil pan exactly top-down; give ChatGPT a royalty-free exact top-down reference |
| The shelf | daar 19:05, chaat 20:57 | Items on chai's shelf (or a counter), never floating |
| Hints | sekelo 9:14, chaat 20:24-20:36 | The stuck hint arrives (it did not in chaat); Nani's English placeholder replaced in time |

## 4. Zafar's play, game by game (the points; rows to follow)

**Maani (0:00-9:00):** keep "one" in orders for now (it teaches the gender forms of one, 0:52); the item card lacks chai's line and
alignment (1:02); the onboarding box clips the images, the pills and the rolling board (2:15); two finger animations overlap (2:58);
the rolling lesson: one finger dragging the rolling pin up and down, or a pulsing circle, try both (3:07); the box should go once
rolling starts; the first time, rolling stops at the right size, then the light and a juice sound prompt the tap, with no finger
(3:34-4:30); the pan should not bounce: only shelf items bounce (4:35-4:57); the dough balls flashed as highlighted while one flew to
the pan (5:00); no lesson for the flip (5:28); a tick button appeared (5:38); the dough balls may not read as dough (5:58); the order
card did not tick as each was made (6:16-7:24); boards and trays not exactly top-down (8:07).

**Sekelo (8:43-16:45):** Nani's hint is English, a placeholder (9:14); the stuck hint wrapped to two lines when it fits one, and
Nani's box has no drop-down (9:26-9:47). **The order (his proposal, 9:56-16:39):** the order card holds four item cards, the four
pieces of the skewer, even if all the same, each ticking as it goes on; the order names the dish ("Muke sekelo khape" or the meat's
name, words for Mum), so the pieces' words (gos, the chicken) are separate from the dish's; one skewer per person; an order like
"first chicken, then three lamb" pops the chicken card, then a lamb card that stays while three copies shrink into the card in turn
(he prefers this to one card splitting into three). Plus the tomato crate picture for a tomato skewer (SEK-24).

**Daar (16:59-19:20):** the old order card's relic (a long strip with an arrow) cuts across the card; the item cards are not chai's;
no drop-down; a crate of onions where one onion is meant; after chopping, the old-style pop-up; the oil pan is not top-down (an art
run); the items are not on a shelf. **Stir** (19:26): split out from daar but a different dial, art and zoom from daar's own stir.

**Chaat (20:03-21:18):** no dimmed onboarding; the order card wrong; the hint to pick the next item never came for a new player; told
to put in the chillies straight after the potatoes (to check); perhaps a bowl on the counter or shelf, as chai; a tick button.

**Samosa (21:23-22:53):** no lesson for placing samosas in the pan; the item card a mess; six pastry rectangles do not work; the fold
animation does not work; the next button "horrible". **His idea:** go back to one roll; the game guides more and allows fewer
mistakes, which puts the focus on the language: you can't put in a wrong item, only the number asked, it moves on when done.

**Eggs (22:57-24:07):** the light round the eggs cuts the word pill; the pan's light circle is too small, off-centre and half on the
handle; the order logic (above).

**Corn (24:14):** not bad; the green zone is far too short; he asks for a rule that it is longer.

## 5. The look (shelf, shadows, marble, light, mock-ups)

**Zafar's ChatGPT redos** (maani, chai with shadows, sekelo with three shelf options) and ChatGPT's six findings, reviewed by Fable
and the orchestrator; Fable's full answer in `s18-fable-look-review.md`.

- **The shelf: option 4, the stone ledge with a front lip** (chai's own). The rule: the camera belongs to the surface: the worktop
  seen from straight above, the shelf from the front and a little above (10 degrees), the lip the line between them, everything on
  the shelf standing on that line with its contact shadow. Bowls for loose pieces; containers sit on the ledge, never float.
- **Dough balls** stay strictly top-down (Zafar), in a shallow thali on the shelf (Fable). Zafar (8 Nov): try maani's bottom panel
  both ways, the shelf and the plain band; he leans to the shelf.
- **Shadows: yes, at about half the mock's strength.** One upper-left light; a contact shadow under everything, fading down-right
  (the art bible's rule, never fully applied). Built two ways: a pre-made soft silhouette for each fixed object (hob, board, trays,
  tawa); the existing soft oval for things that move (shelf items, pans, pieces), one shadow per skewer that grows. Not Phaser's
  shadow effect (WebGL only, costly on phones). No light streaks on the worktop.
- **The shadow on the back of the bottom panel** (ChatGPT's chai): the orchestrator's call, as Zafar asked: **no.** The band is the
  shelf's front face, not a wall behind the items; a shadow climbing it would read as a wall and break the two-camera rule. Shadows
  fall on the ledge only, as in option 4.
- **The marble:** a careful middle: today's colour (white, never yellowed), its veins somewhat stronger and cool, so it reads as
  stone on a phone. Tried side by side in a lab before it changes.
- **ChatGPT's six findings:** 1 walnut board, bevelled: agree. 2 thicker skewer: agree. **3 the tray: its size in the mock is right**
  (Zafar, 8 Nov: that screen has one board and one tray; the two trays and the grill are the next screen; "deeper, not bigger" was the
  orchestrator's mistake). 4 piles instead of bowls: disagree, keep bowls. 5 one upper-left light: agree. 6 balance: agree.
- **ChatGPT for every screen (Zafar, 8 Nov): yes.** It is good at proportion and placement for the screen it sees. Start from each
  game's current screen (the developed games' layouts already fit their constraints) and let it improve; for the least developed
  (the corn stall) give it more room. Every brief carries the house lines: the camera rule, the shelf, the light, the shadow weight,
  the marble, walnut, no text, only the game's own items (the sekelo mocks invented murgi and dropped makai), the space other pieces
  need (the count pills, the side panel, the gear). Each mock becomes a one-page look sheet (numbered changes, each art, code or
  rejected). Exact top-down reference images attached for boards, trays and pans.
- **The shelf art (Zafar, 8 Nov, amended):** one art run draws the one shelf at a set of angles, each **empty and with items** (so each
  angle's contact shadows are captured too); more angles are cheap in one run and give consistency. **Measured (8 Nov):** a round rim's
  height over its width is the sine of the camera's angle: ChatGPT's option 4 bowls measure 0.48 (both bowls), **about 29 degrees**;
  chai's jars today measure about 0.12, **about 7 degrees**. So the set: 0, 7 (chai today), **29 (the key one, option 4)**, 45, and
  top-down. One shelf has one camera: each game's shelf and everything on it share one angle (low bowls need about 30 to show what is
  in them; tall jars read best near side-on). Which angle each game uses: decided from its mock. Fable's "10 degrees" was wrong for
  the mock; the orchestrator's three views too few.
- **Containers drawn on the shelf, then cut (Zafar's idea):** yes: drawn standing on the ledge, the contact reads real; cut with its
  shadow as a separate layer (the art bible's edit-in-place cut).

## 6. Principles to settle (decisions for Zafar, with recommendations)

1. **Shared pieces only.** Every game draws its item cards, Nani's box, the onboarding light and the order card through the shared kit;
   a game's own copy is a merge blocker. (Yes.)
2. **No ticks, no tick buttons, no next-scene buttons** in any game. (Yes: his words.)
3. **The order card ticks as you go;** "well done" from the person when their whole card is complete; then the round ends. (Yes.)
4. **One item card per unit.** The order names the dish and the count; each item card names one unit; no "one" on a card. A skewer's
   card holds its four pieces. (Yes; the Kutchi for each dish to Mum: the questions sheet organised by game.)
5. **One order per person** in these games (other modes keep multiples). (Yes.)
6. **Onboarding:** the light hugs the thing and its pill; it leaves when the child starts the task; one finger at most; only shelf
   items bounce. (Yes.)
7. **Timing:** each game keeps its own timings (7 Nov), with **a floor**: no green window under a set minimum (he asks this for the
   corn stall). Recommend a floor of 1.5 s at L4 for every timed window, each game free above it. (To decide.)
8. **Samosa:** one roll, more guidance, fewer ways to go wrong, the focus on the words. (Recommend yes, designed in a lab first.)
9. **The look:** sections 5's choices: option 4 shelf, shadows at half weight, no back-panel shadow, the marble middle, mock-ups per
   screen from the current layouts. (Yes; the marble and shadows tried in a lab first.)
10. **The merge rule:** nothing merges until it sits beside chai and an eye passes it. (Yes.)

## 7. Decisions recorded (8 Nov)

- ~05:30, eggs: the "no" item from L2; counts rise; never slower by level; chai's redo; overcook like chai, then redo.
- ~06:10: publish what is built for his play; he defines each game's look; Fable's rebuild round not started.
- ~17:00: the shelf art at several angles (0, 7, 29, 45, top-down), each empty and with items; 29 degrees (option 4) the key one.
- ~16:00: yes to the six look decisions (publish chai's fixes; option 4 shelf, one rule, dough in a thali; shadows at half weight;
  the marble middle; the chai lab page first; mock-ups chai and sekelo first, then the rest), **amended:** the tray's size as in the
  mock; ChatGPT mocks for every screen, starting from the current layouts; maani's bottom panel tried both ways; the shelf drawn in a
  few views; containers drawn on the shelf then cut; the back-panel shadow left to the orchestrator (no).

## 8. Next (for the planning chat)

1. Zafar's go to publish chai's three fixes (or a permission rule for `publish.mjs`).
2. The /feedback report and rows are in (`docs/feedback/kitchen-play-2026-11-08.md`); its seven questions fold into section 6
   (the counting rule, one skewer per person, how the pop-up shows a count, samosa, the green floor, judgement, the hop rule's words).
3. Settle section 6's ten principles.
4. A plan in that chat: likely (a) the kit's one scene and the shared pieces made compulsory, with the side-by-side check; (b) the
   chai lab (shadows, marble) for his eye; (c) ChatGPT mocks per screen; (d) an art run (top-down boards, trays, the oil pan; the
   shelf views; bowls); (e) the games, two at a time, each merged only beside chai.

## Proof

Read: Fable's two reports named above; the transcript (all 239 lines); the art bible's light and shadow rules
(`docs/design-language/art-bible.md` 84-98); the publish and frozen-diff results (`build/reports/frozen-diff-chai-tray-202611081519.md`,
clean); the live sekelo frame (`build/screenshots/sandbox/s18-w3-full/cook-mishkaki-grill/1920x1080/05-kind-tap.png`). Research on
mixed perspective and 2D shadows: Unity's 2D perspectives reference; Phaser's FX shadow docs and 3.60 devlog; Construct and OpenFL
notes on drop-shadow cost (links in the 8 Nov chat).
