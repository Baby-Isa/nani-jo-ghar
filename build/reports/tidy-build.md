# Tidy up: build report (phases 0 and 1)

**Branch:** `claude/build-tidy`. Detail: `docs/tidy-up-build-log.md`.

## Built
- **Phase 0 (pure logic):**
  - `js/tidy/rules.js`: generator for kinds K1–K4 on T1 (shelves, masala dabba), T2 (dastarkhwan), T3 (fruit box), with the solver checks.
  - `js/tidy/bot.js` and `build/leak_tidy.mjs`: the leak bot.
  - `data/tidy.json` and three scene sidecars.
- **Phase 1 (greybox):** `tidy.html`, a lab running each mini-game and each mechanic alone.
  - Mechanics: `place`, `pack`, `stack`, `check` (live at L1, Done after, recasts, "What's this?"), Simba's `paw`, `tell`.
  - Games: T1–T3 at levels 1–3, T2 fetch-and-lay at L3, and T4 Ali's turn with pills and a parent fallback.

## Open it
`python3 -m http.server 8802`, then `http://localhost:8802/tidy.html` (the lab). Direct: `tidy.html?play=1&game=box&level=2`.

## Leak bot (`--gen 1000 --bot 500`)
- **Bot:** every strategy under 10% everywhere except Reader. Worst: elimination 6.0%, trayorder and copylast 5.0%, waiter 0%.
- **Reader** (the English placeholder hole): T2 95–100%, T1 L1 16%.
- **Ali by pills alone:** L1 3–7%, L3 0%.
- **Generator:** 100% of rounds pass checks 1–4; priors are 1.02–1.24×. One pair cell is flagged at seed 1 (z = 4.3); it doesn't reproduce at 4,000 rounds, so I read it as chance. The script still exits 1 on it at seed 1.

## Browser tests
`python3 build/test_tidy.py --lab --sizes --rel` passes:
- 42/42 relation cases.
- Every game at L1–3, and all six sizes.
- In every run: tap-cover checks, deliberate mistakes, no item labels, no hover feedback, no console errors.

I looked at the screenshots (`build/screenshots/tidy/`).

## Stubs to swap (`js/tidy/stubs/`)
- `rel.js` → `js/shared/rel.js`.
- `say.js` → the foundation's `say`. It already calls `js/shared/speech.js`.
- `fetch.js` and `passme.js` stand in for Cook's Phaser-drawn versions.
- `relations` and `star_sets.tidy` in `data/tidy.json` → the shared data.

## Next phase
- Swap the stubs and re-run the bot.
- Wire up the shell, progress, and the Find it basket as T1's tray.
- Build speaking moments S3 and S4.
- Try the recogniser with a real microphone.
- Second set: `order` and `pair`, placement sounds.

## Decisions I took
- The dabba starts at level 2 and has no "next to" rows (the tin is too small for 3 options a row).
- Class and "nothing" rows only come in K4 rounds.
- Level 1 shelves show 8 spots (G1 beats "≤6").
- Places are drawn uniformly, so priors stay flat.
- No persistence yet.
