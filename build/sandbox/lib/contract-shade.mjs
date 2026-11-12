// s19-clean-a4 (SH-268, Zafar 12 Nov: "We decided to implement these shadows from a global upper left light source across all the
// game modes"): every object standing on the worktop casts the kit's soft shadow down and to the right, from the canvas itself.
// Registered in lib/contract.mjs (SHADE_CHECKS, checkShade) and probed by SHADE_HOOK (appended to CONTRACT_HOOK in lib/contract-hook.mjs).
//   contract-120 worktop-shadow  every worktop object on the play area (a vessel, a tray, the grill, a board, a plate, a bowl: a picture
//                                in the item band, big enough to stand on the worktop, not inside a bigger one) held on screen has
//                                its soft shadow (the kit's: obj.shadow, drawn and seen), and the shadow lies down and to the right
// What it reads: the s19shade samples (below). The audit table (build/reports/s19-clean-a4.md) is the same samples per game.
export const SHADE_MIN = 0.07;    // a worktop object: its smaller side at least this share of the play area's smaller side (smaller: a part)
export const SHADE_DEPTH = [1, 40]; // above the background up to the effects (js/cook/stations.js D: bg 0, back 5, occ 20, item 30, front 34, fx 40):
                                    // the worktop's things, a board laid on it (chop's, bg + 1.6) to the trays; the people's band (char 10, 8-16) left out
export const SHADE_PEOPLE = [8, 16];
export const SHADE_MAX = 0.7;     // a picture wider or taller than this share of the play area is a background or a band, not a thing on it
export const SHADE_HOLD_MS = 1200; // an object judged once seen this long in place (a thing flying or being carried is not on the worktop)
export const SHADE_INSIDE = 1.6;  // a picture whose middle lies in one this many times its size, under it, is inside it (a glass on a tray, food in a pan)
export const SHADE_SKIP = /shadow|shade|glow|hand|badge|face|bubble|ring|steam|flame|spark|smoke|light|halo|arrow|tick|cross|label|chip|pill|dot|mark|veil|quiet|mask|cover|occ|front|lip|rim|fx|wisp|drip|splash|pour|stream|crumb|burst|-(happy|neutral|frown|sad)$/i;

const isCookFlow = (flow) => /^(cook:|lab:cook\/)/.test(flow || "");

export const SHADE_CHECKS = {
  "contract-120": { item: "worktop-shadow", title: "every worktop object casts the kit's soft shadow, down and to the right", how: `Cook flows. Every s19shade sample (lib/contract-shade.mjs SHADE_HOOK: the play area's pictures above the background up to the effects, depth ${SHADE_DEPTH[0]}-${SHADE_DEPTH[1]} less the people's ${SHADE_PEOPLE[0]}-${SHADE_PEOPLE[1]}, none wider or taller than ${Math.round(SHADE_MAX * 100)}% of the play area (a background, a band), seen, their smaller side at least ${Math.round(SHADE_MIN * 100)}% of the play area's, not inside a bigger picture under them, ${SHADE_INSIDE} times their size: a glass on the tray, food in a pan, CK-21's dish on the serving tray), each object seen in place ${SHADE_HOLD_MS} ms: no shadow of its own drawn and seen (obj.shadow: the kit's helpers, Cook.Kit.shadow, the stations' contactShadow, the grill kit's), or a shadow whose middle is not down and to the right of the object's (one light from the upper left), is a break, once per picture per page (SH-268, Zafar 12 Nov: "the trays and the barbecue create subtle shadows ... from a global upper left light source across all the game modes"; art-bible "Shadow rules": nothing floats).` },
};

// down and to the right of the thing's middle (its box's, or its body's: the picture's origin inside it, a pan's round body)
export const lowerRight = (sh) => (sh.dx > 0 && sh.dy > 0) || (sh.ox != null && sh.ox > 0 && sh.oy > 0);

export function check120(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const said = new Set();
  const seen = new Map(); // key -> {t, x, y}
  const S = tl.filter((e) => e.type === "c" && e.k === "s19shade");
  for (let i = 0; i < S.length; i++) {
    const e = S[i];
    const tNext = S[i + 1] ? S[i + 1].t : (tl.length ? tl[tl.length - 1].t : e.t);
    for (const o of e.objs || []) {
      if (o.inside || said.has(o.key)) continue;
      const s0 = seen.get(o.key);
      const here = s0 && Math.abs(s0.x - o.x) < 6 && Math.abs(s0.y - o.y) < 6;
      if (!here) seen.set(o.key, { t: e.t, x: o.x, y: o.y });
      const since = here ? s0.t : e.t;
      if (tNext - since < SHADE_HOLD_MS) continue;
      if (!o.sh) { said.add(o.key); add("contract-120", e.t, `${o.key} stands on the worktop (${o.w}x${o.h} at ${o.x},${o.y}, depth ${o.d}) with no soft shadow of its own (SH-268: one light, upper left)`); continue; }
      if (!lowerRight(o.sh)) { said.add(o.key); add("contract-120", e.t, `${o.key}'s shadow is not down and to the right (its middle ${o.sh.dx},${o.sh.dy} px from the object's; SH-268: one light, upper left)`); }
    }
  }
}

export function checkShade(r, tl, v, add) {
  check120(r, tl, add);
}

