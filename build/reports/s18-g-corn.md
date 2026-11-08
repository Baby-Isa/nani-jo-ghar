# s18-g-corn: the corn stall on its settings and the kits (Sprint 18, wave 2)

Opus, high. The gap page came first, committed alone (`docs/design-language/standard/gaps/corn.md`); then the game moved onto
`data/stations/corn.json` and the kits, keeping its own mechanic (the crate, the grill, turn once, lift, the dressings named as
they go on, the plate tap). Nani's box stands in for Hannah Mami.

## What changed

- **Settings:** art from the cut block 1 files (`settings.items`, `scene`; the old `assets/cook/proto/corn-*` paths gone), the
  table is CT (`S.setBg`), sizes, places (`scene.layout`, each derived in its `_about`) and motion times (`motion`) from the file.
- **Kits:** steps in Nani's box (`St.steps`: each call said once its step opens, so nothing after a skip); lights by
  `Cook.Coach.firsts`, `.control` (first time with its call, else after the rules' wait), `.wrong`, `.lessons`; no light on an
  asked dressing past support; the dressing's stuck hint opens her helper card; `Cook.Kit.heatRing` over each cob; the serve on
  `NjgServe.round` (the face, the recast, the redo, the third try shown); `Cook.roundDone`.
- **New (non-negotiable 7):** a second tap takes a dressing back until the serve. **Fixed:** a crate tap while a cob flew to the
  plate grilled one too many.
- **Deleted (copied kit code):** the first-time gate copy (`seen`, `fresh`, `first()`), the glow on every next thing (`light()`,
  the `first(...)` lights), the `speak()` calls (now step calls), its own ring drawing, the code-drawn table and grain, the
  `DRESS`/`LIQUID`/`P` tables, its own right check and `Cook.Kit.review` call, the palette's ring colours.

## Proof

- Commits: 082ce401 (gap page), 6742a566, b7eaa6a6 (the build), cdc53672 (merge of the kits), this one (rescore, report).
- Contract, `cook:corn` L1-L4 at 1280x665 (s18-g-corn-contract): **CONTRACT PASSED: 0 breaks over 4 pages**, every end reached,
  0 page errors. Before (s18-g-corn-base, same flows): 18 breaks (contract-24 12, contract-95 4, contract-98 2).
- Paths at 1280x665 (#mistake, L2#mistake, #takeback, #hint, L3#hint, L4): 1 break, explained: contract-22 at L2#mistake,
  "tamarind chutney" said at the first try's tap and again at the redo's tap 2 s later. It is ph-amli's device-voiced English
  (no Kutchi alone yet, settings `gaps`); contract-22 lets item words repeat but does not know the English stand-in as one.
- Checks: static (812 known, 0 new), words ok; docs fails only on other pages (status.md branch, chaat, sekelo). Unit:
  test_cook_harness, test_cook_levels, test_shared_rules, test_day_runner pass.
- Gap page: before 0: 15, 1: 47, 2: 139, 3: 4; after 0: 15, 1: 21, 2: 147, 3: 22. Audit 2 pass before, 16 after.
- No BEFORE run, no evidence --after, one size (decision 5).

## Asks (exact changes, files I don't own)

1. `js/cook/coach.js`: export the box helper, `C.boxOf = (obj) => () => hugOf(obj);`, then corn's `boxOf` (and chai's
   `pageRect`) can go.
2. `build/sandbox/lib/contract-hook.mjs` spotNow: first line in the loop, `if (!l.classList.contains("on")) continue;` (a closing
   light's layer keeps its holes for its 300 ms fade). Then corn's `motion.flipK` can go back to a full squash and the 320 ms wait
   before the review can go.
3. `build/sandbox/lib/contract.mjs` contract-22: count an item's grey English (its `english`) as an item word.
4. `build/tools/review/loadcheck.mjs`: add `"corn"` to `STATIONS`, and in `cookStation(key)` concat
   `(existsSync(join(ROOT, \`data/stations/${key}.json\`)) ? json(\`data/stations/${key}.json\`).assets || [] : [])`.
5. Grill.js: nothing needed (corn uses `Cook.Kit.heatRing`).

## For Zafar (decisions, from the gap page)

Cobs 1, 1, 2, 2 and sides slower by level (C2-02, C2-06); the tray always shows all six dressings (C2-03); no cob ever burns
(B2-04); the stall's oak table, not the marble (E3-03); a teaching pair, lili and amli (C1-01).

## Open

The card light (D1-07) and the next-cob light (D1-10); the recipe's slots and say-lines still in `data/cook.json`; the four sizes
at merge.
