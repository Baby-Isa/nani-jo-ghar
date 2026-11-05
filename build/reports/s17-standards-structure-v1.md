# The chai standard and the stove gap analysis: the structure (draft 1, 5 Nov)

**Asked (Zafar, 5 Nov):** a MECE structure, with a lead developer's and a consultant's eye, for (1) the chai standard, codified so it
is a springboard for every family's standard, not just the stove's, and (2) the gap analysis between chai and the other stove games;
built from what Sprints 16 and 17 changed and why (`build/reports/s16-s17-change-ledger.md`, 118 changes). Structure only: the
documents are filled once he locks it.

## 1. The idea in five lines

1. **One standard, three layers.** Every rule is tagged House (every game), Family (every stove game) or Game (chai only). The
   House and Family layers are what other games inherit; chai is where they were found.
2. **Rules and values apart.** A rule says what must be true ("a thing stands on the shelf line; its label sits on the shelf's
   front edge"); a value says chai's number for it (the line at 818 of 900, labels at 860). Families copy rules and set their own
   values.
3. **Six domains, cut by who decides and what the child meets** (section 2), each split into areas. Every rule lives in exactly one
   area; every area is a row of the gap analysis.
4. **Each rule is testable and has a why**: his words or the lesson that made it, and how it is checked (an automatic check, or a
   judged picture).
5. **Proof of completeness:** every one of the 118 ledger changes maps to a rule, a value, or "a bug with no rule"; nothing unmapped
   (as `/feedback` maps every line of a voice note).

## 2. The domains (MECE)

The cut: what the child learns (A), what the child does (B), how the child knows what to do (C), what the child sees and hears (D),
how it is built and runs (E), how we know it is right (F). Values and the family's non-negotiables sit above all six (0).

| # | Domain | Areas | The question it answers |
|---|---|---|---|
| 0 | **Foundations** | 0.1 Non-negotiables (family voices, no invented Kutchi, no English for the child, nothing makes a child feel bad, halal and modest) · 0.2 Who the game is for (age, devices, a grown-up nearby) | Is it allowed? |
| A | **Learning design** | A1 The words (which, how many per level, first met where) · A2 The word ladder (support rungs: written, dotted, blurred; when they move; frozen per round) · A3 Words a picture can't show (the word moment) · A4 The leak test (no winning by reading, matching, eliminating, waiting) · A5 Language content (lines the engine builds, recordings, gaps shown grey) | Does it teach Kutchi, honestly? |
| B | **Game design** | B1 The round's sequence (word moment, arrival, the order, play, serve, thanks, end screen, next game) · B2 The mechanic (actions, states, timing windows, several at once) · B3 Levels L1-L4 (what changes: people, items, "no" items, amounts, support) · B4 Mistakes and consequences (undo, overcook, redo, never a verdict) · B5 Scoring and rewards (badges, coins, no sweets) | Is it a good game to play? |
| C | **Guidance** | C1 First-time help (the light: once each, the dim with its target, the zoom-in, the call after the light, New player) · C2 Stuck help (Nani's hint, the idle clock, rungs) · C3 Nani's box and the helper card · C4 Feedback in play (ticks, praise, the said card rolling up) | Does a four-year-old know what to do next, without being told off? |
| D | **Presentation** | D1 The frame and layout (side panel, play area, shelf band; sizes by height; safe zones; spacing rules; scrolling) · D2 Cards and shared screens (order card, word card, pop-out, end screen) · D3 Art and materials (pictures, views: top-down hob, side-on shelf; the marble, the stone; no code-drawn stand-ins) · D4 Motion (flights, folds, glides, pours; one owner per motion; a child's pace) · D5 Sound and voice (family voice, order of speech, effects, never waiting for speech) · D6 Colour, type and tokens | Does it look, move and sound finished? |
| E | **Build and platform** | E1 The shared kit vs game code (what lives in `js/shared/`, what a station owns) · E2 Rules and data (the central rules' levels, data files, tokens: no magic numbers) · E3 State (one owner, snapshots per round, redraws that keep animations) · E4 Devices and performance (phone, tablet, laptop; touch targets; loading behind; audio unlock) | Can the next game be built from it without copying? |
| F | **Verification** | F1 Automatic checks (contract, static, load, words, leak) · F2 Played evidence (L1-L4 at the four sizes, a child's pace, a pause driver, New player and Words known) · F3 Judged pictures (the judge, told-before shots) · F4 His play and feedback (the fix list, the second reader) | How do we know, before he plays? |

Why this cut is MECE: A-C are the child's experience by purpose (learn, play, be guided), D is its surface, E its construction, F its
proof; a rule about what something looks like is D even when it guides (the light's look is D, when it shows is C). Overlap rule: a
rule goes where its decision is made (the zoom-in's timing is C1; its colours D6).

## 3. A rule's row (the standard's tables)

| Field | What |
|---|---|
| ID | `STD-<area>-<n>` (e.g. STD-C1-04), stable |
| Rule | One testable sentence, the aim not the mechanism (lesson 5) |
| Why | His words in quotes, or the lesson that made it |
| Layer | House / Family (stove) / Game (chai) |
| Value | Chai's number, if it has one (or "see values sheet") |
| Checked by | The automatic check's id, or "eye: <state, size>" |
| Lives in | The file that owns it (one owner) |
| Source | Fix-list rows, ledger lines |

The values sheet is one table per area: the number, its unit, why that number, whether a family may change it.

## 4. The gap analysis

**Unit:** one game x one area (about 30 areas x 9 stove games). **Per cell:**

| Field | Values |
|---|---|
| Status | Meets chai · Partial · Missing · Different by design (Zafar's call) · Not applicable |
| Gap type | Adopt the kit (the shared code exists, the game doesn't use it) · Game code · Art · Language (recordings) · Design (a decision for Zafar) |
| Size | S (hours) · M (a day) · L (more) |
| Evidence | The audit's output or a shot, never the code alone (lesson 1) |

**How it is filled:** the audit tool (`build/tools/review/audit.mjs <game>`) runs the automatic checks per game at L1-L4 and the four
sizes; the rest by a judge on one sheet per area. **Read out:** a heat map (games x areas) and a list grouped by gap type, so "adopt
the kit" items are done once for every game.

## 5. Lessons learned (process rules, from the ledger's section 2)

Kept as their own table in the standard (domain F), each with the check that enforces it: checked at one level only; a fix measured
for one thing broke another; a second redraw lost an animation; space sized case by case; the narrowest reading of his words; "too
early" checked but not "never"; an adult's pace; state changed mid-round; by-design scrolling read as overflow; code-drawn stand-ins;
audio on phones; art cut artefacts; test artefacts; process.

## 6. How we fill it (my answer to "what's best")

The latter, as you suggested, with one addition. (1) Lock this structure. (2) Fill the new standard from the ledger and the fix
list, not from the old page. (3) Map all 118 ledger changes: each to a rule, a value or "bug, no rule": none unmapped. (4) Then read
the old `chai-standard.md` and `families/stove.md` line by line as the second check: anything they hold that the new one lacks is
added or consciously dropped. (5) The old page is retired, its history kept.

## Proof

Built from `build/reports/s16-s17-change-ledger.md` (118 changes, 14 lessons, 23 told-before rows) and the domain headings of `docs/design-language/chai-standard.md` and `docs/game-design/families/stove.md`.
