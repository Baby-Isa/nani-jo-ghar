/*
 * Snap: a round as data (docs/modes/snap-design.md D1, D5, build brief task 1).
 * Pure: no DOM. Used by the round in the browser and by build/leak_snap.mjs.
 *
 *   Req.knobs(snap, game, level)       -> K: the game level merged with its viewfinder, photo and hand-in levels
 *   Req.layout(scene, snap, K, rng)    -> { w, h, spots } the orchard dealt for this round (or null: deal again)
 *   Req.frameFor(row, lay, K)          -> { cx, cy, zoom, frame, print } an achievable shot for a row, or null
 *   Req.makeRound(snap, scene, game, level, seed) -> { K, lay, rows, film, seed }
 *
 * A row is { kind: "count", noun, n, not? } or { kind: "pick", noun, size, not? }.
 * Every row is dealt only if some frame the level's hands can reach
 * (tap-to-centre, the zoom steps, and drag from level 2) satisfies it: the
 * guaranteed frame. Nouns in one round are all different; counts are uniform
 * over the achievable ones in the level's range; big and small are asked
 * equally; the middle size is never asked. Which fruit hangs where is dealt
 * from the seed, so nothing about the scene carries over between rounds.
 */
(function (root, factory) {
  const Req = factory(root.Snap && root.Snap.Photo ? root.Snap.Photo : typeof require === "function" ? require("./photo.js") : null);
  if (typeof module === "object" && module.exports) module.exports = Req;
  else {
    root.Snap = root.Snap || {};
    root.Snap.Req = Req;
  }
})(typeof self !== "undefined" ? self : this, function (Photo) {
  const Req = {};

  /* ---------------- seeded randomness ---------------- */
  Req.rng = function (seed) {
    let a = (seed >>> 0) || 1;
    const next = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    next.int = (a0, b0) => a0 + Math.floor(next() * (b0 - a0 + 1));
    next.pick = (arr) => arr[Math.floor(next() * arr.length)];
    next.shuffle = (arr) => {
      const out = arr.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    };
    next.range = (v) => (Array.isArray(v) ? next.int(v[0], v[1]) : v);
    return next;
  };

  /* ---------------- knobs: level 1 in full, later levels only what changes ---------------- */
  const merged = (levels, level) => {
    const out = {};
    for (let i = 0; i < Math.min(level, levels.length); i++) deepAssign(out, levels[i]);
    if (level > levels.length) deepAssign(out, levels[levels.length - 1]);
    return out;
  };
  function deepAssign(a, b) {
    Object.keys(b || {}).forEach((k) => {
      if (k.startsWith("_")) return;
      const v = b[k];
      if (v && typeof v === "object" && !Array.isArray(v)) a[k] = deepAssign(Object.assign({}, a[k] || {}), v);
      else a[k] = v;
    });
    return a;
  }
  Req.merged = merged;
  Req.knobs = function (snap, game, level) {
    const g = snap.games[game];
    const K = merged(g.levels, level);
    const M = snap.mechanics;
    K.game = game;
    K.level = level;
    K.vf = merged(M.viewfinder.levels, K.viewfinder || 1);
    if (K.zooms) K.vf.zooms = K.zooms;
    K.photo = merged(M.photo.levels, 1);
    K.handin = merged(M.handin.levels, 1);
    K.ali = merged(M["ali-camera"].levels, 1);
    K.pool = snap.words.pool;
    return K;
  };

  /* ---------------- the orchard, dealt ---------------- */
  function randomSplit(t, rng) {
    if (t <= 2) return [t];
    if (rng() < 0.3) return [t];
    const a = rng.int(1, t - 1);
    return [a, t - a];
  }
  Req.layout = function (scene, snap, K, rng) {
    const W = Math.min(scene.w, Math.round((K.sceneWidth || 1.5) * scene.screen));
    const H = scene.h;
    const kinds = rng.shuffle(K.pool).slice(0, K.kinds);
    const P = scene.patterns;
    const S = scene.sizes;
    const clusters = [];
    if (K.sizes === "three") {
      kinds.forEach((kind) => {
        const nc = rng.range(K.clustersPerKind || 1);
        for (let c = 0; c < nc; c++) {
          const shape = rng.pick(P.sizes.shapes["3"]);
          const sizes = rng.shuffle(["big", "mid", "small"]);
          clusters.push({ pat: P.sizes, members: shape.map((o, i) => ({ o, kind, size: sizes[i] })) });
        }
      });
    } else {
      let parts = [];
      kinds.forEach((kind) => randomSplit(rng.range(K.perKind), rng).forEach((n) => parts.push({ n, kinds: [kind] })));
      if (K.interleave) {
        // two kinds share a cluster, so isolating N of one needs a tighter frame
        parts = rng.shuffle(parts);
        const out = [];
        while (parts.length) {
          const a = parts.shift();
          const j = parts.findIndex((b) => b.kinds[0] !== a.kinds[0] && a.n + b.n <= 6);
          if (j >= 0 && rng() < 0.75) {
            const b = parts.splice(j, 1)[0];
            out.push({ n: a.n + b.n, kinds: rng.shuffle([].concat(Array(a.n).fill(a.kinds[0]), Array(b.n).fill(b.kinds[0]))) });
          } else out.push({ n: a.n, kinds: Array(a.n).fill(a.kinds[0]) });
        }
        parts = out;
      } else parts = parts.map((p) => ({ n: p.n, kinds: Array(p.n).fill(p.kinds[0]) }));
      parts.forEach((p) => {
        const shape = rng.pick(P.count.shapes[String(p.n)]);
        clusters.push({ pat: P.count, members: shape.map((o, i) => ({ o, kind: p.kinds[i], size: "mid" })) });
      });
    }
    // a photobomber bunch of another kind beside every cluster (level 3)
    if (K.photobomber) {
      clusters.forEach((c) => {
        const own = new Set(c.members.map((m) => m.kind));
        const other = rng.pick(kinds.filter((k) => !own.has(k)));
        c.bomb = { kind: other, side: rng() < 0.5 ? -1 : 1, shape: rng.pick(P.photobomber.shapes["2"]) };
      });
    }
    // footprints, then place left to right along the bands
    const fw = (m) => S[m.size];
    clusters.forEach((c) => {
      const xs = c.members.map((m) => m.o[0] * c.pat.spacing[0]);
      c.left = Math.min(...c.members.map((m, i) => xs[i] - fw(m) / 2));
      c.right = Math.max(...c.members.map((m, i) => xs[i] + fw(m) / 2));
      if (c.bomb) {
        const bs = P.photobomber.spacing[0];
        const bxs = c.bomb.shape.map((o) => o[0] * bs);
        const bw = Math.max(...bxs) - Math.min(...bxs) + S.mid;
        c.bomb.w = bw;
        if (c.bomb.side < 0) {
          c.bomb.cx = c.left - P.photobomber.gap - bw / 2;
          c.left -= P.photobomber.gap + bw;
        } else {
          c.bomb.cx = c.right + P.photobomber.gap + bw / 2;
          c.right += P.photobomber.gap + bw;
        }
      }
      c.width = c.right - c.left;
    });
    const order = rng.shuffle(clusters);
    const bands = scene.bands[K.sizes === "three" ? "sizes" : "count"].map((b) => ({ y: b.y, list: [], used: 0 }));
    const room = W - 2 * scene.margin;
    for (const c of order) {
      const band = bands.slice().sort((a, b) => a.used - b.used)[0];
      const need = (band.list.length ? scene.gap[0] : 0) + c.width;
      if (band.used + need > room) return null;
      band.list.push(c);
      band.used += need;
    }
    // spread each band evenly across the scene, with a little randomness in the gaps
    const spots = [];
    let id = 0;
    const jit = () => (rng() * 2 - 1) * (scene.jitter || 0);
    bands.forEach((band) => {
      const n = band.list.length;
      if (!n) return;
      const widths = band.list.reduce((a, c) => a + c.width, 0);
      const free = room - widths;
      const weights = Array.from({ length: n + 1 }, () => 0.6 + rng());
      const wsum = weights.reduce((a, b) => a + b, 0);
      let x = scene.margin + (free * weights[0]) / wsum;
      band.list.forEach((c, i) => {
        const cx = x - c.left;
        c.members.forEach((m) => {
          const s = fw(m);
          spots.push({ id: `f${id++}`, kind: m.kind, size: m.size, layer: "branch", x: Math.round(cx + m.o[0] * c.pat.spacing[0] + jit()), y: Math.round(band.y + m.o[1] * c.pat.spacing[1] + jit()), w: s, h: s });
        });
        if (c.bomb) {
          const bs = P.photobomber.spacing;
          c.bomb.shape.forEach((o) => spots.push({ id: `f${id++}`, kind: c.bomb.kind, size: "mid", layer: "branch", bomb: true, x: Math.round(cx + c.bomb.cx + o[0] * bs[0] + jit()), y: Math.round(band.y + o[1] * bs[1] + jit()), w: S.mid, h: S.mid }));
        }
        x += c.width + (free * weights[i + 1]) / wsum + (i < n - 1 ? 0 : 0);
      });
    });
    return { w: W, h: H, spots, kinds };
  };

  /* ---------------- reaching a frame with the level's hands ---------------- */
  /** Where a tap at (x, y) centres the frame: on a fruit, its centre (aim assist); on the branches, right there. */
  Req.tapCentre = function (x, y, spots, aimAssist, from) {
    const hit = spots.find((s) => Math.abs(x - s.x) <= s.w / 2 && Math.abs(y - s.y) <= s.h / 2);
    if (!hit || !aimAssist) return [x, y];
    const a = Math.max(0, Math.min(1, aimAssist));
    return [x + (hit.x - x) * a, y + (hit.y - y) * a];
  };
  /** Can the frame's centre be put at p? With drag, anywhere; without, a tap there (or on a fruit whose centre it is). */
  Req.reachable = function (p, lay, K) {
    if (K.vf.drag) return true;
    const [cx, cy] = Req.tapCentre(p[0], p[1], lay.spots, K.vf.aimAssist);
    return Math.abs(cx - p[0]) < 1 && Math.abs(cy - p[1]) < 1;
  };
  const OFFS = [-60, 0, 60];
  function centresFor(row, lay) {
    const pts = [];
    const same = lay.spots.filter((s) => s.kind === row.noun);
    if (row.kind === "pick") {
      same.filter((s) => s.size === row.size).forEach((s) => pts.push([s.x, s.y]));
    } else {
      same.forEach((s) => {
        pts.push([s.x, s.y]);
        const near = same.slice().sort((a, b) => dist(a, s) - dist(b, s)).slice(0, row.n);
        if (near.length === row.n) pts.push([avg(near, "x"), avg(near, "y")]);
      });
    }
    const out = [];
    pts.forEach(([x, y]) => OFFS.forEach((dx) => OFFS.forEach((dy) => out.push([x + dx, y + dy]))));
    return out;
  }
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const avg = (arr, k) => arr.reduce((t, s) => t + s[k], 0) / arr.length;
  Req.frameFor = function (row, lay, K) {
    const zooms = K.vf.zooms.slice().reverse();
    const scene = { w: lay.w, h: lay.h };
    for (const p of centresFor(row, lay)) {
      if (!Req.reachable(p, lay, K)) continue;
      for (const zoom of zooms) {
        const frame = Photo.frameAt(p[0], p[1], zoom, K.vf.base, scene);
        const print = Photo.printRecord(lay.spots, frame);
        if (Photo.matches(print, row, K.photo).ok) return { cx: p[0], cy: p[1], zoom, frame, print };
      }
    }
    return null;
  };

  /* ---------------- the rows ---------------- */
  function dealRows(lay, K, rng) {
    const nRows = rng.range(K.rows);
    const nouns = rng.shuffle(lay.kinds);
    const rows = [];
    for (const noun of nouns) {
      if (rows.length >= nRows) break;
      let base = null;
      if (K.game === "g2") {
        for (const size of rng.shuffle(["big", "small"])) {
          const r = { kind: "pick", noun, size };
          if (Req.frameFor(r, lay, K)) {
            base = r;
            break;
          }
        }
      } else {
        const [c0, c1] = K.counts;
        const ok = [];
        for (let n = c0; n <= c1; n++) if (Req.frameFor({ kind: "count", noun, n }, lay, K)) ok.push(n);
        if (ok.length) base = { kind: "count", noun, n: rng.pick(ok) };
      }
      if (!base) continue;
      if (K.notChance && rng() < K.notChance) {
        // leave-out: a kind that could get in the way of this shot (a photobomber first)
        const near = new Set(lay.spots.filter((s) => s.bomb).map((s) => s.kind));
        const others = rng.shuffle(lay.kinds.filter((k) => k !== noun)).sort((a, b) => (near.has(b) ? 1 : 0) - (near.has(a) ? 1 : 0));
        let withNot = null;
        for (const y of others) {
          const r = Object.assign({}, base, { not: y });
          const f = Req.frameFor(r, lay, K);
          // only worth saying if the plain shot could easily have let it in
          if (f && lay.spots.some((s) => s.kind === y && Math.abs(s.x - f.cx) < K.vf.base.w)) {
            withNot = r;
            break;
          }
        }
        if (withNot) base = withNot;
      }
      rows.push(base);
    }
    return rows.length === nRows ? rows : null;
  }

  Req.makeRound = function (snap, scene, game, level, seed) {
    const K = Req.knobs(snap, game, level);
    const rng = Req.rng(seed);
    for (let tries = 0; tries < 60; tries++) {
      const lay = Req.layout(scene, snap, K, rng);
      if (!lay) continue;
      const rows = dealRows(lay, K, rng);
      if (!rows) continue;
      return { K, lay, rows, film: rows.length + (K.photo.filmSpare || 2), seed, tries };
    }
    throw new Error(`snap: no round could be dealt for ${game} level ${level} seed ${seed}`);
  };

  /** Word parts for a row, in the language's order ([n, noun] or [sizeWord, noun]); the leave-out part separately. */
  Req.rowParts = function (row, snap) {
    const main = row.kind === "count" ? [row.n, row.noun] : [snap.words.size[row.size], row.noun];
    return { main, not: row.not ? [row.not] : null };
  };
  /** The deciding word ids of a row (for word stages and the ear star). */
  Req.rowWords = function (row, snap) {
    const ids = [row.noun];
    if (row.kind === "count") ids.push(snap.words.numbers[String(row.n)]);
    else ids.push(snap.words.size[row.size]);
    if (row.not) ids.push(row.not);
    return ids;
  };

  return Req;
});
