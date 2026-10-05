# Nani jo Ghar: status

The orchestrator updates this file at every milestone and rewrites **Next chat** at the end of every step or gate. Percentages are Claude's estimates. User testing is tracked by Zafar, not here.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (5 Oct 2026, 20:45 UK):** all work is on branch `ccr-fcd9dddd-wnywzc`; `main` is still the 1 Oct build plus art uploads. Decisions 28–46 were made today.
- **Done today** (reports in `build/reports/`): C1, G1, Mum's 5 Oct round, W1, W2, the step 3 gate, F1, A1, A2 (the girl's clinic art, all wired), C3 (Cook ready to play), 4a and 4b (the language engine built and filled), 4e (the clinic on the engine), T1–T3 (18 scripts, 8 project skills), the Fable docs audit (`docs/process/audits/2026-10-05-docs-audit.md`).
- **Art:** paused after part B (decision 43); 76 of 115 on `main`; redo list in `docs/design-language/art-plans/clinic-heal-redo-list.yaml`.
- **Zafar plays** only once it is all live on `main` (decision 33).

**Next steps, in order (decisions 33-45):**
1. Re-arm a 30-35 minute `send_later` check-in; `node build/tools/ops/checkin.mjs --log`; one line to Zafar.
2. Running (5 Oct night, all stop by 03:00): 4e the clinic onto the engine (`session_01EvLeEZ6dW2FsyiCv1Dh463`), 4d Cook onto the engine (`session_01FEBF4MPUvkRBi7NJD9fJdC`, auto), R7 every leftover outside Cook/clinic (`session_01N7s9C8VqmN22RLcwwGzBB4`, auto). Done today: F1, A2, C3, 4a, 4b, T1, T2, T3 (reports in `build/reports/`).
3. When 4d ends: launch C4, Cook's stations mounted through the shared host (Opus high, auto): start/stop in a given element, teardown, globals into modules, Cook's own title/days/shop onto the shell if feasible.
4. When 4d, 4e, R7 and C4 are done: the orchestrator's `/review` (touched mapper → regression rows → sandbox full matrix → shotdiff, flaws first), then `/publish`, Pages check, send Zafar the link and what to play.
5. Zafar plays → `/feedback` → fixes; clash list sheet for Zafar and Mum (`mumsheet.mjs`); the art redo list + part C in one faster run (`/art-run`; write the W11 standing pose prompt first).
6. The docs rewrite (Fable reviews) closes the chapter.
7. Open: Mum's 168 clips to ear-check; Round 5/6.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` ("Next chat" first) and only the rulebook sections for the work at hand (§2 sessions, §3 quality). Work on branch `ccr-fcd9dddd-wnywzc`. Check the running sessions listed there, give me a one-paragraph update, then carry on with "Next steps" (check-ins, your look, then the play link). Tell me before launching anything new.

**Keeping new chats cheap:** read only the rulebook sections a task needs (not all of `rules.md`); read reports, never transcripts; hand over at each step boundary or around 300k context.

---

## The plan (agreed 30 Sept)

| Step | What | State |
|---|---|---|
| 1 | The brain: rulebook, `CLAUDE.md`, QA checklist, regression list, decisions log, docs reorganised | **Done** (merged 1 Oct) |
| 2a | Code target operating model: engine core, one scoring model (the three badges), shared UI kit, content as data, modes as plug-ins, a sandbox that plays the real flows, layout lint; then a gap analysis with a sequenced refactor plan and estimates | **Done** (approved 1 Oct) |
| 2b | Language engine design: Grammatical Framework style, the Sindhi resource grammar as template, Mum's answers as the only evidence; the grammar knowledge base; the fill-the-engine rulebook and questionnaire | **Done** (decided 1 Oct, decisions 17, 26, 30) |
| 3 | Refactor to the target model: the lean plan (R0–R5), checked by flow tests and layout lint; parked modes move when their turn comes | **Done** for Cook and the clinic (R0–R6, gate 5 Oct; F1 fixes its findings). Cook's shims go in C3 before play. Parked modes move when their turn comes (decision 38) |
| 4 | Build the language engine, fill it with everything known, use it everywhere | **4a running** (5 Oct); 4b next; 4c = gap reporter only (simulator later); 4d/4e (Cook, clinic onto it) with Zafar's feedback fixes |
| Docs | The shared design docs are rewritten clean after the target model is approved; each mode's doc is rewritten when that mode is refactored (its "Stale points" box then goes) | After 4d/4e; closes the chapter (decision 38) |
| Then | Finish Cook and the clinic by play and feedback; then Arc 1's other modes, story glue, beach trip as template, other trips, sewing arc (decision 39) | After the chapter closes |

