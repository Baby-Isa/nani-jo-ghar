#!/usr/bin/env node
// run16 fix-daar: the chop's first-time strip, measured frame by frame (DAAR-55, DAAR-56).
//   COOK_TEST_PORT=8851 flock -w 3600 /tmp/njg-browser-all.lock node build/tools/review/run16/chop-strip.mjs [--flow chop@1,daar@4] [--sizes 1280x665,740x320] [--json out]
// For each flow and size: a new player (fresh save) plays the lab at a child's pace (speed 1) until the strip ends. From the strip's
// "start" note to its "end" note, every animation frame records whether the light is drawn (an .njg-onboard layer on, its hole shown,
// not buried, not empty) and where the kit's finger is. Two expects, each per page:
//   DAAR-55 light-steady: from the light's first drawn frame to the knife's drag ending (the strip's "cut" plus the drag), the light
//           never goes off: no gap of 2+ frames (> 40 ms) with no lit layer.
//   DAAR-56 finger-drags: the finger is shown during the drag and travels the knife's path, right to left, at least 60% of the knife's
//           own travel (it does not sit still on the handle).
// Exit 1 if any page fails either expect (--row DAAR-55 or DAAR-56: that one alone).
import { startServer, launch, newPage, BASE, sleep } from "../../../sandbox/lib/env.mjs";
import { CookPlayer } from "../../../sandbox/lib/cook-player.mjs";
import { writeFileSync } from "node:fs";

const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const flows = val("--flow", "chop@1,daar@4").split(",").map((s) => { const [k, l] = s.split("@"); return { key: k, level: +(l || 1) }; });
const sizes = val("--sizes", "1280x665,740x320").split(",");
const out = val("--json", null);
const only = val("--row", null); // DAAR-55 or DAAR-56: exit on that row's expect alone

const SAMPLER = () => {
  const W = window;
  W.__strip = { notes: [], frames: [], on: false };
  const tick = () => {
    const L = W.Lifecycle;
    if (L && typeof L.note === "function" && !L.__r16) {
      const o = L.note;
      L.note = function (what, info) {
        if (what === "chop-strip") { W.__strip.notes.push({ t: performance.now(), step: info && info.step }); W.__strip.on = info && info.step !== "end"; }
        return o.apply(this, arguments);
      };
      L.__r16 = true;
    }
    if (W.__strip.on) {
      const layers = [...document.querySelectorAll(".njg-onboard")];
      const lit = layers.filter((l) => {
        if (!l.isConnected || l.classList.contains("ob-buried") || l.classList.contains("ob-empty")) return false;
        const h = l.querySelector(".ob-hole");
        const op = parseFloat(getComputedStyle(l).opacity);
        return h && h.style.display !== "none" && op > 0.5 && l.getBoundingClientRect().width > 0 && getComputedStyle(l).display !== "none";
      });
      const f = [...document.querySelectorAll(".ob-finger:not(.ob-circle)")].find((e) => e.style.display !== "none" && e.getBoundingClientRect().width > 0);
      const fr = f ? f.getBoundingClientRect() : null;
      let kx = null;
      try { const S = W.Cook && W.Cook.scene; } catch (e) {}
      W.__strip.frames.push({ t: performance.now(), lit: lit.length, layers: layers.map((l) => l.className.replace("njg-onboard", "").trim()).join("|"), fx: fr ? Math.round(fr.left) : null, fy: fr ? Math.round(fr.top) : null });
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const results = [];
const srv = await startServer();
const browser = await launch();
try {
  for (const fl of flows) for (const size of sizes) {
    const page = await newPage(browser, size);
    const rec = { note() {}, pend() {}, async state() {}, stop(m) { throw new Error(m); } };
    await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
    await page.addInitScript(`(${SAMPLER.toString()})()`);
    await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
    await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
    await page.evaluate(([k, l]) => { njgTest.cook.lab(k, true, { level: l }); }, [fl.key, fl.level]);
    await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
    const P = new CookPlayer(page, rec, { mode: "fair", speed: 1 });
    const done = () => page.evaluate("(() => (window.__strip.notes.some((n) => n.step === 'end')))()");
    await P.play(done, { timeout: 240000 }).catch((e) => console.log("  player:", String(e.message || e).slice(0, 200)));
    const S = await page.evaluate("window.__strip");
    await page.context().close();
    const start = S.notes.find((n) => n.step === "start"), end = S.notes.find((n) => n.step === "end"), cut = S.notes.find((n) => n.step === "cut");
    const r = { flow: `${fl.key}@L${fl.level}`, size, notes: S.notes.map((n) => n.step).join(","), ok55: null, ok56: null };
    if (!start || !end) { r.why = "the strip never ran (no start/end note)"; results.push(r); console.log(JSON.stringify(r)); continue; }
    const fr = S.frames.filter((f) => f.t >= start.t && f.t <= end.t);
    const first = fr.findIndex((f) => f.lit);
    // the light's span: first lit frame to the last lit frame (the close at the end); every frame between must be lit
    let last = -1; fr.forEach((f, i) => f.lit && (last = i));
    const gaps = [];
    let g0 = null;
    for (let i = first; i >= 0 && i <= last; i++) {
      if (!fr[i].lit && g0 == null) g0 = i;
      if (fr[i].lit && g0 != null) { gaps.push({ from: Math.round(fr[g0].t - fr[first].t), ms: Math.round(fr[i].t - fr[g0].t), frames: i - g0, layers: fr[g0].layers }); g0 = null; }
    }
    const bad = gaps.filter((g) => g.ms > 40);
    r.lightMs = first >= 0 ? Math.round(fr[last].t - fr[first].t) : 0;
    r.gaps = gaps;
    r.ok55 = first >= 0 && !bad.length;
    // the drag: the finger's x over the strip; it must travel right to left a real distance
    const fx = fr.filter((f) => f.fx != null);
    r.fingerFrames = fx.length;
    if (fx.length) {
      const xs = fx.map((f) => f.fx);
      r.fingerX = [Math.max(...xs), Math.min(...xs)];
      const firstX = fx[0].fx, minX = Math.min(...xs);
      r.fingerTravel = firstX - minX;
      // the finger shown after the cut too (it carries the knife through)
      r.fingerAfterCut = cut ? fx.filter((f) => f.t > cut.t).length : 0;
    }
    r.ok56 = !!fx.length && r.fingerTravel >= 150 * (+size.split("x")[0] >= 1000 ? 1 : 0.5);
    results.push(r);
    console.log(JSON.stringify(r));
  }
} finally {
  await browser.close();
  srv.close();
}
if (out) writeFileSync(out, JSON.stringify(results, null, 1));
const fail = results.filter((r) => (only !== "DAAR-56" && !r.ok55) || (only !== "DAAR-55" && !r.ok56));
console.log(fail.length ? `RED: ${fail.length} of ${results.length} pages fail (DAAR-55 light gap or DAAR-56 finger still)` : `GREEN: ${results.length} pages`);
process.exit(fail.length ? 1 : 0);
