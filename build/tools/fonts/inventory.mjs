// The type inventory of whatever is on screen (fonts across the game, 6 Nov): every visible DOM text and every Phaser text, with its
// font (the family the browser actually drew it in, from the first family in the stack that is loaded), size in CSS px, weight,
// style, letter-spacing, ink and box. Runs in the page (serialised with toString()); nothing in the game is changed.
export function pageInventory() {
  const out = [];
  const vw = innerWidth, vh = innerHeight;
  const loaded = (fam, w, st) => {
    try { return document.fonts.check(`${st} ${w} 16px ${fam}`); } catch (e) { return false; }
  };
  const drawnFace = (stack, w, st) => {
    for (const raw of String(stack).split(",")) {
      const f = raw.trim().replace(/^["']|["']$/g, "");
      if (!f) continue;
      if (/^(serif|sans-serif|system-ui|-apple-system|monospace|ui-monospace|cursive)$/.test(f)) return f + " (generic)";
      // a face the page declares and has loaded, or a local one
      const declared = [...document.fonts].some((ff) => ff.family.replace(/["']/g, "") === f);
      if (declared ? [...document.fonts].some((ff) => ff.family.replace(/["']/g, "") === f && ff.status === "loaded") : loaded(`"${f}"`, w, st)) return f;
    }
    return "(fallback)";
  };
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.nodeValue.replace(/\s+/g, " ").trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.right < 0 || r.bottom < 0 || r.left > vw || r.top > vh) continue;
    let vis = true, op = 1;
    for (let p = el; p && p !== document.documentElement; p = p.parentElement) {
      const c = getComputedStyle(p);
      if (c.display === "none" || c.visibility === "hidden") { vis = false; break; }
      op *= parseFloat(c.opacity);
    }
    if (!vis || op < 0.05) continue;
    const c = getComputedStyle(el);
    const path = [];
    for (let p = el; p && p !== document.body && path.length < 3; p = p.parentElement) {
      const cls = typeof p.className === "string" ? p.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".") : "";
      path.unshift(p.tagName.toLowerCase() + (p.id ? "#" + p.id : "") + (cls ? "." + cls : ""));
    }
    out.push({ kind: "dom", sel: path.join(" > "), text: t.slice(0, 40), stack: c.fontFamily, face: drawnFace(c.fontFamily, c.fontWeight, c.fontStyle), px: Math.round(parseFloat(c.fontSize) * 10) / 10, weight: c.fontWeight, style: c.fontStyle, ls: c.letterSpacing, ink: c.color, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  }
  // Phaser: each scene's display list (containers included), the rendered size as the canvas lint measures it (build/lint/phaser.mjs)
  const games = (window.__njgGames || []).slice();
  if (!games.length && window.Cook && window.Cook.scene && window.Cook.scene.game) games.push(window.Cook.scene.game);
  for (const game of games) {
    const canvas = game && game.canvas;
    if (!canvas || !canvas.isConnected) continue;
    const cr = canvas.getBoundingClientRect();
    if (cr.width <= 0) continue;
    const ky = cr.height / game.scale.gameSize.height, kx = cr.width / game.scale.gameSize.width;
    for (const scene of game.scene.getScenes(true)) {
      const cam = scene.cameras.main, z = cam.zoom, wv = cam.worldView;
      const visit = (list, a0) => {
        for (const o of list) {
          if (!o || !o.visible) continue;
          const a = a0 * (typeof o.alpha === "number" ? o.alpha : 1);
          if (a < 0.05) continue;
          if (o.type === "Container" && o.list) { visit(o.list, a); continue; }
          if (o.type !== "Text") continue;
          const text = String(o.text || "").replace(/\s+/g, " ").trim();
          if (!text) continue;
          let sy = 1;
          try { sy = Math.abs(o.getWorldTransformMatrix().scaleY) || 1; } catch (e) { sy = Math.abs(o.scaleY) || 1; }
          const fs = parseFloat(o.style.fontSize);
          const b = o.getBounds();
          const x = cr.left + (cam.x + (b.x - wv.x) * z) * kx, y = cr.top + (cam.y + (b.y - wv.y) * z) * ky;
          if (x > vw || y > vh || x + b.width * z * kx < 0) continue;
          out.push({ kind: "canvas", sel: `canvas Text[${fs}px ${o.style.fontStyle}]`, text: text.slice(0, 40), stack: o.style.fontFamily, face: drawnFace(o.style.fontFamily, /\d{3}/.exec(o.style.fontStyle || "") ? /\d{3}/.exec(o.style.fontStyle)[0] : /bold/.test(o.style.fontStyle) ? "700" : "400", /italic/.test(o.style.fontStyle) ? "italic" : "normal"), px: Math.round(fs * sy * z * ky * 10) / 10, weight: o.style.fontStyle, style: "", ls: "", ink: o.style.color, x: Math.round(x), y: Math.round(y), w: Math.round(b.width * z * kx), h: Math.round(b.height * z * ky) });
        }
      };
      visit(scene.children.list, 1);
    }
  }
  return out;
}
