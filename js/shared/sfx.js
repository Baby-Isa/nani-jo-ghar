/*
 * Small synthesised sounds for the shared UI (no audio files): Web Audio
 * oscillators with soft envelopes, kept quiet and warm.
 *
 *   Sfx.play(name, {volume, delay})   "bing" (a new best), "gold" (all right: a rising
 *                                     chime), "right" (a slot fills), "wrong" (a soft low
 *                                     thud), "tap", "whoosh" (a page turns), "pop" (a UI
 *                                     piece fades in)
 *                                     S13-V: every live game's effects are here, by name: Cook's ("cook-right",
 *                                     "cook-soft", "cook-oops", "cook-pop", "cook-whoosh", "chop", "sizzle" {dur},
 *                                     "coin", "star" {i}, "puff", "flip", "bubble", "click", "lap", "fanfare") and
 *                                     the clinic's "boing"
 *   Sfx.loop(name, {quiet}) -> {stop(), pitch(level)}   a looping noise the caller stops: "pour", "sizzle", "boil"
 *   Sfx.unlock()                      call inside a tap (iOS) if the page has no other audio
 *   Sfx.muted = true                  silence everything (a grown-up's setting)
 *
 * Every call is safe without Web Audio (Node, old browsers): it does nothing.
 * Plain <script>: window.Sfx (and Shared.sfx); Node: require().
 */
