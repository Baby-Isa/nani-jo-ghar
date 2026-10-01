# Language sources

Outside material about Kutchi grammar, kept for reference. **Nothing here is evidence on its own** (rule G1: Mum is the authority; two AIs agreeing is not evidence). It's used to write sharper questions for Mum, and to check the engine's design against published linguistics.

| File | What it is | Status |
|---|---|---|
| `gemini-blueprint-v1-2026-09-30.md` | Gemini's "Kutchi NLP engine blueprint": agreement paths, pronoun and verb-suffix tables, a Python sketch | AI-generated, unverified |
| `gemini-blueprint-v2-2026-09-30.md` | Gemini's v2: the same paths, plus negation, postpositions, implosives, differential object marking, echo words and a 200-entry lexicon | AI-generated, unverified |
| `research-2026-09-30-grammar-checklist.md` | Claude's research pass: 21 grammar categories with what Mum confirmed, what Sindhi sources predict, and test sentences | Research; forms from outside sources are hypotheses |
| `research-2026-09-30-game-inventory.md` | Every sentence frame, verb, noun and English placeholder the game uses today | Inventory of the code and data |
| `round5-plan-notes.md` | Paused plan for Round 5 of the Questions for Mum | Superseded by `../mum-questions/Questions for Mum (Round 5).md` (step 2b, 1 Oct) |

## What's real behind it

- **Keine, Nisar and Bhatt (2014), "Complete and defective agreement in Kutchi", *Linguistic Variation* 14:2** is a real, peer-reviewed paper ([Benjamins](https://benjamins.com/catalog/lv.14.2.02kei)).
  - **Aspect split:** in present, future and intransitive past sentences the verb agrees with the subject (person, number, gender). In past sentences with an object, agreement is "defective".
  - **Person split:** with an "I/we" subject in those past sentences, the verb agrees with the object instead.
  - This is the single most important rule for the engine to get right. The game says "I made the chai" / "Nani cooked the daar" all the time.
- **Caution:** a related paper by the same group speaks of **"Kutchi Gujarati"** ([GLOW abstract](https://glowlinguistics.org/36/pdf/structural_asymmetries_-_the_view_from_kutchi_gujarati_and_marwari.pdf)). That may be a Gujarati variety spoken in Kutch, not the Sindhi-related Kutchi the family speaks. The agreement split has to be tested with Mum, not assumed.
- **A Grammatical Framework resource grammar for Sindhi exists** (Chalmers thesis; listed in the GF library, [GF RGL publications](https://www.grammaticalframework.org/lib/doc/rgl-publications.html)). It's the planned template for the engine.

## First comparison with what Mum has told us (`docs/language/grammar-notes.md`)

**Matches** (good signs):
- *muke* for "to me" and *toke*;
- *hi* "this" / *hu* "that";
- *ba* "two";
- *-o* he-words become *-a* in the plural (*bateto → bataata*);
- *me* "in";
- *vyo* in *band thai vyo* ("went" as a past form);
- *aayo* "came";
- the future "I will" ending changes for a boy or girl speaker (*kar dos* / *kar dis*; blueprint *-ndos* / *-ndis*);
- *na* before the verb for "don't";
- *mori chai*;
- the oblique *-o → -e* before a postposition (*chokre sathe*).

**Doesn't match the family** (the blueprint is wrong for us, or Gujarati):

| Blueprint | The family says | Source |
|---|---|---|
| *ek* "one" | *hakro* / *hakri* (agrees with gender) | notes §2 |
| three genders (neuter *marchũ*, *keLũ*, *khaaNũ*) | two so far: he-words and she-words; *mirchi* | notes §4–5, decision 5 |
| she-word plurals in *-iyũ* | she-words in *-i* don't change | notes §4 (Mum later noted *-yu* plurals such as *chokriyu*, still open) |
| milk *kheer*, sugar *khand*, lentils *daal*, onion *gandho* | *dudh*, *khun*, *daar*, *dungri* | notes §6–7, B-section |
| water neuter | water and milk are he-words | notes §31 |
| *Kere* = "when", *Kerdhaan* = "where" | *ker* = who, *kida* = where | notes §20 |
| "for" = *-laa* | *lai* | notes §8 |
| "don't want" = *nathi* | *na khape*; "none left" *ki baki nai* | notes §11, §14 |
| *v-* at the start (*vado*, *vañ*) | *w-* at the start (*wadho*) | rule G4 |
| *traN* "three", *panch* "five" | handout *trae*, *panj* (unconfirmed) | lexicon |

**New to us, worth testing:**
- the past-tense agreement split;
- the oblique form of plurals;
- "from" (*maadhã*?);
- animate objects taking *-ke* ("call the boy" = *chokre ke sad*?);
- compound verbs (*khai …* "eat it all up");
- echo words (*chai-vai*);
- the pronoun set (*aaũ*, *asĩ*, *aĩ*, *heo*);
- the formal "you" taking a plural verb (Mum already said elders get the plural, notes §21).

**Not needed:**
- **Implosive consonants (ɓ ɗ ʄ ɠ):** real in Sindhi and probably in Kutchi, but we record people rather than synthesise speech. They matter only if a spelling convention needs them.
- **The Python sketch:** too simple to use (its paths B and C compute the same thing). The engine will follow the Grammatical Framework design instead.

## How it's used

Step 2b (1 Oct) turned this material into `../grammar-kb.md` (what's known, hypothesised and unknown), `../engine-design.md`, `../fill-the-engine.md` and Round 5, `../mum-questions/Questions for Mum (Round 5).md`.

1. **Round 5 of the Questions for Mum** turns each "new to us" item into short natural sentences that settle it: minimal pairs such as "I (boy) ate the samosa / I (girl) ate the samosa / I ate the chapati / Nani ate the samosas".
2. **The engine spec** (step 2b) takes the feature model (person, number, gender, aspect, formal "you") from the paper and the Sindhi grammar, then fills it only with what Mum confirms.
3. **Blueprint words never go into the game** unless Mum says them.
