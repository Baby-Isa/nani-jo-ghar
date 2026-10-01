/*
 * The language seam (target-model § 3.1; engine-design § 6): the calls every mode will make for words and
 * sentences. Until step 4 builds the real engine, this is an ADAPTER over today's proto-engine,
 * js/cook/lang.js + js/cook/order.js + data/cook.json (`lines`, `grammar`, `words`), which it calls unchanged.
 * Step 4 replaces the inside; callers keep these calls. No Kutchi and no grammar are written here: frames,
 * words and word forms all come from the data through Cook's code. What the adapter can't say comes back as
 * a gap (ok: false) with the honest grey-italic English placeholder, never a guess.
 *
 *   const Lang = createLang({ cook: window.Cook, index, voice })   // index: voice.js clipIndex; voice: createVoice()
 *   Lang.say(meaning, ctx) -> Result      Lang.rows(meaning, ctx)    Lang.check(meaning, ctx) -> {ok, gaps}
 *   Lang.word(id) -> Result               Lang.play(result, opts) -> Voice.say(result, opts)
 *   Lang.explain(meaning) -> trace        Lang.load(base)            Lang.GAPS (what the adapter can't express)
 *   Lang.gapLog                            every gap met so far (the sandbox collects these for Mum's list)
 *
 * MEANINGS the adapter understands (the names follow engine-design § 14's table):
 *   { fn: "Item", kind, n?, mods?: [ids], one? }   a noun phrase: "ba wadhi maani" (mods = describing words)
 *   { fn: "Item", parts: [...] }                   today's phrase parts as they are (adapter only)
 *   { fn: <Frame>, x?: Item }   Need, Fetch, Also, Without, Only, First, Then, MixedIn, NeedMixedIn, InChai,
 *                               For, ForWho, Now, StirNow, Lift, Leave, Request, Times, With, AndJoin, Bare
 *   { fn: "Phrase", id }        a fixed line ("thanks", "welldone") or a word said on its own
 *   { fn: "Word", id }          one word (a chip, the end review)
 *   { fn: "Count", n }          a number said as you count ("ba!")
 *   { fn: "List", items: [id | [ids]], seq? }      a spoken list ("Pela chana. Ne poi bataato.")
 *   { fn: "Order", ladders, withWhen?, heads? }    a whole order as Cook builds it today (js/cook/order.js ladders)
 *   { fn: "Section", ladder, key }                 one section said on its own (Nani's tadka order)
 *   { fn: "Join", parts: [meaning...] }            several lines one after the other
 *
 * RESULT (engine-design § 6.1): { ok, text, en, segments, tokens, rows, clipPlan, drafts, gaps, line }
 *   segments are today's Cook segments ({t, lang: "k"|"e"|null, w?}); `line` is today's {segs, en} object,
 *   so Cook's callers can keep drawing and speaking it while they move (step 4d).
 */
import { planClips, voicePath } from "../voice.js";

/** Meaning -> the role it plays in today's frames. A role is resolved through data.grammar first, then data.lines. */
export const FRAME_ROLES = {
  Need: { grammar: ["order", "first"], key: "need" },
  Also: { grammar: ["order", "next"], key: "and" },
  Fetch: { key: "give" },
  Without: { grammar: ["no"], key: "no" },
  Only: { key: "only" },
  First: { grammar: ["then_first"], key: "first" },
  Then: { grammar: ["then"], key: "then" },
  MixedIn: { key: "waari" },
  NeedMixedIn: { key: "need_waari" },
  InChai: { key: "sugar" },
  For: { grammar: ["for"], key: "for" },
  ForWho: { key: "forwho" },
  Now: { key: "now" },
  StirNow: { key: "stir-now" }, // the stir station's own copy of "Hane {x}!" (data/stations/stir.json)
  Lift: { key: "lift" },
  Leave: { key: "leave" },
  Request: { grammar: ["order", "polite"], key: "canyou" },
  Times: { key: "times" },
  With: { key: "with" },
  AndJoin: { key: "and_join" },
};

