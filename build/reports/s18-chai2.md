# s18-chai2: chai's owner, second session (Sprint 18, wave 1)

Opus, high. Zafar's decision 5 for this run: no BEFORE run, no evidence --before; proof by `frozen.mjs --diff` and contract runs.

## 1. The last glass's ring on `#mistake` 740x320 (the pan switch's diff)

Replayed three times before and after the pan switch (030077eb: 0, 1, 1 rings; 3338b26f: 0, 0, 0; all six ended, contract passed):
**a flake on the old code too**. The drop lands as the tick's praise starts; `js/shared/sfx.js` gates long effects (glass-c,
1228 ms) under a family voice, so whichever starts first wins. Logged as CHAI-107 (fix options for Zafar there).

## 2. Switches

| Switch | Commit | Frozen diff | Verdict |
|---|---|---|---|
| (b) pieces 6-8: the shelf pour and spoon, pan into glass and take-back, serving | d4ec4236 | `build/reports/frozen-diff-chai-tray-202611072039.md` | **No change** over 30 pages |
| (c) pieces 9-12: the shelf slots, word pills, the word pop (third session) | 39d520da | `build/reports/frozen-diff-chai-tray-202611072132.md` | **No change** over 30 pages (7 one-off changes on the first play, none again on the re-play) |
| (d) pieces 13-14: lights and lessons | (this commit) | `build/reports/frozen-diff-chai-tray-202611072153.md` | **5 changes on 3 pages, all explained** (below) |

**(b) pieces 6-8**: `Mech.pour`, `.spoon`, `.toGlass`, `.takeBack`, `.unspoon`; `NjgServe.faces` and `.round`; the glass frames
read from `data/stations/chai-tray.json` `kit.glass` (checked equal). `build/test_shared_sfx_files.mjs` lists `js/cook/mechanics/pour.js`.

**(c) pieces 9-12** (third session; chai-tray.js about 90 lines fewer): the slots are `Shelf.slots(shelfIds, {span, view, pitch,
groupGap, pillRoom})`; the pills' floor, gap, room and row scale `Shelf.pillWant`, `.pillGap`, `.pillRoom`, `.pillScale`; each pill
`Shelf.P.chip(S, x, CHIP.y, word, {word, depth, shade, onTap})` with `chip.face(word, cap)` and `chip.hit(slotW)` (chai's chipFace,
pillHit, PILL_* and its speaker wrapper gone); the word pop `Juice.P.pop` placed by `Juice.popAt` (hob edge, the count badge).
Chai keeps its old card shadow (40, 25, 10: `shade`). The test hook `Cook.chaiPills` reads `chip.parts`. Count pills: chai draws
none (the count badge is ui.js's, `UI.tallyAt`). The decoys and size classes already go through St's wrappers onto `Shelf`.

**(d) pieces 13-14** (about 490 lines fewer): `gate14 = Cook.Coach.firsts("chai-tray", {round})` for fresh14, first14 and the
lessons' dueAll/spendAll; light14, movingNow14, settled14, sideMoving gone; the control's call and light `Cook.Coach.control`, a
wrong move `Cook.Coach.wrong()`; the answer's gate `Cook.Coach.rungs(..., {word, answer, study})`; the next pan
`Cook.Coach.nextLight`; the card light `Cook.Coach.cardLight` with `Cook.Coach.itemCard`; the lessons `Cook.Coach.lessons`. The
`lightHelpArrow` block is gone from showCallout. The diff's changes: the glass ring on `#takeback` 740x320 (missing) and L1 740x320
(new) is CHAI-107's race; the boil-over puff on L3 `#returning` 1280x665 (the tester missed the green on Nana's pan while on the
cousin's) happens on the old code too (replayed at 14710163: puff at 34 s, "Slow kar" 0.9 s before), a variation the freeze missed.

## What waits

(e) people say their orders and the timings. Static check: "4 known ones are
fixed" (`checks.mjs` static `--write-known` would shrink its list; build/tools is not mine).

## Proof

- Unit: kitpan, kitpour, serve, sfx calls, sfx files, cook harness, rules, word card: pass (test_cook_mount fails before and after).
- `checks.mjs --only static,words,load`: words ok (0 literals), static ok (0 new), load ok (29/29).
- After (c): unit shelf, cook harness, smoke, sfx files pass; `checks.mjs --only static,words,load` ok (0 new, 0 literals, 29/29);
  frozen diff `frozen-diff-chai-tray-202611072132.md`, **no change**.
- After (d): unit cook harness, smoke, onboard lights pass (cook mount fails before and after); static, words, load ok; frozen diff
  `frozen-diff-chai-tray-202611072153.md` (above). Outside my files: rules.js `R.lightHelpArrow` and rules.json's flag (kit d's list).
- Frozen diff after (b): `frozen-diff-chai-tray-202611072039.md`, **no change** (13 one-off changes on the first play, none again).
