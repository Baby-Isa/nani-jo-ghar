# Nani jo Ghar: status

The orchestrator updates this file at every milestone and rewrites **Next chat** at the end of every step or gate. Percentages are Claude's estimates. User testing is tracked by Zafar, not here.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (12 Oct 2026, ~11:00 UTC, Sprint 4 orchestrator):** Sprint 4 ("your feedback sticks", `docs/sprints/S04-feedback-sticks.md`, decisions 75–79) is **open, not published**. `main` is still Sprint 3 (1a6950df). Everything is on `ccr-a7370759-t0lee7`. Work stalled 9–12 Oct on the account's usage limits (helpers stopped mid-task; resumed 12 Oct).

**Done on the branch:** the shared lifecycle every game goes through (pop-up first, moves on by itself, one voice stop, one bubble placement, smaller bob; S04-B, `build/reports/s04b-host.md`); contract checks 1–14 in the sandbox (`build/sandbox/lib/contract.mjs`); the sprint check (`build/tools/review/sprintcheck.mjs`, decision 78, `--all-rows` for the full audit); knee bandage wrap on the leg (CLN-100); waiting room and diagnosis open with the pop-up; closed big card in clinic pop-ups from L3 (no leak); scrape uses the landed graze art, plasters on the leg, hand clear of tools; Cook fixes (voice queue, one glow, chop-again pop-up, grill moves on, maani art wait); coverage audits applied to `regressions.md` (28 added, 46 rewritten, 25 reopened); Nani's API art reverted (decision 77: art only in ChatGPT runs Zafar supervises); the s05 art audit and paste block (`docs/design-language/art-plans/s05-*`).

**In progress:** the full audit of every row against evidence sheets (`build/screenshots/sprintcheck/s04-audit/`, index `build/reports/sprintcheck-s04-audit.md`). Quarter 4 judged (`build/reports/s04-audit-verdicts-4.md`: 31 PASS, 57 FAIL). Quarters 1–3 re-split into 30-row batches `jb-1a..3c` (orchestrator scratchpad; regenerate with `sprintcheck.mjs --judge-prompt --run-id s04-audit` if lost) and being judged by Opus (Fable hit its limit); verdict files `build/reports/s04-audit-verdicts-<batch>.md`.

**Next steps, in order:**
1. Finish judging (batches 1a–3c); merge every verdict into `regressions.md` (FAIL → reopened with the one-line reason; PASS → built with the sheet path).
2. Fix round 2 (code only) on the FAILs; known already: scrape first-time help writes English (non-negotiable 5), chop L3/L4 headline dots and English pill words (LNG-03), fever speech/look/gauge disagree (CLN-105), eye layout/dropper/end (CLN-61/62), tooth brush angle and no drill (CLN-103), Cook L3+ pop-up must use the shared closed big card, contract-11/14 residues, `morning@L3` flow forces L1, knee per-turn shots into the knee flow.
3. Full gate (`run.mjs --gate`), sprint check sheets, `/review`, then `/publish` and `/sprint` close.
4. Then Zafar plays; his supervised art run (s05 block, parts A–C first).

**Waiting on Zafar:** samosa "next kind" button (item 11, recommend the button); 15a how-to line and "pass me" outside the pop-up (recommend leave, check skips them); the pharmacy hesitation hint writes the item's name (recommend keep).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` ("Next chat" first). Branch `ccr-a7370759-t0lee7`. Sprint 4 is open: finish the audit judging, merge the verdicts into the regression list, run fix round 2 on the FAILs, then the full gate, `/review`, `/publish` and close the sprint. Tell me before launching anything new.

---

## The plan

| Step | What | State |
|---|---|---|
| 1 | The brain: rulebook, `CLAUDE.md`, QA checklist, regression list, decisions log, docs reorganised | **Done** (1 Oct) |
| 2a, 2b | The code target model; the language engine design | **Done** (1 Oct; decisions 17, 18) |
| 3 | Refactor to the target model (R0–R7), gate 5 Oct | **Done** for Cook and the clinic; parked modes move when their turn comes (decision 38) |
| 4 | The language engine built (4a, 4b), Cook and the clinic onto it (4d, 4e); 4c is the gap reporter only | **Done** (5 Oct) |
| Remedial | Everything the refactor left (decision 45): C3, C4 (Cook through the shared host), R7, E1 | **Done** (C4 6 Oct) |
| Docs | The docs rewrite and the sprint structure (D1; decisions 47, 49, 50) | **Done** (merged 6 Oct) |
| Sprint 1 → 2 | Sprint 1 ("remedial and engine") closes at the publish and Zafar's play; Sprint 2 is "play and fix Cook and the clinic" (`docs/sprints/`) | Next |
| Then | Finish Cook and the clinic by play and feedback; then Arc 1's other modes, story glue, the beach trip as template, other trips, the sewing arc (decision 39) | After Sprint 2 |

