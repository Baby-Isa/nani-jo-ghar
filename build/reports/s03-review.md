# S03 review: the end-of-sprint check before the publish

Reviewer: the orchestrator (built none of A–D). Branch `ccr-a7370759-t0lee7`. 8 Oct 2026.

## Flaws first (going live as they are, for Zafar's play)
1. **Taste spots** (D's redraw): matte red, green and blue balls; Fable passed them, but at play size they can still read as felt balls or gumballs (CUL-02). Judge in play.
2. **The girl's "cold" face** reads more as a wince than a shiver.
3. **Kadchi** handle a little stubby (foreshortened to clear the dial).
4. **800x360 tooth L3 sidebar:** the "to record" tag runs into the eye button (new row SH-65).
5. The heal pop-up card is the same size as Cook's (about a quarter of a 1366 screen); the rows' text is small but not clipped.
6. Existing, also on `main`: an empty marble frame for a moment between the daar order and the chop; the end screen's left half stays empty when nothing was wrong (SH-03, decision 18 of the Cook play); 255 lines still have no family clip (voices are Sprint 4).

## What the review fixed
- **The request pop-up scrolled** on tooth L3 at 800x360 (391 px in 324): it now gives back padding on short phones and, if still too tall, shrinks whole; the speaking face keeps its 44 px tap size (`request-popup.js` `fitCard`, `order-card.css`).
- **Clinic stage changes now stop the voice** (S03-A's flaw 3; `screen.clearStage` calls `VoiceStop.stop`): no heal-game line reaches the send-off (CLN-109).

## Proof
- Full gate `s03-gate` (224 flows, 493 pages, every flow's sizes, 64 min): 0 flows short of their end, 0 page errors, **1,745 old findings fixed**, 1 new (the pop-up scroll, fixed). Recheck `fix-rq2` (tooth L3, cut, fever, chai-tray, pharmacy at 800x360, 844x390, 1366x768): **CHECK PASSED**, 0 new. Baseline shrunk (1,745 dropped; 23 new flows' entries appended; the pop-up entry removed).
- Sound: the same flows on `main` and the branch play identically (33 silent in the test build, 4 family): the voice stop mutes nothing it shouldn't.
- `checks.mjs`: unit 229/229, words 0 literals, bump ok, load 21/21. Leak bots passed in C and D.
- Looked at: the pop-ups (tooth L3 800x360, scrape, chai, pharmacy), fever L1 start and mid, scrape, taste, tooth end, eye test, boing, diagnosis L3 at 800x360, send-off, daar flow beside `main`, every new art source (contact sheet).

## Regression rows
A–D reconciled their areas against the code (decision 73): 147 open → 37 at the session ends; most moved to "built, not re-played", which Zafar's Sprint 4 play confirms or reopens. New row SH-65. Rechecked on the shots: CLN-84, CLN-109, SH-64 (pop-up and voice), CLN-105 (fever), CLN-103 (old drill), CLN-65 (states wired), DAAR-02, CLN-104.
