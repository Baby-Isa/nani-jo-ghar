# Sprint 17: chai's frozen run (7 Nov, 13:29-14:12 UK)

The guard for Sprint 18 (Fable's review of the roll-out plan, 7 Nov; `docs/sprints/S17-chai-done-families.md` "The rest", step 1):
chai as Zafar signed it off (live 20261107T120301Z; this branch's game files are main's), recorded so every switch onto the kits
can be compared with it. `node build/tools/review/frozen.mjs --diff` replays chai and lists every change; exit 1 on any.

| Part | What was played | Result | Where |
|---|---|---|---|
| The contract at L1-L4 at the four sizes | `run.mjs --touched cook:chai-tray`: L1-L4 and the hint, mistake, returning and take-back players, 740x320, 930x430, 1280x665, 1920x1080 (44 pages) | every page reached its end, 0 page errors; **1 contract break, known**: contract-11 at L4 1920x1080, the word-moment counter drawn at 1.58x its source (ART-59, Zafar's open question) | `build/frozen/chai-tray/frozen-chai-20261107-contract.md` |
| One film per level, at a child's pace | the new `lab:cook/chai-tray@L<n>#child` flows (speed 1, the game's real timing; a human's think time of 0.9-2.4 s before each move, `build/sandbox/lib/child-player.mjs`), 1280x665, filmed (`NJG_VIDEO`) | all four reached their end; **0 contract breaks**; the lesson race, the skip and the next-pan light did not show at this pace | `build/frozen/chai-tray/films/` (webm, about 1 MB each, and a sheet of a frame every 3 s) |
| His ear items (the boil loop, the clicks, the pour) | the sound log of every 1280x665 page | each page's boil loop, clicks and pour with their start times, as rows to judge | `build/frozen/chai-tray/ear.md` |
| The fingerprint | per page: reached its end, errors, states, the game's own notes in order, the sounds and their counts, the times of chai's moments | 48 pages | `build/frozen/chai-tray/frozen.json` |

**How Sprint 18 uses it:** after each switch, chai's owner runs `node build/tools/review/frozen.mjs --diff` (quick: 1280x665 and
740x320, about 15 minutes, under `/tmp/njg-browser-all.lock`; `--full` for the four sizes). No change: the switch is safe. A change:
the report names the page and what moved (a state, a note's order, a sound, a moment's time beyond 400 ms or 15%); a film is made
only of that page for the judge. A sound row is judged from the sound log, since the judge cannot hear.

**Not covered:** the device's own audio (the sandbox hears the game's calls, not the speaker); the store build's voice path.

## Proof

Runs `build/screenshots/sandbox/frozen-chai-20261107/` and `build/screenshots/sandbox/frozen-chai-child-20261107/` (not in git;
their contract reports and the films are copied to `build/frozen/chai-tray/`). Determinism: a second play compared with the
frozen one by `frozen.mjs --diff` (the result is added below once it lands).
