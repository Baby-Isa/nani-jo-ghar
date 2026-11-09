# S19 audit: what is really waiting on Zafar (9 Nov)

Audit of the sprint file's "Waiting on Zafar" (10 items) and the 34 rows marked **waiting on Zafar**.
**32 already answered (10 sprint items, 22 rows), 10 not needed now, 3 truly open** (one is the last pick inside CK-66). Most
answers came in his 9 Nov notes; the labels were never updated.

T1 = `docs/feedback/kitchen-mocks-2026-11-09-transcript.md`; T2 = `kitchen-mocks2-2026-11-09-transcript.md`; S7 =
`build/reports/s18-review-and-direction.md` §7 (9 Nov: his principle answers; the combined list, "yes to all except" 5, 6, 9, 11, 16,
18, each exception itself answered); SF = the sprint file.

## 1. Already answered (32)

| Item | His answer | Label |
|---|---|---|
| Counting rule (SEK-25, CK-64) | "I think I agree with four ... the order card should carry it where possible" (T1 [29]) | to fix: code (+ Mum) |
| Sekelo: one skewer each | "Five, I guess five, I agree." (T1 [29]) | to fix: code |
| Timing floor | "a minimum length for any green hit now window. Yes" (T1 [31]) | to fix: check |
| Samosa's redesign | "just take my feedback from this chat on samosa" (T1 [31]); circle fold, yes (SAM-21) | waiting on art |
| Scene for every game | "yes to all 13 and the plan" (SF, 9 Nov) | waiting on art |
| Shelf angle | "top down items in a tray and side on items on the shelf" (T1 [12]); no 30° band, yes (S7) | done |
| Timed windows' look | "We want all the stoves to look the same, like they do in Chai" (T2 [2]); daar's dial only at L4; sekelo's grill with its art | to fix: code |
| One stir (DAAR-45) | "two completely different screens" (8 Nov, kitchen-play P29) | to fix: code |
| Merge rule | "I don't think I agree to that" (T1 [31]) | done (no) |
| Chai's publish | "chai's three fixes (his go)" (SF, 9 Nov) | to fix: check (/review, then publish) |
| SH-222, SH-223 | "the tea game does so I don't know why it's not transferred over" (8 Nov, kitchen-play P2) | to fix: check |
| SH-224 | same; Google fonts still load | to fix: code |
| ART-48 | "just ensure we pick a nice palette color strip" (6 Nov, chai-play P8) | waiting on art |
| ART-49 | juice run done 6 Nov (CHAI-92, -93) | done |
| SH-213 | exception 6: first blurred pop-up, freeze, light, tap (S7) | to fix: code |
| SH-243 | T1 [12]; stone "applies to all images with wooden trays" (T2 [6]) | waiting on art |
| DAAR-12 | combined list yes: L4 after a word moment (S7) | to fix: code |
| DAAR-46 | "It shouldn't stop you" (T1 [6]); count as our item card (T2 [10]) | to fix: code |
| DAAR-47 | "I'm erring towards leaving it out" (T1 [9]) | done |
| DAAR-49 | keep the tadka and stir, yes (S7) | done |
| SAM-33 | "try it for one of the chart, and if it works ... Samosa as well" (T2 [11]) | waiting on art |
| MAA-23 | exception 5: rings after the word moment (S7) | to fix: code (+ Mum) |
| CHT-13 | "Top down ... Opaque bowl looks better" (T1 [18]) | waiting on art |
| CK-66 | four plates, chai's hob, "create 2 versions of the pan" (T2 [16]) | waiting on art |
| CK-69 | "probably needs to be glass" (T2 [17]) | waiting on art |
| CK-70 | "dotted outlined tray slots for top, middle and bottom" (SF) | waiting on Mum |
| CK-72 | sandcastle: "we'll just come to it when we get to it" (SF) | to fix: code |
| CLN-219 | "times it by 3" (6 Nov, chai-play P9) | waiting on art |
| ART-61 | "the three dough balls are now looking better" (T2 [7]) | waiting on art |
| ART-64 | mock-up rounds 1 and 2 ran (T1 [1], T2 [1]) | done |
| ART-69 | "a modern stone version, would look better" (T2 [1]) | waiting on art |

Stale wording elsewhere: SH-237 and CK-65 still call things "his question", though T1 [30]-[31] answer them.

## 2. Not needed now (10)

| Row | Why | Label |
|---|---|---|
| ART-54 | "let's hold off on drawing all the characters for now" (6 Nov, chai-play P22) | parked |
| CK-58 | "maybe let's hold off on doing it for now" (6 Nov, chai-play P18) | parked |
| CLN-158, CLN-172 | parked (Zafar, 21 Oct) | parked |
| CK-68 | superseded: "first grill them all and then flavour them on the next screen" (CK-67, 9 Nov) | done |
| SH-211, PAN-04, CK-01, CLN-220, DAY-02 | no question: a bug not seen again, ear checks at his sprint-end play, clinic sounds, a failing check | to fix: check / code |

## 3. Truly open (3)

**Looks**
1. **Eggs' pan: all steel, or wooden handle and black pan?** **Steel**: black vanishes on chai's black hob; steel matches chai's pan.

**Loading**
2. **Fix the flashing screens on load now, or with the loading screens later?** (SH-220) **Now**: a plain stone cover that
   fades in; small, and he sees it every round.

**Nani's help**
3. **Once a word is past support, should Nani's hint keep leaving its name out?** (CHAI-76) **Yes**: his own leak rule says hints
   never give the answer; the stuck-help light already shows where to look.

## Proof

Searched: `docs/sprints/S18-kitchen-family.md`, `S19-chai-standard-everywhere.md`; `docs/process/regressions.md` (the 34 rows and
their linked rows); `docs/feedback/kitchen-mocks-2026-11-09*`, `kitchen-mocks2-2026-11-09*`, `kitchen-play-2026-11-08*`,
`chai-play-2026-11-03/-04/-06/-06-night/-07.md`, `chai-replay-*`; `build/reports/s18-review-and-direction.md`,
`s18-eye-judge-experiment.md`, `s19-fable-mock-answers.md`, `s19-mocks2-review.md`, `s19-mini-judge.md`, `s19-cards.md`,
`s19-games.md`; `docs/questions.md`, `docs/ideas.md`, `docs/status.md`; git log (13ebc451d, 6fd8adf15, 618fab83f, dc01079dc).
