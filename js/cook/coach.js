/*
 * Cook with Nani: first-time onboarding by showing, not telling (Wave 6,
 * docs/UX-PRINCIPLES.md 8).
 *
 * The first time a player meets a station, everything dims except one
 * thing, a ghost finger does the move once (tap, hold, swipe, roll, stir),
 * the child does it, and then the next thing is shown. After the first
 * few moves (data.calm.coachSteps) the overlay is gone for good at that
 * station; from then on the light bulb is the help.
 *
 * It needs nothing from the stations: it follows Cook.expect, the "what
 * to do next" every station already publishes (for the test harness and
 * Nani's glow): a world point for taps, holds, rings and gestures, or a
 * page selector for buttons (the tick, "Go to the barbecue"). The overlay
 * never takes a tap (pointer-events: none), so it can't block play.
 * Seen stations are kept in Cook.save.coached.
 */
(function (global) {
  const Cook = global.Cook;
  const C = (Cook.Coach = {});
  const $ = (s) => document.querySelector(s);
  let live = null;

  const calm = () => (Cook.data && Cook.data.calm) || {};
  /** Has this station been shown already? */
  C.seen = (key) => !!(Cook.save.coached || {})[key];
  C.active = () => !!live;

  /** Where the thing to do is, on the page: {x, y, r} (a circle) plus the finger's move. */
  function target(e) {
    if (!e || e.kind === "wait" || e.intro) return null;
    const UI = Cook.UI;
    const canvas = document.querySelector("#game canvas");
    if (!canvas) return null;
    const k = canvas.getBoundingClientRect().width / 1600;
    if (e.kind === "click") {
      const el = e.selector && document.querySelector(e.selector);
      if (!el || !el.offsetParent) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: Math.max(b.width, b.height) / 2 + 12, move: "tap" };
    }
    if (e.x1 != null) {
      const a = UI.worldToScreen(e.x1, e.y1);
      const b = UI.worldToScreen(e.x2, e.y2);
      const r = Math.hypot(b.x - a.x, b.y - a.y) / 2 + 60 * k;
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, r, move: "swipe", dx: b.x - a.x, dy: b.y - a.y };
    }
    if (e.x == null) return null;
    const p = UI.worldToScreen(e.x, e.y);
    const size = (e.rx || e.r || 90) * k;
    const move = { hold: "hold", roll: "roll", stir: "stir", knead: "tap", timing: "tap" }[e.kind] || "tap";
    return { x: p.x, y: p.y, r: Math.max(46, size + 26 * k), move, rr: size };
  }

  function draw(t) {
    const box = $("#coach");
    if (!box) return;
    if (!t) {
      box.classList.add("hidden");
      return;
    }
    box.classList.remove("hidden");
    const hole = box.querySelector(".co-hole");
    hole.style.left = `${t.x - t.r}px`;
    hole.style.top = `${t.y - t.r}px`;
    hole.style.width = hole.style.height = `${t.r * 2}px`;
    const f = box.querySelector(".co-finger");
    f.className = `co-finger m-${t.move}`;
    f.style.left = `${t.x}px`;
    f.style.top = `${t.y}px`;
    f.style.setProperty("--dx", `${t.dx || 0}px`);
    f.style.setProperty("--dy", `${t.dy || 0}px`);
    f.style.setProperty("--rr", `${Math.max(20, t.rr || 40)}px`);
  }

  /**
   * Coach station `key` (once ever): spotlight each next thing to do, up to
   * `steps` of them, until C.stop() (the station ends).
   */
  C.start = function (key, { force = false } = {}) {
    C.stop();
    if (!force && C.seen(key)) return;
    const steps = calm().coachSteps || 4;
    const box = $("#coach");
    if (!box) return;
    const state = { key, shown: 0, last: null, timer: null };
    live = state;
    const sig = (e) => (e ? [e.kind, e.key || "", e.selector || "", Math.round((e.x || e.x1 || 0) / 40), Math.round((e.y || e.y1 || 0) / 40)].join("|") : "");
    const tick = () => {
      if (live !== state) return;
      const e = Cook.expect;
      // Nani's "pass me", a panel, or the request card: step back
      const busy = Cook.interrupting || !$("#passme").classList.contains("hidden") || (Cook.UI.panelOpen && Cook.UI.panelOpen()) || (e && e.intro);
      const t = busy ? null : target(e);
      const s = t ? sig(e) : "";
      if (t && s !== state.last) {
        // a new thing to do: the next spotlight (the child did the last one)
        if (state.last) state.shown++;
        state.last = s;
        if (state.shown >= steps) return C.stop(true);
      }
      draw(t);
    };
    state.timer = setInterval(tick, 120);
    tick();
  };
  /** The station ended (or the coaching is used up): the overlay goes, and this station counts as seen. */
  C.stop = function (done = true) {
    if (!live) return;
    clearInterval(live.timer);
    if (done) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[live.key] = true;
    }
    live = null;
    draw(null);
  };
})(window);
