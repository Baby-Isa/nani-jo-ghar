# Step 2b: language engine research and design

1 Oct 2026. Docs only; nothing committed.

## What I produced

- `docs/language/elicitation-questionnaire.md`: **Round 5 for Mum**, in Round 4's format (Word copy tested). Cook first, then the Birthday, then the grammar core; about 70–75 minutes with "stop here" marks; Round 4 IDs reused, new ones L1–L92; re-takes and the sweet box included; no Section G, clothes or first-launch lines.
- `docs/language/grammar-kb.md`: 30 features, each KNOWN / HYPOTHESIS / UNKNOWN, with the game lines that need it and the question that settles it.
- `docs/language/engine-design.md`: architecture, data formats, the API (§ 6, for step 2a), frequency statistics, gaps, the Excel, tests, a worked example, migration, effort.
- `docs/language/fill-the-engine.md`: adding words and rules, evidence, the loop to Mum and back.
- Pointers added to `engine-spec.md` (Status) and `sources/README.md`.

## Key recommendations

- **GF's design, not GF's toolchain.** Abstract meanings plus a Kutchi concrete grammar, all in JSON, run by a small JavaScript engine. The GF compiler can't be installed in our sessions, its browser runtime is unmaintained, GF can't represent "unknown form", and the Sindhi grammar's forms contradict the family's; its feature model is the checklist.
- **Gaps, never guesses:** gaps become Mum's next questions automatically; recordings attach to meanings, so recording never changes the engine.

## Decisions for Zafar

1. Build the engine as a GF-style JavaScript engine reading grammar data, not real GF. *Recommend yes.*
2. Use Round 5 for Mum's next session instead of Round 4 (the rest of Round 4 becomes "if there's time"). *Recommend yes.*
3. Retire the Excel as a source; import its rows once as "wanted" words. *Recommend yes.*
4. Unknown gender: say the he-form (Mum's own rule) but always list it for Mum, rather than showing an English placeholder. *Recommend yes.*
5. Add a `meaning` key to clips in `data/family-audio.json`. *Recommend yes.*
6. Start with about 20 minutes of whole-phrase recording, chosen from the simulation; two takes of the most frequent lines. *Recommend yes.*
7. Step 4 as four sessions (engine core first; fill and simulator in parallel; Cook migration last). *Recommend yes.*

## Open risks

- Joined word clips may sound choppy; the fix is more whole recordings.
- The past-tense agreement split is still unknown (C123–C136).
- Many known forms are Whisper spellings until Zafar checks them.
- Blocked by the proxy: the Keine paper, the Sindhi thesis, grammaticalframework.org, UniMorph.
