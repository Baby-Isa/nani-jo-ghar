// MAA-20's page hook (run16 fix-chai), injected by build/tools/review/maa20.mjs through run.mjs's NJG_INIT: maani's roll demo
// (Zafar, 8 Nov: "we need the rolling pin to go up and down and the finger dragging it up and down and just one finger"). Every 50 ms
// while the demo's finger shows (the kit's .ob-finger, or an older .co-finger), and before the child's first touch of that showing,
// it notes the finger's screen y and the rolling pin's (the Phaser picture "mv-velan", by its world y). At the end of each showing it
// reports through console.error (the sandbox keeps a page's console errors):
//   "MAA-20 demo <n>: finger <a> px, pin <b> px (<k> samples)"   how far each travelled up and down in that showing
(() => {
  if (window.__maa20) return;
  window.__maa20 = true;
  const say = (s) => { try { console.error(s); } catch (e) { /* none */ } };
  const pin = () => {
    const G = window.Cook && window.Cook.game;
    const scenes = (G && G.scene && G.scene.scenes) || [];
    const walk = (list) => {
      for (const o of list || []) {
        if (!o) continue;
        if (o.texture && o.texture.key === "mv-velan" && o.active !== false && o.visible !== false) return o;
        if (o.list) { const f = walk(o.list); if (f) return f; }
      }
      return null;
    };
    for (const sc of scenes) {
      const f = sc && sc.children && walk(sc.children.list);
      if (f) {
        const m = f.getWorldTransformMatrix ? f.getWorldTransformMatrix() : null;
        const cam = sc.cameras && sc.cameras.main;
        return (m ? m.ty : f.y) * ((cam && cam.zoom) || 1);
      }
    }
    return null;
  };
  const finger = () => {
    const el = [...document.querySelectorAll(".ob-finger, .co-finger")].find((e) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return r.width > 4 && cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity > 0.1;
    });
    return el ? el.getBoundingClientRect().top : null;
  };
  // the child watches the first showing: the player's touches are held back for HOLD_MS from the demo's first finger, once (a player
  // that touches at once cuts the showing short, and its own roll moves the pin too)
  const HOLD_MS = 2500;
  let touched = false, cur = null, n = 0, holdUntil = 0, held = false;
  ["pointerdown", "pointerup", "pointermove", "touchstart", "touchmove", "touchend", "mousedown", "mousemove", "mouseup", "click"].forEach((t) =>
    window.addEventListener(t, (ev) => {
      if (Date.now() < holdUntil) {
        ev.stopImmediatePropagation();
        if (ev.cancelable) ev.preventDefault();
        return;
      }
      if (t === "pointerdown" || t === "touchstart") touched = true;
    }, { capture: true, passive: false }));
  const end = () => {
    if (cur && cur.k >= 4) {
      n++;
      const span = (a) => (a.length ? Math.round(Math.max(...a) - Math.min(...a)) : 0);
      say(`MAA-20 demo ${n}: finger ${span(cur.f)} px, pin ${span(cur.p)} px (${cur.k} samples${cur.p.length ? "" : ", no pin found"})`);
    }
    cur = null;
  };
  setInterval(() => {
    const fy = finger();
    if (fy == null) return end();
    if (!cur) {
      cur = { f: [], p: [], k: 0 };
      touched = false;
      if (!held) { held = true; holdUntil = Date.now() + HOLD_MS; }
    }
    if (touched) return; // (the child's own roll moves the pin too: only the demo's own frames count)
    const py = pin();
    cur.f.push(fy);
    if (py != null) cur.p.push(py);
    cur.k++;
  }, 50);
})();
