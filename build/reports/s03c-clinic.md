# S03-C: every code-only clinic row, the fever room tidy, the old drill back

Branch `ccr-a7370759-t0lee7`. Not reviewed (builder's notes). Game code changed: yes. No mechanic removed.

## What changed
1. **Tooth** (`tooth.js`): the drill of before Sprint 2 (round bur, jagged decay; decision 72). S02's brush, plaque, mouth, filling and "ow" kept.
2. **Fever** (`fever.js`, `fever.json`): heater on the floor right of the bed, turned to her; hand fan lying flat on the bed. S02's ±2/3/4 model, one zone, tool column, icons, no gust checked at L1–L3.
3. **Diagnosis D3** (`diagnosis.js`): a one-tool block lost its head (the order card's "direct" card): the tool's line is now the headline. Standing girl and doctor bigger on phones (`scenes-v2.json` `stand.phone`; CLN-94, flaw 5).
4. **Eye** (`eye.js`): on tablets both eyes whole, the shelf down on the cheek, clear of the sore eye (flaw 5).
5. **Pharmacy** (`css/clinic.css`): the drops bottle hung below the belt; every item now stands on it (CLN-97).
6. **Rows** (decision 73): clinic 47 open → 8 (`statuscounts.mjs` agrees). Each changed row names what was checked.

## Proof
- `checks.mjs`: unit 229/229, words 0 literals, bump ok, load 21/21. `check_onboard` ok. Leak bots: see the last line.
- Sandbox `s03c-quick` (17 flows, 1366×768): all reach their end, 0 page errors, **CHECK PASSED** (0 new, 195 fixed). Shotdiff: manifest empty (101 new).
- Probes looked at: fever L1/L3 (1366, 1024), L2 (844); tooth L1; D3 L2 at 844×390, 800×360; eye L1 at 1024×768, 1180×820; pharmacy L2. About 14 min of browser time.

## Open
- CLN-01: other patients and the doctor wait for art (decision 71). CLN-14 left (decision 74). CLN-07, CLN-09, CLN-41: old rows, untouched.
- Belt still shows the tilted rough plaster and comb sprites: belt views wait on art (E2 two-colour plasters, Session D).
- The eye close-up's lower edge shows on tablets (face art ends above the screen's foot).
- Fever's stale "too hot" bubble over a green gauge: should be gone with A's voice stop; recheck in `/review`.
- QA checklist ⬜, for `/review`.
