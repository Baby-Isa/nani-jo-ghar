/*
 * The grill kit (Sprint 19, wave B; CK-67, SEK-20 option 3, Zafar 9 Nov: "this just becomes the exact way we do it for everything that
 * needs gridding ... the same two tray setup ... Cooked and uncooked, same barbecue, same grill ... barbecue fish ... steak"): ONE
 * layout and one set of moves for every grilled recipe. Corn uses it now; sekelo moves onto it when its skewer pieces land; fish and
 * steak later. Nothing here names a recipe: a game passes its own pictures, its own counts and its own words.
 *
 * The layout is option 3, two by two (build/tools/art/sekelo_layouts.py opt3s; sources/art/s19-mini/refs/G2-skewer-layout-guide.jpg):
 * the raw things lie two by two on the stone band along the bottom; the grill (kit/grill) big on the left above it; the cooked tray
 * (kit/tray-steel) on its right. A thing grows as it goes up onto the grill and turns upright, its ends resting on the grill's far and
 * near rims (Zafar, 9 Nov: "the metal tip ... rest on the far end ... and the wooden handle ... on the near edge"); it is turned where it
 * lies; lifted off, it shrinks into the tray, lying two by two as on the band. Every place is in the 1600 x 900 design box, inside
 * x 150-1450 (the narrowest play area, 1920x1080, shows that much: the stage fits by height). Shadows are drawn in code, one light from
 * the upper left (down and to the right), a soft copy of the thing's own outline that follows it.
 *
 *   GK.ART                                   the kit's pictures and where their rims are (fractions, measured from the art)
 *   GK.art() -> [[key, url]]                 what to load (with the game's own pictures, behind the order)
 *   GK.layout(o) -> L                        the places, design px. o: {thick (a thing's thickness over its length), n (places on
 *                                            the grill, 4), band (Shelf.BAND), view ([l, r]), ringRoom, gap, trayW, bandLen}
 *     L.grill {x, y, w, h, far, near, len, at(i, n) -> {x, y}}   its centre and size; far, near: its rims' y; len: a thing's length
 *                                            on it (rim to rim); at: the i-th of n places across its coal bed (upright)
 *     L.tray {x, y, w, h, len, at(i) -> {x, y}}     the cooked tray; len: a thing's length lying in it; at: its two by two places
 *     L.band {len, at(i) -> {x, y}}           the raw things lying two by two on the band
 *     L.ring(p) -> {x, y, r}                  a thing's heat ring above its top end, on the grill
 *   GK.build(S, L, {depth}) -> {grill, tray} the grill and the tray, with their soft shadows
 *   GK.lay(img, {x, y, len, up, natural})    put a long thing at a place, len long, lying (up false) or upright (up true); natural:
 *                                            its length at scale 1 where that is not its picture's width (a skewer built in code)
 *   GK.move(S, img, {x, y, len, up, ms, ease, natural}) -> Promise   the same as a move: it grows or shrinks and turns on the way
 *   GK.roll(S, img, key, {ms, k}) -> Promise turned over where it lies: squashed across, the new picture, back
 *   GK.shadow(S, img, {dx, dy, alpha, blur}) -> image   a soft shadow following img (moved, scaled, turned, faded, hidden)
 *
 * A long thing's picture lies along its x (its length is the picture's width); upright is turned -90 degrees (its right end up).
 */
import { Cook as CookNS } from "./ns.js";

