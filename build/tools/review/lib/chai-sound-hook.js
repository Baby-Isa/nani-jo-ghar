// Chai's knob, flame and next-pan marks (run16 fix-chai: CHAI-99, CHAI-100, CHAI-113), injected by build/tools/review/chaisound.mjs
// through run.mjs's NJG_INIT. It writes marks into the sandbox's own timeline (window.__njgLog, lib/sound.mjs), next to the real
// plays it already logs ("sfx/file:knob-a", "sfx/file:flame-b": a buffer actually started):
//   {type:"mark", k:"tap"}           the child's pointer or touch down
//   {type:"mark", k:"knob-call"}     Cook.sfx.knob asked for (o: its options)
//   {type:"mark", k:"flame-call"}    Cook.sfx.flame asked for: a knob turned on from off (js/cook/kitchen-kit.js burner set)
//   {type:"mark", k:"pour"}          Cook.chaiPour set (each frame of a pour into a glass; the last one is the pour's end)
(() => {
  if (window.__chaiSoundHook) return;
  window.__chaiSoundHook = true;
  const mark = (k, x) => {
    const e = Object.assign({ type: "mark", k, t: Date.now(), page: location.pathname.replace(/^\//, "") }, x || {});
    try {
      if (window.__njgLog) window.__njgLog(e);
      else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (err) { /* none */ }
  };
  ["pointerdown", "touchstart"].forEach((n) => window.addEventListener(n, () => mark("tap"), { capture: true, passive: true }));
  const wrap = setInterval(() => {
    const C = window.Cook;
    if (!C) return;
    const fx = C.sfx;
    if (fx && !fx.__chaiHook && typeof fx.knob === "function" && typeof fx.flame === "function") {
      const k = fx.knob, f = fx.flame;
      fx.knob = function (o) { mark("knob-call", { o: o || null }); return k.apply(this, arguments); };
      fx.flame = function (o) { mark("flame-call", { o: o || null }); return f.apply(this, arguments); };
      fx.__chaiHook = true;
    }
    if (!C.__chaiPourHook) {
      let v = C.chaiPour;
      try {
        Object.defineProperty(C, "chaiPour", { configurable: true, get: () => v, set: (x) => { v = x; mark("pour"); } });
        C.__chaiPourHook = true;
      } catch (err) { /* none */ }
    }
  }, 30);
  setTimeout(() => clearInterval(wrap), 900000);
})();
