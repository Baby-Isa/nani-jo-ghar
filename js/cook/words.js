/*
 * Cook's words and lines, through the language engine (step 4d, decision 42; rules G9, G26, G27). The engine
 * (js/core/lang/engine/ over data/lang/) is the only source: every word, number, frame and line Cook shows or plays is
 * an engine meaning, built and agreed by the engine, and spoken from the engine's clip plan (stitched from the family's
 * word recordings, decision 26). This file holds no Kutchi, no word table, no frame text and no agreement: it names
 * meanings (Cook's frame keys are mapped to meanings in data/cook.json `meanings`; Cook's word ids are the engine's
 * aliases) and turns the engine's result into the line objects Cook's screens draw ({segs, en, plan}). What the engine
 * can't say comes back as its own gap: the grey-italic English placeholder, flagged to record (G2, G9).
 *
 * It keeps the call names of the old js/cook/lang.js (Lang.phrase, Lang.line, Lang.speak, ...), so no station or
 * mechanic changes (rule A4/A5; engine-design § 14 step 3). js/cook/lang.js is no longer loaded by cook.html: it stays
 * only for the parked pages (dress, find, snap, tidy, monsoon), marked as their adapter.
 *
 *   Cook.langEngine                     the engine (js/cook/boot.js makes it before Cook starts)
 *   Lang.say(meaning) -> line           any engine meaning, as a line {segs, en, plan, r}
 *   Lang.phrase(parts) -> line          today's phrase parts ([2, "ph-big", "cook-maani"]) as an engine Item
 *   Lang.line(key, phrase?) -> line     a Cook frame (data/cook.json `meanings`) or a fixed line (alias cook.line.<key>)
 *   Lang.join(lines) -> line            THE ONE ADAPTER LEFT (marked, step 4d): several engine-built lines one after the
 *                                       other (an order's head and rows, a list); the join adds only the order and the
 *                                       mark. The engine has no rule for these yet: "with" / "and" joins (WithFood,
 *                                       AndKind, a list in a frame) are in data/lang/reports/gap-list.md (Cook).
 *   Lang.speak(line) / Lang.speakWord(id)  the engine's clip plan through the core voice (Cook.core.voice)
 *   Cook.display(id) .english(id) .isPlaceholder(id) .numId(n) .numWord(n)   one word, from the engine
 */
