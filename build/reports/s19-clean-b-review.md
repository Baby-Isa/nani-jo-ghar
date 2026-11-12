# s19-clean-b review: the merge 2656ecf03 (js and data), read against the code at HEAD e1cac40b9

Reviewer, not the builder. No code edited, nothing committed, no browser run. 12 findings: 4 that stop a row from working, 3 medium,
5 low. Flaws first, most severe first.

## Findings

### 1. Chai: a new player's first-time light on the pour is gone at L1, L2 and L3 (a help removed)
- `js/cook/stations/chai-tray.js:1780-1781`, with `:226`.
- What goes wrong: `fullFirst = pourPan && !nx.again && needOf(pourPan) > 1` was written for L4's full glass. Below L4 `needOf` is
  always 2 (`halves ? … : 2`, one tap fills the glass), so `fullFirst` is true for every pour and `firstTime` is forced to false. The
  gate key `ctl-pour` is never asked for below L4.
- Failure: New player, chai L1. The pan is ready. Before the merge the pour's light came at once with its call (`gate14.first("ctl-pour")`).
  Now there is no first-time light: the child gets only the stuck hint after the level's wait. This also contradicts the comment at
  `:1544` ("a new player's the first time, at once") and CHAI-112's row.
- Side effect: `ctl-pour` is first spent on a half glass at L4, so the "first-time" pour light can come for the first time three levels late.

### 2. Chai CHAI-110 does not happen for a child who reaches L4 by playing (two causes)
- (a) `data/cook.json:1095-1098`: the teach seats are still `["ph-half", "ph-full"]`. The builder's own line (full, then half) was
  never applied; the merge has no cook.json change. The first L4 round still asks half first, against Zafar's 11 Nov night correction.
- (b) `js/cook/stations/chai-tray.js:1781`, with `:2205-2208` and `js/cook/coach.js:467`: the light for the second tap is
  `gate14.first("ctl-pour-again")`, and the gate is only fresh for the grown-ups' New player or while chai's coach is unseen. Chai marks
  itself coached at the end of its first unguided round.
- Failure: a child plays L1 to L3, then meets L4 for the first time. Full glass, first tap pours half, the pan goes back. No light comes
  on the glass (the gate is not fresh), only the stuck hint after L4's wait. This is exactly the moment Zafar asked the light for. It
  works only in a New player session started at L4, which is what the builder's frames show.

### 3. PAN-19 is not in the game
- `js/cook/flow.js:1838-1841` (unchanged), no `UI.guideFor("fetch")` in flow.js; `grep PAN-19 js data` finds nothing.
- What goes wrong: the builder's report lists PAN-19 as built, but its whole change is the three flow.js lines in "Exact lines for
  files I don't own", and none was applied. `people` is still `[]` for Nani and `came` still filters her out.
