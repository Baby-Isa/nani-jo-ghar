/*
 * The game host (target-model § 4.4 and § 6.2; rules H1, H7, E5, E14, E17). One way to run a mode's round, for
 * every mode: a PIPELINE OF STAGES, each stage one mini-game. It generalises the two hosts that grew up apart,
 * Cook's combined-station library (js/cook/zone.js, station-lib.js) and the clinic's heal host
 * (js/clinic/heal/registry.js, host.js), which stay as they are until R4 and R5 move them onto this one.
 *
 * For each stage the host: mounts the mini-game in the play area with a ctx (below); starts it; waits for
 * ctx.done(); calls its destroy(); CHECKS that it cleared its own UI and stopped its effects (E17: anything left
 * in the play area or the page, or a voice still talking, is a finding, and the host clears it so the next stage
 * starts clean); then moves on. Pause slots between stages (and ctx.pause inside one) are where the shell may
 * put a Conversation (H44). After the last stage: one round to the core's Score.finish (badges, the personal
 * best, pocket money, word evidence, the story log line) and the shared end screen; its answer (again / next /
 * list / home) goes back to the shell.
 *
 * THE MINI-GAME (stage) INTERFACE (§ 6.2):
 *   export default {
 *     id: "pharmacy",
 *     gestures: ["tap"],               // declared once, the same at every level (E13); ctx.input refuses others
 *     levels: [1, 2, 3, 4],
 *     scene: "clinic-pharmacy",        // optional: data/scenes/<id>.json, for ctx.scene
 *     screen: "play" | "own",          // "own": a legacy game that draws the whole screen (an adapter); default "play"
 *     needs: { scripts: [], styles: [] },   // optional: classic files the shell loads first (adapters)
 *     mount(el, ctx) { return { start() {}, destroy() {}, expect?() {}, state?() {}, finish?(r) {} }; },
 *     bot?(level, rng) -> { rows, solve(strategy) },   // optional: the blind bot (C10)
 *   };
 *
 * THE CONTEXT a stage gets (it never reaches for globals):
 *   ctx.level ctx.params ctx.play ({play: "story"|"free"|"lab", arc, chapter, errand, level, place})
 *   ctx.id ("<mode>/<game>": its onboarding id, best-time key and lab address) ctx.mode ctx.game ctx.data
 *   ctx.scene        positions in the scene's own pixels -> the screen (R3a's js/shared/stage.js when it lands;
 *                    until then a marked stub with the same calls: toScreen, toScene, scale, size)
 *   ctx.lang ctx.voice ctx.progress     the core (§ 3); ctx.voice.say is tracked so the host can stop it (E17)
 *   ctx.card ctx.guide ctx.shelf ctx.buttons   the shared kit, as the page's kit object provides it (R3a)
 *   ctx.input        js/shared/input.js on the play area, with the game's declared gestures (E5 live input)
 *   ctx.onboard(id, steps, o)  the shared onboarding kit, once per child per "<mode>/<game>[/id]"
 *   ctx.mark(row, ok, {word, cue})   a row closed: right or wrong. Only the FIRST mark of a row counts (E14);
 *                                    later ones are logged as tries
 *   ctx.place(slot, item, ok?) / ctx.takeBack(slot)   take it back until Done (E14): the first placement scores
 *   ctx.hint()       a light bulb or card peek (costs the hints badge)
 *   ctx.log(entry)   the story log (story mode only)
 *   ctx.pause(name)  a natural pause: the shell may slot a Conversation here (none in a lab)
 *   ctx.rng()        seeded, so bots and tests repeat
 *   ctx.wait(ms)     resolves after ms; rejects (HostLeft) if the child leaves, so a stage's script just stops
 *   ctx.after(ms, fn) ctx.every(ms, fn) ctx.on(el, type, fn)   cleared by the host at the end of the stage
 *   ctx.test.expect(e) ctx.test.state(name)   what the stage wants next, for window.njgTest (§ 8.1)
 *   ctx.done(r?)     the stage is finished. r may carry {right, total, marks, hints, words, evidence, tasks, timeMs}
 *                    from an adapter whose game scores itself: the host turns right/total (or marks) into marks
 *                    when the stage made none; evidence [{word, ok, cue}] feeds word progress; words the end screen
 *
 *   const host = createHost({ root, core, kit, frame, stage, slots, hook: true })
 *   const res = await host.run({ mode, plan, play, level, seed, actions, params })   params: every stage's defaults
 *     -> { round, finish, out, findings, stages, left? }    out = the end screen's answer ({action})
 *   host.leave()    the child left (Home): the current stage is destroyed, waits reject, run() resolves {left}
 *
 * ES module. The only global it writes is window.njgTest (§ 8.1), and only with hook: true.
 */
