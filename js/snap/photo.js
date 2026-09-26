/*
 * Snap: the print record and the matcher (docs/modes/snap-design.md D1, D3,
 * 8.1). Pure: no DOM, no Phaser, no randomness, so the Node leak bot
 * (build/leak_snap.mjs), the lab and the round all judge a print the same way.
 *
 *   printRecord(spots, frame) -> { frame, sprites: [{ id, kind, size, visible, area, centre }] }
 *     spots:  [{ id, kind, size, x, y, w, h }]   (x, y: the sprite's centre, world units)
 *     frame:  { x, y, w, h, zoom }                (x, y: top-left, world units)
 *     visible: the share of the sprite inside the frame (0..1)
 *     area:    the visible part's share of the frame (0..1)
 *     centre:  the visible part's centre from the frame's centre, in frame widths/heights (-0.5..0.5)
 *
 *   matches(print, row, rules) -> { ok, why }
 *     row: { kind: "count", noun, n, not? }   K1 (+K3 with `not`)
 *          { kind: "pick", noun, size, not? } K2 (+K3)
 *     rules: data/snap.json mechanics.photo (the numbers; never constants here)
 *
 *   lensScore(print, rules) -> { ok, score, of } rated on the biggest thing in
 *     the frame, never on the wanted one (so the rating says nothing about the row).
 *
 *   recast(print, row, rules) -> [parts] what Nani says is really in the print
 *     ([n, noun], [sizeWord, noun], or [noun]); null for an empty print.
 *
 * No sprite in this file knows which row it is for: a print is only geometry.
 */
