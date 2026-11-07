# The standard

Every rule chai earned (the reference game, signed off by Zafar on 7 Nov), so any game can show it meets it. It replaces
`docs/design-language/chai-standard.md`. The structure is Zafar's, locked 5 Nov (`build/reports/s17-standards-structure-v2.md`, §8):
the unit is a rule, one testable sentence, and a rule no tool checks is a gap in itself.

## The pages

| Page | What it holds |
|---|---|
| `README.md` | This index: the scopes, the layers, the proof scale, how a family uses the standard, the rule format |
| `0-foundations.md` | 0 Foundations: is it allowed, and for whom? The non-negotiables as pointers to CLAUDE.md; who the game is for |
| `a-learning.md` | A Learning: what does the child learn, honestly? The words, the word card's support, the word moment, language lines |
| `b-play.md` | B Play: what does the child do? The round's steps, the mechanic, counts and amounts, feel |
| `c-progression.md` | C Progression: how does it change over time? Within a round, across levels, the word ladder, games and days |
| `d-guidance.md` | D Guidance: how does the child know what to do? The first time, when stuck, Nani's box, feedback, the grown-ups' door |
| `e-presentation.md` | E Presentation: what does it look, move and sound like? The frame, components, art, motion, sound, tokens |
| `f-build.md` | F Build: how is it made so the next game inherits it? Kit and game, one source of numbers, state, devices, test hooks |
| `g-proof.md` | G Proof: how do we know, before Zafar plays? Checks, played evidence, the judge, his play; the lessons R1-R9 |
| `h-supply.md` | H Supply and roll-out: how do art, voice and a new family arrive? |
| `glossary.md` | Our name for every part, his words for it, its kit element, its file and layer |
| `patterns.md` | The 14 patterns (P1-P14): reusable solutions the rules cite |
| `values.md` | Every number the rules use, one table per area, each with what it is derived from |
| `placement.md` | Every source ID (the change ledger, the old chai and kitchen pages, chai's code), placed once: the proof nothing was dropped |
| `gaps/<game>.md` | Each game's gap to the standard, rule by rule on the proof scale (Sprint 18's game builders write them) |

## The three scopes

Every rule has exactly one scope (Sprint 18's decision 13, 7 Nov; the 5 Nov "Engine" scope folded into these):

- **House:** every game, in every mode. A rule the pantry or the fetch-and-serve stalls also need is House.
- **Family:** the kitchen family ("Make in the kitchen (a recipe)": every Cook game but the pantry; Zafar, 7 Nov, decision 11).
- **Game:** chai only.

## The three layers

Where the code that owns a rule lives (Zafar, 7 Nov, decision 13). A fix goes in the lowest layer that owns it, once, and reaches
every game from there; no game copies kit code, and no kit code names a game.

- **Shared kit:** `js/shared/`, `js/cook/ui.js` (and the core under it: `js/core/`, progress, voice, the language engine). Every game; and whatever the pantry and the stalls also need: the shelf
  and its pills, the order's flow and timings, lights and lessons, serving to a customer.
- **Kitchen kit:** `js/cook/kitchen-kit.js`, `js/cook/mechanics/`. Every kitchen game: the worktop, board and knife, pans, pouring.
  Its **stove part** (burners, knobs, heat, the boil and its sound) only for games that cook with heat.
- **Game:** the game's settings file plus its own mechanic (chai: `js/cook/stations/chai-tray.js`, its rows in `data/cook.json`).

## The proof scale

How far a rule is proven for a game, one number per cell of a gap page:

| Score | Means |
|---|---|
| 0 | not applicable |
| 1 | missing |
| 2 | built, unproven |
| 3 | check green (its Checked by passes) |
| 4 | judged (the judge passed it on a picture or film) |
| 5 | Zafar's "done" |

Or **different by design**, with the date he decided it.

## How a family uses the standard

1. **Inherit House as it is.** Every House rule applies; the family proves it, never rewrites it.
2. **Copy Family as a start.** A new family (fetch and serve is next) reads the kitchen family's rules and writes its own, keeping
   the aim and changing the case; its values are re-derived from "derived from" in `values.md`, never copied.
3. **Leave Game behind.** Chai's own rules are chai's.
4. **Score each game** on its gap page (`gaps/<game>.md`): every rule, the proof scale, the next step (Kit, Adopt, Game code, Art,
   Words, Decision, Check). `audit.mjs --standard <game>` reads each rule's ID and Checked by.

## The rule format

The exact shape is the format note's rule block (`build/reports/s17-standard-format.md`, "The rule block"). In short, each rule is a
`####` heading `STD-<area>-<nn> · <the rule>`, then seven lines:

- **Why:** Zafar's words in quotes with his date, a lesson (R1-R9), or the row it came from.
- **Scope:** House, Family or Game.
- **Pattern / part:** a pattern (P1-P14) or `-`, then its glossary part or `-`.
- **Checked by:** terms joined by ` + `, each starting `contract-NN`, `check:<step>`, `tool:<script>`, `probe:<ROW>`, `doc:<where>`,
  `judge: <what, which state, which size>` or `gap: <the tool that should catch it>`. Only checks that exist; a check still to build
  is a gap.
- **See it:** a lab link, the player (New player, Words known) and the size; `-` if nothing to see.
- **Status:** dated; a reversal keeps its history, newest first.
- **The last line:** Layer, Lives in, Value (a `values.md` name), Impact (stuck, wrong, feels bad, unfinished, cosmetic), Source rows.

IDs are never reused: a retired rule keeps its block, Status "retired <date>: why". Pages stay under 2,500 words, this one under 1,000.
