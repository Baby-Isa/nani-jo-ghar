# Placement fragment 2: domain B, Play (Sprint 17, s17-std2, 7 Nov)

The source IDs that fed a rule on `docs/design-language/standard/b-play.md`, and those of domain B that are no standard. Format:
`build/reports/s17-standard-format.md`. Checked with `node build/tools/review/stdids.mjs --check --fragments
build/reports/s17-std-placement-2.md --mine`.

| Source ID | Placed as | Where | Note |
|---|---|---|---|
| CHAI-78 | rule | STD-B1-01 | the word moment before the people and the order |
| CHAI-85 | rule | STD-B1-01 | the kitchen never seen before the word moment (its cover is F4's) |
| SH-214 | rule | STD-B1-02 | everyone who ordered back to say thank you |
| SH-171 | rule | STD-B1-03 | no card before its sentence is said (the folded card's look is E2's) |
| SH-150 | rule | STD-B1-03 | the pop-out only while the order is given |
| MAA-19 | rule | STD-B1-03 | maani's first roti said in Nani's opening line never pops: the item pops as it is said |
| CHAI-39 | rule | STD-B1-04 | "no" items said last |
| R6-141 | rule | STD-B1-04 | Mum to confirm the word order of a "no" item said last |
| CK-54 | rule | STD-B1-05 | a tap skips the order |
| DAAR-38 | rule | STD-B1-06 | the chop ends on the last chop |
| MAA-14 | rule | STD-B1-07 | Nani's pass-me: never in the first order |
| CHAI-04 | rule | STD-B2-01 | made in the pan, never the glass |
| CHAI-24 | rule | STD-D2-06 | the call to act as the window opens |
| CHAI-38 | rule | STD-B2-03 | the real heat ring and its animation kept |
| CHAI-57 | rule | STD-B2-04 | early: refused; late: boils over, that pot only |
| CHAI-58 | rule | STD-B2-05 | the green at L4 2 s (the number is values.md's) |
| CHAI-10 | value | heat to the green (values.md B2) | the burner reaches the green twice as fast (STD-B2-05 cut to the window, 7 Nov) |
| CHAI-61 | rule | STD-B2-06 | a lit pan's boil runs on while another pan is worked |
| SH-182 | rule | STD-B2-06 | any order lands (the hint naming the next item is D2's) |
| CK-45 | rule | STD-B2-07 | a tap during a line lands at once |
| CHAI-62 | rule | STD-B2-09 | a lost dish's row glides back to its start |
| CHAI-26 | rule | STD-B2-11 | the pour: the pan over its glass (the frames' art is E3's) |
| CHAI-34 | rule | STD-B2-11 | "the pans move above the glasses and empty" (29 Oct); the top-down pan art is E3's |
| SH-38 | rule | STD-D4-01 | a count ticks when reached |
| CHAI-16 | rule | STD-D4-01 | the L1-only tick at the count, superseded by SH-38 (history in the rule's Status) |
| CHAI-22 | rule | STD-B3-02 | milk, water and tea once each |
| CHAI-54 | rule | STD-B3-03 | half ticks at the first pour, full at the second |
| KEEP-21 | rule | STD-B3-03 | praise for the half pour (the card's place and the stuck prompt are E2's and D2's) |
| CHAI-84 | rule | STD-B3-03 | half lower (0.42), full to the rim: also a value (values.md) |
| DAAR-37 | rule | STD-B3-04 | 1 to 3 of one thing, totals by level |
| ART-31 | rule | STD-B4-01 | "audibly, yes, we should have juiciness" (the splash's art is E3's) |
| CHAI-92 | rule | STD-B4-01 | the juice: every effect and sound by his picks |
| CHAI-87 | rule | STD-B4-01 | a pour heard (the word moment's sound is also E5's) |
| CHAI-100 | rule | STD-B4-02 | no knob click for a fire the child did not turn off |
| CHAI-95 | rule | STD-B4-03 | the boil heard growing |
| CHAI-63 | rule | STD-B4-03 | the boil-ready picture at every level (open) |
| CHAI-99 | rule | STD-B4-04 | the pour's payoff before the next pan's light |
| DAAR-12 | not a standard | | daar's stir: how laps and speed show on the card, waiting on Zafar; a B3 rule once he decides |

## Proof

`node build/tools/review/stdids.mjs --check --fragments build/reports/s17-std-placement-2.md --mine`: 38 placed, 28 rules
defined, 0 problems (7 Nov). Read against `stdids.mjs --sources` (213 IDs) and the rules of `docs/design-language/standard/b-play.md`.
