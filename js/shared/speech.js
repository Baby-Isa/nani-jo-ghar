/*
 * Shared recogniser: closed-set spoken-word recognition, on the device.
 *
 *   Speech.listen({ choices, timeoutMs }) -> { choice, confidence } | null
 *
 * At a speaking moment the game knows the 3–8 word ids the child could
 * mean. This module records from the microphone until the child stops
 * talking (or timeoutMs), turns the sound into MFCC features, and compares
 * them by dynamic time warping (DTW) against templates: the family's own
 * recordings of each word (assets/audio/<kind>/<id>.mp3, the same files the
 * game plays) plus any takes enrolled on this device (the child or a parent
 * saying the word at first use, Speech.enrol). The nearest choice wins if
 * it is clearly nearer than the runner-up; otherwise null ("didn't catch
 * that"), and the mode falls back to the word pills or a parent's judgement.
 * Nothing here ever punishes: a null is a shrug, never a wrong.
 *
 * Nothing leaves the device (Brief, principle 9): no upload, no cloud, the
 * audio is dropped as soon as its features are taken. Enrolled takes are
 * kept as features only (a few kilobytes per word, in localStorage), never
 * as audio.
 *
 * Why templates + DTW and not a model: there is no Kutchi model anywhere,
 * the set is tiny (3–8), the reference voices are the family's own, the
 * whole thing is 25 KB of plain JS with no download, and it is what the
 * game can ship this month. See docs/speech-recognition-plan.md for the
 * comparison and the test results, and the path to an embedding model
 * later if accuracy on real children's voices needs it.
 *
 * The pure parts (features, dtw, classify) have no browser dependency and
 * are what build/speech/harness.js runs on audio files, so the numbers in
 * the plan are numbers for this exact code.
 *
 * iOS Safari notes (all handled here):
 *  - getUserMedia and AudioContext.resume must happen inside a tap; call
 *    listen() from the microphone button's handler, not from a timer.
 *  - The AudioContext runs at 44.1/48 kHz and can't be asked for 16 kHz;
 *    we resample.
 *  - AudioWorklet needs a module URL; we use a Blob URL, and fall back to
 *    ScriptProcessorNode where that fails.
 *  - While a mic track is live, iOS switches the audio session to
 *    "play and record", which drops speaker volume; we stop the track the
 *    moment listening ends, and the game should not play voice lines while
 *    listening.
 *  - Home-screen (standalone) PWAs re-ask mic permission per launch on
 *    some iOS versions; the button's copy should expect that.
 */
