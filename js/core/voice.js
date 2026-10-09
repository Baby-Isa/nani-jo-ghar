/*
 * One player for every voice in the game (target-model § 3.2; rules G14, G16, E5; PAN-04). Cook speaks through it;
 * every voice registers with the shared lifecycle's voice layer (js/shared/request-popup.js), so one stop silences all.
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
 * STITCHED SPEECH (decision 26, G12; R6): every line is built from per-word recordings. A family clip whose text is
 * more than one word (a whole phrase or sentence) is switched off by the setting `phrases`, which is off everywhere
 * until the pre-publish quality pass (window.NJG_VOICE_PHRASES = true, written by the packager for that pass, or
 * ?voice=phrases to preview it), so whole phrases never hide a gap in the engine and every line tests it. With
 * phrases off, a line whose every Kutchi word has a family clip is said word by word from them, ahead of any
 * stand-in; otherwise the test path keeps its stand-ins as before (an unchecked clip, the placeholder TTS file,
 * the device voice) and the store path says the family words it has and reports the rest as missing.
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
 *   planClips(segments, index, { path, phrases }) -> clip plan     (used by the Lang seam)
 *   phrasesOn() -> false until the pre-publish pass;  isPhrase(text) -> more than one word
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
 * Whole-phrase family clips on? Off (stitched speech) until the pre-publish quality pass (decision 26):
 * window.NJG_VOICE_PHRASES = true (the packager, for that pass) or ?voice=phrases (a preview on the test site).
 */
export function phrasesOn() {
  if (globalThis.NJG_VOICE_PHRASES === true) return true;
  return query("voice") === "phrases";
}

/** A recording of more than one word (a phrase or a sentence), by its text. */
export const isPhrase = (text) => norm(text).includes(" ");

/**
 * The clip to play from the takes of one text or id: entries are {file, speaker, checked}. Returns the entry
 * (with `source`: "family-ok" | "family-unchecked") or null.
 */
export function chooseClip(entries, { path = "store", speaker = null } = {}) {
  const isOk = (e) => e.checked === "ok" || e.checked === "ok-zafar" || e.checked === "ok-auto"; // ok-auto: orchestrator's blind-verified pick (decision 70) // ok-zafar: picked by Zafar (decision 67)
  const usable = (entries || []).filter((e) => e && e.file && e.speaker && e.checked !== "redo" && (isOk(e) || path === "test"));
  if (!usable.length) return null;
  const tag = (e) => Object.assign({}, e, { source: isOk(e) ? "family-ok" : "family-unchecked" });
  const okOf = (who) => usable.find((e) => e.speaker === who && e.checked === "ok-zafar") || usable.find((e) => e.speaker === who && isOk(e));
  const anyOf = (who) => usable.find((e) => e.speaker === who);
  if (speaker) {
    const own = okOf(speaker) || anyOf(speaker);
    if (own) return tag(own);
  }
  const pick = okOf("mum") || okOf("zafar") || usable.find(isOk) || anyOf("mum") || anyOf("zafar") || usable[0];
  return tag(pick);
}

