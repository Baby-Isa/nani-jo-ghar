/*
 * Tidy up: the round generator, the solver checks and the row phrases
 * (docs/modes/tidy-up-design.md D.1, D.5, 8.1; build brief task 1).
 *
 * Pure logic: no DOM, no Cook. It runs in the page (js/tidy/engine.js) and
 * in Node (build/leak_tidy.mjs), so the leak bot plays exactly the rounds a
 * child gets.
 *
 *   Rules.init(tidyJson, {sceneId: sidecar}, contentWords)
 *   Rules.make(game, {board, kind, level, rng, profile}) -> round
 *   Rules.checks(round)   the five solver checks (4 per round, the 5th,
 *                         flat priors, over many rounds in the harness)
 *   Rules.phrase(row, round) -> parts [{w: wordId} | {n: number}]
 *   Rules.view(round, {reader, digits}) -> what a non-speaker sees
 *   Rules.grade(round, placements, lostRows) -> {holds, ear, tested}
 *   Rules.liveWrong(round, placements, iid, spot) -> [rowId] lost by this drop
 *
 * A round is {game, board, kind, level, B (the compiled board), people
 * {seatId: personWord}, items {iid: {word, attrs, kind}}, order [iid] (the
 * tray, shuffled), start {iid: spot|"tray"}, solution {iid: spot|"tray"},
 * rows [rule]}. Rows are the rule shapes in js/tidy/stubs/rel.js.
 *
 * Kinds of round (D.1): K1 put it there (all on the tray), K2 put it right
 * (half the named things already right, half wrong, chosen at random; a
 * "leave" row names a thing that's right), K3 pack it (count rows into
 * cells), K4 Nani's rules (a class or "nothing" row). K5 (Ali's turn) is
 * any of these played backwards: js/tidy/mechanics/tell.js.
 */
