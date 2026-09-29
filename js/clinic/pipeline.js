/*
 * The clinic's pipeline (pure: no DOM; runs in the browser and in Node).
 * docs/modes/clinic-design.md: the Mini-game quality pass (Q1-Q7) over the
 * Pipeline design (P1-P13). One patient goes through five stages, in order,
 * every time; what one stage decides is what the next one runs on:
 *
 *   waiting room (who) -> diagnosis (part + side -> the ailment) ->
 *   pharmacy (the belt: the prescription onto a fixed-slot tray; the doctor's
 *   handover check) -> heal (the registered game, docs/clinic-heal-api.md) ->
 *   send-off (the feeling, the goodbye) -> the end-of-round screen.
 *
 *   const P = ClinicPipeline;
 *   const plan = P.patient(data, {levels: {waiting: 1, ...}, rng, games});
 *   plan.stages.waiting / diagnosis / pharmacy / heal / sendoff
 *   P.morning(data, {session, levels, rng, games}) -> {patients: [plan], entry}
 *
 * Every decision is a graded ROW {id, stage, kind, answer, options, tested,
 * taught?, voice?}. The browser stages (js/clinic/stages/*.js) and the leak
 * bot (build/leak_clinic.mjs) judge the same rows with the same functions
 * (judgeWho, beltGrab/beltHandover/beltRows, judgeFace...), so the bot's
 * numbers are numbers for this code.
 *
 * `data` = data/clinic/pipeline.json with `items` merged in from
 * data/clinic.json (P.prepare(pipelineJson, clinicJson)).
 */
