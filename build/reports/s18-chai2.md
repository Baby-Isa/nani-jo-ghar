# s18-chai2: chai's owner, sessions two to four (Sprint 18, wave 1)

Opus, high. Zafar's decision 5 for this run: no BEFORE run, no evidence --before; proof by `frozen.mjs --diff` and contract runs.

## 1. The last glass's ring on `#mistake` 740x320

Three replays each side of the pan switch (030077eb: 0, 1, 1 rings; 3338b26f: 0, 0, 0; all ended, contract passed): **a flake on
the old code too**. The drop lands as the tick's praise starts; `js/shared/sfx.js` gates long effects under a family voice, so
whichever starts first wins. CHAI-107 (fix options for Zafar there).

## 2. Switches

| Switch | Commit | Frozen diff | Verdict |
|---|---|---|---|
| (b) pieces 6-8: pour, spoon, glass, take-back, serving | d4ec4236 | `frozen-diff-chai-tray-202611072039.md` | **No change** over 30 pages |
| (c) pieces 9-12: shelf slots, word pills, word pop | 39d520da | `frozen-diff-chai-tray-202611072132.md` | **No change** over 30 pages |
| (d) pieces 13-14: lights and lessons | 450c4ec6 | `frozen-diff-chai-tray-202611072153.md` | **5 changes on 3 pages, all explained** |
| (e) pieces 15, 18: the order's flow | (this commit) | `frozen-diff-chai-tray-202611072216.md` | **1 change on 1 page, explained** |

**(b)**: `Mech.pour`, `.spoon`, `.toGlass`, `.takeBack`, `.unspoon`; `NjgServe.faces`, `.round`; glass frames from the data's `kit.glass`.

**(c)**: `Shelf.slots(...)`, `Shelf.pillWant/.pillGap/.pillRoom/.pillScale`, each pill `Shelf.P.chip(...)`; the word pop
`Juice.P.pop` at `Juice.popAt`. Chai keeps its old card shadow (`shade`). Count pills: the badge is ui.js's `UI.tallyAt`.

**(d)** (about 490 lines fewer): `Cook.Coach.firsts`, `.control`, `.wrong`, `.rungs`, `.nextLight`, `.cardLight` with `.itemCard`,
`.lessons`; `lightHelpArrow` gone. Diff: the glass ring (CHAI-107) and an L3 `#returning` boil-over puff that the old code makes too.

**(e)**: chai's people say their orders through `UI.personSay(pan.who, {obj: pan.face, rows, line: () => personLine(L(), pan.who,
rows), hide: St.hideKnown(ctx)})` (the start: `UI.peopleSay`; a face tap: `UI.hearPerson` with chai's replay-help as `onHelp`; the
recast and the right way shown: `UI.personSay`). Chai's own `personSay`, its talk motion, its `speaking` flag and `speakGapMs`
(data, 300 = `OrderCard.TIMES.speakGap`) are gone; the gap is the kit's. All values equal. Two small differences, both the
kit's: a replay now also waits during a recast or the right way shown (`UI.personSpeaking`), and the fallback line is not said
once the round has moved on (`Cook.run`). Chai's other waits (pour, end, shelf glow) are not order times. The diff's change: `card-light` on L3 740x320, came again on the re-play. Six more L3 740x320 plays: before (c02b0278) 1 of 3,
after 1 of 3, each time on the slow (60 s, not 37 s) play, when the tester stays still long enough after the tea (the frozen plays
were quick). A variation, not the switch.

Also: `build/test_shared_rules.mjs` asked chai for `RULES().pointMs()`, which (d) moved to the kit's coach; the test now asks
`js/cook/coach.js`.

## What waits

Static: "4 known ones are fixed" (`--write-known` would shrink its list; build/tools is not mine). Kit e's notes for the checks'
owner (check95, check96).

## Proof

- After (b): unit kitpan, kitpour, serve, sfx, cook harness, rules, word card pass (cook mount fails before and after); static,
  words, load ok; frozen diff no change.
- After (c): unit shelf, cook harness, smoke, sfx files pass; static, words, load ok; frozen diff no change.
- After (d): unit cook harness, smoke, onboard lights pass; static, words, load ok; frozen diff above. Outside my files: rules.js
  `R.lightHelpArrow` and rules.json's flag (kit d's list).
- After (e): `checks.mjs --only unit,static,words,load`: unit fails only the three art-block tests (no `sources/`), static 0 new,
  words 0 literals, load 29/29; frozen diff above (7 of 8 first-play changes not again); the six L3 plays all ended, contract
  passed.
