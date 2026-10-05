// Attach recordings of whole sentences to the meanings that say them (engine-design § 5.5; rule G12: the recording never
// changes the engine). Every meaning the rules can build from a small generator (an order, a "where is it", a "with
// the …") is linearised; a recording whose text is exactly that sentence becomes a clips.json row keyed by the meaning.
// A meaning whose text differs between the child's and an elder's "you" cannot be keyed by the clip index (its key has
// no addressee), so those sentences stay unattached and are listed. No Kutchi is in this file: it only generates
// meanings from the lexicon and compares text.
import { createEngine } from "../../js/core/lang/engine/index.js";
import { norm, readJSON } from "./lib.mjs";

export function engineOf(S) {
  const params = readJSON("data/lang/params.json");
  const data = { params, lexicon: { entries: Array.from(S.entries.values()) }, paradigms: { paradigms: S.paradigms }, abstract: { functions: S.functions }, concrete: { lin: S.lin }, clips: { clips: [] } };
  return createEngine({ data, audio: [], path: "test", phrases: false });
}

const PERSONS = ["p1", "p2", "p2resp", "p3", "p1pl.incl", "p1pl.excl"];
const CTX = {
  informal: { register: "informal" },
  polite: { register: "polite" },
  "informal+elder": { register: "informal", addressee: { elder: true } },
  "polite+elder": { register: "polite", addressee: { elder: true } },
};

/** the meanings worth trying */
function* candidates(S) {
  const live = (e) => e.status !== "to-record";
  const nouns = Array.from(S.entries.values()).filter((e) => (e.pos === "N" || e.pos === "PN") && live(e)).map((e) => e.id);
  const common = nouns.filter((id) => S.entries.get(id).pos === "N");
  const adjs = Array.from(S.entries.values()).filter((e) => e.pos === "A" && live(e)).map((e) => e.id);
  const posts = Array.from(S.entries.values()).filter((e) => e.pos === "Post" && live(e)).map((e) => e.id);
  const verbs = Array.from(S.entries.values()).filter((e) => e.pos === "V" && live(e)).map((e) => e.id);
  const places = ["n.cup", "n.table", "n.door", "n.cupboard", "n.teaspoon", "n.plate", "n.shelf", "n.key"].filter((id) => S.entries.has(id));
  const item = (kind, n, mods) => ({ fn: "Item", kind, ...(n != null ? { n } : {}), ...(mods ? { mods } : {}) });
  for (const k of nouns) {
    for (const n of [null, 1, 2, 3, 4]) {
      yield { fn: "Item", kind: k, ...(n != null ? { n } : {}) };
      yield { fn: "Need", who: "p1", thing: item(k, n) };
      yield { fn: "GiveMe", x: item(k, n) };
      yield { fn: "And", x: item(k, n) };
      yield { fn: "Then", x: item(k, n) };
      yield { fn: "Only", x: item(k, n) };
      yield { fn: "NoItem", x: item(k, n) };
      yield { fn: "Now", x: item(k, n) };
    }
    yield { fn: "Item", kind: k, number: "pl" };
    yield { fn: "With", x: { fn: "Item", kind: k, number: "pl" } };
    yield { fn: "In", x: { fn: "Item", kind: k, number: "pl" } };
    yield { fn: "On", x: { fn: "Item", kind: k, number: "pl" } };
    for (const r of posts) yield { fn: "Place", anchor: k, rel: r };
    yield { fn: "OnShort", x: k };
    for (const o of PERSONS) yield { fn: "OnShort", x: { fn: "PossPron", owner: o, thing: k } };
    yield { fn: "Lift", x: k };
    yield { fn: "Leave", x: k };
    yield { fn: "Where", thing: k };
    yield { fn: "ForWho", x: k };
    yield { fn: "For", x: k };
    yield { fn: "NotNeed", thing: k };
    for (const who of ["p2", "p2resp"]) yield { fn: "CanYouMake", who, thing: k };
    yield { fn: "With", x: k };
    yield { fn: "In", x: k };
    yield { fn: "On", x: k };
    yield { fn: "IsA", thing: k, quality: "a.big" };
    for (const a of adjs) {
      yield item(k, null, [a]);
      yield item(k, 2, [a]);
      yield { fn: "IsA", thing: k, quality: a };
      yield { fn: "IsA", thing: item(k, 2), quality: a };
      yield { fn: "Item", kind: k, number: "pl", mods: [a] };
      yield { fn: "With", x: { fn: "Item", kind: k, number: "pl", mods: [a] } };
      yield { fn: "IsA", thing: { fn: "Item", kind: k, number: "pl" }, quality: a };
      for (const r of posts) yield { fn: "Place", anchor: item(k, null, [a]), rel: r };
      yield { fn: "In", x: item(k, null, [a]) };
      yield { fn: "With", x: item(k, null, [a]) };
      yield { fn: "On", x: item(k, null, [a]) };
    }
    yield { fn: "BeIn", who: "p1", place: k };
    for (const who of ["p1", "p2", "p2resp", "p3", "p1pl.incl", "p1pl.excl"]) yield { fn: "BeIn", who, place: k };
    for (const o of ["pn.nana", "pn.nani"]) yield { fn: "Of", owner: o, thing: k };
    for (const o of ["pn.nana", "pn.nani"]) yield { fn: "BelongsTo", owner: o, thing: k };
    for (const o of PERSONS) {
      yield { fn: "PossPron", owner: o, thing: k };
      yield { fn: "PossPron", owner: o, thing: { fn: "Item", kind: k, number: "pl" } };
      yield { fn: "In", x: { fn: "PossPron", owner: o, thing: k } };
      yield { fn: "On", x: { fn: "PossPron", owner: o, thing: k } };
      yield { fn: "With", x: { fn: "PossPron", owner: o, thing: k } };
    }
    yield { fn: "Of", owner: "pron.they", thing: k };
    yield { fn: "Of", owner: "pron.they", thing: { fn: "Item", kind: k, number: "pl" } };
    for (const v of verbs) {
      yield { fn: "Command", verb: v, obj: k };
      yield { fn: "DoIt", verb: v, obj: k };
      yield { fn: "Dont", verb: v, obj: k };
    }
    yield { fn: "MixedIn", head: "n.tea", x: k };
    yield { fn: "Without", head: "n.tea", x: k };
    yield { fn: "Unit", n: 1, unit: "n.skewer", of: k };
    yield { fn: "Unit", n: 2, unit: "n.skewer", of: k };
  }
  const things = ["n.cup", "n.mango", "n.door", "n.ear", "n.chair", "n.chapati", "n.she-goat", "n.billy-goat", "n.kitchen", "n.skewer"].filter((id) => S.entries.has(id));
  for (const o of nouns) for (const t of things) {
    yield { fn: "Of", owner: o, thing: t };
    yield { fn: "Of", owner: o, thing: { fn: "Item", kind: t, number: "pl" } };
    for (const r of posts) yield { fn: "Place", anchor: { fn: "Of", owner: o, thing: t }, rel: r };
    yield { fn: "With", x: { fn: "Of", owner: o, thing: t } };
    for (const o2 of nouns.filter((x) => x === "n.boy" || x === "n.girl")) yield { fn: "With", x: { fn: "Of", owner: o2, thing: { fn: "Of", owner: o, thing: t } } };
  }
  const some = ["v.make", "v.use", "v.take", "v.bring", "v.buy"].filter((id) => S.entries.has(id));
  for (const v of some) for (const k of nouns) for (const a of adjs) yield { fn: "Command", verb: v, obj: item(k, null, [a]) };
  for (const v of verbs) {
    yield { fn: "Command", verb: v };
    yield { fn: "DoIt", verb: v };
    yield { fn: "Dont", verb: v };
    yield { fn: "DontNow", verb: v };
  }
  for (const a of adjs) yield { fn: "Most", adj: a };
  yield { fn: "Lift" };
  yield { fn: "Leave" };
  for (const d of ["dem.this", "dem.that"]) for (const k of nouns) for (const a of adjs) yield { fn: "With", x: { fn: "Point", which: d, x: item(k, null, [a]) } };
  for (const t of places) for (const a of places) for (const r of posts) {
    if (t === a) continue;
    yield { fn: "LocatedAt", thing: t, anchor: a, rel: r };
    yield { fn: "LocatedAtShort", thing: t, anchor: a, rel: r };
  }
  for (const who of ["p2", "p2resp"]) yield { fn: "HowAreYou", who };
  yield { fn: "ImFine" };
  for (const d of ["dem.this", "dem.that"]) for (const k of nouns) for (const a of adjs) yield { fn: "Point", which: d, x: item(k, null, [a]) };
  for (const f of ["FirstThen"]) for (const a of common.slice(0, 40)) for (const b of common.slice(0, 40)) if (a !== b) yield { fn: f, a, b };
  for (const a of common.slice(0, 40)) for (const b of common.slice(0, 40)) if (a !== b) yield { fn: "NeedFirstThen", a, rest: b };
}

