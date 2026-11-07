# The standard folder: Fable's review of the fill (7 Nov)

## Verdict

The fill is sound and complete: 222 rules, all 217 source IDs placed (`stdids.mjs --check` green), every page within its limit, every contract, probe, check and lint rule named exists, and every line of the old chai page (50e660f) has a home. Two things keep it from "done". The unit is a rule placed once, yet 15 rules are written twice or three times across pages, so a gap page would score one thing twice. And the audit can run only four of the 28 tools the rules name, so Zafar's §8 ("so it cannot be missed") holds on paper, not in the tool. Four Layer fields contradict the module map and would send one kit builder's code into another's file. Fix the list below (about two hours, mostly retirements) and it is ready for Sprint 18's gap pages.

## Fix list, most severe first

**High**

1. **Doubles: one rule on two pages** (v2 §1: every rule sits in exactly one area). Retire the second block (Status "retired 7 Nov: doubles STD-x"), move its Source rows and gaps into the survivor, update `placement.md`. Survivor first:
   - STD-E2-08 ← STD-D1-04 (identical: the lit box's margin and corner). Carry D1-04's 6 Nov Why and rows CHAI-47, SEK-22, DAAR-39.
   - STD-D4-01 ← STD-B3-01 (the tick when reached). Widen STD-B3-02 to "a tap past a thing's count adds nothing and only wiggles".
   - STD-B2-07 ← STD-D1-11 and STD-E5-02 (a tap lands during a line or a light). STD-B1-05 holds the skip.
   - STD-02-04 ← STD-E1-01 (the four sizes); they also disagree ("none with its own exception" vs Zafar's "unless strictly required", 3 Nov). Reword E1-01: "The frame's measures follow the window's height, never its width".
   - STD-E6-01 ← STD-F2-01 (tokens, same four static rules).
   - STD-E6-02 ← STD-F4-01 (the 48 px tap).
   - STD-F4-04 ← STD-C4-02 (the next game loads behind; SH-212).
   - STD-F3-04 ← STD-E1-03 (a declared scroller).
   - STD-A4-03 ← STD-H2-03 (the store build's voices); carry H2-03's gap (the store-build flag).
   - STD-A4-02 and STD-H2-01 ← STD-H4-02 (grey English, Mum's sheet); carry its 16 rows.
   - STD-F4-02 and STD-F4-03 ← STD-E5-05 (the play button; files at once).
   - STD-B2-04 and STD-B4-05 ← STD-D4-03 (the shake, the boil-over, no verdict); its Value "green 2 s at L4" is B2-05's.
   - STD-A1-03 and STD-A2-06 ← STD-E2-04 (one picture; the filter under a "no" card).
   - STD-D2-06 and STD-B2-03: same Why and Checked by. Cut B2-03 to "a timed action shows its window on the thing"; D2-06 keeps the call.
   - STD-B2-05 repeats STD-C2-06's 15%: cut it to "the window lasts at least 2 s at the top level".
   - STD-E5-04 bundles CHAI-51, -95, -100 and doubles STD-B4-02 and -03: cut it to "No line is read aloud while the child is mid-action". STD-H2-05's "never over a family line" is STD-E5-03's: cut the clause.

2. **Layer fields that contradict the module map:** STD-D1-10 "kitchen kit" → **shared kit** (the next-pan light is piece 13, builder (d)); STD-D2-04 "game" → **shared kit** (the stuck rungs, piece 13; a House rule cannot live in one game); STD-F4-06 "kitchen kit" → **shared kit** (`station-lib.js` is shared in the map); STD-B2-10 "shared kit" → **kitchen kit** (take-back is piece 7, builder (b)). The map cites "STD-F1-01 to -07": F1 has six.

3. **Checks that contradict the rule** (agreeing with the builders): contract-44's "a spotlight 2 s with no finger is a break" contradicts STD-D1-02 and SH-141. Fix: D1-02's Checked by `contract-44 (one finger, the kit's) + contract-84 + gap: contract-44's no-finger clause retuned to SH-141`, and a fix-list row for the check (STD-G1-05). contract-35 still says no dots at L2 while `rules.json` dots the English from L2; STD-C2-05 calls that a gap, rightly, but `values.md` A2 "card by level" cites contract-35 as its derivation: change to `data/rules.json levels`, Zafar 29 Oct.

4. **Checked by names tools the audit cannot run.** `lib/standard.mjs` TOOL_STEP knows panelcheck, labcheck, leak, loadtime and sandbox; the rules name 24 other tools (voicegate 6, evidence 5, kitsheet, kitmap, publishgate 4 each, and 19 more). Each resolves "not run: the audit has no step for it", so `audit --standard` prints about 50 rules as not run. Fix in one place, not 50 rules: Sprint 17's tool builder adds the review tools (voicegate, kitsheet, teachgate, tapgate, pillcheck, shelfshot, spkgap, lightfollow, faces, kitmap) to the audit; the process tools (publishgate, evidence, feedbackcheck, brief, stdids, the art and Mum tools, test_cook_mount) render as "judge" with the tool's name, as `doc:` does. Mis-cites to drop: STD-A2-05 contract-31 (a free *replay*, not the reveal: `gap: a reveal-is-free contract`); STD-A1-04 contract-16 (written English, not "never explained": `doc:/brief standing lines`); STD-E1-05 contract-75 (skip zones, not overlap); STD-F4-01 contract-73 (the bubble's speaker) and `tool:layout tap-small` (should be `check:layout/tap-small`).

5. **Why that does not trace, or states the case (R4):**
   - STD-B1-07 "never in a session's first order, and at most once a round outside the busy mode": MAA-14 says "never in a mode's first plays"; the code (`js/cook/flow.js:179-185`, `data/cook.json` calm) is after the dish's first two plays, then a chance per order (0.4 relaxed, 0.55 busy, 0.2 at L1). Reword: "Nani's 'pass me' never comes in a dish's first two plays, and after that only sometimes, never every order"; Value rows passMeAfterPlays and passMeChance.
   - STD-B2-08 "the third wrong try is shown the right way": no row or doc says it (there is no `docs/decisions.md`). Cite it or cut the clause.
   - STD-B3-04 is daar's number ("min 1 and max 3 chops", 30 Oct), written as a Family rule. Status: "daar's, 30 Oct; the family's number is his to confirm" and a line in `docs/questions.md`.
   - STD-D1-06 "its step's call with it": Zafar's rule is a beat after the light (CHAI-40, kept 3 Nov; old page §1.3); the code is 0 "until his video shows the moment" (`rules.json` showing). Status must carry both, newest first.

**Medium**

6. **Value fields are not values.md names** (the format: "Value: a values.md name"; F2-04's lint will fail them). d-guidance writes literals in 11 rules (D1-01, -02, -04, -05, -06, -07, -08, -10, D2-01, D3-05, D4-03): replace with the names (dim; light pad, light corner; zoom-in; card light after the last move; light time; reveal English shown; next-pan light; hint wait; Nani's line room, Nani's box fold). a-learning and c-progression name values and areas values.md lacks: A1-01 (no A1 table), A2-01 "support by stage", A3-03 "pair hold", A3-04 "half's fill line", C2-03/C2-08/C3-02/C3-04/C3-06 (values.md says decoys, level up, pill right in a row, word hold, under A2/B3; "recalls to move a stage" has no row). Fix: use values.md's names; add rows new words a round (3-5), hearings a round (3+), support by stage (`progress.json`), recalls to move a stage (0, 4, 5, 6), the pair hold (2.2 s).

7. **Glossary parts the rules name but the glossary lacks:** the knob, the heat ring, the burner (sub-parts of the hob), the glass, the boil-over (B2, B4, D2 cite them). Add them to the kitchen table, stove part. Rules that use another name for a listed part: "the gear" (D5-02), "the buttons" (B1-06, F1-04), "help ladder" (F2-02, F3-05), "the support steps" (F3-03), "Nani's pass-me pop-up" (B1-07) → the corner buttons, the hint stages, the word ladder, or add the part.

8. **See it at 1366x768** (not one of the four sizes): STD-B2-08, B2-10, B3-01, B3-02, B4-05 → 1280x665.

9. **patterns.md's rule lists miss citing rules:** P4 lacks STD-F3-06, STD-G2-05; P10 lacks STD-H1-04, -05, -06, -09. STD-E4-03 cites P9 (consequence) for a picture rule: P10.

**Low**

10. **Status and small fields:** STD-E3-03 "agreed 5 Nov" while the marble against the house strip waits on Zafar (ART-55): add it. STD-F1-03 Scope Family, but decision 13 applies to every Cook game: House. H1-01 to H1-09, H3-04, H3-05, H4-01 give Layer "game" for art and process rules: `-`.

## What is good and must not change

- The 0.1 pointers: CLAUDE.md never restated, each non-negotiable tied to its checks.
- `placement.md` with `stdids.mjs --check` green: completeness proven, not claimed (v2 §1.7).
- The F1 piece table and the module map agree (24 pieces, same layers; the two unowned pieces given owners, a "Moves to" column added).
- `values.md`'s "derived from" column: every number I checked matches the code (tokens, the shelf 630/860/46, the fold 0.42 s, `Onboard.ZOOM`, `RUNGS`, retries 3 x 0.3 s, half 0.42, hint waits, `advance`, `holdMs`, `rightInARow`).
- Honest Status lines (D2-05 waiting on Zafar, A4-05 on Mum, E3-05 on art, C2-05's contract-35 gap); g-proof's lessons table; `patterns.md`'s code pointers at 34641d3; the README's scopes and layers in Zafar's words.
- Scope is right throughout; the Family rules in B give the stove family a clean copy.

Could a Sprint 18 builder write `gaps/<game>.md` from this? Yes, once the doubles are retired (else one fault scores twice) and the audit runs the tools (else half the rows read "not run"); the Layer fixes in 2 stop builders (a), (b) and (d) writing into each other's files.

## Proof

Read: CLAUDE.md, the v2 structure, the format note, all 14 standard pages, the old chai page at 50e660f (§1-§6 mapped line by line), the ledger's head, the module map, the S18 file. Ran: `stdids.mjs --check` (217/217, 0 problems), `docs.mjs` (all within limits), `lib/standard.mjs` parseStandardDir (222 rules, 0 malformed), and a script over pattern lists, Value names, glossary parts, See it sizes and Scope/Layer pairs. Grepped: all 59 contracts cited (exist; titles read for 16, 18, 31, 35, 44, 73, 75), all 70 probes (in `evidence.json`), the 12 `checks.mjs` steps, 13 static and 4 layout rules, the 28 tool names, TOOL_STEP. Code: `chai-tray.js`, `onboard.js`, `ui.js`, `flow.js`, `station-lib.js`, `speech.js`, `rules.json`, `progress.json`, `cook.json`, `layout.json`, `tokens.css`, `order-card.css`; docs: easy-to-play, vision, regressions (MAA-14, SH-214, ART-41, ART-55, CHAI-76), prototype-to-game.
