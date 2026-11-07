// Chai's method, checked game by game (s08 wave 4B; Sprint 17, s17-chk1): the checks that were chai's alone now read the per-game data
// list, build/sandbox/data/games.json, so a game is checked the day its entry says so (README: "The per-game data list"). This file
// loads the list and gives the other contract files what they read from it: CONTROL_CALLS (contract-78, lib/contract-s14.mjs), the
// station sets S14_TAPS, CHAI_ROW, DECOY_STATIONS, DECOY_AT_LEAST and helpStageRe (lib/contract.mjs). Its own checks, numbered from 70,
// are judged from the station's own test notes (Lifecycle.note, only logged: lib/contract-hook.mjs passes them on as k "life" with
// what, reason = the note's step, by):
//   contract-70 slow-at-green  a game's turn-off line (slowAtGreen) is called as the heat bar enters the green, never before it and not
//                              well past it (CHAI-24, Zafar 17 Oct, P56)
//   contract-71 once-each      a game's once-each things (onceEach) go into a pan once each: a second tap adds nothing (CHAI-22, P33)
//   contract-90 card-light     a new player at L1 sees the order card's next item lit after the first item (cardLight; CHAI-37)
import { readFileSync } from "node:fs";

export const GAMES_FILE = new URL("../data/games.json", import.meta.url);
export const readGames = (file = GAMES_FILE) => JSON.parse(readFileSync(file, "utf8"));
// the list in use (setGames swaps it, for a test: a fake game added is checked); a missing or broken file is an empty list
export let GAMES = (() => { try { return readGames(); } catch (e) { return { games: {} }; } })();
export const SLOW_LATE = 0.06; // the default for a slowAtGreen entry without its own "late"

// a Cook flow's route and station: cook:samosa@L3 -> cook, samosa; cook:recipe:chai -> recipe, chai; lab:cook/recipe-chai -> lab-recipe,
// chai (the same station as lib/contract.mjs stationOf)
const FLOW = /^(?:cook:(recipe:)?|lab:cook\/(recipe-)?)([\w-]+)/;
export function flowParts(flow) {
  const m = FLOW.exec(flow || "");
  if (!m) return null;
  const lab = /^lab:/.test(flow);
  return { route: lab ? (m[2] ? "lab-recipe" : "lab") : m[1] ? "recipe" : "cook", station: m[3] };
}
const entries = () => [...Object.entries((GAMES && GAMES.games) || {}), ...Object.entries((GAMES && GAMES.hosts) || {})];
// a check's entry for a game: its own stations (or the game's), its own routes (or all)
const stationsOf = (g, conf) => (conf && typeof conf === "object" && Array.isArray(conf.stations) ? conf.stations : g.stations || []);
const routesOf = (conf) => (conf && typeof conf === "object" && Array.isArray(conf.routes) ? conf.routes : null);
// the games whose entry for a check (field) covers this flow: [{ id, game, conf }]
export function gamesFor(field, flow) {
  const p = flowParts(flow);
  if (!p) return [];
  const out = [];
  for (const [id, g] of entries()) {
    const conf = g && g[field];
    if (conf == null || conf === false) continue;
    const routes = routesOf(conf);
    if (stationsOf(g, conf).includes(p.station) && (!routes || routes.includes(p.route))) out.push({ id, game: g, conf });
  }
  return out;
}
// the stations a check covers (a field set, and when given, its value passing want), read live from the list: has .test as the
// regular expressions it replaced had
export function stationSet(field, want = () => true) {
  const all = () => {
    const s = new Set();
    for (const [, g] of entries()) if (g && g[field] != null && g[field] !== false && want(g[field])) for (const st of stationsOf(g, g[field])) s.add(st);
    return s;
  };
  return { test: (st) => all().has(String(st || "")), list: () => [...all()], toString: () => `stations with ${field}: ${[...all()].join(", ") || "none"}` };
}
export const S14_TAPS = stationSet("s14Taps");
export const CHAI_ROW = stationSet("cardWritten");
export const DECOY_STATIONS = stationSet("decoys");
export const DECOY_AT_LEAST = stationSet("decoys", (v) => v === "atLeast" || (v && v.rule === "atLeast"));
// contract-78's calls by station (lib/contract-s14.mjs reads CONTROL_CALLS[station]): rebuilt in place when the list changes
export const CONTROL_CALLS = {};
// contract-91's play stages on chai's method: the stage kinds any listed entry's help names (data/games.json stages)
export let helpStageRe = /(?!)/;
function derive() {
  for (const k of Object.keys(CONTROL_CALLS)) delete CONTROL_CALLS[k];
  for (const [, g] of entries()) {
    const c = g && g.controlCalls;
    if (!c) continue;
    for (const st of stationsOf(g, c)) CONTROL_CALLS[st] = [...new Set([...(CONTROL_CALLS[st] || []), ...(c.words || [])])];
  }
  const kinds = new Set(entries().map(([, g]) => g && g.help).filter(Boolean));
  const src = [...kinds].flatMap((k) => ((GAMES && GAMES.stages) || {})[k] || []);
  helpStageRe = src.length ? new RegExp(src.join("|")) : /(?!)/;
}
derive();
// swap the list in use (a test adds a fake game); returns the one it replaced, to put back
export function setGames(data) {
  const was = GAMES;
  GAMES = data || { games: {} };
  derive();
  return was;
}

