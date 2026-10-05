# Language engine: specification (Zafar's requirements, and what step 4a built)

> **Stale points (the rulebook, `docs/process/rules.md`, wins).**
> - This file holds Zafar's **requirements** for the engine, copied from the 30 Sept handover, and (at the end) **what step 4a built**: the API, the data schema and the tests. The design is `engine-design.md` (step 2b, 1 Oct; approved as decision 17).
> - "Decide the Excel's role" is still an open question: see `language/lexicon.md` § The Excel's role.
> - Where the handover says "use GF as the template", outside grammars and the Gemini/Claude research in `language/sources/` are **hypotheses, not evidence**: Mum is the authority and two AIs agreeing is not evidence (G1, non-negotiable 4).
> - Rules that govern the engine: G9–G13, G18 (every line a full natural sentence; engine built the standard way; filled from Mum's natural sentences; whole-phrase recordings for the most frequent lines; no Kutchi grammar in game code; nouns carry gender, singular and plural).
> - "Step 4" below means the build step of the 30 Sept plan; its place in the current plan is in `docs/status.md`.

## Sources and where things live

- Known grammar: `docs/language/grammar-notes.md`; the words: `docs/language/lexicon.md`; the answered and open rounds: `docs/language/mum-questions/` (see its README); the family recordings: `data/family-audio.json`.
- **Outside material and research: `docs/language/sources/`** (see its `README.md`): Gemini's two blueprints (AI-generated, unverified), Claude's 21-category grammar checklist, the game inventory (every sentence frame, verb, noun and English placeholder the game uses today) and the paused Round 5 plan notes. **Nothing there is evidence on its own.** Its comparison with what Mum has told us, and the real published paper (Keine, Nisar and Bhatt 2014, on defective agreement in Kutchi), are summarised in that README.

## Zafar's requirements (30 Sept)

> from: docs/archive/handovers/NEXT-CHAT-START.md § 1. Zafar's aim (his words, 30 Sept), the language-engine quote

> On the language engine: build it properly: "the lexicon, the morphology rules, the syntax rules… once you understand the grammar you can create sentences from the rules… if you need to know how to say 'make me rice and curry' you just need to ask to fill in the words for rice and curry and you should know how to say the rest."

> from: docs/archive/handovers/NEXT-CHAT-START.md § 4, Step 2 (b) Language engine: research and design

- **Standard, not bespoke.** Use the established approach: **Grammatical Framework**. One shared *abstract syntax* holds the meanings ("request items", "want X with Y but no Z", "N of X"). A *concrete grammar* for Kutchi holds the lexicon, morphological paradigms and syntax rules. **There's a published GF resource grammar for Sindhi**, and Kutchi is very close to Sindhi (often classed as a dialect of it), so use it as the template and confirm the differences with Mum. The core engine shouldn't be heavily customised.
- **The engine generates every word and every sentence** from its rules and lexicon. Frames aren't hand-written; common patterns come *from* the rules.
- **A companion rulebook covers "how to fill the engine".** When it lacks a rule or word, the engine outputs what's needed: a list of phrases for Mum to say, such as "one boy / two boys, one girl / two girls", "big boy / big girl", "bring me / give me". She fills in the grammar without ever seeing a table (field-linguistics paradigm elicitation). Needed verbs and nouns are listed the same way. Cover gender, number, possession (*jo/ji/ja*), polite forms, numbers and counting, negation (*na*), lists and "with", postpositions and word order.
- **Recording is separate and never changes the engine.** Near the end, simulated play-throughs give frequency statistics, and the most frequent lines get recorded whole so they sound human. Everything else is assembled from recorded parts (the fallback).
- **Inventory first:** which verbs, frames and word classes the game actually uses today (probably a small set).
- **Decide the Excel's role** (`content/Nani jo Ghar - Content Master.xlsx`: scene word lists, a draft vs a mostly-empty confirmed column, carrier-sentence formulas). The game doesn't read it today. Should it become the editable source for the lexicon and paradigms?
- Known grammar lives in `docs/language/grammar-notes.md`, the four "Questions for Mum" rounds and the family recordings (`data/family-audio.json`).
- **Output:**
  - the engine design;
  - the grammar knowledge base (known / unknown);
  - Mum's elicitation questionnaire, ordered by how much each answer unlocks;
  - the fill-the-engine rulebook.

  All for Zafar's approval.

## Why it is needed

> from: docs/archive/handovers/NEXT-CHAT-START.md § 2. Why we paused all building (the language points)

- **Lines aren't proper sentences.** The pantry says *khun, ne daar, ne dudh* with no verb. Where a Kutchi frame isn't known, sessions produced fragments instead of admitting the gap.

> from: docs/archive/handovers/NEXT-CHAT-START.md § 4, Step 4

### Step 4: build the language engine and populate it with everything known, then use it everywhere
**After this, feature work resumes.**

## Status

Designed in step 2b (1 Oct 2026; decision 17). **Engine core built in step 4a (5 Oct 2026)**, not wired to any game: `js/core/lang/index.js` (the seam) still answers every caller until 4d (Cook) and 4e (the clinic). Report: `build/reports/step4a-engine-core.md`. Step 2b's outputs: `engine-design.md`, `grammar-kb.md`, `mum-questions/Questions for Mum (Round 5).md`, `fill-the-engine.md`, `build/reports/step-2b.md`.

## What is built (step 4a)

### Files
| Where | What |
|---|---|
| `js/core/lang/engine/index.js` | the API: `createEngine({data, audio, voice, path, phrases})`, `loadEngine({base})` |
| `js/core/lang/engine/linearize.js` | meaning → tokens, with agreement and gaps (engine-design § 7) |
| `js/core/lang/engine/clips.js` | the clip planner (§ 9) over `data/lang/clips.json` and `data/family-audio.json`; takes chosen by `js/core/voice.js` `chooseClip` |
| `js/core/lang/engine/validate.js` | the data check (§ 12.4) |
| `js/core/lang/engine/gaps.js` | the gap reporter (minimum 4c, decision 38 c) |
| `data/lang/params.json`, `elicit.json` | the feature model and Mum's question templates (real) |
| `data/lang/lexicon.json`, `paradigms.json`, `abstract.json`, `concrete.json`, `clips.json` | **empty: step 4b fills them** |
| `data/lang/test-seed/` | a small grammar from grammar-notes, cited, **for tests only** |
| `build/lang/engine.test.mjs`, `build/lang/gap-report.mjs` | `node --test build/lang/`; `node build/lang/gap-report.mjs --needs <file>` (or `--seed`) |

No Kutchi word or rule is in the code (G13, G26; a test checks it).

### The API
`Lang.say(meaning, ctx)` → `{ok, text, en, tokens, segments, rows, clipPlan, drafts, gaps, key, trace}` (shapes in `index.js`'s header). `Lang.rows`, `Lang.check` (`{ok, gaps}`), `Lang.word(lexId, cell?)`, `Lang.play(result, opts)` (hands the result to `Voice.say`), `Lang.explain`. `ctx`: `register` (`informal`/`polite`), `addressee: {elder}` (G6), `speaker: {gender}`, `voice` (preferred speaker), `path` (`store`/`test`), `phrases`.

- **ok** is false when a word, form or rule is missing; then the missing parts are English placeholder tokens (`lang: "e"`, with `gap`), never made-up Kutchi (G9).
- **Gap kinds:** `lexeme` (no word, or the word is to-record), `form` (that cell is unknown), `rule` (no rule, an `unknown` rule, or a rule whose `only` condition fails), `feature` (gender unknown: the he-form was used, decision 21; reported only when a form depends on it), `audio` (no recording). Each has `ask` (the question IDs) and `what`.
- **drafts:** Kutchi tokens whose form, rule or gender isn't confirmed (G3).
- **clipPlan:** `[{kind: "whole"|"word"|"missing", source, file?, clip?, text, tokens, segs}]`. Whole phrases only with `phrases` on (decision 26), and never over a guessed gender.

### The data schema
- **Ids name concepts, not Kutchi words** (`n.boy`, `a.big`, `v.want`), so meanings stay language-neutral and an English (or any) lexicon can use the same ids; Cook's old ids go in `aliases`. A test keeps Kutchi out of `abstract.json` and out of ids.
- **lexicon** `entries[]`: `id` (`n.boy`), `pos` (a key of `params.pos`), `gloss` (+ `glossPl`, English for grown-ups and placeholders), `lemma`, `gender` (`he`/`she`/`null`; nouns must carry it), `number`/`person`/`clusivity` (pronouns, number words), `ref` (a pronoun's person: `p1`, `p1pl.incl` …), `value` (number words), `paradigm`, `forms` (`{cell: "text" | {t, status, src, ask}}`, overriding the paradigm), `parts` (a fixed expression or set phrase made of other entries: `[{lex, cell: "she.{cell}"} | {punct}]`, e.g. *kari chai*, each word agreeing and stitched from its own clip), `status` (`confirmed`/`draft`/`to-record`), `src` (required), `ask` (`{gender: [...], word: [...], "<cell>": [...]}`), `notes` (strings), `open` (`[{q, ask?, src?}]`: open questions), `history` (`[{date, change, src}]`: what changed when), `say`, `aliases`. One entry is the one place for everything known about a word (G27).
- **paradigms** `{id: {pos, stem: {drop}, cells: {key: {make: "{stem}e", status, src, ask}}}}`; a key is feature values joined by dots, `*` matches any one part, `"*"` alone matches everything.
- **abstract** `functions: {Fn: {cat, args: {name: {type, optional, list}}, core?, rows?, en, elicit}}`; `type: "Person"` takes `p1`, `p2` …; `core` is a meaning template with `$arg`.
- **concrete** `lin: {Fn: {feats?, slots | variants (by register), defaultVariant?, only?, onlyAsk?, mark?, status, src, ask?, english?}}`. `exceptions: [{only, slots | status: "unknown", ask, english, what, src}]` are tried first (e.g. a counted sugar is not *waari*, grammar-notes §6). Slots: `{arg, case?, cell?, each?, via?, list?}`, `{lex, cell?}`, `{punct}`; no free text. Templates: `{arg.feature}`, `{feature}`, `$field`, a literal, with `|` for fallbacks.
- **clips** `clips[]`: `{clip, lex, cell}` or `{clip, meaning}`; the check fails if the recording doesn't say that form.

### What the data check rejects
An entry with no source; an English-only word not flagged to-record; a to-record word carrying Kutchi; reserved (`hyp`) values; form keys with unknown values; known cells with no `make` or source; rules naming missing words, arguments or meanings; free text in a rule; an unknown rule with no questions; a clip that says something else.

### Where each kind of knowledge goes (G27: one home)
| Knowledge | Goes in |
|---|---|
| a word, its gender, plural and forms | a lexicon entry (`forms` only for what differs from its paradigm) |
| a word class's regular forms | a paradigm cell, with its status and source |
| an irregular form | the entry's `forms` cell, with its own `src` |
| a fixed expression (*kari chai*), a set phrase or greeting | an entry with `parts` (pos `N` or `Phrase`) |
| a sentence pattern | an abstract meaning plus its concrete rule |
| an exception to a pattern | the rule's `exceptions`, with its source |
| a word known only in English | an entry with status `to-record` |
| a guess, a doubt, a question for Mum | `status: "draft"`, `open`, `ask` on the entry or cell |
| a recording | `data/family-audio.json` as today, plus a `clips.json` row |
| a correction or a new answer | edit that one entry or rule, add a `history` row, re-run `node --test build/lang/` |

### Room for English and the dictionary (not built)
`abstract.json` is shared and language-neutral. An English grammar would be a second `lexicon` + `paradigms` + `concrete` set with the same ids and meanings (`createEngine({data: {...english}})`); the abstract `en` templates are its seed. **Translation box:** within the engine's coverage, parse English by generating candidate meanings from the abstract syntax, linearising them in English and matching (closed sets, so no general parser), then `Lang.say` the meaning in Kutchi. **Dictionary:** export the lexicon (gloss, forms by cell, status, source, clips, topic) straight from `lexicon.json`.

