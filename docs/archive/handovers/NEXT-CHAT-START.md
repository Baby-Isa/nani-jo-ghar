# Start here: the next orchestrator chat (written 30 Sept 2026, evening)

**Settings for this chat:** Opus 5.5 · **plan mode** (nothing is changed until Zafar approves a plan) · **high** effort.
**First message to send:** "Read `docs/archive/handovers/NEXT-CHAT-START.md` and `docs/process/rules.md`, then propose step 1's plan."

---

## 1. Zafar's aim (his words, 30 Sept)
> "A beautifully organised, clear, logical, modular, scalable code base that modern agile software development would class as best practice, which allows quick development, which allows global changes to take place rapidly, which allows this review system to work much better: you can play the game inside your test sandbox and have a checklist (words clipping, spacing, padding, all the standard things)."

> "There should be one tightly reviewed, not too long rule set… some of these rules I'm giving you throughout the whole thing then need to be in one place, and the reviews need to be in one place."

> On the language engine: build it properly: "the lexicon, the morphology rules, the syntax rules… once you understand the grammar you can create sentences from the rules… if you need to know how to say 'make me rice and curry' you just need to ask to fill in the words for rice and curry and you should know how to say the rest."

## 2. Why we paused all building
- **Regressions he had already reported kept coming back.** For example, the pantry's "Bring me these" headline and its growing highlighted row are clipped at the card's edge (re-found 30 Sept, 18:00 UK).
- **Lines aren't proper sentences.** The pantry says *khun, ne daar, ne dudh* with no verb. Where a Kutchi frame isn't known, sessions produced fragments instead of admitting the gap.
- **Legacy code leaks into decisions.** The end screen shows three badges (time, accuracy, hints), but the code still scores "craft/ear/no-help stars" underneath, so sessions reason with a model the player never sees.
- **Rules are scattered.** They sit across ~99 docs, three handover files and per-session prompts. **There was no `CLAUDE.md`,** so no session loaded them automatically.
- **Process failures by the previous orchestrator:**
  - it launched sessions while Zafar was still discussing;
  - it let rule departures through (English instruction text in the clinic's help);
  - it missed overnight check-ins;
  - it didn't re-check the pantry after Cook changes.
- **Size:** ~59k lines of JavaScript in 211 files, 143 build and test scripts, 13 HTML pages, 99 docs.

## 3. The working agreement (in force now, before `CLAUDE.md` exists)
1. **Discussion first. Never start agents or sessions while Zafar is discussing.** Propose, wait for an explicit go, then act. Approval for one thing isn't approval for the next.
2. **One step at a time.** Each step ends with a deliverable Zafar reviews and approves before the next begins.
3. **Nothing reaches Zafar that breaks a written rule.** The QA checklist and its automated checks run first, and the orchestrator reviews screenshots itself.
4. **The rulebook is `docs/process/rules.md`** (de-duplicated, grouped, 16 top rules; Zafar's 30 Sept answers applied). It is the basis for `CLAUDE.md` in step 1. The full rule list with sources is `docs/process/rules-harvest.md`.
   - **Sources:** all four orchestrator chats (hub 1, 2, 3 and 4; the older chats' own harvests are `docs/process/rules-harvest-orch1/2/3.md`), plus the handover docs, the UX and QA docs and the feedback decisions. All merged 30 Sept.
   - **Contents:** 264 rules, 33 of them tagged *[old chats only]*, a conflicts table, and a candidate core of 40 lines for `CLAUDE.md`.
   - **Conflicts:** all resolved by Zafar on 30 Sept (see the decisions log at the end of `rules.md`). Still open: the commercial model, and whether *mirchi* has a plural (Mum to confirm).

## 4. The agreed plan (Zafar approved the sequence, 30 Sept)

### Step 1: the orchestrator's "brain" (docs and rules), then `CLAUDE.md`
It isn't the code structure. It's where the project's rules, decisions, design and checklists live.

**The target structure,** from the best-practice research (Claude Code memory guidance, living game design documents, architecture decision records):

| File / folder | Holds |
|---|---|
| `CLAUDE.md` | The working agreement and non-negotiables: under 150 lines, plain imperative sentences, `@path` imports to the detailed docs. Every session loads it automatically |
| `docs/README.md` | The index: one line per doc, saying what it's for |
| `docs/vision.md` | Pitch, target audience, **design pillars (the tie-breakers)**, out of scope |
| `docs/game-design/` | Story arcs, world and characters (the cast), progression and scoring, and one file per game mode (purpose, mechanics, levels, speaking points) |
| `docs/design-language/` | Art bible and art pipeline, UI design system (tokens, components, layout), UX principles, tone of voice (Nani's voice, on-screen text), audio |
| `docs/language/` | Engine spec, grammar knowledge base (what's known, source, confidence), elicitation method and Mum's question lists, the lexicon (the Excel's role) |
| `docs/architecture/` | The code's target operating model, conventions, testing strategy |
| `docs/process/` | Session brief template, **QA checklist = definition of done**, art how-to, rules-harvest |
| `docs/decisions.md` | One running log: date · decision · why · link. It replaces the scattered "Zafar's answers" sections |
| `docs/status.md` | Tracker and roadmap |
| `docs/feedback/` | Play-test notes as they arrive, processed into decisions and backlog |
| `docs/ideas.md` | The parking lot |
| `docs/archive/` | Everything superseded, **moved, never deleted** |

**The QA checklist ties to the design docs.** Every *checkable* rule in the design-language docs gets an ID and one checklist line, marked **automated** (a test) or **by eye**. The design docs say *why*; the checklist says *how we check*. Standard examples: text clipping or overflow, padding and spacing, minimum text size, one look per button, no English in first-time help, input live while speech plays, take-back until Done.

**How archiving works** (Zafar: "don't be too quick to dismiss previous handover documents… check them before archiving"):
1. Build a table: **every doc → keep / merge into X / archive**, with a one-line reason.
2. Before archiving anything, check it for rules, decisions and design content. Harvest what's there into the new docs, and note the harvest in the table.
3. **Zafar reviews the table** before anything moves. Anything ambiguous stays put and is asked about.
4. Use `git mv` into `docs/archive/` so history is kept. Nothing is deleted.

**Deliverables for Zafar's review:** the mapping table, a draft `CLAUDE.md`, and a draft QA checklist. Then carry them out.

### Step 2, two read-only strands that can run side by side

**(a) Code target operating model, then gap analysis.**
1. Start from what the game must achieve:
   - the arcs: the Birthday first, then day-out trips, then standalone arcs;
   - the modes and the mechanics underneath them;
   - per-word progress (`understand_stage` / `produce_stage`);
   - speech, story and the language engine.
2. Design the ideal architecture:
   - an engine core (language, progress/save, audio/speech);
   - a shared game framework (UI kit, **one** scoring model matching the three badges, onboarding, input, layout);
   - content as data;
   - modes as plug-ins with one standard interface;
   - tooling: **a sandbox that plays the real flows including the lab pages**, layout linting (overflow, spacing, padding), screenshot review against the checklist.
3. Then map today's code against it: duplicates, legacy systems (the stars, old art paths, stubs, per-mode copies), dead code, conventions.
4. **Output:** a target-architecture doc plus a gap analysis with a sequenced refactor plan and effort estimates, for Zafar's approval.

**(b) Language engine: research and design.** Zafar's requirements:
- **Standard, not bespoke.** Use the established approach: **Grammatical Framework**. One shared *abstract syntax* holds the meanings ("request items", "want X with Y but no Z", "N of X"). A *concrete grammar* for Kutchi holds the lexicon, morphological paradigms and syntax rules. **There's a published GF resource grammar for Sindhi**, and Kutchi is very close to Sindhi (often classed as a dialect of it), so use it as the template and confirm the differences with Mum. The core engine shouldn't be heavily customised.
- **The engine generates every word and every sentence** from its rules and lexicon. Frames aren't hand-written; common patterns come *from* the rules.
- **A companion rulebook covers "how to fill the engine".** When it lacks a rule or word, the engine outputs what's needed: a list of phrases for Mum to say, such as "one boy / two boys, one girl / two girls", "big boy / big girl", "bring me / give me". She fills in the grammar without ever seeing a table (field-linguistics paradigm elicitation). Needed verbs and nouns are listed the same way. Cover gender, number, possession (*jo/ji/ja*), polite forms, numbers and counting, negation (*na*), lists and "with", postpositions and word order.
- **Recording is separate and never changes the engine.** Near the end, simulated play-throughs give frequency statistics, and the most frequent lines get recorded whole so they sound human. Everything else is assembled from recorded parts (the fallback).
- **Inventory first:** which verbs, frames and word classes the game actually uses today (probably a small set).
- **Decide the Excel's role** (`content/Nani jo Ghar - Content Master.xlsx`: scene word lists, a draft vs a mostly-empty confirmed column, carrier-sentence formulas). The game doesn't read it today. Should it become the editable source for the lexicon and paradigms?
- Known grammar lives in `docs/language/grammar-notes.md`, the four "Questions for Mum" rounds and the family recordings (`data/family-audio.json`).
- **Output:**
  - the engine design;
  - the grammar knowledge base (known / unknown);
  - Mum's elicitation questionnaire, ordered by how much each answer unlocks;
  - the fill-the-engine rulebook.

  All for Zafar's approval.

### Step 3: refactor to the target model
Sequenced sessions, **one at a time**, each checked by the new flow tests and layout lint. Shared pieces have one owner.

### Step 4: build the language engine and populate it with everything known, then use it everywhere
**After this, feature work resumes.**

## 5. Current state (30 Sept, 18:30 UK)
- **Live** at https://baby-isa.github.io/nani-jo-ghar/:
  - **Cook:** all six stations on v3 (chai, maani, chaat, daar, samosa, sekelo; reports `build/reports/<station>-v3.md`), plus the v3.1 art and follow-ups (`build/reports/art-v3-1.md`).
  - **Clinic:** v2 prototypes with Zafar's play fixes (`build/reports/clinic-v2-fixes.md`).
  - The clinic's item art is cut but not wired (`assets/clinic/items-v2/`).
- **Known open bugs:**
  - pantry card clipping (headline and growing row);
  - pantry and other lines are fragments (the language issue);
  - the shared end screen's word tile overflows (*fudino ji chutney*);
  - tiny chip words on phone.
- **Open decisions** (from the v3 reports):
  - samosa: the second kind starts once the first count is made (this gives the count away), or a "next kind" button?
  - samosa: the second kind's count heard-only from L3?
  - maani: should the piles never run out? And X12, the headline repeating its row;
  - the daar ladle came out as a dipper: redo with a photo of a real *kadchi*?
  - chai art needed: black-tea glasses, the tipped pan, in-between pan states;
  - sekelo: the "four skewers" plate cell has five sticks;
  - the clinic end screen gets "Again / All patients" (agreed, not yet built).
- **Dates and outside commitments:**
  - **The clinic's doctor (Hannah's granddad) visits ~9 Oct**: record his voice (Round 4 Section G) and show him the game. **Decide early how the pause and refactor fit around this date.**
  - Mum's recording session (the elicitation questionnaire from step 2b should feed it).
  - Landing page and trailer after the clinic art; pricing is an open question (`docs/status.md` 5a–5c).
  - The Cook speaking pilot (`docs/game-design/speaking.md`, approved).
- **Paused sessions:** none running. The regression-audit and language-engine sessions started at 17:20 were stopped at Zafar's request before making any change.

## 6. Where things are today (until step 1 reorganises them)
- **Rules harvest:** `docs/process/rules-harvest.md`.
- **Status:** `docs/status.md`.
- **Design:**
  - `docs/design-language/ui-design-system.md`, `docs/design-language/ux-principles.md`, `docs/archive/process/VISUAL-QA.md`;
  - `docs/archive/design-v1/Roadmap and Story Structure.md`;
  - Art Bible, Cast, Game Design, Technical Plan, all under `docs/Nani jo Ghar — *.md`.
- **Feedback:** `docs/feedback/cook-playtest-2026-09-29.md`, `docs/feedback/clinic-playtest-2026-09-29.md`.
- **Modes:** `docs/modes/*.md`.
- **Language:** `docs/language/grammar-notes.md`, the "Questions for Mum" rounds, `content/…Content Master.xlsx`, `data/*.json`.
- **Shared code API:** `docs/architecture/shared-api.md`.
- **Earlier handovers,** to check before archiving: `docs/archive/handovers/ORCHESTRATOR-HANDOFF.md`, `docs/archive/handovers/HANDOVER-2026-09-26.md`, `docs/archive/handovers/HANDOVER-2026-09-29.md`, `docs/archive/handovers/MORNING-SUMMARY.md`, `docs/archive/handovers/overnight-queue.md`.

## 7. Cost and effort
- Zafar is conscious of token use.
- Read-only design and audit work is cheap; build sessions with browser tests are the expensive part.
- Run one step at a time, and give an estimate before each launch.
- Art stays in ChatGPT via Claude in Chrome (free), unless there's a reason to prototype quickly and Zafar can't respond, **and** it costs under $2.
