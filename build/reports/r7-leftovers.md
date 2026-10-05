# R7: refactor leftovers closed (decision 45)

No game behaviour changed. `node build/tools/review/checks.mjs`: 229 unit tests pass, word gate, bump dry run. Browser: `check_stamps` 259 requests, 0 unstamped; `demo-browser` (lab.html) all passed, lint clean.

| # | Result | Proof |
|---|---|---|
| 1 | Done | `bump_version.py --dry-run`/`--list` names the 29 mapped modules (host, mode, input, demo, core, core/lang/engine), tokens.css, and says data is stamped in code. Already mapped; now visible. |
| 2 | Done | 14 files, only URL lines: pictures, faces and speech clips now `Cook.v()`; `Snap/Tidy/Find.picture` and `Dress.face` stamp at the source. `check_stamps` clean on all six. |
| 3 | Done | `lab.html` passes `frame: {root, play, own}`. `labs.html` already had `lab/kit.html` (regenerated, no diff); `building-games.md` already in `docs/README.md`. |
| 4 | Already passing | Every `build/test_shared_*` passes (stars still exists). |
| 5 | Done | `Bulb.cookShim` deleted; no caller anywhere. |
| 6 | Done | Text floor is 0.15 px under 14, so 14 px at a 0.995 scale isn't flagged; fixture and test added (6 pass). |
| 7 | Done | Configs for all 20 scripts. Heal games share the loop (8 identical output, 4 differ only in sampling, same verdict). Eight bespoke bots moved to `leak-games/` behind `"script"` configs; output identical line for line. Old commands are thin wrappers. |
| 8 | Done | `build/tools/art/requirements.txt`; installed; `artjudge.py` full run: 76 images, 59 pass, 17 flag, 0 fail. |
| 9 | Partly | New `checks.mjs` (the standard command) enforces `words --strict --only a` on js/cook (0 literals). js/clinic has 72, so it's "ready" in `build/lint/words-gate.json`; flip when 4e reports 0. Proven to fail when clinic is enforced. |
| 10 | Done | `statuscounts --write`: 4 rows of the table. It flags PAN-01 and SEK-09 prose by hand. |
| 11 | Done | `publish.mjs --via api` (auto-fallback) and `--pages <sha>` ask `/actions/runs?head_sha=` (the proxy blocks `/pages/builds`). Proved on main's real commit (deployed). No screenshot on that path. |
| 12 | Done | Lists weren't in the report, but the manifest holds every take: `mumitems.mjs` rebuilt all three (51-74 items each), committed beside the recordings; `mumround` finds them. Replay check: 4 of 6 clips byte-identical, 2 same length. |

## Found, not mine
- **Find it's page is broken by 4d:** `find.html` still loads `js/cook/lang.js`, but `js/cook/ui.js` now calls `Lang.known` (only in `words.js`): "Lang.known is not a function", the flow no longer ends. Needs a 4d/parked-modes fix.
- `leak tidy` fails a flat-priors cell (fru-05@in|corners 1.67x) before and after my change; the bare old command only printed usage.
