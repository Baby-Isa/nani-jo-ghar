# s11-step0: the shared pieces for "easy to play, easy to learn"

Branch `worktree-agent-a976bd8b388e1261d` (from `ccr-1888a520-dk18y7` at 1c90f0e), not pushed. Rapid-prototype proof (Zafar, 22 Oct).

## What changed
- **Word card** (`js/shared/word-card.js`, `css/shared/word-card.css`): `WordCard.card` / `.row` / `.pop`; four fixed slots faded by stage (English at 3, picture at 4, Kutchi text at 5; speaker always); eye reveal is free and logged as a cue. API at the top of the file.
- **Progress**: support gains `english`, `kutchiText` (picture now blank at 4); `P.reveal(id, slot)` never advances.
- **Onboarding**: `Onboard.demo` (the real item moves and returns), `Onboard.spot`, `Onboard.stuck` (0/5/15 s rungs on NaniGuide's idle clock).
- **No Next**: `NjgButtons.next` (and Kit.button's non-Done path) is never drawn and presses itself a beat after it shows; `NjgButtons.moveOn` is the hook.
- **Play log** (`PlayLog` in onboard.js, named by host.js): rounds per player in the save's `playlog` namespace (privacy lint forbids raw localStorage); `lab/play-log.html`.
- **Door** cards on `WordCard.card`; **labs** New player toggle with badge; **leak** `--save learned` default; **art** s11 plan, spec, block.

## Open / for others
- `cook:mishkaki-grill` stops in 1 of 2 runs: the sandbox Cook player waits for a `#go-btn` that already pressed itself (`build/sandbox/lib/cook-player.mjs:432`; or Cook's expect stops naming it). Not mine to edit.
- `js/core/save.js` NAMESPACES should list `playlog`. Pages wanting the card must load `word-card.js/.css` (door imports it).
- Check to build: the card's English (`[data-word-en]`) shows only at stages 1-2 or after a reveal.

## Proof
- `checks.mjs`: unit 512/0, words, static, leak (19), bump, specs, docs, fixlist, recordings, size, load 29/29: green.
- Leak: every config green on the learned save, Cook's browser bot too; clinic at `--rounds 100` (as checks.mjs).
- Unit: `build/test_shared_word_card.mjs` (8), `build/host/labs.test.mjs` (5); `check_onboard.mjs` ok.
- Sandbox `s11-step0-touched3` (15 Next-using flows, 1366x768, `--contract`): 0 breaks, 0 new findings, 14/15 end (grill above).
- Shots, `build/screenshots/s11-step0/` (1366x768 and 1480x924): `word-card-stages-*`, `word-card-revealed-*`, `rungs-filmstrip-*`, `door-new-*`, `door-stage4-*`, `labs-toggle-off-*`, `labs-toggle-on-*`, `launch-new-player-*`, `play-log-after-chai-*`. Not judged by me.
