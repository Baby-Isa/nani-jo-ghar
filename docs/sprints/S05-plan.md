# Sprint 05 plan: fix the reopened list, red then green

**Status:** plan, for Zafar's yes (nothing launched). Written 12 Oct 2026 from `regressions.md` (146 open or reopened rows; `status.md` says 144, so recount with `statuscounts.mjs --write`), evidence runs ev-s04-ev1 to ev4, `evidence-toolfix.md`, the s05 art audit, `cost-and-speed.md` and decisions 75–86.

## Flaws and risks first

1. **Seven "code" FAILs are really tool failures.** The `check_vessel_meta.py` probe exits 1 on `ModuleNotFoundError: scipy` (SH-33, CHAI-06, MAA-10, CK-02, CK-12, CK-20), and `test_cook.py --orders` exits 1 on a missing Python `playwright` (SEK-05). MOD-01 and CHT-03 fail for the same scipy reason. The evidence tool counts an import error as a FAIL, and it shouldn't.
2. **Rebuilding `data/lang` would demote 8 confirmed words to draft.** (read-only in-memory diff, 12 Oct): `n.mince` (chundo), `n.onion` (dungri), `n.tomato` (tameto), `phrase.ali`, `phrase.nana`, `phrase.nani`, `phrase.here-by-you`, `phrase.there-over-there`. They were set by hand in `data/lang/`, not in a source. **Nobody runs `import_all.mjs` until package B moves them into `build/lang/hand/` and the diff is 0.**
3. **The pantry leak is on no row, and no leak check covers it.** Shelf labels follow `Cook.labelMode` (word stage), so the unlabelled jars are the order (non-negotiable 6). It needs a new row, PAN-15, and a pantry config in `leak.mjs`.
4. **Some rows can't go green until Mum records.** LNG-06, LNG-10 and part of LNG-01 fail `familyOnly` because their lines are silent placeholders (decision 84 allows them). The `lexicon` expect also flags grey-italic placeholders. Package T makes it skip tagged placeholders.
5. **One browser lock is shared by everything** (`/tmp/njg-browser.lock`). Four packages each running red and green probes will queue. Each package therefore does one red run of all its rows at the start, then a green run per group, in 13-minute chunks.
6. **Shared-layer fixes fan out.** C and D rebase on S's pushes, and S pushes its voice group first.
7. **Art gaps outside the s05 block.** The kadchi (DAAR-02), the teaspoon (CHAI-13) and the potato cube (ART-11) are not in any part. Part B needs the doctor's photos, or it is skipped.
8. **Smaller items:**
   - The knee driver plays fewer wrap turns than CLN-100 asks for.
   - `heal-marks.mjs` is missing (CLN-38, CLN-119).
   - CLN-22 p3 L2 is still a tool failure.
   - Six PASSes cite no panel and stay unjudged: SH-55, MAA-05, CLN-74, FL-02, ART-09, CLN-77.
   - The `knead.js` literal no longer shows: `checks.mjs --only words` gives 0 literals today. Package T verifies and closes it.

## Classification (146 rows plus the 12 known items)

