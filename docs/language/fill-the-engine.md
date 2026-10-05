# Filling the language engine: the companion rulebook

How a session adds words, forms and rules to the language engine, how the engine asks Mum for what it lacks, and how her answers get in. The engine itself is `engine-design.md`; what it knows today is `grammar-kb.md`.

The rules themselves live in `docs/process/rules.md` § 8 and are linked here by ID, not restated: **G1** (Mum is the authority), **G2** and **G3** (gaps and drafts), **G4** (spelling), **G9**–**G13** (the engine), **G14** and **G16** (voices and recording practice), **G18** (nouns carry gender, singular and plural), **G21** (handouts), **G24** and **G25** (the family's spellings; provisional words).

---

## 1. Evidence: what may go into the data

| Source | Status it can give a form | Example |
|---|---|---|
| Mum said it in a recording, and Zafar has checked the spelling | `confirmed` | *hakro / hakri* (grammar-notes §2) |
| Mum said it, spelling only Whisper's (⚠ in grammar-notes) | `draft` (G3) | *thorok*, before Zafar's 26 Sept check |
| Zafar said it, as a decision or correction | `confirmed`, source "Zafar, date" (newest word wins, CLAUDE.md) | *chundo* (grammar-notes, Zafar's corrections to Section B) |
| Masi, as the dialect tie-break | `confirmed` for the tie it settles (G1) | |
| Mum's own general rule (e.g. "unknown gender: use the he-form") | a **default**, always reported as a gap too | grammar-notes §24 B4, §37.5 |
| Pattern from Mum's other words ("-o he-words make -a") | `draft` for a new word, until she says that word | the plural of a new -o he-word, before Mum says it |
| Class handout, Freelang, the Excel's drafts | `wanted` with a **hint that never ships** (G21) | *panj* (handout only) |
| Sindhi or Gujarati grammars, GF-Snd, Keine et al., Gemini, Claude | **nothing.** Only a question for Mum (G1) | Sindhi *chokran* |

Two AIs agreeing is not evidence (G1). A form from the last three rows never appears in game text, even flagged.

## 2. How to add things

Every change cites its source in `src` (a grammar-notes section, a clip `qid`, or "Zafar, date"). A form without a source fails validation.

### 2.1 A word

1. Check it isn't there already: search `lexicon.json` (by gloss and alias), `data/family-audio.json` and `lexicon.md`.
2. Add one entry: `id` (`n.` noun, `a.` adjective, `v.` verb, `num.`, `pron.`, `adv.`, `post.`), `lemma`, `gloss`, `pos`, `paradigm`, `gender` (`null` if unknown, never guessed: G18), any irregular `forms`, `status`, `src`.
3. If gender, plural or oblique is unknown, add an `ask` entry naming the question that will settle it (or leave it for the gap reporter to write one).
4. Log it in `lexicon.md` (one line: word, gloss, source, status).
5. Run the tests ([§ 6](#6-tests-to-run)).

### 2.2 A form or a paradigm

- **One word's odd form** (*chokre* before *sathe*): put it in that word's `forms`; don't change the paradigm.
- **A pattern** that holds for **every** word Mum has said in that class (-o → -a): set the paradigm cell to `confirmed` with all the examples as sources.
- **A tendency** with exceptions: leave the paradigm cell `unknown` and set forms per word. Never promote a tendency to a rule. (The old example, the oblique -e, *chokre* but *ambo*, was largely settled by Mum on 5 Oct, grammar-notes §41 and §49: the cell is now a `draft` default with the two 28 Sept exceptions to recheck.).
- A new paradigm needs at least two of Mum's words in it.

### 2.3 A syntax rule or a new meaning

1. Start from Mum's sentence, not from English. Write the rule's slots in the order she said them.
2. If the meaning is new to the game, add it to `abstract.json` with `elicit` sentences (natural English, the way Round 5 is written). Keep the abstract small: reuse a core function where one fits. A new domain meaning is a design change: say so in the session report for the orchestrator to put to Zafar.
3. Add golden tests: each of Mum's sentences that the rule covers, meaning in → her words out.
4. A rule Mum hasn't given yet stays `status: unknown` with `ask` IDs. Never write a rule from a Sindhi or Gujarati pattern (G1).

### 2.4 Never

- Never write Kutchi in game code; frames, forms and rules live in data (G13).
- Never hand-fix a line in a mode's data to make it sound right (G9): fix the engine's data, or report the gap.
- Never fill a gap with a guess to make a screen look finished: the gap shows as grey-italic English "to record" (G2).
- Never change a recording to match the engine, or the engine to match one bad recording (G12): if they disagree, ask Zafar which is right.

## 3. The loop: from gaps to Mum and back

1. **The engine lists what it needs.** Run the gap reporter (`engine-design.md` § 10). It writes the next questions, ordered by how often the game needs each answer, in the "Questions for Mum" format, with new IDs continuing the L series.
2. **The orchestrator shapes the round:** keeps Round 4's "How to answer" section, adds re-takes and "stop here" marks, keeps the core to about 60–75 minutes, and builds the Word copy with `build/build_mum_questions_docx.js`. Zafar approves before Mum sees it.
3. **Mum records** one long take, saying each ID (G16). Word lists three times, sentences once.
4. **The recording is cut and transcribed** (`build/transcribe_family.py`), and the clips go into `data/family-audio.json` with their `qid`. Zafar marks each clip OK / ?? in `lab/family-audio.html`; only OK clips ship (G16), and unchecked clips play only in test builds. Keep Whisper's word timestamps for each clip, so read-along can underline word by word inside whole phrases (`engine-design.md` § 9).
5. **A fill session** writes what Mum said into `grammar-notes.md` (a new dated section: the recording, a table of ID / English / what Mum said / confidence, then "What this means for the engine"), updates `lexicon.md`, then the engine data (§ 2), then the tests. Each new data row cites the new grammar-notes section.
6. **Re-run** the tests, the gap reporter and the phrase-frequency list. The session report lists: gaps closed, gaps still open, new gaps (Mum's answers often open new questions), and which game lines now speak Kutchi.

## 4. Recordings and the engine

- Recording never changes the engine (G12). A recording is attached to the meaning it says by adding a `meaning` key (and `tokens`) to its `family-audio.json` entry (`engine-design.md` § 5.5).
- To attach one: linearize the meaning; if the engine's text equals the clip's `kutchi` (normalised), add the key. If not, the grammar or the transcript is wrong: check the clip, then ask Zafar.
- Whole-phrase recordings are requested from the phrase-frequency list, not chosen by hand.
- Cut word clips from Mum's sentences where possible, as well as from word lists; the clip planner prefers in-sentence clips.

## 5. Drafts and flags

- A form whose source is ⚠ (Whisper's hearing) is `draft` and shows with the draft flag (G3). It stops being a draft only when Zafar confirms the spelling; record the date in its `src`.
- An unknown form is not a draft: it's a gap, shown as grey-italic English "to record" (G2).
- A Mum-default (unknown gender → he-form) renders normally but is reported as a `feature` gap every time, so it gets asked. The risk is that a wrong gender is heard until Mum answers, so put the most-heard defaulted nouns at the top of the next round.
- `wanted` words (from the Excel or the handouts) carry their `hint` for the questionnaire writer only. They are never rendered.

## 6. Tests to run

After every fill change (all Node, seconds):

1. data validation (every form has a source; no Sindhi or hypothesis values used);
2. golden sentences (Mum's sentences come out word for word);
3. gap tests (things still unknown come back as gaps, not text);
4. recording round-trip (each clip with a `meaning` key says what the engine says);
5. the no-Kutchi-in-code lint;
6. a simulation smoke run, with the gap count in the report.

Then the usual QA for any screen whose lines changed (`docs/process/qa-checklist.md`), including listening to the assembled lines.

## 7. A fill session's report

In `build/reports/<name>.md`: the recording(s) used; new grammar-notes sections; words and rules added (with sources); gaps closed and opened; golden tests added; the new top of the phrase list; anything Zafar must decide (as a numbered list with a recommendation each).
