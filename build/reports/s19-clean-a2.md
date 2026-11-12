# s19-clean-a2: the pop-up as Zafar said it, the reviews' findings, the test player (12 Nov)

Opus, high. Branch `s19-clean-a2` (integration merged three times), never pushed. Flaws first.

## Flaws and open
- **Chai still crosses an asked-for row for an unasked spice** (after run, chai L3 740x320: Nana's elchi crossed; the driver added another spice). The shared part is in (`M.serveWrong(ids, dish, {for, unasked})` draws the unasked thing as its own crossed row), but chai and eggs must pass it: lines below, for s19-clean-d.
- **At 740x320 a five-row wrong card's words are small** (about 10 px, chai L3): the card zooms to fit its rows and the face, now 93 px, takes width. Contract-118 does not measure word size. Next: two columns of rows on short screens.
- **Not done:** SH-232, SH-152 (72 8, 99 1), SH-230 (105 5), SH-237 (107 3, corn), SH-249 (112 13), SH-60, SH-178 (79 2, chai), SH-251, SH-267's L1 pages (119 3: eggs 1, chop 2), contract-36 (12: baking 6, chop 3, chaat 2, chai 1). None fixed this round.
- **CHAI-111 not reproduced:** lab host, New player, a round, resize to 736x750, Play again, idle at the water: the hint came at 6.5 s (speed 3; speed 1 not tried).
- **SH-175:** the sandbox had the browser cache off (`route()`) and code `no-store`: redrawn cards refetched pictures (contract-104, 17 to 0), scripts loaded twice (46 repeats); fixed in `env.mjs`. Chai L3 930x430: 8.86 MB, 384 requests (baseline 8.71 MB, 355); its 37 s (baseline 26.7) was at load 26 on 4 cores. Re-baseline when quiet.
- **check-change not run** (38 steps, about 6 h); `checks.mjs` passed.
- **Missing Kutchi seen:** eggs' "boiled egg"; Nani's "Put water in the pan.", "Put the chai in the pan.", "Cook it the way they said.", "Serve (put it on the plate)!".

## What changed
- **The pop-up** (`js/shared/wrong-order.js`, `css/shared/order-card.css`): each right order's line comes to the middle, ticks with a ding, glows about 0.6 s, floats up (about 1.7 s a card); the open card grows to fill the middle ("big, central"); a fixed layer, so the card flies back into the panel uncut; row marks inside their rows; the asker's face at least 1.8 times the panel's; a tap hurries it past its lines; the stage's end takes it away; a long headline wraps before it shrinks. `NjgWrongOrder.pick`: only the people this serve judged (corn), a one-card game's row wrong now, never an old miss (maani).
- **Round one's review, 1-11:** farm's arrow fires again (`glowStays`: Cook only); tap to hurry; a child's row swipe kept to the next tick; the card light ends with its item; `o.undo` (chaat); Nani's help again after an action; the worked-on card first in a redo; the L1 dish card is the dish and its count (the engine's), no English.
- **Round-two review:** samosa L3-L4 writes each kind's count over its fillings ("ba samosa", the engine's); the serve's red marks end with the round (eggs); a first-time tap's finger is a tap, after its light.
- **Checks:** contract-118 judges each right line in the middle and the redo's focus; the pop-up's beats are shot (`c##-s19wo-*.png`); contract-94 lets a to-record placeholder be the sans face; contract-115 measures a main thing's set (sekelo's grill and trays); the test player taps a heat's green from the page, timing first (chai L3-L4 at 740x320 now end).

## Lines for s19-clean-d
- `chai-tray.js` check: `got.extra = p.extra ? pan.extras.includes(p.extra) : true;` and in place of the `serveWrong` line: `const unasked = pan.extras.filter((id) => id !== p.extra); if ((why.length || pan.salt) && UI.mission.serveWrong) UI.mission.serveWrong((bad.length ? bad : unasked.length ? [] : said.slice(0, 1)).map((r) => r.ids[0]), dish, { for: pan.who, unasked });`
- `eggs.js` check: after `let bad = ...`: `const unasked = want.filter((id) => !rows.some((r) => r.ids.includes(id)));` then `if (!bad.length && !unasked.length) bad = ...` (as now) and `if (UI.mission.serveWrong && (bad.length || unasked.length)) UI.mission.serveWrong(bad.map((r) => r.ids[0]), 0, { for: p.who, unasked });`
- `assemble.js` (chaat): move the recast's work (from `const keep` to `UI.mission.refresh();`) into `const undoWrong = async () => {...}`, pass `undo: undoWrong`, and start `recast` with `await undoWrong();`.

## Proof
- Pop-up in the games: `build/screenshots/sandbox/s19-clean-a2-after/cook-{chai-tray,eggs}-l3-serve-wrong/{740x320,1280x665}/c##-s19wo-{line,open,redo}.png`. contract-118: 0 breaks at both sizes (was 5).
- Contract, every kitchen flow L1-L4 at 740x320 and 1280x665 plus chai and eggs `#serve-wrong` (`s19-clean-a2-after`): 92 of 92 ends, 0 page errors, `CONTRACT FAILED: 163 breaks` (round one's after: 341, 89 of 92 ends). By check, round one to now: 118 5→0, 104 17→0, 109 1→0, 36 57→12, 115 33→5, 106 18→3, 107 14→3, 114 17→11, 72 12→8, 99 3→1, 116 4→1, 37 19→18, 111 14→23, 112 8→13. Left, by owner: 111 baking 18, chaat 4, pantry 1; 37 eggs 6, corn 3, chaat 3; 114 corn 9 (Zafar's cob), chop 2; 44 samosa 8, maani 3; 70 eggs 7; 117 eggs 6; 102 corn 5; 113 chai 4: the games' (s19-clean-d and the next round); 112, 72, 105, 79, 99, 119, 36: mine, open.
- Four sizes, L1 (`s19-clean-a2-contract`): 44 of 44 ends, 0 page errors, `CONTRACT FAILED: 44 breaks` (round one: 123): 111 16, 36 7, 119 6, 114 4, 109 2, 112 2, 106 2, 44 2, 11, 78, 117 one each.
- `checks.mjs`: all 12 steps ok (unit 108 files, 791 pass; load not run).
- Tests: `build/sandbox/s19-clean-a2.test.mjs` (8, browser: findings 1-7 and round two's 6; finding 5 red on the old code), `contract-wo.test.mjs` (10).
- No evidence rows in this brief (`rows: []`): no before or after folders.
