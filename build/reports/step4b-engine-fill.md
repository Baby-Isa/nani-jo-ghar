# Step 4b: the engine filled with everything known

Branch `ccr-fcd9dddd-wnywzc`, 5 Oct. No game or source file changed; no `bump_version`, no push to `main`.

## What is in `data/lang/`
**857 entries** (336 confirmed, 163 draft, 358 to record); 153 are fixed expressions made of other words (*kari chai*, *ne poi*). By kind: 338 phrases, 325 nouns, 56 verbs, 40 describing words, 52 postpositions and adverbs. **113 meanings, 112 rules** (38 confirmed, 12 draft, 62 unknown with their questions), 4 exceptions. **593 clip rows** for 395 recordings: 158 words, 258 phrases, 177 sentences the rules build, each exactly what Mum said.

Citations by source: grammar-notes 487, clinic 370, parked modes 166, Cook 106, `lexicon.md` § 6 69, handout 66, conversations and story 38. Cook and clinic ids are aliases; red is *laal*. Data check: 0 errors, 0 warnings.

## The importers
`node build/lang/import_all.mjs` rewrites `data/lang/` and its `reports/` (`--check` only checks). Layers: seed, `hand/` (prose knowledge, each entry citing its section), `import_lexicon_md`, `import_cook`, `import_conv`, `import_clinic`, `import_content` (handout: always draft), `import_modes`, `phrases`, `import_audio` + `attach`. After each round of Mum: add her answers to the notes and `hand/`, rerun, read `source-coverage.md`.

## Tests
`node --test build/lang/`: **56 pass** (34 from 4a, 22 new): re-runnable, 50 golden sentences checked against Mum's recordings, exceptions, elder commands as gaps, every Cook and clinic id resolves, every recording linked or explained, no Kutchi in code or ids. `build/core/` 45 and lint 9 pass.

## Outputs
Gap list `data/lang/reports/gap-list.md`: Cook 4 frames, 20 words to record, 91 missing recordings; clinic 42 frames, 162 words; 71 placeholders the engine already answers. Clash list `clash-list.md`: 42 rows with recommendations. Also `coverage.md`, `source-coverage.md`.

## What the engine could not hold
- The optional *-yu* plural, and *cups* beside *cup*: 7 recordings unlinked.
- Verb forms nobody has said (an elder's command, past with an object): form gaps, never guessed.
- 13 recordings hold two phrases in one take: to split.

## Smallest engine changes
1. `linearize.js` `meaningKey`: names the person actually said and a game's old id by its entry id, so a clip said to an elder never matches the child's.
2. `validate.js`: no plural warning for a fixed expression.
3. `params.json`: `Dem`, `Q`, tense `conj`, case `poss`.

## For the orchestrator
`js/core/settings.js` plans `data/lang/kutchi/…`, 4a and 4b use `data/lang/…`: decide before 4d. Clash list § 4 holds Zafar's calls; `fill-the-engine.md` should now point at the importers.
