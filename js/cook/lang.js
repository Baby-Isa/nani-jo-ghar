/*
 * Cook with Nani: building, showing and speaking lines.
 *
 * A line is a list of segments: {t: text, lang: "k" | "e", w: wordId?}.
 * "k" is Kutchi (from data/cook.json, never invented); "e" is an English
 * PLACEHOLDER for a word or phrase the family hasn't given us yet, shown
 * in grey italics so it's obvious and easy to swap later.
 *
 * Speaking: consecutive segments of the same language are grouped. A
 * Kutchi group plays its placeholder Gujarati-voice file if there is one,
 * otherwise each word's file in turn; an English group plays its
 * English-voice file if there is one. Files come from build/build_cook_tts.py.
 *
 * No language rules live here: sentence frames are data.lines, and the
 * grammar (number words, where the number goes, how a list and an order
 * are linked) is data.grammar, so another language (Gujarati first) is a
 * data swap. Code only names roles: "need", "and", "no", "only"...
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = (Cook.Lang = {});
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  Cook.isPlaceholder = (id) => !(Cook.data.words[id] || {}).kutchi;
  Cook.display = (id) => {
    const w = Cook.data.words[id];
    return w ? w.kutchi || w.english : id;
  };

  const G = () => (Cook.data && Cook.data.grammar) || {};
  Lang.grammar = G;
  Lang.word = (id) => [{ t: Cook.display(id), lang: Cook.isPlaceholder(id) ? "e" : "k", w: id }];
  Lang.numId = (n) => Cook.numId(n);
  Lang.num = (n) => [{ t: Cook.numWord(n), lang: "k", w: Lang.numId(n) }];
  /**
   * Phrase parts for "n of a thing", in the language's order (grammar.count,
   * e.g. "{n} {x}"). one: false leaves the number out when it's 1 ("chai",
   * not "one chai"), which is how a dish is ordered.
   */
  Lang.countParts = (n, id, { one = true } = {}) => {
    if (n == null || (n === 1 && !one)) return [id];
    const t = G().count || "{n} {x}";
    return t.indexOf("{x}") < t.indexOf("{n}") ? [id, n] : [n, id];
  };
  /** The frame that starts a dish in an order ("I need …") or adds one ("And …"). */
  Lang.orderFrame = (i) => ((G().order || {})[i === 0 ? "first" : "next"] || (i === 0 ? "need" : "and"));
  /** parts: word ids and numbers, e.g. [2, "cook-maani"] */
  Lang.phrase = (parts) => {
    const segs = [];
    const en = [];
    const sep = G().sep != null ? G().sep : " ";
    parts.forEach((p, i) => {
      if (i) segs.push({ t: sep, lang: null });
      if (typeof p === "number") {
        segs.push(...Lang.num(p));
        en.push(String(p));
      } else {
        segs.push(...Lang.word(p));
        en.push(Cook.english(p));
      }
    });
    return { segs, en: en.join(" ") };
  };
  /** A frame from data.lines, with {x} filled by a phrase. */
  Lang.line = (key, phrase) => {
    const f = Cook.data.lines[key];
    const lang = f.k ? "k" : "e";
    const tmpl = f.k || f.e;
    const segs = [];
    const [a, b] = tmpl.split("{x}");
    if (a) segs.push({ t: a, lang });
    if (phrase && b !== undefined) segs.push(...phrase.segs);
    if (b) segs.push({ t: b, lang });
    const enT = f.en || f.e;
    const en = phrase ? enT.replace("{x}", phrase.en) : enT;
    return { segs, en, key };
  };
  Lang.wordLine = (id) => ({ segs: Lang.word(id), en: Cook.english(id) });
  /**
   * Wrap a phrase in a small template with {x} (grammar.list.first "{x}.",
   * grammar.number "{x}!"): the text around it takes the phrase's language.
   */
  const wrap = (tmpl, segs, en, lang) => {
    const [a, b] = String(tmpl || "{x}").split("{x}");
    const out = [];
    if (a) out.push({ t: a, lang });
    out.push(...segs);
    if (b) out.push({ t: b, lang });
    return { segs: out, en: (a || "") + en + (b || "") };
  };
  /** A spoken list: "chana. Ne bataato. Ne dahi." (grammar.list) */
  Lang.list = (ids) => {
    const L = G().list || {};
    return Lang.join(ids.map((id, i) => (i === 0 ? wrap(L.first || "{x}.", Lang.word(id), Cook.english(id), Cook.isPlaceholder(id) ? "e" : "k") : Lang.line(L.next || "and", Lang.phrase([id])))));
  };
  /** A number said on its own as you count ("be!"): grammar.number. */
  Lang.numLine = (n) => wrap(G().number || "{x}!", Lang.num(n), String(n), "k");
  Lang.join = (lines) => {
    const segs = [];
    lines.forEach((l, i) => {
      if (i) segs.push({ t: " ", lang: null });
      segs.push(...l.segs);
    });
    return { segs, en: lines.map((l) => l.en).join(" "), parts: lines };
  };
  Lang.plain = (line) => line.segs.map((s) => s.t).join("");

  /**
   * HTML for a line. opts.hide: a function (wordId) -> true to hide that
   * word as dots (used by the mission card when a word is well known).
   */
  Lang.html = (line, opts = {}) =>
    line.segs
      .map((s) => {
        if (s.lang === null) return esc(s.t);
        if (s.w && opts.hide && opts.hide(s.w)) return `<span class="dots" title="Tap the speaker to hear it">•••</span>`;
        const cls = [s.w ? "word" : "", s.lang === "e" ? "ph" : ""].filter(Boolean).join(" ");
        return cls ? `<span class="${cls}">${esc(s.t)}</span>` : esc(s.t);
      })
      .join("");

  /** Group segments into speakable chunks by language. */
  function groups(line) {
    const out = [];
    line.segs.forEach((s) => {
      if (s.lang === null) {
        if (out.length) out[out.length - 1].t += s.t;
        return;
      }
      const last = out[out.length - 1];
      if (last && last.lang === s.lang) {
        last.t += s.t;
        last.words.push(s.w);
      } else out.push({ t: s.t, lang: s.lang, words: [s.w] });
    });
    return out;
  }
  function fileFor(text, lang) {
    const key = (lang === "e" ? "en|" : "") + Cook.norm(text);
    return Cook.tts[key] ? key : null;
  }
  Lang.hasVoice = (line) => {
    if (fileFor(Lang.plain(line), "k") && line.segs.every((s) => s.lang !== "e")) return true;
    return groups(line).every((g) => fileFor(g.t, g.lang) || (g.lang === "k" && Cook.norm(g.t).split(" ").every((w) => Cook.tts[w])));
  };
  Lang.speak = async (line) => {
    const whole = Lang.plain(line);
    if (line.segs.every((s) => s.lang !== "e") && fileFor(whole, "k")) return Cook.speakKey(fileFor(whole, "k"));
    for (const g of groups(line)) {
      const k = fileFor(g.t, g.lang);
      if (k) await Cook.speakKey(k);
      else if (g.lang === "k") {
        for (const w of Cook.norm(g.t).split(" ")) if (Cook.tts[w]) await Cook.speakKey(w);
      }
      await new Promise((r) => setTimeout(r, 120 / Cook.speed));
    }
    return true;
  };
  Lang.speakWord = (id) => Lang.speak(Lang.wordLine(id));
})(window);
