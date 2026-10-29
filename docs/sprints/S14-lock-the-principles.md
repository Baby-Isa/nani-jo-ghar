# Sprint 14: Lock the principles

**Status:** planned (Zafar, 26-27 Oct: the first sprint of phase 1; written 27 Oct). Opens after Zafar plays Sprint 13 and his feedback is in.
**Opened:** - · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
One short rulebook for "easy to learn, easy to play" that every Cook station and clinic game follows, each rule a check, starting with the chai-style order everywhere, tried by Zafar behind a labs switch before it is final.

## Why
The game grew game by game; Sprint 13 made the look shared, not the rules. Zafar wants consistency across modes so a child learns one way to play (26 Oct), and the rollout of Sprint 11's chai experiment (`docs/game-design/easy-to-play.md`) is still owed.

## How we work in it (Zafar, 26-27 Oct)
- **Fast lane:** small tweaks in the orchestrator's chat with the checks; one judge pass at the end.
- **Labs switch first:** each new rule that changes play goes behind a labs switch, rough, for Zafar to try on his phone; only what he keeps is built properly.
- **Builders** only for new mechanics or screens, one per game area, design settled first.
- Checks at four edge sizes: 740x320, 930x430, 1280x665, 1920x1080 (Zafar, 27 Oct).

