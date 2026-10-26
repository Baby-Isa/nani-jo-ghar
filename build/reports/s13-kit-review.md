# S13 review: one shared kit

**Session:** S13-R (Fable, high), 26 Oct. Read-only. Answers Step 1 of `docs/sprints/S13-one-shared-kit.md`, widened to every element that could sit shared (Zafar, 26 Oct).
**Method:** grep and counts over `js/`, `css/`, `build/lint/`, `build/sandbox/lib/`, `build/tools/`, the design docs and the fix list. Line numbers are from `main` at `3aa4b5e`.

## 1. Flaws first

These are the reasons a fix lands in one game and misses the next. Each has its evidence.

| # | Flaw | Evidence |
|---|---|---|
| F1 | **Only three pages load the kit.** "Every game" means Cook, the clinic and the lab page. The day loads half of it; Find, Dress and Snap load all of `css/cook.css` (1,189 lines) instead; the house, first launch, Tidy, Who and Monsoon load none of it, not even `tokens.css`. | `clinic.html`, `cook.html`, `lab.html` link all 10 shared sheets; `day.html` lacks `results.css`, `onboard.css`; `index.html`, `first.html`, `monsoon.html`, `tidy.html`, `who.html` link only `app.css` + their own. Own palettes: `monsoon.css` 15 vars, `tidy.css` 13, `who.css` 8, `first.css` 9, `home.css` 3, with 0 uses of `--njg-*`. |
| F2 | **The shared kit breaks its own rules.** 99 of the 882 "raw value" findings are inside `css/shared/`. The kit check only knows four class prefixes, so restyles of the word card, the guide, the onboarding kit and the bubbles go unseen. Colours in JS (Phaser tints, SVG fills) are not checked at all. | `static-known.json`: `results.css` 40, `conversations.css` 18, `onboard.css` 12, `order-card.css` 10, `app.css` 8, `buttons.css` 6. `static.mjs:48` matches only `njg|oc|rs|gb`; 42 selector lines in `clinic.css`, `cook.css`, `day.css` restyle `.wc-`, `.ng-`, `.ob-`, `.cv-` (e.g. `clinic.css:424-429`, `688`; `cook.css:1175-1179`; `day.css:62-65`, `227-229`). 1,196 hex/0x colours in `js/` (clinic 553, Cook 474). |
| F3 | **The same number lives in four places, and a check guards the copies instead of removing them.** | Bulb time: `data/cook.json calm.bulbMs`, `js/clinic/kit.js:1163 Kit.BULB_MS`, `js/shared/bulb.js MS`, `js/shared/conversations.js:48 BULB_MS`; `static.mjs:149-157` reads all four. Help ladder: `guide.js:101 G.PAUSE`, `data/cook.json calm.helpMs`, `js/cook/mechanics/thread.js:137` fallback, `contract.mjs:794 LADDER`. Glow: `focus.css:16` and `cook.css:185` declare the same `:root` vars twice; `station-lib.js:186 Cook.GLOW` sets them again from JS; `clinic.css:546` carries its own `1200ms` fallback. |
| F4 | **Two of everything between the two live games.** The order screen, the bubble, the face circle, the "?" pop-up and the go-on button each exist once in the kit and once more in Cook or the clinic, and the old copies are still alive. | Order screen: the kit's `njg-rq` (`request-popup.js:198-213`) vs Cook's `#intro` (`request-popup.js:41`, `ui.js:1495`); all 13 `cook-side-v2.css` restyles are `body.w6 #intro .oc-card`. Bubbles: `cv-bubble` (`conversations.js:742`), `cl-bubble` (`clinic/kit.js:649`), `#bubble` (`cook/ui.js:252`, live at `:255`, `:311`), `say-bubble` (`who/ui.js:70`). Faces: 11 makers, 6 size variables (section 2). Buttons: `#done-btn`/`#go-btn` (`cook/ui.js:3080-3154`, CSS `:not(.njg-btn)` at `cook.css:172-180`, `812-833`), `.cl-go` (`clinic/kit.js:1328-1333`, `clinic.css:108-124`). "?" pop-up: `cook.css:97`, `clinic.css:403`, `monsoon.css:148`, `home.css:41`. |
| F5 | **Motion has no tokens.** The glow is the only timed thing with a variable; every other hop, pulse, throb and talk picks its own number. | 165 `@keyframes` (134 in game CSS); duplicated names `shake`, `pulse`, `hop`, `helpPulse`, `njgPulse`, `pmIn`; 37 distinct durations in game CSS, 27 in shared. Four clinic throbs at 1-1.1 s (`clinic.css:56`, `82`, `118`, `123`); Cook's `glowPulse` 1 s in four places (`cook.css:154`, `370`, `568`, `819`) beside the token's 1.2 s. Talk: `Lifecycle.talk.SPEC` 380 ms vs `badgeTalk` .45 s (`cook.css:356`, `514`). |
| F6 | **Dead copies nobody can tell from live ones.** | Cook's four-cadence finger `#coach .co-finger` (`cook.css:795-804`) is still set at `coach.js:304-305` although `coach.js:129` runs the kit's finger. `js/shared/input.js` (333 lines) has no caller outside `js/shared/`. `tidy.css:152` `#help`, `monsoon.css:148` `#help-pop`. |
| F7 | **"Every game" checks run on two games.** The sandbox's flows and evidence specs are Cook and the clinic; the parked modes have seven flow ids between them. | `evidence.json` specs: Cook 418, clinic 380, day 57, lab 20, house 10, modes 8, first 4. `CONTRACT_ROUTE` (`contract.mjs:115`): Cook and clinic only. |
| F8 | **Docs and rows are filed by game and by date, not by element.** A glow fix cannot find its siblings. | `regressions.md` has `## Shared components` five times (lines 7, 214, 222, 229, 237); IDs by game prefix (CLN 25, SH 20, KEEP 20, ART 10, LNG 9 ...). `regress.mjs` lists rows by flow, `touched.mjs` maps file to flow; nothing maps element to places. `ui-design-system.md` section 2 repeats the colours as hex and disagrees with `tokens.css` (sage `#DDE6D5` vs `--njg-sage #7f9b7c`). |

