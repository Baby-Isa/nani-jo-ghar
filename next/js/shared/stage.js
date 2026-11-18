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
 *   stage.solid(ref)   stage.shapeShadow(layer, ref, { x, y, w })   stage.silhouette(layer, ref, colour, { x, y, w, alpha })
 *                                       a picture's own outline (js/shared/outline.js)
 *   stage.box(layer, { x, y, w, h }) -> box        what a game's mechanic is handed: its own clipped corner of a layer
 *   stage.toPage(view, x, y) -> [px, py]            for page elements placed over a picture      stage.visibleX(view) -> { left, right }
 *   stage.onTap(handle | { view, x, y, w, h }, fn)  stage.onTick(fn(ms))   stage.wait(ms)   stage.clear()
 *   stage.hold(on)   stage.onHold(fn(on)) -> off     the whole round stands still (the turn card) and goes on
 *   stage.keepInView(view, y, px?, bottom?)   world y stays in view, with px screen px above it, whatever the play area's
 *                                       shape; in the room, down to world y `bottom` too (shown smaller where it must be)
 *   stage.onResize(fn, view?) -> off   fn() once the canvas has been laid out again for a new size of the play area;
 *                                       a view's own are let go of when that view is cleared
 *
 * A handle: set(props), to(props, ms, ease) -> Promise, swap(ref), remove(), and `obj` (for the stage and the kit only).
 */
import { createOutlines } from "./outline.js";
import { createMadePictures } from "./made-pictures.js";

const DESIGN_W = 1600;
const DESIGN_H = 900;

function originOf(art, ref, mirror) {
  const [w, h] = art.size(ref) || [1, 1];
  let cx = art.meta(ref, "cx");
  let cy = art.meta(ref, "cy");
  if (cx == null || cy == null) return [0.5, 0.5];
  if (cx <= 1 && cy <= 1) [cx, cy] = [cx * w, cy * h];
  return [mirror ? (w - cx) / w : cx / w, cy / h];
}

const stage_measure = {};

