/*
 * Cook with Nani: recipes as data (Phase A; data engine 24 Sept 2026).
 *
 * A recipe lives in data/cook.json -> recipes.<id>. It has:
 *   slots  what varies from order to order (what, how many, which order,
 *          how, for whom, "no X"), filled from the customer's tastes, the
 *          player's word stages and chance. Types: plain values (int, pick,
 *          chance, taste), "items" (a sequence or an any-order group),
 *          "no" (leave-it-out list), "people" (per-person items: cups for
 *          Nana and Ma) and "tally" (quantities per kind: 2 meat, 1 veg).
 *   say    the order as spoken: frames (roles like "order", "and", "no")
 *          with phrase parts, lists and per-item lines. The words and the
 *          grammar come from data.lines / data.grammar, never from here.
 *   need   what the pantry step fetches.   steps  the mission card chips.
 *   run    station calls in order, each {"do": mechanic, ...params} with
 *          "$slot" and "@object" references, plus "if", "repeat",
 *          "forEach", "step", "as" and a few scene ops (view, vessel,
 *          counter, colour, interrupt, serve, result, wait).
 * Principle: nothing the player does is decided by memory of a fixed
 * recipe; every choice comes from something said in Kutchi (or its
 * English placeholder) and it changes from order to order.
 *
 * R.<id> keeps the Phase A API: make(who, {usual, level}), lines(d, i),
 * need(d), steps(d), run(S, ctx, d), plus ladder(d, i) for the order
 * ladder: one row per thing asked for, with its dot (sequence), group
 * ("seq" | "any"), quantity, who it's for, and "no" rows. These rows are
 * the one source of truth for an order: js/cook/order.js (Cook.Order)
 * turns them into what the mission card draws and what the customer
 * says (any-order rows shuffled, "no" rows sprinkled, "ne poi" between
 * steps), so lines(d, i) is the unshuffled form, for tools and tests.
 * A say entry with "when": "<station>" is on the ladder but not said in
 * the order: its rows appear when that station starts.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const R = (Cook.Recipes = {});
  /** Code overrides for a dish that data can't express yet: R.code[id] = {run(S, ctx, d) {…}}. */
  R.code = R.code || {};
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  const clone = (v) => (v == null || typeof v !== "object" ? v : JSON.parse(JSON.stringify(v)));
  const truthy = (v) => (Array.isArray(v) ? v.length > 0 : !!v);
  const tasteOf = (who, recipe) => ((Cook.data.customers[who] || {}).tastes || {})[recipe] || {};

  /* ---------------- references and conditions ---------------- */
  function lookup(path, env) {
    const [head, ...rest] = path.split(".");
    let v;
    if (env.vars && head in env.vars) v = env.vars[head];
    else if (env.d && head in env.d) v = env.d[head];
    else if (env.lists && head in env.lists) v = env.lists[head];
    else if (head === "need" && env.need) v = env.need();
    else if (head === "basket" && env.ctx) v = env.ctx.basket;
    for (const key of rest) v = v == null ? undefined : v[key];
    return v;
  }
  function objLookup(path, env) {
    const [head, ...rest] = path.split(".");
    let v = (env.objs || {})[head];
    for (const key of rest) v = v == null ? undefined : v[key];
    return v;
  }
  /** "dudh", "!dudh", or a list of them (all must hold). */
  function cond(c, env) {
    if (c == null) return true;
    if (Array.isArray(c)) return c.every((x) => cond(x, env));
    const neg = c.startsWith("!");
    const v = truthy(lookup(neg ? c.slice(1) : c, env));
    return neg ? !v : v;
  }
  const isRef = (x) => typeof x === "string" && (x[0] === "$" || x[0] === "@");
  const isIf = (x) => isObj(x) && "if" in x && Object.keys(x).every((k) => k === "if" || k === "then" || k === "else");
  /** Resolve "$slot", "@object", {"if", "then", "else"} anywhere in a value. */
  function res(v, env) {
    if (typeof v === "string") {
      if (v[0] === "$") return lookup(v.slice(1), env);
      if (v[0] === "@") return objLookup(v.slice(1), env);
      return v;
    }
    if (Array.isArray(v)) {
      const out = [];
      v.forEach((x) => {
        const r = res(x, env);
        if (r == null) return;
        if (Array.isArray(r) && (isRef(x) || isIf(x))) out.push(...r);
        else out.push(r);
      });
      return out;
    }
    if (isIf(v)) return cond(v.if, env) ? res(v.then, env) : res(v.else, env);
    if (isObj(v)) {
      const o = {};
      Object.keys(v).forEach((k) => {
        const r = res(v[k], env);
        if (r !== undefined) o[k] = r;
      });
      return o;
    }
    return v;
  }

  /* ---------------- slot values ---------------- */
  /** Weak words first (low stage), with a little shuffle: "prefer": "weak". */
  const byWeak = (ids) => ids.slice().sort((a, b) => Cook.wordStage(a) - Cook.wordStage(b) + (Math.random() - 0.5));
  function fromTaste(spec, env) {
    if (!spec.taste) return undefined;
    const t = env.taste[spec.taste];
    if (t === undefined || t === null) return undefined;
    const chance = spec.tasteChance != null ? spec.tasteChance : 1;
    return env.usual || Math.random() < chance ? clone(t) : undefined;
  }
  function value(spec, env) {
    if (spec == null || typeof spec !== "object") return isRef(spec) ? res(spec, env) : spec;
    if (Array.isArray(spec)) return spec.map((s) => value(s, env));
    if (spec.type) return TYPES[spec.type](spec, env);
    const t = fromTaste(spec, env);
    if (t !== undefined) return t;
    if ("usual" in spec && env.usual) return spec.usual;
    let v;
    if (spec.int) v = rand(spec.int[0], spec.int[1]);
    else if (spec.pick) {
      // null is a real choice here ("no extra"), so resolve items one by one
      const from = Array.isArray(spec.pick) ? spec.pick.map((x) => (isRef(x) ? res(x, env) : x)) : res(spec.pick, env);
      v = value(spec.prefer === "weak" ? byWeak(from.filter(Boolean))[0] : Cook.pick(from), env);
    } else if ("chance" in spec) v = Math.random() < spec.chance ? ("then" in spec ? value(spec.then, env) : true) : "else" in spec ? value(spec.else, env) : false;
    else if ("else" in spec) v = value(spec.else, env);
    else if ("value" in spec) v = value(spec.value, env);
    if (spec.zero && Math.random() < spec.zero) v = 0;
    return v;
  }
  const listOf = (v, env) => [].concat(res(v, env) || []).flat();
  const TYPES = {
    /**
     * A list of word ids: `first` (fixed at the start), `always` (in,
     * shuffled with the rest), `take` [min, max] more `from` a pool,
     * `exclude` (slot names, e.g. the "no" list), `repeats`, `tasteAdd`
     * (taste keys added if missing), `shuffle` (all but `first`),
     * `prefer: "weak"`. `order`: "sequence" (each its own step) or "any"
     * (one group) — the order ladder's dots.
     */
    items(spec, env) {
      const t = fromTaste(spec, env);
      if (t !== undefined) return t;
      const first = [].concat(value(spec.first || [], env)).flat().filter(Boolean);
      const exclude = [].concat(spec.exclude || []).flatMap((s) => [].concat(env.d[s] || []));
      // a "no X" beats a default or a usual topping (wave 3: always/tasteAdd respect `exclude`)
      const always = listOf(spec.always || [], env).filter((x) => !exclude.includes(x));
      const pool = listOf(spec.from || [], env).filter((x) => !exclude.includes(x) && (spec.repeats || (!first.includes(x) && !always.includes(x))));
      const n = Array.isArray(spec.take) ? rand(spec.take[0], spec.take[1]) : spec.take || 0;
      const picked = spec.repeats ? Array.from({ length: n }, () => Cook.pick(pool)) : (spec.prefer === "weak" ? byWeak(pool) : Cook.shuffle(pool)).slice(0, n);
      let rest = always.concat(picked);
      (spec.tasteAdd || []).forEach((key) => {
        const v = env.taste[key];
        if (v && !exclude.includes(v) && !first.includes(v) && !rest.includes(v)) rest.push(v);
      });
      if (spec.shuffle) rest = Cook.shuffle(rest);
      return first.concat(rest);
    },
    /** "No X": the customer's own dislikes, else maybe one at random. */
    no(spec, env) {
      const out = [].concat(fromTaste(Object.assign({ taste: "no" }, spec), env) || []);
      if (!out.length && spec.else && Math.random() < (spec.else.chance != null ? spec.else.chance : 1)) out.push(Cook.pick(listOf(spec.else.from, env)));
      return out;
    },
    /**
     * Per-person items: [{who, ...each slot}] for `count` people, the
     * customer first (unless includeCustomer is false), then others from
     * `who` (customer ids; default everyone). Each person's slots use
     * that person's own tastes (for `tastes`, default this recipe's).
     */
    people(spec, env) {
      const all = res(spec.who, env) || Object.keys(Cook.data.customers);
      const n = value(spec.count != null ? spec.count : 1, env);
      const order = (spec.includeCustomer !== false && env.who && all.includes(env.who) ? [env.who] : []).concat(Cook.shuffle(all.filter((w) => w !== env.who)));
      return order.slice(0, n).map((who) => {
        const sub = { who };
        const penv = Object.assign({}, env, { taste: tasteOf(who, spec.tastes || env.tastes), d: sub, who });
        Object.keys(spec.each || {}).forEach((k) => (sub[k] = value(spec.each[k], penv)));
        return sub;
      });
    },
    /** Quantities per kind: {"ph-meat": 2, "veg-02": 1}. total, min, max per kind. */
    tally(spec, env) {
      const t = fromTaste(spec, env);
      if (t !== undefined) return t;
      const kinds = listOf(spec.kinds, env);
      const out = {};
      kinds.forEach((k) => (out[k] = (spec.min || {})[k] || 0));
      let left = value(spec.total, env) - kinds.reduce((a, k) => a + out[k], 0);
      while (left-- > 0) {
        const open = kinds.filter((k) => (spec.max || {})[k] == null || out[k] < spec.max[k]);
        if (!open.length) break;
        out[Cook.pick(open)]++;
      }
      return out;
    },
  };

  /* ---------------- saying the order (and the ladder) ---------------- */
  /** An order's say entries -> lines (what's spoken and shown) and ladder rows. */
  function build(def, d, i) {
    const env = { d, lists: def.lists || {}, vars: {} };
    const lines = [];
    const rows = [];
    let dot = 0;
    const who = (v) => {
      const c = Cook.data.customers[v];
      return c ? c.word || v : v;
    };
    const parts = (x, env) => {
      const out = [];
      (x || []).forEach((tok) => {
        if (isObj(tok) && "n" in tok) {
          const n = res(tok.n, env);
          out.push(...Lang.countParts(n, res(tok.of, env), { one: tok.one !== false }));
        } else if (isObj(tok) && "who" in tok) out.push(who(res(tok.who, env)));
        else {
          const r = res(tok, env);
          if (r == null) return;
          if (Array.isArray(r)) out.push(...r);
          else out.push(r);
        }
      });
      return out;
    };
    // sec: which top-level say entry a row came from (the ladder's sections);
    // when: a part said later, at its station (the tadka order, at the pan)
    const walk = (e, forWho, sec) => {
      if (!cond(e.if, env)) return;
      if (e.forEach) {
        const list = res(e.forEach, env) || [];
        const saved = env.vars.it;
        list.forEach((it, j) => {
          env.vars.it = it;
          env.vars.j = j;
          const f = e.for ? res(e.for, env) : forWho;
          (e.say || [Object.assign({}, e, { forEach: undefined })]).forEach((sub) => walk(sub, f, sec));
        });
        env.vars.it = saved;
        return;
      }
      const when = e.when || null;
      if (e.list) {
        // a spoken list; each step its own dot, an any-order group shares
        // one, and the same item twice running is one step with a count
        // ("be ghos": one dot per item type, never per unit)
        const steps = [];
        seriesOf(def, e.list, env).forEach((entry) => {
          const last = steps[steps.length - 1];
          if (!Array.isArray(entry) && last && last.entry === entry) last.n++;
          else steps.push({ entry, n: 1 });
        });
        // several steps: the next one is said with "ne poi" (grammar.then)
        const seq = steps.length > 1;
        const F = Lang.frames();
        const said = [];
        steps.forEach((st, si) => {
          dot++;
          [].concat(st.entry).forEach((id, j) => {
            const ps = st.n > 1 ? Lang.countParts(st.n, id) : [id];
            const ph = Lang.phrase(ps);
            const line = !said.length ? Lang.bare(ph) : Lang.line(seq && j === 0 && si > 0 ? F.seq : F.any, ph);
            said.push(line);
            rows.push({ kind: "item", ids: [id], qty: st.n, dot, group: Array.isArray(st.entry) ? "any" : "seq", for: forWho, line, parts: ps, list: true, sec, when });
          });
        });
        if (said.length && !when) lines.push(Lang.join(said));
        return;
      }
      if (e.tally) {
        const t = res(e.tally, env) || {};
        const ids = Object.keys(t).filter((k) => t[k] > 0);
        const ls = ids.map((id, j) => Lang.line(j === 0 ? (e.frame === "order" ? Lang.orderFrame(i) : e.frame || "and") : "and", Lang.phrase(Lang.countParts(t[id], id))));
        if (!ls.length) return;
        if (!when) lines.push(ls.length > 1 ? Lang.join(ls) : ls[0]);
        dot++;
        ids.forEach((id, j) => rows.push({ kind: "item", ids: [id], qty: t[id], dot, group: "any", for: forWho, line: ls[j], parts: Lang.countParts(t[id], id), sec, when }));
        return;
      }
      const frame = e.frame === "order" ? Lang.orderFrame(i) : e.frame;
      const ps = parts(e.x, env);
      const line = Lang.line(frame, e.x ? Lang.phrase(ps) : undefined);
      if (!when) lines.push(line);
      const kind = e.frame === "order" ? "dish" : e.frame === "no" ? "no" : "item";
      if (kind !== "no" && (e.dot === "next" || (kind === "dish" && !rows.length))) dot++;
      rows.push({ kind, ids: ps.filter((x) => typeof x === "string"), qty: ps.find((x) => typeof x === "number") || 1, dot: kind === "no" ? null : dot, group: "any", for: forWho, line, parts: ps, sec, when });
    };
    (def.say || []).forEach((e, k) => walk(e, e.for ? res(e.for, env) : undefined, k));
    return { lines, rows };
  }
  /** "$seq" -> a series: a sequence slot gives its ids, an any-order slot one group. */
  function seriesOf(def, refs, env) {
    return [].concat(refs).flatMap((r) => {
      const v = res(r, env);
      if (v == null) return [];
      const slot = typeof r === "string" && r[0] === "$" ? (def.slots || {})[r.slice(1)] : null;
      if (Array.isArray(v) && slot && slot.order === "any") return [v];
      return [].concat(v);
    });
  }

  /* ---------------- running it ---------------- */
  const CONTROL = ["do", "if", "step", "repeat", "forEach", "as", "run"];
  const zoneOf = (env) => env.zone || (env.zone = Mech.zone(env.S, env.ctx, { id: "scene", level: env.d.level || env.ctx.level }));
  const OPS = {
    /** Nani may ask for something here (ctx decides). */
    interrupt: (p, env) => env.ctx.maybePassMe(),
    /** A scene for the sub-steps that follow (pour, add, boil, count). */
    async view(p, env) {
      await St.begin(env.S, env.ctx, p.station, p.view);
      env.zone = Mech.zone(env.S, env.ctx, { id: "scene", level: p.level || env.d.level || env.ctx.level });
    },
    vessel(p, env) {
      const z = zoneOf(env);
      const at = St.pt(p.at, { x: 800, y: 450 });
      const [sx, sy] = p.shift || [0, 0];
      const i = env.vars.i || 0;
      const v = St.vessel(env.S, p.kind, z.X(at.x + sx * i), z.Y(at.y + sy * i), (p.scale || 1) * z.k);
      if (p.special && Cook.hasUpgrade(p.special)) env.S.special(v);
      if (p.liquid) v.setLiquid(p.liquid[0], St.color(p.liquid[1]));
      env.objs[p.id] = v;
      return v;
    },
    /** A row of ingredient bowls: {"items": [...], "except": [...]} -> @id.<wordId>. */
    counter(p, env) {
      const ids = [...new Set(p.items)].filter((id) => !(p.except || []).includes(id));
      env.objs[p.id] = St.ingredients(zoneOf(env), ids, p);
      return env.objs[p.id];
    },
    colour(p) {
      p.vessel.setLiquid(p.vessel.level, St.color(p.color));
    },
    serve(p, env) {
      env.ctx.served.push(Object.assign({ recipe: env.d.recipe }, p));
    },
    result(p, env) {
      const out = {};
      (p.slots || []).forEach((k) => (out[k] = env.d[k]));
      env.ctx.result[p.key || env.d.recipe] = out;
    },
    wait: (p) => Cook.wait(p.ms),
  };
  /** A mechanic, a combined station or a Phase A station function. */
  async function station(id, p, env) {
    const level = p.level || (env.d.levels || {})[id] || env.d.level || env.ctx.level;
    if (Mech.combos[id]) {
      env.zone = null;
      return Mech.host(id, env.S, env.ctx, p, { level });
    }
    const def = Mech.defs[id];
    if (def && def.station && def.view) {
      env.zone = null;
      return Mech.station(id, env.S, env.ctx, p, { level });
    }
    if (def) return Mech.run(id, zoneOf(env), Object.assign({ level }, p));
    if (typeof St[id] === "function") {
      env.zone = null;
      return St[id](env.S, env.ctx, p, { level });
    }
    throw new Error(`recipe step: no mechanic or station "${id}"`);
  }
  async function runSteps(steps, env) {
    for (const st of steps) {
      if (!cond(st.if, env)) continue;
      if (st.repeat != null || st.forEach != null) {
        const list = st.forEach != null ? res(st.forEach, env) || [] : Array.from({ length: res(st.repeat, env) || 0 }, (_, i) => i);
        const saved = { i: env.vars.i, it: env.vars.it };
        for (let i = 0; i < list.length; i++) {
          env.vars.i = i;
          env.vars.it = list[i];
          await runStep(st, env);
        }
        Object.assign(env.vars, saved);
      } else await runStep(st, env);
    }
  }
  async function runStep(st, env) {
    if (st.step && env.ctx.nextStep) env.ctx.nextStep(st.step);
    if (st.run) return runSteps(st.run, env);
    const p = {};
    Object.keys(st).forEach((k) => {
      if (CONTROL.includes(k)) return;
      const r = res(st[k], env);
      if (r !== undefined) p[k] = r;
    });
    const r = OPS[st.do] ? await OPS[st.do](p, env) : await station(st.do, p, env);
    if (st.as) env.vars[st.as] = r;
    return r;
  }

  /* ---------------- a recipe from its data ---------------- */
  function recipe(id) {
    const def = () => Cook.data.recipes[id];
    const r = {
      id,
      make(who, opts = {}) {
        const D = def();
        // a recipe can share another's tastes ("tastes": "chai")
        const taste = tasteOf(who, D.tastes || id);
        const d = { recipe: id };
        const usual = !!opts.usual && Object.keys(taste).length > 0;
        if (usual) d.usual = true;
        const env = { d, taste, usual, who, recipe: id, tastes: D.tastes || id, lists: D.lists || {}, vars: {} };
        Object.keys(D.slots || {}).forEach((k) => (d[k] = value(D.slots[k], env)));
        if (opts.level || D.level) d.level = opts.level || D.level;
        if (D.levels) d.levels = clone(D.levels);
        return d;
      },
      lines: (d, i) => build(def(), d, i).lines,
      ladder: (d, i) => build(def(), d, i).rows,
      need: (d) => res(def().need || [], { d, lists: def().lists || {}, vars: {} }),
      steps: (d) => res(def().steps || [], { d, lists: def().lists || {}, vars: {} }),
      async run(S, ctx, d) {
        const D = def();
        const env = { S, ctx, d, lists: D.lists || {}, vars: {}, objs: {}, zone: null, need: () => r.need(d) };
        await runSteps(D.run || [], env);
        if (env.zone) env.zone.close();
      },
    };
    return Object.assign(r, R.code[id] || {});
  }
  Cook.onLoad.push((data) => Object.keys(data.recipes || {}).forEach((id) => id[0] !== "_" && (R[id] = recipe(id))));
  /** Add a recipe from data at run time (a tool, a test, a recipe in its own file). */
  R.add = (id, def) => {
    Cook.data.recipes[id] = def;
    return (R[id] = recipe(id));
  };

  R.dishWord = (id) => Cook.data.recipes[id].name;
  /** The whole order as ladder rows: [{dish, kind, ids, qty, dot, group, for, line}]. */
  R.ladder = (order) => order.dishes.flatMap((d, i) => R[d.recipe].ladder(d, i).map((row) => Object.assign({ dish: i }, row)));
  // for tests and tools
  R._engine = { value, res, cond, build, TYPES };
})(window);
