/*
 * The voice player: the family's recordings played through the page's sound (Web Audio). A phone's browser keeps a
 * page silent until it is tapped and refuses a clip asked for before that, and a clip fetched only when it is due
 * starts late or is cut by the next line; so here:
 *   - the sound is woken by the first tap and by every tap after it (a phone may put it to sleep again);
 *   - a clip is fetched and decoded ahead (`load`, called as soon as a line is built), so its turn never waits on the network;
 *   - the silence a recording left at either end is cut, and it plays at the family's loudness (data/kit.json `voice`);
 *   - every clip ends: when it has played, when it is stopped (even while it is still loading), or by its own length if
 *     the browser never says so; and a download or decode that takes too long gives up. Nothing waiting for a voice is
 *     ever held up, and a stopped line never keeps the round's sounds quiet.
 *   - held (behind the turn card), the voice pauses where it is and goes on from there.
 * A word with no recording is read by the device voice (the test path only), which the voice module provides.
 *
 *   const P = webAudioPlayer({ settings, synth })
 *   P.play(url, { onStart? }) -> Promise<played>   onStart({ ms }): the clip has really started (loaded, decoded, the sound
 *       awake); ms: how long the part of it that plays lasts
 *   P.stop()   P.load(url) -> Promise<buffer | null>   P.hold(on)   P.synth(text) -> Promise
 */
import { stamp } from "./env.js";

const TAPS = ["pointerdown", "pointerup", "touchend", "click", "keydown"];

