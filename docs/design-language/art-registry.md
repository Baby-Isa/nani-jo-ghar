# The art registry: one list of every piece of art, and how a new version reaches every game

Zafar, 12 Nov: "Check to ensure it's easily known when art is fine or needs to be replaced or has been replaced ... how a
professional game studio would handle multiple artwork assets including new versions and revisions and how it manages ensuring
the new versions go everywhere." His yes, with Fable's shape: `build/reports/s19-art-registry-second-opinion.md` (taken whole,
`docs/ideas.md` "An art registry"). Built in Sprint 19 by s19-artreg; no game reads it yet (Sprint 20 moves the games, below).

## For Zafar: where to look

- **The art board**, `lab/art-board.html` (on the live site under `lab/`): every piece by game, with its picture, a colour and a
  plain name. Tap a colour at the top to show only those.
  - **Green, fine:** the judge passed it, or you did (people: only you).
  - **Blue, new, waiting for a yes:** a new cut. Where it replaces a picture in the game, both show side by side ("now", "new").
  - **Amber, stand-in:** in the game but below the standard. Allowed while we prototype; not in a store build.
  - **Red, needs replacing:** you, the judge or the audit named a fault. These and the amber ones make the next art run's list.
  - **Grey, replaced:** a newer piece took its place. A red box at the top says if any old file is still being shown.
- **"Needs you"** under the colours: people's pictures waiting for your yes, and the next art run's count.
- **How complete** says how far each game was played to make the map (every kitchen game to the end at levels 1 to 4).
- **The move-out list** at the bottom: stored pictures nothing loads and nothing names, by folder, with sizes.

You never type an id: say "redo the sekelo board" in a voice note; `/feedback` finds the piece by its picture and name.

## What a piece is

A **piece** is one thing in the game, with every state or variant it has: `sekelo.meat` is raw, part, cooked and over;
`kit.pot` is empty and water; `char.nani.talk` is one mood. Its **id** never changes, whatever file is current:

| Id form | For | Example |
|---|---|---|
| `<game>.<piece>` | a game's own art (the game's short name: chai, sekelo, maani, pantry, daar, samosa, chaat, chop, corn, eggs, baking) | `sekelo.meat`, `daar.pot` |
| `kit.<piece>` | kitchen kit more than one game uses | `kit.grill`, `kit.tray-steel` |
| `shelf.<thing>` | the walnut shelf set (side-on jars and foods) | `shelf.tea-jar` |
| `char.<name>.<mood>` | people (all moods of one person share `set: char.<name>`, swapped together) | `char.nani.talk` |
| `scene.<name>` | backgrounds and worktops (day, evening, night are states) | `scene.pantry-v3` |
| `served.<recipe>`, `serve.<piece>` | the serving kitchen's dishes and pieces | `served.chai`, `serve.tray` |
| `shared.<folder>.<piece>` | the shared kit: panel, word moment, juice | `shared.panel.stone-shelf` |

**Status** belongs to the piece (its states come from one run, so they line up): `approved` (with `by`: the judge, an art run's
pick, or Zafar; a person's art only `by: "Zafar"`, with a date), `candidate`, `stand-in`, `needs-redo`, `retired` (no file
current), `parked`. A **file** has a role: current (in `states`), candidate (in `candidate.states`), or replaced (in `replaced`,
and on `data/art/retired.json`).

## One entry

`data/art/registry.json`, one line per piece (a diff shows which pieces changed). Seeded by machine; never typed by hand.

```json
"sekelo.meat": {"name": "sekelo: meat", "kind": "piece", "game": "sekelo", "status": "approved", "by": "art run pick", "on": "2026-11-10",
  "version": "v4", "rev": 1, "states": {"raw": "assets/cook/items/v4/sekelo/meat-raw.webp", "part": "...", "cooked": "...", "over": "..."},
  "stages": "food4", "hash": {"raw": "3fa91c2e", ...},
  "meta": {"canvas": {"v": [300, 214], "from": "the file's header"}, "reach@raw": {"v": 0.2, "from": "data/stations/<k>.json#items.meat.reach"}},
  "source": {"run": "s19-full", "line": "K2", "pick": "sources/art/s19-full/results/best/K2.png", "date": "2026-11-10", "cutter": "build/tools/art/s19_cut.py"},
  "replaced": [{"file": "assets/cook/items/v3/sekelo/meat-raw.webp", "state": "raw", "row": "ART-79"}], "candidate": null}
```

- `version`: the label in the file's folder or name (v4, s14, v2); `rev` counts the piece's own versions (promote adds one).
- `meta`: only what belongs to the picture (canvas, rim, registration, handle reach, body, blade, lip, depth), each with `from`:
  where the number was found. Where a thing sits on screen (`px`, `at`, `x`, `y`) stays in the station's settings.
- `needs`: the measures the code reads (`["rim"]`); a new version without one fails once the game is migrated.
- `candidate`: a new cut beside today's file, with its own source. `metaStale` appears when a promoted cut's canvas changed:
  re-measure before the swap.

## How a new version reaches every game (the studio way)

