# Sprint 19: chai's standard everywhere (the shared layer first)

**Status:** open (Zafar, 8 Nov: "go ahead ... start that now"; most of the plan agreed, no principle agreed yet)
**Opened:** 8 Nov 2026 · **Closes at:** the publish to `main`, Zafar's play and `/feedback`. Integration branch `ccr-87413d9b-j48fpk`.

## Goal
Every kitchen game on chai's shared pieces (cards, Nani's box, the ticking order card, the lights and first-time lessons, the stuck
help), no tick, next or X buttons, Fable's code-fixable eye-judge flaws fixed, and the checks audited one by one and gating every merge.

## What Zafar said (8 Nov, evening)
- Go: every fix that needs no decision (the shared pieces and Fable's flaws), and the checks: each existing one audited ("written in
  blood"; kept if it has caught things and costs less than it is worth), plus the three-part gate and the eye judge's rubric.
- **Not** agreed: the principles (section 6 of `build/reports/s18-review-and-direction.md`) and anything else; he reviews them with the
  art. **Not** to publish chai's three fixes. He has started the art run himself.
- Plans run back to back: no days or dates (CLAUDE.md).

## Budget
About $150-210 for the four builders below; the rest of the plan (the scene, the games onto the house art) waits on his review of the
principles and the art.

## Sessions (two builders at a time; each starts as a slot frees and its files allow)
1. **s19-cards** (Opus, high, $40-55): cards, Nani's box, ticking order card, no tick/next/X, relics gone, one-thing card pictures, Fable's text flaws. **Merged** (rows 100, 103, 104, 108 clean on 40 pages; 101 fails on samosa L1 740x320; maani's pop bubble, sekelo's two-word English and chop's 'chop again' card not done: in its report).
2. **s19-checks** (Opus, high, $40-55): the audit of every check, the shared-piece code checks, `sidebyside.mjs`, frame strips, the rubric. **Merged** (177 checks: 160 kept, 14 fixed, 3 retired with reasons, code kept; contract-100 to -109; checks.mjs about 2.5 min). Its dry-run judge was done by the builder itself: the real judge runs on the first merge.
3. **s19-lights** (Opus, high, $35-50): one light and finger, room, gone on the move, shelf-only hop, stuck help everywhere; maani's, chaat's and samosa's first times. Phase 1 merged; phase 2 (the games' files) running.
4. **s19-games** (Opus, high, $35-50): Fable's flaws in sekelo, daar, eggs and corn; CK-63, CK-61, DAAR-43, CK-65; stir and knead onto the kit's demo. **Merged** (corn's green now at least chai's at every level; open: eggs' lesson light under the order card's face at phone sizes, a few probe races; ART-66 to -68).

**Judging, split (Zafar, 9 Nov):** the automatic checks (behaviour: cards, lights, help, no ticks, page errors, the end reached) gate every merge now; the eye judge beside chai (look and layout) waits until each game is on its new scene and art, and each game's gap list comes from the mock-up review (`sources/art/s18-mocks/results/`, the review page); nothing is published without Zafar.

## Publish (Zafar, 9 Nov)
Once s19-lights is done: publish everything since the last publish together: the behaviour work (cards, no ticks, lights, games' fixes, checks), **chai's three fixes** (his go) and the lights. After /review and checks.mjs; the mock-ups' folders stay out of `assets/`.

## Art, round 2 answered (Zafar, 9 Nov)

His note: `docs/feedback/kitchen-mocks2-2026-11-09.md` (19 rows). The proposed plan, waiting on his yes: (1) the orchestrator, no ChatGPT:
sekelo's skewer spacing check in code, the samosa fold's geometry guide, the stone tray spec; (2) a mini art run (his one ChatGPT
chat, about ten images: the stone tray with bowls, the grill top-down with lively coals and skewers on the trays and grill, four chaat
topping layers, the samosa fold, two egg pans, the baking bowl glass and opaque, the oven between green cabinets); (3) test screens
composed in code with chai's hob at the four sizes for his picks; (4) the full art run; (5) builders, two at a time.

**His answer (9 Nov): yes to all 13 and the plan, except:** no question to Mum about the fold ("the more important thing is what
we can execute"); baking keeps concrete amounts only, a little / a lot / a bit more / a bit less go to another game (a review of the
prototype and clinic games, CK-72); the oven's shelves are dotted tray outlines, top, middle and bottom (CK-70); chop's hop is built
in the standalone chop game first (CK-71).

## Answered 9 Nov, late
- The samosa folds from a round sheet (his video; SAM-21). The publish gate runs only the modes a sprint changed; the full gate before
  the stores (yes). Knob rule refined (SH-247). Chop's hops semi-random, never together (CK-71). Builders' checks: no new rules; the
  orchestrator reviews the decisions already made and lays them out (build/reports/s19-check-rules-review.md).

## Waiting on Zafar (his review point: the principles with the art)
The counting rule (SEK-25, CK-64), sekelo's one skewer per person, the timing floor, samosa's redesign, the scene for every game, the
shelf angle, the timed windows' look (sekelo, daar, eggs), one stir (DAAR-45), the merge rule, chai's publish.

## Outcome

## Look back (three lines)