---

## Open feedback (regression list)

Every row is in `docs/process/regressions.md`. The orchestrator rechecks the rows for any screen a change touches, and reports this table at every step end.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 8, including the end-screen word tile overflow and *hakro*/*hakri* | 13 |
| Cook: pantry | 3, including **PAN-01 reopened** (headline and growing row clipped) and PAN-02 (lines are fragments; needs the engine) | 2 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 3 / 2 / 2 / 0 / 0 / 2 (incl. SEK-09, mistimed skewer) / 1 | 3 / 6 / 6 / 5 / 10 / 4 / 8 |
| Clinic | 7 | 34 |
| First launch and shell | 1 | 0 |
| Other modes | 2 | 0 |
| Art | 5 | 2 |
| Language and audio | 1 | 3 |

**Where they get fixed:** the shared and layout rows in step 3 (with the layout lint), PAN-02 in step 4 (the engine), the Cook rows when Cook is finished, the clinic rows with the clinic games.

---

## Live today (the game on `main`, 30 Sept evening)

- **Cook:** all six stations on v3 (chai, maani, chaat, daar, samosa, sekelo; reports `build/reports/<station>-v3.md`), plus the v3.1 art and follow-ups (`build/reports/art-v3-1.md`). The pantry is live and awaits polish. The station select, day flow and title screen are parked.
- **The clinic:** v2 prototypes with Zafar's play fixes (`build/reports/clinic-v2-fixes.md`). The item art is cut (`assets/clinic/items-v2/`) but not wired. "Again / All patients" on its end screen is agreed and not built.
- **First launch:** live (`first.html`). Its hook still says Eid; the story panels are not drawn.
- **Conversations:** engine and lab live; not yet wired into pages.
- **Shared:** the order card, Nani's box, the end pop-up with three badges, the kitchen kit, serve-and-taste, the button kit, one save.

### Where each part is

| Part | % | State and next step |
|---|---|---|
| **Arc 1: the Birthday** (the release candidate) | 35 | Cook 80; first launch 70 (re-point at the Birthday); set the table (Tidy up's engine) 20; find the sweets (Find it) 30; pack the sweet box 15; candles 0; the Story by the Fire 0 (designed); beats and the hub filling up 20; Conversations 25 |
| **The clinic** (standalone arc, built early for the doctor) | 30 | v2 prototypes live; design-system rebuild after Cook; words 5 (Round 4 Section G is the doctor's script); art 32 |
| **Day-out trips** | 5 | Designed 28 Sept; beach first |
| **Other arcs** | 0–17 | Making clothes with Big Ma (Dress up, parked); quilt-making with Big Ma (not designed); Eid (later, not designed); the monsoon and Who did it? (proposed; engines and greybox built) |
| **Foundation** | – | Shell and save 100; shared UI 85; story engine 40; day-log 0; world map 0; speech recognition 30 |
| **Language** | – | Recordings about 25% of the planned list (Round 4 unanswered); grammar notes 45; voice clips: 157 OK from 28 Sept plus re-takes to record; the engine: not built (step 4) |
| **Art** | – | Cook 62; characters 45; the clinic 32; Find it 33; parked modes 12; UI and icon 30; player character 0; story panels 0. Hands are parked: none in Cook (rule H13) |
| **Release** | – | Wrapper 0; offline 10; privacy 20; performance 20; store listing 0; landing page and trailer planned; pricing open |

*The previous tracker (29–30 Sept, with its per-station history and art notes) is in git history and at `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.*

---

## Waiting on Zafar

Not needed for step 1; each has Claude's recommendation. Answer any time with "yes to all except …".

### For Mum (fold into the next recording)
1. **The words and forms in Round 5 / Round 4:**
   - "with" for food, and "and" between two kinds of one dish (Cook's biggest gap);
   - the cooking verbs: **mostly answered 5 Oct** (Round 4 I1–I21, `docs/language/grammar-notes.md` §38); still missing: roll, pour, sprinkle, serve, oil, a board, and each verb's polite / "for me" form;
   - from the 5 Oct answers: the he-word plural with "with / in / on" (*wadha chokra sathe* or *wadhe chokre sathe*), "the boys' cup", *iloka* and *mare*, *tapelo* or *sufuria* and *indo* or *mayai* for the game, *koso*/*garam* and *thundo*/*thadhu* (Masi) (grammar-notes §55 "For Mum next time");
   - *kere karein*, green pepper, *moikyo*, *Muke sekelo khape*, the *mirchi* plural, *watana*/*matar*, *sambusa*, *dinda*/*dinde*, *khan*/*khanij*;
   - the handout words never confirmed (*atto, lasan, aadu, hardar, jeeru, rai, elchi, loon, trae, char, panj*).

   *Recommend: Round 5 Part A.*
