/*
 * The farm as a mode plug-in (js/shared/mode.js: the mode interface), the MINIMUM for the photo shoot's prototype alone
 * (Zafar's notes, 1 Nov: build/reports/designs/prototype-notes-2026-11-01.md). Another builder makes the farm's other games
 * (feed, eggs, home at dusk, grow and pick) in this same mode on its own branch: when the two meet, this file is theirs plus
 * the photo shoot's three lines (the import, `photo` in games, its data file, its lab() entry).
 *
 *   lab.html?mode=farm&game=photo&level=1..4     the photo shoot alone (js/farm/photo.js)
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the game's runtime runs only in the browser.
 */
import { photo, PHOTO_DATA } from "./photo.js";

export default {
  id: "farm",
  data: [PHOTO_DATA],
  games: { photo },
  plan(entry) {
    return [{ game: entry.game || "photo", level: entry.level }];
  },
  lab: () => [{ game: "photo", label: "The photo shoot (prototype)", note: "Hannah Mami asks for photos: look round the farm, then tap the viewfinder.", levels: [1, 2, 3, 4] }],
  free: false,
  actions: ["again", "list", "home"],
  states: () => ["farm/photo", "results"],
};
