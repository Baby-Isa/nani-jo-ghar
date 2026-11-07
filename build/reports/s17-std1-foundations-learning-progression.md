# s17-std1: the standard's README, 0 Foundations, A Learning, C Progression (7 Nov)

**What changed:** four new pages in `docs/design-language/standard/` and one placement fragment. Docs only: no game code, no
browser run (Zafar, 7 Nov, decision 3: lighter checks).

| Page | Rules | Words |
|---|---|---|
| `README.md` | the index (all 14 pages and `gaps/`), three scopes, three layers, the proof scale, how a family uses it, the rule format | 978 |
| `0-foundations.md` | 14 | 1,221 |
| `a-learning.md` | 20 | 2,131 |
| `c-progression.md` | 22 | 2,220 |

## Rules per area and scope

| Area | Rules | House | Family | Game |
|---|---|---|---|---|
| 0.1 The non-negotiables (pointers to CLAUDE.md 1-9) | 9 | 9 | | |
| 0.2 Who it is for | 5 | 5 | | |
| A1 The words | 5 | 5 | | |
| A2 The word card's support | 6 | 6 | | |
| A3 Words a picture can't show | 4 | 4 | | |
| A4 Language lines | 5 | 4 | | 1 (STD-A4-05, LNG-23) |
| C1 Within a round | 2 | 1 | 1 (STD-C1-01, CHAI-55) | |
| C2 Across levels | 10 | 9 | | 1 (STD-C2-10, chai's ladder) |
| C3 Across the word ladder | 7 | 7 | | |
| C4 Across games and days | 3 | 3 | | |
| **Total** | **56** | **53** | **1** | **2** |

Every block has the eight fields and the Layer line; every Checked-by term starts with a format word and names a contract, step,
static rule, tool or probe that exists (checked by a script against `build/sandbox/lib/contract*.mjs`, `checks.mjs`'s steps,
`build/lint/static.mjs`'s rules, `build/tools/review/` and `build/sandbox/data/evidence.json`).

## Gaps (18 rules with a `gap:` term; Sprint 18's check work)

Only a gap today (4): STD-A1-01 (word-exposure count), STD-C1-02 (model before ask), STD-C2-09 (level frozen during a game),
STD-C4-01 (first-meeting map). Partly covered, plus a gap (14): STD-01-01 (removed-mechanic diff), STD-01-07 (undo check),
STD-02-01 (child-pace driver for every game), STD-02-02 (pre-reader leak run), STD-02-03 (drag starts on its target),
STD-A1-03 (picture identity), STD-A1-05 (speech has a tap path), STD-A2-03 (blur-rule contract), STD-A3-01 (word moment before an
amount decides), STD-A3-02 (moment before the first order line), STD-A3-03 (both fills before the snap), STD-C2-05 (**contract-35
still checks the 26 Oct card ladder**: no dots at L1-L2; `data/rules.json` dots the English from L2: retune it), STD-C3-07
(cross-game ladder), STD-C4-02 (next-game preload).

Also found: `data/progress.json` support still carries per-stage `hintAfterMs` (7, 8, 11, 15 s) beside the levels' `hintS`
(7, 9, 11, 13 s); `check:static/hintwait` wants one ladder. For domain D's builder or Sprint 18.

## Questions for Zafar

1. `docs/vision.md` says "Children 4 to 11"; your locked structure (5 Nov) says 3-7. Change vision.md to 3-7? *Recommended.*
2. `docs/vision.md` pillar 3, "No cutscenes", clashes with the word moment (CHAI-67, 2 Nov: "That would be gold standard").
   Amend the pillar to "no cutscenes, but for the word moment"? *Recommended.*
3. STD-C1-01 (a contrasting pair asked in teaching order while supported): Family as written, or House (the clinic's haa and na)?
   *Recommended: Family until a second family needs it.*

## IDs placed

33 in `build/reports/s17-std-placement-1.md`, all "rule" but CHAI-70 ("value"). Unsure, placed anyway: CHAI-70 (E4's pace too),
CHAI-33 and SH-141 (mostly E1 and D1), DAAR-37 (daar's own numbers are its gap page's), the rows waiting on Mum (R6-18, R6-19,
R6-131, R6-134 to R6-139, R6-146, DAAR-26, MAA-15, MAA-16, SEK-18: H4 may also place them). R6-132 and R6-133 are not source IDs
(the kitchen page writes "R6-131 to R6-134"), so they sit in STD-A4-02's Source rows only.

**Values cited** (for `values.md`, builder 4): new words a round, hearings a round (A1); support by stage (A2); the word moment's
pair hold, half's fill line (A3); the four sizes (E1); count by level, decoys by level, the card by level, level speed, level-up
rounds and hints (C2); recalls to move a stage, right picks to earn the pill, the big card's hold (C3).

**Possible doubles for the stitch:** STD-02-03 (B2), STD-A3-02 (B1), STD-C3-06 (B1), STD-C4-02 (F4), STD-A2-05 (D).

## Proof

- `node build/tools/review/stdids.mjs --check --fragments build/reports/s17-std-placement-1.md --mine`: "213 source IDs; 33 placed
  in the fragments; 180 unplaced; 56 rules defined; 0 problem(s)".
- `wc -w`: README 978, 0-foundations 1,221, a-learning 2,131, c-progression 2,220 (all under their limits).
- `node build/tools/review/checks.mjs`: CHECKS_RESULT
- QA checklist: docs only, so the browser, evidence and contract lines do not apply (decision 3).
