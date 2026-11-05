# Feedback: Zafar's chai notes, 5 Nov 2026 morning play (L1-L4, laptop)

**Source:** docs/feedback/raw/chai-play-2026-11-05-am.md (typed in the chat, one picture: `docs/feedback/images-2026-11-05-am/1.webp`,
L1 on the white marble). 9 lines, 7 points, 1 line of chatter. Levels replayed in the sandbox: L2 New player through labs.html and
cook.html, at 1280x665 and 930x430 (the reveal lesson, 4 runs), the zoom-in light filmed slowed at 1280x665 and 740x320, a full L3
round (`build/screenshots/sandbox/s17-am-l3`, two people), the word moment's pour at the four sizes (before and after), Nani's box
folding measured frame by frame.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| The reveal lessons (the dotted word, the blurred picture), every game | a small box straight on the dots; the picture's lesson lit the eye button only | the whole item card lit first, then the box shrinks onto the hidden word, or onto the blurred picture itself (the kit's zoom-in light, `Onboard.ZOOM`) | P3 |
| The closing scene, every Cook lab round | only the card's asker (Nana) came back, even when he had not ordered | everyone who ordered comes back to their own spot; each says thank you and goodbye | P4 |
| The word moment | the kettle's spout 0.64 of a glass above the glass's middle | about a third of a glass higher where the screen has room (laptop, big screen) | P5 |
| Nani's box, every Cook game | shutting emptied her card at once, so the box jumped shut | her card stays while the box folds up over half a second, then goes | P6 |
| The word moment | its pour sound was asked for silently (`quiet`), so nothing was heard | a pour into a glass, its ring rising as the glass fills | P7 |
| The side panel and the shelf, every game | parchment #efe5d6 / #f4ecdf | to his choice (decisions below); nothing changed yet | P1 |

