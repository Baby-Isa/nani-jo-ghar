# Nani jo Ghar: status

The orchestrator updates this file at every milestone and rewrites **Next chat** at the end of every step or gate. Percentages are Claude's estimates. User testing is tracked by Zafar, not here.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (written by D1, 6 Oct 2026):** the docs rewrite is done on branch `docs-rewrite` (not merged, never pushed to `main`); the game is on branch `ccr-fcd9dddd-wnywzc`, and `main` is still the 1 Oct build plus art uploads. Sprint 1 ("remedial and engine", `docs/sprints/S01-remedial-and-engine.md`) closes at the next publish; Sprint 2 is "play and fix Cook and the clinic" (`S02-…`).
- **Done:** step 3 and step 4 (Cook and the clinic on the core and the engine), C3, R7, E1, W1, W2, A1, A2, T1–T3, the Fable docs audit, D1 (reports in `build/reports/`). C4 (Cook mounted through the host, no iframes; title, days and shop not yet on shared screens: `c4-cook-host.md`).
- **Art** is paused until after play (decision 43); 76 of 115 clinic images on `main`; the redo list is `docs/design-language/art-plans/clinic-heal-redo-list.yaml`.
- **Zafar plays** only once it is live on `main` (decision 33).

**Next steps, in order:**
1. Fable reviews the `docs-rewrite` diff against the audit (`docs/process/audits/2026-10-05-docs-audit.md`); on Zafar's go, merge `docs-rewrite` into the integration branch.
2. The orchestrator's `/review` (touched mapper, regression rows, the sandbox full matrix, shotdiff, flaws first), then `/publish`, the Pages check, and the link and what to play for Zafar.
3. Open Sprint 2 with Zafar (`/sprint`: goal, budget, sessions, one go at a time). He plays → `/feedback` → fixes; the clash-list sheet for Zafar and Mum (`mumsheet.mjs`); the art redo list plus part C in one faster run (`/art-run`; write the W11 standing pose prompt first).
4. Open: Mum's 168 clips to ear-check; Round 5 and 6; the questions under "Waiting on Zafar" below.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` ("Next chat" first) and only the rulebook sections for the work at hand. Branch `ccr-fcd9dddd-wnywzc` (docs on `docs-rewrite` until merged). Give me a one-paragraph update, then carry on with "Next steps". Tell me before launching anything new.

---

## The plan

| Step | What | State |
|---|---|---|
| 1 | The brain: rulebook, `CLAUDE.md`, QA checklist, regression list, decisions log, docs reorganised | **Done** (1 Oct) |
| 2a, 2b | The code target model; the language engine design | **Done** (1 Oct; decisions 17, 18) |
| 3 | Refactor to the target model (R0–R7), gate 5 Oct | **Done** for Cook and the clinic; parked modes move when their turn comes (decision 38) |
| 4 | The language engine built (4a, 4b), Cook and the clinic onto it (4d, 4e); 4c is the gap reporter only | **Done** (5 Oct) |
| Remedial | Everything the refactor left (decision 45): C3, C4 (Cook through the shared host), R7, E1 | **Done** (C4 6 Oct) |
| Docs | The docs rewrite and the sprint structure (D1; decisions 47, 49) | Done on branch `docs-rewrite`, Fable review next |
| Sprint 1 → 2 | Sprint 1 ("remedial and engine") closes at the publish and Zafar's play; Sprint 2 is "play and fix Cook and the clinic" (`docs/sprints/`) | Next |
| Then | Finish Cook and the clinic by play and feedback; then Arc 1's other modes, story glue, the beach trip as template, other trips, the sewing arc (decision 39) | After Sprint 2 |

---

## Open feedback (regression list)

Every row is in `docs/process/regressions.md`. The orchestrator rechecks the rows for any screen a change touches and reports this table at every step end. Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 7 | 26 |
| Cook: pantry | 2 | 3 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 3 / 0 / 1 / 0 / 0 / 0 / 3 | 3 / 8 / 7 / 5 / 10 / 6 / 8 |
| Clinic | 8 | 72 |
| First launch and shell | 1 | 0 |
| Other modes | 2 | 0 |
| Art | 5 | 2 |
| Language and audio | 1 | 3 |

---

## What is live (the game on `main`)

The 1 Oct build plus art uploads: Cook (six stations on v3 and the pantry), the clinic v2 prototypes, first launch, the shared kit. Everything since (the core, the engine, Cook and the clinic on it, the girl's clinic art) is on the integration branch and goes live at the Sprint 1 publish. Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

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
