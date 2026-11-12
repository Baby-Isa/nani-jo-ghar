# s19-clean-c: review of the merge (10847e26e → 15ba40826, `js` and `data`)

Read-only review; no code changed, nothing committed. Ten findings, most severe first. Nothing was played in a browser, so each
finding says whether it is read from the code or taken from the builder's own run.

## Findings

### 1. The stir now ends short on any let-go, and tap-a-lap play breaks (high)
`js/cook/mechanics/stir.js:693-698` (`stopped`), `:746-774` (pointerup), `js/cook/stations/daar.js:1265-1273` (the redo).

The stir ends one move-on beat (1 s, `NjgButtons.BEAT_MS`) after any release once one lap is counted, whatever the count. Under the
count is then a wrong answer: `z.listen(false)`, `Cook.markMiss` on the number (first try, not guided), `Cook.oops` at L1, and the
stir starts again from nothing.

- Scenario A (tap play, a kept mechanic: "a tap on the pot is one turn"): Nani asks for three. The child taps once, the ladle goes
  round (700 ms), "hakro" is said. The child waits a second for it before tapping again. The stir has already ended at 1 of 3 and is
  marked wrong. Before, daar ended only at the count.
- Scenario B: a small child stirring by drag lifts the finger after lap 1 to re-grip and takes over a second. Same result.
- The stir game's old code said this in so many words (`stir.js` before the change, SH-238): "Letting go before that is never the
  end (children did that by accident)". That guard is gone in both games.
- DAAR-46 (Zafar, 9 Nov) asks that the stir not stop the child at the count. Ending under the count on a let-go is the builder's
  reading of it, not his words; it needs his yes, or the beat should only run once `count >= laps`.

### 2. Sekelo: stale ticked piece cards on a redo (high)
`js/cook/ui.js:3938` (`M.reopen`) against `:3248-3254` (the piece rows) and `:3868-3871` (`M.tickPiece`).

`M.reopen` sets every unit of the row back to false but leaves `r.unitGot` as it was. The piece cards are drawn from
`unitGot[u]`.

- Scenario: the order is two mishkaki skewers, both threaded right (`unitGot = [4, 4]`), one burnt on the grill.
  `mishkaki-grill.js:113` reopens the row. Back at the board, before any piece is on, both rows show four gos ticked. The first
  piece sets row 1 to one tick; row 2 keeps its four stale ticks for the rest of the redo, though nothing is on it.
- Fix shape: clear `r.unitGot` where `r.units` is reset.

### 3. Sekelo at 740x320 no longer finishes L2 and L3 (high, from the builder's run; cause not proven)
`js/cook/mechanics/thread.js:96-99, 316` (`pieceStep` on every piece), `js/cook/ui.js:3243-3256`, `:3310`.

The builder's own proof: before, 30 of 32 rounds ended (only sekelo L4 timed out); after, sekelo at 740x320 hits the 300 s cap at
L2, L3 and L4. The report puts it down to redrawing the order per piece. What the code shows:

- every piece now calls `tickPiece` (a full `renderOrder`) and opens a new step in Nani's box (`UI.step`);
- on a short sidebar (under 480 px high) CK-79 folds a card's rows into one sideways row, but `ui.js:3310` skips that when more
  than one row is ordered. Two plain skewers are now two ordered rows of four cards, so the fold is skipped and the card is two or
  more rows deep on a 320 px screen. That is the likely cut or scroll (non-negotiable 6), and the likely slow path.

This is merged with a round that does not end at phone size. It needs a look in the browser before it is called done.

### 4. The first-time finger is gone from samosa's fry and maani's flip (medium: a help removed)
`js/cook/stations/samosa.js:1308-1311`; `js/cook/stations/maani-line.js:427`, `:608`.

Both now stop the coach's staged script (`Cook.Coach.stop(false)`) and put `Cook.Coach.control` in its place. The staged steps
(`data/cook.json` onboard.fry: knob, each samosa, lift on the green; onboard.maani-line step 4: flip on the green) carried the ghost
finger doing the move (`coach.js:182`). `Coach.control` is the dim and the gold box only: no finger.

- Scenario: a new player's first guided samosa. The knob, the first samosa and the golden one each get a box and the call; nothing
  shows the tap. Zafar's SAM-30 was "nothing told me or showed me how to place them into the frying pan".
- `C.stop` also calls the script's `skip()`, which stores it as seen (`onboard.js:1592`), so the finger never comes back for that
  player.
- This swaps one help for another. It needs Zafar's OK (non-negotiable 1), or the finger added to the control's first time.

### 5. Sekelo's card no longer writes the number or the skewer's kind (medium)
`js/cook/ui.js:3243-3256` (plain skewers), `:3267` (mixed).

