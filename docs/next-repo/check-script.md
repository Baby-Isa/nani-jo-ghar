# The check script: one run before Zafar plays

Draft for the new repository (16 Nov 2026, revised 17 Nov). One command, one game: `check <game>`.

- It runs top to bottom and ticks each step off as it passes.
- It stops at the first hard fail and says what failed, in which file or picture, in one plain line.
- The whole run takes 5 minutes or less. Steps 1 to 4 need no browser and take under a minute together.
- It checks the game being sent to Zafar, plus the engine and shared kit it stands on. It never plays the other games.

## The steps

| # | Step | What it proves | How it works | Budget | If it fails | The earlier problem it prevents |
|---|---|---|---|---|---|---|
| 1 | **Code structure** | The code keeps the ten coding rules of the architecture page. | Reads the files, no browser. File sizes within the limits. Shared code names no game. A game file never measures the screen, starts or ends a scene, or loads a file by path. No fix-list references in comments. | 5 s | Hard fail | Chai at 2,461 lines; the flow file naming games on 33 lines; "moved to the frame" while each game still ran its own round. |
| 2 | **Art** | Every picture the game shows is called by its id from the art list, and is approved or a known stand-in. | Reads the game's settings and code against the art list, no browser. Warns when an approved piece for this game is used nowhere, and lists the stand-ins. | 5 s | Hard fail: a file path, or an id not on the list. Warning: unused approved art, stand-ins. | Samosa's approved round sheet sitting unused; games loading pictures by file path; old art that nobody flagged. |
| 3 | **Words and grammar** | Every line the child hears or sees is built by the language engine, and the game says what its sheet's "teaches" box says. | No browser. Asks the engine for every sentence the game can say at every level. No Kutchi typed in game code. The words and patterns really used match the sheet, role by role. Each word has a family recording, or is flagged. | 15 s | Hard fail: typed Kutchi, a sentence the engine cannot build, a mismatch with the sheet. Warning: a word with no recording yet (hard fail in a store build). | Invented or stitched Kutchi; a plan that says a game teaches a word it never says; missing recordings found late. |
| 4 | **Game rules, by robot** | The game's rules are right at every level, for every order and person. | No browser. A robot plays the rules alone, thousands of rounds in seconds: taps early, on time and late; right and wrong picks; every order. It checks nothing is taken or turned before the green, every order can be served, a served dish leaves its pot, and a primary word cannot be won by guessing (the leak test). | 30 s | Hard fail | Maani turned before the green; daar's pot staying full; baking asking for one naan and serving two; winning without the Kutchi. |
| 5 | **What can be measured on screen** | A short fixed list of yes-or-no facts holds on screen. It is not the standard: the standard is rebuilt chai, and likeness to chai is judged by eye, not here. | A browser, the game frozen at six set moments, at phone size (740x320) and laptop size (1280x665). Measured from the pixels and positions, the same list for every game: a visible shadow under every object, each face where its tray or shelf puts it, nothing covered, cut off or overlapping, nothing empty, taps big enough. The list grows only by the rule below. | 90 s | Hard fail | Maani with no visible shadows while a check passed; sekelo's card covering the item at phone size; plates off-centre. |
| 6 | **One full play** | The game plays from the order to "well done" without an error, and gives Zafar his pictures. | A browser plays level 1 to the end at both sizes, with no page errors and no stall. It saves six pictures: the order, the first light, mid-cook, the serve, the thank-you, the end. | 120 s | Hard fail: an error or a stall. | A game that does not open or gets stuck; Zafar being the first to see a broken screen. |

Total budget: 265 seconds. The spare 35 seconds are the only room to grow.

## What is not in it

These run every night and never block a build. The result is a short list in the morning.

- Levels 2 to 4 played in the browser, and the other two screen sizes.
- Every other game, to catch a shared change that hurt one of them.
- The by-eye judge: it plays the game beside rebuilt chai and ticks nothing. It lists the ten most obvious differences, worst first, says whether Zafar would sign it off, and uses the principles only to say why a difference matters.
- Load time and site size.
- The word counter's coverage report.

Full checks at every size run once, before a store build.

## The rule for adding a check

1. First ask whether the engine can make the bug impossible. If it can, change the engine and add no check.
2. A check is added only when the same kind of bug has reached Zafar twice, or when he could never see it by playing (Kutchi, voices, rare combinations).
3. It goes into one of the six steps. There is no seventh step.
4. The run stays within 5 minutes. A check that takes it over the budget replaces one, or runs nightly.
5. A check that is wrong about the game twice is removed or rewritten, not patched.

## What Zafar sees

```
check maani                                   16 Nov, 14:02
 1 Code structure        pass    3 s
 2 Art                   pass    2 s   2 stand-ins: plate, turner
 3 Words and grammar     pass   11 s   1 word not recorded yet: "and"
 4 Game rules (robot)    pass   24 s   4 levels, 12,000 rounds
 5 Measured on screen    pass   81 s   6 moments, 2 sizes
 6 Full play             pass  104 s   6 pictures saved
Ready to play: <link>                        3 min 45 s
```

And when it fails:

```
 4 Game rules (robot)    FAIL
   Level 2: the maani can be turned before the green (tawa, side one).
   Stopped. Steps 5 and 6 not run.
```
