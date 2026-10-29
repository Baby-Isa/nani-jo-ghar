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
