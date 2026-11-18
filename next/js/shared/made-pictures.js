/*
 * The pictures the stage makes from the art rather than loads: a picture's soft gold halo, a face as a round badge, the
 * soft contact shadow under a standing thing, a flat thing's shadow in its own shape, and a shape in one colour. Like the
 * outlines (outline.js) they are read from loaded pictures and kept as textures, so each is made once. Only the stage
 * calls this; a game never does.
 *
 *   const m = createMadePictures({ scene, art, kit, outlines, wrap })    wrap(obj): the stage's handle on a picture
 *   m.halo(ref) -> { key, pad, k }   m.badge(ref) -> key   m.shadow(layer, { x, y, w, h })
 *   m.shapeShadow(layer, ref, { x, y, w })   m.silhouette(layer, ref, colour, { x, y, w, alpha })
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

  return { halo, badge, shapeShadow, silhouette, shadow };
}
