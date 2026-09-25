/*
 * Monsoon rush: core (data, word progress, the voice, the mechanic
 * registry and the storm runner). Design: docs/modes/monsoon-rush-design.md.
 *
 * monsoon.html loads Cook's core.js and lang.js (data, the placeholder
 * voice, line building) and never copies them. Word progress goes through
 * js/progress.js: until the shell attaches the player's profile, the Rush
 * lab attaches a temporary in-memory one (nothing is stored; no
 * localStorage keys of our own).
 *
 * A storm: an intro card, three seconds of quiet, then waves. Each wave is
 * played by the game's mechanic (js/monsoon/mechanics/<id>.js), which gets
 * the wave, its timing (Calls.timing) and a ctx, and resolves to the
 * player's answers at the wave's end. The runner grades them
 * (Calls.grade), lights the stars as they happen, lets a missed call come
 * back (Calls.session) and ends with the result card and word review.
 *
 * Test hooks (window.__monsoon): state(), expectation(), view(),
 * advance(dt) and step(dt, n) for ?clock=virtual.
 */
(function (global) {
  const M = (global.Monsoon = global.Monsoon || {});
  const Calls = M.Calls;
  const params = new URLSearchParams(global.location.search);
  M.params = params;
  M.virtual = params.get("clock") === "virtual";
  M.clock = M.virtual ? new M.Clock.VirtualClock(0) : new M.Clock.AudioClock();
  M.muted = M.virtual || params.get("mute") === "1";

  /* ---------------- data ---------------- */
  const getJSON = (url) => fetch(url).then((r) => r.json());
  M.load = async function () {
    await Cook.load();
    const [data, audio, scene] = await Promise.all([getJSON("data/monsoon.json"), getJSON("data/monsoon-audio.json").catch(() => ({ clips: {} })), getJSON("data/scenes/kitchen-monsoon.json")]);
    M.data = data;
    M.audio = audio;
    M.scene = scene;
    M.base = await getJSON(`data/scenes/${scene.base}.json`);
    // placeholder words live in monsoon.json; Cook's Lang reads Cook.data.words, so it
    // gets a merged view (in memory only; data/cook.json is never written)
    M.words = Object.assign({}, Cook.data.words, data.words);
    Cook.data.words = M.words;
    M.attachLabProfile();
    return data;
  };

  /* ---------------- word progress (js/progress.js) ---------------- */
  M.profile = null;
  M.attachLabProfile = function () {
    if (M.profile) return;
    M.profile = { id: "monsoon-lab", temporary: true, words: {} };
    Progress.attachProfile(M.profile, null);
  };
  /** Lab presets: how well the player knows every word before the storm. */
  M.presetWords = function (preset) {
    if (!preset || preset === "played") return;
    const n = { fresh: 0, learning: 1, known: 3, strong: 6 }[preset];
    const ids = Object.keys(M.words);
    M.profile.words = {};
    if (n)
      ids.forEach((id) => {
        M.profile.words[id] = { wordId: id, timesMet: n, timesCorrect: n, understand_stage: n >= 6 ? 4 : n >= 3 ? 3 : 2, produce_stage: 1, misses: 0, last_seen: Date.now() };
      });
  };
  M.stageOf = (id) => Math.min(4, Progress.get(id).understand_stage);

  /* ---------------- the voice ---------------- */
  /** A spoken part as one of Cook's lines (Kutchi from the data, or a grey English placeholder). */
  M.lineFor = function (part) {
    const t = Calls.text(part, { words: M.words, lines: Cook.data.lines, grammar: Cook.data.grammar });
    const w = t.words[0];
    return { segs: [{ t: t.k || t.en, lang: t.k ? "k" : "e", w }], en: t.en, k: t.k, draft: t.draft, words: t.words, part };
  };
  M.say = function (part) {
    if (M.muted || M.listening) return Promise.resolve(false);
    try {
      return Cook.Lang.speak(M.lineFor(part));
    } catch (e) {
      return Promise.resolve(false);
    }
  };
  M.sayLine = function (key) {
    return M.say({ line: key });
  };

  /* ---------------- mechanics ---------------- */
  M.Mech = {
    defs: {},
    define(id, def) {
      this.defs[id] = Object.assign({ id }, def);
    },
    get(id) {
      const d = this.defs[id];
      if (!d) throw new Error(`no mechanic ${id}`);
      return d;
    },
  };

  /* ---------------- the runner ---------------- */
  class Run {
    constructor(opts) {
      this.opts = opts;
      this.token = (M.runToken = (M.runToken || 0) + 1);
      this.onTap = null;
      this.expect = null;
      this.wave = null;
      this.T = null;
      this.live = false;
    }
    alive() {
      return this.token === M.runToken;
    }
    async start() {
      const o = this.opts;
      M.presetWords(o.words);
      const game = M.data.games[o.game];
      const storm = Calls.storm(o.game, o.level, {
        data: M.data,
        cook: Cook.data,
        audio: M.audio,
        scene: M.scene,
        stage: M.stageOf,
        mode: o.mode,
        seed: o.seed,
        bpm: o.bpm || null,
        frames: o.frames || null,
        stage1: o.stage1 !== false,
      });
      this.storm = storm;
      this.game = game;
      this.session = Calls.session(storm);
      this.mech = M.Mech.get(game.mech);
      this.bot = o.bot ? M.Bots.make(o.bot, o.botSeed || 77) : null;
      M.run = this;
      M.Stage.build(storm, this.mech);
      M.UI.startStorm(this);
      this.mech.build && this.mech.build(this.ctx());
      if (!o.skipIntro) await M.UI.intro(this);
      if (!this.alive()) return;
      M.clock.unlock && M.clock.unlock();
      M.FX.rain(true);
      let t = M.clock.now() + (o.quiet != null ? o.quiet : 3);
      await M.clock.until(t);
      let w;
      while ((w = this.session.next())) {
        if (!this.alive()) return;
        const T = Calls.timing(w, t, storm);
        this.wave = w;
        this.T = T;
        const answers = await this.playWave(w, T);
        if (!this.alive()) return;
        const g = Calls.grade(w, T, answers, storm);
        if (w.helped) Object.values(g.targets).forEach((r) => r.outcome === "heard" && (r.outcome = "helped"));
        const rec = this.session.record(w, T, answers, g);
        M.UI.waveDone(this, rec);
        this.onWave && this.onWave(rec);
        t = Math.max(T.end, M.clock.now());
      }
      this.wave = null;
      this.expect = null;
      M.FX.rain(false);
      const res = Calls.stars(this.session);
      const log = Calls.applyProgress(this.session, {
        stage: M.stageOf,
        right: (id) => Progress.recordCorrect(id),
        miss: (id) => Progress.recordMiss(id),
        seen: (id) => Progress.recordMeeting(id),
      });
      this.result = Object.assign(res, { progress: log });
      M.UI.result(this, res);
      this.done = true;
      this.onDone && this.onDone(this.result);
      return this.result;
    }
    /** What the mechanics get: the storm, the clock, the scene, and ways to talk to the runner. */
    ctx() {
      const run = this;
      return {
        run,
        storm: this.storm,
        clock: M.clock,
        stage: M.Stage,
        ui: M.UI,
        fx: M.FX,
        mode: this.storm.mode,
        cfg: this.storm.cfg,
        alive: () => run.alive(),
        setTap: (fn) => (run.onTap = fn),
        setExpect: (e) => (run.expect = e),
      };
    }
    async playWave(w, T) {
      const ctx = this.ctx();
      // a lab bot plays through the same tap path a finger does
      if (this.bot) {
        const v = M.Bots.view(this.storm, w, T, { menu: M.data.menu_words });
        this.botView = v;
        const planned = (this.bot.decide(v) || []).filter((a) => a.t >= T.t0 && a.t < T.end);
        planned.forEach((a) => M.clock.at(a.t, () => this.alive() && this.botAct(a)));
      }
      const answers = await this.mech.play(ctx, w, T);
      if (this.bot) this.bot.observe(this.botView, { wave: w });
      this.onTap = null;
      return answers;
    }
    botAct(a) {
      if (a.pick != null) M.Stage.tapCand(a.pick);
      else if (a.via) this.onSay && this.onSay(a);
    }
    tap(cand) {
      if (this.onTap) return this.onTap(cand);
      M.Stage.wobble(cand); // no call is live: a gentle "wait", never a miss
    }
    stop() {
      M.runToken++;
      M.Stage.clear();
      M.FX.rain(false);
    }
  }
  M.Run = Run;
  M.play = (opts) => {
    if (M.run) M.run.stop();
    const r = new Run(opts);
    r.promise = r.start();
    return r;
  };

  /* ---------------- test hooks ---------------- */
  global.__monsoon = {
    ready: false,
    state() {
      const r = M.run;
      if (!r) return { phase: "lab" };
      return {
        phase: r.done ? "result" : r.wave ? "wave" : "between",
        now: M.clock.now(),
        game: r.opts.game,
        level: r.opts.level,
        mode: r.storm && r.storm.mode,
        wave: r.wave ? { i: r.wave.i, frame: r.wave.frame, retry: r.wave.retry, targets: r.wave.targets.map((t) => ({ cand: t.cand, n: t.n, word: t.word })) } : null,
        timing: r.T ? { t0: r.T.t0, keyEnd: r.T.keyEnd, reveal: r.T.reveal, land: r.T.land, end: r.T.end, dropStart: r.T.dropStart, dropEvery: r.T.dropEvery } : null,
        played: r.session ? r.session.results.length : 0,
        result: r.result ? { stars: r.result.stars, tally: r.result.tally, placeholder: r.result.placeholder } : null,
        outcomes: r.session ? r.session.results.map((x) => Object.fromEntries(Object.entries(x.grade.targets).map(([k, v]) => [k, v.outcome]))) : [],
      };
    },
    expectation() {
      return M.run && M.run.expect ? M.run.expect : null;
    },
    view() {
      const r = M.run;
      if (!r || !r.wave) return null;
      const v = M.Bots.view(r.storm, r.wave, r.T, { menu: M.data.menu_words });
      delete v.dropLand;
      return v;
    },
    /** Where a candidate is on screen (client px), for real pointer taps. */
    where(cand) {
      return M.Stage.screenOf(cand);
    },
    advance(dt) {
      if (!M.clock.virtual) return M.clock.now();
      const t = M.clock.advance(dt);
      M.Stage.render();
      return t;
    },
    async step(dt, n) {
      for (let i = 0; i < (n || 1); i++) {
        this.advance(dt);
        await new Promise((r) => setTimeout(r, 0));
      }
      return M.clock.now();
    },
    play(opts) {
      M.Lab && M.Lab.hide();
      return !!M.play(Object.assign({ skipIntro: true }, opts));
    },
    /** The bot's plan for the live wave (the Node bots' own code), for the browser leak test. */
    botPlan(name, seed) {
      const r = M.run;
      if (!r || !r.wave) return [];
      r._pwBots = r._pwBots || {};
      const b = (r._pwBots[name] = r._pwBots[name] || M.Bots.make(name, seed || 77));
      const v = M.Bots.view(r.storm, r.wave, r.T, { menu: M.data.menu_words });
      if (r._pwLastWave !== r.wave) {
        if (r._pwPrev) b.observe(r._pwPrev.v, { wave: r._pwPrev.w });
        r._pwPrev = { v, w: r.wave };
        r._pwLastWave = r.wave;
      }
      return (b.decide(v) || []).filter((a) => a.t >= r.T.t0 && a.t < r.T.end);
    },
    nodeReplay(opts, name, seed) {
      // the same storm and bot, played headless by the Node player (js/monsoon/bots.js)
      M.presetWords(opts.words || "known");
      const storm = Calls.storm(opts.game, opts.level, { data: M.data, cook: Cook.data, audio: M.audio, scene: M.scene, stage: M.stageOf, mode: opts.mode, seed: opts.seed, stage1: true });
      const S = M.Bots.play(storm, M.Bots.make(name, seed || 77), { menu: M.data.menu_words });
      return S.results.map((x) => Object.fromEntries(Object.entries(x.grade.targets).map(([k, v]) => [k, v.outcome])));
    },
    preset(p) {
      M.presetWords(p);
    },
  };
})(window);
