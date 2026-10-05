/*
 * The linearizer (engine-design § 7): a meaning tree in, word tokens out, or gaps. General code: it holds no word
 * and no grammar of any language (rules G13, G26). Everything it says comes from the data (data/lang/):
 *   params     the features and their values, each part of speech's default cell, who "you" is (G6)
 *   lexicon    words: id, part of speech, gender, paradigm, forms by cell, status, sources
 *   paradigms  word classes: how each cell is made from the lemma or stem, with a status per cell
 *   abstract   meanings: their arguments, an optional `core` expansion into other meanings, English for Mum
 *   concrete   rules: how a meaning becomes words (slots), with agreement written as {arg.feature} templates
 *
 * A TEMPLATE such as "{n.number|sg}.{case}" builds a cell key. Inside braces, alternatives are tried left to right:
 *   arg.feature   a feature of one of this meaning's arguments ("thing.gender")
 *   $field        a field of the meaning itself ($number: the game asked for "more than one")
 *   feature name  this phrase's own feature (from the rule's `feats`), else the inherited case or the context
 *   anything else a literal value (used only when every alternative before it is absent)
 * An argument whose noun has no known gender gives the language's default gender (params.features.gender.default,
 * Mum's rule) and a `feature` gap the first time a form actually depends on it (decision 21, rule G2).
 *
 * Nothing is guessed: a missing word, form or rule is a GAP ({kind, ...}), and the token in its place is the
 * grey-italic English placeholder from the data (lang "e"), never a made-up Kutchi string (rule G9).
 */

const STATUS_RANK = { confirmed: 0, draft: 1, "to-record": 2, unknown: 3 };
const worst = (a, b) => ((STATUS_RANK[a] || 0) >= (STATUS_RANK[b] || 0) ? a || b : b);

/** Does a form key ("he.*.obl") cover a cell ("he.sg.obl")? Returns its specificity, or -1. "*" alone covers all. */
export function keyCovers(key, cell) {
  if (key === "*") return 0;
  const k = String(key).split(".");
  const c = String(cell).split(".");
  if (k.length !== c.length) return -1;
  let score = 0;
  for (let i = 0; i < k.length; i++) {
    if (k[i] === "*") continue;
    if (k[i] !== c[i]) return -1;
    score++;
  }
  return score;
}

/** The best entry of a {key: value} table for a cell, or null. */
function bestOf(table, cell) {
  let best = null;
  let bestScore = -1;
  for (const key of Object.keys(table || {})) {
    const s = keyCovers(key, cell);
    if (s > bestScore) (best = key), (bestScore = s);
  }
  return best == null ? null : { key: best, value: table[best] };
}

