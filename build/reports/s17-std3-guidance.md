# s17-std3: the standard, D Guidance (and chai's onboarding states)

Builder s17-std3, Sprint 17, 7 Nov. Docs only (decision 3, lighter checks: no browser, no evidence run, no judge). Wrote
`docs/design-language/standard/d-guidance.md` (29 rules) and `build/reports/s17-std-placement-3.md` (72 source IDs placed).

## Rules per area and scope

| Area | Rules | House | Family | Game | With a gap |
|---|---|---|---|---|---|
| D1 The first time | 11 | 10 | 1 (D1-10, the next vessel) | 0 | 3 |
| D2 When stuck | 6 | 5 | 1 (D2-06, a timed control's call) | 0 | 1 |
| D3 Nani's box and the helper card | 5 | 5 | 0 | 0 | 2 |
| D4 Feedback in play | 3 | 3 | 0 | 0 | 0 |
| D5 The grown-up's door | 4 | 4 | 0 | 0 | 2 |
| **Total** | **29** | **27** | **2** | **0** | **8** |

No Game rule: every chai lesson is either for every game (House) or for every kitchen game with vessels (Family).

## Gaps (Sprint 18's check work)

| Rule | The check that should catch it |
|---|---|
| STD-D1-02 | a contract failing a finger on a tap lesson (contract-44 still says first-time help always has its finger: the s14 look has none on a tap) |
| STD-D1-05 | the zoom-in contract (`docs/process/checks-to-build.md`) |
| STD-D1-08 | the lesson-survives-a-tap contract (`docs/process/checks-to-build.md`) |
| STD-D2-04 | a contract that a wrong tap brings the waiting hint at once |
| STD-D3-04 | a contract that opening the helper by its arrow never reaches the hint count |
| STD-D3-05 | a film check that the order list never jumps as Nani's box changes |
| STD-D5-02 | a contract for one live cog with its three items in every game |
| STD-D5-03 | a labs check that every game honours Words known |

## Questions for Zafar

| # | Question | Recommendation |
|---|---|---|
| 1 | STD-D2-05 (CHAI-76): once a word is past support, Nani's stuck line hides it. Keep? | Keep (the leak test) |
| 2 | STD-D2-04: "a wrong move brings the stuck hint at once" came from chai's pan (3 Nov). Every game? | Yes, House |
| 3 | `onb:arrow` placed as retired by your 29 Oct word; delete the switch (`showing.lightHelpArrow`) too? | Yes, at the kit move |

## IDs placed

72: 69 rules, 2 retired (CHAI-53, `onb:arrow`), all ten `onb:` states. Unsure (likely also placed by others; the stitch merges):

| IDs | Also |
|---|---|
| CHAI-60, led:1.11-1 | G1 (checks) |
| led:1.11-6, SH-210, SH-180 | F3 |
| SH-174, CK-53 | E1 |
| SH-149, SH-179, SH-189, SH-209, SH-206 | E2 |
| SH-215 | E4 |
| CK-45, CK-54, CHAI-24 | E5, B1, B2 |
| SH-38, CHAI-54 | B3 |
| CHAI-57, CHAI-58, KEEP-21 | B2, B4 |
| SEK-22, DAAR-39, DAAR-36 | each game's gap page |

For the tool and format owner: `stdids.mjs` misses chai's `ctl-slow` key (its phase is set by a ternary), so it is noted under
`onb:ctl-knob`; the format's See it example uses `&new=1`, which `lab.html` does not read (New player is the `labs.html` switch).

## Word counts

| File | Words (`wc -w`) | Limit |
|---|---|---|
| `docs/design-language/standard/d-guidance.md` | 2495 | 2500 |
| `build/reports/s17-std-placement-3.md` | see Proof | |

## Proof

```
$ node build/tools/review/stdids.mjs --check --fragments build/reports/s17-std-placement-3.md --mine
213 source IDs; 72 placed in the fragments; 141 unplaced; 29 rules defined; 0 problem(s)
$ wc -w docs/design-language/standard/d-guidance.md build/reports/s17-std-placement-3.md build/reports/s17-std3-guidance.md
2495 / 953 / 583 (report prose 111 of 300)
$ node build/tools/review/checks.mjs
ok unit (661 pass) · ok words · ok static · ok bump · ok specs · ok docs · ok fixlist · ok recordings · ok art · ok size · ok load
FAIL leak  snap: g1 level 1: oracle 100.0% (lens 63.0%): the snap game, not this session's files (docs only)
```

Every rule block was also read by a scratch script: all 29 have the eight fields and a Layer, every `contract-NN`, `probe:`,
`tool:` and `check:` term names something that exists, and every Source rows ID matches the fragment.
All ten `onb:` states from `--sources` are in the fragment.
