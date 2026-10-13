# W2: Mum's words showing and playing

**Cook (done).** The samosa and daar stations looked up guide keys `samosa:fill|fold|fry` and `daar:chop|cook`, which didn't exist. I added them in `data/cook.json`, pointing at W1's lines (fill, fold, fry, chop, add). No code changed. Shots: samosa fill shows *Bhar!*, fold shows *Samosa waar!*. Daar: Nani's own line holds the box in every shot, so the chop/cook text isn't seen, though its key resolves.

**Clinic.**
- Fever "just right" now says Mum's *barabar* (her clip plays in the sound run).
- Ear and foot still show English placeholders: `js/clinic/heal/games/ear.js:96` (`HS.ph("ear")`) and `foot.js:99` (`HS.ph(temp)`) hardcode them, so no data edit reaches them. Needs a clinic owner to use the `body-ear`, `feel-hot`, `feel-cold` words.
- "I'm too hot / too cold" stay placeholders (whole sentences, not *garam* / *thundo*).

**Red (decision 32).** Zafar: *laal*. Clip files `lal*.mp3` → `laal*.mp3`, ids and Kutchi fields in `family-audio.json`, `clinic.json`, lexicon, grammar-notes/kb, the 5 Oct report, decision 30. `col-red` / `red` already said *laal*. Left alone: old question sheets and `docs/language/sources`, plus the handout word *lal marcha* in `data/cook.json`, `content.json` and `audio-manifest.json` (audio-keyed; not part of W1). Zafar to say if those change.

**Proof.** Sandbox laptop run on cook:samosa, cook:daar, heal ear/fever/foot: all end, 0 page errors, 1 finding (canvas-text-small, in the baseline's kind). The browser crashed once; resumed. Run before the rename.
