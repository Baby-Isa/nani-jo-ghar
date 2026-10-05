# Coverage: what the engine holds (step 4b)

Built by `node build/lang/import_all.mjs`. The data check: 0 errors, 0 warnings.

## Lexicon

943 entries (153 are fixed expressions made of other words).

| By part of speech | Entries |
|---|---|
| Phrase | 419 |
| N | 330 |
| V | 56 |
| A | 40 |
| Post | 26 |
| Adv | 26 |
| Num | 10 |
| PN | 9 |
| Pron | 7 |
| Q | 7 |
| Dem | 4 |
| Intj | 4 |
| Conj | 2 |
| Gen | 1 |
| Cop | 1 |
| Link | 1 |

| By status | Entries |
|---|---|
| to-record | 444 |
| confirmed | 336 |
| draft | 163 |

| By source (an entry can cite several) | Citations |
|---|---|
| grammar-notes | 487 |
| data/clinic* | 457 |
| parked modes | 166 |
| data/cook.json | 110 |
| lexicon.md §6 | 69 |
| data/content.json (handout) | 66 |
| conversations / story | 38 |
| other | 16 |
| decisions / rulebook | 7 |

## Grammar

5 word classes (paradigms); 114 meanings; 113 rules (38 confirmed, 12 draft, 63 unknown, asking Mum); 4 exceptions.

## Recordings

417 distinct recordings in data/family-audio.json (395 with a file). 593 rows in clips.json: 158 word forms, 258 fixed phrases, 177 sentences the rules build. 30 recordings are not linked (clash list § 6).

## Games

Game lines registered: 389 (cook 96, clinic 201, and 92 in the conversations, the story and the parked modes). Placeholders the engine can already answer: 71.

## Sources loaded, and sources deliberately not

Loaded: data/cook.json, data/stations/*.json, data/content.json, data/clinic.json, data/clinic/lang.json, data/clinic/pipeline.json, data/clinic/heal/*.json, data/conversations/lines.json, data/story/first-launch.json, the parked modes' data (dress, who, relations, monsoon, snap, tidy, find), docs/language/lexicon.md §6 (the tables), docs/language/grammar-notes.md and grammar-kb.md (by hand, each entry citing its section), the 5 Oct report, data/family-audio.json.

Not loaded as Kutchi (rule G1: two AIs agreeing is not evidence): the Gemini blueprints, Claude's grammar checklist, the Sindhi and Gujarati comparisons in grammar-notes, the 'Claude's check' paragraphs, the agreement paper, and `Mum yes-no list (2026-10-05).md`. They shaped the questions, never the data. data/cook-tts.json and data/monsoon-audio.json (the same 186 keys) are test-only text-to-speech indexes (rule G14): they are checked against the lexicon, not loaded.

