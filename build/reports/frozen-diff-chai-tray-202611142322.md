# chai-tray against its frozen run (202611142322)

`node build/tools/review/frozen.mjs --diff`: run `frozen-diff-chai-tray-202611142322` against `build/frozen/chai-tray/frozen.json` (frozen 2026-11-14T16:40, commit c618c23e). **4 change(s) on 4 page(s)** over 38 pages.

| Page | What changed | Frozen | Now |
|---|---|---|---|
| cook:chai-tray#mistake@740x320 | a sound: never seen before | - | sfx/cook-right |
| cook:chai-tray#returning@1280x665 | a sound: never seen before | - | sfx/cook-right |
| cook:chai-tray#returning@740x320 | a sound: never seen before | - | sfx/cook-right |
| lab:cook/chai-tray@L2@740x320 | a state: never seen before | - | chai-tray-view-null |

A changed page is filmed for the judge: `NJG_VIDEO=<dir> node build/sandbox/run.mjs --flow <flow> --sizes <size> --run-id <id>` (films in the run's films/).
