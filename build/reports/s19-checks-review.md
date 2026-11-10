# The checks, reviewed (10 Nov)

Asked by Zafar after eggs passed the automatic run (0 breaks) and failed the eye judge beside chai (10 fails). Read-only: no code or doc changed, no browser run. Flaws first.

## Summary

1. **Eggs' bad lights come from one old piece of code, and it is not the shared light.** Cook's first overlay from September (a round hole with its own dim) is still in `js/cook/coach.js` and switches on for any game with no coach script. It draws over the shared light. That is the circle on the carton, the second ring that travels to the knob, the pill half hidden and the darker dim.
2. **No check can see it.** All 14 light checks read a note the shared light writes about itself. Anything drawn by other code is invisible to them. The lint did find the old dim; it sits on the "known" list.
3. **It has been seen three times and blamed on the wrong code each time** (your 8 Nov eggs note, Fable on 8 Nov, the eye judge today). Each time a check was built or loosened for the wrong cause.
4. **Why the checks miss what you see:** they measure stand-ins (the code's own notes), not the picture; games opt in to checks; games tell the check what to measure; old findings pass as "known".
5. **Your 20-30 things:** about 22 recur. Sound, timing, written English, buttons and the leak test are checked well. The things you see (the light, the dim, sizes, padding, snaps, the scene) are checked weakly or not at all.
6. **Other games:** about a third of the 93 rules are tied to Cook. The rest read shared pieces and will carry over, but only if they measure the screen. The farm prototypes have no robot play at all, and each has its own copy of a kit file.
7. **Worth continuing: yes, but not by adding rules.** Six changes, most small: delete the old overlay, one check that reads the lit picture itself, no silent passes, the real failing run as the test, the eye judge beside chai at every game merge, two tool fixes.

## 1. The highlight deep dive

### What draws each thing in eggs

| What the eye judge saw | What draws it | Shared light? |
|---|---|---|
| Filled circle round the carton, pill half hidden | The old overlay: `#coach .co-hole` (`js/cook/dom.js:85`, `css/cook.css:689-695`), placed by `draw()` in `js/cook/coach.js:1123-1136` | No. Cook's own, from September |
| Gold box inside it, round carton and pill | The shared light: `Onboard.light` (`js/shared/onboard.js:1919`), called by `Cook.Coach.control` (`js/cook/coach.js:713`) | Yes |
| Gold glow hugging the carton | Cook's item glow: `S.glow` (`js/cook/stations.js:535-600`), called by eggs (`js/cook/stations/eggs.js:498-510`) | No. Cook's own, by design (chai's bottle glows the same way) |
| Second ring that travels to the knob, then into the pan | The old overlay again. It follows the game's "next tap" point and glides there in 0.35 s (`css/cook.css:693`) | No |
| Ring on the pan's rim | The shared light with its `round` option (`js/shared/onboard.js:938-942`), asked for by `Cook.Coach.nextLight` (`js/cook/coach.js:778`, round unless told otherwise) | Yes. Your 2 Nov pick for chai's next pan (CHAI-68) |
| Dim much darker than chai's | Two dims at once: the shared light's 0.45 plus the old overlay's 0.55 (`css/cook.css:692`). About 75% dark against chai's 45% | Half |
| Light "cut by the frame" | Two things. The shared box stops 1 px inside the screen by rule (`js/shared/onboard.js:945-956`); chai's box does the same. The pill looks cut because the old circle's dim covers its lower half | Rule, plus the old overlay |
| Plate lit while the egg flies | The shared box fades for 0.3 s after the tap (`js/shared/onboard.js:1889`), and the old ring sits on the plate until the next step | Half |
| Box round the whole tray | The shared light, on eggs' last step (tap the tray). The rule has no size limit | Yes |

### How I know it is the old overlay

- Its size matches the code exactly: radius `max(46, 116 x scale)` (`js/cook/coach.js:76-78`). That gives 135 px at 1280x665 and 92 px at 740x320. Both match the pictures.
- It shows for four steps and then stops (`data/cook.json:6308` `coachSteps: 4`). In the 740x320 strip the ring is on the carton, pan, egg and plate, and gone at the tray.
- The robot's log has one box at the carton (`[620,528,715,664]`), a plain rectangle. The film frames show a rectangle and a circle together (`build/screenshots/sandbox/sbs-eggs-L1-20261110-1554/keyframes/cook-eggs-speed1@1280x665/strip-01-rung/f08_p285.jpg` onward; `strip-02-rung/f10_p447.jpg` for the ring at the knob).

### How eggs came to show it

1. Every Cook game starts through `St.begin`, which starts the coach for a new player (`js/cook/station-lib.js:548`).
2. `C.start` looks for the game's script in `data/cook.json` (`"onboard"`, line 6365). With a script it uses the shared light. With none it falls back to the old overlay (`js/cook/coach.js:1026-1029`, `:1081-1087`).
3. Chai is safe: its script marks every step, so `C.start` leaves it alone (`js/cook/coach.js:1024`, `:943-946`).
4. Eggs, corn and baking have **no script**. They call the shared light themselves (`Coach.control`, `nextLight`, `stuck`), and the old overlay runs on top.
5. Eggs has reached `St.begin` since at least 7 Nov (through `js/cook/zone.js:538`, then directly from commit `a53828605`, 8 Nov 22:29, `js/cook/stations/eggs.js:176`). The comment eight lines below still says "eggs runs its own stage, never St.begin" (`eggs.js:184`).

So: eggs did not bypass the shared light and did not call it wrongly. A second, older path in Cook's own code draws as well. The git history here starts on 7 Nov, so I cannot date the overlay itself; its comments say Wave 6, September.

### It was seen before, and blamed on the wrong code

| When | What was seen | Blamed on | What was done |
|---|---|---|---|
| 8 Nov, you (P37, CK-63) | "the circle ... half on the handle ... way too small and it's off-centered"; "cuts off the word pill" | The shared light's `round` box on the pan's picture | The game now names its own "lit body" (`litBounds`), and the check was changed to trust it (commit `1f8c50a39`) |
| 8 Nov, Fable (`build/reports/s18-fable-what-went-wrong.md:18`, `:79-81`) | Baking: "a round glow over the kit's box clips the pill" | `S.glow`, "the old round halo" | contract-102 built to catch a game's own glow |
| 10 Nov, eye judge (SH-249, SH-250) | Circle plus box, two rings, darker dim | "shared: fixed once in the kit" | Not yet fixed |

`S.glow` follows the picture's outline; it cannot draw a circle round a carton. A shared `round` box on the pan's whole picture would be bigger than the pan, not "way too small". The old overlay fits all three sightings. I am sure for eggs today. For 8 Nov it is very likely, not proven (no film from that day).

**SH-249 and SH-250 as written will not fix it.** SH-250's planned check is "the dim's alpha read in every kitchen game" (`docs/process/regressions.md:540`). The shared dim's alpha is 0.45 in eggs too. That check would pass.

### What the light checks measure, and why each passed

There are 14 checks about the light or the finger (contract-8, 44, 53, 78, 79, 82, 84, 87, 90, 92, 97, 102, 105, 106). All passed.

- **13 of 14 read one note.** The shared light writes its box as `data-holes` on its own layer (`js/shared/onboard.js:978`): x, y, width, height. The probes read that note (`build/sandbox/lib/contract-hook.mjs:808-814`, `contract-hook-s14.mjs:163-165`, `contract-s19.mjs:551-554`). The note has no shape, so a circle reads as its square. Anything not drawn by the shared light is not in it.
- **One light at a time** (contract-87, contract-8): counts shared layers and Cook item glows. The old overlay is neither.
- **Room round the thing, whole and centred** (contract-92, contract-105): compare the note's box with the game's pictures. The box was fine. Both excuse a box at the screen's edge (`contract-s19.mjs:208-218`).
- **No game's own glow or finger** (contract-102): looks for a ghost finger and for glowing pictures outside a box. A dim with a hole is neither.
- **The light is clear against the dim** (contract-84): the one pixel check. It only asks if the inside got brighter. It also logged the outside: 78.8 for eggs against 131.4 for chai at 1280x665, 76.1 against 111.7 at 740x320. Nothing judges that number (`build/sandbox/lib/lightpix.mjs:45-47`).
- **The lint found the old dim.** Its line is entry 445 of the allow-list `build/lint/static-known.json`.
- **The eye judge was told not to ask.** "Two lights at once" is listed as "asked in code now" (`docs/process/eye-judge-rubric.md:99-103`). It caught it anyway under other questions.

### How to stop it happening again

1. Delete the old overlay: the fallback in `C.start` and `draw()`, `#coach` in `dom.js`, its CSS, its allow-list entry. A game with no script gets no overlay.
2. One lint rule: only `js/shared/onboard.js` and `css/shared/onboard.css` may dim the screen or draw a gold edge.
3. The check in section 5 (change 2), which reads the screen, so it does not matter who draws.
4. Decide the pan's ring (decision 1 at the end): the `round` option is the one way a game can still ask the shared light for a non-rectangle.

## 2. Why the checks miss what you see

1. **They measure a stand-in, not the picture.** 92 of 93 contract checks read the page's code or the game's own log. One reads pixels, and only brightness. The same pattern outside the light: "Nani calls each step" passed eggs because eggs declares one step for the whole game, so one "Hane indo!" covers it.
2. **The game tells the check what to measure.** `litBounds` feeds both the light and its check (`build/sandbox/lib/contract-s19.mjs:572-573`), added at a game builder's request.
3. **Games opt in.** A field left out of `build/sandbox/data/games.json` "passes it by" (line 2). Chai fills all 8 check fields; eggs fills 1 (line 77). So 7 checks showed "0 breaks" for eggs without judging it, and the report does not say so.
4. **Checks are loosened until they pass.** contract-105 was written on 8 Nov and loosened at least 6 times in two days (hop room, shadows, the game's own bounds, whole-screen lights, face badges, "shade"). Each was a real false alarm; nobody then checked it still caught the real thing.
5. **Known findings pass.** 805 entries in the lint's known list; 5,530 layout findings known (`docs/process/qa-checklist.md:32`). This run found "fried egg" at 12 px and a small tap area; both passed as known.
6. **Half the fix list has no automatic check.** Of 1,033 rows, 472 name an automatic check and 524 an eye check.
7. **Tests use made-up examples.** Each check has a hand-made failing case. None is tested against a real bad run.
8. **The wrong cause gets fixed** (section 1), so the next check is aimed at the wrong code.

The 8 Nov audit judged 177 checks and kept 160 (`docs/process/check-audit.md`). It asked "does it run, has it caught something". It did not ask "what can this check not see".

## 3. The things you check

Counts are from a keyword pass over the 1,033 fix-list rows that quote you. They are rough and err low. "Days" is separate feedback days.

| What you check | Rows, days | Check today | Catches it? |
|---|---|---|---|
| The highlight box: shape, what it takes in, padding | 16, 11 | contract-53, 82, 92, 105 | **Partly.** Reads the shared light's own number; no shape; blind to other code |
| One light at a time | 5, 5 | contract-8, 87 | **Partly.** Counts shared layers only |
| The dim: too early, stays, too dark, missing | 5, 4 | "dark with no box" only | **No** for strength. The number is logged, not judged |
| The light's timing (with the call, after things stop, gone on the move) | 5, 3 | contract-78, 79, 106 | **Partly.** 78 judges chai only |
| Same as chai: the shared pieces used | 30, 12 | contract-34, 40, 41, 44, 100-102, kit lint | **Partly.** Proves the shared piece is called, not that nothing else draws too |
| Padding and spacing in cards | 31, 15 | labcheck on lab pages, contract-100 | **Partly.** Not in the game; eye Q12 failed eggs |
| Overlaps (a face, a neighbour, the panel) | 27, 10 | contract-81, 82, 83, 86 | **Partly.** Named pairs only |
| Item size and proportion | 25, 12 | none on screen | **No.** Eye Q24 failed eggs |
| Things that snap, jerk or flash | 30, 14 | contract-80 (the kitchen), single probes | **No** in general. Eye Q41 failed eggs |
| Text cut or ellipsised | 17, 9 | screen lint, contract-15, 51 | **Yes** for new ones; old ones pass as known |
| Text too small | 5, 4 | screen lint | **Partly.** Known list |
| The word pill: cut, size, place | 7, 7 | pillcheck, contract-109, 111 | **Partly.** Missed eggs' half-hidden pill |
| Lined up (shelf line, knob place, centred) | 11, 10 | contract-105, 109, 110 | **Yes** so far (two days old) |
| Order card: ticks, scroll, fold | 21, 10 | contract-18, 99, 108 | **Partly** |
| Nani names each step | 10, 5 | contract-36 | **No.** Trusts the game's own list of steps |
| The scene fills the play area, no strips | 3, 2 | contract-11 (stretch, sharpness) | **No.** CK-75 passed |
| Art: style, code-drawn, shadows | 24, 14 | art judge when art lands | Eye only, rightly |
| Pace: too quick, too slow | 18, 6 | single probes, mostly chai | **Partly** |
| Voice: over each other, twice, cut off | 30, 12 | contract-3, 7, 22, 95 | **Yes.** Reads the real sound log |
| Help too early or never | 4, 2 | contract-24, 91 | **Yes.** Reads the real clock |
| Buttons: no tick, next or X; the arrow | 8, 5 | contract-12, 34, 103 | **Yes** (Cook) |
| Written English for the child | 10, 2 | contract-16, 39, 46, word lint | **Yes** |
| Winning without Kutchi | 6, 3 | the leak bots | **Yes** |
| Pictures blank, late or wrong | 4, 3 | contract-104, loadcheck | **Yes** |
| A tap picks the wrong thing | 6, 5 | contract-21, 111 | **Yes** so far |
| First-time lessons shown once | 9, 5 | contract-90 (chai only), 98 | **Partly** |

The pattern: where the check reads the real thing (the sound, the clock, the words on the page) it works. Where it reads the code's account of a picture, it does not.

## 4. Do the checks carry over to other games?

**General today** (read shared pieces, any mode that uses them): voice, written English, buttons, text cut or small, the order card and item cards, Nani's box, face circles, the leak bots, loading. About 21 of the 93 rules name no mode at all; 11 already name the clinic.

**Tied to Cook:** about 32 rules by their wording (24 open with "Cook flows"). They rely on:
- Cook's picture conventions (a word id, a pill, a glow, texture names) read from Cook's canvas (`contract-s19.mjs:559-590`).
- Cook's own log and test hooks (`njgTest.cook.*`, 10 uses in the probes).
- The per-game list, which holds kitchen games only.
- The robot player: `build/sandbox/lib/cook-player.mjs` (835 lines) plays Cook. The clinic has its own (557 lines).

**Where the robot plays today:** about 250 Cook flows, 94 clinic, about 12 for everything else. The farm prototypes have none.

**The light in other modes:** the clinic and the farm call the shared light, so the box is the same code. But the "thing" side of the light checks walks Cook's canvas. On the farm's HTML screens it finds nothing, and the check passes with nothing judged.

**The same mistake is already set up there.** Ten prototype folders each hold their own `kit.js` copy that wraps the shared light (`js/farm/kit.js` and nine `*-proto/kit.js`; SH-197 calls them "each area's copy"). And the item's glow and hop live in Cook (`js/cook/stations.js`), not in `js/shared`, so each new mode will write its own.

**What makes them general:**
1. Judge the light from the screen (section 5, change 2). Pixels are the same in every mode.
2. The shared light reports what it was asked to light (the thing, its pill, its face, the neighbours), so one padding check works on a canvas or an HTML screen with no per-game code.
3. Every game on the shared host, which already publishes "what to tap next" (`js/shared/host.js:48`), so one robot can play a new mode from a short path file.
4. One shared kit file for the trips, not ten copies; the item's glow and hop moved into `js/shared`.

So: not built only for cooking, and not to be thrown away. The sound, text, card and button checks carry over as they are. The visual ones need the change in kind above, or they will be rebuilt per mode.

## 5. Is it worth continuing?

**Yes.** But stop adding rules of the same kind. There are 93, and the 14 about the light all passed today. The answer is fewer, plainer checks that look at the screen, and the eye judge as a standing partner. Ranked by value:

| # | Change | Size | What it buys |
|---|---|---|---|
| 1 | Delete the old Cook overlay; lint rule that only the shared light may dim or draw a gold edge | Small | Fixes the circle, the travelling ring, the dark dim and the hidden pill in eggs, corn and baking at once |
| 2 | **One light-picture check, every game, every light.** From the screen: the frame just before the light, and the frame with it. Find what was not darkened. It must be one shape; a rounded rectangle (a circle fails); whole inside the frame unless its thing is at the edge; the dim as strong as chai's. Then your sizing rule: the shape takes in the item, its pill and its face, with the set padding, less only where a neighbour is close | Medium. The with-and-without pictures and the before frames are already taken (`lightpix.mjs`, the film buffer) | Your highlight rule, as a child would judge it. Works in any mode. Would have failed eggs today on four counts |
| 3 | No silent passes: the report says "judged 86 of 93" per game and lists what was not judged; a game missing from the per-game list is named, not passed | Small | "0 breaks" stops meaning "not looked at" |
| 4 | Real bad runs as the test: today's eggs run is the first. A light check counts as built only when it goes red on it. A check may be loosened only if it still goes red on its bad runs | Small to medium | Ends tuning a check until it passes |
| 5 | The eye judge beside chai as a standing step: level 1, new player, two sizes, whenever a game's screen changes, before the merge | Small (the tool exists) | Catches what no rule was written for |
| 6 | Tool fixes: the "light" keyframe is taken while the pixel check has hidden the shared light (`keyframes.mjs:146` against `lightpix.mjs:67`), so the judge's eggs picture showed no box; the side-by-side tool misses mid-cook and serve (SH-251) | Small | The judge sees the true screen |
| 7 | Later, with the first trip: the shared light reports its targets, one trip kit, the glow moved to shared (section 4) | Medium | The checks work on the farm and the clinic without a rewrite |

**How the two split the work**
- **Machines:** anything flagged twice that is a yes or no on the screen, the sound log or the clock. The light's shape, count, padding and dim; text cut or small; overlaps; voices; timing; English; buttons.
- **The eye judge:** how it looks beside chai. Proportion, art, crowding, whether it feels finished, anything new.
- **The handover rule:** a question leaves the eye judge's list only after its check has gone red on a real bad run. "Two lights at once" goes back on the list today.
- Every eye-judge fail gets its true cause traced in code before a row or a check is written. Three wrong causes is how we got here.

## Decisions for you

1. **The pan's ring.** On 2 Nov you chose a circle on the pan's rim (CHAI-68). Today you said every highlight is a rounded rectangle. Recommend: rectangle everywhere, the pan included, and the `round` option removed.
2. **The eye judge at every game merge.** On 9 Nov you said the merge rule should wait for later stages. Recommend: yes now, but only level 1 at two sizes, and only when that game's screen changed.
3. **Delete the old overlay now** (change 1), as a fast-lane fix before tonight's run. Recommend: yes.
4. **Build change 2 next, before any more rules.** Recommend: yes.
5. **Rewrite SH-249 and SH-250** with the true cause (the old overlay), so the fix is not aimed at the shared light. Recommend: yes.

## What I did not do

- No browser run. The findings come from the code, the saved run and its film frames.
- I did not check corn and baking on film; they are exposed by the code (no script, and they start through `St.begin`).
- The theme counts in section 3 are a keyword pass, not a hand count.
- I did not record a cost for the eye-judge run; the write-up does not give one.

## Proof
- The eggs run that passed with 0 breaks: build/screenshots/sandbox/sbs-eggs-L1-20261110-1554/ (contract.md, keyframes).
- The eye verdict it is set against: build/screenshots/sidebyside/eggs-L1-20261110-1554/judge-batch.verdicts.md.
- Checked again by the orchestrator in code: `js/cook/coach.js:1026-1029` (no script, no kit: the old `#coach` overlay), `data/cook.json` "onboard" has no eggs, corn or baking entry, `js/cook/dom.js:85` and `css/cook.css:690` (the round hole).
- The four games judged the same evening, all 0 contract breaks, all SHIP no: chop, corn, daar, maani-line (build/screenshots/sidebyside/<game>-L1-20261110-17xx/judge-batch.verdicts.md).