// The audit, per page: every worktop object seen, with or without its shadow (the report's table reads it from a run's results)
export function shadeAudit(tl) {
  const m = new Map();
  for (const e of tl.filter((x) => x.type === "c" && x.k === "s19shade")) {
    for (const o of e.objs || []) {
      const a = m.get(o.key) || { key: o.key, inside: true, sh: false, dir: true, n: 0 };
      a.n++;
      a.inside = a.inside && !!o.inside;
      if (o.sh) { a.sh = true; if (!lowerRight(o.sh)) a.dir = false; }
      m.set(o.key, a);
    }
  }
  return [...m.values()];
}

// ---- the probe: what contract-120 reads. A function, not a string: the page gets its source ----
//   k: "s19shade" {objs: [{key, x, y, w, h, d, inside, sh: {dx, dy} | null}]} (game units), when the set changes
function shadehook(MIN, D0, D1, INSIDE, SKIP, P0, P1, MAX) {
  if (window.__njgShadeHook) return;
  window.__njgShadeHook = true;
  const skip = new RegExp(SKIP, "i");
  const emit = (e) => {
    try {
      e.type = "c"; e.t = Date.now(); e.page = location.pathname.replace(/^\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) { /* a probe only */ }
  };
  let last = "";
  setInterval(() => {
    try {
      const g = (window.__njgGames || []).concat(window.Cook && window.Cook.game ? [window.Cook.game] : []).find((x) => x && x.canvas && x.canvas.isConnected && x.scene);
      if (!g) return;
      const W = g.scale ? g.scale.width : g.canvas.width, H = g.scale ? g.scale.height : g.canvas.height;
      const min = Math.min(W, H) * MIN;
      const list = [];
      for (const sc of g.scene.getScenes(true)) {
        // (a shadow drawn from a picture's own outline by a game's own helper, not linked as obj.shadow: its key is "<picture>:shade:<blur>")
        const shades = new Map();
        for (const o of sc.children.list) {
          const k = o && o.texture && o.texture.key;
          const m = k && /^(.*):shade:\d+$/.exec(k);
          if (m && o.visible !== false) (shades.get(m[1]) || shades.set(m[1], []).get(m[1])).push(o);
        }
        for (const o of sc.children.list) {
          if (!o || o.visible === false || (o.alpha != null && o.alpha < 0.5)) continue;
          if (!(o.type === "Image" || o.type === "Sprite" || o.type === "Container")) continue;
          if (o.depth < D0 || o.depth >= D1 || (o.depth >= P0 && o.depth < P1)) continue;
          const key = (o.texture && o.texture.key) || o.name || (o.type === "Container" ? "container" : "");
          if (!key || key === "__DEFAULT" || key === "__MISSING" || skip.test(key)) continue;
          if (o.isShadow || o.njgShadow) continue;
          let b;
          try { b = o.getBounds(); } catch (e) { continue; }
          if (!b || b.width < min || b.height < min || b.width > W * MAX || b.height > H * MAX) continue;
          if (b.right < 0 || b.bottom < 0 || b.left > W || b.top > H) continue;
          let sh = null;
          let s = o.shadow;
          if (!s && shades.has(key)) {
            // (the nearest outline shadow of this picture)
            const near = shades.get(key).map((x) => ({ x, d: Math.hypot(x.x - o.x, x.y - o.y) })).sort((a, c) => a.d - c.d)[0];
            if (near && near.d < Math.max(b.width, b.height) * 0.25) s = near.x;
          }
          if (s && s.active && s.visible !== false && (s.alpha == null || s.alpha > 0.03) && !s.lifted) {
            let sb;
            try { sb = s.getBounds(); } catch (e) { sb = null; }
            if (sb) {
              sh = { dx: Math.round(sb.centerX - b.centerX), dy: Math.round(sb.centerY - b.centerY) };
              // (a pan placed by its round body, its handle out to one side: the shadow is the body's, judged from the body's middle,
              // the picture's origin, when that lies inside it)
              const ox = o.originX, oy = o.originY;
              if (o.type !== "Container" && ox > 0.05 && ox < 0.95 && oy > 0.05 && oy < 0.95) (sh.ox = Math.round(sb.centerX - o.x)), (sh.oy = Math.round(sb.centerY - o.y));
            }
          } else if (s && s.lifted) sh = { dx: 1, dy: 1, lifted: true };
          list.push({ key, x: Math.round(b.centerX), y: Math.round(b.centerY), w: Math.round(b.width), h: Math.round(b.height), d: Math.round(o.depth * 10) / 10, sh });
        }
      }
      // (inside: a picture whose middle lies in a bigger one under it)
      for (const a of list) {
        a.inside = list.some((c) => c !== a && c.d <= a.d && c.w * c.h >= a.w * a.h * INSIDE && Math.abs(a.x - c.x) < c.w / 2 && Math.abs(a.y - c.y) < c.h / 2) || undefined;
      }
      list.sort((a, b) => (a.key < b.key ? -1 : 1));
      const sig = JSON.stringify(list.map((o) => [o.key, Math.round(o.x / 8), Math.round(o.y / 8), !!o.sh, o.inside]));
      if (sig === last) return;
      last = sig;
      emit({ k: "s19shade", W, H, objs: list });
    } catch (e) { /* a probe only */ }
  }, 400);
}
export const SHADE_HOOK = `(${shadehook.toString()})(${SHADE_MIN}, ${SHADE_DEPTH[0]}, ${SHADE_DEPTH[1]}, ${SHADE_INSIDE}, ${JSON.stringify(SHADE_SKIP.source)}, ${SHADE_PEOPLE[0]}, ${SHADE_PEOPLE[1]}, ${SHADE_MAX})`;
