# s08-w1-voice: one speech queue and one help ladder (19 Oct 2026)

Builder's report (Sonnet): the orchestrator judges, not me. Branch `worktree-agent-a04a5fe4ff35805f2` (base 820aa00a), not pushed. Every spoken Cook line now waits its turn in one queue; an item's name on a tap is said only when nothing speaks; help (Nani's word and the glow together) comes only after 7, 8, 11 or 15 s without any action, and both bulbs pulse at 17 s. Five new contract checks were written first and failed on the old code (90 breaks over ten pages), then passed on this branch.

## Flaws and what is not done (first)

| # | Flaw | Where |
|---|---|---|
| 1 | LNG-09's 700 ms wait is not trimmed; only the device voice's rate (0.7 to 1.0) is done | `js/cook/ui.js` `Cook.wait(700)` beside `queued(...)`: wave 1B's file |
| 2 | Eye checks not done: I saw the knob's gold ring in one shot, not both bulbs pulsing, not the glow beside the tick, no phone size | `build/screenshots/sandbox/green2/cook-chai-tray-speed1/1366x768/07-help-open.png` |
| 3 | Proof is thin: 22 pages at 1366x768, six stations. Not run: sekelo, tadka, stir, chop, assemble L1-L3, daar L1/L4, shotdiff. `touched.mjs` names 84 flows (about 133 min); the 324 rows were not rechecked | left to `/review` |
| 4 | Outside my files, left: `labs.html` Cook tiles still default guided; `stations.js` `step()` and `glowDraw()` are now unused by the stations (replaced in `begin`), delete them; the pop-up reads each order part twice before chai-tray L3; "Shabash!" twice at the serve | `js/cook/main.js:157`, `stations.js`, `ui.js`, `flow.js:916-919` |
| 5 | Not touched: DAAR-26 (stir sentence waits on Mum), DAAR-27 (lap at 0.92 of a turn), the clinic's own `Kit.Voice` queue (only its tap count: not said over a line); the wave-2 step call is a hook, `stepper({call})` | |
| 6 | Mum's gaps, never hand-written: *muke*, *khape*, *pela*, *ne poi*, *trae* have no clip (the device voice says them on the test path only); *ba* is the device's "ber"; the engine's grey "with" is never spoken | `data/lang/` |
| 7 | contract-24 skips a help that follows a hold, drag or stir (the probe sees where it began); contract-22's cut check runs on `#speed1` flows only | `contract.mjs` |
| 8 | CK-45's contract-21 break is gone; I did not find which line fixed it (the queue or the glow gate) | judge it |

## What changed

| File | Change |
|---|---|
| `js/core/voice.js` | one queue per channel (`queue`, `ifIdle`, `key`, `ttl`); a stop clears it; device voice rate 1.0, waits 180 ms after a cancel (LNG-16) |
| `js/cook/words.js` | every Cook line queued; `Lang.popWord` (never L3-L4, a word again after 10 s); counts: newest wins, a late one is dropped; chips tagged `hear`; turns logged |
| `js/shared/guide.js` | the ladder from the page's last action; nothing at a step's open; a line not said twice within 10 s; bulbs pulse |
| `js/cook/station-lib.js` | guided only at L1-L2; shared step engine; glow gate (every glow waits); glow token; `addLine` is one DoIt sentence |
| `css/cook.css`, `data/cook.json` | glow token and pulse; `calm.helpMs`, `repeatMs`, `bulbPulseMs` |
| stations, `heal/host.js` | pops use `popWord`; samosa's step per filling; the clinic's tap count only when no line is said |
| `contract.mjs`, `regressions.mjs` | contract-22 to 26 and their rows; 22 new tests |

## Proof (red on 820aa00a, green on this branch; sandbox 1366x768)

| run | pages | before | after |
|---|---|---|---|
| chai, chai-tray L3, samosa, daar, chaat L4, maani-line | 6 | 57 breaks (22: 4, 23: 2, 24: 35, 26: 16) | 4 (24: clock started too early, fixed); green2: 0 over 12 pages |
| chai-tray and samosa at a child's pace, chai-tray and chai `#mistake` | 4 | 33 (21: 1 = CK-45, 22: 11, 24: 13, 25: 1, 26: 7) | 0 |

`checks.mjs`: unit 359 pass, words, static, leak, bump, specs, docs, size pass; loadcheck 29/29.
