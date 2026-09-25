/*
 * Dress up: the look generator (design D.1, D.5, 8.4; build brief task 1).
 *
 *   Dress.Look.generate({game, level, data, rng, profile, who}) -> round
 *
 * A round is renderer-agnostic data:
 *   {game, kind, level, renderer, speaker, who, people, rows[], scope,
 *    change?, passme?, weather?, say?, hideCard, check, odds, oddsReal}
 * A row is {id, who?, slot, garment?, colour?, no?, count?, size?, thing?,
 * motif?, part?, side?}. `scope` is what the rack will hold (the balanced
 * decoys); js/dress/rack.js lays it out, js/dress/grade.js checks a worn
 * state against the rows. Nothing here knows how a look is drawn.
 *
 * Leak rules obeyed here: 2 and 3 (every scope is a full kinds x colours
 * grid, so the asked kind shows in every colour and the asked colour on
 * every kind), 5 (rows shuffled, "no" rows placed at random), 6 (no taste
 * decides a row), 7 (an occasion never decides a row alone: every positive
 * row carries a colour) and 11 (the blind-odds budget: the generator
 * computes the best blind strategy's chance with Pick.setOdds and widens
 * the scope until it is <= data.budget.blindOdds).
 *
 * Levels are data (data/dress.json games.<id>.levels, each level lists only
 * what changes, as Cook's mechanics do). Pure: runs in Node for the bot.
 */
