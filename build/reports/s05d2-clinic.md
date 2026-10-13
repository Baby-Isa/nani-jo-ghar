# S05-D2 clinic, round 2

Branch `ccr-a7370759-t0lee7`. Game code changed: yes.

**Changed.** Drinks (CLN-54): the drink's name is an item row with its recipe under it, one engine DoIt sentence per row (B's calls), each opened and said as its step comes; honey grey, no stir row, no L1 counts (`taste.js`, `kit.js` `head` rows). The L3 strip now drops an inflected count ("hakri chamchi", `host.js`). Clinic bulb (SH-41): the shared shim read fast mode once and had no `off()`; `main.js` reads the time at the press and ends it with the stage. Say pills are tagged by the shared Say (S2's hand-off, `common.js`). The clinic's own "···" closed-card column is gone (rule 8; four-line headline at 844x390, `clinic.css`).

**Proof.** checks.mjs: unit 288/288, 0 literals, specs 0 new, load 21/21; check_onboard ok; leak clinic: one cell, taste L1 10.3% (LNG-02, T). Touched (6 pages at 1366x768, `s05d2-touched`): contract 0 breaks, 0 new findings. The full touched list (122 rows) is left to `/review`. shotdiff: no approved manifest, so every shot reads NEW; flaws: blank cream frames mid-zoom (#13, #14, #31, #32), seen before.

| Row | Red | Green | Verdict |
|---|---|---|---|
| CLN-54 | 000055-mb6 | 000847-53r + real-pace pour sheet | sheet to judge |
| SH-41 | 001310-fyl (335 ms) | 001636-an4 (8001 ms) | time green; `!lexicon` expect: T |
| CLN-12 | 001849-t5f | real-pace rise sheet | sheet to judge |
| CLN-117 | 001849-t5f | 003222-odz | open: T (E4 never drawn) |
| CLN-11, -45, -48, LNG-02, CLN-111 | 001849-t5f / 003739-lsu | — | open: T (spec); game checked directly |

Runs `ev-20261013-…`; real-pace sheets in `build/screenshots/evidence/s05d2-real-pace/`.

**Open.** T2 pushed no clinic game FAILs; the rows it named are spec faults (causes in the rows). For `/review`: the pharmacy's hesitation hint writes the item at L3 (kept by decision 80). The CLN-54 pour probe should run at real pace.

**Orchestrator's asks.** Say tagging handed to the shared Say (cc53311); CLN-117 grey tags hold (ev-20261013-003222-odz); LNG-06 (ev-20261013-004051-y2u) fails only on familyOnly (no family clips: Mum). CLN-111: the current plan runs p1 only (no morning-end page planned): T. SH-41 stays open only on its `!lexicon` expect (T); its time is green (ev-20261013-001636-an4).
