# chai-tray against its frozen run (202611080227)

`node build/tools/review/frozen.mjs --diff`: run `frozen-diff-chai-tray-202611080227` against `build/frozen/chai-tray/frozen.json` (frozen 2026-11-07T20:06, commit 5403dd80). **4 change(s) on 2 page(s)** over 30 pages.

| Page | What changed | Frozen | Now |
|---|---|---|---|
| cook:chai-tray#mistake@740x320 | a sound: always there before, missing now | sfx/file:glass-c | - |
| cook:chai-tray#mistake@740x320 | a sound: always there before, missing now | sfx/glass | - |
| cook:chai-tray@740x320 | a sound: never seen before | - | sfx/file:glass-c |
| cook:chai-tray@740x320 | a sound: never seen before | - | sfx/glass |

A changed page is filmed for the judge: `NJG_VIDEO=<dir> node build/sandbox/run.mjs --flow <flow> --sizes <size> --run-id <id>` (films in the run's films/).
