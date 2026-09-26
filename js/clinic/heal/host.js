/*
 * The clinic's healing games: the host (docs/clinic-heal-api.md). Builds a
 * game's `ctx` on the shared screen (js/clinic/screen.js), mounts it, and
 * resolves when the game calls ctx.done(). Used by the pipeline's heal stage
 * and by lab/clinic-heal-host.html.
 *
 *   const run = await Clinic.HealHost.mount(screen, "cut", {
 *     level: 1, side: "left", seed: 7, kind: "girl", ailment: "scrape",
 *     tray: [{id: "paani"}, {id: "cloth"}, {id: "plaster"}],   // default: the game's items
 *     patient: fig,                                          // optional: an existing Clinic.Figure
 *   });
 *   const result = await run.result;   // {right, total, hints, words, log, timeMs, game, level, ailment}
 *   run.destroy();
 *
 * ctx, exactly as the contract lists it, plus ADDITIONS (never renamed or
 * removed later; see "Host additions" in docs/clinic-heal-api.md):
 *   ctx.game, ctx.ailment ({id, part, side, ...}), ctx.part, ctx.data (the
 *   game's data/clinic/heal/<id>.json, or null), ctx.stage (the element),
 *   ctx.item(id) -> {id, english, kutchi, colour, glyph}, ctx.icon(item, parent),
 *   ctx.text(word, parent), ctx.word(id), ctx.trayUI (the sidebar's dishes),
 *   ctx.button(label, onPress), ctx.after(ms, fn), ctx.on(el, type, fn),
 *   ctx.sfx(name), ctx.patient.{figure, mark, swirl, focus, partAt, hotspotIn},
 *   ctx.signal(name) (Onboard.signal), ctx.isHinting().
 */
