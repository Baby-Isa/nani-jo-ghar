# Hands out + results badges fixes (28 Sept)

**Hands:** `cook.html` no longer loads `js/cook/hands.js` (tag commented
out; file/art kept). All call sites already guard on `Cook.Hands ? … : …`,
so this alone disables hands everywhere. Clinic never used it. Re-enable
note in `docs/cook-with-nani-todo.md`.

**Results:** re-cut `stopwatch-pb`/`icon-bulb` with `cut_glow.py` (glow
fringed under the grey-key cutter); other cuts checked clean. Time text:
smaller, weight 500, centred on the face. Tick: new duotone
`tick-gold-fill`/`tick-grey.webp` (recoloured from existing art) replace
green/red for right/wrong; gold+glow `tick-gold` still covers all-right.
Page 2's green/red untouched.

**Judgment call:** pre-recoloured webp over CSS filters for precise colour.

**Verification, all pass:** cook lab, shared-ui tests; shots at
1366x768/390x844 in `results-badges/`; 4 mobile pages: 0 errors, no
Hands.