**The pattern behind all eight:** the kit was added beside each game's own copy, never instead of it, and the checks were written to tolerate the copies ("known"). A fix then goes to whichever copy the builder finds first.

## 2. What should be central, and how

**Best practice, kept or dropped for this project (one owner, AI builders, ~12 pages, no build step):**

| Practice | Keep? | Why |
|---|---|---|
| Design tokens (colour, type, space, radius, shadow) | Keep, exists | `tokens.css` + `data/layout.json` already do this; the work is loading them everywhere and deleting the copies. |
| Motion tokens | Add | Nine numbers cover every hop, glow, pulse and talk; CSS vars plus one tiny JS reader for Phaser. Cheap, and it is where S12's four fix rounds went. |
| A component library with data-only props | Keep, exists in part | `order-card.js`, `word-card.js`, `guide.js`, `onboard.js`, `buttons.js`, `results.js`, `conversations.js` already take data. Add a face maker and a bubble entry point; delete the game copies. No framework. |
| Contract tests on every game | Keep, widen | 40 checks exist; add per-element ones and make the route reach every live page. |
| Side-by-side (visual) sheets | Add, narrow | One sheet per element across games, built by a script. Not pixel-diff regression: art changes too often. |
| Lint that bans per-game restyles | Keep, close the holes | Widen the prefixes; the known list only shrinks (already). |
| A CSS-in-JS or build pipeline | Drop | GitHub Pages, no build. One `kit.css` with `@import` and one `kit.js` loader give the same "one link per page". |

**The table.** "Where today" counts games or files that draw their own. "Worth it": yes = this sprint; later = a named later sprint; no = stays per-game.