---

## Open feedback (regression list)

Every row is in `docs/process/regressions.md`. The orchestrator rechecks the rows for any screen a change touches and reports this table at every step end. Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 16 | 41 |
| Cook: pantry | 6 | 4 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 4 / 1 / 5 / 3 / 1 / 3 / 8 | 12 / 13 / 12 / 8 / 15 / 9 / 13 |
| Clinic | 33 | 89 |
| First launch and shell | 1 | 0 |
| Other modes | 2 | 0 |
| Art | 7 | 8 |
| Language and audio | 6 | 3 |

---

## What is live (the game on `main`)

Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

### Where each part is (Claude's estimates, 5 Oct)

| Part | % | Next step |
|---|---|---|
| **Arc 1: the Birthday** (release candidate) | 35 | Cook 80; first launch 70 (re-point at the Birthday); set the table 20; find the sweets 30; pack the sweet box 15; candles 0; Story by the Fire 0 (designed); Conversations 25 |
| **The clinic** (standalone arc) | 55 | The girl's art and all heal games on the engine; five patients (part C) and the drop machine (part D) to stitch in; the doctor's words (Round 4 Section G) |
| **Day-out trips** | 5 | Designed 28 Sept; beach first |
| **Other arcs** | 0–17 | Making clothes and quilt-making with Big Ma; Eid (later); Monsoon and Who did it? (proposed; engines and greybox built) |
| **Foundation** | – | The core, shell and save done; shared UI 90; story engine 40; day-log 0; world map 0; speech recognition 30 |
| **Language** | – | The engine built and filled (4a, 4b); recordings about 30% of the planned list; Mum's 168 clips to ear-check; Round 5 and 6 |
| **Art** | – | Cook 62; characters 45; the clinic: 76 of 115 on `main`, paused after part B (decision 43); Find it 33; parked modes 12; story panels 0 |
| **Release** | – | Wrapper 0; offline 10; privacy 20; performance 20; store listing 0; landing page and trailer planned; pricing open |

---

## Waiting on Zafar

Each has Claude's recommendation. Answer any time with "yes to all except …".

