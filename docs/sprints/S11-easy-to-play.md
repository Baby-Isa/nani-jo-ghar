# Sprint 11: Easy to play, easy to learn

**Status:** open
**Opened:** 22 Oct 2026 (Zafar's go: rapid prototype, light on tokens) · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Chai (with the kitchen conversation), the eye test, toothbrushing and the door are easy to play and teach their words gently: one live thing at a time, the real item demonstrates, hints at 0/5/15 s, no Next buttons, one word card whose English, picture and Kutchi fade per word over days, speaking as part of play. The full plan and its evidence: `docs/game-design/easy-to-play.md`.

## Budget
About $160-200: Step 0 (shared word card, progress, onboarding rungs, play log, leak bot on a learned save, the door; Opus high), then B-cook and B-clinic in parallel (Opus high).

## Sessions
- s11-step0 (Opus, high): the shared word card and fading, onboarding rungs with the real item, no Next or Done anywhere (one shared move-on hook), the play log, the leak bot on a learned save, the door on the card, the labs New player toggle, the art-run paste block.
- s11-cook and s11-clinic (Opus, high, in parallel after Step 0).

## Small decisions
- New player is a labs toggle: on, every launch plays a reset "New player" profile; Zafar's own player is never wiped (Zafar, 22 Oct).
- No Next and no Done anywhere, even if counts are no longer exact (Zafar, 22 Oct).
- Proof is light and targeted: checks.mjs, the touched leak bots, one named frame per claim at 1366x768 and 1480x924, one judge pass per builder (Zafar, 22 Oct).
- CK-27's splash stays off until the art-matched effects; the art run adds clinic pictures for the book (Zafar, 22 Oct).
- Fade order English, picture, Kutchi text; speaker always (Zafar, 21 Oct).
- Toothbrushing on a plus-shaped track; up *mathe*, down *niche* (Zafar, 21 Oct; Mum records).
- No repeat-after-me pause: speaking moments are play actions through `js/shared/speech.js`, never a gate (Zafar, 21 Oct).

## Outcome
(at close)

## Look back (three lines)
(at close)
