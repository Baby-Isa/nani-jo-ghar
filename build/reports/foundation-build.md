# Foundation build, phase A (25 Sept 2026)

Branch `claude/build-foundation`. The contract for all of this is `docs/shared-api.md`. Only new files were touched, plus `js/shared/speech.js`.

## What's built
All six pieces are plain UMD files: each is a global plus `window.Shared.*` in the browser, and `require()` in Node.

- **Speech, finished (`js/shared/speech.js`).** The `listen({choices, timeoutMs})` API is unchanged.
  - Enrolment is per profile, capped at 3 takes per word.
  - `confirm()` applies the plan's rule: a parent always enrols; the game only at margin ≥ 0.4.
  - Also added: `cancel`, mic `status`, `templateUrls` from the manifest, and a parent log (`logMoment`, `onLog`).
  - Audio is dropped once its features are taken: `Speech.last` keeps features only.
- **Relations.** `data/relations.json` holds 17 relations, all placeholder words, plus aliases and grammar. `js/shared/rel.js` checks rows two ways:
  - the Find form, `holds(item, where)`, matching by anchor word;
  - the board form, `holds` / `options(state, rule, scene)`, covering all eight Tidy up rule types, with `check`, `solve`, `phrase`, sidecar merging, `validate` and `visibleFraction`.
  - The scene schema is specified in the doc. Find it's live bazaar scene validates as it stands.
- **Which-one (`js/shared/whichone.js`).**
  - The decoy rule, rack builder, look-alike candidates, line-up balance, consistency and the lucky-guess rule.
  - Blind odds: `blindOdds` per row and `setOdds` for picking a set, using Dress up's priors (uniform, strictly most common, salience).
  - `fitBudget` grows a round until it is at or under 5%.
- **Stars.** `data/shared/stars.json` holds star sets for all 8 modes plus a voice slot, and the knobs `earPass`, `minTested`, `taughtStage`, `placeholdersTested`, `voicePass`/`voiceMin`, `firstTry`, `minConfidence`, the Busy weights and `menu_words`. `js/shared/stars.js` provides `ear`, `voice`, `progress`, `set` and `installInto`, plus SVGs for the eight new icons.
- **Say (`js/shared/say.js`).** The speaking moment on screen:
  - a mic button with listening and speaking states, character hooks and `accept`;
  - one "say it again", then the pills go live (or on a timer);
  - a refused mic falls back to pills;
  - Grandparent ✓, enrolment and the log.
  - A pure `Say.machine` sits underneath for bots.
- **Overlays.** `data/shared/overlays.json` has 5 bases (anchors measured on the three upper-body crops) and 10 layers. `js/shared/overlay.js` handles layout, slots, mirroring, hit tests and canvas drawing, with code tints, patterns and a greybox for everything.

## How to open it
`lab/shared.html` (serve the repo root, e.g. `http://localhost:8800/lab/shared.html`) shows overlays with their anchors, a say moment, the relations and the star slots.

## Tests
- `node --test build/test_shared_*.mjs`: **57 pass**. This includes a Monte Carlo bot that agrees with `blindOdds` within 2%, and the stub-shape tests.
- `node build/test_shared-browser.mjs` (port 8800): passes, and the say panel fits 915×375.

## Stub swaps
I read the stubs already pushed and made the shared modules answer their shapes:
- `WhichOne.Pick` is Dress up's `Pick`;
- `balance()` returns Who did it's `counts`, `distinct` and `median`;
- `Stars.ear` / `voice` take Snap's rows and return `offered` and `earned`;
- `accept()` covers the clinic's wrong-pill behaviour.

The per-mode swap table is `docs/shared-api.md` section 6.

## Decisions I took
- Scene dimensions are `stage: [w, h]`, because Find it already uses `size` for item size. Rects are `[x0, y0, x1, y1]`; `box: [x, y, w, h]` is also accepted.
- `not` rules mean "no matching item does it".
- Placeholder rows don't count for the ear.
- The clinic's voice star counts the first try only.
- Only `word`-kind family recordings are templates.
- Who did it should use `Say.tell`, not write `js/shared/mechanics/tell.js`.

## Left for phase B
- the shell, with `Speech.setProfile` and `onLog` wired to the profile;
- merging `Stars.ICONS` into `UI.ICON`;
- merging the scene sidecars;
- `dur` and `keyAt` in the audio manifest;
- full-body bases;
- tuning the overlay anchors against real art.
