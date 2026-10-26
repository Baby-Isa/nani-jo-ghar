# Sprint 13: One shared kit

**Status:** open (agreed with Zafar 23 Oct; written 26 Oct)
**Opened:** 26 Oct · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Every shared element sits in one central place, so one change reaches every game, quickly and cheaply. The elements: colours, textures, outlines, the bob and glow, cards (word, order, recipe), the order screen, end screens, the finger and help box, bubbles and buttons. And every future fix works first time across all areas.

## Why (from Sprint 12)
- Zafar's decisions lived in the docs, not the code. The third end page, for one: dropping it was decided, but the eye test still showed it.
- Each game had its own copy: four fingers, 62 files drawing their own glows, the clinic and Cook with their own help boxes.
- 52 places restyle a shared component, and 883 use raw values; the static check carries them all as "known".
- So a fix passed in one game and failed in the next. Wave 1's help kit needed four fix rounds to look the same in chai, the pantry and the clinic.

## Budget
What it needs; nothing moves to Sprint 14 (Zafar, 26 Oct: everything worth centralising is done this sprint, the parked games aside; the review's four-builder plan and methodology are fine). About $250-300 and 3 days for six builders in three pairs, judges and the review (Zafar, 26 Oct). Rapid-prototype checks at two sizes, laptop and Z Flip 5 (915x412); the tablet is close enough to the laptop; every size before the publish (Zafar, 26 Oct). Laptop = 1280x665, Zafar's Yoga Pro 7 measured in his Chrome (DPR 2); checks run at DPR 1 (same layout), art sharpness at DPR 2 before the publish.

## Step 1: the review (Fable, high, about $15-25; one report, no code)
Its report is build/reports/s13-kit-review (to write). Read `js/shared/`, `css/shared/`, the static check's known list (`build/lint/static.mjs`), the contract checks (`build/sandbox/lib/contract.mjs`) and each game's own copies (grep for glow, finger, bubble, end screen, card, button).

Answer:
1. **What should be central, and how.** Design tokens (colour, type, space, radius, shadow, motion: the bob, glow, timings), one component per element with a data-only API (games pass words and items, never styles), and where each lives. Check it against best practice (design tokens, a component library, contract or visual tests); keep the approach only if the review agrees it's best for a game this size, and say why.
2. **The move list.** Every place each element is drawn today: file:line, the game, what changes. Ordered by how often Zafar has hit it.
3. **The checks that keep it central.** For each element, one contract check that runs on every game; the static known list only shrinks; no CSS outside `css/shared/` may select a shared class.
4. **Anything else that would speed development, cut token cost and make fixes work first time.** Start from these, keep what the review agrees with, and add more:
   - **A shared frame-capture helper:** named strips at 250 and 500 ms with nobody tapping, at both sizes, ready for the judge. In S12, builders made their own, and judges returned EVIDENCE several times.
   - **Judge batches made by a script** from the builder's report and frames, not by hand.
   - **A "stuck player" test mode** for every help check.
   - **Briefs that list every place an element appears** (from a code map), so a shared fix is never applied to one game only.
   - **Model choice by kind of work:** the top model for judgement and design, a mid-tier model for capture, plumbing and mechanical moves.
   - **Smaller, single-purpose builders, with one fix round in their budget.**
   - **A rule for "done":** the judge's PASS on every game the element appears in, not only the one the builder looked at.

## Sessions
- **S13-R, the review** (Fable, high, about $20-30): launched 26 Oct; widened by Zafar (26 Oct) to every element that could sit shared, not only the list above. Report `build/reports/s13-kit-review.md`: done 26 Oct; 15 decisions to Zafar (decision 10 withdrawn: `input.js` has callers).
- **S13-T, the checking loop** (Opus, high, about $30-40): launched 26 Oct 14:30 UK, in-chat in its own worktree. Report `build/reports/s13-t.md`. Merged 26 Oct; its first script-made batch judged: sheets unreadable (thumbnails), pairs not by moment, still strips unflagged -> fix round; fix round merged 26 Oct (959f9fb).
- **S13-A1, colours, motion, page setup** (Opus, high, about $35-45): launched 26 Oct 14:30 UK, in-chat in its own worktree. Report `build/reports/s13-a1.md`. Merged 26 Oct; judge (Fable) 8 PASS of 8 (glow, finger, help ladder kit sheets; SH-124, SH-119, SH-19, CLN-203, DOOR-07).
- **S13-B1, cards and order screen** (Opus, high, about $45-55): launched 26 Oct ~16:00 UK; step 0 fixes the SH-110 and SH-123 probes (the before run caught both). Report `build/reports/s13-b1.md`. Merged 26 Oct (e7449e4): SH-110 in every game (dotted rows with speakers, nothing folds; CLN-114 retired), Cook's ladder through OrderCard, one card/pop-up/stamp; contract 0 breaks over 16 pages. Judge: SH-110 PASS, SH-123 and two kit sheets FAIL -> fix round merged (76c76c5), 0 breaks over 22 pages; judge running.
- **S13-V, voice, sound effects, saving** (Opus, high, about $35-45): launched 26 Oct ~16:55 UK after the judge's before check caught both its probes (LNG-16, CK-48); step 0 fixes them. Report `build/reports/s13-v.md`. Merged 26 Oct (893818f); judge: LNG-16 PASS (on a device-voice model), CK-48 FAIL -> loading fix round.
- **S13-A2, faces, buttons, finger, '?' pop-up, one glow** (Opus, high, about $40-50): launched 26 Oct ~19:45 UK; step 0 writes the SH-129..131, SH-134 probes. Report build/reports/s13-a2 (to write).

## Small decisions (Zafar, 26 Oct)
- Also shared this sprint: the voice player (the built `js/core/voice.js` path, wired everywhere), sound effects, saving (one copy) and the test hooks. Not shared: tap and drag handling (one open row; every mechanic at risk) and Cook's round runner (a rewrite of Cook's core); parked games out of scope.
- The checking loop: one command takes "before" shots of a builder's rows (the probe must show the problem first) and "after" shots; the script builds the judge's before/after batch, plus one side-by-side sheet per shared piece across every game (that sheet is "done"); builders never shoot their own frames; machine checks first; one broad sweep at `/review`. The existing evidence tool gains this; no second capture tool.
- Order: pair 1 T (checking loop) + A1 (tokens, page setup, motion); pair 2 B1 (cards, order screen, SH-110) + V (voice, sfx, save); pair 3 A2 (faces, buttons, finger, "?") + B2 (bubbles, end screen). Any shared file has one owner; overlaps run in sequence.

## Step 2: the build (two builders at a time, Opus high; judge each)
- **S13-A: tokens and motion.** Colours, outlines, the bob, glow and finger timings, as tokens used everywhere. The 883 raw values shrink.
- **S13-B: components.** The word, order and recipe cards; the end screen; bubbles; buttons; the help box and finger. Each game's copy is replaced by the shared component; the 52 restyles go.
- **Then:** every game replayed at both sizes, the judge on a side-by-side sheet of each element across all games, and `/review`.

## Also in this sprint (small, from Zafar)
- **SH-110, reopened 26 Oct:** a card is never a memory test. Items are written in Kutchi when the order first comes; any blanked row has a clear speaker at its start that plays the word without penalty. This is the card component's first job in S13-B, if Sprint 12 didn't finish it.
- **ART-08:** one shared face-circle component, so every place shows the same face size (S12's judge: popup, card and bubble still differ).
- **The FC2 art block:** the face circles' moods and mouths. And CHT-16: the chop background.

## Outcome

## Look back (three lines)
