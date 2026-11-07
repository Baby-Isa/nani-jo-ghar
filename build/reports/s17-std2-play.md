# s17-std2: the standard, domain B (Play) (Sprint 17, 7 Nov)

Builder 2 of the standard. Docs only (Zafar, 7 Nov, decision 3: lighter checks): no browser, no evidence run, no contract run, no
judge.

## What I wrote

- `docs/design-language/standard/b-play.md`: 28 rules in the format's rule block (eight fields and the Layer line), one heading per
  area of the v2 table in its order (B1 The round's steps, B2 The mechanic, B3 Counts and amounts, B4 Feel). 2,401 words.
- `build/reports/s17-std-placement-2.md`: 38 source IDs placed (37 as rule, 1 as not a standard).
- This report.

Read: chai-tray.js (the knob, boil, pour, counts, the review), `js/cook/flow.js` (runOrder, kitchenEnd, serve), the ledger, the old
chai and kitchen pages, the fix list for every CHAI row cited only in chai-tray.js, cook.md, ux-principles.md, the decisions log.

## Rules per area and scope

| Area | Rules | House | Family | Game |
|---|---|---|---|---|
| B1 The round's steps | 7 | 7 | 0 | 0 |
| B2 The mechanic | 11 | 4 | 7 | 0 |
| B3 Counts and amounts | 4 | 1 | 3 | 0 |
| B4 Feel | 6 | 5 | 1 | 0 |
| **Total** | **28** | **17** | **11** | **0** |

Layers: shared kit 16, kitchen kit 5, kitchen kit stove part 5, game 2 (B2-02 the gesture, B3-04 the counts by level). No Game-scope
rule: chai's own numbers (the green at L4, half at 0.42, the next pan's light at 0.8 s) are cited as values.md names, so a family
re-derives them.

## Gaps (Sprint 18's check work)

12 rules carry a `gap:` term; 3 have no tool at all (*).

| Rule | The tool that should catch it |
|---|---|
| STD-B1-01 | a round-order check on the lifecycle's stage log (word moment, people, order, work, serve, thanks, end) |
| STD-B1-02 | every person who ordered says thank you in the closing scene (SH-214 has no probe) |
| STD-B1-07 | pass-me pop-ups counted per order (none in a session's first) |
| STD-B2-02 * | an act-log check that each step kind takes one gesture at L1-L4 |
| STD-B2-04 | an early tap refused with no mark; a late one restarts only its own dish |
| STD-B2-05 | the green's length at speed 1, L1-L4 (CHAI-58 has no probe) |
| STD-B2-08 | the redo loop's third-try showing |
| STD-B3-01 | a count row ticks within 1 s of its count (contract-18 times rows against step close, not the count) |
| STD-B3-04 * | a seeded-order check: each count 1-3, totals by level (DAAR-37's ten seeds) |
| STD-B4-01 | every logged act gets a sound or an effect within 150 ms |
| STD-B4-03 | the boil-ready picture at the window at L1-L4 (CHAI-63, open) |
| STD-B4-05 * | no wrong sound, cross or mark during play |

## Questions for Zafar (not guessed)

1. **STD-B3-04:** is "one thing asked 1 to 3 times, the total growing by level" a rule for the whole kitchen family (chai's sugars
   are already 1-3) or daar's alone? Daar's kinds at L1-L3 (1, 2, 3) are still to confirm (DAAR-37).
2. **STD-B4-05:** chai's end review shows a gentle frown on a wrong cup's face before the person says it again, while the kitchen page
   says eggs' frown "becomes chai's progress display". Is the frown at the review fine (after the serve), or a verdict to replace?
3. **STD-B1-07:** is Nani's "pass me" still wanted in the kitchen family? MAA-14 has waited "to check" since 6 Oct.
4. **DAAR-12** (how the stir's laps and speed show on the card) stays open with you; placed as not a standard until you decide.

## Notes for the stitch

- Likely doubles (the stitch merges them; a rule wins): CK-45 (E5, never waiting for speech), SH-171 and SH-150 (E2, the order
  card), SH-182 (D2, the hint), CHAI-85 (F4, the cover), CHAI-87 (E5), KEEP-21, CHAI-84 (values). Rules that may sit close to
  another page's: STD-B2-07 and E5's "never waiting"; STD-B4-04 and D1's light timing.
- `docs/design-language/ux-principles.md` §11 still says count rows tick "when that step closes"; SH-38 (1 Nov) reversed it
  (STD-B3-01's Status). Not my file: the orchestrator may point §11 at the standard.
- The format's example link `&new=1` is not a lab.html parameter; I wrote "New player" (the labs.html switch) instead. A format
  note could say so.
- `Value:` fields name values by what they are ("the green at L4"); builder 4 names them concurrently, so the stitch should match
  the names.

## Proof

- `node build/tools/review/stdids.mjs --check --fragments build/reports/s17-std-placement-2.md --mine`: "213 source IDs; 38
  placed in the fragments; 175 unplaced; 28 rules defined; 0 problem(s)".
- `wc -w docs/design-language/standard/b-play.md`: 2,401 (limit 2,500).
- Every Checked-by term checked by grep: the 14 contract checks named exist in `build/sandbox/lib/contract*.mjs`; the 20 probes
  exist in `build/sandbox/data/evidence.json`; `check:static/ladder` and `check:static/reward` are rules of
  `build/lint/static.mjs`; `tool:voicegate` is `build/tools/juice/voicegate.mjs`.
- `node build/tools/review/checks.mjs`: unit 661 pass, words, static (0 new), bump, specs, fixlist, recordings, art, size, load
  ok; docs FAIL on my fragment's missing Proof section, fixed (`docs.mjs`: "within every limit"); **leak FAIL, not mine:** "snap:
  g1 level 1: oracle 100.0% (lens 63.0%); blind pooled 1.1%, worst onePerKind 2.8%" (no game code touched this session).
