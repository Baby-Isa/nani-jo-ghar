/*
 * The clinic's words and sentences, through the language seam (target-model § 3.1; gap-analysis "R5: the clinic's
 * Kutchi through the seam"). No Kutchi, no number table, no join and no word form is written in the clinic's code:
 * every word comes from data/clinic/lang.json (and the clinic's item data) by id, every frame (pela / ne poi / ne)
 * is a line in that file, and a describing word or "one" takes its form from the noun's gender there (unknown
 * gender: the he-form, flagged "to check", decision 21). What has no Kutchi comes back as a gap: the grey-italic
 * English placeholder, flagged to record (G2).
 *
 * Two halves:
 *   1. A PROTO-ENGINE with the calls js/core/lang/index.js's adapter makes of Cook's (phrase, line, wordLine,
 *      numLine, list, join, plain, bare, gender, countParts), over the clinic's data. In the game the clinic's
 *      core Lang is createLang({cook: ClinicLang.source}) (js/clinic/main.js) and every line goes through it.
 *   2. say(meaning) with the seam's meanings ({fn: "Item" | "Word" | "Count" | "First" | "Then" | "Also" |
 *      "Join" | "Phrase"}): through the core's Lang once main.js has handed it over (ClinicLang.use), else the
 *      same build locally (Node: the leak bots and unit tests). show() turns a result into the clinic's display
 *      word {kutchi, english, placeholder, ids}: English segments in [brackets], which Kit.text draws grey italic.
 *
 *   ClinicLang.load(json)                 the data (Clinic.Run.load and the Node tests)
 *   ClinicLang.resolve = (id) => entry    extra words by id (the clinic's items), set by the kit
 *   ClinicLang.say(meaning) -> Result     ClinicLang.show(meaning | Result, {cap, lower}) -> display word
 *   ClinicLang.w(id) ClinicLang.num(n)    one word, a number word (display words)
 *   ClinicLang.first(x) .then(x) .also(x) .join([...]) .item(id, {n, size, noun}) .count(n) .side(s) .yes() .no()
 *                                         meaning builders (x: a word id, a meaning, or a list of them)
 *
 * Plain <script> (window.ClinicLang, Clinic.Lang) and Node require().
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
  const E = { data: { words: {}, lines: {}, grammar: {} }, resolve: null, seam: null, gapLog: [] };
  const G = () => E.data.grammar || {};

  E.load = function (json) {
    E.data = { words: Object.assign({}, (json && json.words) || {}), lines: Object.assign({}, (json && json.lines) || {}), grammar: Object.assign({}, (json && json.grammar) || {}) };
    return E;
  };

  /** A word's entry: the lexicon, then the clinic's items (E.resolve), else an English placeholder named by its id. */
  const entry = (id) => E.data.words[id] || (E.resolve && E.resolve(id)) || null;
  const english = (id) => {
    const w = entry(id);
    return (w && (w.english || w.e)) || String(id).replace(/^cl-/, "").replace(/-/g, " ");
  };
  const isPlaceholder = (id) => {
    const w = entry(id);
    return !(w && (w.kutchi || w.k));
  };
  const display = (id) => {
    const w = entry(id);
    return (w && (w.kutchi || w.k)) || english(id);
  };

  /* ---------------- 1. the proto-engine (the adapter's calls) ---------------- */
  const Lang = {};
  Lang.gender = (id) => {
    const g = (entry(id) || {}).gender;
    return g === "he" || g === "she" ? g : null;
  };
  Lang.hasForms = (id) => !!(id && (entry(id) || {}).forms);
  Lang.form = (id, gender) => {
    const w = entry(id) || {};
    return (w.forms && w.forms[gender || "he"]) || display(id);
  };
  Lang.word = (id, gender) => [{ t: Lang.form(id, gender), lang: isPlaceholder(id) ? "e" : "k", w: id }];
  Lang.numId = (n) => (G().numbers || {})[n] || null;
  Lang.num = (n, gender) => {
    const id = Lang.numId(n);
    return id ? Lang.word(id, gender) : [{ t: String(n), lang: "e" }];
  };
  Lang.countParts = (n, id, { one = true } = {}) => {
    if (n == null || (n === 1 && !one)) return [id];
    const t = G().count || "{n} {x}";
    return t.indexOf("{x}") < t.indexOf("{n}") ? [id, n] : [n, id];
  };
  /** parts: word ids and numbers; a number or describing word agrees with the next noun that has a gender field. */
  Lang.phrase = (parts) => {
    const segs = [];
    const en = [];
    const sep = G().sep != null ? G().sep : " ";
    const nounAfter = (i) => {
      for (let j = i + 1; j < parts.length; j++) if (typeof parts[j] === "string" && entry(parts[j]) && "gender" in entry(parts[j])) return parts[j];
      for (let j = i + 1; j < parts.length; j++) if (typeof parts[j] === "string") return parts[j];
      return null;
    };
    parts.forEach((p, i) => {
      if (i) segs.push({ t: sep, lang: null });
      const noun = nounAfter(i);
      const g = Lang.gender(noun);
      const add = typeof p === "number" ? Lang.num(p, g) : Lang.word(p, g);
      // decision 21: a form agreeing with a noun of unconfirmed gender is the he-form, flagged "to check"
      if (noun && !g && add.some((x) => Lang.hasForms(x.w))) add.forEach((x) => Lang.hasForms(x.w) && (x.check = noun));
      segs.push(...add);
      en.push(typeof p === "number" ? String(p) : english(p));
    });
    return { segs, en: en.join(" ") };
  };
  Lang.line = (key, phrase) => {
    const f = E.data.lines[key];
    if (!f && entry(key)) return Object.assign(Lang.wordLine(key), { key });
    if (!f) return { segs: [{ t: key, lang: "e" }], en: key, key };
    const lang = f.k ? "k" : "e";
    const [a, b] = (f.k || f.e).split("{x}");
    const segs = [];
    if (a) segs.push({ t: a, lang });
    if (phrase && b !== undefined) segs.push(...phrase.segs);
    if (b) segs.push({ t: b, lang });
    const enT = f.en || f.e;
    return { segs, en: phrase ? enT.replace("{x}", phrase.en) : enT, key };
  };
  Lang.wordLine = (id) => ({ segs: Lang.word(id), en: english(id) });
  const wrap = (tmpl, segs, en, lang) => {
    const [a, b] = String(tmpl || "{x}").split("{x}");
    const out = [];
    if (a) out.push({ t: a, lang });
    out.push(...segs);
    if (b) out.push({ t: b, lang });
    return { segs: out, en: (a || "") + en + (b || "") };
  };
  Lang.numLine = (n) => wrap(G().number || "{x}!", Lang.num(n), String(n), "k");
  Lang.bare = (phrase) => wrap((G().list || {}).first || "{x}", phrase.segs, phrase.en, "k");
  Lang.join = (lines, sep = " ") => {
    const segs = [];
    let en = "";
    lines.forEach((l, i) => {
      if (i && sep && !l.punct) segs.push({ t: sep, lang: null });
      segs.push(...l.segs);
      en += (i && sep && !l.punct ? sep : "") + l.en;
    });
    return { segs, en, parts: lines };
  };
  Lang.list = (entries, { seq = false } = {}) => {
    const out = [];
    entries.forEach((e, gi) =>
      [].concat(e).forEach((id, j) => {
        const ph = Lang.phrase([id]);
        out.push(!out.length ? (seq ? Lang.line(G().then_first || "first", ph) : Lang.bare(ph)) : Lang.line(seq && j === 0 && gi > 0 ? G().then || "then" : "and", ph));
      })
    );
    return Lang.join(out);
  };
  Lang.plain = (line) => line.segs.map((s) => s.t).join("");
  E.Lang = Lang;
  /** What createLang({cook}) takes: {Lang, Order, data}. */
  E.source = { Lang, Order: null, get data() {
    // the adapter reads words for each segment's status: the lexicon plus the items resolved so far
    return E.data;
  } };

  /* ---------------- 2. meanings ---------------- */
  const ROLE = { First: "first", Then: "then", Also: "and", Times: "times" };
  function itemParts(m) {
    if (typeof m === "string") return [m];
    if (Array.isArray(m)) return m;
    const head = (m.mods || []).concat([m.kind]);
    if (m.n == null) return head;
    return Lang.countParts(m.n, "\u0000", { one: m.one !== false }).flatMap((p) => (p === "\u0000" ? head : [p]));
  }
  function build(m) {
    if (typeof m === "string") return Lang.wordLine(m);
    switch (m.fn) {
      case "Item":
        return Lang.phrase(itemParts(m));
      case "Word":
        return Lang.wordLine(m.id);
      case "Count":
        return m.bare ? { segs: Lang.num(m.n), en: String(m.n) } : Lang.numLine(m.n);
      case "Phrase":
        return Lang.line(m.id);
      case "Punct":
        return { segs: [{ t: m.t, lang: null }], en: m.t, punct: true };
      case "Join":
        return Lang.join(m.parts.map(build), m.sep != null ? m.sep : " ");
      default: {
        const k = ROLE[m.fn];
        if (!k) throw new Error(`ClinicLang: no meaning ${m.fn}`);
        const l = Lang.line(k, m.x != null ? build(m.x) : undefined);
        // inside a row ("pela wadho, ne poi nindho") the frame starts lower case: spelling, not grammar
        if (m.lower && l.segs[0] && l.segs[0].t) l.segs[0] = Object.assign({}, l.segs[0], { t: l.segs[0].t.charAt(0).toLowerCase() + l.segs[0].t.slice(1) });
        if (m.lower) l.en = l.en.charAt(0).toLowerCase() + l.en.slice(1);
        return l;
      }
    }
  }
  /** The local seam: the same Result shape as js/core/lang (ok, text, en, segments, gaps). */
  function localSay(m) {
    const line = build(m);
    const segments = line.segs.map((s) => Object.assign({}, s));
    const gaps = [];
    segments.forEach((s, i) => {
      if (s.lang === "e") gaps.push(s.w ? { kind: "lexeme", lex: s.w, what: s.t, seg: i } : { kind: "rule", what: s.t.trim(), seg: i });
      if (s.check) gaps.push({ kind: "feature", lex: s.check, feature: "gender", defaulted: s.t, seg: i });
    });
    gaps.forEach((g) => E.gapLog.push(Object.assign({ meaning: m && m.fn }, g)));
    return { ok: !gaps.some((g) => g.kind === "rule" || g.kind === "lexeme"), text: Lang.plain(line), en: line.en, segments, gaps, line };
  }
  // what the core adapter builds exactly as here: an Item, a Word, a Phrase, or a frame round one Item
  const simple = (m) => !!m && typeof m === "object" && (["Item", "Word", "Phrase"].includes(m.fn) || (ROLE[m.fn] && (m.x == null || (m.x.fn === "Item" && !m.x.parts))));
  /** Every line: the core's Lang when the game has handed it over (main.js), else the same build here. */
  E.say = function (m) {
    if (E.seam && simple(m)) {
      // the core adapter understands Item, Word, Phrase and the frames; Join and bare counts it builds the same way
      try {
        const r = E.seam.say(m);
        if (r && r.segments && r.segments.length) return r;
      } catch (e) {
        /* fall back to the local build */
      }
    }
    return localSay(m);
  };
  E.use = (lang) => (E.seam = lang || null);

  /** A result (or a meaning) as the clinic's display word: English segments in [brackets] (Kit.text: grey italic). */
  E.show = function (x, o = {}) {
    const r = x && x.segments ? x : E.say(x);
    const segs = r.segments;
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
      if (s.lang === "e") buf = (buf || "") + s.t;
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
    const hasK = r.segments.some((s) => s.lang === "k");
    let kutchi = hasK ? out.replace(/\s+([,.!?])/g, "$1") : null;
    let en = r.en || "";
    if (o.cap) {
      if (kutchi) kutchi = kutchi.replace(/^(\[?)(\S)/, (a, b, c) => b + c.toUpperCase());
      en = en.charAt(0).toUpperCase() + en.slice(1);
    }
    if (o.lower && kutchi) kutchi = kutchi.replace(/^(\[?)(\S)/, (a, b, c) => b + c.toLowerCase());
    // a new sentence inside a line starts with a capital ("Ne poi [cloth]. Ba [dabs]"): spelling, not grammar
    const caps = (t) => t.replace(/([.!?]\s+)(\[?)([a-z])/g, (a, b, c, d) => b + c + d.toUpperCase());
    if (kutchi) kutchi = caps(kutchi);
    en = caps(en);
    const ids = r.segments.filter((s) => s.w).map((s) => s.w);
    return { kutchi, english: en, placeholder: !hasK, ids, check: r.segments.some((s) => s.check) || undefined };
  };

  /* ---------------- builders (so the clinic's code names meanings, never words) ---------------- */
  const asM = (x) => (x == null ? x : typeof x === "string" ? ({ ",": 1, ".": 1, ":": 1, ";": 1, "!": 1 }[x] ? { fn: "Punct", t: x } : { fn: "Item", kind: x }) : Array.isArray(x) ? { fn: "Join", parts: x.map(asM) } : x);
  E.item = (kind, o = {}) => ({ fn: "Item", kind, n: o.n, mods: o.size ? [(G().size || {})[o.size]].filter(Boolean) : o.mods });
  E.count = (n, bare = true) => ({ fn: "Count", n, bare });
  E.first = (x, o = {}) => ({ fn: "First", x: asM(x), lower: !!o.lower });
  E.then = (x, o = {}) => ({ fn: "Then", x: asM(x), lower: !!o.lower });
  E.also = (x) => ({ fn: "Also", x: asM(x) });
  E.p = (t) => ({ fn: "Punct", t });
  E.join = (parts, sep) => ({ fn: "Join", parts: parts.map(asM), sep });
  E.word = (id) => ({ fn: "Word", id });
  /** The step joins of an ordered list: the first "pela x", the rest "ne poi x" (lower: inside a row). */
  E.step = (i, x, o) => (i === 0 ? E.first(x, o) : E.then(x, o));
  /** Display words. */
  E.w = (id, o) => Object.assign(E.show(E.word(id), o), { id });
  E.num = (n, o) => Object.assign(E.show(E.count(n), o), { id: Lang.numId(n), n });
  E.numId = Lang.numId;
  E.sizeId = (size) => (G().size || {})[size] || null;
  E.sideId = (side) => (G().sides || {})[side] || null;
  E.yesId = () => G().yes || null;
  E.noId = () => G().no || null;
  /** A display word for a size + noun ("wadho [wax]"): the describing word agrees with the noun (he-form if unknown). */
  E.sized = (size, noun, o) => E.show(E.item(noun, { size }), o);
  // Node (the leak bots, the unit tests): the data from the repo, so a plan reads the same words as the game
  if (typeof module === "object" && module.exports && typeof require === "function" && typeof __dirname === "string") {
    try {
      E.load(JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "..", "..", "data", "clinic", "lang.json"), "utf8")));
    } catch (e) {
      /* no data: every word is a placeholder */
    }
  }
  return E;
});
