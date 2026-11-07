# s18-kit-d: lights and lessons (the shared kit)

Sprint 18, wave 1, kit builder (d). Module map pieces 13 (lights) and 14 (reveal lessons), in `js/shared/onboard.js` and
`js/cook/coach.js`. Opus, high. Every existing call keeps working (added, not changed); chai is not touched.

## What landed (commit, call)

| Commit | Piece | A game calls |
|---|---|---|
| e1b24ef2 | The timed light, the zoom-in, the stage's stillness (STD-D1-05, -06) | `Onboard.light(el, {ms, onTap, quitIf, note})` (handle.done), `Onboard.zoomBox`, `Onboard.pageMoving()`, `Cook.Coach.mover(o)`, `Cook.Coach.settled(o)` |
| 0d0bd5e7 | The first time (STD-D1-01) | `Cook.Coach.firsts(key, {round})` -> `gate.first(k)`, `.due(k, all)`, `.spend(k, all)`, `.spent(k, all)` |
| 7b087e41 | The stuck rungs, the call with its light, a wrong move rushes the hint, no hint past support (STD-D1-06, D2-01, D2-04, D2-05) | `Cook.Coach.control(o)`, `Cook.Coach.wrong()` (`Onboard.rush()`), `Cook.Coach.rungs(key, step, {word, answer, study})` |
| 8f2b7067 | The next vessel, the order card's light (STD-D1-10, D1-07) | `Cook.Coach.nextLight(o)`, `Cook.Coach.cardLight(o)`, `Cook.Coach.itemCard(id, who)` |
| 9e061108 | The reveal lessons (STD-D1-08) | `Onboard.lesson(kind, sel, o)`, `Cook.Coach.lessons({gate, ctx, busy})` |
| 284e4766 | The lab section, two kit comments without a game name | `lab/sections/kit-lights.html` (iframe-safe; `?state=<name>&speed=N`) |

## For chai's owner (the switch; chai's lines today)

- `light14` (351-391) -> `Onboard.light(el, {look, pad: 4, pass: true, ms, onTap, quitIf, note: "chai-tray:s14-light"})`; `.then` -> `.done`.
- `movingNow14`, `settled14` (392-432), `sideMoving` -> `Cook.Coach.mover({busy})` / `({busy, helper: true})`, `Cook.Coach.settled({busy})`.
- `fresh14`, `first14`, `dueAll`, `spendAll` -> `const gate = Cook.Coach.firsts("chai-tray", {round: new Set()})`.
- coachStep's control branch -> `Cook.Coach.control({key: "chai-tray", target, also, round, first, pauseMs, hintMs: hintMs14, current: () => rungKey === sid && !finished, busy, noHint: phase === "slow", onLight: () => helpGlow(obj), onHint})`; `rushHint14 = true` -> `Cook.Coach.wrong()`.
- the answer's gate (`answer && !(guided || redo || supported)`) -> `Cook.Coach.rungs(..., {word: cur.id, answer, study: guided || redo})`.
- `nextPanLight`/`nextPanSoon` -> `Cook.Coach.nextLight({target, ok, quitIf, who, note, now})`.
- the card light (2511-2627) -> `Cook.Coach.cardLight({item: () => Cook.Coach.itemCard(pid, sel.who), quitIf, busy, endIf, step, note, onLit})`.
- the lessons (2946-3206) -> `await Cook.Coach.lessons({gate, ctx, busy: () => busy || spoons14 > 0})`.

## lightHelpArrow (off since 29 Oct): exact changes in files I don't own

1. `js/cook/stations/chai-tray.js` showCallout: delete the `if (RULES() && RULES().lightHelpArrow && ...) { ... }` block and its two
   comment lines, leaving `UI.helperOpen(true, { by: "hint" }); return;`.
2. `js/shared/rules.js:169`: delete `R.lightHelpArrow = () => sec("showing").lightHelpArrow === true;` (safe before 1: chai guards it).
3. `data/rules.json` "showing": delete `"lightHelpArrow": false` (and the comma before it) and the `_about` sentence "lightHelpArrow
   (Zafar, 29 Oct: ...): false, the helper card just opens." The docs' mentions are history; they stay.

## Proof

- Unit: `node --test build/test_shared_onboard_lights.mjs`: 10 pass (times, zoom box, first-time gate, hint clock and rush, past
  support, Cook's gate, rungs, the call with its light, the wrong move, the next vessel); `build/test_shared_ui.mjs` 8 pass.
- `checks.mjs --only static,words,docs`: all ok. `--only unit`: 708 pass, 3 fail, all art-block tests (build/tools/ops), untouched here.
- The lab section (`lab/sections/kit-lights.html`, 14 states): at 1280x665 and 740x320, 0 page or console errors, a light drawn in
  every state that has one, no sideways scroll; strips are the evidence tool's (`?state=<name>`).
- Chai's contract run, 1280x665 (the shared parts it already uses: the spot's zoom, the light, the stuck rungs, the order card's
  point): `CONTRACT PASSED: 0 breaks over 1 pages` (end reached, 0 page errors). The run folder is deleted (shared disk).

## Waits

Chai's switch (chai's owner); the lightHelpArrow deletion (above); the loader in `lab/kit.html` (chai's owner: an iframe).

Cost: about $20-25 (one contract run, two lab runs).
