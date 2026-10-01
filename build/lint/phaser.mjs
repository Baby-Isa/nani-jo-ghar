// The canvas lint: text drawn inside a Phaser scene (Cook's stations, the pantry shelf labels, chips) is not in the DOM, so the
// DOM lint (layout.mjs) cannot see it. This one walks each scene's display list (containers included), and for every Text and
// BitmapText measures what a child actually sees: the rendered size (font size x the object's and its containers' scale x the
// camera zoom x the canvas's CSS scale) and where it lands on the screen.
//
//   canvas-text-small      rendered under 14 px (TXT-05)
//   canvas-text-offscreen  runs past the edge of the canvas or the window (the canvas cuts it off)
//   canvas-text-covered    something that is not the canvas is on top of the text's middle
//
// Only visible text counts (object, containers and alpha). A thing that is moving (a tween) between two measurements is not
// reported as off screen. A finding is identified by its style (`canvas > Text[34px bold]`), not its words, because the words
// on a card change from run to run.
//
// PHASER_HOOK (addInitScript) records every Phaser.Game as it is made (window.__njgGames); Cook's own Cook.scene.game is the
// fallback. Nothing in the game is changed.

export const PHASER_HOOK = `(() => {
  if (window.__njgPhaserHook) return;
  window.__njgPhaserHook = true;
  window.__njgGames = [];
  let P;
  const wrap = (v) => {
    try {
      if (!v || !v.Game || v.Game.__njg) return;
      const G = v.Game;
      const W = function () { const g = new G(...arguments); window.__njgGames.push(g); return g; };
      W.prototype = G.prototype; W.__njg = true;
      Object.setPrototypeOf(W, G);
      v.Game = W;
    } catch (e) {}
  };
  try {
    Object.defineProperty(window, "Phaser", { configurable: true, enumerable: true, get() { return P; }, set(v) { P = v; wrap(v); } });
  } catch (e) {}
})();`;

