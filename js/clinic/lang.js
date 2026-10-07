/*
 * The clinic's words and lines, through the language engine (step 4e, decision 42; rules G26, G27). The engine
 * (js/core/lang/engine/ over data/lang/) is the only source: every word, number, describing word, frame and line the
 * clinic shows or plays is an engine meaning, built and agreed by the engine, with the engine's clip plan for the
 * voice (stitched from words, decision 26). This file holds no Kutchi, no word table, no frame and no agreement: it
 * names meanings by concept id (a.big, num value, the clinic's old ids as the engine's aliases) and turns the
 * engine's result into the clinic's display word. What the engine can't say comes back as its own gap: the
 * grey-italic English placeholder, flagged to record (G2, G9).
 *
 *   await ClinicLang.ready(loadJSON)      the browser: load the engine and its data once (Clinic.HealHost.loadBase)
 *   ClinicLang.say(meaning) -> Result     the engine's result (a Join is several results one after the other)
 *   ClinicLang.show(meaning | Result, {cap, lower, row}) -> {kutchi, english, placeholder, ids, plan, check}
 *   ClinicLang.w(id) .num(n) .line(key, vars, {pool}) display words: a word, a number word, a clinic line by key
 *   ClinicLang.first(x) .then(x) .also(x) .item(id, {n, size, mods}) .count(n) .join([...]) .step(i, x)
 *                                         meaning builders (x: a word id, a meaning, or a list of them)
 *   ClinicLang.lex(id)                    the engine id of a clinic id (its alias), or null
 *
 * THE ONE ADAPTER LEFT (marked, step 4e): `Join`. A heal game's card row such as "ne poi thread: pela wadho, ba"
 * is several engine-built pieces placed one after the other with a punctuation mark between them; the engine has
 * no rule for these rows yet (data/lang/reports/gap-list.md, the clinic's frames). Every piece is the engine's own
 * output (its words, forms, gaps and clips); the join adds only the order and the mark. Callers: the heal games'
 * rows (cut, knee, ear, eye, boing, taste, foot) and the parked games (tummy, hic, hair).
 *
 * Plain <script> (window.ClinicLang, Clinic.Lang) and Node require() (Node reads data/lang/ from the repo).
 */
