# Lessons from chai (Sprint 14), for the builders who roll it out

Written by the orchestrator after the s14-chai build (28-29 Oct night) and its checks. Read this before touching a game.
Round 2 (the central rules on chai) adds its own section at the end.

## Round 1: the s14 cards, light and pour in chai (29 Oct night)

1. **A shared piece leaks its old behaviour from outside your game's file.** The finger came back from the shared conversation's
   reply pill (`js/shared/conversations.js`), which runs before chai's station, so chai's own "no finger" switch did not cover
   it. Turn a game's look on for its whole round (where the round starts: `UI.applyS14`), not inside one station.
2. **The checks encode old decisions.** Four contract checks and three unit tests still enforced rules Zafar had since replaced
   (one finger, three decoys, no English at L1, the 7/8/11/15 s waits). When a new rule meets a red check, read the check's
   source and the date of the rule it encodes; update the check to the newest decision in the same commit, and say so. Never
   loosen a check to pass something Zafar did not decide.
3. **Row texts age too.** The judge failed three rows on their older wording (a laptop column, no English on the helper card, a
   tilted pan). Before the judge, bring each row's text up to Zafar's newest words, citing the date.
4. **A tuning change moves timing elsewhere.** Quicker heating at L2+ made a second pan reach the green mid-pour, so Nani's
   "Slow kar" waited and came late (contract-70). After any speed change, rerun every level: a fix seen at one level is not a fix.
5. **Film it, don't trust a still.** The order row's long glide (to a "no" card at the end and back) and the pop-out card over
   Nana's face only showed when the order was filmed frame by frame at the phone size. Stills at the end of each state hid both.
6. **A big card needs its own picture.** The pop-out used a small thumbnail made later, so "hakro khun" showed an empty picture.
   Any word that can be said (half, full, numbers with an item) needs a picture source, or the card says so in the report.
7. **The to-record style must survive a new look.** The s14 font and colour tokens made Nani's grey italic "to record" line dark.
   Every new look keeps `.rec` grey italic (non-negotiable 2).
8. **Pinned controls take real space.** The cog pinned at the sidebar's foot covered the last card on a phone. Anything pinned
   needs the room reserved, or it moves (top right, Zafar 29 Oct).
9. **The judge's sizes are strict.** Its rows name sizes; shoot them. A probe that misses its moment is a probe fault (fix the
   probe), never a pass.
10. **Scripts and the sandbox:** `page.goto(..., {waitUntil: "load"})` outside the sandbox hangs on outside fonts; use the
    sandbox's `startServer`, `launch` and `newPage` (`build/sandbox/lib/env.mjs`), and never `await` `njgTest.cook.lab(...)`
    (it resolves only when the game ends).
11. **Art lands where Zafar puts it.** His upload went into the live `assets/` folder; sources belong in `sources/art/<pack>/`
    under their save-as names, cut by a spec into `assets/`.
12. **Layout of a sheet is not a grid.** A pan's handle crossed the cell line, so the grid cutter merged two pans: measure the gaps
    and cut by boxes. Measure every picture's rim into a meta file so the game places by it, never by eye.

## Proof
The runs these lessons come from: the contract runs `s14-chai-merged`, `s14-chai-merged2`, `s14-chai-merged3` and
`s14-chai-final` (`build/screenshots/sandbox/`), the judge's verdicts in
`build/screenshots/evidence/br-s14-chai-after-20261029-043226-bf9/judge/`, and the filmed order at 930x430 (29 Oct, sent to
Zafar in the chat).

## Round 2: the central rules on chai (s14-rules builder, 29 Oct evening)

What this build taught, for the builders who move the other games onto `data/rules.json`:

