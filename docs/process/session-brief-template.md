# Session brief template

> **Stale points (the rulebook, `docs/process/rules.md`, wins).** The BUILD-COMMON block at the end is copied word for word from 25 Sept; read it with these overrides:
> - "star/ear/voice rules", "Stars" and "Finish ... `docs/<mode>-build-log.md`" → scoring is the three badges (H5, J7, decisions 1–2); a mode's build status now lives in its doc in `docs/game-design/modes/` under "Build status", and the report is `build/reports/<name>.md` (B6).
> - "Do a greybox with no new art", "phases 0 and 1 only", "no shell work" were the scope of the 25 Sept wave; each new brief sets its own scope.
> - "`docs/archive/mode-briefs/DEEP-DIVE-BRIEF.md`" is now `process/mode-design-method.md` § 3; UX principles are `design-language/ux-principles.md`; the design system is `design-language/ui-design-system.md` and `game-design/modes/cook.md`.
> - Test ports 8800–8807 are the 25 Sept allocation; when a new mode needs a port, pick the next free one and record it in `architecture/testing.md`.
> - "Zafar has taken every default in the design docs" was true only for that wave.
> - Browser tests: one at a time, `flock -w 1800 … timeout` (B16); helper sessions never (B3).

Use this for every build session. The rules it draws on are in `process/rules.md` §2 (sessions, agents and git); this file links to them by ID instead of restating them: **B3** (no helper sessions), **B4** (every brief is complete), **B17** (a mode session edits only its own mode's files), plus B16 (browser tests), B6, B7–B9 (publishing) and B18 (big refactors on their own branch). CLAUDE.md, "Briefing a build session", is the short form.

## Fill-in template

Copy this into the session prompt and fill every line. A remote session can't be messaged, so the brief must be complete; to redirect a session, interrupt it and relaunch (B4).

```
SESSION NAME / MODE:            <e.g. Find it, step 3c>
MODEL AND EFFORT:               <top model for judgement and visual work, mid-tier for mechanical work; say which and why>
COST ESTIMATE:                  <before launch, per CLAUDE.md>
HARD STOP:                      <date and time, UK>
BRANCH:                         <the branch the session works on; never main until the final push>

READ FIRST (in this order):
  1. CLAUDE.md (project rules and non-negotiables)
  2. docs/process/rules.md: sections <list>
  3. docs/process/qa-checklist.md (definition of done)
  4. docs/design-language/ux-principles.md
  5. docs/game-design/modes/<mode>.md and the design-language docs it touches
  6. docs/process/regressions.md: rows for the screens you touch

FILES THIS SESSION OWNS (edit only these):   <list>
READ-ONLY (never edit):                      <list, including js/shared/ unless you own it>
SHARED PIECES NEEDED BUT MISSING:            <marked stub with the same API in your own folder>

DO NOT remove or replace any mechanic or mini-game Zafar hasn't commented on.
NO helper sessions or background helpers.
PERMISSIONS NEEDED UP FRONT:                 <network, browser, file paths, git push>

TASKS (numbered, each with its acceptance criterion):
  1. …

TESTS: browser tests one at a time (flock -w 1800 … timeout), own COOK_TEST_PORT = <port>.
FINISH: build/reports/<name>.md, QA checklist results, `python3 build/bump_version.py`, ONE push to main (only when Zafar has approved publishing).
```

## The common rules for mode build sessions

> from: docs/archive/mode-briefs/BUILD-COMMON.md (whole file, headings demoted one level)


Every build session reads this first, then its own mode's design doc (top section "Deep dive, 25 Sept 2026" or, for the clinic, "Revision 3" then "Revision 2", and the build brief at the end), `docs/archive/mode-briefs/DEEP-DIVE-BRIEF.md` (the principles), and `docs/architecture/cook-recipes-guide.md` (how Cook's one-file mechanics, levels-as-data and the Station lab work). Zafar has taken **every default** in the design docs.

### UX principles
Follow `docs/design-language/ux-principles.md` (Zafar's playtest, 25 Sept) in every greybox: request card with read-along, sidebar on the left, one fixed-shape card per item, one light bulb and one speaker per card, one job at a time, level 1 as small as possible, overlay onboarding.

### Scope
Build **phases 0 and 1** of your mode's build brief (pure logic, data, the Node leak bot, the lab, and a greybox of the first mini-games), and phase 2 only if it touches nothing but your own files. Stop at a clean, tested point. No new art: greybox shapes or existing sprites only. No story integration and no shell work (the foundation session owns that).

### Files
- **Only your mode's own files**: `<mode>.html`, `js/<mode>/` (mechanics as one file each in `js/<mode>/mechanics/`), `data/<mode>.json` and any sidecar data files your brief names, `css/<mode>.css`, `build/test_<mode>.py`, `build/leak_<mode>.mjs`, `docs/<mode>-build-log.md`.
- **Read, never edit**: `js/cook/*`, `css/cook.css`, `data/cook.json`, `data/kitchen.json`, `js/find/*`, `js/shell.js`, `js/storage.js`, `js/progress.js`, `index.html`, `cook.html`, `find.html`, any other mode's files, and `js/shared/*` (the foundation session owns `js/shared/`).
- **Shared pieces you need but don't have yet** (relations layer, which-one chooser, overlay sprites, star/ear/voice rules, the `say` speaking moment): write a small **stub with the same API in your own folder** (`js/<mode>/stubs/`), clearly marked, so swapping to the foundation's version later is a one-line change. `js/shared/speech.js` already exists: call it, don't copy it.
- **Save and progress**: use the existing `js/progress.js` / `js/storage.js` API if you need persistence, never your own `localStorage` keys, so plugging into the shell later needs no migration.

### Tests
- A Node leak bot (no browser) proving level 1 of each first-set mini-game can't be won blind, with the numbers in your build log.
- Browser tests only if cheap: one at a time, `--canvas`, your own `COOK_TEST_PORT` (Find it 8801, Tidy up 8802, Who did it 8803, Dress up 8804, Monsoon 8805, Clinic 8806, Snap 8807, Foundation 8800).

### Git
- Work on the branch your session was given; commit small and often; push after every meaningful step (`git push -u origin <branch>`, retry on network errors). Never push to `main` or any other branch; never force-push.
- Commit messages end with the Co-Authored-By and Claude-Session lines your system prompt gives.

### Finish
Write `build/reports/<mode>-build.md` (under 400 words): what's built and where, how to open it (the lab URL), the leak-bot numbers, the stubs to swap for shared pieces, what's left for the next phase, and any decision you had to take. Commit, push, and end your turn with the same summary.
