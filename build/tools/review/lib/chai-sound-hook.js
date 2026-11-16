// Chai's knob, flame and next-pan marks (run16 fix-chai: CHAI-99, CHAI-100, CHAI-113), injected by build/tools/review/chaisound.mjs
// through run.mjs's NJG_INIT. It writes marks into the sandbox's own timeline (window.__njgLog, lib/sound.mjs), next to the real
// plays it already logs ("sfx/file:knob-a", "sfx/file:flame-b": a buffer actually started):
// (as {type:"c", k:"chai-mark", m:<mark>}: the sandbox's timeline keeps only its own kinds, lib/sound.mjs timeline(); the contract checks
// ignore a k they don't know)
//   {type:"mark", k:"tap"}           the child's pointer or touch down
//   {type:"mark", k:"knob-call"}     Cook.sfx.knob asked for (o: its options)
//   {type:"mark", k:"flame-call"}    Cook.sfx.flame asked for: a knob turned on from off (js/cook/kitchen-kit.js burner set)
//   {type:"mark", k:"pour"}          a pour into a glass starts (Cook.chaiPour set)
//   {type:"mark", k:"pour-end", at}  it ends (Cook.chaiPour cleared); after the first, the player's touches are held 3 s
//   {type:"mark", k:"held"}          a touch held back in that time
(() => {
  if (window.__chaiSoundHook) return;
  window.__chaiSoundHook = true;
  const mark = (k, x) => {
    const e = Object.assign({ type: "c", k: "chai-mark", m: k, t: Date.now(), page: location.pathname.replace(/^\//, "") }, x || {});
    try {
      if (window.__njgLog) window.__njgLog(e);
      else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (err) { /* none */ }
  };
  // CHAI-99: after the first pour's end the child takes in the pour (the drop, the twinkle, the sound) before touching anything: the
  // player's touches are held back for HOLD_MS, once, so the next pan's light can come while the poured pan is still the one in hand
  // (a player that moves on at once makes the light needless, and the game rightly gives none)
  const HOLD_MS = 3000; // (the light also waits for the stage to be still, SH-253)
  let holdUntil = 0, held = false;
  ["pointerdown", "pointerup", "touchstart", "touchend", "mousedown", "mouseup", "click"].forEach((n) =>
    window.addEventListener(n, (ev) => {
      if (Date.now() < holdUntil) {
        ev.stopImmediatePropagation();
        if (ev.cancelable) ev.preventDefault();
        if (n === "pointerdown" || n === "touchstart") mark("held");
        return;
      }
      if (n === "pointerdown" || n === "touchstart") mark("tap");
    }, { capture: true, passive: false }));
  // (the pour sets Cook.chaiPour as it starts and clears it, null, as it ends: js/cook/mechanics/pour.js toGlass's hook, and chai's own
  // pour before the kit)
  const pourSet = (x) => {
    if (x) return mark("pour");
    mark("pour-end", { at: Date.now() });
    if (!held) { held = true; holdUntil = Date.now() + HOLD_MS; }
  };
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
        Object.defineProperty(C, "chaiPour", { configurable: true, get: () => v, set: (x) => { const was = v; v = x; if (x || was) pourSet(x); } });
        C.__chaiPourHook = true;
      } catch (err) { /* none */ }
    }
  }, 30);
  setTimeout(() => clearInterval(wrap), 900000);
})();
