# s18-g-chaat: chaat at chai's standard on the kits (Sprint 18, wave 2)

Opus, high. Gap page first (`docs/design-language/standard/gaps/chaat.md`), committed alone.

## What changed

- `data/stations/chaat.json` (new): the bowl's place and layers, the shelf, pots and strips, the motions' times, flyMs by level
  (420, 360, 305, 260; STD-C2-06). BOWL, BOWL_INSIDE, POT stay in code (`check_vessel_meta.py` reads them; green).
- `assemble.js` keeps the bowl and takes the kits: (a) `Cook.Kit.worktop`, `St.stoneBand`; (c) `Shelf.P.chip`, `.slots`,
  `.pillWant`, `.pillScale`, `Juice.P.pop`; (d) `Cook.Coach.firsts`, `.lessons`, `.cardLight`, `.wrong` (the last three new to
  chaat); (b) `NjgServe.round`; (e) `UI.personSay`. CHT-17: a word with no room shows its speaker alone (Zafar, 30 Oct).
- Kept: the bowl, checker, spoon in and out, wobble, take-back, auto-serve, the demo. CHT-13, CHT-04: s08b strips stand in.

## Proof

- Commits: `1bba271d` gap page (alone, first); `aad0f220` the switch; `e36ccdc2` the gate made before the coach stops (the coach's
  stop marked the station seen: no demo, no lessons); `82302aac` merge of the integration branch (daar's chop); the lessons before
  L4's fold, the rescore, this report.
- Contract, `cook:chaat` L1-L4 at 1280x665 (+ #mistake L1-L2, #takeback, `cook:assemble#returning`): every end reached, **0 page
  errors**; the only breaks are **contract-95 in the chop step** at L2-L4 ("Bas!", "Hane hakro dungri!" said after a skip, before
  any step opens: the chop mechanic run straight by the recipe opens no step; ask 1). At 740x320, L2 and L4: contract-98
  `none-in-view nana:out@32,329` (the dotted row sits below the panel's fold when the kit's lessons look; ask 2). Before this run
  chaat had no lessons at all (contract-98 "never logged" at L2). Run folders deleted (shared disk).
- Checks: words, static (0 new; 8 known fixed), load 29/29, docs ok for my files (sekelo's page and status.md's branch name fail,
  not mine); unit 743 pass, 4 fail (3 art-block tests: no `sources/`; 1 checkDocs: sekelo's page). `check_vessel_meta.py` chaat ok.
- No BEFORE, no evidence run (decision 5); CHT-13 and CHT-04 wait on art (nothing changed for them).
- **Gap page:** before 25 n/a, 25 missing, 150 built, 5 green; after 25, 13, 160, 7 (none judged yet).
- Copied code deleted: `speaker()` (chai v2's), INK, FONT, `chipLabel`, the chip's card/speaker/hit, the pop card and `floorK`,
  the fill/band/plank, the ghost's own SVG and colours, the serve-redo `for` loop, the `sayPerson`/`customerSay` recast, the
  `coached["assemble-v2"]` key: 319 lines out, 272 in (`git diff --stat` at `aad0f220`).

## Asks (files I don't own; exact changes)

1. **Chop's owner** (`js/cook/stations/chop.js`), so chaat's chop step is chop's own game: before `Cook.Chop = {...}` add
   `Mech.define("chop-game", { station: "chop", view: "marble", async run(z, p) { return (await play(z, p)).cut; } });`, and open the
   chop's step before its first call when it has no `onCall` (e.g. `St.steps(z.ctx).to("chop", { quiet: true })`, `.done()` at the
   end): contract-95 at chaat L2-L4. **Orchestrator:** `data/cook.json` recipes.chaat.run[0] `"do": "chop"` -> `"do": "chop-game"`;
   `js/cook/index.js` PARTS `"chop-game": PARTS.chop`.
2. **Kit (d)** (`js/cook/coach.js` `C.lessons`): before it logs none-in-view, bring the target into view (`target.scrollIntoView({
   block: "nearest" })`, or `OrderCard.glideTo(target)` as `cardLight` does), then measure again: 740x320, nana's dotted row at y 329.
3. **Orchestrator:** `build/lint/static-known.json`: `--write-known` (8 fixed, assemble.js's colours, speaker and finger);
   `data/cook.json` mechanics.assemble.levels[0]: delete `"flyMs": 420` (now `data/stations/chaat.json` levels).
4. **Fix list:** CHT-17 built (a word with no room shows its speaker alone); to judge at 740x320 L4 at the merge.

Cost: about $25 (Opus, high).
