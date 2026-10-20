# s08 evidence specs for the 75 unspecced rows

The 75 rows that `evidence.mjs --plan --sprint --since 38d0591a` listed under "NO SPEC" now each have an entry in `build/sandbox/data/evidence.json`, written in the existing format from the row's own words (`docs/process/regressions.md`). Nothing was played: no browser was used, so every probe is checked by the planner only.

Where a contract check already covers a row (27 to 37, 50, 70, 71, 26, 16, 2, 34) the probe points at it with `expect: pass`. Rows whose Check is a text rule (SH-109, SH-111, SH-116) or a repo script (SH-115, MAA-17, CHT-14, CLN-172, CLN-189) use `cmd:` probes. Everything else is a crop, zoom or filmstrip with the row's question in the note and no expect, so the judge decides.

Rows waiting on art still to be drawn are `human` (CHAI-26, CHT-13, CLN-175, CLN-180, CLN-186, CLN-192, CLN-193, ART-22), as is MAA-16 (waiting on Mum). SH-104 and CLN-196 are `needs-decision`.

Gaps for the owner: the clinic has no replay-tap driver, so the clinic half of SH-102 (SH-114) is not probed. SH-98 and SH-110 drop one probe each to stay at three: the samosa headline question (SAM-23) rests on contract-27 and 30, and the daar station is left out of SH-110's contract probes. CLN-182 has no decisive expect because the tooth hook returns a layout object, not boxes.

## Proof

- `evidence.mjs --plan --sprint --since 38d0591a`: 134 rows with a spec, 0 without, 0 spec errors, exit 0.
- `node --test build/tools/review/evidence.test.mjs`: 22 pass. `--lint-specs`: 0 new flags.
- Counts: 22 rows with a machine expect, 47 with a judge question, 9 human, 2 needs-decision (rows can have both).

## Rows and probes

