# Sprint 13: One shared kit

**Status:** planned (agreed with Zafar 23 Oct; written 26 Oct). Starts when Sprint 12 is published.
**Opened:** - · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Every shared element sits in one central place, so one change reaches every game, quickly and cheaply. The elements: colours, textures, outlines, the bob and glow, cards (word, order, recipe), the order screen, end screens, the finger and help box, bubbles and buttons. And every future fix works first time across all areas.

## Why (from Sprint 12)
- Zafar's decisions lived in the docs, not the code. The third end page, for one: dropping it was decided, but the eye test still showed it.
- Each game had its own copy: four fingers, 62 files drawing their own glows, the clinic and Cook with their own help boxes.
- 52 places restyle a shared component, and 883 use raw values; the static check carries them all as "known".
- So a fix passed in one game and failed in the next. Wave 1's help kit needed four fix rounds to look the same in chai, the pantry and the clinic.

## Budget
About $120-160 and 2 days (Zafar to confirm at the start). Rapid-prototype checks: 1366x768 and 915x412.

## Step 1: the review (Fable, high, about $15-25; one report, no code)
`build/reports/s13-kit-review.md`. Read `js/shared/`, `css/shared/`, the static check's known list (`build/lint/static.mjs`), the contract checks (`build/sandbox/lib/contract.mjs`) and each game's own copies (grep for glow, finger, bubble, end screen, card, button).

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

## Step 2: the build (two builders at a time, Opus high; judge each)
- **S13-A: tokens and motion.** Colours, outlines, the bob, glow and finger timings, as tokens used everywhere. The 883 raw values shrink.
- **S13-B: components.** The word, order and recipe cards; the end screen; bubbles; buttons; the help box and finger. Each game's copy is replaced by the shared component; the 52 restyles go.
- **Then:** every game replayed at both sizes, the judge on a side-by-side sheet of each element across all games, and `/review`.

## Also in this sprint (small, from Zafar)
- **SH-110, reopened 26 Oct:** a card is never a memory test. Items are written in Kutchi when the order first comes; any blanked row has a clear speaker at its start that plays the word without penalty. This is the card component's first job in S13-B, if Sprint 12 didn't finish it.
- **The FC2 art block:** the face circles' moods and mouths. And CHT-16: the chop background.

## Outcome

## Look back (three lines)
