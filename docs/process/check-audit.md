# The check audit (8 Nov 2026)

Every check we have, one at a time (Zafar, 8 Nov: "we've written those in blood ... I don't want to throw them away for no reason"):
does it **run** today, has it **caught** a real problem (the row or commit), what it **costs** (time, flakiness, false alarms, blocked
work), and the **verdict**: KEEP, FIX (fixed, with a test) or RETIRE (only when it costs more than it is worth; its code stays, out of
the default run and marked, so it can come back). s19-checks; the report is `build/reports/s19-checks.md`.

**Where the record comes from:** the fix list and its archive (each row's "found by", and the rows each check was built from), the
session reports in `build/reports/`, the runs of today (part 1 on every kitchen game at L1-L4, the older scripts re-run), and git.
This clone's git history starts on 7 Nov (it is shallow), so older catches are read from the rows and reports, not commits.

**Totals:** 214 checks: **KEEP 184, FIX 15 (each fixed, with a test), RETIRE 5** (code kept), plus 10 new (part 1). Not checks (tools
that make pictures or files: kitmap, faces, shelfshot, statuscounts, skeleton, heal-marks, shoot_photo, bg_align_check, the
SessionStart hook) are listed at the end and need no verdict.

**Retired, each in one line:**
1. `shotdiff.mjs` in /review: its approved run is still Sprint 8's (`approvedFrom` s08-gate-lab), so every review since read "all new"
   (550 shots) and it never showed what changed; the look is judged beside chai now (`sidebyside.mjs`).
2. `build/check_clinic_kutchi.mjs`: runs nowhere; today both its hits are false (a picture path, and "arre" as an event name, not a
   word said); the word lint, strict on `js/clinic` in every checks run, guards the same rule (0 literals).
3. `build/check_speaker_taps.mjs`: last run 26 Oct (s13-a2); the screen lint's `tap-small` (48 px) and `covered` judge every speaker on
   every recorded state at every size, where this judged two sizes at L3.
4. `build/check_word_card_taps.mjs`: a 44 px floor on one lab page (EASY-11, Sprint 11); `tap-small` holds 48 px on every page the
   sandbox plays, the word card's reveal among them.
5. `build/check_sidebar_fit.mjs`: last run 26 Oct (s13-a2); contract-51 (every word inside its card) and the screen lint
   (`text-offscreen`, `text-clipped`) judge the sidebar on every page and size.

The browser results that decided 3-5 and the older scripts are in section 9.

## 1. `checks.mjs`, step by step

`time node build/tools/review/checks.mjs` today: see the report. It did not finish in 5 minutes on 8 Nov: the `load` step waited on a
lock and then ran about 3 minutes (a browser), the leak bots took 3 minutes 20 (the parked snap bot alone 2 minutes), and the steps ran
one after another. Now every step runs at once, `load` is behind `--browser` (or `--full`), and the parked modes' bots are behind
`--full` (or run when their files change).

| Step | Runs | Caught | Cost | Verdict |
|---|---|---|---|---|
| unit (102 test files) | every checks run | every check's fixture red then green (the contract rows', the kit's, the tools'); the regressions-on-the-repo test caught 8 new rows saying "contract check" with no check (SH-236 to SH-243) today | ~60-90 s; the art block's 3 tests fail in a builder's worktree (no `sources/`) | FIX: the art block's tests left out where `sources/art` is missing, and said so on the line |
| words (strict on js/cook, js/clinic) | every run | the literals the engine replaced (LNG rows); 0 today | 1 s | KEEP |
| static | every run | see section 2 | 1 s | KEEP |
| leak | every run | non-negotiable 4's bots; CLN-120's fever L3 (decision 91, 100% by thermometer) | 3 min 20 serial, snap 122 s | FIX: parked modes (snap, tidy, who, dress, monsoon, find) only with `--full` or when their files change; 3 lanes |
| bump | every run | a page that would not stamp | 0.3 s | KEEP |
| specs (evidence lint-specs) | every run | the S05 probe pitfalls (legacy flows, stale selectors, end-card captures) | 3 s | KEEP |
| docs | every run | broken doc paths, duplicate IDs, unlabelled rows' shape | 0.2 s | KEEP |
| stdids (new step) | was by hand; now every run | its 38 "extras, fine if meant" kept it red on 8 Nov, hiding any real problem | 1 s | FIX: extras are notes; real problems fail; joined checks.mjs |
| recordings | every run | the sheet out of date after a Mum round | 0.2 s | KEEP |
| fixlist | every run | unlabelled open rows (Zafar, 21 Oct) | 0.1 s | KEEP |
| art | every run | a baked shadow in a changed pack (6 Nov) | 1 s | KEEP |
| size | every run | the site under 800 MB (422 MB today) | 0.1 s | KEEP |
| load (loadcheck) | every run, under `/tmp/njg-browser.lock`, a lock no builder's run took | decision 68: a page loading another game's pictures; "cook:chop's nani-face-talk oversize, flaky" (s18) | ~3 min plus the wait; flaky when other browsers ran beside it | FIX: behind `--browser`/`--full` (review and publish run it), under the one lock |