| Row | Kind | Probes |
|---|---|---|
| SH-98 | mixed | cook:samosa L3 #hint @ visible:#mission .oc-card.peek: crop #mission + contract:27 + contract:29 = pass<br>clinic:waiting L3 #hint @ peek-waiting: crop .cl-side + contract:27 + contract:28 + contract:29 = pass<br>clinic:heal-ear L3 @ heal-ear-start: crop .cl-side (judge) |
| SH-99 | machine | cook:fetch L23 @ page:end: contract:30 = pass<br>clinic:patient @ page:end: contract:30 = pass<br>clinic:heal-boing L12 @ heal-boing-start: crop .cl-side + contract:30 = pass |
| SH-107 | machine | cook:chai-tray L3 @ popup-open: crop .njg-rq-card + contract:33 = pass<br>clinic:waiting L3 @ popup-open: crop .njg-rq-card + contract:33 = pass |
| SH-91 | judge | cook:fetch @ view-pantry: shot + contract:11 (judge)<br>cook:chai-tray @ view: shot + contract:11 (judge)<br>clinic:waiting @ rec:stage-waiting: shot + contract:11 (judge) |
| SH-97 | judge | cook:chai-tray @ every:placed: voice + crop #mission (judge)<br>cook:chaat @ every:placed: voice + crop #mission (judge) |
| SH-102 | machine | cook:chai-tray #hint @ page:end: contract:31 = pass<br>cook:fetch #hint @ page:end: contract:31 = pass |
| SH-103 | mixed | cook:chai-tray @ results-words: crop .rs-card + contract:32 = pass<br>cook:chai-tray #mistake @ results-words: crop .rs-card (judge) |
| SH-104 | needs-decision | cook:chaat #mistake @ visible:.njg-results .rs-p3 .rs-step: crop .njg-results (judge) |
| SH-105 | machine | cook:chai-tray @ page:end: contract:2 = pass<br>cook:samosa @ page:end: contract:2 = pass<br>cook:chaat @ page:end: contract:2 = pass |
| SH-106 | machine | cook:mishkaki-grill @ every:visible:.njg-btn: zoom2 .njg-btn + contract:34 = pass<br>cook:samosa @ every:visible:.njg-btn: zoom2 .njg-btn + contract:34 = pass |
| SH-108 | judge | cook:chai-tray L13 @ kind-tap: shot (judge)<br>cook:samosa L13 @ view: shot (judge)<br>cook:daar L13 @ kind-tap: shot (judge) |
| SH-109 | machine | repo @ now: grep -n "L1-L4" .claude/skills/feedback/SKILL.md = pass<br>repo @ now: grep -n "L1-L4" .claude/skills/review/SKILL.md = pass |
| SH-110 | machine | cook:chai-tray L34 @ page:end: contract:35 + contract:36 + contract:37 = pass<br>cook:mishkaki-grill L34 @ page:end: contract:35 + contract:36 + contract:37 = pass<br>cook:maani-line L234 @ page:end: contract:35 + contract:36 = pass |
| SH-111 | machine | repo @ now: grep -n "go-on button" .claude/skills/review/SKILL.md = pass<br>repo @ now: grep -n "fold" .claude/skills/review/SKILL.md = pass |
| SH-112 | judge | clinic:heal-boing @ heal-boing-start: crop .hs-tools (judge)<br>clinic:heal-fever @ heal-fever-start: crop .hs-tools (judge)<br>clinic:heal-foot @ heal-foot-start: crop .hs-tools (judge) |
| SH-113 | judge | cook:chai-tray @ order-card-in-sidebar: zoom2 #mission (judge)<br>clinic:waiting @ rec:stage-waiting: zoom2 .cl-side (judge)<br>clinic:diagnosis @ rec:stage-diagnosis: zoom2 .cl-side (judge) |
| SH-115 | mixed | repo @ now: node build/tools/art/artcheck.test.mjs = pass<br>repo @ now: grep -n "thermometer\/tweezers\/toe\/bottle" build/tools/art/artcheck-known.json (judge) |
| SH-116 | machine | repo @ now: grep -n "told before" .claude/skills/feedback/SKILL.md = pass<br>repo @ now: grep -n "told before" .claude/skills/review/SKILL.md = pass |
| CHAI-22 | machine | cook:chai-tray L23 @ page:end: contract:71 + contract:30 = pass |
| CHAI-24 | machine | cook:chai-tray L12 @ page:end: contract:70 = pass |
| CHAI-25 | judge | cook:chai-tray #hint @ hint-glow: zoom2 hook:cook.glowing + zoom2 canvas:pan (judge) |
| CHAI-26 | human | Waits on the big art run: when the pour frames land (the pan turned about 20 degrees towards the player in fou |
| SEK-18 | machine | cook:mishkaki-grill @ page:end: contract:36 + voice = pass |
| SEK-19 | judge | cook:mishkaki-grill @ every:placed: dom:#mission + voice (judge) |
| SEK-20 | judge | cook:mishkaki-grill L1234 @ kind-timing: shot (judge)<br>cook:mishkaki-grill L14 @ kind-timing: shot (judge) |
| SEK-21 | judge | cook:mishkaki-grill @ order-card-in-sidebar: crop #stage (judge) |
| SAM-21 | judge | cook:samosa L1234 @ kind-swipe: strip canvas:sv3-fold (judge)<br>cook:samosa @ every:cook:swipe: crop #stage (judge) |
| SAM-22 | judge | cook:samosa L1234 @ every:placed: crop #stage (judge) |
| SAM-24 | machine | cook:samosa L34 @ page:end: contract:50 = pass |
| SAM-25 | judge | cook:samosa L1234 @ kind-click: shot (judge) |
| MAA-15 | judge | cook:maani-line @ every:placed: voice (judge) |
| MAA-16 | human | Waits on Mum: when she records the 'and' join, play maani at level 3 and listen that Nani says the 'and' betwe |
| MAA-17 | mixed | repo @ now: grep -n '"flipAddS": 0.75' data/stations/maani-line.json = pass<br>cook:maani-line L14 @ kind-timing: strip #stage (judge) |
| CHT-12 | judge | cook:chaat @ view-marble: zoom2 canvas:cv3-bowl (judge) |
| CHT-13 | human | Waits on art: when the chaat items and the redrawn side-on bowl (a horizontal strip) land, look at every item  |
| CHT-14 | mixed | repo @ now: node build/tools/review/leak.mjs chaat = pass<br>cook:chaat #mistake @ retry: strip #stage + crop #mission (judge) |
| CHT-15 | judge | cook:chaat #mistake @ results-badges: crop #mission + dom:#mission (judge) |
| CK-47 | judge | cook:chai-tray @ results: shot + voice (judge)<br>cook:day2 @ every:drv:dish-served: shot + voice (judge) |
| CK-48 | judge | cook:chop @ start: strip #stage (judge)<br>cook:samosa @ start: strip #stage (judge) |
| CLN-159 | machine | clinic:heal-boing @ heal-boing-start: crop .cl-stage = count:.cl-lab-out=0<br>clinic:morning @ every:rec:stage: crop .cl-stage = count:.cl-lab-out=0 |
| CLN-162 | judge | clinic:heal-fever @ heal-fever-start: zoom2 .cl-heal (judge)<br>clinic:diagnosis @ rec:stage-diagnosis: zoom2 .cl-stage (judge)<br>clinic:waiting @ rec:stage-waiting: zoom2 .cl-stage (judge) |
| CLN-163 | judge | clinic:heal-tooth #real-pace @ zoom-in: strip .cl-heal (judge)<br>clinic:heal-tooth L123 @ heal-tooth-start: zoom2 .cl-heal (judge)<br>clinic:heal-eye #real-pace @ zoom-in: strip .cl-heal (judge) |
| CLN-164 | judge | clinic:heal-boing @ heal-boing-start: zoom2 .cl-heal (judge) |
| CLN-165 | judge | clinic:heal-boing @ heal-boing-start: crop .cl-heal (judge) |
| CLN-166 | judge | clinic:heal-boing L2 @ every:step:lever: zoom2 .cl-heal (judge) |
| CLN-167 | judge | clinic:heal-boing @ heal-boing-mid: strip .cl-heal (judge) |
| CLN-168 | judge | clinic:heal-boing @ step:wipe: strip .cl-heal (judge) |
| CLN-170 | machine | clinic:heal-boing L12 @ every:step: crop .cl-heal = count:.hs-count,.cl-tally-chip<=1 |
| CLN-172 | judge | repo @ now: grep -n '"game": "cut"' data/clinic/pipeline.json (judge) |
| CLN-173 | judge | clinic:heal-ear @ step:tweezers: strip .cl-heal (judge) |
| CLN-174 | judge | clinic:heal-ear @ heal-ear-start: zoom2 .cl-heal (judge) |
| CLN-175 | human | Waits on the s08b art: when the photographic thermometer lands, look at the fever game (the strip and in her m |
| CLN-176 | judge | clinic:heal-fever #real-pace @ every:bubble: crop .cl-heal + voice (judge) |
| CLN-177 | judge | clinic:heal-fever @ heal-fever-mid: zoom2 .cl-heal (judge) |
| CLN-178 | judge | clinic:heal-fever L123 #real-pace @ zoom-out: strip .cl-heal (judge)<br>clinic:heal-knee L123 #real-pace @ zoom-out: strip .cl-heal (judge) |
| CLN-179 | judge | clinic:heal-knee L3 @ every:step:dot: zoom2 .cl-heal (judge) |
| CLN-180 | human | Waits on the s08b art: when the redrawn toothbrush lands, look at the brushing view and say whether the bristl |
| CLN-181 | judge | clinic:heal-tooth @ heal:fill: strip .cl-heal (judge) |
| CLN-182 | judge | clinic:heal-tooth @ step:fill: crop .cl-heal (judge) |
| CLN-183 | judge | clinic:heal-tooth @ step:fill: zoom2 .cl-heal (judge)<br>cook:stir @ stir-mid: zoom2 hook:cook.gauge (judge) |
| CLN-184 | judge | clinic:heal-tooth #mistake @ heal-tooth-slip: strip .cl-heal (judge) |
| CLN-186 | human | Waits on the s08b art: when the photographic drops and the re-cut bottle land, look at the eye game at level 3 |
| CLN-187 | judge | clinic:heal-eye L23 @ heal-eye-start: dom:.cl-side + crop .cl-side (judge) |
| CLN-188 | judge | clinic:heal-eye L1234 @ eye-test: shot (judge) |
| CLN-189 | judge | repo @ now: node build/tools/review/heal-marks.mjs --pool eye + ref:assets/clinic/items-v2/lemon-half.webp (judge) |
| CLN-190 | judge | clinic:heal-foot @ step:pour: strip .cl-heal (judge) |
| CLN-191 | judge | clinic:heal-foot @ step:plaster: zoom2 .cl-heal (judge) |
| CLN-192 | human | Waits on the s08b art: when the re-cut foot lands, look at it at 800x360, 1366x768 and 1366x1024 and say wheth |
| CLN-193 | human | Waits on the s08b art (SP1): when the translucent red channel and the splinter travelling inside land, look at |
| CLN-194 | judge | clinic:heal-foot #mistake @ heal:off-the-channel: strip .cl-heal (judge) |
| CLN-195 | judge | clinic:heal-taste L3 @ every:step: zoom2 .cl-heal (judge) |
| CLN-196 | needs-decision | clinic:heal-taste @ heal-taste-start: zoom2 .cl-heal (judge) |
| MOD-10 | machine | mode:tidy @ page:end: contract:16 = pass<br>mode:snap @ page:end: contract:16 = pass<br>mode:who @ page:end: contract:16 = pass |
| ART-22 | human | Waits on the art run: when the redrawn girl, doctor and Nani land, look at the three side by side and in each  |
| LNG-16 | machine | cook:chai-tray @ page:end: contract:26 + voice = pass<br>cook:maani-line @ page:end: contract:26 + voice = pass<br>cook:chaat @ page:end: contract:26 + voice = pass |