Nothing removed or replaced.

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| none | | |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:01 | "colour analysis and best practice ... what works well in kids games, educational games and mobile/tablet games and suggest a side a bottom panel colour and/or texture that better fits the whiter marble background ... use fable to judge ... options I can paste into claude in chrome for chatgpt" | side panel, shelf, every game | not code: `css/shared/tokens.css:15` the panels are warm parchment (#efe5d6) at the marble's own lightness (1.07:1), so they read as a yellow stain on the cool white marble | study `build/reports/s17-panel-colour-study.md` (six options mocked on the game); Fable's verdict `build/reports/s17-panel-colour-judge.md` (stone now, mock a wall-and-ledge and a mid oak, ChatGPT for a materials board and tiles, not repaints); decisions to him |
| P2 | 0:02 | "If i don't click to skip through the order for level two new player, the onboarding for the blurred english text does not show (or it just shows intermittently ...). But the onboarding for paani only started after a delay, as though it was waiting for the blurred onboarding to finish" | order card, every game | `js/cook/stations/chai-tray.js:2766` the lesson waits for the order card to be still (contract-79), about 3 s after the order, then runs about 4.5 s, a 36x24 px box on the dots; paani's light comes only after it. Not reproduced as "not shown": 4 runs (labs.html and cook.html, 1280x665 and 930x430, not skipping) lit it every time | the zoom-in light (P3) makes it impossible to miss; told before (SH-196): reopened, his own replay to say whether it still fails to show |
| P3 | 0:03-0:04 | "initially the whole item card is highlighted, and then it quickly zooms in, i.e. the highlighted box quickly shrinks just to the size of the highlighted box required ... also do that for the blurred image ... the highlighted area should shrink down just to the blurred image size ... make it a generalizable principle/rule" | the reveal lessons, every game | `js/cook/stations/chai-tray.js:2836` the light went straight to the dots' box; the picture's lesson lit the eye button (`box: undefined`) | built: `js/shared/onboard.js` a light given `zoomFrom` lights the whole thing for 0.65 s, then the box shrinks onto the part over 0.45 s (`Onboard.ZOOM`, the rule for every game); chai's two lessons use it, the picture's box is the blurred picture; filmed slowed at 1280x665 and 740x320: whole card, shrink, the dots, the tap shown |
| P4 | 0:05 | "in the wrap-up scene ... even though at level 3, 2 people gave me an order, only one of those people was present at the end to say thank you. If it's an easy, quick change, make it" | closing scene, every Cook game | `js/cook/flow.js:286` kitchenEnd brought back the card's asker only (`order.who`, always Nana in a lab round) | built: everyone who came in to order (`ctx.came`) is back at their own spot, each says thank you, then goodbye, then they go; L3 round in the sandbox: Nani, Nana and the second person at the counter |
| P5 | 0:06 | "yes move the tea kettle higher to give more spacing above the glass, otherwise its good" | word moment | `js/shared/word-moment.js:262` the spout 0.64 of a glass above the glass's middle | built: up to 0.9 of a glass, kept 10 px inside the stage's top; 1280x665 58 px higher (stream 222 to 280 px), 1920x1080 93 px higher; 740x320 and 930x430 were already at the top (no change: decision 3) |
| P6 | 0:07 | "When i use the arrow on the hint card to minimise the hint card, it snaps up instead of smoothly scrolling up - it should smoothly scroll up" | Nani's box, every Cook game | `js/cook/ui.js:968` shutting emptied her card at once, so the box fell to 0 in one frame though its CSS glides | built: the card stays while the box folds (0.5 s, an even curve in `css/shared/order-card.css`), then goes; measured: 70 px to 3 px over 0.58 s (was 70 to 0 at once) |
| P7 | 0:08 | "can we add a tea pouring sound to the word focus to make it more interesting as the tea is being poured?" | word moment | `js/shared/word-moment.js:323` the pour loop was asked for `quiet`, which makes no sound (`js/shared/sfx.js` loop: no audio context when quiet) | built: a new "pour-glass" sound (`js/shared/sfx.js`): a soft splash and a ring that rises as the glass fills, for each glass |
| — | 0:00 | "check the admiring-ptolomy branch for the latest" | — | not code: how to work | chatter: fetched; it held one commit past `main` (the publish log), now on this branch |

## 3. Regression rows (added to `docs/process/regressions.md`, 5 Nov)

| ID | Point | Status |
|---|---|---|
| ART-41 | P1 | waiting on Zafar |
| SH-196 (reopened, told before) | P2 | to fix: check |
| SH-213 | P3 | to fix: check |
| SH-214 | P4 | to fix: check |
| CHAI-86 | P5 | to fix: check |
| SH-215 | P6 | to fix: check |
| CHAI-87 | P7 | to fix: check |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:00 | chatter |
| 0:01 | P1 |
| 0:02 | P2 |
| 0:03 | P3 |
| 0:04 | P3 |
| 0:05 | P4 |
| 0:06 | P5 |
| 0:07 | P6 |
| 0:08 | P7 |

Lines: 9; in a point 8; chatter 1; unmapped 0. Second reader (Fable, the transcript and the rows only): see §6.

## 5. Why the told-before point slipped

- **SH-196:** last night's fix made the lesson every round for New player and measured the box's size, but nobody judged whether a 36x24 px box after a 3 s pause is noticeable; the checks counted it as shown.

## 6. The second reader

A fresh Fable agent read only his notes and the drafted rows. It found 5 missing and 5 weakened; all fixed in the rows:
- **Missing:** ART-41 lacked his "colour analysis and best practice ... kids games, educational games and mobile/tablet games";
  SH-196 lacked his method ("hard re-fresh and re-select of new player each time") and whether my runs matched it (they did: a
  cleared save, New player, never skipped); SH-213 lacked that he cannot reach the picture's lesson himself (decision 4); SH-214
  lacked his "if it's an easy, quick change" and the peripheries plan (now in `docs/ideas.md`); the branch check (chatter, done).
- **Weakened:** the paani delay was quoted but not treated (now: the part alone held 0.5 s, not 1.1 s; the check times paani's
  light after the lesson); "a generalizable principle/rule" had become two chai lessons (now: the rule in `chai-standard.md` §1.5
  and a check to build in `checks-to-build.md`); the kettle on phones (now decision 3, and the check covers every size once
  answered); ART-41's "and feedback" and "bottom panel" restored; SH-196's quote in full.

Both readers: 0 unmapped, 0 weakened left.
