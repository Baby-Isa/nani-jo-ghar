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

  Lang.word = (id) => [{ t: Cook.display(id), lang: Cook.isPlaceholder(id) ? "e" : "k", w: id }];
  Lang.num = (n) => [{ t: Cook.numWord(n), lang: "k", w: `num-0${n}` }];
  /** parts: word ids and numbers, e.g. [2, "cook-maani"] */
  Lang.phrase = (parts) => {
    const segs = [];
    const en = [];
    parts.forEach((p, i) => {
      if (i) segs.push({ t: " ", lang: null });
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
  /** A spoken list: "chana. Ne bataato. Ne dahi." */
  Lang.list = (ids) =>
    Lang.join(ids.map((id, i) => (i === 0 ? { segs: Lang.word(id).concat([{ t: ".", lang: Cook.isPlaceholder(id) ? "e" : "k" }]), en: Cook.english(id) + "." } : Lang.line("and", Lang.phrase([id])))));
  Lang.numLine = (n) => ({ segs: Lang.num(n).concat([{ t: "!", lang: "k" }]), en: `${n}!` });
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
