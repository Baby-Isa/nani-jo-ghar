// Shared helpers for the step-4b importers (decision 40, rule G27). The importers read the repo's sources and
// build ONE store of Kutchi knowledge, which import_all.mjs writes to data/lang/. Nothing here knows any Kutchi.
//
// The store merges "claims": each importer adds entries with a source and a rank (how much that source is worth:
// Mum / Zafar > a game's data file > the class handout). Where two sources disagree (the spelling, the gender or
// the status of one word) the higher rank is used, the lower one is kept as an OPEN QUESTION on the entry, and
// the clash goes on the clash list (data/lang/reports/clash-list.md). Never a silent choice (non-negotiable 4).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const readJSON = (p) => JSON.parse(readFileSync(p.startsWith("/") ? p : ROOT + p, "utf8"));
export const readText = (p) => readFileSync(p.startsWith("/") ? p : ROOT + p, "utf8");
export function writeJSON(p, obj, indent = 1) {
  const f = p.startsWith("/") ? p : ROOT + p;
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify(obj, null, indent) + "\n");
}
export function writeText(p, text) {
  const f = p.startsWith("/") ? p : ROOT + p;
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, text);
}
export const exists = (p) => existsSync(p.startsWith("/") ? p : ROOT + p);

/** The same normalisation voice.js uses for matching a recording to text: lower case, no punctuation, one space. */
export const norm = (s) =>
  String(s == null ? "" : s)
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/** an id-safe slug */
export const slug = (s) =>
  norm(s)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

/** How much each kind of source is worth when two disagree (higher wins). */
export const RANK = { mum: 5, zafar: 5, hand: 4, lexicon: 4, game: 2, conversation: 2, story: 2, handout: 1, modes: 0, audio: 3 };

const STATUS_RANK = { confirmed: 0, draft: 1, "to-record": 2 };
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const uniq = (a) => Array.from(new Set(a));

export class Store {
  constructor() {
    this.entries = new Map();
    this.paradigms = {};
    this.functions = {};
    this.lin = {};
    this.clips = [];
    this.claims = new Map(); // id -> [{field, value, source, rank}]
    this.resolutions = new Map(); // "id|field" -> {chosen, why, src}
    this.errors = [];
    this.byLemma = new Map(); // norm(lemma) -> [id]
    this.counts = {}; // source -> number of entries touched
    this.formOrigin = new Map(); // "id|cell" -> {source, rank}
  }

  /** Register a decision that settles a clash (cited), so it becomes a history row instead of an open question. */
  resolve(id, field, chosen, why, src) {
    this.resolutions.set(`${id}|${field}`, { chosen, why, src });
  }

  has(id) {
    return this.entries.has(id) || !!this.find(id);
  }
  find(idOrAlias) {
    if (this.entries.has(idOrAlias)) return this.entries.get(idOrAlias);
    for (const e of this.entries.values()) if ((e.aliases || []).includes(idOrAlias)) return e;
    return null;
  }

  claim(id, field, value, source, rank) {
    if (value == null || value === "") return;
    (this.claims.get(id) || this.claims.set(id, []).get(id)).push({ field, value, source, rank });
  }

  /**
   * Add or merge one lexicon entry. `source` names the importer ("cook.json words"), `rank` is RANK[...]. Fields:
   * the usual entry fields; `src` (string or list) is required and is kept as the entry's sources.
   */
  add(spec, { source, rank }) {
    const e0 = { ...spec };
    const id = e0.id;
    if (!id) throw new Error("add: an entry needs an id: " + JSON.stringify(spec).slice(0, 100));
    this.counts[source] = (this.counts[source] || 0) + 1;
    let e = this.entries.get(id);
    if (!e) {
      e = { id, pos: e0.pos };
      this.entries.set(id, e);
    } else if (e0.pos && e.pos !== e0.pos) {
      this.errors.push(`${id}: part of speech ${e.pos} (earlier) vs ${e0.pos} (${source})`);
    }
    // claims on the contested fields
    this.claim(id, "lemma", e0.lemma, source, rank);
    if ("gender" in e0 && e0.gender) this.claim(id, "gender", e0.gender, source, rank);
    if (e0.status) this.claim(id, "status", e0.status, source, rank);
    // plain fields: first writer wins for descriptive text; lists are unioned
    for (const k of ["gloss", "glossPl", "paradigm", "en", "say", "ref", "person", "number", "clusivity", "value", "lemma"]) {
      if (e0[k] != null && e[k] == null) e[k] = e0[k];
    }
    if ("gender" in e0 && !("gender" in e)) e.gender = e0.gender;
    else if (e0.gender && !e.gender) e.gender = e0.gender;
    if (e0.pos && !e.pos) e.pos = e0.pos;
    if (e0.status) e.status = e.status ? (STATUS_RANK[e0.status] > STATUS_RANK[e.status] ? e0.status : e.status) : e0.status;
    e.src = uniq([...arr(e.src), ...arr(e0.src)]);
    for (const k of ["aliases", "notes"]) if (e0[k]) e[k] = uniq([...(e[k] || []), ...arr(e0[k])]);
    if (e0.open) e.open = [...(e.open || []), ...arr(e0.open).filter((q) => !(e.open || []).some((x) => x.q === q.q))];
    if (e0.history) e.history = [...(e.history || []), ...arr(e0.history)];
    if (e0.parts && !e.parts) e.parts = e0.parts;
    if (e0.ask) {
      e.ask = e.ask || {};
      for (const k of Object.keys(e0.ask)) e.ask[k] = uniq([...(e.ask[k] || []), ...arr(e0.ask[k])]);
    }
    if (e0.forms) {
      e.forms = e.forms || {};
      for (const k of Object.keys(e0.forms)) {
        const nv = e0.forms[k];
        const nt = typeof nv === "string" ? nv : nv && nv.t;
        if (!(k in e.forms)) {
          e.forms[k] = nv;
          this.formOrigin.set(`${id}|${k}`, { source, rank });
        } else {
          const ov = e.forms[k];
          const ot = typeof ov === "string" ? ov : ov && ov.t;
          if (nt && ot && norm(nt) !== norm(ot)) {
            const o = this.formOrigin.get(`${id}|${k}`) || { source: "(earlier)", rank: RANK.hand };
            this.claim(id, `form:${k}`, ot, o.source, o.rank);
            this.claim(id, `form:${k}`, nt, source, rank);
          }
        }
      }
    }
    if (e0.lemma) {
      const n = norm(e0.lemma);
      const l = this.byLemma.get(n) || this.byLemma.set(n, []).get(n);
      if (!l.includes(id)) l.push(id);
    }
    return e;
  }

