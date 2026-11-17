/*
 * The clip planner (engine-design § 9): which family recordings say a sentence the engine built. Recordings never
 * change the engine (rule G12): the sentence is built first, then covered with clips.
 *
 * THE CLIP INDEX (data/lang/clips.json) links a recording (its id in data/family-audio.json) to what it says:
 *   { "clip": "<family-audio id>", "lex": "<lexicon id>", "cell": "<cell key or *>" }   one word form
 *   { "clip": "<family-audio id>", "meaning": "<meaning key>|<register>|<speaker gender>" }  a whole phrase
 * A word with no index row still finds a one-word recording whose text is the same (as FamilyVoice.match does).
 *
 * THE ORDER: (1) whole phrases, only when `phrases` is on (decision 26: off until the pre-publish quality pass), and
 * never over a token whose form is a guess (a defaulted gender: decision 21); (2) each word by the index; (3) each
 * word by its text; (4) anything left is "missing", an audio gap. English placeholders are always missing.
 * Which take plays (store path: only clips marked OK; redo never) is voice.js's chooseClip, shared with Voice.
 */
import { chooseClip, norm, phrasesOn, voicePath } from "../../voice.js";
import { keyCovers } from "./linearize.js";

/** An index over the clip rows and the recordings list. */
export function buildClipIndex({ clips = [], audio = [] } = {}) {
  const takesById = new Map();
  const takesByText = new Map();
  const put = (map, k, e) => (map.get(k) || map.set(k, []).get(k)).push(e);
  for (const a of audio || []) {
    if (!a || !a.file || !a.speaker) continue;
    const take = { id: a.id, file: a.file, speaker: a.speaker, checked: a.checked || null, kutchi: a.kutchi };
    put(takesById, a.id, take);
    const t = norm(a.kutchi);
    if (t && !t.includes(" ")) put(takesByText, t, take);
  }
  const wordRows = new Map(); // lex -> [{cell, clip}]
  const wholeRows = new Map(); // meaning key -> [clip]
  for (const c of clips || []) {
    if (c.lex) put(wordRows, c.lex, c);
    else if (c.meaning) put(wholeRows, c.meaning, c);
  }
  return {
    takesById: (id) => takesById.get(id) || [],
    /** the takes indexed for one word form, most specific row first */
    word(lex, cell) {
      const rows = (wordRows.get(lex) || []).map((r) => ({ r, s: keyCovers(r.cell || "*", cell) })).filter((x) => x.s >= 0);
      rows.sort((a, b) => b.s - a.s);
      return rows.flatMap((x) => takesById.get(x.r.clip) || []);
    },
    text: (t) => takesByText.get(norm(t)) || [],
    whole: (key) => (wholeRows.get(key) || []).flatMap((r) => takesById.get(r.clip) || []),
  };
}

/**
 * Plan the clips for linearized tokens. Returns {plan, gaps}: plan items are
 * {kind: "whole"|"word"|"missing", source, file?, clip?, text, tokens: [first, last], lang?}, with token indexes.
 */
export function planClips(lin, index, { path = voicePath(), phrases = phrasesOn(), speaker = null, register = null, speakerGender = null } = {}) {
  const toks = lin.tokens;
  const plan = [];
  const gaps = [];
  const o = { path, speaker };
  const covered = new Array(toks.length).fill(false);
  const sayable = (i) => toks[i] && !toks[i].punct;

  if (phrases && index) {
    // longest node first; a span is usable only if every token in it is Kutchi and none is a guess
    const nodes = (lin.nodes || []).filter((n) => !n.gap && n.to >= n.from).sort((a, b) => b.to - b.from - (a.to - a.from));
    for (const n of nodes) {
      let ok = true;
      for (let i = n.from; i <= n.to; i++) if (covered[i] || (sayable(i) && (toks[i].lang !== "k" || toks[i].defaulted))) ok = false;
      if (!ok) continue;
      const key = [n.key, register || "", speakerGender || ""].join("|");
      const take = chooseClip(index.whole(key), o) || chooseClip(index.whole(n.key), o);
      if (!take) continue;
      for (let i = n.from; i <= n.to; i++) covered[i] = true;
      plan.push({ kind: "whole", source: take.source, file: take.file, clip: take.id, text: textOf(toks, n.from, n.to), tokens: [n.from, n.to], at: n.from });
    }
  }
  for (let i = 0; i < toks.length; i++) {
    if (covered[i] || !sayable(i)) continue;
    const t = toks[i];
    if (t.lang !== "k") {
      // an English placeholder run: never a family clip (it has no Kutchi), listed as missing
      let j = i;
      while (j + 1 < toks.length && (toks[j + 1].punct || (toks[j + 1].lang === "e" && toks[j + 1].gap === t.gap))) j++;
      while (j > i && toks[j].punct) j--;
      plan.push({ kind: "missing", source: "missing", lang: "e", text: textOf(toks, i, j), tokens: [i, j], at: i });
      i = j;
      continue;
    }
    const take = (index && (chooseClip(index.word(t.lex, t.cell), o) || chooseClip(index.text(t.t), o) || (t.say && chooseClip(index.text(t.say), o)))) || null;
    if (take) {
      plan.push({ kind: "word", source: take.source, file: take.file, clip: take.id, text: t.t, tokens: [i, i], at: i });
      continue;
    }
    plan.push({ kind: "missing", source: "missing", text: t.t, tokens: [i, i], at: i });
    gaps.push({ kind: "audio", lex: t.lex, cell: t.cell, t: t.t, key: ["audio", "", t.lex || "", t.cell || "", ""].join("|"), what: `no ${path === "store" ? "OK " : ""}recording of "${t.t}"`, ask: [] });
  }
  plan.sort((a, b) => a.at - b.at);
  plan.forEach((p) => delete p.at);
  const seen = new Set();
  return { plan, gaps: gaps.filter((g) => (seen.has(g.key) ? false : seen.add(g.key))) };
}

function textOf(toks, a, b) {
  let s = "";
  for (let i = a; i <= b; i++) s += (toks[i].punct || !s ? "" : " ") + toks[i].t;
  return s;
}
