# Conversations MVP: report (26 Sept 2026)

**Built** (branch `claude/conversations-mvp`, new files only, plus one link in `labs.html`):
- `js/shared/conversations.js` + `css/shared/conversations.css`: the engine and the bubbles (§8.5 API: `maybe`, `run`, `hear`). It covers §14 (shake, buzz, 4 cycling embarrassed looks, ask again until right), §10a frequency and skips, aai/tu, Kasuku repeat-only, and the Zafar/Mum reply voice. Tracking goes in Save `conversations`.
- `data/conversations/`: 9 exchanges, 15 placements, the speakers, and the lines (Khuda-fis and "Thank you!" per §10a).
- `lab/conversations.html` and `docs/game-design/modes/conversations-wiring.md` (hooks for all 15; nothing wired yet).

**Placeholders** (untested, grey italic):
- "Will you help me cook?" (E5)
- "Do you know who I am?" (E8)
- "Big Ma!"
- *Chamchi kida ai?* (word order to confirm)
- "Mmm, lovely chai!"

The salaam pair is Zafar-decided (§10a.2), not yet recorded.

**Mum still needs to record:**
- *Salamun alaykum!*, *Wa alaikum salaam!*, *Khuda-fis!*
- *Ki ai?*
- *Tu muke {daar, maani, chaat, samosa, mishkaki} banai dinda?*
- *Muke chai / paani / dudh khape.*, *Na, na khape.*
- *Chamchi kida ai?*
- *beta*
- the five placeholders above, and the names Nana, Nani and Ali

Everything else plays her or Zafar's existing clips.

**Tests:**
- `node --test build/test_shared_conversations.mjs`: 23/23 pass. All shared tests: 106/106.
- Leak bot: every blind strategy is at 50% or below on S2 register moments.
- `node build/test_conversations-browser.mjs`: all pass at 390×844 and 1366×768. Screenshots are in `build/reports/conversations-mvp/`.
