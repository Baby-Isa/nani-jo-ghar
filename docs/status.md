# Nani jo Ghar: status

The orchestrator updates this file at every milestone and rewrites **Next chat** at the end of every step or gate. Percentages are Claude's estimates. User testing is tracked by Zafar, not here.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (6 Oct 2026, written by the 5 Oct orchestrator):** Sprint 1 ("remedial and engine", `docs/sprints/S01-remedial-and-engine.md`) is closed: everything is published to `main` (PUBLISH_LINE). Cook and the clinic run on the shared core and the language engine; Cook is a host plug-in; the clinic runs on the girl's finished art; 18 scripts and 9 project skills are in use by default; the docs are rewritten (decisions 28–50). Reports for every session are in `build/reports/`; the final check is `build/reports/s01-review.md`.

**This chat opens Sprint 2** ("play and fix Cook and the clinic", `docs/sprints/S02-play-and-fix-cook-clinic.md`). Run `/sprint` to open it with Zafar:
1. **Play link:** https://baby-isa.github.io/nani-jo-ghar/labs.html (hard refresh first). What to play:
   - **Cook:** chai, samosa, daar and the pantry at levels 1–3 (the counting rule: L1 written and counted along, L2 written, L3 heard only; undo before Done; Mum's words in the guide box: tap its speaker).
   - **The clinic:** one full patient visit, then all nine heal games on the girl's art (fever room, eye test A and B, tooth fill, ear wax, the bud and *malam*).
   - Listen for: the greetings ("thank you", *khuda-fis*), grey "to record" placeholders, anything in English for the child.
2. **Zafar's feedback** (voice notes or text) goes into this chat → `/feedback` → a report and regression rows the same day.
3. **Scope Sprint 2 together:** from his feedback plus the open rows (table below) pick what gets fixed this sprint; set the budget (money and days); then `/brief` the fix sessions (fast checks only, decision 50) and one `/review` + publish at the end.
4. Also open, to schedule inside or after Sprint 2: the art redo list + part C in one faster run (`/art-run`; write the W11 standing-pose prompt first); the clash-list sheet for Zafar and Mum (`mumsheet.mjs`); Mum's 168 clips to ear-check; Cook's title/day/shop still on Cook's own screens (C4: the shell lacks them).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` ("Next chat" first). Branch `ccr-fcd9dddd-wnywzc`. Sprint 1 is closed and live. Open Sprint 2 with me (`/sprint`): give me the play link and what to play, then wait for my feedback; turn it into rows with `/feedback`, and propose the Sprint 2 scope and budget as a numbered list. Tell me before launching anything new.

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
