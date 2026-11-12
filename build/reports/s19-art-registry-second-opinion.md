# S19: second opinion on the art registry plan (12 Nov)

Read-only review of "An art registry" (`docs/ideas.md`, last section). Nothing else was edited; nothing was committed.

## Verdict

**The direction is right; the order and the shape are not.** Ids and one registry are what a studio would do. But the plan as written would not have caught last night's sekelo problem, and its first step (a hand-made registry from the audits) is the dearest and least reliable part. Five changes:

1. **Tonight: a retired list and a check on what each game really loads, not a registry.** That is the one step that stops old art showing, and it needs no migration.
2. **Build the registry by machine from what the games load**, then add status by hand only where the audit found a fault. Do not write 3,300 lines from prose.
3. **The registry replaces the registries already there**; it must not sit beside them. There are five today (listed below).
4. **Each piece carries a contract: its states and its measurements.** Most new versions are not drop-in swaps, so "point the id at the new file" is not enough on its own.
5. **Move a game to ids only when its art is being swapped anyway**, with a no-pixel-changed proof. No sprint of pure moving.

## What I found that the plan does not say

- **Sekelo's old art is allowed by its own manifest.** `data/cook.json` `art.assets.stations["mishkaki-grill"].files` still lists `assets/cook/items/v3/sekelo/*`, `assets/cook/items-s08c/sekelo/*` and `assets/cook/items-s08c/sekelo-tray/*`. `js/cook/mechanics/grill.js` has both `v3pieces` and `v4pieces` branches (lines 168-177, 774, 1011). The version is in the code's names, and the load check passes old art because a glob lets it in.
- **`artcheck.mjs`'s `ref` check cannot see most references.** It matches only whole quoted paths (`"assets/….webp"`). It misses stems (`"v4/sekelo/bowl-meat"` under `art.sprites.dir`), globs in manifests, and anything in `*.html`, `css/` or `lab/`. A "no retired file" check built the same way would pass while old art still loads.
- **There are already five part-registries:**
  - `data/cook.json` `art.sprites` (item, state, file stem; plus `vessels` rim numbers);
  - `data/cook.json` `art.s02` (id, `file`, `ready`, `meta`: this is the proposed registry in small, about 40 entries, read by `js/cook/flow.js`);
  - `data/cook.json` `art.assets` and each `data/stations/*.json` `assets` (what may load);
  - 14 `meta.json` files under `assets/` (two formats: `items-s14` in pixels, `chai-v2` in fractions);
  - `build/tools/art/artcheck-known.json` (496 known flaws) and the cutter's `cut-data.json`.
- **Measurements are copied into code.** `js/cook/kitchen-kit.js`, `stations/chai-tray.js`, `daar.js`, `maani-line.js`, `samosa.js` and `mechanics/grill.js` hold numbers from `meta.json`, and `build/check_vessel_meta.py` exists only to check the copies still match. `assets/cook/items/v4/` has no `meta.json` at all.
- **Size.** 3,365 pictures on disk; the live site is 429 MB (`sitesize.mjs`). My scan found about 1,400 pictures (up to 190 MB) that no file names in full or by glob. That is an upper bound, because it cannot see stems built in code. Largest: `assets/characters/hands` (231 files, 106 MB, parked), `assets/cook/items` (237), `assets/cook/items-s17-stove` (293, stored for later), `assets/cook/bg` (14 of 23, 11 MB). Also 118 PNGs with a WebP twin (47 MB) and two videos in `assets/` (`20261104_124327.mp4`, `20261105_004201.mp4`, 46 MB together) that are published.
- **`loadcheck.mjs --discover --json` already records every picture each page asks for.** That is the truth the registry and the checks should be built on.

## Agreements

- A stable id per piece, and code asking by id.
- One place that says which file is current, where it came from and what it replaced.
- Retired files out of the published tree (`sources/` is already excluded in `_config.yml`).
- The cutter writes the lines; nobody types them.
- An art board by game, with status colours.
- Zafar approves art of real people; the judge approves the rest.

## Disagreements

