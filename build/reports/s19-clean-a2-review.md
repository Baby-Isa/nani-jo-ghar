# s19-clean-a2: review of the merge (12 Nov)

`git diff 8ad8fd67b^1 8ad8fd67b -- js css data lab` and `git show 6947d8a71`, read against the callers, plus the check and test-player changes under `build/`. Code only: no browser run, so anything about how a card looks is marked "by eye". Nothing edited, nothing committed. Flaws first, most severe first.

9 findings: 1 high, 4 medium, 4 low. Of the eleven earlier findings: 7 fixed, 3 partly, 1 not (its game line is still to come). No child is left stuck by anything found. The bad-runs fixtures still go red (30 of 30).

## High

### 1. Leaving mid-pop-up does not end it: the pop-up is orphaned, and a later stage's end wakes the dead round
`js/shared/wrong-order.js:137, 143-144` with `js/shared/host.js:646`, `js/cook/flow.js:2550` (`Cook.halt`), `js/cook/ui.js:19, 4119`, `js/cook/life.js:92`.

The pop-up now ends on `Lifecycle.onStageEnd`. But when a child leaves (Home), nothing fires a stage end: the host skips it on purpose (`if (LC && !info.left) LC.stageEnd(stageId)`), and `Cook.halt` and `unmount` never call it. The only callers are a station's own normal end, the end screen, the clinic and the day window. The builder's test proves the hook with a stand-in `Lifecycle` it ends by hand (`build/sandbox/s19-clean-a2.test.mjs:94`), not that leaving fires it.

