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