2. **Re-takes with no good clip yet:**
   - Mum: *cup*, *ambo*/*amba je mathe*, *chokra*/*chokri*/*Nana sathe*;
   - Zafar: *hakro cup*, *salamun alaykum*, *na, muke na khape*, *trae bateta*, *hakri lakri*, *chokre sathe*.

   *Recommend: five minutes at the start.*
3. **First launch's lines are built on Eid.** *Recommend: re-word them for the Birthday before Mum records them.*

### Design questions
4. **"Hide and seek" in Arc 1:** Find it's Simba round, or a small Who did it? case? *Recommend Find it (it's built).*
5. **Replaying finished content** now the quilt is a bookshelf: does a book replay the arc or chapters? *Recommend: the book opens to its chapters, each replayable.*
6. **The notebook** (dictionary, collection, practice): still wanted? *Recommend: keep it as the "book" button in the nav dock, later.*
7. **Grandparent mode** (the adult plays the shopkeeper) is "the one to protect" in the old design but in no rule. *Recommend: keep it as an idea until Conversations is wired.*
8. **Daily hooks** (a word of the day, one rotating hub): wanted at all? *Recommend: no streaks; at most one gentle "today" hub.*
9. **Busy and Relaxed Cook modes** (a patience timer vs none): gone? *Recommend: gone; timers come from the level.*
10. **Speaking:** always optional? *Recommend yes (never block on recognition).*
11. **Pocket-money receipts** in the old mode designs (+5 ear, +3 craft…): replace them all with the one model (decision 10)? *Recommend yes.*
12. **Cook upgrades with running costs** (a helper with a daily wage): allowed? *Recommend no ("never lose what you earned").*
13. **Hands:** kept only for first-person scenes outside Cook (Find it, the clinic)? *Recommend: parked until a mode needs them.*
14. **The Excel content master:** the editable source for the lexicon, or retired? *Recommend: decide in step 2b; words live in the engine's lexicon.*
15. **Samosa:** does the second kind start once the first count is made (which gives the count away), or with a "next kind" button? *Recommend: the button.*
16. **Maani:** do the dough piles never run out? *Recommend yes.*
17. **Chai art to make:** black-tea glasses, the tipped pan, in-between pan states; the daar ladle came out as a dipper (redo from a photo of a real *kadchi*); the sekelo plate cell. *Recommend: one art batch when Cook is finished.*
18. **The Word copies of Mum's rounds:** does she still read them? *Recommend: yes, keep building them.*

### Older open decisions (from the 25 Sept mode designs; defaults were taken, never confirmed one by one)
21. **Who did it?** Can Nana, Nani or baby Isa be culprits, and Kasuku a silent suspect? A "Prove it" step for 8+, or too school-like? *Recommend: yes to family culprits and Kasuku; Prove it optional at the top level.*
22. **Monsoon rush:** a goat in the kitchen as a joke? Big Ma's song during the leak? *Recommend yes to both.*
23. **The doctor:** what the children call him in the game; does he voice his own lines? *Recommend: his own voice (Round 4 Section G), his family's name for him.*
24. **Snap:** young Nani in old photos? Instant camera or phone? *Recommend: young Nani yes; a phone.*
25. **Which sweets go in Nani's sweet box** (blocks art in three modes). *For Mum.*
26. **Owners:** mehndi (Tidy up or Dress up), "Footprints", "watch the sky". *Recommend: decide when each mode is rebuilt.*
27. **Ungraded creative choices** (Dress up themes, extra placing in Tidy up): OK? *Recommend yes.*
28. **Clothing words** (*topi* or *kofia*) and what the family really wears (blocks Dress up art). *For Mum.*
29. **The rooms in Nani's house** (Monsoon rush, Find it). *Recommend: kitchen, sitting room, Big Ma's room (the 25 Sept default).*
30. **Clinic feelings:** "sad" or "scared", always resolved gently? *Recommend yes.*
31. **Cook timing windows** (boil about 1.2 s, tawa about 0.9 s): too hard for a five-year-old? *Recommend: widen at level 1; check when Cook is finished.*

### Business

19. **Commercial model:** open (decision 7). The landing page needs it first.
20. **Landing page:** whose voices and faces appear first. Hannah's granddad can share it across a community with deep Kutch roots; the trailer is planned "Planet Zoo style" (in-game footage, slow camera, gentle music, no narrator), built in code from the game.
