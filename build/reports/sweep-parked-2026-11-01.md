# Sweep, parked area: 1 Nov 2026

Branch `sweep/parked-20261101` from `d7835a5` (Publish 20261030T203356Z), worktree `/home/user/nani-jo-ghar/.claude/worktrees/wf_11a0c350-268-11`. Not pushed. The six approved findings for the parked modes (Find it, Snap, Tidy up, Dress up, Who did it?, Monsoon rush), one commit each. Nothing a child sees or hears changed: no mechanic, level, lab entry, setting, art, word, audio or data meaning was touched, and no Kutchi.

## What changed

| Id | What changed | Files | Commit | Result |
|---|---|---|---|---|
| PARKED-3 | Dropped `V.clearItems` (three lines); `V.clearBasket` beside it stays | `js/find/view.js` | `3e08d3f` | Re-verified before the cut: `grep -rnw clearItems` over html/js/mjs/py/json hits only the definition. find.html 0 errors; `mode:find` end reached |
| PARKED-4 | Dropped the unused `matchThing` arrow | `js/dress/grade.js` | `3250c19` | Re-verified: only the definition. Dress leak bot output byte-identical before/after; `mode:dress` end reached |
| PARKED-5 | Dropped five CSS rules no element carries: `.story-line`, `body.find .title-wrap .t-about h1` (find), `.card-pic`, `.card-pic .mini` (tidy), `.tell-parent` (who) | `css/find.css`, `css/tidy.css`, `css/who.css` | `c5596a7` | Re-verified: each class hits only its own rule across html/js/mjs/json/py/css/md; the only dynamic prefixes (`card-${letter}` in clinic eye.js, `story-${dish}` in cook main.js) are an id and a game name, not these classes. `node --test build/lint/css.test.mjs` 3/3; find/tidy/who pages 0 errors; shots of the three modes' flows unchanged (see "Shots") |
| PARKED-6 | Find's scene base files fetched at once with `Promise.all`, assigned in the data's order (`Object.entries(fd.scenes)` index), so `Find.scenes` keeps its key order and content | `js/find/engine.js` | `9aa267c` | `Find.scenes` from the old engine vs the new, in a headless page: same keys (`bazaar,sitting-room`), same order, JSON byte-identical (8345 bytes). Find leak bot output byte-identical; `mode:find` end reached; one round trip saved (see "Timing") |
| PARKED-8 | Comment-only: `build/test_find.py`, `build/test_snap.py` (two places) and `build/test_who.py` now read `build/archive/...` (where the files are), plus "live smoke flow: build/sandbox/flows/modes.mjs" on the three hook headers | `js/find/flow.js`, `js/snap/flow.js`, `js/snap/bot.js`, `js/who/flow.js` | `3311f62` | checks.mjs green |
| PARKED-17 | The measurements, re-run after the edits (below) | — | — | All green |

Note on scope: `css/find.css`, `css/tidy.css` and `css/who.css` sit outside the brief's "touch only" list but are the files PARKED-5 names; the approved fix was applied as written. Nothing else outside the list was touched.

Skipped: nothing. Every approved fix turned out safe on re-verification.

## Checks, before and after

`node build/tools/review/checks.mjs` (then `git checkout build/reports/snap-leakbot.md`), both exit 0:

| Check | Before | After |
|---|---|---|
| unit | 87 files, 623 pass, 0 fail | 87 files, 623 pass, 0 fail |
| words | strict on js/cook, js/clinic: 0 literals | same |
| static | 851 findings, 851 known, 0 new | 850 findings, 850 known, 0 new; "1 known ones are fixed" (the `.card-pic` rule's `#fff` token, `build/lint/static-known.json:790`; `--write-known` would shrink the list; that file is outside this sweep's area, so it was left for the orchestrator) |
| leak | 19 configs at every level | same |
| bump, specs, docs, fixlist, recordings | ok | same |
| size | live site 444 MB in 4750 files | same |
| load | 29/29 pages load only what's on their screen | same |

Unit tests near the code: `node --test build/lint/css.test.mjs` 3 pass / 0 fail, before and after.

Leak bots: `node build/tools/review/leak-games/find.mjs` PASS and `node build/tools/review/leak-games/dress.mjs` PASS, before and after; both outputs byte-identical (`diff` empty, 75 and 35 lines).

