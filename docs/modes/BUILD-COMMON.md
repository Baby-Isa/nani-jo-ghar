# Common rules for the mode build sessions (25 Sept 2026)

Every build session reads this first, then its own mode's design doc (top section "Deep dive, 25 Sept 2026" or, for the clinic, "Revision 3" then "Revision 2", and the build brief at the end), `docs/modes/DEEP-DIVE-BRIEF.md` (the principles), and `docs/cook-with-nani-recipes-guide.md` (how Cook's one-file mechanics, levels-as-data and the Station lab work). Zafar has taken **every default** in the design docs.

## Scope
Build **phases 0 and 1** of your mode's build brief (pure logic, data, the Node leak bot, the lab, and a greybox of the first mini-games), and phase 2 only if it touches nothing but your own files. Stop at a clean, tested point. No new art: greybox shapes or existing sprites only. No story integration and no shell work (the foundation session owns that).

## Files
- **Only your mode's own files**: `<mode>.html`, `js/<mode>/` (mechanics as one file each in `js/<mode>/mechanics/`), `data/<mode>.json` and any sidecar data files your brief names, `css/<mode>.css`, `build/test_<mode>.py`, `build/leak_<mode>.mjs`, `docs/<mode>-build-log.md`.
- **Read, never edit**: `js/cook/*`, `css/cook.css`, `data/cook.json`, `data/kitchen.json`, `js/find/*`, `js/shell.js`, `js/storage.js`, `js/progress.js`, `index.html`, `cook.html`, `find.html`, any other mode's files, and `js/shared/*` (the foundation session owns `js/shared/`).
- **Shared pieces you need but don't have yet** (relations layer, which-one chooser, overlay sprites, star/ear/voice rules, the `say` speaking moment): write a small **stub with the same API in your own folder** (`js/<mode>/stubs/`), clearly marked, so swapping to the foundation's version later is a one-line change. `js/shared/speech.js` already exists: call it, don't copy it.
- **Save and progress**: use the existing `js/progress.js` / `js/storage.js` API if you need persistence, never your own `localStorage` keys, so plugging into the shell later needs no migration.

## Tests
- A Node leak bot (no browser) proving level 1 of each first-set mini-game can't be won blind, with the numbers in your build log.
- Browser tests only if cheap: one at a time, `--canvas`, your own `COOK_TEST_PORT` (Find it 8801, Tidy up 8802, Who did it 8803, Dress up 8804, Monsoon 8805, Clinic 8806, Snap 8807, Foundation 8800).

## Git
- Work on the branch your session was given; commit small and often; push after every meaningful step (`git push -u origin <branch>`, retry on network errors). Never push to `main` or any other branch; never force-push.
- Commit messages end with the Co-Authored-By and Claude-Session lines your system prompt gives.

## Finish
Write `build/reports/<mode>-build.md` (under 400 words): what's built and where, how to open it (the lab URL), the leak-bot numbers, the stubs to swap for shared pieces, what's left for the next phase, and any decision you had to take. Commit, push, and end your turn with the same summary.