import { createInput, createPlacements, GESTURES } from "./input.js";

/** Thrown into a stage's ctx.wait() when the child leaves; the host swallows it. */
export class HostLeft extends Error {
  constructor() {
    super("left");
    this.name = "HostLeft";
  }
}

/** A seeded random number generator (mulberry32): the same seed, the same game. */
export function seeded(seed) {
  let a = (Number(seed) || 1) >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** What's wrong with a mini-game definition (empty = fine). */
export function validateGame(def) {
  const out = [];
  if (!def || typeof def !== "object") return ["not an object"];
  if (!def.id || typeof def.id !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(def.id)) out.push("id: kebab-case string");
  if (typeof def.mount !== "function") out.push("mount: not a function");
  if (!Array.isArray(def.gestures) || !def.gestures.length) out.push("gestures: declare them (E13)");
  else if (def.gestures.some((g) => !GESTURES.includes(g) && g !== "voice")) out.push(`gestures: one of ${GESTURES.join(", ")} (or voice)`);
  if (!Array.isArray(def.levels) || !def.levels.length || def.levels.some((l) => !Number.isInteger(l) || l < 1)) out.push("levels: a list of levels from 1");
  if (def.screen && !["play", "own"].includes(def.screen)) out.push('screen: "play" or "own"');
  if (def.bot != null && typeof def.bot !== "function") out.push("bot: not a function");
  return out;
}

/** The level a stage runs at: the asked one if the game has it, else the nearest it has below (or its first). */
export function levelFor(def, asked) {
  const ls = (def.levels || [1]).slice().sort((a, b) => a - b);
  const n = Number(asked) || ls[0];
  if (ls.includes(n)) return n;
  const below = ls.filter((l) => l <= n);
  return below.length ? below[below.length - 1] : ls[0];
}

/**
 * The round's tally: marks (first per row counts, E14), hints, words met. Rows are scoped per stage by the host.
 * summary() -> { right, total, marks, hints, rows: [{word, ok, cue, firstTry}], tries }
 */
export function createTally() {
  const rows = new Map();
  const order = [];
  const extra = [];
  let hints = 0;
  let tries = 0;
  return {
    /** Word evidence that isn't a row of its own (an adapter's word review): it feeds word progress only. */
    evidence(word, ok, cue = "kutchi") {
      if (word) extra.push({ word, ok: !!ok, cue, firstTry: true });
    },
    mark(row, ok, o = {}) {
      const key = String(row);
      if (rows.has(key)) {
        tries++;
        rows.get(key).tries++;
        return { first: false };
      }
      rows.set(key, { row: key, ok: !!ok, word: o.word || null, cue: o.cue || "kutchi", tries: 1 });
      order.push(key);
      return { first: true };
    },
    has: (row) => rows.has(String(row)),
    hint(n = 1) {
      hints += n;
      return hints;
    },
    get hints() {
      return hints;
    },
    summary() {
      const list = order.map((k) => rows.get(k));
      return {
        right: list.filter((r) => r.ok).length,
        total: list.length,
        marks: list.map((r) => r.ok),
        hints,
        tries,
        rows: list
          .filter((r) => r.word)
          .map((r) => ({ word: r.word, ok: r.ok, cue: r.cue, firstTry: r.tries === 1 }))
          .concat(extra),
      };
    },
  };
}

/**
 * Until R3a's js/shared/stage.js lands: the same calls, marked as a stub. A scene's positions are in its
 * background's own pixels (1600x900 unless the scene file says otherwise); the picture covers the play area
 * (no letterbox, F18), centred.
 */
export function stubStage(el, scene) {
  const W = (scene && (scene.width || (scene.size && scene.size[0]))) || 1600;
  const H = (scene && (scene.height || (scene.size && scene.size[1]))) || 900;
  const box = () => {
    const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : { left: 0, top: 0, width: W, height: H };
    const k = Math.max(r.width / W, r.height / H);
    return { k, ox: r.left + (r.width - W * k) / 2, oy: r.top + (r.height - H * k) / 2 };
  };
  return {
    stub: true,
    scene: scene || null,
    size: { width: W, height: H },
    scale: () => box().k,
    toScreen(x, y) {
      const b = box();
      return { x: b.ox + x * b.k, y: b.oy + y * b.k };
    },
    toScene(x, y) {
      const b = box();
      return { x: (x - b.ox) / b.k, y: (y - b.oy) / b.k };
    },
    anchor: (id) => (scene && scene.anchors && scene.anchors[id]) || null,
  };
}

const kids = (el) => (el && el.children ? Array.from(el.children) : []);
const describe = (n) => (n ? `${(n.tagName || "node").toLowerCase()}${n.id ? "#" + n.id : ""}${n.className && typeof n.className === "string" ? "." + n.className.trim().split(/\s+/).join(".") : ""}` : "?");

export function createHost(opts = {}) {
  const T = opts.timers || { setTimeout: (f, ms) => setTimeout(f, ms), clearTimeout: (t) => clearTimeout(t), setInterval: (f, ms) => setInterval(f, ms), clearInterval: (t) => clearInterval(t), now: () => Date.now() };
  const core = opts.core || {};
  const kit = opts.kit || {};
  const doc = opts.doc !== undefined ? opts.doc : typeof document !== "undefined" ? document : null;
  const frame = opts.frame || null; // R3a's frame: {play, root, own(on)}; else the root is the play area
  const playEl = () => (frame && frame.play) || opts.root;
  const ownEl = () => (frame && frame.root) || opts.root;
  const findings = [];
  const finding = (f) => {
    findings.push(f);
    if (opts.onFinding) opts.onFinding(f);
    else if (typeof console !== "undefined" && !opts.quiet) console.warn(`host (E17): ${f.stage}: ${f.what}`);
  };

  // what's running now (for the test hook and leave())
  const now = { mode: null, def: null, ctl: null, ctx: null, stage: null, state: "idle", expect: null, finish: null, input: null, round: null, result: null };
  let leaving = null;
  let leaveFn = null;
  let runs = 0;

  const host = {
    findings,
    get current() {
      return now;
    },
    leave() {
      if (leaveFn) leaveFn();
    },
    run,
    test: null,
  };

  async function run({ mode, plan, play = { play: "lab" }, level = null, seed = null, actions = null, params = null } = {}) {
    if (!mode || !mode.games) throw new Error("host.run: no mode");
    const id = ++runs;
    const steps = Array.isArray(plan) ? plan : (plan && plan.stages) || [];
    const roundGame = (plan && !Array.isArray(plan) && plan.game) || (steps.filter((s) => s.game).length === 1 ? steps.find((s) => s.game).game : mode.id);
    const lvl = level || (play && play.level) || (steps.find((s) => s.level) || {}).level || 1;
    const rng = seeded(seed != null ? seed : (T.now() & 0x7fffffff) || 1);
    const tally = createTally();
    const words = [];
    const stages = [];
    let timeMs = 0;
    let tasks = 0;
    leaving = new Promise((resolve) => (leaveFn = () => resolve("left")));
    const res = { round: null, finish: null, out: null, findings, stages };
    now.mode = mode;
    now.state = "running";
    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.pause) {
          now.state = `pause/${step.pause}`;
          const left = await Promise.race([slot(step.pause, { mode: mode.id, play, between: true }), leaving]);
          if (left === "left") return Object.assign(res, { left: true });
          continue;
        }
        const r = await runStage(mode, step, i, { play, lvl, rng, tally, params });
        stages.push(r);
        if (r.left) return Object.assign(res, { left: true });
        if (r.words) words.push(...r.words);
        tasks += r.tasks || 0;
        timeMs += r.timeMs || 0;
      }
    } finally {
      now.def = now.ctl = now.ctx = now.stage = now.input = null;
      now.expect = null;
      leaveFn = null;
    }
    if (id !== runs) return Object.assign(res, { left: true });
    const sum = tally.summary();
    const round = {
      mode: mode.id,
      game: roundGame,
      level: lvl,
      timeMs: stages.length ? Math.round(timeMs) : undefined,
      right: sum.right,
      total: sum.total,
      marks: sum.marks,
      hints: sum.hints,
      rows: sum.rows,
      tasks: tasks || sum.total,
      play: play && play.play === "lab" ? null : play,
    };
    res.round = now.round = round;
    // Score.finish: the badges, the best, the coins, the word evidence and (story mode) the story log line
    const prevBest = core.score && core.score.best ? core.score.best(round.mode, round.game, round.level) : undefined;
    res.finish = core.score ? core.score.finish(round) : null;
    // the end screen: the shared one (js/shared/results.js), judged against the best as it was before this round
    now.state = "results";
    if (kit.Results && kit.Results.show && opts.results !== false) {
      const store = { get: (s, k) => (s === "bests" && k === resKey(round) ? prevBest : undefined), set() {} };
      const shown = kit.Results.show({
        mode: round.mode,
        game: round.game,
        level: round.level,
        timeMs: round.timeMs,
        right: round.right,
        total: round.total,
        marks: round.marks,
        hints: round.hints,
        words: dedupeWords(words),
        actions: actions || undefined,
        speak: opts.speakWord,
        sound: opts.sound !== false,
        store,
        container: opts.resultsContainer,
      });
      now.expect = { kind: "click", selector: ".njg-results .rs-next, .njg-results .rs-last [data-act]" };
      const out = await Promise.race([shown, leaving]);
      res.out = out === "left" ? { action: "home" } : out;
    } else res.out = { action: (opts.autoAction && opts.autoAction(round)) || "done", badges: res.finish && res.finish.badges };
    now.state = "done";
    now.expect = null;
    now.result = res;
    return res;
  }
  const resKey = (r) => `${r.mode || "?"}/${r.game || "-"}/L${r.level == null ? 1 : r.level}`;
  function dedupeWords(ws) {
    const seen = new Map();
    for (const w of ws) {
      const k = w.id || w.kutchi || w.english;
      if (!k) continue;
      // a word missed anywhere in the round shows as missed
      if (seen.has(k)) seen.get(k).right = seen.get(k).right !== false && w.right !== false;
      else seen.set(k, Object.assign({}, w));
    }
    return [...seen.values()];
  }

  function slot(name, info) {
    if (!opts.slots || (info.play && info.play.play === "lab")) return Promise.resolve(null);
    try {
      return Promise.resolve(opts.slots(name, info)).catch(() => null);
    } catch (e) {
      return Promise.resolve(null);
    }
  }

  async function runStage(mode, step, i, { play, lvl, rng, tally, params }) {
    const def = mode.games[step.game];
    if (!def) throw new Error(`host: ${mode.id} has no game "${step.game}"`);
    const problems = validateGame(def);
    if (problems.length) throw new Error(`host: ${mode.id}/${step.game}: ${problems.join("; ")}`);
    const level = levelFor(def, step.level || lvl);
    const own = def.screen === "own";
    const el = own ? ownEl() : playEl();
    if (!el) throw new Error("host: no element to mount in");
    if (own && frame && frame.own) frame.own(true);
    const before = new Set(kids(el));
    const bodyBefore = doc && doc.body ? new Set(kids(doc.body)) : null;
    const timers = new Set();
    const intervals = new Set();
    const listeners = [];
    const waits = new Set();
    const tracked = new Set(); // voice lines this stage started
    const placements = createPlacements();
    const stageId = `${mode.id}/${def.id}`;
    const scope = (row) => `${i}:${row}`;
    let marks = 0;
    let finished = false;
    let resolveDone;
    const done = new Promise((r) => (resolveDone = r));
    const tStart = T.now();
    let tAct = null; // the stage's first action: its time runs from here to Done (pauses and Conversations don't count)
    const info = { game: def.id, level, tStart, tEnd: null, timeMs: 0, left: false, words: null, tasks: 0, result: null };

    const input = createInput(el, {
      gestures: def.gestures,
      onAct: () => {
        if (tAct == null) tAct = T.now();
        // E5: input is live while a line plays; the shell may cut it short (opts.onActDuringSpeech)
        if (core.voice && core.voice.busy && core.voice.busy() && opts.onActDuringSpeech) opts.onActDuringSpeech(stageId);
      },
    });
    const voice = core.voice
      ? Object.assign(Object.create(core.voice), {
          say(r, o) {
            const p = Promise.resolve(core.voice.say(r, o));
            const entry = { channel: (o && o.channel) || "main", p };
            tracked.add(entry);
            p.finally(() => tracked.delete(entry)).catch(() => {});
            return p;
          },
        })
      : null;

    const ctx = {
      id: stageId,
      mode: mode.id,
      game: def.id,
      level,
      params: Object.assign({}, params, step.params),
      play: Object.assign({ play: "lab" }, play),
      data: mode.loaded || {},
      get scene() {
        const sc = def.scene && mode.loaded ? mode.loaded[`data/scenes/${def.scene}.json`] : null;
        return (opts.stage || stubStage)(el, sc);
      },
      lang: core.lang || null,
      voice,
      progress: core.progress || null,
      card: kit.card || null,
      guide: kit.guide || null,
      shelf: kit.shelf || null,
      buttons: kit.buttons || null,
      input,
      rng,
      onboard(sub, steps, o = {}) {
        const key = sub ? `${stageId}/${sub}` : stageId;
        if (!kit.Onboard || !kit.Onboard.run || opts.onboard === false) return Promise.resolve("skipped");
        return kit.Onboard.run(key, steps, o);
      },
      mark(row, ok, o) {
        if (finished) return { first: false };
        marks++;
        return tally.mark(scope(row), ok, o);
      },
      place(slotId, item, ok) {
        const r = placements.place(slotId, item);
        if (r.ok && r.first && ok != null) ctx.mark(`place:${slotId}`, ok, typeof item === "object" && item ? { word: item.word } : {});
        return r;
      },
      takeBack: (slotId) => placements.takeBack(slotId),
      placed: (slotId) => placements.at(slotId),
      hint(n = 1) {
        return tally.hint(n);
      },
      log(entry) {
        if (!core.log || !play || play.play !== "story") return null;
        return core.log.log(Object.assign({ arc: play.arc, chapter: play.chapter, errand: play.errand }, entry));
      },
      pause: (name) => slot(name, { mode: mode.id, game: def.id, play }),
      wait(ms) {
        return new Promise((resolve, reject) => {
          if (finished) return reject(new HostLeft());
          const w = { reject };
          const t = T.setTimeout(() => (waits.delete(w), timers.delete(t), resolve()), ms);
          w.t = t;
          timers.add(t);
          waits.add(w);
        });
      },
      after(ms, fn) {
        const t = T.setTimeout(() => {
          timers.delete(t);
          if (!finished) fn();
        }, ms);
        timers.add(t);
        return t;
      },
      every(ms, fn) {
        const t = T.setInterval(() => !finished && fn(), ms);
        intervals.add(t);
        return t;
      },
      on(target, type, fn, o) {
        target.addEventListener(type, fn, o);
        listeners.push([target, type, fn, o]);
      },
      test: {
        expect: (e) => (now.expect = e || null),
        state: (name) => (now.stateName = name || null),
      },
      done(r = {}) {
        if (finished) return;
        finished = true; // Done: nothing moves, nothing more is marked (E14)
        placements.done();
        info.result = r || {};
        resolveDone("done");
      },
    };

    // mount and start
    now.def = def;
    now.ctx = ctx;
    now.stage = stageId;
    now.input = input;
    now.expect = null;
    now.stateName = null;
    now.state = `stage/${stageId}`;
    now.finish = (r) => {
      if (now.ctl && now.ctl.finish) return now.ctl.finish(r);
      const b = def.bot ? def.bot(level, rng) : null;
      const fair = b ? (typeof b.fair === "function" ? b.fair() : b.solve("fair")) : null;
      ctx.done(Object.assign({}, fair && typeof fair === "object" && !Array.isArray(fair) ? fair : {}, r, { finishedByTest: true }));
    };
    let ctl = {};
    try {
      ctl = def.mount(el, ctx) || {};
    } catch (e) {
      finding({ stage: stageId, kind: "mount", what: `mount threw: ${e && e.message}` });
      throw e;
    }
    now.ctl = ctl;
    Promise.resolve()
      .then(() => ctl.start && ctl.start())
      .catch((e) => {
        if (e instanceof HostLeft || (e && e.name === "HostLeft")) return;
        finding({ stage: stageId, kind: "start", what: `start failed: ${e && e.message}` });
        if (typeof console !== "undefined") console.error(e);
      });

    const why = await Promise.race([done, leaving]);
    finished = true;
    info.tEnd = T.now();
    if (why === "left") info.left = true;
    placements.done();

    // turn an adapter's own score into marks when the stage made none (its rows unnamed)
    const r = info.result || {};
    if (!info.left && !marks && r.total > 0) {
      const right = Math.max(0, Math.min(r.right || 0, r.total));
      const list = Array.isArray(r.marks) && r.marks.length === r.total ? r.marks : Array.from({ length: r.total }, (_, k) => k < right);
      list.forEach((ok, k) => tally.mark(scope(`r${k}`), ok));
    }
    if (!info.left && r.hints) tally.hint(r.hints);
    if (!info.left && Array.isArray(r.evidence)) r.evidence.forEach((x) => x && tally.evidence(x.word, x.ok, x.cue));
    info.words = Array.isArray(r.words) ? r.words : null;
    // an adapter whose game keeps its own clock passes timeMs; otherwise first action (or mount) to Done
    info.timeMs = typeof r.timeMs === "number" ? r.timeMs : info.tEnd - (tAct != null ? tAct : tStart);
    info.tasks = r.tasks || 0;

    // tear down: the stage's own destroy, then the host's checks (E17)
    try {
      if (ctl.destroy) ctl.destroy();
    } catch (e) {
      finding({ stage: stageId, kind: "destroy", what: `destroy threw: ${e && e.message}` });
    }
    timers.forEach((t) => T.clearTimeout(t));
    intervals.forEach((t) => T.clearInterval(t));
    waits.forEach((w) => w.reject(new HostLeft()));
    listeners.forEach(([t, type, fn, o]) => t.removeEventListener(type, fn, o));
    input.destroy();
    const left = kids(el).filter((n) => !before.has(n) && !(n.dataset && n.dataset.njgKeep != null));
    left.forEach((n) => {
      finding({ stage: stageId, kind: "ui-left", what: `left ${describe(n)} in the ${own ? "screen" : "play area"} (E17: a stage clears its own UI)` });
      try {
        n.remove();
      } catch (e) {
        /* already gone */
      }
    });
    if (bodyBefore && doc && doc.body && el !== doc.body) {
      kids(doc.body)
        .filter((n) => !bodyBefore.has(n) && !(n.dataset && n.dataset.njgKeep != null) && !(n.classList && n.classList.contains("njg-results")))
        .forEach((n) => {
          finding({ stage: stageId, kind: "ui-left", what: `left ${describe(n)} on the page (E17)` });
          try {
            n.remove();
          } catch (e) {
            /* already gone */
          }
        });
    }
    if (tracked.size) {
      finding({ stage: stageId, kind: "effect-left", what: `a voice line still playing after the stage ended (E17: a stage stops its effects)` });
      [...tracked].forEach((t) => core.voice && core.voice.stop && core.voice.stop(t.channel));
    }
    if (own && frame && frame.own) frame.own(false);
    return info;
  }

  // the one test hook (§ 8.1): every mode's page answers the same calls
  host.test = {
    ready: () => true,
    state: () => (now.stage ? `${now.stage}${now.stateName ? "/" + now.stateName : now.ctl && now.ctl.state ? "/" + now.ctl.state() : ""}` : now.state),
    expect: () => (now.ctl && now.ctl.expect ? now.ctl.expect() : now.expect),
    hitAreas: () => [].concat(now.input ? now.input.hitAreas() : [], now.ctl && now.ctl.hitAreas ? now.ctl.hitAreas() : []),
    states: () => (now.mode && now.mode.states ? now.mode.states() : now.mode ? Object.keys(now.mode.games).map((g) => `${now.mode.id}/${g}`) : []),
    findings: () => findings.slice(),
    finish: (r) => now.finish && now.finish(r),
    controller: () => now.ctl,
    round: () => now.round,
    result: () => now.result,
  };
  if (opts.hook && typeof window !== "undefined") window.njgTest = host.test;
  return host;
}

export default createHost;
