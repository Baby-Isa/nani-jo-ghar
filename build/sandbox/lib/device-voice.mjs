// The device voice, as a phone has it (S13-V, LNG-16). The sandbox's Chromium has no voices: every speechSynthesis.speak() fails at
// once ("synthesis-failed"), so a line said by the device voice looked heard in every timeline and its cancel race was never seen.
// A probe with an `utter` capture gets this model on its page instead (one installed voice; a queue; each utterance starts a beat
// after it reaches the head of the queue and lasts about 0.38 s a word; cancel() interrupts the one speaking and drops every one
// waiting, as the Web Speech spec and Chrome do), and the lifecycle of every utterance is logged. Two things a phone's Chrome does
// that the spec does not promise are modelled too, because they are what LNG-16's silent "muke" looks like:
//   1. the voices load lazily: getVoices() is empty until about VOICES_MS after the page first asks for them (or first speaks),
//      then "voiceschanged" fires; an utterance spoken before the voices are in is never heard (no start, no end)
//   2. a speak() in the same breath as a cancel() (within DROP_MS) is thrown away (the drop js/core/voice.js CANCEL_GAP_MS waits out)
//   {type: "utt", ev: "speak" | "start" | "end" | "cut" | "dropped" | "cancel", uid, pid, text, by, load}
// pid is the sound hook's play id of the same speak() (lib/sound.mjs sets it on the utterance), so a voice timeline can say which
// device-voice part of a line was heard, cut, or never heard at all. Nothing here changes a game file: lib/sound.mjs's speak,
// cancel and getVoices hand over to window.__njgDeviceVoice when it is there (installed by lib/evidence-probe.mjs, before any page
// script runs).
export const START_MS = 80;     // from the head of the queue to "start" (a phone's voice is quick once warm)
export const WORD_MS = 380;     // a word at rate 1
export const MIN_MS = 450;
export const VOICES_MS = 600;   // from the first getVoices() or speak() to the voices being in
export const DROP_MS = 100;     // a speak() this soon after a cancel() is thrown away

// an utterance's spoken length (ms) at its rate
export const uttMs = (text, rate = 1) => Math.max(MIN_MS, Math.round((String(text || "").trim().split(/\s+/).filter(Boolean).length * WORD_MS) / (rate || 1)));

// who called cancel(): the first game frames of the stack (js/...:line), the hook's own frames left out
export function callerOf(stack) {
  const out = [];
  for (const m of String(stack || "").matchAll(/\/((?:js|lib)\/[^\s:)?]+\.js)(?:\?[^\s:)]*)?:(\d+)/g)) {
    const f = `${m[1]}:${m[2]}`;
    if (!out.includes(f)) out.push(f);
    if (out.length >= 3) break;
  }
  return out.join(" < ");
}

// utts: the logged events of one page -> one row per utterance {uid, pid, text, speak, start, end, outcome, by, load}
// outcome: "heard" (started and ended), "cut" (started, then cancelled), "silent" (cancelled or dropped before it started),
// "pending" (never started by the page's end)
export function utterances(utts) {
  const by = new Map();
  for (const e of utts || []) {
    if (!e || e.type !== "utt" || e.ev === "cancel") continue;
    const k = `${e.load}|${e.uid}`;
    if (!by.has(k)) by.set(k, { uid: e.uid, pid: e.pid, load: e.load, page: e.page, text: e.text, speak: null, start: null, end: null, outcome: "pending", by: null });
    const u = by.get(k);
    if (e.ev === "speak") u.speak = e.t;
    else if (e.ev === "start") u.start = e.t;
    else if (e.ev === "end") { u.end = e.t; u.outcome = "heard"; }
    else if (e.ev === "cut") { u.end = e.t; u.outcome = "cut"; u.by = e.by || null; }
    else if (e.ev === "dropped") { u.end = e.t; u.outcome = "silent"; u.by = e.by || e.why || null; }
  }
  return [...by.values()].sort((a, b) => (a.speak || 0) - (b.speak || 0));
}

// the utterance a sound-hook play (Contract.voice's plays: pid "<load>|<n>", t0) was: the same play id spoken within 60 ms
export function uttOfPlay(list, play) {
  const n = String(play && play.pid != null ? play.pid : "").split("|").pop();
  return (list || []).find((u) => String(u.pid) === n && u.speak != null && Math.abs(u.speak - play.t0) <= 60) || null;
}

