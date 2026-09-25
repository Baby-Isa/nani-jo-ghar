/*
 * Shared overlay-at-anchor sprites (docs/shared-api.md s5).
 *
 * One figure = a base sprite (an upper-body crop first, full body later)
 * with named anchors (head, eyes, neck, chest, hands, paws...) + layers
 * drawn at those anchors (a cap, glasses, a scarf, a trace on the paws, a
 * held item), each optionally tinted in code and patterned (dots, stripes,
 * bandhani). Who did it's suspects and Dress up's doll are the same thing:
 * base + overlays + tints. Until the art exists every piece has a greybox
 * shape, so the whole system runs with no images at all.
 *
 *   Overlay.load(json)  await Overlay.loadJSON(url?)     data/shared/overlays.json
 *   Overlay.figure(base, layers?, opts?)   a figure spec {base, layers, mirror}
 *   Overlay.wear(fig, layer, opts?)        same figure with a layer on (replacing its slot)
 *   Overlay.remove(fig, idOrSlot)
 *   Overlay.layout(fig, rect, opts?)       -> draw list [{kind, id, x, y, w, h, z, img, tint, pattern, shape, flip, anchor}]
 *   Overlay.anchorAt(fig, rect, name)      -> [x, y] on the canvas
 *   Overlay.draw(ctx, fig, rect, opts?)    canvas renderer (images if loaded, greybox otherwise)
 *   Overlay.hit(list, x, y)                the topmost layer (or base) under a point
 *   Overlay.preload(figs, opts?)           browser: resolves {src: Image} for opts.images
 *
 * rect is {x, y, w, h} on the canvas: the base is fitted inside it (contain,
 * bottom-centred, so figures stand on the same line). Anchors are
 * normalised [x, y] in the base image (0..1). A layer's pivot is the point
 * of the layer (0..1 of its own box) that sits on the anchor; its width `w`
 * is a fraction of the drawn base width. A base may nudge a layer to fit
 * its drawing: base.fit[layerId] = {dx, dy, w} (fractions of the base),
 * which is how overlays are aligned to within 4 px per base.
 *
 * Plain <script>: window.Overlay (and Shared.overlay); Node: require().
 */