const gameNames = (field) => entries().filter(([, g]) => g && g[field]).map(([id]) => id).join(", ") || "none yet";
export const CHAI_CHECKS = {
  "contract-70": { item: "slow-at-green", title: "the turn-off line at the green", how: `Cook flows of the games with a turn-off call (data/games.json slowAtGreen: ${gameNames("slowAtGreen")}): every note the station logs as it calls the turn-off step (chai: Lifecycle chai-slow, "Slow kar": the heat bar's level as a fraction, by: the green band's lo/hi and whose pan) must have the level at or above lo and at most 0.06 past it (the game's late; the bar has just entered the green: P56, 'so that you don't think you have to stop it early'). A round where a pan was turned down in or past the green (chai-down, the level as it was turned down) with no call at all is a break too.` },
  "contract-71": { item: "once-each", title: "once each into a pan", how: `Cook flows of the games with once-each things (data/games.json onceEach: ${gameNames("onceEach")}): every note the station logs as one of them is tapped for a pan (chai: Lifecycle chai-add for milk cook-dudh, water cook-paani, the tea leaves cook-chai: the thing, then who:count, with :again when the tap was refused) must have a count of 1, or carry :again (the second tap only wiggled, nothing went in). A count of 2 or more is a break: there is one of each in a pan (P33).` },
  "contract-90": { item: "card-light", title: "the next item lit for a new player", how: `Cook flows of the games with the first-time card light (data/games.json cardLight: ${gameNames("cardLight")}) at level 1 for a new player (not #returning, #mistake or #takeback): once the first item (chai: the tea) has gone into a pan and another item follows, the station must have lit the order card's next item (its Lifecycle note card-light, CHAI-37): the first time, after the two items shown, the light shows where to look next (Zafar, 4 Nov, his L1 replay: it had gone, a waiter that gave up at once, and no check saw a light that never came)` },
};

const lifeOf = (tl, what) => tl.filter((e) => e.type === "c" && e.k === "life" && e.what === what);
// the green band and whose pan, as the station logs them: "lo/hi/who"
const band = (by) => {
  const [lo, hi, who] = String(by || "").split("/");
  return { lo: lo !== "" && Number.isFinite(+lo) ? +lo : null, hi: Number.isFinite(+hi) ? +hi : null, who: who || "?" };
};

export function check70(r, tl, add) {
  for (const { conf } of gamesFor("slowAtGreen", r.flow)) {
    const late = Number.isFinite(+conf.late) ? +conf.late : SLOW_LATE;
    const line = conf.line || "the turn-off line";
    const slows = lifeOf(tl, conf.slow);
    for (const n of slows) {
      const h = Number(n.reason);
      const { lo, who } = band(n.by);
      if (lo == null || !Number.isFinite(h)) continue;
      if (h < lo - 1e-3) add("contract-70", n.t, `"${line}" for ${who} at ${h.toFixed(3)}, before the green (it starts at ${lo}): called early, as if the pan must be stopped before the green`);
      else if (h > lo + late) add("contract-70", n.t, `"${line}" for ${who} at ${h.toFixed(3)}, ${(h - lo).toFixed(3)} past the green's edge (${lo}): called late`);
    }
    // a pan turned down in or past the green, in a round with no call at all
    const downs = lifeOf(tl, conf.down).filter((n) => {
      const { lo } = band(n.by);
      return lo != null && Number(n.reason) >= lo;
    });
    if (downs.length && !slows.length) add("contract-70", downs[0].t, `a pan was turned down at ${Number(downs[0].reason).toFixed(3)} (in or past the green) and the turn-off line was never called (no ${conf.slow} note in the round)`);
  }
}

export function check71(r, tl, add) {
  for (const { conf } of gamesFor("onceEach", r.flow)) {
    const items = new Set(conf.items || []);
    for (const n of lifeOf(tl, conf.note)) {
      const [who, count, again] = String(n.by || "").split(":");
      if (!items.has(n.reason || "")) continue;
      if (again === "again") continue;
      if (Number(count) > 1) add("contract-71", n.t, `${n.reason} went into ${who}'s pan a ${Number(count) === 2 ? "second" : `${count}th`} time: there is one of ${conf.what || "each"} in a pan (a second tap only wiggles)`);
    }
  }
}

// 90 (CHAI-37, CHAI-77; Zafar, 4 Nov): a new player at L1 sees the order card's next item lit once after the first item
export function check90(r, tl, add) {
  const f = r.flow || "";
  if (/@L[2-9]/.test(f) || /#(returning|mistake|takeback)/.test(f)) return;
  for (const { conf } of gamesFor("cardLight", f)) {
    const adds = lifeOf(tl, conf.note).filter((n) => !/:(again|capped)$/.test(String(n.by || "")));
    const first = adds.find((n) => n.reason === conf.first);
    if (!first) continue;
    const after = adds.find((n) => n.t > first.t && n.reason !== conf.first);
    if (!after) continue;
    // (a child who taps the next thing at once has moved on and needs no pointer, as the station's own rule: only a pause of 2.5 s or
    // more after the first item must bring the light)
    const next = tl.find((e) => e.type === "c" && e.k === "input" && e.t > first.t);
    if (next && next.t - first.t < 2500) continue;
    if (!lifeOf(tl, "card-light").length) add("contract-90", after.t, `a new player at L1: the first item (${conf.first}) went in and the next item followed, but the order card's next item was never lit (no card-light note): the first time's pointer to the third item is missing`);
  }
}
