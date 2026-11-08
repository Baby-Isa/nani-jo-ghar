# s18-g-baking: baking (naan) on its settings and the kits (Sprint 18, wave 2)

Opus, high. Branch `s18-g-baking` (never pushed). Gap page: `docs/design-language/standard/gaps/baking.md`.

## What changed

- **The game reads its settings** (`Cook.data.settings.baking`): the counter picture, the bowl's six states (empty to dough, by
  turn), the jug with its full picture cropped up to its line (`items.jug.lineAt`), the oven's
  three pictures, the naan raw then golden, the shared streams; it loads only what the round draws.
- **The kits:** the first-time gate `Cook.Coach.firsts`; each control (tip, bowl, oven, naan, oven out) through
  `Cook.Coach.control`; a wrong pick `Cook.Coach.wrong`; the reveal lessons `Cook.Coach.lessons`; decoys `St.tableDecoys` (the
  rules' 1-4, the L4 lookalike).
- **Kept:** the whole mechanic (the turns, tap-per-tip amounts, the jug, the bowl, the oven, Nana's face, the cat).

**Deleted** (old `baking.js` at 37ffa737, 443 lines, now 403): the `SHELF`, `POUR`, `LIQUID`, `JUG_LINES`/`JUG_MAX` tables (34-46,
into the settings); its own first-time gate `seen`/`fresh`/`first()` (72-78, a copy of chai's old `first14`, now the kit's
`Cook.Coach.firsts`); the lit-at-once `light()` (184-189, now `Cook.Coach.control`); the drawn wall, tiles and counter (83-88),
mound (98-107), jug and its fill (110-135), liquid column (154-171), oven body, doors and rack (304-332).

## Proof

- Contract, the brief's sizes: `run.mjs --contract --flow cook:baking,cook:baking@L4 --sizes 740x320,930x430,1280x665,1920x1080
  --run-id s18-g-baking-contract`: **"CONTRACT PASSED: 0 breaks over 8 pages"**, 0 page errors; L1-L4 at 1280x665: 0 breaks over
  4 pages. Before: 17 breaks (contract-24 12, -98 3, -23 2).
- How: the kit's lights (24); lessons as each row is revealed (98); her turn tagged `order`, said row by row as a person's
  order is (23, 89); one light per tip, following the container, which rests tipped 320 ms while it fades (92, 53).
- Checks: static, words, recordings, load ok; docs ok for baking (sekelo's and chaat's pages fail, from the merge); unit 744
  pass, 3 fail (art-block tests: no `sources/`).
- Gap page counts, before → after: missing (1) 36 → 17, built (2) 138 → 152, check green (3) 15 → 20, n/a 14, dbd 2.
- No BEFORE, no evidence `--after` (decision 5). CHAI-67, ART-37 unchanged (ask 1, ART-38). Not done: a leak config.

## Asks (exact changes; the files are not mine)

1. **`js/cook/ui.js` (the word moment for any measure, STD-A3-01..03):** `UI.wordMomentDue = function (ids, set)`: `const pair =
   (set && set.pair) || ["ph-half", "ph-full"]; const key = (set && set.key) || WM_KEY;` then use `pair` and `key` in place of the
   two literals and `WM_KEY`. `UI.wordMoment = async function (ids, set)`: pass `set` to the due check, mark `seen[key]`, and when
   `set` is given play with `vessel: {src: Cook.v(set.vessel.src), tilt: set.vessel.tilt}`, `stream: Cook.v(set.stream)`,
   `glasses: set.measures.map((m) => ({empty: Cook.v(m.empty), full: Cook.v(m.full), fill: m.fill, word: {id: m.id, kutchi:
   Cook.display(m.id), english: Cook.english(m.id), picture: Cook.v(m.card)}, say: () => Lang.speakWord(m.id)}))`, chai's other
   options unchanged. Baking already calls `UI.wordMoment(ids, settings.wordMoment)` before its card; today it is skipped.
2. **`js/cook/coach.js`:** `C.box = (o, pad = 0) => () => { if (!o || !o.active || !o.visible) return null; const b = o.getBounds();
   const a = Cook.UI.worldToScreen(b.x - pad, b.y - pad), z = Cook.UI.worldToScreen(b.right + pad, b.bottom + pad); return [a.x,
   a.y, z.x - a.x, z.y - a.y]; };` Then baking's `boxOf` and chai's `pageRect` both become `Cook.Coach.box`.
3. **`build/tools/review/loadcheck.mjs`:** baking is not in `STATIONS`, so its loads are unchecked: add `"baking"` (and eggs, corn)
   and let `cookStation(k)` also allow `data/stations/<k>.json`'s `assets` (its own list, decision 68).
4. **The kitchen-kit lab page:** a baking section (the oven's three states, the jug at each line) for STD-F5-03.
