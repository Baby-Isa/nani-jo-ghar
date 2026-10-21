# s09-final-door

Branch `worktree-agent-ac8ef1fd208995373` (not pushed: in-chat builder). Runs `s09-final-door-matrix`, `s09-final-door-days`; evidence `s09-final-door-red`, `-green`, `-green2`.

## Flaws first (builder's list; the judge decides)
| # | flaw |
|---|---|
| 1 | Pose changes lag a line at the test speed (3x): "Come!" (wave) can pass in under half a second (DOOR-02 strip). At 1x each pose holds its line |
| 2 | Her bubble has no tail (the shared bubble's tail points down only). At 1024x768 and 800x360 a long line wraps to 3-4 lines |
| 3 | The cloudy sky (s09b art) is bright and close to the sunny one; the contact shadow is a plain ellipse |
| 4 | Card words still to record: "The sun's out!", "Clouds.", "Stars.", clinic, farm, market (grey). The clinic and shops thought bubbles show the card's picture (no cut-out yet) |
| 5 | contract-30 on `day:full-farm` 1366x768: the book's placeholder "What did we do today?" read as the number *do* (the book's line or the tool: not this session's files) |
| 6 | checks.mjs: art check (s09b bicycle, rainbow cuts), load (cook:chop), static (one known finding fixed, `--write-known`): none in my files |

## What was built
| piece | files |
|---|---|
| DOOR-01: the s09b sky as a full layer behind house-empty, roofline at a third, width covered; code moves only rain, twinkle, drifting clouds; old flat house and code sun gone | `js/day/sky.js`, `css/day.css` |
| DOOR-02/03/04: Nani's seven poses at one body height, feet at the foot of the steps, cross-fading by line; her lines in the shared bubble top left; the two sidebar cards (weather, activity) with speaker and Kutchi; Ha! and Na (Na shakes; Ha! goes ahead mid-line) | `js/day/door.js`, `day.html` |
| DAY-01: days as stage lists, one stage interface, day log, unbuilt stages skipped with a lab note; farm day per `days/farm.md` | `data/days.json`, `js/day/day.js`, `build/test_day_runner.mjs` |
| DAY-02: `day:full-farm`, `day:full-kitchen` (ride and book drivers imported); door paths cloudy/raining/night | `build/sandbox/flows/day.mjs`; contract-45 tells a second page's line ids apart (`contract-day.mjs`) |

## Proof
| check | red | green |
|---|---|---|
| DOOR-01 | tool failure (no paths) | 9 panels, for the judge |
| DOOR-02/03 | old door / no sidebar | strip, crops, for the judge |
| DOOR-04 | no `.day-side` | machine PASS, 8 sizes |
| DAY-01 | missing test | machine PASS (10 tests) |
| DAY-02 | unknown flows | both reach their end (`-green2`) |

Matrix `day:door` x 8 sizes: 8/8 end, 0 page errors, 0 lint findings, **0 contract breaks**. `day:full-*`, `day:book`, `day:window` at 1366x768 and 844x390: 8/8 end, 1 break (flaw 5). Shotdiff: all new (no approved day shots). Regression rows for the day flows: 0.

## Requests
- Book owner: "What did we do today?" vs contract-30; `day-window.mjs`/`day-book.mjs` to export a play-on-this-page driver (the day flows wrap their `page.goto` today).
- Orchestrator: approve the day shots; a `vehicle` setting reaches the ride's data but window.js does not use it yet.
