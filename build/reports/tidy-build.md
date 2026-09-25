# Tidy up: build report (phases 0 and 1)

**Branch:** `claude/build-tidy`. Full detail in `docs/tidy-up-build-log.md`.

## Built
- **Phase 0 (pure logic, Node):**
  - `js/tidy/rules.js`: generator for kinds K1–K4 on T1 (shelves, masala dabba), T2 (the dastarkhwan) and T3 (the fruit box), with the solver checks.
  - `js/tidy/bot.js` and `build/leak_tidy.mjs`: the leak bot.
  - `data/tidy.json` and three scene sidecars (`data/scenes/*-tidy.json`).
- **Phase 1 (greybox):** `tidy.html`, a lab running each mini-game and each mechanic alone.
  - Mechanics: `place`, `pack`, `stack`, `check` (live at L1, Done after, recasts, "What's this?"), Simba's `paw`, `tell`.
  - Games: T1–T3 at levels 1–3, T2's fetch-and-lay at L3, and T4 Ali's turn on all three with pills and a parent fallback.

## Open it
`python3 -m http.server 8802`, then `http://localhost:8802/tidy.html` (the lab). A round starts straight away from the URL, e.g. `tidy.html?play=1&game=dastarkhwan&level=2`.

## Leak bot (`node build/leak_tidy.mjs --gen 1000 --bot 500`)
- **Bot:** every strategy under 10% on every game, level and kind, except Reader. Worst cells: elimination 6.0%, trayorder and copylast 5.0%, prior 4.4%, convention 4.0%, liveprobe 2.8%, waiter 0%.
- **Reader** (the English placeholder hole, not a code leak): T2 95–100%, T1 L1 16%.
- **Ali by pills alone:** L1 3–7%, L3 0%.
- **Generator:** 100% of rounds pass checks 1–4. Flat priors are 1.02–1.24×. One pair cell is flagged at seed 1 (z = 4.3); it doesn't reproduce at 4,000 rounds, so I read it as chance. The script still exits 1 on it at seed 1.

## Browser tests
`python3 build/test_tidy.py --lab --sizes --rel` passes:
- `--rel`: 42/42 relation cases.
- `--lab`: every game at L1–3.
- `--sizes`: all six screen sizes.
- In every run: the tap-cover check before each tap, deliberate mistakes, no text on items, no hover feedback, no console errors.

I looked at the screenshots, which are in `build/screenshots/tidy/`.

## Stubs to swap (`js/tidy/stubs/`)
- `rel.js` → `js/shared/rel.js`.
- `say.js` → the foundation's `say`. It already calls `js/shared/speech.js`.
- `fetch.js` and `passme.js` stand in for Cook's versions, which are Phaser-drawn.
- `data/tidy.json` `relations` and `star_sets.tidy` → the shared data.

## Next phase
- Phase 2: swap the stubs; re-run the bot on the shared checker; hook into the shell and progress; use the Find it basket as T1's tray.
- Speaking moments S3 and S4 aren't built.
- Not yet tried with a real microphone and the family's templates.
- Still to come: `order` and `pair` (second set), placement sounds, the secrets album and records.

## Decisions I took
- The dabba starts at level 2 and has no "next to" rows: the tin is too small for 3 options a row.
- Class and "nothing" rows only come in K4 rounds.
- Level 1 shelves show 8 spots: G1's "items + 3 free" wins over "≤6".
- Places are drawn uniformly, so priors stay flat.
- No persistence in phase 1.