## Pages, headless (Chromium 1280x665, 4 s settle)

Console errors, warnings and failed requests (4xx or network): 0 on every page before and after: find.html, snap.html, tidy.html, dress.html, who.html, monsoon.html, who.html?lab=1, snap.html?lab=1.

## Timing

The first after-table was taken while the checks suite, the sandbox and the leak bots were running on the same box, so its numbers were noise. The fair run: serial, quiet, median of 5, the old tree (the main checkout at `d7835a5`, served read-only) against this branch, a static server with 40 ms per response so a serial fetch shows.

| page | old loadEventEnd | new | old last resource done | new | requests | errors |
|---|---|---|---|---|---|---|
| find.html | 559 | 494 | 1120 | 1023 | 64 / 64 | 0 / 0 |
| snap.html | 480 | 561 | 855 | 852 | 52 / 52 | 0 / 0 |
| tidy.html | 605 | 594 | 643 | 577 | 39 / 39 | 0 / 0 |
| dress.html | 521 | 515 | 786 | 787 | 46 / 46 | 0 / 0 |
| who.html | 401 | 386 | 509 | 471 | 29 / 29 | 0 / 0 |
| monsoon.html | 414 | 349 | 644 | 561 | 34 / 34 | 0 / 0 |

Same request count on every page. The one real change is find.html (PARKED-6): old, `scenes/bazaar.json` start 941 / end 986 then `scenes/sitting-room.json` start 988 / end 1034 (one after the other); new, both start at 824 and end 886 / 888 (together). The rest is run-to-run spread of ±60 ms on a loaded container, in both directions. On GitHub Pages the saving is one round trip (around 100-300 ms) before Find's title.

## Sandbox flows (`node build/sandbox/run.mjs --flow mode:... --quick`)

Before (`sweep-parked-before`) and after (`sweep-parked-after`), the six flows `mode:find`, `mode:monsoon`, `mode:snap`, `mode:who`, `mode:tidy`, `mode:dress`: every one "end reached", 0 page errors, same state counts (8, 4, 4, 3, 5, 5), same findings (58: tap-small 40, text-small 15, scroll-container 3; all pre-existing), same sound gap list (17 lines with no family clip, 14 played files not an approved clip; the known recording gaps).

### Shots

`node build/tools/review/shotdiff.mjs --run sweep-parked-after --vs sweep-parked-before`: 53 shots, 36 identical, 12 within threshold, 1 brightness-only, 4 "changed": find `title`, find `list-in-sidebar`, find `c03-popup`, snap `c02-popup`. Each was run down:

- `list-in-sidebar`, the two popups, and later `c04-popup`, `c06-input`, snap `phase-shoot`: a second run of the same new code (`sweep-parked-after2`) differs from the first by the same amounts (list-in-sidebar max 129 both times), and against the before run these are no longer flagged. They are animation-phase wobble (Nani's panel popping in, a popup mid-fade, a dim scrim); the flow data confirm the same round, the same list ("1 hakro anjir, 2 ba naaspati") and the same states, with timeline stamps drifting 200-500 ms between runs. Snap had no visual change at all (a comment).
- find `title`: consistent old-vs-new, not new-vs-new. The sandbox shoots the title the instant `#t-start` appears, with no settle, so it catches the panel's fade-in at whichever frame the poll lands on, and the old tree mounts the title a touch later after `load` (the serial scene fetch). The settled title, shot 500 ms and 3 s after `#t-start` appears in a headless page, old tree vs new, is byte-identical (1280x665 PNGs equal; `.title-wrap` opacity 1, transform none in both).

So no shot shows a look change from this sweep.

## How to check in the morning

1. `git log --oneline d7835a5..sweep/parked-20261101` (five fix commits and this report).
2. `node build/tools/review/checks.mjs` then `git checkout build/reports/snap-leakbot.md`.
3. `node build/tools/review/leak-games/find.mjs` and `.../dress.mjs`.
4. `COOK_TEST_PORT=8814 node build/sandbox/run.mjs --flow modes --quick`.
5. Optional tidy-up outside this area: `node build/lint/static.mjs --write-known` (or the checks' own flag) to drop the stale `.card-pic` entry at `build/lint/static-known.json:790`.