/** What the adapter can't express (the step-4 list). Each: id, what, why, who fixes it. */
export const GAPS = [
  { id: "order-tree", what: "A whole order is passed as Cook's ladder objects (fn Order/Section), not as a meaning tree (Need with `with`/`without` lists).", fix: "step 4 (Need/Order trees; engine-design § 13)" },
  { id: "WithFood", kind: "rule", what: "\"with\" joining an extra to an order (\"Muke ba samosa khape, with ...\") is an English placeholder (lines.with).", fix: "Mum (Q5; L17, L22, L23, L27)" },
  { id: "AndKinds", kind: "rule", what: "\"and\" before a second kind of the same dish (lines.and_join) is an English placeholder.", fix: "Mum (Q5 4; L16, L23, L26)" },
  { id: "Times", kind: "rule", what: "\"{x} times\" (lines.times) has no Kutchi.", fix: "Mum" },
  { id: "headline", kind: "rule", what: "Card headlines without a line (the pantry's \"bring me these for {dish}\", the daar card's \"Chop these\") are English, flagged to record.", fix: "Mum (N2)" },
  { id: "gender-default", kind: "feature", what: "A describing word or \"one\" next to a noun of unknown gender takes the word's own spelling (today's code), not an explicit he-form flagged \"to check\" (decision 21).", fix: "step 4 (Lang marks it); Mum for each noun" },
  { id: "register", what: "No speaker/addressee agreement (tu / aai by age, G6) and no polite register beyond picking the `canyou` frame by name.", fix: "step 4 (ctx.speaker, ctx.addressee, ctx.register)" },
  { id: "verbs", what: "Steps and commands are frames with a slot (Pela {x}., Hane {x}!, {x} hane kadh.), not verbs with forms; fragments without a verb (PAN-02) stay fragments.", fix: "step 4 (Steps, Imp; L55, L56, L59, L60)" },
  { id: "clinic", what: "The clinic's words, numbers and joins (pela / ne poi, wadho / nindho, number words in four files) are in its own code and data, which this adapter does not read; R5 must route them through the seam as data, or they come back as gaps.", fix: "R5 (as data), step 4" },
  { id: "word-timing", kind: "audio", what: "Inside a whole-phrase recording the read-along can only underline the whole span (no word timestamps yet).", fix: "step 4c (engine-design § 9)" },
  { id: "lexicon", what: "Words come from data/cook.json (+ station files) only; there is no single lexicon or engine word ids (n.samosa); Cook ids are used as they are.", fix: "step 4 (data/lang/lexicon.json, ids kept as aliases)" },
];

/** Today's phrase parts -> an Item meaning ({n, mods, kind}); numbers first, the last word is the kind. */
export function itemFromParts(parts) {
  const ps = [].concat(parts || []);
  const words = ps.filter((p) => typeof p === "string");
  const nums = ps.filter((p) => typeof p === "number");
  if (nums.length > 1 || (nums.length && ps[0] !== nums[0]) || !words.length) return { fn: "Item", parts: ps };
  const it = { fn: "Item", kind: words[words.length - 1] };
  if (nums.length) it.n = nums[0];
  if (words.length > 1) it.mods = words.slice(0, -1);
  return it;
}

