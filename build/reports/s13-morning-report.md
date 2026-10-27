# Sprint 13: morning report (27 Oct)

**Live:** https://baby-isa.github.io/nani-jo-ghar/labs.html (958335e0, version 20261027T040444Z, published 04:07 UK; Pages served it after 161 s; screenshot `build/screenshots/publish/20261027T040444Z-labs.png`).

## What changed for you to play
- Every game draws its cards, faces, buttons, help finger, glow, bubbles, "?" pop-up and end screen from one shared kit: one fix now lands everywhere.
- Orders (SH-110): written in Kutchi when they arrive; every row has its speaker at the left; nothing hidden for memory (the clinic's closed L3 card is gone); English on a row or word card only when tapped.
- Loading (CK-48): every station drawn within about a second of tapping the card, no light-brown screen.
- The customer's opening "Muke …" (LNG-16): fixed on a model of a phone's voice; your ear on the Z Flip is the real test.
- On the phone, long orders fold two or three rows to a line so the card always fits with full-size speakers.

## Your checklist
In `docs/status.md` "Next chat" (seven points, about 20 minutes on the Z Flip and the laptop).

## Known and logged (S14's fast lane)
- SH-137: the clinic still has its own face tile, word card (landscape) and order card title bar.
- SH-135: the door's Ha!/Na! pills and Cook's paler buttons; the help's gold box with the clinic's white tile (question 38).
- SH-136: small looks on the phone (Nana's badge on his card's edge, no reveal eye on folded rows).
- SAM-27: samosa L3 ticks each samosa as made (question 41).

## Questions
38-43 in `docs/questions.md`.

## The night
Three container restarts (about 23:10, 00:10, 01:29) cost roughly an hour; no work was lost. Spend: roughly $350-450 against the $250-300 estimate (see the sprint file's look back).

## Proof
- Final contract replay `s13-final2` (34 main flows plus chaat#hint, 1280x665 and 915x412): 70 pages reached their end; 2 breaks, both contract-50 on samosa L3 (SAM-27).
- Final kit judge: `build/reports/s13-verdicts/s13-final-kit.verdicts.md` (7 of 12 one look); every round's verdicts in `build/reports/s13-verdicts/`.
- `node build/tools/review/checks.mjs`: green before the publish (570 unit tests, leak bots, load 29/29).