(function (root, factory) {
  const L = factory();
  if (typeof module === "object" && module.exports) module.exports = L;
  else {
    root.ClinicLang = L;
    (root.Clinic = root.Clinic || {}).Lang = L;
  }
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const DATA_FILES = ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"];
  const E = { engine: null, gapLog: [], ctx: {} };

  /** Hand the clinic an engine (the browser after ready(), a test with its own data). */
  E.use = (engine) => (E.engine = engine || null);
  /** The browser: load the engine module and data/lang/ once. loadJSON(path) is the kit's (stamped URLs). */
  // (it resolves to true, never to E: E has a `then` builder, so awaiting E would wait for ever)
  E.ready = async function (loadJSON, root = "") {
    if (E.engine) return true;
    if (!E.loading)
      E.loading = (async () => {
        // through the core's seam (the import map stamps it); a page without the map loads the engine by path
        let mod;
        try {
          mod = await import("#core/lang/index.js");
        } catch (e) {
          // (a classic script's import() resolves against the script's own URL: make it the page's)
          const base = typeof document !== "undefined" ? document.baseURI : "";
          mod = await import(new URL(`${root}js/core/lang/engine/index.js`, base).href);
        }
        const data = {};
        // CLN-88 (S02-A): the language files at once, not one after another
        const [audioRaw] = await Promise.all([loadJSON("data/family-audio.json"), ...DATA_FILES.map(async (f) => (data[f] = await loadJSON(`data/lang/${f}.json`)))]);
        const audio = audioRaw || [];
        E.engine = mod.createEngine({ data, audio });
      })();
    await E.loading;
    return true;
  };
  const EN = () => {
    if (!E.engine) throw new Error("ClinicLang: no engine yet (await ClinicLang.ready first)");
    return E.engine;
  };

  /* ---------------- ids ---------------- */
  // the clinic's ids are the engine's aliases (build/lang/import_clinic.mjs): a word by its own id, a tray item as
  // clinic.item.<id>, a line as clinic.line.<key>, the pipeline's words as clinic.pipeline.<kind>.<key>
  const PREFIX = ["", "clinic.item.", "clinic.line.", "clinic.line.pipeline.", "col-"]; // col-: a colour by its plain name
  E.lex = function (id, prefixes = PREFIX) {
    if (id == null) return null;
    const lx = EN().linearizer;
    for (const p of prefixes) {
      const e = lx.lexOf(p + id);
      if (e) return e.id;
    }
    return null;
  };
  /** A number's word id (the engine finds a number word by its value). */
  E.numId = function (n) {
    const c = EN().linearizer.classify(Number(n), { type: "Num" }, {});
    return c.missingValue != null ? null : c.id;
  };
  // the clinic's sizes, sides, yes and no are concepts; the engine holds their words
  const CONCEPT = { big: "a.big", small: "a.small", left: "a.left", right: "a.right" };
  E.sizeId = (size) => CONCEPT[size] || null;
  E.sideId = (side) => CONCEPT[side] || null;
  E.yesId = () => "phrase.yes";
  E.noId = () => "neg.not";

  /* ---------------- meanings ---------------- */
  const PUNCT = { ",": 1, ".": 1, ":": 1, ";": 1, "!": 1, "?": 1 };
  const asM = (x) => (x == null ? x : typeof x === "string" ? (PUNCT[x] ? { fn: "Punct", t: x } : { fn: "Item", kind: x }) : typeof x === "number" ? { fn: "Count", n: x } : Array.isArray(x) ? { fn: "Join", parts: x.map(asM) } : x);
  const idOf = (id) => E.lex(id) || id;
  E.item = (kind, o = {}) => ({ fn: "Item", kind, n: o.n, mods: o.size ? [E.sizeId(o.size)].filter(Boolean) : o.mods });
  E.count = (n) => ({ fn: "Count", n });
  E.first = (x, o = {}) => ({ fn: "First", x: asM(x), lower: !!o.lower });
  E.then = (x, o = {}) => ({ fn: "Then", x: asM(x), lower: !!o.lower });
  E.also = (x, o = {}) => ({ fn: "And", x: asM(x), lower: o.lower !== false });
  E.p = (t) => ({ fn: "Punct", t });
  E.join = (parts, sep) => ({ fn: "Join", parts: parts.map(asM), sep });
  E.word = (id) => ({ fn: "Word", id });
  /** The step joins of an ordered list: the first "first x", the rest "and then x" (lower: inside a row). */
  E.step = (i, x, o) => (i === 0 ? E.first(x, o) : E.then(x, o));
  /** A whole line said on its own: a phrase entry (Say, or Exclaim / Ask by its own mark). */
  E.phrase = (id) => {
    const lx = idOf(id);
    const e = EN().linearizer.lexOf(lx);
    const g = String((e && e.gloss) || "");
    return { fn: /!\s*$/.test(g) ? "Exclaim" : /\?\s*$/.test(g) ? "Ask" : "Say", x: lx };
  };

  /** A clinic meaning -> the engine's meaning (ids to engine ids; lists of words inside a frame to the frame's list). */
  function toEngine(m) {
    if (typeof m === "string") return { fn: "Item", kind: idOf(m) };
    const out = {};
    for (const k of Object.keys(m)) {
      if (k === "lower" || k === "sep") continue;
      const v = m[k];
      if (k === "fn") out.fn = v;
      else if (k === "kind" || k === "id") out[k] = idOf(v);
      else if (k === "mods") out.mods = v ? v.filter(Boolean).map(idOf) : v;
      else if (Array.isArray(v)) out[k] = v.map((x) => (typeof x === "object" ? toEngine(x) : idOf(x)));
      else if (v && typeof v === "object") out[k] = engineArg(v);
      else out[k] = typeof v === "string" ? idOf(v) : v;
    }
    return out;
  }
  // a frame's argument: a plain word is the word itself; a Join of words (a colour and a noun, "laal ne lilo plaster")
  // is said piece by piece inside the frame, so it stays a Join and the frame is built around it (see say)
  const engineArg = (v) => (v.fn === "Join" ? v : v.fn === "Item" && !v.n && !(v.mods && v.mods.length) ? idOf(v.kind) : toEngine(v));

  /* ---------------- results ---------------- */
  const empty = () => ({ ok: true, text: "", en: "", tokens: [], segments: [], clipPlan: [], drafts: [], gaps: [] });
  /** append result b to result a (a space between, none before a mark) */
  function concat(a, b, { space = true } = {}) {
    if (!b.segments.length) return a;
    const off = a.tokens.length;
    const segOff = a.segments.length + (a.segments.length && space ? 1 : 0);
    if (a.segments.length && space) a.segments.push({ t: " ", lang: null });
    a.segments.push(...b.segments.map((s) => Object.assign({}, s)));
    a.tokens.push(...b.tokens);
    a.clipPlan.push(...(b.clipPlan || []).map((c) => Object.assign({}, c, { tokens: c.tokens && c.tokens.map((t) => t + off), segs: c.segs && c.segs.map((t) => (t == null || t < 0 ? t : t + segOff)) })));
    a.drafts.push(...(b.drafts || []));
    a.gaps.push(...(b.gaps || []));
    a.ok = a.ok && b.ok;
    a.text += (a.text && space ? " " : "") + b.text;
    a.en += (a.en && space ? " " : "") + (b.en || "");
    return a;
  }
  /** insert result b into a after token ti / segment si (a space before it), shifting a's clip plan */
  function splice(a, b, ti, si) {
    const nb = b.tokens.length;
    const segs = [{ t: " ", lang: null }].concat(b.segments.map((x) => Object.assign({}, x)));
    const ns = segs.length;
    const shift = (c) => Object.assign({}, c, { tokens: c.tokens && c.tokens.map((t) => (t >= ti ? t + nb : t)), segs: c.segs && c.segs.map((t) => (t != null && t >= si ? t + ns : t)) });
    const plan = a.clipPlan.map(shift);
    const ins = (b.clipPlan || []).map((c) => Object.assign({}, c, { tokens: c.tokens && c.tokens.map((t) => t + ti), segs: c.segs && c.segs.map((t) => (t == null || t < 0 ? t : t + si + 1)) }));
    const at = plan.findIndex((c) => c.tokens && c.tokens[0] >= ti + nb);
    plan.splice(at < 0 ? plan.length : at, 0, ...ins);
    a.tokens.splice(ti, 0, ...b.tokens);
    a.segments.splice(si, 0, ...segs);
    a.clipPlan = plan;
    a.gaps.push(...(b.gaps || []));
    a.drafts.push(...(b.drafts || []));
    a.ok = a.ok && b.ok;
    a.text = a.segments.map((x) => x.t).join("");
    a.en += b.en ? " " + b.en : "";
    return a;
  }
  /** a sentence result as a row piece: no capital, no final mark (F10: card rows), unless asked */
  function rowOf(r, { lower }) {
    const segs = r.segments.slice();
    while (segs.length && segs[segs.length - 1].lang == null && /^[.!?]$/.test(segs[segs.length - 1].t)) segs.pop();
    if (lower) {
      const i = segs.findIndex((s) => s.lang);
      if (i >= 0) segs[i] = Object.assign({}, segs[i], { t: segs[i].t.charAt(0).toLowerCase() + segs[i].t.slice(1) });
    }
    const text = segs.map((s) => s.t).join("");
    const en = String(r.en || "").replace(/[.!?]+$/, "");
    return Object.assign({}, r, { segments: segs, text, en: lower ? en.charAt(0).toLowerCase() + en.slice(1) : en });
  }
  /** one word in its default form (a number, an id), as a result */
  function wordResult(id) {
    const r = EN().word(id, null, E.ctx);
    const e = EN().linearizer.lexOf(id);
    return Object.assign({}, r, { en: (e && e.gloss) || String(id), segments: r.segments.map((s) => Object.assign({}, s)) });
  }

  /** Every line: the engine's result for a meaning (Join: the pieces one after the other). */
  E.say = function (m0) {
    const m = asM(m0);
    let r;
    switch (m.fn) {
      case "Punct":
        r = Object.assign(empty(), { text: m.t, en: m.t, segments: [{ t: m.t, lang: null }], punct: true });
        break;
      case "Count": {
        const id = E.numId(m.n);
        r = id ? wordResult(id) : Object.assign(empty(), { ok: false, text: String(m.n), en: String(m.n), segments: [{ t: String(m.n), lang: "e", gap: "number" }], gaps: [{ kind: "lexeme", what: `no number word for ${m.n}` }] });
        break;
      }
      case "Word":
        r = wordResult(idOf(m.id));
        break;
      case "Join": {
        r = empty();
        for (const p of m.parts) {
          const pr = E.say(p);
          concat(r, pr, { space: !pr.punct });
        }
        break;
      }
      default: {
        // a frame round a Join of words ("ne poi" + "laal ne lilo plaster"): the frame with its first word, then the
        // rest of the Join after it (the engine has no rule for a list in these frames: gap list)
        const x = m.x && m.x.fn === "Join" ? m.x : null;
        if (x && x.parts.length) {
          const [head, ...rest] = x.parts;
          r = E.say(Object.assign({}, m, { x: head }));
          for (const p of rest) {
            const pr = E.say(p);
            concat(r, pr, { space: !pr.punct });
          }
          break;
        }
        // a frame round a describing word or a number said on its own ("pela wadho"): the engine's frame word, then
        // the engine's own word (its frames take a noun phrase; a lone describing word has no noun to agree with)
        const bare = m.x && m.x.fn === "Item" && !(m.x.mods && m.x.mods.length) ? EN().linearizer.lexOf(idOf(m.x.kind)) : null;
        if (bare && !["N", "PN", "Phrase"].includes(bare.pos) && ["First", "Then", "And"].includes(m.fn)) {
          r = rowOf(EN().say({ fn: m.fn }, E.ctx), { lower: !!m.lower });
          concat(r, E.say(m.x));
          break;
        }
        // a line's slot filled by a joined description ("chokri [in green]"): the line with the description's head in
        // the slot, and the rest of the description placed right after the head's word
        const jk = Object.keys(m).find((k) => k !== "x" && m[k] && typeof m[k] === "object" && m[k].fn === "Join");
        if (jk) {
          const [head, ...rest] = m[jk].parts;
          r = E.say(Object.assign({}, m, { [jk]: head }));
          const hid = head && head.fn === "Item" ? idOf(head.kind) : typeof head === "string" ? idOf(head) : null;
          let ti = -1;
          r.tokens.forEach((t, i) => t.lex === hid && (ti = i));
          let si = -1;
          r.segments.forEach((sg, i) => sg.w === hid && (si = i));
          const add = E.say({ fn: "Join", parts: rest });
          if (ti < 0 || si < 0) concat(r, add);
          else splice(r, add, ti + 1, si + 1);
          break;
        }
        const em = toEngine(m);
        if (em.fn === "Item" && !em.n && !(em.mods && em.mods.length)) {
          r = wordResult(em.kind);
          break;
        }
        // a count of a describing word with its noun left out ("ba laal": two red ones): the engine's number word, then
        // the engine's own word (its Item needs a noun to agree with)
        const head = em.fn === "Item" ? EN().linearizer.lexOf(em.kind) : null;
        if (head && !["N", "PN", "Phrase"].includes(head.pos) && em.n != null && !(em.mods && em.mods.length)) {
          r = E.say({ fn: "Count", n: em.n });
          concat(r, wordResult(head.id));
          break;
        }
        r = EN().say(em, E.ctx);
        if (["First", "Then", "And"].includes(m.fn)) r = rowOf(r, { lower: !!m.lower });
      }
    }
    (r.gaps || []).forEach((g) => E.gapLog.push(Object.assign({ meaning: m.fn }, g)));
    return r;
  };

  /** A result (or a meaning) as the clinic's display word: English segments in [brackets] (Kit.text: grey italic). */
  E.show = function (x, o = {}) {
    let r = x && x.segments ? x : E.say(x);
    if (o.row) r = rowOf(r, { lower: !!o.lower });
    const segs = r.segments;
    // a placeholder's gloss may carry a note for grown-ups in brackets ("right (side)"): the card shows the word
    const plain = (t) => String(t).replace(/\s*\([^)]*\)/g, "");
    let out = "";
    let buf = null; // English text being gathered into one [bracket]
    const close = () => {
      if (buf === null) return;
      const lead = buf.match(/^\s*/)[0];
      const tail = buf.match(/\s*$/)[0];
      out += `${lead}[${buf.trim()}]${tail}`;
      buf = null;
    };
    segs.forEach((s, i) => {
      if (s.lang === "e") buf = (buf || "") + plain(s.t);
      else if (!s.lang && buf !== null) {
        const nx = segs.slice(i + 1).find((q) => q.lang);
        if (nx && nx.lang === "e") buf += s.t;
        else {
          close();
          out += s.t;
        }
      } else {
        close();
        out += s.t;
      }
    });
    close();
    const hasK = segs.some((s) => s.lang === "k");
    let kutchi = hasK ? out.replace(/\s+([,.!?:;])/g, "$1") : null;
    // a line with no Kutchi at all shows its placeholder words as the engine built them (the grown-ups' English template
    // joins describing words with commas: "short, old man")
    let en = (hasK ? plain(r.en || "") : plain(segs.map((x) => x.t).join("")).replace(/\s+([,.!?:;])/g, "$1") || plain(r.en || "")).replace(/([.!?])\1+$/, "$1");
    if (o.cap) {
      if (kutchi) kutchi = kutchi.replace(/^(\[?)(\S)/, (a, b, c) => b + c.toUpperCase());
      en = en.charAt(0).toUpperCase() + en.slice(1);
    }
    if (o.lower && kutchi) kutchi = kutchi.replace(/^(\[?)(\S)/, (a, b, c) => b + c.toLowerCase());
    // a new sentence inside a line starts with a capital ("Ne poi [cloth]. Ba [dabs]"): spelling, not grammar
    const caps = (t) => t.replace(/([.!?]\s+)(\[?)([a-z])/g, (a, b, c, d) => b + c + d.toUpperCase());
    if (kutchi) kutchi = caps(kutchi);
    en = caps(en);
    const ids = segs.filter((s) => s.w).map((s) => s.w);
    const check = (r.gaps || []).some((g) => g.kind === "feature") || undefined;
    return { kutchi, english: en, placeholder: !hasK, ids, plan: r.clipPlan || [], check };
  };

  /* ---------------- display words ---------------- */
  E.w = (id, o) => Object.assign(E.show(E.word(id), o), { id });
  E.num = (n, o) => Object.assign(E.show(E.count(n), o), { id: E.numId(n), n });
  /**
   * A parked game's word table ({key: {id?, english, …}}) with every word the engine's (its own id, else the key, as
   * the engine's alias); the non-language fields stay. A word the engine doesn't know stays its placeholder.
   */
  E.words = (map) =>
    Object.fromEntries(
      Object.entries(map || {}).map(([k, v]) => {
        const id = v && v.id && E.lex(v.id) ? v.id : E.lex(k) ? k : null;
        // the table's own capital (a row's first word: "Pela") is spelling, kept
        const w = id ? E.w(id, { cap: !!(v && /^[A-Z]/.test(v.kutchi || "")) }) : { kutchi: null, english: (v && v.english) || k, placeholder: true, plan: [] };
        return [k, Object.assign({}, v, { kutchi: w.kutchi, english: w.english, placeholder: w.placeholder, plan: w.plan, audio: undefined })];
      })
    );
  /** A parked game's numbers list ([{n, …}]) with each number word the engine's (capitalised, as the lists had them). */
  E.numbers = (list) => (list || []).map((x) => Object.assign({}, x, (({ kutchi, english, plan }) => ({ kutchi: kutchi || x.kutchi, english, plan }))(E.num(x.n, { cap: true }))));
  /** A display word for a size + noun ("wadho [wax]"): the describing word agrees with the noun (he-form if unknown). */
  E.sized = (size, noun, o) => E.show(E.item(noun, { size }), o);

  /**
   * A clinic line by its key (data/clinic.json lines, a heal game's lines, data/clinic/pipeline.json lines). A line with
   * no slot is the engine's phrase entry for it (clinic.line.<key>); a line with slots names its engine meaning in its
   * data (`fn`), and vars fill the slots (each a word id, a meaning, or a display word that carries its meaning `m`).
   *   line(key, vars, {def: the line's data object, pipeline: true})
   */
  E.line = function (key, vars = {}, o = {}) {
    const def = o.def || {};
    const fn = def.fn;
    const slot = (v) => (v && typeof v === "object" && !v.fn ? v.m || v.id : v);
    let m;
    if (def.meaning) {
      // a template naming an engine meaning, its slots as "$name" ({"fn": "Need", "who": "p1", "thing": "$a"})
      const fill = (t) => (typeof t === "string" && t.startsWith("$") ? slot(vars[t.slice(1)]) : Array.isArray(t) ? t.map(fill) : t && typeof t === "object" ? Object.fromEntries(Object.entries(t).map(([k, x]) => [k, fill(x)])) : t);
      m = fill(def.meaning);
    } else if (fn) {
      m = { fn };
      for (const [k, v] of Object.entries(vars)) m[k] = slot(v);
    } else if (def.lex) {
      m = E.phrase(def.lex);
    } else {
      const id = E.lex(key, o.pipeline ? ["clinic.line.pipeline.", "clinic.line."] : ["clinic.line.", "clinic.line.pipeline.", ""]);
      m = id ? E.phrase(id) : null;
    }
    // a line the engine doesn't hold yet (S02-C's new lines, to record: data/lang is the engine's, imported later)
    // shows its English meaning from the clinic's data as the grey "to record" placeholder, never its id
    if (!m) return { kutchi: null, english: String(def.english || def.e || key), placeholder: true, plan: [], key, rec: true, who: def.who };
    const w = E.show(m, o);
    return Object.assign(w, { key, m, who: def.who, audio: def.audio });
  };
  return E;
});

// Node (the leak bots, the unit tests): the engine over the repo's data/lang/, so a plan reads the same words as the game
if (typeof module === "object" && module.exports && typeof require === "function" && typeof __dirname === "string") {
  try {
    const fs = require("fs");
    const path = require("path");
    const rootDir = path.join(__dirname, "..", "..");
    const read = (p) => JSON.parse(fs.readFileSync(path.join(rootDir, p), "utf8"));
    const { createEngine } = require(path.join(rootDir, "js", "core", "lang", "engine", "index.js"));
    const data = {};
    for (const f of ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"]) data[f] = read(`data/lang/${f}.json`);
    module.exports.use(createEngine({ data, audio: read("data/family-audio.json"), path: "test", phrases: false }));
  } catch (e) {
    /* no engine: say() throws, as in a page that hasn't loaded it */
  }
}
