# Sprint 15: Cook, game by game

**Status:** closed (1 Nov 2026)
**Opened:** 30 Oct 2026 · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Every Cook game plays the Sprint 14 rules as chai's lab did, one game at a time, each played and passed by Zafar before the next starts.

## Why
Zafar's play of the Sprint 14 publish (30 Oct, `docs/feedback/cook-s14-play-2026-10-30.md`) found about twenty faults in four pages. The roll-out changed a dozen games in one unattended morning; the checks looked at still frames and scripted rules, so faults that only show over time (the order card before the customer, the whole chop board bouncing, a tint that never lifts) passed. The chai lab worked because he watched every step. Zafar, 30 Oct: "Do we need to go game by game like we did for chai?" Yes.

## How (Zafar, 30 Oct: "yes to all but 3")
1. **Chai first, as the reference.** The shared faults are fixed once, in shared code, and proven in chai: the item card only after the customer's order; the helper says the next item only when her card opens; the big card shrinks and moves at once; the speaker's gap; the cooker's tint and gold box clear. Zafar plays chai and says OK.
2. **Then one game at a time:** pantry, daar (chop), sekelo, maani, chaat, samosa. For each: fix his points and that game's open rows, film it start to finish at the four sizes (740x320, 930x430, 1280x665, 1920x1080), look at the film frame by frame, the judge, then Zafar plays that one game before the next starts.
3. **The clinic is Sprint 16,** the same way, with the "Bring me these" style card in every heal game (CLN-216).
4. **Art:** one list of every picture still needed and one paste block; Zafar runs it while chai is fixed.
5. Not taken: a half-screen window (about 630x650) as a recorded check size (Zafar: "let's figure out screens later, we have the main ones covered").

## Budget
About $90-140 and two to three days, all in this chat (Opus, high effort), no builders: chai about $15-25, each other Cook game about $10-20, the judge about $5 a game.

## Sessions
None: the orchestrator fixes in this chat (fast lane), the `judge` agent per game.

## Decisions at the opening (Zafar, 30 Oct)
- S14 questions 1-4: yes to 1, 3, 4; 2 changed (below). S13 questions 40 (centre the end screen's words when none are wrong) and 42 (pictures on the clinic's order rows, now CLN-216): yes.
- **No ripples** (SH-141): every tap demo gets chai's light (darker outside, the lit box, gold glow, the item's jump); the hand only on drag, hold and swipe, without its ripple.
- **Daar's chop** (DAAR-36 to DAAR-39): X is the number of kinds to chop, 1, 2, 3, 4 by level; the total chops 2, 4, 6, 8; each item 1 to 3 chops; the chop ends the moment the last chop is done; the fourth kind is **garlic** (grey "to record" until Mum records *lasan*; its pieces and pile from the art run, a stand-in until then).
- **Chaat at L4** (CHT-17): the speaker alone only where the words don't fit; otherwise the usual rules.
- **The helper says the next item only when her card opens** (SH-172), every game.

## Small decisions
- A replay of the order mid-play keeps every card and lights each as it is said again; the cards never go back to slots (Zafar, 30 Oct: "go with your recommendation"). `M.sayCard` already does this; contract-88 judges the order's first giving only.
- The helper card's speaker gap holds on a laptop too (Zafar, 30 Oct: "this was also an issue on laptop"): the side card (a window under 760 px tall, laptops included) measured 9 px against the item card's 9 px at 1280x665; a tall window stacks the card, its speaker centred as the item card's.

## Outcome

**Live on `main`:** c6cf44a1 (20261101T194110Z).

**What the sprint did** (it grew past its goal, on Zafar's spare tokens and his word):
1. **Chai, the reference game:**
   - three rounds of his notes: s15-chai-4 to -9, s15-chai-11, s15-chai-12
   - the shared rules proven in it: counts tick at the number; first-time-only onboarding; any right action restarts the hint; one pan's work never pauses another's; the card scrolls back on a restart; the tray faces on top; nobody's arms on the counter
2. **The language targets:**
   - research: about 1,000 words for A2 over 38 word groups, the top 40 verbs, what's recorded
   - the map of settings, games and word groups, reviewed by Fable
   - Zafar set A2 as the overall target
3. **18 games designed overnight** (designer, Fable critic, revision), 11 day drafts, the lessons checklist, 79 ChatGPT mock-ups made by Zafar, his answers applied.
4. **8 rapid prototypes in the labs:**
   - kitchen: eggs, baking, corn
   - farm: feeding, eggs, home at dusk, plant-grow-pick, the photo shoot
5. **Fable's code sweep:** 39 fixes plus the version-stamp bug; the live site 444 MB to 341 MB.
6. **The character pose register** (ART-34).

**Cut or moved on:**
- The game-by-game Cook roll-out (pantry, daar, sekelo, maani, chaat, samosa) did not start. It moves to the next sprint, after chai's final pass.
- The clinic's sprint (16) waits.
- Open rows: 201 open or reopened, 527 built and not re-played (`statuscounts.mjs`).

**Spend:** far over the $90-140 budget, by Zafar's choice to use spare tokens. About 25 million agent tokens, mostly the overnight design and sweep workflows (about 13M) and five builders.

## Look back (three lines)

- **Worked:** one agent per game, then an independent Fable critic, then a revision gave designs Zafar could approve nearly as they were. Rapid prototypes in the labs, with his notes beside the mock-ups, got games into his hands fast.
- **Cost more than it should:**
  - builders that proved prototypes at four sizes when he only needed a laptop playable
  - one builder started on `main` instead of the branch
  - the disk filled with leftover worktrees

  Brief prototypes as "laptop only, hand back when it plays", and remove a builder's worktree as soon as it's merged.
- **Process change:** chai is proper and everything new is rapid until Zafar picks it. Two lanes: the reference game gets full proof; prototypes get his play first.