(function (root, factory) {
  const P = factory();
  if (typeof module === "object" && module.exports) module.exports = P;
  if (root) root.ClinicPipeline = P;
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const P = {};
  const STAGES = (P.STAGES = ["waiting", "diagnosis", "pharmacy", "heal", "sendoff"]);
  const NUM = (P.NUM = { 1: "hakro", 2: "ba", 3: "trae", 4: "char", 5: "panj" });

  /* ---------------- randomness ---------------- */
  P.rng = function (seed) {
    let a = seed >>> 0 || 0x9e3779b9;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const pick = (P.pick = (a, rng) => a[Math.floor(rng() * a.length)]);
  const shuffle = (P.shuffle = function (a, rng) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  });
  const between = (range, rng) => (Array.isArray(range) ? range[0] + Math.floor(rng() * (range[1] - range[0] + 1)) : range);
  /** A weighted draw from {key: weight}. */
  P.draw = function (weights, rng) {
    const keys = Object.keys(weights || {}).filter((k) => weights[k] > 0);
    if (!keys.length) return null;
    const total = keys.reduce((s, k) => s + weights[k], 0);
    let x = rng() * total;
    for (const k of keys) if ((x -= weights[k]) < 0) return k;
    return keys[keys.length - 1];
  };
  const clampL = (l) => Math.max(1, Math.min(3, l | 0 || 1));

  /* ---------------- data ---------------- */
  P.prepare = function (pipeline, clinic) {
    const d = Object.assign({}, pipeline);
    d.items = Object.assign({}, (clinic && clinic.items) || {}, pipeline.items || {});
    delete d.items._about;
    return d;
  };

  /* ---------------- words ---------------- */
  // A word is {kutchi, english}. kutchi may mix real Kutchi and [placeholders].
  const ph = (english) => `[${english}]`;
  P.fill = function (tpl, vars) {
    return String(tpl || "").replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  };
  /** A line from data.lines, filled: vars are {key: {kutchi, english}}. */
  P.line = function (data, id, vars = {}) {
    const l = (data.lines && data.lines[id]) || { english: id };
    const kv = {};
    const ev = {};
    Object.entries(vars).forEach(([k, v]) => {
      kv[k] = v && typeof v === "object" ? v.kutchi || ph(v.english) : v;
      ev[k] = v && typeof v === "object" ? v.english : v;
    });
    return { id, kutchi: l.kutchi ? P.fill(l.kutchi, kv) : null, english: P.fill(l.english, ev), who: l.who };
  };
  P.itemBase = function (data, id) {
    const it = data.items[id];
    return it && it.same ? it.same : id;
  };
  P.itemWord = function (data, id, o = {}) {
    const it = data.items[id] || data.items[P.itemBase(data, id)] || { english: String(id).replace(/-/g, " ") };
    let english = (it.english || String(id)).replace(/^the /, "");
    let kutchi = it.kutchi || null;
    let k = kutchi || ph(english);
    let e = english;
    if (o.colour) {
      k = `${ph(o.colour)} ${k}`;
      e = `${o.colour} ${e}`;
    }
    if (o.count > 1) {
      k = `${NUM[o.count]} ${kutchi ? k : k.replace(/\]$/, "s]")}`;
      e = `${o.count} ${e}${kutchi ? "" : "s"}`;
    }
    return { id, kutchi: k, english: e, placeholder: !kutchi && !o.count, word: { kutchi, english: it.english || english, id } };
  };
  P.kindWord = function (data, kind, o = {}) {
    const k = data.kinds[kind] || { english: kind };
    const noun = k.english.replace(/^the /, "");
    if (o.size) return { kutchi: `${o.size === "big" ? "wadho" : "nindho"} ${ph(noun)}`, english: `the ${o.size} ${noun}`, word: k.english };
    if (o.colour) return { kutchi: `${ph(k.english)} ${ph(data.colour_words[o.colour].english)}`, english: `${k.english} ${data.colour_words[o.colour].english}` };
    return { kutchi: ph(k.english), english: k.english };
  };
  P.partWord = function (data, part, side) {
    const w = data.part_words[part] || part;
    if (side) return { kutchi: ph(`my ${side} ${w}`), english: `my ${side} ${w}` };
    return { kutchi: ph(w), english: w };
  };

  /* ================= stage 1: the waiting room ================= */
  /**
   * Clinic v2 (docs/modes/clinic-v2-design-sheets.md W): the doctor leans out
   * of his door and calls "[Bring in] {description}"; the child taps the tick
   * under that person. The level is the language ladder (W4, Zafar):
   *   1 man / woman / boy / girl · 2 + old / young · 3 + tall / short ·
   *   4 + a colour (of clothes) · 5 + with the baby / with the child.
   * Every person carries the attributes of the rungs up to the level; the call
   * names the kind and the level's own word (plus earlier words only when
   * needed to make it one person), and the room always holds a near miss for
   * each word said (same kind but not the word; the word but another kind).
   * W1 one call; W3 the child calls them (a speaking moment, kinds only);
   * W4 two calls in the called order (pela ... ne poi ...), comfort rings.
   * Every ladder word is an English placeholder (to record).
   */
  const WHO_KINDS = { man: { young: "uncle", old: "old-man" }, woman: { young: "auntie", old: "old-woman" }, boy: { young: "boy" }, girl: { young: "girl" } };
  const ADULT = (who) => who === "man" || who === "woman";
  P.personKind = (p) => (WHO_KINDS[p.who] || {})[p.age || "young"] || (WHO_KINDS[p.who] || {}).young || p.who;
  /** The English words of a person under a description (a list of attribute names). */
  P.describe = function (data, p, attrs) {
    const W = data.ladder_words || {};
    const w = [];
    if (attrs.includes("height") && p.height) w.push(W[p.height] || p.height);
    if (attrs.includes("age") && p.age) w.push(W[p.age] || p.age);
    w.push(W[p.who] || p.who);
    if (attrs.includes("colour") && p.colour) w.push((data.colour_words[p.colour] || { english: `in ${p.colour}` }).english);
    if (attrs.includes("with") && p.with) w.push(W[p.with] || `with the ${p.with}`);
    const english = `the ${w.join(" ")}`;
    return { kutchi: ph(english), english, attrs: attrs.slice() };
  };
  const matches = (p, q, attrs) => p.who === q.who && attrs.every((a) => a === "kind" || (p[a] || null) === (q[a] || null));
  P.waitingRungs = (data, L) => (data.stages.waiting.rungs || ["kind"]).slice(0, Math.max(1, Math.min(5, L)));
  /** The shortest description (kind + the level's word first, then earlier words) that names just this person, or null. */
  P.uniqueAttrs = function (data, people, i, L, focus) {
    const rungs = P.waitingRungs(data, L);
    const p = people[i];
    const has = (a) => a === "kind" || p[a] != null;
    const tries = [];
    const base = ["kind"].concat(focus && focus !== "kind" && has(focus) ? [focus] : []);
    tries.push(base);
    rungs.filter((a) => a !== "kind" && !base.includes(a) && has(a)).forEach((a) => tries.push(tries[tries.length - 1].concat([a])));
    for (const t of tries) if (t.length <= 3 && people.filter((q) => matches(q, p, t)).length === 1) return t; // at most two words beside the kind
    return null;
  };
  P.waiting = function (data, level, rng, o = {}) {
    const S = data.stages.waiting;
    const L = Math.max(1, Math.min(S.maxLevel || 3, level | 0 || 1));
    let variant = o.variant || P.draw(S.mix[L] || S.mix[3], rng);
    if (variant === "W2") variant = "W1"; // W2 (kind + colour / size) is the ladder's rungs now
    if (variant === "W3" && o.speak === false) variant = "W1";
    if (variant === "W4" && L < 3 && !o.variant) variant = "W1";
    const rungs = P.waitingRungs(data, L);
    const focus = variant === "W3" ? "kind" : rungs[rungs.length - 1];
    const whos = ["man", "woman", "boy", "girl"];
    const colours = data.colours;
    // a random person with every rung's attribute up to L
    const person = (who) => {
      const p = { who, age: null, height: null, colour: null, with: null };
      if (rungs.includes("age") && ADULT(who)) p.age = rng() < 0.5 ? "old" : "young";
      if (rungs.includes("height")) p.height = rng() < 0.5 ? "tall" : "short";
      if (rungs.includes("colour")) p.colour = pick(colours, rng);
      if (rungs.includes("with") && ADULT(who) && rng() < 0.15) p.with = rng() < 0.5 ? "baby" : "child";
      return p;
    };
    const flip = { age: { old: "young", young: "old" }, height: { tall: "short", short: "tall" }, with: { baby: "child", child: "baby" } };
    const other = (a, v) => (a === "colour" ? pick(colours.filter((c) => c !== v), rng) : a === "with" ? (rng() < 0.5 ? null : flip.with[v]) : flip[a][v]);
    let n = o.first ? S.firstBench : o.bench || between(S.people[L] || S.people[3], rng);
    let people;
    let targets;
    for (let attempt = 0; attempt < 60; attempt++) {
      people = [];
      if (o.first) {
        people = shuffle(["girl", "boy"], rng).map((w) => ({ who: w, age: null, height: null, colour: null, with: null }));
        targets = [people.findIndex((p) => p.who === "girl")];
        break;
      }
      if (variant === "W3" || L === 1) {
        // kinds only: the four kinds, one of the called kind
        const t = pick(whos, rng);
        people.push(person(t));
        const rest = whos.filter((w) => w !== t);
        while (people.length < n) people.push(person(pick(rest, rng)));
      } else {
        // the target has the level's word; a near miss for each word
        const needAdult = focus === "age" || focus === "with";
        const tWho = pick(needAdult ? ["man", "woman"] : whos, rng);
        const t = person(tWho);
        if (focus === "with" && !t.with) t.with = rng() < 0.5 ? "baby" : "child";
        if (focus === "with" && t.with === "baby" && t.who === "man") t.with = "child"; // the baby sits with a woman (the stand-in art)
        people.push(t);
        const same = Object.assign({}, person(tWho), { [focus]: other(focus, t[focus]) });
        if (focus === "age") same.age = flip.age[t.age];
        people.push(same);
        const others = (needAdult ? ["man", "woman"] : whos).filter((w) => w !== tWho);
        const alt = Object.assign(person(pick(others, rng)), { [focus]: t[focus] });
        people.push(alt);
        while (people.length < n) people.push(person(pick(whos, rng)));
      }
      people.forEach((p) => p.with === "baby" && p.who === "man" && (p.with = "child"));
      people = shuffle(people, rng);
      // who can be called: a description naming just them (kind + the level's word first)
      const callable = people.map((p, i) => (variant === "W3" || L === 1 ? (people.filter((q) => q.who === p.who).length === 1 ? ["kind"] : null) : P.uniqueAttrs(data, people, i, L, focus)));
      const withFocus = people.map((p, i) => i).filter((i) => callable[i] && (focus === "kind" || callable[i].includes(focus)));
      if (!withFocus.length) continue;
      const a = pick(withFocus, rng);
      targets = [a];
      if (variant === "W4") {
        const b = people.map((p, i) => i).filter((i) => i !== a && callable[i]);
        if (!b.length) continue;
        targets.push(pick(b, rng));
      }
      break;
    }
    // the slots: the bench first, then the standing spots, then the little stools in front
    const nStand = o.first ? 0 : Math.min(S.standing[L] || 0, Math.max(0, people.length - 1));
    const benchN = Math.min(S.slots.bench.length, people.length - nStand);
    const slotList = shuffle(S.slots.bench, rng).slice(0, benchN).concat(S.slots.standing.slice(0, nStand)).concat(S.slots.front.slice(0, Math.max(0, people.length - benchN - nStand)));
    const order = shuffle(people.map((_, i) => i), rng);
    const bench = people.map((p, i) => Object.assign({}, p, { kind: P.personKind(p), slot: slotList[order.indexOf(i)] || `front${i}`, i }));
    const calls = targets.map((t) => {
      const attrs = variant === "W3" || L === 1 || o.first ? ["kind"] : P.uniqueAttrs(data, bench, t, L, focus);
      return { target: t, say: P.describe(data, bench[t], attrs), attrs };
    });
    const rows = calls.map((c, i) => ({
      id: `who${i}`,
      stage: "waiting",
      kind: variant === "W3" ? "say-who" : "who",
      answer: c.target,
      options: bench.map((b) => b.i),
      tested: true,
      voice: variant === "W3",
      word: c.say.english.replace(/^the /, ""),
      rung: focus,
    }));
    let card;
    if (variant === "W4") card = [Object.assign(P.line(data, "bring2", { a: calls[0].say, b: calls[1].say }), { id: "who" })];
    else if (variant === "W3") card = [Object.assign(P.line(data, "come", { kind: calls[0].say }), { id: "who0" })];
    else card = [Object.assign(P.line(data, "bring", { kind: calls[0].say }), { id: "who0" })];
    const patient = bench[calls[calls.length - 1].target];
    return { stage: "waiting", variant, level: L, rung: focus, bench, calls, rows, card, patient, ringsMs: S.ringsMs[L] || S.ringsMs[3] };
  };
  /** A tap on bench seat i for row r: right? */
  P.judgeWho = (row, i) => row.answer === i;

  /* ================= stage 2: diagnosis ================= */
  // the hands rest on the knees; the chest and tummy are close: one probe per region
  P.REGIONS = [["knee", "leg", "hand", "finger"], ["foot", "toe"], ["arm", "elbow", "shoulder"], ["head", "ear", "eye", "mouth", "tooth", "neck", "nose", "throat"], ["tummy", "chest"]];
  P.ailmentsFor = function (data, level, games) {
    return Object.keys(data.ailments)
      .filter((k) => k !== "_about")
      .filter((k) => (data.ailments[k].from || 1) <= level)
      .filter((k) => !games || games.includes(data.ailments[k].game));
  };
  /**
   * D1: 3 parts pulse (the sore one among them); taught at level 1 (no graded row).
   *     From level 2 (the old D1b, folded in: clinic v2 D) it's graded: each probe answers haa/na;
   *     the child presses Found it on haa, Next on na. "D1b" still names D1 at level 2 (old links).
   * D2: the patient says "[My knee hurts]" (level 3: "[My left knee]"); tap the part.
   * D3: the doctor calls a tool and a part (1 call at level 1, 2 at level 2, 3 at level 3); the find
   *     shows only at the sore one. Level 1 offers only the right tool plus one other (v2 D3).
   * pose: "sit" on the bed's edge (CB2b) for D1/D2, "stand" by the wall (CB3b) for the check-up (D3).
   */
  P.diagnosis = function (data, level, rng, o = {}) {
    const S = data.stages.diagnosis;
    const L = clampL(level);
    const ailmentId = o.ailment || pick(P.ailmentsFor(data, o.healLevel || L, o.games), rng) || "scrape";
    const ail = data.ailments[ailmentId];
    const part = o.part || (o.first ? ail.part : pick(ail.parts.filter((p) => (data.parts[L] || data.parts[3]).includes(p) || p === ail.part), rng) || ail.part);
    const sided = data.sided.includes(part);
    const side = sided ? (o.side || (rng() < 0.5 ? "left" : "right")) : null;
    let variant = o.variant || P.draw(S.mix[L], rng);
    let L2 = L;
    if (variant === "D1b") {
      variant = "D1"; // D1b is D1's level 2 now
      L2 = Math.max(2, L);
    }
    const graded = variant === "D1" && L2 >= 2;
    const pool = (data.parts[L] || data.parts[3]).filter((p) => p !== part);
    const rows = [];
    let probes = null;
    let calls = null;
    let card = [];
    let tools = null;
    if (variant === "D1") {
      const n = S.probe[L] || 3;
      // one probe per body region, so no two pulsing targets sit on top of each other on a phone
      const region = (p) => P.REGIONS.findIndex((g) => g.includes(p));
      const taken = new Set([region(part)]);
      const picks = [];
      shuffle(pool, rng).forEach((p) => {
        if (picks.length < n - 1 && !taken.has(region(p))) {
          taken.add(region(p));
          picks.push(p);
        }
      });
      probes = shuffle([part].concat(picks), rng);
      card = [Object.assign(P.line(data, "here"), { id: "probe" })];
      if (graded) rows.push({ id: "probe", stage: "diagnosis", kind: "probe", answer: part, options: probes, tested: true, word: data.part_words[part] });
    } else if (variant === "D2") {
      const say = L >= 3 && side ? P.line(data, "hurts-side", { side: { english: side }, part: { english: data.part_words[part] } }) : P.line(data, "hurts", { part: { english: data.part_words[part] } });
      // the placeholder frame: the whole line is English for now
      say.kutchi = `[${say.english}]`;
      card = [Object.assign(P.line(data, "where"), { id: "where" })];
      rows.push({ id: "where", stage: "diagnosis", kind: "part", answer: { part, side: L >= 3 ? side : null }, options: data.parts[L] || data.parts[3], tested: true, patientSays: say, word: data.part_words[part] });
    } else if (variant === "D3") {
      const all = Object.keys(S.tools);
      const toolFor = (p) => all.find((t) => S.tools[t].finds.includes(p)) || "hand";
      const nCalls = S.calls[L] || 2;
      const others = shuffle(pool.filter((p) => toolFor(p)), rng).slice(0, nCalls - 1);
      const parts = shuffle([part].concat(others), rng);
      calls = parts.map((p, i) => {
        const tool = toolFor(p);
        const sd = L >= 3 && data.sided.includes(p) ? (p === part ? side : rng() < 0.5 ? "left" : "right") : null;
        const w = sd ? `the ${sd} ${data.part_words[p]}` : `the ${data.part_words[p]}`;
        return { id: `check${i}`, part: p, side: sd, tool, sore: p === part, say: { kutchi: `[${S.tools[tool].english}] [${w}]`, english: `${S.tools[tool].english} ${w}` } };
      });
      card = calls.map((c) => ({ id: c.id, kutchi: c.say.kutchi, english: c.say.english }));
      // level 1: only the right tool plus one other (v2 D3); the kit keeps the data's order
      if (L === 1) {
        const keep = new Set(calls.map((c) => c.tool));
        keep.add(pick(all.filter((t) => !keep.has(t)), rng));
        tools = all.filter((t) => keep.has(t));
      } else tools = all;
      calls.forEach((c) => rows.push({ id: c.id, stage: "diagnosis", kind: "check", answer: { tool: c.tool, part: c.part, side: c.side }, options: tools, tested: true, word: data.part_words[c.part] }));
    }
    const said = P.prescription(data, ailmentId);
    const pose = o.pose || (variant === "D3" ? "stand" : "sit");
    return { stage: "diagnosis", variant, level: L, graded, ailment: ailmentId, part, side, probes, calls, tools, rows, card, pose, name: ail.say, prescription: said };
  };
  /** D1 (level 2+): the right act for a probe's answer. "No" is na (G9: not nar). */
  P.probeAnswer = (plan, probed) => (probed === plan.part ? "haa" : "na");
  P.judgeProbe = (plan, probed, act) => (probed === plan.part ? act === "found" : act === "next");
  /** D2: a tap on {part, side}. Sides count only when the row asks for one. */
  P.judgePart = (row, tap) => !!tap && tap.part === row.answer.part && (!row.answer.side || tap.side === row.answer.side);
  P.judgeCheck = (row, tool, tap) => tool === row.answer.tool && P.judgePart({ answer: { part: row.answer.part, side: row.answer.side } }, tap);

  /* ================= stage 3: the pharmacy (the belt) ================= */
  P.prescription = function (data, ailmentId) {
    const ail = data.ailments[ailmentId];
    return { items: ail.items.slice(), ask: ail.ask.slice() };
  };
  const keyOf = (P.beltKey = (it) => (it.colour ? `${it.id}:${it.colour}` : it.id));
  /**
   * The belt's plan: which items are asked (with colour/count at levels 2-3),
   * the order they must be tapped in (level 3), what rides the loop (the
   * asked ones + decoys: never a look-alike at level 1, one or two per asked
   * item from level 2), the speeds, and the card.
   */
  P.pharmacy = function (data, level, rng, o = {}) {
    const S = data.stages.pharmacy;
    const L = clampL(level);
    const K = S.levels[L];
    const ail = data.ailments[o.ailment];
    const nAsk = Math.min(ail.ask.length, o.first ? 1 : o.asks || between(K.asks, rng));
    // level 1 asks the first; from level 2 a draw of the list, kept in prescription order
    const askIds = L === 1 ? ail.ask.slice(0, nAsk) : shuffle(ail.ask, rng).slice(0, nAsk);
    const order = ail.items.filter((id) => askIds.includes(id)).concat(askIds.filter((id) => !ail.items.includes(id)));
    const asked = order.map((id) => ({ id }));
    const base = (id) => P.itemBase(data, id);
    const group = (id) => (data.items[id] || data.items[base(id)] || {}).group || id;
    // colour: one asked item that has colours (from level 2)
    if (K.colour && rng() < K.colour) {
      const c = asked.filter((a) => S.coloured[base(a.id)] || S.coloured[a.id]);
      if (c.length) {
        const a = pick(c, rng);
        a.colour = pick(S.coloured[base(a.id)] || S.coloured[a.id], rng);
      }
    }
    // count: one countable asked item (level 3)
    if (K.count && rng() < K.count) {
      const c = asked.filter((a) => S.countable.includes(a.id) && !a.colour);
      if (c.length) pick(c, rng).count = 2 + Math.floor(rng() * 2);
    }
    // what rides the belt
    const onBelt = o.first ? S.firstBelt : K.onBelt;
    const belt = asked.map((a) => ({ id: a.id, colour: a.colour || null }));
    const taken = new Set(belt.map(keyOf));
    const add = (it) => {
      if (taken.has(keyOf(it)) || belt.length >= onBelt) return false;
      taken.add(keyOf(it));
      belt.push(it);
      return true;
    };
    // look-alikes (from level 2): the same item in another colour, or another item from its group
    if (K.lookalikes) {
      asked.forEach((a) => {
        let n = 0;
        const cols = S.coloured[base(a.id)] || S.coloured[a.id];
        if (a.colour && cols) shuffle(cols.filter((c) => c !== a.colour), rng).forEach((c) => n < K.lookalikes && add({ id: a.id, colour: c }) && n++);
        const same = shuffle(S.decoys.filter((d) => d !== a.id && group(d) === group(a.id)), rng);
        same.forEach((d) => n < K.lookalikes && add({ id: d, colour: null }) && n++);
      });
    }
    const askedGroups = new Set(asked.map((a) => group(a.id)));
    const decoys = shuffle(S.decoys.filter((d) => !askIds.includes(d) && !askIds.map(base).includes(d) && (L > 1 || !askedGroups.has(group(d)))), rng);
    decoys.forEach((d) => add({ id: d, colour: null }));
    const loop = shuffle(belt, rng);
    // the card: the doctor's prescription
    const words = asked.map((a) => P.itemWord(data, a.id, a));
    let line;
    if (words.length === 1) line = P.line(data, "need1", { a: words[0] });
    else if (K.order) {
      const rest = words.slice(1).map((w) => w.kutchi).join(", ne poi ");
      const restE = words.slice(1).map((w) => w.english).join(", and then ");
      line = P.line(data, "needOrder", { a: words[0], rest: { kutchi: rest, english: restE } });
    } else {
      const rest = words.slice(1).map((w) => w.kutchi).join(", ne ");
      const restE = words.slice(1).map((w) => w.english).join(", and ");
      line = P.line(data, "needN", { a: words[0], rest: { kutchi: rest, english: restE } });
    }
    line.id = "need";
    const rows = asked.map((a, i) => ({ id: `grab${i}`, stage: "pharmacy", kind: "grab", answer: keyOf(a), options: loop.map(keyOf), tested: true, word: words[i].word.english }));
    if (K.order && asked.length > 1) rows.push({ id: "order", stage: "pharmacy", kind: "order", answer: asked.map(keyOf), tested: true });
    asked.forEach((a, i) => a.count && rows.push({ id: `count${i}`, stage: "pharmacy", kind: "count", answer: a.count, item: keyOf(a), tested: true }));
    // the heal tray: the prescription, the asked ones carrying their colour/count
    const tray = ail.items.map((id) => {
      const a = asked.find((x) => x.id === id);
      return a ? Object.assign({ id }, a.colour ? { colour: a.colour } : {}, a.count ? { count: a.count } : {}) : { id };
    });
    return {
      stage: "pharmacy",
      level: L,
      ailment: o.ailment,
      asked,
      loop,
      rows,
      card: [line],
      tray,
      words,
      everyMs: K.everyMs,
      crossMs: K.crossMs,
      stopper: !!K.stopper,
      slow: !!o.first,
    };
  };
  /** A fresh tray state for the belt: one dish per asked item. */
  P.beltState = (plan) => ({ dishes: plan.asked.map(() => null), taps: [], handovers: 0, first: null });
  /**
   * The child taps a belt item: a counted item already in a dish adds to it;
   * otherwise it hops to the next empty dish. Returns {dish, count} or null (tray full).
   */
  P.beltGrab = function (plan, st, it) {
    const k = keyOf(it);
    st.taps.push(k);
    const counted = plan.asked.find((a) => a.count && keyOf(a) === k);
    const inDish = st.dishes.findIndex((d) => d && d.key === k);
    if (counted && inDish >= 0) {
      st.dishes[inDish].count++;
      return { dish: inDish, count: st.dishes[inDish].count };
    }
    const i = st.dishes.findIndex((d) => !d);
    if (i < 0) return null;
    st.dishes[i] = { key: k, id: it.id, colour: it.colour || null, count: 1 };
    return { dish: i, count: 1 };
  };
  P.beltFull = (st) => st.dishes.every(Boolean);
  /**
   * The doctor's handover check (R3.1): he lifts each dish and names it; a
   * wrong one (or a wrong count) goes back to the belt with its name. The
   * FIRST handover is what the rows are judged on. Returns [{dish, ok, key, want}].
   */
  P.beltHandover = function (plan, st) {
    const want = plan.asked.map((a) => ({ key: keyOf(a), count: a.count || 1, used: false }));
    const out = st.dishes.map((d, i) => {
      if (!d) return { dish: i, ok: false, key: null };
      const w = want.find((x) => !x.used && x.key === d.key);
      if (w && (w.count === 1 || d.count === w.count)) {
        w.used = true;
        return { dish: i, ok: true, key: d.key };
      }
      return { dish: i, ok: false, key: d.key, countOff: !!w };
    });
    const missing = want.filter((w) => !w.used).map((w) => w.key);
    out.forEach((r) => !r.ok && (r.want = missing.shift() || null));
    if (!st.first) st.first = { dishes: st.dishes.map((d) => d && Object.assign({}, d)), taps: st.taps.slice() };
    st.handovers++;
    out.forEach((r) => !r.ok && (st.dishes[r.dish] = null));
    return out;
  };
  /** The belt's rows, judged on the first handover. */
  P.beltRows = function (plan, st) {
    const f = st.first || { dishes: st.dishes, taps: st.taps };
    const inTray = f.dishes.filter(Boolean);
    return plan.rows.map((r) => {
      if (r.kind === "grab") return { id: r.id, ok: inTray.some((d) => d.key === r.answer), row: r };
      if (r.kind === "order") {
        const firsts = [];
        f.taps.forEach((k) => r.answer.includes(k) && !firsts.includes(k) && firsts.push(k));
        return { id: r.id, ok: firsts.length === r.answer.length && firsts.every((k, i) => k === r.answer[i]), row: r };
      }
      if (r.kind === "count") {
        const d = inTray.find((x) => x.key === r.item);
        return { id: r.id, ok: !!d && d.count === r.answer, row: r };
      }
      return { id: r.id, ok: false, row: r };
    });
  };

  /* ================= stage 4: heal ================= */
  P.heal = function (data, level, rng, o = {}) {
    const ail = data.ailments[o.ailment];
    return { stage: "heal", level: clampL(level), game: ail.game, ailment: o.ailment, side: o.side || null, part: o.part || ail.part, tray: o.tray || ail.items.map((id) => ({ id })) };
  };

  /* ================= stage 5: the send-off ================= */
  /**
   * Clinic v2 (docs/modes/clinic-v2-design-sheets.md E; CQ6), on CB5:
   *   E1 (level 1, taught): the patient's face shows the feeling; pick the card (four: happy, sad, hot, cold).
   *   E2 (level 2): the patient SAYS it, no picture; pick the card; then the goodbye the doctor
   *      cues, in the scene (E3 is merged into E2: "E3" names E2 with the goodbye).
   *   level 3: the feeling shows; pick WHAT HELPS (cold: blanket, hot: fan, sad: the apple).
   *   E4 (level 3): the child asks [How do you feel?] first (speaking), then what helps.
   * Levels 1-2, not happy: one more thing (the feeling's help, in the scene), then it ends happy.
   */
  P.sendoff = function (data, level, rng, o = {}) {
    const S = data.stages.sendoff;
    const L = clampL(level);
    let variant = o.variant || P.draw(S.mix[L], rng);
    if (variant === "E3") variant = "E2"; // merged (v2 E)
    if (variant === "E4" && o.speak === false) variant = L === 1 ? "E1" : "E2";
    const mode = L >= 3 ? "helps" : variant === "E1" ? "face" : "said";
    const pool = S.faces[L] || S.faces[3];
    let feeling;
    if (mode === "helps") feeling = pick(pool, rng);
    else if (rng() < (S.notHappyChance || 0.25)) feeling = pick(pool.filter((f) => f !== "happy"), rng);
    else feeling = "happy";
    const rows = [];
    const card = [Object.assign(P.line(data, "okay-now"), { id: "feel" })];
    if (variant === "E4") {
      card.unshift(Object.assign(P.line(data, "howfeel"), { id: "ask" }));
      rows.push({ id: "ask", stage: "sendoff", kind: "say-ask", answer: "howfeel", options: ["howfeel", "where", "okay-now"], tested: true, voice: true });
    }
    if (mode === "helps") {
      card.push(Object.assign(P.line(data, "helps"), { id: "help" }));
      rows.push({ id: "help", stage: "sendoff", kind: "help", answer: S.helps[feeling], feeling, options: shuffle(S.helpCards, rng), tested: true, word: (data.items[S.helps[feeling]] || {}).english || S.helps[feeling] });
    } else {
      rows.push({ id: "feel", stage: "sendoff", kind: "face", answer: feeling, options: shuffle(S.cards, rng), tested: mode !== "face", taught: mode === "face", word: feeling });
    }
    let goodbye = null;
    if (L >= (S.goodbyeFrom || 2)) {
      goodbye = pick(Object.keys(data.goodbyes), rng);
      const g = data.goodbyes[goodbye];
      card.push({ id: "bye", kutchi: `[${g.cue.english}]`, english: g.cue.english });
      rows.push({ id: "bye", stage: "sendoff", kind: "say-bye", answer: goodbye, options: Object.keys(data.goodbyes), tested: true, voice: true });
    }
    const main = rows.find((r) => r.id === "feel" || r.id === "help");
    return { stage: "sendoff", variant, mode, level: L, feeling, faces: main.kind === "face" ? main.options : S.cards.slice(), helps: main.kind === "help" ? main.options : null, extra: S.helps[feeling] || null, goodbye, rows, card, line: data.feelings[feeling].line };
  };
  P.judgeFace = (row, face) => row.answer === face;

  /* ================= one patient, a morning ================= */
  /**
   * One patient's plan. o.levels {stage: 1-3}; o.variants {stage: id};
   * o.ailment forces the ailment; o.games = the registered healing games
   * (null = every game in the data); o.first = the first-ever session.
   */
  P.patient = function (data, o = {}) {
    const rng = o.rng || Math.random;
    const lv = Object.assign({ waiting: 1, diagnosis: 1, pharmacy: 1, heal: 1, sendoff: 1 }, o.levels || {});
    const va = o.variants || {};
    const games = o.games || null;
    const waiting = P.waiting(data, lv.waiting, rng, { variant: va.waiting, first: o.first, speak: o.speak, bench: o.bench });
    let ailment = o.ailment;
    let part = null;
    if (!ailment) {
      // the sore PART first (uniform over the parts some ailment can be on), then an ailment for it,
      // so no part is likelier than the others (a blind "tap the knee" gets no edge)
      let avail = P.ailmentsFor(data, Math.max(lv.diagnosis, lv.heal), games).filter((a) => !(o.avoidGames || []).includes(data.ailments[a].game));
      if (!avail.length) avail = P.ailmentsFor(data, 3, games);
      const parts = data.parts[lv.diagnosis] || data.parts[3];
      const byPart = {};
      avail.forEach((a) => data.ailments[a].parts.forEach((pt) => parts.includes(pt) && (byPart[pt] = (byPart[pt] || []).concat(a))));
      part = pick(Object.keys(byPart), rng) || null;
      ailment = part ? pick(byPart[part], rng) : pick(avail, rng) || "scrape";
    }
    const diagnosis = P.diagnosis(data, lv.diagnosis, rng, { variant: va.diagnosis, ailment, part, first: o.first, games });
    const pharmacy = P.pharmacy(data, lv.pharmacy, rng, { ailment, first: o.first, asks: o.asks });
    const heal = P.heal(data, lv.heal, rng, { ailment, side: diagnosis.side, part: diagnosis.part, tray: pharmacy.tray });
    const sendoff = P.sendoff(data, lv.sendoff, rng, { variant: va.sendoff, speak: o.speak, scared: heal.game === "boing" });
    const kind = waiting.patient.kind;
    return {
      kind,
      colour: waiting.patient.colour || null,
      size: waiting.patient.size || null,
      levels: lv,
      level: Math.min(lv.waiting, lv.diagnosis, lv.pharmacy, lv.heal, lv.sendoff),
      ailment,
      game: heal.game,
      stages: { waiting, diagnosis, pharmacy, heal, sendoff },
      first: !!o.first,
    };
  };
  /** The morning's entry for a session (1-based; the last entry repeats). */
  P.dayEntry = (data, session) => data.days.mix[Math.min(data.days.mix.length, Math.max(1, session | 0 || 1)) - 1];
  /**
   * A clinic morning (P8): the session's number of patients, never the same
   * healing game twice, the levels per stage (stored, or the entry's).
   */
  P.morning = function (data, o = {}) {
    const rng = o.rng || Math.random;
    const entry = P.dayEntry(data, o.session || 1);
    const games = o.games || null;
    const n = o.patients || entry.patients || 3;
    const used = [];
    const patients = [];
    for (let i = 0; i < n; i++) {
      const levels = Object.assign({}, o.levels || {}, entry.levels || {});
      let ailment = entry.ailments && entry.ailments[i];
      if (ailment && games && !games.includes(data.ailments[ailment].game)) ailment = null;
      let pool = entry.games ? entry.games.filter((g) => !games || games.includes(g)) : games;
      if (pool && !pool.filter((g) => !used.includes(g)).length) pool = null;
      const avoid = used.slice();
      const p = P.patient(data, {
        rng,
        levels,
        variants: Object.assign({}, entry.variants || {}),
        ailment: ailment || null,
        games: pool ? pool.filter((g) => !used.includes(g)) : games,
        avoidGames: avoid,
        first: !!entry.first && i === 0,
        speak: o.speak,
        asks: entry.asks,
        bench: entry.bench,
      });
      used.push(p.game);
      patients.push(p);
    }
    return { session: o.session || 1, entry, patients };
  };
  /**
   * After a morning: a stage whose tested rows were all right goes up one
   * level (max 3; the waiting room's ladder max 5). results = [{stage: [{ok, tested}]}] per patient.
   */
  P.MAX_LEVEL = { waiting: 5 }; // the waiting room's language ladder has five rungs (W4); the rest stop at 3
  P.levelUp = function (levels, results) {
    const out = Object.assign({}, levels);
    STAGES.forEach((s) => {
      const rows = [];
      results.forEach((r) => (r[s] || []).forEach((x) => x.tested !== false && rows.push(x)));
      if (rows.length && rows.every((x) => x.ok)) out[s] = Math.min(P.MAX_LEVEL[s] || 3, (out[s] || 1) + 1);
    });
    return out;
  };
  /** The words a patient's round reviews (page 2 of the end-of-round screen). */
  P.words = function (data, plan, healWords) {
    const w = [];
    const seen = new Set();
    const add = (x) => {
      if (!x) return;
      const key = (x.kutchi || "") + "|" + (x.english || "");
      if (seen.has(key)) return;
      seen.add(key);
      w.push({ kutchi: x.kutchi || null, english: x.english || "", placeholder: !x.kutchi });
    };
    const k = data.kinds[plan.kind];
    add({ kutchi: null, english: k ? k.english.replace(/^the /, "") : plan.kind });
    add({ kutchi: null, english: data.part_words[plan.stages.diagnosis.part] || plan.stages.diagnosis.part });
    plan.stages.pharmacy.words.forEach((x) => add(x.word));
    (healWords || []).slice(0, 6).forEach(add);
    const f = data.feelings[plan.stages.sendoff.feeling];
    add({ kutchi: null, english: f ? f.english : plan.stages.sendoff.feeling });
    if (plan.stages.sendoff.goodbye) {
      const g = data.goodbyes[plan.stages.sendoff.goodbye];
      add({ kutchi: g.kutchi, english: g.english });
    }
    return w;
  };

  /* ================= the blind bots (Node: build/leak_clinic.mjs) ================= */
  /**
   * Play one stage of a plan with a strategy that never hears the words.
   * Returns {right, total, win} over the tested rows (taught rows don't count).
   */
  P.bot = {};
  const score = (rows) => {
    const t = rows.filter((r) => r.tested !== false);
    const right = t.filter((r) => r.ok).length;
    return { right, total: t.length, win: t.length > 0 && right === t.length, taught: t.length === 0 };
  };
  P.bot.waiting = function (plan, strategy, rng) {
    const rows = plan.rows.map((r, i) => {
      let tap;
      if (strategy === "fair") tap = r.answer;
      else if (strategy === "first-seat") tap = i;
      else if (strategy === "middle") tap = Math.floor(plan.bench.length / 2);
      else if (strategy === "biggest") tap = Math.max(0, plan.bench.findIndex((b) => b.size === "big" || ["old-man", "uncle"].includes(b.kind)));
      else tap = Math.floor(rng() * plan.bench.length);
      return { ok: P.judgeWho(r, tap), tested: r.tested };
    });
    return score(rows);
  };
  P.bot.diagnosis = function (plan, strategy, rng) {
    if (plan.variant === "D1" && !plan.graded) return score([]);
    if (plan.variant === "D1") {
      // the child probes in some order; each probe needs the right act
      const order = strategy === "fair" ? plan.probes.slice() : shuffle(plan.probes, rng);
      const acts = [];
      for (const p of order) {
        let act;
        if (strategy === "fair") act = P.probeAnswer(plan, p) === "haa" ? "found" : "next";
        else if (strategy === "found-always") act = "found";
        else if (strategy === "next-then-found") act = acts.length >= plan.probes.length - 1 ? "found" : "next";
        else act = rng() < 0.5 ? "found" : "next";
        const ok = P.judgeProbe(plan, p, act);
        acts.push(ok);
        if (act === "found") break;
      }
      return score([{ ok: acts.every(Boolean) && acts.length > 0, tested: true }]);
    }
    if (plan.variant === "D2") {
      const r = plan.rows[0];
      let tap;
      const opts = r.options;
      if (strategy === "fair") tap = { part: r.answer.part, side: r.answer.side };
      else if (strategy === "salient") tap = { part: opts.includes("tummy") ? "tummy" : opts[0], side: "left" };
      else tap = { part: pick(opts, rng), side: rng() < 0.5 ? "left" : "right" };
      return score([{ ok: P.judgePart(r, tap), tested: true }]);
    }
    if (plan.variant === "D3") {
      const partPool = plan.calls.map((c) => c.part).concat(["knee", "hand", "head", "tummy", "ear"]);
      const rows = plan.rows.map((r) => {
        if (strategy === "fair") return { ok: true, tested: true };
        const tool = pick(r.options, rng);
        const tap = strategy === "sore-only" ? { part: plan.part, side: plan.side } : { part: pick(partPool, rng), side: rng() < 0.5 ? "left" : "right" };
        return { ok: P.judgeCheck(r, tool, tap), tested: true };
      });
      return score(rows);
    }
    return score([]);
  };
  P.bot.pharmacy = function (plan, strategy, rng) {
    const st = P.beltState(plan);
    const loop = plan.loop;
    let t = Math.floor(rng() * loop.length); // where the loop is when the belt starts
    const next = () => loop[t++ % loop.length];
    let guard = 0;
    if (strategy === "fair") {
      plan.asked.forEach((a) => {
        for (let c = 0; c < (a.count || 1); c++) P.beltGrab(plan, st, { id: a.id, colour: a.colour || null });
      });
    } else if (strategy === "grab-all") {
      while (!P.beltFull(st) && guard++ < 200) P.beltGrab(plan, st, next());
    } else if (strategy === "first-past") {
      // taps the first item that passes, then the next, ...: the same as grab-all on a loop entered at random
      while (!P.beltFull(st) && guard++ < 200) {
        next();
        P.beltGrab(plan, st, next());
      }
    } else if (strategy === "same-group") {
      // a reader of pictures: taps anything from a group it has seen asked before (it can't know which), i.e. random
      const pool = shuffle(loop, rng);
      pool.forEach((it) => !P.beltFull(st) && P.beltGrab(plan, st, it));
    } else {
      while (!P.beltFull(st) && guard++ < 200) P.beltGrab(plan, st, pick(loop, rng));
    }
    P.beltHandover(plan, st);
    return score(P.beltRows(plan, st).map((r) => ({ ok: r.ok, tested: r.row.tested })));
  };
  P.bot.sendoff = function (plan, strategy, rng) {
    const rows = plan.rows.map((r) => {
      if (strategy === "fair") return { ok: true, tested: r.tested };
      let pickV;
      if (strategy === "same-face") pickV = r.kind === "face" ? "happy" : r.options[0];
      else if (strategy === "first-card") pickV = r.options[0];
      else pickV = pick(r.options, rng);
      return { ok: pickV === r.answer, tested: r.tested };
    });
    return score(rows);
  };
  P.bot.STRATEGIES = {
    waiting: ["fair", "random", "first-seat", "middle", "biggest"],
    diagnosis: ["fair", "random", "salient", "found-always", "next-then-found", "sore-only"],
    pharmacy: ["fair", "random", "grab-all", "first-past", "same-group"],
    sendoff: ["fair", "random", "same-face", "first-card"],
  };
  /**
   * The whole patient, blind: every stage's rows plus the heal game's bot
   * (Heal.botRun). Heal = null skips the heal stage (reported separately).
   */
  P.bot.patient = function (plan, strategy, rng, Heal) {
    const out = {};
    let win = true;
    let right = 0;
    let total = 0;
    ["waiting", "diagnosis", "pharmacy", "sendoff"].forEach((s) => {
      const strat = strategy === "fair" ? "fair" : "random";
      const r = P.bot[s](plan.stages[s], strat, rng);
      out[s] = r;
      right += r.right;
      total += r.total;
      if (!r.taught && !r.win) win = false;
    });
    if (Heal && Heal.has(plan.game)) {
      const r = Heal.botRun(plan.game, plan.stages.heal.level, strategy === "fair" ? "fair" : "random", rng);
      out.heal = r;
      right += r.right;
      total += r.total;
      if (r.total > 0 && !r.win) win = false;
    }
    return { right, total, win, stages: out };
  };

  return P;
});
