/*
 * The farm as a mode plug-in (proto-farm, 1 Nov 2026): Zafar's four farm prototypes, played in the labs so he can give
 * feedback. Hannah Mami hosts (not Nani). The spec is his notes of 1 Nov (build/reports/designs/prototype-notes-2026-11-01.md,
 * "The farm" and "Every game"); what each game does at each level is in build/reports/proto-farm-2026-11-01.md.
 *
 *   lab.html?mode=farm&game=feed&level=1         feeding time: up to four animals in an arc, a tray in front of each
 *   lab.html?mode=farm&game=eggs&level=1         the eggs: hens on a perch, a tap lifts one, her eggs under her
 *   lab.html?mode=farm&game=home-dusk&level=1    home at dusk, with hide and seek
 *   lab.html?mode=farm&game=grow-pick&level=1    plant, water, grow, then pick
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/farm/play.js) is imported only when a stage starts.
 *   lab.html?mode=farm&game=photo&level=1        the photo shoot (js/farm/photo.js, merged from proto-photo)
 *
 * The screen and its rules are js/farm/kit.js (chai's patterns on the shared kit); the pictures js/farm/art.js.
 */

import { photo, PHOTO_DATA } from "./photo.js";

/** What the farm needs on a host page beyond what lab.html loads (the s14 word card, the focus; the farm's sheet). */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/focus.js"],
  styles: ["css/farm.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["feed", "Feeding time", "Up to four animals in an arc, a tray in front of each: tap a food basket, then the tray, as many times as Hannah Mami says."],
  ["eggs", "The eggs", "Hens on a perch: tap a hen and she hops up; her eggs are under her. All the eggs, half, or so many from the big, small, red or white hen."],
  ["home-dusk", "Home at dusk", "Three homes, the farmyard at dusk: find the animals (some are hiding), tap one, then its home."],
  ["grow-pick", "Plant, water, grow, pick", "One row of four plots: plant the sapling, water it, watch it grow, then pick what she asks for."],
];

function farmGame(id) {
  return {
    id,
    gestures: ["tap"],
    levels: [1, 2, 3, 4],
    needs: NEEDS,
    mount(el, ctx) {
      let api = null;
      let stopped = false;
      return {
        async start() {
          ctx.test.state("loading");
          const m = await import("./play.js");
          if (stopped) return;
          api = await m.play(id, el, ctx);
          if (stopped && api) api.destroy();
        },
        destroy() {
          stopped = true;
          if (api) api.destroy();
          api = null;
        },
      };
    },
  };
}

export default {
  id: "farm",
  data: [PHOTO_DATA],
  games: { ...Object.fromEntries(GAMES.map(([id]) => [id, farmGame(id)])), photo },
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => [
    ...GAMES.map(([game, label, note]) => ({ game, label, note })),
    { game: "photo", label: "The photo shoot (prototype)", note: "Hannah Mami asks for photos: look round the farm, then tap the viewfinder.", levels: [1, 2, 3, 4] },
  ],
  free: false,
  actions: ["again", "list", "home"],
};
