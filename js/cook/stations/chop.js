/*
 * Sprint 18 (s18-chop; Zafar, 7 Nov: "as other games and recipes will use chop"): chop as its own game, in the kitchen family.
 * The game is its settings file (data/stations/chop.json) and its own mechanic (js/cook/mechanics/chop.js, the Fruit-Ninja chop);
 * everything else is a kit call: the order card and its flow (Cook.Recipes, UI.mission, the lab's card), the light (Onboard, in
 * the mechanic's first-time strip), the redo (St.redo), the end (the lab's round end).
 *
 * The round (the Station lab's Chop tile, cook:chop): Nani's order on her own card ("Chop these": how many of each, a "no" from
 * L2 said last), the board (the white marble until ART-37's board lands, decision 7), the chop, which ends on the last wanted chop
 * (DAAR-38); a count short when the ring runs out chops again only those things (decision 51), the third try puts them out.
 * Kinds 1-4 by level and chops 2, 4, 6, 8, each kind 1-3 (DAAR-37), from the settings' recipe; the decoys and the L4 lookalike
 * from the central rules (data/rules.json levels, STD-C2-03).
 *
 * The call daar and chaat use (wave 2 switches them onto it):
 *   Cook.Chop.play(z, params) -> {cut, got, wrong, short}: one chop in zone z at its level; params are the mechanic's own (targets,
 *     pool, only, no, tick, knifeKey, blade, onSlice, onCount, onCall, tally, timer, firstLight, onRounds) plus level, and note
 *     (true: each round's decoys are reported for contract-37, the first try's); the settings' numbers for that level and the
 *     rules' decoys come with it (params.knobs on top, a caller's own). short: the kinds whose count was not reached.
 *   Cook.Chop.settings() -> Promise of data/stations/chop.json (once); Cook.Chop.knobs(level) its knobs at a level, once loaded.
 *   "do": "chop-game" (a recipe's step: chaat's chop): the game on its own board, through play(); -> what was cut ({id: n}).
 * Its step opens before anything of its own is said (play: an order heard or skipped opens it as the board starts; contract-95).
 */
