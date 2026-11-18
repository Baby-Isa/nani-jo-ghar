/*
 * The clip planner (engine-design § 9): which family recordings say a sentence the engine built. Recordings never
 * change the engine (rule G12): the sentence is built first, then covered with clips.
 *
 * THE CLIP INDEX (data/lang/clips.json) links a recording (its id in data/family-audio.json) to what it says:
 *   { "clip": "<family-audio id>", "lex": "<lexicon id>", "cell": "<cell key or *>" }   one word form
 *   { "clip": "<family-audio id>", "meaning": "<meaning key>|<register>|<speaker gender>" }  a whole phrase
 * A word or a span with no index row still finds a recording whose text is the same, spaces and all.
 *
 * THE ORDER: (1) whole takes, the longest span first (Mum's whole line, else a phrase inside it): by the meaning's
 * row, else by the span's text; on unless `phrases` is false (Zafar, 18 Nov: "Mum's whole-line takes play where they
 * fit"), and never over a token whose form is a guess (a defaulted gender: decision 21); (2) each word by the index;
 * (3) each word by its text; (4) anything left is "missing", an audio gap. English placeholders are always missing.
 * Which take plays (store path: only clips marked OK; redo never) is chooseClip (../../voice-clips.js), the voice's rule too.
 */
import { chooseClip, norm, voicePath } from "../../voice-clips.js";
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
    if (t) put(takesByText, t, take);
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
export function planClips(lin, index, { path = voicePath(), phrases = true, speaker = null, register = null, speakerGender = null } = {}) {
  const toks = lin.tokens;
  const plan = [];
  const gaps = [];
  const o = { path, speaker };
  const covered = new Array(toks.length).fill(false);
  const sayable = (i) => toks[i] && !toks[i].punct;

  if (phrases && index) {
    // a span is usable only if every token in it is Kutchi, none is a guess and none is said already
    const usable = (a, b) => {
      for (let i = a; i <= b; i++) if (covered[i] || (sayable(i) && (toks[i].lang !== "k" || toks[i].defaulted))) return false;
      return true;
    };
    const take = (a, b, clip) => {
      for (let i = a; i <= b; i++) covered[i] = true;
      plan.push({ kind: "whole", source: clip.source, file: clip.file, clip: clip.id, text: textOf(toks, a, b), tokens: [a, b], at: a });
    };
    // by the meaning's own row, the longest node first
    const nodes = (lin.nodes || []).filter((n) => !n.gap && n.to >= n.from).sort((a, b) => b.to - b.from - (a.to - a.from));
    for (const n of nodes) {
      if (!usable(n.from, n.to)) continue;
      const key = [n.key, register || "", speakerGender || ""].join("|");
      const clip = chooseClip(index.whole(key), o) || chooseClip(index.whole(n.key), o);
      if (clip) take(n.from, n.to, clip);
    }
    // by the text: the longest run of two words or more that a take says, the whole line first, else a phrase inside it;
    // a run across a comma only by a take that has the comma too (else its words would lose the pause between them), and
    // the mark straight after the run goes with it (the take ends the line or the phrase as it is said)
    const words = toks.map((t, i) => i).filter(sayable);
    for (let len = words.length; len >= 2; len--)
      for (let k = 0; k + len <= words.length; k++) {
        const [a, b] = [words[k], words[k + len - 1]];
        const end = b + (toks[b + 1] && toks[b + 1].punct ? 1 : 0);
        if (!usable(a, end)) continue;
        const comma = toks.slice(a, b).some((t) => t.punct && t.t.includes(","));
        const clip = chooseClip(index.text(textOf(toks, a, b)).filter((e) => !comma || String(e.kutchi).includes(",")), o);
        if (clip) take(a, end, clip);
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