## 2. The static checks (`build/lint/static.mjs`, one family at a time)

Each family fails on a finding not in `build/lint/static-known.json`; the known list only shrinks. Runs in every checks run (1 s);
fixture tests in `build/lint/static.test.mjs` and `build/lint/static-voice.test.mjs`.

| Family | Caught | Cost | Verdict |
|---|---|---|---|
| kit (shared classes restyled outside css/shared) | known list 52 (23 Oct) to 18 today: every game's restyle of the shared card and buttons it held back | none | KEEP |
| tokens (colours only from tokens, no gradients or text-shadow) | 883 raw values (23 Oct) to 491 | none | KEEP |
| ladder (timers 13-17% quicker per level; one knob a level) | the heal games' ladders; 2 known | none | KEEP |
| words (banned forms: aabhar aanjo, arre re, lal, nar) | decision 61's arre re, the settled forms | none | KEEP |
| privacy (nothing leaves the device) | 0 on record; guards non-negotiable J1 before the stores | none | KEEP |
| reward (no sweets) | 0 on record; guards non-negotiable 9 | none | KEEP |
| hintwait (one help ladder) | S13-A1's second tables (a helpMs copy in game data) | none | KEEP |
| shell (kit.css once per page) | S13's pages linking a shared sheet directly | none | KEEP |
| motion (no game keyframes for a kit motion) | 19 known; the games' own glow and hop keyframes | none | KEEP |
| jscolour (no colour literal in js/) | 275 known, art-only files listed once | none | KEEP |
| plane (doctor and girl in one plane) | CLN-154 | none | KEEP |
| loadcap (no art load capped in game time) | CHAI-25, CK-04, CK-08 (the green missing-texture box) | none | KEEP |
| voice (one voice player) | S13-V's stray `speechSynthesis` and `new Audio` | none | KEEP |
| fonts (a face named only in the type tokens) | SH-224: fails in chai's files, 224 warnings elsewhere until the roll-out | none | KEEP |

## 3. The screen lint and its kin (`build/lint/`)

| Check | Runs | Caught | Cost | Verdict |
|---|---|---|---|---|
| The screen lint, `layout.mjs`: text-clipped, ellipsis, text-small, tap-small, offscreen, page-scroll, scroll-container, covered, covers-play-area, word-broken | every recorded state of every sandbox page, linted twice 300 ms apart | TXT-01/02/05/10, LAY-04/06 rows; maani's pop-out over the play area (Fable, 8 Nov) | ~1 s a state; 2485 known findings in the baseline | KEEP |
| `phaser.mjs` (canvas text small, off screen, covered) | the same | Cook's canvas text under 14 px | small | KEEP |
| `css.mjs` (spacing-grid) | the `css` flow and unit tests | LAY-03 | none | KEEP |
| `words.mjs` | the words step | see section 1 | 1 s | KEEP |
| The ratchet (`baseline.json`, `ignore.json`, `--check`) | every `--check` | a flow that stops short, a new page that never ends, a new page error | none | KEEP |

