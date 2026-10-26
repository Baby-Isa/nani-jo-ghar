// Sound: what plays when the game "speaks". Nothing here changes a game file: SOUND_HOOK is injected into every page
// (addInitScript) and wraps the browser's audio entry points; the page reports each event through a Playwright binding
// (window.__njgLog), so nothing is lost when a flow navigates from one page to the next.
//
// Low level (what actually plays): HTMLMediaElement.play (new Audio(...)), Web Audio buffer sources (Cook's voice files:
// fetch -> decodeAudioData -> start, followed back to the URL they came from), speechSynthesis.speak (the device voice).
// Line level (what the game meant to say): the page wraps Cook.Lang.speak / Cook.speak and the clinic's Voice.say / Voice.now
// as they appear, and reports the start and end of each line, so a line that plays nothing is seen too.
//
// Node side: SoundLog classifies each play by its file against data/family-audio.json (a family clip, and whether it is
// checked), data/cook-tts.json (a computer-voice placeholder), the older word/carrier recordings (not family-listed) and
// the device voice; then attaches plays to the line that was open at the time.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./env.mjs";

export const SOUND_HOOK = `(() => {
  if (window.__njgSoundHook) return;
  window.__njgSoundHook = true;
  const log = (e) => {
    try {
      e.t = Date.now(); e.page = location.pathname.replace(/^\\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) {}
  };
  const flush = setInterval(() => { if (window.__njgLog && window.__njgPending) { const p = window.__njgPending; window.__njgPending = null; p.forEach((e) => window.__njgLog(e)); } }, 100);
  const isAudio = (u) => /\\.(mp3|ogg|wav|m4a|webm)(\\?|$)/i.test(String(u || ""));
  const rel = (u) => { try { const x = new URL(u, location.href); return x.pathname.replace(/^\\//, ""); } catch (e) { return String(u); } };
  // 1. <audio> / new Audio(url).play(). Each play gets an id (pid) and its real length (dur, seconds) once the clip's metadata is in;
  // "play-end" says when it stopped sounding (ended, paused or cut): the contract's voice check (check 3) reads these
  let pidSeq = 0;
  const mp = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    try {
      const u = this.currentSrc || this.src;
      if (isAudio(u)) {
        const pid = ++pidSeq, el = this;
        el.__njgPid = pid;
        const d = isFinite(el.duration) ? el.duration : null;
        log({ type: "play", via: "audio", url: rel(u), pid, dur: d, rate: el.playbackRate || 1 });
        if (d == null) el.addEventListener("loadedmetadata", () => { if (el.__njgPid === pid && isFinite(el.duration)) log({ type: "play-dur", pid, dur: el.duration }); }, { once: true });
        const end = (why) => () => { if (el.__njgPid === pid) { el.__njgPid = null; log({ type: "play-end", pid, why }); } };
        el.addEventListener("ended", end("ended"), { once: true });
        el.addEventListener("pause", end("pause"), { once: true });
        el.addEventListener("error", end("error"), { once: true });
      }
    } catch (e) {}
    return mp.apply(this, arguments);
  };
  // 2. Web Audio: follow a buffer back to the file it was fetched from
  const abUrl = new WeakMap(), bufUrl = new WeakMap();
  const oab = Response.prototype.arrayBuffer;
  Response.prototype.arrayBuffer = function () {
    const u = this.url;
    return oab.apply(this, arguments).then((ab) => { try { if (isAudio(u)) abUrl.set(ab, rel(u)); } catch (e) {} return ab; });
  };
  const dec = BaseAudioContext.prototype.decodeAudioData;
  BaseAudioContext.prototype.decodeAudioData = function (ab, ok, err) {
    const u = abUrl.get(ab);
    const tag = (b) => { try { if (u && b) bufUrl.set(b, u); } catch (e) {} return b; };
    const p = dec.call(this, ab, ok ? (b) => ok(tag(b)) : undefined, err);
    return p && p.then ? p.then(tag) : p;
  };
  const st = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (when, offset, duration) {
    try {
      const u = this.buffer && bufUrl.get(this.buffer);
      if (u) {
        const pid = ++pidSeq, node = this, rate = (this.playbackRate && this.playbackRate.value) || 1;
        let d = this.buffer.duration - (offset || 0);
        if (duration != null) d = Math.min(d, duration);
        node.__njgPid = pid;
        log({ type: "play", via: "webaudio", url: u, pid, dur: d / rate, rate });
        node.addEventListener("ended", () => { if (node.__njgPid === pid) { node.__njgPid = null; log({ type: "play-end", pid, why: "ended" }); } });
      }
    } catch (e) {}
    return st.apply(this, arguments);
  };
  const sp0 = AudioBufferSourceNode.prototype.stop;
  AudioBufferSourceNode.prototype.stop = function () {
    try { if (this.__njgPid) { log({ type: "play-end", pid: this.__njgPid, why: "stop" }); this.__njgPid = null; } } catch (e) {}
    return sp0.apply(this, arguments);
  };
  // a source cut by disconnecting it (or its gain going to nothing) is not seen: the clip's real length still bounds it
  // 3. the device voice
  try {
    if (window.speechSynthesis) {
      const sp = window.speechSynthesis.speak;
      const open = new Set();
      window.speechSynthesis.speak = function (u) {
        try {
          const pid = ++pidSeq, text = String(u && u.text || "");
          open.add(pid);
          try { if (u) u.__njgPid = pid; } catch (e) {} // (the device voice model's lifecycle names its play: lib/device-voice.mjs)
          // the device voice has no file: about 0.4 s a word at its rate (an estimate, marked so)
          log({ type: "play", via: "speechSynthesis", text, pid, dur: Math.max(0.6, text.split(/\\s+/).length * 0.4 / ((u && u.rate) || 1)), est: true });
          if (u && u.addEventListener) u.addEventListener("end", () => { if (open.delete(pid)) log({ type: "play-end", pid, why: "ended" }); });
        } catch (e) {}
        // S13-V (LNG-16): a page given the device voice model (an evidence probe's utter capture) speaks through it
        const dv = window.__njgDeviceVoice;
        return dv ? dv.speak(u) : sp.apply(this, arguments);
      };
      const cancel = window.speechSynthesis.cancel;
      window.speechSynthesis.cancel = function () {
        try { open.forEach((pid) => log({ type: "play-end", pid, why: "cancel" })); open.clear(); } catch (e) {}
        const dv = window.__njgDeviceVoice;
        return dv ? dv.cancel() : cancel.apply(this, arguments);
      };
      const voices = window.speechSynthesis.getVoices;
      window.speechSynthesis.getVoices = function () {
        const dv = window.__njgDeviceVoice;
        return dv ? dv.getVoices() : voices.apply(this, arguments);
      };
    }
  } catch (e) {}
  // 3b. a game's synthesized loop (no file: Cook's sizzle, MAA-11): the game's own "njg-sfx" start and stop events
  // (js/cook/core.js sfxEvent) as a play of "sfx/<name>" and its end. via "sfx": a sound effect, never a voice (the contract's
  // voice checks and the sound summary leave it out; the evidence voice timeline lists it on its own rows)
  try {
    const sfxPid = new Map();
    window.addEventListener("njg-sfx", (ev) => {
      try {
        const d = (ev && ev.detail) || {};
        if (d.on) { const pid = ++pidSeq; sfxPid.set(d.id, pid); log({ type: "play", via: "sfx", url: "sfx/" + String(d.name || "?"), pid, dur: null, quiet: !!d.quiet }); }
        else if (sfxPid.has(d.id)) { log({ type: "play-end", pid: sfxPid.get(d.id), why: "stop" }); sfxPid.delete(d.id); }
      } catch (x) {}
    });
  } catch (e) {}
  // 3c. (S13-V) the other sound effects: the shared Sfx.play by its name (wrapped below), and any oscillator or generated buffer a
  // game starts by itself, named by the file that made it ("sfx/osc:js/cook/core.js"; one row per file per 150 ms), so a sound
  // log lists every effect before and after the effects move into js/shared/sfx.js
  let inSfx = 0;
  const fxLast = {};
  const fxFile = (kind) => {
    try {
      if (inSfx) return;
      const st = String(new Error().stack || "").split("\\n").slice(2).join("\\n");
      const m = /\\/(js\\/[^\\s:)?]+\\.js)/.exec(st);
      const f = m ? m[1] : "?", now = Date.now();
      if (f === "js/core/voice.js" || fxLast[kind + f] > now - 150) return;
      fxLast[kind + f] = now;
      const pid = ++pidSeq;
      log({ type: "play", via: "sfx", url: "sfx/" + kind + ":" + f, pid, dur: null });
      setTimeout(() => log({ type: "play-end", pid, why: "ended" }), 150);
    } catch (e) {}
  };
  try {
    const co = BaseAudioContext.prototype.createOscillator;
    BaseAudioContext.prototype.createOscillator = function () { fxFile("osc"); return co.apply(this, arguments); };
    const cb = BaseAudioContext.prototype.createBuffer;
    BaseAudioContext.prototype.createBuffer = function () { fxFile("noise"); return cb.apply(this, arguments); };
  } catch (e) {}
  function wrapSfx(S) {
    if (!S || typeof S.play !== "function" || S.play.__njgSfx) return;
    const orig = S.play;
    const w = function (name) {
      let r;
      inSfx++;
      try { r = orig.apply(this, arguments); } finally { inSfx--; }
      try { if (r !== false) { const pid = ++pidSeq; log({ type: "play", via: "sfx", url: "sfx/" + String(name), pid, dur: null }); setTimeout(() => log({ type: "play-end", pid, why: "ended" }), 150); } } catch (e) {}
      return r;
    };
    w.__njgSfx = true;
    S.play = w;
  }
  // 4. lines: wrap the games' own "say a line" functions as they appear
  let seq = 0;
  function wrapLine(obj, name, who, textOf) {
    const orig = obj && obj[name];
    if (typeof orig !== "function" || orig.__njgLine) return;
    const w = function () {
      const id = ++seq;
      let text = "";
      try { text = String(textOf.apply(null, arguments) || ""); } catch (e) {}
      // what the line is for, when the game says (decision 80: Cook's "howto" and "passme" lines are not orders)
      let role = null;
      try { role = arguments[0] && typeof arguments[0] === "object" && arguments[0].role ? String(arguments[0].role) : null; } catch (e) {}
      // the speaker: a function of the call's arguments where the game passes one (the clinic's Voice.say(line, {who}))
      let by = who;
      try { by = typeof who === "function" ? String(who.apply(null, arguments) || "") : who; } catch (e) { by = String(who); }
      log(role ? { type: "line", id, who: by, text, name, role } : { type: "line", id, who: by, text, name });
      const done = () => log({ type: "line-end", id });
      let r;
      try { r = orig.apply(this, arguments); } catch (e) { done(); throw e; }
      if (r && typeof r.then === "function") r.then(done, done); else done();
      return r;
    };
    w.__njgLine = true;
    obj[name] = w;
  }
  // the voice stops (every voice layer's "cut it now"): a silent line (no clip could play in the test build) is cut by these
  // too, so the contract's voice check can bound it by its words' real lengths and the stop
  function wrapStop(obj, name, why) {
    const orig = obj && obj[name];
    if (typeof orig !== "function" || orig.__njgStop) return;
    const w = function () { log({ type: "voice-stop", why }); return orig.apply(this, arguments); };
    w.__njgStop = true;
    obj[name] = w;
  }
  const wrapAll = () => {
    try { wrapSfx(window.Sfx); } catch (e) {}
    try {
      wrapStop(window.VoiceStop, "stop", "VoiceStop.stop");
      const CV = window.Cook && window.Cook.core && window.Cook.core.voice;
      if (CV) wrapStop(CV, "stop", "core voice stop");
      const KV = window.Clinic && window.Clinic.Kit && window.Clinic.Kit.Voice;
      if (KV) wrapStop(KV, "clear", "clinic Voice.clear");
      if (window.NjgVoice) wrapStop(window.NjgVoice, "stop", "NjgVoice.stop");
    } catch (e) {}
    try {
      const C = window.Cook;
      if (C && C.Lang && C.Lang.plain) wrapLine(C.Lang, "speak", "cook", (l) => C.Lang.plain(l));
      if (C && C.speak) wrapLine(C, "speak", "cook", (p) => p);
      // day.html (s09-frame): every line goes through window.Day.say; the speaker names the stage ("day:door:nani")
      const D = window.Day;
      if (D && D.say && D.plain) wrapLine(D, "say", (l, o) => "day:" + String(D.stage || "?") + ":" + String((o && o.who) || "nani"), (l) => D.plain(l));
      const K = window.Clinic && window.Clinic.Kit;
      if (K && K.Voice && K.plain) {
        // (D3's ask, S05-C3: each clinic line names its speaker, "clinic:doctor", "clinic:child" ..., not "clinic" alone)
        const clinicWho = (l, o) => "clinic:" + ((o && o.who) || (l && typeof l === "object" && l.who) || "doctor");
        wrapLine(K.Voice, "say", clinicWho, (l) => K.plain(typeof l === "string" ? { english: l } : l));
        wrapLine(K.Voice, "now", clinicWho, (l) => K.plain(l));
      }
    } catch (e) {}
    // the speaker (ART-18): Cook's lines all say "cook", so the shared talk's start names who bobs (talk:nani, talk:ma ...) as a moment
    try {
      const T = window.Lifecycle && window.Lifecycle.talk;
      if (T && typeof T.phaser === "function" && !T.phaser.__njgTalk) {
        const orig = T.phaser;
        const w = function (scene, img) {
          try {
            const key = String((img && img.texture && img.texture.key) || "x");
            log({ type: "m", name: "talk:" + key.split("-")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-") });
          } catch (e) {}
          window.__njgTalkOn = true;
          const stop = orig.apply(this, arguments);
          return typeof stop === "function" ? function () { window.__njgTalkOn = false; return stop.apply(this, arguments); } : stop;
        };
        w.__njgTalk = true;
        T.phaser = w;
      }
    } catch (e) {}
  };
  setInterval(wrapAll, 150);
  window.__njgSoundOff = () => clearInterval(flush);
})();`;

