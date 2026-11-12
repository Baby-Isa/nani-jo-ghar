# The language engine: a map

For Zafar: how one sentence gets built, and which picture fits. Picture: `build/reports/language-engine-map.html`. Scores: `grammar-kb.md`. Full design: `engine-design.md`, `engine-spec.md`.

## Which picture fits

**Layers, like an assembly line. Not a hub with spokes.**

A sentence is built in six steps, always in the same order, and each step needs the one before it. The engine cannot choose *khapeti* over *khapeto* until it knows whether the thing is a he-word or a she-word. A gap low down shows at the top as grey English.

The hub picture is right about one thing. The engine's own code holds no Kutchi (a test checks this). Everything it knows sits in data files beside it. So the knowledge is in boxes, and the building happens in layers.

Context (polite, or to a child) is not a box. It is a note that travels with the request and changes which form a step picks.

## The six steps

| Step | What it is | Where it lives | Today |
|---|---|---|---|
| 1. The meaning | What a game wants said, with no Kutchi in it: "in my chai, two sugars". Technical name: an *abstract function*. | `data/lang/abstract.json` | 159 meanings |
| 2. The context | Who is speaking (boy or girl), to whom (child or elder), polite or everyday. | sent with the request | |
| 3. The sentence pattern | The order of the slots for that meaning, and its polite version. Technical name: a *concrete rule*, or linearisation. | `data/lang/concrete.json` | 158 patterns: 38 confirmed, 25 draft, 95 not known yet |
| 4. The word store | Each word once, with he-word or she-word, its plural and any odd forms. Regular endings sit in five word-class tables. Technical names: the *lexicon* and *paradigms*. | `lexicon.json`, `paradigms.json` | 1,218 words: 344 confirmed, 209 draft, 665 English only |
| 5. The form rules | Each slot picks the right form of its word: matching another word (*agreement*), the form before "in" or "with" (the *oblique*), child or elder (*person*), polite or everyday (*register*). | inside the patterns and the tables | scored in `grammar-kb.md` |
| 6. The voice | The family recording: Mum's whole sentence where she recorded one, otherwise her words one by one. | `clips.json`, `data/family-audio.json` | 568 recordings |

**When something is missing, the engine never makes Kutchi up.**

- A missing word or pattern comes out as its English, in grey italic.
- An unknown gender takes the he-form (Mum's rule) and is flagged.
- Every gap, a missing recording too, goes onto Mum's next sheet (`data/lang/reports/gap-list.md`).

## One sentence, step by step

***Munji chai me ba khun wijij.*** "In my chai, put two sugars, please." (Mum, 12 Nov, at 12:36.)

- **Step 1, the meaning.** The game asks for "want in": the container is chai, the thing is two sugars.
- **Step 2, the context.** Polite.
- **Step 3, the pattern.** Five slots: my, container, in, thing, verb. The polite version ends "put, please"; the everyday version ends *khape*. That split is Mum's: "you wouldn't say I want two sugars; you'd say put two sugars in."
- **Steps 4 and 5, the words and their forms:**

| Word | What supplied it |
|---|---|
| *munji* | "My", matched to the container. Chai is a she-word, so *munji*, not *munjo* (agreement; possession). |
| *chai* | The word store. Before "in", a she-word keeps its form (the oblique). |
| *me* | "In". It goes after its noun (word order; postpositions). |
| *ba* | Two. Only "one" changes for he-words and she-words (numbers). |
| *khun* | Sugar, counted, so the plural form. For *khun* that is the same word (plural). |
| *wijij* | "Put in", in its polite form (commands; politeness). |

- **Step 6, the voice.** Mum recorded this whole sentence. Whole-sentence clips stay switched off until the pre-publish pass, so today it plays word by word: Mum's *chai*, *me*, *ba* and *khun*. *Munji* and *wijij* have no clip of their own yet, so the engine lists them to record.

**Change one thing and the other words follow.**

- Everyday, not polite: the last word becomes *khape*.
- One sugar: *ba* becomes *hakro*, because sugar is a he-word.
- A word with no Kutchi, such as green pepper: *Munji chai me ba* green peppers *wijij*, the English in grey, and a report: "no Kutchi yet for green pepper".
- A he-word container, such as a cup: the engine stops and asks, because Mum has not said that sentence.

## How complete it is

`grammar-kb.md` scores 30 areas of grammar out of 100, each with what is left. The average is 73 today, and was 66 before Mum's 12 Nov session. Where Kutchi has no such thing (no "the" or "a"), the area is complete: a known answer.

- **Strongest:** "the" and "a" (100), "I'd like" (90), word order (90).
- **Weakest:** the past, "came" and "went" (40); the past with an object, "ate" and "made" (50); telling an elder or several children to do something (50).

Vocabulary has a coverage figure, not a score: of the 73 words the kitchen games use, 71 have a Kutchi word, 46 are recorded, and none is approved for the app stores yet.

The scores are re-made after every recording session (`/mum-round`).
