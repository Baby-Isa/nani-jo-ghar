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
 *    never leave angry. Being slow or wrong only shows in the end badges.
 */
(function (global) {
  // C4: Cook's namespace (js/cook/ns.js) when Cook loads as modules; the parked pages' and Node harnesses' marked window.Cook
  // when this file runs as a classic script. Timers go through Cook's lifetime (js/cook/life.js) when it is there.
  const Cook = (global.njgTest && global.njgTest.loading) || (global.Cook = global.Cook || {});
  const { setTimeout, clearTimeout, setInterval, clearInterval } = Cook.life || global;
  // cache-busting (js/version.js): Cook.v(url) adds ?v=<stamp>
  Cook.V = global.NJG_V || "";
  Cook.v = global.njgV || ((u) => u);

  /* ---------------- data ---------------- */
  Cook.data = null;
  Cook.audioManifest = { word: [], carrier: [] };

  Cook.load = async function () {
    const [data, manifest, tts] = await Promise.all([
      fetch(Cook.v("data/cook.json")).then((r) => r.json()),
      fetch(Cook.v("data/audio-manifest.json")).then((r) => r.json()).catch(() => ({})),
      // the parked pages' placeholder voice table (Cook's own words are the engine's: js/cook/words.js)
      Cook.engineWords ? null : fetch(Cook.v("data/cook-tts.json")).then((r) => r.json()).catch(() => ({ lines: {} })), // parked pages only
      global.FamilyVoice ? global.FamilyVoice.load() : Promise.resolve(),
    ]);
    Cook.data = data;
    // parked pages only (step 4d): their words, from the engine's own source (cook.html's are the engine's: words.js)
    if (!Cook.engineWords) await mergeParkedWords(data);
    Cook.audioManifest = manifest || {};
    Cook.tts = (tts && tts.lines) || {}; // parked pages only
    // modules that build themselves from the data (recipes, a combined
    // station's own data file) run here, started in the order they registered and
    // awaited together (CK-25: each station's own file was fetched one after another)
    await Promise.all(Cook.onLoad.map((fn) => fn(data)));
    return data;
  };
  /*
   * Step 4d: PARKED PAGES ONLY (dress, find, snap, tidy, monsoon, who; cook.html loads js/cook/words.js, the engine).
   * Cook's words and lines moved to the language engine's own source, data/lang/seed/cook.json; the parked pages get
   * them back here, merged over the item catalogue (data/cook.json) in the old shape, with the station words and the
   * stir line the page used to merge, so they keep working unchanged until each moves onto the engine.
   */
  async function mergeParkedWords(data) {
    const seed = await fetch(Cook.v("data/lang/seed/cook.json")) // parked pages only
      .then((r) => r.json())
      .catch(() => null);
    if (!seed) return;
    const add = (ws) => Object.keys(ws || {}).forEach((id) => id !== "_about" && (data.words[id] = Object.assign({}, data.words[id], ws[id]))); // parked pages only
    add(seed.words);
    data.lines = Object.assign({}, seed.lines, data.lines); // parked pages only
    data.grammar = data.grammar || seed.grammar; // parked pages only
    Object.values(seed.stations || {}).forEach((st) => {
      add(st.words);
      Object.keys(st.lines || {}).forEach((k) => (data.lines[k] = data.lines[k] || st.lines[k])); // parked pages only
    });
    Object.keys(seed.guide || {}).forEach((k) => data.guide && data.guide[k] && Object.assign(data.guide[k], seed.guide[k]));
    Object.keys(seed.headlines || {}).forEach((r) => data.recipes[r] && data.recipes[r].headline && Object.assign(data.recipes[r].headline, seed.headlines[r]));
  }
  Cook.onLoad = [];

  // the item catalogue (data/cook.json `words`: a thing's picture, heap, layer colour, shelf): never a word's text,
  // which is the language engine's (js/cook/words.js; the parked pages' js/cook/lang.js keeps their old lookups)
  Cook.item = (id) => (id != null && Cook.data && Cook.data.words && Cook.data.words[id]) || null; // item catalogue
  Cook.items = () => Object.keys((Cook.data && Cook.data.words) || {}).filter((k) => k !== "_about"); // item catalogue
  Cook.hasAudio = (id) => !!id && (Cook.audioManifest.word || []).includes(id);

  /* ---------------- save ---------------- */
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

  // "One app, one save" (js/core/save.js, or js/shared/save.js on the parked pages): every page loads the one save,
  // and Cook.save is the current player's "cook" namespace (the old njg-cook-v1 key is migrated into it by the save
  // itself, so old saves still load). Find it, Dress up and Snap share Cook.save, so they follow. Storage is the save's
  // alone (checks-to-build 17: nothing else touches the browser storage): with no save loaded (no page does that today:
  // js/cook/boot.js imports it, the parked pages load js/shared/save.js) Cook plays on an in-memory save.
  const oneSave = () => (global.Save && typeof global.Save.get === "function" ? global.Save : null);
  Cook.loadSave = function () {
    try {
      const S = oneSave();
      if (S) {
        Cook.save = Object.assign(blankSave(), S.get("cook"));
        Cook.storageOK = S.persistent();
      } else Cook.storageOK = false;
    } catch (e) {
      Cook.storageOK = false;
    }
    return Cook.save;
  };
  Cook.writeSave = function () {
    try {
      const S = oneSave();
      if (S) Cook.storageOK = S.set("cook", Cook.save) && S.persistent();
      else Cook.storageOK = false;
    } catch (e) {
      Cook.storageOK = false;
    }
  };
  Cook.resetSave = function ({ fresh = false } = {}) {
    const mode = Cook.save.mode;
    const hands = Cook.save.hands;
    Cook.save = blankSave();
    Cook.save.mode = mode;
    if (hands) Cook.save.hands = hands;
    Cook.writeSave();
    // SH-60 (PA5): starting over also forgets the learned words (every word shows on the card again)
    const P = Cook.core && Cook.core.progress;
    if (P && P.reset) P.reset();
    // fresh ("play as new", the grown-ups' "?"): the first-time help and the UI stages come back too
    if (fresh && global.UIStore && global.UIStore.clear) global.UIStore.clear();
  };
  /*
   * Step 3 R4: Cook on the engine core (js/core/, ES modules). cook.html's module bootstrap
   * (js/cook/boot.js) sets Cook.coreReady (a promise) and, once loaded, Cook.core =
   * {save, progress, score, wallet, voice, lang, play, data}. The one purse is the core's
   * wallet (coins only go up, except buying: no wages, E29); upgrades are the wallet's. A page that
   * still loads Cook's files the classic way (the parked modes) has no core and keeps the old fields.
   */
  Cook.core = Cook.core || null;
  Cook.coreReady = Cook.coreReady || null;
  Cook.wallet = () => (Cook.core && Cook.core.wallet) || null;
  Cook.coins = () => (Cook.wallet() ? Cook.wallet().coins() : Cook.save.coins || 0);
  Cook.hasUpgrade = (id) => (Cook.wallet() ? Cook.wallet().has(id) : (Cook.save.owned || []).includes(id));
  /** An upgrade's price: data/economy.json's (through the wallet), else the old one in data/cook.json. */
  Cook.price = (u) => {
    const p = Cook.wallet() ? Cook.wallet().price(u.id) : null;
    return p != null ? p : u.price != null ? u.price : Infinity;
  };

  /* ---------------- per-word progress (Game Design: per-word difficulty) ----
   * stage 1 introduced (first meeting) -> the item glows as it's named
   * stage 2 supported (1-3 right)      -> hints after 5 s hesitation
   * stage 3 prompted  (4-8 right)      -> hints after 8 s
   * stage 4 known     (9+ right)       -> hints after 12 s
   * Two misses in a row drop a word a stage (right count pulled back). */
  // C3 (decision 38d): on the engine core, a word's stage is the core's per-word progress (js/core/progress.js,
  // rule G23; Cook's four stages are its understand_stage, capped at 4). Cook's own records (Cook.save.words) are
  // only for the parked pages that load Cook without the core (Find it, Dress up, Snap); the core brought the
  // old records over when it first read them (Progress followCook), so nothing a child learned is lost.
  const P = () => (Cook.core && Cook.core.progress) || null;
  const ownStage = function (id) {
    const w = Cook.save.words[id];
    if (!w || !w.seen) return 1;
    if (w.right >= 9) return 4;
    if (w.right >= 4) return 3;
    return 2;
  };
  Cook.wordStage = (id) => (P() ? P().cookStage(id) : ownStage(id));
  /** Every word id met so far (the recipe book). */
  Cook.metWords = () => (P() ? Object.keys(P().all()).filter((id) => P().get(id).seen > 0) : Object.keys(Cook.save.words));
  Cook.labelMode = (id) => ["", "text", "speaker", "speaker", "speaker"][Cook.wordStage(id)];
  Cook.cardHidden = (id) => Cook.wordStage(id) >= 3 && !Cook.isPlaceholder(id);
  /** How many times the child has used a word right (the core's per-word progress; "Start over"/"Play as new" forget it). */
  Cook.timesRight = (id) => {
    if (P()) {
      const w = P().get(id);
      return (w && w.right) || 0;
    }
    return (Cook.save.words[id] && Cook.save.words[id].right) || 0;
  };
  /** The words used right before this round began (a round's ctx keeps it: a chip never changes mid-round). */
  Cook.learnedNow = () => new Set((P() ? Object.keys(P().all()) : Object.keys(Cook.save.words)).filter((id) => Cook.timesRight(id) > 0));
  /**
   * Zafar, 20 Oct: an item's word is written on its jar or chip while the child is still learning it, at every level and
   * station; once they have used it right, from the next round the chip is the speaker alone (tap to hear). Read when a
   * chip is built, against the round's snapshot (ctx.learned), so a word used right mid-round keeps its chip till the round ends.
   */
  Cook.chipWord = (id, ctx = Cook.ctx) => {
    const learned = ctx && ctx.learned;
    return learned ? !learned.has(id) : Cook.timesRight(id) === 0;
  };
  /** How many times a word has been met (heard in an order): decision 57's "the first times it is heard". */
  Cook.timesHeard = (id) => {
    if (P()) {
      const w = P().get(id);
      return (w && w.seen) || 0;
    }
    return (Cook.save.words[id] && Cook.save.words[id].seen) || 0;
  };
  Cook.paused = false;
  Cook.hintDelay = function (id) {
    // Wave 5 (clarity and calm): hints after a longer hesitation (data.calm.hintMs by word
    // stage), and never in the quiet moment at the start of a station
    const ms = ((Cook.data && Cook.data.calm) || {}).hintMs || [4000, 5000, 8000, 12000];
    return ms[Cook.wordStage(id) - 1] + Math.max(0, (Cook.quietUntil || 0) - Date.now());
  };
  const own = (id) => (Cook.save.words[id] = Cook.save.words[id] || { seen: 0, right: 0, miss: 0, streakMiss: 0 });
  Cook.markSeen = function (id) {
    if (P()) return void P().meet(id);
    const w = own(id);
    w.seen++;
    w.last = Date.now();
  };
  // a right or a miss in Cook is the child acting on the Kutchi alone: recall evidence (cue "kutchi")
  Cook.markRight = function (id) {
    if (P()) return void P().heard(id, { ok: true, cue: "kutchi" });
    const w = own(id);
    w.right++;
    w.streakMiss = 0;
    w.seen = Math.max(1, w.seen);
  };
  Cook.markMiss = function (id) {
    if (P()) return void P().heard(id, { ok: false, cue: "kutchi" });
    const w = own(id);
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

  /**
   * A person's round face (29 Sept, X4 / Q12): the family's faces are close-ups framed by the eyes (the
   * ChatGPT face sheets A1/A2, build/cut_cook_v3.py --only faces), in three moods: neutral (a small
   * smile), happy (it's right), frown (it's wrong). Anyone else has one badge. A path (Cook.v it for the DOM).
   */
  Cook.FACES = ["nani", "nana", "ma", "cousin", "isa"]; // (isa: from the v3 face sheet A2, 29 Sept)
  // ART-08 (S12, Zafar 23 Oct): Nani's and Nana's circles are the shared face circles (assets/shared/faces/, one cut rule for
  // the doctor, the girl, Nani and Nana): the same face at every mood until the sheet has their other faces
  const SHARED_FACES = ["nani", "nana"];
  Cook.facePath = function (who, mood = "neutral") {
    if (SHARED_FACES.includes(who)) return `assets/shared/faces/${who}.webp`;
    if (!Cook.FACES.includes(who)) return `assets/cook/characters/${who}-badge.webp`;
    return `assets/cook/characters/${who}-face${mood && mood !== "neutral" ? `-${mood}` : ""}.webp`;
  };

  Cook.tween = function (scene, cfg) {
    return new Promise((resolve) => {
      scene.tweens.add(Object.assign({}, cfg, { onComplete: () => resolve() }));
    });
  };

  /* ---------------- audio: recordings only ---------------- */
  // (parked modes only: Who's tell) an older word recording, through the one voice (js/core/voice.js, window.NjgVoice; S13-V)
  Cook.playRecording = function (id) {
    if (!Cook.hasAudio(id) || !global.NjgVoice) return null;
    const h = global.NjgVoice.clip(Cook.v(`assets/audio/word/${id}.mp3`));
    return Promise.race([h.done, new Promise((r) => setTimeout(r, 4000))]).then(() => true);
  };
  /* ---------------- placeholder voice (Gujarati TTS, about half speed) ----
   * Every line the game can say has a file, keyed by its normalised
   * romanised text (build/build_cook_tts.py). A family recording replaces
   * the file of the same name. Played through Web Audio, which is unlocked
   * by the first tap and works on phones where <audio> autoplay doesn't. */
  Cook.tts = {}; // parked pages only
  // letters, marks and digits of any script (romanised Kutchi today, Gujarati
  // script later); must match norm() in build/build_cook_tts.py
  Cook.norm = (s) => String(s || "").toLowerCase().normalize("NFC").replace(/[^\p{L}\p{M}\p{N} ]/gu, "").replace(/\s+/g, " ").trim();
  Cook.hasVoice = (plain) => !!Cook.tts[Cook.norm(plain)]; // parked pages only
  const bufCache = {};
  let currentSrc = null;
  async function loadBuffer(url) {
    if (!bufCache[url]) {
      bufCache[url] = fetch(Cook.v(url))
        .then((r) => r.arrayBuffer())
        .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
        .catch(() => null);
    }
    return bufCache[url];
  }
  Cook.preloadVoice = (plain) => {
    const url = Cook.tts[Cook.norm(plain)]; // parked pages only
    if (url && ctx) loadBuffer(url);
  };
  // S04-B (SH-66): a stop also cancels a clip still loading (its buffer arrives after the stop: it never starts)
  let stopGen = 0;
  Cook.stopVoice = () => {
    stopGen++;
    try {
      if (currentSrc) currentSrc.stop();
    } catch (e) {}
    currentSrc = null;
  };
  /** Is a clip sounding now? (only read by the act log, contract-21; currentSrc stays set past its end, for the stop) */
  let sounding = null;
  Cook.voiceBusy = () => sounding != null && sounding === currentSrc;
  /**
   * PAN-12 (V5): the part of a clip worth playing, without the silence its recording left at either end (the gap
   * between count words was mostly that): from just before the first sound to just after the last, measured once.
   */
  const spans = new WeakMap();
  function spanOf(buf) {
    if (spans.has(buf)) return spans.get(buf);
    let span = { at: 0, dur: buf.duration };
    try {
      const data = buf.getChannelData(0);
      let peak = 0;
      for (let i = 0; i < data.length; i += 4) peak = Math.max(peak, Math.abs(data[i]));
      const floor = Math.max(0.01, peak * 0.06);
      let a = 0;
      let b = data.length - 1;
      while (a < b && Math.abs(data[a]) < floor) a++;
      while (b > a && Math.abs(data[b]) < floor) b--;
      const rate = buf.sampleRate;
      const at = Math.max(0, a / rate - 0.04); // a breath before the first sound
      const end = Math.min(buf.duration, b / rate + 0.09); // and the word's tail
      if (peak > 0 && end - at > 0.12) span = { at, dur: end - at };
    } catch (e) {
      /* the whole clip */
    }
    spans.set(buf, span);
    return span;
  }
  /** Play a file's buffer through Web Audio; resolves when it ends (or at once if it can't load). */
  async function playURL(url) {
    if (!url) return false;
    Cook.unlockAudio();
    if (!ctx) return false;
    const gen = stopGen;
    const buf = await loadBuffer(url);
    if (!buf || gen !== stopGen) return false;
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
      src.onended = () => {
        if (sounding === src) sounding = null;
        finish();
      };
      sounding = src;
      const span = spanOf(buf);
      setTimeout(finish, (span.dur * 1000) / Cook.speed + 150);
      src.start(0, span.at, span.dur);
    });
  }
  /** Speak a line; resolves when it ends (or at once if there's no file). */
  Cook.speak = (plain) => playURL(Cook.tts[Cook.norm(plain)]); // parked pages only
  /** Speak a voice file by its manifest key (see lang.js). */
  Cook.speakKey = (key) => playURL(Cook.tts[key]); // parked pages only
  /** Speak a family recording by its own URL (js/shared/family-voice.js), relative to the game root. */
  Cook.speakFile = (url) => playURL(url);
  /** Speak several lines in a row (an order is "Muke chai khape." then "Ne ba khun."). */
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
    if (global.Sfx && global.Sfx.unlock) global.Sfx.unlock(); // (the effects' own context, js/shared/sfx.js)
  };
  /** C4: Cook is unmounted: the voice stops and the sound goes (the next mount unlocks a new one on its first tap). */
  Cook.closeAudio = function () {
    Cook.stopVoice();
    const c = ctx;
    ctx = master = null;
    Object.keys(bufCache).forEach((k) => delete bufCache[k]);
    if (c && c.close) c.close().catch(() => {});
  };
  /**
   * R6 (decision 61): a real mistake at level 1, once a round: the family's "oh oh oh" when Mum has recorded it
   * (the engine's line cook.line.oh-oh, played only from a family clip), else the soft sound. Never on a right move,
   * never from level 2 (Cook.gentleOops). Returns a promise for the callers that waited on the old spoken line.
   */
  Cook.oops = function (ctx) {
    if (!Cook.gentleOops || !Cook.gentleOops(ctx || Cook.ctx)) return Promise.resolve();
    const L = Cook.Lang;
    const line = L && L.hasLine && L.hasLine("oh-oh") ? L.line("oh-oh") : null;
    if (line && L.hasWhole(line)) return L.speak(line).catch(() => {});
    Cook.sfx.oops();
    return Cook.wait ? Cook.wait(450) : Promise.resolve();
  };
  /*
   * S13-V: Cook's effects are the shared player's (js/shared/sfx.js), by name: the same sounds, moved there. Before Cook's first
   * tap has turned its sound on (Cook.unlockAudio), an effect is quiet, as before (the test hook's "njg-sfx" event still says so).
   */
  const fx = (name, o) => (global.Sfx ? global.Sfx.play(name, Object.assign({ quiet: !ctx }, o || {})) : false);
  const fxLoop = (name) => (global.Sfx && global.Sfx.loop ? global.Sfx.loop(name, { quiet: !ctx }) : { stop() {}, pitch() {} });
  Cook.sfx = {
    right: () => fx("cook-right"),
    soft: () => fx("cook-soft"),
    oops: () => fx("cook-oops"),
    pop: () => fx("cook-pop"),
    whoosh: () => fx("cook-whoosh"),
    chop: () => fx("chop"),
    sizzle: (dur = 0.7) => fx("sizzle", { dur }),
    coin: () => fx("coin"),
    star: (i = 0) => fx("star", { i }), // parked modes only (Find it, Snap: their legacy stars); Cook never plays it
    puff: () => fx("puff"),
    flip: () => fx("flip"),
    bubble: () => fx("bubble"),
    click: () => fx("click"),
    lap: () => fx("lap"),
    fanfare: () => fx("fanfare"),
    pourLoop: () => fxLoop("pour"),
    sizzleLoop: () => fxLoop("sizzle"),
    boilLoop: () => fxLoop("boil"),
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
})(window);
