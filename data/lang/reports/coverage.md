# Coverage: what the engine holds (step 4b)

Built by `node build/lang/import_all.mjs`. The data check: 0 errors, 0 warnings.

## Lexicon

1214 entries (162 are fixed expressions made of other words).

| By part of speech | Entries |
|---|---|
| Phrase | 536 |
| N | 442 |
| V | 66 |
| A | 51 |
| Adv | 29 |
| Post | 28 |
| Num | 17 |
| PN | 16 |
| Pron | 9 |
| Q | 7 |
| Dem | 4 |
| Intj | 4 |
| Conj | 2 |
| Gen | 1 |
| Cop | 1 |
| Link | 1 |

| By status | Entries |
|---|---|
| to-record | 663 |
| confirmed | 381 |
| draft | 170 |

| By source (an entry can cite several) | Citations |
|---|---|
| grammar-notes | 520 |
| data/clinic* | 482 |
| other | 247 |
| parked modes | 166 |
| data/cook.json | 125 |
| lexicon.md §6 | 69 |
| data/content.json (handout) | 65 |
| conversations / story | 39 |
| decisions / rulebook | 11 |

## Grammar

5 word classes (paradigms); 159 meanings; 158 rules (38 confirmed, 26 draft, 94 unknown, asking Mum); 9 exceptions.

## Recordings

568 distinct recordings in data/family-audio.json (546 with a file). 742 rows in clips.json: 186 word forms, 291 fixed phrases, 265 sentences the rules build. 63 recordings are not linked (clash list § 6).

## Games

Game lines registered: 562 (cook 124, clinic 219, and 219 in the conversations, the story and the parked modes). Placeholders the engine can already answer: 78.

## Sources loaded, and sources deliberately not

Loaded: data/cook.json, data/stations/*.json, data/content.json, data/clinic.json, data/clinic/lang.json, data/clinic/pipeline.json, data/clinic/heal/*.json, data/conversations/lines.json, data/story/first-launch.json, the parked modes' data (dress, who, relations, monsoon, snap, tidy, find), docs/language/lexicon.md §6 (the tables), docs/language/grammar-notes.md and grammar-kb.md (by hand, each entry citing its section), the 5 Oct report, data/family-audio.json.

Not loaded as Kutchi (rule G1: two AIs agreeing is not evidence): the Gemini blueprints, Claude's grammar checklist, the Sindhi and Gujarati comparisons in grammar-notes, the 'Claude's check' paragraphs, the agreement paper, and `Mum yes-no list (2026-10-05).md`. They shaped the questions, never the data. data/cook-tts.json and data/monsoon-audio.json (the same 186 keys) are test-only text-to-speech indexes (rule G14): they are checked against the lexicon, not loaded.

