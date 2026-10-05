/*
 * The language engine (step 4a; engine-design § 6, the API every mode will call). Game code asks for a MEANING;
 * the engine returns the sentence as tokens, display text and segments, the order card's rows and a clip plan,
 * or gaps saying exactly what it can't say yet. It contains no Kutchi and no grammar: both are data
 * (data/lang/, docs/language/engine-spec.md § Data). Not wired to any page yet: js/core/lang/index.js (the seam)
 * still answers every caller; steps 4d and 4e move Cook and the clinic onto this engine.
 *
 *   const Lang = createEngine({ data, audio, voice })   // data: {params, lexicon, paradigms, abstract, concrete, clips}
 *   Lang.say(meaning, ctx) -> Result       Lang.rows(meaning, ctx) -> [Row]     Lang.check(meaning, ctx) -> {ok, gaps}
 *   Lang.word(lexId, cell?, ctx) -> Result Lang.play(result, opts) -> Voice.say  Lang.explain(meaning, ctx) -> trace
 *   await loadEngine({ base, audio })      loads data/lang/*.json (and the recordings) once
 *
 * CTX: { register: "informal"|"polite", addressee: {elder}, speaker: {id, gender}, voice: "mum"|"zafar",
 *        path: "store"|"test", phrases: bool }   (path and phrases default to voice.js's settings)
 *
 * RESULT: { ok, text, en, tokens, segments, rows, clipPlan, drafts, gaps, key, trace }
 *   ok      false when any word, form or rule is missing (gaps of kind lexeme, form, rule); audio and feature gaps
 *           alone keep ok true (a feature gap means Mum's default gender was used, and is always reported)
 *   tokens  {t, lang: "k"|"e", lex, cell, status, src, gap?, defaulted?, placeholder?, punct?}
 *   segments Cook's segment shape ({t, lang: "k"|"e"|null, w?, gap?, draft?}), spaces and punctuation as lang null;
 *           a placeholder is lang "e" with `gap` (shown grey-italic, flagged "to record": rule G2)
 *   drafts  the Kutchi tokens whose form or gender is not confirmed (shown flagged: rule G3, decision 21)
 *   clipPlan [{kind, source, file?, clip?, text, tokens: [first, last]}] (token indexes; segs: [first, last] too)
 */
import { createLinearizer, linearize } from "./linearize.js";
import { buildClipIndex, planClips } from "./clips.js";

const BLOCKING = new Set(["lexeme", "form", "rule"]);
export const DATA_FILES = ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"];

