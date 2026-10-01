# Step 3, R5 "The clinic onto the framework, and the heal games' shared play rules"

Branch `ccr-fcd9dddd-wnywzc`. Nothing removed beyond the 1 Oct report + decision 27.

## What moved
- **Mode plug-in** (`js/clinic/main.js`): five stages and 12 heal games as host mini-games; `clinic.html` (labs, One patient, a morning = one host round per patient + close-the-clinic) and `lab.html?mode=clinic`. One purse; clinic save namespace `clinic` (no coins); word evidence via `ctx.mark`.
- **Kutchi out of code:** `data/clinic/lang.json` (Cook's ids, nothing new) said by `js/clinic/lang.js`, the core Lang's clinic source. `build/check_clinic_kutchi.mjs`: none left.
- **Play rules** (nine v2 games; tummy/hic/hair as they were): D5, D6, D7, D8, D9, D10, D11 (8 s, data), D12 (eye badge), D13 (first round unscored), D14 (tick badge → steps), D16, SH-46.
- **Staging D1/D2:** exam room → zoom → close-up → zoom out → "thank you, I feel better" (to record). Stand-ins; angle in data.
- **Bugs:** CLN-49, CLN-51 (drill art), CLN-60, SH-09 (test), CLN-45 (scrape L3 two plasters), receipt stars → ticks, guide mute.

## Rows
Built, not re-played: SH-38–46, CLN-42–45, 47, 49, 51, 60; SH-09 rechecked. Partly: SH-40 (next tool closes a step in scrape/knee/ear/boing; ✓ stays for last counted step). Open (redesigns D15a–i): CLN-46, 48, 50, 52–59, 61–65.

## Checks
CSS lint 416 → 375 (`css/clinic.css` 42 → 1). Unit: R5 5, host 41, core 42 pass; check_onboard, check_arcs, gen_labs ok; leak bots pass; browser `build/test_clinic_r5-browser.mjs` 6/6. Sandbox `--touched clinic:` (215 pages, all sizes): new findings fixed and those flows re-run clean; every flow ends. 1,136 baseline entries now fixed (baseline not shrunk). Cook/first/parked smoke: no regression at baseline sizes; first launch at 800×360 now 0 new (the guide's mute fixed).

## Tablet and zoom sheets
`build/shoot_clinic_zoom.mjs` → `build/screenshots/r5/zoom/sheet-<game>.png`, 1366×768, 844×390, 1024×768: wide → push-in → close-up → pull-out for all nine. Flaw: close-ups don't grow on tablets (fixed 800×500 drawing).

## Cook must adopt
`ctx.look()` / `ctx.lookable()` (eye badge at L4), `ctx.done({steps})` for D14, D5 at L1 if Zafar says, Kit/UI bulb `onOn`/`onOff` to open a closed card. Shared edits: host, results, order-card (corner eye, no gold peek ring), bulb, guide (phone packing), say (48 px pills).

## Left
Redesigns D15a–i with real close-up art (side-on poses, per-tablet framing); bulb time tuning; `bump_version.py` mapping; baseline shrink at the gate; one-at-a-time rows for tooth's brush order (6 at L3).
