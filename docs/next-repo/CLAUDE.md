# Nani jo Ghar

A game that teaches children Kutchi through play at Nani's house, voiced only by the real family. A web app (GitHub Pages), later wrapped for the app stores. The old repository is the archive and playable reference: read it, never copy its code.

## Who decides

Zafar owns it and decides. He is not a programmer.

- **His newest word wins.** Write it into the document it changes, in the same commit ("Zafar, <date>"). There is no separate decisions log.
- Discuss first: propose, wait for his go, act. A yes to one thing is not a yes to the next.
- If he didn't comment on it, leave it. Never remove a mechanic without his OK.

## Non-negotiables

1. **Never invent Kutchi; only real family voices ship.** Mum is the authority. The language engine builds every line from recorded words; if it can't, report the gap. A missing word shows its English in grey italic and goes on the recording sheet.
2. **No written English for the child,** except under Nani's lines at the door, on the order card at level 1, the helper card and a tapped word card. Grown-ups' English: the "?" pop-up and the end review only.
3. **No winning without the Kutchi** once a word is past support: not by reading, matching, patterns or waiting.
4. **Nothing makes a child feel bad.** Progress, not verdicts; no waiting for speech; undo until the step moves on.
5. **The same shared screens and buttons in every mode.** No clipped or cut-off text.
6. **Art is made only in ChatGPT runs Zafar supervises.** Claude plans, he runs and approves, Claude cuts and wires.
7. **The family's values** (internal; never named in public): halal only, no Hindu religious markers, modest clothing, no sweets as rewards.

## The five documents

| Document | Where |
|---|---|
| Vision and curriculum (word targets, grammar ladder, the counter) | `docs/vision.md`, `docs/curriculum/` |
| One game sheet per game (what it is, its mock-up, its "teaches" box) | `docs/games/<game>.md` |
| The standard: "chai's level", one page, his words | `docs/standard.md` |
| The architecture: one page, with the ten coding rules | `docs/architecture.md` |
| Now: the current game and its working list (30 items at most) | `docs/now.md` |

Each is one page. Start a chat with `docs/now.md`; open the others when a task needs them.

## How it is built

Three layers, one direction (`docs/architecture.md`):

1. **Shared kit:** cards, Nani's box, lights, sounds, tray and shelf, the language engine.
2. **Family engine:** runs the round as separate scenes; owns layout, timing and the heat rule.
3. **The game:** a settings file plus its own mechanic, drawn inside its box.

Art is called by id only. Game rules run without a screen.

## The play loop

1. Build one thing for the current game.
2. Run the check script (`docs/check-script.md`): one run, 5 minutes at most.
3. Send Zafar the link and at most four pictures.
4. He plays and sends a voice note.
5. `/feedback` keeps his words in `docs/feedback/` and adds one plain line per point to the working list.
6. Fix and go round again. His next play is the proof.

A new check is added only by the rule in `docs/check-script.md`.

## Working style

- Short, plain replies. No IDs to remember. Hand him exactly what to do.
- Decisions as one numbered list with recommendations ("yes to all except …").
- Every launch states the model, the effort and the cost.
- A separate reviewer on the top model reads code against the ten rules. A builder never judges its own work.

## Do not

- Run parallel builders on shared code. One lead owns the engine.
- Add a rule, a check, a tool or a document without removing or replacing one.
- Make a fix-list row, a test or a rule from each remark.
- Go over the file-size limits: tidy first, then add.
- Patch a game to fix what belongs in the engine or the kit.
- Work on a game Zafar is not reviewing now.
