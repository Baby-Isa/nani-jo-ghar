# The chai standard: now a folder

Chai is the reference game (Zafar, 2 Nov), **signed off 7 Nov** ("done and complete as a reference point for the other games";
live 20261107T120301Z; the 88 px phone glasses and the side panel moving unscrolled on phones, as built).

Its rules now live in **the standard folder, `docs/design-language/standard/`** (Zafar, 7 Nov, Sprint 18's decision 12: "the
standard is a folder, not one page"), in the structure he locked on 5 Nov (`build/reports/s17-standards-structure-v2.md`): start at
its `README.md`. Every rule this page held, every row it cited and every change in the Sprint 16-17 ledger is placed there once
(`placement.md`, checked by `node build/tools/review/stdids.mjs --check`); what became no rule is the dropped list
(`build/reports/s17-dropped-list.md`), for Zafar to read whenever he likes.

- How a game measures itself against it: `node build/tools/review/audit.mjs --standard <game>`; a game's gap page is
  `docs/design-language/standard/gaps/<game>.md` (Sprint 18).
- Where each of chai's pieces lives and moves to: `docs/architecture/module-map.md`.
- Chai unchanged in behaviour while its code moves into the kits: `node build/tools/review/frozen.mjs --diff`
  (`build/reports/s17-frozen-run.md`).

The page as signed off (sections 1-6 and the three layers) is in git: `git show 50e660f:docs/design-language/chai-standard.md`.
