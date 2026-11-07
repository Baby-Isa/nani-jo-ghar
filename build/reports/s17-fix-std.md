# s17-fix-std: Fable's review of the standard, applied (7 Nov)

Builder s17-fix-std, Sprint 17. The list: `build/reports/s17-standard-review-fable.md` (fixes 1, 2, 3, 5 to 10, and fix 4's
mis-cites in the pages; the audit side of fix 4 is s17-fix-audit's). Lighter checks this sprint (Zafar, 7 Nov, decision 3): docs
only, no browser, evidence, contract run or judge.

## Rule counts

222 rule blocks: **208 live, 14 retired** (each retired block keeps its rule text, says "retired 7 Nov: doubles STD-x" and the
rule it was; its ID is never reused). Retired: STD-D1-04, D1-11, D4-03, E1-03, E5-02, E5-05, B3-01, F2-01, F4-01, A1-03, A2-06,
C4-02, H2-03, H4-02.

## Fable's items

| Item | Done or not | What changed |
|---|---|---|
| 1 Doubles: E2-08 ← D1-04 | done | E2-08 takes D1-04's 6 Nov Why, "one whole target (picture, pill, face)", rows CHAI-47, SEK-22, DAAR-39 |
| 1 D4-01 ← B3-01; B3-02 widened | done | D4-01 takes B3-01's gap (ticks within 1 s) and its history; its "a tap past it" tail moved to B3-02, now "A tap past a thing's count adds nothing and only wiggles; a thing not counted goes in once" (House, shared kit, like B3-01 was) |
| 1 B2-07 ← D1-11, E5-02 | done | B2-07 adds `js/shared/onboard.js`; CK-54 and contract-74 stay with B1-05 (the skip) |
| 1 02-04 ← E1-01 (four sizes) | done | E1-01 reworded "The frame's measures follow the window's height, never its width" (Value panel scale); 02-04 keeps Zafar's "unless strictly required", takes CHAI-86, and drops its own "laid out by height" so the two no longer overlap |
| 1 E6-01 ← F2-01; E6-02 ← F4-01 | done | Whys moved; E6-01 adds `js/shared/tokens.js` |
| 1 F4-04 ← C4-02 | done | C4-02's Why in full, its preload gap, `js/shared/host.js`, "to build before the store run" |
| 1 F3-04 ← E1-03 | done | "in its markup, with no scroll bar", E1-03's Why, `check:layout/scroll-container`, SH-148 |
| 1 A4-03 ← H2-03 | done | the store-build flag gap; H2-03's P14 not carried (P14 is the grown-up's door, not voices) |
| 1 A4-02, H2-01 ← H4-02 | done | A4-02 takes the rows it lacked (LNG-23, R6-136, R6-141) and `check:words`; H2-01 takes `check:words` |
| 1 F4-02, F4-03 ← E5-05 | done | rows already there; Impact stuck added to both |
| 1 B2-04, B4-05 ← D4-03 | done | CHAI-57 to B2-04, CHAI-58 to B2-05, CHAI-62 to B2-09; B4-05 takes "no end shows a verdict" and the end screen part. D4-03's contract-16 (written English) and contract-5 (badge order) not carried: neither tests a verdict |
| 1 E2-04 ← A1-03, A2-06 | done | both Whys quoted, probe:CHAI-74, A1-03's picture-file gap, the two files |
| 1 B2-03 cut | done | "A timed action shows its window on the thing"; Why CHAI-38; the call and CHAI-24 are D2-06's; Checked by now a judge term and a gap |
| 1 B2-05 cut | done | "The window lasts at least 2 s at the top level"; CHAI-10 placed as the value heat to the green |
| 1 E5-04 cut, H2-05 clause cut | done | E5-04 "No line is read aloud while the child is mid-action" (CHAI-51 only; CHAI-95 to B4-03, CHAI-100 to B4-02); H2-05 points to E5-03 |
| 1 placement | done | 50 fragment rows re-pointed, CHAI-10 to a value; stitched |
| 2 Layers, module map | done | D1-10, D2-04, F4-06 shared kit; B2-10 kitchen kit; module map "STD-F1-01 to -06". Note: D1-10 is Scope Family in the shared kit, and B2-10 Scope House in the kitchen kit, as Fable placed them |
| 3 D1-02, values.md A2 | done | D1-02's Checked by as Fable wrote it, the gap naming fix-list row SH-233 (also on G1-05's Source rows); "card by level" derived from `data/rules.json` levels (Zafar, 29 Oct) |
| 4 mis-cites in the pages | done | A2-05 `gap: a reveal-is-free contract`; A1-04 `doc:/brief standing lines`; E1-05 drops contract-75; F4-01 drops contract-73, `check:layout/tap-small` |
| 5 B1-07 | done | worded to the code; Value rows passMeAfterPlays, passMeChance (values.md B1) |
| 5 B2-08 | done, source found | the clause is decision 51 (6 Oct, `docs/archive/decisions/decisions-1-to-99.md`) and his T8 words; cited, kept |
| 5 B3-04 | done, **needs Zafar** | Status "daar's; the family's number is Zafar's to confirm" (questions.md, question 4, already there) |
| 5 D1-06 | done, **needs Zafar** | Status carries his rule (a beat after the light, CHAI-40) and the code (0 ms until his video) |
| 6 Value names | done | 11 d-guidance literals named (D1-01's Value dropped: a behaviour, not a number); a- and c- names fixed; values.md adds A1, A3, B1, C3 tables and support by stage |
| 7 Glossary | done | knob, heat ring, burner, glass, boil-over; the buttons and the pass-me pop-up added; gear, help ladder, support steps renamed |
| 8 1366x768 | done | B2-08, B2-10, B3-01, B3-02, B4-05 at 1280x665 |
| 9 patterns.md | done | P4 and P10 already listed F3-06, G2-05 and H1-04 to -09; E4-03 moved P9 to P10; retired rules taken out of every list |
| 10 Status and fields | done, **E3-03 needs Zafar** | E3-03 waits on ART-55; F1-03 House; Layer "-" on H1-01 to -09, H3-04, H3-05, H4-01 |

## Proof

- `node build/tools/review/stdids.mjs --stitch`: placement.md: 217 IDs from 6 fragment(s); dropped list: 6
- `node build/tools/review/stdids.mjs --check`: 217 source IDs; 217 placed in placement.md; 0 unplaced; 222 rules defined; 0 problem(s)
- No placement row cites a retired rule (grep of placement.md and the fragments for the 14 IDs: 0).
- `node build/tools/review/docs.mjs`: docs: within every limit (largest standard page e-presentation 2,306 of 2,500).
- Value names (a script over `lib/standard.mjs` parseStandardDir and values.md's rows): 40 rules carry a Value; 0 names not in
  values.md; 86 rows, no name twice.
- Patterns, parts and sizes (same parser): 222 rules, 0 malformed; every live rule's pattern in its list and no list naming a
  retired rule; every part in the glossary; every See it at a check size: 0 findings.
- `node build/tools/review/checks.mjs --only docs,unit`: `ok docs: within every limit`; `FAIL unit 94 files, 693 pass, 1 fail`.
  The one fail is not from this session: review.test.mjs CONTRACT_ROWS, "SH-233: names contract-44, not in CONTRACT_ROWS under it".
  The orchestrator's new fix-list row SH-233 names contract-44, and `build/sandbox/lib/contract.mjs` CONTRACT_ROWS does not list it
  yet. Both files are read-only here; the fix is one entry, SH-233 under contract-44, by whoever owns contract.mjs (or the row's
  Check worded without the contract name until the retune lands).

## Open for Zafar

STD-B3-04 (the family's 1 to 3 per thing: questions.md, question 4), STD-D1-06 (the call with the light or a beat after: his
video), STD-E3-03 (the marble and the stone against the house strip, ART-55).