A plain skewer's own card ("ba lakri mishkaki") is replaced by rows of piece cards, and a mixed skewer of two loses its kind card
once its pieces show. So the number Nani says is no longer written anywhere on the card (SH-99, contract-30: the builder's table
shows sekelo 0 → 9 breaks on 30, 18 and 72, handed to the checks' owner as if the check were wrong).

- The count is now readable as the number of rows, with no listening, at every level, including once the number word is past
  support (non-negotiable 4).
- "gos gos gos gos" is Zafar's ask (8 Nov). Dropping the counted card is not in his words; it should be a numbered question to him.
- Also: with two different mixes and a count that is not two, `each` is empty and the kind card is now skipped too, so that row
  would draw nothing. No recipe makes that order today.

### 6. The stir game lost its speed at L2-L3 and its mid-stir switch at L3 (medium: a mechanic removed)
`js/cook/mechanics/stir.js:498`, `:569`, `:931`; `data/cook.json` mechanics.stir level 3 `switch`.

`asked` is null below `speedFrom()` (4) for both callers, and `switchLap` needs `asked`. The stir game's level 3 switch ("now
quickly!") therefore never fires at L3, and no speed is asked at L2-L3. Zafar's 11 Nov word was "daar asks no speed before L4". The
stir game is lab-only today, so the cost is small, but it is a mechanic changed without his comment.

### 7. A release outside the canvas leaves the stir hanging (low to medium)
`js/cook/mechanics/stir.js:746`.

The end of the stir now depends on `pointerup`. Phaser sends `pointerupoutside`, not `pointerup`, when a mouse is released off the
canvas (over the sidebar). `dragging` stays true and `stopped()` never runs, so the stir waits until the pot is pressed and
released again. The old stir game listened for both; old daar ended on the count, so it did not matter there. Touch is not
affected (a touch's target stays the canvas); desktop play and the grown-ups' lab are.

### 8. Maani's big and small moment can leave its card on the page, and is spent before it plays (low)
`js/cook/stations/maani-line.js:797`, `:837`.

- The card is a fixed element on `document.body`, removed only on the scene's "shutdown". Cook's scene is not shut down between
  views; leaving Cook destroys the game ("destroy"). The stir's lap card hooks both (`stir.js:290-291`); this one hooks one. Leave
  mid-moment and the timers stop, the loop never reaches `dropCard()`, and the card stays over the next screen.
- `seen[KEY] = true` is saved before anything is shown. A child who leaves, or an error in the first lines, means the moment never
  plays for that player.

### 9. Corn still lists the old grill picture (low)
`data/stations/corn.json:476` against `js/cook/grill-kit.js:49`.

The kit now draws `v4/kit/grill-v2.webp`; corn's asset list still names `grill.webp`. Corn loads the old picture ahead of time and
fetches the new one only when the scene asks. The builder's report gives the exact line for s19-clean-b; it was merged without it.

### 10. The plain stir line is a new gap that the sheet does not name (low, outside `js` and `data`)
`js/cook/stations/daar.js:1235-1241`, `data/stations/daar.json:10`.

At L1-L3 Nani's box now shows "Stir it {n} times." in grey italic. `docs/language/recording-sheet.md:177` holds only the line
with the speed.

## Checked and found sound
- Every `assets/` path added in the diff exists on disk (the globs match 2 to 11 files each); onion pieces 1-6, `ladle`,
  `tray-steel-long`, `grill-v2` and `karahi-oil-v2` are there. No stale reference to `karahi-oil.webp` or the v3 onion heap.
- No hand-written Kutchi in the added code. The lap card, the dial chip, the piece cards and the big and small card all take their
  words from `Lang.num`, `Lang.phrase` or `Lang.line`; a gap is English with `rec`.
- `speed.byLevel` resolves as meant (`recipes.js:169`: the last entry repeats above L4; `value: null` gives no speed and the stir
  row leaves the word out).
- The other games' cards are untouched: `pieces` is null for chai, maani, chaat, samosa and the pantry, so their rows take the
  same path as before (`ui.js:3236-3240`). `order.js` and `recipes.js` only pass the new field through.
- Load order: `stir.js` loads before `daar.js` (`index.js:27, 53`), and daar reads the kit only at run time.
- `UI.done` and `UI.hideDone` handle a re-grab in the beat correctly (`ui.js:4351-4357`, `:4420`).
- The onboarding scripts stopped in finding 4 are stored as seen, so they do not replay every round.
- JSON parses; every changed JS file passes a syntax check.

## Proof
Read:
- `CLAUDE.md`, `build/reports/s19-clean-c.md`.
- The whole diff for `data/` and for `grill-kit.js`, `grill.js`, `roll.js`, `thread.js`, `order.js`, `recipes.js`, `ui.js`,
  `samosa.js`, `maani-line.js`; the new `stir.js` in full; `daar.js`'s added lines and its stir and redo loop.
- The old versions at 10847e26e of daar's stir (`daar.js:1588-1900`) and the old stir game (`stir.js`), to compare what ended a
  stir and what help each had.
- Around the change: `ui.js` order cards (3150-3330), `M.tickCard`, `M.tickPiece`, `M.reopen`, `UI.step`, `UI.done`;
  `js/shared/guide.js` stepper; `js/shared/buttons.js` moveOn; `js/shared/onboard.js` end; `coach.js` start, stop, control and
  the staged ghost; `zone.js` input; `mishkaki-grill.js` redo; `index.js` load lists; `recipes.js` value and atLevel.

Ran:
- An existence check of every `assets/` path on the diff's added lines: none missing.
- `JSON.parse` on `data/cook.json` and the three station files: ok.
- `node --check` on the eleven changed JS files: ok.
- `node --test build/core/cook-orders-kutchi.test.mjs`: 4 of 4 pass.
- `node --test build/core/cook-l1-order.test.mjs`: 3 of 3 pass.
- `git diff 15ba40826 HEAD -- js data`: empty, so the line numbers above are the merge's.

Not run: the browser suite, the contract, any play. Findings 1, 2, 4, 5, 6, 7 and 8 are read from the code; finding 3 rests on the
builder's own before and after numbers.
