/*
 * One player for every voice in the game (target-model § 3.2; rules G14, G16, E5; PAN-04). Not wired to any
 * page yet: Cook (R4) and the clinic (R5) move onto it.
 *
 * WHICH CLIP (chooseClip, pure): a recording marked `checked: "redo"` never plays. In the STORE app (path
 * "store") only clips Zafar marked `checked: "ok"` play, and never a computer voice. On the TEST path (GitHub
 * Pages, labs, Node: everything that isn't the store build) an unchecked clip may stand in when there is no OK
 * one, then the placeholder TTS file, then the device's own voice, so a line with no family recording yet is
 * still heard while testing (G14 allows computer voices for testing only). The order is: the asked speaker's
 * own take (if allowed on this path), Mum OK, Zafar OK, then (test path only) Mum unchecked, Zafar unchecked.
 * Note: js/shared/family-voice.js (lines 47-60, pick()) still returns unchecked clips everywhere; that file is
 * left as it is (live), and this module is what the store app will use.
 *
 * THE PATH: path() is "store" in the store app (window.NJG_BUILD = "store", written by the packager) or with
 * ?voice=store (to preview the store app's voice on the test site); "test" otherwise. ?dev=voice logs which
 * source played each piece (Voice.log and the console), so a tester can tell family from stand-in.
 *
 *   const index = clipIndex(familyAudioList, { tts: cookTts.lines })
 *   const V = createVoice({ index, player })        // player: {play(url) -> Promise, stop(), synth?(text) -> Promise}
 *   V.plan(result) -> [{ file?, text, source, tokens: [from, to] }]     a Lang result's clip plan, resolved
 *   V.say(result, { channel = "main", onWord, queue = false }) -> Promise<{ done }>   never blocks input
 *   V.word(text, { say })   one word or short line by its text      V.stop(channel)      V.busy(channel)
 *   planClips(segments, index, { path }) -> clip plan              (used by the Lang seam)
 */
import { build, devFlags, query, stamp } from "./env.js";

/** lowercase, strip punctuation, collapse spaces (letters/marks/numbers of any script survive); FamilyVoice.norm's rule. */
export const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N} ]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

/** "store" (only OK family clips) or "test" (stand-ins allowed). */
export function voicePath() {
  if (build() === "store") return "store";
  return query("voice") === "store" ? "store" : "test";
}

/**
 * The clip to play from the takes of one text or id: entries are {file, speaker, checked}. Returns the entry
 * (with `source`: "family-ok" | "family-unchecked") or null.
 */
export function chooseClip(entries, { path = "store", speaker = null } = {}) {
  const usable = (entries || []).filter((e) => e && e.file && e.speaker && e.checked !== "redo" && (e.checked === "ok" || path === "test"));
  if (!usable.length) return null;
  const tag = (e) => Object.assign({}, e, { source: e.checked === "ok" ? "family-ok" : "family-unchecked" });
  const okOf = (who) => usable.find((e) => e.speaker === who && e.checked === "ok");
  const anyOf = (who) => usable.find((e) => e.speaker === who);
  if (speaker) {
    const own = okOf(speaker) || anyOf(speaker);
    if (own) return tag(own);
  }
  const pick = okOf("mum") || okOf("zafar") || usable.find((e) => e.checked === "ok") || anyOf("mum") || anyOf("zafar") || usable[0];
  return tag(pick);
}

/** An index over data/family-audio.json (and, for the test path, the placeholder TTS lines {normText: file}). */
export function clipIndex(list, { tts = {} } = {}) {
  const byText = new Map();
  const byId = new Map();
  const put = (map, key, e) => key && (map.get(key) || map.set(key, []).get(key)).push(e);
  (list || []).forEach((e) => {
    if (!e || !e.file || !e.speaker) return;
    const entry = { id: e.id, file: e.file, speaker: e.speaker, checked: e.checked || null, kutchi: e.kutchi };
    put(byId, e.id, entry);
    put(byText, norm(e.kutchi), entry);
  });
  return {
    size: (list || []).length,
    takes: (text) => byText.get(norm(text)) || [],
    takesById: (id) => byId.get(id) || [],
    /** the best family clip for a text, trying each spelling in turn */
    match(texts, o = {}) {
      for (const t of [].concat(texts)) {
        if (!t) continue;
        const c = chooseClip(byText.get(norm(t)), o);
        if (c) return c;
      }
      return null;
    },
    byId: (id, o = {}) => chooseClip(byId.get(id), o),
    /** the placeholder TTS file for a text ("en|" + text for English), test path only */
    tts: (key, o = {}) => (o.path === "test" && tts[key] ? { file: tts[key], source: "tts" } : null),
  };
}

