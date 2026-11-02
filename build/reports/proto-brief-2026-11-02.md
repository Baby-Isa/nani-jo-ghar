# Overnight prototype brief (2 Nov 2026): every builder reads this first

Zafar, 2 Nov: "go make all prototypes (incorporate lessons learnt from the prototypes thus far, and chai game) ... ensure it's rapid
prototyping, minimal checks and quick mode ... Save work regularly". You build one game area's lab prototypes in your own worktree.
The orchestrator judges, merges and pushes. The queue and who has what: `build/reports/proto-queue-2026-11-02.md`.

## Read first (only these)
- `CLAUDE.md` non-negotiables (Kutchi only from the language engine; no written English for the child; the leak test; nothing makes a
  child feel bad; the family's rules: halal, modest, no sweets as rewards, no other faith's symbols).
- Your area's design and its critique in `build/reports/designs/` (e.g. `town-map.md`, `town-map-critique.md`), and its section of
  `build/reports/designs/games-at-a-glance-2026-11-01.md`.
- Zafar's rules for prototypes: `build/reports/designs/prototype-notes-2026-11-01.md` (they win over the designs) and his answers
  `build/reports/designs/zafar-answers-2026-11-01.md`.
- The lessons: `docs/feedback/chai-play-2026-11-01-night.md` §1a (the shared rules from chai) and `docs/feedback/farm-prototypes-2026-11-02.md`.
- The pattern to copy: the farm prototypes (`js/farm/kit.js`, `main.js`, `play.js`, `feed.js`, `eggs.js`; `css/farm.css`; their entries
  in `lab.html` and `labs.html`). Kitchen prototypes: `js/cook/stations/eggs.js` and their lab entries.

## The layout for any game whose order is a sentence (Zafar, 2 Nov: mock-ups in `sources/art/mockups-2026-11-02/`)
- **The helper's box** (Nani, Hannah Mami, the doctor ...): her one instruction at a time, big, its key words underlined; her
  speaker in the corner of her face (as `feed-B-yard.webp`), so the words get the room.
- **Use the shared word tiles** (built tonight): `js/shared/word-tiles.js` + `css/shared/word-tiles.css` (`mountTiles(parent, groups,
  {shown, onSpeak, onReveal})`; the farm kit's `F.sentence(groups)` shows how). Don't copy it. Group labels: Kutchi where the engine has
  the word, else grey English to record (no written English for the child). Use a free port for labcheck: `COOK_TEST_PORT=88xx`.
- **Word tiles under her:** small cards grouped under labels (Animals / Food, Hens / Eggs ...): the picture, the word under it and a
  **big speaker under the word** ("I want to encourage listening": the tile look of `feed-B-yard.webp` with the larger speaker of
  `feed-B-barn.webp`). Laptop: a grid as `eggs-B-grid.webp`. Phone: two labelled strips that scroll sideways as `eggs-C-strips.webp`
  (rapid: laptop first; the strips only if cheap).
- **The tiles never give the answer:** a tile for every thing in the scene, asked for or not; no glow on the asked tiles (a tile lights
  only while its word is spoken, and only while that word is supported); the picture always stays, the word dots out on the word
  ladder and revealing it costs accuracy; neutral pictures for a pair tile (small/big) and a plain tile (a hen in no scene colour);
  items repeat, so the last one is never forced by elimination; a wrong pick does nothing bad (she says it again, nothing marked).
- Games that are not a sentence order keep chai's order card (`js/shared/order-card.js`) and chai's rules.

## Rules for every prototype
- **Kutchi:** only what the language engine (`Lang`, `data/lang/`) can say. A missing word or line is its English in grey italic,
  marked to record. Never invent Kutchi; list every missing word in your report.
- **Shared screens and buttons** from `js/shared/` and `css/shared/`, never restyled per game. No hard-coded px in `css/shared/`.
- **Art:** reuse what's in `assets/` and `sources/art/`; a plain placeholder at the final size where nothing fits; list art needs.
  No image APIs.
- **Rapid:** laptop 1280x665 only. Levels 1 and 2 first; 3 and 4 if time allows. Each game gets a lab card in `labs.html` (its area's
  section) and plays from `lab.html?mode=<mode>&game=<id>&level=N`.
- **Minimal checks:** `node --check` on every changed JS file, then one lab shot per game:
  `node build/tools/review/labcheck.mjs lab.html "mode=<mode>&game=<id>&level=1&nonav=1&seed=7&speed=3" --sizes 1280x665 --wait 15000 --play --until <a selector of yours>`.
  Look at the shot; fix what's plainly broken. No judge, no full checks (the orchestrator runs them at the merge).
- **Save often:** commit after every game in your worktree ("proto(<area>): <game>", ending with the two trailer lines below). Never
  push. Never edit `docs/process/regressions.md`, `docs/status.md` or `CLAUDE.md`.
- **Hand back** within about 90 minutes, finished or not: a report `build/reports/proto-<area>-2026-11-02.md` (per game: what plays,
  levels, the lab link, what's missing: words, art, rules), committed.

Trailer lines for every commit:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014xb3kPUK1dLgRuto55UQH5