1. **"A first registry from the builders' art audits" (tonight).** The audits are prose judged by eye from contact sheets, and `s19-art-audit.md` says it used manifests, not a live trace. Typing them into a registry makes a second copy of an opinion. Generate the list from the load trace; use the audit only to mark the faults.
2. **"Every loaded picture registered and approved."** Registered, yes. Approved, no: stand-ins are allowed during the rapid prototype. Fail on *unregistered* and *retired*; count stand-ins and redos on a list that may only shrink (the pattern `artcheck-known.json` already uses). Require all approved only in the store build.
3. **"Retired" as a status of a piece.** A piece is never retired; a file is. Piece status: `ok`, `stand-in`, `redo`, `missing`, `parked`. File role: `current`, `candidate`, `retired`.
4. **"Next sprint: every game moved to ids."** Hundreds of references moved with nothing new on screen is the riskiest way to spend a sprint, and non-negotiable 1 says leave what Zafar did not comment on. Move a game when its art swap is on the fix list (ART-79 makes sekelo first). Parked games and prototypes never move; their art is `parked`.
5. **"New versions go everywhere" by re-pointing an id.** The v4 sekelo pieces have four stages (raw, part, cooked, over); v3 had three (raw, grilled, charred). The new grill has different handles. A re-point works only when the new file keeps the same states and supplies the same measurements. Where it does not, the cut must open a fix-list row for the wiring (the art-run skill's step 4 already does this for "waiting on art" rows).
6. **A sixth registry.** The plan must name what it replaces: `art.s02`, `art.sprites.items/shelf/vessels`, and the `meta.json` files, game by game as each moves. `art.assets` (what may load) becomes a list of ids, so manifests stop naming folders.

## Improvements, by question

**Measurements.** Yes, in the registry with the file, written by the cutter. Only what belongs to the picture: canvas size, rim circle, registration point, handle reach, flat area, burner spots. Where a thing sits on screen stays in the station's settings. Always fractions of the canvas, never pixels. Each piece lists what code needs (`needs: ["rim"]`); a new version without it fails the check. Then `check_vessel_meta.py` and the numbers in the six JS files go.

**States and variants.** One piece, many states: `kit.pot` with `empty`, `water`; `sekelo.meat` with `raw`, `part`, `cooked`, `over`. Status and version belong to the piece, because states must come from one run to line up. Name the common sets once (`stages: "food4"`); a piece missing a stage fails, which would have shown baking's two-of-four naan by itself. All states of a piece share one canvas size.

**Served dishes.** Pieces like any other, in a `served` group, each with `of: <recipe>`. Check: every recipe in `data/cook.json` `recipes` has exactly one. Leave the wiring until s19-serve2's kitchen dishes settle.

**Backgrounds.** In the registry with `kind: "bg"`, the 1600x900 rule, a link to the scene master, and their slots (where shelves and trays sit) as measurements; code depends on those more than on any rim. Day and evening are states.

**Characters.** `kind: "person"`. A new cut lands as `candidate`, never `current`. `ok` needs `by: "Zafar"` and a date; the check fails without it. All moods of one person are one piece, swapped together.

**Candidate beside current.** For every piece, not only people: the cutter writes `candidate`; the board shows old and new side by side; promoting is one line. That answers "has been replaced" at a glance.

**Size, caching, cache-busting.**
- Move what no live page loads to `sources/art-retired/` (same sub-path), after the load trace and the manifests agree, and after extending the reference scan to `*.html`, `css/` and `lab/`. Move the PNG twins and the two videos the same way. Parked art (the hands) moves too, marked `parked`.
- Today `js/version.js` stamps every URL with one stamp, so every publish makes every returning player fetch all art again. Once URLs come from one resolver, stamp each picture with the first 8 characters of its own hash, kept in the registry. Unchanged art then stays cached, and a file changed without its registry line fails the check.
- The registry's `current` files are the store build's bundle list, for free.

**Migration without breaking play.** Per game, three separate commits:
1. Add the game's entries pointing at **exactly today's files**; switch its code and station data to ids. Proof: `loadcheck` shows the same pictures as before, and `shotdiff.mjs` at the four sizes shows no changed pixel.
2. Swap files (old to new), one piece or set at a time, with before-and-after shots and the judge.
3. Delete the old branches (`v3pieces`), tighten the manifest, move the old files out.
A ratchet, `migrated: ["mishkaki-grill", …]` in the registry: for a migrated game, any `assets/` path in its JS or station data fails. The list only grows.

**Ids or a folder per piece.** Ids. Folders cannot do it: pieces change one at a time (`v4/kit/grill-v2.webp` already sits inside `v4`), so a version folder is always wrong for something. Keep the v4 layout for new cuts (`<game>/<piece>-<state>.webp`), put the version in the file name, and rename no old file. Zafar never types an id: the board shows the picture and a plain name ("sekelo: skewer"), and he says "redo" by voice note, which `/feedback` records.

**Format.** `data/art/cook.json` (one file per area; the clinic's later), loaded once at start:

```json
"kit.grill": {
  "name": "the grill", "kind": "piece", "status": "ok",
  "by": "judge", "on": "2026-11-12", "games": ["mishkaki-grill"],
  "states": { "default": "assets/cook/items/v4/kit/grill-v2.webp" },
  "hash": { "default": "3fa91c2e" },
  "meta": { "w": 1200, "h": 640, "bars": [0.12, 0.88], "handleReach": 0.07 },
  "needs": ["bars"], "run": "s19-k2", "pick": "K4 try 2",
  "replaced": ["assets/cook/items/v4/kit/grill.webp", "assets/cook/items/grill-jiko-t.png"],
  "candidate": null, "row": "ART-79"
}
```

Code: `Cook.Art.url("kit.grill")`, `Cook.Art.meta("kit.grill").bars`, `Cook.Art.url("sekelo.meat", "cooked")`, in `js/cook/art.js` (which already resolves `art.sprites`).

**Checks** (all in `artcheck.mjs`, run by `checks.mjs`; unit tests in `artcheck.test.mjs`):

| Check | Fails when | When |
|---|---|---|
| `retired` | a file on `data/art/retired.json` is named anywhere (js, data, html, css, lab, manifest globs) or loaded in the `loadcheck` trace | tonight |
| `unregistered` | a migrated game loads a picture with no registry entry | with the first game |
| `rawpath` | a migrated game's JS or station data names `assets/` | with the first game |
| `contract` | a state the code asks for is missing; a `needs` number is missing; states differ in canvas size; a stage set is incomplete | with the first game |
| `person` | `kind: person` is `ok` without `by: "Zafar"` | with the first game |
| `hash` | a file's hash differs from its registry line | with the resolver |
| `orphan` | a file in a migrated game's folders is in no entry | after the move-out |
| `store` | any piece a live game uses is not `ok` | store build only |

**The art board.** `build/tools/art/artboard.mjs` writes `lab/art-board.html` (a static page; `lab/` is published, so it opens on his phone). Per game: each piece on mid-grey, plain name, status colour, version, what it replaced (small thumbnails kept in `lab/art-board/thumbs/`, since retired files are no longer published), where it is used (from the load trace), and any flaw from `artcheck-known.json` (the pink rims). At the top, a "needs you" strip: people-art candidates waiting for Zafar.

## The recommended first step (tonight)

Three small things, no game code touched:

1. **`build/tools/art/artuse.mjs`**: runs `loadcheck.mjs --discover --json` and joins it with the files on disk. Writes `build/reports/art-use.json`: for every picture, which live pages load it, and whether anything names it. This is the registry's seed and the move-out list.
2. **`data/art/retired.json` and the `retired` check**: a short list of globs with what replaced each and the row, taken from the audit's table (a) and ART-79. For example `assets/cook/items-s08c/sekelo/**`, `assets/cook/items-s08c/sekelo-tray/**`, `assets/cook/items/v3/sekelo/board*`, each with `replacedBy` and `"row": "ART-79"`. The check fails on any name or any real load. Today's hits go on a known list that may only shrink, so the check is green tonight and every swap takes a line off.
3. **The art board, read-only**, from `art-use.json` plus the retired list: per kitchen game, green (new and loaded), red (retired and still loaded), grey (stored, not loaded). Zafar sees sekelo's red pieces tonight.

Then the first registry entries are sekelo's, written as part of the ART-79 swap, with the three-commit migration above.

## Proof (what I read)

- `CLAUDE.md`; `docs/ideas.md` ("An art registry").
- `build/tools/art/artcheck.mjs` (whole), `shoot_served.mjs`, the folder listing, `artcut.py` (meta lines), `specs/` listing.
- `.claude/skills/art-run/SKILL.md` (whole).
- `docs/design-language/art-pipeline.md` (headings; section 15 in full).
- `data/cook.json`: `art` (`sprites`, `s02`, `assets.shared`, `assets.stations`), structure of the rest.
- `data/stations/mishkaki-grill.json` (`assets`, `items`, `mechanic.skewer`); `data/kit-elements.json` and `data/asset-list.json` (heads).
- `assets/cook/items/chai-v2/meta.json`, `assets/cook/items-s14/meta.json`; the list of all 14 `meta.json`; listings of `assets/`, `assets/cook/`, `assets/cook/items/v4/kit` and `v4/sekelo`.
- `js/version.js`; `js/cook/station-lib.js` (`S$.load`); greps for `meta.json`, `load.image`, `art.s02`, `v3pieces`/`v4pieces` in `js/`.
- `build/tools/review/loadcheck.mjs` and `sitesize.mjs` (headers); `sitesize.mjs` run: 429 MB, 5,996 files.
- `build/reports/s19-art-audit.md` (summary and the start of table (a)); `docs/process/regressions.md` row ART-79; `_config.yml`.
- My own scan (a throwaway script, not saved): 2,409 full-path references to 1,427 files, 78 globs, 44 built paths; 3,365 pictures on disk; 1,959 matched by a name or glob. Not read: `art-bible.md`, the other station files, the clinic's data.
