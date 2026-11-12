# s19-artreg: the art registry and catalogue, ready for Sprint 20

**Board screenshot:** `build/reports/art-board-1280x665.png` (dark: `art-board-1280x665-dark.png`); page `lab/art-board.html`.
How it works, the five part-registries' mapping and Sprint 20's plan: `docs/design-language/art-registry.md`.

## Flaws first
1. **The map is the fair player's path:** one seed per level; no mistake, hint or take-back paths. 1,384 pictures are named
   somewhere but no play loaded them: "check first", never on the move-out list.
2. **Statuses are machine-seeded:** a v4 cut a game loads is `approved` "by art run pick" (Zafar's supervised picks, not a judge pass
   per piece); old art is `stand-in` unless the audit or fix list named a fault (18 marks). Clinic, day and house art was never
   judged: there "stand-in" means "not judged".
3. **11 chai pieces show as stand-in** (s14 pan frames, ginger, word moment): `approved.json` lists only chai's first step. Decision 1.
4. Old art's ids come from file names; 48 pieces warn that their states differ in canvas. Hash, canvas, stage and `needs` rules
   warn until a game is `migrated`; `rawpath`, `orphan`, `store` are not built.
5. `unregistered` reads the cached traces: a new picture fails once they are refreshed (`artuse.mjs --full`, about 70 minutes).
6. Only 143 of 715 pieces have a run and line (the S19 runs); older art's source is its folder label.
7. Outside my files, to fix what I broke: `build/tools/art/data/look-rules.json` (the colour tool leaves out `data/art/*` and the
   board's data, which name every picture) and one `DOC_LIMITS` line in `build/tools/review/docs.mjs`. `docs/README.md` has no line
   for the new doc yet.
8. Tier 2 was stopped (Proof).

## What changed
- `artuse.mjs --full`: every kitchen flow to its end at L1-L4, the serving kitchen, title, house, first launch, story, a clinic
  patient, the day's door, farm ride and book, under a load trace (every fetch and draw); `--refresh` adds the clinic games and mode
  pages; `--static` the lab and root pages. Writes `art-use.json`, `art-move-out.json`; paths built in code count as names.
- `data/art/registry.json` (715 pieces, 920 files) and `registry.mjs`: `--seed`, `add` (the cutter's line: a candidate beside
  today's file), `promote` (old file to `retired.json`; people need Zafar), `status`, `--validate`, `--board`. Measurements from all
  five part-registries, each with `from`. 13 old pieces point at their cut replacement (`next`).
- `artcheck.mjs`: `unregistered` and `registry` checks; `retired` reads every trace (known list: 6 fixed sekelo loads off, 1 on).
- The board: per game and piece, status colour, version, source, where used, old beside new, the move-out list.
- The art-run skill's step 4: the cutter writes the registry line.

## How complete
Every kitchen game: 4 plays to the end (L1-L4) plus its first step. Serving kitchen (story day 1, free cooking, shop), title,
house, first launch, story, a clinic patient, door, farm ride, book: to the end. Clinic's 9 games and a morning: first step.
40 lab, mode and root pages opened. 55 + 32 + 39 pages, all reached; 817 of 3,365 pictures loaded; 1 retired still loaded
(`v3/sekelo/plate-*`, sekelo and free cooking).

## The next art run (kitchen games)
- **Needs replacing:** eggs' pot (ART-75); sekelo's mixed-skewer card (ART-68); maani's chakla (ART-62); the pantry cupboard (oak
  shelves); 10 old shelf jars in baking and the labs (the walnut set exists: wiring, plus the orange).
- **Cut, only wiring:** samosa's fillings, potato pile, jharo; sekelo's old mishkaki pieces, potato cube, skewer; daar's ladle; the knife.
- **Stand-ins in use:** daar 27, serving kitchen 15, chai 11, samosa 9, baking 8, maani 6, pantry 4, eggs 4, sekelo 3, shared 45.
  Live list: `lab/art-board.html?status=needs-redo,stand-in`.

## Move-out list (Sprint 20; nothing moved)
1,164 pictures loaded by nothing and named by nothing, **223 MB** (hands 147 MB, `backgrounds` 20, `cook/bg` 11, `items-s17-stove`
8); among them 15 PNGs with a WebP twin, 29 MB. Two videos, 46 MB. Named but not loaded: 1,384, 77 MB (check first). ChatGPT folders
on main: 6, 526 MB (already in `sources/art` here). `build/reports/art-move-out.json`.

## Decisions for Zafar
1. Count chai's 11 later-in-play pieces under your chai sign-off? **Recommend yes.**
2. Judge the clinic, day and house art into the registry later, not now? **Recommend yes.**
3. Sekelo first in Sprint 20, with its art swap and the no-pixel-changed proof? **Recommend yes.**

## Proof
- `node --test build/tools/art/artuse.test.mjs build/tools/art/registry.test.mjs`: 12 pass (pulled in by `artcheck.test.mjs`).
- `registry.mjs --validate`: 715 pieces, 0 errors, 48 warnings. Retired, unregistered, registry findings: 0 new, 0 stale. Full
  `artcheck.mjs` (before the reseed): 513 findings, 513 known, 0 new.
- `checks.mjs`: every step ok but unit: 921 pass, 5 fail, now 3 (781-783, the art block tests that fail without `sources/art` in the
  sparse checkout, as at launch); the docs-limit and colour-tool tests I broke are fixed.
- Contract, 11 flows x 4 sizes: 44/44 ends, 0 page errors; last line `CONTRACT FAILED: 130 breaks (contract-36 33, -119 21, -117 11,
  -111 10, -106 9, ...)`. Not mine: no game file differs from the launch commit (`git diff f20607060 -- js css *.html data/cook.json
  data/stations`: only `lab/art-board.html`). `build/screenshots/sandbox/s19-artreg-contract/contract.md`.
- Evidence after: refused, "ART-74: no evidence spec" (a publish row); no before or after folder.
- check-change: push failed on those 3 tests; scope flagged `sources/art/s19-tray-pot/results/run-report.md` (not mine) and my 13
  files outside the owns (the map's outputs, board data, tests, known list, the two fixes). I stopped its play: 276 pages plus the
  base's (about 14 hours on this shared machine) for a change with no game file. No result file; run it at merge if wanted.
- Board: `labcheck.mjs` light and dark at the four sizes: no page errors, nothing spills.