/** An index over data/family-audio.json (and, for the test path, the placeholder TTS lines {normText: file}). */
export function clipIndex(list, { tts = {} } = {}) {
  const byText = new Map();
  const byId = new Map();
  const put = (map, key, e) => key && (map.get(key) || map.set(key, []).get(key)).push(e);
  (list || []).forEach((e) => {
    if (!e || !e.file || !e.speaker) return;
    const entry = { id: e.id, file: e.file, speaker: e.speaker, checked: e.checked || null, kutchi: e.kutchi, phrase: isPhrase(e.kutchi) };
    put(byId, e.id, entry);
    put(byText, norm(e.kutchi), entry);
  });
  // with phrases off (o.phrases === false, or unset and phrasesOn() false) a whole-phrase take is never chosen
  const allowed = (entries, o) => {
    const on = o.phrases == null ? phrasesOn() : o.phrases;
    return on ? entries : (entries || []).filter((e) => !e.phrase);
  };
  return {
    size: (list || []).length,
    takes: (text) => byText.get(norm(text)) || [],
    takesById: (id) => byId.get(id) || [],
    /** the best family clip for a text, trying each spelling in turn (a phrase's clip only with phrases on) */
    match(texts, o = {}) {
      for (const t of [].concat(texts)) {
        if (!t) continue;
        const c = chooseClip(allowed(byText.get(norm(t)), o), o);
        if (c) return c;
      }
      return null;
    },
    byId: (id, o = {}) => chooseClip(allowed(byId.get(id), o), o),
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
export function planClips(segments, index, { path = voicePath(), sayOf = () => null, phrases = phrasesOn() } = {}) {
  const segs = segments || [];
  const items = [];
  const idx = segs.map((s, i) => i).filter((i) => segs[i].lang);
  if (!idx.length) return items;
  const span = (a, b) => [a, b];
  const textOf = (a, b) => segs.slice(a, b + 1).map((s) => s.t).join("");
  const allK = idx.every((i) => segs[i].lang === "k");
  const whole = textOf(0, segs.length - 1).trim();
  const o = { path, phrases };
  if (allK) {
    const fam = index.match(whole, o);
    if (fam) return [{ file: fam.file, text: whole, source: fam.source, tokens: span(idx[0], idx[idx.length - 1]) }];
  }
  // stitched speech (decision 26): every Kutchi word from its own family clip, ahead of any stand-in
  if (!phrases) {
    const stitched = stitch(segs, index, { path, sayOf });
    if (stitched) return stitched;
  }
  if (allK) {
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
      const fam = index.match(text, o);
      if (fam) return items.push({ file: fam.file, text, source: fam.source, tokens: span(run.from, run.to) });
    }
    const t = index.tts((run.lang === "e" ? "en|" : "") + norm(text), { path });
    if (t) return items.push({ file: t.file, text, source: "tts", tokens: span(run.from, run.to) });
    if (run.lang !== "k") return items.push({ text, source: "missing", lang: "e", tokens: span(run.from, run.to) });
    run.parts.forEach((i) => {
      const piece = segs[i].t.trim();
      if (!piece) return;
      const fam = index.match([piece, sayOf(segs[i].w)], o);
      if (fam) return items.push({ file: fam.file, text: piece, source: fam.source, tokens: span(i, i) });
      const tp = index.tts(norm(piece), { path });
      if (tp) return items.push({ file: tp.file, text: piece, source: "tts", tokens: span(i, i) });
      norm(piece)
        .split(" ")
        .filter(Boolean)
        .forEach((w) => {
          const fw = index.match(w, o);
          if (fw) return items.push({ file: fw.file, text: w, source: fw.source, tokens: span(i, i) });
          const tw = index.tts(w, { path });
          if (tw) return items.push({ file: tw.file, text: w, source: "tts", tokens: span(i, i) });
          items.push({ text: w, source: path === "test" ? "device" : "missing", tokens: span(i, i) });
        });
    });
  });
  return items;
}

/**
 * A line said word by word from family clips (phrases off), or null when some Kutchi word has none (the caller
 * then falls back to its stand-ins). A piece that is one word may use its `say` spelling; an English run is its
 * TTS file on the test path, else missing (as in planClips).
 */
function stitch(segs, index, { path, sayOf }) {
  const o = { path, phrases: false };
  const items = [];
  let k = 0;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (!s.lang) continue;
    const piece = String(s.t || "").trim();
    if (!piece) continue;
    if (s.lang !== "k") {
      // an English placeholder run (its following punctuation and spaces join it, as in planClips)
      let j = i;
      while (j + 1 < segs.length && (!segs[j + 1].lang || segs[j + 1].lang === s.lang)) j++;
      const text = segs.slice(i, j + 1).map((x) => x.t).join("").trim();
      const t = index.tts("en|" + norm(text), { path });
      items.push(t ? { file: t.file, text, source: "tts", tokens: [i, j] } : { text, source: "missing", lang: "e", tokens: [i, j] });
      i = j;
      continue;
    }
    const words = norm(piece).split(" ").filter(Boolean);
    if (words.length === 1) {
      const fam = index.match([piece, sayOf(s.w)], o);
      if (!fam) return null;
      items.push({ file: fam.file, text: piece, source: fam.source, tokens: [i, i] });
      k++;
      continue;
    }
    for (const w of words) {
      const fam = index.match(w, o);
      if (!fam) return null;
      items.push({ file: fam.file, text: w, source: fam.source, tokens: [i, i] });
      k++;
    }
  }
  return k ? items : null;
}