## 4. The contract rows (`build/sandbox/lib/contract*.mjs`)

Every contract row runs on every page of every contract or sandbox run; the cost is the analysis (milliseconds) unless noted. Today's
run of part 1 (40 pages: the ten kitchen games at L1-L4, 1280x665, `s19-p1-today`) had **no break of contracts 1-99** (one contract-79
break in the smoke run before it). "Built from" rows are the failures each was written from; "caught since" is what it found after.

| # | Check | Guards (o open, d done) | Caught since / record | Cost | Verdict |
|---|---|---|---|---|---|
| 1 | pop-up before play (every page) | SH-64(o) CHT-10(d) CHAI-15(d) CK-29(d) CLN-140(d) | 2 breaks in reports (S05) | none extra (rides the page run) | KEEP |
| 2 | moves on by itself (every page) | SH-40(d) CLN-92(d) CLN-110(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP; for Cook, contract-103 now fails any tick, next or X (SH-238 drops this check's take-back exception); the clinic's go-on buttons are Zafar's question |
| 3 | voice stops at every stage end (every page) | SH-66(d) | a day-4 break, fixed (S05) | none extra (rides the page run) | KEEP |
| 4 | bubble at the speaker's head (every page) | SH-68(d) CLN-86(d) CLN-146(d) SH-177(o) | SH-177 | none extra (rides the page run) | KEEP |
| 5 | badges in order (end screens) | SH-67(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 6 | no retired art (every page) | DAAR-13(d) ART-17(d) ART-13(d) CK-52(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 7 | one voice at a time (every page) | PAN-04(o) | PAN-04 (open) | none extra (rides the page run) | KEEP |
| 8 | one highlight at a time (every page) | SH-53(o) SH-79(d) CK-34(d) CLN-143(d) CLN-144(d) CLN-145(d) | once on sekelo L2 (s05 report) | none extra (rides the page run) | KEEP |
| 9 | no folded card from L3 (clinic L3+) | CLN-114(d) SH-110(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 10 | faces the player on the child's turn (clinic) | SH-71(d) CLN-157(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 11 | backgrounds in proportion and sharp (every page) | PAN-14(d) ART-05(d) ART-59(o) ART-60(o) | ART-59, ART-60 (open) | Cook is on its known list (contract-known.json, ART-05): it judges no Cook page | KEEP |
| 12 | buttons hidden until usable (every page) | SH-23(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 13 | each stage clears its own UI (clinic) | CLN-06(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 14 | one talk animation (every page) | ART-18(o) | ART-18 (open) | none extra (rides the page run) | KEEP |
| 15 | no word broken across lines in a card (every page) | SH-73(d) CLN-153(d) SH-170(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 16 | no written English for the child (every page) | LNG-01(o) PAN-10(o) SH-85(d) MOD-09(d) MOD-10(o) CK-42(d) | MOD-10, LNG-15 (open); one flake noted | one flake noted (S05) | KEEP |
| 17 | only family voices on the store build (--store runs) | LNG-06(o) LNG-14(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 18 | card rows tick when their step closes (every page) | SH-10(d) SEK-13(d) DAAR-19(d) DAAR-23(d) CLN-131(d) CLN-141(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 19 | the counting rule (every page) | DAAR-18(d) DAAR-24(d) SH-92(d) SH-99(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 20 | one face per person (every page) | CLN-85(d) CLN-139(d) CLN-149(d) DAAR-25(d) CK-40(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 21 | input is live while a line plays (every page) | CLN-152(d) CK-43(d) CK-45(o) DAAR-42(d) | CK-45 (open) | none extra (rides the page run) | KEEP |
| 22 | each line said once and whole (every page) | PAN-04(o) PAN-16(d) CHAI-21(d) MAA-15(o) | MAA-15 | none extra (rides the page run) | KEEP |
| 23 | an item's name only when nothing else speaks (every page) | SH-94(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 24 | no help before the idle time (every page) | SH-60(o) SH-95(d) SH-155(o) CHAI-32(d) | built from its rows; no break on record since | none extra (rides the page run) | FIX: its text named the retired table (7, 8, 11, 15 s, data/cook.json); it read the rules' 7, 9, 11, 13. Text fixed, test `build/sandbox/contract-audit.test.mjs` |
| 26 | the opening line is heard whole (every page) | LNG-16(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 30 | everything said is written (every page) | SH-99(d) CLN-161(d) CLN-169(d) CLN-171(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 31 | a replay is free and says what is left (every page) | SH-102(d) SH-114(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 32 | the review's divider leaves room (end screens) | SH-103(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 33 | the order pop-up's headlines: one size, wrap first (every page) | SH-107(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 34 | every go-on button has the arrow; every button the kit's (every page) | SH-106(o) | built from its rows; no break on record since | none extra (rides the page run) | KEEP: its go-on half goes quiet as SH-238 removes the buttons; its kit-button half still guards the pills |
| 35 | the card by level (every page) | SH-110(d) SAM-26(d) MAA-18(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 36 | Nani calls each step as it opens (every page) | SH-110(d) SEK-18(o) SH-133(d) | SEK-18 | none extra (rides the page run) | KEEP |
| 37 | decoys by level (every page) | CK-49(d) SH-132(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 38 | the end screen: two pages (end screens) | SH-104(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 39 | the word card's English: supported, then tapped (every page) | SH-123(d) CHAI-71(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 40 | one card markup; a blanked row has its speaker (every page) | SH-110(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 41 | one order pop-up (every page) | - | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 42 | one face circle, three sizes (every page) | ART-08(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 44 | one finger, the kit's (every page) | SH-233(o) SH-19(o) SH-130(d) SH-141(o) | flagged a tap's light with no finger, against SH-141: SH-233 (a false alarm, fixed today) | blocked chai's tap lights until S14_TAPS exempted it (SH-233) | FIX (SH-233): the no-finger clause now holds only for a drag, hold, swipe or circle (the kit's ghost's gesture); a tap's light has none (SH-141). Test in `build/sandbox/contract-kit.test.mjs` |
| 45 | the door's lines in turn (day door) | - | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 46 | English written only under the door's lines (day door) | - | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 47 | the ride never asks for a hidden thing (day ride) | RIDE-02(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 48 | the ride asks as a thing comes into view, and a missed one comes round (day ride) | RIDE-04(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 49 | one end screen (end screens) | - | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 50 | samosa: the card ticks at the one tick (samosa) | SAM-24(d) SAM-27(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 51 | every word inside its card (every page) | SH-142(o) SH-138(o) SH-170(d) CHAI-69(d) | CHAI-69 (found by it) | none extra (rides the page run) | KEEP |
| 52 | a bubble keeps faces and the side panel clear (every page) | CK-18(d) SH-145(d) SH-138(o) CHAI-48(o) SH-177(o) | CHAI-48 (found by it, 30 Oct) | none extra (rides the page run) | KEEP |
| 53 | the help's light holds one thing (every page) | CHAI-33(d) SH-138(o) CHAI-36(o) | CHAI-36 | none extra (rides the page run) | KEEP |
| 54 | the side panel's buttons stay in it (every page) | CK-53(o) SH-138(o) | CK-53 | none extra (rides the page run) | KEEP |
| 65 | the chop's waves without a gap (daar's chop) | DAAR-35(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 66 | a lap at the flag, its number heard in step (daar's stir) | DAAR-30(d) DAAR-27(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 70 | the turn-off line at the green (chai) | - | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 71 | once each into a pan (chai) | - | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 72 | the order row glides, never jumps (every page) | SH-152(o) CHAI-39(o) | SH-152, CHAI-39 (open) | none extra (rides the page run) | KEEP |
| 73 | the bubble's speaker is big (every page) | SH-153(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 74 | a tap lands the whole order at once (every page) | CK-54(o) | CK-54 (open) | load-timing flakes (2 on one evening, s18 shelf swap) | KEEP |
| 75 | a tap on a bubble, the side panel or the cog never skips the order (every page) | SH-157(o) | SH-157 (open) | none extra (rides the page run) | KEEP |
| 76 | the big pop-out card is never over a face (every page) | SH-154(o) | SH-154 (open) | none extra (rides the page run) | KEEP |
| 77 | the first-time hold is a new player's only, and ends at the tap (every page) | SH-158(o) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 78 | a control's call and its light come together (every page) | CHAI-40(d) CHAI-49(o) CHAI-52(d) CHAI-60(o) SH-181(d) | CHAI-49 (found by it, 30 Oct) | none extra (rides the page run) | KEEP |
| 79 | the order card's light waits until nothing moves (every page) | CHAI-42(o) SH-178(o) | maani L1's card light 51-53 ms after the move (four audit reports, today's smoke run) | 100 ms sampling against a 167 ms window at test speed 3: fires intermittently on the same real fault | KEEP: the fault it reads is real; trust it at #speed1 |
| 80 | the kitchen does not change after its first drawn frame (every page) | CHAI-45(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 81 | no picture over a gauge (every page) | CHAI-46(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 82 | no lit box edge across a face (every page) | CHAI-47(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 83 | no card over a face (every page) | SH-154(o) CHAI-43(d) SH-203(o) | SH-203; 4 breaks in s14 runs | none extra (rides the page run) | KEEP |
| 84 | the lit box is clear against the dim (every page) | SH-164(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 85 | a round played again is whole (#replay) | SH-161(d) | built from its rows; no break on record since | false alarms in S14 from the film's scaled frames; fixed then | KEEP |
| 86 | a bubble keeps off a side panel (every page) | SH-166(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 87 | one light at a time (every page) | CHAI-50(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 88 | no item on the order card before it is said (every page) | SH-171(o) | SH-171 (open) | none extra (rides the page run) | KEEP |
| 89 | the helper says the item as her card opens (every page) | SH-172(o) CHAI-40(d) | SH-172 (open) | none extra (rides the page run) | KEEP |
| 90 | the next item lit for a new player (every page) | CHAI-37(o) CHAI-77(o) CHAI-106(d) | CHAI-77, CHAI-106 | none extra (rides the page run) | KEEP |
| 91 | the help comes when stuck (every page) | SH-228(o) CLN-221(o) RIDE-11(o) | SH-228, CLN-221, RIDE-11 (open) | none extra (rides the page run) | KEEP |
| 92 | the help's light leaves room round its thing (every page) | SH-230(o) CK-61(o) DAAR-43(o) | CK-61, DAAR-43 (wave 3) | none extra (rides the page run) | KEEP |
| 93 | every part of an order is spoken (every page) | CK-59(o) | CK-59 (open) | none extra (rides the page run) | KEEP |
| 94 | the word moment's card is the 6 Nov card (every page) | SH-231(d) | built from its rows; no break on record since | none extra (rides the page run) | KEEP |
| 95 | nothing is said after a skip (every page) | CK-60(d) DAAR-40(o) | DAAR-40 | none extra (rides the page run) | KEEP |
| 96 | after a boil-over the pot's rows open and its card shows the first item (#boil-over) | CHAI-105(d) CHAI-57(o) | CHAI-105 | none extra (rides the page run) | KEEP |
| 97 | a light on a small part starts on the whole thing and shrinks onto the part (every page) | SH-213(o) | SH-213 (open) | none extra (rides the page run) | KEEP |
| 98 | a first-time lesson due is shown (#tap-mid-order, #slow-cards) | DAAR-41(o) SH-196(o) | DAAR-41 | none extra (rides the page run) | KEEP |
| 99 | after a served card folds the panel shows the next card in its place (every page) | SH-232(o) | SH-232 (open) | none extra (rides the page run) | KEEP |


**New today (part 1, contract-100 to -109, `build/sandbox/lib/contract-s19.mjs`):** each guards a named failure of Zafar's 8 Nov play
and was red then green on a fixture (`build/sandbox/contract-s19.test.mjs`); today's results per game are in the report.
100 kit-card (SH-227, SH-241) · 101 nani-box (SH-149, SH-240) · 102 kit-light (SH-119, MAA-20, Fable's maani flaw 3) · 103 no-buttons
(SH-238) · 104 card-pic (SH-242, SEK-24) · 105 light-whole (CK-63) · 106 light-goes (SH-236) · 107 hop-shelf (SH-237) · 108 praise-last
(SH-239) · 109 shelf-line (SH-243). Building them found one more fault of the probes: the S17 probe and a following one ran as one
expression (no `;` between two IIFEs), so a probe added after S17's never ran; fixed, with a test.

## 5. The sandbox's own gates and the evidence loop

| Check | Runs | Caught | Cost | Verdict |
|---|---|---|---|---|
| A flow reaches its end; no new page error | every sandbox run | every station that stalled (the s18 wave merges' "end reached" lines) | none extra | KEEP |
| The gate cache (`gatecache.mjs`) | `--gate` | skips unchanged pages | none | KEEP |
| The gate's chunks under the lock | `--gate` | it took `/tmp/njg-browser.lock`, which no builder's run took | two browsers at once | FIX: the one lock, never waiting on its own caller (`lib/common.mjs` `locked`), test |
| Evidence: a capture refuses blanks (moment, selector, flat crop, empty text, still strip) | every evidence run | S05's 86 "no evidence" lines became tool failures | none | KEEP |
| Evidence: `--apply` refuses a PASS with no FAIL before it (red then green) | every apply | decision 86 | none | KEEP |
| Evidence: `--collect` refuses the builder's verdicts; `--audit 10` re-judges cached PASSes | each review | decision 96 | a judge call | KEEP |
| `evidence.mjs` lock | evidence runs | it defaulted to the old lock | two browsers at once | FIX (the one lock) |

## 6. The frozen run, load and the standard

| Check | Runs | Caught | Cost | Verdict |
|---|---|---|---|---|
| `frozen.mjs --diff` (chai against its frozen run) | after each chai switch (8 runs, 7-8 Nov) | the glass ding missing on chai's take-back and mistake paths (7-8 Nov; CHAI-107's half-glass ding), a new sound on L3 | ~20 min, 30 pages; locks itself | KEEP |
| `loadtime.mjs` (bytes and time to the first tap, 20% growth fails) | after loading changes | SH-168, CHAI-44 | ±100 ms noise when the leak bots ran beside it | KEEP |
| `audit.mjs` (a game at L1-L4, four sizes, the steps joined) | each game's roll-out | the maani audit's contract-79 (8 Nov) | a browser run | KEEP |
| `audit.mjs --standard` and the standard's Checked-by terms (222 rules: 115 contract, 91 check, 73 tool, 92 probe, 17 judge, 84 gap, 33 doc) | before a gap page or a review | the rules no check covers (the 84 gaps are the to-build list; part 1 closes some) | none (reads saved runs) | KEEP; every tool a rule names exists |
| `stdids.mjs --check` | see section 1 | | | FIX (section 1) |

## 7. The review tools that are checks

| Tool | Runs | Caught | Cost | Verdict |
|---|---|---|---|---|
| panelcheck (side panel at each size and level) | the audit, a panel change | SH-169/SH-191 at 740x320 (6 fails, 7 Nov), SH-189, SH-190 | a browser run | KEEP |
| pillcheck (chai's pills) | a shelf change | SH-219 | one run in three found no pills at 1920x1080 L4 (a 30 s wait against a 27 s intro) | FIX: waits 60 s; test |
| teachgate (prototypes' first-time light) | a prototype kit's change | SH-197 | a browser run | KEEP |
| tapgate (the lab page's play button) | the audit | SH-198 | a browser run | KEEP |
| lightfollow (a new player tapping what is lit) | the audit | the light layers counted before contract-87 | a browser run | KEEP |
| spkgap (the helper card's speaker padding) | the audit | SH-165 | a browser run | KEEP |
| kitsheet (one element from every game, both sizes) | an element's build | S13's look differences by game | a browser run | KEEP |
| labcheck (a lab page at the four sizes) | the lab-first loop | words leaving their cards (28 Oct) | a browser run | KEEP |
| voicegate (no effect over a family line) | a sound change | CHAI-92's picks | reads a sound log | KEEP |
| sprintcheck, touched, regress | each review | the rows and flows a change reaches | none | KEEP |
| fever_bubbles, shoot_knee_wrap | evidence `cmd:` captures | CLN rows' bubbles and wraps | used only by specs | KEEP |
| shotdiff | /review step 4 | nothing since Sprint 8 | reviewers opened "all new" sheets | RETIRE (from /review; code kept) |

## 8. Ops checks and hooks

| Check | Runs | Caught | Cost | Verdict |
|---|---|---|---|---|
| publishgate (no publish while a fixable row is open, checks red or runs stale) | every publish | decision 89 | none | KEEP |
| feedbackcheck (every feedback point a row the same day) | `/feedback` | STD-G4-01 | none | KEEP |
| `brief.mjs --audit` (a session's files inside its owns) | /review step 0b | scope creep | none | KEEP |
| The unpushed hook (PostToolUse) | every tool call | 30-minute pushes; in a builder's worktree only a hint | a line of context | KEEP |

## 9. The older scripts in `build/` (re-run today where they need a browser)

| Script | Runs | Caught | Cost | Verdict |
|---|---|---|---|---|
| check_onboard.mjs (every phase has a first-time help) | named by the QA checklist; no run | INT-04/INT-15 | fails today on 39 prototype phases (beach and town prototypes have no onboarding and no `onboardWhy`) | FIX (not this session's file: the report has the change) |
| check_vessel_meta.py (vessels centred on burners) | QA LAY-10; no run | C7/H11 | fails today: samosa's `META.karahi` and `META.plate` read as None | FIX (the report has it: the meta moved with samosa's kit switch or is missing) |
| check_hotspots.py (clinic hit areas) | QA LAY-11 | the clinic's part sizes | passes today | KEEP |
| test_clinic_heal_a.py (the heal games on the host) | no run | the heal lab A games | times out today on the heal host's mount | FIX (report: a look at the host, which may be a clinic fault) |
| check_clinic_kutchi.mjs | no run | G13 | both hits today false | RETIRE |
| check_speaker_taps.mjs, check_word_card_taps.mjs, check_sidebar_fit.mjs | no run since 26 Oct | SH-134, EASY-11, the S13-A2 sidebar | superseded on every page (above) | RETIRE (see the top) |
| check_stamps.mjs, test_cook.py, test_clinic.py, test_cook_mount.mjs | the publish (stamps), COOK-16 (mount) | B7 stamps; the mount's leaked listeners | see the report's re-run | KEEP |

## 10. The leak bots (`build/tools/review/leak-configs/`)

All 21 configs KEEP (non-negotiable 4). The live ones (clinic, the 11 heal games, day, chaat, farm-photo) run in every checks run; the
six parked modes' (snap, tidy, who, dress, monsoon, find) with `--full` or when their files change (FIX above); Cook's needs a browser
and runs in /review. None is failing today; snap's 122 s was the run's longest.

## Not checks (no verdict)

kitmap (where an element is drawn), faces (face boxes), shelfshot and shelfsheet (pictures), statuscounts, skeleton, heal-marks
(always exit 0), shoot_photo (a prototype's shoot), bg_align_check.py (needs its arguments), the SessionStart hook (installs modules).