| Element | Where today | Central home | Data-only API | Worth it? |
|---|---|---|---|---|
| Colours | `tokens.css` 34 vars; own palettes in 8 game sheets; 351 distinct hex in game CSS; 1,196 in JS | `css/shared/tokens.css`; `js/shared/tokens.js` (reads the CSS vars once; `Tokens.hex("focus")` for Phaser/SVG) | none: a name | **Yes.** Parked modes: load `tokens.css` and alias their vars to it (`--paper: var(--njg-page)`), no repaint. |
| Textures / surfaces | No real textures: page, panel, card, "paper" are flat colours (`--paper`, `--cl-paper`); scene backgrounds are art | `tokens.css` surface tokens (exist) | none | **No work** beyond colours. Say so. |
| Outlines | 56 border/outline rules in `clinic.css`, 23 `cook.css`, 21 `tidy.css`, 17 `monsoon.css`; three looks: edge, done-gold, focus | `tokens.css`: `--njg-edge`, `--njg-gold`, `--njg-focus`, `--njg-line`, `--njg-line-2` (exist); classes `.njg-edge`, `.njg-done` in `app.css` | class | **Yes**, cheap, with colours. |
| Bob and glow | CSS: `focus.css`, `onboard.css`, `buttons.css` + 17 game keyframes; Phaser: `Cook.GLOW` `station-lib.js:186-282`; talk: `Lifecycle.talk.SPEC` + `badgeTalk`, `ngTalk`, `personBob`, `stBob` | `tokens.css` motion vars (`--njg-glow-ms/-radius/-rgb/-alpha`, `--njg-hop-ms/-lift`, `--njg-talk-ms/-lift/-tilt`, `--njg-pulse-ms`); keyframes only in `focus.css`; `Motion` reader in `tokens.js`; `Focus.phaser(obj)` | classes `njg-glow`, `njg-hop`, `njg-talk`, `njg-pulse`; `Focus.pulse(el)` (exists) | **Yes.** SH-53, ART-18 open; ~30 done glow rows. |
| Word card | `word-card.js` shared; restyled in `clinic.css` (7 lines), `cook.css` (3), `day.css` (10); two intro entrances (`cl-intro-in`, `icWordIn`) | `word-card.js` / `word-card.css`; one `WordCard.pop(el, word)` entrance | `{word, pic, stage, en}` | **Yes.** |
| Order card | `order-card.js` shared; 36 restyles in `clinic.css` (`:410-480`), 13 in `cook-side-v2.css` | `order-card.js` / `order-card.css`; clinic's `.cl-card` wrapper and row classes go | `{who, headline, rows:[{text, count, parts, done, no}], level}` | **Yes.** |
| Recipe card (Cook's ladder) | `js/cook/ui.js` `.ladder .lsec .r6` (~3,300-line file), `cook-side-v2.css:111-151` | `order-card.js`: rows render the three tiers the design already specifies (ui-design-system 12); the ladder calls `OrderCard.update` | the same rows, with `blocks` | **Yes**, the biggest single move; SH-110's speaker-per-row then lands once. |
| Order screen (request pop-up) | kit `njg-rq` (clinic, day); Cook `#intro` with its own markup and the 13 restyles | `request-popup.js` builds the pop-up for Cook too; `#intro` and its CSS go | `Lifecycle.request({cards, say})` (exists) | **Yes.** |
| End screens | `results.js` shared (Cook, clinic); clinic receipt restyled inside it (`clinic.css:276-282`), Cook `.njg-results-open #overlay` (`cook.css:974`); own screens in Monsoon, Tidy, Who, Find/Dress/Snap (`cook.css #panel .res-card`) | `results.js`; the receipt a data slot | `Results.show({badges, words, receipt:[{face, item, ok, coins}]})` | **Yes** for the receipt; parked modes **later** (one sprint "unpark" each). |
| Finger | `Onboard.finger` shared, used by clinic, day, conversations, coach; dead `#coach .co-finger` (`cook.css:795-804`, `coach.js:304`) | `onboard.js` | `Onboard.finger(at, {from})` (exists) | **Yes**, delete the copy. |
| Help box (stuck help) | `Onboard.spot/stuck/demo` shared; callers `coach.js:129`, `clinic/stages/common.js:389`, `heal/scene.js:752`, `heal/host.js:894`, `host.js:486`, `day/window.js:224`; `day.css:291 .day-help-box` restyle | `onboard.js` | script steps (exist) | **Yes**: remove the day restyle; one caller shape through `host.js`. |
| "?" pop-up (grown-ups) | Cook `#help-pop` (`ui.js:800-840`), clinic `.cl-help-pop` (`screen.js:65-187`), Monsoon, home `#grownups` | `buttons.js`: `NjgButtons.grownUpPop(anchor, {goal, actions})`; CSS `buttons.css` | `{goal, actions:[playAsNew, skip, speed]}` | **Yes**: non-negotiable 3 puts all grown-ups' English here; one place for contract-16's `grown` tag. |
| Bubbles | `cv-bubble` shared; `cl-bubble` (clinic kit), `#bubble` (Cook, live), `say-bubble` (Who), `day-bubble` (a `cv-bubble` with a day class) | `conversations.js`: `Conversations.bubble(anchor, {who, text, en, mood})`; `conversations.css` | anchor + words | **Yes** for clinic and Cook (R3; 39 done bubble rows; contract-4 already measures them). Who: with its unpark. |
| Buttons | `buttons.js` shared; live copies `#done-btn`, `#go-btn`, `.btn`, `.pic-btn`, `.rail-btn` (Cook), `.cl-go`, `.cl-help-btn`, `.cl-room-btn` (clinic) | `buttons.js` / `buttons.css`; the `:not(.njg-btn)` blocks go | `NjgButtons.done/next/pic/pills/grownUp` (exist) | **Yes.** |
| Face circles (ART-08) | 11 makers: `oc-face`, `ng-face`, `cl-card-face` (`kit.js:919`), `cl-face doctor` (`heal/host.js:613`), `cl-face person` (`figure.js:62`), `m-face`, `lface`, `ic-face`, `nc-face`, `pm-face` (Cook `ui.js`), `cv-face` (an emoji); sizes `--njg-face`, `--njg-big-face`, `--njg-guide-face`, `--njg-face-hit`, `--oc-face`, `--sb-face` | new `js/shared/face.js` + `face.css`: `Face.circle(who, size)` from `data/faces.json` (the FC2 sheet: mood, mouth) | `{who, size:"row"\|"guide"\|"big", mood, say}` | **Yes.** Three size tokens only; `--oc-face`, `--sb-face` go. |
| "To record" grey italic | `.ph` styled in 10 game sheets (`clinic.css:65-480` ×7, `cook.css:323-1044` ×10, `dress.css:39`, `monsoon.css:120`, `tidy.css:133`, `who.css:44`, `day.css` ×3) and 4 shared | one `.njg-ph` rule in `app.css`; the engine's renderers emit it | class | **Yes**, cheap; contract-16 reads it. |
| Page shells | 12 HTML files each listing 2-12 sheets and 5-36 scripts | `css/shared/kit.css` (`@import` of every shared sheet, in order) and `js/shared/kit.js` (loads the shared scripts in order; `frame.js:185` already stamps versions) | one link, one script per page | **Yes** (small); parked pages switch over when unparked. |
| Game/round scaffolding, state machines | `host.js` (clinic through it); Cook `zone.js`/`station-lib.js`; five own engines in parked modes | `host.js` (R4/R5 in the docs) | stages | **Later**: a sprint of its own. Stays per-game now. |
| Help and bulb ladders | four copies each (F3) | `data/shared.json` `{helpMs, bulbPulseMs, bulbMs}` read by `guide.js`/`bulb.js`; Cook and clinic stop carrying copies | data | **Yes**, small; the static bulb check then reads one table. |
| Level ladders (per game) | `data/cook.json timing`, `data/clinic/heal/*.json levels`; static `ladder` check | as is | | **No**: they are the games. |
| Word support and blanking | `WordCard` stages; contract-35/39; Cook `words.js`, clinic `lang.js` | the card components | `stage` on the row | **Yes** inside the card work (SH-110). |
| Language engine calls | `js/cook/lang.js`, `js/clinic/lang.js`, `js/core/lang/` | as is (two thin adapters) | | **No** this sprint; only the fallback class above. |
| Voice playback | `js/core/voice.js` (one player, store path), `family-voice.js` (live, returns unchecked clips: noted at `voice.js:12`), Cook `lang.js` TTS, clinic `kit.js:440-633`, `results.js:227`, `story.js:116`, `tidy/engine.js:126` | `core/voice.js` everywhere; one store flag | `Voice.say(line)` | **Later** (before the store wrap; checks-to-build "no device voice"). Do CK-48's duplicate load now. |
| Speech and mic, Say | `speech.js` (8 modes), `say.js` (4); clinic `.eye-mic` own look | as is; `.eye-mic` onto `say.css` | | Already central. **Yes** for the eye mic only. |
| Sfx | `sfx.js`; own `new Audio` in `cook/core.js`, `boing.js`, `monsoon/clock.js` | `sfx.js` | name | **Later**, small. |
| Drag, drop and taps | `input.js` shared, zero callers; `pointerdown` in 16 Cook files, 15 clinic | `input.js` | | **No** this sprint: every mechanic, high risk. Decide keep-or-delete `input.js`. |
| Layout and fit at three sizes | `frame.js` + `data/layout.json`, `fit.js`, `layout.mjs` lint | as is | | Already central; parked pages when unparked. |
| Intro cards, celebrations, stamps | `cl-intro` (`clinic.css:685-690`), `#intro.along` (`cook.css:1175-1179`); `rs-badge.celebrate` shared; stamp in `cook.css:445-450`, `cook-side-v2.css:336-343`, `order-card.css:174-179` | `WordCard.pop`; `OrderCard.stamp(card)` with one `.oc-stamp` (a picture, T20) | call | **Yes**, small. |
| Transitions and page turns | `day.css:108-131`, `njgTurn` (`frame.css:42`) | `day` | | **No** (ART-27 waits on art). |
| The pour | `pour.js` shared (SH-117), Cook only | as is | | Already central; daal and taste when their art lands. |
| Timers and motion in JS | `setTimeout`: Cook 102, shared 51, clinic 51 | motion numbers from `Motion`; no scheduler | | Tokens **yes**; a scheduler **no**. |
| Save and progress | `shared/save.js` (live), `core/save.js` (module twin, same keys), `uistore.js`, `progress.js`, `monsoon/core.js` | as is | | **No**: works, planned with the module move. |
| Asset loading, preload | Cook 27 files, clinic 2; `loadcheck.mjs`; CK-48 | `station-lib loadArt/capLoad` | | **Later**; CK-48 only. |
| Labs toggles, settings | `mode.js lab()`, `gen_labs.mjs`, `lab.html`/`labs.html` | as is | | Already central. |
| Debug/test hooks | `njgTest` (9), `__clinic` (9), `__cook` (3), `__njgCookLoading` (9) | one `window.njgTest` | | **Later** with `host.js`. |
| Sandbox flows and evidence specs | per game (F7) | a `kit` flow group: every live page's shared screens at both sizes | | **Yes** (section 4). |
| Per-game CSS files | `clinic.css` 763, `cook.css` 1,189 + 359, `day.css` 315 ... | stay; the shared bits move out | | Stay per-game by design. |
| Docs, rows, briefs | per game and date (F8) | an element tag on rows; `kitmap.mjs` (section 5) | | **Yes.** |

## 3. The move list

Ordered by how often Zafar has hit the element (fix-list rows, open + archived, matched by keyword; a rough proxy).

| Rank | Element | Rows | Every place drawn today (file:line, game) → what changes |
|---|---|---|---|
| 1 | Cards (word, order, recipe) | 25 + 170 | `clinic.css:45-67`, `208-214`, `410-450`, `475-480` (clinic `.cl-card` wrapper and rows) → delete, OrderCard only · `clinic/kit.js:919` (face in card) → `Face.circle` · `cook-side-v2.css:111-151` (ladder rows), `cook/ui.js` ladder (`:1292`, `:1320` and the `.r6` builder) → rows through OrderCard · `cook-side-v2.css` 13 `#intro .oc-card` lines → delete · `clinic.css:668-675`, `699` (`.wc-*` in the eye and tooth games), `cook.css:1175-1179`, `day.css:62-65`, `154`, `227-229`, `278` (`.wc-pic` restyles) → `WordCard` options (`fit: "contain"`, `bg`) · SH-110 speaker at the start of every blanked row → `OrderCard` row option. |
| 2 | Pour and fill | 9 + 64 | Already `pour.js`; no move (waits on art). |
| 3 | Face circles | 9 + 60 | `order-card.js` `.oc-face` · `guide.js:306` `.ng-face` · `clinic/kit.js:919`, `heal/host.js:613`, `figure.js:62`, `clinic.css:47-49`, `196-214`, `443-445`, `523-529` · `cook/ui.js:1145`, `1292`, `1320`, `cook.css:355`, `406-407`, `497`, `513`, `744`, `cook-side-v2.css:59-68`, `84-86`, `186-187`, `245-246`, `279-286` · `conversations.js:743` (emoji) → all call `Face.circle(who, size)`; six size vars → three. |
| 4 | Buttons | 8 + 43 | `cook/ui.js:3080-3154` (`#done-btn`, `#go-btn`) → always the kit's; `cook.css:172-180`, `812-833` (`:not(.njg-btn)`), `218-227`, `1006-1042` (`.btn`, `.pic-btn`), `87-95`, `683`, `774` (rail, help, bulb) → delete · `clinic/kit.js:1328-1333` (`.cl-go`), `clinic.css:108-124`, `181`, `302`, `402`, `437`, `585` → delete, `NjgButtons.next/pic` · `clinic/heal/games/cut.js:491` → `ctx.button` always. |
| 5 | End screen and review | 7 + 99 | `clinic.css:276-282` (receipt inside the shared screen) → `Results.show({receipt})` · `cook.css:974` → inside `results.css` · parked modes' own screens (`monsoon.css:190-193`, `257-258`; `tidy.css:193-195`; `who.css:96-97`; `cook.css #panel .res-card`, `parked-panels.css`) → later, at unpark. |
| 6 | Help (box, "?", ladder) | 11 + 42 | `day.css:291` → delete · `cook/ui.js:800-840`, `cook.css:97-102`, `1070`; `clinic/screen.js:65-187`, `clinic.css:403-404`, `579`; `monsoon/ui.js:49-54`, `monsoon.css:148` → `NjgButtons.grownUpPop` · ladders: `data/cook.json calm.helpMs/bulbMs/bulbPulseMs`, `clinic/kit.js:1163`, `clinic/run.js:33`, `conversations.js:48`, `thread.js:137` → one `data/shared.json`. |
| 7 | Bob, hop, pulse, glow | 10 + 42 | `cook.css:154-157`, `185-191`, `370`, `568`, `819`, `833`, `860`; `cook-side-v2.css:346`; `clinic.css:56`, `82`, `118`, `123`, `360`, `546-547`, `619-620`, `681`, `692-693`, `708-709`; `day.css:96-97`, `145`, `162`, `288-289`; `dress.css:12`; `find.css:44`; `who.css:117-121`; `tidy.css:94` → the four shared classes, keyframes deleted · `station-lib.js:186-282` → reads `Motion` · talk: `cook.css:356`, `514` `badgeTalk`, `guide.css ngTalk`, `first.css stBob` → `njg-talk` on the token. |
| 8 | Bubbles | 6 + 39 | `clinic/kit.js:649-669` and every `cl-bubble` caller in `clinic/stages/*.js`, `heal/games/*.js`, `clinic.css:128-138`, `722` → `Conversations.bubble` · `cook/ui.js:252-312`, `cook.css:112-131`, `337-369`, `1155` → `Conversations.bubble` · `day/book.js:290` → drop the `day-bubble` class, `day.css:98-99` goes · `who/ui.js:70`, `who.css:131` → at unpark. |
| 9 | Colours and outlines | 5 + 17; 4 + 61 | `cook.css`, `clinic.css`, `monsoon.css`, `tidy.css`, `first.css`, `who.css`, `home.css`, `cook-side-v2.css` `:root` palettes → aliases to `--njg-*`; 882 raw values → tokens, file by file (the known list shrinks per file) · `js/` colours: Cook `art.js`, `stations/*.js`, clinic `figure.js`, `heal/games/*.js` → `Tokens.hex` for UI colours only (art tints stay). |
| 10 | Finger | 3 + 17 | `cook.css:795-804`, `coach.js:304-305` → delete. |
| 11 | Order screen | (in cards) | `cook/ui.js:1495`, `1612` (`el: #intro`) → no `el`; Cook's `#intro` markup in `cook.html` and `cook/dom.js` → delete. |
| 12 | "To record" | (in language, 32 + 174 incl. voice) | the 27 `.ph` rules listed in section 2 → one `.njg-ph`; renderers in `cook/lang.js`, `clinic/lang.js`, `guide.js`, `order-card.js`, `word-card.js`, `conversations.js:83` emit it. |
| 13 | Stamps and intro cards | 1 + 8; 8 + 27 | `cook.css:445-450`, `cook-side-v2.css:336-343` → `OrderCard.stamp`; `clinic.css:685-690`, `cook.css:1175-1179` → `WordCard.pop`. |

## 4. The checks that keep it central

Each runs on every page the sandbox plays; a break is never baselined.

| Element | Check | Where | Kind |
|---|---|---|---|
| All | **Every page links `kit.css` and `kit.js`** and no other shared file directly; every live page is in the contract route. | `static.mjs` new `shell` check; `CONTRACT_ROUTE` | static |
| All | **No CSS outside `css/shared/` selects a shared class**: prefixes widened to `njg, oc, rs, gb, wc, ng, ob, cv, fit, say`; `:not()` stays allowed; the known list only shrinks (exists). | `static.mjs:48` | static |
| All | **No raw colour in `css/shared/`** at all (the 99 go to zero first), and no raw colour in game CSS except inside `:root` alias blocks. | `static.mjs tokens` | static |
| All | **No `@keyframes` outside `css/shared/`** named like a kit motion (glow, hop, pulse, throb, bounce, talk, bob, shake); no `animation:` duration outside `css/shared/` on a kit class. | `static.mjs` new `motion` | static |
| All | **Colours in JS only through `Tokens`** for UI (a `0x`/`#` literal in `js/` outside `js/shared/tokens.js` and art data is a finding; art-only files listed once). | `static.mjs` new `jscolour` | static, known list |
| Cards | **One card markup**: every `.oc-card` on screen has only kit classes on it and its rows (no `cl-`, `r6`, `icard`); SH-110: every blanked row starts with a speaker. | `contract-hook` `rows`; new contract-40 | contract |
| Order screen | contract-1 (exists) plus: the pop-up on screen is `.njg-rq-card`, never `#intro`. | contract-1 | contract |
| End screen | contract-38 (exists) plus: nothing inside `.njg-results` carries a non-kit class. | new contract-41 | contract |
| Faces | **Every face circle is a `.njg-face` of one of three sizes**; measured width equals its size token within 1 px; ART-08: the sprite's eye line sits at 42-48% of the circle (from `data/faces.json`). | `contract-hook` `faces` (exists); new contract-42 | contract |
| Glow and hop | contract-8 (one lit thing) plus: every running glow/hop animation on screen has the token's duration and the token colour; Phaser's glow reports `Motion` values through `hl`. | contract-8, new contract-43 | contract |
| Finger | **One finger element on screen at a time, `.ob-finger` only**; cadence from the token. | new contract-44 | contract |
| Help box | contract-24/25 (exist) plus: the help light is `.njg-onboard`, nothing else dims the page. | contract-24 | contract |
| Bubbles | contract-4 (exists) plus: every bubble is `.cv-bubble`. | contract-4 | contract |
| Buttons | contract-12, -34 (exist) plus: every visible go-on, done, pic or pill button has `.njg-btn`. | contract-34 | contract |
| "To record" | contract-16 (exists): the `rec` tag read from `.njg-ph` only. | contract-16 | contract |
| Ladders | the bulb check reads one table (`data/shared.json`); fails if a second table exists. | `static.mjs bulb` | static |
| All | **The side-by-side sheet**: `kitsheet.mjs` crops every element (face, card, bubble, button, glow frame, finger frame, end screen) from every page at 1366x768 and 915x412 into one sheet per element; the judge passes each sheet, not each game. | `build/tools/review/kitsheet.mjs` | visual, judged |

The static known list: 936 today. Target at the end of S13: `kit` 0, `tokens` under 300 (parked-mode sheets only), and the new checks start at 0 known (never added to).

## 5. Faster, cheaper, first-time fixes

The sprint file's seven, kept or dropped, then mine.

| Idea | Verdict | Why / how |
|---|---|---|
| Shared frame-capture helper (strips at 250 and 500 ms, both sizes) | **Keep, mostly exists** | `evidence.mjs` already takes `strip:<sel>:<n>x<ms>` (`lib/evidence.mjs:48`); what is missing is a one-line command a builder runs: `node build/tools/review/capture.mjs --flow X --at <moment> --strips 250,500 --sizes both` writing a named folder plus an index. One Sonnet task. |
| Judge batches by script | **Keep, half exists** | `evidence.mjs --judge` builds batches from rows. Add `--from-report <builder report>`: reads the report's "frames" list and the capture folder, and writes the batch; the judge never sees a hand-made one. |
| "Stuck player" test mode for every help check | **Keep** | `drivers/catalog.mjs:38` has `idle-twice` for Cook and heal only; make it a path (`#stuck`) every flow accepts, and contract-24/25 run on it. |
| Briefs list every place an element appears | **Keep** | `kitmap.mjs`: for each element, the grep rules of section 3 → file:line list; `brief.mjs` pastes it under "PLACES". Until the moves are done it is the move list; after, it should print the kit file only (a check: the map has one entry per element). |
| Model by kind of work | **Keep, exists** | `briefpack.mjs MODEL_TABLE`; no change. |
| Smaller single-purpose builders, one fix round in budget | **Keep** | see section 6. |
| "Done" = the judge's PASS on every game the element appears in | **Keep, as a rule in code** | `evidence.mjs --apply` refuses a PASS for an element row unless the `kitsheet` for that element passed; the row's Check names the sheet. |
| Mine: **delete before you build** | Add | Each builder's first task is deleting the game copy (the `:not(.njg-btn)` blocks, `co-finger`, `cl-bubble`), so there is one place to fix. A half-move is the S12 failure mode. |
| Mine: **the known list per file, not per check** | Add | `--write-known` prints the per-file counts; a builder's brief says "clinic.css tokens: 194 → 0". Progress is visible and cannot hide in another file. |
| Mine: **`kit.css` first** | Add | Loading the kit on every page (F1) is half a day and makes every later fix reach the parked modes too, without touching their code. |
| Mine: **one doc section per element** | Add | `docs/design-language/ui-design-system.md` gets a "Kit" section: element → file, API, token names, its checks; the hex list in section 2 goes (tokens.css is the truth). Rows get an `elem:` tag; `regress.mjs --elem glow` lists them. |

## 6. How to split step 2

Two builders at a time, disjoint files, Opus high unless marked. Each brief: delete the copy first, one fix round, then the judge on the element's `kitsheet`.

| Builder | Scope | Owns | Size | Model |
|---|---|---|---|---|
| **S13-A1 tokens, shell, motion** | `kit.css`/`kit.js` on every page; parked palettes aliased; the 99 shared raw values to 0; motion tokens and the four shared classes; `tokens.js` + `Motion`; `Cook.GLOW` reads it; delete the 17 game keyframes; `data/shared.json` ladders; `.njg-ph`; the static checks `shell`, `motion`, `jscolour`, widened `kit` | `css/shared/*`, `js/shared/tokens.js`, `focus.js`, `guide.js`, `bulb.js`, all `*.html`, every `css/*.css` (colour and motion lines only), `station-lib.js:176-290`, `build/lint/*` | ~1 day | Opus high |
| **S13-B1 cards and order screen** | OrderCard rows for the clinic (36 restyles → 0) and Cook's ladder; SH-110 speaker rows; Cook on the kit's pop-up, `#intro` deleted; `WordCard.pop`, `OrderCard.stamp`; contracts 40, 41 | `order-card.js/.css`, `word-card.js/.css`, `request-popup.js`, `cook/ui.js`, `cook/dom.js`, `cook.html`, `clinic/kit.js` (card parts), `clinic.css` card lines, `cook-side-v2.css`, `contract.mjs` | ~1.5 days | Opus high |
| **S13-A2 faces, buttons, finger, "?"** (after A1) | `face.js` + `data/faces.json` from the FC2 sheet, 11 makers → one, three sizes; old buttons deleted in Cook and clinic; `co-finger` deleted; `grownUpPop`; contracts 42, 44, widened 34 | `js/shared/face.js/.css`, `buttons.js/.css`, `onboard.js`, `clinic/screen.js`, `clinic/heal/host.js:600-620`, `figure.js:55-70`, Cook `ui.js` face and button lines (B1 must have finished `ui.js` first, or A2 waits), `coach.js`, `monsoon/ui.js` | ~1 day | Opus high |
| **S13-B2 bubbles, end screen, tools** (after B1) | `Conversations.bubble` for clinic and Cook; `Results` receipt slot; `capture.mjs`, `--from-report`, `#stuck` path, `kitmap.mjs`, `kitsheet.mjs`; the `elem:` tags and doc section | `conversations.js/.css`, `results.js/.css`, `clinic/kit.js` bubble parts, clinic stages and heal games (bubble calls only), `build/tools/review/*`, `build/sandbox/drivers/*`, docs | ~1 day | code Opus high; tools Sonnet medium |
| Wait for a later sprint | `host.js` for Cook; `input.js`; one voice player; unparking Tidy, Who, Dress, Monsoon, Snap; test hooks; sfx; save twin | | | |

Then: every live page replayed at both sizes, `kitsheet` per element to the judge, `/review`. Budget fits $120-160 only if A2 and B2 are each one fix round; if the ladder move in `ui.js` runs long, drop B2's bubbles to Sprint 14 rather than the checks.

## 7. Decisions for Zafar

Answer "yes to all except ...".

1. **Load the kit on every page first** (`kit.css`, `kit.js`), parked modes included, before any component moves. *Recommend yes.*
2. **Add motion tokens** (glow, hop, pulse, talk: nine numbers) and delete every game's own keyframes for them. *Recommend yes.*
3. **Cook's recipe ladder becomes OrderCard rows** (the biggest move, in `js/cook/ui.js`). *Recommend yes: it is where SH-110 and most card rows live.* If no, SH-110 is built twice.
4. **Cook uses the kit's order pop-up**; its own `#intro` goes. *Recommend yes.*
5. **One face maker, three sizes** (row, guide, big), from the FC2 sheet; the emoji faces in conversations become circles too. *Recommend yes.*
6. **Delete the old buttons, finger and bubbles** in Cook and the clinic (not replace beside). *Recommend yes; nothing a child sees changes.*
7. **One "?" pop-up component** for grown-ups in every game. *Recommend yes.*
8. **One ladder table** (`data/shared.json`) for help, bulb and bulb-pulse times; the static check reads it alone. *Recommend yes.*
9. **Do NOT centralise this sprint:** drag/tap handling, the round state machines (Cook onto `host.js`), the voice player, save, sfx, test hooks, the parked modes' own screens. *Recommend yes (later sprints); the voice player before the store wrap.*
10. **Delete `js/shared/input.js`** (no callers) rather than carry it. *Recommend yes.*
11. **The checks of section 4** are built with their moves, all start at zero known, the kit prefixes widen. *Recommend yes.*
12. **The side-by-side sheet is the "done" rule**: an element row passes only on its `kitsheet`. *Recommend yes.*
13. **Tools:** `capture.mjs`, judge batches from the report, the `#stuck` path, `kitmap.mjs` in briefs; Sonnet for all four. *Recommend yes.*
14. **Docs:** one "Kit" section in `ui-design-system.md`, its hex list removed; `elem:` tags on rows. *Recommend yes.*
15. **Budget:** four builders in two pairs, about $140-180 and 2-3 days (above the $120-160 line by the second pair). If held to $160, drop B2's bubble move to Sprint 14. *Recommend the full run.*

## Orchestrator's check (26 Oct)
- **Wrong: `js/shared/input.js` has callers.** `js/shared/host.js:68` and `js/day/book-play.js:31` import `createInput`, and four pages map it. Decision 10 is withdrawn; F6 and the drag/taps row are corrected to "used by `host.js` and the book".
- **Overstated: the sage "disagreement".** `ui-design-system.md` gives the box fill `#DDE6D5` and the band `#7E9A76`; `--njg-sage #7f9b7c` is the band. The doc's hex list should still go (decision 14), but it is not a conflict.
- Spot-checked true: the dead Cook finger (`cook.css:795-804`, still set at `coach.js:304-305`); `index.html` and `tidy.html` link no shared sheet but `app.css`.

## Proof

Counts and line numbers above come from grep over the tree at `3aa4b5e`; no code was changed, no sandbox run was needed. Key commands: `cut -d'|' -f1,2 build/lint/static-known.json | sort | uniq -c`; `grep -c "@keyframes" css/*.css css/shared/*.css`; `grep -n "\.wc-\|\.cv-\|\.ob-\|\.ng-" css/*.css`; `grep -rl "\bOnboard\." js | cut -d/ -f2 | sort | uniq -c`; `grep -o '"flow": *"[a-z]*' build/sandbox/data/evidence.json | sort | uniq -c`.
