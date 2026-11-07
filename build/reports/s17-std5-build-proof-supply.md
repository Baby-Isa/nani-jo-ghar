# s17-std5: the standard's F Build, G Proof, H Supply and the 14 patterns (Sprint 17, 7 Nov)

Docs only (Zafar, 7 Nov, decision 3: lighter checks): no browser, no before or after, no contract run, no judge.

## What was written

| File | Rules | Words |
|---|---|---|
| `docs/design-language/standard/f-build.md` | 25 (F1 6, F2 4, F3 6, F4 6, F5 3) and the module map (24 pieces) | 2,500 |
| `docs/design-language/standard/g-proof.md` | 29 (G1 9, G2 8, G3 5, G4 7) and the lessons R1-R9 | 2,488 |
| `docs/design-language/standard/h-supply.md` | 26 (H1 9, H2 5, H3 7, H4 5) | 2,055 |
| `docs/design-language/standard/patterns.md` | P1-P14: what each solves, the rules citing it, its code | 1,201 |
| `build/reports/s17-std-placement-5.md` | 120 source IDs placed | |

**By scope:** House 77, Family 3 (STD-F1-03, STD-F2-03, STD-H3-03), Game 0 (no chai-only rule falls in F, G or H). Every block
has the eight fields and its Layer; every Checked-by term starts with a format word and names a real contract, check step, static
rule, tool, probe or launch doc (a script grepped every term), or is a gap. Impact was left out of F's blocks to keep F at its limit.

**F1, the module map:** a layer, the files and line ranges at 34641d3, the Sprint 18 kit builder and the call for each of chai's 24
pieces: heat and boil, hob and burners, the boil sound (the stove part, builder a); pans, pouring, serving (b); shelf, chips and
pills, count pills, the word pop (c); lights, the reveal lessons (d); the order's flow, side panel, bubbles, people speaking (e);
the word moment, the snapshot, the end screen (built); the mic serve and chai's recipe (game).

## Gaps: 33 rules whose check does not exist yet (Sprint 18's check work)

| The tool that should catch it | Rules |
|---|---|
| `audit.mjs --standard` (Sprint 17's tool builder) | STD-F1-03, STD-G1-01, STD-G1-07, STD-H3-04 |
| chai's frozen-run diff | STD-F1-05, STD-G2-08 |
| new static rules: a game named in kit code; numbers in a station file; ladder reads only through the snapshot | STD-F1-02, STD-F2-03, STD-F3-03 |
| kitmap.mjs failing a kit element drawn in a station | STD-F1-01 |
| a values lint (derivation, real token) | STD-F2-04 |
| a frame-film reversal check for every motion | STD-F3-01 |
| the lesson-survives-a-tap check (Sprint 17's check builder) | STD-F3-02 |
| a panel-steady check; a CSS rule against scroll-snap in a scroller | STD-F3-04 |
| loadtime.mjs: a wait between stages; dropped requests | STD-F4-04, STD-F4-06 |
| a See-it link guard (R9) | STD-F5-01 |
| a lab-coverage check over `data/kit-elements.json` | STD-F5-03 |
| a contract lint pairing "not early" with "seen" | STD-G1-04 |
| panelcheck.mjs printing before and after | STD-G1-06 |
| the evidence lint failing a probe with no coverage | STD-G2-01 |
| `/feedback` replaying on a clean profile first | STD-G2-06 |
| `--judge` pairing a told-before row with its last FAIL | STD-G3-05 |
| sprintcheck.mjs: every shared row names its sprint (R8) | STD-G4-03 |
| brief.mjs carrying the game's keep rows | STD-G4-04 |
| publish.mjs --force recording his words | STD-G4-05 |
| stdids.mjs checking dated Status lines | STD-G4-06 |
| an art-queue depth line in `/handover` | STD-H1-03 |
| the audit listing code-drawn effects (R5) | STD-H1-05 |
| artcheck.mjs: source against drawn size; a pose register | STD-H1-08, STD-H1-09 |
| the store-build silent flag; a Kutchi gate | STD-H2-03, STD-H2-04 |

## Questions (never guessed)

1. **For the orchestrator:** Sprint 18's five kit builders have no owner for the pans' looks (I wrote (b), with the boil looks open
   between (a) and (b)) or the worktop wash and stone band (open). Recommend: pans to (b), the worktop to (a).
2. **For the orchestrator (format):** at eight fields a block, a 2,500-word page holds about 25 rules; F sits at exactly 2,500 with
   its map. Recommend: the module map as its own page (`module-map.md`) at the stitch, or F's limit at 3,000.
3. **For Zafar, when he likes:** should a forced publish write his words into its commit (STD-G4-05) and every brief carry the
   game's keep list (STD-G4-04)? Recommend yes to both.

## IDs placed: 120

Unsure, placed anyway (the stitch merges doubles): CHAI-25 (its row is the pan glow, domain D; chai-tray.js cites it for the
real-time load cap, placed STD-F4-06), CHAI-07 and CHAI-13 (art, also E3), CHAI-87 and CHAI-92 (also E5), ART-41 (also E3),
SH-38 and SH-153 (reversals, placed STD-G4-06). Not a standard: DAAR-37, DAAR-38, DAAR-39, MAA-14, SEK-14 (a game's own rows, for
its gap page), PAN-19, PAN-22 (sprint-plan decisions changed on 7 Nov). Left to the others: the `onb:` states, led:1.6-11.

## Proof

- `node build/tools/review/stdids.mjs --check --fragments build/reports/s17-std-placement-5.md --mine`: 213 source IDs; 120 placed
  in the fragments; 93 unplaced; 80 rules defined; 0 problem(s).
- `wc -w`: f-build 2,500, g-proof 2,488, h-supply 2,055, patterns 1,201.
- `node build/tools/review/docs.mjs`: within every limit (every backticked path exists).
- `node build/tools/review/checks.mjs`: 11 of 12 ok (unit 661 pass, words, static 0 new, bump, specs, docs, fixlist, recordings,
  art, size, load 29/29). One FAIL that is not mine: `leak` on snap g1 L1 (oracle 100%, lens 63%), a parked game no file of mine touches.
