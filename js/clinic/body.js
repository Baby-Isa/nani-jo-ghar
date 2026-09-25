/*
 * The clinic: the body map (pure; no Phaser). docs/modes/clinic-design.md
 * 8.1 (hotspot files), 8.2 (body.js), R3.2 (sides are the patient's own).
 *
 *   ClinicBody.build(file) -> body   // mirror .left -> .right across axisX
 *   body.hit(x, y, {active, closeup, pad}) -> {part, side, key} | null
 *   body.spot(part, side) -> [x, y]  // where a care item goes; the swirl
 *   body.areas(active, {step, pad}) -> {key: px^2 of its effective hit area}
 *
 * Hit-testing: a tap inside a polygon hits the SMALLEST active part that
 * contains it (the knee over the leg), else the nearest active part within
 * `pad` design px (snap-to-nearest), else nothing. Parts not in play are
 * simply not there: at level 1 the knee is part of the leg.
 * No labels are drawn on the body, ever (6.2): this module has no text.
 */
(function (root, factory) {
  const B = factory();
  if (typeof module === "object" && module.exports) module.exports = B;
  else root.ClinicBody = B;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const B = {};

  const area = (poly) => {
    let a = 0;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]);
    return Math.abs(a / 2);
  };
  const inside = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const segDist = (px, py, [ax, ay], [bx, by]) => {
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  };
  const dist = (poly, x, y) => {
    if (inside(poly, x, y)) return 0;
    let d = Infinity;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) d = Math.min(d, segDist(x, y, poly[j], poly[i]));
    return d;
  };
  B.area = area;
  B.inside = inside;
  B.centroid = (poly) => {
    let x = 0;
    let y = 0;
    poly.forEach((p) => ((x += p[0]), (y += p[1])));
    return [x / poly.length, y / poly.length];
  };

  B.build = function (file) {
    const ax = file.axisX || 800;
    const polys = {};
    const spots = {};
    const axes = {};
    const flip = (p) => p.map(([x, y]) => [2 * ax - x, y]);
    Object.entries(file.parts || {}).forEach(([key, poly]) => {
      polys[key] = poly;
      if (file.mirror && key.endsWith(".left")) polys[key.replace(/\.left$/, ".right")] = polys[key.replace(/\.left$/, ".right")] || flip(poly);
    });
    Object.entries(file.spots || {}).forEach(([key, p]) => {
      spots[key] = p;
      if (file.mirror && key.endsWith(".left")) spots[key.replace(/\.left$/, ".right")] = spots[key.replace(/\.left$/, ".right")] || [2 * ax - p[0], p[1]];
    });
    Object.entries(file.axes || {}).forEach(([key, v]) => {
      if (key.startsWith("_")) return;
      axes[key] = v;
      if (file.mirror && key.endsWith(".left")) axes[key.replace(/\.left$/, ".right")] = [-v[0], v[1]];
    });
    const face = new Set(((file.closeup || {}).parts) || []);
    const split = (key) => {
      const m = /^(.*?)(?:\.(left|right))?$/.exec(key);
      return { part: m[1], side: m[2] ? `side-${m[2]}` : null, key };
    };
    const keys = Object.keys(polys);
    const body = {
      file,
      polys,
      keys,
      split,
      closeup: file.closeup || null,
      isFace: (part) => face.has(part),
      /** Keys in play: `active` part ids (a key is in play if its part is); face parts only in the close-up. */
      live(active, { closeup = false } = {}) {
        const set = new Set(active);
        return keys.filter((k) => {
          const p = split(k).part;
          if (!set.has(p)) return false;
          return closeup ? face.has(p) || p === "body-head" : !face.has(p);
        });
      },
      hit(x, y, { active, closeup = false, pad = 120 } = {}) {
        const live = body.live(active, { closeup });
        // inside: the smallest containing part wins (the knee over the leg)
        const inPolys = live.filter((k) => inside(polys[k], x, y)).sort((a, b) => area(polys[a]) - area(polys[b]));
        // in the close-up the head is the frame: a face part first
        if (inPolys.length) return split(inPolys[0]);
        let best = null;
        let bd = pad;
        live.forEach((k) => {
          const d = dist(polys[k], x, y);
          if (d < bd) {
            bd = d;
            best = k;
          }
        });
        return best ? split(best) : null;
      },
      /** Where a thing goes on a part (the swirl, a plaster, a drop): the side's spot, else the polygon's middle. */
      spot(part, side) {
        const k = side ? `${part}.${side.replace("side-", "")}` : part;
        const k2 = spots[k] ? k : spots[part] ? part : spots[`${part}.left`] ? `${part}.left` : null;
        if (k2) return spots[k2];
        const pk = polys[k] ? k : polys[`${part}.left`] ? `${part}.left` : part;
        return polys[pk] ? B.centroid(polys[pk]) : [800, 450];
      },
      /** Any key of a part (a side's, if sided and given). */
      keyOf(part, side) {
        const k = side ? `${part}.${side.replace("side-", "")}` : part;
        return polys[k] ? k : polys[part] ? part : polys[`${part}.left`] ? `${part}.left` : null;
      },
      axis(part, side) {
        const k = body.keyOf(part, side);
        return axes[k] || [0, 1];
      },
      /** Effective hit area of each live key (px^2 of design space), by sampling a grid. */
      areas(active, { step = 4, pad = 120, closeup = false, box = [0, 0, 1600, 900] } = {}) {
        const out = {};
        body.live(active, { closeup }).forEach((k) => (out[k] = 0));
        for (let y = box[1]; y < box[3]; y += step)
          for (let x = box[0]; x < box[2]; x += step) {
            const h = body.hit(x, y, { active, closeup, pad });
            if (h) out[h.key] += step * step;
          }
        return out;
      },
    };
    return body;
  };
  return B;
});
