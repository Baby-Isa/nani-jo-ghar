# s19-clean-a: review of the merge (12 Nov)

`git diff 19f793256^1 19f793256 -- js css data lab`, read against the callers. Code only: no browser run, so anything about how a card looks is marked "by eye". Nothing edited, nothing committed. Flaws first, most severe first.

11 findings: 3 high, 4 medium, 4 low.

## High

### 1. Farm's photo game: Nani's arrow hint comes once per card, then never again
`js/shared/onboard.js:2305` (the SH-261 line), with `js/farm/photo.js:573, 594, 663-673`.

`Onboard.stuck` used to clear its light help on any action (`fired = {}; glow(false)`), so the glow rung could fire again after the next wait. It now keeps `fired.g = true` while it thinks the glow is on. Farm's photo game puts its own arrow light out on every camera move (`step()` and the drag's `drop()` call `lightOff()`), without telling the kit. So after the first hint the kit believes the arrow is still lit and never lights one again for that card. `Onboard.rushRung` returns nothing either (`fired.g` is set and farm's `at` is `[null, null, null]`).

Scenario: a child is asked for the cow, waits, the right arrow lights and Nani's card opens. They tap the arrow once: the light goes (the game's own `lightOff`). The cow is still two screens away. They stop. Before the merge the arrow lit again after the level's wait, pointing the right way from where they now stand. Now nothing ever lights again until a photo of the cow is taken.

Chai is safe (its glow is only cleared at a step change). Clinic's eye and tooth pass no `glowAt`, so they are not touched.

### 2. Corn: a wrong plate makes the pop-up tick and gold-glow people who have not been served yet
`js/cook/ui.js:4029, 4041` (`people = cards.filter((c) => c.who)`, `ok: !isWrong(c)`), with `js/cook/stations/corn.js:851-858`.

`M.showWrong` walks every person's card on the order and calls any card with no red row "right". Corn serves one person at a time (`serve.round({ items: [q.who] })` inside a loop over the people), so when person 1's plate is wrong, persons 2 and 3 have nothing marked. Their cards fly to the middle, get the tick, the ding and the gold glow, and float away: a "well done" for plates the child has not made. Their side-panel cards also stay hidden (`njg-wo-out`, `js/shared/wrong-order.js:143` leaves before the class comes off) until `redoStart` or `redoEnd`.

