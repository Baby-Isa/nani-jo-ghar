# The chai standard and the stove gap analysis: the structure (draft 2, for Zafar to lock, 5 Nov)

**How this was made:** draft 1 (Opus) → Fable's review (`build/reports/s17-standards-structure-review.md`: 7 of 15 test rows did
not place cleanly, progression had no home, a scope was missing) → this second pass, which takes most of Fable's structure and makes
it lighter to fill. Built from the Sprint 16-17 ledger (`build/reports/s16-s17-change-ledger.md`, 118 changes).

## 1. The structure in seven lines

1. **The unit is a rule:** one testable sentence answering one question. A fix-list row may give several rules.
2. **Nine domains, one question each** (section 2). Every rule sits in exactly one area: the area whose question it answers.
3. **Four scopes:** House (every game), Engine (every Cook game), Family (every stove game), Game (chai only). Other families
   inherit House and Engine as they are, copy Family as a starting point, and leave Game behind.
4. **Four layers of content, general to specific:** a glossary (our names for every part, mapped to his words), patterns (about 14
   reusable solutions, e.g. "whole, then part"), rules (each cites its pattern), values (chai's numbers, each with what it is
   derived from, so a family re-derives instead of copying).
5. **Each rule says how it is proven and where to see it** (a lab link reachable in a minute), with a dated status, so a reversed
   decision shows which word is newest.
6. **The gap analysis reads the same structure:** each stove game scored per area on one proof scale, worst areas expanded to rules.
7. **Completeness is proven, not claimed:** every ledger change, and every ID the old pages cite, is placed once (a rule, a value, a
   lesson, or "not a standard"); anything left over is the dropped list, for your yes.

## 2. The domains