const norm = (s) => String(s || "").toLowerCase().normalize("NFC").replace(/[^\p{L}\p{M}\p{N} ]/gu, "").replace(/\s+/g, " ").trim();

let TABLES = null;
function tables() {
  if (TABLES) return TABLES;
  const fam = new Map();
  const famPath = join(ROOT, "data", "family-audio.json");
  if (existsSync(famPath)) for (const e of JSON.parse(readFileSync(famPath, "utf8"))) if (e && e.file) fam.set(e.file, e);
  const tts = new Map();
  const ttsPath = join(ROOT, "data", "cook-tts.json");
  if (existsSync(ttsPath)) for (const [k, f] of Object.entries(JSON.parse(readFileSync(ttsPath, "utf8")).lines || {})) tts.set(f, k);
  TABLES = { fam, tts };
  return TABLES;
}

// what is this URL? {kind: family-ok | family-unchecked | family-redo (a clip marked to re-record) | tts | other | unknown | device-voice, ...}
export function classify(p) {
  const { fam, tts } = tables();
  if (p.via === "speechSynthesis") return { kind: "device-voice", text: p.text };
  const url = String(p.url || "").split("?")[0];
  if (fam.has(url)) {
    const e = fam.get(url);
    // the same OK set as js/core/voice.js chooseClip: ok, ok-zafar (picked by Zafar, decision 67), ok-auto (decision 70; Zafar,
    // 14 Oct: all 263 play until his re-recording)
    return { kind: ["ok", "ok-zafar", "ok-auto"].includes(e.checked) ? "family-ok" : e.checked === "redo" ? "family-redo" : "family-unchecked", speaker: e.speaker, id: e.id, text: e.kutchi, file: url };
  }
  if (tts.has(url)) return { kind: "tts", text: tts.get(url), file: url };
  if (/assets\/audio\/cook-tts\//.test(url)) return { kind: "tts", text: url.split("/").pop().replace(/\.mp3$/, ""), file: url };
  if (/assets\/audio\/(word|carrier)\//.test(url)) return { kind: "other", text: url.split("/").pop().replace(/\.mp3$/, ""), file: url };
  return { kind: "unknown", text: url, file: url };
}

export class SoundLog {
  constructor() { this.events = []; }
  push(e) { this.events.push(e); }
  // the raw timeline the contract checks read (lib/contract.mjs): lines, plays and their ends, and the contract probe's events
  timeline() { return this.events.filter((e) => e && /^(line|line-end|play|play-end|play-dur|voice-stop|c)$/.test(e.type)); }
  // -> { plays: [{kind, text, id, file, speaker, n}], lines: [{text, who, status, parts: [kinds], n}] }
  summary() {
    const lines = new Map(); // id -> {text, who, t0, t1, plays: []}
    const plays = [];
    for (const e of this.events) {
      if (e.type === "line") lines.set(e.id, { id: e.id, text: e.text, who: e.who, t0: e.t, t1: null, plays: [], page: e.page });
      else if (e.type === "line-end" && lines.has(e.id)) lines.get(e.id).t1 = e.t;
      else if (e.type === "play" && e.via !== "sfx") plays.push({ ...e, c: classify(e) }); // a sound effect is not a line's voice
    }
    for (const p of plays) {
      // the line that was open when it played: the latest one that had started and had not ended (+ a little slack)
      let best = null;
      for (const l of lines.values()) if (l.t0 <= p.t + 5 && (l.t1 == null || p.t <= l.t1 + 60) && (!best || l.t0 >= best.t0)) best = l;
      if (best) best.plays.push(p);
    }
    const playAgg = new Map();
    for (const p of plays) {
      const k = `${p.c.kind}|${p.c.file || p.c.text}`;
      const a = playAgg.get(k) || { kind: p.c.kind, id: p.c.id || "", file: p.c.file || "", text: p.c.text || "", speaker: p.c.speaker || "", n: 0 };
      a.n++; playAgg.set(k, a);
    }
    const lineAgg = new Map();
    for (const l of lines.values()) {
      const text = (l.text || "").trim();
      if (!text) continue;
      const kinds = [...new Set(l.plays.map((p) => p.c.kind))];
      let status;
      if (!kinds.length) status = "silent";
      else if (kinds.every((k) => k === "family-ok")) status = "family-ok";
      else if (kinds.every((k) => k === "family-ok" || k === "family-unchecked")) status = "family-unchecked";
      else if (kinds.includes("tts")) status = "tts";
      else if (kinds.includes("device-voice")) status = "device-voice";
      else status = "other";
      const k = `${norm(text)}|${status}`;
      const a = lineAgg.get(k) || { text, who: l.who, status, parts: kinds, files: [], n: 0 };
      for (const p of l.plays) { const d = p.c.id ? `${p.c.kind}:${p.c.id}` : `${p.c.kind}:${p.c.file || p.c.text}`; if (!a.files.includes(d) && a.files.length < 8) a.files.push(d); }
      a.n++; lineAgg.set(k, a);
    }
    return { plays: [...playAgg.values()], lines: [...lineAgg.values()] };
  }
}

// merge many per-flow summaries into the run's two lists
export function mergeSound(summaries) {
  const lines = new Map();
  const plays = new Map();
  for (const { flow, sound } of summaries) {
    if (!sound) continue;
    for (const l of sound.lines) {
      const k = norm(l.text);
      const a = lines.get(k) || { text: l.text, statuses: {}, files: [], flows: new Set(), n: 0 };
      for (const d of l.files || []) if (!a.files.includes(d) && a.files.length < 8) a.files.push(d);
      a.statuses[l.status] = (a.statuses[l.status] || 0) + l.n;
      a.flows.add(flow); a.n += l.n;
      lines.set(k, a);
    }
    for (const p of sound.plays) {
      const k = `${p.kind}|${p.file || p.text}`;
      const a = plays.get(k) || { ...p, n: 0, flows: new Set() };
      a.n += p.n; a.flows.add(flow); plays.set(k, a);
    }
  }
  const fmt = (m) => [...m.values()].map((x) => ({ ...x, flows: [...x.flows].sort() }));
  const L = fmt(lines);
  const P = fmt(plays);
  // a gap: the line was never heard whole from family clips (it played a computer voice, an older file, the device voice, or nothing)
  const isGap = (l) => !(l.statuses["family-ok"] || l.statuses["family-unchecked"]);
  const gaps = L.filter(isGap).sort((a, b) => b.n - a.n);
  const informational = [
    ...P.filter((p) => ["tts", "family-unchecked", "family-redo", "device-voice", "other", "unknown"].includes(p.kind)).sort((a, b) => b.n - a.n),
  ];
  return { lines: L, plays: P, gaps, informational };
}
