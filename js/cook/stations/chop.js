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
  // the shelf band (Shelf.BAND: its top, the base line things stand on, the pills' line; design px) and how far backgrounds reach
  const BAND = (global.Shelf && global.Shelf.BAND) || { top: 630, base: 818, chipY: 860 };
  const FAR = 2000;

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
          // (S19, wave B: the game's settings where the kit reads a game's own items, so each piece's card is its band picture:
          // js/cook/ui.js cardOfIds reads Cook.data.settings[game].items[].card)
          if (Cook.data) (Cook.data.settings = Cook.data.settings || {})[KEY] = s;
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
   * S19 (wave B; ART-37, CK-71): the chop's own pictures from its settings (art: the pieces whole and in two halves, the knife, the
   * board) -> {load: [[key, url]], pieces: {id: {whole, a, b}}, knife, blade, board}. Keys are the game's own (chop4-*). Only what
   * the round can show is loaded (decision 68): the halves of what Nani asks for (a decoy is never cut), the wholes of those and,
   * where the level has decoys, of the rest of the pool. want: the ids asked for; decoys: whether others sit on the band.
   */
  function pictures(s, want = null, decoys = true) {
    const A = s.art || {};
    const load = [];
    const pieces = {};
    Object.keys(A.pieces || {}).forEach((id) => {
      const n = A.pieces[id];
      const k = (st) => `chop4-${n}-${st}`;
      const asked = !want || want.includes(id);
      if (!asked && !decoys) return;
      (asked ? ["whole", "half-a", "half-b"] : ["whole"]).forEach((st) => load.push([k(st), `${A.dir}${n}-${st}.webp`]));
      pieces[id] = { whole: k("whole"), a: k("half-a"), b: k("half-b") };
    });
    const knife = (A.knife || {}).file ? "chop4-knife" : null;
    if (knife) load.push([knife, A.knife.file]);
    const brd = (A.board || {}).file ? "chop4-board" : null;
    if (brd) load.push([brd, A.board.file]);
    return { load, pieces, knife, blade: (A.knife || {}).blade || null, board: brd };
  }
  /**
   * The band along the bottom (the kitchen kit's, one call): every thing on it is top-down, so it is the stone tray (ART-69, SH-243:
   * St.stoneBand's tray, the shared Shelf.P.tray, where the kit has it; the stone band before that).
   */
  function band(S, o) {
    return St.stoneBand ? St.stoneBand(S, Object.assign({}, o, { tray: true })) : null;
  }
  /** The walnut board above the band (ART-37): centred at layout.board, its height h, its width from the picture; its soft shadow. */
  function board(S, z, art, lay) {
    if (!art.board || !S.textures.exists(art.board)) return null;
    const B = lay.board || { x: 800, y: 318, h: 584 };
    const img = S.track(S.add.image(z.X(B.x), z.Y(B.y), art.board).setDepth(Cook.D.bg + 1.6));
    img.setScale(z.L(B.h) / img.height);
    const sh = (lay.shadow || {}).board;
    if (sh && Cook.Chop.shadow) Cook.Chop.shadow(S, img, { dx: z.L(sh[0]), dy: z.L(sh[1]), alpha: sh[2], blur: sh[3] });
    return img;
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
    // (the hop's decoys are its own row's where it sets them, L1's none; else the rules': what the round is measured against)
    const hd = params.hop && k.hop && k.hop.decoys != null ? k.hop.decoys : null;
    const onRounds = params.note ? (rs) => (noteDecoys(rs, hd != null ? hd : knobs(level).decoys || 0), own && own(rs)) : own;
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
    // CK-48: the knife (and S19, the board and the pieces) load while her order is read, never on a bare board
    const lv1 = knobs(level);
    const art = pictures(s, Object.keys(d.chops || {}), !(lv1.hop && lv1.hop.decoys === 0));
    const knife = St.loadArt(S, art.load).catch(() => {});
    L.card(d, (s.recipe && s.recipe.steps) || ["Chop"]);
    await knife;
    const lay = s.layout || {};
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
      // S19 (CK-71, ART-37: the board above the band): the kitchen kit's worktop wash and chai's stone band with its shelf, where the
      // whole things sit with their pills and hop from (the hop: the mechanic's params.hop); the walnut board above it, as big as
      // the room allows, never full-bleed (its place: the settings' layout)
      const top = z.Y(BAND.top);
      if (Cook.Kit && Cook.Kit.worktop) Cook.Kit.worktop(S, { top, far: FAR });
      band(S, { top, base: z.Y(BAND.base), far: FAR, depth: Cook.D.bg + 1.2 });
      board(S, z, art, lay);
      const kn = lay.knife || {};
      const r = await play(z, {
        targets: need,
        no: tries ? [] : [].concat(d.no || []),
        pool,
        tick: true,
        level,
        retry: tries > 0,
        note: !tries,
        hop: true,
        band: { top: BAND.top, base: BAND.base, chipY: BAND.chipY, board: lay.hopOn || null },
        // (S19: the game's own pictures and places; the mechanic falls back to the shared ones where these are missing)
        pieces: art.pieces,
        knifeKey: S.textures.exists(art.knife) ? art.knife : null,
        blade: art.blade,
        knifeAt: S.textures.exists(art.knife) ? { x: kn.x, y: kn.y, px: kn.px, angle: kn.angle } : null,
        timer: lay.ring || null,
        peak: lay.peak || null,
        halves: lay.halves || null,
        shadows: lay.shadow || null,
      });
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

  /**
   * S19 (wave B): a soft shadow under a picture (one light, upper left, so down and to the right; the bible's rule, at about half the
   * mock's weight): the picture's own outline, blurred and a little see-through, made on a canvas (so it draws without tints, in
   * either renderer), following the picture (moved, scaled, turned, faded, hidden) until it goes. o: dx, dy (screen px), alpha,
   * blur (screen px). Returns the shadow image.
   */
  function shadow(S, img, { dx = 8, dy = 10, alpha = 0.26, blur = 6 } = {}) {
    const key = img.texture.key;
    const k = Math.max(0.01, Math.abs(img.scaleX) || 1);
    const b = Math.max(1, Math.round(blur / k));
    const sk = `${key}:shade:${b}`;
    if (!S.textures.exists(sk)) {
      const src = S.textures.get(key).getSourceImage();
      const pad = b * 3;
      const c = document.createElement("canvas");
      c.width = src.width + 2 * pad;
      c.height = src.height + 2 * pad;
      const g = c.getContext("2d");
      g.filter = `blur(${b}px)`;
      g.drawImage(src, pad, pad);
      g.filter = "none";
      g.globalCompositeOperation = "source-in";
      // (the shade colour, a token: one shade for every shadow)
      const TK = global.Tokens;
      g.fillStyle = TK && TK.rgb ? `rgb(${TK.rgb("shade-rgb") || "60, 35, 20"})` : "black";
      g.fillRect(0, 0, c.width, c.height);
      S.textures.addCanvas(sk, c);
    }
    const src = S.textures.get(key).getSourceImage();
    const pad = b * 3;
    const sh = S.track(S.add.image(img.x + dx, img.y + dy, sk));
    sh.setOrigin((pad + img.originX * src.width) / (src.width + 2 * pad), (pad + img.originY * src.height) / (src.height + 2 * pad));
    const follow = () => {
      if (!img.active || !sh.active) return;
      sh.setPosition(img.x + dx, img.y + dy).setScale(img.scaleX, img.scaleY).setRotation(img.rotation).setDepth(img.depth - 0.05);
      sh.setVisible(img.visible).setAlpha(alpha * img.alpha);
    };
    follow();
    S.events.on("update", follow);
    img.once("destroy", () => {
      S.events.off("update", follow);
      if (sh.active) sh.destroy();
    });
    return sh;
  }

  Cook.Chop = { settings, knobs, play, shadow };
  Mech.lab(KEY, { name: "Chop", verb: "Ninja slicing", run: (L) => game(L) });
})(window);