1. **The cutter writes the line** (the art-run skill's step 4): `node build/tools/art/registry.mjs add sekelo.meat --file
   assets/cook/items/v4/sekelo/meat-raw-v2.webp --state raw --run s19-k4 --line K2`. A re-cut lands as the candidate; the game is
   unchanged and the board shows old and new side by side.
2. **The judge (or Zafar, for people) says yes:** `registry.mjs promote sekelo.meat --by judge`. The candidate becomes current, the
   old file goes on the piece's `replaced` list and on `data/art/retired.json`.
3. **Every game follows:** once a game asks by id (`Cook.Art.file("sekelo.meat", "raw")`, Sprint 20), the next load shows the new
   file. Until then, the retired check names every file and page still asking for the old one, so nothing is missed.
4. **Not a drop-in?** If the new cut's states or measurements differ (four stages where there were three, a handle in a new place),
   promote warns (`metaStale`, the stage rule) and a wiring row is opened: re-pointing an id is not enough.

## The checks (`build/tools/art/artcheck.mjs`, run by `checks.mjs`; today's findings on `artcheck-known.json`, shrink-only)

| Check | Fails when | Since |
|---|---|---|
| `retired` | a file on `data/art/retired.json` is named anywhere (js, data, css, html, lab: path, glob, stem or a path built in code) or loaded by any page in the traces | s19-artuse; traces widened by s19-artreg |
| `unregistered` | a picture any page loaded (first steps, full plays, the lab pages) is not in the registry as current, candidate or replaced | s19-artreg |
| `registry` | a bad id, status or kind; a missing file; a file current in two pieces; a person approved by anyone but Zafar; approved by nobody | s19-artreg |
| (contract) | for a migrated game: a changed hash, states of unequal canvas, an incomplete stage set, a missing `needs` measure. Warnings until then (`registry.mjs --validate` counts them) | s19-artreg (errors from the first migrated game) |
| `rawpath` | a migrated game's JS or station data names `assets/` | to build with the first game |
| `orphan` | a file in a migrated game's folders is in no entry | after the move-out |
| `store` | any piece a live game uses is not `approved` | the store build only |

The traces are cached (`build/reports/art-use-*.json`): `node build/tools/art/artuse.mjs --refresh` (first steps, 3 min),
`--full` (every kitchen flow to its end at L1-L4 and the other modes, about 90 min at one page at a time), `--static` (the lab
pages); a plain run joins them in seconds and writes the board's data. Refresh the full plays after a game's art changes.

## The five part-registries it replaces (mapped, not migrated: Sprint 20)

| Today | What it holds | In the registry | When it goes |
|---|---|---|---|
| `data/cook.json` `art.sprites` (`items`, `shelf`, `props`, `art`, `tools`, `bg`, `need`) | item and state to a file stem; painted props; each station's sprites | each file is a piece's state; `vessels`' rims and depths are `meta` with `from: data/cook.json#art.sprites.vessels.<v>` | as each game moves: `js/cook/art.js` resolves ids; `need` becomes the station's id list |
| `data/cook.json` `art.s02` (about 40 ids: `file`, `ready`, `meta`, `size`) | the registry in small, read by `js/cook/flow.js` | each s02 file is a piece's state; its `meta` and `size` are `meta` with `from: ...art.s02.<id>` | when its last reader moves to ids |
| `data/cook.json` `art.assets` and `data/stations/*.json` `assets` | what a page may load, as globs (how sekelo's old art got in) | not a piece's property: the board's "used in" comes from the traces | each manifest becomes a list of ids; `loadcheck.mjs` resolves them |
| The station settings' picture numbers (`body`, `rim`, `reach`, `blade`, `lip`, `w`, `h`, `cx`, `cy` beside a `file`) | measurements next to placement | `meta` with `from: data/stations/<k>.json#<path>` (placement keys left out) | the code reads `Cook.Art.meta(id)`; placement stays in the station |
| 14 `meta.json` files under `assets/` (pixels in `items-s14`, fractions in `chai-v2`) and the six JS files that copy their numbers | measurements | `meta` with `from: <folder>/meta.json#<key>` | the cutter writes fractions; the copies in `kitchen-kit.js`, `chai-tray.js`, `daar.js`, `maani-line.js`, `samosa.js`, `grill.js` and `build/check_vessel_meta.py` go |
| `build/tools/art/artcheck-known.json` (pixel, rim faults) and the cutters' numbers (`cut-numbers.json`) | known flaws; measures | flaws show on each piece on the board; the cutter's numbers are `meta` | the known list stays (the check's ratchet, by file); new cutters write `meta` through `registry.mjs add` |

## The files' names, the map and the redirect (s19-night-art; Zafar, 13 Nov, decisions 16-18)

The plan: `build/reports/s19-art-rename-plan.md`. A piece's current file is named by its id, under the assets folder: `art/<namespace>/<piece>.<state>.r<rev>.<ext>`
(`sekelo.meat` raw is `art/sekelo/meat.raw.r1.webp`); a name never changes once given (a new version is the next `r`).
`registry.mjs rename --game <k> [--dry-run] [--list-skipped]` moves one game's files (git mv, no changed byte, the hash proves it) and
rewrites the registry, `data/art/approved.json`, `build/tools/art/artcheck-known.json`, the static references in css, the root pages and
the lab pages, the art board, and appends every move to the permanent ledger `data/art/renames.json` (`registry.mjs show <old path>`
says where a file went). `js/art-map.js` is generated (`registry.mjs --map`; never edited, never merged by hand: regenerate it) and loads
right after `js/version.js`: the live pieces' files and measures, and `was` (old path to new). `njgV()` follows `was`, so code and data
that still name a file by its old path load the new one; `Cook.Art.file(id, state)` and `Cook.Art.meta(id[, key])` (`js/cook/art.js`)
are how a game asks by id. Not renamed: people (`char.*`, Zafar's approval), scenes, the shared kit, ui, other modes' art and any file
another mode loads or names (the rename tool lists them). artcheck's `exists` (every path named exists or is on the ledger), `resolves`
(the map is fresh; its files carry the registry's hash; every file in the art folder is in one entry) and `rawpath` (old names and
art-folder paths in code and data, the list Step 2 shrinks) keep it honest; `loadcheck.mjs --json` with `build/tools/art/byteproof.mjs`
is the byte proof (the same pictures by content before and after).

## Sprint 20: moving the games to ids

A game moves only when its art is being swapped anyway (non-negotiable 1: no sprint of pure moving). Parked games and prototypes
never move; their art is `parked`.

**The order:** 1. **sekelo** (mishkaki-grill), with its art swap (ART-79: `grill.js` still has `v3pieces` and `v4pieces`, and the
manifest's globs let 11 retired pictures load); 2. **samosa** (the karahi K8r, the plate S5, the filling bowls); 3. **daar** (the pot
D1-D2); 4. **baking** (the naan B3a/B3b, the jugs B5r); 5. **eggs** (the pot redo ART-75, the whole egg E5); 6. **maani** (the board
M1); 7. **the pantry** (the walnut shelf set); 8. chaat, corn and chop (already v4: when next touched); 9. chai last, only when a
swap comes (it is the reference and approved).

**Per game, three commits:**
1. **Ids for exactly today's files.** The registry already holds every file the game loads. The game's code and station data ask
   `Cook.Art.file(id, state)` and `Cook.Art.meta(id)` (in `js/cook/art.js`, which already resolves `art.sprites`); its manifest
   becomes a list of ids; the game goes on `migrated` in `registry.json`, which turns its warnings into errors and starts `rawpath`.
   **The no-pixel-changed proof:** before the switch, play the game's flows at L1-L4 and the four sizes (`run.mjs --flow
   cook:<k>,cook:<k>@L2,... --sizes 740x320,930x430,1280x665,1920x1080 --run-id <k>-ids-before`), the same after the switch
   (`--run-id <k>-ids-after`), then `node build/tools/review/shotdiff.mjs --run <k>-ids-after --vs <k>-ids-before --strict`: no
   changed shot. Also `loadcheck.mjs --only cook:<k> --json` before and after: the same pictures. A changed pixel is a bug in the
   switch, never "close enough".
2. **The swap:** `registry.mjs promote` per piece (or set), the wiring where states or measures differ, the evidence loop's
   before and after, the judge.
3. **The clean-up:** the old branches go (`v3pieces`), the manifest tightens, and the old files move to `sources/art-retired/`
   (same sub-path; `sources/` is not published).

## The move-out (Sprint 20, after the traces and the manifests agree)

`build/reports/art-move-out.json` lists, with sizes from git: stored pictures that no page loaded in any play and no file names
(`unloadedUnnamed`, move them), pictures some file names but no play loaded (`namedNotLoaded`, check each first: often an old
manifest glob or a path built in code), the PNGs with a WebP twin, the two published videos (`assets/20261104_124327.mp4`,
`assets/20261105_004201.mp4`) and the ChatGPT folders on main (already moved to `sources/art/` on the integration branch; they
leave the live site when it merges). Nothing is moved before then.

## Commands

| Command | Does |
|---|---|
| `node build/tools/art/artuse.mjs [--refresh] [--full [--resume]] [--static]` | the map (what each page loads), the move-out list, the board's data |
| `node build/tools/art/registry.mjs --seed` | an entry for every loaded picture and new cut with none (never changes an entry) |
| `node build/tools/art/registry.mjs add <id> --file <f> [--state s] --run <r> --line <L>` | the cutter's line (candidate beside today's file) |
| `node build/tools/art/registry.mjs promote <id> --by judge\|Zafar` | the candidate becomes current; the old file is retired |
| `node build/tools/art/registry.mjs status <id> needs-redo --row ART-nn --note "..."` | mark a fault (from `/feedback`) |
| `node build/tools/art/registry.mjs list --status needs-redo,stand-in` | the next art run's list |
| `node build/tools/art/registry.mjs --validate`, `show <id\|file\|old path>` | the rules; one entry (an old path through the ledger) |
| `node build/tools/art/registry.mjs rename --game <k> [--dry-run] [--list-skipped]`, `--map` | one game's files to their registry names; the map |
