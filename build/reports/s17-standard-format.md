# The standard folder: the one format (Sprint 17, 7 Nov)

The structure is Zafar's, locked 5 Nov (`build/reports/s17-standards-structure-v2.md`, his §8 answers; Sprint 18's decisions 11-13:
three scopes, three layers). This note fixes the **format** so five builders write one standard and the tools can read it
(`build/tools/review/stdids.mjs`, `audit.mjs --standard`). The orchestrator owns this note; a builder who needs a change asks in
its report.

## The folder: docs/design-language/standard/

| File | Writer | What |
|---|---|---|
| `README.md` | builder 1 | the index (every page, one line each), the three scopes, the three layers, the proof scale 0-5, how a family uses it, the rule format (a pointer to this note's rule block) |
| `0-foundations.md`, `a-learning.md`, `c-progression.md` | builder 1 | domains 0, A, C |
| `b-play.md` | builder 2 | domain B |
| `d-guidance.md` | builder 3 | domain D (and every `*14` onboarding state of chai) |
| `e-presentation.md`, `glossary.md`, `values.md` | builder 4 | domain E, the glossary (every part: ours, his words, the file), the values sheet (every area's numbers) |
| `f-build.md`, `g-proof.md`, `h-supply.md`, `patterns.md` | builder 5 | domains F, G, H, the 14 patterns; F1 (kit vs game) is the module map's source; the lessons R1-R9 sit in `g-proof.md` §Lessons |
| `placement.md` | the orchestrator (stitched from the fragments below) | every source ID, placed once |
| `gaps/<game>.md` | Sprint 18's game builders | not now |

Each page is **at most 2,500 words** (`build/tools/review/docs.mjs` will check it). A domain that runs over keeps its rules and
cuts prose: the rule rows are the content. A builder writes only its own files and its fragment.

## The rule block (every rule, exactly this shape)

```
#### STD-D1-07 · A light on a small part of a thing lights the whole thing first, then shrinks onto the part
- **Why:** "make it a generalizable principle/rule" (Zafar, 5 Nov)
- **Scope:** House
- **Pattern / part:** P3 / the light
- **Checked by:** contract-53 + judge: the shrink's motion, chai L2 New player
- **See it:** lab.html?mode=cook&game=chai-tray&level=2&new=1 (1280x665)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Value:** zoom-in (values.md E4) · **Impact:** stuck · **Source rows:** SH-213
```

- **ID:** `STD-<area>-<nn>`, the area as in the v2 table: `01`, `02` for 0.1, 0.2; `A1`-`A4`, `B1`-`B4`, `C1`-`C4`, `D1`-`D5`,
  `E1`-`E6`, `F1`-`F5`, `G1`-`G4`, `H1`-`H4`; `nn` two digits from 01 in each area. An ID is never reused; a retired rule keeps its
  block with Status "retired <date>: why".
- **Rule:** one testable sentence answering the domain's question; the aim, not the case (lesson R4). Written for a grown-up
  reader, plain English (house style: no "it's not X, it's Y", no dashes as punctuation).
- **Why:** Zafar's words in quotes with his date, or the lesson (R1-R9), or the row it came from.
- **Scope:** exactly one of `House` (every game: the shared kit or every mode), `Family` (the kitchen family: every Cook game but
  the pantry), `Game` (chai only). The 5 Nov "Engine" scope is gone: a rule the pantry or the stalls also need is House, else
  Family (decision 13).
- **Pattern / part:** a pattern P1-P14 (`patterns.md`) or `-`, then the glossary part (`glossary.md`) or `-`.
- **Checked by:** the tool that catches it, one or more terms joined by ` + `, each starting with one of these words, so
  `audit.mjs --standard` can read it:
  - `contract-NN` (a contract check, `build/sandbox/lib/contract*.mjs`)
  - `check:<name>` (a step of `build/tools/review/checks.mjs`, a static lint rule `check:static/<rule>`, or a screen-lint rule of
    `build/lint/layout.mjs` run by the sandbox, `check:layout/<rule>`)
  - `tool:<script>` (a review tool run in the audit: `tool:panelcheck`, `tool:labcheck`, `tool:leak`, `tool:loadtime`,
    `tool:teachgate`, `tool:shelfshot`, `tool:voicegate`, `tool:kitsheet`)
  - `probe:<ROW>` (the fix-list row's evidence probe in `build/sandbox/data/evidence.json`)
  - `doc:<where>` (a design doc or standing line read at every launch, e.g. `doc:/brief standing lines`, `doc:CLAUDE.md`)
  - `judge: <what to look at, which state, which size>` (the eye: Fable or Zafar)
  - `gap: <the tool that should catch it>` (no home yet; Zafar's 5 Nov rule: a rule with no tool is a gap in itself; Sprint 17's
    check builders and Sprint 18 close these)
  Name only checks that exist (grep for them). A check being built this sprint is still `gap:` with its name.
- **See it:** a lab link reachable in a minute (`lab.html?mode=cook&game=chai-tray&level=N`, `lab/kit.html`, `labs.html`), with
  the player (New player, Words known) and the size. Not "n/a" unless the rule has nothing to see (then `-`).
- **Status:** dated; a reversal keeps the history, newest first: `agreed 7 Nov (was: X, 3 Nov)`.
- **The last line (optional fields, keep the line):** `Layer:` shared kit / kitchen kit / kitchen kit, stove part / game (where
  the code that owns it lives: Sprint 18's map); `Lives in:` file(s); `Value:` a values.md name; `Impact:` stuck, wrong,
  feels bad, unfinished, cosmetic; `Source rows:` the row IDs it came from (every ID a rule came from goes here as well as in
  the fragment).

A page opens with its domain's one question, then one `## <area code> <area name>` heading per area (in the v2 table's order), each
with its rules. Short prose between rules only where a rule needs a picture of how parts fit.

## Patterns, glossary, values

- `patterns.md`: `### P1 · Free-space placement` (P1-P14 as in v2 §3, Fable's drafts in `build/reports/s17-standards-structure-review.md`
  §7.4), each: what it solves, the rule IDs that cite it, where the code is.
- `glossary.md`: one table `| Part (ours) | His words | Kit element (data/kit-elements.json) | File | Layer |`, about 25-40 parts.
- `values.md`: one table per area `| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |`;
  each value name is unique (rules cite it by name).

## The placement fragment (each standard builder: `build/reports/s17-std-placement-<n>.md`)

Every source ID (`node build/tools/review/stdids.mjs --sources` lists them: the change ledger's 118 changes, every ID the old chai
and kitchen pages cite, the CHAI rows cited only in chai-tray.js, chai's `*14` onboarding states as `onb:<key>`) that falls in your
domains gets one row in your fragment, one table:

```
| Source ID | Placed as | Where | Note |
|---|---|---|---|
| SH-213 | rule | STD-D1-07, STD-E4-03 | |
| CHAI-52 | value | breath before a light (values.md D1) | |
| SH-188 | lesson | R3 | two owners of the panel's scroll |
| CHAI-12 | not a standard | | a one-off art fix |
| onb:next-pan | retired | | Zafar, 3 Nov: no second-pan lesson |
```

`Placed as` is one of: `rule`, `value`, `lesson`, `not a standard`, `retired`. One ID can feed several rules (list them all in
Where). **When in doubt, place it:** an ID that feeds a rule in your domain is yours even if another domain also uses it; the stitch
merges doubles (a rule wins over "not a standard"), while an ID nobody places costs a later pass. Read every source ID once
(`--sources`; each ledger row's section hints at its domain) and place every one that touches your domains. Check yours: `node build/tools/review/stdids.mjs --check --fragments
build/reports/s17-std-placement-<n>.md --mine` (lists the IDs you placed and any rule ID you cite that no page defines yet).

## The proof scale (for the README and Sprint 18's gap pages)

0 not applicable · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 Zafar's "done"; or "different by design" with the
date he decided it.

## Proof

The structure: `build/reports/s17-standards-structure-v2.md` (Zafar's §8 answers, 5 Nov) and Sprint 18's decisions 11-13
(`docs/sprints/S18-kitchen-family.md`). The source list: `node build/tools/review/stdids.mjs --sources` (213 IDs on 7 Nov, 13:45 UK).
