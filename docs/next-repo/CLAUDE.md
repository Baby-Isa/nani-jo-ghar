# Nani jo Ghar

A game that teaches children Kutchi through play at Nani's house, voiced only by the real family. A web app, later wrapped for the app stores. The old repository is the playable reference: read it, never copy its code. Full brief: `docs/BRIEF.md`.

## Who decides

Zafar owns it and decides. He is not a programmer.

- **His newest word wins.** Write it into the document it changes ("Zafar, <date>"). There is no decisions log.
- Propose, wait for his go, act. A yes to one thing is not a yes to the next.
- If he didn't comment on it, leave it. Never remove a mechanic without his OK.

## Non-negotiables

1. **Never invent Kutchi; only real family voices ship.** Mum is the authority. The language engine builds every line; if it can't, report the gap. A missing word shows its English in grey italic and joins the recording sheet.
2. **No written English for the child,** except under Nani's lines at the door, on the order card at level 1, the helper card and a tapped word card. Grown-ups' English: the "?" pop-up and the end review.
3. **No winning without the Kutchi** once a word is past support.
4. **Nothing makes a child feel bad.** Progress, not verdicts; no waiting for speech; undo until the step moves on.
5. **The same shared screens and buttons in every mode.** No clipped or cut-off text.
6. **Art is made only in ChatGPT runs Zafar supervises.**
7. **The family's values** (internal; never named in public): halal only, no Hindu religious markers, modest clothing, no sweets as rewards.

## The five documents

| Document | Where |
|---|---|
| Vision and curriculum (grammar ladder, word counter) | `docs/vision.md`, `docs/curriculum/` |
| A game sheet per game (with its "teaches" list) | `docs/games/<game>.md` |
| The standard: "chai's level" | `docs/standard.md` |
| The architecture and the ten coding rules | `docs/architecture.md` |
| Now: the current game and its working list (30 at most) | `docs/now.md` |

Start a chat with `docs/now.md`; open the others when needed.

## How it is built

Three layers, one direction:

1. **Shared kit:** cards, Nani's box, lights, sounds, tray and shelf, the language engine.
2. **Family engine:** runs the round as separate scenes; owns layout, timing and the heat rule.
3. **The game:** a settings file plus its own mechanic, drawn inside its box.

Art by id only. Game rules run without a screen. On screen: the bottom row (only things you pick from), the play area, the serving spot.

## The play loop

1. Build one thing for the current game.
2. Run the check script (`docs/check-script.md`): 5 minutes at most.
3. Send Zafar the link and at most four pictures.
4. He plays and sends a voice note.
5. `/feedback` keeps his words in `docs/feedback/`; one plain line per point joins the working list.
6. Fix and go round again. His next play is the proof.

A check is added only by the rule in that file.

## Working style

- Short, plain replies. No IDs. Hand him exactly what to do.
- Decisions: one numbered list with recommendations ("yes to all except …").
- Every launch states model, effort and cost.
- A separate top-model reviewer reads code against the ten rules; a builder never judges its own work.

## Do not

- Run parallel builders on shared code; one lead owns the engine.
- Add a rule, check, tool or document without replacing one.
- Make a row, a test or a rule from each remark.
- Pass a file-size limit: tidy first.
- Fix in a game what belongs in the engine or kit.
- Work on a game Zafar is not reviewing, or call done what he has not played.