### For Mum (fold into the next recording)
1. **Words and forms (Round 5 / 6):** "with" for food and "and" between two kinds of one dish; the cooking verbs still missing (roll, pour, sprinkle, serve, oil, a board, each verb's polite and "for me" form); the he-word plural before "with / in / on", "the boys' cup", *iloka*, *mare*, *tapelo* or *sufuria*, *indo* or *mayai*, *koso*/*garam*, *thundo*/*thadhu* (`grammar-notes.md` §55 "For Mum next time"); *kere karein*, green pepper, *moikyo*, *Muke sekelo khape*, the *mirchi* plural, *watana*/*matar*, *sambusa*, *dinda*/*dinde*, *khan*/*khanij*; the handout words never confirmed (*atto, lasan, aadu, hardar, jeeru, rai, elchi, loon, trae, char, panj*). *Recommend: Round 5 Part A.*
2. **Re-takes with no good clip yet:** Mum: *cup*, *ambo*/*amba je mathe*, *chokra*/*chokri*/*Nana sathe*. Zafar: *hakro cup*, *salamun alaykum*, *na, muke na khape*, *trae bateta*, *hakri lakri*, *chokre sathe*. *Recommend: five minutes at the start.*
3. **First launch's lines are built on Eid.** *Recommend: re-word them for the Birthday before Mum records them.*

### Design questions
4. **"Hide and seek" in Arc 1:** Find it's Simba round, or a small Who did it? case? *Recommend Find it (it's built).*
5. **Grandparent mode** (the adult plays the shopkeeper) is "the one to protect" in the old design but in no rule. *Recommend: keep it as an idea until Conversations is wired.*
6. **Daily hooks** (a word of the day, one rotating hub): wanted at all? *Recommend: no streaks; at most one gentle "today" hub.*
7. **Speaking:** always optional? *Recommend yes (never block on recognition).*
8. **A skip for spoken replies in Conversations?** *Recommend yes, behind the "?".*
9. **Pocket-money receipts** in the old mode designs (+5 ear, +3 craft…): replace them all with the one model (decision 10)? *Recommend yes.*
10. **Hands:** kept only for first-person scenes outside Cook (Find it, the clinic)? *Recommend: parked until a mode needs them.*
11. **Samosa:** does the second kind start once the first count is made (which gives the count away), or with a "next kind" button? *Recommend: the button.*
12. **Maani:** do the dough piles never run out? *Recommend yes.*
13. **Chai art to make:** black-tea glasses, the tipped pan, in-between pan states; the daar ladle came out as a dipper (redo from a photo of a real *kadchi*); the sekelo plate cell. *Recommend: one art batch with the clinic redo list.*
14. **The Word copies of Mum's rounds:** does she still read them? *Recommend: yes, keep building them.*
15. **Busy and Relaxed Cook modes** (idea 28): gone? *Recommend: gone; timers come from the level.*
15a. **Cook's how-to line and Nani's "pass me" in the pop-up?** (s04-fxc, contract-1.) At L1 a station opens with Nani's how-to line in her box ("Chulo bar!" at the fry, "Bhar!" at the fill: decision 55's guide step, help after a pause from L2), and "pass me" asks in her own tray card ("Muke limu de."). The contract counts both as an order said outside the request pop-up. Put them through the pop-up too, or are they decision 53's "instruction just before the game"? *Recommend: leave both as they are (a how-to line is not an order; a pop-up per step would make every station start with a card), and let the contract skip the guide's step line and the "pass me" card.*

### Older open decisions (defaults were taken on 25 Sept, never confirmed one by one)
16. **Who did it?** Can Nana, Nani or baby Isa be culprits, and Kasuku a silent suspect? A "Prove it" step for 8+? *Recommend: yes to family culprits and Kasuku; Prove it optional at the top level.*
17. **Monsoon rush:** a goat in the kitchen as a joke? Big Ma's song during the leak? *Recommend yes to both.*
18. **The doctor:** what the children call him; does he voice his own lines? *Recommend: his own voice (Round 4 Section G), his family's name for him.*
19. **Snap:** young Nani in old photos? Instant camera or phone? *Recommend: young Nani yes; a phone.*
20. **Which sweets go in Nani's sweet box** (blocks art in three modes). *For Mum.*
21. **Owners:** mehndi (Tidy up or Dress up), "Footprints", "watch the sky". *Recommend: decide when each mode is rebuilt.*
22. **Ungraded creative choices** (Dress up themes, extra placing in Tidy up): OK? *Recommend yes.*
23. **Clothing words** (*topi* or *kofia*) and what the family really wears (blocks Dress up art). *For Mum.*
24. **Clinic feelings:** "sad" or "scared", always resolved gently? *Recommend yes.*
25. **Cook timing windows** (boil about 1.2 s, tawa about 0.9 s): too hard for a five-year-old? *Recommend: widen at level 1; check when Cook is finished.*

### Claude's working assumptions (not confirmed by Zafar or Mum; a yes or no moves each into the engine data or a decision)
- Order rows use the short *{x} na* (*Dudh na.*), not the polite *Muke {x} na khape*; Mum called the short form "very informal".
- Green chutney is the mint one (*fudino ji chutney*, a she-word); chutneys as she-words by inference from *ji*; *chundo*'s gender unknown.
- *lakri* (skewer) goes before *gos*, *boga* and *mixed*, though Mum said it only with *mishkaki*; *{x} hane kadh* and *{x} chadi de* name the thing instead of Mum's *inke*.
- Drop green pepper from the skewers at the next recipe or art change (no Kutchi word; do not call it *mirchi*).
- Pantry jars stay bare (no labels) for now.
- *gaykal* for "yesterday"; "tomorrow" (*saware* or *kale*) undecided.
- *Muke sekelo khape.* is kept while Zafar checks it with Mum; "with" join word stays a placeholder until Mum answers.
- Placeholders to record: "Chop these" (daar card), "bring me these for {dish}" (pantry), "[Bring me]" (clinic pharmacy ask); first-launch story lines are not family-confirmed.
- Handout vocabulary (*paani, chai, dudh, atto, dungri, tameto, lasan, hardar, jeeru, rai, elchi, loon, trae, char, panj, Hedo!, Ghan*) was never confirmed by Mum (Round 2 Part 5 and Round 3 Section D unanswered).
- Clinic level 1: a morning is 2 check-ups and 2 named ailments, the first visit always a check-up.
- Speech recognition defaults (Isa and a cousin saying five words, children's takes enrolled by default, no cloud path, three takes from Mum) await Zafar (`docs/architecture/speech-recognition-plan.md`).

### Business
26. **Commercial model:** open (decision 7). The landing page needs it first.
27. **Landing page:** whose voices and faces appear first. Hannah's granddad can share it across a community with deep Kutch roots; the trailer is planned "Planet Zoo style" (in-game footage, slow camera, gentle music, no narrator), built in code from the game.
