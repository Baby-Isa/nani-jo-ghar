# s18-chai: chai's owner (Sprint 18, wave 1), first pass

Opus, high. Cost so far about $8 (reading, five short sandbox plays, the lab shells). No chai code changed yet.

## What landed

| Commit | What |
|---|---|
| a39bccd0 | The lab shells: `lab/kitchen-kit.html` shows every `lab/sections/kk-*.html` (kk-stove, kk-pan-pour named; any other a local listing finds, or `?also=`), `lab/kit.html` one loader for `lab/sections/kit-*.html` (kit-order, kit-shelf, kit-lights, kit-serve), each section in its own frame, a section not written yet says so; `?only=<name>` shows one; linked from `labs.html`. Loaded at 1280x665 and 740x320: 0 errors, no sideways scroll (a temporary test section, removed). |

## CHAI-105: chai is right; contract-96 reads too late (a check fix for the orchestrator)

Reproduced (`cook:chai-tray@L3#returning`, 1280x665, run `s18-chai-b2`, data kept): nana's pot boils over at 35.4 s, starts again at 36.0 s with **0 of 5 rows ticked** (the panel sample at 36.0) and the row gliding home (304 px, then 0 by 36.4 s). At 36.5 s the player puts the water back in, which ticks one row; contract-96 takes the *last* sample of its 1.5 s window, so it sees that new tick as "still ticked". Same pattern on `@L4#tap-mid-order` (run `s18-chai-c1`, five restarts). `@L3#boil-over` is green.

**The exact change to `build/sandbox/lib/contract-s17.mjs` check96** (the orchestrator owns it): inside the loop, after `const t = ...`:

```js
const back = life(tl, "chai-add").find((x) => (x.at || x.t) > t && String(x.by || "").split(":")[0] === who);
const end = Math.min(t + REOPEN_MS, back ? (back.at || back.t) - 1 : Infinity);
const rowsIn = (to) => panels.filter((e) => e.t >= t - 1 && e.t <= to).map((e) => (e.rows || []).find((x) => x.who === who)).filter(Boolean);
const open = rowsIn(end), win = rowsIn(t + REOPEN_MS);
if (!open.length) continue;
if (!open.some((x) => x.done === 0)) { add("contract-96", t, `${who}'s pot started again after boiling over and its rows never all opened before anything went back in`); return; }
if (!win.some((x) => x.sl <= 2)) { add("contract-96", t, `${who}'s pot started again after boiling over and its card never came back to its first item within ${REOPEN_MS} ms`); return; }
```

(replacing the `let p` loop and the two `row.` breaks). Applied to both runs: green; a pot whose rows stay ticked still breaks. Row CHAI-105: "chai right, check fixed" once it lands.

## CHAI-106: a skip keeps the lesson already; the missing light was the player's pace

Decided: a skip keeps the lesson. It already does: the plain `@L4` play skipped the order too (skip-zone at 25.9 s) and logged `card-light` 1.6 s after nana's tea. In `@L4#tap-mid-order` no light: after every tea the player moved on within 0.5-1.0 s, and the station's rule (CHAI-37, the 30 Oct film; SH-178 re-arms at each pan's tea) skips the pointer for a child already on the next thing. contract-90 holds the same rule (a pause of 2.5 s after the first item). No chai change.

**contract-90's widening (`build/sandbox/lib/contract-chai.mjs` check90):** drop `/@L[2-9]/.test(f) ||` from the first line, and the message's "at L1" becomes the flow's level. Row CHAI-106: "decided, not a bug: pace" once it lands.

## Waits

- **CK-60**: (e)'s `KIT-READY (e): CK-60` is not on the integration branch yet; then contract-95 on take-back and returning at 1280x665 and 740x320.
- **The re-freeze** after CK-60 (so the frozen run holds it).
- **Switches** (a) to (e): none landed.

## Seen on the way (not mine)

- `@L4#tap-mid-order`: ma's pot boiled over five times (the player's late tap in L4's short green, CHAI-58); contract-99 broke once (ma's card 13 px above the panel's top after nana's card folded; SH-232, kit builder e's panel).