(function (root) {
  const Dress = (root.Dress = root.Dress || {});
  const Pick = Dress.Pick || (typeof require === "function" ? require("./stubs/pick.js") : null);
  const Look = (Dress.Look = {});

  const clone = (v) => JSON.parse(JSON.stringify(v));
  /** The knobs for game `id` at `level`: levels 1..n merged in order. */
  Look.knobs = function (data, id, level) {
    const levels = (data.games[id] || data.mechanics[id] || {}).levels || [{}];
    const n = Math.max(1, Math.min(levels.length, Math.round(level) || 1));
    const out = {};
    for (let i = 0; i < n; i++) Object.assign(out, clone(levels[i]));
    out.level = n;
    return out;
  };
  Look.GAMES = ["layout", "fitting", "table", "bangles", "going-out"];
  Look.PEOPLE = ["nana", "ma", "cousin"];

  let rowSeq = 0;
  const row = (r) => Object.assign({ id: `r${++rowSeq}` }, r);
  const itemKey = (i) => [i.kind, i.colour, i.size, i.motif].join("|");

  function ctx(opts) {
    const data = opts.data;
    const rng = opts.rng || Math.random;
    const stage = (id) => (opts.profile && opts.profile.stage ? opts.profile.stage(id) : 2);
    // weak words first: a word at stage 1 is four times as likely as a known one
    const weak = (id) => 5 - Math.min(4, stage(id));
    const salience = (id) => (data.words[id] || {}).salience || 0;
    return { data, rng, weak, salience, budget: (data.budget || {}).blindOdds || 0.05 };
  }
  const palette = (c, k) => c.data.palettes[k.palette || "focal"];

  /* ---------------- G2 Lay it out (K2, flat-lay) ---------------- */
  function layout(c, k, opts) {
    const people = opts.people || Pick.sample(c.rng, Look.PEOPLE, k.people);
    let kinds = Pick.sample(c.rng, c.data.flat_kinds, k.kinds, c.weak);
    let colours = Pick.sample(c.rng, palette(c, k), k.colours, c.weak);
    for (let tries = 0; tries < 8; tries++) {
      const scope = Pick.grid(kinds, colours).map((i) => Object.assign(i, { slot: "shelf" }));
      const free = scope.slice();
      const rows = [];
      people.forEach((who) => {
        const n = Pick.int(c.rng, k.rowsEach);
        Pick.sample(c.rng, free, n, (i) => c.weak(i.kind) + c.weak(i.colour)).forEach((it) => {
          free.splice(free.indexOf(it), 1);
          rows.push(row({ who, slot: "pile", garment: it.kind, colour: it.colour }));
        });
      });
      const change = maybeChange(c, k, rows, (r) => free.filter((i) => i.kind === r.garment));
      const odds = pileOdds(c, scope, rows, people, change);
      if (odds <= c.budget || tries === 7) {
        return { renderer: "flat", speaker: "nani", who: "nani", people, rows: Pick.shuffle(c.rng, rows), scope, change, odds, oddsReal: null, check: k.check || "done" };
      }
      // over budget: one more decoy colour if the palette has one, else one more kind
      const moreC = palette(c, k).filter((x) => !colours.includes(x));
      if (moreC.length) colours = colours.concat([Pick.choose(c.rng, moreC)]);
      else kinds = kinds.concat(Pick.sample(c.rng, c.data.flat_kinds.filter((x) => !kinds.includes(x)), 1));
    }
  }
  /** Piles: each person's rows are a set picked from what's left of the shelf. */
  function pileOdds(c, scope, rows, people, change) {
    const final = finalRows(rows, change);
    let left = scope.slice();
    return Pick.product(
      people.map((who) => {
        const ans = final.filter((r) => r.who === who).map((r) => ({ kind: r.garment, colour: r.colour }));
        const p = Pick.setOdds(left, ans, { features: ["kind", "colour"], salience: c.salience });
        left = left.filter((i) => !ans.some((a) => a.kind === i.kind && a.colour === i.colour));
        return p;
      })
    );
  }

  /* change of mind (D.3 `change`): one positive row gets a new colour, one in four a false alarm */
  function maybeChange(c, k, rows, candidates) {
    if (!k.change || c.rng() >= k.change) return null;
    const pos = rows.filter((r) => !r.no && r.colour);
    if (!pos.length) return null;
    const r = Pick.choose(c.rng, pos);
    const alts = candidates(r).filter((i) => i.colour !== r.colour);
    if (!alts.length) return null;
    const falseAlarm = c.rng() < (k.falseAlarm || 0.25);
    const to = falseAlarm ? r.colour : Pick.choose(c.rng, alts).colour;
    return { row: r.id, from: r.colour, to, falseAlarm };
  }
  /** The rows as they stand after any change of mind (what the grader checks). */
  function finalRows(rows, change) {
    if (!change) return rows;
    return rows.map((r) => (r.id === change.row ? Object.assign({}, r, { colour: change.to }) : r));
  }
  Look.finalRows = (round) => finalRows(round.rows, round.change);

  /* ---------------- G1 The fitting (K1, upper body) ---------------- */
  function fitting(c, k, opts, { rowsN = k.rows, askSlots = null, avoid = [] } = {}) {
    const who = opts.who || Pick.choose(c.rng, Look.PEOPLE);
    const person = c.data.people[who];
    const slots = c.data.slots.upper;
    let nColours = k.colours;
    for (let tries = 0; tries < 8; tries++) {
      const colours = Pick.sample(c.rng, palette(c, k), Math.min(nColours, palette(c, k).length), c.weak);
      const scope = [];
      const kindsBySlot = {};
      slots.forEach((slot) => {
        const avail = person.kinds[slot];
        const ok = avail.filter((x) => !avoid.includes(x));
        kindsBySlot[slot] = Pick.sample(c.rng, ok.length >= 2 ? ok : avail, Math.min(k.kinds, avail.length), c.weak);
        Pick.grid(kindsBySlot[slot], colours).forEach((i) => scope.push(Object.assign(i, { slot })));
      });
      const asked = Pick.sample(c.rng, askSlots || slots, Math.min(rowsN, (askSlots || slots).length));
      const noAt = rowsN >= 2 && k.no && c.rng() < k.no ? Pick.choose(c.rng, asked) : null;
      const rows = asked.map((slot) => {
        if (slot === noAt) return row({ who, slot, garment: Pick.choose(c.rng, kindsBySlot[slot]), no: true });
        const it = Pick.weighted(c.rng, scope.filter((i) => i.slot === slot), (i) => c.weak(i.kind) + c.weak(i.colour));
        return row({ who, slot, garment: it.kind, colour: it.colour });
      });
      const change = maybeChange(c, k, rows, (r) => scope.filter((i) => i.slot === r.slot && i.kind === r.garment));
      const final = finalRows(rows, change);
      // a "no" row counts as a sure thing for the bot (conservative: it might leave the slot empty)
      const parts = final.filter((r) => !r.no).map((r) => Pick.setOdds(scope.filter((i) => i.slot === r.slot), [{ kind: r.garment, colour: r.colour }], { features: ["kind", "colour"], salience: c.salience }));
      const odds = Pick.product(parts) * (opts.extraOdds || 1);
      if (odds <= c.budget || tries === 7) {
        // the only real Kutchi in a fitting today is nar (a no row): wear it or not
        const oddsReal = rows.some((r) => r.no) ? 0.5 : null;
        return { renderer: "upper", speaker: "client", who, people: [who], rows: Pick.shuffle(c.rng, rows), scope, kindsBySlot, change, odds, oddsReal, check: k.check || "done" };
      }
      nColours++;
    }
  }

  /* ---------------- G3 Big Ma's mending (K3, the table) ---------------- */
  function table(c, k) {
    // over budget: one more tool on Big Ma's board (up to all four), then one more colour in the tin
    let nTools = k.tools || 3;
    let extraColours = 0;
    for (let tries = 0; ; tries++) {
      const r = tableOnce(c, k, nTools, extraColours);
      if (r.odds <= c.budget || tries >= 6) return r;
      if (nTools < c.data.tools.length) nTools++;
      else extraColours++;
    }
  }
  function tableOnce(c, k, nTools, extraColours) {
    const rows = [];
    const scopes = {};
    const parts = [];
    let oddsReal = 1;
    const sizes = ["big", "small"];
    const pal = palette(c, k);
    if (k.buttons) {
      const colours = Pick.sample(c.rng, pal, Math.min(pal.length, k.colours + extraColours), c.weak);
      scopes.tin = Pick.grid(["ph-button"], colours, k.sizes ? { size: sizes } : {});
      const it = Pick.choose(c.rng, scopes.tin);
      const r = row({ slot: "placket", thing: "ph-button", count: Pick.int(c.rng, k.buttons.count), colour: it.colour, size: it.size });
      rows.push(r);
      parts.push(Pick.rangeOdds(k.buttons.count) * Pick.setOdds(scopes.tin, [it], { salience: c.salience }));
      oddsReal *= Pick.rangeOdds(k.buttons.count) * (k.sizes ? 1 / sizes.length : 1);
    }
    if (k.motif) {
      const m = k.motif;
      const motifs = Pick.sample(c.rng, c.data.motifs, m.motifs, c.weak);
      const colours = Pick.sample(c.rng, pal, Math.min(pal.length, m.colours + extraColours), c.weak);
      scopes.tray = Pick.grid(motifs, colours, m.sizes ? { size: sizes } : {}).map((i) => Object.assign(i, { motif: i.kind, kind: "motif" }));
      const it = Pick.choose(c.rng, scopes.tray);
      const part = Pick.choose(c.rng, c.data.parts);
      const side = m.sides && part === "ph-sleeve" ? Pick.choose(c.rng, ["ph-left", "ph-right"]) : null;
      const r = row({ slot: "part", thing: "motif", motif: it.motif, colour: it.colour, size: it.size, count: Pick.int(c.rng, m.count), part, side });
      rows.push(r);
      const places = c.data.parts.length + (m.sides ? 1 : 0); // the sleeve splits into left and right
      parts.push(Pick.rangeOdds(m.count) * Pick.setOdds(scopes.tray, [it], { salience: c.salience }) * (1 / places));
      oddsReal *= Pick.rangeOdds(m.count) * (m.sizes ? 1 / sizes.length : 1);
    }
    const tool = Pick.choose(c.rng, c.data.tools);
    const options = Pick.shuffle(c.rng, [tool].concat(Pick.sample(c.rng, c.data.tools.filter((t) => t !== tool), nTools - 1)));
    parts.push(1 / options.length);
    const passme = { want: tool, options };
    return { renderer: "flat", speaker: "bigma", who: "bigma", people: [], rows, scope: [].concat(scopes.tin || [], scopes.tray || []), scopes, passme, odds: Pick.product(parts), oddsReal, check: "done", spots: k.spots || 5 };
  }

  /* ---------------- G4 Bangles ---------------- */
  function bangles(c, k) {
    const colours = Pick.sample(c.rng, palette(c, k), k.colours, c.weak);
    const scope = [];
    colours.forEach((colour) => {
      for (let i = 0; i < (k.each || 7); i++) scope.push({ kind: "ph-bangle", colour, slot: "tray" });
    });
    const asked = Pick.sample(c.rng, colours, k.rows, c.weak);
    const rows = asked.map((colour) => row({ who: "ma", slot: "wrist", garment: "ph-bangle", colour, count: Pick.int(c.rng, k.count) }));
    const pickColours = Pick.setOdds(colours.map((colour) => ({ kind: "ph-bangle", colour })), asked.map((colour) => ({ kind: "ph-bangle", colour })), { salience: c.salience });
    const odds = pickColours * Pick.product(rows.map(() => Pick.rangeOdds(k.count)));
    const oddsReal = Pick.product(rows.map(() => Pick.rangeOdds(k.count)));
    // "say how many": Ma asks about one colour on her wrist (D.4); the closed set is hikdo..panj
    const sayRow = k.say ? Pick.choose(c.rng, rows) : null;
    const say = sayRow ? { row: sayRow.id, colour: sayRow.colour, answer: sayRow.count, choices: c.data.real.numbers.slice() } : null;
    return { renderer: "wrist", speaker: "client", who: "ma", people: ["ma"], rows: Pick.shuffle(c.rng, rows), scope, colours, odds, oddsReal, check: "done", say, each: k.each || 7 };
  }

  /* ---------------- G5 Going out (K4): pure logic only until phase 3 ---------------- */
  /**
   * The weather is heard, never seen (leak rule 8). Rows are colour rows on
   * the top only, so no asked garment is one the weather forbids; the carry
   * tray (umbrella, hat, shawl…) is graded both ways by needs and forbids.
   * The blind part of the odds is exact: the best fixed choice of carry
   * items over the four weathers.
   */
  function goingOut(c, k, opts) {
    const weather = Pick.choose(c.rng, c.data.weather);
    const W = c.data.words;
    const carry = k.carry.slice();
    let best = 0;
    for (let m = 0; m < 1 << carry.length; m++) {
      const set = carry.filter((_, i) => m & (1 << i));
      const wins = c.data.weather.filter((w) => Dress.Look.weatherOk(W[w], set)).length;
      best = Math.max(best, wins / c.data.weather.length);
    }
    const r = fitting(c, Object.assign({}, k, { no: 0, change: 0 }), Object.assign({ who: "cousin", extraOdds: best }, opts), { rowsN: k.rows, askSlots: ["top"], avoid: W[weather].forbids || [] });
    return Object.assign(r, { speaker: "nani", weather, weatherDef: { needs: W[weather].needs || [], forbids: W[weather].forbids || [] }, carry: Pick.shuffle(c.rng, carry), oddsWeather: best });
  }
  /** Does a set of worn/carried kinds suit a weather (every needs group met, nothing forbidden)? */
  Look.weatherOk = (w, kinds) => (w.needs || []).every((g) => g.some((x) => kinds.includes(x))) && !(w.forbids || []).some((x) => kinds.includes(x));

  const GEN = { layout, fitting, table, bangles, "going-out": goingOut };

  /**
   * One round. opts: {game, level, data, rng, profile?, who?, people?}.
   * kind "K5" (Tell them) returns the G1 round with the child as speaker.
   */
  Look.generate = function (opts) {
    const c = ctx(opts);
    const game = opts.game;
    const def = c.data.games[game];
    if (!def || !GEN[game]) throw new Error(`no Dress up game ${game}`);
    const k = Look.knobs(c.data, game, opts.level || 1);
    const r = GEN[game](c, k, opts);
    const kind = opts.kind === "K5" ? "K5" : def.kind;
    return Object.assign(r, { game, id: def.id, kind, level: k.level, hideCard: !!k.hideCard, speaker: kind === "K5" ? "child" : r.speaker, knobs: k });
  };

  /**
   * A row as phrase tokens in the language's order (data.grammar):
   * {w: wordId} | {n: number} | {frame: lineKey, parts: [...]}. The page
   * turns them into Cook.Lang lines; the bot never reads them.
   */
  Look.tokens = function (r, data) {
    const G = data.grammar;
    const sizeId = (s) => s && data.real.sizes[s];
    const tok = {
      colour: () => r.colour && { w: r.colour },
      garment: () => r.garment && { w: r.garment },
      thing: () => r.thing && { w: r.thing },
      motif: () => r.motif && { w: r.motif },
      count: () => r.count != null && { n: r.count },
      size: () => r.size && { w: sizeId(r.size) },
      side: () => r.side && { w: r.side },
      part: () => r.part && { w: r.part },
      on: () => r.part && { frame: "dress-on", parts: G.on.map((t) => tok[t]()).filter(Boolean) },
    };
    if (r.no) return [{ w: r.garment }];
    const order = r.thing === "ph-button" ? G.buttons : r.thing === "motif" ? G.motif : r.garment === "ph-bangle" ? G.bangles : G.look;
    // a motif row: count 1 is said without the number ("a yellow flower")
    return order.map((t) => (t === "count" && r.thing === "motif" && r.count === 1 ? null : tok[t]())).filter(Boolean);
  };

  /** Every word id a round uses (the word review, the progress marks). */
  Look.words = function (round, data) {
    const ids = new Set();
    const walk = (ts) =>
      ts.forEach((t) => {
        if (t.w) ids.add(t.w);
        if (t.n != null) ids.add(data.real.numbers[t.n - 1]);
        if (t.parts) walk(t.parts);
      });
    finalRows(round.rows, round.change).forEach((r) => {
      walk(Look.tokens(r, data));
      if (r.no) ids.add(data.real.no);
    });
    if (round.passme) ids.add(round.passme.want);
    if (round.weather) ids.add(round.weather);
    return [...ids];
  };
  Look.itemKey = itemKey;

  if (typeof module === "object" && module.exports) module.exports = Look;
})(typeof globalThis !== "undefined" ? globalThis : this);
