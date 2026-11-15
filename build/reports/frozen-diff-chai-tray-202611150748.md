# chai-tray against its frozen run (202611150748)

`node build/tools/review/frozen.mjs --diff`: run `frozen-diff-chai-tray-202611150748` against `build/frozen/chai-tray/frozen.json` (frozen 2026-11-14T16:40, commit c618c23e). **10 change(s) on 9 page(s)** over 38 pages.

| Page | What changed | Frozen | Now |
|---|---|---|---|
| cook:chai-tray#hint@740x320 | a sound: never seen before | - | sfx/cook-right |
| cook:chai-tray#mistake@740x320 | a sound: never seen before | - | sfx/cook-right |
| cook:chai-tray@L2@740x320 | a sound: never seen before | - | family/mum/khun.mp3 |
| cook:chai-tray@L3#hint@740x320 | a sound: always there before, missing now | sfx/cook-right | - |
| cook:chai-tray@L3#returning@740x320 | a sound: never seen before | - | family/mum/chulo.mp3 |
| cook:chai-tray@L3#returning@740x320 | a sound: never seen before | - | family/mum/bar.mp3 |
| lab:cook/chai-tray#child@1280x665 | a state: never seen before | - | chai-tray-view-null |
| lab:cook/chai-tray@L4#child@740x320 | a sound: always there before, missing now | family/mum/dudh.mp3 | - |
| lab:cook/chai-tray@L4@740x320 | a game note: never seen before | - | card-light |
| lab:cook/chai-tray@740x320 | a sound: always there before, missing now | sfx/cook-right | - |

A changed page is filmed for the judge: `NJG_VIDEO=<dir> node build/sandbox/run.mjs --flow <flow> --sizes <size> --run-id <id>` (films in the run's films/).
