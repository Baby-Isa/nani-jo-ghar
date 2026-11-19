/*
 * A picture's own outline, read from its pixels, for the stage: where it is solid (so a thing stands on what is drawn, not
 * on its picture's empty margin, and a bubble clears a cap), its soft shadow in its own shape (so the hob's and the tray's
 * rounded corners cast round shadows), and a flat copy of its shape in one colour (the tray's dimming, never a square
 * corner past its rounded one). Only the stage calls this; a game never does.
 *
 *   const o = createOutlines({ scene, art, kit })
 *   o.solid(ref) -> { bottom, top(from?, to?), left, right }   bottom, top: shares of its height (top's band of columns
 *       as shares of its width); left, right: its first and last solid columns' edges, shares of its width
 *   o.thingBox(ref) -> { x, y, w, h }   the thing as drawn, without its picture's empty margin: shares of its picture
 *   o.shadowKey(ref) -> { key, pad }    o.shapeKey(ref, colour) -> key     textures the size of kit.look.textures.outline
 */
export function createOutlines({ scene, art, kit }) {
  const L = kit.look;
  const solids = new Map();
  const srcOf = (ref) => scene.textures.get(art.key(ref)).getSourceImage();
  // the working copy's size: the picture brought down so its longer side is at most this
  const sizeOf = (src, most) => {
    const k = Math.min(1, most / Math.max(src.width, src.height));
    return [Math.max(1, Math.round(src.width * k)), Math.max(1, Math.round(src.height * k))];
  };

  /** Where a picture is solid (a pixel at least look.solidAlpha opaque), measured once; a picture that cannot be read is solid edge to edge. */
  function solid(ref) {
    const key = art.key(ref);
    if (solids.has(key)) return solids.get(key);
    const src = srcOf(ref);
    const [w, h] = sizeOf(src, L.textures.solid);
    const cols = new Float32Array(w).fill(0);
    let bottom = 1;
    let [left, right] = [0, 1];
    try {
      const c = document.createElement("canvas");
      [c.width, c.height] = [w, h];
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(src, 0, 0, w, h);
      const d = g.getImageData(0, 0, w, h).data;
      const on = (x, y) => d[(y * w + x) * 4 + 3] >= L.solidAlpha;
      // (a column with nothing solid in it is left out of the top: it is the picture's empty side)
      for (let x = 0; x < w; x++) {
        cols[x] = 1;
        for (let y = 0; y < h; y++) if (on(x, y)) { cols[x] = y / h; break; }
      }
      search: for (let y = h - 1; y >= 0; y--) for (let x = 0; x < w; x++) if (on(x, y)) { bottom = (y + 1) / h; break search; }
      const filled = [...cols.keys()].filter((x) => cols[x] < 1);
      if (filled.length) [left, right] = [filled[0] / w, (filled[filled.length - 1] + 1) / w];
    } catch (e) {
      cols.fill(0); // (unreadable: its own top edge, so nothing is drawn taller than its picture or placed from its feet)
    }
    const out = {
      bottom,
      left,
      right,
      // (a band with nothing solid in it: its picture's own top)
      top: (from = 0, to = 1) => {
        const t = Math.min(1, ...cols.slice(Math.max(0, Math.floor(from * w)), Math.max(1, Math.ceil(to * w))));
        return t >= 1 ? 0 : t;
      },
    };
    solids.set(key, out);
    return out;
  }

  /**
   * The soft shadow of a flat thing in its own shape, from the standing things' light (look.boxShadow: its blur as a share of
   * the shorter side, its strength). The picture is drawn off the canvas so only its blurred shadow lands. pad: the texture's
   * room round the picture, in the texture's px.
   */
  function shadowKey(ref) {
    const B = L.boxShadow;
    const key = `kit:shape-shadow:${art.key(ref)}`;
    const src = srcOf(ref);
    const [tw, th] = sizeOf(src, L.textures.outline);
    const blur = B.blur * Math.min(tw, th);
    const pad = Math.ceil(blur * B.padOfBlur);
    if (!scene.textures.exists(key)) {
      const cv = scene.textures.createCanvas(key, tw + 2 * pad, th + 2 * pad);
      const c = cv.getContext();
      const [r, g, b] = L.shadowRgb;
      const off = tw + 2 * pad;
      Object.assign(c, { shadowColor: `rgba(${r},${g},${b},${B.alpha})`, shadowBlur: blur, shadowOffsetX: off });
      c.drawImage(src, pad - off, pad, tw, th);
      cv.refresh();
    }
    return { key, pad, w: tw };
  }

  /** The picture's shape in one colour (its own alpha kept), at the same working size. */
  function shapeKey(ref, colour) {
    const key = `kit:shape:${colour}:${art.key(ref)}`;
    if (scene.textures.exists(key)) return { key, w: scene.textures.get(key).getSourceImage().width };
    const src = srcOf(ref);
    const [tw, th] = sizeOf(src, L.textures.outline);
    const cv = scene.textures.createCanvas(key, tw, th);
    const c = cv.getContext();
    c.drawImage(src, 0, 0, tw, th);
    c.globalCompositeOperation = "source-in";
    c.fillStyle = colour;
    c.fillRect(0, 0, tw, th);
    cv.refresh();
    return { key, w: tw };
  }

  /** The thing's own box in its picture (where it is solid), as shares of the picture's width and height. */
  function thingBox(ref) {
    const o = solid(ref);
    const top = o.top();
    return { x: o.left, y: top, w: o.right - o.left, h: o.bottom - top };
  }

  return { solid, thingBox, shadowKey, shapeKey };
}
