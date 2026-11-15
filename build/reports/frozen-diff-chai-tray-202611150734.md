# chai-tray against its frozen run (202611150734)

`node build/tools/review/frozen.mjs --diff`: run `frozen-diff-chai-tray-202611150734` against `build/frozen/chai-tray/frozen.json` (frozen 2026-11-14T16:40, commit c618c23e). **8 change(s) on 7 page(s)** over 38 pages.

| Page | What changed | Frozen | Now |
|---|---|---|---|
| cook:chai-tray@L4@740x320 | a new contract break | - | contract-129 |
| lab:cook/chai-tray@L4#child@740x320 | a new contract break | - | contract-129 |
| lab:cook/chai-tray@L4@740x320 | a new contract break | - | contract-129 |
| cook:chai-tray#mistake@740x320 | a sound: never seen before | - | sfx/cook-right |
| cook:chai-tray@L3#hint@1280x665 | a game note: never seen before | - | card-light |
| cook:chai-tray@L3@1280x665 | a game note: never seen before | - | card-light |
| lab:cook/chai-tray@L3@740x320 | a state: never seen before | - | chai-tray-view-null |
| lab:cook/chai-tray@L4#child@740x320 | a state: never seen before | - | chai-tray-view-null |

A changed page is filmed for the judge: `NJG_VIDEO=<dir> node build/sandbox/run.mjs --flow <flow> --sizes <size> --run-id <id>` (films in the run's films/).
