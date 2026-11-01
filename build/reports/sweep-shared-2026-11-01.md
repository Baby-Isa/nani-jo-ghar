# Sweep, shared area: 1 Nov 2026

Branch `sweep/shared-20261101` (from `d7835a5`, main's publish 20261030T203356Z), worktree
`/home/user/nani-jo-ghar/.claude/worktrees/wf_11a0c350-268-12`. Never pushed. Zafar asked (1 Nov) for old code, code causing
problems and code slowing things down fixed for real; this is the shared area's half (`js/shared`, `js/core`, `js/day`, the live
pages, the shared sheets). Nothing a child sees or hears changes; no Kutchi touched; no mechanic, lab entry or setting removed.

## What changed

| Finding | What changed | Files | Result |
| --- | --- | --- | --- |
| SHARED-1, SHARED-2 | lab.html asks for the host's and the core's modules at once (18 `modulepreload`s after the import map) and loads the core's data, the mode (its main.js, data and sheets), the arcs index, each arc and the map in one `Promise.all` instead of nine awaits in a row; the arcs stay keyed in the index's order | `lab.html` | chai-tray L1 reaches `cook/chai-tray/playing`, 0 console errors, same request profile (the same 6 duplicate fetches as before, Cook's: see N2). Slow line (4 Mbps/60 ms, L3, 930x430, this machine): 27 620 ms before, 26 655 ms after, 355 requests both, 8 503 → 8 506 KB; recorded as the new baseline (`loadtime-baseline.json`, label `sweep-shared-20261101`) |
| SHARED-3 | every live page preloads the kit's thirteen sheets (`<link rel="preload" as="style">`, one per `@import` in kit.css, same order, before the kit link); `build/lint/static.mjs` shell ignores a preload (two test cases added); `build/gen_labs.mjs` writes them for labs.html; kit.css is NOT concatenated | `index.html` `first.html` `labs.html` `day.html` `cook.html` `clinic.html` `lab.html` `build/lint/static.mjs` `build/lint/static.test.mjs` `build/gen_labs.mjs` | the sheets start with the page (labs.html: at 29-34 ms, were after kit.css's round trip); same request counts on every page; no "preloaded but not used" warning; cascade unchanged |
| SHARED-4 | `js/shared/rules.js` is a static tag before `tokens.js` on the day, lab, Cook and clinic pages, so tokens.js finds `Rules.ready` and skips the copy it injected at run time | `day.html` `lab.html` `cook.html` `clinic.html` | rules.js goes out with the page and data/rules.json right after (day.html locally: 189 ms, was 403); the rules and tokens tests pass (30/30); 0 console errors on the four pages |
| SHARED-5 | `js/day/day.js` boot(): the six `data/lang/*.json` (lexicon 449 KB) load in the first `Promise.all` with the day's data and the core, no longer behind `data/family-audio.json`; day.html preloads the core's 15 modules after its import map | `js/day/day.js` `day.html` | same 80 requests, `day/door` reached, 0 console errors; day tests 39/39; all data requests now leave together (527 ms mark) where lang/* used to wait for the core's data |
| SHARED-6 | `js/first.js` starts `FamilyVoice.load()` (one cached promise, CK-48) up front, with the character's pictures, not after the story JSON and the first line's `clipFor` | `js/first.js` | `data/family-audio.json` now leaves with `character-options.json` (340 ms) instead of last (411 ms); one request for it, as before; 0 console errors |
| SHARED-7 | `modulepreload` for `js/core/progress.js` and `wallet.js` (save.js's imports) before the save.js tag on index.html and first.html, plus `js/core/env.js` (voice.js's) on first.html | `index.html` `first.html` | the three modules leave with the page (first.html: 36 ms, were at 191); 75 and 47 requests as before; 0 console errors |
| SHARED-9 | unreferenced rules deleted: `.ob-ring` ×2 (+ `@keyframes ob-glow`, used by nothing else) and its reduced-motion half; `.rs-badges.n3.has-looks`; the `.rs-results .rs-rec,` half (now `.rs-rec { display: none !important; }`); day.css `.day-find-item` block (+ `day-wiggle`/`day-bounce` keyframes), `.day-spks`/`.day-spk` block, their reduced-motion parts, `.day-card`, `.wr-scenery` ×2, `.wr-got` (+ keyframes), `.wr-crossing`. `.njg-face-btn-big` KEPT (face.js builds it from a template). The static known list shrinks by `motion\|css/day.css\|day-bounce` (`--write-known`) | `css/shared/onboard.css` `css/shared/results.css` `css/day.css` `build/lint/static-known.json` | ripgrep over js, html, json, css, svg and the template builders (`day-${`, `wr-${`, `ob-${`, `rs-${`): no hit outside the sheets; the DOM of the door, window, book, chai-tray lab and clinic pages polled for 12 s carries no deleted class; door and book screenshots pixel-identical; the window, chai-tray and clinic shots differ only by motion (two consecutive after-shots differ by the same regions and amounts) |
| SHARED-14 | header comment: PARKED (Monsoon) ONLY, the live progress is `js/core/progress.js`; code untouched | `js/progress.js` | `node --check` ok; monsoon.html loads, 0 console errors, 37 requests as before |
| SHARED-19 | the three ChatGPT upload folders (89 MB) `git mv`'d to `sources/art/`; six unreferenced background originals to `sources/art/backgrounds/` (bg-bazaar-stall-v2.jpg, -v3.png, bg-courtyard-e-v1.png, bg-sitting-room-e-v1.png, bg-sitting-room-v1.png, bg-spice-cupboard-v1.png); every .webp, bg-bazaar-stall-v3.jpg, bg-nani-kitchen-v1.jpg, bg-nani-kitchen-v3.png kept in place. The nine `-e-*-v1.png` were first dropped (byte-identical to `sources/art/chatgpt/`) and then PUT BACK: the specs check flagged them, the MOD-01 contract check (`build/sandbox/data/evidence.json`, `python3 build/bg_align_check.py assets/backgrounds/bg-*-e-*.png`) runs on them. artcheck-known.json loses the six moved files' entries; art-pipeline.md notes where uploads live | `assets/` → `sources/art/`, `build/tools/art/artcheck-known.json`, `docs/design-language/art-pipeline.md` | live site 444 MB / 4 750 files → 340 MB / 4 696 files; artcheck 465 findings, 465 known, 0 new (test 4/4); specs 0 flagged; every live page plus lab/nani-alive.html, find.html, monsoon.html load with no 404 |

Commits (oldest first): `f2d2f94` SHARED-1/2 · `2fde3ec` SHARED-5 · `6259f66` SHARED-6/7 · `fc2528f` SHARED-4 · `a6de2a6` SHARED-3 ·
`58d8b7c` SHARED-9 · `82213dd` SHARED-14 · `ca23ce1` SHARED-19 · `163fe98` SHARED-3 (labs generator) · `8523260` SHARED-1 (load-time
baseline) · `3850bbb` SHARED-19 (the nine PNGs back) · then this report.

## Before and after

Headless Chromium 1280x665, a static server on this machine, median of three loads (`load` = the load event, `idle` = network
idle; localhost, so the times show the dependency chains, not a phone on a real line):

| Page | Before: load / idle / requests | After: load / idle / requests | Console errors, 404s |
| --- | --- | --- | --- |
| index.html (→ first.html for a new player) | 355 / 1 060 ms / 75 | 258 / 1 030 ms / 75 | 0 / 0 both |
| first.html?app=1 | 201 / 902 / 47 | 184 / 865 / 47 | 0 / 0 |
| labs.html | 148 / 643 / 19 | 131 / 625 / 19 | 0 / 0 |
| day.html | 259 / 1 163 / 80 | 340 / 1 102 / 80 | 0 / 0 |
| lab.html?mode=cook&game=chai-tray&level=1 | 224 / 3 377 / 178 | 195 / 2 751 / 194* | 0 / 0 (3 warnings both: AudioContext, GL driver) |
| cook.html | 499 / 2 783 / 158 | 348 / 2 159 / 158 | 0 / 0 |
| clinic.html | 382 / 1 361 / 115 | 170 / 1 034 / 115 | 0 / 0 |
| lab/nani-alive.html | 284 / 1 390 / 22 | 229 / 1 183 / 22 | 0 / 0 |
| find.html | 396 / 1 229 / 67 | 279 / 948 / 67 | 0 / 0 |
| monsoon.html | 458 / 958 / 37 | 363 / 863 / 37 | 0 / 0 |

\* the lab page gets further into the station within the same idle window, so more of its pictures are counted; at idle + 4 s
both before and after total 199 requests with the same six duplicates (N2).

Slow-line measure (`build/tools/review/loadtime.mjs`, chai-tray L3, 930x430, 4 Mbps / 60 ms, this machine, same hour): before
(main checkout) 27 620 ms, 8 503 KB, 355 requests; after 26 655 ms, 8 506 KB, 355 requests. Recorded as the baseline.

Live site: 444 MB in 4 750 files → 340 MB in 4 696 files.

## Checks

Before (`node build/tools/review/checks.mjs` on `d7835a5`, 21 min): all eleven ok: unit 87 files, 623 pass; words 0 literals;
static 851 findings, 851 known, 0 new; leak 19 configs; bump 35 files, 76 modules; specs, docs, fixlist, recordings ok; size 444 MB;
load 29/29 pages.

After (final tree, `3850bbb`; full `node build/tools/review/checks.mjs`, exit 0): all eleven ok: unit 87 files, 623 pass, 0 fail;
words 0 literals; static 850 findings, 850 known, 0 new; leak 19 configs at every level; bump 35 files, 76 modules; specs 0 flagged;
docs within every limit; fixlist every row labelled; recordings current; size 340 MB in 4 696 files; load 29/29 pages. (A first
after-run, one commit earlier, had specs flag the nine `-e-*-v1.png` as missing: `3850bbb` put them back.) artcheck 465 known, 0 new.

Unit tests near the touched code (`node --test` over build/test_shared_*, build/core, build/host, build/lint static+css,
build/test_day_*, artcheck): 394/394 before; 408/408 after (the two new shell cases, artcheck and the day runner included). One
failure met on the way and fixed: labs.html is generated (`build/gen_labs.mjs --check`), so the generator now writes the preloads.

`build/reports/snap-leakbot.md` was restored with `git checkout` after each checks run.

## Skipped, or done differently, and why

- **SHARED-4 and SHARED-6, the optional `<link rel="preload" as="fetch">` for data/rules.json, shared.json, faces.json and
  data/story/first-launch.json: skipped.** `build/bump_version.py`'s tag regex restamps only `js/`, `css/` and `assets/` hrefs, so a
  stamped `data/` preload would go stale at the next bump: a second download plus a "preloaded but not used" warning on every page.
  (And see N1: three of those files are fetched unstamped today, so the URLs would not even match now.)
- **SHARED-6, the form:** the brief's `Promise.all([C.load(), FamilyVoice.load()]).then(Story.play)` would make the first scene wait
  for the 381 KB clip list; instead the load is started and not awaited (the story's first line awaits the same cached promise, as it
  did). Same fetch, earlier; nothing the child sees waits for it (non-negotiable 7).
- **SHARED-7 on labs.html: skipped.** labs.html has no import map, so save.js's `./progress.js` and `./wallet.js` resolve
  unstamped there; a stamped preload is a second download (measured: 21 requests, was 19). The proper fix is the import map (N3).
- **SHARED-9:** `@keyframes ob-glow` went with `.ob-ring` (its only user); `.njg-face-btn-big` kept, as the brief says.
- **SHARED-19, the nine `-e-*-v1.png`: kept in `assets/backgrounds/`.** The brief listed them to move; a grep over js, css, data,
  lab, html and build/tools found nothing, but `build/sandbox/data/evidence.json` (MOD-01 p1) runs `build/bg_align_check.py` on
  them and the specs check failed, so they came back (the sweep's rule: only what nothing names). Moving them would need the spec
  rewritten to `sources/art/chatgpt/` (the byte-identical originals), a decision for the orchestrator; 18 MB stays on the site.
  Nothing of Zafar's art leaves the repo.
- **Static known list** (`build/lint/static-known.json`) and **art known list** were shrunk, as their lints ask ("run --write-known",
  "take it off the known list"); both only ever shrink.

## Found on the way, not fixed (for the orchestrator)

- **N1 (shared, a real bug after a publish):** `js/shared/tokens.js` (base from `document.currentScript.src`), `rules.js`, `face.js`
  and `bulb.js` build an absolute URL and then stamp it, but `njgV` leaves full URLs alone (`/^[a-z]+:\/\//`), so
  `data/shared.json` (the ladder table), `data/rules.json`, `data/faces.json`, `data/layout.json` and the injected `rules.js` are
  fetched WITHOUT `?v=` on every page (seen in the request log: `data/rules.json`, no stamp). A returning player can keep a stale
  table after a publish. Fix: stamp the relative path before prefixing the base (`base + stamp("data/rules.json")`) in tokens.js
  129-146, rules.js 226-228, face.js 58 and 79, bulb.js 44; a unit test on a `http://` base. Shared area, small, behaviour-neutral.
- **N2 (Cook):** lab.html?mode=cook and cook.html fetch `data/economy.json`, `progress.json`, `unlocks.json`, `cook-tts.json` twice
  (lab.html's loadCore and Cook's own boot) and `assets/cook/bg/service-master-v2.webp`, `assets/cook/characters/nani-happy-v3.webp`
  twice. Pre-existing; Cook's fixer.
- **N3 (labs page):** no import map on labs.html, so its core modules load unstamped (cache-busting gap); `gen_labs.mjs` could write
  the `<script type="importmap" data-njg="core">` tag for bump_version.py to fill, which also makes SHARED-7 apply there.
- **N4:** the static known list has one entry per occurrence and shrinks only by hand (`--write-known`); after any CSS deletion it
  needs that run, or the lint prints "1 known ones are fixed" for ever. Worth a line in the sweep checklist.