export function createEngine({ data, audio = [], voice = null, path = null, phrases = null } = {}) {
  if (!data) throw new Error("createEngine: no data");
  const L = createLinearizer(data);
  const index = buildClipIndex({ clips: (data.clips && data.clips.clips) || [], audio });
  const functions = L.functions;

  function capitalise(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  /** tokens -> {text, segments} (a sentence: capital and final mark; a row: neither) */
  function render(tokens, { sentence }) {
    const segs = [];
    const tokSeg = [];
    let text = "";
    tokens.forEach((tk, i) => {
      if (tk.mark && !sentence) return tokSeg.push(-1);
      if (tk.punct) {
        segs.push({ t: tk.t, lang: null });
        text += tk.t;
        return tokSeg.push(segs.length - 1);
      }
      if (text) {
        segs.push({ t: " ", lang: null });
        text += " ";
      }
      const seg = { t: tk.t, lang: tk.lang };
      if (tk.lex) seg.w = tk.lex;
      if (tk.gap) seg.gap = tk.gap;
      if (tk.lang === "k" && tk.status !== "confirmed") seg.draft = true;
      segs.push(seg);
      text += tk.t;
      tokSeg.push(segs.length - 1);
    });
    if (sentence) {
      const first = segs.find((s) => s.lang);
      if (first) first.t = capitalise(first.t);
      text = capitalise(text);
    }
    return { text, segments: segs, tokSeg };
  }

  /** The English of a meaning, for the grown-ups' "?" (from abstract `en` templates and glosses). */
  function enOf(v, number) {
    if (v == null) return "";
    if (Array.isArray(v)) return v.map((x) => enOf(x)).join(", ");
    if (typeof v === "number" || typeof v === "string") {
      const c = L.classify(v, typeof v === "number" ? { type: "Num" } : null, {});
      const e = L.lexOf(c.id) || L.byRef.get(String(v));
      if (!e) return v;
      return (number === "pl" && e.glossPl) || e.gloss || e.id;
    }
    const abs = functions[v.fn];
    if (!abs || !abs.en) return v.fn;
    const num = v.number || (v.n != null && Number(v.n) !== 1 ? "pl" : null);
    return abs.en
      .replace(/\{(\w+)\}/g, (_, a) => enOf(v[a], num))
      .replace(/\s+/g, " ")
      .trim();
  }

  function settings(ctx) {
    return {
      path: ctx.path || path || undefined,
      phrases: ctx.phrases != null ? ctx.phrases : phrases != null ? phrases : undefined,
      speaker: ctx.voice || null,
      register: ctx.register || null,
      speakerGender: ctx.speaker && ctx.speaker.gender,
    };
  }

  function say(meaning, ctx = {}, { plan = true } = {}) {
    if (!meaning || !meaning.fn) throw new Error("Lang.say: a meaning needs fn");
    const lin = linearize(L, meaning, ctx);
    const abs = functions[meaning.fn];
    const sentence = !!(abs && abs.cat === "Utt");
    const { text, segments, tokSeg } = render(lin.tokens, { sentence });
    const gaps = lin.gaps.slice();
    let clipPlan = [];
    if (plan) {
      const s = settings(ctx);
      const opts = {};
      for (const k of Object.keys(s)) if (s[k] !== undefined) opts[k] = s[k];
      const p = planClips(lin, index, opts);
      clipPlan = p.plan.map((c) => ({ ...c, segs: [tokSeg[c.tokens[0]], tokSeg[c.tokens[1]]] }));
      gaps.push(...p.gaps);
    }
    const ok = !gaps.some((g) => BLOCKING.has(g.kind));
    return {
      ok,
      text,
      en: enOf(meaning),
      tokens: lin.tokens,
      segments,
      rows: rowsOf(meaning, ctx).map((r) => r.text),
      clipPlan,
      drafts: lin.drafts,
      gaps,
      key: lin.key,
      trace: lin.trace,
    };
  }

  /**
   * The order card's rows (rule F10: the same source and order as the sentence): each value of the meaning's
   * `rows` arguments said on its own, lower case, no full stop. A meaning without `rows` is one row.
   */
  function rowsOf(meaning, ctx = {}) {
    const abs = functions[meaning.fn];
    const names = abs && abs.rows;
    const m = meaning;
    if (!names) {
      const lin = linearize(L, m, ctx);
      const r = render(lin.tokens, { sentence: false });
      return [{ text: r.text.replace(/[.!?]$/, ""), segments: r.segments, tokens: lin.tokens, ok: !lin.gaps.some((g) => BLOCKING.has(g.kind)) }];
    }
    const out = [];
    for (const name of names)
      for (const v of [].concat(m[name] == null ? [] : m[name])) {
        if (typeof v !== "object") {
          const w = word(String(v), null, ctx);
          out.push({ text: w.text, segments: w.segments, tokens: w.tokens, ok: w.ok });
          continue;
        }
        const lin = linearize(L, v, ctx);
        const r = render(lin.tokens, { sentence: false });
        out.push({ text: r.text, segments: r.segments, tokens: lin.tokens, ok: !lin.gaps.some((g) => BLOCKING.has(g.kind)) });
      }
    return out;
  }

  function check(meaning, ctx = {}) {
    const lin = linearize(L, meaning, ctx);
    return { ok: !lin.gaps.some((g) => BLOCKING.has(g.kind)), gaps: lin.gaps };
  }

  /** One word in one cell (default: the word's default cell, one, plain case), with its clip. */
  function word(lexId, cell = null, ctx = {}) {
    const e = L.lexOf(lexId);
    const pos = e && L.posInfo[e.pos];
    let c = cell;
    if (!c) {
      const f = L.lexFeats(lexId);
      const vals = { number: "sg", case: "dir", register: "informal", ...f };
      c = String((pos && pos.defaultCell) || "-").replace(/\{(\w+)\}/g, (_, k) => vals[k] || "*");
    }
    const r = L.inflect(lexId, c);
    const tok = r.gap ? { t: (r.entry && (r.entry.en || r.entry.gloss)) || lexId, lang: "e", lex: lexId, cell: c, status: "to-record", gap: r.gap.kind, placeholder: true } : { t: r.t, lang: "k", lex: r.entry.id, cell: c, status: r.status, src: r.src };
    const lin = { tokens: [tok], nodes: [], gaps: r.gap ? [r.gap] : [] };
    const p = planClips(lin, index, Object.fromEntries(Object.entries(settings(ctx)).filter(([, v]) => v !== undefined)));
    const gaps = lin.gaps.concat(p.gaps);
    return { ok: !r.gap, text: tok.t, tokens: [tok], segments: [{ t: tok.t, lang: tok.lang, w: lexId, ...(tok.gap ? { gap: tok.gap } : {}) }], clipPlan: p.plan.map((x) => ({ ...x, segs: x.tokens })), drafts: tok.lang === "k" && tok.status !== "confirmed" ? [tok] : [], gaps, rows: [tok.t] };
  }

  /** Play a result through the core voice (target-model § 3.2). Never blocks input; resolves when done. */
  function play(result, opts = {}) {
    const v = opts.voice || voice;
    if (!v || typeof v.say !== "function") return Promise.resolve({ done: false, reason: "no voice" });
    return v.say(result, opts);
  }

  const explain = (meaning, ctx = {}) => say(meaning, ctx, { plan: false }).trace;

  return { say, rows: rowsOf, check, word, play, explain, data, index, linearizer: L };
}

/** Load data/lang/*.json (and data/family-audio.json) and make an engine. In Node the paths are repo-relative. */
export async function loadEngine({ base = "data/lang/", audioPath = "data/family-audio.json", voice = null, path = null, phrases = null, load = null } = {}) {
  const loadJSON = load || (await import("../../env.js")).loadJSON;
  const data = {};
  for (const f of DATA_FILES) data[f] = await loadJSON(`${base}${f}.json`);
  const audio = audioPath ? await loadJSON(audioPath) : [];
  return createEngine({ data, audio, voice, path, phrases });
}

export default createEngine;