/**
 * A clip plan for display segments ({t, lang: "k"|"e"|null, w?}), the same search today's Cook voice makes
 * (js/cook/lang.js Lang.speak): the whole line; else each run of one language; else each piece (frame text or
 * one filled word, with its `say` spelling); else word by word; anything left is "missing" (an audio gap), or on
 * the test path "device" (the device's own voice reads it). English placeholders are only ever TTS (test path).
 * Each item: {file?, text, source, tokens: [first, last]} (segment indexes, for the read-along).
 */
export function planClips(segments, index, { path = voicePath(), sayOf = () => null } = {}) {
  const segs = segments || [];
  const items = [];
  const idx = segs.map((s, i) => i).filter((i) => segs[i].lang);
  if (!idx.length) return items;
  const span = (a, b) => [a, b];
  const textOf = (a, b) => segs.slice(a, b + 1).map((s) => s.t).join("");
  const allK = idx.every((i) => segs[i].lang === "k");
  const whole = textOf(0, segs.length - 1).trim();
  if (allK) {
    const fam = index.match(whole, { path });
    if (fam) return [{ file: fam.file, text: whole, source: fam.source, tokens: span(idx[0], idx[idx.length - 1]) }];
    const t = index.tts(norm(whole), { path });
    if (t) return [{ file: t.file, text: whole, source: "tts", tokens: span(idx[0], idx[idx.length - 1]) }];
  }
  // runs of one language (spaces and punctuation join the run before them)
  const runs = [];
  segs.forEach((s, i) => {
    if (!s.lang) {
      if (runs.length) runs[runs.length - 1].to = i;
      return;
    }
    const last = runs[runs.length - 1];
    if (last && last.lang === s.lang) {
      last.to = i;
      last.parts.push(i);
    } else runs.push({ lang: s.lang, from: i, to: i, parts: [i] });
  });
  runs.forEach((run) => {
    const text = textOf(run.from, run.to).trim();
    if (run.lang === "k") {
      const fam = index.match(text, { path });
      if (fam) return items.push({ file: fam.file, text, source: fam.source, tokens: span(run.from, run.to) });
    }
    const t = index.tts((run.lang === "e" ? "en|" : "") + norm(text), { path });
    if (t) return items.push({ file: t.file, text, source: "tts", tokens: span(run.from, run.to) });
    if (run.lang !== "k") return items.push({ text, source: "missing", lang: "e", tokens: span(run.from, run.to) });
    run.parts.forEach((i) => {
      const piece = segs[i].t.trim();
      if (!piece) return;
      const fam = index.match([piece, sayOf(segs[i].w)], { path });
      if (fam) return items.push({ file: fam.file, text: piece, source: fam.source, tokens: span(i, i) });
      const tp = index.tts(norm(piece), { path });
      if (tp) return items.push({ file: tp.file, text: piece, source: "tts", tokens: span(i, i) });
      norm(piece)
        .split(" ")
        .filter(Boolean)
        .forEach((w) => {
          const fw = index.match(w, { path });
          if (fw) return items.push({ file: fw.file, text: w, source: fw.source, tokens: span(i, i) });
          const tw = index.tts(w, { path });
          if (tw) return items.push({ file: tw.file, text: w, source: "tts", tokens: span(i, i) });
          items.push({ text: w, source: path === "test" ? "device" : "missing", tokens: span(i, i) });
        });
    });
  });
  return items;
}

