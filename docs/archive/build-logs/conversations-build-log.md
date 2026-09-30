# Conversations MVP: build log

Branch `claude/conversations-mvp` (from `claude/nifty-rubin-c0d431`). Design: `docs/game-design/modes/conversations.md` (§10a overrides).

## 26 Sept 2026
- Started. Read the handover, the design (all of it, §10a), UX §14, the grammar notes, save.js, story.js (its `choice` kind already does the §14 shake + 4 cycling reactions: embarrassed, scratch, puzzled, sigh; the module reuses those names), character.js (gender = `Save.get("character").choices.body`), family-audio.json (86 Mum + 87 Zafar clips).
- §10a applied to the MVP lines: goodbye is *Khuda-fis!* (replaces *Achija* everywhere); thanks is the English "Thank you!" (replaces *Aabhar aanjo*); *aai* for anyone older (older cousin included), *tu* for same age or younger.
- Data: `data/conversations/{lines,exchanges,speakers,placements}.json`. Chains live inside placements (`CL1.chain`), so no separate `chains.json` for the MVP.
- Engine `js/shared/conversations.js`: pure half (resolve, answers, machine/step, allow, pick, update, migrateCook) + bubbles (maybe, run, hear, play). R4/R5 (speaking) are capped to R3 in the bubbles until Say.moment + family speech templates are wired.
- Register balance is kept across sessions (`state.reg`), not per session: per session let "longest/always formal" reach 55.7% on the clinic's 4-elder/2-child bench. Now every blind strategy is at 50% or below.
- Variety beats the first-meeting salaam (the same exchange never twice in a row, §6.5), as the design says.
- Tests: `node --test build/test_shared_conversations.mjs`: 23 pass. All shared tests: 106 pass.
- Bubbles + lab `lab/conversations.html` (linked from `labs.html`). A second tap during the preview playback is queued, not dropped (a quick child's tap-tap was being ignored). A bubble with no room above the head hangs below it.
- Browser smoke `node build/test_conversations-browser.mjs`: all pass at 1366x768 and 390x844 (the §14 shake/buzz/4 reactions/ask-again, throb after 2 wrongs, the bulb, the skip hand, register logged, FL2–FL8 incl. the dodging No, Cook's day with the frequency rule declining extras, the clinic morning). Screenshots in `build/reports/conversations-mvp/`.
- Wiring doc `docs/game-design/modes/conversations-wiring.md`: exact hooks and snippets for FL2–FL8 (a `talk` field on story scenes + a small helper in story.js), CK1/CK2/CK7/CK9/CK11 (flow.js, chai-tray.js), CL1/CL2/CL3/CL9 (run.js, waiting.js, sendoff.js). Notes: the clinic has no family patients yet (CL3 waits on that); FL7 recommended to stay on the story's Yes/No until line 8 is recorded; the first-ever ghost finger is built into the module (not Onboard.run, which blocks taps outside its light).
- Report: `build/reports/conversations-mvp.md`. Done.
