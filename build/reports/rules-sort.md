# Rules sort (decision 99): every rule and decision into one pile

Read-only sort for the chop. Piles: **CODE-HAS** (a named check already enforces it; the text can go), **CODE-TO-DO** (should be a check and isn't; the check is named), **DOC** (a design or how-to fact; destination named; ALREADY THERE when the destination says it), **CLAUDE** (every chat must know it at start and code can't hold it), **ARCHIVE** (obsolete, superseded, one-off, restatement). "ASK ZAFAR" flags the few that need him. Checks were read in code, not docs (`build/sandbox/lib/contract.mjs`, `build/lint/*.mjs`, `build/check_*.mjs`, the `*.test.mjs` files, `build/tools/review/*.mjs`, `build/tools/ops/*.mjs`). The open rows are the 70 whose Status starts open/reopened in `docs/process/regressions.md` on 13 Oct.

## Part C: summary

### Counts

Part A has 220 table rows covering every rule ID in `rules.md` (a row holds the IDs one bullet gives together, e.g. "C2, C11, C16, decision 15, decision 24"). A row's first pile is where its text goes; "also" counts rows that name the pile as a second half (a design sentence that stays in a doc while a check holds the testable half).

| Pile | Rows (first pile) | Rows naming it at all |
|---|---|---|
| CODE-HAS | 62 | 74 |
| CODE-TO-DO | 22 | 53 |
| DOC | 94 | 110 |
| CLAUDE | 33 (29 say ALREADY IN CLAUDE.md) | 34 |
| ARCHIVE | 7 | 8 |
| ASK ZAFAR | 2 (5 questions in all, listed at the end of Part C) | — |

"ALREADY THERE" appears on 151 rows: most DOC rows need no edit at all, only the deletion of the `rules.md` copy. The DOC rows that need a line added are marked "add" or "not there" (about 35).

