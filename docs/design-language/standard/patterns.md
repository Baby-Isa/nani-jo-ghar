# Patterns: the fourteen reusable solutions

A pattern sits between a rule and a value: one way of solving a kind of problem, which many rules cite in their "Pattern / part"
field. The fourteen are Fable's (`build/reports/s17-standards-structure-review.md` §7.4), kept by Zafar on 5 Nov (v2 §3, his §8
answers). Each says what it solves, the live rules that cite it (read from every page of this folder on 7 Nov; retired rules left out)
and where its code is today. Line numbers are at 34641d3.

### P1 · Free-space placement
- **Solves:** a thing placed by case per screen lands on a face, a bubble, the gear or the panel at a size nobody shot (lesson R4).
- **The pattern:** take out the faces, bubbles, side panel, gear and replies; place one shape at one even scale into the free
  rectangle left; prefer L1's place.
- **Rules:** STD-E1-05, STD-E2-05, STD-E2-06
- **Source rows:** CHAI-43, SH-177, SH-187, CHAI-66, CHAI-86
- **Code:** `js/cook/ui.js:1972` (placeFree14, the pop-out); `js/shared/request-popup.js:452` (Lifecycle.bubble.place);
  `js/cook/stations/chai-tray.js:793-872` (the shelf row centred on the hob-and-tray span); `js/shared/word-moment.js` (its room)

### P2 · The first time once, then only the stuck hint
- **Solves:** a light shown at every pan, level or round teaches nothing new and slows the child (SH-181).
- **The pattern:** an action is shown the first time it comes up: a new player once a visit, a returning player once ever; after
  that, only the stuck hint after the level's wait.
- **Rules:** STD-D1-01, STD-D1-07, STD-D1-08, STD-D1-09, STD-D1-10, STD-D2-01, STD-D5-03, STD-G1-04
- **Source rows:** SH-181, CHAI-56, SH-196, CHAI-68
- **Code:** `js/shared/onboard.js:502` (Onboard.newPlayer); `js/cook/coach.js:45` (seen); `js/cook/stations/chai-tray.js:351`
  (first14) and `:3418-3422` (the first round spends it)

