# Step 3, R0 "Clean slate"

Branch `ccr-fcd9dddd-wnywzc`. Nothing pushed to `main`; no `bump_version`.

## Deleted
- **Clinic phase 1 (3,700 lines):** `clinic-phase1.html`, `css/clinic-phase1.css`, `build/test_clinic_phase1.py`, `build/leak_clinic_phase1.mjs`, `js/clinic/{flow,visit,patient,room}.js`, `js/clinic/mechanics/` (12), `stations/` (2), `stubs/` (3).
- **Bowl errand (2,917 lines):** `bowl.html`, `js/{game,shell,ui,audio,data,storage}.js`, `css/style.css`, `build/test_e2e.py`.
- **Proof of non-use:** `git grep` of every filename and defined global (`ClinicVisit`, `Clinic.Patient/room/line/Overlay/settings/speech/which`, `NjgGame/Data/UI/Storage/Profile/Audio`, `__njg`) over all tracked files outside docs found only comments. `clinic.html` and every clinic lab load none of the clinic files. `leak_clinic.mjs` needs only `pipeline.js` and `heal/registry.js`. `NjgAudio` in `js/shared/results.js` is a guarded optional (only the bowl defined it).
- **Kept on purpose:** `js/progress.js` (Monsoon), `data/errands.json` (used by `build_audio.py`, `lines_needing_family.py`), `data/scenes/*`, `assets/scene/eid/` (art), `lab/nani-alive.html` (standalone Phaser, not bowl-dependent), `js/shared/save.js` (R2).
- **Small edits to live files, forced by dead links:** removed the "Fruit bowl errand" link from `js/cook/flow.js` and `js/find/flow.js`; fixed the `index.html` comment; removed the phase-1 link from `labs.html` and `lab/clinic-core.html`.

## Site size
Tracked before: **2,696 MB** (8,445 files); after: **987 MB** (3,376 files), about 1.03 GB in decimal units. Images were untracked (2,630 screenshots, 2,439 report images; `.gitignore` updated, `build/screenshots/.gitkeep` keeps the folder). Next biggest tracked folders if more is needed: `sources/art` 443 MB, `assets/characters` 166 MB (hands 155 MB), `sources/audio` 106 MB, `build/contact-sheets` 72 MB (listed in `.gitignore` but tracked), `build/hand-v3-raw` 49 MB. I untracked nothing else.
**Images retrievable at commit `509e6837772c9c8e6c60a2734a03cddd022a41de`** (also `fafd34d`). Warning: checking out an older commit and back deletes the untracked images from disk (it happened to me; I restored them from that SHA).

## Smoke (`build/smoke_pages.mjs`, 1366x768, 3 s)
Before: 28 pages; after: 26 (bowl and phase 1 gone). Every remaining page has identical results: no page errors, no local 404s. The only error per page is the Google Fonts request failing certificate validation in this sandbox, same before and after. Screenshots and JSON are in the scratchpad `r0/before` and `r0/after`.

## Unit tests
`node --test build/test_shared_*.mjs`: 117 pass, 0 fail, before and after.

## Stale references for the orchestrator (not edited)
- `qa-checklist.md:50` (LAY-02): `build/test_e2e.py`.
- `regressions.md:64, 65, 312` (SH-29, SH-30, PRC-02): `build/test_e2e.py`.
- `code-map.md:4, 103-131`: bowl `js/storage|data|audio|ui|shell|game.js`, `test_e2e.py`, `__njg`, `build/screenshots/`.
- `shared-api.md:360`: clinic stubs/`mechanics/tell.js`; `:500`: bowl-era keys (migration, fine).
- `technical-plan.md:7`: `js/storage.js`.
- Comments only, left: `data/clinic.json` `_about` (flow.js, visit.js, tell.js), `data/patients/grey-adult.json`, `build/leak_clinic.mjs:14`, `js/progress.js`, `js/who/flow.js:13`, `css/shared/results.css:2`.

## Not done
Dead labs `basket-angle`, `nani-alive`, `card-options`, `sidebar-v2` are not linked from `labs.html`, so there was nothing to label. Art scripts not moved; star code not touched.