(function (root, factory) {
  const Photo = factory();
  if (typeof module === "object" && module.exports) module.exports = Photo;
  else {
    root.Snap = root.Snap || {};
    root.Snap.Photo = Photo;
  }
})(typeof self !== "undefined" ? self : this, function () {
  const Photo = {};

  const DEFAULT_RULES = {
    countVisible: 0.5,
    excludeMax: 0.1,
    mainSubject: { minArea: 0.08, minVisible: 0.6, middle: 1 / 6, rivalMax: 0.5 },
    lens: { minArea: 0.15, maxArea: 0.7, middle: 1 / 6, minVisible: 0.9 },
    sizeWords: { big: "ph-big", small: "ph-small" },
  };
  Photo.DEFAULT_RULES = DEFAULT_RULES;
  const R = (rules) => {
    const r = Object.assign({}, DEFAULT_RULES, rules || {});
    r.mainSubject = Object.assign({}, DEFAULT_RULES.mainSubject, (rules || {}).mainSubject || {});
    r.lens = Object.assign({}, DEFAULT_RULES.lens, (rules || {}).lens || {});
    return r;
  };

  /** The frame (top-left rectangle) for a centre and a zoom, from the base frame size, kept inside the scene. */
  Photo.frameAt = function (cx, cy, zoom, base, scene) {
    const w = base.w / zoom;
    const h = base.h / zoom;
    const x = Math.max(0, Math.min(scene.w - w, cx - w / 2));
    const y = Math.max(0, Math.min(scene.h - h, cy - h / 2));
    return { x, y, w, h, zoom };
  };

  Photo.printRecord = function (spots, frame) {
    const fa = frame.w * frame.h;
    const fcx = frame.x + frame.w / 2;
    const fcy = frame.y + frame.h / 2;
    const sprites = [];
    for (const s of spots) {
      const l = s.x - s.w / 2;
      const t = s.y - s.h / 2;
      const ix0 = Math.max(l, frame.x);
      const iy0 = Math.max(t, frame.y);
      const ix1 = Math.min(l + s.w, frame.x + frame.w);
      const iy1 = Math.min(t + s.h, frame.y + frame.h);
      if (ix1 <= ix0 || iy1 <= iy0) continue;
      const va = (ix1 - ix0) * (iy1 - iy0);
      sprites.push({
        id: s.id,
        kind: s.kind,
        size: s.size,
        visible: round3(va / (s.w * s.h)),
        area: round3(va / fa),
        centre: [round3(((ix0 + ix1) / 2 - fcx) / frame.w), round3(((iy0 + iy1) / 2 - fcy) / frame.h)],
      });
    }
    return { frame: { x: Math.round(frame.x), y: Math.round(frame.y), w: Math.round(frame.w), h: Math.round(frame.h), zoom: frame.zoom }, sprites };
  };
  const round3 = (v) => Math.round(v * 1000) / 1000;

  /** How many of a noun count as "in the photo" (at least half showing). */
  Photo.countOf = (print, noun, rules) => print.sprites.filter((s) => s.kind === noun && s.visible >= R(rules).countVisible).length;

  /** The main subject of a noun: the biggest of it in frame, if it's big, central and alone enough. */
  Photo.mainSubject = function (print, noun, rules) {
    const m = R(rules).mainSubject;
    const mine = print.sprites.filter((s) => s.kind === noun);
    const main = mine.filter((s) => s.visible >= m.minVisible).sort((a, b) => b.area - a.area)[0];
    if (!main) return { main: null, why: `no ${noun} showing well` };
    if (main.area < m.minArea) return { main: null, why: `the ${noun} is too small in the photo` };
    if (Math.abs(main.centre[0]) > m.middle || Math.abs(main.centre[1]) > m.middle) return { main: null, why: `the ${noun} isn't in the middle` };
    const rival = mine.find((s) => s !== main && s.area > m.rivalMax * main.area);
    if (rival) return { main: null, why: `two ${noun} in the photo, neither is the main one` };
    return { main, why: "" };
  };

  Photo.matches = function (print, row, rules) {
    const r = R(rules);
    let res;
    if (row.kind === "count") {
      const c = Photo.countOf(print, row.noun, r);
      res = c === row.n ? { ok: true, why: "" } : { ok: false, why: `${c} ${row.noun}, not ${row.n}` };
    } else if (row.kind === "pick") {
      const { main, why } = Photo.mainSubject(print, row.noun, r);
      if (!main) res = { ok: false, why };
      else if (main.size !== row.size) res = { ok: false, why: `the main ${row.noun} is ${main.size}, not ${row.size}` };
      else res = { ok: true, why: "" };
    } else res = { ok: false, why: `unknown row kind ${row.kind}` };
    if (res.ok && row.not) {
      const bad = print.sprites.find((s) => s.kind === row.not && s.visible >= r.excludeMax);
      if (bad) res = { ok: false, why: `a ${row.not} is in the photo (${Math.round(bad.visible * 100)}% showing)` };
    }
    return res;
  };

  /** The craft score, on the biggest thing in the frame (whatever it is). */
  Photo.lensScore = function (print, rules) {
    const L = R(rules).lens;
    const big = print.sprites.slice().sort((a, b) => b.area - a.area)[0];
    if (!big) return { ok: false, score: 0, of: null };
    const sizeOk = big.area >= L.minArea && big.area <= L.maxArea;
    const midOk = Math.abs(big.centre[0]) <= L.middle && Math.abs(big.centre[1]) <= L.middle;
    const visOk = big.visible >= L.minVisible;
    const score = Math.round((sizeOk ? 40 : 40 * Math.min(1, big.area / L.minArea)) + (midOk ? 35 : 10) + 25 * big.visible);
    return { ok: sizeOk && midOk && visOk, score: Math.min(100, score), of: big.id };
  };

  /**
   * What Nani says is really in a print when it's the wrong one for a row
   * (the recast): for a "no X" row that broke, how many X; for a pick row,
   * the print's main thing with its size word; else how many of the row's
   * noun, or of whatever the print holds most of.
   */
  Photo.recast = function (print, row, rules) {
    const r = R(rules);
    const shown = print.sprites.filter((s) => s.visible >= r.countVisible);
    if (!shown.length) return null;
    const pos = Photo.matches(print, Object.assign({}, row, { not: null }), r);
    if (row.not && pos.ok) {
      const n = Photo.countOf(print, row.not, r);
      return n ? [n, row.not] : [row.not];
    }
    if (row.kind === "pick") {
      const big = shown.slice().sort((a, b) => b.area - a.area)[0];
      const w = r.sizeWords[big.size];
      return w ? [w, big.kind] : [big.kind];
    }
    const own = Photo.countOf(print, row.noun, r);
    if (own) return [own, row.noun];
    const by = {};
    shown.forEach((s) => (by[s.kind] = (by[s.kind] || 0) + 1));
    const top = Object.keys(by).sort((a, b) => by[b] - by[a])[0];
    return [by[top], top];
  };

  return Photo;
});
