/*
 * Cook with Nani: the serving kitchen (s19-serve; Zafar, 11 Nov, ART-77). One kitchen in two views:
 *
 *   the ordering view   framed exactly as today's kitchen (the same wall above the family, the same back counter, the same
 *                       strip of island: "the current amount of counter is the right amount"): the camera as fitView sets it;
 *   the serving view    when the child comes back to serve, the camera glides down (about 0.8 s, eased) until the island's
 *                       top fills the lower half, the faces still in view at the top.
 *
 * Either art drops in, chosen in the settings (data/cook.json art.serve.mode, or ?kitchen=tall|two for a look):
 *   "tall"  one tall painting (KG), scrolled: it is the kitchen's picture (bg-service), its ordering view at `core`;
 *   "two"   two pictures, the ordering view (KO, bg-service) and the serving view (KS), crossfaded as the camera glides.
 * Every picture is cut to the kitchen master's geometry: 1 px = 1 design px, the ordering view's 1600x900 at `core` (250, 450),
 * the island's back edge at design y 608 (where the family sit: the occluder's 611). KS is the same, drawn `drop` px lower.
 * s19-serve2 (the s19-k2 run, 11 Nov): KG 1448x1086 brought to 2100x1575 (LANCZOS and a light sharpen: no Real-ESRGAN here), its
 * island's back edge measured at picture y 1058.5 (design 608.5, no shift needed), its front lip at about design 1015-1030: so the
 * ordering view keeps today's 292 px of marble and the serving view (158 down) is the island's top. KO and KS: 2100 wide, each set
 * so its back edge lands on the same world line (KO 130 px down, KS 216), the wall's top row carried on above.
 *
 * No trays in any picture: one walnut tray (KT, cut from the long tray-src: its two ends joined, about 45 x 30 cm) per person who
 * ordered, on the island's top under them (its middle, design y 812), put down as the camera glides; each person's dish lands on
 * their tray at its true size (a size class: a plate, a bowl, a glass; the run drew them 10-25% large), the tray's front rim drawn
 * again over it (decision 87), the person's face circle on the rim as the asker's mark. The rest of the serve (who asked, Shabash,
 * the thanks, the review) is the caller's, unchanged (js/cook/flow.js serve, kitchenEnd).
 *
 *   Cook.Serve.on()                      the serving kitchen is in use
 *   Cook.Serve.plan(dish, who)           a lab order's dish -> [{who, dish, n}] (one entry per person's dish)
 *   Cook.Serve.prefetch(S, plan)         load the tray, the dishes and the faces (and KS) ahead
 *   await Cook.Serve.serve(S, plan)      glide down, the trays, then each dish lands on its person's tray
 *   await Cook.Serve.glide(S, down)      the camera alone (down: the serving view; false: back to the ordering view)
 *   Cook.Serve.reset(S)                  back to the ordering view at once (every view change does it: the scene's clearView)
 *   Cook.Serve.frontFor(S, x)            the tray at x's front rim, drawn again (Nani's pointing finger goes under it)
 */
import { Cook as CookNS } from "./ns.js";

