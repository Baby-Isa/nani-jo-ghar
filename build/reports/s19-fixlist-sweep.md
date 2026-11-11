# s19-fixlist-sweep: what is really still broken (11 Nov)

Read-only sweep of `docs/process/regressions.md` against today's code on `ccr-87413d9b-j48fpk`. No code, row or git change. No browser run: the verdicts rest on the code, the s19 reports, and the last runs' `contract.json` and screenshots (`s19-games-1-after`, `-after-samosa`, `-after-maani`, `s19-games-2-after`, `s19-games-2-eggs-final`). Flaws first.

## Flaws in this sweep
- **Nothing was played.** A FIXED-IN-CODE verdict means the code is there and the named check had no break for it in the last run; it is not a fresh pass. Those runs were L1-L4 at 740x320 and 1280x665 only, and predate the last few commits (CK-87, CK-88, the served-dish declarations).
- **Old chai rows are cited from their code comments.** About 60 "to fix: check" rows were built weeks ago; I confirmed the fix's comment and code still stand, not each behaviour.
- **Many-part rows** (CK-78 to CK-85) get one verdict; the line says which parts hold and which do not.
- **Rows labelled "waiting on" were not swept**, only listed in section 4. Several look landed (the stone tray, the top-down pot, the naan stages, corn's layout): their labels are probably stale.
- **Unclear rows are marked in their line:** CHAI-76 (must Nani's own line show the word once her box is open?), SH-173 (is a scored round with nothing wrong centred?), SH-148 (a cut card at the row's edge: "behind a shadow" or clipped text?).

## Read this before launching the builders
1. **Two finished builders are not merged.** `s19-taps` (8 commits: SH-261, SH-244 as told again, SH-236's 300 ms, contract-117; in `js/shared/onboard.js`, `js/shared/shelf.js`, `js/cook/coach.js`, `js/cook/stations.js` and the checks) and `s19-serve2` (5 commits: the serving kitchen's real art, `js/cook/serve.js`, and the v4 manifests in `data/cook.json`). Both touch the files batch A would edit. Merge them first, or three rows get built twice and the card-picture breaks (contract-104) get chased for nothing.
2. **The serving tray may be empty.** In the last runs' final frames the serving kitchen shows a bare tray for sekelo and no dish for corn and baking (`s19-games-1-after/cook-mishkaki-grill/1280x665`, `s19-games-2-after/cook-corn` and `cook-baking`, last `c*-stage`). Only chai, maani, daar, eggs, samosa and chaat have a served picture (`assets/cook/serve/`, `assets/cook/items/served/`). No row names this. Check after the serve2 merge.
3. **The pantry is the furthest from chai:** no one gives the order, Nani's box reads "Cook it the way they said.", and no jar has a word pill (PAN-19, PAN-20).
4. **Main carries five ChatGPT folders and two phone videos,** not the two that ART-74 names.
5. **A hook asked this session to commit and push** (305 minutes unpushed). The sweep's brief forbids both, so nothing was committed; the orchestrator should push.

## 1. Totals

**255 rows swept** (143 "to fix: check", 112 "to fix: code"): CHAI 59, CK 31, DAAR 15, MAA 5, SAM 2, SEK 4, CHT 4, PAN 7, kitchen ART 15, SH 113. Eleven more ART rows are tooling or other modes and are listed as out of scope.

| verdict | rows | of them "to fix: code" | "to fix: check" |
|---|---|---|---|
| FIXED-IN-CODE | 159 | 61 | 98 |
| STILL-OPEN | 44 | 35 | 9 |
| NEEDS-EYES | 36 | 11 | 25 |
| SUPERSEDED | 10 | 2 | 8 |
| WAITING | 6 | 3 | 3 |

So 159 rows can move to the archive once the named check is re-run green, 10 can be closed as overtaken, 36 need one picture each (most are one sheet of chai and one side-by-side per game), 6 go on the known list, and 44 are work.

## 2. Row by row

"Confirm" names the check or probe that would prove it. Break counts are from the last runs named above.

| id | verdict | why (file:line) | files to touch |
|---|---|---|---|
| CHAI-02 | NEEDS-EYES | layout row from October, judged FAIL 21 Oct on old art; chai has been rebuilt twice since (s14, s17). Picture: chai L1 at 1280x665, the shelf at x2 zoom, beside the approved chai reference |  |
| CHAI-08 | NEEDS-EYES | same picture as CHAI-34 (`js/cook/stations/chai-tray.js:62`, `:86`, `:336`); the last judge verdict (FAIL, 21 Oct) is on art that has gone |  |
| CHAI-19 | FIXED-IN-CODE | the count pill sits above the pan, inside the camera's view (`js/cook/stations/chai-tray.js:786`, `:885-892`); judge passed 21 Oct; confirm: contract-113 flags a pill over a face on chai today (7 in s19-games-2-after), a different fault, see the batch note |  |
| CHAI-31 | NEEDS-EYES | the bubble's face is the speaker's own (`js/cook/ui.js:1878`); the colours are art. Picture: chai L2 mid-pour at 1280x665: pan and glass the same tea |  |
| CHAI-34 | NEEDS-EYES | the s14 pan is in (`js/cook/stations/chai-tray.js:118`); a look: chai L1-L4 at 740x320 and 1280x665, the pan and the pour. Zafar's 10 Nov answer 4 says chai's pan "sits right" |  |
| CHAI-35 | FIXED-IN-CODE | Nani's helper card opens inside her box, pushing the order card down (`js/cook/ui.js:981-986`, `:1020`); confirm: contract-101 (nani-box) and contract-83 |  |
| CHAI-36 | FIXED-IN-CODE | no dim without its lit target (`js/shared/onboard.js:980`, `:1418`, `:1854`); confirm: contract-84 / the light judge (`build/sandbox/lib/lightjudge.mjs`) |  |
| CHAI-37 | FIXED-IN-CODE | the order card lit after the first two items (`js/cook/stations/chai-tray.js:231`, `:1684`; `js/shared/onboard.js:226`); confirm: contract-90 |  |
| CHAI-38 | FIXED-IN-CODE | chai keeps its heat ring, boil and pan states under the new cards (`js/cook/stations/chai-tray.js:1020-1023`); confirm: chai's contract run (28 breaks in s19-games-2-after, none on the heat) |  |
| CHAI-39 | WAITING | built: "no" items said last (`js/cook/ui.js:3390`), contract-72 guards the row never gliding back (1 break on chai in s19-games-2-after, see SH batch); Mum still to confirm the word order sounds natural |  |
| CHAI-42 | FIXED-IN-CODE | the card's light waits for stillness (`js/cook/coach.js:287`, `:862`); confirm: contract-79 (0 on chai) |  |
| CHAI-48 | FIXED-IN-CODE | judge passed 30 Oct; confirm: contract-52 (0 on chai) |  |
| CHAI-49 | FIXED-IN-CODE | the call and its light together; confirm: contract-78 (0 on chai in s19-games-2-after) |  |
| CHAI-54 | FIXED-IN-CODE | half ticks at the first pour, full at the second, a pour past it wiggles (`js/cook/stations/chai-tray.js:1198`, `:1280`); confirm: evidence probe CHAI-54 (cook:chai-tray L4) |  |
| CHAI-55 | FIXED-IN-CODE | the first person asks half, the second full while the words are new (`js/cook/recipes.js:139`, `js/cook/stations/chai-tray.js:530`); confirm: evidence probe CHAI-55 |  |
| CHAI-56 | FIXED-IN-CODE | a returning player hears the call alone, the light after the level's wait (`js/cook/stations/chai-tray.js:1740`, `js/cook/coach.js:714`); confirm: contract-78 (`build/sandbox/lib/contract-s14.mjs:64`) |  |
| CHAI-57 | FIXED-IN-CODE | too early shakes, green turns down, red boils over and starts again (`js/cook/stations/chai-tray.js:711`, `:1020`; `js/cook/mechanics/boil.js`); confirm: evidence probe CHAI-57; contract-70 (the call at the green: 3 on chai, a check conflict, see batch A) |  |
| CHAI-58 | FIXED-IN-CODE | the green's length by level is in settings (`data/stations/chai-tray.json:74`); confirm: contract-70/-77 timing at speed 1; the row's 2 s measure is not a named rule |  |
| CHAI-60 | FIXED-IN-CODE | contract-78 judges only each control's first call (`build/sandbox/lib/contract-s14.mjs:68-74`); confirm: chai L2-L4 has 0 contract-78 in s19-games-2-after |  |
| CHAI-61 | FIXED-IN-CODE | a lit pan boils on its own clock through another pan's add (`js/cook/stations/chai-tray.js:1109`, `:1943`); confirm: evidence probe CHAI-61 |  |
| CHAI-62 | FIXED-IN-CODE | a card whose rows open again glides back to its first item (`js/shared/order-card.js:432`); confirm: evidence probe CHAI-62 |  |
| CHAI-63 | FIXED-IN-CODE | the boil starts 2 s before the green at every level (`js/cook/mechanics/boil.js:316` leadS, `:602`; `js/cook/stations/chai-tray.js:699`); confirm: chai L1-L4 contract run; eggs' pot uses the same mechanic |  |
| CHAI-64 | FIXED-IN-CODE | no drawn stream line for a pour (`js/cook/mechanics/pour.js:430`); confirm: chai L1-L4 screenshots, s19-games-2-after |  |
| CHAI-65 | FIXED-IN-CODE | each face in its glass's corner (`js/cook/stations/chai-tray.js:489`); confirm: contract-113 (a face over a thing). Note: contract-113 has 7 breaks on chai in s19-games-2-after ("the side menu over a tray face", a check conflict named in s19-games-2) |  |
| CHAI-66 | FIXED-IN-CODE | the shelf row lines up with the hob and tray (`js/cook/stations/chai-tray.js:543`, `:559`); confirm: contract-109 (0 on chai) |  |
| CHAI-67 | STILL-OPEN | the game is right; the row's second probe still uses the "seen" profile, which has never met adh or aako, so the judge's FAIL stands (`build/sandbox/data/evidence.json` CHAI-67 probe 2). It needs a second-play probe | build/sandbox/data/evidence.json, build/sandbox/lib/cook-player.mjs |
| CHAI-68 | NEEDS-EYES | the light is built (`js/cook/stations/chai-tray.js:1299`, `:928`) and the probe now waits after the pour (path pause-after-pour), but its note still asks for "a tight gold circle" and every light is a rounded box since 10 Nov (`js/shared/onboard.js:941`); re-run the probe and fix its note | build/sandbox/data/evidence.json (the note) |
| CHAI-74 | FIXED-IN-CODE | adh and aako's cards are the moment's glasses (`js/cook/ui.js:116-119`, `:2953`); confirm: evidence probe CHAI-74 |  |
| CHAI-75 | FIXED-IN-CODE | picking the next pan is a control step with its stuck light (`js/cook/stations/chai-tray.js:1530`, `:1435-1440`); confirm: evidence probe CHAI-75. Its light is now a rounded box, not a circle (Zafar, 10 Nov, `js/shared/onboard.js:941`) |  |
| CHAI-76 | NEEDS-EYES | her line shows the asked word as dots (`js/cook/lang.js:219`) and the opened box shows the full card (`js/cook/ui.js:1046`, `all: true`). Unclear from the row whether her line itself must show the word once the box is open: today it stays dotted. Picture: chai L3 returning, stuck on milk, the box shut and open | js/cook/ui.js (if her line must change) |
| CHAI-77 | FIXED-IN-CODE | the card light's waiter gives up only once the step has moved on (`js/cook/coach.js:862`, `js/shared/onboard.js:394`); confirm: contract-90 |  |
| CHAI-78 | FIXED-IN-CODE | the moment plays before anyone comes in (`js/cook/flow.js:468`, `:1846`); confirm: evidence probe CHAI-67 probe 1 |  |
| CHAI-79 | FIXED-IN-CODE | one glass picture, the tea drawn in code inside it (`js/shared/word-moment.js:226`, `js/cook/ui.js:116`); confirm: a filmstrip of the fill (evidence probe CHAI-101's flow) |  |
| CHAI-80 | FIXED-IN-CODE | the kettle tips, the stream flows, the last drop, untilt (`js/shared/word-moment.js:294`, `:321`, `:379`); confirm: the same filmstrip |  |
| CHAI-81 | FIXED-IN-CODE | both poured, a look, then each snapped in turn (`js/shared/word-moment.js:563`, `js/cook/ui.js:158`); confirm: the moment's timeline in evidence probe CHAI-67 |  |
| CHAI-82 | FIXED-IN-CODE | thin rounded corners in CSS (`css/shared/word-moment.css:34`, `css/shared/tokens.css:139`); confirm: a zoom on the snap (evidence probe CHAI-67 probe 1) |  |
| CHAI-83 | FIXED-IN-CODE | no next-pan hint while another pan heats or waits to pour (`js/cook/stations/chai-tray.js:1530-1560` rungOf); confirm: contract-78 on chai L2-L4 (0 in s19-games-2-after) |  |
| CHAI-84 | FIXED-IN-CODE | half and full cards from one glass; plain tea for a "dudh na" order (`js/cook/ui.js:3004-3015` rowPicSrc); confirm: evidence probe CHAI-74 / chai L4 |  |
| CHAI-85 | FIXED-IN-CODE | the moment's scene covers the kitchen at once, the rest loads behind it (`js/cook/ui.js:97-102`); confirm: evidence probe CHAI-67 probe 1 (chai L4 fresh) |  |
| CHAI-86 | FIXED-IN-CODE | the moment plans its room: top margin, kettle, spout gap, glass, counter (`js/shared/word-moment.js:182`, `:334`); confirm: evidence probe CHAI-101 (the moment at the four sizes) |  |
| CHAI-87 | FIXED-IN-CODE | pour A plays at the hob and in the moment through the voice gate (`js/shared/sfx.js:289`, `js/cook/stations/chai-tray.js:1248`); confirm: `build/test_shared_sfx_files.mjs`; his ear in play |  |
| CHAI-88 | FIXED-IN-CODE | drawTea uncovers only the measured inside of the glass (`js/shared/word-moment.js:98`); confirm: evidence probe CHAI-101 (pixel diff of the wall is the row's own check, not built as a contract rule) |  |
| CHAI-89 | FIXED-IN-CODE | chai's group is centred and the other games copy its measure (`js/cook/stations/chai-tray.js`; `chop.js:139`, `samosa.js:74`, 12 more); confirm: contract-115 and the s19-games before/after pairs. Note: each game has a local copy of `centreLift` (s19-games-1 report), not one shared function |  |
| CHAI-90 | FIXED-IN-CODE | the stream is drawn over the glass, the dark front lip laid back over it (`css/shared/word-moment.css:25-30`); confirm: evidence probe CHAI-101's shot mid-pour |  |
| CHAI-91 | FIXED-IN-CODE | a failed picture is asked again and a pan shows the nearest look that is in (`js/cook/station-lib.js:714`, `js/cook/stations/chai-tray.js:182`, `js/cook/mechanics/pan.js:29`); confirm: chai L4 at 930x430 with the pan pictures dropped (the row's eye check), contract-104 for a picture that never loads |  |
| CHAI-92 | WAITING | the lab page and his picks are wired (`js/shared/sfx.js:16`, `js/shared/juice.js`); what is left is Zafar hearing and seeing each one (Mixkit's licence is his call before the stores) |  |
| CHAI-93 | FIXED-IN-CODE | the painted drop falls through `Juice.drop` with its crown splash and plink (`js/shared/word-moment.js:446-450`); confirm: evidence probe CHAI-98 (chai L4 word moment, same frame) |  |
| CHAI-95 | FIXED-IN-CODE | a seamless 12 s loop `simmer-b`, looped 0.1-12.1 s (`js/shared/sfx.js:387-391`, `:470`; file `assets/shared/sfx/simmer-b.mp3`); confirm: `build/test_shared_sfx_files.mjs`; his ear for the join |  |
| CHAI-96 | FIXED-IN-CODE | a style tea's extra pops as its own item card while the headline is said (`js/cook/ui.js:2228`, `:2347`, `:2402`; `js/cook/words.js:535`; `js/shared/order-card.js:98` headCap); confirm: evidence probe CHAI-96 (cook:chai-tray) |  |
| CHAI-97 | FIXED-IN-CODE | the recorded pour is fetched as the moment starts and the first pour waits for it; never the made loop (`js/shared/word-moment.js:165-168`, `:559`); confirm: evidence probe CHAI-98's voice timeline (both pours name pour-a) |  |
| CHAI-98 | FIXED-IN-CODE | the drop is 5.5% of the glass (`js/shared/word-moment.js:446-450`, `g * 0.055`); confirm: evidence probe CHAI-98 |  |
| CHAI-99 | FIXED-IN-CODE | the next pan's light 0.8 s after the pour (`js/shared/onboard.js:400` WAIT.nextVessel 800; `js/cook/stations/chai-tray.js:1299`, `:1440`); confirm: evidence probe CHAI-99 |  |
| CHAI-100 | FIXED-IN-CODE | the fire goes off silently after the last pour (`js/cook/stations/chai-tray.js:1282-1285` setKnob(..., true); `js/cook/kitchen-kit.js:371`); confirm: the sound log of chai-tray L1-L4 (no knob after a pour): evidence row is "human" |  |
| CHAI-101 | NEEDS-EYES | built at lineMax 0.65 (`js/cook/ui.js:154`, `js/shared/word-moment.js:190`), but the judge failed it on 6 Nov and it has not been re-judged; picture: chai L4's word moment at the four sizes, at least 30% cabinet, about three doors (evidence probe CHAI-101) |  |
| CHAI-102 | FIXED-IN-CODE | the lesson waits for the order's landing, follows a redrawn card and spends its key only once its light is drawn (`js/shared/onboard.js:440`, `:2218`, `:2292`, `:2397`; `js/cook/station-lib.js:399`, `:518`); confirm: contract-98 (a dotted word with no lesson logged) on chai L2-L4: 0 in s19-games-2-after |  |
| CHAI-103 | FIXED-IN-CODE | the stream runs down first (300 ms wipe), then the pour is heard and the tea rises (`js/shared/word-moment.js:398-410`); confirm: evidence probe (row is "human": a strip of the pour's start) |  |
| CHAI-104 | FIXED-IN-CODE | an unsaid row the headline says lands with the headline (`js/cook/order.js:96`, `:311`; `js/cook/recipes.js:380`; `js/cook/ui.js:2298`, `:2351`); confirm: contract-18/-73 on chai-tray L4 (rows filled as the order passes on) |  |
| CHAI-107 | FIXED-IN-CODE | the praise waits 0.5 s for the ring, in the shared serve (`js/shared/serve.js:100`); confirm: `frozen.mjs --diff --quick` (the row's probe). Note: s19-fixes-f says chai's frozen pages have not been re-frozen since 7 Nov |  |
| CHAI-108 | STILL-OPEN | nothing measures the gap between two pans' green windows; no log line and no check (`js/cook/mechanics/boil.js` has no such note; `build/sandbox/lib/` has no rule). The row asks for a measurement, then a proposal to Zafar | js/cook/mechanics/boil.js (a log note), build/sandbox/lib/contract-s19b.mjs (a rule) |
| CK-01 | WAITING | no fault named: it waits for Zafar's own play of levels 2-4. He plays L1 and L3 tomorrow; L2 and L4 stay unplayed by him |  |
| CK-06 | NEEDS-EYES | one elchi pod and one ginger slice lie on the pan, sinking at the boil (`js/cook/stations/chai-tray.js:284`); his look decides whether four new pan pictures are needed. Picture: chai L2 with elchi and with aadu, before and after the milk |  |
| CK-45 | FIXED-IN-CODE | confirm: contract-21 (input-live): 0 breaks on chai-tray in s19-games-2-after |  |
| CK-46 | NEEDS-EYES | everyone sits low enough that the counter's edge hides arms and hands (`js/cook/stations.js:47-56`), but the serving kitchen was rebuilt on 11 Nov (`js/cook/serve.js`) and the seated redraw is ART-33. Picture: the ordering view with Nani, Nana, Ma and Ali at 740x320, 930x430 and 1280x665, each mood |  |
| CK-53 | FIXED-IN-CODE | the "?" never glows and the buttons stay with the cog (`js/cook/ui.js:1246`, `:3665`, `:4507`); confirm: contract-54 (rail-in-side): 0 breaks. The cog itself moved to the play area's top right by SH-156, a later decision |  |
| CK-54 | STILL-OPEN | built (`js/cook/ui.js:2466-2483`), contract-74 guards it, but eggs L3 at 740x320 still breaks it: "a tap during the order and 1 s later 1 card not yet in its row" (s19-games-2-eggs-final). Likely eggs' one-card-per-egg rows (CK-64) landing late | js/cook/stations/eggs.js, js/cook/ui.js (the order's skip) |
| CK-55 | FIXED-IN-CODE | on a phone the overlay panel keeps clear of the cog's column (`css/cook.css:999`); confirm: sandbox flow cook:title at 740x320 reaches its end (s19-stuck-asks1..3 did with this patch) |  |
| CK-56 | STILL-OPEN | both old tests still exist and neither is in `build/tools/review/checks.mjs`; not re-run here (browser tests). Either fix them and add them to the browser list, or retire them as s19-check-sort's DEAD list suggests for the old e2e tests | build/test_cook_host.mjs, build/test_cook_voice.mjs, build/tools/review/checks.mjs |
| CK-57 | FIXED-IN-CODE | not reproduced since; confirm: contract-80 (no-jump): 0 breaks on chai L2-L4 in s19-games-2-after. (The serve's announced glide trips contract-80 in s19-serve's run: a check fault, batch A) |  |
| CK-59 | FIXED-IN-CODE | the said-again rule is per speaker, the line names who says it (`js/cook/words.js:519`, `:595`; `js/cook/ui.js:2214`); confirm: contract-93 (own-words): 0 breaks in every s19-games run |  |
| CK-61 | FIXED-IN-CODE | corn's light goes round the thing with its pill and hop room (`js/cook/stations/corn.js:383`, `:724`); confirm: contract-92: 0 on corn in s19-games-2-after |  |
| CK-62 | FIXED-IN-CODE | a row naming a station's own thing gets that thing's card first (`js/cook/ui.js:3001`); the eggs card shows the fried egg (s19-games-2-eggs-final, 740x320 03); confirm: contract-104: 0 on eggs |  |
| CK-63 | FIXED-IN-CODE | the pan's light sits on its round body alone (`js/cook/stations/eggs.js:255`, `:559`); confirm: contract-105: 0 on eggs in s19-games-2-eggs-final |  |
| CK-64 | FIXED-IN-CODE | the headline carries the count and each egg has its own card (`js/cook/stations/eggs.js:26`, `:91`, `:767`); confirm: contract-19 (counting) and the eggs L1-L4 pages. One open edge is CK-54 above |  |
| CK-65 | FIXED-IN-CODE | corn's green lasts greenMs by level, 4.5 s at L1 to 2 s at L4 (`data/stations/corn.json:48-63`, `js/cook/stations/corn.js:216`); confirm: contract-70 / -77 on corn (1 contract-70 at L4, speed 3: the call is late, see batch B) |  |
| CK-68 | SUPERSEDED | CK-67 (Zafar, 9 Nov): "first grill them all and then flavour them on the next screen": corn is two screens now (`data/stations/corn.json:2`) |  |
| CK-72 | STILL-OPEN | baking still asks "a little" and "a lot" and stops the child after the taps (`js/cook/stations/baking.js:370`, `:398`, `:431`; `data/stations/baking.json:65`, `:78`, `:94`; the last run's box reads "Atto wiji chad! A lot."). The decided version (jug amounts only, each with a word moment) is a redesign of the game's plan and needs the jug's amount lines from the language engine; it will also wait on Mum for any unrecorded amount. Too big for a cleanup batch unless Zafar wants it tonight | js/cook/stations/baking.js, data/stations/baking.json, data/cook.json (recipes.baking) |
| CK-75 | FIXED-IN-CODE | eggs' praise scene fills the play area (`js/cook/stations/eggs.js:976`); the serving kitchen is now the shared two-view scene (`js/cook/serve.js`); confirm: eggs L1 c07/c08-stage at 740x320 and 1280x665 (s19-games-2-eggs-final): no marble strip |  |
| CK-76 | FIXED-IN-CODE | Nani's box names each step from the engine (`js/cook/stations/eggs.js:654`); confirm: contract-36 (step-call): 7 left on eggs, the serve line's recording gap and the check conflict with contract-89 (see batch A) |  |
| CK-77 | FIXED-IN-CODE | the carton is sized by chai's rule for a shelf thing (`js/cook/stations/eggs.js:367`); confirm: contract-115 and -109: 0 on eggs |  |
| CK-78 | FIXED-IN-CODE | well done shows every chopped piece with its asker (`js/cook/stations/chop.js:236`, `:267`; `js/cook/mechanics/chop.js:675`); seen in s19-games-2-after/cook-chop/1280x665 c-stage (four halves on the board, Nani's face in her box); confirm: contract-113 (0 on chop). The whole garlic's angle is art |  |
| CK-79 | STILL-OPEN | the heap fills its bowl (`js/cook/stations/daar.js:914`) and the card is one sideways row on a short sidebar (`js/cook/ui.js:3279`), but at 740x320 that row shows cut cards at both ends ("on", "lt": s19-games-1-after/cook-daar/740x320 08-kind-stir), which is the cut row the judge named; contract-72 also has the row gliding 268 px at once at L4 | js/cook/ui.js:3279, css/shared/order-card.css |
| CK-80 | FIXED-IN-CODE | each person's cob has its own card "hakro makai", the grill has its face circle (`js/cook/stations/corn.js:261-265`), the cob's pill is part of its light (`:724`); confirm: contract-113 and -105 on corn (1 contract-105 at L4 740x320: the light on the hakro makai card pokes out, the shared card light, batch A) |  |
| CK-81 | NEEDS-EYES | one face, beside the tray the skewer is on (`js/cook/mechanics/grill.js:1304-1317`), the kit's light on the grill (contract-102: 0 on sekelo). To look at: (1) the skewer's stick reaches past the tray's foot at 740x320, (2) in the last run the serving kitchen's tray is empty for sekelo (`s19-games-1-after/cook-mishkaki-grill/1280x665`, last c-stage). Picture: sekelo L1 well done and its serve at 740x320 and 1280x665 | js/cook/mechanics/grill.js, js/cook/serve.js (if the dish is missing) |
| CK-82 | NEEDS-EYES | the samosas are seen at well done with the face beside the plate (s19-games-1-after-samosa, 740x320 c10-stage); the fold's light is the kit's box (`js/cook/stations/samosa.js:1000`, `:1069`) and its arrow stays until Zafar plays (11 Nov); the knob's light hugs the knob (`:1302`). Not judged: whether the card's chundo picture matches the shelf's (needs samosa L2+ card beside the shelf). Still breaking: contract-102 x1 (a heap's own glow at L2), contract-112 x6 (the strip's light), see SAM batch | js/cook/stations/samosa.js |
| CK-83 | STILL-OPEN | done: one face and one step in the chop stage, the bowl fills over fillMs (`js/cook/mechanics/assemble.js:428`), hakro reaches the review (s19-fixes-f). Still wrong in s19-games-2-after: contract-112 at L1 740x320 "lit while veg-01 was still moving inside it" and two lit regions (the chop light before the vegetable is still), contract-111 x4 (a tap at an item's foot picks nothing), contract-72 x3 (the order row jumps 181 px in one frame) | js/cook/mechanics/assemble.js, js/cook/mechanics/chop.js |
| CK-84 | STILL-OPEN | done: the bowl is clear of the jars, which stand on the shelf band (`js/cook/stations/baking.js:193`, `:299`), the bowl's tap lights no headline (`:459`). Still wrong: the atto card's picture does not load (contract-104 x3: `assets/cook/items/../items-s17-stove/f-chapati-flour-atta.webp`, a path in `data/cook.json`), the light on atto is 4.7 times its size (contract-53), and atto and khun still look alike (waiting on art) | data/cook.json (the atto stem), js/cook/stations/baking.js |
| CK-85 | STILL-OPEN | done: every layer lit the first time (`js/cook/mechanics/assemble.js:928`). Still wrong: the cards' pictures do not match the tray (contract-104 x2: `assets/cook/items/v4/chop/bataato-whole.webp` did not load), contract-105 at L3 (the light 44% off the potato). The scatters wait on art; the praise zoom at 740x320 is in the shared serve and was "not done" in s19-fixes-g | js/cook/mechanics/assemble.js, data/cook.json (chaat's card art), js/shared/serve.js (the zoom) |
| CK-86 | FIXED-IN-CODE | both grills are one rectangle with the upright steel tray(s) at the grill's height (Zafar's 11 Nov version; `js/cook/stations/corn.js`, `js/cook/mechanics/grill.js`; s19-games-1 and -2 reports); confirm: contract-115: 0 on corn and sekelo. Left: corn's cob shrinks 23-44% on the plate screen (contract-114 x10): Zafar decides when he plays |  |
| CK-87 | NEEDS-EYES | the cut is in the file (`assets/cook/items/v4/kit/grill.webp`); picture: corn and sekelo L1 at 1280x665, the handles against the dark ground (the last runs' frames show clean handles) |  |
| CK-88 | NEEDS-EYES | the redrawn pot is on in eggs (`scene.potTrial`, `data/stations/eggs.json`); picture: eggs L1 at 1280x665, the pot's and the pan's handles side by side (s19-games-2-eggs-final 04-view-marble shows both about one length) |  |
| DAAR-03 | STILL-OPEN | no mark per lap: daar's count is still the number word on the dial's chip (`js/cook/stations/daar.js:1734`, `:1876`; the last run shows a big "1 hakro" card, not a tally by the pot). Rides on DAAR-45 | js/cook/stations/daar.js, js/cook/mechanics/stir.js |
| DAAR-12 | STILL-OPEN | a speed is still asked with no lesson, and the dial shows from L1 ("Stir it three times, slowly." at L1 in s19-games-1-after/cook-daar/740x320 08-kind-stir; `js/cook/stations/daar.js:483`, `:1586`, `:1684`; `data/stations/daar.json:7` stirAsk). Decided: L4 only, after a word moment. The speed lines also wait on Mum (the stir line is a grey English placeholder today, `data/stations/daar.json:6`) | js/cook/stations/daar.js, data/stations/daar.json, data/cook.json (the speed's level) |
| DAAR-36 | FIXED-IN-CODE | the judge's three faults are fixed: "no" things said last (`js/cook/order.js:206`, `js/cook/mechanics/chop.js:1293`), kinds by level (DAAR-37), the chop's strip light (DAAR-39); confirm: daar L1-L4 contract run. It is not at 0: 27 breaks left in s19-games-1-after (36 x7, 115 x7, 105 x3 ...), each named in its own row or the batch list |  |
| DAAR-37 | FIXED-IN-CODE | kinds 1-4 and chops 2, 4, 6, 8, each kind 1-3, read from settings (`data/stations/chop.json:92`, `js/cook/stations/chop.js:10`); confirm: contract-37 / the chop leak bot over ten seeds. Garlic's pieces wait on art and its word on Mum (known list) |  |
| DAAR-38 | FIXED-IN-CODE | the round ends the moment every wanted count is reached (`js/cook/mechanics/chop.js:233`); confirm: contract-91 (help-comes) and the chop flow's end within its time |  |
| DAAR-39 | FIXED-IN-CODE | the first time is the kit's light on the knife's strip (`js/cook/mechanics/chop.js:48`, `:87`; `js/cook/stations/chop.js:248`); Zafar, 10 Nov: the wide light over the knife's path is right (STD-E2-08a). Confirm: contract-112: 1 break left on chop L2 at 740x320 (corners too round), batch A |  |
| DAAR-40 | FIXED-IN-CODE | the chop opens its own step as its board starts (`js/cook/mechanics/chop.js:54`, `:85`; `js/cook/stations/chop.js:203`); confirm: contract-95: 0 on daar in s19-games-1-after |  |
| DAAR-41 | FIXED-IN-CODE | the reveal lessons are the kit's (`js/cook/stations/daar.js:413`); confirm: contract-98: 0 on daar in s19-games-1-after |  |
| DAAR-43 | FIXED-IN-CODE | the light is round the bowls' pictures, not the tap box (`js/cook/stations/daar.js:925`); confirm: contract-92: 0 on daar in s19-games-1-after |  |
| DAAR-44 | FIXED-IN-CODE | one card path: the chop's card and the tadka's order are 6 Nov item cards (`js/cook/ui.js:2590`, `:3133`, `:3200`); confirm: contract-100 (kit-card): 0 on daar |  |
| DAAR-45 | STILL-OPEN | daar still has its own stir and code-drawn dial (`js/cook/stations/daar.js:1449`, `:1586-1880`) beside the stir game's (`js/cook/mechanics/stir.js`); only the ladle picture is shared (`stir.js:128`). Left out of scope by s19-games and s19-lights | js/cook/stations/daar.js, js/cook/mechanics/stir.js |
| DAAR-46 | STILL-OPEN | daar's stir still ends by itself at the asked count (`js/cook/stations/daar.js:1734`, `:1876`: `if (count >= laps) stirred()`), and the stir game on the first let-go after it (`js/cook/mechanics/stir.js:406`). Rides on DAAR-45 | js/cook/stations/daar.js, js/cook/mechanics/stir.js |
| DAAR-47 | SUPERSEDED | answered "leave it out" (Zafar, 9 Nov; s19-waiting-on-zafar-audit: done). Nothing to build |  |
| DAAR-49 | SUPERSEDED | answered: keep the tadka and the stir, the daar poured from its bowl (Zafar, 9 Nov; audit: done). Nothing to build |  |
| DAAR-51 | STILL-OPEN | the katori is 130 design px wide (`data/stations/daar.json:27`, drawn at `js/cook/stations/daar.js:2042-2043`): a speck beside the pot in s19-games-1-after/cook-daar/740x320 08-kind-stir. Wants the serving kitchen's bowl scale | data/stations/daar.json, js/cook/stations/daar.js |
| MAA-19 | STILL-OPEN | the flip's first-time hold is built (`js/cook/stations/maani-line.js:190`, `:696-704`), but from L2 "Firai!" is called with no light (contract-78 x4 in s19-games-1-after-maani), and contract-96 x2 (a card stays ticked after the maani burns) and contract-91 x1 (11 s stuck at the roll with no hint) | js/cook/stations/maani-line.js, js/cook/coach.js (Cook.Coach.control, as eggs) |
| MAA-20 | WAITING | built: the pin rolls up and down under one finger (`js/shared/onboard.js:57`, `:192`); both looks (hand, circle) are on `lab/kit-lights.html` "roll-pair". Waiting on Zafar's pick (`js/shared/onboard.js:359`) |  |
| MAA-21 | FIXED-IN-CODE | before big and small, a roll stops hard at 0.92 of the board's rim (`js/cook/stations/maani-line.js:205`, `:522`; `data/stations/maani-line.json:29` rimStop); confirm: evidence probe MAA-21 (cook:maani-line). Note: sizes arrive at L2 today, so the stop is L1 only until MAA-23 |  |
| MAA-22 | FIXED-IN-CODE | the next pile is expected only once the maani has landed (`js/cook/stations/maani-line.js:445`, `:581`; `js/cook/coach.js:170`); confirm: contract-112 ("nothing moves into a light"): 0 on maani |  |
| MAA-23 | STILL-OPEN | no word moment for big and small: `js/cook/stations/maani-line.js` never calls the word moment, and the rings and sizes still arrive at L2 (`data/stations/maani-line.json:36-40`). Left "for later" by s19-lights. The moment's lines must come from the engine; a gap goes on Mum's sheet | js/cook/stations/maani-line.js, data/stations/maani-line.json, data/cook.json |
| SAM-30 | STILL-OPEN | the fry's first time is on the kit's lights at L1 (`js/cook/stations/samosa.js:1427`, `js/cook/coach.js:90`), but the knob, fry and lift calls come with no light or a late one from L2 (contract-78 x12 in s19-games-1-after-samosa); the builder's own next step: `Cook.Coach.control`, as eggs | js/cook/stations/samosa.js |
| SAM-31 | FIXED-IN-CODE | samosa's rows are 6 Nov item cards (`js/shared/order-card.js:529`, `js/cook/ui.js:3077`, `:3200`); seen in s19-games-1-after-samosa (Ba samosa, ba bataata cards); confirm: contract-100: 0 on samosa |  |
| SEK-14 | NEEDS-EYES | the trays are still pictures holding 1-4 skewers (`js/cook/mechanics/grill.js:139`, `:1004`), but the screen was laid out again on 11 Nov (two trays stacked beside the grill). Picture: sekelo L2-L4 mid-grill at 1280x665, trays with 2-4 skewers at x2 |  |
| SEK-20 | SUPERSEDED | CK-86 (Zafar, 11 Nov): the ChatGPT-mocked layout, trays the grill's height, one rectangle; built in s19-games-1 (`js/cook/grill-kit.js:2`, `js/cook/mechanics/grill.js`) |  |
| SEK-22 | FIXED-IN-CODE | the light holds the whole skewer, tight (`js/cook/mechanics/thread.js:140`, `js/cook/mechanics/grill.js:1607`), the turn's first-time hold (`:1489`); confirm: contract-105 and -112: 0 on sekelo's skewer (the 1 contract-105 left is the order card's light, batch A) |  |
| SEK-25 | STILL-OPEN | the order is still one card per skewer ("hakri lakri mishkaki, one skewer of mishkaki" in s19-games-1-after/cook-mishkaki-grill), not a card per piece (`data/cook.json:2258`, `:2311`). It is also why contract-37 x6 reads the meat bowl (gos) as a decoy. The headline's words wait on LNG-24 | data/cook.json (sekelo's order), js/cook/mechanics/thread.js, js/cook/ui.js |
| CHT-13 | FIXED-IN-CODE | chaat is top-down: the opaque bowl, the items on the stone tray (`js/cook/mechanics/assemble.js:5`, `:154`, `:255`); judged beside chai 11 Nov (24 pass, 4 fail: CK-85 holds the fails). The potato, chickpea and sev scatters wait on art |  |
| CHT-17 | NEEDS-EYES | a pill that would have to narrow shows its speaker alone (`js/cook/mechanics/assemble.js:624-632`), items by the central rules (`:547`). The card's row at 740x320 is a sideways row that shows a cut third card ("fudi chu...", s19-games-2-after/cook-chaat/740x320 05-kind-tap). Picture: chaat L4 at 740x320, the pills and the card. Open breaks: contract-111 x4, 115 x5 (see CK-83) | js/cook/mechanics/assemble.js |
| CHT-18 | FIXED-IN-CODE | chaat's own ghost finger went; its first time is the kit's coach (`js/cook/mechanics/assemble.js:30`, `:513`); confirm: contract-102: 0 on chaat in s19-games-2-after |  |
| CHT-19 | FIXED-IN-CODE | not reproduced: s19-lights replayed ten seeds at L1-L4, every call named the card's next layer and never a "no" row (`build/reports/s19-lights.md` "CHT-19"; `js/cook/mechanics/assemble.js:68` next()); confirm: the chaat leak bot (`build/leak_chaat.mjs`) and contract-36 |  |
| PAN-01 | NEEDS-EYES | built in the shared fit and card CSS (`js/shared/fit.js:148`, `css/shared/order-card.css:103`, `:128`), but "Bring me these" is now the grey English placeholder for a missing recording and the row is a sideways row. Picture: the pantry at 740x320 and 1280x665 after each fetched row (two strikes: Zafar's own look) |  |
| PAN-04 | FIXED-IN-CODE | one speech queue (`js/cook/words.js:492`, `js/cook/lang.js:385`); confirm: contract-22 (once-whole): 0 on the pantry and chop in s19-games-2-after (eggs' 4 were fixed in eggs-final). His ear at the play is the last check |  |
| PAN-13 | FIXED-IN-CODE | the pantry trip runs only the first time a dish is ever made in the story (`js/cook/flow.js:1314`, `:2154`; `js/cook/app.js:57`); confirm: sandbox flows cook:day1 and cook:day3 (evidence probe PAN-13). Story days are not in tomorrow's play |  |
| PAN-19 | STILL-OPEN | nobody is in the kitchen while the pantry's cards arrive: an empty kitchen and "Bring me these" (s19-games-2-after/cook-fetch/1280x665 01-start, 02-order-card-big). Nani's box also reads "Cook it the way they said." there, the wrong line for the pantry | js/cook/flow.js (the pantry's order), js/cook/mechanics/fetch.js |
| PAN-20 | STILL-OPEN | no jar on the pantry's shelves has a word pill or speaker at L1 (`js/cook/mechanics/fetch.js` draws none; s19-games-2-after/cook-fetch/1280x665 04-view-pantry) | js/cook/mechanics/fetch.js (the kit's shelf pill, `js/shared/shelf.js`) |
| PAN-21 | NEEDS-EYES | the tally sits on the fridge's steel base, bottom right (`js/cook/mechanics/fetch.js:189-190`); not visible in the L1 shots. Picture: the pantry at L2 with a count of two, at 740x320 and 1280x665 |  |
| PAN-22 | FIXED-IN-CODE | the first item is lit with the dim (s19-games-2-after/cook-fetch/1280x665 04-view-pantry: the milk in its box, the rest dark); confirm: contract-98 (4 breaks at L2: a dotted word's lesson never logged) and contract-107 x2 (lit without its hop) are still open on the pantry, batch B |  |
| ART-18 | FIXED-IN-CODE | one shared talk animation (`js/shared/request-popup.js:730`); confirm: contract-14 (talk): 0 breaks in the s19-games runs |  |
| ART-28 | SUPERSEDED | Zafar, 11 Nov (`docs/decisions/2026-11-10-overnight.md`): the serving kitchen is one tall painting in two views, no shelf, no tiled splashback; ART-77's art replaces today's stand-in (`js/cook/serve.js`) |  |
| ART-39 | NEEDS-EYES | both glasses re-cut (`assets/shared/word-moment/glass-we-s17.webp`, `glass-wf-s17.webp`). Picture: the word moment's glass bases at 1280x665 and 740x320 (evidence probe CHAI-101's shot) |  |
| ART-40 | NEEDS-EYES | built (`assets/cook/worktop-s17/marble-white-s17.webp`). Picture: chai and daar at the four sizes, no seam. See ART-43 for the warmer marble he asked for on 11 Nov |  |
| ART-41 | NEEDS-EYES | built for the Cook side panel and shelf band (`js/cook/station-lib.js:203`, `css/cook-side-v2.css`). Picture: chai at the four sizes; farm, clinic and sewing are out of scope |  |
| ART-43 | NEEDS-EYES | the wash is in (`css/shared/tokens.css:16`, `js/cook/kitchen-kit.js` St.worktopWash). Zafar, 11 Nov, changed the target: the marble "warmed just a little, never yellow or golden". Picture: chai at 1280x665 and 971x318 beside the stone band |  |
| ART-49 | SUPERSEDED | done: the juice run landed 6 Nov and is wired (CHAI-92, CHAI-93; s19-waiting-on-zafar-audit: "done") |  |
| ART-50 | FIXED-IN-CODE | chai's shelf is the walnut stove set (`js/cook/ui.js:2960`, `data/cook.json` art.chaiShelf); the pantry followed in s19-pantry; confirm: `checks.mjs` step `art` and `node build/tools/review/shelfshot.mjs` |  |
| ART-51 | FIXED-IN-CODE | shelf items stand at L 100 / M 91 / S 84 with the 40 CSS px floor (`js/cook/station-lib.js:267-274` classFit; `js/cook/stations/chai-tray.js:74`, `:589`); confirm: contract-115 (item-size): chai has 3 breaks in s19-games-2-after, see batch B |  |
| ART-52 | STILL-OPEN | classFit now sizes chai, daar, eggs, chop and the pantry (`daar.js:666`, `eggs.js:368`, `mechanics/chop.js:422`, `fetch.js`), but baking's jars went back to their old size because class sizing broke their tap reach (`js/cook/stations/baking.js:313`; 8 contract-115 breaks), and `sizecheck.mjs` was never built. The clinic part is out of scope | js/cook/stations/baking.js, js/shared/shelf.js (the pill's reach) |
| ART-53 | NEEDS-EYES | the lids are walnut; the tool handles are still light until their redo (waiting on art). Picture: chai's and the pantry's shelves at 1280x665 |  |
| ART-64 | SUPERSEDED | done: the mock-up rounds ran on 9 Nov and the games were rebuilt from them (audit: "done"; CK-86, CHT-13) |  |
| ART-72 | NEEDS-EYES | the shared tray is painted from his flat stone pictures (`js/shared/shelf.js:298`; `assets/cook/items/v4/kit/tray-stone.webp`). Picture: the band in corn, daar, maani and chop at the four sizes beside his stone pictures |  |
| ART-74 | STILL-OPEN | a publish step, not a builder's: main now holds five such folders, not two (`assets/ChatGPT 261110 1` to `4` and `assets/ChatGPT 261111 1` on origin/main), plus two phone videos in `assets/`. The branch has an empty `assets/ChatGPT 261109 2`. Remove all at the next publish and widen the row | the publish (`/publish`), no game file |
| ART-76 | FIXED-IN-CODE | the cuts were cleaned (`build/tools/art/edge_bleed.py`) and the art check now measures a pink rim (`build/tools/art/artcheck.mjs:10` rule `rim`); confirm: `checks.mjs` step `art`. The grill's white patches are CK-87 (cut fixed) |  |
| SH-12 | FIXED-IN-CODE | L3 dots the item words by the level table (`js/cook/ui.js:1551`, `:3080`; `data/rules.json`); confirm: contract-35 (card-ladder): 0 breaks |  |
| SH-13 | FIXED-IN-CODE | judge passed 21 Oct; counting by level is the central rule; confirm: contract-19 (counting): 0 breaks |  |
| SH-19 | FIXED-IN-CODE | for the kitchen: every game's first time is the kit's coach (SAM-30, CHT-18, MAA-19, PAN-22); confirm: contract-98, -102, -105. The eye test's reshoot is the clinic's, out of scope |  |
| SH-37 | NEEDS-EYES | "one focal thing, one product": a look. Picture: each kitchen game beside chai (the side-by-side sheets, `build/screenshots/sidebyside/`); CK-48's row holds the judge |  |
| SH-51 | NEEDS-EYES | story mode's coin jar (`js/shared/sfx.js:151`), not in a lab game's round. Picture: the day summary at 1366x768 and 390x844. Not in tomorrow's play |  |
| SH-53 | FIXED-IN-CODE | one kit light, one colour (`js/shared/onboard.js`); confirm: contract-87 (one-light) and contract-102 (kit-light): 2 breaks left, both a game's own glow (samosa's heap at L2, maani's raw dough at L2), batch C. The clinic part is out of scope |  |
| SH-60 | STILL-OPEN | help only after the pause: contract-24 breaks 3 times on chai (see SH-205) and the row's own probe is the pantry at L2, where contract-98 x4 says a dotted word showed with no lesson logged | js/cook/mechanics/fetch.js (the pantry's lesson), build/sandbox/lib/contract.mjs (contract-24) |
| SH-62 | SUPERSEDED | the sequence stick went with the old strip (SH-241: "the old skewer strip, group box and count box are gone", `js/shared/order-card.js:11`); what is left is the clinic's cards, out of scope |  |
| SH-63 | SUPERSEDED | for the kitchen: the guide box says the step and the card keeps the order (`js/shared/order-card.js:801`, `js/shared/guide.js:34`), then SH-172 and contract-36/-89 took over the rule. The row's one open note is the clinic's L2 card, out of scope |  |
| SH-64 | NEEDS-EYES | the game stops the read-out at the tap (`js/shared/request-popup.js:32`); the probe tapped late. His ear, or re-run evidence probe SH-64 (path tap-through-popup) | build/sandbox/data/evidence.json (the probe's timing) |
| SH-108 | FIXED-IN-CODE | every top-down station draws the painted marble (`js/cook/stations.js:335`); judge passed; confirm: contract-11 (low-res background) and the frames |  |
| SH-112 | NEEDS-EYES | the band and its item sizes are shared (`js/shared/shelf.js:8`); for the kitchen the measure is contract-115 (31 breaks, see SH-245). The row's open note ("fever strip empty") is the clinic's, out of scope. Picture: each kitchen game's bottom row at 740x320 beside chai's |  |
| SH-119 | FIXED-IN-CODE | one finger, the kit's; the roll's own ghost is gone (`js/shared/onboard.js:57`, `:192`); confirm: contract-102 and contract-44: only the two own-glow breaks under SH-53 are left |  |
| SH-122 | STILL-OPEN | "research and propose": nothing proposed yet for the zooms (no note in `docs/ideas.md` or `docs/questions.md`). Samosa's close-up fold and the praise zoom are today's zooms; Zafar accepted the fold's size change on 11 Nov. A proposal, not a builder's fix | a short proposal in docs/questions.md |
| SH-135 | NEEDS-EYES | a look across modes (the door's Ha/Na pills, Cook's three buttons). Picture: the kit sheet's buttons page (`node build/tools/review/kitsheet.mjs`). No kitchen game shows these in play |  |
| SH-136 | NEEDS-EYES | small looks from 27 Oct at 915x412 on cards that have since been replaced by the 6 Nov card. Picture: the kit sheet's face-circle and word-card pages; likely stale |  |
| SH-137 | SUPERSEDED | clinic only (the face tile, the eye test's card, the doctor's title bar): out of this sweep's scope; move it to the clinic's list |  |
| SH-138 | FIXED-IN-CODE | the four checks run in the contract run (contract-51, -52, -53, -54) and the screen checks (112-116) since; confirm: they do fire (contract-53 x6 today) |  |
| SH-139 | FIXED-IN-CODE | tray faces the burner faces' size, at least 30 px (`js/cook/stations/chai-tray.js:494`; the kit's badge in the other games, `js/cook/kitchen-kit.js:282`); confirm: contract-42 (face-circle) |  |
| SH-140 | FIXED-IN-CODE | the speaker badge centred on the face's edge (`css/shared/face.css:36`); confirm: contract-42. Note: contract-73 finds the bubble's speaker 47x48 px, 1 px under the 48 px tap, 5 times (daar, sekelo, baking): a rounding fix in the shared CSS | css/shared/conversations.css |
| SH-141 | FIXED-IN-CODE | no ripple: the kit's finger only for a drag, hold or swipe (`js/shared/onboard.js:1235`, `css/shared/onboard.css:138`); confirm: contract-44 (one-finger) and contract-102 |  |
| SH-142 | FIXED-IN-CODE | words stay inside their card (`js/shared/word-card.js:398`); confirm: contract-51: 0 breaks |  |
| SH-143 | FIXED-IN-CODE | the eye is centred in its slot (`css/shared/word-card.css:128`); confirm: contract-51 and evidence probe SH-143 |  |
| SH-144 | FIXED-IN-CODE | the big card moves and turns into its row card (`js/shared/word-card.js:409` morph); confirm: contract-40 (one-card) and contract-114 (no-snap) on the order's frames |  |
| SH-147 | NEEDS-EYES | the 6 Nov card replaced this card's look (SH-227); Zafar's own eye on chai L1-L4 is the row's check |  |
| SH-148 | NEEDS-EYES | built (`css/shared/order-card.css:654`): a sideways row "going behind a shadow". At 740x320 the row's cut card is plain in daar, chaat and the pantry; whether that reads as "behind a shadow" or as clipped text is his call. Picture: daar L1 at 740x320, the order card |  |
| SH-149 | FIXED-IN-CODE | every game keeps her drop-down: a step that names no thing shows the first open item (`js/cook/station-lib.js:468-482`); confirm: contract-101 (nani-box): 0 breaks; the arrow is in every game's frames in the s19-games runs |  |
| SH-150 | FIXED-IN-CODE | the big card pops only during the order (`js/cook/ui.js:1959`); confirm: contract-41 (one-popup) and contract-76 |  |
| SH-151 | FIXED-IN-CODE | type and colour come from the tokens (`js/cook/kitchen-kit.js:100`, `css/shared/tokens.css`); confirm: `build/lint/static.mjs` (no font or text colour outside the tokens) |  |
| SH-152 | STILL-OPEN | built, and contract-72 guards it, but contract-72 breaks 6 times in the latest runs (chai L4 and daar L4 "glided ... at once, more than 2.5 cards", chaat L2 x3 "jumped 181 px in one frame", the pantry L4) | js/shared/order-card.js:402, js/cook/ui.js (the row's reset at the serve) |
| SH-154 | FIXED-IN-CODE | the pop-out card is never over a face (`js/cook/ui.js:1988`); confirm: contract-76 and contract-83: 0 breaks |  |
| SH-155 | FIXED-IN-CODE | one central rules file (`data/rules.json`, `js/shared/rules.js`, `js/shared/tokens.js:17`); confirm: the static lint and unit tests |  |
| SH-156 | FIXED-IN-CODE | the cog top right from the central rules (`js/cook/ui.js:4511`, `css/cook.css:100`); confirm: contract-54. Its menu over a tray face trips contract-113 x18 (chai, eggs): decide whether the open menu may cover a face, then fix the check or the menu's place | build/sandbox/lib/contract-s19b.mjs (contract-113) or css/cook.css:102 |
| SH-157 | FIXED-IN-CODE | skip zones from the central rules (`js/shared/request-popup.js:54`); confirm: contract-75 (skip-zone): 0 breaks; the probe's path `tap-zones` now exists |  |
| SH-158 | FIXED-IN-CODE | the hold and its light are in for the grill's turn, the flip, the fry's lift and eggs (`js/cook/mechanics/grill.js:1489`, `js/cook/stations/maani-line.js:190`, `js/cook/station-lib.js:71`); confirm: contract-77 (timed-hold): 0 breaks in the latest runs |  |
| SH-159 | FIXED-IN-CODE | the pill ladder (`js/shared/shelf.js:34`); confirm: unit tests of the rule (`checks.mjs` unit) |  |
| SH-160 | FIXED-IN-CODE | level up after three finished rounds, in the rules file (`js/cook/flow.js:358`); confirm: unit tests |  |
| SH-171 | FIXED-IN-CODE | judge passed 30 Oct; confirm: contract-88 (item-said): 0 breaks |  |
| SH-172 | STILL-OPEN | built (`js/cook/ui.js:779`, `js/cook/station-lib.js:461`; contract-89: 0 breaks), but contract-36 wants the same item step called as it opens: about 90 contract-36 breaks across the games are mostly this conflict or a missing recording (s19-games-2: "36 wants an item step called as it opens; 89 forbids it"). The check must give way | build/sandbox/lib/contract.mjs (contract-36) |
| SH-173 | NEEDS-EYES | a one-group layout centres the words (`css/shared/results.css:296`, `js/shared/results.js:300-302`), but that path is named for a taught round; not proven for a scored round with nothing wrong. Picture: any game's end, words page, no mistakes, at 740x320 and 1280x665 (the runs' `*-results-words.png`) | js/shared/results.js (if not centred) |
| SH-175 | STILL-OPEN | reopened by a failed evidence run on 3 Nov and not re-measured since; the stone cover and the order-first loading (SH-220) changed the picture. Re-run its probe: `node build/tools/review/loadtime.mjs --games chai-tray --level 3 --size 930x430 --net 4000/60` | build/tools/review/loadtime.mjs (a measure, then a fix only if it fails) |
| SH-176 | FIXED-IN-CODE | headline and Nani's line share the 6 Nov type (`css/shared/tokens.css:114`); confirm: contract-33 (headline-size) and contract-101 |  |
| SH-177 | FIXED-IN-CODE | bubbles keep off faces and the panel (`js/shared/conversations.js:679`); confirm: contract-52 and contract-86: 0 breaks |  |
| SH-178 | STILL-OPEN | two strikes, and its last evidence run failed (3 Nov). The code is in (`js/cook/stations/chai-tray.js:1341`), contract-90 passes on chai, but maani L1 still breaks contract-79 ("the order card's light starts 46 ms after the last move ended") and the row has not been re-judged. Re-run evidence probe SH-178 (chai L1-L4, fresh) | build/sandbox/data/evidence.json (re-run), js/cook/coach.js:862 (maani's 79) |
| SH-180 | NEEDS-EYES | the first card's fold-up is built with the fold timings (`js/shared/order-card.js:97`, `:108`), last judged FAIL on 3 Nov before that work. Picture: evidence probe SH-180's strip (chai L2-L3 as the order passes to the next person) |  |
| SH-182 | FIXED-IN-CODE | the plan, hint and light follow the card's order (`js/cook/stations/chai-tray.js:1341`); confirm: contract-90 and the leak bots |  |
| SH-183 | FIXED-IN-CODE | face badges at full contrast, on top (`js/cook/stations.js:32`); confirm: contract-113 (covered) and contract-42 |  |
| SH-185 | FIXED-IN-CODE | the side panel scales with the window's height (`css/shared/order-card.css:582-586`, `js/cook/ui.js:1130`); confirm: contract-116 (card-pad) at the four sizes |  |
| SH-186 | FIXED-IN-CODE | one bubble at a time, placed by the shared rule (`js/shared/conversations.js:679`); confirm: contract-52 and contract-86 |  |
| SH-187 | FIXED-IN-CODE | the gear is out of bounds for a bubble (`js/shared/conversations.js:679`); confirm: contract-52 |  |
| SH-188 | FIXED-IN-CODE | the bubble's tail keeps off the speaker (`css/shared/conversations.css:45`); confirm: contract-73 (see SH-140 for its 1 px breaks) |  |
| SH-189 | FIXED-IN-CODE | judge passed 4 Nov (`css/shared/order-card.css:514`); confirm: contract-101 |  |
| SH-191 | FIXED-IN-CODE | the panel follows the card being said (`js/cook/ui.js:1110` followCard); confirm: contract-99 (see SH-232: 3 breaks on the fold after a serve) |  |
| SH-193 | FIXED-IN-CODE | a card's English is the plain word, one line (`js/cook/ui.js:3065`); confirm: contract-116 |  |
| SH-194 | FIXED-IN-CODE | each item lands in a whole slot (`js/shared/order-card.js:92`, `:366` lead); confirm: contract-72 |  |
| SH-195 | NEEDS-EYES | the code follows his 3 Nov wording (`js/cook/ui.js:3084`); the judge's FAIL read the old wording. Re-judge evidence probe SH-195 (chai L3-L4, fresh save) |  |
| SH-196 | NEEDS-EYES | rebuilt under CHAI-102 (the lesson waits, follows the card, spends its key only when shown: `js/shared/onboard.js:2212-2222`); contract-98 is 0 on chai. He has told this three times: his own play at L2 and L3 (new player, words known) settles it |  |
| SH-201 | FIXED-IN-CODE | every person's clips are fetched ahead (`js/cook/core.js:373` warmFile); confirm: contract-93 (own-words) and contract-26 (opening heard whole); `loadtime.mjs --net` for the slow-network case |  |
| SH-202 | FIXED-IN-CODE | a blurred "no" picture keeps its blur under the grey (`css/shared/order-card.css:550-553`); confirm: evidence probe SH-202 (cook:chai-tray L3-L4) |  |
| SH-203 | FIXED-IN-CODE | judge passed 4 Nov (`js/shared/word-card.js:820`); confirm: contract-83 (card-on-face): 0 in the latest runs |  |
| SH-204 | FIXED-IN-CODE | the old grouped row is gone with SH-241 (one card path, `js/shared/order-card.js:529`); the pop-up fits its card (`js/shared/request-popup.js:161`, `:257`); confirm: contract-51 and contract-100 |  |
| SH-205 | FIXED-IN-CODE | every legal move resets the hint clock (`js/cook/stations/chai-tray.js:377`); confirm: contract-24 (help-ladder). Note: contract-24 has 3 breaks on chai L2 at 740x320 ("the glow on kit-pan-ring came 713 ms after the last action"): the next pan's first-time light read as early help, a check fault to settle in batch A | build/sandbox/lib/contract.mjs (contract-24 against the next-pan light) |
| SH-206 | FIXED-IN-CODE | the row's last cards are drawn again at the serve (`js/shared/order-card.js:301`); confirm: contract-18 (card-rows) and contract-99; see SH-232 for the fold that still fails |  |
| SH-207 | FIXED-IN-CODE | a game reads the word ladder as it was at its start (`js/cook/flow.js:445`); confirm: unit tests of the progress service (`checks.mjs` unit) |  |
| SH-208 | FIXED-IN-CODE | the shelf's groups spread so pills never touch where there is room (`js/shared/shelf.js:30`); confirm: `pillcheck.mjs` and contract-109 (0 on chai) |  |
| SH-209 | FIXED-IN-CODE | the arrow is a fixed tap-sized button centred in her box (`css/shared/order-card.css:494-496`); confirm: contract-101 (nani-box) |  |
| SH-210 | FIXED-IN-CODE | a scrolling list is not counted as a too-full panel (`js/shared/frame.js:236`); confirm: contract-80 (no-jump): 0 on chai |  |
| SH-211 | NEEDS-EYES | the row glides just enough, never back (`js/shared/order-card.js:356-366`), and contract-72 guards jumps, but contract-72 still breaks 6 times (chai L4 "glided 378 px at once", daar L4, chaat x3 "jumped 181 px in one frame", the pantry). Picture: a filmstrip of chai L4's order with an item just before a half card, at 740x320 | js/shared/order-card.js (if the strip shows a tug) |
| SH-212 | WAITING | by the row itself: before the store run (`build/tools/review/loadtime.mjs` measures it). Not for tonight |  |
| SH-213 | STILL-OPEN | the lesson is still the zoom on the small card in the side panel (`js/shared/onboard.js:2216`, `:2379`), with the game held. His 9 Nov version (the item card big in the middle, all blurred, a tap unblurs the picture, then the Kutchi, then the English) is not built; when it shows is still his call (decision 3) | js/shared/onboard.js, js/shared/word-card.js, js/cook/coach.js |
| SH-214 | FIXED-IN-CODE | everyone who came in is back at the end (`js/cook/flow.js:284`); confirm: chai L3 closing frames (s19-games-2-after/cook-chai-tray-l3, both at the counter); contract-20 (one-face) |  |
| SH-215 | FIXED-IN-CODE | her card stays while the box folds over 0.5 s (`js/cook/ui.js:1033-1040`); confirm: contract-101 (nani-box) and the row's own measure (height falls over at least 0.4 s) |  |
| SH-216 | FIXED-IN-CODE | "Words known" beside New player (`js/cook/flow.js:2411-2423`); confirm: contract-98 (lesson-shown) on chai L3 with both on |  |
| SH-217 | FIXED-IN-CODE | the eye is never taller than the picture less its margins (`css/shared/word-card.css:128-132`); confirm: contract-51 (inside-card) |  |
| SH-218 | FIXED-IN-CODE | the count pills at text t3 with a 24 px picture (`css/shared/tally.css:14-17`); confirm: eye: chai L2 at 740x320, a count over a pan beside the shelf |  |
| SH-219 | FIXED-IN-CODE | each pill as wide as its word, one scale per row (`js/shared/shelf.js:30-34`); confirm: `node build/tools/review/pillcheck.mjs` (chai only today: s19-check-sort wants it on every game) |  |
| SH-220 | FIXED-IN-CODE | the stone cover comes first and the order scene loads its own pictures first (`js/cook/flow.js:459`, `:2386`; commit 01a7b7cf4); confirm: contract-80 (no-jump) and `build/tools/review/loadtime.mjs`; his eye at the play |  |
| SH-221 | FIXED-IN-CODE | shared buttons play the soft tap (`js/shared/buttons.js:78-80`); confirm: `build/test_shared_sfx_calls.mjs` |  |
| SH-222 | FIXED-IN-CODE | the 6 Nov card's English is 12 px on phones, on every game since the roll-out (`css/shared/order-card.css:582-586`); confirm: contract-100 (kit-card): 0 breaks |  |
| SH-223 | FIXED-IN-CODE | Lora and Nunito Sans picked and central (`css/shared/tokens.css:114`, `js/shared/tokens.js:54`); confirm: contract-100; the static lint for a font outside the tokens |  |
| SH-224 | STILL-OPEN | no kitchen page loads a Google font any more, but `find.html:11-12`, `first.html:25-26` and `monsoon.html:10-11` still do (and one lab page). Those modes are not in tomorrow's play; small | find.html, first.html, monsoon.html |
| SH-225 | WAITING | by his own words it waits for the app-store wrapper (decision 28). Nothing to build now |  |
| SH-226 | STILL-OPEN | chai plays recorded sounds; eggs, corn, daar and samosa call none of the recorded set for their own moves (no `Sfx` call in `js/cook/stations/eggs.js`, `corn.js`, `daar.js`, `samosa.js`). Each new sound is Zafar's pick on the juice lab page, so this is a pick list first, not a builder's fix | lab/juice.html (a pick list per game), then each station |
| SH-227 | STILL-OPEN | the 6 Nov card and type are on every game (contract-100: 0 breaks; `js/shared/word-card.js:479`, `:628`), but the card's padding and gaps still break contract-116 in six games (daar 2, baking 2, corn 1, chop 1, chaat 1, chai 1), and at 740x320 a card's sideways row shows a cut card at its edge in daar, chaat and the pantry | css/shared/order-card.css, js/shared/word-card.js, js/cook/ui.js:3279 |
| SH-228 | STILL-OPEN | the stuck help is called in daar, eggs, corn, baking, maani and sekelo's threading (`Cook.Coach.stuck`), but two steps still strand the child: daar's stir and maani's roll, 11 s with nothing said and no hint (contract-91 x2) | js/cook/stations/daar.js (stir), js/cook/stations/maani-line.js (roll) |
| SH-230 | STILL-OPEN | the one box rule is in the kit (`js/shared/onboard.js:234`, `:1817` litBox), but lights still fail on the screen: contract-105 x8 (the light on an item card "pokes out" in daar, sekelo, samosa, corn: the card's light is smaller than the card), contract-92 x3 (samosa, chaat, the pantry: the light covers a neighbour), contract-53 x6 (samosa's fill 5.1 times its thing, baking's atto 4.7 times) | js/cook/coach.js:889 (the card's light), js/shared/onboard.js |
| SH-232 | STILL-OPEN | the fold hook is built (`js/shared/order-card.js:108` followFold, `:549`), but its own check still fails on chai L2 at 740x320: "after nana's card folded, cousin's card is 205 px down, cut at the foot ... with the panel at 0" (contract-99 x3, s19-games-2-after) | js/shared/order-card.js |
| SH-233 | FIXED-IN-CODE | contract-44's no-finger clause now follows SH-141: a tap's light has no finger (`build/sandbox/lib/contract.mjs:694`; `js/shared/onboard.js:1235`); confirm: contract-44: 0 breaks in the s19-games runs. `S14_TAPS` is still a per-game list (`contract.mjs:1429`): s19-check-sort's "no opt-ins" clean-up |  |
| SH-234 | FIXED-IN-CODE | `--njg-itpad: max(4 px, 2.6cqi)` (`css/shared/order-card.css:630-632`); confirm: contract-116 (card-pad). Note: contract-116 still has 8 breaks across games on other gaps (one-card rows), see SH-227 |  |
| SH-235 | FIXED-IN-CODE | the "?" pop-up takes the room above or below its button and scrolls (`js/shared/buttons.js:407`, `:411`); confirm: contract-51 (inside-card) and the pop-up frames at 740x320 (baking 06-help-open is whole in s19-games-2-after) |  |
| SH-236 | STILL-OPEN | on this branch the light still stays 430-780 ms after the press (contract-106 x12: sekelo, samosa, corn, chaat, chai, eggs). The fix is on the unmerged s19-taps branch (6f9854622: a drag, roll, stir, swipe or hold step hides its light on a press): merge it, do not rebuild it | merge s19-taps (js/shared/onboard.js, js/cook/coach.js) |
| SH-237 | STILL-OPEN | the rule is in (`js/cook/stations/daar.js:814-819`), but six lit shelf things have no hop: samosa veg-01, chaat ph-lili, the pantry's milk, eggs' n.egg (contract-107 x6) | js/cook/coach.js (the coach gives a lit shelf thing its hop), js/cook/mechanics/fetch.js, js/cook/mechanics/assemble.js |
| SH-238 | FIXED-IN-CODE | a complete step moves on by itself, no tick, next or X (`js/cook/station-lib.js:1156`, `:1186`); confirm: contract-103 (no-buttons): 0 breaks |  |
| SH-239 | FIXED-IN-CODE | one card per thing, ticked as it is made; well done waits for the whole card (`js/cook/flow.js:613`, `js/cook/ui.js:3813`); confirm: contract-108 (praise-last): 0 breaks. One edge: chai L4 740x320 contract-18 x1 ("hakro khun" ticked with no step-close logged) |  |
| SH-240 | FIXED-IN-CODE | Nani's line is chai's type, one line where it fits, else shrink then wrap (`js/shared/fit.js:6`, `:60`); confirm: contract-101: 0 breaks |  |
| SH-241 | FIXED-IN-CODE | the old strip, group box and count box are gone (`js/shared/order-card.js:11`, `:529`); confirm: contract-100: 0 breaks in every game |  |
| SH-242 | STILL-OPEN | the rule is built (`js/cook/ui.js:2968`, `:3089`), but three cards still have no picture: daar's jeeru (`assets/cook/items/v4/daar/jeeru.webp` did not load), baking's atto (a bad `../items-s17-stove/` stem), chaat's potato (`v4/chop/bataato-whole.webp`): contract-104 x6. s19-serve2 (unmerged) rewrites these manifests: merge it first, then re-check | data/cook.json (after s19-serve2's merge) |
| SH-244 | STILL-OPEN | on this branch chaat still drops taps at an item's foot (contract-111 x4), and his 11 Nov retelling (the pill's tap area is its speaker icon alone) is built only on the unmerged s19-taps branch (2dcd088fe, `js/shared/shelf.js`). Merge it, then re-check chaat | merge s19-taps; then js/cook/mechanics/assemble.js |
| SH-245 | STILL-OPEN | contract-115 measures it and still breaks 38 times: baking 16 (8 its jars' sizes, 8 the bowl counted as the main thing, which Zafar has since ruled a work surface: a check fault), daar 7 and chop 7 (the chop band's lying chilli, potato and ginger), chaat 5, chai 3 | js/cook/stations/baking.js, js/cook/mechanics/chop.js, js/cook/mechanics/assemble.js, build/sandbox/lib/contract-s19b.mjs (the bowl) |
| SH-248 | FIXED-IN-CODE | each game's bottom row is named in its settings and read by the kit (`js/cook/kitchen-kit.js:482`, `js/cook/stations/samosa.js:275`); confirm: `build/core/band.test.mjs` (in `checks.mjs` unit) |  |
| SH-249 | STILL-OPEN | the September overlay is deleted (commit e9f8afa4c), but the screen check still finds lights that are not one clean box: contract-112 x10 (samosa's strip light inside its picture x6, corners too round on daar, baking and chop, chaat's light with two lit regions) | js/cook/stations/samosa.js:439, js/shared/onboard.js (corner radius on a small box), js/cook/mechanics/assemble.js |
| SH-250 | FIXED-IN-CODE | the old overlay's second dim went with it (e9f8afa4c); confirm: contract-84 (light-clear) and the dim judge (`build/sandbox/lib/lightjudge.mjs`): 1 break left, baking L2 (the lit oven lifted by 1 of 255), batch B |  |
| SH-251 | STILL-OPEN | no change found for it in `build/tools/review/sidebyside.mjs` (no SH-251 note); the s19-checks-1 brief named it. Re-run the tool on eggs and chop and count the seven moments | build/tools/review/sidebyside.mjs |
| SH-252 | FIXED-IN-CODE | Nani's box reads "Shabash!" at well done in every game (`js/cook/flow.js:625`, `:783`); seen in every game's last stage frame in the s19-games runs; confirm: evidence probe SH-252 (chai, chop, daar) |  |
| SH-253 | FIXED-IN-CODE | a light waits for the stage to be still (`js/cook/coach.js:787`, `:835`); confirm: contract-112 "nothing moves into a light": 1 break left, chaat L1 at 740x320 (under CK-83) |  |
| SH-254 | FIXED-IN-CODE | the well-done face sits beside the dish (`js/cook/kitchen-kit.js:282`, `js/cook/stations/samosa.js:1565`); confirm: contract-113 (covered) and contract-83: the only contract-113 breaks left are the cog's menu over a face in chai and eggs (a check fault) |  |
| SH-255 | FIXED-IN-CODE | every bottom bar and its pills come from the kit (`js/cook/kitchen-kit.js:248`, `js/cook/stations/samosa.js:329`); confirm: the shared-pieces lint (`build/lint/static.test.mjs`) and contract-109: 0 in the kitchen games (the pantry's 15 are its painted shelves, a check fault) |  |
| SH-256 | STILL-OPEN | contract-114 still finds snaps: samosa 21 (its filling's mounds shrink as the strip parks: Zafar accepted the close-up fold, but the check's accepted list names only `sv3-fold`), corn 10 (the cob on the plate: his call at the play), daar 2, chop 2, maani 1, chaat 1 | build/sandbox/lib/contract-s19b.mjs (ACCEPTED_SIZES), js/cook/stations/daar.js, js/cook/mechanics/chop.js |
| SH-257 | FIXED-IN-CODE | the shared-pieces lint is in (`build/lint/static.mjs:32`, `build/lint/static.test.mjs:177`); confirm: `checks.mjs` step `static`. See SH-259 for the one assertion to check |  |
| SH-258 | FIXED-IN-CODE | the asker's face is beside their dish from the first frame in samosa, chaat and baking (`js/cook/stations/samosa.js:385`, `:1260`; seen in each game's 04-view-marble); confirm: contract-20 (one-face) and contract-113 |  |
| SH-259 | FIXED-IN-CODE | one chop: daar and chaat call the standalone game (`js/cook/stations/chop.js:124`, `js/shared/onboard.js:1919`); the lint has no finding left (s19-fixes-f). Note: `build/lint/static.test.mjs:219` still asserted daar as a known break at s19-fixes-f's hand-over: check it is gone | build/lint/static.test.mjs (if still failing) |
| SH-260 | FIXED-IN-CODE | every game centres its play group by chai's measure (CHAI-89; `chop.js:139`, `samosa.js:74`, `:413`, corn, baking, eggs, daar, maani, sekelo); confirm: contract-115 and the before/after pairs. Each game has its own copy of `centreLift`: one shared `St.centreLift` would be tidier | js/cook/station-lib.js (optional tidy-up) |
| SH-261 | STILL-OPEN | not on this branch: no `SH-261` in `js/`. Built with its check (contract-117) on the unmerged s19-taps branch (b7a43a03a, 2dcd088fe and six follow-ups, in `js/shared/onboard.js`, `js/cook/coach.js`, `js/shared/shelf.js`). Merge it before any builder touches those files | merge s19-taps |

## 3. The 44 STILL-OPEN rows, in three builder batches

File ownership, so no two builders share a file:
- **A owns** `js/shared/`, `css/shared/`, `build/` (checks, tools, evidence), the kitchen-wide files `js/cook/ui.js`, `coach.js`, `flow.js`, `serve.js`, `station-lib.js`, `css/cook.css`, the three stray HTML pages, and **`data/cook.json`** (B and C hand A exact lines, as the s19 builders did).
- **B owns** `js/cook/stations/chai-tray.js`, `eggs.js`, `baking.js`, `corn.js`, `chop.js`, `js/cook/mechanics/chop.js`, `assemble.js`, `fetch.js`, `boil.js`, and those games' `data/stations/*.json`.
- **C owns** `js/cook/stations/daar.js`, `samosa.js`, `maani-line.js`, `mishkaki-grill.js`, `js/cook/mechanics/stir.js`, `grill.js`, `thread.js`, `roll.js`, `fry.js`, `fill-fold.js`, `grill-kit.js`, and those games' settings.

### Batch A: shared pieces and the checks. Size: large
Start by merging `s19-taps` and `s19-serve2` (that closes or changes SH-236, SH-244, SH-261, SH-242 and most of contract-104 and -106).

| row | what |
|---|---|
| SH-261, SH-236, SH-244 | merge s19-taps; re-run contract-106, -111, -117 |
| SH-242 | after s19-serve2: daar's jeeru, baking's atto stem, chaat's potato card (contract-104 x6), in `data/cook.json` |
| SH-232 | the panel after a served card folds (contract-99 x3, chai L2 740x320) |
| SH-152 | the order row gliding or jumping too far (contract-72 x6) |
| SH-227, CK-79 | the card's padding (contract-116 x8) and the cut card at the sideways row's edge at 740x320 |
| SH-230 | the card's light smaller than the card (contract-105 x8), a light over a neighbour (92 x3), a light several times its thing (53 x6) |
| SH-237 | a lit shelf thing without its hop (contract-107 x6): the coach's part |
| SH-249 | corners too round on a small box (contract-112): the kit's part |
| SH-172 | contract-36 against contract-89: make 36 accept the call as Nani's card opens |
| SH-256, SH-245 | the checks' own lists: samosa's accepted close-up sizes (114), baking's bowl as a work surface (115) |
| SH-60, SH-178 | contract-24 against the next pan's light; re-run SH-178's probe; maani's contract-79 |
| CHAI-67 | the probe needs a second-play save |
| SH-175 | re-measure the load time; fix only if it fails |
| SH-251 | the side-by-side tool reaching all seven moments |
| CK-56 | the two old tests: fix and list them, or retire them |
| SH-224 | Google fonts out of `find.html`, `first.html`, `monsoon.html` |
| SH-213 | the big blurred-card lesson: **hold** unless Zafar settles when it shows |

Check faults with no row of their own, also A's: contract-113 (the cog's open menu over a tray face, x18 in chai and eggs), contract-80 (the serve's announced glide), contract-37 (the levels table against his six corn bowls, sekelo's bowls, samosa's plural, baking's one row: x28), contract-109 (the pantry's painted shelves, x15), contract-70 (a call queued behind the helper's line is dropped, x11), contract-73 (the bubble's speaker 47 px, x5), `build/lint/static.test.mjs:219`.

### Batch B: chai, eggs, baking, corn, chop, chaat and the pantry. Size: medium (large if CK-72 is in)

| row | what |
|---|---|
| PAN-19, PAN-20 | the pantry: Nani gives the order (B hands A the `flow.js` lines), every jar gets its word pill; with SH-60's missing lesson (contract-98 x4) and the hop (107 x2) |
| CK-83, CK-85 | chaat: the chop light before the vegetable is still (112), taps at an item's foot (111 x4), the light off the potato (105), contract-65's wave gap |
| CK-84, ART-52 | baking: the light 4.7 times the atto jar (53), the jars by size class without losing their tap reach (115 x8, 111), the oven's dim (84) |
| SH-245 | chop's lying chilli, potato and ginger on the band (115 x7 in chop, the same 7 in daar's chop); chai's 3 |
| SH-256 | chop's two snaps (114 x2) |
| CK-54 | eggs: a tap during the order leaves one card out of its row (contract-74) |
| CHAI-108 | log the gap between two pans' green windows at each level, then a proposal to Zafar |
| CK-72 | baking's amounts (jug lines only, word moments): **hold**: a rebuild that also waits on Mum |

Also B's, no row: eggs and corn calls with a late or missing light (contract-78 x7), corn's cob on the plate (114 x10: Zafar's call at the play, do not build).

### Batch C: daar, samosa, maani, sekelo and the serving kitchen. Size: large

| row | what |
|---|---|
| DAAR-45, DAAR-46, DAAR-03 | one stir: daar's stir step calls the shared mechanic, it ends when the child stops, a mark per lap. One piece of work |
| DAAR-12 | fast and slow out of L1-L3: **the part without Mum** is to stop asking a speed before L4; the word moment waits on her lines |
| DAAR-51 | the katori bowl-sized (Zafar, 11 Nov) |
| SH-228 | the stuck help on daar's stir and maani's roll (contract-91 x2) |
| MAA-19 | maani: "Firai!" with its light from L2 (contract-78 x4), a card left ticked after a burn (96 x2), the raw dough's own glow (102) |
| SAM-30 | samosa: the knob, fry and lift calls with their light (contract-78 x12), a heap's own glow (102), the strip's light inside its picture (112 x6, with SH-249) |
| SEK-25 | sekelo: a card per piece on the skewer (C hands A the `data/cook.json` and `ui.js` lines); it also clears contract-37 x6 |
| MAA-23 | big and small as a word moment: **hold**, or build with the engine's lines and report any gap for Mum |
| the serving kitchen | after s19-serve2: a dish on every game's tray (sekelo, corn, baking), CK-81's skewer on its tray |

### Not a builder's
- **SH-226** recorded sounds for the other games: a pick list for Zafar on the juice page first.
- **SH-122** the zooms: a short proposal in `docs/questions.md`.
- **ART-74** the folders on main: at the next publish.

## 4. Known, skip these (for Zafar's play)

These rows are labelled waiting in the fix list (not re-judged in this sweep), plus the six this sweep found to be really waiting. Plain words, one line each.

**Every kitchen game**
- The serving kitchen is a stand-in painting until the redrawn one lands (ART-77); Ali, Ma and Nana still use the old table pose behind the counter (ART-33, CK-46).
- Nani has one cooking mood; the family's "impatient" faces still smile (ART-10).
- The order headline's long and short forms wait on Mum (SH-70). A line with no recording shows its English in grey italic: "Thread them.", "Take a dough ball.", "Stir it three times, slowly.", "Bring me these", "Chop these.", baking's oven lines.
- The big blurred-card lesson (the card in the middle, a tap unblurs it) is not built: when it shows is your call (SH-213). The current small zoom lesson still plays.
- The speaker on a word pill, and remaking a dish after a mistake, for a very young child: your two open questions (SH-262, SH-263).
- Recorded sounds are chai's only; the other games wait on your picks on the juice page (SH-226). No vibration until the app-store build (SH-225).
- Levels 2 and 4 are not in this play (CK-01). Loading between games is a before-the-stores job (SH-212).
- The go-on button's look, the gas flames, the skies and the shared pour are art jobs (SH-106, ART-57, ART-56, SH-117).

**Chai**
- The boil-over still uses the old foam picture (ART-32). The word moment's counter is soft at 1920x1080 (ART-59).
- The juice sounds and visuals are your picks to confirm; Mixkit's licence is yours before the stores (CHAI-92).
- "No" items said last: Mum to confirm it sounds natural (CHAI-39).

**Eggs**
- Its tray and view, "every stove is chai's hob" and the knob rule are still labelled waiting on art (CK-66, SH-246, SH-247), though much of it shows in the last frames. The pot's wall is a little wider at the top left (ART-75).

**Corn**
- The cob shrinks on the plate screen: your call when you play (bigger plates, or the cob past the rim). The cobs on the tray keep no pill, as you said.
- The table background is soft at 1920x1080 (ART-60).

**Baking**
- It still asks "a little" and "a lot" (CK-72: the jug-amounts version is a rebuild, with Mum's amount lines). Flour and sugar jars look alike; the jug's word moment is in chai's art (ART-38); what the oven teaches waits on Mum (CK-70); side-on or top-down is undecided art (CK-69).

**Chop**
- Its background and the pieces' hop from the tray wait on art (CHT-16, CK-71, ART-37). Garlic's pieces wait on art and its word on Mum.

**Chaat**
- The potato, chickpea and sev layers are stamped from the bowls until their top-down scatters are drawn (CK-85, CHT-04).

**Daar**
- The stir line is not recorded (DAAR-26); the ladle, the oil pan, the chop timer ring and the lap-count card wait on art (DAAR-02, ART-63, ART-66, DAAR-50, DAAR-48). No chopped golden onion yet: the heap is red (s19-fixes-f).
- Fast and slow are still asked from the start, with no lesson (DAAR-12: needs its word moment and Mum's lines).

**Maani**
- The roll's finger or circle is your pick on the lab page (MAA-20). Big and small have no word moment yet (MAA-23). Mum's lines (MAA-15, MAA-16). The dough balls, board and trays wait on art (ART-61, ART-62, MAA-24).

**Samosa**
- The fold's arrow stays until you play it. The fold's look, one samosa at a time, the drawn fillings and the fry's look wait on art (SAM-21, SAM-32, SAM-33, SAM-34).

**Sekelo**
- The card for a tomato skewer shows a crate of tomatoes; the mixed skewer's card is the grilled picture (SEK-24, ART-68). The threading line waits on Mum (SEK-18).

**Pantry**
- The shelves are the old pale oak painting; the orange keeps its crate (PAN-06). The wording of Nani's ask waits on Mum (PAN-10). Carrot, peas and most fruit have no single-item card picture (ART-65, ART-11).

**Not a game**
- Five ChatGPT folders and two phone videos sit on the live site until the next publish (ART-74).


## 5. Out of scope

Rows with a "to fix" label outside this sweep, IDs only.
- Clinic, farm, language, book, process, day, ride, lab: CLN-220, CLN-221, CLN-222, CLN-82, CLN-216, CLN-217, CLN-218, CLN-156, CLN-35, CLN-52, CLN-57, CLN-99, CLN-205, CLN-206, CLN-207, CLN-210, CLN-211, CLN-213, BOOK-05, DAY-02, RIDE-11, LAB-08, FARM-01, LNG-20, LNG-21, LNG-22, PRC-10, PRC-11, PRC-06, PRC-12, PRC-13, PRC-14, PRC-15, PRC-16, BOOK-10
- ART rows that are tooling or other modes, not kitchen art: ART-45, ART-46, ART-47, ART-44, ART-42, ART-58, ART-29, ART-30, ART-27, ART-34, ART-35

## Proof
Read only, nothing played. The verdicts rest on today's code at d12741386 (file:line in each row) and on these runs' `contract.json`, `contract.md` and frames: `build/screenshots/sandbox/s19-games-1-after`, `s19-games-1-contract`, `s19-games-2-after`, `s19-games-2-contract`, `s19-games-2-eggs-final` (L1-L4 at 740x320 and 1280x665). Every FIXED-IN-CODE row is confirmed only by the cleanup round's replay of its named check.
