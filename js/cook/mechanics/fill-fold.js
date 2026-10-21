/*
 * Mechanics: fill and fold (samosa; later dahi puri, dabeli…).
 *  fill: spoon the fillings the customer named into the mixing bowl, as
 *        many spoons of each as they said ("ne ba chundo, ne hakro
 *        watana"), in any order. Any bowl can be spooned (decoys and the
 *        "no X" item too); nothing is refused and a running tally sits on
 *        each bowl, so you press Done when you think it's right, and it's
 *        graded then. Kutchi: the nouns, the counts, "no X".
 *  fold: each pastry gets a scoop of the filling; swipe along each dashed
 *        line to fold it. Make as many samosas as they asked for, then
 *        Done (no "Samosa 2 of 2": the count is theirs, said once).
 * St.fillFold(S, ctx, params) is the samosa station: fill once, then fold
 * them all, on one view.
 * Knobs: fill {decoys [min, max], decoyPick, rowY, flyMs};
 *        fold {folds, minLen, minDot, maxExtra}.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /** {id: n} from a tally, a list (one spoon each) or any-order groups. */
  const asTally = (f) => {
    if (!f) return {};
    if (!Array.isArray(f)) {
      const out = {};
      Object.keys(f).forEach((id) => Number(f[id]) > 0 && (out[id] = Number(f[id])));
      return out;
    }
    const out = {};
    f.flat().forEach((id) => (out[id] = (out[id] || 0) + 1));
    return out;
  };

  /*
   * SAM-21 (decision 10, Zafar's yes, 18 Oct; P39): the coded fold, in the pastry texture. A flat rectangular strip
   * (height 1, the unit); the filling on its bottom-left corner. Each fold turns a flap over a crease, like paper: the first lifts
   * the bottom-left corner over (bottom left to top right) into a triangle, then that triangle rolls over its right edge
   * onto the next one, alternating (top left to bottom right, then bottom left to top right ...) left to right until the
   * strip is used up; what is left past the last triangle tucks under by itself. The triangles are equilateral (the only
   * shape that rolls onto the strip's next triangle exactly), so every swipe runs 30 degrees off the strip's line.
   * Drawn as layers (a polygon of pastry each, with the texture carried by its own placement), so a flap shows its
   * underside, mirrored, as it turns; soft shadows under each layer and under the flap in the air; no outlines.
   * Cook.Pastry.create({folds, tile, ppu}) -> a fold: .canvas (draw it, then show it), .swipe(), .begin(), .draw(o),
   * .commit(), .done(), .mounds(m), .fillCentre(). Units are the strip's height; (0, 0) is its top-left corner.
   */
  const SQ3 = Math.sqrt(3);
  const TS = 2 / SQ3; // the triangle's side (height 1)
  const LIFT = [-0.05, -0.1]; // a flap in the air drifts a little up-left (the camera is overhead, the light upper left)
  const CAST = [0.1, 0.16]; // and its shadow falls down-right
  const LEAN = 0.3;
  const PASTRY = "rgb(240, 212, 156)";
  const vsub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const vdot = (a, b) => a[0] * b[0] + a[1] * b[1];
  // an affine map [a, b, c, d, e, f] (the canvas order): x' = a x + c y + e, y' = b x + d y + f
  const ap = (M, p) => [M[0] * p[0] + M[2] * p[1] + M[4], M[1] * p[0] + M[3] * p[1] + M[5]];
  const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
  const ID = [1, 0, 0, 1, 0, 0];
  const area = (P) => Math.abs(P.reduce((s, p, i) => s + p[0] * P[(i + 1) % P.length][1] - P[(i + 1) % P.length][0] * p[1], 0)) / 2;
  const centroid = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
  /** The part of a convex polygon where f(p) >= 0 (one Sutherland-Hodgman edge). */
  function cut(P, f) {
    const out = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i];
      const b = P[(i + 1) % P.length];
      const fa = f(a);
      const fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) {
        const t = fa / (fa - fb);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return out.length >= 3 && area(out) > 1e-5 ? out : null;
  }
  /** A soft-cornered path round a polygon (never a sharp code corner: SAM-21 "hard edges"). */
  function path(g, P, r = 0.03) {
    g.beginPath();
    const n = P.length;
    for (let i = 0; i < n; i++) {
      const a = P[(i + n - 1) % n];
      const b = P[i];
      const c = P[(i + 1) % n];
      const la = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
      const lc = Math.hypot(c[0] - b[0], c[1] - b[1]) || 1e-9;
      // the corner's angle: the arc meets each side at td = rr / tan(angle / 2) from the corner, kept within a third of
      // each side (a sliver's sharp tip would otherwise throw the arc far out)
      const cosA = ((a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1])) / (la * lc);
      const half = Math.acos(Math.max(-1, Math.min(1, cosA))) / 2;
      const tan = Math.tan(half);
      let rr = r;
      let td = tan > 1e-3 ? rr / tan : Infinity;
      const cap = Math.min(la, lc) / 3;
      if (td > cap) {
        td = cap;
        rr = cap * tan;
      }
      if (!(rr > 1e-4) || half > 1.55) {
        if (i === 0) g.moveTo(b[0], b[1]);
        else g.lineTo(b[0], b[1]);
        continue;
      }
      const p0 = [b[0] + ((a[0] - b[0]) * td) / la, b[1] + ((a[1] - b[1]) * td) / la];
      if (i === 0) g.moveTo(p0[0], p0[1]);
      else g.lineTo(p0[0], p0[1]);
      g.arcTo(b[0], b[1], c[0], c[1], rr);
    }
    g.closePath();
  }
  /** The strip's triangles: T(i), i from 1, alternately point down (odd) and up (even). */
  const tri = (i) =>
    i % 2
      ? [[((i - 1) * TS) / 2, 0], [((i + 1) * TS) / 2, 0], [(i * TS) / 2, 1]]
      : [[((i - 1) * TS) / 2, 1], [((i + 1) * TS) / 2, 1], [(i * TS) / 2, 0]];

  Cook.Pastry = {
    TS,
    /** folds: how many swipes (3 or 4); tile: the pastry texture (seamless across); ppu: canvas px per unit. */
    create({ folds = 3, tile = null, ppu = 300 } = {}) {
      const N = Math.max(2, Math.min(5, folds | 0));
      const L = ((N + 1) / 2) * TS;
      const M = 0.38; // the margin round the strip (shadows, the glow, the arrow)
      const box = { x0: -M, y0: -M, x1: L + M, y1: 1 + M };
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil((box.x1 - box.x0) * ppu);
      canvas.height = Math.ceil((box.y1 - box.y0) * ppu);
      // the creases, in order: the corner, then each triangle's right edge; the last tucks the rest under
      const lines = [{ a: [0, 0], b: [TS / 2, 1], ref: [0.02, 0.98], over: true }];
      for (let i = 1; i < N; i++) lines.push({ a: tri(i)[1], b: tri(i)[2], ref: centroid(tri(i)), over: true });
      lines.push({ a: tri(N)[1], b: tri(N)[2], ref: [L - 0.02, 0.5], over: false });
      lines.forEach((l) => {
        const d = vsub(l.b, l.a);
        const len = Math.hypot(d[0], d[1]);
        l.u = [d[0] / len, d[1] / len];
        l.n = [-l.u[1], l.u[0]];
        if (vdot(l.n, vsub(l.ref, l.a)) < 0) l.n = [-l.n[0], -l.n[1]];
        l.side = (p) => vdot(l.n, vsub(p, l.a));
      });
      let pieces = [{ poly: [[0, 0], [L, 0], [L, 1], [0, 1]], M: ID }];
      let k = 0; // the next fold
      let act = null; // {line, flap, rest}
      // s08 w6M (SAM-21; Zafar: "meat in the bottom left-hand corner"; the judge, 20 Oct: "the filling sits mid-height a fifth
      // of the way in"): the filling sits on the corner flap itself, the strip's bottom-left corner (was: where that flap
      // lands, mid-height); the first fold carries it over and closes it in (it turns with the flap and is hidden once the
      // flap is past upright, between the flap and the strip)
      const land = [[0, 0], [TS / 2, 1], [0, 1]];
      const F = {
        N,
        L,
        box,
        ppu,
        canvas,
        get k() {
          return k;
        },
        /** a unit point -> canvas px */
        px: (p) => [(p[0] - box.x0) * ppu, (p[1] - box.y0) * ppu],
        /** The swipe of fold i (units): across the crease, along the way the flap turns, starting on the flap. */
        swipe(i = k) {
          const l = lines[Math.min(i, lines.length - 1)];
          // the flap's far corner (for a triangle, straight across from the crease's middle)
          const far = i === 0 ? [0, 1] : tri(i).find((p) => Math.abs(l.side(p)) > 0.5);
          const h = l.side(far);
          const foot = [far[0] - l.n[0] * h, far[1] - l.n[1] * h];
          const a = Math.min(0.62, 0.95 * h);
          return { from: [foot[0] + l.n[0] * a, foot[1] + l.n[1] * a], to: [foot[0] - l.n[0] * a, foot[1] - l.n[1] * a], dir: [-l.n[0], -l.n[1]] };
        },
        /** The flap of the next fold, split off (drawn lit before the swipe; turned by draw({t})). */
        begin() {
          if (act || k >= lines.length) return act;
          const l = lines[k];
          const flap = [];
          const rest = [];
          pieces.forEach((pc, z) => {
            const f = cut(pc.poly, l.side);
            const r = cut(pc.poly, (p) => -l.side(p));
            if (f) flap.push({ poly: f, M: pc.M, z });
            if (r) rest.push({ poly: r, M: pc.M, z });
          });
          act = { line: l, flap, rest };
          return act;
        },
        /** The turn at t (0-1): theta = pi t; the map from the flat flap to where it is now. */
        turn(t, l = act && act.line, cast = false) {
          const th = Math.PI * Math.max(0, Math.min(1, t));
          const up = l.over ? 1 : -0.5;
          // upright, a flap is seen leaning a little over the crease (as from a camera above the board's middle), never as a
          // line; its shadow falls down-right, away from the light
          const w = cast ? CAST : [LIFT[0] - LEAN * l.n[0], LIFT[1] - LEAN * l.n[1]];
          const v = [-(1 - Math.cos(th)) * l.n[0] + Math.sin(th) * w[0] * up, -(1 - Math.cos(th)) * l.n[1] + Math.sin(th) * w[1] * up];
          const na = vdot(l.n, l.a);
          return { th, R: [1 + v[0] * l.n[0], v[1] * l.n[0], v[0] * l.n[1], 1 + v[1] * l.n[1], -v[0] * na, -v[1] * na] };
        },
        /** The fold is made: the flap lies over (or, the tuck, under) the rest, mirrored, its layers in reverse. */
        commit() {
          if (!act) F.begin();
          if (!act) return;
          const { R } = F.turn(1);
          const moved = act.flap
            .slice()
            .sort((a, b) => b.z - a.z)
            .map((pc) => ({ poly: pc.poly.map((p) => ap(R, p)), M: mul(R, pc.M) }));
          const rest = act.rest.sort((a, b) => a.z - b.z).map((pc) => ({ poly: pc.poly, M: pc.M }));
          pieces = act.line.over ? rest.concat(moved) : moved.concat(rest);
          act = null;
          k++;
        },
        /** Every fold made but the tuck. */
        get folded() {
          return k >= N;
        },
        get finished() {
          return k > N;
        },
        /** Where the filling's mounds sit (units): m of them, inside where the corner lands, each as big as fits. */
        mounds(m) {
          const E = land.map((a, i) => {
            const b = land[(i + 1) % 3];
            const d = vsub(b, a);
            const len = Math.hypot(d[0], d[1]);
            let n = [-d[1] / len, d[0] / len];
            if (vdot(n, vsub(centroid(land), a)) < 0) n = [-n[0], -n[1]];
            return (p) => vdot(n, vsub(p, a));
          });
          const sides = land.map((p, i) => Math.hypot(land[(i + 1) % 3][0] - p[0], land[(i + 1) % 3][1] - p[1]));
          const per = sides[0] + sides[1] + sides[2];
          // the incentre (each corner weighted by the side opposite it)
          const ic = [(sides[1] * land[0][0] + sides[2] * land[1][0] + sides[0] * land[2][0]) / per, (sides[1] * land[0][1] + sides[2] * land[1][1] + sides[0] * land[2][1]) / per];
          const u = [land[1][0] - land[0][0], land[1][1] - land[0][1]].map((x) => x / sides[0]);
          const n1 = Math.max(1, m);
          // SAM-22 (the judge, 21 Oct: "a tiny speck in the pastry's corner"): the search started at r 0.21, so one mound never
          // grew past 0.21 although the corner's incircle (a right corner of the strip's height: inradius 0.29) takes 0.34
          for (let r = 0.4; r > 0.06; r -= 0.005) {
            for (const shift of [0, 0.3, -0.3]) {
              const c = [ic[0] + shift * r * u[1], ic[1] - shift * r * u[0]];
              const spots = Array.from({ length: n1 }, (_, j) => {
                const o = (j - (n1 - 1) / 2) * 1.6 * r;
                return { x: c[0] + u[0] * o, y: c[1] + u[1] * o, r };
              });
              if (spots.every((s) => E.every((f) => f([s.x, s.y]) >= 0.85 * r))) return spots;
            }
          }
          return Array.from({ length: n1 }, () => ({ x: ic[0], y: ic[1], r: 0.08 }));
        },
        fillCentre: () => centroid(land),
        /**
         * Draw it. o: t (the turn of the next fold, 0-1), glow (0-1: the flap lit, breathing; null: not lit), arrow (0-1: its
         * strength), blobs ([{img, x, y, w, h, angle}] in units: the filling, under the corner flap until it lands).
         */
        draw(o = {}, g = canvas.getContext("2d")) {
          const t = o.t || 0;
          g.setTransform(1, 0, 0, 1, 0, 0);
          g.clearRect(0, 0, canvas.width, canvas.height);
          const base = [ppu, 0, 0, ppu, -box.x0 * ppu, -box.y0 * ppu];
          g.setTransform(...base);
          if (o.pre) g.transform(...o.pre);
          const lit = o.glow != null && t === 0 && k < N;
          const a = t > 0 || lit ? F.begin() : act;
          const turning = a && t > 0 ? F.turn(t) : null;
          // (the flap's outline: its biggest layer, the others lie on it)
          const big = a ? a.flap.reduce((m, pc) => (!m || area(pc.poly) > area(m.poly) ? pc : m), null) : null;
          const layer = (pc, { R = null, shade = 0, soft = 1 } = {}) => {
            const P = R ? pc.poly.map((p) => ap(R, p)) : pc.poly;
            const MM = R ? mul(R, pc.M) : pc.M;
            g.save();
            // its colour, and its soft shadow on what is under it (no outline: only the shadow marks the edge)
            g.shadowColor = "rgba(70, 40, 12, 0.3)";
            g.shadowBlur = 0.05 * soft * ppu;
            g.shadowOffsetX = 0.01 * ppu * soft;
            g.shadowOffsetY = 0.022 * ppu * soft;
            g.fillStyle = PASTRY;
            path(g, P);
            g.fill();
            g.restore();
            g.save();
            path(g, P);
            g.clip();
            if (tile) {
              g.save();
              g.transform(...MM);
              const th = 1.18;
              const tw = (th * (tile.width || 1)) / (tile.height || 1);
              for (let x = -0.18; x < L + 0.2; x += tw - 0.002) g.drawImage(tile, x, -0.09, tw, th);
              g.restore();
            }
            // a soft rim, darker toward the cut edge, inside it
            [[0.07, 0.04], [0.04, 0.05], [0.016, 0.08]].forEach(([w, al]) => {
              g.lineWidth = w;
              g.strokeStyle = `rgba(150, 98, 40, ${al})`;
              path(g, P);
              g.stroke();
            });
            if (shade) {
              g.fillStyle = shade > 0 ? `rgba(255, 248, 225, ${shade})` : `rgba(80, 45, 12, ${-shade})`;
              g.fillRect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
            }
            g.restore();
          };
          const pulse = lit ? o.glow : 0;
          if (lit && big) {
            // the lit flap (only the part that moves): a warm glow round its free edges, under the pastry
            // (in the focal glow's colour, decision 95: a wide soft pass and a closer one)
            [[0.24, 0.7], [0.1, 0.95]].forEach(([blur, al]) => {
              g.save();
              g.shadowColor = `rgba(255, 227, 160, ${al * (0.65 + 0.35 * pulse)})`;
              g.shadowBlur = blur * ppu;
              g.fillStyle = "rgba(255, 227, 160, 1)";
              path(g, big.poly);
              g.fill();
              g.restore();
            });
          }
          const under = turning && !a.line.over;
          if (under) a.flap.forEach((pc) => layer(pc, { R: turning.R, soft: 0.5 }));
          // at rest the strip is drawn whole (a split there would show as a seam along the crease)
          (turning ? a.rest : pieces).forEach((pc) => layer(pc));
          // the filling: on the corner flap (SAM-21), so while the first fold turns it goes over with the flap (drawn below)
          const onFlap = !!(turning && k === 0 && a.line.over);
          const blobs = (R) =>
            (o.blobs || []).forEach((b) => {
              if (!b.img) return;
              g.save();
              if (R) g.transform(...R);
              g.translate(b.x, b.y);
              g.rotate(((b.angle || 0) * Math.PI) / 180);
              g.shadowColor = "rgba(60, 30, 10, 0.25)";
              g.shadowBlur = 0.03 * ppu;
              g.shadowOffsetY = 0.012 * ppu;
              g.drawImage(b.img, -b.w / 2, -b.h / 2, b.w, b.h);
              g.restore();
            });
          if (!onFlap) blobs(null);
          if (lit && big) {
            g.save();
            g.fillStyle = `rgba(255, 244, 214, ${0.2 + 0.14 * pulse})`;
            path(g, big.poly);
            g.fill();
            g.restore();
          }
          if (turning && !under) {
            const l = a.line;
            const s = Math.sin(turning.th);
            // the flap's shadow on the strip while it is in the air
            const C = F.turn(t, l, true).R;
            g.save();
            g.shadowColor = `rgba(60, 32, 8, ${0.3 * s})`;
            g.shadowBlur = (0.04 + 0.12 * s) * ppu;
            g.fillStyle = `rgba(60, 32, 8, ${0.14 * s})`;
            path(g, big.poly.map((p) => ap(C, p)));
            g.fill();
            g.restore();
            // turned: which face shows (the underside once past upright, mirrored), and how the light falls on it
            const R = turning.R;
            const det = R[0] * R[3] - R[1] * R[2];
            const Lt = [-0.35, -0.45, 0.82];
            const nz = Math.cos(turning.th);
            let b = -Math.sin(turning.th) * (l.n[0] * Lt[0] + l.n[1] * Lt[1]) + nz * Lt[2];
            if (nz < 0) b = -b;
            const shade = Math.max(-0.35, Math.min(0.25, (b - Lt[2]) * 0.7));
            const order = a.flap.slice().sort((p, q) => (det >= 0 ? p.z - q.z : q.z - p.z));
            order.forEach((pc) => layer(pc, { R, shade, soft: 1 + 2 * s }));
            // the filling rides on the flap's top face until it is upright; past that it is closed in under it
            if (onFlap && nz > 0) blobs(R);
          }
          if (o.arrow > 0 && k < N && !turning) F.arrow(g, F.swipe(), o.arrow);
          g.setTransform(1, 0, 0, 1, 0, 0);
        },
        /** The swipe's arrow (units): a soft white stroke and head with a soft shadow, no line under it. */
        arrow(g, sw, al = 1) {
          const [x0, y0] = sw.from;
          const [x1, y1] = sw.to;
          const d = [x1 - x0, y1 - y0];
          const len = Math.hypot(d[0], d[1]);
          const u = [d[0] / len, d[1] / len];
          const hl = 0.24;
          const hw = 0.2;
          const bx = x1 - u[0] * hl;
          const by = y1 - u[1] * hl;
          g.save();
          g.globalAlpha = al;
          g.shadowColor = "rgba(50, 28, 8, 0.45)";
          g.shadowBlur = 0.06 * ppu;
          g.shadowOffsetY = 0.015 * ppu;
          g.strokeStyle = "rgba(255, 253, 246, 0.95)";
          g.fillStyle = "rgba(255, 253, 246, 0.95)";
          g.lineCap = "round";
          g.lineJoin = "round";
          g.lineWidth = 0.085;
          g.beginPath();
          g.moveTo(x0, y0);
          g.lineTo(bx + u[0] * 0.04, by + u[1] * 0.04);
          g.stroke();
          // the head: its shadow with the fill, then a soft round-cornered stroke over it with none (a stroke's shadow
          // fell inside it and read as a hollow head)
          const head = () => {
            g.beginPath();
            g.moveTo(x1, y1);
            g.lineTo(bx - u[1] * hw, by + u[0] * hw);
            g.lineTo(bx + u[1] * hw, by - u[0] * hw);
            g.closePath();
          };
          head();
          g.fill();
          g.shadowColor = "rgba(0,0,0,0)";
          g.lineWidth = 0.05;
          head();
          g.stroke();
          g.restore();
        },
        /** The finished samosa alone, on its own canvas cut round it: {canvas, x, y (its middle, units), w (units)}. */
        done() {
          const T = tri(N);
          const xs = T.map((p) => p[0]);
          const ys = T.map((p) => p[1]);
          const m = 0.14;
          const b = { x0: Math.min(...xs) - m, y0: Math.min(...ys) - m, x1: Math.max(...xs) + m, y1: Math.max(...ys) + m };
          const c = document.createElement("canvas");
          c.width = Math.ceil((b.x1 - b.x0) * ppu);
          c.height = Math.ceil((b.y1 - b.y0) * ppu);
          const g = c.getContext("2d");
          const keep = { box: Object.assign({}, box) };
          Object.assign(box, b);
          const cx = (b.x0 + b.x1) / 2;
          const cy = (b.y0 + b.y1) / 2;
          // (an odd count ends point down: on the plate it sits point up, turned in place so its shadow still falls down-right)
          F.draw(N % 2 ? { pre: [-1, 0, 0, -1, 2 * cx, 2 * cy] } : {}, g);
          Object.assign(box, keep.box);
          return { canvas: c, x: cx, y: cy, w: b.x1 - b.x0, h: b.y1 - b.y0 };
        },
      };
      return F;
    },
  };

  Mech.define("fill", {
    station: "fill",
    view: "marble",
    async run(z, { fillings, exclude = [], pool, decoyPool }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const want = asTally(fillings);
      const kinds = Object.keys(want);
      if (!pool) pool = St.decoys(decoyPool, kinds.concat(exclude), St.knobInt(k.decoys), k.decoyPick);
      const bowl = St.vessel(S, "serving", z.X(800), z.Y(300), 1.55 * z.k);
      const ids = Cook.shuffle([...new Set(pool.concat(kinds, exclude))]);
      const items = St.ingredients(z, ids, { y: k.rowY, x0: 260, x1: 1250, maxPerRow: Math.max(1, Math.ceil(ids.length / 2)), w: 165, h: 120 });
      const got = {};
      const blobs = [];
      // Wave 6b: the picture tally in the top-right corner (spoons of each, what you did; said
      // aloud while the number is being learned), in place of a badge on every bowl
      const badge = (id) => UI.count(got[id], { id, state: "bowl" });
      const next = () => kinds.find((id) => (got[id] || 0) < want[id]) || null;
      let last = 0;
      for (;;) {
        const r = await St.freePick(z, { items, next: next(), doneOk: blobs.length > 0, doneGlow: ctx.guided && !next() });
        if (r.done) break;
        if (performance.now() - last < 220) continue; // a double tap
        last = performance.now();
        const id = r.id;
        const obj = items[id];
        got[id] = (got[id] || 0) + 1;
        badge(id);
        const blob = S.track(S.add.image(obj.x, obj.y, S.tex(`layer:${id}`)).setScale(0.26 * z.k).setDepth(D.fx));
        Cook.sfx.pop();
        const a = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(Math.random()) * 0.55;
        const p = bowl.surface();
        await S.fly(blob, p.x + Math.cos(a) * bowl.rimRx * rr, p.y + Math.sin(a) * bowl.rimRy * rr, { scale: 0.3 * z.k, duration: k.flyMs, arc: z.L(120) });
        blob.setDepth(D.item + 1);
        blob.wordId = id;
        blobs.push(blob);
        z.progress({ filled: id, n: got[id] });
      }
      // graded now: each filling, how many spoons, and nothing they said no to
      let ok = true;
      // what shouldn't be there first (so a "no X" row is marked before the rows tick)
      Object.keys(got).forEach((id) => {
        if (want[id]) return;
        ok = false;
        z.listen(false, exclude.includes(id) ? `put ${id} in (they said no)` : `put ${id} in`);
      });
      kinds.forEach((id) => {
        const g = got[id] || 0;
        const right = g === want[id];
        if (!right) {
          ok = false;
          z.listen(false, `spooned ${g}, they asked for ${want[id]}: ${id}`);
        }
        if (!ctx.guided) {
          (right ? Cook.markRight : Cook.markMiss)(id);
          if (want[id] <= 5) (right ? Cook.markRight : Cook.markMiss)(Cook.numId(want[id]));
        }
      });
      // the step has closed (Done): its rows tick, count rows too, right or not (UX 11)
      if (ctx.closeItem) ctx.closeItem(kinds);
      // a finished bowl sparkles either way: the end review says whether it was right
      Cook.sfx.right();
      S.sparkle(bowl.rim.x, bowl.rim.y);
      if (!ok) z.oops();
      UI.hideCount();
      ctx.result.fillings = Object.assign({}, got);
      return { bowl, items, blobs };
    },
  });

  // the three folds of a samosa, in design coords (the pastry centred at 800, 330)
  /*
   * Decision 94 (Zafar, 13 Oct): the Phase A fold on the samosa strip's painted art (no new art; the mini-game kept):
   * the samosa station's board and fold pictures and its three swipe lines (js/cook/stations/samosa.js META.fold /
   * foldS02, measured on the pictures); each fold steps to the next picture. The drawn sheet only if a picture fails.
   */
  const SAMOSA = "assets/cook/items/v3/samosa/";
  const STRIP = {
    v3: { w: 517, h: 297, fill: { x: 0.175, y: 0.655 }, swipes: [{ steps: [1, 2], from: [0.14, 0.66], to: [0.46, 0.66] }, { steps: [2, 3, 4], from: [0.2, 0.66], to: [0.6, 0.66] }, { steps: [4, 5, 6], from: [0.3, 0.66], to: [0.9, 0.66] }], done: { x: 0.7, y: 0.401, w: 274 } },
    s02: { w: 482, h: 149, fill: { x: 0.14, y: 0.5 }, swipes: [{ steps: [1, 2], from: [0.08, 0.5], to: [0.36, 0.5] }, { steps: [2, 3], from: [0.16, 0.5], to: [0.48, 0.5] }, { steps: [3, 4, 5, 6], from: [0.9, 0.5], to: [0.3, 0.5] }], done: { x: 0.206, y: 0.5, w: 166 } },
  };
  const STRIP_K = 1.42; // design px per fold-canvas px (the samosa station's)
  const STRIP_AT = { x: 800, y: 336 };
  const BOARD = { w: 750, h: 750 * (847 / 1397) }; // the samosa station's board (820 wide there), a little narrower: the plate sits clear of it
  async function stripArt(S) {
    const F = St.art("samosa-fold-1") ? STRIP.s02 : STRIP.v3;
    const file = (i) => (St.art(`samosa-fold-${i}`) ? St.art(`samosa-fold-${i}`).file : `${SAMOSA}fold-${i}.webp`);
    const list = [["sv3-board", SAMOSA + "board.webp"]].concat([1, 2, 3, 4, 5, 6].map((i) => [`sv3-fold-${i}`, file(i)]));
    await St.loadArt(S, list);
    return list.every(([key]) => S.textures.exists(key)) ? F : null;
  }

  const FOLDS = [
    [[640, 470], [860, 210]],
    [[960, 470], [740, 210]],
    [[630, 430], [970, 430]],
  ];
  /** One swipe along a line; resolves "done" instead if Done is pressed first (when offered). */
  function swipe(z, [[x1, y1], [x2, y2]], { minLen, minDot, doneOk, doneExpect, doneGlow }) {
    return new Promise((resolve) => {
      let start = null;
      const offs = [];
      const finish = (r) => {
        offs.forEach((o) => o());
        UI.hideDone();
        z.expect(null);
        resolve(r);
      };
      offs.push(
        z.on("pointerdown", (p) => (start = { x: p.worldX, y: p.worldY })),
        z.on("pointerup", (p) => {
          if (!start) return;
          const dx = p.worldX - start.x;
          const dy = p.worldY - start.y;
          const len = Math.hypot(dx, dy);
          const want = Math.hypot(x2 - x1, y2 - y1);
          const dot = (dx * (x2 - x1) + dy * (y2 - y1)) / (len * want || 1);
          start = null;
          if (len > want * minLen && dot > minDot) finish("fold");
          else Cook.sfx.soft();
        })
      );
      // the two-hand fold follows the finger (js/cook/hands.js)
      if (Cook.Hands) offs.push(...Cook.Hands.drag(z, "fold", { k: z.k * 0.55 }));
      if (doneOk) UI.done({ glow: doneGlow }).then(() => finish("done"));
      // open: another swipe still folds another, the child says how many (C10, NN6; contract-2, s04-fxc)
      z.expect(doneExpect ? { kind: "click", selector: "#done-btn", open: true } : { kind: "swipe", x1, y1, x2, y2 });
    });
  }

  Mech.define("fold", {
    station: "fold",
    view: "marble",
    /**
     * count: how many they asked for (Done after each samosa; graded). With
     * no count, one samosa (the Phase A fold). bowl/blobs: the filling.
     */
    async run(z, { sheet, items = {}, blobs = [], bowl, count }, k) {
      const S = z.S;
      const ctx = z.ctx;
      UI.gist(Cook.data.stations.fold.goal);
      Object.values(items).forEach((o) => {
        o.setVisible(false);
        if (o.label) o.label.setVisible(false);
      });
      // the filling bowl moves aside; finished samosas go on a plate
      const bowlAt = { x: z.X(250), y: z.Y(250) };
      if (bowl) {
        // the rim lands on bowlAt at 0.6 of the size
        const dx = bowlAt.x - (bowl.rim.x - bowl.x) * 0.6 - bowl.x;
        const dy = bowlAt.y - (bowl.rim.y - bowl.y) * 0.6 - bowl.y;
        blobs.forEach((b) => S.tweens.add({ targets: b, x: bowlAt.x + (b.x - bowl.rim.x) * 0.6, y: bowlAt.y + (b.y - bowl.rim.y) * 0.6, scale: b.scale * 0.6, duration: 400 }));
        S.tweens.add({ targets: bowl, x: bowl.x + dx, y: bowl.y + dy, scale: bowl.scale * 0.6, duration: 400 });        if (bowl.liqGraphics) bowl.liqGraphics.setVisible(false);
        await Cook.wait(420);
      }
      const plate = { x: z.X(1330), y: z.Y(640) };
      const painted = Cook.Art.sprite(S, "plate.top"); // the enamel plate (data.art.sprites), else a drawn one
      if (count && painted) {
        S.track(S.add.ellipse(plate.x + z.L(6), plate.y + z.L(10), z.L(290), z.L(280), 0x3a2410, 0.14).setDepth(D.item - 0.3));
        S.flat(painted, plate.x, plate.y, z.L(300), z.L(300), { depth: D.item - 0.2 });
      } else if (count) S.track(S.add.ellipse(plate.x, plate.y, z.L(330), z.L(150), 0xf3eee6, 1).setStrokeStyle(z.L(6), 0xb24a3a).setDepth(D.item - 0.2));
      const kinds = [...new Set(blobs.map((b) => b.wordId).filter(Boolean))];
      const F = await stripArt(S);
      // a strip-canvas point (fractions): in design px (the fold lines, as FOLDS), and in world px
      const spD = (fx, fy) => [STRIP_AT.x + (fx - 0.5) * F.w * STRIP_K, STRIP_AT.y + (fy - 0.5) * F.h * STRIP_K];
      const sp = (fx, fy) => [z.X(spD(fx, fy)[0]), z.Y(spD(fx, fy)[1])];
      if (F) {
        const board = S.track(S.add.image(z.X(STRIP_AT.x), z.Y(STRIP_AT.y - 4), "sv3-board").setDepth(D.item - 1));
        board.setDisplaySize(z.L(BOARD.w), z.L(BOARD.h));
        if (S.contactShadow) board.shadow = S.contactShadow(board);
        if (sheet) {
          sheet.destroy();
          sheet = null;
        }
      }
      const folds = F ? F.swipes.map((sw) => [spD(...sw.from), spD(...sw.to)]) : FOLDS.slice(0, k.folds);
      const g = S.track(S.add.graphics().setDepth(D.fx));
      const most = count ? count + k.maxExtra : 1;
      let made = 0;
      const done = [];
      while (made < most) {
        const fresh = !sheet || made > 0;
        if (fresh && F) sheet = S.track(S.add.image(z.X(STRIP_AT.x), z.Y(STRIP_AT.y), "sv3-fold-1").setScale(z.L(STRIP_K)).setDepth(D.item));
        else if (fresh) sheet = S.track(S.add.image(z.X(800), z.Y(330), S.tex("pastry:0")).setScale(1.1 * z.k).setDepth(D.item));
        // a scoop of the filling onto this pastry
        const scoop = [];
        if (bowl && kinds.length) {
          kinds.forEach((id, i) => {
            const s = S.track(S.add.image(bowlAt.x, bowlAt.y, S.tex(`layer:${id}`)).setScale(0.18 * z.k).setDepth(D.item + 1));
            scoop.push(s);
            // on the strip's flat end, where the first fold's triangle covers it (the art), or the sheet's middle
            const [fx, fy] = F ? sp(F.fill.x, F.fill.y) : [z.X(800), z.Y(360)];
            S.fly(s, fx + z.L((i - (kinds.length - 1) / 2) * 30), fy - z.L((i % 2) * 12), { scale: (F ? 0.18 : 0.26) * z.k, duration: 360, arc: z.L(90) });
          });
          await Cook.wait(380);
        } else if (!bowl && made === 0) blobs.forEach((b) => scoop.push(b));
        let quit = false;
        for (let f = 0; f < folds.length; f++) {
          const [[x1, y1], [x2, y2]] = folds[f].map(([x, y]) => [z.X(x), z.Y(y)]);
          g.clear();
          for (let t = 0; t < 1; t += 0.06) {
            g.lineStyle(z.L(7), 0x3a2410, 0.75);
            g.lineBetween(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, x1 + (x2 - x1) * (t + 0.03), y1 + (y2 - y1) * (t + 0.03));
          }
          g.fillStyle(0xb24a3a, 1);
          g.fillCircle(x1, y1, z.L(12));
          const offer = !!count && f === 0 && made > 0;
          const gh = S.ghost([[x1, y1], [x2, y2]], { duration: 700, delay: z.guided || (f === 0 && made === 0) ? 200 : 4000 });
          const r = await swipe(z, [[x1, y1], [x2, y2]], { minLen: k.minLen, minDot: k.minDot, doneOk: offer, doneExpect: offer && made >= count, doneGlow: offer && ctx.guided && made >= count });
          gh.stop();
          if (r === "done") {
            quit = true;
            break;
          }
          Cook.sfx.flip();
          if (F) {
            // the next picture, a quick cross-fade from the last
            const steps = F.swipes[f].steps;
            const ghostOld = S.track(S.add.image(sheet.x, sheet.y, sheet.texture.key).setScale(sheet.scaleX).setDepth(D.item + 0.1));
            sheet.setTexture(`sv3-fold-${steps[steps.length - 1]}`);
            S.tweens.add({ targets: ghostOld, alpha: 0, duration: 220, onComplete: () => ghostOld.destroy() });
          } else sheet.setTexture(S.tex(`pastry:${f + 1}`));
          if (f === 0) scoop.forEach((o) => o.setVisible(false));
          S.tweens.add({ targets: sheet, scaleX: sheet.scaleX * 1.02, duration: 90, yoyo: true });
          z.progress((f + 1) / folds.length);
        }
        g.clear();
        if (quit) {
          // the spare pastry goes back
          scoop.forEach((o) => o.destroy());
          S.tweens.add({ targets: sheet, alpha: 0, duration: 250, onComplete: () => sheet.destroy() });
          break;
        }
        made++;
        if (count) UI.count(made, { id: "ph-samosa", state: "folded" });
        S.sparkle(z.X(F ? STRIP_AT.x : 800), z.Y(F ? STRIP_AT.y : 330));
        z.skill(100, "fold");
        if (!count) break;
        // onto the plate (a picture of what you made, never a count to aim for)
        const at = { x: plate.x + ((made - 1) % 3 - 1) * z.L(90), y: plate.y - Math.floor((made - 1) / 3) * z.L(40) };
        if (F) {
          // the folded samosa flies by its own middle (the picture's canvas is the whole strip), onto the plate's flat
          // middle: closer together than the drawn ones (two or three side by side, then a row behind)
          const [mx, my] = sp(F.done.x, F.done.y);
          sheet.setOrigin(F.done.x, F.done.y).setPosition(mx, my);
          at.x = plate.x + (((made - 1) % 3) - 1) * z.L(62);
          at.y = plate.y + z.L(20) - Math.floor((made - 1) / 3) * z.L(46);
        }
        // the last fold's little scaleX pulse yoyos back to its start: stopped first, or it stretches the flown samosa wide
        S.tweens.killTweensOf(sheet);
        sheet.setScale(sheet.scaleY);
        await S.fly(sheet, at.x, at.y, { scale: F ? z.L(105) / F.done.w : 0.34 * z.k, duration: 380, arc: z.L(80) });
        done.push(sheet);
      }
      g.destroy();
      if (count) {
        const ok = made === count;
        z.listen(ok, `folded ${made}, they asked for ${count}: ph-samosa`);
        if (!ctx.guided && count <= 5) (ok ? Cook.markRight : Cook.markMiss)(Cook.numId(count));
        ctx.result.folded = made;
      }
      await Cook.wait(300);
      return count ? made : sheet;
    },
  });

  /** The samosa station: fill the bowl once, then fold as many as they asked for, on one view. */
  St.fillFold = async function (S, ctx, params = {}, opts = {}) {
    await St.begin(S, ctx, "fill", "marble");
    const z = opts.zone || Mech.zone(S, ctx, { id: "fillFold", level: opts.level || params.level || ctx.level, region: opts.region });
    const made = await Mech.run("fill", z, params);
    if (ctx.nextStep) ctx.nextStep("fold");
    const n = await Mech.run("fold", z, Object.assign({ level: params.level, count: params.count || 1 }, made));
    if (!opts.zone) z.close();
    St.end();
    return n;
  };

  // the samosa station itself is js/cook/stations/samosa.js (samosa v2); this is the Phase A fill + fold
  Mech.lab("fill", {
    name: "Fill + fold (Phase A)",
    verb: "Fill and fold",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.samosa.make(Cook.pick(["nana", "ma", "cousin"]));
      L.card(d, ["Fill", "Fold"]);
      await St.fillFold(L.S, L.ctx, { fillings: d.fillings, exclude: d.no, decoyPool: Cook.data.recipes.samosa.lists.fillings_all, count: d.count, level: L.level }, { region: L.region });
    },
  });
})(window);