1. **Ask the reader, never the file.** Every rule is `window.Rules` (`js/shared/rules.js`): `Rules.level(lv)` (decoys,
   lookalike, noAsks, the card's Kutchi/English/picture, hintMs), `Rules.counts(game)`, `Rules.hold(Rules.wordState(rec))`,
   `Rules.pointMs()`, `Rules.firstTimeHold()`, `Rules.skips(el)`, `Rules.menu()`, `Rules.advance()`. `js/shared/tokens.js` loads
   it on every page that has the tokens, so no page needs a new script tag. `build/test_shared_rules.mjs` holds chai to "no copy";
   add your game to its last two tests.
2. **A station's own file loads late.** A `Cook.onLoad` hook in `chai-tray.js` never ran (stations load only when chosen), so L3
   and L4 played one cup and nothing failed. Data the rules fill in belongs in `js/cook/flow.js` (its `rulesCounts` hook fills any
   recipe slot `count: {"rules": "<game>"}`). Check the number of people on the timeline, not just that the round ended.
3. **The spoken order is the card's order, not the say list.** The engine builds each person's sentence from the rows it is
   given, in the card's slot order (`recipes.<dish>.card.slots`); reordering `say` changed nothing. "No" last is done where the
   rows go to the engine (`js/cook/ui.js` `_parts`, on `Rules.noLast()`). New word orders go to Mum (listed in `s14-rules.md`).
4. **Most of the "glide back" was the row going home.** At L3/L4 the long glide contract-72 failed on was the row's return to
   its first card after the order. It is logged apart now (`row-home`, smooth, any length); measure a motion by its phase.
5. **A moved number has readers outside the game.** `helpMs` was read by `build/sandbox/lib/evidence.mjs`, `contract.mjs` and
   `evidence.test.mjs` as well as the kit. Grep `build/` too before you move one.
6. **The play area's veil swallows taps.** The order's see-through pop-up covers `#stage` (z 110). The cog sits above it (z 120);
   speech bubbles let taps through (`pointer-events: none`), so the skip zones find a bubble by its rectangle. A game asks for the
   zones with `zones: true` on its request; the side panel is outside the veil already.
7. **Mode CSS may not name kit classes** (`static.mjs` kit). The cog's classes are Cook's (`.ck-cog-rail`); the rules' zones find
   it by `data-njg-zone`. Use the same attributes in your game.
8. **Pictures need a seeded save.** The ladder and the level-up have no driver that seeds a save, so their proof is unit tests
   plus text from a scripted page. A seeding driver for the evidence loop is the next tool to build.
9. **What surprised:** the timed hold is easy (cap the heat mid-green until the tap) but the sandbox's players tap at once, so
   only a script that leaves the knob alone shows it (10.9 s held, `s14-rules.md`).

What the central file needs next: (a) `noAsks` at L1 is still enforced in `js/cook/recipes.js` (CK-50, `lvl > 1`), so it is
not yet the file's; (b) `Cook.levelRow` (`station-lib.js`, the old `levelTable`) should read `Rules.level` at the roll-out, then
the table goes; (c) the cog's place into the shared frame's CSS once every game has it; (d) a per-game "most" for daar and the
clinic shapes (rulebook section 4); (e) the old word stages (`data/progress.json`): keep them for the clinic and the conversations
until their roll-out, then fold Cook's `chipWord` into the pill flag everywhere; the stages' card ladder (English, picture by word)
and the rules' card by level overlap, which needs Zafar's choice ("each word its own ladder", 27 Oct, vs the level table).

## Round 2, the orchestrator's check (29 Oct night)

1. **The evidence tool cannot film yet.** Its 4-frame strips (`strip:...:4x500`) "did not change" on four rows (the glide, the
   pop-out, the "no" order, the skip zones), so the judge never saw them; a scripted film with the sandbox's own server and
   browser did (`startServer`, `launch`, `newPage`), and showed the row never moving back and the card off every face.
   Fix the strip probe before the roll-out; until then, film the motion rows yourself.
2. **A probe's moment can be early.** The timed hold works (held mid-green until the tap at every level, the timeline's
   `timed-hold` notes), but the judge's still was taken before the pan reached the green: a FAIL from the probe, not the game.
   Read the timeline before acting on a verdict about timing.
3. **The before needs the new rows and probes.** Playing the before on `main`'s code needs the branch's evidence specs, the
   sandbox's libraries, drivers and flows, the fix list and `data/rules.json` copied in, or it refuses or mis-times.
4. **There is no hook for the faces' boxes.** A "never over a face" check by script needs the people's face boxes from the game
   (contract-76 has them inside the game); add a test hook so any script can ask.
5. **Every Cook game moved at once for the cog.** One shared change (the cog top right) was judged in three games and passed;
   the roll-out can move shared things this way, game-specific things one game at a time.
6. **Still open for the roll-out:** the help light too big in samosa, daar, the pantry and the grill (contract-53, unchanged);
   maani's and the grill's older guide box; `noAsks` at L1 still in `recipes.js`; the old `levelTable` for the other stations.

## Round 3: the clinic's heal games on the kit (s14-clinic builder, 30 Oct)

1. **Two counts and a range need their own reader.** `Rules.count` only knew one repeating thing; the clinic's x + y with
   `[lo, hi]` pairs got `Rules.xy(game, lv)` (every per-level table of an entry as `[lo, hi]`), `Rules.draw` and `Rules.span`.
   The games ask through one helper (`HealScene.count / span / choices`), and say what they drew (`plan.counts`), so one unit
   test (`js/clinic/heal/counts.test.mjs`) holds all nine to the file over many seeds, both ends of every range seen.
