# s19-artuse: what each game really loads, the retired list, the art board

**Board screenshot:** `build/reports/art-board-1280x665.png` (dark: `art-board-1280x665-dark.png`). Page: `lab/art-board.html`.

## What changed
- `build/tools/art/artuse.mjs` (+ `artuse.test.mjs`): replays loadcheck's discover run over the kitchen pages (cached in `build/reports/art-use-loads.json`; `--refresh` replays, about 2 min), joins it with the 3,365 pictures on disk and every name of them in js, data, css, lab and root html (full path, glob, stem). Writes `build/reports/art-use.json` and the board's `lab/art-board-data.js`. Plain rerun is seconds.
- `data/art/retired.json`: 14 globs, each with `replacedBy` and row ART-79 (sekelo's s08c pieces and trays, v3 sekelo food, heaps, grill, stick, plates; `sekelo/stick-v`, `rack-t`, `grill-t`; v4 `kit/grill` and samosa `karahi-oil` by their v2). Only what has a v4 piece; the rest stays amber. `tool-board-t` is not listed: no v4 board for sekelo exists.
- `artcheck.mjs` `retired` check: names (live scan) and real loads (cached trace). It was red on 21 sekelo hits; they are now on `artcheck-known.json` (shrink-only; a hit that stops failing must come off). Tests in `artuse.test.mjs`, pulled in by `artcheck.test.mjs` (the only file checks.mjs lists).
- `lab/art-board.html`: per game tiles (new / old / retired counts, bar), games with retired art first, each picture a thumbnail with path, version, colour. Light and dark; 740x320, 930x430, 1280x665, 1920x1080 had no horizontal scroll and no page errors.

## How complete (honest)
14 of 14 pages opened (title, 13 station labs); each only to its **first step at level 1**, none played to its end. Chaat has no page of its own: it is Assemble (its chop is Chop). Strings built in code (`${...}`) are not resolved (reported in art-use.json). So pictures a later step, level or mood brings in count as grey: the grey figure is an upper bound.

## Counts (new / old / retired, still loaded)
sekelo 39/39/**11**; chai 0/101/0; eggs 17/41/0; baking 15/46/0; corn 15/29/0; chop 6/36/0; chaat 13/30/0; pantry 1/63/0; daar 30/67/0; samosa 9/46/0; maani 7/47/0; tadka 2/39/0; stir 10/39/0; title 0/25/0.
All pages: 371 loaded; 2,994 stored and loaded by nothing, of which 1,573 are named by some file and 1,421 by nothing.
Retired hits: 11 real loads (all sekelo), 21 findings in all.

## Proof
- `node --test build/tools/art/artuse.test.mjs`: 4 pass.
- `checks.mjs`: unit 880 pass, 3 fail (the art block tests in artcheck.test.mjs; they fail the same on the commit before mine: the sparse checkout lacks sources/); art, docs, specs, size, static, leak, bump all ok. artcheck: 0 new, 515 known.
- loadcheck earlier: baking asks for 5 pictures outside its manifest (shared word-moment counter, worktop bg, juice td-1/3/5): not mine, not fixed (build/tools/review is read-only).
- No game code touched, so the brief's before/after and the four-size contract replay were not run; check-change result: see below.

## Open
- Add `build/tools/art/artuse.test.mjs` to checks.mjs (read-only for me) if it should run apart from artcheck.test.mjs.
- To make the grey honest: play each flow to its end under the load trace (a later run).