export function createLang({ cook, index = null, voice = null, path = null } = {}) {
  const C = () => cook || globalThis.Cook;
  const L = () => C().Lang;
  const O = () => C().Order;
  const data = () => C().data || {};
  const gapLog = [];
  const thePath = () => path || voicePath();

  /** A role's frame key: data.grammar first (another language can rename frames there), then the default key. */
  function frameKey(fn) {
    const role = FRAME_ROLES[fn];
    if (!role) return null;
    let k = null;
    if (role.grammar) {
      let g = data().grammar || {};
      for (const p of role.grammar) g = g && typeof g === "object" ? g[p] : undefined;
      if (typeof g === "string") k = g;
    }
    return k && (data().lines || {})[k] ? k : role.key;
  }

  /** Item -> today's phrase parts ([2, "ph-big", "cook-maani"]). */
  function itemParts(it) {
    if (!it) return [];
    if (Array.isArray(it)) return it;
    if (typeof it === "string") return [it];
    if (it.parts) return it.parts.slice();
    const head = (it.mods || []).concat([it.kind]);
    const counted = L().countParts(it.n == null ? null : it.n, "\u0000", { one: it.one !== false });
    return counted.flatMap((p) => (p === "\u0000" ? head : [p]));
  }

  /** today's line object for a meaning, plus the frame keys used */
  function build(m, keys) {
    if (!m) throw new Error("Lang.say: no meaning");
    const Lg = L();
    switch (m.fn) {
      case "Item":
        return Lg.phrase(itemParts(m));
      case "Phrase":
        keys.push(m.id);
        if (!(data().lines || {})[m.id] && !(data().words || {})[m.id]) throw Object.assign(new Error(`no line ${m.id}`), { gap: { kind: "rule", id: m.id, what: `no line "${m.id}"` } });
        return Lg.line(m.id);
      case "Word":
        return Lg.wordLine(m.id);
      case "Count":
        return Lg.numLine(m.n);
      case "Bare":
        return Lg.bare(Lg.phrase(itemParts(m.x)));
      case "List":
        return Lg.list(m.items, { seq: !!m.seq });
      case "Order":
        return O().speech(m.ladders, { withWhen: !!m.withWhen, heads: m.heads !== false });
      case "Section":
        return O().sectionSpeech(m.ladder, m.key);
      case "Join":
        return Lg.join(m.parts.map((p) => build(p, keys)));
      default: {
        const k = frameKey(m.fn);
        if (!k || !(data().lines || {})[k]) throw Object.assign(new Error(`no frame for ${m.fn}`), { gap: { kind: "rule", id: m.fn, what: `no frame for ${m.fn}` } });
        keys.push(k);
        return Lg.line(k, m.x != null ? Lg.phrase(itemParts(m.x)) : undefined);
      }
    }
  }

  // which English-only frame an English segment came from (by its fixed text), for the gap's id
  function englishFrameOf(t) {
    const s = String(t || "").trim().toLowerCase();
    if (!s) return null;
    for (const [k, f] of Object.entries(data().lines || {})) {
      if (f.k || !f.e) continue;
      const fixed = f.e.split("{x}").map((x) => x.trim().toLowerCase()).filter(Boolean);
      if (fixed.some((x) => x === s || s.startsWith(x))) return k;
    }
    return null;
  }

  function collectKeys(line, out) {
    if (!line) return out;
    if (line.key) out.push(line.key);
    (line.parts || []).forEach((p) => collectKeys(p, out));
    return out;
  }

  function result(m, line, keys, ctx = {}) {
    const Lg = L();
    const words = data().words || {};
    const lines = data().lines || {};
    const segments = line.segs.map((s) => Object.assign({}, s));
    const gaps = [];
    const drafts = [];
    const tokens = [];
    segments.forEach((s, i) => {
      if (!s.lang) return;
      const w = s.w ? words[s.w] : null;
      const status = s.lang === "e" ? "placeholder" : w && w.draft ? "draft" : "confirmed";
      tokens.push({ t: s.t, lex: s.w || null, seg: i, lang: s.lang, status });
      if (status === "draft") drafts.push({ lex: s.w, t: s.t, seg: i });
      if (s.lang === "e") {
        if (s.w && !(w && w.kutchi)) gaps.push({ kind: "lexeme", lex: s.w, what: (w && w.english) || s.t, seg: i });
        else {
          const k = englishFrameOf(s.t);
          gaps.push({ kind: "rule", id: k === "with" ? "WithFood" : k === "and_join" ? "AndKinds" : k === "times" ? "Times" : k || "headline", frame: k, what: s.t.trim(), seg: i });
        }
      }
      // a describing word or "one" agreeing with a noun whose gender is unknown: today's code uses its own spelling
      if (s.w && w && w.forms && s.lang === "k") {
        const noun = segments.slice(i + 1).find((x) => x.w && words[x.w] && !words[x.w].forms && !/^num-/.test(x.w) && !/^ph-/.test(x.w));
        if (noun && !Lg.gender(noun.w)) gaps.push({ kind: "feature", lex: noun.w, feature: "gender", defaulted: s.t, seg: i });
      }
    });
    const usedKeys = Array.from(new Set(keys.concat(collectKeys(line, []))));
    usedKeys.forEach((k) => lines[k] && lines[k].draft && drafts.push({ frame: k }));
    let rows = [];
    if (m.fn === "Order") rows = [].concat(...m.ladders.map((Ld) => O().rows(Ld, { all: !!m.withWhen }))).map((r) => ({ text: Lg.plain(r.line), segments: r.line.segs, head: !!r.head, no: !!r.no, ids: r.ids || [] }));
    else if (m.fn === "Item") rows = [{ text: Lg.plain(line), segments: line.segs, ids: itemParts(m).filter((p) => typeof p === "string") }];
    const sayOf = (id) => (id && words[id] && words[id].say) || null;
    const clipPlan = index ? planClips(segments, index, { path: ctx.path || thePath(), sayOf }) : [];
    clipPlan.forEach((c) => (c.source === "missing" || c.source === "device") && c.lang !== "e" && gaps.push({ kind: "audio", what: c.text, tokens: c.tokens }));
    const ok = !gaps.some((g) => g.kind === "rule" || g.kind === "lexeme");
    gaps.forEach((g) => gapLog.push(Object.assign({ meaning: m.fn }, g)));
    return { ok, text: Lg.plain(line), en: line.en, segments, tokens, rows, clipPlan, drafts, gaps, line, frames: usedKeys };
  }

  const Lang = {
    GAPS,
    gapLog,
    FRAME_ROLES,
    itemParts,
    say(meaning, ctx = {}) {
      const keys = [];
      try {
        return result(meaning, build(meaning, keys), keys, ctx);
      } catch (e) {
        if (!e.gap) throw e;
        gapLog.push(Object.assign({ meaning: meaning.fn }, e.gap));
        return { ok: false, text: "", en: "", segments: [], tokens: [], rows: [], clipPlan: [], drafts: [], gaps: [e.gap], line: { segs: [], en: "" } };
      }
    },
    rows: (meaning, ctx) => Lang.say(meaning, ctx).rows,
    check(meaning, ctx) {
      const r = Lang.say(meaning, ctx);
      return { ok: r.ok, gaps: r.gaps };
    },
    word: (id, ctx) => Lang.say({ fn: "Word", id }, ctx),
    play(result, opts) {
      if (!voice) return Promise.resolve({ done: false });
      return voice.say(result, opts);
    },
    explain(meaning) {
      const keys = [];
      const line = build(meaning, keys);
      return { meaning, engine: "adapter over js/cook/lang.js + js/cook/order.js", frames: Array.from(new Set(keys.concat(collectKeys(line, [])))), parts: meaning.fn === "Item" ? itemParts(meaning) : meaning.x ? itemParts(meaning.x) : null, text: L().plain(line) };
    },
    async load() {
      // Cook's own data is loaded by Cook.load(); the recordings index is built by the caller (voice.js clipIndex)
      return Lang;
    },
  };
  return Lang;
}

export default createLang;