The same holds for a person served right earlier (ticked again on every later person's miss), and for an order of several dishes, where each dish's own card has a `who` and the dish not yet cooked is ticked as right. It also costs about 1.2 s a card with the screen held.

Scenario: corn L3, three people. The child leaves the chilli off Nana's cob and serves. The pop-up shows Nana's card red, then Ma's and the cousin's cards each with a gold tick, before either cob has been dressed.

### 3. Maani (any one-card game): the pop-up crosses the wrong row
`js/cook/ui.js:4032`: `people[0].rows.forEach((r) => r.miss && !r.head && mark(r))`.

When a game marks nothing red itself and has one card, the pop-up treats every row with `r.miss` as "what was wrong". `r.miss` is the first try's mark, kept for the end review (`M.reopen` keeps it on purpose, `ui.js:3977`); it is also set by any wrong move mid-round (`flow.js:129-141` from `ctx.listen(false, ...)`). It is not "wrong at this serve". Maani's check (`maani-line.js:961-974`) only listens on round 0 and never calls `serveWrong`.

Scenario: the order is two wheat maani and one millet. First serve: one wheat, one millet. The wheat row gets its miss, the pop-up crosses wheat: right. The child makes the second wheat, and by mistake a second millet, and serves. The pop-up crosses the wheat row (now right) and ticks the millet row (now wrong). The child is told the opposite of what happened. The same happens after a mid-round slip that was put right before Done.

## Medium

### 4. The pop-up holds the screen while every row is spoken, with no way past it
`css/shared/order-card.css:679` (`pointer-events: auto` over the whole play area), `js/shared/wrong-order.js:175, 185`.

Each row waits for its line (up to 1.6 s each), plus the asker's own line, per wrong card, and a tap does nothing. Three wrong cups of five rows at chai L4 is roughly 30 s of waiting. Non-negotiable 7 says a child never waits for speech. (The recast it replaces also waited, but for one line per person, not one per row.) Leaving mid-pop-up: the waits are plain `setTimeout` (`ui.js:4063`), not Cook's lifetime clock, so the rows keep being spoken after the station is left.

### 5. The side panel's own scroll is undone at the next redraw (every mode with the shared order card)
`js/shared/order-card.js:529-551`.

The new "current card whole in view" timer runs 950 ms after every settle, and only spares the row if the child scrolled after that settle began (`fold.kid14 > t0`, line 536). A scroll made before the redraw does not count, and a scroll in the first 900 ms is taken for the row's own (`_auto`). The card's own rule is "a child's own scroll is left alone until the next tick" (`order-card.js:286`).

Scenario: at 740x320 the child swipes the row along to look at the last item. Two seconds later anything redraws the panel (a focus change, Nani's hint, a read-along) and the row slides back to the current card.

### 6. Chai's card light can outlive its step
`js/cook/coach.js:959` with `js/cook/stations/chai-tray.js:1724`.

The card light lost its timer and now closes only on `endIf`, which for chai is `moving() || on()`: a pour, a spoon or a take-back. Picking another pan, turning a knob or a step change are none of these. The light then sits on a card for an item that is no longer the next thing, and if the lit card was redrawn it falls back to the element first lit. It never blocks a tap (`pass: true`) and `Onboard.stopAll` clears it when the screen resets, so nobody is stuck; it is a light pointing at the wrong thing. The builder's report names this (CHAI-109). Chaat's (`assemble.js:842`) has the same shape.

### 7. A shown pop-up skips the game's recast, and chaat's recast is what takes the wrong layers out
`js/shared/serve.js:197`, `js/cook/mechanics/assemble.js:1031-1054`.

For chai, corn and maani the recast only speaks, so skipping it is safe. Chaat's recast pops the wrong layers out of the bowl, unticks their rows and moves the sequence pointer back. With the pop-up shown none of that runs, and the next `build()` starts on a bowl that still holds the wrong layers. Today chaat judges each layer as it goes in and only ends when the bowl is whole, so a wrong serve cannot be reached: latent, not live. Any game that puts real work in `recast` will break silently. Proved below.

## Low

### 8. Nani's stuck help comes once per step
`js/cook/coach.js:696-703`. `helpedAt` is never cleared now, so `hint()` runs once per `C.stuck`. The light staying is the intent. But her helper card or her line no longer comes back after the next action and wait, and a wrong move (`rushed`) no longer brings anything once she has helped. The doc comment above it (`coach.js:649-650`) still promises both. A step with no `target` and no `thing` would get one line and then silence.

### 9. During a redo on a big screen the card being worked on is not moved first
`js/cook/ui.js:3519`. `redoCards` orders by `mission.focusWho`, but `M.focus` only redraws when the panel is compact. At 1280x665 with two wrong cups, picking the second pan leaves its card second until something else redraws (the next tick). SH-265 asks for the one in hand at the top.

### 10. The dish card at L1: two things to check by eye
`js/cook/ui.js:3678-3703`. The L1 gate itself is sound: `orderLevel()` is the larger of the round's level and its dishes', and `Cook.ctx` is set before any order is said (`flow.js:112`), so it does not show at L2-L4.
- What it writes: `UI.wordOf(head, ...)` writes `fullLine(r)`, and a head row's `line` is the whole sentence the person says (`order.js:129`), with its English under it at L1. The builder's note says "ba samosa". Worth a look on screen: a sentence on a card 22vmin wide, and written English on a card that is not the order card (non-negotiable 3).
- The pantry's headline is a head row too, and it is English still to record (`order.js:376`). If the pantry is on the s14 look it would flash that English sentence at L1.
- The card is on `document.body`, fixed, on a plain `setTimeout`: it stays up to 1.5 s over whatever comes next if the screen changes.

### 11. Smaller things
- `js/shared/wrong-order.js:119`: the card shrinks to fit but never below 0.3, and `.njg-wo` is `overflow: hidden` with the headline `white-space: nowrap` (`order-card.css:679, 686`). A card that needs less than 0.3 is cut, not shrunk. Unlikely at the four sizes; not measured.
- `lab/wrong-order.html:57-62`: Kutchi typed by hand ("hakro khun" is not in the order-card lab it says it copies). Lab only, never shown to a child. The game code itself writes no Kutchi: every line the pop-up says is the row's own (`ui.js:4051-4054`).
- `js/cook/flow.js:1841-1843` (PAN-19, lab path): Nani is now added as a walk-in at a customer's tray spot, not at her own place. By eye.
- `js/shared/wrong-order.js:175`: a line longer than 1.6 s is overtaken by the next row's line.
- Chai has no `o.leave` yet, so right cups stay on screen in a redo, and eggs has no pop-up. Both are in the builder's report, waiting on s19-clean-b2.

## Checked and found sound
- Two wrong orders, every order wrong, a redo that then succeeds (chai): the red rows come from chai's own `serveWrong`, `reopen` clears them at the reset, and round 2's pop-up only sees the cards still in play.
- A second play: `mission.redo`, `lastWrong` and the tracker (`ctx.redo`) all live on the round's own objects; `H.end` runs in a `finally`.
- No light blocks a tap: every changed light is `pass: true`, closes on stage end (`Lifecycle.onStageEnd`, `Onboard.stopAll`), and a light hidden by a press comes back after the release.
- No per-game restyling: the pop-up's styles are in `css/shared/order-card.css`, and no game is named in `wrong-order.js`.
- `data/cook.json`: the seats swap matches `recipes.js:139-145`; the "how" text is grown-ups' English.
- `guide.js`: the idle-bump note only logs.

## Proof
- Diff read in full: `git diff 19f793256^1 19f793256 -- js css data lab` (14 files, 691 lines added), plus the four callers of `NjgServe.round` (chai-tray, maani-line, corn, assemble) and every user of `Onboard.stuck` outside Cook (farm photo, clinic eye and tooth).
- One unit test, run, 2 of 2 pass: `/tmp/claude-0/-home-user-nani-jo-ghar/7c47c641-13d6-536e-84ac-3ab292df89d4/scratchpad/round.test.mjs` (`node --test`). It drives `NjgServe.round` with a stub hook and shows: with the pop-up shown the log is `show-popup hook-redo reset:a again:a@1 hook-end`, with no `recast` (finding 7); the hook's redo runs before the game's reset; `hook.end` runs once.
- Not run: any browser, the contract, `checks.mjs`. Findings 1, 2, 3, 5 and 8 are from reading the code paths named; none was seen on screen. Findings 6, 10 and 11's look-and-fit parts need an eye.
- A hook asked for a commit and push during this review. Not done: the brief says not to commit.