export function createLinearizer(data) {
  const params = data.params || {};
  const features = params.features || {};
  const posInfo = params.pos || {};
  const entries = (data.lexicon && data.lexicon.entries) || [];
  const paradigms = (data.paradigms && data.paradigms.paradigms) || {};
  const functions = (data.abstract && data.abstract.functions) || {};
  const lins = (data.concrete && data.concrete.lin) || {};
  const genderDefault = (features.gender && features.gender.default) || null;
  const featureNames = new Set(Object.keys(features).concat(["lex"]));

  const byId = new Map();
  const byRef = new Map(); // a pronoun's person reference ("p1", "p1pl.incl") -> entry
  const byValue = new Map(); // a number word's value (2) -> entry
  for (const e of entries) {
    byId.set(e.id, e);
    (e.aliases || []).forEach((a) => byId.has(a) || byId.set(a, e));
    if (e.ref) byRef.set(e.ref, e);
    if (e.pos === "Num" && e.value != null) byValue.set(Number(e.value), e);
  }
  const lexOf = (id) => byId.get(id) || null;
  const hasKutchi = (e) => !!(e && (e.lemma || (e.forms && Object.keys(e.forms).length) || (e.parts && e.parts.length)));

  /* ---------- forms ---------- */

  /** The stem of a lemma for a paradigm ({stem: {drop: "x"}} drops that ending). */
  function stemOf(e, p) {
    const lemma = e.lemma || "";
    const drop = p && p.stem && p.stem.drop;
    return drop && lemma.endsWith(drop) ? lemma.slice(0, lemma.length - drop.length) : lemma;
  }

  /**
   * One word in one cell: {t, status, src} or {gap}. Lookup: the entry's own forms (most specific key first), then
   * its paradigm's cells. A cell marked `unknown`, or no cell at all, is a `form` gap; a word with no Kutchi yet
   * (status to-record) or no entry is a `lexeme` gap.
   */
  function inflect(id, cell) {
    const e = lexOf(id);
    if (!e) return { gap: { kind: "lexeme", lex: id, what: `no word "${id}" in the lexicon`, ask: [] } };
    if (e.status === "to-record" || !hasKutchi(e))
      return { gap: { kind: "lexeme", lex: e.id, what: `no Kutchi yet for "${e.gloss || e.id}"`, ask: [].concat((e.ask && e.ask.word) || []) }, entry: e };
    const own = bestOf(e.forms, cell);
    const p = e.paradigm ? paradigms[e.paradigm] : null;
    const fromP = p ? bestOf(p.cells, cell) : null;
    // an entry's own forms override its class's cells (engine-design § 5.2)
    const pick = own ? { ...own, from: "lexicon" } : fromP ? { ...fromP, from: "paradigm" } : null;
    const formAsk = [].concat((e.ask && e.ask[cell]) || []);
    if (!pick) return { gap: { kind: "form", lex: e.id, cell, what: `no "${cell}" form of "${e.gloss || e.id}"`, ask: formAsk }, entry: e };
    const v = pick.value;
    const cellObj = typeof v === "string" ? { t: v } : v || {};
    if (cellObj.status === "unknown" || (cellObj.t == null && cellObj.make == null))
      return { gap: { kind: "form", lex: e.id, cell, what: `the "${cell}" form of "${e.gloss || e.id}" is not known yet`, ask: [].concat(cellObj.ask || formAsk) }, entry: e };
    let t = cellObj.t;
    if (t == null) t = String(cellObj.make).replace(/\{stem\}/g, stemOf(e, p)).replace(/\{lemma\}/g, e.lemma || "");
    const status = worst(e.status || "confirmed", cellObj.status || "confirmed");
    const src = [].concat(cellObj.src || [], pick.from === "lexicon" && !cellObj.src ? e.src || [] : []);
    return { t, status, src, entry: e, from: pick.from, key: pick.key };
  }

  /* ---------- values and features ---------- */

  /** What an argument value is: {type: "lex"|"node"|"list"|"missing", ...} */
  function classify(v, argDecl, ctx) {
    if (v == null) return { type: "missing" };
    if (Array.isArray(v)) return { type: "list", items: v };
    if (typeof v === "object") return v.fn ? { type: "node", m: v } : { type: "missing" };
    if (typeof v === "number" || (argDecl && argDecl.type === "Num" && /^\d+$/.test(String(v)))) {
      const e = byValue.get(Number(v));
      return e ? { type: "lex", id: e.id } : { type: "lex", id: `num:${v}`, missingValue: Number(v) };
    }
    const s = String(v);
    if (argDecl && argDecl.type === "Person") {
      const map = (params.addressee || {})[s];
      const ref = map ? (ctx.addressee && ctx.addressee.elder ? map.elder : map.else || s) : s;
      const e = byRef.get(ref);
      return e ? { type: "lex", id: e.id, ref } : { type: "lex", id: `pron:${ref}`, ref };
    }
    return { type: "lex", id: s };
  }

  /** A word's own features (gender, number, person, clusivity, lex); an unknown gender is defaulted and marked. */
  function lexFeats(id) {
    const e = lexOf(id);
    const f = { lex: id, $def: {} };
    if (!e) return f;
    f.lex = e.id;
    if (e.pos === "N" || e.pos === "PN") (f.person = "p3"), (f.number = "sg");
    for (const k of ["number", "person", "clusivity"]) if (e[k] != null) f[k] = e[k];
    if ("gender" in e || e.pos === "N" || e.pos === "PN") {
      if (e.gender) f.gender = e.gender;
      else if (genderDefault) (f.gender = genderDefault), (f.$def.gender = [e.id]);
    }
    return f;
  }

  return { inflect, classify, lexFeats, lexOf, functions, lins, features, featureNames, posInfo, keyCovers, worst, hasKutchi, byRef };
}

/**
 * Linearize one meaning. Returns {tokens, gaps, drafts, nodes, trace, cat}. Tokens are
 * {t, lang: "k"|"e", lex?, cell?, status, src?, punct?, gap?, defaulted?}; nodes are {key, fn, from, to} spans.
 */