(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const Rel = node ? require("./stubs/rel.js") : (root.Tidy && root.Tidy.Rel) || root.Rel;
  const Rules = factory(Rel);
  if (node) module.exports = Rules;
  else {
    root.Tidy = root.Tidy || {};
    root.Tidy.Rules = Rules;
  }
})(typeof self !== "undefined" ? self : this, function (Rel) {
  "use strict";
  const Rules = { Rel };
  const TRAY = "tray";
  const MAX_TRIES = 100;
  let D = null; // data/tidy.json
  let SC = {}; // scene sidecars by id
  let CW = {}; // content words by id: {kutchi, english, image}

  Rules.init = function (data, scenes, contentWords) {
    D = data;
    SC = scenes || {};
    CW = contentWords || {};
    return Rules;
  };
  Rules.data = () => D;
  Rules.scene = (id) => SC[id];

  /* ---------------- randomness (seedable, so a bot run can be replayed) ---------------- */
  Rules.rng = function (seed) {
    let a = seed >>> 0 || 1;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const int = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
  const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
  const shuffle = (rng, arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  Rules.util = { int, pick, shuffle };

  /* ---------------- words ---------------- */
  Rules.word = (id) => (D.words.placeholders || {})[id] || CW[id] || { kutchi: null, english: id };
  Rules.isPlaceholder = (id) => !Rules.word(id).kutchi;
  Rules.kindOf = function (word) {
    const K = D.kinds || {};
    for (const p in K.prefix || {}) if (word.startsWith(p)) return K.prefix[p];
    for (const k in K.list || {}) if (K.list[k].includes(word)) return k;
    return null;
  };
  Rules.numId = (n) => (D.words.numbers || {})[n] || `num-0${n}`;
  const poolWords = (kinds) => {
    const out = [];
    (D.words.from_content || []).forEach((id) => kinds.includes(Rules.kindOf(id)) && out.push(id));
    Object.keys(D.words.placeholders || {}).forEach((id) => kinds.includes(Rules.kindOf(id)) && out.push(id));
    return out;
  };
  Rules.pool = poolWords;

  /* ---------------- knobs (levels list only what changes) ---------------- */
  const mergeLevels = (levels, level) => {
    const n = Math.max(1, Math.min(levels.length, Math.round(level) || 1));
    const out = {};
    for (let i = 0; i < n; i++) Object.assign(out, levels[i]);
    out.level = n;
    return out;
  };
  /** A game's knobs at a level, then its board's own changes (the dabba is smaller than the shelves). */
  Rules.knobs = (game, level, board) => {
    const G = D.games[game];
    const out = mergeLevels(G.levels, level);
    const b = board && G.boards[board];
    if (b && b.levels) Object.assign(out, mergeLevels(b.levels, level), { level: out.level });
    return out;
  };
  Rules.mech = (id, level) => mergeLevels(((D.mechanics || {})[id] || {}).levels || [{}], level);
  Rules.levelCount = (game) => (D.games[game].levels || [1]).length;

  /* ---------------- a board at a level ---------------- */
  const visible = (level) => (o) => (o.lv || 1) <= level;
  Rules.board = function (sceneId, boardId, level) {
    const sc = SC[sceneId];
    if (!sc) throw new Error(`Tidy: no scene ${sceneId}`);
    const b = sc.boards[boardId];
    const lv = visible(level);
    const spots = b.spots.filter(lv).map((s) => Object.assign({}, s, { tags: (s.tags || []).filter(lv) }));
    const byId = {};
    spots.forEach((s) => (byId[s.id] = s));
    spots.forEach((s) => {
      const nbr = {};
      Object.keys(s.nbr || {}).forEach((d) => byId[s.nbr[d]] && (nbr[d] = s.nbr[d]));
      s.nbr = nbr;
      s.adj = (s.adj || []).filter((id) => byId[id]);
    });
    // "next to" is symmetric whatever the sidecar wrote down one way
    spots.forEach((s) => Rel.neighbours(s).forEach((n) => byId[n].adj.includes(s.id) || byId[n].adj.push(s.id)));
    const anchors = (b.anchors || []).filter(lv);
    const aById = {};
    anchors.forEach((a) => (aById[a.id] = a));
    const groups = {};
    spots.forEach((s) =>
      s.tags.forEach((t) => {
        const key = `${t.rel}|${t.anchor || ""}`;
        (groups[key] = groups[key] || { key, rel: t.rel, anchor: t.anchor || null, spots: [] }).spots.push(s.id);
      })
    );
    Object.values(groups).forEach((g) => {
      g.x = g.spots.reduce((a, id) => a + byId[id].x, 0) / g.spots.length;
      g.y = g.spots.reduce((a, id) => a + byId[id].y, 0) / g.spots.length;
      g.cap = g.spots.reduce((a, id) => a + (byId[id].cap || 1), 0);
    });
    return {
      sceneId, boardId, level, camera: sc.camera, name: b.name,
      spots, byId, anchors, aById, groups: Object.values(groups),
      surfaces: (b.surfaces || []).filter(lv), convention: b.convention || {}, katori: b.katori,
    };
  };

  const groupFree = (st, B, g) => g.spots.reduce((a, id) => a + Math.max(0, Rel.free(st, B, id)), 0);
  const freeIn = (rng, st, B, g) => shuffle(rng, g.spots).find((id) => Rel.free(st, B, id) > 0) || null;

  /* ---------------- the generator ---------------- */
  Rules.make = function (game, opts = {}) {
    const G = D.games[game];
    if (!G || !G.levels) throw new Error(`Tidy: ${game} has no boards of its own`);
    const boardId = opts.board && G.boards[opts.board] ? opts.board : G.defaultBoard;
    const level = Math.max(G.boards[boardId].minLevel || 1, Math.min(Rules.levelCount(game), opts.level || 1));
    const kn = Rules.knobs(game, level, boardId);
    const bdef = G.boards[boardId];
    const kinds = kn.kinds.filter((k) => k !== "K5");
    const kind = opts.kind && kinds.includes(opts.kind) ? opts.kind : kinds[0];
    const rng = opts.rng || Math.random;
    const B = Rules.board(bdef.scene, bdef.board, level);
    let last = null;
    for (let t = 0; t < MAX_TRIES; t++) {
      const r = build({ game, G, boardId, bdef, B, kn, kind, level, rng, profile: opts.profile });
      if (!r) continue;
      r.rerolls = t;
      r.checks = Rules.checks(r);
      if (r.checks.ok) return r;
      last = r;
    }
    if (!last) throw new Error(`Tidy: couldn't build ${game}/${boardId} L${level} ${kind}`);
    last.failed = true;
    return last;
  };

  function build(ctx) {
    const { game, G, boardId, bdef, B, kn, kind, level, rng } = ctx;
    const round = {
      game, board: boardId, scene: bdef.scene, kind, level, knobs: kn, B,
      people: {}, items: {}, order: [], start: {}, solution: {}, rows: [],
    };
    const sol = { placements: round.solution, items: round.items };

    // people on the cushions (the spare cushions stay empty)
    if (G.people) {
      const seats = shuffle(rng, B.anchors.filter((a) => a.kind === "person-seat"));
      shuffle(rng, G.people).slice(0, kn.people || 3).forEach((p, i) => seats[i] && (round.people[seats[i].id] = p));
    }
    const seatOf = (g) => B.aById[g.anchor] && B.aById[g.anchor].kind === "person-seat";
    const addressable = B.groups.filter((g) => !seatOf(g) || round.people[g.anchor]);
    round.addressable = addressable.map((g) => g.key);

    // words: the pool, weakest first when a profile says so (Cook's "prefer weak")
    let pool = shuffle(rng, poolWords(bdef.pool));
    if (ctx.profile && ctx.profile.stage) pool = pool.sort((a, b) => (ctx.profile.stage(a) || 1) - (ctx.profile.stage(b) || 1));
    const reservedKinds = new Set();
    const usedWords = new Set();
    const nextWord = (filter) => {
      const w = pool.find((id) => !usedWords.has(id) && !reservedKinds.has(Rules.kindOf(id)) && (!filter || filter(id)));
      if (w) usedWords.add(w);
      return w || null;
    };
    let seq = 0;
    const add = (word, attrs, at = TRAY) => {
      const iid = `${word}${attrs && attrs.colour ? "." + attrs.colour : ""}#${++seq}`;
      round.items[iid] = { word, attrs: attrs || {}, kind: Rules.kindOf(word) };
      round.solution[iid] = at;
      return iid;
    };
    const perKind = kn.perKind || 0; // the box's plate: every kind in the same number
    const rows = [];

    const R = int(rng, kn.rows[0], kn.rows[1]);
    // K4 carries the rule rows (a class or a "nothing" row); K3 is all counting
    const nLeave = kn.leave || 0;
    const nNext = kn.nextTo || 0;
    const nClass = kind === "K4" ? kn.classRows || 0 : 0;
    const nNot = kind === "K4" ? kn.notRows || (nClass ? 0 : 1) : 0;
    const special = nLeave + nNext + nClass + nNot;
    const nCount = Math.max(0, kind === "K3" ? R - special : Math.min(kn.countRows || 0, R - special));
    const nPlace = Math.max(0, R - special - nCount);

    // K4: a class row ("all the fruit in the basket") names 2 things by their class
    for (let i = 0; i < nClass; i++) {
      const kindsHere = [...new Set(pool.map(Rules.kindOf))].filter((k) => !reservedKinds.has(k));
      const k = pick(rng, kindsHere);
      const members = [nextWord((w) => Rules.kindOf(w) === k), nextWord((w) => Rules.kindOf(w) === k)];
      if (members.some((m) => !m)) return null;
      const gs = addressable.filter((g) => g.anchor && !seatOf(g) && groupFree(sol, B, g) >= members.length);
      if (!gs.length) return null;
      const g = pick(rng, gs);
      members.forEach((m) => add(m, {}, freeIn(rng, sol, B, g)));
      reservedKinds.add(k);
      rows.push({ type: "class", all: { kind: k }, rel: g.rel, anchor: g.anchor });
    }

    // K1 place rows (one may carry a colour from level 2: "the red cup")
    let colourDone = false;
    for (let i = 0; i < nPlace; i++) {
      let word;
      let attrs = {};
      if (kn.colours && !colourDone && G.colourable) {
        word = nextWord((w) => G.colourable.includes(w));
        if (word) {
          const cols = shuffle(rng, G.colours);
          attrs = { colour: cols[0] };
          cols.slice(1).forEach((c) => add(word, { colour: c })); // the same thing in the other colours
          colourDone = true;
        }
      }
      word = word || nextWord();
      if (!word) return null;
      // the place is drawn from every place on offer, full or not (a full one re-rolls the
      // round), so no place is said more often just because it's roomier (check 5, flat priors)
      const g = pick(rng, addressable);
      if (groupFree(sol, B, g) < 1) return null;
      add(word, attrs, freeIn(rng, sol, B, g));
      rows.push({ type: "place", item: word, attrs, rel: g.rel, anchor: g.anchor });
    }

    // K3 count rows ("bo limu in the bowl"): the tray always holds more than asked
    for (let i = 0; i < nCount; i++) {
      const word = nextWord();
      if (!word) return null;
      const n = int(rng, kn.count[0], kn.count[1]);
      const g = pick(rng, addressable);
      if (groupFree(sol, B, g) < n) return null;
      for (let k = 0; k < n; k++) add(word, {}, freeIn(rng, sol, B, g));
      const spare = perKind ? Math.max(1, perKind - n) : 1;
      for (let k = 0; k < spare; k++) add(word, {});
      rows.push({ type: "count", n, item: word, attrs: {}, rel: g.rel, anchor: g.anchor });
    }

    // level 3: next to a thing already placed ("limu next to the santra")
    for (let i = 0; i < nNext; i++) {
      const word = nextWord();
      if (!word) return null;
      const placed = Object.keys(round.items).filter((j) => round.solution[j] !== TRAY);
      const cands = shuffle(rng, placed)
        .map((j) => ({ j, free: Rel.neighbours(B.byId[round.solution[j]]).filter((s) => Rel.free(sol, B, s) > 0) }))
        .filter((c) => c.free.length && round.items[c.j].word !== word);
      if (!cands.length) return null;
      const c = cands[0];
      const Y = round.items[c.j];
      add(word, {}, pick(rng, c.free));
      rows.push({ type: "place", item: word, attrs: {}, rel: "next-to", anchor: { item: Y.word, attrs: Object.assign({}, Y.attrs) } });
    }

    // K4: "nothing in the middle": a place nothing may go (always beside rows that need the board)
    for (let i = 0; i < nNot; i++) {
      const empty = addressable.filter((g) => g.spots.every((s) => Rel.at(sol, s).length === 0));
      if (!empty.length) return null;
      const g = pick(rng, empty);
      rows.push({ type: "not", rule: { all: {}, rel: g.rel, anchor: g.anchor } });
    }

    // "leave the X": on the tray in K1; in K2 a thing already right on the board
    const leaveIids = [];
    for (let i = 0; i < nLeave; i++) {
      const word = nextWord();
      if (!word) return null;
      const iid = add(word, {});
      leaveIids.push(iid);
      rows.push({ type: "leave", item: word, attrs: {} });
    }

    // extras (G6): things no row names, free to place or leave
    const nExtras = perKind ? Math.max(0, (kn.plateKinds || 0) - nCount) : kn.extras || 0;
    for (let i = 0; i < nExtras; i++) {
      const word = nextWord();
      if (!word) return null;
      for (let k = 0; k < (perKind || 1); k++) add(word, {});
    }

    rows.forEach((r, i) => (r.id = `r${i + 1}`));

    // the start: all on the tray (K1, K3), or half right and half wrong (K2)
    Object.keys(round.items).forEach((i) => (round.start[i] = TRAY));
    if (kind === "K2" && !setUpK2(round, rows, leaveIids, rng)) return null;

    // G3: rows and tray shuffled, and the tray order never matches the row order
    for (let t = 0; t < 12; t++) {
      round.rows = shuffle(rng, rows);
      round.order = shuffle(rng, Object.keys(round.items));
      const trayWords = [];
      round.order.forEach((i) => round.start[i] === TRAY && !trayWords.includes(round.items[i].word) && trayWords.push(round.items[i].word));
      const named = round.rows.map((r) => r.item).filter(Boolean);
      if (named.length < 2 || named.some((w, k) => trayWords[k] !== w)) break;
    }
    return round;
  }

  /* K2: the rows cover things already right as well as wrong ones; the
   * wrong half is chosen at random; nothing already placed looks any
   * different; a "leave" row looks like any other row. */
  function setUpK2(round, rows, leaveIids, rng) {
    const B = round.B;
    const st = { placements: round.start, items: round.items };
    const covered = shuffle(rng, rows.filter((r) => r.type === "place" || r.type === "count"));
    if (covered.length < 2) return false;
    const nRight = Math.floor(covered.length / 2) + (covered.length % 2 && rng() < 0.5 ? 1 : 0);
    const instancesOf = (r) =>
      Object.keys(round.items).filter((i) => round.solution[i] !== TRAY && Rel.matches(round.items[i], r) && Rel.satisfies({ placements: round.solution, items: round.items }, B, round.solution[i], r.rel, r.anchor, i));
    // right ones first, at their places
    covered.slice(0, nRight).forEach((r) => instancesOf(r).forEach((i) => (round.start[i] = round.solution[i])));
    // wrong ones: somewhere that doesn't satisfy their row
    for (const r of covered.slice(nRight)) {
      const inst = instancesOf(r);
      if (r.anchor && typeof r.anchor === "object") {
        // next to a placed thing: put it far from every one of those
        const bad = B.spots.filter((s) => Rel.free(st, B, s.id) > 0 && !Rel.satisfies({ placements: round.solution, items: round.items }, B, s.id, r.rel, r.anchor, inst[0]));
        if (!bad.length) return false;
        round.start[inst[0]] = pick(rng, bad).id;
        continue;
      }
      const wrongGroups = B.groups.filter((g) => !(g.rel === r.rel && (g.anchor || null) === (r.anchor || null)) && groupFree(st, B, g) >= inst.length);
      if (!wrongGroups.length) return false;
      const g = pick(rng, wrongGroups);
      for (const i of inst) {
        const s = shuffle(rng, g.spots).find((id) => Rel.free(st, B, id) > 0 && !Rel.tagged(B.byId[id], r.rel, r.anchor));
        if (!s) return false;
        round.start[i] = s;
      }
    }
    // a leave row names a thing that is already right: it's on the board and must stay
    for (const i of leaveIids) {
      const free = B.spots.filter((s) => Rel.free(st, B, s.id) > 0 && Rel.free({ placements: round.solution, items: round.items }, B, s.id) > 0);
      if (!free.length) return false;
      const s = pick(rng, free).id;
      round.start[i] = s;
      round.solution[i] = s;
    }
    // doing nothing must never pass
    const s0 = { placements: round.start, items: round.items, start: round.start };
    return rows.some((r) => !Rel.holds(s0, r, B));
  }

  /* ---------------- the solver checks (8.1) ---------------- */
  const stateOf = (round, placements) => ({ placements, items: round.items, start: round.start });
  const instancesFor = (round, placements, r) =>
    Object.keys(round.items).filter((i) => placements[i] !== TRAY && Rel.matches(round.items[i], r) && Rel.satisfies(stateOf(round, placements), round.B, placements[i], r.rel, r.anchor, i));

  /** How many different places this row could have named, given the others (G5). null: not a placing row. */
  Rules.optionCount = function (round, r) {
    const B = round.B;
    const pl = Object.assign({}, round.solution);
    if (r.type === "place" || r.type === "count") {
      const mine = instancesFor(round, round.solution, r);
      mine.forEach((i) => (pl[i] = TRAY));
      const st = stateOf(round, pl);
      if (r.anchor && typeof r.anchor === "object") {
        // next to a placed thing: how many free spots there are for each one that would do
        // (a blind drop satisfies it at most 1 time in this many)
        const free = B.spots.filter((s) => Rel.free(st, B, s.id) > 0);
        const good = free.filter((s) => Rel.satisfies(st, B, s.id, r.rel, r.anchor, null));
        return good.length ? Math.floor(free.length / good.length) : 0;
      }
      const need = r.type === "count" ? r.n : 1;
      return B.groups.filter((g) => round.addressable.includes(g.key) && groupFree(st, B, g) >= need).length;
    }
    if (r.type === "class") {
      const members = Object.keys(round.items).filter((i) => Rel.matches(round.items[i], r.all));
      members.forEach((i) => (pl[i] = TRAY));
      const st = stateOf(round, pl);
      return B.groups.filter((g) => round.addressable.includes(g.key) && g.anchor && groupFree(st, B, g) >= members.length).length;
    }
    return null;
  };

  /** Is this row's thing pinned to its place by the other rows alone? (check 4) */
  Rules.forced = function (round, r) {
    if (r.type !== "place" && r.type !== "count") return false;
    const B = round.B;
    const mine = instancesFor(round, round.solution, r);
    if (!mine.length) return false;
    // rows placed relative to this thing move with it, so they don't pin it
    const others = round.rows.filter((x) => x !== r && !(x.anchor && typeof x.anchor === "object" && Rel.matches({ word: r.item, attrs: r.attrs || {} }, x.anchor)));
    let ok = 0;
    for (const g of B.groups) {
      const pl = Object.assign({}, round.solution);
      mine.forEach((i) => (pl[i] = TRAY));
      const st = stateOf(round, pl);
      let fits = true;
      for (const i of mine) {
        const s = g.spots.find((id) => Rel.free(st, B, id) > 0);
        if (!s) {
          fits = false;
          break;
        }
        pl[i] = s;
      }
      if (fits && others.every((x) => Rel.holds(stateOf(round, pl), x, B))) ok++;
      if (ok >= 2) return false;
    }
    return true;
  };

  /** The everyday layout (G4): scene data says it (by kind, or a fill order). */
  Rules.conventionLayout = function (round, order) {
    const B = round.B;
    const conv = B.convention || {};
    const pl = {};
    const st = stateOf(round, pl);
    const ids = order || round.order;
    ids.forEach((i) => (pl[i] = TRAY));
    if (conv.byKind) {
      ids.forEach((i) => {
        const anchor = conv.byKind[round.items[i].kind];
        const g = B.groups.find((x) => x.anchor === anchor);
        const s = g && g.spots.find((id) => Rel.free(st, B, id) > 0);
        if (s) pl[i] = s;
      });
    } else if (conv.fill) {
      const fill = conv.fill.filter((id) => B.byId[id]);
      let k = 0;
      ids.forEach((i) => {
        while (k < fill.length && Rel.free(st, B, fill[k]) <= 0) k++;
        if (k < fill.length) pl[i] = fill[k];
      });
    }
    return pl;
  };

  Rules.checks = function (round) {
    const B = round.B;
    const sol = stateOf(round, round.solution);
    const out = { solvable: true, options: true, convention: true, forced: true, notes: [] };
    round.rows.forEach((r) => {
      if (!Rel.holds(sol, r, B)) {
        out.solvable = false;
        out.notes.push(`unsolved ${r.id}`);
      }
    });
    const trayWords = new Set(Object.values(round.items).map((it) => it.word));
    if (trayWords.size < 3) {
      out.options = false;
      out.notes.push("fewer than 3 kinds of thing");
    }
    round.rows.forEach((r) => {
      const n = Rules.optionCount(round, r);
      r.options = n;
      if (n !== null && n < 3) {
        out.options = false;
        out.notes.push(`${r.id}: ${n} options`);
      }
    });
    const conv = stateOf(round, Rules.conventionLayout(round));
    if (round.rows.every((r) => Rel.holds(conv, r, B))) {
      out.convention = false;
      out.notes.push("the everyday layout passes");
    }
    round.rows.forEach((r) => {
      if (Rules.forced(round, r)) {
        out.forced = false;
        out.notes.push(`${r.id} forced`);
      }
    });
    out.ok = out.solvable && out.options && out.convention && out.forced;
    return out;
  };

  /* ---------------- rows as words ---------------- */
  const anchorWord = (round, a) => {
    if (a == null) return null;
    if (typeof a === "object") return a.item;
    const an = round.B.aById[a];
    if (an && an.kind === "person-seat") return round.people[a] || null;
    return an ? an.word : null;
  };
  /** A row as parts in the language's order (data grammar.rows): [{w}|{n}]. */
  Rules.phrase = function (row, round) {
    const g = D.grammar;
    const r = row.type === "not" ? row.rule : row;
    let key = row.type;
    if (row.type === "place") key = r.anchor == null ? "unary" : "place";
    if (row.type === "count") key = r.anchor == null ? "countUnary" : "count";
    if (row.type === "not") key = r.anchor == null ? "notUnary" : "not";
    const tmpl = g.rows[key];
    const parts = [];
    tmpl.split(/\s+/).forEach((tok) => {
      const slot = tok.replace(/[{}]/g, "");
      switch (slot) {
        case "attr":
          if (r.attrs && r.attrs.colour) parts.push({ w: r.attrs.colour, slot });
          break;
        case "x":
          parts.push({ w: r.item, slot });
          break;
        case "n":
          parts.push({ n: r.n, w: Rules.numId(r.n), slot });
          break;
        case "anchor":
          if (r.anchor && typeof r.anchor === "object" && r.anchor.attrs && r.anchor.attrs.colour) parts.push({ w: r.anchor.attrs.colour, slot: "anchorAttr" });
          parts.push({ w: anchorWord(round, r.anchor), slot });
          break;
        case "rel":
          parts.push({ w: D.relations[r.rel].word, slot });
          break;
        case "class":
          parts.push({ w: D.kinds.classWord[r.all.kind], slot });
          break;
        case "all":
        case "nothing":
        case "leave":
          parts.push({ w: g.words[slot], slot });
          break;
        default:
          if (slot) parts.push({ t: tok, slot: "text" });
      }
    });
    return parts;
  };
  /** Plain English of a row (tools, the lab's rule inspector, tests). */
  Rules.english = (row, round) =>
    Rules.phrase(row, round)
      .map((p) => (p.n != null ? String(p.n) : p.w ? Rules.word(p.w).english : p.t))
      .join(" ");
  /** The same row as a Kutchi speaker would read it (Kutchi where it exists). */
  Rules.display = (row, round) =>
    Rules.phrase(row, round)
      .map((p) => (p.w ? Rules.word(p.w).kutchi || `[${Rules.word(p.w).english}]` : p.t))
      .join(" ");

  /* ---------------- what the non-speaker sees (for the bot) ----------------
   * The pictures on the tray (anyone knows an orange from a lemon, and a
   * fruit from a spice), the places on the board (the bowl, the shelves,
   * each cushion and who sits on it, the middle of the cloth) without their
   * words, the rows as drawn (how many words; a digit while the number word
   * is at stage 1-2, G7), and what's already on the board. Never the rules.
   * A Reader also sees the English placeholder words on each row. */
  Rules.view = function (round, opts = {}) {
    const B = round.B;
    const tagged = new Set();
    const places = B.groups.map((g) => {
      g.spots.forEach((s) => tagged.add(s));
      return { id: g.key, spots: g.spots.slice(), x: g.x, y: g.y, who: round.people[g.anchor] || null };
    });
    const loose = B.spots.filter((s) => !tagged.has(s.id)).map((s) => s.id);
    if (loose.length) places.push({ id: "loose", spots: loose, x: 0, y: 0, who: null });
    const rows = round.rows.map((r) => {
      const parts = Rules.phrase(r, round);
      const row = { words: parts.length, digit: r.type === "count" && opts.digits !== false ? r.n : null };
      if (opts.reader) {
        const ph = (w) => (w && Rules.isPlaceholder(w) ? w : null);
        const rr = r.type === "not" ? r.rule : r;
        const anchorKnown = rr.anchor == null || typeof rr.anchor === "object" ? true : !!ph(anchorWord(round, rr.anchor));
        row.read = {
          type: r.type, // "leave the", "all the", "nothing" are English placeholders
          item: ph(r.item),
          colour: r.attrs && r.attrs.colour ? ph(r.attrs.colour) : null,
          place: rr.rel && ph(D.relations[rr.rel].word) && anchorKnown && !(rr.anchor && typeof rr.anchor === "object") ? `${rr.rel}|${rr.anchor || ""}` : null,
          nextTo: rr.anchor && typeof rr.anchor === "object" ? ph(rr.anchor.item) : null,
          cls: r.type === "class" ? r.all.kind : null,
          n: r.type === "count" && opts.digits !== false ? r.n : null,
        };
      }
      return row;
    });
    return {
      game: round.game, level: round.level, kind: round.kind, live: !!round.knobs.liveCheck,
      rows,
      tray: round.order.map((i) => ({ iid: i, word: round.items[i].word, kind: round.items[i].kind, colour: round.items[i].attrs.colour || null, at: round.start[i] })),
      places,
      spots: B.spots.map((s) => ({ id: s.id, x: s.x, y: s.y, cap: s.cap || 1, nbr: Rel.neighbours(s) })),
      convention: B.convention,
      people: Object.assign({}, round.people),
    };
  };

  /* ---------------- grading ---------------- */
  /** The rows a drop at level 1 (the live check) costs: a named thing set down where its row can't hold. */
  Rules.liveWrong = function (round, placements, iid, spot) {
    const B = round.B;
    const it = round.items[iid];
    const pl = Object.assign({}, placements, { [iid]: spot });
    const st = stateOf(round, pl);
    const lost = [];
    round.rows.forEach((r) => {
      if (r.type === "place" && Rel.matches(it, r)) {
        if (!Rel.satisfies(st, B, spot, r.rel, r.anchor, iid) && !(r.anchor && typeof r.anchor === "object")) lost.push(r.id);
      } else if (r.type === "count" && Rel.matches(it, r)) {
        const inGroup = Rel.satisfies(st, B, spot, r.rel, r.anchor, iid);
        const n = Object.keys(round.items).filter((j) => pl[j] !== TRAY && Rel.matches(round.items[j], r) && Rel.satisfies(st, B, pl[j], r.rel, r.anchor, j)).length;
        if (!inGroup || n > r.n) lost.push(r.id);
      } else if (r.type === "leave" && Rel.matches(it, r)) {
        if (spot !== (round.start[iid] || TRAY)) lost.push(r.id);
      } else if (r.type === "class" && Rel.matches(it, r.all)) {
        if (!Rel.satisfies(st, B, spot, r.rel, r.anchor, iid)) lost.push(r.id);
      } else if (r.type === "not") {
        if (Rel.satisfies(st, B, spot, r.rule.rel, r.rule.anchor, iid) && Rel.matches(it, r.rule.all)) lost.push(r.id);
      }
    });
    return lost;
  };

  /**
   * The Done check. lost: row ids already lost (a live wiggle, a hint on
   * that row). tested: rows whose words are past stage 1 (all, in the bot).
   * Ear: >=2 tested rows (D star_sets minTested), every tested row holds,
   * none lost.
   */
  Rules.grade = function (round, placements, lost = [], tested) {
    const st = stateOf(round, placements);
    const holds = round.rows.map((r) => Rel.holds(st, r, round.B));
    const t = tested || round.rows.map((r) => r.id);
    const min = ((D.star_sets || {}).tidy || {}).minTested || 2;
    const ear = t.length >= min && round.rows.every((r, k) => !t.includes(r.id) || (holds[k] && !lost.includes(r.id)));
    return { holds, ear, tested: t.length };
  };

  /* ---------------- Ali's turn: the closed sets (D.4 S2) ---------------- */
  /** For each row, the listens in order: [{slot, answer, choices}]. */
  Rules.aliListens = function (round, level) {
    const slots = Rules.mech("tell", level).slots;
    const trayWords = [...new Set(round.order.map((i) => round.items[i].word))];
    const places = round.addressable.map((k) => {
      const g = round.B.groups.find((x) => x.key === k);
      return { key: k, w: anchorWord(round, g.anchor) || D.relations[g.rel].word };
    });
    return round.rows
      .filter((r) => r.type === "place" || r.type === "count")
      .map((r) => {
        const listens = [];
        slots.forEach((s) => {
          if (s === "noun") {
            const others = trayWords.filter((w) => w !== r.item);
            listens.push({ slot: "noun", answer: r.item, choices: [r.item, ...others.slice(0, 5)] });
          } else if (s === "count" && r.type === "count") {
            listens.push({ slot: "count", answer: Rules.numId(r.n), choices: [1, 2, 3].map(Rules.numId) });
          } else if (s === "place" && !(r.anchor && typeof r.anchor === "object")) {
            const key = `${r.rel}|${r.anchor || ""}`;
            const here = places.find((p) => p.key === key);
            if (here) listens.push({ slot: "place", answer: here.w, choices: [here.w, ...places.filter((p) => p.key !== key).map((p) => p.w)].slice(0, 5) });
          }
        });
        return { row: r, listens };
      });
  };

  return Rules;
});