(function (root, factory) {
  const Speech = factory();
  if (typeof module === "object" && module.exports) module.exports = Speech;
  else root.Speech = Speech;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const Speech = {};

  /* ---------------------------------------------------------------- config */
  const SR = 16000; // everything is analysed at 16 kHz mono
  const FRAME = 400; // 25 ms
  const HOP = 160; // 10 ms
  const NFFT = 512;
  const NMEL = 24;
  const NCEP = 13; // c0..c12; c0 is dropped, the rest plus deltas are the vector
  const PREEMPH = 0.97;
  const LO_HZ = 80;
  const HI_HZ = 7200;
  // Vocal-tract warps tried on every query: a child's formants sit 10–25 %
  // above an adult's, so the query's mel axis is stretched/compressed and
  // the best-fitting warp counts. Cheap (three feature passes) and the
  // main defence against adult templates / child voices.
  const WARPS = [1.0, 0.88, 1.12];
  const DEFAULTS = {
    band: 0.3, // DTW Sakoe–Chiba band as a fraction of the longer length
    accept: 0.12, // minimum margin (d2 - d1) / d1 to name a choice
    maxDistance: 1.35, // beyond this the sound is not one of the choices
    timeoutMs: 4000,
    kBest: 2, // per choice, average of the k nearest templates
  };
  Speech.config = Object.assign({}, DEFAULTS);
  Speech.SR = SR;

  /* ------------------------------------------------------------ utilities */
  function resample(x, from, to) {
    if (from === to) return x instanceof Float32Array ? x : Float32Array.from(x);
    const ratio = from / to;
    const n = Math.floor(x.length / ratio);
    const y = new Float32Array(n);
    if (ratio > 1) {
      // box-average over the source window: a crude but alias-safe decimator
      for (let i = 0; i < n; i++) {
        const a = i * ratio;
        const b = a + ratio;
        let s = 0;
        let c = 0;
        for (let j = Math.floor(a); j < b && j < x.length; j++) {
          s += x[j];
          c++;
        }
        y[i] = c ? s / c : 0;
      }
    } else {
      for (let i = 0; i < n; i++) {
        const p = i * ratio;
        const j = Math.floor(p);
        const f = p - j;
        y[i] = x[j] * (1 - f) + (x[Math.min(j + 1, x.length - 1)] || 0) * f;
      }
    }
    return y;
  }
  Speech.resample = resample;

  function percentile(arr, p) {
    const s = Array.from(arr).sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
  }

  /** Frame RMS in dBFS, 10 ms hop, for endpointing. */
  function frameDb(x) {
    const n = Math.floor(x.length / HOP);
    const db = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = i * HOP; j < i * HOP + HOP; j++) s += x[j] * x[j];
      db[i] = 20 * Math.log10(Math.sqrt(s / HOP) + 1e-9);
    }
    return db;
  }

  /**
   * The spoken part of a clip: [start, end] in samples at 16 kHz. Frames
   * louder than the room's floor by a margin are speech; gaps under 250 ms
   * are bridged; the longest run wins (one word, maybe two syllables with a
   * stop in between), padded by 60 ms.
   */
  function endpoints(x) {
    const db = frameDb(x);
    if (!db.length) return [0, x.length];
    const floor = Math.max(percentile(db, 10), -80);
    const thr = Math.max(floor + 10, -55);
    const runs = [];
    let start = -1;
    for (let i = 0; i < db.length; i++) {
      const on = db[i] > thr;
      if (on && start < 0) start = i;
      else if (!on && start >= 0) {
        runs.push([start, i]);
        start = -1;
      }
    }
    if (start >= 0) runs.push([start, db.length]);
    const merged = [];
    for (const r of runs) {
      if (merged.length && r[0] - merged[merged.length - 1][1] < 25) merged[merged.length - 1][1] = r[1];
      else merged.push(r.slice());
    }
    if (!merged.length) return [0, x.length];
    let best = merged[0];
    for (const r of merged) if (r[1] - r[0] > best[1] - best[0]) best = r;
    const pad = 6;
    return [Math.max(0, (best[0] - pad) * HOP), Math.min(x.length, (best[1] + pad) * HOP)];
  }
  Speech.endpoints = endpoints;

  /* --------------------------------------------------------- FFT and mel */
  const hamming = new Float32Array(FRAME);
  for (let i = 0; i < FRAME; i++) hamming[i] = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (FRAME - 1));

  const fftRev = new Uint16Array(NFFT);
  {
    const bits = Math.log2(NFFT);
    for (let i = 0; i < NFFT; i++) {
      let r = 0;
      for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
      fftRev[i] = r;
    }
  }
  const fftCos = new Float32Array(NFFT / 2);
  const fftSin = new Float32Array(NFFT / 2);
  for (let i = 0; i < NFFT / 2; i++) {
    fftCos[i] = Math.cos((-2 * Math.PI * i) / NFFT);
    fftSin[i] = Math.sin((-2 * Math.PI * i) / NFFT);
  }
  /** In-place radix-2 FFT of (re, im), length NFFT. */
  function fft(re, im) {
    for (let i = 0; i < NFFT; i++) {
      const j = fftRev[i];
      if (j > i) {
        let t = re[i];
        re[i] = re[j];
        re[j] = t;
        t = im[i];
        im[i] = im[j];
        im[j] = t;
      }
    }
    for (let size = 2; size <= NFFT; size *= 2) {
      const half = size / 2;
      const step = NFFT / size;
      for (let i = 0; i < NFFT; i += size) {
        for (let k = 0; k < half; k++) {
          const wr = fftCos[k * step];
          const wi = fftSin[k * step];
          const a = i + k;
          const b = a + half;
          const tr = re[b] * wr - im[b] * wi;
          const ti = re[b] * wi + im[b] * wr;
          re[b] = re[a] - tr;
          im[b] = im[a] - ti;
          re[a] += tr;
          im[a] += ti;
        }
      }
    }
  }

  const hzToMel = (f) => 2595 * Math.log10(1 + f / 700);
  const melToHz = (m) => 700 * (Math.pow(10, m / 2595) - 1);
  const melBanks = {};
  /** Triangular mel filterbank over the power spectrum, warped by `warp` (VTLN). */
  function melBank(warp) {
    const key = warp.toFixed(3);
    if (melBanks[key]) return melBanks[key];
    const nBins = NFFT / 2 + 1;
    const lo = hzToMel(LO_HZ);
    const hi = hzToMel(HI_HZ);
    const centres = [];
    for (let i = 0; i < NMEL + 2; i++) {
      // warp > 1 stretches the filterbank up the frequency axis (a shorter
      // vocal tract); the top is pinned so nothing falls off the spectrum
      let hz = melToHz(lo + ((hi - lo) * i) / (NMEL + 1)) * warp;
      hz = Math.min(hz, SR / 2 - 1);
      centres.push((hz / (SR / 2)) * (nBins - 1));
    }
    const bank = [];
    for (let m = 0; m < NMEL; m++) {
      const l = centres[m];
      const c = centres[m + 1];
      const r = centres[m + 2];
      const w = new Float32Array(nBins);
      for (let b = Math.floor(l); b <= Math.ceil(r) && b < nBins; b++) {
        if (b >= l && b <= c && c > l) w[b] = (b - l) / (c - l);
        else if (b > c && b <= r && r > c) w[b] = (r - b) / (r - c);
      }
      bank.push(w);
    }
    melBanks[key] = bank;
    return bank;
  }
  const dctTable = [];
  for (let k = 0; k < NCEP; k++) {
    const row = new Float32Array(NMEL);
    for (let n = 0; n < NMEL; n++) row[n] = Math.cos((Math.PI * k * (n + 0.5)) / NMEL);
    dctTable.push(row);
  }

  /* ------------------------------------------------------------- features */
  /**
   * MFCC features of a 16 kHz mono clip: an array of Float32Array frames,
   * each c1..c12 plus their deltas (24 numbers), mean- and variance-
   * normalised over the utterance (so the room and the microphone cancel).
   * `trim: false` skips endpointing (already-cut clips still benefit from it,
   * so the default is on).
   */
  function features(pcm, sr, opts) {
    opts = opts || {};
    const warp = opts.warp || 1.0;
    let x = resample(pcm, sr || SR, SR);
    if (opts.trim !== false) {
      const [a, b] = endpoints(x);
      x = x.subarray(a, b);
    }
    const nFrames = Math.max(0, Math.floor((x.length - FRAME) / HOP) + 1);
    if (nFrames < 3) return [];
    const bank = melBank(warp);
    const re = new Float32Array(NFFT);
    const im = new Float32Array(NFFT);
    const nBins = NFFT / 2 + 1;
    const power = new Float32Array(nBins);
    const logMel = new Float32Array(NMEL);
    const cep = [];
    for (let f = 0; f < nFrames; f++) {
      re.fill(0);
      im.fill(0);
      const o = f * HOP;
      for (let i = 0; i < FRAME; i++) {
        const s = x[o + i] - PREEMPH * (i ? x[o + i - 1] : 0);
        re[i] = s * hamming[i];
      }
      fft(re, im);
      for (let b = 0; b < nBins; b++) power[b] = re[b] * re[b] + im[b] * im[b];
      for (let m = 0; m < NMEL; m++) {
        let s = 0;
        const w = bank[m];
        for (let b = 0; b < nBins; b++) if (w[b]) s += w[b] * power[b];
        logMel[m] = Math.log(s + 1e-6);
      }
      const c = new Float32Array(NCEP - 1);
      for (let k = 1; k < NCEP; k++) {
        let s = 0;
        const row = dctTable[k];
        for (let m = 0; m < NMEL; m++) s += row[m] * logMel[m];
        c[k - 1] = s;
      }
      cep.push(c);
    }
    // deltas over ±2 frames
    const D = NCEP - 1;
    const out = [];
    for (let f = 0; f < nFrames; f++) {
      const v = new Float32Array(2 * D);
      v.set(cep[f]);
      const p2 = cep[Math.max(0, f - 2)];
      const p1 = cep[Math.max(0, f - 1)];
      const n1 = cep[Math.min(nFrames - 1, f + 1)];
      const n2 = cep[Math.min(nFrames - 1, f + 2)];
      for (let k = 0; k < D; k++) v[D + k] = (n1[k] - p1[k] + 2 * (n2[k] - p2[k])) / 10;
      out.push(v);
    }
    // cepstral mean and variance normalisation
    const mean = new Float32Array(2 * D);
    const sd = new Float32Array(2 * D);
    for (const v of out) for (let k = 0; k < 2 * D; k++) mean[k] += v[k] / nFrames;
    for (const v of out) for (let k = 0; k < 2 * D; k++) sd[k] += ((v[k] - mean[k]) * (v[k] - mean[k])) / nFrames;
    for (let k = 0; k < 2 * D; k++) sd[k] = Math.sqrt(sd[k]) + 1e-3;
    for (const v of out) for (let k = 0; k < 2 * D; k++) v[k] = (v[k] - mean[k]) / sd[k];
    return out;
  }
  Speech.features = features;

  /* ------------------------------------------------------------------ DTW */
  /**
   * Normalised DTW distance between two feature sequences (arrays of equal-
   * length Float32Array frames). Symmetric steps, Euclidean frame cost,
   * Sakoe–Chiba band, divided by the path length so lengths don't matter.
   */
  function dtw(A, B, band) {
    const n = A.length;
    const m = B.length;
    if (!n || !m) return Infinity;
    const D = A[0].length;
    const w = Math.max(Math.abs(n - m), Math.ceil((band == null ? DEFAULTS.band : band) * Math.max(n, m)));
    const INF = 1e30;
    let prev = new Float64Array(m + 1).fill(INF);
    let cur = new Float64Array(m + 1).fill(INF);
    let prevLen = new Uint16Array(m + 1);
    let curLen = new Uint16Array(m + 1);
    prev[0] = 0;
    for (let i = 1; i <= n; i++) {
      cur.fill(INF);
      const a = A[i - 1];
      const jLo = Math.max(1, i - w);
      const jHi = Math.min(m, i + w);
      for (let j = jLo; j <= jHi; j++) {
        const b = B[j - 1];
        let c = 0;
        for (let k = 0; k < D; k++) {
          const d = a[k] - b[k];
          c += d * d;
        }
        c = Math.sqrt(c);
        const diag = prev[j - 1];
        const up = prev[j];
        const left = cur[j - 1];
        if (diag <= up && diag <= left) {
          cur[j] = diag + 2 * c;
          curLen[j] = prevLen[j - 1] + 2;
        } else if (up <= left) {
          cur[j] = up + c;
          curLen[j] = prevLen[j] + 1;
        } else {
          cur[j] = left + c;
          curLen[j] = curLen[j - 1] + 1;
        }
      }
      let t = prev;
      prev = cur;
      cur = t;
      let tl = prevLen;
      prevLen = curLen;
      curLen = tl;
    }
    return prev[m] / Math.max(1, prevLen[m]);
  }
  Speech.dtw = dtw;

  /* --------------------------------------------------------- classifying */
  /**
   * Which choice a query is. `query` is a list of feature sequences (one per
   * warp) or a single one; `templates` is [{choice, feat}]. Returns
   * {choice, confidence, distances: {choice: d}, best, second} where choice
   * is null when nothing is near enough or two choices are too close.
   */
  function classify(query, templates, opts) {
    const cfg = Object.assign({}, Speech.config, opts || {});
    const queries = Array.isArray(query[0]) || (query[0] && query[0].length !== undefined && query[0][0] instanceof Float32Array) ? query : [query];
    const per = {};
    for (const t of templates) {
      if (!t.feat || !t.feat.length) continue;
      let d = Infinity;
      for (const q of queries) if (q.length) d = Math.min(d, dtw(q, t.feat, cfg.band));
      (per[t.choice] = per[t.choice] || []).push(d);
    }
    const distances = {};
    for (const c in per) {
      const ds = per[c].sort((a, b) => a - b).slice(0, cfg.kBest);
      distances[c] = ds.reduce((s, v) => s + v, 0) / ds.length;
    }
    const ranked = Object.keys(distances).sort((a, b) => distances[a] - distances[b]);
    if (!ranked.length) return { choice: null, confidence: 0, distances, best: null, second: null };
    const best = ranked[0];
    const second = ranked[1] || null;
    const d1 = distances[best];
    const d2 = second ? distances[second] : d1 * 2;
    const margin = (d2 - d1) / Math.max(d1, 1e-6);
    // 0 at the accept margin, 1 at three times it; scaled down as d1 nears the cut-off
    let confidence = Math.max(0, Math.min(1, (margin - cfg.accept) / (2 * cfg.accept)));
    confidence *= Math.max(0, Math.min(1, (cfg.maxDistance - d1) / (0.3 * cfg.maxDistance) + 0.2));
    const ok = d1 <= cfg.maxDistance && margin >= cfg.accept;
    return { choice: ok ? best : null, confidence: ok ? Math.round(confidence * 100) / 100 : 0, distances, best, second, margin, d1 };
  }
  Speech.classify = classify;

  /** Features at each warp, for a query. */
  function queryFeatures(pcm, sr) {
    return WARPS.map((w) => features(pcm, sr, { warp: w }));
  }
  Speech.queryFeatures = queryFeatures;

  /* ---------------------------------------------------------- templates */
  // choice -> [{feat, from}] ; `from` is "family:<file>" or "enrol:<n>"
  const bank = {};
  Speech.templates = bank;
  Speech.addTemplate = (choice, feat, from) => {
    if (!feat || feat.length < 3) return false;
    (bank[choice] = bank[choice] || []).push({ feat, from: from || "" });
    return true;
  };
  Speech.templatesFor = (choices) => {
    const out = [];
    for (const c of choices) for (const t of bank[c] || []) out.push({ choice: c, feat: t.feat });
    return out;
  };
  Speech.hasTemplates = (choices) => choices.every((c) => (bank[c] || []).length > 0);

  /** Pack a feature sequence as Int8 (×16) base64 for storage; ~1 KB per second of speech. */
  function pack(feat) {
    const D = feat[0].length;
    const bytes = new Uint8Array(feat.length * D);
    let i = 0;
    for (const v of feat) for (let k = 0; k < D; k++) bytes[i++] = Math.max(-127, Math.min(127, Math.round(v[k] * 16))) + 128;
    let s = "";
    for (let j = 0; j < bytes.length; j++) s += String.fromCharCode(bytes[j]);
    return { d: D, b: typeof btoa === "function" ? btoa(s) : Buffer.from(s, "binary").toString("base64") };
  }
  function unpack(p) {
    const s = typeof atob === "function" ? atob(p.b) : Buffer.from(p.b, "base64").toString("binary");
    const out = [];
    for (let i = 0; i + p.d <= s.length; i += p.d) {
      const v = new Float32Array(p.d);
      for (let k = 0; k < p.d; k++) v[k] = (s.charCodeAt(i + k) - 128) / 16;
      out.push(v);
    }
    return out;
  }
  Speech.pack = pack;
  Speech.unpack = unpack;

  const STORE = "njg-speech-enrol-v1";
  function loadEnrolments() {
    try {
      const raw = typeof localStorage !== "undefined" && localStorage.getItem(STORE);
      if (!raw) return;
      const data = JSON.parse(raw);
      for (const c in data) data[c].forEach((p, i) => Speech.addTemplate(c, unpack(p), `enrol:${i}`));
    } catch (e) {
      /* private mode, or blocked storage: enrolments just don't persist */
    }
  }
  function saveEnrolments() {
    try {
      const data = {};
      for (const c in bank) {
        const mine = bank[c].filter((t) => t.from.startsWith("enrol:")).map((t) => pack(t.feat));
        if (mine.length) data[c] = mine;
      }
      localStorage.setItem(STORE, JSON.stringify(data));
    } catch (e) {
      /* as above */
    }
  }
  /** Forget this device's enrolled takes (a parent's "start again" button). */
  Speech.clearEnrolments = (choice) => {
    for (const c in bank) if (!choice || c === choice) bank[c] = bank[c].filter((t) => !t.from.startsWith("enrol:"));
    saveEnrolments();
  };
  Speech.enrolmentCount = (choice) => (bank[choice] || []).filter((t) => t.from.startsWith("enrol:")).length;

  /* ----------------------------------------------------- browser: audio */
  const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";
  let ctx = null;
  function audioContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /**
   * Load the family's recordings of a word as templates (the same MP3s the
   * game plays). urls: [string]. Resolves to how many were usable.
   */
  Speech.loadTemplates = async function (choice, urls) {
    if (!isBrowser) throw new Error("loadTemplates needs a browser; use build/speech/harness.js");
    const ac = audioContext();
    let n = 0;
    for (const url of urls) {
      try {
        const buf = await (await fetch(url)).arrayBuffer();
        const audio = await new Promise((res, rej) => ac.decodeAudioData(buf, res, rej));
        const pcm = audio.getChannelData(0);
        if (Speech.addTemplate(choice, features(pcm, audio.sampleRate), `family:${url}`)) n++;
      } catch (e) {
        /* a missing file is a missing template, not an error */
      }
    }
    return n;
  };

  /**
   * Record one take from the mic: resolves to Float32Array PCM at 16 kHz,
   * cut to the speech, or null if nothing was said before the timeout.
   * onState gets "listening" | "speaking" | "done" for the UI.
   */
  Speech.record = async function (opts) {
    opts = opts || {};
    const timeoutMs = opts.timeoutMs || Speech.config.timeoutMs;
    const onState = opts.onState || (() => {});
    if (!isBrowser || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return null;
    const ac = audioContext();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
    });
    const src = ac.createMediaStreamSource(stream);
    const chunks = [];
    let total = 0;
    const sr = ac.sampleRate;
    const hop = Math.round(sr * 0.01);
    // live endpointing: start after 120 ms above the floor, stop after 600 ms below it
    let floor = -60;
    let speechMs = 0;
    let silenceMs = 0;
    let started = false;
    let finish = null;
    const done = new Promise((resolve) => (finish = resolve));
    const t0 = Date.now();
    const onAudio = (data) => {
      chunks.push(Float32Array.from(data));
      total += data.length;
      for (let i = 0; i + hop <= data.length; i += hop) {
        let s = 0;
        for (let j = i; j < i + hop; j++) s += data[j] * data[j];
        const db = 20 * Math.log10(Math.sqrt(s / hop) + 1e-9);
        if (!started) floor = Math.min(-30, 0.95 * floor + 0.05 * db);
        const on = db > Math.max(floor + 12, -50);
        if (on) {
          speechMs += 10;
          silenceMs = 0;
          if (!started && speechMs >= 120) {
            started = true;
            onState("speaking");
          }
        } else if (started) {
          silenceMs += 10;
          if (silenceMs >= 600 && speechMs >= 250) finish("end");
        } else speechMs = Math.max(0, speechMs - 10);
      }
      if (Date.now() - t0 > timeoutMs) finish("timeout");
    };
    let node;
    let worklet = false;
    try {
      if (ac.audioWorklet) {
        const code = `class T extends AudioWorkletProcessor{process(i){if(i[0]&&i[0][0])this.port.postMessage(i[0][0]);return true}}registerProcessor("njg-tap",T);`;
        const url = URL.createObjectURL(new Blob([code], { type: "application/javascript" }));
        await ac.audioWorklet.addModule(url);
        node = new AudioWorkletNode(ac, "njg-tap");
        node.port.onmessage = (e) => onAudio(e.data);
        worklet = true;
      }
    } catch (e) {
      node = null;
    }
    if (!node) {
      node = ac.createScriptProcessor(2048, 1, 1);
      node.onaudioprocess = (e) => onAudio(e.inputBuffer.getChannelData(0));
    }
    src.connect(node);
    if (!worklet) node.connect(ac.destination); // ScriptProcessor only runs when connected
    onState("listening");
    const why = await done;
    try {
      src.disconnect();
      node.disconnect();
    } catch (e) {
      /* already gone */
    }
    stream.getTracks().forEach((t) => t.stop()); // give iOS its speaker volume back
    onState("done");
    if (!started && why === "timeout") return null;
    const all = new Float32Array(total);
    let o = 0;
    for (const c of chunks) {
      all.set(c, o);
      o += c.length;
    }
    const x = resample(all, sr, SR);
    const [a, b] = endpoints(x);
    return x.subarray(a, b);
  };

  /**
   * The call the modes are designed against.
   *   choices: word ids (3–8), timeoutMs, onState (optional UI hook),
   *   pcm (optional: skip the mic and classify this 16 kHz clip; for tests)
   * -> { choice, confidence } | null. Never throws for a missing mic or
   * a refused permission: that is a null too, and the mode falls back.
   */
  Speech.listen = async function (opts) {
    opts = opts || {};
    const choices = opts.choices || [];
    if (choices.length < 2 || !Speech.hasTemplates(choices)) return null;
    let pcm = opts.pcm || null;
    if (!pcm) {
      try {
        pcm = await Speech.record({ timeoutMs: opts.timeoutMs, onState: opts.onState });
      } catch (e) {
        return null;
      }
    }
    if (!pcm || pcm.length < SR * 0.2) return null;
    const r = classify(queryFeatures(pcm, SR), Speech.templatesFor(choices));
    Speech.last = { pcm, result: r, choices }; // for enrol-after-confirm and the parent log
    return r.choice ? { choice: r.choice, confidence: r.confidence } : null;
  };

  /**
   * Enrol a take: the child (or a parent) says `choice`; pass the PCM from
   * Speech.record, or nothing to enrol the last listen()'s audio once a
   * parent/the game has confirmed what was said. Kept on this device only.
   */
  Speech.enrol = function (choice, pcm) {
    pcm = pcm || (Speech.last && Speech.last.pcm);
    if (!pcm) return false;
    const n = Speech.enrolmentCount(choice);
    const ok = Speech.addTemplate(choice, features(pcm, SR), `enrol:${n}`);
    if (ok) saveEnrolments();
    return ok;
  };

  if (isBrowser) loadEnrolments();
  return Speech;
});