import { Cook as CookNS } from "../ns.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const KEY = "chop";
  const FILE = "data/stations/chop.json";

  let loaded = null;
  let set = null;
  /** The game's settings, once; its order registers as Cook.Recipes.chop (the engine builds and says it). */
  function settings() {
    return (loaded =
      loaded ||
      fetch(Cook.v(FILE))
        .then((r) => r.json())
        .then((s) => {
          set = s;
          if (s.station) Cook.data.stations[KEY] = Object.assign({}, Cook.data.stations[KEY] || {}, s.station);
          const R = Cook.Recipes;
          if (s.recipe && R && R.add && !Cook.data.recipes[KEY]) {
            const rec = JSON.parse(JSON.stringify(s.recipe));
            // (a count on the central rules, {"rules": "chop"}, once data/rules.json has count.games.chop; else its byLevel)
            if (R.fromRules && global.Rules) R.fromRules({ recipes: { [KEY]: rec } }, global.Rules);
            R.add(KEY, rec);
          }
          return s;
        }));
  }
  /** The mechanic's knobs at a level: the settings' row, then the central rules' decoys and lookalike (never a copy here). */
  function knobs(level) {
    const rows = (set && set.levels) || [];
    const lv = Math.max(1, Number(level) || 1);
    const row = Object.assign({}, (rows[Math.min(lv, rows.length) - 1] || {}).knobs || {});
    const Rl = global.Rules && global.Rules.level ? global.Rules.level(lv) : null;
    if (Rl) {
      row.decoys = Rl.decoys;
      row.lookalike = !!Rl.lookalike;
    }
    return row;
  }

  /**
   * CK-49 (contract-37): how many decoys fly with each round's things (a thing asked in another round is a decoy in this one; the
   * "no" one too), the fewest of any round, and whether one is a lookalike; "room" when the six whole vegetables run out first.
   */
  const noteDecoys = (rounds, want) => {
    const n = Math.min(...rounds.map((r) => r.decoys.length));
    St.decoyNote(n, { what: n < want ? `${KEY} room:${n}` : KEY, lookalike: rounds.some((r) => r.lookalikes.length) });
  };

  /** One chop in zone z (the call daar and chaat use): the mechanic at the game's numbers for the level; graded by kind. */
  async function play(z, params = {}) {
    await settings();
    const level = params.level || Cook.roundLevel(z.ctx);
    const k = Object.assign(knobs(level), params.knobs || {});
    const want = params.targets || {};
    // (the decoys each round threw, reported once for the round: the game's own, daar's and chaat's alike)
    const own = params.onRounds;
    const onRounds = params.note ? (rs) => (noteDecoys(rs, knobs(level).decoys || 0), own && own(rs)) : own;
    // contract-95 (CK-60; wave 3, chaat L2-L4): the chop is the work's step and opens it before anything of its own is said. An order
    // already heard (read out in its pop-up, or skipped) opens it now, as the board starts, before the knife and the throws are
    // made ready; an order not yet heard comes up in its pop-up first, and the mechanic opens the step as that folds (DAAR-40)
    const LC = global.Lifecycle;
    const stepOpen = !!(LC && LC.asked && LC.asked() && global.PlayLog && global.PlayLog.step);
    if (stepOpen) global.PlayLog.step(KEY);
    const cut = (await Mech.run(KEY, z, Object.assign({}, params, { level, knobs: k, onRounds, stepOpen }))) || {};
    let wrong = null;
    const got = {};
    const short = [];
    Object.keys(want).forEach((id) => {
      const n = Number(want[id]) || 0;
      if (!n || (params.only && !params.only.includes(id))) return;
      const c = cut[id] || 0;
      if (c > 0) got[id] = c;
      if (c !== n) {
        wrong = wrong || `chopped ${c}, they asked for ${n}: ${id}`;
        short.push(id);
      }
    });
    return { cut, got, wrong, short };
  }

  /** The game's round: Nani's order, the board, the chop (again for a short count), the end. */
  async function game(L) {
    const S = L.S;
    const ctx = L.ctx;
    const level = L.level;
    const s = await settings();
    const d = Cook.Recipes[KEY].make("nani", { level });
    d.who = "nani"; // (her order on her own card: the lab's openCard reads who)
    // CK-48: the knife loads while her order is read, never on a bare board
    const kit = St.art("knife");
    const knife = kit ? St.loadArt(S, [[St.artKey("knife"), kit.file]]).catch(() => {}) : null;
    L.card(d, (s.recipe && s.recipe.steps) || ["Chop"]);
    await knife;
    const pool = ((s.recipe || {}).lists || {}).thrown || [];
    const redo = St.redo(ctx);
    // the shared kit's first-time gate for this round (kit (d), STD-D1-01): the reveal lessons spend on it
    const gate = Cook.Coach && Cook.Coach.firsts ? Cook.Coach.firsts(KEY, { round: new Set() }) : null;
    const got = {};
    let need = Object.assign({}, d.chops || {});
    for (let tries = 0; Object.keys(need).length; tries++) {
      await St.begin(S, ctx, KEY, s.view || "marble");
      // DAAR-39: the chop's first time is its own strip (the mechanic's); the coach's swipes are not shown over it
      if (Cook.Coach) Cook.Coach.stop(false);
      if (ctx.nextStep) ctx.nextStep("Chop");
      const phases = (Cook.data.stations[KEY] || {}).phases || {};
      if (phases.chop && !tries) UI.gist(phases.chop);
      // STD-D1-08 (SH-196, contract-98): the reveal lessons, the dotted word then the blurred picture, once the order has landed and
      // before the first throw (kit (d)'s Cook.Coach.lessons; the knife waits)
      if (!tries && gate && Cook.Coach.lessons) await Cook.Coach.lessons({ gate, ctx });
      const z = Mech.zone(S, ctx, { id: KEY, level });
      const r = await play(z, { targets: need, no: tries ? [] : [].concat(d.no || []), pool, tick: true, level, retry: tries > 0, note: !tries });
      z.close();
      St.end();
      Object.keys(need).forEach((id) => {
        if ((r.cut[id] || 0) === need[id]) {
          got[id] = need[id];
          delete need[id];
        }
      });
      if (!Object.keys(need).length) break;
      // decision 51 (CK-23): only the things short are chopped again; the third short try puts them out (their rows tick)
      const w = redo.wrong("chop:chop");
      if (w.action === "show") {
        Object.keys(need).forEach((id) => (got[id] = need[id]));
        if (ctx.closeItem) ctx.closeItem(Object.keys(need));
        need = {};
        break;
      }
      UI.mission.reopen(Object.keys(need), ctx.dishAt || 0);
      if (Cook.roundLevel(ctx) <= 1) Cook.oops(ctx);
    }
    ctx.result.chopped = got;
    if (ctx.closeItem) ctx.closeItem([], { all: true });
    return got;
  }

  /*
   * The chop as a game a recipe calls ("do": "chop-game": chaat's chop step, data/cook.json): its board (the game's own view) and
   * the game's numbers, decoys and step, through play(); the result is what was cut, as the bare mechanic gave it. The first try's
   * decoys are noted for the round, and are exactly the central rules' count at the level (exactDecoys; contract-37: chaat's chop
   * at L1 asks for two things and throws one decoy, not two).
   */
  Mech.define("chop-game", {
    station: KEY,
    view: "wood", // (chaat keeps its wood board: Zafar never asked for a change; the Chop tile keeps its marble)
    knobs: KEY,
    async run(z, p) {
      return (await play(z, Object.assign({ note: !p.retry, exactDecoys: true }, p, { level: p.level || z.level }))).cut;
    },
  });

  Cook.Chop = { settings, knobs, play };
  Mech.lab(KEY, { name: "Chop", verb: "Ninja slicing", run: (L) => game(L) });
})(window);
