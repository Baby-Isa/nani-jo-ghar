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
  // every rolling pin picture on screen ("mv-velan": the one resting beside the board and the one the roll rides), by world y
  const pins = () => {
    const G = window.Cook && window.Cook.game;
    const scenes = (G && G.scene && G.scene.scenes) || [];
    const out = [];
    const walk = (list) => {
      for (const o of list || []) {
        if (!o) continue;
        if (o.texture && o.texture.key === "mv-velan" && o.active !== false && o.visible !== false && o.alpha !== 0) out.push(o);
        if (o.list) walk(o.list);
      }
    };
    for (const sc of scenes) if (sc && sc.children) walk(sc.children.list);
    return out.map((f) => {
      const m = f.getWorldTransformMatrix ? f.getWorldTransformMatrix() : null;
      const cam = f.scene && f.scene.cameras && f.scene.cameras.main;
      return { o: f, y: (m ? m.ty : f.y) * ((cam && cam.zoom) || 1) };
    });
  };
  // every finger shown (the kit's .ob-finger, an older .co-finger): a page can hold a still one beside the moving one
  const fingers = () =>
    [...document.querySelectorAll(".ob-finger, .co-finger")].filter((e) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return r.width > 4 && cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity > 0.1;
    });
  // the child watches the first showing: the player's touches are held back for HOLD_MS from the roll step's start, once (a player
  // that touches at once cuts the showing short, and its own roll moves the pin too)
  const HOLD_MS = 4000;
  let touched = false, cur = null, n = 0, holdUntil = 0, held = false;
  ["pointerdown", "pointerup", "pointermove", "touchstart", "touchmove", "touchend", "mousedown", "mousemove", "mouseup", "click"].forEach((t) =>
    window.addEventListener(t, (ev) => {
      if (Date.now() < holdUntil) {
        ev.stopImmediatePropagation();
        if (ev.cancelable) ev.preventDefault();
        return;
      }
      if (t === "pointerdown" || t === "touchstart") { touched = true; end(); }
    }, { capture: true, passive: false }));
  function end() {
    if (cur && cur.k > 0 && cur.k < 4) say(`MAA-20 note: a finger for ${cur.k} sample(s) only`);
    if (cur && cur.k >= 4) {
      n++;
      const span = (a) => (a.length ? Math.round(Math.max(...a) - Math.min(...a)) : 0);
      const spans = [...cur.pm.values()].map(span);
      const fsp = [...cur.fm.values()].map(span);
      say(`MAA-20 demo ${n}: finger ${fsp.length ? Math.max(...fsp) : 0} px, pin ${spans.length ? Math.max(...spans) : 0} px (${cur.k} samples, ${spans.length} pin picture(s)${spans.length ? "" : ", no pin found"})`);
    }
    cur = null;
  }
  // the roll step: the game's expectation (njgTest.cook.expectation(), what the players read) is a roll; the hold starts there, once
  const rolling = () => {
    try {
      const T = window.njgTest;
      const e = T && T.cook && T.cook.expectation ? T.cook.expectation() : null;
      return !!(e && (e.kind === "roll" || /"roll"/.test(JSON.stringify(e))));
    } catch (err) { return false; }
  };
  setInterval(() => {
    if (!held && rolling()) { held = true; holdUntil = Date.now() + HOLD_MS; say(`MAA-20 note: the roll step, the player held ${HOLD_MS} ms`); }
    const fs = fingers();
    if (!fs.length) return end();
    if (!cur) { cur = { fm: new Map(), pm: new Map(), k: 0 }; touched = false; }
    if (touched) return; // (the child's own roll moves the pin too: a touch ends a showing, the next starts after it)
    for (const e of fs) {
      if (!cur.fm.has(e)) cur.fm.set(e, []);
      cur.fm.get(e).push(e.getBoundingClientRect().top);
    }
    for (const q of pins()) {
      if (!cur.pm.has(q.o)) cur.pm.set(q.o, []);
      cur.pm.get(q.o).push(q.y);
    }
    cur.k++;
  }, 50);
})();