/** A browser player: one <audio> at a time, and the device voice for the test path. */
export function browserPlayer() {
  let audio = null;
  // PAN-11 (6 Oct): an interjection (the count word as you tap) pauses the line, plays on its own, and the line
  // carries on where it was
  let over = null;
  let overDone = Promise.resolve();
  let held = null;
  let stopGen = 0;
  const resumeHeld = () => {
    const h = held;
    held = null;
    if (h && h === audio && h.paused && !h.ended) {
      const p = h.play();
      if (p && p.catch) p.catch(() => {});
    }
  };
  return {
    over(url) {
      return (overDone = new Promise((resolve) => {
        try {
          if (over) over.pause();
          if (audio && !audio.paused && !audio.ended) {
            held = audio;
            audio.pause();
          }
          const a = (over = new Audio(stamp(url)));
          const fin = () => {
            if (over === a) over = null;
            resolve(true);
          };
          a.onended = a.onerror = fin;
          const p = a.play();
          if (p && p.catch) p.catch(() => fin());
        } catch (e) {
          resolve(false);
        }
      }));
    },
    resume: resumeHeld,
    async play(url) {
      // the line's next clip waits for an interjection still playing (then carries on); a stop meanwhile cancels it
      const g = stopGen;
      if (over) await overDone;
      if (g !== stopGen) return false;
      return new Promise((resolve) => {
        try {
          if (audio) audio.pause();
          held = null;
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
      stopGen++;
      try {
        held = null;
        if (over) over.pause();
        over = null;
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

export function createVoice({ index, player, path, phrases, gapMs = 40 } = {}) {
  const P = player || (typeof Audio !== "undefined" ? browserPlayer() : { play: async () => true, stop() {}, synth: async () => true });
  const thePath = () => path || voicePath();
  const thePhrases = () => (phrases == null ? phrasesOn() : !!phrases);
  const dev = () => devFlags().has("voice");
  const channels = new Map(); // channel -> {token, done: Promise}
  const V = { log: [], path: thePath };

  V.plan = (result) => {
    if (result && Array.isArray(result.clipPlan) && result.clipPlan.every((c) => c.source)) return result.clipPlan.filter((c) => thePath() === "test" || c.source === "family-ok" || c.source === "missing");
    return planClips((result && (result.segments || result.segs)) || [], index, { path: thePath(), phrases: thePhrases() });
  };
  V.phrases = thePhrases;

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

  /**
   * An interjection over whatever is playing (over: true; PAN-11): the line playing pauses, these clips play, and the
   * line carries on from where it was. Nothing else is stopped; a newer interjection replaces an older one.
   */
  let overTok = 0;
  async function sayOver(items, onWord) {
    const tok = ++overTok;
    for (const it of items) {
      if (tok !== overTok) return false;
      if (onWord) {
        try {
          onWord(it.tokens, it);
        } catch (e) {
          /* the caller's problem */
        }
      }
      const file = it.file && (it.source === "family-ok" || thePath() === "test") ? it.file : null;
      if (file && P.over) await P.over(file);
      else if (file) await P.play(file);
      else if (it.source === "device" && thePath() === "test" && P.synth) await P.synth(it.text);
    }
    if (tok === overTok && P.resume) P.resume();
    return tok === overTok;
  }

  /** Play a Lang result (or {segments}) on a channel. A new line replaces the one playing (queue: true waits). Returns at once. */
  V.say = function (result, { channel = "main", onWord, queue = false, over = false } = {}) {
    if (over) return sayOver(V.plan(result), onWord).then((done) => ({ done }));
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
    const o = { path: thePath(), phrases: thePhrases() };
    const fam = index && index.match([text, say], o);
    if (!fam && index && isPhrase(text)) return V.say({ clipPlan: planClips([{ t: text, lang: "k" }], index, o) }, { channel });
    const t = !fam && index && index.tts(norm(text), o);
    const items = fam || t ? [{ file: (fam || t).file, text, source: (fam || t).source, tokens: [0, 0] }] : [{ text, source: thePath() === "test" ? "device" : "missing", tokens: [0, 0] }];
    return V.say({ clipPlan: items }, { channel });
  };
  V.stop = (channel = "main") => {
    const c = channels.get(channel);
    if (c) (c.token++, (c.playing = false));
    P.stop();
  };
  V.busy = (channel = "main") => !!(channels.get(channel) && channels.get(channel).playing);
  // S04-B (SH-66, decision 75 (3)): the one voice layer. On a page with the shared lifecycle (js/shared/request-popup.js)
  // every stop it makes (a stage end, the end screen, a tap through the request pop-up) silences every channel here too:
  // Cook's lines and the clinic's core lines stop with the clinic's own Kit.Voice, from one call
  const layer = globalThis.Lifecycle && globalThis.Lifecycle.voice;
  if (layer && layer.onStop) {
    V.offLayer = layer.onStop(() => {
      channels.forEach((c) => (c.token++, (c.playing = false)));
      overTok++;
      P.stop();
    });
  }
  return V;
}

export default createVoice;
