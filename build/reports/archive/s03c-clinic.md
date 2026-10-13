# S03-C: every code-only clinic row, the fever room tidy, the old drill back

Branch `ccr-a7370759-t0lee7`. Not reviewed (builder's notes). Game code changed: yes. No mechanic removed.

## What changed
1. **Tooth** (`tooth.js`): the drill of before Sprint 2 (round bur, jagged decay; decision 72). S02's other tooth fixes kept.
2. **Fever** (`fever.js`, `fever.json`): heater on the floor right of the bed, turned to her; hand fan lying flat on the bed. S02's model, zone, tools and icons checked L1–L3.
3. **Diagnosis D3** (`diagnosis.js`): a one-tool card lost its tool line; it is now the headline. Standing girl and doctor bigger on phones (`scenes-v2.json` `stand.phone`; CLN-94, flaw 5).
4. **Eye** (`eye.js`): on tablets both eyes whole, the shelf down on the cheek, clear of the sore eye (flaw 5).
5. **Pharmacy** (`css/clinic.css`): the drops bottle hung below the belt; every item now stands on it (CLN-97).
6. **Rows** (decision 73): clinic 47 open → 8 (`statuscounts.mjs` agrees).

## Proof
- `checks.mjs`: unit 229/229, words 0 literals, bump ok, load 21/21. `check_onboard` ok. Leak bots: clinic (L1 blind 0.04%) and all 12 heal bots PASS. Fever rechecked with A's voice stop: her line, face and gauge agree at every change.
- Sandbox `s03c-quick` (17 flows, 1366×768): all reach their end, 0 page errors, **CHECK PASSED** (0 new, 195 fixed). Shotdiff manifest empty.
- Looked at: fever L1–L3, tooth L1, D3 on phones, eye on tablets, pharmacy L2. About 15 min of browser.

## Open
- CLN-01: other patients and the doctor wait for art (decision 71). CLN-14 left (decision 74). CLN-07, CLN-09, CLN-41: untouched.
- Belt still shows the tilted rough plaster and comb sprites: belt views wait on art (E2 two-colour plasters, Session D).
- The eye close-up's lower edge shows on tablets (face art ends above the screen's foot).
- QA checklist ⬜, for `/review`.
