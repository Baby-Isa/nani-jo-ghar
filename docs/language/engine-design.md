# Language engine: design (for Zafar's approval)

Step 2b, 1 Oct 2026. Read-only research and design; nothing is built until Zafar approves (step 4). Requirements: `engine-spec.md`. What the engine knows: `grammar-kb.md`. How to fill it: `fill-the-engine.md`. Mum's next questions: `mum-questions/Questions for Mum (Round 5).md`.

Rules this design serves: G1 (never invent Kutchi), G2–G3 (gaps are grey-italic placeholders; drafts are flagged), G9 (every line a full natural sentence), G10 (standard, researched build), G11 (filled from Mum's sentences), G12 (frequent phrases recorded whole; recordings never change the engine), G13 and G18 (no Kutchi grammar in code; nouns carry gender, singular and plural), G14 (only family voices ship), F10 (card rows and the spoken sentence share one source).

**Boundary with step 2a.** Step 2a (the code architecture) decides **where** the engine sits: its folder, how pages load it, how modes import it. This file owns the engine's **internals, data formats and API**. File names below (`data/lang/…`, `js/shared/lang/…`) are placeholders until 2a places them. The API is in its own section, [§ 6](#6-the-api-game-code-calls), for 2a to link to.

---

## 1. In one page

- **What it does.** Game code asks for a *meaning* ("this customer wants two samosas with mince, no chilli"). The engine returns the Kutchi sentence as tokens and text, plus a **clip plan** (which family recordings to play: a whole-phrase recording where one exists, otherwise one recording per word), or a **gap** saying exactly what it doesn't know yet ("how to say *with* for food: ask L22–L23").
- **How it's built.** The Grammatical Framework (GF) way: one **abstract syntax** (the meanings, shared by every language) and one **concrete grammar** for Kutchi (lexicon, paradigms, and syntax rules that say how each meaning is put into words). All of it is **data** (JSON). The code is a small, general linearizer (*linearize* = turn a meaning into words) that contains no Kutchi.
- **The recommendation on GF itself.** Use GF's **design**, its categories and its vocabulary, but **not the GF toolchain**, and use the Sindhi resource grammar as a **checklist of features, not as code**. Run a small GF-style engine in plain JavaScript that reads the grammar data. Reasons in [§ 2](#2-research-and-the-recommendation): the GF compiler can't be installed in our build sessions, GF has no place for per-form status, sources and question IDs (which "report the gap" needs), and the Sindhi grammar's forms contradict the family's. GF's own JavaScript runtime and its way of marking missing forms would work; we keep the abstract syntax GF-compatible so moving to real GF later is a port. This is a deliberate push-back on "use the Sindhi resource grammar as the template"; Zafar decides (decision 1 in `build/reports/step-2b.md`).
- **Recording never changes the engine.** Recordings are indexed by the meaning they say. The engine always builds the sentence; the clip planner then picks the best family recordings to say it.
- **Frequency decides what Mum records whole.** A simulation plays every mode thousands of times, counts which phrases a child hears most, and ranks them by "hearings saved per second of Mum's time".
- **Gaps become Mum's next questions** automatically, in the Round 5 format, ordered by how often the game needs each one.
- **The Excel retires** as a source (0 confirmed words in it today); its useful rows are imported once as "wanted" words.
- **Step 4 effort:** about four build sessions plus one review, then a short fill session after each of Mum's rounds ([§ 15](#15-effort-for-step-4)).

---

## 2. Research and the recommendation

### What GF is

Grammatical Framework is an open-source grammar formalism from Chalmers (Ranta and colleagues). A grammar has an **abstract syntax** (categories and functions that stand for meanings, e.g. `Order : Person -> Dish -> Utt`) and one **concrete syntax per language** (a `lincat` says what features a category carries, a `lin` says how a function becomes words). Grammars compile to **PGF**, a portable format that runtimes in Haskell, C, Python, Java and JavaScript/TypeScript can linearize and parse ([PGF paper, Chalmers](https://research.chalmers.se/publication/131252); [gf-core runtimes](https://github.com/GrammaticalFramework/gf-core/tree/master/src/runtime)). The **Resource Grammar Library (RGL)** gives ready-made morphology and syntax for about 71 languages (`gf-rgl/languages.csv`), under LGPL or BSD, the user's choice ([licence](https://raw.githubusercontent.com/GrammaticalFramework/gf-rgl/master/LICENSE)).

### The Sindhi resource grammar

- Jherna Devi's 2012 Chalmers master's thesis, "Implementing GF Resource Grammar for Sindhi" ([Chalmers ODR record](https://odr.chalmers.se/handle/20.500.12380/163234); the page itself was blocked by the proxy, the record was seen in search). It's in the RGL as `src/sindhi` (25 modules: `ResSnd`, `MorphoSnd`, `ParadigmsSnd`, `NounSnd`, `VerbSnd`, `SentenceSnd`, `LexiconSnd` and the rest), compiled with the "All" and "Try" modules, with a synopsis ([directory](https://github.com/GrammaticalFramework/gf-rgl/tree/master/src/sindhi)).
- **Its feature model** (from `ResSnd.gf`): `Gender = Masc | Fem`; number `Sg | Pl`; `Case = Dir | Obl | Voc | Abl`; `PPerson = Pers1 | Pers2_Casual | Pers2_Respect | Pers3_Near | Pers3_Distant`; `Agr = Ag Gender Number PPerson`; `NPCase = NPC Case | NPObj | NPErg` (an *ergative* case: the special subject form in past sentences with an object); verb forms by tense × person × number × gender; 14 noun classes (`mkN01`…`mkN14` in `MorphoSnd.gf`, e.g. class 1 is *chokro*). Its strings are Sindhi in Arabic script.
- **What's useful:** the feature model is almost exactly what the family's Kutchi shows so far: two genders, a direct/oblique split, respect as its own person (*tu* / *aai*), near and far "this/that" (*hi* / *hu*), and room for an ergative subject. It's a very good **checklist**, and `grammar-kb.md` uses it that way.
- **What's not:** the forms. The family says *chokra sathe* where Sindhi predicts *chokran*; *hakro / hakri* where Sindhi has *hiku*; *ba* and *trae*; she-plurals usually short (*maani*, not *-iyun*) (`sources/README.md` "Doesn't match the family"; `grammar-kb.md` features 2, 3, 7). Reusing `MorphoSnd` means rewriting nearly every paradigm, in a script we don't use, to match one family. And the RGL's value (hundreds of constructions) is mostly unneeded: the game uses about 20 sentence types (`sources/research-2026-09-30-game-inventory.md` §1).

### How to run it offline in the browser (and later in Capacitor)

| | A. Real GF: `.gf` source → PGF / JS / JSON → a GF JavaScript runtime | B. GF-style engine in JS reading grammar data (**recommended**) |
|---|---|---|
| Standard? | The standard toolchain | GF's architecture, categories and terms; our own ~600–900-line linearizer |
| Build tools | The GF compiler (Haskell). In our cloud sessions GitHub release binaries are blocked (HTTP 403) and `ghcup` is blocked; building GF from Hackage with GHC from apt might work but is untested, slow and large (checked 1 Oct) | None: plain JSON and JS; Node for tests |
| Browser runtime | Two exist. gf-core's own JavaScript runtime (`gf -make -output-format=js` plus `gflib.js`, in `gf-core/src/runtime/javascript`), and its successor `gf-typescript` (JSON grammars), whose README says it is "not actively maintained … really only useful for smaller grammars" ([repo](https://github.com/GrammaticalFramework/gf-typescript)). Our grammar is small, so either would run it. Neither is on npm | Our code, no dependencies |
| Offline / Capacitor | Works (static files) | Works (static files) |
| Bundle size | Runtime plus a compiled grammar; size not verified (couldn't build one here) | Estimated 20–30 KB of JS plus 50–150 KB of JSON data (estimate, not measured) |
| Unknown forms | GF can mark a missing form: `nonExist` (or empty `variants {}`) makes linearization fail or show a marker for that form. What it has no place for is **metadata per cell**: confirmed vs draft (⚠), the source (grammar-notes §), and which Mum question settles it. We'd keep those in a side file and join them back after linearizing | Every cell carries its status, source and `ask` ID; an unknown cell returns a **gap** naming the question |
| Clip plans | Plain linearization returns a string; GF's bracketed linearization (where the runtime offers it) shows which function made which words, but mapping that back to lexicon cells and clips is our own code | Every token carries its lexicon entry and form, so clip planning and read-along underlining are direct |
| Mum's answers going in | Edit `.gf`, recompile with a toolchain sessions can't run | Edit a JSON row; tests run in Node at once |
| Maintained by future Claude sessions | Needs GF fluency and the toolchain in every session | JSON with a schema and validation; small, readable code |
| Parsing (text → meaning) | Yes | No (not needed: speaking uses closed sets, `docs/game-design/speaking.md`) |

**Recommendation: B, on balance.** The deciding reasons are three: the GF compiler can't be installed in our build sessions (so no session could change the grammar and test it), GF has no place for per-cell status, sources and question IDs (the heart of "report the gap"), and the Sindhi RGL's forms contradict the family's, so we'd rewrite its morphology anyway. GF's runtime and its handling of missing forms are **not** reasons: both would work.

**What we lose by not using real GF:** the compiler's type checking of the grammar (we replace it with a schema check and golden tests, § 12), parsing (not needed today), the RGL's ready-made syntax for constructions we haven't met yet, and the GF community's tools. **How we keep the door open:** the abstract syntax is kept GF-compatible (GF category names, functions with typed arguments, no JS-only features), so a session with the GF toolchain can export `abstract.json` to a `.gf` abstract and the Kutchi data to a concrete grammar, and check it in real GF.

Keep GF's design so it stays "standard, not bespoke" where it matters:

1. the abstract/concrete split, with GF names for the categories (`N`, `A`, `V`, `V2`, `NP`, `CN`, `VP`, `Cl`, `Imp`, `Utt`) and RGL-style core functions (`DetCN`, `AdjCN`, `ComplV2`, `PredVP`, `ImpVP`, `UseN`…);
2. an **application grammar** on top (the game's meanings, such as `Order` and `Fetch`), defined as combinations of the core, which is exactly how GF apps use the RGL;
3. the RGL Sindhi feature model as the parameter set;
4. feature labels written in the cross-language UniMorph style (`sg`, `pl`, `obl`, `imp`, `neg`…; the UniMorph site was blocked by the proxy, so cited from the research pass only).

If the game ever needs parsing, or the grammar grows past about 100 meanings, or GF becomes installable in our sessions, revisit option A; the GF-compatible abstract syntax makes that a port, not a rewrite.

**Option C (author in GF, compile to JSON, our own runtime)** keeps the toolchain problem and adds a converter; not recommended.

---

## 3. The architecture

```
 game code ──meaning (abstract tree) + context──▶  ENGINE  ──▶ tokens, text, segments, clip plan
                                                    │          or gaps
         abstract.json   (meanings: categories, functions, English examples for asking Mum)
         params.json     (gender, number, case, person, tense … each value's status)
         lexicon.json    (words: lemma, class, gender, paradigm, form overrides, sources)
         paradigms.json  (word classes: how each form is made, per cell, with status)
         concrete.json   (syntax rules: how each meaning becomes words, agreement)
         family-audio.json (recordings; optional "meaning" key per clip)
```

- **Abstract syntax (meanings).** Language-neutral. Two layers: the **core** (an RGL subset: noun phrases, verb phrases, clauses, commands, questions, lists) and the **domain** (the game's meanings: `Order`, `Fetch`, `Step`, `Put`, `Where`, `Found`, `Count`, `Greet`…). A domain function is defined as a core tree with slots, so most domain meanings need no Kutchi-specific rule. A language may still give a domain function its own rule when it says it its own way (Mum's *dudh waari chai* is a chai-only "with": [§ 5.4](#54-syntax-rules-concretejson)).
- **Concrete Kutchi grammar.** `params` (which features exist), `lincat` (which features each category carries: a noun has gender and forms by number × case), `paradigms` (how forms are made), `lexicon` (words), `lin` (syntax rules).
- **Linearizer.** Walks the meaning tree, applies rules, passes agreement features between words, and returns tokens. It never contains a Kutchi string or a Kutchi rule.
- **Clip planner.** Covers the tokens with the best recordings.
- **Simulator and gap reporter** (build-time tools in `build/`, Node): frequency statistics, the Mum phrase list, the golden tests.

---

## 4. The feature model (`params.json`)

Taken from the RGL Sindhi model and `grammar-kb.md`; values marked `hyp` are reserved slots that no data may use until Mum confirms them.

```json
{
  "gender":   { "values": ["he", "she"], "default": "he", "defaultSrc": "Mum's rule, grammar-notes §24 B4, §37.5" },
  "number":   { "values": ["sg", "pl"] },
  "case":     { "values": ["dir", "obl", "dat", "voc"], "notes": "dat = the 'to me' form (muke); obl = before a postposition" },
  "person":   { "values": ["p1", "p2", "p2resp", "p3near", "p3far"], "src": "GF-Snd PPerson; grammar-notes §21 (aai), §13 (hi/hu)" },
  "tense":    { "values": ["pres", "fut", "past", "imp"], "hyp": ["prog", "hab"] },
  "polarity": { "values": ["pos", "neg"] },
  "register": { "values": ["informal", "polite"], "src": "grammar-notes §1, §31" },
  "speaker":  { "values": ["he", "she"], "src": "the speaker's own gender, grammar-notes §32" }
}
```

- **Respect is a person value** (`p2resp`), as in GF-Snd, because the family's respect forms are the plural forms (grammar-notes §21): the paradigm can say "`p2resp` = the plural cell" once, in data.
- **Agreement target for past verbs with an object** is a grammar setting, not code: `"pastTransitiveAgreesWith": "unknown"` until C123–C136 are answered; the linearizer reads it (values `subject` / `object` / `object-if-p1`, the last being Keine's prediction). See `grammar-kb.md` feature 16.

---

## 5. Data formats, with small examples

All examples use only forms Mum has said, cited; anything unknown is shown as unknown. **No Kutchi in this section is new.**

### 5.1 Lexicon (`lexicon.json`)

One entry per word (a *lexeme*), with its class, gender, paradigm, any irregular forms, status and sources.

```json
{ "id": "n.chokro", "pos": "N", "lemma": "chokro", "gloss": "boy", "gender": "he",
  "paradigm": "noun.o-he", "forms": { "sg.obl": "chokre" }, "animate": true,
  "status": "confirmed", "src": ["grammar-notes §35 C8/C18", "§36 C18"] }

{ "id": "n.ambo", "pos": "N", "lemma": "ambo", "gloss": "mango", "gender": "he",
  "paradigm": "noun.o-he", "forms": { "sg.obl": "ambo" }, "formStatus": { "sg.obl": "draft" },
  "src": ["grammar-notes §4", "§36 C13 (Mum hesitated: ambe/ambo)"] }

{ "id": "n.khun", "pos": "N", "lemma": "khun", "gloss": "sugar", "gender": null,
  "paradigm": "noun.invariant", "mass": true, "status": "confirmed",
  "src": ["grammar-notes §6"], "ask": { "gender": "L34" } }

{ "id": "num.1", "pos": "Num", "value": 1, "agrees": "gender",
  "forms": { "he": "hakro", "she": "hakri" }, "src": ["grammar-notes §2"] }

{ "id": "a.wadho", "pos": "A", "paradigm": "adj.o",
  "forms": { "he.sg": "wadho", "he.pl": "wadha", "he.obl": "wadhe", "she.sg": "wadhi", "she.pl": "wadhi" },
  "src": ["grammar-notes §4", "§24 B6", "§40–§42 (5 Oct)"] }

{ "id": "v.khap", "pos": "V2dat", "gloss": "be needed (to someone)",
  "forms": { "informal": "khape", "pres.he.sg": "khapeto", "pres.she.sg": "khapeti",
             "pres.he.pl": "khapanta", "pres.she.pl": "khapanti", "fut.he.sg": "khapdo",
             "neg.he.sg": "nato khape", "neg.she.sg": "nati khape" },
  "src": ["grammar-notes §1", "§11", "§24 B1", "§31", "§33 S6"] }
```

- `gender: null` means unknown. The linearizer uses Mum's default (he) **and** reports a `feature` gap, so the default never hides the question (`grammar-kb.md` feature 1). **Downside:** a wrong gender (*hakro* for what is really a she-word) can ship and be heard until Mum answers. **Mitigation:** every defaulted noun is listed for Mum in the gap report, weighted by how often it's heard, and flagged in the session report; Zafar can choose the grey placeholder instead (decision 4 in `build/reports/step-2b.md`).
- Multi-word verbs (`banai de`, `chadi de`, `madad kar`) have a `head` part that inflects; the rest is fixed.
- `say` (a voice spelling, as Cook has today) and `aliases` (old ids such as `cook-paani`) carry over from `data/cook.json`.

### 5.2 Paradigms (`paradigms.json`)

A paradigm is a word class: how each cell is made from the stem, with a status per cell. A lexicon entry's `forms` override cells.

```json
"noun.o-he": {
  "stem": "drop final o",
  "cells": {
    "sg.dir": { "make": "{stem}o", "status": "confirmed", "src": "grammar-notes §4" },
    "pl.dir": { "make": "{stem}a", "status": "confirmed", "src": "§4, §34, §35" },
    "sg.obl": { "make": "{stem}e", "status": "draft", "src": "§41, §48, §49, §55 (5 Oct: ambe, bakre, chokre, darwaje, rasore)", "note": "28 Sept bare ambo je mathe / bakro sathe (§36) to recheck with Mum" },
    "pl.obl": { "make": "{stem}a", "status": "draft", "src": "chokra sathe, §36 C18" }
  }
},
"noun.invariant": { "cells": { "*": { "make": "{lemma}", "status": "confirmed", "src": "cup, table, limu §35" } } },
"noun.i-she":     { "cells": { "sg.*": { "make": "{lemma}" }, "pl.dir": { "make": "{lemma}", "status": "confirmed", "src": "maani, dungri §34" } } }
```

### 5.3 Abstract syntax (`abstract.json`)

```json
"Need":  { "cat": "Utt", "args": { "who": "Person", "thing": "NP" }, "core": "PredDat(who, v.khap, thing)",
           "elicit": ["I'd like chai.", "I'd like two samosas."] },
"Item":  { "cat": "NP", "args": { "kind": "CN", "n": "Num?", "with": "[NP]?", "without": "[NP]?" },
           "elicit": ["I'd like two samosas with mince.", "I'd like daar, but no onion."] },
"Fetch": { "cat": "Utt", "args": { "to": "Person", "things": "[NP]" }, "core": "ImpVP(ComplV3(v.de, to, things))",
           "elicit": ["Bring me flour, sugar and milk."] }
```

`elicit` holds natural English sentences for asking Mum: the gap reporter uses them when a rule is missing.

### 5.4 Syntax rules (`concrete.json`)

A `lin` rule is a list of slots. A slot names an argument, a word, or a nested rule; `cell` picks the form, and `{arg.feature}` copies a feature from another slot (that's agreement).

```json
"PredDat": {
  "variants": {
    "informal": [ { "arg": "who", "case": "dat" }, { "arg": "thing", "case": "dir" }, { "lex": "v.khap", "cell": "informal" } ],
    "polite":   [ { "arg": "who", "case": "dat" }, { "arg": "thing", "case": "dir" },
                  { "lex": "v.khap", "cell": "pres.{thing.gender}.{thing.number}" } ]
  },
  "src": "grammar-notes §1, §31 (Muke chai khapeti; Muke paani khapeto)"
},
"DetCN": { "slots": [ { "arg": "n", "cell": "{cn.gender}" }, { "arg": "cn", "cell": "{n.number}.{case}" } ],
           "number": "value 1 → sg, otherwise pl", "src": "hakro ambo, ba amba §2, §4" },
"MixedIn": { "only": { "head": ["n.chai"] }, "slots": [ { "arg": "x" }, { "word": "waari" }, { "arg": "head" } ],
             "src": "dudh waari chai §6" },
"Without": { "slots": [ { "arg": "x" }, { "word": "wagar" }, { "lex": "gen", "cell": "{head.gender}" }, { "arg": "head" } ],
             "src": "dudh wagar ji chai §10" },
"WithFood": { "status": "unknown", "ask": ["L17", "L22", "L23", "L27"], "english": "with" },
"AndKinds": { "status": "unknown", "ask": ["L16", "L23", "L26"], "english": "and" }
```

- `{head.gender}` on the "of" word (*jo / ji / je*, a lexeme `gen` with forms by gender and case) gives *wagar ji chai* because chai is a she-word (grammar-notes §18). Whether *wagar ji* really agrees is still open: Mum also said *dungri wagar ji daar* (§10), and daar's gender is unknown (L36 settles it). Until then the rule is `draft`, and a he-word dish returns a gap.
- A rule's `status: unknown` means the linearizer returns a gap for any meaning that needs it.

### 5.5 Recordings (`data/family-audio.json`, extended)

Each clip keeps today's fields (`id`, `qid`, `kutchi`, `speaker`, `file`, `checked` …) and may gain:

```json
{ "id": "muke-chai-khapeti", "kutchi": "Muke chai khapeti", "speaker": "mum", "checked": "ok",
  "meaning": "Need(p1,Item(n.chai))|polite|she", "tokens": ["pron.p1:dat", "n.chai:sg.dir", "v.khap:pres.she.sg"] }
```

`meaning` is the canonical key of the tree the clip says: the tree, then the register, then the speaker's gender (`he` / `she`), the same key § 8 counts; `tokens` lets the planner use a clip for part of a sentence. Both are added by the fill step ([`fill-the-engine.md`](fill-the-engine.md) § 4). Clips without them still match by text, as `FamilyVoice.match` does today (`js/shared/family-voice.js`).

---

## 6. The API game code calls

This section is the contract for step 2a and for every mode. Names are proposals; the shapes are the design.

### 6.1 `Lang.say(meaning, ctx)` → `Result`

```js
const r = Lang.say(
  { fn: "Need", who: "p1", thing: { fn: "Item", kind: "n.samosa", n: 2,
      with: [{ fn: "Item", kind: "n.chundo" }], without: [{ fn: "Item", kind: "n.mirchi" }] } },
  { speaker: { id: "nana", gender: "he", elder: true },
    addressee: { id: "child", elder: false },
    register: "informal",            // or "polite"; defaults per mode, set in data
    voice: ["mum", "zafar"],         // recording preference
    level: 2 }                       // for word-stage display only; never changes the sentence
);
```

**Result when everything is known:**

```js
{
  ok: true,
  text: "Muke ba samosa khape …",                // display text, capitalised and punctuated
  tokens: [                                     // one per word, in order
    { t: "Muke", lex: "pron.p1", cell: "dat", status: "confirmed", src: "grammar-notes §1" },
    { t: "ba", lex: "num.2", cell: "-", status: "confirmed" },
    …
  ],
  segments: [ { t: "Muke", lang: "k", w: "pron.p1" }, { t: " ", lang: null }, … ],  // today's Cook segment shape
  rows: [ "ba samosa", "…" ],                   // the order card's rows (rule F10: same source, same order)
  clipPlan: [
    { kind: "whole", clip: "…", file: "assets/audio/family/mum/….mp3", tokens: [0, 3] },
    { kind: "word",  clip: "…", file: "…", tokens: [4, 4] },
    { kind: "missing", tokens: [5, 5] }          // text known, no recording yet: an audio gap
  ],
  drafts: [ … ],                                 // tokens whose form is draft (⚠): show, flagged draft (rule G3)
  gaps: [ … ]                                    // audio gaps only; text gaps make ok:false
}
```

**Result when something is unknown** (`ok: false`): the engine never guesses a Kutchi word.

```js
{
  ok: false,
  gaps: [
    { kind: "rule", id: "WithFood", what: "how to say 'samosa with mince'", ask: ["L22", "L23"] },
    { kind: "feature", lex: "n.chundo", feature: "gender", ask: ["L37"], defaulted: "he" }
  ],
  // the best honest rendering, for the game to show (rule G2): Kutchi where known,
  // grey-italic English for each gap, flagged "to record"
  segments: [ { t: "Muke ba samosa khape", lang: "k" }, { t: "with", lang: "e", gap: "WithFood" }, … ],
  text: "Muke ba samosa khape, with …"
}
```

### 6.2 The other calls

| Call | Returns | For |
|---|---|---|
| `Lang.rows(meaning, ctx)` | the card rows only (lower case, no full stop: rule F10) | `js/shared/order-card.js` |
| `Lang.check(meaning, ctx)` | `{ok, gaps}` without building text | a mode deciding whether to offer an item at all |
| `Lang.word(lexId, cell?)` | one token and its clip | word cards, the end review, `Lang.speakWord` today |
| `Lang.play(result, opts)` | a promise that plays the clip plan in order, with per-token timing for read-along underlining (rule E4; inside whole-phrase clips this needs word timestamps, § 9). It delegates playback to the core voice module, `Voice.say(result)` (`docs/architecture/target-model.md` § 3.2) | `js/shared/say.js` |
| `Lang.explain(meaning, ctx)` | the rule trace (which rule, which cell, which source) | tests and debugging |
| `Lang.load(base)` | loads the data files once | page start-up |

**Gap kinds:** `lexeme` (no word for this meaning), `form` (the word exists but this form is unknown, e.g. a plural), `feature` (gender or class unknown; a default was used), `rule` (no syntax rule for this meaning), `audio` (text fine, no recording). Only `audio` and `feature` gaps can still return `ok: true`; a `feature` gap does so only because Mum's own default applies, and it is always reported.

**TTS:** in development a page may voice `missing` tokens with test-only TTS; production never does (rule G14). The clip planner marks them; the player decides by build flag.

---

## 7. Linearization, step by step

1. **Resolve context.** `speaker`, `addressee` and `register` set `person` (`p2` or `p2resp` by age, rule G6) and the speaker's gender.
2. **Expand domain meanings** into core trees (`Need` → `PredDat`). A concrete rule for the domain function, if present, wins.
3. **Walk the tree bottom-up.** Each node gets its features: a noun phrase gets gender (from its noun), number (from its numeral) and case (from the slot that uses it).
4. **Pick forms.** For each word slot, compute the cell (`pres.she.sg`), look up the lexicon override, then the paradigm. Status travels with the form.
5. **Collect gaps** instead of failing at the first one, so one call lists everything a meaning needs.
6. **Join.** Tokens get spaces; the first letter is capitalised; utterance type sets the final mark. Card rows use the same tokens without capital or stop.
7. **Plan clips** ([§ 9](#9-clip-planning)).

---

## 8. Frequency statistics: which phrases Mum records whole

Rule G12: the most frequent phrases are recorded whole so they sound human; the rest are assembled. The engine never changes; only the clip index grows.

1. **Simulate play.** A Node tool runs each mode's own content generator (Cook's `recipes.js` + `order.js` already do this: the inventory's harness ran 60 orders per dish per level) under a **play model**: how many rounds a child plays per day, at which levels, over the first month. Each run logs the meaning trees the game asks the engine to say, with speaker and register.
2. **Key every phrase.** A meaning key is the canonical tree text plus the register and the speaker's gender, e.g. `Need(p1,Item(n.samosa,2))|informal|he` (the same key format as § 5.5). Every subtree that is a natural unit (a noun phrase, a clause, a whole utterance) is counted too.
3. **Rank by value.** For each candidate: expected hearings per week × words it replaces ÷ its length in seconds = *hearings saved per second of recording*.
4. **Pick under a budget.** Greedily take the top candidates until the budget (e.g. 20 minutes of Mum's time) is spent or the gain flattens. Output a coverage curve ("the top N phrases cover X% of everything a child hears in week one") so Zafar can choose the budget.
5. **Variety.** For the top phrases, ask for two takes and alternate them, so a line heard 30 times a day doesn't sound like a loop.
6. **Output:** `build/reports/phrase-list-<date>.md` (and `.json`), in the Mum questionnaire format with new L IDs, ready for `build/build_mum_questions_docx.js`.

---

## 9. Clip planning

Given tokens and the recordings:

1. **Whole first.** Find recordings whose `meaning` matches a subtree exactly (same words, same forms, register and speaker gender). Prefer the longest, then the preferred speaker (`ctx.voice`). **Only clips Zafar marked `checked: "ok"` are used in production** (rule G16); unchecked clips are allowed only in a test build, and `redo` never plays. Note for the gap analysis: today's `js/shared/family-voice.js` (lines 47–60) ranks unchecked clips below OK ones but still returns them, which is the same leak.
2. **Then by text.** For the rest, match runs of tokens by normalised text (`FamilyVoice.norm`).
3. **Then per word**, preferring a word cut from a sentence (it sounds natural in a sentence) over a citation form said alone.
4. **Anything left is `missing`**: an audio gap, listed for recording.

A clip plan is ordered segments, each with the token span it covers. **Read-along timing:** a per-word clip underlines its word for the clip's length; inside a whole-phrase clip, per-word underlining needs word start and end times. Those come from word-level timestamps in `build/transcribe_family.py` (Whisper can give them) or from forced alignment, stored per clip as `words: [{t, start, end}]`. Without them, the whole phrase underlines at once. This is in step 4c's scope (§ 15).

---

## 10. Gaps become Mum's phrase list

`build/lang/gaps.js` (Node) runs the simulation, linearizes every meaning, and collects every gap, weighted by how often the game needs it. Each gap kind has an elicitation template in data, written as a natural English situation, never a table (rule G11):

| Gap | Template (English for Mum) |
|---|---|
| `feature` gender of a mass noun | "I'd like some {gloss}, please." (polite: shows *khapeto / khapeti*, as Mum did in K10) |
| `feature` gender of a countable noun | "one {gloss} · two {gloss}s" |
| `form` plural | "one {gloss} · three {gloss}s" |
| `form` oblique | "with the {gloss} · in the {gloss}" |
| `rule` | the rule's own `elicit` sentences from `abstract.json` |
| `lexeme` | the word in a short sentence the game actually uses |
| `audio` | the exact sentence, from the phrase list |

Output: a ready questionnaire section (ID, English, blank columns, "stop here" marks every ~10 minutes), sorted by value. New IDs continue the L series. The loop is in `fill-the-engine.md` § 3.

---

## 11. The Excel's role

`content/Nani jo Ghar - Content Master.xlsx` (read 1 Oct): scene tabs (Bazaar, Doorstep, Street, Charades, Clinic, Hide and Seek, Pack the Bag, Bonus) with about 170 handout drafts, **0 confirmed words**; a "Carrier sentences" tab of `Muke {x} khape` formulas; a 496-entry Freelang dictionary paste; a formula-built master list. `build/build_content.py` turns it into `data/content.json` for the parked modes. Every word Mum has confirmed since 24 Sept lives in `data/cook.json`, not in the sheet (`lexicon.md` § 5).

**Recommendation: retire it as a source.**
- The engine's `lexicon.json` is the one source of words; `lexicon.md` stays the human-readable log of where each word came from.
- Import the sheet's rows once into `lexicon.json` as `status: "wanted"` (English gloss, scene, the old id such as `fru-01` as an alias, the handout draft as a **hint that never ships**), so the parked modes' word lists aren't lost and their ids still resolve.
- Keep the file as history, read-only (move it beside the archive when 2a reorganises; never resave it with openpyxl, as `build_content.py` warns).
- If Zafar wants a spreadsheet view for spell-checking, generate a read-only one from `lexicon.json`; don't edit it.

Why: Mum doesn't edit it, nothing in it is confirmed, its formulas break when scripted, and two sources of words have already drifted. Its "carrier sentences" idea (one whole recording per item, because splicing sounds robotic) is exactly rule G12, which the engine now does properly.

---

## 12. Testing

1. **Golden sentences from Mum's own recordings.** Every sentence Mum has said that the engine can express becomes a test: meaning in → exactly Mum's words out (normalised). The first set comes from grammar-notes, e.g.:

   | Meaning | Must say | Source |
   |---|---|---|
   | `Need(p1, Item(n.maani, 1))` informal | *muke hakri maani khape* | §1 |
   | the same, polite | *muke hakri maani khapeti* | §1 |
   | `Item(n.ambo, 2)` | *ba amba* | §2, §4 |
   | `MixedIn(n.chai, n.dudh)` | *dudh waari chai* | §6 |
   | `Without(n.chai, n.dudh)` | *dudh wagar ji chai* | §10 |
   | `With(n.chokro)` (a person) | *chokre sathe* | §36 C18 |
   | `Where(n.cup, n.table, on)` | *cup table je mathe ai* | §15 |
   | `Refuse()` polite | *na, muke na khape* | §30 K11 |

2. **Gap tests.** Meanings the engine must **not** be able to say yet return the right gap, never text: `Item(n.samosa, 2, with:[n.chundo])` → `rule: WithFood`; `Item(n.tameto, 2)` → `form` (§34 P3 open).
3. **Recording round-trip.** Every clip with a `meaning` key must linearize to its own `kutchi` text. A failure means the grammar and the recordings disagree: fix the data, never the clip.
4. **Data validation.** A schema check: every `src` cites a section; every confirmed cell has a source; no `hyp` value is used; every lexicon id used in `concrete.json` exists.
5. **No Kutchi in code.** A lint that fails if any lexicon form appears in a `.js` file outside data (rule G13).
6. **Simulation smoke test.** The simulator runs every mode for N rounds without an exception, and its gap count is reported in the build report.

All run in Node in seconds; the browser QA (screenshots, listening) stays as the QA checklist says.

---

## 13. Worked example: a samosa order with "with" and "no"

**Today** (inventory §6, a real sample): *Muke ba samosa khape, with ba chundo, hakro bataato, hakro marcha, dhania na; and samosa, with trae bataato.* The English "with" and "and" are placeholders, and the rows are joined by commas, not by a sentence.

**The meaning** the samosa recipe would send:

```js
{ fn: "Order", who: "p1", items: [
    { fn: "Item", kind: "n.samosa", n: 2, with: [{ kind: "n.chundo" }], without: [{ kind: "n.mirchi" }] },
    { fn: "Item", kind: "n.samosa", n: 1, with: [{ kind: "n.bataato" }] } ] }
```

**Step by step, today's knowledge:**

1. `Order` expands to `Need(p1, AndKinds(item1, item2))`.
2. `Need` informal → [*muke*] [thing] [*khape*] (§1).
3. `item1`: `DetCN(num.2, n.samosa)` → *ba samosa* (§3; samosa doesn't change, §34 P7).
4. `with: [n.chundo]` needs `WithFood`: **unknown** → gap (ask L22, L23).
5. `without: [n.mirchi]` needs the no-row inside an order: the row form *mirchi na* is a working assumption (`decisions.md`); inside a sentence it's **unknown** → gap (ask L19, L24).
6. `AndKinds` → **unknown** → gap (ask L16, L23, L26).
7. `n.chundo` gender **unknown** (L37) → `feature` gap.

Result: `ok: false`, four gaps, and an honest rendering with grey-italic English for the joins (rule G2), exactly as the game shows today, but now **listed for Mum automatically**.

**After Mum answers L22–L24** (her sentences go into grammar-notes; the fill session writes the rules): `WithFood` gets a rule built from her words, e.g. `[{ "arg": "head" }, { "word": "⟨her with-word⟩" }, { "arg": "x" }]` or whatever shape she uses (the slot order comes from her sentence, not from a guess). The linearizer is unchanged. The same order now returns `ok: true`, with tokens, the card rows (*ba samosa*, *⟨chundo row⟩*, *mirchi na*) and a clip plan: if the simulation ranked "two samosas with mince" high, a whole recording covers tokens 0–5; *khape* and the rest are per-word clips.

---

## 14. Migration from today's frames

Today's lines are frames in `data/cook.json` (`lines`, 46 keys; `grammar`) put together by `js/cook/lang.js` (`Lang.phrase`, `Lang.line`, `Lang.countParts`) and `js/cook/order.js` (`Order.sentence`, `Order.speech`, `Order.ladder`). Each frame becomes a meaning (inventory § 1A–1C numbers):

| Inventory frame | Today | Becomes |
|---|---|---|
| #1 | `Muke {x} khape.` | `Need(p1, x)` informal |
| #2 | `Muke {x} de.` | `Fetch(p1, [x])` |
| #3 | `Ne {x}.` | a list inside `Fetch` / `Order` (no stand-alone fragment) |
| #4 | `{x} na.` | `Item.without` (card row form kept; sentence form from L19/L24) |
| #5, #6 | `Pela {x}.` / `Ne poi {x}.` | `Steps([…])` with a verb (L55, L60) |
| #7, #8 | `{x} waari chai` | `MixedIn(n.chai, x)` |
| #9 | `Muke chai me {x} khape.` | `Need(p1, x, in: n.chai)` |
| #10 | `Kali {x}.` | `Only(x)` inside a command (L56) |
| #11 | `Hane {x}!` | `Now(Imp(v, x))` (needs the verb, L56) |
| #12, #13 | `{x} hane kadh.` / `{x} chadi de.` | `Imp(v.kadh, x)` / `Imp(v.chadi-de, x)` (L59) |
| #14, #15 | `{n}!`, `{n} {x}` | `CountAloud(n)`, `DetCN(n, x)` |
| #17, #18, #19 | English `with`, `and`, `times` | `WithFood`, `AndKinds`, `Times` (gaps until L-answers) |
| #20 | "Bring me these for {dish}" | `Fetch(p1, things, for: dish)` (N2) |
| 1C one-off lines | `Shabash!`, `Bas!`, `Tayar ai.` … | fixed-phrase meanings (`grammar-kb.md` feature 29) |
| 1E Conversations | whole clips (`Tu muke {x} banai dinda?`) | `Request(addressee, make, x)`; existing whole clips get `meaning` keys |

Steps:
1. Build the engine and load it beside the old code (no behaviour change).
2. Convert `data/cook.json` `words` into `lexicon.json` (ids kept as aliases: `cook-paani` → `n.paani`), `lines` into rules and fixed phrases; retire `grammar`.
3. Make `Lang.phrase`, `Lang.line` and `Order.sentence` thin adapters over `Lang.say`, so the stations don't change (rule A4/A5: no mechanic changes).
4. Golden tests must pass on every current Cook line that is Mum-confirmed; every other line must come back as a listed gap.
5. Then Conversations, first launch, the clinic, then parked modes, each as its own step.

---

## 15. Effort for step 4

| Session | Work | Model and effort | Size |
|---|---|---|---|
| 4a | Engine core: data schema and validation, linearizer, clip planner, `Lang.say` / `rows` / `check` / `play`, Node tests | top model, high effort (judgement-heavy) | one session, ~3–4 h |
| 4b | Fill from what's known: lexicon from `data/cook.json` and grammar-notes (~120–150 entries), paradigms, ~25 rules, golden tests from §1–§37 | mid-tier model, medium effort (mechanical, but cite every source) | one session, ~3 h |
| 4c | Simulator, frequency ranking, gap reporter, phrase-list output in the questionnaire format; word timestamps for clips (Whisper word-level output in `build/transcribe_family.py`, or forced alignment) for read-along inside whole phrases | mid-tier, medium | one session, ~3–4 h |
| 4d | Cook migration behind adapters, full QA checklist and screenshots (step 3 builds only the adapter seam; see `docs/archive/architecture/gap-analysis.md`) | top model, high (visual review) | one session, ~4 h plus review |
| after each Mum round | Fill session: notes → data → tests → new phrase list | mid-tier, medium | ~1–2 h |

4a must finish first; 4b and 4c can run in parallel on disjoint files; 4d last. Costs per launch are estimated by the orchestrator at launch time.

---

## 16. Risks

1. **Assembled speech can sound choppy.** Word clips spliced together lose the sentence's tune. Mitigations: whole recordings for frequent phrases (§ 8), words cut from sentences rather than said alone (§ 9), and a listening check in QA. If assembled lines still sound wrong to Zafar, the budget for whole recordings goes up; the engine doesn't change.
2. **The past-tense agreement split** (`grammar-kb.md` feature 16) may be more complex than one setting. The design keeps it as data, but a very irregular answer could need one more rule type.
3. **Mum's answers are natural, not systematic.** She may answer a "with" question in a way that changes the order shape. The engine copies her shape (slot order comes from her sentence); rules are never forced into an English shape.
4. **Whisper spellings.** Many known forms are ⚠ until Zafar checks them; they ship only as drafts (rule G3), which can leave visible draft flags for a while.
5. **Scope creep in the abstract syntax.** Every new meaning is a design decision; `fill-the-engine.md` § 2.3 keeps additions small and reviewed.
6. **Sources I couldn't reach** (proxy): the Keine PDF, the Sindhi thesis PDF, grammaticalframework.org, UniMorph. The design doesn't depend on them; their claims are hypotheses only.