/**
 * For each unlinked recording (a group {id, text}) find the meanings that say exactly its text. Returns
 * {rows, attached: [clip ids]}; rows are {clip, meaning}.
 */
export function attachSentences(S, groups, L0) {
  const eng = engineOf(S);
  const want = new Map(); // norm(text) -> [groups]
  for (const g of groups) if (g.text) (want.get(norm(g.text)) || want.set(norm(g.text), []).get(norm(g.text))).push(g);
  const found = new Map(); // clip id -> {key, ctx}
  const strip = (s) => norm(s.replace(/[.!?]+$/, ""));
  let tried = 0;
  for (const m of candidates(S)) {
    tried++;
    const texts = {};
    const keys = {};
    const usesYou = JSON.stringify(m).includes('"p2"');
    let ok = true;
    for (const [name, ctx] of Object.entries(CTX)) {
      if (name.endsWith("+elder") && !usesYou) continue;
      let r;
      try {
        r = eng.say(m, ctx, { plan: false });
      } catch (e) {
        if (name === "informal") ok = false;
        continue;
      }
      if (!r.ok) {
        if (name === "informal") ok = false; // not sayable at all
        continue; // not sayable in this context: it has no text
      }
      texts[name] = strip(r.text);
      keys[name] = r.key;
    }
    if (!ok || !texts.informal) continue;
    // one key per meaning (the key already names the person actually said); the register goes after it only where it changes the text
    for (const [name, t] of Object.entries(texts)) {
      const gs = (want.get(t) || []).filter((g) => !found.has(g.id));
      if (!gs.length) continue;
      const reg = name.startsWith("polite") ? "polite" : "informal";
      const other = reg === "polite" ? texts[name.replace("polite", "informal")] : texts[name.replace("informal", "polite")];
      const key = other == null || other === t ? keys[name] : `${keys[name]}|${reg}|`;
      for (const g of gs) found.set(g.id, { key, text: t });
    }
  }
  const rows = [];
  for (const [clip, f] of found) rows.push({ clip, meaning: f.key });
  return { rows, attached: Array.from(found.keys()), tried };
}
