// The small builder the hand files use. A hand entry is knowledge that lives only in prose (grammar-notes.md,
// lexicon.md prose, decisions), so each call names its section in `src` (rule G27: a source on every entry).
// Nothing here knows any Kutchi; the words are in the hand files, the rules in rules.mjs.

const INVARIANT_POS = new Set(["Post", "Link", "Conj", "Adv", "Intj", "Dem", "Q", "Phrase"]);
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);

/** Auto paradigm for a noun or adjective from its ending (the patterns Mum and Zafar confirmed: grammar-notes §4, §40, decision 30). */
export function autoParadigm(pos, lemma, gender, inv) {
  if (!lemma) return undefined;
  if (pos === "N" || pos === "PN") {
    if (/o$/.test(lemma) && gender !== "she") return "noun.o-he";
    if (/i$/.test(lemma) && gender !== "he") return "noun.i-she";
    return "noun.invariant";
  }
  if (pos === "A") {
    if (inv) return "adj.invariant";
    if (/o$/.test(lemma)) return "adj.o";
  }
  return undefined;
}

/**
 * Build the entry function for one importer: w(pos, lemma, gloss, src, opts).
 * opts: id, g (gender: "he" | "she"; omitted = unknown), d (true = draft), tr (true = to record: no Kutchi), f (forms),
 *       n (notes), q (open questions), ask, a (aliases), pl (English plural), say, par (paradigm id, or false for none),
 *       inv (an adjective that never changes), parts ([[lexId, cell?] | ","]), ref/person/number/clusivity/value.
 */
export function builder(S, { source, rank }) {
  return function w(pos, lemma, gloss, src, o = {}) {
    if (pos === "Phrase" && lemma) lemma = lemma.replace(/[.!?]+\s*$/, ""); // the mark belongs to the rule (Say, Exclaim, Ask)
    const e = { pos, gloss, src: arr(src) };
    if (o.id) e.id = o.id;
    if (!e.src.length) throw new Error(`hand entry "${gloss}" has no source`);
    if (o.tr) {
      e.status = "to-record";
    } else {
      e.lemma = lemma;
      e.status = o.d ? "draft" : "confirmed";
    }
    if (pos === "N" || pos === "PN") e.gender = "g" in o ? o.g : null;
    if (o.pl) e.glossPl = o.pl;
    if (!o.tr) {
      const par = o.par === false ? undefined : o.par || (o.f ? undefined : autoParadigm(pos, lemma, e.gender, o.inv));
      if (par) e.paradigm = par;
      else if (o.par !== false && (pos === "N" || pos === "PN") && !o.f) e.paradigm = autoParadigm(pos, lemma, e.gender);
    }
    if (o.f) e.forms = o.f;
    else if (!o.tr && !o.parts && INVARIANT_POS.has(pos)) e.forms = { "-": lemma };
    if (o.parts) {
      e.parts = o.parts.map((p) => (p === "," || p === "." || p === "!" || p === "?" ? { punct: p } : Array.isArray(p) ? (p[1] ? { lex: p[0], cell: p[1] } : { lex: p[0] }) : { lex: p }));
      delete e.lemma;
      delete e.paradigm;
      if (lemma) e.lemmaKey = lemma;
    }
    for (const k of ["ref", "person", "number", "clusivity", "value", "say"]) if (o[k] != null) e[k] = o[k];
    if (o.n) e.notes = arr(o.n);
    if (o.q) e.open = arr(o.q).map((q) => (typeof q === "string" ? { q } : q));
    if (o.ask) e.ask = o.ask;
    if (o.a) e.aliases = arr(o.a);
    if (o.h) e.history = arr(o.h);
    if (o.status) e.status = o.status;
    for (const k of Object.keys(e)) if (e[k] === undefined) delete e[k];
    return S.add(e, { source, rank });
  };
}