(function (global) {
  const Cook = CookNS;
  const DIR = "assets/cook/serve/";
  /*
   * The settings (data/cook.json art.serve overrides any of them). The file names are the real pieces' (the s19-k2 art plan):
   * the cut of ART-77's run writes over these stand-ins (made from today's kitchen and the S19 kitchen run) and they drop in.
   */
  const DEFAULTS = {
    on: true,
    mode: "tall",
    tall: `${DIR}kitchen-tall.webp`, // KG: 2100x1575, the ordering view's 1600x900 at core, the island's top carrying on below
    order: `${DIR}kitchen-order.webp`, // KO: 2100x1350, the ordering view's 1600x900 at core (today's master's frame)
    serve: `${DIR}kitchen-serve.webp`, // KS: 2100x1350, the serving view's 1600x900 at core
    core: [250, 450],
    drop: 158, // design px the camera glides down (the island's back edge from y 608 to the view's middle)
    glideMs: 800,
    faceRoom: 14, // design px kept above the highest head in the serving view
    // the tray (480x208, measured on it): its floor from 0.116 to its front rim's inner edge at 0.875 of its height; y: the
    // island top's middle on KG (back edge 608, front lip about 1015)
    tray: { file: `${DIR}tray.webp`, w: 400, y: 812, rim: 0.875, floor: 0.495, face: 58 },
    // the size classes, as a share of the tray's width (a 45 cm tray: a 26 cm plate, a 17 cm bowl, a 7.5 cm glass; the art
    // plan's 30 : 20 : 9); a dish wider than its share of a tray holding several shrinks to it
    sizes: { plate: 0.58, bowl: 0.39, glass: 0.17 },
    // per recipe (Cook.Art.servedName's): its picture, its size class and `at`, the row of its picture (a share of its height)
    // that stands on the floor's middle: a plate's centre, a bowl's or a glass's foot
    dishes: {
      chai: { file: `${DIR}dish-chai.webp`, size: "glass", at: 0.95 },
      "chai-black": { file: `${DIR}dish-chai-black.webp`, size: "glass", at: 0.93 },
      maani: { file: `${DIR}dish-maani.webp`, size: "plate", at: 0.48 },
      daal: { file: `${DIR}dish-daar.webp`, size: "bowl", at: 0.93 },
      mishkaki: { file: `${DIR}dish-sekelo.webp`, size: "plate", at: 0.48 },
      samosa: { file: `${DIR}dish-samosa.webp`, size: "plate", at: 0.47 },
      chaat: { file: `${DIR}dish-chaat.webp`, size: "bowl", at: 0.93 },
      corn: { file: `${DIR}dish-corn.webp`, size: "plate", at: 0.48 },
      baking: { file: `${DIR}dish-naan.webp`, size: "plate", at: 0.47 },
      chop: { file: `${DIR}dish-chop.webp`, size: "bowl", at: 0.93 },
      // eggs keep their plate-table pictures (fried-table, boiled), on a plate
      "eggs-fried": { file: `${DIR}dish-eggs-fried.webp`, size: "plate", at: 0.46 },
      "eggs-boiled": { file: `${DIR}dish-eggs-boiled.webp`, size: "plate", at: 0.46 },
    },
  };
  const ISLAND = 611; // the family's line (stations.js occluder: the counter's front from design y 611 down)

  let urlMode = null;
  try {
    const m = /[?&]kitchen=(tall|two)\b/.exec((global.location && global.location.search) || "");
    urlMode = m ? m[1] : null;
  } catch (e) {
    /* no page address */
  }
  function cfg() {
    const own = ((Cook.data && Cook.data.art) || {}).serve || {};
    const c = Object.assign({}, DEFAULTS, own);
    c.tray = Object.assign({}, DEFAULTS.tray, own.tray || {});
    c.dishes = Object.assign({}, DEFAULTS.dishes, own.dishes || {});
    c.sizes = Object.assign({}, DEFAULTS.sizes, own.sizes || {});
    if (urlMode) c.mode = urlMode;
    return c;
  }

  /*
   * The kitchen's picture is the serving kitchen's: the tall painting, or the ordering view (two pictures). Set as Cook's data
   * loads, before the scene's preload reads art.s02 "kitchen-trays" (stations.js), so the picture is loaded once, at the
   * master's geometry (core): the occluder and every view keep working unchanged. Its meta.trays stay as the people's spots.
   */
  if (Cook.onLoad)
    Cook.onLoad.push((data) => {
      const art = (data && data.art) || null;
      if (!art) return;
      const c = Object.assign({}, DEFAULTS, art.serve || {});
      if (urlMode) c.mode = urlMode;
      if (!c.on) return;
      art.s02 = art.s02 || {};
      const kt = art.s02["kitchen-trays"] || {};
      art.s02["kitchen-trays"] = Object.assign({}, kt, { file: c.mode === "two" ? c.order : c.tall, core: c.core, ready: true, meta: kt.meta || { trays: [[350, 662, 324, 64], [803, 662, 327, 64], [1258, 662, 329, 64]] } });
    });

  const st = { serving: false, drop: 0, trays: [], ks: null, stop: null };
  const D = () => Cook.D || { bg: 0, occ: 20 };
  const key = (name) => `serve-${name}`;
  const dishOf = (name) => {
    const c = cfg();
    const d = c.dishes[name];
    if (d) return { key: key(`dish-${name}`), file: d.file, share: c.sizes[d.size] || null, h: d.h || 140, at: d.at != null ? d.at : 0.96 };
    // a dish the serve has no picture of yet (the pantry's basket): today's served picture (art.s02 served-dishes), its base on the floor
    const a = Cook.Art && Cook.Art.servedArt ? Cook.Art.servedArt(name) : null;
    return a ? { key: a.key, file: a.file, share: null, h: a.drawH || 128, at: 0.96 } : null;
  };

  /** A lab order's dish (the card's dish: R.<recipe>.make) as one entry per person's dish. */
  function plan(dish, who) {
    if (!dish || !dish.recipe) return [];
    const r = dish.recipe;
    if (r === "chai") {
      const cups = Array.isArray(dish.cups) && dish.cups.length ? dish.cups : [{ who }];
      return cups.map((c) => ({ who: c.who || who, dish: c.dudh === false ? "chai-black" : "chai", n: 1 }));
    }
    if (r === "eggs") return (dish.plates || []).map((q) => ({ who: q.who || who, dish: q.fried ? "eggs-fried" : "eggs-boiled", n: 1 }));
    return [{ who: dish.who || who, dish: r, n: 1 }];
  }
  /** Only the dishes the serve can show (a picture known). */
  const showable = (p) => (p || []).filter((e) => e && e.who && dishOf(e.dish));

  function prefetch(S, p, { faces = false } = {}) {
    if (!S || !Cook.Art || !Cook.Art.loadFile) return Promise.resolve();
    const c = cfg();
    const list = [[key("tray"), c.tray.file]];
    if (c.mode === "two") list.push([key("ks"), c.serve]);
    showable(p).forEach((e) => {
      const d = dishOf(e.dish);
      list.push([d.key, d.file]);
    });
    // (the faces only at the serve: a station loads its own while it plays, through its loader, never raced here)
    const own = faces ? [...new Set(showable(p).map((e) => e.who))].flatMap((w) => (Cook.Kit && Cook.Kit.faceArt ? Cook.Kit.faceArt(w).slice(0, 1) : [])) : [];
    return Promise.all(list.concat(own).map(([k, u]) => Cook.Art.loadFile(S, k, u)));
  }

  /* ---------------- the two views ---------------- */
  /** How far the camera goes down: the settings' drop, kept so every head stays in view and the picture reaches the bottom. */
  function dropFor(S) {
    const c = cfg();
    const v = Cook.view || { top: 0, bottom: 900 };
    let d = c.drop;
    // the picture's bottom (world px): the tall painting's, or KS's (drawn `drop` lower)
    const tex = c.mode === "two" ? key("ks") : "bg-service";
    const img = S.textures.exists(tex) ? S.textures.get(tex).getSourceImage() : null;
    if (img && img.height) d = Math.min(d, -c.core[1] + img.height + (c.mode === "two" ? c.drop : 0) - v.bottom);
    // the faces stay in view at the top
    Object.values(S.chars || {}).forEach((ch) => {
      if (!ch || !ch.active || !S.headBox) return;
      d = Math.min(d, S.headBox(ch).y - c.faceRoom - v.top);
    });
    return Math.max(0, Math.round(d));
  }
  /** Once per scene: every view change puts the ordering view back; a resize keeps the serving view. */
  function hook(S) {
    if (S.__serveHook) return;
    S.__serveHook = true;
    const clear = S.clearView;
    S.clearView = function () {
      reset(this);
      return clear.apply(this, arguments);
    };
    if (S.scale && S.scale.on)
      S.scale.on("resize", () => {
        if (st.serving && S.cameras && S.cameras.main) S.cameras.main.scrollY = (Cook.view ? Cook.view.top : 0) + (st.drop = dropFor(S));
      });
  }
  function reset(S) {
    st.serving = false;
    st.drop = 0;
    st.trays = [];
    st.ks = null;
    if (st.stop) st.stop();
    if (!S || !S.cameras || !S.cameras.main) return;
    S.cameras.main.scrollY = Cook.view ? Cook.view.top : 0;
    if (S.bg) S.bg.setAlpha(1);
    (S.bgExt || []).forEach((o) => o && o.setAlpha && o.setAlpha(1));
  }
  /** The serving view's own picture (two pictures): KS under the kitchen's, and its counter over the family, faded in. */
  function addKS(S) {
    const c = cfg();
    if (c.mode !== "two" || !S.textures.exists(key("ks"))) return null;
    const ox = -c.core[0];
    const oy = -c.core[1] + c.drop;
    const src = S.textures.get(key("ks")).getSourceImage();
    const back = S.track(S.add.image(ox, oy, key("ks")).setOrigin(0).setDepth(D().bg - 0.3));
    const cy = Math.max(0, Math.round(ISLAND - oy));
    const occ = S.track(S.add.image(ox, oy, key("ks")).setOrigin(0).setCrop(0, cy, src.width, src.height - cy).setDepth(D().occ + 0.05).setAlpha(0));
    return { back, occ };
  }
  /**
   * The camera's slide, on the clock (s19-serve2): every frame puts it where the eased 0.8 s says, so a frame the device drops
   * (a busy phone, a picture decoding) never stretches the glide past its 0.8 s nor leaves it moving after (contract-80 allows
   * the announced glide 1 s; a tween's clock stalls with the frames). The scene's tween clock (Cook.speed in the tests) sets its
   * pace, as a tween's. A view change (reset) stops it where it is.
   */
  function slide(S, cam, to, ms) {
    if (st.stop) st.stop();
    const from = cam.scrollY;
    const real = ms / ((S.tweens && S.tweens.timeScale) || 1);
    const now = () => (global.performance ? global.performance.now() : Date.now());
    const t0 = now();
    return new Promise((resolve) => {
      if (!(real > 0) || from === to || !S.events) {
        cam.scrollY = to;
        return resolve();
      }
      const stop = () => {
        S.events.off("preupdate", step);
        S.events.off("shutdown", stop);
        if (st.stop === stop) st.stop = null;
        resolve();
      };
      const step = () => {
        const k = Math.min(1, (now() - t0) / real);
        cam.scrollY = from + (to - from) * (0.5 - Math.cos(Math.PI * k) / 2); // Sine in-out
        if (k >= 1) stop();
      };
      st.stop = stop;
      S.events.on("preupdate", step);
      S.events.once("shutdown", stop);
    });
  }
  /** The camera glides to the serving view (down) or back to the ordering view; the two pictures crossfade as it goes. */
  async function glide(S, down = true) {
    if (!S || !S.cameras || !S.cameras.main) return;
    hook(S);
    const c = cfg();
    const cam = S.cameras.main;
    const top = Cook.view ? Cook.view.top : 0;
    const d = down ? dropFor(S) : 0;
    if (down && !st.ks) st.ks = addKS(S);
    st.serving = down;
    st.drop = d;
    const ms = c.glideMs;
    const jobs = [slide(S, cam, top + d, ms)];
    if (st.ks) {
      const fade = [S.bg].concat(S.bgExt || []).filter(Boolean);
      jobs.push(Cook.tween(S, { targets: fade, alpha: down ? 0 : 1, duration: ms * 0.6, ease: "Sine.easeInOut" }));
      jobs.push(Cook.tween(S, { targets: st.ks.occ, alpha: down ? 1 : 0, duration: ms * 0.6, ease: "Sine.easeInOut" }));
    }
    if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("serve-view", { step: down ? "serving" : "ordering", by: [d, c.mode].join(" ") });
    await Promise.all(jobs);
  }

  /* ---------------- the trays and the dishes ---------------- */
  /** Where each person's tray goes: under them, as wide as the room between neighbours allows. */
  function trayPlaces(S, people) {
    const c = cfg();
    const xs = people.map((w) => {
      const ch = S.chars && S.chars[w];
      return ch ? ch.x : w === "nani" && Cook.CHARS && Cook.CHARS.nani ? Cook.CHARS.nani.x : null;
    });
    const pts = people.map((w, i) => ({ who: w, x: xs[i] })).filter((p) => p.x != null).sort((a, b) => a.x - b.x);
    // every tray whole on screen: the one at an edge moves in, and the trays narrow to the room left between them
    const v = Cook.view || { left: 0, right: 1600 };
    const pad = 16;
    let w = c.tray.w;
    for (let pass = 0; pass < 3; pass++) {
      pts.forEach((p) => (p.x = Math.max(v.left + w / 2 + pad, Math.min(v.right - w / 2 - pad, p.x0 != null ? p.x0 : (p.x0 = p.x)))));
      let gap = Infinity;
      for (let i = 1; i < pts.length; i++) gap = Math.min(gap, pts[i].x - pts[i - 1].x);
      w = Math.min(c.tray.w, gap * 0.92, (v.right - v.left - 2 * pad) / Math.max(1, pts.length));
    }
    const src = S.textures.exists(key("tray")) ? S.textures.get(key("tray")).getSourceImage() : { width: 480, height: 208 };
    const h = (w * src.height) / src.width;
    return pts.map((p) => ({ who: p.who, x: p.x, y: c.tray.y, w, h }));
  }
  /** One tray: the walnut tray, its front rim again on top (over the dish), the person's face circle on the rim. */
  function drawTray(S, t) {
    const c = cfg();
    const dep = D().occ;
    // (a tray whose picture never came is left out: never Phaser's missing square on the island)
    if (S.textures.exists(key("tray"))) {
      const src = S.textures.get(key("tray")).getSourceImage();
      t.img = S.track(S.add.image(t.x, t.y, key("tray")).setDisplaySize(t.w, t.h).setDepth(dep + 1.5));
      const ry = Math.round(src.height * c.tray.rim);
      t.rim = S.track(S.add.image(t.x, t.y, key("tray")).setDisplaySize(t.w, t.h).setCrop(0, ry, src.width, src.height - ry).setDepth(dep + 2.6));
    }
    // the asker's mark: their face circle on the rim's front left
    if (Cook.Kit && Cook.Kit.badge && S.textures.exists(`${t.who}-badge`)) {
      const f = c.tray.face;
      t.face = S.track(S.add.image(t.x - t.w / 2 + f * 0.62, t.y + t.h / 2 - f * 0.42, Cook.Kit.badge(S, t.who)).setDisplaySize(f, f).setDepth(dep + 2.8));
    }
    t.parts = [t.img, t.rim, t.face].filter(Boolean);
    return t;
  }
  /** The dishes of one tray, side by side on its floor, each at its true size (not yet shown: they land). */
  function placeDishes(S, t, list) {
    const c = cfg();
    const n = list.reduce((a, e) => a + (e.n || 1), 0);
    const share = (t.w * 0.84) / Math.max(1, n);
    // the floor's middle (a dish's `at` row stands on it); a dish with no size class: its base a little in front of it
    const mid = t.y - t.h / 2 + t.h * c.tray.floor;
    let i = 0;
    const out = [];
    list.forEach((e) => {
      const d = dishOf(e.dish);
      for (let k = 0; k < (e.n || 1); k++, i++) {
        if (!d || !S.textures.exists(d.key)) continue;
        const src = S.textures.get(d.key).getSourceImage();
        let w = d.share ? t.w * d.share : (d.h * src.width) / src.height;
        if (w > share) w = share;
        const h = (w * src.height) / src.width;
        const base = d.share ? mid : mid + t.h * 0.2;
        const x = t.x + (i - (n - 1) / 2) * share;
        const img = S.track(S.add.image(x, base, d.key).setOrigin(0.5, d.at).setDisplaySize(w, h).setDepth(D().occ + 2 + i * 0.01).setAlpha(0));
        img.restY = base;
        out.push(img);
        (Cook.servedLog = Cook.servedLog || []).push({ img, t });
      }
    });
    return out;
  }

  /**
   * The serve: the camera glides down to the island while the trays are put down (one per person in the plan), then each
   * dish lands on its person's tray, one after another with a soft pop. Resolves when the last has landed.
   */
  async function serve(S, p) {
    const list = showable(p);
    if (!S || !list.length) return false;
    hook(S);
    const loadCap = Cook.Stations && Cook.Stations.capLoad ? Cook.Stations.capLoad : (x) => x;
    await loadCap(prefetch(S, list, { faces: true }), 1500);
    Cook.servedLog = [];
    Cook.servedN = (Cook.servedN || 0) + 1;
    const people = [...new Set(list.map((e) => e.who))];
    const trays = trayPlaces(S, people).map((t) => drawTray(S, t));
    st.trays = trays;
    trays.forEach((t) => t.parts.forEach((o) => o.setAlpha(0)));
    const ms = cfg().glideMs;
    const put = Cook.tween(S, { targets: trays.flatMap((t) => t.parts), alpha: 1, duration: ms * 0.7, delay: ms * 0.25, ease: "Sine.easeOut" });
    await Promise.all([glide(S, true), put]);
    for (const t of trays) {
      const dishes = placeDishes(S, t, list.filter((e) => e.who === t.who));
      for (const img of dishes) {
        img.y = img.restY - 70;
        await Cook.tween(S, { targets: img, y: img.restY, alpha: 1, duration: 340, ease: "Cubic.easeOut" });
        if (Cook.sfx && Cook.sfx.pop) Cook.sfx.pop();
        await Cook.wait(160);
      }
    }
    if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("serve-trays", { step: String(trays.length), by: list.map((e) => `${e.who}:${e.dish}`).join(" ") });
    return true;
  }
  /** The front rim of the tray at x (Nani's pointing finger reaches in under it); false when there is none. */
  function frontFor(S, x) {
    const t = st.trays.filter((u) => u.rim && u.rim.active).sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
    if (!t || Math.abs(t.x - x) > t.w / 2) return false;
    const c = cfg();
    const src = S.textures.get(key("tray")).getSourceImage();
    const ry = Math.round(src.height * c.tray.rim);
    const r = S.track(S.add.image(t.x, t.y, key("tray")).setDisplaySize(t.w, t.h).setCrop(0, ry, src.width, src.height - ry).setDepth(D().occ + 2.6));
    r.wallTop = t.y - t.h / 2 + t.h * c.tray.rim;
    return r;
  }

  Cook.Serve = {
    on: () => !!cfg().on,
    cfg,
    plan,
    prefetch,
    serve,
    glide,
    reset,
    frontFor,
    dropFor,
    /** (a test signal) the view and the trays now: {serving, drop, trays: [{who, x, y, w, h}]} */
    state: () => ({ serving: st.serving, drop: st.drop, mode: cfg().mode, trays: st.trays.map((t) => ({ who: t.who, x: t.x, y: t.y, w: t.w, h: t.h })) }),
  };
})(window);