Part B (89 rows: decisions 1–99 and the sprint files' lasting items): CODE-HAS 27, DOC 28, CLAUDE 12, ARCHIVE 12, CODE-TO-DO 9, one mixed (97). 71 of the 89 say their destination already holds the content; the 18 that don't are marked "no" or "partly" with the line to add.

### The CODE-TO-DO work list, ranked by mistakes prevented

| # | Check | What it checks | Where | Size | Retires | Guards (open rows) |
|---|---|---|---|---|---|---|
| 1 | **Red-then-green gate** | `--apply` marks a row built only when the cache holds a FAIL or red machine verdict for that row's current probe hash from a run before the PASS run; two FAILs since the last built set status `open (two strikes: Zafar)` and list the row in `docs/status.md`; a judge line naming the builder's session is already refused. | `build/tools/review/evidence.mjs --apply` + `lib/evidence.mjs applyGuard` | M | C22, C23, C20, C4 (half), decisions 76, 78, 86, 96 | every reopened row: SH-10, SH-69, CHAI-13, DAAR-02, DAAR-13, DAAR-22, CK-07, CK-21, CK-27, CLN-01, CLN-17, CLN-26, CLN-37, CLN-45, CLN-104, CLN-106, CLN-116, CLN-118, CLN-119, CLN-126, CLN-127, ART-10, ART-11, ART-19, ART-20, LNG-01, LNG-04, LNG-06, LNG-10, LNG-11 |
| 2 | **Publish gate** | `publish.mjs` refuses (not `--force`) when: any row is open/reopened without a `waits on Mum/art/Zafar` note; `checks.mjs` red; the contract route has a break; the last evidence run is older than HEAD or has uncollected verdicts; `docbudget.mjs` fails. Prints the list for Zafar on refusal. | `build/tools/ops/publish.mjs` (dry run already lists problems) | M | A30, B6, B20 (checks half), C9, decision 89 | all 70, as a class ("the same old issues") |
| 3 | **Zero tolerance for non-negotiable 9 and 12 lint checks** | `text-clipped`, `ellipsis`, `word-broken`, `scroll-container`, `covered`, `canvas-text-offscreen` fail on ANY finding; the baseline (2,394 lines today) keeps only `text-small`, `tap-small` and timing noise. | `build/sandbox/lib/baseline.mjs` (a `STRICT` set) | S | F7, F8, E23, TXT-01/02/10, LAY-02/06 | CLN-148, SH-81, SH-09, CLN-141 |
| 4 | **English-for-the-child contract check (contract-16)** | Every text node on screen in the play area, cards, pop-up, guide box and pills at every sampled state is a lexicon form, a `loan: en` word, a hidden to-record tag's text, a number word or punctuation; anything else is a break. `evidence.test` already has the lexicon matcher. | `build/sandbox/lib/contract.mjs` + `lib/evidence-probe.mjs` | M | E1 (code half), G3, G22 (half), E4 (written-with-spoken), LNG-01/05/08 rows | LNG-01, LNG-04, LNG-10, LNG-11, PAN-10 |
| 5 | **Voice-source contract check (contract-17)** | On a store-path run: no `speechSynthesis` call, no `data/cook-tts.json` file, no clip not marked OK in `data/family-audio.json`; the sound log already classifies each play. On any run: a line said with no clip at all is listed as a gap, never silent. | `build/sandbox/lib/contract.mjs` using `lib/sound.mjs` | S | G14 (code half), G16, C15, C18, decision 63, 66, 70, AUD-01/02 | LNG-06, LNG-08, LNG-12 |
| 6 | **Card-row contract check (contract-18)** | A card row ticks only after the Lifecycle logs that step closed (Cook `cook-done:<kind>`, heal `step:<step>`), never on the count alone (L1 counted rows may turn gold at the count: D5); a finished item folds to one gold line; no row changes its words mid-round; at L2+ the next row appears and its tool glows after the count. | `contract.mjs` reading the contract probe's card samples + Lifecycle log | L | E11, E36, F9 (fold), decision 52, 57, R1 (guide-and-card) | SH-10, SEK-13, DAAR-19, DAAR-23, CLN-131, CLN-141 |
| 7 | **Counting-rule contract check (contract-19)** | At L1 every counted row writes its Kutchi number word and the count-along clips play as the child works; L2 the word is written, no count-along; L3+ no number written and no count-along; the order is spoken at the start and replayable at every level. SH-13's `hasWord:number` expect becomes the check over every flow. | `contract.mjs` | M | E12, decision 41, SH-13, INT-10 | DAAR-18 (hidden numbers from L3), CLN-45 |
| 8 | **One face per person (contract-20)** | In the clinic a `.face` circle is on screen only when the patient figure is not; never two faces of one person on screen; one card per person (no two cards with the same face). | `contract.mjs` | S | R4, decision 92, E21, F8 (half) | CLN-139, CLN-140, CLN-85 |
| 9 | **Shared-kit identity lint** | Static: no CSS outside `css/shared/` selects `.njg-*`, `.oc-*`, `.rs-*`, `.gb-*` (the shared components' classes); no file outside `js/shared/` defines a results, order-card, guide, bulb, onboard or request pop-up; extends the PRC-08 test. | `build/lint/css.mjs` + `build/tools/review/review.test.mjs` | S | F1, F6, F22 (code half), CMP-01/02, non-negotiable 8's check | CK-07, CLN-140 |
| 10 | **Token lint** | Static CSS: colours only from `tokens.css` (any hex or rgb outside it fails), `font-family` only Nunito, radii only 12px or 50%/9999px, one shadow value, no `linear-gradient`/`text-shadow`; sizes from tokens (no px font-size outside tokens). | `build/lint/css.mjs` | S | F2, F3, F11, F24, F23 (half), CMP-04/05/06, TXT-06 | SH-37 (design tokens only) |
| 11 | **Level-ladder data test** | For every game's level data: L1 is the smallest round (counts and items non-decreasing by level); each level adds exactly one knob (heal ladders: one new key per level); timers shrink by ~15% per level (`≤ 0.87×`, cook.json has 0.85); a timer level has a visible timer element. | `node --test` over `data/cook.json`, `data/clinic/heal/*.json` | S | E6, E7 (half), H8, H47, CLN-45's rule, decision 97 (8) | CLN-45 |
| 12 | **Steps-page and end-screen data test** | The games whose data says `order: "sequence"` are exactly ui-design-system §6a's "yes" list; the steps page shows only for them; badges come from `results.js` only (exists). | `build/test_shared_ui.mjs` | S | decision 93, F12 (half) | SH-44 (built) |
| 13 | **Banned-forms data check** | The lexicon and every data line hold none of: `nar`, `aabhar aanjo` (exists in loan-audit), `arre re`, a bare `na` as a refusal, plural `marcha` (decision 5), `lal`; settled words present (`khun`, `ba`, `hane`, `khuda-fis`, `matar`). | `build/lang/loan-audit.mjs` (rename `word-audit`) + `fill.test.mjs` | S | G5, G6 (words), G7, G24, G25, decisions 5, 61, 81, 87, LNG-06 | LNG-10 |
| 14 | **Session-scope audit** | `brief.mjs --audit <spec> <git range>`: every file the session's commits touched is in `owns`; anything else is listed as a request, and `/review` fails on it. Also refuses a spec without `stop` and a brief that names helpers. | `build/tools/ops/brief.mjs` | S | B17, B2 (after the fact), B3, B4, A24 (half) | PRC rows; the "nine sessions handed rows between them" cost |
| 15 | **Load-only-on-screen for every page** | `loadcheck.mjs` covers Cook and the clinic; add first launch, the hub and each moved mode's lab; fail on any picture outside the manifest (exists) and on any asset over its drawn size ×1.5 (D21/J11 "images at drawn size"). | `build/tools/review/loadcheck.mjs` | S | J11, decision 68 (the rest) | — |
| 16 | **Art-asset data check** | Every background in `assets/**/bg` is exactly 1600×900; every cut-out is WebP with alpha, trimmed with a 16 px pad; the states of one object (same key in `cut-data.json`) share one canvas size; no retired file is referenced by a manifest. | `build/tools/art/artcut.py --check` or a new `artcheck.mjs` | M | D15, D22, D8, D29, ART-02/08/09 | ART-20, ART-05 (half) |
| 17 | **Nothing leaves the device** | Static: no `fetch`/`XMLHttpRequest`/`navigator.sendBeacon`/`WebSocket` to an absolute URL in `js/` (SVG `xmlns` strings excluded); no third-party script tag in any page; `localStorage` only in `js/core/save.js`, `js/shared/save.js`, `js/shared/uistore.js`, `js/shared/speech.js` (today also `js/cook/core.js`, `js/monsoon/core.js`: fix or allow-list). | `build/lint/words.mjs` sibling `build/lint/privacy.mjs` | S | J1, J3, B17 (persistence half), REL-03/04 | — |
| 18 | **Reward check** | Data: no item tagged as a reward or send-off gift is in the sweets family (`mithai`, `lolly`, `biscuit`, `sweet`); the clinic's send-off item is `apple`. | `fill.test.mjs` (lexicon families) | S | I2, decision 8, CUL-02 | — |
| 19 | **Leak bots in the standard check** | `checks.mjs` runs every non-browser leak config (the 12 heal games, the clinic pipeline, the 6 parked modes) and fails on a leak; Cook's browser bot runs in `/review`. A new game without a config fails `mode.test` (every game id has a leak config). | `build/tools/review/checks.mjs`, `build/host/mode.test.mjs` | S | C10 (the "every mini-game gets a bot" half), LNG-02 | CLN-120's class |
| 20 | **Input-live contract check (contract-21)** | A tap during a line acts within 150 ms (the host logs `onActDuringSpeech`; the clinic and Cook log the tap and the state change); a line replay never blocks input. | `contract.mjs` | S | E5, INT-01 (the eye half) | — |
| 21 | **Bulb and hint test** | Unit: `Bulb.MS` is `[5000, 3000, 2000, 1000]`; a bulb press adds one to the round's hints; a closed card's peek at L3+ counts on the eye badge; no per-line translate or speaker button class exists in the shared kit. | `build/test_shared_ui.mjs` | S | E25, decisions 1, 27, 57 (half), INT-07, CMP-15 | — |
| 22 | **Doc guards** | `docbudget.mjs` (word budgets fail `/review`) and `docids.mjs` (every rule ID and decision number defined once; every citation resolves) from the structure review §4; a regression row with "pending decision" whose decision exists is flagged. | `build/tools/ops/` (new), `review.test.mjs` | S | A15, A18, A19 (the note half), decision 73, 98 (5) | PRC rows |
| 23 | **Report and push hygiene** | `unpushed.mjs` fails (not warns) at 45 min unpushed in a build session; `skeleton.mjs` refuses a report over 300 words or without the proof section; `checkin.mjs --log` already rotates. | `build/tools/ops/unpushed.mjs`, `build/tools/review/skeleton.mjs` | S | B6 (report half), B14, B15 (small commits) | — |
| 24 | **Feedback coverage gate** | `feedback.mjs` exits 1 while any transcript line is unmapped (not a point and not "chatter"), or a point has no `file:line` cause; `--rows` writes rows only then. | `build/tools/ops/feedback.mjs` | S | A5 (report half), A6, decision 78 (first half) | — |

Not coded, and left that way: A1–A4, A7, A9 (how Zafar works with Claude), C1/C3 (judgement), D-rules on prompting, G1 (Mum is the authority), I1 (faith, judged by eye), E22/E30 (tone).

### What rules.md should become

**Delete it.** Replace with `docs/archive/process/rules-redirect.md`: a table of at most 40 lines, `old ID range → where it lives now` (one line per destination, not per rule: "A1–A30 → CLAUDE.md Working agreement or ARCHIVE; B1–B21 → CLAUDE.md 14 or the tool named; C1–C23 → the checks in `docs/architecture/testing.md` §Checks; E → `ux-principles.md` §Standing rules; F → `ui-design-system.md` §Standing rules; …"), plus the sentence "IDs stay as anchors inside the destination doc's Standing rules section". Reasons: (1) decision 99 says the only written rules left are the non-negotiables; (2) every citation in regressions, reports and the skills resolves through `docids.mjs` to the new home, so the redirect is only for humans reading old reports; (3) a kept `rules.md`, however short, is where the next 90 rules would regrow (the §3 drift came from exactly this). The process rules that survive (sprints, briefs, sessions, publish order) belong in the tool that runs them (`/sprint`, `/brief`, `/publish` SKILL.md) and in `docs/architecture/testing.md`'s one tool table, not in prose.

### CLAUDE.md: what to cut or fix

1. **Non-negotiable 3** says `docs/process/regressions.md`; after the chop it is the fix list plus the archive. Reword to "the fix list" and name the file the orchestrator chooses.
2. **Non-negotiable 7** ("Done means looked at") is superseded in practice by decision 96: done means an independent judge's PASS on new evidence, red then green. Say that; "someone other than the builder" is the judge agent.
3. **Non-negotiable 14** mixes a standing limit (one build session at a time, two at most, decision 99) with tool detail (bump_version, push to main) that `publish.mjs` enforces. Keep the session count (now 1–2, not ~4) and drop the tool names.
4. **Working agreement, "Work in sprints (decision 49, /sprint)"**: add decision 99's "one to three days, one playable goal". The "at most ~4 at once" in 14 contradicts decision 99 (one, two at most).
5. **Non-negotiable 13** cites decision 77 (ChatGPT runs) which is right; drop the "No image-API art without his say-so" clause only if Zafar wants the API back (ASK: he said no on 9 Oct; leave).
6. **"Where a new fact goes"** says a yes/no goes to `docs/archive/decisions/decisions-1-to-99.md` and `rules.md` in the same commit; after the chop it is "a one-line log entry in `decisions.md`, the fact itself in its area doc or check". Fix the sentence.
7. **"Tools and skills"** lists `/handover` "every step end" and `/checkin`: fine. Add "`node build/tools/review/checks.mjs` before any report" so builders can't skip it; or better, make it the brief's hard line (CODE-TO-DO 14).
8. **"Starting a chat"** names `docs/process/rules.md` as the rulebook; remove once deleted; point to the area table instead (structure review §5).
9. Nothing in CLAUDE.md is wrong on the family or language rules. Non-negotiables 4, 5, 6, 8, 9, 10, 11, 12, 16 stand word for word.

Open questions for Zafar (the five ASK ZAFAR flags): (1) A14/H55 "go through `docs/ideas.md` before calling a mode finished": keep as a `/sprint` close step or drop? (2) H54 "the clinic finished before the doctor's ~9 Oct visit" is past: archive? (3) C10 "every mini-game gets a leak bot for level 1": extend to every level (the fever L3 leak was found at L3)? (4) B1 "at most ~4 sessions" vs decision 99's "one at a time, two at most": CLAUDE.md 14 should say two. (5) G17 "the child's model reply is Zafar (boy) / Mum (girl)" and I15 "children's voices never ship" conflict with decision 66 (Zafar and Hannah record the children's voices): which stands?

---

## Part A: every rule in docs/process/rules.md

Destination docs: `ux` = `docs/design-language/ux-principles.md` §Standing rules; `ui` = `docs/design-language/ui-design-system.md`; `tone` = `docs/design-language/tone-of-voice.md`; `bible` = `docs/design-language/art-bible.md`; `pipe` = `docs/design-language/art-pipeline.md`; `audio` = `docs/design-language/audio.md`; `lex` = `docs/language/lexicon.md`; `eng` = `docs/language/engine-spec.md`; `cast` = `docs/game-design/cast.md`; `arcs` = `docs/game-design/story-and-arcs.md`; `prog` = `docs/game-design/progression-and-scoring.md`; `speak` = `docs/game-design/speaking.md`; `tech` = `docs/architecture/technical-plan.md`; `testing` = `docs/architecture/testing.md`; `qa` = `docs/process/qa-checklist.md`; `method` = `docs/process/mode-design-method.md`; `evloop` = `docs/architecture/evidence-loop.md`; `skill:x` = `.claude/skills/x/SKILL.md`.

### The non-negotiables table (rules.md lines 21–34)

| ID | pile | destination or check | note |
|---|---|---|---|
| NN table | ARCHIVE | — | a cross-reference; the redirect table replaces it |

### §1 Working with Zafar

| ID | pile | destination or check | note |
|---|---|---|---|
| A1 | CLAUDE | ALREADY IN CLAUDE.md (Working agreement 1, NN1) | "queue it" detail goes |
| A2 | CLAUDE | CLAUDE.md Working agreement | add one clause: "never launch while a question to him is open; an agreed overnight run goes ahead" |
| A7 | CLAUDE | ALREADY IN CLAUDE.md ("When he says more is coming, collect and list") | |
| A9 | CLAUDE | ALREADY IN CLAUDE.md ("Improve on his ideas") | |
| A3 | CLAUDE | ALREADY IN CLAUDE.md ("numbered list … yes to all except") | "write his answers into the doc" → the decisions log line |
| A4 | CLAUDE | ALREADY IN CLAUDE.md (NN2) | |
| A5 | CLAUDE + CODE-TO-DO 24 | ALREADY IN CLAUDE.md (NN2); the report half → `feedback.mjs` | the "report opens with every mechanic changed" line is the tool's skeleton |
| A8 | CLAUDE | ALREADY IN CLAUDE.md (NN3) | |
| A16 | DOC | `method` §4.2 "Non-negotiable design rules": add "apply one game's lessons to its siblings before he plays" | not there; one line |
| A14 | ASK ZAFAR | `skill:sprint` close step, or drop | "go through ideas.md before calling a mode finished": keep? `ideas.md` already says "marked done, never deleted" |
| A22 | DOC | `method` §4 (process: design, then self-check loops): ALREADY THERE in substance ("audit → draft → approve → build" is the method's shape); the exact order sentence is new | one line |
| A6 | CODE-TO-DO 24 | `feedback.mjs` coverage gate | the skill says "0 unmapped"; the tool should refuse |
| D10 (in A5 bullet) | DOC | `pipe` §Standing rules: "say so when approved art is reused" | ALREADY THERE as D23 wording in the art audit (`/art-run` step 1); keep one copy |
| A10 | CLAUDE | ALREADY IN CLAUDE.md ("Hand him exactly what to do, ready to paste") | `labs.html` link detail → `skill:publish` step 5 (ALREADY THERE) |
| A26, A27 | CLAUDE | ALREADY IN CLAUDE.md ("Short, plain replies; don't assume he remembers IDs") | |
| A11 | CLAUDE | ALREADY IN CLAUDE.md (NN15 + "cost estimate with every launch") | model table is `briefpack.mjs` (CODE-HAS: `build/tools/ops/briefpack.test.mjs` "the default model table") |
| A12 | CLAUDE | ALREADY IN CLAUDE.md (NN15) | "when short on tokens, cheapest model" → one clause in Working agreement if wanted; else ARCHIVE |
| A15 | CODE-TO-DO 22 + DOC | `docbudget.mjs` (status ≤1,500 words, Next chat ≤600); the "structured by story arc, artwork as its own section" layout → ARCHIVE (status.md no longer has it) | |
| decision 16 bullet | CODE-HAS + CLAUDE | `statuscounts.mjs --write` (the table), `skill:checkin` step 5 (one line to Zafar), `skill:feedback` step 7 (a row the same day) | the orchestrator-owns-the-list sentence is NN3's "every past feedback item is on the list" |
| A19 (decision 73, 76) | CODE-HAS + CODE-TO-DO 1 | `lib/evidence.mjs applyVerdicts` (built only with a PASS + evidence path; FAIL reopens); the "pending decision note removed" half → CODE-TO-DO 22 | the "judged by Fable not the builder" clause is `evidence.mjs --collect` refusing the builder's judge line |
| A18 | CODE-TO-DO 22 | `docids.mjs` (every rule once) | "check old handovers before archiving" → ARCHIVE (one-off) |
| A20, A23 | CLAUDE | CLAUDE.md Working agreement: ALREADY THERE in substance (orchestrator plans; sessions get complete briefs); "agent reports under ~250 words" → `skill:brief` (ALREADY THERE: reports ≤300 words, B6) | |
| A21 | ARCHIVE | — | one-off from the overnight-log era; the rule "a yes/no → the log" is CLAUDE.md "Where a new fact goes" |
| A28 | CLAUDE | ALREADY IN CLAUDE.md ("Starting a chat or session") | update the file list after the chop (Part C) |
| A25 (decision 14) | CLAUDE | ALREADY IN CLAUDE.md ("Hand over at each step boundary or around 70% context") + `skill:handover` | |
| A17 | DOC | `skill:checkin` "When a session has ended" + `skill:handover` step 4 (morning report): ALREADY THERE | |

### §2 Sessions, agents and git

| ID | pile | destination or check | note |
|---|---|---|---|
| A13, B1 | CLAUDE | CLAUDE.md NN14: change "~4 at once" to "one at a time, two at most" (decision 99) | ASK ZAFAR 4 confirms |
| B2 | CODE-HAS + CODE-TO-DO 14 | `brief.mjs` live-overlap check (`briefpack.test` "two live briefs that own one path are an overlap"); after-the-fact audit → 14 | |
| B3 | CLAUDE | ALREADY IN CLAUDE.md (NN14 "no helper sessions") | the brief line is written by `brief.mjs` (CODE-HAS) |
| B17 | CODE-TO-DO 14 + 17 | session-scope audit (files); privacy lint (persistence only via save API) | "missing shared pieces become marked stubs with the same API" → `docs/architecture/building-games.md` (DOC; check: not there, one line) |
| B5, B10 | DOC | `skill:brief` step 5: ALREADY THERE (`create_session`, `outcome_branch`) | |
| B13 | DOC | `skill:checkin` steps 3 and 5: ALREADY THERE | |
| B12 | DOC | `skill:checkin` step 2: ALREADY THERE | |
| B11 | DOC | `skill:checkin` "When a session has ended": add "after a usage limit or restart, relaunch stopped sessions as continuations without re-asking" | not there |
| B18 | ARCHIVE | — | restatement of ordinary git practice; the integration branch is in the brief |
| B21 (decision 46) | CLAUDE | ALREADY IN CLAUDE.md ("Tools and skills: use them by default") | |
| A29 (decision 49) | CLAUDE | ALREADY IN CLAUDE.md (Working agreement "Work in sprints") + `skill:sprint` | add decision 99's "one to three days, one playable goal" |
| A30 (decision 89) | CODE-TO-DO 2 | publish gate | |
| A24, B4 | CODE-HAS | `brief.mjs` (required fields incl. `stop`, `owns`; the no-helpers, don't-remove-mechanics and read-first lines are generated) | `session-brief-template.md` stays as the tool's template |
| B20 (decisions 33, 34, 37) | DOC + CODE-HAS | release cycle → `tech` §Release path (not there as the cycle: add three lines); "full checks cover only what changed" = `touched.mjs` + `gatecache.mjs` (CODE-HAS); "the girl's art is enough for the clinic" (decision 37) → ARCHIVE (sprint-only, done) | "Zafar plays only what is live on main" → CLAUDE.md Working agreement ("then Zafar plays": ALREADY THERE) |
| B6 | CODE-HAS + CODE-TO-DO 23 | `checkin.mjs --log`, `skeleton.mjs` (report), `publish.mjs` (bump, one push); report length → 23 | "QA checklist results" → the evidence loop replaced it; ARCHIVE that clause |
| B14 | CODE-HAS | `unpushed.mjs` hook (warn at 30 min), `checkin.mjs --log` rotation | make it fail: CODE-TO-DO 23 |
| B7 | CODE-HAS | `build/check_stamps.mjs`, `bump.test.mjs`, `bump_r6.test.mjs`, `publish.mjs` (refuses on main; runs the bump), `checks.mjs bump` | |
| B8, B9 | CODE-HAS | `publish.mjs` (bump → commit → push branch + HEAD:main → wait for Pages); merge-on-race and `?v=` conflicts → `skill:publish` step 2 (ALREADY THERE) | |
| B15 | DOC | `skill:brief` / system reminder: ALREADY THERE (attribution lines come from the harness); "never force-push" → `skill:publish` "Never" (ALREADY THERE) | "big audio files as a GitHub release" → `audio` (not there: one line) |
| "J11" in B15 bullet | ARCHIVE | — | a mislabel: J11 is modular loading; the release-upload clause is the `audio` line above |
| B19 (decision 20) | CODE-HAS | `.gitignore` (`build/screenshots/*`, `build/reports/**/*.png`), `shotdiff.mjs` (manifests of hashes) | |
| B16 | DOC | `testing` §The rule on browser tests: ALREADY THERE word for word | every browser tool's `--help` repeats the lock line |

### §3 Quality and review

| ID | pile | destination or check | note |
|---|---|---|---|
| C1 | CLAUDE | CLAUDE.md NN7, reworded to decision 96 (Part C) | "played every station through" = `run.mjs` every flow reaches its end (CODE-HAS, INT-11) |
| C5, C14 | DOC | `qa` "How to run a review" step 6: ALREADY THERE | |
| C19 (decision 75) | CODE-HAS | `build/sandbox/lib/contract.mjs` (15 checks), `review.test` "PRC-08 no per-game copy of the shared lifecycle", "every contract row is covered" | the design sentence ("the shared host runs every game's lifecycle") → `docs/architecture/shared-api.md` (ALREADY THERE: Lifecycle) |
| C21 (decision 78) | CODE-HAS + CODE-TO-DO 24 | `sprintcheck.mjs`, `evidence.mjs --judge/--collect/--apply`; the `/feedback` second-reader and coverage → 24 | |
| C22 (decision 86) | CODE-TO-DO 1 | red-then-green gate | `brief.mjs` already writes the probe line |
| C23 (decision 96) | CODE-HAS (judge refusal, panel citation) + CODE-TO-DO 1 (red first, two strikes) | `evidence.mjs --collect` refuses the builder's verdicts and a PASS without a panel; the rest → 1 | "one claim per row" stays a `/feedback` instruction (ALREADY THERE in decision 96's row; add to `skill:feedback` step 3) |
| C20 (decision 76) | CODE-HAS + CODE-TO-DO 2 | `CONTRACT_ROUTE` in `contract.mjs` is "what Zafar plays"; `sprintcheck.mjs` audits rows; the "list of what's still wrong before he plays" = publish gate's refusal list | |
| C9 | CODE-HAS | `publish.mjs` waits for the Pages deployment and screenshots the live page; `skill:publish` step 5 | |
| C4, C17 | CODE-HAS | `evidence.mjs --collect` (builder refused as judge); `.claude/agents/judge.md` (structure review) | "Fable for docs and designs" → CLAUDE.md NN15 (ALREADY THERE) |
| C3 | DOC | `qa` step 4 and `.claude/agents/judge.md` step 3: ALREADY THERE ("flaws first, zoom ×2") | |
| C2, C11, C16, decision 15, decision 24 | CODE-HAS | `build/sandbox/lib/env.mjs ALL_SIZES` (the eight sizes), `run.mjs --gate`, the rotate-card flow; `qa` step 3 lists them (DOC: ALREADY THERE) | |
| C8 (decisions 48, 50) | CLAUDE | ALREADY IN CLAUDE.md (NN14, the 15-minute limit) + `qa` step 1 | |
| C6 | CLAUDE + CODE-HAS | ALREADY IN CLAUDE.md (NN3); `regress.mjs`, `touched.mjs`, `skill:review` step 2 | |
| C10 | CLAUDE + CODE-HAS + CODE-TO-DO 19 | ALREADY IN CLAUDE.md (NN6); `leak.mjs` + 20 configs; put them in `checks.mjs` → 19 | ASK ZAFAR 3: every level, not only L1 |
| C12, C13 | CODE-HAS | `build/check_onboard.mjs` (help in every phase, no English, no device voice); take-back → `host.test` E14, `input.test`; shared card and buttons → CODE-TO-DO 9; clears its own UI → contract-13 + `host.test` E17 | |
| C7 | CODE-HAS | `build/check_vessel_meta.py`; the layout lint `covered` (nothing covers an item before a tap) | |
| C15, C18 | CODE-HAS + CODE-TO-DO 5 | `build/sandbox/lib/sound.mjs` gap list; `words.mjs` searches the lexicon before calling a word English (and loan words: `evidence.test` S05-T) → 5 makes it fail | |

### §4 Game design: every mode

| ID | pile | destination or check | note |
|---|---|---|---|
| H1, H7 | DOC + CODE-HAS | `method` §1 (pipeline of stages: ALREADY THERE) and §4.2 rule 7 (levels as data, lab and free play: ALREADY THERE); every mode has a lab = `labs.test`, `mode.test` (CODE-HAS) | |
| H3 | DOC | `method` §1 / `skill:game-mode-design` §1 "Start from the syllabus": ALREADY THERE | |
| H2 | DOC | `method` §2 / `skill:game-mode-design` §3: ALREADY THERE | |
| E8, H48 | DOC | `ux` §6 "Cut what isn't the lesson": ALREADY THERE | |
| H6 | DOC | `prog` Part 3 "Upgrades only ever automate physical steps, never the listening": ALREADY THERE | |
| H9 | DOC | `arcs` Arc 1 ("every errand has a different main action"): ALREADY THERE | |
| E30 | DOC | `tone` §The rules: ALREADY THERE (E30 row) | NN12 holds the heart of it |
| E29 | DOC | `tone` §The rules: ALREADY THERE (E29 row); "never lose what you earned" = `core.test` wallet "coins only go up except when buying" (CODE-HAS) | |
| E31 | DOC | `ux` §15 ("the skip in ?" via onboard.js): ALREADY THERE in substance; add "never a visible button" to §8 | one clause |
| E1 | CLAUDE + CODE-HAS + CODE-TO-DO 4 | ALREADY IN CLAUDE.md (NN5); `check_onboard.mjs` (help), `words.mjs` B (report-only); the screen check → 4 | |
| E2, E9 | CODE-HAS | `check_onboard.mjs` (every step a ghost-finger demo, every gesture shown), `onboard.test`; UI fades in only when first needed → `ux` §8 (DOC: ALREADY THERE) | |
| E3, E4 | CODE-TO-DO 4 | the English-for-the-child check includes "every spoken line is also written" (a `dom:` capture of the read-along element at every `voice` line) | design text: `ux` §1 (ALREADY THERE) |
| E27 | DOC | `tone` §The rules (E27 row) and `ux` §13: ALREADY THERE | |
| E5 | CODE-HAS + CODE-TO-DO 20 | `host.test` "E5 through the host", `input.test` "E5: input is live"; the on-screen check → 20 | "a tap pauses the line, the count plays, the line carries on" → `ui` §4 (DOC: not there; one line) |
| E37 (decision 53) | CODE-HAS | contract-1 popup (with decision 80's howto/passme exceptions) | design detail (fold to sidebar, each instruction just before its game) → `guide-and-card.md` R1–R3: ALREADY THERE |
| F26 (decision 55) guide box | DOC | `guide-and-card.md` R2: ALREADY THERE | the bubble half is contract-4 |
| R4 (decision 92) | CODE-TO-DO 8 | one-face contract check | design text `guide-and-card.md` R4: ALREADY THERE; clinic detail → `clinic.md` (decision 92 row) |
| E25 (decision 1) | CODE-TO-DO 21 | bulb and hint test | design text `ux` §4: ALREADY THERE (5/3/2/1, costs a bulb) |
| E25 / F9 / decision 27 (bulb vs eye) | CODE-TO-DO 21 + DOC | the eye-badge count → 21; wording → `ux` §4: add one line ("the bulb is for language, the eye for reading") | |
| E16, E28 | DOC | `ux` §4: add "a glow only after a wrong tap or ~5 s hesitation, never at the top level"; `prog` Part 1 mentions hesitation | the hint delay by stage is `core.test` "support() reproduces Cook's hint delays" (CODE-HAS for the numbers) |
| E25 + decision 57 (bulb translates the guide line; full order with numbers; closed card's eye = small bulb) | CODE-HAS (closed card: contract-9 clinic) + DOC | `ui` §12: add the three clauses (not there) | SH-16's row covers the small bulb |
| F9 / H22 / H34 (closed cards from L3) | CODE-HAS (clinic: contract-9) + CODE-TO-DO (extend contract-9 to Cook, S; fold into CODE-TO-DO 6) | | `ui` §12: ALREADY THERE in substance ("§12 applies to every mode"; the L3 line is in cook.md H18 "numbers hidden from level 3") |
| E6 | CODE-TO-DO 11 | level-ladder data test | `ux` §7: ALREADY THERE |
| E7 | DOC | `ux` §5: ALREADY THERE | |
| E13 | CODE-HAS | `input.test` "E13: a gesture the game didn't declare is refused" | `ux` §12: ALREADY THERE |
| H8, H47 | CODE-TO-DO 11 | timers data test | `qa` INT-08 covers by eye today |
| G23 | CODE-HAS | `core.test` "progress: G23 up on recall only, down after two misses" | `tech` §Data model: ALREADY THERE |
| E12 (decision 41) | CODE-TO-DO 7 | counting-rule contract check | text → `ui` §12 point 2 (ALREADY THERE in substance: no pips, number word) + `clinic.md` rules ("the Cook counting rule": ALREADY THERE) |
| E11 (decision 57 "a number is written the first times it is heard") | CODE-TO-DO 6 | card-row contract check | `ux` §11 and `ui` §12: ALREADY THERE (rows tick when the step closes) |
| E36 (decision 52) | CODE-HAS (contract-2 moves-on) + CODE-TO-DO 6 (next row appears, tool glows) | | |
| E14, E15 | CODE-HAS | `host.test` "E14: take it back until Done", `input.test` E14; dashed outline and "impossible undo shows in the art" → `ux` §17: ALREADY THERE | |
| E35 (decision 51) | DOC | `ux`: add §18 "A wrong item is redone on the spot" (not there; the clinic rows CLN-26/CLN-107 cite it) | a contract check later if a row reopens |
| F27 (decision 56) | DOC | `bible` §Visual QA / `pipe` §10 row 2 ("standing on a lip, edge"): ALREADY THERE in substance; add "things inside a container sit on its flat inner area" to `ui` §7 | |
| E17, E18, E19 | CODE-HAS | contract-13 stale-ui, `host.test` "E17"; "pills never overlap" = layout lint `covered` | the knee done-flash exception → `clinic.md` H-knee (DOC; not there, one clause) |
| E34 | DOC | `ui` §6 Feedback: add "clear feedback while an action is under way (the stir dial's zones)" | not there |
| E23, E24 | CODE-HAS | layout lint `covered`, `covers-play-area`; `method` §4.2 rule 4 (ALREADY THERE) | |
| E33 | DOC | `qa` INT-09 (ALREADY THERE, eye); `ux`: add one line | |
| E22 | DOC | `ux` §16 ("a swap between two drawn poses, not an animation: the no-cheap-animations rule"): ALREADY THERE | |
| E10 (decisions 51, 59) | DOC | `ux` §11 and §14: ALREADY THERE (the conversation exception); add the eye/ear-test exception (decision 59) to `clinic.md` H-eye (not there) | the no-red-mid-round half is a possible contract check (red `#C0443C` only on the end screen): fold into CODE-TO-DO 10's token lint |
| E38 (decision 54) | DOC | `guide-and-card.md` Cook table ("call-back"): ALREADY THERE | engine data holds the line |
| H5, J7 (decisions 1–2) | CODE-HAS | `core.test` "score: the three badges … no stars", "finish() … no stars"; `test_shared_ui.mjs` badge tiers | `ux` §9: ALREADY THERE; "remove the legacy star code" → ARCHIVE (done: `js/shared/stars.js` is the test-only shim; verify in the chop) |
| F13 (decision 3) | CODE-HAS | `test_shared_ui.mjs` (badge tiers); `ux` §9a: ALREADY THERE | |
| decisions 2, 10 (pocket money model) | CODE-HAS | `core.test` "wallet: pay = volume x quality x difficulty"; `economy-sim.mjs` (prints, no threshold) | `prog` "Pocket money": ALREADY THERE |
| decision 10 (prices pace) | CODE-TO-DO | `economy-sim.mjs --check`: fail when the median games-per-upgrade falls outside 2–3 early and 4–5 later (S) | `prog`: ALREADY THERE |
| H4 | DOC | `speak` "Every point where it works": ALREADY THERE | |
| E32 (two-person exchange) | DOC | `speak` "The rule": ALREADY THERE; `tone` quotes it | |
| E32 (the ramp) | DOC | `speak` "Say it after: how the help fades": ALREADY THERE in substance; "never block on recognition" ALREADY THERE in `conversations.md` 10a (13) | |

### §5 Modes, story and progression

| ID | pile | destination or check | note |
|---|---|---|---|
| H10–H24, H49–H52 pointer | ARCHIVE | — | `cook.md` §Standing rules holds them (ALREADY THERE) |
| H25–H35 pointer | ARCHIVE | — | `clinic.md` §Standing rules holds them (ALREADY THERE) |
| H44 | DOC | `conversations.md` 10a (9) frequency, §3 ladder: ALREADY THERE; "get it right to move on" 10a (13): ALREADY THERE | |
| E26 | DOC | `ux` §14 and `conversations.md` 10a (13): ALREADY THERE | |
| H42, H43 | DOC | `first-launch.md` "Zafar's flow": ALREADY THERE (hooked to the Birthday is flagged there as the known follow-up); "chai gets a fun pass first" → `cook.md` §8 (ALREADY THERE as CHAI-01's design) | |
| H36 | CODE-HAS + DOC | `check_arcs.test` "the Birthday skeleton is rule H36 in order"; `arcs` Arc 1: ALREADY THERE | |
| H37, H38 | DOC | `arcs` "Arc 2 onward": ALREADY THERE | |
| H39 (decision 4) | DOC | `arcs` "Standalone, repeatable arcs": ALREADY THERE | |
| H40 | DOC | `arcs` "Every arc's last beat is the Story by the Fire": ALREADY THERE | |
| I14 (decision 4) | CODE-HAS + DOC | `unlocks.test` story log / shelf; `prog` "The bookshelf": ALREADY THERE | |
| I13 | DOC | `arcs` "How the story is told" (three channels): ALREADY THERE in substance; add "never text the child must read" | |
| H41 (decision 39) | DOC | `modes/README.md` ("the order of work is rule H41") cites it but doesn't state it: write the order there, one line | the end point (store launch with Arcs 1–5) is in `tech` §Release path (ALREADY THERE) |
| H54 (decision 19) | ASK ZAFAR 2 → ARCHIVE | — | past date; sprint-only (S01 small decision 19) |
| H45, H46 | DOC | `modes/README.md` (parked modes move onto the core, decision 38; the pill organiser stays out): ALREADY THERE; the dropped ideas list (fry "take them out?", *munje same we*, tooth bug) → `docs/ideas.md` as "dropped" rows (not there) | |
| H55 | ARCHIVE | — | a pointer to `ideas.md`, which carries the rows |
| H56, H57 (decision 22) | CODE-HAS + DOC | `mode.test` "resolveEntry: free play says which story opens it", `unlocks.test` "the map lists every place"; `prog` "Replay"/`building-games.md`: ALREADY THERE; role reversal = `ideas.md` #36 (ALREADY THERE) | |

### §6 UI and visual design

| ID | pile | destination or check | note |
|---|---|---|---|
| F26 (bubbles; decisions 55, 97) | CODE-HAS | contract-4 bubble (tail at the head) | `guide-and-card.md` R3: ALREADY THERE; add "tail ends at the mouth" (decision 97 (7)) |
| F2 | CODE-HAS (48 px: layout lint `tap-small`, `input.test` hit areas, `check_hotspots.py`; 14 px: `text-small`; 8-pt grid: `css.mjs`) + CODE-TO-DO 10 (colours, font, radii, shadow) | | `ui` §2: ALREADY THERE |
| F3, F23 | CODE-TO-DO 10 (gradients, 3D text) | | `ui` §2 and `ux` §3 (no step counters): ALREADY THERE |
| F4, F5 | DOC | `ui` §3: ALREADY THERE (22% / 78%, buttons right) | a layout-lint measure is cheap but no row asks for it |
| F18 | CODE-HAS | layout lint `page-scroll`; `frame.js`/`stage.js` fit; `tech` §Screens: ALREADY THERE (no letterbox) | |
| F18 scale (decision 24) | DOC | `tech` §Screens "Built to scale": ALREADY THERE | |
| F19, F21 | DOC | `qa` LAY-08, TXT-09 (eye): ALREADY THERE; `bible` §3 island framing covers "hidden by the scene" | |
| F1 | CLAUDE + CODE-TO-DO 9 | ALREADY IN CLAUDE.md (NN8); shared-kit lint | `ux` §15: ALREADY THERE |
| F6, F22 | CODE-HAS (contract-12 greyed) + CODE-TO-DO 9 (one Done, one Next) | | `ux` §15: ALREADY THERE |
| F11, F24 | CODE-TO-DO 10 | token lint (sage, cream) | `ui` §3 and Additions §3: ALREADY THERE |
| E21, F8 | CODE-HAS (layout lint `scroll-container`) + CODE-TO-DO 8 (one card per person) | | `ui` §3, `ux` §16 "No script cards": ALREADY THERE |
| F9, F10 (order model) | CODE-HAS | `engine.test` "card rows come from the same source as the sentence (F10): lower case, no full stop"; `test_shared_order_card.mjs` | `ui` §12: ALREADY THERE |
| F9 (don't rows, fold, one highlight; decision 95) | CODE-HAS (contract-8 highlight, one colour) + CODE-TO-DO 6 (fold to gold line) | | `ui` §12: ALREADY THERE (decision 95 note); `qa` CMP-09 still says "next in grey": fix |
| E4 (request card appears, read aloud, shrinks; read-along) | CODE-HAS (contract-1) + CODE-TO-DO 4 (read-along written) | | `ux` §1: ALREADY THERE |
| F25 | DOC | `ux` §11 and `ui` §12: ALREADY THERE | |
| F7 | CLAUDE + CODE-HAS + CODE-TO-DO 3 | ALREADY IN CLAUDE.md (NN9); layout lint `text-clipped`, `ellipsis`, `word-broken`, contract-15; zero tolerance → 3 | "guide box 2 lines, card rows 1" → `ui` §2 (ALREADY THERE: "one line per pill; Nani may use 2") |
| F15 | DOC | `ui` §4 (identical slots, grouped by kind, tap object/chip): ALREADY THERE; "true relative heights" → `qa` LAY-07 (ALREADY THERE) | |
| F16 | CODE-HAS (grid: `css.mjs`) + DOC | `qa` LAY-07 (ALREADY THERE) | |
| F17 | DOC | `ui` §3 "The focal rule": ALREADY THERE; add "a centred glow, never an off-centre ring" | one clause |
| E20, F26 (stage it like a play) | CODE-HAS (contract-10, clinic) + DOC | `ux` §16: ALREADY THERE; Cook poses wait on art (contract-10's note) | |
| F12 (decision 93) | CODE-HAS (contract-5 order) + CODE-TO-DO 12 | | `ux` §9/§9a + `ui` §6a: ALREADY THERE |
| F13 (decision 3) | CODE-HAS | `test_shared_ui.mjs`; `ux` §9a: ALREADY THERE | |
| F14 | DOC | `ux` §9a and `ui` Additions §6: ALREADY THERE | red only here → token lint (CODE-TO-DO 10) |
| decision 93 steps page | CODE-TO-DO 12 | | `ui` §6a: ALREADY THERE |
| F20 | DOC | `cook.md` §Standing rules / review face (CK-07's words): ALREADY THERE in substance; add one line to `ui` §6 | CK-07 is reopened: the row carries it |

### §7 Art and assets

| ID | pile | destination or check | note |
|---|---|---|---|
| D1, D2 (decision 77) | CLAUDE + DOC | ALREADY IN CLAUDE.md (NN13); `pipe` §Grounds says ChatGPT via Chrome (ALREADY THERE; its "paid API under $2" aside contradicts decision 77: delete); "characters at the same scale in every shared scene" → `bible` §4 Scale (add one line) | |
| D3 (decision 29) | DOC | `pipe` §15.2–15.3 (block generated, runner loop, workspace fetch and upload): ALREADY THERE | the Chrome mechanics (raw.githubusercontent, no downloads/clipboard) are in `templates/runner-loop.txt` |
| D24, D26 | DOC | `pipe` §15.3 runner knobs: ALREADY THERE in substance (3 windows, 60 s); "changes no settings, signs nothing in or out, uploads only listed files" → add to the runner template header | |
| D25 | CODE-HAS | `build/tools/art/artjudge.py` (PASS/FLAG/FAIL); `skill:art-run` "When images land" 1–2 | |
| D28, D29 | CODE-HAS (retired list: `build/sandbox/lib/retired.mjs`, contract-6) + DOC | `skill:art-run` step 3 (cut and prove); "named, moved, processed with a report" → `pipe` §4 naming (ALREADY THERE) | |
| D4 | DOC | `skill:art-run` "Before the run" 1: ALREADY THERE | |
| D5 | DOC | `pipe` §14 Background art brief + `qa` ART-09 (overlay the real characters): ALREADY THERE | |
| D6 | DOC | `clinic.md` "Prototype first" and `method`: ALREADY THERE | |
| D10, D23 | DOC | `skill:art-run` step 1 ("audit what's needed"): add "only art the game will use; reuse approved art and say so" | one line |
| D17, D31 | DOC | `ux` §16 (two poses): ALREADY THERE; evening/night versions → `bible` §Light (grep: `pipe` mentions; add one line to the bible) | |
| D13, D16 | DOC | `bible` §1 Do/Don't (no outlines, no text, contact shadows): ALREADY THERE | `qa` ART-01/06 |
| D14 | DOC | `bible` §3 Cameras: ALREADY THERE | |
| D15, D20, D30 | CODE-HAS (contract-11: in proportion, sharp) + CODE-TO-DO 16 (1600×900 exact) + DOC | `pipe` §Export (1600×900): ALREADY THERE; "calm and lighter than tappable items, reds kept for Nani" → `bible` §2 Palette (not there; add) | |
| D21 | DOC | `bible` §4 + `pipe` §10 row 3 (sizes never invert, ≤1.5×, ~90 px): ALREADY THERE | |
| D19 | DOC | `bible` §1 and §Set dressing: ALREADY THERE | |
| D7, D22 | CODE-TO-DO 16 (pad, WebP) + DOC | `pipe` §Export and §Grounds: ALREADY THERE | |
| D8, D9 | CODE-HAS (`bg_align_check.py`) + CODE-TO-DO 16 (one canvas per object) + DOC | `bible` §6 "Expressions pipeline: in-place edits" and `pipe` §15.1 `registered`: ALREADY THERE | |
| D11 | DOC | `bible` §3 ("pre-rendered pot contents, cross-faded"): ALREADY THERE; `qa` ART-12 | CK-06 waits on art |
| D12 (decisions 9, 29) | DOC | `bible` §6 "Character-sheet first" + `cast.md` "Real-life likenesses … character sheet first": ALREADY THERE; "Zafar approves only real-people sheets; the rest judged pass/fail by Claude" → `skill:art-run` (add one line; `pipe` §Grounds half-says it) | |
| D12 photos/consent | DOC | `cast.md` header ("agreed with the family"): ALREADY THERE | |
| D18 | DOC | `bible` §6 Character-sheet contents (expressions list, head and shoulders): ALREADY THERE in substance; "same eye line and size for everyone, three expressions for faces" → `pipe` §15.1 `faces` (add one line) | |

### §8 Language, Kutchi and voice

| ID | pile | destination or check | note |
|---|---|---|---|
| G1, G21 | CLAUDE + CODE-HAS | ALREADY IN CLAUDE.md (NN4); `fill.test` "a word only seen in the class handout is a draft, never confirmed", `engine.test` data check rejects unsourced entries; `lex` §4 (handouts): ALREADY THERE | |
| G2, G3 (decision 84) | CODE-HAS (data: `engine.test` "rejects an English-only word not flagged to-record"; `draft: true` in the schema) + CODE-TO-DO 4 (never English inside item pills) | | `lex` header (status words) and `eng` §Data schema: ALREADY THERE; the grey-italic rule is in CLAUDE.md NN4 |
| G2 (decision 21 he-form) | CODE-HAS | `engine.test` "a noun of unknown gender takes the he-form, flagged 'to check', tops Mum's list"; `fill.test` decision 21 | `grammar-kb.md`, `eng`: ALREADY THERE; "never ships in the store app" = `core.test` "store path plays only OK clips" (the clip half) |
| G4 | DOC + CODE-HAS (words.mjs C variants, `fill.test` "red is laal") | `grammar-notes.md` (W not V): ALREADY THERE; "long vowels doubled where heard long" → `grammar-notes.md` spelling section (add) | |
| G5 | CODE-TO-DO 13 | banned-forms check | `grammar-kb.md` (never *nar*), `lex`: ALREADY THERE for most; the engine data is the home (G27) |
| G6 | DOC + CODE-TO-DO 13 | `tone` §The rules (G6) and `conversations.md` 10a (1–3): ALREADY THERE | |
| G15, G22 (decision 58 greetings by watching) | DOC | `conversations.md` 10a and `first-launch.md` "English, then Kutchi": ALREADY THERE in substance; gesture-on-greeting detail → `conversations.md` §6.3 (add one line) | |
| decision 61 (matar, arre re out) | CODE-HAS (lexicon data) + CODE-TO-DO 13 | `guide-and-card.md` R6 ("arre re goes"): ALREADY THERE | `cast.md` still says the parrot repeats "Arre re!": fix |
| G7, G8 | DOC | `tone` §The rules: ALREADY THERE; the frames are engine data | |
| G19, G20 | DOC | `clinic.md` ("Level 3 adds sides (the patient's own left/right)") and `guide-and-card.md` clinic table ("bring me"): ALREADY THERE | |
| G24, G25 (decision 5) | CODE-HAS (lexicon data; `fill.test` "every entry cites a source") + CODE-TO-DO 13 (no plural *marcha*) | `lex` §Noun forms notes decision 5: ALREADY THERE | |
| G9 | CLAUDE + CODE-HAS | ALREADY IN CLAUDE.md (NN11); `engine.test` golden sentences, `lang.test` "every Cook line comes out of the adapter word for word", `words.mjs` A (literals), `voice-parity.test` | |
| G10 (decision 17) | DOC | `eng` §Zafar's requirements and `engine-design.md`: ALREADY THERE; `engine.test` "no Kutchi in the engine's code" (CODE-HAS for the "general engine" half) | |
| G11 | DOC + CODE-HAS | `fill-the-engine.md` (Mum's example sentences) and `eng` requirements: ALREADY THERE; `gap-report.mjs`, `mumsheet.mjs` output the record list | |
| G12 (decision 26) | CODE-HAS | `core.test` "voice (R6, decision 26): stitched speech", `voice-parity.test` "phrases off", `engine.test` "whole-phrase clips are off until the pre-publish pass" | `tech` §Data model: ALREADY THERE; "recordings never change the engine" `eng`: ALREADY THERE |
| G13, G18 | CODE-HAS | `build/check_clinic_kutchi.mjs`, `words.mjs` A gate, `engine.test` "no Kutchi in the engine's code", `fill.test` "no Kutchi in the importers"; schema: nouns carry gender/plural | `tech` §Data model: ALREADY THERE |
| G26 (decision 36) | CODE-HAS | `words.mjs` A (strict gate on `words-gate.json` "enforce" folders; "ready" folders report-only: make them enforce → fold into CODE-TO-DO 4) | `tech` §Architecture: ALREADY THERE |
| G27 (decision 40) | DOC + CODE-HAS | `eng` §Where each kind of knowledge goes (G27): ALREADY THERE; `fill.test` "the importers are re-runnable: the committed files equal a fresh build" | |
| decision 69 (blind check) | DOC + CODE-TO-DO 5 | `audio`: add "no clip is offered or shipped without a blind check; the orchestrator audits a sample" (not there); `/mum-round` step 6 says clips wait for Zafar's ear | the store-path check (5) holds the "only OK clips" half |
| G14, G17 (decision 66) | CLAUDE + CODE-HAS + CODE-TO-DO 5 | ALREADY IN CLAUDE.md (NN10); `core.test` "TTS and the device voice only on the test path"; the cast list → `audio` (add; `cast.md` has the doctor) | ASK ZAFAR 5 (children's voices vs I15) |
| G16 | CODE-HAS (`core.test` store path OK clips) + DOC | `tech` §Pipelines Audio: ALREADY THERE (long takes, OK/?? in `lab/family-audio.html`) | |
| I15 | DOC | `audio` header lists I15 by ID only: write the two sentences there; `audio` "A line to hold" has the on-device half | ASK ZAFAR 5 |
| G15 (decision 12) | CLAUDE | ALREADY IN CLAUDE.md (NN5) | `tone` G15 row: ALREADY THERE |
| G22 | CODE-TO-DO 4 (half) + DOC | `method` §4.2 rule 3 ("a word shows as text in only one place at a time"): ALREADY THERE | |

### §9 Characters, family and culture

| ID | pile | destination or check | note |
|---|---|---|---|
| I1 | CLAUDE | ALREADY IN CLAUDE.md (NN16) | `bible` §1 (modern, Kutch and East Africa) and `qa` CUL-01: ALREADY THERE |
| I2 (decision 8) | CLAUDE + CODE-TO-DO 18 | ALREADY IN CLAUDE.md (NN16); `clinic.md` H33 "an apple, never a lolly": ALREADY THERE | |
| I3, I4 | DOC | `cast.md` (Nani based on Zafar's mum; sheet v2 canonical): ALREADY THERE; "calls every child *beta*" → engine data (the frame) and `cast.md` (add); the mole/bracelet/rings list → `bible` §6 The cast "must stay consistent" column (check in the chop; add if missing) | |
| I5 | DOC | `bible` §1 ("modern kitchen with Kutch accents"): ALREADY THERE in substance; `cast.md`: add "Nani's house is in Kutch" | |
| I6 | DOC | `clinic.md` H25/H26 (competent, kind; comedy never gory): ALREADY THERE in substance; add "the comedy is never at his expense" to `cast.md` The doctor | |
| I7 (decision 11) | DOC | `cast.md` §Big Ma: ALREADY THERE | |
| I8 | DOC | `cast.md` §The cats: ALREADY THERE in substance ("scatters the sweets"); add "mischief, never peril, never block play" | |
| I9, I10 | DOC | `cast.md` §The parrot and `conversations.md` 10a (10, 12): ALREADY THERE (fix the "Arre re" quote, decision 61) | |
| I11 | DOC | `cast.md` Arc 1 table (Generic): ALREADY THERE; "each orders for themselves" `cook.md`/`guide-and-card.md`: ALREADY THERE | |
| I12 | DOC | `cast.md` §Skin tones: ALREADY THERE | |
| I16 | DOC | `bible` §Set dressing: ALREADY THERE (the object list is in the archive, cited there) | |

### §10 Platform, privacy and release

| ID | pile | destination or check | note |
|---|---|---|---|
| J1 | CODE-TO-DO 17 + DOC | privacy lint; `tech` §Architecture "No backend": ALREADY THERE | |
| J2 | DOC | `tech` §Architecture and §Release path (Capacitor, Kids category, landscape): ALREADY THERE | |
| J3 | CODE-HAS | `save.test` (one save, players, namespaces), `core.test` progress per word | `tech` §Data model: ALREADY THERE |
| J4 | DOC | `tech` §Data model ("scenes with measured positions") and `qa` LAY-09: ALREADY THERE; `target-model.md` content as data | |
| J6, J7 (decision 18) | DOC | `target-model.md`, `tech` §Architecture: ALREADY THERE; "remove legacy code when the design moves on" → `target-model.md` (ALREADY THERE in substance) | |
| J11 (decision 68) | CODE-HAS + CODE-TO-DO 15 | `loadcheck.mjs` (Cook and clinic pages; in `checks.mjs load`); the rest of the pages → 15 | `tech` §Architecture "Lazy loading": ALREADY THERE (one line; the prefetch rule is in the loadcheck header) |
| decision 6 | DOC | `tech` §Release path: add "everything stays public until the game or landing page is published; then revisit" (not there) | |
| J5 | DOC | `tech` §Release path: add one line (landing page with sign-up, code-built trailer) | or `ideas.md` |
| J9 | DOC | `docs/vision.md` (success measure): check; add one line if missing | |
| J10 | DOC | `cost-and-speed.md` §The multi-language plan: ALREADY THERE (Gujarati next) | |

---

## Part B: every decision

Destinations as in Part A. "ARCHIVE" means the row goes to `docs/archive/decisions/` with its number kept; the index keeps one line.

| # | pile | destination or check | already there? |
|---|---|---|---|
| 1 | CODE-TO-DO 21 | bulb test; `ux` §4 | yes (ux §4 cites decision 1) |
| 2 | CODE-HAS | `core.test` score/wallet (no stars; speaking pays more) | yes |
| 3 | CODE-HAS | `test_shared_ui.mjs`; `ux` §9a | yes |
| 4 | DOC | `arcs` standalone arcs; `prog` bookshelf | yes |
| 5 | CODE-TO-DO 13 | banned-forms; `lex` noun forms note | yes |
| 6 | DOC | `tech` §Release path | no: add one line |
| 7 | DOC | `tech` §Release path ("the commercial model is open") + `status.md` Business | yes |
| 8 | CODE-TO-DO 18 | reward check; CLAUDE.md NN16; `clinic.md` H33 | yes |
| 9 | DOC | `cast.md` header (consent, sheet first) + `skill:art-run` | yes (consent); the "unattended runs" half is superseded by 77 |
| 10 | CODE-HAS + CODE-TO-DO (economy-sim threshold) | `core.test` wallet; `prog` Pocket money | yes |
| 11 | DOC | `cast.md` §Big Ma; `arcs` standalone arcs | yes |
| 12 | CLAUDE | CLAUDE.md NN5 | yes |
| 13 | CLAUDE | CLAUDE.md NN11; `tech` §Data model | yes |
| 14 | CLAUDE | CLAUDE.md "Hand over … 70% context"; `skill:handover` | yes |
| 15 | CODE-HAS | `env.mjs ALL_SIZES`, rotate-card flow; `qa` step 3 | yes |
| 16 | CODE-HAS / process | `statuscounts.mjs`, `skill:checkin`, `skill:feedback` step 7; CLAUDE.md NN3 | yes |
| 17 | DOC | `eng` requirements, `engine-design.md`, `lex` §5 (Excel retired) | yes |
| 18 | DOC | `target-model.md`, `tech` §Architecture | yes |
| 19 | ARCHIVE | sprint-only (S01), past date | — |
| 20 | CODE-HAS | `.gitignore`, `core.test` wallet ("merging the old purses", "no wages"), `baseline.mjs` ratchet | yes |
| 21 | CODE-HAS | `engine.test`, `fill.test` (he-form flagged) | yes |
| 21b, 23b, 28, 30–32, 35, 37, 38, 42–45 | ARCHIVE (sprint-only, in S01) | 30–32's spellings live in `data/lang/` + `fill.test` "red is laal"; 38 ("parked modes move when their turn comes") in `modes/README.md`; 45 done | yes |
| 22 | CODE-HAS | `mode.test`, `unlocks.test`; `prog` Replay | yes |
| 23 | DOC | `prog` bookshelf ("word books sit beside") | yes |
| 24 | CODE-HAS + DOC | `env.mjs` tablet sizes; `tech` §Screens | yes |
| 25 | DOC | `tech` §Screens (sidebar scales; `data/layout.json`); "rows as pills per screen size" → `ui` §12 (not there: one clause) | partly |
| 26 | CODE-HAS | `core.test`, `voice-parity.test`, `engine.test` (phrases off) | yes |
| 27 | DOC | `clinic.md` "Heal-game decisions (decision 27)" | yes |
| 29 | DOC | `skill:art-run` + `bible` §6 (sheet first); the "no manual steps" half is `pipe` §15 | yes (add the "Zafar approves real-people sheets only" line) |
| 33 | DOC | `tech` §Release path (the cycle) | no: add three lines |
| 34 | CODE-HAS | `touched.mjs`, `gatecache.mjs` | yes |
| 36 | CODE-HAS | `words.mjs` A gate; `tech` §Architecture | yes |
| 39 | DOC | `modes/README.md` (order of work) | no: one line |
| 40 | DOC + CODE-HAS | `eng` G27 section; `fill.test` re-runnable importers | yes |
| 41 | CODE-TO-DO 7 | counting contract check; `ui` §12, `clinic.md` rules | yes (text) |
| 46 | CLAUDE | CLAUDE.md "Tools and skills" | yes |
| 47 | CLAUDE | CLAUDE.md itself; "archived, never deleted" → `docs/README.md` Archive line | yes |
| 48 | CLAUDE | CLAUDE.md NN14; `qa` step 1 | yes |
| 49 | CLAUDE | CLAUDE.md Working agreement; `skill:sprint` | yes |
| 50 | CLAUDE | CLAUDE.md NN14 | yes |
| 51 | DOC | `ux` new §18 (redo on the spot) | no |
| 52 | CODE-HAS + CODE-TO-DO 6 | contract-2; next-row glow | yes (contract) |
| 53 | CODE-HAS | contract-1; `guide-and-card.md` R1–R3 | yes |
| 54 | DOC | `guide-and-card.md` Cook table (call-back) | yes |
| 55 | CODE-HAS + DOC | contract-4; `guide-and-card.md` R2, R3 | yes |
| 56 | DOC | `ui` §7 (add); `pipe` §10 row 2 | partly |
| 57 | CODE-HAS (contract-9 closed card) + CODE-TO-DO 21 + DOC | `ui` §12 (add three clauses) | partly |
| 58 | DOC | `conversations.md` 10a, §6.3 (add the gesture line) | partly |
| 59 | DOC | `clinic.md` H-eye (add the shaking-red exception) | no |
| 60 | DOC | `cook.md` H15/H49 ("pantry first, story mode only") + PAN-13 | yes |
| 61 | CODE-TO-DO 13 + DOC | banned-forms; `guide-and-card.md` R6; lexicon data (*matar*) | yes |
| 62 | DOC | `cook.md` (Tadka in labs, not first launch) + DAAR-15 | check in the chop; one line if missing |
| 63 | ARCHIVE | superseded by 66 (the robot test is closed) | — |
| 64 | DOC | `cook.md` kitchen art (three trays, Nani leaning) + ART-13 | partly (ART-13 row holds it) |
| 65 | DOC | `pipe` §15.1 grid/figure specs (one sheet per item with every view) + ART-20 | partly; ART-20 is reopened |
| 66 | CLAUDE + CODE-TO-DO 5 + DOC | CLAUDE.md NN10; `audio` cast list (add) | partly |
| 67 | ARCHIVE (superseded by 70) | the "robot stand-in until launch" is the test path (`core.test`) | yes |
| 68 | CODE-HAS + CODE-TO-DO 15 | `loadcheck.mjs`; `brief.mjs` writes the line | yes |
| 69 | DOC + CODE-TO-DO 5 | `audio` (add the blind-check sentence) | no |
| 70 | ARCHIVE (one-off state of the clips) | `data/family-audio.json` status ok-auto is the record | — |
| 71 | ARCHIVE (replaced by 77) | — | — |
| 72 | ARCHIVE (one-off; CLN-103) | `clinic.md` H-tooth | yes |
| 73 | CODE-HAS + CODE-TO-DO 22 | `applyVerdicts`; pending-note lint | yes |
| 74 | ARCHIVE (one-off; CLN-14 waits on art) | — | — |
| 75 | CODE-HAS | contract checks; `shared-api.md` Lifecycle | yes |
| 76 | CODE-HAS + CODE-TO-DO 1, 2 | `applyVerdicts`, `CONTRACT_ROUTE`; publish gate | yes |
| 77 | CLAUDE | CLAUDE.md NN13; `pipe` §Grounds (delete its API aside) | yes |
| 78 | CODE-HAS + CODE-TO-DO 24 | `sprintcheck.mjs`, `evidence.mjs`; feedback gate | yes |
| 79 | ARCHIVE (sprint-only art run; the ✓-after-count rule is contract-2's "capped count" clause) | `contract.mjs` check2 | yes |
| 80 | CODE-HAS | contract-1 (`NOT_ORDER` howto/passme), contract-2 (choice button); the pharmacy hint → `clinic.md` P | yes |
| 81 | CODE-HAS | `loan-audit.mjs`, `evidence.mjs` judge prompt; `conversations.md` 10a (1) | yes |
| 82 | CODE-HAS | `evidence.mjs`; `evloop` | yes |
| 83 | ARCHIVE (one-off; CLN-115, CLN-61, CLN-122, PAN-10 carry it) | — | yes (rows) |
| 84 | CLAUDE + CODE-HAS | CLAUDE.md NN4 (grey italic, hidden tag); `evidence.test` "to-record placeholders are skipped"; R4 → `guide-and-card.md` | yes |
| 85 | DOC | `clinic.md` H-eye (layout A default, B behind `?eyeLayout=B`) | check; one line if missing |
| 86 | CODE-TO-DO 1 | red-then-green gate | — |
| 87 | CODE-HAS + DOC | `loan-audit.mjs`, judge prompt; (1) chaat order → `cook.md` §14 + CHT-07; (2) tray front edge → `cook.md` + CK-21 (reopened) | yes (3); (1)(2) rows |
| 88 | DOC | `cook.md` §Pantry (decoys from L2, picture stickers) + PAN-06, PAN-15; loan words in lexicon data | yes (data); rows hold (1)(2) |
| 89 | CODE-TO-DO 2 | publish gate; the SH-16 clause is contract-9/SH-16 (built) | — |
| 90 | ARCHIVE (one-off art item; DAAR-07) | — | yes (row) |
| 91 | DOC | `clinic.md` D15f/H-fever (L3 names the effect; "fix it" at L4) + CLN-120 | check; one line if missing |
| 92 | CODE-TO-DO 8 + DOC | one-face check; `clinic.md` (add), `guide-and-card.md` R4 | partly |
| 93 | CODE-TO-DO 12 | steps-page test; `ui` §6a | yes |
| 94 | DOC | `cook.md` §13 Daar (the ladle rule) + DAAR-11; the samosa fold tile → ARCHIVE (one-off) | check; one line if missing |
| 95 | CODE-HAS | contract-8 (one highlight, one colour; `contract-rows.test` "two colours"); `ui` §12 | yes |
| 96 | CODE-HAS (judge refusal, panel) + CODE-TO-DO 1 (red first, two strikes); the S05-only clause → ARCHIVE | `evloop`, `judge.md` | partly |
| 97 | mixed | (1), (2) ARCHIVE (sprint-only); (3) card open first step to last → `ui` §12 (add) + CODE-TO-DO 6; (4) SEK-15 closed → `cook.md` sekelo (one clause); (5) W3 retired → `clinic.md` H28 (yes); (6) → decision 92; (7) tail at mouth → contract-4 (CODE-HAS) + `guide-and-card.md` R3 (add); (8) one thing per level → CODE-TO-DO 11 + `clinic.md` ladders | partly |
| 98 | ARCHIVE (superseded by 99 except the measuring method) | the `/context` baseline → `cost-and-speed.md` (add the 13 Oct numbers) | no |
| 99 | CLAUDE | CLAUDE.md Working agreement (sprints 1–3 days, one playable goal; one build session, two at most; Fable runs the orchestrator chat; a new rule replaces an old one) + this sort | partly (sprints: yes; session count: no) |

### Sprint files' decisions that last

| Sprint / item | pile | destination | already there? |
|---|---|---|---|
| S01 30–32 (grammar and spellings) | CODE-HAS | `data/lang/` seed, `fill.test` (decision 30, laal), `grammar-notes.md` §40–§55 | yes |
| S01 38 (parked modes move when their turn comes; 4c gap reporter only) | DOC | `modes/README.md`; `gap-report.mjs` | yes |
| S01 45 (what counts as remedial) | ARCHIVE | — | — |
| S03 (8 Oct bundle) | ARCHIVE | each item is decision 71/72/74 | yes |
| S05 (4) word review keeps English under each word (F14) | DOC | `ux` §9a | yes |
| S05 (7) samosa's final ✓ goes | CODE-HAS | contract-2 | yes |
| S05 "C3 owns every shared file; 15-minute limit lifted for the fix round"; ceilings | ARCHIVE | sprint-only | — |
| S05 "SessionStart hook installs scipy, playwright" | CODE-HAS | `.claude/settings.json` | yes |
| S05 look back 3 (decision 96 is rule C23) | CODE-TO-DO 1 | — | — |
