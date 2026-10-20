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
    // CLN-88: every file the clinic needs to start is asked for at once (it was a chain of a dozen, one after another);
    // the steps below then find them in the kit's cache
    ["data/patients/grey-adult.json", "data/clinic.json", "data/clinic/pipeline.json", "data/clinic/rough-art.json", "data/clinic/heal-art.json", "data/clinic/scenes-v2.json"].forEach((p) => Kit.loadJSON(p));
    if (!HOST.lang && global.ClinicLang && !global.ClinicLang.engine) global.ClinicLang.ready((p) => Kit.loadJSON(p), Kit.root || "");
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
  // R6 (decision 61): "arre" is not a family word: it is a soft sound now, once a round, at level 1 only
  const INTERJECT = { shabash: "cl-shabash", achija: "cl-achija", hedo: "cl-hedo" };
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
    // CLN-87 (Z1, 6 Oct): the zoom in and out take about 1.5 s
    const ms = Kit.fast ? 120 : o.ms || 1500;
    const none = { wide: null, in: () => Promise.resolve(), out: () => Promise.resolve(), destroy() {} };
    if (!room || !cfg || !fig || !Clinic.Stages || !Clinic.Stages.fitScene) return none;
    const wide = h("div", "cl-zoom", stage);
    wide.dataset.camera = (o.camera && o.camera.wide) || "front";
    const cap = h("div", "cl-scene-cap", wide);
    const box = h("div", "cl-scene cl-zoom-box", wide);
    const url = `url("${Kit.url(room.src)}")`;
    box.style.backgroundImage = url;
    cap.style.backgroundImage = url;
    if (Clinic.Stages.certificate) Clinic.Stages.certificate(box, cfg.certificate); // CLN-116: the room's certificate frame
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
      let tc = null;
      if (m && fig.art) {
        const br = box.getBoundingClientRect();
        const tx = m.a * t[0] + m.c * t[1] + m.e - br.left;
        const ty = m.b * t[0] + m.d * t[1] + m.f - br.top;
        if (o.camera.size && q.r) k = Math.max(1.6, Math.min(9, (o.camera.size * m.a) / q.r));
        dx = tx - q.x;
        dy = ty - q.y;
        // CLN-163 (clinic decision 7): where the part is, in client px, on the room (q) and on the close-up (t)
        tc = { q: { x: br.left + q.x, y: br.top + q.y }, t: { x: br.left + tx, y: br.top + ty } };
      }
      return { ox: (100 * q.x) / bw, oy: (100 * q.y) / bh, k, dx, dy, tc };
    };
    /*
     * CLN-163 (Zafar, 18 Oct; clinic decision 7): ONE camera. The room and the close-up move together in one tween, as
     * if the close-up were the room's own high-resolution picture of the part: at every frame the close-up is scaled
     * and placed so its part (camera.target) lies exactly over the part in the room (the match cut), and the room hands
     * over to it part-way, while both show the same part at the same size, so nothing jumps. The zoom runs in log space
     * (an even push-in), sampled into keyframes so the browser plays it (tests can pause it). Out is the same, reversed.
     */
    const closeEl = () => stage.querySelector(".hs-root .hs-svg");
    /*
     * s08 wave 7B (CLN-163, Zafar 18 Oct: "multiple artwork steps"): the zoom's middle step. A game's data may name a
     * painted close picture of the patient (camera.mid: GZ1, her face saying "aah", for the teeth): it lies in the room
     * itself, over the drawn girl, placed and sized so its mouth and eyes sit on her mouth and eyes (the room's own
     * hotspots), its edge feathered into the room, and dissolves in part-way through the push-in (mid.fade: [from, to]
     * as shares of the move); the room, with it, hands over to the close-up at the end as before. So the drawn girl
     * dissolves into the painted face, and the painted face into the mouth's close-up: no separate photo pops in.
     */
    const MID = o.camera && o.camera.mid && art && (!o.camera.mid.kinds || o.camera.mid.kinds.includes(fig.kind)) ? o.camera.mid : null;
    let midEl = null;
    let midG = 1; // how much more the painted face grows than the room after it is in, to meet the close-up's lips
    const placeMid = (k) => {
      if (!MID) return;
      const qm = fig.hotspot(part, o.side || "left", box);
      const qe = fig.hotspot("eyes", null, box);
      if (!qm || !qe || !(qm.y - qe.y > 2)) return;
      if (!midEl) {
        midEl = h("img", "cl-zoom-mid", box);
        midEl.alt = "";
        midEl.setAttribute("aria-hidden", "true");
        midEl.src = Kit.url(MID.src);
        const [mx, my, rx, ry] = MID.mask || [0.5, 0.45, 0.2, 0.36];
        const m = `radial-gradient(ellipse ${rx * 100}% ${ry * 100}% at ${mx * 100}% ${my * 100}%, #000 68%, transparent 100%)`;
        Object.assign(midEl.style, { position: "absolute", zIndex: 4, opacity: 0, pointerEvents: "none", maxWidth: "none", webkitMaskImage: m, maskImage: m });
      }
      const H = (qm.y - qe.y) / (MID.mouth[1] - MID.eyes[1]);
      const W = (H * MID.size[0]) / MID.size[1];
      Object.assign(midEl.style, { width: `${W.toFixed(1)}px`, height: `${H.toFixed(1)}px`, left: `${(qm.x - MID.mouth[0] * W).toFixed(1)}px`, top: `${(qm.y - MID.mouth[1] * H).toFixed(1)}px`, transformOrigin: `${(MID.mouth[0] * W).toFixed(1)}px ${(MID.mouth[1] * H).toFixed(1)}px` });
      // it comes in matched to the drawn girl's face (above); the close-up's lips are drawn bigger than hers, so from
      // then on it grows a little faster than the room, about its mouth, until its lips are the close-up's at the hand-over
      // (mid.lips: its lips' width, a share of its own; mid.lip: the close-up's lips' width, svg units)
      const el = closeEl();
      const m = el && el.getScreenCTM && el.getScreenCTM();
      midG = 1;
      if (m && MID.lip && MID.lips && k > 1) midG = Math.max(0.5, Math.min(6, (MID.lip * m.a) / MID.lips / (W * k)));
    };
    // (s08 w6I, CLN-163: the judge saw the room, the whole girl and the lips in three big steps): a gentle sine ease, so
    // the middle of the move, where a cubic ease sped through most of the zoom, keeps the in-between sizes on screen
    const ease = (u) => (1 - Math.cos(Math.PI * u)) / 2;
    const frames = (a, dir) => {
      const N = 24;
      const room = [];
      const shot = [];
      const fade = [];
      const mid = [];
      const bg = [];
      const el = closeEl();
      const r = el && a.tc ? el.getBoundingClientRect() : null;
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const p = ease(dir > 0 ? u : 1 - u); // p: 0 = the wide shot, 1 = the close-up
        const s = Math.pow(a.k, p);
        const f = a.k > 1.001 ? (s - 1) / (a.k - 1) : p;
        // s08 w6N (CLN-163; the judge: "the zoom still blurs the cartoon girl heavily"): no blur on the room (a blur on
        // the scaled room grew with the scale, so it read as a smear); the room is only scaled
        room.push({ offset: u, transform: `translate(${(a.dx * f).toFixed(2)}px, ${(a.dy * f).toFixed(2)}px) scale(${s.toFixed(4)})` });
        // the room stays the picture until the close-up is all but its full size, and hands over in the last tenth of the
        // move, both showing the part in the same place at the same size (s08 w6N, CLN-163; the judge: "a curved-edged
        // overlay": an earlier hand-over showed the close-up small, its own cut-out edge, the jaw or the cheeks, on screen)
        fade.push({ offset: u, opacity: Math.max(0, Math.min(1, (1 - p) / 0.1)).toFixed(3) });
        // s08 wave 7B (CLN-163): the middle step dissolves in over mid.fade (a gentle ease), over the drawn girl
        if (MID) {
          const [f0, f1] = MID.fade || [0.3, 0.55];
          const g = p <= f1 ? 1 : Math.pow(midG, (p - f1) / Math.max(0.01, 1 - f1));
          mid.push({ offset: u, opacity: ease(Math.max(0, Math.min(1, (p - f0) / Math.max(0.01, f1 - f0)))).toFixed(3), transform: `scale(${g.toFixed(4)})` });
        }
        // s08 w6N (CLN-163, CLN-106; the judge: white corners, and the arm's first frame on blank white): the close-up's
        // own blurred room stays under it all through the move (its svg lets it run past its box while it moves, so
        // there is never a pale box round the shrunken picture, and never a bare page before the room is up)
        void bg;
        if (r) {
          const sg = s / a.k;
          const tx = (a.tc.q.x - a.tc.t.x) * (1 - f);
          const ty = (a.tc.q.y - a.tc.t.y) * (1 - f);
          shot.push({ offset: u, transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sg.toFixed(4)})` });
        }
      }
      const bgEls = []; // s08 w6N: the blurred room is no longer faded (above): it keeps its own drawn opacity
      return { room, shot, fade, mid, bg, bgEls, el: r ? el : null, origin: r ? `${(a.tc.t.x - r.left).toFixed(1)}px ${(a.tc.t.y - r.top).toFixed(1)}px` : null };
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
        // CLN-87 (S05-D3): the push-in the child sees lasts about 1.5 s: the room is handed over at 60 % of the move
        // (CLN-77), so the move itself runs 1.5 s / 0.6
        const inMs = Kit.fast ? ms : Math.round(ms / 0.6);
        // CLN-163: one camera over the room and the close-up (frames(), above); the room is gone by 75 % of the zoom
        // (CLN-77: the late frames are the close-up itself, never a smear of a blurred, hugely scaled room)
        placeMid(a.k);
        const F = frames(a, 1);
        z.moving = true;
        const opts = { duration: inMs, easing: "linear", fill: "forwards" };
        const zoom = play(box, F.room, opts);
        if (midEl) play(midEl, F.mid, opts);
        const fade = play(wide, F.fade, opts);
        let shot = Promise.resolve();
        if (F.el) {
          F.el.style.transformOrigin = F.origin;
          // s08 w6N (CLN-163; the judge: white corners round the eye close-up): while the close-up is scaled down its
          // svg lets its blurred room run past its own box, so the screen round it is never the bare page
          F.el.style.overflow = "visible";
          shot = Promise.all([play(F.el, F.shot, opts)].concat(F.bgEls.map((b) => play(b, F.bg, opts))));
        }
        await Promise.all([zoom, fade, shot]);
        if (F.el) F.el.style.overflow = "";
        z.moving = false;
        // the close-up rests as it is drawn (its own transform gone: no rounding left over from the last frame)
        if (F.el && !z.leaving) [F.el].concat(F.bgEls).forEach((x) => x.getAnimations && x.getAnimations().forEach((an) => an.cancel()));
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
        // CLN-87 (Z2, 6 Oct; newer than CLN-77's part-way start): the pull-out starts from the full zoom on the healed
        // part (where the push-in ended), lightly softened, and the room fades in over the close-up as it pulls back
        box.style.transformOrigin = `${a.ox}% ${a.oy}%`;
        wide.classList.remove("gone");
        wide.classList.add("on");
        // CLN-163: the same one camera, backwards: the close-up shrinks onto the part in the room as the room comes
        // back over it, both at the same place and size (frames(), above)
        placeMid(a.k);
        const F = frames(a, -1);
        const opts = { duration: ms, easing: "linear", fill: "forwards" };
        if (F.el) {
          F.el.style.transformOrigin = F.origin;
          F.el.style.overflow = "visible"; // its blurred room past its box as it shrinks (CLN-163)
        }
        await Promise.all([play(wide, F.fade, opts), play(box, F.room, opts), midEl ? play(midEl, F.mid, opts) : null, F.el ? play(F.el, F.shot, opts) : null].concat(F.bgEls.map((b) => play(b, F.bg, opts))));
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
        if (midEl) {
          // (the kept wide shot behind the end card is the room and the drawn girl, never the middle step)
          if (midEl.getAnimations) midEl.getAnimations().forEach((an) => an.cancel());
          midEl.style.opacity = 0;
        }
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
   * CLN-163 (CLN-185, Zafar 18 Oct: "the eye game feel[s] a little bit too zoomed in ... a bit intimidating"): a close-up
   * a step less zoomed in, from the game's data alone (camera.view: {k, bottom, not}). The close-up's own fit (the
   * scene's viewBox, js/clinic/heal/scene.js) is widened by 1 / k about its middle, kept above `bottom` (the picture's
   * lower edge, svg units: no bare edge shows under it), and rewritten whenever the scene refits (a resize). While the
   * card's step matches `not` (a regex: the eye test's chart, which has its own framing) the view is the scene's own;
   * the change between them is a short camera move, never a jump.
   */
  HOST.view = function (stage, cfg, ctx) {
    const svg = stage.querySelector(".hs-root .hs-svg");
    if (!svg || !cfg || !(cfg.k > 0) || cfg.k >= 1 || !global.MutationObserver) return null;
    const not = cfg.not ? new RegExp(cfg.not) : null;
    let base = null; // the scene's own fit, as it last wrote it
    let mine = null; // what was written here
    let on = true;
    let anim = null;
    const parse = (v) => String(v || "").trim().split(/[\s,]+/).map(Number);
    const wide = (b) => {
      const w = b[2] / cfg.k;
      const hh = b[3] / cfg.k;
      let cy = b[1] + b[3] / 2;
      if (cfg.bottom != null) cy = Math.min(cy, cfg.bottom - hh / 2);
      return [b[0] + b[2] / 2 - w / 2, cy - hh / 2, w, hh];
    };
    const write = (b) => {
      mine = b.map((v) => (Math.round(v * 10) / 10).toFixed(1)).join(" ");
      svg.setAttribute("viewBox", mine);
    };
    const to = (target, ms) => {
      if (anim) cancelAnimationFrame(anim);
      const from = parse(svg.getAttribute("viewBox"));
      if (Kit.fast || !global.requestAnimationFrame || from.length !== 4) return write(target);
      const t0 = Date.now();
      const step = () => {
        const u = Math.min(1, (Date.now() - t0) / ms);
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        write(from.map((v, i) => v + (target[i] - v) * e));
        anim = u < 1 && svg.isConnected ? requestAnimationFrame(step) : null;
      };
      step();
    };
    const mo = new MutationObserver(() => {
      const v = svg.getAttribute("viewBox");
      if (v === mine || anim) return;
      base = parse(v); // the scene refitted (a resize): keep its fit, widened
      if (on) write(wide(base));
    });
    base = parse(svg.getAttribute("viewBox"));
    if (base.length !== 4) return null;
    write(wide(base));
    mo.observe(svg, { attributes: true, attributeFilter: ["viewBox"] });
    return {
      step(rowId) {
        const want = !(not && rowId && not.test(String(rowId)));
        if (want === on) return;
        on = want;
        to(on ? wide(base) : base, 450);
      },
      destroy() {
        mo.disconnect();
        if (anim) cancelAnimationFrame(anim);
      },
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
    // a game's own levels (L4: the harder variety, Zafar 13 Oct), never past them
    const level = Math.max(1, Math.min(Math.max(...(def.levels || [3])), opts.level || 1));
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

    let viewer = null; // CLN-163 (CLN-185): the close-up a step less zoomed in (data camera.view; HOST.view)
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
    // CLN-140 (Zafar, 14 Oct, R4 in the clinic): the doctor has one card at the top of the sidebar, as in every stage:
    // his face once (the card's, screen.js), his line for the step now as its top strip (T29), then the goal headline
    // and the steps. The parked games keep their goal in the strip (no headline).
    // s08 w6N (CLN-106): a game whose goal is said once a step is done (def.why.goalAfter: the boing's "Time for the jab"
    // after the wipe) opens with no headline; it calls ctx.card.goal() then, and the headline comes up as he says it
    const lateGoal = !!(v2 && def.why && def.why.goalAfter);
    card.setTitle(v2 && !lateGoal ? goal : "", null); // null: the screen's card wears his face (Kit.Card's default face)
    if (screen.setGuide) screen.setGuide(v2 ? null : goal || null);
    card.ordered(true); // a heal game's steps are one ordered job on the shared card (13c, 13h)
    // D8 (1 Oct, SH-45): one instruction at a time: each step's row appears as it opens and the doctor says it then
    // a row the "what's next" cue (decision 52, below) has just said is not said again when its step opens (SH-45)
    const saidNext = new Set();
    card.setProgressive(v2, (ids) => {
      const fresh = ids.filter((id) => !saidNext.delete(id));
      if (!finished && fresh.length) card.speak(fresh);
    });
    card.setRows([]);
    // T29 (CLN-140): the doctor's line for the step now is his card's top strip (screen.setGuide)
    // decision 41 (S02-F, C open item): from level 3 a count is heard, never read: the strip shows the step's line
    // without its number word (the doctor still says it whole)
    const NUM_EN = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b\s*/gi;
    const numWords = (() => {
      const CL = global.ClinicLang;
      const out = {};
      if (!CL || !CL.numId || !CL.num) return out;
      for (let n = 1; n <= 12; n++) {
        try {
          const id = CL.numId(n);
          const w = id && CL.num(n);
          if (w && w.kutchi) out[id] = w.kutchi;
        } catch (e) {
          /* a number the engine has no word for */
        }
      }
      return out;
    })();
    // SH-99, CLN-187 (s08-w6c; Zafar, 18 Oct: "all the frequencies has to be written down. And audible as well"):
    // every number said is written (contract-30), the closed card's strip too, so the strip keeps its count at every
    // level now; stripRow.count (decision 41's old rule: from level 3 the strip without its number) is kept, unused
    const stripRow = (row) => row;
    stripRow.count = (row) => {
      if (!row || level < 3) return row;
      const nums = (row.ids || []).filter((id) => numWords[id]);
      if (!nums.length) return row;
      const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let k = row.kutchi;
      // a number agrees with its noun ("hakri chamchi": hakro's -o, -i, -a, -e forms), so its inflected form goes too
      const form = (w) => (/o$/i.test(w) ? `${esc(w.slice(0, -1))}[oiae]` : esc(w));
      if (k) nums.forEach((id) => (k = k.replace(new RegExp(`(^|\\s)${form(numWords[id])}(?=[\\s,.!?]|$)\\s*`, "i"), "$1")));
      if (k) k = k.trim().replace(/^(\[?)(\S)/, (a, b, c) => b + c.toUpperCase());
      return Object.assign({}, row, { kutchi: k, english: String(row.english || "").replace(NUM_EN, "").trim() });
    };

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

    // decision 52: the "what's next" reveal (ctx.tally): the next row and its tool, a beat after the count is reached
    let nextT = null;
    let nextOn = null;
    let readyT = null;
    const nextOff = () => {
      clearTimeout(nextT);
      nextT = null;
      if (!nextOn) return;
      stage.querySelectorAll(".hs-tool.next-up").forEach((b) => b.classList.remove("pulse", "next-up"));
      card.el.querySelectorAll(".cl-row.next-up").forEach((r) => r.classList.remove("next-up"));
      nextOn = null;
      card.hush(false);
    };
    const nextUp = (tool) => {
      if (!tool) return nextOff();
      if (nextT || nextOn) return;
      const at = card.st.now;
      nextT = setTimeout(() => {
        nextT = null;
        if (finished || card.st.now !== at) return;
        const id = card.nextStepId();
        const on = (nextOn = { tool, id });
        // CLN-144, CLN-145 (decision 95: one thing lit at a time, contract-8): the card's band steps back, the next row
        // is said (its read-along light), and only then the tool glows: never the band, the row and the tool at once
        card.hush(true);
        const rowEl = id && card.row(id) && card.row(id).el;
        if (rowEl) rowEl.classList.add("next-up");
        if (id && screen.setGuide) screen.setGuide(stripRow(card.row(id)));
        // the next tool (an exact id, or every tool its id starts with: all the plasters, never just the right colour)
        const t = String(tool);
        const glow = () => {
          if (nextOn !== on || finished) return;
          [...stage.querySelectorAll(".hs-tool")].filter((b) => b.dataset.tool === t || (t.endsWith("-") && String(b.dataset.tool || "").startsWith(t))).forEach((b) => b.classList.add("pulse", "next-up"));
        };
        // the doctor (off screen: his box) says the next step's line, once
        if (id) {
          saidNext.add(id);
          Promise.resolve(card.speak([id])).then(glow, glow);
        } else glow();
      }, Kit.fast ? 300 : 2000);
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
          // checks-to-build 6 (contract-18): the game closed this step (its row ticks now)
          if (global.Lifecycle && global.Lifecycle.note && card.row(rowId) && !card.isTicked(rowId)) global.Lifecycle.note("step-close", { step: rowId, by: "heal" });
          card.tick(rowId);
        },
        pulse: (rowId, on) => card.pulse(rowId, on),
        hush: (on) => card.hush(on), // CLN-144: a game's own tool nudge: the card's band steps back while it glows
        // additions
        // o.strip: the line the strip shows for this step when it is not the row's own (the eye's drops at level 3: both
        // eyes' counts in one line, CLN-187)
        now: (rowId, o = {}) => {
          if (rowId !== card.st.now) {
            clearCounts();
            showDone(false);
            nextOff();
          }
          card.now(rowId);
          if (viewer) viewer.step(rowId);
          // T29: the guide's line is the step now (it clears when no step is open)
          if (v2 && screen.setGuide) screen.setGuide(rowId ? stripRow(o.strip || card.row(rowId)) : null);
        },
        untick: (rowId) => card.untick(rowId),
        addRow: (row) => card.addRow(row),
        // CLN-106 (def.why.goalAfter): the late goal: its headline on the card, and the doctor says it (once)
        goal: () => {
          if (!lateGoal || card.titleText === goal || !goal) return Promise.resolve();
          card.setTitle(goal, null);
          return ctx.say(goal, { who: "doctor" });
        },
        speak: (ids) => {
          // the whole card is read only in the pop-up (SH-64): a game's own read of it (its opening, the scene's "why"
          // beat) stays quiet; one step's rows (ids) are still said as they open, and the face replays the card
          if (popped && !ids) return Promise.resolve();
          return card.speak(ids);
        },
        ordered: (on) => card.ordered(on),
        miss: (rowId) => card.miss(rowId),
        el: card.el,
      },
      say(lineId, o = {}) {
        // S03-A (CLN-84, SH-64): the pop-up has just read the card: the game's opening repeat of a row stays quiet
        if (quietStart() && lineId && typeof lineId === "object" && lineId.id && popRead.has(lineId.id)) {
          popRead.delete(lineId.id);
          return Promise.resolve();
        }
        const l = HOST.line(lineId, data);
        return Kit.Voice.say(l, { who: o.who || l.who || "doctor", noBubble: !!o.noBubble, soft: !!o.soft });
      },
      // clinic fixes: in a full run (the pipeline) the diagnosis already told the why (13i); first-time help on/off
      inRun: !!opts.inRun,
      onboardOn: opts.onboard !== false,
      taught, // D13: the guided first round (nothing scored)
      zoomed: Promise.resolve(), // the push-in done (set as the game starts)
      interject(k) {
        if (k === "arre") {
          if (level <= 1 && !ctx.oopsed && global.Sfx && global.Sfx.play) global.Sfx.play("oops");
          ctx.oopsed = true;
          return Promise.resolve();
        }
        const l = INTERJECT[k] ? LANG().show(LANG().phrase(INTERJECT[k])) : HOST.line(k, data);
        return Kit.Voice.say(l, { who: "doctor" });
      },
      /** group C (2 Oct): a running count that sits on something other than a shelf tool (an element in the close-up). */
      countAt(el, n, o = {}) {
        return ctx.tally(null, n, Object.assign({}, o, { at: el }));
      },
      tally(itemId, n, o = {}) {
        // D6: the count on the tool in use (never the target); level 1 also says the number (E12). CLN-118 (D13): the
        // taught round has no counts, written or said: the child copies the ghost finger; counts start next round
        if (taught) return;
        if (n > 0) countOn(itemId, n, o.at || null);
        else clearCounts();
        // decision 52 (CLN-82, the stuck fix): from level 2, once the count is reached (o.of) on a step the next
        // action closes (o.next: the next tool's id), the next step's row lights and its tool glows after ~2 s
        nextUp(level >= 2 && o.next && o.of && n >= o.of ? o.next : null);
        // D7: from level 2 the ✓ closes a counted step once it has begun; at level 1 the step closes itself (D5).
        // SH-40 (2 Oct): a step the child's next action closes (the next tool: o.next) never shows the ✓
        // decision 79 (SH-40): a counted step that can't go past its count (o.capped: the knee's wrap stops at it) is an
        // obvious finish at the count: it moves on by itself (ctx.ready), no ✓; an uncapped count keeps its ✓ (the
        // child decides when it's enough: moving on at the target would give the answer away, C10)
        if (o.capped && o.of && n >= o.of && level >= 2) ctx.ready(true);
        else if (n > 0 && level >= 2 && !o.next) showDone(true);
        // (PAN-04: the number as you tap is said only when no line is being said: it never goes over the doctor)
        if (level <= 1 && n > 0 && n <= 5 && !Kit.Voice.busy) Kit.Voice.now(LANG().num(n));
      },
      /** D7: the game says whether its ✓ can do something now (a step with no count: the plasters laid). */
      ready(on) {
        // decision 52 (CLN-83), S04-B (SH-40, decision 75 (2)): where the outcome is obvious (the last plaster is on) it
        // moves on by itself after a beat and the ✓ never shows (it was shown for that beat); a step the child can
        // still change (on false again) cancels it. A counted step's ✓ (step() above) stays: there the child decides
        // when the count is enough, and moving on at the target would give the answer away (C10)
        if (v2) showDone(false);
        clearTimeout(readyT);
        if (v2 && on) readyT = setTimeout(() => !finished && done.btn && done.btn.isConnected && done.btn.click(), Kit.fast ? 200 : 1200);
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
        // CLN-109 (the voice stop): the game's lines still queued or playing stop here; only the thank-you follows
        Kit.Voice.clear();
        // CLN-70 (E17, INT-03): every game clears its own buttons and counts when it ends: the ✓ never lingers into
        // the zoom-out or the results card
        screen.clearActions();
        done.btn = null;
        clearCounts();
        nextOff();
        clearTimeout(readyT);
        // D14 (1 Oct, SH-44): which step went wrong, for the end review: each judged row's line, right or not, and
        // what was done (the game's own detail, e.g. "2 of 3")
        const rowFor = (id) => {
          const base = String(id).replace(/-[a-z]+$/, "");
          return card.rows.find((x) => x.id === id) || card.rows.find((x) => x.id === base) || card.rows.find((x) => x.id.indexOf(base) === 0) || null;
        };
        // decision 93 (SH-44, ui-design-system.md 6a): the steps page after the word review: the doctor's instruction
        // list in order, one entry per instruction (the card's rows), each its engine line ({kutchi, english}; a line still to record stays English, grey), what was asked,
        // what was done and whether it was right. Only a game with an instruction list (the v2 games) and two steps or more
        const judged = {};
        log.forEach((e) => {
          if ((e.type !== "right" && e.type !== "wrong") || !e.rowId) return;
          const row = rowFor(e.rowId);
          if (!row) return;
          const j = judged[row.id] || (judged[row.id] = { ok: true, done: null });
          if (e.type === "wrong") j.ok = false;
          // what was done, only as a count (a game's own detail in English never reaches the child: non-negotiable 5)
          const m = j.done == null && e.detail != null && typeof e.detail !== "object" && /^(\d+)( of \d+)?$/.exec(String(e.detail));
          if (m) j.done = Kit.num(+m[1]);
        });
        // a headed group (the drink under its name) is its recipe rows, each judged by the game (the name is no step)
        const headed = new Set(card.rows.filter((x) => x.head && x.seq && card.rows.some((y) => y.seq === x.seq && !y.head)).map((x) => x.seq));
        let steps = !v2 ? [] : card.rows
          .filter((x) => !(x.head && headed.has(x.seq)))
          .map((x) => {
            // each step stands on its own line here, so a sequence's "ne poi ..." starts with a capital, as the first does
            const cap = (t) => (t ? String(t).replace(/^(\[?)(\S)/, (a, b, c) => b + c.toUpperCase()) : t);
            const label = { kutchi: cap(x.kutchi) || null, english: cap(x.english) || "", plan: x.plan };
            const j = judged[x.id];
            return { id: x.id, label, asked: label, done: j ? j.done : null, ok: j ? j.ok : card.st.done.has(x.id) };
          });
        if (steps.length < 2) steps = [];
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
        // contract-4 (SH-68, CLN-86): on the room screen her bubble comes from her head on the art (its measured head
        // anchor), never from the close-up's corner face or the whole figure's box
        const atHead = () => {
          Kit.Voice.speakers.patient = () => (fig.art && fig.anchorEl ? fig.anchorEl("head") : fig.el.querySelector(".fig-head") || fig.el);
        };
        const outro = staging ? staging.out().then(() => (atHead(), Kit.Voice.say(thanks, { who: "patient" }))) : Promise.resolve();
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
      /** contract-21: the child's tap reached the game (a control the shared kit wires itself: the answer pills). */
      act() {
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("act", { during: !!(Kit.Voice && Kit.Voice.busy), stage: `heal/${def.id}` });
      },
      on(el, type, fn0, o) {
        // checks-to-build 20 (contract-21): a tap or press the host hands to the game is logged as it runs, with whether a
        // voice was speaking then (input never waits for the voice: D8, E5)
        const fn = /^(pointerdown|pointerup|click|mousedown|touchstart)$/.test(type)
          ? function (ev) {
              if (ev && ev.isTrusted) ctx.act();
              return fn0.apply(this, arguments);
            }
          : fn0;
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
    viewer = HOST.view(stage, data && data.camera && data.camera.view, ctx);
    // CLN-163: while the one camera moves (the push-in), the close-up moves under the finger: a test driver's next move
    // waits for it to land (the child's own taps stay live: E5)
    if (staging && controller.debug && typeof controller.debug.next === "function") {
      const next0 = controller.debug.next.bind(controller.debug);
      controller.debug.next = (...a) => (staging.moving ? { do: "wait", ms: 120 } : next0(...a));
    }
    // TEST HOOK (s04-hooks; read-only, CLN-82, CLN-104): debug.glowing() -> the tools glowing now (the next-up reveal, a
    // game's own pulse), each {tool, nextUp, box: {left, top, width, height} in client px}; [] when nothing glows
    if (controller.debug && typeof controller.debug === "object" && !("glowing" in controller.debug)) {
      try {
        Object.defineProperty(controller.debug, "glowing", {
          configurable: true,
          value: () =>
            [...stage.querySelectorAll(".hs-tool.pulse, .hs-tool.next-up")]
              .map((b) => ({ b, r: b.getBoundingClientRect() }))
              .filter((x) => x.r.width > 1 && x.r.height > 1)
              .map(({ b, r }) => ({ tool: b.dataset.tool || "", nextUp: b.classList.contains("next-up"), box: { left: r.left, top: r.top, width: r.width, height: r.height } })),
        });
      } catch (e) {
        /* a test hook only */
      }
    }
    // S03-A (decision 53, CLN-84 re-raised, SH-64): every heal game opens with the shared request pop-up, as Cook and
    // the pharmacy do: the doctor's card at full size over the room, read out row by row; a tap anywhere stops the
    // voice and folds it into the sidebar; then the game starts, quiet (its opening repeat of the card is skipped)
    // (a late goal, def.why.goalAfter: the game's first step is the pop-up's whole content; its rows come at mount)
    const popup = v2 && opts.popup !== false && !!global.Lifecycle && (card.rows.length > 0 || !!card.titleText || lateGoal);
    const popRead = new Set();
    let popped = false; // the pop-up has read the card
    let popAt = 0;
    // the game's opening repeat of a row the pop-up just read (within a few seconds of the fold) stays quiet
    const quietStart = () => popped && Date.now() - popAt < (Kit.fast ? 1500 : 5000);
    // the request pop-up's entrance animations (css/shared/order-card.css njgRqFade, njgRqIn) finished, or 800 ms at
    // most (a page with no animations, or reduced motion, goes on at once)
    const shownIn = (veil) => {
      if (!veil || !veil.getAnimations) return Promise.resolve();
      const card = veil.querySelector(".njg-rq-card");
      const ins = [...veil.getAnimations(), ...(card && card.getAnimations ? card.getAnimations() : [])].filter((a) => /^njgRq(Fade|In)$/.test(a.animationName || ""));
      if (!ins.length) return Promise.resolve();
      return Promise.race([Promise.all(ins.map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, 800))]);
    };
    const showPopup = () => {
      if (!popup) return Promise.resolve();
      Kit.Voice.clear(); // the stage change (CLN-109): nothing from before queues ahead of the request
      let big = null;
      // SH-45 (D8, S05-D): the pop-up reads the goal and the FIRST step only (what the card has opened); every later
      // step is said as it opens (Card.reveal), never the whole job up front
      const opened = card.progressive ? card.rows.slice(0, card.shown + 1) : card.rows;
      opened.forEach((r) => popRead.add(r.id));
      let veil = null;
      return global.Lifecycle.request({
        reason: `clinic:heal/${def.id}`,
        host: screen.main,
        target: () => card.el,
        fast: Kit.fast,
        wait: (ms) => Kit.wait(ms),
        build(box) {
          big = new Kit.Card(box, { who: "doctor", big: true });
          // from level 3 the sidebar card is closed: the pop-up is the shared closed big card (face, goal, a row of
          // dots), the steps heard, never written (CLN-114)
          if (card.closed) big.closed = { onPeek: null, look: null };
          big.isOrdered = true;
          big.titleText = card.titleText;
          big.faceEl = face.cloneNode(true);
          big.setRows(opened.map((r) => Object.assign({}, r, { el: null })));
          veil = box.closest ? box.closest(".njg-rq-veil") : null;
        },
        // the doctor reads the card once the child can see it: the pop-up's own fade-in (njgRqFade, njgRqIn) has
        // landed. At test speed the lead is 20 ms, and a late goal's pop-up (CLN-106: the first step's line alone)
        // was read and folded before it had faded in (contract-1: no pop-up seen, its line said outside it)
        read: () => shownIn(veil).then(() => (veil && (veil.classList.contains("going") || !veil.isConnected) ? null : big.speak())), // (a tap-through while it faded in: nothing said)
        onStop: () => Kit.Voice.clear(),
      }).then(() => {
        popped = true;
        popAt = Date.now();
      });
    };
    // start() may run for a while (the doctor reads the card): mount returns at once. The zoom in plays over the
    // game's opening (the close-up is live underneath: input never waits for it, E5)
    const started = showPopup()
      .then(() => {
        if (finished) return null;
        // CLN-133 (S05-D3): the first-time help's ghost finger waits for the close-up (ctx.zoomed): played during the
        // push-in, its first demo was over before the child could see it
        ctx.zoomed = staging ? staging.in().catch(() => {}) : Promise.resolve();
        return controller.start && controller.start();
      })
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
        if (popup && global.Lifecycle && global.Lifecycle.isOpen()) global.Lifecycle.close();
        timers.forEach((t) => clearTimeout(t));
        listeners.forEach(([el, type, fn, o]) => el.removeEventListener(type, fn, o));
        // CLN-69: a round that ended keeps the room under the results card (the wide shot at rest); a game with no
        // zoom (the fever room, the parked games) gets the same still wide shot, so the card never sits on bare cream.
        // CLN-178 (the judge's blank brown frame after the fever): that still room is laid before the game's own room
        // goes, so no frame shows the bare stage between the two
        let kept = false;
        const keepRoom = () => {
          if (kept || !ended || opts.backdrop === false) return;
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
        };
        if (!staging) keepRoom();
        try {
          controller && controller.destroy && controller.destroy();
        } catch (e) {
          console.error(e);
        }
        keepRoom();
        if (viewer) viewer.destroy();
        if (staging && !kept) staging.destroy();
        if (screen.stripMode) screen.stripMode(false);
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