  /** Add a note, open question, history row or alias to an existing entry (by id or alias). */
  patch(idOrAlias, bits, { source, rank = RANK.hand } = {}) {
    const e = this.find(idOrAlias);
    if (!e) {
      this.errors.push(`patch: no entry "${idOrAlias}" (${source})`);
      return null;
    }
    return this.add({ ...bits, id: e.id, pos: e.pos }, { source, rank });
  }

  /**
   * Settle every contested field. Returns the clash list: [{id, field, chosen, others: [{value, source}], resolved}].
   * Lemma: the highest-ranked source wins. Gender: the same. Status: the WORST wins (conservative: G3).
   */
  settle() {
    const clashes = [];
    for (const [id, cl] of this.claims) {
      const e = this.entries.get(id);
      if (!e) continue;
      const byField = new Map();
      for (const c of cl) (byField.get(c.field) || byField.set(c.field, []).get(c.field)).push(c);
      for (const [field, cs] of byField) {
        const distinct = new Map();
        for (const c of cs) {
          const k = field === "status" ? c.value : norm(c.value);
          const d = distinct.get(k) || distinct.set(k, { value: c.value, sources: [], rank: -1 }).get(k);
          d.sources.push(c.source);
          d.rank = Math.max(d.rank, c.rank);
        }
        if (distinct.size < 2) continue;
        const vals = Array.from(distinct.values());
        let chosen;
        if (field === "status") chosen = vals.sort((a, b) => STATUS_RANK[b.value] - STATUS_RANK[a.value])[0];
        else chosen = vals.sort((a, b) => b.rank - a.rank)[0];
        const res = this.resolutions.get(`${id}|${field}`);
        if (res) chosen = vals.find((v) => norm(v.value) === norm(res.chosen)) || chosen;
        if (field === "lemma") e.lemma = chosen.value;
        else if (field === "gender") e.gender = chosen.value;
        else if (field === "status") e.status = chosen.value;
        else if (field.startsWith("form:") && e.forms) {
          const key = field.slice(5);
          const o = e.forms[key];
          if (typeof o === "string") e.forms[key] = chosen.value;
          else if (o && o.t) o.t = chosen.value;
        }
        const others = vals.filter((v) => v !== chosen).map((v) => ({ value: v.value, source: uniq(v.sources).join("; ") }));
        const rec = { id, gloss: e.gloss || "", field, chosen: chosen.value, chosenSource: uniq(chosen.sources).join("; "), others, resolved: res || null };
        clashes.push(rec);
        if (res) {
          e.history = [...(e.history || []), { date: res.date || "2026-10-05", change: `${field}: ${res.why}`, src: res.src }];
        } else {
          const q = `Sources disagree on the ${field.replace("form:", "form ")}: ${vals.map((v) => `"${v.value}" (${uniq(v.sources).join("; ")})`).join(" vs ")}. Using "${chosen.value}" for now.`;
          e.open = [...(e.open || []), { q, src: "step 4b importers (clash list)" }];
        }
      }
    }
    return clashes;
  }

  /** The lexicon in a stable order: by part of speech, then id. */
  lexicon() {
    const order = ["Pron", "Dem", "Q", "Num", "N", "PN", "A", "Gen", "V", "Cop", "Post", "Link", "Conj", "Adv", "Intj", "Phrase"];
    const list = Array.from(this.entries.values());
    list.sort((a, b) => order.indexOf(a.pos) - order.indexOf(b.pos) || a.id.localeCompare(b.id));
    return list.map((e) => {
      const o = {};
      const keys = ["id", "pos", "gender", "ref", "person", "number", "clusivity", "value", "paradigm", "lemma", "say", "gloss", "glossPl", "forms", "parts", "status", "src", "aliases", "ask", "notes", "open", "history"];
      for (const k of keys) if (e[k] !== undefined && !(Array.isArray(e[k]) && !e[k].length)) o[k] = e[k];
      for (const k of Object.keys(e)) if (!(k in o) && e[k] !== undefined) o[k] = e[k];
      return o;
    });
  }
}

/** Parse a markdown pipe table starting at line i; returns {header, rows, end}. */
export function parseTable(lines, i) {
  const cells = (l) =>
    l
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
  const header = cells(lines[i]);
  let j = i + 2;
  const rows = [];
  while (j < lines.length && /^\s*\|/.test(lines[j])) rows.push(cells(lines[j++]));
  return { header, rows, end: j };
}

/** Strip markdown emphasis from a cell. */
export const plain = (s) => String(s || "").replace(/\*{1,3}/g, "").replace(/`/g, "").trim();
