/*
 * Cook with Nani: first-time onboarding by showing, not telling (Wave 6,
 * docs/UX-PRINCIPLES.md 8; Wave 6b, 10: the shared kit and a script per
 * station).
 *
 * Wave 6b: each kept station has an ONBOARDING SCRIPT in data
 * (data.onboard.<station>: the moves the overlay shows, in order, and what
 * each one is), run by the shared onboarding kit (js/shared/onboard.js):
 * everything dims except the next thing to do, a ghost hand does the move
 * once (a tap, a swipe, a stir round the pot, a roll up and down), the
 * child does it, then the next thing is shown. After the script's moves the
 * overlay is gone for good at that station (once per profile, through
 * js/shared/uistore.js), and the light bulb is the help.
 *
 * The spotlight follows Cook.expect, the "what to do next" every station
 * already publishes (for the test harness and Nani's glow): a world point
 * for taps, rings and gestures, or a page selector for buttons (the tick,
 * "Go to the barbecue"). A step ends when the child has done it: the thing
 * to do changes, or a tap/gesture was made (Cook.acted). The gesture the
 * ghost shows is the script's `do` (build/test_cook.py checks each script
 * against the moves the station really asks for).
 * Safety: if there's nothing to point at for a moment (Nani talking, a
 * "pass me", a panel), the overlay steps back and the script ends, so it
 * can never trap a child.
 *
 * Without the shared kit (a page that doesn't load it) it falls back to the
 * Wave 6 overlay (#coach), which never takes a tap.
 */
(function (global) {
  const Cook = global.Cook;
  const C = (Cook.Coach = {});
  const $ = (s) => document.querySelector(s);
  let live = null;

  const calm = () => (Cook.data && Cook.data.calm) || {};
  const scripts = () => (Cook.data && Cook.data.onboard) || {};
  const OB = () => global.Onboard;
  const obId = (key) => `cook/${key}`;
  /** Has this station been shown already? */
  C.seen = (key) => !!(Cook.save.coached || {})[key] || !!(OB() && OB().seen(obId(key)));
  C.active = () => !!live;
  /** The script for a station (data.onboard), or null. */
  C.script = (key) => {
    const s = scripts()[key];
    return Array.isArray(s) && s.length ? s : null;
  };

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
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, r, move: "swipe", dx: b.x - a.x, dy: b.y - a.y, a, b };
    }
    if (e.x == null) return null;
    const p = UI.worldToScreen(e.x, e.y);
    const size = (e.rx || e.r || 90) * k;
    const move = { hold: "hold", roll: "roll", stir: "stir", knead: "tap", timing: "tap" }[e.kind] || "tap";
    return { x: p.x, y: p.y, r: Math.max(46, size + 26 * k), move, rr: size };
  }
  C.target = target;

  /* ---------------- the shared kit (Wave 6b) ---------------- */
  // the ghost's gesture for an expectation: the kit's names
  const GESTURE = { tap: "tap", swipe: "swipe", roll: "drag", stir: "circle-stir", hold: "hold" };
  const rectAround = (t, r) => [t.x - r, t.y - r, 2 * r, 2 * r];
  /** A step's signature: it changes when the child has done the thing (never on movement alone). */
  const sig = (e) => (e ? [e.kind, e.key || "", e.selector || "", Cook.acted || 0, e.kind === "stir" && typeof e.count === "function" ? e.count() : ""].join("|") : "");

  function runKit(key, script, state) {
    const Onboard = OB();
    const cur = () => (live === state ? target(Cook.expect) : null);
    // the spotlight: the thing to do next (the whole picture for a chop swipe: the vegetables fly)
    const spot = () => {
      const t = cur();
      if (!t) return null;
      if (Cook.expect && Cook.expect.kind === "slice") {
        const c = document.querySelector("#game canvas");
        return c || null;
      }
      return rectAround(t, t.r);
    };
    const steps = script.map((st, i) => ({
      spotlight: spot,
      ghost: {
        // the script's move (data.onboard: tap, swipe, stir, roll, hold)
        gesture: GESTURE[st.do] || "tap",
        from: () => {
          const t = cur();
          if (!t) return null;
          if (t.a) return rectAround(t.a, 8);
          if (t.move === "roll") return rectAround({ x: t.x, y: t.y - t.rr * 0.6 }, 8);
          return rectAround(t, Math.max(8, t.move === "stir" ? t.rr : 8));
        },
        to: () => {
          const t = cur();
          if (!t) return null;
          if (t.b) return rectAround(t.b, 8);
          if (t.move === "roll") return rectAround({ x: t.x, y: t.y + t.rr * 0.6 }, 8);
          return rectAround(t, 8);
        },
      },
      wait: "cook-next",
      note: st.what || "",
      i,
    }));
    state.kit = true;
    Onboard.run(obId(key), steps, { idleMs: 6000 }).then(() => {
      if (live === state) C.stop(true);
    });
  }

  /**
   * Coach station `key` (once ever): spotlight each next thing to do, as its
   * script says (data.onboard), until C.stop() (the station ends).
   */
  C.start = function (key, { force = false } = {}) {
    C.stop();
    if (!force && C.seen(key)) return;
    const script = C.script(key);
    const useKit = !!(OB() && script);
    const box = $("#coach");
    if (!useKit && !box) return;
    const steps = useKit ? script.length : calm().coachSteps || 4;
    const state = { key, shown: 0, last: null, timer: null, started: false, lost: 0 };
    live = state;
    const tick = () => {
      if (live !== state) return;
      const e = Cook.expect;
      // Nani's "pass me", a panel, the request card or the end-of-round screen: step back
      const busy = Cook.interrupting || !$("#passme").classList.contains("hidden") || (Cook.UI.panelOpen && Cook.UI.panelOpen()) || (e && e.intro) || !!document.querySelector(".njg-results");
      const t = busy ? null : target(e);
      const s = t ? sig(e) : "";
      if (useKit) {
        if (!state.started) {
          // start once there's a first thing to point at
          if (t) {
            state.started = true;
            state.last = s;
            runKit(key, script, state);
          }
          return;
        }
        if (!t) {
          // nothing to point at for a moment: the overlay steps back (it never traps a child)
          if ((state.lost += 120) > 2500) C.stop(true);
          return;
        }
        state.lost = 0;
        if (s !== state.last) {
          state.last = s;
          OB().signal("cook-next");
        }
        return;
      }
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
    const state = live;
    clearInterval(state.timer);
    live = null;
    if (done) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[state.key] = true;
    }
    const a = OB() && OB().active();
    if (state.kit && a && a.id === obId(state.key)) a.skip();
    draw(null);
  };

  /* ---------------- the Wave 6 fallback overlay (no shared kit) ---------------- */
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
})(window);