(function (root, factory) {
  const Sfx = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Sfx;
  else {
    root.Sfx = Sfx;
    (root.Shared = root.Shared || {}).sfx = Sfx;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const Sfx = { muted: false, volume: 0.5 };
  let ctx = null;
  const ac = () => {
    if (ctx) return ctx;
    const AC = root && (root.AudioContext || root.webkitAudioContext);
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  };
  Sfx.unlock = () => {
    const c = ac();
    if (c && c.state === "suspended") c.resume().catch(() => {});
  };

  // one note: type, frequency (Hz), start (s from now), length (s), peak gain
  function note(c, out, { type = "sine", f, t = 0, len = 0.3, gain = 0.3, slideTo }) {
    const o = c.createOscillator();
    const g = c.createGain();
    const at = c.currentTime + t;
    o.type = type;
    o.frequency.setValueAtTime(f, at);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, at + len);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(gain, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(g).connect(out);
    o.start(at);
    o.stop(at + len + 0.05);
  }
  // Cook's own voices for its effects (moved here from js/cook/core.js, S13-V; the same sounds): a tone with a soft attack and
  // an optional slide, and a burst of filtered noise
  function tone(c, out, freq, dur, { type = "sine", gain = 0.3, when = 0, slide = 0 } = {}) {
    const t = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function noise(c, out, dur, { gain = 0.2, when = 0, freq = 2000, q = 0.8, type = "bandpass" } = {}) {
    const t = c.currentTime + when;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(out);
    src.start(t);
  }
  const SOUNDS = {
    // a bell: a bright fundamental and its octave, long tail
    bing: (c, o) => {
      note(c, o, { f: 1318.5, len: 1.1, gain: 0.32 });
      note(c, o, { f: 2637, len: 0.7, gain: 0.1 });
      note(c, o, { f: 1975.5, t: 0.09, len: 0.9, gain: 0.12 });
    },
    // C E G C, then a shimmer
    gold: (c, o) => {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(c, o, { type: "triangle", f, t: i * 0.1, len: 0.55, gain: 0.26 }));
      note(c, o, { f: 2093, t: 0.42, len: 0.9, gain: 0.08 });
      note(c, o, { f: 1568, t: 0.46, len: 0.9, gain: 0.08 });
    },
    right: (c, o) => note(c, o, { type: "triangle", f: 880, len: 0.16, gain: 0.18, slideTo: 990 }),
    wrong: (c, o) => note(c, o, { type: "sine", f: 196, len: 0.22, gain: 0.2, slideTo: 150 }),
    tap: (c, o) => note(c, o, { type: "triangle", f: 660, len: 0.08, gain: 0.14 }),
    whoosh: (c, o) => note(c, o, { type: "sine", f: 300, len: 0.25, gain: 0.08, slideTo: 700 }),
    pop: (c, o) => note(c, o, { type: "sine", f: 520, len: 0.12, gain: 0.14, slideTo: 780 }),
    // R6 (decision 61): a soft "oh-oh" for a real mistake at level 1, until Mum records her "oh oh oh" (never arre re)
    oops: (c, o) => {
      note(c, o, { type: "sine", f: 440, len: 0.14, gain: 0.12, slideTo: 420 });
      note(c, o, { type: "sine", f: 370, t: 0.17, len: 0.22, gain: 0.12, slideTo: 330 });
    },
    // ---- Cook's (js/cook/core.js Cook.sfx calls these by name) ----
    "cook-right": (c, o) => {
      tone(c, o, 784, 0.14, { type: "triangle", gain: 0.25 });
      tone(c, o, 1175, 0.22, { type: "triangle", gain: 0.2, when: 0.08 });
    },
    // warm, low, short: never a buzzer
    "cook-soft": (c, o) => tone(c, o, 330, 0.16, { type: "sine", gain: 0.18, slide: -60 }),
    // R6 (decision 61): the soft "oh-oh" that stands in for Mum's "oh oh oh" until she records it
    "cook-oops": (c, o) => {
      tone(c, o, 440, 0.14, { type: "sine", gain: 0.14, slide: -20 });
      tone(c, o, 370, 0.22, { type: "sine", gain: 0.14, slide: -40, when: 0.17 });
    },
    "cook-pop": (c, o) => tone(c, o, 520, 0.08, { type: "sine", gain: 0.2, slide: 300 }),
    "cook-whoosh": (c, o) => noise(c, o, 0.22, { gain: 0.18, freq: 1800, q: 0.6 }),
    chop: (c, o) => {
      noise(c, o, 0.06, { gain: 0.35, freq: 900, q: 1.2 });
      tone(c, o, 160, 0.07, { type: "square", gain: 0.06 });
    },
    sizzle: (c, o, x) => noise(c, o, x.dur || 0.7, { gain: 0.16, freq: 5200, q: 0.5, type: "highpass" }),
    // SH-51: the coin's "ching" (in the sound log as "sfx/ching")
    coin: (c, o) => {
      tone(c, o, 1320, 0.08, { type: "square", gain: 0.07 });
      tone(c, o, 1760, 0.18, { type: "square", gain: 0.07, when: 0.07 });
    },
    star: (c, o, x) => tone(c, o, 880 * Math.pow(1.26, x.i || 0), 0.25, { type: "triangle", gain: 0.2 }),
    puff: (c, o) => {
      tone(c, o, 300, 0.35, { type: "sine", gain: 0.2, slide: 500 });
      noise(c, o, 0.3, { gain: 0.08, freq: 800 });
    },
    flip: (c, o) => {
      noise(c, o, 0.1, { gain: 0.15, freq: 600 });
      tone(c, o, 420, 0.1, { type: "sine", gain: 0.12, slide: 200 });
    },
    bubble: (c, o) => tone(c, o, 300 + Math.random() * 300, 0.06, { type: "sine", gain: 0.06, slide: 200 }),
    click: (c, o) => tone(c, o, 1200, 0.03, { type: "square", gain: 0.05 }),
    // DAAR-30: the stir's flag as the ladle passes it (in the sound log as "sfx/lap")
    lap: (c, o) => {
      tone(c, o, 1047, 0.12, { type: "triangle", gain: 0.16 });
      tone(c, o, 1568, 0.16, { type: "triangle", gain: 0.1, when: 0.05 });
    },
    fanfare: (c, o) => [523, 659, 784, 1047].forEach((f, i) => tone(c, o, f, 0.3, { type: "triangle", gain: 0.2, when: i * 0.12 })),
    // ---- the clinic's (js/clinic/heal/games/boing.js): a cartoon "boing", a springy pitch wobble ----
    boing: (c, out) => {
      const o = c.createOscillator();
      const g = c.createGain();
      const t = c.currentTime;
      o.type = "sine";
      o.frequency.setValueAtTime(180, t);
      o.frequency.exponentialRampToValueAtTime(520, t + 0.08);
      for (let k = 0; k < 6; k++) o.frequency.setValueAtTime(k % 2 ? 300 : 420, t + 0.1 + k * 0.06);
      o.frequency.exponentialRampToValueAtTime(200, t + 0.5);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + 0.6);
    },
  };
  // (its gain straight to the speakers, not halved: the boing was made at full volume)
  const FULL = { boing: true };
  /*
   * TEST HOOK (s04-hooks, MAA-11; read-only: what plays is unchanged): a synthesized sound has no file, so the sandbox's sound
   * hook cannot see it. These go out as a window "njg-sfx" event ({name, id, on, quiet: no audio context}) at their start and
   * stop; the sound hook logs them as a play of "sfx/<name>" and its end.
   */
  const EVENT = { coin: { name: "ching", ms: 250 }, lap: { name: "lap", ms: 220 } };
  let evSeq = 0;
  function tell(name, quiet) {
    const id = ++evSeq;
    const send = (on) => {
      try {
        root.dispatchEvent(new root.CustomEvent("njg-sfx", { detail: { name, id, on, quiet } }));
      } catch (e) {
        /* only a log */
      }
    };
    send(true);
    let told = false;
    return () => {
      if (!told) {
        told = true;
        send(false);
      }
    };
  }
  Sfx.names = Object.keys(SOUNDS);
  Sfx.play = function (name, opts) {
    opts = opts || {};
    if (Sfx.muted || !SOUNDS[name]) return false;
    // quiet: the caller's sound is not on yet (Cook before its first tap): nothing plays, the test hook still says so
    const c = opts.quiet ? null : ac();
    if (EVENT[name] && root && root.dispatchEvent) {
      const off = tell(EVENT[name].name, !c);
      setTimeout(off, EVENT[name].ms);
    }
    if (!c) return false;
    if (c.state === "suspended") c.resume().catch(() => {});
    const run = () => {
      try {
        const out = c.createGain();
        out.gain.value = (opts.volume != null ? opts.volume : 1) * (FULL[name] ? 1 : Sfx.volume);
        out.connect(c.destination);
        SOUNDS[name](c, out, opts);
      } catch (e) { /* never break the game for a sound */ }
    };
    if (opts.delay) setTimeout(run, opts.delay);
    else run();
    return true;
  };
  // a looping noise (pouring, sizzling, boiling) that the caller stops; pouring rises in pitch as the vessel fills
  const LOOPS = {
    pour: { gain: 0.12, freq: 900, q: 0.7, wobble: 7 },
    sizzle: { gain: 0.07, freq: 6000, q: 0.4, type: "highpass", event: "sizzle-loop" },
    boil: { gain: 0.05, freq: 400, q: 2, wobble: 5 },
  };
  Sfx.loop = function (name, opts) {
    const L = LOOPS[name];
    const none = { stop() {}, pitch() {} };
    if (!L || Sfx.muted) return none;
    const c = opts && opts.quiet ? null : ac();
    const off = L.event && root && root.dispatchEvent ? tell(L.event, !c) : () => {};
    if (!c) return { stop: off, pitch() {} };
    try {
      if (c.state === "suspended") c.resume().catch(() => {});
      const { gain = 0.15, freq = 1200, q = 1, type = "bandpass", wobble = 0 } = L;
      const master = c.createGain();
      master.gain.value = Sfx.volume;
      master.connect(c.destination);
      const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const f = c.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.08);
      let lfo = null;
      if (wobble) {
        lfo = c.createOscillator();
        const lg = c.createGain();
        lfo.frequency.value = wobble;
        lg.gain.value = freq * 0.3;
        lfo.connect(lg).connect(f.frequency);
        lfo.start();
      }
      src.connect(f).connect(g).connect(master);
      src.start();
      return {
        pitch(level) {
          try {
            f.frequency.setTargetAtTime(freq * (0.7 + level * 1.6), c.currentTime, 0.05);
          } catch (e) {
            /* ignore */
          }
        },
        stop() {
          off();
          try {
            g.gain.cancelScheduledValues(c.currentTime);
            g.gain.setValueAtTime(g.gain.value, c.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.12);
            src.stop(c.currentTime + 0.15);
            if (lfo) lfo.stop(c.currentTime + 0.15);
          } catch (e) {
            /* ignore */
          }
        },
      };
    } catch (e) {
      return { stop: off, pitch() {} };
    }
  };
  return Sfx;
});