// Runs in the page; self-contained (serialised with toString()).
export async function pagePhaserLint(opts) {
  const MIN_TEXT = (opts && opts.minText) || 14;
  const TOL = 1.5;
  const vw = window.innerWidth, vh = window.innerHeight;
  const games = (window.__njgGames || []).slice();
  if (!games.length && window.Cook && window.Cook.scene && window.Cook.scene.game) games.push(window.Cook.scene.game);
  const found = [];
  const probes = [];

  for (const game of games) {
    const canvas = game && game.canvas;
    if (!canvas || !canvas.isConnected) continue;
    const cs = getComputedStyle(canvas);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) continue;
    const cr = canvas.getBoundingClientRect();
    if (cr.width <= 0 || cr.height <= 0) continue;
    const gw = game.scale.gameSize.width, gh = game.scale.gameSize.height;
    const kx = cr.width / gw, ky = cr.height / gh; // CSS px per game px
    const clip = { left: Math.max(0, cr.left), top: Math.max(0, cr.top), right: Math.min(vw, cr.right), bottom: Math.min(vh, cr.bottom) };
    const scenes = game.scene.getScenes(true);
    for (const scene of scenes) {
      const cam = scene.cameras.main;
      const z = cam.zoom, wv = cam.worldView;
      const toCss = (wx, wy) => ({ x: cr.left + (cam.x + (wx - wv.x) * z) * kx, y: cr.top + (cam.y + (wy - wv.y) * z) * ky });
      const visit = (list, alphaIn) => {
        for (const o of list) {
          if (!o || !o.visible) continue;
          const a = alphaIn * (typeof o.alpha === "number" ? o.alpha : 1);
          if (a < 0.05) continue;
          if (o.type === "Container" && o.list) { visit(o.list, a); continue; }
          if (o.type !== "Text" && o.type !== "BitmapText" && o.type !== "DynamicBitmapText") continue;
          const text = String(o.text == null ? "" : o.text).trim();
          if (!text) continue;
          let fs = o.type === "Text" ? parseFloat(o.style && o.style.fontSize) : parseFloat(o.fontSize);
          if (!isFinite(fs) || fs <= 0) continue;
          let sy = 1;
          try { const m = o.getWorldTransformMatrix(); sy = Math.abs(m.scaleY) || 1; } catch (e) { sy = Math.abs(o.scaleY) || 1; }
          const eff = fs * sy * z * ky;
          const b = o.getBounds();
          const p0 = toCss(b.x, b.y), p1 = toCss(b.x + b.width, b.y + b.height);
          const L = Math.min(p0.x, p1.x), T = Math.min(p0.y, p1.y), R = Math.max(p0.x, p1.x), B = Math.max(p0.y, p1.y);
          const weight = o.type === "Text" ? String((o.style && o.style.fontStyle) || "").replace(/\s+/g, " ").trim() : "bitmap";
          const selector = `canvas > ${o.type}[${Math.round(fs)}px${weight ? " " + weight : ""}]`;
          const word = text.replace(/\s+/g, " ").slice(0, 30);
          if (eff < MIN_TEXT - 0.05) found.push({ check: "canvas-text-small", selector, measured: eff.toFixed(1) + "px", text: word, detail: `font-size ${fs}px x scale ${(sy * z * ky).toFixed(2)}` });
          const px = Math.max(clip.left - L, clip.top - T, R - clip.right, B - clip.bottom);
          if (px > TOL && R > L && B > T) {
            const f = { check: "canvas-text-offscreen", selector, measured: `${Math.round(px)}px outside the canvas or the screen`, text: word };
            found.push(f); probes.push([f, o, { x: b.x, y: b.y }]);
          }
          // covered: the topmost element at the middle of the part that is on screen
          const cx = (Math.max(L, clip.left) + Math.min(R, clip.right)) / 2, cy = (Math.max(T, clip.top) + Math.min(B, clip.bottom)) / 2;
          if (cx > 0 && cy > 0 && cx < vw && cy < vh) {
            const top = document.elementFromPoint(cx, cy);
            if (top && top !== canvas && !canvas.contains(top)) {
              // a full-screen scrim or modal over everything is by design
              let scrim = false;
              for (let n = top; n && n !== document.documentElement; n = n.parentElement) {
                const c = getComputedStyle(n), r = n.getBoundingClientRect();
                if ((c.position === "fixed" || c.position === "absolute") && r.width >= vw * 0.9 && r.height >= vh * 0.9 && n !== document.body) { scrim = true; break; }
                if (n.matches && n.matches(".njg-onboard, [role=dialog], dialog, [aria-modal=true]")) { scrim = true; break; }
              }
              if (!scrim) {
                const tag = top.tagName.toLowerCase() + (top.id ? "#" + top.id : typeof top.className === "string" && top.className.trim() ? "." + top.className.trim().split(/\s+/)[0] : "");
                found.push({ check: "canvas-text-covered", selector, measured: `covered by ${tag}`, text: word, detail: tag });
              }
            }
          }
        }
      };
      visit(scene.children.list, 1);
    }
  }
  if (probes.length) {
    await new Promise((r) => setTimeout(r, 120));
    for (const [f, o, was] of probes) {
      try {
        const b = o.getBounds();
        if (Math.abs(b.x - was.x) > 1.5 || Math.abs(b.y - was.y) > 1.5) found.splice(found.indexOf(f), 1); // moving: passing through
      } catch (e) { found.splice(found.indexOf(f), 1); } // gone
    }
  }
  // one finding per (check, selector): the worst-looking first (smallest size)
  const num = (f) => { const n = parseFloat(f.measured); return isNaN(n) ? 1e9 : n; };
  found.sort((a, b) => num(a) - num(b));
  const seen = new Map();
  for (const f of found) { const k = f.check + "|" + f.selector; if (!seen.has(k)) seen.set(k, f); else seen.get(k).count = (seen.get(k).count || 1) + 1; }
  return Array.from(seen.values());
}

export async function lintPhaser(page, opts = {}) {
  return page.evaluate(`(${pagePhaserLint.toString()})(${JSON.stringify(opts)})`);
}
