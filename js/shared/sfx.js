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
 * CHAI-92 / SH-226 (Zafar's picks, 6 Nov, lab/juice.html): the recorded sounds (assets/shared/sfx/, SOURCES.md) play here too, by
 * the same Sfx.play name ("knob", "flame", "green", "glass", "settle", "sparkle": FILES below) and Sfx.loop("simmer"), each at the
 * lab's level (the file as cut, gain 1); only the picked files are ever fetched (Sfx.preload, at a station's start):
 *   Sfx.preload([name, ...])          fetch and decode those files now (a file not in yet when its moment comes is skipped: a late
 *                                     sound is a wrong sound)
 *   Sfx.file(stem, {volume, dur, wait}) -> {stop()}   any file of assets/shared/sfx/ by its stem (the lab's player; wait: play it
 *                                     once it has loaded)
 * THE VOICE GATE (the sound-and-juice report 3b; the family's voice is never masked): while a family voice line sounds
 * (Sfx.speaking(): the host's own Sfx.voiceBusy when it set one, else Cook.voiceBusy, else NjgVoice.busy), an effect longer than
 * 120 ms does not start (dropped, never queued: a late sound is a wrong one) unless {under: true}; a short tick plays ducked
 * (x 0.35). A recorded sound still ringing when a voice starts fades out at once, and the simmer loop is silent while a voice speaks.
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
  const Sfx = { muted: false, volume: 0.5, voiceBusy: null };
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
    // SH-196 (Zafar, 4 Nov: "there should be like a click sound" as the reveal lesson shows the tap; the click above was too quiet to
    // hear): a finger's clear tap on a card, a short bright knock and its tick
    reveal: (c, o) => {
      noise(c, o, 0.03, { gain: 0.34, freq: 2600, q: 1 });
      tone(c, o, 1480, 0.05, { type: "triangle", gain: 0.2 });
    },
    // CHAI-67 (Zafar, 3 Nov: "make the camera shutter sound"): a camera's two-part shutter, a sharp click and its mechanical return
    shutter: (c, o) => {
      noise(c, o, 0.035, { gain: 0.32, freq: 3200, q: 0.9 });
      tone(c, o, 1900, 0.02, { type: "square", gain: 0.05 });
      noise(c, o, 0.06, { gain: 0.2, freq: 1500, q: 0.8, when: 0.09 });
    },
    // DAAR-30: the stir's flag as the ladle passes it (in the sound log as "sfx/lap")
    lap: (c, o) => {
      tone(c, o, 1047, 0.12, { type: "triangle", gain: 0.16 });
      tone(c, o, 1568, 0.16, { type: "triangle", gain: 0.1, when: 0.05 });
    },
    fanfare: (c, o) => [523, 659, 784, 1047].forEach((f, i) => tone(c, o, f, 0.3, { type: "triangle", gain: 0.2, when: i * 0.12 })),
    // CHAI-92 (Zafar, 6 Nov, lab/juice.html "the last drop lands": B, the report's made plink, "at double its current volume ... it's
    // quite quiet"): one soft plink as the last drop lands, at twice the lab's gain (0.08 -> 0.16)
    drop: (c, o) => tone(c, o, 1319, 0.07, { type: "sine", gain: 0.16 }),
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
  // ---- the voice gate ----
  // each synthesised sound's length (ms): one up to SHORT ms is a tick, and may play ducked under a voice
  const SHORT = 120;
  const LEN = { bing: 1100, gold: 1360, right: 160, wrong: 220, tap: 80, whoosh: 250, pop: 120, oops: 390, "cook-right": 300, "cook-soft": 160, "cook-oops": 390, "cook-pop": 80, "cook-whoosh": 220, chop: 70, sizzle: 700, coin: 250, star: 250, puff: 350, flip: 100, bubble: 60, click: 30, reveal: 50, shutter: 150, lap: 210, fanfare: 660, boing: 550, drop: 70 };
  /** A sound's length in ms (a recorded one's from FILES). */
  Sfx.len = (name) => (FILES[name] ? FILES[name].ms : LEN[name] != null ? LEN[name] : 400);
  /** Is a family voice line sounding now? (the host's own Sfx.voiceBusy when it set one; else Cook's player, else the shared voice) */
  Sfx.speaking = function () {
    try {
      if (typeof Sfx.voiceBusy === "function") return !!Sfx.voiceBusy();
      const C = root && root.Cook;
      if (C && typeof C.voiceBusy === "function" && C.voiceBusy()) return true;
      const V = root && root.NjgVoice;
      return !!(V && typeof V.busy === "function" && V.busy());
    } catch (e) {
      return false;
    }
  };
  // -> 0 (it does not play), else its volume factor (1, or ducked under a voice)
  const gate = (name, opts) => (opts.under || !Sfx.speaking() ? 1 : Sfx.len(name) <= SHORT ? 0.35 : 0);

  Sfx.names = Object.keys(SOUNDS);
  Sfx.play = function (name, opts) {
    opts = opts || {};
    if (Sfx.muted) return false;
    if (FILES[name]) return playFile(name, opts);
    if (!SOUNDS[name]) return false;
    // the voice gate (a quiet call plays nothing anyway: its test-hook event still goes out, as before)
    const duck = opts.quiet ? 1 : gate(name, opts);
    if (!duck) return false;
    if (duck !== 1) opts = Object.assign({}, opts, { volume: (opts.volume != null ? opts.volume : 1) * duck });
    // quiet: the caller's sound is not on yet (Cook before its first tap): nothing plays, the test hook still says so
    const c = opts.quiet ? null : ac();
    if (EVENT[name] && root && root.dispatchEvent) {
      const off = tell(EVENT[name].name, !c);
      setTimeout(off, EVENT[name].ms);
    }
    if (!c) return false;
    if (c.state === "suspended") c.resume().catch(() => {});
    const run = () => {
      // (a delayed sound meets the gate again when it starts)
      if (opts.delay && !opts.quiet && !gate(name, opts)) return;
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
    // CHAI-87 (Zafar, 5 Nov: "can we add a tea pouring sound to the word focus to make it more interesting as the tea is being
    // poured?"): tea poured into a glass: a soft splashing hiss, and the glass's own ring rising as it fills (ring: a narrow band whose
    // pitch climbs from..to with pitch(level), the sound of a glass filling)
    "pour-glass": { gain: 0.1, freq: 1400, q: 0.6, wobble: 11, ring: { from: 380, to: 1500, q: 9, gain: 0.07 } },
    sizzle: { gain: 0.07, freq: 6000, q: 0.4, type: "highpass", event: "sizzle-loop" },
    boil: { gain: 0.05, freq: 400, q: 2, wobble: 5 },
  };
  Sfx.loop = function (name, opts) {
    if (FILES[name] && FILES[name].loop) return fileLoop(name, opts || {});
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
      let rf = null;
      if (L.ring) {
        rf = c.createBiquadFilter();
        rf.type = "bandpass";
        rf.frequency.value = L.ring.from;
        rf.Q.value = L.ring.q;
        const rg = c.createGain();
        rg.gain.value = L.ring.gain / gain;
        src.connect(rf).connect(rg).connect(g);
      }
      src.start();
      return {
        pitch(level) {
          try {
            f.frequency.setTargetAtTime(freq * (0.7 + level * 1.6), c.currentTime, 0.05);
            if (rf) rf.frequency.setTargetAtTime(L.ring.from + (L.ring.to - L.ring.from) * Math.max(0, Math.min(1, level)), c.currentTime, 0.08);
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

  /* ---------------- the recorded sounds (CHAI-92, SH-226) ----------------
   * Zafar's picks, 6 Nov (lab/juice.html; the row and letter in each comment). file: its stem in assets/shared/sfx/ (SOURCES.md has
   * its source, licence and author); ms: its length (the gate's). Each plays at the lab's level: the file as it was cut and levelled
   * (build/tools/juice/make_sfx.py: a hit peaks at -16 dBFS, the simmer near -32 dBFS RMS), gain 1. The rows he left open (the pour,
   * the short pour) keep today's sounds; the files he did not pick stay in the folder for the lab and are never fetched here.
   * Mixkit's licence (knob-a, ding-a, sparkle-a) is his decision before the app stores (build/reports/juice-chai-wired-2026-11-06.md).
   */
  const FILES = {
    knob: { file: "knob-a", ms: 235 }, // the gas knob turns: A, a gas stove's ignition click (Mixkit)
    flame: { file: "flame-b", ms: 1149 }, // the flame catches: B, a gas torch catching (CC0)
    simmer: { file: "simmer-a", ms: 4049, loop: true }, // the pan simmers: A, water at a gentle boil (CC0)
    green: { file: "ding-a", ms: 418 }, // the heat reaches the green: A, a kitchen oven's ding (Mixkit)
    glass: { file: "glass-c", ms: 1228 }, // the glass is full: C, a knife on a full water glass (CC0)
    settle: { file: "settle-a", ms: 366 }, // a bottle set down: A, a glass set on a wooden table (CC0)
    sparkle: { file: "sparkle-a", ms: 940 }, // the sparkle's chime: A, a fairy sparkle (Mixkit)
  };
  /** name -> the file's stem, for the checks (build/test_shared_sfx_files.mjs) */
  Sfx.files = Object.fromEntries(Object.entries(FILES).map(([k, f]) => [k, f.file]));
  Object.keys(FILES).forEach((k) => !FILES[k].loop && Sfx.names.push(k));
  let fileBase = "assets/shared/sfx/";
  try {
    const d = root && root.document;
    const me = d && (d.currentScript || [...d.scripts].find((s) => /js\/shared\/sfx\.js/.test(s.src)));
    if (me && me.src) fileBase = new URL("../../assets/shared/sfx/", me.src).href;
  } catch (e) {
    /* the default */
  }
  Sfx.fileUrl = (stem) => fileBase + stem + ".mp3" + (root && root.NJG_V ? "?v=" + root.NJG_V : "");
  // decoded once, on an offline context (no live audio context before the child's first tap: no autoplay warning), played on ours
  const bufs = {};
  const loading = {};
  let dec = null;
  const load = (stem) => {
    if (loading[stem]) return loading[stem];
    const OAC = root && (root.OfflineAudioContext || root.webkitOfflineAudioContext);
    if (!OAC || !root.fetch) return (loading[stem] = Promise.resolve(null));
    try {
      dec = dec || new OAC(1, 1, 44100);
    } catch (e) {
      return (loading[stem] = Promise.resolve(null));
    }
    loading[stem] = root
      .fetch(Sfx.fileUrl(stem))
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .then((ab) => ab && new Promise((ok, no) => dec.decodeAudioData(ab, ok, no)))
      .then((b) => (bufs[stem] = b || null))
      .catch(() => (bufs[stem] = null));
    return loading[stem];
  };
  /** Fetch and decode the named recorded sounds now (a station's start), so each plays on its moment. */
  Sfx.preload = (names) => Promise.all([].concat(names || []).map((n) => (FILES[n] ? load(FILES[n].file) : null)));
  const gateMs = (ms, opts) => (opts.under || !Sfx.speaking() ? 1 : ms <= SHORT ? 0.35 : 0);
  // the sounds playing now: a one-shot fades out when a voice starts; the loop goes silent while it speaks
  const live = new Set();
  let watching = null;
  function watch() {
    if (watching || !root || !root.setInterval) return;
    watching = root.setInterval(() => {
      if (!live.size) {
        root.clearInterval(watching);
        watching = null;
        return;
      }
      const busy = Sfx.speaking();
      live.forEach((h) => {
        if (h.loop) duckLoop(h, busy);
        else if (Sfx.muted || (busy && !h.under)) h.stop(0.03);
      });
    }, 50);
  }
  function startBuf(buf, vol, meta) {
    const c = ac();
    if (!c || !buf) return null;
    if (c.state === "suspended") c.resume().catch(() => {});
    try {
      const src = c.createBufferSource();
      src.buffer = buf;
      src.loop = !!meta.loop;
      const g = c.createGain();
      g.gain.setValueAtTime(vol, c.currentTime);
      src.connect(g).connect(c.destination);
      src.start();
      const h = Object.assign({ src, g, c, ended: false }, meta);
      h.stop = (fade = 0.12) => {
        if (h.ended) return;
        h.ended = true;
        live.delete(h);
        if (h.off) (h.off(), (h.off = null));
        try {
          g.gain.cancelScheduledValues(c.currentTime);
          g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), c.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + fade);
          src.stop(c.currentTime + fade + 0.02);
        } catch (e) {
          /* already ended */
        }
      };
      src.onended = () => {
        h.ended = true;
        live.delete(h);
      };
      if (meta.dur && meta.dur < buf.duration) {
        g.gain.setValueAtTime(vol, c.currentTime + Math.max(0, meta.dur - 0.18));
        g.gain.linearRampToValueAtTime(0.0001, c.currentTime + meta.dur);
        src.stop(c.currentTime + meta.dur + 0.02);
      }
      live.add(h);
      watch();
      return h;
    } catch (e) {
      return null;
    }
  }
  function playFile(name, opts) {
    const F = FILES[name];
    // (quiet: the caller's sound is not on yet, Cook before its first tap; a loop is started with Sfx.loop)
    if (opts.quiet || F.loop) return false;
    const buf = bufs[F.file];
    if (!buf) {
      load(F.file); // not in yet: this time it is skipped (never late), the next one plays
      return false;
    }
    const go = () => {
      const duck = gateMs(F.ms, opts);
      if (!duck || Sfx.muted) return null;
      return startBuf(buf, (opts.volume != null ? opts.volume : 1) * duck, { name, under: !!opts.under || F.ms <= SHORT });
    };
    if (opts.delay) {
      if (!gateMs(F.ms, opts)) return false;
      if (root && root.setTimeout) root.setTimeout(go, opts.delay);
      return true;
    }
    return !!go();
  }
  // the loop's level follows the caller's (0..1) and goes to nothing while a voice speaks; the test hook hears it on and off as
  // "sfx/<name>-loop" (njg-sfx), so the sound log shows exactly when it is heard
  function duckLoop(h, busy, force) {
    const want = busy || Sfx.muted ? 0 : h.level;
    if (!force && want === h.want) return;
    h.want = want;
    try {
      h.g.gain.setTargetAtTime(Math.max(0.0001, want), h.c.currentTime, busy ? 0.02 : 0.15);
    } catch (e) {
      /* ignore */
    }
    const heard = want > 0.001;
    if (heard && !h.off && root && root.dispatchEvent) h.off = tell(h.name + "-loop", false);
    else if (!heard && h.off) (h.off(), (h.off = null));
  }
  function fileLoop(name, opts) {
    const F = FILES[name];
    const none = { stop() {}, pitch() {} };
    if (Sfx.muted || opts.quiet) return none;
    const buf = bufs[F.file];
    if (!buf) {
      load(F.file);
      return none;
    }
    const h = startBuf(buf, 0.0001, { name, loop: true });
    if (!h) return none;
    h.level = Math.max(0, Math.min(1, opts.volume != null ? opts.volume : 1));
    duckLoop(h, Sfx.speaking(), true);
    return {
      stop: () => h.stop(0.25),
      /** its level, 0..1 (chai: rising with the heat) */
      pitch(k) {
        k = Math.max(0, Math.min(1, k));
        if (h.ended || Math.abs(k - h.level) < 0.02) return;
        h.level = k;
        duckLoop(h, Sfx.speaking(), true);
      },
    };
  }
  /** The lab's player: any file of assets/shared/sfx/ by its stem, played once (dur: cut it short with a fade). */
  Sfx.file = function (stem, o) {
    o = o || {};
    const h = { stopped: false, live: null, stop() { h.stopped = true; if (h.live) h.live.stop(0.04); } };
    if (Sfx.muted) return h;
    const go = (buf) => {
      if (!buf || h.stopped) return;
      const duck = gateMs(buf.duration * 1000, o);
      if (duck) h.live = startBuf(buf, (o.volume != null ? o.volume : 1) * duck, { name: stem, under: !!o.under, dur: o.dur });
    };
    if (bufs[stem]) go(bufs[stem]);
    else if (o.wait !== false) load(stem).then(go);
    return h;
  };
  return Sfx;
});
