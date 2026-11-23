/*
 * The stage: the one screen every scene draws on. It owns the Phaser canvas (pictures) and the page layers (cards and
 * text), and it is the only file that touches Phaser's loader, so a picture reaches the screen only by its art id.
 *
 * Two views share the canvas, each a world measured in design px (1600 wide):
 *   "room"    the kitchen and the people: the world's width fills the play area; `lift` frames it higher or lower
 *   "worktop" the play area from above: a 1600 x 900 sheet anchored to the bottom, with more worktop shown above it
 *
 *   const stage = await createStage({ art, kit })
 *   stage.load(refs) -> Promise          pictures by art id, for the canvas and the page
 *   stage.show(view, { lift })            stage.layer(view, name) -> a layer of that view, in drawing order
 *   stage.halo(ref) -> { key, pad, k }   a soft gold copy of a picture's outline, for stage.image
 *   stage.picture(layer, ref, opts) -> handle      opts: { x, y, w | h | scale | rim, origin, mirror, alpha, angle, depth }
 *   stage.solid(ref)   stage.thingBox(ref)   stage.shapeShadow(layer, ref, { x, y, w })   stage.silhouette(layer, ref, colour, { x, y, w, alpha })
 *                                       a picture's own outline (js/shared/outline.js)
 *   stage.box(layer, { x, y, w, h }) -> box        what a game's mechanic is handed: its own clipped corner of a layer
 *   stage.toPage(view, x, y) -> [px, py]            for page elements placed over a picture      stage.visibleX(view) -> { left, right }
 *   stage.onTap(handle | { view, x, y, w, h }, fn)  stage.onTick(fn(ms))   stage.wait(ms)   stage.clear()
 *   stage.life() -> a scene's lifetime on the stage's clock (js/shared/life.js): the runner gives one to each scene
 *   stage.hold(on)   stage.onHold(fn(on)) -> off     the whole round stands still (the turn card) and goes on
 *   stage.keepInView(view, y, px?, bottom?)   world y stays in view, with px screen px above it, whatever the play area's
 *                                       shape; in the room, down to world y `bottom` too (shown smaller where it must be)
 *   stage.onResize(fn, view?) -> off   fn() once the canvas has been laid out again for a new size of the play area;
 *                                       a view's own are let go of when that view is cleared
 *
 * A handle: set(props), to(props, ms, ease) -> Promise, swap(ref), remove(), and `obj` (for the stage and the kit only).
 * The things themselves (pictures and their handles, the box, images, strips, lines, words) are made in stage.things.js.
 */
import { createOutlines } from "./outline.js";
import { createMadePictures } from "./made-pictures.js";
import { createThings } from "./stage.things.js";
import { createLife } from "./life.js";

const DESIGN_W = 1600;
const DESIGN_H = 900;

const stage_measure = {};

