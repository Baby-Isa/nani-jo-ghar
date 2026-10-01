# Nani jo Ghar: status

The orchestrator updates this file at every milestone and rewrites **Next chat** at the end of every step or gate. Percentages are Claude's estimates. User testing is tracked by Zafar, not here.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (1 Oct 2026, 01:00 UK):**
- **Building is paused** while the project is reorganised (decision log, 30 Sept).
- **Step 1, the "brain" and `CLAUDE.md`, is done** (approved and merged to `main`, 1 Oct):
  - the rulebook, `CLAUDE.md`, the QA checklist, the regression list and the decisions log are done;
  - every doc has moved to the new tree (step 1d).
- **Mum records at 10:00 UK on 1 Oct:**
  - Round 5 of the Questions for Mum is planned but **not written**; it starts only when Zafar says go (about 1.5 hours; plan: `docs/language/sources/round5-plan-notes.md`).
  - The fallback is Round 4 as it is (`docs/language/mum-questions/`).
- **The doctor's visit around 9 Oct** needs only his voice recorded (Round 4 Section G). No clinic build before it.

**Next steps, in order:**
1. **Mum's session.**
2. **Process her recording:** transcribe, cut the clips, update `docs/language/grammar-notes.md`.
3. **Step 2, side by side:**
   - **2a:** the code's target operating model and a gap analysis;
   - **2b:** the language engine design.
4. **Step 3:** refactor into the target model: the live code first, parked modes by decision.
5. **Step 4:** build and fill the language engine, and use it everywhere.
6. **Then:** finish Cook fully, then the clinic games.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` (this "Next chat" section first) and `docs/process/rules.md`. Give me a short plan update, then propose the next step's plan. Don't start anything until I say go.

---

## The plan (agreed 30 Sept)

| Step | What | State |
|---|---|---|
| 1 | The brain: rulebook, `CLAUDE.md`, QA checklist, regression list, decisions log, docs reorganised | **Done** (merged 1 Oct) |
| 2a | Code target operating model: engine core, one scoring model (the three badges), shared UI kit, content as data, modes as plug-ins, a sandbox that plays the real flows, layout lint; then a gap analysis with a sequenced refactor plan and estimates | Next |
| 2b | Language engine design: Grammatical Framework style, the Sindhi resource grammar as template, Mum's answers as the only evidence; the grammar knowledge base; the fill-the-engine rulebook and questionnaire | Next (starts from `docs/language/engine-spec.md` and `docs/language/sources/`) |
| 3 | Refactor to the target model, one session at a time, checked by flow tests and layout lint. Parked modes: decide at 2a whether they move now or when their turn comes | After 2 |
| 4 | Build the language engine, fill it with everything known, use it everywhere | After 3 |
| Docs | The shared design docs are rewritten clean after the target model is approved; each mode's doc is rewritten when that mode is refactored (its "Stale points" box then goes) | With 2a / 3 |
| Then | Finish Cook fully (open regression rows, SEK-09 and the rest), then the clinic games | After 4 |

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
   - the cooking verbs;
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