(function (root, factory) {
  const O = factory(root);
  if (typeof module === "object" && module.exports) module.exports = O;
  else {
    root.Overlay = O;
    (root.Shared = root.Shared || {}).overlay = O;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const O = {};
  let DATA = { bases: {}, layers: {}, colours: {} };
  O.load = (json) => {
    DATA = Object.assign({ bases: {}, layers: {}, colours: {} }, json || {});
    return O;
  };
  O.loadJSON = async (url) => O.load(await (await fetch(url || "data/shared/overlays.json")).json());
  O.data = () => DATA;

  /** A layer's definition: exact id, or a template by prefix ("item:fru-01" -> "item:*"). */
  O.layerDef = function (id) {
    if (DATA.layers[id]) return DATA.layers[id];
    const i = id.indexOf(":");
    if (i > 0 && DATA.layers[id.slice(0, i + 1) + "*"]) return DATA.layers[id.slice(0, i + 1) + "*"];
    return null;
  };
  const colour = (c) => (c == null ? null : (DATA.colours && DATA.colours[c]) || c);
  const asLayer = (l) => (typeof l === "string" ? { id: l } : Object.assign({}, l));

  O.figure = (base, layers, opts) => Object.assign({ base, layers: (layers || []).map(asLayer), mirror: false }, opts || {});
  /** Put a layer on; anything in the same slot comes off first. */
  O.wear = function (fig, layer, opts) {
    const l = Object.assign(asLayer(layer), opts || {});
    const def = O.layerDef(l.id) || {};
    const slot = l.slot || def.slot;
    const layers = fig.layers.filter((x) => x.id !== l.id && !(slot && (x.slot || (O.layerDef(x.id) || {}).slot) === slot));
    return Object.assign({}, fig, { layers: layers.concat([l]) });
  };
  O.remove = (fig, key) => Object.assign({}, fig, { layers: fig.layers.filter((x) => x.id !== key && (x.slot || (O.layerDef(x.id) || {}).slot) !== key) });

  function baseBox(base, rect) {
    const [bw, bh] = base.size || [300, 400];
    const k = Math.min(rect.w / bw, rect.h / bh);
    const w = bw * k;
    const h = bh * k;
    return { x: rect.x + (rect.w - w) / 2, y: rect.y + rect.h - h, w, h };
  }
  O.anchorAt = function (fig, rect, name) {
    const base = DATA.bases[fig.base];
    if (!base) return null;
    const b = baseBox(base, rect);
    const a = (base.anchors || {})[name];
    if (!a) return null;
    const x = b.x + a[0] * b.w;
    return [fig.mirror ? 2 * (b.x + b.w / 2) - x : x, b.y + a[1] * b.h];
  };

  /**
   * The draw list for a figure in rect, sorted back to front. Layers whose
   * anchor the base lacks are skipped (listed in list.skipped) rather than
   * drawn somewhere wrong.
   */
  O.layout = function (fig, rect, opts) {
    opts = opts || {};
    const base = DATA.bases[fig.base];
    if (!base) throw new Error(`Overlay: no base "${fig.base}"`);
    const b = baseBox(base, rect);
    const out = [{ kind: "base", id: fig.base, img: base.img || null, shape: base.shape || "person", x: b.x, y: b.y, w: b.w, h: b.h, z: 0, tint: colour(fig.skin) || null }];
    const skipped = [];
    for (const l of fig.layers) {
      const def = O.layerDef(l.id);
      if (!def) {
        skipped.push(l.id);
        continue;
      }
      const anchor = l.anchor || def.anchor;
      const a = (base.anchors || {})[anchor];
      if (!a) {
        skipped.push(l.id);
        continue;
      }
      const fit = Object.assign({}, (base.fit || {})[l.id] || (base.fit || {})[l.id.split(":")[0] + ":*"] || {}, l.fit || {});
      const w = (fit.w != null ? fit.w : l.w != null ? l.w : def.w || 0.3) * b.w;
      const aspect = def.size ? def.size[1] / def.size[0] : def.aspect || 0.6;
      const h = w * aspect;
      const piv = def.pivot || [0.5, 0.5];
      const ax = b.x + (a[0] + (fit.dx || 0)) * b.w;
      const ay = b.y + (a[1] + (fit.dy || 0)) * b.h;
      let img = l.img || def.img || null;
      if (!img && l.id.includes(":") && opts.itemImage) img = opts.itemImage(l.id.slice(l.id.indexOf(":") + 1)) || null;
      out.push({
        kind: "layer",
        id: l.id,
        anchor,
        img,
        shape: def.shape || "rect",
        x: ax - piv[0] * w,
        y: ay - piv[1] * h,
        w,
        h,
        z: l.z != null ? l.z : def.z != null ? def.z : 10,
        tint: def.tint || l.tint ? colour(l.tint || def.defaultTint || null) : null,
        pattern: l.pattern || null,
        label: l.label || (l.id.includes(":") ? l.id.slice(l.id.indexOf(":") + 1) : null),
      });
    }
    if (fig.mirror) {
      const cx = b.x + b.w / 2;
      for (const e of out) {
        e.x = 2 * cx - e.x - e.w;
        e.flip = true;
      }
    }
    out.sort((p, q) => p.z - q.z);
    out.skipped = skipped;
    return out;
  };

  /** Topmost entry whose box holds (x, y); pass kinds to limit (e.g. ["layer"]). */
  O.hit = function (list, x, y, kinds) {
    for (let i = list.length - 1; i >= 0; i--) {
      const e = list[i];
      if (kinds && !kinds.includes(e.kind)) continue;
      if (x >= e.x && x <= e.x + e.w && y >= e.y && y <= e.y + e.h) return e;
    }
    return null;
  };

  /* ------------------------------------------------------- drawing */
  const GREY = { base: "#cbbfae", line: "#6e5f4d", layer: "#9d8f7c" };
  function pattern(ctx, e, kind) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.strokeStyle = "rgba(255,255,255,.75)";
    ctx.lineWidth = Math.max(1, e.w / 30);
    const step = Math.max(4, e.w / 8);
    if (kind === "stripes") {
      for (let x = e.x - e.h; x < e.x + e.w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, e.y + e.h);
        ctx.lineTo(x + e.h, e.y);
        ctx.stroke();
      }
    } else {
      // dots, bandhani and anything else: a dot grid (bandhani's tie-dye dots)
      const r = kind === "bandhani" ? step / 5 : step / 4;
      for (let y = e.y + step / 2; y < e.y + e.h; y += step)
        for (let x = e.x + step / 2; x < e.x + e.w; x += step) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
    }
    ctx.restore();
  }
  /** Greybox shapes: enough to read the figure and every overlay with no art. */
  function shapePath(ctx, e) {
    const { x, y, w, h } = e;
    ctx.beginPath();
    switch (e.shape) {
      case "person":
        ctx.arc(x + w / 2, y + h * 0.25, w * 0.2, 0, Math.PI * 2);
        ctx.moveTo(x + w * 0.1, y + h);
        ctx.quadraticCurveTo(x + w * 0.12, y + h * 0.5, x + w / 2, y + h * 0.5);
        ctx.quadraticCurveTo(x + w * 0.88, y + h * 0.5, x + w * 0.9, y + h);
        ctx.closePath();
        break;
      case "cat":
        ctx.ellipse(x + w / 2, y + h * 0.65, w * 0.35, h * 0.3, 0, 0, Math.PI * 2);
        ctx.moveTo(x + w * 0.72, y + h * 0.25);
        ctx.arc(x + w / 2, y + h * 0.25, w * 0.22, 0, Math.PI * 2);
        ctx.moveTo(x + w * 0.3, y + h * 0.12);
        ctx.lineTo(x + w * 0.36, y);
        ctx.lineTo(x + w * 0.44, y + h * 0.08);
        ctx.moveTo(x + w * 0.56, y + h * 0.08);
        ctx.lineTo(x + w * 0.64, y);
        ctx.lineTo(x + w * 0.7, y + h * 0.12);
        break;
      case "arc": // a cap
        ctx.moveTo(x, y + h);
        ctx.quadraticCurveTo(x + w / 2, y - h, x + w, y + h); // peaks at the box's top
        ctx.closePath();
        break;
      case "glasses":
        ctx.arc(x + w * 0.25, y + h / 2, Math.min(w * 0.22, h / 2), 0, Math.PI * 2);
        ctx.moveTo(x + w * 0.97, y + h / 2);
        ctx.arc(x + w * 0.75, y + h / 2, Math.min(w * 0.22, h / 2), 0, Math.PI * 2);
        ctx.moveTo(x + w * 0.47, y + h / 2);
        ctx.lineTo(x + w * 0.53, y + h / 2);
        break;
      case "smudge":
        ctx.ellipse(x + w * 0.3, y + h / 2, w * 0.25, h * 0.35, 0.3, 0, Math.PI * 2);
        ctx.moveTo(x + w * 0.95, y + h / 2);
        ctx.ellipse(x + w * 0.7, y + h / 2, w * 0.25, h * 0.35, -0.3, 0, Math.PI * 2);
        break;
      case "rings":
        for (let i = 0; i < 3; i++) {
          ctx.moveTo(x + w * (0.2 + i * 0.3) + w * 0.14, y + h / 2);
          ctx.ellipse(x + w * (0.2 + i * 0.3), y + h / 2, w * 0.14, h * 0.45, 0, 0, Math.PI * 2);
        }
        break;
      default: // rect, item
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, Math.min(w, h) * 0.2);
        else ctx.rect(x, y, w, h);
    }
  }
  function drawGrey(ctx, e) {
    ctx.save();
    ctx.fillStyle = e.tint || (e.kind === "base" ? GREY.base : GREY.layer);
    ctx.strokeStyle = GREY.line;
    ctx.lineWidth = Math.max(1.5, e.w / 60);
    shapePath(ctx, e);
    if (e.shape === "glasses") ctx.stroke();
    else {
      ctx.fill();
      ctx.stroke();
    }
    if (e.pattern) {
      shapePath(ctx, e);
      ctx.clip();
      pattern(ctx, e, e.pattern);
    }
    if (e.shape === "item" && e.label) {
      ctx.fillStyle = GREY.line;
      ctx.font = `${Math.max(9, Math.round(e.h / 4))}px system-ui,sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(e.label, e.x + e.w / 2, e.y + e.h / 2);
    }
    ctx.restore();
  }
  function makeCanvas(w, h, opts) {
    if (opts.makeCanvas) return opts.makeCanvas(w, h);
    if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(w, h);
    const d = root && root.document;
    if (!d) return null;
    const c = d.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }
  /** A neutral sprite tinted in code: multiply the colour over it, keep its alpha, then any pattern. */
  function drawTinted(ctx, e, img, opts) {
    const W = Math.max(1, Math.round(e.w));
    const H = Math.max(1, Math.round(e.h));
    const c = makeCanvas(W, H, opts);
    if (!c) return ctx.drawImage(img, e.x, e.y, e.w, e.h);
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, W, H);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = e.tint;
    g.fillRect(0, 0, W, H);
    if (e.pattern) {
      g.globalCompositeOperation = "source-over";
      pattern(g, { x: 0, y: 0, w: W, h: H }, e.pattern);
    }
    g.globalCompositeOperation = "destination-in";
    g.drawImage(img, 0, 0, W, H);
    ctx.drawImage(c, e.x, e.y, e.w, e.h);
  }
  /**
   * Draw a figure. opts: {images: {src: loaded Image}, itemImage(wordId) ->
   * src, makeCanvas(w, h) (tests), list (a layout already made)}. Anything
   * whose image isn't loaded is drawn as its greybox shape. Returns the
   * draw list (for hit-testing).
   */
  O.draw = function (ctx, fig, rect, opts) {
    opts = opts || {};
    const list = opts.list || O.layout(fig, rect, opts);
    const images = opts.images || {};
    for (const e of list) {
      const img = e.img && images[e.img];
      const ready = img && (img.complete === undefined || img.complete) && (img.naturalWidth === undefined || img.naturalWidth > 0);
      if (!ready) {
        drawGrey(ctx, e);
        continue;
      }
      ctx.save();
      if (e.flip) {
        ctx.translate(e.x + e.w / 2, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(e.x + e.w / 2), 0);
      }
      if (e.tint && e.kind === "layer") drawTinted(ctx, e, img, opts);
      else ctx.drawImage(img, e.x, e.y, e.w, e.h);
      ctx.restore();
    }
    return list;
  };

  /** Browser: load every image the figures use. Resolves {src: Image}; missing files stay greybox. */
  O.preload = function (figs, opts) {
    opts = opts || {};
    const srcs = new Set();
    for (const f of figs) {
      for (const e of O.layout(f, { x: 0, y: 0, w: 100, h: 100 }, opts)) if (e.img) srcs.add(e.img);
    }
    const images = opts.images || {};
    return Promise.all(
      Array.from(srcs)
        .filter((s) => !images[s])
        .map(
          (src) =>
            new Promise((res) => {
              const im = new Image();
              im.onload = () => {
                images[src] = im;
                res();
              };
              im.onerror = () => res();
              im.src = src;
            }),
        ),
    ).then(() => images);
  };

  return O;
});
