/*
 * Cook with Nani: core (data, save, per-word progress, audio, sound
 * effects, promise helpers). Proof of concept, 24 Sept 2026.
 *
 * Rules carried over from the design docs:
 *  - Never invent Kutchi. Every Kutchi string comes from data/cook.json,
 *    which only recombines frames already in the content master.
 *  - No computer voice for Kutchi. A line plays a family recording if one
 *    exists; otherwise it's shown in the bubble with a "needs recording"
 *    mark, and stays up long enough to read.
 *  - Nothing may make a child feel bad: no buzzers, no lives, customers
 *    never leave angry. Being slow or wrong only means fewer stars.
 */
(function (global) {
  const Cook = (global.Cook = global.Cook || {});

  /* ---------------- data ---------------- */
  Cook.data = null;
  Cook.audioManifest = { word: [], carrier: [] };

  Cook.load = async function () {
    const [data, manifest, tts] = await Promise.all([
      fetch("data/cook.json").then((r) => r.json()),
      fetch("data/audio-manifest.json").then((r) => r.json()).catch(() => ({})),
      fetch("data/cook-tts.json").then((r) => r.json()).catch(() => ({ lines: {} })),
    ]);
    Cook.data = data;
    Cook.audioManifest = manifest || {};
    Cook.tts = (tts && tts.lines) || {};
    return data;
  };

  Cook.word = (id) => Cook.data.words[id];
  Cook.kutchi = (id) => (Cook.data.words[id] || {}).kutchi || id;
  Cook.english = (id) => (Cook.data.words[id] || {}).english || id;
  Cook.numWord = (n) => Cook.kutchi(`num-0${n}`);
  Cook.hasAudio = (id) => !!id && (Cook.audioManifest.word || []).includes(id);

  /* ---------------- save ---------------- */
  const SAVE_KEY = "njg-cook-v1";
  const blankSave = () => ({
    v: 1,
    mode: "relaxed",
    coins: 0,
    day: 1,
    best: {},
    owned: [],
    slots: [],
    words: {},
    taught: {},
    finished: false,
    freeRounds: 0,
  });
  Cook.save = blankSave();
  Cook.storageOK = true;

  Cook.loadSave = function () {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) Cook.save = Object.assign(blankSave(), JSON.parse(raw));
    } catch (e) {
      Cook.storageOK = false;
    }
    return Cook.save;
  };
  Cook.writeSave = function () {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(Cook.save));
    } catch (e) {
      Cook.storageOK = false;
    }
  };
  Cook.resetSave = function () {
    const mode = Cook.save.mode;
    Cook.save = blankSave();
    Cook.save.mode = mode;
    Cook.writeSave();
  };
  Cook.hasUpgrade = (id) => Cook.save.owned.includes(id);

  /* ---------------- per-word progress (Game Design: per-word difficulty) ----
   * stage 1 introduced (first meeting) -> the item glows as it's named
   * stage 2 supported (1-3 right)      -> hints after 5 s hesitation
   * stage 3 prompted  (4-8 right)      -> hints after 8 s
   * stage 4 known     (9+ right)       -> hints after 12 s
   * Two misses in a row drop a word a stage (right count pulled back). */
  Cook.wordStage = function (id) {
    const w = Cook.save.words[id];
    if (!w || !w.seen) return 1;
    if (w.right >= 9) return 4;
    if (w.right >= 4) return 3;
    return 2;
  };
  /* How a word is shown as it's learned (docs/cook-with-nani-phase-a-design.md
   * section 4). A word shows as text in only one place at a time, so
   * players can't just match letter shapes:
   *   stage 1 new:      mission card text,  item label text (+ glow)
   *   stage 2 learning: mission card text,  item label speaker only
   *   stage 3 nearly:   mission card dots,  item label speaker only
   *   stage 4 known:    mission card dots (replaying costs the no-help star), no label */
  Cook.labelMode = (id) => ["", "text", "speaker", "speaker", "none"][Cook.wordStage(id)];
  Cook.cardHidden = (id) => Cook.wordStage(id) >= 3;
  Cook.paused = false;
  Cook.hintDelay = function (id) {
    return [0, 4000, 5000, 8000, 12000][Cook.wordStage(id)];
  };
  Cook.markSeen = function (id) {
    const w = (Cook.save.words[id] = Cook.save.words[id] || { seen: 0, right: 0, miss: 0, streakMiss: 0 });
    w.seen++;
    w.last = Date.now();
  };
  Cook.markRight = function (id) {
    const w = (Cook.save.words[id] = Cook.save.words[id] || { seen: 0, right: 0, miss: 0, streakMiss: 0 });
    w.right++;
    w.streakMiss = 0;
    w.seen = Math.max(1, w.seen);
  };
  Cook.markMiss = function (id) {
    const w = (Cook.save.words[id] = Cook.save.words[id] || { seen: 0, right: 0, miss: 0, streakMiss: 0 });
    w.miss++;
    w.streakMiss++;
    if (w.streakMiss >= 2) {
      // drop a stage
      if (w.right >= 9) w.right = 4;
      else if (w.right >= 4) w.right = 1;
      w.streakMiss = 0;
    }
  };

  /* ---------------- run token: leaving to the menu aborts the flow ---------- */
  Cook.run = 0;
  class Abort extends Error {}
  Cook.Abort = Abort;
  Cook.checkRun = function (token) {
    if (token !== Cook.run) throw new Abort("left");
  };

  // test hook: the e2e test plays at Cook.speed > 1; players always get 1
  Cook.speed = Number(new URLSearchParams(global.location.search).get("speed")) || 1;
  Cook.wait = function (ms) {
    ms = ms / Cook.speed;
    const token = Cook.run;
    return new Promise((resolve, reject) => {
      setTimeout(() => (token === Cook.run ? resolve() : reject(new Abort("left"))), ms);
    });
  };

  Cook.tween = function (scene, cfg) {
    return new Promise((resolve) => {
      scene.tweens.add(Object.assign({}, cfg, { onComplete: () => resolve() }));
    });
  };

  /* ---------------- audio: recordings only ---------------- */
  const audioCache = {};
  Cook.playRecording = function (id) {
    if (!Cook.hasAudio(id)) return null;
    return new Promise((resolve) => {
      let a = audioCache[id];
      if (!a) a = audioCache[id] = new Audio(`assets/audio/word/${id}.mp3`);
      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          resolve(true);
        }
      };
      a.onended = finish;
      a.onerror = finish;
      setTimeout(finish, 4000);
      try {
        a.currentTime = 0;
        const p = a.play();
        if (p && p.catch) p.catch(finish);
      } catch (e) {
        finish();
      }
    });
  };
  /* ---------------- placeholder voice (Gujarati TTS, about half speed) ----
   * Every line the game can say has a file, keyed by its normalised
   * romanised text (build/build_cook_tts.py). A family recording replaces
   * the file of the same name. Played through Web Audio, which is unlocked
   * by the first tap and works on phones where <audio> autoplay doesn't. */
  Cook.tts = {};
  Cook.norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  Cook.hasVoice = (plain) => !!Cook.tts[Cook.norm(plain)];
  const bufCache = {};
  let currentSrc = null;
  async function loadBuffer(url) {
    if (!bufCache[url]) {
      bufCache[url] = fetch(url)
        .then((r) => r.arrayBuffer())
        .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
        .catch(() => null);
    }
    return bufCache[url];
  }
  Cook.preloadVoice = (plain) => {
    const url = Cook.tts[Cook.norm(plain)];
    if (url && ctx) loadBuffer(url);
  };
  Cook.stopVoice = () => {
    try {
      if (currentSrc) currentSrc.stop();
    } catch (e) {}
    currentSrc = null;
  };
  /** Speak a line; resolves when it ends (or at once if there's no file). */
  Cook.speak = async function (plain) {
    const url = Cook.tts[Cook.norm(plain)];
    if (!url) return false;
    Cook.unlockAudio();
    if (!ctx) return false;
    const buf = await loadBuffer(url);
    if (!buf) return false;
    Cook.stopVoice();
    return new Promise((resolve) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = 1.6;
      src.connect(g).connect(ctx.destination);
      currentSrc = src;
      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          resolve(true);
        }
      };
      src.onended = finish;
      setTimeout(finish, (buf.duration * 1000) / Cook.speed + 150);
      src.start();
    });
  };
  /** Speak a voice file by its manifest key (see lang.js). */
  Cook.speakKey = async function (key) {
    const url = Cook.tts[key];
    if (!url) return false;
    Cook.unlockAudio();
    if (!ctx) return false;
    const buf = await loadBuffer(url);
    if (!buf) return false;
    Cook.stopVoice();
    return new Promise((resolve) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = 1.6;
      src.connect(g).connect(ctx.destination);
      currentSrc = src;
      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          resolve(true);
        }
      };
      src.onended = finish;
      setTimeout(finish, (buf.duration * 1000) / Cook.speed + 150);
      src.start();
    });
  };
  /** Speak several lines in a row (an order is "Muke chai khape." then "Ne bo khun."). */
  Cook.speakAll = async function (plains) {
    for (const p of plains) {
      await Cook.speak(p);
      await new Promise((r) => setTimeout(r, 180 / Cook.speed));
    }
  };

  /** How long a text-only line stays up: enough to read, not so long it drags. */
  Cook.readMs = (text) => Math.max(1400, Math.min(4200, 700 + (text || "").length * 55));

  /* ---------------- sound effects (Web Audio synth, no files) ---------------- */
  let ctx = null;
  let master = null;
  Cook.sfxVolume = 0.5;
  Cook.unlockAudio = function () {
    try {
      if (!ctx) {
        ctx = new (global.AudioContext || global.webkitAudioContext)();
        master = ctx.createGain();
        master.gain.value = Cook.sfxVolume;
        master.connect(ctx.destination);
      }
      if (ctx.state === "suspended") ctx.resume();
    } catch (e) {
      ctx = null;
    }
  };
  function tone(freq, dur, { type = "sine", gain = 0.3, when = 0, slide = 0 } = {}) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
  function noise(dur, { gain = 0.2, when = 0, freq = 2000, q = 0.8, type = "bandpass" } = {}) {
    if (!ctx) return null;
    const t = ctx.currentTime + when;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t);
    return { src, g };
  }
  // a looping noise (pouring, sizzling) that the caller stops
  function loopNoise({ gain = 0.15, freq = 1200, q = 1, type = "bandpass", wobble = 0 } = {}) {
    if (!ctx) return { stop() {} };
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.08);
    let lfo = null;
    if (wobble) {
      lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = wobble;
      lg.gain.value = freq * 0.3;
      lfo.connect(lg).connect(f.frequency);
      lfo.start();
    }
    src.connect(f).connect(g).connect(master);
    src.start();
    return {
      // pouring rises in pitch as the vessel fills, like the real thing
      pitch(level) {
        try {
          f.frequency.setTargetAtTime(freq * (0.7 + level * 1.6), ctx.currentTime, 0.05);
        } catch (e) {}
      },
      stop() {
        try {
          g.gain.cancelScheduledValues(ctx.currentTime);
          g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          src.stop(ctx.currentTime + 0.15);
          if (lfo) lfo.stop(ctx.currentTime + 0.15);
        } catch (e) {}
      },
    };
  }

  Cook.sfx = {
    right() {
      tone(784, 0.14, { type: "triangle", gain: 0.25 });
      tone(1175, 0.22, { type: "triangle", gain: 0.2, when: 0.08 });
    },
    // warm, low, short: never a buzzer
    soft() {
      tone(330, 0.16, { type: "sine", gain: 0.18, slide: -60 });
    },
    pop() {
      tone(520, 0.08, { type: "sine", gain: 0.2, slide: 300 });
    },
    whoosh() {
      noise(0.22, { gain: 0.18, freq: 1800, q: 0.6 });
    },
    chop() {
      noise(0.06, { gain: 0.35, freq: 900, q: 1.2 });
      tone(160, 0.07, { type: "square", gain: 0.06 });
    },
    sizzle(dur = 0.7) {
      noise(dur, { gain: 0.16, freq: 5200, q: 0.5, type: "highpass" });
    },
    coin() {
      tone(1320, 0.08, { type: "square", gain: 0.07 });
      tone(1760, 0.18, { type: "square", gain: 0.07, when: 0.07 });
    },
    star(i = 0) {
      tone(880 * Math.pow(1.26, i), 0.25, { type: "triangle", gain: 0.2 });
    },
    puff() {
      tone(300, 0.35, { type: "sine", gain: 0.2, slide: 500 });
      noise(0.3, { gain: 0.08, freq: 800 });
    },
    flip() {
      noise(0.1, { gain: 0.15, freq: 600 });
      tone(420, 0.1, { type: "sine", gain: 0.12, slide: 200 });
    },
    bubble() {
      tone(300 + Math.random() * 300, 0.06, { type: "sine", gain: 0.06, slide: 200 });
    },
    click() {
      tone(1200, 0.03, { type: "square", gain: 0.05 });
    },
    fanfare() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, { type: "triangle", gain: 0.2, when: i * 0.12 }));
    },
    pourLoop() {
      return loopNoise({ gain: 0.12, freq: 900, q: 0.7, wobble: 7 });
    },
    sizzleLoop() {
      return loopNoise({ gain: 0.07, freq: 6000, q: 0.4, type: "highpass" });
    },
    boilLoop() {
      return loopNoise({ gain: 0.05, freq: 400, q: 2, wobble: 5 });
    },
  };

  /* ---------------- misc ---------------- */
  Cook.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  Cook.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  Cook.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  Cook.starsFor = (score) => (score >= 88 ? 3 : score >= 68 ? 2 : 1);
})(window);
