# Step 2b: language engine research and design

1 Oct 2026. Docs only; drafts committed to the branch for review.

## What I produced

- `docs/language/mum-questions/Questions for Mum (Round 5).md`: **Round 5 for Mum**, in Round 4's format (Word copy tested). Cook first, then the Birthday, then the grammar core; about 70–75 minutes with "stop here" marks; re-takes and the sweet box included; no Section G, clothes or first-launch lines.
- `docs/language/grammar-kb.md`: 30 features, each KNOWN / HYPOTHESIS / UNKNOWN, with the lines that need it and the settling question.
- `docs/language/engine-design.md`: architecture, data formats, the API (§ 6, for step 2a), statistics, gaps, the Excel, tests, migration, effort.
- `docs/language/fill-the-engine.md`: adding words and rules, evidence, the loop to Mum and back.
- Pointers added to `engine-spec.md` (Status) and `sources/README.md`.

## Key recommendations

- **GF's design, not GF's toolchain.** Abstract meanings plus a Kutchi concrete grammar, all in JSON, run by a small JavaScript engine. Why: the GF compiler can't be installed in our sessions, GF has no place for per-form status and sources, and the Sindhi grammar's forms contradict the family's. The abstract syntax stays GF-compatible, so real GF remains possible later.
- **Gaps, never guesses:** gaps become Mum's next questions automatically; recordings attach to meanings, so recording never changes the engine.

## Decisions for Zafar

1. Build the engine as a GF-style JavaScript engine reading grammar data, not real GF. *Recommend yes.*
2. Use Round 5 for Mum's next session instead of Round 4. *Recommend yes.*
3. Retire the Excel as a source; import its rows once as "wanted" words. *Recommend yes.*
4. Unknown gender: say the he-form (Mum's own rule) rather than an English placeholder. Downside: a wrong gender can be heard until Mum answers; mitigation: every defaulted noun is flagged in the gap report and listed for Mum. *Recommend yes.*
5. Add a `meaning` key to clips in `data/family-audio.json`. *Recommend yes.*
6. About 20 minutes of whole-phrase recording, chosen by simulation; two takes of the top lines. *Recommend yes.*
7. Step 4 as four sessions (engine core first; fill and simulator in parallel; Cook migration last). *Recommend yes.*

## Open risks

- The past-tense agreement split is still unknown (C123–C136).
- `family-voice.js` still plays unchecked clips (rule G16); the engine plays only OK ones.
- Many known forms are Whisper spellings until Zafar checks them.
- Blocked by the proxy: the Keine paper, the Sindhi thesis, grammaticalframework.org, UniMorph.
