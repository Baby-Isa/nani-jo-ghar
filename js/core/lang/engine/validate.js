/*
 * The data check (engine-design § 12.4; rules G1-G3, G13, G18, G26): what makes language data unusable is an
 * error, what should be looked at is a warning. Run it on every change to data/lang/ (build/lang/ runs it).
 *
 *   validate(data, { audio }) -> { ok, errors: [{where, msg}], warnings: [{where, msg}] }
 *
 * Errors: an entry with no source; a word with no Kutchi that is not flagged to-record; a to-record word that
 * carries a Kutchi form (a guess: G1); unknown part of speech, status, paradigm or feature value; a reserved
 * (hyp) feature value in use; a form key naming a value no feature has; a confirmed or draft cell with nothing
 * to make or no source; a rule naming a word, argument or meaning that doesn't exist; an unknown rule with no
 * question to settle it; a clip row whose recording doesn't exist or doesn't say the form it is indexed for.
 */
import { createLinearizer } from "./linearize.js";
import { norm } from "../../voice.js";

export function validate(data, { audio = null } = {}) {
  const errors = [];
  const warnings = [];
  const err = (where, msg) => errors.push({ where, msg });
  const warn = (where, msg) => warnings.push({ where, msg });
  const params = data.params || {};
  const features = params.features || {};
  const statuses = params.statuses || {};
  const posInfo = params.pos || {};
  const entries = (data.lexicon && data.lexicon.entries) || [];
  const paradigms = (data.paradigms && data.paradigms.paradigms) || {};
  const functions = (data.abstract && data.abstract.functions) || {};
  const lins = (data.concrete && data.concrete.lin) || {};
  const clips = (data.clips && data.clips.clips) || [];

  if (!features.gender) err("params", "no gender feature");
  const values = new Set();
  const hyp = new Set();
  for (const f of Object.keys(features)) {
    (features[f].values || []).forEach((v) => values.add(v));
    (features[f].hyp || []).forEach((v) => hyp.add(v));
  }
  const srcOk = (s) => (Array.isArray(s) ? s.length > 0 && s.every((x) => typeof x === "string" && x.trim()) : typeof s === "string" && s.trim().length > 0);

  /** a form or cell key: every part a feature value, "*" or "-" */
  function checkKey(where, key) {
    if (key === "*" || key === "-") return;
    for (const part of String(key).split(".")) {
      if (part === "*" || part === "-") continue;
      if (hyp.has(part)) err(where, `"${key}" uses the reserved value "${part}" (not confirmed by Mum)`);
      else if (!values.has(part)) err(where, `"${key}": "${part}" is not a value of any feature`);
    }
  }

  /* ---- lexicon ---- */
  const ids = new Map();
  for (const [i, e] of entries.entries()) {
    const where = `lexicon ${e && e.id ? e.id : "#" + i}`;
    if (!e || typeof e !== "object") {
      err(where, "not an object");
      continue;
    }
    if (!e.id) err(where, "no id");
    else if (ids.has(e.id)) err(where, "duplicate id");
    else ids.set(e.id, e);
    if (!posInfo[e.pos]) err(where, `unknown part of speech "${e.pos}"`);
    if (!(statuses.entry || []).includes(e.status)) err(where, `status must be one of ${(statuses.entry || []).join(", ")} (has "${e.status}")`);
    if (!srcOk(e.src)) err(where, "no source: every entry must cite where it came from (grammar-notes §, a recording, a question ID)");
    const hasKutchi = !!(e.lemma || (e.forms && Object.keys(e.forms).length));
    if (!hasKutchi && e.status !== "to-record") err(where, "English only (no Kutchi) but not flagged to-record");
    if (e.status === "to-record" && hasKutchi) err(where, "flagged to-record but carries Kutchi: a word is either known (with a source) or to record, never a guess");
    if (e.status === "to-record" && !e.gloss && !e.en) err(where, "a to-record word needs its English (gloss) for the placeholder");
    if (!e.gloss) warn(where, "no gloss (the English for grown-ups and for Mum's list)");
    if ("gender" in e && e.gender !== null && !(features.gender && features.gender.values.includes(e.gender))) err(where, `gender "${e.gender}" is not a gender`);
    if ((e.pos === "N" || e.pos === "PN") && !("gender" in e)) err(where, "a noun must carry its gender (null when unknown) (G18)");
    if ((e.pos === "N" || e.pos === "PN") && e.gender === null && e.status !== "to-record" && !(e.ask && e.ask.gender)) warn(where, "gender unknown: name the question that settles it (ask.gender) so it tops Mum's list");
    for (const k of ["number", "person", "clusivity"]) {
      if (e[k] == null) continue;
      if (hyp.has(e[k])) err(where, `${k} "${e[k]}" is a reserved value`);
      else if (!(features[k] && features[k].values.includes(e[k]))) err(where, `${k} "${e[k]}" is not a value of ${k}`);
    }
    if (e.paradigm) {
      const p = paradigms[e.paradigm];
      if (!p) err(where, `unknown paradigm "${e.paradigm}"`);
      else {
        if (p.pos && p.pos !== e.pos && !(p.pos === "N" && e.pos === "PN")) err(where, `paradigm "${e.paradigm}" is for ${p.pos}, not ${e.pos}`);
        if (p.stem && p.stem.drop && !(e.lemma || "").endsWith(p.stem.drop)) err(where, `lemma "${e.lemma}" doesn't end in "${p.stem.drop}" (paradigm ${e.paradigm})`);
        if (!e.lemma) err(where, "a word with a paradigm needs its lemma");
      }
    } else if ((e.pos === "N" || e.pos === "PN") && e.status !== "to-record" && !(e.forms && Object.keys(e.forms).some((k) => k.startsWith("pl") || k === "*"))) {
      warn(where, "a noun with no paradigm and no plural form: its plural can't be said (G18)");
    }
    for (const key of Object.keys(e.forms || {})) {
      checkKey(`${where} forms`, key);
      const v = e.forms[key];
      if (typeof v === "string") continue;
      if (!v || typeof v !== "object") err(`${where} forms.${key}`, "a form is a string or {t, status, src}");
      else {
        if (v.status && !(statuses.cell || []).includes(v.status)) err(`${where} forms.${key}`, `status "${v.status}" is not a cell status`);
        if (v.status === "unknown" && v.t) err(`${where} forms.${key}`, "an unknown form must not carry text");
        if (v.status !== "unknown" && !v.t) err(`${where} forms.${key}`, "a form with no text must be status unknown");
      }
    }
  }
  for (const e of entries) for (const a of (e && e.aliases) || []) if (ids.has(a) && ids.get(a) !== e) err(`lexicon ${e.id}`, `alias "${a}" is another entry's id`);

  /* ---- paradigms ---- */
  for (const id of Object.keys(paradigms)) {
    const p = paradigms[id];
    const where = `paradigm ${id}`;
    if (p.pos && !posInfo[p.pos]) err(where, `unknown part of speech "${p.pos}"`);
    for (const key of Object.keys(p.cells || {})) {
      checkKey(where, key);
      const c = p.cells[key];
      if (!(statuses.cell || []).includes(c.status)) err(`${where} ${key}`, `status must be one of ${(statuses.cell || []).join(", ")}`);
      if (c.status === "unknown") {
        if (c.make) err(`${where} ${key}`, "an unknown cell must not say how to make it");
        if (!(c.ask && c.ask.length)) warn(`${where} ${key}`, "unknown cell: name the question that settles it (ask)");
      } else {
        if (!c.make) err(`${where} ${key}`, "a known cell needs `make`");
        if (!srcOk(c.src)) err(`${where} ${key}`, "no source");
      }
    }
  }

  /* ---- abstract ---- */
  for (const fn of Object.keys(functions)) {
    const f = functions[fn];
    const where = `abstract ${fn}`;
    if (!f.cat) err(where, "no category (cat)");
    if (f.core) {
      const walk = (t) => {
        if (typeof t === "string" && t.startsWith("$") && !(t.slice(1) in (f.args || {}))) err(where, `core uses $${t.slice(1)}, not an argument`);
        if (Array.isArray(t)) t.forEach(walk);
        else if (t && typeof t === "object") {
          if (t.fn && !functions[t.fn]) err(where, `core uses the unknown meaning "${t.fn}"`);
          Object.values(t).forEach(walk);
        }
        if (typeof t === "string" && /^[a-z]+\./.test(t) && !ids.has(t)) err(where, `core names the unknown word "${t}"`);
      };
      walk(f.core);
    }
    if (!lins[fn] && !f.core && !f.internal) warn(where, "no rule and no core expansion: always a gap");
    if (!lins[fn] && !(f.elicit && f.elicit.length)) warn(where, "no elicit sentences to ask Mum with");
    for (const r of f.rows || []) if (!(r in (f.args || {}))) err(where, `rows names "${r}", not an argument`);
  }

  /* ---- concrete ---- */
  const tplRefs = (tpl) => Array.from(String(tpl || "").matchAll(/\{([^}]+)\}/g)).flatMap((m) => m[1].split("|").map((x) => x.trim()));
  for (const fn of Object.keys(lins)) {
    const r = lins[fn];
    const where = `rule ${fn}`;
    const abs = functions[fn];
    if (!abs) {
      err(where, "a rule for a meaning that isn't in abstract.json");
      continue;
    }
    const args = abs.args || {};
    const st = r.status || "confirmed";
    if (!(statuses.rule || []).includes(st)) err(where, `status "${st}" is not a rule status`);
    if (st === "unknown") {
      if (!(r.ask && r.ask.length)) err(where, "an unknown rule must name the questions that settle it (ask)");
      if (!r.english) err(where, "an unknown rule needs its English placeholder (english)");
      continue;
    }
    if (!srcOk(r.src)) err(where, "no source");
    const checkRefs = (w, tpl) => {
      for (const ref of tplRefs(tpl)) {
        if (ref.includes(".")) {
          const a = ref.split(".")[0];
          if (!(a in args) && a !== "parent") err(w, `{${ref}}: "${a}" is not an argument of ${fn}`);
        }
      }
    };
    Object.values(r.feats || {}).forEach((t) => checkRefs(`${where} feats`, t));
    for (const k of Object.keys(r.only || {})) checkRefs(`${where} only`, `{${k}}`);
    if (r.variants) for (const v of Object.keys(r.variants)) if (!(features.register && features.register.values.includes(v))) err(where, `variant "${v}" is not a register`);
    const allSlots = r.variants ? Object.values(r.variants).flat() : r.slots || [];
    if (!allSlots.length) err(where, "no slots");
    for (const s of allSlots) {
      if (s.punct) {
        if (!(params.punctuation || []).includes(s.punct)) err(where, `punctuation "${s.punct}" is not in params.punctuation`);
        continue;
      }
      if (s.lex && !ids.has(s.lex)) err(where, `names the unknown word "${s.lex}"`);
      if (s.arg && !(s.arg in args)) err(where, `slot names "${s.arg}", not an argument of ${fn}`);
      if (!s.lex && !s.arg) err(where, "a slot is {arg}, {lex} or {punct}: no free text (rule G26)");
      if (s.word || s.text) err(where, "a slot may not hold text: name a lexicon word ({lex}) (rule G26)");
      if (s.via && !functions[s.via]) err(where, `via "${s.via}" is not a meaning`);
      checkRefs(where, s.cell);
      checkRefs(where, s.case);
    }
    if (r.mark && !(params.punctuation || []).includes(r.mark)) err(where, `mark "${r.mark}" is not punctuation`);
  }

  /* ---- clips (the recording round-trip, engine-design § 12.3) ---- */
  const audioIds = audio ? new Map() : null;
  if (audio) for (const a of audio) if (a && a.id) (audioIds.get(a.id) || audioIds.set(a.id, []).get(a.id)).push(a);
  const L = errors.length ? null : createLinearizer(data);
  for (const [i, c] of clips.entries()) {
    const where = `clip ${c.clip || "#" + i}`;
    if (!c.clip) err(where, "no clip id");
    if (audioIds && c.clip && !audioIds.has(c.clip)) err(where, "no recording with this id in data/family-audio.json");
    if (!c.lex && !c.meaning) err(where, "a clip row names a word (lex + cell) or a meaning");
    if (c.lex && !ids.has(c.lex)) err(where, `unknown word "${c.lex}"`);
    if (c.lex && L && audioIds && audioIds.has(c.clip)) {
      const cell = c.cell && c.cell !== "*" ? c.cell : null;
      const want = cell ? L.inflect(c.lex, cell) : null;
      const said = audioIds.get(c.clip).map((a) => norm(a.kutchi));
      const e = ids.get(c.lex);
      const forms = want && !want.gap ? [want.t] : [e.lemma].concat(Object.values(e.forms || {}).map((v) => (typeof v === "string" ? v : v && v.t))).filter(Boolean);
      if (!said.some((s) => forms.some((f) => norm(f) === s))) err(where, `the recording says "${said[0]}", not ${forms.map((f) => `"${f}"`).join(" / ")}: fix the data, never the clip`);
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

export default validate;