### P3 · Whole, then part
- **Solves:** a light on a small part (a hidden word, a blurred picture, a knob's mark) is missed: a 36x24 px box after a 3 s pause.
- **The pattern:** the whole thing is lit first, then the box shrinks onto the part (0.65 s, then 0.45 s).
- **Rules:** STD-D1-05, STD-G3-04
- **Source rows:** SH-213, SH-196
- **Code:** `js/shared/onboard.js:1358-1369` (Onboard.light with zoomFrom, Onboard.ZOOM)

### P4 · One owner per moving thing
- **Solves:** a second redraw throws away a glide, a fold or a light; two pieces of code fight over one scroll (lesson R3).
- **The pattern:** whoever starts a motion finishes it; nothing redraws the thing during it; what follows is revealed in the same
  redraw; leaving a game stops every clock it started.
- **Rules:** STD-B2-06, STD-D1-03, STD-D3-05, STD-D4-02, STD-E4-01, STD-E4-02, STD-F1-05, STD-F1-06, STD-F3-01, STD-F3-02,
  STD-F3-06, STD-G2-05
- **Source rows:** SH-180, SH-215, SH-203, SH-201, CHAI-102, SH-197
- **Code:** `js/shared/order-card.js:358` (glideTo) and `:695` (followFold); `js/shared/onboard.js:1353` (stopAll);
  `js/cook/life.js` (every timer Cook starts)

### P5 · A snapshot at the round's start
- **Solves:** the ladder moving mid-round blurred a card halfway through play (SH-207).
- **The pattern:** progress reads are frozen at a round's start and thawed at the end screen; writes save at once.
- **Rules:** STD-A2-03, STD-C2-09, STD-C3-05, STD-F3-03
- **Source rows:** SH-195, SH-207
- **Code:** `js/core/progress.js:301-310` (freeze, thaw); `js/cook/flow.js:439` and `:737`

### P6 · Declared scrollers
- **Solves:** a fit engine counts by-design scrolling as overflow and shrinks the panel; scroll snapping fights the code's glide.
- **The pattern:** a list that scrolls by design says so; fit engines and checks skip it; code places it with no snap; the current
  thing is whole in view.
- **Rules:** STD-E1-04, STD-F3-04
- **Source rows:** SH-169, SH-191, SH-194, SH-199, SH-206, SH-210, SH-211
- **Code:** `js/shared/frame.js:236` (fitSide skips data-njg-scroller); `js/cook/ui.js:211-213` (the mark) and `:1068` (followCard)

### P7 · Ticks when reached
- **Solves:** a count that waits for a stillness, or a tap past the amount, teaches the wrong moment (SH-38, CHAI-54).
- **The pattern:** a count or amount ticks the moment it is reached; an extra tap does not land.
- **Rules:** STD-B1-06, STD-B3-02, STD-B3-03, STD-D4-01
- **Source rows:** SH-38, CHAI-54, SH-182
- **Code:** `js/cook/ui.js:3489` (tickItem), `:3576` (tickCard), `:3593` (tickPiece)

### P8 · Said, then shown
- **Solves:** a card on screen before it is said gives the order away (SH-171).
- **The pattern:** nothing appears before it is said; each item's card pops out as it is said and flies to its row.
- **Rules:** STD-A1-02, STD-A3-01, STD-A3-02, STD-B1-01, STD-B1-03, STD-B1-04, STD-C1-02, STD-D1-06, STD-D3-03, STD-E4-04
- **Source rows:** SH-171, SH-150, SH-163
- **Code:** `js/cook/ui.js:1872-2403` (introduceAlong); contract-88 checks it

### P9 · Consequence in the thing, never a verdict
- **Solves:** a wrong move with no consequence teaches nothing; a verdict makes a child feel bad (non-negotiable 7).
- **The pattern:** too early, the thing refuses (a shake, "no"); too late, the thing itself fails and starts again; the child can
  undo until the step moves on.
- **Rules:** STD-01-07, STD-B2-04, STD-B2-08, STD-B2-09, STD-B2-10, STD-B4-05
- **Source rows:** CHAI-57, CHAI-58, CHAI-62
- **Code:** `js/cook/stations/chai-tray.js:1544` (knobTap), `:1597` (boilOver), `:1777-1859` (takeBack)

### P10 · Real pictures, not stand-ins
- **Solves:** a code-drawn pod, stream or splash reads as fake beside painted art (lesson R5).
- **The pattern:** every thing is a picture from an art run; code draws only a liquid or a tint inside a picture's outline.
- **Rules:** STD-01-08, STD-A3-04, STD-B2-11, STD-E2-04, STD-E3-01, STD-E3-02, STD-E3-04, STD-E3-05, STD-E4-03, STD-H1-01,
  STD-H1-04, STD-H1-05, STD-H1-06, STD-H1-09
- **Source rows:** CK-06, CHAI-64, ART-31, CHAI-79, CHAI-80
- **Code:** `js/cook/stations/chai-tray.js:53` (the pan's pictured stages); `js/shared/juice.js` (painted effects by name);
  `js/shared/word-moment.js` (the tea drawn inside one glass picture)

### P11 · Scale together to a floor, then keep the essential
- **Solves:** a region sized by width alone, or by fixed px, overflows on a phone or leaves a speaker too big (SH-185, CHAI-43).
- **The pattern:** a region's parts scale as one down to their floors; past that one stated essential governs (2.5 item cards in
  the panel); a tap area never under 48 px.
- **Rules:** STD-E1-01, STD-E1-02, STD-E2-02, STD-E2-03, STD-E2-07, STD-E6-02, STD-F2-04, STD-G1-06, STD-H1-08
- **Source rows:** SH-185, CHAI-43, SH-139
- **Code:** `js/shared/frame.js:95-126` (sideTokens, sideScales); `js/cook/kitchen-kit.js:78` (textFloor);
  `js/cook/stations/chai-tray.js:816-901` (the pill floor); `js/shared/fit.js` (shrink, then wrap)

### P12 · Every right move resets every clock
- **Solves:** a hint arrived while the child was busy pouring another pan (SH-184, SH-205).
- **The pattern:** any right action, a pour or a serve included, restarts every hint clock; one idle clock for every game.
- **Rules:** STD-D2-03, STD-F3-05, STD-G2-03
- **Source rows:** SH-184, SH-205
- **Code:** `js/cook/station-lib.js:989` (St.acted); `js/shared/onboard.js:1370-1384` (the shared idle clock); `js/cook/ui.js:795`
  (stepPoke)

### P13 · Load behind, never a wait
- **Solves:** a silent first word, the kitchen seen before the word moment, a wait between games (SH-201, CHAI-85, SH-212).
- **The pattern:** a game's files are asked for at once; the next thing loads behind the current one; a cover stands until ready.
- **Rules:** STD-F4-03, STD-F4-04, STD-F4-05, STD-F4-06, STD-H1-03
- **Source rows:** SH-175, SH-201, SH-212, CHAI-85, CHAI-91
- **Code:** `js/cook/flow.js:787` (prefetchDishes); `js/cook/lang.js:373` (Lang.warm); `js/cook/station-lib.js:742-777` (load,
  capLoad); `js/cook/ui.js:92-165` (the word moment's cover)

### P14 · The grown-up's door
- **Solves:** English in the child's path lets a child win by reading (non-negotiable 3, the leak test).
- **The pattern:** anything in English for a grown-up sits behind a tap: the "?" pop-up, the settings, the end-of-round review.
- **Rules:** STD-01-03, STD-A2-02, STD-A2-05, STD-D5-01, STD-D5-02
- **Code:** `js/cook/ui.js:1167-1239` (the "?" help); `js/shared/results.js` (the end review); `js/shared/buttons.js`
