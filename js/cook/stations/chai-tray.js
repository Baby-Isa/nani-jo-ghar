/*
 * Combined station: the Chai tray (Wave 3 builds it here).
 *
 * Plan (docs/cook-with-nani-todo.md): cups with family faces on a tray;
 * each person's milk, sugars, half/full (a "people" slot in the recipe);
 * the boil on the back burner to watch while you do the cups. Likely zones:
 * boil (the pan) + a tray zone running pour (profile "cup", source = the
 * pan) and count for each cup.
 *
 * How: Cook.Mech.combined("chai-tray", {station, view, zones: [...]}), as
 * in js/cook/stations/roll-tawa.js; levels in data/stations/chai-tray.json
 * (dataFile); a lab entry with Cook.Mech.lab("chai-tray", {...}). cook.html
 * already loads this file. Guide: docs/cook-with-nani-recipes-guide.md.
 */
