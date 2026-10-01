/*
 * The plug-and-play demo (step 3, R3b): a tiny mode built ONLY from two adapters over existing mechanics, one of
 * Cook's (the pantry: Station lab "fetch") and one of the clinic's healing games (the scrape: "cut"), wrapped
 * without editing a Cook or clinic file. It runs in lab.html (each game alone, or the whole plan), in story mode
 * (data/arcs/demo.json: one chapter, one errand) and in free play (opened by that chapter), with the shared end
 * screen, the three badges and pocket money from the core. The worked example in
 * docs/architecture/building-games.md. A test-site mode (dev: true): never on the child's map.
 */
import { cookLab } from "./cook-adapter.js";
import { healGame } from "./heal-adapter.js";

const pantry = cookLab("fetch", { id: "pantry", gestures: ["tap"], levels: [1, 2, 3, 4], label: "Nani's pantry (Cook)" });
const scrape = healGame("cut", { id: "scrape", gestures: ["tap", "drag"], levels: [1, 2, 3], label: "The scrape (the clinic)" });

export default {
  id: "demo",
  dev: true,
  data: [],
  games: { pantry, scrape },
  // a lab asks for one game; otherwise the round is both, with a natural pause between them (a Conversation slot)
  plan(entry) {
    if (entry.game) return [{ game: entry.game, level: entry.level }];
    return { game: "helper", stages: [{ game: "pantry" }, { pause: "kitchen-to-clinic" }, { game: "scrape" }] };
  },
  lab: () => [
    { game: "pantry", label: "Pantry, through the Cook adapter", note: "Cook's own fetch station, unchanged, as a host stage." },
    { game: "scrape", label: "Scrape, through the clinic adapter", note: "The clinic's cut game, unchanged, as a host stage." },
    { game: null, label: "The whole demo round", note: "Pantry, a pause slot, scrape, then the one end screen.", levels: [1, 2, 3] },
  ],
  free: { endless: true },
  actions: ["again", "next", "list", "home"],
  states: () => ["demo/pantry", "demo/scrape", "results"],
};
