/*
 * The clinic's healing games: the host (docs/architecture/clinic-heal-api.md). Builds a
 * game's `ctx` on the shared screen (js/clinic/screen.js), mounts it, and
 * resolves when the game calls ctx.done(). Used by the pipeline's heal stage
 * and by lab/clinic-heal-host.html.
 *
 *   const run = await Clinic.HealHost.mount(screen, "cut", {
 *     level: 1, side: "left", seed: 7, kind: "girl", ailment: "scrape",
 *     tray: [{id: "paani"}, {id: "cloth"}, {id: "plaster"}],   // default: the game's items
 *     patient: fig,                                          // optional: an existing Clinic.Figure
 *     part: "hand",                                          // optional: the diagnosed part (the pipeline)
 *   });
 *   const result = await run.result;   // {right, total, hints, words, log, timeMs, game, level, ailment}
 *   run.destroy();
 *
 * ctx, exactly as the contract lists it, plus ADDITIONS (never renamed or
 * removed later; see "Host additions" in docs/architecture/clinic-heal-api.md):
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
    // the clinic's words and lines: the language engine (js/core/lang/engine/ over data/lang/; step 4e, js/clinic/lang.js)
    if (!HOST.lang) {
      // a page that didn't load the clinic's half itself (the demo's adapter): load it now
      if (!global.ClinicLang) await new Promise((res) => {
        const sc = document.createElement("script");
        sc.src = (global.njgV || ((u) => u))(`${Kit.root || ""}js/clinic/lang.js`);
        sc.onload = sc.onerror = () => res();
        document.body.appendChild(sc);
      });
      await global.ClinicLang.ready((p) => Kit.loadJSON(p), Kit.root || "");
      HOST.lang = global.ClinicLang;
    }
    // the items, once: data/clinic.json's, then the clinic v2 overrides in data/clinic/pipeline.json on top (the apple,
    // the tube, the torch). CLN-66: merging clinic.json's items again on every mount put the 🍭 back over the apple.
    if (!HOST.itemsMerged) {
      HOST.itemsMerged = true;
      if (HOST.clinic.items) Object.entries(HOST.clinic.items).forEach(([id, it]) => (Kit.ITEMS[id] = Object.assign({}, it, Kit.ITEMS[id] || {})));
      const pj = (await Kit.loadJSON("data/clinic/pipeline.json")) || {};
      Object.entries(pj.items || {}).forEach(([id, it]) => id !== "_about" && (Kit.ITEMS[id] = Object.assign({}, Kit.ITEMS[id] || {}, it)));
    }
    if (Kit.art == null) await Kit.loadArt();
    // the patients' real art and the close-ups (pack clinic-heal-v3, build/cut_clinic_heal_v3.py)
    if (HOST.healArt == null) HOST.healArt = (await Kit.loadJSON("data/clinic/heal-art.json")) || {};
    return HOST;
  };
  HOST.gameData = async function (id) {
    if (!(id in HOST.dataCache)) HOST.dataCache[id] = await Kit.loadJSON(`data/clinic/heal/${id}.json`);
    return HOST.dataCache[id];
  };

  /**
   * A line by key, through the engine (js/clinic/lang.js line): the game's data names the line (and, for a line with
   * slots, its engine meaning `fn`); the words are the engine's. A display word passes through; a bare key the data
   * doesn't hold is the engine's phrase for it, or a placeholder.
   */
  HOST.line = function (lineId, gameData, vars) {
    if (lineId && typeof lineId === "object") return lineId;
    const pools = [gameData && gameData.lines, HOST.clinic && HOST.clinic.lines];
    let def = null;
    for (const p of pools) if (p && p[lineId] && typeof p[lineId] === "object") def = def || p[lineId];
    return global.ClinicLang.line(lineId, vars || {}, { def: def || {} });
  };
  /** A word by id, through the engine: the display word, plus the data's non-language fields (art, colour, glyph). */
  HOST.word = function (id, gameData) {
    const pools = [gameData && gameData.words, HOST.clinic && HOST.clinic.words, HOST.clinic && HOST.clinic.items];
    let info = null;
    for (const p of pools) if (p && p[id]) info = info || p[id];
    if (!info && !global.ClinicLang.lex(id)) return null;
    const rest = {};
    Object.keys(info || {}).forEach((k) => !/^(kutchi|kutchi_one|kutchi_many|english|k|e|forms|say|say_forms|src|draft|gender|from)$/.test(k) && (rest[k] = info[k]));
    return Object.assign(rest, global.ClinicLang.w(id), { id });
  };

  // the doctor's short interjections (E27): the engine's phrases, by the clinic's old ids (its aliases)
  const INTERJECT = { shabash: "cl-shabash", arre: "cl-arre", achija: "cl-achija", hedo: "cl-hedo" };
  const LANG = () => global.ClinicLang;

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
   * D1, D2 (1 Oct, decision 27; CLN-43): the staging. Every heal game opens on the wide shot (the exam room, the
   * patient on the bed's edge: the diagnosis's own scene), zooms in on the sore part, and swaps to the close-up at
   * the peak, the room blurred behind; when the game ends it zooms back out and the patient says the line
   * "thank you, I feel better" (to record). Stand-in art for now (the sitting figure, the drawn close-ups): the art
   * batch only swaps pictures. The wide shot's angle is the game's data (camera.wide: "front" | "side"); there is
   * no side-on sitting pose yet, so "side" uses the front pose (art list A1).
   *   const z = HOST.stage(stage, fig, {part, side, camera, level}); await z.in(); ...; await z.out();
   * Web Animations, so tests can pause them; reduced motion: a plain cross-fade.
   */
  HOST.stage = function (stage, fig, o = {}) {
    const doc = stage.ownerDocument;
    const V = Clinic.Scenes;
    const room = V && V.rooms && V.rooms.exam;
    const cfg = (V && V.exam) || null;
    const reduced = !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const ms = Kit.fast ? 120 : o.ms || 900;
    const none = { wide: null, in: () => Promise.resolve(), out: () => Promise.resolve(), destroy() {} };
    if (!room || !cfg || !fig || !Clinic.Stages || !Clinic.Stages.fitScene) return none;
    const wide = h("div", "cl-zoom", stage);
    wide.dataset.camera = (o.camera && o.camera.wide) || "front";
    const cap = h("div", "cl-scene-cap", wide);
    const box = h("div", "cl-scene cl-zoom-box", wide);
    const url = `url("${Kit.url(room.src)}")`;
    box.style.backgroundImage = url;
    cap.style.backgroundImage = url;
    const layer = h("div", "cl-patient-layer v2", box);
    // A1 (5 Oct): the patient's real art when it's cut (heal-art.json), front-on or side-on by the game's camera
    // (D2); side-on, the patient sits on the bed's right-hand end (scenes-v2 exam.side)
    const view = wide.dataset.camera === "side" ? "side" : "front";
    const spec = HOST.healArt && HOST.healArt.patients && HOST.healArt.patients[fig.kind];
    const hadArt = !!fig.art;
    const art = spec && fig.useArt ? fig.useArt(spec, { view, figH: cfg.fig.h }) : false;
    const sideOn = art && fig.art.view === "side" && cfg.side;
    Clinic.Stages.place(layer, { x: sideOn ? cfg.side.x : cfg.fig.x, y: cfg.fig.bottom, h: cfg.fig.h, w: (cfg.fig.h * (620 / 900)) / 1.5, z: 3 });
    const home = fig.el.parentNode;
    layer.appendChild(fig.el);
    fig.pose("sit");
    let frozen = false; // once the zoom starts, the seat is fixed (later measures would read a scaled or moved figure)
    const seat = () => {
      if (cfg.seat == null || frozen || fig.el.parentNode !== layer) return;
      layer.style.top = `${cfg.fig.bottom * 100}%`;
      // the art sits by its measured seat line (the backs of the thighs on the mattress); the greybox by its knee
      const q = fig.hotspot(art ? "seat" : "knee", "left", box);
      const H = box.clientHeight || 1;
      const y = sideOn && cfg.side.seat != null ? cfg.side.seat : cfg.seat;
      if (q && isFinite(q.y)) layer.style.top = `${(cfg.fig.bottom + (y * H - q.y) / H) * 100}%`;
    };
    Clinic.Stages.fitScene(wide, box, cap, room, V.aspect || 1.5);
    seat();
    box.addEventListener("scenefit", seat);
    const part = String(o.part || "knee").replace(/^body-/, "");
    // the part's anchor on the wide shot, and how far to push in (the part fills about 60 % of the play height)
    const anchor = () => {
      const q = fig.hotspot(part, o.side || "left", box) || { x: box.clientWidth / 2, y: box.clientHeight / 2, r: 40 };
      const bw = box.clientWidth || 1;
      const bh = box.clientHeight || 1;
      const H = stage.clientHeight || bh;
      let k = Math.max(2.2, Math.min(5, (0.6 * H) / Math.max(24, 2.4 * (q.r || 30))));
      let dx = 0;
      let dy = 0;
      // A1 (5 Oct), the match cut (art plan 2.1, 7.6): the game's data names where its close-up draws the part
      // (camera.target [x, y] and camera.size, its radius, in the close-up's 800 x 500 units); the push-in then ends
      // with the part at that place and size, so the close-up cross-fades in over the same knee, ear or mouth
      const t = o.camera && o.camera.target;
      const svg = t && stage.querySelector(".hs-root .hs-svg");
      const m = svg && svg.getScreenCTM && svg.getScreenCTM();
      if (m && fig.art) {
        const br = box.getBoundingClientRect();
        const tx = m.a * t[0] + m.c * t[1] + m.e - br.left;
        const ty = m.b * t[0] + m.d * t[1] + m.f - br.top;
        if (o.camera.size && q.r) k = Math.max(1.6, Math.min(9, (o.camera.size * m.a) / q.r));
        dx = tx - q.x;
        dy = ty - q.y;
      }
      return { ox: (100 * q.x) / bw, oy: (100 * q.y) / bh, k, dx, dy };
    };
    // the round is over: the "it hurts here" swirl goes (a healed patient never keeps it into the room or the card)
    const healed = () => fig.el.querySelectorAll(".fig-swirl").forEach((n) => n.remove());
    // the figure goes back as it came: the next stage (the send-off stands the patient up) draws the greybox
    const restore = () => {
      if (!art || hadArt || !fig.artBox) return;
      fig.artBox.remove();
      fig.el.classList.remove("has-art");
      fig.groups.marks.removeAttribute("transform");
      fig.art = fig.artEl = fig.artBox = null;
    };
    const play = (el, frames, opts) => (el.animate && !reduced ? el.animate(frames, opts).finished.catch(() => {}) : Promise.resolve());
    const z = {
      wide,
      /** The push-in: the room scales about the part and blurs; at the peak it fades to the close-up below. */
      async in() {
        seat();
        const a = (z.at = anchor());
        frozen = true;
        z.top = layer.style.top; // the seated position, kept for the pull-out (the figure moves away in between)
        box.style.transformOrigin = `${a.ox}% ${a.oy}%`;
        wide.classList.add("on");
        const zoom = play(box, [{ transform: "translate(0px, 0px) scale(1)", filter: "blur(0px)" }, { transform: `translate(${a.dx}px, ${a.dy}px) scale(${a.k})`, filter: "blur(4px)" }], { duration: ms, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" });
        // CLN-77 (2 Oct): the room hands over to the close-up early (gone by 60 % of the push-in), so the
        // late frames are never a full-screen smear of a blurred, hugely scaled room
        const fade = play(wide, [{ opacity: 1 }, { opacity: 1, offset: 0.3 }, { opacity: 0, offset: 0.6 }, { opacity: 0 }], { duration: ms, easing: "ease-in-out", fill: "forwards" });
        await Promise.all([zoom, fade]);
        if (z.leaving) return; // the game already ended (a very quick round): the pull-out owns the layer now
        wide.classList.remove("on");
        wide.classList.add("gone");
        if (home) home.appendChild(fig.el);
      },
      /** The pull-out: the room comes back over the close-up, zoomed in, then out to the wide shot (the patient happy). */
      async out() {
        if (!wide.isConnected) return;
        z.leaving = true;
        // CLN-77: the close-up's own UI (the tool column, the face, panels, pills, counts) goes before the pull-out,
        // so it never shows through the room as ghost rectangles; the close-up's drawing stays for the cross-fade
        stage.classList.add("cl-outro");
        // measure on the unscaled room: the push-in's last frame (scaled, blurred) is still held
        [box, wide].forEach((el) => el.getAnimations && el.getAnimations().forEach((an) => an.cancel()));
        layer.appendChild(fig.el);
        fig.pose("sit");
        fig.react("happy", 0);
        healed();
        if (z.top) layer.style.top = z.top;
        const a = z.at || anchor();
        // CLN-77: the pull-out starts part of the way in, lightly softened: never a full-screen smear of a huge,
        // blurred patient
        const k0 = 1 + (a.k - 1) * 0.55;
        box.style.transformOrigin = `${a.ox}% ${a.oy}%`;
        wide.classList.remove("gone");
        wide.classList.add("on");
        await Promise.all([
          play(wide, [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }], { duration: ms, easing: "ease-out", fill: "forwards" }),
          play(box, [{ transform: `translate(${(a.dx || 0) * 0.55}px, ${(a.dy || 0) * 0.55}px) scale(${k0})`, filter: "blur(2px)" }, { transform: "translate(0px, 0px) scale(1)", filter: "blur(0px)" }], { duration: ms, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" }),
        ]);
        Kit.Voice.speakers.patient = () => fig.el.querySelector(".fig-head") || fig.el;
      },
      /**
       * CLN-69 (2 Oct): the results card sits over the scene, never a bare stage: the wide shot stays, at rest, with
       * a still copy of the (happy) patient; the figure itself goes home (the round may destroy it). The next stage's
       * clearStage() takes the room away.
       */
      keep() {
        [box, wide].forEach((el) => el.getAnimations && el.getAnimations().forEach((an) => an.cancel()));
        box.style.transform = box.style.filter = "";
        wide.classList.remove("gone");
        wide.classList.add("on", "kept");
        healed();
        if (fig.el.parentNode !== layer) {
          layer.appendChild(fig.el);
          fig.pose("sit");
          fig.react("happy", 0);
          if (z.top) layer.style.top = z.top;
        }
        const still = fig.el.cloneNode(true);
        still.classList.add("cl-still");
        still.setAttribute("aria-hidden", "true");
        layer.appendChild(still);
        if (home) home.appendChild(fig.el);
        else fig.el.remove();
        restore();
        layer.insertBefore(still, layer.firstChild);
        z.kept = true;
      },
      destroy() {
        if (home && fig.el.parentNode === layer) home.appendChild(fig.el);
        restore();
        wide.remove();
      },
    };
    return z;
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
    const ailment = Object.assign({ id: ailmentId, part: def.part, side, game: def.id }, (data && data.ailments && data.ailments[ailmentId]) || {}, (HOST.clinic.ailments && HOST.clinic.ailments[ailmentId]) || {}, { side }, opts.part ? { part: String(opts.part).replace(/^body-/, "") } : {});
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
    // D13 (1 Oct, decision 27): the first time a child plays a heal game is the guided round: the ghost finger shows
    // each new move and the child copies it, and nothing is scored (its rows are taught); counts are judged from the
    // next round. Once per child per game (the save's "ui" namespace, through UIStore).
    const US = global.UIStore;
    const taught = !!def.cues && level === 1 && opts.onboard !== false && !!US && !US.get("clinic-taught", def.id);
    // D1, D2: the zoom from the patient on the bed into the close-up (and back out at the end)
    // group C (2 Oct): a game that plays in the room itself (data camera.wide "room": the fever room) has no zoom
    const roomGame = !!(data && data.camera && data.camera.wide === "room");
    const staging = opts.staging === false || !def.cues || roomGame ? null : HOST.stage(stage, fig, { part: ailment.part || def.part, side, camera: (data && data.camera) || null, level });

    const log = [];
    const timers = new Set();
    const listeners = [];
    const t0 = Date.now();
    let hintsAtStart = screen.hints;
    let finished = false;
    let ended = false; // the game called done() (not a destroy from outside)
    let resolveResult;
    const result = new Promise((r) => (resolveResult = r));

    // the sidebar's dishes: the tray the child brought, in order
    const tray = new Kit.Tray(screen.trayEl, trayItems.length, {});
    trayItems.forEach((it, i) => tray.fill(i, it));
    screen.trayWrap.classList.remove("hidden");
    const trayTaps = [];
    tray.onTap = (i, item) => trayTaps.forEach((fn) => fn(i, item, tray.slots[i].el));

    // which host pieces the game uses: a game that draws its own tray or its own patient gets the
    // host's hidden (additive; docs/architecture/clinic-heal-api.md "Host additions")
    const used = { patient: false, trayUI: false };
    const track = (obj, key) => {
      const o = {};
      Object.keys(obj).forEach((k) => {
        const v = obj[k];
        if (typeof v === "function")
          o[k] = (...a) => {
            used[key] = true;
            return v(...a);
          };
        else o[k] = v;
      });
      return o;
    };
    const card = screen.card;
    // the doctor's card (his face = replay); from level 3 it's closed: the counts are heard, not read (13c, Cook's
    // rule Q7: written and heard at L1, written at L2, heard only from L3); a tap peeks and counts a hint
    const face = h("div", "cl-face doctor");
    const fimg = h("img", "", face);
    fimg.alt = "";
    fimg.src = Kit.DOCTOR_FACE;
    card.closed = level >= 3 ? { onPeek: () => (screen.peek ? screen.peek("heal-card") : screen.bulb.use()) } : null;
    card.fold = {};
    // D9 (1 Oct, CLN-44): the card's headline is the doctor's goal (a line to record); the card folds to it with
    // the gold check when every step is done. The goal moved here from the doctor's box (one place for a line).
    // the 1 Oct play rules are the nine v2 games' (they declare their cues); the parked ones (tummy, hic, hair) run as
    // they were: the goal in the doctor's box, the whole card at once, no zoom, the ✓ always there
    const v2 = !!def.cues;
    const goal = def.why && def.why.goal ? HOST.line(def.why.goal, data) : "";
    card.setTitle(v2 ? goal : "", face);
    if (screen.setGuide) screen.setGuide(v2 ? null : goal || null);
    card.ordered(true); // a heal game's steps are one ordered job on the shared card (13c, 13h)
    // D8 (1 Oct, SH-45): one instruction at a time: each step's row appears as it opens and the doctor says it then
    card.setProgressive(v2, (ids) => {
      if (!finished) card.speak(ids);
    });
    card.setRows([]);

    /* ---- the shared play rules for every heal game (1 Oct report § 8D-8G, decision 27) ----
     * D6 (SH-39): the running count sits on the tool in use: its Kutchi word at L1-2 (said at L1), dots from L3;
     *    no chip in the card's row, no tally in the corner.
     * D7 (SH-40): the ✓ is hidden until it can do something: it shows once the open step has a count going (or the
     *    game says so: ctx.ready), and hides again when the next step opens.
     */
    const done = { btn: null, on: !v2 };
    const showDone = (on) => {
      if (!v2) return;
      done.on = !!on;
      if (done.btn) done.btn.classList.toggle("hidden", !done.on);
    };
    const clearCounts = () => stage.querySelectorAll(".hs-count").forEach((n) => n.remove());
    const countOn = (itemId, n, at) => {
      const tool = at || stage.querySelector(`.hs-tool[data-tool="${String(itemId).replace(/"/g, "")}"]`) || stage.querySelector(".hs-tool.sel");
      if (!tool) return;
      let b;
      if (tool.ownerSVGElement || !tool.appendChild || tool.tagName === "svg") {
        // group C (2 Oct): a count on a thing drawn in a close-up's svg (the boing's syringe): a badge over its corner
        const holder = stage.querySelector(".hs-root") || stage;
        b = holder.querySelector(":scope > .hs-count.at") || h("span", "hs-count at", holder);
        const r = tool.getBoundingClientRect();
        const hr = holder.getBoundingClientRect();
        b.style.left = `${Math.round(r.left - hr.left)}px`;
        b.style.top = `${Math.round(r.top - hr.top)}px`;
        b.setAttribute("aria-hidden", "true");
      } else {
        stage.querySelectorAll(".hs-count.at").forEach((x) => x.remove());
        b = tool.querySelector(".hs-count");
        if (!b) {
          b = h("span", "hs-count", tool);
          b.setAttribute("aria-hidden", "true");
        }
      }
      b.classList.toggle("dots", level >= 3);
      b.textContent = level >= 3 ? "•".repeat(Math.min(n, 9)) : Kit.num(n);
      b.classList.remove("bump");
      void b.offsetWidth;
      b.classList.add("bump");
    };

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
      patient: track(HOST.patientApi(fig, stage, kind), "patient"),
      tray: trayItems,
      card: {
        setRows: (rows) => card.setRows(rows),
        tick: (rowId) => {
          if (rowId === card.st.now) showDone(false);
          card.tick(rowId);
        },
        pulse: (rowId, on) => card.pulse(rowId, on),
        // additions
        now: (rowId) => {
          if (rowId !== card.st.now) {
            clearCounts();
            showDone(false);
          }
          card.now(rowId);
        },
        untick: (rowId) => card.untick(rowId),
        addRow: (row) => card.addRow(row),
        speak: (ids) => card.speak(ids),
        ordered: (on) => card.ordered(on),
        miss: (rowId) => card.miss(rowId),
        el: card.el,
      },
      say(lineId, o = {}) {
        const l = HOST.line(lineId, data);
        return Kit.Voice.say(l, { who: o.who || l.who || "doctor", noBubble: !!o.noBubble, soft: !!o.soft });
      },
      // clinic fixes: in a full run (the pipeline) the diagnosis already told the why (13i); first-time help on/off
      inRun: !!opts.inRun,
      onboardOn: opts.onboard !== false,
      taught, // D13: the guided first round (nothing scored)
      interject(k) {
        const l = INTERJECT[k] ? LANG().show(LANG().phrase(INTERJECT[k])) : HOST.line(k, data);
        return Kit.Voice.say(l, { who: "doctor" });
      },
      /** group C (2 Oct): a running count that sits on something other than a shelf tool (an element in the close-up). */
      countAt(el, n, o = {}) {
        return ctx.tally(null, n, Object.assign({}, o, { at: el }));
      },
      tally(itemId, n, o = {}) {
        // D6: the count on the tool in use (never the target); level 1 also says the number (E12)
        if (n > 0) countOn(itemId, n, o.at || null);
        else clearCounts();
        // D7: from level 2 the ✓ closes a counted step once it has begun; at level 1 the step closes itself (D5).
        // SH-40 (2 Oct): a step the child's next action closes (the next tool: o.next) never shows the ✓
        if (n > 0 && level >= 2 && !o.next) showDone(true);
        if (level <= 1 && n > 0 && n <= 5) Kit.Voice.now(LANG().num(n));
      },
      /** D7: the game says whether its ✓ can do something now (a step with no count: the plasters laid). */
      ready(on) {
        if (v2) showDone(on);
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
        ended = true;
        // CLN-70 (E17, INT-03): every game clears its own buttons and counts when it ends: the ✓ never lingers into
        // the zoom-out or the results card
        screen.clearActions();
        done.btn = null;
        clearCounts();
        // D14 (1 Oct, SH-44): which step went wrong, for the end review: each judged row's line, right or not, and
        // what was done (the game's own detail, e.g. "2 of 3")
        const rowFor = (id) => {
          const base = String(id).replace(/-[a-z]+$/, "");
          return card.rows.find((x) => x.id === id) || card.rows.find((x) => x.id === base) || card.rows.find((x) => x.id.indexOf(base) === 0) || null;
        };
        const seen = new Set();
        const steps = [];
        log.forEach((e) => {
          if ((e.type !== "right" && e.type !== "wrong") || !e.rowId || seen.has(e.rowId)) return;
          seen.add(e.rowId);
          const row = rowFor(e.rowId);
          if (!row) return;
          steps.push({ id: e.rowId, label: { kutchi: row.kutchi || null, english: row.english || "", plan: row.plan }, ok: e.type === "right", done: e.detail != null && typeof e.detail !== "object" ? String(e.detail).replace(/^(\d+) of \d+$/, "$1") : null });
        });
        if (taught && US) US.set("clinic-taught", def.id, true);
        if (taught) r = Object.assign({}, r, { right: 0, total: 0, taught: true });
        const out = Object.assign({ right: 0, total: 0, words: [] }, r, {
          hints: (r.hints || 0) + (screen.hints - hintsAtStart),
          steps,
          log: log.slice(),
          timeMs: Date.now() - t0,
          game: def.id,
          level,
          ailment: ailment.id,
          tray: trayItems,
        });
        if (opts.onDone) opts.onDone(out);
        // D1: the zoom back out, and the patient's "thank you, I feel better" (a line to record), then the result
        const thanks = HOST.line("thanks-better", data);
        const outro = staging ? staging.out().then(() => Kit.Voice.say(thanks, { who: "patient" })) : Promise.resolve();
        Promise.race([outro, new Promise((r) => setTimeout(r, Kit.fast ? 600 : 4000))]).then(() => resolveResult(out));
      },
      // --- additions ---
      item: (id) => Kit.itemInfo(id),
      icon: (item, parent, cls) => Kit.icon(item, parent, cls),
      text: (w, parent) => Kit.text(w, parent),
      word: (id) => HOST.word(id, data),
      line: (id) => HOST.line(id, data),
      trayUI: track({
        el: screen.trayEl,
        dishes: () => tray.slots.map((s) => s.el),
        onTap: (fn) => trayTaps.push(fn),
        light: (i) => tray.light(i),
        select: (i) => tray.select(i),
        used: (i, on) => tray.used(i, on),
        pulse: (i, on) => tray.pulse(i, on),
        hide: () => screen.trayWrap.classList.add("hidden"),
        show: () => screen.trayWrap.classList.remove("hidden"),
      }, "trayUI"),
      button(label, onPress, cls) {
        const b = screen.go(label, onPress, cls);
        // D7: the ✓ stays hidden until it's usable (rule F22: never greyed out, hidden)
        if (label === "✓" || /\bdone\b/.test(cls || "")) {
          done.btn = b;
          b.classList.toggle("hidden", !done.on);
        }
        return b;
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
    // start() may run for a while (the doctor reads the card): mount returns at once. The zoom in plays over the
    // game's opening (the close-up is live underneath: input never waits for it, E5)
    if (staging) staging.in().catch(() => {});
    const started = Promise.resolve()
      .then(() => controller.start && controller.start())
      .catch((e) => console.error(`Healing game "${def.id}" failed to start`, e));
    if (opts.autoHide !== false) {
      setTimeout(() => {
        if (finished) return;
        if (!used.trayUI) screen.trayWrap.classList.add("hidden");
        if (!used.patient) patientLayer.classList.add("hidden");
      }, Kit.fast ? 150 : 900);
    }
    const run = {
      ctx,
      staging,
      used,
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
        // CLN-69: a round that ended keeps the room under the results card (the wide shot at rest); a game with no
        // zoom (the fever room, the parked games) gets the same still wide shot, so the card never sits on bare cream
        let kept = false;
        if (ended && opts.backdrop !== false) {
          try {
            const z = staging || HOST.stage(stage, fig, { part: ailment.part || def.part, side, camera: (data && data.camera) || null, level });
            if (z && z.keep) {
              if (!staging) fig.react("happy", 0);
              z.keep();
              kept = true;
            }
          } catch (e) {
            console.error(e);
          }
        }
        if (staging && !kept) staging.destroy();
        if (!opts.patient) fig.destroy();
        Kit.Voice.clear();
        // the card is the screen's: the next stage gets it whole again (D8 is the heal games' rule)
        card.setProgressive(false);
        card.closed = null;
      },
    };
    HOST.current = run;
    return run;
  };
})(typeof self !== "undefined" ? self : this);
