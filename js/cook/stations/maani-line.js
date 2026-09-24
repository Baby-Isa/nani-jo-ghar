/*
 * Combined station: the Maani line (Wave 3 builds it here).
 *
 * Plan (docs/cook-with-nani-todo.md): three zones, dough bowls (maani /
 * bajr jo maani) -> chakla (roll) -> tawa. The order sets how many of each;
 * production line vs "roll them all first" is a real decision (the tawa
 * won't wait). Big/small as a later level.
 *
 * How: Cook.Mech.combined("maani-line", {station, view, zones: [...]}), as
 * in js/cook/stations/roll-tawa.js; levels in data/stations/maani-line.json
 * (dataFile); a lab entry with Cook.Mech.lab("maani-line", {...}). cook.html
 * already loads this file. Guide: docs/cook-with-nani-recipes-guide.md.
 */