2. **A game's data file can hold a second copy.** The tooth's `data/clinic/heal/tooth.json` set `chain` and `decay.n` per level
   and overrode the code; the scrape's `cut.json` knobs held `dabCounts`. Grep the game's JSON too when a number moves.
3. **A number the scene cannot draw is a gap, not a stand-in.** The foot's fourth splinter needs a fourth toe's channel and word;
   sore spots' three colours to pop with "not this colour" need a fourth colour (its s03 spot and word). The plan says so
   (`plan.gaps`), the test lists it, the report names it.
4. **Narrower L1 ranges change the leak bots.** Zafar's L1 counts (1-2, 1-3) make a blind "first option" or "random" guess win
   the count row a third to a half of the time; the leak check went red on five games. Widening a row's choices to the
   game's whole count space is honest (a child can stop at any count); calling auto-closing rows "skill" made it worse (fewer
   rows, more blind wins) and was reverted. What is left is for Zafar: his L1 ranges against the 10% limit.
5. **The before must run on the old code while you build.** A 92-page before at four sizes took over an hour; it ran from a
   copy of the tree at the launch commit (`git archive` plus hard-linked assets) so the build could go on in the worktree.
6. **The clinic's bubbles were placed by speakers only.** The doctor's opening lines sat on her face because the room's patient
   was no speaker; the clinic now hands the placement her head's live box as `avoid`. That was not enough at 740x320 (the
   doctor at the screen's edge): the shared placement (`request-popup.js`) now wraps narrower beside the head, then above or
   below slides the bubble along its row off the face while its tail still reaches its head. Run chai with it (it passed).
7. **Hiding a kit control from a game's CSS trips the static lint** (mode CSS may not name kit classes): the doctor's box hides
   its bulb and speaker from JS, and the clinic's own classes (`.cl-help-arrow`, `.cl-helper`) carry the new look.
## Round 3: every Cook station on the kit (s14-cook builder, 30 Oct morning)

1. **One switch, then shared Cook code, not station by station.** The look went on for every dish in two lines (`ui.js`
   `UI.S14_ALL`, `flow.js` `preLook`); what each station needs from it lives in Cook's shared code: `introduceAlong` says a dish's
   own card as it says chai's people (item by item, each big card into its row card), `station-lib.js` gives every station the
   helper card (from `Cook.expect.key`), the word pill (`Cook.chipWord`, `markRight`), the first-time hold (`St.firstHold`) and
   the decoys by the rules (`Cook.levelRow` on `Rules.level`); `coach.js` hugs the light to the picture (keeping the tap point
   inside it) and lights the order card once after a quiet spell.
2. **Numbers belong to one walker.** `Recipes.fromRules` fills any `{"rules": game}` at any depth of a recipe (plain, `add`,
   `range`, `axis` x/y, `kinds` with `part`); a recipe `fit` makes chaat's spoons add up (a layer said twice counts twice); a `split`
   slot shares daar's X among onion, tomato and chilli. The Node harness had no `flow.js`, so it never filled them: it now does
   what the game does, or every Node test reads the stand-in.
3. **Chai's branches in the checks were the kit's.** contract-35 (no dots at L3-L4), 37 (decoys 1-4), 39 (English at L1) and 44
   (no finger) named `chai-tray`; with every Cook game on the kit they name every Cook flow (44 only where the showing is all taps:
   a swipe or a roll keeps the kit's moving finger). A pool with no more to offer says `room:n` (the rules: "where the space allows").
4. **A pinned control takes space in every game, not only the one it was judged in.** The cog top right covered the pantry fridge's
   top slot on a phone: the milk could not be tapped at L2-L3. Ask each station what sits under the pinned things.
5. **Random draws move when counts move.** New counts change the seeded sandbox's dice, so Nani's pass-me now comes in the pantry at
   1280x665 and 1920x1080, where the player's click on its item times out (it clicks the same item by script without trouble).
6. **What a game cannot take stays its own way, said aloud:** daar's tadka has no timer today, so no first-time hold (a burn would be
   a new mechanic); the samosa boxes per samosa and daar's staged chop-card dots are the old look's (Kutchi always written).
7. **Plan the browser time first.** The brief's before ran 72 pages (4 sizes for every probe; the grill at a child's pace times out at
   12 minutes a page) and a background task's 30-minute limit killed it once: resume with `--resume <run id>`.
