# Questions for Mum: which rounds are answered, and where the answers live

> **Stale points (the rulebook, `docs/process/rules.md`, wins).**
> - Older rounds say "Claude drafts Kutchi from the handouts and dictionary for you to confirm": drafts are only ever flagged unconfirmed; Mum is the authority and two AIs agreeing is not evidence (G1, G21, non-negotiable 4).
> - Older rounds mention an ear star or voice star, TTS placeholders or English on screen: those are overridden (decisions 1–2, G14, E1).
> - Round 4 and the others are a **record**: don't edit their questions. Answers are written into `grammar-notes.md`, `lexicon.md` and `data/family-audio.json`; since 5 Oct each answered row's Notes column only says answered / partly / not answered, with a pointer to the notes.
> - Round 5 (1 Oct) is the step 2b elicitation questionnaire, ordered by what each answer unlocks for the engine; its plan notes are `../sources/round5-plan-notes.md`.

Recordings are cut into clips and indexed in `data/family-audio.json` (question ids such as R1, K1, S1, P1, C1). Zafar marks each line heard / clear / ⚠ in the right-hand columns of the round.

| Round (file here) | Date | What it covered | Status | Where the answers live |
|---|---|---|---|---|
| Round 1 | 23 Sept | Grammar patterns and a first word list | **Superseded** by Combined; nothing answered here (all its questions reappear in Combined) | n/a |
| Round 2 (Cooking) | 24 Sept (Part 6 added 25 Sept) | The 16-dish list, dish names, "Part 5: check what we've guessed" (handout words) | **Superseded** by Combined | The dish table is for `game-design/modes/cook.md` (future dishes); the Part 5 handout words are in `../lexicon.md` § 2 as *unconfirmed, confirm with Mum* |
| Combined, for the visit | 25 Sept | Sections A and B (the heart: about 18 minutes); C onwards carried to Rounds 3 and 4 unchanged | **Sections A and B answered** (25–26 Sept) | `../grammar-notes.md` §1–§28 |
| Round 3 | 26 Sept (answered 28 Sept) | Parts 1–4 and Section C1–C21 | **Answered** (28 Sept). Sections G, E, F, H, D, I, J **not** answered here; re-issued in Round 4 | `../grammar-notes.md` §29–§37 (the 28 Sept recording); Zafar's ✓/⚠ marks per line (R1–R12, K1–K15, S1–S9, P1–P13, C1–C21) are **only kept in table form inside this file**; clip ids in `data/family-audio.json` |
| **Round 4** (`.md` and the `.docx` Mum reads) | 28 Sept | The live round: Cook first (Parts 1–3), then the grammar sentences (Section C from C22), then Part 4, Sections I, E, G, F, H, J | **Partly answered (5 Oct):** Section C22–C79 and Section I1–I35 (each row marked in the Notes column). Parts 1–4, C80–C154, I36–I39 and Sections E, G, F, H, J are still open. **Section G is the doctor's script**, to record with Mum's and Zafar's help (~9 Oct) | `../grammar-notes.md` §38–§55, `../lexicon.md` §6, clips in `data/family-audio.json` (source `sources/audio/mum-2026-10-05/`) |
| **Round 5** (`.md` and the `.docx` Mum reads) | 1 Oct | The step 2b questionnaire: re-takes, Cook orders as whole sentences ("with", "and", "but no"), noun genders, numbers, Nani's cooking lines, the Birthday, then the Section C grammar core; new IDs L1–L93, the "one/two" words as M1–M9 | **Live; for Mum's 1 Oct session** | To be written into `../grammar-notes.md`, `../lexicon.md` and `../grammar-kb.md` |

## Word copies

`Questions for Mum (Round 4).docx` is the copy Mum reads; it sits beside its `.md`. The Word copies of Round 3 and Combined are in `docs/archive/language/` and can be regenerated with `build/build_mum_questions_docx.js`. **Open question for Zafar:** does Mum still open the Word files? If so, regenerate from the `.md`; if not, the `.docx` can stay archived.

## How the rounds are answered (the method, unchanged)

Mum records one long voice file; before each part she says its name and each line's number; word lists are said twice (🎤 words three times), sentences once. Zafar types what she said beside each question and sends it back to her to check.