export function webAudioPlayer({ settings, synth = null }) {
  const V = settings;
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  let ctx = null;
  let decoder = null;
  const buffers = new Map(); // url -> Promise<AudioBuffer | null>
  const spans = new WeakMap(); // buffer -> { at, dur }: the part worth playing
  const loading = new Set(); // the plays still waiting for their clip: a stop lets each of them go
  let current = null; // { src, finish }
  let gen = 0; // counts the stops: a clip still loading when stopped never starts
  let held = false;
  const hearing = new Set(); // clips playing that have not been heard yet: asked again when the sound wakes or the hold lifts

  /** Woken on every tap: a phone's browser allows sound only from a tap, and may suspend it again later. */
  function wake() {
    try {
      if (!ctx && AC) ctx = new AC();
      if (!ctx) return;
      if (ctx.state !== "running" && !held) ctx.resume().catch(() => {});
      // (an old iPhone wakes only once something has played inside the tap: one silent sample)
      const s = ctx.createBufferSource();
      s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      s.connect(ctx.destination);
      s.start(0);
    } catch (e) {
      /* no sound on this device */
    }
  }
  TAPS.forEach((t) => globalThis.addEventListener(t, wake, { capture: true, passive: true }));

  const within = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(() => r(null), ms))]);

  /** Decoded off the live sound (no sound may start before the first tap, but a clip can be made ready). */
  function decode(data) {
    const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
    const c = ctx || decoder || (OAC ? (decoder = new OAC(1, 1, 44100)) : null);
    if (!c) return Promise.resolve(null);
    return new Promise((resolve) => {
      const p = c.decodeAudioData(data, resolve, () => resolve(null));
      if (p && p.catch) p.catch(() => resolve(null));
    });
  }

  /** A clip ready to play, or null: a download or decode that takes longer than loadMs gives up (tried again next time). */
  function load(url) {
    if (!url || !AC) return Promise.resolve(null);
    if (!buffers.has(url)) {
      const abort = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timer = setTimeout(() => abort && abort.abort(), V.loadMs);
      const got = fetch(stamp(url), abort ? { signal: abort.signal } : {})
        .then((r) => (r.ok ? r.arrayBuffer() : null))
        .then((data) => (data ? decode(data) : null))
        .catch(() => null);
      const p = within(got, V.loadMs).then((b) => (clearTimeout(timer), b));
      p.then((b) => b || buffers.delete(url));
      buffers.set(url, p);
    }
    return buffers.get(url);
  }

  /** From just before the first sound to just after the last, measured once per clip. */
  function spanOf(buf) {
    if (spans.has(buf)) return spans.get(buf);
    const T = V.trim;
    let span = { at: 0, dur: buf.duration };
    try {
      const data = buf.getChannelData(0);
      let peak = 0;
      for (let i = 0; i < data.length; i += 4) peak = Math.max(peak, Math.abs(data[i]));
      const floor = Math.max(T.floorMin, peak * T.floorShare);
      let a = 0;
      let b = data.length - 1;
      while (a < b && Math.abs(data[a]) < floor) a++;
      while (b > a && Math.abs(data[b]) < floor) b--;
      const at = Math.max(0, a / buf.sampleRate - T.leadS);
      const end = Math.min(buf.duration, b / buf.sampleRate + T.tailS);
      if (peak > 0 && end - at > T.minS) span = { at, dur: end - at };
    } catch (e) {
      /* the whole clip */
    }
    spans.set(buf, span);
    return span;
  }

  function stop() {
    gen++;
    loading.forEach((go) => go());
    loading.clear();
    const c = current;
    current = null;
    if (c) c.finish(false);
    // (a device word stops itself: its line is no longer alive, js/core/voice.js deviceSpeak's due)
  }

  /** Held: the sound sleeps and the clip's own clock stands still; let go, both go on from where they were. */
  function hold(on) {
    held = !!on;
    try {
      if (ctx) (on ? ctx.suspend() : ctx.resume()).catch(() => {});
      const S = globalThis.speechSynthesis;
      if (S) on ? S.pause() : S.resume();
    } catch (e) {
      /* no sound on this device */
    }
    if (!on) hearing.forEach((f) => f());
  }

  async function play(url, { onStart = null } = {}) {
    const g = gen;
    const buf = await new Promise((resolve) => {
      const go = () => resolve(null);
      loading.add(go);
      load(url).then((b) => (loading.delete(go), resolve(b)));
    });
    if (!buf || g !== gen) return false;
    if (!ctx && AC) ctx = new AC(); // (before any tap it stays silent, and the clip still ends on time)
    if (!ctx) return false;
    // (asleep, woken by a clip asked for too, not only by a tap: the phone may have given the sound to something else, or a
    // page that already has its tap opens with no start button)
    if (ctx.state !== "running" && ctx.state !== "closed" && !held) ctx.resume().catch(() => {});
    if (current) current.finish(false);
    return new Promise((resolve) => {
      const span = spanOf(buf);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = V.gain;
      src.connect(gain).connect(ctx.destination);
      let done = false;
      let left = span.dur * 1000 + V.endPadMs;
      // heard only with the sound awake: before a tap a phone keeps it asleep, and held it is asleep on purpose; a clip that
      // starts asleep is heard from the moment the sound wakes, if it is still playing then
      let heard = false;
      const hear = () => {
        if (heard || done || !onStart || held || ctx.state !== "running") return;
        heard = true;
        ctx.removeEventListener("statechange", hear);
        hearing.delete(hear);
        try {
          onStart({ ms: span.dur * 1000 });
        } catch (e) {
          /* the caller's problem */
        }
      };
      const me = {
        src,
        finish(played) {
          if (done) return;
          done = true;
          if (onStart) ctx.removeEventListener("statechange", hear);
          hearing.delete(hear);
          clearInterval(clock);
          if (current === me) current = null;
          try {
            src.onended = null;
            src.stop();
          } catch (e) {
            /* never started */
          }
          resolve(played);
        },
      };
      // the clip ends by its own length even if the browser never says so (a sleeping sound, a lost event); its
      // clock stands still while the round is held
      const clock = setInterval(() => !held && (left -= V.clockMs) <= 0 && me.finish(true), V.clockMs);
      current = me;
      src.onended = () => me.finish(true);
      try {
        src.start(0, span.at, span.dur);
      } catch (e) {
        return me.finish(false);
      }
      if (onStart) {
        ctx.addEventListener("statechange", hear);
        hearing.add(hear);
        hear();
      }
    });
  }

  return { play, stop, load, hold, synth: synth || undefined, wake };
}
