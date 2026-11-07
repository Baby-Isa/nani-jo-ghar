# s18-kit-e: the order's flow and timings, people saying their orders (the shared kit)

Builder (e), Sprint 18 wave 1, 7 Nov 2026. Opus, high. Sole owner of `js/cook/ui.js` for the run.

## What landed (each its own KIT-READY commit)

| Commit | Piece | The call |
|---|---|---|
| 2377fa3d | CK-60 | the request pop-up's `onFold`: the order lands once, as its pop-up starts to fold (`introduceAlong`'s `landAll`) |
| d1be6b5e, 87e239f4 | SH-234 | `--njg-itpad` = `max(calc(var(--njg-px) * 4), 2.6cqi)` (both looks of the item card) |
| 7cdbde32 | kit (c)'s ask | `Tally.label(n, {level, word})`, `Tally.place(el, host, x, y, {anchor})` from `tallyLabel` / `placeTally` |
| 3ee1fbe3 | piece 15 | `OrderCard.TIMES` (one frozen table, ms at speed 1), read by ui.js as `UI.mission.times` and by flow.js's order |
| 74a32d7b | piece 18 | `UI.personSay(who, {obj, rows, line, hide})`, `UI.hearPerson`, `UI.peopleSay`, `UI.personSpeaking` |
| a3660c7a | DAAR-36 (orchestrator's ask) | `O.ladder`: on `Rules.noLast()` the "no" rows go at the end of the last group |
| (this commit) | lab | `lab/sections/kit-order.html` (`?state=said|skip|ticks|again|bubbles`, `?speed=N`; `window.KitOrder`) |

Pieces 16 (side panel) and 17 (bubbles) stay where they are (`UI.step`, `UI.helperOpen`, `UI.say`, `Lifecycle.bubble.place`); the
order section of ui.js now lists the order's calls.

## What was found

- **CK-60:** the ui.js guards (s17) were in. What still broke contract-95 was a race: the station starts as the pop-up starts to
  fold (CK-48) while the order's landing and its `order-skip` note came after the card's flight (260-700 ms), so the first step
  could open before the skip was logged. Now `order-skip` is 0-3 ms after the tap and the first step-open 370-4200 ms after.
- **CHAI-105 is not a game bug in its reproduction** (L3 returning, 1280x665): `UI.mission.reopen` cleared nana's rows (+110 ms) and
  the row glided home (+440 ms); the player put water in at +928 ms and that one tick is what contract-96 read at 1.5 s. The check
  should stop its window at the person's next `chai-add` after the restart (`build/sandbox/lib/contract-s17.mjs` check96). No new
  untick call is needed.
- **contract-95's own skip test** (`contract-s14.mjs` check95) reads `n.reason || n.by`; the hook sets `reason` to the zone, so
  `skipped:1` is never seen and only `order-skip` counts. Suggest `/skipped:1/.test(n.by || "")`.
- **daar@L2:** contract-95 (its chop station opens no step, so Nani's chop call counts as before the first step) and contract-98
  are daar's own, for its wave-2 owner.
- `M.open` still names chai (`recipe === "chai"` for the shelf jars, the s14 look, the type): STD-F1-02, for a game setting.

## Proof

- Contract runs (0 breaks, every end reached, 0 page errors): chai #takeback, #returning, @L4 at 1280x665 and 740x320 (CK-60);
  chai, daar, fetch (tally); chai, #takeback, daar, day1 (piece 15); chop@L2, chai (DAAR-36; chop said "dungri na" last).
  The brief's run, `cook:chai-tray` at 740x320, 930x430, 1280x665, 1920x1080: "CONTRACT PASSED: 0 breaks over 4 pages".
- Probes in the page (no pictures): piece 18 at 1280x665 and 740x320; every recipe's ladder 60 times a level, "no" rows last.
- The lab section at 1280x665 and 740x320: every state, no errors, no sideways scroll, item padding 4.6 px at 740x320.
- Checks: static, words ok; unit fails only the art-block tests (this worktree has no `sources/`).
- No BEFORE run and no evidence --after (Zafar's decision 5, 7 Nov).

## What waits

- Chai's owner: switch chai's `personSay`/`hear`/start loop to `UI.personSay(pan.who, {obj: pan.face, rows, line: () =>
  personLine(L(), pan.who, rows), hide: St.hideKnown(ctx)})`, `UI.hearPerson`, `UI.peopleSay`; load this section in `lab/kit.html`.
- The checks' owner: check96 and check95 above. values.md "item padding floor": tokenised (`--njg-itpad`).

## Cost

About $25 (Opus, high).