export async function createStage({ art, kit, frame, renderer = "auto" }) {
  const P = globalThis.Phaser;
  const el = { page: document.getElementById("page"), side: document.getElementById("side"), nani: document.getElementById("nani"), cards: document.getElementById("cards"), play: document.getElementById("play"), over: document.getElementById("over"), cover: document.getElementById("cover") };
  const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
  const size = () => ({ w: el.play.clientWidth, h: el.play.clientHeight });
  let scene = null;
  const game = await new Promise((resolve) => {
    const g = new P.Game({
      type: renderer === "canvas" ? P.CANVAS : P.AUTO,
      parent: "canvas",
      backgroundColor: kit.look.stone,
      scale: { mode: P.Scale.NONE, width: size().w * dpr, height: size().h * dpr, zoom: 1 / dpr },
      render: { antialias: true, roundPixels: false },
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
  const made = createMadePictures({ scene, art, kit, outlines, wrap });
  const views = {};
  const ticks = new Set();
  const taps = [];
  let showing = null;

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

  const isIn = (ref) => art.frames(ref).every((r) => scene.textures.exists(art.key(r)));
  /**
   * A picture's handle. A picture the round has not loaded yet (a later scene's, on a slow line) is hidden until it is in
   * and then shown at the size it has been given by then, so a move never shows Phaser's stand-in for one still coming.
   *   size: what its size was given by ("w", "h", or null for a scale), kept when its picture changes
   */
  function wrap(obj, ref, mirror, size = null) {
    const st = { size, shown: true, waiting: false, turn: 0 };
    /**
     * Do `apply` once `next` is in: now, or when it comes (a later change wins over one still waiting). Until then a new
     * picture is hidden, and a changing one keeps showing the picture it had.
     */
    function whenIn(next, apply, { hide = false } = {}) {
      const turn = ++st.turn;
      if (isIn(next)) return apply();
      st.waiting = hide;
      if (hide) obj.setVisible(false);
      load([next]).then(() => {
        if (!obj.active || turn !== st.turn) return;
        st.waiting = false;
        apply();
        obj.setVisible(st.shown);
      });
    }
    const h = {
      obj,
      ref,
      set(props) {
        for (const [k, v] of Object.entries(props)) {
          if (k === "w") (obj.setScale(v / obj.width), (st.size = "w"));
          else if (k === "h") (obj.setScale(v / obj.height), (st.size = "h"));
          else if (k === "angle") obj.setAngle(v);
          else if (k === "depth") obj.setDepth(v);
          else if (k === "visible") (obj.setVisible(v && !st.waiting), (st.shown = v));
          else obj[k] = v;
        }
        return h;
      },
      to: (props, ms, ease) => tween(obj, props, ms, ease),
      /** The same thing in another picture, keeping its place and its size on screen. */
      swap(next, { rim = null } = {}) {
        h.ref = next;
        whenIn(next, () => {
          const shown = obj.displayWidth;
          const [keepX, keepY] = [obj.originX, obj.originY];
          obj.setTexture(art.key(next));
          if (rim) {
            // placed by its rim: each picture of the set has its own rim centre and radius
            const [ox, oy] = originOf(art, next, mirror);
            obj.setOrigin(ox, oy).setScale(rim / rimOf(next));
          } else obj.setOrigin(keepX, keepY).setScale(shown / obj.width);
        });
        return h;
      },
      remove: () => obj.destroy(),
    };
    // made before its picture came: it takes it as it comes, at the size it has by then (a made picture has no ref)
    if (ref && !isIn(ref))
      whenIn(ref, () => {
        const [w, hh, k] = [obj.displayWidth, obj.displayHeight, obj.scaleX];
        obj.setTexture(art.key(ref)).setScale(st.size === "w" ? w / obj.width : st.size === "h" ? hh / obj.height : k);
      }, { hide: true });
    return h;
  }
  /** A picture's rim radius in its own px, from the art list (some pieces give it as a share of the width). */
  function rimOf(ref) {
    const r = art.meta(ref, "r");
    const [w] = art.size(ref) || [1];
    return r <= 1 ? r * w : r;
  }

  function picture(layer, ref, o = {}) {
    const obj = scene.add.image(o.x || 0, o.y || 0, art.key(ref));
    const [ox, oy] = o.origin || (o.rim ? originOf(art, ref, o.mirror) : [0.5, 0.5]);
    obj.setOrigin(ox, oy);
    if (o.mirror) obj.setFlipX(true);
    if (o.rim) obj.setScale(o.rim / rimOf(ref));
    else if (o.w) obj.setScale(o.w / obj.width);
    else if (o.h) obj.setScale(o.h / obj.height);
    else if (o.scale) obj.setScale(o.scale);
    if (o.alpha != null) obj.setAlpha(o.alpha);
    if (o.angle) obj.setAngle(o.angle);
    if (o.depth != null) obj.setDepth(o.depth);
    layer.add(obj);
    return wrap(obj, ref, !!o.mirror, o.rim ? null : o.w ? "w" : o.h ? "h" : null);
  }

  function layer(view, name) {
    const v = views[view];
    if (!v.layers[name]) {
      v.layers[name] = scene.add.container(0, 0);
      v.root.add(v.layers[name]);
    }
    return v.layers[name];
  }

  /**
   * The box a mechanic is handed: a container it can fill with pictures by art id and move them about in, measured
   * from the box's own middle. It cannot reach the scene, the loader or the screen through it.
   */
  function box(parent, { x, y, w, h }) {
    const c = scene.add.container(x, y);
    parent.add(c);
    // clipped: nothing drawn in the box shows outside it, wherever the box is carried
    const clip = scene.make.graphics({ add: false });
    c.setMask(clip.createGeometryMask());
    const follow = () => {
      const m = c.getWorldTransformMatrix();
      clip.clear().fillStyle(0xffffff, 1).fillRect(-w / 2, -h / 2, w, h);
      clip.setPosition(m.tx, m.ty).setScale(m.scaleX, m.scaleY).setRotation(m.rotation);
    };
    follow();
    ticks.add(follow);
    c.once("destroy", () => (ticks.delete(follow), clip.destroy()));
    const made = [];
    const api = {
      w,
      h,
      picture(ref, o = {}) {
        const hd = picture(c, ref, o);
        made.push(hd);
        return { set: hd.set, to: hd.to, swap: hd.swap, remove: hd.remove, get ref() { return hd.ref; } };
      },
      wait: (ms) => wait(ms),
      clear() {
        made.splice(0).forEach((hd) => hd.obj.destroy());
      },
    };
    // the family, not the game, moves the box itself (the carry to the serving spot)
    const handle = {
      obj: c,
      set: (p) => (Object.assign(c, p), handle),
      to: (p, ms, ease) => tween(c, p, ms, ease),
      /** Move the whole box to another layer, keeping its place (a carried vessel passes over everything). */
      raise(to) {
        c.parentContainer.remove(c);
        to.add(c);
      },
      remove: () => c.destroy(),
    };
    return { api, handle };
  }

  const wait = (ms) => new Promise((resolve) => scene.time.delayedCall(ms, resolve));

  function image(layerC, key, o = {}) {
    const obj = scene.add.image(o.x || 0, o.y || 0, key);
    if (o.w) obj.setScale(o.w / obj.width);
    layerC.add(obj);
    return wrap(obj, null, false);
  }
  /** A picture repeated to fill a strip (the worktop, the band). */
  function tiled(layerC, ref, { x, y, w, h, scale = 1 }) {
    const obj = scene.add.tileSprite(x, y, w, h, art.key(ref)).setOrigin(0, 0);
    obj.setTileScale(scale);
    layerC.add(obj);
    return wrap(obj, ref, false);
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
    return () => taps.splice(taps.indexOf(t), 1);
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
    picture,
    badge: made.badge,
    solid: (ref) => outlines.solid(ref),
    shapeShadow: made.shapeShadow,
    silhouette: made.silhouette,
    shadow: made.shadow,
    image,
    halo: made.halo,
    tiled,
    layer,
    box,
    tween,
    wait,
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
    graphics(layerC) {
      const g = scene.add.graphics();
      layerC.add(g);
      return g;
    },
    /** Words drawn on the canvas, sharp at any size: made `sharp` times bigger and shown that much smaller. */
    text(layerC, str, style, sharp = kit.look.textures.textSharp) {
      const px = parseFloat(style.fontSize);
      const t = scene.add.text(0, 0, str, { ...style, fontSize: `${px * sharp}px` });
      t.setScale(1 / sharp);
      t.width1 = t.width / sharp;
      layerC.add(t);
      return t;
    },
    container(layerC, x = 0, y = 0) {
      const c = scene.add.container(x, y);
      layerC.add(c);
      return c;
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
