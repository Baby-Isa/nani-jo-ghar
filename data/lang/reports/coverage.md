# Coverage: what the engine holds (step 4b)

Built by `node build/lang/import_all.mjs`. The data check: 0 errors, 0 warnings.

## Lexicon

976 entries (153 are fixed expressions made of other words).

| By part of speech | Entries |
|---|---|
| Phrase | 443 |
| N | 331 |
| V | 61 |
| A | 40 |
| Adv | 27 |
| Post | 26 |
| Num | 10 |
| Pron | 9 |
| PN | 9 |
| Q | 7 |
| Dem | 4 |
| Intj | 4 |
| Conj | 2 |
| Gen | 1 |
| Cop | 1 |
| Link | 1 |

| By status | Entries |
|---|---|
| to-record | 468 |
| confirmed | 344 |
| draft | 164 |

| By source (an entry can cite several) | Citations |
|---|---|
| grammar-notes | 498 |
| data/clinic* | 482 |
| parked modes | 166 |
| data/cook.json | 119 |
| lexicon.md §6 | 69 |
| data/content.json (handout) | 65 |
| conversations / story | 39 |
| other | 29 |
| decisions / rulebook | 8 |

## Grammar

5 word classes (paradigms); 124 meanings; 123 rules (38 confirmed, 22 draft, 63 unknown, asking Mum); 10 exceptions.

## Recordings

481 distinct recordings in data/family-audio.json (459 with a file). 653 rows in clips.json: 158 word forms, 258 fixed phrases, 237 sentences the rules build. 34 recordings are not linked (clash list § 6).

## Games

Game lines registered: 425 (cook 113, clinic 219, and 93 in the conversations, the story and the parked modes). Placeholders the engine can already answer: 75.

## Sources loaded, and sources deliberately not

Loaded: data/cook.json, data/stations/*.json, data/content.json, data/clinic.json, data/clinic/lang.json, data/clinic/pipeline.json, data/clinic/heal/*.json, data/conversations/lines.json, data/story/first-launch.json, the parked modes' data (dress, who, relations, monsoon, snap, tidy, find), docs/language/lexicon.md §6 (the tables), docs/language/grammar-notes.md and grammar-kb.md (by hand, each entry citing its section), the 5 Oct report, data/family-audio.json.

Not loaded as Kutchi (rule G1: two AIs agreeing is not evidence): the Gemini blueprints, Claude's grammar checklist, the Sindhi and Gujarati comparisons in grammar-notes, the 'Claude's check' paragraphs, the agreement paper, and `Mum yes-no list (2026-10-05).md`. They shaped the questions, never the data. data/cook-tts.json and data/monsoon-audio.json (the same 186 keys) are test-only text-to-speech indexes (rule G14): they are checked against the lexicon, not loaded.

