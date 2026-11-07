# F Build

**The question:** how is it made so the next game inherits it?

Layers: decision 13 (7 Nov), as in the README.

## F1 Kit vs game

#### STD-F1-01 · Behaviour lives in the lowest layer every game needing it can reach, and is fixed there once
- **Why:** Sprint 18 rule 2 and decision 13 (Zafar, 7 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:kitmap + gap: kitmap.mjs failing a kit element drawn in a station file
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** shared kit

#### STD-F1-02 · No game copies kit code, and no kit file names a game
- **Why:** Sprint 18 rule 3 (Zafar, 7 Nov: "modular, scalable, best practice")
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/kit + gap: a static rule failing a game named in kit code (`js/cook/flow.js:1711`)
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** shared kit

#### STD-F1-03 · A game is its settings file and its own mechanic; all else is a kit call
- **Why:** Sprint 18 rule 1 (7 Nov)
- **Scope:** Family
- **Pattern / part:** - / -
- **Checked by:** tool:kitmap + gap: audit.mjs --standard (Sprint 17's tool builder)
- **See it:** lab/kit.html (1280x665)
- **Status:** agreed 7 Nov
- **Layer:** game · **Lives in:** `data/stations/chai-tray.json` · **Source rows:** DAAR-36, SAM-28, SEK-22, MAA-19, CHT-17, SH-141

#### STD-F1-04 · A screen or button seen in two modes is one shared component, never restyled
- **Why:** non-negotiable 6
- **Scope:** House
- **Pattern / part:** - / order card, Nani's box, end screen, buttons, face circle
- **Checked by:** check:static/kit + check:static/shell + contract-34 + contract-40 + contract-41 + contract-42 + contract-49
- **See it:** lab/kit.html (930x430)
- **Status:** agreed 26 Oct (one kit)
- **Layer:** shared kit · **Lives in:** `js/shared/`

#### STD-F1-05 · A game runs a kit piece on its old code or on the kit, never both
- **Why:** "never a kit piece half-switched" (7 Nov); lesson R3
- **Scope:** House
- **Pattern / part:** P4 / -
- **Checked by:** tool:kitmap + gap: chai's frozen-run diff per switch
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** shared kit

#### STD-F1-06 · In a build run each module has one owner; builders' files are disjoint
- **Why:** Sprint 18 rule 4 (7 Nov)
- **Scope:** House
- **Pattern / part:** P4 / -
- **Checked by:** tool:brief (--live-check) + doc:/brief standing lines
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** shared kit

### The module map (chai today, at 34641d3)

chai = `js/cook/stations/chai-tray.js`, ui = `js/cook/ui.js`, kk = `js/cook/kitchen-kit.js`, lib = `js/cook/station-lib.js`,
flow = `js/cook/flow.js`; (a) to (e): Sprint 18's kit builders; a blank call is the builder's to name.

| Piece | Layer | Lives today | By | A game calls |
|---|---|---|---|---|
| Heat and boil (knob, too early, green, over, heat tick) | stove part | chai 317, 1542-1757; `js/cook/mechanics/boil.js` | (a) | |
| Hob, burners, flames, heat ring | stove part | kk 88-124, 248-302, 372-404 | (a) | `Cook.Kit.hob`, `.burner`, `.heatRing` |
| The boil's sound | stove part | chai 1666-1692; `js/shared/sfx.js` | (a) | |
| Pans and their looks | kitchen kit | chai 641-768, 985-1223; kk 303-314 | (b); boil looks open | `Cook.Kit.place` |
| Pour or spoon from the shelf | kitchen kit | chai 1377-1541 | (b) | |
| Pan into its glass; take-back | kitchen kit | chai 1758-2081; `js/shared/pour.js` | (b) | `NjgPour.plan` (chai 1970) |
| Serving: review faces, the tick, recast | shared kit | chai 3207-3415; kk 178-247; lib 1129 | (b) | `Cook.Kit.review`, `St.redo` |
| Shelf: decoys, size classes, slots | shared kit | chai 442-466, 793-984; lib 170-336 | (c) | `St.tableDecoys`, `St.classFit` |
| Word chips and pills | shared kit | chai 337-350, 827-955; kk 334-371 | (c) | `Cook.Kit.chip`, `progress.pillShows` |
| Count pills | shared kit | ui 3901-4073; `js/shared/tally.js` | (c) | `UI.count`, `UI.tallyAt` |
| Word pop by the action; juice | shared kit | chai 1224-1376; `js/shared/juice.js` | (c) | `Juice.P` |
| Lights: first time, zoom-in, next pan, stuck rungs, call-out | shared kit | `js/shared/onboard.js`; `js/cook/coach.js`; chai 351-441, 2118-2807 | (d) | `Onboard.light`, `Onboard.stuck`, `Cook.Coach.rungs` |
| Reveal lessons (dots, blur) | shared kit | chai 2946-3206 | (d) | |
| Order's flow and timings: said, pop-out, fold, follow, ticks, skip | shared kit | ui 1478-2679, 2894-3815; `js/shared/order-card.js`; `js/shared/request-popup.js`; flow 437-526 | (e) | `UI.mission.introduce`, `.tickItem`; `UI.followCard` |
| Side panel: Nani's box, helper, stepper, fit | shared kit | ui 633-1166; `js/shared/guide.js`; `js/shared/frame.js:223-258` | (e) | `UI.step`, `UI.helperOpen` |
| Bubbles | shared kit | ui 400-632; request-popup 434-712 | (e) | `UI.say`, `Lifecycle.bubble.place` |
| People say their orders | shared kit | chai 2082-2117, 2937-2945 | (e) | `UI.readAlong` |
| Word moment | shared kit | `js/shared/word-moment.js`; ui 77-165; flow 455, 1781 | built | `UI.wordMoment(ids)` |
| Progress snapshot | shared kit | `js/core/progress.js:301-310`; flow 439, 737 | built | `progress.freeze()`, `.thaw()` |
| Closing scene, end screen | shared kit | flow 282-306, 735-786; `js/shared/results.js` | built | Lifecycle's end |
| Worktop wash, stone band | kitchen kit | chai 575-632; lib 225-251 | open | `St.worktopWash`, `St.stoneBand` |
| Mic serve | game | chai 2805-2883 | chai's owner | |
| Chai's recipe, levels, level-up count | game | chai 243-336, 3416-3440; `data/stations/chai-tray.json` | chai's owner | `Mech.combined`, `Cook.roundDone` |
| Test hooks | each layer | chai 769-792, 864, 892, 1587, 1675, 2012 | each owner | `Cook.chaiPans` |

## F2 One source of numbers

#### STD-F2-01 · Every colour, typeface and motion number comes from the design tokens, never a literal in game code
- **Why:** one kit (Zafar, 26 Oct, decisions 2 and 8); fonts (6 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/tokens + check:static/jscolour + check:static/fonts + check:static/motion
- **See it:** -
- **Status:** agreed 6 Nov
- **Layer:** shared kit · **Lives in:** `css/shared/tokens.css`, `js/shared/tokens.js`

#### STD-F2-02 · Every number that changes by level is read from the central rules file
- **Why:** SH-155 (Zafar, 29 Oct): decoys by level from the central rules
- **Scope:** House
- **Pattern / part:** - / help ladder
- **Checked by:** check:static/hintwait + check:static/ladder + contract-35 + contract-37
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (1280x665)
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json`, `js/shared/rules.js`

#### STD-F2-03 · A game's own numbers live in its settings file, never in its code
- **Why:** Sprint 18 rule 1 (7 Nov); chai keeps art measures in code (chai 52-104)
- **Scope:** Family
- **Pattern / part:** - / -
- **Checked by:** gap: a static rule flagging a table of numbers in a station file
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** game · **Lives in:** `data/stations/chai-tray.json`

#### STD-F2-04 · A size or place is a share of the screen or a stated floor, with its derivation
- **Why:** "so a family re-derives instead of copying" (v2 §1.4, locked 5 Nov); lesson R2
- **Scope:** House
- **Pattern / part:** P11 / -
- **Checked by:** gap: a values lint (each row derived, each token real)
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** the values sheet · **Source rows:** SH-185, CHAI-66

## F3 State and redraws

#### STD-F3-01 · Each moving thing has one owner that finishes its motion; no other redraw touches it or reveals what follows
- **Why:** "smoothly minimize ... rather than ... snapping" (Zafar, 1 Nov); lesson R3
- **Scope:** House
- **Pattern / part:** P4 / order card, Nani's box, pop-out
- **Checked by:** contract-72 + contract-80 + probe:SH-180 + probe:SH-203 + gap: a frame-film reversal check for every motion
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/order-card.js` · **Source rows:** SH-180, SH-215, SH-203, SH-201, SH-196, SH-163

#### STD-F3-02 · A light, lesson or flight finds its target again after a redraw, never acting on a thing gone from the page
- **Why:** "I didn't get an onboarding for the blurred word" (Zafar, 7 Nov)
- **Scope:** House
- **Pattern / part:** P4 / the light
- **Checked by:** probe:CHAI-102 + probe:SH-197 + tool:teachgate + gap: the lesson-survives-a-tap check (Sprint 17)
- **See it:** labs.html, New player; chai L2 (1280x665)
- **Status:** agreed 7 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Source rows:** CHAI-102, SH-197, led:1.6-18

#### STD-F3-03 · A round's reads of progress are frozen at its start and thawed at the end screen; writes save at once
- **Why:** "word, ladder, effects should only take place after the game has ended" (Zafar, 4 Nov)
- **Scope:** House
- **Pattern / part:** P5 / the support steps
- **Checked by:** probe:SH-195 + gap: a static rule that every ladder read goes through `Cook.core.progress`
- **See it:** lab.html?mode=cook&game=chai-tray&level=3, Play again (1280x665)
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/core/progress.js` · **Source rows:** SH-207, SH-195

#### STD-F3-04 · A list that scrolls by design is marked so; fit engines and checks leave it alone, and code alone places it, never snapping
- **Why:** "two competing instructions" (Zafar, 5 Nov)
- **Scope:** House
- **Pattern / part:** P6 / the frame, item row
- **Checked by:** tool:panelcheck + contract-72 + gap: a panel-steady check as a card opens; a CSS rule failing scroll-snap in a scroller
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/frame.js` (data-njg-scroller) · **Source rows:** SH-210, SH-211, SH-199, SH-206, led:1.11-3

#### STD-F3-05 · The next thing to do is published once; the light, hint, helper card and test hooks all read it
- **Why:** "the hint prompt from Nani should always be the next item" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P12 / help ladder
- **Checked by:** contract-79 + contract-89 + contract-91 + probe:SH-182
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, idle (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Lives in:** chai 2125-2190 (want, plan); `js/cook/coach.js` · **Source rows:** SH-182, SH-205, CHAI-83

#### STD-F3-06 · Leaving a game stops every timer, light and clock it started
- **Why:** a step left midway kept a clock (ledger 1.11)
- **Scope:** House
- **Pattern / part:** P4 / the light
- **Checked by:** tool:test_cook_mount
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/life.js`, `js/shared/onboard.js` · **Source rows:** led:1.11-6

## F4 Devices and loading

#### STD-F4-01 · A tap area is at least 48 px on screen however small its drawn picture
- **Why:** "The speaker button for the water is massive" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P11 / buttons
- **Checked by:** tool:layout tap-small + contract-73
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Value:** the 48 px tap · **Source rows:** SH-185, CHAI-43

#### STD-F4-02 · A page opened or reloaded starts on one play button, so a phone plays sound from the first line
- **Why:** "orders give no sound at all" (Zafar, 3 Nov); lesson R6
- **Scope:** House
- **Pattern / part:** - / the play button
- **Checked by:** tool:tapgate + probe:SH-198
- **See it:** chai L1 on a phone, reloaded (930x430)
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/buttons.js` · **Source rows:** SH-198

#### STD-F4-03 · A game asks at once for only its own files, at drawn size, and decodes every person's lines as the order starts
- **Why:** "the first item ... didn't have a sound" (Zafar, 3 Nov); decision 68
- **Scope:** House
- **Pattern / part:** P13 / -
- **Checked by:** check:load + tool:loadtime + probe:SH-175 + probe:SH-201
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (1280x665)
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/lang.js` (Lang.warm) · **Source rows:** SH-175, SH-201

#### STD-F4-04 · The next game loads behind the current one, so there is never a wait between games
- **Why:** "make sure every next game loads in the background" (Zafar, 5 Nov)
- **Scope:** House
- **Pattern / part:** P13 / -
- **Checked by:** tool:loadtime + gap: loadtime.mjs failing a wait over 300 ms between stages
- **See it:** labs.html, a story day (1280x665)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/flow.js` (Cook.prefetchDishes) · **Source rows:** SH-212

#### STD-F4-05 · Nothing is seen half-built: a screen is final from its first frame, or covered while it loads
- **Why:** "the kitchen background still loads and is visible first" (Zafar, 5 Nov)
- **Scope:** House
- **Pattern / part:** P13 / Nani's box, the word moment
- **Checked by:** contract-80 + probe:SH-174 + judge: chai L4's first frames, New player, 1280x665
- **See it:** labs.html, New player; chai L4 (1280x665)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/guide.js`, ui 92-165 · **Source rows:** CHAI-85, SH-174

#### STD-F4-06 · A picture's load is capped in real time and retried on failure, so the game never draws without it
- **Why:** "the burner still showing ... a small black dot" (Zafar, 6 Nov, a phone dropping requests)
- **Scope:** House
- **Pattern / part:** P13 / -
- **Checked by:** check:static/loadcap + gap: loadtime.mjs with dropped requests
- **See it:** chai L4 on a phone (930x430)
- **Status:** agreed 6 Nov
- **Layer:** kitchen kit · **Lives in:** lib 742-777 · **Source rows:** CHAI-91, CHAI-25

## F5 Test hooks

#### STD-F5-01 · Every state a rule names is reachable from labs.html in a minute, never by replaying the ladder
- **Why:** "I just have to keep playing the game again and again" (Zafar, 5 Nov); lesson R9
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** gap: a docs guard that every rule's See it link opens (R9)
- **See it:** labs.html, New player and Words known; chai L3 (1280x665)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/flow.js` (wordsKnown) · **Source rows:** SH-216

#### STD-F5-02 · A game reports its state, lights and lessons through read-only hooks and Lifecycle notes
- **Why:** "a mode you can turn on that records what happens" (Zafar, 5 Nov night)
- **Scope:** House
- **Pattern / part:** - / the light
- **Checked by:** contract-83 + contract-90 + tool:faces + tool:lightfollow
- **See it:** labs.html, Record a play; any game, Save log
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** chai 769-792, `js/shared/recorder.js` · **Source rows:** led:1.11-4

#### STD-F5-03 · Every kit piece, effect and sound can be seen and heard alone, in every state, on a lab page
- **Why:** "in one place on one page in isolation" (Zafar, 6 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:labcheck + tool:kitsheet + tool:voicegate + gap: a lab-coverage check over `data/kit-elements.json`
- **See it:** lab/kit.html, lab/juice.html (1280x665)
- **Status:** agreed 6 Nov
- **Layer:** shared kit · **Source rows:** CHAI-92
