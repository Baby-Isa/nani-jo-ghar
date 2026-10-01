# Language engine: specification (requirements only; the design comes in step 2b)

> **Stale points (the rulebook, `docs/process/rules.md`, wins).**
> - This file holds Zafar's **requirements** for the engine, copied from the 30 Sept handover. The design is `engine-design.md` (step 2b, 1 Oct), awaiting Zafar's approval; see Status at the end.
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

Designed in step 2b (1 Oct 2026), awaiting Zafar's approval; nothing is built until he approves.

- The engine design: `engine-design.md` (its API is § 6).
- The grammar knowledge base (known / hypothesis / unknown): `grammar-kb.md`.
- Mum's elicitation questionnaire (Round 5): `mum-questions/Questions for Mum (Round 5).md`.
- The fill-the-engine rulebook: `fill-the-engine.md`.
- Summary and the decisions for Zafar: `build/reports/step-2b.md`.
