// Layer 8: fixed expressions are made of other words (engine-spec: "an entry with parts"). A phrase entry that came in as
// plain text becomes an entry with `parts` when every word of it is already an entry and says exactly that text in some
// cell (so each word is stitched from its own recording and agrees where it must). A phrase with a word the lexicon
// does not have yet stays plain text, and the missing words are listed in the report ("unanalysed phrases").
import { createLinearizer } from "../../js/core/lang/engine/linearize.js";
import { norm } from "./lib.mjs";
import { readJSON } from "./lib.mjs";

const VALUES = { sg: 0, pl: 0 };
const CELL_SETS = {
  N: [["sg", "pl"], ["dir", "obl"]],
  PN: [["sg", "pl"], ["dir", "obl"]],
  A: [["he", "she"], ["sg", "pl"], ["dir", "obl"]],
  Gen: [["he", "she"], ["sg", "pl"], ["dir", "obl"]],
  Num: [["he", "she"]],
  Pron: [["dir", "obl", "dat"]],
  PronPoss: [["poss"], ["he", "she"], ["sg", "pl"], ["dir", "obl"]],
};
const product = (sets) => sets.reduce((acc, set) => acc.flatMap((a) => set.map((v) => (a ? `${a}.${v}` : v))), [""]);

/** every cell of an entry worth trying: its own literal form keys, its paradigm's, and the usual combinations for its part of speech */
function cellsOf(e, S, params) {
  const cells = new Set(["-", "*"]);
  for (const k of Object.keys(e.forms || {})) if (!k.includes("*")) cells.add(k);
  const p = e.paradigm ? S.paradigms[e.paradigm] : null;
  if (p) for (const k of Object.keys(p.cells || {})) if (!k.includes("*")) cells.add(k);
  for (const c of product(CELL_SETS[e.pos] || [])) if (c) cells.add(c);
  if (e.pos === "Pron") for (const c of product(CELL_SETS.PronPoss)) cells.add(c);
  return Array.from(cells);
}

/** An index of every word form the lexicon can say: normalised text -> candidates [{id, cell, pos, status, own}]. */
export function formIndex(S) {
  const params = readJSON("data/lang/params.json");
  const data = { params, lexicon: { entries: Array.from(S.entries.values()) }, paradigms: { paradigms: S.paradigms }, abstract: { functions: S.functions }, concrete: { lin: S.lin }, clips: { clips: [] } };
  const L = createLinearizer(data);
  const index = new Map();
  const put = (t, c) => (index.get(norm(t)) || index.set(norm(t), []).get(norm(t))).push(c);
  for (const e of S.entries.values()) {
    if (e.status === "to-record") continue;
    if (e.pos === "Phrase" && /\s|[,.;!?]/.test((e.lemma || "").trim())) continue; // a multi-word phrase is matched as a span
    for (const cell of cellsOf(e, S, params)) {
      const r = L.inflect(e.id, cell);
      if (r && !r.gap && r.t && !/\s/.test(norm(r.t))) put(r.t, { id: e.id, cell, pos: e.pos, status: r.status, own: norm(e.lemma || "") === norm(r.t) });
    }
  }
  const rankOf = (c) => (c.own ? 0 : 1) * 10 + (c.cell === "-" || c.cell === "*" ? 0 : 1) + (c.status === "confirmed" ? 0 : 5);
  const pick = (t) => {
    const cands = index.get(norm(t));
    if (!cands || !cands.length) return null;
    return cands.slice().sort((a, b) => rankOf(a) - rankOf(b))[0];
  };
  return { L, index, pick };
}

export function phrasify(S) {
  const { pick } = formIndex(S);
  const stat = { analysed: 0, plain: 0, single: 0, unresolved: new Map() };
  const multi = new Map(); // norm(text) -> id of a multi-word phrase entry
  for (const e of S.entries.values()) if (e.pos === "Phrase" && e.lemma && e.status !== "to-record" && norm(e.lemma).includes(" ")) multi.set(norm(e.lemma), e.id);
  for (const e of S.entries.values()) {
    if (e.pos !== "Phrase" || e.parts || !e.lemma || e.status === "to-record") continue;
    const raw = e.lemma.match(/[^\s,.;!?]+|[,.;!?]/g) || [];
    if (raw.filter((x) => !/^[,.;!?]$/.test(x)).length < 2) {
      stat.single++; // one word: it is its own entry, nothing to take apart
      continue;
    }
    const parts = [];
    const missing = [];
    for (let i = 0; i < raw.length; i++) {
      const tok = raw[i];
      if (/^[,.;!?]$/.test(tok)) {
        parts.push({ punct: tok });
        continue;
      }
      // a shorter set phrase inside this one (ne poi, thank you, wich me): longest span first, never the phrase itself
      let spanned = false;
      for (const len of [3, 2]) {
        const span = raw.slice(i, i + len);
        if (span.length < len || span.some((x) => /^[,.;!?]$/.test(x))) continue;
        const id = multi.get(norm(span.join(" ")));
        if (id && id !== e.id && norm(span.join(" ")) !== norm(e.lemma)) {
          parts.push({ lex: id });
          i += len - 1;
          spanned = true;
          break;
        }
      }
      if (spanned) continue;
      const c = pick(tok);
      if (!c || c.id === e.id) {
        missing.push(tok);
        continue;
      }
      parts.push({ lex: c.id, cell: c.cell });
    }
    if (missing.length) {
      stat.plain++;
      for (const m of missing) (stat.unresolved.get(norm(m)) || stat.unresolved.set(norm(m), []).get(norm(m))).push(e.id);
      e.notes = [...(e.notes || []).filter((n) => !/^not analysed/.test(n)), `not analysed into words yet: ${Array.from(new Set(missing)).join(", ")} ${new Set(missing).size > 1 ? "are" : "is"} not in the lexicon (build/lang/phrases.mjs)`];
      continue;
    }
    // keep the phrase's own text as its lemma (an engine entry with parts still names what it says, for the dictionary)
    e.parts = parts;
    delete e.forms;
    stat.analysed++;
  }
  return stat;
}
