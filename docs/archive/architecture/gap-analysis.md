> Archived 5 Oct 2026 (D1). The plan for step 3, which is done (R0–R7, gate 5 Oct). It describes the code as of 1 Oct, before the refactor; the architecture as built is `docs/architecture/target-model.md` and `code-map.md`.

# Gap analysis and the step 3 refactor plan

Step 2a, 1 Oct 2026, for Zafar's approval. It compares today's code (commit `a57a3a6`) with the target in [`target-model.md`](target-model.md) and orders the work for step 3. Rule IDs point to `docs/process/rules.md`; row IDs (SH-01…) to `docs/process/regressions.md`.

**How the numbers were found:** `wc`, `grep` and small scripts over the repo, reading the main files, running the shared unit tests (118 pass) and three leak bots (clinic, Find it: pass), and a quick layout probe in a headless browser on six live pages at three sizes (scratch only; nothing written to the repo). Counts from `grep` are approximate (± a few); every one names where it came from so a session can re-run it.

---

## 1. The codebase at a glance

| Area | Files | Lines of JS | Pages | State |
|---|---|---|---|---|
| `js/shared/` | 21 | 7,111 | all | the shared kit; good pieces, partly adopted |
| `js/cook/` | 37 | 19,649 | `cook.html` (49 script tags) | live |
| `js/clinic/` | 48 | 14,097 | `clinic.html` (30 tags) | live; ~2,900 lines of it are the dead phase-1 version |
| `js/find/`, `tidy/`, `who/`, `dress/`, `monsoon/`, `snap/` | 94 | 15,942 | six pages | parked |
| `js/*.js` (root) | 10 | 2,455 | `bowl.html`, `index.html`, `first.html` | mostly the 23 Sept fruit-bowl prototype |
| **Total** (without Phaser) | **210** | **59,254** | 13 pages + 15 lab pages | |

Also: 31 CSS files (4,476 lines), 147 scripts in `build/` (31,239 lines, flat in one folder), 64 data files, and a repository whose working tree is **2.7 GB** (`build/` 1.9 GB, of which 2,630 tracked screenshots are 1.1 GB; `sources/` 553 MB; `assets/` 291 MB).

**Who loads what** (from the `<script>` tags):
- **Live:** `index.html` (house), `first.html`, `cook.html`, `clinic.html`.
- **Parked:** the six parked pages all load `js/cook/core.js` (and five load `js/cook/lang.js`, three load `js/cook/ui.js`): **Cook is their framework today.** Find it, Dress up and Snap keep their progress inside Cook's save.
- **Legacy only:** 4,873 lines are loaded only by the two legacy pages: the fruit-bowl stack (1,946 lines) and the clinic's phase-1 stack (2,927). **Built but not wired:** Conversations (`js/shared/conversations.js`, 1,046) and `js/shared/overlay.js` (348) load only in labs.

---

## 2. The gaps

Each gap names the evidence, the target section it breaks, and the session in § 4 that closes it.

### 2.1 Legacy systems the rules say to remove (J7)

