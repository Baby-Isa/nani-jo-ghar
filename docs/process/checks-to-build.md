# Checks to build

Rules become code (decision 99): each item below is a check that will make a rule run itself, so nobody has to remember it. Build them in order, one at a time, each with a test; when a check lands, its rules' text below goes and the check's name goes in `docs/tools.md`. Sorted by Fable on 13 Oct (`build/reports/rules-sort.md`). Built in Sprint 6: 1 red-then-green gate (`evidence.mjs --apply`, `build/tools/review/data/verdict-log.jsonl`), 2 publish gate (`build/tools/ops/publishgate.mjs`), 3 zero tolerance (`STRICT` in `build/sandbox/lib/baseline.mjs`); 9, 10, 11, 13, 17, 18, 21 in `build/lint/static.mjs`; 19 the leak bots at every level in `checks.mjs`; 22 doc guards in `docs.mjs` (limits, and every path a live doc names exists); 23 the unpushed hook blocks at 45 minutes, and `docs.mjs` holds each Sprint 6+ report to 300 words of prose with its proof (today's debt in `build/lint/static-known.json`: it may only shrink).

## The list, ranked by mistakes prevented

| # | Check | What it checks | Where | Size | Retires | Guards (open rows) |
|---|---|---|---|---|---|---|
| 6 | **Card-row contract check (contract-18)** | A card row ticks only after the Lifecycle logs that step closed (Cook `cook-done:<kind>`, heal `step:<step>`), never on the count alone (L1 counted rows may turn gold at the count: D5); a finished item folds to one gold line; no row changes its words mid-round; at L2+ the next row appears and its tool glows after the count. | `contract.mjs` reading the contract probe's card samples + Lifecycle log | L | E11, E36, F9 (fold), decision 52, 57, R1 (guide-and-card) | SH-10, SEK-13, DAAR-19, DAAR-23, CLN-131, CLN-141 |
| 20 | **Input-live contract check (contract-21)** | A tap during a line acts within 150 ms (the host logs `onActDuringSpeech`; the clinic and Cook log the tap and the state change); a line replay never blocks input. | `contract.mjs` | S | E5, INT-01 (the eye half) | — |

## The rules these checks replace (word for word, until their check exists)

- **`docs/status.md` is the master tracker:** update it at every milestone, structured by story arc, artwork as its own section (basic → initial → full → final), user testing left out. (A15)  → **CODE-TO-DO 22 + DOC**
- **A new chat opens with a plan update** after reading `CLAUDE.md`, then `docs/status.md` (its "Next chat" section first) and only the rulebook sections and mode doc the work needs; it reads reports, never transcripts, and `ux-principles.md`, `grammar-notes.md` and `ideas.md` only when the task touches them. (A15, A28)  → **CODE-TO-DO 22 + DOC**
- **Babysit at the start:** every spoken line is also written and underlined as it's said. (E3, E4)  → **CODE-TO-DO 4**
- **The request card appears over the play area, read aloud, then shrinks into the sidebar;** read-along underline wherever a line is spoken. (E4)  → **CODE-TO-DO 4**
- **From level 3, cards are closed;** peeking costs a hint. (F9, H22, H34)  → **CODE-TO-DO 21 + DOC**
- **The order model everywhere:** person → items → parts, max three tiers, Kutchi number words, lower case, no full stop; rows and the spoken sentence share one data source and order. (F9, F10)  → **CODE-TO-DO 21 + DOC**
- **"Don't" rows are dashed with a no-sign;** finished items fold to a gold line; sequences look the same everywhere, never numbered; the next piece wears the one focal highlight (one colour, one thing lit at a time across card and stage: SH-53, decision 95), never a grey fill or alternating tints. (F9, decision 95)  → **CODE-TO-DO 21 + DOC**
- **The counting rule:** at every level Nani says the order at the start and the speaker replays it on demand. L1: the card writes the quantity in Kutchi words and Nani counts along aloud as the child works; L2: the card still writes it, no counting along; L3+: nothing written and no counting along, only the spoken order (replayable). Say the number with the item; no tallies except chai's sugar. Every station follows it, daar's chop card included. (E12, decision 41)  → **CODE-TO-DO 7**
- **Rows tick when that step closes** (put down, finished, served); at L1 a counted row turns gold the moment the count is reached (D5); a number is written the first times it is heard, at any level. (E11, decision 57)  → **CODE-TO-DO 6**
- **Cut with `build/cut_tick_v2.py`'s method,** check every cut zoomed on cream, export trimmed WebP with a 16 px pad; never key magenta out of metal, glass or glow. (D7, D22)  → **CODE-TO-DO 16 (pad, WebP) + DOC**
- **Greetings are learned by watching:** visible gestures (wave, hand out), small pictures on answer pills, the meaning said once in spoken English in story mode; never written. (G15, G22, decision 58)  → **CODE-TO-DO 4 (half) + DOC**
- **Never show English or pictures where the task is understanding Kutchi;** one place for a word's text at a time; pictures are fine for speaking prompts. (G22)  → **CODE-TO-DO 4 (half) + DOC**
- **Nothing leaves the device:** no accounts, uploads or analytics; speech recognition on-device only. (J1)  → **CODE-TO-DO 17 + DOC**
