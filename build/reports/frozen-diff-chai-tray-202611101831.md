# chai-tray against its frozen run (202611101831)

`node build/tools/review/frozen.mjs --diff`: run `frozen-diff-chai-tray-202611101831` against `build/frozen/chai-tray/frozen.json` (frozen 2026-11-10T05:14, commit bd6cd3eb). **3 change(s) on 3 page(s)** over 30 pages.

| Page | What changed | Frozen | Now |
|---|---|---|---|
| cook:chai-tray#returning@740x320 | a new contract break | - | contract-92 |
| cook:chai-tray@L3#returning@740x320 | a new contract break | - | contract-92 |
| cook:chai-tray@L4@1280x665 | a new contract break | - | contract-99 |

A changed page is filmed for the judge: `NJG_VIDEO=<dir> node build/sandbox/run.mjs --flow <flow> --sizes <size> --run-id <id>` (films in the run's films/).
