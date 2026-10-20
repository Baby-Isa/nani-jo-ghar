# s08 wave 6F: wiring the art that has landed (builder report; not judged)

Branch `worktree-agent-a523f54cd37c6e58c` from `265b0d07`. Not pushed (orchestrator's override).

## Flaws first

1. **ART-11 is mostly outside my files.** The judge's butter cubes are the chaat jar (`assemble.js` POTS `pot-potato-v2`) and strip (`strip-potato-s08b`); samosa's filling is `fill-potato.webp` (`samosa.js` HEAP_ART); daar's chopped potato is the old `veg-bataato-cubed-t` (`daar.js` CHOPPED). All still butter-yellow. Requests below.
2. **ART-19 C/D:** Cook's counter Nani (`stations.js` talk) shows one static talk frame. ART-19 A/B: the eye probe never films a line. Neither is in my files.
3. **CLN-189's probe** shows `lemon-half.webp` as a fixed reference, so its sheet can't change.
4. At 800x360 the boing ✓ covers the third plaster tile (it did before too). CLN-106 D1 (L3): the room is blank cream for a moment.
5. Small: the plaster on the arm has no contact shadow; the speaker badge sits on Nani's mouth corner; the pass-me potato is a pile with no bowl.

## What changed

- **Potato:** `veg-01.bowl` is now PT1's pile and `.raw` is PT1's cube. `art.js` `refUrl` accepts a whole `assets/` path. The station manifests were updated.
- **Lemon:** `eye.json` `chart_nouns` uses `lemon-whole-s08b`.
- **Boing:** `art.plasters` holds the level plaster (B1 tray) in four colours and skin, used in the tool column and on the arm. `machine_s02` is removed. The `assets` list was updated. The drop machine and levers were already wired.
- **Guide box:** the mouth flaps between talk and rest every 130-210 ms while she talks. She blinks at rest by herself unless the host just blinked her.

## Proof

| Check | Result |
|---|---|
| `checks.mjs` (no browser) | unit 422 pass; words, static, leak, bump, docs, size ok; **specs FAIL**: 10 flows missing from `run.mjs --list` (not touched here) |
| loadcheck, 6 pages | ok |
| sandbox `w6f-sb`, 6 flows | passed, 0 findings |
| evidence `w6f-green` | 6 sheets for the judge |

Open rows: ART-11, ART-19 (requests); ART-20 (`clinic-items.md` table); CLN-189 (probe).
