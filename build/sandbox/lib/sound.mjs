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
  // 1. <audio> / new Audio(url).play()
  const mp = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    try { const u = this.currentSrc || this.src; if (isAudio(u)) log({ type: "play", via: "audio", url: rel(u) }); } catch (e) {}
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
  AudioBufferSourceNode.prototype.start = function () {
    try { const u = this.buffer && bufUrl.get(this.buffer); if (u) log({ type: "play", via: "webaudio", url: u }); } catch (e) {}
    return st.apply(this, arguments);
  };
  // 3. the device voice
  try {
    if (window.speechSynthesis) {
      const sp = window.speechSynthesis.speak;
      window.speechSynthesis.speak = function (u) {
        try { log({ type: "play", via: "speechSynthesis", text: String(u && u.text || "") }); } catch (e) {}
        return sp.apply(this, arguments);
      };
    }
  } catch (e) {}
  // 4. lines: wrap the games' own "say a line" functions as they appear
  let seq = 0;
  function wrapLine(obj, name, who, textOf) {
    const orig = obj && obj[name];
    if (typeof orig !== "function" || orig.__njgLine) return;
    const w = function () {
      const id = ++seq;
      let text = "";
      try { text = String(textOf.apply(null, arguments) || ""); } catch (e) {}
      log({ type: "line", id, who, text, name });
      const done = () => log({ type: "line-end", id });
      let r;
      try { r = orig.apply(this, arguments); } catch (e) { done(); throw e; }
      if (r && typeof r.then === "function") r.then(done, done); else done();
      return r;
    };
    w.__njgLine = true;
    obj[name] = w;
  }
  const wrapAll = () => {
    try {
      const C = window.Cook;
      if (C && C.Lang && C.Lang.plain) wrapLine(C.Lang, "speak", "cook", (l) => C.Lang.plain(l));
      if (C && C.speak) wrapLine(C, "speak", "cook", (p) => p);
      const K = window.Clinic && window.Clinic.Kit;
      if (K && K.Voice && K.plain) {
        wrapLine(K.Voice, "say", "clinic", (l) => K.plain(typeof l === "string" ? { english: l } : l));
        wrapLine(K.Voice, "now", "clinic", (l) => K.plain(l));
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
    return { kind: e.checked === "ok" ? "family-ok" : e.checked === "redo" ? "family-redo" : "family-unchecked", speaker: e.speaker, id: e.id, text: e.kutchi, file: url };
  }
  if (tts.has(url)) return { kind: "tts", text: tts.get(url), file: url };
  if (/assets\/audio\/cook-tts\//.test(url)) return { kind: "tts", text: url.split("/").pop().replace(/\.mp3$/, ""), file: url };
  if (/assets\/audio\/(word|carrier)\//.test(url)) return { kind: "other", text: url.split("/").pop().replace(/\.mp3$/, ""), file: url };
  return { kind: "unknown", text: url, file: url };
}

export class SoundLog {
  constructor() { this.events = []; }
  push(e) { this.events.push(e); }
  // -> { plays: [{kind, text, id, file, speaker, n}], lines: [{text, who, status, parts: [kinds], n}] }
  summary() {
    const lines = new Map(); // id -> {text, who, t0, t1, plays: []}
    const plays = [];
    for (const e of this.events) {
      if (e.type === "line") lines.set(e.id, { id: e.id, text: e.text, who: e.who, t0: e.t, t1: null, plays: [], page: e.page });
      else if (e.type === "line-end" && lines.has(e.id)) lines.get(e.id).t1 = e.t;
      else if (e.type === "play") plays.push({ ...e, c: classify(e) });
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
