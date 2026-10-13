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

**Round 3 (decision 93, SH-44).** The heal host passes the steps page its instruction list: every card row in order (the drink as its recipe rows, each judged by taste.js), label = asked = the engine line (to-record lines stay English, grey), done only as a count word (no English details reach the child), ok; v2 games only, two steps or more. Waiting room, diagnosis, pharmacy and send-off pass none (the patient end too: say if it should carry the heal game's steps). Checked directly (driver script, end screen `.rs-step`): red, cut L1 listed 2 of its 3 steps (no wash; "ne poi" lowercase), pharmacy 0; green, cut L1 3 (Pela paani, Ne poi cloth, ba dabs, Ne poi yellow plaster), taste L2 3 (pop, Dudh bhari chad!, Trae chamchi hardar wiji chad!), knee L1 2, fever L1 4, pharmacy 0. No clinic SH-44 evidence spec yet: T.
Whole patient (orchestrator, decision 93): the heal stage shows no end screen of its own there, and the shared host already gathers every stage's steps into the patient's one end screen, so the cut list arrives with no further change. Direct `.rs-step` check on patient=1 with cut, L1: red at fee20b4~1 (2 steps, wash missing), green at fee20b4 (3: Pela paani, Ne poi cloth, ba dabs, Ne poi laal plaster). The other stages add none.

**Round 4 (Zafar's heal ladder, 13 Oct; CLN-45).** New things by L2, L3 = L2 heard only, the old L3 extras moved to a new L4 (heal games may now reach L4: registry, level-up, host; boing, ear, fever stay at 3). Boing: coloured drops from L2. Foot: toe order from L2 (the sole art is level-1 only now: the toe channels don't fit it); narrow channels L4. Tooth: dabo/jamno from L2; 6 moves, 4 patches, timer, narrow green L4. Taste: na from L2; faster, more decoys L4. Eye: 4-picture row L4. Knee: 6-10 turns L4. Scrape: two-colour plasters L4. Fever untouched (decision 91). Red/green: a plan check per level (L3 vs L2) red in all seven, green in all seven; L4 played to the end (cut, taste, foot, eye, knee). Leak clinic 300: no problems (it doesn't run L4 cells: T). Contract-8 fixed on the way: no tint round the drink's recipe; the next band waits while a line is read (boing L2, foot/tooth pop-ups). Flaw: foot L2 now shows the stand-in sole.
Round 4, notes for the orchestrator (pushed 0858f31, f762a5a): unit 293/293 after `labs.html` was regenerated (`node build/gen_labs.mjs`: six heal games now list levels 1-4); words, specs, load and check_onboard ok. Sandbox pages `s05d2-ladder2`/`-ladder3` (boing, foot, tooth, taste L2; eye, knee L3): all reach the end, contract 0 breaks (the base had 3 contract-8 breaks: foot/tooth pop-ups and taste's tinted recipe box). For T: no L4 heal flows in the sandbox and no L4 cells in the leak bot yet; tooth L4 needs a driver that holds the fill button (my direct check stopped there). For S: `Kit.Card` now holds the next band while a line is read (decision 95); the shared card's other modes may want the same. For Zafar: foot L2 shows the stand-in sole (the toe channels don't fit the art) until the art's toes are re-placed.
