# Nani jo Ghar: status

The orchestrator updates this file at every milestone and rewrites **Next chat** at the end of every step or gate. Percentages are Claude's estimates. User testing is tracked by Zafar, not here.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (8 Oct 2026, ~05:30 UK, written by the Sprint 3 orchestrator):** Sprint 3 ("overnight fix", `docs/sprints/S03-overnight-fix.md`) is **published and closed**: `main` 1a6950df (version 20261008T043015Z). Sessions A–D are in (reports `build/reports/s03*.md`); the review is `build/reports/s03-review.md` (flaws first). Art now runs through the image API with Fable reviewing (decision 71). Nothing is running. Open rows: 31 open, 257 built and not re-played.

**8 Oct, 23:50 UK:** Zafar played two minutes and found old feedback unbuilt and new bugs (`docs/feedback/playtest-2026-10-08-sprint3.md`). **Sprint 4 open** (`docs/sprints/S04-feedback-sticks.md`, decisions 75, 76): A (contract checks), B (shared host lifecycle), C (served chaat, Nani leaning) running to 08:00 UK; then the full contract run and Fable's audit of every row and every feedback document; the fix round goes to Zafar first.

**Next steps, in order (Sprint 4: Zafar's play and feedback):**
1. **Zafar plays** (link below) and sends feedback (voice notes or typed) → `/feedback` → rows the same day; built rows he confirms become fixed, the rest reopen.
2. Put to him with his feedback: (a) chop, stir, tadka and daar can't take a move back (a slice or spice can't be undone); the redo is their safety net: recommend accept; (b) the review's flaws (taste spots may read as felt balls, the girl's "cold" face reads as a wince, the kadchi handle a little stubby).
3. Then propose Sprint 4's build scope from his feedback, plus: voices (USB mic on the grammar, then re-records; Mum's Round 5; decision 70), and the other characters' art through the API once he's happy with the girl (decision 71).

**Play link:** https://baby-isa.github.io/nani-jo-ghar/labs.html (hard refresh first). Play: the clinic (one full patient at L1 and L2: every heal game should open with the request pop-up and fold it into the sidebar; tap through it and the voice stops; finish a game fast and no voice reaches the send-off), the fever room, the tooth (old drill), the new art (the girl's hot/cold/sore/happy faces, the kadchi, the daar bowl, two-colour plasters, the taste spots); Cook every station at L1–L3 (chai take-back, the pour, the samosa mounds).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` ("Next chat" first). Branch `ccr-a7370759-t0lee7` (restart it from `main` if its work is all merged). Sprint 3 is published to `main` and closed; this chat is Sprint 4: I'm playing it now. Wait for my feedback, turn it into rows with `/feedback`, then propose the Sprint 4 build scope and budget as a numbered list. Tell me before launching anything new.

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
