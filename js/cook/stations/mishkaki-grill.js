/*
 * Combined station: the Mishkaki grill (Wave 3 builds it here).
 *
 * Plan (docs/cook-with-nani-todo.md): skewers point away from you; the
 * order says how many and which kind (meat, veg, mixed: a "tally" slot);
 * tap the rack to put one on; each lands at a different time with its own
 * ring; juggle up to 3-4. Threading feeds it: a thread zone (out:
 * "skewers") beside a grill zone (in: "skewers", knob skewers: 3-4; the
 * grill mechanic already runs several skewers, each with its own ring).
 *
 * How: Cook.Mech.combined("mishkaki-grill", {station, view, zones: [...]}),
 * as in js/cook/stations/roll-tawa.js; levels in
 * data/stations/mishkaki-grill.json (dataFile); a lab entry with
 * Cook.Mech.lab("mishkaki-grill", {...}). cook.html already loads this
 * file. Guide: docs/cook-with-nani-recipes-guide.md.
 */