## Decisions, 27 Oct (Zafar: "I agree with all except number four")
Order: the word cards in chai (phone and laptop, a gallery page, then behind a labs switch), then chai's onboarding, then the bug
sweep (each row re-read first in case the cards made it redundant), then the principles tried on the eye test. Rough publishes to
`main` behind the labs switch, the default unchanged. Tapping the dots or the eye is help and never moves a word on. The gold ripple
target replaces the hand everywhere. ?, home and book off the play screen now; one menu button later (a small cog at the sidebar's
foot). Nani's speaker goes; a tap on her face replays her. The highlight goes just around the picture. The next order is open
below. Both fonts shown in the gallery. Bubbles from a free-space map, worked out while playing. The pan and kitchen art run when he
says. No English line under Nani's instruction in normal play: "take it out for now". Screens (Zafar, 27 Oct, yes): two layouts
(phone, big screen) switched by height at about 500 px, each scaling smoothly; checks at the edges 740x320, 930x430, 1280x665 and
1920x1080 (replaces 915x412; the sandbox's sizes change in step 0 of the card work). The item card's English follows that word's own
ladder (Zafar: "each word has its own ladder"); his sketch for the rulebook, to agree: after level 1 the English goes, after level 2
the picture, after level 3 the written Kutchi (today's ladder, EASY-01: English blank at word stage 3, picture at 4, Kutchi at 5).

## The card lab, round 1 (Zafar, 27 Oct evening: "Now we're talking. Feels smooth and looks good")
Kept: the sideways order row on every screen (phone and big); the serif (Fraunces) for every display text (Kutchi, card titles,
bubbles, Nani's line, the order line), set in one place with the colours (tokens) so both change easily; cards pop out by the side
panel; the helper card stacked on tall screens, side by side on short ones; the move into the side panel. Changed: no green bar on
Nani's box, which is one helper colour in every mode (Cook, clinic); no hard dark corners; more room for long words in the side-by-
side helper; a rounded-square speaker to compare (option 8).

## The way we build a screen now (Zafar, 27 Oct: "This is the way we should be doing things")
1. Design first: his mock-up, or we talk, I write him prompts and he mocks it up in ChatGPT; he decides.
2. A lab page (`lab/`, a labs tile): fresh code on the shared tokens, nothing wired to the game.
3. My own check before he sees it: the four sizes (and a phone upright), every screenshot looked at, a script measuring every
   word inside its card (nothing spills); I fix what I find first.
4. A rough publish behind labs; he answers by number ("2A, 4B"); repeat.
5. Only then into the game, with the same check made automatic.

## Card lab, round 3 (Zafar, 27 Oct night)
Round speakers (the square went). The item card a little roomier. When one card's Kutchi wraps to two lines next to a one-line
one: option 8 shows A middle (his), B sitting on the English, C one size one line, D top. Fonts and text colours now come from
one place, the shared tokens (`css/shared/tokens.css`, "type"); the modes move onto them (SH-151).
Next, in this order: (1) chai's onboarding, redone in the same lab way at the four sizes; (2) the principles from chai locked as
the rulebook; (3) a plan to adapt and roll the new styling out to the other Cook stations and the clinic.

## Card lab round 4 and the onboarding lab (Zafar, 27 Oct night)
Kept: the Kutchi sits on its English (option 8A). Fixed: a hidden word keeps its place and size, its dots drawn over it (the big
card's style: big maroon dots for Kutchi, small grey for English), so a peek moves nothing; even spacing in the item card (padding =
picture to Kutchi = speaker to foot); every speaker, face and bubble plays (the game's stand-in testing voice, word by word, the
device voice for the rest; testing only). The onboarding lab ("Play chai" in the gear): the gold ripple target in place of the
hand, sized to its thing; the light hugs the picture; the first two items lit, then the light moves to the order card for a
moment (CHAI-37); the child alone after that, Nani's hint after the level's wait, the first hint teaching the arrow; the knob lit
to light the cooker, and again only once the chai reaches the green (CHAI-36); the glass lit for the pour; the first time words are
dotted, the help shows "tap the dots" once. A wrong pick shakes, no verdict. Options 9 (new or returning player) and 10 (level).

## Onboarding lab round 5 (Zafar, 28 Oct)
The ripple target went ("doesn't look good"): the rule, every game: a thing to tap is always lit (a breathing gold glow) in a lit
rounded box that takes in its word pill, everything else dimmed; an ingredient also bounces; a control (a knob, a glass, the
arrow) only glows; no finger, no target. After the first two items the whole order card is lit for a moment (no glow, no bounce).
Nani's helper card always shows everything (picture, Kutchi, English), never dotted: the order card's dots and eye are the small
help, the helper card the full answer. The order row scrolls itself: one ticked card at its left, then the current item; a ticked
card slides to just after the other ticked ones; "no" cards wait at the end; it stops once the last card is fully in view; a
child's own scroll is left alone until the next tick; the current card is not marked. Drag moves in other games (stir, roll,
swipe): the item itself makes the move once (his yes). The "no" card: a faded picture and a no-sign badge where a tick goes.

## Chai onboarding lab, round 1 (Zafar, 28 Oct)

His notes: `docs/feedback/chai-onboarding-2026-10-28.md`. "Yes to all, include the pour frames" (Zafar, 28 Oct): the lab's fixes
published as they are; the small art run (the pan exactly overhead in every state, its pour frames, the three glasses, the plainer
kitchen) before the next publish of the game; then the roll-out into the real chai behind a labs switch (its heat, ring and pour
kept), one builder, Opus high, about $40-60; the second reader run (5 fixes).

## The principles, round 1 (Zafar, 29 Oct, night)
Yes: the cards (one card everywhere, big where taught; dots and the eye are help only; the sideways order row; the helper card
always the full answer); the light (a lit box and a gold glow, an item bounces, a control glows, no finger). Hint waits 7, 9, 11,
13 s (`data/shared.json` helpMs, was 7, 8, 11, 15). Decoys from L1, one more a level where the space allows. The pink chai art is
a spare. To spell out next, as tables with a general-rule column: chai level by level; the word ladder's criteria per rung
(his idea: three right in a row and one in the book's review); chai's onboarding. The roll-out learns from chai going live
first. The rulebook is reviewed by Fable alongside `docs/architecture/target-model.md`. Later: the end card (time per level, ticks,
the bulb; show progress, not a score).

## Step 0: Sprint 13 feedback
Zafar plays Sprint 13 (the checklist in `docs/status.md`); `/feedback` makes rows; the fast lane fixes what blocks play; anything that is a principle goes to step 1.

## Step 1: the rulebook (one document, one review, no code)
Areas, each with: the rule in one line, why (research or his words), which games follow it today, the gaps, the check that keeps it.
1. **How an order arrives:** the chai style (said item by item in bubbles, a big word card that flies to the sidebar) for every Cook station and clinic step; how the clinic's doctor-led steps arrive (his C1, 22 Oct).
2. **What a level means:** L1-L4 the same in every game (support, written vs dotted with a speaker, decoys, one new thing per level).
3. **Help:** the help ladder, onboarding, the finger, the glow, the bulb (one timing table).
4. **Words and English:** word support and fading, English only on tap, the leak test, "to record".
5. **Moving on:** no Next buttons, undo until the step moves on, the end of an order, the end screen.
6. **Voice:** one speech queue, never wait for speech, what is said when.
7. **The screen:** the sidebar card and its fit on the phone, bubbles at the head, loading and the zooms.
Zafar answers a numbered list; each answer goes into the doc and becomes a contract check.

## Step 2: roll out (behind labs switches first)
The chai-style order first, in one Cook station and one clinic game, for Zafar to try; then the rest of the rules area by area; what he keeps is built for every game and judged once.

## Budget
To set with Zafar at the opening (expected well under Sprint 13's: no restructuring, fast lane for tweaks).

## Outcome

## Look back (three lines)