(function (global) {
  const Cook = CookNS;
  const D = Cook.D;
  const K4 = "assets/cook/items/v4/kit/";
  const GK = {};

  /**
   * The kit's pictures (the full art run's G1-2 grill, its shadow cut away so code draws it; K3's brushed-steel tray). far, near: the
   * grill's far (top) and near (bottom) rims' middles, as shares of its height; bed: its coal bed's left and right, shares of its width;
   * tray inner: its well's inset, shares of its width and
   * height.
   */
  GK.ART = {
    grill: { key: "gk-grill", url: K4 + "grill.webp", w: 1621, h: 813, far: 0.022, near: 0.972, bed: [0.105, 0.895] },
    tray: { key: "gk-tray", url: K4 + "tray-steel.webp", w: 1000, h: 422, inner: [0.05, 0.11] },
  };
  GK.art = () => [GK.ART.grill, GK.ART.tray].map((a) => [a.key, a.url]);

  /** The places (design px). thick: a thing's thickness over its length (corn's cob 0.18). */
  GK.layout = function ({ thick = 0.18, n = 4, band, view = [150, 1450], ringRoom = 92, gap = 44, trayW = 400, bandLen = 300, top = 18 } = {}) {
    const B = band || (global.Shelf && global.Shelf.BAND) || { top: 630, bottom: 900 };
    const G = GK.ART.grill;
    const T = GK.ART.tray;
    const viewW = view[1] - view[0];
    // the grill as big as the room allows: the view's width less the tray's, the band's top less the rings' room above it
    const gw0 = viewW - gap - trayW;
    const room = B.top - top - ringRoom - 22;
    const gh = Math.min(room, (gw0 * G.h) / G.w);
    const gw = (gh * G.w) / G.h;
    const tw = viewW - gap - gw;
    const th = (tw * T.h) / T.w;
    const left = view[0] + (viewW - gw - gap - tw) / 2;
    // (in the middle of the room between the rings' room and the band)
    const gy = (top + ringRoom + B.top - 22) / 2;
    const gx = left + gw / 2;
    const far = gy - gh / 2 + G.far * gh;
    const near = gy - gh / 2 + G.near * gh;
    const len = near - far;
    const bed0 = gx - gw / 2 + G.bed[0] * gw;
    const bed1 = gx - gw / 2 + G.bed[1] * gw;
    const grill = {
      x: gx,
      y: gy,
      w: gw,
      h: gh,
      far,
      near,
      len,
      // (the i-th of n upright places, spread evenly across the coal bed, every place the same whatever n is: four always fit)
      at: (i, m = n) => {
        const step = (bed1 - bed0) / Math.max(1, m);
        return { x: bed0 + step * (i + 0.5), y: (far + near) / 2 };
      },
    };
    const tx = left + gw + gap + tw / 2;
    const ty = gy;
    const iw = tw * (1 - 2 * T.inner[0]);
    const ih = th * (1 - 2 * T.inner[1]);
    // two by two, lying: each cell half the well, the thing as long as its cell allows (and its thickness its row)
    const tlen = Math.min((iw / 2) * 0.9, ((ih / 2) * 0.86) / Math.max(0.05, thick));
    const tray = { x: tx, y: ty, w: tw, h: th, len: tlen, at: (i) => ({ x: tx + (i % 2 ? 1 : -1) * (iw / 4), y: ty + (i < 2 ? -1 : 1) * (ih / 4) }) };
    // the band: two rows, two places each, about the middle of the view
    const bh = (B.bottom || 900) - B.top;
    const bandRow = (r) => B.top + bh * (r ? 0.69 : 0.31);
    const blen = Math.min(bandLen, (bh * 0.32) / Math.max(0.05, thick), viewW * 0.36);
    const mid = (view[0] + view[1]) / 2;
    const bcol = Math.min(viewW * 0.25, blen / 2 + 70);
    const bandAt = (i) => ({ x: mid + (i % 2 ? 1 : -1) * bcol, y: bandRow(i < 2 ? 0 : 1) });
    return {
      grill,
      tray,
      band: { len: blen, at: bandAt },
      ring: (p) => ({ x: p.x, y: far - 46, r: 34 }),
    };
  };

  /** The grill and the tray, with their soft shadows. */
  GK.build = function (S, L, { depth = D.item - 1 } = {}) {
    const T = (o) => S.track(o);
    const out = {};
    if (S.textures.exists(GK.ART.grill.key)) {
      const g = T(S.add.image(L.grill.x, L.grill.y, GK.ART.grill.key).setDepth(depth));
      g.setScale(L.grill.h / g.height);
      GK.shadow(S, g, { dx: 12, dy: 16, alpha: 0.3, blur: 12 });
      out.grill = g;
    }
    if (S.textures.exists(GK.ART.tray.key)) {
      const t = T(S.add.image(L.tray.x, L.tray.y, GK.ART.tray.key).setDepth(depth));
      t.setScale(L.tray.w / t.width);
      GK.shadow(S, t, { dx: 8, dy: 11, alpha: 0.26, blur: 8 });
      out.tray = t;
    }
    return out;
  };

  /** A long thing put at a place: len long (its picture's width), lying (up false) or upright (up true, its right end up). */
  GK.lay = function (img, { x, y, len, up = false, natural }) {
    const k = len / Math.max(1, natural || img.width);
    img.setPosition(x, y).setScale(k).setAngle(up ? -90 : 0);
    return img;
  };
  /** The same as a move: it grows or shrinks, and turns, on the way (a game's own tween; resolves when it lands). */
  GK.move = function (S, img, { x, y, len, up = false, ms = 460, ease = "Cubic.easeInOut", natural }) {
    const k = len / Math.max(1, natural || img.width);
    const tween = Cook.tween ? (cfg) => Cook.tween(S, cfg) : (cfg) => new Promise((r) => S.tweens.add(Object.assign({}, cfg, { onComplete: r })));
    return tween({ targets: img, x, y, scaleX: k, scaleY: k, angle: up ? -90 : 0, duration: ms, ease });
  };
  /** Turned over where it lies: squashed across its length (its picture's height), the other face, back (a small roll). */
  GK.roll = async function (S, img, key, { ms = 140, k = 0.55 } = {}) {
    const tween = (cfg) => (Cook.tween ? Cook.tween(S, cfg) : new Promise((r) => S.tweens.add(Object.assign({}, cfg, { onComplete: r }))));
    const sy = img.scaleY;
    await tween({ targets: img, scaleY: sy * k, duration: ms, ease: "Sine.easeIn" });
    if (key && S.textures.exists(key)) img.setTexture(key);
    await tween({ targets: img, scaleY: sy, duration: ms, ease: "Sine.easeOut" });
  };

  /**
   * A soft shadow under a picture (one light, upper left: down and to the right; the bible's rule at about half the mock's weight):
   * the picture's own outline, blurred and a little see-through, made on a canvas (so it draws without tints, in either renderer),
   * following the picture until it goes. o: dx, dy (world px), alpha, blur (world px).
   */
  GK.shadow = function (S, img, { dx = 8, dy = 10, alpha = 0.26, blur = 6 } = {}) {
    if (!img || !img.texture || !S.textures) return null;
    const key = img.texture.key;
    const k = Math.max(0.01, Math.abs(img.scaleX) || 1);
    const b = Math.max(1, Math.round(blur / k));
    const sk = `${key}:shade:${b}`;
    const src = S.textures.get(key).getSourceImage();
    const pad = b * 3;
    if (!S.textures.exists(sk)) {
      const c = document.createElement("canvas");
      c.width = src.width + 2 * pad;
      c.height = src.height + 2 * pad;
      const g = c.getContext("2d");
      g.filter = `blur(${b}px)`;
      g.drawImage(src, pad, pad);
      g.filter = "none";
      g.globalCompositeOperation = "source-in";
      // (the shade colour, a token: one shade for every shadow)
      const TK = global.Tokens;
      g.fillStyle = TK && TK.rgb ? `rgb(${TK.rgb("shade-rgb") || "60, 35, 20"})` : "black";
      g.fillRect(0, 0, c.width, c.height);
      S.textures.addCanvas(sk, c);
    }
    const sh = S.track(S.add.image(img.x + dx, img.y + dy, sk));
    sh.setOrigin((pad + img.originX * src.width) / (src.width + 2 * pad), (pad + img.originY * src.height) / (src.height + 2 * pad));
    // (a thing that changes its picture keeps the first one's outline: every state of one thing shares one canvas, ART-08)
    const follow = () => {
      if (!img.active || !sh.active) return;
      sh.setPosition(img.x + dx, img.y + dy).setScale(img.scaleX, img.scaleY).setRotation(img.rotation).setDepth(img.depth - 0.05);
      sh.setVisible(img.visible && !sh.lifted).setAlpha(alpha * img.alpha);
    };
    follow();
    S.events.on("update", follow);
    img.once("destroy", () => {
      S.events.off("update", follow);
      if (sh.active) sh.destroy();
    });
    img.shadow = sh;
    return sh;
  };

  Cook.GrillKit = GK;
})(window);