| Class | Rows | Count |
|---|---|---|
| **CODE** | S1 shared voice and lifecycle 7 · S2 shared screens 14 · B leaks, English and words 17 · C Cook stations 32 · D clinic 35 (rows listed per package below); known items 1–4, 6, 7, 9, 10, 12 | 105 |
| **ART** | SEK-14 (part C, SK2), CLN-37 and CLN-106 (C, DM1–DM2), CLN-64's L3 sole (C, RP1), ART-19 (A: N3, N5; C: GB1, GM1), ART-10 (A), CLN-01, CLN-17 and CLN-115 (B, DS1–DD1), ART-20 (F, conditional); not in any part: DAAR-02, CHAI-13, ART-11 | 12 |
| **MUM** | PAN-10, LNG-11 (*Muke de*, *Muke chai lai de*); CLN-119 (yellow, blue); LNG-04 ("with" join, ph-turner, sekelo, plaster line); LNG-06, LNG-10 (every silent line) | 6 |
| **ZAFAR** | CHAI-01, CK-01, LNG-08, LNG-12 (his ear or play); CLN-122 (close as is, decision 83); CLN-116 (certificate photo); CK-TAB-01 (defer to S06?) | 7 |
| **TOOL** | SH-33 CHAI-06 MAA-10 CK-02 CK-12 CK-20 SEK-05 MOD-01 (environment); CLN-07 CLN-65 ART-12 (probe never reaches the state); PRC-02, PRC-09 (process); items 5, 8, 11 | 13 |
| **OBSOLETE / WONT** | CLN-14 (decision 74: waits for the other patients' art); CLN-41 (parked games, probe obsolete); MOD-02 (Find it parked, decision 38; its greybox English goes to B) | 3 |

## Packages

**Probe command per row** (decision 86: the same command fails before the fix and passes after it):

`COOK_TEST_PORT=<port> flock -w 3600 /tmp/njg-browser.lock timeout 1200 node build/tools/review/evidence.mjs --run --rows <ID>[,<ID>…]`

Below this is written as `EV<port> <rows>`. Each package does one red run of all its rows at the start, a green run per group, and `--resume <id>` after an exit 75.

| Pkg | Owns (no other package edits these) | Model, effort | Cost | Time |
|---|---|---|---|---|
| **T** tools | `build/tools/**`, `build/sandbox/**`, `.claude/**`, the environment setup script, `build/*.py` checks | Sonnet medium (Haiku for counts) | $10–14 | 3 h |
| **S** shared | `js/shared/**`, `css/shared/**` | Opus high | $28–35 | 4–5 h |
| **B** words and leaks | `js/core/lang/**`, `data/lang/**`, `build/lang/**`, `js/cook/{words,lang,order,recipes}.js`, `js/cook/mechanics/fetch.js`, `js/clinic/lang.js`, `js/home.js`, `js/first.js`, `js/find/**` | Opus high | $22–30 | 4 h |
| **C** Cook | the rest of `js/cook/**`, `css/cook/**`, Cook data | Opus high | $35–45 | 5–6 h |
| **D** clinic | `js/clinic/**` (not `lang.js`), `css/clinic/**`, `data/clinic/**` | Opus high | $40–50 | 5–6 h |

Two more lines in the budget: judging (Fable image batches of 8–10, Sonnet text batches of 30), about $15; `/review` and publish (Fable), about $25.

**Total: about $175–215 and a working day.** At most four packages run at once.

**Order:**
- **Wave 1, now:** T, S and B.
- **Wave 2:** C and D start when T has the environment fixed and S has pushed S1 (about 2 h in).
- **Wave 3:** B's multi-language prep, after C and D have merged (or S06; see decision 6 below).

### T: tools (port 8895)

1. Install scipy and Python playwright in the setup script. Make `evidence.mjs` treat an import error or a missing module in a `cmd:` capture as a TOOL FAILURE. Then `EV8895 SH-33,CHAI-06,MAA-10,CK-02,CK-12,CK-20,SEK-05,MOD-01,CHT-03`. What still fails goes back to C.
2. Make `lexicon` and `familyOnly` skip hidden to-record tags.
3. Restore `heal-marks.mjs`, then `EV8895 CLN-38,CLN-119`.
4. Fix CLN-22 p3 L2 (a later moment).
5. Make the knee driver reach the row's turn counts: `EV8895 CLN-100`.
6. Respecify and run `EV8895 CLN-07,CLN-65,ART-12`.
7. Re-judge the six PASSes that cite no panel.
8. PRC-02 (16:10 output) and PRC-09 (write the game-mode-design skill).
9. From `cost-and-speed.md`:
   - the model table and a 2k-word context pack with a decisions digest in `brief.mjs`;
   - `brief.mjs` fails when two live briefs own the same path;
   - `--apply` refuses a run without the verdict cache, and the gate runs only touched pages;
   - screenshot retention;
   - a hook that warns when work has gone 30 minutes unpushed.
10. Close the `knead.js` lint item.

### S: shared layer (port 8891); S1 first, pushed alone

| Group | Rows (probe: `EV<port> <the group's rows>`, red before, green after) |
|---|---|
| S1 voice after a stop: one stop at fold, stage-end and game end | SH-66, SH-64 |
| S1 talk, bubble, read-along | ART-18, SH-17, day-2 greeting bubble (add a probe at 800x360) |
| S1 help, ✓ glow, bulb | SH-19, SH-58, SH-41 |
| S2 results card: layout, order, actions, room behind it | SH-01, SH-03 (layout), SH-44, SH-67, SH-51, CLN-69, item 10, tooth end card |
| S2 order card: fit, centre, speaker, stamp, groups | SH-09, SH-48, PAN-01, SH-36, SH-16, SH-54, SEK-03 |
| S2 the ✓ button | SH-61 |

### B: leaks, English to the child, the engine (port 8892)

| Group | Rows (probe: `EV<port> <the group's rows>`, red before, green after) |
|---|---|
| Pantry leak: label every jar by one rule, whatever the order; a pantry leak config | new PAN-15 (write its spec first), PAN-06, PAN-09 · also: `node build/tools/review/leak.mjs cook --rounds 300` |
| English written for the child: the house doors, "Player 1", Find it greybox labels (pictures, or nothing; English only behind "?"); pill and card English | item 9, LNG-01, LNG-03, SH-03 (text), plus a new FL row and probe for the house |
| Engine data safety: move the 8 confirmations into `build/lang/hand/`; `import_all.mjs` refuses to demote a confirmed entry; SH-56 samosa "tap ✓" line (if the engine can't say it, report the gap; don't hand-write it) | item 2, SH-56 · also: the in-memory diff is 0, `import_all.mjs --check` |
| Sentences and forms | SH-70, PAN-02, PAN-03, MAA-02, CHAI-05, SAM-03, SAM-15, SEK-11, CK-22, SH-69 |
| Numbers by level | SH-13, SH-52, SEK-12 |
| Wave 3: multi-language prep (a `lang` key in the save; `data/lang/kutchi/`; no second pack) | item 12 · also: `node build/tools/review/checks.mjs`, `import_all.mjs --check` |

### C: Cook stations (port 8893); after T step 1 and S1

| Group | Rows (probe: `EV<port> <the group's rows>`, red before, green after) |
|---|---|
| Stage fits its screen | SH-37, SEK-07, MAA-08, CHAI-08 |
| Counts and ticks where the thing goes | SH-15, SH-39, SH-32, DAAR-04, SEK-13 |
| What's in the pot, and one puff effect | CK-06, DAAR-05, CK-27, SAM-10, SAM-05, SAM-02 |
| Chai pour and tray | CHAI-07, CHAI-17, CHAI-18, CHAI-15 |
| Daar and chop tools | DAAR-11, DAAR-13 (and the throws that cross), DAAR-07, CHT-05 |
| Flow and service | PAN-05, CHT-07, SEK-08, MAA-14, CK-07, CK-21, CK-24, SAM-08, CK-09 |

### D: clinic (port 8894); after T step 1 and S1; the results rows after S2

| Group | Rows (probe: `EV<port> <the group's rows>`, red before, green after) |
|---|---|
| Leak and one instruction at a time | LNG-02 (find the game first: `leak.mjs clinic --rounds 300`), SH-45, CLN-118, CLN-120, CLN-45, CLN-113, SH-10 |
| Ends and flow | CLN-03, CLN-111, CLN-87, CLN-26, CLN-117, CLN-25 |
| People and rooms | CLN-81, CLN-85, CLN-86, CLN-11, CLN-12, CLN-90, CLN-94, ART-05 (exam-room background at full resolution) |
| Heal games | CLN-48, CLN-100, CLN-53 (and the bristles), CLN-54, CLN-58, CLN-64 (L1–L2), CLN-74, CLN-101, CLN-104, CLN-105, CLN-107, CLN-38 |
| Pharmacy and take-back | CLN-22, CLN-112 |

## First hour

1. **B:** the pantry label leak. Add row PAN-15 with its spec, then a pantry leak config. It goes red, then green.
2. **T:** install scipy and Python playwright, and treat import errors as tool failures. Then rerun the 9 rows; about 7 should turn green with no code change.
3. **S:** voice after a stop (SH-66, SH-64) in the one voice layer.
4. **B:** English on the first-launch house and in the Find it greybox (item 9). The house is the first screen a child sees.
5. **B:** move the 8 hand confirmations into `build/lang/hand/`, so the importer is safe before anyone runs it.
6. **D:** run `leak.mjs clinic --rounds 300` and name the leaking game (LNG-02).

## What Zafar does, and when

**Today, before the launch.** Answer these with "yes to all except …":

1. The budget, about $175–215. *Recommend yes.*
2. CK-TAB-01 (the 4:3 tablet layouts) moves to S06. *Recommend yes.*
3. CLN-122 is closed with the knee framing as it is (decision 83). *Recommend yes.*
4. The word review shows English glosses ("three, cardamom", SH-03). *Recommend: a picture instead; no written English for the child.*
5. Add the kadchi, the teaspoon and the potato cube to the s05 block as a part G (3 images). *Recommend yes.*
6. The multi-language prep runs at the end of this sprint only if the budget allows; otherwise S06. *Recommend S06.*
7. The samosa "tap ✓": if the outcome is already obvious, it goes (decision 79) and needs no line. *Recommend yes.*

**During wave 2.** The art run, parts A to C (18 images, about 1 h 10 min), with the doctor's photos to hand for part B. Claude wires what lands. Parts D to F (about 3 h 20 min) wait for S06.

**At Mum's next session.** Round 5:
- *Muke de* and *Muke chai lai de*
- yellow and blue
- the "with" join, ph-turner, sekelo and the plaster line
- the silent lines listed by `node build/lang/gap-report.mjs`

His answer to CLN-116: the certificate photo.

**After the publish.** His ear and play: CHAI-01, CK-01, LNG-08, LNG-12.
