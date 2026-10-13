# R7: refactor leftovers closed (decision 45)

No game behaviour changed. `checks.mjs`: 229 tests pass. `check_stamps`: 259 requests, 0 unstamped. `demo-browser` (lab.html): passed, lint clean.

| # | Result | Proof |
|---|---|---|
| 1 | Done | `bump_version.py --dry-run` lists the 29 mapped modules (host, mode, input, demo, core, engine), tokens.css, and says data is stamped in code. |
| 2 | Done | 14 files, URL lines only; `Snap/Tidy/Find.picture`, `Dress.face` stamp at the source. `check_stamps` clean on all six. |
| 3 | Done | `lab.html` passes `frame: {root, play, own}`. `labs.html` and `docs/README.md` already listed kit and building-games. |
| 4 | Already passing | Every `test_shared_*` passes. |
| 5 | Done | `Bulb.cookShim` deleted; no caller. |
| 6 | Done | Floor is 0.15 px under 14; fixture and test added. |
| 7 | Done | 20 configs. Heal games share the loop (8 identical, 4 differ in sampling only, same verdict). Eight bespoke bots moved to `leak-games/` behind `"script"` configs, output identical. Old commands are thin wrappers. |
| 8 | Done | `build/tools/art/requirements.txt`; `artjudge.py` runs fully: 76 images, 0 fail. |
| 9 | Partly | New `checks.mjs` enforces `words --strict --only a` on js/cook (0 literals). js/clinic has 72: marked ready in `words-gate.json`; proven to fail if enforced. |
| 10 | Done | `statuscounts --write` updated 4 table rows; PAN-01 and SEK-09 prose still needs hand edits. |
| 11 | Done | `publish.mjs --via api` (auto fallback) and `--pages <sha>` use `/actions/runs`; proved on main's deployed commit. No screenshot on that path. |
| 12 | Done | Lists weren't in the report, but the manifest holds every take: `mumitems.mjs` rebuilt and committed all three. Replay check: 4 of 6 clips byte-identical, 2 same length. |

## Found, not mine
- **`find.html` is broken by 4d:** it loads `js/cook/lang.js`, but `js/cook/ui.js` calls `Lang.known` (only in `words.js`). The flow no longer ends.
- `leak tidy` fails one flat-priors cell (1.67x), before and after my change.
