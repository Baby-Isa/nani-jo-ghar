# E1: the engine shows guessed forms as drafts

**Cause:** `noun.o-he` cells (`pl.dir` etc.) carry no gender in their key, so the defaulted gender never reached the plural; *chunda*, *bataata* came out confirmed.
**Fix:** a paradigm made for one gender now says so in data (`gender` on `noun.o-he`/`noun.i-she`, in `data/lang/test-seed/paradigms.json`, which the importer copies). `inflect` marks a form built from such a paradigm for a noun with unknown gender (and not equal to the recorded lemma) as draft; `linearize` and the single-word path set `defaulted`, status draft and the gender gap. Line status = weakest part (already `worst`).
**Tests:** new golden test in `build/lang/engine.test.mjs` (chunda, bataata draft; billy-goat plural and recorded singular confirmed). `node --test build/lang/`: 57 pass.
**Importer:** rerun and `--check`: 0 errors. Gap list: the potato gender gap now lists 4 Cook lines (was 2); clinic: 0 lines change.
**Fast checks:** checks.mjs, leak_cook, clinic leaks A/B/C: pass.
Note: `data/lang/test-seed/` was touched (two lines), not `seed/`.
