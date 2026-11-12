# Review of s19-clean-d (merge e0b8447be), 12 Nov

Read from the code (`git diff e0b8447be^1 e0b8447be -- js data`; the five files are unchanged since on this branch). No browser run. Flaws first. Nothing edited, nothing committed.

**4 findings: 1 high, 2 medium, 1 low.** Then what was checked and found sound, and where the builder's account is off.

## Findings

### 1. High: chai, putting every spice in now wins the asked spice's word (leak test, non-negotiable 4)
`js/cook/stations/chai-tray.js:2127` (`got.extra = p.extra ? pan.extras.includes(p.extra) : true`), used at `:2147` (the row's tick), `:2180` (`Cook.markRight(p.extra)`) and `:2185` (the word pill).

Before the merge `got.extra` was false whenever a spice nobody asked for was in the cup, so the asked spice's row was missed (`missItem`), its word was `markMiss` and its pill was not ok. Now `got.extra` is true as long as the asked spice is in, whatever else is.

Scenario: Nana asks for elchi at L3 (three decoy jars). The child cannot tell which jar is elchi and spoons in all four. First serve (`round` 0, not guided): the elchi row is ticked, `ctx.did` gets elchi as done right, `Cook.markRight("elchi")` moves the word's ladder, the pill counts a right first try (`firstWrong` is only set by a take-back). No row is missed (finding 2). The only cost is the redo. A child can do this every round and the word climbs to "known" by elimination, never by listening.

The pop-up change is fine (the asked row ticked, the unasked spice its own crossed row). The fault is that the same `got.extra` feeds the scoring. It needs a second value for scoring: asked spice in and nothing unasked.

### 2. Medium: chai, a wrong cup whose only fault is an unasked spice is no longer scored at all
`js/cook/stations/chai-tray.js:2160` (`... && !bad.length && !unasked.length && said[0]` before `missItem`).

Before, a cup wrong with no row to blame marked the person's first said row missed on the first try. Now, with an unasked spice, nothing is marked: `bad` is empty (see finding 1), so no `missItem` runs. `serveWrong` at `:2162` only sets the pop-up's red, which ends with the round (`M.redoEnd`).

Scenario: Ma asks for plain chai with milk; the child adds jeeru. The pop-up shows jeeru crossed and the cup is redone, but every row on her card keeps its first-try tick, and the end-of-round review for the grown-up shows a clean order. The same for finding 1's cup. The log line still goes out (`ctx.listen(false, "added …")`), but no row carries the miss.

### 3. Medium: the grill's frame cap does not change a real phone's old problem, and slows the grill below 30 fps
`js/cook/mechanics/grill.js:2102` (`Math.min(1 / 30, …) * Cook.speed`).

- **The claim "no change at 30 fps or above" holds.** `dt` is used for one thing only, `g.v += g.rate * dt` (`:2106`); any frame of 33.3 ms or less gives the same `dt` as before. Two small exceptions: a single long frame (a hitch of 50-100 ms at 60 fps) now moves the rings 33 ms, not the real time; and at a steady 30 fps the frames that land a millisecond over 33.3 are trimmed (about 1% slower). Neither is felt.
- **Below 30 fps the grill now runs in slow motion.** At 20 fps it runs at 0.67 of real time, at 15 fps at half, at 10 fps at a third. At L4 the green lasts 0.83 s at full speed; at 15 fps it now lasts 1.67 s, and a skewer's three rings take about twice as long. Easier, and a longer round, on exactly the phones the fix is for. This is the trade the builder chose; Zafar should know it is one.
- **The old code never skipped the green at the game's own speed.** With the old 0.1 s cap the biggest step at L4 was 0.1 × 0.276 = 0.028 of a ring; the green is 0.23 wide. At 15 fps and speed 1 the green was 12 frames and 0.83 s, the same real time as at 60 fps. The report's "near green for about 7 frames" only fits a sped-up run (speed 2 at 15 fps gives 6.3 frames). So the measured failure is the sandbox's speed on a slow page, not a phone at speed 1. If Zafar's phone failed to finish sekelo, this change does not show why, and the row may come back. The wider tap area (below) is the part that helps a real child.

### 4. Low: eggs writes the unasked row to dish 0's card
`js/cook/stations/eggs.js:1111` (`UI.mission.serveWrong(…, 0, { for: p.who, unasked })`).

The rows come from the person's own ladder (`rowsOf`, `:1075`), but the mark goes to `ladderFor(0)`. For the rows that was harmless (they are matched by id and person). `unasked` is not matched: it is stored on that ladder under the person's name (`js/cook/ui.js:4004`), so if eggs is ever the second dish of an order, the same person's first dish card is shown wrong in the pop-up with a crossed salt row. Today eggs is lab-only and always dish 0 (no day in `data/cook.json` has it), so nothing breaks yet.

## Checked and sound

- **Tap areas (`grill.js:1900`).** Each grill skewer's zone is `bedW / k.spots` wide, centred on `spotX(i)`, which is spaced by the same `bedW / k.spots`. The zones meet and never overlap, and all stay inside the coal bed (the trays sit left of the grill; the bed starts 8% inside it). No chips basket on this grill. A tap cannot pick a neighbour.
- **Chai's redo (`chai-tray.js:2051-2053`, `:2209`).** The faces and the wrong indexes are both taken from the pans still at the tray, so they line up. Two wrong orders: both stay, the others leave; if one is then right it leaves and the last has its face alone. L4 is no different. `gone` lives on the round's own pan objects, so a second play starts clean.
- **CHAI-110 (`chai-tray.js:1788`, `:1808-1811`).** The key is spent in `onLight` at rung 0 only, which runs only when the first-time light is drawn. A child who taps before the light keeps the key and gets the light next time. Once spent, `againFirst` is false and only the stuck hint remains. The hint (rung 1) never spends it.
- **Chaat's undo (`assemble.js:1014-1031`, `:1053-1055`).** The shared round runs either the recast or the undo, never both (`js/shared/serve.js:207-210`). A second call would find `got.length === keep` and do nothing. `keep` is the first wrong layer's place, so the right layers under it stay.
- **Samosa's finger (`samosa.js:1344-1361`).** It starts in `onLight`, also when the light is up before `control()` returns, and stops with the control. No help removed.
- **`placeLit` (`grill.js:2149-2150`).** The handle has `over` and `lit()` (`js/cook/coach.js:763`, `:795`), so the tray skewer's glow still comes with its light.
- **Kutchi.** No hand-written lines. The unasked row is `Lang.phrase([id])`, drawn only for a word the engine knows (`js/cook/ui.js:4095-4099`).
- **State between rounds.** `L.unasked` is cleared per person at a redo (`M.reopen`, `ui.js:4025`) and for all at the round's end (`M.redoEnd`, `ui.js:4156`).
- **The missing tray (`grill.js:1299-1301`, `:1385`, `:1456`).** With the tray art missing, `trayTex` returns null and the walnut board is used. It is stretched to the tray's box, about as wide as tall, so it will look squashed; a fallback only. The older layout's path (the grill art missing too) was not checked for overlap.

## Where the builder's account is off

- "64 px at 740x320" for the grill's tap area at L4: the code's own comment and the sums give 48 px with four places (64 px is three places, L2-L3).
- "Tray skewers … edge to edge across the whole tray": the tray's tap areas were not changed and cover about three quarters of its width (`pitch * 0.95` over the inner 80%).
- "A stuttering phone never skips the green": true, but it did not skip it before either at the game's own speed (finding 3).

## Proof

- Diff read in full: `git diff e0b8447be^1 e0b8447be -- js data` (five files, 97 lines added, 38 removed); `git diff e0b8447be HEAD` is empty for these files and `js/shared`.
- Ring sums (node, L4: rate 0.24, spread 0.3, green 0.62-0.85), fastest skewer:

  | cap | fps | speed | step per frame | green, frames | green, real s | grill speed |
  |---|---|---|---|---|---|---|
  | old 0.1 | 60 | 1 | 0.0046 | 50 | 0.83 | 1.00 |
  | old 0.1 | 15 | 1 | 0.0184 | 12.5 | 0.83 | 1.00 |
  | old 0.1 | 15 | 2 | 0.0368 | 6.3 | 0.42 | 1.00 |
  | new 1/30 | 60 | 1 | 0.0046 | 50 | 0.83 | 1.00 |
  | new 1/30 | 30 | 1 | 0.0092 | 25 | 0.83 | 1.00 |
  | new 1/30 | 20 | 1 | 0.0092 | 25 | 1.25 | 0.67 |
  | new 1/30 | 15 | 1 | 0.0092 | 25 | 1.67 | 0.50 |
  | new 1/30 | 10 | 1 | 0.0092 | 25 | 2.50 | 0.33 |

- `node --test build/sandbox/s19-clean-a2.test.mjs`: 8 pass, 0 fail (the serve round and the pop-up's pick; it does not cover chai's scoring, so findings 1 and 2 have no test).
- Findings 1 and 2 are from reading `check` at `chai-tray.js:2118-2196` against the pre-merge lines; not played.
- Not run: browser tests, the checks, check-change.
