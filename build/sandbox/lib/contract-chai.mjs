// Chai's method, checked game by game (s08 wave 4B; Sprint 17, s17-chk1): the checks that were chai's alone now read the per-game data
// list, build/sandbox/data/games.json. s19-checks-2 (the check sort's G5): no opt-ins; the list holds each game's stations only and every
// check judges every game. This file loads the list, keeps contract-35's design exception (CHAI_ROW) and contract-91's stages
// (helpStageRe), and describes its checks, numbered from 70, now judged in lib/contract-s19b.mjs from the screen and the shared paths:
//   contract-70 slow-at-green  every timed window's turn-off call as its heat ring enters the green (CHAI-24, Zafar 17 Oct, P56)
//   contract-71 once-each      every add finds an open row on the card: a second tap adds nothing (CHAI-22, P33)
//   contract-90 card-light     a new player sees the order card's next item lit after the first item (CHAI-37)
import { readFileSync } from "node:fs";

export const GAMES_FILE = new URL("../data/games.json", import.meta.url);
export const readGames = (file = GAMES_FILE) => JSON.parse(readFileSync(file, "utf8"));
// the list in use (setGames swaps it, for a test); a missing or broken file is an empty list
export let GAMES = (() => { try { return readGames(); } catch (e) { return { games: {} }; } })();

// a Cook flow's route and station: cook:samosa@L3 -> cook, samosa; cook:recipe:chai -> recipe, chai; lab:cook/recipe-chai -> lab-recipe,
// chai (the same station as lib/contract.mjs stationOf)
const FLOW = /^(?:cook:(recipe:)?|lab:cook\/(recipe-)?)([\w-]+)/;
export function flowParts(flow) {
  const m = FLOW.exec(flow || "");
  if (!m) return null;
  const lab = /^lab:/.test(flow);
  return { route: lab ? (m[2] ? "lab-recipe" : "lab") : m[1] ? "recipe" : "cook", station: m[3] };
}
// (s19-checks-2, the check sort's G5: no opt-ins. The per-game check fields are gone from data/games.json: every check judges every game
// from what is on screen and the shared notes; what stays here is the list's own shape, and the few design exceptions, as data in code)
const entries = () => [...Object.entries((GAMES && GAMES.games) || {}), ...Object.entries((GAMES && GAMES.hosts) || {})];
// a set of stations with .test, as the regular expressions it replaced had
const fixedSet = (ids, why) => ({ test: (st) => ids.includes(String(st || "")), list: () => ids.slice(), toString: () => `${why}: ${ids.join(", ")}` });
// contract-35: chai's order card keeps its item words written at L3-L4 (Zafar, 29 Oct, chai level rules: never dotted); every other card dots
export const CHAI_ROW = fixedSet(["chai-tray"], "the card written at L3-L4");
// contract-91's play stages: every stage kind of the list's stages (data/games.json stages: Cook's and the clinic's)
export let helpStageRe = /(?!)/;
function derive() {
  const src = Object.values((GAMES && GAMES.stages) || {}).flat();
  helpStageRe = src.length ? new RegExp(src.join("|")) : /(?!)/;
}
derive();
// swap the list in use (a test); returns the one it replaced, to put back
export function setGames(data) {
  const was = GAMES;
  GAMES = data || { games: {} };
  derive();
  return was;
}
/** A list entry may hold no check field (s19-checks-2): the names it holds that are not its shape (family, stations). */
export const CHECK_FIELDS = ["help", "controlCalls", "slowAtGreen", "onceEach", "cardLight", "s14Taps", "decoys", "cardWritten"];
export const fieldsLeft = (games = GAMES) => entries().filter(([, g]) => g && CHECK_FIELDS.some((f) => g[f] != null)).map(([id, g]) => `${id}: ${CHECK_FIELDS.filter((f) => g[f] != null).join(", ")}`);

export const CHAI_CHECKS = {
  "contract-70": { item: "slow-at-green", title: "the turn-off call at the green, every timed window", how: "Cook flows: every timed window the kitchen kit draws (its heat ring, Cook.Kit.heatRing: the s19ring sample, its level and green as drawn; chai's pans, eggs, corn, maani, samosa, the boil): as a ring enters its green a call line (role call, voiced) must start, from 300 ms before to the moment the ring is 0.06 past the green's edge at a child's speed (0.06 times Cook's test speed: the ring fills that much faster, a voice does not; and 400 ms of sampling); one call may serve rings entering within 1.5 s of each other. A call said earlier while the ring was still short of the green is 'called early'; none at all is a break (CHAI-24, P56: 'so that you don't think you have to stop it early'). Once per page. No opt-in (s19-checks-2): it read chai's chai-slow note, judged chai alone, and counted a call the game queued and never said." },
  "contract-71": { item: "once-each", title: "once each into a pan", how: "Cook flows, in a station: every tick of the order card (Cook's tick path, UI.mission.tickItem, the s19tick sample: the item and the row it found) must find an open row that wants it and never count a row past its need: an add no row wants, or a row counted past its need, is a second one (a second tap adds nothing: CHAI-22, P33). A station's own add notes (chai's chai-add, who:count; any note named *-add) are read too: a count of 2 or more without :again or :capped is a break. Once per page. No opt-in (s19-checks-2)." },
  "contract-90": { item: "card-light", title: "the next item lit for a new player", how: "chai-tray's cook flows, a new player (not #returning, #mistake or #takeback): once the first item (the tea, chai-add cook-chai) has gone into a pan and another item follows, if the child paused 2.5 s or more, the station must have lit the order card's next item (its card-light note; CHAI-37, Zafar 4 Nov). Chai's own design; every game's card light is the check sort's G6 (the light over time, from the frames). No games.json field since s19-checks-2." },
};