export function linearize(L, meaning, ctx = {}) {
  const st = { tokens: [], gaps: [], gapKeys: new Map(), nodes: [], trace: [], featCache: new WeakMap() };
  const { functions, lins, featureNames, posInfo } = L;

  function addGap(g) {
    const key = g.key || [g.kind, g.id || "", g.lex || "", g.cell || "", g.feature || ""].join("|");
    if (st.gapKeys.has(key)) return st.gapKeys.get(key);
    const gap = { ...g, key };
    gap.ask = [].concat(g.ask || []);
    st.gapKeys.set(key, gap);
    st.gaps.push(gap);
    return gap;
  }

  /* ----- templates ----- */

  /** One {…} alternative list against a scope; returns {value, def?: [lex ids]} or null. */
  function resolveAlt(expr, scope) {
    for (const alt of String(expr).split("|")) {
      const a = alt.trim();
      if (a.includes(".")) {
        const [argName, feat] = a.split(".");
        const f = scope.argFeats(argName);
        if (!f) continue; // that argument is absent: try the next alternative
        if (f[feat] == null) continue;
        return { value: f[feat], def: (f.$def && f.$def[feat]) || null };
      }
      if (a.startsWith("$")) {
        const v = scope.meaning && scope.meaning[a.slice(1)];
        if (v != null) return { value: String(v) };
        continue;
      }
      if (featureNames.has(a)) {
        const own = scope.own && scope.own[a];
        if (own != null) return { value: own, def: (scope.own.$def && scope.own.$def[a]) || null };
        const inh = scope.inh && scope.inh[a];
        if (inh != null) return { value: inh };
        const c = a === "register" ? ctx.register : a === "speaker" ? ctx.speaker && ctx.speaker.gender : null;
        if (c != null) return { value: c };
        continue;
      }
      return { value: a }; // a literal
    }
    return null;
  }

  /** A whole template ("pres.{thing.gender}.{thing.number}") -> {cell, def: [lex ids], unresolved: [expr]} */
  function fill(tpl, scope) {
    const def = [];
    const unresolved = [];
    const cell = String(tpl).replace(/\{([^}]+)\}/g, (_, expr) => {
      const r = resolveAlt(expr, scope);
      if (!r) return unresolved.push(expr), "?";
      if (r.def) def.push(...r.def);
      return r.value;
    });
    return { cell, def, unresolved };
  }

  /* ----- meanings ----- */

  /** A domain meaning with no rule of its own, expanded through its `core` template ($arg -> the argument). */
  function expand(m) {
    const abs = functions[m.fn];
    const sub = (t) => {
      if (typeof t === "string" && t.startsWith("$")) return m[t.slice(1)];
      if (Array.isArray(t)) return t.map(sub);
      if (t && typeof t === "object") {
        const o = {};
        for (const k of Object.keys(t)) {
          const v = sub(t[k]);
          if (v !== undefined) o[k] = v;
        }
        return o;
      }
      return t;
    };
    return sub(abs.core);
  }

  /** The rule a meaning uses: its own `lin`, else its expansion's; null when there is neither. */
  function ruleFor(m) {
    let cur = m;
    for (let i = 0; i < 8; i++) {
      if (lins[cur.fn]) return { m: cur, rule: lins[cur.fn] };
      const abs = functions[cur.fn];
      if (!abs || !abs.core) return { m: cur, rule: null };
      cur = expand(cur);
    }
    return { m: cur, rule: null };
  }

  /** The features of a value (computed without inflecting anything; cached per meaning object). */
  function featsOf(v, argDecl) {
    const c = L.classify(v, argDecl, ctx);
    if (c.type === "lex") return L.lexFeats(c.id);
    if (c.type === "list") return c.items.length ? featsOf(c.items[0], argDecl) : null;
    if (c.type !== "node") return null;
    if (st.featCache.has(c.m)) return st.featCache.get(c.m);
    const { m, rule } = ruleFor(c.m);
    const f = { $def: {} };
    st.featCache.set(c.m, f);
    if (rule && rule.feats) {
      const scope = scopeFor(m, null, {});
      for (const k of Object.keys(rule.feats)) {
        const r = fill(rule.feats[k], scope);
        if (!r.unresolved.length) {
          f[k] = r.cell;
          if (r.def.length) f.$def[k] = r.def;
        }
      }
    }
    return f;
  }

  function scopeFor(m, own, inh) {
    const abs = functions[m.fn] || { args: {} };
    return {
      meaning: m,
      own,
      inh,
      argFeats: (name) => (m[name] == null ? null : featsOf(m[name], (abs.args || {})[name])),
    };
  }

  /**
   * The canonical key of a meaning (the clip index's key for a whole phrase). A word given by a game's old id (an alias)
   * is keyed by the entry's id, and a Person argument by the person actually said ("p2" to an elder is p2resp, rule G6),
   * so a recording of a sentence said to an elder and one said to a child never share a key.
   */
  function meaningKey(v, decl) {
    if (v == null) return "";
    if (Array.isArray(v)) return "[" + v.map((x) => meaningKey(x, decl)).join(",") + "]";
    if (typeof v !== "object") {
      if (decl && decl.type === "Person") {
        const c = L.classify(v, decl, ctx);
        return c.ref || String(v);
      }
      const e = L.lexOf(String(v));
      return e ? e.id : String(v);
    }
    const abs = functions[v.fn] || { args: {} };
    const names = Object.keys(abs.args || {}).concat(Object.keys(v).filter((k) => k !== "fn" && !k.startsWith("$") && !(k in (abs.args || {}))).sort());
    const parts = names.filter((k) => v[k] != null).map((k) => (k in (abs.args || {}) ? meaningKey(v[k], abs.args[k]) : `${k}=${meaningKey(v[k])}`));
    return `${v.fn}(${parts.join(",")})`;
  }

  /* ----- tokens ----- */

  /**
   * One word. With an explicit cell template the word's own features (a noun's gender) come first, then the
   * phrase's (its number); with none, a word standing alone as an argument is its own phrase: its own features,
   * one (sg) unless it says otherwise, and the case its slot gives (`alone`).
   */
  function pushWord(id, cellTpl, scope, { alone = false } = {}) {
    const e = L.lexOf(id);
    const tpl = cellTpl || (e && posInfo[e.pos] && posInfo[e.pos].defaultCell) || "-";
    const own = e ? L.lexFeats(e.id) : { $def: {} };
    const ownScope = alone && !cellTpl ? { number: "sg", ...own, $def: own.$def } : mergeOwn(own, scope.own);
    const filled = fill(tpl, { ...scope, own: ownScope });
    // a set phrase or a fixed expression (a word that is two words, a polite refusal) is made of other words: each is its own
    // token (its own form, status and clip), and the whole carries the entry's own status and meaning
    if (e && e.parts && e.parts.length && !filled.unresolved.length && !(e.forms && Object.keys(e.forms).some((k) => keyCovers(k, filled.cell) >= 0)) && e.status !== "to-record") {
      const start = st.tokens.length;
      for (const part of e.parts) {
        if (part.punct) st.tokens.push({ t: part.punct, lang: null, punct: true });
        else pushWord(part.lex, String(part.cell || "").replace(/\{cell\}/g, filled.cell) || null, scope);
      }
      for (let i = start; i < st.tokens.length; i++) {
        const tk = st.tokens[i];
        if (tk.punct) continue;
        tk.of = e.id;
        if (tk.lang === "k") tk.status = L.worst(tk.status, e.status || "confirmed");
        if (filled.def.length && tk.lang === "k") {
          tk.defaulted = { gender: Array.from(new Set([...((tk.defaulted && tk.defaulted.gender) || []), ...filled.def])) };
          tk.status = L.worst(tk.status, "draft");
        }
      }
      st.trace.push({ word: e.id, parts: e.parts.length, cell: filled.cell, status: e.status, src: e.src });
      return;
    }
    const r = filled.unresolved.length ? { gap: { kind: "rule", id: scope.meaning ? scope.meaning.fn : "?", what: `cannot work out ${filled.unresolved.join(", ")} for "${id}"` }, entry: e } : L.inflect(id, filled.cell);
    if (r.gap) {
      const g = addGap(r.gap);
      const en = (r.entry && (/(^|\.)pl(\.|$)/.test(filled.cell) && r.entry.glossPl ? r.entry.glossPl : r.entry.en || r.entry.gloss)) || id;
      st.tokens.push({ t: en, lang: "e", lex: r.entry ? r.entry.id : id, cell: filled.cell, status: "to-record", gap: g.key, placeholder: true });
      return;
    }
    const tok = { t: r.t, lang: "k", lex: r.entry.id, cell: filled.cell, status: r.status, src: r.src };
    if (r.entry.say) tok.say = r.entry.say;
    if (filled.def.length) {
      tok.defaulted = { gender: Array.from(new Set(filled.def)) };
      tok.status = L.worst(tok.status, "draft");
      for (const lx of tok.defaulted.gender) {
        const le = L.lexOf(lx);
        addGap({ kind: "feature", lex: lx, feature: "gender", defaulted: L.features.gender && L.features.gender.default, what: `the gender of "${(le && le.gloss) || lx}" is not known; the he-form was used (Mum's rule)`, ask: [].concat((le && le.ask && le.ask.gender) || []) });
      }
    }
    if (scope.ruleDraft) tok.status = L.worst(tok.status, "draft");
    st.tokens.push(tok);
    st.trace.push({ word: r.entry.id, cell: filled.cell, t: r.t, from: r.from, key: r.key, status: tok.status, src: r.src });
  }

  /** a word's own gender/person/clusivity win; number and case come from the phrase unless the word fixes them */
  function mergeOwn(wordFeats, phrase) {
    const out = { ...(phrase || {}), $def: { ...((phrase && phrase.$def) || {}) } };
    for (const k of Object.keys(wordFeats)) {
      if (k === "$def") continue;
      if (k === "number" && phrase && phrase.number != null) continue;
      out[k] = wordFeats[k];
      if (wordFeats.$def && wordFeats.$def[k]) out.$def[k] = wordFeats.$def[k];
      else delete out.$def[k];
    }
    return out;
  }

  function placeholder(text, gap) {
    String(text)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => {
        const m = w.match(/^(.*?)([.,!?;]*)$/);
        if (m[1]) st.tokens.push({ t: m[1], lang: "e", status: "to-record", gap: gap.key, placeholder: true });
        if (m[2]) st.tokens.push({ t: m[2], lang: null, punct: true });
      });
  }

  /** A value in a slot: a word (inflected at `cell`), a nested meaning (with the slot's case), or a list. */
  function linValue(v, argDecl, slot, scope, inhCase) {
    const c = L.classify(v, argDecl, ctx);
    if (c.type === "missing") return;
    if (c.type === "list") {
      const items = c.items;
      if (slot.each || items.length <= 1) return items.forEach((it) => linValue(it, argDecl, { ...slot, each: false }, scope, inhCase));
      if (!slot.list) {
        const g = addGap({ kind: "rule", id: `${scope.meaning.fn}.${slot.arg}:list`, what: `how to join a list of ${slot.arg} in ${scope.meaning.fn}`, ask: [] });
        items.forEach((it, i) => {
          if (i) placeholder("and", g);
          linValue(it, argDecl, { ...slot, each: false }, scope, inhCase);
        });
        return;
      }
      items.forEach((it, i) => {
        if (i) runSlots(i === items.length - 1 ? slot.list.last || slot.list.between || [] : slot.list.between || [], scope);
        linValue(it, argDecl, { ...slot, each: false, list: null }, scope, inhCase);
      });
      return;
    }
    if (c.type === "lex") {
      if (c.missingValue != null) {
        const g = addGap({ kind: "lexeme", lex: c.id, what: `no number word for ${c.missingValue}`, ask: [] });
        return placeholder(String(c.missingValue), g);
      }
      // a word with an explicit cell is part of this phrase: its {case} is the phrase's, unless the slot sets one
      const theCase = slot.case || !slot.cell ? inhCase : (scope.inh && scope.inh.case) || inhCase;
      const cellScope = { ...scope, inh: { ...(scope.inh || {}), case: theCase } };
      return pushWord(c.id, slot.cell, cellScope, { alone: true });
    }
    linNode(c.m, { case: inhCase });
  }

  function runSlots(slots, scope) {
    const abs = functions[scope.meaning.fn] || { args: {} };
    for (const slot of slots) {
      if (slot.punct) {
        st.tokens.push({ t: slot.punct, lang: null, punct: true });
        continue;
      }
      if (slot.lex) {
        pushWord(slot.lex, slot.cell, scope);
        continue;
      }
      if (slot.arg) {
        const v = scope.meaning[slot.arg];
        if (v == null) continue; // absent (optional) arguments say nothing
        const inhCase = slot.case ? fill(slot.case, scope).cell : "dir";
        if (slot.via) {
          [].concat(v).forEach((x) => linNode({ fn: slot.via, x, $parent: scope.own }, { case: inhCase }));
          continue;
        }
        linValue(v, (abs.args || {})[slot.arg], slot, scope, inhCase);
      }
    }
  }

  /** `only` conditions ({"head.gender": ["she"]}): every one must hold, or the rule doesn't apply. */
  function onlyHolds(rule, scope) {
    for (const k of Object.keys(rule.only || {})) {
      const r = resolveAlt(k, scope);
      if (!r || !rule.only[k].includes(r.value)) return false;
    }
    return true;
  }

  function linNode(m0, inh) {
    const from = st.tokens.length;
    const abs = functions[m0.fn];
    if (!abs) {
      const g = addGap({ kind: "rule", id: m0.fn, what: `the meaning "${m0.fn}" is not in the abstract syntax`, ask: [] });
      placeholder(m0.fn, g);
      return;
    }
    const found = ruleFor(m0);
    const m = found.m;
    let rule = found.rule;
    const own = featsOf(m0) || { $def: {} };
    const scope = { ...scopeFor(m, own, inh), ruleDraft: rule && rule.status === "draft" };
    // a rule's exceptions (each with its own `only` condition and source) are tried first, in order
    const ex = rule && (rule.exceptions || []).find((x) => onlyHolds(x, scope));
    if (ex) {
      rule = { ...rule, ...ex, only: undefined, exceptions: undefined, onlyAsk: undefined, exception: true };
      if (ex.slots && !ex.variants) delete rule.variants;
      scope.ruleDraft = rule.status === "draft";
    }
    if (m0.$parent) scope.argFeats = ((base) => (name) => (name === "parent" ? m0.$parent : base(name)))(scope.argFeats);
    const unknown = !rule || rule.status === "unknown" || !onlyHolds(rule, scope);
    if (unknown) {
      const why = !rule ? "no rule yet" : rule.status === "unknown" ? "not known yet" : "not known for this case";
      const g = addGap({
        kind: "rule",
        id: m.fn,
        what: `how to say "${(rule && rule.what) || abs.en || m.fn}" (${why})`,
        ask: [].concat((rule && (rule.status === "unknown" ? rule.ask : rule.onlyAsk || rule.ask)) || abs.ask || []),
      });
      // the honest rendering: the rule's English with its arguments said in Kutchi where they can be
      const tpl = (rule && rule.english) || abs.english || abs.en || m.fn;
      String(tpl)
        .split(/(\{[^}]+\})/)
        .forEach((part) => {
          const mm = part.match(/^\{([^}]+)\}$/);
          if (mm) {
            const v = m[mm[1]] != null ? m[mm[1]] : m0[mm[1]];
            if (v != null) linValue(v, (abs.args || {})[mm[1]], { arg: mm[1] }, scope, inh.case || "dir");
          } else if (part.trim()) placeholder(part, g);
        });
      st.trace.push({ meaning: m.fn, gap: g.key });
      st.nodes.push({ key: meaningKey(m0), fn: m0.fn, from, to: st.tokens.length - 1, gap: true });
      return;
    }
    const slots = rule.variants ? rule.variants[ctx.register] || rule.variants[rule.defaultVariant] || rule.variants[Object.keys(rule.variants)[0]] : rule.slots || [];
    st.trace.push({ meaning: m.fn, rule: m.fn !== m0.fn ? `${m0.fn} -> ${m.fn}` : m.fn, variant: rule.variants ? (rule.variants[ctx.register] ? ctx.register : rule.defaultVariant || Object.keys(rule.variants)[0]) : null, status: rule.status || "confirmed", src: rule.src });
    runSlots(slots, scope);
    if (rule.mark && inh.top) st.tokens.push({ t: rule.mark, lang: null, punct: true, mark: true });
    st.nodes.push({ key: meaningKey(m0), fn: m0.fn, from, to: st.tokens.length - 1 });
  }

  const abs = functions[meaning && meaning.fn];
  linNode(meaning, { case: "dir", top: true });
  const drafts = st.tokens.map((t, i) => ({ ...t, i })).filter((t) => t.lang === "k" && t.status !== "confirmed");
  return { tokens: st.tokens, gaps: st.gaps, drafts, nodes: st.nodes, trace: st.trace, cat: abs ? abs.cat : null, key: meaningKey(meaning) };
}