export async function createStage({ art, kit, frame, renderer = "auto" }) {
  const P = globalThis.Phaser;
  const el = { page: document.getElementById("page"), side: document.getElementById("side"), nani: document.getElementById("nani"), cards: document.getElementById("cards"), play: document.getElementById("play"), over: document.getElementById("over"), cover: document.getElementById("cover") };
  // the canvas at the screen's own pixel ratio (the frame's), never more than the kit's most (a phone's 3 costs more than it shows)
  const dpr = Math.min(kit.look.textures.dprMost, frame.now.dpr);
  const size = () => ({ w: el.play.clientWidth, h: el.play.clientHeight });
  let scene = null;
  const game = await new Promise((resolve) => {
    const g = new P.Game({
      type: renderer === "canvas" ? P.CANVAS : P.AUTO,
      parent: "canvas",
      backgroundColor: kit.look.stone,
      scale: { mode: P.Scale.NONE, width: size().w * dpr, height: size().h * dpr, zoom: 1 / dpr },
      // (smooth at every pixel ratio: Phaser takes a zoomed canvas for pixel art, sampling by the nearest pixel, unless told not)
      render: { antialias: true, pixelArt: false, roundPixels: false },
      audio: { noAudio: true },
      // loaded as page images, so a picture the loader has brought in shows at once on a card or in the page too
      loader: { imageLoadType: "HTMLImageElement" },
      banner: false,
      // the round's clock is the real time between frames: a smoothed one runs ahead or behind after a slow frame, and every
      // wait and moment would drift from what the child sees
      fps: { smoothStep: false },
      scene: {
        create() {
          scene = this;
          resolve(g);
        },
      },
    });
  });
  const outlines = createOutlines({ scene, art, kit });
  const views = {};
  const ticks = new Set();
  const taps = [];
  let showing = null;
  const wait = (ms) => new Promise((resolve) => scene.time.delayedCall(ms, resolve));
  const things = createThings({ scene, art, kit, views, dpr, load, tween, wait, ticks });
  const made = createMadePictures({ scene, art, kit, outlines, wrap: things.wrap });

  function makeView(name) {
    const root = scene.add.container(0, 0).setVisible(false);
    views[name] = { root, layers: {}, lift: 0, s: 1, top: 0, keep: null, keepPx: 0, keepBottom: null };
  }
  makeView("room");
  makeView("worktop");

  /** Where a view's world sits on the canvas, for the play area's size now. */
  function place() {
    const { w, h } = size();
    const room = views.room;
    const R = kit.room;
    // the world's width fills the play area; on a play area taller than the painting, the room is shown bigger instead
    // (cropped at its sides, never past needW) so the painting still fills it from top to bottom
    room.s = w / DESIGN_W;
    if (h / room.s > R.pictureH) room.s = Math.max(room.s, Math.min(h / R.pictureH, w / R.needW));
    // a span that must show whole (the serve: the heads with a bubble's room above them, down to the trays): on a play area
    // too short for it at that scale the room is shown smaller, more of the painting's sides showing, never past its width
    if (room.keepBottom != null && room.keep != null) room.s = Math.min(room.s, Math.max(w / R.pictureW, (h - room.keepPx) / (room.keepBottom - room.keep)));
    // the world y at the top of the play area: framed by the lift, high enough to keep the room asked for above the
    // heads (a bubble's), and never above the painting
    const keep = room.keep == null ? Infinity : room.keep - room.keepPx / room.s;
    room.top = Math.max(R.picture[1], Math.min(DESIGN_H - h / room.s - room.lift, keep));
    // (down to the bottom asked for; where even that does not fit, the frame gives up the strip above the heads, never the heads,
    // and the room's people stand lower to keep it: js/shared/kit/people.js)
    if (room.keepBottom != null) room.top = Math.min(room.keep, Math.max(room.top, room.keepBottom - h / room.s));
    const wt = views.worktop;
    // the sheet fits the play area, anchored to the bottom; and whatever was laid out higher (for a taller screen) stays in view
    wt.s = Math.min(w / DESIGN_W, h / (DESIGN_H - Math.min(0, wt.keep || 0)));
    wt.top = -Math.round(h / wt.s - DESIGN_H);
    for (const v of Object.values(views)) v.root.setScale(v.s * dpr).setPosition(((w - DESIGN_W * v.s) / 2) * dpr, -v.top * v.s * dpr);
    things.sharpen();
  }
  place();
  // the play area changed size (the window, a turn, the browser's bar): the canvas and both views are fitted again, and
  // then every page element placed over a picture is placed again; nothing restarts
  const resized = new Set();
  const holds = new Set();
  let held = false;
  let paused = [];
  let was = "";
  frame.onResize(() => {
    const now = `${size().w}x${size().h}`;
    if (now === was) return;
    was = now;
    game.scale.resize(size().w * dpr, size().h * dpr);
    place();
    resized.forEach((r) => r.fn());
  });

  scene.events.on("update", (time, delta) => ticks.forEach((fn) => fn(Math.min(100, delta))));

  /**
   * Load pictures by art ref, for the canvas and the page alike. What is already in costs nothing and returns at once;
   * each picture is waited for on its own, so loads asked for side by side never hold each other up. A picture that has
   * not come within kit.timings.pictureWaitMs is given up on: the scene goes on, and the picture shows as Phaser's stand-in,
   * as one that failed to load does.
   */
  const coming = new Map();
  function load(refs) {
    const need = [...new Set(refs.flatMap((r) => art.frames(r)))].filter((r) => r && !scene.textures.exists(art.key(r)));
    if (!need.length) return Promise.resolve();
    const each = need.map((r) => {
      const key = art.key(r);
      if (!coming.has(key)) {
        const came = new Promise((resolve) => {
          const done = () => (scene.load.off(`filecomplete-image-${key}`, done), scene.load.off("loaderror", failed), coming.delete(key), resolve());
          const failed = (file) => file.key === key && done();
          scene.load.once(`filecomplete-image-${key}`, done);
          scene.load.on("loaderror", failed);
          scene.load.image(key, art.file(r));
        });
        coming.set(key, came);
      }
      return coming.get(key);
    });
    scene.load.start(); // (while the loader runs, a picture added to it is taken in the same run)
    let timer = 0;
    const giveUp = new Promise((resolve) => (timer = setTimeout(resolve, kit.timings.pictureWaitMs)));
    return Promise.race([Promise.all(each), giveUp]).finally(() => clearTimeout(timer));
  }

  const EASE = { in: "Sine.easeIn", out: "Sine.easeOut", inOut: "Sine.easeInOut", back: "Back.easeOut", cubicOut: "Cubic.easeOut", cubicIn: "Cubic.easeIn", cubic: "Cubic.easeInOut", quadIn: "Quad.easeIn", linear: "Linear" };
  function tween(obj, props, ms, ease = "inOut") {
    if (!ms) {
      Object.assign(obj, props);
      return Promise.resolve();
    }
    return new Promise((resolve) => scene.tweens.add({ targets: obj, ...props, duration: ms, ease: EASE[ease] || ease, onComplete: resolve }));
  }

  /** The stage's clock for a scene's lifetime: each thing it starts handed back with the way to stop it. */
  const clock = {
    later(ms, fn) {
      const t = scene.time.delayedCall(ms, fn);
      return () => t.remove(false);
    },
    tween(obj, props, ms, ease = "inOut", done = () => {}) {
      if (!ms) return (Object.assign(obj, props), done(), () => {});
      const t = scene.tweens.add({ targets: obj, ...props, duration: ms, ease: EASE[ease] || ease, onComplete: done });
      return () => t.stop();
    },
    tick(fn) {
      ticks.add(fn);
      return () => ticks.delete(fn);
    },
    resize(fn) {
      const r = { fn, view: null };
      resized.add(r);
      return () => resized.delete(r);
    },
    tap: (target, fn) => onTap(target, fn),
  };

  function layer(view, name) {
    const v = views[view];
    if (!v.layers[name]) {
      v.layers[name] = scene.add.container(0, 0);
      v.root.add(v.layers[name]);
    }
    return v.layers[name];
  }


  function toPage(view, x, y) {
    const v = views[view];
    const { w } = size();
    return [(w - DESIGN_W * v.s) / 2 + x * v.s, (y - v.top) * v.s];
  }

  /** A tap anywhere in the play area is given to the topmost thing registered under it, at least `kit.look.minTap` px wide. */
  function onTap(target, fn) {
    const t = { target, fn };
    taps.push(t);
    // (one already let go of, with its view cleared, is not there to take out)
    return () => taps.includes(t) && taps.splice(taps.indexOf(t), 1);
  }
  function rectOf(t) {
    const g = t.target;
    if (g.obj) {
      const b = g.obj.getBounds();
      return { x: b.x / dpr, y: b.y / dpr, w: b.width / dpr, h: b.height / dpr };
    }
    const [x, y] = toPage(g.view, g.x, g.y);
    const s = views[g.view].s;
    return { x, y, w: g.w * s, h: g.h * s };
  }
  el.play.addEventListener("pointerdown", (ev) => {
    if (ev.target.closest("[data-own-taps]")) return;
    const r = el.play.getBoundingClientRect();
    const px = ev.clientX - r.left;
    const py = ev.clientY - r.top;
    const min = kit.look.minTap;
    for (let i = taps.length - 1; i >= 0; i--) {
      const b = rectOf(taps[i]);
      const gx = Math.max(0, (min - b.w) / 2);
      const gy = Math.max(0, (min - b.h) / 2);
      if (px >= b.x - gx && px <= b.x + b.w + gx && py >= b.y - gy && py <= b.y + b.h + gy) return void taps[i].fn({ x: px, y: py });
    }
  });

  return {
    el,
    art,
    scene,
    sheet: { w: DESIGN_W, h: DESIGN_H },
    load,
    picture: things.picture,
    badge: made.badge,
    solid: (ref) => outlines.solid(ref),
    thingBox: (ref) => outlines.thingBox(ref),
    shapeShadow: made.shapeShadow,
    silhouette: made.silhouette,
    shadow: made.shadow,
    image: things.image,
    halo: made.halo,
    tiled: things.tiled,
    layer,
    box: (layer, rect) => things.box(layer, rect, made),
    graphics: things.graphics,
    text: things.text,
    container: things.container,
    tween,
    wait,
    life: () => createLife(clock),
    toPage,
    onTap,
    size,
    /** A design-px box of a view as a rectangle on the page. */
    pageRect(view, b) {
      const r = el.play.getBoundingClientRect();
      const [x, y] = toPage(view, b.x, b.y);
      const k = views[view].s;
      return { x: r.left + x, y: r.top + y, w: b.w * k, h: b.h * k };
    },
    scaleOf: (view) => views[view].s,
    /** The slice of a view's world the play area shows across, in design px. */
    visibleX(view) {
      const half = size().w / views[view].s / 2;
      return { left: DESIGN_W / 2 - half, right: DESIGN_W / 2 + half };
    },
    topOf: (view) => views[view].top,
    onTick(fn) {
      ticks.add(fn);
      return () => ticks.delete(fn);
    },
    onResize(fn, view = null) {
      const r = { fn, view };
      resized.add(r);
      return () => resized.delete(r);
    },
    /**
     * The round held where it is (behind the turn card) and let go again: the pictures, their moves and every
     * stage.wait stand still, the page's own moves pause, and each listener (the voice, the sounds) holds too.
     */
    hold(on) {
      if (on === held) return;
      held = on;
      if (on) {
        game.pause();
        // the turn card and the start button are what the child sees while held: they keep moving
        const own = (a) => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest(".turn-card, .start");
        paused = document.getAnimations().filter((a) => a.playState === "running" && !own(a));
        paused.forEach((a) => a.pause());
      } else {
        game.resume();
        paused.forEach((a) => a.playState === "paused" && a.play());
        paused = [];
      }
      holds.forEach((fn) => fn(on));
    },
    held: () => held,
    onHold(fn) {
      holds.add(fn);
      return () => holds.delete(fn);
    },
    /** Cut to a view. `lift` frames the room higher (more wall, less counter). */
    show(view, { lift = 0 } = {}) {
      if (view === "room") views.room.lift = lift;
      place();
      Object.entries(views).forEach(([name, v]) => v.root.setVisible(name === view));
      showing = view;
    },
    showing: () => showing,
    /** For the checks: show or hide one layer of the view now showing (the shadows, to measure what they add). */
    layerShown(name, on) {
      const l = showing && views[showing].layers[name];
      if (l) l.setVisible(on);
      return !!l;
    },
    canvas: () => game.canvas,
    /**
     * A world y kept in view, with `px` screen px above it: on the worktop, the highest its things were laid out to (kept
     * if the play area later gets shorter); in the room, the highest head, with room above it for a bubble.
     */
    keepInView(view, top, px = 0, bottom = null) {
      Object.assign(views[view], { keep: top, keepPx: px, keepBottom: bottom });
      place();
    },
    /** Glide the room's framing to a new lift. */
    glide(lift, ms) {
      const v = views.room;
      const state = { lift: v.lift };
      return new Promise((resolve) =>
        scene.tweens.add({ targets: state, lift, duration: ms, ease: "Sine.easeInOut", onUpdate: () => ((v.lift = state.lift), place()), onComplete: resolve })
      );
    },
    /** Empty a view: every layer, every tap on it. */
    clear(view) {
      const v = views[view];
      Object.values(v.layers).forEach((l) => l.destroy());
      v.layers = {};
      Object.assign(v, { keep: null, keepPx: 0, keepBottom: null });
      for (let i = taps.length - 1; i >= 0; i--) if ((taps[i].target.view || taps[i].target.viewName) === view) taps.splice(i, 1);
      resized.forEach((r) => r.view === view && resized.delete(r));
    },
    /** How wide a word is in the word font at a size, in design px. */
    measure(str, px) {
      const c = (stage_measure.c = stage_measure.c || document.createElement("canvas").getContext("2d"));
      c.font = `${kit.look.wordWeight} ${px}px ${kit.look.wordFont}`;
      return c.measureText(str).width;
    },
    /** A stone curtain over the play area for a change of scene: it closes in `ms` and lifts when told. */
    async curtain(ms) {
      const c = document.createElement("div");
      c.className = "curtain";
      c.style.transitionDuration = `${ms}ms`;
      el.play.appendChild(c);
      void c.offsetWidth;
      c.classList.add("on");
      await wait(ms);
      return {
        async lift() {
          c.classList.remove("on");
          await wait(ms);
          c.remove();
        },
      };
    },
    /** The stone cover over everything while pictures load; it lifts once, in one fade. */
    async uncover() {
      el.cover.classList.add("off");
      await new Promise((r) => setTimeout(r, kit.look.coverFadeMs));
      el.cover.remove();
    },
  };
}
