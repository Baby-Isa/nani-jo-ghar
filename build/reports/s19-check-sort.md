# Every check, sorted (10 Nov)

Read-only pass for Zafar's plan to fix the automatic checks. Source: `build/reports/s19-checks-review.md` (its section 3 gives the "flagged" counts: rows, then feedback days). No code changed, no browser run.

## Summary

1. **168 checks sorted** (the 93 contract rules, plus 75 lints, steps, tools, gates and old scripts): **KEEP 140, SCREEN 20, EYE 2, DEAD 6**, plus 4 dead halves inside live rules.
2. **SCREEN 20:** 18 contract rules, `teachgate` and `check_vessel_meta.py`. 9 of them are already in s19-checks-1 (G1). 5 more screen checks are new, for things nobody measures today: snaps, item size, card padding in the game, the scene filling its area, a pan on its burner.
3. **SILENT 17:** 6 rules pass any game missing a field in `games.json`, or a note the game chose not to log (37, 70, 71, 78, 90 and 77). 8 trust a game's own note or step list (36, 72, 73, 74, 76, 98, 102, 109). Then the screen lint's and the static lint's known lists, and `pillcheck`, which looks at chai only.
4. **DEAD 6 whole, 4 halves:** shotdiff, lightfollow, check_clinic_kutchi, check_sidebar_fit, check_onboard, and the two old e2e tests. The halves are in contract-2, -34, -52 and -95. **One is a bug:** contract-95's order-skip fallback is commented out by mistake (`contract-s14.mjs:360`).
5. **EYE:** art style, crowding and "feels finished" stay with the eye judge (Q22-Q28, Q38). New: Q43 for crowding. Contract-104's crate check, done by file name, belongs to Q10. Q3 (two lights) goes back on the list until G1's check has gone red on a bad run.
6. **Order after s19-checks-1:** G2 snaps (P1), G3 sizes and padding (P1), G4 shared pieces in the picture (P1), G5 steps, decoys and no opt-ins (P1/P2), G6 the light over time (P2), G7 scene and placement (P3), G8 other modes (with the first trip). G0 housekeeping rides with G2.

## How to read it

- **KEEP:** reads the real thing: the sound log, the clock, the page's text and classes, the drawn boxes of DOM elements or of canvas objects. It works as it is.
- **SCREEN:** judges a look from the game's own account. That means the light's `data-holes` note, a game's `litBounds` or `njgBox`, `njgTest.faces()` or `.glowing()`, a game's Lifecycle note, a `games.json` opt-in or a CSS flag like `glowFx`. Rewrite it to measure the screenshot (pixels) plus the canvas's object boxes, using the one-line test given.
- **EYE:** taste or proportion. Goes to the eye judge beside chai (`docs/process/eye-judge-rubric.md`).
- **DEAD:** never fires, a duplicate, or superseded. **SILENT:** passes a game it has no data for.
- **Flagged:** rows/days from the review's section 3, for the theme the check guards. **Priority:** P1 = flagged on 10+ days, P2 = 5-9 days, P3 = under 5. Non-negotiables (English, leak, family voices) are KEEP whatever their count.
- **Scope:** general = any mode that uses the shared piece; Cook = `isCookFlow` only; chai = a `games.json` field only chai fills.

## The groups, in order (G1 is s19-checks-1, being built)

**G1 (being built, s19-checks-1):** the light, the dim, overlaps, real bad runs, no silent passes, the shared-pieces lint, the side-by-side's frames. It takes contract-8 (its light half), -52, -53, -76, -82, -83, -87, -92 and -105, plus the dim judge for -84. Once G1 goes red on its bad runs, retire the old versions that read `data-holes` (keep them only as quick first checks). Then: 52's side half becomes a duplicate of 86, and `lightfollow` becomes a duplicate of 87.

**G0. Housekeeping. Small; rides with G2.**
- Fix contract-95's commented-out fallback (`contract-s14.mjs:360`): add a test with an order-skip note and no skip-zone note.
- Retire contract-34's go-on half (contract-103 covers Cook).
- Retire contract-52's side-panel half (contract-86 does it with its room rule; today 52 overrides 86's leniency).
- Retire `lightfollow` and `shotdiff` from the list.
- Run `test_cook.py` and `test_clinic.py` once, then keep or retire them.
- Decide on `check_onboard` (runs nowhere; 39 prototype phases fail).
- Correct `check-audit.md`'s line saying contract-11 skips Cook on a known list: no such list exists today, and contract breaks never ratchet.

**G2. Snaps and glides, measured from the frames. P1 (snaps: 30 rows, 14 days). Medium: 1 new check, 3 rewrites.**
- New check: an item keeps its size from step to step (SH-256).
- Contract-72 rewritten from the row's real scroll position per frame.
- Contract-74 rewritten from the DOM.
- Contract-80 runs on cook.html and every view, not only lab:cook.
- Uses the film buffer that already exists.
- Eye Q41 keeps the "is it chai's glide" judgement.

**G3. Sizes and padding, measured on the screen. P1 (padding: 31 rows, 15 days; item size: 25, 12). Medium: 2 new checks, 1 rewrite.**
- New: the main thing as big as the height allows, items at one height per size class (SH-245; the measurable half of Q24).
- New: card padding and gaps measured in the game, not only on lab pages (Q12's measurable half; `labcheck`'s measure moved into the contract run).
- Contract-73 measured from the speaker's own box, not its note.