// the page side (an init script)
export const DEVICE_VOICE = `(() => {
  if (window.__njgDeviceVoice) return;
  const LOAD = Math.random().toString(36).slice(2, 8);
  const log = (e) => {
    try {
      e.type = "utt"; e.t = Date.now(); e.load = LOAD; e.page = location.pathname.replace(/^\\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) {}
  };
  const START_MS = ${START_MS}, WORD_MS = ${WORD_MS}, MIN_MS = ${MIN_MS}, VOICES_MS = ${VOICES_MS}, DROP_MS = ${DROP_MS};
  // the voices load lazily (asked for the first time by getVoices() or speak()), then "voiceschanged"
  let voicesAt = null, cancelAt = -1e9;
  const askVoices = () => {
    if (voicesAt != null) return;
    voicesAt = Date.now() + VOICES_MS;
    log({ ev: "voices-asked", at: voicesAt });
    setTimeout(() => { try { const S = window.speechSynthesis; if (S && S.dispatchEvent) S.dispatchEvent(new Event("voiceschanged")); } catch (x) {} }, VOICES_MS);
  };
  const voicesIn = () => voicesAt != null && Date.now() >= voicesAt;
  const lenOf = (u) => Math.max(MIN_MS, Math.round(String(u.text || "").trim().split(/\\s+/).filter(Boolean).length * WORD_MS / ((u && u.rate) || 1)));
  const fire = (u, type, error) => {
    try { const ev = new Event(type); if (error) Object.defineProperty(ev, "error", { value: error }); u.dispatchEvent(ev); } catch (x) {}
  };
  // the voice an utterance may be given (a real SpeechSynthesisVoice cannot be made: the utterance's voice is kept as given)
  const VOICE = { name: "Sandbox device voice", lang: "en-IN", localService: true, default: true, voiceURI: "njg-sandbox-en-IN" };
  try {
    const N = window.SpeechSynthesisUtterance;
    if (N) {
      class U extends N { get voice() { return this.__njgVoice || null; } set voice(v) { this.__njgVoice = v || null; } }
      window.SpeechSynthesisUtterance = U;
    }
  } catch (x) {}
  let seq = 0;
  const queue = [];
  let now = null, timer = null;
  const next = () => {
    if (now || !queue.length) return;
    now = queue.shift();
    const u = now;
    timer = setTimeout(() => {
      if (now !== u) return;
      u.__njgStarted = true;
      log({ ev: "start", uid: u.__njgUid, pid: u.__njgPid || null, text: u.text });
      fire(u, "start");
      timer = setTimeout(() => {
        if (now !== u) return;
        now = null;
        log({ ev: "end", uid: u.__njgUid, pid: u.__njgPid || null, text: u.text });
        fire(u, "end");
        next();
      }, lenOf(u));
    }, START_MS);
  };
  const who = () => {
    let by = "";
    try {
      const st = String(new Error().stack || "");
      const fr = [];
      for (const m of st.matchAll(/\\/((?:js|lib)\\/[^\\s:)?]+\\.js)(?:\\?[^\\s:)]*)?:(\\d+)/g)) { const f = m[1] + ":" + m[2]; if (!fr.includes(f)) fr.push(f); if (fr.length >= 3) break; }
      by = fr.join(" < ");
      const L = window.VoiceStop && window.VoiceStop.last;
      if (L && Date.now() - L.at < 30) by = "VoiceStop.stop(" + JSON.stringify(L.reason || "") + ")" + (by ? " " + by : "");
    } catch (x) {}
    return by;
  };
  window.__njgDeviceVoice = {
    speak(u) {
      if (!u) return;
      u.__njgUid = ++seq;
      log({ ev: "speak", uid: u.__njgUid, pid: u.__njgPid || null, text: String(u.text || "") });
      const early = !voicesIn();
      askVoices();
      // never heard: spoken before the voices were in, or in the same breath as a cancel
      if (early || Date.now() - cancelAt < DROP_MS) {
        log({ ev: "dropped", uid: u.__njgUid, pid: u.__njgPid || null, text: u.text, why: early ? "spoken before the device's voices were in" : "spoken in the same breath as a cancel" });
        return;
      }
      queue.push(u);
      next();
    },
    cancel() {
      const by = who();
      cancelAt = Date.now();
      log({ ev: "cancel", by, n: (now ? 1 : 0) + queue.length });
      const u = now, waiting = queue.splice(0);
      now = null; clearTimeout(timer);
      if (u) {
        if (u.__njgStarted) { log({ ev: "cut", uid: u.__njgUid, pid: u.__njgPid || null, text: u.text, by }); fire(u, "error", "interrupted"); }
        else { log({ ev: "dropped", uid: u.__njgUid, pid: u.__njgPid || null, text: u.text, by }); fire(u, "error", "canceled"); }
      }
      for (const w of waiting) { log({ ev: "dropped", uid: w.__njgUid, pid: w.__njgPid || null, text: w.text, by }); fire(w, "error", "canceled"); }
    },
    getVoices() { askVoices(); return voicesIn() ? [VOICE] : []; },
    get speaking() { return !!now; },
    get pending() { return queue.length > 0; },
  };
})();`;
