# Sprint 12: Polish

**Status:** closed (26 Oct 2026, published to `main`)
**Opened:** 22 Oct 2026 · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Every game a new player meets on day one (chai, the eye test, the door, the ride, the book) teaches itself the same way: one finger, one box, the item glowing; and nothing on screen contradicts what Zafar has asked for.

## Budget
About $230-290 and 2-3 days (approved by Zafar, 22 Oct). Scope is cut, never the budget. Rapid-prototype mode: three sizes, light targeted checks, one judge pass per builder.

## Sessions
- W1-A, the shared help kit and chai: EASY-03, EASY-10, EASY-08, SH-118, SH-119, SH-120, CHAI-32, CK-51, CK-50 (Opus, high; about $35) · report s12-w1a
- W1-B, the door, the ride, labs: DOOR-05, SH-68, DOOR-06, DOOR-07, DOOR-08, RIDE-03, RIDE-08, RIDE-09, RIDE-10, LAB-06, LAB-07, LNG-18, SH-19 (door, ride) (Opus, high; about $35) · report s12-w1b
- W2-A, shared UI: SH-104, SH-124, SH-125, SH-126, LNG-19, SH-123, ART-19, ART-08 (the circles), the known-list check (Opus, high; about $35-45)
- W2-B, the eye test: CLN-199 to CLN-204, SH-127, SH-128, SH-19 (eye), EASY-08 (eye), SH-115 (the lemon) (Opus, high; about $35-45)
- W3-A, the book: BOOK-10 to BOOK-14, SH-19 (book) (Opus, high; about $35)
- W3-B, loading and the served moment: CK-48 (Sonnet, medium; about $10), SH-121 (Opus, high; about $25)
- Art run (Zafar in ChatGPT; one paste block): CHAI-26 and CHAI-08 (from his eight pour frames, `sources/art/pour-reference-2026-10-22/`), ART-08, SH-115 (the lemon), ART-24, ART-25, ART-27, Nani's come-here wave

## Small decisions (Zafar, 22 Oct: yes to all)
1. The mic (SH-128): tap once; everything dims, a pop-up shows a live sound wave; it stops by itself after a second of silence, or a second tap sends.
2. The book's games (BOOK-11): find it = hear the word, pick the picture; name it, rebuilt = see the picture, hear three Kutchi words that really play, pick one; stick in the photo = read and hear a sentence, drag the picture in; "then we use" folds into stick in the photo.
3. The car (RIDE-08): mirror the car's art in code; redraw only if the mirror looks wrong.
4. Nani at the door (DOOR-06): about 20% bigger, the camera a little closer, the door still in view.
5. Zooms (SH-122): a match-cut, crossfading into close-up art lined up to the same framing in the zoom's last ~300 ms.
6. The pour (CHAI-26): his eight frames are the reference for a ChatGPT tilt sequence (4-5 steps); if the pan still isn't top-down and centred, the old pans come back (CHAI-08).
7. The doctor's new start (CLN-199) is built now; unrecorded lines show in grey italic English and are device-spoken while testing.

8. The art (Zafar, 23 Oct): the likenesses pass (the doctor, the girl, Nani and Nana circles; Nani's come-here poses). The pour frames turn the pan in the plane as it tips: the wiring places the glass and plans the pan's path from the hob so the turn reads as aiming the spout at the glass. The glasses stay in the tray; the pan is mirrored (hob pan and pour frames) and carried spout-first to the right, stopping up-left of the target glass (Zafar, 23 Oct).

9. The book (Zafar, 23 Oct, from `build/reports/s12-research-cefr-and-book.md`): W3-A also builds the spaced words (the book's pool draws from 1, 3 and 7 days back as well as today) and "Say it" as the first rung of Name it (the mic listens; the three speakers come after a try or a tap); Stick in the photo offers 2-3 pictures with short sentences; Find it's decoys are learned words. "What's missing" waits for the next sprint (ideas list); "Choose the reply" waits for Mum's question phrases (recording sheet).

10. The face circles (Zafar, 23 Oct): the new centred circles go in now; their moods and mouth shapes (happy, frown, two mouths each) come from a small FC2 art run in the next paste block.

Not this sprint: ART-26 (animal sprites, with the farm game); the "no" introduction at L2+ (CK-50 only removes "no" from L1).

## Outcome
Shipped (published 26 Oct):
- **Wave 1:** one help look in every game (no demo for taps, a still box with the item glowing and hopping, one finger, a darker dim, help from load), chai's ladder and full recipe card, no "no" at L1; the door, the ride (slower, the find list and its help, the car mirrored) and the labs toggles.
- **Wave 2:** the third end page off by one switch in every game; replies bigger with speakers and one tap; word cards; calm talking faces; the new face circles; the eye test rebuilt (the doctor's start, drops first, her half of the screen, the mic that now hears, the lemon).
- **Wave 3:** the book (find it, name it with the mic first, stick in the photo, spaced words, the page turn); the door's new art and come-here; the mirrored spout-first pour; the served moment.
- **Language:** Mum's 24 Oct sitting (C80-C103: 64 clips, about 20 draft words, 10 draft rules; spellings wait for Zafar).

Review: checks.mjs and 532 unit tests green; the contract replay of 15 flows at 1366x768 and 915x412, 0 breaks (`s12-review-1`, `-2`). The full evidence loop was not run (rapid-prototype mode).

Moved to Sprint 13: ART-08's one circle size everywhere (a shared component); SH-110, never a memory test; CK-48's last duplicate load (in js/shared/family-voice.js).
Spend: about $300-350 (over the $230-290 budget; wave 1's four fix rounds and the weekly-limit restart).

## Look back (three lines)
1. What worked: the independent judge caught real faults the builders missed every round (the dark pour, the squished girl, the mic that heard nothing).
2. What cost too much: every shared look was rebuilt game by game (four fix rounds for one help box), and hand-built judge batches missed frames, giving EVIDENCE verdicts.
3. One change: Sprint 13's shared kit, plus a capture helper and script-built judge batches.