- Failure: pantry, any level, from the start: nobody at the counter, the cards appear on the side as before (Zafar's 30 Oct complaint).

### 4. CHAI-109 does nothing
- `js/cook/stations/chai-tray.js:1729` passes `ms: pointMs + 500`; `js/cook/coach.js:960` still reads `ms: (R ? R.pointMs() : 0) / speed()`
  and never looks at `o.ms`.
- Failure: chai L1, New player: the third card's light lasts exactly as long as before, not half a second longer.

### 5. "A little, a lot" is still shown for baking
- `data/cook.json:826`: `"how": "Nani says one thing at a time: a little, a lot, a cup. …"` (read by `js/cook/flow.js:235`). The
  builder's replacement line was not applied.
- Failure: a grown-up opens baking's "how to" text and reads the old amounts, which the game no longer has.
- No code path is left: `baking.js` has no `amt === "little" | "lot" | "more"`, no `lotTaps`, no `Lang.line("alot" | "little" |
  "stillmore" | "good")`; every plan step is `amt: "jug"`. The lines remain in `data/lang/seed/cook.json` (:662, :756, :766) and the
  recording sheet still asks Mum for "A lot." and "Still a little more." (:118, :176): fine if they move to another game, noise if not.

### 6. Pantry: Nani's "pass me" can now be won by reading the pill
- `js/cook/mechanics/fetch.js:292`: the pass-me word is filtered by `Cook.labelMode(id) !== "text"` (the old word stage), but the jar's
  pill is now written by a different ladder, `Cook.chipWord` (`:173`, the pill ladder under the s14 look).
- Failure: a word at stage 2 or more whose pill is still written (fewer than three right picks in a row). Nani says "pass me X", no
  card shows it, and the child matches the written pill. The line's own comment forbids this ("you'd just match the letters"). Before
  the merge the pantry had no written labels, so the filter could not be wrong.
- Not run in a browser; the two ladders are read from the code (`js/cook/core.js:172`, `js/cook/station-lib.js:58`).

### 7. Pantry: the shelves' pills take the fridge's narrow slot
- `js/cook/mechanics/fetch.js:180` and `:187`: rows are grouped by y within 20 px. The fridge's levels (y 202, 416, 620) fall into the
  shelves' rows (199, 417, 626), and `slotW` is the row's smallest slot, 140, where the shelves have 200.
- Failure: any round with a fridge thing on a row: every shelf pill on that row is scaled and capped as if it stood in the fridge, so a
  long word narrows or the row's pills are smaller than on a row without one. The comment above says the opposite is intended.

### 8. Baking: the same amount stands at a different height for water
- `data/stations/baking.json:612-655` (`lineAtFor`): a cup is 0.55 for water and 0.613 for milk, flour, yoghurt and sugar; half 0.70
  and 0.754; one and a half 0.41 and 0.471. Both jugs are drawn 260 wide, about 240 tall, on one base.
- Failure: L2 plan 1, or L3 plan 3: "a cup of water" stops about 14 design px higher in the jug than "a cup" of anything else in the
  same round. The game teaches amounts by the jug's level, so the level should be one per amount.

### 9. Baking: salt left the recipe; three quarters has no word moment
- `data/stations/baking.json` plans: `spi-16` was a step in four old plans and is in none now (a decoy only). Zafar asked for the
  vague amounts to go, not the salt. To confirm with him (non-negotiable 1).
- `data/stations/baking.json:876-882`: `wordMoment.ids` has no `ph-cups-34`, so three quarters (L3 plan 1, L4 plan 1) is asked with
  no word moment, against CK-72's "each a word moment". `_pair` and `_measures` still describe L3 and the old jug's numbers.

### 10. Chop: the hop's clock can fall behind its schedule
- `js/cook/mechanics/chop.js:1067`: `hopTick(Math.min(beat, HK.rise / 3))`, while the round's clock two lines below still adds the whole
  `beat`. The comment just above it gives the reason the two were one clock ("a slow frame never keeps an item up past its place").
- Failure: a frame over 133 ms at L2 (150 ms at L1) on a slow phone: the item stays up longer than its hang, and the next hop is due
  while `up` is still full. Rare at real speed; regular at the test's speed 3 on a busy machine.

### 11. Eggs: the new hold can wipe the first control's own hold
- `js/cook/stations/eggs.js:925-935` with `js/cook/ui.js:750-753`: `refresh()` opens the first control, which sets its own hold;
  the next line releases the eggs' hold, whose `then` sets `callHold = null`, wiping the control's.
- Failure: a call queued after that moment and before the light is not held for it. The first call is still covered by
  `Coach.lightWait`, so this is a weak spot, not a seen fault. `stepFor(nextThing())` at `:926` is outside the `try`, so a throw there
  leaves the hold for the 4 s queue timeout.

### 12. Baking: "it's ready" is dropped where it has no voice
- `js/cook/stations/baking.js:684` (through `call`, `:618-626`): before, `say(line("ready", "call"))` always showed the line. Now it is
  said only if `Lang.hasVoice` is true.
- Failure: a build where "ready" has no clip and no device voice: the ring fills and the naan browns with no line from Nani. The test
  site is unaffected (device voice).

## Checked and found sound
- Every `assets/` path the diff adds exists (10 of 10); every full path in baking.json, chaat.json and corn.json exists; chaat's three new
  layers exist in `assets/cook/items/v4/chaat/`; `js/cook/grill-kit.js:49` already reads `grill-v2.webp`.
- Baking's twelve plans: every step is `amt: "jug"`, `units` matches its parts (1 cup 4, 2 cups 8, half 2, quarter 1, one and a half 6,
  two and a half 10, three quarters 3), the last part is the step's id, each id has a jug fill and picture, each units value has its
  English in `amountEn`. Levels: L1 a cup and a half; L2 adds two cups and a quarter; L3 adds three quarters and one and a half; L4 adds
  two and a half. The `levels` notes agree with the plans.
- The jug: taps of 5, 7 and 9 quarter cups (no line of their own) are placed between their neighbours (`baking.js:289-295`); the water
  picture is drawn to the brim, so one and a half cups of water shows.
- No hand-written Kutchi in any added code line; the Kutchi in baking.json is in notes (`_about`, `gaps`), not shown.
- No shared piece restyled: the pantry and baking use `Cook.Kit.chip` and `Shelf.pillScale` as chai does.
- `boil.js`'s new notes use names in scope (`note`, `o.rate`, `o.greenRate`, `lo`, `hi`); a log only, no change to daar or chai's heat.
- State: baking's `wet`, jug and pills, the pantry's `chips`, chai's gate are all made per round; pills are tracked (`Shelf.P.chip`).
- Eggs: `n.key` exists on every "egg" step; the two lifts have separate gate keys.

## Proof
- Diff read whole: `git diff 2656ecf03^1 2656ecf03 -- js data` (10 files, 553 lines added); HEAD differs from the merge only in
  `js/cook/index.js` and `data/lang/lexicon.json`.
- Assets: a shell loop over every `assets/…` path added by the diff and every one in the three station files, `[ -f ]` each.
- Plans: a node script over `data/stations/baking.json` (units against parts, fills, `amountEn`, manifest against use). No mismatch.
- Language engine, run in node from `js/core/lang/engine/index.js` with `data/lang/*.json`, `DoIt v.put-in` over each plan's parts:
  ok for `[1, ph-cup, x]` "Hakro cup atto wiji chad!", `[2, ph-cup, x]` "Ba cup atto wiji chad!", `[ph-half, x]` "Adh paani wiji
  chad!"; `ok: false` for a quarter, three quarters, one and a half and two and a half, so those take `Lang.toRecord`'s grey English.
  All four amount words are known to the lexicon (`ph-cups-34` since 9de6aea14), so no plan is skipped. "Adh paani" says half, with no
  "cup": for Mum.
- Jug pictures measured with PIL: jug-0 and jug-4 are 271x249, the four new jugs 323x301 (finding 8's heights).
- Findings 1 to 4 by reading the lines named; `grep -n '"seats"' data/cook.json`, `grep -n 'o\.ms' js/cook/coach.js` (no match),
  `grep -rn PAN-19 js data` (no match), `git log -- js/cook/flow.js js/cook/coach.js data/cook.json` (nothing from s19-clean-b).
- Not done: no browser run, no `node --test` file, no screenshots. Findings 6, 7, 10 and 11 are from the code alone.
