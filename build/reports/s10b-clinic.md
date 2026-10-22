# s10b-clinic

Branch `worktree-agent-aa7265b9513e659e2` (from `ccr-1888a520-dk18y7` at 3dae0f0), not pushed. Game code changed: yes.

## What was built
- **GIRL-01** `js/clinic/pipeline.js`, `data/clinic/pipeline.json`: the girl is the patient at every level. `kidsOnly.from` is 1; `P.waiting` and `P.patient` take `forceKind` (default `girl`; `boy`, `man`, `woman`, or `any`); the `flip["kind"]` crash is guarded. Test `build/test_shared_clinic_girl.mjs` (levels 1-4, 50 seeds): red before, green after.
- **DRILL-01** `tooth.js`, `tooth.json`: the drill keeps its drag but rests on the middle of the first cavity; cavities are bigger (radius 70, 51, 51, 34) with a dark outline; bur reach 23; the ghost starts in the cavity; the bot clears it in one stroke.
- **FX-01** `js/cook/stations.js`, `taste.js`, `boing.js`: `burst`, `puff`, `wisps`, `sparkle` and `steam` are no-ops (signatures kept), `special()`'s glint loop is off, the taste sparkle and boing mist are removed. Stars and hearts stay. Steam is my addition to the four named.

## Fix round (the judge's three FAILs)
- GIRL-01: calls were already unique (584 calls over levels 1-5 checked); the sheet hid the L3 call. Specs now film levels 1-3 with the voice line ("chokri in yellow", "short chokri") and the heal game.
- DRILL-01: the pale rectangle is baked into the mouth picture (also at base 3dae0f0), not my mask; `art.mouth.glint` patches it with the tooth's own surface, feathered. The stray mark under the step list is the card's sequence tip, not mine.
- FX-01: boing's stars and hearts removed too; grill re-filmed after each tap.

## Open
- GIRL-01, DRILL-01, FX-01 are left open for the judge. Sheets: `build/screenshots/evidence/s10b-ev/` (GIRL-01, FX-01), `s10b-ev3/` (DRILL-01); drill filmstrips `build/screenshots/s10b-clinic/drill-filmstrip-1366x768.png` and `-1480x924.png`.
- With the girl always the patient, "tap the girl" wins at level 1. That is Zafar's instruction; the leak bot has no such strategy.
- `checks.mjs` fails only `recordings` (the sheet predates the orchestrator's toothbrush line; not mine).
- 1480x924 is not a sandbox size; I added it at run time with a scratchpad wrapper.

## Proof
- `checks.mjs`: unit 494 pass, words, static, leak (19 configs), bump, specs, docs, fixlist, size, load ok.
- Sandbox `--contract`, 1366x768 and 1480x924: 8 flows, 16 pages, all reach their end, 0 page errors, 0 contract breaks (`s10b-ends`); waiting, taste, boing, chai-tray, grill: 10 pages, 0 breaks (`s10b-shots`).
- Tooth leak bot: fair 100%, blind under 10% at every level.
- Screens in `build/screenshots/sandbox/` (not committed). QA reviewer and the regression-row recheck are the orchestrator's `/review`.
