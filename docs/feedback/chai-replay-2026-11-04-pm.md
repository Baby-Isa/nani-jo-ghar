# Feedback: Zafar's chai replay, 4 Nov 2026 evening (L1 and L2, laptop)

**Source:** docs/feedback/raw/chai-replay-2026-11-04-pm.md (his typed notes and two pictures: image 1 the word moment's glass and pour,
image 2 L1's order card scrolled back and pan 2 lit). 14 transcript lines, 7 points, 1 line of chatter. Levels played: L1 and L2
(his); the fixes replayed by the sandbox at L1 and L2, 1280x665 and 930x430, with a scroll logger (`NJG_INIT`, `build/sandbox/run.mjs`).

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Order card, every game (the order read out) | the said card is redrawn already folded with its transitions off; only an empty box eases shut | the card rolls up with its rows still drawn while its height eases shut | P1 |
| Order row (s14, chai) | the last tick snaps the row to a card's edge (on a short row: its start), cutting the last card; a served card folds 0.7 s after | the last tick keeps the row at its very end; once served: the ticks held, the row glides home, then the fold | P4 |
| Chai, the next pan's stuck hint | lit after the level's wait while pan 1 heats | only once no other pan is on the heat or waiting to pour (the pick itself still allowed) | P6 |
| The dots lesson (s14) | once per visit (the save's mark), so a second round never had it | with New player: every round's first dotted word, once | P7 |

Nothing removed or replaced: each is his own ask.

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| `glass-we-s17.webp`, `glass-wf-s17.webp` (pack s17-wm2) | re-cut in place: the counter strip right of the base removed | P2 |
| the tilted kettle (block 1) | kept; only its stream is replaced (pack s17-ps, new) | P3 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:00 | "when the second person gives their order, the first person's card it doesn't nicely scroll up and minimize. It just in an instant jerkily flashes back to the top order ... needs to be fixed for all game modes ... the open card needs to smoothly scroll back up" | order card, every game | `js/shared/order-card.js:728` a closed card is drawn folded with `still` (no transition), so at the pass (`js/cook/ui.js:2131` foldGlide) its rows vanish in one frame and only the empty box shrinks | built: the folding card keeps its rows drawn (`oc-folding`, `css/shared/order-card.css`) while its height eases shut, top kept still |
| P2 | 0:01 | "a bit of a weird shadow that stands out ... on both of the glasses. In the bottom right" | word moment | not code: the cut of pack s17-wm2 kept a strip of the counter (rows 870-895) right of the glass's base in both pictures | built: both pictures re-cut, the base mirrored from its left edge, the strip gone |
| P3 | 0:02 | "replace the chai pouring stream with ... a realistic image ... a static pouring image, that then fades out by ... a transparent layer from top to bottom" | word moment | `css/shared/word-moment.css:51` the stream is a striped code gradient (the block-1 stream picture is a wavy cartoon rope) | his idea kept: pack s17-ps, one real stream picture (paste block sent); wired on landing: grown down at the start, wiped from the top at the end, then the last drop |
| P4 | 0:03-0:05 | "when the final item is placed into the tea saucepan ... the item cards scroll back to the beginning ... the final item is cut off, while the order is still going on ... it needs to stay on the last item card, fully scroll to the right hand side, until the tea is served, everything is ticked, and then it can scroll back to the beginning and then minimize" | order row, every game on the s14 card | `js/shared/order-card.js:467` the last tick stopped the row on a card's edge at or before its end; a row only half a card longer than its view has no such edge but 0, so it went home and cut the last card (the second order had more cards, so it worked) | built: `js/shared/order-card.js:483` with nothing left, or only serve-time cards, the row goes to its end; `:521` once served the ticks hold 0.65 s, the row glides home, and the card folds at 1.5 s (`js/cook/ui.js` foldAfter) |
| P5 | 0:06-0:07 | "the menu cards on the left side seem to keep jumping up and down ... the drop-down button on the helper hint green box when the button was present ... caused that box to be larger in height ... That arrow shouldn't change the size of the box" | Nani's box, s14 | `css/shared/order-card.css:561` the arrow was display:none when away: its 48 px cell set the row's height (60 → 64 px at 1280x665) and its column narrowed her line (one line → two) | built: its column kept while away (hidden, not gone), the tools cell adds no height; measured: 48.9/48.9, 48.9/48.9, 61.6/61.6, 60/60 px with and without at the four sizes |
| P6 | 0:08-0:09 | "even though I had tea pan 1 selected, ... an onboarding light or random relic pops up and highlights saucepan 2 ... It should only onboard you to select the second tea pot after you've successfully poured the first pot of chai and it's been served" | chai, L2 | `js/cook/stations/chai-tray.js:1941` plan(): while pan 1 heats below the green, the next step is "pick pan 2", and its stuck hint (the rim light) came after the level's wait | built: `js/cook/stations/chai-tray.js:2147` no light for the next pan while another is on the heat or waiting to pour |
| P7 | 0:10-0:12 | "I couldn't consistently recreate the onboarding for the blurred word. Sometimes it would show ... sometimes it wouldn't ... always shows at the beginning when first time player is selected"; "the highlight box ... wrapped tight to the dots, but then the English word is bigger ... should be wrapped to the size of the English words, so it doesn't jump up in size" | dots lesson, every game | `js/cook/stations/chai-tray.js:2745` the lesson's mark was the save's, kept for the whole visit, so a second round never had it; the box hugged the dots, then the word | built: with New player, every round; `:2806` the hidden word's own text measured and joined to the box from the start. His "pause before the water bottle" not reproduced: it should go with the lesson showing every time |
| — | 0:13 | "rapidly fix it ... get it in front of me ... If you need new artwork ... prioritize doing that first" | — | not code: how to run it | chatter: art block sent first, fixes published for his look |

## 3. Regression rows (added to `docs/process/regressions.md`, 4 Nov)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-180 (reopened, told before) | P1 | to fix: check | auto: the order filmed at L2: the said card's rows on screen while its height eases shut | P1 |
| ART-39 | P2 | to fix: check | eye: both glasses' bases on the counter, no strip | P2 |
| CHAI-80 (reopened, told before) | P3 | waiting on art | eye: a filmstrip of the pour with pack s17-ps | P3 |
| SH-206 (reopened, told before) | P4 | to fix: check | auto: chai L1-L4 at the four sizes: the row at its end from the last item to the serve, then home, then the fold | P4 |
| SH-209 | P5 | to fix: check | auto: Nani's box the same height with and without the arrow, every s14 game, the four sizes | P5 |
| CHAI-83 | P6 | to fix: check | auto: chai L2-L4: no rim light on a pan while another heats or waits to pour | P6 |
| SH-196 (reopened, told before) | P7 | to fix: check | auto: New player, two rounds in one visit: the lesson in both; its box as wide as the English from its first frame | P7 |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:00 | P1 |
| 0:01 | P2 |
| 0:02 | P3 |
| 0:03 | P4 |
| 0:04 | P4 |
| 0:05 | P4 |
| 0:06 | P5 |
| 0:07 | P5 |
| 0:08 | P6 |
| 0:09 | P6 |
| 0:10 | P7 |
| 0:11 | P7 |
| 0:12 | P7 |
| 0:13 | chatter |

Lines: 14; in a point 13; chatter 1; unmapped 0. Second reader: not run (he asked for speed); due before the rows are judged.

## 5. Why the told-before points slipped

- **SH-180:** its fix eased the card's height but drew the card folded at once, so the rows still vanished in a frame.
- **SH-206:** fixed only for two or more serve-time cards left; the last tick with none left fell to the card-edge rule.
- **SH-196:** the lesson was checked once per visit; his replays were second rounds in the same launch.
- **CHAI-80:** a code-drawn stream was built instead of a picture; it reads as fake.
