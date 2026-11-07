# s18-kit-c: the shelf, its word pills, the count pills, the word pop (the shared kit)

Kit builder (c), Sprint 18 wave 1, 7 Nov. Module map pieces 9-12, all in the shared kit, loadable without `js/cook/`.

## What landed (commit, call)

| Piece | File | A game calls |
|---|---|---|
| 9 the shelf: band, decoys by the rules file (1-2-3-4, the L4 lookalike), size classes, slots | `js/shared/shelf.js` (new) | `Shelf.decoys`, `Shelf.classFit`, `Shelf.slots`; Cook keeps `St.tableDecoys`, `St.classFit` as thin wrappers |
| 10 word pills | `js/shared/shelf.js`, styles in `css/shared/tally.css` | `Shelf.P.chip` (canvas), `Shelf.chip` / `Shelf.mount` (page); `Shelf.pillWant`, `.pillRoom`, `.pillScale` |
| 11 count pills | `js/shared/tally.js` | `Tally.label`, `Tally.place`, `Tally.counter` |
| 12 the word pop | `js/shared/juice.js` | `Juice.P.pop`, `Juice.popAt` (canvas); `Juice.pop` (page) |
| lab | `lab/sections/kit-shelf.html` | opens on its own; 11 strips, one per state |

Commits (in order): `85c264d3` piece 11; `e85b97ef` pieces 9-10 (with the lib's wrappers); `fe4ac1d6` piece 12; then the lab
section and this report.

`js/cook/station-lib.js` imports `js/shared/shelf.js` for its side effect (as `js/day/*.js` import the word card), so Cook's pages
need no new script tag; the band (`St.SHELF`), `St.decoyNote`, `St.sizeClass`, `St.CLASS_K` and `St.FLOOR_CSS` are the kit's too.
The styles went into `css/shared/tally.css`, not a new sheet: a new shared sheet must be imported by `css/shared/kit.css`, which no
builder owns this run. The pill class is `njg-wpill` (`njg-pill` is the answer pill in `css/shared/buttons.css`).

## Proof

- Unit: `build/test_shared_shelf.mjs` (9: decoys 1-4 by `data/rules.json` with the L4 lookalike; `classFit` and `slots` held equal
  to the old lib and shelf code over every class, flag and width; pills; no game named, no Cook) and `build/test_shared_tally.mjs`
  (2): 22 pass with `test_shared_frame.mjs` (no px in css/shared).
- Lab, measured (no frames shot) at 1280x665 and 740x320: no errors, Cook absent, 11 strips; no pill touching, cut or outside its
  band; classes L/M/S stand 119/109/100 px (1/.91/.84); decoys 1, 2, 3, 4, lookalike at L4 only; count pills 0-4 read
  nothing, hakro, ba, trae, char (the lexicon's) and dots; the pop sits above the pan, clear of the count pill. The crowded ten at
  740x320 narrows a long word to 11.9 px (the cap, as on the canvas).
- Checks: `static`, `words`, `docs`, `bump` ok. `unit`: 3 fails in `build/tools/art/artcheck.test.mjs` (the art block, JSON input
  missing: this worktree has no `sources/`), none in my files.
- Chai on the lib's wrappers: `sandbox/run.mjs --contract --flow cook:chai-tray,cook:chai-tray@L4 --sizes 1280x665,740x320`:
  "CONTRACT PASSED: 0 breaks over 4 pages", every flow's end reached, 0 page errors, contract-37 0 (run folder deleted for disk).
  930x430 and 1920x1080 not run (the shared CPUs; the orchestrator's merge replay covers them).

## What waits (other owners; chai keeps its old code until its owner switches)

- **kitchen-kit.js (builder a)**, `Cook.Kit.chip` and `.speaker` become:
  `chip(S, id, x, y, { word = true, w = CHIP.w, depth = D.item + 2 } = {}) { return global.Shelf.P.chip(S, x, y, Cook.display(id), { word, w, depth, weight: "800", pad: 52, onTap: () => { Cook.unlockAudio(); if (Cook.onLabel) Cook.onLabel(id); Cook.Lang.speakWord(id); } }); },`
  `speaker(g, x, y, s, color = INK.text) { return global.Shelf.P.speaker(g, x, y, s, color); },`
- **ui.js (builder e)**: in `tallyLabel` return `global.Tally.label(t.n, { level: t.lv, word: (n) => { const ws = key && key !== "_" ? String(key).split("+") : []; const g = ws.length && Lang.gender ? Lang.gender(ws[ws.length - 1]) : null; return Lang.num ? (Lang.num(n, g)[0] || {}).t : null; } })`;
  in `placeTally`, after `const p = ...`: `global.Tally.place(b, $("#stage"), p.x - st.left, p.y - st.top, { anchor: tallyAnchor });` in place of the
  class, left/top and keep-inside lines (`Tally.keep` is the same arithmetic).
- **chai (its owner)**: the slots (793-860) → `Shelf.slots(shelfIds, { span: [spanL, spanR], view: [VL, VR], pitch: PITCH, groupGap: GROUP_GAP, pillRoom: PILL_ROOM })`;
  `PILL_*` → `Shelf.PILL`, `chipWant` → `Shelf.pillWant(ppw)`, `PILL_GAP` → `Shelf.pillGap(ppw)`, `pairNeed` → `Shelf.pillRoom`,
  `fitPills`' k → `Shelf.pillScale`; `chipFace` / `pillHit` → `Shelf.P.chip(S, x, CHIP.y, Cook.display(id), { word, depth: D.item + 2, onTap })`
  with `chip.face(word, cap)` and `chip.hit(slotW)`; `pop` → `Juice.P.pop(S, (W, H) => popAt(pan, W, H), Cook.display(id), { k, depth: D.fx + 3, top: (Cook.view || {}).top || 0 })`,
  `popAt`'s body → `Juice.popAt({ x: pan.x, y: pan.y - rimR - 16 }, W, H, { top, left, right, edge: { y: hobY, clear: RIM_CLEAR, above: 10 }, avoid: badgeBox() })`.
  The card's shadow is the token `shade-rgb` (60, 35, 20 at 0.1) where chai drew 40, 25, 10: pass `shade` to keep the old one.
- **cook.html / lab.html** (the orchestrator): a `<script src="js/shared/shelf.js?v=...">` before the modules, so the shelf is
  version-stamped (today it loads unstamped through the import, as the word card does on the day pages).
- **lab/kit.html** (chai's owner): load `lab/sections/kit-shelf.html` (an iframe is simplest; it is a whole page).

## Cost

About $15-20 (Opus, high).
