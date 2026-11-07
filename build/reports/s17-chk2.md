# s17-chk2: the boil-over driver, the zoom-in light, a lesson surviving a tap, and SH-232's check

Sprint 17, 7 Nov (Zafar's lighter-checks override: no before/after pictures, no judge; browser runs only under the shared lock). Builder s17-chk2, branch `claude/sprint-17-builders-standard-gub2dj`.

## What was built

| Check | Path it needs | What it reads |
|---|---|---|
| contract-96 boil-reopen | `cook:chai-tray#boil-over` | after a pot starts again (the pot's own boil log, `chai-boil again`), the last panel sample within 1.5 s: that person's rows all open, the item row scrolled back to 0 to 2 px |
| contract-97 zoom-in | any light on a DOM part | each lit sequence (the S14 probe's `lit` boxes over time) against the `litthing` sample (the item card or order card under the light's middle): a part settling at under a quarter of its thing must start on at least 60% of the thing; a first box under a quarter is a break |
| contract-98 lesson-shown | `cook:chai-tray@L2#tap-mid-order`, `@L3#tap-mid-order`, `@L2#slow-cards`, `@L3#slow-cards` | a new player's page that shows a dotted word (the `reveal` sample, the game's own selectors) after the station starts must log `reveal-lesson word` with `by` beginning `shown`; same for `pic` and a blurred picture. Not read for #returning, #takeback or a seen profile |
| contract-99 panel-follow | any Cook flow with two or more cards (chai L2 to L4) | every served card's fold (the `fold` sample) is followed, within 420 ms + 400 ms, by the next card (the person the station is on, else the speaking card, else the first not done) whole in view or at its planned place: top 4 px below the panel's top, 0 when it all fits, clamped to the scroll range (2 px slack) |

Files: `build/sandbox/lib/contract-s17.mjs` (the four checks and their registry entries), `build/sandbox/lib/contract-hook.mjs` (a new page sampler `s17hook`, appended to `CONTRACT_HOOK`: events `litthing`, `reveal`, `panel`, `fold`), `build/sandbox/lib/cook-player.mjs` (modes `boil-over`, `tap-mid-order`, `slow-cards`), `build/sandbox/flows/cook.mjs` (the first-time hold marked seen for `#boil-over`), `build/sandbox/contract-s17.test.mjs` (14 tests), `docs/process/checks-to-build.md` (the three marked built). One file outside the brief's list: `build/sandbox/drivers/catalog.mjs` (three data lines; without them `resolveFlow` refuses a new path name).

The drivers: `#boil-over` leaves chai's knob alone at the "Slow kar!" step until the pot's boil log shows `over` and then `again`, then plays on fair. `#tap-mid-order` taps the play area half a second after the first big card is up (the order skips, the cards still landing). `#slow-cards` runs the page's animations at a quarter speed (DevTools `Animation.setPlaybackRate`) for the order's giving and nine seconds on, so the cards land late.

## Proof

Unit tests: `node --test build/sandbox/*.test.mjs`: 181 pass, 0 fail (`contract-s17.test.mjs`: 96 fails when the rows stay ticked or the row stays scrolled; 97 fails for a light drawn straight on a small part or one that starts on half the card; 98 fails for a missing or `none-in-view` lesson; 99 fails for a panel left where it was and for a late move).

Browser runs (shared lock, port 8873, `--contract --no-sheets`; 8852 gave EADDRINUSE at 14:38 from some other process):
- `s17-chk2-a`: `cook:chai-tray#boil-over` at 1280x665: end reached, **CONTRACT PASSED: 0 breaks over 1 pages**. The probe saw the pot boil over at 33.3 s, start again at 34.0 s: rows 4 done to 0 done at once, the item row from 181 px along to 0 by 34.7 s (inside the 1.5 s window).
- `s17-chk2-b`: `@L2` and `@L3` `#tap-mid-order` and `#slow-cards` at 1280x665 and 740x320: all 8 pages reached the end; `reveal-lesson word shown` on every page; 1 break, **contract-74** on `@L3#slow-cards` 1280x665 ("a tap took 1125 ms to land every card, within 1 s"): expected, the path slows the landing on purpose; any slowing past one second trips that check, and it is not a game fault.
- `s17-chk2-c`: the guard, `cook:chai-tray@L2`, `@L3`, `@L4` at 1280x665 and 740x320: all 6 reached the end, **CONTRACT PASSED: 0 breaks over 6 pages**. The frozen run's one break (contract-11 at L4 1920x1080) is a size I did not run. contract-99 judged real folds here (L4: three folds a page; at 740x320 the panel was scrolled to 57 and the next card sat at its 4 px place) and passed; contract-97 judged the reveal lesson's box (a 123x205 card shrinking to a 40x20 word) and passed.

Run folders (git-ignored): `build/screenshots/sandbox/s17-chk2-a`, `-b`, `-c`.

## Limits and things to know

- The picture lesson (`pic`) was never due in these runs: on a fresh chai L2 or L3 player the `reveal` sample counted dotted words (1 to 8) and **no blurred picture** (`eyes` 0 on every page), so contract-98's `pic` half is covered by unit tests only. Zafar's L3 picture lesson will be judged the day a flow shows one.
- contract-97 reads lights on DOM things only (an item card, the order card). A light on a canvas part (a knob's mark) has no DOM thing round it and is not read; the report on that needs a game hook that names the thing a light zooms from.
- The pan in hand (`mission.focusWho`) is private to `js/cook/ui.js`; the sampler wraps `Cook.UI.mission.focus` to record it (a pass-through, no game file touched). If the game ever renames that, contract-99 falls back to the speaking card, then the first card not done.
- contract-96 and contract-99 read Cook's `#mission` panel; the clinic's side panel is not sampled yet.
- Not run: 930x430 and 1920x1080 (the lighter-checks override asked for one size or two).
- docs/tools.md was not edited (not in this session's files): it should list contract-96 to 99 and the three paths.