| Gap | Evidence | Target | Session |
|---|---|---|---|
| **Star scoring** still runs under the three badges (H5, decisions 1–2) | about 480–524 lines (approximate, by grep) mention stars, star sets, the ear star or the star pay across 50 files. Heaviest: `js/cook/flow.js` (62: `PAY = {help, ear, hand, third}` at line 27, star receipts at 521–524, "three stars to win" text at 642–648), `js/shared/stars.js` (196 lines) + `data/shared/stars.json` (107), `js/cook/ui.js` (28), `js/shared/results.js` (`toStars`/`fromStars`). `star_sets` in six data files (`cook`, `clinic`, `dress`, `monsoon`, `tidy`, `who`). The badges are still *derived from* the stars (`flow.js` 418–440: "accuracy gold ⇔ the ear star") | § 3.5 | R4a (Cook), R5 (clinic), R7 (delete `stars.js` once no live page uses it); parked modes when they move |
| **A daily wage takes coins away** (E29; status question 12) | `js/cook/flow.js:574`: `Cook.save.coins - 5` | § 3.5 Wallet | R4a |
| **The fruit-bowl prototype** (`bowl.html`) | `js/game.js` (1,004), `shell.js` (306), `ui.js` (348), `audio.js` (128), `data.js` (59), `storage.js` (101): 1,946 lines, its own IndexedDB save, its own quilt, its own test (`build/test_e2e.py`). Keep `js/progress.js` (Monsoon loads it) and `data/content.json` (Snap reads it) until those modes move | ask first: it's a playable errand (rule 2), so delete only on Zafar's yes (decision 5c) | R0, if yes |
| **The clinic's phase-1 version** (`clinic-phase1.html`) | `js/clinic/{flow,visit,patient,room}.js`, `mechanics/` (12 files), `stations/` (2), `stubs/` (3): 2,927 lines, plus `css/clinic-phase1.css`, `build/test_clinic_phase1.py`, `build/leak_clinic_phase1.mjs`. It still loads 13 Cook files | delete | R0 |
| **Computer voices without a test-only switch** (G14, AUD-02) | 231 TTS files sit in `assets/audio/` (`cook-tts/` 196, `word/` 20, `carrier/` 15); `speechSynthesis` is called in 24 places across 6 files (`js/audio.js`, `js/clinic/kit.js`, `js/cook/lang.js`, `js/shared/results.js`, `js/shared/story.js`, `js/tidy/engine.js`); `js/shared/family-voice.js` also plays the 53 **unchecked** family clips (313 OK, 60 redo, 53 unchecked). G14 allows TTS for testing and Pages is the test site (J2), so the files **stay**: what's missing is one switch that keeps them out of the store app | § 3.2: TTS and unchecked clips only on the test path; the store package leaves them out | R2b (Voice), R4a/R5 (callers), package step in R1b |
| **Written English for the child** (E1, F23) | ~57 English sentences in mode code (rough grep for `<p>`/`<h4>` text): most in Cook's parked title, day and shop screens (`flow.js` 642–834: "Pocket money from Nani", "Next time" tips, the receipt) and the parked modes' menus | § 4.2 grown-ups' menu | R4b (Cook); parked modes when they move |
| **Stubs never swapped** (shared-api § 6, B17) | 14 stub files, 1,200 lines: `js/tidy/stubs/{rel,say,fetch,passme}.js`, `js/who/stubs/{whichone,tell}.js`, `js/dress/stubs/pick.js`, `js/monsoon/stubs/{say,speech-lab}.js`, `js/snap/stubs/{stars,which-one}.js`, `js/clinic/stubs/{speech,which,overlay}.js` (phase 1) | swap or delete | R0 (clinic's go with phase 1); parked modes when they move |
| **Stale tests cited as checks** | `build/test_e2e.py` waits for `window.__njg`, which only the bowl's `js/game.js:959` defines; `index.html` is now the house, so the test can't pass. The QA checklist still cites it for LAY-02, and the regression list for SH-29, SH-30 and PRC-02 | the sandbox's stage-fill and no-scroll checks replace it | R1b |
| **Dead lab pages** | `lab/basket-angle.html`, `nani-alive.html` (Phaser, bowl era), `card-options.html`, `sidebar-v2.html`, `clinic-core.html` (19 lines), `clinic-heal-a/b/c.html` (per-agent dev pages, superseded by `clinic-heal-host.html`), `shared.html` (shows star slots); `labs.html` is hand-kept | § 6.1 generated `labs.html` | R0 (mark), R3b (generate) |

### 2.2 Shared things built more than once

| Gap | Evidence | Target | Session |
|---|---|---|---|
| **Two light bulbs** | Cook's `UI.bulb` (`js/cook/ui.js` ~1248–1540) and the clinic's `Kit.Bulb` (`js/clinic/kit.js` 536+) | one `js/shared/bulb.js` | R3b |
| **Two Done/Next button sets** | Cook keeps its own `#done-btn` / `#go-btn` (`ui.js` 1706–1733); the clinic uses `js/shared/buttons.js` | buttons kit everywhere (SH-23) | R4b |
| **Two instruction-card and tally systems** | Cook's mission card wrapper and `UI.count` tally (`ui.js` 624–940, 1605–1700); the clinic's `Kit.Card` and `Kit.Tally` | order card + `tally.js` | R3b, R4b, R5 |
| **Two plug-in hosts** | Cook's `Mech.combined` / station library (`js/cook/station-lib.js` 413, `zone.js` 572, `stations.js` 941) and the clinic's `Clinic.Heal.register` / host (`registry.js` 156, `host.js` 337) | one host, one mini-game interface (§ 4.4, § 6.2) | R3b |
| **Six ways to play a voice** | `js/cook/core.js:202`, `js/clinic/kit.js:224`, `js/shared/story.js:84`, `js/shared/conversations.js:648`, `js/shared/results.js:205`, `js/shared/onboard.js:331` (plus the bowl's `js/audio.js`) | one `Voice` (§ 3.2) | R2b, then each caller |
| **Two purses** | Cook's `Cook.save.coins`; the clinic's own `coins` in `UIStore("clinic","state")` (`js/clinic/run.js`) | one `wallet` | R2a, R4a, R5 |
| **Two per-word progress systems, and none in the clinic** | Cook's `seen/right/miss` with 4 stages (`js/cook/core.js` 112–156, used from 25 Cook files); the bowl-era `js/progress.js` with `understand_stage`/`produce_stage` (Monsoon still loads it). The live clinic records **no** word progress (only the dead phase-1 `flow.js` does) | one `Progress` (§ 3.3) | R2a, R4a, R5 |
| **Two scene coordinate systems** | Cook: 1600×900 design pixels; the clinic: shares of a 1536×1024 picture (`data/clinic/scenes-v2.json`), while D15 says 1600×900 | one stage service that takes each scene's own size (§ 4.1) | R3a (Cook), R5 (clinic) |
| **Per-mode copies of the same mechanics** | `say`/`tell`: 8 files (shared `say.js` 369 + 7 copies, 795 lines); `passme`: 3; `count`: 3; `check`: 3; `fetch`: 2 | shared ones when a second live mode needs them | parked modes when they move |
| **Number words written four times** | `{1: "hakro", 2: "ba", 3: "trae", 4: "char", 5: "panj"}` in `js/clinic/kit.js:491`, `pipeline.js:34`, `heal/scene.js:37`, `heal/games/cut.js:26` | `Lang` | R5 |
| **Twelve test hooks** | `__cook`, `__clinic`, `__find`, `__first`, `__home`, `__monsoon`, `__snap`, `__story`, `__tidy`, `__who`, `__charmaker`, `__njg`, each a different shape | one `njgTest` (§ 8.1) | R1a (adapters), then each mode |
| **No shared portrait card** | no "please turn your phone" card in `css/shared/` or `js/shared/` (C2 asks for one shot of it) | `frame.js` | R3a |

### 2.3 Kutchi and grammar in code (G13, G18, LNG-07)

Cook is mostly clean: its frames are data (`data/cook.json` `lines` 46 keys, `grammar`), and `js/cook/lang.js` + `order.js` are a small proto-engine that already handles gender for "one" and describing words. The step 4 engine replaces them (engine-design § 14). The clinic is not clean:

| Gap | Evidence | Session |
|---|---|---|
| Joins built in code | 50 string literals with *pela*, *ne poi* or *ne* in 20 files (11 in the clinic, 8 in Cook, 1 in Find it), e.g. `js/clinic/pipeline.js:445` `i === 0 ? "pela " : "ne poi "`, `heal/games/cut.js:80`, `taste.js:54` | R5 (clinic, through the seam); step 4d (Cook) |
| Word forms chosen in code, without gender | 26 uses of *wadho*/*nindho* in JS, e.g. `pipeline.js:115` `o.size === "big" ? "wadho" : "nindho"`, `ear.js:47` | R5 |
| Kutchi words in code | 79 `kutchi: "…"` literals in 21 files (all but five in the clinic: `cut.js` 17, `taste.js` 10, `ear.js` 10, `pipeline.js` 8…); `heal/host.js:71–72` *Shabash!*, *Arre re!* | R5 |
| No single lexicon | Kutchi spelled out in ~25 data files: `cook.json`, `clinic.json` (98 entries), `clinic/pipeline.json` (43), every `clinic/heal/*.json`, `content.json`, `relations.json`, `find`, `tidy`, `dress`, `who`, `monsoon`, `snap`, `story/first-launch.json` | step 4 (`data/lang/`) |
| The end review shows the base form | SH-02 (*hakro* where the order said *hakri*): the review gets word ids, not the words the order actually used | R4a (pass the `Lang` result through) |
| Sentences are fragments | PAN-02, CHAI-05, MAA-02: no verb, English joins ("with", "and") | **step 4** |

**Step 3 writes no new Kutchi and no new grammar.** It builds the `Lang` seam (R2b) and moves the clinic's hard-coded Kutchi through it (R5); moving Cook's callers onto `Lang.say` is step 4d's (engine-design § 14). Then step 4 changes one folder.

### 2.4 Layout, tokens and positions (F2, F7, J4)

| Gap | Evidence | Rows | Session |
|---|---|---|---|
| **Ellipsis allowed, and the shared kit itself shrinks text too far** (F7: never) | 7 CSS rules set `text-overflow: ellipsis` (`css/shared/order-card.css:45`, `css/cook-side-v2.css:59, 100, 135`, `css/home.css:40, 107, 153`), and `js/shared/fit.js` shrinks only to 12 px "then the CSS ellipsis takes over" (line 5). The shared kit sets its own floors below 14 px: `css/shared/guide.css:28` `--fit-min: 11px`, `:32` 10 px (the "to record" line), `:35` 9 px and `:60` 8 px (the flag), `css/shared/order-card.css:170` `--fit-min: 11px` on short phones | SH-01, SH-09, PAN-01 | R3a |
| **Text below 14 px** (TXT-05) | 74 font sizes under 14 px in CSS and JS; `css/cook-side-v2.css:45` sets `--fit-min: 11px` and 12.5 px pills. The probe found, on the start screens alone: the "to record" flag at 8–9 px (Cook, clinic), the clinic's card headline shrunk to 10 px at 800×360, Cook's day dots at 12 px | SH-28 | R3a |
| **Tap targets under 48 px** (F2, LAY-04) | Probe: the shared guide box's mute and bulb are 26×26 at phone size and 30×30 on a laptop (Cook and clinic), its speaker badge 15–18 px; Find it's rail buttons 42×36 | SH-27, CLN-09 | R3a |
| **No single token file** (F2) | 7 separate `:root` blocks; 391 distinct hex colours in CSS and 747 hex literals in JS | SH-37, CMP-04 | R3a (CSS), then each mode |
| **Positions nudged in CSS** (J4, LAY-09) | 233 `left/top/right/bottom` numbers in CSS (`cook.css` 60, `clinic.css` 46, `style.css` 27, `monsoon.css` 22…), e.g. the clinic's bench and patient layer (`clinic.css:129, 195`) | LAY-09 | R4b (Cook), R5 (clinic) |
| **Positions written in code** | 85 `{x: N, y: N}` literals (clinic 56, Cook 29) and ~77 station layout constants in `js/cook/stations/*` and `mechanics/*` (e.g. `chai-tray.js:70` the chip row at `y: 860`) | SH-34, SH-35, MAA-08 | R4b, R5 |
| **Styles written from JS** | 275 inline style assignments; full `<style>` blocks injected by `js/shared/say.js` and the parked heal games `hair.js`, `hic.js`, `tummy.js` | | R3b, R5 |
| **Each mode its own page grid** | sidebar and stage rules in `cook.css`, `cook-side-v2.css` (85 sidebar rules), `clinic.css`, `monsoon.css`, `style.css`…; Find it, Dress up and Snap borrow `cook.css` | SH-24, SH-30 | R3a |

### 2.5 Versioning, packaging and the repository

| Gap | Evidence | Session |
|---|---|---|
| URLs that skip the stamp (B7, ART-05) | 65 lines build an `assets/…` URL with no `njgV`/`Cook.v` on the line; Cook's go through the Phaser loader hook in `js/version.js` (which stamps them), but about 20 `fetch()` calls don't: `js/dress/core.js:29`, `js/monsoon/core.js:31`, `js/snap/core.js:29–31`, `js/who/flow.js:131`, `js/tidy/engine.js:61`, and the shared `Rel`, `Stars`, `Overlay` loaders | R1b (check), R3b (shared), parked modes when they move |
| No app package | nothing decides which files the store app needs; Capacitor would wrap everything | R1b (`package.mjs`) |
| Site and repo size | GitHub documents a 1 GB limit for a published Pages site and recommends repos under 1 GB. Pages publishes the files at the tip of `main`: 2.83 GB tracked, of which test screenshots are 1.07 GB (2,630 files) and report images 0.72 GB. Untracking those two (`git rm --cached`, kept as release or artifact files) brings the **published site** to about 1.03 GB at once, with no change to how publishing works (B7–B9); `sources/` (0.55 GB of art sources) is the next candidate if needed. The repo's **history** stays large (shrinking it needs a force-push, which is forbidden), but that affects clone time, not the site | R0 (decision 8a); an Action-built site only if 8a isn't enough (decision 8b) |

**Decision 8b, an Action-built site, in short.** *For:* the published site holds only what the game and labs use, so it stays far under 1 GB however big the repo grows. *Against:* a build step sits between the push and the live site. "Live" then means the Action ran green *and* the Pages deploy finished (C9's check gets one more step). A broken Action leaves the old site up. The publish rules (B7–B9) and labs (A10) must be carried into it. Recommended only if 8a isn't enough.

### 2.6 Tests and tooling

| Gap | Evidence | Session |
|---|---|---|
| No layout lint | every TXT and LAY line marked "eye → auto" in the QA checklist (10 lines) has no script | R1a |
| No common sandbox | 17 Python browser tests and 3 Node ones, each with its own server and hook; Python Playwright isn't installed in session containers (only Node's is), so the Python tests can't run there today | R1a, then ported per area |
| Onboarding check is Cook-only | `build/check_onboard.mjs` | R3b |
| Leak bots: good | 11 bots (`build/leak_*.mjs`); Cook's leak checks live inside `test_cook.py` | keep; the sandbox's blind bot adds the in-browser half |
| Flat `build/` | 147 scripts in one folder, test, art and checks mixed | R0 (art tools to `build/art/`) |

### 2.7 Conventions

| Gap | Evidence | Session |
|---|---|---|
| Globals and load order | every file is an IIFE that sets a global; pages list their scripts by hand (49 in `cook.html`); a wrong order breaks a page silently | ES modules page by page (R2a pilot, then R4–R6) |
| Big files with several jobs | eight files over 1,000 lines: `cook/ui.js` 1,841, `cook/mechanics/grill.js` 1,779, `cook/flow.js` 1,272, `cook/mechanics/assemble.js` 1,265, `cook/stations/daar.js` 1,087, `cook/stations/samosa.js` 1,063, `shared/conversations.js` 1,046, `game.js` 1,004 | split when touched (R4a/b) |
| Parked modes lean on Cook | six pages load Cook's core; Find it, Dress up and Snap store their progress in Cook's save | each moves onto the core when its turn comes (§ 5) |
| Docs describe the old shape | `shared-api.md`, `code-map.md`, `testing.md`, `technical-plan.md` carry "Stale points" boxes | R7 (rewritten from the target) |

---

## 3. Regression rows the refactor touches

The orchestrator lists these in each brief (decision 16). "Auto" means the row gains an automatic check; "fix" means the session is expected to fix it.

| Session | Rows |
|---|---|
| R1a/R1b tooling | auto: SH-01, SH-09, SH-25, SH-27, SH-28, SH-29, SH-30, SH-31, SH-33, PAN-01, FL-02, CLN-07, CLN-09, MAA-08, PRC-02 |
| R3a frame and tokens (Cook) | fix: SH-01, SH-09, SH-24, SH-27, SH-28, SH-36, PAN-01 (headline and growing row), FL-02; recheck SH-29, SH-30, SH-37 |
| R3b UI kit | fix: SH-12, SH-16, SH-21, SH-22, SH-23 (kit); recheck SH-03–SH-07, SH-17, SH-18, SH-19 |
| R4a Cook logic | fix: SH-02, SH-10, SH-11, PAN-04, CMP-12 (no stars); recheck SH-08, SH-13, SH-20, PAN-05, LNG-01, LNG-02, CK-01 (every station plays at L1–L4) |
| R4b Cook screens | fix: SH-23, SH-34, SH-35, MAA-08; recheck SH-26, SH-32, SH-37, PAN-07, PAN-08, CHAI-06, every Cook station's open layout rows |
| R5 clinic | fix (the clinic's half of R3a's rows too: SH-27, SH-28 there): CLN-07, CLN-08, CLN-09, CLN-39 (take-back through the framework), CLN-41 (shared onboarding); recheck CLN-03, CLN-05, CLN-06, CLN-23, CLN-25, SH-10, LNG-05 |
| R6 first launch and house | recheck FL-01, FL-02, LNG-01 |
| R7 full review | every row for the touched screens (C6) |
| Step 4 (engine) | PAN-02, CHAI-05, MAA-02, LNG-04, and every row about sentence wording |
| Not refactor work | art rows (DAAR-02, CHAI-07, SEK-07, ART-*), SEK-09 and other mechanic changes: when Cook is finished |

---

## 4. The step 3 plan: sessions, one at a time

> **Revised 1 Oct (Zafar's answers, `docs/decisions.md` 2026-10-01): the lean plan.** Step 3 fixes only what causes repeat bugs and what the engine and the clinic need; everything else (positions into scene data, file splits, first launch and the house, parked modes, the docs rewrite) moves when that screen is next worked on.
>
> | # | Session | From the table below | Model | Size |
> |---|---|---|---|---|
> | R0 | Clean slate: site under 1 GB, the clinic's phase 1 and the bowl errand deleted | R0 | mid-tier | ~2 h, 1–2M |
> | R1 | The checks: the sandbox plays the live flows; the layout lint baseline at five sizes | R1a + the smallest useful part of R1b | mid-tier | ~4 h, 4–5M |
> | R2 | The core: score, one purse (the clinic's coins merged **now**), word progress, voice, the language seam | R2a + R2b | top | ~5 h, 5–7M |
> | R3 | Shared frame and kit: no clipped text, 14 px floor, 48 px taps, one bulb, buttons and card | R3a + the bulb/buttons/card part of R3b | top | ~6 h, 6–8M |
> | R4 ∥ R5 | **Two at once, disjoint files:** Cook onto the core (stars and the wage out); the clinic onto the core and kit | R4a (+ R4b's kit swap); R5 | top | ~6 h each, 12–16M together |
>
> About 6 sessions and 25–35M tokens, finishing around 4–5 Oct. **The clinic is no longer held back for the doctor's visit** (decision 19): it moves in R5, then gets its finishing sessions before ~9 Oct, after Zafar has played the v2 heal games. The gates below still apply, with G2 no longer tied to the visit. The detailed table is kept as the menu the lean sessions draw from.


All sessions run on one integration branch (`refactor/step3`, B18), one at a time, each ending with its report and the checks in target-model § 9.5. The branch merges to `main` at three gates, each after Zafar plays it:

- **G1** after R0–R1b: deletions and tooling only, no change to any live screen. It deletes the clinic's **phase-1** prototype (`clinic-phase1.html`), which is not the clinic the doctor will see (`clinic.html` is untouched).
- **G2** after R4b (Cook on the new footing), and **not before the doctor's visit (~9 Oct)**. The branch by then also carries shared files that `clinic.html` loads (`js/shared/`, `css/shared/guide.css`, `order-card.css`), so merging it earlier could change the clinic he sees. If Cook's changes are wanted live before the visit, the orchestrator first checks the clinic in the sandbox against the G1 contact sheets and asks Zafar.
- **G3** after R7 (everything, the clinic included).

**Who owns the move to the engine.** Step 3 builds only the **seam**: the `Lang` adapter (R2b) with 2b's calls (engine-design § 6), wrapping today's `js/cook/lang.js` and `order.js` unchanged. Moving Cook's callers onto `Lang.say` is step 4d's job (engine-design § 14, ~4 h), so it isn't counted here. The clinic isn't in step 4d's scope, so R5 moves the clinic's hard-coded number tables, joins and word forms out of its code and through the seam.

Estimates are for one session each, in wall-clock hours, with tokens as the house reports them (most of a session's tokens are cached re-reads of the code). Orchestrator review adds about 0.5–1M tokens per session.

| # | Session | Scope (owns) | Checked by | Risk | Model, effort | Hours | Tokens |
|---|---|---|---|---|---|---|---|
| **R0** | **Clean slate** | Tag `pre-refactor`; create the branch. Delete the clinic's phase-1 stack with its page, CSS, tests and stubs; delete the bowl errand only if Zafar says yes (decision 5c). Stop tracking `build/screenshots/` and report images (`.gitignore`, `git rm --cached`; kept as release or artifact files, decision 8a). Move art scripts to `build/art/` and fix their paths. Mark parked and dead labs in `labs.html`. List the stale test references (`test_e2e.py`) for the orchestrator, who owns the QA checklist and regression list (decision 16) | the shared unit tests; every live and parked page opens with no console errors (a 20-line smoke script) | low: nothing live changes | mid-tier, medium | 2–3 | 1–2M |
| **R1a** | **Sandbox and lint** | `build/sandbox/`, `build/lint/`; the `njgTest` contract (`js/shared/test-hook.js`) with adapters over Cook's `__cook` and the clinic's, first launch's and the house's hooks; contact sheet and QA stub; the lint baseline | its own tests on a small fixture page; a full run on the live pages produces the "before" contact sheets and baseline, which the orchestrator reviews | low (tooling) | mid-tier, high; top model reviews the first contact sheets | 6–8 | 5–8M |
| **R1b** | **Package and checks** | `build/package.mjs` (the store app's file list: no TTS, no unchecked clips, no labs); the asset-stamp check; the stage-fill and no-scroll checks ported from `test_e2e.py`; the Pages Action only if decision 8b is yes | a package dry run lists missing and unused assets; the checks run clean or join the baseline | low | mid-tier, medium | 3–4 | 2–3M |
| **R2a** | **Core: save, progress, score, wallet, log** | `js/core/save.js` (moved, schema 2 and its migration), `progress.js`, `score.js`, `wallet.js`, `log.js`, `types.js`, `data/economy.json`, `data/progress.json`; the ES module pilot (these files as modules, the import map in `bump_version.py`, `package.json` "imports"); the import-map check on the family's oldest iPad (decision 2) | `node --test`: migrations from real save shapes (a Cook save with words and coins, a clinic state), badge tiers, the pay formula; the economy simulation hits decision 10's pace | medium: a bad migration loses a child's progress (old keys are kept, as in schema 1) | top model, high | 5–6 | 4–6M |
| **R2b** | **Core: voice and the language seam** | `js/core/voice.js` (one queue; OK clips only in the store app; TTS and unchecked clips on the test path); the `js/core/lang/` adapter with engine-design § 6's calls over `js/cook/lang.js` + `order.js` (`Lang.play` hands the result to `Voice.say`); the gap list | `node --test`: every current Cook line comes out of the adapter word for word as today; gaps listed; sandbox: no audible change in Cook's lab | medium: wording must not change | top model, high | 4–5 | 3–5M |
| **R3a** | **Frame and tokens (Cook only)** | `css/shared/tokens.css`, `js/shared/frame.js` + `stage.js` + portrait card; `fit.js` (shrink then wrap, 14 px floor); the 7 ellipsis rules and the shared kit's sub-14 px floors gone (`guide.css:28, 32, 35, 60`, `order-card.css:170`); 48 px hit areas in the guide box; **Cook's** page put inside the frame. The clinic page isn't touched (it moves in R5) | CSS lint and screen lint at all five sizes on Cook; side by side with the approved mock-up (`build/reports/chai-v2-mockup/`); the clinic's sandbox run compared with G1's, to see what the shared CSS changed there | high: visible everywhere; the lint and contact sheets are the safety net | top model, high | 5–7 | 5–8M |
| **R3b** | **UI kit, host and mode interface** | `bulb.js`, `tally.js`, `shelf.js`, `bubble.js`, `grownups.js`, `focus.js`; `host.js` (one mini-game interface from Cook's and the clinic's hosts); the mode interface; `lab.html` and the generated `labs.html`; `check_onboard` made general; shared loaders stamped | component gallery lab at every state; `node --test`; sandbox on Cook's labs | medium | top model, high | 7–9 | 6–10M |
| **R4a** | **Cook onto the core** | `js/cook/` logic: stars, star pay, receipts and the wage gone; `Score`/`Wallet`/`Progress`/`Voice` calls; the end review gets the words the order used (SH-02); Cook as a mode plug-in (its flow becomes `plan()`); `cook.html` as modules (the hands and knead tags stay commented out, as now); big files split where touched | sandbox: every station and the pantry at L1–L4, fair, mistake and blind bots; Cook's leak checks; pay simulation | high: Cook is the flagship; no mechanic may change (A4) | top model, high | 5–7 | 5–8M |
| **R4b** | **Cook's screens onto the kit** | Cook's Done/Next, bulb, tally and pop-up replaced by the kit; station positions moved from code and CSS into `data/stations/` scene data; English for the child moved behind "?" | full screen lint at five sizes; contact sheets reviewed by a fresh session; regression rows in § 3; Zafar plays (gate G2, after the visit) | high | top model, high | 7–9 | 7–10M |
| **R5** | **The clinic onto the framework** (after ~9 Oct) | `js/clinic/`, `clinic.html`, `css/clinic.css`: the clinic page put inside the frame and onto tokens (R3a's clinic half); a mode plug-in; stages and heal games as mini-games; every Kutchi table, join and word form moved out of code and through the `Lang` seam; coins into the one purse (decision 10); word progress reported; scenes as scene data; inline styles out | sandbox on every stage and heal game at L1–L4; the clinic leak bots; screen lint at five sizes; rows in § 3 | medium-high | top model, high | 10–12 | 10–14M |
| **R6** | **First launch and the house** | `first.html`, `index.html`, `js/first.js`, `js/home.js`, `js/shared/story.js`, `charmaker.js`: onto the frame and `Voice`; the arc data shape with an empty Birthday skeleton (no new content); the bookshelf namespace; the Conversations pause hook (no wiring) | sandbox through first launch at all sizes; screen lint | low-medium | mid-tier, high (top model for the screenshot review) | 4–5 | 3–5M |
| **R7** | **Full review, docs and merge** | Full matrix (five sizes, levels 1–4) by the sandbox; a fresh reviewer session judges the contact sheets, flaws first (C4); every regression row for the touched screens; `stars.js` deleted if nothing live uses it; `shared-api.md`, `code-map.md`, `testing.md` rewritten from the target; merge to `main` (gate G3) | the QA checklist end to end | low | top model, high | 4–6 | 4–6M |
| | **Total: 12 sessions** | | | | | **62–81** | **55–85M** |

**What that costs, in plain terms.** Twelve sessions, run one a day, take about two and a half weeks; the overnight runs can shorten that. Nine of them are heavy top-model sessions, each about the size of one of the Cook v3 station builds; three are lighter mid-tier ones. All together it is roughly one and a half to two times the six Cook v3 station builds (about 55–85M tokens). The orchestrator gives a per-launch estimate before each one (CLAUDE.md).

**Why this order.** The tooling comes first so every later session is measured by it (Zafar's aim; the rows only become checkable once it exists). The core comes before the screens because the screens' badges, coins and words depend on it. The frame comes before the components because the ellipsis and 14 px rules live in it. Cook goes before the clinic because it is live and most played, and the clinic waits for the doctor's visit. First launch is last because its content is about to change (the Birthday re-point).

**If time is short,** the smallest useful path is R0 → R1a → R2a → R3a → R4a: the sandbox and lint in place, one scoring model, no clipped text in Cook, and Cook without stars (5 sessions, about 23–31 hours, 20–32M tokens).

**Running it.** One session at a time (decision of 30 Sept, B1), each with the brief template, its owned files from the table, its regression rows, a hard stop, and a `send_later` check-in; overnight runs can take two consecutive sessions if the first's report is reviewed before the second starts.

### What must wait for the language engine (step 4)

- Every sentence's wording: PAN-02 and the fragments, the "with" and "and" joins (CHAI-05, MAA-02, LNG-04), the polite forms, story and Conversations lines.
- One lexicon (`data/lang/`) replacing the ~25 data files that spell Kutchi.
- The clinic's sentences built properly (R5 only reroutes them through the adapter, unchanged).
- The recording list from simulated play (the sandbox's bots produce the play; the engine's simulator counts it).
- Moving Cook's callers onto `Lang.say` (step 4d, ~4 h, not counted here) and swapping the seam's inside: step 4 touches `js/core/lang/`, `data/lang/` and Cook's callers only.

---

## 5. The parked modes

All six are rebuilt on shared components when their turn comes (H45), after the audit → feedback → approval cycle (A22). Until then they're **frozen**: R0's smoke test checks that each page still opens; a session spends at most ~30 minutes keeping one alive after a core change, and otherwise marks it "parked: rebuild pending" in `labs.html`. Their own copies of star code, stubs and mechanics stay until they move, so step 3 never edits a parked mode's folder.

| Mode | Size today | What it leans on | Recommendation | Why |
|---|---|---|---|---|
| **Find it** | 17 files, 3,144 lines; 33% of its art | Cook's core, words, sidebar (`ui.js`) and save; shared `Rel`, `WhichOne`, `Say` and `Stars` | **When its turn comes: first of the parked modes**, right after the clinic games | It's Arc 1's "find the sweets" (status question 4), so it's next in the order of work (H41); but its lines need the engine and its design needs the audit first, so moving it now would be done twice |
| **Tidy up** | 18 files, 3,047 lines | Cook's core and words; 4 stubs | **When its turn comes** (Arc 1: set the table, pack the sweet box) | Same reasons; its relations already have a shared home (`Rel.Tidy`) |
| **Who did it?** | 13 files, 1,828 lines | Cook's core, `UI`; 2 stubs | **When its turn comes** | A proposed standalone arc; whether it hosts Arc 1's hide and seek is still open (status question 4) |
| **Dress up** | 19 files, 2,571 lines | Cook's core, words, sidebar and save; 1 stub | **When its turn comes** (Big Ma's making-outfits arc) | Its clothing words and art are blocked on Mum (status question 28) |
| **Monsoon rush** | 13 files, 2,880 lines | Cook's core and words; the bowl-era `js/progress.js`; its own audio clock | **When its turn comes** | A proposed arc; its audio clock (`js/monsoon/clock.js`) is the one piece worth harvesting into `Voice` if a second mode needs exact timing |
| **Snap** | 14 files, 2,472 lines | Cook's core, words, sidebar and save; `data/content.json`; 2 stubs incl. its own stars | **When its turn comes** (the day-out trips) | Trips come after Arc 1 |

None is worth moving now: each would need its design audit first (A22), most of its lines need the engine, and moving a mode onto a framework that is itself being built means moving it twice. When each moves, expect about one design audit plus one or two build sessions (top model, 6–10 hours, 6–10M tokens), shorter than its original build because the framework does the shared parts.

---

## 6. Risks

1. **Cook feels different after R4.** Moving code around game logic can change timing and feel. Mitigation: no mechanic changes (A4); the fair and mistake bots play every station before and after; Zafar plays at gate G2.
2. **A save migration loses a child's progress.** Mitigation: schema 1's method (old keys kept), tests on real save shapes, the parent's export before the update.
3. **The engine's real API differs from the adapter.** The adapter copies engine-design § 6 exactly; if 2b's design changes on review, only R2b's adapter changes.
4. **Import maps on old iPads** (iOS 16.4+). Checked in R2a's pilot; the fallback is a small vendored shim.
5. **Pages size.** The site Pages serves is over GitHub's documented 1 GB limit for published sites; it works today, but may not keep working. Decision 8a brings it to about 1 GB; 8b (or moving `sources/` to release files) if that isn't enough.
6. **Cost.** Twelve sessions (about 55–85M tokens). The minimum path above is five.
7. **Parked modes rot.** Accepted by design (§ 5); their code stays in git.
