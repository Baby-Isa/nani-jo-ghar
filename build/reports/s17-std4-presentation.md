# s17-std4: the standard's E Presentation, the glossary and the values sheet (7 Nov)

Builder 4 of Sprint 17's standard (Opus, high). Docs only (Zafar, 7 Nov, decision 3: lighter checks): no browser, no evidence
run, no contract run, no judge.

## What changed

| File | What | Words (`wc -w`) |
|---|---|---|
| `docs/design-language/standard/e-presentation.md` | domain E: 29 rules in six areas, each the eight fields and the Layer line | 2,490 |
| `docs/design-language/standard/glossary.md` | 40 parts in four tables: ours, his words, the kit element, the file, the layer | 1,103 |
| `docs/design-language/standard/values.md` | 16 area tables, every number the rules use, each with what it is derived from, its token or "to tokenise", and whether a family may change it | 2,462 |
| `build/reports/s17-std-placement-4.md` | the fragment: 123 source IDs placed | - |

## Rules per area and scope

| Area | Rules | House | Family | Game |
|---|---|---|---|---|
| E1 The frame | 5 | 5 | 0 | 0 |
| E2 Components | 8 | 8 | 0 | 0 |
| E3 Art and materials | 5 | 2 | 3 | 0 |
| E4 Motion | 4 | 3 | 1 | 0 |
| E5 Sound and voice | 5 | 5 | 0 | 0 |
| E6 Tokens | 2 | 2 | 0 | 0 |
| **Total** | **29** | **25** | **4** | **0** |

Rules were merged until each page fit 2,500 words: E2 is one entry per part (the bubble's place and contents are one rule; the
tray faces went into the face circle's "beside what it owns", so chai has no Game rule left in E). Layers: 25 shared kit, 2 kitchen
kit, 3 kitchen kit stove part (E5-04 is shared kit with its boil sound in the stove part).

## Gaps (Checked by `gap:`: the list Sprint 18's check work closes)

| Rule | The check that should catch it |
|---|---|
| STD-E1-02 | a contract that the side panel holds its sizes while a card opens or shuts (SH-210 is filmed by its probe only) |
| STD-E2-06 | a contract on a bubble's and a reply's word size against the order card's, and the tail against the speaker |
| STD-E3-02 | an audit list of code-drawn effects (ledger lesson 10) |
| STD-E3-05 | an art check that every character at a counter has a behind-the-counter pose |
| STD-E4-01 | a frame-by-frame jump check on every kit motion (the panel's scroll logger exists; no contract reads it) |
| STD-E4-03 | a contract that the boil picture shows before the green at every level |
| STD-E4-04 | a contract timing the word moment's holds |
| STD-E5-03 | a loudness check on each effect in `js/shared/sfx.js` (SH-196's click was a 30 ms tone at a twentieth of the volume) |

Eight gaps. Five rules also use the judge (E3-01, E3-03, E3-04, E3-05, E4-03).

## Values written for the other domains

Every value of mine has a row, and values.md also carries the obvious numbers of the other domains, for builders 1, 2, 3 and 5 to
cite by name: 0.2 (four sizes, phone, tablet); A2 (card by level, pill right in a row, word hold, reveal English shown); B2 (level
speed, heat to the green, green at L4, boil lead); B3 (count by level, half, full, pours to the amount); C2 (decoys, "no" asks,
level up, people at the counter); D1 (breath before a light, call after its light, card light after the last move, still-kitchen
wait, light time, zoom-in, next-pan light, light after the dots, light pad, light corner, dim, hop, finger); D2 (hint wait, hint
stages, help comes); D3 (Nani's line room, Nani's box fold); F4 (picture retries, load time growth, site size); H1 (art queue).
The check thresholds (G1) were cut for length; they live in the checks themselves.

## IDs placed

123 of the 213 source IDs: 95 rule, 12 value, 14 not a standard (the art queue and its game art rows, H1's to own), 2 retired
(CHAI-12, reversed 29 Oct: the heat ring over the handle; CHAI-26, superseded 29 Oct: no tilted pan). Unsure, placed anyway:
CHAI-59 (as rule: it was retired into CHAI-43, so STD-E2-05 carries it), SEK-14 (not a standard: sekelo's racks follow E3-02 on
its gap page), SH-148 (rule E1-03 for "no scroll bar"; its order-card flow is B's), SH-174 (E4-01; F4 may claim it), CK-53 (E1-05
without a place for the cog: built 28 Oct at the panel's foot, while `data/rules.json` says top right of the play area, 29 Oct),
CLN-218 (the clinic's side card, under E2-03), CHT-17 (chaat's labels, under E1-05).

## Questions for Zafar (answerable "yes to all except ...")

1. **The item card's padding floor (SH-190).** The fix asked for equal padding "at least a set minimum"; the code pads 2.6% of the
   row's width, the formula that caused it, and I found no separate floor. *Recommended:* keep 2.6% with a 4 px floor, written in
   values.md as a token.
2. **The word moment's last hold.** The ledger says both cards are held 2.4 s (CHAI-70); the code holds 2.2 s ("a couple of
   seconds"). *Recommended:* 2.2 s, as built and signed off.
3. **A step's call and its light.** The chai page says the call comes "a beat after its light" (CHAI-40); `data/rules.json`
   callAfterLightMs is 0 and contract-78 wants them within 200 ms. values.md records 0. *Recommended:* 0, together (builder 3's to
   confirm in D1).
4. **Decoys by level.** `data/rules.json` says 1, 2, 3, 4 with L4's a lookalike; contract-37's title says 1, 2, 3, then 3 with a
   lookalike. *Recommended:* the rules file (the fourth is the lookalike); the contract's title reworded.

## For the orchestrator (format)

- I used `check:layout/<rule>` (text-clipped, tap-small, text-small, scroll-container) for the screen lint (`build/lint/layout.mjs`),
  which the sandbox runs rather than `checks.mjs`. The format names `check:static/<rule>` only; please add `check:layout/<rule>` or
  tell me the word to use.
- Value names cite their area as "(values.md D1)"; an area with no numbers has no table (G1, D4 and A1 were folded or left out).

## Proof

- `node build/tools/review/stdids.mjs --check --fragments build/reports/s17-std-placement-4.md --mine`: "213 source IDs; 123 placed
  in the fragments; 90 unplaced; 29 rules defined; 0 problem(s)".
- A scratch validator over e-presentation.md: every block has the eight fields and the Layer; every Checked-by term starts with a
  format word; every contract number is in the registry (`build/sandbox/lib/`), every `tool:` a script in `build/tools/review/` (or
  `voicegate`), every `check:static/`, `check:layout/` and `check:` name a real rule or step, every `probe:` a row in
  `build/sandbox/data/evidence.json`; every value a rule cites is a row of values.md, and value names are unique.
- `wc -w`: e-presentation.md 2,490, glossary.md 1,103, values.md 2,462 (each at most 2,500).
- `node build/tools/review/checks.mjs`: see the last line below.