(function (global) {
  // C4: Cook's namespace (js/cook/ns.js) when Cook loads as modules; the parked pages' and Node harnesses' marked window.Cook
  // when this file runs as a classic script. Timers go through Cook's lifetime (js/cook/life.js) when it is there.
  const Cook = global.__njgCookLoading || (global.Cook = global.Cook || {});
  const { setTimeout, clearTimeout, setInterval, clearInterval } = Cook.life || global;
  const Lang = (Cook.Lang = {});
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  Cook.engineWords = true; // cook.html: Cook's words are the engine's (js/cook/core.js skips the parked pages' TTS table)

  const EN = () => {
    if (!Cook.langEngine) throw new Error("Cook.Lang: the language engine isn't loaded (js/cook/boot.js)");
    return Cook.langEngine;
  };
  const LX = () => EN().linearizer;
  const entry = (id) => (id == null ? null : LX().lexOf(String(id)));
  const ctx = {};
  Lang.gapLog = [];

  /* ---------------- one word ---------------- */
  Lang.known = (id) => !!entry(id);
  /** The engine's word result for a Cook id (its default form), or a placeholder for an id the engine doesn't know. */
  function wordR(id) {
    if (!entry(id)) return { ok: false, text: String(id), en: String(id), tokens: [{ t: String(id), lang: "e" }], segments: [{ t: String(id), lang: "e", gap: "lexeme" }], clipPlan: [{ kind: "missing", source: "missing", lang: "e", text: String(id), tokens: [0, 0] }], gaps: [{ kind: "lexeme", lex: id }], drafts: [] };
    let r = EN().word(String(id), null, ctx);
    // a describing word Mum gave in one form only (kari, mori: kari chai), said on its own: that form, not a gap
    const e = entry(id);
    const cells = Object.keys((e && e.forms) || {});
    if (!r.ok && e.pos === "A" && cells.length === 1) r = EN().word(String(id), cells[0], ctx);
    return withSay(Object.assign({}, r, { en: entry(id).gloss || String(id) }));
  }
  // a noun through the engine's Item (a fixed expression such as bajr ji maani is built from its parts)
  Cook.display = (id) => Lang.plain(Lang.phrase([id]));
  Cook.kutchi = Cook.display;
  Cook.english = (id) => {
    const e = entry(id);
    // a gloss's note for grown-ups in brackets ("skewer (a stick)") stays out of the word's English
    return ((e && e.gloss) || String(id)).replace(/\s*\([^)]*\)/g, "");
  };
  Cook.isPlaceholder = (id) => !Lang.phrase([id]).ok;
  /** A number's Cook id: the engine's number word for n, by the alias Cook's recipes and progress use. */
  Cook.numId = (n) => {
    const c = LX().classify(Number(n), { type: "Num" }, {});
    if (c.missingValue != null) return `num:${n}`;
    const e = entry(c.id);
    return ((e && e.aliases) || []).find((a) => /^num-\d+$/.test(a)) || c.id;
  };
  Cook.numWord = (n) => Cook.display(Cook.numId(n));
  Lang.numId = (n) => Cook.numId(n);
  Lang.gender = (id) => {
    const e = entry(id);
    return e && (e.gender === "he" || e.gender === "she") ? e.gender : null;
  };
  /** Does this word agree with its noun (a number, a describing word)? */
  Lang.hasForms = (id) => {
    const e = entry(id);
    return !!(e && (e.pos === "A" || e.pos === "Num"));
  };
  Lang.isDraft = (id) => {
    const e = entry(id);
    return !!(e && e.status === "draft");
  };
  /** The "to check" flag shows on the test site only, never in the store app (decision 21). */
  Lang.flagGuesses = () => global.NJG_BUILD !== "store";

  /* ---------------- meanings ---------------- */
  const POS_NOUN = { N: 1, PN: 1, Phrase: 1 };
  const isMod = (id) => {
    const e = entry(id);
    return !!(e && e.pos === "A");
  };
  /**
   * Today's phrase parts -> a meaning: a number, describing words, then the thing ([2, "ph-big", "cook-maani"] is an
   * Item); one word alone is that word; anything else (two things in one phrase) is a Join of the engine's pieces.
   */
  function itemOf(parts) {
    const ps = [].concat(parts || []).flatMap((p) => (typeof p === "string" && p.includes("+") ? p.split("+") : [p]));
    const words = ps.filter((p) => typeof p === "string");
    const nums = ps.filter((p) => typeof p === "number");
    if (!words.length) return nums.length ? { fn: "Count", n: nums[0] } : { fn: "Join", parts: [] };
    const noun = (id) => !!(entry(id) && POS_NOUN[entry(id).pos]);
    // one thing said on its own: a noun is an Item (a fixed expression such as bajr ji maani is built from its parts),
    // any other word is that word
    if (ps.length === 1) return noun(words[0]) ? { fn: "Item", kind: words[0] } : { fn: "Word", id: words[0] };
    const kind = words[words.length - 1];
    const mods = words.slice(0, -1);
    const numFirst = nums.length <= 1 && (!nums.length || ps[0] === nums[0]);
    if (numFirst && mods.every(isMod) && noun(kind)) return { fn: "Item", kind, n: nums[0], mods: mods.length ? mods : undefined };
    // a unit and what it holds ("ba lakri gos": skewers of meat): the engine's Unit
    if (numFirst && nums.length && words.length === 2 && noun(words[0]) && noun(kind)) return { fn: "Unit", n: nums[0], unit: words[0], of: kind };
    // not one noun phrase the engine has a rule for: each piece the engine's own, in the order given
    return { fn: "Join", parts: ps.map((p) => (typeof p === "number" ? { fn: "Count", n: p } : { fn: "Word", id: p })) };
  }
  Lang.itemOf = itemOf;

  /* ---------------- results ---------------- */
  const empty = () => ({ ok: true, text: "", en: "", tokens: [], segments: [], clipPlan: [], drafts: [], gaps: [] });
  /** append result b to a (a space between, none before a mark) */
  function concat(a, b, { space = true } = {}) {
    if (!b.segments.length) return a;
    const sp = a.segments.length && space;
    if (sp) a.segments.push({ t: " ", lang: null });
    a.segments.push(...b.segments.map((s) => Object.assign({}, s)));
    a.tokens.push(...(b.tokens || []));
    a.clipPlan.push(...(b.clipPlan || []).map((c) => Object.assign({}, c)));
    a.drafts.push(...(b.drafts || []));
    a.gaps.push(...(b.gaps || []));
    a.ok = a.ok && b.ok;
    a.text += (sp ? " " : "") + b.text;
    a.en += (a.en && space ? " " : "") + (b.en || "");
    return a;
  }
  /** a result's say-spelling per clip (the entry's own `say`, for the test path's stand-in voice) */
  function withSay(r) {
    const toks = r.tokens || [];
    r.clipPlan = (r.clipPlan || []).map((c) => {
      const t = c.tokens && c.tokens[0] === c.tokens[1] ? toks[c.tokens[0]] : null;
      const e = t && t.lex ? entry(t.lex) : null;
      return e && e.say ? Object.assign({}, c, { say: e.say }) : c;
    });
    return r;
  }
  /** the engine, for one meaning (Join, Count, Word and a frame round a Join are put together from its pieces) */
  function sayR(m) {
    let r;
    switch (m.fn) {
      case "Punct":
        return Object.assign(empty(), { text: m.t, en: m.t, segments: [{ t: m.t, lang: null }], punct: true });
      case "Word":
        r = wordR(m.id);
        break;
      case "Count": {
        const id = Cook.numId(m.n);
        r = entry(id) ? wordR(id) : Object.assign(empty(), { ok: false, text: String(m.n), en: String(m.n), segments: [{ t: String(m.n), lang: "e", gap: "number" }], gaps: [{ kind: "lexeme", lex: `num:${m.n}` }] });
        break;
      }
      case "Join": {
        r = empty();
        for (const p of m.parts) {
          const pr = sayR(p);
          concat(r, pr, { space: !pr.punct });
        }
        break;
      }
      default: {
        // a frame round a Join (the engine has no rule for two things in one slot): the frame with the first piece,
        // then the rest after it
        const k = Object.keys(m).find((x) => x !== "fn" && m[x] && typeof m[x] === "object" && m[x].fn === "Join");
        if (k && m[k].parts.length) {
          const [head, ...rest] = m[k].parts;
          r = sayR(Object.assign({}, m, { [k]: head }));
          concat(r, sayR({ fn: "Join", parts: rest }));
          break;
        }
        r = withSay(EN().say(engineM(m), ctx));
      }
    }
    (r.gaps || []).forEach((g) => g.kind !== "audio" && Lang.gapLog.push(Object.assign({ meaning: m.fn }, g)));
    return r;
  }
  /** a meaning with Cook's Word/Item pieces as the engine takes them (a plain word in a slot is the word's id) */
  function engineM(m) {
    if (m == null || typeof m !== "object") return m;
    if (Array.isArray(m)) return m.map(engineM);
    if (m.fn === "Word") return m.id;
    if (m.fn === "Count") return Cook.numId(m.n);
    const out = {};
    for (const k of Object.keys(m)) out[k] = k === "fn" ? m[k] : engineM(m[k]);
    if (out.fn === "Item") Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
    return out;
  }
  /** every Cook id named in a meaning (the line's segments carry them, so a word's stage and dots follow it) */
  function idsOf(m, out = new Map()) {
    if (m == null) return out;
    if (typeof m === "string") {
      const e = entry(m);
      if (e && !out.has(e.id)) out.set(e.id, m);
      return out;
    }
    if (Array.isArray(m)) return m.forEach((x) => idsOf(x, out)), out;
    if (typeof m !== "object") return out;
    if (m.fn === "Count") return idsOf(Cook.numId(m.n), out);
    if ((m.fn === "Item" || m.fn === "Unit") && m.n != null) idsOf(Cook.numId(m.n), out);
    for (const k of Object.keys(m)) if (k !== "fn") idsOf(m[k], out);
    return out;
  }
  /**
   * An engine result -> a Cook line {segs, en, plan, r, m}. A segment keeps the Cook id it was asked for (`w`), its
   * engine id (`lex`), and, for a number or describing word agreeing with a noun whose gender Mum hasn't confirmed,
   * `check` (that noun: decision 21's "to check" flag, test site only).
   */
  function lineOf(r, m, { row = false } = {}) {
    const ids = idsOf(m);
    let segs = r.segments.map((s) => {
      const o = Object.assign({}, s);
      if (o.w) {
        o.lex = o.w;
        if (ids.has(o.w)) o.w = ids.get(o.w);
        else delete o.w;
      }
      return o;
    });
    // the engine marks the token whose form came from a defaulted gender (tokens and worded segments run in step)
    const toks = (r.tokens || []).filter((t) => !t.punct);
    let k = 0;
    segs.forEach((s) => {
      if (!s.lang) return;
      const t = toks[k++];
      if (t && t.cell && s.w) s.cell = t.cell; // the form's cell (the end review says that very form)
      const noun = t && t.defaulted && [].concat(t.defaulted.gender || [])[0];
      // only a form that changes with the gender ("hakro", not "ba"): the form's key names the gender used
      const dflt = (LX().features.gender || {}).default;
      const dep = noun && t.lex && t.cell && String(LX().inflect(t.lex, t.cell).key || "").split(".").includes(dflt);
      if (dep && t.lex !== noun) s.check = ids.get(noun) || noun;
    });
    // a placeholder that already ends with its mark gets no second one ("… you get more!")
    const last = segs.length - 1;
    if (last > 0 && segs[last].lang == null && /^[.!?]$/.test(segs[last].t) && /[.!?]$/.test(segs[last - 1].t || "")) segs = segs.slice(0, last);
    let en = r.en || "";
    if (row) {
      while (segs.length && segs[segs.length - 1].lang == null && /^[.!?]$/.test(segs[segs.length - 1].t)) segs.pop();
      const i = segs.findIndex((s) => s.lang);
      // lower case (F10), but a name keeps its capital (Nana, Ali)
      const pn = i >= 0 && entry(segs[i].lex) && entry(segs[i].lex).pos === "PN";
      if (i >= 0 && segs[i].lang === "k" && !pn) segs[i] = Object.assign({}, segs[i], { t: segs[i].t.charAt(0).toLowerCase() + segs[i].t.slice(1) });
      en = en.replace(/[.!?]+$/, "");
    }
    return { segs, en, plan: r.clipPlan || [], r, m, ok: r.ok };
  }
  Lang.say = (m, o) => lineOf(sayR(m), m, o);

  /* ---------------- Cook's calls (the old js/cook/lang.js names) ---------------- */
  Lang.word = (id) => Lang.wordLine(id).segs;
  Lang.wordLine = (id) => Lang.say({ fn: "Word", id });
  /** One word in the exact form the order used (the end review's "hakri", SH-02): the engine's word in that cell. */
  Lang.formLine = (id, text, cell) => {
    if (cell && entry(id)) {
      const r = withSay(EN().word(String(id), cell, ctx));
      if (r.ok && (!text || r.text === text)) return lineOf(Object.assign({}, r, { en: entry(id).gloss || String(id) }), { fn: "Word", id });
    }
    const l = Lang.wordLine(id);
    if (!text || !l.ok || text === l.segs.map((s) => s.t).join("")) return l;
    // the form came from an engine line (a word tile keeps its line's segment): the same word in that form
    const e = entry(id);
    const forms = Object.values((e && e.forms) || {}).map((f) => (typeof f === "string" ? f : f && f.t));
    return Object.assign({}, l, { segs: [Object.assign({}, l.segs[0], { t: text })], plan: l.plan.map((c) => Object.assign({}, c, { text })), formOf: forms.includes(text) ? id : null });
  };
  Lang.num = (n) => Lang.say({ fn: "Count", n }).segs;
  /** A number said as you count ("Ba!"): the engine's number word, as a call (capital and mark). */
  Lang.numLine = (n) => {
    const l = Lang.say({ fn: "Count", n });
    const segs = l.segs.map((s, i) => (i === 0 && s.lang === "k" ? Object.assign({}, s, { t: s.t.charAt(0).toUpperCase() + s.t.slice(1) }) : s));
    return Object.assign({}, l, { segs: segs.concat({ t: "!", lang: null }), en: `${l.en}!` });
  };
  /** How many of a thing, as phrase parts (the engine puts them in the language's order). */
  Lang.countParts = (n, id, { one = true } = {}) => (n == null || (n === 1 && !one) ? [id] : [n, id]);
  Lang.phrase = (parts) => Lang.say(itemOf(parts), { row: true });
  /**
   * The same phrase with its count left unsaid (the counting rule, E12: from level 3 the card writes the thing, the
   * count is only heard): the thing in its one-form whatever the count ("bataato" for one potato or three), so the
   * word's form never tells one from many (the leak test, C10), and a plural Mum hasn't given (tomatoes) is never needed.
   */
  Lang.phraseUncounted = (parts) => {
    const m = itemOf(parts);
    if ((m.fn === "Item" || m.fn === "Unit") && m.n != null) delete m.n;
    else if (m.fn === "Join") m.parts = m.parts.filter((p) => p.fn !== "Count");
    return Lang.say(m, { row: true });
  };
  /**
   * A whole line with its counts left unsaid, built again by the engine (LNG-03, E12): from level 3 the number is only
   * heard, so where a line is written (Nani's step line "Kali trae dungri.") it is written "Kali dungri.", a full
   * sentence from the same frame, never a dot placeholder ("Kali ••• dungri."). The noun takes its one-form (the leak
   * test, C10). A line with no count, or one not built from a meaning, comes back as it is.
   */
  const stripCounts = (m) => {
    if (Array.isArray(m)) return m.map(stripCounts);
    if (!m || typeof m !== "object") return m;
    const out = {};
    for (const k of Object.keys(m)) out[k] = k === "fn" ? m[k] : stripCounts(m[k]);
    if ((out.fn === "Item" || out.fn === "Unit") && out.n != null) delete out.n;
    if (out.fn === "Join") out.parts = out.parts.filter((p) => !(p && p.fn === "Count"));
    return out;
  };
  const hasCount = (m) => !!m && typeof m === "object" && (Array.isArray(m) ? m.some(hasCount) : m.fn === "Count" || ((m.fn === "Item" || m.fn === "Unit") && m.n != null) || Object.keys(m).some((k) => k !== "fn" && hasCount(m[k])));
  Lang.uncounted = (line) => {
    if (!line) return line;
    if (line.parts && line.parts.length) return Object.assign(Lang.join(line.parts.map(Lang.uncounted)), line.key ? { key: line.key } : {});
    if (!line.m || !hasCount(line.m)) return line;
    return Object.assign(Lang.say(stripCounts(line.m)), line.key ? { key: line.key } : {});
  };
  /** Cook's frame keys, by role (the meanings are data: data/cook.json `meanings`). */
  Lang.frames = () => ({ first: "need", more: "and", any: "and", seq: "then", seqFirst: "first", no: "no", seq_word: "lnk-nepoi", for: "for" });
  Lang.orderFrame = (i) => (i === 0 ? "need" : "and");
  const meanings = () => (Cook.data && Cook.data.meanings) || {};
  const fill = (t, x) => (t === "$x" ? x : Array.isArray(t) ? t.map((v) => fill(v, x)) : t && typeof t === "object" ? Object.fromEntries(Object.entries(t).map(([k, v]) => [k, fill(v, x)])) : t);
  /** Is there a line for this key (a frame or a fixed line)? */
  Lang.hasLine = (key) => !!(meanings()[key] || entry(`cook.line.${key}`) || entry(`cook.guide.${key}`));
  /** A fixed line said on its own (a phrase entry): Say, or Exclaim / Ask by its own mark. */
  function fixed(id) {
    const e = entry(id);
    const g = String((e && e.gloss) || "");
    return { fn: /!\s*$/.test(g) ? "Exclaim" : /\?\s*$/.test(g) ? "Ask" : "Say", x: e ? e.id : id };
  }
  Lang.fixedOf = fixed;
  /**
   * A line by Cook's key: a frame (data/cook.json `meanings`, its "$x" filled by the phrase's meaning), else a fixed
   * line (the engine's alias cook.line.<key>), else a word said on its own (a stir speed), else the engine's gap.
   */
  Lang.line = (key, phrase) => {
    const t = meanings()[key];
    let m;
    if (t) m = fill(t, phrase && phrase.m ? phrase.m : undefined);
    else if (entry(`cook.line.${key}`)) m = fixed(`cook.line.${key}`);
    else if (entry(key)) return Object.assign(Lang.wordLine(key), { key });
    else m = fixed(`cook.line.${key}`); // the engine's own gap (a to-record placeholder)
    // contract-23 (SH-94): a fixed exclamation said as it is ("Shabash!", "Bas!") is tagged so, never read as an item's name said
    // on a tap (the sound log's one untagged word after a tap); a caller's own role (howto, call ...) still replaces it
    const l = Object.assign(Lang.say(m), { key });
    if (m && m.fn === "Exclaim" && typeof m.x === "string") l.role = "exclaim";
    return l;
  };
  /** Nani's guide box line for a guide key (data/cook.json guide: a line key, else the engine's to-record entry). */
  Lang.guideLine = (key, g) => (g && g.line && Lang.hasLine(g.line) ? Lang.line(g.line) : Object.assign(Lang.say(fixed(`cook.guide.${key}`)), { key }));
  /** A phrase said on its own as the first item of a list: "Chana." */
  Lang.bare = (phrase) => Lang.say({ fn: "Say", x: phrase && phrase.m ? phrase.m : { fn: "Join", parts: [] } });
  /**
   * A spoken list: "Chana. Ne bataato." With {seq: true} the next step is "Ne poi …" and the first "Pela …", so the
   * linker tells you the order matters; things in one group with "Ne …".
   */
  Lang.list = (entries, { seq = false } = {}) => {
    const F = Lang.frames();
    const out = [];
    entries.forEach((e, gi) =>
      [].concat(e).forEach((id, j) => {
        const ph = Lang.phrase([id]);
        out.push(!out.length ? (seq ? Lang.line(F.seqFirst, ph) : Lang.bare(ph)) : Lang.line(seq && j === 0 && gi > 0 ? F.seq : F.any, ph));
      })
    );
    return Lang.join(out);
  };
  /** THE ONE ADAPTER LEFT (see the header): engine-built lines one after the other. */
  Lang.join = (lines) => {
    const segs = [];
    const plan = [];
    lines.forEach((l, i) => {
      if (i) segs.push({ t: " ", lang: null });
      segs.push(...l.segs);
      plan.push(...(l.plan || []));
    });
    // the English (the bulb's): each line a sentence of its own, as the Kutchi is ("Chana. Wiji chad!" -> "Chickpeas. Put it in!")
    const enOf = (l) => {
      const e = String(l.en || "").trim();
      if (!e || lines.length < 2) return e;
      const mark = (/[.!?]$/.exec(Lang.plain(l).trim()) || [""])[0];
      return e.charAt(0).toUpperCase() + e.slice(1) + (mark && !/[.!?]$/.test(e) ? mark : "");
    };
    return { segs, en: lines.map(enOf).filter(Boolean).join(" "), parts: lines, plan, ok: lines.every((l) => l.ok !== false) };
  };
  Lang.plain = (line) => line.segs.map((s) => s.t).join("");
  /**
   * Decision 80: what a line is for, when it is not an order. "howto": Nani's how-to step line ("Chulo bar!", "Bhar!",
   * "Samosa waar!"); "passme": her "pass me" ask and its thank-you. They stay outside the request pop-up (they are not
   * orders), and the contract check (contract-1) reads the role from the sound log. Marks the line and its parts.
   */
  Lang.role = (line, role) => {
    if (line && typeof line === "object") {
      line.role = role;
      (line.parts || []).forEach((p) => Lang.role(p, role));
    }
    return line;
  };
  /** A line as a card row (F10, TXT-07): lower case, no final mark ("dungri na"). */
  Lang.asRow = (line) => {
    const segs = line.segs.slice();
    while (segs.length && segs[segs.length - 1].lang == null && /^[.!?]$/.test(segs[segs.length - 1].t)) segs.pop();
    const i = segs.findIndex((s) => s.lang);
    const pn = i >= 0 && entry(segs[i].lex) && entry(segs[i].lex).pos === "PN";
    if (i >= 0 && segs[i].lang === "k" && !pn) segs[i] = Object.assign({}, segs[i], { t: segs[i].t.charAt(0).toLowerCase() + segs[i].t.slice(1) });
    return Object.assign({}, line, { segs, en: String(line.en || "").replace(/[.!?]+$/, "") });
  };
  /** A label (a button's text): the engine's line as plain text, and whether it is a to-record placeholder. */
  Lang.label = (key) => {
    const l = Lang.line(key);
    return { text: Lang.plain(l).replace(/[.!?]$/, ""), rec: !l.ok, line: l };
  };

  /**
   * HTML for a line. opts.hide: a function (wordId) -> true to hide that word as dots (the mission card, for a word
   * that's well known). Hidden words next to each other share one "•••", so the number of dot groups never tells you
   * a row has a number in it (audit, Wave 4: the Chai tray's rows).
   */
  Lang.html = (line, opts = {}) => {
    // LNG-03: a hidden number is never a dot placeholder: the line is written without it (Lang.uncounted, the engine's
    // own sentence); other hidden words keep their dots
    const isNum = (s) => s && s.w && /^num-/.test(String(s.w));
    if (opts.hide && line && line.segs && line.segs.some((s) => isNum(s) && opts.hide(s.w))) {
      const u = Lang.uncounted(line);
      if (u !== line && !(u.segs || []).some((s) => isNum(s) && opts.hide(s.w))) return Lang.html(u, opts);
    }
    const hidden = (s) => s && s.w && opts.hide && opts.hide(s.w);
    const out = [];
    let dots = false;
    // SH-98 / contract-27 (Zafar, 17 Oct: "if you click light bulb everything should be written in Kutchi"): a dot group keeps
    // the words it stands for in its markup (data-said, never text), so the shared card's peek (js/shared/order-card.js) shows
    // them while it is open and the dots again after
    let run = null;
    const close = () => {
      // (opts.sealed, DAAR-34: words not said yet, the chop's rows she has not called, stay dots even in a peek: no data-said)
      if (run) out[run.at] = `<span class="dots${opts.sealed ? " unsaid" : ""}" title="Tap the speaker to hear it"${opts.sealed ? "" : ` data-said="${esc(run.words.join(" "))}"`}>•••</span>`;
      run = null;
    };
    line.segs.forEach((s, i) => {
      if (s.lang === null) {
        if (dots && /^\s*$/.test(s.t) && hidden(line.segs[i + 1])) return;
        out.push(esc(s.t));
        if (!/^\s*$/.test(s.t)) (dots = false), close();
        return;
      }
      if (hidden(s)) {
        if (!dots) {
          close();
          run = { at: out.length, words: [] };
          out.push("");
        }
        run.words.push(s.t);
        dots = true;
        return;
      }
      dots = false;
      close();
      const flag = s.check && Lang.flagGuesses();
      const cls = [s.w ? "word" : "", s.lang === "e" ? "ph" : "", flag ? "to-check" : ""].filter(Boolean).join(" ");
      const tip = flag ? ` title="To check: ${esc(Cook.english(s.check))}'s gender isn't confirmed (Mum), so this is the he-form"` : "";
      // decision 84: a placeholder (grey italic English) keeps its hidden "to record" tag in the markup (data-rec), so the
      // tools and Mum's list find every one and no checker reads it as English for the child (LNG-03)
      const rec = s.lang === "e" ? " data-rec" : "";
      out.push(cls ? `<span class="${cls}"${tip}${rec}>${esc(s.t)}</span>` : esc(s.t));
    });
    close();
    return out.join("");
  };

  /* ---------------- speaking: the engine's clip plan ---------------- */
  const path = () => (Cook.core && Cook.core.voice && Cook.core.voice.path ? Cook.core.voice.path() : global.NJG_BUILD === "store" ? "store" : "test");
  /**
   * The plan the core voice plays: each piece's family clip; a Kutchi piece with no recording yet is said by the
   * device voice on the test path only (TTS never ships, rule G14); an English placeholder is never spoken (rule E1).
   */
  function planOf(line) {
    return (line.plan || []).map((c) => (c.file ? c : c.lang === "e" ? Object.assign({}, c, { source: "missing" }) : Object.assign({}, c, { source: path() === "test" ? "device" : "missing", text: c.say || c.text })));
  }
  Lang.planOf = planOf;
  /*
   * PAN-04 / SH-94 (17 Oct): ONE speech queue for everything Cook says, in js/core/voice.js (channel "cook", queue: true):
   * a line waits its turn and cuts nothing; a stop (a station's end, a tap through the pop-up) clears it. Three kinds:
   *   "line"   (default) a step, an order, a help line, the order replayed, the chips: queued, said whole, in turn
   *   "item"   an item's name on a tap (Lang.popWord): said only when nothing else is speaking, otherwise not at all
   *   "count"  a number as you tap or turn (opts.over, kept for the old call): queued; a newer count drops an older one still
   *            waiting, and one that waited over COUNT_WAIT_MS is dropped (P10: the late number is not said)
   * Lang.speak(line) resolves when the line has been said (or dropped).
   */
  const COUNT_WAIT_MS = 1500;
  let sayN = 0;
  const note = (what, id, text) => {
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note(what, { step: String(id), by: text });
    } catch (e) {
      /* only a log */
    }
  };
  let quietSince = 0; // when the queue last went quiet (an item's name waits a breath after a line, never in the gap between two)
  /*
   * PAN-16 / contract-22 (Zafar, 17 Oct: "she says everything twice"; "she should say it once ... unless I ... have a massive
   * pause for 10 seconds"): ONE rule for every Cook line, here in the one speech queue. A line said is not said again within
   * AGAIN_MS of the child's time (10 s; Cook's test speed shortens it as it shortens every wait; a how-to line's is the clock's,
   * as the help's is) whoever asks for it: the order read in its pop-up and then by the station, a part of the order read again
   * when it is revealed. It still shows; it is only not voiced: Lang.hasVoice says false, so the caller shows it silently
   * (and Lang.speak itself drops one asked for anyway: it resolves false, Lifecycle say-skip). Said again:
   *   - when the child asked (a tap on a face, a speaker, the bulb, the sidebar's order card or its buttons just before it, and
   *     the lines read on from that tap: a replay's later parts);
   *   - by another person in the same pop-up (two people may ask for the same thing, each on their own card);
   *   - a step's call (role call: the stepper keeps its own rule, maani's Firai on both turns, MAA-15; a call is not counted
   *     as said here either), a word the child tapped to hear (role hear), counts and item names (their own rules);
   *   - when it never began (a stop cleared it while it waited its turn): it was never heard. (One cut short by the child's tap
   *     through the pop-up was heard as far as they wanted: it is not said again.)
   */
  const AGAIN_MS = 10000;
  const ASKED_MS = 700;
  const CHAIN_MS = 1200; // a replay's next part follows its last within this (the read-along's own beats)
  const FREE_ROLES = { call: 1, hear: 1, count: 1, laps: 1, countdown: 1, item: 1 };
  const said = new Map(); // the line's words -> {t, popup, card}
  const normLine = (t) => (String(t || "").toLowerCase().normalize("NFC").match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’-]*/gu) || []).join(" ");
  let tapAt = -1e9;
  let chain = { on: false, end: -1e9 };
  try {
    // the child's own asks: a real tap on a face (a card replayed), a speaker, the bulb, the sidebar's order card or its buttons
    if (global.addEventListener)
      global.addEventListener(
        "pointerdown",
        (ev) => {
          const t = ev && ev.target;
          // (a tap through the pop-up, anywhere but a face, skips it: it asks to hear nothing again)
          const ask = t && t.closest && t.closest("#side button, #mission, #guide, .oc-face, .ic-say, .ng-face, .wp-say, .oc-look, .ng-bulb, #btn-bulb");
          if (ev.isTrusted !== false && ask) tapAt = Date.now();
        },
        true
      );
  } catch (e) {
    /* no page (Node) */
  }
  const popupNow = () => {
    try {
      return (global.Lifecycle && global.Lifecycle.serial && global.Lifecycle.serial()) || 0;
    } catch (e) {
      return 0;
    }
  };
  const cardNow = () => {
    try {
      return (global.document && global.document.querySelector && global.document.querySelector(".njg-rq-open .oc-card.speaking")) || null;
    } catch (e) {
      return null;
    }
  };
  /** Was this line said a moment ago (so it is not said again now)? The reason it may be said, else "said". */
  Lang.saidAgain = (line) => {
    const role = line && line.role;
    if (role && FREE_ROLES[role]) return null;
    const k = normLine(Lang.plain(line));
    if (!k) return null;
    const now = Date.now();
    const V = Cook.core && Cook.core.voice;
    // the lines read on from a tap the child made (a replay's later parts): asked, as its first was
    if (now - tapAt <= ASKED_MS) chain = { on: true, end: now };
    else if (chain.on && !(V && V.busy("cook")) && now - chain.end > CHAIN_MS) chain = { on: false, end: -1e9 };
    if (chain.on) {
      chain.end = Math.max(chain.end, now);
      return null;
    }
    const last = said.get(k);
    if (!last) return null;
    const win = Math.round(role === "howto" ? AGAIN_MS : AGAIN_MS / (Cook.speed || 1)); // (in whole ms: a harness at speed 1e6 has none)
    if (now - last.t >= win) return null;
    // two people in one pop-up, each reading their own card (the read-along marks the card being said: .speaking)
    const pop = popupNow();
    const card = cardNow();
    if (pop && last.popup === pop && card && last.card && card !== last.card) return null;
    return "said";
  };
  Lang.speak = async (line, { over = false, kind = over ? "count" : "line" } = {}) => {
    if (!line) return false;
    const items = planOf(line);
    const V = Cook.core && Cook.core.voice;
    let mine = null;
    if (kind === "line") {
      if (Lang.saidAgain(line)) {
        note("say-skip", "said", Lang.plain(line));
        return false;
      }
      const k = normLine(Lang.plain(line));
      if (k && !(line.role && FREE_ROLES[line.role])) said.set(k, (mine = { t: Date.now(), popup: popupNow(), card: cardNow() }));
      if (mine) mine.k = k;
    }
    // (the help ladder never says again what was said less than 10 s ago: js/shared/guide.js recentlySaid)
    if (kind === "line" && global.NaniGuide && global.NaniGuide.markSaid) global.NaniGuide.markSaid(Lang.plain(line));
    if (V) {
      // the line's turn is logged when its first clip is about to play (a test log, Lifecycle say-start / say-end): the sound log
      // knows a line when it is asked for, the contract checks need to know when it was said
      const turn = ++sayN;
      let started = false;
      const o = {
        channel: "cook",
        queue: true,
        onWord: () => {
          if (!started) (started = true), note("say-start", turn, Lang.plain(line));
        },
      };
      if (kind === "count") Object.assign(o, { key: "count", ttl: COUNT_WAIT_MS });
      if (kind === "item") o.ifIdle = true;
      const r = await V.say({ clipPlan: items }, o);
      if (started) note("say-end", turn, "");
      if (kind !== "item" && !V.busy("cook")) quietSince = Date.now();
      // a line a stop cleared before it began (it waited its turn) was never heard: it may be said again
      if (mine && !started && said.get(mine.k) === mine) said.delete(mine.k);
      if (chain.on) chain.end = Date.now();
      return !(r && r.skipped);
    }
    // no core (it failed to load): the family clips in order
    for (const c of items) if (c.file && Cook.speakFile) await Cook.speakFile(c.file);
    return true;
  };
  /** Say a word (a speaker button, a chip, the end review): queued behind what is being said, never cutting it. */
  Lang.speakWord = (id) => Lang.speak(Lang.role(Lang.wordLine(id), "hear"));
  /**
   * SH-94 (Zafar, 17 Oct: "Mishkaki, Mishkaki, Mishkaki ... it's too much to hear"; one rule for every game): an item's name
   * as it is tapped or lands. Said only when nothing else is speaking or waiting (never over an order, a step or a count),
   * never at levels 3 and 4 (the item is for the child to know), and the same word again only after POP_AGAIN_MS. Resolves
   * false when it was not said.
   */
  const POP_AGAIN_MS = 10000;
  const POP_BREATH_MS = 500;
  const popped = new Map();
  Lang.popWord = (id, { level } = {}) => {
    const lv = level != null ? level : Cook.roundLevel ? Cook.roundLevel() : 1;
    const V = Cook.core && Cook.core.voice;
    const now = Date.now();
    if (lv >= 3 || (V && V.busy("cook")) || now - quietSince < POP_BREATH_MS || now - (popped.get(id) || -1e9) < POP_AGAIN_MS) return Promise.resolve(false);
    popped.set(id, now);
    return Lang.speak(Lang.role(Lang.wordLine(id), "item"), { kind: "item" });
  };
  /** A new station or round: its item words are new again. */
  Lang.popReset = () => popped.clear();
  /** Can any of this line be heard (a family clip; on the test path, a Kutchi stand-in too)? */
  /** Can any of this line be heard (a family clip; on the test path, a Kutchi stand-in too)? Whether or not it was just said. */
  Lang.voiced = (line) => planOf(line).some((c) => c.file || (c.source === "device" && path() === "test"));
  /**
   * Is this line to be voiced now: it can be heard (Lang.voiced) and it was not said a moment ago (PAN-16, Lang.saidAgain)?
   * Every caller that says a line asks this first and, when it is false, shows the line for its reading time without
   * saying it, so a line is said once whoever asks for it (the request pop-up's read-out, then the station's own line).
   */
  Lang.hasVoice = (line) => Lang.voiced(line) && !Lang.saidAgain(line);
  /** Is the whole line one recording? */
  Lang.hasWhole = (line) => {
    const p = planOf(line);
    return p.length === 1 && !!p[0].file;
  };
  Lang.wordHasVoice = (id) => Lang.voiced(Lang.wordLine(id));
  // LNG-09 / LNG-16: the device voice is the core's (js/core/voice.js deviceSpeak): normal speed, waits out a cancel, ends when
  // the browser says so (so the next piece never starts under it)
  Cook.synthSay = (text) => {
    const V = Cook.core && Cook.core.voice;
    return V && V.deviceSpeak ? V.deviceSpeak(text) : Promise.resolve(false);
  };
})(window);