(function (global) {
  "use strict";
  const Clinic = (global.Clinic = global.Clinic || {});
  const Kit = Clinic.Kit;
  const Heal = Clinic.Heal;
  const h = Kit.h;

  const HOST = (Clinic.HealHost = {
    dataCache: {},
    bodyFile: null,
    clinic: null, // data/clinic.json
  });

  HOST.loadBase = async function () {
    if (!HOST.bodyFile) HOST.bodyFile = await Kit.loadJSON("data/patients/grey-adult.json");
    if (!HOST.clinic) HOST.clinic = (await Kit.loadJSON("data/clinic.json")) || {};
    if (HOST.clinic.items) Object.assign(Kit.ITEMS, HOST.clinic.items);
    if (Kit.art == null) await Kit.loadArt();
    return HOST;
  };
  HOST.gameData = async function (id) {
    if (!(id in HOST.dataCache)) HOST.dataCache[id] = await Kit.loadJSON(`data/clinic/heal/${id}.json`);
    return HOST.dataCache[id];
  };

  /** Look a line up: the game's data, then data/clinic.json; an object passes through; a bare string is an English placeholder. */
  HOST.line = function (lineId, gameData) {
    if (lineId && typeof lineId === "object") return lineId;
    const pools = [gameData && gameData.lines, HOST.clinic && HOST.clinic.lines];
    for (const p of pools) {
      if (p && p[lineId]) {
        const l = p[lineId];
        if (typeof l === "string") return { kutchi: null, english: l };
        return { kutchi: l.kutchi || l.k || null, english: l.english || l.e || String(lineId), audio: l.audio, who: l.who, placeholder: l.placeholder };
      }
    }
    return { kutchi: null, english: String(lineId), placeholder: true };
  };
  HOST.word = function (id, gameData) {
    const pools = [gameData && gameData.words, HOST.clinic && HOST.clinic.words, HOST.clinic && HOST.clinic.items];
    for (const p of pools) if (p && p[id]) return Object.assign({ id }, p[id]);
    return null;
  };

  const INTERJECT = {
    shabash: { kutchi: "Shabash!", english: "Well done!" },
    arre: { kutchi: "Arre re!", english: "Oh dear!" },
    achija: { kutchi: "Achija!", english: "Good!" },
    hedo: { kutchi: "Hedo!", english: "Here!" },
  };

  /** The patient API a game receives (contract + additions). */
  HOST.patientApi = function (fig, stageEl, kind) {
    return {
      kind: kind || fig.kind,
      el: fig.el,
      figure: fig,
      hotspot: (partId, side) => fig.hotspot(partId, side, stageEl),
      hotspotIn: (partId, side, frame) => fig.hotspot(partId, side, frame),
      react: (mood, ms) => fig.react(mood, ms),
      pose: (name) => fig.pose(name),
      mark: (part, side, k, o) => fig.mark(part, side, k, o),
      swirl: (part, side, on) => fig.swirl(part, side, on),
      focus: (part, side, zoom, ms) => fig.focus(part, side, zoom, ms),
      partAt: (x, y, o) => fig.partAt(x, y, o),
    };
  };

  /**
   * Mount a registered game on a screen. Returns {ctx, controller, result, destroy}.
   * `screen` is a Clinic.Screen (the lab and the pipeline both build one).
   */
  HOST.mount = async function (screen, gameId, opts = {}) {
    await HOST.loadBase();
    const def = Heal.get(gameId);
    if (!def) throw new Error(`No healing game "${gameId}" is registered`);
    const data = await HOST.gameData(gameId);
    const level = Math.max(1, Math.min(3, opts.level || 1));
    const seed = opts.seed != null ? opts.seed : Math.floor(Math.random() * 1e9);
    const rng = opts.rng || Kit.rng(seed);
    const side = opts.side === undefined ? null : opts.side;
    // the ailment: asked for, else the last one whose data says it starts at or below this level
    const byLevel = (def.ailments || []).filter((a) => {
      const d = (data && data.ailments && data.ailments[a]) || (HOST.clinic.ailments && HOST.clinic.ailments[a]) || {};
      return (d.from || 1) <= level;
    });
    const ailmentId = opts.ailment || byLevel[byLevel.length - 1] || (def.ailments || [])[0];
    const ailment = Object.assign({ id: ailmentId, part: def.part, side, game: def.id }, (data && data.ailments && data.ailments[ailmentId]) || {}, (HOST.clinic.ailments && HOST.clinic.ailments[ailmentId]) || {}, { side });
    const defaultItems = (Array.isArray(ailment.items) && ailment.items) || (def.itemsFor && def.itemsFor[ailmentId]) || def.items || [];
    const trayItems = (opts.tray || defaultItems.map((id) => ({ id }))).map((t) => (typeof t === "string" ? { id: t } : Object.assign({}, t)));

    const stage = screen.clearStage();
    stage.classList.add("cl-heal", `heal-${def.id}`);
    stage.dataset.game = def.id;
    screen.clearActions();
    screen.tally.clear();
    screen.setLevel(level);
    const kind = opts.kind || "girl";
    const patientLayer = h("div", "cl-patient-layer", stage);
    const fig = opts.patient || Clinic.Figure.make(HOST.bodyFile, { kind, colour: opts.colour, size: opts.size });
    patientLayer.appendChild(fig.el);
    fig.pose("sit");
    fig.react("idle", 0);
    if (opts.swirl !== false && ailment.part) fig.swirl(ailment.part, side, true);
    Kit.Voice.speakers.patient = () => fig.el.querySelector(".fig-head") || fig.el;

    const log = [];
    const timers = new Set();
    const listeners = [];
    const t0 = Date.now();
    let hintsAtStart = screen.hints;
    let finished = false;
    let resolveResult;
    const result = new Promise((r) => (resolveResult = r));

    // the sidebar's dishes: the tray the child brought, in order
    const tray = new Kit.Tray(screen.trayEl, trayItems.length, {});
    trayItems.forEach((it, i) => tray.fill(i, it));
    screen.trayWrap.classList.remove("hidden");
    const trayTaps = [];
    tray.onTap = (i, item) => trayTaps.forEach((fn) => fn(i, item, tray.slots[i].el));

    const card = screen.card;
    card.setTitle("", null);
    card.setRows([]);

    const ctx = {
      level,
      side,
      rng,
      seed,
      game: def,
      ailment,
      part: ailment.part,
      data,
      stage,
      patient: HOST.patientApi(fig, stage, kind),
      tray: trayItems,
      card: {
        setRows: (rows) => card.setRows(rows),
        tick: (rowId) => card.tick(rowId),
        pulse: (rowId, on) => card.pulse(rowId, on),
        // additions
        now: (rowId) => card.now(rowId),
        untick: (rowId) => card.untick(rowId),
        addRow: (row) => card.addRow(row),
        speak: (ids) => card.speak(ids),
        el: card.el,
      },
      say(lineId, o = {}) {
        const l = HOST.line(lineId, data);
        return Kit.Voice.say(l, { who: o.who || l.who || "doctor" });
      },
      interject(k) {
        const l = INTERJECT[k] || HOST.line(k, data);
        return Kit.Voice.say(l, { who: "doctor" });
      },
      tally(itemId, n) {
        screen.tally.set(itemId, n);
      },
      log(entry) {
        const e = Object.assign({ t: Date.now() - t0, game: def.id }, entry);
        log.push(e);
        if (opts.onLog) opts.onLog(e);
      },
      hint() {
        return screen.bulb.use();
      },
      isHinting: () => !!screen.bulb.on,
      onboard(script, o = {}) {
        if (!global.Onboard || opts.onboard === false) return Promise.resolve("skipped");
        return global.Onboard.run(`clinic/heal-${def.id}`, script, Object.assign({}, o));
      },
      signal(name) {
        if (global.Onboard) global.Onboard.signal(name);
      },
      done(r = {}) {
        if (finished) return;
        finished = true;
        const out = Object.assign({ right: 0, total: 0, words: [] }, r, {
          hints: (r.hints || 0) + (screen.hints - hintsAtStart),
          log: log.slice(),
          timeMs: Date.now() - t0,
          game: def.id,
          level,
          ailment: ailment.id,
          tray: trayItems,
        });
        if (opts.onDone) opts.onDone(out);
        resolveResult(out);
      },
      // --- additions ---
      item: (id) => Kit.itemInfo(id),
      icon: (item, parent, cls) => Kit.icon(item, parent, cls),
      text: (w, parent) => Kit.text(w, parent),
      word: (id) => HOST.word(id, data),
      line: (id) => HOST.line(id, data),
      trayUI: {
        el: screen.trayEl,
        dishes: () => tray.slots.map((s) => s.el),
        onTap: (fn) => trayTaps.push(fn),
        light: (i) => tray.light(i),
        select: (i) => tray.select(i),
        used: (i, on) => tray.used(i, on),
        pulse: (i, on) => tray.pulse(i, on),
        hide: () => screen.trayWrap.classList.add("hidden"),
        show: () => screen.trayWrap.classList.remove("hidden"),
      },
      button(label, onPress, cls) {
        return screen.go(label, onPress, cls);
      },
      clearButtons: () => screen.clearActions(),
      after(ms, fn) {
        const t = setTimeout(() => {
          timers.delete(t);
          if (!finished || opts.afterDone) fn();
        }, ms);
        timers.add(t);
        return t;
      },
      on(el, type, fn, o) {
        el.addEventListener(type, fn, o);
        listeners.push([el, type, fn, o]);
      },
      sfx(name) {
        try {
          if (global.Sfx && global.Sfx[name]) global.Sfx[name]();
        } catch (e) {
          /* no sound */
        }
      },
    };

    let controller = null;
    try {
      controller = def.mount(stage, ctx) || {};
    } catch (e) {
      console.error(`Healing game "${def.id}" failed to mount`, e);
      throw e;
    }
    // start() may run for a while (the doctor reads the card): mount returns at once
    const started = Promise.resolve()
      .then(() => controller.start && controller.start())
      .catch((e) => console.error(`Healing game "${def.id}" failed to start`, e));
    const run = {
      ctx,
      controller,
      result,
      started,
      figure: fig,
      destroy() {
        finished = true;
        timers.forEach((t) => clearTimeout(t));
        listeners.forEach(([el, type, fn, o]) => el.removeEventListener(type, fn, o));
        try {
          controller && controller.destroy && controller.destroy();
        } catch (e) {
          console.error(e);
        }
        if (!opts.patient) fig.destroy();
        Kit.Voice.clear();
      },
    };
    HOST.current = run;
    return run;
  };
})(typeof self !== "undefined" ? self : this);