**G4. Shared pieces, seen in the picture. P1 (same as chai: 30 rows, 12 days). Medium: 4 rewrites.**
- One gold, one glow: contract-8's glow half and contract-102 read the screen for gold or glow pixels outside the one lit region.
- Contract-107 measures the hop in the strip.
- Contract-44 also counts finger shapes drawn on the canvas.
- The code side is G1's shared-pieces lint.

**G5. Steps, decoys and no opt-ins. P1/P2 (order card: 21 rows, 10 days; Nani names each step: 10, 5). Medium: 7 rules lose their opt-in.**
- Contract-36 takes its steps from the screen: the card's rows and each new lit target.
- Contract-37 counts decoys on the shelf.
- Contract-109 judges one or two items (eggs' lone carton, CK-77).
- Contract-70, -71, -77 and -96 move from chai's `games.json` fields to shared notes every timed or once-each game writes. Corn's and eggs' timed windows get judged.
- The `games.json` check fields are emptied.

**G6. The light over time, from the frames. P2 (light timing: 5 rows, 3 days; first-time lessons: 9, 5). Small to medium: 6 rewrites on G1's lit-region finder.**
- Contract-78, -79, -97, -98 and -106 read when the lit region appears, moves and goes in the frames, not when `data-holes` changes.
- Contract-78 and -90 drop `controlCalls` and `cardLight`: every knob or timed control is judged, not only chai's.

**G7. Scene and placement. P3 (scene fills: 3 rows, 2 days), plus Q26. Small: 2 new checks, 2 rewrites.**
- New: the scene picture fills the play area, with no strip of worktop (CK-75). Contract-11 stays as it is beside it.
- `check_vessel_meta.py` rewritten: the pan's picture centred on its flame ring, from object boxes.
- Contract-110 reads daar's dial from its drawn box, not `njgBox`.
- Contract-47 judges the ride's thing from what is drawn.

**G8. Other modes, with the first trip. Large.**
- Run G1-G7 on the clinic, the day and the farm's HTML screens. Today the "thing" side of the light checks walks Cook's canvas, finds nothing on an HTML screen and passes.
- `teachgate` on pixels.
- One shared trip kit instead of 10 `kit.js` copies.
- The item's glow and hop moved into `js/shared`.
- Contract-103 in the clinic (waits on Zafar: checks-to-build #28).

## The full table

Kind: K = KEEP, S = SCREEN, E = EYE, D = DEAD. Flags: SIL = silent, half-D = a dead half.

### The contract rules (`build/sandbox/lib/contract*.mjs`, run on every sandbox page)

| Check | Says it checks | Actually reads (file:line) | Kind | Screen test (one line) / needs | Rows it came from | Flagged | Scope | Pri | Flags | Group |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 popup | pop-up before play | popup sample `contract-hook.mjs:844`, sound log, input; `contract.mjs:302` | K | - | SH-64 CHT-10 CHAI-15 CK-29 | 21/10 | general | P1 | | |
| 2 moves-on | no ✓/Next once decided | buttons sample `contract-hook.mjs:885` + game's exp; `contract.mjs:385` | K | clinic only now | SH-40 CLN-92 CLN-110 | 8/5 | general | P2 | half-D: Cook superseded by 103 | G0 |
| 3 voice | voice stops at stage end | sound log + Lifecycle stage-end; `contract.mjs:401` | K | - | SH-66 | 30/12 | general | P1 | | |
| 4 bubble | bubble at speaker's head | bubble box (DOM) vs head guessed as sprite's top quarter `contract-hook.mjs:226`, heal-art anchor `:271`; `contract.mjs:438` | K | head is a guess; fine | SH-68 CLN-86 CLN-146 SH-177 | 27/10 | general | P1 | | |
| 5 badges | badges in order | badge opacity `contract-hook.mjs:924`; `contract.mjs:468` | K | - | SH-67 | - | general | P3 | | |
| 6 old-art | no retired art | drawn image hashes `contract-hook.mjs:324`; `contract.mjs:493` | K | - | DAAR-13 ART-17 ART-13 CK-52 | 4/3 | general | P3 | | |
| 7 one-voice | one voice at a time | sound log; `contract.mjs:512` | K | - | PAN-04 | 30/12 | general | P1 | | |
| 8 highlight | one highlight at a time | `glowFx` flags + DOM lit classes `contract-hook.mjs:363`; `contract.mjs:527` | S | one lit region and no gold or glow pixels outside it, held 300 ms | SH-53 SH-79 CK-34 CLN-143/144/145 CK-41 | 5/5 | general | P2 | blind to anything without `glowFx` | G1 (light), G4 (glow) |
| 9 closed-card | no folded card from L3 | OrderCard classes (DOM); `contract.mjs:559` | K | - | CLN-114 SH-110 | 21/10 | clinic | P1 | | |
| 10 your-turn | talkers face the child | `data-pose` at input `contract-hook.mjs:933`; `contract.mjs:579` | K | - | SH-71 CLN-157 | - | clinic | P3 | | |
| 11 background | in proportion and sharp | image natural size vs drawn box `contract-hook.mjs:494`; `contract.mjs:598` | K | add G7's "fills the area" beside it | PAN-14 ART-05 ART-59 ART-60 | 3/2 | general | P3 | missed CK-75 (not its rule) | G7 |
| 12 greyed | buttons hidden until usable | computed opacity, disabled `contract-hook.mjs:407`; `contract.mjs:619` | K | - | SH-23 | 8/5 | general | P2 | | |
| 13 stale-ui | stage clears its UI | reply pills DOM `contract-hook.mjs:424`; `contract.mjs:725` | K | - | CLN-06 | - | general | P3 | | |
| 14 talk | one talk animation | Phaser yoyo tweens + CSS animations `contract-hook.mjs:474`; `contract.mjs:736` | K | - | ART-18 | - | general | P3 | | |
| 15 words-whole | no word split across lines | text range client rects `contract-hook.mjs:838`; `contract.mjs:544` | K | - | SH-73 CLN-153 SH-170 | 17/9 | general | P2 | | |
| 16 english | no English for the child | every visible text vs lexicon `contract-hook.mjs:632,887`; `contract.mjs:798` | K | - | LNG-01 PAN-10 SH-85 MOD-09 MOD-10 CK-42 LNG-15 SH-92 | 10/2 | general | P2 | non-negotiable 3 | |
| 17 voice-src | family voices only (--store) | sound log vs family-audio.json; `contract.mjs:1166` | K | - | LNG-06 LNG-14 | 30/12 | general | P1 | non-negotiable 2 | |
| 18 card-rows | rows tick at step close | rows DOM `contract-hook.mjs:880` + Lifecycle step-close; `contract.mjs:832` | K | - | SH-10 SEK-13 DAAR-19/23 CLN-131/141 | 21/10 | general | P1 | | |
| 19 counting | the counting rule | sound log + card text; `contract.mjs:771` | K | - | DAAR-18 DAAR-24 SH-92 | 30/12 | general | P1 | | |
| 20 one-face | one face per person | faces DOM `contract-hook.mjs:889`; `contract.mjs:817` | K | - | CLN-85/139/149 DAAR-25 CK-40 | 30/12 | general | P1 | | |
| 21 input-live | taps live while a line plays | trusted pointerdown + Lifecycle act; `contract.mjs:869` | K | - | CLN-152 CK-43 CK-45 DAAR-42 | 6/5 | general | P2 | | |
| 22 once-whole | each line once and whole | sound log; `contract.mjs:940` | K | - | PAN-04 PAN-16 CHAI-21 MAA-15 | 30/12 | Cook | P1 | | |
| 23 item-word | item name only in silence | sound log; `contract.mjs:991` | K | - | SH-94 | 30/12 | Cook | P1 | | |
| 24 help-ladder | no help before idle time | hint sample `contract-hook.mjs:685`, sound, clock; `contract.mjs:1017` | K | - | SH-60 SH-95 SH-155 CHAI-32 | 4/2 | general | P3 | | |
| 26 opening | opening heard whole | sound log; `contract.mjs:1108` | K | - | LNG-16 | 30/12 | Cook | P1 | | |
| 30 written | everything said is written | card text + sound log; `contract.mjs:1177` | K | - | SH-99 CLN-161/169/171 | 21/10 | general | P1 | | |
| 31 free-replay | replay free, says what's left | Cook.onHelp kind + sound; `contract.mjs:1213` | K | - | SH-102 SH-114 | 30/12 | Cook | P1 | | |
| 32 divider | review divider room | DOM widths `contract-hook.mjs:695`; `contract.mjs:1237` | K | - | SH-103 | - | general | P3 | | |
| 33 headline-size | pop-up headlines one size | computed font size `contract-hook.mjs:873`; `contract.mjs:1283` | K | - | SH-107 | 17/9 | general | P2 | | |
| 34 go-arrow | go-on arrow; kit buttons | buttons DOM; `contract.mjs:638,652` | K | - | SH-106 | 8/5 | general | P2 | half-D: go-on half quiet since SH-238 | G0 |
| 35 card-ladder | the card by level | side/rows DOM; `contract.mjs:1353` | K | - | SH-110 SAM-26 MAA-18 | 21/10 | Cook | P1 | | |
| 36 step-call | Nani calls each step | the game's own step-open list + sound; `contract.mjs:1420` | K | needs steps from the screen (card rows, each new lit target), not the game's list | SH-110 SEK-18 SH-133 CK-76 | 10/5 | Cook | P2 | SIL: eggs declares one step, so one call passes | G5 |
| 37 decoys | decoys by level | the game's own decoy note; `games.json` decoys; `contract.mjs:1462` | K | needs: count the shelf's word things on screen | CK-49 SH-132 CK-71 | 6/3 | Cook | P3 | SIL: eggs, baking, corn, maani not listed | G5 |
| 38 two-pages | end screen two pages | endpages DOM `contract-hook.mjs:871`; `contract.mjs:1252` | K | - | SH-104 | - | general | P3 | | |
| 39 card-english | card English supported, then tapped | card-en DOM `contract-hook.mjs:869`; `contract.mjs:1262` | K | - | SH-123 CHAI-71 | 10/2 | general | P2 | | |
| 40 one-card | one card markup | kitcard classes `contract-hook.mjs:876`; `contract.mjs:1391` | K | - | SH-110 | 30/12 | general | P1 | | |
| 41 one-popup | one order pop-up | kitcard DOM; `contract.mjs:1407` | K | - | S13-B1 | 30/12 | general | P1 | | |
| 42 face-circle | one face circle, three sizes | facekit DOM `contract-hook.mjs:891`; `contract.mjs:666` | K | - | ART-08 | 30/12 | general | P1 | | |
| 44 one-finger | one finger, the kit's | DOM fingers `contract-hook.mjs:613`; `contract.mjs:686` | K | G4: also count finger shapes drawn on the canvas | SH-233 SH-19 SH-130 SH-141 | 30/12 | general | P1 | blind to a canvas finger | G4 |
| 45 door-turn | door lines in turn | sound log; `contract-day.mjs:101` | K | - | - | 30/12 | day | P3 | | |
| 46 door-english | English only under door lines | texts DOM; `contract-day.mjs:121` | K | - | - | 10/2 | day | P3 | | |
| 47 ride-hidden | never asks for a hidden thing | boxes the game puts in its ride-call note; `contract-day.mjs:63` | S | at the call, 80% or more of the thing's drawn box is inside the window's opening and not under a drawn prop | RIDE-02 | - | day | P3 | | G7 |
| 48 ride-fair | asks as it comes into view | the game's ride log; `contract-day.mjs:81` | K | - | RIDE-04 | - | day | P3 | | |
| 49 one-end | one end screen | kitend classes `contract-hook.mjs:903`; `contract.mjs:1644` | K | - | S13-B2 | 30/12 | general | P1 | | |
| 50 one-tick | samosa ticks at once | rows DOM; `contract.mjs:1494` | K | - | SAM-24 SAM-27 | 21/10 | samosa | P1 | | |
| 51 inside-card | every word inside its card | glyph box vs card box `contract-hook.mjs:896`; `contract.mjs:1665` | K | - | SH-142 SH-138 SH-170 CHAI-69 | 17/9 | general | P2 | | |
| 52 bubble-clear | bubble off faces and panel | bubble DOM vs code's head boxes; `contract.mjs:1682` | S | a bubble covers 25% or less of any face found on screen | CK-18 SH-145 SH-138 CHAI-48 SH-177 | 27/10 | general | P1 | half-D: side half duplicates 86 | G1 |
| 53 one-in-light | light holds one thing; no dark without a box | `data-holes` + Cook word things `contract-hook.mjs:805`; `contract.mjs:1696` | S | one lit region holding one thing (picture with its pill); no dimmed frame without a lit region | CHAI-33 SH-138 CHAI-36 | 16/11 | Cook | P1 | | G1 |
| 54 rail-in-side | panel buttons inside it | DOM boxes `contract-hook.mjs:896`; `contract.mjs:1712` | K | - | CK-53 SH-138 | 8/5 | general | P2 | | |
| 65 chop-waves | chop waves without a gap | the game's chop-throw log; `contract-daal.mjs:26` | K | - | DAAR-35 | 18/6 | daar | P2 | | |
| 66 stir-flag | a lap at the flag, in step | the game's stir-lap log + sound; `contract-daal.mjs:46` | K | - | DAAR-30 DAAR-27 | 18/6 | daar | P2 | | |
| 70 slow-at-green | turn-off line at the green | the game's chai-slow note; `games.json` slowAtGreen; `contract-chai.mjs:97` | K | needs: a shared note from every timed window | CHAI-24 | 18/6 | chai | P2 | SIL: corn and eggs windows never judged | G5 |
| 71 once-each | once each into a pan | the game's chai-add note; `games.json` onceEach; `contract-chai.mjs:118` | K | as 70 | CHAI-22 | 18/6 | chai | P2 | SIL | G5 |
| 72 row-glide | order row glides | the game's row-glide note ("smooth"); `contract.mjs:1785` | S | the row's scroll position per frame never steps over 2 px between frames, and moves at most 2.5 cards per glide | SH-152 CHAI-39 | 30/14 | Cook | P1 | SIL: silent if not logged | G2 |
| 73 bubble-speaker | bubble's speaker big | the game's bubble-spk note; `contract.mjs:1796` | S | the speaker's drawn box is 48 px or more and 1.8 em or more of its words; its icon is 60% of it or more | SH-153 | 31/15 | Cook | P1 | SIL | G3 |
| 74 order-skip | a tap lands the whole order | the game's order-skip note; `contract.mjs:1806` | S | within 1 s of a tap during the order: no big card or flyer on screen, every card in its row, the station started | CK-54 | 21/10 | Cook | P1 | SIL | G2 |
| 75 skip-zone | bubble or panel taps don't skip | shared request-popup.js skip-zone note; `contract.mjs:1762` | K | - | SH-157 | 6/5 | general | P2 | | |
| 76 pop-face | big card never over a face | the game's pop-face note (its own px²); `contract.mjs:1771` | S | the big card's drawn box covers no face found on screen | SH-154 | 27/10 | Cook | P1 | SIL | G1 |
| 77 timed-hold | first-time hold new players only | chai-tray's timed-hold note; `contract.mjs:1777` | K | - | SH-158 | 9/5 | chai | P2 | SIL: other games' holds unseen | G5 |
| 78 call-light | call and light together | `data-holes` timing `contract-hook-s14.mjs:161,197` + sound; `controlCalls`; `contract-s14.mjs:58` | K | needs: the lit region's time from G1; every control judged, not only chai's | CHAI-40 CHAI-49 CHAI-52 CHAI-60 SH-181 | 5/3 | chai | P3 | SIL: only chai listed | G6 |
| 79 card-light | card light waits for stillness | `data-holes` + Phaser display-list motion `contract-hook-s14.mjs:73`; `contract-s14.mjs:98` | K | lit time from G1 | CHAI-42 SH-178 | 5/3 | Cook | P3 | flaky at speed 3 | G6 |
| 80 no-jump | kitchen still after first frame | scene bg box, zoom (display list) `contract-hook-s14.mjs:172`; `contract-s14.mjs:115` | K | run on cook.html and every mode too | CHAI-45 | 30/14 | lab:cook only | P1 | | G2 |
| 81 over-gauge | no picture over a gauge | display-list depth over the ring `contract-hook-s14.mjs:128`; `contract-s14.mjs:140` | K | - | CHAI-46 | 27/10 | chai's gauge | P1 | | |
| 82 edge-on-face | no light edge across a face | `data-holes` + `njgTest.faces()` (game's own boxes) `contract-hook-s14.mjs:41`; `contract-s14.mjs:167` | S | no lit region's edge crosses a face found on screen (5-95% of it inside) | CHAI-47 | 27/10 | general | P1 | | G1 |
| 83 card-on-face | no card over a face | DOM cards + `njgTest.faces()`; `contract-s14.mjs:186` | S | no card's drawn pixels over a face found on screen | SH-154 CHAI-43 SH-203 | 27/10 | general | P1 | | G1 |
| 84 light-clear | lit box clear against the dim | pixels, inside `data-holes` boxes, `lightpix.mjs:40-70`; `contract-s14.mjs:198` | K | G1 adds: the dim outside is chai's strength (it logs 78.8 eggs vs 131.4 chai, judges nothing) | SH-164 SH-250 | 5/4 | general | P3 | | G1 |
| 85 replay | a replayed round is whole | texture keys after Play again; `contract-s14.mjs:212` | K | - | SH-161 | 4/3 | #replay only | P3 | | |
| 86 bubble-clear | bubble off the side panel | DOM bubble vs DOM panels `contract-hook-s14.mjs:211`; `contract-s14.mjs:226` | K | - | SH-166 | 27/10 | general | P1 | | |
| 87 one-light | one light at a time | count of `.njg-onboard.on` layers `contract-hook-s14.mjs:197`; `contract-s14.mjs:248` | S | one lit region in the frame, held 300 ms | CHAI-50 SH-249 | 5/5 | general | P2 | blind to Cook's old overlay | G1 |
| 88 item-said | no item before it's said | rows14 DOM `contract-hook-s14.mjs:241`; `contract-s14.mjs:261` | K | - | SH-171 | 21/10 | Cook | P1 | | |
| 89 helper-call | helper says item as card opens | helper DOM + sound; `contract-s14.mjs:281` | K | probe fault (s19-wave-d) in G1 | SH-172 CHAI-40 | 21/10 | Cook | P1 | | G1 (fault) |
| 90 card-light | next item lit for a new player | chai-add note + `cardLight`; `contract-chai.mjs:131` | K | needs: the lit region over the next card, from G1; every game | CHAI-37 CHAI-77 CHAI-106 | 9/5 | chai | P2 | SIL | G6 |
| 91 help-comes | help when stuck | want sample + sound + clock; `contract.mjs:1072` | K | - | SH-228 CLN-221 RIDE-11 | 4/2 | general | P3 | | |
| 92 light-room | light leaves room | `data-holes` + Cook word things `contract-hook.mjs:805`; `contract-s14.mjs:307` | S | the lit region's edge is 6 px or more outside its thing's picture and pill on every side, less only where a neighbour or the frame's edge is closer | SH-230 CK-61 DAAR-43 | 16/11 | Cook | P1 | | G1 |
| 93 own-words | every part of an order spoken | sound log; `contract-s14.mjs:331` | K | - | CK-59 | 30/12 | Cook | P1 | | |
| 94 wm-card | word-moment card is the 6 Nov one | computed fonts, DOM gap `contract-hook.mjs:900`; `contract-s14.mjs:347` | K | - | SH-231 | 31/15 | general | P1 | | |
| 95 skip-silent | nothing said after a skip | sound log + skip notes; `contract-s14.mjs:357` | K | fix line 360: `\|\| life("order-skip")[0]` sits inside a `//` comment | CK-60 DAAR-40 | 30/12 | Cook | P1 | half-D: the order-skip path never runs | G0 |
| 96 boil-reopen | rows reopen after boil-over | the game's chai-boil note + panel DOM; `contract-s17.mjs:34` | K | - | CHAI-105 CHAI-57 | 21/10 | chai | P1 | | |
| 97 zoom-in | light on a part starts whole | `data-holes` over time + litthing `contract-hook.mjs:997`; `contract-s17.mjs:54` | S | a lit region on a part under 1/4 of its thing first covers 60% or more of the thing's box, then shrinks onto the part | SH-213 | 16/11 | general | P1 | | G6 |
| 98 lesson-shown | a lesson due is shown | the game's own selectors (reveal `contract-hook.mjs:1003`) + its reveal-lesson note; `contract-s17.mjs:84` | S | a new player's first dotted word or blurred picture gets a lit region over it before the next step | DAAR-41 SH-196 | 9/5 | Cook | P2 | SIL: the game says it showed | G6 |
| 99 panel-follow | next card in place after a fold | fold + panel DOM `contract-hook.mjs:1043,1052`; `contract-s17.mjs:101` | K | - | SH-232 | 21/10 | Cook | P1 | | |
| 100 kit-card | 6 Nov card and type | card DOM classes `contract-s19.mjs:449`; `:87` | K | - | SH-227 SH-241 | 30/12 | Cook | P1 | | |
| 101 nani-box | Nani's box, drop-down, one line | `#guide` DOM, measured fit `contract-s19.mjs:476`; `:103` | K | - | SH-149 SH-240 | 30/12 | Cook | P1 | | |
| 102 kit-light | no game's ghost finger or glow | the game's ghost log (`game: at` object) `contract-s19.mjs:508`; `njgTest.cook.glowing()` `:519`; `:130` | S | no gold, glow or finger pixels outside the one lit region, held 300 ms | SH-119 MAA-20 | 30/12 | Cook | P1 | SIL: a game that logs no ghost passes | G4 |
| 103 no-buttons | no tick, next or X | DOM buttons `contract-s19.mjs:536`; `:158` | K | clinic waits on Zafar (checks-to-build #28) | SH-238 | 8/5 | Cook | P2 | | G8 |
| 104 card-pic | item card has its own picture | img loaded (DOM); crate by file name `contract-s19.mjs:174` | K | blank half K; the "one of the thing" half is Q10 | SH-242 SEK-24 | 4/3 | Cook | P3 | half-E | |
| 105 light-whole | light whole round its thing, centred | `data-holes` + the game's `litBounds` `contract-s19.mjs:573`; `:191` | S | one lit region; a rounded rectangle (corner 1/4 of its height or less; a circle or oval fails); holds item, pill and face with pad P; whole in the frame unless its thing touches the edge; middle within 4 px of its thing's | CK-63 SH-249 | 16/11 | Cook | P1 | the game tells the check what to measure | G1 |
| 106 light-goes | light goes as the move starts | `data-holes` vs trusted press; `contract-s19.mjs:243` | S | within 300 ms of a press inside the lit region, no lit region round the press in the frames | SH-236 | 5/3 | Cook | P3 | | G6 |
| 107 hop-shelf | only shelf items hop | `njgTest.cook.glowing()` bounce flag `contract-s19.mjs:519`; `:264` | S | a lit shelf item's picture rises and falls by 4% of its height or more in the strip; nothing above the shelf band does | SH-237 | 30/12 | Cook | P1 | | G4 |
| 108 praise-last | well done once all ticked | sound + rows DOM; `contract-s19.mjs:300` | K | - | SH-239 | 21/10 | Cook | P1 | | |
| 109 shelf-line | items on one base, pills on one line | Phaser bounds of word things `contract-s19.mjs:640`; `:316` | K | needs: judge 1-2 items too (each on the base line, a lone item centred in its slot) | SH-243 CK-77 | 11/10 | Cook | P1 | SIL: under 3 items is skipped | G5 |
| 110 knob-side | knob left of a lone pan, else below | Phaser bounds (kit-knob-off, flames); daar's dial by its own `njgBox` `contract-s19.mjs:664`; `:331` | K | needs: the dial's drawn box, not `njgBox` | SH-247 | 11/10 | Cook | P1 | | G7 |
| 111 item-reach | a tap at the foot picks the item | Phaser's own hit test `contract-s19.mjs:709`; `:379` | K | - | SH-244 | 6/5 | Cook | P2 | | |

### Lints (`build/lint/`)

| Check | Says | Reads | Kind | Needs | Rows | Flagged | Scope | Pri | Flags | Group |
|---|---|---|---|---|---|---|---|---|---|---|
| layout.mjs screen lint (text-clipped, ellipsis, text-small, tap-small, offscreen, covered ...) | text and taps on screen | computed styles and boxes per recorded state | K | known list shrinks only | TXT-01/02/05/10 LAY-04/06 | 17/9 | general | P2 | SIL: 2485 known pass (eggs' 12 px "fried egg") | |
| phaser.mjs | canvas text small, off screen, covered | Phaser Text objects' drawn size | K | - | Cook canvas text | 5/4 | Cook | P3 | | |
| css.mjs spacing-grid | padding on the grid | CSS files | K | - | LAY-03 | 31/15 | general | P1 | | |
| words.mjs | no typed Kutchi or English | js/ literals | K | - | LNG rows | 10/2 | general | P2 | | |
| ratchet (baseline, ignore, --check) | no new finding | lint results vs baseline.json | K | - | - | - | general | P3 | SIL: known findings pass | |
| static: kit | no restyle of shared classes | css/ outside css/shared | K | - | S13 kit rows | 30/12 | general | P1 | 18 known | |
| static: tokens | colours from tokens | css/ | K | - | - | 30/12 | general | P1 | 491 known | |
| static: ladder | timers by level | data | K | - | heal ladders | 18/6 | general | P2 | | |
| static: words | banned forms | data | K | - | decision 61 | 10/2 | general | P2 | | |
| static: privacy | nothing leaves the device | js/ | K | - | J1 | - | general | P3 | | |
| static: reward | no sweets | data | K | - | non-neg 9 | - | general | P3 | | |
| static: hintwait | one help ladder | data, js/ | K | - | S13-A1 | 4/2 | general | P3 | | |
| static: shell | kit.css once | pages | K | - | S13 | 30/12 | general | P1 | | |
| static: motion | no game glow or hop keyframes | css/ | K | - | 19 known | 30/12 | general | P1 | known list let the old dim through (entry 445) | |
| static: jscolour | no colour literal in js/ | js/ | K | - | - | - | general | P3 | 275 known | |
| static: plane | doctor and girl in one plane | data/clinic/scenes-v2.json | K | - | CLN-154 | - | clinic | P3 | | |
| static: loadcap | art load not capped in game time | js/ | K | - | CHAI-25 CK-04 CK-08 | 4/3 | general | P3 | | |
| static: voice | one voice player | js/ | K | - | S13-V | 30/12 | general | P1 | | |
| static: fonts | faces only in tokens | css/, js/ | K | - | SH-224 | 30/12 | general | P1 | warnings outside chai | |

### checks.mjs steps (`build/tools/review/checks.mjs:41`; words and static above)

| Check | Says | Reads | Kind | Needs | Rows | Flagged | Scope | Pri | Flags | Group |
|---|---|---|---|---|---|---|---|---|---|---|
| unit | every test file passes | node --test | K | G1 adds the bad-run tests | - | - | general | P1 | | G1 |
| leak (21 bots, leak-configs/) | no winning without Kutchi | bots that see only the screen | K | - | non-neg 4, CLN-120 | 6/3 | general | P1 (non-neg) | | |
| bump | pages stamp | bump_version --dry-run | K | - | - | - | general | P3 | | |
| specs | evidence specs sound | evidence.json | K | - | S05 | - | general | P3 | | |
| docs | doc limits, IDs, paths | docs/ | K | - | - | - | general | P3 | | |
| stdids | standard IDs placed once | standard docs | K | - | - | - | general | P3 | | |
| recordings | sheet up to date | recording sheet | K | - | - | - | general | P3 | | |
| fixlist | open rows labelled | regressions.md | K | - | - | - | general | P3 | | |
| decisions | answers on their rows | docs/decisions | K | - | - | - | general | P3 | | |
| art (artcolour.py) | no baked shadow | the art's pixels | K | - | 6 Nov pack | 24/14 | general | P3 | | |
| size (sitesize) | site under 800 MB | tracked files | K | - | - | - | general | P3 | | |
| load (loadcheck, --browser) | a page loads only its own art | requests | K | - | decision 68 | 4/3 | general | P3 | | |

### Review tools that are checks (`build/tools/review/`)

| Check | Says | Reads | Kind | Screen test / needs | Rows | Flagged | Scope | Pri | Flags | Group |
|---|---|---|---|---|---|---|---|---|---|---|
| panelcheck | side panel at each size and level | DOM boxes | K | - | SH-169 SH-189-191 | 31/15 | Cook | P1 | | |
| pillcheck | pills fit their word, never touch | chai's pills on screen | K | every game; "pill not covered" goes in G1's overlap check | SH-219 | 7/7 | chai | P2 | SIL: other games unjudged | G1 |
| teachgate | prototype light never on a done thing | `data-holes` (`teachgate.mjs:43-45`) | S | after tapping the lit thing, its lit region is gone in the frames within 1.2 s and never sits on a done thing | SH-197 | 16/11 | prototypes | P1 | | G8 |
| tapgate | lab play button | DOM | K | - | SH-198 | - | general | P3 | | |
| lightfollow | new player taps what is lit | `data-holes` layers (`lightfollow.mjs:37`) | D | duplicate of 87, then of G1 | - | 5/5 | Cook | - | | G0 |
| spkgap | helper card speaker padding | DOM boxes | K | - | SH-165 | 31/15 | Cook | P1 | | |
| kitsheet | one element from every game | pictures for the eye | E | Q9, Q12, Q20 | S13 | 30/12 | general | P1 | | |
| labcheck | lab page, words in cards, four sizes | DOM glyph boxes + shots | K | its measure moves into the game run (G3) | 28 Oct | 31/15 | lab pages | P1 | | G3 |
| voicegate (in audit.mjs) | no effect over a family line | sound log | K | - | CHAI-92 | 30/12 | general | P1 | | |
| sprintcheck, touched, regress | which rows and flows a change reaches | git diff, rows | K | - | - | - | general | P3 | | |
| fever_bubbles, shoot_knee_wrap | evidence captures | DOM + debug driver | K | - | CLN rows | - | clinic | P3 | | |
| shotdiff | changes since the approved run | Sprint 8's approved shots | D | retired 8 Nov | - | - | - | - | | G0 |
| frozen.mjs --diff | chai behaves as frozen | sound and behaviour diff | K | - | CHAI-107 | 30/12 | chai | P1 | | |
| loadtime | bytes and time to first tap | network, clock | K | - | SH-168 CHAI-44 | 18/6 | general | P2 | | |
| audit.mjs (+ --standard) | a game at L1-L4, four sizes | joins the above | K | report "judged N of M" (G1) | - | - | general | P2 | | G1 |
| green-check | corn's green at least chai's | data/stations json | K | - | CK-65 | 18/6 | Cook | P2 | | |
| sidebyside.mjs | game beside chai at key moments | pictures for the eye judge | E | fixes in G1 (SH-251) | - | - | Cook | P1 | | G1 |

### Sandbox and evidence gates, ops, tiers

| Check | Says | Reads | Kind | Needs | Rows | Scope | Pri | Flags |
|---|---|---|---|---|---|---|---|---|
| flow reaches its end; no new page error | the run finishes clean | sandbox run | K | - | every stall | general | P1 | |
| evidence: refuses blank captures | no empty evidence | captures | K | - | S05 | general | P3 | |
| evidence: red then green (--apply) | a pass needs a fail first | verdict log | K | G1: real bad runs | decision 86 | general | P2 | |
| evidence: --collect, --audit 10 | judge, not builder | verdicts | K | - | decision 96 | general | P3 | |
| evidence.json row probes (~1250 specs) | each row's own proof | DOM operators (noOverlap, inside, centredOn, noClip, minFont) and `js:` game paths | K | where a `js:` probe judges a look, it is SCREEN: move it as each group lands | many | general | P2 | |
| publishgate | no publish while gates red | tier results | K | - | decision 89 | general | P3 | |
| feedbackcheck | every point a row | feedback files | K | - | STD-G4-01 | general | P3 | |
| brief.mjs --audit | session stayed in its files | git | K | - | - | general | P3 | |
| unpushed hook | push often | git | K | - | - | general | P3 | |
| push-hook (check-push) | checks before any push | checks.mjs | K | - | - | general | P1 | |
| check-change | touched game, its rules, red then green | contract run | K | use "judged N of M" (G1) | - | Cook | P1 | |
| check-sprint | changed games L1-L4, four sizes | contract run | K | - | - | Cook | P1 | |
| check-publish | last fails again, --full | contract, checks | K | - | - | general | P1 | |
| check-live | first minute live: errors, frame strip | page errors; frames for the eye | K | strip is for the eye | - | general | P2 | |
| check-prototype | lab at four sizes, first-play film | labcheck + film | K | film is for the eye | - | prototypes | P2 | |

### Old scripts (`build/`)

| Check | Says | Reads | Kind | Screen test / needs | Rows | Pri | Flags | Group |
|---|---|---|---|---|---|---|---|---|
| check_onboard.mjs | every phase has first-time help | data (`onboardWhy`) | D | runs nowhere; fails 39 prototype phases; G8's light check replaces it | INT-04 INT-15 | P3 | | G0 |
| check_vessel_meta.py | vessels centred on burners | the code's META numbers | S | the pan's drawn picture's middle is within 4 px of its flame ring's middle, at every size | C7 H11 (Q26) | P3 | fails: samosa META None | G7 |
| check_hotspots.py | clinic hit areas | data | K | - | LAY-11 | P3 | | |
| test_clinic_heal_a.py | heal games on the host | browser | K | times out on the heal host (audit) | heal lab A | P3 | | |
| check_clinic_kutchi.mjs | no Kutchi literals in clinic | js/clinic | D | retired; word lint covers | G13 | - | | |
| check_speaker_taps.mjs | speakers 48 px or more | DOM | K | measure the foot, the tap area (audit FIX) | SH-134 | P2 | false alarms since 6 Nov | |
| check_word_card_taps.mjs | reveal buttons 44 px or more | DOM | K | - | EASY-11 | P3 | | |
| check_sidebar_fit.mjs | sidebar fits | browser | D | retired; contract-51 and the screen lint cover | S13-A2 | - | | |
| check_stamps.mjs | version stamps on every script | pages | K | - | B7 | P2 | | |
| test_cook_mount.mjs | mount leaks no listeners | browser | K | - | COOK-16 | P3 | | |
| test_cook.py, test_clinic.py | old end-to-end | browser | D | run nowhere since October; run once, then decide | - | - | | G0 |

### Things Zafar flags that no check measures (new, to build)

| New check | Kind | Screen test (one line) | Rows | Flagged | Pri | Group |
|---|---|---|---|---|---|---|
| No snap | S | between frames no item's drawn box changes size by over 15% or jumps by over 8 px unless it is in a tween lasting 150 ms or more | SH-256 | 30/14 | P1 | G2 |
| Item size | S | the main thing's height is 45% or more of the play area's height, and items of one size class are within 15% of each other's height | SH-245 (Q24 half) | 25/12 | P1 | G3 |
| Card padding in the game | S | each card's inner padding is equal on all sides within 2 px, gaps between cards are equal within 2 px, and the current card is whole in view | SH-165 (Q12 half) | 31/15 | P1 | G3 |
| Scene fills its area | S | no band of worktop or blank 4 px or more between the scene picture and the play area's edge | CK-75 | 3/2 | P3 | G7 |
| Pan on its burner | S | as `check_vessel_meta` above | Q26 | - | P3 | G7 |

### EYE: stays with the judge beside chai

| What | Rubric question | Flagged | Note |
|---|---|---|---|
| Art style, camera, code-drawn stand-ins, rough cuts, modest dress | Q22, Q23, Q25, Q27, Q28 | 24/14 | eye only, rightly |
| Item proportion beyond the size rule | Q24 | 25/12 | G3 takes the measurable half |
| One of the thing on the item card | Q10 | 4/3 | contract-104's file-name crate check is a stand-in |
| Crowding: one clear focus, room round the main thing | **Q43 (new):** "Is there one clear thing to look at, with room round it, and nothing crowding the main pan, the panel or the shelf?" | 27/10 (part of overlaps) | propose to Zafar |
| Feels finished | Q38 | - | already the last question |
| Two lights at once | Q3 back on the list | 5/5 | until G1's check goes red on its bad runs (review section 5) |

## What I did not do

- No browser run; every "reads" line is from the code.
- The flagged counts are the review's keyword pass and run low.
- The evidence.json probes are sorted as one class, not one by one.
- Sizes are rough (small, medium, large), with no times, per the plan rule.

## Proof
- Read from the code at e9f8afa4c: build/sandbox/lib/contract*.mjs, regress.mjs CONTRACT_ROWS, build/lint/**, build/tools/review/*.mjs, build/tools/tiers/, docs/process/check-audit.md.
- Checked again by the orchestrator: the contract-95 fallback sits inside a `//` comment at `build/sandbox/lib/contract-s14.mjs:360`.
