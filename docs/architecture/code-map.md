# Code map: how the code is laid out

As built on 6 Oct 2026. The model behind it is `target-model.md`; the module APIs are `shared-api.md`; how to build a new game from these parts is `building-games.md`. A static web app: no server, no bundler; pages load ES modules through an import map that `build/bump_version.py` writes and stamps (B7).

## Pages (repo root, `lab/`)

| Page | What it is |
|---|---|
| `index.html` | the house (the hub; `js/home.js`, `css/home.css`) |
| `first.html` | first launch: make your character, a pantry round, the story hook (`js/first.js`) |
| `cook.html` | Cook's own page: title, story days, shop (`js/cook/page.js`); it mounts the Cook plug-in |
| `clinic.html` | the clinic's page: labs, one patient, a morning (`js/clinic/main.js`) |
| `find.html`, `tidy.html`, `who.html`, `dress.html`, `monsoon.html`, `snap.html` | the parked modes, still classic-script pages |
| `lab.html` | the plug-in lab: `lab.html?mode=<id>&game=<game>&level=<n>` or `&play=story` or `&play=free`; one stage or a whole plan on the test site |
| `labs.html` | **generated** by `build/gen_labs.mjs` from every mode's `lab()` list; never hand-edited |
| `lab/*.html` | developer pages: the kit's states (`kit.html`), component galleries, `family-audio.html` (where Zafar marks clips OK or ??), clinic heal hosts |

## `js/`

| Folder | Holds |
|---|---|
| `js/core/` | the engine core: `save`, `progress`, `score`, `wallet`, `voice`, `context`, `unlocks`, `settings`, `content`, `log`, `env`, `types`, `index` (`loadCore()`); `lang/index.js` (the language seam) and `lang/engine/` (linearizer, clip planner, gap reporter, data validator). No drawing; runs in the browser and Node |
| `js/shared/` | the framework: `frame`, `stage`, `fit`, `guide`, `bulb`, `order-card`, `buttons`, `tally`, `results`, `onboard`, `focus`, `say`, `speech`, `character`, `charmaker`, `story`, `app` (the shell), `conversations` (built, not wired), `family-voice`, `sfx`, `uistore`; **`host`, `mode`, `input`** (the plug-in contract); legacy for the parked modes: `stars`, `whichone`, `rel`, `overlay`, and the old `save.js` |
| `js/cook/` | Cook as a plug-in: `main.js` (the mode object), `mount.js` (mount/unmount in an element), `ns.js` + `index.js` (one namespace, modules in load order), `life.js` (timers and listeners, ended at unmount), `page.js` (title, days, shop), `words.js` (the engine glue), `stations/`, `mechanics/`, `kitchen-kit.js`, `order.js`, `recipes.js`, `core.js`, `ui.js`, `art.js`; `lang.js` stays only for the parked pages |
| `js/clinic/` | the clinic as a plug-in: `main.js`, `stages/` (waiting room, diagnosis, pharmacy, heal, send-off), `heal/` (the heal host, registry and the 12 games in `heal/games/`), `lang.js` (the engine glue), `pipeline.js`, `figure.js`, `body.js` |
| `js/demo/` | the plug-and-play demo (two adapters, no mode files touched) |
| `js/find/`, `tidy/`, `who/`, `dress/`, `monsoon/`, `snap/` | the parked modes |
| `js/vendor/` | Phaser (Cook only) |
| `js/first.js`, `home.js`, `progress.js`, `version.js` | the first launch, the house, the old per-word helper, the stamp |

## `css/`, `data/`, `assets/`, `sources/`

- `css/shared/` is `tokens.css` (the only place colours, type, spacing, radii and the shadow are defined) plus one file per shared component; `css/<mode>.css` is a mode's own play area.
- `data/lang/` is the language engine's data, **generated** by `build/lang/import_all.mjs`; `data/lang/seed/` is what is edited by hand (`cook.json`, `clinic.json`, `paradigms.json`); `data/lang/reports/` holds the gap list, the clash list and the coverage reports. `data/family-audio.json` indexes every recording.
- Also in `data/`: `economy.json`, `progress.json`, `unlocks.json`, `map.json`, `layout.json` (screen sizes and scale), `arcs/` (the Birthday skeleton, a demo arc), `scenes/` (measured positions), `cook.json` and `stations/` (Cook's catalogue and levels), `clinic/` and `clinic.json`, `patients/`, `conversations/`, `story/`, and each parked mode's file.
- `assets/` is the art and audio the game loads; `sources/art/<pack>/` is where the Chrome art runner commits what ChatGPT made (art and audio sources, never edited by hand); `content/` holds the retired Content Master spreadsheet.

## `build/`

| Folder or file | What it does |
|---|---|
| `build/sandbox/` | plays the real flows at every size and level, records each state and lints it (`run.mjs`, `flows/`, `lib/`; README inside) |
| `build/lint/` | the screen lint (`layout.mjs`), the CSS lint (`css.mjs`), the word lint (`words.mjs`), the baseline |
| `build/tools/review/` | `checks.mjs`, `touched.mjs`, `shotdiff.mjs`, `regress.mjs`, `sprintcheck.mjs` (decision 78), `statuscounts.mjs`, `skeleton.mjs`, `leak.mjs` and its configs |
| `build/tools/ops/` | `brief.mjs`, `checkin.mjs`, `feedback.mjs`, `publish.mjs`, `mumround.mjs`, `mumsheet.mjs`, `mumitems.mjs`, and `specs/` (the briefs) |
| `build/tools/art/` | `artblock.py`, `artcut.py`, `artdiff.py`, `artjudge.py` for the Chrome art runs |
| `build/lang/` | the engine's importers and tools: `import_all.mjs` (rebuild `data/lang/`; `--check`), `gap-report.mjs`, the golden tests |
| `build/core/`, `build/host/` | unit tests for the core and the host (and `check_arcs.mjs`, `demo-browser.mjs`) |
| `build/bump_version.py` | stamps asset URLs and the import maps; run before every push to `main` |
| `build/test_*`, `build/leak_*`, `build/check_*` | the older per-mode tests, leak bots and checks (some are thin wrappers over `build/tools/review/leak.mjs`) |
| `build/cut_*`, `gen_*`, `make_*`, `shoot_*`, `contact_*` | the older art and screenshot scripts (the art tools above replace them for new packs) |
| `build/reports/` | one report per session, `<id>-<topic>.md`; `build/screenshots/` is ignored by git |

## Saved state

One save, `Save` in `js/core/save.js` (localStorage key `njg-save`, schema 2): players, the current player, and one namespace per owner (`words`, `wallet`, `ui`, `story`, `shelf`, `character`, `conversations`, `speech`, and each mode's own); see `target-model.md` § 3.4. A mode never touches storage directly (B17, J3). Everything stays on the device (J1). The old IndexedDB shell (`js/storage.js`) is gone.

## Browser tests and run commands

See `testing.md` (ports, the browser lock, the tools tables).
