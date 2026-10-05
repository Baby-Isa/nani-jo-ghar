#!/usr/bin/env node
/*
 * C4 (decision 45): Cook mounts and unmounts cleanly. On lab.html (no mode: a bare host page), Cook's needs are loaded
 * the way the shell loads them (js/cook/main.js NEEDS), then Cook is mounted in an element, a station is started and
 * left running a moment, and Cook is unmounted, five times in a row. After every unmount nothing of Cook's may be left:
 *   - listeners on the page (window, document, <body>, visualViewport) beyond what was there before the first mount
 *   - timers and intervals still pending that Cook started (counted from before the first mount), animation frames
 *   - canvases, Cook's screen (#app, #overlay, #coach), the element's children, new <body> children
 *   - Cook's lifetime (js/cook/life.js open()) empty; audio contexts closed; <body> classes as before
 *   - no page errors
 * And: no Cook global (window.Cook, window.__cook) on the host page; no iframe.
 *   COOK_TEST_PORT=8818 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/test_cook_mount.mjs [--times 5] [--station fetch]
 */
import { BASE, startServer, launch, newPage, sleep } from "./sandbox/lib/env.mjs";
import { NEEDS } from "../js/cook/main.js";

const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const TIMES = +arg("--times", 5);
const STATION = arg("--station", "chai-tray");
let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : "  FAIL"} ${what}`);
};

// counts what the page has running, from the first script on (before any page code)
const PROBE = () => {
  const W = window;
  const live = { listeners: new Map(), timers: new Map(), intervals: new Map(), frames: new Set(), audio: [] };
  const key = (t) => (t === W ? "window" : t === W.document ? "document" : t === (W.document && W.document.body) ? "body" : t === W.visualViewport ? "visualViewport" : null);
  const add = EventTarget.prototype.addEventListener;
  const rem = EventTarget.prototype.removeEventListener;
  const cap = (o) => (typeof o === "boolean" ? o : !!(o && o.capture));
  EventTarget.prototype.addEventListener = function (type, fn, o) {
    const k = key(this);
    if (k && fn) {
      const id = `${k}|${type}|${cap(o)}`;
      const set = live.listeners.get(id) || new Set();
      if (!set.has(fn)) {
        set.add(fn);
        live.listeners.set(id, set);
        if (o && o.once) {
          const self = this;
          add.call(self, type, () => set.delete(fn), { once: true, capture: cap(o) });
        }
      }
    }
    return add.call(this, type, fn, o);
  };
  EventTarget.prototype.removeEventListener = function (type, fn, o) {
    const k = key(this);
    if (k && fn) {
      const set = live.listeners.get(`${k}|${type}|${cap(o)}`);
      if (set) set.delete(fn);
    }
    return rem.call(this, type, fn, o);
  };
  const st = W.setTimeout, ct = W.clearTimeout, si = W.setInterval, ci = W.clearInterval, ra = W.requestAnimationFrame, ca = W.cancelAnimationFrame;
  let seq = 0;
  const where = () => String(new Error().stack || "").split("\n").slice(3, 6).map((l) => l.trim().replace(/^at /, "").replace(/\?v=[^:)]*/g, "").replace(/https?:\/\/[^/]+\//g, "")).join(" < ");
  W.setTimeout = function (fn, ms, ...a) {
    const n = ++seq;
    const id = st.call(W, (...b) => { live.timers.delete(id); if (typeof fn === "function") fn(...b); }, ms, ...a);
    live.timers.set(id, { n, ms, at: where() });
    return id;
  };
  W.clearTimeout = function (id) { live.timers.delete(id); return ct.call(W, id); };
  W.setInterval = function (fn, ms, ...a) {
    const id = si.call(W, fn, ms, ...a);
    live.intervals.set(id, { n: ++seq, ms, at: where() });
    return id;
  };
  W.clearInterval = function (id) { live.intervals.delete(id); return ci.call(W, id); };
  W.requestAnimationFrame = function (fn) {
    const id = ra.call(W, (t) => { live.frames.delete(id); fn(t); });
    live.frames.add(id);
    return id;
  };
  W.cancelAnimationFrame = function (id) { live.frames.delete(id); return ca.call(W, id); };
  const AC = W.AudioContext;
  if (AC) {
    W.AudioContext = function (...a) {
      const c = new AC(...a);
      live.audio.push(c);
      return c;
    };
    W.AudioContext.prototype = AC.prototype;
  }
  W.__probe = {
    mark: () => seq,
    snapshot(since) {
      const listeners = {};
      live.listeners.forEach((set, id) => set.size && (listeners[id] = set.size));
      const pend = (m) => [...m.values()].filter((t) => t.n > since);
      return {
        listeners,
        timers: pend(live.timers),
        intervals: pend(live.intervals),
        frames: live.frames.size,
        audioOpen: live.audio.filter((c) => c.state !== "closed").length,
        canvases: document.querySelectorAll("canvas").length,
        iframes: document.querySelectorAll("iframe").length,
        body: [...document.body.children].map((n) => n.tagName + (n.id ? "#" + n.id : "")).filter((t) => t !== "SCRIPT"),
        bodyClass: document.body.className,
        cookScreen: ["app", "overlay", "coach", "side", "stage"].filter((id) => document.getElementById(id)).length,
        globals: ["Cook", "__cook", "__njgCookLoading"].filter((k) => k in window),
      };
    },
  };
};

const server = await startServer();
const browser = await launch();
try {
  const { page, errors } = await newPage(browser, "1366x768", { seed: 7 });
  await page.addInitScript(PROBE);
  await page.goto(`${BASE}/lab.html?speed=3`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/lab.html?speed=3`, { waitUntil: "load" });
  // the shell's way: load what Cook needs, then import Cook (once per page)
  await page.evaluate(async (needs) => {
    document.querySelectorAll(".lab-note").forEach((n) => n.remove());
    const M = await import("./js/shared/mode.js");
    await M.loadNeeds([{ needs }], { stamp: window.njgV || ((u) => u) });
    window.__cookMount = await import("./js/cook/mount.js");
  }, NEEDS);
  await sleep(1500);
  const since = await page.evaluate(() => __probe.mark());
  const base = await page.evaluate((s) => __probe.snapshot(s), since);
  console.log(`baseline: ${Object.keys(base.listeners).length} page listener kinds, ${base.canvases} canvases, body: ${base.body.join(" ")}`);
  check(base.globals.length === 0, `no Cook global once Cook's modules have loaded (${base.globals.join(", ") || "none"})`);

  const sameListeners = (a, b) => {
    const out = [];
    new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => (a[k] || 0) !== (b[k] || 0) && out.push(`${k}: ${a[k] || 0} -> ${b[k] || 0}`));
    return out;
  };
  for (let i = 1; i <= TIMES; i++) {
    console.log(`mount ${i}`);
    const during = await page.evaluate(async (station) => {
      const el = document.getElementById("lab-stage");
      const t0 = performance.now();
      const cook = await __cookMount.mount(el, { hosted: true, speed: 3 });
      const up = Math.round(performance.now() - t0);
      // a station started and left running (its order card, the coach, its timers), then the child leaves
      cook.Cook.testHook.lab(station, true, { level: 1 }).catch(() => {});
      await new Promise((r) => setTimeout(r, 2500));
      const s = { up, canvases: document.querySelectorAll("canvas").length, screen: !!document.getElementById("app"), running: __cookMount.running(), view: cook.Cook.testHook.state().view };
      __cookMount.unmount();
      return s;
    }, STATION);
    check(during.canvases === base.canvases + 1 && during.screen, `mounted in ${during.up} ms: Cook's screen and one canvas; ${STATION} running (view ${during.view}; Cook's lifetime held ${JSON.stringify(during.running)})`);
    await sleep(1200);
    const after = await page.evaluate((s) => __probe.snapshot(s), since);
    const left = await page.evaluate(() => __cookMount.running());
    const diff = sameListeners(base.listeners, after.listeners);
    check(diff.length === 0, `listeners on the page as before${diff.length ? ": " + diff.join("; ") : ""}`);
    check(after.timers.length === 0, `no timers left${after.timers.length ? ": " + JSON.stringify(after.timers.slice(0, 4)) : ""}`);
    check(after.intervals.length === 0, `no intervals left${after.intervals.length ? ": " + JSON.stringify(after.intervals.slice(0, 4)) : ""}`);
    check(after.frames <= base.frames, `no animation frames left (${after.frames})`);
    check(Object.values(left).every((n) => n === 0), `Cook's lifetime empty (${JSON.stringify(left)})`);
    check(after.canvases === base.canvases && after.cookScreen === 0, `no canvas, no Cook screen (${after.canvases} canvases, ${after.cookScreen} of Cook's ids)`);
    check(after.body.join(" ") === base.body.join(" "), `<body> as before${after.body.join(" ") !== base.body.join(" ") ? ": " + after.body.join(" ") : ""}`);
    check(after.bodyClass === base.bodyClass, `<body> classes as before ("${after.bodyClass}")`);
    check(after.audioOpen === 0, `no audio context left open (${after.audioOpen})`);
    check(after.globals.length === 0 && after.iframes === 0, `no Cook global, no iframe (${after.globals.join(", ") || "none"})`);
  }
  const errs = [...new Set(errors)].filter((e) => !/favicon/.test(e));
  check(errs.length === 0, `no page errors ${errs.length ? JSON.stringify(errs.slice(0, 3)) : ""}`);
} finally {
  await browser.close();
  server.close();
}
console.log(failed ? `cook mount: ${failed} failed` : `cook mount: ${TIMES} mounts, all clean`);
process.exit(failed ? 1 : 0);
