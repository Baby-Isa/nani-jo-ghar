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
 *       (a page passes js/core/voice-player.js's Web Audio player; with none, nothing is heard: Node, the robot)
 *   V.plan(result) -> [{ file?, text, source, tokens: [from, to] }]     a Lang result's clip plan, resolved
 *   V.say(result, { channel = "main", onWord, onStart, queue = false, ifIdle, key, ttl }) -> Promise<{ done }>   never blocks input
 *       onWord(tokens, item): a piece is next; onStart(tokens, item): it is really heard (its clip started, or the device voice)
 *       queue: false replaces what the channel is saying (the clinic's lines); queue: true waits its turn and cuts nothing
 *       (Cook's one speech queue, PAN-04); ifIdle: said only when the channel is silent and empty (an item word on a tap,
 *       SH-94); key: a waiting line with the same key is dropped for this newer one (the newest count is said); ttl: ms
 *       a waiting line may wait for its turn before it is dropped (a late number is not said, P10)
 *   V.word(text, { say })   one word or short line by its text      V.stop(channel)      V.busy(channel) (saying or waiting)
 *   deviceSpeak(text, { rate = 1 }) -> Promise   the device voice (test path only): waits out a cancel (LNG-16), then speaks
 *   planClips(segments, index, { path, phrases }) -> clip plan     (used by the Lang seam)
 *   phrasesOn() -> false until the pre-publish pass;  isPhrase(text) -> more than one word
 */
import { build, devFlags, query, stamp } from "./env.js";
import { norm, voicePath, phrasesOn, isPhrase, chooseClip, planClips } from "./voice-clips.js";

// the clip rules live beside this file; callers keep asking this one for them
export * from "./voice-clips.js";

/** The device voice's speed: normal (LNG-09, 17 Oct: "the weird robotic slow voice ... speed the voices up"). */
export const DEVICE_RATE = 1;
/** How long after a speechSynthesis.cancel() the browser takes a new utterance (Chrome drops one spoken in the same breath). */
export const CANCEL_GAP_MS = 180;
/**
 * LNG-16 (17 Oct: "I didn't hear the muke ... the opening card"): the stop that opens every request pop-up cancels the device
 * voice (js/shared/request-popup.js VoiceStop.stop), and the opening line's first stand-in word was spoken in the same breath,
 * which the browser throws away. The cancel is noted here, and deviceSpeak waits out CANCEL_GAP_MS after it.
 */
function watchCancel(S) {
  if (!S || S.__njgCancelWatch) return S;
  try {
    const c = S.cancel;
    S.cancel = function () {
      S.__njgCancelAt = Date.now();
      return c.apply(this, arguments);
    };
    S.__njgCancelWatch = true;
  } catch (e) {
    /* a read-only synth: no gap to keep */
  }
  return S;
}
/**
 * LNG-16 (S13-V): a phone's Chrome loads its voices lazily: getVoices() is empty until a beat after the page first asks, and an
 * utterance spoken before they are in is never heard. The opening "muke" was the page's first device-voice word, so it was the
 * one lost. The voices are asked for as this module loads (long before the first order), and deviceSpeak waits for them, at most
 * VOICES_WAIT_MS from that first ask (a device with no voice at all is never waited on again).
 */
export const VOICES_WAIT_MS = 1200;
function warmVoices(S) {
  if (!S || S.__njgVoicesAsked) return S;
  try {
    S.__njgVoicesAsked = Date.now();
    const seen = () => {
      try {
        if (((S.getVoices && S.getVoices()) || []).length) S.__njgVoicesIn = true;
      } catch (e) {
        /* no voices */
      }
    };
    if (S.addEventListener) S.addEventListener("voiceschanged", seen);
    seen();
  } catch (e) {
    /* a synth without voices */
  }
  return S;
}
async function voicesIn(S) {
  warmVoices(S);
  const until = (S.__njgVoicesAsked || Date.now()) + VOICES_WAIT_MS;
  for (;;) {
    try {
      if (S.__njgVoicesIn || ((S.getVoices && S.getVoices()) || []).length) return (S.__njgVoicesIn = true);
    } catch (e) {
      return false;
    }
    if (Date.now() >= until) return false;
    await new Promise((r) => setTimeout(r, 50));
  }
}
// voice: a voice, a function that picks one once the voices are in, "default" (the device's own), or null (Gujarati, Hindi,
// Indian English, else the first); volume: 0-1 (a whisper)
export function deviceSpeak(text, { rate = DEVICE_RATE, voice = null, volume = 1, onStart = null, wait = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  const S = globalThis.speechSynthesis;
  if (!S || !globalThis.SpeechSynthesisUtterance) return Promise.resolve(false);
  watchCancel(S);
  return voicesIn(S).then(() => speakNow(S, text, { rate, voice, volume, onStart, wait }));
}
// (SH-314: a line still being spoken; stopAll lets each go at once, and a line let go of clears its own safety timers, so a stop leaves
// no timer running: Cook's mount test)
const speaking = new Set();
function speakNow(S, text, { rate, voice, volume, onStart, wait }) {
  return new Promise((resolve) => {
    let done = false;
    const timers = [];
    const fin = (v) => {
      if (done) return;
      done = true;
      timers.forEach((t) => clearTimeout(t));
      speaking.delete(fin);
      resolve(v);
    };
    speaking.add(fin);
    const go = () => {
      try {
        const vs = (S.getVoices && S.getVoices()) || [];
        const chosen = typeof voice === "function" ? voice() : voice;
        const v = chosen === "default" ? null : chosen || vs.find((x) => /^gu/i.test(x.lang)) || vs.find((x) => /^hi/i.test(x.lang)) || vs.find((x) => /^en-IN/i.test(x.lang)) || vs[0];
        const u = new globalThis.SpeechSynthesisUtterance(text);
        if (v) (u.voice = v), (u.lang = v.lang);
        u.rate = rate;
        if (volume != null && volume !== 1) u.volume = volume;
        let started = false;
        u.onstart = () => {
          started = true;
          try {
            if (onStart) onStart();
          } catch (e) {
            /* the caller's problem */
          }
        };
        // it ends when the browser says so (so the next piece never starts under it); a voice that never starts (none
        // installed) or never ends is let go of
        u.onend = u.onerror = () => fin(true);
        S.speak(u);
        // (no voice installed at all: let go of it almost at once, so a test browser is not held up)
        timers.push(setTimeout(() => !started && fin(false), vs.length ? 900 : 250));
        timers.push(setTimeout(() => fin(true), 1500 + 300 * String(text).length));
      } catch (e) {
        fin(false);
      }
    };
    const since = Date.now() - (S.__njgCancelAt || 0);
    if (since < CANCEL_GAP_MS) wait(CANCEL_GAP_MS - since).then(go);
    else go();
  });
}

try {
  watchCancel(globalThis.speechSynthesis); // note every cancel from the start, whoever makes it (the request pop-up's stop)
  warmVoices(globalThis.speechSynthesis); // LNG-16: the voices asked for now, so they are in before the first order
} catch (e) {
  /* no device voice */
}

export function createVoice({ index, player, path, phrases, gapMs = 40 } = {}) {
  const P = player || { play: async () => true, stop() {}, synth: async () => true };
  const thePath = () => path || voicePath();
  const thePhrases = () => (phrases == null ? phrasesOn() : !!phrases);
  const dev = () => devFlags().has("voice");
  // channel -> {gen, tail, live, entries}: every line on a channel is an entry in one queue. gen counts the stops: an entry
  // made before a stop never plays after it. live counts the entries saying or waiting (busy)
  const channels = new Map();
  const chan = (name) => channels.get(name) || channels.set(name, { gen: 0, tail: Promise.resolve(), live: 0, entries: [] }).get(name);
  const V = { log: [], path: thePath };

  V.plan = (result) => {
    if (result && Array.isArray(result.clipPlan) && result.clipPlan.every((c) => c.source)) return result.clipPlan.filter((c) => thePath() === "test" || c.source === "family-ok" || c.source === "missing");
    return planClips((result && (result.segments || result.segs)) || [], index, { path: thePath(), phrases: thePhrases() });
  };
  V.phrases = thePhrases;
  V.deviceSpeak = deviceSpeak;

  async function playItems(items, c, entry, onWord, onStart) {
    const alive = () => !entry.cancelled && entry.gen === c.gen;
    for (const it of items) {
      if (!alive()) return false;
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
      const heard = onStart ? { onStart: () => onStart(it.tokens, it) } : undefined;
      if (it.file && (it.source === "family-ok" || thePath() === "test")) await P.play(it.file, heard);
      else if (it.source === "device" && thePath() === "test" && P.synth) await P.synth(it.text, heard);
      if (gapMs && items.length > 1) await new Promise((r) => setTimeout(r, gapMs));
    }
    return alive();
  }

  /**
   * An interjection over whatever is playing (over: true; PAN-11): the line playing pauses, these clips play, and the
   * line carries on from where it was. Nothing else is stopped; a newer interjection replaces an older one. (Cook no longer
   * uses it since PAN-04's one queue: a count waits its turn; kept for a host that wants the old behaviour.)
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

  /**
   * Play a Lang result (or {segments}) on a channel. Returns at once (input never waits for a voice).
   *   queue false (default): replaces what the channel is saying (a new line cuts the old).
   *   queue true: waits for the lines before it and cuts nothing (PAN-04: one speech queue; a stop still clears it).
   *   ifIdle true: said only when nothing is saying or waiting on the channel, else dropped ({done: false, skipped: true}).
   *   key: a waiting line with the same key is dropped for this one (the newest count); ttl: ms it may wait for its turn.
   */
  V.say = function (result, { channel = "main", onWord, onStart, queue = false, over = false, ifIdle = false, key = null, ttl = null } = {}) {
    if (over) return sayOver(V.plan(result), onWord).then((done) => ({ done }));
    const c = chan(channel);
    if (ifIdle && c.live > 0) return Promise.resolve({ done: false, skipped: true });
    const items = V.plan(result);
    if (!queue) {
      // replace: whatever the channel says or has waiting goes
      c.gen++;
      c.entries.forEach((e) => (e.cancelled = true));
      P.stop();
      c.tail = Promise.resolve();
    }
    if (key) c.entries.forEach((e) => e.key === key && !e.started && (e.cancelled = true));
    const entry = { gen: c.gen, key, started: false, cancelled: false, until: ttl == null ? null : Date.now() + ttl };
    c.entries.push(entry);
    c.live++;
    entry.done = c.tail
      .catch(() => {})
      .then(async () => {
        if (entry.cancelled || entry.gen !== c.gen || (entry.until != null && Date.now() > entry.until)) return { done: false };
        entry.started = true;
        return { done: await playItems(items, c, entry, onWord, onStart) };
      })
      .finally(() => {
        c.live = Math.max(0, c.live - 1);
        c.entries.splice(c.entries.indexOf(entry), 1);
      });
    c.tail = entry.done;
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
  const clear = (c) => {
    c.gen++;
    c.entries.forEach((e) => (e.cancelled = true));
    c.tail = Promise.resolve();
  };
  V.stop = (channel = "main") => {
    const c = channels.get(channel);
    if (c) clear(c);
    P.stop();
  };
  V.busy = (channel = "main") => !!(channels.get(channel) && channels.get(channel).live > 0);
  // S04-B (SH-66, decision 75 (3)): the one voice layer. On a page with the shared lifecycle (js/shared/request-popup.js)
  // every stop it makes (a stage end, the end screen, a tap through the request pop-up) silences every channel here too:
  // Cook's lines and the clinic's core lines stop with the clinic's own Kit.Voice, from one call
  const layer = globalThis.Lifecycle && globalThis.Lifecycle.voice;
  if (layer && layer.onStop) {
    V.offLayer = layer.onStop(() => {
      channels.forEach(clear);
      overTok++;
      P.stop();
    });
  }
  return V;
}

/* ---------------- the one voice for the classic scripts (S13-V) ----------------
 * The clinic's kit, the conversations, the story, the end screen's words and the help kit are plain scripts: they play every
 * clip and every device-voice word through window.NjgVoice, set here (the only place a voice is made: the static check 'voice').
 * The same rules as createVoice: on the STORE path only a family clip marked OK plays (chooseClip's rule, by the clip's file) and
 * never the device voice; on the TEST path a clip plays as given and the device voice stands in, as before (G14). One stop
 * (NjgVoice.stop, and every stop of the shared lifecycle's voice layer) silences all of it.
 *   NjgVoice.clip(url, {volume, rate, path}) -> {done: Promise<played>, cut(), el, blocked}   a family clip (url as given)
 *   NjgVoice.device(text, {rate, volume, lang: "k" | "en" | null, cancel}) -> Promise<heard>    test path only
 *   NjgVoice.allowed(file) / NjgVoice.path() / NjgVoice.stop()
 */
const OK_CHECKS = ["ok", "ok-zafar", "ok-auto"];
let famByFile = null;
function familyFiles() {
  if (famByFile) return famByFile;
  famByFile = new Map();
  const p = globalThis.njgFamilyAudio;
  if (p && p.then)
    p.then((list) => (list || []).forEach((e) => e && e.file && famByFile.set(e.file, e))).catch(() => {});
  return famByFile;
}
const fileOf = (url) => String(url || "").split("?")[0].replace(/^(\.\.?\/)+/, "").replace(/^.*?(assets\/audio\/)/, "$1");
/** May this clip play on this path? Test: yes. Store: only a family clip marked OK (never an unchecked, redo or stand-in file). */
export function clipAllowed(url, path = voicePath()) {
  if (path !== "store") return true;
  const e = familyFiles().get(fileOf(url));
  return !!e && OK_CHECKS.includes(e.checked);
}
const liveClips = new Set();
export function playClip(url, { volume = 1, rate = null, path = voicePath() } = {}) {
  const h = { el: null, blocked: false, cut: () => {} };
  h.done = new Promise((resolve) => {
    if (!url || typeof Audio === "undefined" || !clipAllowed(url, path)) return resolve(false);
    let fin = false;
    let untrack = () => {};
    const end = (ok) => {
      if (fin) return;
      fin = true;
      liveClips.delete(h);
      untrack();
      resolve(ok);
    };
    try {
      const a = (h.el = new Audio(url));
      if (volume !== 1) a.volume = volume;
      if (rate) {
        a.playbackRate = rate;
        try {
          a.preservesPitch = false;
        } catch (e) {
          /* ignore */
        }
      }
      // stopped: the clip pauses and counts as said
      h.cut = () => {
        try {
          a.pause();
        } catch (e) {
          /* gone */
        }
        end(true);
      };
      liveClips.add(h);
      if (globalThis.Sfx && globalThis.Sfx.hush) globalThis.Sfx.hush(); // (the sound effects go quiet under a voice)
      const layer = globalThis.Lifecycle && globalThis.Lifecycle.voice;
      if (layer && layer.track) untrack = layer.track(a, h.cut) || untrack;
      a.onended = () => end(true);
      a.onerror = () => end(false);
      const p = a.play();
      if (p && p.catch)
        p.catch((e) => {
          if (e && e.name === "NotAllowedError") h.blocked = true;
          end(false);
        });
    } catch (e) {
      end(false);
    }
  });
  return h;
}
const VOICE_PREF = { k: [/^gu/i, /^hi/i, /^en-IN/i], en: [/^en-GB/i, /^en-IN/i, /^en/i] };
/** The device voice for a classic script: test path only (the store app never speaks with it). */
export function speakDevice(text, { rate = DEVICE_RATE, volume = 1, lang = "k", cancel = false, path = voicePath() } = {}) {
  const S = globalThis.speechSynthesis;
  if (path === "store" || !text || !S) return Promise.resolve(false);
  if (cancel) {
    try {
      watchCancel(S).cancel();
    } catch (e) {
      /* no voice */
    }
  }
  const pick = () => {
    const vs = (S.getVoices && S.getVoices()) || [];
    if (!lang) return "default";
    for (const re of VOICE_PREF[lang] || VOICE_PREF.k) {
      const v = vs.find((x) => x.lang && re.test(String(x.lang).replace("_", "-")));
      if (v) return v;
    }
    return lang === "en" ? "default" : vs[0] || null;
  };
  return deviceSpeak(text, { rate, volume, voice: pick });
}
export function stopAll() {
  liveClips.forEach((h) => h.cut());
  liveClips.clear();
  [...speaking].forEach((fin) => fin(false));
  try {
    if (globalThis.speechSynthesis) watchCancel(globalThis.speechSynthesis).cancel();
  } catch (e) {
    /* no voice */
  }
}
if (typeof globalThis !== "undefined" && !globalThis.NjgVoice) {
  // (busy: a family clip is sounding now: the sound effects' voice gate reads it, Sfx.speaking)
  globalThis.NjgVoice = { clip: playClip, device: speakDevice, allowed: clipAllowed, path: voicePath, stop: stopAll, deviceSpeak, busy: () => liveClips.size > 0 };
  try {
    const layer = globalThis.Lifecycle && globalThis.Lifecycle.voice;
    if (layer && layer.onStop) layer.onStop(() => liveClips.forEach((h) => h.cut()));
  } catch (e) {
    /* no lifecycle on this page */
  }
}

export default createVoice;
