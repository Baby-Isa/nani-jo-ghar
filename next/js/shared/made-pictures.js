/*
 * The pictures the stage makes from the art rather than loads: a picture's soft gold halo, a face as a round badge, the
 * soft contact shadow under a standing thing, a flat thing's shadow in its own shape, a shape in one colour, and a thing
 * lying in a liquid. Like the outlines (outline.js) they are read from loaded pictures and kept as textures, so each is
 * made once. Only the stage calls this; a game never does.
 *
 *   const m = createMadePictures({ scene, art, kit, outlines, wrap })    wrap(obj): the stage's handle on a picture
 *   m.halo(ref) -> { key, pad, k }   m.badge(ref) -> key   m.shadow(layer, { x, y, w, h })
 *   m.shapeShadow(layer, ref, { x, y, w })   m.silhouette(layer, ref, colour, { x, y, w, alpha })
 *   m.wet(ref, liquid, W) -> { key, pad, w }   a thing lying in a liquid: its wet ring under it, the liquid over its foot
 */
export function createMadePictures({ scene, art, kit, outlines, wrap }) {
  /** A picture's own outline as a soft halo: tinted copies laid in a ring, so it needs no filter. Returns { key, pad }. */
  function halo(ref) {
    const H = kit.look.halo;
    const key = `halo:${art.key(ref)}`;
    const src = scene.textures.get(art.key(ref)).getSourceImage();
    const k = Math.min(1, kit.look.textures.halo / Math.max(src.width, src.height)); // a halo is soft: a small copy is enough
    const [w, h] = [Math.ceil(src.width * k), Math.ceil(src.height * k)];
    const pad = Math.ceil(H.spread * kit.look.textures.haloPad);
    if (scene.textures.exists(key)) return { key, pad, k };
    const one = document.createElement("canvas");
    [one.width, one.height] = [w, h];
    const a = one.getContext("2d");
    a.drawImage(src, 0, 0, w, h);
    a.globalCompositeOperation = "source-in";
    a.fillStyle = H.color;
    a.fillRect(0, 0, w, h);
    const cv = scene.textures.createCanvas(key, w + 2 * pad, h + 2 * pad);
    const c = cv.getContext();
    c.globalAlpha = H.alpha;
    for (let i = 0; i < H.copies; i++) {
      const r = H.spread * H.rings[i % H.rings.length];
      c.drawImage(one, pad + Math.cos((i * 2 * Math.PI) / H.copies) * r, pad + Math.sin((i * 2 * Math.PI) / H.copies) * r);
    }
    c.globalAlpha = 1;
    cv.refresh();
    return { key, pad, k };
  }

  /** A person's face as a round badge: the face cut to a circle on a white disc with a white rim and a hairline. */
  function badge(ref) {
    const key = `badge:${art.key(ref)}`;
    if (scene.textures.exists(key)) return key;
    const src = scene.textures.get(art.key(ref)).getSourceImage();
    const d = kit.look.textures.badge;
    const cv = scene.textures.createCanvas(key, d, d);
    const c = cv.getContext();
    const rim = kit.look.badgeRim * d;
    c.fillStyle = kit.look.badgeDisc;
    c.beginPath();
    c.arc(d / 2, d / 2, d / 2 - 1, 0, 2 * Math.PI);
    c.fill();
    c.save();
    c.beginPath();
    c.arc(d / 2, d / 2, d / 2 - rim, 0, 2 * Math.PI);
    c.clip();
    c.drawImage(src, rim, rim, d - 2 * rim, d - 2 * rim);
    c.restore();
    c.strokeStyle = kit.look.badgeLine;
    c.lineWidth = kit.look.textures.badgeLine;
    c.beginPath();
    c.arc(d / 2, d / 2, d / 2 - 1, 0, 2 * Math.PI);
    c.stroke();
    cv.refresh();
    return key;
  }

  /** The soft contact shadow every standing thing casts, from one light at the upper left. */
  function shadowKey() {
    const key = "kit:shadow";
    if (scene.textures.exists(key)) return key;
    const d = kit.look.textures.shadow;
    const cv = scene.textures.createCanvas(key, d, d);
    const c = cv.getContext();
    const g = c.createRadialGradient(d / 2, d / 2, 0, d / 2, d / 2, d / 2);
    const [r, gg, b] = kit.look.shadowRgb;
    g.addColorStop(0, `rgba(${r},${gg},${b},${kit.look.shadowMid})`);
    g.addColorStop(kit.look.textures.shadowMidAt, `rgba(${r},${gg},${b},${kit.look.shadowEdge})`);
    g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    c.fillStyle = g;
    c.fillRect(0, 0, d, d);
    cv.refresh();
    return key;
  }
  /**
   * A flat thing's soft shadow in its own shape (the hob, the serving tray), from the standing things' light: placed as the
   * picture is, { x, y } its top-left and w its width, moved right and down by look.boxShadow's shares of its shorter side.
   */
  function shapeShadow(layerC, ref, { x, y, w }) {
    const B = kit.look.boxShadow;
    const { key, pad, w: tw } = outlines.shadowKey(ref);
    const [pw, ph] = art.size(ref);
    const k = w / tw;
    const m = Math.min(w, (w * ph) / pw);
    const obj = scene.add.image(x - pad * k + B.dx * m, y - pad * k + B.dy * m, key).setOrigin(0, 0).setScale(k);
    layerC.add(obj);
    return wrap(obj, null, false);
  }
  /** A picture's shape in one colour, placed as the picture is (its top-left, its width): a dimming that follows its edges. */
  function silhouette(layerC, ref, colour, { x, y, w, alpha = 1 }) {
    const { key, w: tw } = outlines.shapeKey(ref, colour);
    const obj = scene.add.image(x, y, key).setOrigin(0, 0).setScale(w / tw).setAlpha(alpha);
    layerC.add(obj);
    return wrap(obj, null, false);
  }
  /** A shadow under a footprint { x, y, w, h } (its middle and size): a touch right and down, as the light asks. */
  function shadow(layerC, f) {
    const obj = scene.add.image(f.x + f.w * kit.look.shadowDx, f.y + f.h * kit.look.shadowDy, shadowKey());
    obj.setDisplaySize(f.w * kit.look.textures.shadowFit[0], f.h * kit.look.textures.shadowFit[1]);
    layerC.add(obj);
    return wrap(obj, null, false);
  }

  /**
   * A thing lying in a liquid (a spoonful on the tea), so it reads as in it, not stuck on top: its own soft wet ring under
   * it (its shape's blurred shadow, a touch down and right, as the light asks) and the liquid's colour over its lower part,
   * fading in from the thing's own middle down. W, the game's numbers: texture (the working copy's longer side, px), ring
   * { blur, dx, dy (shares of the picture's width), alpha }, tint { from (a share of the thing's own height), alpha }.
   * liquid: its colour, "#rrggbb", or null for a dry floor (no liquid over it: only its ring, as a soft contact shadow).
   * Made once for each picture and liquid. Returns { key, pad, w } (texture px: the room
   * round the picture, and the picture's width in it).
   */
  function wet(ref, liquid, W) {
    const key = `kit:wet:${liquid || "dry"}:${art.key(ref)}`;
    const src = scene.textures.get(art.key(ref)).getSourceImage();
    const k = Math.min(1, W.texture / Math.max(src.width, src.height));
    const [tw, th] = [Math.max(1, Math.round(src.width * k)), Math.max(1, Math.round(src.height * k))];
    const R = W.ring;
    const pad = Math.ceil(2 * R.blur * tw + Math.max(Math.abs(R.dx), Math.abs(R.dy)) * tw);
    if (scene.textures.exists(key)) return { key, pad, w: tw };
    const cv = scene.textures.createCanvas(key, tw + 2 * pad, th + 2 * pad);
    const c = cv.getContext();
    const [r, g, b] = kit.look.shadowRgb;
    // the ring: only the shape's blurred shadow lands (the shape itself is drawn off the canvas)
    const off = tw + 2 * pad;
    Object.assign(c, { shadowColor: `rgba(${r},${g},${b},${R.alpha})`, shadowBlur: R.blur * tw, shadowOffsetX: off + R.dx * tw, shadowOffsetY: R.dy * tw });
    c.drawImage(src, pad - off, pad, tw, th);
    Object.assign(c, { shadowColor: "rgba(0,0,0,0)", shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0 });
    // the thing, the liquid laid over its lower part (on a copy, so the liquid falls on the thing only)
    const one = document.createElement("canvas");
    [one.width, one.height] = [tw, th];
    const a = one.getContext("2d");
    a.drawImage(src, 0, 0, tw, th);
    if (liquid) {
      const box = outlines.thingBox(ref);
      const [y0, y1] = [(box.y + box.h * W.tint.from) * th, (box.y + box.h) * th];
      const n = parseInt(liquid.slice(1), 16);
      const rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
      const grad = a.createLinearGradient(0, y0, 0, Math.max(y1, y0 + 1));
      grad.addColorStop(0, `rgba(${rgb},0)`);
      grad.addColorStop(1, `rgba(${rgb},${W.tint.alpha})`);
      a.globalCompositeOperation = "source-atop";
      a.fillStyle = grad;
      a.fillRect(0, y0, tw, th - y0);
    }
    c.drawImage(one, pad, pad);
    cv.refresh();
    return { key, pad, w: tw };
  }

  return { halo, badge, shapeShadow, silhouette, shadow, wet };
}
