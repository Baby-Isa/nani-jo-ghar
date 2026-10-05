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
 * A word can carry a `say` field (data.words[id].say) distinct from its
 * on-screen spelling (data.words[id].kutchi), e.g. Zafar's own phonetic
 * spelling for a word written over chat: the voice always reads `say`
 * where it's set, both here (the on-device fallback, saySpelling()) and in
 * build/build_cook_tts.py, never `kutchi`.
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
  /**
   * Gender agreement (the family, 25 Sept: docs/language/grammar-notes.md).
   * A noun has words[id].gender ("he" | "she" | "unknown"); a word with
   * `forms` ({he, she}: "one" hakro/hakri, describing words wadho/wadhi)
   * takes the form for its noun. Unknown gender: the word's own `kutchi`.
   */
  Lang.gender = (id) => {
    const g = (Cook.data.words[id] || {}).gender;
    return g === "he" || g === "she" ? g : null;
  };
  Lang.form = (id, gender) => {
    const w = Cook.data.words[id] || {};
    return (gender && w.kutchi && w.forms && w.forms[gender]) || Cook.display(id);
  };
  Lang.word = (id, gender) => [{ t: Lang.form(id, gender), lang: Cook.isPlaceholder(id) ? "e" : "k", w: id }];
  Lang.numId = (n) => Cook.numId(n);
  Lang.num = (n, gender) => [{ t: Lang.form(Lang.numId(n), gender) || Cook.numWord(n), lang: "k", w: Lang.numId(n) }];
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
  // Sidebar v2 (Zafar, 28 Sept evening): the cards use the short form only ("Muke chai khape.") at every
  // level; the polite "Tu muke chai banai dinda?" (grammar.order.polite) belongs in Conversations
  Lang.orderFrame = (i, level = 1) => {
    const o = G().order || {};
    return o[i === 0 ? "first" : "next"] || (i === 0 ? "need" : "and");
  };
  /** parts: word ids and numbers, e.g. [2, "cook-maani"] */
  Lang.phrase = (parts) => {
    const segs = [];
    const en = [];
    const sep = G().sep != null ? G().sep : " ";
    // the noun a number or describing word goes with: the next noun after it
    // ("ba wadhi maani"); its gender picks their forms
    const nounAfter = (i) => {
      for (let j = i + 1; j < parts.length; j++) if (typeof parts[j] === "string" && (Cook.data.words[parts[j]] || {}).gender) return parts[j];
      return null;
    };
    parts.forEach((p, i) => {
      if (i) segs.push({ t: sep, lang: null });
      const noun = nounAfter(i);
      const g = Lang.gender(noun);
      const add = typeof p === "number" ? Lang.num(p, g) : Lang.word(p, g);
      // decision 21: a form agreeing with a noun whose gender Mum hasn't confirmed is the he-form, a guess:
      // the segment says so (check), and the test site flags it "to check" (never in the store app)
      if (noun && !g && add.some((x) => Lang.hasForms(x.w))) add.forEach((x) => Lang.hasForms(x.w) && (x.check = noun));
      segs.push(...add);
      en.push(typeof p === "number" ? String(p) : Cook.english(p));
    });
    return { segs, en: en.join(" ") };
  };
  /** A frame from data.lines, with {x} filled by a phrase. */
  Lang.line = (key, phrase) => {
    const f = Cook.data.lines[key];
    // data can name a word id instead of a lines key, for a whole line that's
    // just one word said on its own (e.g. a stir speed): the word-stage
    // system then applies to it like any other word (it can fade to dots).
    if (!f && Cook.data.words[key]) {
      const w = Lang.wordLine(key);
      return { segs: w.segs, en: w.en, key };
    }
    const lang = f.k ? "k" : "e";
    const tmpl = f.k || f.e;
    const segs = [];
    const [a, b] = tmpl.split("{x}");
    if (a) segs.push({ t: a, lang });
    if (phrase && b !== undefined) {
      // a line that starts with the word ("Elchi waari chai.") starts with a capital
      const ps = phrase.segs.slice();
      if (!a && ps[0] && ps[0].t && /[.!?]$/.test((b || "").trim())) ps[0] = Object.assign({}, ps[0], { t: ps[0].t.charAt(0).toUpperCase() + ps[0].t.slice(1) });
      segs.push(...ps);
    }
    if (b) segs.push({ t: b, lang });
    const enT = f.en || f.e;
    const en = phrase ? enT.replace("{x}", phrase.en) : enT;
    return { segs, en, key };
  };
  Lang.wordLine = (id) => ({ segs: Lang.word(id), en: Cook.english(id) });
  /** One word in a given form, said on its own (the end review's "hakri", SH-02). */
  Lang.formLine = (id, text) => ({ segs: [{ t: text || Cook.display(id), lang: Cook.isPlaceholder(id) ? "e" : "k", w: id }], en: Cook.english(id) });
  /** Does this word change with its noun's gender (hakro/hakri, wadho/wadhi)? */
  Lang.hasForms = (id) => !!(id && ((Cook.data.words[id] || {}).forms || null));
  /** The "to check" flag shows on the test site only, never in the store app (decision 21). */
  Lang.flagGuesses = () => global.NJG_BUILD !== "store";
  /** A draft word (given by Zafar, not yet confirmed by the family). */
  Lang.isDraft = (id) => !!(Cook.data.words[id] || {}).draft;
  /**
   * The frames an order is said with, as keys in data.lines, all from
   * data.grammar: first (a dish starts the order), more (the next dish),
   * any (the next thing, in any order), seq (the next step of a sequence:
   * "ne poi", a draft), no ("no X"), seq_word (the linker's word id, whose
   * progress decides when the ladder stops drawing the sequence).
   */
  Lang.frames = () => {
    const g = G();
    const o = g.order || {};
    const l = g.list || {};
    // seqFirst: the first step of a sequence ("Pela {x}.", first …, ne poi …), else said bare
    return { first: o.first || "need", more: o.next || "and", any: l.next || "and", seq: g.then || "then", seqFirst: g.then_first || null, no: g.no || "no", seq_word: g.then_word || null, for: g.for || null };
  };
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
  /** A phrase said on its own as the first item of a list: "chana." (grammar.list.first) */
  Lang.bare = (phrase) => {
    const last = [...phrase.segs].reverse().find((s) => s.lang);
    return wrap((G().list || {}).first || "{x}.", phrase.segs, phrase.en, last ? last.lang : "k");
  };
  /**
   * A spoken list: "chana. Ne bataato. Ne dai." (grammar.list). Entries
   * may be ids or any-order groups (arrays of ids). With {seq: true} the
   * next step is joined with grammar.then ("ne poi", and then: a draft), so
   * the linker tells you the order matters; things in one group with "ne".
   */
  Lang.list = (entries, { seq = false } = {}) => {
    const F = Lang.frames();
    const out = [];
    entries.forEach((e, gi) =>
      [].concat(e).forEach((id, j) => {
        const ph = Lang.phrase([id]);
        out.push(!out.length ? (seq && F.seqFirst ? Lang.line(F.seqFirst, ph) : Lang.bare(ph)) : Lang.line(seq && j === 0 && gi > 0 ? F.seq : F.any, ph));
      })
    );
    return Lang.join(out);
  };
  /** A number said on its own as you count ("ba!"): grammar.number. */
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
   * Hidden words next to each other share one "•••" ("ba khun" looks like
   * "dudh"), so the number of dot groups never tells you a row has a
   * number in it (audit, Wave 4: the Chai tray's rows).
   */
  Lang.html = (line, opts = {}) => {
    const hidden = (s) => s && s.w && opts.hide && opts.hide(s.w);
    const out = [];
    let dots = false; // the last thing out was "•••" (only spaces since)
    line.segs.forEach((s, i) => {
      if (s.lang === null) {
        // a space between two hidden words disappears into the one "•••"
        if (dots && /^\s*$/.test(s.t) && hidden(line.segs[i + 1])) return;
        out.push(esc(s.t));
        if (!/^\s*$/.test(s.t)) dots = false;
        return;
      }
      if (hidden(s)) {
        if (!dots) out.push(`<span class="dots" title="Tap the speaker to hear it">•••</span>`);
        dots = true;
        return;
      }
      dots = false;
      const flag = s.check && Lang.flagGuesses();
      const cls = [s.w ? "word" : "", s.lang === "e" ? "ph" : "", flag ? "to-check" : ""].filter(Boolean).join(" ");
      const tip = flag ? ` title="To check: ${esc(Cook.english(s.check))}'s gender isn't confirmed (Mum), so this is the he-form"` : "";
      out.push(cls ? `<span class="${cls}"${tip}>${esc(s.t)}</span>` : esc(s.t));
    });
    return out.join("");
  };

  /** Group segments into speakable chunks by language; `raw` keeps each original seg (frame text or one filled word), for the family voice. */
  function groups(line) {
    const out = [];
    line.segs.forEach((s) => {
      if (s.lang === null) {
        if (out.length) {
          out[out.length - 1].t += s.t;
          out[out.length - 1].raw.push({ t: s.t, w: null });
        }
        return;
      }
      const last = out[out.length - 1];
      if (last && last.lang === s.lang) {
        last.t += s.t;
        last.words.push(s.w);
        last.raw.push({ t: s.t, w: s.w });
      } else out.push({ t: s.t, lang: s.lang, words: [s.w], raw: [{ t: s.t, w: s.w }] });
    });
    return out;
  }
  function fileFor(text, lang) {
    const key = (lang === "e" ? "en|" : "") + Cook.norm(text);
    return Cook.tts[key] ? key : null;
  }
  /**
   * A family recording (js/shared/family-voice.js) for a Kutchi text: tries the text itself,
   * then (for one word) its own `say` spelling too, since the family clip's transcription
   * sometimes matches that instead.
   */
  function famMatch(text, wordId) {
    if (!global.FamilyVoice) return null;
    const say = wordId && (Cook.data.words[wordId] || {}).say;
    return global.FamilyVoice.match(text, say);
  }
  const famFile = (fam) => global.FamilyVoice.url(fam);
  /*
   * Missing placeholder audio. Words added after the last TTS build (the
   * 24-26 Sept family words: dai, chana, gos, bajr ji maani, ne poi, lakri, boga) have no file
   * until build/build_cook_tts.py is run with network. A Kutchi token with
   * no file is read by the browser's own speech voice if it has one
   * (Gujarati or Hindi first), otherwise skipped, as missing lines always
   * were. A line counts as having a voice if any part of it can be heard.
   */
  const synthVoice = () => {
    try {
      const vs = global.speechSynthesis ? global.speechSynthesis.getVoices() : [];
      return vs.find((v) => /^gu/i.test(v.lang)) || vs.find((v) => /^hi/i.test(v.lang)) || vs.find((v) => /^en-IN/i.test(v.lang)) || vs[0] || null;
    } catch (e) {
      return null;
    }
  };
  const synth = (text) =>
    new Promise((resolve) => {
      const v = synthVoice();
      if (!v) return resolve(false);
      let done = false;
      const fin = () => !done && ((done = true), resolve(true));
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.voice = v;
        u.lang = v.lang;
        u.rate = 0.7;
        u.onend = fin;
        u.onerror = fin;
        global.speechSynthesis.speak(u);
      } catch (e) {
        fin();
      }
      setTimeout(fin, (700 + 260 * text.length) / Cook.speed);
    });
  /**
   * A word's own phonetic spelling for the voice (data.words[id].say, e.g.
   * ph-quickly: kutchi "jaldi", say "jal-dee"), when it differs from what's shown on
   * screen. Keyed by the normalised display token so it lines up with the
   * tokens Lang.speak falls back to. Built fresh each time (small, and only
   * used on the rare device-voice fallback path, never on the hot path).
   */
  function saySpelling(token) {
    for (const w of Object.values(Cook.data.words || {})) {
      // a gendered form ("hakri", "wadhi") has its own voice spelling, if any
      const g = w.kutchi && w.forms && Object.keys(w.forms).find((k) => Cook.norm(w.forms[k]) === token && Cook.norm(w.forms[k]) !== Cook.norm(w.kutchi));
      if (g) return (w.say_forms || {})[g] || token;
      if (!w.kutchi || !w.say) continue;
      const kt = Cook.norm(w.kutchi).split(" ");
      const st = String(w.say).split(" ");
      if (kt.length !== st.length) {
        if (Cook.norm(w.kutchi) === token) return w.say;
        continue;
      }
      const i = kt.indexOf(token);
      if (i >= 0) return st[i];
    }
    return token;
  }
  const tokenVoice = (w) => !!Cook.tts[w] || !!famMatch(w) || !!synthVoice();
  Lang.hasVoice = (line) => {
    const purelyK = line.segs.every((s) => s.lang !== "e");
    if (purelyK && (fileFor(Lang.plain(line), "k") || famMatch(Lang.plain(line).trim()))) return true;
    return groups(line).some((g) => {
      if (fileFor(g.t, g.lang)) return true;
      if (g.lang !== "k") return false;
      if (famMatch(g.t.trim())) return true;
      return g.raw.some((part) => {
        const text = part.t.trim();
        if (!text) return false;
        if (famMatch(text, part.w)) return true;
        return Cook.norm(text).split(" ").some(tokenVoice);
      });
    });
  };
  /** Does the whole line have a recording of its own (family clip or TTS file)? Then it's heard whole. */
  Lang.hasWhole = (line) => {
    if (!line || !line.segs.every((s) => s.lang !== "e")) return false;
    // the core's plan (decision 26): heard whole only when it is one clip (a one-word line, or a stand-in file)
    const plan = corePlan(line);
    if (plan) return plan.length === 1 && !!plan[0].file;
    const whole = Lang.plain(line).trim();
    return !!fileFor(whole, "k") || !!famMatch(whole);
  };
  /** Can this word be heard at all? (A word you can't hear is never dotted out.) */
  Lang.wordHasVoice = (id) => {
    const t = Cook.display(id);
    if (Cook.isPlaceholder(id)) return !!fileFor(t, "e");
    return !!fileFor(t, "k") || !!famMatch(t, id) || Cook.norm(t).split(" ").every(tokenVoice);
  };
  /** Speak one chunk of a Kutchi group (a frame's own text, or one filled word): a family
   * recording first, else the placeholder TTS file, else its tokens one by one (a family
   * clip if any, else the TTS token, else the on-device voice, saySpelling()'s pronunciation). */
  async function speakChunk(text, wordId) {
    const fam = famMatch(text, wordId);
    if (fam) return Cook.speakFile(famFile(fam));
    const k = fileFor(text, "k");
    if (k) return Cook.speakKey(k);
    for (const w of Cook.norm(text).split(" ")) {
      if (!w) continue;
      const famW = famMatch(w);
      if (famW) await Cook.speakFile(famFile(famW));
      else if (Cook.tts[w]) await Cook.speakKey(w);
      else await synth(saySpelling(w));
    }
  }
  /** The store app's voice (G14, AUD-02): only OK family clips, through the core's one player (js/core/voice.js). */
  const storeVoice = () => {
    const V = Cook.core && Cook.core.voice;
    return V && V.path && V.path() === "store" ? V : null;
  };
  /*
   * The core's clip plan for a line (js/core/voice.js planClips; js/cook/boot.js hands it over as Cook.voicePlan once
   * the core has loaded), or null without the core (Node tools, a core that failed to load): then Cook's own search
   * below runs, which is the same plan with whole phrases on (R2's voice-parity test).
   */
  function corePlan(line) {
    if (typeof Cook.voicePlan !== "function" || !line || !line.segs) return null;
    try {
      return Cook.voicePlan(line.segs);
    } catch (e) {
      return null;
    }
  }
  Lang.speak = async (line) => {
    // R4: in the store app (or ?voice=store on the test site) every line goes through the core's Voice, which plays
    // OK family clips only
    const SV = storeVoice();
    if (SV) {
      await SV.say({ segments: line.segs }, { channel: "cook" });
      return true;
    }
    // G1 (decision 26, G12): the test path plans through the core too, so whole-phrase clips are off here as well
    // (stitched word by word until the pre-publish pass); Cook's own player plays it (test speed, Web Audio unlock)
    const plan = corePlan(line);
    if (plan) {
      for (const c of plan) {
        if (c.file) await Cook.speakFile(c.file);
        else if (c.source === "device") await synth(saySpelling(Cook.norm(c.text)));
        if (plan.length > 1) await new Promise((r) => setTimeout(r, 120 / Cook.speed));
      }
      return true;
    }
    const whole = Lang.plain(line).trim();
    if (line.segs.every((s) => s.lang !== "e")) {
      const fam = famMatch(whole);
      if (fam) return Cook.speakFile(famFile(fam));
      if (fileFor(whole, "k")) return Cook.speakKey(fileFor(whole, "k"));
    }
    for (const g of groups(line)) {
      const fam = g.lang === "k" ? famMatch(g.t.trim()) : null;
      if (fam) await Cook.speakFile(famFile(fam));
      else {
        const k = fileFor(g.t, g.lang);
        if (k) await Cook.speakKey(k);
        else if (g.lang === "k") {
          for (const part of g.raw) {
            const text = part.t.trim();
            if (text) await speakChunk(text, part.w);
          }
        }
      }
      await new Promise((r) => setTimeout(r, 120 / Cook.speed));
    }
    return true;
  };
  Lang.speakWord = (id) => Lang.speak(Lang.wordLine(id));
})(window);
