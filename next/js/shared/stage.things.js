/*
 * The things the stage draws on its canvas, by art id: a picture and its handle, a mechanic's clipped box, a made image,
 * a repeated strip, lines and shapes, words, and a plain group. Only the stage calls this (its fitting, views and taps
 * stay in stage.js); a game reaches these through the stage.
 *
 *   const things = createThings({ scene, art, kit, views, dpr, load, tween, wait, ticks })
 *   things.wrap(obj, ref, mirror, size?) -> handle    things.picture(layer, ref, opts) -> handle    things.box(parent, rect)
 *   things.image(layer, key, o)   things.tiled(layer, ref, rect)   things.graphics(layer)   things.text(layer, str, style)
 *   things.container(layer, x, y)   things.sharpen()   the canvas's words drawn again at the views' scale now
 */
function originOf(art, ref, mirror) {
  const [w, h] = art.size(ref) || [1, 1];
  let cx = art.meta(ref, "cx");
  let cy = art.meta(ref, "cy");
  if (cx == null || cy == null) return [0.5, 0.5];
  if (cx <= 1 && cy <= 1) [cx, cy] = [cx * w, cy * h];
  return [mirror ? (w - cx) / w : cx / w, cy / h];
}

export function createThings({ scene, art, kit, views, dpr, load, tween, wait, ticks }) {
  // the canvas's words drawn at the screen's own pixels (a little over), so they are never shrunk several times and grainy
  const texts = new Set();
  function sharpen(t) {
    const k = Math.max(...Object.values(views).map((v) => v.s || 0)) * dpr * kit.look.textures.textSharp;
    t.setFontSize(`${t.px * k}px`).setScale(1 / k);
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

  function graphics(layerC) {
    const g = scene.add.graphics();
    layerC.add(g);
    return g;
  }
  /** Words drawn on the canvas, sharp at any size: drawn at the screen's pixels and shown at their size (width1: design px). */
  function text(layerC, str, style) {
    const t = scene.add.text(0, 0, str, style);
    t.px = parseFloat(style.fontSize);
    t.width1 = t.width;
    sharpen(t);
    texts.add(t);
    t.once("destroy", () => texts.delete(t));
    layerC.add(t);
    return t;
  }
  function container(layerC, x = 0, y = 0) {
    const c = scene.add.container(x, y);
    layerC.add(c);
    return c;
  }

  return { wrap, picture, box, image, tiled, graphics, text, container, sharpen: () => texts.forEach(sharpen) };
}