/** A browser player: one <audio> at a time, and the device voice for the test path. */
export function browserPlayer() {
  let audio = null;
  return {
    play(url) {
      return new Promise((resolve) => {
        try {
          if (audio) audio.pause();
          audio = new Audio(stamp(url));
          audio.onended = audio.onerror = () => resolve(true);
          const p = audio.play();
          if (p && p.catch) p.catch(() => resolve(false));
        } catch (e) {
          resolve(false);
        }
      });
    },
    stop() {
      try {
        if (audio) audio.pause();
        if (globalThis.speechSynthesis) globalThis.speechSynthesis.cancel();
      } catch (e) {
        /* ignore */
      }
    },
    synth(text) {
      return new Promise((resolve) => {
        const S = globalThis.speechSynthesis;
        if (!S) return resolve(false);
        try {
          const vs = S.getVoices();
          const v = vs.find((x) => /^gu/i.test(x.lang)) || vs.find((x) => /^hi/i.test(x.lang)) || vs[0];
          const u = new SpeechSynthesisUtterance(text);
          if (v) (u.voice = v), (u.lang = v.lang);
          u.rate = 0.7;
          u.onend = u.onerror = () => resolve(true);
          S.speak(u);
          setTimeout(() => resolve(true), 700 + 260 * text.length);
        } catch (e) {
          resolve(false);
        }
      });
    },
  };
}

export function createVoice({ index, player, path, gapMs = 120 } = {}) {
  const P = player || (typeof Audio !== "undefined" ? browserPlayer() : { play: async () => true, stop() {}, synth: async () => true });
  const thePath = () => path || voicePath();
  const dev = () => devFlags().has("voice");
  const channels = new Map(); // channel -> {token, done: Promise}
  const V = { log: [], path: thePath };

  V.plan = (result) => {
    if (result && Array.isArray(result.clipPlan) && result.clipPlan.every((c) => c.source)) return result.clipPlan.filter((c) => thePath() === "test" || c.source === "family-ok" || c.source === "missing");
    return planClips((result && (result.segments || result.segs)) || [], index, { path: thePath() });
  };

  async function playItems(items, ch, token, onWord) {
    for (const it of items) {
      if (channels.get(ch).token !== token) return false;
      if (onWord) {
        try {
          onWord(it.tokens, it);
        } catch (e) {
          /* the caller's problem */
        }
      }
      if (dev()) {
        V.log.push({ text: it.text, source: it.source, file: it.file || null });
        try {
          console.info(`[voice] ${it.source}: ${it.text}${it.file ? ` (${it.file})` : ""}`);
        } catch (e) {
          /* ignore */
        }
      }
      if (it.file && (it.source === "family-ok" || thePath() === "test")) await P.play(it.file);
      else if (it.source === "device" && thePath() === "test" && P.synth) await P.synth(it.text);
      if (gapMs && items.length > 1) await new Promise((r) => setTimeout(r, gapMs));
    }
    return channels.get(ch).token === token;
  }

  /** Play a Lang result (or {segments}) on a channel. A new line replaces the one playing (queue: true waits). Returns at once. */
  V.say = function (result, { channel = "main", onWord, queue = false } = {}) {
    const prev = channels.get(channel) || { token: 0, done: Promise.resolve(true) };
    const token = prev.token + 1;
    const items = V.plan(result);
    const start = queue ? prev.done.catch(() => {}) : (P.stop(), Promise.resolve());
    const entry = { token, done: null, playing: true };
    channels.set(channel, entry);
    entry.done = start
      .then(() => playItems(items, channel, token, onWord))
      .then((done) => {
        if (channels.get(channel) === entry) entry.playing = false;
        return { done };
      });
    return entry.done;
  };
  V.word = (text, { say, channel = "word" } = {}) => {
    const fam = index && index.match([text, say], { path: thePath() });
    const t = !fam && index && index.tts(norm(text), { path: thePath() });
    const items = fam || t ? [{ file: (fam || t).file, text, source: (fam || t).source, tokens: [0, 0] }] : [{ text, source: thePath() === "test" ? "device" : "missing", tokens: [0, 0] }];
    return V.say({ clipPlan: items }, { channel });
  };
  V.stop = (channel = "main") => {
    const c = channels.get(channel);
    if (c) (c.token++, (c.playing = false));
    P.stop();
  };
  V.busy = (channel = "main") => !!(channels.get(channel) && channels.get(channel).playing);
  return V;
}

export default createVoice;
