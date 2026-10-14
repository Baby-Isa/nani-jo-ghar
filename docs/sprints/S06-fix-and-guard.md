# Sprint 6: Fix and guard

**Status:** open
**Opened:** 14 Oct 2026 · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
The fix-list rows that code can fix are fixed and passed by an independent picture, every check that code can do is built, and the docs cut-down is finished; published to `main` for Zafar to play (decision 100: he does not play during the sprint).

## Budget
About $265–335 estimated, ceiling $350, 2–3 days. **Nothing is left out because of budget** (Zafar, 14 Oct): this overrides the template's "scope is cut" for this sprint; if spend passes the ceiling, the orchestrator says so and carries on.

## Sessions
None planned. Everything runs in the orchestrator's chat (Opus), with in-chat subagents where useful (Sonnet for the docs cut-down, the Opus `judge` agent for pictures), so nothing stalls on a permission prompt in another session (Zafar, 14 Oct). Branch `ccr-a7370759-t0lee7` (it carries the reset).

## Triage (14 Oct, 75 rows open, reopened or waiting)
- **Code (this sprint):** shared SH-10, SH-69, SH-81; Cook DAAR-13, DAAR-19, DAAR-20, DAAR-22, DAAR-23, SEK-13, CK-07, CK-21, CK-27, CK-31, CK-32, CK-35, CHAI-13 (the spoon drawn and visible), PAN-10 (the one-at-a-time guidance and folding box, Mum's words as grey placeholders); clinic CLN-26, CLN-37, CLN-45, CLN-100, CLN-104, CLN-106 (the wipe motion), CLN-116 (the grey flagged frame), CLN-118, CLN-126, CLN-127, CLN-138, CLN-140, CLN-141, CLN-143, CLN-144, CLN-145, CLN-146, CLN-148; tools LNG-12 (clip picker), ART-20 (the item table).
- **Art (the next run):** SH-37, PAN-06, CHAI-08, CHAI-13 (a real spoon), DAAR-02, DAAR-05, SEK-14, CK-06, CK-24, CLN-01, CLN-17, CLN-25, CLN-38 (household pictures), CLN-65, CLN-81, CLN-106, CLN-107, CLN-115, CLN-136, CLN-137, ART-05, ART-10, ART-11, ART-12, ART-19, ART-20 (the sprites).
- **Mum:** SH-70, PAN-10, CLN-38 (household words), CLN-119, LNG-01, LNG-04, LNG-06, LNG-08, LNG-10, LNG-11.
- **Zafar:** CK-01 (play L2–4), CHAI-01 (chai's fun pass), DAAR-07 (counter piles or a bowl), CLN-41 (tummy, hic and hair help), CLN-131 (fever card folds at the round's end?), CLN-139 (her card at diagnosis and send-off), CLN-116 (the certificate photo), MOD-02 (sofa, on his play list).

## Small decisions
- Order (Zafar, 14 Oct, "sure"): triage the open rows into code / art / Mum / Zafar and send him the non-code list; checks 1–3 first; then rows Clinic → Cook → Shared → Language; then checks 4–24; docs cut-down alongside.
- Judge: the `judge` agent on Opus; the one look before `main` also on Opus (no Fable).
- 14 Oct: the stale local copy of this branch (an S04 checkout, 50 commits not on origin) was renamed `stale/local-s04-a7370759` in the container, not deleted.

## Outcome
(at close)

## Look back (three lines)
(at close)
