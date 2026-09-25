# Foundation build, phase A (25 Sept 2026)

Branch `claude/build-foundation`. The full contract is `docs/shared-api.md`. Only new files were touched, plus `js/shared/speech.js`.

## Built
Each piece is one plain file, available as a global, as `window.Shared.*`, or through Node `require()`.
- **`speech.js`, finished.** `listen()` is unchanged. Enrolment is per profile, 3 takes per word, and `confirm()` follows the plan's rule. Also: `cancel`, mic `status`, template URLs and a parent log. No audio is kept.
- **Relations.**
  - `data/relations.json`: 17 relations (placeholder words), aliases and grammar.
  - `rel.js`: the Find form (`holds(item, where)`, matching by word) and the board form (`holds`/`options(state, rule, scene)`, all eight Tidy up rule types), plus `check`, `solve`, `phrase`, sidecars, `validate` and occlusion.
  - The scene schema is in the doc. Find it's bazaar validates as it stands.
- **`whichone.js`.** The decoy rule, rack builder, look-alike candidates, line-up balance and lucky guess. Blind odds per row and per set, and a loop that keeps a round at or under 5%.
- **Stars.** `data/shared/stars.json` holds 8 star sets with a voice slot, plus the ear/voice knobs and `menu_words`. `stars.js` provides `ear`, `voice`, `progress` and `set`.
- **`say.js`.** The mic button, character hooks and `accept`. One retry, then the pills go live (or on a timer). A refused mic falls back to pills. Also a Grandparent ✓, enrolment, the log, and a pure `Say.machine` for bots.
- **Overlays.** `overlays.json` has 5 bases and 10 layers. `overlay.js` does layout, slots, mirroring, hit tests and canvas drawing with tints, patterns and greyboxes.

## Open
Serve the repo root and open `http://localhost:8800/lab/shared.html`.

## Tests
- `node --test build/test_shared_*.mjs`: 62 pass. That includes a blind bot within 2% of `blindOdds`.
- `node build/test_shared-browser.mjs` (port 8800): passes at 915×375.

## Stubs
The shared modules answer the stubs already pushed:
- `WhichOne.Pick` matches Dress up's `Pick`.
- `balance()` returns Who did it's shape.
- `Stars` takes Snap's rows.
- `accept` covers the clinic's wrong pill.
- `say` takes the say/tell stubs' names (Tidy, Monsoon, Who, Dress up), their audio pills and Monsoon's Busy shrug; `WhichOne.Clinic` is the clinic's `which`.
- `Rel.Tidy` is Tidy up's board dialect, matching its stub on 300 random boards. Which "next to" wins is open for phase B.

The swap table is section 6 of the doc.

## Decisions
- Scene size is `stage` (Find it already uses `size`).
- Rects are `[x0, y0, x1, y1]`.
- `not` means "none does".
- Placeholder rows don't test the ear.
- The clinic's voice star is first try only.
- Templates are family recordings only.
- Who did it uses `Say.tell` instead of writing `js/shared/mechanics/`.

## Phase B
- The shell, wired to `setProfile`/`onLog`.
- Merge `Stars.ICONS` into `UI.ICON`.
- Scene sidecars, the manifest's `dur`/`keyAt`, and full-body bases.
- Tune the overlay anchors on real art.