What happens instead:
- The veil used to sit inside `#stage` and went with Cook's screen. It now sits on `<body>` (line 137). It is taken away only by the host's sweep of stray body nodes (`host.js:627-637`), which logs a `ui-left` finding (E17) every time.
- The pop-up's waits are Cook's lifetime timers (`ui.js:19`: `setTimeout` is `Cook.life`'s), which unmount cancels. So `play()` hangs for good on the wait it was in, its `finally` never runs, and its stage-end hook stays registered.
- The next stage end anywhere (the next kitchen station finishing, a clinic stage) runs that hook. The dead pop-up resumes: a stray tick sound, then `M.showWrong` returns "shown", and the dead serve round carries on in `NjgServe.round`: `o.leave` (its errors swallowed), `H.redo` (`M.redoStart`), `o.reset` (chai's `emptyPan` calls `UI.mission.reopen(null, dish, {for: who})`), and in its `finally` `H.end` (`M.redoEnd`), all against whatever order is on screen then.

Scenario: chai L3, a wrong cup, the pop-up opens. The child taps Home while Nana's rows are being said. They start chai again. When that game's station ends, the first game's round wakes: a tick sounds, `M.redoEnd` redraws the new order's panel, and if `emptyPan` gets as far as `reopen`, Nana's rows on the new card are un-ticked. Before the merge the dead round never woke (nothing resolved its waits).

Proved for the pop-up itself (see Proof): after leaving, `play()` has not returned and its hook is still registered; a later stage end makes it play a tick, mark a row and return. The round's part after that is from reading `serve.js:205-232`.

Fix direction: end it on Cook's own lifetime as well (`Cook.life.onEnd`, or `Cook.halt`), and keep the veil a node Cook owns.

## Medium

### 2. contract-115 no longer catches small stoves once there are several
`build/sandbox/lib/contract-s19b.mjs:258-265`.

The check was built for SH-245 ("maximize the vertical height of these stoves"). Its let-off was "unless the main thing's own width takes 85% of the play area". The width is now the span from the leftmost to the rightmost thing in the main thing's "set": anything at least a quarter of the biggest area that overlaps it vertically by 60%. That set is not only sekelo's grill and trays. On chai's own good run it already takes in the tray (`v2-tray` is not in `NOT_MAIN`): the hob alone was 21% of the width, the set is 55%. Gaps between the things count as width.

Scenario: chai L3, three hobs drawn at 45% of the room's height, spread across the play area with the tray beside them. Before the merge: red ("stands 210 px, 45% ... at least 70%"). Now: green. Proved with a made-up scene on the fixture's page (Proof). One hob alone is still caught, and corn's bad run is still red, so `badruns.test.mjs` does not see this.

Fix direction: name the set (sekelo's grill and trays by key), or count only the things' own widths, not the gaps.

### 3. One stray tap silences and compresses the whole pop-up, the wrong card included
`js/shared/wrong-order.js:138-142, 109, 240`.

The first `pointerdown` anywhere on the veil sets `hurry = 4` for the rest of the pop-up. From then every beat is a quarter as long and no row is said. A five-row wrong card then stands for about a second (open 65 ms, head 100 ms, five rows at 125 ms, hold 155 ms), silent. A young child who is still tapping the pans when the serve is judged will do this without meaning to, and the pop-up exists because "it's not obvious what you got wrong".

The other side: a tap while a line is being said does not shorten that line. The wait in flight was timed before the tap (up to 2.4 s, `sayCap`), so "a tap hurries it" starts at the next row.

Scenario: chai L3, two right cups and one wrong. The child taps the hob as the first right card ticks. Both right cards flash by, Nana's wrong card opens, ticks and crosses with no voice, and is back in the panel inside about 1.5 s.

Fix direction: hurry only the card on screen, or only the right cards; a tap on a wrong card skips its current line.

### 4. At 740x320 a five-row wrong card's words are about 10 px (by eye; the builder's own note)
`js/shared/wrong-order.js:148-167, 216-230`; `css/shared/order-card.css:6` (the card's rule: "nothing under 14 px").

The open card is scaled as a whole to fit (`zoom`), and the face is then grown to 1.8 times the panel's, which takes width and forces a second shrink. The builder measured about 10 px at chai L3. contract-118 measures the card's place, its items inside the screen and the face, not the words' size, so nothing is red. Not clipped, but under the card's own floor.

The floor of 0.3 on the scale is still there for the open card (`:165`): a card that needs less runs past the screen. It is no longer cut by the veil (`overflow: visible`), and the compact line now wraps first. Unlikely at the four sizes; not measured.

### 5. Two of the new shared pieces have no caller yet, so two flaws they were made for are still live
`js/cook/ui.js:3999-4008, 4094-4103` (`unasked`), `js/shared/serve.js:207-209` (`o.undo`).

- No game passes `unasked`. Chai still crosses an asked-for row for a spice nobody asked for (`chai-tray.js:2150`), and eggs marks the person's first row. The builder says so; the lines wait for s19-clean-d.
- Chaat does not pass `o.undo` (`assemble.js:1012-1075`). It is safe today for a reason the report does not give: chaat's item is `"bowl"`, `pick` matches no row to it, so the pop-up never shows for chaat and its own recast always runs.
- When `unasked` is wired: `M.serveWrong` files it under `forWho || ""` (`:4006`) and the pop-up looks it up by the card's person (`:4072`). A call without `for` is silently lost. And an id the engine does not know is dropped from the rows (`:4095`) while the card is still called wrong: a red card with every row ticked and nothing crossed.

## Low

### 6. The test player: nothing a child cannot do, but two guards are weaker
`build/sandbox/lib/cook-player.mjs:662-676, 858-861`.

The tap is still a real mouse click (`page.mouse.click`); only the watching moved into the page (every frame). It taps a quarter into the green. That does not hide a child's timing problem: at speed 1 chai L3's green lasts about 4.6 s (`data/cook.json` tray band 0.72-0.84, rate 0.052, halved in the green); the 0.7-2 s the builder quotes is the test speed. What it no longer measures is whether the green can be hit with any delay at all.
- The new fast path (`:858-861`) acts on a second timing step in a row and `continue`s before the "stuck repeating" count (`:893-896`). A knob that never answers is now caught only by the page's whole timeout, later and with a vaguer message.
- The cover check now runs after the click (`:674-676`), so it sees the screen the click left. Something over the knob that the click itself closes is not reported.

### 7. Smaller loosenings in the checks
- contract-94 (`contract-hook.mjs:804`, `contract-s14.mjs:361`): the Kutchi slot may be the sans face if any placeholder sits anywhere inside it, so a phrase with one word still to record lets its real Kutchi words be in the wrong face too.
- `env.mjs:106-117, 137`: the network block is now `https://` only, and only on the first page of a context. Plain `http://` to another host and any second page are no longer refused. The game makes neither today.
- contract-104's 17 breaks went by caching the sandbox's files, not by a change in the game. Sound as an account of the live site (Pages caches too); worth knowing the number is not a game fix.

### 8. Maani: a wrong serve with no row to blame shows nothing at all
`js/shared/wrong-order.js:297-303`, `js/cook/stations/maani-line.js:1017`.

`pick` marks only rows that hold the wrong kind. A kind made that is not on the order (maani's `kinds` holds every type and size) matches no row, so there is no pop-up, and maani's `recast` is `() => null`. The child gets the frown, the extras fly off, and nothing says why. Better than the wrong cross it replaces (earlier finding 3), and the same as before the pop-up existed.

### 9. Smaller things
- `js/cook/ui.js:3709-3712` (L1 dish card): the dish is `head.ids[0]`, the first id, while the card's picture is the last id with a picture (`wcWordId`, `:3002`). A headline whose first word is not the dish would be written "one <that word>" under the dish's picture. And where the order names no count the card writes "hakro ..." though the customer said no number. Both by eye, and the wording is Mum's to confirm.
- `js/shared/wrong-order.js:133-136`: the veil's box is the play area's at the moment it opens. A resize or a turn of the phone mid-pop-up leaves part of the play area uncovered and tappable.
- `js/shared/order-card.js:340`: any touch on a row of item cards (a tap on a speaker, not only a swipe) now counts as the child's own scroll and holds the row still until the next tick.
- `js/cook/coach.js:630`, `js/shared/onboard.js:1843`: a tap finger now waits up to 3.5 s for a light. Where a game shows the finger with no light (maani's flip, `maani-line.js:441`; not checked on screen), it comes 3.5 s late.
- `lab/wrong-order.html:58`: still Kutchi typed by hand ("ba khun" in place of "hakro khun"). Lab only.

## The eleven earlier findings

| # | Finding | Now |
|---|---|---|
| 1 | Farm's arrow hint once per card | **Fixed.** `onboard.js:2327-2333`: without `glowStays` the light goes on any action and the rung fires again, as before s19-clean-a. Only Cook passes `glowStays` (`coach.js:1074`). Clinic's eye and tooth are back on the old path too. |
| 2 | Corn ticks people not served yet | **Fixed.** `serve.js:202-204` passes the people judged; `pick` keeps those and any card already wrong. Corn's items are the names. |
| 3 | Maani crosses the wrong row | **Fixed.** `pick` marks by this serve's wrong kinds, never `r.miss`. Leaves finding 8 above. |
| 4 | The pop-up holds the screen; plays on after leaving | **Partly.** A tap hurries it (finding 3 above for how). Leaving is not fixed: finding 1 above. |
| 5 | The panel's scroll undone at a redraw | **Fixed.** `order-card.js:180, 340, 547`: the child's scroll is kept until the next tick. |
| 6 | Chai's card light outlives its step | **Fixed.** `coach.js:965-976`: it ends when its item is no longer the next thing. |
| 7 | A shown pop-up skips the recast's work | **Partly.** `o.undo` is in the shared round; chaat does not pass it. Not reachable today (finding 5). |
| 8 | Nani's help once per step | **Fixed.** `coach.js:706-707`; `test_shared_lights_s19.mjs` now asks for more, not less (helped again, the same light, and only once until the next action). |
| 9 | Redo: the card in hand not first on a big screen | **Fixed.** `ui.js:3529-3539`, and contract-118 checks it. |
| 10 | The L1 dish card | **Fixed.** The dish and its count, no English, nothing for the pantry's headline. Two things by eye in finding 9. Its stage-end close has finding 1's gap, but the card lasts 1.5 s. |
| 11 | Smaller things | **Partly.** The line wraps before it shrinks; the open card's 0.3 floor stays. The lab's row changed, still typed. `sayCap` is 2.4 s. Chai has `o.leave`; eggs has the pop-up. PAN-19 (`flow.js`) is not in this merge: **not done**. |

## Checked and found sound
- Two wrong orders, every order wrong, one person, a redo that then succeeds: the loop takes each card in turn; `mission.lastWrong` keeps the wrong ones; `reopen` clears the red and that person's `unasked`; round 2 brings only the cards still open.
- A second play: `mission.redo`, `lastWrong` and `L.unasked` live on the mission; `M.redoEnd` clears the red and `unasked` in the round's `finally`. (Finding 1 is the one exception, and needs a leave mid-pop-up.)
- An error inside the pop-up (a card that fails to draw): its `finally` takes the veil away, `serve.js` catches it and the game's recast runs. Nobody is stuck.
- No written English or hand-written Kutchi in the game code: every row and headline is the engine's (`Lang.phrase`, the row's own line). The pop-up's missing Kutchi shows as grey italic English (eggs' "boiled egg"), as rule 2 says.
- Samosa's `title14`: `sections` holds `{s, rows}`, the text is the engine's phrase with the level's dots, and `.oc-block14` wraps (no `nowrap`, no ellipsis).
- The veil on `<body>`: the cog (`z-index: 120` in `#stage`, which makes no stacking context) stays above it. No rotate transform on the page (`data-rotate` is only the "turn your phone" card).
- contract-118's new parts ask for more (each right line seen in the middle, ticked; the redo's first card). `ticked: undefined` on an old sample passes, which only matters for old recordings.

## Proof
- **Bad runs:** `node --test build/sandbox/badruns.test.mjs`: 30 of 30 pass, 15.5 s. Every check that was red on a bad run is still red; chai's good run is green.
- **Finding 1**, run: `/tmp/claude-0/-home-user-nani-jo-ghar/7c47c641-13d6-536e-84ac-3ab292df89d4/scratchpad/wo-leave.mjs` drives the real `NjgWrongOrder.play` on a stand-in page with a clock that can be cancelled as `Cook.life` is. Output: mid pop-up the veil is on `<body>` and one hook is registered; 4 s after leaving, `play() returned: false`, hook still registered; after a later stage end, `play() returned: true` and it did `sound:tick, wo-row, wo-close`. That no stage end fires on leave is from `grep -rn "stageEnd(" js` (six callers, none on leave) and `host.js:646`.
- **Finding 2**, run: `/tmp/claude-0/-home-user-nani-jo-ghar/7c47c641-13d6-536e-84ac-3ab292df89d4/scratchpad/c115b.mjs` gives `check115` three hobs at 45% of the height and a tray, on the fixture `s19c2-cook-chai-tray-speed1@1280x665`. With the checks as they were before the merge (`git archive 8ad8fd67b^1`): `RED ... stands 210 px, 45% of the 465 px`. With today's: `GREEN`. `c115.mjs` beside it shrinks the real chai run's pictures: one hob is still caught at every size, and the message's width went from 21% to 55% (the tray counted in).
- **Finding 6**, the green's length: `data/cook.json` boil level 3, tray: band 0.72 to 0.84, rate 0.052, `greenRate` 0.5 (`boil.js:360`): 0.12 / 0.026 = 4.6 s.
- **By eye:** three of the builder's shots opened (`build/screenshots/sandbox/s19-clean-a2-after/cook-chai-tray-l3-serve-wrong/740x320/c09, c14` and `cook-eggs-l3-serve-wrong/1280x665/c11`). The eggs card is whole, marks inside their rows, the cog above the veil. The two chai shots at 740x320 caught the card in flight, so finding 4's 10 px is the builder's number, not mine.
- **Not run:** any browser, the contract, `checks.mjs`, the builder's own tests. Findings 3, 5, 8 and 9 are from reading the code paths named; none was seen on screen.