| # | Domain | Its one question | Areas |
|---|---|---|---|
| 0 | **Foundations** | Is it allowed, and for whom? | 0.1 The non-negotiables (pointers to CLAUDE.md, never restated) · 0.2 Who it is for (3-7, a grown-up near, no reading, touch, the four sizes) |
| A | **Learning** | What does the child learn, honestly? | A1 The words (which, how many, which decide the round) · A2 The word card's support (written, dotted, blurred; the blur rule) · A3 Words a picture can't show (the word moment) · A4 Language lines (built by the engine; missing Kutchi as grey English) |
| B | **Play** | What does the child do? | B1 The round's steps (word moment, arrival, the order, the work, serving, the thank-you, end screen) · B2 The mechanic (actions, timing windows, several at once, mistakes, consequences, undo) · B3 Counts and amounts · B4 Feel (a response to every action, payoff moments, pace; rewards, never sweets) |
| C | **Progression** | How does it change over time? | C1 Within a round (who asks first; half before full) · C2 Across levels L1-L4 (what each adds) · C3 Across the word ladder (when support moves; frozen per round) · C4 Across games and days (where a word is first met; the next game) |
| D | **Guidance** | How does the child know what to do? | D1 The first time (the light: once, its dim with its target, whole then part, its call after it) · D2 When stuck (the hint names the next thing; every right move resets the clock) · D3 Nani's box and the helper card · D4 Feedback in play (ticks, praise, the card rolling up) · D5 The grown-up's door ("?" pop-up, settings, the end review) |
| E | **Presentation** | What does it look, move and sound like? | E1 The frame (side panel, play area, shelf band; sizes by height; safe zones; spacing of things relative to the screen; designed scrollers) · E2 Components (one entry per glossary part: look, fit, placement) · E3 Art and materials (views; the marble, the stone; no code-drawn stand-ins) · E4 Motion (every moving thing: time, curve, never a jump; a child's pace) · E5 Sound and voice (effects, the order of speech, never waiting for it) · E6 Tokens (colour, type, corners, shadows) |
| F | **Build** | How is it made so the next game inherits it? | F1 Kit vs game (what lives in `js/shared/`, `js/cook/`, a station) · F2 One source of numbers (tokens, the rules file; no loose numbers) · F3 State and redraws (one owner per moving thing; snapshots; declared scrollers) · F4 Devices and loading (48 px taps, audio unlock, the next game loads behind) · F5 Test hooks (lab switches such as Words known, loggers) |
| G | **Proof** | How do we know, before you play? | G1 Automatic checks (contract, static, load, leak; the audit) · G2 Played evidence (levels, sizes, new and returning player, a child's pace) · G3 The judge (films, sheets, told-before shots) · G4 Your play (fix list, keep list, the second reader) |
| H | **Supply and roll-out** | How do art, voice and a new family arrive? | H1 Art (run blocks, sizes, cutting) · H2 Voice and words (Mum's sheet, rounds, the Kutchi gate) · H3 A family's entry checklist · H4 Open items (a question for you, a word for Mum) |

**Your words, placed:** playability = B and D · visuals and visual structure = E1-E3, E6 · spacing of items relative to the screen
= E1 plus the values sheet · polish = the proof scale (how far each area is proven) plus E4-E5 · sequencing = B1 and C1 · logic of
progression = C · code-based structuring = F.

## 3. The four layers of content

**Glossary** (about 25 parts): ours, his words, the file. E.g. "order card" (his "menu card"), "Nani's box" ("hint card", "green
box"), "the light" ("onboarding", "highlight"), "the word moment" ("word focus"), "the frame" ("left bar", "bottom panel").

**Patterns** (Fable's 14, kept): P1 free-space placement · P2 the first time once, then only the stuck hint · P3 whole, then part ·
P4 one owner per moving thing · P5 a snapshot at the round's start · P6 declared scrollers · P7 ticks when reached · P8 said, then
shown · P9 consequences in the thing, never a verdict · P10 real pictures, not stand-ins · P11 scale together to a floor · P12 every
right move resets every clock · P13 load behind, never a wait · P14 English only behind the grown-ups' door.

**Rule row** (eight fields required, four optional; Fable proposed thirteen, trimmed so ~150 rules can be filled):

| Field | Required | Example |
|---|---|---|
| ID | yes | STD-D1-07 |
| Rule (the aim, one sentence) | yes | A light on a small part of a thing lights the whole thing first, then shrinks onto the part |
| Why (your words, the lesson, or praise) | yes | "make it a generalizable principle/rule" (5 Nov) |
| Scope | yes | House |
| Pattern / part | yes | P3 / the light |
| Checked by | yes | a contract check (to build), or "eye: <state, size>" |
| See it | yes | chai L2, New player, 1280x665 |
| Status (dated; reversals kept newest first) | yes | agreed 5 Nov |
| Value · Lives in · Impact · Source rows | optional | 0.65 s + 0.45 s · `js/shared/onboard.js` · stuck · SH-213 |

**Values sheet** (one table per area): name · value or formula · unit · derived from · token name or "to tokenise" · may a family
change it. First rows: the shelf line at 818 of 900, labels at 860; the side panel's 2.5-card floor; 48 px taps; the zoom-in 0.65 s +
0.45 s; the spout 0.4 of a glass above the rim; half at 0.42; Nani's box folding in 0.5 s; the four sizes.

## 4. The gap analysis

- **Proof scale, one per cell:** 0 not applicable · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 your "done".
  Plus "different by design" with the date you decided it.
- **Two passes, so it stays small:** first area x game (about 30 x 9, from the audit tool and one judged sheet per area); then only
  the areas below 3 open up to rule x game. (Fable proposed rule x game everywhere; at ~150 rules x 9 games that is 1,350 cells.)
- **Next step per gap:** Kit (move chai's code into the shared kit) · Adopt (a game calls the kit) · Game code · Art · Words (Mum) ·
  Decision (you) · Check. Size S/M/L, and once-for-all or per game.
- **Priority:** stuck > wrong (learns wrongly, or wins without the Kutchi) > feels bad > unfinished > cosmetic; then how many games
  it reaches; then size.
- **Read-out:** a heat map (domain x game, a readiness bar per game); the once-for-all list in order (Kit, then Check, then Adopt);
  per game, its steps by impact and a "do not touch" list of what you liked.

## 5. Lessons, by root cause (an appendix: "why the checks exist")

R1 We looked at one state (one level, one size, an adult's pace, "too early" but never "never") · R2 We measured one property (size,
not place) · R3 Two owners of one thing (a second redraw, a mid-round change) · R4 We built the case, not the rule · R5 Stand-ins read
as real · R6 Platform rules forgotten (phone audio) · R7 Evidence misread (test artefacts) · R8 No owner (a shared row no sprint
took) · R9 Unreachable states (a lesson you couldn't get to). Each becomes an automatic check where it can, else a process rule.

## 6. The order of work (answering your "what's best")

Your plan, with Fable's additions: (1) you lock this structure; (2) glossary, then patterns; (3) the placement table: every ledger
change and every ID the old chai and stove pages cite, placed once (this table is the proof it's complete); (4) the rules and values
written from it; (5) a mechanical ID check against the old pages gives the dropped list, for your yes; (6) the old pages kept as
history behind a pointer; (7) the gap analysis, by the two passes.

## 7. Decisions to lock it (yes to all except …)

1. The nine domains and their areas as above. *Recommended.*
2. Four scopes (House, Engine, Family, Game). *Recommended.*
3. Glossary and 14 patterns as their own layers. *Recommended.*
4. The trimmed rule row (eight required fields). *Recommended.*
5. The gap analysis in two passes (area first, rules only where weak). *Recommended.*
6. Over time the standard becomes the one rule register: `ux-principles.md`, `easy-to-play.md` and `guide-and-card.md` hand their
   rules to it and keep their reasoning. *Recommended, after chai's fill.*
7. Fill it in a fresh chat after you call chai done (about half a day of work), Opus high, Fable reviewing the fill. *Recommended.*

## Proof

From the ledger (`build/reports/s16-s17-change-ledger.md`) and Fable's review with its 15-row placement test
(`build/reports/s17-standards-structure-review.md` §2.3).
